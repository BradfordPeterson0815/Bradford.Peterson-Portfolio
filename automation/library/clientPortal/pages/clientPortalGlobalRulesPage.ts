import { Locator } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { ClientPortalDeleteAlert } from '../alerts/clientPortalDeleteAlert.js'
import {
  AlertStrings,
  GlobalRulesPageStrings,
  GlobalRules_DataTable_ActionMenuItems,
} from '../clientPortalConstants.js'
import { ClientPortalDataTable } from '../clientPortalDataTable.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { CatgorizeAndSetRuleDescription, IsOldEnoughToDelete } from '../clientPortalHelper.js'
import { ClientPortalCreateGlobalRuleDrawer } from '../drawers/clientPortalCreateGlobalRuleDrawer.js'
import { BaseRule } from '../rules/clientPortalBaseRule.js'
import { GlobalRule } from '../rules/clientPortalGlobalRule.js'
import { GlobalRuleGroup } from '../rules/clientPortalGlobalRuleGroup.js'
import { GlobalRuleItem } from '../rules/clientPortalGlobalRuleItem.js'
import { GlobalRuleSet } from '../rules/clientPortalGlobalRuleSet.js'
import { TextRule } from '../rules/clientPortalTextRule.js'
import { ClientPortalBasePage } from './clientPortalBasePage.js'

export class ClientPortalGlobalRulesPage extends ClientPortalBasePage {
  readonly Title: Element
  readonly DataTable_Rules: ClientPortalDataTable
  readonly Button_CreateGlobalRule: Element
  RuleSets: GlobalRuleSet[]

  constructor(global: ClientPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${GlobalRulesPageStrings.Title}` }),
      GlobalRulesPageStrings.Title
    )
    this.URL = `${global.baseUrl}rules`
    this.Button_CreateGlobalRule = new Element(
      this.global.page,
      this.page.locator('#button_createglobalrule'),
      GlobalRulesPageStrings.Button_CreateGlobalRule
    )
    this.DataTable_Rules = new ClientPortalDataTable(
      global,
      '#admin_tabpanel_globalruleinfo_body',
      1,
      GlobalRulesPageStrings.ActionMenu,
      GlobalRulesPageStrings.ActionMenuAria
    )
    this.RuleSets = []
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.page.goto(this.URL)
    } else {
      await this.leftNavBar.GoHome()
      await this.leftNavBar.Button_Rules.Click()
      await this.page.waitForLoadState()
    }
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async OpenCreateGlobalRuleDrawer(isEditMode = false) {
    await this.Button_CreateGlobalRule.Click()
    const createGlobalRuleDrawer = new ClientPortalCreateGlobalRuleDrawer(this.global, isEditMode)
    return createGlobalRuleDrawer
  }

  async LoadRuleSets() {
    const ruleSetsCount = await this.DataTable_Rules.VisibleRowCount()
    if (ruleSetsCount > 0) {
      this.RuleSets = []
      for (let index = 0; index < ruleSetsCount; index++) {
        const ruleSet = await this.GetRuleSetByIndex(index)
        this.RuleSets.push(ruleSet)
      }
    }
  }

  async IsActionMenuItemVisible(
    rowIndex: string,
    actionMenuItem: GlobalRules_DataTable_ActionMenuItems
  ) {
    await this.DataTable_Rules.OpenActionMenu(rowIndex)
    await this.page.waitForTimeout(1000)
    const visibility = await this.DataTable_Rules.IsActionMenuItemVisible(actionMenuItem)
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async GetRuleSetByIndex(rowIndex: number) {
    const parentDataLevel = 0
    const parentDataPath = ''
    const checkForNot = await this.page
      .locator(`#globalrules__DataGrid_Row_${rowIndex}_conditions > span > div > span`)
      .count()
    const rootRuleSet = new GlobalRuleSet({
      inverted: checkForNot > 0,
    })
    const listSelector = this.page.locator(
      `#globalrules__DataGrid_Row_${rowIndex}_conditions > span > div > ul`
    )
    const listItemSelector = listSelector.locator('> li')
    const rootCombinator = await listSelector.getAttribute('data-combinator')
    if (rootCombinator == null) {
      throw new Error(`Unable to get root combinator for the global rule set at index: ${rowIndex}`)
    }
    const listItems = await listItemSelector.all()

    if (listItems.length > 0) {
      for (let listItemIndex = 0; listItemIndex < listItems.length; listItemIndex++) {
        const subListItemSelector = listSelector.locator(`> li:nth-of-type(${listItemIndex + 1})`)
        const checkForSubList = await subListItemSelector.locator('> div > ul').count()
        const checkForSubListItemNot = await subListItemSelector.locator('> div > span').count()
        const itemType = checkForSubList > 0 ? 'RuleGroup' : 'Rule'
        const dataPath = this.GenerateDataPath(parentDataPath, listItemIndex)
        let ruleItemOrGroup = null
        if (itemType == 'Rule') {
          ruleItemOrGroup = await this.ParseGlobalRule(subListItemSelector)
        } else {
          const groupInvertedState = checkForSubListItemNot > 0
          ruleItemOrGroup = await this.ParseGlobalRuleGroup(
            parentDataLevel + 1,
            dataPath,
            subListItemSelector,
            groupInvertedState
          )
        }
        const globalRuleItem = new GlobalRuleItem(
          itemType,
          ruleItemOrGroup,
          parentDataLevel + 1,
          dataPath
        )
        rootRuleSet.items.push(globalRuleItem)
      }
    }

    rootRuleSet.combinator = rootCombinator
    const attributeSelector = this.page.locator(
      `#globalrules__DataGrid_Row_${rowIndex}_action code`
    )
    const name = await attributeSelector.nth(0).textContent()
    if (name == null) {
      throw new Error(`Unable to get attribute name for the global rule set at index: ${rowIndex}`)
    }
    rootRuleSet.attributeName = name
    const value = await attributeSelector.nth(1).textContent()
    rootRuleSet.attributeDescription = value == 'true'
    return rootRuleSet
  }

