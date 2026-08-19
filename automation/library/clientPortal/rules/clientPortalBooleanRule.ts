import { BaseRule } from './clientPortalBaseRule.js'

export class BooleanRule extends BaseRule {
  field: string
  fieldSource: string
  operator: string
  condition: string
  constructor(field: string, fieldSource: string, condition: string) {
    super('Boolean')
    this.field = field
    this.fieldSource = fieldSource
    this.operator = 'is'
    this.condition = condition
  }
}
