import { Locator } from '@playwright/test'
import { DataGrid_Column_Type, DataGrid_DateSearchOption } from './claimsPortalConstants.js'
import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { LookupDataGridColumnInformation } from './claimsPortalHelper.js'
import { ClaimsPortalBase } from './pages/claimsPortalBase.js'
import { ClaimsPortalDataGridColumnSettingsPopup } from './popups/claimsPortalDataGridColumnSettingsPopup.js'
import { ClaimsPortalDataGridDateSearchPopup } from './popups/claimsPortalDataGridDateSearchPopup.js'
import { ClaimsPortalDataGridListSearchPopup } from './popups/claimsPortalDataGridListSearchPopup.js'
import { ClaimsPortalDataGridTextSearchPopup } from './popups/claimsPortalDataGridTextSearchPopup.js'

export class ClaimsPortalDataGrid extends ClaimsPortalBase {
  readonly parent: Locator
  readonly table: Locator
  readonly pagination: Locator
  readonly rows: Locator
  readonly columns: Locator
  readonly hasActionColumn: boolean

  constructor(
    global: ClaimsPortalGlobal,
    tableParentLocator: Locator,
    tableParentIndex: number = 0,
    hasActionColumn: boolean = true
  ) {
    super(global)
    this.hasActionColumn = hasActionColumn
    this.parent = tableParentLocator.nth(tableParentIndex)
    this.table = this.parent.locator(
      'div[data-slot="data-grid"] table[data-slot="data-grid-table"]'
    )
    this.pagination = this.parent.locator('div[data-slot="data-grid-pagination"]')
    this.rows = this.table.locator(`tbody tr`)
    this.columns = this.table.locator(`thead tr th`)
  }

  async IsVisible() {
    return await this.table.isVisible()
  }

  async IsEmpty() {
    const isEmpty = (await this.table.getByRole('cell', { name: 'No data available' }).count()) > 0
    return isEmpty
  }

  async VisibleRowCount() {
    await this.page.waitForTimeout(1000)
    const isEmpty = await this.IsEmpty()
    if (!isEmpty) {
      // if there are rows, wait for one to be visible
      await this.rows.nth(0).waitFor({ state: 'visible' })
      return await this.rows.count()
    }
    return 0
  }

  async VisibleColumnCount() {
    await this.page.waitForTimeout(1000)
    const actualCount = (await this.columns.count()) + (this.hasActionColumn ? -1 : 0)
    return actualCount
  }

  async ActualColumnCount() {
    await this.page.waitForTimeout(1000)
    const actualCount = await this.columns.count()
    return actualCount
  }

  async IsColumnVisible(column: DataGrid_Column_Type) {
    const columnInfo = LookupDataGridColumnInformation(column)
    const columnLocator = columnInfo.settings
      ? this.table.locator('th>div>div>button> span[class="contents"]').getByText(columnInfo.name)
      : this.table.locator('th').getByText(columnInfo.name)
    return await columnLocator.isVisible()
  }

  async FindColumnIndexByName(targetColumn: DataGrid_Column_Type) {
    const columnInfo = LookupDataGridColumnInformation(targetColumn)
    const columnHeaderCount = await this.ActualColumnCount()
    for (let columnIndex = 0; columnIndex < columnHeaderCount; columnIndex++) {
      const headerLocator = this.table.locator('th').nth(columnIndex)
      const finalHeaderLocator = columnInfo.settings
        ? headerLocator.locator('div>div>button> span[class="contents"]').first()
        : headerLocator
      if ((await finalHeaderLocator.count()) > 0) {
        const actualHeaderName = await finalHeaderLocator.textContent()
        if (actualHeaderName === columnInfo.name) {
          return columnIndex
        }
      }
    }
    throw new Error(`No DataGrid column with a name of: ${columnInfo.name} is currently visible`)
  }

  async ClickLinkInDataCell(rowIndex: number, targetColumn: DataGrid_Column_Type) {
    const columnIndex = await this.FindColumnIndexByName(targetColumn)
    const assembledLocator = this.rows
      .nth(rowIndex)
      .locator('td')
      .nth(columnIndex)
      .locator('a[data-slot="button"]')
    await assembledLocator.click()
  }

  async ClickMetadataButtonInDataCell(rowIndex: number, targetColumn: DataGrid_Column_Type) {
    const columnIndex = await this.FindColumnIndexByName(targetColumn)
    const assembledLocator = this.rows
      .nth(rowIndex)
      .locator('td')
      .nth(columnIndex)
      .locator('button[data-slot="popover-trigger"]')
    await assembledLocator.click()
  }

  async OpenActionMenu(rowIndex: number) {
    const assembledLocator = this.table
      .locator('td')
      .nth(rowIndex)
      .locator(`button[data-slot="menu-trigger"][aria-haspopup="menu"]`)
    await assembledLocator.click()
  }

  async IsActionMenuItemVisible(actionMenuItem: string) {
    const assembledLocator = this.page.getByRole('menuitem', { name: `${actionMenuItem}` })
    return await assembledLocator.isVisible()
  }

  async SelectActionMenuItem(actionMenuItem: string) {
    const assembledLocator = this.page.getByRole('menuitem', { name: `${actionMenuItem}` })
    await assembledLocator.click()
  }

