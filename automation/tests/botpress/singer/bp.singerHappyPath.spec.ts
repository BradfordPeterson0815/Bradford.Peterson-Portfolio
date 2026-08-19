import { Browser } from '@playwright/test'
import { DefaultEnvironment, UserTypes } from '../../../library/botpress/bpConstants.js'
import { Initialize, Shutdown } from '../../../library/botpress/bpHelper.js'
import test from '../../../library/botpress/bpTestHooks.js'
import {
  Exterior_DebrisOrTrees_Yes,
  Exterior_OpenToElements_Yes,
  Interior_StandingWater_No,
  Interior_StandingWater_Yes,
  OtherStructuresDamageTypes,
  ProvidePolicy_No,
  ProvidePolicy_Yes,
  Roof_HasBeenBreached_Yes,
  Roof_VisibleDamage_Yes,
  Roof_WaterThroughRoof_Yes,
  SingerDamageAreaTypes,
  SingerDamageReasonTypes,
  SingerInteriorDamageTypes,
  SkipFoodSpoilagePrompt_Yes,
} from '../../../library/botpress/clients/singer/bpSingerConstants.js'
import {
  GetPolicy,
  LaunchSingerFNOLChat,
} from '../../../library/botpress/clients/singer/bpSingerHelper.js'

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
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, providePolicy, userType)
  chat.userParams.policyNumberWasProvided = false
  chat.userParams.performPolicyLookup = true
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(SingerDamageReasonTypes.Vandalism)
  await chat.HandleDamageAreas(SingerDamageAreaTypes.OtherStructures)
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
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, providePolicy, userType)
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(SingerDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandlePersonalPropertyDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

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
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, providePolicy, userType)
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(SingerDamageReasonTypes.Hurricane)
  await chat.HandleDamageAreas(SingerDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(
    OtherStructuresDamageTypes.Outbuilding |
      OtherStructuresDamageTypes.LandscapingOrDecorativeStructures |
      OtherStructuresDamageTypes.Other
  )
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
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, providePolicy, userType)
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(SingerDamageAreaTypes.OtherStructures)
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
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, providePolicy, userType)
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(SingerDamageAreaTypes.Roof)
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
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, providePolicy, userType)
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(SingerDamageAreaTypes.Roof)
  await chat.HandleRoofDamageFlow(
    Roof_VisibleDamage_Yes,
    Roof_HasBeenBreached_Yes,
    Roof_WaterThroughRoof_Yes
  )
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
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, providePolicy, userType)
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(SingerDamageAreaTypes.Exterior)
  await chat.HandleExteriorDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('DamageAreas_Interior_NonWater_Insured', async ({ browser }) => {
  await Interior_NonWater_Test(browser, UserTypes.Insured)
})

test('DamageAreas_Interior_NonWater_Internal', async ({ browser }) => {
  await Interior_NonWater_Test(browser, UserTypes.Internal)
})

test('DamageAreas_Interior_NonWater_Agent', async ({ browser }) => {
  await Interior_NonWater_Test(browser, UserTypes.Agent)
})

test('DamageAreas_Interior_NonWater_NotSpecified', async ({ browser }) => {
  await Interior_NonWater_Test(browser, UserTypes.NotSpecified, ProvidePolicy_No)
})

