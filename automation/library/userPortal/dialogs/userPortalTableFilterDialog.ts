import { Element } from '../../shared/element.js'
import { UserPortalBase } from '../pages/userPortalBase.js'
import { DataTable_Columns_Type, DateFilterTypes, DialogStrings } from '../userPortalConstants.js'
import { UserPortalGlobal } from '../userPortalGlobal.js'

export class UserPortalTableFilterDialog extends UserPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_ClearFilter: Element
  readonly Button_GroupClear: Element

  constructor(global: UserPortalGlobal, isEditMode = false) {
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
      case DataTable_Columns_Type.Claims_ClaimNumber:
        targetLabel = DialogStrings.TableFilter_Text_ClaimNumber_Includes
        break
      case DataTable_Columns_Type.Claims_LossType:
        targetLabel = DialogStrings.TableFilter_Text_LossType_Includes
        break
      case DataTable_Columns_Type.Jobs_JobID:
        targetLabel = DialogStrings.TableFilter_Text_Job_Includes
        break
      case DataTable_Columns_Type.Jobs_Description:
        targetLabel = DialogStrings.TableFilter_Text_Description_Includes
        break
      case DataTable_Columns_Type.Claims_Location_Address:
      case DataTable_Columns_Type.Jobs_Location_Address:
        targetLabel = DialogStrings.TableFilter_Text_Address_Includes
        break
      case DataTable_Columns_Type.Claims_Location_City:
      case DataTable_Columns_Type.Jobs_Location_City:
        targetLabel = DialogStrings.TableFilter_Text_City_Includes
        break
      case DataTable_Columns_Type.Claims_Location_State:
      case DataTable_Columns_Type.Jobs_Location_State:
        targetLabel = DialogStrings.TableFilter_Text_State_Includes
        break
      case DataTable_Columns_Type.Claims_Location_ZipCode:
      case DataTable_Columns_Type.Jobs_Location_ZipCode:
        targetLabel = DialogStrings.TableFilter_Text_Zipcode_Includes
        break
      default:
        throw new Error(`The target column: ${column} has not been defined yet`)
    }
    await this.page.getByLabel(targetLabel).click()
    await this.page.getByLabel(targetLabel).fill(filterTerm)
  }

  // async SetSelectionFilter(selection: string, column: DataTable_Columns_Type) {
  //   let targetLabel = ''
  //   switch (column) {
  //     // case DataTable_Columns_Type.Templates_Type:
  //     //   targetLabel = DialogStrings.TableFilter_Selection_Type_Equals
  //     //   break
  //     // case DataTable_Columns_Type.Callbacks_For_Role:
  //     //   targetLabel = DialogStrings.TableFilter_Selection_ForRole_Equals
  //     //   break
  //     // case DataTable_Columns_Type.PortalAccess_Status:
  //     //   targetLabel = DialogStrings.TableFilter_Selection_Status_Equals
  //     //   break
  //     // case DataTable_Columns_Type.Documents_Meta_DataSource:
  //     //   targetLabel = DialogStrings.TableFilter_Selection_DataSource_Equals
  //     //   break
  //     default:
  //       throw new Error(`The target column: ${column} has not been defined yet`)
  //   }
  //   await this.page.getByLabel(targetLabel).selectOption({ label: `${selection}` })
  // }

  async SetDateFilter(
    dateFilterType: typeof DateFilterTypes,
    date: string,
    column: DataTable_Columns_Type
  ) {
    await this.page
      .getByLabel(DialogStrings.TableFilter_Date_AvailableFilters)
      .selectOption({ label: `${dateFilterType}` })
    let targetLabel = ''
    switch (column) {
      case DataTable_Columns_Type.Claims_LossDate:
        targetLabel = DialogStrings.TableFilter_Date_LossDate
        break
    }
    await this.page.getByLabel(targetLabel).fill(date)
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