  async OpenColumnSettingsPopup(targetColumn: DataGrid_Column_Type) {
    const columnIndex = await this.FindColumnIndexByName(targetColumn)
    const assembledColumnSettingsButtonLocator = this.table
      .locator('th')
      .nth(columnIndex)
      .locator(`button[data-slot="menu-trigger"][aria-haspopup="menu"]`)
    await assembledColumnSettingsButtonLocator.click()
    const settingsPopup = new ClaimsPortalDataGridColumnSettingsPopup(this.global)
    await settingsPopup.parentLocator.waitFor({ state: 'attached' })
    return settingsPopup
  }

  async UnpinColumn(targetColumn: DataGrid_Column_Type) {
    const columnIndex = await this.FindColumnIndexByName(targetColumn)
    const columnInfo = LookupDataGridColumnInformation(targetColumn)
    const assembledUnpinButtonLocator = this.table
      .locator('th')
      .nth(columnIndex)
      .locator(`button[data-slot="button"][aria-label="Unpin ${columnInfo.name} column"]`)
    await assembledUnpinButtonLocator.click()
  }

  async OpenTextSearchPopup(targetColumn: DataGrid_Column_Type) {
    const columnIndex = await this.FindColumnIndexByName(targetColumn)
    const assembledFilterButtonLocator = this.table
      .locator('th')
      .nth(columnIndex)
      .locator(`button[data-slot="popover-trigger"][aria-haspopup="dialog"]`)
    await assembledFilterButtonLocator.click()
    const textSearchPopup = new ClaimsPortalDataGridTextSearchPopup(this.global)
    return textSearchPopup
  }

  async SetTextSearch(
    searchTerm: string,
    targetColumn: DataGrid_Column_Type,
    closeAfterSet: boolean
  ) {
    const textSearchPopup = await this.OpenTextSearchPopup(targetColumn)
    await textSearchPopup.SetSearch(searchTerm, closeAfterSet)
  }

  async ClearTextSearch(targetColumn: DataGrid_Column_Type, closeAfterClear: boolean) {
    const textSearchPopup = await this.OpenTextSearchPopup(targetColumn)
    await textSearchPopup.ClearSearch(closeAfterClear)
  }

  async OpenDateSearchPopup(targetColumn: DataGrid_Column_Type) {
    const columnIndex = await this.FindColumnIndexByName(targetColumn)
    const assembledFilterButtonLocator = this.table
      .locator('th')
      .nth(columnIndex)
      .locator(`button[data-slot="popover-trigger"][aria-haspopup="dialog"]`)
    await assembledFilterButtonLocator.click()
    const dateSearchPopup = new ClaimsPortalDataGridDateSearchPopup(this.global)
    return dateSearchPopup
  }

  async SetDateSearch(
    searchDate: Date,
    dateSearchOption: DataGrid_DateSearchOption | null,
    targetColumn: DataGrid_Column_Type
  ) {
    const dateSearchPopup = await this.OpenDateSearchPopup(targetColumn)
    await dateSearchPopup.SetSearchDate(searchDate, false)
    if (dateSearchOption != null) {
      await dateSearchPopup.SetSearchOption(dateSearchOption, true)
    }
  }

  async ClearDateSearch(targetColumn: DataGrid_Column_Type, closeAfterClear: boolean) {
    const dateSearchPopup = await this.OpenDateSearchPopup(targetColumn)
    await dateSearchPopup.ClearSearch(closeAfterClear)
  }

  async OpenListSearchPopup(targetColumn: DataGrid_Column_Type) {
    const columnIndex = await this.FindColumnIndexByName(targetColumn)
    const assembledFilterButtonLocator = this.table
      .locator('th')
      .nth(columnIndex)
      .locator(`button[data-slot="popover-trigger"][aria-haspopup="dialog"]`)
    await assembledFilterButtonLocator.click()
    const listSearchPopup = new ClaimsPortalDataGridListSearchPopup(this.global)
    return listSearchPopup
  }

  async SetListSearch(
    listItem: string,
    targetColumn: DataGrid_Column_Type,
    filterText: string = '',
    closeAfterSet: boolean = true
  ) {
    const listSearchPopup = await this.OpenListSearchPopup(targetColumn)
    if (filterText != '') {
      await listSearchPopup.SetTextSearch(filterText)
    }
    await listSearchPopup.ClearFilters(false)
    await listSearchPopup.SelectListItem(listItem, closeAfterSet)
  }

  async ClearListSearch(targetColumn: DataGrid_Column_Type, closeAfterClear: boolean) {
    const listSearchPopup = await this.OpenListSearchPopup(targetColumn)
    await listSearchPopup.ClearFilters(closeAfterClear)
  }

  async ShowColumn(targetColumn: DataGrid_Column_Type, columnToShow: DataGrid_Column_Type) {
    const settingsPop = await this.OpenColumnSettingsPopup(targetColumn)
    await settingsPop.ShowColumn(columnToShow)
    await this.table.focus()
  }

  async HideColumn(
    targetColumn: DataGrid_Column_Type,
    columnToHide: DataGrid_Column_Type,
    closeAfterHide: boolean
  ) {
    const settingsPop = await this.OpenColumnSettingsPopup(targetColumn)
    await settingsPop.HideColumn(columnToHide, closeAfterHide)
    if (closeAfterHide) {
      await this.table.focus()
    }
  }
}
