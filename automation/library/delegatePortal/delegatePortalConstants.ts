import { delegatePortal } from '../../environments/env.ceylon.js'
import { CeylonEnvironmentType, DataColumnType } from '../shared/constants.js'
export const DefaultEnvironment = delegatePortal.ENVIRONMENT ?? CeylonEnvironmentType.Company_Test
export const MaxUploadFiles = 100

export const NicelyFormedDelegateAuthOrigins = [
  {
    origin: `https://${delegatePortal.BASE_URL.split('/')[2]}`,
    localStorage: [
      {
        name: 'chakra-ui-color-mode',
        value: 'light',
      },
      {
        name: 'estimator-meeting-version-preference',
        value: `"viewer"`,
      },
    ],
  },
]

export enum Redacted1Id {
  Agent1 = 'redacted',
  Agent2 = 'redacted',
  Redacted = 'redacted',
}

export enum DelegateFlavor {
  FieldAgent,
  FieldTech,
  InspectionTech,
  Subcontractor,
  Undefined,
}

export const MobileStrings = {
  Button_MainMenu: 'Open navigation menu',
  GoToClaim: 'Go to claim:',
}

export const LeftNavStrings = {
  Title: 'Company Portal',
  Button_Home: 'Home',
  Button_Inbox: 'Inbox',
  Button_Callbacks: 'Callbacks',
  Button_Schedule: 'Schedule',
  Button_Documentation: 'Documentation',
  Button_MobileApps: 'Mobile Apps',
  Button_MobileApps_IOSAppStore: 'iOS App Store',
  Button_MobileApps_GooglePlayStore: 'Google Play Store',
  Button_SubmitBug: 'Submit Bug',
  Button_Collapse: 'Collapse',
  Button_UserMenu_UpdateLicenseNumber: 'Update License Number',
  Button_UserMenu_UpdateProfileImage: 'Update Profile Image',
  Button_UserMenu_UIVersion: 'UI v1.32.2',
  Button_UserMenu_CeylonVersion: 'Ceylon v3.2.0',
  Button_UserMenu_Logout: 'Logout',
}

export const YourAssignedJobsPageStrings = {
  Title: 'Your Assigned Jobs',
}

export const YourAssignedClaimsPageStrings = {
  Title: 'Your Assigned Claims',
  ActionMenuAria: 'Open claim menu',
  ActionMenu: 'actionMenu',
  Label_Preferences: 'Preferences',
  Checkbox_HideClaimsInQAReview: 'Hide claims in QA Review',
  Checkbox_HideClaimsInCarrierReview: 'Hide claims in Carrier Review',
  Label_QuickFilters: 'Quick Filters',
  Button_TodaysInspections: `Today's Inspections`,
  Button_NotScheduled: 'Not Scheduled',
  Label_NoAssignedClaimsWarningTitle: 'No claims assigned to you.',
  Label_NoAssignedClaimsWarningDescription:
    'If this is your first time logging in, it can take a few minutes for your claims to populate. Try refreshing in a few minutes. If this is not your first time logging in and you should have claims assigned to you, please contact Company so we can diagnose this issue.',
}

export const ClaimPageStrings = {
  Badge: 'CLAIM',
  Tab_Details: 'Details',
  Tab_Schedule: 'Schedule',
  Tab_Estimates: 'Estimates',
  Tab_Contacts: 'Contacts',
  Tab_Documents: 'Documents',
  Tab_Media: 'Media',
  Tab_Notes: 'Notes',
  Tab_CallbackRequests: 'Callbacks',
  Tab_Inspections: 'Inspections',
  Tab_LossReport: 'Loss Report',
  Button_Claims: '← Claims',
  Link_ClaimHome: '← Claim Home',
  Link_AllClaims: '← All Claims',
  LossDescription: 'Loss Description',
  Button_AddANote: 'Add A Note',
  Button_RecordCommunication: 'Record Communication',
  Link_ViewInMap: 'View In Map',
  Link_ViewTimeline: 'View Timeline',
  Label_ClaimTimeline: 'Claim Timeline',
}

export const EstimateDetailsPageStrings = {
  Title_Summary: 'Summary',
  Title_Details: 'Details',
  Title_Notes: 'Notes',
  Title_ClaimDocuments: 'Claim Documents',
  Title_Reviews: 'Reviews',
  Button_BackToEstimates: '← Estimates',
}

export const ClaimTimelineTabStrings = {
  Title: 'Claim Timeline',
}

export const ClaimCallbacksTabStrings = {
  Title_Callbacks: 'Callbacks',
  ActionMenuAria: 'Open callback request menu',
  ActionMenu: 'actionMenu',
}

export enum Claims_DataTable_ActionMenuItems {
  OpenClaim = 'Open Claim',
  CopyClaimNumber = 'Copy Claim Number',
}

export enum Inspections_DataTable_ActionMenuItems {
  CopyInspectionId = 'Copy Inspection ID',
  EditInspection = 'Edit Inspection',
  OpenInspection = 'Open Inspection',
}

export const ClaimMediaTabStrings = {
  Title: 'Media',
  Button_ViewMedia: 'View Media',
  Button_DownloadAllImages: 'Download All Images',
  Link_CreatePhotoReport: 'Create Photo Report',
  Link_UploadMedia: 'Upload Media',
  ActionMenuAria: 'Open document menu',
  ActionMenu: 'actionMenu',
}

export const ClaimScheduleTabStrings = {
  Title_InspectionsSchedule: 'Inspections Schedule',
  Button_ScheduleInspection: 'Schedule Inspection',
  Button_Previous: 'Previous',
  Button_Next: 'Next',
  Button_ScheduleRequestedInspection: 'Schedule Requested Inspection',
  Button_CancelInspectionRequest: 'Cancel Inspection Request',
  Tooltip_Field_Adjuster: 'Field Agent',
  Tooltip_InspectionTech: 'Inspection Tech',
}

