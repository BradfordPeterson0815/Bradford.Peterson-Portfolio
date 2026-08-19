import { CeylonEnvironmentType } from '../shared/constants.js'
import { DelegatePortalClaim } from './delegatePortalClaim.js'
import {
  CannedClaimTypes,
  CannedJobTypes,
  DataTable_ColumnName_Index,
  DataTable_Columns,
  DataTable_Columns_Type,
} from './delegatePortalConstants.js'
import { DelegatePortalJob } from './delegatePortalJob.js'
import { MediaCardData } from './delegatePortalMediaCard.js'

export function LookupDataColumn(
  columnType: DataTable_Columns_Type,
  columnNameIndex: DataTable_ColumnName_Index = DataTable_ColumnName_Index.Access
) {
  switch (columnType) {
    case DataTable_Columns_Type.Jobs_JobLabel:
      return DataTable_Columns.JobLabel[columnNameIndex]
    case DataTable_Columns_Type.Jobs_Type:
      return DataTable_Columns.Type[columnNameIndex]
    case DataTable_Columns_Type.Jobs_Services:
      return DataTable_Columns.Services[columnNameIndex]
    case DataTable_Columns_Type.Contacts_Description:
    case DataTable_Columns_Type.Inspections_Description:
    case DataTable_Columns_Type.Jobs_Description:
      return DataTable_Columns.Description[columnNameIndex]
    case DataTable_Columns_Type.Jobs_Location:
      return DataTable_Columns.Location[columnNameIndex]
    case DataTable_Columns_Type.Jobs_Location_Address:
      return 'Address'
    case DataTable_Columns_Type.Jobs_Location_City:
      return 'City'
    case DataTable_Columns_Type.Jobs_Location_State:
      return 'State'
    case DataTable_Columns_Type.Jobs_Location_ZipCode:
      return 'Zip Code'
    case DataTable_Columns_Type.Callbacks_Status:
      return DataTable_Columns.Status[columnNameIndex]
    case DataTable_Columns_Type.Callbacks_Entity_ID:
      return DataTable_Columns.EntityID[columnNameIndex]
    case DataTable_Columns_Type.Callbacks_Name:
      return DataTable_Columns.Name[columnNameIndex]
    case DataTable_Columns_Type.Callbacks_For_Role:
      return DataTable_Columns.ForRole[columnNameIndex]
    case DataTable_Columns_Type.Callbacks_Notes:
      return DataTable_Columns.Notes[columnNameIndex]
    case DataTable_Columns_Type.Callbacks_Contact_Method:
      return DataTable_Columns.ContactMethod[columnNameIndex]
    case DataTable_Columns_Type.Callbacks_Preferred_Time:
      return DataTable_Columns.PreferredTime[columnNameIndex]
    case DataTable_Columns_Type.Callbacks_Date_Requested:
      return DataTable_Columns.DateRequested[columnNameIndex]
    case DataTable_Columns_Type.Claims_Carrier:
      return DataTable_Columns.Carrier[columnNameIndex]
    case DataTable_Columns_Type.Claims_CatCode:
      return DataTable_Columns.CatCode[columnNameIndex]
    case DataTable_Columns_Type.Claims_City:
      return DataTable_Columns.City[columnNameIndex]
    case DataTable_Columns_Type.Claims_ClaimNumber:
      return DataTable_Columns.ClaimNumber[columnNameIndex]
    case DataTable_Columns_Type.Claims_ClaimStatus:
      return DataTable_Columns.ClaimStatus[columnNameIndex]
    case DataTable_Columns_Type.Claims_County:
      return DataTable_Columns.County[columnNameIndex]
    case DataTable_Columns_Type.Claims_DateReceived:
      return DataTable_Columns.DateReceived[columnNameIndex]
    case DataTable_Columns_Type.Claims_Email:
      return DataTable_Columns.Email[columnNameIndex]
    case DataTable_Columns_Type.Claims_HasJob:
      return DataTable_Columns.HasJob[columnNameIndex]
    case DataTable_Columns_Type.Claims_HasLegalRep:
      return DataTable_Columns.HasLegalRep[columnNameIndex]
    case DataTable_Columns_Type.Claims_Phone:
      return DataTable_Columns.Phone[columnNameIndex]
    case DataTable_Columns_Type.Claims_PrimaryContact:
      return DataTable_Columns.PrimaryContact[columnNameIndex]
    case DataTable_Columns_Type.Claims_InspectionCompleted:
      return DataTable_Columns.InspectionCompleted[columnNameIndex]
    case DataTable_Columns_Type.Claims_InspectionScheduled:
      return DataTable_Columns.InspectionScheduled[columnNameIndex]
    case DataTable_Columns_Type.Claims_LastEvent:
      return DataTable_Columns.LastEvent[columnNameIndex]
    case DataTable_Columns_Type.Claims_LossDate:
      return DataTable_Columns.LossDate[columnNameIndex]
    case DataTable_Columns_Type.Claims_State:
      return DataTable_Columns.State[columnNameIndex]
    case DataTable_Columns_Type.Contacts_Assignee:
      return DataTable_Columns.Assignee[columnNameIndex]
    case DataTable_Columns_Type.Contacts_Name:
      return DataTable_Columns.ContactName[columnNameIndex]
    case DataTable_Columns_Type.Contacts_Roles:
      return DataTable_Columns.Roles[columnNameIndex]
    case DataTable_Columns_Type.Contacts_Preferred_Contact:
      return DataTable_Columns.PreferredContact[columnNameIndex]
    case DataTable_Columns_Type.Contacts_Data_Source:
      return DataTable_Columns.Data_Source[columnNameIndex]
    case DataTable_Columns_Type.Contacts_Inactive:
      return 'Inactive'
    case DataTable_Columns_Type.Documents_File:
      return DataTable_Columns.FileAlt[columnNameIndex]
    case DataTable_Columns_Type.Documents_FileName:
    case DataTable_Columns_Type.InspectionScreenshots_FileName:
      return DataTable_Columns.FileName[columnNameIndex]
    case DataTable_Columns_Type.Documents_Description:
      return DataTable_Columns.Description[columnNameIndex]
    case DataTable_Columns_Type.Documents_Visibility:
      return DataTable_Columns.Visibility[columnNameIndex]
    case DataTable_Columns_Type.Documents_Exports:
      return DataTable_Columns.Exports[columnNameIndex]
    case DataTable_Columns_Type.Documents_Dates:
      return DataTable_Columns.Dates[columnNameIndex]
    case DataTable_Columns_Type.Documents_Dates_Created:
      return 'Created'
    case DataTable_Columns_Type.Documents_Dates_LastModified:
      return 'Last Modified'
    case DataTable_Columns_Type.Documents_Meta:
      return DataTable_Columns.Meta[columnNameIndex]
    case DataTable_Columns_Type.Documents_Meta_DataSource:
      return 'Data Source'
    case DataTable_Columns_Type.Documents_Meta_DocumentType:
      return 'Document Type'
    case DataTable_Columns_Type.Documents_Tags:
      return DataTable_Columns.DocumentTags[columnNameIndex]
    case DataTable_Columns_Type.Documents_Download:
      return DataTable_Columns.Download[columnNameIndex]
    case DataTable_Columns_Type.Estimates_SubmissionDate:
      return DataTable_Columns.SubmissionDate[columnNameIndex]
    case DataTable_Columns_Type.Estimates_SubmittedBy:
      return DataTable_Columns.SubmittedBy[columnNameIndex]
    case DataTable_Columns_Type.Estimates_EstimateAmount:
      return DataTable_Columns.EstimateAmount[columnNameIndex]
    case DataTable_Columns_Type.Inspections_Started:
      return DataTable_Columns.Started[columnNameIndex]
    case DataTable_Columns_Type.Inspections_Duration:
      return DataTable_Columns.Duration[columnNameIndex]
    case DataTable_Columns_Type.Inspections_Organizer:
      return DataTable_Columns.Organizer[columnNameIndex]
    case DataTable_Columns_Type.Inspections_NumberOfParticipants:
      return DataTable_Columns.NumberOfParticipants[columnNameIndex]
    case DataTable_Columns_Type.InspectionScreenshots_Label:
      return DataTable_Columns.Label[columnNameIndex].toString()
    case DataTable_Columns_Type.InspectionScreenshots_Description:
      return DataTable_Columns.FileDescription[columnNameIndex].toString()
    case DataTable_Columns_Type.InspectionScreenshots_DateUploaded:
      return DataTable_Columns.DateUploaded[columnNameIndex].toString()
    case DataTable_Columns_Type.InspectionScreenshots_DateTaken:
      return DataTable_Columns.DateTaken[columnNameIndex].toString()
    default:
      throw new Error(`No data column type has been defined for: ${columnType} `)
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
      const newJob = new DelegatePortalJob('Redacted', 'Redacted')
      newJob.jobDetails.associatedClaim = 'redacted'
      newJob.jobDetails.type = 'Emergency Services'
      newJob.jobDetails.services = ['Tarping']
      newJob.jobDetails.description = 'Test Job Description'
      newJob.jobAssignments.primaryContact = 'Test Contact'
      newJob.jobAssignments.coordinator = 'test_a@test.company.com'
      newJob.jobAssignments.projectManager = 'Redacted'
      newJob.jobAssignments.approver = 'Unassigned'
      newJob.jobAssignments.dispatcher = 'Unassigned'
      newJob.jobAssignments.fieldTechs = ['Automation FieldTech']
      newJob.jobAssignments.subcontractors = []
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
      newJob.workDetails.workType = 'Tarping'
      newJob.workDetails.tarpArea = '11 sq ft'
      newJob.workDetails.timeOfService = 'After Business Hours'
      newJob.workDetails.fastenerType = 'Sandbag'
      newJob.workDetails.roofPitch = '7/12 to 9/12'
      newJob.workDetails.serviceDate = 'redacted'
      newJob.workDetails.highRoof = false
      newJob.contact.name = 'Test Contact'
      newJob.contact.phone = 'Redacted'
      newJob.contact.email = 'bpeterson+testcontact@company.com'
      newJob.testData.document = 'Test Document'
      newJob.testData.documentDescription = 'Test File Description'
      newJob.testData.callbackSearch = `Help, Help, I'm being repressed`
      newJob.testData.versionedDocument = 'Versioned Document'
      newJob.testData.versionedMedia = 'Versioned Media'
      newJob.testData.mediaCards.push({
        filename: 'Versioned Media-j1itpj.jpg',
        title: 'Versioned Media',
        description: 'V1',
      } as MediaCardData)
      newJob.testData.mediaCards.push({
        filename: 'Versioned Media-9co8a.jpg',
        title: 'Versioned Media',
        description: 'V2',
      } as MediaCardData)
      newJob.testData.mediaCards.push({
        filename: 'Test Media-hbnnyl.png',
        title: 'Test Media',
        description: 'Test File Description',
      } as MediaCardData)
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
      newJob.testData.jobNotesSearch = 'Moo Moo'

      return newJob
    }
  }
}

