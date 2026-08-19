import { BaseRule } from './clientPortalBaseRule.js'

export class ArrayRule extends BaseRule {
  field: string
  fieldSource: string
  operator: string
  conditions: string | string[]
  hasConditionArray: boolean
  constructor(
    field: string,
    fieldSource: string,
    operator: string, //is, isNot, isOneOf
    conditions: string | string[]
  ) {
    super('Array')
    this.field = field
    this.fieldSource = fieldSource
    this.operator = operator
    this.conditions = conditions
    this.hasConditionArray = Array.isArray(conditions)
  }
}
