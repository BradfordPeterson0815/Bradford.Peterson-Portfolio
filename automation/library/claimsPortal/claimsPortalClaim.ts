type ISomeType = { [key: string]: unknown }
export class ClaimsPortalClaim {
  primaryContact: {
    name: string
    phone: string
    email: string
  }
  basicInfo: {
    claimNumber: string
    policyNumber: string
    dataSourceID: string
    dataSource: string
    xaImportStatus: string
    carrier: string
    coordinator: string
    fieldAgent: string
    inspectionTech: string
    projectManager: string
    reviewer: string
    hasLegalRep: string
    hasJob: string
    claimStatus: string
  }
  lossInformation: {
    date: string
    type: string
    catCode: string
    claimFactors: string
    initalClaimActions: string
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
  claimReviews: unknown
  testData: {
    claimsContact: string
    removedContact: string
    claimsDocument: string
    claimsMedia: string
    callbackSearch: string
    documentDescription: string
    versionedDocument: string
    versionedMedia: string
    claimCallbackSearch: string
    claimTimelineCount: number
    timelineEventDescription: string
    timelineEventDateTime: string
    claimInspectionSuffix: string
    claimInspectionDescription: string
    claimInspectionDescriptionOther: string
    claimInspectionOrganizer: string
    claimInspectionDuration: string
    claimInspectionScreenshot: string
    claimInspectionScreenshotOther: string
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
    claimPhotoReportNewest: string
    claimPortalAccessContact: string
    inactiveFieldAgent: string
    removedFilterContact: string
    carrierBookContact: string
    claimsBookContact: string
    estimatorNoItems: string
    estimator1: string
    estimator2: string
    claimLossOfUseAmount: string
    claimLossOfUseType: string
    claimLossOfUseId: string
    claimLossOfUseReceiptNote: string
  }
  constructor(claimNumber: string) {
    this.primaryContact = { name: '', phone: '', email: '' }
    this.basicInfo = {
      claimNumber: claimNumber,
      policyNumber: '',
      dataSourceID: '',
      dataSource: '',
      xaImportStatus: '',
      carrier: '',
      coordinator: '',
      fieldAgent: '',
      inspectionTech: '',
      projectManager: '',
      reviewer: '',
      hasLegalRep: '',
      hasJob: '',
      claimStatus: '',
    }
    this.lossInformation = {
      date: '',
      type: '',
      catCode: '',
      claimFactors: '',
      initalClaimActions: '',
      description: '',
    }
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
    this.claimReviews = {}
    this.testData = {
      claimsContact: '',
      removedContact: '',
      claimsDocument: '',
      claimsMedia: '',
      callbackSearch: '',
      documentDescription: '',
      versionedDocument: '',
      versionedMedia: '',
      claimCallbackSearch: '',
      claimTimelineCount: 0,
      claimInspectionDescription: '',
      claimInspectionDescriptionOther: '',
      claimInspectionOrganizer: '',
      claimInspectionDuration: '',
      timelineEventDateTime: '',
      timelineEventDescription: '',
      claimInspectionSuffix: '',
      claimInspectionScreenshot: '',
      claimInspectionScreenshotOther: '',
      claimInspectionTranscript: '',
      claimNotesSearchFullyExported: '',
      claimNotesSearchNotExported: '',
      claimNotesFilterOnName: {},
      claimNotesFilterOnRole: {},
      claimPortalAccessContact: '',
      inactiveFieldAgent: '',
      removedFilterContact: '',
      carrierBookContact: '',
      claimsBookContact: '',
      estimatorNoItems: '',
      estimator1: '',
      estimator2: '',
      claimLossOfUseAmount: '',
      claimLossOfUseType: '',
      claimLossOfUseId: '',
      claimLossOfUseReceiptNote: '',
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
      claimPhotoReportNewest: '',
    }
  }
}
