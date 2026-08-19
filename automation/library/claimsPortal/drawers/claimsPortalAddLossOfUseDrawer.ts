import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalAddLossOfUseDrawer extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close: Element
  readonly Button_Close_X: Element
  readonly Button_Submit: Element
  readonly TextBox_RequestedDate: Element
  readonly TextBox_DurationInDays: Element
  readonly Listbox_Type: Element
  readonly TextBox_AmountRequested: Element
  readonly TextArea_Description: Element
  readonly Button_AddRow: Locator
  readonly parent: Locator

  constructor(global: ClaimsPortalGlobal, __isUpdateMode = false) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    this.Title = new Element(
      global.page,
      this.parent.getByText(DrawerStrings.AddLossOfUseDrawer_Title),
      DrawerStrings.AddLossOfUseDrawer_Title
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
    this.TextBox_RequestedDate = new Element(
      global.page,
      this.parent.locator('input[id="requestedDate"]')
    )
    this.TextBox_DurationInDays = new Element(
      global.page,
      this.parent.locator('input[id="durationInDays"]')
    )
    this.Listbox_Type = new Element(global.page, this.parent.locator('select[id="type"]'))
    this.TextBox_AmountRequested = new Element(
      global.page,
      this.parent.locator('input[id="amountRequested"]')
    )
    this.TextArea_Description = new Element(
      global.page,
      this.parent.locator('textarea[id="description"]')
    )
    this.Button_AddRow = this.parent.locator(`button[aria-label="Add Row"]`)
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Validate() {
    let requestedDateIsValidated = false
    let durationFieldIsValidated = false
    let typeFieldIsValidated = false
    let amountRequestedFieldIsValidated = false

    // Validate Requested Date Field is in an invalid state and that the error is..
    if ((await this.TextBox_RequestedDate.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_RequestedDate.locator.getAttribute('aria-describedby')
      // "Invalid Date"
      requestedDateIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidDate
    }

    const referenceIdDurationInDays =
      await this.TextBox_DurationInDays.locator.getAttribute('aria-describedby')
    // "Number must be greater than or equal to 1"
    durationFieldIsValidated =
      (await this.page.locator(`div[id='${referenceIdDurationInDays}']`).textContent()) ==
      ValidationStrings.InvalidNumber1OrMore

    // Validate Type Field is in an invalid state and that the error is..
    if ((await this.Listbox_Type.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.Listbox_Type.locator.getAttribute('aria-describedby')
      // "Invalid value. Expected: Housing, Food, Transportation, Storage, Laundry & Cleaning, Pet Boarding, or Other."
      typeFieldIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidLossOfUseType
    }

    const referenceIdAmountRequested =
      await this.TextBox_AmountRequested.locator.getAttribute('aria-describedby')
    // "Number must be greater than or equal to 1"
    amountRequestedFieldIsValidated =
      (await this.page.locator(`div[id='${referenceIdAmountRequested}']`).textContent()) ==
      ValidationStrings.InvalidNumber1OrMore

    return (
      requestedDateIsValidated &&
      durationFieldIsValidated &&
      typeFieldIsValidated &&
      amountRequestedFieldIsValidated
    )
  }

  async ValidateAddRow() {
    let documentFieldIsValidated = false
    let receiptDateReceivedIsValidated = false

    // Validate Document Field is in an invalid state and that the error is..
    // "Required"
    documentFieldIsValidated =
      (await this.parent.locator(`form div[id*="field"]`).nth(4).textContent()) ==
      ValidationStrings.Required

    // Validate Document Field is in an invalid state and that the error is..
    const receiptDateLocator = this.parent.locator('input[id="receipts.0.receiptDateReceived"]')
    if ((await receiptDateLocator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await receiptDateLocator.getAttribute('aria-describedby')
      // "Invalid Date"
      receiptDateReceivedIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidDate
    }

    return documentFieldIsValidated && receiptDateReceivedIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }

  async GetDocumentListLocatorByRow(rowIndex: number) {
    const theLocator = this.parent
      .locator(`label[for="receipts.${rowIndex}.document"]`)
      .locator('..')
      .locator('input[role="combobox"]')
    return theLocator
  }

  async GetReceiptDateReceivedLocatorByRow(rowIndex: number) {
    const theLocator = this.parent.locator(`input[id="receipts.${rowIndex}.receiptDateReceived"]`)
    return theLocator
  }

  async GetRefetchDocumentsLocatorByRow(rowIndex: number) {
    const theLocator = this.parent
      .getByLabel(DrawerStrings.AddLossOfUseReceipt_Button_RefetchDocuments)
      .nth(rowIndex)
    return theLocator
  }

  async GetUploadDocumentLocatorByRow(rowIndex: number) {
    const theLocator = this.parent
      .getByLabel(DrawerStrings.AddLossOfUseReceipt_Link_UploadDocuments)
      .nth(rowIndex)
    return theLocator
  }

  async GetRemoveRowLocatorByRow(rowIndex: number) {
    const theLocator = this.parent
      .getByLabel(DrawerStrings.AddLossOfUseDrawer_Button_RemoveRow)
      .nth(rowIndex)
    return theLocator
  }
}
