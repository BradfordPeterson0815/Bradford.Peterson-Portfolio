import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedClaimTypes,
  ClaimTabTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DataTable_ShowPageSize_Options,
  DefaultEnvironment,
  Documents_Meta_DataSourceSelectionOptions,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { FetchCannedClaim } from '../../../library/delegatePortal/delegatePortalHelper.js'
import { LaunchFieldAgent } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalClaimPage } from '../../../library/delegatePortal/pages/delegatePortalClaimPage.js'
import { DelegatePortalClaimDocumentsTab } from '../../../library/delegatePortal/tabs/delegatePortalClaimDocumentsTab.js'
import { AbortTest } from '../../../library/shared/commonHelper.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Page: Documents Tab',
  {
    tag: [Tags.Delegate, Tags.FieldAgent, Tags.Claim, Tags.Documents],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Documents tab
      const documentsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Documents
      )) as DelegatePortalClaimDocumentsTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Documents)).toBe(true)
      expect(claimPage.page.url()).toBe(documentsTab.URL)
      const table = documentsTab.DataTable_Documents

      // Verify Title
      await documentsTab.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Upload Documents link exists
      expect(await documentsTab.Link_UploadDocuments.IsVisible()).toBe(true)

      // Verify Documents Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // if table is not empty then verify Global Search Button
      if (!(await table.IsEmpty())) {
        await table.Button_OpenTableSearch.locator.waitFor({ state: 'visible' })
      }

      // Verify Create Documents button exists
      expect(await documentsTab.Button_CreateDocuments.IsVisible()).toBe(true)

      // Verify Generate Documents menu item is NOT visible
      await documentsTab.Button_CreateDocuments.Click()
      const isVisible = await documentsTab.MenuItem_GenerateDraftDocument.locator.count()
      expect(isVisible == 0).toBe(true)
    })

    test('Documents Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Documents tab
      const documentsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Documents
      )) as DelegatePortalClaimDocumentsTab
      const table = documentsTab.DataTable_Documents

      // Click the Open Table Settings button on the Documents Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await documentsTab.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Documents Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Delegate Field Agent home page
        const { global } = await LaunchFieldAgent(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim, then navigate to the Documents tab
        const documentsTab = (await claimPage.SelectClaimTab(
          ClaimTabTypes.Documents
        )) as DelegatePortalClaimDocumentsTab
        const table = documentsTab.DataTable_Documents

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
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Documents_Dates)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_Dates)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Documents_Meta)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Documents_Meta)).toBe(true)
        await tableSettingsDialog.Close()
      })

      test('Documents Table - Sort Columns', async ({ browser }) => {
        // launch the Delegate Field Agent home page
        const { global } = await LaunchFieldAgent(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim, then navigate to the Documents tab
        const documentsTab = (await claimPage.SelectClaimTab(
          ClaimTabTypes.Documents
        )) as DelegatePortalClaimDocumentsTab
        const table = documentsTab.DataTable_Documents

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

    test('Documents Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Documents tab
      const documentsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Documents
      )) as DelegatePortalClaimDocumentsTab
      const table = documentsTab.DataTable_Documents

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
      await documentsTab.page.waitForTimeout(1000)
    })

    test('Documents Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Documents tab
      const documentsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Documents
      )) as DelegatePortalClaimDocumentsTab
      const table = documentsTab.DataTable_Documents

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

    test('Documents Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Documents tab
      const documentsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Documents
      )) as DelegatePortalClaimDocumentsTab
      const table = documentsTab.DataTable_Documents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        return
      }

      // Click the Add Table Filter button on the Documents Table
      let tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Documents_File)

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await documentsTab.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Documents_File)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Documents Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Documents tab
      const documentsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Documents
      )) as DelegatePortalClaimDocumentsTab
      const table = documentsTab.DataTable_Documents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimDocumentsTableMessage)
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
      const { tableFilterDialog } = await documentsTab.SetTableFilter_Selection(
        Documents_Meta_DataSourceSelectionOptions.Estimator,
        DataTable_Columns_Type.Documents_Meta_DataSource,
        false,
        true
      )

      // Verify table is filtered
      const typeFilteredRowCount = await table.VisibleRowCount()
      expect(typeFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const typeFilterOffRowCount = await table.VisibleRowCount()
      expect(typeFilterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Documents Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Documents tab
      const documentsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Documents
      )) as DelegatePortalClaimDocumentsTab
      const table = documentsTab.DataTable_Documents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimDocumentsTableMessage)
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

    test('Documents Table - Expand and Collapse', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Documents tab
      const documentsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Documents
      )) as DelegatePortalClaimDocumentsTab
      const table = documentsTab.DataTable_Documents

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

    test('Documents Table - Verify File and Download Links for viewable file', async ({
      browser,
      browserName,
      headless,
    }) => {
      test.slow()

      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)
      const downloading = browserName === 'chromium' && headless === true

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Documents tab
      const documentsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Documents
      )) as DelegatePortalClaimDocumentsTab
      const table = documentsTab.DataTable_Documents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimDocumentsTableMessage)
        return
      }

      // Filter for a Delegate Data Source document
      const { pinnedFilter: pinnedDelegateFilter } = await documentsTab.SetTableFilter_Selection(
        Documents_Meta_DataSourceSelectionOptions.ClaimsPortal,
        DataTable_Columns_Type.Documents_Meta_DataSource
      )
      const estimatorFilteredRowCount = await table.VisibleRowCount()
      expect(estimatorFilteredRowCount).toBeGreaterThanOrEqual(1)

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      // open file from file link
      await documentsTab.OpenDocumentLinkInNewTabVerifyAndClose(rowIndex, downloading)

      // open file from download link
      await documentsTab.OpenDownloadLinkInNewTabVerifyAndClose(rowIndex, downloading)

      // Clear existing filter
      await table.CancelPinnedTableFilter(pinnedDelegateFilter)
    })

    test('Documents Table - Verify File and Download Links for previous version of viewable file', async ({
      browser,
      browserName,
      headless,
    }) => {
      test.slow()

      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)
      const downloading = browserName === 'chromium' && headless === true

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Documents tab
      const documentsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Documents
      )) as DelegatePortalClaimDocumentsTab
      const table = documentsTab.DataTable_Documents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimDocumentsTableMessage)
        return
      }

      // Filter for a versioned document
      const { pinnedFilter: pinnedFileFilter } = await table.SetTableFilter_Text(
        testClaim.testData.versionedDocument,
        DataTable_Columns_Type.Documents_File
      )
      const fileFilteredRowCount = await table.VisibleRowCount()
      expect(fileFilteredRowCount).toBeGreaterThanOrEqual(1)

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)

      // open file from file link
      await documentsTab.OpenVersionedDocumentLinkInNewTabVerifyAndClose(
        rowIndex,
        1,
        false,
        downloading
      )

      // open file from download link
      await documentsTab.OpenVersionedDownloadLinkInNewTabVerifyAndClose(
        rowIndex,
        1,
        true,
        downloading
      )

      // Clear existing filter
      await table.CancelPinnedTableFilter(pinnedFileFilter)
    })

    test('Documents Table - Pagination: Show List', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Documents tab
      const documentsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Documents
      )) as DelegatePortalClaimDocumentsTab
      const table = documentsTab.DataTable_Documents

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
        await documentsTab.page.waitForTimeout(1000)
        const pageData = await table.GetPageInfo()
        if (pageData.maxPage == 1) {
          expect(pageData.currentPageRowCount).toBeLessThanOrEqual(pageSize)
        } else {
          expect(pageData.currentPageRowCount).toBe(pageSize)
        }
      }
    })

    test('Documents Table - Pagination: Navigation Buttons', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Documents tab
      const documentsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Documents
      )) as DelegatePortalClaimDocumentsTab
      const table = documentsTab.DataTable_Documents

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await documentsTab.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage == 1).toBe(true)

      // make sure we are on the first page
      if (await table.Button_GoToFirstPage.IsEnabled()) {
        await table.Button_GoToFirstPage.Click()
        await documentsTab.page.waitForTimeout(1000)
      }
      // Verify the First and Previous buttons are disabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(false)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)

      await table.Button_GoToNextPage.Click()
      await documentsTab.page.waitForTimeout(1000)
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
      await documentsTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // Verify the First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(true)
      // Verify the Next and Last buttons are disabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(false)

      await table.Button_GoToPreviousPage.Click()
      await documentsTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // If we are not on the first page, verify First and Previous buttons are disabled
      // If we are on the first page, verify First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      expect(await table.Button_GoToFirstPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)
    })

    test('Documents Table - Pagination: Go To Page', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Documents tab
      const documentsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Documents
      )) as DelegatePortalClaimDocumentsTab
      const table = documentsTab.DataTable_Documents

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      //If the table is <= 10 tags, we cannot perform this test
      if (pageData.maxPage == 1) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage == 1).toBe(true)

      // Check Last Page
      await table.Pagination_GotoPage(lastPage)
      pageData = await table.GetPageInfo()

      //Verify we display Y of Y where Y is the max page ie 3 of 3
      expect(pageData.currentPage).toBe(lastPage)

      // Check First Page
      await table.Pagination_GotoPage(1)
      pageData = await table.GetPageInfo()

      //Verify we display 1 of Y where Y is the max page ie 1 of 3
      expect(pageData.currentPage).toBe(1)

      // if Max Pages are > 2, test an intermediate number
      if (lastPage > 2) {
        // Check random middle page
        const randomPage = Math.floor(Math.random() * (lastPage - 2) + 2)
        await table.Pagination_GotoPage(randomPage)
        pageData = await table.GetPageInfo()

        //Verify we display X of Y where Y is the max page and X is the Random page ie 4 of 7
        expect(pageData.currentPage).toBe(randomPage)
      }
    })
  }
)
