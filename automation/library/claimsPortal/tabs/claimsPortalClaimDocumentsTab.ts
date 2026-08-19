import { expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { ClaimsPortalDeleteAlert } from '../alerts/claimsPortalDeleteAlert.js'
import { ClaimsPortalClaim } from '../claimsPortalClaim.js'
import {
  AlertStrings,
  DataTable_ColumnName_Index,
  DataTable_Columns_Type,
  DocumentsTabStrings,
  Documents_DataTable_ActionMenuItems,
  Filter_Radio_Visibility,
} from '../claimsPortalConstants.js'
import { ClaimsPortalDocumentDataTable } from '../claimsPortalDocumentDataTable.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { LookupDataColumn } from '../claimsPortalHelper.js'
import { ClaimsPortalUpdateDocumentInformationDrawer } from '../drawers/claimsPortalUpdateDocumentInformationDrawer.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalAddTagsDialog } from '../dialogs/claimsPortalAddTagsDialog.js'
import { ClaimsPortalPhotoReportTab } from './claimsPortalPhotoReportTab.js'
import { ClaimsPortalGenerateDocumentTab } from './claimsPortalGenerateDocumentTab.js'

export class ClaimsPortalClaimDocumentsTab extends ClaimsPortalBasePage {
  readonly claim: ClaimsPortalClaim
  readonly URL: string
  readonly Title: Element
  readonly Button_CreateDocuments: Element
  readonly MenuItem_CreatePhotoReport: Element
  readonly MenuItem_GenerateDraftDocument: Element
  readonly Link_UploadDocuments: Element
  readonly DataTable_Documents: ClaimsPortalDocumentDataTable

  constructor(global: ClaimsPortalGlobal, claim: ClaimsPortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/documents`
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${DocumentsTabStrings.Title}` }),
      DocumentsTabStrings.Title
    )
    this.Button_CreateDocuments = new Element(
      global.page,
      this.page.getByRole('button', { name: DocumentsTabStrings.Button_CreateDocuments }),
      DocumentsTabStrings.Button_CreateDocuments
    )
    this.MenuItem_CreatePhotoReport = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: DocumentsTabStrings.MenuItem_CreatePhotoReport }),
      DocumentsTabStrings.MenuItem_CreatePhotoReport
    )
    this.MenuItem_GenerateDraftDocument = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: DocumentsTabStrings.MenuItem_GenerateDraftDocument }),
      DocumentsTabStrings.MenuItem_GenerateDraftDocument
    )
    this.Link_UploadDocuments = new Element(
      global.page,
      this.page.getByRole('link', { name: `${DocumentsTabStrings.Link_UploadDocuments}` }),
      DocumentsTabStrings.Link_UploadDocuments
    )
    this.DataTable_Documents = new ClaimsPortalDocumentDataTable(
      global,
      `#root div[id$="_content"]`,
      2,
      DocumentsTabStrings.ActionMenu,
      DocumentsTabStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_Documents.WaitForRowsToLoad()
  }

  async OpenPhotoReportTab(claimNumber: string) {
    await this.Button_CreateDocuments.Click()
    await this.MenuItem_CreatePhotoReport.Click()
    const photoReportTab = new ClaimsPortalPhotoReportTab(this.global, `claims/${claimNumber}`)
    return photoReportTab
  }

  async OpenGenerateDocumentTab(claimNumber: string) {
    await this.Button_CreateDocuments.Click()
    await this.MenuItem_GenerateDraftDocument.Click()
    const generateDocumentTab = new ClaimsPortalGenerateDocumentTab(this.global, `claims/${claimNumber}`)
    await generateDocumentTab.page.waitForTimeout(1000)
    return generateDocumentTab
  }

  async SetTableFilter_Selection(
    selection: string,
    column: DataTable_Columns_Type,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await this.DataTable_Documents.AddTableFilter(column, isEditMode)
    await tableFilterDialog.SetSelectionFilter(selection, column)
    if (!skipClose) {
      await tableFilterDialog.Close()
    }
    const pinnedFilter = `${LookupDataColumn(
      column,
      DataTable_ColumnName_Index.Column
    )} includes "${selection}"`
    return { pinnedFilter, tableFilterDialog }
  }

  async SetTableFilter_Radio_Visibility(
    visibility: Filter_Radio_Visibility,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await this.DataTable_Documents.AddTableFilter(
      DataTable_Columns_Type.Documents_Visibility,
      isEditMode
    )
    await tableFilterDialog.SetRadioFilter(visibility)
    const pinnedFilter = `${LookupDataColumn(
      DataTable_Columns_Type.Documents_Visibility,
      DataTable_ColumnName_Index.Column
    )} includes "${visibility}"`
    if (!skipClose) {
      await tableFilterDialog.Close()
    }
    return { pinnedFilter, tableFilterDialog }
  }

  async VerifyTextDataByColumnName(
    rowIndex: string,
    columnType: DataTable_Columns_Type,
    expectedText: string
  ) {
    const value = await this.DataTable_Documents.FetchRowTextDataByColumnName(rowIndex, columnType)
    expect(value).toContain(expectedText)
  }

  async SelectActionMenuItem(
    rowIndex: string,
    actionMenuItem: Documents_DataTable_ActionMenuItems
  ) {
    await this.DataTable_Documents.OpenActionMenu(rowIndex)
    await this.DataTable_Documents.SelectActionMenuItem(actionMenuItem)
  }

  async IsActionMenuItemVisible(
    rowIndex: string,
    actionMenuItem: Documents_DataTable_ActionMenuItems
  ) {
    const table = this.DataTable_Documents
    await table.OpenActionMenu(rowIndex)
    await this.page.waitForTimeout(1000)
    const visibility = await table.IsActionMenuItemVisible(actionMenuItem)
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async OpenUpdateDocumentInformationDrawer(rowIndex: string) {
    await this.SelectActionMenuItem(rowIndex, Documents_DataTable_ActionMenuItems.UpdateDocument)
    return new ClaimsPortalUpdateDocumentInformationDrawer(this.global)
  }

  async DeleteExistingDocument(rowIndex: string) {
    await this.SelectActionMenuItem(rowIndex, Documents_DataTable_ActionMenuItems.DeleteDocument)
    await this.HandleDeleteDocumentAlert()
    await this.page.waitForTimeout(1000)
  }

  async HandleDeleteDocumentAlert(cancelDelete = false) {
    const alert = new ClaimsPortalDeleteAlert(
      this.global,
      AlertStrings.DeleteDocument_Title,
      AlertStrings.DeleteDocument_Description
    )
    if (cancelDelete) {
      await alert.Button_Close.locator.click({ force: true })
    } else {
      await alert.Button_Delete.locator.click({ force: true })
    }
  }

  async OpenDocumentLinkInNewTabVerifyAndClose(rowIndex: string, downloading = false) {
    const expectedTitle = await this.DataTable_Documents.FetchRowTextDataByColumnName(
      rowIndex,
      DataTable_Columns_Type.Documents_FileName
    )
    // currently always downloading so override headless exception
    downloading = false
    if (!downloading) {
      const pagePromise = this.context.waitForEvent('page')
      await this.DataTable_Documents.ClickLinkInDataCell(
        rowIndex,
        DataTable_Columns_Type.Documents_File
      )
      const pageNew = await pagePromise
      await pageNew.waitForURL(/.*/)
      await pageNew.bringToFront()
      await pageNew.waitForTimeout(1000)
      const url = pageNew.url()
      expect(decodeURI(url)).toContain(expectedTitle)
      await pageNew.close()
    } else {
      const [download] = await Promise.all([
        this.page.waitForEvent('download'), // wait for download to start
        this.DataTable_Documents.ClickLinkInDataCell(
          rowIndex,
          DataTable_Columns_Type.Documents_File
        ),
      ])
      const endsWithPdf = download.suggestedFilename().endsWith('.pdf')
      expect(endsWithPdf).toBe(true)
    }
  }

  async OpenDownloadLinkInNewTabVerifyAndClose(rowIndex: string, downloading = false) {
    const expectedTitle = await this.DataTable_Documents.FetchRowTextDataByColumnName(
      rowIndex,
      DataTable_Columns_Type.Documents_FileName
    )
    // currently always downloading so override headless exception
    downloading = false
    if (!downloading) {
      const pagePromise = this.context.waitForEvent('page')
      await this.DataTable_Documents.ClickLinkInDataCell_ProvideName(rowIndex, 'download')
      const pageNew = await pagePromise
      await pageNew.waitForURL(/.*/)
      await pageNew.bringToFront()
      await pageNew.waitForTimeout(1000)
      const url = pageNew.url()
      expect(decodeURI(url)).toContain(expectedTitle)
      await pageNew.close()
    } else {
      await this.DataTable_Documents.ClickLinkInDataCell_ProvideName(rowIndex, 'download')
      const [download] = await Promise.all([
        this.page.waitForEvent('download'), // wait for download to start
        this.DataTable_Documents.ClickLinkInDataCell(
          rowIndex,
          DataTable_Columns_Type.Documents_File
        ),
      ])
      const endsWithPdf = download.suggestedFilename().endsWith('.pdf')
      expect(endsWithPdf).toBe(true)
    }
  }

  async OpenVersionedDocumentLinkInNewTabVerifyAndClose(
    rowIndex: string,
    version: number,
    versionsShowing = false,
    downloading = false
  ) {
    if (!versionsShowing) {
      await this.DataTable_Documents.ClickButtonInDataCell(
        rowIndex,
        DataTable_Columns_Type.Documents_File
      )
    }
    await this.page.waitForTimeout(1000)
    const versionRowIndex = await this.DataTable_Documents.FetchRowIndexFromRowPosition(version)
    await this.page.waitForTimeout(1000)
    const pagePromise = this.context.waitForEvent('page')
    const expectedTitle = await this.DataTable_Documents.FetchRowTextDataByColumnName(
      versionRowIndex,
      DataTable_Columns_Type.Documents_FileName
    )
    // currently always downloading so override headless exception
    downloading = false
    if (!downloading) {
      await this.DataTable_Documents.ClickLinkInDataCell(
        versionRowIndex,
        DataTable_Columns_Type.Documents_File
      )
      const pageNew = await pagePromise
      await pageNew.waitForURL(/.*/)
      await pageNew.bringToFront()
      await pageNew.waitForTimeout(1000)
      const url = pageNew.url()
      expect(decodeURI(url)).toContain(expectedTitle)
      await pageNew.close()
    } else {
      const [download] = await Promise.all([
        this.page.waitForEvent('download'), // wait for download to start
        await this.DataTable_Documents.ClickLinkInDataCell(
          versionRowIndex,
          DataTable_Columns_Type.Documents_File
        ),
      ])
      const endsWithPdf = download.suggestedFilename().endsWith('.pdf')
      expect(endsWithPdf).toBe(true)
    }
  }

  async OpenVersionedDownloadLinkInNewTabVerifyAndClose(
    rowIndex: string,
    version: number,
    versionsShowing = false,
    downloading = false
  ) {
    if (!versionsShowing) {
      await this.DataTable_Documents.ClickButtonInDataCell(
        rowIndex,
        DataTable_Columns_Type.Documents_File
      )
    }
    await this.page.waitForTimeout(1000)
    const versionRowIndex = await this.DataTable_Documents.FetchRowIndexFromRowPosition(version)
    await this.page.waitForTimeout(1000)
    const pagePromise = this.context.waitForEvent('page')
    const expectedTitle = await this.DataTable_Documents.FetchRowTextDataByColumnName(
      versionRowIndex,
      DataTable_Columns_Type.Documents_FileName
    )
    // currently always downloading so override headless exception
    downloading = false
    if (!downloading) {
      await this.DataTable_Documents.ClickLinkInDataCell_ProvideName(rowIndex, 'download')
      const pageNew = await pagePromise
      await pageNew.waitForURL(/.*/)
      await pageNew.bringToFront()
      await pageNew.waitForTimeout(1000)
      const url = pageNew.url()
      expect(decodeURI(url)).toContain(expectedTitle)
      await pageNew.close()
    } else {
      const [download] = await Promise.all([
        this.page.waitForEvent('download'), // wait for download to start
        await this.DataTable_Documents.ClickLinkInDataCell_ProvideName(versionRowIndex, 'download'),
      ])
      const endsWithPdf = download.suggestedFilename().endsWith('.pdf')
      expect(endsWithPdf).toBe(true)
    }
  }

  async OpenAddTagsByIndex(rowIndex: string): Promise<ClaimsPortalAddTagsDialog> {
    await this.SelectActionMenuItem(rowIndex, Documents_DataTable_ActionMenuItems.AddTags)
    const addTagsDialog = new ClaimsPortalAddTagsDialog(this.global)
    await expect(addTagsDialog.Title.locator).toBeAttached()
    return addTagsDialog
  }

  async TagCountByIndex(rowIndex: string) {
    const assembledLocator = `td[id*='_DataGrid_Row_${rowIndex}_tags'] li`
    const tagCount = await this.DataTable_Documents.table.locator(assembledLocator).count()
    return tagCount
  }

  async TagIsAddedByIndex(rowIndex: string, tag: string) {
    return this.TagWithValueIsAddedByIndex(rowIndex, tag)
  }

  async TagWithValueIsAddedByIndex(rowIndex: string, tag: string, value: string = '') {
    const assembledLocator = `td[id*='_DataGrid_Row_${rowIndex}_tags'] li span span`
    const search = value == '' ? `${tag}` : `${tag}:${value}`
    const tagWithValueExists =
      (await this.DataTable_Documents.table
        .locator(assembledLocator)
        .locator(`text="${search}"`)
        .count()) > 0
    return tagWithValueExists
  }

  async RemoveTagByIndex(rowIndex: string, tag: string) {
    await this.RemoveTagWithValueByIndex(rowIndex, tag)
  }

  async RemoveTagWithValueByIndex(rowIndex: string, tag: string, value: string = '') {
    const assembledLocator = `td[id*='_DataGrid_Row_${rowIndex}_tags'] li span span`
    const search = value == '' ? `${tag}` : `${tag}:${value}`
    const targetedTagLocator = this.DataTable_Documents.table
      .locator(assembledLocator)
      .locator(`text="${search}"`)
    if ((await targetedTagLocator.count()) == 0) {
      throw new Error(`Error - tag to remove: ${search} is not attached to claim: ${rowIndex}`)
    }
    const tagRemoveButton = targetedTagLocator.locator('..').locator('button[aria-label="close"]')
    await tagRemoveButton.click()
    await this.page.waitForTimeout(1000)
  }

  async AddTagByIndex(rowIndex: string, key: string, value: string = '', color: string = '') {
    const addTagsDialog = await this.OpenAddTagsByIndex(rowIndex)
    await addTagsDialog.SetKeyValue(key)
    if (value != '') {
      await addTagsDialog.SetValueValue(value)
    }
    if (color != '') {
      await addTagsDialog.SetColor(color)
    }
    await addTagsDialog.Button_AddAndClose.Click()
    await this.page.waitForTimeout(1000)
  }

  async VerifyTableSettingColumns() {
    const tableSettingsDialog = await this.DataTable_Documents.OpenTableSettings()
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Documents_File)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Documents_Description)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Documents_FileName)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Documents_Visibility)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Documents_Exports)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Documents_Dates)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Documents_Meta)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Documents_Tags)
    await tableSettingsDialog.Close()
  }
}
