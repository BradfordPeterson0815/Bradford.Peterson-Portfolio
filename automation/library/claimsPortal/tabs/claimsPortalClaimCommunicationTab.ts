import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalClaim } from '../claimsPortalClaim.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'

export class ClaimsPortalClaimCommunicationTab extends ClaimsPortalBasePage {
  readonly claim: ClaimsPortalClaim
  readonly URL: string

  constructor(global: ClaimsPortalGlobal, claim: ClaimsPortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/communication`
  }
}
