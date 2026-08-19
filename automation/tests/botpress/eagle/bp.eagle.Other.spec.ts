import { Browser } from '@playwright/test'
import { DefaultEnvironment, UserTypes } from '../../../library/botpress/bpConstants.js'
import { Initialize, RandomTrueFalse, Shutdown } from '../../../library/botpress/bpHelper.js'
import test from '../../../library/botpress/bpTestHooks.js'
import {
  Attorney_No,
  Attorney_Yes,
  Claimant_No,
  Claimant_Yes,
  EagleDamageAreaTypes,
  HaveAssessmentLetter_No,
  HaveAssessmentLetter_Yes,
  LiabilityTypes,
  OnBehalfOf,
  OtherStructuresDamageTypes,
  EagleDamageReasonTypes,
  PhysicalDamage_No,
  PhysicalDamage_Yes,
  ProvidePolicy_No,
  ProvidePolicy_Yes,
  ResidenceNotLivable,
  UploadDocuments,
  UploadImageOptions,
  UploadImages,
  EagleOnBehalfOfTypes,
} from '../../../library/botpress/clients/eagle/bpEagleConstants.js'
import {
  GetPolicy,
  GetRandomOnBehalfOfType,
  GetRandomResidenceNotLivableType,
  LaunchEagleFNOLChat,
} from '../../../library/botpress/clients/eagle/bpEagleHelper.js'

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
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    providePolicy,
    userType
  )
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  chat.userParams.onBehalfOf_Type = Object.values(OnBehalfOf)[GetRandomOnBehalfOfType()]
  chat.userParams.onBehalfOf_FirstName = 'Gladys'
  chat.userParams.onBehalfOf_LastName = 'Kravitz'
  chat.userParams.onBehalfOf_Phone = '203-555-6673'
  chat.userParams.onBehalfOf_PhoneMatch = '+12035556673'
  chat.userParams.onBehalfOf_PhoneExtension = '9876'
  chat.userParams.onBehalfOf_Email = 'nosyneighbor@bewitched.com'
  chat.userParams.onBehalfOf_Company = 'McMann & Tate'
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(EagleDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandleContentsOrPersonalPropertyDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('ReportingForOther_Insured', async ({ browser }) => {
  await ReportingForOther_Test(browser, UserTypes.Insured)
})

test('ReportingForOther_Internal', async ({ browser }) => {
  await ReportingForOther_Test(browser, UserTypes.Internal)
})

test('ReportingForOther_Agent', async ({ browser }) => {
  await ReportingForOther_Test(browser, UserTypes.Agent)
})

async function ReportingForOther_Test(
  browser: Browser,
  userType: UserTypes,
  providePolicy: boolean = ProvidePolicy_Yes
) {
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    providePolicy,
    userType
  )
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  chat.userParams.onBehalfOf_Type = Object.values(OnBehalfOf)[EagleOnBehalfOfTypes.Other]
  chat.userParams.onBehalfOf_FirstName = 'First'
  chat.userParams.onBehalfOf_LastName = 'Cousin'
  chat.userParams.onBehalfOf_Phone = '203-555-6673'
  chat.userParams.onBehalfOf_PhoneMatch = '+12035556673'
  chat.userParams.onBehalfOf_PhoneExtension = '4567'
  chat.userParams.onBehalfOf_Email = 'thecuz@relative.com'
  chat.userParams.onBehalfOf_Company = ''
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(EagleDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandleContentsOrPersonalPropertyDamageFlow()
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
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    providePolicy,
    userType
  )
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(EagleDamageAreaTypes.Interior)
  await chat.HandleInteriorDamageFlow()
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
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_No,
    userType
  )
  chat.userParams.policyNumberWasProvided = false
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(EagleDamageAreaTypes.Exterior)
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
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    providePolicy,
    userType
  )
  chat.userParams.policyNumberWasProvided = providePolicy
  chat.userParams.lossAssessment_DateDelta = 1
  chat.userParams.lossAssessment_WeatherRelated = RandomTrueFalse()
  chat.userParams.lossAssessment_Reason = 'Cause HOAs are a pain'
  chat.userParams.lossAssessment_Amount = '2001'
  chat.userParams.lossAssessment_HaveLetter = haveAssessmentLetter
  chat.userParams.lossAssessment_LetterToUpload = assessmentLetterToUpload
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(EagleDamageReasonTypes.LossAssessment)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('Theft_OnPremises_PhysicalDamage_Yes', async ({ browser }) => {
  await Theft_OnPremises_Test(browser, UserTypes.Insured, PhysicalDamage_Yes)
})

