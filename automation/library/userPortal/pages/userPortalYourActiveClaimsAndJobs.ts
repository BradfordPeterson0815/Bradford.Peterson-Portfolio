import { Element } from '../../shared/element.js'
import { UserPortalClaim } from '../userPortalClaim.js'
import { DataTable_Columns_Type, YourActiveClaimsAndJobsPageStrings } from '../userPortalConstants.js'
import { UserPortalDataTable } from '../userPortalDataTable.js'
import { UserPortalGlobal } from '../userPortalGlobal.js'
import { UserPortalJob } from '../userPortalJob.js'
import { UserPortalBasePage } from './userPortalBasePage.js'
import { UserPortalClaimDetailsPage } from './userPortalClaimDetailsPage.js'
import { UserPortalJobDetailsPage } from './userPortalJobDetailsPage.js'

export class UserPortalYourActiveClaimsAndJobsPage extends UserPortalBasePage {
  readonly Title: Element
  readonly DataTable_Claims: UserPortalDataTable
  readonly DataTable_Jobs: UserPortalDataTable

  constructor(global: UserPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${YourActiveClaimsAndJobsPageStrings.Title}` }),
      YourActiveClaimsAndJobsPageStrings.Title
    )
    this.URL = global.baseUrl
    this.DataTable_Claims = new UserPortalDataTable(global, '#multi-claims-step_content', 1)
    this.DataTable_Jobs = new UserPortalDataTable(global, '#multi-jobs-step_content', 1)
  }

  async WaitForLoad() {
    await this.page.waitForLoadState()
    await this.DataTable_Claims.table.waitFor({ state: 'visible' })
  }

  async NavigateToPage() {
    await this.NavigateDirectly(this.global.baseUrl)
    await this.WaitForLoad()
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async OpenRandomClaim() {
    const getRowCount = await this.DataTable_Claims.VisibleRowCount()
    if (getRowCount === 0) {
      throw new Error('No claims to choose from')
    }
    const randomRowIndex = Math.floor(Math.random() * getRowCount) + 1
    const actualIndex = await this.DataTable_Claims.FetchRowIndexFromRowPosition(randomRowIndex)
    const claimNumber = await this.DataTable_Claims.FetchRowTextDataByColumnName(
      actualIndex,
      DataTable_Columns_Type.Claims_ClaimNumber
    )
    const testClaim = new UserPortalClaim(claimNumber)
    const claimPage = new UserPortalClaimDetailsPage(this.global, testClaim)
    await claimPage.NavigateToPage(true)
    return { claimPage, testClaim }
  }

  async OpenClaim(claim: UserPortalClaim) {
    await this.DataTable_Claims.SetTableFilter_Text(
      claim.claimProcess.claimNumber,
      DataTable_Columns_Type.Claims_ClaimNumber
    )
    const rowPosition = 1
    const rowIndex = await this.DataTable_Claims.FetchRowIndexFromRowPosition(rowPosition)
    await this.DataTable_Claims.ClickLinkInDataCell(
      rowIndex,
      DataTable_Columns_Type.Claims_ClaimNumber
    )
    const claimDetailsPage = new UserPortalClaimDetailsPage(this.global, claim)
    await this.page.waitForURL(claimDetailsPage.URL)
    return claimDetailsPage
  }

  async OpenRandomJob() {
    const getRowCount = await this.DataTable_Claims.VisibleRowCount()
    if (getRowCount === 0) {
      throw new Error('No jobs to choose from')
    }
    const randomRowIndex = Math.floor(Math.random() * getRowCount) + 1
    const actualIndex = await this.DataTable_Jobs.FetchRowIndexFromRowPosition(randomRowIndex, true)
    const jobNumber = await this.DataTable_Jobs.FetchRowTextDataByColumnName(
      actualIndex,
      DataTable_Columns_Type.Jobs_JobID
    )
    const testJob = new UserPortalJob(jobNumber, actualIndex)
    const jobPage = new UserPortalJobDetailsPage(this.global, testJob)
    await jobPage.NavigateToPage(true)
    return { jobPage, testJob }
  }

  async OpenJob(job: UserPortalJob) {
    await this.DataTable_Jobs.SetTableFilter_Text(
      job.jobDetails.jobId,
      DataTable_Columns_Type.Jobs_JobID
    )
    const rowPosition = 1
    const rowIndex = await this.DataTable_Jobs.FetchRowIndexFromRowPosition(rowPosition)
    await this.DataTable_Jobs.ClickLinkInDataCell(rowIndex, DataTable_Columns_Type.Jobs_JobID)
    const jobDetailsPage = new UserPortalJobDetailsPage(this.global, job)
    await this.page.waitForURL(jobDetailsPage.URL)
    return jobDetailsPage
  }
}
