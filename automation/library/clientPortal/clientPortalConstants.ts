import { clientPortal } from '../../environments/env.ceylon.js'
import { CeylonEnvironmentType, DataColumnType } from '../shared/constants.js'
import { ClientPortalLocation } from './clientPortalLocation.js'
import { ClientPortalLocationAbstract } from './clientPortalLocationAbstract.js'
import { ClientPortalWeatherEvent } from './clientPortalWeatherEvent.js'
import { VendorRuleGroup } from './rules/clientPortalVendorRuleGroup.js'

export const DefaultEnvironment = clientPortal.ENVIRONMENT ?? CeylonEnvironmentType.Company_Test

export const NicelyFormedClientPortalAuthOrigins = [
  {
    origin: `https://${clientPortal.BASE_URL.split('/')[2]}`,
    localStorage: [
      {
        name: 'chakra-ui-color-mode',
        value: 'light',
      },
    ],
  },
]

export const ErrorOnAbort = 'ErrorOnAbort'
export const ThrowErrorOnAbort = false

export const TestIncompleteFNOLID = 'TBD'

export const AbortErrors = {
  EmptyVendorsTableMessage: 'Vendors Table is empty',
  EmptyClaimAssignmentRulesTableMessage: 'Claim Assignment Rules Table is empty',
  EmptyMitigationAssignmentRulesTableMessage: 'Mitigation Assignment Rules Table is empty',
  EmptyAttachedServiceAreasTableMessage: 'Mitigation Assignment Rules Table is empty',
  StaticVendorsDoNotExist: 'The static test vendors are missing',
  StaticServiceAreasDoNotExist: 'The static test service areas are missing',
  StaticVendorsAndOrServiceAreasDoNotExist: 'The static test vendors or service areas are missing',
  EmptyServiceAreasTableMessage: 'Service Areas Table is empty',
  EmptyAttachedVendorsTableMessage: 'Attached Vendors Table is empty',
  EmptyGlobalRulesTableMessage: 'Global Rules Table is empty',
  EmptyIncompleteFNOLsTableMessage: 'Incomplete FNOLs Table is empty',
  EmptyWeatherEventsTableMessage: 'Weather Events Table is empty',
}

export const HomePageStrings = {
  Title: 'Home',
  Vendors: 'Vendors',
  GotoVendors: 'Go to Vendors',
  Vendors_Description:
    'A vendor is a company or entity that can be assigned for desk adjusting and/or mitigation work on a claim. In this section, you can add and edit vendors, customize assignment rules, and review or assign service areas to vendors.',
  ServiceAreas: 'Service Areas',
  GotoServiceAreas: 'Go to Service Areas',
  ServiceAreas_Description:
    'A service area is a group of counties in a state that defines an area in which vendors can be assigned. In this section, you can create and edit service areas, as well as add, review, and edit vendors in a service area.',
  GlobalRules: 'Global Rules',
  GotoRules: 'Go to Rules',
  GlobalRules_Description:
    'Global rules are rules that define the behavior of the First Notice of Loss when a claim is submitted through the Company FNOL. In this section, you can configure and edit these global rules.',
  IncompleteFNOLs: 'Incomplete FNOLs',
  GotoIncompleteFNOLs: 'Go to Incomplete FNOLs',
  IncompleteFNOLs_Description:
    'Incomplete FNOLs are FNOLs that were escalated, abandoned, etc. In this section, you can review these FNOLs',
  WeatherEvents: 'Weather Events',
  GotoWeatherEvents: 'Go to Weather Events',
  WeatherEvents_Description:
    'Weather events identify natural disasters that cause widespread damage. In this section, you can add these events so it can be linked to a cause of loss.',
}

export const ServiceAreasPageStrings = {
  Title: 'Service Areas',
  ActionMenu: 'actionMenu',
  ActionMenuAria: 'Open service area menu',
  Button_CreateServiceArea: 'Create Service Area',
}

export const GlobalRulesPageStrings = {
  Title: 'Global Rules',
  ActionMenu: 'actionMenu',
  ActionMenuAria: 'Open global rules action menu',
  Button_CreateGlobalRule: 'Create Global Rule',
}

export const IncompleteFNOLsPageStrings = {
  Title: 'Incomplete FNOLs',
  ActionMenu: 'actionMenu',
  ActionMenuAria: 'Open fnols action menu',
}

export const WeatherEventsPageStrings = {
  Title: 'Weather Events',
  ActionMenu: 'actionMenu',
  ActionMenuAria: 'Open menu',
  Button_CreateWeatherEvent: 'Create Weather Event',
}

export const ClaimAssignmentRulesSectionStrings = {
  Title: 'Assignment Rules',
  ActionMenu: 'actionMenu',
  ActionMenuAria: 'Open menu',
  Button_CreateClaimAssignmentVendorRule: 'Create Rule',
  Button_CreateCustomClaimAssignmentVendorRule: 'Create Custom Rule',
}

export const MitigationAssignmentRulesSectionStrings = {
  Title: 'Mitigation Rules',
  ActionMenu: 'actionMenu',
  ActionMenuAria: 'Open menu',
  Button_CreateMitigationAssignmentVendorRule: 'Create Rule',
  Button_CreateCustomMitigationAssignmentVendorRule: 'Create Custom Rule',
}

export const VendorsPageStrings = {
  Title: 'Vendors',
  ActionMenu: 'actionMenu',
  ActionMenuAria: 'Open vendor menu',
  Button_CreateVendor: 'Create Vendor',
}

export const VendorPageStrings = {
  Link_Vendors: 'Vendors',
  Buton_Actions: 'Actions',
  ActionMenu: 'actionMenu',
  ServiceAreaActionMenuAria: 'Open Service Area Vendor menu',
  Label_GettingStartedHeader: 'Get started with attaching this Vendor to a Service Area',
  Label_GettingStartedDescriptionA:
    'Attaching a Vendor to a Service Area allows you to specify rules that are used to determine whether that Vendor will be included for distribution in that Service Area.',
  Label_GettingStartedDescriptionB:
    'This distribution can be assigned for both claims processing and mitigation services.',
  Button_GettingStartedAttachVendorToServiceArea: 'Attach Vendor to Service Area',
  Button_ViewMap: 'View Map',
  Button_HideMap: 'Hide Map',
  Button_AttachToServiceArea: 'Attach to Service Area',
}

