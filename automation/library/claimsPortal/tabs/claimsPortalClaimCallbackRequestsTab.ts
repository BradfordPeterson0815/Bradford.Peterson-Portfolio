import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalClaim } from '../claimsPortalClaim.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'
import { Element } from '../../shared/element.js'
import {
  CallbackRequestsTabStrings,
  CallbackStatusSelectionOptions,
  Callbacks_DataTable_ActionMenuItems,
  DataTable_Columns_Type,
} from '../claimsPortalConstants.js'
import { ClaimsPortalUpdateCallbackStatusDrawer } from '../drawers/claimsPortalUpdateCallbackStatusDrawer.js'

export class ClaimsPortalClaimCallbackRequestsTab extends ClaimsPortalBasePage {
  readonly claim: ClaimsPortalClaim
  readonly URL: string
  readonly Title_Callbacks: Element
  readonly DataTable_Callbacks: ClaimsPortalDataTable
  constructor(global: ClaimsPortalGlobal, claim: ClaimsPortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/callbacks`

    this.Title_Callbacks = new Element(
      global.page,
      this.page.getByRole('heading', {
        name: `${CallbackRequestsTabStrings.Title_Callbacks}`,
        exact: true,
      }),
      CallbackRequestsTabStrings.Title_Callbacks
    )
    this.DataTable_Callbacks = new ClaimsPortalDataTable(
      global,
      `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]`,
      1,
      CallbackRequestsTabStrings.ActionMenu,
      CallbackRequestsTabStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_Callbacks.WaitForRowsToLoad()
  }

  async SelectActionMenuItem(
    table: ClaimsPortalDataTable,
    rowIndex: string,
    actionMenuItem: Callbacks_DataTable_ActionMenuItems
  ) {
    await table.OpenActionMenu(rowIndex)
    await table.SelectActionMenuItem(actionMenuItem)
  }

  async IsActionMenuItemVisible(
    table: ClaimsPortalDataTable,
    rowIndex: string,
    actionMenuItem: Callbacks_DataTable_ActionMenuItems
  ) {
    await table.OpenActionMenu(rowIndex)
    await this.page.waitForTimeout(1000)
    const visibility = await table.IsActionMenuItemVisible(actionMenuItem)
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async OpenUpdateCallbackStatusDrawer(rowIndex: number | string) {
    await this.SelectActionMenuItem(
      this.DataTable_Callbacks,
      rowIndex.toString(),
      Callbacks_DataTable_ActionMenuItems.ChangeCallbackStatus
    )
    return new ClaimsPortalUpdateCallbackStatusDrawer(this.global)
  }

  async UpdateCallbackStatus(
    rowIndex: number | string,
    statusSelection: CallbackStatusSelectionOptions
  ) {
    const drawer = await this.OpenUpdateCallbackStatusDrawer(rowIndex)
    await drawer.SetStatusSelection(statusSelection)
    await drawer.Button_Submit.Click()
    await this.page.waitForTimeout(4000)
  }

  async VerifyTableSettingColumns() {
    const tableSettingsDialog = await this.DataTable_Callbacks.OpenTableSettings()
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Callbacks_Status)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Callbacks_For_Role)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Callbacks_Notes)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Callbacks_Name)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Callbacks_Contact_Method)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Callbacks_Preferred_Time)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Callbacks_Date_Requested)
    await tableSettingsDialog.Close()
  }
}
