import { Element } from '../../shared/element.js'
import { DataTable_Columns_Type, DateFilterTypes, DialogStrings } from '../delegatePortalConstants.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalBase } from '../pages/delegatePortalBase.js'

export class DelegatePortalTableFilterDialog extends DelegatePortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_ClearFilter: Element
  readonly Button_GroupClear: Element

  constructor(global: DelegatePortalGlobal, isEditMode = false) {
    super(global)
    this.Button_Close_X = new Element(
      global.page,
      this.page.locator(`section[id*='chakra-modal'] button[aria-label='Close']`)
    )
    this.Button_Close = new Element(
      global.page,
      this.page.locator(`section[id*='chakra-modal'] footer button`)
    )
    this.Title = new Element(
      global.page,
      this.page.locator(`section[id*='chakra-modal'] header`),
      isEditMode ? DialogStrings.TableFilter_Title_Edit : DialogStrings.TableFilter_Title_Add
    )
    this.Button_ClearFilter = new Element(
      global.page,
      this.page
        .locator(
          `div[id*='chakra-modal'] button[aria-label='${DialogStrings.TableFilter_ClearFilter}']`
        )
        .nth(0),
      DialogStrings.TableFilter_ClearFilter
    )
    this.Button_GroupClear = new Element(
      global.page,
      this.page.locator(`div[id*='chakra-modal'] button`),
      DialogStrings.TableFilter_GroupClear
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async SetTextFilter(filterTerm: string, column: DataTable_Columns_Type) {
    let targetLabel = ''
    switch (column) {
      case DataTable_Columns_Type.Jobs_JobLabel:
        targetLabel = DialogStrings.TableFilter_Text_Job_Includes
        break
      case DataTable_Columns_Type.Contacts_Description:
      case DataTable_Columns_Type.Documents_Description:
        targetLabel = DialogStrings.TableFilter_Text_Description_Includes
        break
      case DataTable_Columns_Type.Jobs_Description:
        targetLabel = DialogStrings.TableFilter_Text_Description_Equals
        break
      case DataTable_Columns_Type.Jobs_Location_Address:
        targetLabel = DialogStrings.TableFilter_Text_Address_Includes
        break
      case DataTable_Columns_Type.Jobs_Location_City:
        targetLabel = DialogStrings.TableFilter_Text_City_Includes
        break
      case DataTable_Columns_Type.Jobs_Location_State:
        targetLabel = DialogStrings.TableFilter_Text_State_Includes
        break
      case DataTable_Columns_Type.Jobs_Location_ZipCode:
        targetLabel = DialogStrings.TableFilter_Text_Zipcode_Includes
        break
      case DataTable_Columns_Type.Callbacks_Entity_ID:
        targetLabel = DialogStrings.TableFilter_Text_EntityId_Includes
        break
      case DataTable_Columns_Type.Contacts_Name:
      case DataTable_Columns_Type.Callbacks_Name:
        targetLabel = DialogStrings.TableFilter_Text_Name_Includes
        break
      case DataTable_Columns_Type.Callbacks_Notes:
        targetLabel = DialogStrings.TableFilter_Text_Notes_Includes
        break
      case DataTable_Columns_Type.Callbacks_Contact_Method:
        targetLabel = DialogStrings.TableFilter_Text_ContactMethod_Includes
        break
      case DataTable_Columns_Type.Callbacks_Preferred_Time:
        targetLabel = DialogStrings.TableFilter_Text_PreferredTime_Includes
        break
      case DataTable_Columns_Type.Claims_Phone:
        targetLabel = DialogStrings.TableFilter_Text_Phone_Includes
        break
      case DataTable_Columns_Type.Claims_Email:
        targetLabel = DialogStrings.TableFilter_Text_Email_Includes
        break
      case DataTable_Columns_Type.Claims_ClaimNumber:
        targetLabel = DialogStrings.TableFilter_Text_ClaimNumber_Includes
        break
      case DataTable_Columns_Type.Contacts_Roles:
        targetLabel = DialogStrings.TableFilter_Text_Roles_String_Includes
        break
      case DataTable_Columns_Type.Contacts_Preferred_Contact:
        targetLabel = DialogStrings.TableFilter_Text_PreferredContact_Includes
        break
      case DataTable_Columns_Type.Documents_File:
        targetLabel = DialogStrings.TableFilter_Text_FileAlt_Includes
        break
      case DataTable_Columns_Type.Documents_FileName:
      case DataTable_Columns_Type.InspectionScreenshots_FileName:
        targetLabel = DialogStrings.TableFilter_Text_FileName_Includes
        break
      case DataTable_Columns_Type.Documents_Meta_DocumentType:
        targetLabel = DialogStrings.TableFilter_Text_DocumentType_Includes
        break
      case DataTable_Columns_Type.Estimates_SubmissionDate:
        targetLabel = DialogStrings.TableFilter_Text_SubmissionDate_Includes
        break
      case DataTable_Columns_Type.Estimates_SubmittedBy:
        targetLabel = DialogStrings.TableFilter_Text_SubmittedBy_Includes
        break
      case DataTable_Columns_Type.InspectionScreenshots_Label:
        targetLabel = DialogStrings.TableFilter_Text_Label_Includes
        break
      case DataTable_Columns_Type.Inspections_Description:
        targetLabel = DialogStrings.TableFilter_Text_Description_Includes
        break
      case DataTable_Columns_Type.Inspections_Organizer:
        targetLabel = DialogStrings.TableFilter_Text_Organizer_Includes
        break
      default:
        throw new Error(`The target column: ${column} has not been defined yet`)
    }
    await this.page.getByLabel(targetLabel).click()
    await this.page.getByLabel(targetLabel).fill(filterTerm)
  }

  async SetSelectionFilter(selection: string, column: DataTable_Columns_Type) {
    let targetLabel = ''
    switch (column) {
      case DataTable_Columns_Type.Callbacks_For_Role:
        targetLabel = DialogStrings.TableFilter_Selection_ForRole_Equals
        break
      case DataTable_Columns_Type.Claims_ClaimStatus:
        targetLabel = DialogStrings.TableFilter_Selection_ClaimStatus_Equals
        break
      case DataTable_Columns_Type.Documents_Meta_DataSource:
        targetLabel = DialogStrings.TableFilter_Selection_DataSource_Equals
        break
      default:
        throw new Error(`The target column: ${column} has not been defined yet`)
    }
    await this.page.getByLabel(targetLabel).selectOption({ label: `${selection}` })
  }

  async SetDateFilter(dateFilterType: DateFilterTypes, column: DataTable_Columns_Type, date: Date) {
    const calendarLocator = this.page.locator('input[type="date"]')
    await this.page
      .getByLabel(DialogStrings.TableFilter_Date_AvailableFilters)
      .selectOption({ label: `${dateFilterType}` })
    switch (dateFilterType) {
      case DateFilterTypes.DateEquals:
      case DateFilterTypes.DateGreaterThan:
      case DateFilterTypes.DateGreaterEqualThan:
      case DateFilterTypes.DateLesserThan:
      case DateFilterTypes.DateLesserEqualThan:
        await calendarLocator.focus()
        await this.page.keyboard.type(await this.DateEntryFormatting(date))
        break
      case DateFilterTypes.TimeEquals:
      case DateFilterTypes.TimeGreaterEqualThan:
      case DateFilterTypes.TimeGreaterThan:
      case DateFilterTypes.TimeLesserThan:
      case DateFilterTypes.TimeLesserEqualThan:
        await calendarLocator.focus()
        await this.page.keyboard.type(await this.DateEntryFormatting(date))
        break
    }
  }

  async DateEntryFormatting(date: Date) {
    const padStart = (value: number): string => value.toString().padStart(2, '0')

    const dateString = `${padStart(date.getMonth() + 1)}${padStart(date.getDate())}${date.getFullYear()}`
    return dateString
  }

  // async SetRangeFilter(minValue: string, maxValue: string) {
  //   await this.page.getByLabel(DialogStrings.TableFilter_Range_Min).fill(minValue)
  //   await this.page.getByLabel(DialogStrings.TableFilter_Range_Max).fill(maxValue)
  // }

  async SetCheckFilter(valueToCheck: string) {
    await this.page
      .locator('label')
      .filter({ hasText: `${valueToCheck}` })
      .locator('span')
      .first()
      .click()
  }

  async SetRadioFilter(optionToSelect: string) {
    await this.page
      .locator('label')
      .filter({ hasText: `${optionToSelect}` })
      .locator('span')
      .first()
      .click()
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
