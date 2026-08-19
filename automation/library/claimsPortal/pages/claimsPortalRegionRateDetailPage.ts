import { Locator } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { ClaimsPortalDeleteAlert } from '../alerts/claimsPortalDeleteAlert.js'
import { AlertStrings, RegionRatesDetailPage } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalRegionRate } from '../claimsPortalRegionRate.js'
import { ClaimsPortalRegionPricingDrawer } from '../drawers/claimsPortalRegionPricingDrawer.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'

export class ClaimsPortalRegionRateDetailPage extends ClaimsPortalBasePage {
  readonly regionRate: ClaimsPortalRegionRate
  readonly baseURL: string
  readonly Button_BackToRegions: Element
  readonly Title: Element
  readonly Label_Surtax: Element
  readonly Label_Surtax_Actual: Element
  readonly Label_BaseRates_Title: Element
  readonly Label_BaseRates_DuringBusinessHours: Element
  readonly Label_BaseRates_AfterBusinessHours: Element
  readonly Label_BaseRates_DuringBusinessHours_Actual: Element
  readonly Label_BaseRates_AfterBusinessHours_Actual: Element
  readonly Label_RoofPitchRates_Title: Element
  readonly Label_RoofPitchRates_HighRoofRate: Element
  readonly Label_RoofPitchRates_Under7_12: Element
  readonly Label_RoofPitchRates_7_12To9_12: Element
  readonly Label_RoofPitchRates_10_12To12_12: Element
  readonly Label_RoofPitchRates_Over12And12: Element
  readonly Label_RoofPitchRates_HighRoofRate_Actual: Element
  readonly Label_RoofPitchRates_Under7_12_Actual: Element
  readonly Label_RoofPitchRates_7_12To9_12_Actual: Element
  readonly Label_RoofPitchRates_10_12To12_12_Actual: Element
  readonly Label_RoofPitchRates_Over12And12_Actual: Element
  readonly Label_MechanicalTarpingRates_Title: Element
  readonly Label_MechanicalTarpingRates_DuringBusinessHours: Element
  readonly Label_MechanicalTarpingRates_AfterBusinessHours: Element
  readonly Label_MechanicalTarpingRates_MaterialCost: Element
  readonly Label_MechanicalTarpingRates_DuringBusinessHours_Actual: Element
  readonly Label_MechanicalTarpingRates_AfterBusinessHours_Actual: Element
  readonly Label_MechanicalTarpingRates_MaterialCost_Actual: Element
  readonly Label_SandbagTarpingRates_Title: Element
  readonly Label_SandbagTarpingRates_DuringBusinessHours: Element
  readonly Label_SandbagTarpingRates_AfterBusinessHours: Element
  readonly Label_SandbagTarpingRates_MaterialCost: Element
  readonly Label_SandbagTarpingRates_DuringBusinessHours_Actual: Element
  readonly Label_SandbagTarpingRates_AfterBusinessHours_Actual: Element
  readonly Label_SandbagTarpingRates_MaterialCost_Actual: Element
  readonly Button_EditRegion: Element
  readonly Button_RemoveRegion: Element
  readonly titleParent: Locator
  readonly parent: Locator

  constructor(global: ClaimsPortalGlobal, regionRate: ClaimsPortalRegionRate) {
    super(global)
    this.regionRate = regionRate
    this.titleParent = this.page.locator(
      'div.chakra-container div.chakra-card__header[id*="_title"]'
    )
    this.parent = this.page.locator('div.chakra-container div.chakra-stack[id*="container"]')
    this.baseURL = `${global.baseUrl}pricing/regions/corn:tarpulator:region:${regionRate.id}`
    this.Button_BackToRegions = new Element(
      global.page,
      this.page.locator('div.chakra-container > div > div > button').nth(0),
      RegionRatesDetailPage.Button_BackToRegion
    )
    this.Button_EditRegion = new Element(
      global.page,
      this.titleParent.locator('div > button').nth(1),
      RegionRatesDetailPage.Button_EditVendorRates
    )
    this.Button_RemoveRegion = new Element(
      global.page,
      this.titleParent.locator('div > button[aria-label="Remove Region"]')
    )
    this.Title = new Element(
      global.page,
      this.titleParent.getByText(regionRate.name),
      regionRate.name
    )

    this.Label_Surtax = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(0)
        .getByText(RegionRatesDetailPage.Label_Surtax, {
          exact: true,
        }),
      RegionRatesDetailPage.Label_Surtax
    )
    this.Label_Surtax_Actual = new Element(
      global.page,
      this.Label_Surtax.locator.locator('..').locator('..').locator('> dd'),
      regionRate.surtax != null ? `${regionRate.surtax}%` : ''
    )

