import { DelegatePortalBase } from '../pages/delegatePortalBase.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../delegatePortalConstants.js'
import { Locator } from '@playwright/test'

export class DelegatePortalCompleteInspectionDrawer extends DelegatePortalBase {
  readonly parent: Locator
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly TextBox_CompletedDate: Element
  readonly ListBox_CompletedBy: Element
  readonly TextArea_NoteText: Element
  readonly CheckBox_PublicationTarget_Redacted1: Element

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.CompleteInspection_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='${DrawerStrings.Button_Close}']`)
    )
    this.TextBox_CompletedDate = new Element(global.page, this.parent.locator('#date'))
    this.ListBox_CompletedBy = new Element(
      global.page,
      this.parent.locator(`input[role="combobox"]`)
    )
    this.TextArea_NoteText = new Element(global.page, this.parent.locator('textarea[name="notes"]'))
    this.CheckBox_PublicationTarget_Redacted1 = new Element(
      global.page,
      this.parent.locator(`input[value="XactAnalysis"]`).locator('..')
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

  async IsRedacted1Available() {
    return (await this.CheckBox_PublicationTarget_Redacted1.locator.count()) < 0
  }

  async Validate() {
    // Validate Completed By listbox is in an invalid state and that the error is..
    let completedByFieldIsValidated = false
    completedByFieldIsValidated =
      (await this.parent.locator(`form > div > div > div:nth-child(3)`).first().textContent()) ==
      ValidationStrings.Required
    return completedByFieldIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
