import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'

export class ClaimsPortalEnterWorkDetailsForJobDrawer extends ClaimsPortalBasePage {
  readonly parent: Locator
  readonly footer: Locator
  readonly Title: Element
  readonly Button_Close: Element
  readonly Button_Close_X: Element
  readonly Button_Submit: Element
  readonly ListBox_TimeOfService: Element
  readonly ListBox_FastenerType: Element
  readonly ListBox_RoofPitch: Element
  readonly TextBox_ServiceDate: Element
  readonly Checkbox_IsMultiStory: Element
  readonly TextBox_TarpingSquareFeet: Element
  readonly ComboBox_PhotoReport: Element
  readonly Button_RefetchDocuments: Element
  readonly Link_UploadDocuments: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    this.footer = this.parent.locator(`div[class*="chakra-modal__footer"]`)
    this.Title = new Element(
      global.page,
      this.parent.getByText(DrawerStrings.AddJobWorkDetails_Title),
      DrawerStrings.AddJobWorkDetails_Title
    )
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label="Close"]`).first()
    )
    this.ListBox_TimeOfService = new Element(global.page, this.parent.locator('#timeOfService'))
    this.ListBox_FastenerType = new Element(global.page, this.parent.locator('#fastenerType'))
    this.ListBox_RoofPitch = new Element(global.page, this.parent.locator('#roofPitch'))
    this.TextBox_ServiceDate = new Element(
      global.page,
      this.parent.locator('input[id="serviceDate"]')
    )
    this.Checkbox_IsMultiStory = new Element(
      global.page,
      this.page.locator('#isMultiStory').locator('..'),
      DrawerStrings.AddJobWorkDetails_Checkbox_IsMultiStory
    )
    this.TextBox_TarpingSquareFeet = new Element(
      global.page,
      this.parent.locator('#tarpSquareFeet')
    )
    this.ComboBox_PhotoReport = new Element(
      global.page,
      this.parent.locator('input[role="combobox"]').nth(0)
    )
    this.Button_RefetchDocuments = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.AddJobWorkDetails_Button_RefetchDocuments)
    )
    this.Link_UploadDocuments = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.AddJobWorkDetails_Link_UploadDocuments)
    )
    this.Button_Close = new Element(
      global.page,
      this.footer.getByText(DrawerStrings.Button_Close, { exact: true })
    )
    this.Button_Submit = new Element(global.page, this.footer.locator('#workDetailsForm-submit'))
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Validate() {
    // Validate Record Work Detail fields are in an invalid state and that the errors are..
    let timeOfServiceIsValidated = false
    if ((await this.ListBox_TimeOfService.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.ListBox_TimeOfService.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      timeOfServiceIsValidated = validationText == ValidationStrings.InvalidEnumTimeOfService
    }

    let fastenerTypeFieldIsValidated = false
    if ((await this.ListBox_FastenerType.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.ListBox_FastenerType.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      fastenerTypeFieldIsValidated = validationText == ValidationStrings.InvalidEnumFastenerType
    }

    let roofPitchFieldIsValidated = false
    if ((await this.ListBox_RoofPitch.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.ListBox_RoofPitch.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      roofPitchFieldIsValidated = validationText == ValidationStrings.InvalidEnumRoofPitch
    }

    let serviceDateIsValidated = false
    if ((await this.TextBox_ServiceDate.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_ServiceDate.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      serviceDateIsValidated = validationText == ValidationStrings.InvalidDate
    }

    let tarpingSquareFootageFieldIsValidated = false
    if (
      (await this.TextBox_TarpingSquareFeet.locator
        .locator('..')
        .locator('..')
        .locator('..')
        .getAttribute('data-invalid')) != null
    ) {
      const referenceId =
        await this.TextBox_TarpingSquareFeet.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      tarpingSquareFootageFieldIsValidated =
        validationText == ValidationStrings.InvalidNumber1OrMore
    }

    const photoReportFieldIsValidated =
      (await this.parent.locator(`form div[id*="field"]`).last().textContent()) ==
      ValidationStrings.Required

    return (
      timeOfServiceIsValidated &&
      fastenerTypeFieldIsValidated &&
      roofPitchFieldIsValidated &&
      serviceDateIsValidated &&
      tarpingSquareFootageFieldIsValidated &&
      photoReportFieldIsValidated
    )
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
