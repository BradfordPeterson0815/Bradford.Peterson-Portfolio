import { Element } from '../../shared/element.js'
import { DelegatePortalClaim } from '../delegatePortalClaim.js'
import { DelegatePortalClaimDataTable } from '../delegatePortalClaimDataTable.js'
import {
  Claims_DataTable_ActionMenuItems,
  DataTable_Columns_Type,
  YourAssignedClaimsPageStrings,
} from '../delegatePortalConstants.js'
import { DelegatePortalDataTable } from '../delegatePortalDataTable.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalClaimPage } from './delegatePortalClaimPage.js'
import { DelegatePortalBasePage } from './delegatePortalBasePage.js'

export class DelegatePortalYourAssignedClaimsPage extends DelegatePortalBasePage {
  readonly Title: Element
  readonly Label_Preferences: Element
  readonly Checkbox_HideClaimsInQAReview: Element
  readonly Checkbox_HideClaimsInCarrierReview: Element
  readonly Label_QuickFilters: Element
  readonly Button_TodaysInspections: Element
  readonly Button_NotScheduled: Element
  readonly DataTable_YourAssignedClaims: DelegatePortalClaimDataTable
  readonly parent: string

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: YourAssignedClaimsPageStrings.Title }),
      YourAssignedClaimsPageStrings.Title
    )
    this.URL = `${global.baseUrl}claims`
    this.parent = `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]`
    this.Label_Preferences = new Element(
      global.page,
      this.page.getByRole('heading', {
        name: YourAssignedClaimsPageStrings.Label_Preferences,
      }),
      YourAssignedClaimsPageStrings.Label_Preferences
    )
    this.Checkbox_HideClaimsInQAReview = new Element(
      global.page,
      this.page.locator('input[value="claimStatus|QA Review"]').locator('..'),
      YourAssignedClaimsPageStrings.Checkbox_HideClaimsInQAReview
    )
    this.Checkbox_HideClaimsInCarrierReview = new Element(
      global.page,
      this.page.locator('input[value="claimStatus|Carrier Review"]').locator('..'),
      YourAssignedClaimsPageStrings.Checkbox_HideClaimsInCarrierReview
    )
    this.Label_QuickFilters = new Element(
      global.page,
      this.page.getByRole('heading', {
        name: YourAssignedClaimsPageStrings.Label_QuickFilters,
      }),
      YourAssignedClaimsPageStrings.Label_QuickFilters
    )
    this.Button_TodaysInspections = new Element(
      global.page,
      this.page.locator(`${this.parent} ul`).nth(0).locator('button').nth(0)
    )
    this.Button_NotScheduled = new Element(
      global.page,
      this.page.locator(`${this.parent} ul`).nth(0).locator('button').nth(1)
    )
    this.DataTable_YourAssignedClaims = new DelegatePortalClaimDataTable(
      global,
      this.parent,
      1,
      YourAssignedClaimsPageStrings.ActionMenu,
      YourAssignedClaimsPageStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_YourAssignedClaims.WaitForRowsToLoad()
  }

  async WaitForLoad() {
    await this.page.waitForLoadState()
    // if (this.global.isMobile) {
    // }
    await this.Label_Preferences.locator.waitFor({ state: 'visible' })
  }

  async NavigateToPage() {
    await this.NavigateDirectly(this.global.baseUrl)
    await this.WaitForLoad()
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async SelectActionMenuItem(
    table: DelegatePortalDataTable,
    rowIndex: string,
    actionMenuItem: Claims_DataTable_ActionMenuItems
  ) {
    await table.OpenActionMenu(rowIndex)
    await table.SelectActionMenuItem(actionMenuItem)
  }

    async OpenRandomClaim() {
    const getRowCount = await this.DataTable_YourAssignedClaims.VisibleRowCount()
    if (getRowCount === 0) {
      throw new Error('No claims to choose from')
    }
    const randomRowIndex = Math.floor(Math.random() * getRowCount) + 1
    const actualIndex = await this.DataTable_YourAssignedClaims.FetchRowIndexFromRowPosition(randomRowIndex)
    const claimNumber = await this.DataTable_YourAssignedClaims.FetchRowTextDataByColumnName(
      actualIndex,
      DataTable_Columns_Type.Claims_ClaimNumber
    )
    const testClaim = new DelegatePortalClaim(claimNumber)
    const claimPage = new DelegatePortalClaimPage(this.global, testClaim)
    await claimPage.NavigateDirectlyToClaim()
    return { claimPage, testClaim }
  }

  async OpenClaim(claim: DelegatePortalClaim) {
    await this.DataTable_YourAssignedClaims.SetTableFilter_Text(
      claim.basicInfo.claimNumber,
      DataTable_Columns_Type.Claims_ClaimNumber
    )
    const rowPosition = 1
    const rowIndex =
      await this.DataTable_YourAssignedClaims.FetchRowIndexFromRowPosition(rowPosition)
    await this.DataTable_YourAssignedClaims.ClickLinkInDataCell(
      rowIndex,
      DataTable_Columns_Type.Claims_ClaimNumber
    )
    const claimPage = new DelegatePortalClaimPage(this.global, claim)
    const expectedLandingURL = `**/${claimPage.baseURL}/**`
    await this.page.waitForURL(expectedLandingURL)
    return claimPage
  }

  async ShowAllYourAssignedClaimsColumns() {
    const tableSettingsDialog = await this.DataTable_YourAssignedClaims.OpenTableSettings()
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_ClaimNumber)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_InspectionCompleted)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Email)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_InspectionScheduled)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Phone)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Carrier)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_ClaimStatus)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_PrimaryContact)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_LastEvent)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_DateReceived)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_LossDate)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_HasLegalRep)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_City)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_State)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_County)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_CatCode)
    await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_HasJob)
    await tableSettingsDialog.Close()
  }
}
