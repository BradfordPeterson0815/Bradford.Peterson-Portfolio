import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { Locator } from '@playwright/test'

export class ClaimsPortalCancelInspectionDrawer extends ClaimsPortalBase {
  readonly parent: Locator
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly TextBox_CanceledDate: Element
  readonly ListBox_CanceledBy: Element
  readonly TextArea_NoteText: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.CancelInspection_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.TextBox_CanceledDate = new Element(global.page, this.parent.locator('#date'))
    this.ListBox_CanceledBy = new Element(
      global.page,
      this.parent.locator(`input[role="combobox"]`)
    )
    this.TextArea_NoteText = new Element(global.page, this.parent.locator('textarea[name="notes"]'))
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

  async Validate() {
    // Validate Canceled By listbox is in an invalid state and that the error is..
    let canceledByFieldIsValidated = false
    canceledByFieldIsValidated =
      (await this.parent.locator(`form > div > div > div:nth-child(3)`).textContent()) ==
      ValidationStrings.Required
    return canceledByFieldIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
