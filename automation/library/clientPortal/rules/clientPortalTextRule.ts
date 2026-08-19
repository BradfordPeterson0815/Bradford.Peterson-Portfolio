import { BaseRule } from './clientPortalBaseRule.js'

export class TextRule extends BaseRule {
  field: string
  fieldSource: string
  operator: string // is, isnot, contains, begins with, ends with
  value: string
  constructor(field: string, fieldSource: string, operator: string, value: string) {
    super('Text')
    this.field = field
    this.fieldSource = fieldSource
    this.operator = operator
    this.value = value
  }
}
