import { expect } from '@playwright/test'
import {
  AbortErrors,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
  GlobalRuleSetsTuples,
  GlobalRules_DataTable_ActionMenuItems,
} from '../../library/clientPortal/clientPortalConstants.js'
import { AbortTest, Launch } from '../../library/clientPortal/clientPortalHelper.js'
import { ClientPortalGlobalRulesPage } from '../../library/clientPortal/pages/clientPortalGlobalRulesPage.js'
import { GlobalRule } from '../../library/clientPortal/rules/clientPortalGlobalRule.js'
import { GlobalRuleSet } from '../../library/clientPortal/rules/clientPortalGlobalRuleSet.js'
import { TextRule } from '../../library/clientPortal/rules/clientPortalTextRule.js'
import { Tags } from '../../library/shared/constants.js'
import test from '../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Global Rules Page',
  {
    tag: [Tags.ClientPortal, Tags.GlobalRules],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the ClientPortal home page
      const { global, homePage } = await Launch(browser, environment)

      // Verify navigation from Home page
      const globalRulesPage = new ClientPortalGlobalRulesPage(global)
      await homePage.Link_GoToRules.Click()
      const table = globalRulesPage.DataTable_Rules

      // Verify page layout
      await globalRulesPage.VerifyTitle()
      await table.table.count()

      // Verify Rules Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Rules Table layout...
      // Verify Rules Table Settings, Filters and Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)
    })

    test('Rules Table - Settings: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to Global Rules
      const { global } = await Launch(browser, environment)
      const globalRulesPage = new ClientPortalGlobalRulesPage(global)
      await globalRulesPage.NavigateToPage()
      const table = globalRulesPage.DataTable_Rules

      // Click the Open Table Settings button on the Rules Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await globalRulesPage.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Rules Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the ClientPortal home page and go to Global Rules
        const { global } = await Launch(browser, environment)
        const globalRulesPage = new ClientPortalGlobalRulesPage(global)
        await globalRulesPage.NavigateToPage()
        const table = globalRulesPage.DataTable_Rules

        // Click the Open Table Settings button on the Rules Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Rules_If)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Rules_If)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Rules_Then)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Rules_Then)).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Rules_If)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Rules_If)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Rules_Then)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Rules_Then)).toBe(true)
      })
      test('Rules Table - Sort Columns', async ({ browser }) => {
        // launch the ClientPortal home page and go to Global Rules
        const { global } = await Launch(browser, environment)
        const globalRulesPage = new ClientPortalGlobalRulesPage(global)
        await globalRulesPage.NavigateToPage()
        const table = globalRulesPage.DataTable_Rules

        // Examine If and Then columns
        // Verify initial states are unsorted
        const initialIfSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Rules_If)
        const initialThenSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Rules_Then
        )
        expect(initialIfSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialThenSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the If column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Rules_If,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify If is sorted Down and Then is still unsorted
        let currentIfSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Rules_If)
        let currentThenSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Rules_Then
        )
        expect(currentIfSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentThenSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Then column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Rules_Then,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify If is now unsorted and Then is sorted Up
        currentIfSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Rules_If)
        currentThenSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Rules_Then)
        expect(currentIfSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentThenSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Then column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.Rules_Then,
          DataTable_Column_SortState.Unsorted
        )
        currentThenSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Rules_Then)
        expect(currentThenSortState).toBe(DataTable_Column_SortState.Unsorted)
      })
    })

    test('Rules Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to Global Rules
      const { global } = await Launch(browser, environment)
      const globalRulesPage = new ClientPortalGlobalRulesPage(global)
      await globalRulesPage.NavigateToPage()
      const table = globalRulesPage.DataTable_Rules

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyGlobalRulesTableMessage)
        return
      }

      // Click the Add Table Filter button on the Rules Table
      let tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Rules_If)

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await globalRulesPage.Wait()

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Rules_If)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Rules Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to Global Rules
      const { global } = await Launch(browser, environment)
      const globalRulesPage = new ClientPortalGlobalRulesPage(global)
      await globalRulesPage.NavigateToPage()
      const table = globalRulesPage.DataTable_Rules

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyGlobalRulesTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const conditionFilter = 'damagedPropertyAreas'
      const { pinnedFilter: conditionPinnedFilter } = await table.SetTableFilter_Text(
        conditionFilter,
        DataTable_Columns_Type.Rules_If
      )
      const conditionFilteredRowCount = await table.VisibleRowCount()
      expect(conditionFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(conditionPinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(conditionPinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(conditionPinnedFilter)).toBe(false)
      const conditionFilteredOffRowCount = await table.VisibleRowCount()
      expect(conditionFilteredOffRowCount == initialRowCount).toBe(true)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const actionFilter = 'isOutOfMitigationOfferDateRange'
      const { tableFilterDialog } = await table.SetTableFilter_Text(
        actionFilter,
        DataTable_Columns_Type.Rules_Then,
        false,
        true
      )

      // Verify table is filtered
      const actionFilteredRowCount = await table.VisibleRowCount()
      expect(actionFilteredRowCount < initialRowCount).toBe(true)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const actionFilterOffRowCount = await table.VisibleRowCount()
      expect(actionFilterOffRowCount == initialRowCount).toBe(true)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Rules Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to Global Rules
      const { global } = await Launch(browser, environment)
      const globalRulesPage = new ClientPortalGlobalRulesPage(global)
      await globalRulesPage.NavigateToPage()
      const table = globalRulesPage.DataTable_Rules

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyGlobalRulesTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const conditionFilter = 'damagedPropertyAreas'
      const { pinnedFilter: conditionPinnedFilter } = await table.SetTableFilter_Text(
        conditionFilter,
        DataTable_Columns_Type.Rules_If
      )
      const conditionFilteredRowCount = await table.VisibleRowCount()
      expect(conditionFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(conditionPinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedConditionFilterTerm = 'There can be no matches'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedConditionFilterTerm,
        DataTable_Columns_Type.Rules_If,
        true
      )

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(editedPinnedFilter)).toBe(true)

      // Verify table is filtered and no rows are visible
      const editedFilteredRowCount = await table.VisibleRowCount()
      expect(editedFilteredRowCount == 0).toBe(true)

      // Verify clicking X button on the edited pinned filter removes it and clears the filter
      await table.CancelPinnedTableFilter(editedPinnedFilter)

      // Verify table is not filtered and all rows are visible
      const clearedRowCount = await table.VisibleRowCount()
      expect(clearedRowCount == initialRowCount).toBe(true)
    })

    test('Rules Table - Expand and Collapse', async ({ browser }) => {
      // launch the ClientPortal home page and go to Global Rules
      const { global } = await Launch(browser, environment)
      const globalRulesPage = new ClientPortalGlobalRulesPage(global)
      await globalRulesPage.NavigateToPage()
      const table = globalRulesPage.DataTable_Rules

      // Verify we are NOT expanded
      await expect(table.Button_CloseTable.locator).not.toBeAttached()
      await expect(table.Button_ExpandTable.locator).toBeAttached()

      // Expand the table
      await table.Button_ExpandTable.Click()

      // Verify we ARE expanded
      await expect(table.Button_CloseTable.locator).toBeAttached()
      await expect(table.Button_ExpandTable.locator).not.toBeAttached()

      // Close the table
      await table.Button_CloseTable.Click()

      // Verify we are NOT expanded
      await expect(table.Button_CloseTable.locator).not.toBeAttached()
      await expect(table.Button_ExpandTable.locator).toBeAttached()
    })

    test('Rules Table - Verify Action Menus', async ({ browser }) => {
      // launch the ClientPortal home page and go to Global Rules
      const { global } = await Launch(browser, environment)
      const globalRulesPage = new ClientPortalGlobalRulesPage(global)
      await globalRulesPage.NavigateToPage()
      const table = globalRulesPage.DataTable_Rules

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyGlobalRulesTableMessage)
        return
      }

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)

      // Verify visibility of all the action menus for the table
      expect(
        await globalRulesPage.IsActionMenuItemVisible(
          rowIndex,
          GlobalRules_DataTable_ActionMenuItems.UpdateGlobalRule
        )
      ).toBe(true)

      expect(
        await globalRulesPage.IsActionMenuItemVisible(
          rowIndex,
          GlobalRules_DataTable_ActionMenuItems.RemoveGlobalRule
        )
      ).toBe(true)
    })

    test('Create Global Rule - Verify Drawer UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to Global Rules
      const { global } = await Launch(browser, environment)
      const globalRulesPage = new ClientPortalGlobalRulesPage(global)
      await globalRulesPage.NavigateToPage()

      let createGlobalRuleDrawer = await globalRulesPage.OpenCreateGlobalRuleDrawer()

      // Verify drawer heading is "Create Gobal Rule"
      createGlobalRuleDrawer.Title.VerifyExpectedText()

      // Verify drawer closes with click on "X" button
      await createGlobalRuleDrawer.Button_Close_X.Click()
      await expect(createGlobalRuleDrawer.Title.locator).not.toBeAttached()
      await globalRulesPage.Wait()

      createGlobalRuleDrawer = await globalRulesPage.OpenCreateGlobalRuleDrawer()

      // Verify drawer closes with ESC key
      await createGlobalRuleDrawer.Close(true)
      await expect(createGlobalRuleDrawer.Title.locator).not.toBeAttached()
      await globalRulesPage.Wait()

      createGlobalRuleDrawer = await globalRulesPage.OpenCreateGlobalRuleDrawer()

      // Verify drawer closes if click on Close
      await createGlobalRuleDrawer.Close()
      await expect(createGlobalRuleDrawer.Title.locator).not.toBeAttached()
      await globalRulesPage.Wait()
    })

    test('Create Global Rule - Validate Drawer', async ({ browser }) => {
      // launch the ClientPortal home page and go to Global Rules
      const { global } = await Launch(browser, environment)
      const globalRulesPage = new ClientPortalGlobalRulesPage(global)
      await globalRulesPage.NavigateToPage()

      const createGlobalRuleDrawer = await globalRulesPage.OpenCreateGlobalRuleDrawer()

      // Click the Submit button
      await createGlobalRuleDrawer.Button_Submit.Click()
      await globalRulesPage.Wait()

      // Verify validation message for required Rule and Attribute fields
      expect(await createGlobalRuleDrawer.Validate()).toBe(true)

      // Close the drawer
      await createGlobalRuleDrawer.Close()
    })

    test('Validate Default Rule Sets', async ({ browser }) => {
      // launch the ClientPortal home page and go to Global Rules
      const { global } = await Launch(browser, environment)
      const globalRulesPage = new ClientPortalGlobalRulesPage(global)
      await globalRulesPage.NavigateToPage()
      const table = globalRulesPage.DataTable_Rules

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyGlobalRulesTableMessage)
        return
      }

      // load up the existing rule sets from the table
      await globalRulesPage.LoadRuleSets()

      // Check the number of rules - there should be at least the expected number or more
      const currentRuleSetsLength = globalRulesPage.RuleSets.length
      const defaultRuleSetsLength = GlobalRuleSetsTuples.Default.length
      expect(currentRuleSetsLength).toBeGreaterThanOrEqual(defaultRuleSetsLength)

      // Look through the expected rules and make sure there is a match for each in the currenty visible rules
      let allMatchesFound = true
      for (let defaultIndex = 0; defaultIndex <= defaultRuleSetsLength - 1; defaultIndex++) {
        const defaultGlobalRuleSetToMatch: GlobalRuleSet = GlobalRuleSetsTuples.Default[
          defaultIndex
        ] as GlobalRuleSet
        const foundMatchIndex = await globalRulesPage.FindMatchingGlobalRuleSet(
          defaultGlobalRuleSetToMatch
        )
        if (foundMatchIndex == null) {
          console.log(`No match found for default global rule set at index: ${defaultIndex}`)
        }
        allMatchesFound &&= foundMatchIndex != null
      }
      expect(allMatchesFound).toBe(true)
    })

    test('Validate Add, Edit, Delete operations', async ({ browser }) => {
      // launch the ClientPortal home page and go to Global Rules
      const { global } = await Launch(browser, environment)
      const globalRulesPage = new ClientPortalGlobalRulesPage(global)
      await globalRulesPage.NavigateToPage()

      // clean up if any old rules were left behind last time this ran
      await globalRulesPage.DeleteAllOldTimeStampedGlobalRules()

      const initialTestTimeStamp = Date.now()
      const initialRuleSet = JSON.parse(
        JSON.stringify(GlobalRuleSetsTuples.TimeStamp[0])
      ) as GlobalRuleSet
      const initialTimeStampedRule: GlobalRule = initialRuleSet.items[0].item as GlobalRule
      const initialRule = initialTimeStampedRule.description as TextRule
      initialRule.value = initialTestTimeStamp.toString()

      await globalRulesPage.Wait(3000) // allow some time for a new time stamp

      const editedTestTimeStamp = Date.now()
      const editedRuleSet = JSON.parse(
        JSON.stringify(GlobalRuleSetsTuples.TimeStamp[0])
      ) as GlobalRuleSet
      const editedTimeStampedRule: GlobalRule = editedRuleSet.items[0].item as GlobalRule
      const editedRule = editedTimeStampedRule.description as TextRule
      editedRule.value = editedTestTimeStamp.toString()

      await globalRulesPage.CreateGlobalRuleSet(initialRuleSet)
      // Find the rule we just created and verify it matches
      const foundInitialMatchIndex = await globalRulesPage.FindMatchingGlobalRuleSet(
        initialRuleSet,
        true
      )
      expect(foundInitialMatchIndex).not.toBe(null)

      // modify the rule we just added
      const initialRowIndex = foundInitialMatchIndex ? foundInitialMatchIndex.toString() : '0'
      await globalRulesPage.EditGlobalRuleSetByIndex(initialRowIndex, editedRuleSet)
      // Find the rule we just modified and verify it matches
      const foundEditedMatchIndex = await globalRulesPage.FindMatchingGlobalRuleSet(
        editedRuleSet,
        true
      )
      expect(foundEditedMatchIndex).not.toBe(null)

      // delete the edited rule to clean up
      const editedRowIndex = foundEditedMatchIndex ? foundEditedMatchIndex.toString() : '0'
      await globalRulesPage.DeleteGlobalRuleSetByIndex(editedRowIndex)
    })

    test('Validate Rule Types And Operators', async ({ browser }) => {
      // launch the ClientPortal home page and go to Global Rules
      const { global } = await Launch(browser, environment)
      const globalRulesPage = new ClientPortalGlobalRulesPage(global)
      await globalRulesPage.NavigateToPage()

      // clean up if any old rules were left behind last time this ran
      await globalRulesPage.DeleteAllOldTimeStampedGlobalRules()

      const testTimeStamp = Date.now()
      const allVariationsRuleSet = JSON.parse(
        JSON.stringify(GlobalRuleSetsTuples.Variations[0])
      ) as GlobalRuleSet
      const allVariationsTimeStampedRule: GlobalRule = allVariationsRuleSet.items[0]
        .item as GlobalRule
      const testRule = allVariationsTimeStampedRule.description as TextRule
      testRule.value = testTimeStamp.toString()

      await globalRulesPage.CreateGlobalRuleSet(allVariationsRuleSet)

      // Find the rule we just created and verify it matches
      const foundAllVariationsMatchIndex = await globalRulesPage.FindMatchingGlobalRuleSet(
        allVariationsRuleSet,
        true
      )
      expect(foundAllVariationsMatchIndex).not.toBe(null)

      // delete the created rule to clean up
      const editedRowIndex = foundAllVariationsMatchIndex
        ? foundAllVariationsMatchIndex.toString()
        : '0'
      await globalRulesPage.DeleteGlobalRuleSetByIndex(editedRowIndex)
    })

    test('Validate Simple To Complex', async ({ browser }) => {
      // launch the ClientPortal home page and go to Global Rules
      const { global } = await Launch(browser, environment)
      const globalRulesPage = new ClientPortalGlobalRulesPage(global)
      await globalRulesPage.NavigateToPage()

      // clean up if any old rules were left behind last time this ran
      await globalRulesPage.DeleteAllOldTimeStampedGlobalRules()

      const testTimeStamp = Date.now()
      const simpleToComplexRuleSet = JSON.parse(
        JSON.stringify(GlobalRuleSetsTuples.SimpleToComplex[0])
      ) as GlobalRuleSet
      const simpleToComplexTimeStampedRule: GlobalRule = simpleToComplexRuleSet.items[0]
        .item as GlobalRule
      const testRule = simpleToComplexTimeStampedRule.description as TextRule
      testRule.value = testTimeStamp.toString()

      await globalRulesPage.CreateGlobalRuleSet(simpleToComplexRuleSet)

      // Find the rule we just created and verify it matches
      const foundSimpleToComplexMatchIndex = await globalRulesPage.FindMatchingGlobalRuleSet(
        simpleToComplexRuleSet,
        true
      )
      expect(foundSimpleToComplexMatchIndex).not.toBe(null)

      // delete the created rule to clean up
      const editedRowIndex = foundSimpleToComplexMatchIndex
        ? foundSimpleToComplexMatchIndex.toString()
        : '0'
      await globalRulesPage.DeleteGlobalRuleSetByIndex(editedRowIndex)
    })
  }
)
