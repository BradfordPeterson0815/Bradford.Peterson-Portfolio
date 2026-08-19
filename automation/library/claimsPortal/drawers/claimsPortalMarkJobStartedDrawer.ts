import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalMarkJobStartedDrawer extends ClaimsPortalBase {
  readonly parent: Locator
  readonly footer: Locator
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly TextBox_StartedDate: Element
  readonly TextArea_NoteText: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    this.footer = this.parent.locator(`div[class*="chakra-modal__footer"]`)
    this.Title = new Element(
      global.page,
      this.parent.getByText(DrawerStrings.MarkJobStarted_Title),
      DrawerStrings.MarkJobStarted_Title
    )
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label="Close"]`).first()
    )
    this.TextBox_StartedDate = new Element(global.page, this.parent.locator('#startedDate'))
    this.TextArea_NoteText = new Element(
      global.page,
      this.parent.locator('textarea[name="startedNotes"]')
    )
    this.Button_Close = new Element(
      global.page,
      this.footer.getByText(DrawerStrings.Button_Close, { exact: true })
    )
    this.Button_Submit = new Element(global.page, this.footer.locator('#jobStartedForm-submit'))
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Validate() {
    // Validate Started Date is in an invalid state and that the error is..
    let startedDateIsValidated = false
    if ((await this.TextBox_StartedDate.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_StartedDate.locator.getAttribute('aria-describedby')
      const validationText = await this.parent.locator(`div[id*='${referenceId}']`).textContent()
      startedDateIsValidated = validationText == ValidationStrings.InvalidString1
    }
    return startedDateIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
