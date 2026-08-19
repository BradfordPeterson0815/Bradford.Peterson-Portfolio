import { Locator, expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalClaim } from '../claimsPortalClaim.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimInfoTabStrings, ClaimPageStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalAddTagsDialog } from '../dialogs/claimsPortalAddTagsDialog.js'
import { ClaimsPortalClaimUploadTab } from './claimsPortalClaimUploadTab.js'
import { ClaimsPortalRecordCustomerCommunicationDrawer } from '../drawers/claimsPortalRecordCustomerCommunicationDrawer.js'
import { ClaimsPortalCreateNoteDrawer } from '../drawers/claimsPortalCreateNoteDrawer.js'
import { ClaimsPortalUpdateClaimDrawer } from '../drawers/claimsPortalUpdateClaimDrawer.js'
import { ClaimsPortalCloseClaimDrawer } from '../drawers/claimsPortalCloseClaimDrawer.js'
import { ClaimsPortalClaimTimelineTab } from './claimsPortalClaimTimelineTab.js'

export class ClaimsPortalClaimInfoTab extends ClaimsPortalBasePage {
  readonly claim: ClaimsPortalClaim
  readonly URL: string
  readonly Label_BasicInfo_Title: Element
  readonly Label_BasicInfo_ClaimNumber: Element
  readonly Label_BasicInfo_ClaimNumber_Actual: Element
  readonly Label_BasicInfo_PolicyNumber: Element
  readonly Label_BasicInfo_PolicyNumber_Actual: Element
  readonly Label_BasicInfo_DataSource: Element
  readonly Label_BasicInfo_DataSource_Actual: Element
  readonly Label_BasicInfo_RedactedID: Element
  readonly Link_BasicInfo_RedactedID_Actual: Element
  readonly Label_BasicInfo_Redacted1ID: Element
  readonly Link_BasicInfo_Redacted1ID_Actual: Element
  readonly Label_BasicInfo_Redacted1ImportStatus: Element
  readonly Label_BasicInfo_Redacted1ImportStatus_Actual: Element
  readonly Label_BasicInfo_Carrier: Element
  readonly Label_BasicInfo_Carrier_Actual: Element
  readonly Label_BasicInfo_Coordinator: Element
  readonly Label_BasicInfo_Coordinator_Actual: Element
  readonly Button_EditCoordinator: Locator
  readonly Button_RemoveCoordinator: Locator
  readonly ComboBox_EditingCoordinator_Select: Locator
  readonly Button_EditingCoordinator_Save: Locator
  readonly Button_EditingCoordinator_GotoContactBook: Locator
  readonly Button_EditingCoordinator_CancelEditing: Locator
  readonly Label_BasicInfo_FieldAgent: Element
  readonly Label_BasicInfo_FieldAgent_Actual: Element
  readonly Button_EditFieldAgent: Locator
  readonly Button_RemoveFieldAgent: Locator
  readonly Button_ExportFieldAgentToRedacted1: Locator
  readonly ComboBox_EditingFieldAgent_Select: Locator
  readonly Button_EditingFieldAgent_Save: Locator
  readonly Button_EditingFieldAgent_GotoContactBook: Locator
  readonly Button_EditingFieldAgent_CancelEditing: Locator
  readonly Label_BasicInfo_ProjectManager: Element
  readonly Label_BasicInfo_ProjectManager_Actual: Element
  readonly Button_EditProjectManager: Locator
  readonly Button_RemoveProjectManager: Locator
  readonly ComboBox_EditingProjectManager_Select: Locator
  readonly Button_EditingProjectManager_Save: Locator
  readonly Button_EditingProjectManager_GotoContactBook: Locator
  readonly Button_EditingProjectManager_CancelEditing: Locator
  readonly Label_BasicInfo_Reviewer: Element
  readonly Label_BasicInfo_Reviewer_Actual: Element
  readonly Button_EditReviewer: Locator
  readonly Button_RemoveReviewer: Locator
  readonly ComboBox_EditingReviewer_Select: Locator
  readonly Button_EditingReviewer_Save: Locator
  readonly Button_EditingReviewer_GotoContactBook: Locator
  readonly Button_EditingReviewer_CancelEditing: Locator
  readonly Label_BasicInfo_HasLegalRep: Element
  readonly Label_BasicInfo_HasLegalRep_Actual: Element
  readonly Label_BasicInfo_HasJob: Element
  readonly Label_BasicInfo_HasJob_Actual: Element
  readonly Label_BasicInfo_ClaimStatus: Element
  readonly Label_BasicInfo_ClaimStatus_Actual: Element
  readonly Label_LossInformation_Title: Element
  readonly Label_LossInformation_LossDate: Element
  readonly Label_LossInformation_LossType: Element
  readonly Label_LossInformation_CatCode: Element
  readonly Label_LossInformation_ClaimFactors: Element
  readonly Label_LossInformation_InitialClaimActions: Element
  readonly Label_LossInformation_LossDescription: Element
  readonly Label_LossInformation_LossDate_Actual: Element
  readonly Label_LossInformation_LossType_Actual: Element
  readonly Label_LossInformation_CatCode_Actual: Element
  readonly Label_LossInformation_ClaimFactors_Actual: Element
  readonly Label_LossInformation_InitialClaimActions_Actual: Element
  readonly Label_LossInformation_LossDescription_Actual: Element
  readonly Label_LossLocation_Title: Element
  readonly Label_LossLocation_AddressType: Element
  readonly Label_LossLocation_Street: Element
  readonly Label_LossLocation_SecondaryStreet: Element
  readonly Label_LossLocation_City: Element
  readonly Label_LossLocation_County: Element
  readonly Label_LossLocation_State: Element
  readonly Label_LossLocation_ZipCode: Element
  readonly Label_LossLocation_Map: Element
  readonly Label_LossLocation_AddressType_Actual: Element
  readonly Label_LossLocation_Street_Actual: Element
  readonly Label_LossLocation_SecondaryStreet_Actual: Element
  readonly Label_LossLocation_City_Actual: Element
  readonly Label_LossLocation_County_Actual: Element
  readonly Label_LossLocation_State_Actual: Element
  readonly Label_LossLocation_ZipCode_Actual: Element
  readonly Link_LossLocation_Map_Actual: Element
  readonly Label_ContactInformation_Title: Element
  readonly Label_ContactInformation_Name: Element
  readonly Label_ContactInformation_Phone: Element
  readonly Label_ContactInformation_Email: Element
  readonly Label_ContactInformation_Name_Actual: Element
  readonly Link_ContactInformation_Phone_Actual: Element
  readonly Link_ContactInformation_Email_Actual: Element
  readonly Label_ClaimReviews_Title: Element
  readonly Label_ClaimReviews_NoReviews: Element
  readonly Label_ClaimReviews_FlaggedForReview: Element
  readonly Button_ClaimReviews_FlagClaimForReview: Element
  readonly Button_ClaimReviews_ViewReviewHistory: Element
  readonly Button_ClaimReviews_CompleteReview: Element
  readonly Button_ClaimReviews_ReadNotes: Element
  readonly Label_Actions_Title: Element
  readonly Button_Actions_CantPublish: Element
  readonly Button_Actions_PublishToRedacted1: Element
  readonly Button_Actions_AddCommunication: Element
  readonly Button_Actions_AddNote: Element
  readonly Button_Actions_AddTags: Element
  readonly Link_Actions_GenerateDocument: Element
  readonly Link_Actions_StartInspection: Element
  readonly Button_Actions_UpdateClaim: Element
  readonly Link_Actions_UploadFiles: Element
  readonly Button_Actions_CloseClaim: Element
  readonly Button_Actions_ReopenClaim: Element
  readonly Label_ClaimTimeline_Title: Element
  readonly Link_ViewFullTimeline: Locator
  readonly timelineEvents: Locator
  readonly tags: Locator
  readonly claimHeaderParent: Locator
  readonly claimReviewsFlaggedDescription: Locator
  readonly claimReadOnlyBadge: Locator
  readonly baseUrl: string

