import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings, VendorRuleType } from '../clientPortalConstants.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { ClientPortalBase } from '../pages/clientPortalBase.js'
import { ArrayRule } from '../rules/clientPortalArrayRule.js'
import { BooleanRule } from '../rules/clientPortalBooleanRule.js'
import { DateTimeRule } from '../rules/clientPortalDateTimeRule.js'
import { TextRule } from '../rules/clientPortalTextRule.js'
import { VendorRule } from '../rules/clientPortalVendorRule.js'
import { VendorRuleGroup } from '../rules/clientPortalVendorRuleGroup.js'

export class ClientPortalCreateVendorRuleDrawer extends ClientPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly Label_Alert_CreateVendorRule: Element
  readonly Label_Alert_CreateVendorRuleDescription: Element
  readonly parent: Locator
  CurrentRuleCount: number

  constructor(global: ClientPortalGlobal, type: VendorRuleType, isUpdateMode = false) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    let titleText = DrawerStrings.CreateVendorRule_Title_Create
    switch (type) {
      case VendorRuleType.Assignment:
        titleText = isUpdateMode
          ? DrawerStrings.CreateVendorRule_Title_UpdateAssignment
          : DrawerStrings.CreateVendorRule_Title_CreateAssignment
        break
      case VendorRuleType.Mitigation:
        titleText = isUpdateMode
          ? DrawerStrings.CreateVendorRule_Title_UpdateMitigation
          : DrawerStrings.CreateVendorRule_Title_CreateMitigation
        break
    }
    this.Title = new Element(
      global.page,
      this.parent.locator('#chakra-modal--header-drawer_vendorrule'),
      titleText
    )
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(global.page, this.page.locator('#drawer_vendorrule_close'))
    this.Button_Submit = new Element(
      global.page,
      this.page.locator('#vendorRuleForm-submit'),
      DrawerStrings.Button_Submit
    )
    this.Label_Alert_CreateVendorRule = new Element(
      global.page,
      this.parent.locator('#drawer_vendorrule_alert_createrule_vendor > div > div').nth(0),
      DrawerStrings.CreateVendorRule_Alert_CreateVendorRule
    )
    this.Label_Alert_CreateVendorRuleDescription = new Element(
      global.page,
      this.parent.locator('#drawer_vendorrule_alert_createrule_vendor > div > div').nth(1),
      DrawerStrings.CreateVendorRule_Alert_CreateVendorRuleDescription
    )
    this.CurrentRuleCount = 0
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }

  async Validate() {
    // Validate we need at least 1 rule and that the error is..
    let atLeastOneRuleIsValidated = false
    const ruleValidator = this.page.locator(
      '#card_rulebuilder_conditions > div > div:nth-of-type(2) > div'
    )
    if ((await ruleValidator.count()) > 0) {
      const validationText = await ruleValidator.textContent()
      atLeastOneRuleIsValidated = validationText == ValidationStrings.AtLeastOneRuleRequired
    }

    // Validate assignment Field is in an invalid state and that the error is..
    let assignmentFieldIsValidated = false
    const assignmentValidator = this.page.locator('#assignmentType')
    if ((await assignmentValidator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await assignmentValidator.getAttribute('aria-describedby')
      const validationText = await this.parent.locator(`div[id*='${referenceId}']`).textContent()
      assignmentFieldIsValidated = validationText == ValidationStrings.InvalidAssignmentTypeEnum
    }
    return atLeastOneRuleIsValidated && assignmentFieldIsValidated
  }

  async GetRuleCount() {
    const ruleCount = await this.parent
      .locator(`[data-testid="rule-group"] button[title="Remove rule"]`)
      .count()
    this.CurrentRuleCount = ruleCount
  }

  async SelectFieldByLabel(ruleIndex: number, fieldLabel: string) {
    const fieldLocator = this.parent.locator(
      `div[data-testid="rule"][data-path="[${ruleIndex}]"] select[title="Fields"]`
    )
    await fieldLocator.selectOption({ label: fieldLabel })
  }

  async SelectFieldByValue(ruleIndex: number, fieldValue: string) {
    const fieldLocator = this.parent.locator(
      `div[data-testid="rule"][data-path="[${ruleIndex}]"] select[title="Fields"]`
    )
    await fieldLocator.selectOption({ value: fieldValue })
  }

  async SelectOperatorByLabel(ruleIndex: number, operatorLabel: string) {
    const operatorLocator = this.parent.locator(
      `div[data-testid="rule"][data-path="[${ruleIndex}]"] select[title="Operators"]`
    )
    await operatorLocator.selectOption({ label: operatorLabel })
  }

  async SelectOperatorByValue(ruleIndex: number, operatorValue: string) {
    const operatorLocator = this.parent.locator(
      `div[data-testid="rule"][data-path="[${ruleIndex}]"] select[title="Operators"]`
    )
    await operatorLocator.selectOption({ value: operatorValue })
  }

  async SelectListValueByLabel(ruleIndex: number, listValueLabel: string) {
    const listLocator = this.parent.locator(
      `div[data-testid="rule"][data-path="[${ruleIndex}]"] select[title="Value"]`
    )
    await listLocator.selectOption({ label: listValueLabel })
  }

  async SelectListValueByValue(ruleIndex: number, listValueValue: string) {
    const listLocator = this.parent.locator(
      `div[data-testid="rule"][data-path="[${ruleIndex}]"] select[title="Value"]`
    )
    await listLocator.selectOption({ value: listValueValue })
  }

  async SetArrayRuleValue(ruleIndex: number, value: string) {
    const arrayLocator = this.parent.locator(
      `div[data-testid="rule"][data-path="[${ruleIndex}]"] input`
    )
    const clearButtonLocation = this.parent.locator(
      `div[data-testid="rule"][data-path="[${ruleIndex}]"] div[role="button"][aria-label="Clear selected options"]`
    )
    if ((await clearButtonLocation.count()) > 0) {
      await clearButtonLocation.click()
      await this.page.waitForTimeout(200)
    }
    await arrayLocator.fill(value)
    await this.page.waitForTimeout(500)
    await this.page.keyboard.press('Tab')
  }

  async SetBooleanRuleSwitch(ruleIndex: number, targetState: string) {
    const switchLocator = this.parent.locator(
      `div[data-testid="rule"][data-path="[${ruleIndex}]"] label`
    )
    await switchLocator.setChecked(targetState == 'true')
  }

  async SelectTimeframeByValue(ruleIndex: number, timeframeValue: string) {
    const timeFrameLocator = this.parent.locator(
      `div[data-testid="rule"][data-path="[${ruleIndex}]"] div[title="Value"] select`
    )
    await timeFrameLocator.selectOption({ value: timeframeValue })
  }

  async SelectAssignmentTypeByLabel(assignmentTypeLabel: string) {
    const assignmentTypeLocator = this.parent.locator(`select[name="assignmentType"]`)
    await assignmentTypeLocator.selectOption({ label: assignmentTypeLabel })
  }

  async SelectAssignmentTypeByValue(assignmentTypeValue: string) {
    const assignmentTypeLocator = this.parent.locator(`select[name="assignmentType"]`)
    await assignmentTypeLocator.selectOption({ value: assignmentTypeValue })
  }

  async SetInvertRuleGroupSwitch(ruleGroup: Locator, targetState: boolean) {
    const switchLocator = ruleGroup.locator('label:nth-child(1)')
    await switchLocator.setChecked(targetState)
  }

  async AddListRuleDescription(listRuleDescription: ArrayRule) {
    await this.SelectFieldByValue(
      this.CurrentRuleCount - 1,
      `${listRuleDescription.fieldSource}_${listRuleDescription.field}`
    )
    switch (listRuleDescription.operator) {
      case 'isoneof':
        await this.SelectOperatorByValue(this.CurrentRuleCount - 1, 'HasOneOf')
        break
      case 'hasallof':
        await this.SelectOperatorByValue(this.CurrentRuleCount - 1, 'HasAllOf')
        break
      case 'hasexactly':
        await this.SelectOperatorByValue(this.CurrentRuleCount - 1, 'HasExactly')
        break
      case 'lengthgreaterthan':
        await this.SelectOperatorByValue(this.CurrentRuleCount - 1, 'LengthGreaterThan')
        break
      case 'lengthlessthan':
        await this.SelectOperatorByValue(this.CurrentRuleCount - 1, 'LengthLessThan')
        break
      case 'lengthequalto':
        await this.SelectOperatorByValue(this.CurrentRuleCount - 1, 'LengthEqualTo')
        break
    }
    switch (listRuleDescription.operator) {
      case 'isoneof':
      case 'hasallof':
      case 'hasexactly':
        for (let index = 0; index < listRuleDescription.conditions.length; index++) {
          await this.SetArrayRuleValue(
            this.CurrentRuleCount - 1,
            listRuleDescription.conditions[index]
          )
        }
        break
      default: // length single value expected
        await this.SetArrayRuleValue(
          this.CurrentRuleCount - 1,
          listRuleDescription.conditions.toString()
        )
        break
    }
  }

  async AddBooleanRuleDescription(booleanRuleDescription: BooleanRule) {
    await this.SelectFieldByValue(
      this.CurrentRuleCount - 1,
      `${booleanRuleDescription.fieldSource}_${booleanRuleDescription.field}`
    )
    await this.SetBooleanRuleSwitch(this.CurrentRuleCount - 1, booleanRuleDescription.condition)
  }

  async AddTextRuleDescription(textRuleDescription: TextRule) {
    await this.SelectFieldByValue(
      this.CurrentRuleCount - 1,
      `${textRuleDescription.fieldSource}_${textRuleDescription.field}`
    )
    switch (textRuleDescription.operator) {
      case 'is':
        await this.SelectOperatorByValue(this.CurrentRuleCount - 1, 'Equals')
        break
      case 'isnot':
        await this.SelectOperatorByValue(this.CurrentRuleCount - 1, 'NotEquals')
        break
      case 'contains':
        await this.SelectOperatorByValue(this.CurrentRuleCount - 1, 'Contains')
        break
      case 'beginswith':
        await this.SelectOperatorByValue(this.CurrentRuleCount - 1, 'BeginsWith')
        break
      case 'endswith':
        await this.SelectOperatorByValue(this.CurrentRuleCount - 1, 'EndsWith')
        break
    }
    await this.SetArrayRuleValue(this.CurrentRuleCount - 1, textRuleDescription.value.toString())
  }

  async AddArrayRuleDescription(arrayRuleDescription: ArrayRule) {
    await this.SelectFieldByValue(
      this.CurrentRuleCount - 1,
      `${arrayRuleDescription.fieldSource}_${arrayRuleDescription.field}`
    )
    switch (arrayRuleDescription.operator) {
      case 'is':
        await this.SelectOperatorByValue(this.CurrentRuleCount - 1, 'Equals')
        await this.SelectListValueByValue(
          this.CurrentRuleCount - 1,
          arrayRuleDescription.conditions as string
        )
        break
      case 'isnot':
        await this.SelectOperatorByValue(this.CurrentRuleCount - 1, 'NotEquals')
        await this.SelectListValueByValue(
          this.CurrentRuleCount - 1,
          arrayRuleDescription.conditions as string
        )
        break
      case 'isoneof':
        await this.SelectOperatorByValue(this.CurrentRuleCount - 1, 'IsOneOf')
        for (let index = 0; index < arrayRuleDescription.conditions.length; index++) {
          await this.SetArrayRuleValue(
            this.CurrentRuleCount - 1,
            arrayRuleDescription.conditions[index]
          )
        }
        break
    }
  }

  async AddDateTimeRuleDescription(dateTimeRuleDescription: DateTimeRule) {
    await this.SelectFieldByValue(
      this.CurrentRuleCount - 1,
      `${dateTimeRuleDescription.fieldSource}_${dateTimeRuleDescription.field}`
    )
    switch (dateTimeRuleDescription.operator) {
      case 'isafter':
        await this.SelectOperatorByValue(this.CurrentRuleCount - 1, 'Since')
        break
      case 'isbefore':
        await this.SelectOperatorByValue(this.CurrentRuleCount - 1, 'Before')
        break
    }
    await this.SetArrayRuleValue(
      this.CurrentRuleCount - 1,
      dateTimeRuleDescription.value.toString()
    )
    switch (dateTimeRuleDescription.timeframe) {
      case 'days':
        await this.SelectTimeframeByValue(this.CurrentRuleCount - 1, 'Days')
        break
      case 'minutes':
        await this.SelectTimeframeByValue(this.CurrentRuleCount - 1, 'Minutes')
        break
      case 'hours':
        await this.SelectTimeframeByValue(this.CurrentRuleCount - 1, 'Hours')
        break
      case 'weeks':
        await this.SelectTimeframeByValue(this.CurrentRuleCount - 1, 'Weeks')
        break
      case 'years':
        await this.SelectTimeframeByValue(this.CurrentRuleCount - 1, 'Years')
        break
    }
  }

  async AddRule(rule: VendorRule) {
    const rootRuleSetSelector = this.parent.locator(
      `div[data-testid="rule-group"][data-level="0"][data-path="[]"]`
    )
    await rootRuleSetSelector.locator(`> div > button[title="Add rule"]`).click()
    await this.GetRuleCount()
    switch (rule.description.type) {
      case 'Array':
        await this.AddArrayRuleDescription(rule.description)
        break
      case 'List':
        await this.AddListRuleDescription(rule.description)
        break
      case 'Boolean':
        await this.AddBooleanRuleDescription(rule.description)
        break
      case 'DateTime':
        await this.AddDateTimeRuleDescription(rule.description)
        break
      case 'Text':
        await this.AddTextRuleDescription(rule.description)
        break
    }
  }

  async FillDrawer(vendorRuleGroup: VendorRuleGroup) {
    const rootRuleGroupSelector = this.parent.locator(
      `div[data-testid="rule-group"][data-level="0"][data-path="[]"]`
    )
    await this.SetInvertRuleGroupSwitch(rootRuleGroupSelector, vendorRuleGroup.inverted)
    for (let ruleIndex = 0; ruleIndex < vendorRuleGroup.rules.length; ruleIndex++) {
      await this.AddRule(vendorRuleGroup.rules[ruleIndex])
    }
    await this.SelectAssignmentTypeByLabel(vendorRuleGroup.assignment)
    await this.Button_Submit.Click()
  }

  async ReplaceFilledDrawer(updatedVendorRuleGroup: VendorRuleGroup) {
    await this.DeleteAllCurrentRulesInDrawer()
    await this.FillDrawer(updatedVendorRuleGroup)
  }

  async DeleteAllCurrentRulesInDrawer() {
    await this.GetRuleCount()
    if (this.CurrentRuleCount > 0) {
      do {
        const removeRuleLocator = this.parent
          .locator(`[data-testid="rule-group"] button[title="Remove rule"]`)
          .nth(0)
        await removeRuleLocator.click()
        await this.GetRuleCount()
      } while (this.CurrentRuleCount > 0)
    }
  }
}
