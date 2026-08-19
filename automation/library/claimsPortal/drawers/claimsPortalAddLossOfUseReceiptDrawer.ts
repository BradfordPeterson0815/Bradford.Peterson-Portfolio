import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalAddLossOfUseReceiptDrawer extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close: Element
  readonly Button_Close_X: Element
  readonly Button_Submit: Element
  readonly Button_RefetchDocuments: Element
  readonly Link_UploadDocuments: Element
  readonly Listbox_Document: Element
  readonly TextArea_Notes: Element
  readonly parent: Locator

  constructor(global: ClaimsPortalGlobal, __isUpdateMode = false) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    this.Title = new Element(
      global.page,
      this.parent.getByText(DrawerStrings.AddLossOfUseReceipt_Title),
      DrawerStrings.AddLossOfUseReceipt_Title
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
    this.Listbox_Document = new Element(global.page, this.parent.locator(`input[role="combobox"]`))
    this.Button_RefetchDocuments = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.AddLossOfUseReceipt_Button_RefetchDocuments)
    )
    this.Link_UploadDocuments = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.AddLossOfUseReceipt_Link_UploadDocuments)
    )
    this.TextArea_Notes = new Element(global.page, this.parent.locator('textarea[id="note"]'))
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Validate() {
    let documentFieldIsValidated = false

    // Validate Document Field is in an invalid state and that the error is..
    // "Required"
    documentFieldIsValidated =
      (await this.parent.locator(`form div[id*="field"]`).first().textContent()) ==
      ValidationStrings.Required

    return documentFieldIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
