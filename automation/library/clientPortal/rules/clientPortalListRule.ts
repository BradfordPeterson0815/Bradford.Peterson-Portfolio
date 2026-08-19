import { BaseRule } from './clientPortalBaseRule.js'

export class ListRule extends BaseRule {
  field: string
  fieldSource: string
  operator: string
  conditions: string | string[]
  hasConditionArray: boolean
  constructor(
    field: string,
    fieldSource: string,
    operator: string, //isoneof, hasallof, hasexactly, equals, greaterthan, lessthan
    conditions: string | string[]
  ) {
    super('List')
    this.field = field
    this.fieldSource = fieldSource
    this.operator = operator
    this.conditions = conditions
    this.hasConditionArray = Array.isArray(conditions)
  }
}
