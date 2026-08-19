import { ClientPortalLocation } from './clientPortalLocation.js'

export class ServiceArea {
  name: string
  state: string
  area: string
  enabled: boolean
  color: string
  countiesList: string[]
  countiesToAdd: ClientPortalLocation[]
  stateToAdd: ClientPortalLocation[]
  emails: string[]
  attachedVendors: string[]
  coordinates: string
  id: string
  constructor(
    name = '',
    state = '',
    area = '',
    enabled = false,
    color = '',
    countiesList = [],
    countiesToAdd = [],
    stateToAdd = [],
    emails = [],
    attachedVendors = [],
    coordinates = '',
    id = ''
  ) {
    this.name = name
    this.state = state
    this.area = area
    this.enabled = enabled
    this.color = color
    this.countiesList = countiesList
    this.countiesToAdd = countiesToAdd
    this.stateToAdd = stateToAdd
    this.emails = emails
    this.attachedVendors = attachedVendors
    this.coordinates = coordinates
    this.id = id
  }
}
