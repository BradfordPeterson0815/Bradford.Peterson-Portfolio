export class DelegatePortalNoteMention {
  readonly contactName: string
  roles: string[]

  constructor(name: string) {
    this.contactName = name
    this.roles = []
  }
}
