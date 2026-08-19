import { Element } from '../../shared/element.js'
import { DelegatePortalClaim } from '../delegatePortalClaim.js'
import {
  CallbackStatusSelectionOptions,
  Callbacks_DataTable_ActionMenuItems,
  ClaimCallbacksTabStrings,
  DataTable_Columns_Type,
  Filter_Radio_CallbackStatus,
} from '../delegatePortalConstants.js'
import { DelegatePortalDataTable } from '../delegatePortalDataTable.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalUpdateCallbackStatusDrawer } from '../drawers/delegatePortalUpdateCallbackStatusDrawer.js'
import { DelegatePortalBasePage } from '../pages/delegatePortalBasePage.js'

export class DelegatePortalClaimCallbacksTab extends DelegatePortalBasePage {
  readonly claim: DelegatePortalClaim
  readonly URL: string
  readonly Title_Callbacks: Element
  readonly DataTable_Callbacks: DelegatePortalDataTable
  constructor(global: DelegatePortalGlobal, claim: DelegatePortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/callbacks`

    this.Title_Callbacks = new Element(
      global.page,
      this.page.getByRole('heading', {
        name: `${ClaimCallbacksTabStrings.Title_Callbacks}`,
        exact: true,
      }),
      ClaimCallbacksTabStrings.Title_Callbacks
    )
    this.DataTable_Callbacks = new DelegatePortalDataTable(
      global,
      `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]`,
      1,
      ClaimCallbacksTabStrings.ActionMenu,
      ClaimCallbacksTabStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_Callbacks.WaitForRowsToLoad()
  }

  async SelectActionMenuItem(
    table: DelegatePortalDataTable,
    rowIndex: string,
    actionMenuItem: Callbacks_DataTable_ActionMenuItems
  ) {
    await table.OpenActionMenu(rowIndex)
    await table.SelectActionMenuItem(actionMenuItem)
  }

  async IsActionMenuItemVisible(
    table: DelegatePortalDataTable,
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

  async OpenUpdateCallbackStatusDrawer(table: DelegatePortalDataTable, rowIndex: string) {
    await this.SelectActionMenuItem(
      table,
      rowIndex,
      Callbacks_DataTable_ActionMenuItems.ChangeCallbackStatus
    )
    return new DelegatePortalUpdateCallbackStatusDrawer(this.global)
  }

  async UpdateCallbackStatus(
    table: DelegatePortalDataTable,
    rowIndex: string,
    statusSelection: CallbackStatusSelectionOptions
  ) {
    const drawer = await this.OpenUpdateCallbackStatusDrawer(table, rowIndex)
    await drawer.SetStatusSelection(statusSelection)
    await drawer.Button_Submit.Click()
    await this.page.waitForTimeout(4000)
  }

  async FilterOnCallbackStatus(status: Filter_Radio_CallbackStatus) {
    await this.DataTable_Callbacks.SetTableFilter_Radio(
      DataTable_Columns_Type.Callbacks_Status,
      status.toString()
    )
  }
}
