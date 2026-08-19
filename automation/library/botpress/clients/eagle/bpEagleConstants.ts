import { BPDamageArea } from '../../bpDamageArea.js'
import { BPLiability } from '../../bpLiability.js'
import { BPOnBehalfOf } from '../../bpOnBehalfOf.js'
import { BPOtherStructuresDamage } from '../../bpOtherStructuresDamage.js'
import { BPPlumbing } from '../../bpPlumbing.js'
import { BPResidenceNotLivable } from '../../bpResidenceNotLivable.js'
import { BPServerPrompt } from '../../bpServerPrompt.js'
import { BPWaterDamage } from '../../bpWaterDamage.js'
import { EagleDamageReason } from './bpEagleDamageReason.js'

export const VerifyOnly_Yes = true
export const VerifyOnly_No = false
export const ProvidePolicy_No = false
export const ProvidePolicy_Yes = true
export const CancelUpload_Yes = true
export const CancelUpload_No = false
export const Interior_StandingWater_Yes = true
export const Interior_StandingWater_No = false
export const Exterior_DebrisOrTrees_Yes = true
export const Exterior_DebrisOrTrees_No = false
export const Exterior_OpenToElements_Yes = true
export const Exterior_OpenToElements_No = false
export const SkipFoodSpoilagePrompt_Yes = true
export const Exterior_SkipOpenToElements_Yes = true
export const ThirdParty_Yes = true
export const ThirdParty_No = false
export const AutoAssign_Yes = true
export const AutoAssign_No = false
export const AcceptMitigation_Yes = true
export const AcceptMitigation_No = false
export const ExpectCat_Yes = true
export const ExpectCat_No = false
export const PhysicalDamage_Yes = true
export const PhysicalDamage_No = false
export const SkipFoodSpoilagePrompt_No = false
export const FoodSpoilageOnly_Yes = true
export const FoodSpoilageOnly_No = false
export const Roof_VisibleDamage_Yes = true
export const Roof_VisibleDamage_No = false
export const Roof_HasBeenBreached_Yes = true
export const Roof_HasBeenBreached_No = false
export const Roof_Breached_PreventionSteps_Yes = true
export const Roof_Breached_PreventionSteps_No = false
export const Roof_WaterThroughRoof_Yes = true
export const Roof_WaterThroughRoof_No = false
export const PersonalProperty_SkipFoodSpoilage_Yes = true
export const HaveAssessmentLetter_Yes = true
export const HaveAssessmentLetter_No = false
export const HaveEstimate_Yes = true
export const HaveEstimate_No = false
export const CancelInsteadOfUpload_Yes = true
export const Claimant_Yes = true
export const Claimant_No = false
export const Attorney_Yes = true
export const Attorney_No = false
export const ReturnActionResult_Yes = true
export const AlreadyOptedIn_Yes = true
export const AlreadyOptedIn_No = false
export const PlumberContacted_Yes = true
export const PlumberContacted_No = false
export const HVACRepaired_Yes = true
export const HVACRepaired_No = false

export const DaysPastLossDate_MaxAllowed = 7
export const DamageReasonFold = 7
export const ClaimsPortalPhone = 'redacted'
export const ClientEmail = 'redacted'
export const DefaultCallbackSLA = '24-48'
export const HurricaneCallbackSLA = '72'

export enum EagleWeatherEventTypes {
  HailingHillary,
  TyphoonTimmy,
  HurricaneHarry,
  FieryFreddy,
}

export enum MitigationVendors {
  Company,
  LittleFiresEverywhere,
  ABoltFromTheBlue,
  ReportHateCrimes,
  WouldIfICould,
  CapacityMario,
  CapacityLuigi,
}

export const UploadDocuments = {
  RepairEstimate_PDF: 'RepairEstimate.pdf',
  RepairEstimate_JPG: 'RepairEstimate.jpg',
  LossAssessment_PDF: 'LossAssessment.pdf',
  LossAssessment_JPG: 'LossAssessment.jpg',
}

export const UploadImages = {
  Crow: 'Crow2.jpg',
  Horse: 'DriftwoodHorse.bmp',
  Milton: 'Milton.png',
  MST3K: 'MST3K.jpg',
  Piggy: 'Piggy.gif',
}

