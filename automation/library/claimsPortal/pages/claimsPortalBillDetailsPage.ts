import { Locator } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { ClaimsPortalBill } from '../claimsPortalBill.js'
import { BillDetailsPage } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'

export class ClaimsPortalBillDetailsPage extends ClaimsPortalBasePage {
  readonly bill: ClaimsPortalBill
  readonly baseURL: string
  readonly Button_BackToBilling: Element
  readonly Label_Bill_Title: Element
  readonly Label_Bill_Badge: Element
  readonly Label_Bill_Vendor: Element
  readonly Label_Bill_Description: Element
  readonly Label_Bill_Total: Element
  readonly Label_Bill_Balance: Element
  readonly Label_LineItems_Title: Element
  readonly Button_Vendor: Element
  readonly titleParent: Locator
  readonly parent: Locator

  constructor(global: ClaimsPortalGlobal, bill: ClaimsPortalBill, billingPageUrl: string) {
    super(global)
    this.bill = bill
    this.titleParent = this.page.locator('div.chakra-container div[id*="_title"]').nth(0)
    this.parent = this.page.locator('div.chakra-container div[id*="_content"]')
    this.baseURL = `${billingPageUrl}/bill/${this.bill.idNumber}`
    this.Button_BackToBilling = new Element(
      global.page,
      this.parent.locator('div > button').nth(0),
      BillDetailsPage.Button_BackToBilling
    )
    const fullTitle = `${BillDetailsPage.Title_BillPrefix}${this.bill.idNumber}`
    this.Label_Bill_Title = new Element(
      global.page,
      this.titleParent.getByText(fullTitle),
      fullTitle
    )
    this.Label_Bill_Badge = new Element(
      global.page,
      this.titleParent.getByText(BillDetailsPage.Badge_Created),
      BillDetailsPage.Badge_Created
    )
    this.Label_Bill_Vendor = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(0)
        .getByText(BillDetailsPage.Label_Bill_Vendor, {
          exact: true,
        })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${this.bill.vendor}`
    )
    this.Label_Bill_Description = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(0)
        .getByText(BillDetailsPage.Label_Bill_Description, {
          exact: true,
        })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${this.bill.description}`
    )
    this.Label_Bill_Total = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(0)
        .getByText(BillDetailsPage.Label_Bill_Total, {
          exact: true,
        })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${this.bill.total.toFixed(2)}`
    )
    this.Label_Bill_Balance = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(0)
        .getByText(BillDetailsPage.Label_Bill_Balance, {
          exact: true,
        })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${this.bill.balance.toFixed(2)}`
    )
    this.Label_LineItems_Title = new Element(
      global.page,
      this.page.locator('div.chakra-container div[id*="_title"]').nth(1),
      BillDetailsPage.Title_LineItems_Tarping
    )
    this.Button_Vendor = new Element(
      global.page,
      this.parent.getByRole('button', { name: this.bill.vendor })
    )
  }

  async VerifyBillInfo() {
    await this.Label_Bill_Title.VerifyExpectedTextAlt()
    await this.Label_Bill_Badge.VerifyExpectedTextAlt()
    await this.Label_Bill_Vendor.VerifyExpectedTextAlt()
    await this.Label_Bill_Description.VerifyExpectedTextAlt()
    await this.Label_Bill_Total.VerifyExpectedTextAlt()
    await this.Label_Bill_Balance.VerifyExpectedTextAlt()
  }

  async VerifyLineItems() {
    await this.Label_LineItems_Title.VerifyExpectedTextAlt()
    if (this.bill.lineItems.length > 0) {
      for (let index = 0; index < this.bill.lineItems.length; index++) {
        const lineItemDescription = new Element(
          this.global.page,
          this.page
            .locator('div[id$="_content"]')
            .nth(1)
            .locator('dl > div > dt')
            .nth(index)
            .getByText(BillDetailsPage.Label_LineItem_Description, {
              exact: true,
            })
            .locator('..')
            .locator('..')
            .locator('> dd'),
          this.bill.lineItems[index].label
        )
        const lineItemAmount = new Element(
          this.global.page,
          this.page
            .locator('div[id$="_content"]')
            .nth(1)
            .locator('dl > div > dt')
            .nth(index)
            .getByText(BillDetailsPage.Label_LineItem_Amount, {
              exact: true,
            })
            .locator('..')
            .locator('..')
            .locator('> dd'),
          this.bill.lineItems[index].formattedValue
        )
        await lineItemDescription.VerifyExpectedTextAlt()
        await lineItemAmount.VerifyExpectedTextAlt()
      }
    }
  }
}
