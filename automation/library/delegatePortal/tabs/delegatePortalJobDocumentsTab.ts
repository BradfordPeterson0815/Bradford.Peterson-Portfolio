import { expect } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DataTable_Columns_Type, JobDocumentsTabStrings } from '../delegatePortalConstants.js'
import { DelegatePortalDataTable } from '../delegatePortalDataTable.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalJob } from '../delegatePortalJob.js'
import { DelegatePortalUpdateDocumentInformationDrawer } from '../drawers/delegatePortalUpdateDocumentInformationDrawer.js'
import { DelegatePortalBasePage } from '../pages/delegatePortalBasePage.js'

export class DelegatePortalJobDocumentsTab extends DelegatePortalBasePage {
  readonly Title: Element
  readonly Link_CreatePhotoReport: Element
  readonly Link_UploadDocuments: Element
  readonly Link_Empty_UploadDocuments: Element
  readonly Label_Empty_Title: Element
  readonly Label_Empty_Description: Element
  readonly DataTable_Documents: DelegatePortalDataTable
  readonly job: DelegatePortalJob

  constructor(global: DelegatePortalGlobal, job: DelegatePortalJob) {
    super(global)
    this.job = job
    this.URL = `${global.baseUrl}jobs/${job.jobDetails.jobId}/documents`

    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: JobDocumentsTabStrings.Title, exact: true }),
      JobDocumentsTabStrings.Title
    )

    this.Link_CreatePhotoReport = new Element(
      global.page,
      this.page.getByRole('link', { name: JobDocumentsTabStrings.Link_CreatePhotoReport }),
      JobDocumentsTabStrings.Link_CreatePhotoReport
    )

    this.Link_UploadDocuments = new Element(
      global.page,
      this.page.getByRole('link', { name: JobDocumentsTabStrings.Link_UploadDocuments }).nth(0),
      JobDocumentsTabStrings.Link_UploadDocuments
    )

    this.Label_Empty_Title = new Element(
      global.page,
      this.page.getByRole('heading', {
        name: JobDocumentsTabStrings.Label_Empty_Title,
        exact: true,
      }),
      JobDocumentsTabStrings.Label_Empty_Title
    )

    this.Label_Empty_Description = new Element(
      global.page,
      this.page.locator('#root div[id$="_content"] > div > div > div > div > p'),
      JobDocumentsTabStrings.Label_Empty_Description
    )

    this.Link_Empty_UploadDocuments = new Element(
      global.page,
      this.page.getByRole('link', { name: JobDocumentsTabStrings.Link_UploadDocuments }).nth(0),
      JobDocumentsTabStrings.Link_UploadDocuments
    )

    this.DataTable_Documents = new DelegatePortalDataTable(global, `#root div[id$="_content"]`, 0)
  }

  async IsTabEmpty() {
    const count = await this.Label_Empty_Title.locator.count()
    return count > 0
  }

  async NavigateDirectlyToTab() {
    await this.NavigateDirectly(this.global.baseUrl)
    await this.WaitForLoad()
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

  async OpenUpdateDocumentInformationDrawer(rowIndex: string) {
    await this.DataTable_Documents.ClickButtonInDataCell(
      rowIndex,
      DataTable_Columns_Type.Documents_Download
    )
    return new DelegatePortalUpdateDocumentInformationDrawer(this.global)
  }
}
