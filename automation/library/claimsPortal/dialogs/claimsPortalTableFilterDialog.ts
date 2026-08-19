import { Element } from '../../shared/element.js'
import { DataTable_Columns_Type, DateFilterTypes, DialogStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { DateEntryFormatting } from '../claimsPortalHelper.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalTableFilterDialog extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_ClearFilter: Element
  readonly Button_GroupClear: Element

  constructor(global: ClaimsPortalGlobal, isEditMode = false) {
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
      case DataTable_Columns_Type.Templates_Name:
      case DataTable_Columns_Type.GlobalContacts_Name:
      case DataTable_Columns_Type.ContactsBook_Name:
      case DataTable_Columns_Type.Contacts_Name:
      case DataTable_Columns_Type.Callbacks_Name:
        targetLabel = DialogStrings.TableFilter_Text_Name_Includes
        break
      case DataTable_Columns_Type.Callbacks_Entity_ID:
        targetLabel = DialogStrings.TableFilter_Text_EntityId_Includes
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
      case DataTable_Columns_Type.ContactsBook_Roles:
      case DataTable_Columns_Type.Contacts_Roles:
        targetLabel = DialogStrings.TableFilter_Text_Roles_String_Includes
        break
      case DataTable_Columns_Type.ContactsBook_Preferred_Contact:
      case DataTable_Columns_Type.Contacts_Preferred_Contact:
        targetLabel = DialogStrings.TableFilter_Text_PreferredContact_Includes
        break
      case DataTable_Columns_Type.ContactsBook_Description:
      case DataTable_Columns_Type.Contacts_Description:
      case DataTable_Columns_Type.Documents_Description:
        targetLabel = DialogStrings.TableFilter_Text_Description_Includes
        break
      case DataTable_Columns_Type.ContactsBook_License:
        targetLabel = DialogStrings.TableFilter_Text_License_Includes
        break
      case DataTable_Columns_Type.Tags_TagKey:
        targetLabel = DialogStrings.TableFilter_Text_TagKey_Includes
        break
      case DataTable_Columns_Type.RelatedTags_Resource:
        targetLabel = DialogStrings.TableFilter_Text_Resource_Includes
        break
      case DataTable_Columns_Type.RelatedTags_Tag_Value:
        targetLabel = DialogStrings.TableFilter_Text_Tag_Value_Includes
        break
      case DataTable_Columns_Type.PortalAccess_Contact:
        targetLabel = DialogStrings.TableFilter_Text_Contact_Includes
        break
      case DataTable_Columns_Type.PortalAccess_ContactRoles:
        targetLabel = DialogStrings.TableFilter_Text_ContactRolesString_Includes
        break
      case DataTable_Columns_Type.Documents_File:
        targetLabel = DialogStrings.TableFilter_Text_FileAlt_Includes
        break
      case DataTable_Columns_Type.InspectionScreenshots_Label:
        targetLabel = DialogStrings.TableFilter_Text_Label_Includes
        break
      case DataTable_Columns_Type.Documents_FileName:
      case DataTable_Columns_Type.InspectionScreenshots_FileName:
        targetLabel = DialogStrings.TableFilter_Text_FileName_Includes
        break
      case DataTable_Columns_Type.Documents_Meta_DocumentType:
        targetLabel = DialogStrings.TableFilter_Text_DocumentType_Includes
        break
      case DataTable_Columns_Type.Inspections_Description:
        targetLabel = DialogStrings.TableFilter_Text_Description_Includes
        break
      case DataTable_Columns_Type.Inspections_Organizer:
        targetLabel = DialogStrings.TableFilter_Text_Organizer_Includes
        break
      case DataTable_Columns_Type.inspections_Duration:
        targetLabel = DialogStrings.TableFilter_Text_Duration_Includes
        break
      case DataTable_Columns_Type.WorkAuthorizations_Document:
        targetLabel = DialogStrings.TableFilter_Text_Document_Includes
        break
      case DataTable_Columns_Type.WorkAuthorizations_Recipients:
        targetLabel = DialogStrings.TableFilter_Text_Recipients_Includes
        break
      case DataTable_Columns_Type.LossOfUse_Type:
        targetLabel = DialogStrings.TableFilter_Text_Type_Includes
        break
      case DataTable_Columns_Type.LossOfUse_Status:
      case DataTable_Columns_Type.Bills_Status:
      case DataTable_Columns_Type.Invoices_Status:
        targetLabel = DialogStrings.TableFilter_Text_Status_Includes
        break
      case DataTable_Columns_Type.LossOfUse_LastModified:
        targetLabel = DialogStrings.TableFilter_Text_LastModified_Includes
        break
      case DataTable_Columns_Type.LossOfUse_RequestedDate:
        targetLabel = DialogStrings.TableFilter_Text_RequestedDate_Includes
        break
      case DataTable_Columns_Type.LossOfUseReceipts_ReceiptDate:
        targetLabel = DialogStrings.TableFilter_Text_ReceiptDate_Includes
        break
      case DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote:
        targetLabel = DialogStrings.TableFilter_Text_ReceiptNote_Includes
        break
      case DataTable_Columns_Type.Estimates_SubmissionDate:
        targetLabel = DialogStrings.TableFilter_Text_SubmissionDate_Includes
        break
      case DataTable_Columns_Type.Estimates_SubmittedBy:
        targetLabel = DialogStrings.TableFilter_Text_SubmittedBy_Includes
        break
      case DataTable_Columns_Type.PricingRegions_RegionName:
        targetLabel = DialogStrings.TableFilter_Text_RegionName_Includes
        break
      case DataTable_Columns_Type.PricingVendorRates_VendorName:
      case DataTable_Columns_Type.Bills_VendorName:
        targetLabel = DialogStrings.TableFilter_Text_VendorName_Includes
        break
      case DataTable_Columns_Type.Invoices_CustomerName:
        targetLabel = DialogStrings.TableFilter_Text_CustomerName_Includes
        break
      case DataTable_Columns_Type.Bills_Total:
      case DataTable_Columns_Type.Invoices_Total:
        targetLabel = DialogStrings.TableFilter_Text_Total_Equals
        break
      case DataTable_Columns_Type.Bills_Balance:
      case DataTable_Columns_Type.Invoices_Balance:
        targetLabel = DialogStrings.TableFilter_Text_Balance_Equals
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
      case DataTable_Columns_Type.Templates_Type:
        targetLabel = DialogStrings.TableFilter_Selection_Type_Equals
        break
      case DataTable_Columns_Type.Callbacks_For_Role:
        targetLabel = DialogStrings.TableFilter_Selection_ForRole_Equals
        break
      case DataTable_Columns_Type.PortalAccess_Status:
        targetLabel = DialogStrings.TableFilter_Selection_Status_Equals
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
    await calendarLocator.focus()
    await this.page.keyboard.type(DateEntryFormatting(date))
  }

  async SetRangeFilter(minValue: string, maxValue: string) {
    await this.page.getByLabel(DialogStrings.TableFilter_Range_Min).fill(minValue)
    await this.page.getByLabel(DialogStrings.TableFilter_Range_Max).fill(maxValue)
  }

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
