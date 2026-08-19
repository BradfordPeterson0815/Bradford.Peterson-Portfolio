import { ClientPortalLocation } from './clientPortalLocation.js'
import { ClientPortalLocationAbstract } from './clientPortalLocationAbstract.js'

export interface ClientPortalWeatherEvent {
  name: string
  catCode: string
  lossType: string
  startDate: string
  endDate: string
  affectedAbstract: ClientPortalLocationAbstract[]
  affectedLocations: ClientPortalLocation[]
}
