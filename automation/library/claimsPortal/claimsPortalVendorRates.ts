export class ClaimsPortalVendorRates {
  name: string
  isTemplate: boolean
  id: string
  mechanicalTarpingRates: {
    duringBusinessHours: number
    afterBusinessHours: number
    materialCost: number
  }
  sandbagTarpingRates: {
    duringBusinessHours: number
    afterBusinessHours: number
    materialCost: number
  }
  assignedVendors: string[]
  constructor(name: string, isTemplate: boolean, id: string) {
    this.name = name
    this.isTemplate = isTemplate
    this.id = id
    this.mechanicalTarpingRates = {
      duringBusinessHours: 0,
      afterBusinessHours: 0,
      materialCost: 0,
    }
    this.sandbagTarpingRates = {
      duringBusinessHours: 0,
      afterBusinessHours: 0,
      materialCost: 0,
    }
    this.assignedVendors = []
  }
}
