export const PageStrings = {
  TitlePage_CompanyInspectionsInfo_Title: 'Company Inspections',
  TitlePage_CompanyInspectionsInfo_Description1:
    'Company Inspections is an app intended to be used by employees and contractors of Company. Please use the account provided by Company to sign in.',
  TitlePage_CompanyInspectionsInfo_Description2:
    'If you do not have an account or are unsure what your login is, please reach out to Company Customer Service.',
  TitlePage_Button_SignIn: 'Sign In',
  TitlePage_Button_Help: 'Help',
  HomePage_Title: 'Claims Inspector',
  HomePage_Avatar: 'Avatar',
  HomePage_SearchClaims_Placeholder: 'Search claims...',
  HomePage_NoClaimsFoundAlert_Title: 'No claims found',
  HomePage_NoClaimsFoundAlert_Description:
    'We could not find any claims assigned to you. Please contact Company Customer Service if you believe this to be an error.',
  HomePage_Button_Home: 'Home',
  HomePage_Button_Uploads: 'Uploads',
  ClaimDetailsPage_Title_Prefix: 'Claim #',
  ClaimDetailsPage_Button_UploadInspection: 'Upload Inspection',
  ClaimDetailsPage_Button_ViewNotes: 'View Notes',
  ClaimDetailsPage_Button_CreateNote: 'Create Note',
  ClaimDetailsPage_PolicyNumber_Prefix: 'Policy #: ',
  ClaimDetailsPage_Label_PropertyAddress: 'PROPERTY ADDRESS',
  ClaimDetailsPage_Label_LossDescription: 'LOSS DESCRIPTION',
  ClaimDetailsPage_Label_Notes: 'NOTES',
  UploadInspectionPage_Title_Prefix: 'Claim #',
  UploadInspectionPage_InspectionUploadInfo_Title: 'Inspection Upload',
  UploadInspectionPage_InspectionUploadInfo_Description:
    'Select a video and images from your inspection to upload. It is recommended to record your video in 1080p in order to balance quality and file size. Videos are currently required to be less than 1 gigabyte in size in order to be able to uploaded.',
  UploadInspectionPage_Button_AddPhotos: 'Add Photo(s)',
  UploadInspectionPage_Button_SelectVideo: 'Select Video',
  UploadInspectionPage_Button_Submit: 'Submit',
  UploadsPage_Button_InProgress: 'In Progress',
  UploadsPage_Button_Errors: 'Errors',
  UploadsPage_Button_Completed: 'Completed',
  Auth0SignInPage_Username: 'username',
  Auth0SignInPage_Code: 'code',
  Auth0SignInPage_Button_Continue: 'Continue',
  Auth0SignInPage_Title: 'Log in to Company Delegate Portal (devenv) to continue to Paprika (devenv).',
}

export const QueueStrings = {
  UploadQueue_Title: 'Upload Queue',
  UploadQueue_EmptyMessage: 'No uploads have been queued.',
  ErrorQueue_Title: 'Error Queue',
  ErrorQueue_Button_RemoveAll: 'Remove All',
  ErrorQueue_ErrorsInfo_Title: 'Errors',
  ErrorQueue_ErrorsInfo_Description:
    'Items that have been failed to upload will appear here. You can retry them or remove them.',
  ErrorQueue_EmptyMessage: 'There are no items in the error queue',
  CompletedQueue_Title: 'Completed',
  CompletedQueue_Button_RemoveAll: 'Remove All',
  CompletedQueue_CompletedItemsInfo_Title: 'Completed Items',
  CompletedQueue_CompletedItemsInfo_Description:
    'Items that have been successfully uploaded will appear here. They will periodically be removed when they are more thatn 24 hours old.',
  CompletedQueue_EmptyMessage: 'There are no recent completed items',
}

export enum UploadQueues {
  InProgress,
  Errors,
  CompletedItems,
}

export enum TestTargets {
  Emulator,
  Device,
}

export enum OSTargets {
  Android,
  IOS,
}

export enum PhotoLabels {
  Outdoor_EstimatorInfo = 'Estimator Info',
  Outdoor_AddressVerification = 'Address Verification',
  Outdoor_FrontElevation = 'Front Elevation',
  Outdoor_RightElevation = 'Right Elevation',
  Outdoor_LeftElevation = 'Left Elevation',
  Outdoor_RearElevation = 'Rear Elevation',
  Indoor_Kitchen = 'Kitchen',
  Indoor_MasterBedroom = 'Master Bedroom',
  Indoor_Bedroom = 'Bedroom',
  Indoor_LivingRoom = 'Living Room',
  Indoor_Entry = 'Entry',
  Indoor_Office = 'Office',
  Indoor_GuestBedroom = 'Guest Bedroom',
  Indoor_Den = 'Den',
  Indoor_DiningRoom = 'Dining Room',
}

export enum CannedClaimTypes {
  DefaultTestClaim,
}
