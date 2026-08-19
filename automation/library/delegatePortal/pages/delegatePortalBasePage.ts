import { Element } from '../../shared/element.js'
import { MobileStrings } from '../delegatePortalConstants.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalLeftNavBar } from '../delegatePortalLeftNavBar.js'
import { DelegatePortalBase } from './delegatePortalBase.js'
import { expect } from '@playwright/test'

export class DelegatePortalBasePage extends DelegatePortalBase {
  readonly leftNavBar: DelegatePortalLeftNavBar
  readonly Button_MobileMainMenu: Element
  public URL: string

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.leftNavBar = new DelegatePortalLeftNavBar(global)
    this.Button_MobileMainMenu = new Element(
      global.page,
      this.page.locator(`button[aria-label="${MobileStrings.Button_MainMenu}"]`)
    )
    this.URL = ''
  }
  async OpenMobileNavBar() {
    await this.Button_MobileMainMenu.Click()
    return this.leftNavBar
  }

  async NavigateDirectly(targetUrl: string) {
    await this.page.goto(targetUrl)
    await this.page.waitForLoadState()
  }

  async GetClipboardText(): Promise<string> {
    const clipboardText = await this.page.evaluate('navigator.clipboard.readText()')
    return clipboardText ? String(clipboardText) : ''
  }

  async VerifyClipboardText(expectedText: string) {
    const clipboardText = await this.GetClipboardText()
    expect(clipboardText).toContain(expectedText)
  }

  async Reload() {
    await this.page.reload()
    await this.page.waitForLoadState()
  }
}
