import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { Locator } from 'playwright/test'
import { DialogStrings, ValidationStrings } from '../claimsPortalConstants.js'

export class ClaimsPortalUpdateCarrierDialog extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Cancel: Element
  readonly Button_Submit: Element
  readonly parent: Locator
  readonly header: Locator
  readonly body: Locator
  readonly footer: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator(`div[data-slot="dialog-popup"]`)
    this.header = this.parent.locator(`div[data-slot="dialog-header"]`)
    this.body = this.parent.locator(`div[data-slot="dialog-body"]`)
    this.footer = this.parent.locator(`div[data-slot="dialog-footer"]`)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[data-slot="alert-dialog-dismiss"]`)
    )
    this.Button_Cancel = new Element(
      global.page,
      this.footer.locator(`button[data-slot="dialog-close"]`),
      DialogStrings.Button_Cancel
    )
    this.Button_Submit = new Element(
      global.page,
      this.footer.locator('#carrierForm-submit'),
      DialogStrings.Button_Submit
    )
    this.Title = new Element(
      global.page,
      this.header.locator(`h2`),
      DialogStrings.UpdateCarrier_Title
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async SetCarrierValue(carrierValue: string) {
    const setLocator = this.body.locator(`input[role="combobox"]`)
    await setLocator.click()
    await setLocator.fill(carrierValue)
    await setLocator.press('Enter')
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }

  async Validate() {
    // Validate contact selection combo box is in an invalid state and that the error is..
    let carrierFieldIsValidated = false
    carrierFieldIsValidated =
      (await this.body.locator(`div[data-slot="field-error"]`).textContent()) ==
      ValidationStrings.Required
    return carrierFieldIsValidated
  }
}