export const FNOLServerPromptText = {
  Introduction_Agent:
    "Hi! I'll be assisting you with reporting a claim.\n\nThis process should only take 5-10 minutes. I'll ask you a few questions about the loss that happened.",
  Introduction_Internal:
    "Hi! I'll be assisting you with reporting a claim by asking a series of questions.",
  Introduction_Insured: `Reporting the claim should only take 5-10 minutes. I'll ask you a few questions about the home and the loss that happened. I recommend that you use a cell phone, so you can take pictures of the damage.\n\nIt is important to note that at this time we are gathering information about the loss. Coverage will be determined upon final review of the claim information by a company representative.`,
  WhatIsYourPolicyNumber: 'First, what is your policy number?',
  PolicyLookupLastName_Intro: 'Okay, I can help you find the policy number.',
  PolicyLookupLastName_FirstTry:
    'Please enter the last name of the primary policyholder as it appears on the Dec page of the policy. Please input last name only, in order to ensure accurate search results.',
  PolicyLookupHouseNumber: `Thank you. What's the house number associated with the policy? Please just enter the number, not the street name.`,
  PolicyLookupZip: `For security purposes, please verify the ZIP code of the insured property.`,
  AreYouThePolicyHolder: 'Are you the policyholder?',
  IsTheCallerThePolicyholder: 'Is the caller the policyholder?',
  AmISpeakingWithThePolicyholder: 'Am I speaking with the policyholder?',
  WhoIsReportingThisClaim: 'Who is reporting this claim?',
  ClaimReporterInformationTitle: "Please enter the claim reporter's information:",
  ContactInformation:
    'Can you verify the phone number and email that we have on file for the policy?\n\nPhone: <POLICYPHONENUMBER>\nEmail: <POLICYEMAIL>\n\n(Any updates will need to be made with your agent for the policy. We will update this for the claim to ensure contact.)\n\nIs this information correct?',
  UpdatedContactInformation:
    'The contact information has been updated.\n\nPhone: <POLICYPHONENUMBER>\nEmail: <POLICYEMAIL>\n\nIs this information correct?',
  WhenDidThisLossOccur: 'When did this loss occur?',
  WhatTypeOfLossDidThePropertySustain: 'What type of loss did the property sustain?',
  WhereDidTheDamageOccur: 'Where did the damage occur?',
  WasTherePhysicalDamageToTheResidence: 'Was there any physical damage to the residence?',
  Interior_IsThereStillStandingWater: 'Is there still standing water?',
  Interior_HowManyRoomsWereAffected: 'How many rooms were affected?',
  PostStorm_Interior_HowManyRoomsWereAffected:
    'To the best of your knowledge, how many rooms were affected?',
  HaveStepsBeenTakenToContainTheDamage:
    'At this point, have any steps been taken to contain the <DAMAGEREASON> damage that was experienced?',

  Exterior_HaveDebrisOrTreesCausedDamage:
    'Has the residence or property sustained any damage due to fallen trees or debris?',
  PostStorm_Exterior_HaveDebrisOrTreesCausedDamage:
    'Have debris or trees caused damage to your residence or property?',
  Exterior_IsResidenceOpenToTheElements:
    'Is the residence currently open to the elements (broken door/window/hole in roof, etc)?',
  PostStorm_Exterior_IsResidenceOpenToTheElements:
    'Is your home currently open to the elements (broken door, window, hole in roof, etc.)?',
  Roof_HasBeenBreached:
    'Has the roof been breached (can you see through the hole to the exterior of the home)?',
  PostStorm_Roof_HasBeenBreached:
    'Has the roof been breached (can you see through the hole to the exterior of the home)?',
  Roof_IsThereVisibleDamage: 'Is there visible damage to the roof?',
  Roof_WhereIsTheVisibleDamage: 'Please describe the visible roof damage:',
  Roof_IsThereWaterInTheHome: 'Is there water in the home due to the roof damage?',
  Roof_WhereIsTheWater: 'Please describe where the water is in the home:',
  Roof_Breached_WhatCausedTheHole: 'What caused the hole?',
  Roof_Breached_CauseRemoved: 'Has the item that caused the hole been removed?',
  MitigationStepsDescription: 'Please describe the steps that were taken:',
  DescribeItemsDamagedByHurricane: 'Please describe the items damaged by the hurricane:',
  OtherStructures_WhatOtherStructuresWereDamaged: 'Which other structures were damaged?',
  Pool_WhatTypeOfPool: 'What type of pool got damaged?',
  Fence_WhatTypeOfFencing: 'What type of fencing got damaged?',
  IsItSafeToRemainInTheResidence: 'Is it safe to remain in the residence?',
  WhyIsTheResidenceNotLivable: 'Why is the residence not livable?',
  NotLivableFollowUp:
    "In order to determine eligibility for assistance with additional living expenses, you will need to speak with a Desk Examiner and they will reach out to you in 24-48 hours.\n\nAfter you answer the next few questions, I'll give you a claim number and will start the process of contacting the appropriate emergency services.",
  ScanTheQRCodeBelow:
    'If you would like to continue this conversation on your mobile phone so that you can upload photos or documentation for this loss, scan the QR code below.',
  IEncourageYouToKeepAnyDamagedProperty: `I encourage you to keep any damaged property and photograph the damage at this time. If you're unable to take pictures, a representative will contact you at a later date for more information.`,
  ProvideLossDescription: 'Please provide a brief description of the loss that occurred:',
  AdditionalClaimNotes: 'Please enter any additional claim notes here:',
  ReviewInformationTitle: `Please review the information you're submitting:`,

  ContactInformationTitle:
    'The contact information we currently have on file is shown below. Please make any required edits and click Confirm.',
  Legal: `Any person who knowingly and with intent to injure, defraud, or deceive any insurer files a statement of claim or an application containing any false, incomplete, or misleading information is guilty of a felony of the third degree.`,
  Submit:
    'Please select Submit to acknowledge that you have read and understand the above statement and would like to report your claim now.',
  ClaimHasBeenSubmitted: `Thank you! Your claim has been successfully submitted. Your claim number is: <CLAIMNUMBER>.\n\nA desk examiner will contact the policyholder within <CALLBACKSLA> hours to explain the claim process, review policy coverage, and provide next steps. The field adjuster will call the policyholder within the next <CALLBACKSLA> hours to set up an inspection appointment.`,
  ClaimHasBeenSubmitted_InternalAgent: `Thank you! The claim has been successfully submitted. The claim number is: <CLAIMNUMBER>.\n\nA desk examiner will contact the policyholder within <CALLBACKSLA> hours to explain the claim process, review policy coverage, and provide next steps. The field adjuster will call the policyholder within the next <CALLBACKSLA> hours to set up an inspection appointment.`,
  YouCanCloseThisWindowNow: 'You can close this window now.',
  ClickBelowToAddPictures: 'Click below to add pictures.',
  HaveYouReceivedAnEstimateForRepairs: 'Have you received an estimate for repairs?',
  PreviousEstimateNonBinding:
    'A previous estimate is not binding for Eagle. Once your adjuster has made final coverage determinations, we will provide you with a final, approved estimate.',
  UploadEstimateHere: 'Please upload the estimate(s) here:',
  ClickBelowToAddDocument: 'Click below to add the document.',
  DescribeWhatWasStolen:
    'What items were stolen, and where were they located when taken (e.g., shed, garage, living room)?',
  HaveYouFiledAPoliceReport: 'Has a police report been filed?',
  DoYouHaveThePoliceReportNumber: 'What is the police report number? Please enter it here:',
  LiabilityTerminates:
    'Unfortunately, liability claims require special assistance. To continue, please call our Customer Service representatives at <CLAIMSPHONE> for further assistance. Your FNOL number is',
  OffPremisesLossLocationTerminates:
    'Unfortunately, off-premises claims require special assistance. To continue, please call our Customer Service line at <CLAIMSPHONE> for further information.\n\nYou can close this window now.',
  UnableToFindMatchingPolicy:
    'I was unable to find a matching policy.\n\nWould you like to search again?',
  MaxPolicyLookupAttempts: "I'm sorry. I'm still unable to find a matching policy.",
  UnableToHelpWithThisClaimTerminal: `I am sorry, I am unable to help with this claim at this time. You may close this window now. You can call our Customer Service line at <CLAIMSPHONE> for additional assistance.`,
  CallCustomerService: `We sincerely apologize for the error you’ve experienced. Please call <CLAIMSPHONE> and one of our Customer Service representatives will be happy to assist you further.`,
  PromptForMitigation: `Eagle can put you in contact with our preferred vendor, <VENDORNAME>, for any mitigation or restoration services you may need. Note that this service does not waive any policy conditions payment for services are your responsibility.\n\nWould you like to be contacted by <VENDORNAME>?`,
  PromptForMitigation_Internal: `Would you like to be referred to <VENDORNAME>, our preferred mitigation vendor?`,
  PromptForMitigation_Agent: `Please ask the policyholder at this time whether they would like to be referred to <VENDORNAME>, our preferred mitigation vendor.`,
  PreferredVendorInformation: `We've sent your information to a preferred vendor.\n\nYour vendor's information is:\n\n<VENDORNAME>\n<VENDORPHONE>\n<VENDOREMAIL>\n\nThey will be in contact with you within 24 hours.`,
  PreferredVendorInformation_InternalAgent: `We've sent the policyholder's information to a preferred vendor.\n\nThe vendor's information is:\n\n<VENDORNAME>\n<VENDORPHONE>\n<VENDOREMAIL>\n\nThey will be in contact with the policyholder within 24 hours.`,
  ZipValidation: 'What is the 5-digit ZIP code associated with the policy?',
  SelectLiabilityType:
    'Please select the applicable types of loss associated with this liability claim:',
  LiabilityInformationTitle:
    'Please use the form below to add additional information about the liability loss that occurred. Click Confirm when done.',
  RetainLiabilityRecords:
    'Instruct the caller to retain failed parts, take photos, save receipts, and documents, and to provide any additional documentation from individuals or attorneys related to the loss. The caller should fax, email, or mail these documents to our ClaimsPortal department as soon as possible.',
  RetainRepairRecords:
    'Please take photos and keep all receipts. Unapproved repairs may or may not be covered by your policy. Once your adjuster has made a final coverage determination, we will provide you with more information about your repair cost coverage.',
  AddThirdPartyClaimant: 'Click to add third-party claimant information, or click Skip.',
  ThirdPartyClaimantInformationTitle:
    'Please use the form below to add third-party claimant contact information. Click Confirm when done.',
  AddAttorney: 'Click to add attorney information for the third-party claimant, or click Skip.',
  AttorneyInformationTitle:
    'Please use the form below to add attorney information for the third-party claimant. Click Confirm when done.',
  LossAssessmentDate: 'Please enter the date of the assessment:',
  LossAssessmentAmount: 'Please enter the amount of the assessment:',
  LossAssessmentReason: 'Please describe the damage that resulted in the loss assessment:',
  LossAssessmentWeatherRelated: 'Was this damage caused by weather?',
  LossAssessmentLetter: 'Do<ARTICLE> have an assessment letter?',
  UploadAssessmentLetterNow:
    'Please upload the assessment letter now.  \n  \nYou can upload either a PDF or a photo of the letter.',
  SubmitLossAssessmentLetter:
    'Upon receipt of the Loss Assessment letter, please submit it to <EMAIL>.',
  UploadAFileTitle: 'Upload a file or drag and drop',
  SubmitEstimates: 'Please submit the estimate(s) to <EMAIL> at your earliest convenience.',
  WhatCausedTheWaterDamage: 'What caused the water damage?',
  WhatTypeOfPlumbing: 'What type of plumbing?',
  PostStorm_SubmitEstimates:
    'Please submit the estimate(s) to claims@harborclaims.com at your earliest convenience.',
  ReportClaimForWeatherEventSelection:
    'Are you reporting a claim related to one of the events below?',
  ReportClaimForWeatherEventSingle: 'Are you reporting a claim related to <WEATHEREVENT>?',
  ReportingFullName: 'For security purposes, please enter your full name here:',
  ReportingFullName_Internal: 'Please enter the full name of the caller here:',
  RelationshipToPolicyHolder: 'What is your relationship to the policyholder?',
  RelationshipToPolicyHolder_Agent: `What is the caller's relationship to the policyholder?`,
  DidThisTheftOccurAtYourResidence: 'Did this theft occur at the residence listed on the policy?',
  WhereDidThisTheftOccur: 'Where did this theft occur?',
  HasTheWaterBeenTurnedOff: 'Has the water been turned off?',
  HasPlumberRepairedTheDamage: 'Has a professional plumber repaired the damage?',
  HasHVACCompanyRepairedTheIssue: 'Has a professional HVAC company repaired the issue?',
  PlumberInformationTitle:
    'Please use the form below to add additional information about the plumber who performed the repairs. Click Confirm when done.',
  HVACInformationTitle:
    'Please use the form below to add additional information about the HVAC company that repaired the issue. Click Confirm when done.',
  LossPriorToEffectiveDateTerminates: `It looks like you're trying to submit a claim for a loss date prior to your policy's effective date.\n\nTo submit this claim, please call us at <CLAIMSPHONE>.\n\nYou can close this window now.`,
}

