import { VendorRuleType } from '../clientPortalConstants.js'
import { VendorRuleGroup } from './clientPortalVendorRuleGroup.js'

export class VendorRuleSet {
  assignment: string
  ruleGroups: VendorRuleGroup[]
  constructor({ ruleGroups = [], assignment = VendorRuleType.Unspecified }) {
    this.ruleGroups = ruleGroups
    this.assignment = assignment
  }
}
