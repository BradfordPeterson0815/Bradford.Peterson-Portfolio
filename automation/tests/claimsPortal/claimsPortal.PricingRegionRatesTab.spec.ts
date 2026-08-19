import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedRegionPricingTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
  PricingRegions_DataTable_ActionMenuItems,
  PricingTabTypes,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedRegionPricing, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalRegionPricingDrawer } from '../../library/claimsPortal/drawers/claimsPortalRegionPricingDrawer.js'
import { ClaimsPortalPricingPage } from '../../library/claimsPortal/pages/claimsPortalPricingPage.js'
import { ClaimsPortalPricingRegionsTab } from '../../library/claimsPortal/tabs/claimsPortalPricingRegionsTab.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'
const RegionPrefix = 'AA_TESTREGION'
const dateSuffix = `+${Date.now()}`

const environment = DefaultEnvironment

test.describe(
  'Pricing Page: Regions Tab',
  {
    tag: [Tags.ClaimsPortal, Tags.Pricing, Tags.Region],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      expect(await pricingPage.IsTabActive(PricingTabTypes.Regions)).toBe(true)
      expect(pricingPage.page.url()).toBe(pricingRegionsTab.URL)
      const table = pricingRegionsTab.DataTable_PricingRegions

      // Verify Title
      await pricingRegionsTab.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Add Region button exists and is active
      expect(await pricingRegionsTab.Button_AddRegion.IsVisible()).toBe(true)

      // Verify Bulk Update button exists and is active
      expect(await pricingRegionsTab.Button_BulkUpdateRegions.IsVisible()).toBe(true)

      // Verify Add Region button exists and is active
      expect(await pricingRegionsTab.Button_AddRegion.IsVisible()).toBe(true)

      const isEmpty = await table.IsEmpty()

      // Download CSV is going to be disabled if the table is empty and enabled if it has 1 or more entries
      expect(await pricingRegionsTab.Button_DownloadCSV.IsEnabled()).toBe(!isEmpty)

      // Verify Pricing Regions Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // if table is empty
      if (await table.IsEmpty()) {
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
      } else {
        // Verify global filter works
        const initialRowCount = await table.VisibleRowCount()

        // Verify setting search input causes the table results to filter across all text fields
        await table.SetTableSearch('NoMatchExpected')

        const filteredRowCount = await table.VisibleRowCount()
        expect(filteredRowCount).toBe(0)

        //  and clicking X button on it removes it and clears the search
        await table.CancelPinnedTableSearch()

        // Verify table is NOT filtered anymore
        expect(await table.IsGlobalSearchActive()).toBe(false)
        const filterCanceled = await table.VisibleRowCount()
        expect(filterCanceled).toBe(initialRowCount)
      }
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      expect(await pricingPage.IsTabActive(PricingTabTypes.Regions)).toBe(true)

      // Select the Vendors Rates Tab
      await pricingPage.SelectPricingTab(PricingTabTypes.VendorRates)
      expect(await pricingPage.IsTabActive(PricingTabTypes.VendorRates)).toBe(true)

      // Select the Region Pricing Tab
      await pricingPage.SelectPricingTab(PricingTabTypes.Regions)
      expect(await pricingPage.IsTabActive(PricingTabTypes.Regions)).toBe(true)

      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      expect(await pricingPage.IsTabActive(PricingTabTypes.Regions)).toBe(true)
      expect(pricingPage.page.url()).toBe(pricingRegionsTab.URL)
      const table = pricingRegionsTab.DataTable_PricingRegions

      // Verify Title
      await pricingRegionsTab.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Add Region button exists and is active
      expect(await pricingRegionsTab.Button_AddRegion.IsVisible()).toBe(true)

      // Verify Bulk Update button exists and is active
      expect(await pricingRegionsTab.Button_BulkUpdateRegions.IsVisible()).toBe(true)

      // Verify Add Region button exists and is active
      expect(await pricingRegionsTab.Button_AddRegion.IsVisible()).toBe(true)

      const isEmpty = await table.IsEmpty()

      // Download CSV is going to be disabled if the table is empty and enabled if it has 1 or more entries
      expect(await pricingRegionsTab.Button_DownloadCSV.IsEnabled()).toBe(!isEmpty)

      // Verify Pricing Regions Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // if table is not empty then verify Global Search Button
      expect(await table.Button_OpenTableSearch.IsVisible()).toBe(!isEmpty)
    })

    test('Pricing Regions Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      // Click the Open Table Settings button on the Pricing Regions Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await pricingRegionsTab.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Pricing Regions Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
        const pricingPage = new ClaimsPortalPricingPage(global)
        await pricingPage.NavigateToPage()

        // Verify the Region Pricing Tab appears and is selected
        const pricingRegionsTab = (await pricingPage.SelectPricingTab(
          PricingTabTypes.Regions
        )) as ClaimsPortalPricingRegionsTab
        const table = pricingRegionsTab.DataTable_PricingRegions

        // Click the Open Table Settings button on the Pricing Regions Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.PricingRegions_RegionName)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.PricingRegions_RegionName)).toBe(
          false
        )

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.PricingRegions_RegionName)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.PricingRegions_RegionName)).toBe(
          true
        )
        await tableSettingsDialog.Close()
      })

      test('Pricing Regions Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
        const pricingPage = new ClaimsPortalPricingPage(global)
        await pricingPage.NavigateToPage()

        // Verify the Region Pricing Tab appears and is selected
        const pricingRegionsTab = (await pricingPage.SelectPricingTab(
          PricingTabTypes.Regions
        )) as ClaimsPortalPricingRegionsTab
        const table = pricingRegionsTab.DataTable_PricingRegions

        //If the table is empty, we cannot perform this test
        if (await table.IsEmpty()) {
          AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
          return
        }

        // Make sure the column we need is visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.PricingRegions_RegionName)
        await tableSettingsDialog.Close()

        // We only have 1 column here, so test sort toggle
        // Verify initial state is unsorted
        const initialSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.PricingRegions_RegionName
        )
        expect(initialSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Region Name column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.PricingRegions_RegionName,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify column is sorted Down
        let currentSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.PricingRegions_RegionName
        )
        expect(currentSortState).toBe(DataTable_Column_SortState.Down_HighToLow)

        // Set the Region Name column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.PricingRegions_RegionName,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify column is sorted Down
        currentSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.PricingRegions_RegionName
        )
        expect(currentSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)
      })
    })

    test('Pricing Regions Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // Click the Open Table Search button on the Pricing Regions Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await pricingRegionsTab.page.waitForTimeout(1000)
    })

    test('Pricing Regions Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testRegionPricing = FetchCannedRegionPricing(
        environment,
        CannedRegionPricingTypes.DefaultRegionPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields (Name/Type)
      await table.SetTableSearch(testRegionPricing.name)

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
      const typeSearchTerm = 'No matches expected'
      const tableSearchDialog = await table.SetTableSearch(typeSearchTerm, true)

      // Verify table is filtered
      const typeFilteredRowCount = await table.VisibleRowCount()
      expect(typeFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const typeFilterOffRowCount = await table.VisibleRowCount()
      expect(typeFilterOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Pricing Regions Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      // Click the Add Table Filter button on the Pricing Regions Table
      let tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.PricingRegions_RegionName
      )

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await pricingPage.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.PricingRegions_RegionName
      )
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Pricing Regions Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testRegionPricing = FetchCannedRegionPricing(
        environment,
        CannedRegionPricingTypes.DefaultRegionPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        testRegionPricing.name,
        DataTable_Columns_Type.PricingRegions_RegionName
      )
      const contactFilteredRowCount = await table.VisibleRowCount()
      expect(contactFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(namePinnedFilter)

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      const descriptionFilteredOffRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      const tableSearchDialog = await table.SetTableSearch(testRegionPricing.name, true)

      // Verify table is filtered
      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const nameFilterOffRowCount = await table.VisibleRowCount()
      expect(nameFilterOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Pricing Regions Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testRegionPricing = FetchCannedRegionPricing(
        environment,
        CannedRegionPricingTypes.DefaultRegionPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        testRegionPricing.name,
        DataTable_Columns_Type.PricingRegions_RegionName
      )
      const filteredRowCount = await table.VisibleRowCount()
      expect(filteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedNameFilterTerm = 'There can be no matches'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedNameFilterTerm,
        DataTable_Columns_Type.PricingRegions_RegionName,
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

    test('Pricing Regions Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

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

    test('Pricing Regions Table - Verify Action Menu: Edit Region', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      const rowIndex = '0'
      await pricingRegionsTab.SelectActionMenuItem(
        rowIndex,
        PricingRegions_DataTable_ActionMenuItems.EditRegion
      )
      const regionPricingDrawer = new ClaimsPortalRegionPricingDrawer(global, true)

      // Verify the title
      await regionPricingDrawer.VerifyTitle()

      // close the drawer - we are done
      await regionPricingDrawer.Close()
      await pricingRegionsTab.page.waitForTimeout(1000)
    })

    test('Create Region Pricing - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      const regionPricingDrawer = await pricingRegionsTab.OpenCreateRegionPricingDrawer()

      // Verify drawer heading is "Create Region Pricing"
      regionPricingDrawer.VerifyTitle()

      // check all the other text boxes
      expect(regionPricingDrawer.TextBox_RegionName.locator).toBeAttached()
      expect(regionPricingDrawer.TextBox_SurtaxRate.locator).toBeAttached()
      expect(regionPricingDrawer.TextBox_BaseRates_DuringBusinessHours.locator).toBeAttached()
      expect(regionPricingDrawer.TextBox_BaseRates_AfterBusinessHours.locator).toBeAttached()
      expect(regionPricingDrawer.TextBox_RoofPitchRates_Under7_12.locator).toBeAttached()
      expect(regionPricingDrawer.TextBox_RoofPitchRates_7_12To9_12.locator).toBeAttached()
      expect(regionPricingDrawer.TextBox_RoofPitchRates_10_12To12_12.locator).toBeAttached()
      expect(regionPricingDrawer.TextBox_RoofPitchRates_Over12And12.locator).toBeAttached()
      expect(regionPricingDrawer.TextBox_RoofPitchRates_HighRoofRate.locator).toBeAttached()
      expect(
        regionPricingDrawer.TextBox_TarpingRates_Mechanical_DuringBusinessHours.locator
      ).toBeAttached()
      expect(
        regionPricingDrawer.TextBox_TarpingRates_Mechanical_AfterBusinessHours.locator
      ).toBeAttached()
      expect(
        regionPricingDrawer.TextBox_TarpingRates_Mechanical_MaterialCost.locator
      ).toBeAttached()
      expect(
        regionPricingDrawer.TextBox_TarpingRates_Sandbag_DuringBusinessHours.locator
      ).toBeAttached()
      expect(
        regionPricingDrawer.TextBox_TarpingRates_Sandbag_AfterBusinessHours.locator
      ).toBeAttached()
      expect(regionPricingDrawer.TextBox_TarpingRates_Sandbag_MaterialCost.locator).toBeAttached()

      // Verify Drawer closes with click on "X" button
      await regionPricingDrawer.Close()
      await expect(regionPricingDrawer.Title.locator).not.toBeAttached()
      await pricingRegionsTab.page.waitForTimeout(1000)

      // Verify Drawer closes with ESC key
      await pricingRegionsTab.OpenCreateRegionPricingDrawer()
      await regionPricingDrawer.Close(true)
      await expect(regionPricingDrawer.Title.locator).not.toBeAttached()
      await pricingRegionsTab.page.waitForTimeout(1000)
    })

    test('Create Region Pricing - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      const regionPricingDrawer = await pricingRegionsTab.OpenCreateRegionPricingDrawer()

      // Click the Submit button
      await regionPricingDrawer.Button_Submit.Click()
      await pricingRegionsTab.page.waitForTimeout(1000)

      // Verify validation
      expect(await regionPricingDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await regionPricingDrawer.Button_Close.Click()
    })

    test('Pricing Regions Table - Verify Action Menu: Goto Region', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testRegionPricing = FetchCannedRegionPricing(
        environment,
        CannedRegionPricingTypes.DefaultRegionPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      await table.SetTableFilter_Text(
        testRegionPricing.name,
        DataTable_Columns_Type.PricingRegions_RegionName
      )

      const rowIndex = '0'
      const pricingDetailsPage = await pricingRegionsTab.GotoRegionPricing(
        rowIndex,
        testRegionPricing
      )
      await pricingDetailsPage.Title.VerifyExpectedText()
      expect(pricingDetailsPage.baseURL.endsWith(testRegionPricing.id)).toBe(true)
    })

    test('Click Region Pricing Name', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testRegionPricing = FetchCannedRegionPricing(
        environment,
        CannedRegionPricingTypes.DefaultRegionPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      await table.SetTableFilter_Text(
        testRegionPricing.name,
        DataTable_Columns_Type.PricingRegions_RegionName
      )

      const rowIndex = '0'
      const pricingDetailsPage = await pricingRegionsTab.SelectRegionPricingByName(
        rowIndex,
        testRegionPricing
      )
      await pricingDetailsPage.Title.VerifyExpectedText()
      expect(pricingDetailsPage.baseURL.endsWith(testRegionPricing.id)).toBe(true)
    })

    test('Add/Edit/Remove Region', async ({ browser }) => {
      const newRegionName = `${RegionPrefix}${dateSuffix}`
      const editedRegionName = `${newRegionName}+EDITED`

      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testRegionPricing = FetchCannedRegionPricing(
        environment,
        CannedRegionPricingTypes.DefaultRegionPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      // Remove any existing regions from old tests
      await pricingRegionsTab.DeleteOldTestRegions(RegionPrefix)

      // add a new region
      testRegionPricing.name = newRegionName
      await pricingRegionsTab.AddNewRegionPricing(testRegionPricing)

      // make sure it exists and there is only 1
      await table.SetTableSearch(newRegionName)
      expect(await table.VisibleRowCount()).toBe(1)

      // edit the template
      testRegionPricing.name = editedRegionName
      const rowIndex = await pricingRegionsTab.FindIndexOfRowAtPosition(1)
      await pricingRegionsTab.UpdateExistingRegionPricing(rowIndex, testRegionPricing)

      // make sure it exists and there is only 1
      await table.SetTableSearch(editedRegionName)
      expect(await table.VisibleRowCount()).toBe(1)

      // Delete the region in the first(only) row
      const editedRowIndex = await pricingRegionsTab.FindIndexOfRowAtPosition(1)
      await pricingRegionsTab.RemoveExistingRegionPricing(editedRowIndex)
      await table.CancelPinnedTableSearch(editedRegionName)

      if (!(await table.IsEmpty())) {
        await table.SetTableSearch(editedRegionName)
        // make sure it no longer exists
        expect(await table.VisibleRowCount()).toBe(0)
      }
    })

    test('Download CSV', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      const downloadPromise = pricingRegionsTab.page.waitForEvent('download')
      await pricingRegionsTab.Button_DownloadCSV.Click()
      const download = await downloadPromise
      const downloadFileName = download.suggestedFilename()
      expect(downloadFileName.startsWith('Regions 20')).toBe(true)
    })

    test('Bulk Update Regions - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      const uploadRegionsDrawer = await pricingRegionsTab.OpenBulkUpdateRegionsDrawer()

      // Verify drawer heading is "Upload Regions CSV"
      uploadRegionsDrawer.Title.VerifyExpectedText()

      // check all elements
      expect(uploadRegionsDrawer.Button_DownloadRegionsCSV.locator).toBeAttached()
      expect(uploadRegionsDrawer.Button_Submit.locator).toBeAttached()
      expect(uploadRegionsDrawer.Button_Close.locator).toBeAttached()
      expect(uploadRegionsDrawer.Button_Close_X.locator).toBeAttached()

      // Verify Drawer closes with click on "X" button
      await uploadRegionsDrawer.Close()
      await expect(uploadRegionsDrawer.Title.locator).not.toBeAttached()
      await pricingRegionsTab.page.waitForTimeout(1000)

      // Verify Drawer closes with ESC key
      await pricingRegionsTab.OpenBulkUpdateRegionsDrawer()
      await uploadRegionsDrawer.Close(true)
      await expect(uploadRegionsDrawer.Title.locator).not.toBeAttached()
      await pricingRegionsTab.page.waitForTimeout(1000)
    })

    test('Bulk Update Regions - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      const uploadRegionsDrawer = await pricingRegionsTab.OpenBulkUpdateRegionsDrawer()

      // Click the Submit button
      await uploadRegionsDrawer.Button_Submit.Click()
      await pricingRegionsTab.page.waitForTimeout(1000)

      // Verify validation scenarios
      expect(await uploadRegionsDrawer.ValidateNoFiles()).toBe(true)
      await uploadRegionsDrawer.Button_Close.Click()

      await pricingRegionsTab.OpenBulkUpdateRegionsDrawer()
      // load an invalid file type
      await uploadRegionsDrawer.UploadInvalidRegionsFileType()
      await uploadRegionsDrawer.Button_Submit.Click()
      await pricingRegionsTab.page.waitForTimeout(1000)
      expect(await uploadRegionsDrawer.ValidateInvalidFileType()).toBe(true)
      await uploadRegionsDrawer.Button_Close.Click()
    })
  }
)