export function FetchCannedJobForTestEnvironment(cannedJob: CannedJobTypes) {
  switch (cannedJob) {
    case CannedJobTypes.DefaultTestJob: {
      const newJob = new DelegatePortalJob('Redacted', 'Redacted')
      newJob.jobDetails.associatedClaim = 'Redacted'
      newJob.jobDetails.type = 'Emergency Services'
      newJob.jobDetails.services = ['Tarping']
      newJob.jobDetails.description = 'Test Job Description'
      newJob.jobAssignments.primaryContact = 'Test Contact'
      newJob.jobAssignments.coordinator = 'test_a@test.company.com'
      newJob.jobAssignments.projectManager = 'Redacted'
      newJob.jobAssignments.approver = 'Unassigned'
      newJob.jobAssignments.dispatcher = 'Unassigned'
      newJob.jobAssignments.fieldTechs = []
      newJob.jobAssignments.fieldTechs = ['Automation FieldTech']
      newJob.jobAssignments.subcontractors = []
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
      newJob.workDetails.workType = 'Tarping'
      newJob.workDetails.tarpArea = '11 sq ft'
      newJob.workDetails.timeOfService = 'After Business Hours'
      newJob.workDetails.fastenerType = 'Sandbag'
      newJob.workDetails.roofPitch = '7/12 to 9/12'
      newJob.workDetails.serviceDate = 'redacted'
      newJob.workDetails.highRoof = false
      newJob.contact.name = 'Test Contact'
      newJob.contact.phone = 'Redacted'
      newJob.contact.email = 'bpeterson+testcontact@company.com'
      newJob.testData.document = 'Test File ClaimsPortal'
      newJob.testData.documentDescription = 'Test File Description'
      newJob.testData.callbackSearch = `Help, Help, I'm being repressed`
      newJob.testData.versionedDocument = 'Versioned Document'
      newJob.testData.versionedMedia = 'Versioned Media'
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
      newJob.testData.jobNotesSearch = 'Moo Moo'

      return newJob
    }
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
    case CannedClaimTypes.Sushi: {
      const newClaim = new DelegatePortalClaim('Redacted')
      newClaim.basicInfo.policyNumber = 'Redacted'
      newClaim.basicInfo.reactedID = 'Redacted'
      newClaim.basicInfo.carrier = 'Redacted - Staff'
      newClaim.testData.claimNotesSearchFullyExported = 'sdkka'
      newClaim.testData.claimNotesSearchNotExported = 'wasabi'
      return newClaim
    }
    case CannedClaimTypes.DefaultTestClaim: {
      const newClaim = new DelegatePortalClaim('Redacted')
      newClaim.basicInfo.policyNumber = 'Redacted'
      newClaim.basicInfo.carrier = 'TECH - Redacted'
      newClaim.basicInfo.coordinator = 'test_a@test.company.com'
      newClaim.basicInfo.fieldAgent = 'Automation FieldAgent'
      newClaim.basicInfo.inspectionTech = 'Automation InspectionTech'
      newClaim.basicInfo.hasLegalRep = 'No'
      newClaim.basicInfo.hasJob = 'Yes'
      newClaim.basicInfo.claimStatus = 'Inspection'

      newClaim.lossInformation.date = 'Redacted'
      newClaim.lossInformation.type = 'Fire'
      newClaim.lossInformation.catCode = 'TEST' // optional
      newClaim.lossInformation.claimFactors = 'Option To Repair Invoked'
      newClaim.lossInformation.description = 'Wow what a fire'

      newClaim.lossLocation.fullAddress = 'Redacted'
      newClaim.lossLocation.addressType = 'Property'
      newClaim.lossLocation.street = 'Redacted'
      newClaim.lossLocation.secondaryStreet = 'Apt A'
      newClaim.lossLocation.city = 'Redacted'
      newClaim.lossLocation.county = 'Spokane'
      newClaim.lossLocation.state = 'WA'
      newClaim.lossLocation.zipCode = 'Redacted'
      newClaim.lossLocation.map = 'View in Google Maps'
      newClaim.lossLocation.mapStreet = 'Redacted a'

      newClaim.contact.name = 'Test Contact'
      newClaim.contact.phone = 'Redacted'
      newClaim.contact.email = 'bpeterson+testcontact@company.com'

      newClaim.testData.claimCallbackSearch = `I am so confused`
      newClaim.testData.claimTimelineCount = 6
      newClaim.testData.claimInspectionSuffix =
        'Redacted'
      newClaim.testData.claimInspectionSuffixAlt =
        'Redacted'

      newClaim.testData.claimContactClaimsPortal = 'Automation UserPortal'
      newClaim.testData.claimContactRedacted = 'Redacted'
      newClaim.testData.claimsDocument = 'Test File ClaimsPortal'
      newClaim.testData.claimsMedia = 'Test File ClaimsPortal'
      newClaim.testData.versionedDocument = 'Versioned Document'
      newClaim.testData.versionedMedia = 'Versioned Media'
      newClaim.testData.documentDescription = 'Test File Description'

      newClaim.testData.claimInspectionDescription = `solo convo`
      newClaim.testData.claimInspectionTranscript = 'later'
      newClaim.testData.claimInspectionDescriptionOther = `say`
      newClaim.testData.claimInspectionOrganizer = `test_a`

      newClaim.testData.claimInspectionDuration = `Redacted`
      newClaim.testData.claimInspectionScreenshot = 'Redacted'
      newClaim.testData.claimInspectionScreenshotOther = 'Redacted'
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
      newClaim.testData.claimEstimatesNotes = 'oats'
      newClaim.testData.claimEstimatesNotesOther = 'totes'
      newClaim.testData.claimEstimatesSubmittedBy = 'LIONSES'
      newClaim.testData.claimEstimateId = 'Redacted'
      newClaim.testData.claimEstimateType = 'standard'
      newClaim.testData.claimEstimateExternalSourceId = 'Redacted'
      newClaim.testData.claimEstimateSubmissionDate = 'Redacted'
      newClaim.testData.claimEstimateSubmittedBy = 'LION'
      newClaim.testData.claimEstimateNotes = 'totes'
      return newClaim
    }
    case CannedClaimTypes.DocumentStashClaim: {
      const newClaim = new DelegatePortalClaim('TESTDocumentStash')
      newClaim.basicInfo.carrier = 'TECH - Redacted'
      return newClaim
    }
  }
}

