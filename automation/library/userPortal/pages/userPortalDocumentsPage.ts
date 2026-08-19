import { expect } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { UserPortalUpdateDocumentInformationDrawer } from '../drawers/userPortalUpdateDocumentInformationDrawer.js'
import { DataTable_Columns_Type, DocumentsPageStrings } from '../userPortalConstants.js'
import { UserPortalDataTable } from '../userPortalDataTable.js'
import { UserPortalGlobal } from '../userPortalGlobal.js'

export class UserPortalDocumentsPage {
  readonly Title: Element
  readonly Link_UploadDocuments: Element
  readonly DataTable_Documents: UserPortalDataTable
  readonly Label_Empty_Title: Element
  readonly Label_Empty_Description: Element
  readonly Link_Empty_UploadDocuments: Element
  readonly global: UserPortalGlobal

  constructor(global: UserPortalGlobal) {
    this.global = global
    this.Title = new Element(
      global.page,
      global.page
        .locator('#entity-documents-step')
        .locator('> div')
        .nth(0)
        .getByRole('heading', { name: `${DocumentsPageStrings.Title}`, exact: true }),
      DocumentsPageStrings.Title
    )

    this.Link_UploadDocuments = new Element(
      global.page,
      global.page
        .locator('#entity-documents-step')
        .locator('> div')
        .nth(0)
        .getByRole('link', { name: `${DocumentsPageStrings.Link_UploadDocuments}` }),
      DocumentsPageStrings.Link_UploadDocuments
    )

    this.Label_Empty_Title = new Element(
      global.page,
      global.page
        .locator('#entity-documents-step')
        .locator('> div')
        .nth(1)
        .getByRole('heading', { name: `${DocumentsPageStrings.Label_Empty_Title}`, exact: true }),
      DocumentsPageStrings.Label_Empty_Title
    )

    this.Label_Empty_Description = new Element(
      global.page,
      global.page.locator('#entity-documents-step').locator('> div').nth(1).locator('p'),
      DocumentsPageStrings.Label_Empty_Description
    )

    this.Link_Empty_UploadDocuments = new Element(
      global.page,
      global.page
        .locator('#entity-documents-step')
        .locator('> div')
        .nth(1)
        .getByRole('link', { name: `${DocumentsPageStrings.Link_UploadDocuments}` }),
      DocumentsPageStrings.Link_UploadDocuments
    )

    this.DataTable_Documents = new UserPortalDataTable(global, `#root div[id$="_content"]`, 1)
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async WaitForLoad() {
    await this.global.page.waitForLoadState()
    await this.Title.locator.waitFor({ state: 'visible' })
  }

  async IsDocumentPageEmpty() {
    const count = await this.Label_Empty_Title.locator.count()
    return count > 0
  }

  async OpenDocumentLinkInNewTabVerifyAndClose(rowIndex: string, downloading = false) {
    const expectedTitle = await this.DataTable_Documents.FetchRowTextDataByColumnName(
      rowIndex,
      DataTable_Columns_Type.Documents_FileName
    )
    // currently always downloading so override headless exception
    downloading = false
    if (!downloading) {
      const pagePromise = this.global.context.waitForEvent('page')
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
        this.global.page.waitForEvent('download'), // wait for download to start
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
    await this.global.page.waitForTimeout(1000)
    const versionRowIndex = await this.DataTable_Documents.FetchRowIndexFromRowPosition(version)
    await this.global.page.waitForTimeout(1000)
    const pagePromise = this.global.context.waitForEvent('page')
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
        this.global.page.waitForEvent('download'), // wait for download to start
        await this.DataTable_Documents.ClickLinkInDataCell(
          versionRowIndex,
          DataTable_Columns_Type.Documents_File
        ),
      ])
      const endsWithPdf = download.suggestedFilename().endsWith('.pdf')
      expect(endsWithPdf).toBe(true)
    }
  }

  async OpenUpdateDocumentInformationDrawer(rowIndex: string) {
    await this.DataTable_Documents.ClickButtonInDataCell(
      rowIndex,
      DataTable_Columns_Type.Documents_Download
    )
    return new UserPortalUpdateDocumentInformationDrawer(this.global)
  }
}
