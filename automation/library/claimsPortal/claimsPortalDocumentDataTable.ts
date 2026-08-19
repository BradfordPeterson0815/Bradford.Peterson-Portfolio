import { Locator, expect } from '@playwright/test'
import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { Element } from '../shared/element.js'
import { DataTableStrings } from './claimsPortalConstants.js'
import { ClaimsPortalSelectionDataTable } from './claimsPortalSelectionDataTable.js'
import { ClaimsPortalExportDocumentDrawer } from './drawers/claimsPortalExportDocumentDrawer.js'
import { ClaimsPortalMakeDocumentsVisibleToAdditionalGroupsDrawer } from './drawers/claimsPortalMakeDocumentsVisibleToAdditionalGroupsDrawer.js'

export class ClaimsPortalDocumentDataTable extends ClaimsPortalSelectionDataTable {
  readonly headerRow: Locator
  readonly rowsSelected: Locator
  readonly expandedTableRoot: string
  readonly Button_Selection_ExportDocument: Element
  readonly Button_Selection_ExportDocuments: Element
  readonly Button_Selection_UpdateDocumentVisibility: Element
  readonly Button_Selection_UpdateDocumentsVisibility: Element

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
    this.selectionBadgeLocator = this.parent.locator('> div > div > div:nth-child(3) > span > span')
    this.Button_Selection_ExportDocument = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DataTableStrings.ExportDocument}` })
    )
    this.Button_Selection_ExportDocuments = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DataTableStrings.ExportDocuments}` })
    )
    this.Button_Selection_UpdateDocumentVisibility = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DataTableStrings.UpdateDocumentVisibility}` })
    )
    this.Button_Selection_UpdateDocumentsVisibility = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DataTableStrings.UpdateDocumentsVisibility}` })
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

  async OpenExportDocument(): Promise<ClaimsPortalExportDocumentDrawer> {
    await this.Button_Selection_ExportDocument.Click()
    const exportDocumentDrawer = new ClaimsPortalExportDocumentDrawer(this.global)
    await expect(exportDocumentDrawer.Title.locator).toBeAttached()
    return exportDocumentDrawer
  }

  async OpenExportDocuments(): Promise<ClaimsPortalExportDocumentDrawer> {
    await this.Button_Selection_ExportDocuments.Click()
    const exportDocumentsDrawer = new ClaimsPortalExportDocumentDrawer(this.global)
    await expect(exportDocumentsDrawer.Title.locator).toBeAttached()
    return exportDocumentsDrawer
  }

  async OpenUpdateDocumentVisiblity(): Promise<ClaimsPortalMakeDocumentsVisibleToAdditionalGroupsDrawer> {
    await this.Button_Selection_UpdateDocumentVisibility.Click()
    const updateDocumentVisiblityDrawer = new ClaimsPortalMakeDocumentsVisibleToAdditionalGroupsDrawer(
      this.global
    )
    await expect(updateDocumentVisiblityDrawer.Title.locator).toBeAttached()
    return updateDocumentVisiblityDrawer
  }

  async OpenUpdateDocumentsVisiblity(): Promise<ClaimsPortalMakeDocumentsVisibleToAdditionalGroupsDrawer> {
    await this.Button_Selection_UpdateDocumentsVisibility.Click()
    const updateDocumentVisiblityDrawer = new ClaimsPortalMakeDocumentsVisibleToAdditionalGroupsDrawer(
      this.global
    )
    await expect(updateDocumentVisiblityDrawer.Title.locator).toBeAttached()
    return updateDocumentVisiblityDrawer
  }
}
