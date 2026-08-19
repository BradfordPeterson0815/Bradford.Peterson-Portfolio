import { expect } from '@playwright/test'
import { Element } from '../../shared/element.js'
import {
  ContactRoles,
  ContactRolesTuples,
  Contacts_DataTable_ActionMenuItems,
  ContactsTabStrings,
  DataTable_ColumnName_Index,
  DataTable_Columns_Type,
  Filter_Radio_Boolean,
  Filter_Radio_DataSource,
} from '../claimsPortalConstants.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ConcatenateFilterTerms, LookupDataColumn } from '../claimsPortalHelper.js'
import { ClaimsPortalJob } from '../claimsPortalJob.js'
import { ClaimsPortalUpdateCarrierDialog } from '../dialogs/claimsPortalUpdateCarrierDialog.js'
import { ClaimsPortalCreateContactDrawer } from '../drawers/claimsPortalCreateContactDrawer.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'

export class ClaimsPortalJobContactsTab extends ClaimsPortalBasePage {
  readonly job: ClaimsPortalJob
  readonly URL: string
  readonly Title_Contacts: Element
  readonly Title_RemovedContacts: Element
  readonly Button_CreateContact: Element
  readonly Button_AddCarrier: Element
  readonly Button_UpdateCarrier: Element
  readonly DataTable_Contacts: ClaimsPortalDataTable
  readonly DataTable_RemovedContacts: ClaimsPortalDataTable

