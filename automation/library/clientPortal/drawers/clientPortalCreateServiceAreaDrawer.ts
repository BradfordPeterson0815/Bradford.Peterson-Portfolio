import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../clientPortalConstants.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { ClientPortalBase } from '../pages/clientPortalBase.js'

import { ClientPortalLocation } from '../clientPortalLocation.js'
import { ServiceArea } from '../clientPortalServiceArea.js'
import { ClientPortalSelectCountiesDrawer } from './clientPortalSelectCountiesDrawer.js'

export class ClientPortalCreateServiceAreaDrawer extends ClientPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly TextBox_ServiceAreaName: Element
  readonly CheckBox_AreaEnabled: Element
  readonly Button_AddCounties: Element
  readonly Button_UpdateCounties: Element
  readonly Button_RemoveAllCounties: Element
  readonly color: Locator
  readonly parent: Locator
  isUpdateMode: boolean

  constructor(global: ClientPortalGlobal, isUpdateMode = false) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    this.isUpdateMode = isUpdateMode
    const titleText = isUpdateMode
      ? DrawerStrings.CreateServiceArea_Title_Update
      : DrawerStrings.CreateServiceArea_Title_Create
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(
      global.page,
      this.parent.locator('#drawer_servicearea_create_close'),
      DrawerStrings.Button_Close
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.locator('#serviceAreaForm-submit'),
      DrawerStrings.Button_Submit
    )
    this.Button_AddCounties = new Element(
      global.page,
      this.parent.locator('#drawer_servicearea_button_addcounty'),
      DrawerStrings.CreateServiceArea_Button_AddCounties
    )
    this.Button_UpdateCounties = new Element(
      global.page,
      this.parent.locator('#drawer_servicearea_button_addcounty'),
      DrawerStrings.CreateServiceArea_Button_UpdateCounties
    )
    this.Button_RemoveAllCounties = new Element(
      global.page,
      this.parent.locator('#drawer_servicearea_button_removeallcounties'),
      DrawerStrings.CreateServiceArea_Button_RemoveAllCounties
    )
    this.CheckBox_AreaEnabled = new Element(
      global.page,
      this.parent.locator(`input[name="areaEnabled"]`).locator('..')
    )
    this.TextBox_ServiceAreaName = new Element(global.page, this.parent.locator('#areaName'))
    this.color = this.parent.locator('#shapeColor')
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }

  async Validate() {
    // Validate the Service Area name field is in an error state and that the error is..
    let serviceAreaNameIsValidated = false
    const serviceAreaNameValidator = this.page.locator(
      '#drawer_servicearea_input_serviceareaname-feedback'
    )
    if ((await serviceAreaNameValidator.count()) > 0) {
      const validationText = await serviceAreaNameValidator.textContent()
      serviceAreaNameIsValidated = validationText == ValidationStrings.IncludeServiceAreaName
    }

    // Validate the Counties count is in an error state and that the error is..
    let countiesCountIsValidated = false
    const countiesCountValidator = this.page.locator(
      '#drawer_servicearea_error_requiredfield_counties'
    )
    if ((await countiesCountValidator.count()) > 0) {
      const validationText = await countiesCountValidator.textContent()
      countiesCountIsValidated = validationText == ValidationStrings.Required
    }

    return serviceAreaNameIsValidated && countiesCountIsValidated
  }

  async SelectStateByLabel(state: string) {
    const stateLocator = this.parent.locator('#state')
    await stateLocator.selectOption({ label: state })
  }

  async SetColor(hexColor: string) {
    await this.color.click()
    await this.page.waitForTimeout(500)
    await this.page.keyboard.press('Shift+Tab')
    await this.page.waitForTimeout(500)
    await this.page.keyboard.press('ArrowUp')
    await this.page.waitForTimeout(500)
    await this.page.keyboard.press('Shift+Tab')
    await this.page.keyboard.type(hexColor)
    await this.page.waitForTimeout(500)
    await this.page.keyboard.press('Enter')
    await this.page.waitForTimeout(500)
  }

  async OpenSelectCountiesDrawer() {
    if (this.isUpdateMode) {
      await this.Button_UpdateCounties.Click()
    } else {
      await this.Button_AddCounties.Click()
    }
    const selectCountiesDrawer = new ClientPortalSelectCountiesDrawer(this.global)
    return selectCountiesDrawer
  }

  async FillDrawer(serviceAreaToFill: ServiceArea) {
    await this.TextBox_ServiceAreaName.Fill(serviceAreaToFill.name)
    await this.CheckBox_AreaEnabled.SetChecked(serviceAreaToFill.enabled)
    if (serviceAreaToFill.color != '') {
      await this.SetColor(serviceAreaToFill.color)
    }
    await this.SelectStateByLabel(serviceAreaToFill.state)
    if (serviceAreaToFill.stateToAdd != null && serviceAreaToFill.stateToAdd.length > 0) {
      if (this.isUpdateMode) {
        await this.Button_RemoveAllCounties.Click()
      }
      await this.AddState(serviceAreaToFill.stateToAdd)
      await this.page.waitForTimeout(2000)
    }
    if (serviceAreaToFill.countiesToAdd != null && serviceAreaToFill.countiesToAdd.length > 0) {
      if (this.isUpdateMode) {
        await this.Button_RemoveAllCounties.Click()
      }
      await this.AddCounties(serviceAreaToFill.countiesToAdd)
      await this.page.waitForTimeout(1000)
    }
    await this.Button_Submit.Click()
    await this.page.waitForTimeout(1000)
  }

  async AddCounties(countyLocations: ClientPortalLocation[]) {
    let counter = 0
    const selectCountiesDrawer = await this.OpenSelectCountiesDrawer()
    for (const countyLocation of countyLocations) {
      await this.page.waitForTimeout(2000)
      if (counter == 0) {
        await selectCountiesDrawer.ExposeAndCenterCounty(countyLocation)
        counter++
      }
      await selectCountiesDrawer.ClickOnCounty(countyLocation)
      await this.page.waitForTimeout(1000)
    }
    await selectCountiesDrawer.Button_Save.Click()
  }

  async AddState(stateLocation: ClientPortalLocation[]) {
    const selectCountiesDrawer = await this.OpenSelectCountiesDrawer()
    await this.page.waitForTimeout(4000)
    await selectCountiesDrawer.ClickOnState(stateLocation[0])
    await this.page.waitForTimeout(1000)
    await selectCountiesDrawer.Button_Save.Click()
  }
}
