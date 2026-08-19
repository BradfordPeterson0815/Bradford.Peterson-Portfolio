import { Locator, expect } from '@playwright/test'
import { Element } from '../../shared/element.js'
import {
  AlertStrings,
  DataGrid_Column_Type,
  DataGrid_DateSearchOption,
  NoteTemplate_DataGrid_ActionMenuItems,
  TemplatesNoteTabStrings,
} from '../claimsPortalConstants.js'
import { ClaimsPortalDataGrid } from '../claimsPortalDataGrid.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalCreateNoteTemplateDrawer } from '../drawers/claimsPortalCreateNoteTemplateDrawer.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalDeleteDatagridItemAlert } from '../alerts/claimsPortalDeleteDatagridItemAlert.js'
import { ClaimsPortalUpdateNoteTemplateDrawer } from '../drawers/claimsPortalUpdateNoteTemplateDrawer.js'
import { ClaimsPortalDataGridMetadataPopup } from '../popups/claimsPortalDataGridMetadataPopup.js'

export class ClaimsPortalTemplatesNoteTab extends ClaimsPortalBasePage {
  readonly Title: Element
  readonly Button_CreateNoteTemplate: Element
  readonly DataGrid: ClaimsPortalDataGrid
  readonly parent: Locator
  readonly header: Locator
  readonly body: Locator
  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.URL = `${global.baseUrl}templates/note`
    this.parent = this.page.locator('div[data-slot="card"]')
    this.header = this.parent.locator('div[data-slot="card-header"]')
    this.body = this.parent.locator('div[data-slot="card-content"]')
    this.Title = new Element(
      global.page,
      this.header.locator('h3[data-slot="card-title"]'),
      TemplatesNoteTabStrings.Title
    )
    this.Button_CreateNoteTemplate = new Element(
      global.page,
      this.header.getByRole('button', {
        name: TemplatesNoteTabStrings.Button_CreateNoteTemplate,
      }),
      TemplatesNoteTabStrings.Button_CreateNoteTemplate
    )
    this.DataGrid = new ClaimsPortalDataGrid(global, this.body)
  }

  async OpenCreateNoteTemplateDrawer() {
    await this.Button_CreateNoteTemplate.Click()
    const createNoteTemplateDrawer = new ClaimsPortalCreateNoteTemplateDrawer(this.global)
    await expect(createNoteTemplateDrawer.Title.locator).toBeAttached()
    return createNoteTemplateDrawer
  }

  async OpenUpdateNoteTemplate(rowIndex: number) {
    await this.SelectActionMenuItem(rowIndex, NoteTemplate_DataGrid_ActionMenuItems.EditTemplate)
    const updateNoteTemplateDrawer = new ClaimsPortalUpdateNoteTemplateDrawer(this.global)
    return updateNoteTemplateDrawer
  }

  async SelectActionMenuItem(
    rowIndex: number,
    actionMenuItem: NoteTemplate_DataGrid_ActionMenuItems
  ) {
    await this.DataGrid.OpenActionMenu(rowIndex)
    await this.DataGrid.SelectActionMenuItem(actionMenuItem)
  }

  async SetTextSearch(
    searchTerm: string,
    targetColumn: DataGrid_Column_Type,
    closeAfterSet = true
  ) {
    if (this.IsValidColumn(targetColumn) && this.IsTextColumn(targetColumn)) {
      await this.DataGrid.SetTextSearch(searchTerm, targetColumn, closeAfterSet)
    }
  }

  async ClearTextSearch(targetColumn: DataGrid_Column_Type, closeAfterClear = true) {
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

  async HideColumn(
    targetColumn: DataGrid_Column_Type,
    columnToHide: DataGrid_Column_Type,
    closeAfterHide: boolean
  ) {
    if (this.IsValidColumn(targetColumn)) {
      await this.DataGrid.HideColumn(targetColumn, columnToHide, closeAfterHide)
    }
  }

  async ShowColumn(targetColumn: DataGrid_Column_Type, columnToHide: DataGrid_Column_Type) {
    if (this.IsValidColumn(targetColumn)) {
      await this.DataGrid.ShowColumn(targetColumn, columnToHide)
    }
  }

  async AddNewTemplate(templateName: string, templateText: string) {
    const createNoteTemplateDrawer = await this.OpenCreateNoteTemplateDrawer()
    await createNoteTemplateDrawer.FillAndSubmit(templateName, templateText)
  }

  async UpdateExistingTemplate(
    rowIndex: number,
    templateName: string,
    templateText: string,
    reasonForUpdate: string
  ) {
    await this.SelectActionMenuItem(rowIndex, NoteTemplate_DataGrid_ActionMenuItems.EditTemplate)
    const updateDocumentTemplateDrawer = new ClaimsPortalUpdateNoteTemplateDrawer(this.global)
    await updateDocumentTemplateDrawer.FillAndSubmit(templateName, templateText, reasonForUpdate)
  }

  async DeleteExistingTemplate(rowIndex: number) {
    await this.SelectActionMenuItem(rowIndex, NoteTemplate_DataGrid_ActionMenuItems.DeleteTemplate)
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
      case DataGrid_Column_Type.Templates_Created:
      case DataGrid_Column_Type.Templates_LastUpdated:
        return true
      default:
        if (throwErrorIfFalse) {
          throw new Error(`Passed target column: ${targetColumn} is not a Note Template column`)
        }
        return false
    }
  }

  IsTextColumn(targetColumn: DataGrid_Column_Type, throwErrorIfFalse = true) {
    switch (targetColumn) {
      case DataGrid_Column_Type.Templates_Name:
        return true
      default:
        if (throwErrorIfFalse) {
          throw new Error(
            `Passed target column: ${targetColumn} is not a Text based Note Template column`
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
            `Passed target column: ${targetColumn} is not a Date based Note Template column`
          )
        }
        return false
    }
  }
}
