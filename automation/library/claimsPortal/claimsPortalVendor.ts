export class ClaimsPortalVendor {
  name: string
  email: string
  roles: string[]
  redacted: string
  description: string
  claimAssignments: string[]
  jobAssignments: string[]
  constructor(
    name: string,
    email: string,
    roles: string[],
    redacted: string,
    description: string,
    claimAssignments: string[],
    jobAssignments: string[]
  ) {
    this.name = name
    this.email = email
    this.roles = roles
    this.redacted = redacted
    this.description = description
    this.claimAssignments = claimAssignments
    this.jobAssignments = jobAssignments
  }
}
