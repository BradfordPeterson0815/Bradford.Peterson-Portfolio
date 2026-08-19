import { Locator, expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { ClaimsPortalDeleteAlert } from '../alerts/claimsPortalDeleteAlert.js'
import { AlertStrings, VendorRatesDetailPage } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalVendorRates } from '../claimsPortalVendorRates.js'
import { ClaimsPortalVendorRatesDrawer } from '../drawers/claimsPortalVendorRatesDrawer.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'

export class ClaimsPortalVendorRatesDetailPage extends ClaimsPortalBasePage {
  readonly vendorRates: ClaimsPortalVendorRates
  readonly baseURL: string
  readonly Title: Element
  readonly Button_BackToVendorRates: Element
  readonly Label_Badge: Element
  readonly Label_RatesInfo_Title: Element
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
  readonly Label_AssignedVendors_Title: Element
  readonly Button_EditRates: Element
  readonly Button_RemoveVendorRates: Element
  readonly headerParent: Locator
  readonly parent: Locator

  constructor(global: ClaimsPortalGlobal, vendorRates: ClaimsPortalVendorRates) {
    super(global)
    this.vendorRates = vendorRates
    this.headerParent = this.page.locator('div.chakra-container div.chakra-stack[id*="header"]')
    this.parent = this.page.locator('div.chakra-container')
    this.baseURL = `${global.baseUrl}pricing/vendors/corn:tarpulator:vendorRates:${vendorRates.id}`
    this.Button_BackToVendorRates = new Element(
      global.page,
      this.parent.locator('div > button').nth(0),
      VendorRatesDetailPage.Button_BackToVendorRates
    )
    this.Label_Badge = new Element(
      global.page,
      this.headerParent.locator('span.chakra-badge'),
      VendorRatesDetailPage.Badge_Vendor
    )
    this.Button_EditRates = new Element(
      global.page,
      this.headerParent.locator('div > button').nth(0),
      VendorRatesDetailPage.Button_EditVendorRates
    )
    this.Button_RemoveVendorRates = new Element(
      global.page,
      this.headerParent.locator('div > button[aria-label="Remove Vendor Rates"]')
    )
    this.Title = new Element(
      global.page,
      this.headerParent.getByText(vendorRates.name),
      vendorRates.name
    )
    this.Label_RatesInfo_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(0),
      VendorRatesDetailPage.Title_RatesInfo
    )
    this.Label_MechanicalTarpingRates_Title = new Element(
      global.page,
      this.page.locator('div[id$="_content"] h3').nth(0),
      VendorRatesDetailPage.Title_MechanicalTarpingRates
    )

