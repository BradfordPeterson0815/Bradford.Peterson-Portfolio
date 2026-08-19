import { Browser, BrowserContext, Locator, type Page } from '@playwright/test'
import { DelegateFlavor } from '../delegatePortalConstants.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'

export class DelegatePortalBase {
  readonly global: DelegatePortalGlobal
  page: Page
  readonly context: BrowserContext
  readonly environment: string
  readonly browser: Browser
  readonly flavor: DelegateFlavor
  readonly mobile: boolean

  constructor(global: DelegatePortalGlobal) {
    this.global = global
    this.page = global.page
    this.environment = global.environment
    this.browser = global.browser
    this.context = global.context
    this.flavor = global.flavor
    this.mobile = global.isMobile
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

  async CustomLoad() {}

  async WaitForLoad() {
    const skeletonLocator = this.page.locator('.chakra-skeleton')
    let stillLoading = await skeletonLocator.count()
    let attempts = 0
    while (stillLoading > 0 && attempts < 5) {
      await this.page.waitForTimeout(1000)
      stillLoading = await skeletonLocator.count()
      attempts++
    }
  }

  async Wait(timeToWaitInMilliseconds: number) {
    await this.page.waitForTimeout(timeToWaitInMilliseconds)
  }
}
