import { Locator } from '@playwright/test'
import { DelegatePortalGlobal } from './delegatePortalGlobal.js'
import { Element } from '../shared/element.js'
import { DelegatePortalDataTable } from './delegatePortalDataTable.js'

export class DelegatePortalSelectionDataTable extends DelegatePortalDataTable {
  readonly headerRow: Locator
  readonly rowsSelected: Locator
  readonly expandedTableRoot: string
  readonly Button_CloseSelectionBadge: Element
  selectionBadgeLocator: Locator

  constructor(
    global: DelegatePortalGlobal,
    tableSelector: string,
    fixedColumns: number,
    actionMenuName: string = 'undefined',
    actionMenuAria: string = 'undefined'
  ) {
    super(global, tableSelector, fixedColumns, actionMenuName, actionMenuAria)
    this.headerRow = this.table.locator(`thead tr`)
    this.rowsSelected = this.table.locator('tbody tr label[data-checked]')
    this.expandedTableRoot = `section[aria-modal='true']`
    this.selectionBadgeLocator = this.parent.locator(
      '> div > div > div > div:nth-child(3) > span > span'
    )
    this.Button_CloseSelectionBadge = new Element(
      global.page,
      this.parent.locator(
        'div > div:nth-child(3) > div > div:nth-child(3) > span > button[aria-label="close"]'
      )
    )
  }

  async SelectionBadgeCount() {
    const selectionBadgeText = await this.selectionBadgeLocator.textContent()
    if (selectionBadgeText == undefined) {
      throw new Error('Unable to get Selection badge text')
    }
    const dataList = selectionBadgeText?.split(' ')
    return Number(dataList[0])
  }

  async VisibleSelectedRowCount() {
    await this.page.waitForTimeout(1000)
    const isEmpty = await this.IsEmpty()
    return isEmpty ? 0 : await this.rowsSelected.count()
  }

  async SelectAllVisibleRows(checked: boolean, selectColumnName = 'select') {
    const assembledLocatorIndeterminate = `th[id*='_DataGrid_HeaderRow_0_HeaderCell_${selectColumnName}'] label span[data-indeterminate]`
    if ((await this.table.locator(assembledLocatorIndeterminate).count()) > 0) {
      await this.table.locator(assembledLocatorIndeterminate).click()
      await this.page.waitForTimeout(500)
    }
    const assembledLocator = `th[id*='_DataGrid_HeaderRow_0_HeaderCell_${selectColumnName}'] label`
    const selectAllCheckBox = this.table.locator(assembledLocator)
    await selectAllCheckBox.setChecked(checked)
  }

  async SelectRowByIndex(rowIndex: string, checked: boolean, selectColumnName = 'select') {
    const assembledLocator = `td[id*='_DataGrid_Row_${rowIndex}_${selectColumnName}'] span div label`
    const selectCheckBox = this.table.locator(assembledLocator)
    await selectCheckBox.setChecked(checked)
  }

  async IsRowSelectedByIndex(rowIndex: string, selectColumnName = 'select') {
    const assembledLocator = `td[id*='_DataGrid_Row_${rowIndex}_${selectColumnName}'] span div label`
    const selectCheckBox = this.table.locator(assembledLocator)
    return await selectCheckBox.isChecked()
  }
}
