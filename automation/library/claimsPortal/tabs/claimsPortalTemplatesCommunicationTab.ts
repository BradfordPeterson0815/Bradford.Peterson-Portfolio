import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import {
  CommunicationTemplate_DataGrid_ActionMenuItems,
  DataGrid_Column_Type,
  DataGrid_DateSearchOption,
  TemplatesCommunicationTabStrings,
} from '../claimsPortalConstants.js'
import { ClaimsPortalDataGrid } from '../claimsPortalDataGrid.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'

export class ClaimsPortalTemplatesCommunicationTab extends ClaimsPortalBasePage {
  readonly Title: Element
  readonly DataGrid: ClaimsPortalDataGrid
  readonly parent: Locator
  readonly header: Locator
  readonly body: Locator
  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.URL = `${global.baseUrl}templates/communication`
    this.parent = this.page.locator('div[data-slot="card"]')
    this.header = this.parent.locator('div[data-slot="card-header"]')
    this.body = this.parent.locator('div[data-slot="card-content"]')
    this.Title = new Element(
      global.page,
      this.header.locator('h3[data-slot="card-title"]'),
      TemplatesCommunicationTabStrings.Title
    )
    this.DataGrid = new ClaimsPortalDataGrid(global, this.body)
  }

  async SelectActionMenuItem(
    rowIndex: number,
    actionMenuItem: CommunicationTemplate_DataGrid_ActionMenuItems
  ) {
    await this.DataGrid.OpenActionMenu(rowIndex)
    await this.DataGrid.SelectActionMenuItem(actionMenuItem)
  }

  async SetTextSearch(
    searchTerm: string,
    targetColumn: DataGrid_Column_Type,
    closeAfterSet = false
  ) {
    if (this.IsValidColumn(targetColumn) && this.IsTextColumn(targetColumn)) {
      await this.DataGrid.SetTextSearch(searchTerm, targetColumn, closeAfterSet)
    }
  }

  async ClearTextSearch(targetColumn: DataGrid_Column_Type, closeAfterClear = false) {
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

  async HideColumn(actionColumn: DataGrid_Column_Type, targetColumn: DataGrid_Column_Type) {
    if (this.IsValidColumn(actionColumn) && this.IsValidColumn(targetColumn)) {
      // if we are here - we can perform this action
      // Select the action column settings button
      // Select the Columns menu item
      // Set the target column menu item IF it is not already unchecked
    }
  }

  IsValidColumn(targetColumn: DataGrid_Column_Type, throwErrorIfFalse = true) {
    switch (targetColumn) {
      case DataGrid_Column_Type.Templates_Name:
      case DataGrid_Column_Type.Templates_Created:
      case DataGrid_Column_Type.Templates_LastUpdated:
        return true
      default:
        if (throwErrorIfFalse) {
          throw new Error(
            `Passed target column: ${targetColumn} is not a Communication Template column`
          )
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
            `Passed target column: ${targetColumn} is not a Text based Communication Template column`
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
            `Passed target column: ${targetColumn} is not a Date based Communication Template column`
          )
        }
        return false
    }
  }
}