export const UndoText = {
  Summary:
    "Select the portion of the conversation that you'd like to return to. All subsequent answers will be cleared.",
  Cancel: 'Cancel',
  ReporterInformation: 'Reporter Information',
  DamageReason: 'Damage Reason',
  WaterDamageQuestions: 'Water Damage Questions',
  LossAssessmentQuestions: 'Loss Assessment Questions',
  LiabilityLossQuestions: 'Liability Loss Questions',
  TheftDamageQuestions: 'Theft Damage Questions',
  DamagedAreas: 'Damaged Areas',
  InteriorDamageQuestions: 'Interior Damage Questions',
  ExteriorDamageQuestions: 'Exterior Damage Questions',
  RoofDamageQuestions: 'Roof Damage Questions',
  ContentsDamageQuestions: 'Contents Damage Questions',
  OtherStructuresDamageQuestions: 'Other Structures Damage Questions',
  AdditionalQuestions: 'Additional Questions',
  AddClaimNotes: 'Add Claim Notes',
}

export const OtherText = {
  No: 'No',
  Yes: 'Yes',
  Self: 'Self-Repaired',
  Professional: 'Professionally Repaired',
  NoRepairs: 'No Repairs Completed',
  PartiallyUninhabitable: 'partially uninhabitable',
  FullyUninhabitable: 'fully uninhabitable',
  True: 'True',
  False: 'False',
  UndoSummary: `Select the portion of the conversation that you'd like to return to. All subsequent answers will be cleared.`,
  NoNamedEvent: 'No named event',
}

export const ValidationText = {
  Email: 'Please enter a valid email',
  Phone: 'Please enter a valid phone number',
}

export const ServerPromptsAlternateText = {
  Article_Internal: 'es the policyholder',
  Article_NonInternal: ' you',
  Possessive_Internal: 'their',
  Possessive_NonInternal: 'your',
}

