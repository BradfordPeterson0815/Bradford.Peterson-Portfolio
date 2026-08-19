import { SingerDamageReasonTypes } from './clients/singer/bpSingerConstants.js'
import { EagleDamageReasonTypes } from './clients/eagle/bpEagleConstants.js'

export class BPPolicy {
  policyNumber!: string
  firstName!: string
  lastName!: string
  houseNumber!: string
  zip!: string
  email!: string
  phoneNumber!: string
  damageReason!: EagleDamageReasonTypes | SingerDamageReasonTypes
  lossDateDelta!: number
  state!: string
}
