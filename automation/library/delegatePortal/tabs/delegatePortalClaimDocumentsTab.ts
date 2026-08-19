import { expect } from 'playwright/test'
import { Element } from '../../shared/element.js'

import { DelegatePortalClaim } from '../delegatePortalClaim.js'
import {
  ClaimDocumentsTabStrings,
  DataTable_ColumnName_Index,
  DataTable_Columns_Type,
  Documents_DataTable_ActionMenuItems,
  Filter_Radio_Visibility,
} from '../delegatePortalConstants.js'
import { DelegatePortalDataTable } from '../delegatePortalDataTable.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { LookupDataColumn } from '../delegatePortalHelper.js'
import { DelegatePortalUpdateDocumentInformationDrawer } from '../drawers/delegatePortalUpdateDocumentInformationDrawer.js'
import { DelegatePortalBasePage } from '../pages/delegatePortalBasePage.js'
import { DelegatePortalPhotoReportTab } from './delegatePortalPhotoReportTab.js'
import { DelegatePortalGenerateDocumentTab } from './delegatePortalGenerateDocumentTab.js'

export class DelegatePortalClaimDocumentsTab extends DelegatePortalBasePage {
  readonly claim: DelegatePortalClaim
  readonly URL: string
  readonly Title: Element
  readonly Link_UploadDocuments: Element
  readonly Button_CreateDocuments: Element
  readonly MenuItem_CreatePhotoReport: Element
  readonly MenuItem_GenerateDraftDocument: Element
  readonly DataTable_Documents: DelegatePortalDataTable

  constructor(global: DelegatePortalGlobal, claim: DelegatePortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/documents`
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${ClaimDocumentsTabStrings.Title}` }),
      ClaimDocumentsTabStrings.Title
    )
    this.Button_CreateDocuments = new Element(
      global.page,
      this.page.getByRole('button', { name: ClaimDocumentsTabStrings.Button_CreateDocuments }),
      ClaimDocumentsTabStrings.Button_CreateDocuments
    )
    this.MenuItem_CreatePhotoReport = new Element(
      global.page,
      this.page.getByRole('menuitem', {
        name: ClaimDocumentsTabStrings.MenuItem_CreatePhotoReport,
      }),
      ClaimDocumentsTabStrings.MenuItem_CreatePhotoReport
    )
    this.MenuItem_GenerateDraftDocument = new Element(
      global.page,
      this.page.getByRole('menuitem', {
        name: ClaimDocumentsTabStrings.MenuItem_GenerateDraftDocument,
      }),
      ClaimDocumentsTabStrings.MenuItem_GenerateDraftDocument
    )
    this.Link_UploadDocuments = new Element(
      global.page,
      this.page.getByRole('link', { name: `${ClaimDocumentsTabStrings.Link_UploadDocuments}` }),
      ClaimDocumentsTabStrings.Link_UploadDocuments
    )
    this.DataTable_Documents = new DelegatePortalDataTable(
      global,
      `#root div[id$="_content"]`,
      2,
      ClaimDocumentsTabStrings.ActionMenu,
      ClaimDocumentsTabStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_Documents.WaitForRowsToLoad()
  }

  async OpenPhotoReportTab(claimNumber: string) {
    await this.Button_CreateDocuments.Click()
    await this.MenuItem_CreatePhotoReport.Click()
    const photoReportTab = new DelegatePortalPhotoReportTab(this.global, `claims/${claimNumber}`)
    return photoReportTab
  }

  async OpenGenerateDocumentTab(claimNumber: string) {
    await this.Button_CreateDocuments.Click()
    await this.MenuItem_GenerateDraftDocument.Click()
    const generateDocumentTab = new DelegatePortalGenerateDocumentTab(
      this.global,
      `claims/${claimNumber}`
    )
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
    return new DelegatePortalUpdateDocumentInformationDrawer(this.global)
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
}
