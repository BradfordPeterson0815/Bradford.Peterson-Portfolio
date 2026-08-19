import { Element } from '../../shared/element.js'
import { CreateClaimPageStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'

export class ClaimsPortalCreateClaimPage extends ClaimsPortalBasePage {
  readonly Title: Element
  readonly Button_Submit: Element
  readonly Label_ClaimDetails_Title: Element
  readonly Textbox_CarrierClaimNumber: Element
  readonly Textbox_PolicyNumber: Element
  readonly ListBox_Carrier: Element
  readonly ListBox_ClaimFactors: Element
  readonly Button_ClearSelection: Element

  readonly Label_LossDetails_Title: Element
  readonly Textbox_DateOfLoss: Element
  readonly Textbox_DateReceived: Element
  readonly Textbox_CatCode: Element
  readonly ListBox_LossType: Element
  readonly ListBox_Severity: Element
  readonly TextArea_LossDescription: Element

  readonly Label_LossLocation_Title: Element
  readonly Textbox_AddressLine1: Element
  readonly Textbox_AddressLine2: Element
  readonly Textbox_AddressLine3: Element
  readonly Textbox_City: Element
  readonly ListBox_State: Element
  readonly Textbox_Zip: Element
  readonly Textbox_County: Element
  readonly ListBox_Country: Element

  readonly Label_Actions_Title: Element
  readonly ListBox_InitialClaimActions: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: CreateClaimPageStrings.Title }),
      CreateClaimPageStrings.Title
    )
    this.URL = `${global.baseUrl}claims/create`
    this.Button_Submit = new Element(
      global.page,
      this.page.getByRole('button', { name: CreateClaimPageStrings.Button_Submit }),
      CreateClaimPageStrings.Button_Submit
    )

    this.Label_ClaimDetails_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(0),
      'Claim Details'
    )

    this.Textbox_CarrierClaimNumber = new Element(
      global.page,
      this.page.locator('input[id="carrierClaimNumber"]')
    )

    this.Textbox_PolicyNumber = new Element(
      global.page,
      this.page.locator('input[id="policyNumber"]')
    )

    this.ListBox_Carrier = new Element(
      global.page,
      this.page.locator(`input[role="combobox"]`).nth(0)
    )

    this.ListBox_ClaimFactors = new Element(
      global.page,
      this.page.locator(`input[role="combobox"]`).nth(1)
    )

    this.Button_ClearSelection = new Element(
      global.page,
      this.page.locator('#root div[role="button"][aria-label="Clear selected options"]')
    )

    this.Label_LossDetails_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(1),
      'Loss Details'
    )

    this.Textbox_DateOfLoss = new Element(global.page, this.page.locator('input[id="dateOfLoss"]'))

    this.Textbox_DateReceived = new Element(
      global.page,
      this.page.locator('input[id="dateReceived"]')
    )

    this.Textbox_CatCode = new Element(
      global.page,
      this.page.locator('input[id="lossDetails.catCode"]')
    )

    this.ListBox_LossType = new Element(
      global.page,
      this.page.locator(`input[role="combobox"]`).nth(2)
    )

    this.ListBox_Severity = new Element(
      global.page,
      this.page.locator('select[id="lossDetails.severity"]')
    )

    this.TextArea_LossDescription = new Element(
      global.page,
      this.page.locator('textarea[id="lossDetails.lossDescription"]')
    )

    this.Label_LossLocation_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(2),
      'Loss Location'
    )

    this.Textbox_AddressLine1 = new Element(
      global.page,
      this.page.locator('input[id="lossAddress.addressLine1"]')
    )

    this.Textbox_AddressLine2 = new Element(
      global.page,
      this.page.locator('input[id="lossAddress.addressLine2"]')
    )

    this.Textbox_AddressLine3 = new Element(
      global.page,
      this.page.locator('input[id="lossAddress.addressLine3"]')
    )

    this.Textbox_City = new Element(global.page, this.page.locator('input[id="lossAddress.city"]'))

    this.ListBox_State = new Element(
      global.page,
      this.page.locator('select[id="lossAddress.stateOrProvince"]')
    )

    this.Textbox_Zip = new Element(
      global.page,
      this.page.locator('input[id="lossAddress.zipOrPostalCode"]')
    )

    this.Textbox_County = new Element(
      global.page,
      this.page.locator('input[id="lossAddress.countyOrParishCode"]')
    )

    this.ListBox_Country = new Element(
      global.page,
      this.page.locator('select[id="lossAddress.country"]')
    )

    this.Label_Actions_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(3),
      'Actions'
    )

    this.ListBox_InitialClaimActions = new Element(
      global.page,
      this.page.locator(`input[role="combobox"]`).nth(3)
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async SelectCarrier(carrierValue: string) {
    await this.ListBox_Carrier.locator.click()
    await this.ListBox_Carrier.locator.fill(carrierValue)
    await this.ListBox_Carrier.locator.press('Enter')
  }

  async AddClaimFactorToSelection(claimFactorToSelect: string) {
    await this.ListBox_ClaimFactors.Click()
    const optionLocator = this.page.getByRole('option', { name: `${claimFactorToSelect}` }).first()
    await optionLocator.click()
    await this.page.waitForTimeout(1000)
  }

  async RemoveSelectedClaimFactor(claimFactorToRemove: string) {
    const selectedClaimFactorLocator = this.page.locator(
      `div[aria-label="Remove ${claimFactorToRemove}"]`
    )
    await selectedClaimFactorLocator.click()
  }

  async IsClaimFactorRemoveable(claimFactorToCheck: string) {
    const selectedClaimFactorLocator = this.page.locator(
      `div[aria-label="Remove ${claimFactorToCheck}"]`
    )
    const selectedAlready = await selectedClaimFactorLocator.count()
    return selectedAlready > 0
  }

  async IsClaimFactorSelectable(claimFactorToCheck: string) {
    await this.ListBox_ClaimFactors.Click()
    const optionLocator = this.page.getByRole('option', { name: `${claimFactorToCheck}` }).first()
    const inTheList = await optionLocator.count()
    return inTheList > 0
  }

  async ClearClaimFactorsSelection() {
    if (await this.Button_ClearSelection.IsVisible()) {
      await this.Button_ClearSelection.Click()
    }
  }

  async AddClaimActionToSelection(claimActionToSelect: string) {
    await this.ListBox_InitialClaimActions.Click()
    const optionLocator = this.page.getByRole('option', { name: `${claimActionToSelect}` }).first()
    await optionLocator.click()
    await this.page.waitForTimeout(1000)
  }

  async RemoveSelectedClaimAction(claimActionToRemove: string) {
    const selectedClaimActionLocator = this.page.locator(
      `div[aria-label="Remove ${claimActionToRemove}"]`
    )
    await selectedClaimActionLocator.click()
  }

  async IsClaimActionRemoveable(claimActionToCheck: string) {
    const selectedClaimActionLocator = this.page.locator(
      `div[aria-label="Remove ${claimActionToCheck}"]`
    )
    const selectedAlready = await selectedClaimActionLocator.count()
    return selectedAlready > 0
  }

  async IsClaimActionSelectable(claimActionToCheck: string) {
    await this.ListBox_InitialClaimActions.Click()
    const optionLocator = this.page.getByRole('option', { name: `${claimActionToCheck}` }).first()
    const inTheList = await optionLocator.count()
    return inTheList > 0
  }

  async ClearClaimActionsSelection() {
    if (await this.Button_ClearSelection.IsVisible()) {
      await this.Button_ClearSelection.Click()
    }
  }

  async ValidateClaimDetails() {
    let policyNumberFieldIsValidated = false
    let carrierFieldIsValidated = false

    // Validate Policy Number Field is in an invalid state and that the error is..
    if ((await this.Textbox_PolicyNumber.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.Textbox_PolicyNumber.locator.getAttribute('aria-describedby')
      // "First name must be at least 1 character"
      policyNumberFieldIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.FieldRequired
    }

    // Validate Carrier Field is in an invalid state and that the error is..
    carrierFieldIsValidated = false
    const carrierFieldValidator = this.page
      .locator('div[role="group"][data-invalid]')
      .nth(1)
      .locator('> div')
      .nth(1)
    const validationText = await carrierFieldValidator.textContent()
    carrierFieldIsValidated = validationText == ValidationStrings.Required

    return policyNumberFieldIsValidated && carrierFieldIsValidated
  }

  async ValidateLossDetails() {
    let dateOfLossFieldIsValidated = false
    let dateReceivedIsValidated = false

    // Validate Date Of Loss Field is in an invalid state and that the error is..
    if ((await this.Textbox_DateOfLoss.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.Textbox_DateOfLoss.locator.getAttribute('aria-describedby')
      // "Invalid Date"
      dateOfLossFieldIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidDate
    }

    // Validate Date Received Field is in an invalid state and that the error is..
    if ((await this.Textbox_DateReceived.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.Textbox_DateReceived.locator.getAttribute('aria-describedby')
      // "Invalid Date"
      dateReceivedIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidDate
    }

    return dateOfLossFieldIsValidated && dateReceivedIsValidated
  }

  async ValidateLossLocation() {
    let addressLine1FieldIsValidated = false
    let cityFieldIsValidated = false
    let stateFieldIsValidated = false
    let zipFieldIsValidated = false

    // Validate Address Line 1 Field is in an invalid state and that the error is..
    if ((await this.Textbox_AddressLine1.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.Textbox_AddressLine1.locator.getAttribute('aria-describedby')
      // "This field is required"
      addressLine1FieldIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.FieldRequired
    }

    // Validate City Field is in an invalid state and that the error is..
    if ((await this.Textbox_City.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.Textbox_City.locator.getAttribute('aria-describedby')
      // "This field is required"
      cityFieldIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.FieldRequired
    }

    // Validate State Field is in an invalid state and that the error is..
    if ((await this.ListBox_State.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.ListBox_State.locator.getAttribute('aria-describedby')
      // "This field is required"
      stateFieldIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.FieldRequired
    }

    // Validate Zip Field is in an invalid state and that the error is..
    if ((await this.Textbox_Zip.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.Textbox_Zip.locator.getAttribute('aria-describedby')
      // "Zip code must be 5 characters"
      zipFieldIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidZipCodeAlternate
    }
    return (
      addressLine1FieldIsValidated &&
      cityFieldIsValidated &&
      stateFieldIsValidated &&
      zipFieldIsValidated
    )
  }

  async ValidateDatesTooNew() {
    let dateOfLossFieldIsValidated = false
    let dateReceivedIsValidated = false

    // Validate Date Of Loss Field is in an invalid state and that the error is..
    if ((await this.Textbox_DateOfLoss.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.Textbox_DateOfLoss.locator.getAttribute('aria-describedby')
      // "Date must be smaller than or equal to "
      const dateOfLossActualError = await this.page
        .locator(`div[id='${referenceId}']`)
        .textContent()
      dateOfLossFieldIsValidated = dateOfLossActualError?.startsWith(ValidationStrings.DateTooNew)
        ? true
        : false
    }

    // Validate Date Received Field is in an invalid state and that the error is..
    if ((await this.Textbox_DateReceived.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.Textbox_DateReceived.locator.getAttribute('aria-describedby')
      // "Date must be smaller than or equal to "
      const dateReceivedActualError = await this.page
        .locator(`div[id='${referenceId}']`)
        .textContent()
      dateReceivedIsValidated = dateReceivedActualError?.startsWith(ValidationStrings.DateTooNew)
        ? true
        : false
    }

    return dateOfLossFieldIsValidated && dateReceivedIsValidated
  }

  async ValidateDateReceivedAfterDateOfLoss() {
    let dateReceivedIsValidated = false

    // Validate Date Received Field is in an invalid state and that the error is..
    if ((await this.Textbox_DateReceived.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.Textbox_DateReceived.locator.getAttribute('aria-describedby')
      // "Date Received has to be after Date of Loss"
      dateReceivedIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.DateReceivedMustBeAfterDateOfLoss
    }

    return dateReceivedIsValidated
  }

  async ValidateZipCharacterCount() {
    let zipIsValidated = false

    // Validate Zip Field is in an invalid state and that the error is..
    if ((await this.Textbox_Zip.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.Textbox_Zip.locator.getAttribute('aria-describedby')
      // "Zip code must be 5 characters"
      zipIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidZipCodeAlternate
    }

    return zipIsValidated
  }

  async ValidateZipCharacterContent() {
    let zipIsValidated = false

    // Validate Zip Field is in an invalid state and that the error is..
    if ((await this.Textbox_Zip.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.Textbox_Zip.locator.getAttribute('aria-describedby')
      // "Zip code must only be numbers"
      zipIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidZipCodeNumbersOnly
    }

    return zipIsValidated
  }
}