export function FetchCannedClaimForTestEnvironment(cannedClaim: CannedClaimTypes) {
  switch (cannedClaim) {
    case CannedClaimTypes.Sushi: {
      const newClaim = new DelegatePortalClaim('Redacted')
      newClaim.basicInfo.policyNumber = 'Redacted'
      newClaim.basicInfo.reactedID = 'Redacted'
      newClaim.basicInfo.carrier = 'Redacted - Staff'
      newClaim.testData.claimNotesSearchFullyExported = 'asdfa'
      newClaim.testData.claimNotesSearchNotExported = 'wasabi'
      return newClaim
    }
    case CannedClaimTypes.DefaultTestClaim: {
      const newClaim = new DelegatePortalClaim('Redacted')
      newClaim.basicInfo.policyNumber = 'Redacted'
      newClaim.basicInfo.carrier = 'TECH - Redacted'
      newClaim.basicInfo.coordinator = 'test_a@test.company.com'
      newClaim.basicInfo.fieldAgent = 'Automation FieldAgent'
      newClaim.basicInfo.inspectionTech = 'Automation InspectionTech'
      newClaim.basicInfo.hasLegalRep = 'No'
      newClaim.basicInfo.hasJob = 'Yes'
      newClaim.basicInfo.claimStatus = 'Inspection'

      newClaim.lossInformation.date = 'Redacted'
      newClaim.lossInformation.type = 'Fire'
      newClaim.lossInformation.catCode = 'TEST' // optional
      newClaim.lossInformation.claimFactors = 'Option To Repair Invoked'
      newClaim.lossInformation.description = 'Wow what a fire'

      newClaim.lossLocation.fullAddress = 'Redacted'
      newClaim.lossLocation.addressType = 'Property'
      newClaim.lossLocation.street = 'Redacted'
      newClaim.lossLocation.secondaryStreet = 'Apt A'
      newClaim.lossLocation.city = 'Redacted'
      newClaim.lossLocation.county = 'Spokane'
      newClaim.lossLocation.state = 'WA'
      newClaim.lossLocation.zipCode = 'Redacted'
      newClaim.lossLocation.map = 'View in Google Maps'
      newClaim.lossLocation.mapStreet = 'Redacted a'

      newClaim.contact.name = 'Test Contact'
      newClaim.contact.phone = 'Redacted'
      newClaim.contact.email = 'bpeterson+testcontact@company.com'
      // newJob.testData.document = 'Test Document'
      newClaim.testData.claimCallbackSearch = `I am so confused`

      newClaim.testData.claimContactClaimsPortal = 'Automation UserPortal2'
      newClaim.testData.claimContactRedacted = 'Redacted'
      newClaim.testData.claimsDocument = 'Test File ClaimsPortal'
      newClaim.testData.claimsMedia = 'Test File ClaimsPortal'
      newClaim.testData.versionedDocument = 'Versioned Document'
      newClaim.testData.versionedMedia = 'Versioned Media'
      newClaim.testData.documentDescription = 'Test File Description'
      newClaim.testData.claimTimelineCount = 19

      newClaim.testData.claimInspectionSuffix =
        'Redacted'
      newClaim.testData.claimInspectionSuffixAlt =
        'Redacted'
      newClaim.testData.claimInspectionDescription = `solo convo`
      newClaim.testData.claimInspectionTranscript = 'later'
      newClaim.testData.claimInspectionDescriptionOther = `say`
      newClaim.testData.claimInspectionOrganizer = `test_a`
      newClaim.testData.claimInspectionDuration = `Redacted`
      newClaim.testData.claimInspectionDurationAlt = `Redacted`
      newClaim.testData.claimInspectionScreenshot = 'Redacted'
      newClaim.testData.claimInspectionScreenshotAlt = 'Redacted'
      newClaim.testData.claimInspectionScreenshotOther = 'Redacted'
      newClaim.testData.claimInspectionScreenshotOtherAlt = 'Redacted'
      newClaim.testData.claimNotesSearchFullyExported = 'Moo Moo'
      newClaim.testData.claimNotesSearchNotExported = 'Outstanding'
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
      newClaim.testData.claimEstimatesNotes = 'oats'
      newClaim.testData.claimEstimatesNotesOther = 'totes'
      newClaim.testData.claimEstimatesSubmittedBy = 'LIONSES'
      newClaim.testData.claimEstimateId = 'Redacted'
      newClaim.testData.claimEstimateType = 'standard'
      newClaim.testData.claimEstimateExternalSourceId = 'Redacted'
      newClaim.testData.claimEstimateSubmissionDate = 'Redacted'
      newClaim.testData.claimEstimateSubmittedBy = 'LION'
      newClaim.testData.claimEstimateNotes = 'totes'
      return newClaim
    }
    case CannedClaimTypes.DocumentStashClaim: {
      const newClaim = new DelegatePortalClaim('TESTDocumentStash')
      newClaim.basicInfo.carrier = 'TECH - Redacted'
      return newClaim
    }
  }
}

export function FetchCannedTemplateData(environment: string) {
  switch (environment) {
    case CeylonEnvironmentType.Company_QA:
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
          existingDate: new Date('01/16/2026'),
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
          existingDate: new Date('02/01/2026'),
          olderDate: new Date('01/01/2025'),
        },
        note: {
          existingTemplate: 'First Contact Script',
          existingTemplateTextPartial: 'CONTACT INFO',
          existingDate: new Date('04/01/2025'),
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

export function DateFilterFormatting(date: Date): string {
  const padStart = (value: number): string => value.toString().padStart(2, '0')
  const dateString = `${date.getFullYear()}-${padStart(date.getMonth() + 1)}-${padStart(date.getDate())}`
  return dateString
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

export function FetchDateSuffix() {
  return `+${Date.now()}`
}
