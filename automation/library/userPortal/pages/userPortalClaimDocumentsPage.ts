import { UserPortalClaim } from '../userPortalClaim.js'
import { UserPortalGlobal } from '../userPortalGlobal.js'
import { UserPortalClaimPage } from './userPortalClaimPage.js'
import { UserPortalDocumentsPage } from './userPortalDocumentsPage.js'

export class UserPortalClaimDocumentsPage extends UserPortalClaimPage {
  readonly Documents: UserPortalDocumentsPage
  readonly URL: string

  constructor(global: UserPortalGlobal, claim: UserPortalClaim) {
    super(global, claim)
    this.URL = `${this.baseURL}/documents`
    this.Documents = new UserPortalDocumentsPage(global)
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.NavigateDirectly(this.URL)
    } else {
      await this.leftNavBar.Link_Documents.Click()
    }
    await this.WaitForLoad()
  }
}
