import { claimsPortal } from '../../environments/env.ceylon.js'
import { CeylonEnvironmentType, DataColumnType } from '../shared/constants.js'

export const DefaultEnvironment = claimsPortal.ENVIRONMENT ?? CeylonEnvironmentType.Company_Test
export const MaxUploadFiles = 100
export const NicelyFormedClaimsPortalAuthOrigins = [
  {
    origin: `https://${claimsPortal.BASE_URL.split('/')[2]}`,
    localStorage: [
      {
        name: 'chakra-ui-color-mode',
        value: 'light',
      },
    ],
  },
]

export enum GlobalSearchItemTypes {
  Command,
  Link,
}

export const LeftNavStrings = {
  Title: 'Claims Portal Dashboard',
  Button_Home: 'Home',
  Button_Claims: 'Claims',
  Button_Jobs: 'Jobs',
  Button_Inbox: 'Inbox',
  Button_Callbacks: 'Callbacks',
  Button_Admin: 'Admin',
  Button_Admin_GoBack: 'Go back',
  Button_Admin_Contacts: 'Contacts',
  Button_Admin_Estimator: 'Estimator',
  Button_Admin_Pricing: 'Pricing',
  Button_Admin_Templates: 'Templates',
  Button_Admin_Tags: 'Tags',
  Button_Chatbots: 'Chatbots',
  Button_Chatbots_GoBack: 'Go back',
  Button_Chatbots_Eagle: 'Eagle',
  Button_Documentation: 'Documentation',
  Button_SubmitBug: 'Submit Bug',
  Button_Collapse: 'Collapse',
  Button_UserMenu_UpdateProfileImage: 'Update Profile Image',
  Button_UserMenu_UserSettings: 'User Settings',
  Button_UserMenu_BreakTimeSettings: 'Break Time Settings',
  Button_UserMenu_AvailableCommands: 'Available Commands',
  Button_UserMenu_UIVersion: 'UI vRedacted',
  Button_UserMenu_CeylonVersion: 'Ceylon vRedacted',
  Button_UserMenu_Logout: 'Logout',
}

