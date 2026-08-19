import { expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { ClaimsPortalDeleteAlert } from '../alerts/claimsPortalDeleteAlert.js'
import { ClaimsPortalClaim } from '../claimsPortalClaim.js'
import {
  AlertStrings,
  DataTable_ColumnName_Index,
  DataTable_Columns_Type,
  Documents_DataTable_ActionMenuItems,
  Filter_Radio_Visibility,
  MediaTabStrings,
} from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { LookupDataColumn } from '../claimsPortalHelper.js'
import { ClaimsPortalMediaDataTable } from '../claimsPortalMediaDataTable.js'
import { ClaimsPortalViewMediaDialog } from '../dialogs/claimsPortalViewMediaDialog.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalAddTagsDialog } from '../dialogs/claimsPortalAddTagsDialog.js'
import { ClaimsPortalUpdateDocumentInformationDrawer } from '../drawers/claimsPortalUpdateDocumentInformationDrawer.js'

export class ClaimsPortalClaimMediaTab extends ClaimsPortalBasePage {
  readonly claim: ClaimsPortalClaim
  readonly URL: string
  readonly Title: Element
  readonly Button_ViewMedia: Element
  readonly Button_DownloadAllImages: Element
  readonly Link_CreatePhotoReport: Element
  readonly Link_UploadMedia: Element
  readonly DataTable_Media: ClaimsPortalMediaDataTable

  constructor(global: ClaimsPortalGlobal, claim: ClaimsPortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/media`
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${MediaTabStrings.Title}` }),
      MediaTabStrings.Title
    )
    this.Button_ViewMedia = new Element(
      global.page,
      this.page.getByRole('button', { name: `${MediaTabStrings.Button_ViewMedia}` }),
      MediaTabStrings.Button_ViewMedia
    )
    this.Button_DownloadAllImages = new Element(
      global.page,
      this.page.getByRole('button', { name: `${MediaTabStrings.Button_DownloadAllImages}` }),
      MediaTabStrings.Button_DownloadAllImages
    )
    this.Link_CreatePhotoReport = new Element(
      global.page,
      this.page.getByRole('link', { name: `${MediaTabStrings.Link_CreatePhotoReport}` }),
      MediaTabStrings.Link_CreatePhotoReport
    )
    this.Link_UploadMedia = new Element(
      global.page,
      this.page.getByRole('link', { name: `${MediaTabStrings.Link_UploadMedia}` }),
      MediaTabStrings.Link_UploadMedia
    )
    this.DataTable_Media = new ClaimsPortalMediaDataTable(
      global,
      `#root div[id$="_content"]`,
      2,
      MediaTabStrings.ActionMenu,
      MediaTabStrings.ActionMenuAria
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
    await this.page.waitForTimeout(1000)
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

  async OpenViewMediaDialog() {
    const viewMediaDialog = new ClaimsPortalViewMediaDialog(this.global)
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

  async OpenAddTagsByIndex(rowIndex: string): Promise<ClaimsPortalAddTagsDialog> {
    await this.SelectActionMenuItem(rowIndex, Documents_DataTable_ActionMenuItems.AddTags)
    const addTagsDialog = new ClaimsPortalAddTagsDialog(this.global)
    await expect(addTagsDialog.Title.locator).toBeAttached()
    return addTagsDialog
  }

  async TagCountByIndex(rowIndex: string) {
    const assembledLocator = `td[id*='_DataGrid_Row_${rowIndex}_tags'] li`
    const tagCount = await this.DataTable_Media.table.locator(assembledLocator).count()
    return tagCount
  }

  async TagIsAddedByIndex(rowIndex: string, tag: string) {
    return this.TagWithValueIsAddedByIndex(rowIndex, tag)
  }

  async TagWithValueIsAddedByIndex(rowIndex: string, tag: string, value: string = '') {
    const assembledLocator = `td[id*='_DataGrid_Row_${rowIndex}_tags'] li span span`
    const search = value == '' ? `${tag}` : `${tag}:${value}`
    const tagWithValueExists =
      (await this.DataTable_Media.table
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
    const targetedTagLocator = this.DataTable_Media.table
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
    const tableSettingsDialog = await this.DataTable_Media.OpenTableSettings()
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Documents_File)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Documents_Description)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Documents_FileName)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Documents_Visibility)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Documents_Exports)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Documents_Dates)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Documents_Meta)
    await tableSettingsDialog.Close()
  }
}
