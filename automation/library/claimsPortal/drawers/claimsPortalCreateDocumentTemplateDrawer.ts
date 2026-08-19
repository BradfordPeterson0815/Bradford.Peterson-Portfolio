import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { Locator } from '@playwright/test'

export class ClaimsPortalCreateDocumentTemplateDrawer extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Cancel: Element
  readonly Button_Submit: Element
  readonly Button_SelectFile: Element
  readonly TextBox_Name: Element
  readonly listboxCarrierLocator: Locator
  readonly inputLocator: string
  readonly parent: Locator
  readonly header: Locator
  readonly body: Locator
  readonly footer: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"][data-slot="sheet-content"]')
    this.header = this.parent.locator('[data-slot="sheet-header"]')
    this.body = this.parent.locator('[data-slot="sheet-body"]')
    this.footer = this.parent.locator('[data-slot="sheet-footer"]')
    this.Button_Close_X = new Element(
      global.page,
      this.parent.getByRole('button', { name: DrawerStrings.Button_Close })
    )
    this.Title = new Element(
      global.page,
      this.header.getByText(DrawerStrings.DocumentTemplate_Title_Create),
      DrawerStrings.DocumentTemplate_Title_Create
    )
    this.TextBox_Name = new Element(global.page, this.body.locator('input[name="name"]'))
    this.listboxCarrierLocator = this.body.locator(`input[role="combobox"]`)
    this.inputLocator = 'input[name="document"][type="file"]'
    this.Button_SelectFile = new Element(
      global.page,
      this.body.getByRole('button', { name: DrawerStrings.DocumentTemplate_Button_SelectFile })
    )
    this.Button_Cancel = new Element(
      global.page,
      this.footer.getByRole('button', { name: DrawerStrings.Button_Cancel })
    )
    this.Button_Submit = new Element(
      global.page,
      this.footer.getByRole('button', { name: DrawerStrings.Button_Submit })
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async FillAndSubmit(templateName: string, carrier: string, documentFile: string) {
    await this.TextBox_Name.Fill(templateName)
    await this.SetCarrierValue(carrier)
    // set upload document file
    const fullPathToFile = this.global.uploadFolder + '//' + documentFile
    await this.SetDocumentUpload(fullPathToFile)
    await this.Button_Submit.Click()
    await this.Title.locator.waitFor({ state: 'detached' })
  }

  async SetCarrierValue(carrierValue: string) {
    await this.listboxCarrierLocator.click()
    await this.listboxCarrierLocator.fill(carrierValue)
    await this.listboxCarrierLocator.press('Enter')
  }

  async ValidateEmptyName() {
    // Validate Name field is in an invalid state and that the error is..
    let nameFieldIsValidated = false

    if ((await this.TextBox_Name.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_Name.locator.getAttribute('aria-describedby')
      if (referenceId != null) {
        nameFieldIsValidated =
          (await this.body.locator(`div[id='${referenceId}']`).textContent()) ==
          ValidationStrings.Required // "Required"
      }
    }
    return nameFieldIsValidated
  }

  async ValidateNameNoCarrierNoDocument() {
    // Validate Carrier and Document File fields are in an invalid state and that the error is..
    let carrierFieldIsValidated = false
    let documentFileFieldIsValidated = false

    carrierFieldIsValidated =
      (await this.body
        .locator(' div[role="group"]')
        .nth(1)
        .locator(`div[data-slot="field-error"]`)
        .textContent()) == ValidationStrings.Required

    documentFileFieldIsValidated =
      (await this.body
        .locator(' div[role="group"]')
        .nth(2)
        .locator(`div[data-slot="field-error"]`)
        .textContent()) == ValidationStrings.Required

    return carrierFieldIsValidated && documentFileFieldIsValidated
  }

  async ValidateNameEditedAndEmpty() {
    // Validate Name field is in an invalid state and that the error is..
    let nameFieldIsValidated = false
    if ((await this.TextBox_Name.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_Name.locator.getAttribute('aria-describedby')
      if (referenceId != null) {
        nameFieldIsValidated =
          (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
          ValidationStrings.InvalidString1 // "String must contain at least 1 character(s)"
      }
    }
    return nameFieldIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }

  async SetDocumentUpload(fullPathToFile: string, wait: number = 500) {
    await this.page.setInputFiles(this.inputLocator, [fullPathToFile])
    await this.page.waitForTimeout(wait)
  }
}