export const FNOLPromptLinks = {
  NoIDoNotHaveIt: 'No, I do not have it',
  Yes: 'Yes',
  No: 'No',
  ContinueThisProcess: 'Continue this process',
  InsuranceAgent: 'Insurance agent',
  Attorney: 'Attorney',
  ContractorVendor: 'Contractor/Vendor',
  PublicAdjuster: 'Public Adjuster',
  CustomerServiceRepresentative: 'Customer Service Representative',
  Other: 'Other',
  Confirm: 'Confirm',
  IDontHaveIt: `I don't have it`,
  Upload: 'Upload',
  OneRoom: '1 room',
  TwoRooms: '2 rooms',
  ThreeRooms: '3 rooms',
  FourRooms: '4 rooms',
  FiveRoomsOrMore: '5 or more rooms',
  Mitigation_Yes: 'Yes - mitigation performed',
  Mitigation_No: 'No - no mitigation performed',
  RepairedItMyself: 'Yes, repaired it myself',
  RepairedItThemselves: 'Yes, repaired it themselves',
  RepairedProfessionally: 'Yes, professionally repaired',
  NoRepairsCompleted: 'No repairs completed',
  SendMeToYourPhone: 'Send me to your phone',
  IHaveSwitchedDevices: `I have switched devices`,
  IllUploadLater: `No thanks, I'll upload later`,
  NoCameraAvailable: 'No camera available',
  UploadImages: 'Upload images',
  Cancel: 'Cancel',
  GoBack: 'Go Back',
  ConfirmYourInformation: 'Confirm your information',
  Submit: 'Submit',
  Liability_DamageToAThirdPartyProperty: 'Damage to a third-party property',
  Liability_InjuryToAThirdParty: 'Injury to a third party',
  Liability_Animal: 'Animal',
  Liability_Other: 'Other',
  Add: 'Add',
  Skip: 'Skip',
  Pool_AboveGround: 'Above-ground',
  Pool_InGround: 'In-ground',
  Fencing_Wood: 'Wood',
  Fencing_Vinyl: 'Vinyl',
  Fencing_Chainlink: 'Chainlink',
  Fencing_Other: 'Other',
}

export enum EagleOnBehalfOfTypes {
  InsuranceAgent,
  Attorney,
  ContractorVendor,
  PublicAdjuster,
  CustomerServiceRepresentative,
  Other,
}

export const OnBehalfOf = {
  InsuranceAgent: new BPOnBehalfOf(
    EagleOnBehalfOfTypes.InsuranceAgent,
    FNOLPromptLinks.InsuranceAgent,
    'AGENT'
  ),
  Attorney: new BPOnBehalfOf(
    EagleOnBehalfOfTypes.Attorney,
    FNOLPromptLinks.Attorney,
    'ATTORNEY'
  ),
  ContractorVendor: new BPOnBehalfOf(
    EagleOnBehalfOfTypes.ContractorVendor,
    FNOLPromptLinks.ContractorVendor,
    'VENDOR'
  ),
  PublicAdjuster: new BPOnBehalfOf(
    EagleOnBehalfOfTypes.PublicAdjuster,
    FNOLPromptLinks.PublicAdjuster,
    'ADJUSTER'
  ),
  CustomerServiceRepresentative: new BPOnBehalfOf(
    EagleOnBehalfOfTypes.CustomerServiceRepresentative,
    FNOLPromptLinks.CustomerServiceRepresentative,
    'ClaimsPortal'
  ),
  Other: new BPOnBehalfOf(EagleOnBehalfOfTypes.Other, FNOLPromptLinks.Other, 'OTHER'),
}

export enum EagleDamageReasonTypes {
  Wind,
  Water,
  Fire,
  Lightning,
  Theft,
  Vandalism,
  Hurricane,
  Hail,
  LossAssessment,
  Liability,
  Sinkhole,
  Earthquake,
  Other,
}

export const DamageReason = {
  Wind: new EagleDamageReason(EagleDamageReasonTypes.Wind, 'Wind', 'Wind'),
  Water: new EagleDamageReason(EagleDamageReasonTypes.Water, 'Water', 'Water'), // What caused the water damage + Type of plumbing + Damage location  + Additional Damage
  Fire: new EagleDamageReason(EagleDamageReasonTypes.Fire, 'Fire', 'Fire'),
  Lightning: new EagleDamageReason(
    EagleDamageReasonTypes.Lightning,
    'Lightning',
    'Lightning'
  ),
  Theft: new EagleDamageReason(EagleDamageReasonTypes.Theft, 'Theft', 'Theft'),
  Vandalism: new EagleDamageReason(
    EagleDamageReasonTypes.Vandalism,
    'Vandalism',
    'Vandalism'
  ),
  Hurricane: new EagleDamageReason(
    EagleDamageReasonTypes.Hurricane,
    'Hurricane',
    'Hurricane'
  ),
  Hail: new EagleDamageReason(EagleDamageReasonTypes.Hail, 'Hail', 'Hail'),
  LossAssessment: new EagleDamageReason(
    EagleDamageReasonTypes.LossAssessment,
    'Loss assessment',
    'Loss Assessment'
  ), //'Loss assessment'),
  Liability: new EagleDamageReason(
    EagleDamageReasonTypes.Liability,
    'Liability - injury/physical damage',
    'Liability - injury/physical damage'
  ),
  Sinkhole: new EagleDamageReason(
    EagleDamageReasonTypes.Sinkhole,
    'Sinkhole',
    'Sinkhole'
  ),
  Earthquake: new EagleDamageReason(
    EagleDamageReasonTypes.Earthquake,
    'Earth movement/Earthquake',
    'Earthquake'
  ),
  Other: new EagleDamageReason(EagleDamageReasonTypes.Other, 'Other', 'Other'),
}

export enum EagleWaterDamageTypes {
  Plumbing,
  Appliance,
  HVAC,
  Freezing,
  Other,
}

export const WaterDamage = {
  Plumbing: new BPWaterDamage(EagleWaterDamageTypes.Plumbing, 'Plumbing', 'Plumbing'),
  Appliance: new BPWaterDamage(EagleWaterDamageTypes.Appliance, 'Appliance', 'Appliance'),
  HVAC: new BPWaterDamage(
    EagleWaterDamageTypes.HVAC,
    'HVAC (air conditioning or heating system)',
    'HVAC (air conditioning or heating system)'
  ),
  Freezing: new BPWaterDamage(EagleWaterDamageTypes.Freezing, 'Freezing', 'Freezing'),
  Other: new BPWaterDamage(EagleWaterDamageTypes.Other, 'Other', 'Other'),
}

