import { Locator, expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import {
  AlertStrings,
  ClaimFilterSelectionOptions_Carrier,
  DataGrid_Column_Type,
  DataGrid_DateSearchOption,
  DocumentTemplate_DataGrid_ActionMenuItems,
  TemplatesDocumentTabStrings,
} from '../claimsPortalConstants.js'
import { ClaimsPortalDataGrid } from '../claimsPortalDataGrid.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalCreateDocumentTemplateDrawer } from '../drawers/claimsPortalCreateDocumentTemplateDrawer.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalDeleteDatagridItemAlert } from '../alerts/claimsPortalDeleteDatagridItemAlert.js'
import { ClaimsPortalUpdateDocumentTemplateDrawer } from '../drawers/claimsPortalUpdateDocumentTemplateDrawer.js'
import { ClaimsPortalDataGridMetadataPopup } from '../popups/claimsPortalDataGridMetadataPopup.js'

export class ClaimsPortalTemplatesDocumentTab extends ClaimsPortalBasePage {
  readonly Title: Element
  readonly Button_CreateDocumentTemplate: Element
  readonly DataGrid: ClaimsPortalDataGrid
  readonly parent: Locator
  readonly header: Locator
  readonly body: Locator
  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.URL = `${global.baseUrl}templates/document`
    this.parent = this.page.locator('div[data-slot="card"]')
    this.header = this.parent.locator('div[data-slot="card-header"]')
    this.body = this.parent.locator('div[data-slot="card-content"]')
    this.Title = new Element(
      global.page,
      this.header.locator('h3[data-slot="card-title"]'),
      TemplatesDocumentTabStrings.Title
    )
    this.Button_CreateDocumentTemplate = new Element(
      global.page,
      this.header.getByRole('button', {
        name: TemplatesDocumentTabStrings.Button_CreateDocumentTemplate,
      }),
      TemplatesDocumentTabStrings.Button_CreateDocumentTemplate
    )
    this.DataGrid = new ClaimsPortalDataGrid(global, this.body)
  }

  async OpenCreateDocumentTemplate() {
    await this.Button_CreateDocumentTemplate.Click()
    const createDocumentTemplateDrawer = new ClaimsPortalCreateDocumentTemplateDrawer(this.global)
    await expect(createDocumentTemplateDrawer.Title.locator).toBeAttached()
    return createDocumentTemplateDrawer
  }

  async OpenUpdateDocumentTemplate(rowIndex: number) {
    await this.SelectActionMenuItem(
      rowIndex,
      DocumentTemplate_DataGrid_ActionMenuItems.EditTemplate
    )
    const updateDocumentTemplateDrawer = new ClaimsPortalUpdateDocumentTemplateDrawer(this.global)
    return updateDocumentTemplateDrawer
  }

  async SelectActionMenuItem(
    rowIndex: number,
    actionMenuItem: DocumentTemplate_DataGrid_ActionMenuItems
  ) {
    await this.DataGrid.OpenActionMenu(rowIndex)
    await this.DataGrid.SelectActionMenuItem(actionMenuItem)
  }

  async SetTextSearch(
    searchTerm: string,
    targetColumn: DataGrid_Column_Type,
    closeAfterSet: boolean = false
  ) {
    if (this.IsValidColumn(targetColumn) && this.IsTextColumn(targetColumn)) {
      await this.DataGrid.SetTextSearch(searchTerm, targetColumn, closeAfterSet)
    }
  }

  async ClearTextSearch(targetColumn: DataGrid_Column_Type, closeAfterClear: false) {
    if (this.IsValidColumn(targetColumn) && this.IsTextColumn(targetColumn)) {
      await this.DataGrid.ClearTextSearch(targetColumn, closeAfterClear)
    }
  }

  async SetDateSearch(
    searchDate: Date,
    dateSearchOption: DataGrid_DateSearchOption | null,
    targetColumn: DataGrid_Column_Type
  ) {
    if (this.IsValidColumn(targetColumn) && this.IsDateColumn(targetColumn)) {
      await this.DataGrid.SetDateSearch(searchDate, dateSearchOption, targetColumn)
    }
  }

  async ClearDateSearch(targetColumn: DataGrid_Column_Type, closeAfterClear: false) {
    if (this.IsValidColumn(targetColumn) && this.IsDateColumn(targetColumn)) {
      await this.DataGrid.ClearDateSearch(targetColumn, closeAfterClear)
    }
  }

  async SetListSearch(
    listItem: string,
    targetColumn: DataGrid_Column_Type,
    filterText: string = '',
    closeAfterSet: boolean = true
  ) {
    if (this.IsValidColumn(targetColumn) && this.IsListColumn(targetColumn)) {
      await this.DataGrid.SetListSearch(listItem, targetColumn, filterText, closeAfterSet)
    }
  }

  async ClearListSearch(targetColumn: DataGrid_Column_Type, closeAfterClear: boolean) {
    if (this.IsValidColumn(targetColumn) && this.IsListColumn(targetColumn)) {
      await this.DataGrid.ClearListSearch(targetColumn, closeAfterClear)
    }
  }

  async HideColumn(
    targetColumn: DataGrid_Column_Type,
    columnToHide: DataGrid_Column_Type,
    closeAfterHide: boolean
  ) {
    if (this.IsValidColumn(targetColumn) && this.IsSettingsColumn(targetColumn)) {
      await this.DataGrid.HideColumn(targetColumn, columnToHide, closeAfterHide)
    }
  }

  async ShowColumn(targetColumn: DataGrid_Column_Type, columnToHide: DataGrid_Column_Type) {
    if (this.IsValidColumn(targetColumn) && this.IsSettingsColumn(targetColumn)) {
      await this.DataGrid.ShowColumn(targetColumn, columnToHide)
    }
  }

  async VerifyDocumentDownload(rowIndex: number, expectedTitle: string) {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'), // wait for download to start
      await this.DataGrid.ClickLinkInDataCell(rowIndex, DataGrid_Column_Type.Templates_Document),
    ])
    const endsWithDocx = download.suggestedFilename().endsWith('.docx')
    expect(endsWithDocx).toBe(true)

    const startsWithTitle = download.suggestedFilename().startsWith(expectedTitle)
    expect(startsWithTitle).toBe(true)
  }

  async AddNewTemplate(
    templateName: string,
    carrier: ClaimFilterSelectionOptions_Carrier,
    documentFile: string
  ) {
    const createDocumentTemplateDrawer = await this.OpenCreateDocumentTemplate()
    await createDocumentTemplateDrawer.FillAndSubmit(templateName, carrier, documentFile)
  }

  async UpdateExistingTemplate(
    rowIndex: number,
    templateName: string,
    carrier: ClaimFilterSelectionOptions_Carrier,
    reasonForUpdate: string,
    documentFile: string | null = null
  ) {
    await this.SelectActionMenuItem(
      rowIndex,
      DocumentTemplate_DataGrid_ActionMenuItems.EditTemplate
    )
    const updateDocumentTemplateDrawer = new ClaimsPortalUpdateDocumentTemplateDrawer(this.global)
    await updateDocumentTemplateDrawer.FillAndSubmit(
      templateName,
      carrier,
      reasonForUpdate,
      documentFile
    )
  }

  async DeleteExistingTemplate(rowIndex: number) {
    await this.SelectActionMenuItem(
      rowIndex,
      DocumentTemplate_DataGrid_ActionMenuItems.DeleteTemplate
    )
    await this.HandleDeleteTemplateAlert()
    await this.page.waitForTimeout(1000)
  }

  async HandleDeleteTemplateAlert(cancelDelete = false) {
    const alert = new ClaimsPortalDeleteDatagridItemAlert(
      this.global,
      AlertStrings.DeleteTemplate_Title,
      AlertStrings.DeleteTemplate_Description
    )
    if (cancelDelete) {
      await alert.Button_Cancel.locator.click({ force: true })
    } else {
      await alert.Button_Delete.locator.click({ force: true })
    }
  }

  async DeleteOldTestTemplates(templatePrefix: string) {
    if (await this.DataGrid.IsEmpty()) {
      return
    }
    await this.DataGrid.SetTextSearch(templatePrefix, DataGrid_Column_Type.Templates_Name, true)
    let tableIsNotClear = false
    let rowCount = 0
    do {
      rowCount = await this.DataGrid.VisibleRowCount()
      tableIsNotClear = rowCount > 0
      if (tableIsNotClear) {
        await this.DeleteExistingTemplate(0)
      }
    } while (tableIsNotClear)
    await this.DataGrid.ClearTextSearch(DataGrid_Column_Type.Templates_Name, true)
  }

  async OpenLastUpdatedMetadata(rowIndex: number) {
    await this.DataGrid.ClickMetadataButtonInDataCell(
      rowIndex,
      DataGrid_Column_Type.Templates_LastUpdated
    )
    const metadataPopup = new ClaimsPortalDataGridMetadataPopup(this.global)
    return metadataPopup
  }

  IsValidColumn(targetColumn: DataGrid_Column_Type, throwErrorIfFalse = true) {
    switch (targetColumn) {
      case DataGrid_Column_Type.Templates_Name:
      case DataGrid_Column_Type.Templates_Carrier:
      case DataGrid_Column_Type.Templates_Created:
      case DataGrid_Column_Type.Templates_LastUpdated:
      case DataGrid_Column_Type.Templates_Document:
        return true
      default:
        if (throwErrorIfFalse) {
          throw new Error(`Passed target column: ${targetColumn} is not a Document Template column`)
        }
        return false
    }
  }

  IsSettingsColumn(targetColumn: DataGrid_Column_Type, throwErrorIfFalse = true) {
    switch (targetColumn) {
      case DataGrid_Column_Type.Templates_Document:
        if (throwErrorIfFalse) {
          throw new Error(`Document Template Column: ${targetColumn} cannot hide/show columns`)
        }
        return false
      default:
        return true
    }
  }

  IsTextColumn(targetColumn: DataGrid_Column_Type, throwErrorIfFalse = true) {
    switch (targetColumn) {
      case DataGrid_Column_Type.Templates_Name:
        return true
      default:
        if (throwErrorIfFalse) {
          throw new Error(
            `Passed target column: ${targetColumn} is not a Text based Document Template column`
          )
        }
        return false
    }
  }

  IsDateColumn(targetColumn: DataGrid_Column_Type, throwErrorIfFalse = true) {
    switch (targetColumn) {
      case DataGrid_Column_Type.Templates_Created:
      case DataGrid_Column_Type.Templates_LastUpdated:
        return true
      default:
        if (throwErrorIfFalse) {
          throw new Error(
            `Passed target column: ${targetColumn} is not a Date based Document Template column`
          )
        }
        return false
    }
  }

  IsListColumn(targetColumn: DataGrid_Column_Type, throwErrorIfFalse = true) {
    switch (targetColumn) {
      case DataGrid_Column_Type.Templates_Carrier:
        return true
      default:
        if (throwErrorIfFalse) {
          throw new Error(
            `Passed target column: ${targetColumn} is not a List based Document Template column`
          )
        }
        return false
    }
  }
}