export const ServiceAreaPageStrings = {
  Link_ServiceAreas: 'Service Areas',
  Buton_Actions: 'Actions',
  ActionMenu: 'actionMenu',
  ActionMenuAria: 'Open Service Area Vendor menu',
  Label_GettingStartedHeader: 'Get started with attaching Vendors to a Service Area',
  Label_GettingStartedDescriptionA:
    'Attaching a Vendor to a Service Area allows you to specify rules that are used to determine whether that Vendor will be included for distribution in that Service Area.',
  Label_GettingStartedDescriptionB:
    'This distribution can be assigned for both claims processing and mitigation services.',
  Button_GettingStartedAttachVendorToServiceArea: 'Attach Vendor to Service Area',
  Button_ViewMap: 'View Map',
  Button_HideMap: 'Hide Map',
  Button_AttachVendor: 'Attach Vendor',
  Details_Title: 'Service Area Info',
}

export const ServiceAreaAndVendorPageStrings = {
  Button_Actions: 'Actions',
  Button_ViewMap: 'View Map',
  Button_HideMap: 'Hide Map',
}

export const LeftNavStrings = {
  Title: 'Claims Portal Prep',
  Button_Home: 'Home',
  Button_ServiceAreas: 'Service Areas',
  Button_Vendors: 'Vendors',
  Button_Rules: 'Rules',
  Button_IncompleteFNOLs: 'Incomplete FNOLs',
  Button_WeatherEvents: 'Weather Events',
  Button_Collapse: 'Collapse',
  Button_UserMenu_UIVersion: 'UI v0.9.1',
  Button_UserMenu_Logout: 'Logout',
}

