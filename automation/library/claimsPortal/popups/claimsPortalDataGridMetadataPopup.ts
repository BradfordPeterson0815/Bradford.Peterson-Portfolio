import { Locator } from 'playwright/test'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalDataGridMetadataPopup extends ClaimsPortalBase {
  readonly metadataLocator: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.metadataLocator = this.page.locator(`div[data-slot="popover-content"] > div > span`)
  }

  async GetMetadata() {
    await this.page.waitForTimeout(2000)
    const metadata: string[][] = []
    const items = (await this.metadataLocator.count()) / 2
    for (let itemIndex = 0; itemIndex < items; itemIndex++) {
      const title = await this.metadataLocator.nth(itemIndex * 2).textContent()
      const desc = await this.metadataLocator.nth(itemIndex * 2 + 1).textContent()
      metadata.push([title == null ? '' : title, desc == null ? '' : desc])
    }
    return metadata
  }
}
