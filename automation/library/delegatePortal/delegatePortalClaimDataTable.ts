import { Locator } from '@playwright/test'
import { DelegatePortalDataTable } from './delegatePortalDataTable.js'
import { DelegatePortalGlobal } from './delegatePortalGlobal.js'
import { DataTable_Column_PinState, DataTable_Columns_Type } from './delegatePortalConstants.js'
import { LookupDataColumn } from './delegatePortalHelper.js'

export class DelegatePortalClaimDataTable extends DelegatePortalDataTable {
  readonly headerRow: Locator
  readonly rowsSelected: Locator
  readonly expandedTableRoot: string

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
  }

  async IsColumnPinnable(columnType: DataTable_Columns_Type) {
    const buttonLocator = this.table.locator(
      `th[id*='_HeaderRow_0_HeaderCell_${LookupDataColumn(
        columnType
      )}'] button[aria-label="Toggle pin column."]`
    )
    return (await buttonLocator.count()) > 0
  }

  async IsColumnPinnableByName(columnName: string) {
    const buttonLocator = this.table.locator(
      `th[id*='_HeaderRow_0_HeaderCell_${columnName}'] button[aria-label="Toggle pin column."]`
    )
    return (await buttonLocator.count()) > 0
  }

  async SetColumnPinState(columnType: DataTable_Columns_Type, pinState: DataTable_Column_PinState) {
    const currentPinState = await this.FetchColumnPinState(columnType)
    if (
      pinState == DataTable_Column_PinState.NotPinnable ||
      currentPinState == DataTable_Column_PinState.NotPinnable ||
      pinState == currentPinState
    ) {
      return
    }
    const buttonLocator = this.table.locator(
      `th[id*='_HeaderRow_0_HeaderCell_${LookupDataColumn(
        columnType
      )}'] button[aria-label="Toggle pin column."]`
    )
    // if we are here, clicking should put us in the desired state
    await buttonLocator.click()
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

  async FetchColumnPinState(columnType: DataTable_Columns_Type) {
    const buttonLocator = this.table.locator(
      `th[id*='_HeaderRow_0_HeaderCell_${LookupDataColumn(
        columnType
      )}'] button[aria-label="Toggle pin column."]`
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
}
