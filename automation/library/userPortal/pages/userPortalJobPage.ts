import { Element } from '../../shared/element.js'
import { JobPageStrings } from '../userPortalConstants.js'
import { UserPortalGlobal } from '../userPortalGlobal.js'
import { UserPortalJob } from '../userPortalJob.js'
import { UserPortalBasePage } from './userPortalBasePage.js'

export class UserPortalJobPage extends UserPortalBasePage {
  readonly job: UserPortalJob
  readonly Label_Title: Element
  readonly Label_Badge: Element
  readonly baseURL: string
  constructor(global: UserPortalGlobal, job: UserPortalJob) {
    super(global)
    this.job = job
    this.baseURL = `${global.baseUrl}details/job/${job.jobDetails.jobId}`
    this.Label_Title = new Element(
      global.page,
      this.page.locator('h1').first(),
      `#${job.jobDetails.jobNumber}`
    )
    this.Label_Badge = new Element(
      global.page,
      this.Label_Title.locator.locator('..').locator('span').first(),
      JobPageStrings.Badge
    )
  }

  async WaitForLoad() {
    await this.page.waitForLoadState()
    await this.Label_Title.locator.waitFor({ state: 'visible' })
  }

  async VerifyJobNumber() {
    await this.Label_Title.VerifyExpectedText()
  }
}
