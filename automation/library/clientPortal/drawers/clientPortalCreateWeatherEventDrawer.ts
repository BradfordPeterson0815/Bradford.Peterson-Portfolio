import { ClientPortalBase } from '../pages/clientPortalBase.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../clientPortalConstants.js'
import { Locator } from '@playwright/test'
import { ClientPortalWeatherEvent } from '../clientPortalWeatherEvent.js'
import { ClientPortalSelectCountiesDrawer } from './clientPortalSelectCountiesDrawer.js'
import { ClientPortalLocation } from '../clientPortalLocation.js'

export class ClientPortalCreateWeatherEventDrawer extends ClientPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly TextBox_EventName: Element
  readonly TextBox_CATCode: Element
  readonly TextBox_LossType: Element
  readonly DateTime_EffectiveStartDate: Element
  readonly DateTime_EffectiveEndDate: Element
  readonly Button_AddAffectedLocation: Element
  readonly Button_RemoveAllLocations: Element
  readonly parent: Locator
  isUpdateMode: boolean

  constructor(global: ClientPortalGlobal, isUpdateMode = false) {
    super(global)
    this.isUpdateMode = isUpdateMode
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = isUpdateMode
      ? DrawerStrings.CreateWeatherEvent_Title_Update
      : DrawerStrings.CreateWeatherEvent_Title_Create
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
      this.parent.locator('#weatherEventForm-submit'),
      DrawerStrings.Button_Submit
    )
    this.TextBox_EventName = new Element(global.page, this.parent.locator('#eventName'))
    this.TextBox_CATCode = new Element(global.page, this.parent.locator('#catCode'))
    this.TextBox_LossType = new Element(global.page, this.parent.locator('#lossType'))
    this.DateTime_EffectiveStartDate = new Element(
      global.page,
      this.parent.locator(`input[name="effectiveStartDate"]`)
    )
    this.DateTime_EffectiveEndDate = new Element(
      global.page,
      this.parent.locator(`input[name="effectiveEndDate"]`)
    )
    this.Button_AddAffectedLocation = new Element(
      global.page,
      this.parent.locator('#drawer_weatherevent_button_addaffectedlocation'),
      DrawerStrings.CreateWeatherEvent_Button_AddAffectedLocation
    )
    this.Button_RemoveAllLocations = new Element(
      global.page,
      this.parent.locator('#drawer_weatherevent_button_removealllocations'),
      DrawerStrings.CreateWeatherEvent_Button_RemoveAllLocations
    )
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Validate() {
    // Validate the county locations empty and that error is..
    let locationsAreValidated = false
    const locationValidator = this.page.locator('#drawer_weatherevent_error_requiredfield_counties')
    if ((await locationValidator.count()) > 0) {
      const validationText = await locationValidator.textContent()
      locationsAreValidated = validationText == ValidationStrings.AtLeastOneCountyShouldBeAdded
    }

    return locationsAreValidated
  }

  async FillDrawer(weatherEventToFill: ClientPortalWeatherEvent) {
    await this.TextBox_EventName.Fill(weatherEventToFill.name)
    await this.TextBox_CATCode.Fill(weatherEventToFill.catCode)
    await this.TextBox_LossType.Fill(weatherEventToFill.lossType)
    await this.DateTime_EffectiveStartDate.locator.focus()
    await this.page.keyboard.type(
      await this.DateEntryFormatting(new Date(weatherEventToFill.startDate))
    )
    await this.DateTime_EffectiveEndDate.locator.focus()
    await this.page.keyboard.type(
      await this.DateEntryFormatting(new Date(weatherEventToFill.endDate))
    )
    if (
      weatherEventToFill.affectedLocations != null &&
      weatherEventToFill.affectedLocations.length > 0
    ) {
      if (this.isUpdateMode) {
        await this.Button_RemoveAllLocations.Click()
      }
      await this.AddAffectedLocations(weatherEventToFill.affectedLocations)
      await this.page.waitForTimeout(1000)
    }
    await this.Button_Submit.Click()
    await this.page.waitForTimeout(2000)
  }

  async OpenSelectAffectedLocationsDrawer() {
    await this.Button_AddAffectedLocation.Click()
    const selectCountiesDrawer = new ClientPortalSelectCountiesDrawer(this.global)
    return selectCountiesDrawer
  }

  async AddAffectedLocations(affectedLocations: ClientPortalLocation[]) {
    let counter = 0
    const selectCountiesDrawer = await this.OpenSelectAffectedLocationsDrawer()
    for (const affectedLocation of affectedLocations) {
      await this.page.waitForTimeout(2000)
      if (counter == 0) {
        await selectCountiesDrawer.ExposeAndCenterCounty(affectedLocation)
        counter++
      }
      await selectCountiesDrawer.ClickOnCounty(affectedLocation)
      await this.page.waitForTimeout(1000)
    }
    await selectCountiesDrawer.Button_Save.Click()
  }

  async DateEntryFormatting(date: Date) {
    const padStart = (value: number): string => value.toString().padStart(2, '0')

    const dateString = `${padStart(date.getMonth() + 1)}${padStart(date.getDate())}${date.getFullYear()}`
    return dateString
  }
}
