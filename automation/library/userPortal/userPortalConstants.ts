import { userPortal } from '../../environments/env.ceylon.js'
import { CeylonEnvironmentType, DataColumnType } from '../shared/constants.js'

export const DefaultEnvironment = userPortal.ENVIRONMENT ?? CeylonEnvironmentType.Company_Test
export const MaxUploadFiles = 100

export enum CannedClaimTypes {
  DefaultTestClaim,
}

export enum CannedJobTypes {
  DefaultTestJob,
}

export const LeftNavStrings = {
  Title: 'Company Portal',
  Link_Home: 'Home',
  Link_Details: 'Details',
  Link_Documents: 'Documents',
  Link_Media: 'Media',
  Link_ContactUs: 'Contact Us',
  Button_PortalTour: 'Portal Tour',
  Link_AboutCompany: 'About Company',
  Button_Collapse: 'Collapse',
  Button_UserMenu_UpdateContactInfo: 'Update Contact Info',
  Button_UserMenu_UIVersion: 'UI vRedacted',
  Button_UserMenu_Logout: 'Logout',
}

export const DrawerStrings = {
  Button_Close: 'Close',
  Button_Cancel: 'Cancel',
  Button_Submit: 'Submit',
  Button_Back: 'Back',
  Button_Next: 'Next',
  UpdateContact_Title: 'Update Contact Information',
  UpdateContact_TextBox_FirstName: 'First Name',
  UpdateContact_TextBox_LastName: 'Last Name',

  UpdateDocumentInformation_Title: 'Update Document Information',
  UpdateDocumentInformation_Link_OpenDocumentPreview: 'Open Document Preview',
  UpdateDocumentInformation_Button_RotateLeft: 'Rotate Left',
  UpdateDocumentInformation_Button_SaveRotation: 'Save',
  UpdateDocumentInformation_Button_RotateRight: 'Rotate Right',

  RequestCallback_Title_YourProjectManager: 'Request Callback from Your Project Manager',
  RequestCallback_Title_YourFieldAgent: 'Request Callback from Your Field Agent',
  RequestCallback_Title_CompanyClaimsPortal: 'Request Callback from Company Claims Portal',
  RequestCallback_List_PreferredContactMethod: 'Preferred Contact Method',
  RequestCallback_TextBox_PhoneNumber: 'Phone Number',
  RequestCallback_List_PreferredTimeOfDay: 'Preferred Time of Day',
  RequestCallback_TextArea_Description: 'Short description of your issue:',
}

export const ValidationStrings = {
  FirstName_InvalidValue: 'First name must be at least 1 character',
  InvalidString1: 'String must contain at least 1 character(s)',
  FilesAreRequired: 'Files are required.',
  InvalidUploadFile:
    'Only image, Word, Excel, PDF, Xactimate, MP4 and MOV file types are accepted.',
  TooManyFiles: 'Can only upload <MAXUPLOADFILES> or fewer files at a time.',
  InvalidPreferredContact: `Invalid discriminator value. Expected 'email' | 'phone'`,
  InvalidPreferredTimeOfDay: `Invalid enum value. Expected 'any' | 'morning' | 'afternoon' | 'evening', received ''`,
  MaxFiles: 'You have selected <MAXUPLOADFILES> items for upload',
  MaxFilesDescription: 'Please submit these for upload before selecting additional items',
  OverMaxFiles: 'You have selected too many files for upload',
  OverMaxFilesDescription: 'Please remove (<FILEOVERAGE>) files before submitting.',
  UploadNotAcceptedFileType: `File "<FILENAME>" is not an accepted file type.`,
  FilesTooLarge: 'Some files exceed the maximum size of 1GB.',
}

export const DocumentsPageStrings = {
  Title: 'Documents',
  Link_UploadDocuments: 'Upload Document(s)',
  Label_Empty_Title: 'Get started with uploading some documents', // h3
  Label_Empty_Description:
    'If you have any documents you need to upload for your claim, you can do so by clicking the button below.', // p
}

export const MediaPageStrings = {
  Title: 'Media',
  Link_UploadMedia: 'Upload Media',
  Label_Empty_Title: 'Get started by uploading media', // h3
  Label_Empty_Description:
    'If you have media you need to upload for your claim, you can do so by clicking the button below.', // p
}

