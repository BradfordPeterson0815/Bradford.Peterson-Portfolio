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
import { LaunchFieldAgent } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalClaimPage } from '../../../library/delegatePortal/pages/delegatePortalClaimPage.js'
import { DelegatePortalClaimInspectionsTab } from '../../../library/delegatePortal/tabs/delegatePortalClaimInspectionsTab.js'
import { DelegatePortalInspectionDetailsTab } from '../../../library/delegatePortal/tabs/delegatePortalInspectionDetailsTab.js'
import { AbortTest } from '../../../library/shared/commonHelper.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Page: Inspection Details Tab',
  {
    tag: [Tags.Delegate, Tags.FieldAgent, Tags.Claim, Tags.Inspection, Tags.InfoDetails],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Inspections
      )) as DelegatePortalClaimInspectionsTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Inspections)).toBe(true)
      expect(claimPage.page.url()).toBe(inspectionsTab.URL)
      const inspectionsTable = inspectionsTab.DataTable_Inspections

      // Filter our inspection used for opening
      await inspectionsTable.SetTableFilter_Text(
        testClaim.testData.claimInspectionDescription,
        DataTable_Columns_Type.Inspections_Description
      )
      const descriptionFilteredRowCount = await inspectionsTable.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBeGreaterThanOrEqual(1)

      // open the inspection
      const rowIndex = await inspectionsTable.FetchRowIndexFromRowPosition(1)
      const inspectionDetailsTab = await inspectionsTab.OpenInspection(rowIndex)
      const table = inspectionDetailsTab.DataTable_InspectionScreenshots

      // Verify Time Range
      await inspectionDetailsTab.InspectionDurationRange.VerifyExpectedText(
        testClaim.testData.claimInspectionDuration
      )

      // Verify Inspection Description
      await inspectionDetailsTab.InspectionDescription.VerifyExpectedText(
        testClaim.testData.claimInspectionDescription
      )

      // Verify Inspection Video Section
      await inspectionDetailsTab.InspectionVideoTitle.VerifyExpectedText()
      expect(await inspectionDetailsTab.IsVideoAvailable()).toBe(true)
      expect(await inspectionDetailsTab.Button_Screenshot.IsVisible()).toBe(true)
      expect(await inspectionDetailsTab.IsTranscriptAvailable(true)).toBe(true)

      // Verify Inspection Screenshots Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Share Link button exists
      expect(await inspectionDetailsTab.Button_GetShareLink.IsVisible()).toBe(true)

      // Verify Inspection Screenshots Table layout...
      // Verify Column Settings / Filters / Refresh Data / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_RefreshData.IsVisible()).toBe(true)
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

    test('Inspection Screenshots Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      const inspectionDetailsTab = new DelegatePortalInspectionDetailsTab(global, claimPage.baseURL)
      await inspectionDetailsTab.NavigateDirectly(testClaim.testData.claimInspectionSuffix)
      const table = inspectionDetailsTab.DataTable_InspectionScreenshots

      // Click the Open Table Settings button on the Inspection Screenshots Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await inspectionDetailsTab.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Inspection Screenshots Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Delegate Field Agent home page
        const { global } = await LaunchFieldAgent(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        const inspectionDetailsTab = new DelegatePortalInspectionDetailsTab(global, claimPage.baseURL)
        await inspectionDetailsTab.NavigateDirectly(testClaim.testData.claimInspectionSuffix)
        const table = inspectionDetailsTab.DataTable_InspectionScreenshots

        // Click the Open Table Settings button on the Inspection Screenshots Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.InspectionScreenshots_Label)
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.InspectionScreenshots_Label)
        ).toBe(false)
        await tableSettingsDialog.UncheckColumn(
          DataTable_Columns_Type.InspectionScreenshots_Description
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.InspectionScreenshots_Description)
        ).toBe(false)
        await tableSettingsDialog.UncheckColumn(
          DataTable_Columns_Type.InspectionScreenshots_FileName
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.InspectionScreenshots_FileName)
        ).toBe(false)
        await tableSettingsDialog.UncheckColumn(
          DataTable_Columns_Type.InspectionScreenshots_DateUploaded
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.InspectionScreenshots_DateUploaded)
        ).toBe(false)
        await tableSettingsDialog.UncheckColumn(
          DataTable_Columns_Type.InspectionScreenshots_DateTaken
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.InspectionScreenshots_DateTaken)
        ).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.InspectionScreenshots_Label)
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.InspectionScreenshots_Label)
        ).toBe(true)
        await tableSettingsDialog.CheckColumn(
          DataTable_Columns_Type.InspectionScreenshots_Description
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.InspectionScreenshots_Description)
        ).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.InspectionScreenshots_FileName)
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.InspectionScreenshots_FileName)
        ).toBe(true)
        await tableSettingsDialog.CheckColumn(
          DataTable_Columns_Type.InspectionScreenshots_DateUploaded
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.InspectionScreenshots_DateUploaded)
        ).toBe(true)
        await tableSettingsDialog.CheckColumn(
          DataTable_Columns_Type.InspectionScreenshots_DateTaken
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.InspectionScreenshots_DateTaken)
        ).toBe(true)
        await tableSettingsDialog.Close()
      })

      test('Inspection Screenshots Table - Sort Columns', async ({ browser }) => {
        // launch the Delegate Field Agent home page
        const { global } = await LaunchFieldAgent(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        const inspectionDetailsTab = new DelegatePortalInspectionDetailsTab(global, claimPage.baseURL)
        await inspectionDetailsTab.NavigateDirectly(testClaim.testData.claimInspectionSuffix)
        const table = inspectionDetailsTab.DataTable_InspectionScreenshots

        // Make sure the columns we need are visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(
          DataTable_Columns_Type.InspectionScreenshots_DateUploaded
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.InspectionScreenshots_Label)
        await tableSettingsDialog.Close()

        // Examine File and Created columns
        // Verify initial states are unsorted
        const initialCreatedSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.InspectionScreenshots_DateUploaded
        )
        const initialLabelSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.InspectionScreenshots_Label
        )
        expect(initialCreatedSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialLabelSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Created column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.InspectionScreenshots_DateUploaded,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify Created is sorted Down and File is still unsorted
        let currentCreatedSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.InspectionScreenshots_DateUploaded
        )
        let currentLabelSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.InspectionScreenshots_Label
        )
        expect(currentCreatedSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentLabelSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the File column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.InspectionScreenshots_Label,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify Created is now unsorted and File is sorted Up
        currentCreatedSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.InspectionScreenshots_DateUploaded
        )
        currentLabelSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.InspectionScreenshots_Label
        )
        expect(currentCreatedSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentLabelSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the File column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.InspectionScreenshots_Label,
          DataTable_Column_SortState.Unsorted
        )
        currentLabelSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.InspectionScreenshots_Label
        )
        expect(currentLabelSortState).toBe(DataTable_Column_SortState.Unsorted)
      })
    })

    test('Inspection Screenshots Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      const inspectionDetailsTab = new DelegatePortalInspectionDetailsTab(global, claimPage.baseURL)
      await inspectionDetailsTab.NavigateDirectly(testClaim.testData.claimInspectionSuffix)
      const table = inspectionDetailsTab.DataTable_InspectionScreenshots

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // Click the Open Table Search button on the Inspection Screenshots Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await inspectionDetailsTab.page.waitForTimeout(1000)
    })

    test('Inspection Screenshots Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      const inspectionDetailsTab = new DelegatePortalInspectionDetailsTab(global, claimPage.baseURL)
      await inspectionDetailsTab.NavigateDirectly(testClaim.testData.claimInspectionSuffix)
      const table = inspectionDetailsTab.DataTable_InspectionScreenshots

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields
      const fileNameSearchTerm = testClaim.testData.claimInspectionScreenshot
      await table.SetTableSearch(fileNameSearchTerm)

      const fileNameFilteredRowCount = await table.VisibleRowCount()
      expect(fileNameFilteredRowCount).toBe(1)

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      // and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      const fileNameFilteredOffRowCount = await table.VisibleRowCount()

      expect(fileNameFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      const fileSearchTerm = 'No Match Expected'
      const tableSearchDialog = await table.SetTableSearch(fileSearchTerm, true)

      // Verify table is filtered
      const fileFilteredRowCount = await table.VisibleRowCount()
      expect(fileFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const fileFilterOffRowCount = await table.VisibleRowCount()
      expect(fileFilterOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Inspection Screenshots Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      const inspectionDetailsTab = new DelegatePortalInspectionDetailsTab(global, claimPage.baseURL)
      await inspectionDetailsTab.NavigateDirectly(testClaim.testData.claimInspectionSuffix)
      const table = inspectionDetailsTab.DataTable_InspectionScreenshots

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimInspectionDetailsTableMessage)
        return
      }

      // Click the Add Table Filter button on the Inspection Screenshots Table
      let tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.InspectionScreenshots_Label
      )

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await inspectionDetailsTab.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.InspectionScreenshots_FileName
      )
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Inspection Screenshots Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      const inspectionDetailsTab = new DelegatePortalInspectionDetailsTab(global, claimPage.baseURL)
      await inspectionDetailsTab.NavigateDirectly(testClaim.testData.claimInspectionSuffix)
      const table = inspectionDetailsTab.DataTable_InspectionScreenshots

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimInspectionDetailsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const fileNameSearchTerm = testClaim.testData.claimInspectionScreenshot
      const { pinnedFilter: fileNamePinnedFilter } = await table.SetTableFilter_Text(
        fileNameSearchTerm,
        DataTable_Columns_Type.InspectionScreenshots_FileName
      )
      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(fileNamePinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(fileNamePinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(fileNamePinnedFilter)).toBe(false)
      const fileNameFilteredOffRowCount = await table.VisibleRowCount()
      expect(fileNameFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const fileFilterTerm = 'No Match Expected'
      const { tableFilterDialog } = await table.SetTableFilter_Text(
        fileFilterTerm,
        DataTable_Columns_Type.InspectionScreenshots_Label,
        false,
        true
      )

      // Verify table is filtered
      const fileFilteredRowCount = await table.VisibleRowCount()
      expect(fileFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const fileFilterOffRowCount = await table.VisibleRowCount()
      expect(fileFilterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Inspection Screenshots Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      const inspectionDetailsTab = new DelegatePortalInspectionDetailsTab(global, claimPage.baseURL)
      await inspectionDetailsTab.NavigateDirectly(testClaim.testData.claimInspectionSuffix)
      const table = inspectionDetailsTab.DataTable_InspectionScreenshots

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimInspectionDetailsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const { pinnedFilter: fileNamePinnedFilter } = await table.SetTableFilter_Text(
        testClaim.testData.claimInspectionScreenshot,
        DataTable_Columns_Type.InspectionScreenshots_FileName
      )
      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(fileNamePinnedFilter)).toBe(true)

      // Edit the existing filter
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        testClaim.testData.claimInspectionScreenshotOther,
        DataTable_Columns_Type.InspectionScreenshots_FileName,
        true
      )

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(editedPinnedFilter)).toBe(true)

      // Verify table is filtered and no rows are visible
      const editedFilteredRowCount = await table.VisibleRowCount()
      expect(editedFilteredRowCount).toBeGreaterThanOrEqual(2)

      // Verify clicking X button on the edited pinned filter removes it and clears the filter
      await table.CancelPinnedTableFilter(editedPinnedFilter)

      // Verify table is not filtered and all rows are visible
      const clearedRowCount = await table.VisibleRowCount()
      expect(clearedRowCount).toBe(initialRowCount)
    })

    test('Inspection Screenshots Table - Expand and Collapse', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      const inspectionDetailsTab = new DelegatePortalInspectionDetailsTab(global, claimPage.baseURL)
      await inspectionDetailsTab.NavigateDirectly(testClaim.testData.claimInspectionSuffix)
      const table = inspectionDetailsTab.DataTable_InspectionScreenshots

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

    test('Inspection Screenshots Table - Pagination: Show List', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      const inspectionDetailsTab = new DelegatePortalInspectionDetailsTab(global, claimPage.baseURL)
      await inspectionDetailsTab.NavigateDirectly(testClaim.testData.claimInspectionSuffix)
      const table = inspectionDetailsTab.DataTable_InspectionScreenshots

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
        await inspectionDetailsTab.page.waitForTimeout(1000)
        const pageData = await table.GetPageInfo()
        if (pageData.maxPage == 1) {
          expect(pageData.currentPageRowCount).toBeLessThanOrEqual(pageSize)
        } else {
          expect(pageData.currentPageRowCount).toBe(pageSize)
        }
      }
    })

    test('Inspection Screenshots Table - Pagination: Navigation Buttons', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      const inspectionDetailsTab = new DelegatePortalInspectionDetailsTab(global, claimPage.baseURL)
      await inspectionDetailsTab.NavigateDirectly(testClaim.testData.claimInspectionSuffix)
      const table = inspectionDetailsTab.DataTable_InspectionScreenshots

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await inspectionDetailsTab.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage == 1).toBe(true)

      // make sure we are on the first page
      if (await table.Button_GoToFirstPage.IsEnabled()) {
        await table.Button_GoToFirstPage.Click()
        await inspectionDetailsTab.page.waitForTimeout(1000)
      }
      // Verify the First and Previous buttons are disabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(false)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)

      await table.Button_GoToNextPage.Click()
      await inspectionDetailsTab.page.waitForTimeout(1000)
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
      await inspectionDetailsTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // Verify the First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(true)
      // Verify the Next and Last buttons are disabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(false)

      await table.Button_GoToPreviousPage.Click()
      await inspectionDetailsTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // If we are not on the first page, verify First and Previous buttons are disabled
      // If we are on the first page, verify First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      expect(await table.Button_GoToFirstPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)
    })

    test('Inspection Screenshots Table - Pagination: Go To Page', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      const inspectionDetailsTab = new DelegatePortalInspectionDetailsTab(global, claimPage.baseURL)
      await inspectionDetailsTab.NavigateDirectly(testClaim.testData.claimInspectionSuffix)
      const table = inspectionDetailsTab.DataTable_InspectionScreenshots

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await inspectionDetailsTab.page.waitForTimeout(1000)
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
      await inspectionDetailsTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display Y of Y where Y is the max page ie 3 of 3
      expect(pageData.currentPage).toBe(lastPage)

      // Check First Page
      await table.Pagination_GotoPage(1)
      await inspectionDetailsTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display 1 of Y where Y is the max page ie 1 of 3
      expect(pageData.currentPage).toBe(1)

      // if Max Pages are > 2, test an intermediate number
      if (lastPage > 2) {
        // Check random middle page
        const randomPage = Math.floor(Math.random() * (lastPage - 2) + 2)
        await table.Pagination_GotoPage(randomPage)
        await inspectionDetailsTab.page.waitForTimeout(1000)
        pageData = await table.GetPageInfo()

        //Verify we display X of Y where Y is the max page and X is the Random page ie 4 of 7
        expect(pageData.currentPage).toBe(randomPage)
      }
    })

    test('Transcript Search', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      const inspectionDetailsTab = new DelegatePortalInspectionDetailsTab(global, claimPage.baseURL)
      await inspectionDetailsTab.NavigateDirectly(testClaim.testData.claimInspectionSuffix)

      const initialTranscriptCount = await inspectionDetailsTab.TranscriptMatchCount()
      // Verify that typing in a search with matches, filters the transcript to those matched entries
      await inspectionDetailsTab.PerformSearch(testClaim.testData.claimInspectionTranscript)
      const postHitSearchCount = await inspectionDetailsTab.TranscriptMatchCount()
      expect(postHitSearchCount).toBe(1)

      // Verify that typing in a search with no matches displays notification of "No match found."
      await inspectionDetailsTab.PerformSearch('alligator shoes')
      const noMatchAlert = await inspectionDetailsTab.NoTranscriptMatch()
      expect(noMatchAlert).toBe(true)

      // Verify that clearing the search edit box restores the full transcript
      await inspectionDetailsTab.TextBox_Search.locator.clear()
      const postClearSearchCount = await inspectionDetailsTab.TranscriptMatchCount()
      expect(postClearSearchCount).toBe(initialTranscriptCount)
    })

    test('Inspection Screenshots Table - Edit label and description inline', async ({
      browser,
    }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      const inspectionDetailsTab = new DelegatePortalInspectionDetailsTab(global, claimPage.baseURL)
      await inspectionDetailsTab.NavigateDirectly(testClaim.testData.claimInspectionSuffix)
      const table = inspectionDetailsTab.DataTable_InspectionScreenshots

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimInspectionDetailsTableMessage)
        return
      }

      const rowIndex = '0'
      const leftElevation = 'Left Elevation'
      const rightElevation = 'Right Elevation'
      const descriptionA = 'This is the A description'
      const descriptionB = 'This is the B description'

      // get current label and description
      const labelBeforeEdit = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.InspectionScreenshots_Label
      )
      const descriptionBeforeEdit = await inspectionDetailsTab.GetScreenshotDescription(rowIndex)

      // decide what text to enter
      const cannedLabelToUse =
        labelBeforeEdit == leftElevation.toUpperCase() ? rightElevation : leftElevation
      const descriptionToUse = descriptionBeforeEdit == descriptionA ? descriptionB : descriptionA

      // edit the label
      await inspectionDetailsTab.SetScreenshotLabelToExistingLabel(rowIndex, cannedLabelToUse)

      // edit the description
      await inspectionDetailsTab.SetScreenshotDescription(rowIndex, descriptionToUse)

      // Verify the actual label and description fields match the edited values
      const labelAfterEdit = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.InspectionScreenshots_Label
      )
      expect(labelAfterEdit).toBe(cannedLabelToUse.toUpperCase())
      const descriptionAfterEdit = await inspectionDetailsTab.GetScreenshotDescription(rowIndex)
      expect(descriptionAfterEdit).toBe(descriptionToUse)
    })
  }
)
