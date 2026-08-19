import { LeftNavStrings } from './userPortalConstants.js'
import { Element } from '../shared/element.js'
import { UserPortalBase } from './pages/userPortalBase.js'
import { UserPortalGlobal } from './userPortalGlobal.js'
import { UserPortalUpdateContactDrawer } from './drawers/userPortalUpdateContactDrawer.js'
export class UserPortalLeftNavBar extends UserPortalBase {
  readonly Title: Element
  readonly Link_Home: Element
  readonly Link_Details: Element
  readonly Link_Documents: Element
  readonly Link_Media: Element
  readonly Link_ContactUs: Element
  readonly Button_PortalTour: Element
  readonly Link_AboutCompany: Element
  readonly Button_UserMenu: Element
  readonly Button_UserMenu_UpdateContactInfo: Element
  readonly Button_UserMenu_UIVersion: Element
  readonly Button_UserMenu_Logout: Element
  readonly Button_Collapse: Element
  readonly Button_Expand: Element

  constructor(global: UserPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${LeftNavStrings.Title}` }),
      LeftNavStrings.Title
    )
    this.Link_Home = new Element(
      global.page,
      this.page.getByRole('link', { name: `${LeftNavStrings.Link_Home}`, exact: true }).first(),
      LeftNavStrings.Link_Home
    )
    this.Link_Details = new Element(
      global.page,
      this.page.getByRole('link', { name: `${LeftNavStrings.Link_Details}`, exact: true }).first(),
      LeftNavStrings.Link_Details
    )
    this.Link_Documents = new Element(
      global.page,
      this.page.getByRole('link', { name: `${LeftNavStrings.Link_Documents}`, exact: true }),
      LeftNavStrings.Link_Documents
    )
    this.Link_Media = new Element(
      global.page,
      this.page.getByRole('link', { name: `${LeftNavStrings.Link_Media}`, exact: true }),
      LeftNavStrings.Link_Media
    )
    this.Link_ContactUs = new Element(
      global.page,
      this.page.getByRole('link', { name: `${LeftNavStrings.Link_ContactUs}` }),
      LeftNavStrings.Link_ContactUs
    )
    this.Button_PortalTour = new Element(
      global.page,
      this.page.getByRole('button', { name: `${LeftNavStrings.Button_PortalTour}` }),
      LeftNavStrings.Button_PortalTour
    )
    this.Link_AboutCompany = new Element(
      global.page,
      this.page.getByRole('link', { name: `${LeftNavStrings.Link_AboutCompany}` }),
      LeftNavStrings.Link_AboutCompany
    )
    this.Button_UserMenu = new Element(
      global.page,
      this.page.locator(
        `#root > div > div:nth-of-type(2) > ul > li:nth-of-type(3) button[aria-haspopup='menu']`
      ),
      global.friendly
    )
    this.Button_UserMenu_UpdateContactInfo = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: 'Update Contact Info' }),
      LeftNavStrings.Button_UserMenu_UpdateContactInfo
    )
    this.Button_UserMenu_UIVersion = new Element(
      global.page,
      this.page.locator(
        `#root > div > div:nth-of-type(2) > ul > li:nth-of-type(3) button[data-index='1']`
      ),
      LeftNavStrings.Button_UserMenu_UIVersion
    )
    this.Button_UserMenu_Logout = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: 'Logout' }),
      LeftNavStrings.Button_UserMenu_Logout
    )
    this.Button_Collapse = new Element(
      global.page,
      this.page.getByRole('button', { name: 'Collapse' }),
      LeftNavStrings.Button_Collapse
    )
    this.Button_Expand = new Element(
      global.page,
      this.page.locator(`#root > div > div:nth-of-type(2) > ul > li:nth-of-type(4) button`)
    )
  }
  async NavigateDirectly(targetUrl: string) {
    await this.page.goto(targetUrl)
    await this.page.waitForLoadState()
  }
  async GoHome() {
    await this.NavigateDirectly(this.global.baseUrl)
    await this.page.waitForLoadState()
  }
  async VerifyNavRootLabels() {
    await this.Title.VerifyExpectedText()
    await this.Link_Home.VerifyExpectedText()
    await this.Link_Details.VerifyExpectedText()
    await this.Link_Documents.VerifyExpectedText()
    await this.Link_Media.VerifyExpectedText()
    await this.Link_ContactUs.VerifyExpectedText()
  }
  async VerifyUserMenuLabels() {
    await this.Button_UserMenu.VerifyExpectedText()
    await this.Button_UserMenu.Click()
    await this.Button_UserMenu_UpdateContactInfo.VerifyExpectedText()
    //await this.Button_UserMenu_UIVersion.VerifyExpectedText()
    await this.Button_UserMenu_Logout.VerifyExpectedText()
    await this.Button_UserMenu.Click()
  }
  async VerifyOtherLabels() {
    await this.Button_PortalTour.VerifyExpectedText()
    await this.Link_AboutCompany.VerifyExpectedText()
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
  async OpenUpdateContactInformationDrawer() {
    await this.Button_UserMenu.Click()
    await this.Button_UserMenu_UpdateContactInfo.Click()
    const updateContactDrawer = new UserPortalUpdateContactDrawer(this.global)
    return updateContactDrawer
  }
}
