import MailosaurClient from 'mailosaur'
import { Browser } from 'playwright/test'
import { shared, userPortal } from '../../environments/env.ceylon.js'
import { UserPortalAuth0LoginPage } from './pages/userPortalAuth0LoginPage.js'
import { UserPortalYourActiveClaimsAndJobsPage } from './pages/userPortalYourActiveClaimsAndJobs.js'
import { UserPortalClaim } from './userPortalClaim.js'
import {
  CannedClaimTypes,
  CannedJobTypes,
  DataTable_ColumnName_Index,
  DataTable_Columns,
  DataTable_Columns_Type,
} from './userPortalConstants.js'
import { UserPortalGlobal } from './userPortalGlobal.js'
import { UserPortalJob } from './userPortalJob.js'
import { MediaCardData } from './userPortalMediaCard.js'
import {
  CeylonEnvironmentType,
  NetworkSpeedConfig,
  NetworkSpeedType,
} from '../shared/constants.js'

export async function Launch(
  browser: Browser,
  environment: string,
  network: NetworkSpeedType = NetworkSpeedType.NoThrottle,
  email = userPortal.USER_EMAIL,
  friendly = userPortal.USER_FRIENDLY
) {
  const global = new UserPortalGlobal(browser, environment, userPortal.BASE_URL, email, friendly)
  global.context = await global.browser.newContext({ acceptDownloads: true })
  global.context.grantPermissions(['clipboard-read', 'clipboard-write'])
  global.page = await global.context.newPage()

  // launch the UserPortal page
  await global.page.goto(global.baseUrl)

  // check to see if we are being prompted to login
  const loginPage = new UserPortalAuth0LoginPage(global)
  const loginIsPresent = (await loginPage.Title.count()) > 0
  if (loginIsPresent) {
    // handle the UserPortal Login dialog
    await loginPage.LoginWithEmail(email)
    const noOlderThan = new Date(Date.now())
    // Handle code retrieval as needed
    const code = await GetAuthenticationCode(email, noOlderThan)
    if (code === undefined) {
      throw new Error('No code was found on the email server')
    }
    await loginPage.ContinueLoginWithCode(code)
    global.performedAuthenticationOnLaunch = true
  }
  if (network != NetworkSpeedType.NoThrottle) {
    const cdpSession = await global.context.newCDPSession(global.page)
    switch (network) {
      case NetworkSpeedType.Good2G:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.Good2G)
        break
      case NetworkSpeedType.SuperSlow:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.SuperSlow)
        break
      case NetworkSpeedType.WiFi:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.WiFi)
        break
    }
    await cdpSession.detach()
  }
  const activeClaimsAndJobsPage = new UserPortalYourActiveClaimsAndJobsPage(global)
  await activeClaimsAndJobsPage.WaitForLoad()
  await activeClaimsAndJobsPage.page.waitForTimeout(1000)
  return { global, activeClaimsAndJobsPage }
}

export async function LaunchClaim(
  browser: Browser,
  environment: string,
  claim: UserPortalClaim,
  network: NetworkSpeedType = NetworkSpeedType.NoThrottle,
  email = userPortal.USER_EMAIL,
  friendly = userPortal.USER_FRIENDLY
) {
  const { global, activeClaimsAndJobsPage } = await Launch(
    browser,
    environment,
    network,
    email,
    friendly
  )
  const detailsPage = await activeClaimsAndJobsPage.OpenClaim(claim)
  return { global, detailsPage }
}

export async function LaunchJob(
  browser: Browser,
  environment: string,
  job: UserPortalJob,
  network: NetworkSpeedType = NetworkSpeedType.NoThrottle,
  email = userPortal.USER_EMAIL,
  friendly = userPortal.USER_FRIENDLY
) {
  const { global, activeClaimsAndJobsPage } = await Launch(
    browser,
    environment,
    network,
    email,
    friendly
  )
  const detailsPage = await activeClaimsAndJobsPage.OpenJob(job)
  return { global, detailsPage }
}

