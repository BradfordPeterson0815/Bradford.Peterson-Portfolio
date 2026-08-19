import { Element } from '../shared/element.js'
import { expect } from 'playwright/test'
import { DelegatePortalBase } from './pages/delegatePortalBase.js'
import { DelegatePortalGlobal } from './delegatePortalGlobal.js'
import { DelegateFlavor, LeftNavStrings } from './delegatePortalConstants.js'
import { DelegatePortalUpdateProfileImageDrawer } from './drawers/delegatePortalUpdateProfileImageDrawer.js'
import { DelegatePortalUpdateLicenseNumberDrawer } from './drawers/delegatePortalUpdateLicenseNumberDrawer.js'

export class DelegatePortalLeftNavBar extends DelegatePortalBase {
  readonly Title: Element
  readonly Button_Home: Element
  readonly Button_Inbox: Element
  readonly Button_Callbacks: Element
  readonly Button_Schedule: Element
  readonly Button_Documentation: Element
  readonly Button_MobileApps: Element
  // readonly Button_MobileApps_IOSAppStore: Element
  // readonly Button_MobileApps_GooglePlayStore: Element
  readonly Button_SubmitBug: Element
  readonly Button_UserMenu: Element
  readonly Button_UserMenu_UpdateLicenseNumber: Element
  readonly Button_UserMenu_UpdateProfileImage: Element
  readonly Button_UserMenu_UIVersion: Element
  readonly Button_UserMenu_CeylonVersion: Element
  readonly Button_UserMenu_Logout: Element
  readonly Button_Collapse: Element
  readonly Button_Expand: Element
  readonly Mobile_Button_Open: Element

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: LeftNavStrings.Title }),
      LeftNavStrings.Title
    )
    this.Button_Home = new Element(
      global.page,
      this.page.getByRole('link', { name: LeftNavStrings.Button_Home }).first(),
      LeftNavStrings.Button_Home
    )
    this.Button_Inbox = new Element(
      global.page,
      this.page.getByRole('link', { name: LeftNavStrings.Button_Inbox }),
      LeftNavStrings.Button_Inbox
    )
    this.Button_Callbacks = new Element(
      global.page,
      this.page.getByRole('link', { name: LeftNavStrings.Button_Callbacks }),
      LeftNavStrings.Button_Callbacks
    )
    this.Button_Schedule = new Element(
      global.page,
      this.page.getByRole('link', { name: LeftNavStrings.Button_Schedule }),
      LeftNavStrings.Button_Schedule
    )
    this.Button_Documentation = new Element(
      global.page,
      this.page.getByRole('link', { name: LeftNavStrings.Button_Documentation }),
      LeftNavStrings.Button_Documentation
    )
    this.Button_MobileApps = new Element(
      global.page,
      this.page.getByRole('button', { name: LeftNavStrings.Button_MobileApps }),
      LeftNavStrings.Button_MobileApps
    )
    this.Button_SubmitBug = new Element(
      global.page,
      this.page.locator(`#root > div > div:nth-of-type(2) > ul a[target='jiraForm']`),
      LeftNavStrings.Button_SubmitBug
    )
    this.Button_UserMenu = new Element(
      global.page,
      this.page.locator(
        `#root > div > div:nth-of-type(2) > ul > li:nth-of-type(4) button[aria-haspopup='menu']`
      ),
      global.friendly
    )
    this.Button_UserMenu_UpdateLicenseNumber = new Element(
      global.page,
      this.page.getByRole('menuitem', {
        name: LeftNavStrings.Button_UserMenu_UpdateLicenseNumber,
      }),
      LeftNavStrings.Button_UserMenu_UpdateLicenseNumber
    )
    this.Button_UserMenu_UpdateProfileImage = new Element(
      global.page,
      this.page.getByRole('menuitem', {
        name: `${LeftNavStrings.Button_UserMenu_UpdateProfileImage}`,
      }),
      LeftNavStrings.Button_UserMenu_UpdateProfileImage
    )
    this.Button_UserMenu_UIVersion = new Element(
      global.page,
      this.page.locator(
        `#root > div > div:nth-of-type(2) > ul > li:nth-of-type(4) button[data-index='2']`
      ),
      LeftNavStrings.Button_UserMenu_UIVersion
    )
    this.Button_UserMenu_CeylonVersion = new Element(
      global.page,
      this.page.locator(
        `#root > div > div:nth-of-type(2) > ul > li:nth-of-type(4) button[data-index='3']`
      ),
      LeftNavStrings.Button_UserMenu_CeylonVersion
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
      this.page.locator(`#root > div > div:nth-of-type(2) > ul > li:nth-of-type(5) button`)
    )
    this.Mobile_Button_Open = new Element(
      global.page,
      this.page.locator(`button[aria-label="Open navigation menu"]`)
    )
  }

  async NavigateDirectly(targetUrl: string) {
    await this.page.goto(targetUrl)
    await this.page.waitForLoadState()
  }

  async VerifyNavRootLabels() {
    await this.Title.VerifyExpectedText()
    await this.Button_Home.VerifyExpectedText()
    await this.Button_Inbox.VerifyExpectedText()
    await this.Button_Callbacks.VerifyExpectedText()
    await this.Button_Schedule.VerifyExpectedText()
  }

  async VerifyUserMenuLabels() {
    const textLocator = this.Button_UserMenu.locator.locator('span span span').nth(1)
    const actualText = await textLocator.textContent()
    expect(actualText).toBe(this.Button_UserMenu.expectedText)

    await this.Button_UserMenu.Click()
    if (this.global.flavor === DelegateFlavor.FieldAgent) {
      await this.Button_UserMenu_UpdateLicenseNumber.VerifyExpectedText()
    }
    await this.Button_UserMenu_UpdateProfileImage.VerifyExpectedText()
    //await this.Button_UserMenu_UIVersion.VerifyExpectedText()
    //await this.Button_UserMenu_CeylonVersion.VerifyExpectedText()
    await this.Button_UserMenu_Logout.VerifyExpectedText()
    await this.Button_UserMenu.Click()
  }

  async VerifyOtherLabels() {
    await this.Button_Documentation.VerifyExpectedText()
    await this.Button_MobileApps.VerifyExpectedText()
    await this.Button_SubmitBug.VerifyExpectedText()
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

  async OpenUpdateProfileImageDrawer() {
    await this.Button_UserMenu.Click()
    await this.Button_UserMenu_UpdateProfileImage.Click()
    const updateProfileImageDrawer = new DelegatePortalUpdateProfileImageDrawer(this.global)
    return updateProfileImageDrawer
  }

  async OpenUpdateLicenseNumberDrawer() {
    await this.Button_UserMenu.Click()
    await this.Button_UserMenu_UpdateLicenseNumber.Click()
    const updateLicenseNumberDrawer = new DelegatePortalUpdateLicenseNumberDrawer(this.global)
    return updateLicenseNumberDrawer
  }
}
