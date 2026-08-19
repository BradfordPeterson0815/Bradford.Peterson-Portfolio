import { expect } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { ClaimsPortalDeleteAlert } from '../alerts/claimsPortalDeleteAlert.js'
import {
  AlertStrings,
  DataTable_Columns_Type,
  PricingRegionsTabStrings,
  PricingRegions_DataTable_ActionMenuItems,
} from '../claimsPortalConstants.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalRegionRate } from '../claimsPortalRegionRate.js'
import { ClaimsPortalRegionPricingDrawer } from '../drawers/claimsPortalRegionPricingDrawer.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalRegionRateDetailPage } from '../pages/claimsPortalRegionRateDetailPage.js'
import { ClaimsPortalUploadRegionsDrawer } from '../drawers/claimsPortalUploadRegionsDrawer.js'

export class ClaimsPortalPricingRegionsTab extends ClaimsPortalBasePage {
  readonly Title: Element
  readonly Button_DownloadCSV
  readonly Button_BulkUpdateRegions
  readonly Button_AddRegion
  readonly DataTable_PricingRegions: ClaimsPortalDataTable

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', {
        name: PricingRegionsTabStrings.Title,
      }),
      PricingRegionsTabStrings.Title
    )
    this.URL = `${global.baseUrl}pricing/regions`
    this.Button_DownloadCSV = new Element(
      global.page,
      this.page.getByRole('button', { name: PricingRegionsTabStrings.Button_DownloadCSV }),
      PricingRegionsTabStrings.Button_DownloadCSV
    )
    this.Button_BulkUpdateRegions = new Element(
      global.page,
      this.page.getByRole('button', { name: PricingRegionsTabStrings.Button_BulkUpdateRegions }),
      PricingRegionsTabStrings.Button_BulkUpdateRegions
    )
    this.Button_AddRegion = new Element(
      global.page,
      this.page.getByRole('button', { name: PricingRegionsTabStrings.Button_AddRegion }),
      PricingRegionsTabStrings.Button_AddRegion
    )
    this.DataTable_PricingRegions = new ClaimsPortalDataTable(
      global,
      `#root div[id$="_content"]`,
      1,
      PricingRegionsTabStrings.ActionMenu,
      PricingRegionsTabStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_PricingRegions.WaitForRowsToLoad()
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async VerifyTextDataByColumnName(
    rowIndex: string,
    columnType: DataTable_Columns_Type,
    expectedText: string
  ) {
    const value = await this.DataTable_PricingRegions.FetchRowTextDataByColumnName(
      rowIndex,
      columnType
    )
    expect(value).toContain(expectedText)
  }

  async FindIndexOfRowAtPosition(rowPosition: number) {
    const value = await this.DataTable_PricingRegions.FetchRowIndexFromRowPosition(rowPosition)
    return value
  }

  async SelectActionMenuItem(
    rowIndex: string,
    actionMenuItem: PricingRegions_DataTable_ActionMenuItems
  ) {
    await this.DataTable_PricingRegions.OpenActionMenu(rowIndex)
    await this.DataTable_PricingRegions.SelectActionMenuItem(actionMenuItem)
  }

  async IsActionMenuItemVisible(
    rowIndex: string,
    actionMenuItem: PricingRegions_DataTable_ActionMenuItems
  ) {
    const table = this.DataTable_PricingRegions
    await table.OpenActionMenu(rowIndex)
    await this.page.waitForTimeout(1000)
    const visibility = await table.IsActionMenuItemVisible(actionMenuItem)
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async OpenCreateRegionPricingDrawer() {
    await this.Button_AddRegion.Click()
    return new ClaimsPortalRegionPricingDrawer(this.global)
  }

  async OpenBulkUpdateRegionsDrawer() {
    await this.Button_BulkUpdateRegions.Click()
    return new ClaimsPortalUploadRegionsDrawer(this.global)
  }

  async AddNewRegionPricing(newRegionRate: ClaimsPortalRegionRate) {
    const createRegionPricingDrawer = await this.OpenCreateRegionPricingDrawer()
    await createRegionPricingDrawer.FillAndSubmit(newRegionRate)
  }

  async SelectRegionPricingByName(rowIndex: string, regionPricingToGoto: ClaimsPortalRegionRate) {
    await this.DataTable_PricingRegions.ClickLinkInDataCell(
      rowIndex,
      DataTable_Columns_Type.PricingRegions_RegionName
    )
    const vendorRatesDetailPage = new ClaimsPortalRegionRateDetailPage(this.global, regionPricingToGoto)
    return vendorRatesDetailPage
  }

  async GotoRegionPricing(rowIndex: string, regionPricingToGoto: ClaimsPortalRegionRate) {
    await this.SelectActionMenuItem(rowIndex, PricingRegions_DataTable_ActionMenuItems.GotoRegion)
    const vendorRatesDetailPage = new ClaimsPortalRegionRateDetailPage(this.global, regionPricingToGoto)
    return vendorRatesDetailPage
  }

  async UpdateExistingRegionPricing(rowIndex: string, updateRegionRate: ClaimsPortalRegionRate) {
    await this.SelectActionMenuItem(rowIndex, PricingRegions_DataTable_ActionMenuItems.EditRegion)
    const createRegionPricingDrawer = new ClaimsPortalRegionPricingDrawer(this.global, true)
    await createRegionPricingDrawer.FillAndSubmit(updateRegionRate)
  }

  async RemoveExistingRegionPricing(rowIndex: string) {
    await this.SelectActionMenuItem(rowIndex, PricingRegions_DataTable_ActionMenuItems.RemoveRegion)
    await this.HandleRemoveRegionAlert()
    await this.page.waitForTimeout(3000)
  }

  async HandleRemoveRegionAlert(cancelRemove = false) {
    const alert = new ClaimsPortalDeleteAlert(
      this.global,
      AlertStrings.RemoveRegion_Title,
      AlertStrings.RemoveRegion_Description
    )
    if (cancelRemove) {
      await alert.Button_Close.locator.click({ force: true })
    } else {
      await alert.Button_Delete.locator.click({ force: true })
    }
  }

  async DeleteOldTestRegions(regionPrefix: string) {
    if (await this.DataTable_PricingRegions.IsEmpty()) {
      return
    }
    await this.DataTable_PricingRegions.SetTableSearch(regionPrefix)
    let tableIsNotClear = false
    let rowCount = 0
    do {
      rowCount = await this.DataTable_PricingRegions.VisibleRowCount()
      tableIsNotClear = rowCount > 0
      if (tableIsNotClear) {
        const index = await this.FindIndexOfRowAtPosition(1)
        await this.RemoveExistingRegionPricing(index)
      }
    } while (tableIsNotClear)
    await this.DataTable_PricingRegions.CancelPinnedTableSearch()
  }
}
