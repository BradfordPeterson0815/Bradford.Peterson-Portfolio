import { Locator, expect } from 'playwright/test'
import { BPBase } from './bpBase.js'
import { BPGlobal } from './bpGlobal.js'
import { Element } from '../shared/element.js'
import { DataTableStrings } from './bpConstants.js'

export class BPDataTable extends BPBase {
  readonly parent: Locator
  readonly table: Locator
  readonly fixedColumns: number
  readonly rows: Locator
  readonly columns: Locator
  readonly Button_ExpandTable: Element
  readonly Button_CloseTable: Element
  readonly Button_OpenTableSettings: Element
  readonly Button_OpenTableSearch: Element
  readonly Button_AddTableFilter: Element
  readonly Button_GoToFirstPage: Element
  readonly Button_GoToPreviousPage: Element
  readonly Button_GoToNextPage: Element
  readonly Button_GoToLastPage: Element
  readonly SpinButton_SetPage: Element

  constructor(global: BPGlobal, tableSelector: string) {
    super(global)
    this.parent = this.page.locator(tableSelector)
    this.table = this.parent.locator('.data-grid-table-container table')
    this.fixedColumns = 1
    this.rows = this.table.locator(`tbody tr`)
    this.columns = this.table.locator(`thead tr th`)
    this.Button_OpenTableSettings = new Element(
      global.page,
      this.parent.getByLabel(DataTableStrings.OpenTableSettings)
    )
    this.Button_OpenTableSearch = new Element(
      global.page,
      this.parent.getByLabel(DataTableStrings.OpenTableSearch)
    )
    this.Button_AddTableFilter = new Element(
      global.page,
      this.parent.getByLabel(DataTableStrings.AddTableFilter)
    )
    this.Button_ExpandTable = new Element(
      global.page,
      this.parent.getByLabel(DataTableStrings.ExpandTable)
    )
    this.Button_CloseTable = new Element(
      global.page,
      this.page.locator(
        `section[id*="chakra-modal"] button[aria-label="${DataTableStrings.CloseTable}"]`
      )
    )
    this.Button_GoToFirstPage = new Element(
      global.page,
      this.parent.getByLabel(DataTableStrings.GoToFirstPage)
    )
    this.Button_GoToPreviousPage = new Element(
      global.page,
      this.parent.getByLabel(DataTableStrings.GoToPreviousPage)
    )
    this.Button_GoToNextPage = new Element(
      global.page,
      this.parent.getByLabel(DataTableStrings.GoToNextPage)
    )
    this.Button_GoToLastPage = new Element(
      global.page,
      this.parent.getByLabel(DataTableStrings.GoToLastPage)
    )
    this.SpinButton_SetPage = new Element(global.page, this.parent.getByRole('spinbutton'))
  }

  async WaitForLoad() {
    await this.table.waitFor({ state: 'visible', timeout: 30000 })
  }

  async IsVisible() {
    return await this.table.isVisible()
  }

  async IsEmpty() {
    return (await this.table.getByRole('cell', { name: 'No data to display.' }).count()) > 0
  }

  async VisibleRowCount() {
    await this.page.waitForTimeout(1000)
    const isEmpty = await this.IsEmpty()
    const count = isEmpty ? 0 : await this.rows.count()
    return count
  }

  async VisibleColumnCount() {
    await this.page.waitForTimeout(1000)
    return await this.columns.count()
  }

  async FetchRowIndexOfDataByColumnName(targetData: string, columnName: string) {
    const rows = await this.VisibleRowCount()
    for (let index = 0; index < rows; index++) {
      const actualIndex = await this.FetchRowIndexFromRowPosition(index + 1)
      const rowData = this.table.locator(`td[id*='_DataGrid_Row_${actualIndex}_${columnName}']`)
      const text = await rowData.textContent()
      if (targetData == text) {
        return actualIndex
      }
    }
    return null
  }

  async FetchRowTextDataByColumnName(rowIndex: string, columnName: string, forceParagraph = false) {
    const toplevelLocator = this.table.locator(`td[id*='_DataGrid_Row_${rowIndex}_${columnName}']`)
    const useLocator = forceParagraph ? toplevelLocator.locator('p') : toplevelLocator
    const data = new Element(this.global.page, useLocator)
    const result = await data.GetText()
    return result ? result : ''
  }

  async FetchRowHrefDataByColumnName(rowIndex: string, columnName: string) {
    const data = new Element(
      this.global.page,
      this.table.locator(`td[id*='_DataGrid_Row_${rowIndex}_${columnName}'] a`)
    )
    const result = await data.locator.getAttribute('href')
    return result ? result : ''
  }

  async FetchRowIndexFromRowPosition(rowPosition: number, isJob = false) {
    const targetRow = this.table.locator(`> tbody tr:nth-child(${rowPosition})`)
    const targetRowId = await targetRow.getAttribute('id')
    if (targetRowId == null) {
      throw new Error(
        `Unexpected error locating the index of row position: ${rowPosition} from row id of: ${targetRowId}`
      )
    }
    const data = targetRowId.split('_')
    return isJob ? `job_${data[data.length - 1]}` : data[data.length - 1]
  }

  async FetchRowIndexFromRowPosition(rowPosition: number, isJob = false) {
    const targetRow = this.table.locator(`> tbody tr:nth-child(${rowPosition})`)
    const targetRowId = await targetRow.getAttribute('id')
    if (targetRowId == null) {
      throw new Error(
        `Unexpected error locating the index of row position: ${rowPosition} from row id of: ${targetRowId}`
      )
    }
    const data = targetRowId.split('_')
    return isJob ? `job_${data[data.length - 1]}` : data[data.length - 1]
  }

  async VerifyTextDataByColumnName(rowIndex: string, columnName: string, expectedText: string) {
    const value = await this.FetchRowTextDataByColumnName(rowIndex, columnName)
    expect(value).toContain(expectedText)
  }

  async ClickLinkInDataCell(rowIndex: string, columnName: string) {
    const assembledLocator = `td[id*='_DataGrid_Row_${rowIndex}_${columnName}'] a`
    const hyperlink = new Element(this.global.page, this.table.locator(assembledLocator))
    await hyperlink.Click()
  }

  async ClickLinkInDataCell_ProvideName(rowIndex: string, columnName: string) {
    const assembledLocator = `td[id*='_DataGrid_Row_${rowIndex}_${columnName}'] a`
    const hyperlink = new Element(this.global.page, this.table.locator(assembledLocator))
    await hyperlink.Click()
  }

  async ClickButtonInDataCell(rowIndex: string, columnName: string, nthOffset = 0) {
    const assembledLocator = `td[id*='_DataGrid_Row_${rowIndex}_${columnName}'] button`
    const button = new Element(
      this.global.page,
      this.table.locator(assembledLocator).nth(nthOffset)
    )
    await button.Click()
  }
}
