import { InspectionsGlobal } from '../inspectionsGlobal.js'

export class InspectionsBase {
  readonly global: InspectionsGlobal

  constructor(global: InspectionsGlobal) {
    this.global = global
  }
}
