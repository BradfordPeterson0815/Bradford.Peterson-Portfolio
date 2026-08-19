import { Element } from '../../shared/element.js'
import { expect } from '@playwright/test'
import { DelegatePortalBasePage } from '../pages/delegatePortalBasePage.js'
import { DelegatePortalClaim } from '../delegatePortalClaim.js'
import { DelegatePortalDataTable } from '../delegatePortalDataTable.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import {
  ClaimContactsTabStrings,
  ContactRoles,
  ContactRolesTuples,
  Contacts_DataTable_ActionMenuItems,
  DataTable_ColumnName_Index,
  DataTable_Columns_Type,
  Filter_Radio_Boolean,
  Filter_Radio_DataSource,
} from '../delegatePortalConstants.js'
import { ConcatenateFilterTerms, LookupDataColumn } from '../delegatePortalHelper.js'
import { DelegatePortalCreateContactDrawer } from '../drawers/delegatePortalCreateContactDrawer.js'

export class DelegatePortalClaimContactsTab extends DelegatePortalBasePage {
  readonly claim: DelegatePortalClaim
  readonly URL: string
  readonly Title_Contacts: Element
  readonly Title_RemovedContacts: Element
  readonly Button_CreateContact: Element
  readonly DataTable_Contacts: DelegatePortalDataTable
  readonly DataTable_RemovedContacts: DelegatePortalDataTable

  constructor(global: DelegatePortalGlobal, claim: DelegatePortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/contacts`
    this.Title_Contacts = new Element(
      global.page,
      this.page.getByRole('heading', {
        name: `${ClaimContactsTabStrings.Title_Contacts}`,
        exact: true,
      }),
      ClaimContactsTabStrings.Title_Contacts
    )
    this.Title_RemovedContacts = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${ClaimContactsTabStrings.Title_RemovedContacts}` }),
      ClaimContactsTabStrings.Title_RemovedContacts
    )
    this.Button_CreateContact = new Element(
      global.page,
      this.page.getByRole('button', { name: ClaimContactsTabStrings.Button_CreateContact }),
      ClaimContactsTabStrings.Button_CreateContact
    )
    this.DataTable_Contacts = new DelegatePortalDataTable(
      global,
      `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]`,
      1,
      ClaimContactsTabStrings.ActionMenu,
      ClaimContactsTabStrings.ActionMenuAria
    )
    this.DataTable_RemovedContacts = new DelegatePortalDataTable(
      global,
      `#root div:nth-child(2 of div[id^="card"]) > div[id$="_content"]`,
      1,
      ClaimContactsTabStrings.ActionMenu,
      ClaimContactsTabStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_Contacts.WaitForRowsToLoad()
    await this.DataTable_RemovedContacts.WaitForRowsToLoad()
  }

  async SetTableFilter_Check_ContactRoles(
    table: DelegatePortalDataTable,
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
    table: DelegatePortalDataTable,
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
    table: DelegatePortalDataTable,
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
    table: DelegatePortalDataTable,
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
    table: DelegatePortalDataTable,
    rowIndex: string,
    columnType: DataTable_Columns_Type,
    expectedText: string
  ) {
    const value = await table.FetchRowTextDataByColumnName(rowIndex, columnType)
    expect(value).toContain(expectedText)
  }

  async SelectActionMenuItem(
    table: DelegatePortalDataTable,
    rowIndex: string,
    actionMenuItem: Contacts_DataTable_ActionMenuItems
  ) {
    await table.OpenActionMenu(rowIndex)
    await table.SelectActionMenuItem(actionMenuItem)
  }

  async IsActionMenuItemVisible(
    table: DelegatePortalDataTable,
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
    return new DelegatePortalCreateContactDrawer(this.global, isEditMode)
  }
}
