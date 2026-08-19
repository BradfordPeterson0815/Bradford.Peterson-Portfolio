import { SingerDamageAreaTypes } from './clients/singer/bpSingerConstants.js'
import { EagleDamageAreaTypes } from './clients/eagle/bpEagleConstants.js'

export class BPDamageArea {
  type: EagleDamageAreaTypes | SingerDamageAreaTypes
  id: string
  echo: string
  result: string
  additional: string
  constructor(
    type: EagleDamageAreaTypes | SingerDamageAreaTypes,
    id: string,
    echo: string,
    result: string,
    additional: string = ''
  ) {
    this.type = type
    this.id = id
    this.echo = echo
    this.result = result
    this.additional = additional
  }
}
