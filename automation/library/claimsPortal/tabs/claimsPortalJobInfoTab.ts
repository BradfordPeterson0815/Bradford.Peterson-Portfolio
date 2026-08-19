import { Locator, expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { JobInfoTabStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalJob } from '../claimsPortalJob.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalJobTimelineNewEventTab } from './claimsPortalJobTimelineNewEventTab.js'
import { ClaimsPortalJobTimelineTab } from './claimsPortalJobTimelineTab.js'
import { ClaimsPortalMarkJobStartedDrawer } from '../drawers/claimsPortalMarkJobStartedDrawer.js'
import { ClaimsPortalCloseJobDrawer } from '../drawers/claimsPortalCloseJobDrawer.js'
import { ClaimsPortalRecordCustomerContactAttemptDrawer } from '../drawers/claimsPortalRecordCustomerContactAttemptDrawer.js'
import { ClaimsPortalEnterWorkDetailsForJobDrawer } from '../drawers/claimsPortalEnterWorkDetailsForJobDrawer.js'

export class ClaimsPortalJobInfoTab extends ClaimsPortalBasePage {
  readonly job: ClaimsPortalJob
  readonly URL: string
  readonly parentURL: string
  readonly Label_JobDetails_Title: Element
  readonly Label_JobDetails_JobNumber: Element
  readonly Label_JobDetails_AssociatedClaim: Element
  readonly Label_JobDetails_Type: Element
  readonly Label_JobDetails_Services: Element
  readonly Label_JobDetails_Description: Element
  readonly Label_JobDetails_JobNumber_Actual: Element
  readonly Link_JobDetails_AssociatedClaim_Actual: Element
  readonly Label_JobDetails_Type_Actual: Element
  readonly Label_JobDetails_Services_Actual: Element
  readonly Label_JobDetails_Description_Actual: Element
  readonly Label_JobAssignments_Title: Element
  readonly Label_JobAssignments_Coordinator: Element
  readonly Label_JobAssignments_Coordinator_Actual: Element
  readonly Button_EditCoordinator: Locator
  readonly Button_RemoveCoordinator: Locator
  readonly ComboBox_EditingCoordinator_Select: Locator
  readonly Button_EditingCoordinator_Save: Locator
  readonly Button_EditingCoordinator_GotoContactBook: Locator
  readonly Button_EditingCoordinator_CancelEditing: Locator
  readonly Label_JobAssignments_ProjectManager: Element
  readonly Label_JobAssignments_ProjectManager_Actual: Element
  readonly Button_EditProjectManager: Locator
  readonly Button_RemoveProjectManager: Locator
  readonly ComboBox_EditingProjectManager_Select: Locator
  readonly Button_EditingProjectManager_Save: Locator
  readonly Button_EditingProjectManager_GotoContactBook: Locator
  readonly Button_EditingProjectManager_CancelEditing: Locator
  readonly Label_JobAssignments_Approver: Element
  readonly Label_JobAssignments_Approver_Actual: Element
  readonly Button_EditApprover: Locator
  readonly Button_RemoveApprover: Locator
  readonly ComboBox_EditingApprover_Select: Locator
  readonly Button_EditingApprover_Save: Locator
  readonly Button_EditingApprover_GotoContactBook: Locator
  readonly Button_EditingApprover_CancelEditing: Locator
  readonly Label_JobAssignments_Dispatcher: Element
  readonly Label_JobAssignments_Dispatcher_Actual: Element
  readonly Button_EditDispatcher: Locator
  readonly Button_RemoveDispatcher: Locator
  readonly ComboBox_EditingDispatcher_Select: Locator
  readonly Button_EditingDispatcher_Save: Locator
  readonly Button_EditingDispatcher_GotoContactBook: Locator
  readonly Button_EditingDispatcher_CancelEditing: Locator
  readonly Label_JobAssignments_Subcontractor: Element
  readonly Label_JobAssignments_Subcontractor_Actual: Element
  readonly Button_EditSubcontractor: Locator
  readonly Button_RemoveSubcontractor: Locator
  readonly ComboBox_EditingSubcontractor_Select: Locator
  readonly Button_EditingSubcontractor_Save: Locator
  readonly Button_EditingSubcontractor_GotoContactBook: Locator
  readonly Button_EditingSubcontractor_CancelEditing: Locator
  readonly Label_JobAssignments_FieldTech: Element
  readonly Label_JobAssignments_FieldTech_Actual: Element
  readonly Button_EditFieldTech: Locator
  readonly Button_RemoveFieldTech: Locator
  readonly ComboBox_EditingFieldTech_Select: Locator
  readonly Button_EditingFieldTech_Save: Locator
  readonly Button_EditingFieldTech_GotoContactBook: Locator
  readonly Button_EditingFieldTech_CancelEditing: Locator
  readonly Label_Alert_OnlyOneSubOrTechCanBeAssigned: Element
  readonly Label_JobLocation_Title: Element
  readonly Label_JobLocation_AddressLine1: Element
  readonly Label_JobLocation_AddressLine1_Actual: Element
  readonly Label_JobLocation_AddressLine2: Element
  readonly Label_JobLocation_AddressLine2_Actual: Element
  readonly Label_JobLocation_AddressType: Element
  readonly Label_JobLocation_AddressType_Actual: Element
  readonly Label_JobLocation_City: Element
  readonly Label_JobLocation_City_Actual: Element
  readonly Label_JobLocation_County: Element
  readonly Label_JobLocation_County_Actual: Element
  readonly Label_JobLocation_State: Element
  readonly Label_JobLocation_State_Actual: Element
  readonly Label_JobLocation_ZipCode: Element
  readonly Label_JobLocation_ZipCode_Actual: Element
  readonly Label_JobLocation_Map: Element
  readonly Link_JobLocation_Map_Actual: Element
  readonly Label_ContactInformation_Title: Element
  readonly Label_ContactInformation_Name: Element
  readonly Label_ContactInformation_Name_Actual: Element
  readonly Label_ContactInformation_Phone: Element
  readonly Link_ContactInformation_Phone_Actual: Element
  readonly Label_ContactInformation_Email: Element
  readonly Link_ContactInformation_Email_Actual: Element
  readonly Label_WorkAuthorization_Title: Element
  readonly Label_Alert_NoWorkAuthorization: Element
  readonly Link_SendWorkAuthorization: Element
  readonly Label_WorkAuthorization_Status: Element
  readonly Label_WorkAuthorization_Status_Actual: Element
  readonly Label_WorkAuthorization_SentDate: Element
  readonly Label_WorkAuthorization_SentDate_Actual: Element
  readonly Label_WorkAuthorization_SentMethod: Element
  readonly Label_WorkAuthorization_SentMethod_Actual: Element
  readonly Label_WorkAuthorization_Recipient: Element
  readonly Label_WorkAuthorization_Recipient_Actual: Element
  readonly Label_WorkAuthorization_EffectiveDate: Element
  readonly Label_WorkAuthorization_EffectiveDate_Actual: Element
  readonly Label_WorkAuthorization_ApprovedBy: Element
  readonly Label_WorkAuthorization_ApprovedBy_Actual: Element
  readonly Label_WorkAuthorization_Signer: Element
  readonly Label_WorkAuthorization_Signer_Actual: Element
  readonly Button_WorkAuthorization_Remind: Element
  readonly Button_WorkAuthorization_Recall: Element
  readonly Label_WorkDetails_Title: Element
  readonly Label_WorkDetails_WorkType: Element
  readonly Label_WorkDetails_WorkType_Actual: Element
  readonly Label_WorkDetails_TarpArea: Element
  readonly Label_WorkDetails_TarpArea_Actual: Element
  readonly Label_WorkDetails_TimeOfService: Element
  readonly Label_WorkDetails_TimeOfService_Actual: Element
  readonly Label_WorkDetails_FastenerType: Element
  readonly Label_WorkDetails_FastenerType_Actual: Element
  readonly Label_WorkDetails_RoofPitch: Element
  readonly Label_WorkDetails_RoofPitch_Actual: Element
  readonly Label_WorkDetails_ServiceDate: Element
  readonly Label_WorkDetails_ServiceDate_Actual: Element
  readonly Label_WorkDetails_HighRoof: Element
  readonly Label_WorkDetails_HighRoof_Actual: Element
  readonly Label_WorkDetails_PhotoReport: Element
  readonly Button_WorkDetails_PhotoReport_Download: Element
  readonly Label_NoWorkDetails_Title: Element
  readonly Label_NoWorkDetails_Description: Element
  readonly Button_NoWorkDetails_RecordWorkDetails: Element

  readonly Label_JobTimeline_Title: Element
  readonly timelineEvents: Locator
  readonly Menu_ContactBook_ClaimsPortal: Locator
  readonly Menu_ContactBook_ProjectManager: Locator
  readonly ComboBox_SelectClaimNumber_Select: Locator
  readonly Button_SaveClaim: Locator
  readonly ComboBox_SelectPrimaryContact_Select: Locator
  readonly Button_SavePrimaryContact: Locator
  readonly Button_EditingPrimaryContact_GotoContactBook: Locator
  readonly Link_ViewFullTimeline: Element
  readonly Link_RecordJobEvent: Element
  readonly Button_MarkAsStarted: Element
  readonly Button_CloseJob: Element
  readonly Button_CustomerContactAttempted: Element
  readonly Button_UpdateWorkDetails: Element
  readonly Button_RecordWorkDetails: Element

  readonly MenuItem_RecordTarpingWork: Element

  constructor(global: ClaimsPortalGlobal, job: ClaimsPortalJob, jobPageURL: string) {
    super(global)
    this.job = job
    this.parentURL = jobPageURL
    this.URL = `${jobPageURL}/info`
    this.Label_JobDetails_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"]').nth(0),
      JobInfoTabStrings.Title_JobDetails
    )
    this.Label_JobDetails_JobNumber = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator('> dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_JobNumber, { exact: true }),
      JobInfoTabStrings.Label_JobNumber
    )
    this.Label_JobDetails_JobNumber_Actual = new Element(
      global.page,
      this.Label_JobDetails_JobNumber.locator.locator('..').locator('..').locator('> dd'),
      job.jobDetails.jobNumber
    )

    this.Label_JobDetails_AssociatedClaim = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator('> dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_AssociatedClaim, { exact: true }),
      JobInfoTabStrings.Label_AssociatedClaim
    )
    this.Link_JobDetails_AssociatedClaim_Actual = new Element(
      global.page,
      this.Label_JobDetails_AssociatedClaim.locator.locator('..').locator('..').locator('> dd > a'),
      job.jobDetails.associatedClaim
    )

    this.Label_JobDetails_Type = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator('> dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_Type, { exact: true }),
      JobInfoTabStrings.Label_Type
    )
    this.Label_JobDetails_Type_Actual = new Element(
      global.page,
      this.Label_JobDetails_Type.locator.locator('..').locator('..').locator('> dd'),
      job.jobDetails.type
    )

    this.Label_JobDetails_Services = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator('> dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_Services, { exact: true }),
      JobInfoTabStrings.Label_Services
    )
    this.Label_JobDetails_Services_Actual = new Element(
      global.page,
      this.Label_JobDetails_Services.locator.locator('..').locator('..').locator('> dd')
    )

    this.Label_JobDetails_Description = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator('> dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_Description, { exact: true }),
      JobInfoTabStrings.Label_Description
    )
    this.Label_JobDetails_Description_Actual = new Element(
      global.page,
      this.Label_JobDetails_Description.locator.locator('..').locator('..').locator('> dd'),
      job.jobDetails.description
    )

    this.Label_JobAssignments_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"]').nth(1),
      JobInfoTabStrings.Title_JobAssignments
    )

    this.Label_JobAssignments_Coordinator = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> div > dl > div')
        .getByText(JobInfoTabStrings.Label_Coordinator, { exact: true }),
      JobInfoTabStrings.Label_Coordinator
    )
    this.Label_JobAssignments_Coordinator_Actual = new Element(
      global.page,
      this.Label_JobAssignments_Coordinator.locator.locator('..').locator('..').locator('> dd'),
      job.jobAssignments.coordinator
    )
    this.Button_EditCoordinator = this.page.locator('button[aria-label="Edit Coordinator."]')
    this.Button_RemoveCoordinator = this.page.locator('button[aria-label="Remove Coordinator."]')
    this.ComboBox_EditingCoordinator_Select = this.page.locator(
      '#coordinatorContactInlineAssignJobPrimaryForm input[role="combobox"]'
    )
    this.Button_EditingCoordinator_Save = this.page.locator(
      'button[aria-label="Save Coordinator."]'
    )
    this.Button_EditingCoordinator_GotoContactBook = this.page.locator(
      '#coordinatorContactInlineAssignJobPrimaryForm button[aria-label="Go to contact book."]'
    )
    this.Button_EditingCoordinator_CancelEditing = this.page.locator(
      'button[aria-label="Cancel editing Coordinator."]'
    )

    this.Label_JobAssignments_ProjectManager = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> div > dl > div')
        .getByText(JobInfoTabStrings.Label_ProjectManager, { exact: true }),
      JobInfoTabStrings.Label_ProjectManager
    )
    this.Label_JobAssignments_ProjectManager_Actual = new Element(
      global.page,
      this.Label_JobAssignments_ProjectManager.locator.locator('..').locator('..').locator('> dd'),
      job.jobAssignments.projectManager
    )
    this.Button_EditProjectManager = this.page.locator('button[aria-label="Edit Project Manager."]')
    this.Button_RemoveProjectManager = this.page.locator(
      'button[aria-label="Remove Project Manager."]'
    )
    this.ComboBox_EditingProjectManager_Select = this.page.locator(
      '#projectManagerContactInlineAssignJobPrimaryForm input[role="combobox"]'
    )
    this.Button_EditingProjectManager_Save = this.page.locator(
      'button[aria-label="Save Project Manager."]'
    )
    this.Button_EditingProjectManager_GotoContactBook = this.page.locator(
      '#projectManagerContactInlineAssignJobPrimaryForm button[aria-label="Go to contact book."]'
    )
    this.Button_EditingProjectManager_CancelEditing = this.page.locator(
      'button[aria-label="Cancel editing Project Manager."]'
    )

    this.Label_JobAssignments_Approver = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> div > dl > div')
        .getByText(JobInfoTabStrings.Label_Approver, { exact: true }),
      JobInfoTabStrings.Label_Approver
    )
    this.Label_JobAssignments_Approver_Actual = new Element(
      global.page,
      this.Label_JobAssignments_Approver.locator.locator('..').locator('..').locator('> dd'),
      job.jobAssignments.approver
    )
    this.Button_EditApprover = this.page.locator('button[aria-label="Edit Approver."]')
    this.Button_RemoveApprover = this.page.locator('button[aria-label="Remove Approver}."]')
    this.ComboBox_EditingApprover_Select = this.page.locator(
      '#approverContactInlineAssignJobPrimaryForm input[role="combobox"]'
    )
    this.Button_EditingApprover_Save = this.page.locator('button[aria-label="Save Approver."]')
    this.Button_EditingApprover_GotoContactBook = this.page.locator(
      '#approverContactInlineAssignJobPrimaryForm button[aria-label="Go to contact book."]'
    )
    this.Button_EditingApprover_CancelEditing = this.page.locator(
      'button[aria-label="Cancel editing Approver."]'
    )

    this.Label_JobAssignments_Dispatcher = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> div > dl > div')
        .getByText(JobInfoTabStrings.Label_Dispatcher, { exact: true }),
      JobInfoTabStrings.Label_Dispatcher
    )
    this.Label_JobAssignments_Dispatcher_Actual = new Element(
      global.page,
      this.Label_JobAssignments_Dispatcher.locator.locator('..').locator('..').locator('> dd'),
      job.jobAssignments.dispatcher
    )
    this.Button_EditDispatcher = this.page.locator('button[aria-label="Edit Dispatcher."]')
    this.Button_RemoveDispatcher = this.page.locator('button[aria-label="Remove Dispatcher}."]')
    this.ComboBox_EditingDispatcher_Select = this.page.locator(
      '#dispatcherContactInlineAssignJobPrimaryForm input[role="combobox"]'
    )
    this.Button_EditingDispatcher_Save = this.page.locator('button[aria-label="Save Dispatcher."]')
    this.Button_EditingDispatcher_GotoContactBook = this.page.locator(
      '#dispatcherContactInlineAssignJobPrimaryForm button[aria-label="Go to contact book."]'
    )
    this.Menu_ContactBook_ClaimsPortal = this.page
      .locator('#dispatcherContactInlineAssignJobPrimaryForm a')
      .nth(0)
    this.Menu_ContactBook_ProjectManager = this.page
      .locator('#dispatcherContactInlineAssignJobPrimaryForm a')
      .nth(1)
    this.Button_EditingDispatcher_CancelEditing = this.page.locator(
      'button[aria-label="Cancel editing Dispatcher."]'
    )

    this.Label_JobAssignments_FieldTech = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> div > dl > div')
        .getByText(JobInfoTabStrings.Label_FieldTech, { exact: true }),
      JobInfoTabStrings.Label_FieldTech
    )
    this.Label_JobAssignments_FieldTech_Actual = new Element(
      global.page,
      this.Label_JobAssignments_FieldTech.locator.locator('..').locator('..').locator('> dd'),
      job.jobAssignments.fieldTech
    )
    this.Button_EditFieldTech = this.page.locator(
      'button[aria-label="Edit Field Tech."]'
    )
    this.Button_RemoveFieldTech = this.page.locator(
      'button[aria-label="Remove Field Tech."]'
    )
    this.ComboBox_EditingFieldTech_Select = this.page.locator(
      '#fieldTechContactInlineAssignJobPrimaryForm input[role="combobox"]'
    )
    this.Button_EditingFieldTech_Save = this.page.locator(
      'button[aria-label="Save Field Tech."]'
    )
    this.Button_EditingFieldTech_GotoContactBook = this.page.locator(
      '#fieldTechContactInlineAssignJobPrimaryForm button[aria-label="Go to contact book."]'
    )
    this.Button_EditingFieldTech_CancelEditing = this.page.locator(
      'button[aria-label="Cancel editing Field Tech."]'
    )

    this.Label_JobAssignments_Subcontractor = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> div > dl > div')
        .getByText(JobInfoTabStrings.Label_Subcontractor, { exact: true }),
      JobInfoTabStrings.Label_Subcontractor
    )
    this.Label_JobAssignments_Subcontractor_Actual = new Element(
      global.page,
      this.Label_JobAssignments_Subcontractor.locator.locator('..').locator('..').locator('> dd'),
      job.jobAssignments.subcontractor
    )
    this.Button_EditSubcontractor = this.page.locator('button[aria-label="Edit Subcontractor."]')
    this.Button_RemoveSubcontractor = this.page.locator(
      'button[aria-label="Remove Subcontractor."]'
    )
    this.ComboBox_EditingSubcontractor_Select = this.page.locator(
      '#subcontractorContactInlineAssignJobPrimaryForm input[role="combobox"]'
    )
    this.Button_EditingSubcontractor_Save = this.page.locator(
      'button[aria-label="Save Subcontractor."]'
    )
    this.Button_EditingSubcontractor_GotoContactBook = this.page.locator(
      '#subcontractorContactInlineAssignJobPrimaryForm button[aria-label="Go to contact book."]'
    )
    this.Button_EditingSubcontractor_CancelEditing = this.page.locator(
      'button[aria-label="Cancel editing Subcontractor."]'
    )

    this.Label_Alert_OnlyOneSubOrTechCanBeAssigned = new Element(
      global.page,
      this.page.locator('div[data-status="info"][role="alert"]'),

      JobInfoTabStrings.Label_Alert_OnlyOneSubOrTechCanBeAssigned
    )

    this.Label_JobLocation_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"]').nth(2),
      JobInfoTabStrings.Title_JobLocation
    )

    this.Label_JobLocation_AddressLine1 = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_AddressLine1, { exact: true }),
      JobInfoTabStrings.Label_AddressLine1
    )
    this.Label_JobLocation_AddressLine1_Actual = new Element(
      global.page,
      this.Label_JobLocation_AddressLine1.locator.locator('..').locator('..').locator('> dd'),
      job.jobLocation.addressLine1
    )

    this.Label_JobLocation_AddressLine2 = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_AddressLine2, { exact: true }),
      JobInfoTabStrings.Label_AddressLine2
    )
    this.Label_JobLocation_AddressLine2_Actual = new Element(
      global.page,
      this.Label_JobLocation_AddressLine2.locator.locator('..').locator('..').locator('> dd'),
      job.jobLocation.addressLine2
    )

    this.Label_JobLocation_AddressType = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_AddressType, { exact: true }),
      JobInfoTabStrings.Label_AddressType
    )
    this.Label_JobLocation_AddressType_Actual = new Element(
      global.page,
      this.Label_JobLocation_AddressType.locator.locator('..').locator('..').locator('> dd'),
      job.jobLocation.addressType
    )

    this.Label_JobLocation_City = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_City, { exact: true }),
      JobInfoTabStrings.Label_City
    )
    this.Label_JobLocation_City_Actual = new Element(
      global.page,
      this.Label_JobLocation_City.locator.locator('..').locator('..').locator('> dd'),
      job.jobLocation.city
    )

    this.Label_JobLocation_County = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_County, { exact: true }),
      JobInfoTabStrings.Label_County
    )
    this.Label_JobLocation_County_Actual = new Element(
      global.page,
      this.Label_JobLocation_County.locator.locator('..').locator('..').locator('> dd'),
      job.jobLocation.county
    )

    this.Label_JobLocation_State = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_State, { exact: true }),
      JobInfoTabStrings.Label_State
    )
    this.Label_JobLocation_State_Actual = new Element(
      global.page,
      this.Label_JobLocation_State.locator.locator('..').locator('..').locator('> dd'),
      job.jobLocation.state
    )

    this.Label_JobLocation_ZipCode = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_ZIPCode, { exact: true }),
      JobInfoTabStrings.Label_ZIPCode
    )
    this.Label_JobLocation_ZipCode_Actual = new Element(
      global.page,
      this.Label_JobLocation_ZipCode.locator.locator('..').locator('..').locator('> dd'),
      job.jobLocation.zipCode
    )

    this.Label_JobLocation_Map = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_Map, { exact: true }),
      JobInfoTabStrings.Label_Map
    )

    this.Link_JobLocation_Map_Actual = new Element(
      global.page,
      this.Label_JobLocation_Map.locator.locator('..').locator('..').locator('> dd > a'),
      job.jobLocation.map
    )

    this.Label_ContactInformation_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"]').nth(3),
      JobInfoTabStrings.Title_ContactInformation
    )

    this.Label_ContactInformation_Name = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(3)
        .locator('> dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_Name, { exact: true }),
      JobInfoTabStrings.Label_Name
    )
    this.Label_ContactInformation_Name_Actual = new Element(
      global.page,
      this.Label_ContactInformation_Name.locator.locator('..').locator('..').locator('> dd'),
      job.contact.name
    )

    this.Label_ContactInformation_Phone = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(3)
        .locator('> dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_Phone, { exact: true }),
      JobInfoTabStrings.Label_Phone
    )
    this.Link_ContactInformation_Phone_Actual = new Element(
      global.page,
      this.Label_ContactInformation_Phone.locator.locator('..').locator('..').locator('> dd'),
      job.contact.phone
    )

    this.Label_ContactInformation_Email = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(3)
        .locator('> dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_Email, { exact: true }),
      JobInfoTabStrings.Label_Email
    )
    this.Link_ContactInformation_Email_Actual = new Element(
      global.page,
      this.Label_ContactInformation_Email.locator.locator('..').locator('..').locator('> dd'),
      job.contact.email
    )

    this.Label_Alert_NoWorkAuthorization = new Element(
      global.page,
      this.page
        .locator('div[id$="_title"]')
        .nth(4)
        .locator('div[data-status="warning"][role="alert"]'),
      JobInfoTabStrings.Label_Alert_NoWorkAuthorization
    )
    this.Label_WorkAuthorization_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"]').nth(4).locator('h2'),
      JobInfoTabStrings.Title_WorkAuthorization
    )

    this.Link_SendWorkAuthorization = new Element(
      global.page,
      this.page.getByRole('link', { name: JobInfoTabStrings.Link_SendWorkAuthorization }),
      JobInfoTabStrings.Link_SendWorkAuthorization
    )

    this.Label_WorkAuthorization_Status = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(4)
        .locator(' dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_Status, { exact: true }),
      JobInfoTabStrings.Label_Status
    )
    this.Label_WorkAuthorization_Status_Actual = new Element(
      global.page,
      this.Label_WorkAuthorization_Status.locator.locator('..').locator('..').locator('> dd'),
      job.workAuthorization.status
    )

    this.Label_WorkAuthorization_SentDate = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(4)
        .locator(' dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_SentDate, { exact: true }),
      JobInfoTabStrings.Label_SentDate
    )
    this.Label_WorkAuthorization_SentDate_Actual = new Element(
      global.page,
      this.Label_WorkAuthorization_SentDate.locator.locator('..').locator('..').locator('> dd'),
      job.workAuthorization.sentDate
    )

    this.Label_WorkAuthorization_SentMethod = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(4)
        .locator(' dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_SentMethod, { exact: true }),
      JobInfoTabStrings.Label_SentMethod
    )
    this.Label_WorkAuthorization_SentMethod_Actual = new Element(
      global.page,
      this.Label_WorkAuthorization_SentMethod.locator.locator('..').locator('..').locator('> dd'),
      job.workAuthorization.sentMethod
    )

    this.Label_WorkAuthorization_Recipient = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(4)
        .locator(' dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_Recipient, { exact: true }),
      JobInfoTabStrings.Label_Recipient
    )
    this.Label_WorkAuthorization_Recipient_Actual = new Element(
      global.page,
      this.Label_WorkAuthorization_Recipient.locator.locator('..').locator('..').locator('> dd'),
      job.workAuthorization.recipient
    )

    this.Label_WorkAuthorization_EffectiveDate = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(4)
        .locator(' dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_EffectiveDate, { exact: true }),
      JobInfoTabStrings.Label_EffectiveDate
    )
    this.Label_WorkAuthorization_EffectiveDate_Actual = new Element(
      global.page,
      this.Label_WorkAuthorization_EffectiveDate.locator
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.workAuthorization.effectiveDate
    )

    this.Label_WorkAuthorization_Signer = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(4)
        .locator(' dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_Signer, { exact: true }),
      JobInfoTabStrings.Label_Signer
    )
    this.Label_WorkAuthorization_Signer_Actual = new Element(
      global.page,
      this.Label_WorkAuthorization_Signer.locator.locator('..').locator('..').locator('> dd'),
      job.workAuthorization.signer
    )

    this.Label_WorkAuthorization_ApprovedBy = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(4)
        .locator(' dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_ApprovedBy, { exact: true }),
      JobInfoTabStrings.Label_ApprovedBy
    )
    this.Label_WorkAuthorization_ApprovedBy_Actual = new Element(
      global.page,
      this.Label_WorkAuthorization_ApprovedBy.locator.locator('..').locator('..').locator('> dd'),
      job.workAuthorization.approvedBy
    )

    this.Button_WorkAuthorization_Remind = new Element(
      global.page,
      this.page.getByRole('button', { name: JobInfoTabStrings.Button_Remind })
    )

    this.Button_WorkAuthorization_Recall = new Element(
      global.page,
      this.page.getByRole('button', { name: JobInfoTabStrings.Button_Remind })
    )

    this.Label_WorkDetails_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"]').nth(5).locator('h2'),
      JobInfoTabStrings.Title_WorkDetails
    )

    this.Label_WorkDetails_WorkType = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator(' dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_WorkType, { exact: true }),
      JobInfoTabStrings.Label_WorkType
    )
    this.Label_WorkDetails_WorkType_Actual = new Element(
      global.page,
      this.Label_WorkDetails_WorkType.locator.locator('..').locator('..').locator('> dd'),
      job.workDetails.workType
    )

    this.Label_WorkDetails_TarpArea = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator(' dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_TarpArea, { exact: true }),
      JobInfoTabStrings.Label_TarpArea
    )
    this.Label_WorkDetails_TarpArea_Actual = new Element(
      global.page,
      this.Label_WorkDetails_TarpArea.locator.locator('..').locator('..').locator('> dd'),
      job.workDetails.tarpArea
    )

    this.Label_WorkDetails_TimeOfService = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator(' dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_TimeOfService, { exact: true }),
      JobInfoTabStrings.Label_TimeOfService
    )
    this.Label_WorkDetails_TimeOfService_Actual = new Element(
      global.page,
      this.Label_WorkDetails_TimeOfService.locator.locator('..').locator('..').locator('> dd'),
      job.workDetails.timeOfService
    )

    this.Label_WorkDetails_FastenerType = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator(' dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_FastenerType, { exact: true }),
      JobInfoTabStrings.Label_FastenerType
    )
    this.Label_WorkDetails_FastenerType_Actual = new Element(
      global.page,
      this.Label_WorkDetails_FastenerType.locator.locator('..').locator('..').locator('> dd'),
      job.workDetails.fastenerType
    )

    this.Label_WorkDetails_RoofPitch = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator(' dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_RoofPitch, { exact: true }),
      JobInfoTabStrings.Label_RoofPitch
    )
    this.Label_WorkDetails_RoofPitch_Actual = new Element(
      global.page,
      this.Label_WorkDetails_RoofPitch.locator.locator('..').locator('..').locator('> dd'),
      job.workDetails.roofPitch
    )

    this.Label_WorkDetails_ServiceDate = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator(' dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_ServiceDate, { exact: true }),
      JobInfoTabStrings.Label_ServiceDate
    )
    this.Label_WorkDetails_ServiceDate_Actual = new Element(
      global.page,
      this.Label_WorkDetails_ServiceDate.locator.locator('..').locator('..').locator('> dd'),
      job.workDetails.serviceDate
    )

    this.Label_WorkDetails_HighRoof = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator(' dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_HighRoof, { exact: true }),
      JobInfoTabStrings.Label_HighRoof
    )

    this.Label_WorkDetails_HighRoof_Actual = new Element(
      global.page,
      this.Label_WorkDetails_HighRoof.locator
        .locator('..')
        .locator('..')
        .locator('> dd')
        .locator('> svg')
        .locator('> path')
        .nth(1),
      job.workDetails.highRoof ? 'true' : 'false'
    )

    this.Label_WorkDetails_PhotoReport = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator(' dl')
        .nth(0)
        .getByText(JobInfoTabStrings.Label_PhotoReport, {
          exact: true,
        }),
      JobInfoTabStrings.Label_PhotoReport
    )

    this.Button_WorkDetails_PhotoReport_Download = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(5)
        .locator(' dl')
        .nth(0)
        .getByRole('button', { name: JobInfoTabStrings.Button_Download }),
      JobInfoTabStrings.Button_Download
    )

    this.Label_NoWorkDetails_Title = new Element(
      global.page,
      this.page.locator('div[id$="_content"]').nth(5).locator('h3'),
      JobInfoTabStrings.Label_NoWorkDetails_Title
    )
    this.Label_NoWorkDetails_Description = new Element(
      global.page,
      this.page.locator('div[id$="_content"]').nth(5).locator('p'),
      JobInfoTabStrings.Label_NoWorkDetails_Description
    )
    this.Button_NoWorkDetails_RecordWorkDetails = new Element(
      global.page,
      this.page.locator('div[id$="_content"]').nth(5).locator('button').first(),
      JobInfoTabStrings.Button_RecordWorkDetails
    )

    this.Label_JobTimeline_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"]').nth(6).locator('h2'),
      JobInfoTabStrings.Title_JobTimeline
    )

    this.timelineEvents = this.page
      .locator('div[id$="_content"]')
      .nth(6)
      .locator('> div > div > div.chakra-stack')

    this.ComboBox_SelectClaimNumber_Select = this.page.locator(
      '#assignClaimForm input[role="combobox"]'
    )
    this.Button_SaveClaim = this.page.locator('#assignClaimForm button[aria-label="Save claim"]')

    this.ComboBox_SelectPrimaryContact_Select = this.page.locator(
      '#primaryContactContactForm input[role="combobox"]'
    )
    this.Button_SavePrimaryContact = this.page.locator(
      '#primaryContactContactForm button[aria-label="Save primary contact"]'
    )
    this.Button_EditingPrimaryContact_GotoContactBook = this.page.locator(
      '#primaryContactContactForm button[aria-label="Go to contact book."]'
    )

    this.Link_ViewFullTimeline = new Element(
      global.page,
      this.page.locator('div.chakra-card__header').nth(6).locator('a').nth(0)
    )
    this.Link_RecordJobEvent = new Element(
      global.page,
      this.page.locator('div.chakra-card__header').nth(6).locator('a').nth(1)
    )

    this.Button_MarkAsStarted = new Element(
      global.page,
      this.page.getByRole('button', { name: JobInfoTabStrings.Button_MarkAsStarted })
    )

    this.Button_CloseJob = new Element(
      global.page,
      this.page.getByRole('button', { name: JobInfoTabStrings.Button_CloseJob })
    )

    this.Button_CustomerContactAttempted = new Element(
      global.page,
      this.page.getByRole('button', { name: JobInfoTabStrings.Button_CustomerContactAttempted })
    )

    this.Button_UpdateWorkDetails = new Element(
      global.page,
      this.page.getByRole('button', { name: JobInfoTabStrings.Button_UpdateWorkDetails })
    )

    this.Button_RecordWorkDetails = new Element(
      global.page,
      this.page.getByRole('button', { name: JobInfoTabStrings.Button_RecordWorkDetails }).first()
    )

    this.MenuItem_RecordTarpingWork = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: JobInfoTabStrings.MenuItem_RecordTarpingWork })
    )
  }

  async VerifyJobDetailsSection(smoke = false) {
    await this.Label_JobDetails_Title.VerifyExpectedText()
    await this.Label_JobDetails_JobNumber.VerifyExpectedTextAlt()
    await this.Label_JobDetails_AssociatedClaim.VerifyExpectedTextAlt()
    await this.Label_JobDetails_Type.VerifyExpectedTextAlt()
    await this.Label_JobDetails_Services.VerifyExpectedTextAlt()
    await this.Label_JobDetails_Description.VerifyExpectedTextAlt()
    if (smoke) {
      await this.Label_JobDetails_JobNumber_Actual.VerifyExpectedTextAlt()
      const jobTypeOptions: string[] = ['Emergency Services', 'Build Back', 'OTR']
      const actualJobType = (await this.Label_JobDetails_Type_Actual.GetText()) ?? ''
      const matchesJobType = jobTypeOptions.some((type) => actualJobType.includes(type))
      expect(matchesJobType).toBe(true)

      const jobServicesOptions: string[] = ['Tarping', 'Water Mitigation', 'Board Up']
      const actualJobServices = (await this.Label_JobDetails_Services_Actual.GetText()) ?? ''
      const matchesJobServices = jobServicesOptions.some((service) =>
        actualJobServices.includes(service)
      )
      expect(matchesJobServices).toBe(true)
    }
    if (!smoke) {
      await this.Label_JobDetails_JobNumber_Actual.VerifyExpectedTextAlt()
      await this.Link_JobDetails_AssociatedClaim_Actual.VerifyExpectedTextAlt()
      await this.Label_JobDetails_Type_Actual.VerifyExpectedTextAlt()
      await this.Label_JobDetails_Services_Actual.VerifyTextContainsEach(
        this.job.jobDetails.services
      )
      await this.Label_JobDetails_Description_Actual.VerifyExpectedTextAlt()
    }
  }

  async VerifyJobAssignmentsSection(smoke = false) {
    await this.Label_JobAssignments_Title.VerifyExpectedText()

    await this.Label_JobAssignments_Coordinator.VerifyExpectedTextAlt()
    await this.Label_JobAssignments_ProjectManager.VerifyExpectedTextAlt()
    await this.Label_JobAssignments_Approver.VerifyExpectedTextAlt()
    await this.Label_JobAssignments_Dispatcher.VerifyExpectedTextAlt()
    await this.Label_JobAssignments_FieldTech.VerifyExpectedTextAlt()
    await this.Label_JobAssignments_Subcontractor.VerifyExpectedTextAlt()

    if (!smoke) {
      await this.Label_JobAssignments_Coordinator_Actual.VerifyExpectedTextAlt()
      await this.Label_JobAssignments_ProjectManager_Actual.VerifyExpectedTextAlt()
      await this.Label_JobAssignments_Approver_Actual.VerifyExpectedTextAlt()
      await this.Label_JobAssignments_Dispatcher_Actual.VerifyExpectedTextAlt()
      if (this.job.jobAssignments.fieldTech != '') {
        await this.Label_JobAssignments_FieldTech_Actual.VerifyExpectedTextAlt()
      }
      if (this.job.jobAssignments.subcontractor != '') {
        await this.Label_JobAssignments_Subcontractor_Actual.VerifyExpectedTextAlt()
      }
    }
  }

  // async VerifyFieldTech(expectedText: string) {
  //   const technicianLocator = this.page
  //     .locator('div[id$="_content"]')
  //     .nth(1)
  //     .locator('dt > span')
  //     .getByText(JobInfoTabStrings.Label_FieldTech, { exact: true })
  //     .locator('..')
  //     .locator('..')
  //     .locator('> dd')
  //   expect(await technicianLocator.textContent()).toBe(expectedText)
  // }

  // async FetchFieldTechLocators() {
  //   const technicianLocator = this.page
  //     .locator('div[id$="_content"]')
  //     .nth(1)
  //     .locator('dt > span')
  //     .getByText(JobInfoTabStrings.Label_FieldTech, { exact: true })
  //     .locator('..')
  //     .locator('..')
  //     .locator('> dd')

  //   const editLocator = technicianLocator.locator('button[aria-label="Edit Field Tech."]')
  //   const removeLocator = technicianLocator.locator('button[aria-label="Remove Field Tech."]')
  //   const selectLocator = technicianLocator.locator(
  //     `#fieldTechContactInlineAssignJobPrimaryForm input[role="combobox"]`
  //   )
  //   const saveLocator = technicianLocator.locator('button[aria-label="Save Field Tech."]')
  //   const gotoContactBookLocator = technicianLocator.locator(
  //     `#fieldTechContactInlineAssignJobPrimaryForm button[aria-label="Go to contact book."]`
  //   )
  //   const cancelEditingLocator = technicianLocator.locator(
  //     'button[aria-label="Cancel editing Field Tech."]'
  //   )
  //   return {
  //     technicianLocator,
  //     editLocator,
  //     removeLocator,
  //     selectLocator,
  //     saveLocator,
  //     gotoContactBookLocator,
  //     cancelEditingLocator,
  //   }
  // }

  // async VerifySubcontractor(expectedText: string) {
  //   const subcontractorLocator = this.page
  //     .locator('div[id$="_content"]')
  //     .nth(1)
  //     .locator('dt > span')
  //     .getByText(JobInfoTabStrings.Label_Subcontractor, { exact: true })
  //     .locator('..')
  //     .locator('..')
  //     .locator('> dd')
  //   expect(await subcontractorLocator.textContent()).toBe(expectedText)
  // }

  // async FetchSubcontractorLocators() {
  //   const subcontractorLocator = this.page
  //     .locator('div[id$="_content"]')
  //     .nth(1)
  //     .locator('dt > span')
  //     .getByText(JobInfoTabStrings.Label_Subcontractor, { exact: true })
  //     .locator('..')
  //     .locator('..')
  //     .locator('> dd')
  //   const editLocator = subcontractorLocator.locator('button[aria-label="Edit Subcontractor."]')
  //   const removeLocator = subcontractorLocator.locator('button[aria-label="Remove Subcontractor."]')
  //   const selectLocator = subcontractorLocator.locator(
  //     `#subcontractorContactInlineAssignJobPrimaryForm input[role="combobox"]`
  //   )
  //   const saveLocator = subcontractorLocator.locator('button[aria-label="Save Subcontractor."]')
  //   const gotoContactBookLocator = subcontractorLocator.locator(
  //     `#subcontractorContactInlineAssignJobPrimaryForm button[aria-label="Go to contact book."]`
  //   )
  //   const cancelEditingLocator = subcontractorLocator.locator(
  //     'button[aria-label="Cancel editing Subcontractor."]'
  //   )
  //   return {
  //     subcontractorLocator,
  //     editLocator,
  //     removeLocator,
  //     selectLocator,
  //     saveLocator,
  //     gotoContactBookLocator,
  //     cancelEditingLocator,
  //   }
  // }

  async VerifyJobLocationSection(smoke = false) {
    if ((await this.Label_JobLocation_Title.locator.count()) > 0) {
      this.Label_JobLocation_Title.VerifyExpectedText()
    }
    await this.Label_JobLocation_AddressLine1.VerifyExpectedTextAlt()
    if ((await this.Label_JobLocation_AddressLine2.locator.count()) > 0) {
      this.Label_JobLocation_AddressLine2.VerifyExpectedTextAlt()
    }
    if ((await this.Label_JobLocation_AddressType.locator.count()) > 0) {
      this.Label_JobLocation_AddressType.VerifyExpectedTextAlt()
    }
    await this.Label_JobLocation_City.VerifyExpectedTextAlt()
    await this.Label_JobLocation_County.VerifyExpectedTextAlt()
    await this.Label_JobLocation_State.VerifyExpectedTextAlt()
    await this.Label_JobLocation_ZipCode.VerifyExpectedTextAlt()
    await this.Label_JobLocation_Map.VerifyExpectedTextAlt()
    if (!smoke) {
      await this.Label_JobLocation_AddressLine1_Actual.VerifyExpectedTextAlt()
      if ((await this.Label_JobLocation_AddressLine2.locator.count()) > 0) {
        this.Label_JobLocation_AddressLine2_Actual.VerifyExpectedTextAlt()
      }
      if ((await this.Label_JobLocation_AddressType.locator.count()) > 0) {
        this.Label_JobLocation_AddressType_Actual.VerifyExpectedTextAlt()
      }
      await this.Label_JobLocation_City_Actual.VerifyExpectedTextAlt()
      await this.Label_JobLocation_County_Actual.VerifyExpectedTextAlt()
      await this.Label_JobLocation_State_Actual.VerifyExpectedTextAlt()
      await this.Label_JobLocation_ZipCode_Actual.VerifyExpectedTextAlt()
      await this.Link_JobLocation_Map_Actual.VerifyExpectedTextAlt()
    }
  }

  async VerifyContactInformationSection(smoke = false) {
    await this.Label_ContactInformation_Title.VerifyExpectedText()
    if (await this.ComboBox_SelectClaimNumber_Select.isVisible()) {
      // Verify UI present when no primary contact is set
      expect(await this.ComboBox_SelectClaimNumber_Select.isVisible()).toBe(true)
      expect(await this.Button_SaveClaim.isVisible()).toBe(true)
      expect(await this.Button_EditingPrimaryContact_GotoContactBook.isVisible()).toBe(true)
    } else {
      await this.Label_ContactInformation_Name.VerifyExpectedTextAlt()
      await this.Label_ContactInformation_Phone.VerifyExpectedTextAlt()
      await this.Label_ContactInformation_Email.VerifyExpectedTextAlt()
      if (!smoke) {
        await this.Label_ContactInformation_Name_Actual.VerifyExpectedTextAlt()
        await this.Link_ContactInformation_Phone_Actual.VerifyExpectedTextAlt()
        await this.Link_ContactInformation_Email_Actual.VerifyExpectedTextAlt()
      }
    }
  }

  async VerifyWorkAuthorizationSection(smoke = false) {
    await this.Label_WorkAuthorization_Title.VerifyExpectedText()
    if (smoke) {
      if (await this.Label_Alert_NoWorkAuthorization.locator.isVisible()) {
        await this.Label_Alert_NoWorkAuthorization.VerifyExpectedTextAlt()
        await this.Link_SendWorkAuthorization.VerifyExpectedTextAlt()
      } else {
        await this.Label_WorkAuthorization_Status.VerifyExpectedTextAlt()
        await this.Label_WorkAuthorization_SentDate.VerifyExpectedTextAlt()
        await this.Label_WorkAuthorization_SentMethod.VerifyExpectedTextAlt()
        if (await this.Label_WorkAuthorization_Recipient.locator.isVisible()) {
          await this.Label_WorkAuthorization_Recipient.VerifyExpectedTextAlt()
        }
        if (await this.Label_WorkAuthorization_EffectiveDate.locator.isVisible()) {
          await this.Label_WorkAuthorization_EffectiveDate.VerifyExpectedTextAlt()
        }
        if (await this.Label_WorkAuthorization_ApprovedBy.locator.isVisible()) {
          await this.Label_WorkAuthorization_ApprovedBy.VerifyExpectedTextAlt()
        }
        if (await this.Label_WorkAuthorization_Signer.locator.isVisible()) {
          await this.Label_WorkAuthorization_Signer.VerifyExpectedTextAlt()
        }
      }
    }
    if (!smoke) {
      if (this.job.workAuthorization.status == '') {
        await expect(this.Label_Alert_NoWorkAuthorization.locator).toBeVisible({ visible: true })
        await this.Label_Alert_NoWorkAuthorization.VerifyExpectedTextAlt()
        await expect(this.Link_SendWorkAuthorization.locator).toBeAttached({ attached: true })
        await this.Link_SendWorkAuthorization.VerifyExpectedTextAlt()
      } else {
        await this.Label_WorkAuthorization_Status_Actual.VerifyExpectedTextAlt()
        await this.Label_WorkAuthorization_SentDate_Actual.VerifyExpectedTextAlt()
        await this.Label_WorkAuthorization_SentMethod_Actual.VerifyExpectedTextAlt()
        await this.Label_WorkAuthorization_Recipient_Actual.VerifyExpectedTextAlt()
        await this.Label_WorkAuthorization_ApprovedBy_Actual.VerifyExpectedTextAlt()
        if (this.job.workAuthorization.status == 'Completed') {
          await this.Label_WorkAuthorization_EffectiveDate_Actual.VerifyExpectedTextAlt()
          await this.Label_WorkAuthorization_Signer_Actual.VerifyExpectedTextAlt()
        }
        if (this.job.workAuthorization.status == 'Sent') {
          await expect(this.Button_WorkAuthorization_Remind.locator).toBeAttached({
            attached: true,
          })
          await expect(this.Button_WorkAuthorization_Recall.locator).toBeAttached({
            attached: true,
          })
        }
      }
    }
  }

  async VerifyWorkDetailsSection(smoke = false) {
    await this.Label_WorkDetails_Title.VerifyExpectedText()
    if (smoke) {
      if (await this.Label_NoWorkDetails_Title.IsVisible()) {
        await this.Label_NoWorkDetails_Title.VerifyExpectedTextAlt()
        await this.Label_NoWorkDetails_Description.VerifyExpectedTextAlt()
        await this.Button_NoWorkDetails_RecordWorkDetails.VerifyExpectedTextAlt()
      } else {
        await this.Label_WorkDetails_WorkType.VerifyExpectedTextAlt()
        await this.Label_WorkDetails_TarpArea.VerifyExpectedTextAlt()
        await this.Label_WorkDetails_TimeOfService.VerifyExpectedTextAlt()
        await this.Label_WorkDetails_FastenerType.VerifyExpectedTextAlt()
        await this.Label_WorkDetails_RoofPitch.VerifyExpectedTextAlt()
        await this.Label_WorkDetails_ServiceDate.VerifyExpectedTextAlt()
        await this.Label_WorkDetails_HighRoof.VerifyExpectedTextAlt()
        await this.Label_WorkDetails_PhotoReport.VerifyExpectedTextAlt()
      }
    }
    if (!smoke) {
      if (this.job.workDetails.workType === '') {
        // if no details have been recorded yet, we see different UI
        await expect(this.Label_NoWorkDetails_Title.locator).toBeAttached({
          attached: true,
        })
        await this.Label_NoWorkDetails_Title.VerifyExpectedTextAlt()
        await this.Label_NoWorkDetails_Description.VerifyExpectedTextAlt()
        await expect(this.Button_NoWorkDetails_RecordWorkDetails.locator).toBeAttached({
          attached: true,
        })
      } else {
        await this.Label_WorkDetails_WorkType_Actual.VerifyExpectedTextAlt()
        await this.Label_WorkDetails_TarpArea_Actual.VerifyExpectedTextAlt()
        await this.Label_WorkDetails_TimeOfService_Actual.VerifyExpectedTextAlt()
        await this.Label_WorkDetails_FastenerType_Actual.VerifyExpectedTextAlt()
        await this.Label_WorkDetails_RoofPitch_Actual.VerifyExpectedTextAlt()
        await this.Label_WorkDetails_ServiceDate_Actual.VerifyExpectedTextAlt()
        const icon = await this.Label_WorkDetails_HighRoof_Actual.locator.getAttribute('d')
        if (this.Label_WorkDetails_HighRoof_Actual.expectedText == 'true') {
          expect(icon?.startsWith('M9')).toBe(true) // check mark
        } else {
          expect(icon?.startsWith('M19')).toBe(true) // X
        }
        expect(this.Button_WorkDetails_PhotoReport_Download.IsVisible())
      }
    }
  }

  async VerifyJobTimelineSection() {
    await this.Label_JobTimeline_Title.VerifyExpectedText()
    expect(await this.Link_ViewFullTimeline.IsVisible()).toBe(true)
    expect(await this.Link_RecordJobEvent.IsVisible()).toBe(true)
  }

  async TimelineEventCount() {
    const count = await this.timelineEvents.count()
    return count
  }

  async OpenFullTimeline() {
    await this.Link_ViewFullTimeline.Click()
    await this.page.waitForTimeout(1000)
    const timelineTab = new ClaimsPortalJobTimelineTab(this.global, this.job, this.parentURL)
    return timelineTab
  }

  async OpenRecordJobEvent() {
    await this.Link_RecordJobEvent.Click()
    const timelineNewEventTab = new ClaimsPortalJobTimelineNewEventTab(this.global, this.job, this.parentURL)
    return timelineNewEventTab
  }

  async OpenMapLinkInNewTabVerifyTitleAndClose(streetAddress: string) {
    const pagePromise = this.context.waitForEvent('page')
    await this.Link_JobLocation_Map_Actual.Click()
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
    const assignment = await this.Label_JobAssignments_Coordinator_Actual.GetText()
    return !(assignment == 'Unassigned')
  }

  async IsProjectManagerAssigned() {
    const assignment = await this.Label_JobAssignments_ProjectManager_Actual.GetText()
    return !(assignment == 'Unassigned')
  }

  async IsApproverAssigned() {
    const assignment = await this.Label_JobAssignments_Approver_Actual.GetText()
    return !(assignment == 'Unassigned')
  }

  async IsDispatcherAssigned() {
    const assignment = await this.Label_JobAssignments_Dispatcher_Actual.GetText()
    return !(assignment == 'Unassigned')
  }

  async IsFieldTechAssigned() {
    const assignment = await this.Label_JobAssignments_FieldTech_Actual.GetText()
    return !(assignment == 'Unassigned')
  }

  async IsSubcontractorAssigned() {
    const assignment = await this.Label_JobAssignments_Subcontractor_Actual.GetText()
    return !(assignment == 'Unassigned')
  }

  async ValidateCoordinator() {
    // Validate the Coordinator selection input value is in an invalid state and that the error is..
    const selectionLocator = this.page.locator(
      `#coordinatorContactInlineAssignJobPrimaryForm div[data-invalid=""] > div:nth-child(2)`
    )
    const coordinatorIsValidated =
      (await selectionLocator.textContent()) == ValidationStrings.Required
    return coordinatorIsValidated
  }

  async ValidateProjectManager() {
    // Validate the Project Manager selection input value is in an invalid state and that the error is..
    const selectionLocator = this.page.locator(
      `#projectManagerContactInlineAssignJobPrimaryForm div[data-invalid=""] > div:nth-child(2)`
    )
    const projectManagerIsValidated =
      (await selectionLocator.textContent()) == ValidationStrings.Required
    return projectManagerIsValidated
  }

  async ValidateApprover() {
    // Validate the Approver selection input value is in an invalid state and that the error is..
    const selectionLocator = this.page.locator(
      `#approverContactInlineAssignJobPrimaryForm div[data-invalid=""] > div:nth-child(2)`
    )
    const approverIsValidated = (await selectionLocator.textContent()) == ValidationStrings.Required
    return approverIsValidated
  }

  async ValidateDispatcher() {
    // Validate the Dispatcher selection input value is in an invalid state and that the error is..
    const selectionLocator = this.page.locator(
      `#dispatcherContactInlineAssignJobPrimaryForm div[data-invalid=""] > div:nth-child(2)`
    )
    const dispatcherIsValidated =
      (await selectionLocator.textContent()) == ValidationStrings.Required
    return dispatcherIsValidated
  }

  async ValidateFieldTech() {
    // Validate the Field Tech selection input value is in an invalid state and that the error is..
    const selectionLocator = this.page.locator(
      `#fieldTechContactInlineAssignJobPrimaryForm div[data-invalid=""] > div:nth-child(2)`
    )
    const technicianIsValidated =
      (await selectionLocator.textContent()) == ValidationStrings.Required
    return technicianIsValidated
  }

  async ValidateSubcontractor() {
    // Validate the Sucontractor selection input value is in an invalid state and that the error is..
    const selectionLocator = this.page.locator(
      `#subcontractorContactInlineAssignJobPrimaryForm div[data-invalid=""] > div:nth-child(2)`
    )
    const subcontractorIsValidated =
      (await selectionLocator.textContent()) == ValidationStrings.Required
    return subcontractorIsValidated
  }

  async Dispatcher_GotoContactBook_ClaimsPortal() {
    await this.Button_EditingDispatcher_GotoContactBook.click()
    await this.page.waitForTimeout(500)
    await this.Menu_ContactBook_ClaimsPortal.click()
    await this.page.waitForTimeout(2000)
  }

  async Dispatcher_GotoContactBook_ProjectManager() {
    await this.Button_EditingDispatcher_GotoContactBook.click()
    await this.page.waitForTimeout(500)
    await this.Menu_ContactBook_ProjectManager.click()
    await this.page.waitForTimeout(2000)
  }

  async OpenMarkAsStarted() {
    await this.Button_MarkAsStarted.Click()
    const markAsStartedDrawer = new ClaimsPortalMarkJobStartedDrawer(this.global)
    return markAsStartedDrawer
  }

  async OpenCloseJob() {
    await this.Button_CloseJob.Click()
    const closeJobDrawer = new ClaimsPortalCloseJobDrawer(this.global)
    return closeJobDrawer
  }

  async OpenCustomerContactAttempted() {
    await this.Button_CustomerContactAttempted.Click()
    const recordCustomerContactAttemptDrawer = new ClaimsPortalRecordCustomerContactAttemptDrawer(
      this.global
    )
    return recordCustomerContactAttemptDrawer
  }

  async OpenRecordTarpingWork() {
    await this.Button_UpdateWorkDetails.Click()
    await this.MenuItem_RecordTarpingWork.Click()
    const enterWorkDetailsForJobDrawer = new ClaimsPortalEnterWorkDetailsForJobDrawer(this.global)
    return enterWorkDetailsForJobDrawer
  }
}
