import { Element } from '../../shared/element.js'
import { Locator } from '@playwright/test'
import { DelegatePortalBasePage } from '../pages/delegatePortalBasePage.js'
import { DelegatePortalClaim } from '../delegatePortalClaim.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { ClaimTimelineTabStrings } from '../delegatePortalConstants.js'

export class DelegatePortalClaimTimelineTab extends DelegatePortalBasePage {
  readonly claim: DelegatePortalClaim
  readonly URL: string
  readonly Title: Element
  readonly timelineDateSections: Locator

  constructor(global: DelegatePortalGlobal, claim: DelegatePortalClaim, claimPageURL: string) {
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
