import { expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import {
  DataTable_Columns_Type,
  JobFilterFields,
  JobFilterFields_Text,
  JobFilterOperators_Text,
  JobFilterSelectionOptions_Boolean,
  JobFilterSelectionOptions_LatestTimelineEvent,
  JobFilterSelectionOptions_LatestWorkAuthStatus,
  JobFilterSelectionOptions_Services,
  JobFilterSelectionOptions_Type,
  JobsPageStrings,
  Jobs_DataTable_ActionMenuItems,
} from '../claimsPortalConstants.js'
import { ClaimsPortalFilters } from '../claimsPortalFilters.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalJob } from '../claimsPortalJob.js'
import { ClaimsPortalJobDataTable } from '../claimsPortalJobDataTable.js'
import { ClaimsPortalCreateJobDrawer } from '../drawers/claimsPortalCreateJobDrawer.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'
import { ClaimsPortalJobPage } from './claimsPortalJobPage.js'

export class ClaimsPortalJobsPage extends ClaimsPortalBasePage {
  readonly Title: Element
  readonly Filter_Jobs: ClaimsPortalFilters
  readonly DataTable_Jobs: ClaimsPortalJobDataTable
  readonly Button_CreateJob: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${JobsPageStrings.Title}` }),
      JobsPageStrings.Title
    )
    this.URL = `${global.baseUrl}jobs`
    this.Filter_Jobs = new ClaimsPortalFilters(global, JobsPageStrings.Filter_JobFilters)
    this.DataTable_Jobs = new ClaimsPortalJobDataTable(
      global,
      `#root div[id$="_content"]`,
      2,
      JobsPageStrings.ActionMenu,
      JobsPageStrings.ActionMenuAria
    )
    this.DataTable_Jobs.selectionBadgeLocator = this.DataTable_Jobs.parent.locator(
      `div > div:nth-child(3) > span > span`
    )
    this.Button_CreateJob = new Element(
      global.page,
      this.page.getByRole('button', { name: `${JobsPageStrings.Button_CreateJob}` }),
      JobsPageStrings.Button_CreateJob
    )
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.page.goto(this.URL)
    } else {
      await this.leftNavBar.GoHome()
      await this.leftNavBar.Button_Jobs.Click()
      await this.page.waitForLoadState()
    }
    await this.page.waitForTimeout(2000)
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async OpenRandomJob() {
    // If there are any filter set, clear it
    await this.ClearAllFilters()
    const getRowCount = await this.DataTable_Jobs.VisibleRowCount()
    if (getRowCount === 0) {
      throw new Error('No jobs to choose from')
    }
    const randomRowIndex = Math.floor(Math.random() * getRowCount) + 1
    const actualIndex = await this.DataTable_Jobs.FetchRowIndexFromRowPosition(randomRowIndex, true)
    const jobNumber = await this.DataTable_Jobs.FetchRowTextDataByColumnName(
      actualIndex,
      DataTable_Columns_Type.Jobs_JobId
    )
    const testJob = new ClaimsPortalJob(jobNumber, actualIndex)
    const jobPage = new ClaimsPortalJobPage(this.global, testJob)
    await jobPage.NavigateDirectlyToJob()
    return { jobPage, testJob }
  }

  async OpenJob(job: ClaimsPortalJob) {
    await this.Filter_Jobs.Button_ExpandFilter.Click()
    await this.Filter_Jobs.Button_ClearFilters.Click()
    await this.AddTextFilter(
      JobFilterFields_Text.JobId,
      JobFilterOperators_Text.Matches,
      job.jobDetails.jobId
    )
    await this.Filter_Jobs.Button_SaveFilters.Click()
    await this.page.waitForTimeout(2000)
    const rowPosition = 1
    const rowIndex = await this.DataTable_Jobs.FetchRowIndexFromRowPosition(rowPosition, true)
    await this.DataTable_Jobs.ClickLinkInDataCell(rowIndex, DataTable_Columns_Type.Jobs_JobId)
    const jobPage = new ClaimsPortalJobPage(this.global, job)
    const expectedLandingURL = `**/${jobPage.baseURL}/**`
    await this.page.waitForURL(expectedLandingURL)
    return jobPage
  }

  async SelectActionMenuItem(rowIndex: string, actionMenuItem: Jobs_DataTable_ActionMenuItems) {
    await this.DataTable_Jobs.OpenActionMenu(rowIndex)
    await this.DataTable_Jobs.SelectActionMenuItem(actionMenuItem)
  }

  async ShowAllColumns() {
    const tableSettingsDialog = await this.DataTable_Jobs.OpenTableSettings()
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Users)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_JobId)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Type)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Services)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Description)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Status)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_WorkAuthStatus)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Location)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_LatestTimelineEvent)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_PrimaryContact)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Tags)
    await tableSettingsDialog.Close()
  }

  async ClearAllFilters() {
    if ((await this.Filter_Jobs.IsExpanded()) == false) {
      await this.Filter_Jobs.Button_ExpandFilter.Click()
    }
    if (!(await this.Filter_Jobs.NoFiltersAlert.IsVisible())) {
      await this.Filter_Jobs.Button_ClearFilters.Click()
      await this.Filter_Jobs.Button_SaveFilters.Click()
      await this.Filter_Jobs.Button_CollapseFilter.Click()
      await this.page.waitForTimeout(500)
      await expect(this.Filter_Jobs.Button_ExpandFilter.locator).toBeVisible()
      await this.Filter_Jobs.Button_ExpandFilter.Click()
      await expect(this.Filter_Jobs.NoFiltersAlert.locator).toHaveCount(1)
      await expect(this.Filter_Jobs.NoFiltersAlert.locator).toBeVisible()
    }
  }

  async AddTextFilter(fieldValue: string, operatorSelection: string, value: string) {
    await this.Filter_Jobs.Button_AddFilter.Click()
    const index = (await this.Filter_Jobs.RowCount()) - 1
    await this.Filter_Jobs.SelectFilterField(index, fieldValue)
    await this.Filter_Jobs.SelectFilterOperator(index, operatorSelection)
    await this.Filter_Jobs.SetFilterValue(index, value)
  }

  async AddBooleanFilter(
    fieldValue: string,
    operatorSelection: string,
    selection: JobFilterSelectionOptions_Boolean
  ) {
    await this.Filter_Jobs.Button_AddFilter.Click()
    const index = (await this.Filter_Jobs.RowCount()) - 1
    await this.Filter_Jobs.SelectFilterField(index, fieldValue)
    await this.Filter_Jobs.SelectFilterOperator(index, operatorSelection)
    await this.Filter_Jobs.SelectFilterValue(index, selection.toString())
  }

  async AddDateFilter(fieldValue: string, operatorSelection: string, value: string) {
    await this.Filter_Jobs.Button_AddFilter.Click()
    const index = (await this.Filter_Jobs.RowCount()) - 1
    await this.Filter_Jobs.SelectFilterField(index, fieldValue)
    await this.Filter_Jobs.SelectFilterOperator(index, operatorSelection)
    await this.Filter_Jobs.SetFilterValue(index, value)
  }

  async AddContactFilter(fieldSelection: string, operatorSelection: string, contactValue: string) {
    await this.Filter_Jobs.Button_AddFilter.Click()
    const index = (await this.Filter_Jobs.RowCount()) - 1
    await this.Filter_Jobs.SelectFilterField(index, fieldSelection)
    await this.Filter_Jobs.SelectFilterOperator(index, operatorSelection)
    await this.Filter_Jobs.SetFilterContactValue(contactValue)
  }

  async AddLatestTimelineEventFilter(
    operatorSelection: string,
    selection: JobFilterSelectionOptions_LatestTimelineEvent
  ) {
    await this.Filter_Jobs.Button_AddFilter.Click()
    const index = (await this.Filter_Jobs.RowCount()) - 1
    await this.Filter_Jobs.SelectFilterField(index, JobFilterFields.LatestTimelineEvent)
    await this.Filter_Jobs.SelectFilterOperator(index, operatorSelection)
    await this.Filter_Jobs.SelectFilterValue(index, selection.toString())
  }

  async AddLatestWorkAuthStatusFilter(
    operatorSelection: string,
    selection: JobFilterSelectionOptions_LatestWorkAuthStatus
  ) {
    await this.Filter_Jobs.Button_AddFilter.Click()
    const index = (await this.Filter_Jobs.RowCount()) - 1
    await this.Filter_Jobs.SelectFilterField(index, JobFilterFields.LatestWorkAuthStatus)
    await this.Filter_Jobs.SelectFilterOperator(index, operatorSelection)
    await this.Filter_Jobs.SelectFilterValue(index, selection.toString())
  }

  async AddTypeFilter(operatorSelection: string, selection: JobFilterSelectionOptions_Type) {
    await this.Filter_Jobs.Button_AddFilter.Click()
    const index = (await this.Filter_Jobs.RowCount()) - 1
    await this.Filter_Jobs.SelectFilterField(index, JobFilterFields.Type)
    await this.Filter_Jobs.SelectFilterOperator(index, operatorSelection)
    await this.Filter_Jobs.SelectFilterValue(index, selection.toString())
  }

  async AddServicesFilter(
    operatorSelection: string,
    selection: JobFilterSelectionOptions_Services
  ) {
    await this.Filter_Jobs.Button_AddFilter.Click()
    const index = (await this.Filter_Jobs.RowCount()) - 1
    await this.Filter_Jobs.SelectFilterField(index, JobFilterFields.Services)
    await this.Filter_Jobs.SelectFilterOperator(index, operatorSelection)
    await this.Filter_Jobs.SelectFilterValue(index, selection.toString())
  }

  async OpenCreateJobDrawer() {
    await this.Button_CreateJob.Click()
    return new ClaimsPortalCreateJobDrawer(this.global)
  }

  async VerifyTableSettingColumns() {
    const tableSettingsDialog = await this.DataTable_Jobs.OpenTableSettings()
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_Users)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_JobId)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_Type)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_Services)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_Description)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_Status)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_WorkAuthStatus)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_Location)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_LatestTimelineEvent)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_PrimaryContact)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_Tags)
    await tableSettingsDialog.Close()
  }
}