export enum DataTable_Columns_Type {
  Rules_If,
  Rules_Then,
  Rules_IsCustomRule,
  Rules_RuleSummary,
  Vendors_Name,
  Vendors_Enabled,
  Vendors_Website,
  Vendors_DisplayPhone,
  Vendors_DisplayEmail,
  ServiceAreas_AreaName,
  ServiceAreas_State,
  ServiceAreas_Enabled,
  AttachedVendors_VendorName,
  AttachedVendors_InternalName,
  AttachedVendors_HasMitigationAssignmentRulesAssigned,
  AttachedVendors_HasClaimAssignmentRulesAssigned,
  AttachedVendors_StartDate,
  AttachedVendors_EndDate,
  IncompleteFNOLs_IsValid,
  IncompleteFNOLs_ID,
  IncompleteFNOLs_LastUpdated,
  IncompleteFNOLs_LossDate,
  IncompleteFNOLs_LossType,
  IncompleteFNOLs_ReportedBy,
  WeatherEvents_Status,
  WeatherEvents_EventName,
  WeatherEvents_CATCode,
  WeatherEvents_LossType,
  WeatherEvents_StartDate,
  WeatherEvents_EndDate,
  WeatherEvents_AffectedLocations,
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

export enum DataTable_ColumnName_Index {
  Type = 0,
  Access = 1,
  Column = 2,
}

export const DateFilterTypes = {
  Equals: 'Date Equals',
  GreaterThan: 'Date Greater Than',
  LesserThan: 'Date Lesser Than',
}

export enum DataTable_ShowPageSize_Options {
  Show10 = 'Show 10',
  Show20 = 'Show 20',
  Show30 = 'Show 30',
  Show40 = 'Show 40',
  Show50 = 'Show 50',
}

export enum DataTable_Column_SortState {
  NotSortable = 0,
  Unsorted = 1,
  Down_HighToLow = 2,
  Up_LowToHigh = 3,
}

export const DataTable_Columns = {
  If: [DataColumnType.Text, 'conditions', 'If', 'IF'],
  Then: [DataColumnType.Text, 'action', 'Then', 'THEN'],
  RulesSummary: [DataColumnType.Text, 'conditions', 'Rule Summary', 'RULE SUMMARY'],
  IsCustomRule: [DataColumnType.Check, 'hasParent', 'Is Custom Rule?', 'IS CUSTOM RULE?'],
  Name: [DataColumnType.Text, 'name', 'Name', 'NAME'],
  Enabled: [DataColumnType.Check, 'disabled', 'Enabled?', 'ENABLED?'],
  Website: [DataColumnType.Text, 'website', 'Website', 'WEBSITE'],
  DisplayPhone: [DataColumnType.Text, 'displayPhone', 'Display Phone', 'DISPLAY PHONE'],
  DisplayEmail: [DataColumnType.Text, 'displayEmail', 'Display Email', 'DISPLAY EMAIL'],
  AreaName: [DataColumnType.Text, 'areaName', 'Area Name', 'AREA NAME'],
  State: [DataColumnType.Text, 'state', 'State', 'STATE'],
  AreaEnabled: [DataColumnType.Check, 'areaEnabled', 'Enabled?', 'ENABLED?'],
  VendorName: [DataColumnType.Text, 'name', 'Vendor Name', 'VENDOR NAME'],
  InternalName: [DataColumnType.Text, 'internalName', 'Internal Name', 'INTERNAL NAME'],
  HasMitigationAssignmentRulesAssigned: [
    DataColumnType.Check,
    'mitRulesAssigned',
    'Has Mitigation Rules Assigned?',
    'HAS MITIGATION RULES ASSIGNED?',
  ],
  HasClaimAssignmentRulesAssigned: [
    DataColumnType.Check,
    'assignmentRulesAssigned',
    'Has Claims Assignment Rules Assigned?',
    'HAS CLAIMS ASSIGNMENT RULES ASSIGNED?',
  ],
  StartDate: [DataColumnType.Date, 'activeStartDate', 'Start Date', 'START DATE'],
  EndDate: [DataColumnType.Date, 'activeEndDate', 'End Date', 'END DATE'],
  IsValid: [DataColumnType.Check, 'isValid', 'Valid?', 'VALID?'],
  FNOLID: [DataColumnType.Text, 'fnolId', 'ID', 'ID'],
  LastUpdated: [DataColumnType.Date, 'lastUpdated', 'Last Updated', 'LAST UPDATED'],
  LossDate: [DataColumnType.Date, 'lossDate', 'Loss Date', 'LOSS DATE'],
  LossType: [DataColumnType.Text, 'lossType', 'Loss Type', 'LOSS TYPE'],
  ReportedBy: [DataColumnType.Text, 'reportedByLastName', 'Reported By', 'REPORTED BY'],
  Status: [DataColumnType.Text, 'status', 'Status', 'STATUS'],
  EventName: [DataColumnType.Text, 'eventName', 'Event Name', 'EVENT NAME'],
  CATCode: [DataColumnType.Text, 'catCode', 'CAT Code', 'CAT CODE'],
  EffectiveStartDate: [DataColumnType.Date, 'effectiveStartDate', 'Start Date', 'START DATE'],
  EffectiveEndDate: [DataColumnType.Date, 'effectiveEndDate', 'End Date', 'END DATE'],
  AffectedLocations: [
    DataColumnType.Text,
    'affectedLocations',
    'Affected Locations',
    'AFFECTED LOCATIONS',
  ],
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
  TableFilter_Text_If_Includes: 'If includes:',
  TableFilter_Text_Then_Includes: 'Then includes:',
  TableFilter_Text_Name_Includes: 'Name includes:',
  TableFilter_Text_Website_Includes: 'Website includes:',
  TableFilter_Text_DisplayPhone_Includes: 'Display Phone includes:',
  TableFilter_Text_DisplayEmail_Includes: 'Display Email includes:',
  TableFilter_Text_RuleSummary_Includes: 'Rule Summary includes:',
  TableFilter_Text_AreaName_Includes: 'Area Name includes:',
  TableFilter_Text_State_Includes: 'State includes:',
  TableFilter_Text_VendorName_Includes: 'Vendor Name includes:',
  TableFilter_Text_InternalName_Includes: 'Internal Name includes:',
  TableFilter_Text_EventName_Includes: 'Event Name includes:',
  TableFilter_Text_CATCode_Includes: 'CAT Code includes:',
}

export const DrawerStrings = {
  Button_Close: 'Close',
  Button_Cancel: 'Cancel',
  Button_Submit: 'Submit',
  Button_Save: 'Save',
  Button_Back: 'Back',
  Button_Next: 'Next',
  CreateGlobalRule_Title_Create: 'Create Global Rule',
  CreateGlobalRule_Title_Update: 'Update Global Rule',
  CreateVendor_Title_Create: 'Create Vendor',
  CreateVendor_Title_Update: 'Update Vendor',
  CreateVendor_Button_CopyVendorName: 'Copy Vendor Name',
  CreateVendor_Button_CopyDisplayEmail: 'Copy Display Email',
  CreateVendor_Button_CopyDisplayPhone: 'Copy Display Phone',
  AttachVendorToServiceArea_Button_CreateServiceArea: 'Create Service Area',
  AddVendorToServiceArea_Button_CreateVendor: 'Create Vendor',
  CreateServiceArea_Title_Create: 'Create Service Area',
  CreateServiceArea_Title_Update: 'Update Service Area',
  CreateServiceArea_Button_AddCounties: 'Add Counties',
  CreateServiceArea_Button_UpdateCounties: 'Update Counties',
  CreateServiceArea_Button_RemoveAllCounties: 'Remove All Counties',
  CreateVendorRule_Title_Create: 'Create Vendor Rule',
  CreateVendorRule_Title_CreateAssignment: 'Create Assignment Rule',
  CreateVendorRule_Title_CreateMitigation: 'Create Mitigation Rule',
  CreateVendorRule_Title_UpdateAssignment: 'Update Assignment Rule',
  CreateVendorRule_Title_UpdateMitigation: 'Update Mitigation Rule',
  CreateVendorRule_Alert_CreateVendorRule: 'Create Vendor Rule',
  CreateVendorRule_Alert_CreateVendorRuleDescription:
    'This will create a new Vendor Rule; the Rule will not automatically be attached to any relationships this Vendor has with Service Areas. You will have the option to attach the Rule to any Service Area & Vendor relationships after the Rule has been created.',
  SelectCounties_Title: 'Select Counties',
  SelectRulesFromVendor_Title: 'Select Rules From Vendor ',
  SelectRulesFromVendor_Label_SelectRules:
    'Select the rules you would like to apply to this Service Area & Vendor relationship',
  SelectRulesFromVendor_Label_SelectRulesDescription:
    'All, none, or some of the rules may be selected; selected rules can be updated later. Additionally, custom rules may be added after the initial rules from the Vendor have been selected.',
  SelectRulesFromVendor_Checkbox_RuleSummary: 'Rule Summary',
  ApplyRuleToServiceAreas_Title: 'Apply Rule to Service Areas',
  ApplyRuleToServiceAreas_Label_SelectServiceAreasDescription: `Select the Service Areas that you would like to apply the newly created Rule to. This will apply the Rule to this Vendor's relationship with the selected Service Area(s).`,
  ApplyRuleToServiceAreas_Checkbox_ServiceArea: 'Service Area',
  UpdateServiceAreaVendor_Title: 'Update Service Area Vendor',
  UpdateRulesFromVendor_Title: 'Update Rules',
  UpdateRulesFromVendor_Label_SelectRules:
    'Select the rules you would like to apply to this Service Area & Vendor relationship',
  UpdateRulesFromVendor_Label_SelectRulesDescription:
    'All, none, or some of the rules may be selected; selected rules can be updated later. Additionally, custom rules may be added after the initial rules from the Vendor have been selected.',
  CreateWeatherEvent_Title_Create: 'Create Weather Event',
  CreateWeatherEvent_Title_Update: 'Update Weather Event',
  CreateWeatherEvent_Button_AddAffectedLocation: 'Add Affected Location',
  CreateWeatherEvent_Button_RemoveAllLocations: 'Remove All Locations',
}

export const ValidationStrings = {
  AtLeastOneRuleRequired: 'At least 1 rule is required',
  SelectAttribute: 'Please select an attribute',
  FieldRequired: 'This field is required',
  InvalidEmail: 'Invalid email',
  Required: 'Required',
  LessThan10000: 'Number must be less than or equal to 10000', /// > 10000
  ExpectedNumber: 'Expected number, received nan', // -, e
  IncludeServiceAreaName: 'Please include a service area name',
  InvalidAssignmentTypeEnum: `Invalid enum value. Expected 'Assignment' | 'Mitigation', received ''`,
  AtLeastOneCountyShouldBeAdded: 'At least one county should be added.',
}

export enum VendorRuleType {
  Unspecified = '',
  Assignment = 'Claim Assignment',
  Mitigation = 'Mitigation Assignment',
}

export enum GlobalRules_DataTable_ActionMenuItems {
  UpdateGlobalRule = 'Update Global Rule',
  RemoveGlobalRule = 'Remove Global Rule',
}

export enum VendorRules_DataTable_ActionMenuItems {
  CopyRuleID = 'Copy Rule ID',
  AttachRuleToVendorsServiceAreas = `Attach Rule to Vendor's Service Area(s)`,
  UpdateRule = 'Update Rule',
  RemoveRule = 'Remove Rule',
  DetachRule = 'Detach Rule',
}

export enum Vendors_DataTable_ActionMenuItems {
  CopyVendorID = 'Copy Vendor ID',
  UpdateVendor = 'Update Vendor',
  AttachVendorToServiceArea = 'Attach Vendor To Service Area',
  CreateRule = 'Create Rule',
  RemoveVendor = 'Remove Vendor',
}

export enum ServiceAreas_DataTable_ActionMenuItems {
  CopyServiceAreaID = 'Copy Service Area ID',
  UpdateServiceArea = 'Update Service Area',
  AddVendorToServiceArea = 'Add Vendor To Service Area',
  RemoveServiceArea = 'Remove Service Area',
}

export enum AttachedServiceAreas_DataTable_ActionMenuItems {
  CreateCustomRule = 'Create Custom Rule',
  UpdateVendorOverrides = 'Update Vendor Overrides',
  UpdateRulesFromVendor = 'Update Rules from Vendor',
  DetachVendor = 'Detach Vendor',
}

export enum AttachedVendors_DataTable_ActionMenuItems {
  CreateCustomRule = 'Create Custom Rule',
  UpdateVendorOverrides = 'Update Vendor Overrides',
  UpdateRulesFromVendor = 'Update Rules from Vendor',
  DetachVendor = 'Detach Vendor',
}

export enum WeatherEvents_DataTable_ActionMenuItems {
  EditWeatherEvent = 'Edit',
  DeleteWeatherEvent = 'Delete Weather Event',
}

export const AlertStrings = {
  DeleteGlobalRule_Title: 'Confirm Delete',
  DeleteGlobalRule_Description: 'Are you sure you want to delete this Global Rule?',
  RemoveVendor_Title: 'Remove Vendor',
  RemoveVendor_Description: 'Are you sure you want to remove this vendor?',
  RemoveServiceArea_Title: 'Remove %SERVICEAREANAME%',
  RemoveServiceArea_Description:
    'Are you sure you want to remove the %SERVICEAREANAME% service area?',
  RemoveServiceArea_ConfirmationPrompt: 'Type TEST EASTERN WASHINGTON to confirm.',
  DetachVendorRule_Title: 'Confirm Detach Rule',
  DetachVendorRule_Description: 'Are you sure you want to detach this Rule?',
  RemoveRuleFromVendor_Title: 'Remove Rule',
  RemoveRuleFromVendor_Description: 'Are you sure you want to remove this Rule from this Vendor?',
  DetachVendor_Title: 'Confirm Detach Vendor and Service Area',
  DetachVendor_Description: 'Are you sure you want to detach this Vendor?',
  DetachVendor_Description_More:
    'If so, where would you like to be redirected after detaching the Vendor from the Service Area?',
  DetachVendor_Radio_ServiceArea: 'Service Area',
  DetachVendor_Radio_Vendor: 'Vendor',
  DeleteWeatherEvent_Title: 'Confirm Delete',
  DeleteWeatherEvent_Description: 'Are you sure you want to delete this Weather Event?',
}

export const TestServiceAreas = {
  TestEasternWashington: {
    name: 'TEST EASTERN WASHINGTON - DO NOT DELETE',
    state: 'WA',
    area: '42,487',
    enabled: true,
    color: '#3AEC09',
    countiesList: [
      'Garfield, WA',
      'Columbia, WA',
      'Walla Walla, WA',
      'Franklin, WA',
      'Kittitas, WA',
      'Grant, WA',
      'Chelan, WA',
      'Yakima, WA',
      'Benton, WA',
      'Klickitat, WA',
      'Whitman, WA',
      'Asotin, WA',
      'Lincoln, WA',
      'Adams, WA',
      'Stevens, WA',
      'Pend Oreille, WA',
      'Okanogan, WA',
      'Douglas, WA',
      'Ferry, WA',
      'Spokane, WA',
    ],
    countiesToAdd: [],
    stateToAdd: [],
    emails: [],
    attachedVendors: ['Company Restoration', 'Test Vendor A - Do Not Delete'],
    coordinates: '515, 340',
    id: '4IymVjZB9WX1Ca7cXt03Z',
  },
  TestServiceArea_Template_New: {
    name: 'AA_TESTSERVICEAREA',
    state: 'WA',
    area: '42,487',
    enabled: true,
    color: '#C0C0C0',
    countiesList: [],
    countiesToAdd: [],
    stateToAdd: [],
    emails: [],
    attachedVendors: [],
    coordinates: '0,0',
    id: '',
  },
  TestServiceArea_Attachments: {
    name: 'TEST ATTACHMENTS - DO NOT DELETE',
    state: 'FL',
    area: '42,487',
    enabled: true,
    color: '#082EE7',
    countiesList: ['Dade, FL'],
    countiesToAdd: [],
    stateToAdd: [],
    emails: [],
    attachedVendors: [],
    coordinates: '515, 340',
    id: 'Jo8k_LVCd1bdDmQk4GrQE',
  },
}

export const VendorRuleSetsTuples = {
  General_MitigationAssignmentRuleSet: {
    assignment: 'Mitigation Assignment',
    ruleGroups: [
      {
        // Rule Group 0
        combinator: 'And',
        inverted: false,
        assignment: 'Mitigation Assignment',
        hasParent: false,
        rules: [
          // Rule 0
          {
            description: {
              type: 'Array',
              field: 'lossType',
              fieldSource: 'fnol',
              operator: 'is',
              conditions: 'FIRE',
              hasConditionArray: false,
            },
            id: '',
          }, // Rule 1
          {
            description: {
              type: 'Array',
              field: 'lossType',
              fieldSource: 'fnol',
              operator: 'isoneof',
              conditions: ['WATER', 'WIND'],
              hasConditionArray: true,
            },
            id: '',
          },
        ],
      },
      {
        // Rule Group 1
        combinator: 'And',
        inverted: false,
        assignment: 'Mitigation Assignment',
        hasParent: false,
        rules: [
          // Rule 0
          {
            description: {
              type: 'Array',
              field: 'lossType',
              fieldSource: 'fnol',
              operator: 'is',
              conditions: 'FIRE',
              hasConditionArray: false,
            },
            id: '',
          }, // Rule 1
          {
            description: {
              type: 'Array',
              field: 'lossType',
              fieldSource: 'fnol',
              operator: 'isoneof',
              conditions: ['WATER'],
              hasConditionArray: true,
            },
            id: '',
          },
        ],
      },
    ],
  },
  General_ClaimAssignmentRuleSet: {
    assignment: 'Claim Assignment',
    ruleGroups: [
      {
        // RuleGroup 0
        combinator: 'And',
        inverted: false,
        assignment: 'Claim Assignment',
        hasParent: false,
        rules: [
          // Rule 0
          {
            description: {
              type: 'List',
              field: 'damagedPropertyAreas',
              fieldSource: 'fnol',
              operator: 'lengthlessthan',
              conditions: '99',
              hasConditionArray: false,
            },
            id: '',
          }, // Rule 1
          {
            description: {
              type: 'List',
              field: 'damagedPropertyAreas',
              fieldSource: 'fnol',
              operator: 'lengthgreaterthan',
              conditions: '13',
              hasConditionArray: false,
            },
            id: '',
          },
        ],
      },
      {
        // RuleGroup 1
        combinator: 'And',
        inverted: false,
        assignment: 'Claim Assignment',
        hasParent: false,
        rules: [
          // Rule 0
          {
            description: {
              type: 'List',
              field: 'damagedPropertyAreas',
              fieldSource: 'fnol',
              operator: 'lengthlessthan',
              conditions: '99',
              hasConditionArray: false,
            },
            id: '',
          }, // Rule 1
          {
            description: {
              type: 'List',
              field: 'damagedPropertyAreas',
              fieldSource: 'fnol',
              operator: 'lengthgreaterthan',
              conditions: '13',
              hasConditionArray: false,
            },
            id: '',
          },
        ],
      },
    ],
  },
  VendorC_ClaimAssignmentRuleSet: {
    assignment: 'Claim Assignment',
    ruleGroups: [
      {
        combinator: 'And',
        inverted: false,
        assignment: 'Claim Assignment',
        hasParent: false,
        rules: [
          {
            description: {
              type: 'Text',
              field: 'productType',
              fieldSource: 'policy',
              operator: 'is',
              value: 'Amazing',
            },
            id: '',
          },
        ],
      },
      {
        combinator: 'And',
        inverted: false,
        assignment: 'Claim Assignment',
        hasParent: false,
        rules: [
          {
            description: {
              type: 'Array',
              field: 'lossType',
              fieldSource: 'fnol',
              operator: 'isoneof',
              conditions: ['WATER'],
              hasConditionArray: true,
            },
            id: '',
          },
        ],
      },
    ],
  },
  VendorC_MitigationAssignmentRuleSet: {
    assignment: 'Mitigation Assignment',
    ruleGroups: [
      {
        combinator: 'And',
        inverted: false,
        assignment: 'Mitigation Assignment',
        hasParent: false,
        rules: [
          {
            description: {
              type: 'Text',
              field: 'productType',
              fieldSource: 'policy',
              operator: 'contains',
              value: 'tadpole',
            },
            id: '',
          },
        ],
      },
      {
        combinator: 'And',
        inverted: false,
        assignment: 'Mitigation Assignment',
        hasParent: false,
        rules: [
          {
            description: {
              type: 'Array',
              field: 'lossType',
              fieldSource: 'fnol',
              operator: 'is',
              conditions: 'FIRE',
              hasConditionArray: false,
            },
            id: '',
          },
        ],
      },
    ],
  },
}

export const TestVendors = {
  TestVendorA: {
    name: 'Test Vendor A - DO NOT DELETE',
    internalName: 'Test Vendor A - Internal',
    displayEmail: 'testVendorA@vendors.com',
    notificationEmail: 'testVendorA@vendors.com',
    displayPhone: '4257360215',
    notificationPhone: '4257360215',
    website: 'www.testvendors.com',
    enabled: true,
    capacities: [
      { key: 'Claim Assignment', value: 10 },
      { key: 'Mitigation Assignment', value: 50 },
    ],
    additionalProperties: [
      { key: 'TestProperty', value: 'VendorA' },
      { key: 'VendorID', value: 'sN_dLkgdNruCFILSvWVFD' },
    ],
    ruleGroups: [] as VendorRuleGroup[],
    ruleTest: null,
    attachedServiceAreas: [],
    id: 'sN_dLkgdNruCFILSvWVFD',
  },
  TestVendorB: {
    name: 'Test Vendor B - DO NOT DELETE',
    internalName: 'Test Vendor B - Internal',
    displayEmail: 'testVendorB@vendors.com',
    notificationEmail: 'testVendorB@vendors.com',
    displayPhone: '4259992947',
    notificationPhone: '4259992947',
    website: 'www.testvendors.com',
    enabled: true,
    capacities: [
      { key: 'Claim Assignment', value: 20 },
      { key: 'Mitigation Assignment', value: 100 },
    ],
    additionalProperties: [
      { key: 'TestProperty', value: 'VendorB' },
      { key: 'VendorID', value: 'reada' },
    ],
    ruleGroups: [] as VendorRuleGroup[],
    ruleTest: null,
    attachedServiceAreas: [],
    id: 'redacted',
  },
  TestVendorC_WithRules: {
    name: 'Test Vendor C - DO NOT DELETE',
    internalName: 'Test Vendor C - Internal',
    displayEmail: 'testVendorC@vendors.com',
    notificationEmail: 'testVendorC@vendors.com',
    displayPhone: '4259992947',
    notificationPhone: '4259992947',
    website: 'www.testvendors.com',
    enabled: true,
    capacities: [
      { key: 'Claim Assignment', value: 0 },
      { key: 'Mitigation Assignment', value: 0 },
    ],
    additionalProperties: [],
    ruleGroups: [
      VendorRuleSetsTuples.VendorC_ClaimAssignmentRuleSet.ruleGroups[0],
      VendorRuleSetsTuples.VendorC_MitigationAssignmentRuleSet.ruleGroups[0],
    ],
    ruleTest: null,
    attachedServiceAreas: [TestServiceAreas.TestServiceArea_Attachments],
    id: 'UHfJilfvOGstKGOVRu5r9',
  },
  TestVendor_Template_New: {
    name: 'AA_TESTVENDOR',
    internalName: 'AA_TESTVENDOR',
    displayEmail: 'test@test.com',
    notificationEmail: 'test-notifications@test.com',
    displayPhone: '8001234567',
    notificationPhone: '8001237890',
    website: 'www.testvendors.com',
    enabled: true,
    capacities: [
      { key: 'Claim Assignment', value: 0 },
      { key: 'Mitigation Assignment', value: 0 },
    ],
    additionalProperties: [
      { key: 'TestProperty', value: 'AA_TESTVENDOR' },
      { key: 'VendorID', value: 'none' },
    ],
    ruleGroups: [] as VendorRuleGroup[],
    ruleTest: null,
    attachedServiceAreas: [],
    id: '',
  },
  TestVendor_Template_Overrides: {
    name: 'AA_TESTVENDOR_OVERRIDE',
    internalName: '',
    displayEmail: '',
    notificationEmail: 'override@test.com',
    displayPhone: '',
    notificationPhone: '8660984321',
    website: 'www.override.com',
    enabled: null,
    capacities: [],
    additionalProperties: [{ key: 'VendorID', value: 'override' }],
    ruleGroups: [] as VendorRuleGroup[],
    ruleTest: null,
    attachedServiceAreas: [],
    id: '',
  },
  TestVendor_Template_Overrides_Empty: {
    name: '',
    internalName: '',
    displayEmail: '',
    notificationEmail: '',
    displayPhone: '',
    notificationPhone: '',
    website: '',
    enabled: null,
    capacities: [],
    additionalProperties: [],
    ruleGroups: [] as VendorRuleGroup[],
    ruleTest: null,
    attachedServiceAreas: [],
    id: '',
  },
}

export const GlobalRuleSetsTuples = {
  Default: [
    {
      combinator: 'And',
      inverted: false,
      items: [
        {
          type: 'Rule',
          item: {
            description: {
              type: 'DateTime',
              field: 'effectiveDate',
              fieldSource: 'policy',
              operator: 'isbefore',
              value: 1,
              timeframe: 'years',
            },
          },
          dataLevel: 1,
          dataPath: '0',
        },
        {
          type: 'RuleGroup',
          item: {
            combinator: 'And',
            inverted: false,
            items: [
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'Array',
                    field: 'lossType',
                    fieldSource: 'fnol',
                    operator: 'isoneof',
                    conditions: ['HURRICANE', 'FIRE', 'WIND'],
                    hasConditionArray: true,
                  },
                },
                dataLevel: 2,
                dataPath: '1,0',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'Boolean',
                    field: 'windCoverage',
                    fieldSource: 'policy',
                    operator: 'is',
                    condition: 'false',
                  },
                },
                dataLevel: 2,
                dataPath: '1,1',
              },
            ],
          },
          dataLevel: 1,
          dataPath: '1',
        },
      ],
      attributeName: 'isFastPath',
      attributeDescription: false,
    },
    {
      combinator: 'And',
      inverted: false,
      items: [
        {
          type: 'Rule',
          item: {
            description: {
              type: 'DateTime',
              field: 'lossDate',
              fieldSource: 'fnol',
              operator: 'isbefore',
              value: 7,
              timeframe: 'days',
            },
          },
          dataLevel: 1,
          dataPath: '0',
        },
      ],
      attributeName: 'isFastPath',
      attributeDescription: true,
    },
    {
      combinator: 'And',
      inverted: false,
      items: [
        {
          type: 'Rule',
          item: {
            description: {
              type: 'List',
              field: 'damagedPropertyAreas',
              fieldSource: 'fnol',
              operator: 'isoneof',
              conditions: ['Interior'],
              hasConditionArray: true,
            },
          },
          dataLevel: 1,
          dataPath: '0',
        },
      ],
      attributeName: 'isFastPath',
      attributeDescription: false,
    },
  ],
  SimpleToComplex: [
    {
      combinator: 'Or',
      inverted: true,
      items: [
        {
          type: 'Rule',
          item: {
            description: {
              type: 'Text',
              field: 'agencyCode',
              fieldSource: 'policy',
              operator: 'is',
              value: '123',
            },
          },
          dataLevel: 1,
          dataPath: '0',
        },
        {
          type: 'RuleGroup',
          item: {
            combinator: 'And',
            inverted: false,
            items: [
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'List',
                    field: 'damagedPropertyAreas',
                    fieldSource: 'fnol',
                    operator: 'isoneof',
                    conditions: ['Exterior'],
                    hasConditionArray: true,
                  },
                },
                dataLevel: 2,
                dataPath: '1,0',
              },
              {
                type: 'RuleGroup',
                item: {
                  combinator: 'Or',
                  inverted: true,
                  items: [
                    {
                      type: 'Rule',
                      item: {
                        description: {
                          type: 'Boolean',
                          field: 'windCoverage',
                          fieldSource: 'policy',
                          operator: 'is',
                          condition: 'true',
                        },
                      },
                      dataLevel: 3,
                      dataPath: '1,1,0',
                    },
                    {
                      type: 'Rule',
                      item: {
                        description: {
                          type: 'Boolean',
                          field: 'inForce',
                          fieldSource: 'policy',
                          operator: 'is',
                          condition: 'false',
                        },
                      },
                      dataLevel: 3,
                      dataPath: '1,1,1',
                    },
                  ],
                },
                dataLevel: 2,
                dataPath: '1,1',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'Boolean',
                    field: 'inForce',
                    fieldSource: 'policy',
                    operator: 'is',
                    condition: 'true',
                  },
                },
                dataLevel: 2,
                dataPath: '1,2',
              },
            ],
          },
          dataLevel: 1,
          dataPath: '1',
        },
        {
          type: 'Rule',
          item: {
            description: {
              type: 'List',
              field: 'damagedPropertyAreas',
              fieldSource: 'fnol',
              operator: 'isoneof',
              conditions: ['Exterior'],
              hasConditionArray: true,
            },
          },
          dataLevel: 1,
          dataPath: '2',
        },
        {
          type: 'Rule',
          item: {
            description: {
              type: 'Boolean',
              field: 'inForce',
              fieldSource: 'policy',
              operator: 'is',
              condition: 'true',
            },
          },
          dataLevel: 1,
          dataPath: '3',
        },
        {
          type: 'Rule',
          item: {
            description: {
              type: 'DateTime',
              field: 'lossDate',
              fieldSource: 'fnol',
              operator: 'isafter',
              value: 3,
              timeframe: 'days',
            },
          },
          dataLevel: 1,
          dataPath: '4',
        },
      ],
      attributeName: 'isFastPath',
      attributeDescription: false,
    },
    {
      combinator: 'And',
      inverted: true,
      items: [
        {
          type: 'Rule',
          item: {
            description: {
              type: 'Text',
              field: 'agencyName',
              fieldSource: 'policy',
              operator: 'isnot',
              value: 'MySpace',
            },
          },
          dataLevel: 1,
          dataPath: '0',
        },
        {
          type: 'RuleGroup',
          item: {
            combinator: 'And',
            inverted: true,
            items: [
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'List',
                    field: 'damagedPropertyAreas',
                    fieldSource: 'fnol',
                    operator: 'isoneof',
                    conditions: ['Interior'],
                    hasConditionArray: true,
                  },
                },
                dataLevel: 2,
                dataPath: '1,0',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'Boolean',
                    field: 'windCoverage',
                    fieldSource: 'policy',
                    operator: 'is',
                    condition: 'true',
                  },
                },
                dataLevel: 2,
                dataPath: '1,1',
              },
            ],
          },
          dataLevel: 1,
          dataPath: '1',
        },
      ],
      attributeName: 'isFastPath',
      attributeDescription: false,
    },
    {
      combinator: 'And',
      inverted: true,
      items: [
        {
          type: 'Rule',
          item: {
            description: {
              type: 'Text',
              field: 'eventName',
              fieldSource: 'fnol',
              operator: 'contgains',
              value: 'Big RainStorm',
            },
          },
          dataLevel: 1,
          dataPath: '0',
        },
        {
          type: 'RuleGroup',
          item: {
            combinator: 'And',
            inverted: false,
            items: [
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'List',
                    field: 'damagedPropertyAreas',
                    fieldSource: 'fnol',
                    operator: 'isoneof',
                    conditions: ['Interior'],
                    hasConditionArray: true,
                  },
                },
                dataLevel: 2,
                dataPath: '1,0',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'Boolean',
                    field: 'inForce',
                    fieldSource: 'policy',
                    operator: 'is',
                    condition: 'true',
                  },
                },
                dataLevel: 2,
                dataPath: '1,1',
              },
            ],
          },
          dataLevel: 1,
          dataPath: '1',
        },
      ],
      attributeName: 'isFastPath',
      attributeDescription: false,
    },
    {
      combinator: 'And',
      inverted: false,
      items: [
        {
          type: 'Rule',
          item: {
            description: {
              type: 'Text',
              field: 'locationCity',
              fieldSource: 'policy',
              operator: 'beginswith',
              value: 'San Fra',
            },
          },
          dataLevel: 1,
          dataPath: '0',
        },
        {
          type: 'RuleGroup',
          item: {
            combinator: 'And',
            inverted: false,
            items: [
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'List',
                    field: 'damagedPropertyAreas',
                    fieldSource: 'fnol',
                    operator: 'isoneof',
                    conditions: ['Interior'],
                    hasConditionArray: true,
                  },
                },
                dataLevel: 2,
                dataPath: '1,0',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'Boolean',
                    field: 'windCoverage',
                    fieldSource: 'policy',
                    operator: 'is',
                    condition: 'true',
                  },
                },
                dataLevel: 2,
                dataPath: '1,1',
              },
            ],
          },
          dataLevel: 1,
          dataPath: '1',
        },
      ],
      attributeName: 'isFastPath',
      attributeDescription: false,
    },
    {
      combinator: 'And',
      inverted: true,
      items: [
        {
          type: 'Rule',
          item: {
            description: {
              type: 'Text',
              field: 'source',
              fieldSource: 'fnol',
              operator: 'endswith',
              value: 'powpowpow',
            },
          },
          dataLevel: 1,
          dataPath: '0',
        },
        {
          type: 'Rule',
          item: {
            description: {
              type: 'Boolean',
              field: 'inForce',
              fieldSource: 'policy',
              operator: 'is',
              condition: 'true',
            },
          },
          dataLevel: 1,
          dataPath: '1',
        },
      ],
      attributeName: 'isFastPath',
      attributeDescription: false,
    },
    {
      combinator: 'And',
      inverted: false,
      items: [
        {
          type: 'Rule',
          item: {
            description: {
              type: 'Text',
              field: 'companyCode',
              fieldSource: 'policy',
              operator: 'is',
              value: '123',
            },
          },
          dataLevel: 1,
          dataPath: '0',
        },
        {
          type: 'Rule',
          item: {
            description: {
              type: 'Boolean',
              field: 'inForce',
              fieldSource: 'policy',
              operator: 'is',
              condition: 'true',
            },
          },
          dataLevel: 1,
          dataPath: '1',
        },
      ],
      attributeName: 'isFastPath',
      attributeDescription: false,
    },
    {
      combinator: 'And',
      inverted: true,
      items: [
        {
          type: 'Rule',
          item: {
            description: {
              type: 'Text',
              field: 'locationCounty',
              fieldSource: 'policy',
              operator: 'isnot',
              value: 'Spokane',
            },
          },
          dataLevel: 1,
          dataPath: '0',
        },
      ],
      attributeName: 'isFastPath',
      attributeDescription: false,
    },
    {
      combinator: 'And',
      inverted: false,
      items: [
        {
          type: 'Rule',
          item: {
            description: {
              type: 'Text',
              field: 'locationState',
              fieldSource: 'policy',
              operator: 'contains',
              value: 'xy',
            },
          },
          dataLevel: 1,
          dataPath: '0',
        },
      ],
      attributeName: 'isFastPath',
      attributeDescription: false,
    },
  ],
  TimeStamp: [
    {
      combinator: 'And',
      inverted: false,
      items: [
        {
          type: 'Rule',
          item: {
            description: {
              type: 'Text',
              field: 'agencyCode',
              fieldSource: 'policy',
              operator: 'is',
              value: '123',
            },
          },
          dataLevel: 1,
          dataPath: '0',
        },
      ],
      attributeName: 'isFastPath',
      attributeDescription: false,
    },
  ],
  Variations: [
    {
      combinator: 'And',
      inverted: false,
      items: [
        {
          type: 'Rule',
          item: {
            description: {
              type: 'Text',
              field: 'companyName',
              fieldSource: 'policy',
              operator: 'is',
              value: 'BuyNLarge',
            },
          },
          dataLevel: 1,
          dataPath: '0',
        },
        {
          type: 'RuleGroup',
          item: {
            combinator: 'And',
            inverted: false,
            items: [
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'Text',
                    field: 'companyName',
                    fieldSource: 'policy',
                    operator: 'isnot',
                    value: 'BuyNLarge',
                  },
                },
                dataLevel: 2,
                dataPath: '1,0',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'Text',
                    field: 'companyName',
                    fieldSource: 'policy',
                    operator: 'contains',
                    value: 'BuyNLarge',
                  },
                },
                dataLevel: 2,
                dataPath: '1,1',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'Text',
                    field: 'companyName',
                    fieldSource: 'policy',
                    operator: 'beginswith',
                    value: 'BuyNLarge',
                  },
                },
                dataLevel: 2,
                dataPath: '1,2',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'Text',
                    field: 'companyName',
                    fieldSource: 'policy',
                    operator: 'endswith',
                    value: 'BuyNLarge',
                  },
                },
                dataLevel: 2,
                dataPath: '1,3',
              },
            ],
          },
          dataLevel: 1,
          dataPath: '1',
        },
        {
          type: 'RuleGroup',
          item: {
            combinator: 'And',
            inverted: false,
            items: [
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'List',
                    field: 'damagedPropertyAreas',
                    fieldSource: 'fnol',
                    operator: 'isoneof',
                    conditions: ['Interior', 'Exterior', 'Roof'],
                    hasConditionArray: true,
                  },
                },
                dataLevel: 2,
                dataPath: '2,0',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'List',
                    field: 'damagedPropertyAreas',
                    fieldSource: 'fnol',
                    operator: 'hasallof',
                    conditions: ['Roof', 'Contents'],
                    hasConditionArray: true,
                  },
                },
                dataLevel: 2,
                dataPath: '2,1',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'List',
                    field: 'damagedPropertyAreas',
                    fieldSource: 'fnol',
                    operator: 'hasexactly',
                    conditions: ['Interior', 'Exterior'],
                    hasConditionArray: true,
                  },
                },
                dataLevel: 2,
                dataPath: '2,2',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'List',
                    field: 'damagedPropertyAreas',
                    fieldSource: 'fnol',
                    operator: 'lengthgreaterthan',
                    conditions: '1',
                    hasConditionArray: false,
                  },
                },
                dataLevel: 2,
                dataPath: '2,3',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'List',
                    field: 'damagedPropertyAreas',
                    fieldSource: 'fnol',
                    operator: 'lengthlessthan',
                    conditions: '1',
                    hasConditionArray: false,
                  },
                },
                dataLevel: 2,
                dataPath: '2,4',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'List',
                    field: 'damagedPropertyAreas',
                    fieldSource: 'fnol',
                    operator: 'lengthequalto',
                    conditions: '3',
                    hasConditionArray: false,
                  },
                },
                dataLevel: 2,
                dataPath: '2,5',
              },
            ],
          },
          dataLevel: 1,
          dataPath: '2',
        },
        {
          type: 'RuleGroup',
          item: {
            combinator: 'And',
            inverted: false,
            items: [
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'Boolean',
                    field: 'windCoverage',
                    fieldSource: 'policy',
                    operator: 'is',
                    condition: 'true',
                  },
                },
                dataLevel: 2,
                dataPath: '3,0',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'Boolean',
                    field: 'inForce',
                    fieldSource: 'policy',
                    operator: 'is',
                    condition: 'false',
                  },
                },
                dataLevel: 2,
                dataPath: '3,1',
              },
            ],
          },
          dataLevel: 1,
          dataPath: '3',
        },
        {
          type: 'RuleGroup',
          item: {
            combinator: 'And',
            inverted: false,
            items: [
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'Array',
                    field: 'lossType',
                    fieldSource: 'fnol',
                    operator: 'is',
                    conditions: 'FIRE',
                    hasConditionArray: false,
                  },
                },
                dataLevel: 2,
                dataPath: '4,0',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'Array',
                    field: 'reportedByRelationship',
                    fieldSource: 'fnol',
                    operator: 'isnot',
                    conditions: 'AGENT',
                    hasConditionArray: false,
                  },
                },
                dataLevel: 2,
                dataPath: '4,1',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'Array',
                    field: 'lossType',
                    fieldSource: 'fnol',
                    operator: 'isoneof',
                    conditions: ['FIRE', 'SINKHOLE', 'LIGHTNING'],
                    hasConditionArray: true,
                  },
                },
                dataLevel: 2,
                dataPath: '4,2',
              },
            ],
          },
          dataLevel: 1,
          dataPath: '4',
        },
        {
          type: 'RuleGroup',
          item: {
            combinator: 'And',
            inverted: false,
            items: [
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'DateTime',
                    field: 'lossDate',
                    fieldSource: 'fnol',
                    operator: 'isafter',
                    value: 1,
                    timeframe: 'minutes',
                  },
                },
                dataLevel: 2,
                dataPath: '5,0',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'DateTime',
                    field: 'effectiveDate',
                    fieldSource: 'policy',
                    operator: 'isbefore',
                    value: 1,
                    timeframe: 'hours',
                  },
                },
                dataLevel: 2,
                dataPath: '5,1',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'DateTime',
                    field: 'lossDate',
                    fieldSource: 'fnol',
                    operator: 'isafter',
                    value: 1,
                    timeframe: 'days',
                  },
                },
                dataLevel: 2,
                dataPath: '5,2',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'DateTime',
                    field: 'effectiveDate',
                    fieldSource: 'policy',
                    operator: 'isbefore',
                    value: 1,
                    timeframe: 'weeks',
                  },
                },
                dataLevel: 2,
                dataPath: '5,3',
              },
              {
                type: 'Rule',
                item: {
                  description: {
                    type: 'DateTime',
                    field: 'lossDate',
                    fieldSource: 'fnol',
                    operator: 'isafter',
                    value: 1,
                    timeframe: 'years',
                  },
                },
                dataLevel: 2,
                dataPath: '5,4',
              },
            ],
          },
          dataLevel: 1,
          dataPath: '5',
        },
      ],
      attributeName: 'isFastPath',
      attributeDescription: false,
    },
  ],
}
export const CountyTuples = {
  TX_Brewster: {
    name: 'Brewster',
    state: 'TX',
    coordinates: [787, 868],
  },
  WA_Spokane: {
    name: 'Spokane',
    state: 'WA',
    coordinates: [465, 345],
  },
  WA_PendOrielle: {
    name: 'Pend Oreille',
    state: 'WA',
    coordinates: [470, 317],
  },
  CA_SanBernadino: {
    name: 'San Bernadino',
    state: 'CA',
    coordinates: [505, 744],
  },
}

