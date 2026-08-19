import { ClaimsPortalLineItem } from './claimsPortalLineItem.js'

export class ClaimsPortalInvoice {
  idNumber: string
  vendor: string
  description: string
  total: number
  balance: number
  lineItems: ClaimsLineItem[] = []
  document: string
  constructor(
    idNumber: string,
    vendor: string,
    description: string,
    total: number,
    balance: number,
    lineItems: ClaimsLineItem[],
    document: string
  ) {
    this.idNumber = idNumber
    this.vendor = vendor
    this.description = description
    this.total = total
    this.balance = balance
    this.lineItems = lineItems
    this.document = document
  }
}
