import { LeftNavStrings } from './claimsPortalConstants.js'
import { Element } from '../shared/element.js'
import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { ClaimsPortalBase } from './pages/claimsPortalBase.js'
import { ClaimsPortalUpdateProfileImageDrawer } from './drawers/claimsPortalUpdateProfileImageDrawer.js'
import { ClaimsPortalUserSettingsDrawer } from './drawers/claimsPortalUserSettingsDrawer.js'
import { Locator } from 'playwright/test'
import { ClaimsPortalBreakTimeSettingsDrawer } from './drawers/claimsPortalBreakTimeSettingsDrawer.js'

export class ClaimsPortalLeftNavBar extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Home: Element
  readonly Button_ClaimsPortal: Element
  readonly Button_Jobs: Element
  readonly Button_Inbox: Element
  readonly Button_Callbacks: Element
  readonly Button_Admin: Element
  readonly Button_Admin_GoBack: Element
  readonly Button_Admin_Contacts: Element
  readonly Button_Admin_Estimator: Element
  readonly Button_Admin_Pricing: Element
  readonly Button_Admin_Templates: Element
  readonly Button_Admin_Tags: Element
  readonly Button_Chatbots: Element
  readonly Button_Chatbots_GoBack: Element
  readonly Button_Chatbots_Eagle: Element
  readonly Button_Documentation: Element
  readonly Button_SubmitBug: Element
  readonly Button_UserMenu: Element
  readonly Button_UserMenu_UpdateProfileImage: Element
  readonly Button_UserMenu_UserSettings: Element
  readonly Button_UserMenu_BreakTimeSettings: Element
  readonly Button_UserMenu_UIVersion: Element
  readonly Button_UserMenu_CeylonVersion: Element
  readonly Button_UserMenu_Logout: Element
  readonly Button_Collapse: Element
  readonly Button_Expand: Element
  readonly navListTop: Locator
  readonly navListBottom: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.navListTop = this.page.locator('ul[role="list"]').nth(0)
    this.navListBottom = this.page.locator('ul[role="list"]').nth(1)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: LeftNavStrings.Title }),
      LeftNavStrings.Title
    )
    this.Button_Home = new Element(
      global.page,
      this.navListTop.getByRole('link', { name: LeftNavStrings.Button_Home }).first(),
      LeftNavStrings.Button_Home
    )
    this.Button_ClaimsPortal = new Element(
      global.page,
      this.navListTop.getByRole('link', { name: LeftNavStrings.Button_ClaimsPortal }),
      LeftNavStrings.Button_ClaimsPortal
    )
    this.Button_Jobs = new Element(
      global.page,
      this.navListTop.getByRole('link', { name: LeftNavStrings.Button_Jobs }),
      LeftNavStrings.Button_Jobs
    )
    this.Button_Inbox = new Element(
      global.page,
      this.navListTop.getByRole('link', { name: LeftNavStrings.Button_Inbox }),
      LeftNavStrings.Button_Inbox
    )
    this.Button_Callbacks = new Element(
      global.page,
      this.navListTop.getByRole('link', { name: LeftNavStrings.Button_Callbacks }),
      LeftNavStrings.Button_Callbacks
    )
    this.Button_Admin = new Element(
      global.page,
      this.navListTop.getByRole('button', { name: LeftNavStrings.Button_Admin }),
      LeftNavStrings.Button_Admin
    )
    this.Button_Admin_GoBack = new Element(
      global.page,
      this.navListTop.getByRole('button', { name: LeftNavStrings.Button_Admin_GoBack }),
      LeftNavStrings.Button_Admin_GoBack
    )
    this.Button_Admin_Contacts = new Element(
      global.page,
      this.navListTop.getByRole('link', { name: LeftNavStrings.Button_Admin_Contacts }),
      LeftNavStrings.Button_Admin_Contacts
    )
    this.Button_Admin_Pricing = new Element(
      global.page,
      this.navListTop.getByRole('link', { name: LeftNavStrings.Button_Admin_Pricing }),
      LeftNavStrings.Button_Admin_Pricing
    )
    this.Button_Admin_Templates = new Element(
      global.page,
      this.navListTop.getByRole('link', { name: LeftNavStrings.Button_Admin_Templates }),
      LeftNavStrings.Button_Admin_Templates
    )
    this.Button_Admin_Tags = new Element(
      global.page,
      this.navListTop.getByRole('link', { name: LeftNavStrings.Button_Admin_Tags }),
      LeftNavStrings.Button_Admin_Tags
    )
    this.Button_Admin_Estimator = new Element(
      global.page,
      this.navListTop.getByRole('link', { name: LeftNavStrings.Button_Admin_Estimator }),
      LeftNavStrings.Button_Admin_Estimator
    )
    this.Button_Chatbots = new Element(
      global.page,
      this.navListTop.getByRole('button', { name: LeftNavStrings.Button_Chatbots }),
      LeftNavStrings.Button_Chatbots
    )
    this.Button_Chatbots_GoBack = new Element(
      global.page,
      this.page.getByRole('button', { name: LeftNavStrings.Button_Chatbots_GoBack }),
      LeftNavStrings.Button_Chatbots_GoBack
    )
    this.Button_Chatbots_Eagle = new Element(
      global.page,
      this.navListTop.getByRole('link', { name: LeftNavStrings.Button_Chatbots_Eagle }),
      LeftNavStrings.Button_Chatbots_Eagle
    )
    this.Button_Documentation = new Element(
      global.page,
      this.navListBottom.getByRole('link', { name: LeftNavStrings.Button_Documentation }),
      LeftNavStrings.Button_Documentation
    )
    this.Button_SubmitBug = new Element(
      global.page,
      this.navListBottom.locator(`a[target='jiraForm']`),
      LeftNavStrings.Button_SubmitBug
    )
    this.Button_UserMenu = new Element(
      global.page,
      this.navListBottom.locator(`li:nth-of-type(3) button[aria-haspopup='menu']`),
      global.username
    )
    this.Button_UserMenu_UpdateProfileImage = new Element(
      global.page,
      this.navListBottom.getByRole('menuitem', { name: 'Update Profile Image' }),
      LeftNavStrings.Button_UserMenu_UpdateProfileImage
    )
    this.Button_UserMenu_UserSettings = new Element(
      global.page,
      this.navListBottom.getByRole('menuitem', { name: 'User Settings' }),
      LeftNavStrings.Button_UserMenu_UserSettings
    )
    this.Button_UserMenu_BreakTimeSettings = new Element(
      global.page,
      this.navListBottom.getByRole('menuitem', { name: 'Break Time Settings' }),
      LeftNavStrings.Button_UserMenu_BreakTimeSettings
    )
    this.Button_UserMenu_UIVersion = new Element(
      global.page,
      this.navListBottom.locator(`> li:nth-of-type(3) button[data-index='3']`),
      LeftNavStrings.Button_UserMenu_UIVersion
    )
    this.Button_UserMenu_CeylonVersion = new Element(
      global.page,
      this.navListBottom.locator(`> li:nth-of-type(3) button[data-index='4']`),
      LeftNavStrings.Button_UserMenu_CeylonVersion
    )
    this.Button_UserMenu_Logout = new Element(
      global.page,
      this.navListBottom.getByRole('menuitem', { name: 'Logout' }),
      LeftNavStrings.Button_UserMenu_Logout
    )
    this.Button_Collapse = new Element(
      global.page,
      this.navListBottom.getByRole('button', { name: 'Collapse' }),
      LeftNavStrings.Button_Collapse
    )
    this.Button_Expand = new Element(
      global.page,
      this.navListBottom.locator(`> li:nth-of-type(4) button`)
    )
  }

  async NavigateDirectly(targetUrl: string) {
    await this.page.goto(targetUrl)
    await this.page.waitForLoadState()
  }

  async GoHome(forceHome: boolean = true) {
    if (forceHome) {
      await this.NavigateDirectly(this.global.baseUrl)
      await this.page.waitForLoadState()
    }
  }

  async VerifyNavRootLabels() {
    await this.Title.VerifyExpectedText()
    await this.Button_Home.VerifyExpectedText()
    await this.Button_ClaimsPortal.VerifyExpectedText()
    await this.Button_Jobs.VerifyExpectedText()
    await this.Button_Inbox.VerifyExpectedText()
    await this.Button_Callbacks.VerifyExpectedText()
    await this.Button_Admin.VerifyExpectedText()
    await this.Button_Chatbots.VerifyExpectedText()
  }

  async VerifyNavAdminSubLabels() {
    await this.Title.VerifyExpectedText()
    await this.Button_Admin_GoBack.VerifyExpectedText()
    await this.Button_Home.VerifyExpectedText()
    await this.Button_Admin_Contacts.VerifyExpectedText()
    await this.Button_Admin_Estimator.VerifyExpectedText()
    await this.Button_Admin_Pricing.VerifyExpectedText()
    await this.Button_Admin_Templates.VerifyExpectedText()
    await this.Button_Admin_Tags.VerifyExpectedText()
  }

  async VerifyUserMenuLabels() {
    await this.Button_UserMenu.VerifyExpectedText()
    await this.Button_UserMenu.Click()
    await this.Button_UserMenu_UpdateProfileImage.VerifyExpectedText()
    await this.Button_UserMenu_UserSettings.VerifyExpectedText()
    await this.Button_UserMenu_BreakTimeSettings.VerifyExpectedText()
    await this.Button_UserMenu_Logout.VerifyExpectedText()
    await this.Button_UserMenu.Click()
  }

  async VerifyOtherLabels() {
    await this.Button_Documentation.VerifyExpectedText()
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
    const updateProfileImageDrawer = new ClaimsPortalUpdateProfileImageDrawer(this.global)
    return updateProfileImageDrawer
  }

  async OpenUserSettingsDrawer() {
    await this.Button_UserMenu.Click()
    await this.Button_UserMenu_UserSettings.Click()
    const userSettingsDrawer = new ClaimsPortalUserSettingsDrawer(this.global)
    return userSettingsDrawer
  }

  async OpenBreakTimeSettingsDrawer() {
    await this.Button_UserMenu.Click()
    await this.Button_UserMenu_BreakTimeSettings.Click()
    const breakTimeSettingsDrawer = new ClaimsPortalBreakTimeSettingsDrawer(this.global)
    return breakTimeSettingsDrawer
  }
}
