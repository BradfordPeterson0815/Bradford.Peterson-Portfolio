import { expect } from '@playwright/test'
import {
  AbortErrors,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
  TestIncompleteFNOLID,
  TestServiceAreas,
} from '../../library/clientPortal/clientPortalConstants.js'
import { AbortTest, Launch } from '../../library/clientPortal/clientPortalHelper.js'
import { ClientPortalIncompleteFNOLsPage } from '../../library/clientPortal/pages/clientPortalIncompleteFNOLsPage.js'
import { Tags } from '../../library/shared/constants.js'
import test from '../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Incomplete FNOLs Page',
  {
    tag: [Tags.ClientPortal, Tags.IncompleteFNOLs],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the ClientPortal home page
      const { global, homePage } = await Launch(browser, environment)

      // Verify navigation from Home page
      const incompleteFNOLsPage = new ClientPortalIncompleteFNOLsPage(global)
      await homePage.Link_GoToIncompleteFNOLs.Click()
      const table = incompleteFNOLsPage.DataTable_IncompleteFNOLs

      // Verify page layout
      await incompleteFNOLsPage.VerifyTitle()
      // Verify Incomplete FNOLs Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Incomplete FNOLs Table layout...
      // Verify Incomplete FNOLs Table Settings, Filters and Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)

      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // if table is not empty then verify Global Search Button
      if (!(await table.IsEmpty())) {
        await table.Button_OpenTableSearch.locator.waitFor({ state: 'visible' })
      }
    })

    test('Incomplete FNOLs Table - Settings: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Incomplete FNOLs Page
      const { global } = await Launch(browser, environment)
      const incompleteFNOLsPage = new ClientPortalIncompleteFNOLsPage(global)
      await incompleteFNOLsPage.NavigateToPage()
      const table = incompleteFNOLsPage.DataTable_IncompleteFNOLs

      // Click the Open Table Settings button on the Incomplete FNOLs Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await incompleteFNOLsPage.page.waitForTimeout(1000)
    })

    test('Incomplete FNOLs Table - Settings: Verify Columns', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Incomplete FNOLs Page
      const { global } = await Launch(browser, environment)
      const incompleteFNOLsPage = new ClientPortalIncompleteFNOLsPage(global)
      await incompleteFNOLsPage.NavigateToPage()
      const table = incompleteFNOLsPage.DataTable_IncompleteFNOLs

      // Click the Open Table Settings button on the Incomplete FNOLs Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify that each column checkbox hides the corresponding table column when unchecked
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.IncompleteFNOLs_IsValid)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.IncompleteFNOLs_IsValid)).toBe(
        false
      )
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.IncompleteFNOLs_ID)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.IncompleteFNOLs_ID)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.IncompleteFNOLs_LastUpdated)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.IncompleteFNOLs_LastUpdated)).toBe(
        false
      )
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.IncompleteFNOLs_LossDate)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.IncompleteFNOLs_LossDate)).toBe(
        false
      )
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.IncompleteFNOLs_LossType)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.IncompleteFNOLs_LossType)).toBe(
        false
      )
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.IncompleteFNOLs_ReportedBy)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.IncompleteFNOLs_ReportedBy)).toBe(
        false
      )

      // Verify that each column checkbox shows the corresponding table column when checked
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.IncompleteFNOLs_IsValid)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.IncompleteFNOLs_IsValid)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.IncompleteFNOLs_ID)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.IncompleteFNOLs_ID)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.IncompleteFNOLs_LastUpdated)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.IncompleteFNOLs_LastUpdated)).toBe(
        true
      )
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.IncompleteFNOLs_LossDate)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.IncompleteFNOLs_LossDate)).toBe(
        true
      )
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.IncompleteFNOLs_LossType)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.IncompleteFNOLs_LossType)).toBe(
        true
      )
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.IncompleteFNOLs_ReportedBy)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.IncompleteFNOLs_ReportedBy)).toBe(
        true
      )
    })

    test('Incomplete FNOLs Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Incomplete FNOLs Page
      const { global } = await Launch(browser, environment)
      const incompleteFNOLsPage = new ClientPortalIncompleteFNOLsPage(global)
      await incompleteFNOLsPage.NavigateToPage()
      const table = incompleteFNOLsPage.DataTable_IncompleteFNOLs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyIncompleteFNOLsTableMessage)
        return
      }

      // Click the Open Table Search button on the Incomplete FNOLs Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await incompleteFNOLsPage.page.waitForTimeout(1000)
    })

    test('Incomplete FNOLs Table - Global Search: Verify search', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Incomplete FNOLs Page
      const { global } = await Launch(browser, environment)
      const incompleteFNOLsPage = new ClientPortalIncompleteFNOLsPage(global)
      await incompleteFNOLsPage.NavigateToPage()
      const table = incompleteFNOLsPage.DataTable_IncompleteFNOLs
      const serviceArea = TestServiceAreas.TestEasternWashington

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyIncompleteFNOLsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields
      const areaNameSearchTerm = serviceArea.name
      await table.SetTableSearch(areaNameSearchTerm)
      const areaNameFilteredRowCount = await table.VisibleRowCount()
      expect(areaNameFilteredRowCount).toBe(1)

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      // and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      const areaNameFilteredOffRowCount = await table.VisibleRowCount()
      expect(areaNameFilteredOffRowCount == initialRowCount).toBe(true)

      // Verify clicking X on the search input causes the filtered table results to clear
      const stateSearchTerm = 'ZZ'
      const tableSearchDialog = await table.SetTableSearch(stateSearchTerm, true)

      // Verify table is filtered
      const stateFilteredRowCount = await table.VisibleRowCount()
      expect(stateFilteredRowCount < initialRowCount).toBe(true)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const stateFilterOffRowCount = await table.VisibleRowCount()
      expect(stateFilterOffRowCount == initialRowCount).toBe(true)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Incomplete FNOLs Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Incomplete FNOLs Page
      const { global } = await Launch(browser, environment)
      const incompleteFNOLsPage = new ClientPortalIncompleteFNOLsPage(global)
      await incompleteFNOLsPage.NavigateToPage()
      const table = incompleteFNOLsPage.DataTable_IncompleteFNOLs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyIncompleteFNOLsTableMessage)
        return
      }

      // Click the Add Table Filter button on the Incomplete FNOLs table
      let tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.ServiceAreas_AreaName
      )

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await incompleteFNOLsPage.Wait()

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.IncompleteFNOLs_ID)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Incomplete FNOLs Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Incomplete FNOLs Page
      const { global } = await Launch(browser, environment)
      const incompleteFNOLsPage = new ClientPortalIncompleteFNOLsPage(global)
      await incompleteFNOLsPage.NavigateToPage()
      const table = incompleteFNOLsPage.DataTable_IncompleteFNOLs
      const incompleteFNOLID = TestIncompleteFNOLID

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyIncompleteFNOLsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const { pinnedFilter: idPinnedFilter } = await table.SetTableFilter_Text(
        incompleteFNOLID,
        DataTable_Columns_Type.IncompleteFNOLs_ID
      )
      const idFilteredRowCount = await table.VisibleRowCount()
      expect(idFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(idPinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(idPinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(idPinnedFilter)).toBe(false)
      const idFilteredOffRowCount = await table.VisibleRowCount()
      expect(idFilteredOffRowCount == initialRowCount).toBe(true)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const { tableFilterDialog } = await table.SetTableFilter_Text(
        'No expected match',
        DataTable_Columns_Type.IncompleteFNOLs_ReportedBy,
        false,
        true
      )

      // Verify table is filtered
      const reportedByFilteredRowCount = await table.VisibleRowCount()
      expect(reportedByFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const reportedByFilteredOffRowCount = await table.VisibleRowCount()
      expect(reportedByFilteredOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Incomplete FNOLs Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Incomplete FNOLs Page
      const { global } = await Launch(browser, environment)
      const incompleteFNOLsPage = new ClientPortalIncompleteFNOLsPage(global)
      await incompleteFNOLsPage.NavigateToPage()
      const table = incompleteFNOLsPage.DataTable_IncompleteFNOLs
      const incompleteFNOLID = TestIncompleteFNOLID

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyIncompleteFNOLsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      /// Verify setting the filter causes the table results to filter on the selected column only
      const { pinnedFilter: idPinnedFilter } = await table.SetTableFilter_Text(
        incompleteFNOLID,
        DataTable_Columns_Type.IncompleteFNOLs_ID
      )
      const idFilteredRowCount = await table.VisibleRowCount()
      expect(idFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(idPinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedAreaNameFilterTerm = 'No Match Expected'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedAreaNameFilterTerm,
        DataTable_Columns_Type.IncompleteFNOLs_ID,
        true
      )

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(editedPinnedFilter)).toBe(true)

      // Verify table is filtered and 0 rows are visible
      const editedFilteredRowCount = await table.VisibleRowCount()
      expect(editedFilteredRowCount).toBe(0)

      // Verify clicking X button on the edited pinned filter removes it and clears the filter
      await table.CancelPinnedTableFilter(editedPinnedFilter)

      // Verify table is not filtered and all rows are visible
      const clearedRowCount = await table.VisibleRowCount()
      expect(clearedRowCount == initialRowCount).toBe(true)
    })

    test('Incomplete FNOLs Table - Expand and Collapse', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Incomplete FNOLs Page
      const { global } = await Launch(browser, environment)
      const incompleteFNOLsPage = new ClientPortalIncompleteFNOLsPage(global)
      await incompleteFNOLsPage.NavigateToPage()
      const table = incompleteFNOLsPage.DataTable_IncompleteFNOLs

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

    test('Incomplete FNOLs Table - Sort Columns', async ({ browser }) => {
      // launch the ClientPortal home page and go to the Incomplete FNOLs Page
      const { global } = await Launch(browser, environment)
      const incompleteFNOLsPage = new ClientPortalIncompleteFNOLsPage(global)
      await incompleteFNOLsPage.NavigateToPage()
      const table = incompleteFNOLsPage.DataTable_IncompleteFNOLs

      // Examine ID and LossType columns
      // Verify initial states are unsorted
      const initialIdSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.IncompleteFNOLs_ID
      )
      const initialLossTypeSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.IncompleteFNOLs_LossType
      )
      expect(initialIdSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(initialLossTypeSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the ID column Sort icon to Down (high to low)
      await table.SetColumnSortState(
        DataTable_Columns_Type.IncompleteFNOLs_ID,
        DataTable_Column_SortState.Down_HighToLow
      )

      // Verify AreaName is sorted Down and State is still unsorted
      let currentIdSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.IncompleteFNOLs_ID
      )
      let currentLossTypeSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.IncompleteFNOLs_LossType
      )
      expect(currentIdSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
      expect(currentLossTypeSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the State column Sort icon to Up (low to high)
      await table.SetColumnSortState(
        DataTable_Columns_Type.IncompleteFNOLs_LossType,
        DataTable_Column_SortState.Up_LowToHigh
      )

      // Verify AreaName is now unsorted and State is sorted Up
      currentIdSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.IncompleteFNOLs_ID
      )
      currentLossTypeSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.IncompleteFNOLs_LossType
      )
      expect(currentIdSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(currentLossTypeSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

      // Set the LossType column Sort icon to Unsorted
      await table.SetColumnSortState(
        DataTable_Columns_Type.IncompleteFNOLs_LossType,
        DataTable_Column_SortState.Unsorted
      )
      currentLossTypeSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.IncompleteFNOLs_LossType
      )
      expect(currentLossTypeSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Verify IsValid cannot be sorted
      const isValidSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.IncompleteFNOLs_IsValid
      )
      expect(isValidSortState).toBe(DataTable_Column_SortState.NotSortable)

      // Verify ReportedBy cannot be sorted
      const reportedBySortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.IncompleteFNOLs_ReportedBy
      )
      expect(reportedBySortState).toBe(DataTable_Column_SortState.NotSortable)
    })
  }
)
