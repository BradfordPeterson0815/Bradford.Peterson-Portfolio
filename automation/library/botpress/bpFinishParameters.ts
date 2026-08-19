import { UserTypes } from './bpConstants.js'
import { BPGlobal } from './bpGlobal.js'
import { BPMitigationVendor } from './bpMitigationVendor.js'
import { BPPolicy } from './bpPolicy.js'
import { BPResidenceNotLivable } from './bpResidenceNotLivable.js'
import { UploadImageOptions } from './clients/eagle/bpEagleConstants.js'

export class BPFinishParameters {
  policy: BPPolicy
  userType: UserTypes
  isLossAssessment: boolean
  skipBigChunk: boolean
  haveEstimate: boolean
  estimateToUpload: null | string
  skipEstimateForRepairs: boolean
  stopBeforeUpload: boolean
  imagesToUpload: null | string[]
  uploadImagesFlow: UploadImageOptions
  stopAtReviewDialog: boolean
  goBackAtReviewDialog: boolean
  thirdParty: boolean
  stopBeforeSubmit: boolean
  residenceNotLivableType: null | BPResidenceNotLivable
  lossDescription: string
  additionalClaimNotes: string
  isLiability: boolean
  mitigationVendors: BPMitigationVendor[]
  expectMitigation: boolean
  acceptMitigation: boolean
  acceptedMitigationVendor: null | BPMitigationVendor
  constructor(global: BPGlobal) {
    this.policy = global.policy
    this.userType = global.currentUserType
    this.isLossAssessment = false
    this.skipBigChunk = false
    this.haveEstimate = false
    this.estimateToUpload = null
    this.skipEstimateForRepairs = false
    this.stopBeforeUpload = false
    this.uploadImagesFlow = UploadImageOptions.UploadLater
    this.imagesToUpload = null
    this.stopAtReviewDialog = false
    this.goBackAtReviewDialog = false
    this.thirdParty = false
    this.stopBeforeSubmit = true
    this.residenceNotLivableType = null
    this.lossDescription = `This isn't just some Loss Description - it's a statement of fact`
    this.additionalClaimNotes = 'These are notes from an Agent or Claims Portal'
    this.isLiability = false
    this.mitigationVendors = []
    this.expectMitigation = false
    this.acceptMitigation = false
    this.acceptedMitigationVendor = null
  }
}
