import { Locator } from 'playwright/test'
import { PricingTabTypes } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'
import { ClaimsPortalPricingRegionsTab } from '../tabs/claimsPortalPricingRegionsTab.js'
import { ClaimsPortalPricingVendorRatesTab } from '../tabs/claimsPortalPricingVendorRatesTab.js'

export class ClaimsPortalPricingPage extends ClaimsPortalBasePage {
  readonly baseURL: string

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.baseURL = `${global.baseUrl}pricing/`
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.page.goto(this.baseURL)
    } else {
      await this.leftNavBar.GoHome()
      await this.leftNavBar.Button_Admin.Click()
      await this.page.waitForLoadState()
      await this.leftNavBar.Button_Admin_Pricing.Click()
      await this.page.waitForLoadState()
    }
  }

  async IsTabActive(pricingTab: PricingTabTypes) {
    await this.page.waitForTimeout(1000)
    const targetId = this.LookupPricingTabId(pricingTab)
    const result = (await this.page.locator(targetId).getAttribute('aria-selected')) == 'true'
    return result
  }

  LookupPricingTabId(pricingTab: PricingTabTypes) {
    const baseTabLocator = 'data-id="/pricing/_permissions/_dashboards'
    switch (pricingTab) {
      case PricingTabTypes.VendorRates:
        return `a[${baseTabLocator}/vendors"]`
      case PricingTabTypes.Regions:
        return `a[${baseTabLocator}/regions"]`

      default:
        throw new Error(`Undefined Pricing Tab type : ${pricingTab}`)
    }
  }

  async SelectPricingTab(pricingTab: PricingTabTypes) {
    const targetId = this.LookupPricingTabId(pricingTab)
    let tabToReturn
    let locatorToWaitFor: Locator
    await this.page.locator(targetId).click()
    switch (pricingTab) {
      case PricingTabTypes.VendorRates:
        tabToReturn = new ClaimsPortalPricingVendorRatesTab(this.global)
        locatorToWaitFor = tabToReturn.DataTable_PricingVendorRates.Button_ExpandTable.locator
        break
      case PricingTabTypes.Regions:
        tabToReturn = new ClaimsPortalPricingRegionsTab(this.global)
        locatorToWaitFor = tabToReturn.DataTable_PricingRegions.Button_ExpandTable.locator
        break

      default:
        throw new Error(`Undefined Pricing Tab type : ${pricingTab}`)
    }
    await locatorToWaitFor.waitFor({ state: 'visible' })
    await tabToReturn.CustomLoad()
    return tabToReturn
  }
}
