import { KeyValue } from './clientPortalKeyValue.js'
import { ServiceArea } from './clientPortalServiceArea.js'
import { VendorRuleGroup } from './rules/clientPortalVendorRuleGroup.js'

export class Vendor {
  name: string
  internalName: string
  displayEmail: string
  notificationEmail: string
  displayPhone: string
  notificationPhone: string
  website: string
  enabled: boolean | null
  capacities: KeyValue[]
  additionalProperties: KeyValue[]
  ruleGroups: VendorRuleGroup[]
  ruleTest: VendorRuleGroup | null
  attachedServiceAreas: ServiceArea[]
  id: string
  constructor(
    name = '',
    internalName = '',
    displayEmail = '',
    notificationEmail = '',
    displayPhone = '',
    notificationPhone = '',
    website = '',
    enabled = null, // currently backward - false will enable, true will disable
    capacities = [],
    additionalProperties = [],
    ruleGroups = [],
    ruleTest = null,
    attachedServiceAreas = []
  ) {
    this.name = name
    this.internalName = internalName
    this.displayEmail = displayEmail
    this.notificationEmail = notificationEmail
    this.displayPhone = displayPhone
    this.notificationPhone = notificationPhone
    this.website = website
    this.enabled = enabled
    this.capacities = capacities
    this.additionalProperties = additionalProperties
    this.ruleGroups = ruleGroups
    this.ruleTest = ruleTest
    this.attachedServiceAreas = attachedServiceAreas
    this.id = ''
  }
}
