import { SingerInteriorDamageTypes } from './clients/singer/bpSingerConstants.js'

export class BPInteriorDamage {
  type: SingerInteriorDamageTypes
  id: string
  echo: string
  result: string
  constructor(type: SingerInteriorDamageTypes, id: string, echo: string, result: string) {
    this.type = type
    this.id = id
    this.echo = echo
    this.result = result
  }
}
