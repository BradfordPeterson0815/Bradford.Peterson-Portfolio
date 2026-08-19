export enum CeylonEnvironmentType {
  Company_Dev = 'company_dev',
  Company_QA = 'company_qa',
  Company_Prod = 'company_prod',
  Company_Test = 'company_test',
  Client_UAT = 'client_uat',
  Client_PROD = 'client_prod',
}

export enum BotpressEnvironmentType {
  Development = 'development',
  devenv = 'devenv',
}

export enum AppiumEnvironmentType {
  Company_Release = 'company_release',
  Company_Development = 'company_development',
  Company_Preview = 'company_preview',
  Client_Release = 'client_release',
}

export enum DataColumnType {
  ActionMenu,
  Text,
  Link,
  Date,
  Time,
  Contact,
  Check,
}

export const ErrorOnAbort = 'ErrorOnAbort'
export const ThrowErrorOnAbort = false

export enum Tags {
  Smoke = '@smoke',
  Fast = '@fast',
  Slow = '@slow',
  ClaimsPortal = '@claimsportal',
  Delegate = '@delegate',
  FieldAgent = '@fieldadjuster',
  InspectionTech = '@inspectiontechnician',
  Subcontractor = '@subcontractor',
  FieldTech = '@fieldtechnician',
  UserPortal = '@userportal',
  ClientPortal = '@clientportal',
  Botpress = '@botpress',
  Claim = '@claim',
  Job = '@job',
  Jobs = '@jobs',
  Templates = '@templates',
  CommunicationTemplates = '@communicationtemplates',
  DocumentTemplates = '@documenttemplates',
  NoteTemplates = '@notetemplates',
  Contacts = '@contacts',
  ContactsBook = '@contactsbook',
  GlobalBooks = '@globalbooks',
  HomePage = '@homepage',
  Inbox = '@inbox',
  Estimates = '@estimates',
  EstimatorSchedules = '@estimatorschedules',
  DelegateSchedules = '@delegateschedules',
  LossReport = '@lossreport',
  Documents = '@documents',
  DraftDocuments = '@draftdocuments',
  Media = '@media',
  Inspection = '@inspection',
  Inspections = '@inspections',
  Portals = '@portals',
  PortalAccess = '@portalaccess',
  LossOfUse = '@lossofuse',
  Notes = '@notes',
  Callbacks = '@callbacks',
  PhotoReport = '@photoreport',
  InfoDetails = '@infodetails',
  Upload = '@upload',
  Schedule = '@schedule',
  Admin = '@admin',
  Timeline = '@timeline',
  WorkAuthorizations = '@workauthorizations',
  NavBar = '@navbar',
  Pricing = '@pricing',
  Vendor = '@vendor',
  Vendors = '@vendors',
  Region = '@region',
  Rate = '@rate',
  Tags = '@tags',
  Toolbar = '@toolbar',
  Communication = '@communication',
  GlobalRules = '@globalrules',
  IncompleteFNOLs = '@incompletefnols',
  ServiceAreaAndVendor = '@serviceareaandvendor',
  ServiceArea = '@servicearea',
  ServiceAreas = '@serviceareas',
  WeatherEvents = '@weatherevents',
  P1 = '@p1',
  P2 = '@p2',
  P3 = '@p3',
}

export type cookieType = {
  name: string
  value: string
  domain: string
  path: string
  expires: number
  httpOnly: boolean
  secure: boolean
  sameSite: string
}

export enum NetworkSpeedType {
  NoThrottle,
  SuperSlow,
  Good2G,
  WiFi,
}

export const NetworkSpeedConfig = {
  Offline: {
    offline: true,
    downloadThroughput: 0,
    uploadThroughput: 0,
    latency: 0,
    //connectionType: 'none',
  },
  NoThrottle: {
    offline: false,
    downloadThroughput: -1,
    uploadThroughput: -1,
    latency: 0,
  },
  SuperSlow: {
    offline: false,
    downloadThroughput: (50 * 1024) / 8,
    uploadThroughput: (50 * 1024) / 8,
    latency: 300,
    //connectionType: 'cellular2g',
  },
  Regular2G: {
    offline: false,
    downloadThroughput: (250 * 1024) / 8,
    uploadThroughput: (50 * 1024) / 8,
    latency: 300,
    //connectionType: 'cellular2g',
  },
  Good2G: {
    offline: false,
    downloadThroughput: (450 * 1024) / 8,
    uploadThroughput: (150 * 1024) / 8,
    latency: 150,
    //connectionType: 'cellular2g',
  },
  Regular3G: {
    offline: false,
    downloadThroughput: (750 * 1024) / 8,
    uploadThroughput: (250 * 1024) / 8,
    latency: 100,
    //connectionType: 'cellular3g',
  },
  Good3G: {
    offline: false,
    downloadThroughput: (1.5 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 40,
    //connectionType: 'cellular3g',
  },
  Regular4G: {
    offline: false,
    downloadThroughput: (4 * 1024 * 1024) / 8,
    uploadThroughput: (3 * 1024 * 1024) / 8,
    latency: 20,
    //connectionType: 'cellular4g',
  },
  WiFi: {
    offline: false,
    downloadThroughput: (30 * 1024 * 1024) / 8,
    uploadThroughput: (15 * 1024 * 1024) / 8,
    latency: 2,
    //connectionType: 'wifi',
  },
}
