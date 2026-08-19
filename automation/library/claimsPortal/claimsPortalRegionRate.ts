export class ClaimsPortalRegionRate {
  name: string
  id: string
  surtax: number | null
  baseRates: {
    duringBusinessHours: number
    afterBusinessHours: number
  }
  roofPitchRates: {
    highRoof: number | null
    under7_12: number | null
    between7_12and9_12: number | null
    between10_12and12_12: number | null
    over12_12: number | null
  }
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
  constructor(name: string, id: string) {
    this.name = name
    this.id = id
    this.surtax = null
    this.baseRates = {
      duringBusinessHours: 0,
      afterBusinessHours: 0,
    }
    this.roofPitchRates = {
      highRoof: null,
      under7_12: null,
      between7_12and9_12: null,
      between10_12and12_12: null,
      over12_12: null,
    }
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
  }
}
