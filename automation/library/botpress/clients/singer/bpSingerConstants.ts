import { BPDamageArea } from '../../bpDamageArea.js'
import { BPInteriorDamage } from '../../bpInteriorDamage.js'
import { BPLiability } from '../../bpLiability.js'
import { BPOnBehalfOf } from '../../bpOnBehalfOf.js'
import { BPOtherStructuresDamage } from '../../bpOtherStructuresDamage.js'
import { BPPlumbing } from '../../bpPlumbing.js'
import { BPResidenceNotLivable } from '../../bpResidenceNotLivable.js'
import { BPServerPrompt } from '../../bpServerPrompt.js'
import { BPWaterDamage } from '../../bpWaterDamage.js'
import { SingerDamageReason } from './bpSingerDamageReason.js'

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
export const Roof_HasBeenBreached_Yes = true
export const Roof_WaterThroughRoof_Yes = true
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

export const DaysPastLossDate_MaxAllowed = 7
export const DamageReasonFold = 7
export const ClaimsPortalPhone = '555-555-5555'
export const ClientEmail = 'claims@singerinsurance.com'

export enum MitigationVendors {
  Company,
  LittleFiresEverywhere,
  ShakeyShake,
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
  Introduction_Internal: "Hi! I'll be assisting you with reporting a claim.",
  Introduction_Insured: `Reporting the claim should only take 5-10 minutes. I'll ask you a few questions about the home and the loss that happened. I recommend that you use a cell phone, so you can take pictures of the damage.`,
  DoYouHaveThePolicyNumber: 'Please enter the policy number, if you have it.',
  IsEveryoneSafe: 'First, is everyone safe?',
  YourSafetyIsMyTopConcern:
    'Your safety is my top concern.\n\nIf you are in immediate physical danger, please find a safe place, dial 911 and continue this process later.\n\nIf you wish to speak to one our Customer Support experts, please call us at <CLAIMSPHONE>.\n\nYou may also continue this process, if you wish.',
  PolicyLookupLastName_Intro: 'Okay, I can help you find the policy number.',
  PolicyLookupLastName_FirstTry:
    'Please enter the last name of the primary policyholder as it appears on the Dec page of the policy. Please input last name only, in order to ensure accurate search results.',
  PolicyLookupHouseNumber: `Thank you. What's the house number associated with the policy? Please just enter the number, not the street name.`,
  PolicyLookupZip: `For security purposes, please verify the ZIP code of the insured property.`,
  AreYouThePolicyHolder: 'Are you the policyholder?',
  IsTheCallerThePolicyHolder: 'Is the caller the policyholder?',
  WhoIsReportingThisClaim: 'Who is reporting this claim?',
  ClaimReporterInformationTitle: "Please enter the claim reporter's information:",
  ContactInformation:
    'This is the contact information we currently have on file for the primary policyholder.\n\nPhone: <POLICYPHONENUMBER>\nEmail: <POLICYEMAIL>\n\nIs this information correct?',
  UpdatedContactInformation:
    'The contact information has been updated.\n\nPhone: <POLICYPHONENUMBER>\nEmail: <POLICYEMAIL>\n\nIs this information correct?',
  DidThisLossOccurAtThePolicyAddress: 'Did this loss occur at the address listed on the policy?',
  DescribeTheLocationOfThisLoss: 'Please describe the location of this loss:',
  WhenDidThisLossOccur: 'When did this loss occur?',
  WhatTypeOfLossDidThePropertySustain: 'What type of loss did the property sustain?',
  IndicateWhereTheDamageOccurred: 'Please indicate where the damage occurred:',
  WasTherePhysicalDamageToTheResidence: 'Was there any physical damage to the residence?',
  Interior_IsThereStillStandingWater: 'Is there still standing water?',
  Interior_HowManyRoomsWereAffected: 'How many rooms were affected?',
  PostStorm_Interior_HowManyRoomsWereAffected:
    'To the best of your knowledge, how many rooms were affected?',
  Interior_HaveStepsBeenTakenToContainTheDamage:
    'At this point, have any steps been taken to contain the <DAMAGEREASON> damage that was experienced?',
  PostStorm_Interior_HaveStepsBeenTakenToContainTheDamage:
    'At this point, have any steps been taken to contain the <DAMAGEREASON> damage that was experienced?',
  Exterior_HaveDebrisOrTreesCausedDamage:
    'Have debris or trees caused damage to the residence or property?',
  PostStorm_Exterior_HaveDebrisOrTreesCausedDamage:
    'Have debris or trees caused damage to your residence or property?',
  Exterior_IsResidenceOpenToTheElements:
    'Is the residence currently open to the elements (broken door/window/hole in roof, etc)?',
  PostStorm_Exterior_IsResidenceOpenToTheElements:
    'Is your home currently open to the elements (broken door, window, hole in roof, etc.)?',
  Roof_IsThereVisibleDamage: 'Is there visible damage to the roof?',
  PostStorm_Roof_IsThereVisibleDamage: 'Is there visible damage to the roof?',
  Roof_HasBeenBreached:
    'Has the roof been breached (can you see through the hole to the exterior of the home)?',
  PostStorm_Roof_HasBeenBreached:
    'Has the roof been breached (can you see through the hole to the exterior of the home)?',
  Roof_IsThereWaterInTheHome: 'Is there water in the home due to the roof damage?',
  OtherStructures_WhatOtherStructuresWereDamaged: 'Which other structures were damaged?',
  IsItSafeToRemainInTheResidence: 'Is it safe to remain in the residence?',
  WhyIsTheResidenceNotLivable: 'Why is the residence not livable?',
  NotLivableFollowUp:
    "In order to determine eligibility for assistance with additional living expenses, you will need to speak with one of our friendly Customer Support experts. Please call us at <CLAIMSPHONE> at your convenience.\n\nWe're almost there. After you answer the next few questions, I'll give you a claim number and will start the process of contacting the appropriate emergency services.",
  ScanTheQRCodeBelow:
    'Scan the QR code below to continue this conversation on your mobile device to take pictures of the damage.',
  IEncourageYouToPhotographTheDamage: `I encourage you to photograph the damage at this time. If you're unable to take pictures, a representative will contact you at a later date for more information.`,
  ProvideLossDescription:
    'In your own words, please provide a description of the loss that occurred:',
  AdditionalClaimNotes: 'Please enter any additional claim notes here:',
  ReviewInformationTitle: `Please review the information you're submitting:`,

