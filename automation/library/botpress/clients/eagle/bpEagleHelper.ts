import { Browser } from '@playwright/test'
import { BPClients, UserTypes } from '../../bpConstants.js'
import { LaunchFNOLChat } from '../../bpHelper.js'
import { BPMitigationVendor } from '../../bpMitigationVendor.js'
import { BPPolicy } from '../../bpPolicy.js'
import {
  DamageReason,
  DamageReasonFold,
  FencingType,
  Mitigations,
  Interior_Rooms,
  MitigationVendors,
  EagleDamageReasonTypes,
  EagleOnBehalfOfTypes,
  EaglePlumbingTypes,
  EagleResidenceNotLivableTypes,
  EagleWaterDamageTypes,
  EagleWeatherEventTypes,
  Plumbing,
  PoolType,
  ProvidePolicy_Yes,
  WaterDamage,
} from './bpEagleConstants.js'
import { BPEagleFNOLChat } from './bpEagleFNOLChat.js'
import { BPWeatherEvent } from '../../bpWeatherEvent.js'
import { BPLocation } from '../../bpLocation.js'

export function GetPolicy(_: UserTypes) {
  const policy = new BPPolicy()
  policy.policyNumber = 'redacted'
  policy.firstName = 'redacted'
  policy.lastName = 'redacted'
  policy.houseNumber = '140'
  policy.zip = '32459'
  policy.email = 'Q********g@westpointuw.com'
  policy.phoneNumber = '***-***-0171'
  policy.damageReason = GetRandomDamageReason()
  policy.lossDateDelta = 1
  return policy
}

export function GetSubmitablePolicy(_: UserTypes) {
  const policy = new BPPolicy()
  policy.policyNumber = 'redacted'
  policy.firstName = 'redacted'
  policy.lastName = 'redacted'
  policy.houseNumber = '140'
  policy.zip = '32459'
  policy.email = 'Q********g@westpointuw.com'
  policy.phoneNumber = '***-***-0171'
  policy.damageReason = GetRandomDamageReason()
  policy.lossDateDelta = 1
  return policy
}

export function GetPolicyWithBadData() {
  const policy = new BPPolicy()
  policy.policyNumber = 'redacted'
  policy.firstName = 'Wrong'
  policy.lastName = 'Name'
  policy.houseNumber = '3331'
  policy.zip = '34997' // Martin county
  policy.email = 'Q********g@westpointuw.com'
  policy.phoneNumber = '***-***-0171'
  policy.damageReason = GetRandomDamageReason()
  policy.lossDateDelta = 1
  return policy
}

export function GetLookupPolicyWithMultipleMatches() {
  const policy = new BPPolicy()
  policy.policyNumber = 'redacted'
  policy.firstName = ''
  policy.lastName = 'redacted'
  policy.houseNumber = '6825'
  policy.zip = '33781' // Pinellas county
  policy.email = 'Q********g@westpointuw.com'
  policy.phoneNumber = '***-***-5555'
  policy.damageReason = GetRandomDamageReason()
  policy.lossDateDelta = 1
  return policy
}

export function GetWeatherEventPolicy(weatherEvent: BPWeatherEvent) {
  const policy = new BPPolicy()
  switch (weatherEvent.type) {
    case EagleWeatherEventTypes.HailingHillary: // Pinellas County
      policy.policyNumber = 'redacted' // Pinellas County
      policy.firstName = 'TBD'
      policy.lastName = 'TBD'
      policy.houseNumber = 'TBD'
      policy.zip = 'TBD'
      policy.email = 'Q********g@westpointuw.com'
      policy.phoneNumber = '***-***-0171'
      policy.damageReason = weatherEvent.lossType
      policy.lossDateDelta = 1
      break
    case EagleWeatherEventTypes.TyphoonTimmy: // Orange County
      policy.policyNumber = 'redacted' // Orange County
      policy.firstName = 'TBD'
      policy.lastName = 'TBD'
      policy.houseNumber = 'TBD'
      policy.zip = 'TBD'
      policy.email = 'Q********g@westpointuw.com'
      policy.phoneNumber = '***-***-0171'
      policy.damageReason = weatherEvent.lossType
      policy.lossDateDelta = 1
      break
    case EagleWeatherEventTypes.HurricaneHarry: // Pasco
      policy.policyNumber = 'redacted' // Pasco County
      policy.firstName = 'TBD'
      policy.lastName = 'TBD'
      policy.houseNumber = 'TBD'
      policy.zip = 'TBD'
      policy.email = 'Q********g@westpointuw.com'
      policy.phoneNumber = '***-***-3210'
      policy.damageReason = weatherEvent.lossType
      policy.lossDateDelta = 1
      break
    case EagleWeatherEventTypes.FieryFreddy: // Hillsborough, FL and Pinellas, FL
      policy.policyNumber = 'redacted' // Hillsborough
      policy.firstName = 'TBD'
      policy.lastName = 'TBD'
      policy.houseNumber = 'TBD'
      policy.zip = 'TBD'
      policy.email = 'Q********g@westpointuw.com'
      policy.phoneNumber = '***-***-0171'
      policy.damageReason = weatherEvent.lossType
      policy.lossDateDelta = 1
      break
  }
  return policy
}

