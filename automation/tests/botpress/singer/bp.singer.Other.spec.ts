import { Browser, expect } from '@playwright/test'
import { DefaultEnvironment, UserTypes } from '../../../library/botpress/bpConstants.js'
import { Initialize, Shutdown } from '../../../library/botpress/bpHelper.js'
import test from '../../../library/botpress/bpTestHooks.js'
import {
  Attorney_No,
  Attorney_Yes,
  Claimant_No,
  Claimant_Yes,
  FNOLServerPrompts,
  HaveAssessmentLetter_No,
  HaveAssessmentLetter_Yes,
  HaveEstimate_No,
  HaveEstimate_Yes,
  InteriorDamage,
  LiabilityTypes,
  OnBehalfOf,
  OtherStructuresDamageTypes,
  PhysicalDamage_No,
  PhysicalDamage_Yes,
  ProvidePolicy_No,
  ProvidePolicy_Yes,
  ResidenceNotLivable,
  SingerDamageAreaTypes,
  SingerDamageReasonTypes,
  SingerInteriorDamageTypes,
  UploadDocuments,
  UploadImageOptions,
  UploadImages,
} from '../../../library/botpress/clients/singer/bpSingerConstants.js'
import {
  GetPolicy,
  GetRandomOnBehalfOfType,
  GetRandomResidenceNotLivableType,
  LaunchSingerFNOLChat,
} from '../../../library/botpress/clients/singer/bpSingerHelper.js'

const environment = DefaultEnvironment
Initialize(environment)

test('ReportingFor_Insured', async ({ browser }) => {
  await ReportingFor_Test(browser, UserTypes.Insured)
})

test('ReportingFor_Internal', async ({ browser }) => {
  await ReportingFor_Test(browser, UserTypes.Internal)
})

test('ReportingFor_Agent', async ({ browser }) => {
  await ReportingFor_Test(browser, UserTypes.Agent)
})

test('ReportingFor_NotSpecified', async ({ browser }) => {
  await ReportingFor_Test(browser, UserTypes.NotSpecified, ProvidePolicy_No)
})

