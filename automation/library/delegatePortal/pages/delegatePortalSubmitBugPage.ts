import { Element } from '../../shared/element.js'
import { delegatePortal } from '../../../environments/env.ceylon.js'
import { DelegatePortalBasePage } from './delegatePortalBasePage.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { ReportPortalIssuesPageStrings } from '../delegatePortalConstants.js'

export class DelegatePortalSubmitBugPage extends DelegatePortalBasePage {
  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.URL = delegatePortal.SUBMIT_BUG_URL
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
