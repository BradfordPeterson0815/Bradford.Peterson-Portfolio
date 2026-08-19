import { GlobalRule } from './clientPortalGlobalRule.js'
import { GlobalRuleGroup } from './clientPortalGlobalRuleGroup.js'

export class GlobalRuleItem {
  type: string
  item: GlobalRule | GlobalRuleGroup
  dataLevel: number
  dataPath: string
  constructor(
    type: string,
    item: GlobalRule | GlobalRuleGroup,
    dataLevel: number,
    dataPath: string
  ) {
    this.type = type
    this.item = item
    this.dataLevel = dataLevel
    this.dataPath = dataPath
  }
}