async function Interior_NonWater_Test(
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
  await chat.HandleInteriorDamageFlow(
    SingerInteriorDamageTypes.ElectricalIssues,
    Interior_StandingWater_No
  )
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('DamageAreas_Interior_Water_Insured', async ({ browser }) => {
  await Interior_Water_Test(browser, UserTypes.Insured)
})

test('DamageAreas_Interior_Water_Internal', async ({ browser }) => {
  await Interior_Water_Test(browser, UserTypes.Internal)
})

test('DamageAreas_Interior_Water_Agent', async ({ browser }) => {
  await Interior_Water_Test(browser, UserTypes.Agent)
})

test('DamageAreas_Interior_Water_NotSpecified', async ({ browser }) => {
  await Interior_Water_Test(browser, UserTypes.NotSpecified, ProvidePolicy_No)
})

async function Interior_Water_Test(
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
  await chat.HandleInteriorDamageFlow(
    SingerInteriorDamageTypes.WaterDamage,
    Interior_StandingWater_Yes
  )
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('DamageAreas_InteriorAndExterior_AllInteriorDamagesExceptTreeEntryway_Insured', async ({
  browser,
}) => {
  await InteriorAndExterior_AllInteriorDamagesExceptTreeEntryway_Test(browser, UserTypes.Insured)
})

test('DamageAreas_InteriorAndExterior_AllInteriorDamagesExceptTreeEntryway_Internal', async ({
  browser,
}) => {
  await InteriorAndExterior_AllInteriorDamagesExceptTreeEntryway_Test(browser, UserTypes.Internal)
})

test('DamageAreas_InteriorAndExterior_AllInteriorDamagesExceptTreeEntryway_Agent', async ({
  browser,
}) => {
  await InteriorAndExterior_AllInteriorDamagesExceptTreeEntryway_Test(browser, UserTypes.Agent)
})

test('DamageAreas_InteriorAndExterior_AllInteriorDamagesExceptTreeEntryway_NotSpecified', async ({
  browser,
}) => {
  await InteriorAndExterior_AllInteriorDamagesExceptTreeEntryway_Test(
    browser,
    UserTypes.NotSpecified,
    ProvidePolicy_No
  )
})

async function InteriorAndExterior_AllInteriorDamagesExceptTreeEntryway_Test(
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
  await chat.HandleDamageAreas(SingerDamageAreaTypes.Interior | SingerDamageAreaTypes.Exterior)
  await chat.HandleInteriorDamageFlow(
    SingerInteriorDamageTypes.WaterDamage |
      SingerInteriorDamageTypes.PlumbingIssues |
      SingerInteriorDamageTypes.ElectricalIssues |
      SingerInteriorDamageTypes.SmokeDamage |
      SingerInteriorDamageTypes.FireDamage |
      SingerInteriorDamageTypes.Other,
    Interior_StandingWater_Yes
  )
  await chat.HandleExteriorDamageFlow(Exterior_DebrisOrTrees_Yes, Exterior_OpenToElements_Yes)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('DamageAreas_InteriorAndExterior_AllInteriorDamagesExceptTree_Insured', async ({
  browser,
}) => {
  await InteriorAndExterior_AllInteriorDamagesExceptTree_Test(browser, UserTypes.Insured)
})

test('DamageAreas_InteriorAndExterior_AllInteriorDamagesExceptTree_Internal', async ({
  browser,
}) => {
  await InteriorAndExterior_AllInteriorDamagesExceptTree_Test(browser, UserTypes.Internal)
})

test('DamageAreas_InteriorAndExterior_AllInteriorDamagesExceptTree_Agent', async ({ browser }) => {
  await InteriorAndExterior_AllInteriorDamagesExceptTree_Test(browser, UserTypes.Agent)
})

test('DamageAreas_InteriorAndExterior_AllInteriorDamagesExceptTree_NotSpecified', async ({
  browser,
}) => {
  await InteriorAndExterior_AllInteriorDamagesExceptTree_Test(
    browser,
    UserTypes.NotSpecified,
    ProvidePolicy_No
  )
})

async function InteriorAndExterior_AllInteriorDamagesExceptTree_Test(
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
  await chat.HandleDamageAreas(SingerDamageAreaTypes.Interior | SingerDamageAreaTypes.Exterior)
  await chat.HandleInteriorDamageFlow(
    SingerInteriorDamageTypes.WaterDamage |
      SingerInteriorDamageTypes.PlumbingIssues |
      SingerInteriorDamageTypes.ElectricalIssues |
      SingerInteriorDamageTypes.SmokeDamage |
      SingerInteriorDamageTypes.FireDamage |
      SingerInteriorDamageTypes.DamagedEntrypoint |
      SingerInteriorDamageTypes.Other,
    Interior_StandingWater_Yes
  )
  await chat.HandleExteriorDamageFlow(Exterior_DebrisOrTrees_Yes, Exterior_OpenToElements_Yes)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('DamageAreas_InteriorAndExterior_TreeOnly_Insured', async ({ browser }) => {
  await InteriorAndExterior_TreeOnly_Test(browser, UserTypes.Insured)
})

test('DamageAreas_InteriorAndExterior_TreeOnly_Internal', async ({ browser }) => {
  await InteriorAndExterior_TreeOnly_Test(browser, UserTypes.Internal)
})

test('DamageAreas_InteriorAndExterior_TreeOnly_Agent', async ({ browser }) => {
  await InteriorAndExterior_TreeOnly_Test(browser, UserTypes.Agent)
})

test('DamageAreas_InteriorAndExterior_TreeOnly_NotSpecified', async ({ browser }) => {
  await InteriorAndExterior_TreeOnly_Test(browser, UserTypes.NotSpecified, ProvidePolicy_No)
})

async function InteriorAndExterior_TreeOnly_Test(
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
  await chat.HandleDamageAreas(SingerDamageAreaTypes.Interior | SingerDamageAreaTypes.Exterior)
  await chat.HandleInteriorDamageFlow(SingerInteriorDamageTypes.TreeOnStructure)
  await chat.HandleExteriorDamageFlow(Exterior_DebrisOrTrees_Yes, Exterior_OpenToElements_Yes)
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('DamageAreas_InteriorAndExterior_AllInteriorDamages_Insured', async ({ browser }) => {
  await InteriorAndExterior_AllInteriorDamages_Test(browser, UserTypes.Insured)
})

test('DamageAreas_InteriorAndExterior_AllInteriorDamages_Internal', async ({ browser }) => {
  await InteriorAndExterior_AllInteriorDamages_Test(browser, UserTypes.Internal)
})

test('DamageAreas_InteriorAndExterior_AllInteriorDamages_Agent', async ({ browser }) => {
  await InteriorAndExterior_AllInteriorDamages_Test(browser, UserTypes.Agent)
})

test('DamageAreas_InteriorAndExterior_AllInteriorDamages_NotSpecified', async ({ browser }) => {
  await InteriorAndExterior_AllInteriorDamages_Test(
    browser,
    UserTypes.NotSpecified,
    ProvidePolicy_No
  )
})

async function InteriorAndExterior_AllInteriorDamages_Test(
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
  await chat.HandleDamageAreas(SingerDamageAreaTypes.Interior | SingerDamageAreaTypes.Exterior)
  await chat.HandleInteriorDamageFlow(
    SingerInteriorDamageTypes.WaterDamage |
      SingerInteriorDamageTypes.PlumbingIssues |
      SingerInteriorDamageTypes.ElectricalIssues |
      SingerInteriorDamageTypes.TreeOnStructure |
      SingerInteriorDamageTypes.SmokeDamage |
      SingerInteriorDamageTypes.FireDamage |
      SingerInteriorDamageTypes.DamagedEntrypoint |
      SingerInteriorDamageTypes.Other,
    Interior_StandingWater_Yes
  )
  await chat.HandleExteriorDamageFlow(Exterior_DebrisOrTrees_Yes, Exterior_OpenToElements_Yes)
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
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, providePolicy, userType)
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(
    SingerDamageAreaTypes.Interior |
      SingerDamageAreaTypes.Exterior |
      SingerDamageAreaTypes.Roof |
      SingerDamageAreaTypes.ContentsOrPersonalProperty |
      SingerDamageAreaTypes.OtherStructures
  )
  await chat.HandleInteriorDamageFlow(SingerInteriorDamageTypes.ElectricalIssues)
  await chat.HandleExteriorDamageFlow()
  await chat.HandleRoofDamageFlow()
  await chat.HandlePersonalPropertyDamageFlow(SkipFoodSpoilagePrompt_Yes)
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
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, providePolicy, userType)
  if (!providePolicy) {
    chat.userParams.policyNumberWasProvided = false
    chat.userParams.performPolicyLookup = true
  }
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(SingerDamageReasonTypes.Hurricane)
  await chat.HandleDamageAreas(SingerDamageAreaTypes.OtherStructures)
  await chat.HandleOtherStructuresDamageFlow(
    OtherStructuresDamageTypes.Outbuilding | OtherStructuresDamageTypes.Other
  )
  chat.finishParams.stopBeforeSubmit = false // we want to submit the claim..
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}
