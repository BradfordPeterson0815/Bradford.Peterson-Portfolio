import { Element } from '../../shared/element.js'
import { Locator } from 'playwright/test'
import { UserPortalBase } from '../pages/userPortalBase.js'
import { UserPortalGlobal } from '../userPortalGlobal.js'
import { CompanyPortalTourStrings } from '../userPortalConstants.js'

export class UserPortalCompanyPortalTourDialog extends UserPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Done: Element
  readonly parent: Locator

  constructor(global: UserPortalGlobal) {
    super(global)
    this.parent = this.page.locator(`div[aria-modal="true"]`)
    this.Title = new Element(global.page, this.parent.locator(`h2`), CompanyPortalTourStrings.Title)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Done = new Element(
      global.page,
      this.parent.locator(`button[aria-label="Last"]`),
      CompanyPortalTourStrings.Button_Done
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
