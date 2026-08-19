import { Browser, test } from '@playwright/test'
import { UserTypes } from '../../../library/botpress/bpConstants.js'
import { Initialize, Shutdown } from '../../../library/botpress/bpHelper.js'
import {
  GetMitigationPolicy,
  GetMitigationVendor,
  LaunchEagleFNOLChat,
} from '../../../library/botpress/clients/eagle/bpEagleHelper.js'
import {
  EagleDamageAreaTypes,
  EagleDamageReasonTypes,
  Interior_Rooms,
  MitigationVendors,
  OtherStructuresDamageTypes,
  ProvidePolicy_Yes,
} from '../../../library/botpress/clients/eagle/bpEagleConstants.js'
import { BotpressEnvironmentType } from '../../../library/shared/constants.js'

const environment = BotpressEnvironmentType.devenv
Initialize(environment)
const AcceptMitigation_Yes = true
const AcceptMitigation_No = false

test('VerifyMitigation_Accept_Company_Insured', async ({ browser }) => {
  await VerifyMitigation_Test(
    browser,
    UserTypes.Insured,
    MitigationVendors.Company,
    AcceptMitigation_Yes
  )
})

test('VerifyMitigation_Accept_Company_Internal', async ({ browser }) => {
  await VerifyMitigation_Test(
    browser,
    UserTypes.Internal,
    MitigationVendors.Company,
    AcceptMitigation_Yes
  )
})

test('VerifyMitigation_Accept_Company_Agent', async ({ browser }) => {
  await VerifyMitigation_Test(
    browser,
    UserTypes.Agent,
    MitigationVendors.Company,
    AcceptMitigation_Yes
  )
})

test('VerifyMitigation_Reject_Company_Insured', async ({ browser }) => {
  await VerifyMitigation_Test(
    browser,
    UserTypes.Insured,
    MitigationVendors.Company,
    AcceptMitigation_No
  )
})

test('VerifyMitigation_Reject_Company_Internal', async ({ browser }) => {
  await VerifyMitigation_Test(
    browser,
    UserTypes.Internal,
    MitigationVendors.Company,
    AcceptMitigation_No
  )
})

test('VerifyMitigation_Reject_Company_Agent', async ({ browser }) => {
  await VerifyMitigation_Test(
    browser,
    UserTypes.Agent,
    MitigationVendors.Company,
    AcceptMitigation_No
  )
})

