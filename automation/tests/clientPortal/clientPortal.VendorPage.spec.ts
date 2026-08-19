import { expect } from '@playwright/test'
import {
  AbortErrors,
  AttachedServiceAreas_DataTable_ActionMenuItems,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
  StateTuples,
  TestServiceAreas,
  TestVendors,
  VendorPageStrings,
  VendorRuleSetsTuples,
  VendorRules_DataTable_ActionMenuItems,
} from '../../library/clientPortal/clientPortalConstants.js'
import { AbortTest, FetchValueByKey, Launch, deepCopy } from '../../library/clientPortal/clientPortalHelper.js'
import { ClientPortalLocation } from '../../library/clientPortal/clientPortalLocation.js'
import { ServiceArea } from '../../library/clientPortal/clientPortalServiceArea.js'
import { Vendor } from '../../library/clientPortal/clientPortalVendor.js'
import { ClientPortalServiceAreaPage } from '../../library/clientPortal/pages/clientPortalServiceAreaPage.js'
import { ClientPortalServiceAreasPage } from '../../library/clientPortal/pages/clientPortalServiceAreasPage.js'
import { ClientPortalVendorPage } from '../../library/clientPortal/pages/clientPortalVendorPage.js'
import { ClientPortalVendorsPage } from '../../library/clientPortal/pages/clientPortalVendorsPage.js'
import { TextRule } from '../../library/clientPortal/rules/clientPortalTextRule.js'
import { Tags } from '../../library/shared/constants.js'
import test from '../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Vendor Page',
  {
    tag: [Tags.ClientPortal, Tags.Vendor],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the ClientPortal home page
      const { global, homePage } = await Launch(browser, environment)

      // Verify navigation from Vendors page
      const vendorsPage = new ClientPortalVendorsPage(global)
      await homePage.Link_GoToVendors.Click()
      const table = vendorsPage.DataTable_Vendors

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorsTableMessage)
        return
      }

      const vendorA: Vendor = TestVendors.TestVendorA
      // filter for the vendor
      const nameFilter = vendorA.name
      await table.SetTableFilter_Text(nameFilter, DataTable_Columns_Type.Vendors_Name)
      const vendorPage = await vendorsPage.ClickLinkToVendor(vendorA)
      const vendorId = FetchValueByKey(vendorA.additionalProperties, 'VendorID')
      if (vendorId == null) {
        throw new Error(`No vendor ID available for vendor: ${vendorA.name}`)
      }
      expect(vendorPage.page.url().endsWith(vendorId.toString())).toBe(true)

      // Verify page layout
      await vendorPage.VerifyTitle()
      await vendorPage.ValidateEnabledBadge()
      await vendorPage.ValidateDetails()
      const claimAssignmentTable = vendorPage.ClaimAssignmentRules.DataTable_Rules
      const mitigationAssignmentTable = vendorPage.MitigationAssignmentRules.DataTable_Rules

      // Verify both Assignment Rule Tables exists
      expect(await claimAssignmentTable.IsVisible()).toBe(true)
      expect(await mitigationAssignmentTable.IsVisible()).toBe(true)

      // Verify Claim Assignment Table layout...
      // Verify Claim Assignment Filters and Expand button
      expect(await claimAssignmentTable.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await claimAssignmentTable.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await claimAssignmentTable.Button_CloseTable.IsVisible()).toBe(false)

      // Verify Mitigation Assignment Table layout...
      // Verify Mitigation Assignment Filters and Expand button
      expect(await mitigationAssignmentTable.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await mitigationAssignmentTable.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await mitigationAssignmentTable.Button_CloseTable.IsVisible()).toBe(false)

      // Verify Attached Service Area section
      // Map button and Attach to Service Area button upper right always
      await vendorPage.Button_ToggleMap.VerifyExpectedText()
      await vendorPage.Button_AttachToServiceArea.VerifyExpectedText()
      if (await vendorPage.IsAttachedServiceAreasEmpty()) {
        // Getting Started Section Title and Description and button
        await vendorPage.Label_GettingStartedHeader.VerifyExpectedText()
        await vendorPage.Label_GettingStartedDescriptionA.VerifyExpectedText()
        await vendorPage.Label_GettingStartedDescriptionB.VerifyExpectedText()
        expect(vendorPage.Button_GettingStarted_AttachVendorToServiceArea.IsVisible()).toBe(true)
      } else {
        const attachedServiceAreasTable = vendorPage.DataTable_AttachedServiceAreas
        // Verify Attached Service Areas Table layout...
        // Verify Attached Service Areas Table Settings, Filters and Expand button
        expect(await attachedServiceAreasTable.Button_OpenTableSettings.IsVisible()).toBe(true)
        expect(await attachedServiceAreasTable.Button_AddTableFilter.IsVisible()).toBe(true)
        expect(await attachedServiceAreasTable.Button_ExpandTable.IsVisible()).toBe(true)
        expect(await attachedServiceAreasTable.Button_CloseTable.IsVisible()).toBe(false)
        expect(await attachedServiceAreasTable.Button_OpenTableSearch.IsVisible()).toBe(true)
      }
    })

    test('Claim Assignment Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.ClaimAssignmentRules.DataTable_Rules

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimAssignmentRulesTableMessage)
        return
      }

      // Click the Add Table Filter button on the Claim Assignment Rules table
      let tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Rules_RuleSummary)

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await vendorPage.Wait()

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Rules_RuleSummary)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Claim Assignment Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.ClaimAssignmentRules.DataTable_Rules

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimAssignmentRulesTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      let ruleSummaryFilter = 'Amazing'
      const { pinnedFilter: ruleSummaryPinnedFilter } = await table.SetTableFilter_Text(
        ruleSummaryFilter,
        DataTable_Columns_Type.Rules_RuleSummary
      )
      let ruleSummaryFilteredRowCount = await table.VisibleRowCount()
      expect(ruleSummaryFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(ruleSummaryPinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(ruleSummaryPinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(ruleSummaryPinnedFilter)).toBe(false)
      let ruleSummaryOffRowCount = await table.VisibleRowCount()
      expect(ruleSummaryOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      ruleSummaryFilter = 'NoMatchExpected'
      const { tableFilterDialog } = await table.SetTableFilter_Text(
        ruleSummaryFilter,
        DataTable_Columns_Type.Rules_RuleSummary,
        false,
        true
      )

      // Verify table is filtered
      ruleSummaryFilteredRowCount = await table.VisibleRowCount()
      expect(ruleSummaryFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      ruleSummaryOffRowCount = await table.VisibleRowCount()
      expect(ruleSummaryOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Claim Assignment Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.ClaimAssignmentRules.DataTable_Rules

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimAssignmentRulesTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const ruleSummaryFilter = 'Amazing'
      const { pinnedFilter: ruleSummaryPinnedFilter } = await table.SetTableFilter_Text(
        ruleSummaryFilter,
        DataTable_Columns_Type.Rules_RuleSummary
      )
      const ruleSummaryFilteredRowCount = await table.VisibleRowCount()
      expect(ruleSummaryFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(ruleSummaryPinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedRuleSummaryFilter = 'NoMatchOnEdit'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedRuleSummaryFilter,
        DataTable_Columns_Type.Rules_RuleSummary,
        true
      )

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(editedPinnedFilter)).toBe(true)

      // Verify table is filtered and no rows are visible
      const editedFilteredRowCount = await table.VisibleRowCount()
      expect(editedFilteredRowCount).toBe(0)

      // Verify clicking X button on the edited pinned filter removes it and clears the filter
      await table.CancelPinnedTableFilter(editedPinnedFilter)

      // Verify table is not filtered and all rows are visible
      const clearedRowCount = await table.VisibleRowCount()
      expect(clearedRowCount).toBe(initialRowCount)
    })

    test('Claim Assignment Table - Expand and Collapse', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.ClaimAssignmentRules.DataTable_Rules

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

    test('Claim Assignment Table - Sort Columns', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.ClaimAssignmentRules.DataTable_Rules

      // Examine the Rule summary column
      // Verify initial state is unsorted
      const initialSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary
      )
      expect(initialSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the Rule Summary column Sort icon to Down (high to low)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary,
        DataTable_Column_SortState.Down_HighToLow
      )

      // Verify the Rule Summary column is sorted Down
      let currentSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary
      )
      expect(currentSortState).toBe(DataTable_Column_SortState.Down_HighToLow)

      // Set the Rule Summary column Sort icon to Up (low to high)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary,
        DataTable_Column_SortState.Up_LowToHigh
      )

      // Set the Rule Summary column Sort icon to Unsorted
      await table.SetColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary,
        DataTable_Column_SortState.Unsorted
      )
      currentSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Rules_RuleSummary)
      expect(currentSortState).toBe(DataTable_Column_SortState.Unsorted)
    })

    test('Claim Assignment Table - Verify Action Menus', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.ClaimAssignmentRules.DataTable_Rules

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimAssignmentRulesTableMessage)
        return
      }

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)

      // Verify visibility of all the action menus for the table
      expect(
        await vendorPage.ClaimAssignmentRules.IsActionMenuItemVisible(
          rowIndex,
          VendorRules_DataTable_ActionMenuItems.CopyRuleID
        )
      ).toBe(true)

      expect(
        await vendorPage.ClaimAssignmentRules.IsActionMenuItemVisible(
          rowIndex,
          VendorRules_DataTable_ActionMenuItems.AttachRuleToVendorsServiceAreas
        )
      ).toBe(true)

      expect(
        await vendorPage.ClaimAssignmentRules.IsActionMenuItemVisible(
          rowIndex,
          VendorRules_DataTable_ActionMenuItems.UpdateRule
        )
      ).toBe(true)

      expect(
        await vendorPage.ClaimAssignmentRules.IsActionMenuItemVisible(
          rowIndex,
          VendorRules_DataTable_ActionMenuItems.RemoveRule
        )
      ).toBe(true)
    })

    test('Claim Assignment Table - Verify Action Menu: Copy Rule ID', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.ClaimAssignmentRules.DataTable_Rules

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimAssignmentRulesTableMessage)
        return
      }

      // Verify setting the filter causes the table results to filter on the selected column only
      const parentRule = vendor.ruleGroups[0].rules[0]
      const rule: TextRule = parentRule.description as TextRule
      const ruleSummaryFilter = rule.value
      await table.SetTableFilter_Text(
        ruleSummaryFilter.toString(),
        DataTable_Columns_Type.Rules_RuleSummary
      )
      const ruleSummaryFilteredRowCount = await table.VisibleRowCount()
      expect(ruleSummaryFilteredRowCount).toBe(1)

      await vendorPage.CopyRuleId(table, 1)
      const copiedID = await vendorPage.GetClipboardText()
      // Verify clipboard contains the rule ID we expect
      expect(copiedID).toBe('xz55Ne67TXbyppFOq8G9l')
    })

    test('Claim Assignment Table - Verify Action Menu: Attach Rule To Vendors Service Area', async ({
      browser,
    }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.ClaimAssignmentRules.DataTable_Rules
      const serviceAreaPrefix = 'AA_TESTSERVICEAREA'
      const dateSuffix = `+${Date.now()}`

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimAssignmentRulesTableMessage)
        return
      }

      // Setup for a new service area
      const newServiceAreaName = `${serviceAreaPrefix}${dateSuffix}`
      const newServiceArea = TestServiceAreas.TestServiceArea_Template_New as ServiceArea
      newServiceArea.name = newServiceAreaName
      newServiceArea.stateToAdd.push(StateTuples.WA_Washington as ClientPortalLocation)

      // Attach vendor to a new service area
      await vendorPage.Action_AttachVendorToNewServiceArea(newServiceArea)

      // Verify setting the filter causes the table results to filter on the selected column only
      const parentRule = vendor.ruleGroups[0].rules[0]
      const rule: TextRule = parentRule.description as TextRule
      const ruleSummaryFilter = rule.value
      await table.SetTableFilter_Text(
        ruleSummaryFilter.toString(),
        DataTable_Columns_Type.Rules_RuleSummary
      )
      const ruleSummaryFilteredRowCount = await table.VisibleRowCount()
      expect(ruleSummaryFilteredRowCount).toBe(1)

      // Apply the rule to the new service area
      await vendorPage.ApplyRuleToServiceArea(newServiceArea, table, 1)

      // Verify the rule is applied
      const serviceAreaAndVendorPage =
        await vendorPage.ClickLinkToServiceAreaAndVendor(newServiceArea)

      // just check if there is a rule in the Claim Assignments table, since it is a new Service Area
      const ruleCount =
        await serviceAreaAndVendorPage.ClaimAssignmentRules.DataTable_Rules.VisibleRowCount()
      expect(ruleCount).toBe(1)

      // Remove the service area
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, newServiceArea)
      await serviceAreaAndVendorPage.Link_GotoServiceArea.Click()
      await serviceAreaPage.Action_RemoveServiceArea()

      // Verify we are now on the ServiceAreas page
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.Title.VerifyExpectedText()
    })

    test('Claim Assignment Table - Verify Create Rule + Verify Action Menu: Update/Remove Rule', async ({
      browser,
    }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const dateSuffix = `+${Date.now()}`
      const vendorPrefix = 'AA_TESTVENDOR'

      // Clear any old vendors from failed tests
      await vendorsPage.FindAndDeleteOldTimestampedVendors(vendorPrefix)

      // Setup and create new vendor
      const vendorName = `${vendorPrefix}${dateSuffix}`
      const vendor = TestVendors.TestVendor_Template_New
      vendor.name = vendorName
      await vendorsPage.AddVendor(vendor)

      const vendorPage = await vendorsPage.ClickLinkToVendor(vendor)
      const table = vendorPage.ClaimAssignmentRules

      // Create a new Rule Set for the vendor
      const assignmentRuleGroup = VendorRuleSetsTuples.General_ClaimAssignmentRuleSet.ruleGroups[1]
      await table.CreateRule(assignmentRuleGroup)
      const foundMatchIndex = await table.FindMatchingRuleGroup(assignmentRuleGroup)
      expect(foundMatchIndex).not.toBe(null)

      // update the rule
      const updatedRuleGroup = deepCopy(assignmentRuleGroup)
      updatedRuleGroup.rules[0].description.operator = 'lengthequalto'
      await table.UpdateRuleGroupByIndex('0', updatedRuleGroup)
      const foundUpdatedMatchIndex = await table.FindMatchingRuleGroup(updatedRuleGroup, true)
      expect(foundUpdatedMatchIndex).not.toBe(null)

      // remove the rule
      await table.RemoveRuleGroupByIndex('0')

      // remove vendor
      await vendorPage.Action_RemoveVendor()

      // make sure we are back on the Vendors page
      await vendorsPage.VerifyTitle()
    })

    test('Mitigation Assignment Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.MitigationAssignmentRules.DataTable_Rules

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyMitigationAssignmentRulesTableMessage)
        return
      }

      // Click the Add Table Filter button on the Claim Assignment Rules table
      let tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Rules_RuleSummary)

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await vendorPage.Wait()

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Rules_RuleSummary)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Mitigation Assignment Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.MitigationAssignmentRules.DataTable_Rules

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyMitigationAssignmentRulesTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      let ruleSummaryFilter = 'FIRE'
      const { pinnedFilter: ruleSummaryPinnedFilter } = await table.SetTableFilter_Text(
        ruleSummaryFilter,
        DataTable_Columns_Type.Rules_RuleSummary
      )
      let ruleSummaryFilteredRowCount = await table.VisibleRowCount()
      expect(ruleSummaryFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(ruleSummaryPinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(ruleSummaryPinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(ruleSummaryPinnedFilter)).toBe(false)
      let ruleSummaryOffRowCount = await table.VisibleRowCount()
      expect(ruleSummaryOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      ruleSummaryFilter = 'WATER'
      const { tableFilterDialog } = await table.SetTableFilter_Text(
        ruleSummaryFilter,
        DataTable_Columns_Type.Rules_RuleSummary,
        false,
        true
      )

      // Verify table is filtered
      ruleSummaryFilteredRowCount = await table.VisibleRowCount()
      expect(ruleSummaryFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      ruleSummaryOffRowCount = await table.VisibleRowCount()
      expect(ruleSummaryOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Mitigation Assignment Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.MitigationAssignmentRules.DataTable_Rules

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyMitigationAssignmentRulesTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const ruleSummaryFilter = 'FIRE'
      const { pinnedFilter: ruleSummaryPinnedFilter } = await table.SetTableFilter_Text(
        ruleSummaryFilter,
        DataTable_Columns_Type.Rules_RuleSummary
      )
      const ruleSummaryFilteredRowCount = await table.VisibleRowCount()
      expect(ruleSummaryFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(ruleSummaryPinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedRuleSummaryFilter = 'HURRICANE'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedRuleSummaryFilter,
        DataTable_Columns_Type.Rules_RuleSummary,
        true
      )

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(editedPinnedFilter)).toBe(true)

      // Verify table is filtered and no rows are visible
      const editedFilteredRowCount = await table.VisibleRowCount()
      expect(editedFilteredRowCount).toBe(0)

      // Verify clicking X button on the edited pinned filter removes it and clears the filter
      await table.CancelPinnedTableFilter(editedPinnedFilter)

      // Verify table is not filtered and all rows are visible
      const clearedRowCount = await table.VisibleRowCount()
      expect(clearedRowCount).toBe(initialRowCount)
    })

    test('Mitigation Assignment Table - Expand and Collapse', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.MitigationAssignmentRules.DataTable_Rules

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

    test('Mitigation Assignment Table - Sort Columns', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.MitigationAssignmentRules.DataTable_Rules

      // Examine the Rule summary column
      // Verify initial state is unsorted
      const initialSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary
      )
      expect(initialSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the Rule Summary column Sort icon to Down (high to low)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary,
        DataTable_Column_SortState.Down_HighToLow
      )

      // Verify the Rule Summary column is sorted Down
      let currentSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary
      )
      expect(currentSortState).toBe(DataTable_Column_SortState.Down_HighToLow)

      // Set the Rule Summary column Sort icon to Up (low to high)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary,
        DataTable_Column_SortState.Up_LowToHigh
      )

      // Set the Rule Summary column Sort icon to Unsorted
      await table.SetColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary,
        DataTable_Column_SortState.Unsorted
      )
      currentSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Rules_RuleSummary)
      expect(currentSortState).toBe(DataTable_Column_SortState.Unsorted)
    })

    test('Mitigation Assignment Table - Verify Action Menus', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If the are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.MitigationAssignmentRules.DataTable_Rules

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyMitigationAssignmentRulesTableMessage)
        return
      }

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)

      // Verify visibility of all the action menus for the table
      expect(
        await vendorPage.MitigationAssignmentRules.IsActionMenuItemVisible(
          rowIndex,
          VendorRules_DataTable_ActionMenuItems.CopyRuleID
        )
      ).toBe(true)

      expect(
        await vendorPage.MitigationAssignmentRules.IsActionMenuItemVisible(
          rowIndex,
          VendorRules_DataTable_ActionMenuItems.AttachRuleToVendorsServiceAreas
        )
      ).toBe(true)

      expect(
        await vendorPage.MitigationAssignmentRules.IsActionMenuItemVisible(
          rowIndex,
          VendorRules_DataTable_ActionMenuItems.UpdateRule
        )
      ).toBe(true)

      expect(
        await vendorPage.MitigationAssignmentRules.IsActionMenuItemVisible(
          rowIndex,
          VendorRules_DataTable_ActionMenuItems.RemoveRule
        )
      ).toBe(true)
    })

    test('Mitigation Assignment Table - Verify Action Menu: Copy Rule ID', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.MitigationAssignmentRules.DataTable_Rules

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyMitigationAssignmentRulesTableMessage)
        return
      }

      // Verify setting the filter causes the table results to filter on the selected column only
      const parentRule = vendor.ruleGroups[1].rules[0]
      const rule: TextRule = parentRule.description as TextRule
      const ruleSummaryFilter = rule.value
      await table.SetTableFilter_Text(
        ruleSummaryFilter.toString(),
        DataTable_Columns_Type.Rules_RuleSummary
      )
      const ruleSummaryFilteredRowCount = await table.VisibleRowCount()
      expect(ruleSummaryFilteredRowCount).toBe(1)

      await vendorPage.CopyRuleId(table, 1)
      const copiedID = await vendorPage.GetClipboardText()

      // Verify clipboard contains the rule ID we expect
      expect(copiedID).toBe('BE7661rDX13-Nzm9H2Fxc')
    })

    test('Mitigation Assignment Table - Verify Action Menu: Attach Rule To Vendors Service Area', async ({
      browser,
    }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.MitigationAssignmentRules.DataTable_Rules
      const serviceAreaPrefix = 'AA_TESTSERVICEAREA'
      const dateSuffix = `+${Date.now()}`

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyMitigationAssignmentRulesTableMessage)
        return
      }

      // Setup for a new service area
      const newServiceAreaName = `${serviceAreaPrefix}${dateSuffix}`
      const newServiceArea = TestServiceAreas.TestServiceArea_Template_New as ServiceArea
      newServiceArea.name = newServiceAreaName
      newServiceArea.stateToAdd.push(StateTuples.WA_Washington as ClientPortalLocation)

      // Attach vendor to a new service area
      await vendorPage.Action_AttachVendorToNewServiceArea(newServiceArea)

      // Verify setting the filter causes the table results to filter on the selected column only
      const parentRule = vendor.ruleGroups[1].rules[0]
      const rule: TextRule = parentRule.description as TextRule
      const ruleSummaryFilter = rule.value
      await table.SetTableFilter_Text(
        ruleSummaryFilter.toString(),
        DataTable_Columns_Type.Rules_RuleSummary
      )
      const ruleSummaryFilteredRowCount = await table.VisibleRowCount()
      expect(ruleSummaryFilteredRowCount).toBe(1)

      // Apply the rule to the new service area
      await vendorPage.ApplyRuleToServiceArea(newServiceArea, table, 1)

      // Verify the rule is applied
      const serviceAreaAndVendorPage =
        await vendorPage.ClickLinkToServiceAreaAndVendor(newServiceArea)

      // just check if there is a rule in the Mitigation Assignments table, since it is a new Service Area
      const ruleCount =
        await serviceAreaAndVendorPage.MitigationAssignmentRules.DataTable_Rules.VisibleRowCount()
      expect(ruleCount).toBe(1)

      // Remove the service area
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, newServiceArea)
      await serviceAreaAndVendorPage.Link_GotoServiceArea.Click()
      await serviceAreaPage.Action_RemoveServiceArea()

      // Verify we are now on the ServiceAreas page
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.Title.VerifyExpectedText()
    })

    test('Mitigation Assignment Table - Verify Create Rule + Verify Action Menu: Update/Remove Rule', async ({
      browser,
    }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const dateSuffix = `+${Date.now()}`
      const vendorPrefix = 'AA_TESTVENDOR'

      // Clear any old vendors from failed tests
      await vendorsPage.FindAndDeleteOldTimestampedVendors(vendorPrefix)

      // Setup and create new vendor
      const vendorName = `${vendorPrefix}${dateSuffix}`
      const vendor = TestVendors.TestVendor_Template_New
      vendor.name = vendorName
      await vendorsPage.AddVendor(vendor)

      const vendorPage = await vendorsPage.ClickLinkToVendor(vendor)
      const table = vendorPage.MitigationAssignmentRules

      // Create a new Rule Set for the vendor
      const assignmentRuleGroup =
        VendorRuleSetsTuples.General_MitigationAssignmentRuleSet.ruleGroups[1]
      await table.CreateRule(assignmentRuleGroup)
      const foundMatchIndex = await table.FindMatchingRuleGroup(assignmentRuleGroup)
      expect(foundMatchIndex).not.toBe(null)

      // update the rule
      const updatedRuleGroup = deepCopy(assignmentRuleGroup)
      updatedRuleGroup.rules[0].description.operator = 'isnot'
      await table.UpdateRuleGroupByIndex('0', updatedRuleGroup)
      const foundUpdatedMatchIndex = await table.FindMatchingRuleGroup(updatedRuleGroup, true)
      expect(foundUpdatedMatchIndex).not.toBe(null)

      // remove the rule
      await table.RemoveRuleGroupByIndex('0')

      // remove vendor
      await vendorPage.Action_RemoveVendor()

      // make sure we are back on the Vendors page
      await vendorsPage.VerifyTitle()
    })

    test('Attached Service Areas Table - Settings: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global } = await Launch(browser, environment)
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.DataTable_AttachedServiceAreas

      // Click the Open Table Settings button on the Attached Service Areas Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await vendorPage.page.waitForTimeout(1000)
    })

    test('Attached Service Areas Table - Settings: Verify Columns', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global } = await Launch(browser, environment)
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.DataTable_AttachedServiceAreas

      // Click the Open Table Settings button on the Attached Service Areas Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify that each column checkbox hides the corresponding table column when unchecked
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.ServiceAreas_AreaName)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.ServiceAreas_AreaName)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.ServiceAreas_State)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.ServiceAreas_State)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.ServiceAreas_Enabled)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.ServiceAreas_Enabled)).toBe(false)

      // Verify that each column checkbox shows the corresponding table column when checked
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ServiceAreas_AreaName)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.ServiceAreas_AreaName)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ServiceAreas_State)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.ServiceAreas_State)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ServiceAreas_Enabled)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.ServiceAreas_Enabled)).toBe(true)
    })

    test('Attached Service Areas Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global } = await Launch(browser, environment)
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.DataTable_AttachedServiceAreas

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyAttachedServiceAreasTableMessage)
        return
      }

      // Click the Open Table Search button on the Attached Service Areas Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await vendorPage.page.waitForTimeout(1000)
    })

    test('Attached Service Areas Table - Global Search: Verify search', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global } = await Launch(browser, environment)
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceArea = deepCopy(vendor.attachedServiceAreas[0])
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.DataTable_AttachedServiceAreas

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyAttachedServiceAreasTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields
      const areaNameSearchTerm = serviceArea.name
      await table.SetTableSearch(areaNameSearchTerm)
      const areaNameFilteredRowCount = await table.VisibleRowCount()
      expect(areaNameFilteredRowCount).toBe(1)

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      // and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      const areaNameFilteredOffRowCount = await table.VisibleRowCount()
      expect(areaNameFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      const stateSearchTerm = 'ZZ'
      const tableSearchDialog = await table.SetTableSearch(stateSearchTerm, true)

      // Verify table is filtered
      const stateFilteredRowCount = await table.VisibleRowCount()
      expect(stateFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const stateFilterOffRowCount = await table.VisibleRowCount()
      expect(stateFilterOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Attached Service Areas Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global } = await Launch(browser, environment)
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.DataTable_AttachedServiceAreas

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyAttachedServiceAreasTableMessage)
        return
      }

      // Click the Add Table Filter button on the Attached Service Area table
      let tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.ServiceAreas_AreaName
      )

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await vendorPage.Wait()

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.ServiceAreas_State)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Attached Service Areas Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global } = await Launch(browser, environment)
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceArea = deepCopy(vendor.attachedServiceAreas[0])
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.DataTable_AttachedServiceAreas

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyAttachedServiceAreasTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const areaNameFilter = serviceArea.name
      const { pinnedFilter: areaNamePinnedFilter } = await table.SetTableFilter_Text(
        areaNameFilter,
        DataTable_Columns_Type.ServiceAreas_AreaName
      )
      const areaNameFilteredRowCount = await table.VisibleRowCount()
      expect(areaNameFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(areaNamePinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(areaNamePinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(areaNamePinnedFilter)).toBe(false)
      const areaNameFilteredOffRowCount = await table.VisibleRowCount()
      expect(areaNameFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const stateFilter = 'ZZ'
      const { tableFilterDialog } = await table.SetTableFilter_Text(
        stateFilter,
        DataTable_Columns_Type.ServiceAreas_State,
        false,
        true
      )

      // Verify table is filtered
      const stateFilteredRowCount = await table.VisibleRowCount()
      expect(stateFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const stateFilterOffRowCount = await table.VisibleRowCount()
      expect(stateFilterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Attached Service Areas Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global } = await Launch(browser, environment)
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceArea = deepCopy(vendor.attachedServiceAreas[0])
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.DataTable_AttachedServiceAreas

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyAttachedServiceAreasTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const areaNameFilter = serviceArea.name
      const { pinnedFilter: areaNamePinnedFilter } = await table.SetTableFilter_Text(
        areaNameFilter,
        DataTable_Columns_Type.ServiceAreas_AreaName
      )
      const areaNameFilteredRowCount = await table.VisibleRowCount()
      expect(areaNameFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(areaNamePinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedAreaNameFilterTerm = 'No Match Expected'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedAreaNameFilterTerm,
        DataTable_Columns_Type.ServiceAreas_AreaName,
        true
      )

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(editedPinnedFilter)).toBe(true)

      // Verify table is filtered and 1 row is visible
      const editedFilteredRowCount = await table.VisibleRowCount()
      expect(editedFilteredRowCount).toBe(0)

      // Verify clicking X button on the edited pinned filter removes it and clears the filter
      await table.CancelPinnedTableFilter(editedPinnedFilter)

      // Verify table is not filtered and all rows are visible
      const clearedRowCount = await table.VisibleRowCount()
      expect(clearedRowCount).toBe(initialRowCount)
    })

    test('Attached Service Areas Table - Expand and Collapse', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global } = await Launch(browser, environment)
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.DataTable_AttachedServiceAreas

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

    test('Attached Service Areas Table - Sort Columns', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global } = await Launch(browser, environment)
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.DataTable_AttachedServiceAreas

      // Examine AreaName and State columns
      // Verify initial states are unsorted
      const initiaAreaNameSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.ServiceAreas_AreaName
      )
      const initialStateSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.ServiceAreas_State
      )
      expect(initiaAreaNameSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(initialStateSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the AreaName column Sort icon to Down (high to low)
      await table.SetColumnSortState(
        DataTable_Columns_Type.ServiceAreas_AreaName,
        DataTable_Column_SortState.Down_HighToLow
      )

      // Verify AreaName is sorted Down and State is still unsorted
      let currentAreaNameSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.ServiceAreas_AreaName
      )
      let currentStateSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.ServiceAreas_State
      )
      expect(currentAreaNameSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
      expect(currentStateSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the State column Sort icon to Up (low to high)
      await table.SetColumnSortState(
        DataTable_Columns_Type.ServiceAreas_State,
        DataTable_Column_SortState.Up_LowToHigh
      )

      // Verify AreaName is now unsorted and State is sorted Up
      currentAreaNameSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.ServiceAreas_AreaName
      )
      currentStateSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.ServiceAreas_State
      )
      expect(currentAreaNameSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(currentStateSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

      // Set the State column Sort icon to Unsorted
      await table.SetColumnSortState(
        DataTable_Columns_Type.ServiceAreas_State,
        DataTable_Column_SortState.Unsorted
      )
      currentStateSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.ServiceAreas_State
      )
      expect(currentStateSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Verify Enabled cannot be sorted
      const enabledSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.ServiceAreas_Enabled
      )
      expect(enabledSortState).toBe(DataTable_Column_SortState.NotSortable)
    })

    test('Attached Service Areas Table - Verify Action Menus', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global } = await Launch(browser, environment)
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.DataTable_AttachedServiceAreas

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyAttachedServiceAreasTableMessage)
        return
      }

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)

      // Verify visibility of all the action menus for the table
      expect(
        await vendorPage.IsAttachedServiceAreasActionMenuItemVisible(
          rowIndex,
          AttachedServiceAreas_DataTable_ActionMenuItems.CreateCustomRule
        )
      ).toBe(true)

      expect(
        await vendorPage.IsAttachedServiceAreasActionMenuItemVisible(
          rowIndex,
          AttachedServiceAreas_DataTable_ActionMenuItems.UpdateVendorOverrides
        )
      ).toBe(true)

      expect(
        await vendorPage.IsAttachedServiceAreasActionMenuItemVisible(
          rowIndex,
          AttachedServiceAreas_DataTable_ActionMenuItems.UpdateRulesFromVendor
        )
      ).toBe(true)

      expect(
        await vendorPage.IsAttachedServiceAreasActionMenuItemVisible(
          rowIndex,
          AttachedServiceAreas_DataTable_ActionMenuItems.DetachVendor
        )
      ).toBe(true)
    })

    test('Attached Service Areas Table - Verify Action Button: Go to Service Area & Vendor page', async ({
      browser,
    }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global } = await Launch(browser, environment)
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceArea = deepCopy(vendor.attachedServiceAreas[0])
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.DataTable_AttachedServiceAreas

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyAttachedServiceAreasTableMessage)
        return
      }

      const serviceAreaAndVendorPage = await vendorPage.ClickLinkToServiceAreaAndVendor(serviceArea)
      const endOfURL = `service-areas/${serviceArea.id}/vendors/${vendor.id}`
      expect(serviceAreaAndVendorPage.page.url().endsWith(endOfURL)).toBe(true)
    })

    test('Attached Service Areas Table - Verify Action Button: Go to Service Area page', async ({
      browser,
    }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global } = await Launch(browser, environment)
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceArea = deepCopy(vendor.attachedServiceAreas[0])
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.DataTable_AttachedServiceAreas

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyAttachedServiceAreasTableMessage)
        return
      }

      const serviceAreaPage = await vendorPage.ClickLinkToServiceArea(serviceArea)
      const endOfURL = `service-areas/${serviceArea.id}`
      expect(serviceAreaPage.page.url().endsWith(endOfURL)).toBe(true)
    })

    test('Attached Service Areas Table - Verify Action Menu: Create Custom Rule', async ({
      browser,
    }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global } = await Launch(browser, environment)
      const serviceAreaPrefix = 'AA_TESTSERVICEAREA'

      // Clean up - Delete old Test Service areas
      let serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateDirectly()
      await serviceAreasPage.FindAndRemoveOldTimestampedServiceAreas(serviceAreaPrefix)

      // Head to Vendor Page
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.DataTable_AttachedServiceAreas
      const dateSuffix = `+${Date.now()}`

      // Setup for a new service area
      const newServiceAreaName = `${serviceAreaPrefix}${dateSuffix}`
      const newServiceArea = TestServiceAreas.TestServiceArea_Template_New as ServiceArea
      newServiceArea.name = newServiceAreaName
      newServiceArea.stateToAdd.push(StateTuples.WA_Washington as ClientPortalLocation)

      // Attach vendor to a new service area
      await vendorPage.Action_AttachVendorToNewServiceArea(newServiceArea)

      // Verify setting the filter causes the table results to filter on the selected column only
      const areaNameFilter = newServiceArea.name
      await table.SetTableFilter_Text(areaNameFilter, DataTable_Columns_Type.ServiceAreas_AreaName)
      const areaNameFilteredRowCount = await table.VisibleRowCount()
      expect(areaNameFilteredRowCount).toBe(1)

      // Get initial Row counts for both Claim and Mitigation tables - these should not change
      const initialClaimAssignmentRowCount =
        await vendorPage.ClaimAssignmentRules.DataTable_Rules.VisibleRowCount()
      const initialMitigationAssignmentRowCount =
        await vendorPage.ClaimAssignmentRules.DataTable_Rules.VisibleRowCount()

      // Create a new custom rule for the vendor + service area
      const assignmentRuleGroup =
        VendorRuleSetsTuples.General_MitigationAssignmentRuleSet.ruleGroups[1]
      const rowIndex =
        await vendorPage.DataTable_AttachedServiceAreas.FetchRowIndexFromRowPosition(1)
      await vendorPage.CreateCustomRule(rowIndex, assignmentRuleGroup)

      // Verify the custom rule did not appear on the Assigment tables
      const currentClaimAssignmentRowCount =
        await vendorPage.ClaimAssignmentRules.DataTable_Rules.VisibleRowCount()
      const currentMitigationAssignmentRowCount =
        await vendorPage.ClaimAssignmentRules.DataTable_Rules.VisibleRowCount()
      expect(initialClaimAssignmentRowCount).toBe(currentClaimAssignmentRowCount)
      expect(initialMitigationAssignmentRowCount).toBe(currentMitigationAssignmentRowCount)

      // Verify the rule is applied
      const serviceAreaAndVendorPage =
        await vendorPage.ClickLinkToServiceAreaAndVendor(newServiceArea)

      // just check if there is a rule in the Mitigation Assignments table, since it is a new Service Area
      const ruleCount =
        await serviceAreaAndVendorPage.MitigationAssignmentRules.DataTable_Rules.VisibleRowCount()
      expect(ruleCount).toBe(1)

      // Remove the service area
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, newServiceArea)
      await serviceAreaAndVendorPage.Link_GotoServiceArea.Click()
      await serviceAreaPage.Action_RemoveServiceArea()

      // Verify we are now on the ServiceAreas page
      serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.Title.VerifyExpectedText()
    })

    test('Attached Service Areas Table - Verify Action Menu: Update Vendor Overrides', async ({
      browser,
    }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const dateSuffix = `+${Date.now()}`
      const vendorPrefix = 'AA_TESTVENDOR'

      // Clear any old vendors from failed tests
      await vendorsPage.FindAndDeleteOldTimestampedVendors(vendorPrefix)

      // Setup and create new vendor
      const vendorName = `${vendorPrefix}${dateSuffix}`
      const vendor = TestVendors.TestVendor_Template_New
      vendor.name = vendorName
      await vendorsPage.AddVendor(vendor)

      const vendorPage = await vendorsPage.ClickLinkToVendor(vendor)

      // Attach vendor to service area
      const serviceArea = TestServiceAreas.TestEasternWashington
      await vendorPage.AttachedServiceAreas_AttachToExistingServiceArea(serviceArea)

      // Verify attachment
      // Verify setting the filter causes the table results to filter on the selected column only
      const areaNameFilter = serviceArea.name
      await vendorPage.DataTable_AttachedServiceAreas.SetTableFilter_Text(
        areaNameFilter,
        DataTable_Columns_Type.ServiceAreas_AreaName
      )
      const areaNameFilteredRowCount =
        await vendorPage.DataTable_AttachedServiceAreas.VisibleRowCount()
      expect(areaNameFilteredRowCount).toBe(1)

      // Update the overrides for this vendor
      const rowIndex =
        await vendorPage.DataTable_AttachedServiceAreas.FetchRowIndexFromRowPosition(1)
      const overrides = TestVendors.TestVendor_Template_Overrides
      await vendorPage.UpdateVendorOverridesByIndex(rowIndex, null, null, overrides)

      // Verify the changes
      const serviceAreaAndVendorPage = await vendorPage.ClickLinkToServiceAreaAndVendorByIndex(
        rowIndex,
        serviceArea
      )
      serviceAreaAndVendorPage.overrides = overrides
      expect(await serviceAreaAndVendorPage.IsTemporaryAssignmentSectionVisible()).toBe(false)
      await serviceAreaAndVendorPage.ValidateVendorInfo()
      await serviceAreaAndVendorPage.ValidateOriginalValuesThatWereOverriden()

      await serviceAreaAndVendorPage.Link_GotoVendor.Click()
      await vendorPage.Action_RemoveVendor()
    })

    test('Attached Service Areas Table - Verify Action Menu: Update Rules From Vendor', async ({
      browser,
    }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const dateSuffix = `+${Date.now()}`
      const vendorPrefix = 'AA_TESTVENDOR'

      // Clear any old vendors from failed tests
      await vendorsPage.FindAndDeleteOldTimestampedVendors(vendorPrefix)

      // Setup and create new vendor
      const vendorName = `${vendorPrefix}${dateSuffix}`
      const vendor = TestVendors.TestVendor_Template_New
      vendor.name = vendorName
      await vendorsPage.AddVendor(vendor)

      const vendorPage = await vendorsPage.ClickLinkToVendor(vendor)
      const table = vendorPage.ClaimAssignmentRules

      // Create a new Rule Set for the vendor
      const assignmentRuleGroup = VendorRuleSetsTuples.General_ClaimAssignmentRuleSet.ruleGroups[1]
      await table.CreateRule(assignmentRuleGroup)
      const foundMatchIndex = await table.FindMatchingRuleGroup(assignmentRuleGroup)
      expect(foundMatchIndex).not.toBe(null)

      // Attach vendor to service area
      const serviceArea = TestServiceAreas.TestEasternWashington
      await vendorPage.AttachedServiceAreas_AttachToExistingServiceArea(serviceArea)

      // Update Rules From Vendor
      const rowIndex = '0'
      await vendorPage.UpdateRulesFromVendor_SelectAll(rowIndex)

      // Verify the rules are applied
      const serviceAreaAndVendorPage = await vendorPage.ClickLinkToServiceAreaAndVendor(serviceArea)

      // just check if the rule count in the Mitigation Assignments table, since it is a new Service Area
      const ruleCount =
        await serviceAreaAndVendorPage.ClaimAssignmentRules.DataTable_Rules.VisibleRowCount()
      expect(ruleCount).toBe(1)

      await serviceAreaAndVendorPage.Link_GotoVendor.Click()

      // remove vendor
      await vendorPage.Action_RemoveVendor()

      // make sure we are back on the Vendors page
      await vendorsPage.VerifyTitle()
    })

    test('Attached Service Areas Table - Verify Action Menu: Detach Vendor', async ({
      browser,
    }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const dateSuffix = `+${Date.now()}`
      const vendorPrefix = 'AA_TESTVENDOR'

      // Clear any old vendors from failed tests
      await vendorsPage.FindAndDeleteOldTimestampedVendors(vendorPrefix)

      // Setup and create new vendor
      const vendorName = `${vendorPrefix}${dateSuffix}`
      const vendor = TestVendors.TestVendor_Template_New
      vendor.name = vendorName
      await vendorsPage.AddVendor(vendor)

      const vendorPage = await vendorsPage.ClickLinkToVendor(vendor)

      // Attach vendor to service area
      const serviceArea = TestServiceAreas.TestEasternWashington
      await vendorPage.AttachedServiceAreas_AttachToExistingServiceArea(serviceArea)

      // Detach the vendor
      const rowIndex = '0'
      await vendorPage.DetachVendor(rowIndex)
      await vendorPage.Wait(4000)

      // Verify the Attached Service Areas table is now empty and in the Getting Started mode
      expect(await vendorPage.IsAttachedServiceAreasEmpty()).toBe(true)

      // remove vendor
      await vendorPage.Action_RemoveVendor()

      // make sure we are back on the Vendors page
      await vendorsPage.VerifyTitle()
    })

    test('Attached Service Areas Table - Attach to Service Area', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const dateSuffix = `+${Date.now()}`
      const vendorPrefix = 'AA_TESTVENDOR'

      // Clear any old vendors from failed tests
      await vendorsPage.FindAndDeleteOldTimestampedVendors(vendorPrefix)

      // Setup and create new vendor
      const vendorName = `${vendorPrefix}${dateSuffix}`
      const vendor = TestVendors.TestVendor_Template_New
      vendor.name = vendorName
      await vendorsPage.AddVendor(vendor)

      const vendorPage = await vendorsPage.ClickLinkToVendor(vendor)

      // Attach vendor to service area
      const serviceArea = TestServiceAreas.TestEasternWashington
      await vendorPage.AttachedServiceAreas_AttachToExistingServiceArea(serviceArea)

      // Verify attachment
      // Verify setting the filter causes the table results to filter on the selected column only
      const areaNameFilter = serviceArea.name
      await vendorPage.DataTable_AttachedServiceAreas.SetTableFilter_Text(
        areaNameFilter,
        DataTable_Columns_Type.ServiceAreas_AreaName
      )
      const areaNameFilteredRowCount =
        await vendorPage.DataTable_AttachedServiceAreas.VisibleRowCount()
      expect(areaNameFilteredRowCount).toBe(1)

      // remove vendor
      await vendorPage.Action_RemoveVendor()

      // make sure we are back on the Vendors page
      await vendorsPage.VerifyTitle()
    })

    test('Attached Service Areas Table - Attach Vendor to Service Area', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const dateSuffix = `+${Date.now()}`
      const vendorPrefix = 'AA_TESTVENDOR'

      // Clear any old vendors from failed tests
      await vendorsPage.FindAndDeleteOldTimestampedVendors(vendorPrefix)

      // Setup and create new vendor
      const vendorName = `${vendorPrefix}${dateSuffix}`
      const vendor = TestVendors.TestVendor_Template_New
      vendor.name = vendorName
      await vendorsPage.AddVendor(vendor)

      const vendorPage = await vendorsPage.ClickLinkToVendor(vendor)

      // Attach vendor to service area
      const serviceArea = TestServiceAreas.TestEasternWashington
      await vendorPage.AttachedServiceAreas_GettingStarted_AttachVendorToExistingServiceArea(
        serviceArea
      )

      // Verify attachment
      // Verify setting the filter causes the table results to filter on the selected column only
      const areaNameFilter = serviceArea.name
      await vendorPage.DataTable_AttachedServiceAreas.SetTableFilter_Text(
        areaNameFilter,
        DataTable_Columns_Type.ServiceAreas_AreaName
      )
      const areaNameFilteredRowCount =
        await vendorPage.DataTable_AttachedServiceAreas.VisibleRowCount()
      expect(areaNameFilteredRowCount).toBe(1)

      // remove vendor
      await vendorPage.Action_RemoveVendor()

      // make sure we are back on the Vendors page
      await vendorsPage.VerifyTitle()
    })

    test('Attached Service Areas Table - View/Hide Map', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global } = await Launch(browser, environment)
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()
      const table = vendorPage.DataTable_AttachedServiceAreas

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyAttachedServiceAreasTableMessage)
        return
      }

      // verify map is not shown
      expect(await vendorPage.IsAttachedServiceAreasMapDisplayed()).toBe(false)
      expect(await vendorPage.Button_ToggleMap.GetText()).toBe(VendorPageStrings.Button_ViewMap)

      // Show the map of the attached service vendor(s)
      await vendorPage.Button_ToggleMap.Click()

      // verify map is shown
      expect(await vendorPage.IsAttachedServiceAreasMapDisplayed()).toBe(true)
      expect(await vendorPage.Button_ToggleMap.GetText()).toBe(VendorPageStrings.Button_HideMap)

      // Hide the map of the attached service vendor(s)
      await vendorPage.Button_ToggleMap.Click()

      // verify map is not shown
      expect(await vendorPage.IsAttachedServiceAreasMapDisplayed()).toBe(false)
      expect(await vendorPage.Button_ToggleMap.GetText()).toBe(VendorPageStrings.Button_ViewMap)
    })

    test('Actions: Copy Vendor ID', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global } = await Launch(browser, environment)
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()

      await vendorPage.Action_CopyVendorID()
      const copiedID = await vendorPage.GetClipboardText()

      // Verify clipboard contains the vendor ID we expect
      expect(copiedID).not.toBe('')
      expect(copiedID).toBe(vendor.id)
    })

    test('Actions: Attached Vendor to Service Area', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const dateSuffix = `+${Date.now()}`
      const vendorPrefix = 'AA_TESTVENDOR'

      // Clear any old vendors from failed tests
      await vendorsPage.FindAndDeleteOldTimestampedVendors(vendorPrefix)

      // Setup and create new vendor
      const vendorName = `${vendorPrefix}${dateSuffix}`
      const vendor = TestVendors.TestVendor_Template_New
      vendor.name = vendorName
      await vendorsPage.AddVendor(vendor)

      const vendorPage = await vendorsPage.ClickLinkToVendor(vendor)

      // Attach vendor to service area
      const serviceArea = TestServiceAreas.TestEasternWashington
      await vendorPage.Action_AttachVendorToExistingServiceArea(serviceArea)

      // Verify attachment
      // Verify setting the filter causes the table results to filter on the selected column only
      const areaNameFilter = serviceArea.name
      await vendorPage.DataTable_AttachedServiceAreas.SetTableFilter_Text(
        areaNameFilter,
        DataTable_Columns_Type.ServiceAreas_AreaName
      )
      const areaNameFilteredRowCount =
        await vendorPage.DataTable_AttachedServiceAreas.VisibleRowCount()
      expect(areaNameFilteredRowCount).toBe(1)

      // remove vendor
      await vendorPage.Action_RemoveVendor()

      // make sure we are back on the Vendors page
      await vendorsPage.VerifyTitle()
    })

    test('Actions: Update/Remove Vendor', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const dateSuffix = `+${Date.now()}`
      const vendorPrefix = 'AA_TESTVENDOR'

      // Clear any old vendors from failed tests
      await vendorsPage.FindAndDeleteOldTimestampedVendors(vendorPrefix)

      // Setup and create new vendor
      const newVendorName = `${vendorPrefix}${dateSuffix}`
      const newVendor = TestVendors.TestVendor_Template_New
      newVendor.name = newVendorName
      await vendorsPage.AddVendor(newVendor)

      const vendorPage = await vendorsPage.ClickLinkToVendor(newVendor)

      // Setup and edit vendor
      const updateVendor = deepCopy(newVendor)
      updateVendor.name = `${newVendorName}+EDITED`
      await vendorPage.Action_UpdateVendor(updateVendor)
      vendorPage.vendor = updateVendor

      // Verify changes are visible
      await vendorPage.Wait(2000)
      await vendorPage.ValidateDetails()

      // Remove edited vendor
      await vendorPage.Action_RemoveVendor()

      // Verify we are back on the Vendors page
      await vendorsPage.Title.VerifyExpectedText()
    })
  }
)
