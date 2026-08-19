import { UserPortalGlobal } from '../userPortalGlobal.js'
import { UserPortalJob } from '../userPortalJob.js'
import { UserPortalDocumentsPage } from './userPortalDocumentsPage.js'
import { UserPortalJobPage } from './userPortalJobPage.js'

export class UserPortalJobDocumentsPage extends UserPortalJobPage {
  readonly Documents: UserPortalDocumentsPage
  readonly URL: string

  constructor(global: UserPortalGlobal, job: UserPortalJob) {
    super(global, job)
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
