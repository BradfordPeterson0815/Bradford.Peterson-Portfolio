import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { UserPortalBase } from '../pages/userPortalBase.js'
import { DrawerStrings, ValidationStrings } from '../userPortalConstants.js'
import { UserPortalGlobal } from '../userPortalGlobal.js'

export class UserPortalRequestCallbackDrawer extends UserPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly ListBox_PreferredContactMethod: Element
  readonly ListBox_PreferredTimeOfDay: Element
  readonly TextBox_PhoneNumber: Element
  readonly TextBox_EmailAddress: Element
  readonly TextArea_Description: Element
  readonly parent: Locator

  constructor(global: UserPortalGlobal, title: string) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    this.Title = new Element(global.page, this.parent.getByText(title), title)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.ListBox_PreferredContactMethod = new Element(
      global.page,
      this.page.locator('select[id="contactMethod"]')
    )
    this.TextBox_PhoneNumber = new Element(global.page, this.parent.locator('input[name="phone"]'))
    this.TextBox_EmailAddress = new Element(global.page, this.parent.locator('input[name="email"]'))
    this.ListBox_PreferredTimeOfDay = new Element(
      global.page,
      this.page.locator('select[id="contactTime"]')
    )
    this.TextArea_Description = new Element(
      global.page,
      this.parent.locator('textarea[name="description"]')
    )
    this.Button_Close = new Element(
      global.page,
      this.parent.locator(`div.chakra-modal__footer button:nth-child(1)`)
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async ValidatePreferred() {
    let preferredContactMethodFieldIsValidated = false
    let preferredTimeOfDayIsValidated = false

    // Validate Preferred Contact Method Field is in an invalid state and that the error is..
    if (
      (await this.ListBox_PreferredContactMethod.locator.getAttribute('aria-invalid')) === 'true'
    ) {
      const referenceId =
        await this.ListBox_PreferredContactMethod.locator.getAttribute('aria-describedby')
      // "Invalid discriminator value. Expected 'email' | 'phone'"
      preferredContactMethodFieldIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ===
        ValidationStrings.InvalidPreferredContact
    }

    // Validate Preferred Time of Day is in an invalid state and that the error is..
    if ((await this.ListBox_PreferredTimeOfDay.locator.getAttribute('aria-invalid')) === 'true') {
      const referenceId =
        await this.ListBox_PreferredTimeOfDay.locator.getAttribute('aria-describedby')
      // "Invalid enum value. Expected 'any' | 'morning' | 'afternoon' | 'evening', received ''"
      preferredTimeOfDayIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ===
        ValidationStrings.InvalidPreferredTimeOfDay
    }

    return preferredContactMethodFieldIsValidated && preferredTimeOfDayIsValidated
  }

  async ValidatePhone() {
    let phoneNumberIsValidated = false

    // Validate Phone Number is in an invalid state and that the error is..
    phoneNumberIsValidated =
      (await this.page.locator(`form div[id*="field"]`).nth(0).textContent()) ===
      ValidationStrings.InvalidString1

    return phoneNumberIsValidated
  }

  async ValidateEmailAddress() {
    let emailAddressIsValidated = false

    // Validate Email Address is in an invalid state and that the error is..
    emailAddressIsValidated =
      (await this.page.locator(`form div[id*="field"]`).nth(0).textContent()) ===
      ValidationStrings.InvalidString1

    return emailAddressIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
