import { GlobalRuleItem } from './clientPortalGlobalRuleItem.js'

export class GlobalRuleGroup {
  combinator: string
  readonly inverted: boolean
  items: GlobalRuleItem[]
  constructor({
    combinator = '', // and/or
    inverted = false,
    items = [],
  }) {
    this.combinator = combinator
    this.inverted = inverted
    this.items = items
  }
}
