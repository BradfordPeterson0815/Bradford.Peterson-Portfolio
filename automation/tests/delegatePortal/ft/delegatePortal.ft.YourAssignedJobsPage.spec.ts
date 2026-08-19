import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedJobTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DataTable_ShowPageSize_Options,
  DefaultEnvironment,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { FetchCannedJob } from '../../../library/delegatePortal/delegatePortalHelper.js'
import { LaunchFieldTech } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { AbortTest } from '../../../library/shared/commonHelper.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Your Assigned Jobs Page',
  {
    tag: [Tags.Delegate, Tags.FieldTech, Tags.Jobs],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { homePage } = await LaunchFieldTech(browser, environment)
      const table = homePage.DataTable_YourAssignedJobs

      // Verify the title label of "Your Assigned Jobs" top left
      await homePage.VerifyTitle()

      // Verify the Your Assigned Jobs table
      expect(await table.IsVisible()).toBe(true)

      // Verify Your Assigned Jobs Table layout...
      // Verify Your Assigned Jobs Column Settings / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // if table is not empty then verify Global Search Button
      if (!(await table.IsEmpty())) {
        await table.Button_OpenTableSearch.locator.waitFor({ state: 'visible' })
      }
    })

    test('Your Assigned Jobs Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { homePage } = await LaunchFieldTech(browser, environment)
      const table = homePage.DataTable_YourAssignedJobs

      // Click the Open Table Settings button on the Your Assigned Jobs Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)
    })

    test('Your Assigned Jobs Table - Settings: Verify Columns', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { homePage } = await LaunchFieldTech(browser, environment)
      const table = homePage.DataTable_YourAssignedJobs

      // Click the Open Table Settings button on the Your Assigned Jobs Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify that each column checkbox hides the corresponding table column when unchecked
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_JobLabel)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_JobLabel)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_Type)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Type)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_Services)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Services)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_Description)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Description)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_Location)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Location)).toBe(false)

      // Verify that each column checkbox shows the corresponding table column when checked
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_JobLabel)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_JobLabel)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Type)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Type)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Services)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Services)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Description)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Description)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Location)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Location)).toBe(true)
    })

    test('Your Assigned Jobs Table - Expand and Collapse', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { homePage } = await LaunchFieldTech(browser, environment)
      const table = homePage.DataTable_YourAssignedJobs

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

    test('Your Assigned Jobs Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { homePage } = await LaunchFieldTech(browser, environment)
      const table = homePage.DataTable_YourAssignedJobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // Click the Open Table Search button on the table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)
    })

    test('Your Assigned Jobs Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const { homePage } = await LaunchFieldTech(browser, environment)
      const table = homePage.DataTable_YourAssignedJobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields
      await table.SetTableSearch(testJob.jobDetails.jobNumber)

      let filteredRowCount = await table.VisibleRowCount()
      if (initialRowCount > 1) {
        expect(filteredRowCount).toBeLessThan(initialRowCount)
      }

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      //  and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      let filteredOffRowCount = await table.VisibleRowCount()
      expect(filteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      const searchTerm = 'NoMatchExpected'
      const tableSearchDialog = await table.SetTableSearch(searchTerm, true)

      // Verify table is filtered
      filteredRowCount = await table.VisibleRowCount()
      expect(filteredRowCount).toBeLessThan(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      filteredOffRowCount = await table.VisibleRowCount()
      expect(filteredOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Your Assigned Jobs Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { homePage } = await LaunchFieldTech(browser, environment)
      const table = homePage.DataTable_YourAssignedJobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedJobsTableMessage)
        return
      }

      // Click the Add Table Filter button on the table
      let tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Jobs_JobLabel)

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Jobs_Description)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Your Assigned Jobs Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const { homePage } = await LaunchFieldTech(browser, environment)
      const table = homePage.DataTable_YourAssignedJobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedJobsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const filterTerm = 'No Match Expected'
      const { pinnedFilter: pinnedFilter } = await table.SetTableFilter_Text(
        filterTerm,
        DataTable_Columns_Type.Jobs_Location_City
      )
      let filteredRowCount = await table.VisibleRowCount()
      expect(filteredRowCount).toBe(0)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(pinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(pinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(pinnedFilter)).toBe(false)
      let filterOffRowCount = await table.VisibleRowCount()
      expect(filterOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const { tableFilterDialog } = await table.SetTableFilter_Text(
        testJob.jobDetails.jobNumber,
        DataTable_Columns_Type.Jobs_JobLabel,
        false,
        true
      )

      // Verify table is filtered
      filteredRowCount = await table.VisibleRowCount()
      expect(filteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      filterOffRowCount = await table.VisibleRowCount()
      expect(filterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Your Assigned Jobs Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const { homePage } = await LaunchFieldTech(browser, environment)
      const table = homePage.DataTable_YourAssignedJobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedJobsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const { pinnedFilter: jobPinnedFilter } = await table.SetTableFilter_Text(
        testJob.jobDetails.jobNumber,
        DataTable_Columns_Type.Jobs_JobLabel
      )
      const jobFilteredRowCount = await table.VisibleRowCount()
      expect(jobFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(jobPinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedNameFilterTerm = 'There can be no matches'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedNameFilterTerm,
        DataTable_Columns_Type.Jobs_JobLabel,
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

    test('Your Assigned Jobs Table - Verify Job Number/Link button', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const { homePage } = await LaunchFieldTech(browser, environment)
      const table = homePage.DataTable_YourAssignedJobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedJobsTableMessage)
        return
      }

      await table.SetTableFilter_Text(
        testJob.jobDetails.jobNumber,
        DataTable_Columns_Type.Jobs_JobLabel
      )
      const jobFilteredRowCount = await table.VisibleRowCount()
      expect(jobFilteredRowCount).toBe(1)

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.ClickLinkInDataCell(rowIndex, DataTable_Columns_Type.Jobs_JobLabel)

      // verify we navigated to the jobs page of the target
      await homePage.page.waitForTimeout(3000)
      expect(homePage.page.url().endsWith(`jobs/${testJob.jobDetails.jobId}/info`)).toBe(true)
    })

    test('Your Assigned Jobs Table - Sort Columns', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { homePage } = await LaunchFieldTech(browser, environment)
      const table = homePage.DataTable_YourAssignedJobs

      // Make sure the columns we need are visible
      const tableSettingsDialog = await table.OpenTableSettings()
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Services)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Type)
      await tableSettingsDialog.Close()

      // Examine Type and Services columns
      // Verify initial states are unsorted
      const initialServicesSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Jobs_Services
      )
      const initialTypeSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Jobs_Type
      )
      expect(initialServicesSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(initialTypeSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the Services column Sort icon to Down (high to low)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Jobs_Services,
        DataTable_Column_SortState.Down_HighToLow
      )

      // Verify Services is sorted Down and Type is still unsorted
      let currentServicesSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Jobs_Services
      )
      let currentTypeSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Jobs_Type)
      expect(currentServicesSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
      expect(currentTypeSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the Type column Sort icon to Up (low to high)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Jobs_Type,
        DataTable_Column_SortState.Up_LowToHigh
      )

      // Verify Services is now unsorted and Type is sorted Up
      currentServicesSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Jobs_Services
      )
      currentTypeSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Jobs_Type)
      expect(currentServicesSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(currentTypeSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

      // Set the Type column Sort icon to Unsorted
      await table.SetColumnSortState(
        DataTable_Columns_Type.Jobs_Type,
        DataTable_Column_SortState.Unsorted
      )
      currentTypeSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Jobs_Type)
      expect(currentTypeSortState).toBe(DataTable_Column_SortState.Unsorted)
    })

    test('Your Assigned Jobs Table - Pagination: Show List', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { homePage } = await LaunchFieldTech(browser, environment)
      const table = homePage.DataTable_YourAssignedJobs

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      //Verify the Tag Keys table displayed rows updates to either all rows if < page size or page size  rows if > 50
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
        await homePage.page.waitForTimeout(1000)
        const pageData = await table.GetPageInfo()
        if (pageData.maxPage == 1) {
          expect(pageData.currentPageRowCount).toBeLessThanOrEqual(pageSize)
        } else {
          expect(pageData.currentPageRowCount).toBe(pageSize)
        }
      }
    })

    test('Your Assigned Jobs Table - Pagination: Navigation Buttons', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { homePage } = await LaunchFieldTech(browser, environment)
      const table = homePage.DataTable_YourAssignedJobs

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await homePage.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage).toBe(1)

      // make sure we are on the first page
      if (await table.Button_GoToFirstPage.IsEnabled()) {
        await table.Button_GoToFirstPage.Click()
        await homePage.page.waitForTimeout(1000)
      }
      // Verify the First and Previous buttons are disabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(false)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)

      await table.Button_GoToNextPage.Click()
      await homePage.page.waitForTimeout(1000)
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
      await homePage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // Verify the First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(true)
      // Verify the Next and Last buttons are disabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(false)

      await table.Button_GoToPreviousPage.Click()
      await homePage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // If we are not on the first page, verify First and Previous buttons are disabled
      // If we are on the first page, verify First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      expect(await table.Button_GoToFirstPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)
    })

    test('Your Assigned Jobs Table - Pagination: Go To Page', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { homePage } = await LaunchFieldTech(browser, environment)
      const table = homePage.DataTable_YourAssignedJobs

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await homePage.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      //If the table is <= 10 tags, we cannot perform this test
      if (pageData.maxPage == 1) {
        return
      }

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage).toBe(1)

      // Check Last Page
      await table.Pagination_GotoPage(lastPage)
      await homePage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display Y of Y where Y is the max page ie 3 of 3
      expect(pageData.currentPage).toBe(lastPage)

      // Check First Page
      await table.Pagination_GotoPage(1)
      await homePage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display 1 of Y where Y is the max page ie 1 of 3
      expect(pageData.currentPage).toBe(1)

      // if Max Pages are > 2, test an intermediate number
      if (lastPage > 2) {
        // Check random middle page
        const randomPage = Math.floor(Math.random() * (lastPage - 2) + 2)
        await table.Pagination_GotoPage(randomPage)
        await homePage.page.waitForTimeout(1000)
        pageData = await table.GetPageInfo()

        //Verify we display X of Y where Y is the max page and X is the Random page ie 4 of 7
        expect(pageData.currentPage).toBe(randomPage)
      }
    })
  }
)
