import { GlobalRuleItem } from './clientPortalGlobalRuleItem.js'

export class GlobalRuleSet {
  combinator: string
  readonly inverted: boolean
  items: GlobalRuleItem[]
  attributeName: string
  attributeDescription: boolean
  constructor({
    combinator = '', // and/or
    inverted = false,
    items = [],
    attributeName = '', // isFastPath
    attributeDescription = true,
  }) {
    this.combinator = combinator
    this.inverted = inverted
    this.items = items
    this.attributeName = attributeName
    this.attributeDescription = attributeDescription
  }
}
