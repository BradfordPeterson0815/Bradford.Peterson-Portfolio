import { expect } from '@playwright/test'
import { UserPortalGlobal } from '../userPortalGlobal.js'
import { UserPortalLeftNavBar } from '../userPortalLeftNavBar.js'
import { UserPortalBase } from './userPortalBase.js'

export class UserPortalBasePage extends UserPortalBase {
  readonly leftNavBar: UserPortalLeftNavBar
  public URL: string

  constructor(global: UserPortalGlobal) {
    super(global)
    this.leftNavBar = new UserPortalLeftNavBar(global)
    this.URL = ''
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
