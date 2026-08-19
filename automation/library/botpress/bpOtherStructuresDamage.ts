import { OtherStructuresDamageTypes } from './clients/eagle/bpEagleConstants.js'

export class BPOtherStructuresDamage {
  type: OtherStructuresDamageTypes
  id: string
  echo: string
  result: string
  constructor(type: OtherStructuresDamageTypes, id: string, echo: string, result: string) {
    this.type = type
    this.id = id
    this.echo = echo
    this.result = result
  }
}
