import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { Locator, expect } from '@playwright/test'
import { ClaimsPortalLineItem } from '../claimsPortalLineItem.js'

export class ClaimsPortalCreateJobInvoiceDrawer extends ClaimsPortalBase {
  readonly parent: Locator
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly ListBox_SelectRegionPricing: Locator
  readonly Alert_SelectRegionAndVendorToSeeInvoice: Locator
  readonly invoiceLineItems: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.CreateJobInvoice_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.ListBox_SelectRegionPricing = this.parent
      .locator(`#createInvoiceForm input[type="text"]`)
      .nth(0)
    this.Button_Close = new Element(
      global.page,
      this.parent.locator(`div.chakra-modal__footer button:nth-child(1)`)
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: DrawerStrings.Button_Submit })
    )
    this.Alert_SelectRegionAndVendorToSeeInvoice = this.parent.locator(`div[role="alert"]`)
    this.invoiceLineItems = this.parent.locator('#createInvoiceForm dl')
  }

  async VerifyNoInvoiceIsVisibleAndAlertIsShowing() {
    // if alert is showing, we shouldn't see any invoice line items
    const alertIsShowing = (await this.Alert_SelectRegionAndVendorToSeeInvoice.count()) > 0
    expect(alertIsShowing).toBe(true)

    // verify no invoice line items are listed
    const invoiceLineItemsAreNotShowing = (await this.invoiceLineItems.count()) == 0
    expect(invoiceLineItemsAreNotShowing).toBe(true)
  }

  async VerifyInvoiceIsVisibleAndVerifyLineItems(invoiceLineItems: ClaimsPortalLineItem[]) {
    // alert should not be showing
    const alertIsNotShowing = (await this.Alert_SelectRegionAndVendorToSeeInvoice.count()) == 0
    expect(alertIsNotShowing).toBe(true)

    // verify the number of line items matched expected count
    const actualLineItemCount = await this.parent
      .locator('#createInvoiceForm dl')
      .locator('div')
      .count()
    expect(invoiceLineItems.length).toBe(actualLineItemCount)

    // verify expected invoice line items
    for (let index = 0; index < invoiceLineItems.length; index++) {
      const expectedLineItem = invoiceLineItems[index]
      const actualLineItemLabel = this.parent
        .locator('#createInvoiceForm dl')
        .locator('div')
        .nth(index)
        .locator('dt span')
        .textContent()
      const actualLineItemFormattedValue = this.parent
        .locator('#createInvoiceForm dl')
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