export const ClaimLossReportTabStrings = {
  Title_LossReport: 'Loss Report',
  Label_LLM_Warning:
    'The loss reports on this page are generated using an LLM for your convenience,  and should not be taken as a source of truth.  Please review each report carefully to ensure accuracy before using it.',
  Label_NoAssignedInspectionTech_Warning:
    'No inspection technician is assigned to this claim.',
  Label_InspectionNotCompleted_Warning:
    'A inspection must be completed for this claim before generating a loss report on it.',
  Label_UpdateLicenseNumber: 'Please make sure your license number is up to date.',
  Label_NoLicenseNumberForAssignedInspectionTech:
    'No license number found for assigned inspection technician',
  Label_ToSaveThisReportAsANote:
    'To save this report as a note, replace all "BLANK" in the text with known details and make sure to save the draft.',
  Label_SaveAsNoteWarning:
    'To save this report as a note, replace all "BLANK" in the text with known details and make sure to save the draft.',
  Label_RetrieveingLossReport: 'Retrieving Loss Report...',
  Button_GenerateLossReport: 'Generate Loss Report',
  Button_GenerateNewLossReport: 'Generate New Loss Report',
  Button_GenerateLossReportFuzzy: 'Generate',
  Button_SaveChangesAsDraft: 'Save Changes as Draft',
  Button_SaveDraftAsNote: 'Save Draft as Note',
  MiniReport: `VERIFICATION:
<VERIFY_CODE_HERE>

RISK OVERVIEW
<BLANK_INSTANCE_1>

FACTS OF LOSS
The facts are: <BLANK_INSTANCE_2>

So Long and thanks for all the fish,

Automation Inspection Tech
Inspection Tech
[INSPECTION_TECH_LICENSE]`,
}

export const UploadTabStrings = {
  Title: 'Upload files',
  Instructions: 'Drag and drop files here or click to browse',
  FileTypes: 'Redacted filetypes up to 1GB each (max 100 files)',
  Button_SelectFiles: 'Select files',
  Button_Submit: 'Submit',
  Button_ClearAll: 'Clear all',
  ValidationErrorTitle: 'File upload error(s)',
}

export const FileCardStrings = {
  Label_Title: 'Title',
  Label_FileDescription: 'File Description',
}

export const ClaimInspectionsTabStrings = {
  Title: 'Inspections',
  Link_UploadVideoAsInspection: 'Upload Video As Inspection',
  Link_StartNewInspection: 'Start New Inspection',
  ActionMenuAria: 'Open inspection menu',
  ActionMenu: 'actionMenu',
}

export const ClaimInspectionConsentAlertStrings = {
  Title: 'This Virtual Inspection is being recorded',
  Description: 'By continuing you are consenting to be recorded.',
  Button_Leave: 'Leave',
  Button_Continue: 'Continue',
}

export const AlertStrings = {
  DeleteGroup_Title: 'Delete Group',
  DeleteGroup_Description:
    'Are you sure you want to delete this group? It will also remove all the photos within the group from the photo report.',
}

export const ClaimInspectionDetailsTabStrings = {
  Button_GetShareLink: 'Get Share Link',
  Button_Screenshot: 'Screenshot',
  InspectionVideo_Title: 'Inspection Video',
}

export const ClaimNotesTabStrings = {
  Title: 'Notes',
  Label_NoNotesHaveBeenAdded_Title: 'No notes have been added',
  Button_FilterNotes: 'Filter Notes',
}

export const PhotoReportTabStrings = {
  Label_PhotoReportGuide_Title: 'Photo Report Guide',
  Label_PhotoReportGuide_Description:
    'By default, photos in the photo report will be grouped & sorted by their label, with unlabeled photos at the bottom of the report. Photos will be sorted by their timestamp within each group. You may also choose to sort photos by just their timestamps by choosing the "Sort By: Timestamp" option in the sorting menu (click the  button to access it). Photos and groups can be rearranged by dragging and dropping them (click & hold the  to drag them).New groups can be added using the "Add Group" button and groups can be renamed by using the edit button next to their title (). Photo titles & descriptions can be edited using the "Edit Photo" button.Note: Groups will not be shown in the downloaded Photo Report. These are merely a convenience feature when creating the photo report.Multiple photos can be dragged at the same time; select the checkbox next to each photo that you would like to drag at the same time, then click and drag one of the photos (using the  button) to the new location, and all selected photos will be moved.Groups and photos can be removed by clicking the  button. Photos can be re-added by opening the action menu (click the  button) and clicking the "Re-Add Photos" button, which will open a modal and allow to select which photos you would like to re-add. Photos will be re-added to their original group (based on their label); if that group was removed, it will be re-added to the end of the photo report.Both groups and photos can be collapsed to make it easier to move them around. Use the "Collapse Photos" & "Collapse Groups" buttons to do so. Each group can be individually collapsed using its  button.The photo report can be reset to its original state by using the "Reset" button in the action menu (click the  button to open the action menu).You can toggle these instructions by clicking the  button.',
  Link_DownloadLastPhotoReport: 'Download Last Photo Report',
  Button_SubmitPhotoReport: 'Submit Photo Report',
  Button_AddGroup: 'Add Group',
  Button_DeselectAll: 'Deselect All',
  Button_CollapsePhotos: 'Collapse Photos',
  Button_CollapseGroups: 'Collapse Groups',
  Button_ExpandPhotos: 'Expand Photos',
  Button_ExpandGroups: 'Expand Groups',
}

export const GenerateDocumentTabStrings = {
  Title: 'Generate Draft Document',
  Label_SearchTemplates: 'Search Templates',
  Label_SelectTemplate: 'Select Template',
  Link_StartGenerationOfDocument: 'Start Generation of Document',
  Label_NoTemplatesMatchSearch: 'No templates match search',
}

export const DocumentTemplateCardStrings = {
  Label_Carrier: 'Carrier:',
  Label_CreatedOn: 'Created On:',
  Button_DownloadTemplate: 'Download Template',
}

export const GenerateDocumentStatusPageStrings = {
  Title: 'Draft Document Generation Status',
  Label_Success: 'Success! The draft document has finished generating.',
  Link_GenerateAnotherDraftDocument: 'Generate Another Draft Document',
  Link_Download: 'Download',
  Label_Description_Prefix: 'Generation of draft document was requested on',
  Label_Description_Content: 'for template "<TEMPLATENAME>".',
  Label_Description_Suffix: 'Draft document was completed on ',
}

export enum Contacts_DataTable_ActionMenuItems {
  CopyContactId = 'Copy Contact ID',
  CopyRedacted1Id = 'Copy Redacted1Id ID',
  ViewMoreInfo = 'View More Info',
  SetPrimaryContact = 'Set Primary Contact',
  EditContact = 'Edit Contact',
  DeleteContact = 'Delete Contact',
  SetAsInactive = 'Set as Inactive',
  SetAsActive = 'Set as Active',
}

