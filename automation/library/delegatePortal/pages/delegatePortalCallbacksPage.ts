import { Element } from '../../shared/element.js'
import {
  CallbackStatusSelectionOptions,
  CallbacksPageStrings,
  Callbacks_DataTable_ActionMenuItems,
} from '../delegatePortalConstants.js'
import { DelegatePortalDataTable } from '../delegatePortalDataTable.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'

import { DelegatePortalUpdateCallbackStatusDrawer } from '../drawers/delegatePortalUpdateCallbackStatusDrawer.js'
import { DelegatePortalBasePage } from './delegatePortalBasePage.js'

export class DelegatePortalCallbacksPage extends DelegatePortalBasePage {
  readonly Title: Element
  readonly DataTable_Callbacks: DelegatePortalDataTable

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${CallbacksPageStrings.Title}` }),
      CallbacksPageStrings.Title
    )
    this.URL = `${global.baseUrl}callbacks`
    this.DataTable_Callbacks = new DelegatePortalDataTable(
      global,
      `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]`,
      1,
      CallbacksPageStrings.ActionMenu,
      CallbacksPageStrings.ActionMenuAria
    )
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.page.goto(this.URL)
      await this.page.waitForLoadState()
    } else {
      await this.leftNavBar.Button_Callbacks.Click()
      await this.page.waitForLoadState()
    }
    await this.page.waitForTimeout(2000)
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
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

  async OpenUpdateCallbackStatusDrawer(rowIndex: string) {
    await this.SelectActionMenuItem(
      rowIndex,
      Callbacks_DataTable_ActionMenuItems.ChangeCallbackStatus
    )
    return new DelegatePortalUpdateCallbackStatusDrawer(this.global)
  }

  async UpdateCallbackStatus(rowIndex: string, statusSelection: CallbackStatusSelectionOptions) {
    const drawer = await this.OpenUpdateCallbackStatusDrawer(rowIndex)
    await drawer.SetStatusSelection(statusSelection)
    await drawer.Button_Submit.Click()
    await this.page.waitForTimeout(5000)
  }
}
