import { expect } from '@playwright/test'
import test from '../../library/shared/testHooks.js'
import { FetchCannedClaim, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import {
  DefaultEnvironment,
  CannedClaimTypes,
  ClaimTabTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DataTable_ShowPageSize_Options,
  AbortErrors,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { ClaimsPortalClaimPage } from '../../library/claimsPortal/pages/claimsPortalClaimPage.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import { ClaimsPortalClaimLossOfUseTab } from '../../library/claimsPortal/tabs/claimsPortalClaimLossOfUseTab.js'
import { Tags } from '../../library/shared/constants.js'
import { ClaimsPortalClaimsPage } from '../../library/claimsPortal/pages/claimsPortalClaimsPage.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Page: Loss of Use Tab',
  {
    tag: [Tags.ClaimsPortal, Tags.Claim, Tags.LossOfUse],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // find a random claim and go to it
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage } = await claimsPage.OpenRandomClaim()

      // Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Loss of Use tab
      const lossOfUseTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossOfUse
      )) as ClaimsPortalClaimLossOfUseTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.LossOfUse)).toBe(true)
      expect(claimPage.page.url()).toBe(lossOfUseTab.URL)
      const table = lossOfUseTab.DataTable_LossOfUse

      // Verify Title
      await lossOfUseTab.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Add Loss of Use button exists
      expect(await lossOfUseTab.Button_AddLossOfUse.IsVisible()).toBe(true)

      // Verify Loss of Use Table layout...
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

      // Verify Add Loss of Use drawer
      const addLossOfUseDrawer = await lossOfUseTab.OpenAddLossOfUseDrawer()

      // Verify UI elements
      await addLossOfUseDrawer.VerifyTitle()
      expect(addLossOfUseDrawer.TextBox_RequestedDate.locator).toBeAttached()
      expect(addLossOfUseDrawer.TextBox_DurationInDays.locator).toBeAttached()
      expect(addLossOfUseDrawer.Listbox_Type.locator).toBeAttached()
      expect(addLossOfUseDrawer.TextBox_AmountRequested.locator).toBeAttached()
      expect(addLossOfUseDrawer.TextArea_Description.locator).toBeAttached()
      expect(addLossOfUseDrawer.Button_AddRow).toBeAttached()

      // Verify Add Receipt UI elements
      await addLossOfUseDrawer.Button_AddRow.click()

      const rowIndex = 0
      const firstRowDocumentListLocator =
        await addLossOfUseDrawer.GetDocumentListLocatorByRow(rowIndex)
      await expect(firstRowDocumentListLocator).toBeAttached()
      const firstRowReceiptDateReceivedLocator =
        await addLossOfUseDrawer.GetReceiptDateReceivedLocatorByRow(rowIndex)
      await expect(firstRowReceiptDateReceivedLocator).toBeAttached()
      const firstRowRefetchDocumentsLocator =
        await addLossOfUseDrawer.GetRefetchDocumentsLocatorByRow(rowIndex)
      await expect(firstRowRefetchDocumentsLocator).toBeAttached()
      const firstRowUploadDocumentLocator =
        await addLossOfUseDrawer.GetUploadDocumentLocatorByRow(rowIndex)
      await expect(firstRowUploadDocumentLocator).toBeAttached()
      const firstRowRemoveRowLocator = await addLossOfUseDrawer.GetRemoveRowLocatorByRow(rowIndex)
      await expect(firstRowRemoveRowLocator).toBeAttached()

      await addLossOfUseDrawer.Close()
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Loss of Use tab
      const lossOfUseTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossOfUse
      )) as ClaimsPortalClaimLossOfUseTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.LossOfUse)).toBe(true)
      expect(claimPage.page.url()).toBe(lossOfUseTab.URL)
      const table = lossOfUseTab.DataTable_LossOfUse

      // Verify Title
      await lossOfUseTab.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Add Loss of Use button exists
      expect(await lossOfUseTab.Button_AddLossOfUse.IsVisible()).toBe(true)

      // Verify Loss of Use Table layout...
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

    test('Loss of Use Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss of Use tab
      const lossOfUseTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossOfUse
      )) as ClaimsPortalClaimLossOfUseTab
      const table = lossOfUseTab.DataTable_LossOfUse

      // Click the Open Table Settings button on the Loss of Use table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await lossOfUseTab.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Loss of Use Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new ClaimsPortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim, then navigate to the Loss of Use tab
        const lossOfUseTab = (await claimPage.SelectClaimTab(
          ClaimTabTypes.LossOfUse
        )) as ClaimsPortalClaimLossOfUseTab
        const table = lossOfUseTab.DataTable_LossOfUse

        // Click the Open Table Settings button on the Loss of Use table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.LossOfUse_Type)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.LossOfUse_Type)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.LossOfUse_Status)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.LossOfUse_Status)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.LossOfUse_AmountRequested)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.LossOfUse_AmountRequested)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.LossOfUse_Duration)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.LossOfUse_Duration)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.LossOfUse_RequestedDate)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.LossOfUse_RequestedDate)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.LossOfUse_LastModified)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.LossOfUse_LastModified)).toBe(
          false
        )

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.LossOfUse_Type)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.LossOfUse_Type)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.LossOfUse_Status)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.LossOfUse_Status)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.LossOfUse_AmountRequested)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.LossOfUse_AmountRequested)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.LossOfUse_Duration)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.LossOfUse_Duration)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.LossOfUse_RequestedDate)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.LossOfUse_RequestedDate)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.LossOfUse_LastModified)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.LossOfUse_LastModified)).toBe(
          true
        )
      })

      test('Loss of Use Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new ClaimsPortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim, then navigate to the Loss of Use tab
        const lossOfUseTab = (await claimPage.SelectClaimTab(
          ClaimTabTypes.LossOfUse
        )) as ClaimsPortalClaimLossOfUseTab
        const table = lossOfUseTab.DataTable_LossOfUse

        // Make sure the columns we need are visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.LossOfUse_Status)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.LossOfUse_Duration)
        await tableSettingsDialog.Close()

        // Examine Status and Duration columns
        // Verify initial states are unsorted
        const initialStatusSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.LossOfUse_Status
        )
        const initialDurationSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.LossOfUse_Duration
        )
        expect(initialStatusSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialDurationSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Status column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.LossOfUse_Status,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify Status is sorted Down and Duration is still unsorted
        let currentStatusSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.LossOfUse_Status
        )
        let currentDurationSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.LossOfUse_Duration
        )
        expect(currentStatusSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentDurationSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Duration column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.LossOfUse_Duration,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify Status is now unsorted and Duration is sorted Up
        currentStatusSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.LossOfUse_Status
        )
        currentDurationSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.LossOfUse_Duration
        )
        expect(currentStatusSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentDurationSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Duration column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.LossOfUse_Duration,
          DataTable_Column_SortState.Unsorted
        )
        currentDurationSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.LossOfUse_Duration
        )
        expect(currentDurationSortState).toBe(DataTable_Column_SortState.Unsorted)
      })
    })

    test('Loss of Use Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss of Use tab
      const lossOfUseTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossOfUse
      )) as ClaimsPortalClaimLossOfUseTab
      const table = lossOfUseTab.DataTable_LossOfUse

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // Click the Open Table Search button on the Loss of Use table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await lossOfUseTab.page.waitForTimeout(1000)
    })

    test('Loss of Use Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss of Use tab
      const lossOfUseTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossOfUse
      )) as ClaimsPortalClaimLossOfUseTab
      const table = lossOfUseTab.DataTable_LossOfUse

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields
      const fileSearchTerm = testClaim.testData.claimLossOfUseAmount
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

    test('Loss of Use Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss of Use tab
      const lossOfUseTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossOfUse
      )) as ClaimsPortalClaimLossOfUseTab
      const table = lossOfUseTab.DataTable_LossOfUse

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyLossOfUseTableMessage)
        return
      }

      // Click the Add Table Filter button on the Loss of Use table
      let tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.LossOfUse_AmountRequested
      )

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await lossOfUseTab.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.LossOfUse_Status)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Loss of Use Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss of Use tab
      const lossOfUseTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossOfUse
      )) as ClaimsPortalClaimLossOfUseTab
      const table = lossOfUseTab.DataTable_LossOfUse

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyLossOfUseTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const typeFilterTerm = testClaim.testData.claimLossOfUseType
      const { pinnedFilter: filePinnedFilter } = await table.SetTableFilter_Text(
        typeFilterTerm,
        DataTable_Columns_Type.LossOfUse_Type
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
      const { tableFilterDialog } = await table.SetTableFilter_Range(
        '50',
        '100',
        DataTable_Columns_Type.LossOfUse_Duration,
        false,
        true
      )

      // Verify table is filtered
      const typeFilteredRowCount = await table.VisibleRowCount()
      expect(typeFilteredRowCount).toBe(0)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const typeFilterOffRowCount = await table.VisibleRowCount()
      expect(typeFilterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Loss of Use Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss of Use tab
      const lossOfUseTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossOfUse
      )) as ClaimsPortalClaimLossOfUseTab
      const table = lossOfUseTab.DataTable_LossOfUse

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyLossOfUseTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const typeFilterTerm = testClaim.testData.claimLossOfUseType
      const { pinnedFilter: filePinnedFilter } = await table.SetTableFilter_Text(
        typeFilterTerm,
        DataTable_Columns_Type.LossOfUse_Type
      )
      const fileFilteredRowCount = await table.VisibleRowCount()
      expect(fileFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(filePinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedTypeFilterTerm = 'There can be no matches'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedTypeFilterTerm,
        DataTable_Columns_Type.LossOfUse_Type,
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

    test('Loss of Use Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss of Use tab
      const lossOfUseTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossOfUse
      )) as ClaimsPortalClaimLossOfUseTab
      const table = lossOfUseTab.DataTable_LossOfUse

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

    test('View Details - Verify Navigation', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss of Use tab
      const lossOfUseTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossOfUse
      )) as ClaimsPortalClaimLossOfUseTab
      const table = lossOfUseTab.DataTable_LossOfUse

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyLossOfUseTableMessage)
        return
      }

      // Filter our loss of use entry used for opening
      await table.SetTableFilter_Text(
        testClaim.testData.claimLossOfUseType,
        DataTable_Columns_Type.LossOfUse_Type
      )
      await table.SetTableFilter_Range(
        testClaim.testData.claimLossOfUseAmount,
        testClaim.testData.claimLossOfUseAmount,
        DataTable_Columns_Type.LossOfUse_AmountRequested
      )
      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBe(1)

      // Click View Details link on 1st entry in Loss of Use table -
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.ClickLinkInDataCell_ProvideName(rowIndex, table.actionMenuName)

      // Verify we land on the Loss of Use details page
      expect(lossOfUseTab.page.url().endsWith(testClaim.testData.claimLossOfUseId)).toBe(true)
    })

    test('Loss of Use Table - Pagination: Show List', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss of Use tab
      const lossOfUseTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossOfUse
      )) as ClaimsPortalClaimLossOfUseTab
      const table = lossOfUseTab.DataTable_LossOfUse

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
        await lossOfUseTab.page.waitForTimeout(1000)
        const pageData = await table.GetPageInfo()
        if (pageData.maxPage == 1) {
          expect(pageData.currentPageRowCount <= pageSize).toBeLessThanOrEqual(pageSize)
        } else {
          expect(pageData.currentPageRowCount).toBe(pageSize)
        }
      }
    })

    test('Loss of Use Table - Pagination: Navigation Buttons', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss of Use tab
      const lossOfUseTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossOfUse
      )) as ClaimsPortalClaimLossOfUseTab
      const table = lossOfUseTab.DataTable_LossOfUse

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await lossOfUseTab.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage).toBe(1)

      // make sure we are on the first page
      if (await table.Button_GoToFirstPage.IsEnabled()) {
        await table.Button_GoToFirstPage.Click()
        await lossOfUseTab.page.waitForTimeout(1000)
      }
      // Verify the First and Previous buttons are disabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(false)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)

      await table.Button_GoToNextPage.Click()
      await lossOfUseTab.page.waitForTimeout(1000)
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
      await lossOfUseTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // Verify the First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(true)
      // Verify the Next and Last buttons are disabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(false)

      await table.Button_GoToPreviousPage.Click()
      await lossOfUseTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // If we are not on the first page, verify First and Previous buttons are disabled
      // If we are on the first page, verify First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      expect(await table.Button_GoToFirstPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)
    })

    test('Loss of Use Table -  Pagination: Go To Page', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss of Use tab
      const lossOfUseTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossOfUse
      )) as ClaimsPortalClaimLossOfUseTab
      const table = lossOfUseTab.DataTable_LossOfUse

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await lossOfUseTab.page.waitForTimeout(1000)
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
      await lossOfUseTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display Y of Y where Y is the max page ie 3 of 3
      expect(pageData.currentPage).toBe(lastPage)

      // Check First Page
      await table.Pagination_GotoPage(1)
      await lossOfUseTab.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display 1 of Y where Y is the max page ie 1 of 3
      expect(pageData.currentPage).toBe(1)

      // if Max Pages are > 2, test an intermediate number
      if (lastPage > 2) {
        // Check random middle page
        const randomPage = Math.floor(Math.random() * (lastPage - 2) + 2)
        await table.Pagination_GotoPage(randomPage)
        await lossOfUseTab.page.waitForTimeout(1000)
        pageData = await table.GetPageInfo()

        //Verify we display X of Y where Y is the max page and X is the Random page ie 4 of 7
        expect(pageData.currentPage).toBe(randomPage)
      }
    })

    test('Add Loss of Use Drawer - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss of Use tab
      const lossOfUseTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossOfUse
      )) as ClaimsPortalClaimLossOfUseTab
      const table = lossOfUseTab.DataTable_LossOfUse

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyLossOfUseTableMessage)
        return
      }

      // open the Add Loss of Use drawer
      let addLossOfUseDrawer = await lossOfUseTab.OpenAddLossOfUseDrawer()

      // Verify UI elements
      await addLossOfUseDrawer.VerifyTitle()

      expect(addLossOfUseDrawer.TextBox_RequestedDate.locator).toBeAttached()
      expect(addLossOfUseDrawer.TextBox_DurationInDays.locator).toBeAttached()
      expect(addLossOfUseDrawer.Listbox_Type.locator).toBeAttached()
      expect(addLossOfUseDrawer.TextBox_AmountRequested.locator).toBeAttached()
      expect(addLossOfUseDrawer.TextArea_Description.locator).toBeAttached()
      expect(addLossOfUseDrawer.Button_AddRow).toBeAttached()

      // Verify Add Receipt UI elements
      await addLossOfUseDrawer.Button_AddRow.click()

      const rowIndex = 0
      const firstRowDocumentListLocator =
        await addLossOfUseDrawer.GetDocumentListLocatorByRow(rowIndex)
      await expect(firstRowDocumentListLocator).toBeAttached()
      const firstRowReceiptDateReceivedLocator =
        await addLossOfUseDrawer.GetReceiptDateReceivedLocatorByRow(rowIndex)
      await expect(firstRowReceiptDateReceivedLocator).toBeAttached()
      const firstRowRefetchDocumentsLocator =
        await addLossOfUseDrawer.GetRefetchDocumentsLocatorByRow(rowIndex)
      await expect(firstRowRefetchDocumentsLocator).toBeAttached()
      const firstRowUploadDocumentLocator =
        await addLossOfUseDrawer.GetUploadDocumentLocatorByRow(rowIndex)
      await expect(firstRowUploadDocumentLocator).toBeAttached()
      const firstRowRemoveRowLocator = await addLossOfUseDrawer.GetRemoveRowLocatorByRow(rowIndex)
      await expect(firstRowRemoveRowLocator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await addLossOfUseDrawer.Button_Close_X.Click()
      await expect(addLossOfUseDrawer.Title.locator).not.toBeAttached()
      await lossOfUseTab.page.waitForTimeout(1000)

      addLossOfUseDrawer = await lossOfUseTab.OpenAddLossOfUseDrawer()
      // Verify drawer closes with ESC key
      await addLossOfUseDrawer.Close(true)
      await expect(addLossOfUseDrawer.Title.locator).not.toBeAttached()
      await lossOfUseTab.page.waitForTimeout(1000)

      addLossOfUseDrawer = await lossOfUseTab.OpenAddLossOfUseDrawer()
      // Verify drawer closes if click on Close
      await addLossOfUseDrawer.Close()
      await expect(addLossOfUseDrawer.Title.locator).not.toBeAttached()
      await lossOfUseTab.page.waitForTimeout(1000)
    })

    test('Add Loss of Use Drawer - Verify Remove Row and Upload', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss of Use tab
      const lossOfUseTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossOfUse
      )) as ClaimsPortalClaimLossOfUseTab
      const table = lossOfUseTab.DataTable_LossOfUse

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyLossOfUseTableMessage)
        return
      }

      // open the Add Loss of Use drawer
      let addLossOfUseDrawer = await lossOfUseTab.OpenAddLossOfUseDrawer()

      // Verify Add Receipt UI elements
      await addLossOfUseDrawer.Button_AddRow.click()

      const rowIndex = 0
      const firstRowDocumentListLocator =
        await addLossOfUseDrawer.GetDocumentListLocatorByRow(rowIndex)
      await expect(firstRowDocumentListLocator).toBeAttached()
      const firstRowUploadDocumentLocator =
        await addLossOfUseDrawer.GetUploadDocumentLocatorByRow(rowIndex)
      await expect(firstRowUploadDocumentLocator).toBeAttached()
      const firstRowRemoveRowLocator = await addLossOfUseDrawer.GetRemoveRowLocatorByRow(rowIndex)
      await expect(firstRowRemoveRowLocator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await addLossOfUseDrawer.Button_Close_X.Click()
      await expect(addLossOfUseDrawer.Title.locator).not.toBeAttached()
      await lossOfUseTab.page.waitForTimeout(1000)

      addLossOfUseDrawer = await lossOfUseTab.OpenAddLossOfUseDrawer()
      // Verify drawer closes with ESC key
      await addLossOfUseDrawer.Close(true)
      await expect(addLossOfUseDrawer.Title.locator).not.toBeAttached()
      await lossOfUseTab.page.waitForTimeout(1000)

      addLossOfUseDrawer = await lossOfUseTab.OpenAddLossOfUseDrawer()
      // Verify drawer closes if click on Close
      await addLossOfUseDrawer.Close()
      await expect(addLossOfUseDrawer.Title.locator).not.toBeAttached()
      await lossOfUseTab.page.waitForTimeout(1000)
    })

    test('Add Loss of Use Drawer - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss of Use tab
      const lossOfUseTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossOfUse
      )) as ClaimsPortalClaimLossOfUseTab
      const table = lossOfUseTab.DataTable_LossOfUse

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyLossOfUseTableMessage)
        return
      }

      // open the Add Loss of Use drawer
      let addLossOfUseDrawer = await lossOfUseTab.OpenAddLossOfUseDrawer()

      // Click the Submit button
      await addLossOfUseDrawer.TextBox_RequestedDate.locator.clear()
      await lossOfUseTab.page.waitForTimeout(1000)
      await addLossOfUseDrawer.Button_Submit.Click()
      await lossOfUseTab.page.waitForTimeout(1000)
      expect(await addLossOfUseDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await addLossOfUseDrawer.Button_Close.Click()

      // open the Add Loss of Use drawer again
      addLossOfUseDrawer = await lossOfUseTab.OpenAddLossOfUseDrawer()

      // Click the + (Add Row) button
      await addLossOfUseDrawer.Button_AddRow.click()
      await addLossOfUseDrawer.Button_Submit.Click()
      await lossOfUseTab.page.waitForTimeout(1000)
      expect(await addLossOfUseDrawer.ValidateAddRow()).toBe(true)

      // Click Close to close the drawer
      await addLossOfUseDrawer.Button_Close.Click()
    })
  }
)