    this.Label_MechanicalTarpingRates_DuringBusinessHours = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(0)
        .getByText(VendorRatesDetailPage.Label_MechanicalTarpingRates_DuringBusinessHours, {
          exact: true,
        }),
      VendorRatesDetailPage.Label_MechanicalTarpingRates_DuringBusinessHours
    )
    this.Label_MechanicalTarpingRates_DuringBusinessHours_Actual = new Element(
      global.page,
      this.Label_MechanicalTarpingRates_DuringBusinessHours.locator
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${vendorRates.mechanicalTarpingRates.duringBusinessHours.toFixed(2)}`
    )

    this.Label_MechanicalTarpingRates_AfterBusinessHours = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(0)
        .getByText(VendorRatesDetailPage.Label_MechanicalTarpingRates_AfterBusinessHours, {
          exact: true,
        }),
      VendorRatesDetailPage.Label_MechanicalTarpingRates_AfterBusinessHours
    )
    this.Label_MechanicalTarpingRates_AfterBusinessHours_Actual = new Element(
      global.page,
      this.Label_MechanicalTarpingRates_AfterBusinessHours.locator
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${vendorRates.mechanicalTarpingRates.afterBusinessHours.toFixed(2)}`
    )

    this.Label_MechanicalTarpingRates_MaterialCost = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(0)
        .getByText(VendorRatesDetailPage.Label_MechanicalTarpingRates_MaterialCost, {
          exact: true,
        }),
      VendorRatesDetailPage.Label_MechanicalTarpingRates_MaterialCost
    )
    this.Label_MechanicalTarpingRates_MaterialCost_Actual = new Element(
      global.page,
      this.Label_MechanicalTarpingRates_MaterialCost.locator
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${vendorRates.mechanicalTarpingRates.materialCost.toFixed(2)}`
    )

    this.Label_SandbagTarpingRates_Title = new Element(
      global.page,
      this.page.locator('div[id$="_content"] h3').nth(1),
      VendorRatesDetailPage.Title_SandbagTarpingRates
    )

    this.Label_SandbagTarpingRates_DuringBusinessHours = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(1)
        .getByText(VendorRatesDetailPage.Label_SandbagTarpingRates_DuringBusinessHours, {
          exact: true,
        }),
      VendorRatesDetailPage.Label_SandbagTarpingRates_DuringBusinessHours
    )
    this.Label_SandbagTarpingRates_DuringBusinessHours_Actual = new Element(
      global.page,
      this.Label_SandbagTarpingRates_DuringBusinessHours.locator
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${vendorRates.sandbagTarpingRates.duringBusinessHours.toFixed(2)}`
    )

    this.Label_SandbagTarpingRates_AfterBusinessHours = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(1)
        .getByText(VendorRatesDetailPage.Label_SandbagTarpingRates_AfterBusinessHours, {
          exact: true,
        }),
      VendorRatesDetailPage.Label_SandbagTarpingRates_AfterBusinessHours
    )
    this.Label_SandbagTarpingRates_AfterBusinessHours_Actual = new Element(
      global.page,
      this.Label_SandbagTarpingRates_AfterBusinessHours.locator
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${vendorRates.sandbagTarpingRates.afterBusinessHours.toFixed(2)}`
    )

    this.Label_SandbagTarpingRates_MaterialCost = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(1)
        .getByText(VendorRatesDetailPage.Label_SandbagTarpingRates_MaterialCost, {
          exact: true,
        }),
      VendorRatesDetailPage.Label_SandbagTarpingRates_MaterialCost
    )
    this.Label_SandbagTarpingRates_MaterialCost_Actual = new Element(
      global.page,
      this.Label_SandbagTarpingRates_MaterialCost.locator
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${vendorRates.sandbagTarpingRates.materialCost.toFixed(2)}`
    )

    this.Label_AssignedVendors_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(1),
      VendorRatesDetailPage.Title_AssignedVendors
    )
  }

  async NavigateDirectly(vendorRatesId: string) {
    await this.page.waitForTimeout(1000)
    const targetUrl = `${this.global.baseUrl}pricing/vendors/corn:tarpulator:vendorRates:${vendorRatesId}`
    await this.page.goto(targetUrl)
    await this.page.waitForURL(targetUrl)
    await this.Label_RatesInfo_Title.locator.waitFor({ state: 'visible' })
  }

  async VerifyRatesInfo(smoke = false) {
    await this.Label_RatesInfo_Title.VerifyExpectedTextAlt()
    await this.Label_MechanicalTarpingRates_Title.VerifyExpectedTextAlt()
    await this.Label_MechanicalTarpingRates_DuringBusinessHours.VerifyExpectedTextAlt()
    await this.Label_MechanicalTarpingRates_AfterBusinessHours.VerifyExpectedTextAlt()
    await this.Label_MechanicalTarpingRates_MaterialCost.VerifyExpectedTextAlt()
    await this.Label_SandbagTarpingRates_Title.VerifyExpectedTextAlt()
    await this.Label_SandbagTarpingRates_DuringBusinessHours.VerifyExpectedTextAlt()
    await this.Label_SandbagTarpingRates_AfterBusinessHours.VerifyExpectedTextAlt()
    await this.Label_SandbagTarpingRates_MaterialCost.VerifyExpectedTextAlt()
    if (!smoke) {
      await this.Label_MechanicalTarpingRates_DuringBusinessHours_Actual.VerifyExpectedTextAlt()
      await this.Label_MechanicalTarpingRates_AfterBusinessHours_Actual.VerifyExpectedTextAlt()
      await this.Label_MechanicalTarpingRates_MaterialCost_Actual.VerifyExpectedTextAlt()
      await this.Label_SandbagTarpingRates_DuringBusinessHours_Actual.VerifyExpectedTextAlt()
      await this.Label_SandbagTarpingRates_AfterBusinessHours_Actual.VerifyExpectedTextAlt()
      await this.Label_SandbagTarpingRates_MaterialCost_Actual.VerifyExpectedTextAlt()
    }
  }
  async VerifyAssignedVendors() {
    await this.Label_AssignedVendors_Title.VerifyExpectedTextAlt()
    if (this.vendorRates.assignedVendors.length > 0) {
      for (let index = 0; index < this.vendorRates.assignedVendors.length; index++) {
        const expectedVendorName = this.vendorRates.assignedVendors[index].split(',')[0]
        const expectedVendorEmail = this.vendorRates.assignedVendors[index].split(',')[1]
        const vendorNameLocator = this.page.locator('div[id$="_content"] ul li p').nth(index)
        const actualVendorName = await vendorNameLocator.innerText()
        expect(actualVendorName).toBe(expectedVendorName)
        const vendorEmailLocator = this.page.locator('div[id$="_content"] ul li a').nth(index)
        const actualVendorEmail = await vendorEmailLocator.innerText()
        expect(actualVendorEmail).toBe(expectedVendorEmail)
      }
    }
  }

  async EditVendorRates(editVendorRates: ClaimsPortalVendorRates) {
    await this.Button_EditRates.Click()
    const updateVendorRatesDrawer = new ClaimsPortalVendorRatesDrawer(this.global, true, editVendorRates)
    await updateVendorRatesDrawer.FillAndSubmit()
  }

  async RemoveVendorRates() {
    await this.Button_RemoveVendorRates.Click()
    await this.HandleRemoveVendorRatesAlert()
    await this.page.waitForTimeout(1000)
  }

  async HandleRemoveVendorRatesAlert(cancelRemove = false) {
    const alert = new ClaimsPortalDeleteAlert(
      this.global,
      AlertStrings.RemoveVendorRates_Title,
      AlertStrings.RemoveVendorRates_Description
    )
    if (cancelRemove) {
      await alert.Button_Close.locator.click({ force: true })
    } else {
      await alert.Button_Delete.locator.click({ force: true })
    }
  }

  async OpenUpdateVendorRatesDrawer() {
    await this.Button_EditRates.Click()
    return new ClaimsPortalVendorRatesDrawer(this.global, true, this.vendorRates)
  }
}
