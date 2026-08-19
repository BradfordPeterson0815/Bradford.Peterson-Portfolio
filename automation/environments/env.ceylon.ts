import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __defaultEnvironment = process.env.ENVIRONMENT ?? process.env.TARGET_ENVIRONMENT ?? ''
const __defaultStage = process.env.STAGE ?? process.env.DEBUG_STAGE ?? ''
const __environmentInfo = __defaultEnvironment.split('_')

export class shared {
  public static MAILOSAURUS_API_KEY = process.env.MAILOSAURUS_API_KEY ?? ''
  public static MAILOSAURUS_INBOX_SERVER_ID = process.env.MAILOSAURUS_INBOX_SERVER_ID ?? ''
  public static MAILOSAURUS_CODE_EMAIL_SENDER = process.env.MAILOSAURUS_CODE_EMAIL_SENDER ?? ''
  public static MAILOSAURUS_CODE_EMAIL_TARGET_BODY =
    process.env.MAILOSAURUS_CODE_EMAIL_TARGET_BODY ?? ''
  public static ENVIRONMENT = __defaultEnvironment
  public static STAGE = __defaultStage
  public static AUTHSTORAGEROOT = path.join(
    __dirname,
    `../.auth/${__environmentInfo[0]}/${__environmentInfo[1]}`
  )
}

export class userPortal {
  public static ENVIRONMENT = shared.ENVIRONMENT
  public static AUTH_STORAGE_PATH = path.join(shared.AUTHSTORAGEROOT, 'userPortal.session.json')
  public static BASE_URL =
    process.env.USERPORTAL_BASE_URL_PREFIX + shared.STAGE + process.env.USERPORTAL_BASE_URL_SUFFIX
  public static USER_EMAIL = process.env.MAILOSAURUS_EMAIL_ADDRESS_USERPORTAL ?? ''
  public static USER_FRIENDLY = process.env.USER_USERPORTAL_FRIENDLY ?? ''
  public static MAILOSAURUS_CODE_EMAIL_SUBJECT =
    process.env.MAILOSAURUS_CODE_EMAIL_SUBJECT_USERPORTAL ?? ''
  public static AUTH0_LOGIN_PAGE_TITLE = process.env.USERPORTAL_AUTH0_LOGIN_PAGE_TITLE ?? ''
}

export class delegatePortal {
  public static ENVIRONMENT = shared.ENVIRONMENT
  public static BASE_URL =
    process.env.DELEGATE_BASE_URL_PREFIX + shared.STAGE + process.env.DELEGATE_BASE_URL_SUFFIX
  public static MAILOSAURUS_CODE_EMAIL_SUBJECT =
    process.env.MAILOSAURUS_CODE_EMAIL_SUBJECT_DELEGATE ?? ''
  public static AUTH0_LOGIN_PAGE_TITLE = process.env.DELEGATE_AUTH0_LOGIN_PAGE_TITLE ?? ''
  public static SUBMIT_BUG_URL = process.env.MONDAY_SUBMIT_BUG_URL ?? ''
}

export class delegatePortalSubcontractor {
  public static AUTH_STORAGE_PATH = path.join(shared.AUTHSTORAGEROOT, 'delegate.sub.session.json')
  public static USER_EMAIL = process.env.MAILOSAURUS_EMAIL_ADDRESS_DELEGATE_SUBCONTRACTOR ?? ''
  public static USER_FRIENDLY = process.env.USER_DELEGATE_SUBCONTRACTOR_FRIENDLY ?? ''
}

export class delegatePortalFieldAgent {
  public static AUTH_STORAGE_PATH = path.join(shared.AUTHSTORAGEROOT, 'delegate.fa.session.json')
  public static USER_EMAIL = process.env.MAILOSAURUS_EMAIL_ADDRESS_DELEGATE_FIELDADJUSTER ?? ''
  public static USER_FRIENDLY = process.env.USER_DELEGATE_FIELDADJUSTER_FRIENDLY ?? ''
}
export class delegatePortalFieldTech {
  public static AUTH_STORAGE_PATH = path.join(shared.AUTHSTORAGEROOT, 'delegate.ft.session.json')
  public static USER_EMAIL = process.env.MAILOSAURUS_EMAIL_ADDRESS_DELEGATE_FIELDTECHNICIAN ?? ''
  public static USER_FRIENDLY = process.env.USER_DELEGATE_FIELDTECHNICIAN_FRIENDLY ?? ''
}

export class delegatePortalInspectionTech {
  public static AUTH_STORAGE_PATH = path.join(shared.AUTHSTORAGEROOT, 'delegate.it.session.json')
  public static USER_EMAIL =
    process.env.MAILOSAURUS_EMAIL_ADDRESS_DELEGATE_INSPECTIONTECHNICIAN ?? ''
  public static USER_FRIENDLY = process.env.USER_DELEGATE_INSPECTIONTECHNICIAN_FRIENDLY ?? ''
}

export class claimsPortal {
  public static AUTH_STORAGE_PATH = path.join(shared.AUTHSTORAGEROOT, 'claims.session.json')
  public static BASE_URL =
    process.env.CLAIMS_BASE_URL_PREFIX + shared.STAGE + process.env.CLAIMS_BASE_URL_SUFFIX
  public static ENVIRONMENT = shared.ENVIRONMENT
  public static USER_EMAIL = process.env.USER_CLAIMS_EMAIL ?? ''
  public static USER_PASSWORD = process.env.USER_CLAIMS_PASSWORD ?? ''
  public static USER_FRIENDLY = process.env.USER_CLAIMS_FRIENDLY ?? ''
  public static USER_ADMIN_EMAIL = process.env.USER_ADMIN_EMAIL ?? ''
  public static USER_ADMIN_PASSWORD = process.env.USER_ADMIN_PASSWORD ?? ''
  public static AUTH0_LOGIN_PAGE_TITLE = process.env.CLAIMS_AUTH0_LOGIN_PAGE_TITLE ?? ''
  public static SUBMIT_BUG_URL = process.env.MONDAY_SUBMIT_BUG_URL ?? ''
}

export class clientPortal {
  public static AUTH_STORAGE_PATH = path.join(shared.AUTHSTORAGEROOT, 'clientPortal.session.json')
  public static BASE_URL =
    process.env.CLIENTPORTAL_BASE_URL_PREFIX + shared.STAGE + process.env.CLIENTPORTAL_BASE_URL_SUFFIX
  public static ENVIRONMENT = shared.ENVIRONMENT
  public static USER_EMAIL = process.env.USER_CLIENTPORTAL_EMAIL ?? ''
  public static USER_PASSWORD = process.env.USER_CLIENTPORTAL_PASSWORD ?? ''
  public static AUTH0_LOGIN_PAGE_TITLE = process.env.CLIENTPORTAL_AUTH0_LOGIN_PAGE_TITLE ?? ''
}