async function ReportingFor_Test(
  browser: Browser,
  userType: UserTypes,
  providePolicy: boolean = ProvidePolicy_Yes
) {
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, providePolicy, userType)
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  chat.userParams.onBehalfOf_Type = Object.values(OnBehalfOf)[GetRandomOnBehalfOfType()]
  chat.userParams.onBehalfOf_FullName = 'Gladys Kravitz'
  chat.userParams.onBehalfOf_Phone = '2035556673'
  chat.userParams.onBehalfOf_Email = 'nosyneighbor@bewitched.com'
  chat.userParams.onBehalfOf_Company = 'McMann & Tate'
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(SingerDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandlePersonalPropertyDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('NotSafeToRemain_Insured', async ({ browser }) => {
  await NotSafeToRemain_Test(browser, UserTypes.Insured)
})

test('NotSafeToRemain_Internal', async ({ browser }) => {
  await NotSafeToRemain_Test(browser, UserTypes.Internal)
})

test('NotSafeToRemain_Agent', async ({ browser }) => {
  await NotSafeToRemain_Test(browser, UserTypes.Agent)
})

test('NotSafeToRemain_NotSpecified', async ({ browser }) => {
  await NotSafeToRemain_Test(browser, UserTypes.NotSpecified, ProvidePolicy_No)
})

async function NotSafeToRemain_Test(
  browser: Browser,
  userType: UserTypes,
  providePolicy: boolean = ProvidePolicy_Yes
) {
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, providePolicy, userType)
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(SingerDamageAreaTypes.Interior)
  await chat.HandleInteriorDamageFlow(SingerInteriorDamageTypes.ElectricalIssues)
  chat.finishParams.residenceNotLivableType =
    Object.values(ResidenceNotLivable)[GetRandomResidenceNotLivableType()]
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('PolicyEnteredNotPassed_Insured', async ({ browser }) => {
  await PolicyEnteredNotPassed_Test(browser, UserTypes.Insured)
})

test('PolicyEnteredNotPassed_Internal', async ({ browser }) => {
  await PolicyEnteredNotPassed_Test(browser, UserTypes.Internal)
})

test('PolicyEnteredNotPassed_Agent', async ({ browser }) => {
  await PolicyEnteredNotPassed_Test(browser, UserTypes.Agent)
})

test('PolicyEnteredNotPassed_NotSpecified', async ({ browser }) => {
  await PolicyEnteredNotPassed_Test(browser, UserTypes.NotSpecified)
})

async function PolicyEnteredNotPassed_Test(browser: Browser, userType: UserTypes) {
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_No, userType)
  chat.userParams.policyNumberWasProvided = false
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(SingerDamageAreaTypes.Exterior)
  await chat.HandleExteriorDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('LossAssessment_NoLetter', async ({ browser }) => {
  await LossAssessment_Test(
    browser,
    UserTypes.NotSpecified,
    HaveAssessmentLetter_No,
    null,
    ProvidePolicy_No
  )
})

test('LossAssessment_LetterAndNoUpload', async ({ browser }) => {
  await LossAssessment_Test(browser, UserTypes.Insured, HaveAssessmentLetter_Yes)
})

test('LossAssessment_LetterAndUploadJPG', async ({ browser }) => {
  await LossAssessment_Test(
    browser,
    UserTypes.Internal,
    HaveAssessmentLetter_Yes,
    UploadDocuments.LossAssessment_JPG
  )
})

test('LossAssessment_LetterAndUploadPDF', async ({ browser }) => {
  await LossAssessment_Test(
    browser,
    UserTypes.Agent,
    HaveAssessmentLetter_Yes,
    UploadDocuments.LossAssessment_PDF
  )
})

async function LossAssessment_Test(
  browser: Browser,
  userType: UserTypes,
  haveAssessmentLetter = false,
  assessmentLetterToUpload: null | string = null,
  providePolicy: boolean = ProvidePolicy_Yes
) {
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, providePolicy, userType)
  chat.userParams.policyNumberWasProvided = providePolicy
  chat.userParams.lossAssessment_DateDelta = 1
  chat.userParams.lossAssessment_Reason = 'Cause HOAs are a pain'
  chat.userParams.lossAssessment_Amount = '2001'
  chat.userParams.lossAssessment_HaveLetter = haveAssessmentLetter
  chat.userParams.lossAssessment_LetterToUpload = assessmentLetterToUpload
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(SingerDamageReasonTypes.LossAssessment)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('EstimateForRepair_NoEstimate', async ({ browser }) => {
  await EstimateForRepair_Test(
    browser,
    UserTypes.NotSpecified,
    HaveEstimate_No,
    null,
    ProvidePolicy_No
  )
})

test('EstimateForRepair_EstimateAndNoUpload', async ({ browser }) => {
  await EstimateForRepair_Test(browser, UserTypes.Insured, HaveEstimate_Yes)
})

test('EstimateForRepair_EstimateAndUploadJPG', async ({ browser }) => {
  await EstimateForRepair_Test(
    browser,
    UserTypes.Internal,
    HaveEstimate_Yes,
    UploadDocuments.RepairEstimate_JPG
  )
})

test('EstimateForRepair_EstimateAndUploadPDF', async ({ browser }) => {
  await EstimateForRepair_Test(
    browser,
    UserTypes.Internal,
    HaveEstimate_Yes,
    UploadDocuments.RepairEstimate_PDF
  )
})

async function EstimateForRepair_Test(
  browser: Browser,
  userType: UserTypes,
  haveEstimate: boolean = false,
  estimateToUpload: null | string = null,
  providePolicy: boolean = ProvidePolicy_Yes
) {
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, providePolicy, userType)
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(SingerDamageAreaTypes.Exterior)
  await chat.HandleExteriorDamageFlow()
  chat.finishParams.haveEstimate = haveEstimate
  chat.finishParams.estimateToUpload = estimateToUpload
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('Theft_PhysicalDamage_Yes', async ({ browser }) => {
  await Theft_Test(browser, UserTypes.Insured, PhysicalDamage_Yes)
})

test('Theft_PhysicalDamage_No', async ({ browser }) => {
  await Theft_Test(browser, UserTypes.Insured, PhysicalDamage_No)
})

async function Theft_Test(browser: Browser, userType: UserTypes, physicalDamage = false) {
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_Yes, userType)
  chat.userParams.theft_PhysicalDamage = physicalDamage
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(SingerDamageReasonTypes.Theft)
  await chat.HandleDamageAreas(SingerDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Fence)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('UploadImages_NoCamera_Insured', async ({ browser }) => {
  await UploadImages_Test(browser, UserTypes.Insured, UploadImageOptions.NoCameraAvailable)
})

test('UploadImages_Cancel_Insured', async ({ browser }) => {
  await UploadImages_Test(browser, UserTypes.Insured, UploadImageOptions.Cancel)
})

test('UploadImages_Insured', async ({ browser }) => {
  await UploadImages_Test(browser, UserTypes.Insured, UploadImageOptions.Upload)
})

test('UploadImages_NotSpecified', async ({ browser }) => {
  await UploadImages_Test(
    browser,
    UserTypes.NotSpecified,
    UploadImageOptions.Upload,
    ProvidePolicy_No
  )
})

async function UploadImages_Test(
  browser: Browser,
  userType: UserTypes,
  uploadImagesFlow: UploadImageOptions,
  providePolicy: boolean = ProvidePolicy_Yes
) {
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, providePolicy, userType)
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(SingerDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandlePersonalPropertyDamageFlow()
  chat.finishParams.imagesToUpload = [UploadImages.Crow, UploadImages.MST3K]
  chat.finishParams.uploadImagesFlow = uploadImagesFlow
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('NoneInteriorDamageTypeIsMutuallyExclusive_Test', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_Yes, userType)
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(SingerDamageAreaTypes.Interior)
  await chat.CheckServerPrompt(FNOLServerPrompts.IsThereAnyOtherDamageInTheHome, 1)

  const waterLocator = chat.page
    .frameLocator('#bp-widget')
    .locator(`.bpw-keyboard .multiselect label[for="${InteriorDamage.WaterDamage.id}"]`)
  const smokeLocator = chat.page
    .frameLocator('#bp-widget')
    .locator(`.bpw-keyboard .multiselect label[for="${InteriorDamage.SmokeDamage.id}"]`)
  const noneLocator = chat.page
    .frameLocator('#bp-widget')
    .locator(`.bpw-keyboard .multiselect label[for="${InteriorDamage.None.id}"]`)

  // Select Water
  await waterLocator.click()
  expect(await waterLocator.isChecked()).toBe(true)
  expect(await noneLocator.isChecked()).toBe(false)

  // Select None - should uncheck water
  await noneLocator.click()
  expect(await waterLocator.isChecked()).toBe(false)
  expect(await noneLocator.isChecked()).toBe(true)

  // Select Smoke - should uncheck None
  await smokeLocator.click()
  expect(await smokeLocator.isChecked()).toBe(true)
  expect(await noneLocator.isChecked()).toBe(false)

  await Shutdown(global)
})

