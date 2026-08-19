import { expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { DelegatePortalClaim } from '../delegatePortalClaim.js'
import {
  ClaimMediaTabStrings,
  DataTable_ColumnName_Index,
  DataTable_Columns_Type,
  Documents_DataTable_ActionMenuItems,
  Filter_Radio_Visibility,
} from '../delegatePortalConstants.js'
import { DelegatePortalDataTable } from '../delegatePortalDataTable.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { LookupDataColumn } from '../delegatePortalHelper.js'
import { DelegatePortalViewMediaDialog } from '../dialogs/delegatePortalViewMediaDialog.js'
import { DelegatePortalUpdateDocumentInformationDrawer } from '../drawers/delegatePortalUpdateDocumentInformationDrawer.js'
import { DelegatePortalBasePage } from '../pages/delegatePortalBasePage.js'

export class DelegatePortalClaimMediaTab extends DelegatePortalBasePage {
  readonly claim: DelegatePortalClaim
  readonly URL: string
  readonly Title: Element
  readonly Button_ViewMedia: Element
  readonly Button_DownloadAllImages: Element
  readonly Link_CreatePhotoReport: Element
  readonly Link_UploadMedia: Element
  readonly DataTable_Media: DelegatePortalDataTable

  constructor(global: DelegatePortalGlobal, claim: DelegatePortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/media`
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${ClaimMediaTabStrings.Title}` }),
      ClaimMediaTabStrings.Title
    )
    this.Button_ViewMedia = new Element(
      global.page,
      this.page.getByRole('button', { name: `${ClaimMediaTabStrings.Button_ViewMedia}` }),
      ClaimMediaTabStrings.Button_ViewMedia
    )
    this.Button_DownloadAllImages = new Element(
      global.page,
      this.page.getByRole('button', { name: `${ClaimMediaTabStrings.Button_DownloadAllImages}` }),
      ClaimMediaTabStrings.Button_DownloadAllImages
    )
    this.Link_CreatePhotoReport = new Element(
      global.page,
      this.page.getByRole('link', { name: `${ClaimMediaTabStrings.Link_CreatePhotoReport}` }),
      ClaimMediaTabStrings.Link_CreatePhotoReport
    )
    this.Link_UploadMedia = new Element(
      global.page,
      this.page.getByRole('link', { name: `${ClaimMediaTabStrings.Link_UploadMedia}` }),
      ClaimMediaTabStrings.Link_UploadMedia
    )
    this.DataTable_Media = new DelegatePortalDataTable(
      global,
      `#root div[id$="_content"]`,
      2,
      ClaimMediaTabStrings.ActionMenu,
      ClaimMediaTabStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_Media.WaitForRowsToLoad()
  }

  async SetTableFilter_Selection(
    selection: string,
    column: DataTable_Columns_Type,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await this.DataTable_Media.AddTableFilter(column, isEditMode)
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
    const tableFilterDialog = await this.DataTable_Media.AddTableFilter(
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
    const value = await this.DataTable_Media.FetchRowTextDataByColumnName(rowIndex, columnType)
    expect(value).toContain(expectedText)
  }

  async SelectActionMenuItem(
    rowIndex: string,
    actionMenuItem: Documents_DataTable_ActionMenuItems
  ) {
    await this.DataTable_Media.OpenActionMenu(rowIndex)
    await this.DataTable_Media.SelectActionMenuItem(actionMenuItem)
  }

  async IsActionMenuItemVisible(
    rowIndex: string,
    actionMenuItem: Documents_DataTable_ActionMenuItems
  ) {
    const table = this.DataTable_Media
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

  async OpenViewMediaDialog() {
    const viewMediaDialog = new DelegatePortalViewMediaDialog(this.global)
    await this.Button_ViewMedia.Click()
    return viewMediaDialog
  }

  async OpenDocumentLinkInNewTabVerifyAndClose(rowIndex: string) {
    const expectedTitle = await this.DataTable_Media.FetchRowTextDataByColumnName(
      rowIndex,
      DataTable_Columns_Type.Documents_FileName
    )
    const pagePromise = this.context.waitForEvent('page')
    await this.DataTable_Media.ClickLinkInDataCell(rowIndex, DataTable_Columns_Type.Documents_File)
    const pageNew = await pagePromise
    await pageNew.waitForURL(/.*/)
    await pageNew.bringToFront()
    await pageNew.waitForTimeout(1000)
    const url = pageNew.url()
    expect(decodeURI(url)).toContain(expectedTitle)
    await pageNew.close()
  }

  async OpenDownloadLinkInNewTabVerifyAndClose(rowIndex: string) {
    const expectedTitle = await this.DataTable_Media.FetchRowTextDataByColumnName(
      rowIndex,
      DataTable_Columns_Type.Documents_FileName
    )
    const pagePromise = this.context.waitForEvent('page')
    await this.DataTable_Media.ClickLinkInDataCell_ProvideName(rowIndex, 'download')
    const pageNew = await pagePromise
    await pageNew.waitForURL(/.*/)
    await pageNew.bringToFront()
    await pageNew.waitForTimeout(1000)
    const url = pageNew.url()
    expect(decodeURI(url)).toContain(expectedTitle)
    await pageNew.close()
  }

  async OpenVersionedDocumentLinkInNewTabVerifyAndClose(
    rowIndex: string,
    version: number,
    versionsShowing = false
  ) {
    if (!versionsShowing) {
      await this.DataTable_Media.ClickButtonInDataCell(
        rowIndex,
        DataTable_Columns_Type.Documents_File
      )
    }
    await this.page.waitForTimeout(1000)
    const versionRowIndex = await this.DataTable_Media.FetchRowIndexFromRowPosition(version)
    await this.page.waitForTimeout(1000)
    const pagePromise = this.context.waitForEvent('page')
    const expectedTitle = await this.DataTable_Media.FetchRowTextDataByColumnName(
      versionRowIndex,
      DataTable_Columns_Type.Documents_FileName
    )
    await this.DataTable_Media.ClickLinkInDataCell(
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
  }

  async OpenVersionedDownloadLinkInNewTabVerifyAndClose(
    rowIndex: string,
    version: number,
    versionsShowing = false
  ) {
    if (!versionsShowing) {
      await this.DataTable_Media.ClickButtonInDataCell(
        rowIndex,
        DataTable_Columns_Type.Documents_File
      )
    }
    await this.page.waitForTimeout(1000)
    const versionRowIndex = await this.DataTable_Media.FetchRowIndexFromRowPosition(version)
    await this.page.waitForTimeout(1000)
    const pagePromise = this.context.waitForEvent('page')
    const expectedTitle = await this.DataTable_Media.FetchRowTextDataByColumnName(
      versionRowIndex,
      DataTable_Columns_Type.Documents_FileName
    )
    await this.DataTable_Media.ClickLinkInDataCell_ProvideName(versionRowIndex, 'download')
    const pageNew = await pagePromise
    await pageNew.waitForURL(/.*/)
    await pageNew.bringToFront()
    await pageNew.waitForTimeout(1000)
    const url = pageNew.url()
    expect(decodeURI(url)).toContain(expectedTitle)
    await pageNew.close()
  }
}
