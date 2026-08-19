import { Page, Browser, BrowserContext, Locator } from '@playwright/test'
import { UserPortalGlobal } from '../userPortalGlobal.js'

export class UserPortalBase {
  readonly global: UserPortalGlobal
  page: Page
  readonly context: BrowserContext
  readonly environment: string
  readonly browser: Browser

  constructor(global: UserPortalGlobal) {
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
}
