import { Locator } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { HomePageStrings } from '../clientPortalConstants.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { ClientPortalBasePage } from './clientPortalBasePage.js'

export class ClientPortalHomePage extends ClientPortalBasePage {
  readonly Title: Element
  readonly Label_Vendors: Element
  readonly Badge_Vendors: Element
  readonly Link_GoToVendors: Element
  readonly Label_Vendors_Description: Element
  readonly Label_ServiceAreas: Element
  readonly Badge_ServiceAreas: Element
  readonly Link_GoToServiceAreas: Element
  readonly Label_ServiceAreas_Description: Element
  readonly Label_GlobalRules: Element
  readonly Badge_GlobalRules: Element
  readonly Link_GoToRules: Element
  readonly Label_GlobalRules_Description: Element
  readonly Label_IncompleteFNOLs: Element
  readonly Badge_IncompleteFNOLs: Element
  readonly Link_GoToIncompleteFNOLs: Element
  readonly Label_IncompleteFNOLs_Description: Element
  readonly Label_WeatherEvents: Element
  readonly Badge_WeatherEvents: Element
  readonly Link_GoToWeatherEvents: Element
  readonly Label_WeatherEvents_Description: Element
  readonly vendorsParent: Locator
  readonly serviceAreasParent: Locator
  readonly globalRulesParent: Locator
  readonly incompleteFNOLsParent: Locator
  readonly weatherEventsParent: Locator