  GenerateDataPath(parentDataPath: string, itemIndex: number) {
    // if parent datapath = "" and itemIndex = 0 -> "0"
    // if parent datapath = "" and itemIndex = 1-> "1"
    // if parent datapath = "0" and itemIndex = 0, -> "0,0"
    // if parent datapath = "0" and itemIndex = 1, -> "0,1"
    const result = parentDataPath == '' ? `${itemIndex}` : `${parentDataPath},${itemIndex}`
    return result
  }

  async ParseGlobalRule(subListItemSelector: Locator) {
    const rule = new GlobalRule()
    const ruleSelector = subListItemSelector.locator('> span:last-of-type')
    const fieldName = await ruleSelector.locator('> code').nth(0).textContent()
    const source = await ruleSelector.locator('> code').nth(1).textContent()
    const conditions = await ruleSelector.locator('> code').nth(2).textContent()
    const ruleDescriptionText = await ruleSelector.textContent()
    if (ruleDescriptionText == null || fieldName == null || source == null || conditions == null)
      throw new Error('invalid rule description')
    const operator = ruleDescriptionText.slice(
      13 + fieldName.length + source.length,
      -(1 + conditions.length)
    )
    rule.description = CatgorizeAndSetRuleDescription(fieldName, source, operator, conditions)
    return rule
  }

  async ParseGlobalRuleGroup(
    parentDataLevel: number,
    parentDataPath: string,
    ruleGroupSelector: Locator,
    inverted: boolean
  ) {
    const subListSelector = ruleGroupSelector.locator(' > div > ul')
    const ruleGroupCombinator = await subListSelector.getAttribute('data-combinator')
    const ruleGroup = new GlobalRuleGroup({ inverted })
    ruleGroup.combinator = ruleGroupCombinator ? ruleGroupCombinator : ''
    const subListItemsSelector = subListSelector.locator('> li')
    const subListItems = await subListItemsSelector.all()
    if (subListItems.length > 0) {
      for (let subListItemIndex = 0; subListItemIndex < subListItems.length; subListItemIndex++) {
        const subSubListItemSelector = ruleGroupSelector.locator(
          `> div > ul > li:nth-of-type(${subListItemIndex + 1})`
        )
        const checkForSubSubList = await subSubListItemSelector.locator('> div > ul').count()
        const checkForSubSubListItemNot = await subSubListItemSelector
          .locator('> div > span')
          .count()
        const subItemType = checkForSubSubList > 0 ? 'RuleGroup' : 'Rule'
        const dataPath = this.GenerateDataPath(parentDataPath, subListItemIndex)
        let ruleSubItemOrSubGroup = null
        if (subItemType == 'Rule') {
          ruleSubItemOrSubGroup = await this.ParseGlobalRule(subSubListItemSelector)
        } else {
          const groupInvertedState = checkForSubSubListItemNot > 0
          ruleSubItemOrSubGroup = await this.ParseGlobalRuleGroup(
            parentDataLevel + 1,
            dataPath,
            subSubListItemSelector,
            groupInvertedState
          )
        }
        const globalRuleSubItem = new GlobalRuleItem(
          subItemType,
          ruleSubItemOrSubGroup,
          parentDataLevel + 1,
          dataPath
        )
        ruleGroup.items.push(globalRuleSubItem)
      }
    }
    return ruleGroup
  }