export enum Documents_DataTable_ActionMenuItems {
  CopyDocumentId = 'Copy Document ID',
  UpdateDocument = 'Update Document',
  DeleteDocument = 'Delete Document',
}

export enum PhotoReport_ActionMenuItems {
  Reset = 'Reset',
  ReaddPhotos = 'Re-add Photos',
  CollapseGroups = 'Collapse Groups',
  CollapsePhotos = 'Collapse Photos',
}

export enum DataTable_ColumnName_Index {
  Type = 0,
  Access = 1,
  Column = 2,
}

export enum DataTable_Column_PinState {
  NotPinnable = 0,
  Pinned = 1,
  Unpinned = 2,
}

export enum DataTable_Column_SortState {
  NotSortable = 0,
  Unsorted = 1,
  Down_HighToLow = 2,
  Up_LowToHigh = 3,
}

export enum DataTable_Columns_Type {
  Jobs_JobLabel,
  Jobs_Type,
  Jobs_Services,
  Jobs_Description,
  Jobs_Location,
  Jobs_Location_Address,
  Jobs_Location_City,
  Jobs_Location_State,
  Jobs_Location_ZipCode,
  Callbacks_Status,
  Callbacks_Entity_ID,
  Callbacks_For_Role,
  Callbacks_Notes,
  Callbacks_Name,
  Callbacks_Contact_Method,
  Callbacks_Preferred_Time,
  Callbacks_Date_Requested,
  Claims_ClaimNumber,
  Claims_PrimaryContact,
  Claims_Email,
  Claims_Phone,
  Claims_Carrier,
  Claims_ClaimStatus,
  Claims_LastEvent,
  Claims_DateReceived,
  Claims_LossDate,
  Claims_InspectionScheduled,
  Claims_InspectionCompleted,
  Claims_HasLegalRep,
  Claims_City,
  Claims_State,
  Claims_County,
  Claims_CatCode,
  Claims_HasJob,
  Contacts_Assignee,
  Contacts_Name,
  Contacts_Roles,
  Contacts_Preferred_Contact,
  Contacts_Data_Source,
  Contacts_Description,
  Contacts_Inactive,
  Documents_Created,
  Documents_Download,
  Documents_File,
  Documents_Description,
  Documents_FileName,
  Documents_Visibility,
  Documents_Exports,
  Documents_Dates,
  Documents_Dates_Created,
  Documents_Dates_LastModified,
  Documents_Meta,
  Documents_Meta_DataSource,
  Documents_Meta_DocumentType,
  Documents_Tags,
  Estimates_SubmissionDate,
  Estimates_SubmittedBy,
  Estimates_EstimateAmount,
  Inspections_Description,
  Inspections_Started,
  Inspections_Duration,
  Inspections_Organizer,
  Inspections_NumberOfParticipants,
  InspectionScreenshots_Label,
  InspectionScreenshots_Description,
  InspectionScreenshots_FileName,
  InspectionScreenshots_DateUploaded,
  InspectionScreenshots_DateTaken,
}

export const DataTable_Columns = {
  JobLabel: [DataColumnType.Text, 'jobLabel', 'Job', 'JOB'],
  Type: [DataColumnType.Text, 'type', 'Type', 'TYPE'],
  Services: [DataColumnType.Text, 'services', 'Services', 'SERVICES'],
  Description: [DataColumnType.Text, 'description', 'Description', 'DESCRIPTION'],
  Location: [DataColumnType.Text, 'jobLocation', 'Location', 'LOCATION'],
  Status: [DataColumnType.Text, 'status', 'Status', 'STATUS'],
  Name: [DataColumnType.Text, 'name', 'Name', 'NAME'],
  EntityID: [DataColumnType.Link, 'entityId', 'Entity ID', 'ENTITY ID'],
  ForRole: [DataColumnType.Text, 'role', 'For Role', 'FOR ROLE'],
  Notes: [DataColumnType.Text, 'notes', 'Notes', 'NOTES'],
  ContactMethod: [DataColumnType.Text, 'contactMethod', 'Contact Method', 'CONTACT METHOD'],
  PreferredTime: [DataColumnType.Text, 'timeOfDay', 'Preferred Time', 'PREFERRED TIME'],
  DateRequested: [DataColumnType.Date, 'dateRequested', 'Date Requested', 'DATE REQUESTED'],
  FileAlt: [DataColumnType.Text, 'title', 'Title', 'Title'],
  File: [DataColumnType.Text, 'file', 'File', 'FILE'],
  FileName: [DataColumnType.Text, 'fileName', 'File Name', 'FILE NAME'],
  PrimaryContact: [DataColumnType.Text, 'primaryContactName', 'Primary Contact', 'PRIMARY CONTACT'],
  ClaimNumber: [DataColumnType.Link, 'claimNumber', 'Claim Number', 'CLAIM NUMBER'],
  Phone: [DataColumnType.Text, 'primaryContactPhone', 'Phone', 'PHONE'],
  Email: [DataColumnType.Text, 'primaryContactEmail', 'Email', 'EMAIL'],
  ClaimStatus: [DataColumnType.Text, 'claimStatus', 'Claim Status', 'CLAIM STATUS'],
  Carrier: [DataColumnType.Text, 'carrier', 'Carrier', 'CARRIER'],
  LastEvent: [DataColumnType.Text, 'latestTimelineEvent', 'Last Event', 'LAST EVENT'],
  DateReceived: [DataColumnType.Date, 'dateReceived', 'Date Received', 'DATE RECEIVED'],
  LossDate: [DataColumnType.Date, 'lossDate', 'Loss Date', 'LOSS DATE'],
  InspectionCompleted: [
    DataColumnType.Date,
    'inspectionCompleted',
    'Inspection Completed',
    'INSPECTION COMPLETED',
  ],
  InspectionScheduled: [
    DataColumnType.Date,
    'inspectionScheduled',
    'Inspection Scheduled',
    'INSPECTION SCHEDULED',
  ],
  HasLegalRep: [DataColumnType.Check, 'hasLegalRep', 'Has Legal Rep?', '<gavel>'],
  City: [DataColumnType.Text, 'city', 'City', 'CITY'],
  State: [DataColumnType.Text, 'state', 'State', 'STATE'],
  County: [DataColumnType.Text, 'county', 'County', 'COUNTY'],
  CatCode: [DataColumnType.Text, 'catCode', 'CAT Code', 'CAT CODE'],
  HasJob: [DataColumnType.Check, 'hasJob', 'Has Job?', 'HAS JOB?'],
  ContactName: [DataColumnType.Text, 'contactName', 'Name', 'NAME'],
  Roles: [DataColumnType.Text, 'roles', 'Roles', 'ROLES'],
  PreferredContact: [
    DataColumnType.Text,
    'preferredContact',
    'Preferred Contact',
    'PREFERRED CONTACT',
  ],
  Data_Source: [DataColumnType.Text, 'dataSource', 'Data Source', 'DATA SOURCE'],
  Assignee: [DataColumnType.Text, 'primaryContact', 'Assignee', 'ASSIGNEE'],
  Visibility: [DataColumnType.Text, 'cohorts', 'Visibility', 'VISIBILITY'],
  Exports: [DataColumnType.Text, 'exportHistory', 'Exports', 'EXPORTS'],
  Dates: [DataColumnType.Text, 'dates', 'Dates', 'DATES'],
  Meta: [DataColumnType.Text, 'meta', 'Meta', 'META'],
  DocumentTags: [DataColumnType.Text, 'tags.key', 'Tags', 'TAGS'],
  SubmissionDate: [DataColumnType.Text, 'submissionDate', 'Submission Date', 'SUBMISSION DATE'],
  SubmittedBy: [DataColumnType.Text, 'submittedBy', 'Submitted By', 'SUBMITTED BY'],
  EstimateAmount: [DataColumnType.Text, 'grossEstimate', 'Estimate Amount', 'ESTIMATE AMOUNT'],
  Started: [DataColumnType.Date, 'startTime', 'Started', 'STARTED'],
  Duration: [DataColumnType.Date, 'duration', 'Duration', 'DURATION'],
  Organizer: [DataColumnType.Text, 'organizer', 'Organizer', 'ORGANIZER'],
  NumberOfParticipants: [
    DataColumnType.Text,
    'participants',
    '# of Participants',
    '# OF PARTICIPANTS',
  ],
  DateUploaded: [DataColumnType.Date, 'dateAdded', 'Date Uploaded', 'DATE UPLOADED'],
  DateTaken: [DataColumnType.Date, 'dateTaken', 'Date Taken', 'DATE TAKEN'],
  Created: [DataColumnType.Date, 'dateAdded', 'Created', 'CREATED'],
  Label: [DataColumnType.Text, 'label', 'Label', 'LABEL'],
  FileDescription: [DataColumnType.Text, 'file', 'Description', 'DESCRIPTION'],
  Download: [DataColumnType.Link, 'download', '', ''],
}

