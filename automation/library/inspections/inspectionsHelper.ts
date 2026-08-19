import { InspectionsClaim } from './inpectionsClaim.js'
import { CannedClaimTypes } from './inspectionsConstants.js'

export function FetchCannedClaim(cannedClaim: CannedClaimTypes) {
  switch (cannedClaim) {
    case CannedClaimTypes.DefaultTestClaim: {
      return {
        primaryContact: 'Test AAN',
        claimNumber: 'redacted',
        inspectionStatus: 'No Inspections',
        policyNumber: 'redacted',
        propertyAddress_Address1: 'redacted',
        propertyAddress_CityStateZip: `redacted`,
        lossDescription: 'Test Description',
      } as InspectionsClaim
    }
  }
}
