import { ClaimsPortalLeftNavBar } from '../claimsPortalLeftNavBar.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from './claimsPortalBase.js'
import { ClaimsPortalToolbar } from '../claimsPortalToolbar.js'
import { expect } from '@playwright/test'

export class ClaimsPortalBasePage extends ClaimsPortalBase {
  readonly leftNavBar: ClaimsPortalLeftNavBar
  readonly toolbar: ClaimsPortalToolbar
  public URL: string

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.leftNavBar = new ClaimsPortalLeftNavBar(global)
    this.toolbar = new ClaimsPortalToolbar(global)
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
