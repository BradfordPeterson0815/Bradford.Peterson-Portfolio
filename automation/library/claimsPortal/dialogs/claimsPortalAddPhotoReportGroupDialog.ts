import { Locator } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { AddPhotoReportGroupDialogStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalAddPhotoReportGroupDialog extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly parent: Locator
  readonly Label_Position: Element
  readonly Label_Label: Element
  readonly radioButton_Start: Locator
  readonly radioButton_End: Locator
  readonly ComboBox_Label: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator(`section[id*='chakra-modal']`)
    this.Title = new Element(
      global.page,
      this.parent.locator(`header`),
      AddPhotoReportGroupDialogStrings.Title
    )
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )

    this.Label_Position = new Element(
      global.page,
      this.parent.locator(`label[for="position"]`),
      AddPhotoReportGroupDialogStrings.Label_Position
    )

    this.radioButton_Start = this.parent
      .locator(`#updateDocumentLabelForm div[role="radiogroup"]`)
      .nth(0)
      .locator('label')
      .nth(0)

    this.radioButton_End = this.parent
      .locator(`#updateDocumentLabelForm div[role="radiogroup"]`)
      .nth(0)
      .locator('label')
      .nth(1)

    this.Label_Label = new Element(
      global.page,
      this.parent.locator(`label[for="label"]`),
      AddPhotoReportGroupDialogStrings.Label_Label
    )

    this.ComboBox_Label = new Element(
      global.page,
      this.parent.locator('input[role="combobox"]').nth(0)
    )
    this.Button_Close = new Element(
      global.page,
      this.parent.locator(`div.chakra-modal__footer button:nth-child(1)`)
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.locator(`#updateDocumentLabelForm-submit`)
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async SetLabelValue(label: string) {
    await this.ComboBox_Label.locator.click()
    await this.ComboBox_Label.locator.fill(label)
    await this.ComboBox_Label.locator.press('Enter')
  }

  async ValidateWhenEmpty() {
    let positionIsValidated = false
    let labelIsValidated = false

    // Validate position radio buttons are in an invalid state and that the error is..
    positionIsValidated =
      (await this.parent.locator(`form div[id*="field"]`).nth(0).textContent()) ==
      ValidationStrings.InvalidEnumLabelPosition

    // Validate label combo box is in an invalid state and that the error is..
    labelIsValidated =
      (await this.parent.locator(`form div[id*="field"]`).nth(1).textContent()) ==
      ValidationStrings.Required

    return positionIsValidated && labelIsValidated
  }

  async ValidateDuplicateLabel() {
    // Validate dialog is in an invalid state and that the error is..
    let dialogIsValidated = false
    dialogIsValidated =
      (await this.parent
        .locator(`#updateDocumentLabelForm div[data-status="warning"]`)
        .nth(0)
        .textContent()) == ValidationStrings.DuplicateLabel
    return dialogIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
