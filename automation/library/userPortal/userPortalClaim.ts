//type ISomeType = { [key: string]: unknown }

import { MediaCardData } from './userPortalMediaCard.js'
type contact = { name: string; phone: string; email: string }
export class UserPortalClaim {
  claimProcess: {
    claimNumber: string
    status: string
    coordinator: string
    fieldAgentName: string
    scheduledAppointmentDate: string
  }
  claimDetails: {
    lossDate: string
    lossType: string
    lossDescription: string
  }
  lossLocation: {
    street: string
    secondaryStreet: string
    city: string
    county: string
    state: string
    zipCode: string
  }
  testData: {
    claimVisualizerCount: number
    document: string
    documentDescription: string
    versionedDocument: string
    mediaCards: MediaCardData[]
    claimContact: contact
    estimateContact: contact
    jobContact: contact
  }
  constructor(claimNumber: string) {
    this.claimProcess = {
      claimNumber: claimNumber,
      status: '',
      coordinator: '',
      fieldAgentName: '',
      scheduledAppointmentDate: '',
    }
    this.claimDetails = { lossDate: '', lossType: '', lossDescription: '' }
    this.lossLocation = {
      street: '',
      secondaryStreet: '',
      city: '',
      county: '',
      state: '',
      zipCode: '',
    }
    this.testData = {
      claimVisualizerCount: 0,
      document: '',
      documentDescription: '',
      versionedDocument: '',
      mediaCards: [],
      claimContact: { name: '', phone: '', email: '' },
      estimateContact: { name: '', phone: '', email: '' },
      jobContact: { name: '', phone: '', email: '' },
    }
  }
}
