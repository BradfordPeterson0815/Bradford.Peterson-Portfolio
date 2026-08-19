import { Browser } from '@playwright/test'
import { claimsPortal } from '../../environments/env.ceylon.js'
import { ClaimsPortalClaim } from './claimsPortalClaim.js'
import {
  CannedClaimTypes,
  CannedJobTypes,
  CannedRegionPricingTypes,
  CannedVendorRatesPricingTypes,
  ContactBookTypes,
  DataGrid_Column_Tuples,
  DataGrid_Column_Type,
  DataTable_ColumnName_Index,
  DataTable_Columns,
  DataTable_Columns_Type,
  LossOfUseStatusType,
} from './claimsPortalConstants.js'
import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { ClaimsPortalJob } from './claimsPortalJob.js'
import { ClaimsPortalRegionRate } from './claimsPortalRegionRate.js'
import { ClaimsPortalVendorRates } from './claimsPortalVendorRates.js'
import { ClaimsPortalAuth0LoginPage } from './pages/claimsPortalAuth0LoginPage.js'
import {
  CeylonEnvironmentType,
  NetworkSpeedConfig,
  NetworkSpeedType,
} from '../shared/constants.js'

export async function Launch(
  browser: Browser,
  environment: string,
  network: NetworkSpeedType = NetworkSpeedType.NoThrottle,
  username: string = environment == CeylonEnvironmentType.Company_Prod ||
  environment == CeylonEnvironmentType.Client_PROD
    ? claimsPortal.USER_ADMIN_EMAIL
    : claimsPortal.USER_EMAIL,
  password: string = environment == CeylonEnvironmentType.Company_Prod ||
  environment == CeylonEnvironmentType.Client_PROD
    ? claimsPortal.USER_ADMIN_PASSWORD
    : claimsPortal.USER_PASSWORD
) {
  const global = new ClaimsPortalGlobal(browser, environment, claimsPortal.BASE_URL, username, password)
  global.context = await global.browser.newContext({ acceptDownloads: true })
  global.context.grantPermissions(['clipboard-read', 'clipboard-write'])
  global.page = await global.context.newPage()

  // launch the Claims Portal page
  await global.page.goto(global.baseUrl)
  await global.page.waitForLoadState()
  await global.page.waitForTimeout(1000)

  // check to see if we are being prompted to login
  const loginPage = new ClaimsPortalAuth0LoginPage(global)
  const loginIsPresent = (await loginPage.Title.count()) > 0
  if (loginIsPresent) {
    // handle the Claims Portal Login dialog
    await loginPage.Login(username, password)
    await global.page.waitForTimeout(5000)
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
  return { global }
}

export function LookupDataColumn(
  columnType: DataTable_Columns_Type,
  columnNameIndex: DataTable_ColumnName_Index = DataTable_ColumnName_Index.Access
) {
  switch (columnType) {
    case DataTable_Columns_Type.Templates_Name:
    case DataTable_Columns_Type.Callbacks_Name:
    case DataTable_Columns_Type.GlobalContacts_Name:
      return DataTable_Columns.Name[columnNameIndex].toString()
    case DataTable_Columns_Type.Templates_Type:
    case DataTable_Columns_Type.Jobs_Type:
    case DataTable_Columns_Type.LossOfUse_Type:
      return DataTable_Columns.Type[columnNameIndex].toString()
    case DataTable_Columns_Type.Callbacks_Status:
    case DataTable_Columns_Type.PortalAccess_Status:
    case DataTable_Columns_Type.LossOfUse_Status:
    case DataTable_Columns_Type.Jobs_Status:
      return DataTable_Columns.Status[columnNameIndex].toString()
    case DataTable_Columns_Type.Callbacks_Entity_ID:
      return DataTable_Columns.EntityID[columnNameIndex].toString()
    case DataTable_Columns_Type.Callbacks_For_Role:
      return DataTable_Columns.ForRole[columnNameIndex].toString()
    case DataTable_Columns_Type.Callbacks_Notes:
      return DataTable_Columns.Notes[columnNameIndex].toString()
    case DataTable_Columns_Type.Callbacks_Contact_Method:
      return DataTable_Columns.ContactMethod[columnNameIndex].toString()
    case DataTable_Columns_Type.Callbacks_Preferred_Time:
      return DataTable_Columns.PreferredTime[columnNameIndex].toString()
    case DataTable_Columns_Type.Callbacks_Date_Requested:
      return DataTable_Columns.DateRequested[columnNameIndex].toString()
    case DataTable_Columns_Type.GlobalContacts_Contacts_Number:
      return DataTable_Columns.ContactsNumber[columnNameIndex].toString()
    case DataTable_Columns_Type.ContactsBook_Name:
    case DataTable_Columns_Type.Contacts_Name:
      return DataTable_Columns.ContactName[columnNameIndex].toString()
    case DataTable_Columns_Type.ContactsBook_Roles:
    case DataTable_Columns_Type.Contacts_Roles:
      return DataTable_Columns.Roles[columnNameIndex].toString()
    case DataTable_Columns_Type.ContactsBook_Preferred_Contact:
    case DataTable_Columns_Type.Contacts_Preferred_Contact:
      return DataTable_Columns.PreferredContact[columnNameIndex].toString()
    case DataTable_Columns_Type.ContactsBook_Data_Source:
    case DataTable_Columns_Type.Contacts_Data_Source:
    case DataTable_Columns_Type.Claims_Data_Source:
      return DataTable_Columns.Data_Source[columnNameIndex].toString()
    case DataTable_Columns_Type.ContactsBook_Description:
    case DataTable_Columns_Type.Contacts_Description:
    case DataTable_Columns_Type.Documents_Description:
    case DataTable_Columns_Type.Jobs_Description:
    case DataTable_Columns_Type.Inspections_Description:
      return DataTable_Columns.Description[columnNameIndex].toString()
    case DataTable_Columns_Type.ContactsBook_License:
      return DataTable_Columns.License[columnNameIndex].toString()
    case DataTable_Columns_Type.ContactsBook_Picture:
      return DataTable_Columns.Picture[columnNameIndex].toString()
    case DataTable_Columns_Type.ContactsBook_Inactive:
    case DataTable_Columns_Type.Contacts_Inactive:
      return 'Inactive'
    case DataTable_Columns_Type.Tags_TagKey:
      return DataTable_Columns.Tag_Key[columnNameIndex].toString()
    case DataTable_Columns_Type.RelatedTags_Resource:
      return DataTable_Columns.Resource[columnNameIndex].toString()
    case DataTable_Columns_Type.RelatedTags_Tag_Value:
      return DataTable_Columns.Value[columnNameIndex].toString()
    case DataTable_Columns_Type.RelatedTags_Color:
      return DataTable_Columns.Color[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_Carrier:
      return DataTable_Columns.Carrier[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_CatCode:
      return DataTable_Columns.CatCode[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_City:
      return DataTable_Columns.City[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_ClaimNumber:
      return DataTable_Columns.ClaimNumber[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_ClaimStatus:
      return DataTable_Columns.ClaimStatus[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_Coordinator:
      return DataTable_Columns.Coordinator[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_County:
      return DataTable_Columns.County[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_DateReceived:
      return DataTable_Columns.DateReceived[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_Email:
      return DataTable_Columns.Email[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_DeskAdjuster:
      return DataTable_Columns.DeskAdjuster[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_FieldAgent:
      return DataTable_Columns.FieldAgent[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_InspectionTech:
      return DataTable_Columns.InspectionTech[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_Reviewer:
      return DataTable_Columns.Reviewer[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_HasJob:
      return DataTable_Columns.HasJob[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_HasLegalRep:
      return DataTable_Columns.HasLegalRep[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_Phone:
      return DataTable_Columns.Phone[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_Policyholder:
      return DataTable_Columns.Policyholder[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_PrimaryContact:
    case DataTable_Columns_Type.Jobs_PrimaryContact:
      return DataTable_Columns.PrimaryContact[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_InAssignQueue:
      return DataTable_Columns.InAssignQueue[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_InspectionCompleted:
      return DataTable_Columns.InspectionCompleted[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_InspectionScheduled:
      return DataTable_Columns.InspectionScheduled[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_LastEvent:
      return DataTable_Columns.LastEvent[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_LossDate:
      return DataTable_Columns.LossDate[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_State:
      return DataTable_Columns.State[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_Tags:
    case DataTable_Columns_Type.Jobs_Tags:
      return DataTable_Columns.Tags[columnNameIndex].toString()
    case DataTable_Columns_Type.Claims_Users:
    case DataTable_Columns_Type.Jobs_Users:
      return DataTable_Columns.Users[columnNameIndex].toString()
    case DataTable_Columns_Type.PortalAccess_Contact:
      return DataTable_Columns.Contact[columnNameIndex].toString()
    case DataTable_Columns_Type.PortalAccess_ContactRoles:
      return DataTable_Columns.ContactRoles[columnNameIndex].toString()
    case DataTable_Columns_Type.PortalAccess_CreatedDate:
      return DataTable_Columns.CreatedDate[columnNameIndex].toString()
    case DataTable_Columns_Type.PortalAccess_LoginCount:
      return DataTable_Columns.LoginCount[columnNameIndex].toString()
    case DataTable_Columns_Type.PortalAccess_LatestLogin:
      return DataTable_Columns.LatestLogin[columnNameIndex].toString()
    case DataTable_Columns_Type.Contacts_Assignee:
      return DataTable_Columns.Assignee[columnNameIndex].toString()
    case DataTable_Columns_Type.Documents_File:
      return DataTable_Columns.FileAlt[columnNameIndex].toString()
    case DataTable_Columns_Type.Documents_FileName:
    case DataTable_Columns_Type.InspectionScreenshots_FileName:
      return DataTable_Columns.FileName[columnNameIndex].toString()
    case DataTable_Columns_Type.Documents_Visibility:
      return DataTable_Columns.Visibility[columnNameIndex].toString()
    case DataTable_Columns_Type.Documents_Exports:
      return DataTable_Columns.Exports[columnNameIndex].toString()
    case DataTable_Columns_Type.Documents_Dates:
      return DataTable_Columns.Dates[columnNameIndex].toString()
    case DataTable_Columns_Type.Documents_Dates_Created:
      return 'Created'
    case DataTable_Columns_Type.Documents_Dates_LastModified:
      return 'Last Modified'
    case DataTable_Columns_Type.Documents_Meta:
      return DataTable_Columns.Meta[columnNameIndex].toString()
    case DataTable_Columns_Type.Documents_Meta_DataSource:
      return 'Data Source'
    case DataTable_Columns_Type.Documents_Meta_DocumentType:
      return 'Document Type'
    case DataTable_Columns_Type.Documents_Tags:
      return DataTable_Columns.DocumentTags[columnNameIndex].toString()
    case DataTable_Columns_Type.Jobs_JobId:
      return DataTable_Columns.Id[columnNameIndex].toString()
    case DataTable_Columns_Type.Jobs_Services:
      return DataTable_Columns.Services[columnNameIndex].toString()
    case DataTable_Columns_Type.Jobs_WorkAuthStatus:
      return DataTable_Columns.LatestWorkAuthStatus[columnNameIndex].toString()
    case DataTable_Columns_Type.Jobs_Location:
      return DataTable_Columns.Location[columnNameIndex].toString()
    case DataTable_Columns_Type.Jobs_LatestTimelineEvent:
      return DataTable_Columns.LatestTimelineEvent[columnNameIndex].toString()
    case DataTable_Columns_Type.Inspections_Started:
      return DataTable_Columns.Started[columnNameIndex].toString()
    case DataTable_Columns_Type.inspections_Duration:
      return DataTable_Columns.Duration[columnNameIndex].toString()
    case DataTable_Columns_Type.Inspections_Organizer:
      return DataTable_Columns.Organizer[columnNameIndex].toString()
    case DataTable_Columns_Type.Inspections_NumberOfParticipants:
      return DataTable_Columns.NumberOfParticipants[columnNameIndex].toString()
    case DataTable_Columns_Type.InspectionScreenshots_Label:
      return DataTable_Columns.Label[columnNameIndex].toString()
    case DataTable_Columns_Type.InspectionScreenshots_Description:
      return DataTable_Columns.FileDescription[columnNameIndex].toString()
    case DataTable_Columns_Type.InspectionScreenshots_DateUploaded:
      return DataTable_Columns.DateUploaded[columnNameIndex].toString()
    case DataTable_Columns_Type.InspectionScreenshots_DateTaken:
      return DataTable_Columns.DateTaken[columnNameIndex].toString()
    case DataTable_Columns_Type.WorkAuthorizations_Document:
      return DataTable_Columns.Document[columnNameIndex].toString()
    case DataTable_Columns_Type.WorkAuthorizations_Status:
      return DataTable_Columns.WorkAuthStatus[columnNameIndex].toString()
    case DataTable_Columns_Type.WorkAuthorizations_Created:
      return DataTable_Columns.DateCreated[columnNameIndex].toString()
    case DataTable_Columns_Type.WorkAuthorizations_Expires:
      return DataTable_Columns.Expires[columnNameIndex].toString()
    case DataTable_Columns_Type.WorkAuthorizations_Recipients:
      return DataTable_Columns.Recipients[columnNameIndex].toString()
    case DataTable_Columns_Type.LossOfUse_AmountRequested:
      return DataTable_Columns.AmountRequested[columnNameIndex].toString()
    case DataTable_Columns_Type.LossOfUse_Duration:
      return DataTable_Columns.DurationInDays[columnNameIndex].toString()
    case DataTable_Columns_Type.LossOfUse_RequestedDate:
      return DataTable_Columns.RequestedDate[columnNameIndex].toString()
    case DataTable_Columns_Type.LossOfUse_LastModified:
      return DataTable_Columns.LastModified[columnNameIndex].toString()
    case DataTable_Columns_Type.LossOfUseReceipts_ReceiptDate:
      return DataTable_Columns.ReceiptDate[columnNameIndex].toString()
    case DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote:
      return DataTable_Columns.ReceiptNote[columnNameIndex].toString()
    case DataTable_Columns_Type.LossOfUseReceipts_DocumentTitle:
      return DataTable_Columns.DocumentTitle[columnNameIndex].toString()
    case DataTable_Columns_Type.LossOfUseReceipts_DocumentDescription:
      return DataTable_Columns.DocumentDescription[columnNameIndex].toString()
    case DataTable_Columns_Type.Estimates_SubmissionDate:
      return DataTable_Columns.SubmissionDate[columnNameIndex].toString()
    case DataTable_Columns_Type.Estimates_SubmittedBy:
      return DataTable_Columns.SubmittedBy[columnNameIndex].toString()
    case DataTable_Columns_Type.Estimates_EstimateAmount:
      return DataTable_Columns.EstimateAmount[columnNameIndex].toString()
    case DataTable_Columns_Type.PricingRegions_RegionName:
      return DataTable_Columns.RegionName[columnNameIndex].toString()
    case DataTable_Columns_Type.PricingVendorRates_VendorName:
      return DataTable_Columns.VendorName[columnNameIndex].toString()
    case DataTable_Columns_Type.PricingVendorRates_IsTemplate:
      return DataTable_Columns.IsTemplate[columnNameIndex].toString()
    case DataTable_Columns_Type.Bills_VendorName:
      return DataTable_Columns.VendorName_Bills[columnNameIndex].toString()
    case DataTable_Columns_Type.Bills_Status:
      return DataTable_Columns.Status[columnNameIndex].toString()
    case DataTable_Columns_Type.Bills_Total:
      return DataTable_Columns.Total_Bills[columnNameIndex].toString()
    case DataTable_Columns_Type.Bills_Balance:
      return DataTable_Columns.Balance_Bills[columnNameIndex].toString()
    case DataTable_Columns_Type.Invoices_CustomerName:
      return DataTable_Columns.CustomerName[columnNameIndex].toString()
    case DataTable_Columns_Type.Invoices_Status:
      return DataTable_Columns.Status[columnNameIndex].toString()
    case DataTable_Columns_Type.Invoices_Total:
      return DataTable_Columns.Total[columnNameIndex].toString()
    case DataTable_Columns_Type.Invoices_Balance:
      return DataTable_Columns.Balance[columnNameIndex].toString()
    default:
      throw new Error(`No data column type has been defined for: ${columnType} `)
  }
}

export function LookupContactBookCorn(contactBookType: string) {
  switch (contactBookType) {
    case ContactBookTypes.Carrier:
      return 'corn:contacts:book:carrier'
    case ContactBookTypes.ClaimsPortal:
      return 'corn:contacts:book:claims'
    case ContactBookTypes.DeskAdjuster:
      return 'corn:contacts:book:deskAdjuster'
    case ContactBookTypes.FieldAgent:
      return 'corn:contacts:book:fieldAgent'
    case ContactBookTypes.FieldTech:
      return 'corn:contacts:book:fieldTech'
    case ContactBookTypes.ProjectManager:
      return 'corn:contacts:book:projectManager'
    case ContactBookTypes.Reviewer:
      return 'corn:contacts:book:reviewer'
    case ContactBookTypes.Subcontractor:
      return 'corn:contacts:book:subcontractor'
    default:
      throw new Error(`No contact book type has been defined for: ${contactBookType} `)
  }
}

export function ConcatenateFilterTerms(filterTerms: unknown[]) {
  let terms = ''
  let tail = ''
  switch (filterTerms.length) {
    case 0:
      throw new Error('No Contact Roles were provide to select')
    case 1:
      terms = filterTerms[0] as string
      break
    case 2:
      terms = filterTerms[0] as string
      tail = ` or ${filterTerms[1]}`
      break
    default:
      tail = `, or ${filterTerms.pop()}`
      terms = filterTerms.join(', ')
      break
  }
  return `${terms}${tail}`
}

export function FetchCannedClaim(environment: string, cannedClaim: CannedClaimTypes) {
  switch (environment) {
    case CeylonEnvironmentType.Company_QA:
      return FetchCannedClaimForCompany_QAEnvironment(cannedClaim)
    case CeylonEnvironmentType.Company_Test:
      return FetchCannedClaimForCompany_TestEnvironment(cannedClaim)
    default:
      throw new Error(`No Environment Type has been defined for: ${environment} `)
  }
}

export function FetchCannedClaimForCompany_QAEnvironment(cannedClaim: CannedClaimTypes) {
  switch (cannedClaim) {
    case CannedClaimTypes.RedactedClaim: {
      const newClaim = new ClaimsPortalClaim('redacted')
      newClaim.primaryContact.name = 'redacted'
      newClaim.primaryContact.email = 'redacted'
      newClaim.primaryContact.phone = 'redacted'
      newClaim.basicInfo.policyNumber = 'redacted'
      newClaim.basicInfo.dataSource = 'redacted'
      newClaim.basicInfo.dataSourceID = 'redacted'
      newClaim.basicInfo.carrier = 'redacted'
      newClaim.basicInfo.coordinator = 'Unknown'
      newClaim.basicInfo.fieldAgent = 'redacted'
      newClaim.basicInfo.inspectionTech = 'Unknown'
      newClaim.basicInfo.projectManager = 'Unknown'
      newClaim.basicInfo.reviewer = 'redacted'
      newClaim.basicInfo.hasLegalRep = 'No'
      newClaim.basicInfo.hasJob = 'No'
      newClaim.basicInfo.claimStatus = 'Carrier Review'

      newClaim.lossInformation.date = '09/03/2022 09:00 PM'
      newClaim.lossInformation.type = 'Drain Bck'
      newClaim.lossInformation.description = ''

      newClaim.lossLocation.fullAddress = 'redacted'
      newClaim.lossLocation.addressType = 'Property'
      newClaim.lossLocation.street = 'redacted'
      newClaim.lossLocation.secondaryStreet = ''
      newClaim.lossLocation.city = 'Washington'
      newClaim.lossLocation.county = 'Unknown'
      newClaim.lossLocation.state = 'DC'
      newClaim.lossLocation.zipCode = '20006'
      newClaim.lossLocation.map = 'View in Google Maps'
      newClaim.lossLocation.mapStreet = 'redacted'

      newClaim.contact.name = 'redacted'
      newClaim.contact.phone = 'Unknown'
      newClaim.contact.email = 'Unknown'

      newClaim.testData.claimsContact = 'redacted'
      newClaim.testData.removedContact = 'redacted'
      newClaim.testData.claimsDocument = 'Test File ClaimsPortal'
      newClaim.testData.claimsMedia = 'Test File ClaimsPortal'
      newClaim.testData.versionedDocument = 'Report Rough Draft'
      newClaim.testData.versionedMedia = 'house'
      newClaim.testData.claimCallbackSearch = 'sort me'
      newClaim.testData.documentDescription = 'Test File Description'
      newClaim.testData.claimTimelineCount = 228
      newClaim.testData.claimInspectionSuffix =
        'redacted'
      newClaim.testData.claimInspectionDescription = `just talkin' to myself`
      newClaim.testData.claimInspectionDescriptionOther = `say`
      newClaim.testData.claimInspectionOrganizer = `test_a@test.company.com	`
      newClaim.testData.claimInspectionDuration = `redacted`
      newClaim.testData.claimInspectionScreenshot = 'redacted'
      newClaim.testData.claimInspectionScreenshotOther = 'redacted'
      newClaim.testData.claimInspectionTranscript = 'redacted'
      newClaim.testData.claimNotesSearchFullyExported = 'redacted'
      newClaim.testData.claimNotesSearchNotExported = 'Moo Moo'
      newClaim.testData.claimNotesFilterOnName = {
        target: 'test_a',
        contact: 'test_a@test.company.com',
        roles: 'Coordinator (ClaimsPortal),Other',
      }
      newClaim.testData.claimNotesFilterOnRole = {
        target: 'Universal',
        contact: 'Universal - ClaimsPortal',
        roles: 'Carrier',
      }
      newClaim.testData.claimPortalAccessContact = 'redacted'
      newClaim.testData.inactiveFieldAgent = 'Test Estimator #1'
      newClaim.testData.removedContact = 'redacted'
      newClaim.testData.carrierBookContact = 'redacted'
      newClaim.testData.claimsBookContact = 'redacted'
      newClaim.testData.estimatorNoItems = 'redacted'
      newClaim.testData.estimator1 = 'redacted'
      newClaim.testData.estimator2 = 'redacted'

      return newClaim
    }
    case CannedClaimTypes.DefaultTestClaim: {
      const newClaim = new ClaimsPortalClaim('redacted')
      newClaim.primaryContact.name = 'Test Contact'
      newClaim.basicInfo.policyNumber = 'redacted'
      newClaim.basicInfo.dataSource = 'Company'
      newClaim.basicInfo.xaImportStatus = '(None)'
      newClaim.basicInfo.carrier = 'redacted'
      newClaim.basicInfo.coordinator = 'test_a@test.company.com'
      newClaim.basicInfo.fieldAgent = 'Automation FieldAgent'
      newClaim.basicInfo.inspectionTech = 'Automation InspectionTech'
      newClaim.basicInfo.projectManager = 'redacted@company.com'
      newClaim.basicInfo.reviewer = 'redacted'
      newClaim.basicInfo.hasLegalRep = 'No'
      newClaim.basicInfo.hasJob = 'Yes'
      newClaim.basicInfo.claimStatus = 'Inspection'

      newClaim.lossInformation.date = 'redacted'
      newClaim.lossInformation.type = 'Fire'
      newClaim.lossInformation.catCode = 'TEST' // optional
      newClaim.lossInformation.claimFactors = 'Option To Repair Invoked'
      newClaim.lossInformation.initalClaimActions = 'Requires Fire Or Smoke Mitigation' // optional
      newClaim.lossInformation.description = 'redacted'

      newClaim.lossLocation.fullAddress = 'redacted'
      newClaim.lossLocation.addressType = 'Property'
      newClaim.lossLocation.street = 'redacted'
      newClaim.lossLocation.secondaryStreet = 'redacted'
      newClaim.lossLocation.city = 'redacted'
      newClaim.lossLocation.county = 'redacted'
      newClaim.lossLocation.state = 'WA'
      newClaim.lossLocation.zipCode = 'redacted'
      newClaim.lossLocation.map = 'View in Google Maps'
      newClaim.lossLocation.mapStreet = 'redacted'

      newClaim.contact.name = 'Test Contact'
      newClaim.contact.phone = 'redacted'
      newClaim.contact.email = 'bpeterson+testcontact@company.com'

      newClaim.testData.claimsContact = 'Test Contact'
      newClaim.testData.removedContact = 'Remove Me'
      newClaim.testData.claimsDocument = 'Test File ClaimsPortal'
      newClaim.testData.claimsMedia = 'Test File Claims'
      newClaim.testData.callbackSearch = `I am so confused`
      newClaim.testData.versionedDocument = 'Versioned Document'
      newClaim.testData.versionedMedia = 'Versioned Media'
      newClaim.testData.claimCallbackSearch = `Help Me Please!`
      newClaim.testData.documentDescription = 'Test File Description'
      newClaim.testData.claimTimelineCount = 6
      newClaim.testData.timelineEventDescription = 'Claim Inspection Ended'
      newClaim.testData.timelineEventDateTime = 'redacted'
      newClaim.testData.claimInspectionSuffix =
        'redacted'
      newClaim.testData.claimInspectionDescription = `solo convo`
      newClaim.testData.claimInspectionTranscript = 'later'
      newClaim.testData.claimInspectionDescriptionOther = `say`
      newClaim.testData.claimInspectionOrganizer = `test_a`
      newClaim.testData.claimInspectionDuration = `redacted`
      newClaim.testData.claimInspectionScreenshot = 'redacted'
      newClaim.testData.claimInspectionScreenshotOther = 'redacted'
      newClaim.testData.claimNotesSearchFullyExported = 'Moo Moo'
      newClaim.testData.claimNotesSearchNotExported = 'Moo Moo'
      newClaim.testData.claimNotesFilterOnName = {
        target: 'test_a',
        contact: 'test_a@test.company.com',
        roles: 'Coordinator (ClaimsPortal)',
      }
      newClaim.testData.claimNotesFilterOnRole = {
        target: 'Universal',
        contact: 'Universal - Claims',
        roles: 'Carrier',
      }
      newClaim.testData.claimPortalAccessContact = 'Test Contact'
      newClaim.testData.inactiveFieldAgent = 'Test Estimator #1'
      newClaim.testData.removedFilterContact = 'redacted'
      newClaim.testData.carrierBookContact = 'redacted'
      newClaim.testData.claimsBookContact = 'redacted'
      newClaim.testData.estimatorNoItems = 'redacted'
      newClaim.testData.estimator1 = 'Automation FieldAgent'
      newClaim.testData.estimator2 = 'Automation InspectionTech'
      newClaim.testData.claimLossOfUseType = 'Food'
      newClaim.testData.claimLossOfUseAmount = '100'
      newClaim.testData.claimLossOfUseId = 'redacted'
      newClaim.testData.claimLossOfUseReceiptNote = 'I am very hungry'
      newClaim.testData.claimEstimatesNotes = 'oats'
      newClaim.testData.claimEstimatesNotesOther = 'totes'
      newClaim.testData.claimEstimatesSubmittedBy = 'LIONSES'
      newClaim.testData.claimEstimateId = 'redacted'
      newClaim.testData.claimEstimateType = 'standard'
      newClaim.testData.claimEstimateExternalSourceId = 'redacted'
      newClaim.testData.claimEstimateSubmissionDate = 'redacted'
      newClaim.testData.claimEstimateSubmittedBy = 'LION'
      newClaim.testData.claimEstimateNotes = 'totes'
      newClaim.testData.claimPhotoReportNewest = 'puppy_newest'
      return newClaim
    }
    case CannedClaimTypes.DocumentStashClaim: {
      const newClaim = new ClaimsPortalClaim('redacted')
      newClaim.basicInfo.carrier = 'redacted'
      return newClaim
    }
  }
}

export function FetchCannedClaimForCompany_TestEnvironment(cannedClaim: CannedClaimTypes) {
  switch (cannedClaim) {
    case CannedClaimTypes.RedactedClaim: {
      const newClaim = new ClaimsPortalClaim('redacted')
      newClaim.primaryContact.name = 'redacted'
      newClaim.primaryContact.email = 'redacted'
      newClaim.primaryContact.phone = 'redacted'
      newClaim.basicInfo.policyNumber = 'redacted'
      newClaim.basicInfo.dataSource = 'redacted'
      newClaim.basicInfo.dataSourceID = 'redacted'
      newClaim.basicInfo.carrier = 'redacted'
      newClaim.basicInfo.coordinator = 'redacted+claims@company.com'
      newClaim.basicInfo.fieldAgent = 'redacted'
      newClaim.basicInfo.inspectionTech = 'Unknown'
      newClaim.basicInfo.projectManager = 'redacted'
      newClaim.basicInfo.reviewer = 'Unknown'
      newClaim.basicInfo.hasLegalRep = 'No'
      newClaim.basicInfo.hasJob = 'No'
      newClaim.basicInfo.claimStatus = 'Inspection'

      newClaim.lossInformation.date = 'redacted'
      newClaim.lossInformation.type = 'Drain Bck'
      newClaim.lossInformation.description = ''

      newClaim.lossLocation.fullAddress = 'redacted'
      newClaim.lossLocation.addressType = 'Property'
      newClaim.lossLocation.street = 'redacted'
      newClaim.lossLocation.secondaryStreet = ''
      newClaim.lossLocation.city = 'Washington'
      newClaim.lossLocation.county = 'Unknown'
      newClaim.lossLocation.state = 'DC'
      newClaim.lossLocation.zipCode = '20006'
      newClaim.lossLocation.map = 'View in Google Maps'
      newClaim.lossLocation.mapStreet = 'redacted'

      newClaim.contact.name = 'redacted'
      newClaim.contact.phone = 'Unknown'
      newClaim.contact.email = 'Unknown'

      newClaim.testData.claimsContact = 'redacted'
      newClaim.testData.removedContact = 'redacted'
      newClaim.testData.claimsDocument = 'Test File ClaimsPortal'
      newClaim.testData.claimsMedia = 'Test File ClaimsPortal'
      newClaim.testData.versionedDocument = 'Report Rough Draft'
      newClaim.testData.versionedMedia = 'house'
      newClaim.testData.claimCallbackSearch = 'sort me'
      newClaim.testData.documentDescription = 'Test File Description'
      newClaim.testData.claimTimelineCount = 228
      newClaim.testData.claimInspectionSuffix =
        'redacted'
      newClaim.testData.claimInspectionDescription = `just talkin' to myself`
      newClaim.testData.claimInspectionDescriptionOther = `say`
      newClaim.testData.claimInspectionOrganizer = `test_a@test.company.com	`
      newClaim.testData.claimInspectionDuration = `redacted`
      newClaim.testData.claimInspectionScreenshot = 'redacted'
      newClaim.testData.claimInspectionScreenshotOther = 'redacted'
      newClaim.testData.claimInspectionTranscript = 'redacted'
      newClaim.testData.claimNotesSearchFullyExported = 'redacted'
      newClaim.testData.claimNotesSearchNotExported = 'Moo Moo'
      newClaim.testData.claimNotesFilterOnName = {
        target: 'test_a',
        contact: 'test_a@test.company.com',
        roles: 'Coordinator (ClaimsPortal),Other',
      }
      newClaim.testData.claimNotesFilterOnRole = {
        target: 'Universal',
        contact: 'Universal - ClaimsPortal',
        roles: 'Carrier',
      }
      newClaim.testData.claimPortalAccessContact = 'redacted'
      newClaim.testData.inactiveFieldAgent = 'redacted'
      newClaim.testData.removedContact = 'redacted'
      newClaim.testData.carrierBookContact = 'redacted'
      newClaim.testData.claimsBookContact = 'redacted'
      newClaim.testData.estimatorNoItems = 'redacted'
      newClaim.testData.estimator1 = 'redacted'
      newClaim.testData.estimator2 = 'redacted'

      return newClaim
    }
    case CannedClaimTypes.DefaultTestClaim: {
      const newClaim = new ClaimsPortalClaim('redacted')
      newClaim.primaryContact.name = 'redacted'
      newClaim.basicInfo.policyNumber = 'redacted'
      newClaim.basicInfo.dataSource = 'Company'
      newClaim.basicInfo.xaImportStatus = '(None)'
      newClaim.basicInfo.carrier = 'redacted'
      newClaim.basicInfo.coordinator = 'test_a@test.company.com'
      newClaim.basicInfo.fieldAgent = 'Automation FieldAgent'
      newClaim.basicInfo.inspectionTech = 'Automation InspectionTech'
      newClaim.basicInfo.projectManager = 'redacted'
      newClaim.basicInfo.reviewer = 'redacted'
      newClaim.basicInfo.hasLegalRep = 'No'
      newClaim.basicInfo.hasJob = 'Yes'
      newClaim.basicInfo.claimStatus = 'Inspection'

      newClaim.lossInformation.date = 'redacted'
      newClaim.lossInformation.type = 'Fire'
      newClaim.lossInformation.catCode = 'TEST' // optional
      newClaim.lossInformation.claimFactors = 'Option To Repair Invoked'
      newClaim.lossInformation.initalClaimActions = 'Requires Fire Or Smoke Mitigation' // optional
      newClaim.lossInformation.description = 'redacted'

      newClaim.lossLocation.fullAddress = 'redacted'
      newClaim.lossLocation.addressType = 'Property'
      newClaim.lossLocation.street = 'redacted'
      newClaim.lossLocation.secondaryStreet = 'redacted'
      newClaim.lossLocation.city = 'redacted'
      newClaim.lossLocation.county = 'redacted'
      newClaim.lossLocation.state = 'WA'
      newClaim.lossLocation.zipCode = 'redacted'
      newClaim.lossLocation.map = 'View in Google Maps'
      newClaim.lossLocation.mapStreet = 'redacted'

      newClaim.contact.name = 'Test Contact'
      newClaim.contact.phone = 'redacted'
      newClaim.contact.email = 'bpeterson+testcontact@company.com'

      newClaim.testData.claimsContact = 'Test Contact'
      newClaim.testData.removedContact = 'Remove Me'
      newClaim.testData.claimsDocument = 'Test File ClaimsPortal'
      newClaim.testData.claimsMedia = 'Test File ClaimsPortal'
      newClaim.testData.callbackSearch = `I am so confused`
      newClaim.testData.versionedDocument = 'Versioned Document'
      newClaim.testData.versionedMedia = 'Versioned Media'
      newClaim.testData.claimCallbackSearch = `I am so confused`
      newClaim.testData.documentDescription = 'Test File Description'
      newClaim.testData.claimTimelineCount = 6
      newClaim.testData.timelineEventDescription = 'Inspection Scheduled'
      newClaim.testData.timelineEventDateTime = 'redacted'
      newClaim.testData.claimInspectionSuffix =
        'redacted'
      newClaim.testData.claimInspectionDescription = `solo convo`
      newClaim.testData.claimInspectionTranscript = 'later'
      newClaim.testData.claimInspectionDescriptionOther = `say`
      newClaim.testData.claimInspectionOrganizer = `test_a`
      newClaim.testData.claimInspectionDuration = `redacted`
      newClaim.testData.claimInspectionScreenshot = 'redacted'
      newClaim.testData.claimInspectionScreenshotOther = 'redacted'
      newClaim.testData.claimNotesSearchFullyExported = 'Moo Moo'
      newClaim.testData.claimNotesSearchNotExported = 'Moo Moo'
      newClaim.testData.claimNotesFilterOnName = {
        target: 'test_a',
        contact: 'test_a@test.company.com',
        roles: 'Coordinator (ClaimsPortal)',
      }
      newClaim.testData.claimNotesFilterOnRole = {
        target: 'Universal',
        contact: 'Universal - ClaimsPortal',
        roles: 'Carrier',
      }
      newClaim.testData.claimPortalAccessContact = 'Test Contact'
      newClaim.testData.inactiveFieldAgent = 'redacted'
      newClaim.testData.removedContact = 'redacted'
      newClaim.testData.carrierBookContact = 'redacted'
      newClaim.testData.claimsBookContact = 'redacted'
      newClaim.testData.estimatorNoItems = 'redacted'
      newClaim.testData.estimator1 = 'Automation FieldAgent'
      newClaim.testData.estimator2 = 'Automation InspectionTech'
      newClaim.testData.claimLossOfUseType = 'Food'
      newClaim.testData.claimLossOfUseAmount = '100'
      newClaim.testData.claimLossOfUseId = 'redacted'
      newClaim.testData.claimLossOfUseReceiptNote = 'I am very hungry'
      newClaim.testData.claimEstimatesNotes = 'oats'
      newClaim.testData.claimEstimatesNotesOther = 'totes'
      newClaim.testData.claimEstimatesSubmittedBy = 'LIONSES'
      newClaim.testData.claimEstimateId = 'redacted'
      newClaim.testData.claimEstimateType = 'standard'
      newClaim.testData.claimEstimateExternalSourceId = 'redacted'
      newClaim.testData.claimEstimateSubmissionDate = 'redacted'
      newClaim.testData.claimEstimateSubmittedBy = 'LION'
      newClaim.testData.claimEstimateNotes = 'totes'
      newClaim.testData.claimPhotoReportNewest = 'puppy_newest'
      return newClaim
    }
    case CannedClaimTypes.DocumentStashClaim: {
      const newClaim = new ClaimsPortalClaim('redacted')
      newClaim.basicInfo.carrier = 'redacted'
      return newClaim
    }
  }
}

export function FetchCannedJob(environment: string, cannedJob: CannedJobTypes) {
  switch (environment) {
    case CeylonEnvironmentType.Company_QA:
      return FetchCannedJobForCompany_QAEnvironment(cannedJob)
    case CeylonEnvironmentType.Company_Test:
      return FetchCannedJobForCompany_TestEnvironment(cannedJob)
    default:
      throw new Error(`No Environment Type has been defined for: ${environment} `)
  }
}

export function FetchCannedJobForCompany_QAEnvironment(cannedJob: CannedJobTypes) {
  switch (cannedJob) {
    case CannedJobTypes.TestOne: {
      const newJob = new ClaimsPortalJob('redacted', 'redacted')
      newJob.jobDetails.associatedClaim = 'redacted'
      newJob.jobDetails.type = 'Build Back'
      newJob.jobDetails.services = ['Interior', 'Exterior', 'Detached Structures']
      newJob.jobDetails.description = 'Ext + struc + int'
      newJob.jobAssignments.fieldTech = ''
      newJob.jobAssignments.subcontractor = ''
      newJob.testData.jobNotesSearch = 'Moo Moo'
      return newJob
    }
    case CannedJobTypes.DefaultTestJob: {
      const newJob = new ClaimsPortalJob('redacted', 'redacted')
      newJob.jobDetails.associatedClaim = 'redacted'
      newJob.jobDetails.type = 'Emergency Services'
      newJob.jobDetails.services = ['Tarping']
      newJob.jobDetails.description = 'Test Job Description'
      newJob.jobAssignments.coordinator = 'test_a@test.company.com'
      newJob.jobAssignments.projectManager = 'redacted'
      newJob.jobAssignments.approver = 'Unassigned'
      newJob.jobAssignments.dispatcher = 'Unassigned'
      newJob.jobAssignments.fieldTech = ''
      newJob.jobAssignments.subcontractor = 'Automation Subcontractor'
      newJob.jobLocation.fullAddress = 'redacted'
      newJob.jobLocation.addressLine1 = 'redacted'
      newJob.jobLocation.addressLine2 = 'redacted'
      newJob.jobLocation.addressType = 'Home'
      newJob.jobLocation.city = 'redacted'
      newJob.jobLocation.county = 'redacted'
      newJob.jobLocation.state = 'WA'
      newJob.jobLocation.zipCode = 'redacted'
      newJob.jobLocation.map = 'Open in Google Maps'
      newJob.jobLocation.mapStreet = 'redacted'
      newJob.contact.name = 'Test Contact'
      newJob.contact.phone = 'redacted'
      newJob.contact.email = 'bpeterson+testcontact@company.com'
      newJob.workDetails.workType = 'Tarping'
      newJob.workDetails.tarpArea = '11 sq ft'
      newJob.workDetails.timeOfService = 'After Business Hours'
      newJob.workDetails.fastenerType = 'Sandbag'
      newJob.workDetails.roofPitch = '7/12 to 9/12'
      newJob.workDetails.serviceDate = 'redacted'
      newJob.workDetails.highRoof = false
      newJob.workAuthorization.status = 'Expired'
      newJob.workAuthorization.sentDate = 'redacted'
      newJob.workAuthorization.sentMethod = 'Email'
      newJob.workAuthorization.recipient = 'redacted'
      newJob.testData.claimsContact = 'Test Contact'
      newJob.testData.claimsDocument = 'Test File ClaimsPortal'
      newJob.testData.claimsMedia = 'Test File ClaimsPortal'
      newJob.testData.callbackSearch = `I am so confused`
      newJob.testData.versionedDocument = 'Versioned Document'
      newJob.testData.versionedMedia = 'Versioned Media'
      newJob.testData.jobTimelineCount = 6
      newJob.testData.jobTimelineDateCount = 1
      newJob.testData.jobInspectionSuffix =
        'redacted'
      newJob.testData.jobInspectionDescription = `solo convo`
      newJob.testData.jobInspectionTranscript = 'later'
      newJob.testData.jobInspectionDescriptionOther = `say`
      newJob.testData.jobInspectionOrganizer = `test_a`
      newJob.testData.jobInspectionDuration = `redacted`
      newJob.testData.jobInspectionScreenshot = 'redacted'
      newJob.testData.jobInspectionScreenshotOther = 'redacted'
      newJob.testData.jobNotesSearch = 'Moo Moo'
      newJob.testData.jobNotesFilterOnName = {
        target: 'test_a',
        contact: 'test_a@test.company.com',
        roles: 'Coordinator (ClaimsPortal)',
      }
      newJob.testData.jobNotesFilterOnRole = {
        target: 'Universal',
        contact: 'Universal - ClaimsPortal',
        roles: 'Carrier',
      }
      newJob.testData.jobPortalAccessContact = 'Automation UserPortal'
      newJob.testData.jobInactiveGlobalContact = 'redacted'
      newJob.testData.jobRemovedGlobalContact = 'redacted'
      newJob.testData.jobWorkAuthSearch = 'Company Restoration Work'

      return newJob
    }
    case CannedJobTypes.NoClaimNoContact: {
      const newJob = new ClaimsPortalJob('redacted', 'redacted')
      return newJob
    }
  }
}

export function FetchCannedJobForCompany_TestEnvironment(cannedJob: CannedJobTypes) {
  switch (cannedJob) {
    case CannedJobTypes.TestOne: {
      const newJob = new ClaimsPortalJob('redacted', 'redacted')
      newJob.jobDetails.associatedClaim = 'redacted'
      newJob.jobDetails.type = 'Build Back'
      newJob.jobDetails.services = ['Interior', 'Exterior', 'Detached Structures']
      newJob.jobDetails.description = 'Ext + struc + int'

      newJob.jobAssignments.coordinator = 'redacted'
      newJob.jobAssignments.projectManager = 'redacted'
      newJob.jobAssignments.approver = 'Unassigned'
      newJob.jobAssignments.dispatcher = 'Unassigned'
      newJob.jobAssignments.fieldTech = ''
      newJob.jobAssignments.subcontractor = ''

      newJob.jobLocation.fullAddress = 'redacted'
      newJob.jobLocation.addressLine1 = 'redacted'
      newJob.jobLocation.addressType = 'Home'
      newJob.jobLocation.city = 'redacted'
      newJob.jobLocation.state = 'WA'
      newJob.jobLocation.zipCode = 'redacted'
      newJob.jobLocation.map = 'Open in Google Maps'
      newJob.jobLocation.mapStreet = 'redacted'

      newJob.contact.name = 'redacted'
      newJob.contact.phone = 'redacted'
      newJob.contact.email = 'redacted'

      newJob.workAuthorization.status = 'Sent'
      newJob.workAuthorization.sentDate = 'redacted'
      newJob.workAuthorization.sentMethod = 'Email'
      newJob.workAuthorization.recipient = 'Brad Peterson'
      newJob.workAuthorization.effectiveDate = ''
      newJob.workAuthorization.signer = ''

      newJob.testData.callbackSearch = 'again'
      newJob.testData.jobInspectionSuffix =
        'redacted'
      newJob.testData.jobInspectionDescription = `just talkin' to myself`
      newJob.testData.jobInspectionDuration = `redacted`

      return newJob
    }
    case CannedJobTypes.DefaultTestJob: {
      const newJob = new ClaimsPortalJob('redacted', 'redacted')
      newJob.jobDetails.associatedClaim = 'redacted'
      newJob.jobDetails.type = 'Emergency Services'
      newJob.jobDetails.services = ['Tarping']
      newJob.jobDetails.description = 'Test Job Description'
      newJob.jobAssignments.coordinator = 'redacted'
      newJob.jobAssignments.projectManager = 'redacted'
      newJob.jobAssignments.approver = 'Unassigned'
      newJob.jobAssignments.dispatcher = 'Unassigned'
      newJob.jobAssignments.fieldTech = ''
      newJob.jobAssignments.subcontractor = 'Automation Subcontractor'
      newJob.jobLocation.fullAddress = 'redacted'
      newJob.jobLocation.addressLine1 = 'redacted'
      newJob.jobLocation.addressLine2 = 'redacted'
      newJob.jobLocation.addressType = 'Home'
      newJob.jobLocation.city = 'Redacted'
      newJob.jobLocation.county = 'Spokane'
      newJob.jobLocation.state = 'WA'
      newJob.jobLocation.zipCode = 'Redacted'
      newJob.jobLocation.map = 'Open in Google Maps'
      newJob.jobLocation.mapStreet = 'redacted'
      newJob.contact.name = 'Test Contact'
      newJob.contact.phone = 'redacted'
      newJob.contact.email = 'bpeterson+testcontact@company.com'
      newJob.workDetails.workType = 'Tarping'
      newJob.workDetails.tarpArea = '11 sq ft'
      newJob.workDetails.timeOfService = 'After Business Hours'
      newJob.workDetails.fastenerType = 'Sandbag'
      newJob.workDetails.roofPitch = '7/12 to 9/12'
      newJob.workDetails.serviceDate = 'redacted'
      newJob.workDetails.highRoof = false
      newJob.workAuthorization.status = 'Expired'
      newJob.workAuthorization.sentDate = 'redacted'
      newJob.workAuthorization.sentMethod = 'Email'
      newJob.workAuthorization.recipient = 'redacted'
      newJob.testData.claimsContact = 'Test Contact'
      newJob.testData.claimsDocument = 'Test File ClaimsPortal'
      newJob.testData.claimsMedia = 'Test File ClaimsPortal'
      newJob.testData.callbackSearch = `I am so confused`
      newJob.testData.versionedDocument = 'Versioned Document'
      newJob.testData.versionedMedia = 'Versioned Media'
      newJob.testData.jobTimelineCount = 6
      newJob.testData.jobTimelineDateCount = 1
      newJob.testData.jobInspectionSuffix =
        'redacted'
      newJob.testData.jobInspectionDescription = `solo convo`
      newJob.testData.jobInspectionTranscript = 'later'
      newJob.testData.jobInspectionDescriptionOther = `say`
      newJob.testData.jobInspectionOrganizer = `test_a`
      newJob.testData.jobInspectionDuration = `redacted`
      newJob.testData.jobInspectionScreenshot = 'redacted'
      newJob.testData.jobInspectionScreenshotOther = 'redacted'
      newJob.testData.jobNotesSearch = 'Moo Moo'
      newJob.testData.jobNotesFilterOnName = {
        target: 'test_a',
        contact: 'test_a@test.company.com',
        roles: 'Coordinator (ClaimsPortal)',
      }
      newJob.testData.jobNotesFilterOnRole = {
        target: 'Universal',
        contact: 'Universal - ClaimsPortal',
        roles: 'Carrier',
      }
      newJob.testData.jobPortalAccessContact = 'Automation UserPortal'
      newJob.testData.jobInactiveGlobalContact = 'redacted'
      newJob.testData.jobRemovedGlobalContact = 'redacted'
      newJob.testData.jobWorkAuthSearch = 'Company - Repair Contract'
      return newJob
    }
    case CannedJobTypes.NoClaimNoContact: {
      const newJob = new ClaimsPortalJob('redacted', 'redacted/info')
      return newJob
    }
  }
}

export function FetchCannedRegionPricing(
  environment: string,
  cannedRegionPricing: CannedRegionPricingTypes
) {
  switch (cannedRegionPricing) {
    case CannedRegionPricingTypes.DefaultRegionPricing: {
      const newRegionPricing = new ClaimsPortalRegionRate(
        'Test Region',
        FetchDefaultRegionPricingID(environment)
      )
      newRegionPricing.surtax = 20
      newRegionPricing.baseRates.duringBusinessHours = 10
      newRegionPricing.baseRates.afterBusinessHours = 20
      newRegionPricing.roofPitchRates.highRoof = 20
      newRegionPricing.roofPitchRates.under7_12 = 11
      newRegionPricing.roofPitchRates.between7_12and9_12 = 12
      newRegionPricing.roofPitchRates.between10_12and12_12 = 13
      newRegionPricing.roofPitchRates.over12_12 = 14
      newRegionPricing.mechanicalTarpingRates.duringBusinessHours = 10
      newRegionPricing.mechanicalTarpingRates.afterBusinessHours = 20
      newRegionPricing.mechanicalTarpingRates.materialCost = 20
      newRegionPricing.sandbagTarpingRates.duringBusinessHours = 15
      newRegionPricing.sandbagTarpingRates.afterBusinessHours = 25
      newRegionPricing.sandbagTarpingRates.materialCost = 25
      return newRegionPricing
    }
  }
}

export function FetchDefaultRegionPricingID(environment: string) {
  switch (environment) {
    case CeylonEnvironmentType.Company_QA:
    case CeylonEnvironmentType.Company_Dev:
    case CeylonEnvironmentType.Company_Prod:
      return 'redacted'
      break
    case CeylonEnvironmentType.Company_Test:
      return 'redacted'
    default:
      throw new Error(`No Environment Type has been defined for: ${environment} `)
  }
}

export function FetchCannedVendorRatesPricing(
  environment: string,
  cannedVendorRatesPricing: CannedVendorRatesPricingTypes
) {
  switch (cannedVendorRatesPricing) {
    case CannedVendorRatesPricingTypes.DefaultVendorRatesPricing: {
      const newVendorRatesPricing = new ClaimsPortalVendorRates(
        'Test Vendor Rates',
        false,
        FetchDefaultVendorRatesPricingID(environment)
      )
      newVendorRatesPricing.assignedVendors = [
        'Automation Subcontractor,automation+subcontractor@redacted.mailosaur.net',
      ]
      newVendorRatesPricing.mechanicalTarpingRates.duringBusinessHours = 10
      newVendorRatesPricing.mechanicalTarpingRates.afterBusinessHours = 15
      newVendorRatesPricing.mechanicalTarpingRates.materialCost = 20
      newVendorRatesPricing.sandbagTarpingRates.duringBusinessHours = 11
      newVendorRatesPricing.sandbagTarpingRates.afterBusinessHours = 16
      newVendorRatesPricing.sandbagTarpingRates.materialCost = 21
      return newVendorRatesPricing
    }
    case CannedVendorRatesPricingTypes.DefaultVendorRatesPricingTemplate: {
      const newVendorRatesPricing = new ClaimsPortalVendorRates(
        'Test Vendor Rates Template',
        true,
        FetchDefaultVendorRatesPricingTemplateID(environment)
      )
      newVendorRatesPricing.assignedVendors = []
      newVendorRatesPricing.mechanicalTarpingRates.duringBusinessHours = 10.01
      newVendorRatesPricing.mechanicalTarpingRates.afterBusinessHours = 15.01
      newVendorRatesPricing.mechanicalTarpingRates.materialCost = 20.01
      newVendorRatesPricing.sandbagTarpingRates.duringBusinessHours = 11.01
      newVendorRatesPricing.sandbagTarpingRates.afterBusinessHours = 16.01
      newVendorRatesPricing.sandbagTarpingRates.materialCost = 21.01
      return newVendorRatesPricing
    }
  }
}

export function FetchDefaultVendorRatesPricingID(environment: string) {
  switch (environment) {
    case CeylonEnvironmentType.Company_QA:
    case CeylonEnvironmentType.Company_Dev:
    case CeylonEnvironmentType.Company_Prod:
      return 'redacted'
    case CeylonEnvironmentType.Company_Test:
      return 'redacted'
    default:
      throw new Error(`No Environment Type has been defined for: ${environment} `)
  }
}

export function FetchDefaultVendorRatesPricingTemplateID(environment: string) {
  switch (environment) {
    case CeylonEnvironmentType.Company_QA:
    case CeylonEnvironmentType.Company_Dev:
    case CeylonEnvironmentType.Company_Prod:
      return 'redacted'
    case CeylonEnvironmentType.Company_Test:
      return 'redacted'
    default:
      throw new Error(`No Environment Type has been defined for: ${environment} `)
  }
}

export function FetchCannedTemplateData(environment: string) {
  switch (environment) {
    case CeylonEnvironmentType.Company_QA:
    case CeylonEnvironmentType.Company_Dev:
    case CeylonEnvironmentType.Company_Prod:
      return {
        communication: {
          existingTemplate: 'Updated Test Communication',
          existingTemplateTextPartial: 'TBD',
          existingDate: new Date('01/01/2026'),
          olderDate: new Date('01/01/2025'),
        },
        document: {
          downloadDocument: 'Test Document Template.docx',
          existingTemplate: 'Updated Test Document',
          existingTemplateId: 'redacted',
          uploadDocument: 'TestDocumentTemplateToUpload.docx',
          existingDate: new Date('01/01/2026'),
          olderDate: new Date('01/01/2025'),
        },
        note: {
          existingTemplate: 'First Contact Script',
          existingTemplateTextPartial: 'CONTACT INFO',
          existingDate: new Date('01/01/2026'),
          olderDate: new Date('01/01/2025'),
        },
      }
    case CeylonEnvironmentType.Company_Test:
      return {
        communication: {
          existingTemplate: 'Updated Test Communication',
          existingTemplateTextPartial: 'TBD',
          existingDate: new Date('01/01/2026'),
          olderDate: new Date('01/01/2025'),
        },
        document: {
          downloadDocument: 'Test Document Template.docx',
          existingTemplate: 'Updated Test Document',
          existingTemplateId: 'redacted',
          uploadDocument: 'TestDocumentTemplateToUpload.docx',
          existingDate: new Date('01/01/2026'),
          olderDate: new Date('01/01/2025'),
        },
        note: {
          existingTemplate: 'First Contact Script',
          existingTemplateTextPartial: 'CONTACT INFO',
          existingDate: new Date('01/01/2026'),
          olderDate: new Date('01/01/2025'),
        },
      }
    case CeylonEnvironmentType.Client_UAT:
      return {
        communication: {
          existingTemplate: 'Updated Test Communication',
          existingTemplateTextPartial: 'TBD',
          existingDate: new Date('01/01/2026'),
          olderDate: new Date('01/01/2025'),
        },
        document: {
          downloadDocument: 'Test Document Template.docx',
          existingTemplate: 'Updated Test Document',
          existingTemplateId: 'tbd',
          uploadDocument: 'TestDocumentTemplateToUpload.docx',
          existingDate: new Date('01/01/2026'),
          olderDate: new Date('01/01/2025'),
        },
        note: {
          existingTemplate: 'First Contact Script',
          existingTemplateTextPartial: 'CONTACT INFO',
          existingDate: new Date('01/01/2026'),
          olderDate: new Date('01/01/2025'),
        },
      }
    default:
      throw new Error(`No Environment Type has been defined for: ${environment} `)
  }
}

export function GetRandomLossOfUseStatusType() {
  const enumLength = Object.keys(LossOfUseStatusType).filter((key) => isNaN(Number(key))).length
  const randomKey = Math.floor(Math.random() * enumLength)
  return Object.values(LossOfUseStatusType)[randomKey]
}

export function DateEntryFormatting(date: Date): string {
  const padStart = (value: number): string => value.toString().padStart(2, '0')
  const dateString = `${padStart(date.getMonth() + 1)}${padStart(date.getDate())}${date.getFullYear()}`
  return dateString
}

export function FetchDateSuffix() {
  return `+${Date.now()}`
}

export function LookupDataGridColumnInformation(columnType: DataGrid_Column_Type) {
  switch (columnType) {
    case DataGrid_Column_Type.Templates_Carrier:
      return DataGrid_Column_Tuples.Carrier
    case DataGrid_Column_Type.Templates_Created:
      return DataGrid_Column_Tuples.Created
    case DataGrid_Column_Type.Templates_Document:
      return DataGrid_Column_Tuples.Document
    case DataGrid_Column_Type.Templates_LastUpdated:
      return DataGrid_Column_Tuples.LastUpdated
    case DataGrid_Column_Type.Templates_Name:
      return DataGrid_Column_Tuples.Name
    default:
      throw new Error(`No DataGrid column type has been defined for: ${columnType}`)
  }
}
