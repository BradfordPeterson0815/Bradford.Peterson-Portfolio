import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedClaimTypes,
  ClaimTabTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DataTable_ShowPageSize_Options,
  DefaultEnvironment,
  Documents_DataTable_ActionMenuItems,
  Documents_Meta_DataSourceSelectionOptions,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedClaim, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalClaimPage } from '../../library/claimsPortal/pages/claimsPortalClaimPage.js'
import { ClaimsPortalClaimMediaTab } from '../../library/claimsPortal/tabs/claimsPortalClaimMediaTab.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'
import { ClaimsPortalClaimsPage } from '../../library/claimsPortal/pages/claimsPortalClaimsPage.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Page: Media Tab',
  {
    tag: [Tags.ClaimsPortal, Tags.Claim, Tags.Media],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // find a random claim and go to it
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage } = await claimsPage.OpenRandomClaim()

      // Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Media)).toBe(true)
      expect(claimPage.page.url()).toBe(mediaTab.URL)
      const table = mediaTab.DataTable_Media

      // Verify Title
      await mediaTab.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)
      const isEmpty = await table.IsEmpty()

      // Verify buttons exist
      expect(await mediaTab.Button_ViewMedia.IsVisible()).toBe(true)
      expect(await mediaTab.Button_DownloadAllImages.IsVisible()).toBe(true)
      expect(await mediaTab.Link_CreatePhotoReport.IsVisible()).toBe(true)
      expect(await mediaTab.Link_UploadMedia.IsVisible()).toBe(true)

      // Verify Media Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // Verify Title
      await mediaTab.Title.VerifyExpectedText()

      // Verify Documents Table layout...
      // Verify Documents Column Settings / Filters / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // Check table settings dialog and columns
      await mediaTab.VerifyTableSettingColumns()

      // if table is empty
      if (isEmpty) {
        expect(await mediaTab.Button_DownloadAllImages.IsEnabled()).toBe(false)
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
      } else {
        expect(await mediaTab.Button_DownloadAllImages.IsEnabled()).toBe(true)

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

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Media)).toBe(true)
      expect(claimPage.page.url()).toBe(mediaTab.URL)
      const table = mediaTab.DataTable_Media

      // Verify Title
      await mediaTab.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify View Media button exists
      expect(await mediaTab.Button_ViewMedia.IsVisible()).toBe(true)
      // Verify Download All Images button exists
      expect(await mediaTab.Button_DownloadAllImages.IsVisible()).toBe(true)
      // Verify Create Photo Reports link exists
      expect(await mediaTab.Link_CreatePhotoReport.IsVisible()).toBe(true)
      // Verify Upload Media link exists
      expect(await mediaTab.Link_UploadMedia.IsVisible()).toBe(true)

      // Verify Media Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // if table is not empty then verify Global Search Button
      if (!(await table.IsEmpty())) {
        await table.Button_OpenTableSearch.locator.waitFor({ state: 'visible' })
      }
    })

    test('Media Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      // Click the Open Table Settings button on the Media Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await mediaTab.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Media Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new ClaimsPortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim, then navigate to the Media tab
        const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
        const table = mediaTab.DataTable_Media

        // Click the Open Table Settings button on the Media Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Documents_File)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_File)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Documents_Description)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_Description)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Documents_FileName)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_FileName)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Documents_Visibility)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_Visibility)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Documents_Exports)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_Exports)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Documents_Dates)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_Dates)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Documents_Meta)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_Meta)).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Documents_File)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_File)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Documents_Description)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_Description)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Documents_FileName)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_FileName)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Documents_Visibility)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_Visibility)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Documents_Exports)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_Exports)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Documents_Dates)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_Dates)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Documents_Meta)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_Meta)).toBe(true)
        await tableSettingsDialog.Close()
      })

      test('Media Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new ClaimsPortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim, then navigate to the Media tab
        const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
        const table = mediaTab.DataTable_Media

        // Make sure the columns we need are visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Documents_File)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Documents_Description)
        await tableSettingsDialog.Close()

        // Examine File and Description columns
        // Verify initial states are unsorted
        const initialFileSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Documents_File
        )
        const initialDescriptionSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Documents_Description
        )
        expect(initialFileSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialDescriptionSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the File column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Documents_File,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify File is sorted Down and Created Date is still unsorted
        let currentFileSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Documents_File
        )
        let currentDescriptionSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Documents_Description
        )
        expect(currentFileSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentDescriptionSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Created Date column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Documents_Description,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify File is now unsorted and Created Date is sorted Up
        currentFileSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Documents_File
        )
        currentDescriptionSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Documents_Description
        )
        expect(currentFileSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentDescriptionSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Created Date column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.Documents_Description,
          DataTable_Column_SortState.Unsorted
        )
        currentDescriptionSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Documents_Description
        )
        expect(currentDescriptionSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Verify Contact Roles and Login Count cannot be sorted
        const currentVisbilitySortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Documents_Visibility
        )
        const currentExportsSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Documents_Exports
        )
        const currentDatesSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Documents_Dates
        )
        const currentMetaSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Documents_Meta
        )
        expect(currentVisbilitySortState).toBe(DataTable_Column_SortState.NotSortable)
        expect(currentExportsSortState).toBe(DataTable_Column_SortState.NotSortable)
        expect(currentDatesSortState).toBe(DataTable_Column_SortState.NotSortable)
        expect(currentMetaSortState).toBe(DataTable_Column_SortState.NotSortable)
      })
    })

    test('Media Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // Click the Open Table Search button on the Media Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await mediaTab.page.waitForTimeout(1000)
    })

    test('Media Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }
      await claimPage.page.waitForTimeout(5000)
      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields
      const fileSearchTerm = testClaim.testData.claimsMedia
      await table.SetTableSearch(fileSearchTerm)

      const fileFilteredRowCount = await table.VisibleRowCount()
      expect(fileFilteredRowCount).toBe(1)

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      // and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      const fileFilteredOffRowCount = await table.VisibleRowCount()
      expect(fileFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      const descriptionSearchTerm = testClaim.testData.documentDescription
      const tableSearchDialog = await table.SetTableSearch(descriptionSearchTerm, true)

      // Verify table is filtered
      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const descriptionFilterOffRowCount = await table.VisibleRowCount()
      expect(descriptionFilterOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Media Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimMediaTableMessage)
        return
      }

      // Click the Add Table Filter button on the Media Table
      let tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Documents_File)

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await mediaTab.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Documents_File)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Media Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimMediaTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const fileFilterTerm = testClaim.testData.claimsMedia
      const { pinnedFilter: filePinnedFilter } = await table.SetTableFilter_Text(
        fileFilterTerm,
        DataTable_Columns_Type.Documents_File
      )
      const fileFilteredRowCount = await table.VisibleRowCount()
      expect(fileFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(filePinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(filePinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(filePinnedFilter)).toBe(false)
      const fileFilteredOffRowCount = await table.VisibleRowCount()
      expect(fileFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const { tableFilterDialog } = await mediaTab.SetTableFilter_Selection(
        Documents_Meta_DataSourceSelectionOptions.ClaimsPortal,
        DataTable_Columns_Type.Documents_Meta_DataSource,
        false,
        true
      )

      // Verify table is filtered
      const typeFilteredRowCount = await table.VisibleRowCount()
      expect(typeFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const typeFilterOffRowCount = await table.VisibleRowCount()
      expect(typeFilterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Media Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimMediaTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const fileFilterTerm = testClaim.testData.claimsMedia
      const { pinnedFilter: filePinnedFilter } = await table.SetTableFilter_Text(
        fileFilterTerm,
        DataTable_Columns_Type.Documents_File
      )
      const fileFilteredRowCount = await table.VisibleRowCount()
      expect(fileFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(filePinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedFileFilterTerm = 'There can be no matches'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedFileFilterTerm,
        DataTable_Columns_Type.Documents_File,
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

    test('Media Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

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

    test('Media Table - Selection', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.RedactedClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimMediaTableMessage)
        return
      }

      // Filter for a ClaimsPortal Data Source media
      await mediaTab.SetTableFilter_Selection(
        Documents_Meta_DataSourceSelectionOptions.ClaimsPortal,
        DataTable_Columns_Type.Documents_Meta_DataSource
      )

      await mediaTab.page.waitForTimeout(5000)
      const pageInfo = await table.GetPageInfo()

      // Check the selection checkbox of any claim row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.SelectRowByIndex(rowIndex, true)

      // Verify that selection count bubble appears top left of the table with count of 1
      let visibleSelectedRowCount = await table.VisibleSelectedRowCount()
      let selectionBadgeCount = await table.SelectionBadgeCount()
      expect(visibleSelectedRowCount).toBe(selectionBadgeCount)

      // Verify action buttons appear above the table: (Export Media/Update Media Visibility)
      expect(await table.Button_Selection_ExportMedia.IsVisible()).toBe(true)
      expect(await table.Button_Selection_UpdateMediaVisibility.IsVisible()).toBe(true)

      await table.CancelRowSelection()

      // Check the selection checkbox at the top of the selection column
      await table.SelectAllVisibleRows(true)

      // Verify that all the claim selection checkboxes on the page are checked
      visibleSelectedRowCount = await table.VisibleSelectedRowCount()
      expect(visibleSelectedRowCount).toBe(pageInfo.currentPageRowCount)

      // Verify action buttons appear above the table: (Export Documents/Update Documents Visibility)
      expect(await table.Button_Selection_ExportMedia.IsVisible()).toBe(true)
      expect(await table.Button_Selection_UpdateMediaVisibility.IsVisible()).toBe(true)

      // Verify that selection count bubble appears top left of the table with correct count
      selectionBadgeCount = await table.SelectionBadgeCount()
      expect(visibleSelectedRowCount).toBe(selectionBadgeCount)

      await table.CancelRowSelection()

      // Verify that all the claim selection checkboxes on the page are not longer checked
      const rowsSelected = await table.VisibleSelectedRowCount()
      expect(rowsSelected).toBe(0)

      // Verify action buttons no longer appear above the table
      expect(await table.Button_Selection_ExportMedia.IsVisible()).toBe(false)
      expect(await table.Button_Selection_UpdateMediaVisibility.IsVisible()).toBe(false)

      // Verify the selection badge is not visible
      expect(await table.selectionBadgeLocator.isVisible()).toBe(false)
    })

    test('Media Table - Verify Action Menu: Copy Document ID', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimMediaTableMessage)
        return
      }

      const rowIndex = '0'
      await mediaTab.SelectActionMenuItem(
        rowIndex,
        Documents_DataTable_ActionMenuItems.CopyDocumentId
      )
      const copiedID = await mediaTab.GetClipboardText()

      // Verify clipboard contains a 32 character GUID
      expect(copiedID.length).toBe(32)
    })

    test('Media Table  - Verify Action Menu Visibility: Update/Delete Document/Add Tags', async ({
      browser,
    }) => {
      test.slow()

      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.RedactedClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimMediaTableMessage)
        return
      }

      // Filter for a Redacted Data Source document
      const { pinnedFilter: pinnedRedactedFilter } = await mediaTab.SetTableFilter_Selection(
        Documents_Meta_DataSourceSelectionOptions.Redacted,
        DataTable_Columns_Type.Documents_Meta_DataSource
      )
      const redactedFilteredRowCount = await table.VisibleRowCount()
      expect(redactedFilteredRowCount).toBeGreaterThanOrEqual(1)

      // Verify Update and Delete Document menu items are not available for this Redacted document
      let rowIndex = await table.FetchRowIndexFromRowPosition(1)
      let updateMenuIsVisible = await mediaTab.IsActionMenuItemVisible(
        rowIndex,
        Documents_DataTable_ActionMenuItems.UpdateDocument
      )
      expect(updateMenuIsVisible).toBe(false)
      let deleteMenuIsVisible = await mediaTab.IsActionMenuItemVisible(
        rowIndex,
        Documents_DataTable_ActionMenuItems.DeleteDocument
      )
      expect(deleteMenuIsVisible).toBe(false)
      let addTagsMenuIsVisible = await mediaTab.IsActionMenuItemVisible(
        rowIndex,
        Documents_DataTable_ActionMenuItems.AddTags
      )
      expect(addTagsMenuIsVisible).toBe(false)

      // Clear existing filter
      await table.CancelPinnedTableFilter(pinnedRedactedFilter)

      // Filter for a ClaimsPortal Data Source document
      const { pinnedFilter: pinnedClaimsPortalFilter } = await mediaTab.SetTableFilter_Selection(
        Documents_Meta_DataSourceSelectionOptions.ClaimsPortal,
        DataTable_Columns_Type.Documents_Meta_DataSource
      )
      const claimsFilteredRowCount = await table.VisibleRowCount()
      expect(claimsFilteredRowCount).toBeGreaterThanOrEqual(1)

      // Verify Update and Delete Document menu items are available for this ClaimsPortal document
      rowIndex = await table.FetchRowIndexFromRowPosition(1)
      updateMenuIsVisible = await mediaTab.IsActionMenuItemVisible(
        rowIndex,
        Documents_DataTable_ActionMenuItems.UpdateDocument
      )
      expect(updateMenuIsVisible).toBe(true)
      deleteMenuIsVisible = await mediaTab.IsActionMenuItemVisible(
        rowIndex,
        Documents_DataTable_ActionMenuItems.DeleteDocument
      )
      expect(deleteMenuIsVisible).toBe(true)
      addTagsMenuIsVisible = await mediaTab.IsActionMenuItemVisible(
        rowIndex,
        Documents_DataTable_ActionMenuItems.AddTags
      )
      expect(addTagsMenuIsVisible).toBe(true)

      // Clear existing filter
      await table.CancelPinnedTableFilter(pinnedClaimsPortalFilter)
    })

    test('Media Table - Verify Action Menu: Update Document', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimMediaTableMessage)
        return
      }

      // Filter for a ClaimsPortal Data Source document
      const { pinnedFilter: pinnedClaimsPortalFilter } = await mediaTab.SetTableFilter_Selection(
        Documents_Meta_DataSourceSelectionOptions.ClaimsPortal,
        DataTable_Columns_Type.Documents_Meta_DataSource
      )
      const claimsFilteredRowCount = await table.VisibleRowCount()
      expect(claimsFilteredRowCount).toBeGreaterThanOrEqual(1)

      // Open the Update Document Information Drawer for a document
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      const updateDocumentInformationDrawer =
        await mediaTab.OpenUpdateDocumentInformationDrawer(rowIndex)

      // Verify drawer appears
      await expect(updateDocumentInformationDrawer.Title.locator).toBeAttached()
      await updateDocumentInformationDrawer.Button_Cancel.Click()

      // Clear existing filter
      await table.CancelPinnedTableFilter(pinnedClaimsPortalFilter)
    })

    test('Media Table - Verify Action Menu: Delete Document', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimMediaTableMessage)
        return
      }

      // Filter for a ClaimsPortal Data Source document
      const { pinnedFilter: pinnedClaimsPortalFilter } = await mediaTab.SetTableFilter_Selection(
        Documents_Meta_DataSourceSelectionOptions.ClaimsPortal,
        DataTable_Columns_Type.Documents_Meta_DataSource
      )
      const claimsFilteredRowCount = await table.VisibleRowCount()
      expect(claimsFilteredRowCount).toBeGreaterThanOrEqual(1)

      // Open the Update Document Information Drawer for a document
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await mediaTab.SelectActionMenuItem(
        rowIndex,
        Documents_DataTable_ActionMenuItems.DeleteDocument
      )
      await mediaTab.HandleDeleteDocumentAlert(true)
      await mediaTab.page.waitForTimeout(1000)

      // Clear existing filter
      await table.CancelPinnedTableFilter(pinnedClaimsPortalFilter)
    })

    test('Media Table - Verify Action Menu: Add Tags', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimDocumentsTableMessage)
        return
      }

      // Filter for a ClaimsPortal Data Source document
      const { pinnedFilter: pinnedClaimsPortalFilter } = await mediaTab.SetTableFilter_Selection(
        Documents_Meta_DataSourceSelectionOptions.ClaimsPortal,
        DataTable_Columns_Type.Documents_Meta_DataSource
      )
      const claimsFilteredRowCount = await table.VisibleRowCount()
      expect(claimsFilteredRowCount).toBeGreaterThanOrEqual(1)

      // Open the Add Tags dialog for a document
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      const addTagsDialog = await mediaTab.OpenAddTagsByIndex(rowIndex)

      // Verify Add Tags dialog appears
      await expect(addTagsDialog.Title.locator).toBeAttached()
      await addTagsDialog.Close()
      await mediaTab.page.waitForTimeout(1000)

      // Clear existing filter
      await table.CancelPinnedTableFilter(pinnedClaimsPortalFilter)
    })

    test('Media Table - Verify File Link for viewable file', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimMediaTableMessage)
        return
      }

      // Filter for a ClaimsPortal Data Source document
      const { pinnedFilter: pinnedClaimsPortalFilter } = await mediaTab.SetTableFilter_Selection(
        Documents_Meta_DataSourceSelectionOptions.ClaimsPortal,
        DataTable_Columns_Type.Documents_Meta_DataSource
      )
      const claimsFilteredRowCount = await table.VisibleRowCount()
      expect(claimsFilteredRowCount).toBeGreaterThanOrEqual(1)

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)

      // open file from file link
      await mediaTab.OpenDocumentLinkInNewTabVerifyAndClose(rowIndex)

      // Clear existing filter
      await table.CancelPinnedTableFilter(pinnedClaimsPortalFilter)
    })

    test('Media Table - Verify File Link for previous version of viewable file', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimMediaTableMessage)
        return
      }

      // Filter for a versioned document
      const { pinnedFilter: pinnedFileFilter } = await table.SetTableFilter_Text(
        testClaim.testData.versionedMedia,
        DataTable_Columns_Type.Documents_File
      )
      const fileFilteredRowCount = await table.VisibleRowCount()
      expect(fileFilteredRowCount).toBeGreaterThanOrEqual(1)

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)

      // open file from file link
      await mediaTab.OpenVersionedDocumentLinkInNewTabVerifyAndClose(rowIndex, 1)

      // Clear existing filter
      await table.CancelPinnedTableFilter(pinnedFileFilter)
    })

    test('Update Document Information - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimMediaTableMessage)
        return
      }

      // Filter for a ClaimsPortal Data Source document
      const { pinnedFilter: pinnedClaimsPortalFilter } = await mediaTab.SetTableFilter_Selection(
        Documents_Meta_DataSourceSelectionOptions.ClaimsPortal,
        DataTable_Columns_Type.Documents_Meta_DataSource
      )
      const claimsFilteredRowCount = await table.VisibleRowCount()
      expect(claimsFilteredRowCount).toBeGreaterThanOrEqual(1)

      // Open the Update Document Information Drawer for a document
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      let updateDocumentInformationDrawer =
        await mediaTab.OpenUpdateDocumentInformationDrawer(rowIndex)

      //Verify drawer heading is "Update Document Information"
      updateDocumentInformationDrawer.VerifyTitle()

      // verify body elements - media preview, rotation buttons
      await expect(updateDocumentInformationDrawer.Link_MediaPreview.locator).toBeAttached()
      await expect(updateDocumentInformationDrawer.Button_RotateLeft.locator).toBeEnabled()
      await expect(updateDocumentInformationDrawer.Button_SaveRotation.locator).toBeDisabled()
      await expect(updateDocumentInformationDrawer.Button_RotateRight.locator).toBeEnabled()
      await expect(updateDocumentInformationDrawer.TextBox_Title.locator).toBeAttached()
      await expect(updateDocumentInformationDrawer.TextBox_Description.locator).toBeAttached()

      // verify footer elements - Cancel, Submit buttons
      await expect(updateDocumentInformationDrawer.Button_Cancel.locator).toBeEnabled()
      await expect(updateDocumentInformationDrawer.Button_Submit.locator).toBeEnabled()

      // Verify drawer closes with click on "X" button
      await updateDocumentInformationDrawer.Close()
      await expect(updateDocumentInformationDrawer.Title.locator).not.toBeAttached()
      await mediaTab.page.waitForTimeout(1000)

      updateDocumentInformationDrawer = await mediaTab.OpenUpdateDocumentInformationDrawer(rowIndex)
      // Verify drawer closes with ESC key
      await updateDocumentInformationDrawer.Close(true)
      await expect(updateDocumentInformationDrawer.Title.locator).not.toBeAttached()
      await mediaTab.page.waitForTimeout(1000)

      updateDocumentInformationDrawer = await mediaTab.OpenUpdateDocumentInformationDrawer(rowIndex)
      // Verify drawer closes if click on Cancel
      await updateDocumentInformationDrawer.Button_Cancel.Click()
      await expect(updateDocumentInformationDrawer.Title.locator).not.toBeAttached()
      await mediaTab.page.waitForTimeout(1000)

      // Clear existing filter
      await table.CancelPinnedTableFilter(pinnedClaimsPortalFilter)
    })

    test('Update Document Information - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimMediaTableMessage)
        return
      }

      // Filter for a ClaimsPortal Data Source document
      const { pinnedFilter: pinnedClaimsPortalFilter } = await mediaTab.SetTableFilter_Selection(
        Documents_Meta_DataSourceSelectionOptions.ClaimsPortal,
        DataTable_Columns_Type.Documents_Meta_DataSource
      )
      const claimsFilteredRowCount = await table.VisibleRowCount()
      expect(claimsFilteredRowCount).toBeGreaterThanOrEqual(1)

      // Open the Update Document Information Drawer for a document
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      const updateDocumentInformationDrawer =
        await mediaTab.OpenUpdateDocumentInformationDrawer(rowIndex)

      // Clear the Title text box
      await updateDocumentInformationDrawer.TextBox_Title.locator.clear()

      // Click the Submit button
      await updateDocumentInformationDrawer.Button_Submit.Click()
      await mediaTab.page.waitForTimeout(1000)

      // Verify validation message for the drawer with an empty Title field
      expect(await updateDocumentInformationDrawer.Validate()).toBe(true)

      // Click Cancel to close the drawer
      await updateDocumentInformationDrawer.Button_Cancel.Click()

      // Clear existing filter
      await table.CancelPinnedTableFilter(pinnedClaimsPortalFilter)
    })

    test('Export Media - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.RedactedClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimMediaTableMessage)
        return
      }

      // Filter for a ClaimsPortal Data Source media
      await mediaTab.SetTableFilter_Selection(
        Documents_Meta_DataSourceSelectionOptions.ClaimsPortal,
        DataTable_Columns_Type.Documents_Meta_DataSource
      )

      // Check the selection checkbox of any row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.SelectRowByIndex(rowIndex, true)

      // Click the Export Media Button
      let exportMediaDrawer = await table.OpenExportMedia()

      //Verify drawer heading is "Export 1 Media"
      exportMediaDrawer.VerifyTitle()
      expect(exportMediaDrawer.CheckBox_PublicationTarget_Redacted1.locator).toBeAttached()
      expect(exportMediaDrawer.CheckBox_PublicationTarget_Xactimate.locator).toBeAttached()

      // check the Job checkbox to display the visibility options
      const jobCheckbox = exportMediaDrawer.TargetJobCheckboxByIndex(2)
      await jobCheckbox.locator.setChecked(true)
      await expect(exportMediaDrawer.CheckBox_GroupVisibility_Coordinator.locator).toBeAttached()
      await expect(exportMediaDrawer.CheckBox_GroupVisibility_Insured.locator).toBeAttached()
      await expect(exportMediaDrawer.CheckBox_GroupVisibility_Tech.locator).toBeAttached()
      // Coordinator should be disabled
      await expect(exportMediaDrawer.CheckBox_GroupVisibility_Coordinator.locator).toBeDisabled()

      // Verify drawer closes with click on "X" button
      await exportMediaDrawer.Close()
      await expect(exportMediaDrawer.Title.locator).not.toBeAttached()
      await mediaTab.page.waitForTimeout(1000)

      exportMediaDrawer = await table.OpenExportMedia()
      // Verify drawer closes with ESC key
      await exportMediaDrawer.Close(true)
      await expect(exportMediaDrawer.Title.locator).not.toBeAttached()
      await mediaTab.page.waitForTimeout(1000)

      exportMediaDrawer = await table.OpenExportMedia()

      // Verify drawer closes if click on Close
      await exportMediaDrawer.Button_Close.Click()
      await expect(exportMediaDrawer.Title.locator).not.toBeAttached()
      await mediaTab.page.waitForTimeout(1000)
    })

    test('Export Media - Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.RedactedClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimMediaTableMessage)
        return
      }

      // filter to only user upload media
      await table.SetTableFilter_Text(
        'User Upload',
        DataTable_Columns_Type.Documents_Meta_DocumentType
      )

      // Check the selection checkbox of any media row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.SelectRowByIndex(rowIndex, true)

      // Click the Export Media Button
      const exportMediaDrawer = await table.OpenExportMedia('1')

      // Click the Submit button
      await exportMediaDrawer.Button_Submit.Click()
      await mediaTab.page.waitForTimeout(1000)

      // Verify validation message for the drawer with no checkboxes selected
      expect(await exportMediaDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await exportMediaDrawer.Button_Close.Click()
    })

    test('Update Document Visiblity - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimMediaTableMessage)
        return
      }

      // Check the selection checkbox of any media on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.SelectRowByIndex(rowIndex, true)

      // Click the Update Document Visibility Button
      let updateMediaVisiblityDrawer = await table.OpenUpdateMediaVisiblity()

      //Verify drawer heading is "Make Documents Visible to Additional Groups"
      updateMediaVisiblityDrawer.VerifyTitle()
      await expect(
        updateMediaVisiblityDrawer.CheckBox_GroupVisibility_Coordinator.locator
      ).toBeAttached()
      await expect(
        updateMediaVisiblityDrawer.CheckBox_GroupVisibility_Estimator.locator
      ).toBeAttached()
      await expect(
        updateMediaVisiblityDrawer.CheckBox_GroupVisibility_Insured.locator
      ).toBeAttached()
      // Coordinator should be disabled
      await expect(
        updateMediaVisiblityDrawer.CheckBox_GroupVisibility_Coordinator.locator
      ).toBeDisabled()

      // Verify drawer closes with click on "X" button
      await updateMediaVisiblityDrawer.Close()
      await updateMediaVisiblityDrawer.Title.locator.waitFor({ state: 'detached' })

      // Verify drawer closes with ESC key
      updateMediaVisiblityDrawer = await table.OpenUpdateMediaVisiblity()
      await updateMediaVisiblityDrawer.Close(true)
      await updateMediaVisiblityDrawer.Title.locator.waitFor({ state: 'detached' })

      // Verify drawer closes if click on Cancel
      updateMediaVisiblityDrawer = await table.OpenUpdateMediaVisiblity()
      await updateMediaVisiblityDrawer.Button_Close.Click()
      await updateMediaVisiblityDrawer.Title.locator.waitFor({ state: 'detached' })
    })

    test('Update Document Visiblity - Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimMediaTableMessage)
        return
      }

      // Check the selection checkbox of any media row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.SelectRowByIndex(rowIndex, true)

      // Click the Update Document Visibility Button
      const updateMediaVisiblityDrawer = await table.OpenUpdateMediaVisiblity()

      // Click the Submit button
      await updateMediaVisiblityDrawer.Button_Submit.Click()

      // Verify validation message for the drawer with no checkboxes selected
      expect(await updateMediaVisiblityDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await updateMediaVisiblityDrawer.Button_Close.Click()
      await updateMediaVisiblityDrawer.Title.locator.waitFor({ state: 'detached' })
    })

    test('Media Table - Pagination: Show List', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      //Verify the Documents table displayed rows updates to either all rows if < page size or page size  rows if > 50
      for (let pageSize = 50; pageSize > 0; pageSize -= 10) {
        switch (pageSize) {
          case 50:
            await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show50)
            break
          case 40:
            await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show40)
            break
          case 30:
            await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show30)
            break
          case 20:
            await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show20)
            break
          case 10:
            await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
            break
        }
        await mediaTab.page.waitForTimeout(1000)
        const pageData = await table.GetPageInfo()
        if (pageData.maxPage == 1) {
          expect(pageData.currentPageRowCount).toBeLessThanOrEqual(pageSize)
        } else {
          expect(pageData.currentPageRowCount).toBe(pageSize)
        }
      }
    })

    test('Media Table - Pagination: Navigation Buttons', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await mediaTab.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage).toBe(1)

      // make sure we are on the first page
      if (await table.Button_GoToFirstPage.IsEnabled()) {
        await table.Button_GoToFirstPage.Click()
        await mediaTab.page.waitForTimeout(1000)
      }
      // Verify the First and Previous buttons are disabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(false)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)

      await table.Button_GoToNextPage.Click()
      await mediaTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // Verify the First and Previous buttons  are now enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(true)
      // If we are on the last page, verify Next and Last buttons are disabled
      // If we are not on the last page, verify Next and Last buttons  are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).not.toBe(pageData.currentPage == lastPage)
      expect(await table.Button_GoToLastPage.IsEnabled()).not.toBe(pageData.currentPage == lastPage)

      await table.Button_GoToFirstPage.Click()
      await table.Button_GoToLastPage.Click()
      await mediaTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // Verify the First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(true)
      // Verify the Next and Last buttons are disabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(false)

      await table.Button_GoToPreviousPage.Click()
      await mediaTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // If we are not on the first page, verify First and Previous buttons are disabled
      // If we are on the first page, verify First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      expect(await table.Button_GoToFirstPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)
    })

    test('Media Table -  Pagination: Go To Page', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await mediaTab.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      //If the table is <= 10 tags, we cannot perform this test
      if (pageData.maxPage == 1) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage).toBe(1)

      // Check Last Page
      await table.Pagination_GotoPage(lastPage)
      await mediaTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display Y of Y where Y is the max page ie 3 of 3
      expect(pageData.currentPage).toBe(lastPage)

      // Check First Page
      await table.Pagination_GotoPage(1)
      await mediaTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display 1 of Y where Y is the max page ie 1 of 3
      expect(pageData.currentPage).toBe(1)

      // if Max Pages are > 2, test an intermediate number
      if (lastPage > 2) {
        // Check random middle page
        const randomPage = Math.floor(Math.random() * (lastPage - 2) + 2)
        await table.Pagination_GotoPage(randomPage)
        await mediaTab.page.waitForTimeout(1000)
        pageData = await table.GetPageInfo()

        //Verify we display X of Y where Y is the max page and X is the Random page ie 4 of 7
        expect(pageData.currentPage).toBe(randomPage)
      }
    })

    test('Media Table - - View Media: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab

      // Click the View Media button on the Media Table
      let viewMediaDialog = await mediaTab.OpenViewMediaDialog()

      // Verify rotation buttons
      await expect(viewMediaDialog.Button_RotateLeft.locator).toBeEnabled()
      await expect(viewMediaDialog.Button_SaveRotation.locator).toBeDisabled()
      await expect(viewMediaDialog.Button_RotateRight.locator).toBeEnabled()
      // Verify detail elements
      await expect(viewMediaDialog.fileLabelLocator).toBeVisible()
      await expect(viewMediaDialog.viewLinkLocator).toBeEnabled()
      await expect(viewMediaDialog.popupTriggerLocator).toBeVisible()

      // Verify View Media dialog popup - closes with click on "X" button
      await viewMediaDialog.Button_Close_X.Click()
      await viewMediaDialog.Button_SaveRotation.locator.waitFor({ state: 'detached' })

      // Verify View Media dialog popup - closes with ESC key
      viewMediaDialog = await mediaTab.OpenViewMediaDialog()
      await viewMediaDialog.Close(true)
      await viewMediaDialog.Button_SaveRotation.locator.waitFor({ state: 'detached' })
    })

    test('Media Table - - View Media: Verify Functionality', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab

      // Click the View Media button on the Media Table
      const viewMediaDialog = await mediaTab.OpenViewMediaDialog()
      const initialfileName = await viewMediaDialog.fileLabelLocator.textContent()

      await viewMediaDialog.Button_NextSlide.Click()
      let currentfileName = await viewMediaDialog.fileLabelLocator.textContent()
      expect(initialfileName).not.toBe(currentfileName)

      await viewMediaDialog.Button_PreviousSlide.Click()
      currentfileName = await viewMediaDialog.fileLabelLocator.textContent()
      expect(initialfileName).toBe(currentfileName)

      await viewMediaDialog.Button_PreviousSlide.Click()
      currentfileName = await viewMediaDialog.fileLabelLocator.textContent()
      expect(initialfileName).not.toBe(currentfileName)

      await viewMediaDialog.Button_NextSlide.Click()
      currentfileName = await viewMediaDialog.fileLabelLocator.textContent()
      expect(initialfileName).toBe(currentfileName)
    })

    test('Media Table - Verify toplevel selection of versioned media does not select older versions', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as ClaimsPortalClaimMediaTab
      const table = mediaTab.DataTable_Media

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimMediaTableMessage)
        return
      }

      // Filter for a versioned document
      await table.SetTableFilter_Text(
        testClaim.testData.versionedMedia,
        DataTable_Columns_Type.Documents_File
      )

      let fileFilteredRowCount = await table.VisibleRowCount()
      expect(fileFilteredRowCount).toBeGreaterThanOrEqual(1)

      // select parent (most recent)
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.SelectRowByIndex(rowIndex, true)

      const selectionBadgeCount = await table.SelectionBadgeCount()
      expect(selectionBadgeCount).toBe(1)

      // expand the versioned row
      await table.ClickButtonInDataCell(rowIndex, DataTable_Columns_Type.Documents_File)

      // count should be > 1 now
      fileFilteredRowCount = await table.VisibleRowCount()
      expect(fileFilteredRowCount).toBeGreaterThan(1)

      // previous version should NOT be selected
      const isSelected = await table.IsRowSelectedByIndex(`${rowIndex}.0`)
      expect(isSelected).toBe(false)
    })
  }
)
