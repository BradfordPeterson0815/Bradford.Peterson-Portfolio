export class MRUListItem {
  readonly href: string
  readonly type: string
  readonly value: string

  constructor(href: string, type: string, value: string) {
    this.href = href
    this.type = type
    this.value = value
  }
}
