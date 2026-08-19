import { Element } from '../../shared/element.js'
import { Locator } from '@playwright/test'
import { UserPortalBase } from '../pages/userPortalBase.js'
import { UserPortalGlobal } from '../userPortalGlobal.js'
import { DrawerStrings, ValidationStrings } from '../userPortalConstants.js'
export class UserPortalUpdateContactDrawer extends UserPortalBase {
  readonly Title: Element
  readonly Button_Close: Element
  readonly Button_Close_X: Element
  readonly Button_Submit: Element
  readonly TextBox_FirstName: Element
  readonly TextBox_LastName: Element
  readonly parent: Locator
  constructor(global: UserPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.UpdateContact_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close = new Element(global.page, this.parent.getByLabel(DrawerStrings.Button_Close))
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
    this.TextBox_FirstName = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.UpdateContact_TextBox_FirstName)
    )
    this.TextBox_LastName = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.UpdateContact_TextBox_LastName)
    )
  }
  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }
  async Validate() {
    let firstNameFieldIsValidated = false
    // Validate First Name Field is in an invalid state and that the error is..
    if ((await this.TextBox_FirstName.locator.getAttribute('aria-invalid')) === 'true') {
      const referenceId = await this.TextBox_FirstName.locator.getAttribute('aria-describedby')
      // "First name must be at least 1 character"
      firstNameFieldIsValidated =
        (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ===
        ValidationStrings.FirstName_InvalidValue
    }
    return firstNameFieldIsValidated
  }
  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
