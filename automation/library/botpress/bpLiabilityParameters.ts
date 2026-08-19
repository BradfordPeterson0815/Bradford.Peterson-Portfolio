import { BPGlobal } from './bpGlobal.js'

export class BPLiabilityParameters {
  propertyDamage: string
  injury: string
  animal: string
  other: string
  claimant_FirstName: string | null
  claimant_LastName: string | null
  claimant_FullName: string | null
  claimant_Email: string
  claimant_Phone: string
  claimant_PhoneExtension: string
  claimant_Phone_Match: string
  attorney_FirstName: string | null
  attorney_LastName: string | null
  attorney_FullName: string | null
  attorney_Email: string
  attorney_Phone: string
  attorney_PhoneExtension: string
  attorney_Phone_Match: string
  attorney_Received: boolean
  attorney_ReceivedDocuments: string | null
  attorney_DocumentsDelivered: string | null
  skipDefaultFinish: boolean
  constructor(_: BPGlobal) {
    this.propertyDamage = 'This is property damage data'
    this.injury = 'This is injury data'
    this.animal = 'This is animal data'
    this.other = 'This isn‘t simple, it‘s a detailed loss description for liability'
    this.claimant_FirstName = null
    this.claimant_LastName = null
    this.claimant_FullName = null
    this.claimant_Email = 'claimant@a.com'
    this.claimant_Phone = '509-111-1111'
    this.claimant_PhoneExtension = '1234'
    this.claimant_Phone_Match = '+15091111111'
    this.attorney_FirstName = null
    this.attorney_LastName = null
    this.attorney_FullName = null
    this.attorney_Email = 'attorney@a.com'
    this.attorney_Phone = '509-222-1234'
    this.attorney_PhoneExtension = '777'
    this.attorney_Phone_Match = '+15092221234'
    this.attorney_Received = false
    this.attorney_ReceivedDocuments = null
    this.attorney_DocumentsDelivered = null
    this.skipDefaultFinish = false
  }
}
