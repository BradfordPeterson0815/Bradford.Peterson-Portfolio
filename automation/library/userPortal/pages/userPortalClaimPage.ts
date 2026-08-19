import { Element } from '../../shared/element.js'
import { UserPortalClaim } from '../userPortalClaim.js'
import { ClaimPageStrings } from '../userPortalConstants.js'
import { UserPortalGlobal } from '../userPortalGlobal.js'
import { UserPortalBasePage } from './userPortalBasePage.js'

export class UserPortalClaimPage extends UserPortalBasePage {
  readonly claim: UserPortalClaim
  readonly Label_Title: Element
  readonly Label_Badge: Element
  readonly baseURL: string
  constructor(global: UserPortalGlobal, claim: UserPortalClaim) {
    super(global)
    this.claim = claim
    this.baseURL = `${global.baseUrl}details/claim/${claim.claimProcess.claimNumber}`
    this.Label_Title = new Element(
      global.page,
      this.page.locator('h1').first(),
      claim.claimProcess.claimNumber
    )
    this.Label_Badge = new Element(
      global.page,
      this.Label_Title.locator.locator('..').locator('span').first(),
      ClaimPageStrings.Badge
    )
  }

  async WaitForLoad() {
    await this.page.waitForLoadState()
    await this.Label_Title.locator.waitFor({ state: 'visible' })
    await this.page.waitForTimeout(4000)
  }

  async VerifyClaimNumber() {
    await this.Label_Title.VerifyExpectedText()
  }
}
