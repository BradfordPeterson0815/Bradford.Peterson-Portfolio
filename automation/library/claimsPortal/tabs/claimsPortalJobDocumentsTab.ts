import { expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { ClaimsPortalDeleteAlert } from '../alerts/claimsPortalDeleteAlert.js'
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
import { ClaimsPortalJob } from '../claimsPortalJob.js'
import { ClaimsPortalUpdateDocumentInformationDrawer } from '../drawers/claimsPortalUpdateDocumentInformationDrawer.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'

export class ClaimsPortalJobDocumentsTab extends ClaimsPortalBasePage {
  readonly job: ClaimsPortalJob
  readonly URL: string
  readonly Title: Element
  readonly Link_UploadDocuments: Element
  readonly DataTable_Documents: ClaimsPortalDocumentDataTable

  constructor(global: ClaimsPortalGlobal, job: ClaimsPortalJob, jobPageURL: string) {
    super(global)
    this.job = job
    this.URL = `${jobPageURL}/documents`
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${DocumentsTabStrings.Title}` }),
      DocumentsTabStrings.Title
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
      await this.DataTable_Documents.ClickLinkInDataCell_ProvideName(versionRowIndex, 'download')
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
