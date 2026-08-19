import { ViewIncludes, ViewTypes } from './claimsPortalConstants.js'

export class ClaimsPortalView {
  readonly type: ViewTypes
  readonly title: string
  readonly description: string
  readonly includes: ViewIncludes[]

  constructor(type: ViewTypes, title: string, description: string, includes: ViewIncludes[]) {
    this.type = type
    this.title = title
    this.description = description
    this.includes = includes
  }

  HasViewInclude(includeToCheck: ViewIncludes) {
    return this.includes.includes(includeToCheck)
  }

  GetIncludeList() {
    const list = this.includes.join(', ')
    return list
  }

  GenerateTitleDescriptionSearch() {
    const titleDescriptionSearch = `${this.title}${this.description}`
    return titleDescriptionSearch
  }

  GenerateFullSearch() {
    const fullSearch = `${this.title}${this.description}${this.GetIncludeList()}`
    return fullSearch
  }
}
