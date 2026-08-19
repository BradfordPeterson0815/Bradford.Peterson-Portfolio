import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedClaimTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { FetchCannedClaim } from '../../../library/delegatePortal/delegatePortalHelper.js'
import { LaunchFieldAgent } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalClaimPage } from '../../../library/delegatePortal/pages/delegatePortalClaimPage.js'
import { DelegatePortalEstimateDetailsPage } from '../../../library/delegatePortal/pages/delegatePortalEstimateDetailsPage.js'
import { AbortTest } from '../../../library/shared/commonHelper.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Page: Estimate Details Page',
  {
    tag: [Tags.Delegate, Tags.FieldAgent, Tags.Claim, Tags.Estimates, Tags.InfoDetails],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim estimate
      const estimateDetailsPage = new DelegatePortalEstimateDetailsPage(
        global,
        testClaim,
        claimPage.baseURL
      )
      await estimateDetailsPage.NavigateDirectly(testClaim.testData.claimEstimateId)

      // Verify <-Estimates back button exists
      expect(await estimateDetailsPage.Button_BackToEstimates.IsVisible()).toBe(true)

      // Verify sections
      await estimateDetailsPage.VerifySummarySection()
      await estimateDetailsPage.VerifyDetailsSection()
      await estimateDetailsPage.VerifyNotesSection()
      await estimateDetailsPage.VerifyClaimDocumentsSection()
      await estimateDetailsPage.VerifyReviewsSection()

      // Navigate back to the parent estimate tab
      await estimateDetailsPage.Button_BackToEstimates.Click()
      // Verify we land on the Estimates page
      expect(estimateDetailsPage.page.url().endsWith('estimates')).toBe(true)
    })

    test('Claim Documents Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim estimate
      const estimateDetailsPage = new DelegatePortalEstimateDetailsPage(
        global,
        testClaim,
        claimPage.baseURL
      )
      await estimateDetailsPage.NavigateDirectly(testClaim.testData.claimEstimateId)
      const table = estimateDetailsPage.DataTable_ClaimDocuments

      // Click the Open Table Settings button on the Documents Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await estimateDetailsPage.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Claim Documents Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Delegate Field Agent home page
        const { global } = await LaunchFieldAgent(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        // Now navigate directly to the Details page for our test claim estimate
        const estimateDetailsPage = new DelegatePortalEstimateDetailsPage(
          global,
          testClaim,
          claimPage.baseURL
        )
        await estimateDetailsPage.NavigateDirectly(testClaim.testData.claimEstimateId)
        const table = estimateDetailsPage.DataTable_ClaimDocuments

        // Click the Open Table Settings button on the Documents Table
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
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Documents_Tags)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_Tags)).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Documents_File)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_File)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Documents_Description)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_Description)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Documents_FileName)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_FileName)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Documents_Tags)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_Tags)).toBe(true)
        await tableSettingsDialog.Close()
      })

      test('Claim Documents Table - Sort Columns', async ({ browser }) => {
        // launch the Delegate Field Agent home page
        const { global } = await LaunchFieldAgent(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        // Now navigate directly to the Details page for our test claim estimate
        const estimateDetailsPage = new DelegatePortalEstimateDetailsPage(
          global,
          testClaim,
          claimPage.baseURL
        )
        await estimateDetailsPage.NavigateDirectly(testClaim.testData.claimEstimateId)
        const table = estimateDetailsPage.DataTable_ClaimDocuments

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

    test('Claim Documents Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim estimate
      const estimateDetailsPage = new DelegatePortalEstimateDetailsPage(
        global,
        testClaim,
        claimPage.baseURL
      )
      await estimateDetailsPage.NavigateDirectly(testClaim.testData.claimEstimateId)
      const table = estimateDetailsPage.DataTable_ClaimDocuments

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // Click the Open Table Search button on the Documents Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await estimateDetailsPage.page.waitForTimeout(1000)
    })

    test('Claim Documents Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim estimate
      const estimateDetailsPage = new DelegatePortalEstimateDetailsPage(
        global,
        testClaim,
        claimPage.baseURL
      )
      await estimateDetailsPage.NavigateDirectly(testClaim.testData.claimEstimateId)
      const table = estimateDetailsPage.DataTable_ClaimDocuments

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields
      const fileSearchTerm = testClaim.testData.claimsDocument
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

    test('Claim Documents Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim estimate
      const estimateDetailsPage = new DelegatePortalEstimateDetailsPage(
        global,
        testClaim,
        claimPage.baseURL
      )
      await estimateDetailsPage.NavigateDirectly(testClaim.testData.claimEstimateId)
      const table = estimateDetailsPage.DataTable_ClaimDocuments

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimEstimateDetailsDocumentsTableMessage)
        return
      }

      // Click the Add Table Filter button on the Documents Table
      let tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Documents_File)

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await estimateDetailsPage.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Documents_File)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Claim Documents Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim estimate
      const estimateDetailsPage = new DelegatePortalEstimateDetailsPage(
        global,
        testClaim,
        claimPage.baseURL
      )
      await estimateDetailsPage.NavigateDirectly(testClaim.testData.claimEstimateId)
      const table = estimateDetailsPage.DataTable_ClaimDocuments

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimEstimateDetailsDocumentsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const fileFilterTerm = testClaim.testData.claimsDocument
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
      const descriptionFilterTerm = testClaim.testData.documentDescription
      const { tableFilterDialog } = await table.SetTableFilter_Text(
        descriptionFilterTerm,
        DataTable_Columns_Type.Documents_Description,
        false,
        true
      )

      // Verify table is filtered
      const filteredRowCount = await table.VisibleRowCount()
      expect(filteredRowCount).toBeLessThan(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const filterOffRowCount = await table.VisibleRowCount()
      expect(filterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Claim Documents Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim estimate
      const estimateDetailsPage = new DelegatePortalEstimateDetailsPage(
        global,
        testClaim,
        claimPage.baseURL
      )
      await estimateDetailsPage.NavigateDirectly(testClaim.testData.claimEstimateId)
      const table = estimateDetailsPage.DataTable_ClaimDocuments

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimEstimateDetailsDocumentsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const fileFilterTerm = testClaim.testData.claimsDocument
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

    test('Claim Documents Table - Expand and Collapse', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim estimate
      const estimateDetailsPage = new DelegatePortalEstimateDetailsPage(
        global,
        testClaim,
        claimPage.baseURL
      )
      await estimateDetailsPage.NavigateDirectly(testClaim.testData.claimEstimateId)
      const table = estimateDetailsPage.DataTable_ClaimDocuments

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

    test('Claim Documents Table - Verify File Link for viewable file', async ({
      browser,
      browserName,
      headless,
    }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)
      const downloading = browserName === 'chromium' && headless === true
      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim estimate
      const estimateDetailsPage = new DelegatePortalEstimateDetailsPage(
        global,
        testClaim,
        claimPage.baseURL
      )
      await estimateDetailsPage.NavigateDirectly(testClaim.testData.claimEstimateId)
      const table = estimateDetailsPage.DataTable_ClaimDocuments

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimEstimateDetailsDocumentsTableMessage)
        return
      }

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimDocumentsTableMessage)
        return
      }

      // Verify setting the filter causes the table results to filter on the selected column only
      const fileFilterTerm = testClaim.testData.claimsDocument
      const { pinnedFilter: filePinnedFilter } = await table.SetTableFilter_Text(
        fileFilterTerm,
        DataTable_Columns_Type.Documents_File
      )
      const filteredRowCount = await table.VisibleRowCount()
      expect(filteredRowCount).toBeGreaterThanOrEqual(1)

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      // open file from file link
      await estimateDetailsPage.OpenDocumentLinkInNewTabVerifyAndClose(rowIndex, downloading)

      // Clear existing filter
      await table.CancelPinnedTableFilter(filePinnedFilter)
    })
  }
)
