import { Browser } from '@playwright/test'
import test from '../shared/testHooks.js'
import { ClientPortalGlobal } from './clientPortalGlobal.js'
import {
  DataTable_ColumnName_Index,
  DataTable_Columns,
  DataTable_Columns_Type,
  ErrorOnAbort,
  ThrowErrorOnAbort,
} from './clientPortalConstants.js'
import { KeyValue } from './clientPortalKeyValue.js'
import { ClientPortalAuth0LoginPage } from './pages/clientPortalAuth0LoginPage.js'
import { ClientPortalHomePage } from './pages/clientPortalHomePage.js'
import { ArrayRule } from './rules/clientPortalArrayRule.js'
import { BooleanRule } from './rules/clientPortalBooleanRule.js'
import { DateTimeRule } from './rules/clientPortalDateTimeRule.js'
import { ListRule } from './rules/clientPortalListRule.js'
import { NumericRule } from './rules/clientPortalNumericRule.js'
import { TextRule } from './rules/clientPortalTextRule.js'
import { clientPortal } from '../../environments/env.ceylon.js'

export async function Launch(
  browser: Browser,
  environment: string,
  username = clientPortal.USER_EMAIL,
  password = clientPortal.USER_PASSWORD
) {
  const global = new ClientPortalGlobal(browser, environment, clientPortal.BASE_URL, username, password)
  global.context = await global.browser.newContext()
  global.context.grantPermissions(['clipboard-read', 'clipboard-write'])
  global.page = await global.context.newPage()

  // launch the ClientPortal page
  await global.page.goto(global.baseUrl)
  await global.page.waitForLoadState()
  await global.page.waitForTimeout(3000)

  // check to see if we are being prompted to login
  const loginPage = new ClientPortalAuth0LoginPage(global)
  const loginIsPresent = await loginPage.IsVisible()

  if (loginIsPresent) {
    await loginPage.Login(username, password)
    await global.page.waitForTimeout(2000) // let the clientPortal page load
    await global.page.context().storageState({ path: clientPortal.AUTH_STORAGE_PATH })
  }

  const homePage = new ClientPortalHomePage(global)
  await homePage.WaitForLoad()
  return { global, homePage }
}

export async function Shutdown(global: ClientPortalGlobal) {
  await global.context.close()
}

