import { Element } from '../../shared/element.js'
import { ClaimsPortalAddPersonToPortalDrawer } from '../drawers/claimsPortalAddPersonToPortalDrawer.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalClaim } from '../claimsPortalClaim.js'
import {
  AlertStrings,
  ContactRoles,
  ContactRolesTuples,
  DataTable_ColumnName_Index,
  DataTable_Columns_Type,
  PortalAccessTabStrings,
  PortalAccess_DataTable_ActionMenuItems,
} from '../claimsPortalConstants.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ConcatenateFilterTerms, LookupDataColumn } from '../claimsPortalHelper.js'
import { ClaimsPortalDeleteAlert } from '../alerts/claimsPortalDeleteAlert.js'

export class ClaimsPortalClaimPortalAccessTab extends ClaimsPortalBasePage {
  readonly claim: ClaimsPortalClaim
  readonly URL: string
  readonly Title: Element
  readonly Button_AddPersonToPortal: Element
  readonly DataTable_PortalAccess: ClaimsPortalDataTable

  constructor(global: ClaimsPortalGlobal, claim: ClaimsPortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/portals`
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${PortalAccessTabStrings.Title}` }),
      PortalAccessTabStrings.Title
    )
    this.Button_AddPersonToPortal = new Element(
      global.page,
      this.page.getByRole('button', { name: `${PortalAccessTabStrings.Button_AddPersonToPortal}` }),
      PortalAccessTabStrings.Button_AddPersonToPortal
    )
    this.DataTable_PortalAccess = new ClaimsPortalDataTable(
      global,
      `#root div[id$="_content"]`,
      1,
      PortalAccessTabStrings.ActionMenu,
      PortalAccessTabStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_PortalAccess.WaitForRowsToLoad()
  }

  async SetTableFilter_Selection_Status(
    selection: string,
    column: DataTable_Columns_Type,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await this.DataTable_PortalAccess.AddTableFilter(column, isEditMode)
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
    roleCheckedValues: number,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await this.DataTable_PortalAccess.AddTableFilter(
      DataTable_Columns_Type.PortalAccess_ContactRoles,
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
      DataTable_Columns_Type.PortalAccess_ContactRoles,
      DataTable_ColumnName_Index.Column
    )} includes ${concatenatedTerms}`
    if (!skipClose) {
      await tableFilterDialog.Close()
    }
    return { pinnedFilter, tableFilterDialog }
  }

  async SelectActionMenuItem(
    rowIndex: string,
    actionMenuItem: PortalAccess_DataTable_ActionMenuItems
  ) {
    await this.DataTable_PortalAccess.OpenActionMenu(rowIndex)
    await this.DataTable_PortalAccess.SelectActionMenuItem(actionMenuItem)
  }

  async IsActionMenuItemVisible(
    rowIndex: string,
    actionMenuItem: PortalAccess_DataTable_ActionMenuItems
  ) {
    await this.DataTable_PortalAccess.OpenActionMenu(rowIndex)
    await this.page.waitForTimeout(1000)
    const visibility = await this.DataTable_PortalAccess.IsActionMenuItemVisible(actionMenuItem)
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async OpenAddPersonToPortalDrawer() {
    await this.Button_AddPersonToPortal.Click()
    return new ClaimsPortalAddPersonToPortalDrawer(this.global)
  }

  async DeactivePortal(rowIndex: string) {
    await this.SelectActionMenuItem(
      rowIndex,
      PortalAccess_DataTable_ActionMenuItems.DeactivatePortal
    )
    await this.HandleRemovePortalAccessAlert()
    await this.page.waitForTimeout(1000)
  }

  async HandleRemovePortalAccessAlert(cancelDeactivation = false) {
    const alert = new ClaimsPortalDeleteAlert(
      this.global,
      AlertStrings.RemovePortalAccess_Title,
      AlertStrings.RemovePortalAccess_Description
    )
    if (cancelDeactivation) {
      await alert.Button_Close.locator.click({ force: true })
    } else {
      await alert.Button_Deactivate.locator.click({ force: true })
    }
  }

  async VerifyTableSettingColumns() {
    const tableSettingsDialog = await this.DataTable_PortalAccess.OpenTableSettings()
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.PortalAccess_Contact)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.PortalAccess_ContactRoles)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.PortalAccess_Status)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.PortalAccess_CreatedDate)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.PortalAccess_LoginCount)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.PortalAccess_LatestLogin)
    await tableSettingsDialog.Close()
  }
}
