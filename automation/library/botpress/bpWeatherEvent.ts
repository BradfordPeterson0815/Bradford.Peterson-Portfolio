import { BPLocation } from './bpLocation.js'
import {
  EagleDamageReasonTypes,
  EagleWeatherEventTypes,
} from './clients/eagle/bpEagleConstants.js'

export class BPWeatherEvent {
  type!: EagleWeatherEventTypes
  name!: string
  catCode!: string
  locations: BPLocation[] = []
  lossType!: EagleDamageReasonTypes
  startDate!: Date
  endDate!: Date
}
