import { expect } from '@playwright/test'
import {
  AbortErrors,
  AttachedVendors_DataTable_ActionMenuItems,
  CountyTuples,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
  ServiceAreaPageStrings,
  TestServiceAreas,
  TestVendors,
  VendorPageStrings,
  VendorRuleSetsTuples,
} from '../../library/clientPortal/clientPortalConstants.js'
import { AbortTest, Launch, deepCopy } from '../../library/clientPortal/clientPortalHelper.js'
import { ClientPortalLocation } from '../../library/clientPortal/clientPortalLocation.js'
import { ServiceArea } from '../../library/clientPortal/clientPortalServiceArea.js'
import { ClientPortalServiceAreaPage } from '../../library/clientPortal/pages/clientPortalServiceAreaPage.js'
import { ClientPortalServiceAreasPage } from '../../library/clientPortal/pages/clientPortalServiceAreasPage.js'
import { Tags } from '../../library/shared/constants.js'
import test from '../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Service Area Page',
  {
    tag: [Tags.ClientPortal, Tags.ServiceArea],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the ClientPortal home page
      const { global, homePage } = await Launch(browser, environment)

      // Verify navigation from Service Areas page
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await homePage.Link_GoToServiceAreas.Click()
      const table = serviceAreasPage.DataTable_ServiceAreas

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyServiceAreasTableMessage)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestEasternWashington
      // filter for the service area
      const nameFilter = serviceArea.name
      await table.SetTableFilter_Text(nameFilter, DataTable_Columns_Type.ServiceAreas_AreaName)
      const serviceAreaPage: ClientPortalServiceAreaPage =
        await serviceAreasPage.ClickLinkToServiceArea(serviceArea)
      expect(serviceAreaPage.page.url().endsWith(serviceArea.id)).toBe(true)

      // Verify page layout
      await serviceAreaPage.VerifyTitle()
      await serviceAreaPage.ValidateServiceAreaDetails()
      await serviceAreaPage.Button_ToggleMap.VerifyExpectedText()

      // Verify Attached Vendors section
      // Attach Vendor button upper right always
      await serviceAreaPage.Button_AttachVendor.VerifyExpectedText()
      if (await serviceAreaPage.IsAttachedVendorsEmpty()) {
        // Getting Started Section Title and Description and button
        await serviceAreaPage.Label_GettingStartedHeader.VerifyExpectedText()
        await serviceAreaPage.Label_GettingStartedDescriptionA.VerifyExpectedText()
        await serviceAreaPage.Label_GettingStartedDescriptionB.VerifyExpectedText()
        expect(
          await serviceAreaPage.Button_GettingStarted_AttachVendorToServiceArea.IsVisible()
        ).toBe(true)
      } else {
        const attachedVendorsTable = serviceAreaPage.DataTable_AttachedVendors
        // Verify Attached Vendors Table layout...
        // Verify Attached Vendors Table Settings, Filters and Expand button
        expect(await attachedVendorsTable.Button_OpenTableSettings.IsVisible()).toBe(true)
        expect(await attachedVendorsTable.Button_AddTableFilter.IsVisible()).toBe(true)
        expect(await attachedVendorsTable.Button_ExpandTable.IsVisible()).toBe(true)
        expect(await attachedVendorsTable.Button_CloseTable.IsVisible()).toBe(false)
        expect(await attachedVendorsTable.Button_OpenTableSearch.IsVisible()).toBe(true)
      }
    })

    test('View/Hide Map', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area Page
      const { global } = await Launch(browser, environment)
      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, serviceArea)
      await serviceAreaPage.NavigateDirectly()

      // verify map is not shown
      expect(await serviceAreaPage.IsServiceAreaMapDisplayed()).toBe(false)
      expect(await serviceAreaPage.Button_ToggleMap.GetText()).toBe(
        ServiceAreaPageStrings.Button_ViewMap
      )

      // Show the map of the service area
      await serviceAreaPage.Button_ToggleMap.Click()

      // verify map is shown
      expect(await serviceAreaPage.IsServiceAreaMapDisplayed()).toBe(true)
      expect(await serviceAreaPage.Button_ToggleMap.GetText()).toBe(
        VendorPageStrings.Button_HideMap
      )

      // Hide the map of the service area
      await serviceAreaPage.Button_ToggleMap.Click()

      // verify map is not shown
      expect(await serviceAreaPage.IsServiceAreaMapDisplayed()).toBe(false)
      expect(await serviceAreaPage.Button_ToggleMap.GetText()).toBe(
        VendorPageStrings.Button_ViewMap
      )
    })

    test('Attached Vendors Table - Settings: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area Page
      const { global } = await Launch(browser, environment)
      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, serviceArea)
      await serviceAreaPage.NavigateDirectly()
      const table = serviceAreaPage.DataTable_AttachedVendors

      // Click the Open Table Settings button on the Attached Vendors Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await serviceAreaPage.page.waitForTimeout(1000)
    })

    test('Attached Vendors Table - Settings: Verify Columns', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area Page
      const { global } = await Launch(browser, environment)
      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, serviceArea)
      await serviceAreaPage.NavigateDirectly()
      const table = serviceAreaPage.DataTable_AttachedVendors

      // Click the Open Table Settings button on the Attached Vendors Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify that each column checkbox hides the corresponding table column when unchecked
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.AttachedVendors_VendorName)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.AttachedVendors_VendorName)).toBe(
        false
      )
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.AttachedVendors_InternalName)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.AttachedVendors_InternalName)).toBe(
        false
      )
      await tableSettingsDialog.UncheckColumn(
        DataTable_Columns_Type.AttachedVendors_HasMitigationAssignmentRulesAssigned
      )
      expect(
        await table.IsColumnVisible(
          DataTable_Columns_Type.AttachedVendors_HasMitigationAssignmentRulesAssigned
        )
      ).toBe(false)
      await tableSettingsDialog.UncheckColumn(
        DataTable_Columns_Type.AttachedVendors_HasClaimAssignmentRulesAssigned
      )
      expect(
        await table.IsColumnVisible(
          DataTable_Columns_Type.AttachedVendors_HasClaimAssignmentRulesAssigned
        )
      ).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.AttachedVendors_StartDate)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.AttachedVendors_StartDate)).toBe(
        false
      )
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.AttachedVendors_EndDate)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.AttachedVendors_EndDate)).toBe(
        false
      )

      // Verify that each column checkbox shows the corresponding table column when checked
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.AttachedVendors_VendorName)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.AttachedVendors_VendorName)).toBe(
        true
      )
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.AttachedVendors_InternalName)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.AttachedVendors_InternalName)).toBe(
        true
      )
      await tableSettingsDialog.CheckColumn(
        DataTable_Columns_Type.AttachedVendors_HasMitigationAssignmentRulesAssigned
      )
      expect(
        await table.IsColumnVisible(
          DataTable_Columns_Type.AttachedVendors_HasMitigationAssignmentRulesAssigned
        )
      ).toBe(true)
      await tableSettingsDialog.CheckColumn(
        DataTable_Columns_Type.AttachedVendors_HasClaimAssignmentRulesAssigned
      )
      expect(
        await table.IsColumnVisible(
          DataTable_Columns_Type.AttachedVendors_HasClaimAssignmentRulesAssigned
        )
      ).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.AttachedVendors_StartDate)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.AttachedVendors_StartDate)).toBe(
        true
      )
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.AttachedVendors_EndDate)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.AttachedVendors_EndDate)).toBe(true)
    })

    test('Attached Vendors Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area Page
      const { global } = await Launch(browser, environment)
      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, serviceArea)
      await serviceAreaPage.NavigateDirectly()
      const table = serviceAreaPage.DataTable_AttachedVendors

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyAttachedVendorsTableMessage)
        return
      }

      // Click the Open Table Search button on the Attached Vendors Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await serviceAreaPage.page.waitForTimeout(1000)
    })

    test('Attached Vendors Table - Global Search: Verify search', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, serviceArea)
      await serviceAreaPage.NavigateDirectly()
      const table = serviceAreaPage.DataTable_AttachedVendors
      const vendor = TestVendors.TestVendorC_WithRules

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyAttachedVendorsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields
      const nameSearchTerm = vendor.name
      await table.SetTableSearch(nameSearchTerm)
      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBe(1)

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      // and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      const nameFilteredOffRowCount = await table.VisibleRowCount()
      expect(nameFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      const internalNameSearchTerm = vendor.internalName
      const tableSearchDialog = await table.SetTableSearch(internalNameSearchTerm, true)

      // Verify table is filtered
      const internalNameFilteredRowCount = await table.VisibleRowCount()
      expect(internalNameFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const internalNameFilterOffRowCount = await table.VisibleRowCount()
      expect(internalNameFilterOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Attached Vendors Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area Page
      const { global } = await Launch(browser, environment)
      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, serviceArea)
      await serviceAreaPage.NavigateDirectly()
      const table = serviceAreaPage.DataTable_AttachedVendors

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyAttachedVendorsTableMessage)
        return
      }

      // Click the Add Table Filter button on the Attached Vendors table
      let tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.AttachedVendors_VendorName
      )

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await serviceAreaPage.Wait()

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.AttachedVendors_InternalName
      )
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Attached Vendors Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, serviceArea)
      await serviceAreaPage.NavigateDirectly()
      const table = serviceAreaPage.DataTable_AttachedVendors
      const vendor = TestVendors.TestVendorC_WithRules

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyAttachedVendorsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const nameFilter = vendor.name
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        nameFilter,
        DataTable_Columns_Type.AttachedVendors_VendorName
      )
      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(namePinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(false)
      const nameFilteredOffRowCount = await table.VisibleRowCount()
      expect(nameFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const internalNameFilter = vendor.internalName
      const { tableFilterDialog } = await table.SetTableFilter_Text(
        internalNameFilter,
        DataTable_Columns_Type.AttachedVendors_InternalName,
        false,
        true
      )

      // Verify table is filtered
      const internalNameFilteredRowCount = await table.VisibleRowCount()
      expect(internalNameFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const internalNameFilterOffRowCount = await table.VisibleRowCount()
      expect(internalNameFilterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Attached Vendors Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, serviceArea)
      await serviceAreaPage.NavigateDirectly()
      const table = serviceAreaPage.DataTable_AttachedVendors
      const vendor = TestVendors.TestVendorC_WithRules

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyAttachedVendorsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const nameFilter = vendor.name
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        nameFilter,
        DataTable_Columns_Type.AttachedVendors_VendorName
      )
      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedNameFilterTerm = 'No Match Expected'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedNameFilterTerm,
        DataTable_Columns_Type.AttachedVendors_VendorName,
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

    test('Attached Vendors Table - Expand and Collapse', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area Page
      const { global } = await Launch(browser, environment)
      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, serviceArea)
      await serviceAreaPage.NavigateDirectly()
      const table = serviceAreaPage.DataTable_AttachedVendors

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

    test('Attached Vendors Table - Sort Columns', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area Page
      const { global } = await Launch(browser, environment)

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, serviceArea)
      await serviceAreaPage.NavigateDirectly()
      const table = serviceAreaPage.DataTable_AttachedVendors

      // Examine Vendor Name and Start Date columns
      // Verify initial states are unsorted
      const initialVendorNameSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.AttachedVendors_VendorName
      )
      const initialStartDateSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.AttachedVendors_StartDate
      )
      expect(initialVendorNameSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(initialStartDateSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the Vendor Name column Sort icon to Down (high to low)
      await table.SetColumnSortState(
        DataTable_Columns_Type.AttachedVendors_VendorName,
        DataTable_Column_SortState.Down_HighToLow
      )

      // Verify Vendor Name is sorted Down and State is still unsorted
      let currentVendorNameSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.AttachedVendors_VendorName
      )
      let currentStartDateSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.AttachedVendors_StartDate
      )
      expect(currentVendorNameSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
      expect(currentStartDateSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the Start Date column Sort icon to Up (low to high)
      await table.SetColumnSortState(
        DataTable_Columns_Type.AttachedVendors_StartDate,
        DataTable_Column_SortState.Up_LowToHigh
      )

      // Verify Vendor Name is now unsorted and Start Date is sorted Up
      currentVendorNameSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.AttachedVendors_VendorName
      )
      currentStartDateSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.AttachedVendors_StartDate
      )
      expect(currentVendorNameSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(currentStartDateSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

      // Set the Start Date column Sort icon to Unsorted
      await table.SetColumnSortState(
        DataTable_Columns_Type.AttachedVendors_StartDate,
        DataTable_Column_SortState.Unsorted
      )
      currentStartDateSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.AttachedVendors_StartDate
      )
      expect(currentStartDateSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Verify HasRules columns cannot be sorted
      const hasMitigationAssignmentRulesAssignedSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.AttachedVendors_HasMitigationAssignmentRulesAssigned
      )
      const hasClaimAssignmentRulesAssignedSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.AttachedVendors_HasClaimAssignmentRulesAssigned
      )
      expect(hasMitigationAssignmentRulesAssignedSortState).toBe(
        DataTable_Column_SortState.NotSortable
      )
      expect(hasClaimAssignmentRulesAssignedSortState).toBe(DataTable_Column_SortState.NotSortable)
    })

    test('Attached Vendors Table - Verify Action Menus', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area Page
      const { global } = await Launch(browser, environment)
      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, serviceArea)
      await serviceAreaPage.NavigateDirectly()
      const table = serviceAreaPage.DataTable_AttachedVendors

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyAttachedVendorsTableMessage)
        return
      }

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)

      // Verify visibility of all the action menus for the table
      expect(
        await serviceAreaPage.IsAttachedVendorsActionMenuItemVisible(
          rowIndex,
          AttachedVendors_DataTable_ActionMenuItems.CreateCustomRule
        )
      ).toBe(true)

      expect(
        await serviceAreaPage.IsAttachedVendorsActionMenuItemVisible(
          rowIndex,
          AttachedVendors_DataTable_ActionMenuItems.UpdateVendorOverrides
        )
      ).toBe(true)

      expect(
        await serviceAreaPage.IsAttachedVendorsActionMenuItemVisible(
          rowIndex,
          AttachedVendors_DataTable_ActionMenuItems.UpdateRulesFromVendor
        )
      ).toBe(true)

      expect(
        await serviceAreaPage.IsAttachedVendorsActionMenuItemVisible(
          rowIndex,
          AttachedVendors_DataTable_ActionMenuItems.DetachVendor
        )
      ).toBe(true)
    })

    test('Attached Vendors Table - Verify Action Button: Go to Service Area & Vendor page', async ({
      browser,
    }) => {
      // launch the ClientPortal home page and go to the Service Area Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor = TestVendors.TestVendorA
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, serviceArea)
      await serviceAreaPage.NavigateDirectly()
      const table = serviceAreaPage.DataTable_AttachedVendors
      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyAttachedVendorsTableMessage)
        return
      }

      const serviceAreaAndVendorPage = await serviceAreaPage.ClickLinkToServiceAreaAndVendor(vendor)
      const endOfURL = `service-areas/${serviceArea.id}/vendors/${vendor.id}`
      expect(serviceAreaAndVendorPage.page.url().endsWith(endOfURL)).toBe(true)
    })

    test('Attached Vendors Table - Verify Action Button: Go to Vendor page', async ({
      browser,
    }) => {
      // launch the ClientPortal home page and go to the Service Area Page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors or service areas, we cannot perform this test
      if (await homePage.NoVendorsAndNoServiceAreas()) {
        AbortTest(AbortErrors.StaticVendorsAndOrServiceAreasDoNotExist)
        return
      }

      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const vendor = TestVendors.TestVendorA
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, serviceArea)
      await serviceAreaPage.NavigateDirectly()
      const table = serviceAreaPage.DataTable_AttachedVendors

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyAttachedVendorsTableMessage)
        return
      }

      const vendorPage = await serviceAreaPage.ClickLinkToVendor(vendor)
      const endOfURL = `vendors/${vendor.id}`
      expect(vendorPage.page.url().endsWith(endOfURL)).toBe(true)
    })

    test('Attached Vendors Table - Verify Action Menu: Create Custom Rule', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
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

      // Create a new custom rule for the vendor + service area
      const assignmentRuleGroup =
        VendorRuleSetsTuples.General_MitigationAssignmentRuleSet.ruleGroups[1]
      const rowIndex = '0'
      await serviceAreaPage.CreateCustomRule(rowIndex, assignmentRuleGroup)

      // Verify the rule is applied
      const serviceAreaAndVendorPage = await serviceAreaPage.ClickLinkToServiceAreaAndVendor(vendor)

      // just check if there is a rule in the Mitigation Assignments table, since it is a new Service Area
      const ruleCount =
        await serviceAreaAndVendorPage.MitigationAssignmentRules.DataTable_Rules.VisibleRowCount()
      expect(ruleCount).toBe(1)

      // Head back and remove the service area
      await serviceAreaAndVendorPage.Link_GotoServiceArea.Click()
      await serviceAreaPage.Action_RemoveServiceArea()

      // Verify we are now on the ServiceAreas page
      serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.Title.VerifyExpectedText()
    })

    test('Attached Vendors Table - Verify Action Menu: Update Vendor Overrides', async ({
      browser,
    }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If the are no static vendors, we cannot perform this test
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
      const areaNameFilteredRowCount =
        await serviceAreaPage.DataTable_AttachedVendors.VisibleRowCount()
      expect(areaNameFilteredRowCount).toBe(1)

      // Update the overrides for this vendor
      const rowIndex = '0'
      const overrides = TestVendors.TestVendor_Template_Overrides_Empty
      overrides.internalName = `${vendor.internalName}_OVERRIDE`
      await serviceAreaPage.UpdateVendorOverridesByIndex(rowIndex, null, null, overrides)

      // Verify the changes
      const serviceAreaAndVendorPage = await serviceAreaPage.ClickLinkToServiceAreaAndVendor(vendor)
      serviceAreaAndVendorPage.overrides = overrides
      expect(await serviceAreaAndVendorPage.IsTemporaryAssignmentSectionVisible()).toBe(false)
      await serviceAreaAndVendorPage.ValidateVendorInfo()
      await serviceAreaAndVendorPage.ValidateOriginalValuesThatWereOverriden()

      await serviceAreaAndVendorPage.Link_GotoServiceArea.Click()
      await serviceAreaPage.Action_RemoveServiceArea()
    })

    test('Attached Vendors Table - Verify Action Menu: Update Rules From Vendor', async ({
      browser,
    }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
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

      // Update Rules From Vendor
      const rowIndex = '0'
      await serviceAreaPage.UpdateRulesFromVendor_SelectAll(rowIndex, vendor)

      // Verify the rules are applied
      const serviceAreaAndVendorPage = await serviceAreaPage.ClickLinkToServiceAreaAndVendor(vendor)

      // just check if the rule count in the assignment tables, since it is a new Service Area
      const claimRuleCount =
        await serviceAreaAndVendorPage.ClaimAssignmentRules.DataTable_Rules.VisibleRowCount()
      expect(claimRuleCount).toBe(2)
      const mitigationRuleCount =
        await serviceAreaAndVendorPage.MitigationAssignmentRules.DataTable_Rules.VisibleRowCount()
      expect(mitigationRuleCount).toBe(2)

      await serviceAreaAndVendorPage.Link_GotoVendor.Click()

      // Head back and remove the service area
      await serviceAreaAndVendorPage.Link_GotoServiceArea.Click()
      await serviceAreaPage.Action_RemoveServiceArea()

      // Verify we are now on the ServiceAreas page
      serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.Title.VerifyExpectedText()
    })

    test('Attached Vendors Table - Verify Action Menu: Detach Vendor', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      //If the are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const serviceAreaPrefix = 'AA_TESTSERVICEAREA'
      const dateSuffix = `+${Date.now()}`
      const vendor = TestVendors.TestVendorA

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

      // Detach the vendor
      const rowIndex = '0'
      await serviceAreaPage.DetachVendor(rowIndex)
      await serviceAreaPage.Wait(5000)

      // Verify the Attached Vendors table is now empty and in the Getting Started mode
      expect(await serviceAreaPage.IsAttachedVendorsEmpty()).toBe(true)

      // remove service area
      await serviceAreaPage.Action_RemoveServiceArea()

      // make sure we are back on the Vendors page
      await serviceAreasPage.VerifyTitle()
    })

    test('Attached Vendors Table - Attach Vendor', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If the are no static vendors, we cannot perform this test
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
      await serviceAreaPage.AttachedVendors_AddExistingVendorToServiceArea(vendor)

      // Verify attachment
      await serviceAreaPage.DataTable_AttachedVendors.SetTableFilter_Text(
        vendor.name,
        DataTable_Columns_Type.AttachedVendors_VendorName
      )
      const areaNameFilteredRowCount =
        await serviceAreaPage.DataTable_AttachedVendors.VisibleRowCount()
      expect(areaNameFilteredRowCount).toBe(1)

      await serviceAreaPage.Action_RemoveServiceArea()

      // Verify we are now on the ServiceAreas page
      serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.Title.VerifyExpectedText()
    })

    test('Actions - Copy Service Area ID', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Area Page
      const { global } = await Launch(browser, environment)
      const serviceArea: ServiceArea = TestServiceAreas.TestServiceArea_Attachments
      const serviceAreaPage = new ClientPortalServiceAreaPage(global, serviceArea)
      await serviceAreaPage.NavigateDirectly()

      await serviceAreaPage.Action_CopyServiceAreaID()
      const copiedID = await serviceAreaPage.GetClipboardText()

      // Verify clipboard contains the vendor ID we expect
      expect(copiedID).toBe(serviceArea.id)
    })

    test('Actions - Update/Remove Service Area', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global } = await Launch(browser, environment)
      const serviceAreaPrefix = 'AA_TESTSERVICEAREA'
      const dateSuffix = `+${Date.now()}`

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

      // Setup and edit Service Area
      const updateServiceArea = deepCopy(newServiceArea)
      updateServiceArea.name = `${newServiceAreaName}+EDITED`
      await serviceAreaPage.Action_UpdateServiceArea(updateServiceArea)
      serviceAreaPage.serviceArea = updateServiceArea

      // Verify changes are visible
      await serviceAreaPage.Wait(2000)
      await serviceAreaPage.ValidateServiceAreaDetails()

      // Remove edited service area
      await serviceAreaPage.Action_RemoveServiceArea(updateServiceArea.name)

      // Verify we are back on the Service Areas page
      await serviceAreasPage.Title.VerifyExpectedText()
    })

    test('Actions - Add Vendor to Service Area', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendor Page
      const { global, homePage } = await Launch(browser, environment)

      // If the are no static vendors, we cannot perform this test
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
      const serviceAreaPage = await serviceAreasPage.ClickLinkToServiceArea(newServiceArea)

      // Attach the service area to an existing vendor
      await serviceAreaPage.Action_AddExistingVendorToServiceArea(vendor)

      // Verify attachment
      await serviceAreaPage.DataTable_AttachedVendors.SetTableFilter_Text(
        vendor.name,
        DataTable_Columns_Type.AttachedVendors_VendorName
      )
      const areaNameFilteredRowCount =
        await serviceAreaPage.DataTable_AttachedVendors.VisibleRowCount()
      expect(areaNameFilteredRowCount).toBe(1)

      await serviceAreaPage.Action_RemoveServiceArea()

      // Verify we are now on the ServiceAreas page
      serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.Title.VerifyExpectedText()
    })
  }
)
