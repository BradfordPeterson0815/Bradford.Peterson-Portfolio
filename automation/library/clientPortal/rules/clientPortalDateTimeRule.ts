import { BaseRule } from './clientPortalBaseRule.js'

export class DateTimeRule extends BaseRule {
  field: string
  fieldSource: string
  operator: string
  value: number
  timeframe: string
  constructor(
    field: string,
    fieldSource: string,
    operator: string, //isAfter. isBefore
    value: number, // number of timeframe units
    timeframe: string // minutes, hours, days, weeks, years
  ) {
    super('DateTime')
    this.field = field
    this.fieldSource = fieldSource
    this.operator = operator
    this.value = value
    this.timeframe = timeframe
  }
}
