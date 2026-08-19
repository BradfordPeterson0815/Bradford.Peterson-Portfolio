export class ClaimsPortalNoteParameter {
  readonly parameter: string
  value: string

  constructor(name: string) {
    this.parameter = name
    this.value = ''
  }
}
