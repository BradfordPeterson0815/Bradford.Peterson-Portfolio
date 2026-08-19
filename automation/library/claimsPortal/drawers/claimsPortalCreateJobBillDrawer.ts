import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { Locator, expect } from '@playwright/test'
import { ClaimsPortalLineItem } from '../claimsPortalLineItem.js'

export class ClaimsPortalCreateJobBillDrawer extends ClaimsPortalBase {
  readonly parent: Locator
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly ListBox_SelectRegionPricing: Locator
  readonly ListBox_SelectVendorRates: Locator
  readonly Alert_SelectRegionAndVendorToSeeBill: Locator
  readonly billLineItems: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.CreateJobBill_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.ListBox_SelectRegionPricing = this.parent
      .locator(`#createBillFormSchema input[type="text"]`)
      .nth(0)
    this.ListBox_SelectVendorRates = this.parent
      .locator(`#createBillFormSchema input[type="text"]`)
      .nth(1)
    this.Button_Close = new Element(
      global.page,
      this.parent.locator(`div.chakra-modal__footer button:nth-child(1)`)
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
    this.Alert_SelectRegionAndVendorToSeeBill = this.parent.locator(`div[role="alert"]`)
    this.billLineItems = this.parent.locator('#createBillFormSchema dl')
  }

  async VerifyNoBillIsVisibleAndAlertIsShowing() {
    // if alert is showing, we shouldn't see any bill items
    const alertIsShowing = (await this.Alert_SelectRegionAndVendorToSeeBill.count()) > 0
    expect(alertIsShowing).toBe(true)

    // verify no bill line items are listed
    const billLineItemsAreNotShowing = (await this.billLineItems.count()) == 0
    expect(billLineItemsAreNotShowing).toBe(true)
  }

  async VerifyBillIsVisibleAndVerifyLineItems(billLineItems: ClaimsPortalLineItem[]) {
    // alert should not be showing
    const alertIsNotShowing = (await this.Alert_SelectRegionAndVendorToSeeBill.count()) == 0
    expect(alertIsNotShowing).toBe(true)

    // verify the number of line items matched expected count
    const actualLineItemCount = await this.parent
      .locator('#createBillFormSchema dl')
      .locator('div')
      .count()
    expect(billLineItems.length).toBe(actualLineItemCount)

    // verify expected bill line items
    for (let index = 0; index < billLineItems.length; index++) {
      const expectedLineItem = billLineItems[index]
      const actualLineItemLabel = this.parent
        .locator('#createBillFormSchema dl')
        .locator('div')
        .nth(index)
        .locator('dt span')
        .textContent()
      const actualLineItemFormattedValue = this.parent
        .locator('#createBillFormSchema dl')
        .locator('div')
        .nth(index)
        .locator('dd')
        .textContent()
      expect(expectedLineItem.label).toBe(actualLineItemLabel)
      expect(expectedLineItem.formattedValue).toBe(actualLineItemFormattedValue)
    }
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Validate() {
    // Validate Select Region Pricing field is in an invalid state and that the error is..
    const selectRegionPricingIsValidated =
      (await this.parent.locator(`form > div > div > div:nth-child(3)`).nth(1).textContent()) ==
      ValidationStrings.Required

    return selectRegionPricingIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