test('Theft_OnPremises_PhysicalDamage_No', async ({ browser }) => {
  await Theft_OnPremises_Test(browser, UserTypes.Insured, PhysicalDamage_No)
})

async function Theft_OnPremises_Test(
  browser: Browser,
  userType: UserTypes,
  physicalDamage = false
) {
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  chat.userParams.theft_OnPremises = true
  chat.userParams.theft_PhysicalDamage = physicalDamage
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(EagleDamageReasonTypes.Theft)
  await chat.HandleDamageAreas(
    EagleDamageAreaTypes.Exterior | EagleDamageAreaTypes.OtherStructures
  )
  await chat.HandleExteriorDamageFlow()
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Fence)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('Theft_OffPremises', async ({ browser }) => {
  await Theft_OffPremises_Test(browser, UserTypes.Insured)
})

async function Theft_OffPremises_Test(browser: Browser, userType: UserTypes) {
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  chat.userParams.theft_OnPremises = false
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(EagleDamageReasonTypes.Theft)
  await chat.HandleDamageAreas(
    EagleDamageAreaTypes.Exterior | EagleDamageAreaTypes.OtherStructures
  )
  await chat.HandleExteriorDamageFlow()
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Fence)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('UploadImages_NoCamera', async ({ browser }) => {
  await UploadImages_Test(browser, UserTypes.Insured, UploadImageOptions.NoCameraAvailable)
})

test('UploadImages_Cancel', async ({ browser }) => {
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
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    providePolicy,
    userType
  )
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(EagleDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandleContentsOrPersonalPropertyDamageFlow()
  chat.finishParams.imagesToUpload = [UploadImages.Crow, UploadImages.MST3K]
  chat.finishParams.uploadImagesFlow = uploadImagesFlow
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('Liability_Property', async ({ browser }) => {
  const liabilities = LiabilityTypes.Property
  await Liability_Test(liabilities, Claimant_No, Attorney_No, browser, UserTypes.Internal)
})

test('Liability_Animal_Claimant', async ({ browser }) => {
  const liabilities = LiabilityTypes.Animal
  await Liability_Test(liabilities, Claimant_Yes, Attorney_No, browser, UserTypes.Internal)
})

test('Liability_Injury_Attorney', async ({ browser }) => {
  const liabilities = LiabilityTypes.Injury
  await Liability_Test(liabilities, Claimant_No, Attorney_Yes, browser, UserTypes.Internal)
})

test('Liability_Other', async ({ browser }) => {
  const liabilities = LiabilityTypes.Other
  await Liability_Test(liabilities, Claimant_No, Attorney_No, browser, UserTypes.Internal)
})

test('Liability_All_Claimant_Attorney', async ({ browser }) => {
  const liabilities =
    LiabilityTypes.Property | LiabilityTypes.Animal | LiabilityTypes.Injury | LiabilityTypes.Other
  await Liability_Test(liabilities, Claimant_Yes, Attorney_Yes, browser, UserTypes.Internal)
})

async function Liability_Test(
  liabilites: number,
  claimant: boolean,
  attorney: boolean,
  browser: Browser,
  userType: UserTypes,
  providePolicy = ProvidePolicy_Yes
) {
  const policy = GetPolicy(userType)

  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    providePolicy,
    userType
  )
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  await chat.HandleDefaultUserValidation()
  if (claimant) {
    chat.liabilityParams.claimant_FirstName = 'Jon'
    chat.liabilityParams.claimant_LastName = 'Dough'
  }
  if (attorney) {
    chat.liabilityParams.attorney_FirstName = 'Dewey'
    chat.liabilityParams.attorney_LastName = 'Cheatham'
  }
  await chat.HandleLiabilityFlow(liabilites)
  chat.finishParams.skipBigChunk = true
  chat.finishParams.skipEstimateForRepairs = true
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}