export enum Documents_Meta_DataSourceSelectionOptions {
  Redacted = 'Redacted',
  ClaimsPortal = 'ClaimsPortal',
  UserPortal = 'UserPortal',
  Estimator = 'Estimator',
  Inspections = 'Inspections',
  Tech = 'Tech',
}

export enum ContactRoles {
  Agent = 1,
  Approver = 2,
  Carrier = 4,
  Coordinator = 8,
  CoordinatorClaimsPortal = 16,
  DeskAdjuster = 32,
  Dispatcher = 64,
  FieldAgent = 128,
  FieldTech = 256,
  LegalRepresentation = 512,
  MortgageHolder = 1024,
  Other = 2048,
  OtherContact = 4096,
  Policyholder = 8192,
  PrimaryContact = 16384,
  ProjectManager = 32768,
  PropertyAccessContact = 65536,
  QA = 131072,
  Reviewer = 262144,
  Subcontractor = 524288,
  ThirdPartyClaimant = 1048576,
}

export const ContactRolesTuples = {
  Agent: [ContactRoles.Agent, 'Agent'],
  Approver: [ContactRoles.Approver, 'Approver'],
  Carrier: [ContactRoles.Carrier, 'Carrier'],
  Coordinator: [ContactRoles.Coordinator, 'Coordinator'],
  CoordinatorClaimsPortal: [ContactRoles.CoordinatorClaimsPortal, 'Coordinator (ClaimsPortal)'],
  DeskAdjuster: [ContactRoles.DeskAdjuster, 'Desk Adjuster'],
  Dispatcher: [ContactRoles.Dispatcher, 'Dispatcher'],
  FieldAgent: [ContactRoles.FieldAgent, 'Field Agent'],
  FieldTech: [ContactRoles.FieldTech, 'Field Tech'],
  LegalRepresentation: [ContactRoles.LegalRepresentation, 'Legal Representation'],
  MortgageHolder: [ContactRoles.MortgageHolder, 'Mortgage Holder'],
  Other: [ContactRoles.Other, 'Other'],
  OtherContact: [ContactRoles.OtherContact, 'Other Contact'],
  Policyholder: [ContactRoles.Policyholder, 'Policyholder'],
  PrimaryContact: [ContactRoles.PrimaryContact, 'Primary Contact'],
  ProjectManager: [ContactRoles.ProjectManager, 'Project Manager'],
  PropertyAccessContact: [ContactRoles.PropertyAccessContact, 'Property Access Contact'],
  QA: [ContactRoles.QA, 'QA'],
  Reviewer: [ContactRoles.Reviewer, 'Reviewer'],
  Subcontractor: [ContactRoles.Subcontractor, 'Subcontractor'],
  ThirdPartyClaimant: [ContactRoles.ThirdPartyClaimant, 'Third-Party Claimant'],
}

export enum NoteDataSources {
  Redacted = 1,
  ClaimsPortal = 2,
  Delegate = 4,
  UserPortal = 8,
  EmailSending = 16,
  EmailReceiving = 32,
  Inspections = 64,
  Redacted1 = 128,
}