export function LookupDataColumn(
  columnType: DataTable_Columns_Type,
  columnNameIndex: DataTable_ColumnName_Index = DataTable_ColumnName_Index.Access
) {
  switch (columnType) {
    case DataTable_Columns_Type.Rules_If:
      return DataTable_Columns.If[columnNameIndex]
    case DataTable_Columns_Type.Rules_Then:
      return DataTable_Columns.Then[columnNameIndex]
    case DataTable_Columns_Type.Rules_RuleSummary:
      return DataTable_Columns.RulesSummary[columnNameIndex]
    case DataTable_Columns_Type.Rules_IsCustomRule:
      return DataTable_Columns.IsCustomRule[columnNameIndex]
    case DataTable_Columns_Type.Vendors_Name:
      return DataTable_Columns.Name[columnNameIndex]
    case DataTable_Columns_Type.Vendors_Enabled:
      return DataTable_Columns.Enabled[columnNameIndex]
    case DataTable_Columns_Type.Vendors_Website:
      return DataTable_Columns.Website[columnNameIndex]
    case DataTable_Columns_Type.Vendors_DisplayPhone:
      return DataTable_Columns.DisplayPhone[columnNameIndex]
    case DataTable_Columns_Type.Vendors_DisplayEmail:
      return DataTable_Columns.DisplayEmail[columnNameIndex]
    case DataTable_Columns_Type.ServiceAreas_AreaName:
      return DataTable_Columns.AreaName[columnNameIndex]
    case DataTable_Columns_Type.ServiceAreas_State:
      return DataTable_Columns.State[columnNameIndex]
    case DataTable_Columns_Type.ServiceAreas_Enabled:
      return DataTable_Columns.AreaEnabled[columnNameIndex]
    case DataTable_Columns_Type.AttachedVendors_VendorName:
      return DataTable_Columns.VendorName[columnNameIndex]
    case DataTable_Columns_Type.AttachedVendors_InternalName:
      return DataTable_Columns.InternalName[columnNameIndex]
    case DataTable_Columns_Type.AttachedVendors_HasClaimAssignmentRulesAssigned:
      return DataTable_Columns.HasClaimAssignmentRulesAssigned[columnNameIndex]
    case DataTable_Columns_Type.AttachedVendors_HasMitigationAssignmentRulesAssigned:
      return DataTable_Columns.HasMitigationAssignmentRulesAssigned[columnNameIndex]
    case DataTable_Columns_Type.AttachedVendors_StartDate:
      return DataTable_Columns.StartDate[columnNameIndex]
    case DataTable_Columns_Type.AttachedVendors_EndDate:
      return DataTable_Columns.EndDate[columnNameIndex]
    case DataTable_Columns_Type.IncompleteFNOLs_IsValid:
      return DataTable_Columns.IsValid[columnNameIndex]
    case DataTable_Columns_Type.IncompleteFNOLs_ID:
      return DataTable_Columns.FNOLID[columnNameIndex]
    case DataTable_Columns_Type.IncompleteFNOLs_LastUpdated:
      return DataTable_Columns.LastUpdated[columnNameIndex]
    case DataTable_Columns_Type.IncompleteFNOLs_LossDate:
      return DataTable_Columns.LossDate[columnNameIndex]
    case DataTable_Columns_Type.IncompleteFNOLs_LossType:
    case DataTable_Columns_Type.WeatherEvents_LossType:
      return DataTable_Columns.LossType[columnNameIndex]
    case DataTable_Columns_Type.IncompleteFNOLs_ReportedBy:
      return DataTable_Columns.ReportedBy[columnNameIndex]
    case DataTable_Columns_Type.WeatherEvents_Status:
      return DataTable_Columns.Status[columnNameIndex]
    case DataTable_Columns_Type.WeatherEvents_EventName:
      return DataTable_Columns.EventName[columnNameIndex]
    case DataTable_Columns_Type.WeatherEvents_CATCode:
      return DataTable_Columns.CATCode[columnNameIndex]
    case DataTable_Columns_Type.WeatherEvents_StartDate:
      return DataTable_Columns.EffectiveStartDate[columnNameIndex]
    case DataTable_Columns_Type.WeatherEvents_EndDate:
      return DataTable_Columns.EffectiveEndDate[columnNameIndex]
    case DataTable_Columns_Type.WeatherEvents_AffectedLocations:
      return DataTable_Columns.AffectedLocations[columnNameIndex]
    default:
      throw new Error(`No data column type has been defined for: ${columnType} `)
  }
}

export function IsOldEnoughToDelete(targetTimestampInMS: number, olderInMinutes = 10) {
  const thresholdValue = 1704096000000 // 1/1/2024
  if (targetTimestampInMS < thresholdValue) {
    return false
  }
  const currentTimeInMS = Date.now()
  const timeDifference = currentTimeInMS - targetTimestampInMS
  const result = currentTimeInMS - targetTimestampInMS > olderInMinutes * 60000
  console.log(
    `Actual time difference between now and target in Milliseconds is ${timeDifference} (${timeDifference / 60000} minutes)`
  )
  console.log(
    `Threshold for deletion is anything greater than ${olderInMinutes} minutes, so this item is ${result ? '' : 'not '}a candidate for deletion`
  )
  return result
}

export function FetchValueByKey(array: KeyValue[], key: string) {
  const pair = array.find((o) => o.key === key)
  return pair ? pair.value : null
}

export const deepCopy = <T, U = T extends Array<infer V> ? V : never>(source: T): T => {
  if (Array.isArray(source)) {
    return source.map((item) => deepCopy(item)) as T & U[]
  }
  if (source instanceof Date) {
    return new Date(source.getTime()) as T & Date
  }
  if (source && typeof source === 'object') {
    return (Object.getOwnPropertyNames(source) as (keyof T)[]).reduce<T>(
      (o, prop) => {
        Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!)
        o[prop] = deepCopy(source[prop])
        return o
      },
      Object.create(Object.getPrototypeOf(source))
    )
  }
  return source
}

