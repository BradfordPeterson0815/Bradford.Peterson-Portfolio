import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import {
  DailyJobServiceTypes,
  DrawerStrings,
  EmergencyServiceJobServiceTypes,
  ValidationStrings,
} from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalCreateJobDrawer extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly Button_PrefillLossLocationFromClaim: Element
  readonly ListBox_JobType: Locator
  readonly ListBox_AddressType: Locator
  readonly ListBox_State: Locator
  readonly ComboBox_Claim_Select: Locator
  readonly TextArea_Description: Element
  readonly TextBox_AddressLine1: Element
  readonly TextBox_AddressLine2: Element
  readonly TextBox_AddressLine3: Element
  readonly TextBox_City: Element
  readonly TextBox_ZipCode: Element
  readonly TextBox_County: Element
  readonly ListBox_Country: Locator
  readonly parent: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.CreateJob_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(global.page, this.parent.getByLabel(DrawerStrings.Button_Close))
    this.Button_PrefillLossLocationFromClaim = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.CreateJob_Button_PrefillLossLocation)
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )

    this.ComboBox_Claim_Select = this.page.locator('#jobForm input[role="combobox"]')
    this.ListBox_JobType = this.page.locator(`#jobForm select[name="jobType"]`)
    this.ListBox_AddressType = this.page.locator(`#jobForm select[name="addressType"]`)
    this.TextArea_Description = new Element(
      global.page,
      this.parent.locator('textarea[name="jobDescription"]')
    )
    this.TextBox_AddressLine1 = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.CreateJob_TextBox_AddressLine1)
    )
    this.TextBox_AddressLine2 = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.CreateJob_TextBox_AddressLine2)
    )
    this.TextBox_AddressLine3 = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.CreateJob_TextBox_AddressLine3)
    )
    this.TextBox_City = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.CreateJob_TextBox_City)
    )
    this.ListBox_State = this.page.locator(`#jobForm select[name="stateOrProvince"]`)
    this.TextBox_ZipCode = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.CreateJob_TextBox_ZipCode)
    )
    this.TextBox_County = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.CreateJob_TextBox_County)
    )
    this.ListBox_Country = this.page.locator(`#jobForm select[name="country"]`)
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async SelectEmergencyServiceJobServiceType(
    serviceType: EmergencyServiceJobServiceTypes,
    checked: boolean = true
  ) {
    let checkboxLocator: Locator
    switch (serviceType) {
      case EmergencyServiceJobServiceTypes.Tarping:
        checkboxLocator = this.page
          .locator('div[name="services"] input[value="tarping"]')
          .locator('..')
        break
      case EmergencyServiceJobServiceTypes.WaterMitigation:
        checkboxLocator = this.page
          .locator('div[name="services"] input[value="waterMitigation"]')
          .locator('..')
        break
      case EmergencyServiceJobServiceTypes.BoardUp:
        checkboxLocator = this.page
          .locator('div[name="services"] input[value="boardUp"]')
          .locator('..')
        break
      default:
        throw new Error(`No EmergencyServiceJob Service Type has been defined for: ${serviceType} `)
    }
    await checkboxLocator.setChecked(checked)
  }

  async SelectDailyJobServiceType(serviceType: DailyJobServiceTypes, checked: boolean = true) {
    let checkboxLocator: Locator
    switch (serviceType) {
      case DailyJobServiceTypes.Interior:
        checkboxLocator = this.page
          .locator('div[name="services"] input[value="interior"]')
          .locator('..')
        break
      case DailyJobServiceTypes.Exterior:
        checkboxLocator = this.page
          .locator('div[name="services"] input[value="exterior"]')
          .locator('..')
        break
      case DailyJobServiceTypes.Roof:
        checkboxLocator = this.page
          .locator('div[name="services"] input[value="roof"]')
          .locator('..')
        break
      case DailyJobServiceTypes.DetachedStructures:
        checkboxLocator = this.page
          .locator('div[name="services"] input[value="detachedStructures"]')
          .locator('..')
        break
      default:
        throw new Error(`No EmergencyServiceJob Service Type has been defined for: ${serviceType} `)
    }
    await checkboxLocator.setChecked(checked)
  }

  async Validate() {
    // Validate various fields are in an invalid state and that the errors are..
    let descriptionFieldIsValidated = false
    // let addressTypeFieldIsValidated = false
    let addressLine1FieldIsValidated = false
    let cityFieldIsValidated = false
    let stateFieldIsValidated = false
    let zipCodeFieldIsValidated = false

    if ((await this.TextArea_Description.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextArea_Description.locator.getAttribute('aria-describedby')
      // "String must contain at least 2 character(s)"
      descriptionFieldIsValidated =
        (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidString2
    }
    // if ((await this.ListBox_AddressType.getAttribute('aria-invalid')) == 'true') {
    //   const referenceId = await this.ListBox_AddressType.getAttribute('aria-describedby')
    //   // "Invalid enum....."
    //   addressTypeFieldIsValidated =
    //     (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
    //     ValidationStrings.InvalidAddressType
    // }
    if ((await this.TextBox_AddressLine1.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_AddressLine1.locator.getAttribute('aria-describedby')
      // "String must contain at least 2 character(s)"
      addressLine1FieldIsValidated =
        (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidString2
    }
    if ((await this.TextBox_City.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_City.locator.getAttribute('aria-describedby')
      // "String must contain at least 2 character(s)"
      cityFieldIsValidated =
        (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidString2
    }
    if ((await this.ListBox_State.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.ListBox_State.getAttribute('aria-describedby')
      // "String must contain at least 2 character(s)"
      stateFieldIsValidated =
        (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidString2
    }
    if ((await this.TextBox_ZipCode.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_ZipCode.locator.getAttribute('aria-describedby')
      // "String must contain exactly 5 character(s)"
      zipCodeFieldIsValidated =
        (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidZipCode
    }
    return (
      descriptionFieldIsValidated &&
      addressLine1FieldIsValidated &&
      cityFieldIsValidated &&
      stateFieldIsValidated &&
      zipCodeFieldIsValidated
    )
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