export const NoteDataSourceTuples = {
  ClaimsPortal: [NoteDataSources.ClaimsPortal, 'Claims Portal', 'Claims Portal'],
  Redacted: [NoteDataSources.Redacted, 'Redacted', 'Redacted'],
  Delegate: [NoteDataSources.Delegate, 'Delegate', 'Delegate'],
  UserPortal: [NoteDataSources.UserPortal, 'UserPortal', 'UserPortal'],
  EmailSending: [NoteDataSources.EmailSending, 'EmailSending', 'Email Sending'],
  EmailReceiving: [NoteDataSources.EmailReceiving, 'EmailReceiving', 'Email Receiving'],
  Inspections: [NoteDataSources.Inspections, 'Inspections', 'Inspections'],
  Redacted1: [NoteDataSources.Redacted1, 'Redacted1', 'Redacted1'],
}

export enum Filter_Radio_Boolean {
  True = 'True',
  False = 'False',
}

export enum Filter_Radio_CallbackStatus {
  Completed = 'Completed',
  Requested = 'Requested',
  Pending = 'Pending',
  Attempted = 'Attempted',
}

export enum Filter_Radio_DataSource {
  Auth0 = 'Auth0',
  ClaimsPortal = 'ClaimsPortal',
  Redacted = 'Redacted',
  Delegate = 'Delegate',
}

export enum Filter_Radio_Visibility {
  Coordinator = 'Coordinator',
  Estimator = 'Estimator',
  Insured = 'Insured',
  Tech = 'Tech',
}

export enum CannedJobTypes {
  DefaultTestJob,
}

export enum CannedClaimTypes {
  DefaultTestClaim,
  Sushi,
  DocumentStashClaim,
}

export const DataTableStrings = {
  OpenTableSettings: 'Open table settings.',
  OpenTableSearch: 'Open table search.',
  AddTableFilter: 'Add table filter.',
  ExpandTable: 'Expand table.',
  RefreshData: 'Refresh data',
  CloseTable: 'Close table.',
  GoToFirstPage: 'Go to first page.',
  GoToPreviousPage: 'Go to previous page.',
  GoToNextPage: 'Go to next page.',
  GoToLastPage: 'Go to last page.',
  PageXOfY: 'Page %X of %Y',
  GoToPage: '| Go to page:',
}

export enum DataTable_ShowPageSize_Options {
  Show10 = 'Show 10',
  Show20 = 'Show 20',
  Show30 = 'Show 30',
  Show40 = 'Show 40',
  Show50 = 'Show 50',
}

export enum Callbacks_DataTable_ActionMenuItems {
  ChangeCallbackStatus = 'Change callback status',
}

export const JobPageStrings = {
  Tab_Details: 'Details',
  Tab_Documents: 'Documents',
  Tab_Media: 'Media',
  Link_Jobs: '← Jobs',
}

export enum JobTabTypes {
  Details,
  Documents,
  Media,
  Notes,
}

export enum ClaimTabTypes {
  Details,
  Schedule,
  Estimates,
  Contacts,
  Documents,
  Media,
  Notes,
  Callbacks,
  Inspections,
  LossReport,
}

export enum MessageStatusSelectionOptions {
  Read = 'Read',
  Unread = 'Unread',
  Archive = 'Archive',
}

export enum ClaimFilterSelectionOptions_ClaimStatus {
  CoordinatorReview = 'Coordinator Review',
  Rejected = 'Rejected',
  Inspection = 'Inspection',
  QAReview = 'QA Review',
  CarrierReview = 'Carrier Review',
  Closed = 'Closed',
}

export const ValidationStrings = {
  InvalidString1: 'String must contain at least 1 character(s)',
  Required: 'Required',
  FieldRequired: 'This field is required',
  FilesAreRequired: 'Files are required.',
  LicenseNumberRequired: 'License Number field is required',
  InvalidUploadFile:
    'Only image, Word, Excel, PDF, Xactimate, MP4 and MOV file types are accepted.',
  FilesTooLarge: 'Some files exceed the maximum size of 1GB.',
  TooManyFiles: 'Can only upload <MAXUPLOADFILES> or fewer files at a time.',
  InvalidDate: 'Invalid date',
  InvalidUploadInspectionFile: 'Only MP4 and MOV file types are accepted.',
  InvalidExportSelection: `At least one publication target should be selected`,
  InvalidEnumLabelPosition: `Invalid enum value. Expected 'start' | 'end', received ''`,
  DuplicateLabel: `Label exists already`,
  AtLeastOneDocumentNeedsToBeSelected: `At least one document needs to be selected`,
  ATemplateMustBeSelected: 'A template must be selected',
  MaxFiles: 'You have selected <MAXUPLOADFILES> items for upload',
  MaxFilesDescription: 'Please submit these for upload before selecting additional items',
  OverMaxFiles: 'You have selected too many files for upload',
  OverMaxFilesDescription: 'Please remove (<FILEOVERAGE>) files before submitting.',
  UploadNotAcceptedFileType: `File "<FILENAME>" is not an accepted file type.`,
}

export const DialogStrings = {
  TableSettings_Title: 'Table Settings',
  TableSettings_Description: 'Column settings:',
  TableSettings_Close: 'Close',
  TableSearch_Title: 'Global Search',
  TableSearch_Close: 'Close',
  TableSearch_ClearFilter: 'Clear filter.',
  TableFilter_Title_Add: 'Add Filter',
  TableFilter_Title_Edit: 'Edit Filter',
  TableFilter_Close: 'Close',
  TableFilter_ClearFilter: 'Clear filter.',
  TableFilter_GroupClear: 'Clear',
  TableFilter_Text_Job_Includes: 'Job includes:',
  TableFilter_Text_Description_Equals: 'Description equals:',
  TableFilter_Text_Address_Includes: 'Address includes:',
  TableFilter_Text_City_Includes: 'City includes:',
  TableFilter_Text_State_Includes: 'State includes:',
  TableFilter_Text_Zipcode_Includes: 'Zip code includes:',
  TableFilter_Text_Name_Includes: 'Name includes:',
  TableFilter_Text_EntityId_Includes: 'Entity ID includes:',
  TableFilter_Text_Notes_Includes: 'Notes includes:',
  TableFilter_Text_ContactMethod_Includes: 'Contact Method includes:',
  TableFilter_Text_PreferredTime_Includes: 'Preferred Time includes:',
  TableFilter_Text_Phone_Includes: 'Phone includes:',
  TableFilter_Text_Email_Includes: 'Email includes:',
  TableFilter_Text_ClaimNumber_Includes: 'Claim Number includes:',
  TableFilter_Selection_Type_Equals: 'Type equals:',
  TableFilter_Selection_ForRole_Equals: 'For Role equals:',
  TableFilter_Selection_ClaimStatus_Equals: 'Claim Status equals:',
  TableFilter_Selection_DataSource_Equals: 'Data Source equals:',
  TableFilter_Date_AvailableFilters: 'Available Filters',
  InspectionNotes_Title: 'Inspection Notes',
  InspectionNotes_Button_Close: 'Close',
  TableFilter_Text_Roles_String_Includes: 'Roles String includes:',
  TableFilter_Check_Roles_Includes_Some_Of: 'Roles includes some of:',
  TableFilter_Text_PreferredContact_Includes: 'Preferred Contact includes:',
  TableFilter_Radio_DataSource_Includes: 'Data Source includes:',
  TableFilter_Text_Description_Includes: 'Description includes:',
  TableFilter_Text_File_Includes: 'File includes:',
  TableFilter_Text_FileAlt_Includes: 'Title includes:',
  TableFilter_Text_FileName_Includes: 'File Name includes:',
  TableFilter_Text_DocumentType_Includes: 'Document Type includes:',
  TableFilter_Text_SubmissionDate_Includes: 'Submission Date includes:',
  TableFilter_Text_SubmittedBy_Includes: 'Submitted By includes:',
  TableFilter_Text_Label_Includes: 'Label includes:',
  TableFilter_Text_Organizer_Includes: 'Organizer includes:',
  NotesFilter_Title: 'Filter Notes',
}