export enum EaglePlumbingTypes {
  Sink,
  Bathtub,
  Toilet,
  Dishwasher,
  WashingMachine,
  Aquarium,
  HVACRefrigerator,
  Other,
}

export const Plumbing = {
  Sink: new BPPlumbing(EaglePlumbingTypes.Sink, 'Sink', 'Sink'),
  Bathtub: new BPPlumbing(EaglePlumbingTypes.Bathtub, 'Bathtub', 'Bathtub'),
  Toilet: new BPPlumbing(EaglePlumbingTypes.Toilet, 'Toilet', 'Toilet'),
  Dishwasher: new BPPlumbing(EaglePlumbingTypes.Dishwasher, 'Dishwasher', 'Dishwasher'),
  WashingMachine: new BPPlumbing(
    EaglePlumbingTypes.WashingMachine,
    'Washing Machine',
    'Washing Machine'
  ),
  Aquarium: new BPPlumbing(EaglePlumbingTypes.Aquarium, 'Aquarium', 'Aquarium'),
  HVACRefrigerator: new BPPlumbing(
    EaglePlumbingTypes.HVACRefrigerator,
    'HVAC or Refrigerator',
    'HVAC or Refrigerator'
  ),
  Other: new BPPlumbing(EaglePlumbingTypes.Other, 'Other', 'Other'),
}

export enum EagleDamageAreaTypes {
  Roof = 1,
  Exterior = 2,
  Interior = 4,
  ContentsOrPersonalProperty = 8,
  OtherStructures = 16,
}

export const DamageArea = {
  Roof: new BPDamageArea(
    EagleDamageAreaTypes.Roof,
    'Roof-check',
    'Roof',
    'ROOF',
    'roof damage'
  ),
  Exterior: new BPDamageArea(
    EagleDamageAreaTypes.Exterior,
    'Exterior-check',
    'Exterior',
    'EXTERIOR'
  ),
  Interior: new BPDamageArea(
    EagleDamageAreaTypes.Interior,
    'Interior-check',
    'Interior',
    'INTERIOR'
  ),
  ContentsOrPersonalProperty: new BPDamageArea(
    EagleDamageAreaTypes.ContentsOrPersonalProperty,
    'Contents or personal property-check',
    'Contents or personal property',
    'CONTENTS'
  ),
  OtherStructures: new BPDamageArea(
    EagleDamageAreaTypes.OtherStructures,
    'Other structures-check',
    'Other structures',
    'OTHER STRUCTURES'
  ),
}

export enum OtherStructuresDamageTypes {
  Pool = 1,
  Fence = 2,
  Outbuilding = 4,
  LandscapingOrDecorativeStructures = 8,
  Other = 16,
}

export const OtherStructuresDamage = {
  Pool: new BPOtherStructuresDamage(OtherStructuresDamageTypes.Pool, 'Pool-check', 'Pool', 'POOL'),
  Fence: new BPOtherStructuresDamage(
    OtherStructuresDamageTypes.Fence,
    'Fence-check',
    'Fence',
    'FENCE'
  ),
  Outbuilding: new BPOtherStructuresDamage(
    OtherStructuresDamageTypes.Outbuilding,
    'Outbuilding-check',
    'Outbuilding',
    'OUTBUILDING'
  ),
  LandscapingOrDecorativeStructures: new BPOtherStructuresDamage(
    OtherStructuresDamageTypes.LandscapingOrDecorativeStructures,
    'Landscaping or decorative structures-check',
    'Landscaping or decorative structures',
    'DECORATIVE'
  ),
  Other: new BPOtherStructuresDamage(
    OtherStructuresDamageTypes.Other,
    'Other-check',
    'Other',
    'OTHER'
  ),
}

export enum EagleResidenceNotLivableTypes {
  RequiredEvacuation,
  PartOfHomeUnusable,
  HomeIsNotSecure,
  PersonalChoice,
  MedicalCondition,
  Other,
}

export const ResidenceNotLivable = {
  RequiredEvacuation: new BPResidenceNotLivable(
    EagleResidenceNotLivableTypes.RequiredEvacuation,
    'Required evacuation',
    'Required evacuation',
    'Required evacuation'
  ),
  PartOfHomeUnusable: new BPResidenceNotLivable(
    EagleResidenceNotLivableTypes.PartOfHomeUnusable,
    'Part of home is unusable (kitchen, bathroom)',
    'Part of home is unusable (kitchen, bathroom)',
    'Part of home is unusable (kitchen, bathroom)'
  ),
  HomeIsNotSecure: new BPResidenceNotLivable(
    EagleResidenceNotLivableTypes.HomeIsNotSecure,
    'Home is not secure (breach or damage)',
    'Home is not secure (breach or damage)',
    'Home is not secure (breach or damage)'
  ),
  PersonalChoice: new BPResidenceNotLivable(
    EagleResidenceNotLivableTypes.PersonalChoice,
    'Personal choice',
    'Personal choice',
    'Personal choice'
  ),
  MedicalCondition: new BPResidenceNotLivable(
    EagleResidenceNotLivableTypes.MedicalCondition,
    'Medical condition',
    'Medical condition',
    'Medical condition'
  ),
  Other: new BPResidenceNotLivable(
    EagleResidenceNotLivableTypes.Other,
    'Other',
    'Other',
    'Other'
  ),
}

export enum LiabilityTypes {
  Property = 1,
  Injury = 2,
  Animal = 4,
  Other = 8,
}

export const Liability = {
  Property: new BPLiability(
    LiabilityTypes.Property,
    'Damage to a third-party property-check',
    'Damage to a third-party property',
    'THIRDPARTYPROPERTY'
  ),
  Injury: new BPLiability(
    LiabilityTypes.Injury,
    'Injury to a third party-check',
    'Injury to a third party',
    'INJURY'
  ),
  Animal: new BPLiability(LiabilityTypes.Animal, 'Animal-check', 'Animal', 'ANIMAL'),
  Other: new BPLiability(LiabilityTypes.Other, 'Other-check', 'Other', 'OTHER'),
}

export enum Interior_Rooms {
  Room_1,
  Rooms_2,
  Rooms_3,
  Rooms_4,
  Rooms_5Plus,
}

export enum Mitigations {
  Mitigation_Yes = 0,
  Mitigation_No = 1,
}

export enum RoofAge {
  LessThanFiveYears,
  FiveToFourteenYears,
  FifteenYearsOrOlder,
}

