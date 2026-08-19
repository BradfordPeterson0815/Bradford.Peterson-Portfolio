import { Browser } from '@playwright/test'
import { DefaultEnvironment, UserTypes } from '../../../library/botpress/bpConstants.js'
import { Initialize, Shutdown } from '../../../library/botpress/bpHelper.js'
import test from '../../../library/botpress/bpTestHooks.js'
import {
  Exterior_DebrisOrTrees_No,
  Exterior_DebrisOrTrees_Yes,
  Exterior_OpenToElements_No,
  Exterior_OpenToElements_Yes,
  Interior_Rooms,
  LiabilityTypes,
  OnBehalfOf,
  OtherStructuresDamageTypes,
  EagleDamageAreaTypes,
  EagleDamageReasonTypes,
  PhysicalDamage_No,
  PhysicalDamage_Yes,
  Plumbing,
  ProvidePolicy_Yes,
  ResidenceNotLivable,
  Roof_HasBeenBreached_Yes,
  UndoText,
  UploadDocuments,
  WaterDamage,
} from '../../../library/botpress/clients/eagle/bpEagleConstants.js'
import {
  GetPolicy,
  GetRandomOnBehalfOfType,
  GetRandomResidenceNotLivableType,
  LaunchEagleFNOLChat,
} from '../../../library/botpress/clients/eagle/bpEagleHelper.js'

const environment = DefaultEnvironment
Initialize(environment)

test('Undo_VerifyUndoList', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  await chat.HandleIntroduction()
  const undo = await chat.ActivateUndo()
  await undo.VerifyUndoAndCancel()
  await Shutdown(global)
})

test('Undo_ReportingInformation_Internal', async ({ browser }) => {
  await Undo_ReportingInformation_Test(browser, UserTypes.Internal)
})

test('Undo_ReportingInformation_Agent', async ({ browser }) => {
  await Undo_ReportingInformation_Test(browser, UserTypes.Agent)
})

test('Undo_ReportingInformation_Insured', async ({ browser }) => {
  await Undo_ReportingInformation_Test(browser, UserTypes.Insured)
})

