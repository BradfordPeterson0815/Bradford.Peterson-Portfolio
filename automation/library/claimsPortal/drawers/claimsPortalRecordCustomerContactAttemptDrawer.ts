import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'

export class ClaimsPortalRecordCustomerContactAttemptDrawer extends ClaimsPortalBasePage {
  readonly parent: Locator
  readonly footer: Locator
  readonly Title: Element
  readonly Button_Close: Element
  readonly Button_Close_X: Element
  readonly Button_Submit: Element

  readonly TextBox_ContactAttemptedDate: Element
  readonly ComboBox_ContactedBy: Element
  readonly ComboBox_CustomerContacted: Element
  readonly ListBox_Method: Element
  readonly ListBox_Outcome: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    this.footer = this.parent.locator(`div[class*="chakra-modal__footer"]`)
    this.Title = new Element(
      global.page,
      this.parent.getByText(DrawerStrings.RecordCustomerContactAttempt_Title),
      DrawerStrings.RecordCustomerContactAttempt_Title
    )
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label="Close"]`).first()
    )
    this.TextBox_ContactAttemptedDate = new Element(
      global.page,
      this.parent.locator('#contactAttemptedDate')
    )
    this.ComboBox_ContactedBy = new Element(
      global.page,
      this.parent.locator('input[role="combobox"]').nth(0)
    )
    this.ComboBox_CustomerContacted = new Element(
      global.page,
      this.parent.locator('input[role="combobox"]').nth(1)
    )
    this.ListBox_Method = new Element(global.page, this.parent.locator('#contactMethod'))
    this.ListBox_Outcome = new Element(global.page, this.parent.locator('#contactOutcome'))
    this.Button_Close = new Element(
      global.page,
      this.footer.getByText(DrawerStrings.Button_Close, { exact: true })
    )
    this.Button_Submit = new Element(
      global.page,
      this.footer.locator('#customerContactAttemptedForm-submit')
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Validate() {
    // Validate Customer Contact fields are in an invalid state and that the errors are..
    const selectionLocator = this.page.locator(` div[data-invalid=""] > div:nth-child(3)`).nth(0)
    const customerContactedFieldIsValidated =
      (await selectionLocator.textContent()) == ValidationStrings.Required

    let methodFieldIsValidated = false
    if ((await this.ListBox_Method.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.ListBox_Method.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      methodFieldIsValidated = validationText == ValidationStrings.InvalidContactMethod
    }

    let outcomeFieldIsValidated = false
    if ((await this.ListBox_Outcome.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.ListBox_Outcome.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      outcomeFieldIsValidated = validationText == ValidationStrings.InvalidContactOutcome
    }

    return customerContactedFieldIsValidated && methodFieldIsValidated && outcomeFieldIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
