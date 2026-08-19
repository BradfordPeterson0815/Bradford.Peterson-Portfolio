import { Locator } from 'playwright/test'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalDataGridTextSearchPopup extends ClaimsPortalBase {
  readonly searchInputLocator: Locator
  readonly clearButtonLocator: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.searchInputLocator = this.page.locator(
      `div[data-base-ui-portal] div[data-slot="input-group"] input[data-slot="input"]`
    )
    this.clearButtonLocator = this.page.locator(
      `div[data-base-ui-portal] div[data-slot="input-group"] button[data-slot="button"]`
    )
  }

  async SetSearch(searchTerm: string, closeAfterSet: boolean) {
    await this.searchInputLocator.fill(searchTerm)
    if (closeAfterSet) {
      await this.page.keyboard.press('Escape')
    }
  }

  async ClearSearch(closeAfterClear: boolean) {
    const exists = (await this.clearButtonLocator.count()) > 0
    if (exists) {
      await this.clearButtonLocator.click()
      if (closeAfterClear) {
        await this.page.keyboard.press('Escape')
      }
    }
  }
}
