import { Locator, expect } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../clientPortalConstants.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { ClientPortalBase } from '../pages/clientPortalBase.js'
import { ArrayRule } from '../rules/clientPortalArrayRule.js'
import { BooleanRule } from '../rules/clientPortalBooleanRule.js'
import { DateTimeRule } from '../rules/clientPortalDateTimeRule.js'
import { GlobalRule } from '../rules/clientPortalGlobalRule.js'
import { GlobalRuleGroup } from '../rules/clientPortalGlobalRuleGroup.js'
import { GlobalRuleItem } from '../rules/clientPortalGlobalRuleItem.js'
import { GlobalRuleSet } from '../rules/clientPortalGlobalRuleSet.js'
import { ListRule } from '../rules/clientPortalListRule.js'
import { TextRule } from '../rules/clientPortalTextRule.js'

export class ClientPortalCreateGlobalRuleDrawer extends ClientPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly parent: Locator
  CurrentRuleCount: number
  CurrentRuleGroupCount: number
  CurrentRuleDataLevel: number
  CurrentRuleDataPath: string
  CurrentGroupDataLevel: number
  CurrentGroupDataPath: string

  constructor(global: ClientPortalGlobal, isUpdateMode = false) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = isUpdateMode
      ? DrawerStrings.CreateGlobalRule_Title_Update
      : DrawerStrings.CreateGlobalRule_Title_Create
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(global.page, this.page.locator('#drawer_globalrule_close'))
    this.Button_Submit = new Element(
      global.page,
      this.page.locator('#globalRuleForm-submit'),
      DrawerStrings.Button_Submit
    )
    this.CurrentRuleCount = 0
    this.CurrentRuleGroupCount = 0
    this.CurrentRuleDataLevel = 0
    this.CurrentRuleDataPath = ''
    this.CurrentGroupDataLevel = 0
    this.CurrentGroupDataPath = ''
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

    // Validate attribute Field is in an invalid state and that the error is..
    let attributeFieldIsValidated = false
    const attributeValidator = this.page.locator('select[id="action.attributeName"]')
    if ((await attributeValidator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await attributeValidator.getAttribute('aria-describedby')
      const validationText = await this.parent.locator(`div[id*='${referenceId}']`).textContent()
      attributeFieldIsValidated = validationText == ValidationStrings.SelectAttribute
    }
    return atLeastOneRuleIsValidated && attributeFieldIsValidated
  }

  async GetRuleAndRuleGroupCount() {
    const ruleCount = await this.parent
      .locator(`[data-testid="rule-group"] button[title="Remove rule"]`)
      .count()
    this.CurrentRuleCount = ruleCount
    const ruleGroupCount = await this.parent
      .locator(`[data-testid="rule-group"] button[title="Remove group"]`)
      .count()
    this.CurrentRuleGroupCount = ruleGroupCount
  }

  async SelectFieldByLabel(fieldLabel: string) {
    const fieldLocator = this.parent.locator(
      `div[data-testid="rule"][data-level="${this.CurrentRuleDataLevel}"][data-path="[${this.CurrentRuleDataPath}]"] select[title="Fields"]`
    )
    await fieldLocator.selectOption({ label: fieldLabel })
  }

  async SelectFieldByValue(fieldValue: string) {
    const fieldLocator = this.parent.locator(
      `div[data-testid="rule"][data-level="${this.CurrentRuleDataLevel}"][data-path="[${this.CurrentRuleDataPath}]"] select[title="Fields"]`
    )
    await fieldLocator.selectOption({ value: fieldValue })
  }

  async SelectOperatorByLabel(operatorLabel: string) {
    const operatorLocator = this.parent.locator(
      `div[data-testid="rule"][data-level="${this.CurrentRuleDataLevel}"][data-path="[${this.CurrentRuleDataPath}]"] select[title="Operators"]`
    )
    await operatorLocator.selectOption({ label: operatorLabel })
  }

  async SelectOperatorByValue(operatorValue: string) {
    const operatorLocator = this.parent.locator(
      `div[data-testid="rule"][data-level="${this.CurrentRuleDataLevel}"][data-path="[${this.CurrentRuleDataPath}]"] select[title="Operators"]`
    )
    await operatorLocator.selectOption({ value: operatorValue })
  }

  async SelectListValueByLabel(listValueLabel: string) {
    const listLocator = this.parent.locator(
      `div[data-testid="rule"][data-level="${this.CurrentRuleDataLevel}"][data-path="[${this.CurrentRuleDataPath}]"] select[title="Value"]`
    )
    await listLocator.selectOption({ label: listValueLabel })
  }

  async SelectListValueByValue(listValueValue: string) {
    const listLocator = this.parent.locator(
      `div[data-testid="rule"][data-level="${this.CurrentRuleDataLevel}"][data-path="[${this.CurrentRuleDataPath}]"] select[title="Value"]`
    )
    await listLocator.selectOption({ value: listValueValue })
  }

  async SelectTimeframeByValue(timeframeValue: string) {
    const timeFrameLocator = this.parent.locator(
      `div[data-testid="rule"][data-level="${this.CurrentRuleDataLevel}"][data-path="[${this.CurrentRuleDataPath}]"] div[title="Value"] select`
    )
    await timeFrameLocator.selectOption({ value: timeframeValue })
  }

  async SetArrayRuleValue(value: string) {
    const arrayLocator = this.parent.locator(
      `div[data-testid="rule"][data-level="${this.CurrentRuleDataLevel}"][data-path="[${this.CurrentRuleDataPath}]"] input`
    )
    await arrayLocator.fill(value)
    await this.page.waitForTimeout(500)
    await this.page.keyboard.press('Tab')
  }

  async SetBooleanRuleSwitch(targetState: string) {
    const switchLocator = this.parent.locator(
      `div[data-testid="rule"][data-level="${this.CurrentRuleDataLevel}"][data-path="[${this.CurrentRuleDataPath}]"] label`
    )
    await switchLocator.setChecked(targetState == 'true')
  }

  async SelectAttributeTypeByLabel(attributeTypeLabel: string) {
    const attributeLocator = this.parent.locator(`select[name="action.attributeName"]`)
    await attributeLocator.selectOption({ label: attributeTypeLabel })
  }

  async SelectAttributeTypeByValue(attributeTypeValue: string) {
    const attributeLocator = this.parent.locator(`select[name="action.attributeName"]`)
    await attributeLocator.selectOption({ value: attributeTypeValue })
  }

  async SetAttributeBooleanSwitch(targetState: boolean) {
    const switchLocator = this.parent.locator('#drawer_globalrule_switch_tovalue-label')
    await switchLocator.setChecked(targetState)
  }

  async SetInvertRuleGroupSwitch(ruleGroup: Locator, targetState: boolean) {
    const switchLocator = ruleGroup.locator('label:nth-child(1)')
    await switchLocator.setChecked(targetState)
  }

  async SetRuleGroupCombinatorByLabel(ruleGroup: Locator, combinatorLabel: string) {
    const combinatorLocator = ruleGroup.locator('select[title="Combinators"]')
    await combinatorLocator.selectOption({ label: combinatorLabel })
  }

  async SetRuleGroupCombinatorByValue(ruleGroup: Locator, combinatorValue: string) {
    const combinatorLocator = ruleGroup.locator('select[title="Combinators"]')
    await combinatorLocator.count()
    await expect(combinatorLocator).toBeAttached()
    await combinatorLocator.selectOption({ value: combinatorValue })
  }

  async AddListRuleDescription(listRuleDescription: ArrayRule) {
    await this.SelectFieldByValue(`${listRuleDescription.fieldSource}_${listRuleDescription.field}`)
    switch (listRuleDescription.operator) {
      case 'isoneof':
        await this.SelectOperatorByValue('HasOneOf')
        break
      case 'hasallof':
        await this.SelectOperatorByValue('HasAllOf')
        break
      case 'hasexactly':
        await this.SelectOperatorByValue('HasExactly')
        break
      case 'lengthgreaterthan':
        await this.SelectOperatorByValue('LengthGreaterThan')
        break
      case 'lengthlessthan':
        await this.SelectOperatorByValue('LengthLessThan')
        break
      case 'lengthequalto':
        await this.SelectOperatorByValue('LengthEqualTo')
        break
    }
    switch (listRuleDescription.operator) {
      case 'isoneof':
      case 'hasallof':
      case 'hasexactly':
        for (let index = 0; index < listRuleDescription.conditions.length; index++) {
          await this.SetArrayRuleValue(listRuleDescription.conditions[index])
        }
        break
      default: // length single value expected
        await this.SetArrayRuleValue(listRuleDescription.conditions.toString())
        break
    }
  }

  async AddBooleanRuleDescription(booleanRuleDescription: BooleanRule) {
    await this.SelectFieldByValue(
      `${booleanRuleDescription.fieldSource}_${booleanRuleDescription.field}`
    )
    await this.SelectOperatorByValue('Equals')
    await this.SetBooleanRuleSwitch(booleanRuleDescription.condition)
  }

  async AddTextRuleDescription(textRuleDescription: TextRule) {
    await this.SelectFieldByValue(`${textRuleDescription.fieldSource}_${textRuleDescription.field}`)
    switch (textRuleDescription.operator) {
      case 'is':
        await this.SelectOperatorByValue('Equals')
        break
      case 'isnot':
        await this.SelectOperatorByValue('NotEquals')
        break
      case 'contains':
        await this.SelectOperatorByValue('Contains')
        break
      case 'beginswith':
        await this.SelectOperatorByValue('BeginsWith')
        break
      case 'endswith':
        await this.SelectOperatorByValue('EndsWith')
        break
    }
    await this.SetArrayRuleValue(textRuleDescription.value.toString())
  }

  async AddArrayRuleDescription(arrayRuleDescription: ListRule) {
    await this.SelectFieldByValue(
      `${arrayRuleDescription.fieldSource}_${arrayRuleDescription.field}`
    )
    switch (arrayRuleDescription.operator) {
      case 'is':
        await this.SelectOperatorByValue('Equals')
        await this.SelectListValueByValue(arrayRuleDescription.conditions as string)
        break
      case 'isnot':
        await this.SelectOperatorByValue('NotEquals')
        await this.SelectListValueByValue(arrayRuleDescription.conditions as string)
        break
      case 'isoneof':
        await this.SelectOperatorByValue('IsOneOf')
        for (let index = 0; index < arrayRuleDescription.conditions.length; index++) {
          await this.SetArrayRuleValue(arrayRuleDescription.conditions[index])
        }
        break
    }
  }

  async AddDateTimeRuleDescription(dateTimeRuleDescription: DateTimeRule) {
    await this.SelectFieldByValue(
      `${dateTimeRuleDescription.fieldSource}_${dateTimeRuleDescription.field}`
    )
    switch (dateTimeRuleDescription.operator) {
      case 'isafter':
        await this.SelectOperatorByValue('Since')
        break
      case 'isbefore':
        await this.SelectOperatorByValue('Before')
        break
    }
    await this.SetArrayRuleValue(dateTimeRuleDescription.value.toString())
    switch (dateTimeRuleDescription.timeframe) {
      case 'days':
        await this.SelectTimeframeByValue('Days')
        break
      case 'minutes':
        await this.SelectTimeframeByValue('Minutes')
        break
      case 'hours':
        await this.SelectTimeframeByValue('Hours')
        break
      case 'weeks':
        await this.SelectTimeframeByValue('Weeks')
        break
      case 'years':
        await this.SelectTimeframeByValue('Years')
        break
    }
  }

  async AddRule(ruleItem: GlobalRuleItem) {
    const ruleGroupSelector = `div[data-testid="rule-group"][data-level="${this.CurrentGroupDataLevel}"][data-path="[${this.CurrentGroupDataPath}]"]`
    await this.parent.locator(ruleGroupSelector).locator(`> div > button[title="Add rule"]`).click()
    const rule = ruleItem.item as GlobalRule
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

  async AddRuleGroup(ruleItem: GlobalRuleItem) {
    const parentRuleGroupSelector = this.parent.locator(
      `div[data-testid="rule-group"][data-level="${this.CurrentGroupDataLevel}"][data-path="[${this.CurrentGroupDataPath}]"]`
    )
    await parentRuleGroupSelector.locator(`> div > button[title="Add group"]`).click()
    const ruleGroupSelector = this.parent.locator(
      `div[data-testid="rule-group"][data-level="${ruleItem.dataLevel}"][data-path="[${ruleItem.dataPath}]"]`
    )
    const ruleGroup = ruleItem.item as GlobalRuleGroup
    await this.SetRuleGroupCombinatorByValue(ruleGroupSelector, ruleGroup.combinator)
    await this.SetInvertRuleGroupSwitch(ruleGroupSelector, ruleGroup.inverted)
    for (let itemIndex = 0; itemIndex < ruleGroup.items.length; itemIndex++) {
      switch (ruleGroup.items[itemIndex].type) {
        case 'Rule':
          this.CurrentGroupDataLevel = ruleItem.dataLevel
          this.CurrentGroupDataPath = ruleItem.dataPath
          this.CurrentRuleDataLevel = ruleGroup.items[itemIndex].dataLevel
          this.CurrentRuleDataPath = ruleGroup.items[itemIndex].dataPath
          await this.AddRule(ruleGroup.items[itemIndex])
          break
        case 'RuleGroup':
          this.CurrentGroupDataLevel = ruleItem.dataLevel
          this.CurrentGroupDataPath = ruleItem.dataPath
          await this.AddRuleGroup(ruleGroup.items[itemIndex])
      }
    }
  }

  async FillDrawer(globalRuleSet: GlobalRuleSet) {
    const rootRuleGroupSelector = this.parent.locator(
      `div[data-testid="rule-group"][data-level="${this.CurrentGroupDataLevel}"][data-path="[${this.CurrentGroupDataPath}]"]`
    )
    await this.SetRuleGroupCombinatorByValue(rootRuleGroupSelector, globalRuleSet.combinator)
    await this.SetInvertRuleGroupSwitch(rootRuleGroupSelector, globalRuleSet.inverted)
    for (let itemIndex = 0; itemIndex < globalRuleSet.items.length; itemIndex++) {
      switch (globalRuleSet.items[itemIndex].type) {
        case 'Rule':
          this.CurrentGroupDataLevel = 0
          this.CurrentGroupDataPath = ''
          this.CurrentRuleDataLevel = globalRuleSet.items[itemIndex].dataLevel
          this.CurrentRuleDataPath = globalRuleSet.items[itemIndex].dataPath
          await this.AddRule(globalRuleSet.items[itemIndex])
          break
        case 'RuleGroup':
          this.CurrentGroupDataLevel = 0
          this.CurrentGroupDataPath = ''
          await this.AddRuleGroup(globalRuleSet.items[itemIndex])
      }
    }
    await this.SelectAttributeTypeByLabel(globalRuleSet.attributeName)
    await this.SetAttributeBooleanSwitch(globalRuleSet.attributeDescription)
    await this.Button_Submit.Click()
  }

  async ReplaceFilledDrawer(updatedGlobalRuleSet: GlobalRuleSet) {
    await this.DeleteAllCurrentGlobalRulesInDrawer()
    this.CurrentRuleDataLevel = 0
    this.CurrentRuleDataPath = ''
    this.CurrentGroupDataLevel = 0
    this.CurrentGroupDataPath = ''
    await this.FillDrawer(updatedGlobalRuleSet)
  }

  async DeleteAllCurrentGlobalRulesInDrawer() {
    // Remove all the groups first
    await this.GetRuleAndRuleGroupCount()
    if (this.CurrentRuleGroupCount > 0) {
      do {
        const removeRuleGroupLocator = this.parent
          .locator(`[data-testid="rule-group"] button[title="Remove group"]`)
          .nth(0)
        await removeRuleGroupLocator.click()
        await this.GetRuleAndRuleGroupCount()
      } while (this.CurrentRuleCount > 0)
    }

    // remove any individual rules left
    await this.GetRuleAndRuleGroupCount()
    if (this.CurrentRuleCount > 0) {
      do {
        const removeRuleLocator = this.parent
          .locator(`[data-testid="rule-group"] button[title="Remove rule"]`)
          .nth(0)
        await removeRuleLocator.click()
        await this.GetRuleAndRuleGroupCount()
      } while (this.CurrentRuleCount > 0)
    }
  }
}
