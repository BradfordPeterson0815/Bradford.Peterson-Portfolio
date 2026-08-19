import { Element } from '../../shared/element.js'
import { Locator } from '@playwright/test'
import { DelegatePortalBase } from '../pages/delegatePortalBase.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DrawerStrings, ValidationStrings } from '../delegatePortalConstants.js'

export class DelegatePortalUpdateLicenseNumberDrawer extends DelegatePortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly TextBox_LicenseNumber: Element
  readonly parent: Locator

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.UpdateLicenseNumberDrawer_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(global.page, this.parent.getByLabel(DrawerStrings.Button_Close))
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
    this.TextBox_LicenseNumber = new Element(
      global.page,
      this.parent.locator(`input[name="licenseNumber"]`)
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }

  async Validate() {
    // Validate license number input is in an invalid state and that the error is..
    let licenseNumberIsValidated = false
    if ((await this.TextBox_LicenseNumber.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_LicenseNumber.locator.getAttribute('aria-describedby')
      // "License Number field is required"
      const actualMessage = await this.page.locator(`div[id='${referenceId}']`).textContent()
      licenseNumberIsValidated = actualMessage === ValidationStrings.LicenseNumberRequired
    }

    return licenseNumberIsValidated
  }
}
