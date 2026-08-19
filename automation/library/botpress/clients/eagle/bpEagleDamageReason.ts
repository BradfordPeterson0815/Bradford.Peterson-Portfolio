import { EagleDamageReasonTypes } from './bpEagleConstants.js'

export class EagleDamageReason {
  type: EagleDamageReasonTypes
  link: string
  result: string
  constructor(type: EagleDamageReasonTypes, link: string, result: string) {
    this.type = type
    this.link = link
    this.result = result
  }
}
