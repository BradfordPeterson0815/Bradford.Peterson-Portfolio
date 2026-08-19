import { UserPortalClaim } from '../userPortalClaim.js'
import { UserPortalGlobal } from '../userPortalGlobal.js'
import { UserPortalClaimPage } from './userPortalClaimPage.js'
import { UserPortalMediaPage } from './userPortalMediaPage.js'

export class UserPortalClaimMediaPage extends UserPortalClaimPage {
  readonly Media: UserPortalMediaPage
  readonly URL: string

  constructor(global: UserPortalGlobal, claim: UserPortalClaim) {
    super(global, claim)
    this.URL = `${this.baseURL}/media`
    this.Media = new UserPortalMediaPage(global)
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.NavigateDirectly(this.URL)
    } else {
      await this.leftNavBar.Link_Media.Click()
    }
    await this.WaitForLoad()
  }

  async WaitForLoad() {
    await this.global.page.waitForLoadState()
    await this.Label_Title.locator.waitFor({ state: 'visible' })
    await this.global.page.waitForTimeout(4000)
  }
}
