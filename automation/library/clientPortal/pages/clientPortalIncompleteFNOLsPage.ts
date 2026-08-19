import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { ClientPortalBasePage } from './clientPortalBasePage.js'
import { Element } from '../../shared/element.js'
import { IncompleteFNOLsPageStrings } from '../clientPortalConstants.js'
import { ClientPortalDataTable } from '../clientPortalDataTable.js'

export class ClientPortalIncompleteFNOLsPage extends ClientPortalBasePage {
  readonly Title: Element
  readonly DataTable_IncompleteFNOLs: ClientPortalDataTable

  constructor(global: ClientPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${IncompleteFNOLsPageStrings.Title}` }),
      IncompleteFNOLsPageStrings.Title
    )
    this.URL = `${global.baseUrl}incompleteFnols`
    this.DataTable_IncompleteFNOLs = new ClientPortalDataTable(
      global,
      '#admin_tabpanel_incompletefnols_body',
      1,
      IncompleteFNOLsPageStrings.ActionMenu,
      IncompleteFNOLsPageStrings.ActionMenuAria
    )
  }

  async NavigateDirectly() {
    await this.page.goto(this.URL)
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.NavigateDirectly()
    } else {
      await this.leftNavBar.GoHome()
      await this.leftNavBar.Button_IncompleteFNOLs.Click()
      await this.page.waitForLoadState()
    }
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }
}
