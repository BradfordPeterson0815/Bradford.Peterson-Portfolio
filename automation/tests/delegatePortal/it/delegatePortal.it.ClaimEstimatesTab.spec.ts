import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedClaimTypes,
  ClaimTabTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DataTable_ShowPageSize_Options,
  DefaultEnvironment,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { FetchCannedClaim } from '../../../library/delegatePortal/delegatePortalHelper.js'
import { LaunchInspectionTech } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalClaimPage } from '../../../library/delegatePortal/pages/delegatePortalClaimPage.js'
import { DelegatePortalClaimEstimatesTab } from '../../../library/delegatePortal/tabs/delegatePortalClaimEstimatesTab.js'
import { AbortTest } from '../../../library/shared/commonHelper.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Page: Estimates Tab',
  {
    tag: [Tags.Delegate, Tags.InspectionTech, Tags.Claim, Tags.Estimates],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Estimates tab
      const estimatesTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Estimates
      )) as DelegatePortalClaimEstimatesTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Estimates)).toBe(true)
      expect(claimPage.page.url()).toBe(estimatesTab.URL)
      const table = estimatesTab.DataTable_Estimates

      // Verify Title
      await estimatesTab.Title_Estimates.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Estimates Table layout...
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

    test('Estimates Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Estimates tab
      const estimatesTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Estimates
      )) as DelegatePortalClaimEstimatesTab
      const table = estimatesTab.DataTable_Estimates

      // Click the Open Table Settings button on the Estimates Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await estimatesTab.page.waitForTimeout(1000)
    })
    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Estimates Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Delegate Inspection Tech home page
        const { global } = await LaunchInspectionTech(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim, then navigate to the Estimates tab
        const estimatesTab = (await claimPage.SelectClaimTab(
          ClaimTabTypes.Estimates
        )) as DelegatePortalClaimEstimatesTab
        const table = estimatesTab.DataTable_Estimates

        // Click the Open Table Settings button on the Estimates Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Estimates_SubmissionDate)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Estimates_SubmissionDate)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Estimates_SubmittedBy)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Estimates_SubmittedBy)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Estimates_EstimateAmount)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Estimates_EstimateAmount)).toBe(
          false
        )

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Estimates_SubmissionDate)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Estimates_SubmissionDate)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Estimates_SubmittedBy)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Estimates_SubmittedBy)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Estimates_EstimateAmount)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Estimates_EstimateAmount)).toBe(
          true
        )
        await tableSettingsDialog.Close()
      })

      test('Estimates Table - Sort Columns', async ({ browser }) => {
        // launch the Delegate Inspection Tech home page
        const { global } = await LaunchInspectionTech(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim, then navigate to the Estimates tab
        const estimatesTab = (await claimPage.SelectClaimTab(
          ClaimTabTypes.Estimates
        )) as DelegatePortalClaimEstimatesTab
        const table = estimatesTab.DataTable_Estimates

        // Examine SubmissionDate and SubmittedBy columns
        // Verify initial states
        const initialSubmissionDateSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Estimates_SubmissionDate
        )
        const initialSubmittedBySortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Estimates_SubmittedBy
        )
        expect(initialSubmissionDateSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialSubmittedBySortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the SubmittedBy column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Estimates_SubmittedBy,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify SubmittedBy is sorted Down and SubmissionDate is now unsorted
        let currentSubmittedBySortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Estimates_SubmittedBy
        )
        let currentSubmissionDateSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Estimates_SubmissionDate
        )
        expect(currentSubmittedBySortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentSubmissionDateSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the SubmittedBy column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Estimates_SubmittedBy,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify Submission Date is still unsorted and SubmittedBy is sorted Up
        currentSubmissionDateSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Estimates_SubmissionDate
        )
        currentSubmittedBySortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Estimates_SubmittedBy
        )

        expect(currentSubmissionDateSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentSubmittedBySortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the SubmittedBy column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.Estimates_SubmittedBy,
          DataTable_Column_SortState.Unsorted
        )
        currentSubmittedBySortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Estimates_SubmittedBy
        )
        expect(currentSubmittedBySortState).toBe(DataTable_Column_SortState.Unsorted)
      })
    })

    test('Estimates Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Estimates tab
      const estimatesTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Estimates
      )) as DelegatePortalClaimEstimatesTab
      const table = estimatesTab.DataTable_Estimates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // Click the Open Table Search button on the Estimates Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await estimatesTab.page.waitForTimeout(1000)
    })

    test('Estimates Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Estimates tab
      const estimatesTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Estimates
      )) as DelegatePortalClaimEstimatesTab
      const table = estimatesTab.DataTable_Estimates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields
      const submittedBySearchTerm = testClaim.testData.claimEstimatesSubmittedBy
      await table.SetTableSearch(submittedBySearchTerm)

      const notesFilteredRowCount = await table.VisibleRowCount()
      expect(notesFilteredRowCount).toBe(1)

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      // and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      const descriptionFilteredOffRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      const tableSearchDialog = await table.SetTableSearch(submittedBySearchTerm, true)

      // Verify table is filtered
      const submittedByFilteredRowCount = await table.VisibleRowCount()
      expect(submittedByFilteredRowCount).toBe(1)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const submittedByFilterOffRowCount = await table.VisibleRowCount()
      expect(submittedByFilterOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Estimates Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Estimates tab
      const estimatesTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Estimates
      )) as DelegatePortalClaimEstimatesTab
      const table = estimatesTab.DataTable_Estimates

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimEstimatesTableMessage)
        return
      }

      // Click the Add Table Filter button on the Estimates Table
      const tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.Estimates_EstimateAmount
      )

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()
    })

    test('Estimates Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Estimates tab
      const estimatesTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Estimates
      )) as DelegatePortalClaimEstimatesTab
      const table = estimatesTab.DataTable_Estimates

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimEstimatesTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const submittedByFilterTerm = testClaim.testData.claimEstimatesSubmittedBy
      const { pinnedFilter: notesPinnedFilter } = await table.SetTableFilter_Text(
        submittedByFilterTerm,
        DataTable_Columns_Type.Estimates_SubmittedBy
      )
      const notesFilteredRowCount = await table.VisibleRowCount()
      expect(notesFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(notesPinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(notesPinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(notesPinnedFilter)).toBe(false)
      const notesFilteredOffRowCount = await table.VisibleRowCount()
      expect(notesFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const { tableFilterDialog } = await table.SetTableFilter_Text(
        submittedByFilterTerm,
        DataTable_Columns_Type.Estimates_SubmittedBy,
        false,
        true
      )

      // Verify table is filtered
      const submittedByFilteredRowCount = await table.VisibleRowCount()
      expect(submittedByFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const submittedByFilterOffRowCount = await table.VisibleRowCount()
      expect(submittedByFilterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Estimates Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Estimates tab
      const estimatesTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Estimates
      )) as DelegatePortalClaimEstimatesTab
      const table = estimatesTab.DataTable_Estimates

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimEstimatesTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const submittedByFilterTerm = testClaim.testData.claimEstimatesSubmittedBy
      const { pinnedFilter: notesPinnedFilter } = await table.SetTableFilter_Text(
        submittedByFilterTerm,
        DataTable_Columns_Type.Estimates_SubmittedBy
      )
      const notesFilteredRowCount = await table.VisibleRowCount()
      expect(notesFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(notesPinnedFilter)).toBe(true)

      // Edit the existing filter
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        'No Match Expected',
        DataTable_Columns_Type.Estimates_SubmittedBy,
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

    test('Estimates Table - Expand and Collapse', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Estimates tab
      const estimatesTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Estimates
      )) as DelegatePortalClaimEstimatesTab
      const table = estimatesTab.DataTable_Estimates

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

    test('View Estimate - Verify Navigation', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Estimates tab
      const estimatesTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Estimates
      )) as DelegatePortalClaimEstimatesTab
      const table = estimatesTab.DataTable_Estimates

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimEstimatesTableMessage)
        return
      }

      // Filter our loss of use entry used for opening
      await table.SetTableFilter_Text(
        testClaim.testData.claimEstimateSubmittedBy,
        DataTable_Columns_Type.Estimates_SubmittedBy
      )
      const idFilteredRowCount = await table.VisibleRowCount()
      expect(idFilteredRowCount).toBe(3)

      // Click View Estimate link on 1st entry in Estimates table -
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.ClickLinkInDataCell_ProvideName(rowIndex, table.actionMenuName)

      // Verify we land on the Estimate details page
      expect(estimatesTab.page.url().endsWith(testClaim.testData.claimEstimateId)).toBe(true)
    })

    test('Estimates Table - Pagination: Show List', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Estimates tab
      const estimatesTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Estimates
      )) as DelegatePortalClaimEstimatesTab
      const table = estimatesTab.DataTable_Estimates

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      //Verify the Loss of Use table displayed rows updates to either all rows if < page size or page size  rows if > 50
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
        await estimatesTab.page.waitForTimeout(1000)
        const pageData = await table.GetPageInfo()
        if (pageData.maxPage == 1) {
          expect(pageData.currentPageRowCount <= pageSize).toBeLessThanOrEqual(pageSize)
        } else {
          expect(pageData.currentPageRowCount).toBe(pageSize)
        }
      }
    })

    test('Estimates Table - Pagination: Navigation Buttons', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Estimates tab
      const estimatesTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Estimates
      )) as DelegatePortalClaimEstimatesTab
      const table = estimatesTab.DataTable_Estimates

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await estimatesTab.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage).toBe(1)

      // make sure we are on the first page
      if (await table.Button_GoToFirstPage.IsEnabled()) {
        await table.Button_GoToFirstPage.Click()
        await estimatesTab.page.waitForTimeout(1000)
      }
      // Verify the First and Previous buttons are disabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(false)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)

      await table.Button_GoToNextPage.Click()
      await estimatesTab.page.waitForTimeout(1000)
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
      await estimatesTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // Verify the First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(true)
      // Verify the Next and Last buttons are disabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(false)

      await table.Button_GoToPreviousPage.Click()
      await estimatesTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // If we are not on the first page, verify First and Previous buttons are disabled
      // If we are on the first page, verify First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      expect(await table.Button_GoToFirstPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)
    })

    test('Estimates Table - Pagination: Go To Page', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Estimates tab
      const estimatesTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Estimates
      )) as DelegatePortalClaimEstimatesTab
      const table = estimatesTab.DataTable_Estimates

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await estimatesTab.page.waitForTimeout(1000)
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
      await estimatesTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display Y of Y where Y is the max page ie 3 of 3
      expect(pageData.currentPage).toBe(lastPage)

      // Check First Page
      await table.Pagination_GotoPage(1)
      await estimatesTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display 1 of Y where Y is the max page ie 1 of 3
      expect(pageData.currentPage).toBe(1)

      // if Max Pages are > 2, test an intermediate number
      if (lastPage > 2) {
        // Check random middle page
        const randomPage = Math.floor(Math.random() * (lastPage - 2) + 2)
        await table.Pagination_GotoPage(randomPage)
        await estimatesTab.page.waitForTimeout(1000)
        pageData = await table.GetPageInfo()

        //Verify we display X of Y where Y is the max page and X is the Random page ie 4 of 7
        expect(pageData.currentPage).toBe(randomPage)
      }
    })
  }
)
