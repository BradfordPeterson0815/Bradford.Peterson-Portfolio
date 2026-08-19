import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'
import { Element } from '../../shared/element.js'
import {
  ClaimFilterFields,
  ClaimFilterFields_Text,
  ClaimFilterOperators_Text,
  ClaimFilterSelectionOptions_Boolean,
  ClaimFilterSelectionOptions_ClaimStatus,
  ClaimFilterSelectionOptions_LatestTimelineEvent,
  ClaimsPortalPageStrings,
  Claims_DataTable_ActionMenuItems,
  DataTable_Columns_Type,
} from '../claimsPortalConstants.js'
import { ClaimsPortalFilters } from '../claimsPortalFilters.js'
import { expect } from '@playwright/test'
import { ClaimsPortalViews } from '../claimsPortalViews.js'
import { ClaimsPortalClaimDataTable } from '../claimsPortalClaimDataTable.js'
import { ClaimsPortalClaim } from '../claimsPortalClaim.js'
import { ClaimsPortalClaimPage } from './claimsPortalClaimPage.js'
import { ClaimsPortalCreateClaimPage } from './claimsPortalCreateClaimPage.js'

export class ClaimsPortalClaimsPage extends ClaimsPortalBasePage {
  readonly Title: Element
  readonly Views_ClaimsPortal: ClaimsPortalViews
  readonly Filter_ClaimsPortal: ClaimsPortalFilters
  readonly DataTable_ClaimsPortal: ClaimsPortalClaimDataTable
  readonly Link_CreateClaim: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${ClaimsPortalPageStrings.Title}` }),
      ClaimsPortalPageStrings.Title
    )
    this.URL = `${global.baseUrl}claims`
    this.Views_ClaimsPortal = new ClaimsPortalViews(global, ClaimsPortalPageStrings.View_Views)
    this.Filter_ClaimsPortal = new ClaimsPortalFilters(global, ClaimsPortalPageStrings.Filter_ClaimFilters, 1)
    this.DataTable_ClaimsPortal = new ClaimsPortalClaimDataTable(
      global,
      `#root div[id$="_content"]`,
      2,
      ClaimsPortalPageStrings.ActionMenu,
      ClaimsPortalPageStrings.ActionMenuAria
    )
    this.Link_CreateClaim = new Element(
      global.page,
      this.page.getByRole('link', { name: ClaimsPortalPageStrings.Link_CreateClaim }),
      ClaimsPortalPageStrings.Link_CreateClaim
    )
  }

  async OpenRandomClaim() {
    // If there are any filter set, clear it
    await this.ClearAllFilters()
    const getRowCount = await this.DataTable_ClaimsPortal.VisibleRowCount()
    if (getRowCount === 0) {
      throw new Error('No claims to choose from')
    }
    const randomRowIndex = Math.floor(Math.random() * getRowCount) + 1
    const actualIndex = await this.DataTable_ClaimsPortal.FetchRowIndexFromRowPosition(randomRowIndex)
    const claimNumber = await this.DataTable_ClaimsPortal.FetchRowTextDataByColumnName(
      actualIndex,
      DataTable_Columns_Type.Claims_ClaimNumber
    )
    const testClaim = new ClaimsPortalClaim(claimNumber)
    const claimPage = new ClaimsPortalClaimPage(this.global, testClaim)
    await claimPage.NavigateDirectlyToClaim()
    return { claimPage, testClaim }
  }

  async OpenClaim(claim: ClaimsPortalClaim) {
    await this.Filter_ClaimsPortal.Button_ExpandFilter.Click()
    await this.Filter_ClaimsPortal.Button_ClearFilters.Click()
    await this.AddTextFilter(
      ClaimFilterFields_Text.ClaimNumber,
      ClaimFilterOperators_Text.Matches,
      claim.basicInfo.claimNumber
    )
    await this.Filter_ClaimsPortal.Button_SaveFilters.Click()
    const rowPosition = 1
    const rowIndex = await this.DataTable_ClaimsPortal.FetchRowIndexFromRowPosition(rowPosition)
    await this.DataTable_ClaimsPortal.ClickLinkInDataCell(
      rowIndex,
      DataTable_Columns_Type.Claims_ClaimNumber
    )
    const claimPage = new ClaimsPortalClaimPage(this.global, claim)
    const expectedLandingURL = `**/${claimPage.baseURL}/**`
    await this.page.waitForURL(expectedLandingURL)
    return claimPage
  }

  async ShowAllColumns() {
    const tableSettingsDialog = await this.DataTable_ClaimsPortal.OpenTableSettings()
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Users)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Coordinator)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_FieldAgent)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Policyholder)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_PrimaryContact)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_ClaimNumber)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Phone)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Email)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_ClaimStatus)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Carrier)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Tags)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_LastEvent)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_InAssignQueue)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_DateReceived)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_LossDate)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_InspectionScheduled)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_InspectionCompleted)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_HasLegalRep)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_City)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_State)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_County)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_CatCode)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_HasJob)
    await tableSettingsDialog.Close()
  }

  async SelectActionMenuItem(rowIndex: string, actionMenuItem: Claims_DataTable_ActionMenuItems) {
    await this.DataTable_ClaimsPortal.OpenActionMenu(rowIndex)
    await this.DataTable_ClaimsPortal.SelectActionMenuItem(actionMenuItem)
  }

  async ClearAllFilters() {
    if ((await this.Filter_ClaimsPortal.IsExpanded()) == false) {
      await this.Filter_ClaimsPortal.Button_ExpandFilter.Click()
    }
    if (!(await this.Filter_ClaimsPortal.NoFiltersAlert.IsVisible())) {
      await this.Filter_ClaimsPortal.Button_ClearFilters.Click()
      await this.page.waitForTimeout(500)
      await this.Filter_ClaimsPortal.Button_SaveFilters.Click()
      await this.page.waitForTimeout(500)
      await this.Filter_ClaimsPortal.Button_CollapseFilter.Click()
      await this.page.waitForTimeout(500)
      await expect(this.Filter_ClaimsPortal.Button_ExpandFilter.locator).toBeVisible()
      await this.Filter_ClaimsPortal.Button_ExpandFilter.Click()
      await expect(this.Filter_ClaimsPortal.NoFiltersAlert.locator).toHaveCount(1)
      await expect(this.Filter_ClaimsPortal.NoFiltersAlert.locator).toBeVisible()
    }
  }

  async AddTextFilter(fieldValue: string, operatorSelection: string, value: string) {
    await this.Filter_ClaimsPortal.Button_AddFilter.Click()
    const index = (await this.Filter_ClaimsPortal.RowCount()) - 1
    await this.Filter_ClaimsPortal.SelectFilterField(index, fieldValue)
    await this.Filter_ClaimsPortal.SelectFilterOperator(index, operatorSelection)
    await this.Filter_ClaimsPortal.SetFilterValue(index, value)
  }

  async AddBooleanFilter(
    fieldValue: string,
    operatorSelection: string,
    selection: ClaimFilterSelectionOptions_Boolean
  ) {
    await this.Filter_ClaimsPortal.Button_AddFilter.Click()
    const index = (await this.Filter_ClaimsPortal.RowCount()) - 1
    await this.Filter_ClaimsPortal.SelectFilterField(index, fieldValue)
    await this.Filter_ClaimsPortal.SelectFilterOperator(index, operatorSelection)
    await this.Filter_ClaimsPortal.SelectFilterValue(index, selection.toString())
  }

  async AddDateFilter(fieldValue: string, operatorSelection: string, value: string) {
    await this.Filter_ClaimsPortal.Button_AddFilter.Click()
    const index = (await this.Filter_ClaimsPortal.RowCount()) - 1
    await this.Filter_ClaimsPortal.SelectFilterField(index, fieldValue)
    await this.Filter_ClaimsPortal.SelectFilterOperator(index, operatorSelection)
    await this.Filter_ClaimsPortal.SetFilterValue(index, value)
  }

  async AddContactFilter(fieldSelection: string, operatorSelection: string, contactValue: string) {
    await this.Filter_ClaimsPortal.Button_AddFilter.Click()
    const index = (await this.Filter_ClaimsPortal.RowCount()) - 1
    await this.Filter_ClaimsPortal.SelectFilterField(index, fieldSelection)
    await this.Filter_ClaimsPortal.SelectFilterOperator(index, operatorSelection)
    await this.Filter_ClaimsPortal.SetFilterContactValue(contactValue)
  }

  async AddClaimStatusFilter(
    operatorSelection: string,
    selection: ClaimFilterSelectionOptions_ClaimStatus
  ) {
    const index = await this.Filter_ClaimsPortal.RowCount()
    await this.Filter_ClaimsPortal.Button_AddFilter.Click()
    await this.Filter_ClaimsPortal.SelectFilterField(index, ClaimFilterFields.ClaimStatus)
    await this.Filter_ClaimsPortal.SelectFilterOperator(index, operatorSelection)
    await this.Filter_ClaimsPortal.SelectFilterValue(index, selection.toString())
  }

  async AddLatestTimelineEventFilter(
    operatorSelection: string,
    selection: ClaimFilterSelectionOptions_LatestTimelineEvent
  ) {
    await this.Filter_ClaimsPortal.Button_AddFilter.Click()
    const index = (await this.Filter_ClaimsPortal.RowCount()) - 1
    await this.Filter_ClaimsPortal.SelectFilterField(index, ClaimFilterFields.LatestTimelineEvent)
    await this.Filter_ClaimsPortal.SelectFilterOperator(index, operatorSelection)
    await this.Filter_ClaimsPortal.SelectFilterValue(index, selection.toString())
  }

  async ToggleUnassignedClaimsPortalToAll() {}

  async ToggleUnassignedClaimsPortalToCoordinatorReview() {}

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.page.goto(this.URL)
    } else {
      await this.leftNavBar.GoHome()
      await this.leftNavBar.Button_ClaimsPortal.Click()
      await this.page.waitForLoadState()
    }
    const isEmpty = await this.DataTable_ClaimsPortal.IsEmpty()
    if (!isEmpty) {
      // if there are rows, wait for one to be visible
      await this.DataTable_ClaimsPortal.rows.nth(0).waitFor({ state: 'visible' })
    }
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async OpenCreateClaimPage() {
    await this.Link_CreateClaim.Click()
    return new ClaimsPortalCreateClaimPage(this.global)
  }

  async VerifyTableSettingColumns() {
    const tableSettingsDialog = await this.DataTable_ClaimsPortal.OpenTableSettings()
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_Users)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_Coordinator)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_FieldAgent)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_Policyholder)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_PrimaryContact)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_ClaimNumber)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_Phone)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_Email)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_ClaimStatus)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_Carrier)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_Tags)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_LastEvent)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_InAssignQueue)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_DateReceived)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_LossDate)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_HasLegalRep)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_City)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_State)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_County)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_CatCode)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Claims_HasJob)
    await tableSettingsDialog.Close()
  }
}
