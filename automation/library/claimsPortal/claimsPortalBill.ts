import { ClaimsPortalLineItem } from './claimsPortalLineItem.js'

export class ClaimsBill {
  idNumber: string
  vendor: string
  description: string
  total: number
  balance: number
  lineItems: ClaimsLineItem[] = []
  constructor(
    idNumber: string,
    vendor: string,
    description: string,
    total: number,
    balance: number,
    lineItems: ClaimsLineItem[]
  ) {
    this.idNumber = idNumber
    this.vendor = vendor
    this.description = description
    this.total = total
    this.balance = balance
    this.lineItems = lineItems
  }
}
