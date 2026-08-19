import { Locator, expect } from '@playwright/test'
import { Element } from '../shared/element.js'
import {
  BadgeTypes,
  DataTableStrings,
  DataTable_ColumnName_Index,
  DataTable_Column_PinState,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DataTable_ShowPageSize_Options,
  DateFilterTypes,
} from './claimsPortalConstants.js'
import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { LookupDataColumn } from './claimsPortalHelper.js'
import { ClaimsPortalTableFilterDialog } from './dialogs/claimsPortalTableFilterDialog.js'
import { ClaimsPortalTableSearchDialog } from './dialogs/claimsPortalTableSearchDialog.js'
import { ClaimsPortalTableSettingsDialog } from './dialogs/claimsPortalTableSettingsDialog.js'
import { ClaimsPortalBase } from './pages/claimsPortalBase.js'

export class ClaimsPortalDataTable extends ClaimsPortalBase {
  readonly parent: Locator
  readonly table: Locator
  readonly fixedColumns: number
  readonly rows: Locator
  readonly rowsLoading: Locator
  readonly columns: Locator
  readonly Badge: Element
  readonly Button_ExpandTable: Element
  readonly Button_CloseTable: Element
  readonly Button_OpenTableSettings: Element
  readonly Button_OpenTableSearch: Element
  readonly Button_AddTableFilter: Element
  readonly Button_RefreshData: Element
  readonly actionMenuName: string
  readonly actionMenuAria: string
  readonly Button_GoToFirstPage: Element
  readonly Button_GoToPreviousPage: Element
  readonly Button_GoToNextPage: Element
  readonly Button_GoToLastPage: Element
  readonly SpinButton_SetPage: Element

