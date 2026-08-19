import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalCloseJobDrawer extends ClaimsPortalBase {
  readonly parent: Locator
  readonly footer: Locator
  readonly Title: Element
  readonly Button_Close: Element
  readonly Button_Close_X: Element
  readonly Button_Submit: Element
  readonly TextArea_Notes: Element
  readonly ListBox_Reason: Element
  readonly TextBox_ClosedDate: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    this.footer = this.parent.locator(`div[class*="chakra-modal__footer"]`)
    this.Title = new Element(
      global.page,
      this.parent.getByText(DrawerStrings.CloseJob_Title),
      DrawerStrings.CloseJob_Title
    )
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label="Close"]`).first()
    )
    this.TextBox_ClosedDate = new Element(
      global.page,
      this.parent.locator(`input[name="closedDate"]`)
    )
    this.ListBox_Reason = new Element(
      global.page,
      this.parent.locator(`select[name="closedReason"]`)
    )
    this.TextArea_Notes = new Element(
      global.page,
      this.parent.locator('textarea[name="closingNotes"]')
    )
    this.Button_Close = new Element(
      global.page,
      this.footer.getByText(DrawerStrings.Button_Close, { exact: true })
    )
    this.Button_Submit = new Element(global.page, this.footer.locator('#closeJobForm-submit'))
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Validate() {
    // Validate Closed Date is in an invalid state and that the error is..
    let closedDateIsValidated = false
    if ((await this.TextBox_ClosedDate.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_ClosedDate.locator.getAttribute('aria-describedby')
      const validationText = await this.parent.locator(`div[id*='${referenceId}']`).textContent()
      closedDateIsValidated = validationText == ValidationStrings.InvalidString1
    }

    // Validate Closed Date is in an invalid state and that the error is..
    let closedReasonIsValidated = false
    if ((await this.ListBox_Reason.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.ListBox_Reason.locator.getAttribute('aria-describedby')
      const validationText = await this.parent.locator(`div[id*='${referenceId}']`).textContent()
      closedReasonIsValidated = validationText == ValidationStrings.InvalidEnumJobCloseReason
    }
    return closedDateIsValidated && closedReasonIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
