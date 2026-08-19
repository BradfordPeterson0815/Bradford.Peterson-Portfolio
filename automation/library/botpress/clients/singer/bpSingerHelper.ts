import { Browser } from 'playwright/test'
import { BPClients, UserTypes } from '../../bpConstants.js'
import { LaunchFNOLChat } from '../../bpHelper.js'
import { BPMitigationVendor } from '../../bpMitigationVendor.js'
import { BPPolicy } from '../../bpPolicy.js'
import {
  DamageReason,
  DamageReasonFold,
  SingerDamageReasonTypes,
  SingerOnBehalfOfTypes,
  SingerPlumbingTypes,
  SingerResidenceNotLivableTypes,
  SingerWaterDamageTypes,
  Interior_Mitigations,
  Interior_Rooms,
  MitigationVendors,
  Plumbing,
  ProvidePolicy_Yes,
  WaterDamage,
} from './bpSingerConstants.js'
import { BPSingerFNOLChat } from './bpSingerFNOLChat.js'

export function GetPolicy(_: UserTypes) {
  const policy = new BPPolicy()
  policy.policyNumber = 'redacted'
  policy.firstName = 'tbd'
  policy.lastName = 'redacted'
  policy.houseNumber = '586'
  policy.zip = '31298'
  policy.email = 'J********3@example.net'
  policy.phoneNumber = '***-***-1931'
  policy.damageReason = GetRandomDamageReason()
  policy.lossDateDelta = 1
  return policy
}

export function GetPolicyWithBadData() {
  const policy = new BPPolicy()
  policy.policyNumber = 'redacted'
  policy.firstName = 'redacted'
  policy.lastName = 'redacted'
  policy.houseNumber = '586'
  policy.zip = '31298'
  policy.email = 'J********3@example.net'
  policy.phoneNumber = '***-***-1931'
  policy.damageReason = GetRandomDamageReason()
  policy.lossDateDelta = 1
  return policy
}

export function GetRandomDamageReason() {
  const max = Object.keys(DamageReason).length
  let randomKey = Math.floor(Math.random() * max)
  if (randomKey == SingerDamageReasonTypes.Liability) {
    randomKey = SingerDamageReasonTypes.Water
  }
  if (randomKey == SingerDamageReasonTypes.LossAssessment) {
    randomKey = SingerDamageReasonTypes.Wind
  }
  return randomKey as SingerDamageReasonTypes
}

export function GetMitigationPolicy(vendor: MitigationVendors) {
  const policy = new BPPolicy()
  switch (vendor) {
    case MitigationVendors.ABoltFromTheBlue:
      policy.policyNumber = 'redacted'
      policy.firstName = 'TBD'
      policy.lastName = 'TBD'
      policy.houseNumber = 'TBD'
      policy.zip = 'TBD'
      policy.email = 'a********t@company.com'
      policy.phoneNumber = '***-***-1111'
      policy.damageReason = SingerDamageReasonTypes.Lightning
      policy.lossDateDelta = 1
      break
    case MitigationVendors.ReportHateCrimes:
      policy.policyNumber = 'redacted'
      policy.firstName = 'TBD'
      policy.lastName = 'TBD'
      policy.houseNumber = 'TBD'
      policy.zip = 'TBD'
      policy.email = 'a********t@company.com'
      policy.phoneNumber = '***-***-1111'
      policy.damageReason = SingerDamageReasonTypes.Vandalism
      policy.lossDateDelta = 1
      break
    case MitigationVendors.ShakeyShake:
      policy.policyNumber = 'redacted'
      policy.firstName = 'TBD'
      policy.lastName = 'TBD'
      policy.houseNumber = 'TBD'
      policy.zip = 'TBD'
      policy.email = 'k********o@eagle.com'
      policy.phoneNumber = '***-***-8888'
      policy.damageReason = SingerDamageReasonTypes.Earthquake
      policy.lossDateDelta = 1
      break
    case MitigationVendors.LittleFiresEverywhere:
      policy.policyNumber = 'redacted'
      policy.firstName = 'TBD'
      policy.lastName = 'TBD'
      policy.houseNumber = 'TBD'
      policy.zip = 'TBD'
      policy.email = 'q********g@westpointuw.com'
      policy.phoneNumber = '***-***-3210'
      policy.damageReason = SingerDamageReasonTypes.Fire
      policy.lossDateDelta = 3
      break
    case MitigationVendors.WouldIfICould:
      policy.policyNumber = 'redacted'
      policy.firstName = 'TBD'
      policy.lastName = 'TBD'
      policy.houseNumber = 'TBD'
      policy.zip = 'TBD'
      policy.email = 'q********g@westpointuw.com'
      policy.phoneNumber = '***-***-3210'
      policy.damageReason = SingerDamageReasonTypes.Hail
      policy.lossDateDelta = 1
      break
    case MitigationVendors.CapacityLuigi:
    case MitigationVendors.CapacityMario:
      policy.policyNumber = 'redacted'
      policy.firstName = 'TBD'
      policy.lastName = 'TBD'
      policy.houseNumber = 'TBD'
      policy.zip = 'TBD'
      policy.email = 'q********g@westpointuw.com'
      policy.phoneNumber = '***-***-3210'
      policy.damageReason = SingerDamageReasonTypes.Other
      policy.lossDateDelta = 1
      break
    case MitigationVendors.Company:
    default:
      policy.policyNumber = 'redacted'
      policy.firstName = 'TBD'
      policy.lastName = 'TBD'
      policy.houseNumber = 'TBD'
      policy.zip = 'TBD'
      policy.email = 'q********g@westpointuw.com'
      policy.phoneNumber = '***-***-3210'
      policy.damageReason = SingerDamageReasonTypes.Sinkhole
      policy.lossDateDelta = 1
      break
  }
  return policy
}