  constructor(
    global: ClaimsGlobal,
    tableSelector: string,
    fixedColumns: number,
    actionMenuName: string = 'undefined',
    actionMenuAria: string = 'undefined'
  ) {
    super(global)
    this.parent = this.page.locator(tableSelector)
    this.table = this.parent.locator('div > .data-grid-table-container table')
    this.fixedColumns = fixedColumns
    this.rows = this.table.locator(`tbody tr`)
    this.rowsLoading = this.table.locator('tbody tr[id$="_Loading"]')
    this.columns = this.table.locator(`thead tr th`)
    this.Badge = new Element(global.page, this.parent.locator('.chakra-badge').nth(0))
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
    this.Button_RefreshData = new Element(
      global.page,
      this.parent.getByLabel(DataTableStrings.RefreshData)
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
    this.actionMenuName = actionMenuName
    this.actionMenuAria = actionMenuAria
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

  async VerifyBadge(badgeSuffix: BadgeTypes) {
    let expectedBadgeCount = 0
    if (await this.IsPaginationActive()) {
      const initialPageData = await this.GetPageInfo()
      if (initialPageData.maxPage > 1) {
        await this.Pagination_GotoPage(initialPageData.maxPage)
        let finalPageData = await this.GetPageInfo()
        const maxRetry = 3
        let currentRetry = 0
        while (finalPageData.currentPage != finalPageData.maxPage && currentRetry < maxRetry) {
          finalPageData = await this.GetPageInfo()
          currentRetry++
        }
        expectedBadgeCount =
          initialPageData.currentPageRowCount * (initialPageData.maxPage - 1) +
          finalPageData.currentPageRowCount
        await this.Pagination_GotoPage(initialPageData.currentPage)
      } else {
        expectedBadgeCount = initialPageData.currentPageRowCount
      }
    } else {
      expectedBadgeCount = await this.VisibleRowCount()
    }
    const assumedBadgeCount = await this.BadgeCount()
    expect(assumedBadgeCount).toBe(expectedBadgeCount)
    await this.Badge.VerifyExpectedText(`${expectedBadgeCount}${badgeSuffix}`)
  }

  async WaitForRowsToLoad() {
    const loadingCount = await this.rowsLoading.count()
    if (loadingCount > 0) {
      await this.rowsLoading.nth(0).waitFor({ state: 'hidden' })
    }
  }

  async IsVisible() {
    return await this.table.isVisible({ timeout: 10000 })
  }

  async IsEmpty() {
    const foundEmptyId = await this.table.locator('tr[id$="DataGrid_Row_Empty"]').count()
    const isEmpty = foundEmptyId > 0
    return isEmpty
  }

  async BadgeCount() {
    const badgeText = await this.Badge.GetText()
    if (badgeText == undefined) {
      throw new Error('Unable to get badge text')
    }
    const dataList = badgeText?.split(' ')
    return Number(dataList[0])
  }

  async VisibleRowCount() {
    const isEmpty = await this.IsEmpty()
    if (!isEmpty) {
      // if there are rows, wait for one to be visible
      await this.rows.nth(0).waitFor({ state: 'visible' })
      return await this.rows.count()
    }
    return 0
  }

  async VisibleColumnCount() {
    await this.columns.nth(0).waitFor({ state: 'visible' })
    return await this.columns.count()
  }

  async IsColumnVisible(columnType: DataTable_Columns_Type) {
    const data = new Element(
      this.global.page,
      this.table.locator(`th[id$='_HeaderRow_0_HeaderCell_${LookupDataColumn(columnType)}']`)
    )
    return await data.IsVisible()
  }

  async FetchColumnNameByColumnIndex(columnIndex: number) {
    const th = this.columns.nth(columnIndex)
    if (columnIndex < this.fixedColumns) {
      return 'fixed - no header'
    }
    const columnName = await th.locator('span').nth(0).textContent()
    return columnName == null ? 'error' : columnName
  }

  async FetchColumnIndexByColumnType(targetColumn: DataTable_Columns_Type) {
    const targetColumnName = LookupDataColumn(targetColumn, DataTable_ColumnName_Index.Column)
    const count = await this.VisibleColumnCount()
    for (let index = this.fixedColumns; index < count; index++) {
      const th = this.columns.nth(index)
      const columnName = await th.locator('span').nth(0).textContent()
      if (columnName == targetColumnName) {
        return index
      }
    }
    throw new Error('Looking for column match that is not visible')
  }

  async IsColumnSortable(columnType: DataTable_Columns_Type) {
    const buttonLocator = this.table.locator(
      `th[id$='_HeaderRow_0_HeaderCell_${LookupDataColumn(
        columnType
      )}'] button[aria-label="Toggle sort column."]`
    )
    return (await buttonLocator.count()) > 0
  }

  async SetColumnSortState(
    columnType: DataTable_Columns_Type,
    targetSortState: DataTable_Column_SortState
  ) {
    const currentSortState = await this.FetchColumnSortState(columnType)
    if (
      targetSortState == DataTable_Column_SortState.NotSortable ||
      currentSortState == DataTable_Column_SortState.NotSortable ||
      targetSortState == currentSortState
    ) {
      return
    }
    const buttonLocator = this.table.locator(
      `th[id$='_HeaderRow_0_HeaderCell_${LookupDataColumn(
        columnType
      )}'] button[aria-label="Toggle sort column."]`
    )
    await buttonLocator.click()
    await this.page.waitForTimeout(1000)
    const nextSortState = await this.FetchColumnSortState(columnType)
    if (nextSortState != targetSortState) {
      // click again
      await buttonLocator.click()
      await this.page.waitForTimeout(1000)
    }
    await this.page.waitForTimeout(500)
  }

  async FetchColumnSortState(columnType: DataTable_Columns_Type) {
    const buttonLocator = this.table.locator(
      `th[id$='_HeaderRow_0_HeaderCell_${LookupDataColumn(
        columnType
      )}'] button[aria-label="Toggle sort column."]`
    )
    if ((await buttonLocator.count()) > 0) {
      const pathCount = await buttonLocator.locator('svg path').count()
      if (pathCount == 3) {
        return DataTable_Column_SortState.Unsorted
      }
      const line1InfoY2 = await buttonLocator.locator('svg line').nth(0).getAttribute('y2')
      const line2InfoY2 = await buttonLocator.locator('svg line').nth(1).getAttribute('y2')
      return line2InfoY2 == line1InfoY2
        ? DataTable_Column_SortState.Down_HighToLow
        : DataTable_Column_SortState.Up_LowToHigh
    }
    return DataTable_Column_SortState.NotSortable
  }

  async IsColumnInViewPort(columnType: DataTable_Columns_Type) {
    const headerLocator = this.table.locator(
      `th[id$='_HeaderRow_0_HeaderCell_${LookupDataColumn(columnType)}']`
    )
    return await this.isLocatorInViewport(headerLocator)
  }

  async isElementInViewport(element: Locator): Promise<boolean> {
    const viewportSize = element.page().viewportSize()
    const boundingBox = await element.boundingBox()

    if (!viewportSize || !boundingBox) {
      return false
    }

    const isBoundingBoxVisible = boundingBox.x >= 0 && boundingBox.y >= 0
    const isBoundingBoxInViewport =
      boundingBox.x + boundingBox.width <= viewportSize.width &&
      boundingBox.y + boundingBox.height <= viewportSize.height

    return isBoundingBoxVisible && isBoundingBoxInViewport
  }

  async FetchRowIndexOfDataByColumnName(targetData: string, columnType: DataTable_Columns_Type) {
    const rows = await this.VisibleRowCount()
    for (let index = 0; index < rows; index++) {
      const actualIndex = await this.FetchRowIndexFromRowPosition(index + 1)
      const rowData = new Element(
        this.global.page,
        this.table.locator(`td[id$='_DataGrid_Row_${actualIndex}_${LookupDataColumn(columnType)}']`)
      )
      await rowData.locator.waitFor({ state: 'visible' })
      if (targetData == (await rowData.GetText())) {
        return actualIndex
      }
    }
    return null
  }

  async FetchRowTextDataByColumnName(
    rowIndex: string,
    columnType: DataTable_Columns_Type,
    forceParagraph = false
  ) {
    const toplevelLocator = this.table.locator(
      `td[id$='_DataGrid_Row_${rowIndex}_${LookupDataColumn(columnType)}']`
    )
    const useLocator = forceParagraph ? toplevelLocator.locator('p') : toplevelLocator
    const data = new Element(this.global.page, useLocator)
    await data.locator.waitFor({ state: 'visible' })
    const result = await data.GetText()
    return result ? result : ''
  }

  async VerifyRowTextDataByColumnName(
    textToVerify: string,
    rowIndex: string,
    columnType: DataTable_Columns_Type,
    forceParagraph = false
  ) {
    const toplevelLocator = this.table.locator(
      `td[id$='_DataGrid_Row_${rowIndex}_${LookupDataColumn(columnType)}']`
    )
    const useLocator = forceParagraph ? toplevelLocator.locator('p') : toplevelLocator
    await useLocator.waitFor({ state: 'visible' })
    await expect(useLocator).toHaveText(textToVerify)
  }

  async FetchRowHrefDataByColumnName(rowIndex: string, columnType: DataTable_Columns_Type) {
    const data = new Element(
      this.global.page,
      this.table.locator(`td[id$='_DataGrid_Row_${rowIndex}_${LookupDataColumn(columnType)}'] a`)
    )
    await data.locator.waitFor({ state: 'visible' })
    const result = await data.locator.getAttribute('href')
    return result ? result : ''
  }

  async FetchRowIndexFromRowPosition(rowPosition: number, isJob = false) {
    const targetRow = this.table.locator(`> tbody tr:nth-child(${rowPosition})`)

    // check for loading
    let targetRowId = await targetRow.getAttribute('id')
    let cleanId = targetRowId == null ? '' : targetRowId
    const maxRetry = 3
    let currentRetry = 0
    while (cleanId.includes('Loading') && currentRetry < maxRetry) {
      await this.page.waitForTimeout(1000)
      targetRowId = await targetRow.getAttribute('id')
      cleanId = targetRowId == null ? '' : targetRowId
      currentRetry++
    }
    const data = cleanId.split('_')
    return isJob ? `job_${data[data.length - 1]}` : data[data.length - 1]
  }

  async VerifyTextDataByColumnName(
    rowIndex: string,
    columnType: DataTable_Columns_Type,
    expectedText: string
  ) {
    const value = await this.FetchRowTextDataByColumnName(rowIndex, columnType)
    expect(value).toContain(expectedText)
  }

  async OpenActionMenu(rowIndex: string) {
    const assembledLocator = `td[id$='_DataGrid_Row_${rowIndex}_${this.actionMenuName}'] button[aria-label="${this.actionMenuAria}"]`
    const button = new Element(this.global.page, this.table.locator(assembledLocator))
    await button.Click()
  }

  async GetControlsId(rowIndex: string) {
    const assembledLocator = `td[id$='_DataGrid_Row_${rowIndex}_${this.actionMenuName}'] button[aria-label="${this.actionMenuAria}"]`
    const controlsId = await this.table.locator(assembledLocator).getAttribute('aria-controls')
    return controlsId
  }

  async IsActionMenuItemVisible(actionMenuItem: string) {
    const assembledLocator = this.page.getByRole('menuitem', { name: `${actionMenuItem}` })
    return await assembledLocator.isVisible()
  }

  async SelectActionMenuItem(actionMenuItem: string) {
    const assembledLocator = this.page.getByRole('menuitem', { name: `${actionMenuItem}` })
    await assembledLocator.click()
  }

  async OpenTableSettings(): Promise<ClaimsPortalTableSettingsDialog> {
    await this.Button_OpenTableSettings.Click()
    const tableSettingsDialog = new ClaimsPortalTableSettingsDialog(this.global)
    await tableSettingsDialog.Title.locator.waitFor({ state: 'visible', timeout: 4000 })
    return tableSettingsDialog
  }

  async OpenTableSearch(): Promise<ClaimsPortalTableSearchDialog> {
    await this.Button_OpenTableSearch.Click()
    const tableSearchDialog = new ClaimsPortalTableSearchDialog(this.global)
    await tableSearchDialog.Title.locator.waitFor({ state: 'attached' })
    return tableSearchDialog
  }

  async SetTableSearch(searchTerm = '', skipClose = false) {
    const tableSearchDialog = await this.OpenTableSearch()
    await tableSearchDialog.Textbox_Search.Click()
    await tableSearchDialog.Textbox_Search.Fill(searchTerm)
    await tableSearchDialog.Wait(1000)
    if (!skipClose) {
      await tableSearchDialog.Close()
      await tableSearchDialog.Title.locator.waitFor({ state: 'detached' })
    }
    return tableSearchDialog
  }

  async IsGlobalSearchActive(globalSearchTerm: string = '') {
    const matchText = globalSearchTerm == '' ? `Global - ` : `Global - "${globalSearchTerm}"`
    const globalSearchCloseButton = new Element(
      this.global.page,
      this.parent.locator('li').filter({ hasText: matchText }).getByLabel('close')
    )
    return await globalSearchCloseButton.IsVisible()
  }

  async CancelPinnedTableSearch(globalSearchTerm: string = '') {
    const matchText = globalSearchTerm == '' ? `Global - ` : `Global - "${globalSearchTerm}"`
    const globalSearchCloseButton = new Element(
      this.global.page,
      this.parent.locator('li').filter({ hasText: matchText }).getByLabel('close')
    )
    expect(await globalSearchCloseButton.IsVisible()).toBe(true)
    await globalSearchCloseButton.Click()
    await globalSearchCloseButton.locator.waitFor({ state: 'detached' })
  }

  async AddTableFilter(
    column: DataTable_Columns_Type,
    isEditMode = false
  ): Promise<ClaimsPortalTableFilterDialog> {
    await this.Button_AddTableFilter.Click()
    await this.page.waitForTimeout(500)
    await this.page
      .getByRole('menuitem', {
        name: `${LookupDataColumn(column, DataTable_ColumnName_Index.Column)}`,
        exact: true,
      })
      .click()
    const tableFilterDialog = new ClaimsPortalTableFilterDialog(this.global, isEditMode)
    await expect(tableFilterDialog.Title.locator).toBeAttached()
    return tableFilterDialog
  }

  async SetTableFilter_Text(
    filterTerm: string,
    column: DataTable_Columns_Type,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await this.AddTableFilter(column, isEditMode)
    await tableFilterDialog.SetTextFilter(filterTerm, column)
    if (!skipClose) {
      await tableFilterDialog.Close()
    }
    const pinnedFilter = `${LookupDataColumn(
      column,
      DataTable_ColumnName_Index.Column
    )} includes "${filterTerm}"` // this will change to equals when bug is fixed
    await this.page.waitForTimeout(1000)
    return { pinnedFilter, tableFilterDialog }
  }

  async SetTableFilter_Selection(
    selection: string,
    column: DataTable_Columns_Type,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await this.AddTableFilter(column, isEditMode)
    await tableFilterDialog.SetSelectionFilter(selection, column)
    if (!skipClose) {
      await tableFilterDialog.Close()
    }
    const pinnedFilter = `${LookupDataColumn(
      column,
      DataTable_ColumnName_Index.Column
    )} equals "${selection}"`
    await this.page.waitForTimeout(1000)
    return { pinnedFilter, tableFilterDialog }
  }

  async SetTableFilter_Date(
    dateFilterType: DateFilterTypes,
    column: DataTable_Columns_Type,
    date: Date,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await this.AddTableFilter(column, isEditMode)
    await tableFilterDialog.SetDateFilter(dateFilterType, column, date)
    if (!skipClose) {
      await tableFilterDialog.Close()
    }
    const filter = LookupDataColumn(column, DataTable_ColumnName_Index.Column)
    let comparison = ''
    switch (dateFilterType) {
      case DateFilterTypes.DateEquals:
        comparison = 'equals'
        break
      case DateFilterTypes.DateGreaterThan:
        comparison = 'greater than'
        break
      case DateFilterTypes.DateLesserThan:
        comparison = 'lesser than'
        break
    }
    const pinnedFilter = `${filter} ${comparison} "${date}"`
    await this.page.waitForTimeout(1000)
    return { pinnedFilter, tableFilterDialog }
  }

  async SetTableFilter_Range(
    minValue: string,
    maxValue: string,
    column: DataTable_Columns_Type,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await this.AddTableFilter(column, isEditMode)
    await tableFilterDialog.SetRangeFilter(minValue, maxValue)
    if (!skipClose) {
      await tableFilterDialog.Close()
    }
    const filter = LookupDataColumn(column, DataTable_ColumnName_Index.Column)
    const pinnedFilter = `${filter} - min: "${minValue}", max: "${maxValue}"`
    await this.page.waitForTimeout(1000)
    return { pinnedFilter, tableFilterDialog }
  }

  async SetTableFilter_Radio(
    column: DataTable_Columns_Type,
    value: string,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await this.AddTableFilter(column, isEditMode)
    await tableFilterDialog.SetRadioFilter(value)
    const pinnedFilter = `${LookupDataColumn(
      column,
      DataTable_ColumnName_Index.Column
    )} includes "${value.toUpperCase()}"`
    if (!skipClose) {
      await tableFilterDialog.Close()
    }
    return { pinnedFilter, tableFilterDialog }
  }

  async IsTableFilterActive(pinnedFilter: string) {
    const pinnedFilterCloseButton = new Element(
      this.global.page,
      this.parent.locator('li').filter({ hasText: pinnedFilter }).getByLabel('close')
    )
    return await pinnedFilterCloseButton.IsVisible()
  }

  async CancelPinnedTableFilter(pinnedFilter: string) {
    const pinnedFilterCloseButton = new Element(
      this.global.page,
      this.parent.locator('li').filter({ hasText: pinnedFilter }).getByLabel('close')
    )
    expect(await pinnedFilterCloseButton.IsVisible()).toBe(true)
    await pinnedFilterCloseButton.Click()
  }

  async ClickLinkInDataCell(rowIndex: string, columnType: DataTable_Columns_Type) {
    const assembledLocator = `td[id$='_DataGrid_Row_${rowIndex}_${LookupDataColumn(columnType)}'] a`
    const hyperlink = new Element(this.global.page, this.table.locator(assembledLocator))
    await hyperlink.Click()
  }

  async ClickLinkInDataCell_ProvideName(rowIndex: string, columnName: string) {
    const assembledLocator = `td[id$='_DataGrid_Row_${rowIndex}_${columnName}'] a`
    // const count = await this.table.locator(assembledLocator).count()
    const hyperlink = new Element(this.global.page, this.table.locator(assembledLocator))
    await hyperlink.Click()
  }

  async ClickButtonInDataCell(rowIndex: string, columnType: DataTable_Columns_Type, nthOffset = 0) {
    const assembledLocator = `td[id$='_DataGrid_Row_${rowIndex}_${LookupDataColumn(
      columnType
    )}'] button`
    const button = new Element(
      this.global.page,
      this.table.locator(assembledLocator).nth(nthOffset)
    )
    await button.Click()
  }

  async IsPaginationActive() {
    return await this.Button_GoToFirstPage.IsVisible()
  }

  async Pagination_SetPageSize(pageSize: DataTable_ShowPageSize_Options) {
    await this.page
      .getByLabel(DataTableStrings.GoToFirstPage)
      .locator('..')
      .locator('..')
      .getByRole('combobox')
      .selectOption({ label: `${pageSize}` })
  }

  async Pagination_GotoPage(page: number) {
    await this.SpinButton_SetPage.Click()
    await this.SpinButton_SetPage.Fill(page.toString())
    await this.page.waitForTimeout(1000)
  }

  async GetPageInfo() {
    const currentPageRowCount = await this.VisibleRowCount()
    if (await this.IsPaginationActive()) {
      const pageInfo = await this.page
        .getByLabel(DataTableStrings.GoToFirstPage)
        .locator('..')
        .locator('..')
        .locator('> div:nth-of-type(2) > span:nth-of-type(1)')
        .textContent()
      if (pageInfo == undefined) {
        throw new Error('Unable to get page information the data table pagination UI')
      }
      const dataList = pageInfo?.split(' ')
      if (dataList.length < 4) {
        throw new Error('Invalid pagination data returned')
      }
      return {
        currentPageRowCount,
        currentPage: Number(dataList[1]),
        maxPage: Number(dataList[3]),
      }
    } else {
      return { currentPageRowCount, currentPage: 1, maxPage: 1 }
    }
  }

  async FetchColumnAccessNameByColumnIndex(columnIndex: number) {
    const th = this.columns.nth(columnIndex)
    if (columnIndex < this.fixedColumns) {
      return 'fixed - no header'
    }
    let targetHeaderId = await th.getAttribute('id')
    targetHeaderId = targetHeaderId == null ? 'error' : targetHeaderId
    const data = targetHeaderId.split('_')
    return data[data.length - 1]
  }

  async FetchColumnPinStateByAccessName(columnAccessName: string) {
    const buttonLocator = this.table.locator(
      `th[id*='_HeaderRow_0_HeaderCell_${columnAccessName}'] button[aria-label="Toggle pin column."]`
    )
    if ((await buttonLocator.count()) > 0) {
      const pathInfo = await buttonLocator.locator('svg > path').getAttribute('d')
      if (pathInfo != null) {
        const pathInfoSplit = pathInfo.split('z')
        // pinned if len 2, unpinned if len 4
        return pathInfoSplit.length == 2
          ? DataTable_Column_PinState.Pinned
          : DataTable_Column_PinState.Unpinned
      }
    }
    return DataTable_Column_PinState.NotPinnable
  }

  async SetColumnPinStateByAccessName(
    columnAccessName: string,
    pinState: DataTable_Column_PinState
  ) {
    const currentPinState = await this.FetchColumnPinStateByAccessName(columnAccessName)
    if (
      pinState == DataTable_Column_PinState.NotPinnable ||
      currentPinState == DataTable_Column_PinState.NotPinnable ||
      pinState == currentPinState
    ) {
      return
    }
    const buttonLocator = this.table.locator(
      `th[id*='_HeaderRow_0_HeaderCell_${columnAccessName}'] button[aria-label="Toggle pin column."]`
    )
    // if we are here, clicking should put us in the desired state
    await buttonLocator.click()
  }

  async FetchColumnIndexByColumnName(targetColumnName: string) {
    const count = await this.VisibleColumnCount()
    for (let index = this.fixedColumns; index < count; index++) {
      const th = this.columns.nth(index)
      const columnName = await th.locator('span').nth(0).textContent()
      if (columnName == targetColumnName) {
        return index
      }
    }
    throw new Error('Looking for column match that is not visible')
  }
}
