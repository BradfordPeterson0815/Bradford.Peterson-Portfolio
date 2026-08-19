import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'
import { Element } from '../../shared/element.js'
import {
  ClaimFilterFields,
  ClaimFilterSelectionOptions_Boolean,
  ClaimFilterSelectionOptions_ClaimStatus,
  ClaimFilterSelectionOptions_LatestTimelineEvent,
  ClaimsPortal_DataTable_ActionMenuItems,
  DataTable_Columns_Type,
  HomePageStrings,
} from '../claimsPortalConstants.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'
import { ClaimsPortalFilters } from '../claimsPortalFilters.js'
import { expect } from '@playwright/test'
import { ClaimsPortalClaimDataTable } from '../claimsPortalClaimDataTable.js'

export class ClaimsPortalHomePage extends ClaimsPortalBasePage {
  readonly Title: Element
  readonly Filter_AssignedClaimsPortal: ClaimsPortalFilters
  readonly DataTable_YourAssignedClaimsPortal: ClaimsPortalClaimDataTable
  readonly DataTable_UnassignedClaimsPortal: ClaimsPortalClaimDataTable
  readonly Button_Radio_All: Element
  readonly Button_Radio_CoordinatorReview: Element
  readonly Label_Admin_Welcome: Element
  readonly Label_Admin_GetStarted: Element
  readonly Label_Admin_MainEntities: Element
  readonly Label_Admin_Messaging: Element
  readonly Label_Admin_AdminArea: Element
  readonly Link_Admin_ClaimsPortal: Element
  readonly Link_Admin_Jobs: Element
  readonly Link_Admin_CallbackRequests: Element
  readonly Link_Admin_Inbox: Element
  readonly Link_Admin_Contacts: Element
  readonly Link_Admin_EstimatorSchedules: Element
  readonly Link_Admin_Tags: Element
  readonly Link_Admin_Templates: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${HomePageStrings.Title}` }),
      HomePageStrings.Title
    )
    this.URL = global.baseUrl
    this.Filter_AssignedClaimsPortal = new ClaimsPortalFilters(global, HomePageStrings.Filter_AssignedClaimsPortal)
    this.DataTable_YourAssignedClaimsPortal = new ClaimsPortalClaimDataTable(
      global,
      `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]:nth-child(1)`,
      2,
      HomePageStrings.ActionMenu,
      HomePageStrings.ActionMenuAria
    )
    this.DataTable_UnassignedClaimsPortal = new ClaimsPortalClaimDataTable(
      global,
      `#root div:nth-child(2 of div[id^="card"]) > div[id$="_content"]`,
      2,
      HomePageStrings.ActionMenu,
      HomePageStrings.ActionMenuAria
    )
    this.Button_Radio_All = new Element(
      global.page,
      this.page
        .locator(
          `#root div:nth-child(2 of div[id^="card"]) > div[id$="_content"] div[role="radiogroup"] label`
        )
        .nth(0),
      HomePageStrings.Button_All
    )
    this.Button_Radio_CoordinatorReview = new Element(
      global.page,
      this.page
        .locator(
          `#root div:nth-child(2 of div[id^="card"]) > div[id$="_content"] div[role="radiogroup"] label`
        )
        .nth(1),
      HomePageStrings.Button_CoordinatorReview
    )
    this.Label_Admin_Welcome = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${HomePageStrings.Label_Admin_Welcome}` }),
      HomePageStrings.Label_Admin_Welcome
    )
    this.Label_Admin_GetStarted = new Element(
      global.page,
      this.page.getByText(`${HomePageStrings.Label_Admin_GetStarted}`),
      HomePageStrings.Label_Admin_GetStarted
    )
    this.Label_Admin_MainEntities = new Element(
      global.page,
      this.page.getByText(`${HomePageStrings.Label_Admin_MainEntities}`),
      HomePageStrings.Label_Admin_MainEntities
    )
    this.Link_Admin_ClaimsPortal = new Element(
      global.page,
      this.page.getByRole('link', { name: `${HomePageStrings.Link_Admin_ClaimsPortal}` }).nth(1),
      HomePageStrings.Link_Admin_ClaimsPortal
    )
    this.Link_Admin_Jobs = new Element(
      global.page,
      this.page.getByRole('link', { name: `${HomePageStrings.Link_Admin_Jobs}` }).nth(1),
      HomePageStrings.Link_Admin_Jobs
    )
    this.Label_Admin_Messaging = new Element(
      global.page,
      this.page.getByText(`${HomePageStrings.Label_Admin_Messaging}`),
      HomePageStrings.Label_Admin_Messaging
    )
    this.Link_Admin_CallbackRequests = new Element(
      global.page,
      this.page.getByRole('link', { name: `${HomePageStrings.Link_Admin_CallbackRequests}` }),
      HomePageStrings.Link_Admin_CallbackRequests
    )
    this.Link_Admin_Inbox = new Element(
      global.page,
      this.page.getByRole('link', { name: `${HomePageStrings.Link_Admin_Inbox}` }).nth(1),
      HomePageStrings.Link_Admin_Inbox
    )
    this.Label_Admin_AdminArea = new Element(
      global.page,
      this.page.getByText(`${HomePageStrings.Label_Admin_AdminArea}`),
      HomePageStrings.Label_Admin_AdminArea
    )
    this.Link_Admin_Contacts = new Element(
      global.page,
      this.page.getByRole('link', { name: `${HomePageStrings.Link_Admin_Contacts}` }),
      HomePageStrings.Link_Admin_Contacts
    )
    this.Link_Admin_EstimatorSchedules = new Element(
      global.page,
      this.page.getByRole('link', { name: `${HomePageStrings.Link_Admin_EstimatorSchedules}` }),
      HomePageStrings.Link_Admin_EstimatorSchedules
    )
    this.Link_Admin_Tags = new Element(
      global.page,
      this.page.getByRole('link', { name: `${HomePageStrings.Link_Admin_Tags}` }),
      HomePageStrings.Link_Admin_Tags
    )
    this.Link_Admin_Templates = new Element(
      global.page,
      this.page.getByRole('link', { name: `${HomePageStrings.Link_Admin_Templates}` }),
      HomePageStrings.Link_Admin_Templates
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_YourAssignedClaimsPortal.WaitForRowsToLoad()
    await this.DataTable_UnassignedClaimsPortal.WaitForRowsToLoad()
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.NavigateDirectly(this.global.baseUrl)
    } else {
      await this.leftNavBar.GoHome()
    }
    await this.page.waitForLoadState()
    await this.CustomLoad()
    const isYourAssignedEmpty = await this.DataTable_YourAssignedClaimsPortal.IsEmpty()
    if (!isYourAssignedEmpty) {
      // if there are rows, wait for one to be visible
      await this.DataTable_YourAssignedClaimsPortal.rows.nth(0).waitFor({ state: 'visible' })
    }
    const isUnassignedEmpty = await this.DataTable_UnassignedClaimsPortal.IsEmpty()
    if (!isUnassignedEmpty) {
      // if there are rows, wait for one to be visible
      await this.DataTable_UnassignedClaimsPortal.rows.nth(0).waitFor({ state: 'visible' })
    }
  }

  async ShowAllYourAssignedClaimsPortalColumns() {
    const tableSettingsDialog = await this.DataTable_YourAssignedClaimsPortal.OpenTableSettings()
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Users)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Coordinator)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_DeskAdjuster)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_FieldAgent)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_InspectionTech)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Reviewer)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Policyholder)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_ClaimNumber)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_PrimaryContact)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Email)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Phone)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Carrier)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_ClaimStatus)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_LastEvent)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_InAssignQueue)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_DateReceived)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_LossDate)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_InspectionScheduled)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_InspectionCompleted)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_HasLegalRep)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_City)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_State)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_County)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_CatCode)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_HasJob)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Data_Source)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Tags)
    await tableSettingsDialog.Close()
  }

  async ShowAllUnassignedClaimsPortalColumns() {
    const tableSettingsDialog = await this.DataTable_UnassignedClaimsPortal.OpenTableSettings()
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Users)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Coordinator)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_DeskAdjuster)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_FieldAgent)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_InspectionTech)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Reviewer)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Policyholder)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_ClaimNumber)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_PrimaryContact)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Email)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Phone)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Carrier)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_ClaimStatus)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_LastEvent)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_InAssignQueue)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_DateReceived)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_LossDate)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_InspectionScheduled)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_InspectionCompleted)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_HasLegalRep)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_City)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_State)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_County)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_CatCode)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_HasJob)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Data_Source)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ClaimsPortal_Tags)
    await tableSettingsDialog.Close()
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async ClearAllFilters() {
    if ((await this.Filter_AssignedClaimsPortal.IsExpanded()) == false) {
      await this.Filter_AssignedClaimsPortal.Button_ExpandFilter.Click()
    }
    if (!(await this.Filter_AssignedClaimsPortal.NoFiltersAlert.IsVisible())) {
      await this.Filter_AssignedClaimsPortal.Button_ClearFilters.Click()
      await this.Filter_AssignedClaimsPortal.Button_SaveFilters.Click()
      await this.Filter_AssignedClaimsPortal.Button_CollapseFilter.Click()
      await this.page.waitForTimeout(500)
      await expect(this.Filter_AssignedClaimsPortal.Button_ExpandFilter.locator).toBeVisible()
      await this.Filter_AssignedClaimsPortal.Button_ExpandFilter.Click()
      await expect(this.Filter_AssignedClaimsPortal.NoFiltersAlert.locator).toHaveCount(1)
      await expect(this.Filter_AssignedClaimsPortal.NoFiltersAlert.locator).toBeVisible()
    }
  }

  async SelectActionMenuItem(
    table: ClaimsPortalDataTable,
    rowIndex: string,
    actionMenuItem: ClaimsPortal_DataTable_ActionMenuItems
  ) {
    await table.OpenActionMenu(rowIndex)
    await table.SelectActionMenuItem(actionMenuItem)
  }

  async AddTextFilter(fieldValue: string, operatorSelection: string, value: string) {
    await this.Filter_AssignedClaimsPortal.Button_AddFilter.Click()
    const index = (await this.Filter_AssignedClaimsPortal.RowCount()) - 1
    await this.Filter_AssignedClaimsPortal.SelectFilterField(index, fieldValue)
    await this.Filter_AssignedClaimsPortal.SelectFilterOperator(index, operatorSelection)
    await this.Filter_AssignedClaimsPortal.SetFilterValue(index, value)
  }

  async AddBooleanFilter(
    fieldValue: string,
    operatorSelection: string,
    selection: ClaimFilterSelectionOptions_Boolean
  ) {
    await this.Filter_AssignedClaimsPortal.Button_AddFilter.Click()
    const index = (await this.Filter_AssignedClaimsPortal.RowCount()) - 1
    await this.Filter_AssignedClaimsPortal.SelectFilterField(index, fieldValue)
    await this.Filter_AssignedClaimsPortal.SelectFilterOperator(index, operatorSelection)
    await this.Filter_AssignedClaimsPortal.SelectFilterValue(index, selection.toString())
  }

  async AddDateFilter(fieldValue: string, operatorSelection: string, value: string) {
    await this.Filter_AssignedClaimsPortal.Button_AddFilter.Click()
    const index = (await this.Filter_AssignedClaimsPortal.RowCount()) - 1
    await this.Filter_AssignedClaimsPortal.SelectFilterField(index, fieldValue)
    await this.Filter_AssignedClaimsPortal.SelectFilterOperator(index, operatorSelection)
    await this.Filter_AssignedClaimsPortal.SetFilterValue(index, value)
  }

  async AddContactFilter(fieldSelection: string, operatorSelection: string, contactValue: string) {
    await this.Filter_AssignedClaimsPortal.Button_AddFilter.Click()
    const index = (await this.Filter_AssignedClaimsPortal.RowCount()) - 1
    await this.Filter_AssignedClaimsPortal.SelectFilterField(index, fieldSelection)
    await this.Filter_AssignedClaimsPortal.SelectFilterOperator(index, operatorSelection)
    await this.Filter_AssignedClaimsPortal.SetFilterContactValue(contactValue)
  }

  async AddClaimStatusFilter(
    operatorSelection: string,
    selection: ClaimFilterSelectionOptions_ClaimStatus
  ) {
    await this.Filter_AssignedClaimsPortal.Button_AddFilter.Click()
    const index = (await this.Filter_AssignedClaimsPortal.RowCount()) - 1
    await this.Filter_AssignedClaimsPortal.SelectFilterField(index, ClaimFilterFields.ClaimStatus)
    await this.Filter_AssignedClaimsPortal.SelectFilterOperator(index, operatorSelection)
    await this.Filter_AssignedClaimsPortal.SelectFilterValue(index, selection.toString())
  }

  async AddLatestTimelineEventFilter(
    operatorSelection: string,
    selection: ClaimFilterSelectionOptions_LatestTimelineEvent
  ) {
    await this.Filter_AssignedClaimsPortal.Button_AddFilter.Click()
    const index = (await this.Filter_AssignedClaimsPortal.RowCount()) - 1
    await this.Filter_AssignedClaimsPortal.SelectFilterField(index, ClaimFilterFields.LatestTimelineEvent)
    await this.Filter_AssignedClaimsPortal.SelectFilterOperator(index, operatorSelection)
    await this.Filter_AssignedClaimsPortal.SelectFilterValue(index, selection.toString())
  }
}
