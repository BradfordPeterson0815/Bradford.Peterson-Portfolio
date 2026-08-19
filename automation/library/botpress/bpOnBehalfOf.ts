import { SingerOnBehalfOfTypes } from './clients/singer/bpSingerConstants.js'
import { EagleOnBehalfOfTypes } from './clients/eagle/bpEagleConstants.js'

export class BPOnBehalfOf {
  type: EagleOnBehalfOfTypes | SingerOnBehalfOfTypes
  link: string
  result: string
  constructor(
    type: EagleOnBehalfOfTypes | SingerOnBehalfOfTypes,
    link: string,
    result: string
  ) {
    this.type = type
    this.link = link
    this.result = result
  }
}