export enum MobileDevices {
  iPad_Mini = 'iPad Mini',
  iPad_Mini_Landscape = 'iPad Mini landscape',
  iPhone_14_Pro_Max = 'iPhone 14 Pro Max',
  iPhone_14_Pro_Max_Landscape = 'iPhone 14 Pro Max landscape',
}

export const DrawerStrings = {
  Button_Close: 'Close',
  Button_Cancel: 'Cancel',
  Button_Submit: 'Submit',
  Button_Back: 'Back',
  Button_Next: 'Next',
  UpdateProfileImageDrawer_Title: 'Update Profile Image',
  UpdateProfileImageDrawer_Button_RemoveAllFiles: 'Remove All Files',
  UpdateLicenseNumberDrawer_Title: 'Update Your License',
  UpdateLicenseNumberDrawer_TextBox_LicenseNumber: 'License Number',
  UpdateCallbackStatus_Title: 'Update Callback Status',
  UpdateCallbackStatus_ListBox_SelectStatus: 'Select Status',
  UpdateCallbackStatus_Button_RefetchTemplates: 'Refetch templates.',
  UpdateCallbackStatus_Button_GoToTemplates: 'Go to templates.',
  UpdateCallbackStatus_TextBox_NoteTitle: 'Note Title',
  UpdateCallbackStatus_Status_InvalidValue:
    'Invalid value. Expected: Requested, Completed, Pending, or Attempted.',
  CreateNote_Title: 'Create Note',
  CreateNote_TextBox_NoteTitle: 'Note Title',
  CreateNote_TextBox_NoteText: 'Note Text',
  CreateNote_Button_InsertMention: 'Insert Mention',
  CreateNote_Button_InsertParameter: 'Insert Parameter',
  CreateNote_Button_OpenInNewTab: 'Open in New Tab',
  CreateNote_Button_RefetchTemplates: 'Refetch templates.',
  CreateNote_Button_GoToTemplates: 'Go to templates.',
  UpdateDocumentInformation_Title: 'Update Document Information',
  UpdateDocumentInformation_Button_RotateLeft: 'Rotate Left',
  UpdateDocumentInformation_Button_SaveRotation: 'Save',
  UpdateDocumentInformation_Button_RotateRight: 'Rotate Right',
  UpdateDocumentInformation_Link_OpenDocumentPreview: 'Open Document Preview',
  CompleteInspection_Title: 'Complete Inspection',
  CompleteInspection_ListBox_CompletedBy: 'Completed By',
  CancelInspection_Title: 'Cancel Inspection',
  CancelInspection_ListBox_CanceledBy: 'Canceled By',
  RequestInspection_Title: 'Request Inspection',
  RequestInspection_ListBox_InspectorRole: 'Inspector Role',
  RequestInspection_ListBox_RequestedBy: 'Requested By',
  ScheduleInspection_Title: 'Schedule Inspection',
  ScheduleInspection_ListBox_InspectorRole: 'Inspector Role',
  ScheduleInspection_ListBox_ScheduledBy: 'Scheduled By',
  RecordCustomerCommunication_Title: 'Record Customer Communication',
  RecordCustomerCommunication_TypeOfCommunication_InvalidValue:
    'Invalid value. Expected: Customer Contacted - Email, Customer Contacted - Left Voicemail, Customer No Contact, Initial Customer Contact Attempted, Initial Customer Contact Failed, Initial Customer Contact Success, or Invalid Contact Information.',
  CreateContact_Title_Create: 'Create Contact',
  CreateContact_Title_Edit: 'Edit Contact',
  CreateContact_TextBox_FirstName: 'First Name',
  CreateContact_TextBox_LastName: 'Last Name',
  CreateContact_FirstName_InvalidValue: 'First name must be at least 1 character',
  CreateContact_LastName_InvalidValue: 'Name cannot contain the following characters: []()',
  CreateContact_ZipCode_InvalidValue: 'String must contain at most 5 character(s)',
  CreateContact_Phone_InvalidValue: 'Phone must be 12 characters',
  CreateContact_Extension_InvalidValue: 'Extension must contain only numbers',
  CreateContact_Email_InvalidValue: 'Invalid email',
  CreateContact_Role_InvalidValue: 'Please select a role',
  EditInspection_Title: 'Edit inspection for <CLAIM> started at <STARTED>',
  EditInspection_TextBox_Description: 'Description',
  ExportNote_Title: 'Export Note',
  AddRemovedPhotos_Title: 'Add Removed Photos',
  AddRemovedPhotos_Checkbox_SelectAll: 'Select All',
}

export const ReportPortalIssuesPageStrings = {
  Title: 'Report Portal Issues',
}

export const DocumentationPageStrings = {
  Title: 'Documentation',
}

