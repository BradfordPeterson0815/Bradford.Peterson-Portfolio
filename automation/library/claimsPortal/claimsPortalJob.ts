type ISomeType = { [key: string]: unknown }
export class ClaimsPortalJob {
  jobDetails: {
    jobNumber: string
    jobId: string
    associatedClaim: string
    type: string
    services: string[]
    description: string
  }
  jobAssignments: {
    coordinator: string
    projectManager: string
    approver: string
    dispatcher: string
    fieldTech: string
    subcontractor: string
  }
  jobLocation: {
    fullAddress: string
    addressLine1: string
    addressLine2: string
    addressType: string
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
  workAuthorization: {
    status: string
    sentDate: string
    sentMethod: string
    recipient: string
    effectiveDate: string
    approvedBy: string
    signer: string
  }
  workDetails: {
    workType: string
    tarpArea: string
    timeOfService: string
    fastenerType: string
    roofPitch: string
    serviceDate: string
    highRoof: boolean
  }
  testData: {
    claimsContact: string
    removedContact: string
    claimsDocument: string
    claimsMedia: string
    callbackSearch: string
    documentDescription: string
    versionedDocument: string
    versionedMedia: string
    jobTimelineCount: number
    jobTimelineDateCount: number
    jobInspectionDescription: string
    jobInspectionDuration: string
    jobInspectionSuffix: string
    jobInspectionDescriptionOther: string
    jobInspectionOrganizer: string
    jobInspectionScreenshot: string
    jobInspectionScreenshotOther: string
    jobInspectionTranscript: string
    jobNotesSearch: string
    jobNotesFilterOnName: ISomeType
    jobNotesFilterOnRole: ISomeType
    jobPortalAccessContact: string
    jobInactiveGlobalContact: string
    jobRemovedGlobalContact: string
    jobWorkAuthSearch: string
  }
  constructor(jobNumber: string, jobId: string) {
    this.jobDetails = {
      jobNumber: jobNumber,
      jobId: jobId,
      associatedClaim: '',
      type: '',
      services: [],
      description: '',
    }
    this.jobAssignments = {
      coordinator: '',
      projectManager: '',
      approver: '',
      dispatcher: '',
      fieldTech: '',
      subcontractor: '',
    }
    this.jobLocation = {
      fullAddress: '',
      addressLine1: '',
      addressLine2: '',
      addressType: '',
      city: '',
      county: '',
      state: '',
      zipCode: '',
      map: '',
      mapStreet: '',
    }
    this.contact = { name: '', phone: '', email: '' }
    this.workAuthorization = {
      status: '',
      sentDate: '',
      sentMethod: '',
      recipient: '',
      effectiveDate: '',
      approvedBy: '',
      signer: '',
    }
    this.workDetails = {
      workType: '',
      tarpArea: '',
      timeOfService: '',
      fastenerType: '',
      roofPitch: '',
      serviceDate: '',
      highRoof: false,
    }
    this.testData = {
      claimsContact: '',
      removedContact: '',
      claimsDocument: '',
      claimsMedia: '',
      callbackSearch: '',
      documentDescription: '',
      versionedDocument: '',
      versionedMedia: '',
      jobTimelineCount: 0,
      jobTimelineDateCount: 0,
      jobInspectionDescription: '',
      jobInspectionDuration: '',
      jobInspectionSuffix: '',
      jobInspectionDescriptionOther: '',
      jobInspectionOrganizer: '',
      jobInspectionScreenshot: '',
      jobInspectionScreenshotOther: '',
      jobInspectionTranscript: '',
      jobNotesSearch: '',
      jobNotesFilterOnName: {},
      jobNotesFilterOnRole: {},
      jobPortalAccessContact: '',
      jobInactiveGlobalContact: '',
      jobRemovedGlobalContact: '',
      jobWorkAuthSearch: '',
    }
  }
}
