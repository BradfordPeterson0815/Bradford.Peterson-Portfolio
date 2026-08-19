import { BaseRule } from './clientPortalBaseRule.js'

export class NumericRule extends BaseRule {
  field: string
  fieldSource: string
  operator: string // is, isnot, greater than, less than
  value: number
  constructor(field: string, fieldSource: string, operator: string, value: number) {
    super('Numeric')
    this.field = field
    this.fieldSource = fieldSource
    this.operator = operator
    this.value = value
  }
}