export const InboxPageStrings = {
  Title: 'Your Inbox',
  Button_MarkRead: 'Mark Read',
  Button_MarkUnread: 'Mark Unread',
  Button_Archive: 'Archive',
  Button_ViewClaim: 'View Claim',
  Button_ViewJob: 'View Job',
  Button_MarkAllRead: 'Mark All Read',
  Button_ArchiveAll: 'Archive All',
}

export const CallbacksPageStrings = {
  Title: 'Active Callbacks',
  ActionMenuAria: 'Open callback request menu',
  ActionMenu: 'actionMenu',
}

export const JobInspectionsSchedulePageStrings = {
  Title: 'Claim Inspections',
  Button_Previous: 'Previous',
  Button_Next: 'Next',
  Label_CurrentMonth: 'Current Month',
  Button_SeeNotes: 'See Notes',
  Button_Actions: 'Actions',
  Warning_NoInspectionsFound: 'No inspections found for subcontractor.',
}

export const ClaimInspectionsSchedulePageStrings = {
  Title: 'Claim Inspections',
  Button_Previous: 'Previous',
  Button_Next: 'Next',
  Label_CurrentMonth: 'Current Month',
  Button_SeeNotes: 'See Notes',
  Button_Actions: 'Actions',
  Warning_NoInspectionsFound: 'No inspections found for <>.',
  ListBox_SelectEstimators: 'Select Estimator(s)',
  ListBox_SelectEstimators_Placeholder: 'Select...',
  Button_ClearSelection: 'Clear selected options',
  Tooltip_Contact_Primary: 'Primary Contact',
  Tooltip_Contact_Policyholder: 'Policyholder',
  Tooltip_Contact_Dual: 'Primary Contact/Policyholder',
  Tooltip_Claim_Number: 'Claim Number',
  Tooltip_Field_Adjuster: 'Field Agent',
  Tooltip_Inspection_Tech: 'Inspection Tech',
}

export const JobDetailsTabStrings = {
  JobDetails_Title: 'Job Details',
  JobDetails_JobNumber: 'Job Number',
  JobDetails_Type: 'Type',
  JobDetails_Services: 'Services',
  JobDetails_Description: 'Description',
  JobLocation_Title: 'Job Location',
  JobLocation_Street: 'Street',
  JobLocation_SecondaryStreet: 'Secondary Street',
  JobLocation_AddressType: 'Address Type',
  JobLocation_City: 'City',
  JobLocation_County: 'County',
  JobLocation_State: 'State',
  JobLocation_ZipCode: 'ZIP Code',
  WorkDetails_Title: 'Work Details',
  Label_WorkType: 'Work Type',
  Label_TarpArea: 'Tarp Area',
  Label_TimeOfService: 'Time of Service',
  Label_FastenerType: 'Fastener Type',
  Label_RoofPitch: 'Roof Pitch',
  Label_ServiceDate: 'Service Date',
  Label_HighRoof: '2 or More Stories?',
  Label_PhotoReport: 'Photo Report',
  Button_Download: 'Download',
  YourJobTeam_Title: 'Your Job Team',
  YourJobTeam_PrimaryContact: 'Primary Contact',
  YourJobTeam_Coordinator: 'Coordinator',
  YourJobTeam_ProjectManager: 'Project Manager',
  YourJobTeam_Approver: 'Approver',
  YourJobTeam_Dispatcher: 'Dispatcher',
  YourJobTeam_FieldTech: 'Field Tech',
  YourJobTeam_Subcontractor: 'Subcontractor',
  Actions_Title: 'Actions',
  Button_Actions_AddANote: 'Add a Note',
  Link_Actions_ViewDocuments: 'View Documents',
  Link_Actions_ViewMedia: 'View Media',
  Link_Actions_Upload: 'Upload Documents/Media',
  Link_Actions_CreatePhotoReport: 'Create Photo Report',
  JobVisualizer_Title: 'Job Visualizer',
}

export const JobDocumentsTabStrings = {
  Title: 'Documents',
  Link_CreatePhotoReport: 'Create Photo Report',
  Link_UploadDocuments: 'Upload Document(s)',
  Link_UploadMedia: 'Upload Media',
  Label_Empty_Title: 'Get started with uploading some documents',
  Label_Empty_Description:
    'If you have any documents you need to upload for your job, you can do so by clicking the button below.',
}

export const JobMediaTabStrings = {
  Title: 'Media',
  Link_CreatePhotoReport: 'Create Photo Report',
  Link_UploadMedia: 'Upload Media',
  Label_Empty_Title: 'Get started by uploading media',
  Label_Empty_Description:
    'If you have media you need to upload for your job, you can do so by clicking the button below.',
}

export const MediaCardStrings = {
  Label_Filename: 'Filename',
  Label_Title: 'Title',
  Label_Description: 'Description',
  Button_EditInfo: 'Edit Info',
  Button_Delete: 'Delete',
}

export const JobUploadTabStrings = {
  Label_UploadFiles: 'Upload Files (.jpg, .png, .xls/xlsx, .doc/docx, .pdf, .esx, .mp4 or .mov)',
  Button_RemoveAllFiles: 'Remove All Files',
  Button_Submit: 'Submit',
}

export const JobPhotoReportTabStrings = {
  Label_Title: 'Create a Photo Report',
  Label_Empty_Description: 'No photos have been uploaded',
  Button_SubmitPhotoReport: 'Submit Photo Report',
  Checkbox_SelectAll: 'Select All',
  Button_HideUnselected: 'Hide Unselected',
  Button_ShowUnselected: 'Show Unselected',
}

export const PhotoReportCardStrings = {
  Label_Title: 'Title',
  Label_Label: 'Label',
  Label_Description: 'Description',
  Button_EditPhoto: 'Edit Photo',
}

export const AddPhotoReportGroupDialogStrings = {
  Title: 'Update Photo Label',
  Button_Submit: 'Submit',
  Label_Position: 'Position',
  Label_Start: 'Start',
  Label_End: 'End',
  Label_Label: 'Label',
  Placehold_Select: 'Select...',
}

export const PhotoReportSortOrderDialogStrings = {
  Title: 'Sort Order',
  Label_Alert:
    'Changing the sort order will remove any changes you made to the order of groups and/or documents.',
  Label_SortBy: 'Sort by:',
  Label_SortBy_Label: 'Label',
  Label_SortBy_Timestamp: 'Timestamp',
  Label_SortBy_Ascending: 'Ascending',
  Label_SortBy_Descending: 'Descending',
}

