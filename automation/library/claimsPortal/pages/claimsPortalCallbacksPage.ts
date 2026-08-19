import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'
import { Element } from '../../shared/element.js'
import {
  CallbacksPageStrings,
  Callbacks_DataTable_ActionMenuItems,
  CallbackStatusSelectionOptions,
  DataTable_Columns_Type,
} from '../claimsPortalConstants.js'
import { ClaimsPortalUpdateCallbackStatusDrawer } from '../drawers/claimsPortalUpdateCallbackStatusDrawer.js'

export class ClaimsPortalCallbacksPage extends ClaimsPortalBasePage {
  readonly Title: Element
  readonly Label_Table: Element
  readonly DataTable_Callbacks: ClaimsPortalDataTable

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: CallbacksPageStrings.Title, exact: true }),
      CallbacksPageStrings.Title
    )
    this.URL = `${global.baseUrl}callbacks`
    this.Label_Table = new Element(
      global.page,
      this.page.getByRole('heading', { name: CallbacksPageStrings.Label_Table, exact: true }),
      CallbacksPageStrings.Label_Table
    )
    this.DataTable_Callbacks = new ClaimsPortalDataTable(
      global,
      `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]`,
      1,
      CallbacksPageStrings.ActionMenu,
      CallbacksPageStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_Callbacks.table.waitFor({ state: 'visible' })
    await this.DataTable_Callbacks.WaitForRowsToLoad()
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.page.goto(this.URL)
      await this.page.waitForLoadState()
    } else {
      await this.leftNavBar.GoHome()
      await this.leftNavBar.Button_Callbacks.Click()
      await this.page.waitForLoadState()
    }
    await this.CustomLoad()
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async VerifyTableSettingColumns() {
    const tableSettingsDialog = await this.DataTable_Callbacks.OpenTableSettings()
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Callbacks_Status)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Callbacks_Entity_ID)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Callbacks_For_Role)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Callbacks_Notes)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Callbacks_Name)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Callbacks_Contact_Method)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Callbacks_Preferred_Time)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Callbacks_Date_Requested)
    await tableSettingsDialog.Close()
  }

  async SelectActionMenuItem(
    rowIndex: string,
    actionMenuItem: Callbacks_DataTable_ActionMenuItems
  ) {
    await this.DataTable_Callbacks.OpenActionMenu(rowIndex)
    await this.DataTable_Callbacks.SelectActionMenuItem(actionMenuItem)
  }

  async IsActionMenuItemVisible(
    rowIndex: string,
    actionMenuItem: Callbacks_DataTable_ActionMenuItems
  ) {
    await this.DataTable_Callbacks.OpenActionMenu(rowIndex)
    await this.page.waitForTimeout(1000)
    const visibility = await this.DataTable_Callbacks.IsActionMenuItemVisible(actionMenuItem)
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async OpenUpdateCallbackStatusDrawer(rowIndex: number) {
    await this.SelectActionMenuItem(
      rowIndex.toString(),
      Callbacks_DataTable_ActionMenuItems.ChangeCallbackStatus
    )
    return new ClaimsPortalUpdateCallbackStatusDrawer(this.global)
  }

  async UpdateCallbackStatus(rowIndex: number, statusSelection: CallbackStatusSelectionOptions) {
    const drawer = await this.OpenUpdateCallbackStatusDrawer(rowIndex)
    await drawer.SetStatusSelection(statusSelection)
    await drawer.Button_Submit.Click()
    await this.page.waitForTimeout(5000)
  }
}
