import { MediaCardData } from './userPortalMediaCard.js'
type contact = { name: string; phone: string; email: string }
export class UserPortalJob {
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
    fieldTechs: string[]
    subcontractors: string[]
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
    jobVisualizerCount: number
    document: string
    documentDescription: string
    versionedDocument: string
    mediaCards: MediaCardData[]
    claimContact: contact
    jobContact: contact
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
      fieldTechs: [],
      subcontractors: [],
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
      jobVisualizerCount: 0,
      document: '',
      documentDescription: '',
      versionedDocument: '',
      mediaCards: [],
      claimContact: { name: '', phone: '', email: '' },
      jobContact: { name: '', phone: '', email: '' },
    }
  }
}
