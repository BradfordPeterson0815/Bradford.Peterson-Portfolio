import { Locator, expect } from '@playwright/test'
import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { Element } from '../shared/element.js'
import { DataTableStrings } from './claimsPortalConstants.js'
import { ClaimsPortalSelectionDataTable } from './claimsPortalSelectionDataTable.js'
import { ClaimsPortalExportMediaDrawer } from './drawers/claimsPortalExportMediaDrawer.js'
import { ClaimsPortalMakeMediasVisibleToAdditionalGroupsDrawer } from './drawers/claimsPortalMakeMediasVisibleToAdditionalGroupsDrawer.js'

export class ClaimsPortalMediaDataTable extends ClaimsPortalSelectionDataTable {
  readonly headerRow: Locator
  readonly rowsSelected: Locator
  readonly expandedTableRoot: string
  readonly Button_Selection_ExportMedia: Element
  readonly Button_Selection_UpdateMediaVisibility: Element

  constructor(
    global: ClaimsPortalGlobal,
    TableSelector: string,
    fixedColumns: number,
    actionMenuName: string = 'undefined',
    actionMenuAria: string = 'undefined'
  ) {
    super(global, TableSelector, fixedColumns, actionMenuName, actionMenuAria)
    this.headerRow = this.table.locator(`thead tr`)
    this.rowsSelected = this.table.locator('tbody tr label[data-checked]')
    this.expandedTableRoot = `section[aria-modal='true']`
    this.selectionBadgeLocator = this.parent.locator(
      '> div > div > div:nth-child(1) > div:nth-child(3) > span > span'
    )
    this.Button_Selection_ExportMedia = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DataTableStrings.ExportMedia}` })
    )
    this.Button_Selection_UpdateMediaVisibility = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DataTableStrings.UpdateMediaVisibility}` })
    )
  }

  async SelectAllVisibleRows(checked: boolean) {
    await super.SelectAllVisibleRows(checked, 'importStatus')
  }

  async SelectRowByIndex(rowIndex: string, checked: boolean) {
    await super.SelectRowByIndex(rowIndex, checked, 'importStatus')
  }

  async IsRowSelectedByIndex(rowIndex: string) {
    return await super.IsRowSelectedByIndex(rowIndex, 'importStatus')
  }

  async OpenExportMedia(expectedMediaCount = '1'): Promise<ClaimsPortalExportMediaDrawer> {
    await this.Button_Selection_ExportMedia.Click()
    const exportMediaDrawer = new ClaimsPortalExportMediaDrawer(this.global, expectedMediaCount)
    await expect(exportMediaDrawer.Title.locator).toBeAttached()
    return exportMediaDrawer
  }

  async OpenUpdateMediaVisiblity(): Promise<ClaimsPortalMakeMediasVisibleToAdditionalGroupsDrawer> {
    await this.Button_Selection_UpdateMediaVisibility.Click()
    const updateMediaVisiblityDrawer = new ClaimsPortalMakeMediasVisibleToAdditionalGroupsDrawer(this.global)
    await expect(updateMediaVisiblityDrawer.Title.locator).toBeAttached()
    return updateMediaVisiblityDrawer
  }
}
