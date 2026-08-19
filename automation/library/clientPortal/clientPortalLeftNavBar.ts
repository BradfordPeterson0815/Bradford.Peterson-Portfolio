import { LeftNavStrings } from './clientPortalConstants.js'
import { Element } from '../shared/element.js'
import { ClientPortalBase } from './pages/clientPortalBase.js'
import { ClientPortalGlobal } from './clientPortalGlobal.js'

export class ClientPortalLeftNavBar extends ClientPortalBase {
  readonly Title: Element
  readonly Button_Home: Element
  readonly Button_ServiceAreas: Element
  readonly Button_Vendors: Element
  readonly Button_Rules: Element
  readonly Button_IncompleteFNOLs: Element
  readonly Button_WeatherEvents: Element
  readonly Button_UserMenu: Element
  readonly Button_UserMenu_UIVersion: Element
  readonly Button_UserMenu_Logout: Element
  readonly Button_Collapse: Element
  readonly Button_Expand: Element

  constructor(global: ClientPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${LeftNavStrings.Title}` }),
      LeftNavStrings.Title
    )
    this.Button_Home = new Element(
      global.page,
      this.page.getByRole('button', { name: `${LeftNavStrings.Button_Home}` }).first(),
      LeftNavStrings.Button_Home
    )
    this.Button_ServiceAreas = new Element(
      global.page,
      this.page.locator('#navigation_serviceAreas'),
      LeftNavStrings.Button_ServiceAreas
    )
    this.Button_Vendors = new Element(
      global.page,
      this.page.locator('#navigation_vendors'),
      LeftNavStrings.Button_Vendors
    )
    this.Button_Rules = new Element(
      global.page,
      this.page.locator('#navigation_globalRules'),
      LeftNavStrings.Button_Rules
    )
    this.Button_IncompleteFNOLs = new Element(
      global.page,
      this.page.locator('#navigation_incompleteFnols'),
      LeftNavStrings.Button_IncompleteFNOLs
    )
    this.Button_WeatherEvents = new Element(
      global.page,
      this.page.locator('#navigation_weatherEvents'),
      LeftNavStrings.Button_WeatherEvents
    )
    this.Button_UserMenu = new Element(
      global.page,
      this.page.locator(`#navigation__bottom > button[aria-haspopup='menu']`),
      global.username
    )
    this.Button_UserMenu_UIVersion = new Element(
      global.page,
      this.page.locator(`div[data-test-id="navigation_userMenu_list"] button`).nth(0),
      LeftNavStrings.Button_UserMenu_UIVersion
    )
    this.Button_UserMenu_Logout = new Element(
      global.page,
      this.page.locator(`div[data-test-id="navigation_userMenu_list"] button`).nth(1),
      LeftNavStrings.Button_UserMenu_Logout
    )
    this.Button_Collapse = new Element(
      global.page,
      this.page
        .locator('#navigation__collapse')
        .filter({ hasText: `${LeftNavStrings.Button_Collapse}` }),
      LeftNavStrings.Button_Collapse
    )
    this.Button_Expand = new Element(global.page, this.page.locator('#navigation__collapse'))
  }

  async NavigateDirectly(targetUrl: string) {
    await this.page.goto(targetUrl)
    await this.page.waitForLoadState()
  }

  async GoHome(forceHome: boolean = true) {
    if (forceHome) {
      await this.NavigateDirectly(this.global.baseUrl)
      await this.page.waitForLoadState()
    } else {
      await this.Button_Home.Click()
      await this.page.waitForLoadState()
    }
  }

  async VerifyNavRootLabels() {
    await this.Title.VerifyExpectedText()
    await this.Button_Home.VerifyExpectedText()
    await this.Button_ServiceAreas.VerifyExpectedText()
    await this.Button_Vendors.VerifyExpectedText()
    await this.Button_Rules.VerifyExpectedText()
    await this.Button_IncompleteFNOLs.VerifyExpectedText()
    await this.Button_WeatherEvents.VerifyExpectedText()
  }

  async VerifyUserMenuLabels() {
    await this.Button_UserMenu.VerifyExpectedText()
    await this.Button_UserMenu.Click()
    await this.Button_UserMenu_UIVersion.VerifyExpectedText()
    await this.Button_UserMenu_Logout.VerifyExpectedText()
    await this.Button_UserMenu.Click()
  }

  async VerifyCollapseAndExpand() {
    await this.ForceExpandedState()
    await this.Button_Collapse.VerifyExpectedText()
    await this.Button_Collapse.Click()
    await this.Button_Expand.VerifyTextDoesNotContain(LeftNavStrings.Button_Collapse)
    await this.Button_Expand.Click()
    await this.Button_Collapse.VerifyExpectedText()
  }

  async ForceExpandedState() {
    if (await this.IsCollapsed()) {
      await this.Button_Expand.Click()
    }
  }

  async IsExpanded() {
    const currentButtonText = await this.Button_Expand.GetText()
    return currentButtonText == LeftNavStrings.Button_Collapse
  }

  async IsCollapsed() {
    const currentButtonText = await this.Button_Expand.GetText()
    return currentButtonText == ''
  }
}