  constructor(global: ClaimsPortalGlobal, claim: ClaimsPortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/info`
    this.baseUrl = claimPageURL
    this.claimHeaderParent = this.page.locator('#root div.chakra-container > div')
    this.tags = this.claimHeaderParent.locator(
      '> div:nth-child(2) > div > div:nth-child(2) > div:nth-child(5) ul li'
    )
    this.claimReadOnlyBadge = this.page
      .locator('span.chakra-badge')
      .getByText(ClaimPageStrings.Badge_ReadOnly, { exact: true })

    this.Label_BasicInfo_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(0),
      ClaimInfoTabStrings.Title_BasicInfo
    )
    this.Label_BasicInfo_ClaimNumber = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_ClaimNumber, { exact: true }),
      ClaimInfoTabStrings.Label_ClaimNumber
    )
    this.Label_BasicInfo_ClaimNumber_Actual = new Element(
      global.page,
      this.Label_BasicInfo_ClaimNumber.locator.locator('..').locator('..').locator('> dd'),
      claim.basicInfo.claimNumber
    )
    this.Label_BasicInfo_PolicyNumber = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_PolicyNumber, { exact: true }),
      ClaimInfoTabStrings.Label_PolicyNumber
    )
    this.Label_BasicInfo_PolicyNumber_Actual = new Element(
      global.page,
      this.Label_BasicInfo_PolicyNumber.locator.locator('..').locator('..').locator('> dd'),
      claim.basicInfo.policyNumber
    )

    this.Label_BasicInfo_DataSource = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_DataSource, { exact: true }),
      ClaimInfoTabStrings.Label_DataSource
    )

    this.Label_BasicInfo_DataSource_Actual = new Element(
      global.page,
      this.Label_BasicInfo_DataSource.locator.locator('..').locator('..').locator('> dd'),
      claim.basicInfo.dataSource
    )

    this.Label_BasicInfo_RedactedID = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_RedactedID, { exact: true }),
      ClaimInfoTabStrings.Label_RedactedID
    )

    this.Link_BasicInfo_RedactedID_Actual = new Element(
      global.page,
      this.Label_BasicInfo_RedactedID.locator.locator('..').locator('..').locator('> dd > a'),
      claim.basicInfo.dataSourceID
    )

    this.Label_BasicInfo_Redacted1ImportStatus = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_ImportStatus, { exact: true }),
      ClaimInfoTabStrings.Label_ImportStatus
    )

    this.Label_BasicInfo_Redacted1ImportStatus_Actual = new Element(
      global.page,
      this.Label_BasicInfo_Redacted1ImportStatus.locator.locator('..').locator('..').locator('> dd'),
      claim.basicInfo.xaImportStatus
    )

    this.Label_BasicInfo_Redacted1ID = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_Redacted1ID, { exact: true }),
      ClaimInfoTabStrings.Label_Redacted1ID
    )

    this.Link_BasicInfo_Redacted1ID_Actual = new Element(
      global.page,
      this.Label_BasicInfo_Redacted1ID.locator.locator('..').locator('..').locator('> dd > a'),
      claim.basicInfo.dataSourceID
    )

    this.Label_BasicInfo_Carrier = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(1)
        .getByText(ClaimInfoTabStrings.Label_Carrier, { exact: true }),
      ClaimInfoTabStrings.Label_Carrier
    )

    this.Label_BasicInfo_Carrier_Actual = new Element(
      global.page,
      this.Label_BasicInfo_Carrier.locator.locator('..').locator('..').locator('> dd'),
      claim.basicInfo.carrier
    )

    this.Label_BasicInfo_Coordinator = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(1)
        .getByText(ClaimInfoTabStrings.Label_Coordinator, { exact: true }),
      ClaimInfoTabStrings.Label_Coordinator
    )
    this.Label_BasicInfo_Coordinator_Actual = new Element(
      global.page,
      this.Label_BasicInfo_Coordinator.locator.locator('..').locator('..').locator('> dd'),
      claim.basicInfo.coordinator
    )
    this.Button_EditCoordinator = this.page.locator('button[aria-label="Edit Coordinator."]')
    this.Button_RemoveCoordinator = this.page.locator('button[aria-label="Remove Coordinator}."]')
    this.ComboBox_EditingCoordinator_Select = this.page.locator(
      '#coordinatorContactInlineAssignClaimPrimaryForm input[role="combobox"]'
    )
    this.Button_EditingCoordinator_Save = this.page.locator(
      'button[aria-label="Save Coordinator."]'
    )
    this.Button_EditingCoordinator_GotoContactBook = this.page.locator(
      '#coordinatorContactInlineAssignClaimPrimaryForm button[aria-label="Go to contact book."]'
    )
    this.Button_EditingCoordinator_CancelEditing = this.page.locator(
      'button[aria-label="Cancel editing Coordinator."]'
    )

    this.Label_BasicInfo_FieldAgent = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(1)
        .getByText(ClaimInfoTabStrings.Label_FieldAgent, { exact: true }),
      ClaimInfoTabStrings.Label_FieldAgent
    )
    this.Label_BasicInfo_FieldAgent_Actual = new Element(
      global.page,
      this.Label_BasicInfo_FieldAgent.locator.locator('..').locator('..').locator('> dd'),
      claim.basicInfo.fieldAgent
    )
    this.Button_EditFieldAgent = this.page.locator('button[aria-label="Edit Field Agent."]')
    this.Button_RemoveFieldAgent = this.page.locator(
      'button[aria-label="Remove Field Agent}."]'
    )
    this.Button_ExportFieldAgentToRedacted1 = this.page.locator('button[aria-label="Export to Redacted1"]')
    this.ComboBox_EditingFieldAgent_Select = this.page.locator(
      '#fieldAgentContactInlineAssignClaimPrimaryForm input[role="combobox"]'
    )
    this.Button_EditingFieldAgent_Save = this.page.locator(
      'button[aria-label="Save Field Agent."]'
    )
    this.Button_EditingFieldAgent_GotoContactBook = this.page.locator(
      '#fieldAgentContactInlineAssignClaimPrimaryForm button[aria-label="Go to contact book."]'
    )
    this.Button_EditingFieldAgent_CancelEditing = this.page.locator(
      'button[aria-label="Cancel editing Field Agent."]'
    )

    this.Label_BasicInfo_ProjectManager = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(1)
        .getByText(ClaimInfoTabStrings.Label_ProjectManager, { exact: true }),
      ClaimInfoTabStrings.Label_ProjectManager
    )
    this.Label_BasicInfo_ProjectManager_Actual = new Element(
      global.page,
      this.Label_BasicInfo_ProjectManager.locator.locator('..').locator('..').locator('> dd'),
      claim.basicInfo.projectManager
    )
    this.Button_EditProjectManager = this.page.locator('button[aria-label="Edit Project Manager."]')
    this.Button_RemoveProjectManager = this.page.locator(
      'button[aria-label="Remove Project Manager}."]'
    )
    this.ComboBox_EditingProjectManager_Select = this.page.locator(
      '#projectManagerContactInlineAssignClaimPrimaryForm input[role="combobox"]'
    )
    this.Button_EditingProjectManager_Save = this.page.locator(
      'button[aria-label="Save Project Manager."]'
    )
    this.Button_EditingProjectManager_GotoContactBook = this.page.locator(
      '#projectManagerContactInlineAssignClaimPrimaryForm button[aria-label="Go to contact book."]'
    )
    this.Button_EditingProjectManager_CancelEditing = this.page.locator(
      'button[aria-label="Cancel editing Project Manager."]'
    )

    this.Label_BasicInfo_Reviewer = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(1)
        .getByText(ClaimInfoTabStrings.Label_Reviewer, { exact: true }),
      ClaimInfoTabStrings.Label_Reviewer
    )
    this.Label_BasicInfo_Reviewer_Actual = new Element(
      global.page,
      this.Label_BasicInfo_Reviewer.locator.locator('..').locator('..').locator('> dd'),
      claim.basicInfo.reviewer
    )
    this.Button_EditReviewer = this.page.locator('button[aria-label="Edit Reviewer."]')
    this.Button_RemoveReviewer = this.page.locator('button[aria-label="Remove Reviewer}."]')
    this.ComboBox_EditingReviewer_Select = this.page.locator(
      '#reviewerContactInlineAssignClaimPrimaryForm input[role="combobox"]'
    )
    this.Button_EditingReviewer_Save = this.page.locator('button[aria-label="Save Reviewer."]')
    this.Button_EditingReviewer_GotoContactBook = this.page.locator(
      '#reviewerContactInlineAssignClaimPrimaryForm button[aria-label="Go to contact book."]'
    )
    this.Button_EditingReviewer_CancelEditing = this.page.locator(
      'button[aria-label="Cancel editing Reviewer."]'
    )

    this.Label_BasicInfo_HasLegalRep = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(2)
        .getByText(ClaimInfoTabStrings.Label_HasLegalRep, { exact: true }),
      ClaimInfoTabStrings.Label_HasLegalRep
    )
    this.Label_BasicInfo_HasLegalRep_Actual = new Element(
      global.page,
      this.Label_BasicInfo_HasLegalRep.locator.locator('..').locator('..').locator('> dd'),
      claim.basicInfo.hasLegalRep
    )

    this.Label_BasicInfo_HasJob = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(2)
        .getByText(ClaimInfoTabStrings.Label_HasJob, { exact: true }),
      ClaimInfoTabStrings.Label_HasJob
    )
    this.Label_BasicInfo_HasJob_Actual = new Element(
      global.page,
      this.Label_BasicInfo_HasJob.locator.locator('..').locator('..').locator('> dd'),
      claim.basicInfo.hasJob
    )

    this.Label_BasicInfo_ClaimStatus = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(2)
        .getByText(ClaimInfoTabStrings.Label_ClaimStatus, { exact: true }),
      ClaimInfoTabStrings.Label_ClaimStatus
    )
    this.Label_BasicInfo_ClaimStatus_Actual = new Element(
      global.page,
      this.Label_BasicInfo_ClaimStatus.locator.locator('..').locator('..').locator('> dd'),
      claim.basicInfo.claimStatus
    )

    this.Label_LossInformation_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(1),
      ClaimInfoTabStrings.Title_LossInformation
    )
    this.Label_LossInformation_LossDate = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_LossDate, { exact: true }),
      ClaimInfoTabStrings.Label_LossDate
    )
    this.Label_LossInformation_LossDate_Actual = new Element(
      global.page,
      this.Label_LossInformation_LossDate.locator.locator('..').locator('..').locator('> dd'),
      claim.lossInformation.date
    )

    this.Label_LossInformation_LossType = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_LossType, { exact: true }),
      ClaimInfoTabStrings.Label_LossType
    )
    this.Label_LossInformation_LossType_Actual = new Element(
      global.page,
      this.Label_LossInformation_LossType.locator.locator('..').locator('..').locator('> dd'),
      claim.lossInformation.type
    )

    this.Label_LossInformation_CatCode = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_CATCode, { exact: true }),
      ClaimInfoTabStrings.Label_CATCode
    )
    this.Label_LossInformation_CatCode_Actual = new Element(
      global.page,
      this.Label_LossInformation_CatCode.locator.locator('..').locator('..').locator('> dd'),
      claim.lossInformation.catCode
    )

    this.Label_LossInformation_ClaimFactors = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_ClaimFactors, { exact: true }),
      ClaimInfoTabStrings.Label_ClaimFactors
    )
    this.Label_LossInformation_ClaimFactors_Actual = new Element(
      global.page,
      this.Label_LossInformation_ClaimFactors.locator.locator('..').locator('..').locator('> dd'),
      claim.lossInformation.claimFactors
    )

    this.Label_LossInformation_InitialClaimActions = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_InitialClaimActions, { exact: true }),
      ClaimInfoTabStrings.Label_InitialClaimActions
    )
    this.Label_LossInformation_InitialClaimActions_Actual = new Element(
      global.page,
      this.Label_LossInformation_InitialClaimActions.locator
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossInformation.initalClaimActions
    )

    this.Label_LossInformation_LossDescription = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_LossDescription, { exact: true }),
      ClaimInfoTabStrings.Label_LossDescription
    )
    this.Label_LossInformation_LossDescription_Actual = new Element(
      global.page,
      this.Label_LossInformation_LossDescription.locator
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossInformation.description
    )

    this.Label_LossLocation_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(2),
      ClaimInfoTabStrings.Title_LossLossLocation
    )

    this.Label_LossLocation_AddressType = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_AddressType, { exact: true }),
      ClaimInfoTabStrings.Label_AddressType
    )
    this.Label_LossLocation_AddressType_Actual = new Element(
      global.page,
      this.Label_LossLocation_AddressType.locator.locator('..').locator('..').locator('> dd'),
      claim.lossLocation.addressType
    )

    this.Label_LossLocation_Street = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_Street, { exact: true }),
      ClaimInfoTabStrings.Label_Street
    )
    this.Label_LossLocation_Street_Actual = new Element(
      global.page,
      this.Label_LossLocation_Street.locator.locator('..').locator('..').locator('> dd'),
      claim.lossLocation.street
    )

    this.Label_LossLocation_SecondaryStreet = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_SecondaryStreet, { exact: true }),
      ClaimInfoTabStrings.Label_SecondaryStreet
    )
    this.Label_LossLocation_SecondaryStreet_Actual = new Element(
      global.page,
      this.Label_LossLocation_SecondaryStreet.locator.locator('..').locator('..').locator('> dd'),
      claim.lossLocation.secondaryStreet
    )

    this.Label_LossLocation_City = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_City, { exact: true }),
      ClaimInfoTabStrings.Label_City
    )
    this.Label_LossLocation_City_Actual = new Element(
      global.page,
      this.Label_LossLocation_City.locator.locator('..').locator('..').locator('> dd'),
      claim.lossLocation.city
    )

    this.Label_LossLocation_County = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_County, { exact: true }),
      ClaimInfoTabStrings.Label_County
    )
    this.Label_LossLocation_County_Actual = new Element(
      global.page,
      this.Label_LossLocation_County.locator.locator('..').locator('..').locator('> dd'),
      claim.lossLocation.county
    )

    this.Label_LossLocation_State = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_State, { exact: true }),
      ClaimInfoTabStrings.Label_State
    )
    this.Label_LossLocation_State_Actual = new Element(
      global.page,
      this.Label_LossLocation_State.locator.locator('..').locator('..').locator('> dd'),
      claim.lossLocation.state
    )

    this.Label_LossLocation_ZipCode = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_ZIPCode, { exact: true }),
      ClaimInfoTabStrings.Label_ZIPCode
    )
    this.Label_LossLocation_ZipCode_Actual = new Element(
      global.page,
      this.Label_LossLocation_ZipCode.locator.locator('..').locator('..').locator('> dd'),
      claim.lossLocation.zipCode
    )

    this.Label_LossLocation_Map = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_Map, { exact: true }),
      ClaimInfoTabStrings.Label_Map
    )
    this.Link_LossLocation_Map_Actual = new Element(
      global.page,
      this.Label_LossLocation_Map.locator.locator('..').locator('..').locator('> dd > a'),
      claim.lossLocation.map
    )

    this.Label_ContactInformation_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(3),
      ClaimInfoTabStrings.Title_ContactInformation
    )

    this.Label_ContactInformation_Name = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(3)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_Name, { exact: true }),
      ClaimInfoTabStrings.Label_Name
    )

    this.Label_ContactInformation_Name_Actual = new Element(
      global.page,
      this.Label_ContactInformation_Name.locator.locator('..').locator('..').locator('> dd'),
      claim.contact.name
    )

    this.Label_ContactInformation_Phone = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(3)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_Phone, { exact: true }),
      ClaimInfoTabStrings.Label_Phone
    )
    this.Link_ContactInformation_Phone_Actual = new Element(
      global.page,
      this.Label_ContactInformation_Phone.locator.locator('..').locator('..').locator('> dd'),
      claim.contact.phone
    )

    this.Label_ContactInformation_Email = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(3)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimInfoTabStrings.Label_Email, { exact: true }),
      ClaimInfoTabStrings.Label_Email
    )
    this.Link_ContactInformation_Email_Actual = new Element(
      global.page,
      this.Label_ContactInformation_Email.locator.locator('..').locator('..').locator('> dd'),
      claim.contact.email
    )

    this.Label_ClaimReviews_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(4),
      ClaimInfoTabStrings.Title_ClaimReviews
    )
    this.Label_ClaimReviews_NoReviews = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(4)
        .getByText(ClaimInfoTabStrings.Label_NoReviews, { exact: true }),
      ClaimInfoTabStrings.Label_NoReviews
    )
    this.Button_ClaimReviews_FlagClaimForReview = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(4)
        .getByText(ClaimInfoTabStrings.Button_FlagClaimForReview, { exact: true }),
      ClaimInfoTabStrings.Button_FlagClaimForReview
    )
    this.Button_ClaimReviews_ViewReviewHistory = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(4)
        .getByText(ClaimInfoTabStrings.Button_ViewReviewHistory, { exact: true }),
      ClaimInfoTabStrings.Button_ViewReviewHistory
    )

    this.Label_ClaimReviews_FlaggedForReview = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(4)
        .locator('div[data-status="warning"] > div > div[data-status="warning"]')
        .nth(0),
      ClaimInfoTabStrings.Label_FlaggedForReview
    )
    this.claimReviewsFlaggedDescription = this.page
      .locator('div[id$="_content"]')
      .nth(4)
      .locator('div[data-status="warning"] > div > div[data-status="warning"]')
      .nth(1)
      .locator('p')

    this.Button_ClaimReviews_CompleteReview = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(4)
        .locator('div[data-status="warning"] > div > div[data-status="warning"]')
        .nth(1)
        .locator('button')
        .nth(0),
      ClaimInfoTabStrings.Button_CompleteReview
    )

    this.Button_ClaimReviews_ReadNotes = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(4)
        .locator('div[data-status="warning"] > div > div[data-status="warning"]')
        .nth(1)
        .locator('button')
        .nth(1),
      ClaimInfoTabStrings.Button_ReadNotes
    )

    this.Label_Actions_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(5),
      ClaimInfoTabStrings.Title_Actions
    )

    this.Button_Actions_CantPublish = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator('> div')
        .getByText(ClaimInfoTabStrings.Button_CantPublish),
      ClaimInfoTabStrings.Button_CantPublish
    )
    this.Button_Actions_PublishToRedacted1 = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator('> div')
        .getByText(ClaimInfoTabStrings.Button_PublishToRedacted),
      ClaimInfoTabStrings.Button_PublishToRedacted
    )

    this.Button_Actions_AddCommunication = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator('> div')
        .getByText(ClaimInfoTabStrings.Button_AddCommunication),
      ClaimInfoTabStrings.Button_AddCommunication
    )

    this.Button_Actions_AddNote = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator('> div')
        .getByText(ClaimInfoTabStrings.Button_AddNote),
      ClaimInfoTabStrings.Button_AddNote
    )

    this.Button_Actions_AddTags = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator('> div')
        .getByText(ClaimInfoTabStrings.Button_AddTags),
      ClaimInfoTabStrings.Button_AddTags
    )

    this.Link_Actions_GenerateDocument = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator('> div')
        .getByText(ClaimInfoTabStrings.Link_GenerateDocument),
      ClaimInfoTabStrings.Link_GenerateDocument
    )

    this.Link_Actions_StartInspection = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator('> div')
        .getByText(ClaimInfoTabStrings.Button_StartInspection),
      ClaimInfoTabStrings.Button_StartInspection
    )

    this.Button_Actions_UpdateClaim = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator('> div')
        .getByText(ClaimInfoTabStrings.Button_UpdateClaim),
      ClaimInfoTabStrings.Button_UpdateClaim
    )

    this.Link_Actions_UploadFiles = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator('> div')
        .getByText(ClaimInfoTabStrings.Button_UploadFiles),
      ClaimInfoTabStrings.Button_UploadFiles
    )

    this.Button_Actions_CloseClaim = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator('> div')
        .getByText(ClaimInfoTabStrings.Button_CloseClaim),
      ` ${ClaimInfoTabStrings.Button_CloseClaim}`
    )

    this.Button_Actions_ReopenClaim = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator('> div')
        .getByText(ClaimInfoTabStrings.Button_ReopenClaim),
      ClaimInfoTabStrings.Button_ReopenClaim
    )

    this.Label_ClaimTimeline_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(6),
      ClaimInfoTabStrings.Title_ClaimTimeline
    )

    this.Link_ViewFullTimeline = this.page
      .locator('div.chakra-card__header')
      .nth(6)
      .locator('a')
      .nth(0)
    this.timelineEvents = this.page
      .locator('div[id$="_content"]')
      .nth(6)
      .locator('> div > div.chakra-stack > div.chakra-stack')
  }

  async IsReadOnly() {
    return (await this.claimReadOnlyBadge.count()) > 0
  }

  async VerifyBasicInfoSection(smoke = false) {
    await this.Label_BasicInfo_Title.VerifyExpectedText()
    await this.Label_BasicInfo_ClaimNumber.VerifyExpectedTextAlt()
    const dataSourceActual = await this.Label_BasicInfo_DataSource_Actual.GetText()
    await this.Label_BasicInfo_PolicyNumber.VerifyExpectedTextAlt()
    await this.Label_BasicInfo_DataSource.VerifyExpectedTextAlt()
    // use the data source type to check for the next labels
    if (dataSourceActual === 'Redacted') {
      await this.Label_BasicInfo_RedactedID.VerifyExpectedTextAlt()
    }
    if (dataSourceActual === 'Company') {
      await this.Label_BasicInfo_Redacted1ImportStatus.VerifyExpectedTextAlt()
    }
    if (dataSourceActual === 'Redacted1') {
      await this.Label_BasicInfo_Redacted1ID.VerifyExpectedTextAlt()
    }
    await this.Label_BasicInfo_Carrier.VerifyExpectedTextAlt()
    await this.Label_BasicInfo_Coordinator.VerifyExpectedTextAlt()
    await this.Label_BasicInfo_FieldAgent.VerifyExpectedTextAlt()
    await this.Label_BasicInfo_ProjectManager.VerifyExpectedTextAlt()
    await this.Label_BasicInfo_Reviewer.VerifyExpectedTextAlt()
    await this.Label_BasicInfo_HasLegalRep.VerifyExpectedTextAlt()
    await this.Label_BasicInfo_HasJob.VerifyExpectedTextAlt()
    await this.Label_BasicInfo_ClaimStatus.VerifyExpectedTextAlt()

    if (smoke) {
      await this.Label_BasicInfo_ClaimNumber_Actual.VerifyExpectedTextAlt()
      const dataSourceOptions: string[] = ['ClientPortal', 'Company', 'Redacted', 'Redacted1']
      const actualDataSource = (await this.Label_BasicInfo_DataSource_Actual.GetText()) ?? ''
      const matchesDataSource = dataSourceOptions.some((source) =>
        actualDataSource.includes(source)
      )
      expect(matchesDataSource).toBe(true)

      const booleanOptions: string[] = ['Yes', 'No']
      const actualHasLegalRep = (await this.Label_BasicInfo_HasLegalRep_Actual.GetText()) ?? ''
      const matchesLegal = booleanOptions.some((legal) => actualHasLegalRep.includes(legal))
      expect(matchesLegal).toBe(true)

      const actualHasJob = (await this.Label_BasicInfo_HasJob_Actual.GetText()) ?? ''
      const matchesJob = booleanOptions.some((job) => actualHasJob.includes(job))
      expect(matchesJob).toBe(true)

      const claimStatusOptions: string[] = [
        'Carrier Review',
        'Coordinator Review',
        'Closed',
        'Inspection',
        'QA Review',
        'Rejected',
      ]
      const actualClaimStatus = (await this.Label_BasicInfo_ClaimStatus_Actual.GetText()) ?? ''
      const matchesStatus = claimStatusOptions.some((status) => actualClaimStatus.includes(status))
      expect(matchesStatus).toBe(true)
    }
    // check data if we know it
    if (!smoke) {
      await this.Label_BasicInfo_ClaimNumber_Actual.VerifyExpectedTextAlt()
      await this.Label_BasicInfo_PolicyNumber_Actual.VerifyExpectedTextAlt()
      await this.Label_BasicInfo_DataSource_Actual.VerifyExpectedTextAlt()
      if (dataSourceActual === 'Redacted') {
        await this.Link_BasicInfo_RedactedID_Actual.VerifyExpectedTextAlt()
      }
      if (dataSourceActual === 'Company') {
        await this.Label_BasicInfo_Redacted1ImportStatus_Actual.VerifyExpectedTextAlt()
      }
      if (dataSourceActual === 'Redacted1') {
        await this.Link_BasicInfo_Redacted1ID_Actual.VerifyExpectedTextAlt()
      }
      await this.Label_BasicInfo_Carrier_Actual.VerifyExpectedTextAlt()
      await this.Label_BasicInfo_Coordinator_Actual.VerifyExpectedTextAlt()
      await this.Label_BasicInfo_FieldAgent_Actual.VerifyExpectedTextAlt()
      await this.Label_BasicInfo_ProjectManager_Actual.VerifyExpectedTextAlt()
      await this.Label_BasicInfo_Reviewer_Actual.VerifyExpectedTextAlt()
      await this.Label_BasicInfo_HasLegalRep_Actual.VerifyExpectedTextAlt()
      await this.Label_BasicInfo_HasJob_Actual.VerifyExpectedTextAlt()
      await this.Label_BasicInfo_ClaimStatus_Actual.VerifyExpectedTextAlt()
    }
  }

  async VerifyLossInformationSection(smoke = false) {
    await this.Label_LossInformation_Title.VerifyExpectedText()
    await this.Label_LossInformation_LossDate.VerifyExpectedTextAlt()
    await this.Label_LossInformation_LossType.VerifyExpectedTextAlt()
    if ((await this.Label_LossInformation_CatCode.locator.count()) > 0) {
      this.Label_LossInformation_CatCode.VerifyExpectedTextAlt()
    }
    if ((await this.Label_LossInformation_ClaimFactors.locator.count()) > 0) {
      this.Label_LossInformation_ClaimFactors.VerifyExpectedTextAlt()
    }
    if ((await this.Label_LossInformation_InitialClaimActions.locator.count()) > 0) {
      this.Label_LossInformation_InitialClaimActions.VerifyExpectedTextAlt()
    }
    await this.Label_LossInformation_LossDescription.VerifyExpectedTextAlt()

    if (!smoke) {
      await this.Label_LossInformation_LossDate_Actual.VerifyExpectedTextAlt()
      await this.Label_LossInformation_LossType_Actual.VerifyExpectedTextAlt()
      if ((await this.Label_LossInformation_CatCode.locator.count()) > 0) {
        this.Label_LossInformation_CatCode_Actual.VerifyExpectedTextAlt()
      }
      if ((await this.Label_LossInformation_ClaimFactors.locator.count()) > 0) {
        this.Label_LossInformation_ClaimFactors_Actual.VerifyExpectedTextAlt()
      }
      if ((await this.Label_LossInformation_InitialClaimActions.locator.count()) > 0) {
        this.Label_LossInformation_InitialClaimActions_Actual.VerifyExpectedTextAlt()
      }
      // since we may be appending data here, we need to just check to see if it starts with what we expect
      const actualText =
        await this.Label_LossInformation_LossDescription_Actual.locator.textContent()
      expect(
        actualText?.startsWith(this.Label_LossInformation_LossDescription_Actual.expectedText)
      ).toBe(true)
    }
  }

  async VerifyLossLocationSection(smoke = false) {
    await this.Label_LossLocation_Title.VerifyExpectedText()

    if ((await this.Label_LossLocation_AddressType.locator.count()) > 0) {
      this.Label_LossLocation_AddressType.VerifyExpectedTextAlt()
    }
    await this.Label_LossLocation_Street.VerifyExpectedTextAlt()
    await this.Label_LossLocation_SecondaryStreet.VerifyExpectedTextAlt()
    await this.Label_LossLocation_City.VerifyExpectedTextAlt()
    await this.Label_LossLocation_State.VerifyExpectedTextAlt()
    await this.Label_LossLocation_ZipCode.VerifyExpectedTextAlt()
    await this.Label_LossLocation_Map.VerifyExpectedTextAlt()

    if (!smoke) {
      if ((await this.Label_LossLocation_AddressType.locator.count()) > 0) {
        this.Label_LossLocation_AddressType_Actual.VerifyExpectedTextAlt()
      }
      await this.Label_LossLocation_Street_Actual.VerifyExpectedTextAlt()
      await this.Label_LossLocation_SecondaryStreet_Actual.VerifyExpectedTextAlt()
      await this.Label_LossLocation_City_Actual.VerifyExpectedTextAlt()
      await this.Label_LossLocation_State_Actual.VerifyExpectedTextAlt()
      await this.Label_LossLocation_ZipCode_Actual.VerifyExpectedTextAlt()
      await this.Link_LossLocation_Map_Actual.VerifyExpectedTextAlt()
    }
  }

  async VerifyContactInformationSection(smoke = false) {
    await this.Label_ContactInformation_Title.VerifyExpectedText()
    await this.Label_ContactInformation_Name.VerifyExpectedTextAlt()
    await this.Label_ContactInformation_Phone.VerifyExpectedTextAlt()
    await this.Label_ContactInformation_Email.VerifyExpectedTextAlt()

    if (!smoke) {
      await this.Label_ContactInformation_Name_Actual.VerifyExpectedTextAlt()
      await this.Link_ContactInformation_Phone_Actual.VerifyExpectedTextAlt()
      await this.Link_ContactInformation_Email_Actual.VerifyExpectedTextAlt()
    }
  }

  async VerifyClaimReviewsSection(smoke = false) {
    await this.Label_ClaimReviews_Title.VerifyExpectedText()

    if ((await this.Label_ClaimReviews_FlaggedForReview.locator.count()) > 0) {
      this.Label_ClaimReviews_FlaggedForReview.VerifyExpectedTextAlt()
      const descriptionText = await this.claimReviewsFlaggedDescription.textContent()
      expect(descriptionText?.startsWith(ClaimInfoTabStrings.Label_FlaggedDescriptionPrefix)).toBe(
        true
      )
      this.Button_ClaimReviews_CompleteReview.VerifyExpectedTextAlt()
      this.Button_ClaimReviews_ReadNotes.VerifyExpectedTextAlt()
    } else {
      await this.Label_ClaimReviews_NoReviews.VerifyExpectedText()
      if (!(await this.IsReadOnly())) {
        await this.Button_ClaimReviews_FlagClaimForReview.VerifyExpectedText()
        const reviewButtonCount = await this.Button_ClaimReviews_ViewReviewHistory.locator.count()
        // optionally, check for Review History Button
        if (reviewButtonCount > 0) {
          await this.Button_ClaimReviews_ViewReviewHistory.VerifyExpectedText()
        }
      }
    }

    if (!smoke) {
      if ((await this.Label_ClaimReviews_FlaggedForReview.locator.count()) > 0) {
        const descriptionTextActual = await this.claimReviewsFlaggedDescription.textContent()
        // TBD Replace <FLAGGED_DATETIME> and <FLAGGED_BY> with date/time and flagger
        const expectedDescriptionText = ClaimInfoTabStrings.Label_FlaggedDescription
        expect(expectedDescriptionText === descriptionTextActual).toBe(true)
      }
    }
  }

  async VerifyActionsSection() {
    await this.Label_Actions_Title.VerifyExpectedText()
    if (await this.IsReadOnly()) {
      await this.Button_Actions_AddNote.VerifyExpectedText()
      await this.Button_Actions_AddTags.VerifyExpectedText()
      await this.Link_Actions_GenerateDocument.VerifyExpectedText()
      await this.Link_Actions_StartInspection.VerifyExpectedText()
      await this.Link_Actions_UploadFiles.VerifyExpectedText()
    } else {
      if ((await this.Button_Actions_CantPublish.locator.count()) > 0) {
        await this.Button_Actions_CantPublish.VerifyExpectedText()
      }
      if ((await this.Button_Actions_PublishToRedacted1.locator.count()) > 0) {
        await this.Button_Actions_PublishToRedacted1.VerifyExpectedText()
      }
      await this.Button_Actions_AddCommunication.VerifyExpectedText()
      await this.Button_Actions_AddNote.VerifyExpectedText()
      await this.Button_Actions_AddTags.VerifyExpectedText()
      await this.Link_Actions_GenerateDocument.VerifyExpectedText()
      await this.Link_Actions_StartInspection.VerifyExpectedText()
      await this.Button_Actions_UpdateClaim.VerifyExpectedText()
      await this.Link_Actions_UploadFiles.VerifyExpectedText()
      if ((await this.Button_Actions_CloseClaim.locator.count()) > 0) {
        await this.Button_Actions_CloseClaim.VerifyExpectedText()
      }
      if ((await this.Button_Actions_ReopenClaim.locator.count()) > 0) {
        await this.Button_Actions_ReopenClaim.VerifyExpectedText()
      }
    }
  }

  async VerifyClaimTimelineSection() {
    await this.Label_ClaimTimeline_Title.VerifyExpectedText()
  }

  async TimelineEventCount() {
    await this.page.waitForTimeout(4000)
    const count = await this.timelineEvents.count()
    return count
  }

  async GetTimelineEvent(index: number) {
    const specificEventParent = this.timelineEvents.nth(index)
    const eventName = await specificEventParent
      .locator('> div:nth-child(2) p:nth-child(1)')
      .textContent()
    const eventDate = await specificEventParent
      .locator('> div:nth-child(2) p:nth-child(2)')
      .textContent()
    const scheduledForLocator = specificEventParent.locator('> div:nth-child(2) p:nth-child(3)')
    const scheduledFor =
      (await scheduledForLocator.count()) > 0 ? await scheduledForLocator.textContent() : ''
    const scheduledDate = scheduledFor?.split('Scheduled for:')[1]
    const createdBy = await specificEventParent.locator('span[property="createdBy"]').textContent()
    return { eventName, eventDate, scheduledDate, createdBy }
  }

  async FindTimelineEventByNameAndDate(targetEventName: string, targetEventDate: string) {
    const eventCount = await this.TimelineEventCount()
    for (let eventIndex = 0; eventIndex < eventCount; eventIndex++) {
      const { eventName, eventDate } = await this.GetTimelineEvent(eventIndex)
      if (eventName == targetEventName && eventDate == targetEventDate) {
        return eventIndex
      }
    }
    return null
  }

  async OpenRedactedLinkInNewTabVerifyTitleAndClose() {
    const pagePromise = this.context.waitForEvent('page')
    await this.Link_BasicInfo_RedactedID_Actual.Click()
    this.page = await pagePromise
    await this.page.waitForLoadState()
    await this.page.bringToFront()
    const pageDescription = new Element(
      this.global.page,
      this.page.locator('form > div > p'),
      ' Log in to access XactAnalysis. '
    )
    await pageDescription.VerifyExpectedText()
    await this.page.close()
  }

  async OpenMapLinkInNewTabVerifyTitleAndClose(streetAddress: string) {
    const pagePromise = this.context.waitForEvent('page')
    await this.Link_LossLocation_Map_Actual.Click()
    this.page = await pagePromise
    await this.page.waitForLoadState()
    await this.page.bringToFront()
    const pageDescription = new Element(
      this.global.page,
      this.page.locator('div[role="main"] h1'),
      `${streetAddress}`
    )
    await pageDescription.VerifyExpectedText()
    await this.page.close()
  }

  async IsCoordinatorAssigned() {
    const assignment = await this.Label_BasicInfo_Coordinator.GetText()
    return !(assignment == 'Unassigned')
  }

  async IsFieldAgentAssigned() {
    const assignment = await this.Label_BasicInfo_FieldAgent.GetText()
    return !(assignment == 'Unassigned')
  }

  async IsProjectManagerAssigned() {
    const assignment = await this.Label_BasicInfo_ProjectManager.GetText()
    return !(assignment == 'Unassigned')
  }

  async IsReviewerAssigned() {
    const assignment = await this.Label_BasicInfo_Reviewer.GetText()
    return !(assignment == 'Unassigned')
  }

  async ValidateCoordinator() {
    // Validate the Coordinator selection input value is in an invalid state and that the error is..
    const selectionLocator = this.page.locator(
      `#coordinatorContactInlineAssignClaimPrimaryForm div[data-invalid=""] > div:nth-child(2)`
    )
    const coordinatorIsValidated =
      (await selectionLocator.textContent()) == ValidationStrings.Required
    return coordinatorIsValidated
  }

  async ValidateFieldAgent() {
    // Validate the Field Agent selection input value is in an invalid state and that the error is..
    const selectionLocator = this.page.locator(
      `#fieldAgentContactInlineAssignClaimPrimaryForm div[data-invalid=""] > div:nth-child(2)`
    )
    const fieldAgentIsValidated =
      (await selectionLocator.textContent()) == ValidationStrings.Required
    return fieldAgentIsValidated
  }

  async ValidateProjectManager() {
    // Validate the Project Manager selection input value is in an invalid state and that the error is..
    const selectionLocator = this.page.locator(
      `#projectManagerContactInlineAssignClaimPrimaryForm div[data-invalid=""] > div:nth-child(2)`
    )
    const projectManagerIsValidated =
      (await selectionLocator.textContent()) == ValidationStrings.Required
    return projectManagerIsValidated
  }

  async ValidateReviewer() {
    // Validate the Reviewer selection input value is in an invalid state and that the error is..
    const selectionLocator = this.page.locator(
      `#reviewerContactInlineAssignClaimPrimaryForm div[data-invalid=""] > div:nth-child(2)`
    )
    const reviewerIsValidated = (await selectionLocator.textContent()) == ValidationStrings.Required
    return reviewerIsValidated
  }

  async OpenAddTags() {
    const buttonLocator = this.page.getByRole('button', { name: 'Add Tags' })
    await buttonLocator.click()
    const addTagsDialog = new ClaimsPortalAddTagsDialog(this.global)
    await expect(addTagsDialog.Title.locator).toBeAttached()
    return addTagsDialog
  }

  async AddTag(key: string, value: string = '', color: string = '') {
    const buttonLocator = this.page.getByRole('button', { name: 'Add Tags' })
    await buttonLocator.click()
    const addTagsDialog = new ClaimsPortalAddTagsDialog(this.global)
    await addTagsDialog.SetKeyValue(key)
    if (value != '') {
      await addTagsDialog.SetValueValue(value)
    }
    if (color != '') {
      await addTagsDialog.SetColor(color)
    }
    await addTagsDialog.Button_AddAndClose.Click()
    await addTagsDialog.Title.locator.waitFor({ state: 'detached' })
  }

  async TagCount() {
    const tagCount = await this.tags.count()
    return tagCount
  }

  async TagIsAdded(tag: string) {
    return await this.TagWithValueIsAdded(tag)
  }

  async TagWithValueIsAdded(tag: string, value: string = '', extraCheck = false) {
    const assembledLocator = this.tags.locator('span span')
    const search = value == '' ? `${tag}` : `${tag}:${value}`
    if (extraCheck) {
      await assembledLocator
        .locator(`text="${search}"`)
        .waitFor({ state: 'attached', timeout: 20000 })
    }
    const tagWithValueExists = (await assembledLocator.locator(`text="${search}"`).count()) > 0
    return tagWithValueExists
  }

  async RemoveTag(tag: string) {
    await this.RemoveTagWithValue(tag)
  }

  async RemoveTagWithValue(tag: string, value: string = '') {
    const assembledLocator = this.tags.locator('span span')
    const search = value == '' ? `${tag}` : `${tag}:${value}`
    const targetedTagLocator = assembledLocator.locator(`text="${search}"`)
    if ((await targetedTagLocator.count()) == 0) {
      throw new Error(`Error - tag to remove: ${search} is not attached to claim`)
    }
    const tagRemoveButton = targetedTagLocator.locator('..').locator('button[aria-label="close"]')
    await tagRemoveButton.click()
    await targetedTagLocator.waitFor({ state: 'detached' })
  }

  async OpenUploadFiles(testClaim: ClaimsPortalClaim, baseURL: string) {
    await this.Link_Actions_UploadFiles.Click()
    const uploadsTab = new ClaimsPortalClaimUploadTab(this.global, testClaim, baseURL)
    return uploadsTab
  }

  async OpenRecordCustomerCommunicationDrawer() {
    await this.Button_Actions_AddCommunication.Click()
    const recordCustomerCommunicationDrawer = new ClaimsPortalRecordCustomerCommunicationDrawer(this.global)
    await expect(recordCustomerCommunicationDrawer.Title.locator).toBeAttached()
    return recordCustomerCommunicationDrawer
  }

  async OpenCreateNoteDrawer() {
    await this.Button_Actions_AddNote.Click()
    const createNoteDrawer = new ClaimsPortalCreateNoteDrawer(this.global)
    await expect(createNoteDrawer.Title.locator).toBeAttached()
    return createNoteDrawer
  }

  async OpenUpdateClaimDrawer() {
    await this.Button_Actions_UpdateClaim.Click()
    const updateClaimDrawer = new ClaimsPortalUpdateClaimDrawer(this.global)
    await expect(updateClaimDrawer.Title.locator).toBeAttached()
    return updateClaimDrawer
  }

  async OpenCloseClaimDrawer() {
    await this.Button_Actions_CloseClaim.Click()
    const closeClaimDrawer = new ClaimsPortalCloseClaimDrawer(this.global)
    await expect(closeClaimDrawer.Title.locator).toBeAttached()
    return closeClaimDrawer
  }

  async OpenFullTimeline() {
    await this.Link_ViewFullTimeline.click()
    await this.page.waitForTimeout(1000)
    const claimTimelineTab = new ClaimsPortalClaimTimelineTab(this.global, this.claim, this.baseUrl)
    return claimTimelineTab
  }
}
