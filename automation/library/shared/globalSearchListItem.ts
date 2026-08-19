import { GlobalSearchItemTypes } from '../claimsPortal/claimsPortalConstants.js'

export class GlobalSearchListItem {
  readonly type: GlobalSearchItemTypes
  readonly href: string
  readonly category: string
  readonly detail: string

  constructor(type: GlobalSearchItemTypes, href: string, category: string, detail: string = '') {
    this.type = type
    this.href = href
    this.category = category
    this.detail = detail
  }
}
