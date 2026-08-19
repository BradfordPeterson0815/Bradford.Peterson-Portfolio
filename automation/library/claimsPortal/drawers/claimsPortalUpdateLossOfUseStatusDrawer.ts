import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalUpdateLossOfUseStatusDrawer extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close: Element
  readonly Button_Close_X: Element
  readonly Button_Submit: Element
  readonly Listbox_Status: Element
  readonly TextArea_Justification: Element
  readonly parent: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    this.Title = new Element(
      global.page,
      this.parent.getByText(DrawerStrings.UpdateLossOfUseStatus_Title),
      DrawerStrings.UpdateLossOfUseStatus_Title
    )
    this.Button_Close = new Element(global.page, this.parent.getByLabel(DrawerStrings.Button_Close))
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label="Close"]`)
    )

    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
    this.Listbox_Status = new Element(global.page, this.parent.locator('select[id="status"]'))
    this.TextArea_Justification = new Element(
      global.page,
      this.parent.locator('textarea[id="justification"]')
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async SetStatus(statusToSet: string) {
    await this.Listbox_Status.locator.selectOption({ label: statusToSet })
  }

  async Validate() {
    let statusFieldIsValidated = false

    // Validate Status Field is in an invalid state and that the error is..
    if ((await this.Listbox_Status.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.Listbox_Status.locator.getAttribute('aria-describedby')
      // "  InvalidEnumLossOfUseStatus: `Invalid enum value. Expected 'approved' | 'denied' | 'cancelled' | 'pending', received ''`"
      statusFieldIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidEnumLossOfUseStatus
    }

    return statusFieldIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
