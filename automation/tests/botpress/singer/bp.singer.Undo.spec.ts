import { Browser } from '@playwright/test'
import { DefaultEnvironment, UserTypes } from '../../../library/botpress/bpConstants.js'
import { Initialize, Shutdown } from '../../../library/botpress/bpHelper.js'
import test from '../../../library/botpress/bpTestHooks.js'
import {
  Exterior_DebrisOrTrees_No,
  Exterior_DebrisOrTrees_Yes,
  Exterior_OpenToElements_No,
  Exterior_OpenToElements_Yes,
  LiabilityTypes,
  OnBehalfOf,
  OtherStructuresDamageTypes,
  PhysicalDamage_No,
  PhysicalDamage_Yes,
  Plumbing,
  ProvidePolicy_Yes,
  ResidenceNotLivable,
  SingerDamageAreaTypes,
  SingerDamageReasonTypes,
  SingerInteriorDamageTypes,
  UndoText,
  UploadDocuments,
  WaterDamage,
} from '../../../library/botpress/clients/singer/bpSingerConstants.js'
import {
  GetPolicy,
  GetRandomOnBehalfOfType,
  GetRandomResidenceNotLivableType,
  LaunchSingerFNOLChat,
} from '../../../library/botpress/clients/singer/bpSingerHelper.js'

const environment = DefaultEnvironment
Initialize(environment)

test('Undo_VerifyUndoList', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_Yes, userType)
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
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, providePolicy, userType)
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }

  await chat.HandleDefaultUserValidation()
  await chat.HandleUndo(1, UndoText.ReporterInformation)

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

