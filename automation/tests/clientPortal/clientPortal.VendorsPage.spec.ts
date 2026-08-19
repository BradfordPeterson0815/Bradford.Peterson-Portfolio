import { expect } from '@playwright/test'
import {
  AbortErrors,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
  StateTuples,
  TestServiceAreas,
  TestVendors,
  VendorRuleSetsTuples,
  Vendors_DataTable_ActionMenuItems,
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
  'Vendors Page',
  {
    tag: [Tags.ClientPortal, Tags.Vendors],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the ClientPortal home page
      const { global, homePage } = await Launch(browser, environment)

      // Verify navigation from Home page
      const vendorsPage = new ClientPortalVendorsPage(global)
      await homePage.Link_GoToVendors.Click()
      const table = vendorsPage.DataTable_Vendors

      // Verify page layout
      await vendorsPage.VerifyTitle()
      // Verify Vendors Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Vendors Table layout...
      // Verify Vendors Table Settings, Filters and Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)

      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // if table is not empty then verify Global Search Button
      if (!(await table.IsEmpty())) {
        await table.Button_OpenTableSearch.locator.waitFor({ state: 'visible' })
      }
    })

    test('Vendors Table: Settings - Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const table = vendorsPage.DataTable_Vendors

      // Click the Open Table Settings button on the Vendors Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await vendorsPage.page.waitForTimeout(1000)
    })

    test('Vendors Table - Settings: Verify Columns', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const table = vendorsPage.DataTable_Vendors

      // Click the Open Table Settings button on the Vendors Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify that each column checkbox hides the corresponding table column when unchecked
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Vendors_Name)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Vendors_Name)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Vendors_Enabled)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Vendors_Enabled)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Vendors_Website)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Vendors_Website)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Vendors_DisplayPhone)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Vendors_DisplayPhone)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Vendors_DisplayEmail)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Vendors_DisplayEmail)).toBe(false)

      // Verify that each column checkbox shows the corresponding table column when checked
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Vendors_Name)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Vendors_Name)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Vendors_Enabled)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Vendors_Enabled)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Vendors_Website)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Vendors_Website)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Vendors_DisplayPhone)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Vendors_DisplayPhone)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Vendors_DisplayEmail)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Vendors_DisplayEmail)).toBe(true)
    })

    test('Vendors Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const table = vendorsPage.DataTable_Vendors

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyVendorsTableMessage)
        return
      }

      // Click the Open Table Search button on the Vendors Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await vendorsPage.page.waitForTimeout(1000)
    })

    test('Vendors Table - Global Search: Verify search', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const table = vendorsPage.DataTable_Vendors

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyVendorsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()
      const vendorA: Vendor = TestVendors.TestVendorA

      // Verify setting search input causes the table results to filter across all text fields
      const nameSearchTerm = vendorA.name
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
      const websiteSearchTerm = 'NoMatch.com'
      const tableSearchDialog = await table.SetTableSearch(websiteSearchTerm, true)

      // Verify table is filtered
      const websiteFilteredRowCount = await table.VisibleRowCount()
      expect(websiteFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const websiteFilterOffRowCount = await table.VisibleRowCount()
      expect(websiteFilterOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Vendors Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const table = vendorsPage.DataTable_Vendors

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorsTableMessage)
        return
      }

      // Click the Add Table Filter button on the Vendors Table
      let tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Vendors_Name)

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await vendorsPage.Wait()

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Vendors_Name)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Vendors Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const table = vendorsPage.DataTable_Vendors

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()
      const vendorA: Vendor = TestVendors.TestVendorA

      // Verify setting the filter causes the table results to filter on the selected column only
      const nameFilter = vendorA.name
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        nameFilter,
        DataTable_Columns_Type.Vendors_Name
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
      const phoneFilter = vendorA.displayPhone
      const { tableFilterDialog } = await table.SetTableFilter_Text(
        phoneFilter,
        DataTable_Columns_Type.Vendors_DisplayPhone,
        false,
        true
      )

      // Verify table is filtered
      const phoneFilteredRowCount = await table.VisibleRowCount()
      expect(phoneFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const phoneFilterOffRowCount = await table.VisibleRowCount()
      expect(phoneFilterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Vendors Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const table = vendorsPage.DataTable_Vendors

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()
      const vendorA: Vendor = TestVendors.TestVendorA
      const vendorB: Vendor = TestVendors.TestVendorB

      // Verify setting the filter causes the table results to filter on the selected column only
      const nameFilter = vendorA.name
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        nameFilter,
        DataTable_Columns_Type.Vendors_Name
      )
      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedNameFilterTerm = vendorB.name
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedNameFilterTerm,
        DataTable_Columns_Type.Vendors_Name,
        true
      )

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(editedPinnedFilter)).toBe(true)

      // Verify table is filtered and 1 row is visible
      const editedFilteredRowCount = await table.VisibleRowCount()
      expect(editedFilteredRowCount).toBe(1)

      // Verify clicking X button on the edited pinned filter removes it and clears the filter
      await table.CancelPinnedTableFilter(editedPinnedFilter)

      // Verify table is not filtered and all rows are visible
      const clearedRowCount = await table.VisibleRowCount()
      expect(clearedRowCount).toBe(initialRowCount)
    })

    test('Vendors Table - Expand and Collapse', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const table = vendorsPage.DataTable_Vendors

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

    test('Vendors Table - Sort Columns', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const table = vendorsPage.DataTable_Vendors

      // Examine Name and Website columns
      // Verify initial states are unsorted
      const initialNameSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Vendors_Name
      )
      const initialWebsiteSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Vendors_Website
      )
      expect(initialNameSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(initialWebsiteSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the Name column Sort icon to Down (high to low)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Vendors_Name,
        DataTable_Column_SortState.Down_HighToLow
      )

      // Verify Name is sorted Down and Website is still unsorted
      let currentNameSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Vendors_Name
      )
      let currentWebsiteSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Vendors_Website
      )
      expect(currentNameSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
      expect(currentWebsiteSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the Website column Sort icon to Up (low to high)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Vendors_Website,
        DataTable_Column_SortState.Up_LowToHigh
      )

      // Verify Name is now unsorted and Website is sorted Up
      currentNameSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Vendors_Name)
      currentWebsiteSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Vendors_Website
      )
      expect(currentNameSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(currentWebsiteSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

      // Set the Website column Sort icon to Unsorted
      await table.SetColumnSortState(
        DataTable_Columns_Type.Vendors_Website,
        DataTable_Column_SortState.Unsorted
      )
      currentWebsiteSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Vendors_Website
      )
      expect(currentWebsiteSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Verify Enabled cannot be sorted
      const enabledSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Vendors_Enabled
      )
      expect(enabledSortState).toBe(DataTable_Column_SortState.NotSortable)
    })

    test('Vendors Table - Verify Action Menus', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const table = vendorsPage.DataTable_Vendors

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorsTableMessage)
        return
      }

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)

      // Verify visibility of all the action menus for the table
      expect(
        await vendorsPage.IsActionMenuItemVisible(
          rowIndex,
          Vendors_DataTable_ActionMenuItems.CopyVendorID
        )
      ).toBe(true)

      expect(
        await vendorsPage.IsActionMenuItemVisible(
          rowIndex,
          Vendors_DataTable_ActionMenuItems.UpdateVendor
        )
      ).toBe(true)

      expect(
        await vendorsPage.IsActionMenuItemVisible(
          rowIndex,
          Vendors_DataTable_ActionMenuItems.AttachVendorToServiceArea
        )
      ).toBe(true)

      expect(
        await vendorsPage.IsActionMenuItemVisible(
          rowIndex,
          Vendors_DataTable_ActionMenuItems.CreateRule
        )
      ).toBe(true)

      expect(
        await vendorsPage.IsActionMenuItemVisible(
          rowIndex,
          Vendors_DataTable_ActionMenuItems.RemoveVendor
        )
      ).toBe(true)
    })

    test('Vendors Table -  Verify Action Menu: Copy Vendor ID', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const table = vendorsPage.DataTable_Vendors

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorsTableMessage)
        return
      }

      const vendorA: Vendor = TestVendors.TestVendorA
      // filter for the vendor
      const nameFilter = vendorA.name
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        nameFilter,
        DataTable_Columns_Type.Vendors_Name
      )

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await vendorsPage.SelectActionMenuItem(
        rowIndex,
        Vendors_DataTable_ActionMenuItems.CopyVendorID
      )
      const copiedID = await vendorsPage.GetClipboardText()

      // Verify clipboard contains the vendor ID we expect
      expect(copiedID).not.toBe('')
      expect(copiedID).toBe(vendorA.id)

      await table.CancelPinnedTableFilter(namePinnedFilter)
    })

    test('Vendors Table -  Verify Action Button: Goto Vendor Page', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const table = vendorsPage.DataTable_Vendors

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorsTableMessage)
        return
      }

      const vendorA: Vendor = TestVendors.TestVendorA
      // filter for the vendor
      const nameFilter = vendorA.name
      await table.SetTableFilter_Text(nameFilter, DataTable_Columns_Type.Vendors_Name)
      const vendorPage = await vendorsPage.ClickLinkToVendor(vendorA)
      expect(vendorPage.page.url().endsWith(vendorA.id)).toBe(true)
    })

    test('Create Vendor - Verify Drawer UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()

      let createVendorDrawer = await vendorsPage.OpenCreateVendorDrawer()

      // Verify drawer heading is "Create Vendor"
      createVendorDrawer.Title.VerifyExpectedText()

      // Verify drawer closes with click on "X" button
      await createVendorDrawer.Button_Close_X.Click()
      await expect(createVendorDrawer.Title.locator).not.toBeAttached()
      await vendorsPage.Wait()

      createVendorDrawer = await vendorsPage.OpenCreateVendorDrawer()

      // Verify drawer closes with ESC key
      await createVendorDrawer.Close(true)
      await expect(createVendorDrawer.Title.locator).not.toBeAttached()
      await vendorsPage.Wait()

      createVendorDrawer = await vendorsPage.OpenCreateVendorDrawer()

      // Verify drawer closes if click on Close
      await createVendorDrawer.Close()
      await expect(createVendorDrawer.Title.locator).not.toBeAttached()
      await vendorsPage.Wait()
    })

    test('Create Vendor - Validate Drawer', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()

      const createVendorDrawer = await vendorsPage.OpenCreateVendorDrawer()

      // Click the Submit button
      await createVendorDrawer.Button_Submit.Click()
      await vendorsPage.Wait()

      // Verify validation messages for required fields
      expect(await createVendorDrawer.ValidateBasic()).toBe(true)

      // start adding a property
      await createVendorDrawer.Button_AddAdditionalProperty.Click()

      // Click the Submit button to cause validation
      await createVendorDrawer.Button_Submit.Click()

      expect(await createVendorDrawer.ValidateAdditionalProperties()).toBe(true)

      // Close the drawer
      await createVendorDrawer.Close()
    })

    test('Create/Update/Delete Vendor', async ({ browser }) => {
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

      // Setup and edit vendor
      const updateVendor = deepCopy(newVendor)
      updateVendor.name = `${newVendorName}+EDITED`
      await vendorsPage.FindAndEditVendorByName(newVendor.name, updateVendor)

      // Remove edited vendor
      await vendorsPage.FindAndDeleteVendorByName(updateVendor.name)
    })

    test('Attach Vendor to Existing Service Area - No Overrides, No Rules', async ({ browser }) => {
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

      // Attach vendor to service area
      const { index, pinnedFilter } = await vendorsPage.FindVendorByName(vendor.name)
      const serviceArea = TestServiceAreas.TestEasternWashington
      await vendorsPage.AttachVendorToExistingServiceAreaByIndex(index, serviceArea, vendor)
      await vendorsPage.DataTable_Vendors.CancelPinnedTableFilter(pinnedFilter)

      // Remove attached vendor
      await vendorsPage.FindAndDeleteVendorByName(vendor.name)
    })

    test('Attach Vendor to New Service Area - No Overrides, No Rules', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const dateSuffix = `+${Date.now()}`
      const vendorPrefix = 'AA_TESTVENDOR'
      const serviceAreaPrefix = 'AA_TESTSERVICEAREA'

      // Clear any old vendors from failed tests
      await vendorsPage.FindAndDeleteOldTimestampedVendors(vendorPrefix)

      // Setup and create new vendor
      const vendorName = `${vendorPrefix}${dateSuffix}`
      const vendor = TestVendors.TestVendor_Template_New
      vendor.name = vendorName
      await vendorsPage.AddVendor(vendor)

      // Setup for a new service area
      const newServiceAreaName = `${serviceAreaPrefix}${dateSuffix}`
      const newServiceArea = TestServiceAreas.TestServiceArea_Template_New as ServiceArea
      newServiceArea.name = newServiceAreaName
      newServiceArea.stateToAdd.push(StateTuples.WA_Washington as ClientPortalLocation)

      // Attach vendor to a new service area
      const { index, pinnedFilter } = await vendorsPage.FindVendorByName(vendor.name)
      await vendorsPage.AttachVendorToNewServiceAreaByIndex(index, newServiceArea, vendor)
      await vendorsPage.DataTable_Vendors.CancelPinnedTableFilter(pinnedFilter)

      // Remove attached vendor
      await vendorsPage.FindAndDeleteVendorByName(vendor.name)

      // Remove ServiceArea
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()

      // Remove edited service area
      await serviceAreasPage.FindAndRemoveServiceAreaByName(newServiceArea.name)
    })

    test('Attach Vendor to Existing Service Area - Overrides, No Rules', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const dateSuffix = `+${Date.now()}`
      const vendorPrefix = 'AA_TESTVENDOR'
      const startDate = '2024-01-01'
      const startDateFormatted = '01/01/2024'
      const endDate = '2024-12-31'
      const endDateFormatted = '12/31/2024'

      // Clear any old vendors from failed tests
      await vendorsPage.FindAndDeleteOldTimestampedVendors(vendorPrefix)

      // Setup and create new vendor
      const vendorName = `${vendorPrefix}${dateSuffix}`
      const vendor = TestVendors.TestVendor_Template_New
      vendor.name = vendorName
      await vendorsPage.AddVendor(vendor)

      // Attach vendor to service area with overrides and temporary dates
      const { index } = await vendorsPage.FindVendorByName(vendor.name)
      await vendorsPage.UpdateVendorIdAsNeeded(vendor)
      const overrides = TestVendors.TestVendor_Template_Overrides
      const serviceArea = TestServiceAreas.TestEasternWashington
      await vendorsPage.AttachVendorToExistingServiceAreaByIndex(
        index,
        serviceArea,
        vendor,
        startDate,
        endDate,
        overrides
      )

      // Verify dates and overrides over on the Service+Vendor page
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(
        global,
        serviceArea,
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

      // Jump back and remove vendor from the vendors page
      await vendorsPage.NavigateToPage(true)
      await vendorsPage.FindAndDeleteVendorByName(vendor.name)
    })

    test('Attach Vendor to Existing Service Area - No Overrides, Apply Rules', async ({
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
      const vendor = TestVendors.TestVendor_Template_New as Vendor
      vendor.name = vendorName
      await vendorsPage.AddVendor(vendor)

      // find the vendor
      const { index } = await vendorsPage.FindVendorByName(vendor.name)
      await vendorsPage.UpdateVendorIdAsNeeded(vendor)

      // Set a new rule
      const assignmentRuleGroup = VendorRuleSetsTuples.General_ClaimAssignmentRuleSet.ruleGroups[0]
      await vendorsPage.AddRuleGroupToVendorByIndex(index, assignmentRuleGroup)
      vendor.ruleGroups.push(assignmentRuleGroup)
      vendor.ruleTest = assignmentRuleGroup

      // Attach vendor to Service Area, applying Rules
      const serviceArea = TestServiceAreas.TestEasternWashington
      await vendorsPage.AttachVendorToExistingServiceAreaByIndex(index, serviceArea, vendor)

      // Verify added Rule shows up on ServiceAndVendor page
      const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(global, serviceArea, vendor)
      await serviceAreaAndVendorPage.NavigateDirectly()
      const foundMatchIndex =
        await serviceAreaAndVendorPage.ClaimAssignmentRules.FindMatchingRuleGroup(
          assignmentRuleGroup
        )
      expect(foundMatchIndex).not.toBe(null)

      // clean up back on the Vendors page
      await vendorsPage.NavigateDirectly()
      await vendorsPage.FindAndDeleteVendorByName(vendor.name)
    })

    test('Create Rule - Verify Drawer UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const table = vendorsPage.DataTable_Vendors

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorsTableMessage)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorA
      const { index } = await vendorsPage.FindVendorByName(vendor.name)
      let createVendorRuleDrawer = await vendorsPage.OpenCreateVendorRuleDrawerByIndex(
        index
        // VendorRuleType.Unspecified,
        // false
      )

      // Verify drawer heading is "Create Vendor"
      createVendorRuleDrawer.Title.VerifyExpectedText()

      // Verify drawer closes with click on "X" button
      await createVendorRuleDrawer.Button_Close_X.Click()
      await expect(createVendorRuleDrawer.Title.locator).not.toBeAttached()
      await vendorsPage.Wait()

      createVendorRuleDrawer = await vendorsPage.OpenCreateVendorRuleDrawerByIndex(
        index
        // VendorRuleType.Unspecified,
        // false
      )

      // Verify drawer closes with ESC key
      await createVendorRuleDrawer.Close(true)
      await expect(createVendorRuleDrawer.Title.locator).not.toBeAttached()
      await vendorsPage.Wait()

      createVendorRuleDrawer = await vendorsPage.OpenCreateVendorRuleDrawerByIndex(
        index
        // VendorRuleType.Unspecified,
        // false
      )

      // Verify drawer closes if click on Close
      await createVendorRuleDrawer.Close()
      await expect(createVendorRuleDrawer.Title.locator).not.toBeAttached()
      await vendorsPage.Wait()
    })

    test('Create Rule - Validate Drawer', async ({ browser }) => {
      // launch the ClientPortal home page and go to Vendors
      const { global } = await Launch(browser, environment)
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      const table = vendorsPage.DataTable_Vendors

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorsTableMessage)
        return
      }

      const vendor: Vendor = TestVendors.TestVendorA
      const { index } = await vendorsPage.FindVendorByName(vendor.name)
      const createVendorRuleDrawer = await vendorsPage.OpenCreateVendorRuleDrawerByIndex(
        index
        // VendorRuleType.Unspecified,
        // false
      )

      // Click the Submit button
      await createVendorRuleDrawer.Button_Submit.Click()
      await vendorsPage.Wait()

      // Verify validation message for required fields
      expect(await createVendorRuleDrawer.Validate()).toBe(true)
    })

    test('Create Rule', async ({ browser }) => {
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

      // Create a new Rule Set for the vendor
      const { index } = await vendorsPage.FindVendorByName(vendor.name)
      const assignmentRuleGroup = VendorRuleSetsTuples.General_ClaimAssignmentRuleSet.ruleGroups[0]
      await vendorsPage.AddRuleGroupToVendorByIndex(index, assignmentRuleGroup)

      // Verify added Rule shows up on vendor page
      const vendorPage = await vendorsPage.ClickLinkToVendor(vendor)
      await vendorPage.ClaimAssignmentRules.LoadRuleSet()
      const foundMatchIndex =
        await vendorPage.ClaimAssignmentRules.FindMatchingRuleGroup(assignmentRuleGroup)
      expect(foundMatchIndex).not.toBe(null)

      // remove vendor
      await vendorPage.Action_RemoveVendor()

      // make sure we are back on the Vendors page
      await vendorsPage.VerifyTitle()
    })
  }
)