export function GetRandomDamageReason() {
  const max = Object.keys(DamageReason).length
  let randomKey = Math.floor(Math.random() * max)
  if (randomKey == EagleDamageReasonTypes.Liability) {
    randomKey = EagleDamageReasonTypes.Water
  }
  if (randomKey == EagleDamageReasonTypes.LossAssessment) {
    randomKey = EagleDamageReasonTypes.Wind
  }
  return randomKey as EagleDamageReasonTypes
}

export function GetMitigationPolicy(vendor: MitigationVendors) {
  const policy = new BPPolicy()
  switch (vendor) {
    case MitigationVendors.ABoltFromTheBlue:
      policy.policyNumber = 'redacted' // Polk County
      policy.firstName = 'TBD'
      policy.lastName = 'TBD'
      policy.houseNumber = 'TBD'
      policy.zip = 'TBD'
      policy.email = 'Q********g@westpointuw.com'
      policy.phoneNumber = '***-***-0171'
      policy.damageReason = EagleDamageReasonTypes.Lightning
      policy.lossDateDelta = 1
      break
    case MitigationVendors.ReportHateCrimes:
      policy.policyNumber = 'redacted' // Polk County
      policy.firstName = 'TBD'
      policy.lastName = 'TBD'
      policy.houseNumber = 'TBD'
      policy.zip = 'TBD'
      policy.email = 'Q********g@westpointuw.com'
      policy.phoneNumber = '***-***-0171'
      policy.damageReason = EagleDamageReasonTypes.Vandalism
      policy.lossDateDelta = 1
      break
    case MitigationVendors.LittleFiresEverywhere:
      policy.policyNumber = 'redacted' // Polk County
      policy.firstName = 'TBD'
      policy.lastName = 'TBD'
      policy.houseNumber = 'TBD'
      policy.zip = 'TBD'
      policy.email = 'Q********g@westpointuw.com'
      policy.phoneNumber = '***-***-0171'
      policy.damageReason = EagleDamageReasonTypes.Fire
      policy.lossDateDelta = 2
      break
    case MitigationVendors.WouldIfICould:
      policy.policyNumber = 'redacted' // Lee County
      policy.firstName = 'TBD'
      policy.lastName = 'TBD'
      policy.houseNumber = 'TBD'
      policy.zip = 'TBD'
      policy.email = 'Q********g@westpointuw.com'
      policy.phoneNumber = '***-***-0171'
      policy.damageReason = EagleDamageReasonTypes.Hail
      policy.lossDateDelta = 1
      break
    case MitigationVendors.CapacityLuigi:
    case MitigationVendors.CapacityMario:
      policy.policyNumber = 'redacted' // Palm Beach County
      policy.firstName = 'TBD'
      policy.lastName = 'TBD'
      policy.houseNumber = 'TBD'
      policy.zip = 'TBD'
      policy.email = 'Q********g@westpointuw.com'
      policy.phoneNumber = '***-***-0171'
      policy.damageReason = EagleDamageReasonTypes.Other
      policy.lossDateDelta = 1
      break
    case MitigationVendors.Company:
    default:
      policy.policyNumber = 'redacted' // Palm Beach County
      policy.firstName = 'TBD'
      policy.lastName = 'TBD'
      policy.houseNumber = 'TBD'
      policy.zip = 'TBD'
      policy.email = 'Q********g@westpointuw.com'
      policy.phoneNumber = '***-***-0171'
      policy.damageReason = EagleDamageReasonTypes.Hurricane
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
      chosenVendor.phone = '(111) 222-3333'
      chosenVendor.email = 'jobs@company.com'
  }
  return chosenVendor
}

