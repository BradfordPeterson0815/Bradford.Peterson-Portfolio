import { Element } from '../../shared/element.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Locator } from 'playwright/test'
import { ClaimsPortalClaim } from '../claimsPortalClaim.js'
import { ClaimTimelineTabStrings } from '../claimsPortalConstants.js'

export class ClaimsPortalClaimTimelineTab extends ClaimsPortalBasePage {
  readonly claim: ClaimsPortalClaim
  readonly URL: string
  readonly Title: Element
  readonly timelineDateSections: Locator

  constructor(global: ClaimsPortalGlobal, claim: ClaimsPortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/timeline`
    this.Title = new Element(
      global.page,
      this.page.locator('.chakra-card__header h2'),
      ClaimTimelineTabStrings.Title
    )
    this.timelineDateSections = this.page.locator('.chakra-card__body > div > div')
  }
}
