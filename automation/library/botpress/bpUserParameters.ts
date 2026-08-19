import { UserTypes } from './bpConstants.js'
import { BPGlobal } from './bpGlobal.js'
import { BPOnBehalfOf } from './bpOnBehalfOf.js'
import { BPPlumbing } from './bpPlumbing.js'
import { BPPolicy } from './bpPolicy.js'
import { BPWaterDamage } from './bpWaterDamage.js'
import { BPWeatherEvent } from './bpWeatherEvent.js'

export class BPUserParameters {
  policy: BPPolicy
  policyNumberWasProvided: boolean
  reportingName: string
  userType: UserTypes
  onBehalfOf_Type: BPOnBehalfOf | null
  onBehalfOf_FirstName: string
  onBehalfOf_LastName: string
  onBehalfOf_FullName: string
  onBehalfOf_Email: string
  onBehalfOf_Phone: string
  onBehalfOf_PhoneMatch: string
  onBehalfOf_PhoneExtension: string
  onBehalfOf_Company: string
  onBehalfOf_PolicyHolderRelationship: string
  performPolicyLookup: boolean
  stopAfterPolicyLookup: boolean
  stopBeforeZIPVerification: boolean
  expectSuccessOnLookup: boolean
  lossDateDelta: number
  editContactInformation: boolean
  editContactInformation_Phone: string
  editContactInformation_Email: string
  editContactStopOnEdit: boolean
  claimReporterStopOnEdit: boolean
  thirdPartyClaimantStopOnEdit: boolean
  attorneyStopOnEdit: boolean
  theft_OnPremises: boolean
  theft_OffPremisesLocation: string
  theft_PhysicalDamage: boolean
  theft_Description: string
  theft_FiledPoliceReport: boolean
  theft_PoliceReportNumber: string
  lossAssessment_DateDelta: string | number
  lossAssessment_Reason: string
  lossAssessment_WeatherRelated: boolean
  lossAssessment_Amount: string
  lossAssessment_HaveLetter: boolean
  lossAssessment_LetterToUpload: null | string
  originOfWaterDamage: BPWaterDamage | null
  waterTurnedOff: boolean
  plumbingType: BPPlumbing | null
  plumber_Contacted: boolean
  plumber_Phone: string
  plumber_PhoneMatch: string
  plumber_Company: string
  plumber_StopOnEdit: boolean
  hvac_Repaired: boolean
  hvac_Phone: string
  hvac_PhoneMatch: string
  hvac_Company: string
  hvac_StopOnEdit: boolean
  roof_VisibleDamageDescription: string
  roof_BreachedCause: string
  roof_BreachedCauseRemoved: boolean
  isPostStorm: boolean
  isDamagedEntryway: boolean
  isTreeOnStructure: boolean
  isContentsOrPersonalPropertyOnly: boolean
  undoTopic: null | string
  isEveryoneSafe: boolean
  isEveryoneSafe_Continue: boolean
  lossLocationAtPolicyAddress: boolean
  lossLocationDescription: string
  expectedWeatherEvents: BPWeatherEvent[]
  weatherEventChoice: null | string
  constructor(global: BPGlobal) {
    this.policy = global.policy
    this.reportingName = 'Polly C Holda'
    this.lossDateDelta = global.policy.lossDateDelta
    this.policyNumberWasProvided = true
    this.userType = global.currentUserType
    this.editContactInformation = false
    this.editContactInformation_Phone = '5095551234'
    this.editContactInformation_Email = 'company.test@outlook.com'
    this.editContactStopOnEdit = false
    this.claimReporterStopOnEdit = false
    this.thirdPartyClaimantStopOnEdit = false
    this.attorneyStopOnEdit = false
    this.plumber_StopOnEdit = false
    this.originOfWaterDamage = null
    this.waterTurnedOff = true
    this.plumbingType = null
    this.plumber_Contacted = false
    this.plumber_Phone = ''
    this.plumber_PhoneMatch = ''
    this.plumber_Company = ''
    this.plumber_StopOnEdit = false
    this.hvac_Repaired = false
    this.hvac_Phone = ''
    this.hvac_PhoneMatch = ''
    this.hvac_Company = ''
    this.hvac_StopOnEdit = false
    this.roof_VisibleDamageDescription = 'We have a whole section missing'
    this.roof_BreachedCause = ''
    this.roof_BreachedCauseRemoved = false
    this.onBehalfOf_Type = null
    this.onBehalfOf_FirstName = ''
    this.onBehalfOf_LastName = ''
    this.onBehalfOf_FullName = ''
    this.onBehalfOf_Email = ''
    this.onBehalfOf_Phone = ''
    this.onBehalfOf_PhoneMatch = ''
    this.onBehalfOf_PhoneExtension = ''
    this.onBehalfOf_Company = ''
    this.onBehalfOf_PolicyHolderRelationship = 'Cousin'
    this.stopAfterPolicyLookup = false
    this.stopBeforeZIPVerification = false
    this.performPolicyLookup = false
    this.expectSuccessOnLookup = true
    this.isPostStorm = false
    this.theft_PhysicalDamage = false
    this.theft_OnPremises = true
    this.theft_OffPremisesLocation = 'My vacation home'
    this.theft_FiledPoliceReport = false
    this.theft_Description = 'Precious heirloom tomatoes were taken from my garden'
    this.theft_PoliceReportNumber = ''
    this.lossAssessment_DateDelta = 0
    this.lossAssessment_Reason = 'Cause HOAs are a pain'
    this.lossAssessment_WeatherRelated = false
    this.lossAssessment_Amount = '100'
    this.lossAssessment_HaveLetter = false
    this.lossAssessment_LetterToUpload = null
    this.undoTopic = null
    this.isDamagedEntryway = false
    this.isTreeOnStructure = false
    this.isContentsOrPersonalPropertyOnly = false
    this.isEveryoneSafe = true
    this.isEveryoneSafe_Continue = true
    this.lossLocationAtPolicyAddress = true
    this.lossLocationDescription = ''
    this.expectedWeatherEvents = []
    this.weatherEventChoice = null
  }
}