export function GetWeatherEvent(weatherEventType: EagleWeatherEventTypes) {
  const chosenWeatherEvent = new BPWeatherEvent()
  switch (weatherEventType) {
    case EagleWeatherEventTypes.HailingHillary:
      chosenWeatherEvent.name = 'Hailing Hillary'
      chosenWeatherEvent.catCode = '1111'
      chosenWeatherEvent.locations.push(new BPLocation('Seminole', 'FL'))
      chosenWeatherEvent.lossType = EagleDamageReasonTypes.Hail
      chosenWeatherEvent.startDate = new Date(2025, 3, 1) // 4/1/2025
      chosenWeatherEvent.startDate = new Date(2025, 9, 1) // 10/1/2025
      break
    case EagleWeatherEventTypes.TyphoonTimmy:
      chosenWeatherEvent.name = 'Typhoon Timmy'
      chosenWeatherEvent.catCode = '1112'
      chosenWeatherEvent.locations.push(new BPLocation('Pinellas', 'FL'))
      chosenWeatherEvent.lossType = EagleDamageReasonTypes.Water
      chosenWeatherEvent.startDate = new Date(2025, 3, 1) // 4/1/2025
      chosenWeatherEvent.startDate = new Date(2025, 9, 1) // 10/1/2025
      break
    case EagleWeatherEventTypes.HurricaneHarry:
      chosenWeatherEvent.name = 'Hurricane Harry'
      chosenWeatherEvent.catCode = '1113'
      chosenWeatherEvent.locations.push(new BPLocation('Brevard', 'FL'))
      chosenWeatherEvent.lossType = EagleDamageReasonTypes.Hurricane
      chosenWeatherEvent.startDate = new Date(2025, 3, 1) // 4/1/2025
      chosenWeatherEvent.startDate = new Date(2025, 9, 1) // 10/1/2025
      break
    case EagleWeatherEventTypes.FieryFreddy:
      chosenWeatherEvent.name = 'Fiery Freddy'
      chosenWeatherEvent.catCode = '1114'
      chosenWeatherEvent.locations.push(new BPLocation('Seminole', 'FL'))
      chosenWeatherEvent.locations.push(new BPLocation('Pasco', 'FL'))
      chosenWeatherEvent.lossType = EagleDamageReasonTypes.Fire
      chosenWeatherEvent.startDate = new Date(2025, 3, 1) // 4/1/2025
      chosenWeatherEvent.startDate = new Date(2025, 9, 1) // 10/1/2025
      break
    default:
      throw new Error(
        `Error: Processing a Weather Event item that is not yet defined: ${weatherEventType}`
      )
  }
  chosenWeatherEvent.type = weatherEventType
  return chosenWeatherEvent
}

export async function LaunchEagleFNOLChat(
  browser: Browser,
  policy: BPPolicy,
  providePolicy: boolean = ProvidePolicy_Yes,
  userType: UserTypes
) {
  const global = await LaunchFNOLChat(
    BPClients.Eagle,
    browser,
    policy,
    providePolicy,
    userType
  )
  global.damageReasonFold = DamageReasonFold
  global.chat = new BPEagleFNOLChat(global)
  global.chat.userParams.originOfWaterDamage =
    Object.values(WaterDamage)[GetRandomWaterDamageType()]
  global.chat.userParams.plumbingType = Object.values(Plumbing)[GetRandomPlumbingType()]
  return { global: global, chat: global.chat as BPEagleFNOLChat }
}

export function GetRandomPlumbingType() {
  const enumLength = Object.keys(EaglePlumbingTypes).filter((key) =>
    isNaN(Number(key))
  ).length
  const randomKey = Math.floor(Math.random() * enumLength)
  return randomKey as EaglePlumbingTypes
}

export function GetRandomWaterDamageType() {
  const enumLength = Object.keys(EagleWaterDamageTypes).filter((key) =>
    isNaN(Number(key))
  ).length
  const randomKey = Math.floor(Math.random() * enumLength)
  return randomKey as EagleWaterDamageTypes
}

export function GetRandomOnBehalfOfType() {
  const enumLength = Object.keys(EagleOnBehalfOfTypes).filter((key) =>
    isNaN(Number(key))
  ).length
  const randomKey = Math.floor(Math.random() * enumLength)
  return randomKey as EagleOnBehalfOfTypes
}

export function GetRandomPoolType() {
  const enumLength = Object.keys(PoolType).filter((key) => isNaN(Number(key))).length
  const randomKey = Math.floor(Math.random() * enumLength)
  return randomKey as PoolType
}

export function GetRandomFencingType() {
  const enumLength = Object.keys(FencingType).filter((key) => isNaN(Number(key))).length
  const randomKey = Math.floor(Math.random() * enumLength)
  return randomKey as FencingType
}

export function GetRandomInteriorRooms() {
  const enumLength = Object.keys(Interior_Rooms).filter((key) => isNaN(Number(key))).length
  const randomKey = Math.floor(Math.random() * enumLength)
  return randomKey as Interior_Rooms
}

export function GetRandomMitigations() {
  const enumLength = Object.keys(Mitigations).filter((key) => isNaN(Number(key))).length
  const randomKey = Math.floor(Math.random() * enumLength)
  return randomKey as Mitigations
}

export function GetRandomResidenceNotLivableType() {
  const enumLength = Object.keys(EagleResidenceNotLivableTypes).filter((key) =>
    isNaN(Number(key))
  ).length
  const randomKey = Math.floor(Math.random() * enumLength)
  return randomKey as EagleResidenceNotLivableTypes
}