    this.Label_BaseRates_Title = new Element(
      global.page,
      this.page.locator('div[id$="_content"] h3').nth(0),
      RegionRatesDetailPage.Title_BaseRates
    )

    this.Label_BaseRates_DuringBusinessHours = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(1)
        .getByText(RegionRatesDetailPage.Label_BaseRates_DuringBusinessHours, {
          exact: true,
        }),
      RegionRatesDetailPage.Label_BaseRates_DuringBusinessHours
    )
    this.Label_BaseRates_DuringBusinessHours_Actual = new Element(
      global.page,
      this.Label_BaseRates_DuringBusinessHours.locator.locator('..').locator('..').locator('> dd'),
      `$${regionRate.baseRates.duringBusinessHours.toFixed(2)}`
    )

    this.Label_BaseRates_AfterBusinessHours = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(1)
        .getByText(RegionRatesDetailPage.Label_BaseRates_AfterBusinessHours, {
          exact: true,
        }),
      RegionRatesDetailPage.Label_BaseRates_AfterBusinessHours
    )
    this.Label_BaseRates_AfterBusinessHours_Actual = new Element(
      global.page,
      this.Label_BaseRates_AfterBusinessHours.locator.locator('..').locator('..').locator('> dd'),
      `$${regionRate.baseRates.afterBusinessHours.toFixed(2)}`
    )

    this.Label_RoofPitchRates_Title = new Element(
      global.page,
      this.page.locator('div[id$="_content"] h3').nth(1),
      RegionRatesDetailPage.Title_RoofPitchRates
    )

    this.Label_RoofPitchRates_HighRoofRate = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(2)
        .getByText(RegionRatesDetailPage.Label_RoofPitchRates_HighRoofRate, {
          exact: true,
        }),
      RegionRatesDetailPage.Label_RoofPitchRates_HighRoofRate
    )
    this.Label_RoofPitchRates_HighRoofRate_Actual = new Element(
      global.page,
      this.Label_RoofPitchRates_HighRoofRate.locator.locator('..').locator('..').locator('> dd'),
      regionRate.roofPitchRates.highRoof != null
        ? `$${regionRate.roofPitchRates.highRoof.toFixed(2)}`
        : ''
    )

    this.Label_RoofPitchRates_Under7_12 = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(2)
        .getByText(RegionRatesDetailPage.Label_RoofPitchRates_Under7_12, {
          exact: true,
        }),
      RegionRatesDetailPage.Label_RoofPitchRates_Under7_12
    )
    this.Label_RoofPitchRates_Under7_12_Actual = new Element(
      global.page,
      this.Label_RoofPitchRates_Under7_12.locator.locator('..').locator('..').locator('> dd'),
      regionRate.roofPitchRates.under7_12 != null
        ? `$${regionRate.roofPitchRates.under7_12.toFixed(2)}`
        : ''
    )

    this.Label_RoofPitchRates_7_12To9_12 = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(2)
        .getByText(RegionRatesDetailPage.Label_RoofPitchRates_7_12To9_12, {
          exact: true,
        }),
      RegionRatesDetailPage.Label_RoofPitchRates_7_12To9_12
    )
    this.Label_RoofPitchRates_7_12To9_12_Actual = new Element(
      global.page,
      this.Label_RoofPitchRates_7_12To9_12.locator.locator('..').locator('..').locator('> dd'),
      regionRate.roofPitchRates.between7_12and9_12 != null
        ? `$${regionRate.roofPitchRates.between7_12and9_12.toFixed(2)}`
        : ''
    )

    this.Label_RoofPitchRates_10_12To12_12 = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(2)
        .getByText(RegionRatesDetailPage.Label_RoofPitchRates_10_12To12_12, {
          exact: true,
        }),
      RegionRatesDetailPage.Label_RoofPitchRates_10_12To12_12
    )
    this.Label_RoofPitchRates_10_12To12_12_Actual = new Element(
      global.page,
      this.Label_RoofPitchRates_10_12To12_12.locator.locator('..').locator('..').locator('> dd'),
      regionRate.roofPitchRates.between10_12and12_12 != null
        ? `$${regionRate.roofPitchRates.between10_12and12_12.toFixed(2)}`
        : ''
    )

    this.Label_RoofPitchRates_Over12And12 = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(2)
        .getByText(RegionRatesDetailPage.Label_RoofPitchRates_Over12And12, {
          exact: true,
        }),
      RegionRatesDetailPage.Label_RoofPitchRates_Over12And12
    )
    this.Label_RoofPitchRates_Over12And12_Actual = new Element(
      global.page,
      this.Label_RoofPitchRates_Over12And12.locator.locator('..').locator('..').locator('> dd'),
      regionRate.roofPitchRates.over12_12 != null
        ? `$${regionRate.roofPitchRates.over12_12.toFixed(2)}`
        : ''
    )

    this.Label_MechanicalTarpingRates_Title = new Element(
      global.page,
      this.page.locator('div[id$="_content"] h3').nth(2),
      RegionRatesDetailPage.Title_MechanicalTarpingRates
    )

    this.Label_MechanicalTarpingRates_DuringBusinessHours = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(3)
        .getByText(RegionRatesDetailPage.Label_MechanicalTarpingRates_DuringBusinessHours, {
          exact: true,
        }),
      RegionRatesDetailPage.Label_MechanicalTarpingRates_DuringBusinessHours
    )
    this.Label_MechanicalTarpingRates_DuringBusinessHours_Actual = new Element(
      global.page,
      this.Label_MechanicalTarpingRates_DuringBusinessHours.locator
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${regionRate.mechanicalTarpingRates.duringBusinessHours.toFixed(2)}`
    )

    this.Label_MechanicalTarpingRates_AfterBusinessHours = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(3)
        .getByText(RegionRatesDetailPage.Label_MechanicalTarpingRates_AfterBusinessHours, {
          exact: true,
        }),
      RegionRatesDetailPage.Label_MechanicalTarpingRates_AfterBusinessHours
    )
    this.Label_MechanicalTarpingRates_AfterBusinessHours_Actual = new Element(
      global.page,
      this.Label_MechanicalTarpingRates_AfterBusinessHours.locator
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${regionRate.mechanicalTarpingRates.afterBusinessHours.toFixed(2)}`
    )

    this.Label_MechanicalTarpingRates_MaterialCost = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(3)
        .getByText(RegionRatesDetailPage.Label_MechanicalTarpingRates_MaterialCost, {
          exact: true,
        }),
      RegionRatesDetailPage.Label_MechanicalTarpingRates_MaterialCost
    )
    this.Label_MechanicalTarpingRates_MaterialCost_Actual = new Element(
      global.page,
      this.Label_MechanicalTarpingRates_MaterialCost.locator
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${regionRate.mechanicalTarpingRates.materialCost.toFixed(2)}`
    )

    this.Label_SandbagTarpingRates_Title = new Element(
      global.page,
      this.page.locator('div[id$="_content"] h3').nth(3),
      RegionRatesDetailPage.Title_SandbagTarpingRates
    )

    this.Label_SandbagTarpingRates_DuringBusinessHours = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(4)
        .getByText(RegionRatesDetailPage.Label_SandbagTarpingRates_DuringBusinessHours, {
          exact: true,
        }),
      RegionRatesDetailPage.Label_SandbagTarpingRates_DuringBusinessHours
    )
    this.Label_SandbagTarpingRates_DuringBusinessHours_Actual = new Element(
      global.page,
      this.Label_SandbagTarpingRates_DuringBusinessHours.locator
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${regionRate.sandbagTarpingRates.duringBusinessHours.toFixed(2)}`
    )

    this.Label_SandbagTarpingRates_AfterBusinessHours = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(4)
        .getByText(RegionRatesDetailPage.Label_SandbagTarpingRates_AfterBusinessHours, {
          exact: true,
        }),
      RegionRatesDetailPage.Label_SandbagTarpingRates_AfterBusinessHours
    )
    this.Label_SandbagTarpingRates_AfterBusinessHours_Actual = new Element(
      global.page,
      this.Label_SandbagTarpingRates_AfterBusinessHours.locator
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${regionRate.sandbagTarpingRates.afterBusinessHours.toFixed(2)}`
    )

    this.Label_SandbagTarpingRates_MaterialCost = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(4)
        .getByText(RegionRatesDetailPage.Label_SandbagTarpingRates_MaterialCost, {
          exact: true,
        }),
      RegionRatesDetailPage.Label_SandbagTarpingRates_MaterialCost
    )
    this.Label_SandbagTarpingRates_MaterialCost_Actual = new Element(
      global.page,
      this.Label_SandbagTarpingRates_MaterialCost.locator
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${regionRate.sandbagTarpingRates.materialCost.toFixed(2)}`
    )
  }

  async NavigateDirectly(regionRateId: string) {
    await this.page.waitForTimeout(1000)
    const targetUrl = `${this.global.baseUrl}pricing/regions/corn:tarpulator:region:${regionRateId}`
    await this.page.goto(targetUrl)
    await this.page.waitForURL(targetUrl)
    await this.Label_BaseRates_Title.locator.waitFor({ state: 'visible' })
  }

  async OpenUpdateRegionPricingDrawer() {
    await this.Button_EditRegion.Click()
    return new ClaimsPortalRegionPricingDrawer(this.global, true)
  }

  async VerifySurtaxAndBaseRates(smoke = false) {
    await this.Label_Surtax.VerifyExpectedTextAlt()
    await this.Label_BaseRates_Title.VerifyExpectedTextAlt()
    await this.Label_BaseRates_DuringBusinessHours.VerifyExpectedTextAlt()
    await this.Label_BaseRates_AfterBusinessHours.VerifyExpectedTextAlt()
    if (!smoke) {
      await this.Label_Surtax_Actual.VerifyExpectedTextAlt()
      await this.Label_BaseRates_DuringBusinessHours_Actual.VerifyExpectedTextAlt()
      await this.Label_BaseRates_AfterBusinessHours_Actual.VerifyExpectedTextAlt()
    }
  }

  async VerifyRoofPitchRates(smoke = false) {
    await this.Label_RoofPitchRates_Title.VerifyExpectedTextAlt()
    await this.Label_RoofPitchRates_HighRoofRate.VerifyExpectedTextAlt()
    await this.Label_RoofPitchRates_Under7_12.VerifyExpectedTextAlt()
    await this.Label_RoofPitchRates_7_12To9_12.VerifyExpectedTextAlt()
    await this.Label_RoofPitchRates_10_12To12_12.VerifyExpectedTextAlt()
    await this.Label_RoofPitchRates_Over12And12.VerifyExpectedTextAlt()
    if (!smoke) {
      await this.Label_RoofPitchRates_HighRoofRate_Actual.VerifyExpectedTextAlt()
      await this.Label_RoofPitchRates_Under7_12_Actual.VerifyExpectedTextAlt()
      await this.Label_RoofPitchRates_7_12To9_12_Actual.VerifyExpectedTextAlt()
      await this.Label_RoofPitchRates_10_12To12_12_Actual.VerifyExpectedTextAlt()
      await this.Label_RoofPitchRates_Over12And12_Actual.VerifyExpectedTextAlt()
    }
  }

  async VerifyMechanicalTarpingRates(smoke = false) {
    await this.Label_MechanicalTarpingRates_Title.VerifyExpectedTextAlt()
    await this.Label_MechanicalTarpingRates_DuringBusinessHours.VerifyExpectedTextAlt()
    await this.Label_MechanicalTarpingRates_AfterBusinessHours.VerifyExpectedTextAlt()
    await this.Label_MechanicalTarpingRates_MaterialCost.VerifyExpectedTextAlt()
    if (!smoke) {
      await this.Label_MechanicalTarpingRates_DuringBusinessHours_Actual.VerifyExpectedTextAlt()
      await this.Label_MechanicalTarpingRates_AfterBusinessHours_Actual.VerifyExpectedTextAlt()
      await this.Label_MechanicalTarpingRates_MaterialCost_Actual.VerifyExpectedTextAlt()
    }
  }

  async VerifySandbagTarpingRates(smoke = false) {
    await this.Label_SandbagTarpingRates_Title.VerifyExpectedTextAlt()
    await this.Label_SandbagTarpingRates_DuringBusinessHours.VerifyExpectedTextAlt()
    await this.Label_SandbagTarpingRates_AfterBusinessHours.VerifyExpectedTextAlt()
    await this.Label_SandbagTarpingRates_MaterialCost.VerifyExpectedTextAlt()
    if (!smoke) {
      await this.Label_SandbagTarpingRates_DuringBusinessHours_Actual.VerifyExpectedTextAlt()
      await this.Label_SandbagTarpingRates_AfterBusinessHours_Actual.VerifyExpectedTextAlt()
      await this.Label_SandbagTarpingRates_MaterialCost_Actual.VerifyExpectedTextAlt()
    }
  }

  async EditRegion(editRegionRate: ClaimsPortalRegionRate) {
    await this.Button_EditRegion.Click()
    const updateRegionRateDrawer = new ClaimsPortalRegionPricingDrawer(this.global, true)
    await updateRegionRateDrawer.FillAndSubmit(editRegionRate)
  }

  async RemoveRegion() {
    await this.Button_RemoveRegion.Click()
    await this.HandleRemoveRegionAlert()
    await this.page.waitForTimeout(5000)
  }

  async HandleRemoveRegionAlert(cancelRemove = false) {
    const alert = new ClaimsPortalDeleteAlert(
      this.global,
      AlertStrings.RemoveRegion_Title,
      AlertStrings.RemoveRegion_Description
    )
    if (cancelRemove) {
      await alert.Button_Close.locator.click({ force: true })
    } else {
      await alert.Button_Delete.locator.click({ force: true })
    }
  }
}