export function CatgorizeAndSetRuleDescription(
  fieldName: string,
  source: string,
  operator: string,
  conditions: string
) {
  let ruleDescription = null
  const bitwiseOr = 'or'
  const bitwiseAnd = 'and'
  switch (operator) {
    case 'has exactly':
      ruleDescription = CatgorizeListRuleDescription(
        fieldName,
        source,
        'hasexactly',
        conditions,
        bitwiseAnd
      )
      break
    case 'has all of':
      ruleDescription = CatgorizeListRuleDescription(
        fieldName,
        source,
        'hasallof',
        conditions,
        bitwiseAnd
      )
      break
    case 'is':
      if (conditions == 'false' || conditions == 'true') {
        ruleDescription = new BooleanRule(fieldName, source, conditions)
      } else if (fieldName == 'lossType' || fieldName == 'reportedByRelationship') {
        ruleDescription = CatgorizeArrayRuleDescription(fieldName, source, 'is', conditions)
      } else if (fieldName == 'damagedPropertyAreas') {
        ruleDescription = CatgorizeListRuleDescription(
          fieldName,
          source,
          'isoneof',
          conditions,
          bitwiseOr
        )
      } else {
        ruleDescription = new TextRule(fieldName, source, 'is', conditions)
      }
      break
    case 'is not':
      if (fieldName == 'lossType' || fieldName == 'reportedByRelationship') {
        ruleDescription = CatgorizeArrayRuleDescription(fieldName, source, 'isnot', conditions)
      } else {
        ruleDescription = new TextRule(fieldName, source, 'isnot', conditions)
      }
      break
    case 'is one of':
      ruleDescription = CatgorizeArrayRuleDescription(fieldName, source, 'isoneof', conditions)
      break
    case 'amount equal to':
      ruleDescription = CatgorizeListRuleDescription(
        fieldName,
        source,
        'lengthequalto',
        conditions,
        null
      )
      break
    case 'amount greater than':
      ruleDescription = CatgorizeListRuleDescription(
        fieldName,
        source,
        'lengthgreaterthan',
        conditions,
        null
      )
      break
    case 'amount less than':
      ruleDescription = CatgorizeListRuleDescription(
        fieldName,
        source,
        'lengthlessthan',
        conditions,
        null
      )
      break
    case 'is before':
      {
        const beforeValueAndTimeFrameData = conditions.split(' ').map((element) => element.trim())
        ruleDescription = new DateTimeRule(
          fieldName,
          source,
          'isbefore',
          +beforeValueAndTimeFrameData[0],
          beforeValueAndTimeFrameData[1].toLowerCase()
        )
      }
      break
    case 'is after':
      {
        const afterValueAndTimeFrameData = conditions.split(' ').map((element) => element.trim())
        ruleDescription = new DateTimeRule(
          fieldName,
          source,
          'isafter',
          +afterValueAndTimeFrameData[0],
          afterValueAndTimeFrameData[1].toLowerCase()
        )
      }
      break
    case 'greater than':
      ruleDescription = new NumericRule(fieldName, source, 'greater', +conditions)
      break
    case 'less than':
      ruleDescription = new NumericRule(fieldName, source, 'less', +conditions)
      break
    case 'contains':
      ruleDescription = new TextRule(fieldName, source, 'contains', conditions)
      break
    case 'begins with':
      ruleDescription = new TextRule(fieldName, source, 'beginswith', conditions)
      break
    case 'ends with':
      ruleDescription = new TextRule(fieldName, source, 'endswith', conditions)
      break
    default:
      throw new Error(`rule operator: ${operator} is not defined and handled`) // should never get here
  }
  return ruleDescription
}

export function CatgorizeArrayRuleDescription(
  arrayField: string,
  arrayFieldSource: string,
  operator: string,
  arrayValues: string
) {
  let arrayRule = null
  let conditions = null
  switch (operator) {
    case 'isoneof':
      arrayValues = arrayValues.replace(` or `, ',')
      arrayValues = arrayValues.replace(',,', ',')
      conditions = arrayValues.split(',').map((element) => element.trim())
      break
    case 'is':
    case 'isnot':
    default:
      conditions = arrayValues // this is a string with a single value
      break
  }
  arrayRule = new ArrayRule(arrayField, arrayFieldSource, operator, conditions)
  return arrayRule
}

export function CatgorizeListRuleDescription(
  arrayField: string,
  arrayFieldSource: string,
  operator: string,
  arrayValues: string,
  arrayBitwiseOperator: string | null
) {
  let arrayRule = null
  let conditions = null
  switch (operator) {
    case 'isoneof':
    case 'hasallof':
    case 'hasexactly':
      arrayValues = arrayValues.replace(` ${arrayBitwiseOperator} `, ',')
      arrayValues = arrayValues.replace(',,', ',')
      conditions = arrayValues.split(',').map((element) => element.trim())
      break
    default:
      conditions = arrayValues // this is a number
      break
  }
  arrayRule = new ListRule(arrayField, arrayFieldSource, operator, conditions)
  return arrayRule
}

export function AbortTest(reason: string) {
  if (ThrowErrorOnAbort) {
    test.info().annotations.push({
      type: ErrorOnAbort,
      description: reason,
    })
  }
}
