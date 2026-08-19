import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalUpdateClaimDrawer extends ClaimsPortalBase {
  readonly parent: Locator
  readonly Title: Element
  readonly Button_Close: Element
  readonly Button_Close_X: Element
  readonly Button_Submit: Element
  readonly TextBox_CATCode: Element
  readonly ListBox_LossType: Element
  readonly ListBox_Severity: Element
  readonly TextArea_LossDescription: Element
  readonly ListBox_ClaimFactors: Element
  readonly TextBox_AddressLine1: Element
  readonly TextBox_AddressLine2: Element
  readonly TextBox_AddressLine3: Element
  readonly TextBox_City: Element
  readonly ListBox_State: Element
  readonly TextBox_ZipOrPostalCode: Element
  readonly TextBox_CountyOrParishCode: Element
  readonly ListBox_Country: Element
  readonly ListBox_InitialClaimActions: Element
  readonly footer: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.UpdateClaim_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.footer = this.parent.locator(`div[class*="chakra-modal__footer"]`).nth(0)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label="Close"]`).first()
    )
    this.Button_Close = new Element(global.page, this.footer.getByText('Close', { exact: true }))
    this.Button_Submit = new Element(global.page, this.page.locator('#updateClaimForm-submit'))
    this.TextBox_CATCode = new Element(global.page, this.parent.locator(`input[name="catCode"]`))
    this.ListBox_LossType = new Element(
      global.page,
      this.parent.locator(`input[role="combobox"]`).nth(0)
    )
    this.ListBox_Severity = new Element(global.page, this.parent.locator(`select[name="severity"]`))
    this.TextArea_LossDescription = new Element(
      global.page,
      this.parent.locator('textarea[name="lossDescription"]')
    )
    this.ListBox_ClaimFactors = new Element(
      global.page,
      this.parent.locator(`input[role="combobox"]`).nth(1)
    )
    this.TextBox_AddressLine1 = new Element(
      global.page,
      this.parent.locator(`input[name="lossAddress.addressLine1"]`)
    )
    this.TextBox_AddressLine2 = new Element(
      global.page,
      this.parent.locator(`input[name="lossAddress.addressLine2"]`)
    )
    this.TextBox_AddressLine3 = new Element(
      global.page,
      this.parent.locator(`input[name="lossAddress.addressLine3"]`)
    )
    this.TextBox_City = new Element(
      global.page,
      this.parent.locator(`input[name="lossAddress.city"]`)
    )
    this.ListBox_State = new Element(
      global.page,
      this.parent.locator(`select[name="lossAddress.stateOrProvince"]`)
    )
    this.TextBox_ZipOrPostalCode = new Element(
      global.page,
      this.parent.locator(`input[name="lossAddress.zipOrPostalCode"]`)
    )
    this.TextBox_CountyOrParishCode = new Element(
      global.page,
      this.parent.locator(`input[name="lossAddress.countyOrParishCode"]`)
    )
    this.ListBox_Country = new Element(
      global.page,
      this.parent.locator(`select[name="lossAddress.country"]`)
    )
    this.ListBox_InitialClaimActions = new Element(
      global.page,
      this.parent.locator(`input[role="combobox"]`).nth(2)
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Validate() {
    // // Validate Type Of Communication List is in an invalid state and that the error is..
    // let typeOfCommunicationListIsValidated = false
    // if ((await this.ListBox_TypeOfCommunication.locator.getAttribute('aria-invalid')) == 'true') {
    //   const referenceId = await this.ListBox_TypeOfCommunication.locator.getAttribute('aria-describedby')
    //   const validationText = await this.parent.locator(`div[id='${referenceId}']`).textContent()
    //   typeOfCommunicationListIsValidated = validationText == DrawerStrings.RecordCustomerCommunication_TypeOfCommunication_InvalidValue
    // }
    // return typeOfCommunicationListIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
