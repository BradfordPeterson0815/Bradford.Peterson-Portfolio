import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'
import { Element } from '../../shared/element.js'
import { expect } from '@playwright/test'
import {
  ContactBookPageStrings,
  ContactRoles,
  ContactRolesTuples,
  ContactsBook_DataTable_ActionMenuItems,
  DataTable_ColumnName_Index,
  DataTable_Columns_Type,
  Filter_Radio_Boolean,
  Filter_Radio_DataSource,
} from '../claimsPortalConstants.js'
import { ConcatenateFilterTerms, LookupContactBookCorn, LookupDataColumn } from '../claimsPortalHelper.js'
import { ClaimsPortalCreateContactDrawer } from '../drawers/claimsPortalCreateContactDrawer.js'

export class ClaimsPortalContactsBookPage extends ClaimsPortalBasePage {
  readonly Title: Element
  readonly Link_GlobalBooks: Element
  readonly Button_CreateContact: Element
  readonly DataTable_Contacts: ClaimsPortalDataTable
  readonly DataTable_RemovedContacts: ClaimsPortalDataTable

  constructor(global: ClaimsPortalGlobal, contactBookTarget: string) {
    super(global)
    const urlTarget = LookupContactBookCorn(contactBookTarget)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${contactBookTarget} Book` }),
      `${contactBookTarget} Book`
    )
    this.URL = `${global.baseUrl}${urlTarget}`
    this.Link_GlobalBooks = new Element(
      global.page,
      this.page.getByRole('button', { name: '← Global Books' })
    )
    this.Button_CreateContact = new Element(
      global.page,
      this.page.getByRole('button', { name: ContactBookPageStrings.Button_CreateContact }),
      ContactBookPageStrings.Button_CreateContact
    )
    this.DataTable_Contacts = new ClaimsPortalDataTable(
      global,
      `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]`,
      1,
      ContactBookPageStrings.ActionMenu,
      ContactBookPageStrings.ActionMenuAria
    )
    this.DataTable_RemovedContacts = new ClaimsPortalDataTable(
      global,
      `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]`,
      1,
      ContactBookPageStrings.ActionMenu,
      ContactBookPageStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_Contacts.WaitForRowsToLoad()
    await this.DataTable_RemovedContacts.WaitForRowsToLoad()
    this.Button_CreateContact.locator.waitFor({ state: 'visible' })
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

  async SetTableFilter_Check_ContactRoles(
    table: ClaimsPortalDataTable,
    roleCheckedValues: number,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await table.AddTableFilter(
      DataTable_Columns_Type.ContactsBook_Roles,
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
      DataTable_Columns_Type.ContactsBook_Roles,
      DataTable_ColumnName_Index.Column
    )} includes ${concatenatedTerms}`
    if (!skipClose) {
      await tableFilterDialog.Close()
    }
    return { pinnedFilter, tableFilterDialog }
  }

  async SetTableFilter_Radio_DataSource(
    table: ClaimsPortalDataTable,
    dataSource: Filter_Radio_DataSource,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await table.AddTableFilter(
      DataTable_Columns_Type.ContactsBook_Data_Source,
      isEditMode
    )
    await tableFilterDialog.SetRadioFilter(dataSource)
    const pinnedFilter = `${LookupDataColumn(
      DataTable_Columns_Type.ContactsBook_Data_Source,
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
      case DataTable_Columns_Type.ContactsBook_Picture:
        pinnedFilter = `${LookupDataColumn(column, DataTable_ColumnName_Index.Column)} is ${
          trueOrFalse == Filter_Radio_Boolean.True ? 'uploaded' : 'default (gravatar)'
        }`
        break
      case DataTable_Columns_Type.ContactsBook_Inactive:
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

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.page.goto(this.URL)
    } else {
      await this.leftNavBar.GoHome()
      await this.leftNavBar.Button_Admin.Click()
      await this.page.waitForLoadState()
      await this.leftNavBar.Button_Admin_Templates.Click()
      await this.page.waitForLoadState()
    }
    await this.page.waitForTimeout(2000)
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
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
    actionMenuItem: ContactsBook_DataTable_ActionMenuItems
  ) {
    await table.OpenActionMenu(rowIndex)
    await table.SelectActionMenuItem(actionMenuItem)
  }

  async IsActionMenuItemVisible(
    table: ClaimsPortalDataTable,
    rowIndex: string,
    actionMenuItem: ContactsBook_DataTable_ActionMenuItems
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
}