export function GetMitigationVendor(vendor: MitigationVendors) {
  const chosenVendor = new BPMitigationVendor()
  switch (vendor) {
    case MitigationVendors.ABoltFromTheBlue: // lossType = [LIGHTNING]
      chosenVendor.name = 'A Bolt from the Blue'
      chosenVendor.phone = 'redacted'
      chosenVendor.email = 'redacted'
      break
    case MitigationVendors.ReportHateCrimes: // lossType = [VANDALISM]
      chosenVendor.name = 'ReportHateCrimes'
      chosenVendor.phone = 'redacted'
      chosenVendor.email = 'redacted'
      break
    case MitigationVendors.ShakeyShake: // lossType = [EARTHQUAKE]
      chosenVendor.name = 'ShakeyShake'
      chosenVendor.phone = 'redacted'
      chosenVendor.email = 'redacted'
      break
    case MitigationVendors.LittleFiresEverywhere: // lossType = [FIRE]
      chosenVendor.name = 'Little Fires Everywhere'
      chosenVendor.phone = '555-555-5555'
      chosenVendor.email = 'little@fires.com'
      break
    case MitigationVendors.WouldIfICould: // lossType = [HAIL] - this vendor should be disabled
      chosenVendor.name = 'WouldIfICould'
      chosenVendor.phone = '222-222-2222'
      chosenVendor.email = 'would@ificould.com'
      break
    case MitigationVendors.CapacityMario: // lossType = [OTHER] + NumberOfRooms = [2]
      chosenVendor.name = 'Capacity Testing - Mario'
      chosenVendor.phone = '323-322-2312'
      chosenVendor.email = 'mario@capacitytesting.com'
      break
    case MitigationVendors.CapacityLuigi: // lossType = [OTHER] + NumberOfRooms = [2]
      chosenVendor.name = 'Capacity Testing - Luigi'
      chosenVendor.phone = '122-312-3123'
      chosenVendor.email = 'luigi@capacitytesting.com'
      break
    case MitigationVendors.Company: // lossType = [WATER, WATER DAMAGE TO ROOF,SINKHOLE] - OR - // lossType = [WIND,HURRICANE,HAIL] AND isRoofDamageVisible from fnol is true AND isRoofBreached from fnol is true
    default:
      chosenVendor.name = 'Company Restoration'
      chosenVendor.phone = 'redacted'
      chosenVendor.email = 'redacted'
  }
  return chosenVendor
}

export async function LaunchSingerFNOLChat(
  browser: Browser,
  policy: BPPolicy,
  providePolicy: boolean = ProvidePolicy_Yes,
  userType: UserTypes
) {
  const global = await LaunchFNOLChat(BPClients.Singer, browser, policy, providePolicy, userType)
  global.damageReasonFold = DamageReasonFold
  global.chat = new BPSingerFNOLChat(global)
  global.chat.userParams.originOfWaterDamage =
    Object.values(WaterDamage)[GetRandomWaterDamageType()]
  global.chat.userParams.plumbingType = Object.values(Plumbing)[GetRandomPlumbingType()]
  return { global: global, chat: global.chat as BPSingerFNOLChat }
}

export function GetRandomPlumbingType() {
  const enumLength = Object.keys(SingerPlumbingTypes).filter((key) => isNaN(Number(key))).length
  const randomKey = Math.floor(Math.random() * enumLength)
  return randomKey as SingerPlumbingTypes
}

export function GetRandomWaterDamageType() {
  const enumLength = Object.keys(SingerWaterDamageTypes).filter((key) => isNaN(Number(key))).length
  const randomKey = Math.floor(Math.random() * enumLength)
  return randomKey as SingerWaterDamageTypes
}

export function GetRandomOnBehalfOfType() {
  const enumLength = Object.keys(SingerOnBehalfOfTypes).filter((key) => isNaN(Number(key))).length
  const randomKey = Math.floor(Math.random() * enumLength)
  return randomKey as SingerOnBehalfOfTypes
}

export function GetRandomInteriorRooms() {
  const enumLength = Object.keys(Interior_Rooms).filter((key) => isNaN(Number(key))).length
  const randomKey = Math.floor(Math.random() * enumLength)
  return randomKey as Interior_Rooms
}

export function GetRandomInteriorMitigations() {
  const enumLength = Object.keys(Interior_Mitigations).filter((key) => isNaN(Number(key))).length
  const randomKey = Math.floor(Math.random() * enumLength)
  return randomKey as Interior_Mitigations
}

export function GetRandomResidenceNotLivableType() {
  const enumLength = Object.keys(SingerResidenceNotLivableTypes).filter((key) =>
    isNaN(Number(key))
  ).length
  const randomKey = Math.floor(Math.random() * enumLength)
  return randomKey as SingerResidenceNotLivableTypes
}