  constructor(global: ClientPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${HomePageStrings.Title}` }),
      HomePageStrings.Title
    )
    this.URL = global.baseUrl
    this.vendorsParent = this.page.locator('#root div.chakra-card').nth(0)
    this.serviceAreasParent = this.page.locator('#root div.chakra-card').nth(1)
    this.globalRulesParent = this.page.locator('#root div.chakra-card').nth(2)
    this.incompleteFNOLsParent = this.page.locator('#root div.chakra-card').nth(3)
    this.weatherEventsParent = this.page.locator('#root div.chakra-card').nth(4)

    this.Label_Vendors = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${HomePageStrings.Vendors}` }),
      HomePageStrings.Vendors
    )
    this.Badge_Vendors = new Element(
      global.page,
      this.vendorsParent.locator('div >div > div > span').nth(0)
    )
    this.Link_GoToVendors = new Element(
      global.page,
      this.page.getByRole('link', { name: `${HomePageStrings.GotoVendors}` }),
      HomePageStrings.GotoVendors
    )
    this.Label_Vendors_Description = new Element(
      global.page,
      this.vendorsParent.locator('> div.chakra-card__body > div > p'),
      HomePageStrings.Vendors_Description
    )

    this.Label_ServiceAreas = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${HomePageStrings.ServiceAreas}` }),
      HomePageStrings.ServiceAreas
    )
    this.Badge_ServiceAreas = new Element(
      global.page,
      this.serviceAreasParent.locator('div >div > div > span').nth(1)
    )
    this.Link_GoToServiceAreas = new Element(
      global.page,
      this.page.getByRole('link', { name: `${HomePageStrings.GotoServiceAreas}` }),
      HomePageStrings.GotoServiceAreas
    )
    this.Label_ServiceAreas_Description = new Element(
      global.page,
      this.serviceAreasParent.locator('> div.chakra-card__body > div > p'),
      HomePageStrings.ServiceAreas_Description
    )

    this.Label_GlobalRules = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${HomePageStrings.GlobalRules}` }),
      HomePageStrings.GlobalRules
    )
    this.Badge_GlobalRules = new Element(
      global.page,
      this.globalRulesParent.locator('div >div > div > span').nth(2)
    )
    this.Link_GoToRules = new Element(
      global.page,
      this.page.getByRole('link', { name: `${HomePageStrings.GotoRules}` }),
      HomePageStrings.GotoRules
    )
    this.Label_GlobalRules_Description = new Element(
      global.page,
      this.globalRulesParent.locator('> div.chakra-card__body > div > p'),
      HomePageStrings.GlobalRules_Description
    )

    this.Label_IncompleteFNOLs = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${HomePageStrings.IncompleteFNOLs}` }),
      HomePageStrings.IncompleteFNOLs
    )
    this.Badge_IncompleteFNOLs = new Element(
      global.page,
      this.incompleteFNOLsParent.locator('div >div > div > span').nth(2)
    )
    this.Link_GoToIncompleteFNOLs = new Element(
      global.page,
      this.page.getByRole('link', { name: `${HomePageStrings.GotoIncompleteFNOLs}` }),
      HomePageStrings.GotoIncompleteFNOLs
    )
    this.Label_IncompleteFNOLs_Description = new Element(
      global.page,
      this.incompleteFNOLsParent.locator('> div.chakra-card__body > div > p'),
      HomePageStrings.IncompleteFNOLs_Description
    )

    this.Label_WeatherEvents = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${HomePageStrings.WeatherEvents}` }),
      HomePageStrings.WeatherEvents
    )
    this.Badge_WeatherEvents = new Element(
      global.page,
      this.incompleteFNOLsParent.locator('div >div > div > span').nth(2)
    )
    this.Link_GoToWeatherEvents = new Element(
      global.page,
      this.page.getByRole('link', { name: `${HomePageStrings.GotoWeatherEvents}` }),
      HomePageStrings.GotoWeatherEvents
    )
    this.Label_WeatherEvents_Description = new Element(
      global.page,
      this.weatherEventsParent.locator('> div.chakra-card__body > div > p'),
      HomePageStrings.WeatherEvents_Description
    )
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.NavigateDirectly(this.global.baseUrl)
    } else {
      await this.leftNavBar.GoHome()
    }
    await this.page.waitForLoadState()
    await this.page.waitForTimeout(5000)
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async WaitForLoad() {
    await this.page.waitForLoadState()
    await this.Label_ServiceAreas.locator.waitFor({ state: 'visible' })
  }

  async NoVendorsAndNoServiceAreas() {
    const noVendors = await this.NoVendors()
    const noServiceAreas = await this.NoVendors()
    return noVendors && noServiceAreas
  }

  async NoVendors() {
    await this.page.waitForTimeout(1000)
    await this.Badge_Vendors.locator.waitFor({ state: 'attached' })
    let numberOfVendors = await this.Badge_Vendors.GetText()
    if(numberOfVendors === '0') {
      // give a little extra time
      await this.page.waitForTimeout(5000)
      numberOfVendors = await this.Badge_Vendors.GetText()
    }
    return numberOfVendors == '0'
  }

  async NoServiceAreas() {
    await this.Badge_ServiceAreas.locator.waitFor({ state: 'attached' })
    let numberOfServiceAreas = await this.Badge_ServiceAreas.GetText()
    if(numberOfServiceAreas === '0') {
      numberOfServiceAreas = await this.Badge_ServiceAreas.GetText()
    }
    return numberOfServiceAreas == '0'
  }

  async NoGlobalRules() {
    await this.Badge_GlobalRules.locator.waitFor({ state: 'attached' })
    let numberOfGlobalRules = await this.Badge_GlobalRules.GetText()
    if(numberOfGlobalRules === '0') {
      numberOfGlobalRules = await this.Badge_GlobalRules.GetText()
    }
    return numberOfGlobalRules == '0'
  }

  async NoIncompleteFNOLs() {
    await this.Badge_IncompleteFNOLs.locator.waitFor({ state: 'attached' })
    let numberOfIncompleteFNOLs = await this.Badge_IncompleteFNOLs.GetText()
    if(numberOfIncompleteFNOLs === '0') {
      numberOfIncompleteFNOLs = await this.Badge_IncompleteFNOLs.GetText()
    }
    return numberOfIncompleteFNOLs == '0'
  }

  async NoWeatherEvents() {
    await this.Badge_WeatherEvents.locator.waitFor({ state: 'attached' })
    const numberOfWeatherEvents = await this.Badge_WeatherEvents.GetText()
    return numberOfWeatherEvents == '0'
  }
}