export async function GetAuthenticationCode(email: string, noOlderThan: Date) {
  const apiKey = shared.MAILOSAURUS_API_KEY
  const inboxServerId = shared.MAILOSAURUS_INBOX_SERVER_ID
  const sentFrom = shared.MAILOSAURUS_CODE_EMAIL_SENDER
  const subject = userPortal.MAILOSAURUS_CODE_EMAIL_SUBJECT
  const body = shared.MAILOSAURUS_CODE_EMAIL_TARGET_BODY
  const mailosaur = new MailosaurClient(apiKey)
  const result = await mailosaur.messages.search(
    inboxServerId,
    {
      sentTo: email,
      sentFrom: sentFrom,
      subject: subject,
      body: body,
    },
    {
      receivedAfter: noOlderThan,
      timeout: 60000, // 60 seconds (in milliseconds)
      page: 0,
      itemsPerPage: 10,
    }
  )

  if (result.items !== undefined) {
    // Get the most recent message (the first one in the list)
    const latestMessage = result.items[0]

    // Get the full message object
    const message = await mailosaur.messages.getById(latestMessage.id)

    if (message.html === undefined) {
      throw new Error('No HTML content was found in the code email')
    }
    if (message.html.codes === undefined) {
      throw new Error('No code was found in the email HTML body')
    }
    const extractedCode = message.html.codes[0]

    // delete the email
    await mailosaur.messages.del(latestMessage.id)

    // return the email code
    return extractedCode.value
  }
}
export function FetchCannedClaim(environment: string, cannedClaim: CannedClaimTypes) {
  switch (environment) {
    case CeylonEnvironmentType.Company_QA:
      return FetchCannedClaimForQAEnvironment(cannedClaim)
    case CeylonEnvironmentType.Company_Test:
      return FetchCannedClaimForTestEnvironment(cannedClaim)
    default:
      throw new Error(`No Environment Type has been defined for: ${environment} `)
  }
}

export function FetchCannedClaimForQAEnvironment(cannedClaim: CannedClaimTypes) {
  switch (cannedClaim) {
    case CannedClaimTypes.DefaultTestClaim: {
      const newClaim = new UserPortalClaim('Redacted')
      newClaim.claimProcess.status = 'Inspection'
      newClaim.claimProcess.coordinator = 'test_a@test.company.com'
      newClaim.claimProcess.fieldAgentName = 'Automation FieldAgent'
      newClaim.claimProcess.scheduledAppointmentDate = '02/02/2026 10:50 AM'
      newClaim.claimDetails.lossDate = 'Redacted'
      newClaim.claimDetails.lossType = 'Fire'
      newClaim.claimDetails.lossDescription = 'Wow what a fire'
      newClaim.lossLocation.street = 'Redacted'
      newClaim.lossLocation.secondaryStreet = 'Apt A'
      newClaim.lossLocation.city = 'Redacted'
      newClaim.lossLocation.county = 'Spokane'
      newClaim.lossLocation.state = 'WA'
      newClaim.lossLocation.zipCode = 'Redacted'
      newClaim.testData.claimVisualizerCount = 5
      newClaim.testData.document = 'Test Document'
      newClaim.testData.versionedDocument = 'Versioned Document'
      newClaim.testData.documentDescription = 'Test File Description'
      newClaim.testData.mediaCards.push({
        filename: 'Versioned Media-8befm.jpg',
        title: 'Versioned Media',
        description: 'V1',
      } as MediaCardData)
      newClaim.testData.mediaCards.push({
        filename: 'Versioned Media-yeew1.jpg',
        title: 'Versioned Media',
        description: 'V2',
      } as MediaCardData)
      newClaim.testData.mediaCards.push({
        filename: 'Test Media-8ut1.png',
        title: 'Test Media',
        description: 'Test File Description',
      } as MediaCardData)
      newClaim.testData.claimContact = {
        name: 'Company Claims Portal',
        phone: 'redacted',
        email: 'redacted',
      }
      newClaim.testData.estimateContact = {
        name: 'Your Field Agent',
        phone: 'Phone Unavailable',
        email: 'automation+fieldadjuster@redacted.mailosaur.net',
      }
      newClaim.testData.jobContact = {
        name: 'Company Restoration',
        phone: 'redacted',
        email: 'redacted',
      }
      return newClaim
    }
  }
}