export const MediaCardStrings = {
  Link_UploadMedia: 'Upload Media',
  Label_Filename: 'Filename',
  Label_Title: 'Title',
  Label_Description: 'Description',
  Button_EditInfo: 'Edit Info',
  Button_Delete: 'Delete',
}

export const ClaimCommunicationPageStrings = {
  Label_ContactUs_Title: 'Contact Us',
  label_RequestACallback_Title: 'Request a Callback',
  Button_RequestCallback_CompanyClaimsPortal: 'Company Claims Portal',
  Button_RequestCallback_YourFieldAgent: 'Your Field Agent',
}

export const JobCommunicationPageStrings = {
  Label_ContactUs_Title: 'Contact Us',
  label_RequestACallback_Title: 'Request a Callback',
  Button_RequestCallback_CompanyClaimsPortal: 'Company Claims Portal',
  Button_RequestCallback_YourProjectManager: 'Your Project Manager',
}

export const CompanyPortalTourStrings = {
  Title: 'Welcome to the Company Portal',
  Button_Done: 'Done',
}

export const AboutCompanyPageStrings = {
  Title: 'Company Restoration',
}

export const YourActiveClaimsAndJobsPageStrings = {
  Title: 'Your Active Claims and Jobs',
}

export const ClaimPageStrings = {
  Badge: 'Claim',
}

export const JobPageStrings = {
  Badge: 'Job',
}

export const ClaimDetailsPageStrings = {
  Badge: 'Claim',
  ClaimProcess_Title: 'Claim Process',
  ClaimProcess_ClaimNumber: 'Claim Number',
  ClaimProcess_Status: 'Status',
  ClaimProcess_Coordinator: 'Coordinator',
  ClaimProcess_FieldAgentName: 'Field Agent Name',
  ClaimProcess_ScheduledAppointmentDate: 'Scheduled Appointment Date',
  ClaimDetails_Title: 'Claim Details',
  ClaimDetails_LossType: 'Loss Type',
  ClaimDetails_LossDate: 'Loss Date',
  ClaimDetails_LossDescription: 'Loss Description',
  LossLocation_Title: 'Loss Location',
  LossLocation_Street: 'Street',
  LossLocation_SecondaryStreet: 'Secondary Street',
  LossLocation_City: 'City',
  LossLocation_County: 'County',
  LossLocation_State: 'State',
  LossLocation_ZipCode: 'Zip Code',
  YourClaimTeam_Title: 'Your Claim Team',
  YourClaimTeam_Coordinator: 'Coordinator',
  YourClaimTeam_FieldAgent: 'Field Agent',
  ClaimVisualizer_Title: 'Claim Visualizer',
  Actions_Title: 'Actions',
  Link_Actions_ViewDocuments: 'View Documents',
  Link_Actions_ViewMedia: 'View Media',
  Link_Actions_Upload: 'Upload Documents/Media',
  Link_Actions_ScheduleCallback: 'Schedule a Callback',
}

export const JobDetailsPageStrings = {
  Badge: 'Job',
  JobDetails_Title: 'Job Details',
  JobDetails_JobNumber: 'Job Number',
  JobDetails_Type: 'Type',
  JobDetails_Services: 'Services',
  JobDetails_Description: 'Description',
  JobLocation_Title: 'Job Location',
  JobLocation_Street: 'Street',
  JobLocation_SecondaryStreet: 'Secondary Street',
  JobLocation_City: 'City',
  JobLocation_County: 'County',
  JobLocation_State: 'State',
  JobLocation_ZipCode: 'Zip Code',
  YourJobTeam_Title: 'Your Job Team',
  YourJobTeam_Coordinator: 'Coordinator',
  YourJobTeam_ProjectManager: 'Project Manager',
  JobVisualizer_Title: 'Job Visualizer',
  Actions_Title: 'Actions',
  Link_Actions_ViewDocuments: 'View Documents',
  Link_Actions_ViewMedia: 'View Media',
  Link_Actions_Upload: 'Upload Documents/Media',
  Link_Actions_ScheduleCallback: 'Schedule a Callback',
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
  TableFilter_Text_ClaimNumber_Includes: 'Claim Number includes:',
  TableFilter_Text_LossType_Includes: 'Loss Type includes:',
  TableFilter_Text_Job_Includes: 'Job includes:',
  TableFilter_Text_Description_Includes: 'Description includes:',
  TableFilter_Text_Address_Includes: 'Address includes:',
  TableFilter_Text_City_Includes: 'City includes:',
  TableFilter_Text_State_Includes: 'State includes:',
  TableFilter_Text_Zipcode_Includes: 'Zip code includes:',
  TableFilter_Date_AvailableFilters: 'Available Filters',
  TableFilter_Date_LossDate: 'Loss Date:',
}

