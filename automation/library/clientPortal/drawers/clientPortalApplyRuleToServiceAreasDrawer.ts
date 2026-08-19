import { ClientPortalBase } from '../pages/clientPortalBase.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings } from '../clientPortalConstants.js'
import { Locator } from '@playwright/test'
import { ServiceArea } from '../clientPortalServiceArea.js'

interface ParsedServiceArea {
  name: string
  state: string
}

export class ClientPortalApplyRuleToServiceAreasDrawer extends ClientPortalBase {
  readonly Title: Element
  readonly Label_SelectServiceAreasDescription: Element
  readonly Checkbox_ServiceArea: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly parent: Locator
  ServiceAreas: ParsedServiceArea[]

  constructor(global: ClientPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.ApplyRuleToServiceAreas_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(
      global.page,
      this.parent.locator('#drawer_updatevendorserviceareas_close')
    )
    this.Button_Submit = new Element(
      global.page,
      this.page.locator('#updateVendorServiceAreaForm-submit'),
      DrawerStrings.Button_Submit
    )
    this.Label_SelectServiceAreasDescription = new Element(
      global.page,
      this.parent.locator('#updateVendorServiceAreaForm div.chakra-alert__desc'),
      DrawerStrings.ApplyRuleToServiceAreas_Label_SelectServiceAreasDescription
    )
    this.Checkbox_ServiceArea = new Element(
      global.page,
      this.page.locator('#drawer_updatevendorserviceareas_checkbox_allserviceareas').locator('..'),
      DrawerStrings.ApplyRuleToServiceAreas_Checkbox_ServiceArea
    )
    this.ServiceAreas = []
  }

  async SelectAllServiceAreas() {
    await this.page
      .locator('#updateVendorServiceAreaForm div[role="group"] > div > label')
      .nth(0)
      .setChecked(true)
  }

  async SetServiceAreaCheckboxByIndex(index: number, checked: boolean) {
    const inputLocator = this.page
      .locator('#updateVendorServiceAreaForm div[role="group"] > div > label')
      .nth(index + 1)
      .locator('input')
    await inputLocator.setChecked(checked, { force: true })
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }

  async LoadServiceAreas() {
    const checkboxLocator = this.page.locator(
      '#updateVendorServiceAreaForm div[role="group"] > div > label'
    )
    const serviceAreaCount = (await checkboxLocator.count()) - 1
    this.ServiceAreas = []
    if (serviceAreaCount > 0) {
      for (let index = 0; index < serviceAreaCount; index++) {
        const name = await checkboxLocator.nth(index + 1).getAttribute('data-name')
        const state = await checkboxLocator.nth(index + 1).getAttribute('data-state')
        this.ServiceAreas.push({ name: name ? name : '', state: state ? state : '' })
      }
    }
  }

  async FindMatchingServiceArea(serviceAreaToMatch: ServiceArea, forceReload = false) {
    // load service areas list if it is empty or if we are forcing a load
    if (this.ServiceAreas.length == 0 || forceReload) {
      await this.LoadServiceAreas()
    }
    const currentServiceAreasLength = this.ServiceAreas.length
    if (currentServiceAreasLength > 0) {
      for (let index = currentServiceAreasLength - 1; index >= 0; index--) {
        if (
          this.ServiceAreas[index].name === serviceAreaToMatch.name &&
          this.ServiceAreas[index].state === serviceAreaToMatch.state
        ) {
          return index
        }
      }
    }
    return null
  }

  async FindAndSelectServiceArea(serviceAreaToFind: ServiceArea) {
    const index = await this.FindMatchingServiceArea(serviceAreaToFind)
    if (index != null) {
      await this.SetServiceAreaCheckboxByIndex(index, true)
      return true
    }
    return false
  }
}
