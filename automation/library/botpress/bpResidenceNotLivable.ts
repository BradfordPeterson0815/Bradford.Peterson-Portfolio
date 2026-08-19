import { SingerResidenceNotLivableTypes } from './clients/singer/bpSingerConstants.js'
import { EagleResidenceNotLivableTypes } from './clients/eagle/bpEagleConstants.js'

export class BPResidenceNotLivable {
  type: EagleResidenceNotLivableTypes | SingerResidenceNotLivableTypes
  link: string
  echo: string
  result: string
  constructor(
    type: EagleResidenceNotLivableTypes | SingerResidenceNotLivableTypes,
    link: string,
    echo: string,
    result: string
  ) {
    this.type = type
    this.link = link
    this.echo = echo
    this.result = result
  }
}