export function FetchCannedClaimForTestEnvironment(cannedClaim: CannedClaimTypes) {
  switch (cannedClaim) {
    case CannedClaimTypes.DefaultTestClaim: {
      const newClaim = new UserPortalClaim('Redacted')
      newClaim.claimProcess.status = 'Inspection'
      newClaim.claimProcess.coordinator = 'test_a@test.company.com'
      newClaim.claimProcess.fieldAgentName = 'Automation FieldAgent'
      newClaim.claimProcess.scheduledAppointmentDate = 'redacted'
      newClaim.claimDetails.lossDate = 'Redacted'
      newClaim.claimDetails.lossType = 'Fire'
      newClaim.claimDetails.lossDescription = 'Wow what a fire'
      newClaim.lossLocation.street = 'Redacted'
      newClaim.lossLocation.secondaryStreet = 'Apt A'
      newClaim.lossLocation.city = 'Redacted'
      newClaim.lossLocation.county = 'Spokane'
      newClaim.lossLocation.state = 'WA'
      newClaim.lossLocation.zipCode = 'Redacted'
      newClaim.testData.claimVisualizerCount = 5
      newClaim.testData.document = 'Test Document'
      newClaim.testData.versionedDocument = 'Versioned Document'
      newClaim.testData.documentDescription = 'Test File Description'
      newClaim.testData.mediaCards.push({
        filename: 'Versioned Media.jpg',
        title: 'Versioned Media',
        description: 'V1',
      } as MediaCardData)
      newClaim.testData.mediaCards.push({
        filename: 'Versioned Media.jpg',
        title: 'Versioned Media',
        description: 'V2',
      } as MediaCardData)
      newClaim.testData.mediaCards.push({
        filename: 'Test Media.png',
        title: 'Test Media',
        description: 'Test File Description',
      } as MediaCardData)
      newClaim.testData.claimContact = {
        name: 'Company Claims Portal',
        phone: 'redacted',
        email: 'redacted',
      }
      newClaim.testData.estimateContact = {
        name: 'Your Field Agent',
        phone: 'Phone Unavailable',
        email: 'automation+fieldadjuster@redacted.mailosaur.net',
      }
      newClaim.testData.jobContact = {
        name: 'Company Restoration',
        phone: 'redacted',
        email: 'redacted',
      }
      return newClaim
    }
  }
}

export function FetchCannedJob(environment: string, cannedJob: CannedJobTypes) {
  switch (environment) {
    case CeylonEnvironmentType.Company_QA:
      return FetchCannedJobForQAEnvironment(cannedJob)
    case CeylonEnvironmentType.Company_Test:
      return FetchCannedJobForTestEnvironment(cannedJob)
    default:
      throw new Error(`No Environment Type has been defined for: ${environment} `)
  }
}

