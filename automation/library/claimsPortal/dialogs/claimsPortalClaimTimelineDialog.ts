import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'

export class ClaimsPortalClaimTimelineDialog extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.Button_Close_X = new Element(
      global.page,
      this.page.locator(`section[id*='popover-content'] button[aria-label='Close']`)
    )
    this.Title = new Element(
      global.page,
      this.page.locator(`header[id*='popover-header']`),
      'Claim Timeline'
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
