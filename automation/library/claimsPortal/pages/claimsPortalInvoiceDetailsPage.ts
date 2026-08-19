import { Locator } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { InvoiceDetailsPage } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalInvoice } from '../claimsPortalInvoice.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'

export class ClaimsPortalInvoiceDetailsPage extends ClaimsPortalBasePage {
  readonly invoice: ClaimsPortalInvoice
  readonly baseURL: string
  readonly Button_BackToBilling: Element
  readonly Label_Invoice_Title: Element
  readonly Label_Invoice_Badge: Element
  readonly Label_Invoice_Vendor: Element
  readonly Label_Invoice_Description: Element
  readonly Label_Invoice_Total: Element
  readonly Label_Invoice_Balance: Element
  readonly Label_LineItems_Title: Element
  readonly Button_Vendor: Element
  readonly Button_Download: Element
  readonly titleParent: Locator
  readonly parent: Locator

  constructor(global: ClaimsPortalGlobal, invoice: ClaimsPortalInvoice, billingPageUrl: string) {
    super(global)
    this.invoice = invoice
    this.titleParent = this.page.locator('div.chakra-container div[id*="_title"]').nth(0)
    this.parent = this.page.locator('div.chakra-container div[id*="_content"]')
    this.baseURL = `${billingPageUrl}/bill/${this.invoice.idNumber}`
    this.Button_BackToBilling = new Element(
      global.page,
      this.parent.locator('div > button').nth(0),
      InvoiceDetailsPage.Button_BackToBilling
    )
    const fullTitle = `${InvoiceDetailsPage.Title_InvoicePrefix}${this.invoice.idNumber}`
    this.Label_Invoice_Title = new Element(
      global.page,
      this.titleParent.getByText(fullTitle),
      fullTitle
    )
    this.Label_Invoice_Badge = new Element(
      global.page,
      this.titleParent.getByText(InvoiceDetailsPage.Badge_Created),
      InvoiceDetailsPage.Badge_Created
    )
    this.Label_Invoice_Vendor = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(0)
        .getByText(InvoiceDetailsPage.Label_Invoice_Vendor, {
          exact: true,
        })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${this.invoice.vendor}`
    )
    this.Label_Invoice_Description = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(0)
        .getByText(InvoiceDetailsPage.Label_Invoice_Description, {
          exact: true,
        })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${this.invoice.description}`
    )
    this.Label_Invoice_Total = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(0)
        .getByText(InvoiceDetailsPage.Label_Invoice_Total, {
          exact: true,
        })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${this.invoice.total.toFixed(2)}`
    )
    this.Label_Invoice_Balance = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator(' dl')
        .nth(0)
        .getByText(InvoiceDetailsPage.Label_Invoice_Balance, {
          exact: true,
        })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      `$${this.invoice.balance.toFixed(2)}`
    )
    this.Label_LineItems_Title = new Element(
      global.page,
      this.page.locator('div.chakra-container div[id*="_title"]').nth(1),
      InvoiceDetailsPage.Title_LineItems_Tarping
    )
    this.Button_Vendor = new Element(
      global.page,
      this.parent.getByRole('button', { name: this.invoice.vendor })
    )
    this.Button_Download = new Element(
      global.page,
      this.parent.getByRole('button', { name: InvoiceDetailsPage.Button_Download })
    )
  }

  async VerifyBillInfo() {
    await this.Label_Invoice_Title.VerifyExpectedTextAlt()
    await this.Label_Invoice_Badge.VerifyExpectedTextAlt()
    await this.Label_Invoice_Vendor.VerifyExpectedTextAlt()
    await this.Label_Invoice_Description.VerifyExpectedTextAlt()
    await this.Label_Invoice_Total.VerifyExpectedTextAlt()
    await this.Label_Invoice_Balance.VerifyExpectedTextAlt()
  }

  async VerifyLineItems() {
    await this.Label_LineItems_Title.VerifyExpectedTextAlt()
    if (this.invoice.lineItems.length > 0) {
      for (let index = 0; index < this.invoice.lineItems.length; index++) {
        const lineItemDescription = new Element(
          this.global.page,
          this.page
            .locator('div[id$="_content"]')
            .nth(1)
            .locator('dl > div > dt')
            .nth(index)
            .getByText(InvoiceDetailsPage.Label_LineItem_Description, {
              exact: true,
            })
            .locator('..')
            .locator('..')
            .locator('> dd'),
          this.invoice.lineItems[index].label
        )
        const lineItemAmount = new Element(
          this.global.page,
          this.page
            .locator('div[id$="_content"]')
            .nth(1)
            .locator('dl > div > dt')
            .nth(index)
            .getByText(InvoiceDetailsPage.Label_LineItem_Amount, {
              exact: true,
            })
            .locator('..')
            .locator('..')
            .locator('> dd'),
          this.invoice.lineItems[index].formattedValue
        )
        await lineItemDescription.VerifyExpectedTextAlt()
        await lineItemAmount.VerifyExpectedTextAlt()
      }
    }
  }
}
