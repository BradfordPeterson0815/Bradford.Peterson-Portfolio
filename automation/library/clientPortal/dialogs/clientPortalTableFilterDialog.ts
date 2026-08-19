import { Element } from '../../shared/element.js'
import { DataTable_Columns_Type, DialogStrings } from '../clientPortalConstants.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { ClientPortalBase } from '../pages/clientPortalBase.js'

export class ClientPortalTableFilterDialog extends ClientPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_ClearFilter: Element
  readonly Button_GroupClear: Element

  constructor(global: ClientPortalGlobal, isEditMode = false) {
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
      case DataTable_Columns_Type.Rules_If:
        targetLabel = DialogStrings.TableFilter_Text_If_Includes
        break
      case DataTable_Columns_Type.Rules_Then:
        targetLabel = DialogStrings.TableFilter_Text_Then_Includes
        break
      case DataTable_Columns_Type.Rules_RuleSummary:
        targetLabel = DialogStrings.TableFilter_Text_RuleSummary_Includes
        break
      case DataTable_Columns_Type.Vendors_Name:
        targetLabel = DialogStrings.TableFilter_Text_Name_Includes
        break
      case DataTable_Columns_Type.Vendors_Website:
        targetLabel = DialogStrings.TableFilter_Text_Website_Includes
        break
      case DataTable_Columns_Type.Vendors_DisplayPhone:
        targetLabel = DialogStrings.TableFilter_Text_DisplayPhone_Includes
        break
      case DataTable_Columns_Type.Vendors_DisplayEmail:
        targetLabel = DialogStrings.TableFilter_Text_DisplayEmail_Includes
        break
      case DataTable_Columns_Type.ServiceAreas_AreaName:
        targetLabel = DialogStrings.TableFilter_Text_AreaName_Includes
        break
      case DataTable_Columns_Type.ServiceAreas_State:
        targetLabel = DialogStrings.TableFilter_Text_State_Includes
        break
      case DataTable_Columns_Type.AttachedVendors_VendorName:
        targetLabel = DialogStrings.TableFilter_Text_VendorName_Includes
        break
      case DataTable_Columns_Type.AttachedVendors_InternalName:
        targetLabel = DialogStrings.TableFilter_Text_InternalName_Includes
        break
      case DataTable_Columns_Type.WeatherEvents_EventName:
        targetLabel = DialogStrings.TableFilter_Text_EventName_Includes
        break
      case DataTable_Columns_Type.WeatherEvents_CATCode:
        targetLabel = DialogStrings.TableFilter_Text_CATCode_Includes
        break
      default:
        throw new Error(`The target column: ${column} has not been defined yet`)
    }
    await this.page.getByLabel(targetLabel).click()
    await this.page.getByLabel(targetLabel).fill(filterTerm)
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