async function Undo_ReportingInformation_Test(
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
  // const originalPhone = chat.userParams.policy.phoneNumber
  // const originalEmail = chat.userParams.policy.email
  await chat.HandleDefaultUserValidation()
  await chat.HandleUndo(1, UndoText.ReporterInformation)
  // chat.userParams.policy.phoneNumber = originalPhone
  // chat.userParams.policy.email = originalEmail

  chat.userParams.onBehalfOf_Type = Object.values(OnBehalfOf)[GetRandomOnBehalfOfType()]
  chat.userParams.onBehalfOf_FirstName = 'Gladys'
  chat.userParams.onBehalfOf_LastName = 'Kravitz'
  chat.userParams.onBehalfOf_Phone = '203-555-6673'
  chat.userParams.onBehalfOf_PhoneMatch = '+12035556673'
  chat.userParams.onBehalfOf_PhoneExtension = '19'
  chat.userParams.onBehalfOf_Email = 'nosyneighbor@bewitched.com'
  chat.userParams.onBehalfOf_Company = 'McMann & Tate'
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(EagleDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandleContentsOrPersonalPropertyDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('Undo_DamageReason', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(EagleDamageReasonTypes.Wind)
  await chat.HandleUndo(2, UndoText.DamageReason)
  await chat.HandleDamageReason(EagleDamageReasonTypes.Hurricane)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandleContentsOrPersonalPropertyDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_WaterDamageQuestions', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  await chat.HandleDefaultUserValidation()
  chat.userParams.originOfWaterDamage = WaterDamage.Plumbing
  chat.userParams.plumbingType = Plumbing.Sink
  await chat.HandleDamageReason(EagleDamageReasonTypes.Water)
  await chat.HandleUndo(3, UndoText.WaterDamageQuestions)
  chat.userParams.originOfWaterDamage = WaterDamage.HVAC
  await chat.HandleOriginOfWaterDamageFlow()
  await chat.HandleDamageAreas(EagleDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandleContentsOrPersonalPropertyDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_TheftDamageQuestions', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  await chat.HandleDefaultUserValidation()
  chat.userParams.theft_PhysicalDamage = PhysicalDamage_Yes
  chat.userParams.theft_FiledPoliceReport = true
  chat.userParams.theft_Description = 'Precious heirloom tomatoes were taken from my garden'
  chat.userParams.theft_PoliceReportNumber = '1234'
  await chat.HandleDamageReason(EagleDamageReasonTypes.Theft)
  await chat.HandleUndo(3, UndoText.TheftDamageQuestions)
  chat.userParams.theft_PhysicalDamage = PhysicalDamage_No
  chat.userParams.theft_FiledPoliceReport = false
  chat.userParams.theft_Description = 'My sense of safety is gone forever...'
  chat.userParams.theft_PoliceReportNumber = ''
  await chat.HandleTheftDamageFlow()
  await chat.HandleDamageAreas(EagleDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandleContentsOrPersonalPropertyDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_LiabilityLossQuestions', async ({ browser }) => {
  const userType = UserTypes.Internal
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  await chat.HandleDefaultUserValidation()
  chat.liabilityParams.claimant_FirstName = null
  chat.liabilityParams.claimant_LastName = null
  chat.liabilityParams.attorney_FirstName = 'Dewey'
  chat.liabilityParams.attorney_LastName = 'Cheatham'
  await chat.HandleLiabilityFlow(LiabilityTypes.Animal)
  chat.finishParams.stopBeforeSubmit = true
  await chat.HandleUndo(3, UndoText.LiabilityLossQuestions)
  chat.liabilityParams.claimant_FirstName = 'Jon'
  chat.liabilityParams.claimant_LastName = 'Dough'
  chat.liabilityParams.attorney_FirstName = null
  chat.liabilityParams.attorney_LastName = null
  await chat.HandleLiabilityFlow(LiabilityTypes.Injury | LiabilityTypes.Property)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_LossAssessmentQuestions', async ({ browser }) => {
  const userType = UserTypes.Internal
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  await chat.HandleDefaultUserValidation()
  chat.userParams.lossAssessment_DateDelta = 5
  chat.userParams.lossAssessment_Reason = 'Cause HOAs are a pain'
  chat.userParams.lossAssessment_Amount = '2001'
  chat.userParams.lossAssessment_HaveLetter = true
  chat.userParams.lossAssessment_LetterToUpload = UploadDocuments.LossAssessment_PDF
  await chat.HandleDamageReason(EagleDamageReasonTypes.LossAssessment)
  chat.finishParams.stopBeforeSubmit = true
  await chat.HandleDefaultFinish()
  await chat.HandleUndo(3, UndoText.LossAssessmentQuestions)
  chat.userParams.lossAssessment_DateDelta = 1
  chat.userParams.lossAssessment_Reason = `What do you mean I am not allowed to have a car up on blocks out front?`
  chat.userParams.lossAssessment_Amount = '1999'
  chat.userParams.lossAssessment_HaveLetter = false
  chat.userParams.lossAssessment_LetterToUpload = null
  await chat.HandleLossAssessmentFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_DamagedAreas', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(EagleDamageReasonTypes.Wind)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.Interior)
  await chat.HandleInteriorDamageFlow(2)
  await chat.HandleUndo(3, UndoText.DamagedAreas)
  await chat.HandleDamageAreas(
    EagleDamageAreaTypes.Interior | EagleDamageAreaTypes.Exterior
  )
  await chat.HandleExteriorDamageFlow()
  await chat.HandleInteriorDamageFlow()
  chat.finishParams.stopBeforeSubmit = true
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_InteriorDamageQuestions', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(EagleDamageReasonTypes.Wind)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.Interior)
  await chat.HandleInteriorDamageFlow(Interior_Rooms.Rooms_2)
  chat.finishParams.stopBeforeSubmit = true
  await chat.HandleDefaultFinish()
  await chat.HandleUndo(4, UndoText.InteriorDamageQuestions)
  await chat.HandleInteriorDamageFlow(Interior_Rooms.Rooms_3)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_ExteriorDamageQuestions', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(EagleDamageReasonTypes.Wind)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.Exterior)
  await chat.HandleExteriorDamageFlow(Exterior_DebrisOrTrees_No, Exterior_OpenToElements_No)
  chat.finishParams.stopBeforeSubmit = true
  await chat.HandleDefaultFinish()
  await chat.HandleUndo(4, UndoText.ExteriorDamageQuestions)
  await chat.HandleExteriorDamageFlow(Exterior_DebrisOrTrees_Yes, Exterior_OpenToElements_Yes)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_RoofDamageQuestions', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(EagleDamageReasonTypes.Wind)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.Roof)
  await chat.HandleRoofDamageFlow()
  chat.finishParams.stopBeforeSubmit = true
  await chat.HandleDefaultFinish()
  await chat.HandleUndo(4, UndoText.RoofDamageQuestions)
  chat.userParams.roof_BreachedCause = 'It was a plane engine'
  await chat.HandleRoofDamageFlow(Roof_HasBeenBreached_Yes)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_OtherStructuresDamageQuestions', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(EagleDamageReasonTypes.Wind)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Fence)
  chat.finishParams.stopBeforeSubmit = true
  await chat.HandleDefaultFinish()
  await chat.HandleUndo(4, UndoText.OtherStructuresDamageQuestions)
  await chat.HandleOtherStructuresDamageFlow(
    OtherStructuresDamageTypes.Pool | OtherStructuresDamageTypes.Outbuilding
  )
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_AdditionalQuestions', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(EagleDamageReasonTypes.Wind)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Fence)
  chat.finishParams.stopBeforeSubmit = true
  await chat.HandleDefaultFinish()
  await chat.HandleUndo(5, UndoText.AdditionalQuestions)
  chat.finishParams.stopBeforeSubmit = true
  chat.finishParams.haveEstimate = true
  chat.finishParams.estimateToUpload = UploadDocuments.RepairEstimate_JPG
  chat.finishParams.residenceNotLivableType =
    Object.values(ResidenceNotLivable)[GetRandomResidenceNotLivableType()]
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_AddClaimNotes_Internal', async ({ browser }) => {
  await Undo_AddClaimNotes_Test(browser, UserTypes.Internal)
})

test('Undo_AddClaimNotes_Agent', async ({ browser }) => {
  await Undo_AddClaimNotes_Test(browser, UserTypes.Agent)
})

async function Undo_AddClaimNotes_Test(browser: Browser, userType: UserTypes) {
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(EagleDamageReasonTypes.Wind)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Other)
  chat.finishParams.stopBeforeSubmit = true
  await chat.HandleDefaultFinish()
  await chat.HandleUndo(6, UndoText.AddClaimNotes)
  chat.finishParams.stopBeforeSubmit = true
  chat.finishParams.skipBigChunk = true
  chat.finishParams.additionalClaimNotes = 'These are the new notes after Undo'
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}