export enum RoofType {
  Shingle,
  Tile,
  Metal,
  Other,
}

export enum HouseStories {
  OneStory,
  TwoStories,
  ThreeOrMoreStories,
}

export enum PoolType {
  AboveGround,
  InGround,
}

export enum PoolMaintenance {
  Professional,
  Self,
}

export enum FencingType {
  Wood,
  Vinyl,
  Chainlink,
  Other,
}

export enum UploadImageOptions {
  Upload,
  UploadLater,
  NoCameraAvailable,
  Cancel,
}

export const FNOLServerPrompts = {
  Introduction_Internal: new BPServerPrompt(FNOLServerPromptText.Introduction_Internal),
  Introduction_Agent: new BPServerPrompt(FNOLServerPromptText.Introduction_Agent),
  Introduction_Insured: new BPServerPrompt(FNOLServerPromptText.Introduction_Insured),
  WhatIsYourPolicyNumber: new BPServerPrompt(FNOLServerPromptText.WhatIsYourPolicyNumber, [
    FNOLPromptLinks.NoIDoNotHaveIt,
  ]),
  AreYouThePolicyHolder: new BPServerPrompt(FNOLServerPromptText.AreYouThePolicyHolder, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  IsTheCallerThePolicyholder: new BPServerPrompt(FNOLServerPromptText.IsTheCallerThePolicyholder, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  AmISpeakingWithThePolicyholder: new BPServerPrompt(
    FNOLServerPromptText.AmISpeakingWithThePolicyholder,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  WhoIsReportingThisClaim: new BPServerPrompt(FNOLServerPromptText.WhoIsReportingThisClaim, [
    OnBehalfOf.InsuranceAgent.link,
    OnBehalfOf.Attorney.link,
    OnBehalfOf.ContractorVendor.link,
    OnBehalfOf.PublicAdjuster.link,
    OnBehalfOf.CustomerServiceRepresentative.link,
    OnBehalfOf.Other.link,
  ]),
  ZipValidation: new BPServerPrompt(FNOLServerPromptText.ZipValidation),
  PolicyLookupLastName_Intro: new BPServerPrompt(FNOLServerPromptText.PolicyLookupLastName_Intro),
  PolicyLookupLastName_FirstTry: new BPServerPrompt(
    FNOLServerPromptText.PolicyLookupLastName_FirstTry
  ),
  PolicyLookupHouseNumber: new BPServerPrompt(FNOLServerPromptText.PolicyLookupHouseNumber),
  PolicyLookupZip: new BPServerPrompt(FNOLServerPromptText.PolicyLookupZip),
  WhenDidThisLossOccur: new BPServerPrompt(FNOLServerPromptText.WhenDidThisLossOccur),
  OffPremisesLossLocationTerminates: new BPServerPrompt(
    FNOLServerPromptText.OffPremisesLossLocationTerminates
  ),
  LiabilityTerminates: new BPServerPrompt(FNOLServerPromptText.LiabilityTerminates),
  ContactInformation: new BPServerPrompt(FNOLServerPromptText.ContactInformation, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  UpdatedContactInformation: new BPServerPrompt(FNOLServerPromptText.UpdatedContactInformation, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  WhatTypeOfLossDidThePropertySustain: new BPServerPrompt(
    FNOLServerPromptText.WhatTypeOfLossDidThePropertySustain
  ),
  WasTherePhysicalDamageToTheResidence: new BPServerPrompt(
    FNOLServerPromptText.WasTherePhysicalDamageToTheResidence,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  LossAssessmentDate: new BPServerPrompt(FNOLServerPromptText.LossAssessmentDate),
  LossAssessmentAmount: new BPServerPrompt(FNOLServerPromptText.LossAssessmentAmount),
  LossAssessmentWeatherRelated: new BPServerPrompt(
    FNOLServerPromptText.LossAssessmentWeatherRelated,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  LossAssessmentReason: new BPServerPrompt(FNOLServerPromptText.LossAssessmentReason),
  LossAssessmentLetter: new BPServerPrompt(FNOLServerPromptText.LossAssessmentLetter, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  UploadAssessmentLetterNow: new BPServerPrompt(FNOLServerPromptText.UploadAssessmentLetterNow, [
    FNOLPromptLinks.IDontHaveIt,
    FNOLPromptLinks.Upload,
  ]),
  ClickBelowToAddDocument: new BPServerPrompt(FNOLServerPromptText.ClickBelowToAddDocument),
  ClickBelowToAddPictures: new BPServerPrompt(FNOLServerPromptText.ClickBelowToAddPictures),
  WhatCausedTheWaterDamage: new BPServerPrompt(FNOLServerPromptText.WhatCausedTheWaterDamage, [
    WaterDamage.Plumbing.link,
    WaterDamage.Appliance.link,
    WaterDamage.HVAC.link,
    WaterDamage.Freezing.link,
    WaterDamage.Other.link,
  ]),
  WhatTypeOfPlumbing: new BPServerPrompt(FNOLServerPromptText.WhatTypeOfPlumbing, [
    Plumbing.Sink.link,
    Plumbing.Bathtub.link,
    Plumbing.Toilet.link,
    Plumbing.Dishwasher.link,
    Plumbing.WashingMachine.link,
    Plumbing.Aquarium.link,
    Plumbing.HVACRefrigerator.link,
    Plumbing.Other.link,
  ]),
  WhereDidTheDamageOccur: new BPServerPrompt(FNOLServerPromptText.WhereDidTheDamageOccur),
  Interior_IsThereStillStandingWater: new BPServerPrompt(
    FNOLServerPromptText.Interior_IsThereStillStandingWater,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  Interior_HowManyRoomsWereAffected: new BPServerPrompt(
    FNOLServerPromptText.Interior_HowManyRoomsWereAffected,
    [
      FNOLPromptLinks.OneRoom,
      FNOLPromptLinks.TwoRooms,
      FNOLPromptLinks.ThreeRooms,
      FNOLPromptLinks.FourRooms,
      FNOLPromptLinks.FiveRoomsOrMore,
    ]
  ),
  PostStorm_Interior_HowManyRoomsWereAffected: new BPServerPrompt(
    FNOLServerPromptText.PostStorm_Interior_HowManyRoomsWereAffected,
    [
      FNOLPromptLinks.OneRoom,
      FNOLPromptLinks.TwoRooms,
      FNOLPromptLinks.ThreeRooms,
      FNOLPromptLinks.FourRooms,
      FNOLPromptLinks.FiveRoomsOrMore,
    ]
  ),
  HaveStepsBeenTakenToContainTheDamage: new BPServerPrompt(
    FNOLServerPromptText.HaveStepsBeenTakenToContainTheDamage,
    [FNOLPromptLinks.Mitigation_Yes, FNOLPromptLinks.Mitigation_No]
  ),
  HaveYouReceivedAnEstimateForRepairs: new BPServerPrompt(
    FNOLServerPromptText.HaveYouReceivedAnEstimateForRepairs,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  UploadEstimateHere: new BPServerPrompt(FNOLServerPromptText.UploadEstimateHere, [
    FNOLPromptLinks.IDontHaveIt,
    FNOLPromptLinks.Upload,
  ]),
  PreviousEstimateNonBinding: new BPServerPrompt(FNOLServerPromptText.PreviousEstimateNonBinding),
  SubmitEstimates: new BPServerPrompt(FNOLServerPromptText.SubmitEstimates),
  PostStorm_SubmitEstimates: new BPServerPrompt(FNOLServerPromptText.PostStorm_SubmitEstimates),
  Exterior_HaveDebrisOrTreesCausedDamage: new BPServerPrompt(
    FNOLServerPromptText.Exterior_HaveDebrisOrTreesCausedDamage,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  PostStorm_Exterior_HaveDebrisOrTreesCausedDamage: new BPServerPrompt(
    FNOLServerPromptText.PostStorm_Exterior_HaveDebrisOrTreesCausedDamage,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  Exterior_IsResidenceOpenToTheElements: new BPServerPrompt(
    FNOLServerPromptText.Exterior_IsResidenceOpenToTheElements,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  PostStorm_Exterior_IsResidenceOpenToTheElements: new BPServerPrompt(
    FNOLServerPromptText.PostStorm_Exterior_IsResidenceOpenToTheElements,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  Roof_HasBeenBreached: new BPServerPrompt(FNOLServerPromptText.Roof_HasBeenBreached, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  PostStorm_Roof_HasBeenBreached: new BPServerPrompt(
    FNOLServerPromptText.PostStorm_Roof_HasBeenBreached,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  Roof_IsThereVisibleDamage: new BPServerPrompt(FNOLServerPromptText.Roof_IsThereVisibleDamage, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  Roof_WhereIsTheVisibleDamage: new BPServerPrompt(
    FNOLServerPromptText.Roof_WhereIsTheVisibleDamage
  ),
  Roof_IsThereWaterInTheHome: new BPServerPrompt(FNOLServerPromptText.Roof_IsThereWaterInTheHome, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  OtherStructures_WhatOtherStructuresWereDamaged: new BPServerPrompt(
    FNOLServerPromptText.OtherStructures_WhatOtherStructuresWereDamaged
  ),
  IsItSafeToRemainInTheResidence: new BPServerPrompt(
    FNOLServerPromptText.IsItSafeToRemainInTheResidence,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  WhyIsTheResidenceNotLivable: new BPServerPrompt(FNOLServerPromptText.WhyIsTheResidenceNotLivable),
  NotLivableFollowUp: new BPServerPrompt(FNOLServerPromptText.NotLivableFollowUp),
  ScanTheQRCodeBelow: new BPServerPrompt(FNOLServerPromptText.ScanTheQRCodeBelow, [
    FNOLPromptLinks.IHaveSwitchedDevices,
    FNOLPromptLinks.IllUploadLater,
  ]),
  IEncourageYouToKeepAnyDamagedProperty: new BPServerPrompt(
    FNOLServerPromptText.IEncourageYouToKeepAnyDamagedProperty,
    [FNOLPromptLinks.NoCameraAvailable, FNOLPromptLinks.UploadImages]
  ),
  ProvideLossDescription: new BPServerPrompt(FNOLServerPromptText.ProvideLossDescription),
  AdditionalClaimNotes: new BPServerPrompt(FNOLServerPromptText.AdditionalClaimNotes),
  ReviewInformation: new BPServerPrompt(FNOLServerPromptText.ReviewInformationTitle),
  LiabilityInformation: new BPServerPrompt(FNOLServerPromptText.LiabilityInformationTitle),
  SubmitLossAssessmentLetter: new BPServerPrompt(FNOLServerPromptText.SubmitLossAssessmentLetter),
  Legal: new BPServerPrompt(FNOLServerPromptText.Legal),
  Submit: new BPServerPrompt(FNOLServerPromptText.Submit, [FNOLPromptLinks.Submit]),
  ClaimHasBeenSubmitted: new BPServerPrompt(FNOLServerPromptText.ClaimHasBeenSubmitted),
  ClaimHasBeenSubmitted_InternalAgent: new BPServerPrompt(
    FNOLServerPromptText.ClaimHasBeenSubmitted_InternalAgent
  ),
  YouCanCloseThisWindowNow: new BPServerPrompt(FNOLServerPromptText.YouCanCloseThisWindowNow),
  SelectLiabilityType: new BPServerPrompt(FNOLServerPromptText.SelectLiabilityType, [
    FNOLPromptLinks.Liability_DamageToAThirdPartyProperty,
    FNOLPromptLinks.Liability_InjuryToAThirdParty,
    FNOLPromptLinks.Liability_Animal,
    FNOLPromptLinks.Liability_Other,
  ]),
  RetainLiabilityRecords: new BPServerPrompt(FNOLServerPromptText.RetainLiabilityRecords),
  AddThirdPartyClaimant: new BPServerPrompt(FNOLServerPromptText.AddThirdPartyClaimant, [
    FNOLPromptLinks.Add,
    FNOLPromptLinks.Skip,
  ]),
  ThirdPartyClaimantInformation: new BPServerPrompt(
    FNOLServerPromptText.ThirdPartyClaimantInformationTitle
  ),
  AddAttorney: new BPServerPrompt(FNOLServerPromptText.AddAttorney, [
    FNOLPromptLinks.Add,
    FNOLPromptLinks.Skip,
  ]),
  AttorneyInformation: new BPServerPrompt(FNOLServerPromptText.AttorneyInformationTitle),
  DescribeWhatWasStolen: new BPServerPrompt(FNOLServerPromptText.DescribeWhatWasStolen),
  HaveYouFiledAPoliceReport: new BPServerPrompt(FNOLServerPromptText.HaveYouFiledAPoliceReport, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  DoYouHaveThePoliceReportNumber: new BPServerPrompt(
    FNOLServerPromptText.DoYouHaveThePoliceReportNumber,
    [FNOLPromptLinks.IDontHaveIt]
  ),
  Roof_WhereIsTheWater: new BPServerPrompt(FNOLServerPromptText.Roof_WhereIsTheWater),
  Pool_WhatTypeOfPool: new BPServerPrompt(FNOLServerPromptText.Pool_WhatTypeOfPool, [
    FNOLPromptLinks.Pool_AboveGround,
    FNOLPromptLinks.Pool_InGround,
  ]),
  Fence_WhatTypeOfFencing: new BPServerPrompt(FNOLServerPromptText.Fence_WhatTypeOfFencing, [
    FNOLPromptLinks.Fencing_Wood,
    FNOLPromptLinks.Fencing_Vinyl,
    FNOLPromptLinks.Fencing_Chainlink,
    FNOLPromptLinks.Fencing_Other,
  ]),
  RetainRepairRecords: new BPServerPrompt(FNOLServerPromptText.RetainRepairRecords),
  UnableToFindMatchingPolicy: new BPServerPrompt(FNOLServerPromptText.UnableToFindMatchingPolicy, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  UnableToHelpWithThisClaimTerminal: new BPServerPrompt(
    FNOLServerPromptText.UnableToHelpWithThisClaimTerminal
  ),
  MaxPolicyLookupAttempts: new BPServerPrompt(FNOLServerPromptText.MaxPolicyLookupAttempts),
  CallCustomerService: new BPServerPrompt(FNOLServerPromptText.CallCustomerService),
  PromptForMitigation: new BPServerPrompt(FNOLServerPromptText.PromptForMitigation, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  PromptForMitigation_Internal: new BPServerPrompt(
    FNOLServerPromptText.PromptForMitigation_Internal,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  PromptForMitigation_Agent: new BPServerPrompt(FNOLServerPromptText.PromptForMitigation_Agent, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  PreferredVendorInformation: new BPServerPrompt(FNOLServerPromptText.PreferredVendorInformation),
  PreferredVendorInformation_InternalAgent: new BPServerPrompt(
    FNOLServerPromptText.PreferredVendorInformation_InternalAgent
  ),
  ReportClaimForWeatherEventSelection: new BPServerPrompt(
    FNOLServerPromptText.ReportClaimForWeatherEventSelection
  ),
  ReportClaimForWeatherEventSingle: new BPServerPrompt(
    FNOLServerPromptText.ReportClaimForWeatherEventSingle,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  ReportingFullName: new BPServerPrompt(FNOLServerPromptText.ReportingFullName),
  ReportingFullNameInternal: new BPServerPrompt(FNOLServerPromptText.ReportingFullName_Internal),
  RelationshipToPolicyHolder_Agent: new BPServerPrompt(
    FNOLServerPromptText.RelationshipToPolicyHolder_Agent
  ),
  RelationshipToPolicyHolder: new BPServerPrompt(FNOLServerPromptText.RelationshipToPolicyHolder),
  DidThisTheftOccurAtYourResidence: new BPServerPrompt(
    FNOLServerPromptText.DidThisTheftOccurAtYourResidence,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  WhereDidThisTheftOccur: new BPServerPrompt(FNOLServerPromptText.WhereDidThisTheftOccur),
  HasTheWaterBeenTurnedOff: new BPServerPrompt(FNOLServerPromptText.HasTheWaterBeenTurnedOff, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  HasPlumberRepairedTheDamage: new BPServerPrompt(
    FNOLServerPromptText.HasPlumberRepairedTheDamage,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  HasHVACCompanyRepairedTheIssue: new BPServerPrompt(
    FNOLServerPromptText.HasHVACCompanyRepairedTheIssue,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  PlumberInformation: new BPServerPrompt(FNOLServerPromptText.PlumberInformationTitle),
  HVACInformation: new BPServerPrompt(FNOLServerPromptText.HVACInformationTitle),
  Roof_Breached_WhatCausedTheHole: new BPServerPrompt(
    FNOLServerPromptText.Roof_Breached_WhatCausedTheHole
  ),
  Roof_Breached_CauseRemoved: new BPServerPrompt(FNOLServerPromptText.Roof_Breached_CauseRemoved, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  MitigationStepsDescription: new BPServerPrompt(FNOLServerPromptText.MitigationStepsDescription),
  DescribeItemsDamagedByHurricane: new BPServerPrompt(
    FNOLServerPromptText.DescribeItemsDamagedByHurricane
  ),
  LossPriorToEffectiveDateTerminates: new BPServerPrompt(
    FNOLServerPromptText.LossPriorToEffectiveDateTerminates
  ),
}

export const InvalidEmailList = {
  validEmailButStartsSpaces: '  fred@freddys.com',
  validEmailButEndsSpaces: 'fred@freddys.com ',
  validEmailButExtra: 'fred@freddys.com hi mom',
  invalidJustSpaces: '     ',
  invalidTabs: '    ',
  invalidEmailVariant0: 'plainaddress',
  invalidEmailVariant1: '#@%^%#$@#$@#.com',
  invalidEmailVariant2: '@example.com',
  invalidEmailVariant3: 'Joe Smith <email@example.com>',
  invalidEmailVariant4: 'email.example.com',
  invalidEmailVariant5: 'email@example@example.com',
  invalidEmailVariant6: '.email@example.com',
  invalidEmailVariant7: 'email.@example.com',
  invalidEmailVariant8: 'email..email@example.com',
  invalidEmailVariant9: 'あいうえお@example.com',
  invalidEmailVariantA: 'email@example.com (Joe Smith)',
  invalidEmailVariantB: 'email@example',
  invalidEmailVariantC: 'email@-example.com',
  invalidEmailVariantE: 'email@111.222.333.44444',
  invalidEmailVariantF: 'email@example..com',
  invalidEmailVariantG: 'Abc..123@example.com',
  invalidWeirdEmailVariant1: `”(),:;<>[\\]@example.com`,
  invalidWeirdEmailVariant2: `just”not”right@example.com`,
  invalidWeirdEmailVariant3: `this\\ is"really"not\\allowed@example.com`,
}

export const InvalidPhoneList = {
  invalidPhoneContainsLetters: '223-ABC-7890',
  invalidPhoneSpecialChars: `223-456-78@0`,
  invalidPhoneSymbol: '12#4567890',
  invalidPhoneTooShort: '1234567',
  invalidPhoneTooLong: '123456789012345',
  invalidPhoneMissing1Digit: '123456789',
  invalidPhoneTooManyDigits: '+1-800-555-1212-1234',
  invalidPhoneHasExtension: '+1 (123) 456-7890 ext123',
}
