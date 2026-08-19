import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { Locator } from '@playwright/test'

export class ClaimsPortalCloseClaimDrawer extends ClaimsPortalBase {
  readonly parent: Locator
  readonly Title: Element
  readonly Button_Close: Element
  readonly Button_Close_X: Element
  readonly Button_Submit: Element
  readonly TextArea_AdditionalNotes: Element
  readonly ListBox_Reason: Element
  readonly TextBox_Date: Element
  readonly footer: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    this.footer = this.parent.locator(`div[class*="chakra-modal__footer"]`).nth(0)
    const titleText = DrawerStrings.CloseClaim_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label="Close"]`).first()
    )
    this.Button_Close = new Element(global.page, this.footer.getByText('Close', { exact: true }))
    this.Button_Submit = new Element(global.page, this.page.locator('#claimOutcomeForm-submit'))
    this.TextBox_Date = new Element(global.page, this.parent.locator(`input[name="date"]`))
    this.ListBox_Reason = new Element(
      global.page,
      this.parent.locator(`input[role="combobox"]`).nth(0)
    )
    this.TextArea_AdditionalNotes = new Element(
      global.page,
      this.parent.locator('textarea[name="notes"]')
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Validate() {
    // Validate Reason list field is in an invalid state and that the error is..
    let reasonListBoxValidated = false
    reasonListBoxValidated =
      (await this.page.locator(`form div[id*="field"]`).nth(0).textContent()) ==
      ValidationStrings.Required
    return reasonListBoxValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