export const DataTableStrings = {
  OpenTableSettings: 'Open table settings.',
  OpenTableSearch: 'Open table search.',
  AddTableFilter: 'Add table filter.',
  ExpandTable: 'Expand table.',
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

export const NicelyFormedUserPortalAuthOrigins = [
  {
    origin: `https://${userPortal.BASE_URL.split('/')[2]}`,
    localStorage: [
      {
        name: 'chakra-ui-color-mode',
        value: 'light',
      },
      { name: 'companyClaimPortalTour', value: 'true' },
      { name: 'companyJobPortalTour', value: 'true' },
    ],
  },
]

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
  Documents_File,
  Documents_Description,
  Documents_FileName,
  Documents_Created,
  Documents_Download,
  Claims_ClaimNumber,
  Claims_LossType,
  Claims_LossDate,
  Claims_Location,
  Claims_Location_Address,
  Claims_Location_City,
  Claims_Location_State,
  Claims_Location_ZipCode,
  Jobs_JobID,
  Jobs_Type,
  Jobs_Services,
  Jobs_Description,
  Jobs_Location,
  Jobs_Location_Address,
  Jobs_Location_City,
  Jobs_Location_State,
  Jobs_Location_ZipCode,
}

export const DataTable_Columns = {
  File: [DataColumnType.Text, 'title', '', 'FILE'],
  Description: [DataColumnType.Text, 'description', '', 'DESCRIPTION'],
  Filename: [DataColumnType.Text, 'fileName', '', 'FILE NAME'],
  Created: [DataColumnType.Text, 'createdDate', '', 'CREATED'],
  Download: [DataColumnType.Link, 'download', '', ''],
  ClaimNumber: [DataColumnType.Text, 'claimNumber', 'Claim Number', 'CLAIM NUMBER'],
  LossType: [DataColumnType.Text, 'lossType', 'Loss Type', 'LOSS TYPE'],
  LossDate: [DataColumnType.Date, 'lossDate', 'Loss Date', 'LOSS DATE'],
  ClaimLocation: [DataColumnType.Text, 'address', 'Location', 'LOCATION'],
  JobId: [DataColumnType.Text, 'jobId', 'Job', 'JOB'],
  JobType: [DataColumnType.Text, 'type', 'Type', 'TYPE'],
  JobServices: [DataColumnType.Check, 'services', 'Services', 'SERVICES'],
  JobDescription: [DataColumnType.Text, 'description', 'Description', 'DESCRIPTION'],
  JobLocation: [DataColumnType.Text, 'jobLocation', 'Location', 'LOCATION'],
}

export const AbortErrors = {
  EmptyDocumentsTableMessage: 'Documents Table is empty',
  EmptyMediaPageMessage: 'Media page is empty',
  EmptyClaimsTableMessage: 'Claims Table is empty',
  EmptyJobsTableMessage: 'Jobs Table is empty',
  PaginationNotEnoughEntries:
    'Pagination cannot be tested - not enough table entries - need at least 10',
}

export enum PreferredContactMethodSelectionOptions {
  SelectAnOption = 'Select an option',
  Email = 'Email',
  Phone = 'Phone',
}

export enum PreferredTimeOfDaySelectionOptions {
  SelectAnOption = 'Select an option',
  Any = 'Any',
  Morning = 'Morning',
  Afternoon = 'Afternoon',
  Evening = 'Evening',
}

export const FileCardStrings = {
  Label_Title: 'Title',
  Label_FileDescription: 'File Description',
}

export const UploadPageStrings = {
  Title: 'Upload files',
  Instructions: 'Drag and drop files here or click to browse',
  FileTypes: 'Video, Image, PDF, Word, Excel, Xactimate up to 1GB each (max 100 files)',
  Button_SelectFiles: 'Select files',
  Button_Submit: 'Submit',
  Button_ClearAll: 'Clear all',
  ValidationErrorTitle: 'File upload error(s)',
}
