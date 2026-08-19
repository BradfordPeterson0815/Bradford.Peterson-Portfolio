import { ClientPortalBase } from '../pages/clientPortalBase.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../clientPortalConstants.js'
import { Locator } from '@playwright/test'
import { Vendor } from '../clientPortalVendor.js'
import { ServiceArea } from '../clientPortalServiceArea.js'
import { KeyValue } from '../clientPortalKeyValue.js'

export class ClientPortalAttachVendorToServiceAreaDrawer extends ClientPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_CreateServiceArea: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly Button_AddAdditionalProperty: Element
  readonly parent: Locator
  private targetVendor: Vendor
  private targetServiceArea: ServiceArea | null

  constructor(global: ClientPortalGlobal, vendor: Vendor) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = `Add "${vendor.name}" Vendor to Service Area`
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_CreateServiceArea = new Element(
      global.page,
      this.page.locator(
        '#drawer_serviceareavendorcreation_serviceareaselection_button_createservicearea'
      ),
      DrawerStrings.AttachVendorToServiceArea_Button_CreateServiceArea
    )
    this.Button_Close = new Element(
      global.page,
      this.page.locator('#drawer_serviceareavendorcreation_close')
    )
    this.Button_Submit = new Element(
      global.page,
      this.page.locator('#createServiceAreaVendorForm-submit'),
      DrawerStrings.Button_Submit
    )
    this.Button_AddAdditionalProperty = new Element(
      global.page,
      this.parent.locator('#vendorattributes_additionalproperties-add-row')
    )
    this.targetVendor = vendor
    this.targetServiceArea = null
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }

  async Validate() {
    // Validate Select Service Area is in an invalid state and that the error is..
    let selectionFieldValidated = false
    const selectionFieldValidator = this.page.locator(
      '#drawer_serviceareavendorcreation_serviceareaselection_list_servicearea-feedback'
    )
    const validationText = await selectionFieldValidator.textContent()
    selectionFieldValidated = validationText == ValidationStrings.Required
    return selectionFieldValidated
  }

  async SelectServiceArea(serviceArea: ServiceArea) {
    await this.page.waitForTimeout(1000)
    const selectionLocator = this.parent.locator(
      '#drawer_serviceareavendorcreation_serviceareaselection_list_servicearea'
    )
    await selectionLocator.focus()
    await selectionLocator.clear()
    await this.page.keyboard.type(serviceArea.name, { delay: 20 })
    await this.page.keyboard.press('Tab')
    this.targetServiceArea = serviceArea
  }

  async SetStartDate(date: string) {
    const startDateLocator = this.parent.locator('#activeStartDate')
    await startDateLocator.fill(date)
  }

  async SetEndDate(date: string) {
    const endDateLocator = this.parent.locator('#activeEndDate')
    await endDateLocator.fill(date)
  }

  async FillOverrides(overrides: Vendor) {
    if (overrides.name != '') {
      await this.parent.locator('#name').fill(overrides.name)
    }
    if (overrides.internalName != '') {
      await this.parent.locator('#internalName').fill(overrides.internalName)
    }
    if (overrides.displayEmail != '') {
      await this.parent.locator('#displayEmail').fill(overrides.displayEmail)
    }
    if (overrides.notificationEmail != '') {
      await this.parent.locator('#notificationEmail').fill(overrides.notificationEmail)
    }
    if (overrides.displayPhone != '') {
      await this.parent.locator('#displayPhone').fill(overrides.displayPhone)
    }
    if (overrides.notificationPhone != '') {
      await this.parent.locator('#notificationPhone').fill(overrides.notificationPhone)
    }
    if (overrides.website != '') {
      await this.parent.locator('#website').fill(overrides.website)
    }
    if (overrides.enabled != null) {
      await this.parent.locator(`input[name="enabled"]`).locator('..').setChecked(overrides.enabled)
    }
    if (overrides.additionalProperties.length > 0) {
      await this.AddAdditionalProperties(overrides.additionalProperties)
    }
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
}
