import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { Locator } from 'playwright/test'

export class ClaimsPortalFileCardImageZoomDialog extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly parent: Locator
  readonly header: Locator

  constructor(global: ClaimsPortalGlobal, expectedTitle: string) {
    super(global)
    this.parent = this.page.locator('div[data-slot="dialog-popup"]').nth(0)
    this.header = this.parent.locator(`div[data-slot="dialog-header"]`)
    this.Title = new Element(global.page, this.header.locator(`h2`), expectedTitle)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[data-slot='alert-dialog-dismiss']`)
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
