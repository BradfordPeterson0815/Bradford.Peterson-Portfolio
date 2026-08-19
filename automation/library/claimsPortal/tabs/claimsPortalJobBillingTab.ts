import { Element } from '../../shared/element.js'
import { BillingTabStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalJob } from '../claimsPortalJob.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'

export class ClaimsPortalJobBillingTab extends ClaimsPortalBasePage {
  readonly job: ClaimsPortalJob
  readonly URL: string
  readonly Button_CreateBill: Element
  readonly Button_CreateInvoice: Element
  readonly DataTable_Bills: ClaimsPortalDataTable
  readonly DataTable_Invoices: ClaimsPortalDataTable

  constructor(global: ClaimsPortalGlobal, job: ClaimsPortalJob, jobPageURL: string) {
    super(global)
    this.job = job
    this.URL = `${jobPageURL}/billing`
    this.Button_CreateBill = new Element(
      global.page,
      this.page.getByRole('button', { name: BillingTabStrings.Button_CreateBill }),
      BillingTabStrings.Button_CreateBill
    )
    this.Button_CreateInvoice = new Element(
      global.page,
      this.page.getByRole('button', { name: BillingTabStrings.Button_CreateInvoice }),
      BillingTabStrings.Button_CreateInvoice
    )
    this.DataTable_Bills = new ClaimsPortalDataTable(
      global,
      `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]`,
      1
    )
    this.DataTable_Invoices = new ClaimsPortalDataTable(
      global,
      `#root div:nth-child(2 of div[id^="card"]) > div[id$="_content"]`,
      1
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_Bills.WaitForRowsToLoad()
  }
}
