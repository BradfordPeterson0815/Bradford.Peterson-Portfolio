import { AppiumEnvironmentType } from '../library/shared/constants.js'
const __defaultEnvironment = process.env.CURRENT_ENVIRONMENT ?? AppiumEnvironmentType.Company_Release
const __environmentInfo = __defaultEnvironment.split('_')

export class shared {
  public static MAILOSAURUS_API_KEY = process.env.MAILOSAURUS_API_KEY ?? ''
  public static MAILOSAURUS_INBOX_SERVER_ID = process.env.MAILOSAURUS_INBOX_SERVER_ID ?? ''
  public static MAILOSAURUS_CODE_EMAIL_SENDER = process.env.MAILOSAURUS_CODE_EMAIL_SENDER ?? ''
  public static MAILOSAURUS_CODE_EMAIL_TARGET_BODY =
    process.env.MAILOSAURUS_CODE_EMAIL_TARGET_BODY ?? ''
  public static ENVIRONMENT = __defaultEnvironment
}

export class inspections {
  public static ENVIRONMENT = shared.ENVIRONMENT
  public static USER_EMAIL_FIELDADJUSTER =
    process.env.MAILOSAURUS_EMAIL_ADDRESS_INSPECTIONS_FIELDADJUSTER ?? ''
  public static USER_EMAIL_INSPECTIONTECHNICIAN =
    process.env.MAILOSAURUS_EMAIL_ADDRESS_INSPECTIONS_INSPECTIONTECHNICIAN ?? ''
  public static MAILOSAURUS_CODE_EMAIL_SUBJECT =
    process.env.MAILOSAURUS_CODE_EMAIL_SUBJECT_INSPECTIONS ?? ''
  public static AUTH0_LOGIN_PAGE_TITLE = process.env.INSPECTIONS_AUTH0_LOGIN_PAGE_TITLE ?? ''
}
