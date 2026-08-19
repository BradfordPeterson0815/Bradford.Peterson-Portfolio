import { LiabilityTypes } from './clients/eagle/bpEagleConstants.js'

export class BPLiability {
  type: LiabilityTypes
  id: string
  echo: string
  result: string
  constructor(type: LiabilityTypes, id: string, echo: string, result: string) {
    this.type = type
    this.id = id
    this.echo = echo
    this.result = result
  }
}
