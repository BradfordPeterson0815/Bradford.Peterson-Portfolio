import { Locator } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { ClientPortalDeleteAlert } from '../alerts/clientPortalDeleteAlert.js'
import {
  AlertStrings,
  ClaimAssignmentRulesSectionStrings,
  MitigationAssignmentRulesSectionStrings,
  VendorRuleType,
  VendorRules_DataTable_ActionMenuItems,
} from '../clientPortalConstants.js'
import { ClientPortalDataTable } from '../clientPortalDataTable.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { CatgorizeAndSetRuleDescription } from '../clientPortalHelper.js'
import { ClientPortalCreateVendorRuleDrawer } from '../drawers/clientPortalCreateVendorRuleDrawer.js'
import { ClientPortalBase } from '../pages/clientPortalBase.js'
import { VendorRule } from '../rules/clientPortalVendorRule.js'
import { VendorRuleGroup } from '../rules/clientPortalVendorRuleGroup.js'

export class ClientPortalAssignmentRulesSection extends ClientPortalBase {
  readonly Title: Element
  readonly DataTable_Rules: ClientPortalDataTable
  readonly Button_CreateRule: Element
  readonly Button_CreateCustomRule: Element
  RuleSet: VendorRuleGroup[]
  readonly supportsCustomRules: boolean
  type: VendorRuleType
  useType: string
  tableLocator: string