test('Undo_DamageReason', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_Yes, userType)
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(SingerDamageReasonTypes.Wind)
  await chat.HandleUndo(2, UndoText.DamageReason)
  await chat.HandleDamageReason(SingerDamageReasonTypes.Hurricane)
  await chat.HandleDamageAreas(SingerDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandlePersonalPropertyDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_WaterDamageQuestions', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_Yes, userType)
  await chat.HandleDefaultUserValidation()
  chat.userParams.originOfWaterDamage = WaterDamage.Plumbing
  chat.userParams.plumbingType = Plumbing.Sink
  await chat.HandleDamageReason(SingerDamageReasonTypes.Water)
  await chat.HandleUndo(3, UndoText.WaterDamageQuestions)
  chat.userParams.originOfWaterDamage = WaterDamage.Freezing
  await chat.HandleOriginOfWaterDamageFlow()
  await chat.HandleDamageAreas(SingerDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandlePersonalPropertyDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_TheftDamageQuestions', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_Yes, userType)
  await chat.HandleDefaultUserValidation()
  chat.userParams.theft_PhysicalDamage = PhysicalDamage_Yes
  await chat.HandleDamageReason(SingerDamageReasonTypes.Theft)
  await chat.HandleUndo(3, UndoText.TheftDamageQuestions)
  chat.userParams.theft_PhysicalDamage = PhysicalDamage_No
  await chat.HandleTheftDamageFlow()
  await chat.HandleDamageAreas(SingerDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandlePersonalPropertyDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_LiabilityLossQuestions', async ({ browser }) => {
  const userType = UserTypes.Internal
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_Yes, userType)
  await chat.HandleDefaultUserValidation()
  chat.liabilityParams.claimant_FullName = null
  chat.liabilityParams.attorney_FullName = 'Dewey Cheatham'
  await chat.HandleLiabilityFlow(LiabilityTypes.Animal)
  await chat.HandleUndo(3, UndoText.LiabilityLossQuestions)
  chat.liabilityParams.claimant_FullName = 'Jon Dough'
  chat.liabilityParams.attorney_FullName = null
  await chat.HandleLiabilityFlow(LiabilityTypes.Injury | LiabilityTypes.Property)
  chat.finishParams.skipBigChunk = true
  chat.finishParams.skipEstimateForRepairs = true
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_LossAssessmentQuestions', async ({ browser }) => {
  const userType = UserTypes.Internal
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_Yes, userType)
  await chat.HandleDefaultUserValidation()
  chat.userParams.lossAssessment_DateDelta = 5
  chat.userParams.lossAssessment_Reason = 'Cause HOAs are a pain'
  chat.userParams.lossAssessment_Amount = '2001'
  chat.userParams.lossAssessment_HaveLetter = true
  chat.userParams.lossAssessment_LetterToUpload = UploadDocuments.LossAssessment_PDF
  await chat.HandleDamageReason(SingerDamageReasonTypes.LossAssessment)
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
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_Yes, userType)
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(SingerDamageReasonTypes.Wind)
  await chat.HandleDamageAreas(SingerDamageAreaTypes.Interior)
  await chat.HandleInteriorDamageFlow(SingerInteriorDamageTypes.WaterDamage)
  await chat.HandleUndo(3, UndoText.DamagedAreas)
  await chat.HandleDamageAreas(SingerDamageAreaTypes.Interior | SingerDamageAreaTypes.Exterior)
  await chat.HandleInteriorDamageFlow(SingerInteriorDamageTypes.ElectricalIssues)
  await chat.HandleExteriorDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_InteriorDamageQuestions', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_Yes, userType)
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(SingerDamageReasonTypes.Wind)
  await chat.HandleDamageAreas(SingerDamageAreaTypes.Interior)
  await chat.HandleInteriorDamageFlow(SingerInteriorDamageTypes.ElectricalIssues)
  await chat.HandleDefaultFinish()
  await chat.HandleUndo(4, UndoText.InteriorDamageQuestions)
  await chat.HandleInteriorDamageFlow(SingerInteriorDamageTypes.FireDamage)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_ExteriorDamageQuestions', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_Yes, userType)
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(SingerDamageReasonTypes.Wind)
  await chat.HandleDamageAreas(SingerDamageAreaTypes.Exterior)
  await chat.HandleExteriorDamageFlow(Exterior_DebrisOrTrees_No, Exterior_OpenToElements_No)
  await chat.HandleDefaultFinish()
  await chat.HandleUndo(4, UndoText.ExteriorDamageQuestions)
  await chat.HandleExteriorDamageFlow(Exterior_DebrisOrTrees_Yes, Exterior_OpenToElements_Yes)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_RoofDamageQuestions', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_Yes, userType)
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(SingerDamageReasonTypes.Wind)
  await chat.HandleDamageAreas(SingerDamageAreaTypes.Roof)
  await chat.HandleRoofDamageFlow()
  await chat.HandleDefaultFinish()
  await chat.HandleUndo(4, UndoText.RoofDamageQuestions)
  await chat.HandleRoofDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Undo_OtherStructuresDamageQuestions', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_Yes, userType)
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(SingerDamageReasonTypes.Wind)
  await chat.HandleDamageAreas(SingerDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Fence)
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
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_Yes, userType)
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(SingerDamageReasonTypes.Wind)
  await chat.HandleDamageAreas(SingerDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Fence)
  await chat.HandleDefaultFinish()
  await chat.HandleUndo(5, UndoText.AdditionalQuestions)
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
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_Yes, userType)
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(SingerDamageReasonTypes.Wind)
  await chat.HandleDamageAreas(SingerDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Other)
  await chat.HandleDefaultFinish()
  await chat.HandleUndo(6, UndoText.AddClaimNotes)
  chat.finishParams.skipBigChunk = true
  chat.finishParams.skipEstimateForRepairs = true
  chat.finishParams.additionalClaimNotes = 'These are the new notes after Undo'
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('Undo_UnavailableAfterSubmit', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_Yes, userType)
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(SingerDamageReasonTypes.Wind)
  await chat.HandleDamageAreas(SingerDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Fence)
  chat.finishParams.stopBeforeSubmit = false
  await chat.HandleDefaultFinish()
  await chat.VerifyUndoIsNotAvailable()
})
