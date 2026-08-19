export class ClaimsPortalLineItem {
  label: string
  value: number
  formattedValue: string
  constructor(label: string, value: number, formattedValue: string) {
    this.label = label
    this.value = value
    this.formattedValue = formattedValue
  }
}
