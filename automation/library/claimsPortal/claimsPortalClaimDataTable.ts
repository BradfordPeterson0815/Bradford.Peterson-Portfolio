import { Locator, expect } from '@playwright/test'
import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { Element } from '../shared/element.js'
import {
  DataTableStrings,
  DataTable_Columns_Type,
  DataTable_Column_PinState,
  ClaimAssignContactOptions,
} from './claimsPortalConstants.js'
import { LookupDataColumn } from './claimsPortalHelper.js'
import { ClaimsPortalAssignContactDialog } from './dialogs/claimsPortalAssignContactDialog.js'
import { ClaimsPortalAddTagsDialog } from './dialogs/claimsPortalAddTagsDialog.js'
import { ClaimsPortalSelectionDataTable } from './claimsPortalSelectionDataTable.js'

export class ClaimsPortalClaimDataTable extends ClaimsPortalSelectionDataTable {
  readonly headerRow: Locator
  readonly rowsSelected: Locator
  readonly expandedTableRoot: string
  readonly Button_Selection_AssignContact: Element
  readonly Button_Selection_AddTags: Element
  readonly Button_Selection_AddTimelineEvent: Element

  constructor(
    global: ClaimsPortalGlobal,
    tableSelector: string,
    fixedColumns: number,
    actionMenuName: string = 'undefined',
    actionMenuAria: string = 'undefined'
  ) {
    super(global, tableSelector, fixedColumns, actionMenuName, actionMenuAria)
    this.headerRow = this.table.locator(`thead tr`)
    this.rowsSelected = this.table.locator('tbody tr label[data-checked]')
    this.expandedTableRoot = `section[aria-modal='true']`
    this.Button_Selection_AssignContact = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DataTableStrings.AssignContact}` })
    )
    this.Button_Selection_AddTags = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DataTableStrings.AddTags}` })
    )
    this.Button_Selection_AddTimelineEvent = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DataTableStrings.AddTimelineEvent}` })
    )
  }

  async IsColumnPinnable(columnType: DataTable_Columns_Type) {
    const buttonLocator = this.table.locator(
      `th[id*='_HeaderRow_0_HeaderCell_${LookupDataColumn(
        columnType
      )}'] button[aria-label="Toggle pin column."]`
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

  async OpenAssignContact(contactType: ClaimAssignContactOptions): Promise<ClaimsPortalAssignContactDialog> {
    await this.Button_Selection_AssignContact.Click()
    await this.page.getByRole('menuitem', { name: `${contactType}` }).click()
    const assignContactDialog = new ClaimsPortalAssignContactDialog(this.global, contactType)
    await expect(assignContactDialog.Title.locator).toBeAttached()
    return assignContactDialog
  }

  async OpenAddTags(): Promise<ClaimsPortalAddTagsDialog> {
    await this.Button_Selection_AddTags.Click()
    const addTagsDialog = new ClaimsPortalAddTagsDialog(this.global)
    await expect(addTagsDialog.Title.locator).toBeAttached()
    return addTagsDialog
  }

  async TagCountByIndex(rowIndex: string) {
    const assembledLocator = `td[id*='_DataGrid_Row_${rowIndex}_tags'] li`
    const tagCount = await this.table.locator(assembledLocator).count()
    return tagCount
  }

  async TagIsAddedByIndex(rowIndex: string, tag: string) {
    return this.TagWithValueIsAddedByIndex(rowIndex, tag)
  }

  async TagWithValueIsAddedByIndex(
    rowIndex: string,
    tag: string,
    value: string = '',
    retry: boolean = true
  ) {
    const assembledLocator = `td[id*='_DataGrid_Row_${rowIndex}_tags'] li span span`
    const search = value == '' ? `${tag}` : `${tag}:${value}`
    if (retry) {
      const maxRetry = 3
      let currentRetry = 0
      while (
        (await this.table.locator(assembledLocator).locator(`text="${search}"`).count()) == 0 &&
        currentRetry < maxRetry
      ) {
        currentRetry++
        await this.page.waitForTimeout(1000 * currentRetry)
      }
    }
    const tagWithValueExists =
      (await this.table.locator(assembledLocator).locator(`text="${search}"`).count()) > 0
    return tagWithValueExists
  }

  async RemoveTagByIndex(rowIndex: string, tag: string) {
    await this.RemoveTagWithValueByIndex(rowIndex, tag)
  }

  async RemoveTagWithValueByIndex(rowIndex: string, tag: string, value: string = '') {
    const assembledLocator = `td[id*='_DataGrid_Row_${rowIndex}_tags'] li span span`
    const search = value == '' ? `${tag}` : `${tag}:${value}`
    const targetedTagLocator = this.table.locator(assembledLocator).locator(`text="${search}"`)
    if ((await targetedTagLocator.count()) == 0) {
      throw new Error(`Error - tag to remove: ${search} is not attached to claim: ${rowIndex}`)
    }
    const tagRemoveButton = targetedTagLocator.locator('..').locator('button[aria-label="close"]')
    await tagRemoveButton.click()
    await targetedTagLocator.waitFor({ state: 'hidden' })
  }

  async AddTag(key: string, value: string = '', color: string = '') {
    const addTagsDialog = await this.OpenAddTags()
    await addTagsDialog.SetKeyValue(key)
    if (value != '') {
      await addTagsDialog.SetValueValue(value)
    }
    if (color != '') {
      await addTagsDialog.SetColor(color)
    }
    await addTagsDialog.Button_AddAndClose.Click()
    await addTagsDialog.Title.locator.waitFor({ state: 'detached' })
  }
}
