import { SingerPlumbingTypes } from './clients/singer/bpSingerConstants.js'
import { EaglePlumbingTypes } from './clients/eagle/bpEagleConstants.js'

export class BPPlumbing {
  type: EaglePlumbingTypes | SingerPlumbingTypes
  link: string
  result: string
  constructor(type: EaglePlumbingTypes | SingerPlumbingTypes, link: string, result: string) {
    this.type = type
    this.link = link
    this.result = result
  }
}