  async FindMatchingGlobalRuleSet(globalRuleSetToVerify: GlobalRuleSet, forceReload = false) {
    // load rule sets if they are empty or if we are forcing them to load
    if (this.RuleSets.length == 0 || forceReload) {
      await this.LoadRuleSets()
    }
    const stringifiedTargetGlobalRuleSet = JSON.stringify(globalRuleSetToVerify)
    const currentRuleSetsLength = this.RuleSets.length
    if (currentRuleSetsLength > 0) {
      for (let index = currentRuleSetsLength - 1; index >= 0; index--) {
        const stringifiedGlobalRuleSet = JSON.stringify(this.RuleSets[index])
        console.log(
          `FromTable (${stringifiedGlobalRuleSet.length})    : ${stringifiedGlobalRuleSet}`
        )
        console.log(
          `FromTarget (${stringifiedTargetGlobalRuleSet.length})  : ${stringifiedTargetGlobalRuleSet}`
        )
        if (stringifiedGlobalRuleSet === stringifiedTargetGlobalRuleSet) {
          console.log(`Found a target match at table rule index (${index})`)
          return index
        }
      }
    }
    return null
  }

  async CreateGlobalRuleSet(globalRuleSetToFill: GlobalRuleSet) {
    const createGlobalRuleDrawer = await this.OpenCreateGlobalRuleDrawer()
    await createGlobalRuleDrawer.FillDrawer(globalRuleSetToFill)
    await this.page.waitForTimeout(1000)
  }

  async EditGlobalRuleSetByIndex(
    globalRuleIndex: string,
    updatedGlobalRuleSetToFill: GlobalRuleSet
  ) {
    await this.DataTable_Rules.OpenActionMenu(globalRuleIndex)
    await this.DataTable_Rules.SelectActionMenuItem(
      GlobalRules_DataTable_ActionMenuItems.UpdateGlobalRule
    )
    const createGlobalRuleDrawer = new ClientPortalCreateGlobalRuleDrawer(this.global, true)
    await createGlobalRuleDrawer.ReplaceFilledDrawer(updatedGlobalRuleSetToFill)
    await this.page.waitForTimeout(2000)
  }

  async DeleteGlobalRuleSetByIndex(globalRuleIndex: string) {
    await this.DataTable_Rules.OpenActionMenu(globalRuleIndex)
    await this.DataTable_Rules.SelectActionMenuItem(
      GlobalRules_DataTable_ActionMenuItems.RemoveGlobalRule
    )
    await this.HandleDeleteGlobalRuleAlert()
    await this.page.waitForTimeout(2000)
  }

  async HandleDeleteGlobalRuleAlert(cancelDelete = false) {
    const alert = new ClientPortalDeleteAlert(
      this.global,
      AlertStrings.DeleteGlobalRule_Title,
      AlertStrings.DeleteGlobalRule_Description
    )
    if (cancelDelete) {
      await alert.Button_Close.locator.click({ force: true })
    } else {
      await alert.Button_Confirm.locator.click({ force: true })
    }
  }

  async DeleteAllOldTimeStampedGlobalRules(olderInMinutes = 10) {
    let tableIsNotClear = false
    do {
      tableIsNotClear = false
      await this.LoadRuleSets()
      for (let index = 0; index < this.RuleSets.length; index++) {
        const ruleSetToCheck: GlobalRuleSet = this.RuleSets[index]
        try {
          const ruleItem = ruleSetToCheck.items[0].item as GlobalRule
          const rule = ruleItem.description as BaseRule
          if (rule.type == 'Text') {
            const textRule = ruleItem.description as TextRule
            const ruleCurrentTimeStamp = parseInt(textRule.value)
            const shouldDelete = IsOldEnoughToDelete(ruleCurrentTimeStamp, olderInMinutes)
            if (shouldDelete) {
              await this.DeleteGlobalRuleSetByIndex(index.toString())
              await this.Wait(3000)
              tableIsNotClear = true
              break
            }
          }
        } catch (err) {
          console.error('error')
          throw err
        }
      }
    } while (tableIsNotClear)
  }
}