  ContactInformationTitle:
    'The contact information we currently have on file is shown below. Please make any required edits and click Confirm.',
  Legal: `Any person who knowingly presents a false or fraudulent claim for payment of a loss or benefit or knowingly presents false information in an application for insurance is guilty of a crime and may be subject to fines and confinement in prison.`,
  Submit:
    'Please select Submit to acknowledge that you have read and understand the above statement and would like to report your claim now.',
  ClaimHasBeenSubmitted: `I've provided this information to our claims team. Your claim number is: <CLAIMNUMBER>.\n\nA representative from Singer Claims, our claims company, will be in contact with you within 24 hours to confirm your information and discuss next steps. You will also receive an email with this information shortly.`,
  ClaimHasBeenSubmitted_InternalAgent: `The claim number is: <CLAIMNUMBER>.\n\nA representative from Singer Claims will be in contact with the policyholder within 24 hours to discuss next steps. They will also receive an email with this information shortly.`,
  YouCanCloseThisWindowNow: 'You can close this window now.',
  ClickBelowToAddPictures: 'Click below to add pictures.',
  HaveYouReceivedAnEstimateForRepairs: 'Have you received an estimate for repairs?',
  UploadEstimateHere: 'Please upload the estimate(s) here:',
  ClickBelowToAddDocument: 'Click below to add the document.',
  LiabilityTerminates:
    'Unfortunately, liability claims require special assistance. To continue, please call our Customer Service representatives at <CLAIMSPHONE> for further assistance. Your FNOL number is',
  OffPremisesLossLocationTerminates:
    'Unfortunately, off-premises claims require special assistance. To continue, please call our Customer Service line at <CLAIMSPHONE> for further information.\n\nYou can close this window now.',
  UnableToFindMatchingPolicy:
    'I was unable to find a matching policy.\n\nWould you like to search again?',
  MaxPolicyLookupAttempts: "I'm sorry. I'm still unable to find a matching policy.",
  UnableToHelpWithThisClaimTerminal: `I am sorry, I am unable to help with this claim at this time. You may close this window now.`,
  CallCustomerService: `If you would like to speak with one of our friendly customer service experts for more assistance, please call us at <CLAIMSPHONE> at your convenience.`,
  PromptForMitigation: `Eagle can put you in contact with our preferred vendor, <VENDORNAME>, for any mitigation or restoration services you may need. Note that this service does not waive any policy conditions payment for services are your responsibility.\n\nWould you like to be contacted by <VENDORNAME>?`,
  PromptForMitigation_InternalAgent: `Please ask the policyholder at this time whether they would like to be referred to <VENDORNAME>, our preferred mitigation vendor.`,
  PreferredVendorInformation: `We've sent your information to a preferred vendor.\n\nYour vendor's information is:\n\n<VENDORNAME>\n<VENDORPHONE>\n<VENDOREMAIL>\n\nThey will be in contact with you within 24 hours.`,
  PreferredVendorInformation_InternalAgent: `We've sent the policyholder's information to a preferred vendor.\n\nThe vendor's information is:\n\n<VENDORNAME>\n<VENDORPHONE>\n<VENDOREMAIL>\n\nThey will be in contact with the policyholder within 24 hours.`,
  ZipValidation: 'What is the 5-digit ZIP code associated with the policy?',
  SelectLiabilityType:
    'Please select the applicable types of loss associated with this liability claim:',
  LiabilityInformationTitle:
    'Please use the form below to add additional information about the liability loss that occurred. Click Confirm when done.',
  RetainLiabilityRecords:
    'Instruct the caller to retain failed parts, take photos, save receipts, and documents, and to provide any additional documentation from individuals or attorneys related to the loss. The caller should fax, email, or mail these documents to our Claims department as soon as possible.',
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
  LossAssessmentReason: 'What is the reason for the loss assessment:',
  LossAssessmentLetter:
    'Do<ARTICLE> have an assessment letter from <POSSESSIVE> Condo Association?',
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
  PersonalProperty_FoodSpoilage: 'Is food spoilage the only damage that was sustained?',
  IsThereAnyOtherDamageInTheHome:
    'In addition to <DAMAGEREASON> damage, is there any other damage in the home?',
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
  ConfirmValues: 'Confirm Values',
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

export enum SingerOnBehalfOfTypes {
  InsuranceAgent,
  Attorney,
  ContractorVendor,
  PublicAdjuster,
  Other,
}

export const OnBehalfOf = {
  InsuranceAgent: new BPOnBehalfOf(
    SingerOnBehalfOfTypes.InsuranceAgent,
    FNOLPromptLinks.InsuranceAgent,
    'AGENT'
  ),
  Attorney: new BPOnBehalfOf(SingerOnBehalfOfTypes.Attorney, FNOLPromptLinks.Attorney, 'ATTORNEY'),
  ContractorVendor: new BPOnBehalfOf(
    SingerOnBehalfOfTypes.ContractorVendor,
    FNOLPromptLinks.ContractorVendor,
    'VENDOR'
  ),
  PublicAdjuster: new BPOnBehalfOf(
    SingerOnBehalfOfTypes.PublicAdjuster,
    FNOLPromptLinks.PublicAdjuster,
    'ADJUSTER'
  ),
  Other: new BPOnBehalfOf(SingerOnBehalfOfTypes.Other, FNOLPromptLinks.Other, 'OTHER'),
}

export enum SingerDamageReasonTypes {
  Water,
  Wind,
  LossAssessment,
  Hurricane,
  Hail,
  Lightning,
  Liability,
  Fire,
  Explosion,
  Sinkhole,
  Earthquake,
  VehicularDamage,
  Theft,
  Vandalism,
  FoodSpoilage,
  Other,
}

export const DamageReason = {
  Water: new SingerDamageReason(SingerDamageReasonTypes.Water, 'Water', 'Water'),
  Wind: new SingerDamageReason(SingerDamageReasonTypes.Wind, 'Wind', 'Wind'),
  LossAssessment: new SingerDamageReason(
    SingerDamageReasonTypes.LossAssessment,
    'Loss assessment',
    'LossAssessment'
  ), //'Loss assessment'),
  Hurricane: new SingerDamageReason(SingerDamageReasonTypes.Hurricane, 'Hurricane', 'Hurricane'),
  Hail: new SingerDamageReason(SingerDamageReasonTypes.Hail, 'Hail', 'Hail'),
  Lightning: new SingerDamageReason(SingerDamageReasonTypes.Lightning, 'Lightning', 'Lightning'),
  Liability: new SingerDamageReason(
    SingerDamageReasonTypes.Liability,
    'Liability - injury/physical damage',
    'Liability - injury/physical damage'
  ),
  Fire: new SingerDamageReason(SingerDamageReasonTypes.Fire, 'Fire', 'Fire'),
  Explosion: new SingerDamageReason(SingerDamageReasonTypes.Explosion, 'Explosion', 'Explosion'),
  Sinkhole: new SingerDamageReason(SingerDamageReasonTypes.Sinkhole, 'Sinkhole', 'Sinkhole'),
  Earthquake: new SingerDamageReason(SingerDamageReasonTypes.Earthquake, 'Earthquake', 'Earthquake'),
  VehicularDamage: new SingerDamageReason(
    SingerDamageReasonTypes.VehicularDamage,
    'Vehicular damage',
    'Vehicular damage'
  ),
  Theft: new SingerDamageReason(SingerDamageReasonTypes.Theft, 'Theft', 'Theft'),
  Vandalism: new SingerDamageReason(SingerDamageReasonTypes.Vandalism, 'Vandalism', 'Vandalism'),
  FoodSpoilage: new SingerDamageReason(
    SingerDamageReasonTypes.FoodSpoilage,
    'Food spoilage only',
    'Food spoilage only'
  ),
  Other: new SingerDamageReason(SingerDamageReasonTypes.Other, 'Other', 'Other'),
}

export enum SingerWaterDamageTypes {
  Plumbing,
  Appliance,
  RoofLeak,
  Freezing,
  Other,
}

export const WaterDamage = {
  Plumbing: new BPWaterDamage(SingerWaterDamageTypes.Plumbing, 'Plumbing', 'Plumbing'),
  Appliance: new BPWaterDamage(SingerWaterDamageTypes.Appliance, 'Appliance', 'Appliance'),
  RoofLeak: new BPWaterDamage(SingerWaterDamageTypes.RoofLeak, 'Roof leak', 'Roof leak'),
  Freezing: new BPWaterDamage(SingerWaterDamageTypes.Freezing, 'Freezing', 'Freezing'),
  Other: new BPWaterDamage(SingerWaterDamageTypes.Other, 'Other', 'Other'),
}

export enum SingerPlumbingTypes {
  Sink,
  Bathtub,
  Toilet,
  Dishwasher,
  WashingMachine,
  Aquarium,
  Other,
}

export const Plumbing = {
  Sink: new BPPlumbing(SingerPlumbingTypes.Sink, 'Sink', 'Sink'),
  Bathtub: new BPPlumbing(SingerPlumbingTypes.Bathtub, 'Bathtub', 'Bathtub'),
  Toilet: new BPPlumbing(SingerPlumbingTypes.Toilet, 'Toilet', 'Toilet'),
  Dishwasher: new BPPlumbing(SingerPlumbingTypes.Dishwasher, 'Dishwasher', 'Dishwasher'),
  WashingMachine: new BPPlumbing(
    SingerPlumbingTypes.WashingMachine,
    'Washing Machine',
    'Washing Machine'
  ),
  Aquarium: new BPPlumbing(SingerPlumbingTypes.Aquarium, 'Aquarium', 'Aquarium'),
  Other: new BPPlumbing(SingerPlumbingTypes.Other, 'Other', 'Other'),
}

export enum SingerDamageAreaTypes {
  Interior = 1,
  Exterior = 2,
  Roof = 4,
  ContentsOrPersonalProperty = 8,
  OtherStructures = 16,
}

export const DamageArea = {
  Interior: new BPDamageArea(
    SingerDamageAreaTypes.Interior,
    'Interior-check',
    'Interior',
    'INTERIOR'
  ),
  Exterior: new BPDamageArea(
    SingerDamageAreaTypes.Exterior,
    'Exterior-check',
    'Exterior',
    'EXTERIOR'
  ),
  Roof: new BPDamageArea(SingerDamageAreaTypes.Roof, 'Roof-check', 'Roof', 'ROOF', 'roof damage'),
  ContentsOrPersonalProperty: new BPDamageArea(
    SingerDamageAreaTypes.ContentsOrPersonalProperty,
    'Contents or personal property-check',
    'Contents or personal property',
    'CONTENTS'
  ),
  OtherStructures: new BPDamageArea(
    SingerDamageAreaTypes.OtherStructures,
    'Other structures-check',
    'Other structures',
    'OTHER STRUCTURES'
  ),
}

export enum SingerInteriorDamageTypes {
  WaterDamage = 1,
  PlumbingIssues = 2,
  ElectricalIssues = 4,
  TreeOnStructure = 8,
  SmokeDamage = 16,
  FireDamage = 32,
  DamagedEntrypoint = 64,
  Other = 128,
  None = 256,
}

export const InteriorDamage = {
  WaterDamage: new BPInteriorDamage(
    SingerInteriorDamageTypes.WaterDamage,
    'Water damage-check',
    'Water damage',
    'water damage'
  ),
  PlumbingIssues: new BPInteriorDamage(
    SingerInteriorDamageTypes.PlumbingIssues,
    'Plumbing issues-check',
    'Plumbing issues',
    'plumbing issues'
  ),
  ElectricalIssues: new BPInteriorDamage(
    SingerInteriorDamageTypes.ElectricalIssues,
    'Electrical issues-check',
    'Electrical issues',
    'electrical issues'
  ),
  TreeOnStructure: new BPInteriorDamage(
    SingerInteriorDamageTypes.TreeOnStructure,
    'Tree on structure-check',
    'Tree on structure',
    'tree on structure'
  ),
  SmokeDamage: new BPInteriorDamage(
    SingerInteriorDamageTypes.SmokeDamage,
    'Smoke damage-check',
    'Smoke damage',
    'smoke damage'
  ),
  FireDamage: new BPInteriorDamage(
    SingerInteriorDamageTypes.FireDamage,
    'Fire damage-check',
    'Fire damage',
    'fire damage'
  ),
  DamagedEntrypoint: new BPInteriorDamage(
    SingerInteriorDamageTypes.DamagedEntrypoint,
    'Damaged entrypoint-check',
    'Damaged entrypoint',
    'broken entrypoint'
  ),
  Other: new BPInteriorDamage(SingerInteriorDamageTypes.Other, 'Other-check', 'Other', 'other'),
  None: new BPInteriorDamage(SingerInteriorDamageTypes.None, 'None-check', 'None', 'none'),
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

export enum SingerResidenceNotLivableTypes {
  RequiredEvacuation,
  PartOfHomeUnusable,
  HomeIsNotSecure,
  PersonalChoice,
  Other,
}

export const ResidenceNotLivable = {
  RequiredEvacuation: new BPResidenceNotLivable(
    SingerResidenceNotLivableTypes.RequiredEvacuation,
    'Required evacuation',
    'Required evacuation',
    'Required evacuation'
  ),
  PartOfHomeUnusable: new BPResidenceNotLivable(
    SingerResidenceNotLivableTypes.PartOfHomeUnusable,
    'Part of home is unusable (kitchen, bathroom)',
    'Part of home is unusable (kitchen, bathroom)',
    'Part of home is unusable (kitchen, bathroom)'
  ),
  HomeIsNotSecure: new BPResidenceNotLivable(
    SingerResidenceNotLivableTypes.HomeIsNotSecure,
    'Home is not secure (breach or damage)',
    'Home is not secure (breach or damage)',
    'Home is not secure (breach or damage)'
  ),
  PersonalChoice: new BPResidenceNotLivable(
    SingerResidenceNotLivableTypes.PersonalChoice,
    'Personal choice',
    'Personal choice',
    'Personal choice'
  ),
  Other: new BPResidenceNotLivable(SingerResidenceNotLivableTypes.Other, 'Other', 'Other', 'Other'),
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

export enum Interior_Mitigations {
  SelfRepaired = 0,
  RepairedProfessionally = 1,
  NoRepairsCompleted = 2,
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
  IsEveryoneSafe: new BPServerPrompt(FNOLServerPromptText.IsEveryoneSafe, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  YourSafetyIsMyTopConcern: new BPServerPrompt(FNOLServerPromptText.YourSafetyIsMyTopConcern, [
    FNOLPromptLinks.ContinueThisProcess,
  ]),
  DoYouHaveThePolicyNumber: new BPServerPrompt(FNOLServerPromptText.DoYouHaveThePolicyNumber, [
    FNOLPromptLinks.NoIDoNotHaveIt,
  ]),
  AreYouThePolicyHolder: new BPServerPrompt(FNOLServerPromptText.AreYouThePolicyHolder, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  IsTheCallerThePolicyHolder: new BPServerPrompt(FNOLServerPromptText.IsTheCallerThePolicyHolder, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  WhoIsReportingThisClaim: new BPServerPrompt(FNOLServerPromptText.WhoIsReportingThisClaim, [
    OnBehalfOf.InsuranceAgent.link,
    OnBehalfOf.Attorney.link,
    OnBehalfOf.ContractorVendor.link,
    OnBehalfOf.PublicAdjuster.link,
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
    WaterDamage.RoofLeak.link,
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
    Plumbing.Other.link,
  ]),
  IndicateWhereTheDamageOccurred: new BPServerPrompt(
    FNOLServerPromptText.IndicateWhereTheDamageOccurred
  ),
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
  Interior_HaveStepsBeenTakenToContainTheDamage: new BPServerPrompt(
    FNOLServerPromptText.Interior_HaveStepsBeenTakenToContainTheDamage,
    [
      FNOLPromptLinks.RepairedItMyself,
      FNOLPromptLinks.RepairedProfessionally,
      FNOLPromptLinks.NoRepairsCompleted,
      FNOLPromptLinks.RepairedItThemselves,
    ]
  ),
  PostStorm_Interior_HaveStepsBeenTakenToContainTheDamage: new BPServerPrompt(
    FNOLServerPromptText.PostStorm_Interior_HaveStepsBeenTakenToContainTheDamage,
    [
      FNOLPromptLinks.RepairedItMyself,
      FNOLPromptLinks.RepairedProfessionally,
      FNOLPromptLinks.NoRepairsCompleted,
      FNOLPromptLinks.RepairedItThemselves,
    ]
  ),
  HaveYouReceivedAnEstimateForRepairs: new BPServerPrompt(
    FNOLServerPromptText.HaveYouReceivedAnEstimateForRepairs,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  UploadEstimateHere: new BPServerPrompt(FNOLServerPromptText.UploadEstimateHere, [
    FNOLPromptLinks.IDontHaveIt,
    FNOLPromptLinks.Upload,
  ]),
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
  Roof_IsThereVisibleDamage: new BPServerPrompt(FNOLServerPromptText.Roof_IsThereVisibleDamage, [
    FNOLPromptLinks.Yes,
    FNOLPromptLinks.No,
  ]),
  PostStorm_Roof_IsThereVisibleDamage: new BPServerPrompt(
    FNOLServerPromptText.PostStorm_Roof_IsThereVisibleDamage,
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
  IEncourageYouToPhotographTheDamage: new BPServerPrompt(
    FNOLServerPromptText.IEncourageYouToPhotographTheDamage,
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
  PromptForMitigation_InternalAgent: new BPServerPrompt(
    FNOLServerPromptText.PromptForMitigation_InternalAgent,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  PreferredVendorInformation: new BPServerPrompt(FNOLServerPromptText.PreferredVendorInformation),
  PreferredVendorInformation_InternalAgent: new BPServerPrompt(
    FNOLServerPromptText.PreferredVendorInformation_InternalAgent
  ),
  DidThisLossOccurAtThePolicyAddress: new BPServerPrompt(
    FNOLServerPromptText.DidThisLossOccurAtThePolicyAddress,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  DescribeTheLocationOfThisLoss: new BPServerPrompt(
    FNOLServerPromptText.DescribeTheLocationOfThisLoss
  ),
  PersonalProperty_FoodSpoilage: new BPServerPrompt(
    FNOLServerPromptText.PersonalProperty_FoodSpoilage,
    [FNOLPromptLinks.Yes, FNOLPromptLinks.No]
  ),
  IsThereAnyOtherDamageInTheHome: new BPServerPrompt(
    FNOLServerPromptText.IsThereAnyOtherDamageInTheHome
  ),
}
