import { type Page, Browser, BrowserContext, Locator } from '@playwright/test'
import { BPGlobal } from './bpGlobal.js'
import { BotpressEnvironmentType } from '../shared/constants.js'

export class BPBase {
  readonly global: BPGlobal
  page: Page
  readonly context: BrowserContext
  readonly environment: BotpressEnvironmentType
  readonly browser: Browser

  constructor(global: BPGlobal) {
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
