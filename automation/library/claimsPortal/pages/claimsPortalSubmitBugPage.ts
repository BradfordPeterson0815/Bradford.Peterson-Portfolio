import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'
import { Element } from '../../shared/element.js'
import { ReportPortalIssuesPageStrings } from '../claimsPortalConstants.js'
import { claimsPortal } from '../../../environments/env.ceylon.js'

export class ClaimsPortalSubmitBugPage extends ClaimsPortalBasePage {
  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.URL = claimsPortal.SUBMIT_BUG_URL
  }

  async OpenInNewTabVerifyTitleAndClose() {
    const pagePromise = this.context.waitForEvent('page')
    await this.leftNavBar.Button_SubmitBug.Click()
    this.page = await pagePromise
    await this.page.waitForLoadState()
    await this.page.bringToFront()
    const Title = new Element(
      this.global.page,
      this.page.getByRole('heading', { name: `${ReportPortalIssuesPageStrings.Title}` }),
      ReportPortalIssuesPageStrings.Title
    )
    await Title.VerifyExpectedText()
    await this.page.close()
  }
}
