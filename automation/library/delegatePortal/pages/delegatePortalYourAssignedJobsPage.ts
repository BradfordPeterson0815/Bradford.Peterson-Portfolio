import { Element } from '../../shared/element.js'
import { DataTable_Columns_Type, YourAssignedJobsPageStrings } from '../delegatePortalConstants.js'
import { DelegatePortalDataTable } from '../delegatePortalDataTable.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalJob } from '../delegatePortalJob.js'
import { DelegatePortalBasePage } from './delegatePortalBasePage.js'
import { DelegatePortalJobPage } from './delegatePortalJobPage.js'

export class DelegatePortalYourAssignedJobsPage extends DelegatePortalBasePage {
  readonly Title: Element
  readonly DataTable_YourAssignedJobs: DelegatePortalDataTable
  readonly parent: string

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${YourAssignedJobsPageStrings.Title}` }),
      YourAssignedJobsPageStrings.Title
    )
    this.URL = `${global.baseUrl}jobs`
    this.parent = `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]`
    this.DataTable_YourAssignedJobs = new DelegatePortalDataTable(global, this.parent, 1)
  }

  async WaitForLoad() {
    await this.page.waitForLoadState()
    await this.DataTable_YourAssignedJobs.table.waitFor({ state: 'visible' })
    // if (this.global.isMobile) {
    // }
  }

  async NavigateToPage() {
    await this.NavigateDirectly(this.global.baseUrl)
    await this.WaitForLoad()
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async OpenRandomJob() {
    const getRowCount = await this.DataTable_YourAssignedJobs.VisibleRowCount()
    if (getRowCount === 0) {
      throw new Error('No jobs to choose from')
    }
    const randomRowPosition = Math.floor(Math.random() * getRowCount) + 1
    const rowIndex =
      await this.DataTable_YourAssignedJobs.FetchRowIndexFromRowPosition(randomRowPosition)
    const jobLabel = await this.DataTable_YourAssignedJobs.FetchRowTextDataByColumnName(
      rowIndex,
      DataTable_Columns_Type.Jobs_JobLabel
    )
    const jobHref = await this.DataTable_YourAssignedJobs.FetchRowHrefDataByColumnName(
      rowIndex,
      DataTable_Columns_Type.Jobs_JobLabel
    )
    const jobId = jobHref.split('/')[2]
    const testJob = new DelegatePortalJob(jobLabel, jobId)
    const jobPage = new DelegatePortalJobPage(this.global, testJob)
    await jobPage.NavigateDirectlyToJob()
    return { jobPage, testJob }
  }

  async OpenJob(job: DelegatePortalJob) {
    const table = this.DataTable_YourAssignedJobs
    await table.SetTableFilter_Text(job.jobDetails.jobNumber, DataTable_Columns_Type.Jobs_JobLabel)
    const rowPosition = 1
    const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
    await table.ClickLinkInDataCell(rowIndex, DataTable_Columns_Type.Jobs_JobLabel)
    const jobPage = new DelegatePortalJobPage(this.global, job)
    const expectedLandingURL = `**/${jobPage.baseURL}/**`
    await this.page.waitForURL(expectedLandingURL)
    return jobPage
  }
}
