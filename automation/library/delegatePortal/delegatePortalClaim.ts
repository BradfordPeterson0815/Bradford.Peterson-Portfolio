type ISomeType = { [key: string]: unknown }
export class DelegatePortalClaim {
  basicInfo: {
    claimNumber: string
    policyNumber: string
    reactedID: string
    carrier: string
    coordinator: string
    fieldAgent: string
    inspectionTech: string
    hasLegalRep: string
    hasJob: string
    claimStatus: string
  }
  lossInformation: {
    date: string
    type: string
    catCode: string
    claimFactors: string
    description: string
  }
  lossLocation: {
    fullAddress: string
    addressType: string
    street: string
    secondaryStreet: string
    city: string
    county: string
    state: string
    zipCode: string
    map: string
    mapStreet: string
  }
  contact: {
    name: string
    phone: string
    email: string
  }
  testData: {
    claimCallbackSearch: string
    claimContactRedacted: string
    claimContactClaims: string
    claimsDocument: string
    claimsMedia: string
    documentDescription: string
    versionedDocument: string
    versionedMedia: string
    claimTimelineCount: number
    claimInspectionSuffix: string
    claimInspectionSuffixAlt: string
    claimInspectionDescription: string
    claimInspectionDescriptionOther: string
    claimInspectionOrganizer: string
    claimInspectionDuration: string
    claimInspectionDurationAlt: string
    claimInspectionScreenshot: string
    claimInspectionScreenshotAlt: string
    claimInspectionScreenshotOther: string
    claimInspectionScreenshotOtherAlt: string
    claimInspectionTranscript: string
    claimNotesSearchFullyExported: string
    claimNotesSearchNotExported: string
    claimNotesFilterOnName: ISomeType
    claimNotesFilterOnRole: ISomeType
    claimEstimatesNotes: string
    claimEstimatesNotesOther: string
    claimEstimatesSubmittedBy: string
    claimEstimateId: string
    claimEstimateType: string
    claimEstimateExternalSource: string
    claimEstimateExternalSourceId: string
    claimEstimateSubmissionDate: string
    claimEstimateSubmittedBy: string
    claimEstimateNotes: string
  }
  constructor(claimNumber: string) {
    this.basicInfo = {
      claimNumber: claimNumber,
      policyNumber: '',
      reactedID: '',
      carrier: '',
      coordinator: '',
      fieldAgent: '',
      inspectionTech: '',
      hasLegalRep: '',
      hasJob: '',
      claimStatus: '',
    }
    this.lossInformation = { date: '', type: '', catCode: '', claimFactors: '', description: '' }
    this.lossLocation = {
      fullAddress: '',
      addressType: '',
      street: '',
      secondaryStreet: '',
      city: '',
      county: '',
      state: '',
      zipCode: '',
      map: '',
      mapStreet: '',
    }
    this.contact = { name: '', phone: '', email: '' }
    this.testData = {
      claimCallbackSearch: '',
      claimContactRedacted: '',
      claimContactClaims: '',
      claimsDocument: '',
      claimsMedia: '',
      documentDescription: '',
      versionedDocument: '',
      versionedMedia: '',
      claimTimelineCount: 0,
      claimInspectionSuffix: '',
      claimInspectionSuffixAlt: '',
      claimInspectionDescription: '',
      claimInspectionDescriptionOther: '',
      claimInspectionOrganizer: '',
      claimInspectionDuration: '',
      claimInspectionDurationAlt: '',
      claimInspectionScreenshot: '',
      claimInspectionScreenshotAlt: '',
      claimInspectionScreenshotOther: '',
      claimInspectionScreenshotOtherAlt: '',
      claimInspectionTranscript: '',
      claimNotesSearchFullyExported: '',
      claimNotesSearchNotExported: '',
      claimNotesFilterOnName: {},
      claimNotesFilterOnRole: {},
      claimEstimatesNotes: '',
      claimEstimatesNotesOther: '',
      claimEstimatesSubmittedBy: '',
      claimEstimateId: '',
      claimEstimateType: '',
      claimEstimateExternalSource: '',
      claimEstimateExternalSourceId: '',
      claimEstimateSubmissionDate: '',
      claimEstimateSubmittedBy: '',
      claimEstimateNotes: '',
    }
  }
}
