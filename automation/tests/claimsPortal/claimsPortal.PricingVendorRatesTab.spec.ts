import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedVendorRatesPricingTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
  PricingTabTypes,
  PricingVendorRates_DataTable_ActionMenuItems,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedVendorRatesPricing, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalVendorRatesDrawer } from '../../library/claimsPortal/drawers/claimsPortalVendorRatesDrawer.js'
import { ClaimsPortalPricingPage } from '../../library/claimsPortal/pages/claimsPortalPricingPage.js'
import { ClaimsPortalPricingVendorRatesTab } from '../../library/claimsPortal/tabs/claimsPortalPricingVendorRatesTab.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'
const VendorRatesPrefix = 'AA_TESTVENDORRATES'
const VendorRatesTemplatePrefix = 'AA_TESTVENDORRATES_TEMPLATE'
const dateSuffix = `+${Date.now()}`
const environment = DefaultEnvironment

test.describe(
  'Pricing Page: Vendors Tab',
  {
    tag: [Tags.ClaimsPortal, Tags.Pricing, Tags.Vendor],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      expect(await pricingPage.IsTabActive(PricingTabTypes.VendorRates)).toBe(true)
      expect(pricingPage.page.url()).toBe(pricingVendorsTab.URL)
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      // Verify Title
      await pricingVendorsTab.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Add Vendor Rates button exists and is active
      expect(await pricingVendorsTab.Button_AddVendorRates.IsVisible()).toBe(true)

      // Verify Bulk Update button exists and is active
      expect(await pricingVendorsTab.Button_BulkUpdateVendorRates.IsVisible()).toBe(true)

      // Verify Add Vendor Rates button exists and is active
      expect(await pricingVendorsTab.Button_AddVendorRates.IsVisible()).toBe(true)

      const isEmpty = await table.IsEmpty()

      // Download CSV is going to be disabled if the table is empty and enabled if it has 1 or more entries
      expect(await pricingVendorsTab.Button_DownloadCSV.IsEnabled()).toBe(!isEmpty)

      // Verify Pricing Vendors Table layout...
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

      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      expect(await pricingPage.IsTabActive(PricingTabTypes.VendorRates)).toBe(true)
      expect(pricingPage.page.url()).toBe(pricingVendorsTab.URL)
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      // Verify Title
      await pricingVendorsTab.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Add Vendor Rates button exists and is active
      expect(await pricingVendorsTab.Button_AddVendorRates.IsVisible()).toBe(true)

      // Verify Bulk Update button exists and is active
      expect(await pricingVendorsTab.Button_BulkUpdateVendorRates.IsVisible()).toBe(true)

      // Verify Add Vendor Rates button exists and is active
      expect(await pricingVendorsTab.Button_AddVendorRates.IsVisible()).toBe(true)

      const isEmpty = await table.IsEmpty()

      // Download CSV is going to be disabled if the table is empty and enabled if it has 1 or more entries
      expect(await pricingVendorsTab.Button_DownloadCSV.IsEnabled()).toBe(!isEmpty)

      // Verify Pricing Vendors Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // if table is not empty then verify Global Search Button
      expect(await table.Button_OpenTableSearch.IsVisible()).toBe(!isEmpty)
    })

    test('Pricing Vendor Rates Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      // Click the Open Table Settings button on the Pricing Vendors Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await pricingVendorsTab.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Pricing Vendor Rates Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
        const pricingPage = new ClaimsPortalPricingPage(global)
        await pricingPage.NavigateToPage()

        // Verify the Vendors Tab appears and is selected
        const pricingVendorsTab = (await pricingPage.SelectPricingTab(
          PricingTabTypes.VendorRates
        )) as ClaimsPortalPricingVendorRatesTab
        const table = pricingVendorsTab.DataTable_PricingVendorRates

        // Click the Open Table Settings button on the Pricing Vendors Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(
          DataTable_Columns_Type.PricingVendorRates_VendorName
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.PricingVendorRates_VendorName)
        ).toBe(false)
        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(
          DataTable_Columns_Type.PricingVendorRates_IsTemplate
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.PricingVendorRates_IsTemplate)
        ).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.PricingVendorRates_VendorName)
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.PricingVendorRates_VendorName)
        ).toBe(true)
        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.PricingVendorRates_IsTemplate)
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.PricingVendorRates_IsTemplate)
        ).toBe(true)
        await tableSettingsDialog.Close()
      })

      test('Pricing Vendor Rates Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
        const pricingPage = new ClaimsPortalPricingPage(global)
        await pricingPage.NavigateToPage()

        // Verify the Vendors Tab appears and is selected
        const pricingVendorsTab = (await pricingPage.SelectPricingTab(
          PricingTabTypes.VendorRates
        )) as ClaimsPortalPricingVendorRatesTab
        const table = pricingVendorsTab.DataTable_PricingVendorRates

        //If the table is empty, we cannot perform this test
        if (await table.IsEmpty()) {
          AbortTest(AbortErrors.EmptyVendorRatesTableMessage)
          return
        }

        // Make sure the column we need is visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.PricingVendorRates_VendorName)
        await tableSettingsDialog.Close()

        // We only have 1 column here, so test sort toggle
        // Verify initial state is unsorted
        const initialSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.PricingVendorRates_VendorName
        )
        expect(initialSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Vendor Name column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.PricingVendorRates_VendorName,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify column is sorted Down
        let currentSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.PricingVendorRates_VendorName
        )
        expect(currentSortState).toBe(DataTable_Column_SortState.Down_HighToLow)

        // Set the Vendor Name column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.PricingVendorRates_VendorName,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify column is sorted Down
        currentSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.PricingVendorRates_VendorName
        )
        expect(currentSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)
      })
    })

    test('Pricing Vendor Rates Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // Click the Open Table Search button on the Pricing Vendors Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await pricingVendorsTab.page.waitForTimeout(1000)
    })

    test('Pricing Vendor Rates Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testVendorRatesPricing = FetchCannedVendorRatesPricing(
        environment,
        CannedVendorRatesPricingTypes.DefaultVendorRatesPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields (Name/Type)
      await table.SetTableSearch(testVendorRatesPricing.name)

      let nameFilteredRowCount = await table.VisibleRowCount()
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
      const nameSearchTerm = 'No matches expected'
      const tableSearchDialog = await table.SetTableSearch(nameSearchTerm, true)

      // Verify table is filtered
      nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const nameFilterOffRowCount = await table.VisibleRowCount()
      expect(nameFilterOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Pricing Vendor Rates Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorRatesTableMessage)
        return
      }

      // Click the Add Table Filter button on the Pricing Vendors Table
      let tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.PricingVendorRates_VendorName
      )

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await pricingPage.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.PricingVendorRates_VendorName
      )
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Pricing Vendor Rates Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testVendorRatesPricing = FetchCannedVendorRatesPricing(
        environment,
        CannedVendorRatesPricingTypes.DefaultVendorRatesPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorRatesTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        testVendorRatesPricing.name,
        DataTable_Columns_Type.PricingVendorRates_VendorName
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
      const tableSearchDialog = await table.SetTableSearch(testVendorRatesPricing.name, true)

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

    test('Pricing Vendor Rates Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testVendorRatesPricing = FetchCannedVendorRatesPricing(
        environment,
        CannedVendorRatesPricingTypes.DefaultVendorRatesPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorRatesTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        testVendorRatesPricing.name,
        DataTable_Columns_Type.PricingVendorRates_VendorName
      )
      const filteredRowCount = await table.VisibleRowCount()
      expect(filteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedNameFilterTerm = 'There can be no matches'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedNameFilterTerm,
        DataTable_Columns_Type.PricingVendorRates_VendorName,
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

    test('Pricing Vendor Rates Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorRatesTableMessage)
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

    test('Pricing Vendor Rates Table - Verify Action Menu: Edit Vendor Rates', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testVendorRatesPricing = FetchCannedVendorRatesPricing(
        environment,
        CannedVendorRatesPricingTypes.DefaultVendorRatesPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorRatesTableMessage)
        return
      }

      await table.SetTableFilter_Text(
        testVendorRatesPricing.name,
        DataTable_Columns_Type.PricingVendorRates_VendorName
      )

      const rowIndex = await pricingVendorsTab.FindIndexOfRowAtPosition(1)
      await pricingVendorsTab.SelectActionMenuItem(
        rowIndex,
        PricingVendorRates_DataTable_ActionMenuItems.EditVendorRates
      )
      const vendorRatesDrawer = new ClaimsPortalVendorRatesDrawer(global, true, testVendorRatesPricing)

      // Verify the title
      await vendorRatesDrawer.VerifyTitle()

      // close the drawer - we are done
      await vendorRatesDrawer.Close()
      await pricingVendorsTab.page.waitForTimeout(1000)
    })

    test('Create Vendor Rates - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testVendorRatesPricing = FetchCannedVendorRatesPricing(
        environment,
        CannedVendorRatesPricingTypes.DefaultVendorRatesPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorRatesTableMessage)
        return
      }

      const vendorRatesDrawer =
        await pricingVendorsTab.OpenCreateVendorRatesDrawer(testVendorRatesPricing)

      // Verify drawer heading is "Create Vendor Rates"
      vendorRatesDrawer.VerifyTitle()

      // check all the other Fields
      expect(vendorRatesDrawer.TextBox_VendorRatesName.locator).toBeAttached()
      expect(vendorRatesDrawer.Checkbox_IsThisATemplate.locator).toBeAttached()
      expect(
        vendorRatesDrawer.TextBox_TarpingRates_Mechanical_DuringBusinessHours.locator
      ).toBeAttached()
      expect(
        vendorRatesDrawer.TextBox_TarpingRates_Mechanical_AfterBusinessHours.locator
      ).toBeAttached()
      expect(vendorRatesDrawer.TextBox_TarpingRates_Mechanical_MaterialCost.locator).toBeAttached()
      expect(
        vendorRatesDrawer.TextBox_TarpingRates_Sandbag_DuringBusinessHours.locator
      ).toBeAttached()
      expect(
        vendorRatesDrawer.TextBox_TarpingRates_Sandbag_AfterBusinessHours.locator
      ).toBeAttached()
      expect(vendorRatesDrawer.TextBox_TarpingRates_Sandbag_MaterialCost.locator).toBeAttached()

      // Verify Drawer closes with click on "X" button
      await vendorRatesDrawer.Close()
      await expect(vendorRatesDrawer.Title.locator).not.toBeAttached()
      await pricingVendorsTab.page.waitForTimeout(1000)

      // Verify Drawer closes with ESC key
      await pricingVendorsTab.OpenCreateVendorRatesDrawer(testVendorRatesPricing)
      await vendorRatesDrawer.Close(true)
      await expect(vendorRatesDrawer.Title.locator).not.toBeAttached()
      await pricingVendorsTab.page.waitForTimeout(1000)
    })

    test('Create Vendor Rates - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testVendorRatesPricing = FetchCannedVendorRatesPricing(
        environment,
        CannedVendorRatesPricingTypes.DefaultVendorRatesPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorRatesTableMessage)
        return
      }

      const vendorRatesDrawer =
        await pricingVendorsTab.OpenCreateVendorRatesDrawer(testVendorRatesPricing)

      // Click the Submit button
      await vendorRatesDrawer.Button_Submit.Click()
      await pricingVendorsTab.page.waitForTimeout(1000)

      // Verify validation
      expect(await vendorRatesDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await vendorRatesDrawer.Button_Close.Click()
    })

    test('Pricing Vendor Rates Table - Verify Action Menu: View Vendor Rates', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testVendorRatesPricing = FetchCannedVendorRatesPricing(
        environment,
        CannedVendorRatesPricingTypes.DefaultVendorRatesPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorRatesTableMessage)
        return
      }

      await table.SetTableFilter_Text(
        testVendorRatesPricing.name,
        DataTable_Columns_Type.PricingVendorRates_VendorName
      )

      const rowIndex = await pricingVendorsTab.FindIndexOfRowAtPosition(1)
      const ratesDetailPage = await pricingVendorsTab.ViewVendorRates(
        rowIndex,
        testVendorRatesPricing
      )
      await ratesDetailPage.Title.VerifyExpectedText()
      expect(ratesDetailPage.baseURL.endsWith(testVendorRatesPricing.id)).toBe(true)
    })

    test('Click Vendor Rates Name', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testVendorRatesPricing = FetchCannedVendorRatesPricing(
        environment,
        CannedVendorRatesPricingTypes.DefaultVendorRatesPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorRatesTableMessage)
        return
      }

      await table.SetTableFilter_Text(
        testVendorRatesPricing.name,
        DataTable_Columns_Type.PricingVendorRates_VendorName
      )

      const rowIndex = await pricingVendorsTab.FindIndexOfRowAtPosition(1)
      const vendorRatesDetailsPage = await pricingVendorsTab.SelectVendorRatesByName(
        rowIndex,
        testVendorRatesPricing
      )
      await vendorRatesDetailsPage.Title.VerifyExpectedText()
      expect(vendorRatesDetailsPage.baseURL.endsWith(testVendorRatesPricing.id)).toBe(true)
    })

    test('Add/Edit/Remove VendorRates', async ({ browser }) => {
      const newVendorRatesName = `${VendorRatesPrefix}${dateSuffix}`
      const editedVendorRatesName = `${newVendorRatesName}+EDITED`

      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testVendorRatesPricing = FetchCannedVendorRatesPricing(
        environment,
        CannedVendorRatesPricingTypes.DefaultVendorRatesPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorRatesTableMessage)
        return
      }

      // Remove any existing vendor rates from old tests
      await pricingVendorsTab.DeleteOldTestVendorRates(VendorRatesPrefix)

      // add a new vendor rates
      testVendorRatesPricing.name = newVendorRatesName
      await pricingVendorsTab.AddNewVendorRates(testVendorRatesPricing)

      // make sure it exists and there is only 1
      await table.SetTableSearch(newVendorRatesName)
      expect(await table.VisibleRowCount()).toBe(1)

      // edit the rates
      testVendorRatesPricing.name = editedVendorRatesName
      const rowIndex = await pricingVendorsTab.FindIndexOfRowAtPosition(1)
      await pricingVendorsTab.EditVendorRates(rowIndex, testVendorRatesPricing)

      // make sure it exists and there is only 1
      await table.SetTableSearch(editedVendorRatesName)
      expect(await table.VisibleRowCount()).toBe(1)

      // Delete the vendor rate in the first(only) row
      const editedRowIndex = await pricingVendorsTab.FindIndexOfRowAtPosition(1)
      await pricingVendorsTab.RemoveExistingVendorRates(editedRowIndex)
      await table.CancelPinnedTableSearch(editedVendorRatesName)

      if (!(await table.IsEmpty())) {
        await table.SetTableSearch(editedVendorRatesName)
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

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorRatesTableMessage)
        return
      }

      const downloadPromise = pricingVendorsTab.page.waitForEvent('download')
      await pricingVendorsTab.Button_DownloadCSV.Click()
      const download = await downloadPromise
      const downloadFileName = download.suggestedFilename()
      expect(downloadFileName.startsWith('Vendor Rates 20')).toBe(true)
    })

    test('Bulk Update Vendor Rates - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorRatesTableMessage)
        return
      }

      const uploadVendorRatesDrawer = await pricingVendorsTab.OpenBulkUpdateVendorRatesDrawer()

      // Verify drawer heading is "Upload Vendor Rates CSV"
      uploadVendorRatesDrawer.Title.VerifyExpectedText()

      // check all elements
      expect(uploadVendorRatesDrawer.Button_DownloadVendorRatesCSV.locator).toBeAttached()
      expect(uploadVendorRatesDrawer.Button_Submit.locator).toBeAttached()
      expect(uploadVendorRatesDrawer.Button_Close.locator).toBeAttached()
      expect(uploadVendorRatesDrawer.Button_Close_X.locator).toBeAttached()

      // Verify Drawer closes with click on "X" button
      await uploadVendorRatesDrawer.Close()
      await expect(uploadVendorRatesDrawer.Title.locator).not.toBeAttached()
      await pricingVendorsTab.page.waitForTimeout(1000)

      // Verify Drawer closes with ESC key
      await pricingVendorsTab.OpenBulkUpdateVendorRatesDrawer()
      await uploadVendorRatesDrawer.Close(true)
      await expect(uploadVendorRatesDrawer.Title.locator).not.toBeAttached()
      await pricingVendorsTab.page.waitForTimeout(1000)
    })

    test('Bulk Update Vendor Rates - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorRatesTableMessage)
        return
      }

      const uploadVendorRatesDrawer = await pricingVendorsTab.OpenBulkUpdateVendorRatesDrawer()

      // Click the Submit button
      await uploadVendorRatesDrawer.Button_Submit.Click()
      await pricingVendorsTab.page.waitForTimeout(1000)

      // Verify validation scenarios
      expect(await uploadVendorRatesDrawer.ValidateNoFiles()).toBe(true)
      await uploadVendorRatesDrawer.Button_Close.Click()

      await pricingVendorsTab.OpenBulkUpdateVendorRatesDrawer()
      // load an invalid file type
      await uploadVendorRatesDrawer.UploadInvalidVendorRatesFileType()
      await uploadVendorRatesDrawer.Button_Submit.Click()
      await pricingVendorsTab.page.waitForTimeout(1000)
      expect(await uploadVendorRatesDrawer.ValidateInvalidFileType()).toBe(true)
      await uploadVendorRatesDrawer.Button_Close.Click()
    })

    test('Add/Remove a vendor from a Vendor Rates Template', async ({ browser }) => {
      const newVendorRatesName = `${VendorRatesPrefix}${dateSuffix}`

      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testVendorRatesPricingTemplate = FetchCannedVendorRatesPricing(
        environment,
        CannedVendorRatesPricingTypes.DefaultVendorRatesPricingTemplate
      )
      const testVendorRatesPricing = FetchCannedVendorRatesPricing(
        environment,
        CannedVendorRatesPricingTypes.DefaultVendorRatesPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorRatesTableMessage)
        return
      }

      // Remove any existing vendor rates from old tests
      await pricingVendorsTab.DeleteOldTestVendorRates(VendorRatesPrefix)

      // add a new vendor from a template
      testVendorRatesPricing.name = newVendorRatesName
      await pricingVendorsTab.AddNewVendorRatesFromTemplate(
        testVendorRatesPricingTemplate.name,
        newVendorRatesName,
        testVendorRatesPricing.assignedVendors
      )

      // make sure it exists and there is only 1
      await table.SetTableSearch(newVendorRatesName)
      expect(await table.VisibleRowCount()).toBe(1)

      // Delete the vendor rate in the first(only) row
      const rowIndex = await pricingVendorsTab.FindIndexOfRowAtPosition(1)
      await pricingVendorsTab.RemoveExistingVendorRates(rowIndex)
      await table.CancelPinnedTableSearch(newVendorRatesName)

      if (!(await table.IsEmpty())) {
        await table.SetTableSearch(newVendorRatesName)
        // make sure it no longer exists
        expect(await table.VisibleRowCount()).toBe(0)
      }
    })

    test('Add/Edit/Remove VendorRates Template', async ({ browser }) => {
      const newVendorRatesTemplateName = `${VendorRatesTemplatePrefix}${dateSuffix}`
      const editedVendorRatesTemplateName = `${newVendorRatesTemplateName}+EDITED`

      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testVendorRatesPricingTemplate = FetchCannedVendorRatesPricing(
        environment,
        CannedVendorRatesPricingTypes.DefaultVendorRatesPricingTemplate
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorRatesTableMessage)
        return
      }

      // Remove any existing vendor rates templates from old tests
      await pricingVendorsTab.DeleteOldTestVendorRates(VendorRatesTemplatePrefix)

      // add a new vendor rates template
      testVendorRatesPricingTemplate.name = newVendorRatesTemplateName
      await pricingVendorsTab.AddNewVendorRates(testVendorRatesPricingTemplate)

      // make sure it exists and there is only 1
      await table.SetTableSearch(newVendorRatesTemplateName)
      expect(await table.VisibleRowCount()).toBe(1)

      // edit the rates template
      testVendorRatesPricingTemplate.name = editedVendorRatesTemplateName
      const rowIndex = await pricingVendorsTab.FindIndexOfRowAtPosition(1)
      await pricingVendorsTab.EditVendorRates(rowIndex, testVendorRatesPricingTemplate)

      // make sure it exists and there is only 1
      await table.SetTableSearch(editedVendorRatesTemplateName)
      expect(await table.VisibleRowCount()).toBe(1)

      // Delete the vendor rates template in the first(only) row
      const editedRowIndex = await pricingVendorsTab.FindIndexOfRowAtPosition(1)
      await pricingVendorsTab.RemoveExistingVendorRates(editedRowIndex)
      await table.CancelPinnedTableSearch(editedVendorRatesTemplateName)

      if (!(await table.IsEmpty())) {
        await table.SetTableSearch(editedVendorRatesTemplateName)
        // make sure it no longer exists
        expect(await table.VisibleRowCount()).toBe(0)
      }
    })
  }
)