export const DataTableStrings = {
  OpenTableSettings: 'Open table settings.',
  OpenTableSearch: 'Open table search.',
  AddTableFilter: 'Add table filter.',
  RefreshData: 'Refresh data',
  ExpandTable: 'Expand table.',
  CloseTable: 'Close table.',
  AssignContact: 'Assign Contact',
  AddTags: 'Add Tags',
  AddTimelineEvent: 'Add Timeline Event',
  ExportDocument: 'Export Document',
  ExportDocuments: 'Export Document',
  UpdateDocumentVisibility: 'Update Document Visibility',
  UpdateDocumentsVisibility: 'Update Documents Visibility',
  ExportMedia: 'Export Media',
  UpdateMediaVisibility: 'Update Media Visibility',
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

export const FiltersStrings = {
  AddFilter: 'Add Filter',
  ClearFilters: 'Clear Filters',
  ResetFilters: 'Reset Filters',
  SaveFilters: 'Save Filters',
  RemoveRow: 'Remove row',
  Alert_NoFilters: 'Click the "Add Filter" button to start filtering.',
  Filter_InvalidValue: 'String must contain at least 1 character(s)',
}

export const ViewsStrings = {
  Cancel: 'Cancel',
  SaveView: 'Save View',
  CreateNewView: 'Create New View',
  PersonalViews: 'Personal Views',
  GlobalViews: 'Global Views',
  Type_Global: 'Global',
  Type_Personal: 'Personal',
  Include_ColumnOrder: 'Column Order',
  Include_ColumnPinning: 'Column Pinning',
  Include_ColumnVisibility: 'Column Visibility',
  Include_Filters: 'Filters',
  Include_Sorting: 'Sorting',
  NewView_Title: 'title',
  NewView_Description: 'description',
  NewView_Type: 'type',
  NewView_Radio_Type_Global: 'Global',
  NewView_Radio_Type_Personal: 'Personal',
  Alert_NoPersonalViews: 'No personal views have been added.',
  View_Title_InvalidValue: 'String must contain at least 1 character(s)',
  View_Type_InvalidValue: 'Invalid value. Expected: Personal or Global.',
  View_Global_Reset:
    'Reset View Reset everything Column Pinning, Column Order, Column Visibility, Sorting, Filters, Pagination',
  View_Global_Default:
    'Default Filter View Filter out claims that are no longer being worked on. Filters',
  View_Global_Unassigned:
    'Unassigned Claims View claims that are unassigned and ready to be worked on. Filters',
}

export enum ViewTypes {
  Personal,
  Global,
}

export enum ViewIncludes {
  ColumnOrder = 'Column Order',
  ColumnPinning = 'Column Pinning',
  ColumnVisibility = 'Column Visibility',
  Filters = 'Filters',
  Sorting = 'Sorting',
}

export enum ClaimFilterFields {
  Carrier = 'Carrier',
  CatCode = 'Cat Code',
  City = 'City',
  ClaimNumber = 'Claim Number',
  ClaimStatus = 'Claim Status',
  Coordinator = 'Coordinator',
  County = 'County',
  DateReceived = 'Date Received',
  FieldAgent = 'Field Agent',
  HasCatCode = 'Has Cat Code',
  HasCoordinator = 'Has Coordinator',
  HasFieldAgent = 'Has Field Agent',
  HasInspectionTech = 'Has Inspection Tech',
  HasLegalRep = 'Has Legal Rep',
  InAssignQueue = 'In Assign Queue',
  IsReadOnly = 'Is Read Only',
  LatestTimelineEvent = 'Latest Timeline Event',
  LossDate = 'Loss Date',
  PrimaryContactEmail = 'Primary Contact Email',
  PrimaryContactName = 'Primary Contact Name',
  PrimaryContactPhone = 'Primary Contact Phone',
  State = 'State',
  JobContracted = 'Job Contracted',
  JobNotSold = 'Job Not Sold',
  InspectionCompleted = 'Inspection Completed',
  InspectionScheduled = 'Inspection Scheduled',
  HasJob = 'Has Job',
}

export enum ClaimFilterOperators {
  DoesNotMatch = 'Does not match',
  EqualTo = 'Equal to',
  GreaterThan = 'Greater than',
  GreaterThanOrEqualTo = 'Greater than or equal to',
  LessThan = 'Less than',
  LessThanOrEqualTo = 'Less than or equal to',
  Matches = 'Matches',
  NotEqualTo = 'Not equal to',
  WithinTheLast = 'Within the last',
  Is = 'Is',
}

export enum ClaimFilterFields_Text {
  CatCode = 'Cat Code',
  City = 'City',
  ClaimNumber = 'Claim Number',
  County = 'County',
  PrimaryContactEmail = 'Primary Contact Email',
  PrimaryContactName = 'Primary Contact Name',
  PrimaryContactPhone = 'Primary Contact Phone',
  State = 'State',
}

export enum ClaimFilterOperators_Text {
  EqualTo = 'Equal to',
  NotEqualTo = 'Not equal to',
  Matches = 'Matches',
  DoesNotMatch = 'Does not match',
}

export enum ClaimFilterFields_Boolean {
  HasCatCode = 'Has Cat Code',
  HasCoordinator = 'Has Coordinator',
  HasFieldAgent = 'Has Field Agent',
  HasLegalRep = 'Has Legal Rep',
  HasJob = 'Has Job',
  IsReadOnly = 'Is Read Only',
}

export enum ClaimFilterOperators_Boolean {
  Is = 'Is',
  EqualTo = 'Equal to', 
  NotEqualTo = 'Not equal to',
}

export enum ClaimFilterFields_Date {
  DateReceived = 'Date Received',
  LossDate = 'Loss Date',
  JobContracted = 'Job Contracted',
  JobNotSold = 'Job Not Sold',
  InspectionScheduled = 'Inspection Scheduled',
  InspectionCompleted = 'Inspection Completed',
  InAssignQueue = 'In Assign Queue',
}

export enum ClaimFilterOperators_Date {
  DoesNotMatch = 'Does not match',
  GreaterThan = 'Greater than',
  GreaterThanOrEqualTo = 'Greater than or equal to',
  LessThan = 'Less than',
  LessThanOrEqualTo = 'Less than or equal to',
  Matches = 'Matches',
  WithinTheLast = 'Within the last',
}

export enum JobFilterFields {
  Approver = 'Approver',
  City = 'City',
  ClosedReason = 'Closed Reason',
  Coordinator = 'Coordinator',
  County = 'County',
  Description = 'Description',
  Dispatcher = 'Dispatcher',
  JobId = 'Job ID',
  IsClosed = 'Is Closed',
  LatestTimelineEvent = 'Latest Timeline Event',
  LatestWorkAuthStatus = 'Latest Work Auth Status',
  PrimaryContactEmail = 'Primary Contact Email',
  PrimaryContactName = 'Primary Contact Name',
  PrimaryContactPhone = 'Primary Contact Phone',
  ProjectManager = 'Project Manager',
  RelatedClaimNumber = 'Related Claim Number',
  State = 'State',
  Type = 'Type',
  Services = 'Services',
  HasBill = 'Has Bill',
  HasInvoice = 'Has Invoice',
  HasWorkDetails = 'Has Work Details',
  WorkAuthSignedOn = 'Work Auth Signed On',
}

export enum JobFilterOperators {
  EqualTo = 'Equal to',
  NotEqualTo = 'Not equal to',
  Matches = 'Matches',
  DoesNotMatch = 'Does not match',
  Includes = 'Includes',
}

export enum JobFilterFields_Text {
  City = 'City',
  ClosedReason = 'Closed Reason',
  County = 'County',
  Description = 'Description',
  JobId = 'Job ID',
  PrimaryContactEmail = 'Primary Contact Email',
  PrimaryContactName = 'Primary Contact Name',
  PrimaryContactPhone = 'Primary Contact Phone',
  RelatedClaimNumber = 'Related Claim Number',
  State = 'State',
}

export enum JobFilterOperators_Text {
  Matches = 'Matches',
  DoesNotMatch = 'Does not match',
}

export enum JobFilterFields_Boolean {
  IsClosed = 'Is Closed',
  HasBill = 'Has Bill',
  HasInvoice = 'Has Invoice',
  HasWorkDetails = 'Has Work Details',
}

export enum JobFilterOperators_Boolean {
  EqualTo = 'Equal to',
  NotEqualTo = 'Not equal to',
}

export const ValidationStrings = {
  InvalidString1: 'String must contain at least 1 character(s)',
  InvalidString2: 'String must contain at least 2 character(s)',
  InvalidZipCode: 'String must contain exactly 5 character(s)',
  InvalidColor: 'String must contain exactly 7 character(s)',
  Required: 'Required',
  FieldRequired: 'This field is required',
  ExpectedObject: 'Expected object, received null',
  InvalidCheckboxGroup: 'You must select at least one group',
  FilesAreRequired: 'Files are required.',
  FileIsRequired: 'A file is required.',
  InvalidUploadFile:
    'Only redacted file types are accepted.',
  InvalidCSVFile: 'Only csv file types are accepted.',
  FilesTooLarge: 'Some files exceed the maximum size of 1GB.',
  MaxFiles: 'You have selected <MAXUPLOADFILES> items for upload',
  MaxFilesDescription: 'Please submit these for upload before selecting additional items',
  OverMaxFiles: 'You have selected too many files for upload',
  OverMaxFilesDescription: 'Please remove (<FILEOVERAGE>) files before submitting.',
  TooManyFiles: 'Can only upload <MAXUPLOADFILES> or fewer files at a time.',
  InvalidAddressType: `Invalid enum value. Expected 'Firm or Business' | 'Bad Address' | 'Current or Temporary' | 'Home' | 'Legal Address' | 'Mailing' | 'Office' | 'Permanent' | 'Registry Home', received ''`,
  InvalidAppointmentChannel: `Invalid enum value. Expected 'onsite' | 'phone' | 'video', received ''`,
  InvalidAppointmentType: `Invalid enum value. Expected 'inspection' | 'mitigation' | 'restoration' | 'review', received ''`,
  InvalidContactMethod: `Invalid enum value. Expected 'phone' | 'text' | 'email', received ''`,
  InvalidContactOutcome: `Invalid enum value. Expected 'callbackRequested' | 'emailInvalid' | 'numberInvalid' | 'success' | 'voicemail', received ''`,
  InvalidEnumValueGeneric: `Invalid enum value. Expected`,
  InvalidReceivedMethod: `Invalid enum value. Expected 'email' | 'fax' | 'mail' | 'text' | 'upload', received ''`,
  InvalidDurationLow: `Number must be greater than 0`,
  InvalidNumber1OrMore: 'Number must be greater than or equal to 1',
  InvalidNumber0OrMore: 'Number must be greater than or equal to 0',
  InvalidNumberPoint01: 'Number must be greater than or equal to 0.01',
  InvalidDate: 'Invalid date',
  InvalidZipCodeAlternate: 'Zip code must be 5 characters',
  InvalidZipCodeNumbersOnly: 'Zip code must only be numbers',
  DateTooOld: 'Date must be greater than or equal to ',
  DateTooNew: 'Date must be smaller than or equal to',
  DateReceivedMustBeAfterDateOfLoss: 'Date Received has to be after Date of Loss',
  InvalidLossOfUseType:
    'Invalid value. Expected: Housing, Food, Transportation, Storage, Laundry & Cleaning, Pet Boarding, or Other.',
  InvalidMessageStatus: 'Invalid value. Expected: Unread, Read, or Archived.',
  InvalidEnumLossOfUseStatus: `Invalid enum value. Expected 'approved' | 'denied' | 'cancelled' | 'pending', received ''`,
  UploadErrorTitle: 'Something went wrong',
  UploadErrorDescription:
    'File could not be uploaded. Please try again. If the issue persists, contact Company customer service.',
  AtLeastOneVendorIsRequired: 'At least one vendor is required',
  InvalidEnumJobCloseReason: `Invalid enum value. Expected 'completed' | 'withdrawn' | 'cancelled', received ''`,
  InvalidEnumTimeOfService: `Invalid enum value. Expected 'afterBusinessHours' | 'duringBusinessHours', received ''`,
  InvalidEnumFastenerType: `Invalid enum value. Expected 'mechanical' | 'sandbag', received ''`,
  InvalidEnumRoofPitch: `Invalid enum value. Expected '07_12AndUnder' | '07_12To09_12' | '10_12To12_12' | 'over12_12', received ''`,
  InvalidExportSelection: `At least one publication target should be selected`,
  InvalidEnumInspectorRole: `Invalid enum value. Expected 'fieldAgent' | 'inspectionTech', received ''`,
  InvalidEnumLabelPosition: `Invalid enum value. Expected 'start' | 'end', received ''`,
  DuplicateLabel: `Label exists already`,
  AtLeastOneDocumentNeedsToBeSelected: `At least one document needs to be selected`,
  ATemplateMustBeSelected: 'A template must be selected',
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
  TableFilter_Text_Name_Includes: 'Name includes:',
  TableFilter_Text_EntityId_Includes: 'Entity ID includes:',
  TableFilter_Text_Notes_Includes: 'Notes includes:',
  TableFilter_Text_ContactMethod_Includes: 'Contact Method includes:',
  TableFilter_Text_PreferredTime_Includes: 'Preferred Time includes:',
  TableFilter_Date_AvailableFilters: 'Available Filters',
  TableFilter_Date_DateRequested: 'Date Requested:',
  TableFilter_Selection_Type_Equals: 'Type equals:',
  TableFilter_Selection_ForRole_Equals: 'For Role equals:',
  TableFilter_Range_Contacts_Number: 'Contacts #',
  TableFilter_Range_Min: 'Min:',
  TableFilter_Range_Max: 'Max:',
  TableFilter_Text_Roles_String_Includes: 'Roles String includes:',
  TableFilter_Check_Roles_Includes_Some_Of: 'Roles includes some of:',
  TableFilter_Text_PreferredContact_Includes: 'Preferred Contact includes:',
  TableFilter_Radio_DataSource_Includes: 'Data Source includes:',
  TableFilter_Radio_Status_Includes: 'Status includes:',
  TableFilter_Text_Description_Includes: 'Description includes:',
  TableFilter_Text_License_Includes: 'License includes:',
  TableFilter_Radio_Picture: 'Picture is:',
  TableFilter_Radio_Inactive: 'Inactive is:',
  TableFilter_Text_TagKey_Includes: 'Tag Key includes:',
  TableFilter_Text_Resource_Includes: 'Resource includes:',
  TableFilter_Text_Tag_Value_Includes: 'Tag Value includes:',
  TableFilter_Text_Contact_Includes: 'Contact includes:',
  TableFilter_Text_ContactRolesString_Includes: 'Contact Roles String includes:',
  TableFilter_Check_ContactRoles_Includes_Some_Of: 'Contact Roles includes some of:',
  TableFilter_Selection_Status_Equals: 'Status equals:',
  TableFilter_Date_CreatedDate: 'Created Date:',
  TableFilter_Date_ExpirationDate: 'Expiration Date:',
  TableFilter_Date_Started: 'Started:',
  TableFilter_Text_File_Includes: 'File includes:',
  TableFilter_Text_FileAlt_Includes: 'Title includes:',
  TableFilter_Text_Label_Includes: 'Label includes:',
  TableFilter_Text_FileName_Includes: 'File Name includes:',
  TableFilter_Text_DocumentType_Includes: 'Document Type includes:',
  TableFilter_Selection_DataSource_Equals: 'Data Source equals:',
  NotesFilter_Title: 'Filter Notes',
  TableFilter_Text_Organizer_Includes: 'Organizer includes:',
  TableFilter_Text_Duration_Includes: 'Duration includes:',
  UpdateCarrier_Title: 'Update Carrier',
  UpdateCarrier_Description: 'Select a Carrier',
  TableFilter_Text_Document_Includes: 'Document includes:',
  TableFilter_Text_Recipients_Includes: 'Recipients includes:',
  AvailableCommands_Title: 'Available Commands',
  AvailableCommands_Label_Description: `This is the list of all available commands throughout the application. If a command has the "Requires Context" tag, that means it can only be triggered in certain contexts. For example, the "New Claim Note" command can only be triggered when you are viewing a specific claim.\n\nTo trigger a command you will need to open up the Command Palette. This can be done by clicking the search button in the top right hand corner of the screen or by using the\nCtrl\nK\n shortcut.`,
  AvailableCommands_Label_AddPersonToClaimPortal: `Add Person to Claim Portal\n\nRequires Context`,
  AvailableCommands_Label_AssignClaimCoordinator: `Assign Claim Coordinator\n\nRequires Context`,
  AvailableCommands_Label_AssignClaimFieldAgent: `Assign Claim Field Agent\n\nRequires Context`,
  AvailableCommands_Label_EditClaimTags: `Edit Claim Tags\n\nRequires Context`,
  AvailableCommands_Label_NewClaimContact: `New Claim Contact\n\nRequires Context`,
  AvailableCommands_Label_NewClaimNote: `New Claim Note\n\nRequires Context`,
  AvailableCommands_Label_NewNoteTemplate: `New Note Template`,
  AvailableCommands_Label_UpdateBreakTime: `Update Break Time`,
  AvailableCommands_Label_UpdateUserPreferences: `Update User Preferences`,
  TableFilter_Range_AmountRequested: 'Amount Requested',
  TableFilter_Range_Duration: 'Amount Requested',
  TableFilter_Text_Type_Includes: 'Type includes:',
  TableFilter_Text_Status_Includes: 'Status includes:',
  TableFilter_Text_LastModified_Includes: 'Last Modified includes:',
  TableFilter_Text_RequestedDate_Includes: 'Requested Date includes:',
  TableFilter_Text_ReceiptDate_Includes: 'Receipt Date includes:',
  TableFilter_Text_ReceiptNote_Includes: 'Receipt Note includes:',
  TableFilter_Text_SubmissionDate_Includes: 'Submission Date includes:',
  TableFilter_Text_SubmittedBy_Includes: 'Submitted By includes:',
  TableFilter_Text_RegionName_Includes: 'Region Name includes:',
  TableFilter_Text_VendorName_Includes: 'Vendor Name includes:',
  TableFilter_Text_CustomerName_Includes: 'Customer Name includes:',
  TableFilter_Text_Total_Equals: 'Total equals:',
  TableFilter_Text_Balance_Equals: 'Balance equals:',
  Button_Cancel: 'Cancel',
  Button_Submit: 'Submit',
}

export const DrawerStrings = {
  Button_Close: 'Close',
  Button_Cancel: 'Cancel',
  Button_Submit: 'Submit',
  Button_Back: 'Back',
  Button_Next: 'Next',
  DocumentTemplate_Title_Create: 'Create Document Template',
  DocumentTemplate_Title_Update: 'Update Document Template',
  DocumentTemplate_TextBox_Name: 'Name',
  DocumentTemplate_ListBox_Carrier: 'Carrier',
  DocumentTemplate_TextBox_ReasonForUpdate: 'Reason for Update',
  DocumentTemplate_Label_WordDocument: 'Word Document',
  DocumentTemplate_Label_ReplaceDocument: 'Replace Document?',
  DocumentTemplate_Button_SelectFile: 'Select file',
  DocumentTemplate_Label_Hint: 'Drop files here or click to browse (max 1 files)',
  NoteTemplate_Title_Create: 'Create Note Template',
  NoteTemplate_Title_Update: 'Update Note Template',
  NoteTemplate_TextBox_Name: 'Name',
  NoteTemplate_TextArea_Name: 'Template',
  CreateNote_Title_Create: 'Create Note Template',
  CreateNote_Title_Update: 'Update Note Template',
  CreateNote_TextBox_Name: 'Name',
  CreateNote_TextBox_Template: 'Template',
  UpdateCallbackStatus_Title: 'Update Callback Status',
  UpdateCallbackStatus_ListBox_SelectStatus: 'Select Status',
  UpdateCallbackStatus_Button_RefetchTemplates: 'Refetch templates.',
  UpdateCallbackStatus_Button_GoToTemplates: 'Go to templates.',
  UpdateCallbackStatus_TextBox_NoteTitle: 'Note Title',
  UpdateCallbackStatus_Status_InvalidValue:
    'Invalid value. Expected: Requested, Completed, Pending, or Attempted.',
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
  RelatedTagKey_Title: 'Tag Key:',
  UpdateAllMessages_Title: 'Update All Messages',
  UpdateAllMessages_ListBox_MessageStatus: 'Message Status',
  AddTimelineEvent_Title: 'Add Timeline Event',
  AddTimelineEvent_ListBox_EventType: 'Event Type',
  AddTimelineEvent_Note: 'Note:',
  AddTimelineEvent_NoteDescription:
    'After submitting a timeline event, it may take a few seconds for the event to appear in the timeline.',
  AddTimelineEvent_PublishingEventsNote: 'Publishing Events to Redacted1',
  AddTimelineEvent_PublishingEventsNoteDescription:
    'Selecting this option will publish this to Redacted1, where it will be visible on the claim in that system.',
  AddTimelineEvent_Checkbox_Publish: 'Would you like to publish this event to XA?',
  AddTimelineEvent_EventType_InvalidValue:
    'Invalid value. Expected: Customer Contacted, Customer Contacted - LVM, Customer Contacted - Email, Customer No Contact, Invalid Contact Information, Inspection Completed, Job Completed, Job Not Sold, Job Sold, Job Started, QA Approved, QA Approved Preliminary Report, QA Approved Supplement Report, QA Rejected, or Reinspection/Revision Requested.',
  AddTimelineEvent_Button_RefetchTemplates: 'Refetch templates.',
  AddTimelineEvent_Button_GoToTemplates: 'Go to templates.',
  AddTimelineEvent_TextBox_NoteTitle: 'Note Title',
  RecordCustomerCommunication_TypeOfCommunication_InvalidValue:
    'Invalid value. Expected: Customer Contacted - Email, Customer Contacted - Left Voicemail, Customer No Contact, Initial Customer Contact Attempted, Initial Customer Contact Failed, Initial Customer Contact Success, or Invalid Contact Information.',
  SetPortalAccessExpiration_Title: 'Set expiration date & time for portal:',
  SetPortalAccessExpiration_DateLabel: 'Expiration Date (Timezone: America/Los Angeles)',
  SetPortalAccessExpiration_Button_RefetchTemplates: 'Refetch templates.',
  SetPortalAccessExpiration_Button_GoToTemplates: 'Go to templates.',
  SetPortalAccessExpiration_TextBox_NoteTitle: 'Note Title',
  AddPersonToPortal_Title: 'Add Person to Portal',
  AddPersonToPortal_Button_RefetchTemplates: 'Refetch templates.',
  AddPersonToPortal_Button_GoToTemplates: 'Go to templates.',
  AddPersonToPortal_TextBox_NoteTitle: 'Note Title',
  UpdateDocumentInformation_Title: 'Update Document Information',
  UpdateDocumentInformation_Link_OpenDocumentPreview: 'Open Document Preview',
  UpdateDocumentInformation_Button_RotateLeft: 'Rotate Left',
  UpdateDocumentInformation_Button_SaveRotation: 'Save',
  UpdateDocumentInformation_Button_RotateRight: 'Rotate Right',
  ExportDocument_Title: 'Export 1 Document',
  ExportMedia_Title: 'Export <NUMBER> Media',
  MakeDocumentsVisibleToAdditionalGroups_Title: 'Make Documents Visible to Additional Groups',
  MakeMediasVisibleToAdditionalGroups_Title: 'Make Medias Visible to Additional Groups',
  RecordCustomerCommunication_Title: 'Record Customer Communication',
  UpdateClaim_Title: 'Update Claim',
  CloseClaim_Title: 'Close Claim',
  CreateNote_Title: 'Create Note',
  CreateNote_Button_OpenInNewTab: 'Open in New Tab',
  CreateNote_Button_RefetchTemplates: 'Refetch templates.',
  CreateNote_Button_GoToTemplates: 'Go to templates.',
  CreateNote_TextBox_NoteTitle: 'Note Title',
  CreateNote_Button_InsertMention: 'Insert Mention',
  CreateNote_Button_InsertParameter: 'Insert Parameter',
  ExportNote_Title: 'Export Note',
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
  CreateJob_Title: 'Create Job',
  CreateJob_Button_PrefillLossLocation: 'Prefill Loss Location From Claim',
  CreateJob_TextBox_AddressLine1: 'Address Line 1',
  CreateJob_TextBox_AddressLine2: 'Address Line 2',
  CreateJob_TextBox_AddressLine3: 'Address Line 3',
  CreateJob_TextBox_City: 'City',
  CreateJob_TextBox_ZipCode: 'Zip Code',
  CreateJob_TextBox_County: 'County',
  EditInspection_Title: 'Edit inspection for <CLAIM> started at <STARTED>',
  EditInspection_TextBox_Description: 'Description',
  UpdateProfileImageDrawer_Title: 'Update Profile Image',
  UpdateProfileImageDrawer_Button_RemoveAllFiles: 'Remove All Files',
  UserSettingsDrawer_Title: 'User Settings',
  BreakTimeSettingsDrawer_Title: 'Break Time Settings',
  AddLossOfUseDrawer_Title: 'Add Loss of Use',
  AddLossOfUseDrawer_Button_AddRow: 'Add Row',
  AddLossOfUseDrawer_Button_RemoveRow: 'Remove Row',
  UpdateLossOfUseStatus_Title: 'Update Loss of Use Status',
  AddLossOfUseReceipt_Title: 'Add Loss of Use Receipt',
  AddLossOfUseReceipt_Button_RefetchDocuments: 'Refetch Documents',
  AddLossOfUseReceipt_Link_UploadDocuments: 'Upload Documents',
  RegionPricing_Title_Create: 'Create Region Pricing',
  RegionPricing_Title_Update: 'Update Region Pricing',
  RegionPricing_TextBox_SurtaxRate: 'Surtax Rate (decimal)',
  RegionPricing_TextBox_BaseRates_DuringBusinessHours: 'During Business Hours',
  RegionPricing_TextBox_BaseRates_AfterBusinessHours: 'After Business Hours',
  RegionPricing_TextBox_RoofPitchRates_Under7_12: 'Under 7/12',
  RegionPricing_TextBox_RoofPitchRates_7_12To9_12: '7/12 to 9/12',
  RegionPricing_TextBox_RoofPitchRates_10_12To12_12: '10/12 to 12/12',
  RegionPricing_TextBox_RoofPitchRates_Over12_12: 'Over 12/12',
  RegionPricing_TextBox_RoofPitchRates_HighPitchRate: 'High Roof Rate',
  RegionPricing_TextBox_TarpingRates_Mechanical_DuringBusinessHours: 'During Business Hours',
  RegionPricing_TextBox_TarpingRates_Mechanical_AfterBusinessHours: 'After Business Hours',
  RegionPricing_TextBox_TarpingRates_Mechanical_MaterialCost: 'Material Cost',
  RegionPricing_TextBox_TarpingRates_Sandbag_DuringBusinessHours: 'During Business Hours',
  RegionPricing_TextBox_TarpingRates_Sandbag_AfterBusinessHours: 'After Business Hours',
  RegionPricing_TextBox_TarpingRates_Sandbag_MaterialCosts: 'Material Cost',
  VendorRates_Title_Create: 'Create Vendor Rates',
  VendorRates_Title_Update: 'Update Rates for ',
  VendorRates_Checkbox_IsThisATemplate: 'Is this a Template?',
  UploadRegionsCSV_Title: 'Upload Regions CSV',
  UploadRegionsCSV_Description:
    'In order to bulk update regions, a properly formatted CSV is required. You can download all the current regions as a CSV and edit that file with any updates you have.',
  UploadRegionsCSV_Button_DownloadRegionsCSV: 'Download Regions CSV',
  UploadRegionsCSV_Button_RemoveAllFiles: 'Remove All Files',
  UploadVendorRatesCSV_Title: 'Upload Vendor Rates CSV',
  UploadVendorRatesCSV_Description:
    'In order to bulk update vendor rates, a properly formatted CSV is required. You can download all the current vendor rates as a CSV and edit that file with any updates you have.',
  UploadVendorRatesCSV_Button_DownloadVendorRatesCSV: 'Download Vendor Rates CSV',
  UploadVendorRatesCSV_Button_RemoveAllFiles: 'Remove All Files',
  ScheduleAppointment_Title: 'Schedule Appointment',
  ScheduleAppointment_Button_RemoveRow: 'Remove Row',
  CreateJobBill_Title: 'Create a Job Bill',
  CreateJobBill_SelectRegionAndVendorToSeeBill:
    'Select region and vendor rates to see calculated bill',
  CreateJobInvoice_Title: 'Create a Job Invoice',
  CreateJobInvoice_SelectRegionAndVendorToSeeInvoice:
    'Select region and vendor rates to see calculated invoice',
  MarkJobStarted_Title: 'Mark Job Started',
  CloseJob_Title: 'Close Job',
  RecordCustomerContactAttempt_Title: 'Record Customer Contact Attempt',
  AddJobWorkDetails_Title: 'Enter Work Details for Job',
  AddJobWorkDetails_Checkbox_IsMultiStory: 'Was 2 or more stories?',
  AddJobWorkDetails_Button_RefetchDocuments: 'Refetch Documents',
  AddJobWorkDetails_Link_UploadDocuments: 'Upload Documents',
  AddRemovedPhotos_Title: 'Add Removed Photos',
  AddRemovedPhotos_Checkbox_SelectAll: 'Select All',
}

export enum InspectorRoleOptions {
  FieldAgent = 'Field Agent',
  InspectionTech = 'Inspection Tech',
}

export const ReportPortalIssuesPageStrings = {
  Title: 'Report Portal Issues',
}

export enum ClaimAssignContactOptions {
  Coordinator = 'Coordinator',
  FieldAgent = 'Field Agent',
  ProgramManager = 'Program Manager',
  Reviewer = 'Reviewer',
}

export enum ContactAssignmentOptions {
  Coordinator = 'Coordinator',
  DeskAdjuster = 'Desk Adjuster',
  FieldAgent = 'Field Agent',
  InspectionTech = 'Inspection Tech',
  ProgramManager = 'Program Manager',
  Reviewer = 'Reviewer',
}

export enum JobAssignContactOptions {
  Approver = 'Approver',
  Coordinator = 'Coordinator',
  Dispatcher = 'Dispatcher',
  FieldTech = 'Field Tech',
  ProjectManager = 'Project Manager',
  Subcontractor = 'Subcontractor',
}

export enum EmergencyServiceJobServiceTypes {
  Tarping = 'Tarping',
  WaterMitigation = 'Water Mitigation',
  BoardUp = 'Board Up',
}

export enum DailyJobServiceTypes {
  Exterior = 'Exterior',
  Interior = 'Interior',
  Roof = 'Roof',
  DetachedStructures = 'Detached Structures',
}

export const ClaimsPortalPageStrings = {
  Title: 'Claims Portal',
  Link_CreateClaim: 'Create Claim',
  View_Views: 'Views',
  Filter_ClaimFilters: 'Filters',
  ActionMenuAria: 'Open claim menu',
  ActionMenu: 'actionMenu',
}

export enum ClaimTabTypes {
  Info,
  PortalAccess,
  Contacts,
  LossOfUse,
  Schedule,
  Estimates,
  Documents,
  Media,
  Notes,
  Jobs,
  CallbackRequests,
  Inspections,
}

export enum JobTabTypes {
  Info,
  PortalAccess,
  Contacts,
  Billing,
  WorkAuthorizations,
  Appointments,
  Documents,
  Media,
  Notes,
  CallbackRequests,
  Inspections,
}

export enum PricingTabTypes {
  Regions,
  VendorRates,
}

export enum TemplateTabTypes {
  Document,
  Note,
  Communication,
}

export enum CannedClaimTypes {
  DefaultTestClaim,
  RedactedClaim,
  DocumentStashClaim,
}

export enum CannedJobTypes {
  DefaultTestJob,
  TestOne,
  NoClaimNoContact,
}

export enum CannedRegionPricingTypes {
  DefaultRegionPricing,
}

export enum CannedVendorRatesPricingTypes {
  DefaultVendorRatesPricing,
  DefaultVendorRatesPricingTemplate,
}

export const ClaimPageStrings = {
  Badge_Claim: 'CLAIM',
  Badge_ReadOnly: 'Read-only',
  Tab_Info: 'Info',
  Tab_PortalAccess: 'Portal Access',
  Tab_Contacts: 'Contacts',
  Tab_LossOfUse: 'Loss of Use',
  Tab_Schedule: 'Schedule',
  Tab_Estimates: 'Estimates',
  Tab_Documents: 'Documents',
  Tab_Media: 'Media',
  Tab_Notes: 'Notes',
  Tab_Jobs: 'Jobs',
  Tab_CallbackRequests: 'Callback Requests',
  Tab_Inspections: 'Inspections',
  Link_YourClaims: '← Your Claims',
  Link_AllClaims: '← All Claims',
  Button_CantPublish: `Can't Publish`,
  Button_Actions: 'Actions',
  MenuItem_Actions_AddCommunication: 'Add Communication',
  MenuItem_Actions_AddNote: 'Add Note',
  MenuItem_Actions_AddTags: 'Add Tags',
  MenuItem_Actions_StartInspection: 'Start Inspection',
  MenuItem_Actions_UpdateClaim: 'Update Claim',
  MenuItem_Actions_UploadFiles: 'Upload Files',
  MenuItem_Actions_CloseClaim: ' Close Claim',
}

export const ClaimInfoTabStrings = {
  Title_BasicInfo: 'Basic Info',
  Label_ClaimNumber: 'Claim Number',
  Label_PolicyNumber: 'Policy Number',
  Label_DataSource: 'Data Source',
  Label_ImportStatus: 'Import Status',
  Label_RedactedID: 'Redacted ID',
  Label_Redacted1ID: 'Redacted1 ID',
  Label_Carrier: 'Carrier',
  Label_Coordinator: 'Coordinator',
  Label_FieldAgent: 'Field Agent',
  Label_ProjectManager: 'Project Manager',
  Label_Reviewer: 'Reviewer',
  Label_HasLegalRep: 'Has Legal Rep',
  Label_HasJob: 'Has Job',
  Label_ClaimStatus: 'Claim Status',
  Title_LossInformation: 'Loss Information',
  Label_LossDate: 'Loss Date',
  Label_LossType: 'Loss Type',
  Label_CATCode: 'CAT Code',
  Label_ClaimFactors: 'Claim Factors',
  Label_InitialClaimActions: 'Initial Claim Actions',
  Label_LossDescription: 'Loss Description',
  Title_LossLossLocation: 'Loss Location',
  Label_AddressType: 'Address Type',
  Label_Street: 'Street',
  Label_SecondaryStreet: 'Secondary Street',
  Label_City: 'City',
  Label_County: 'County',
  Label_State: 'State',
  Label_ZIPCode: 'ZIP Code',
  Label_Map: 'Map',
  Title_ContactInformation: 'Contact Information',
  Label_Name: 'Name',
  Label_Phone: 'Phone',
  Label_Email: 'Email',
  Title_ClaimReviews: 'Claim Reviews',
  Label_NoReviews: 'This claim has no pending reviews.',
  Label_FlaggedForReview: 'This claim has been flagged for review',
  Label_FlaggedDescriptionPrefix: 'This claim was flagged for review on ',
  Label_FlaggedDescription:
    'This claim was flagged for review on <FLAGGED_DATETIME> by <FLAGGED_BY>.',
  Button_FlagClaimForReview: 'Flag Claim for Review',
  Button_ViewReviewHistory: 'View Review History',
  Button_CompleteReview: 'Complete Review',
  Button_ReadNotes: 'Read Notes',
  Title_Actions: 'Actions',
  Button_CantPublish: `Can't Publish`,
  Button_PublishToRedacted: 'Publish to Redacted',
  Button_AddCommunication: 'Add Communication',
  Button_AddNote: 'Add Note',
  Button_AddTags: 'Add Tags',
  Link_GenerateDocument: 'Generate Document',
  Button_StartInspection: 'Start Insppection',
  Button_UpdateClaim: 'Update Claim',
  Button_UploadFiles: 'Upload Files',
  Button_CloseClaim: 'Close Claim',
  Button_ReopenClaim: 'Reopen Claim',
  Title_ClaimTimeline: 'Claim Timeline',
}

export const JobPageStrings = {
  Badge: 'JOB',
  Tab_Info: 'Info',
  Tab_PortalAccess: 'Portal Access',
  Tab_Contacts: 'Contacts',
  Tab_WorkAuthorizations: 'Work Authorizations',
  Tab_Documents: 'Documents',
  Tab_Media: 'Media',
  Tab_Notes: 'Notes',
  Tab_CallbackRequests: 'Callback Requests',
  Tab_Inspections: 'Inspections',
  Link_AllJobs: '← All Jobs',
  Button_Actions: 'Actions',
  MenuItem_Actions_AddNote: 'Add Note',
  MenuItem_Actions_AddPersonToJobPortal: 'Add Person to Job Portal',
  MenuItem_Actions_AddTags: 'Add Tags',
  MenuItem_Actions_CreateContact: 'Create Contact',
  MenuItem_Actions_CustomerContactAttempted: 'Customer Contact Attempted',
  MenuItem_Actions_MarkAsStarted: 'Mark As Started',
  MenuItem_Actions_StartInspection: 'Start Inspection',
  MenuItem_Actions_UpdateJob: 'Update Job',
  MenuItem_Actions_UploadDocumentsMedia: 'Upload Documents/Media',
  MenuItem_Actions_RecordTarpingWork: 'Record Tarping Work',
  MenuItem_Actions_CloseJob: ' Close Job',
}

export const PortalAccessTabStrings = {
  Title: 'Portal Access',
  Button_AddPersonToPortal: 'Add Person to Portal',
  ActionMenuAria: 'Open portal menu',
  ActionMenu: 'actionMenu',
}

export const WorkAuthorizationsTabStrings = {
  Title: 'Work Authorizations',
  Link_SendWorkAuthorization: 'Send Work Authorization',
  ActionMenuAria: 'Open claim menu',
  ActionMenu: 'actionMenu',
}

export const WorkAuthorizationCreateTabStrings = {
  StepOne_Title: 'Select Template',
  StepTwo_Title: 'Fill Out Template Fields',
  Button_Next: 'Next',
  Button_Back: 'Back',
}

export const InspectionsTabStrings = {
  Title: 'Inspections',
  Link_StartNewInspection: 'Start New Inspection',
  ActionMenuAria: 'Open inpection menu',
  ActionMenu: 'actionMenu',
}

export const InspectionDetailsTabStrings = {
  Button_GetShareLink: 'Get Share Link',
  Button_Screenshot: 'Screenshot',
  InspectionVideo_Title: 'Inspection Video',
}

export const JobsTabStrings = {
  Title: 'Jobs',
  Button_CreateJob: 'Create Job',
  ActionMenuAria: 'Open job menu',
  ActionMenu: 'actionMenu',
}

export const ContactsTabStrings = {
  Title_Contacts: 'Contacts',
  Title_RemovedContacts: 'Removed Contacts',
  Button_AssignContact: 'Assign Contact',
  MenuItem_AssignCoordinator: 'Assign Coordinator',
  MenuItem_AssignDeskAdjuster: 'Assign Desk Adjuster',
  MenuItem_AssignFieldAgent: 'Assign Field Agent',
  MenuItem_AssignInspectionTech: 'Assign Inspection Tech',
  MenuItem_AssignProjectManager: 'Assign Project Manager',
  MenuItem_AssignReviewer: 'Assign Reviewer',
  Button_CreateContact: 'Create Contact',
  Button_AddCarrier: 'Add Carrier',
  Button_UpdateCarrier: 'Update Carrier',
  ActionMenuAria: 'Open contact menu',
  ActionMenu: 'actionMenu',
}

export const LossOfUseTabStrings = {
  Title_LossOfUse: 'Loss of Use',
  Button_AddLossOfUse: 'Add Loss of Use',
  ActionMenuAria: '',
  ActionMenu: 'actionMenu',
}

export const ScheduleTabStrings = {
  Title_InspectionsSchedule: 'Inspections Schedule',
  Button_RequestInspection: 'Request Inspection',
  Button_ScheduleInspection: 'Schedule Inspection',
  Button_Previous: 'Previous',
  Button_Next: 'Next',
  Button_ScheduleRequestedInspection: 'Schedule Requested Inspection',
  Button_CancelInspectionRequest: 'Cancel Inspection Request',
}

export const LossOfUseDetailsPageStrings = {
  Title_LossOfUseInfo: 'Loss of Use Info',
  Button_BackToLossOfUse: '← Loss of Use',
  Button_UpdateStatus: 'Update Status',
  Button_AddReceipt: 'Add Receipt',
  ActionMenuAria: '',
  ActionMenu: 'actionMenu',
}

export const CallbackRequestsTabStrings = {
  Title_Callbacks: 'Callbacks',
  ActionMenuAria: 'Open callback request menu',
  ActionMenu: 'actionMenu',
}

export const DocumentsTabStrings = {
  Title: 'Documents',
  Button_CreateDocuments: 'Create Documents',
  MenuItem_CreatePhotoReport: 'Create Photo Report',
  MenuItem_GenerateDraftDocument: 'Generate Draft Document',
  Link_UploadDocuments: 'Upload Documents',
  ActionMenuAria: 'Open document menu',
  ActionMenu: 'actionMenu',
}

export const EstimatesTabStrings = {
  Title_Estimates: 'Estimates',
  ActionMenuAria: 'Open estimate menu',
  ActionMenu: 'actionMenu',
}

export const MediaTabStrings = {
  Title: 'Media',
  Button_ViewMedia: 'View Media',
  Button_DownloadAllImages: 'Download All Images',
  Link_CreatePhotoReport: 'Create Photo Report',
  Link_UploadMedia: 'Upload Media',
  ActionMenuAria: 'Open document menu',
  ActionMenu: 'actionMenu',
}

export const UploadTabStrings = {
  Title: 'Upload files',
  Instructions: 'Drag and drop files here or click to browse',
  FileTypes: 'Video, Image, PDF, Word, Excel, Xactimate up to 1GB each (max 100 files)',
  Button_SelectFiles: 'Select files',
  Button_Submit: 'Submit',
  Button_ClearAll: 'Clear all',
  ValidationErrorTitle: 'File upload error(s)',
}

export const FileCardStrings = {
  Label_Title: 'Title',
  Label_FileDescription: 'File Description',
}

export const GenerateDocumentTabStrings = {
  Title: 'Generate Draft Document',
  Label_SearchTemplates: 'Search Templates',
  Label_SelectTemplate: 'Select Template',
  Button_StartGenerationOfDocument: 'Start Generation of Document',
  Label_NoTemplatesMatchSearch: 'No templates match search',
  Label_NoTemplatesFoundAlert_Title: 'No templates found',
  Label_NoTemplatesFoundAlert_Description:
    'There are no document templates for the carrier that this claim is assigned to.',
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

export const PhotoReportTabStrings = {
  Label_PhotoReportGuide_Title: 'Photo Report Guide',
  Label_PhotoReportGuide_Description:
    'By default, photos in the photo report will be grouped & sorted by their label, with unlabeled photos at the bottom of the report. Photos will be sorted by their timestamp within each group. You may also choose to sort photos by just their timestamps by choosing the "Sort By: Timestamp" option in the sorting menu (click the  button to access it). Photos and groups can be rearranged by dragging and dropping them (click & hold the  to drag them).New groups can be added using the "Add Group" button and groups can be renamed by using the edit button next to their title (). Photo titles & descriptions can be edited using the "Edit Photo" button.Note: Groups will not be shown in the downloaded Photo Report. These are merely a convenience feature when creating the photo report.Multiple photos can be dragged at the same time; select the checkbox next to each photo that you would like to drag at the same time, then click and drag one of the photos (using the  button) to the new location, and all selected photos will be moved.Groups and photos can be removed by clicking the  button. Photos can be re-added by opening the action menu (click the  button) and clicking the "Re-Add Photos" button, which will open a modal and allow to select which photos you would like to re-add. Photos will be re-added to their original group (based on their label); if that group was removed, it will be re-added to the end of the photo report.Both groups and photos can be collapsed to make it easier to move them around. Use the "Collapse Photos" & "Collapse Groups" buttons to do so. Each group can be individually collapsed using its  button.The photo report can be reset to its original state by using the "Reset" button in the action menu (click the  button to open the action menu).You can toggle these instructions by clicking the  button.',
  Button_SubmitPhotoReport: 'Submit Photo Report',
  Link_DownloadLastPhotoReport: 'Download Last Photo Report',
  Button_AddGroup: 'Add Group',
  Button_DeselectAll: 'Deselect All',
  Button_CollapsePhotos: 'Collapse Photos',
  Button_CollapseGroups: 'Collapse Groups',
  Button_ExpandPhotos: 'Expand Photos',
  Button_ExpandGroups: 'Expand Groups',
  Label_Empty_Description: 'No photos have been uploaded',
}

export const PhotoReportCardStrings = {
  Label_Title: 'Title',
  Label_Label: 'Label',
  Label_TimeTaken: 'Time Taken',
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

export const JobTimelineTabStrings = {
  Title: 'Job Timeline',
  Link_RecordJobEvent: 'Record Job Event',
}

export const ClaimTimelineTabStrings = {
  Title: 'Claim Timeline',
}

export const AppointmentsTabStrings = {
  Title_Appointments: 'Appointments',
  Button_ScheduleAppointment: 'Schedule Appointment',
  Button_Previous: 'Previous',
  Button_Next: 'Next',
}

export const BillingTabStrings = {
  Button_CreateBill: 'Create Bill',
  Button_CreateInvoice: 'Create Invoice',
}

export const JobTimelineNewEventTabStrings = {
  Title: 'Create Job Timeline Event',
  Button_Next: 'Next',
}

export const NotesTabStrings = {
  Title: 'Notes',
  Button_FilterNotes: 'Filter Notes',
  Label_NoNotesHaveBeenAdded_Title: 'No notes have been added',
  Label_NoNotesHaveBeenAdded_Description:
    'Notes can be added to provide internal updates on this claim.',
  Button_NoNotes_AddNote: 'Add Note',
  Label_NoNotesMatch: 'No notes found that match your search input.',
}

export const JobInfoTabStrings = {
  Title_JobDetails: 'Job Details',
  Label_JobNumber: 'Job Number',
  Label_AssociatedClaim: 'Associated Claim',
  Label_Type: 'Type',
  Label_Services: 'Services',
  Label_Description: 'Description',
  Title_JobAssignments: 'Job Assignments',
  Label_Coordinator: 'Coordinator',
  Label_ProjectManager: 'Project Manager',
  Label_Approver: 'Approver',
  Label_Dispatcher: 'Dispatcher',
  Label_Subcontractor: 'Subcontractor',
  Label_FieldTech: 'Field Tech',
  Label_Alert_OnlyOneSubOrTechCanBeAssigned:
    'Only one subcontractor or field technician can be assigned to a job at a time.',
  Title_JobLocation: 'Job Location',
  Label_AddressLine1: 'Address Line 1',
  Label_AddressLine2: 'Address Line 2',
  Label_AddressType: 'Address Type',
  Label_City: 'City',
  Label_County: 'County',
  Label_State: 'State',
  Label_ZIPCode: 'ZIP Code',
  Label_Map: 'Google Maps',
  Title_ContactInformation: 'Contact Information',
  Label_Name: 'Name',
  Label_Phone: 'Phone',
  Label_Email: 'Email',
  Title_WorkDetails: 'Work Details',
  Label_WorkType: 'Work Type',
  Label_TarpArea: 'Tarp Area',
  Label_TimeOfService: 'Time of Service',
  Label_FastenerType: 'Fastener Type',
  Label_RoofPitch: 'Roof Pitch',
  Label_ServiceDate: 'Service Date',
  Label_HighRoof: '2 or More Stories?',
  Label_PhotoReport: 'Photo Report',
  Label_NoWorkDetails_Title: 'Record Your Work Details',
  Label_NoWorkDetails_Description:
    'No work details have been recorded for this job. In order to ensure you are compensated for your work, please enter all the details for the work that you have done.',
  Button_Download: 'Download',
  Title_WorkAuthorization: 'Work Authorization',
  Label_Alert_NoWorkAuthorization: 'No work authorization has been created for this job',
  Link_SendWorkAuthorization: 'Send Work Authorization',
  Label_Status: 'Status',
  Label_SentDate: 'Sent Date',
  Label_SentMethod: 'Sent Method',
  Label_Recipient: 'Recipient',
  Label_EffectiveDate: 'Effective Date',
  Label_Signer: 'Signer',
  Label_ApprovedBy: 'Approved By',
  Button_Remind: 'Remind',
  Button_Recall: 'Recall',
  Title_JobTimeline: 'Job Timeline',
  Button_MarkAsStarted: 'Mark as Started',
  Button_CloseJob: 'Close Job',
  Button_CustomerContactAttempted: 'Customer Contact Attempted',
  Button_UpdateWorkDetails: 'Update Work Details',
  Button_RecordWorkDetails: 'Record Work Details',
  MenuItem_RecordTarpingWork: 'Record Tarping Work',
}

export const JobsPageStrings = {
  Title: 'Jobs Dashboard',
  Filter_JobFilters: 'Filters',
  Button_CreateJob: 'Create Job',
  ActionMenuAria: 'Open job menu',
  ActionMenu: 'actionMenu',
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

export const MessageStrings = {
  Button_MarkAsRead: 'Mark As Read',
  Button_MarkAsUnread: 'Mark As Unread',
  Button_Archive: 'Archive',
}

export const CreateClaimPageStrings = {
  Title: 'Create a Claim',
  Button_Submit: 'Submit',
}

export const TagsPageStrings = {
  Title: 'Tag Keys',
  Button_CreateNoteTemplate: 'Create Note Template',
  ActionMenu: 'actionMenu',
  Title_UpdateNoteTemplate: 'Update Note Template',
}

export const TemplatePageStrings = {
  Title: 'Document Templates',
  Button_CreateNoteTemplate: 'Create Note Template',
  ActionMenuAria: 'Open claim menu',
  ActionMenu: 'actionMenu',
  Title_UpdateNoteTemplate: 'Update Note Template',
}

export const TemplatePageNewStrings = {
  Link_DocumentTemplatesTab: 'Document Templates',
  Link_NoteTemplatesTab: 'Note Templates',
  Link_CommunicationTemplatesTab: 'Communication Templates',
}

export const TemplatesDocumentTabStrings = {
  Title: 'Document Templates',
  CommunicationTemplatesTitle: 'Communication Templates',
  Button_CreateDocumentTemplate: 'Create Document Template',
}

export const TemplatesNoteTabStrings = {
  Title: 'Note Templates',
  Button_CreateNoteTemplate: 'Create Note Template',
}

export const TemplatesCommunicationTabStrings = {
  Title: 'Communication Templates',
}

export const PricingPageStrings = {
  Tab_Regions: 'Regions',
  Tab_VendorRates: 'Vendor Rates',
}

export const PricingRegionsTabStrings = {
  Title: 'Regions',
  Button_DownloadCSV: 'Download CSV',
  Button_BulkUpdateRegions: 'Bulk Update Regions',
  Button_AddRegion: 'Add Region',
  ActionMenuAria: 'Open menu',
  ActionMenu: 'actionMenu',
}

export const PricingVendorRatesTabStrings = {
  Title: 'Vendor Rates',
  Button_DownloadCSV: 'Download CSV',
  Button_BulkUpdateVendorRates: 'Bulk Update Vendor Rates',
  Button_AddVendorRates: 'Add Vendor Rates',
  ActionMenuAria: 'Open menu',
  ActionMenu: 'actionMenu',
}

export const CallbacksPageStrings = {
  Title: 'Active Callbacks',
  Label_Table: 'Callbacks',
  ActionMenuAria: 'Open callback request menu',
  ActionMenu: 'actionMenu',
}

export const GlobalBooksPageStrings = {
  Title: 'Global Books',
  ActionMenuAria: 'Open book menu',
  ActionMenu: 'actionMenu',
}

export const ContactBookPageStrings = {
  Link_GlobalBooks: '← Global Books',
  Button_CreateContact: 'Create Contact',
  ActionMenuAria: 'Open contact menu',
  ActionMenu: 'actionMenu',
}

export const EstimatorSchedulesPageStrings = {
  Title: 'Estimator Schedules',
  ListBox_SelectEstimators: 'Select Estimator(s)',
  ListBox_SelectEstimators_Placeholder: 'Select...',
  Button_Previous: 'Previous',
  Button_Next: 'Next',
  Warning_NoInspectionsFound: 'No inspections found for estimator.',
  Button_ClearSelection: 'Clear selected options',
  Tooltip_Contact_Primary: 'Primary Contact',
  Tooltip_Contact_Policyholder: 'Policyholder',
  Tooltip_Contact_Dual: 'Primary Contact/Policyholder',
  Tooltip_Claim_Number: 'Claim Number',
  Tooltip_Field_Agent: 'Field Agent',
  Tooltip_Inspection_Tech: 'Inspection Tech',
}

export const HomePageStrings = {
  Title: 'Home',
  ActionMenuAria: 'Open claim menu',
  ActionMenu: 'actionMenu',
  Filter_AssignedClaims: 'Assigned Claims Filters',
  Table_AssignedClaims: 'Your Assigned Claims',
  Table_UnassignedClaims: 'Unassigned Claims',
  Button_All: 'All',
  Button_CoordinatorReview: 'Coordinator Review',
  Alert_FiltersInclude: 'Assigned Claims Filters will always include claims assigned to you.',
  Label_Admin_Welcome: 'Welcome to the Claims Portal, Brad Peterson.',
  Label_Admin_GetStarted:
    'Get started working in the Claims Portal by checking out some of the areas below.',
  Label_Admin_MainEntities: 'Main Entities',
  Label_Admin_Messaging: 'Messaging',
  Label_Admin_AdminArea: 'Admin Area',
  Link_Admin_Claims: 'Claims',
  Link_Admin_Jobs: 'Jobs',
  Link_Admin_CallbackRequests: 'Callback Requests',
  Link_Admin_Inbox: 'Inbox',
  Link_Admin_Contacts: 'Contacts',
  Link_Admin_EstimatorSchedules: 'Estimator Schedules',
  Link_Admin_Tags: 'Tags',
  Link_Admin_Templates: 'Templates',
}

export const EstimateDetailsPageStrings = {
  Title_Summary: 'Summary',
  Title_Details: 'Details',
  Label_Details_ID: 'ID',
  Label_Details_Type: 'Type',
  Label_Details_ExternalSource: 'External Source',
  Label_Details_ExternalSourceID: 'External Source ID',
  Label_Details_SubmissionDate: 'Submission Date',
  Label_Details_SubmittedBy: 'Submitted By',
  Title_Notes: 'Notes',
  Title_ClaimDocuments: 'Claim Documents',
  Title_Reviews: 'Reviews',
  Button_BackToEstimates: '← Estimates',
}

export const VendorRatesTemplateDetailPage = {
  Button_BackToVendorRates: '← Vendor Rates',
  Badge_Template: 'Template',
  Title_RatesInfo: 'Rates Info',
  Title_MechanicalTarpingRates: 'Mechanical Tarping Rates',
  Label_MechanicalTarpingRates_DuringBusinessHours: 'During Business Hours',
  Label_MechanicalTarpingRates_AfterBusinessHours: 'After Business Hours',
  Label_MechanicalTarpingRates_MaterialCost: 'Material Cost',
  Title_SandbagTarpingRates: 'Sandbag Tarping Rates',
  Label_SandbagTarpingRates_DuringBusinessHours: 'During Business Hours',
  Label_SandbagTarpingRates_AfterBusinessHours: 'After Business Hours',
  Label_SandbagTarpingRates_MaterialCost: 'Material Cost',
  Button_EditTemplateRates: 'Edit Template Rates',
}

export const VendorRatesDetailPage = {
  Button_BackToVendorRates: '← Vendor Rates',
  Badge_Vendor: 'Vendor',
  Title_RatesInfo: 'Rates Info',
  Title_MechanicalTarpingRates: 'Mechanical Tarping Rates',
  Label_MechanicalTarpingRates_DuringBusinessHours: 'During Business Hours',
  Label_MechanicalTarpingRates_AfterBusinessHours: 'After Business Hours',
  Label_MechanicalTarpingRates_MaterialCost: 'Material Cost',
  Title_SandbagTarpingRates: 'Sandbag Tarping Rates',
  Label_SandbagTarpingRates_DuringBusinessHours: 'During Business Hours',
  Label_SandbagTarpingRates_AfterBusinessHours: 'After Business Hours',
  Label_SandbagTarpingRates_MaterialCost: 'Material Cost',
  Button_EditVendorRates: 'Edit Vendor Rates',
  Button_EditTemplateRates: 'Edit Template Rates',
  Title_AssignedVendors: 'Assigned Vendors',
}

export const BillDetailsPage = {
  Button_BackToBilling: '← Billing',
  Title_BillPrefix: `Bill `,
  Badge_Created: 'Created',
  Label_Bill_Vendor: 'Vendor',
  Label_Bill_Description: 'Description',
  Label_Bill_Total: 'Total',
  Label_Bill_Balance: 'Balance',
  Title_LineItems_Tarping: 'Line Items (Tarping)',
  Label_LineItem_Description: 'Description',
  Label_LineItem_Amount: 'Amount',
}

export const InvoiceDetailsPage = {
  Button_BackToBilling: '← Billing',
  Title_InvoicePrefix: `Invoice `,
  Badge_Created: 'Created',
  Label_Invoice_Vendor: 'Vendor',
  Label_Invoice_Description: 'Description',
  Label_Invoice_Total: 'Total',
  Label_Invoice_Balance: 'Balance',
  Label_Invoice_Document: 'Document',
  Button_Download: 'Download',
  Title_LineItems_Tarping: 'Line Items (Tarping)',
  Label_LineItem_Description: 'Description',
  Label_LineItem_Amount: 'Amount',
}

export const RegionRatesDetailPage = {
  Button_BackToRegion: '← Regions',
  Label_Surtax: 'Surtax',
  Title_BaseRates: 'Base Rates',
  Label_BaseRates_DuringBusinessHours: 'During Business Hours',
  Label_BaseRates_AfterBusinessHours: 'After Business Hours',
  Title_RoofPitchRates: 'Roof Pitch Rates',
  Label_RoofPitchRates_HighRoofRate: 'High Roof (2+ stories)',
  Label_RoofPitchRates_Under7_12: 'Under 7/12',
  Label_RoofPitchRates_7_12To9_12: '7/12 to 9/12',
  Label_RoofPitchRates_10_12To12_12: '10/12 to 12/12',
  Label_RoofPitchRates_Over12And12: 'Over 12/12',
  Title_MechanicalTarpingRates: 'Mechanical Tarping Rates',
  Label_MechanicalTarpingRates_DuringBusinessHours: 'During Business Hours',
  Label_MechanicalTarpingRates_AfterBusinessHours: 'After Business Hours',
  Label_MechanicalTarpingRates_MaterialCost: 'Material Cost',
  Title_SandbagTarpingRates: 'Sandbag Tarping Rates',
  Label_SandbagTarpingRates_DuringBusinessHours: 'During Business Hours',
  Label_SandbagTarpingRates_AfterBusinessHours: 'After Business Hours',
  Label_SandbagTarpingRates_MaterialCost: 'Material Cost',
  Button_EditVendorRates: 'Edit Region',
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

export enum BadgeTypes {
  Unread = ' Unread',
  Applied = ' Applied',
  TotalClaims = ' total claims',
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

export enum JobTypeSelectionOptions {
  EmergencyServices = 'Emergency Services',
  BuildBack = 'Build Back',
  OTR = 'OTR',
}

export enum TemplateTypeSelectionOptions {
  Communication = 'Communication',
  Note = 'Note',
  Timeline = 'Timeline',
}

export enum PortalAccessStatusSelectionOptions {
  Active = 'Active',
  Activating = 'Activating',
  Expired = 'Expired',
  Inactive = 'Inactive',
  Deactivating = 'Deactivating',
  Staged = 'Staged',
  Staging = 'Staging',
}

export enum Documents_Meta_DataSourceSelectionOptions {
  Redacted = 'Redacted',
  ClaimsPortal = 'Claims',
  UserPortal = 'UserPortal',
  Estimator = 'Estimator',
  Inspections = 'Inspections',
  Tech = 'Tech',
}

export enum ContactBookTypes {
  Carrier = 'Carrier',
  ClaimsPortal = 'Claims',
  DeskAdjuster = 'Desk Adjuster',
  FieldAgent = 'Field Agent',
  FieldTech = 'Field Tech',
  ProjectManager = 'Project Manager',
  Reviewer = 'Reviewer',
  Subcontractor = 'Subcontractor',
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

export enum TimelineEventSelectionOptions {
  CustomerContacted = 'Customer Contacted',
  CustomerContactedEmail = 'Customer Contacted - Email',
  CustomerContactedLVM = 'Customer Contacted - LVM',
  CustomerNoContact = 'Customer No Contact',
  InvalidContactInformation = 'Invalid Contact Information',
  InspectionScheduled = 'Inspection Scheduled',
  InspectionCompleted = 'Inspection Completed',
  QAApproved = 'QA Approved',
  QAApprovedPreliminaryReport = 'QA Approved Preliminary Report',
  QAApprovedSupplementReport = 'QA Approved Supplement Report',
  QARejected = 'QA Rejected',
  ReinspectionRevisionRequested = 'Reinspection/Revision Requested',
  JobNotSold = 'Job Not Sold',
  JobSold = 'Job Sold',
  JobStarted = 'Job Started',
  JobCompleted = 'Job Completed',
}

export enum InboxSortBySelectionOptions {
  Unread = 'Unread',
  Date = 'Date',
}

export enum MessageStatusSelectionOptions {
  Read = 'Read',
  Unread = 'Unread',
  Archive = 'Archive',
}

export enum ClaimFilterSelectionOptions_Boolean {
  True = 'True',
  False = 'False',
}

export enum JobFilterSelectionOptions_Boolean {
  True = 'True',
  False = 'False',
}

export enum ClaimFilterSelectionOptions_Carrier {
  Carrier1 = 'Redacted',
  Carrier2 = 'Redacted',
  Eagle = 'Eagle',
  Carrier3 = 'Redacted',
  Carrier4 = 'Redacted',
  Carrier5 = 'Redacted',
  Carrier6 = 'Redacted',
  Carrier7 = 'Redacted',
  Carrier8 = 'Redacted',
}

export enum JobFilterSelectionOptions_LatestWorkAuthStatus {
  Completed = 'Completed',
  Declined = 'Declined',
  Expired = 'Expired',
  OverrideApproved = 'Override Approved',
  Recalled = 'Recalled',
  Sent = 'Sent',
}

export enum ClaimFilterSelectionOptions_ClaimStatus {
  CoordinatorReview = 'Coordinator Review',
  Rejected = 'Rejected',
  Inspection = 'Inspection',
  QAReview = 'QA Review',
  CarrierReview = 'Carrier Review',
  Closed = 'Closed',
}

export enum ClaimFilterSelectionOptions_Coordinator {
  Test = 'test_a@test.company.com',
  BradPeterson = 'redacted',
}

export enum JobFilterSelectionOptions_Coordinator {
  Test = 'test_a@test.company.com',
  BradPeterson = 'redacted',
}

export enum JobFilterSelectionOptions_Dispatcher {
  Test = 'test_a@test.company.com',
  BradPeterson = 'redacted',
}

export enum JobFilterSelectionOptions_Approver {
  redacted1 = 'redacted',
  redacted2 = 'redacted',
}

export enum JobFilterSelectionOptions_ProjectManager {
  redacted1 = 'redacted',
  redacted2 = 'redacted',
}

export enum ClaimFilterSelectionOptions_FieldAgent {
  Test = 'Test User',
  Redacted = 'Redacted',
}

export enum ClaimFilterSelectionOptions_LatestTimelineEvent {
  CatCodeUpdated = 'CAT Code Updated',
  Canceled = 'Canceled',
  CarrierAssignedToClaim = 'Carrier Assigned to Claim',
  CarrierRejected = 'Carrier Rejected',
  CarrierReviewed = 'Carrier Reviewed',
  CarrierReviewedWithExceptions = 'Carrier Reviewed with Exceptions',
  CarrierUnassignedFromClaim = 'Carrier Unassigned from Claim',
  ClaimClosed = 'Claim Closed',
  ClaimInspectionEnded = 'Claim Inspection Ended',
  ClaimReopened = 'Claim Reopened',
  ClientApproved = 'Client Approved',
  ClientRejected = 'Client Rejected',
  CoordinatorAssigned = 'Coordinator Assigned',
  CoordinatorUnassignedToClaim = 'Coordinator Unassigned from Claim',
  CorrectionUploaded = 'Correction Uploaded',
  CustomerContactedEmail = 'Customer Contacted - Email',
  CustomerContactedLVM = 'Customer Contacted - LVM',
  CustomerNoContact = 'Customer No Contact',
  DateReceived = 'Date Received',
  EstimateRevisionRequested = 'Estimate Revision Requested',
  EstimateSentToCarrier = 'Estimate Sent to Carrier',
  EstimateUploaded = 'Estimate Uploaded',
  FieldAgentAssigned = 'Field Agent Assigned',
  FieldAgentUnassignedFromClaim = 'Field Agent Unassigned from Claim',
  InAssignQueue = 'In Assign Queue',
  InspectionCanceled = 'Inspection Canceled',
  InspectionCompleted = 'Inspection Completed',
  InspectionRequested = 'Inspection Requested',
  InspectionScheduled = 'Inspection Scheduled',
  InspectionTechAssignedToClaim = 'Inspection Tech Assigned to Claim',
  InspectionTechUnassignedFromClaim = 'Inspection Tech Unassigned from Claim',
  InvalidContactInformation = 'Invalid Contact Information',
  JobAssignedToClaim = 'Job Assigned to Claim',
  JobCompleted = 'Job Completed',
  JobNotSold = 'Job Not Sold',
  JobSold = 'Job Sold',
  JobStarted = 'Job Started',
  JobUnassignedFromClaim = 'Job Unassigned from Claim',
  LegalRepAssignedToClaim = 'Legal Rep Assigned to Claim',
  LegalRepUnassignedFromClaim = 'Legal Rep Unassigned from Claim',
  LossDate = 'Loss Date',
  LossOfUseAdded = 'Loss Of Use Added',
  LossOfUseApproved = 'Loss Of Use Approved',
  LossOfUseCanceled = 'Loss Of Use Canceled',
  LossOfUseDenied = 'Loss Of Use Denied',
  LossOfUsePending = 'Loss Of Use Pending',
  LossOfUseReceiptAdded = 'Loss Of Use Receipt Added',
  LossOfUseReceiptRemoved = 'Loss Of Use Receipt Removed',
  LossSeverityUpdated = 'Loss Severity Updated',
  LossTypeUpdated = 'Loss Type Updated',
  MarkedForPublication = 'Marked for Publication',
  PolicyHolderAssignedToClaim = 'Policyholder Assigned to Claim',
  PolicyHolderUnassignedToClaim = 'Policyholder Unassigned from Claim',
  PrimaryContactAssignedToClaim = 'Primary Contact Assigned to Claim',
  PrimaryContactUnassignedFromClaim = 'Primary Contact Unassigned from Claim',
  ProjectManagerAssigned = 'Project Manager Assigned',
  ProjectManagerUnassignedFromClaim = 'Project Manager Unassigned from Claim',
  QAApproved = 'QA Approved',
  QAApprovedPreliminaryReport = 'QA Approved Preliminary Report',
  QAApprovedSupplementReport = 'QA Approved Supplement Report',
  QARejected = 'QA Rejected',
  ReviewCompleted = 'Review Completed',
  ReviewRequested = 'Review Requested',
  ReviewerAssigned = 'Reviewer Assigned',
  ReviewerUnassignedFromClaim = 'Reviewer Unassigned from Claim',
  SurveySentToCustomer = 'Survey Sent to Customer',
}

export enum JobFilterSelectionOptions_LatestTimelineEvent {
  AppointmentCompleted = 'Appointment Completed',
  AppointmentScheduled = 'Appointment Scheduled',
  ApproverAssignedToJob = 'Approver Assigned to Job',
  ApproverUnassignedFromJob = 'Approver Unassigned from Job',
  BillCreated = 'Bill Created',
  BillPaymentMade = 'Bill Payment Made',
  BillSentToCollections = 'Bill Sent to Collections',
  BillUpdated = 'Bill Updated',
  CarrierInvoiced = 'Carrier Invoiced',
  CarrierMadePayment = 'Carrier Made Payment',
  CoordinatorAssignedToJob = 'Coordinator Assigned to Job',
  CoordinatorUnassignedFromJob = 'Coordinator Unassigned from Job',
  CustomerContactAttempted = 'Customer Contact Attempted',
  DepositOverrideApproved = 'Deposit Override Approved',
  DepositPaid = 'Deposit Paid',
  DescriptionUpdated = 'Description Updated',
  DispatcherAssignedToJob = 'Dispatcher Assigned to Job',
  DispatcherUnassignedFromJob = 'Dispatcher Unassigned from Job',
  FieldTechAssignedToJob = 'Field Tech Assigned to Job',
  FieldTechUnassignedFromJob = 'Field Tech Unassigned from Job',
  InvoiceCreated = 'Invoice Created',
  InvoicePaymentMade = 'Invoice Payment Made',
  InvoiceUpdated = 'Invoice Updated',
  JobAssignedToClaim = 'Job Assigned to Claim',
  JobCancelled = 'Job Cancelled',
  JobCompleted = 'Job Completed',
  JobCreated = 'Job Created',
  JobLocationUpdated = 'Job Location Updated',
  JobReopened = 'Job Reopened',
  JobStarted = 'Job Started',
  JobUnassignedFromClaim = 'Job Unassigned from Claim',
  JobWithdrawn = 'Job Withdrawn',
  PrimaryContactAssignedToJob = 'Primary Contact Assigned to Job',
  PrimaryContactUnassignedFromJob = 'Primary Contact Unassigned from Job',
  ProjectManagerAssignedToJob = 'Project Manager Assigned to Job',
  ProjectManagerUnassignedFromJob = 'Project Manager Unassigned from Job',
  ServicesAdded = 'Services Added',
  ServicesRemoved = 'Services Removed',
  SubcontractorAssignedToJob = 'Subcontractor Assigned to Job',
  SubcontractorDocumentIssued = 'Subcontractor Document Issued',
  SubcontractorDocumentReceived = 'Subcontractor Document Received',
  SubcontractorPaid = 'Subcontractor Paid',
  SubcontractorUnassignedFromJob = 'Subcontractor Unassigned from Job',
  WorkAuthorizationDeclined = 'Work Authorization Declined',
  WorkAuthorizationExpired = 'Work Authorization Expired',
  WorkAuthorizationOverride = 'Work Authorization Override',
  WorkAuthorizationReassigned = 'Work Authorization Reassigned',
  WorkAuthorizationRecalled = 'Work Authorization Recalled',
  WorkAuthorizationSent = 'Work Authorization Sent',
  WorkAuthorizationSigned = 'Work Authorization Signed',
  WorkDetailsReceived = 'Work Details Received',
}

export enum CreateJobTimelineEventSelectionOptions {
  JobStarted = 'Job Started',
  AppointmentScheduled = 'Appointment Scheduled',
  AppointmentCompleted = 'Appointment Completed',
  CustomerContactAttempted = 'Customer Contact Attempted',
  DepositPaid = 'Deposit Paid',
  DepositOverrideApproved = 'Deposit Override Approved',
  CarrierInvoiced = 'Carrier Invoiced',
  CarrierMadePayment = 'Carrier Made Payment',
  BillSentToCollections = 'Bill Sent to Collections',
  SubcontractorDocumentIssued = 'Subcontractor Document Issued',
  SubcontractorDocumentReceived = 'Subcontractor Document Received',
  SubcontractorPaid = 'Subcontractor Paid',
  JobCompleted = 'Job Completed',
  JobCancelled = 'Job Cancelled',
  JobWithdrawn = 'Job Withdrawn',
}

export enum JobFilterSelectionOptions_Type {
  EmergencyServices = 'Emergency Services',
  BuildBack = 'Build Back',
  OTR = 'OTR',
}

export enum JobFilterSelectionOptions_Services {
  Tarping = 'Tarping',
  WaterMitigation = 'Water Mitigation',
  BoardUp = 'Board Up',
  Exterior = 'Exterior',
  Interior = 'Interior',
  Roof = 'Roof',
}

export enum DateFilterTypes {
  DateEquals = 'Date Equals',
  DateGreaterThan = 'Date Greater Than',
  DateLesserThan = 'Date Lesser Than',
}

export enum DataGrid_Column_Type {
  Templates_Carrier,
  Templates_Created,
  Templates_Document,
  Templates_LastUpdated,
  Templates_Name,
}

export enum DataGrid_Column_SortState {
  Unsorted = 1,
  Ascending = 2, // low to high, a-z
  Descending = 3, // high to low, z-a
}

export enum DataTable_Column_SortState {}
export const DataGrid_Column_Tuples = {
  Carrier: { name: 'Carrier', id: 'CarrierContactCorn', settings: true },
  Created: { name: 'Created', id: 'Created On', settings: true },
  Document: { name: 'Document', id: 'DocumentId', settings: false },
  LastUpdated: { name: 'Last Updated', id: 'Last Updated', settings: true },
  Name: { name: 'Name', id: 'Name', settings: true },
}

export enum DataGrid_DateSearchOption {
  DateEquals = 'Date Equals',
  DateGreaterOrEqualThan = 'Date Greater or Equal Than',
  DateGreaterThan = 'Date Greater Than',
  DateLesserOrEqualThan = 'Date Lesser or Equal Than',
  DateLesserThan = 'Date Lesser Than',
}

export enum DataTable_Columns_Type {
  Templates_Name,
  Templates_Type,
  Callbacks_Status,
  Callbacks_Entity_ID,
  Callbacks_For_Role,
  Callbacks_Notes,
  Callbacks_Name,
  Callbacks_Contact_Method,
  Callbacks_Preferred_Time,
  Callbacks_Date_Requested,
  GlobalContacts_Name,
  GlobalContacts_Contacts_Number,
  ContactsBook_Name,
  ContactsBook_Roles,
  ContactsBook_Preferred_Contact,
  ContactsBook_Data_Source,
  ContactsBook_Description,
  ContactsBook_License,
  ContactsBook_Picture,
  ContactsBook_Inactive,
  Tags_TagKey,
  RelatedTags_Resource,
  RelatedTags_Tag_Value,
  RelatedTags_Color,
  Claims_Users,
  Claims_Coordinator,
  Claims_DeskAdjuster,
  Claims_FieldAgent,
  Claims_InspectionTech,
  Claims_Reviewer,
  Claims_Policyholder,
  Claims_PrimaryContact,
  Claims_ClaimNumber,
  Claims_Phone,
  Claims_Email,
  Claims_ClaimStatus,
  Claims_Carrier,
  Claims_Tags,
  Claims_LastEvent,
  Claims_InAssignQueue,
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
  Claims_Data_Source,
  PortalAccess_Contact,
  PortalAccess_ContactRoles,
  PortalAccess_Status,
  PortalAccess_CreatedDate,
  PortalAccess_LoginCount,
  PortalAccess_LatestLogin,
  Contacts_Assignee,
  Contacts_Name,
  Contacts_Roles,
  Contacts_Preferred_Contact,
  Contacts_Data_Source,
  Contacts_Description,
  Contacts_Inactive,
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
  Jobs_Users,
  Jobs_JobId,
  Jobs_Type,
  Jobs_Services,
  Jobs_Description,
  Jobs_Status,
  Jobs_WorkAuthStatus,
  Jobs_Location,
  Jobs_LatestTimelineEvent,
  Jobs_PrimaryContact,
  Jobs_Tags,
  Inspections_Description,
  Inspections_Started,
  inspections_Duration,
  Inspections_Organizer,
  Inspections_NumberOfParticipants,
  InspectionScreenshots_Label,
  InspectionScreenshots_Description,
  InspectionScreenshots_FileName,
  InspectionScreenshots_DateUploaded,
  InspectionScreenshots_DateTaken,
  WorkAuthorizations_Document,
  WorkAuthorizations_Status,
  WorkAuthorizations_Created,
  WorkAuthorizations_Expires,
  WorkAuthorizations_Recipients,
  LossOfUse_Type,
  LossOfUse_Status,
  LossOfUse_AmountRequested,
  LossOfUse_Duration,
  LossOfUse_RequestedDate,
  LossOfUse_LastModified,
  LossOfUseReceipts_ReceiptDate,
  LossOfUseReceipts_ReceiptNote,
  LossOfUseReceipts_DocumentTitle,
  LossOfUseReceipts_DocumentDescription,
  Estimates_SubmissionDate,
  Estimates_SubmittedBy,
  Estimates_EstimateAmount,
  PricingRegions_RegionName,
  PricingVendorRates_VendorName,
  PricingVendorRates_IsTemplate,
  Bills_VendorName,
  Bills_Status,
  Bills_Total,
  Bills_Balance,
  Invoices_CustomerName,
  Invoices_Status,
  Invoices_Total,
  Invoices_Balance,
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

export const DataTable_Columns = {
  Name: [DataColumnType.Text, 'name', 'Name', 'NAME'],
  Type: [DataColumnType.Text, 'type', 'Type', 'TYPE'],
  Status: [DataColumnType.Text, 'status', 'Status', 'STATUS'],
  EntityID: [DataColumnType.Link, 'entityId', 'Entity ID', 'ENTITY ID'],
  ForRole: [DataColumnType.Text, 'role', 'For Role', 'FOR ROLE'],
  Notes: [DataColumnType.Text, 'notes', 'Notes', 'NOTES'],
  ContactMethod: [DataColumnType.Text, 'contactMethod', 'Contact Method', 'CONTACT METHOD'],
  PreferredTime: [DataColumnType.Text, 'timeOfDay', 'Preferred Time', 'PREFERRED TIME'],
  DateRequested: [DataColumnType.Date, 'dateRequested', 'Date Requested', 'DATE REQUESTED'],
  ContactsNumber: [DataColumnType.Text, 'numContacts', 'Contacts #', 'CONTACTS #'],
  ContactName: [DataColumnType.Text, 'contactName', 'Name', 'NAME'],
  Roles: [DataColumnType.Text, 'roles', 'Roles', 'ROLES'],
  PreferredContact: [
    DataColumnType.Text,
    'preferredContact',
    'Preferred Contact',
    'PREFERRED CONTACT',
  ],
  Data_Source: [DataColumnType.Text, 'dataSource', 'Data Source', 'DATA SOURCE'],
  Description: [DataColumnType.Text, 'description', 'Description', 'DESCRIPTION'],
  License: [DataColumnType.Text, 'licenseNumber', 'License', 'LICENSE'],
  Picture: [DataColumnType.Text, 'picture', 'Picture', 'PICTURE'],
  Tag_Key: [DataColumnType.Text, 'tagKey', 'Tag Key', 'TAG KEY'],
  Resource: [DataColumnType.Text, 'resourceCorn', 'Resource', 'RESOURCE'],
  Value: [DataColumnType.Text, 'value', 'Tag Value', 'TAG VALUE'],
  Color: [DataColumnType.Text, 'color', 'Color', 'COLOR'],
  Users: [DataColumnType.Text, 'collaboration', 'Users', 'USERS'],
  Coordinator: [DataColumnType.Text, 'coordinatorName', 'Coordinator', 'COORDINATOR'],
  DeskAdjuster: [DataColumnType.Text, 'deskAdjusterName', 'Desk Adjuster', 'DESK ADJUSTER'],
  FieldAgent: [DataColumnType.Text, 'fieldAgentName', 'Field Agent', 'FIELD ADJUSTER'],
  InspectionTech: [
    DataColumnType.Text,
    'inspectionTechName',
    'Inspection Tech',
    'INSPECTION TECHNICIAN',
  ],
  Reviewer: [DataColumnType.Text, 'reviewerName', 'Reviewer', 'REVIEWER'],
  Policyholder: [DataColumnType.Text, 'policyHolderName', 'Policyholder', 'POLICYHOLDER'],
  PrimaryContact: [DataColumnType.Text, 'primaryContactName', 'Primary Contact', 'PRIMARY CONTACT'],
  ClaimNumber: [DataColumnType.Link, 'claimNumber', 'Claim Number', 'CLAIM NUMBER'],
  Phone: [DataColumnType.Text, 'primaryContactPhone', 'Phone', 'PHONE'],
  Email: [DataColumnType.Text, 'primaryContactEmail', 'Email', 'EMAIL'],
  ClaimStatus: [DataColumnType.Text, 'claimStatus', 'Claim Status', 'CLAIM STATUS'],
  Carrier: [DataColumnType.Text, 'carrier', 'Carrier', 'CARRIER'],
  Tags: [DataColumnType.Text, 'tags', 'Tags', 'TAGS'],
  LastEvent: [DataColumnType.Text, 'latestTimelineEvent', 'Last Event', 'LAST EVENT'],
  InAssignQueue: [DataColumnType.Date, 'inAssignQueue', 'In Assign Queue', 'IN ASSIGN QUEUE'],
  DateReceived: [DataColumnType.Date, 'dateReceived', 'Date Received', 'DATE RECEIVED'],
  LossDate: [DataColumnType.Date, 'lossDate', 'Loss Date', 'LOSS DATE'],
  InspectionScheduled: [
    DataColumnType.Date,
    'inspectionScheduled',
    'Inspection Scheduled',
    'INSPECTION SCHEDULED',
  ],
  InspectionCompleted: [
    DataColumnType.Date,
    'inspectionCompleted',
    'Inspection Completed',
    'INSPECTION COMPLETED',
  ],
  HasLegalRep: [DataColumnType.Check, 'hasLegalRep', 'Has Legal Rep?', '<gavel>'],
  City: [DataColumnType.Text, 'city', 'City', 'CITY'],
  State: [DataColumnType.Text, 'state', 'State', 'STATE'],
  County: [DataColumnType.Text, 'county', 'County', 'COUNTY'],
  CatCode: [DataColumnType.Text, 'catCode', 'CAT Code', 'CAT CODE'],
  HasJob: [DataColumnType.Check, 'hasJob', 'Has Job?', 'HAS JOB?'],
  Contact: [DataColumnType.Text, 'contactName', 'Contact', 'CONTACT'],
  ContactRoles: [DataColumnType.Text, 'contactRoles', 'Contact Roles', 'CONTACT ROLES'],
  CreatedDate: [DataColumnType.Date, 'dateCreated', 'Created Date', 'CREATED DATE'],
  LoginCount: [DataColumnType.Text, 'loginCount', 'Login Count', 'LOGIN COUNT'],
  LatestLogin: [DataColumnType.Date, 'lastLogin', 'Latest Login', 'LATEST LOGIN'],
  Assignee: [DataColumnType.Text, 'primaryContact', 'Assignee', 'ASSIGNEE'],
  FileAlt: [DataColumnType.Text, 'title', 'Title', 'TITLE'],
  File: [DataColumnType.Text, 'file', 'File', 'FILE'],
  FileName: [DataColumnType.Text, 'fileName', 'File Name', 'FILE NAME'],
  Visibility: [DataColumnType.Text, 'cohorts', 'Visibility', 'VISIBILITY'],
  Exports: [DataColumnType.Text, 'exportHistory', 'Exports', 'EXPORTS'],
  Dates: [DataColumnType.Text, 'dates', 'Dates', 'DATES'],
  Meta: [DataColumnType.Text, 'meta', 'Meta', 'META'],
  DocumentTags: [DataColumnType.Text, 'tags.key', 'Tags', 'TAGS'],
  Id: [DataColumnType.Text, 'id', 'Job ID', 'JOB ID'],
  Services: [DataColumnType.Text, 'services', 'Services', 'SERVICES'],
  Location: [DataColumnType.Text, 'jobLocation', 'Location', 'LOCATION'],
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
  LatestTimelineEvent: [
    DataColumnType.Text,
    'latestTimelineEvent',
    'Latest Timeline Event',
    'LATEST TIMELINE EVENT',
  ],
  LatestWorkAuthStatus: [
    DataColumnType.Text,
    'latestWorkAuthStatus',
    'Work Auth Status',
    'WORK AUTH STATUS',
  ],
  Document: [DataColumnType.Text, 'requestName', 'Document', 'DOCUMENT'],
  WorkAuthStatus: [DataColumnType.Text, 'requestStatus', 'Status', 'STATUS'],
  DateCreated: [DataColumnType.Date, 'dateCreated', 'Created', 'CREATED'],
  Expires: [DataColumnType.Date, 'expireBy', 'Expires', 'EXPIRES'],
  Recipients: [DataColumnType.Text, 'recipients', 'Recipients', 'RECIPIENTS'],
  Label: [DataColumnType.Text, 'label', 'Label', 'LABEL'],
  FileDescription: [DataColumnType.Text, 'file', 'Description', 'DESCRIPTION'],
  AmountRequested: [DataColumnType.Text, 'amountRequested', 'Amount Requested', 'AMOUNT REQUESTED'],
  DurationInDays: [DataColumnType.Text, 'durationInDays', 'Duration (Days)', 'DURATION (DAYS)'],
  RequestedDate: [DataColumnType.Text, 'requestedDate', 'Requested Date', 'REQUESTED DATE'],
  LastModified: [DataColumnType.Text, 'lastModified', 'Last Modified', 'LAST MODIFIED'],
  ReceiptDate: [DataColumnType.Text, 'receiptDateReceived', 'Receipt Date', 'RECEIPT DATE'],
  ReceiptNote: [DataColumnType.Text, 'note', 'Receipt Note', 'RECEIPT NOTE'],
  DocumentTitle: [DataColumnType.Text, 'documentTitle', 'Document Title', 'DOCUMENT TITLE'],
  DocumentDescription: [
    DataColumnType.Text,
    'documentDescription',
    'Document Description',
    'DOCUMENT DESCRIPTION',
  ],
  SubmissionDate: [DataColumnType.Text, 'submissionDate', 'Submission Date', 'SUBMISSION DATE'],
  SubmittedBy: [DataColumnType.Text, 'submittedBy', 'Submitted By', 'SUBMITTED BY'],
  EstimateAmount: [DataColumnType.Text, 'grossEstimate', 'Estimate Amount', 'ESTIMATE AMOUNT'],
  RegionName: [DataColumnType.Text, 'name', 'Region Name', 'REGION NAME'],
  VendorName: [DataColumnType.Text, 'name', 'Vendor Name', 'VENDOR NAME'],
  VendorName_Bills: [DataColumnType.Text, 'vendorName', 'Vendor Name', 'VENDOR NAME'],
  IsTemplate: [DataColumnType.Text, 'isTemplate', 'Is Template?', 'IS TEMPLATE?'],
  Total_Bills: [DataColumnType.Text, 'totalDecimalAmount', 'Total', 'TOTAL'],
  Balance_Bills: [DataColumnType.Text, 'balanceDecimalAmount', 'Balance', 'BALANCE'],
  CustomerName: [DataColumnType.Text, 'customerName', 'Customer Name', 'CUSTOMER NAME'],
  Total: [DataColumnType.Text, 'total', 'Total', 'TOTAL'],
  Balance: [DataColumnType.Text, 'balance', 'Balance', 'BALANCE'],
}

export enum PricingRegions_DataTable_ActionMenuItems {
  GotoRegion = 'Go to region',
  EditRegion = 'Edit region',
  RemoveRegion = 'Remove region',
}

export enum PricingVendorRates_DataTable_ActionMenuItems {
  ViewVendorRates = 'View Vendor Rates',
  EditVendorRates = 'Edit Vendor Rates',
  RemoveVendorRates = 'Remove Vendor Rates',
}
export enum Template_DataTable_ActionMenuItems {
  CopyTemplateId = 'Copy Template ID',
  CopyTemplateText = 'Copy Template Text',
  EditTemplate = 'Edit Template',
  DeleteTemplate = 'Delete Template',
}

export enum Callbacks_DataTable_ActionMenuItems {
  ChangeCallbackStatus = 'Change callback status',
}

export enum GlobalBooks_DataTable_ActionMenuItems {
  CopyBookId = 'Copy Book ID',
  OpenBook = 'Open Book',
}

export enum Claims_DataTable_ActionMenuItems {
  OpenClaim = 'Open Claim',
  CopyClaimNumber = 'Copy Claim Number',
}

export enum ContactsBook_DataTable_ActionMenuItems {
  CopyContactId = 'Copy Contact ID',
  CopyRedacted1Id = 'Copy Redacted1 ID',
  ViewMoreInfo = 'View More Info',
  EditContact = 'Edit Contact',
  DeleteContact = 'Delete Contact',
  SetAsInactive = 'Set as Inactive',
  SetAsActive = 'Set as Active',
}

export enum Contacts_DataTable_ActionMenuItems {
  CopyContactId = 'Copy Contact ID',
  CopyRedacted1Id = 'Copy Redacted1 ID',
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
  AddTags = 'Add Tags',
}

export enum WorkAuthorizations_DataTable_ActionMenuItems {
  CopyWorkAuthId = 'Copy Work Auth ID',
  RecallDocument = 'Recall Document',
  RemindRecipients = 'Remind Recipient(s)',
}

export enum PortalAccess_DataTable_ActionMenuItems {
  ViewContactDetails = 'View Contact Details',
  DeactivatePortal = 'Deactivate Portal',
  AddPersonToPortal = 'Add Person to Portal',
}

export enum Inspections_DataTable_ActionMenuItems {
  CopyInspectionId = 'Copy Inspection ID',
  EditInspection = 'Edit Inspection',
  OpenInspection = 'Open Inspection',
}

export enum Jobs_DataTable_ActionMenuItems {
  CopyJobID = 'Copy Job ID',
  OpenJob = 'Open Job',
}

export enum PhotoReport_ActionMenuItems {
  Reset = 'Reset',
  ReaddPhotos = 'Re-add Photos',
  CollapseGroups = 'Collapse Groups',
  CollapsePhotos = 'Collapse Photos',
}

export enum DocumentTemplate_DataGrid_ActionMenuItems {
  CopyTemplateId = 'Copy Template ID',
  CopyDocumentId = 'Copy Document ID',
  EditTemplate = 'Edit Template',
  DeleteTemplate = 'Delete Template',
}

export enum NoteTemplate_DataGrid_ActionMenuItems {
  CopyTemplateId = 'Copy Template ID',
  CopyTemplateText = 'Copy Template Text',
  EditTemplate = 'Edit Template',
  DeleteTemplate = 'Delete Template',
}

export enum CommunicationTemplate_DataGrid_ActionMenuItems {
  CopyTemplateId = 'Copy Template ID',
  CopyTemplateText = 'Copy Template Text',
  EditTemplate = 'Edit Template',
  DeleteTemplate = 'Delete Template',
}

export enum RedactedId {
  Agent1 = 'redacted',
  Agent2 = 'redacted',
}

export const AlertStrings = {
  DeleteTemplate_Title: 'Delete Template?',
  DeleteTemplate_Description: 'Are you sure you want to delete this template?',
  DeleteView_Title: 'Delete View',
  DeleteView_Description: 'Are you sure you want to delete this view?',
  DeleteDocument_Title: 'Delete Document',
  DeleteDocument_Description: 'Are you sure you want to delete this document?',
  RemoveRegion_Title: 'Remove Region',
  RemoveRegion_Description: 'Are you sure you want to remove this region?',
  RemoveVendorRates_Title: 'Remove Vendor Rates',
  RemoveVendorRates_Description: 'Are you sure you want to remove this vendor rates?',
  RemovePortalAccess_Title: 'Remove Portal Access',
  RemovePortalAccess_Description: 'Are you sure you want to deactivate this portal?',
  DeleteGroup_Title: 'Delete Group',
  DeleteGroup_Description:
    'Are you sure you want to delete this group? It will also remove all the photos within the group from the photo report.',
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
  InspectionTech = 512,
  LegalRepresentation = 1024,
  MortgageHolder = 2048,
  Other = 4096,
  OtherContact = 8192,
  Policyholder = 16384,
  PrimaryContact = 32768,
  ProjectManager = 65536,
  PropertyAccessContact = 131072,
  QA = 262144,
  Reviewer = 524288,
  Subcontractor = 1048576,
  ThirdPartyClaimant = 2097152,
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
  ClaimsPortal = 'Claims',
  Redacted = 'Redacted',
  Estimator = 'Estimator',
}

export enum Filter_Radio_WorkAuthStatus {
  Completed = 'Completed',
  Declined = 'Declined',
  Draft = 'Draft',
  Expired = 'Expired',
  InProgress = 'In Progress',
  Recalled = 'Recalled',
}

export enum Filter_Radio_Visibility {
  Coordinator = 'Coordinator',
  Estimator = 'Estimator',
  Insured = 'Insured',
  Tech = 'Tech',
}

export const ContactRolesTuples = {
  Agent: [ContactRoles.Agent, 'Agent'],
  Approver: [ContactRoles.Approver, 'Approver'],
  Carrier: [ContactRoles.Carrier, 'Carrier'],
  Coordinator: [ContactRoles.Coordinator, 'Coordinator'],
  CoordinatorClaimsPortal: [ContactRoles.CoordinatorClaimsPortal, 'Coordinator (Claims Portal)'],
  DeskAdjuster: [ContactRoles.DeskAdjuster, 'Desk Adjuster'],
  Dispatcher: [ContactRoles.Dispatcher, 'Dispatcher'],
  FieldAgent: [ContactRoles.FieldAgent, 'Field Agent'],
  FieldTech: [ContactRoles.FieldTech, 'Field Tech'],
  InspectionTech: [ContactRoles.InspectionTech, 'Inspection Tech'],
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

export const AbortErrors = {
  EmptyClaimContactsTableMessage: 'Claim Contacts: Contacts Table is empty',
  EmptyClaimRemovedContactsTableMessage: 'Claim Contacts: Removed Contacts Table is empty',
  EmptyClaimJobsTableMessage: 'Claim Jobs: Jobs Table is empty',
  EmptyCallbacksTableMessage: 'Callbacks: Callbacks Table is empty',
  EmptyClaimActiveCallbackRequestsTableMessage:
    'Claim Callback Requests: Active Callbacks Table is empty',
  EmptyClaimCompletedCallbackRequestsTableMessage:
    'Claim Callback Requests: Completed Callbacks Table is empty',
  EmptyClaimDocumentsTableMessage: 'Claim Documents: Documents Table is empty',
  EmptyClaimMediaTableMessage: 'Claim Media: Media Table is empty',
  EmptyAssignedJobsTableMessage: 'Claim Jobs: Jobs Table is empty',
  EmptyClaimInspectionsTableMessage: 'Claim Inspections: Inspections Table is empty',
  EmptyClaimInspectionDetailsScreenshotsTableMessage:
    'Claim Inspection Details: Inspection Screenshots Table is empty',
  EmptyClaimPortalAccessTableMessage: 'Claim Portal Access: Portal Access Table is empty',
  EmptyClaimsTableMessage: 'Claims: Claims Table is empty',
  EmptyContactsTableMessage: 'Contacts: Contacts Table is empty',
  EmptyGlobalBooksTableMessage: 'Global Books: Books Table is empty',
  EmptyRemovedContactsTableMessage: 'Contacts: Removed Contacts Table is empty',
  EmptyYourAssignedClaimsTableMessage: 'Home: Your Assigned Claims Table is empty',
  EmptyUnassignedClaimsTableMessage: 'Home: Unaassigned Claims Table is empty',
  PaginationNotEnoughEntries:
    'Pagination cannot be tested - not enough table entries - need at least 10',
  NotesNotEnoughEntries:
    'Notes scenario cannot be tested - not enough note entries - need at least 2',
  EmptyInboxMessage: 'Inbox: Inbox is empty',
  InboxNotEnoughMessages: 'Inbox scenario cannot be tested - not enough messages - need at least 2',
  EmptyJobActiveCallbackRequestsTableMessage:
    'Job Callback Requests: Active Callbacks Table is empty',
  EmptyJobCompletedCallbackRequestsTableMessage:
    'Job Callback Requests: Completed Callbacks Table is empty',
  EmptyJobContactsTableMessage: 'Job Contacts: Contacts Table is empty',
  EmptyJobRemovedContactsTableMessage: 'Job Contacts: Removed Contacts Table is empty',
  EmptyJobDocumentsTableMessage: 'Job Documents: Documents Table is empty',
  EmptyJobMediaTableMessage: 'Job Media: Media Table is empty',
  EmptyJobWorkAuthTableMessage: 'Job Work Authorization: Work Auth Table is empty',
  EmptyJobInspectionsTableMessage: 'Job Inspections: Inspections Table is empty',
  EmptyJobInspectionDetailsScreenshotsTableMessage:
    'Job Inspection Details: Inspection Screenshots Table is empty',
  EmptyJobPortalAccessTableMessage: 'Job Portal Access: Portal Access Table is empty',
  EmptyJobsTableMessage: 'Jobs: Jobs Table is empty',
  EmptyTagKeysTableMessage: 'Tags: Tag Keys Table is empty',
  EmptyRelatedTagsTableMessage: 'Tags: Related Tags Table is empty',
  EmptyLossOfUseTableMessage: 'Claim Loss of Use: Loss of Use Table is empty',
  EmptyReceiptsTableMessage: 'Claim Loss of Use Details: Receipts Table is empty',
  EmptyClaimEstimatesTableMessage: 'Claim Estimates: Estimates Table is empty',
  EmptyClaimEstimateDetailsDocumentsTableMessage:
    'Claim Estimate Details: Claim Documents Table is empty',
  EmptyRegionPricingTableMessage: 'Pricing Page - Regions Tab: Region Pricing Table is empty',
  EmptyVendorRatesTableMessage: 'Pricing Page - Vendors Tab: Vendor Rates Table is empty',
  EmptyPhotoReportPageMessage: 'Photo Report page is empty',
  LessThanTwoGroupsPhotoReportPageMessage:
    'Photo Report Page scenario cannot be tested - not enough groups - need at least 2',
  EmptyCommunicationTemplatesGridMessage: 'Templates: Communication Templates Grid is empty',
  EmptyDocumentTemplatesGridMessage: 'Templates: Document Templates Grid is empty',
  EmptyNoteTemplatesGridMessage: 'Templates: Note Templates Grid is empty',
  LessThanTwoTemplatesGenerateDocumentPageMessage:
    'Generate Document Page scenario cannot be tested - not enough templates - need at least 2',
}

export enum LossOfUseStatusType {
  Approved = 'Approved',
  Denied = 'Denied',
  Cancelled = 'Cancelled',
  Pending = 'Pending',
}

export enum LabelPosition {
  Start,
  End,
}
