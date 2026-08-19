import { expect } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { ClaimsPortalDeleteAlert } from '../alerts/claimsPortalDeleteAlert.js'
import {
  AlertStrings,
  DataTable_Columns_Type,
  PricingVendorRatesTabStrings,
  PricingVendorRates_DataTable_ActionMenuItems,
} from '../claimsPortalConstants.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalVendorRates } from '../claimsPortalVendorRates.js'
import { ClaimsPortalUploadVendorRatesDrawer } from '../drawers/claimsPortalUploadVendorRatesDrawer.js'
import { ClaimsPortalVendorRatesDrawer } from '../drawers/claimsPortalVendorRatesDrawer.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalVendorRatesDetailPage } from '../pages/claimsPortalVendorRatesDetailPage.js'
import { ClaimsPortalVendorRatesTemplateDetailPage } from '../pages/claimsPortalVendorRatesTemplateDetailPage.js'
import { LookupDataColumn } from '../claimsPortalHelper.js'

export class ClaimsPortalPricingVendorRatesTab extends ClaimsPortalBasePage {
  readonly Title: Element
  readonly Button_DownloadCSV
  readonly Button_BulkUpdateVendorRates
  readonly Button_AddVendorRates
  readonly DataTable_PricingVendorRates: ClaimsPortalDataTable

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', {
        name: PricingVendorRatesTabStrings.Title,
      }),
      PricingVendorRatesTabStrings.Title
    )
    this.URL = `${global.baseUrl}pricing/vendors`
    this.Button_DownloadCSV = new Element(
      global.page,
      this.page.getByRole('button', { name: PricingVendorRatesTabStrings.Button_DownloadCSV }),
      PricingVendorRatesTabStrings.Button_DownloadCSV
    )
    this.Button_BulkUpdateVendorRates = new Element(
      global.page,
      this.page.getByRole('button', {
        name: PricingVendorRatesTabStrings.Button_BulkUpdateVendorRates,
      }),
      PricingVendorRatesTabStrings.Button_BulkUpdateVendorRates
    )
    this.Button_AddVendorRates = new Element(
      global.page,
      this.page.getByRole('button', { name: PricingVendorRatesTabStrings.Button_AddVendorRates }),
      PricingVendorRatesTabStrings.Button_AddVendorRates
    )
    this.DataTable_PricingVendorRates = new ClaimsPortalDataTable(
      global,
      `#root div[id$="_content"]`,
      1,
      PricingVendorRatesTabStrings.ActionMenu,
      PricingVendorRatesTabStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_PricingVendorRates.WaitForRowsToLoad()
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async IsTemplate(rowIndex: string) {
    const data = new Element(
      this.global.page,
      this.DataTable_PricingVendorRates.table.locator(
        `td[id$='_DataGrid_Row_${rowIndex}_${LookupDataColumn(DataTable_Columns_Type.PricingVendorRates_IsTemplate)}']`
      )
    )
    await data.locator.waitFor({ state: 'visible' })
    const foundPathForTemplateCheckmark = (await data.locator.locator('path').count()) > 0
    return foundPathForTemplateCheckmark
  }

  async VerifyTextDataByColumnName(
    rowIndex: string,
    columnType: DataTable_Columns_Type,
    expectedText: string
  ) {
    const value = await this.DataTable_PricingVendorRates.FetchRowTextDataByColumnName(
      rowIndex,
      columnType
    )
    expect(value).toContain(expectedText)
  }

  async FindIndexOfRowAtPosition(rowPosition: number) {
    const value = await this.DataTable_PricingVendorRates.FetchRowIndexFromRowPosition(rowPosition)
    return value
  }

  async SelectActionMenuItem(
    rowIndex: string,
    actionMenuItem: PricingVendorRates_DataTable_ActionMenuItems
  ) {
    await this.DataTable_PricingVendorRates.OpenActionMenu(rowIndex)
    await this.DataTable_PricingVendorRates.SelectActionMenuItem(actionMenuItem)
  }

  async IsActionMenuItemVisible(
    rowIndex: string,
    actionMenuItem: PricingVendorRates_DataTable_ActionMenuItems
  ) {
    const table = this.DataTable_PricingVendorRates
    await table.OpenActionMenu(rowIndex)
    await this.page.waitForTimeout(1000)
    const visibility = await table.IsActionMenuItemVisible(actionMenuItem)
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async OpenCreateVendorRatesDrawer(newVendorRates: ClaimsPortalVendorRates) {
    await this.Button_AddVendorRates.Click()
    return new ClaimsPortalVendorRatesDrawer(this.global, false, newVendorRates)
  }

  async OpenBulkUpdateVendorRatesDrawer() {
    await this.Button_BulkUpdateVendorRates.Click()
    return new ClaimsPortalUploadVendorRatesDrawer(this.global)
  }

  async AddNewVendorRates(newVendorRates: ClaimsPortalVendorRates) {
    const createVendorRatesDrawer = await this.OpenCreateVendorRatesDrawer(newVendorRates)
    await createVendorRatesDrawer.FillAndSubmit()
  }

  async AddNewVendorRatesFromTemplate(
    templateName: string,
    newVendorRatesName: string,
    vendorsToAssign: string[]
  ) {
    await this.Button_AddVendorRates.Click()
    const createVendorRatesDrawer = new ClaimsPortalVendorRatesDrawer(this.global, false)
    await createVendorRatesDrawer.FillFromTemplateAndSubmit(
      templateName,
      newVendorRatesName,
      vendorsToAssign
    )
  }

  async SelectVendorRatesByName(rowIndex: string, vendorRatesToView: ClaimsPortalVendorRates) {
    await this.DataTable_PricingVendorRates.ClickLinkInDataCell(
      rowIndex,
      DataTable_Columns_Type.PricingVendorRates_VendorName
    )
    const vendorRatesDetailPage = new ClaimsPortalVendorRatesDetailPage(this.global, vendorRatesToView)
    return vendorRatesDetailPage
  }

  async ViewVendorRates(rowIndex: string, vendorRatesToView: ClaimsPortalVendorRates) {
    await this.SelectActionMenuItem(
      rowIndex,
      PricingVendorRates_DataTable_ActionMenuItems.ViewVendorRates
    )
    if (vendorRatesToView.isTemplate) {
      const vendorRatesTemplateDetailPage = new ClaimsPortalVendorRatesTemplateDetailPage(
        this.global,
        vendorRatesToView
      )
      return vendorRatesTemplateDetailPage
    } else {
      const vendorRatesDetailPage = new ClaimsPortalVendorRatesDetailPage(this.global, vendorRatesToView)
      return vendorRatesDetailPage
    }
  }

  async EditVendorRates(rowIndex: string, editVendorRates: ClaimsPortalVendorRates) {
    await this.SelectActionMenuItem(
      rowIndex,
      PricingVendorRates_DataTable_ActionMenuItems.EditVendorRates
    )
    const createVendorRatesDrawer = new ClaimsPortalVendorRatesDrawer(this.global, false, editVendorRates)
    await createVendorRatesDrawer.FillAndSubmit()
  }

  async RemoveExistingVendorRates(rowIndex: string) {
    await this.SelectActionMenuItem(
      rowIndex,
      PricingVendorRates_DataTable_ActionMenuItems.RemoveVendorRates
    )
    await this.HandleRemoveVendorRatesAlert()
    await this.page.waitForTimeout(4000)
  }

  async HandleRemoveVendorRatesAlert(cancelRemove = false) {
    const alert = new ClaimsPortalDeleteAlert(
      this.global,
      AlertStrings.RemoveVendorRates_Title,
      AlertStrings.RemoveVendorRates_Description
    )
    if (cancelRemove) {
      await alert.Button_Close.locator.click({ force: true })
    } else {
      await alert.Button_Delete.locator.click({ force: true })
    }
  }

  async DeleteOldTestVendorRates(vendorRatesPrefix: string) {
    if (await this.DataTable_PricingVendorRates.IsEmpty()) {
      return
    }
    await this.DataTable_PricingVendorRates.SetTableSearch(vendorRatesPrefix)
    let tableIsNotClear = false
    let rowCount = 0
    do {
      rowCount = await this.DataTable_PricingVendorRates.VisibleRowCount()
      tableIsNotClear = rowCount > 0
      if (tableIsNotClear) {
        const index = await this.FindIndexOfRowAtPosition(1)
        await this.RemoveExistingVendorRates(index)
      }
    } while (tableIsNotClear)
    await this.DataTable_PricingVendorRates.CancelPinnedTableSearch()
  }
}
