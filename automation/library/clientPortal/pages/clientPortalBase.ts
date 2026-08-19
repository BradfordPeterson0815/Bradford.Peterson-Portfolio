import { type Page, Browser, BrowserContext, Locator, expect } from '@playwright/test'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'

export class ClientPortalBase {
  readonly global: ClientPortalGlobal
  page: Page
  readonly context: BrowserContext
  readonly environment: string
  readonly browser: Browser

  constructor(global: ClientPortalGlobal) {
    this.global = global
    this.page = global.page
    this.environment = global.environment
    this.browser = global.browser
    this.context = global.context
  }

  async isLocatorInViewport(element: Locator): Promise<boolean> {
    const viewportSize = element.page().viewportSize()
    const boundingBox = await element.boundingBox()

    if (!viewportSize || !boundingBox) {
      return false
    }

    const isBoundingBoxVisible = boundingBox.x >= 0 && boundingBox.y >= 0
    const isBoundingBoxInViewport =
      boundingBox.x + boundingBox.width <= viewportSize.width &&
      boundingBox.y + boundingBox.height <= viewportSize.height

    return isBoundingBoxVisible && isBoundingBoxInViewport
  }

  async GetClipboardText(): Promise<string> {
    const clipboardText = await this.page.evaluate('navigator.clipboard.readText()')
    return clipboardText ? String(clipboardText) : ''
  }

  async VerifyClipboardText(expectedText: string) {
    const clipboardText = await this.GetClipboardText()
    expect(clipboardText).toContain(expectedText)
  }
}
