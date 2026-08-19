import { SingerDamageReasonTypes } from './bpSingerConstants.js'

export class SingerDamageReason {
  type: SingerDamageReasonTypes
  link: string
  result: string
  constructor(type: SingerDamageReasonTypes, link: string, result: string) {
    this.type = type
    this.link = link
    this.result = result
  }
}