export function FetchCannedJobForQAEnvironment(cannedJob: CannedJobTypes) {
  switch (cannedJob) {
    case CannedJobTypes.DefaultTestJob: {
      const newJob = new UserPortalJob('Redacted', 'Redacted')
      newJob.jobDetails.associatedClaim = 'Redacted'
      newJob.jobDetails.type = 'Emergency Services'
      newJob.jobDetails.services = ['Tarping']
      newJob.jobDetails.description = 'Test Job Description'
      newJob.jobAssignments.coordinator = 'test_a@test.company.com'
      newJob.jobAssignments.projectManager = 'Redacted'
      newJob.jobAssignments.approver = 'Unassigned'
      newJob.jobAssignments.dispatcher = 'Unassigned'
      newJob.jobAssignments.fieldTechs = []
      newJob.jobAssignments.subcontractors = ['Automation Subcontractor']
      newJob.jobLocation.fullAddress = 'Redacted'
      newJob.jobLocation.addressLine1 = 'Redacted'
      newJob.jobLocation.addressLine2 = 'Apt A'
      newJob.jobLocation.addressType = 'Home'
      newJob.jobLocation.city = 'Redacted'
      newJob.jobLocation.county = 'Spokane'
      newJob.jobLocation.state = 'WA'
      newJob.jobLocation.zipCode = 'Redacted'
      newJob.jobLocation.map = 'Open in Google Maps'
      newJob.jobLocation.mapStreet = 'Redacted a'
      newJob.contact.name = 'Test Contact'
      newJob.contact.phone = 'Redacted'
      newJob.contact.email = 'bpeterson+testcontact@company.com'
      newJob.testData.jobVisualizerCount = 4
      newJob.testData.document = 'Test Document'
      newJob.testData.documentDescription = 'Test File Description'
      newJob.testData.versionedDocument = 'Versioned Document'
      newJob.testData.mediaCards.push({
        filename: 'Versioned Media-23b1n.jpg',
        title: 'Versioned Media',
        description: 'V1',
      } as MediaCardData)
      newJob.testData.mediaCards.push({
        filename: 'Versioned Media-i2q4ak.jpg',
        title: 'Versioned Media',
        description: 'V2',
      } as MediaCardData)
      newJob.testData.mediaCards.push({
        filename: 'Test Media-w0lgb.png',
        title: 'Test Media',
        description: 'Test File Description',
      } as MediaCardData)
      newJob.testData.claimContact = {
        name: 'Company Claims Portal',
        phone: 'redacted',
        email: 'redacted',
      }
      newJob.testData.jobContact = {
        name: 'Company Restoration',
        phone: 'redacted',
        email: 'redacted',
      }
      return newJob
    }
  }
}

export function FetchCannedJobForTestEnvironment(cannedJob: CannedJobTypes) {
  switch (cannedJob) {
    case CannedJobTypes.DefaultTestJob: {
      const newJob = new UserPortalJob('Redacted', 'Redacted')
      newJob.jobDetails.associatedClaim = 'Redacted'
      newJob.jobDetails.type = 'Emergency Services'
      newJob.jobDetails.services = ['Tarping']
      newJob.jobDetails.description = 'Test Job Description'
      newJob.jobAssignments.coordinator = 'test_a@test.company.com'
      newJob.jobAssignments.projectManager = 'Redacted'
      newJob.jobAssignments.approver = 'Unassigned'
      newJob.jobAssignments.dispatcher = 'Unassigned'
      newJob.jobAssignments.fieldTechs = []
      newJob.jobAssignments.subcontractors = ['Automation Subcontractor']
      newJob.jobLocation.fullAddress = 'Redacted'
      newJob.jobLocation.addressLine1 = 'Redacted'
      newJob.jobLocation.addressLine2 = 'Apt A'
      newJob.jobLocation.addressType = 'Home'
      newJob.jobLocation.city = 'Redacted'
      newJob.jobLocation.county = 'Spokane'
      newJob.jobLocation.state = 'WA'
      newJob.jobLocation.zipCode = 'Redacted'
      newJob.jobLocation.map = 'Open in Google Maps'
      newJob.jobLocation.mapStreet = 'Redacted a'
      newJob.contact.name = 'Test Contact'
      newJob.contact.phone = 'Redacted'
      newJob.contact.email = 'bpeterson+testcontact@company.com'
      newJob.testData.jobVisualizerCount = 4
      newJob.testData.document = 'Test Document'
      newJob.testData.documentDescription = 'Test File Description'
      newJob.testData.versionedDocument = 'Versioned Document'
      newJob.testData.document = 'Test Document'
      newJob.testData.documentDescription = 'Test File Description'
      newJob.testData.mediaCards.push({
        filename: 'Versioned Media.jpg',
        title: 'Versioned Media',
        description: 'V1',
      } as MediaCardData)
      newJob.testData.mediaCards.push({
        filename: 'Versioned Media.jpg',
        title: 'Versioned Media',
        description: 'V2',
      } as MediaCardData)
      newJob.testData.mediaCards.push({
        filename: 'Test Media.png',
        title: 'Test Media',
        description: 'Test File Description',
      } as MediaCardData)
      newJob.testData.claimContact = {
        name: 'Company Claims Portal',
        phone: 'redacted',
        email: 'redacted',
      }
      newJob.testData.jobContact = {
        name: 'Company Restoration',
        phone: 'redacted',
        email: 'redacted',
      }
      return newJob
    }
  }
}