export const ClaimDetailsTabStrings = {
  BasicInfo_Title: 'Basic Info',
  BasicInfo_ClaimNumber: 'Claim Number',
  BasicInfo_PolicyNumber: 'Policy Number',
  BasicInfo_Carrier: 'Carrier',
  BasicInfo_Coordinator: 'Coordinator',
  BasicInfo_FieldAgent: 'Field Agent',
  BasicInfo_InspectionTech: 'Inspection Tech',
  BasicInfo_HasLegalRep: 'Has Legal Rep',
  BasicInfo_HasJob: 'Has Job',
  BasicInfo_ClaimStatus: 'Claim Status',
  LossInformation_Title: 'Loss Information',
  LossInformation_LossDate: 'Loss Date',
  LossInformation_LossType: 'Loss Type',
  LossInformation_CATCode: 'CAT Code',
  LossInformation_ClaimFactors: 'Claim Factors',
  LossInformation_LossDescription: 'Loss Description',
  LossLocation_Title: 'Loss Location',
  LossLocation_Street: 'Street',
  LossLocation_SecondaryStreet: 'Secondary Street',
  LossLocation_City: 'City',
  LossLocation_County: 'County',
  LossLocation_State: 'State',
  LossLocation_ZipCode: 'Zip Code',
  LossLocation_Map: 'Map',
  LossLocationMap_Title: 'Loss Location Map',
  Button_RecordCustomerCommunication: 'Record Customer Communication',
  ContactInformation_Title: 'Contact Information',
  ContactInformation_Name: 'Name',
  ContactInformation_Phone: 'Phone',
  ContactInformation_Email: 'Email',
  ClaimTimeline_Title: 'Claim Timeline',
}

export const ClaimContactsTabStrings = {
  Title_Contacts: 'Contacts',
  Title_RemovedContacts: 'Removed Contacts',
  Button_CreateContact: 'Create Contact',
  Button_AddCarrier: 'Add Carrier',
  ActionMenuAria: 'Open contact menu',
  ActionMenu: 'actionMenu',
}

export const ClaimDocumentsTabStrings = {
  Title: 'Documents',
  Button_CreateDocuments: 'Create Documents',
  MenuItem_CreatePhotoReport: 'Create Photo Report',
  MenuItem_GenerateDraftDocument: 'Generate Draft Document',
  Link_UploadDocuments: 'Upload Documents',
  ActionMenuAria: 'Open document menu',
  ActionMenu: 'actionMenu',
}

export const ClaimEstimatesTabStrings = {
  Title_Estimates: 'Estimates',
  ActionMenuAria: 'Open estimate menu',
  ActionMenu: 'actionMenu',
}

export enum Months {
  Jan = 'January',
  Feb = 'February',
  Mar = 'March',
  Apr = 'April',
  May = 'May',
  Jun = 'June',
  Jul = 'July',
  Aug = 'August',
  Sep = 'September',
  Oct = 'October',
  Nov = 'November',
  Dec = 'December',
}

export enum DateDirection {
  Past,
  Future,
}

export enum CallbackRoleSelectionOptions {
  Coordinator = 'Coordinator',
  FieldAgent = 'Field Agent',
}

export enum CallbackStatusSelectionOptions {
  Attempted = 'Attempted',
  Completed = 'Completed',
  Pending = 'Pending',
  Requested = 'Requested',
}

export enum InboxSortBySelectionOptions {
  Unread = 'Unread',
  Date = 'Date',
}

export enum DateFilterTypes {
  DateEquals = 'Date Equals',
  DateGreaterThan = 'Date Greater Than',
  DateGreaterEqualThan = 'Date Greater Equal Than',
  DateLesserThan = 'Date Lesser Than',
  DateLesserEqualThan = 'Date Lesser Equal Than',
  TimeEquals = 'Date Time Equals',
  TimeGreaterThan = 'Date Time Greater Than',
  TimeGreaterEqualThan = 'Date Time Greater Equal Than',
  TimeLesserThan = 'Date Time Lesser Than',
  TimeLesserEqualThan = 'Date Time Lesser Equal Than',
  DateTBD = 'Date is TBD',
}

export const AbortErrors = {
  EmptyCallbacksTableMessage: 'Callbacks: Callbacks Table is empty',
  EmptyYourAssignedJobsTableMessage: 'Your Assigned Jobs: Jobs Table is empty',
  EmptyYourAssignedClaimsTableMessage: 'Your Assigned Claims: Claims Table is empty',
  PaginationNotEnoughEntries:
    'Pagination cannot be tested - not enough table entries - need at least 10',
  EmptyInboxMessage: 'Inbox: Inbox is empty',
  InboxNotEnoughMessages: 'Inbox scenario cannot be tested - not enough messages - need at least 2',
  EmptyDocumentsTableMessage: 'Documents Table is empty',
  EmptyMediaTabMessage: 'Media tab is empty',
  EmptyPhotoReportPageMessage: 'Photo Report page is empty',
  MissingScheduledEventsMessage: 'Schedule: Scheduled Events are missing',
  EmptyClaimContactsTableMessage: 'Claim Contacts: Contacts Table is empty',
  EmptyClaimDocumentsTableMessage: 'Claim Documents: Documents Table is empty',
  EmptyClaimMediaTableMessage: 'Claim Media: Media Table is empty',
  EmptyClaimCallbacksTableMessage: 'Claim Callbacks: Callbacks Table is empty',
  EmptyClaimInspectionsTableMessage: 'Claim Inspections: Inspections Table is empty',
  EmptyClaimInspectionDetailsTableMessage: 'Claim Media: Inspection Details Table is empty',
  EmptyClaimEstimatesTableMessage: 'Claim Estimates: Estimates Table is empty',
  EmptyClaimEstimateDetailsDocumentsTableMessage:
    'Claim Estimate Details: Claim Documents Table is empty',
  NotesNotEnoughEntries:
    'Notes scenario cannot be tested - not enough note entries - need at least 2',
  LessThanTwoGroupsPhotoReportPageMessage:
    'Photo Report Page scenario cannot be tested - not enough groups - need at least 2',
  LessThanTwoTemplatesGenerateDocumentPageMessage:
    'Generate Document Page scenario cannot be tested - not enough templates - need at least 2',
}

export enum LabelPosition {
  Start,
  End,
}
