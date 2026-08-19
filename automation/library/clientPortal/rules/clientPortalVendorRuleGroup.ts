import { VendorRule } from './clientPortalVendorRule.js'

export class VendorRuleGroup {
  combinator: string
  inverted: boolean
  assignment: string
  hasParent: boolean
  rules: VendorRule[]
  constructor({
    combinator = 'And', // and/or
    inverted = false,
    assignment = '',
    rules = [],
    hasParent = false,
  }) {
    this.combinator = combinator
    this.inverted = inverted
    this.rules = rules
    this.assignment = assignment
    this.hasParent = hasParent
  }
}