export function LookupDataColumn(
  columnType: DataTable_Columns_Type,
  columnNameIndex: DataTable_ColumnName_Index = DataTable_ColumnName_Index.Access
) {
  switch (columnType) {
    case DataTable_Columns_Type.Documents_File:
      return DataTable_Columns.File[columnNameIndex]
    case DataTable_Columns_Type.Documents_Description:
      return DataTable_Columns.Description[columnNameIndex]
    case DataTable_Columns_Type.Documents_FileName:
      return DataTable_Columns.Filename[columnNameIndex]
    case DataTable_Columns_Type.Documents_Created:
      return DataTable_Columns.Created[columnNameIndex]
    case DataTable_Columns_Type.Documents_Download:
      return DataTable_Columns.Download[columnNameIndex]
    case DataTable_Columns_Type.Claims_ClaimNumber:
      return DataTable_Columns.ClaimNumber[columnNameIndex]
    case DataTable_Columns_Type.Claims_LossType:
      return DataTable_Columns.LossType[columnNameIndex]
    case DataTable_Columns_Type.Claims_LossDate:
      return DataTable_Columns.LossDate[columnNameIndex]
    case DataTable_Columns_Type.Claims_Location:
      return DataTable_Columns.ClaimLocation[columnNameIndex]
    case DataTable_Columns_Type.Claims_Location_Address:
      return 'Address'
    case DataTable_Columns_Type.Jobs_Location_City:
    case DataTable_Columns_Type.Claims_Location_City:
      return 'City'
    case DataTable_Columns_Type.Jobs_Location_State:
    case DataTable_Columns_Type.Claims_Location_State:
      return 'State'
    case DataTable_Columns_Type.Jobs_Location_ZipCode:
    case DataTable_Columns_Type.Claims_Location_ZipCode:
      return 'Zip Code'
    case DataTable_Columns_Type.Jobs_JobID:
      return DataTable_Columns.JobId[columnNameIndex]
    case DataTable_Columns_Type.Jobs_Type:
      return DataTable_Columns.JobType[columnNameIndex]
    case DataTable_Columns_Type.Jobs_Services:
      return DataTable_Columns.JobServices[columnNameIndex]
    case DataTable_Columns_Type.Jobs_Description:
      return DataTable_Columns.JobDescription[columnNameIndex]
    case DataTable_Columns_Type.Jobs_Location:
      return DataTable_Columns.JobLocation[columnNameIndex]
    default:
      throw new Error(`No data column type has been defined for: ${columnType} `)
  }
}

export function DateFilterFormatting(date: Date): string {
  const padStart = (value: number): string => value.toString().padStart(2, '0')
  const dateString = `${date.getFullYear()}-${padStart(date.getMonth() + 1)}-${padStart(date.getDate())}`
  return dateString
}