async function VerifyMitigation_Test(
  browser: Browser,
  userType: UserTypes,
  expectedMitigationVendor: MitigationVendors,
  acceptMitigation = false
) {
  const policy = GetMitigationPolicy(expectedMitigationVendor)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  await chat.HandleDefaultUserValidation()

  // lossType = [WATER, WATER DAMAGE TO ROOF,SINKHOLE] - OR - // lossType = [WIND,HURRICANE,HAIL] AND isRoofDamageVisible from fnol is true AND isRoofBreached from fnol is true
  const calculatedMitigationVendor = GetMitigationVendor(expectedMitigationVendor)
  await chat.HandleDamageReason(policy.damageReason as EagleDamageReasonTypes)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Other)
  chat.finishParams.stopBeforeSubmit = false // we want to submit the claim..
  chat.finishParams.expectMitigation = true // we DO expect to get offered mitigation
  chat.finishParams.mitigationVendors.push(calculatedMitigationVendor)
  chat.finishParams.acceptMitigation = acceptMitigation
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('VerifyMitigationOfferedForComplexRule', async ({ browser }) => {
  const policy = GetMitigationPolicy(MitigationVendors.LittleFiresEverywhere)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    UserTypes.Insured
  )
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(policy.damageReason as EagleDamageReasonTypes)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.Interior)
  await chat.HandleInteriorDamageFlow(Interior_Rooms.Rooms_4)
  chat.finishParams.stopBeforeSubmit = false // we want to submit the claim..
  chat.finishParams.expectMitigation = true // we DO expect to get offered mitigation
  chat.finishParams.mitigationVendors.push(
    GetMitigationVendor(MitigationVendors.LittleFiresEverywhere)
  )
  chat.finishParams.acceptMitigation = AcceptMitigation_No
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Mitigation_NotOffered_NotInServiceArea', async ({ browser }) => {
  // Setup FNOL that matches ReportHateCrimes rules but is in an excluded county
  const policy = GetMitigationPolicy(MitigationVendors.ReportHateCrimes)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    UserTypes.Insured
  )
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(policy.damageReason as EagleDamageReasonTypes)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Other)
  chat.finishParams.stopBeforeSubmit = false // we want to submit the claim..
  chat.finishParams.expectMitigation = false // we do NOT expect to get offered mitigation
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Mitigation_NotOffered_NoLossMatch', async ({ browser }) => {
  // Setup FNOL that matches Company Restoration rules except the loss type
  const policy = GetMitigationPolicy(MitigationVendors.Company)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    UserTypes.Insured
  )
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(EagleDamageReasonTypes.Theft)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Other)
  chat.finishParams.stopBeforeSubmit = false // we want to submit the claim..
  chat.finishParams.expectMitigation = false // we do NOT expect to get offered mitigation
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Mitigation_NotOffered_NoDamageAreaMatch', async ({ browser }) => {
  // Setup FNOL that matches LittleFiresEverywhere rules except the damage area - match should be Exterior to qualify
  const policy = GetMitigationPolicy(MitigationVendors.LittleFiresEverywhere)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    UserTypes.Insured
  )
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(policy.damageReason as EagleDamageReasonTypes)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Other)
  chat.finishParams.stopBeforeSubmit = false // we want to submit the claim..
  chat.finishParams.expectMitigation = false // we do NOT expect to get offered mitigation
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Mitigation_NotOffered_NoSpecificDamageMatch', async ({ browser }) => {
  // Setup FNOL that matches LittleFiresEverywhere rules except the specific damage match - match should be Interior and 4 rooms
  const policy = GetMitigationPolicy(MitigationVendors.LittleFiresEverywhere)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    UserTypes.Insured
  )
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(policy.damageReason as EagleDamageReasonTypes)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.Interior)
  await chat.HandleInteriorDamageFlow(Interior_Rooms.Rooms_3)
  chat.finishParams.stopBeforeSubmit = false // we want to submit the claim..
  chat.finishParams.expectMitigation = false // we do NOT expect to get offered mitigation
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Mitigation_NotOffered_ForDisabledVendor', async ({ browser }) => {
  // Setup FNOL that matches WouldIfICould rules but the vendor is disabled
  const policy = GetMitigationPolicy(MitigationVendors.WouldIfICould)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    UserTypes.Insured
  )
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(policy.damageReason as EagleDamageReasonTypes)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Other)
  chat.finishParams.stopBeforeSubmit = false // we want to submit the claim..
  chat.finishParams.expectMitigation = false // we do NOT expect to get offered mitigation
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('Mitigation_NotOffered_ForDisabledServiceArea', async ({ browser }) => {
  // Setup FNOL that matches ReportHateCrimes but the matching SA is disabled
  const policy = GetMitigationPolicy(MitigationVendors.ReportHateCrimes)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    UserTypes.Insured
  )
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(policy.damageReason as EagleDamageReasonTypes)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Other)
  chat.finishParams.stopBeforeSubmit = false // we want to submit the claim..
  chat.finishParams.expectMitigation = false // we do NOT expect to get offered mitigation
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test.skip('VerifyMitigationCapacity', async ({ browser }) => {
  const policy = GetMitigationPolicy(MitigationVendors.CapacityLuigi)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    UserTypes.Insured
  )
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(policy.damageReason as EagleDamageReasonTypes)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Other)
  chat.finishParams.stopBeforeSubmit = false // we want to submit the claim..
  chat.finishParams.expectMitigation = false // we do NOT expect to get offered mitigation
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test.skip('TestLoop', async ({ browser }) => {
  const dateDelta = 4
  for (let counter = 0; counter < 4; counter++) {
    const result = await VerifyMitigationCapacityLoop(dateDelta + counter, browser)
    const x = result
    console.debug(x)
  }
})

async function VerifyMitigationCapacityLoop(dateDelta: number, browser: Browser) {
  const policy = GetMitigationPolicy(MitigationVendors.CapacityMario) // this is the same as luigi
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    UserTypes.Insured
  )
  chat.userParams.lossDateDelta = dateDelta
  await chat.HandleDefaultUserValidation()
  const vendorMario = GetMitigationVendor(MitigationVendors.CapacityMario)
  const vendorLuigi = GetMitigationVendor(MitigationVendors.CapacityLuigi)
  await chat.HandleDamageReason(policy.damageReason as EagleDamageReasonTypes)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.Interior)
  await chat.HandleInteriorDamageFlow(Interior_Rooms.Rooms_2)
  chat.finishParams.stopBeforeSubmit = false // we want to submit the claim..
  chat.finishParams.expectMitigation = true // we DO expect to get offered mitigation - either from Mario capacity or Luigi capacity
  chat.finishParams.mitigationVendors.push(vendorMario)
  chat.finishParams.mitigationVendors.push(vendorLuigi)
  chat.finishParams.acceptMitigation = AcceptMitigation_Yes
  await chat.HandleDefaultFinish()
  await Shutdown(global)
  return chat.finishParams.acceptedMitigationVendor
}