test('Liability_Property', async ({ browser }) => {
  const liabilities = LiabilityTypes.Property
  await Liability_Test(liabilities, Claimant_No, Attorney_No, browser, UserTypes.Internal)
})

test('Liability_Animal_Claimant', async ({ browser }) => {
  const liabilities = LiabilityTypes.Animal
  await Liability_Test(liabilities, Claimant_Yes, Attorney_No, browser, UserTypes.Agent)
})

test('Liability_Injury_Attorney', async ({ browser }) => {
  const liabilities = LiabilityTypes.Injury
  await Liability_Test(liabilities, Claimant_No, Attorney_Yes, browser, UserTypes.Insured)
})

test('Liability_Other', async ({ browser }) => {
  const liabilities = LiabilityTypes.Other
  await Liability_Test(liabilities, Claimant_No, Attorney_No, browser, UserTypes.Internal)
})

test('Liability_All_Claimant_Attorney', async ({ browser }) => {
  const liabilities =
    LiabilityTypes.Property | LiabilityTypes.Animal | LiabilityTypes.Injury | LiabilityTypes.Other
  await Liability_Test(
    liabilities,
    Claimant_Yes,
    Attorney_Yes,
    browser,
    UserTypes.NotSpecified,
    ProvidePolicy_No
  )
})

async function Liability_Test(
  liabilites: number,
  claimant: boolean,
  attorney: boolean,
  browser: Browser,
  userType: UserTypes,
  providePolicy: boolean = ProvidePolicy_Yes
) {
  const policy = GetPolicy(userType)

  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, providePolicy, userType)
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  await chat.HandleDefaultUserValidation()
  if (claimant) {
    chat.liabilityParams.claimant_FullName = 'Jon Dough'
  }
  if (attorney) {
    chat.liabilityParams.attorney_FullName = 'Dewey Cheatham'
  }
  await chat.HandleLiabilityFlow(liabilites)
  chat.finishParams.skipBigChunk = true
  chat.finishParams.skipEstimateForRepairs = true
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}
