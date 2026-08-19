import { Browser } from '@playwright/test'
import { DefaultEnvironment, UserTypes } from '../../../library/botpress/bpConstants.js'
import { Initialize, RandomTrueFalse, Shutdown } from '../../../library/botpress/bpHelper.js'
import test from '../../../library/botpress/bpTestHooks.js'
import {
  OtherStructuresDamageTypes,
  EagleDamageAreaTypes,
  EagleDamageReasonTypes,
  ProvidePolicy_No,
  ProvidePolicy_Yes,
  Roof_HasBeenBreached_No,
  Roof_HasBeenBreached_Yes,
  Roof_WaterThroughRoof_No,
  Roof_WaterThroughRoof_Yes,
  // Roof_WaterThroughRoof_No,
  // Roof_WaterThroughRoof_Yes,
} from '../../../library/botpress/clients/eagle/bpEagleConstants.js'
import {
  GetPolicy,
  GetSubmitablePolicy,
  LaunchEagleFNOLChat,
} from '../../../library/botpress/clients/eagle/bpEagleHelper.js'

const environment = DefaultEnvironment
Initialize(environment)

test('LookupUserPolicy_Insured', async ({ browser }) => {
  await LookupUserPolicy_Test(browser, UserTypes.Insured, ProvidePolicy_No)
})

test('LookupUserPolicy_Internal', async ({ browser }) => {
  await LookupUserPolicy_Test(browser, UserTypes.Internal, ProvidePolicy_No)
})

test('LookupUserPolicy_Agent', async ({ browser }) => {
  await LookupUserPolicy_Test(browser, UserTypes.Agent, ProvidePolicy_No)
})

test('LookupUserPolicy_NotSpecified', async ({ browser }) => {
  await LookupUserPolicy_Test(browser, UserTypes.NotSpecified, ProvidePolicy_No)
})

