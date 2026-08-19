import { expect } from '@playwright/test'
import test from '../../library/shared/testHooks.js'
import {
  FetchCannedClaim,
  GetRandomLossOfUseStatusType,
  Launch,
} from '../../library/claimsPortal/claimsPortalHelper.js'
import {
  DefaultEnvironment,
  CannedClaimTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DataTable_ShowPageSize_Options,
  AbortErrors,
  ClaimTabTypes,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { ClaimsPortalClaimPage } from '../../library/claimsPortal/pages/claimsPortalClaimPage.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import { ClaimsPortalLossOfUseDetailsPage } from '../../library/claimsPortal/pages/claimsPortalLossOfUseDetailsPage.js'
import { Tags } from '../../library/shared/constants.js'
import { ClaimsPortalClaimsPage } from '../../library/claimsPortal/pages/claimsPortalClaimsPage.js'
import { ClaimsPortalClaimLossOfUseTab } from '../../library/claimsPortal/tabs/claimsPortalClaimLossOfUseTab.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Page: Loss of Use Details Page',
  {
    tag: [Tags.ClaimsPortal, Tags.Claim, Tags.LossOfUse, Tags.InfoDetails],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P2] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // find a random claim and go to it
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage, testClaim } = await claimsPage.OpenRandomClaim()

      // Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Loss of Use tab
      const lossOfUseTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossOfUse
      )) as ClaimsPortalClaimLossOfUseTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.LossOfUse)).toBe(true)
      expect(claimPage.page.url()).toBe(lossOfUseTab.URL)
      const louTableIsEmpty = await lossOfUseTab.DataTable_LossOfUse.IsEmpty()

      if (!louTableIsEmpty) {
        // Click View Details link on 1st entry in Loss of Use table -
        const rowIndex = await lossOfUseTab.DataTable_LossOfUse.FetchRowIndexFromRowPosition(1)
        await lossOfUseTab.DataTable_LossOfUse.ClickLinkInDataCell_ProvideName(
          rowIndex,
          lossOfUseTab.DataTable_LossOfUse.actionMenuName
        )

        // Now navigate directly to the Details page for our test claim loss of use
        const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(
          global,
          testClaim,
          claimPage.baseURL
        )
        const table = lossOfUseDetailsPage.DataTable_Receipts

        // Verify <-Loss of Use back button exists
        expect(await lossOfUseDetailsPage.Button_BackToLossOfUse.IsVisible()).toBe(true)

        // Verify Title
        await lossOfUseDetailsPage.Title.VerifyExpectedText()

        // Verify Table exists
        expect(await table.IsVisible()).toBe(true)

        // Verify Update Status button exists
        expect(await lossOfUseDetailsPage.Button_UpdateStatus.IsVisible()).toBe(true)

        await lossOfUseDetailsPage.VerifyDetailsSection()
        await lossOfUseDetailsPage.VerifySummarySection()
        await lossOfUseDetailsPage.VerifyReceiptsSection()

        // Verify Add Receipt button exists
        expect(await lossOfUseDetailsPage.Button_AddReceipt.IsVisible()).toBe(true)

        // Verify Receipts Table layout...
        // Verify Column Settings / Filters / Expand button
        expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
        expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
        expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
        expect(await table.Button_CloseTable.IsVisible()).toBe(false)

        // Check table settings dialog and columns
        await lossOfUseDetailsPage.VerifyTableSettingColumns()

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
      }
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim loss of use
      const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(global, testClaim, claimPage.baseURL)
      await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)
      const table = lossOfUseDetailsPage.DataTable_Receipts

      // Verify <-Loss of Use back button exists
      expect(await lossOfUseDetailsPage.Button_BackToLossOfUse.IsVisible()).toBe(true)

      // Verify Title
      await lossOfUseDetailsPage.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Update Status button exists
      expect(await lossOfUseDetailsPage.Button_UpdateStatus.IsVisible()).toBe(true)

      await lossOfUseDetailsPage.VerifyDetailsSection()
      await lossOfUseDetailsPage.VerifySummarySection()
      await lossOfUseDetailsPage.VerifyReceiptsSection()

      // Verify Add Receipt button exists
      expect(await lossOfUseDetailsPage.Button_AddReceipt.IsVisible()).toBe(true)

      // Verify Receipts Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // if table is not empty then verify Global Search Button
      if (!(await table.IsEmpty())) {
        await table.Button_OpenTableSearch.locator.waitFor({ state: 'visible' })
      }

      // Navigate back to the parent loss of use tab
      await lossOfUseDetailsPage.Button_BackToLossOfUse.Click()
      // Verify we land on the Loss of Use details page
      expect(lossOfUseDetailsPage.page.url().endsWith('loss-of-use')).toBe(true)
    })

    test('Receipts Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim loss of use
      const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(global, testClaim, claimPage.baseURL)
      await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)
      const table = lossOfUseDetailsPage.DataTable_Receipts

      // Click the Open Table Settings button on the Receipts table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await lossOfUseDetailsPage.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Receipts Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new ClaimsPortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        // Now navigate directly to the Details page for our test claim loss of use
        const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(
          global,
          testClaim,
          claimPage.baseURL
        )
        await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)
        const table = lossOfUseDetailsPage.DataTable_Receipts

        // Click the Open Table Settings button on the Receipts Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(
          DataTable_Columns_Type.LossOfUseReceipts_ReceiptDate
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.LossOfUseReceipts_ReceiptDate)
        ).toBe(false)
        await tableSettingsDialog.UncheckColumn(
          DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote)
        ).toBe(false)
        await tableSettingsDialog.UncheckColumn(
          DataTable_Columns_Type.LossOfUseReceipts_DocumentTitle
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.LossOfUseReceipts_DocumentTitle)
        ).toBe(false)
        await tableSettingsDialog.UncheckColumn(
          DataTable_Columns_Type.LossOfUseReceipts_DocumentDescription
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.LossOfUseReceipts_DocumentDescription)
        ).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.LossOfUseReceipts_ReceiptDate)
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.LossOfUseReceipts_ReceiptDate)
        ).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote)
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote)
        ).toBe(true)
        await tableSettingsDialog.CheckColumn(
          DataTable_Columns_Type.LossOfUseReceipts_DocumentTitle
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.LossOfUseReceipts_DocumentTitle)
        ).toBe(true)
        await tableSettingsDialog.CheckColumn(
          DataTable_Columns_Type.LossOfUseReceipts_DocumentDescription
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.LossOfUseReceipts_DocumentDescription)
        ).toBe(true)
      })

      test('Receipts Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new ClaimsPortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        // Now navigate directly to the Details page for our test claim loss of use
        const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(
          global,
          testClaim,
          claimPage.baseURL
        )
        await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)
        const table = lossOfUseDetailsPage.DataTable_Receipts

        // Make sure the columns we need are visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.LossOfUseReceipts_ReceiptDate)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote)
        await tableSettingsDialog.Close()

        // Examine ReceiptDate and ReceiptNote columns
        // Verify initial states are unsorted
        const initialReceiptDateSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.LossOfUseReceipts_ReceiptDate
        )
        const initialReceiptNoteSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote
        )
        expect(initialReceiptDateSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialReceiptNoteSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the ReceiptDate column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.LossOfUseReceipts_ReceiptDate,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify ReceiptDate is sorted Down and ReceiptNote is still unsorted
        let currentReceiptDateSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.LossOfUseReceipts_ReceiptDate
        )
        let currentReceiptNoteSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote
        )
        expect(currentReceiptDateSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentReceiptNoteSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the ReceiptNote column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify ReceiptDate is now unsorted and ReceiptNote is sorted Up
        currentReceiptDateSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.LossOfUseReceipts_ReceiptDate
        )
        currentReceiptNoteSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote
        )
        expect(currentReceiptDateSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentReceiptNoteSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the ReceiptNote column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote,
          DataTable_Column_SortState.Unsorted
        )
        currentReceiptNoteSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote
        )
        expect(currentReceiptNoteSortState).toBe(DataTable_Column_SortState.Unsorted)
      })
    })

    test('Receipts Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim loss of use
      const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(global, testClaim, claimPage.baseURL)
      await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)
      const table = lossOfUseDetailsPage.DataTable_Receipts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // Click the Open Table Search button on the Receipts Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await lossOfUseDetailsPage.page.waitForTimeout(1000)
    })

    test('Receipts Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim loss of use
      const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(global, testClaim, claimPage.baseURL)
      await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)
      const table = lossOfUseDetailsPage.DataTable_Receipts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields
      const fileSearchTerm = testClaim.testData.claimLossOfUseReceiptNote
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
      const descriptionSearchTerm = 'ThereShouldBeNoMatches'
      const tableSearchDialog = await table.SetTableSearch(descriptionSearchTerm, true)

      // Verify table is filtered
      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBe(0)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const descriptionFilterOffRowCount = await table.VisibleRowCount()
      expect(descriptionFilterOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Receipts Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim loss of use
      const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(global, testClaim, claimPage.baseURL)
      await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)
      const table = lossOfUseDetailsPage.DataTable_Receipts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyReceiptsTableMessage)
        return
      }

      // Click the Add Table Filter button on the Receipts Table
      let tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote
      )

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await lossOfUseDetailsPage.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote
      )
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Receipts Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim loss of use
      const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(global, testClaim, claimPage.baseURL)
      await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)
      const table = lossOfUseDetailsPage.DataTable_Receipts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyReceiptsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const noteFilterTerm = testClaim.testData.claimLossOfUseReceiptNote
      const { pinnedFilter: filePinnedFilter } = await table.SetTableFilter_Text(
        noteFilterTerm,
        DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote
      )
      const noteFilteredRowCount = await table.VisibleRowCount()
      expect(noteFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(filePinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(filePinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(filePinnedFilter)).toBe(false)
      const noteFilterOffRowCount = await table.VisibleRowCount()
      expect(noteFilterOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const { tableFilterDialog } = await table.SetTableFilter_Text(
        'ThereCanBeNoMatch',
        DataTable_Columns_Type.LossOfUseReceipts_ReceiptDate,
        false,
        true
      )

      // Verify table is filtered
      const dateFilteredRowCount = await table.VisibleRowCount()
      expect(dateFilteredRowCount).toBe(0)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const dateFilterOffRowCount = await table.VisibleRowCount()
      expect(dateFilterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Receipts Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim loss of use
      const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(global, testClaim, claimPage.baseURL)
      await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)
      const table = lossOfUseDetailsPage.DataTable_Receipts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyReceiptsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      /// Verify setting the filter causes the table results to filter on the selected column only
      const noteFilterTerm = testClaim.testData.claimLossOfUseReceiptNote
      const { pinnedFilter: filePinnedFilter } = await table.SetTableFilter_Text(
        noteFilterTerm,
        DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote
      )
      const noteFilteredRowCount = await table.VisibleRowCount()
      expect(noteFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(filePinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedNoteFilterTerm = 'There can be no matches'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedNoteFilterTerm,
        DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote,
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

    test('Receipts Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim loss of use
      const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(global, testClaim, claimPage.baseURL)
      await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)
      const table = lossOfUseDetailsPage.DataTable_Receipts

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

    test('Receipts Table - Verify Download link', async ({ browser, browserName, headless }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const downloading = browserName === 'chromium' && headless === true

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim loss of use
      const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(global, testClaim, claimPage.baseURL)
      await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)
      const table = lossOfUseDetailsPage.DataTable_Receipts

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const rowIndex = '0'
      await lossOfUseDetailsPage.page.waitForTimeout(5000)

      // open receipt from download link
      await lossOfUseDetailsPage.OpenDownloadLinkInNewTabVerifyAndClose(rowIndex, downloading)
    })

    test('Receipts Table - Pagination: Show List', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim loss of use
      const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(global, testClaim, claimPage.baseURL)
      await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)
      const table = lossOfUseDetailsPage.DataTable_Receipts

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      //Verify the Receipts Table displayed rows updates to either all rows if < page size or page size  rows if > 50
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
        await lossOfUseDetailsPage.page.waitForTimeout(1000)
        const pageData = await table.GetPageInfo()
        if (pageData.maxPage == 1) {
          expect(pageData.currentPageRowCount <= pageSize).toBeLessThanOrEqual(pageSize)
        } else {
          expect(pageData.currentPageRowCount).toBe(pageSize)
        }
      }
    })

    test('Receipts Table - Pagination: Navigation Buttons', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim loss of use
      const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(global, testClaim, claimPage.baseURL)
      await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)
      const table = lossOfUseDetailsPage.DataTable_Receipts

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await lossOfUseDetailsPage.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage).toBe(1)

      // make sure we are on the first page
      if (await table.Button_GoToFirstPage.IsEnabled()) {
        await table.Button_GoToFirstPage.Click()
        await lossOfUseDetailsPage.page.waitForTimeout(1000)
      }
      // Verify the First and Previous buttons are disabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(false)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)

      await table.Button_GoToNextPage.Click()
      await lossOfUseDetailsPage.page.waitForTimeout(1000)
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
      await lossOfUseDetailsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // Verify the First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(true)
      // Verify the Next and Last buttons are disabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(false)

      await table.Button_GoToPreviousPage.Click()
      await lossOfUseDetailsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // If we are not on the first page, verify First and Previous buttons are disabled
      // If we are on the first page, verify First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      expect(await table.Button_GoToFirstPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)
    })

    test('Receipts Table - Pagination: Go To Page', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim loss of use
      const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(global, testClaim, claimPage.baseURL)
      await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)
      const table = lossOfUseDetailsPage.DataTable_Receipts

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await lossOfUseDetailsPage.page.waitForTimeout(1000)
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
      await lossOfUseDetailsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display Y of Y where Y is the max page ie 3 of 3
      expect(pageData.currentPage).toBe(lastPage)

      // Check First Page
      await table.Pagination_GotoPage(1)
      await lossOfUseDetailsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display 1 of Y where Y is the max page ie 1 of 3
      expect(pageData.currentPage).toBe(1)

      // if Max Pages are > 2, test an intermediate number
      if (lastPage > 2) {
        // Check random middle page
        const randomPage = Math.floor(Math.random() * (lastPage - 2) + 2)
        await table.Pagination_GotoPage(randomPage)
        await lossOfUseDetailsPage.page.waitForTimeout(1000)
        pageData = await table.GetPageInfo()

        //Verify we display X of Y where Y is the max page and X is the Random page ie 4 of 7
        expect(pageData.currentPage).toBe(randomPage)
      }
    })

    test('Update Loss of Use Status - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim loss of use
      const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(global, testClaim, claimPage.baseURL)
      await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)

      // open the Update Loss of Use Status drawer
      let updateStatusDrawer = await lossOfUseDetailsPage.OpenUpdateLossOfUseStatusDrawer()

      // Verify UI elements
      await updateStatusDrawer.VerifyTitle()

      expect(updateStatusDrawer.Listbox_Status.locator).toBeAttached()
      expect(updateStatusDrawer.TextArea_Justification.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await updateStatusDrawer.Button_Close_X.Click()
      await expect(updateStatusDrawer.Title.locator).not.toBeAttached()
      await lossOfUseDetailsPage.page.waitForTimeout(1000)

      updateStatusDrawer = await lossOfUseDetailsPage.OpenUpdateLossOfUseStatusDrawer()
      // Verify drawer closes with ESC key
      await updateStatusDrawer.Close(true)
      await expect(updateStatusDrawer.Title.locator).not.toBeAttached()
      await lossOfUseDetailsPage.page.waitForTimeout(1000)

      updateStatusDrawer = await lossOfUseDetailsPage.OpenUpdateLossOfUseStatusDrawer()
      // Verify drawer closes if click on Close
      await updateStatusDrawer.Close()
      await expect(updateStatusDrawer.Title.locator).not.toBeAttached()
      await lossOfUseDetailsPage.page.waitForTimeout(1000)
    })

    test('Update Loss of Use Status - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim loss of use
      const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(global, testClaim, claimPage.baseURL)
      await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)

      // open the Update Loss of Use Status drawer
      const updateStatusDrawer = await lossOfUseDetailsPage.OpenUpdateLossOfUseStatusDrawer()

      // Click the Submit button
      await updateStatusDrawer.Button_Submit.Click()
      expect(await updateStatusDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await updateStatusDrawer.Button_Close.Click()
    })

    test('Update Loss of Use Status', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim loss of use
      const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(global, testClaim, claimPage.baseURL)
      await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)

      // open the Update Loss of Use Status drawer
      const updateStatusDrawer = await lossOfUseDetailsPage.OpenUpdateLossOfUseStatusDrawer()

      // set random status and justification
      const currentStatus = await lossOfUseDetailsPage.Label_Details_Status.locator.textContent()
      let statusTypeToSet = currentStatus
      do {
        statusTypeToSet = GetRandomLossOfUseStatusType()
      } while (statusTypeToSet == currentStatus)
      const justificationToSet = `Here is the justification: ${Date.now()}`
      await updateStatusDrawer.Listbox_Status.locator.selectOption({ label: statusTypeToSet })
      await updateStatusDrawer.TextArea_Justification.FillByTyping(justificationToSet)

      await updateStatusDrawer.Button_Submit.Click()
      await updateStatusDrawer.Title.locator.waitFor({ state: 'detached' })

      // Verify Status value has been updated in Details section
      await expect(lossOfUseDetailsPage.Label_Details_Status.locator).toHaveText(statusTypeToSet)

      // Verify Justification value has been updated in Summary section
      const actualJustification =
        await lossOfUseDetailsPage.Label_Summary_Justification.locator.textContent()
      expect(actualJustification).toBe(justificationToSet)
    })

    test('Add Loss of Use Receipt - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim loss of use
      const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(global, testClaim, claimPage.baseURL)
      await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)

      // open the Update Loss of Use Status drawer
      let addReceiptDrawer = await lossOfUseDetailsPage.OpenAddLossOfUseReceiptDrawer()

      // Verify UI elements
      await addReceiptDrawer.VerifyTitle()

      expect(addReceiptDrawer.Listbox_Document.locator).toBeAttached()
      expect(addReceiptDrawer.Button_RefetchDocuments.locator).toBeAttached()
      expect(addReceiptDrawer.Link_UploadDocuments.locator).toBeAttached()
      expect(addReceiptDrawer.TextArea_Notes.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await addReceiptDrawer.Button_Close_X.Click()
      await expect(addReceiptDrawer.Title.locator).not.toBeAttached()
      await lossOfUseDetailsPage.page.waitForTimeout(1000)

      addReceiptDrawer = await lossOfUseDetailsPage.OpenAddLossOfUseReceiptDrawer()
      // Verify drawer closes with ESC key
      await addReceiptDrawer.Close(true)
      await expect(addReceiptDrawer.Title.locator).not.toBeAttached()
      await lossOfUseDetailsPage.page.waitForTimeout(1000)

      addReceiptDrawer = await lossOfUseDetailsPage.OpenAddLossOfUseReceiptDrawer()
      // Verify drawer closes if click on Close
      await addReceiptDrawer.Close()
      await expect(addReceiptDrawer.Title.locator).not.toBeAttached()
      await lossOfUseDetailsPage.page.waitForTimeout(1000)
    })

    test('Add Loss of Use Receipt - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Now navigate directly to the Details page for our test claim loss of use
      const lossOfUseDetailsPage = new ClaimsPortalLossOfUseDetailsPage(global, testClaim, claimPage.baseURL)
      await lossOfUseDetailsPage.NavigateDirectly(testClaim.testData.claimLossOfUseId)

      // open the Update Loss of Use Status drawer
      const addReceiptDrawer = await lossOfUseDetailsPage.OpenAddLossOfUseReceiptDrawer()

      // Click the Submit button
      await addReceiptDrawer.Button_Submit.Click()
      expect(await addReceiptDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await addReceiptDrawer.Button_Close.Click()
    })
  }
)
