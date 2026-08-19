import { expect } from '@playwright/test'
import {
  AbortErrors,
  CountyTuples,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
  ServiceAreas_DataTable_ActionMenuItems,
  TestServiceAreas,
  TestVendors,
  VendorRuleSetsTuples,
} from '../../library/clientPortal/clientPortalConstants.js'
import { AbortTest, Launch, deepCopy } from '../../library/clientPortal/clientPortalHelper.js'
import { ClientPortalLocation } from '../../library/clientPortal/clientPortalLocation.js'
import { ServiceArea } from '../../library/clientPortal/clientPortalServiceArea.js'
import { Vendor } from '../../library/clientPortal/clientPortalVendor.js'
import { ClientPortalServiceAreaAndVendorPage } from '../../library/clientPortal/pages/clientPortalServiceAreaAndVendorPage.js'
import { ClientPortalServiceAreasPage } from '../../library/clientPortal/pages/clientPortalServiceAreasPage.js'
import { ClientPortalVendorsPage } from '../../library/clientPortal/pages/clientPortalVendorsPage.js'
import { Tags } from '../../library/shared/constants.js'
import test from '../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Service Areas Page',
  {
    tag: [Tags.ClientPortal, Tags.ServiceAreas],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the ClientPortal home page
      const { global, homePage } = await Launch(browser, environment)

      // Verify navigation from Home page
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await homePage.Link_GoToServiceAreas.Click()
      const table = serviceAreasPage.DataTable_ServiceAreas

      // Verify page layout
      await serviceAreasPage.VerifyTitle()
      // Verify Service Areas Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Service Areas Table layout...
      // Verify Service Areas Table Settings, Filters and Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)

      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // if table is not empty then verify Global Search Button
      if (!(await table.IsEmpty())) {
        await table.Button_OpenTableSearch.locator.waitFor({ state: 'visible' })
      }
    })

    test('Service Areas Table - Settings: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      const table = serviceAreasPage.DataTable_ServiceAreas

      // Click the Open Table Settings button on the Service Areas Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await serviceAreasPage.page.waitForTimeout(1000)
    })

    test('Service Areas Table - Settings: Verify Columns', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      const table = serviceAreasPage.DataTable_ServiceAreas

      // Click the Open Table Settings button on the Service Areas Table
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

    test('Service Areas Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      const table = serviceAreasPage.DataTable_ServiceAreas

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyServiceAreasTableMessage)
        return
      }

      // Click the Open Table Search button on the Service Areas Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await serviceAreasPage.page.waitForTimeout(1000)
    })

    test('Service Areas Table - Global Search: Verify search', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      const table = serviceAreasPage.DataTable_ServiceAreas
      const serviceArea = TestServiceAreas.TestEasternWashington

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyServiceAreasTableMessage)
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

    test('Service Areas Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      const table = serviceAreasPage.DataTable_ServiceAreas

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyServiceAreasTableMessage)
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
      await serviceAreasPage.Wait()

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.ServiceAreas_State)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Service Areas Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      const table = serviceAreasPage.DataTable_ServiceAreas
      const serviceArea = TestServiceAreas.TestEasternWashington

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyServiceAreasTableMessage)
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

    test('Service Areas Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      const table = serviceAreasPage.DataTable_ServiceAreas
      const serviceArea = TestServiceAreas.TestEasternWashington

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyServiceAreasTableMessage)
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

    test('Service Areas Table - Expand and Collapse', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      const table = serviceAreasPage.DataTable_ServiceAreas

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

    test('Service Areas Table - Sort Columns', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      const table = serviceAreasPage.DataTable_ServiceAreas

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

    test('Service Areas Table - Verify Action Menus', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      const table = serviceAreasPage.DataTable_ServiceAreas

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyServiceAreasTableMessage)
        return
      }

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)

      // Verify visibility of all the action menus for the table
      expect(
        await serviceAreasPage.IsActionMenuItemVisible(
          rowIndex,
          ServiceAreas_DataTable_ActionMenuItems.CopyServiceAreaID
        )
      ).toBe(true)

      expect(
        await serviceAreasPage.IsActionMenuItemVisible(
          rowIndex,
          ServiceAreas_DataTable_ActionMenuItems.UpdateServiceArea
        )
      ).toBe(true)

      expect(
        await serviceAreasPage.IsActionMenuItemVisible(
          rowIndex,
          ServiceAreas_DataTable_ActionMenuItems.AddVendorToServiceArea
        )
      ).toBe(true)

      expect(
        await serviceAreasPage.IsActionMenuItemVisible(
          rowIndex,
          ServiceAreas_DataTable_ActionMenuItems.RemoveServiceArea
        )
      ).toBe(true)
    })

    test('Service Areas Table -  Verify Action Menu: Copy Service Area ID', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      const table = serviceAreasPage.DataTable_ServiceAreas
      const serviceArea = TestServiceAreas.TestEasternWashington

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyServiceAreasTableMessage)
        return
      }

      // filter for the service area
      const areaNameFilter = serviceArea.name
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        areaNameFilter,
        DataTable_Columns_Type.ServiceAreas_AreaName
      )

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await serviceAreasPage.SelectActionMenuItem(
        rowIndex,
        ServiceAreas_DataTable_ActionMenuItems.CopyServiceAreaID
      )
      const copiedID = await serviceAreasPage.GetClipboardText()

      // Verify clipboard contains the service area ID we expect
      expect(copiedID).not.toBe('')
      expect(copiedID).toBe(serviceArea.id)

      await table.CancelPinnedTableFilter(namePinnedFilter)
    })

    test('Service Areas Table -  Verify Action Button: Goto Service Area Page', async ({
      browser,
    }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      const table = serviceAreasPage.DataTable_ServiceAreas
      const serviceArea = TestServiceAreas.TestEasternWashington

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyServiceAreasTableMessage)
        return
      }

      // filter for the service area
      const areaNameFilter = serviceArea.name
      await table.SetTableFilter_Text(areaNameFilter, DataTable_Columns_Type.ServiceAreas_AreaName)

      const serviceAreaPage = await serviceAreasPage.ClickLinkToServiceArea(serviceArea)
      expect(serviceAreaPage.page.url().endsWith(serviceArea.id)).toBe(true)
    })

    test('Create Service Area - Verify Drawer UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()

      let createServiceAreaDrawer = await serviceAreasPage.OpenCreateServiceAreaDrawer()

      // Verify drawer heading is "Create Service Area"
      createServiceAreaDrawer.Title.VerifyExpectedText()

      // Verify drawer closes with click on "X" button
      await createServiceAreaDrawer.Button_Close_X.Click()
      await expect(createServiceAreaDrawer.Title.locator).not.toBeAttached()
      await serviceAreasPage.Wait()

      createServiceAreaDrawer = await serviceAreasPage.OpenCreateServiceAreaDrawer()

      // Verify drawer closes with ESC key
      await createServiceAreaDrawer.Close(true)
      await expect(createServiceAreaDrawer.Title.locator).not.toBeAttached()
      await serviceAreasPage.Wait()

      createServiceAreaDrawer = await serviceAreasPage.OpenCreateServiceAreaDrawer()

      // Verify drawer closes if click on Close
      await createServiceAreaDrawer.Close()
      await expect(createServiceAreaDrawer.Title.locator).not.toBeAttached()
      await serviceAreasPage.Wait()
    })

    test('Create Service Area - Validate Drawer', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Service Areas Page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()

      const createServiceAreaDrawer = await serviceAreasPage.OpenCreateServiceAreaDrawer()

      // Click the Submit button
      await createServiceAreaDrawer.Button_Submit.Click()
      await serviceAreasPage.Wait()

      // Verify validation messages for required fields
      expect(await createServiceAreaDrawer.Validate()).toBe(true)

      // Close the drawer
      await createServiceAreaDrawer.Close()
    })

    test('Create/Update/Delete ServiceArea', async ({ browser }) => {
      // launch the ClientPortal home page and go to ServiceAreas page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      const dateSuffix = `+${Date.now()}`
      const serviceAreaPrefix = 'AA_TESTSERVICEAREA'

      // Clear any old service areas from failed tests
      await serviceAreasPage.FindAndRemoveOldTimestampedServiceAreas(serviceAreaPrefix)

      // Setup and create new service area
      const newServiceAreaName = `${serviceAreaPrefix}${dateSuffix}`
      const newServiceArea = TestServiceAreas.TestServiceArea_Template_New as ServiceArea
      newServiceArea.name = newServiceAreaName
      newServiceArea.countiesToAdd.push(CountyTuples.WA_Spokane as ClientPortalLocation)
      await serviceAreasPage.AddServiceArea(newServiceArea)

      // Setup and edit service area
      const updateServiceArea = deepCopy(newServiceArea)
      updateServiceArea.name = `${newServiceAreaName}+EDITED`
      await serviceAreasPage.FindAndEditServiceAreaByName(newServiceArea.name, updateServiceArea)

      // Remove edited service area
      await serviceAreasPage.FindAndRemoveServiceAreaByName(updateServiceArea.name)
    })

    test('Add Existing Vendor to Service Area - No Overrides, No Rules', async ({ browser }) => {
      // launch the ClientPortal home page and go to ServiceAreas page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      const dateSuffix = `+${Date.now()}`
      const serviceAreaPrefix = 'AA_TESTSERVICEAREA'

      // Clear any old service areas from failed tests
      await serviceAreasPage.FindAndRemoveOldTimestampedServiceAreas(serviceAreaPrefix)

      // Setup and create new service area
      const newServiceAreaName = `${serviceAreaPrefix}${dateSuffix}`
      const newServiceArea = TestServiceAreas.TestServiceArea_Template_New as ServiceArea
      newServiceArea.name = newServiceAreaName
      newServiceArea.countiesToAdd.push(CountyTuples.WA_Spokane as ClientPortalLocation)
      await serviceAreasPage.AddServiceArea(newServiceArea)

      // add existing vendor to service area
      const { index, pinnedFilter } = await serviceAreasPage.FindServiceAreaByName(
        newServiceArea.name
      )
      const vendor = TestVendors.TestVendorA
      await serviceAreasPage.AddExistingVendorToServiceAreaByIndex(index, newServiceArea, vendor)
      await serviceAreasPage.DataTable_ServiceAreas.CancelPinnedTableFilter(pinnedFilter)

      // Remove Attached Service Area
      await serviceAreasPage.FindAndRemoveServiceAreaByName(newServiceArea.name)
    })

    test('Add New Vendor to Service Area - No Overrides, No Rules', async ({ browser }) => {
      // launch the ClientPortal home page and go to ServiceAreas page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      const dateSuffix = `+${Date.now()}`
      const serviceAreaPrefix = 'AA_TESTSERVICEAREA'
      const vendorPrefix = 'AA_TESTVENDOR'

      // Clear any old service areas from failed tests
      await serviceAreasPage.FindAndRemoveOldTimestampedServiceAreas(serviceAreaPrefix)

      // Setup and create new service area
      const newServiceAreaName = `${serviceAreaPrefix}${dateSuffix}`
      const newServiceArea = TestServiceAreas.TestServiceArea_Template_New as ServiceArea
      newServiceArea.name = newServiceAreaName
      newServiceArea.countiesToAdd.push(CountyTuples.WA_Spokane as ClientPortalLocation)
      await serviceAreasPage.AddServiceArea(newServiceArea)

      // Setup for a new vendor
      const vendorName = `${vendorPrefix}${dateSuffix}`
      const vendor = TestVendors.TestVendor_Template_New
      vendor.name = vendorName

      // add new vendor to service area
      const { index, pinnedFilter } = await serviceAreasPage.FindServiceAreaByName(
        newServiceArea.name
      )
      await serviceAreasPage.AddNewVendorToServiceAreaByIndex(index, newServiceArea, vendor)
      await serviceAreasPage.DataTable_ServiceAreas.CancelPinnedTableFilter(pinnedFilter)

      // Remove Attached Service Area
      await serviceAreasPage.FindAndRemoveServiceAreaByName(newServiceArea.name)

      // Remove vendor
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      await vendorsPage.FindAndDeleteVendorByName(vendor.name)
    })

    test('Add Existing Vendor to Service Area - Overrides, No Rules', async ({ browser }) => {
      // launch the ClientPortal home page and go to ServiceAreas page
      const { global } = await Launch(browser, environment)
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      const dateSuffix = `+${Date.now()}`
      const serviceAreaPrefix = 'AA_TESTSERVICEAREA'
      const startDate = '2024-01-01'
      const startDateFormatted = '01/01/2024'
      const endDate = '2024-12-31'
      const endDateFormatted = '12/31/2024'

      // Clear any old service areas from failed tests
      await serviceAreasPage.FindAndRemoveOldTimestampedServiceAreas(serviceAreaPrefix)

      // Setup and create new service area
      const newServiceAreaName = `${serviceAreaPrefix}${dateSuffix}`
      const newServiceArea = TestServiceAreas.TestServiceArea_Template_New as ServiceArea
      newServiceArea.name = newServiceAreaName
      newServiceArea.countiesToAdd.push(CountyTuples.WA_Spokane as ClientPortalLocation)
      await serviceAreasPage.AddServiceArea(newServiceArea)

      // add existing vendor to service area
      const { index } = await serviceAreasPage.FindServiceAreaByName(newServiceArea.name)
      await serviceAreasPage.UpdateServiceAreaIdAsNeeded(newServiceArea)
      const vendor = TestVendors.TestVendorA
      const overrides = TestVendors.TestVendor_Template_Overrides
      await serviceAreasPage.AddExistingVendorToServiceAreaByIndex(
        index,
        newServiceArea,
        vendor,
        startDate,
        endDate,
        overrides
      )

      // Verify dates and overrides over on the Service+Vendor page
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(
        global,
        newServiceArea,
        vendor,
        overrides
      )
      await serviceAreaAndVendorPage.NavigateDirectly()
      await serviceAreaAndVendorPage.ValidateTemporaryAssignmentDates(
        startDateFormatted,
        endDateFormatted
      )
      await serviceAreaAndVendorPage.ValidateVendorInfo()
      await serviceAreaAndVendorPage.ValidateOriginalValuesThatWereOverriden()

      // Jump back and remove service area from the Service Areas page
      await serviceAreasPage.NavigateToPage(true)
      await serviceAreasPage.FindAndRemoveServiceAreaByName(newServiceArea.name)
    })

    test('Add Existing Vendor to Service Area - Overrides, Apply Rules', async ({ browser }) => {
      // launch the ClientPortal home page and go to ServiceAreas page
      const { global, homePage } = await Launch(browser, environment)

      // If there are no static vendors, we cannot perform this test
      if (await homePage.NoVendors()) {
        AbortTest(AbortErrors.StaticVendorsDoNotExist)
        return
      }

      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      const dateSuffix = `+${Date.now()}`
      const serviceAreaPrefix = 'AA_TESTSERVICEAREA'

      // Clear any old service areas from failed tests
      await serviceAreasPage.FindAndRemoveOldTimestampedServiceAreas(serviceAreaPrefix)

      // Setup and create new service area
      const newServiceAreaName = `${serviceAreaPrefix}${dateSuffix}`
      const newServiceArea = TestServiceAreas.TestServiceArea_Template_New as ServiceArea
      newServiceArea.name = newServiceAreaName
      newServiceArea.countiesToAdd.push(CountyTuples.WA_Spokane as ClientPortalLocation)
      await serviceAreasPage.AddServiceArea(newServiceArea)

      // setup the vendor
      const vendor: Vendor = TestVendors.TestVendorC_WithRules
      vendor.ruleTest = VendorRuleSetsTuples.VendorC_ClaimAssignmentRuleSet.ruleGroups[0]

      // find the service area
      const { index } = await serviceAreasPage.FindServiceAreaByName(newServiceArea.name)
      await serviceAreasPage.UpdateServiceAreaIdAsNeeded(newServiceArea)

      // Attach vendor to Service Area, applying Rules
      await serviceAreasPage.AddExistingVendorToServiceAreaByIndex(index, newServiceArea, vendor)

      // Verify added Rule shows up on ServiceAndVendor page
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(
        global,
        newServiceArea,
        vendor
      )
      await serviceAreaAndVendorPage.NavigateDirectly()
      const foundMatchIndex =
        await serviceAreaAndVendorPage.ClaimAssignmentRules.FindMatchingRuleGroup(
          VendorRuleSetsTuples.VendorC_ClaimAssignmentRuleSet.ruleGroups[0]
        )
      expect(foundMatchIndex).not.toBe(null)

      // Jump back and remove service area from the Service Areas page
      await serviceAreasPage.NavigateToPage(true)
      await serviceAreasPage.FindAndRemoveServiceAreaByName(newServiceArea.name)
    })
  }
)
