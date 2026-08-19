import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, VendorRuleType } from '../clientPortalConstants.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { CatgorizeAndSetRuleDescription } from '../clientPortalHelper.js'
import { Vendor } from '../clientPortalVendor.js'
import { ClientPortalBase } from '../pages/clientPortalBase.js'
import { VendorRule } from '../rules/clientPortalVendorRule.js'
import { VendorRuleGroup } from '../rules/clientPortalVendorRuleGroup.js'

export class ClientPortalSelectRulesFromVendorDrawer extends ClientPortalBase {
  readonly Title: Element
  readonly Label_SelectRules: Element
  readonly Label_SelectRulesDescription: Element
  readonly Checkbox_RuleSummary: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly parent: Locator
  private targetVendor: Vendor
  RuleSet: VendorRuleGroup[]

  constructor(global: ClientPortalGlobal, vendor: Vendor) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = `${DrawerStrings.SelectRulesFromVendor_Title}"${vendor.name}"`
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(
      global.page,
      this.parent
        .locator('div.chakra-modal__footer')
        .getByRole('button', { name: `${DrawerStrings.Button_Close}` })
    )
    this.Button_Submit = new Element(
      global.page,
      this.page.locator('#attachRulesForm-submit'),
      DrawerStrings.Button_Submit
    )
    this.Label_SelectRules = new Element(
      global.page,
      this.parent.locator('#attachRulesForm div.chakra-alert__title'),
      DrawerStrings.SelectRulesFromVendor_Label_SelectRules
    )
    this.Label_SelectRulesDescription = new Element(
      global.page,
      this.parent.locator('#attachRulesForm div.chakra-alert__desc'),
      DrawerStrings.SelectRulesFromVendor_Label_SelectRulesDescription
    )
    this.Checkbox_RuleSummary = new Element(
      global.page,
      this.page.locator('#vendorrulesform_checkbox_rulesummary').locator('..'),
      DrawerStrings.SelectRulesFromVendor_Checkbox_RuleSummary
    )
    this.targetVendor = vendor
    this.RuleSet = []
  }

  async SelectAllRules() {
    await this.page
      .locator('#attachRulesForm div[role="group"] > div > label')
      .nth(0)
      .setChecked(true)
  }

  async SetRuleGroupCheckboxByIndex(index: number, checked: boolean) {
    await this.page
      .locator('#attachRulesForm div[role="group"] > div > label')
      .nth(index + 1)
      .setChecked(checked)
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }

  async LoadRuleSet() {
    const checkboxLocator = this.page.locator('#attachRulesForm div[role="group"] > div > label')
    const ruleGroupCount = (await checkboxLocator.count()) - 1
    if (ruleGroupCount > 0) {
      this.RuleSet = []
      for (let index = 0; index < ruleGroupCount; index++) {
        const newRuleGroup = await this.GetRuleGroupByIndex(index)
        this.RuleSet.push(newRuleGroup)
      }
    }
  }

  async GetRuleGroupByIndex(index: number) {
    const ruleGroup = new VendorRuleGroup({})
    const conditionsRootLocator = this.page.locator(`#rule_${index}_rulesummary`)
    const actionRootLocator = this.page.locator(`#rule_${index}_ruleactionsummary`)
    const assignmentCheck = await actionRootLocator.textContent()
    ruleGroup.assignment =
      assignmentCheck == 'assign as Claim Assignment'
        ? VendorRuleType.Assignment
        : VendorRuleType.Mitigation
    const inversionCheck = await conditionsRootLocator.locator(`> span`).nth(0).textContent()
    ruleGroup.inverted = inversionCheck?.startsWith('If not') ? true : false
    const conditionsCount = await conditionsRootLocator
      .locator(`> span`)
      .nth(1)
      .locator('> span[id]')
      .count()
    for (let conditionIndex = 0; conditionIndex < conditionsCount; conditionIndex++) {
      const ruleLocator = this.page.locator(`#rule_${index}_ruleconditionsummary_${conditionIndex}`)
      const rule = await this.ParseVendorRule(ruleLocator)
      ruleGroup.rules.push(rule)
    }
    return ruleGroup
  }

  async ParseVendorRule(ruleLocator: Locator) {
    const rule = new VendorRule()
    const fieldName = await ruleLocator.locator('> code').nth(0).textContent()
    const source = await ruleLocator.locator('> code').nth(1).textContent()
    const conditions = await ruleLocator.locator('> code').nth(2).textContent()
    const ruleDescriptionText = await ruleLocator.textContent()
    if (ruleDescriptionText == null || fieldName == null || source == null || conditions == null)
      throw new Error('invalid rule description')
    const operator = ruleDescriptionText.slice(
      13 + fieldName.length + source.length,
      -(1 + conditions.length)
    )
    rule.description = CatgorizeAndSetRuleDescription(fieldName, source, operator, conditions)
    return rule
  }

  async FindMatchingRuleGroup(ruleGroupToMatch: VendorRuleGroup, forceReload = false) {
    // load rule set if it is empty or if we are forcing them to load
    if (this.RuleSet.length == 0 || forceReload) {
      await this.LoadRuleSet()
    }
    const stringifiedTargetRuleGroup = JSON.stringify(ruleGroupToMatch)
    const currentRuleSetLength = this.RuleSet.length
    if (currentRuleSetLength > 0) {
      for (let index = currentRuleSetLength - 1; index >= 0; index--) {
        const stringifiedRuleGroup = JSON.stringify(this.RuleSet[index])
        console.log(`FromTable (${stringifiedRuleGroup.length})    : ${stringifiedRuleGroup}`)
        console.log(
          `FromTarget (${stringifiedTargetRuleGroup.length})  : ${stringifiedTargetRuleGroup}`
        )
        if (stringifiedRuleGroup === stringifiedTargetRuleGroup) {
          console.log(`Found a target match at rule group index (${index})`)
          return index
        }
      }
    }
    return null
  }

  async FindAndSelectGroupRule(ruleGroupToFind: VendorRuleGroup) {
    const index = await this.FindMatchingRuleGroup(ruleGroupToFind)
    if (index != null) {
      await this.SetRuleGroupCheckboxByIndex(index, true)
      return true
    }
    return false
  }
}
