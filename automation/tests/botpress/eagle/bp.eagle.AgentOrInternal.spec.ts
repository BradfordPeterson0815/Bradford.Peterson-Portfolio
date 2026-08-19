import { Browser } from '@playwright/test'
import test from '../../../library/botpress/bpTestHooks.js'
import { DefaultEnvironment, UserTypes } from '../../../library/botpress/bpConstants.js'
import { Initialize, Shutdown } from '../../../library/botpress/bpHelper.js'
import {
  Attorney_No,
  Attorney_Yes,
  Claimant_No,
  Claimant_Yes,
  HVACRepaired_No,
  HVACRepaired_Yes,
  LiabilityTypes,
  EagleDamageAreaTypes,
  EagleDamageReasonTypes,
  PlumberContacted_No,
  PlumberContacted_Yes,
  ProvidePolicy_Yes,
  WaterDamage,
} from '../../../library/botpress/clients/eagle/bpEagleConstants.js'
import {
  GetPolicy,
  LaunchEagleFNOLChat,
} from '../../../library/botpress/clients/eagle/bpEagleHelper.js'
import { Plumbing } from '../../../library/botpress/clients/singer/bpSingerConstants.js'

const environment = DefaultEnvironment
Initialize(environment)

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
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('Water_Plumbing_PlumberContacted_No', async ({ browser }) => {
  await Water_Plumbing_Test(PlumberContacted_No, browser, UserTypes.Internal)
})

test('Water_Plumbing_PlumberContacted_Yes', async ({ browser }) => {
  await Water_Plumbing_Test(PlumberContacted_Yes, browser, UserTypes.Internal)
})

async function Water_Plumbing_Test(
  plumberContacted: boolean,
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
  await chat.HandleDefaultUserValidation()
  chat.userParams.originOfWaterDamage = WaterDamage.Plumbing
  chat.userParams.waterTurnedOff = false
  chat.userParams.plumbingType = Plumbing.Sink
  chat.userParams.plumber_Contacted = plumberContacted
  chat.userParams.plumber_Company = 'Peter Piper'
  chat.userParams.plumber_Phone = '425 123 1311'
  chat.userParams.plumber_PhoneMatch = '+14251231311'

  await chat.HandleDamageReason(EagleDamageReasonTypes.Water)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandleContentsOrPersonalPropertyDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('Water_HVAC_Repaired_No', async ({ browser }) => {
  await Water_HVAC_Test(HVACRepaired_No, browser, UserTypes.Internal)
})

test('Water_HVAC_Repaired_Yes', async ({ browser }) => {
  await Water_HVAC_Test(HVACRepaired_Yes, browser, UserTypes.Internal)
})

async function Water_HVAC_Test(
  hvac_Repaired: boolean,
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
  await chat.HandleDefaultUserValidation()
  chat.userParams.originOfWaterDamage = WaterDamage.HVAC
  chat.userParams.waterTurnedOff = true
  chat.userParams.plumbingType = Plumbing.Sink
  chat.userParams.hvac_Repaired = hvac_Repaired
  chat.userParams.hvac_Company = 'Duct Duct Goose'
  chat.userParams.hvac_Phone = '425 321 3155'
  chat.userParams.hvac_PhoneMatch = '+14253213155'
  await chat.HandleDamageReason(EagleDamageReasonTypes.Water)
  await chat.HandleDamageAreas(EagleDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandleContentsOrPersonalPropertyDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}