async function LookupUserPolicy_Test(
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
  chat.userParams.policyNumberWasProvided = false
  chat.userParams.performPolicyLookup = true
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(EagleDamageReasonTypes.Vandalism)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(
    OtherStructuresDamageTypes.LandscapingOrDecorativeStructures
  )
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('DamageAreas_ContentsOrPersonalProperty_Insured', async ({ browser }) => {
  await ContentsOrPersonalProperty_Test(browser, UserTypes.Insured)
})

test('DamageAreas_ContentsOrPersonalProperty_Internal', async ({ browser }) => {
  await ContentsOrPersonalProperty_Test(browser, UserTypes.Internal)
})

test('DamageAreas_ContentsOrPersonalProperty_Agent', async ({ browser }) => {
  await ContentsOrPersonalProperty_Test(browser, UserTypes.Agent)
})

test('DamageAreas_ContentsOrPersonalProperty_NotSpecified', async ({ browser }) => {
  await ContentsOrPersonalProperty_Test(browser, UserTypes.NotSpecified, ProvidePolicy_No)
})

async function ContentsOrPersonalProperty_Test(
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
  await chat.HandleDamageAreas(EagleDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandleContentsOrPersonalPropertyDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('ContentsOrPersonalProperty_Hurricane_Internal', async ({ browser }) => {
  const userType = UserTypes.Internal
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(EagleDamageReasonTypes.Hurricane)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandleContentsOrPersonalPropertyDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
})

test('DamageAreas_OtherStructures_Insured', async ({ browser }) => {
  await OtherStructures_Test(browser, UserTypes.Insured)
})

test('DamageAreas_OtherStructures_Internal', async ({ browser }) => {
  await OtherStructures_Test(browser, UserTypes.Internal)
})

test('DamageAreas_OtherStructures_Agent', async ({ browser }) => {
  await OtherStructures_Test(browser, UserTypes.Agent)
})

test('DamageAreas_OtherStructures_NotSpecified', async ({ browser }) => {
  await OtherStructures_Test(browser, UserTypes.NotSpecified, ProvidePolicy_No)
})

async function OtherStructures_Test(
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
  await chat.HandleDamageReason(EagleDamageReasonTypes.Hurricane)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(
    OtherStructuresDamageTypes.Outbuilding |
      OtherStructuresDamageTypes.LandscapingOrDecorativeStructures |
      OtherStructuresDamageTypes.Other
  )
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('DamageAreas_OtherStructures_Pool_Insured', async ({ browser }) => {
  await OtherStructures_Pool_Test(browser, UserTypes.Insured)
})

test('DamageAreas_OtherStructures_Pool_Internal', async ({ browser }) => {
  await OtherStructures_Pool_Test(browser, UserTypes.Internal)
})

test('DamageAreas_OtherStructures_Pool_Agent', async ({ browser }) => {
  await OtherStructures_Pool_Test(browser, UserTypes.Agent)
})

test('DamageAreas_OtherStructures_Pool_NotSpecified', async ({ browser }) => {
  await OtherStructures_Pool_Test(browser, UserTypes.NotSpecified, ProvidePolicy_No)
})

async function OtherStructures_Pool_Test(
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
  await chat.HandleDamageAreas(EagleDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Pool)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('DamageAreas_OtherStructures_Fence_Insured', async ({ browser }) => {
  await OtherStructures_Fence_Test(browser, UserTypes.Insured)
})

test('DamageAreas_OtherStructures_Fence_Internal', async ({ browser }) => {
  await OtherStructures_Fence_Test(browser, UserTypes.Internal)
})

test('DamageAreas_OtherStructures_Fence_Agent', async ({ browser }) => {
  await OtherStructures_Fence_Test(browser, UserTypes.Agent)
})

test('DamageAreas_OtherStructures_Fence_NotSpecified', async ({ browser }) => {
  await OtherStructures_Fence_Test(browser, UserTypes.NotSpecified, ProvidePolicy_No)
})

async function OtherStructures_Fence_Test(
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
  await chat.HandleDamageAreas(EagleDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Fence)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('DamageAreas_OtherStructures_All_Insured', async ({ browser }) => {
  await OtherStructures_All_Test(browser, UserTypes.Insured)
})

test('DamageAreas_OtherStructures_All_Internal', async ({ browser }) => {
  await OtherStructures_All_Test(browser, UserTypes.Internal)
})

test('DamageAreas_OtherStructures_All_Agent', async ({ browser }) => {
  await OtherStructures_All_Test(browser, UserTypes.Agent)
})

test('DamageAreas_OtherStructures_All_NotSpecified', async ({ browser }) => {
  await OtherStructures_All_Test(browser, UserTypes.NotSpecified, ProvidePolicy_No)
})

async function OtherStructures_All_Test(
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
  await chat.HandleDamageAreas(EagleDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(
    OtherStructuresDamageTypes.Pool |
      OtherStructuresDamageTypes.Fence |
      OtherStructuresDamageTypes.Outbuilding |
      OtherStructuresDamageTypes.LandscapingOrDecorativeStructures |
      OtherStructuresDamageTypes.Other
  )
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('DamageAreas_Roof_Insured', async ({ browser }) => {
  await Roof_Test(browser, UserTypes.Insured)
})

test('DamageAreas_Roof_Internal', async ({ browser }) => {
  await Roof_Test(browser, UserTypes.Internal)
})

test('DamageAreas_Roof_Agent', async ({ browser }) => {
  await Roof_Test(browser, UserTypes.Agent)
})

test('DamageAreas_Roof_NotSpecified', async ({ browser }) => {
  await Roof_Test(browser, UserTypes.NotSpecified, ProvidePolicy_No)
})

async function Roof_Test(
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
  await chat.HandleDamageAreas(EagleDamageAreaTypes.Roof)
  await chat.HandleRoofDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('DamageAreas_Roof_WaterThroughRoof_Insured', async ({ browser }) => {
  await Roof_WaterThroughRoof_Test(browser, UserTypes.Insured)
})

test('DamageAreas_Roof_WaterThroughRoof_Internal', async ({ browser }) => {
  await Roof_WaterThroughRoof_Test(browser, UserTypes.Internal)
})

test('DamageAreas_Roof_WaterThroughRoof_Agent', async ({ browser }) => {
  await Roof_WaterThroughRoof_Test(browser, UserTypes.Agent)
})

test('DamageAreas_Roof_WaterThroughRoof_NotSpecified', async ({ browser }) => {
  await Roof_WaterThroughRoof_Test(browser, UserTypes.NotSpecified, ProvidePolicy_No)
})

async function Roof_WaterThroughRoof_Test(
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
  await chat.HandleDamageAreas(EagleDamageAreaTypes.Roof)
  const visibleDamage = RandomTrueFalse()
  await chat.HandleRoofDamageFlow(Roof_HasBeenBreached_No, visibleDamage, Roof_WaterThroughRoof_Yes)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('DamageAreas_Roof_Breached_Insured', async ({ browser }) => {
  await Roof_RoofHasBeenBreached_Test(browser, UserTypes.Insured)
})

test('DamageAreas_Roof_Breached_Internal', async ({ browser }) => {
  await Roof_RoofHasBeenBreached_Test(browser, UserTypes.Internal)
})

test('DamageAreas_Roof_Breached_Agent', async ({ browser }) => {
  await Roof_RoofHasBeenBreached_Test(browser, UserTypes.Agent)
})

test('DamageAreas_Roof_Breached_NotSpecified', async ({ browser }) => {
  await Roof_RoofHasBeenBreached_Test(browser, UserTypes.NotSpecified, ProvidePolicy_No)
})

async function Roof_RoofHasBeenBreached_Test(
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
    chat.userParams.performPolicyLookup = true
    chat.userParams.policyNumberWasProvided = false
  }
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(EagleDamageAreaTypes.Roof)
  chat.userParams.roof_BreachedCause = 'It was a space javelin'
  const visibleDamage = RandomTrueFalse()
  await chat.HandleRoofDamageFlow(Roof_HasBeenBreached_Yes, visibleDamage, Roof_WaterThroughRoof_No)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('DamageAreas_Exterior_Insured', async ({ browser }) => {
  await Exterior_Test(browser, UserTypes.Insured)
})

test('DamageAreas_Exterior_Internal', async ({ browser }) => {
  await Exterior_Test(browser, UserTypes.Internal)
})

test('DamageAreas_Exterior_Agent', async ({ browser }) => {
  await Exterior_Test(browser, UserTypes.Agent)
})

test('DamageAreas_Exterior_NotSpecified', async ({ browser }) => {
  await Exterior_Test(browser, UserTypes.NotSpecified, ProvidePolicy_No)
})

async function Exterior_Test(
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
  await chat.HandleDamageAreas(EagleDamageAreaTypes.Exterior)
  await chat.HandleExteriorDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('DamageAreas_AllDamageAreas_Insured', async ({ browser }) => {
  await AllDamageAreas_Test(browser, UserTypes.Insured)
})

test('DamageAreas_AllDamageAreas_Internal', async ({ browser }) => {
  await AllDamageAreas_Test(browser, UserTypes.Internal)
})

test('DamageAreas_AllDamageAreas_Agent', async ({ browser }) => {
  await AllDamageAreas_Test(browser, UserTypes.Agent)
})

test('DamageAreas_AllDamageAreas_NotSpecified', async ({ browser }) => {
  await AllDamageAreas_Test(browser, UserTypes.NotSpecified, ProvidePolicy_No)
})

async function AllDamageAreas_Test(
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
  await chat.HandleDamageReason(EagleDamageReasonTypes.Vandalism)
  await chat.HandleDamageAreas(
    EagleDamageAreaTypes.Roof |
      EagleDamageAreaTypes.Exterior |
      EagleDamageAreaTypes.Interior |
      EagleDamageAreaTypes.ContentsOrPersonalProperty |
      EagleDamageAreaTypes.OtherStructures
  )
  await chat.HandleRoofDamageFlow()
  await chat.HandleExteriorDamageFlow()
  await chat.HandleInteriorDamageFlow()
  await chat.HandleContentsOrPersonalPropertyDamageFlow()
  await chat.HandleOtherStructuresDamageFlow(OtherStructuresDamageTypes.Outbuilding)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('VerifySubmit_Insured', async ({ browser }) => {
  await VerifySubmit_Test(browser, UserTypes.Insured)
})

test('VerifySubmit_Internal', async ({ browser }) => {
  await VerifySubmit_Test(browser, UserTypes.Internal)
})

test('VerifySubmit_Agent', async ({ browser }) => {
  await VerifySubmit_Test(browser, UserTypes.Agent)
})

test('VerifySubmit_NotSpecified', async ({ browser }) => {
  await VerifySubmit_Test(browser, UserTypes.NotSpecified, ProvidePolicy_No)
})

async function VerifySubmit_Test(
  browser: Browser,
  userType: UserTypes,
  providePolicy: boolean = ProvidePolicy_Yes
) {
  const policy = GetSubmitablePolicy(userType)
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
  await chat.HandleDamageReason(EagleDamageReasonTypes.Hail)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(
    OtherStructuresDamageTypes.Outbuilding | OtherStructuresDamageTypes.Other
  )
  chat.finishParams.stopBeforeSubmit = false // we want to submit the claim..
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}