  constructor(global: ClientPortalGlobal, type: VendorRuleType, supportsCustomRules: boolean = false) {
    super(global)
    const titleText =
      type == VendorRuleType.Assignment
        ? ClaimAssignmentRulesSectionStrings.Title
        : MitigationAssignmentRulesSectionStrings.Title
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${titleText}` }),
      titleText
    )
    const createRuleText =
      type == VendorRuleType.Assignment
        ? ClaimAssignmentRulesSectionStrings.Button_CreateClaimAssignmentVendorRule
        : MitigationAssignmentRulesSectionStrings.Button_CreateMitigationAssignmentVendorRule
    const createCustomRuleText =
      type == VendorRuleType.Assignment
        ? ClaimAssignmentRulesSectionStrings.Button_CreateCustomClaimAssignmentVendorRule
        : MitigationAssignmentRulesSectionStrings.Button_CreateCustomMitigationAssignmentVendorRule
    const createRuleLocator =
      type == VendorRuleType.Assignment
        ? '#button_addvendorruletype_Assignment'
        : '#button_addvendorruletype_Mitigation'
    const createCustomRuleLocator =
      type == VendorRuleType.Assignment
        ? '#card_vendorrules_Assignment_title > div > button'
        : '#card_vendorrules_Mitigation_title > div > button'
    this.Button_CreateRule = new Element(
      this.global.page,
      this.page.locator(createRuleLocator),
      createRuleText
    )
    this.Button_CreateCustomRule = new Element(
      this.global.page,
      this.page.locator(createCustomRuleLocator),
      createCustomRuleText
    )
    this.tableLocator =
      type == VendorRuleType.Assignment
        ? '#card_vendorrules_Assignment_content'
        : '#card_vendorrules_Mitigation_content'
    this.DataTable_Rules = new ClientPortalDataTable(
      global,
      this.tableLocator,
      1,
      type == VendorRuleType.Assignment
        ? ClaimAssignmentRulesSectionStrings.ActionMenu
        : MitigationAssignmentRulesSectionStrings.ActionMenu,
      type == VendorRuleType.Assignment
        ? ClaimAssignmentRulesSectionStrings.ActionMenuAria
        : MitigationAssignmentRulesSectionStrings.ActionMenuAria
    )
    this.supportsCustomRules = supportsCustomRules
    this.RuleSet = []
    this.type = type
    this.useType = this.type == VendorRuleType.Assignment ? 'Assignment' : 'Mitigation'
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async IsActionMenuItemVisible(
    rowIndex: string,
    actionMenuItem: VendorRules_DataTable_ActionMenuItems
  ) {
    await this.DataTable_Rules.OpenActionMenu(rowIndex)
    await this.page.waitForTimeout(1000)
    const visibility = await this.DataTable_Rules.IsActionMenuItemVisible(actionMenuItem)
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async OpenCreateRuleDrawer() {
    await this.Button_CreateRule.Click()
    const createVendorRuleDrawer = new ClientPortalCreateVendorRuleDrawer(this.global, this.type, false)
    return createVendorRuleDrawer
  }

  async OpenCreateCustomRuleDrawer() {
    await this.Button_CreateCustomRule.Click()
    const createVendorRuleDrawer = new ClientPortalCreateVendorRuleDrawer(this.global, this.type, false)
    return createVendorRuleDrawer
  }

  async LoadRuleSet() {
    const ruleGroupCount = await this.DataTable_Rules.VisibleRowCount()
    if (ruleGroupCount > 0) {
      this.RuleSet = []
      for (let index = 0; index < ruleGroupCount; index++) {
        const newRuleGroup = await this.GetRuleGroupByIndex(index)
        this.RuleSet.push(newRuleGroup)
      }
    }
  }

  async GetRuleGroupByIndex(rowIndex: number) {
    const ruleGroup = new VendorRuleGroup({
      assignment: this.type,
    })
    const conditionsRootLocator = this.page.locator(
      `#vendorrules_${this.useType}__DataGrid_Row_${rowIndex}_conditions > span > p`
    )
    const inversionCheck = await conditionsRootLocator.locator(`> span`).nth(0).textContent()
    ruleGroup.inverted = inversionCheck?.startsWith('If not') ? true : false
    const conditionsCount = await conditionsRootLocator
      .locator(`> span`)
      .nth(1)
      .locator('> span[id]')
      .count()
    for (let conditionIndex = 0; conditionIndex < conditionsCount; conditionIndex++) {
      const ruleLocator = this.page.locator(
        `${this.tableLocator} #rule_${rowIndex}_ruleconditionsummary_${conditionIndex}`
      )
      const rule = await this.ParseVendorRule(ruleLocator)
      ruleGroup.rules.push(rule)
    }
    if (this.supportsCustomRules) {
      const hasParentCheck = await this.page
        .locator(`#vendorrules_${this.useType}__DataGrid_Row_${rowIndex}_hasParent > span > svg`)
        .count()
      ruleGroup.hasParent = hasParentCheck > 0
    } else {
      ruleGroup.hasParent = false
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

  async FindMatchingRuleGroup(ruleGroupToVerify: VendorRuleGroup, forceReload = false) {
    // load rule set if it is empty or if we are forcing them to load
    if (this.RuleSet.length == 0 || forceReload) {
      await this.LoadRuleSet()
    }
    const stringifiedTargetRuleGroup = JSON.stringify(ruleGroupToVerify)
    const currentRuleSetLength = this.RuleSet.length
    if (currentRuleSetLength > 0) {
      for (let index = currentRuleSetLength - 1; index >= 0; index--) {
        const stringifiedRuleGroup = JSON.stringify(this.RuleSet[index])
        console.log(`FromTable (${stringifiedRuleGroup.length})    : ${stringifiedRuleGroup}`)
        console.log(
          `FromTarget (${stringifiedTargetRuleGroup.length})  : ${stringifiedTargetRuleGroup}`
        )
        if (stringifiedRuleGroup === stringifiedTargetRuleGroup) {
          console.log(`Found a target match at table rule group index (${index})`)
          return index
        }
      }
    }
    return null
  }

  async CreateRule(ruleGroupToFill: VendorRuleGroup) {
    const createVendorRuleDrawer = await this.OpenCreateRuleDrawer()
    await createVendorRuleDrawer.FillDrawer(ruleGroupToFill)
    await this.page.waitForTimeout(3000)
  }

  async CreateCustomRule(ruleGroupToFill: VendorRuleGroup) {
    const createVendorRuleDrawer = await this.OpenCreateCustomRuleDrawer()
    await createVendorRuleDrawer.FillDrawer(ruleGroupToFill)
    await this.page.waitForTimeout(3000)
  }

  async UpdateRuleGroupByIndex(ruleIndex: string, updatedRuleGroupToFill: VendorRuleGroup) {
    await this.DataTable_Rules.OpenActionMenu(ruleIndex)
    await this.DataTable_Rules.SelectActionMenuItem(
      VendorRules_DataTable_ActionMenuItems.UpdateRule
    )
    const createVendorRuleDrawer = new ClientPortalCreateVendorRuleDrawer(this.global, this.type, true)
    await createVendorRuleDrawer.ReplaceFilledDrawer(updatedRuleGroupToFill)
    await this.LoadRuleSet() // force an update
    await this.page.waitForTimeout(8000)
  }

  async RemoveRuleGroupByIndex(ruleIndex: string) {
    await this.DataTable_Rules.OpenActionMenu(ruleIndex)
    await this.DataTable_Rules.SelectActionMenuItem(
      VendorRules_DataTable_ActionMenuItems.RemoveRule
    )
    await this.HandleRemoveRuleFromVendorAlert()
    await this.page.waitForTimeout(2000)
  }

  async HandleRemoveRuleFromVendorAlert(cancelRemove = false) {
    const alert = new ClientPortalDeleteAlert(
      this.global,
      AlertStrings.RemoveRuleFromVendor_Title,
      AlertStrings.RemoveRuleFromVendor_Description
    )
    if (cancelRemove) {
      await alert.Button_Close.locator.click({ force: true })
    } else {
      await alert.Button_Confirm.locator.click({ force: true })
    }
  }

  async HandleDetachRuleAlert(cancelDetach = false) {
    const alert = new ClientPortalDeleteAlert(
      this.global,
      AlertStrings.DetachVendorRule_Title,
      AlertStrings.DetachVendorRule_Description
    )
    if (cancelDetach) {
      await alert.Button_Close.locator.click({ force: true })
    } else {
      await alert.Button_Confirm.locator.click({ force: true })
    }
  }

  async DeleteAllRuleGroups() {
    while ((await this.DataTable_Rules.VisibleRowCount()) > 0) {
      await this.RemoveRuleGroupByIndex('0') // delete the first rule we find
    }
  }

  async DetachRuleGroupByIndex(ruleIndex: string) {
    await this.DataTable_Rules.OpenActionMenu(ruleIndex)
    await this.DataTable_Rules.SelectActionMenuItem(
      VendorRules_DataTable_ActionMenuItems.DetachRule
    )
    await this.HandleDetachRuleAlert()
    await this.page.waitForTimeout(2000)
  }
}
