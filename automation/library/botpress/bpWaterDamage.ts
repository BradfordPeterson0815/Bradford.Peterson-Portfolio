import { SingerWaterDamageTypes } from './clients/singer/bpSingerConstants.js'
import { EagleWaterDamageTypes } from './clients/eagle/bpEagleConstants.js'

export class BPWaterDamage {
  type: EagleWaterDamageTypes | SingerWaterDamageTypes
  link: string
  result: string
  constructor(
    type: EagleWaterDamageTypes | SingerWaterDamageTypes,
    link: string,
    result: string
  ) {
    this.type = type
    this.link = link
    this.result = result
  }
}
