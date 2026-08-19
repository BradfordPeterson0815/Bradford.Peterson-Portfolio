import { expect } from '@playwright/test'
import {
  AbortErrors,
  CountyTuples,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
  ServiceAreaAndVendorPageStrings,
  TestServiceAreas,
  TestVendors,
  VendorRuleSetsTuples,
  VendorRules_DataTable_ActionMenuItems,
} from '../../library/clientPortal/clientPortalConstants.js'
import { AbortTest, Launch, deepCopy } from '../../library/clientPortal/clientPortalHelper.js'
import { ClientPortalLocation } from '../../library/clientPortal/clientPortalLocation.js'
import { ServiceArea } from '../../library/clientPortal/clientPortalServiceArea.js'
import { Vendor } from '../../library/clientPortal/clientPortalVendor.js'
import { ClientPortalServiceAreaAndVendorPage } from '../../library/clientPortal/pages/clientPortalServiceAreaAndVendorPage.js'
import { ClientPortalServiceAreaPage } from '../../library/clientPortal/pages/clientPortalServiceAreaPage.js'
import { ClientPortalServiceAreasPage } from '../../library/clientPortal/pages/clientPortalServiceAreasPage.js'
import { ClientPortalVendorPage } from '../../library/clientPortal/pages/clientPortalVendorPage.js'
import { Tags } from '../../library/shared/constants.js'
import test from '../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Service Area And Vendor Page',
  {
    tag: [Tags.ClientPortal, Tags.ServiceAreaAndVendor],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const endOfURL = `service-areas/${serviceArea.id}/vendors/${vendor.id}`

      // Verify navigation from Vendor page
      const vendorPage = new ClientPortalVendorPage(global, vendor)
      await vendorPage.NavigateDirectly()

      let serviceAreaAndVendorPage = await vendorPage.ClickLinkToServiceAreaAndVendor(serviceArea)
      expect(serviceAreaAndVendorPage.page.url().endsWith(endOfURL)).toBe(true)

      // Verify navigation from ServiceArea page
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, serviceArea)
      await serviceAreaPage.NavigateDirectly()

      serviceAreaAndVendorPage = await serviceAreaPage.ClickLinkToServiceAreaAndVendor(vendor)
      expect(serviceAreaAndVendorPage.page.url().endsWith(endOfURL)).toBe(true)

      // Verify page layout...
      // Verify Links
      await serviceAreaAndVendorPage.Link_GotoVendor.VerifyExpectedText()
      await serviceAreaAndVendorPage.Link_GotoServiceArea.VerifyExpectedText()

      // Verify both Assignment Rule Tables exists
      const claimAssignmentTable = serviceAreaAndVendorPage.ClaimAssignmentRules.DataTable_Rules
      const mitigationAssignmentTable =
        serviceAreaAndVendorPage.MitigationAssignmentRules.DataTable_Rules
      expect(await claimAssignmentTable.IsVisible()).toBe(true)
      expect(await mitigationAssignmentTable.IsVisible()).toBe(true)

      // Verify Claim Assignment Table layout...
      // Verify Claim Assignment Settings, Filters and Expand button
      expect(await claimAssignmentTable.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await claimAssignmentTable.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await claimAssignmentTable.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await claimAssignmentTable.Button_CloseTable.IsVisible()).toBe(false)

      // Verify Mitigation Assignment Table layout...
      // Verify Mitigation Assignment Settings, Filters and Expand button
      expect(await mitigationAssignmentTable.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await mitigationAssignmentTable.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await mitigationAssignmentTable.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await mitigationAssignmentTable.Button_CloseTable.IsVisible()).toBe(false)

      // Verify Service Area Info section
      await serviceAreaAndVendorPage.ValidateServiceAreaDetails()
      expect(await serviceAreaAndVendorPage.IsTemporaryAssignmentSectionVisible()).toBe(false)
      await serviceAreaAndVendorPage.ValidateVendorInfo()
      await serviceAreaAndVendorPage.ValidateOriginalValuesThatWereOverriden()
    })

    test('View/Hide Map', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()

      // verify map is not shown
      expect(await serviceAreaAndVendorPage.IsServiceAreaMapDisplayed()).toBe(false)
      expect(await serviceAreaAndVendorPage.Button_ToggleMap.GetText()).toBe(
        ServiceAreaAndVendorPageStrings.Button_ViewMap
      )

      // Show the map of the service area
      await serviceAreaAndVendorPage.Button_ToggleMap.Click()

      // verify map is shown
      expect(await serviceAreaAndVendorPage.IsServiceAreaMapDisplayed()).toBe(true)
      expect(await serviceAreaAndVendorPage.Button_ToggleMap.GetText()).toBe(
        ServiceAreaAndVendorPageStrings.Button_HideMap
      )

      // Hide the map of the service area
      await serviceAreaAndVendorPage.Button_ToggleMap.Click()

      // verify map is not shown
      expect(await serviceAreaAndVendorPage.IsServiceAreaMapDisplayed()).toBe(false)
      expect(await serviceAreaAndVendorPage.Button_ToggleMap.GetText()).toBe(
        ServiceAreaAndVendorPageStrings.Button_ViewMap
      )
    })

    test('Claim Assignment Table - Settings: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.ClaimAssignmentRules.DataTable_Rules

      // Click the Open Table Settings button on the Claim Assignment Rules Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await serviceAreaAndVendorPage.page.waitForTimeout(1000)
    })

    test('Claim Assignment Table - Settings: Verify Columns', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.ClaimAssignmentRules.DataTable_Rules

      // Click the Open Table Settings button on the Claim Assignment Rules Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify that each column checkbox hides the corresponding table column when unchecked
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Rules_IsCustomRule)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Rules_IsCustomRule)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Rules_RuleSummary)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Rules_RuleSummary)).toBe(false)

      // Verify that each column checkbox shows the corresponding table column when checked
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Rules_IsCustomRule)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Rules_IsCustomRule)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Rules_RuleSummary)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Rules_RuleSummary)).toBe(true)
    })

    test('Claim Assignment Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.ClaimAssignmentRules.DataTable_Rules

      // If the table is empty, we cannot perform this test
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
      await serviceAreaAndVendorPage.Wait()

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Rules_RuleSummary)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Claim Assignment Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.ClaimAssignmentRules.DataTable_Rules

      // If the table is empty, we cannot perform this test
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

    test('Claim Assignment Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.ClaimAssignmentRules.DataTable_Rules

      // If the table is empty, we cannot perform this test
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
      const editedRuleSummaryFilter = '44'
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
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.ClaimAssignmentRules.DataTable_Rules

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
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.ClaimAssignmentRules.DataTable_Rules

      // Examine the Rule summary column
      // Verify initial state is unsorted
      const initialSummarySortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary
      )
      const initialIsCustomSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_IsCustomRule
      )
      expect(initialSummarySortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(initialIsCustomSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the Rule Summary column Sort icon to Down (high to low)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary,
        DataTable_Column_SortState.Down_HighToLow
      )

      // Verify the Rule Summary column is sorted Down and Is Custom is still unsorted
      let currentSummarySortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary
      )
      let currentIsCustomSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_IsCustomRule
      )
      expect(currentSummarySortState).toBe(DataTable_Column_SortState.Down_HighToLow)
      expect(currentIsCustomSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the Is Custom column Sort icon to Up (low to high)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Rules_IsCustomRule,
        DataTable_Column_SortState.Up_LowToHigh
      )

      // Verify Summary is now unsorted and Start Date is sorted Up
      currentSummarySortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary
      )
      currentIsCustomSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_IsCustomRule
      )
      expect(currentSummarySortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(currentIsCustomSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

      // Set the Is Custom column Sort icon to Unsorted
      await table.SetColumnSortState(
        DataTable_Columns_Type.Rules_IsCustomRule,
        DataTable_Column_SortState.Unsorted
      )
      currentIsCustomSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_IsCustomRule
      )
      expect(currentIsCustomSortState).toBe(DataTable_Column_SortState.Unsorted)
    })

    test('Claim Assignment Table - Verify Action Menus', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.ClaimAssignmentRules.DataTable_Rules

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimAssignmentRulesTableMessage)
        return
      }

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)

      // Verify visibility of all the action menus for the table
      expect(
        await serviceAreaAndVendorPage.ClaimAssignmentRules.IsActionMenuItemVisible(
          rowIndex,
          VendorRules_DataTable_ActionMenuItems.CopyRuleID
        )
      ).toBe(true)

      expect(
        await serviceAreaAndVendorPage.ClaimAssignmentRules.IsActionMenuItemVisible(
          rowIndex,
          VendorRules_DataTable_ActionMenuItems.UpdateRule
        )
      ).toBe(true)

      expect(
        await serviceAreaAndVendorPage.ClaimAssignmentRules.IsActionMenuItemVisible(
          rowIndex,
          VendorRules_DataTable_ActionMenuItems.DetachRule
        )
      ).toBe(true)
    })

    test('Claim Assignment Table - Verify Action Menu: Copy Rule ID', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.ClaimAssignmentRules.DataTable_Rules

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimAssignmentRulesTableMessage)
        return
      }

      // Verify setting the filter causes the table results to filter on the selected column only
      await table.SetTableFilter_Text('Amazing', DataTable_Columns_Type.Rules_RuleSummary)
      const ruleSummaryFilteredRowCount = await table.VisibleRowCount()
      expect(ruleSummaryFilteredRowCount).toBe(1)

      await serviceAreaAndVendorPage.CopyRuleId(table, 1)
      const copiedID = await serviceAreaAndVendorPage.GetClipboardText()

      // Verify clipboard contains a valid rule ID
      expect(copiedID.length).toBe(21)
    })

    test('Claim Assignment Table -  Verify Create Custom Rule + Verify Action Menu: Update/Detach Rule', async ({
      browser,
    }) => {
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const serviceAreaPrefix = 'AA_TESTSERVICEAREA'
      const dateSuffix = `+${Date.now()}`
      const vendor = TestVendors.TestVendorC_WithRules

      // Clean up - Delete old Test Service areas
      let serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateDirectly()
      await serviceAreasPage.FindAndRemoveOldTimestampedServiceAreas(serviceAreaPrefix)

      // Setup and create new service area
      const newServiceAreaName = `${serviceAreaPrefix}${dateSuffix}`
      const newServiceArea = TestServiceAreas.TestServiceArea_Template_New as ServiceArea
      newServiceArea.name = newServiceAreaName
      newServiceArea.countiesToAdd.push(CountyTuples.WA_Spokane as ClientPortalLocation)
      await serviceAreasPage.AddServiceArea(newServiceArea)
      await serviceAreasPage.UpdateServiceAreaIdAsNeeded(newServiceArea)

      // go to the new Service Area
      const serviceAreaPage: ClientPortalServiceAreaPage =
        await serviceAreasPage.ClickLinkToServiceArea(newServiceArea)

      // Attach the service area to an existing vendor
      await serviceAreaPage.Action_AddExistingVendorToServiceArea(vendor)
      const serviceAreaAndVendorPage = await serviceAreaPage.ClickLinkToServiceAreaAndVendor(vendor)

      // Create a new Custom Rule for the vendor
      const assignmentRuleGroup = deepCopy(
        VendorRuleSetsTuples.General_ClaimAssignmentRuleSet.ruleGroups[1]
      )
      await serviceAreaAndVendorPage.ClaimAssignmentRules.CreateCustomRule(assignmentRuleGroup)
      assignmentRuleGroup.hasParent = true // since we are a custom rule
      const foundMatchIndex =
        await serviceAreaAndVendorPage.ClaimAssignmentRules.FindMatchingRuleGroup(
          assignmentRuleGroup
        )
      expect(foundMatchIndex).not.toBe(null)

      // update the rule
      const updatedRuleGroup = deepCopy(assignmentRuleGroup)
      updatedRuleGroup.rules[0].description.operator = 'lengthequalto'
      await serviceAreaAndVendorPage.ClaimAssignmentRules.UpdateRuleGroupByIndex(
        '0',
        updatedRuleGroup
      )
      const foundUpdatedMatchIndex =
        await serviceAreaAndVendorPage.ClaimAssignmentRules.FindMatchingRuleGroup(
          updatedRuleGroup,
          true
        )
      expect(foundUpdatedMatchIndex).not.toBe(null)

      // detach the rule
      await serviceAreaAndVendorPage.ClaimAssignmentRules.DetachRuleGroupByIndex('0')

      // Head back and remove the service area
      await serviceAreaAndVendorPage.Link_GotoServiceArea.Click()
      await serviceAreaPage.Action_RemoveServiceArea()

      // Verify we are now on the ServiceAreas page
      serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.Title.VerifyExpectedText()
    })

    test('Mitigation Assignment Table - Settings: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.MitigationAssignmentRules.DataTable_Rules

      // Click the Open Table Settings button on the Claim Assignment Rules Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await serviceAreaAndVendorPage.page.waitForTimeout(1000)
    })

    test('Mitigation Assignment Table - Settings: Verify Columns', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.MitigationAssignmentRules.DataTable_Rules

      // Click the Open Table Settings button on the Claim Assignment Rules Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify that each column checkbox hides the corresponding table column when unchecked
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Rules_IsCustomRule)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Rules_IsCustomRule)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Rules_RuleSummary)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Rules_RuleSummary)).toBe(false)

      // Verify that each column checkbox shows the corresponding table column when checked
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Rules_IsCustomRule)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Rules_IsCustomRule)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Rules_RuleSummary)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Rules_RuleSummary)).toBe(true)
    })

    test('Mitigation Assignment Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.MitigationAssignmentRules.DataTable_Rules

      // If the table is empty, we cannot perform this test
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
      await serviceAreaAndVendorPage.Wait()

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Rules_RuleSummary)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Mitigation Assignment Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.MitigationAssignmentRules.DataTable_Rules

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyMitigationAssignmentRulesTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      let ruleSummaryFilter = 'tadpole'
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
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.MitigationAssignmentRules.DataTable_Rules

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyMitigationAssignmentRulesTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const ruleSummaryFilter = 'tadpole'
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
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.MitigationAssignmentRules.DataTable_Rules

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
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.MitigationAssignmentRules.DataTable_Rules

      // Examine the Rule summary column
      // Verify initial state is unsorted
      const initialSummarySortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary
      )
      const initialIsCustomSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_IsCustomRule
      )
      expect(initialSummarySortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(initialIsCustomSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the Rule Summary column Sort icon to Down (high to low)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary,
        DataTable_Column_SortState.Down_HighToLow
      )

      // Verify the Rule Summary column is sorted Down and Is Custom is still unsorted
      let currentSummarySortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary
      )
      let currentIsCustomSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_IsCustomRule
      )
      expect(currentSummarySortState).toBe(DataTable_Column_SortState.Down_HighToLow)
      expect(currentIsCustomSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the Is Custom column Sort icon to Up (low to high)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Rules_IsCustomRule,
        DataTable_Column_SortState.Up_LowToHigh
      )

      // Verify Summary is now unsorted and Start Date is sorted Up
      currentSummarySortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_RuleSummary
      )
      currentIsCustomSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_IsCustomRule
      )
      expect(currentSummarySortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(currentIsCustomSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

      // Set the Is Custom column Sort icon to Unsorted
      await table.SetColumnSortState(
        DataTable_Columns_Type.Rules_IsCustomRule,
        DataTable_Column_SortState.Unsorted
      )
      currentIsCustomSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Rules_IsCustomRule
      )
      expect(currentIsCustomSortState).toBe(DataTable_Column_SortState.Unsorted)
    })

    test('Mitigation Assignment Table - Verify Action Menus', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area And Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.MitigationAssignmentRules.DataTable_Rules

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyMitigationAssignmentRulesTableMessage)
        return
      }

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)

      // Verify visibility of all the action menus for the table
      expect(
        await serviceAreaAndVendorPage.MitigationAssignmentRules.IsActionMenuItemVisible(
          rowIndex,
          VendorRules_DataTable_ActionMenuItems.CopyRuleID
        )
      ).toBe(true)

      expect(
        await serviceAreaAndVendorPage.MitigationAssignmentRules.IsActionMenuItemVisible(
          rowIndex,
          VendorRules_DataTable_ActionMenuItems.UpdateRule
        )
      ).toBe(true)

      expect(
        await serviceAreaAndVendorPage.MitigationAssignmentRules.IsActionMenuItemVisible(
          rowIndex,
          VendorRules_DataTable_ActionMenuItems.DetachRule
        )
      ).toBe(true)
    })

    test('Mitigation Assignment Table - Verify Action Menu: Copy Rule ID', async ({ browser }) => {
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const table = serviceAreaAndVendorPage.MitigationAssignmentRules.DataTable_Rules

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyMitigationAssignmentRulesTableMessage)
        return
      }

      // Verify setting the filter causes the table results to filter on the selected column only
      await table.SetTableFilter_Text('FIRE', DataTable_Columns_Type.Rules_RuleSummary)
      const ruleSummaryFilteredRowCount = await table.VisibleRowCount()
      expect(ruleSummaryFilteredRowCount).toBe(1)

      await serviceAreaAndVendorPage.CopyRuleId(table, 1)
      const copiedID = await serviceAreaAndVendorPage.GetClipboardText()

      // Verify clipboard contains a valid rule ID
      expect(copiedID.length).toBe(21)
    })

    test('Mitigation Assignment Table -  Verify Create Custom Rule + Verify Action Menu: Update/Detach Rule', async ({
      browser,
    }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const serviceAreaPrefix = 'AA_TESTSERVICEAREA'
      const dateSuffix = `+${Date.now()}`
      const vendor = TestVendors.TestVendorC_WithRules

      // Clean up - Delete old Test Service areas
      let serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateDirectly()
      await serviceAreasPage.FindAndRemoveOldTimestampedServiceAreas(serviceAreaPrefix)

      // Setup and create new service area
      const newServiceAreaName = `${serviceAreaPrefix}${dateSuffix}`
      const newServiceArea = TestServiceAreas.TestServiceArea_Template_New as ServiceArea
      newServiceArea.name = newServiceAreaName
      newServiceArea.countiesToAdd.push(CountyTuples.WA_Spokane as ClientPortalLocation)
      await serviceAreasPage.AddServiceArea(newServiceArea)
      await serviceAreasPage.UpdateServiceAreaIdAsNeeded(newServiceArea)

      // go to the new Service Area
      const serviceAreaPage: ClientPortalServiceAreaPage =
        await serviceAreasPage.ClickLinkToServiceArea(newServiceArea)

      // Attach the service area to an existing vendor
      await serviceAreaPage.Action_AddExistingVendorToServiceArea(vendor)
      const serviceAreaAndVendorPage = await serviceAreaPage.ClickLinkToServiceAreaAndVendor(vendor)

      // Create a new Custom Rule for the vendor
      const assignmentRuleGroup = deepCopy(
        VendorRuleSetsTuples.General_MitigationAssignmentRuleSet.ruleGroups[1]
      )
      await serviceAreaAndVendorPage.MitigationAssignmentRules.CreateCustomRule(assignmentRuleGroup)
      assignmentRuleGroup.hasParent = true // since we are a custom rule
      const foundMatchIndex =
        await serviceAreaAndVendorPage.MitigationAssignmentRules.FindMatchingRuleGroup(
          assignmentRuleGroup
        )
      expect(foundMatchIndex).not.toBe(null)

      // update the rule
      const updatedRuleGroup = deepCopy(assignmentRuleGroup)
      updatedRuleGroup.rules[0].description.operator = 'isnot'
      await serviceAreaAndVendorPage.MitigationAssignmentRules.UpdateRuleGroupByIndex(
        '0',
        updatedRuleGroup
      )
      const foundUpdatedMatchIndex =
        await serviceAreaAndVendorPage.MitigationAssignmentRules.FindMatchingRuleGroup(
          updatedRuleGroup,
          true
        )
      expect(foundUpdatedMatchIndex).not.toBe(null)

      // detach the rule
      await serviceAreaAndVendorPage.MitigationAssignmentRules.DetachRuleGroupByIndex('0')

      // Head back and remove the service area
      await serviceAreaAndVendorPage.Link_GotoServiceArea.Click()
      await serviceAreaPage.Action_RemoveServiceArea()

      // Verify we are now on the ServiceAreas page
      serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.Title.VerifyExpectedText()
    })

    test('Actions - Create Custom Rule', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const serviceAreaPrefix = 'AA_TESTSERVICEAREA'
      const dateSuffix = `+${Date.now()}`
      const vendor = TestVendors.TestVendorC_WithRules

      // Clean up - Delete old Test Service areas
      let serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateDirectly()
      await serviceAreasPage.FindAndRemoveOldTimestampedServiceAreas(serviceAreaPrefix)

      // Setup and create new service area
      const newServiceAreaName = `${serviceAreaPrefix}${dateSuffix}`
      const newServiceArea = TestServiceAreas.TestServiceArea_Template_New as ServiceArea
      newServiceArea.name = newServiceAreaName
      newServiceArea.countiesToAdd.push(CountyTuples.WA_Spokane as ClientPortalLocation)
      await serviceAreasPage.AddServiceArea(newServiceArea)
      await serviceAreasPage.UpdateServiceAreaIdAsNeeded(newServiceArea)

      // go to the new Service Area
      const serviceAreaPage: ClientPortalServiceAreaPage =
        await serviceAreasPage.ClickLinkToServiceArea(newServiceArea)

      // Attach the service area to an existing vendor
      await serviceAreaPage.Action_AddExistingVendorToServiceArea(vendor)
      const serviceAreaAndVendorPage = await serviceAreaPage.ClickLinkToServiceAreaAndVendor(vendor)

      // Create a new Custom Rule for the vendor
      const assignmentRuleGroup = deepCopy(
        VendorRuleSetsTuples.General_ClaimAssignmentRuleSet.ruleGroups[1]
      )
      await serviceAreaAndVendorPage.Action_CreateCustomRule(assignmentRuleGroup)
      assignmentRuleGroup.hasParent = true // since we are a custom rule
      const foundMatchIndex =
        await serviceAreaAndVendorPage.ClaimAssignmentRules.FindMatchingRuleGroup(
          assignmentRuleGroup
        )
      expect(foundMatchIndex).not.toBe(null)

      // detach the rule
      await serviceAreaAndVendorPage.ClaimAssignmentRules.DetachRuleGroupByIndex('0')

      // Head back and remove the service area
      await serviceAreaAndVendorPage.Link_GotoServiceArea.Click()
      await serviceAreaPage.Action_RemoveServiceArea()

      // Verify we are now on the ServiceAreas page
      serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.Title.VerifyExpectedText()
    })

    test('Actions - Update Vendor Overrides', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const serviceAreaPrefix = 'AA_TESTSERVICEAREA'
      const dateSuffix = `+${Date.now()}`
      const vendor = TestVendors.TestVendorC_WithRules

      // Clean up - Delete old Test Service areas
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateDirectly()
      await serviceAreasPage.FindAndRemoveOldTimestampedServiceAreas(serviceAreaPrefix)

      // Setup and create new service area
      const newServiceAreaName = `${serviceAreaPrefix}${dateSuffix}`
      const newServiceArea = TestServiceAreas.TestServiceArea_Template_New as ServiceArea
      newServiceArea.name = newServiceAreaName
      newServiceArea.countiesToAdd.push(CountyTuples.WA_Spokane as ClientPortalLocation)
      await serviceAreasPage.AddServiceArea(newServiceArea)
      await serviceAreasPage.UpdateServiceAreaIdAsNeeded(newServiceArea)

      // go to the new Service Area
      const serviceAreaPage: ClientPortalServiceAreaPage =
        await serviceAreasPage.ClickLinkToServiceArea(newServiceArea)

      // Attach the service area to an existing vendor
      await serviceAreaPage.Action_AddExistingVendorToServiceArea(vendor)
      const serviceAreaAndVendorPage = await serviceAreaPage.ClickLinkToServiceAreaAndVendor(vendor)

      // Update the overrides for this vendor
      const overrides = TestVendors.TestVendor_Template_Overrides_Empty
      overrides.internalName = `${vendor.internalName}_OVERRIDE`
      await serviceAreaAndVendorPage.Action_UpdateVendorOverrides(null, null, overrides)
      serviceAreaAndVendorPage.overrides = overrides
      expect(await serviceAreaAndVendorPage.IsTemporaryAssignmentSectionVisible()).toBe(false)
      await serviceAreaAndVendorPage.ValidateVendorInfo()
      await serviceAreaAndVendorPage.ValidateOriginalValuesThatWereOverriden()

      await serviceAreaAndVendorPage.Link_GotoServiceArea.Click()
      await serviceAreaPage.Action_RemoveServiceArea()
    })

    test('Actions - Update Rules From Vendor', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const serviceAreaPrefix = 'AA_TESTSERVICEAREA'
      const dateSuffix = `+${Date.now()}`
      const vendor = TestVendors.TestVendorC_WithRules

      // Clean up - Delete old Test Service areas
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateDirectly()
      await serviceAreasPage.FindAndRemoveOldTimestampedServiceAreas(serviceAreaPrefix)

      // Setup and create new service area
      const newServiceAreaName = `${serviceAreaPrefix}${dateSuffix}`
      const newServiceArea = TestServiceAreas.TestServiceArea_Template_New as ServiceArea
      newServiceArea.name = newServiceAreaName
      newServiceArea.countiesToAdd.push(CountyTuples.WA_Spokane as ClientPortalLocation)
      await serviceAreasPage.AddServiceArea(newServiceArea)
      await serviceAreasPage.UpdateServiceAreaIdAsNeeded(newServiceArea)

      // go to the new Service Area
      const serviceAreaPage: ClientPortalServiceAreaPage =
        await serviceAreasPage.ClickLinkToServiceArea(newServiceArea)

      // Attach the service area to an existing vendor
      await serviceAreaPage.Action_AddExistingVendorToServiceArea(vendor)
      const serviceAreaAndVendorPage = await serviceAreaPage.ClickLinkToServiceAreaAndVendor(vendor)

      // Apply all the rules
      await serviceAreaAndVendorPage.Action_UpdateRulesFromVendor_SelectAll()

      // Verify the rules are applied
      // just check if the rule counts in the assignment tables, since it is a new Service Area
      const claimRuleCount =
        await serviceAreaAndVendorPage.ClaimAssignmentRules.DataTable_Rules.VisibleRowCount()
      expect(claimRuleCount).toBe(2)
      const mitigationRuleCount =
        await serviceAreaAndVendorPage.MitigationAssignmentRules.DataTable_Rules.VisibleRowCount()
      expect(mitigationRuleCount).toBe(2)

      await serviceAreaAndVendorPage.Link_GotoServiceArea.Click()
      await serviceAreaPage.Action_RemoveServiceArea()
    })

    test('Actions - Detach Vendor', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const serviceAreaPrefix = 'AA_TESTSERVICEAREA'
      const dateSuffix = `+${Date.now()}`
      const vendor = TestVendors.TestVendorC_WithRules

      // Clean up - Delete old Test Service areas
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateDirectly()
      await serviceAreasPage.FindAndRemoveOldTimestampedServiceAreas(serviceAreaPrefix)

      // Setup and create new service area
      const newServiceAreaName = `${serviceAreaPrefix}${dateSuffix}`
      const newServiceArea = TestServiceAreas.TestServiceArea_Template_New as ServiceArea
      newServiceArea.name = newServiceAreaName
      newServiceArea.countiesToAdd.push(CountyTuples.WA_Spokane as ClientPortalLocation)
      await serviceAreasPage.AddServiceArea(newServiceArea)
      await serviceAreasPage.UpdateServiceAreaIdAsNeeded(newServiceArea)

      // go to the new Service Area
      const serviceAreaPage: ClientPortalServiceAreaPage =
        await serviceAreasPage.ClickLinkToServiceArea(newServiceArea)

      // Attach the service area to an existing vendor
      await serviceAreaPage.Action_AddExistingVendorToServiceArea(vendor)
      const serviceAreaAndVendorPage = await serviceAreaPage.ClickLinkToServiceAreaAndVendor(vendor)

      // Detach the vendor and go to the Service Area afterward
      await serviceAreaAndVendorPage.Action_DetachVendorAndGotoServiceArea()
      await serviceAreaPage.Action_RemoveServiceArea()
    })
  }
)