  constructor(global: ClaimsPortalGlobal, job: ClaimsPortalJob, jobPageURL: string) {
    super(global)
    this.job = job
    this.URL = `${jobPageURL}/contacts`
    this.Title_Contacts = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${ContactsTabStrings.Title_Contacts}`, exact: true }),
      ContactsTabStrings.Title_Contacts
    )
    this.Title_RemovedContacts = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${ContactsTabStrings.Title_RemovedContacts}` }),
      ContactsTabStrings.Title_RemovedContacts
    )
    this.Button_CreateContact = new Element(
      global.page,
      this.page.getByRole('button', { name: `${ContactsTabStrings.Button_CreateContact}` }),
      ContactsTabStrings.Button_CreateContact
    )
    this.Button_AddCarrier = new Element(
      global.page,
      this.page.getByRole('button', { name: `${ContactsTabStrings.Button_AddCarrier}` }),
      ContactsTabStrings.Button_AddCarrier
    )
    this.Button_UpdateCarrier = new Element(
      global.page,
      this.page.getByRole('button', { name: `${ContactsTabStrings.Button_UpdateCarrier}` }),
      ContactsTabStrings.Button_UpdateCarrier
    )
    this.DataTable_Contacts = new ClaimsPortalDataTable(
      global,
      `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]`,
      1,
      ContactsTabStrings.ActionMenu,
      ContactsTabStrings.ActionMenuAria
    )
    this.DataTable_RemovedContacts = new ClaimsPortalDataTable(
      global,
      `#root div:nth-child(2 of div[id^="card"]) > div[id$="_content"]`,
      1,
      ContactsTabStrings.ActionMenu,
      ContactsTabStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_Contacts.WaitForRowsToLoad()
    await this.DataTable_RemovedContacts.WaitForRowsToLoad()
  }

  async SetTableFilter_Check_ContactRoles(
    table: ClaimsPortalDataTable,
    roleCheckedValues: number,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await table.AddTableFilter(
      DataTable_Columns_Type.Contacts_Roles,
      isEditMode
    )
    const filterTerms = []
    for (const roleKey in ContactRolesTuples) {
      const roleTuple = ContactRolesTuples[
        roleKey as keyof typeof ContactRolesTuples
      ] as ContactRoles[]
      if (roleCheckedValues & roleTuple[0]) {
        filterTerms.push(roleTuple[1])
        await tableFilterDialog.SetCheckFilter(roleTuple[1].toString())
      }
    }
    const concatenatedTerms = ConcatenateFilterTerms(filterTerms)
    const pinnedFilter = `${LookupDataColumn(
      DataTable_Columns_Type.Contacts_Roles,
      DataTable_ColumnName_Index.Column
    )} includes ${concatenatedTerms}`
    if (!skipClose) {
      await tableFilterDialog.Close()
    }
    return { pinnedFilter, tableFilterDialog }
  }

  async SetTableFilter_Selection(
    table: ClaimsPortalDataTable,
    selection: string,
    column: DataTable_Columns_Type,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await table.AddTableFilter(column, isEditMode)
    await tableFilterDialog.SetSelectionFilter(selection, column)
    if (!skipClose) {
      await tableFilterDialog.Close()
    }
    const pinnedFilter = `${LookupDataColumn(
      column,
      DataTable_ColumnName_Index.Column
    )} equals "${selection}"`
    return { pinnedFilter, tableFilterDialog }
  }

  async SetTableFilter_Radio_DataSource(
    table: ClaimsPortalDataTable,
    dataSource: Filter_Radio_DataSource,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await table.AddTableFilter(
      DataTable_Columns_Type.Contacts_Data_Source,
      isEditMode
    )
    await tableFilterDialog.SetRadioFilter(dataSource)
    const pinnedFilter = `${LookupDataColumn(
      DataTable_Columns_Type.Contacts_Data_Source,
      DataTable_ColumnName_Index.Column
    )} includes "${dataSource}"`
    if (!skipClose) {
      await tableFilterDialog.Close()
    }
    return { pinnedFilter, tableFilterDialog }
  }

  async SetTableFilter_Radio_Boolean(
    table: ClaimsPortalDataTable,
    trueOrFalse: Filter_Radio_Boolean,
    column: DataTable_Columns_Type,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await table.AddTableFilter(column, isEditMode)
    await tableFilterDialog.SetRadioFilter(trueOrFalse)
    let pinnedFilter = ''
    switch (column) {
      case DataTable_Columns_Type.Contacts_Inactive:
        pinnedFilter = `${LookupDataColumn(
          column,
          DataTable_ColumnName_Index.Column
        )} is "${trueOrFalse.toLowerCase()}"`
        break
      default:
        throw new Error(`Boolean filter has not been defined for column: ${column}`)
    }

    if (!skipClose) {
      await tableFilterDialog.Close()
    }
    return { pinnedFilter, tableFilterDialog }
  }

  async VerifyTextDataByColumnName(
    table: ClaimsPortalDataTable,
    rowIndex: string,
    columnType: DataTable_Columns_Type,
    expectedText: string
  ) {
    const value = await table.FetchRowTextDataByColumnName(rowIndex, columnType)
    expect(value).toContain(expectedText)
  }

  async SelectActionMenuItem(
    table: ClaimsPortalDataTable,
    rowIndex: string,
    actionMenuItem: Contacts_DataTable_ActionMenuItems
  ) {
    await table.OpenActionMenu(rowIndex)
    await table.SelectActionMenuItem(actionMenuItem)
  }

  async IsActionMenuItemVisible(
    table: ClaimsPortalDataTable,
    rowIndex: string,
    actionMenuItem: Contacts_DataTable_ActionMenuItems
  ) {
    await table.OpenActionMenu(rowIndex)
    await this.page.waitForTimeout(1000)
    const visibility = await table.IsActionMenuItemVisible(actionMenuItem)
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async OpenCreateContactDrawer(isEditMode = false) {
    await this.Button_CreateContact.Click()
    return new ClaimsPortalCreateContactDrawer(this.global, isEditMode)
  }

  async OpenUpdateCarrier(): Promise<ClaimsPortalUpdateCarrierDialog> {
    const isAddCarrierVisible = (await this.Button_AddCarrier.locator.count()) > 0
    if (isAddCarrierVisible) {
      await this.Button_AddCarrier.Click()
    } else {
      await this.Button_UpdateCarrier.Click()
    }
    const updateCarrierDialog = new ClaimsPortalUpdateCarrierDialog(this.global)
    await expect(updateCarrierDialog.Title.locator).toBeAttached()
    return updateCarrierDialog
  }

  async VerifyContactsTableSettingColumns() {
    const tableSettingsDialog = await this.DataTable_Contacts.OpenTableSettings()
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Contacts_Assignee)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Contacts_Name)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Contacts_Roles)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Contacts_Preferred_Contact)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Contacts_Data_Source)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Contacts_Description)
    await tableSettingsDialog.Close()
  }

  async VerifyRemovedContactsTableSettingColumns() {
    const tableSettingsDialog = await this.DataTable_RemovedContacts.OpenTableSettings()
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Contacts_Assignee)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Contacts_Name)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Contacts_Roles)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Contacts_Preferred_Contact)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Contacts_Data_Source)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Contacts_Description)
    await tableSettingsDialog.Close()
  }
}
