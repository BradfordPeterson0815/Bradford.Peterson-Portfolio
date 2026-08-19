import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../clientPortalConstants.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { FetchValueByKey } from '../clientPortalHelper.js'
import { KeyValue } from '../clientPortalKeyValue.js'
import { Vendor } from '../clientPortalVendor.js'
import { ClientPortalBase } from '../pages/clientPortalBase.js'

export class ClientPortalCreateVendorDrawer extends ClientPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly Button_CopyVendorName: Element
  readonly Button_CopyDisplayEmail: Element
  readonly Button_CopyDisplayPhone: Element
  readonly Button_AddAdditionalProperty: Element
  readonly CheckBox_VendorEnabled: Element
  readonly TextBox_VendorName: Element
  readonly TextBox_InternalVendorName: Element
  readonly TextBox_DisplayEmail: Element
  readonly TextBox_NotificationEmail: Element
  readonly TextBox_DisplayPhone: Element
  readonly TextBox_NotificationPhone: Element
  readonly TextBox_Website: Element
  readonly TextBox_Capacity_ClaimAssignment: Element
  readonly TextBox_Capacity_MitigationAssignment: Element

  readonly parent: Locator

  constructor(global: ClientPortalGlobal, isUpdateMode = false) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = isUpdateMode
      ? DrawerStrings.CreateVendor_Title_Update
      : DrawerStrings.CreateVendor_Title_Create
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(
      global.page,
      this.parent
        .locator('div.chakra-modal__footer')
        .getByRole('button', { name: `${DrawerStrings.Button_Close}` })
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.locator('#vendorForm-submit'),
      DrawerStrings.Button_Submit
    )
    this.Button_CopyVendorName = new Element(
      global.page,
      this.parent.locator('#vendorattributes_button_copyvendorname'),
      DrawerStrings.CreateVendor_Button_CopyVendorName
    )
    this.Button_CopyDisplayEmail = new Element(
      global.page,
      this.parent.locator('#vendorattributes_button_copydisplayemail'),
      DrawerStrings.CreateVendor_Button_CopyDisplayEmail
    )
    this.Button_CopyDisplayPhone = new Element(
      global.page,
      this.parent.locator('#vendorattributes_button_copydisplayphone'),
      DrawerStrings.CreateVendor_Button_CopyDisplayPhone
    )
    this.Button_AddAdditionalProperty = new Element(
      global.page,
      this.parent.locator('#vendorattributes_additionalproperties-add-row')
    )
    this.CheckBox_VendorEnabled = new Element(
      global.page,
      this.parent.locator(`input[name="enabled"]`).locator('..').first()
    )
    this.TextBox_VendorName = new Element(global.page, this.parent.locator('#name'))
    this.TextBox_InternalVendorName = new Element(global.page, this.parent.locator('#internalName'))
    this.TextBox_DisplayEmail = new Element(global.page, this.parent.locator('#displayEmail'))
    this.TextBox_NotificationEmail = new Element(
      global.page,
      this.parent.locator('#notificationEmail')
    )
    this.TextBox_DisplayPhone = new Element(global.page, this.parent.locator('#displayPhone'))
    this.TextBox_NotificationPhone = new Element(
      global.page,
      this.parent.locator('#notificationPhone')
    )
    this.TextBox_Website = new Element(global.page, this.parent.locator('#website'))
    this.TextBox_Capacity_ClaimAssignment = new Element(
      global.page,
      this.parent.getByLabel('Claim Assignment Capacity')
    )
    this.TextBox_Capacity_MitigationAssignment = new Element(
      global.page,
      this.parent.getByLabel('Mitigation Assignment Capacity')
    )
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }

  async RemovePropertyByIndex(index: number) {
    const buttonLocator = this.parent.locator(
      `#vendorattributes_additionalproperties-row-${index}-remove-row`
    )
    await buttonLocator.click()
  }

  async ValidateBasic() {
    // Validate the Vendor name field is in an error state and that the error is..
    let vendorNameIsValidated = false
    const vendorNameValidator = this.page.locator('#vendorattributes_input_vendorname-feedback')
    if ((await vendorNameValidator.count()) > 0) {
      const validationText = await vendorNameValidator.textContent()
      vendorNameIsValidated = validationText == ValidationStrings.FieldRequired
    }

    // Validate the Vendor internal name field is in an error state and that the error is..
    let vendorInternalNameIsValidated = false
    const vendorInternalNameValidator = this.page.locator(
      '#vendorattributes_input_internalvendorname-feedback'
    )
    if ((await vendorInternalNameValidator.count()) > 0) {
      const validationText = await vendorInternalNameValidator.textContent()
      vendorInternalNameIsValidated = validationText == ValidationStrings.FieldRequired
    }

    // Validate the Vendor display email field is in an error state and that the error is..
    let vendorDisplayEmailIsValidated = false
    const vendorDisplayEmailValidator = this.page.locator(
      '#vendorattributes_input_displayemail-feedback'
    )
    if ((await vendorDisplayEmailValidator.count()) > 0) {
      const validationText = await vendorDisplayEmailValidator.textContent()
      vendorDisplayEmailIsValidated = validationText == ValidationStrings.InvalidEmail
    }

    // Validate the Vendor notification email field is in an error state and that the error is..
    let vendorNotificationEmailIsValidated = false
    const vendorNotifcationEmailValidator = this.page.locator(
      '#vendorattributes_input_notificationemail-feedback'
    )
    if ((await vendorNotifcationEmailValidator.count()) > 0) {
      const validationText = await vendorNotifcationEmailValidator.textContent()
      vendorNotificationEmailIsValidated = validationText == ValidationStrings.InvalidEmail
    }

    // Validate the Vendor display phone field is in an error state and that the error is..
    let vendorDisplayPhoneIsValidated = false
    const vendorDisplayPhoneValidator = this.page.locator(
      '#vendorattributes_input_displayphone-feedback'
    )
    if ((await vendorDisplayPhoneValidator.count()) > 0) {
      const validationText = await vendorDisplayPhoneValidator.textContent()
      vendorDisplayPhoneIsValidated = validationText == ValidationStrings.FieldRequired
    }

    // Validate the Vendor notification phone field is in an error state and that the error is..
    let vendorNotificationPhoneIsValidated = false
    const vendorNotifcationPhoneValidator = this.page.locator(
      '#vendorattributes_input_notificationphone-feedback'
    )
    if ((await vendorNotifcationPhoneValidator.count()) > 0) {
      const validationText = await vendorNotifcationPhoneValidator.textContent()
      vendorNotificationPhoneIsValidated = validationText == ValidationStrings.FieldRequired
    }

    // Validate the Vendor website field is in an error state and that the error is..
    let vendorWebsiteValidated = false
    const vendorWebsiteValidator = this.page.locator('#vendorattributes_input_website-feedback')
    if ((await vendorWebsiteValidator.count()) > 0) {
      const validationText = await vendorWebsiteValidator.textContent()
      vendorWebsiteValidated = validationText == ValidationStrings.FieldRequired
    }

    return (
      vendorNameIsValidated &&
      vendorInternalNameIsValidated &&
      vendorDisplayEmailIsValidated &&
      vendorNotificationEmailIsValidated &&
      vendorDisplayPhoneIsValidated &&
      vendorNotificationPhoneIsValidated &&
      vendorWebsiteValidated
    )
  }

  async ValidateAdditionalProperties() {
    // Validate the first Additional Property Key field is in an error state and that the error is..
    let firstKeyFieldValidated = false
    const firstKeyFieldValidator = this.page.locator(
      '#vendorattributes_additionalproperties-row-0 #vendorattributes_label_property_key_-feedback'
    )
    if ((await firstKeyFieldValidator.count()) > 0) {
      const validationText = await firstKeyFieldValidator.textContent()
      firstKeyFieldValidated = validationText == ValidationStrings.Required
    }

    // Validate the first Additional Property Value field is in an error state and that the error is..
    let firstValueFieldValidated = false
    const firstValueFieldValidator = this.page.locator(
      '#vendorattributes_input_property_value_0-feedback'
    )
    if ((await firstValueFieldValidator.count()) > 0) {
      const validationText = await firstValueFieldValidator.textContent()
      firstValueFieldValidated = validationText == ValidationStrings.FieldRequired
    }

    return firstKeyFieldValidated && firstValueFieldValidated
  }

  async AddAdditionalProperty(keyValue: KeyValue, index: number) {
    await this.Button_AddAdditionalProperty.locator.focus()
    await this.page.waitForTimeout(1000)
    await this.Button_AddAdditionalProperty.locator.click({ force: true })
    await this.page.waitForTimeout(1000)
    const keyLocator = this.page.locator(
      `#vendorattributes_additionalproperties-row-${index} #vendorattributes_label_property_key_`
    )
    await keyLocator.focus()
    await keyLocator.clear()
    await this.page.keyboard.type(keyValue.key, { delay: 50 })
    await this.page.keyboard.press('Tab')
    const valueLocator = this.page.locator(`#additionalProperties\\.${index}\\.value`)
    await valueLocator.focus()
    await valueLocator.clear()
    await this.page.keyboard.type(keyValue.value.toString(), { delay: 50 })
    await this.page.keyboard.press('Tab')
    await valueLocator.fill(keyValue.value.toString())
  }

  async AddAdditionalProperties(additionalProperties: KeyValue[]) {
    // remove any existing properties
    const currentPropertyCount = await this.parent
      .locator('button[aria-label="Remove Row"]')
      .count()
    let runningCount = currentPropertyCount
    if (currentPropertyCount > 0) {
      do {
        const removePropertyLocator = this.parent.locator(`button[aria-label="Remove Row"]`).nth(0)
        await removePropertyLocator.click()
        await this.page.waitForTimeout(1000)
        runningCount = await this.parent.locator('button[aria-label="Remove Row"]').count()
      } while (runningCount > 0)
    }
    let index = 0
    for (const additionalProperty of additionalProperties) {
      await this.AddAdditionalProperty(additionalProperty, index)
      index++
    }
  }

  async FillDrawer(vendorToFill: Vendor, useCopy = false) {
    await this.TextBox_VendorName.Fill(vendorToFill.name)
    await this.TextBox_DisplayEmail.Fill(vendorToFill.displayEmail)
    await this.TextBox_DisplayPhone.Fill(vendorToFill.displayPhone)
    if (useCopy) {
      await this.Button_CopyVendorName.Click()
      await this.Button_CopyDisplayEmail.Click()
      await this.Button_CopyDisplayPhone.Click()
    } else {
      await this.TextBox_InternalVendorName.Fill(vendorToFill.internalName)
      await this.TextBox_NotificationEmail.Fill(vendorToFill.notificationEmail)
      await this.TextBox_NotificationPhone.Fill(vendorToFill.notificationPhone)
    }
    await this.TextBox_Website.Fill(vendorToFill.website)
    if (vendorToFill.enabled != null) {
      await this.CheckBox_VendorEnabled.SetChecked(vendorToFill.enabled)
    }
    // if this not available, skip it
    const capacityCardLocator = this.parent.locator('#card_vendor_capacity')
    if ((await capacityCardLocator.count()) > 0) {
      const claimAssignmentCapacity = FetchValueByKey(vendorToFill.capacities, 'Claim Assignment')
      const mitigationAssignmentCapacity = FetchValueByKey(
        vendorToFill.capacities,
        'Mitigation Assignment'
      )
      await this.TextBox_Capacity_ClaimAssignment.Fill(
        claimAssignmentCapacity ? claimAssignmentCapacity.toString() : '0'
      )
      await this.TextBox_Capacity_MitigationAssignment.Fill(
        mitigationAssignmentCapacity ? mitigationAssignmentCapacity.toString() : '0'
      )
    }
    await this.AddAdditionalProperties(vendorToFill.additionalProperties)
    await this.Button_Submit.Click()
    await this.page.waitForTimeout(2000)
  }
}
