import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { Locator } from 'playwright/test'

export class ClaimsPortalContactInfoDialog extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Badge_Removed: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.Button_Close_X = new Element(
      global.page,
      this.page.locator(`section[id*='chakra-modal'] button[aria-label='Close']`)
    )
    this.Title = new Element(global.page, this.page.locator(`header[id*='chakra-modal'] h3`))
    this.Badge_Removed = this.page
      .locator(`header[id*='chakra-modal'] span.chakra-badge`)
      .getByText('Removed')
  }

  async VerifyTitle(expectedTitle: string) {
    await this.Title.VerifyExpectedText(expectedTitle)
  }

  async HasRemovedBadge() {
    const removedBadgeExists = (await this.Badge_Removed.count()) > 0
    return removedBadgeExists
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
