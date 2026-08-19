type ISomeType = { [key: string]: unknown }
import { MediaCardData } from './delegatePortalMediaCard.js'
export class DelegatePortalJob {
  jobDetails: {
    jobNumber: string
    jobId: string
    associatedClaim: string
    type: string
    services: string[]
    description: string
  }
  jobAssignments: {
    primaryContact: string
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
  workDetails: {
    workType: string
    tarpArea: string
    timeOfService: string
    fastenerType: string
    roofPitch: string
    serviceDate: string
    highRoof: boolean
  }
  contact: {
    name: string
    phone: string
    email: string
  }
  testData: {
    callbackSearch: string
    document: string
    documentDescription: string
    versionedDocument: string
    versionedMedia: string
    mediaCards: MediaCardData[]
    jobNotesFilterOnName: ISomeType
    jobNotesFilterOnRole: ISomeType
    jobNotesSearch: string
    jobVisualizerCount: number
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
      primaryContact: '',
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
    this.workDetails = {
      workType: '',
      tarpArea: '',
      timeOfService: '',
      fastenerType: '',
      roofPitch: '',
      serviceDate: '',
      highRoof: false,
    }
    this.contact = { name: '', phone: '', email: '' }
    this.testData = {
      callbackSearch: '',
      document: '',
      documentDescription: '',
      versionedDocument: '',
      versionedMedia: '',
      mediaCards: [],
      jobNotesFilterOnName: {},
      jobNotesFilterOnRole: {},
      jobNotesSearch: '',
      jobVisualizerCount: 0,
    }
  }
}
