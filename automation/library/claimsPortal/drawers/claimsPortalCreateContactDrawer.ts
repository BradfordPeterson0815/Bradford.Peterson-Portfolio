import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings } from '../claimsPortalConstants.js'
import { Locator } from '@playwright/test'

export class ClaimsPortalCreateContactDrawer extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close: Element
  readonly Button_Cancel: Element
  readonly Button_Submit: Element
  readonly TextBox_FirstName: Element
  readonly TextBox_LastName: Element
  readonly parent: Locator

  constructor(global: ClaimsPortalGlobal, isUpdateMode = false) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = isUpdateMode
      ? DrawerStrings.CreateContact_Title_Edit
      : DrawerStrings.CreateContact_Title_Create
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close = new Element(global.page, this.parent.getByLabel(DrawerStrings.Button_Close))
    this.Button_Cancel = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Cancel}` })
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
    this.TextBox_FirstName = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.CreateContact_TextBox_FirstName)
    )
    this.TextBox_LastName = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.CreateContact_TextBox_LastName)
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Validate() {
    let firstNameFieldIsValidated = false
    let roleFieldIsValidated = false

    // Validate First Name Field is in an invalid state and that the error is..
    if ((await this.TextBox_FirstName.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_FirstName.locator.getAttribute('aria-describedby')
      // "First name must be at least 1 character"
      firstNameFieldIsValidated =
        (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
        DrawerStrings.CreateContact_FirstName_InvalidValue
    }

    // if the role is disabled (means default is already set), we don't need to validate it
    if (await this.page.locator(`select[id="roles.0.role"]`).isDisabled()) {
      roleFieldIsValidated = true
    } else {
      if (
        (await this.page.locator(`select[id="roles.0.role"]`).getAttribute('aria-invalid')) ==
        'true'
      ) {
        const referenceId = await this.page
          .locator(`select[id="roles.0.role"]`)
          .getAttribute('aria-describedby')
        // "First name must be at least 1 character"
        roleFieldIsValidated =
          (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
          DrawerStrings.CreateContact_Role_InvalidValue
      }
    }

    return firstNameFieldIsValidated && roleFieldIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
