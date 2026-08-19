export class BPPayload {
  userType: string
  policyNumber: string
  conversationContext: string
  producerCode?: string
  firstName?: null | string
  lastName?: null | string
  mockBpServer: boolean = false
  token?: string
  fyiTabUrl?: string
  trainingTabUrl?: string
  mockPolicyApi: boolean = true
  constructor(conversationContext: string, userType: string, policyNumber: string) {
    this.userType = userType
    this.policyNumber = policyNumber
    this.conversationContext = conversationContext
  }
}