export const StateTuples = {
  WA_Washington: {
    name: 'Washington',
    state: 'WA',
    coordinates: [399, 359],
  },
}

// export const EagleWeatherEvents = {
//   Fire: {
//     name: 'Fiery Freddy',
//     catCode: '1114',
//     lossType: 'FIRE',
//     startDate: '3/31/2025',
//     EndDate: '9/30/2025',
//     affectedLocation: ['Hillsborough, FL', 'Duval, FL'],
//   },
//   Hail: {
//     name: 'Hailing Hillary',
//     catCode: '1111',
//     lossType: 'HAIL',
//     startDate: '3/31/2025',
//     EndDate: '9/30/2025',
//     affectedLocation: ['Duval, FL'],
//   },
//   Hurricane: {
//     name: 'Hurricane Harry',
//     catCode: '1113',
//     lossType: 'HURRICANE',
//     startDate: '3/30/2025',
//     EndDate: '9/29/2025',
//     affectedLocation: ['Pasco, FL'],
//   },
//   Water: {
//     name: 'Typhoon Timmy',
//     catCode: '1112',
//     lossType: 'WATER',
//     startDate: '3/30/2025',
//     EndDate: '9/29/2025',
//     affectedLocation: ['Orange, FL'],
//   },
// }

export const TestWeatherEvents = {
  WeatherEventA: {
    name: 'Test Weather Event A',
    catCode: '0001',
    lossType: 'Made Up Loss',
    startDate: 'Jan 01, 2025',
    endDate: 'Dec 31, 2025',
    affectedAbstract: [
      {
        state: 'WA',
        count: 1,
      } as ClientPortalLocationAbstract,
    ],
    affectedLocations: [CountyTuples.WA_Spokane as ClientPortalLocation],
  } as ClientPortalWeatherEvent,
}
