import { expect } from '@playwright/test'
import test from '../../library/shared/testHooks.js'
import { ClaimsPortalCallbacksPage } from '../../library/claimsPortal/pages/claimsPortalCallbacksPage.js'
import { Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import {
  AbortErrors,
  CallbackRoleSelectionOptions,
  CallbackStatusSelectionOptions,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DataTable_ShowPageSize_Options,
  DefaultEnvironment,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import { Tags } from '../../library/shared/constants.js'

const environment = DefaultEnvironment
const firstRowIndex = 0

test.describe(
  'Callbacks Page',
  {
    tag: [Tags.ClaimsPortal, Tags.Callbacks],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Callbacks page navigation from ClaimsPortal LeftNavBar
      const callbacksPage = new ClaimsPortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()
      const table = callbacksPage.DataTable_Callbacks

      // Verify Title for Callbacks page
      await callbacksPage.Title.VerifyExpectedText()

      // Verify Title for Callbacks Table
      await callbacksPage.Label_Table.VerifyExpectedText()

      // Verify Callbacks Table layout...
      // Verify Callbacks Column Settings / Filters / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // Check table settings dialog and columns
      await callbacksPage.VerifyTableSettingColumns()

      // if Callbacks table is empty
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

        // Check Change Status drawer for the first row
        const updateCallbackStatusDrawer =
          await callbacksPage.OpenUpdateCallbackStatusDrawer(firstRowIndex)

        // Verify drawer heading is "Update Callback Status"
        await updateCallbackStatusDrawer.VerifyTitle()
        expect(updateCallbackStatusDrawer.ListBox_SelectStatus.locator).toBeAttached()
        expect(updateCallbackStatusDrawer.CheckBox_AddNote.locator).toBeAttached()
        expect(
          await updateCallbackStatusDrawer.CheckBox_AddNote.locator.locator('..').isChecked()
        ).toBe(false)
        await updateCallbackStatusDrawer.Close()
      }
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Callbacks page navigation from ClaimsPortalLeftNavBar
      const callbacksPage = new ClaimsPortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()

      // Verify Title for Callbacks page
      await callbacksPage.Title.VerifyExpectedText()

      // Verify Title for Callbacks Table
      await callbacksPage.Label_Table.VerifyExpectedText()

      // Verify Callbacks Table exists
      expect(await callbacksPage.DataTable_Callbacks.IsVisible()).toBe(true)

      // Verify Callbacks Table layout...
      // Verify Callbacks Column Settings / Filters / Expand button
      expect(await callbacksPage.DataTable_Callbacks.Button_OpenTableSettings.IsVisible()).toBe(
        true
      )
      expect(await callbacksPage.DataTable_Callbacks.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await callbacksPage.DataTable_Callbacks.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await callbacksPage.DataTable_Callbacks.Button_CloseTable.IsVisible()).toBe(false)

      // if Callbacks table is not empty then verify Global Search Button
      const requestedGlobalSearchButtonExpectedVisiblity =
        !(await callbacksPage.DataTable_Callbacks.IsEmpty())
      expect(await callbacksPage.DataTable_Callbacks.Button_OpenTableSearch.IsVisible()).toBe(
        requestedGlobalSearchButtonExpectedVisiblity
      )
    })

    test('Callbacks Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Callbacks page navigation from ClaimsPortalLeftNavBar
      const callbacksPage = new ClaimsPortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()
      const table = callbacksPage.DataTable_Callbacks

      // Click the Open Table Settings button on the Callbacks Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await callbacksPage.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Callbacks Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify Admin->Callbacks page navigation from ClaimsPortalLeftNavBar
        const callbacksPage = new ClaimsPortalCallbacksPage(global)
        await callbacksPage.NavigateToPage()
        const table = callbacksPage.DataTable_Callbacks

        // Click the Open Table Settings button on the Callbacks Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Callbacks_Status)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Callbacks_Status)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Callbacks_Entity_ID)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Callbacks_Entity_ID)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Callbacks_For_Role)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Callbacks_For_Role)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Callbacks_Notes)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Callbacks_Notes)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Callbacks_Name)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Callbacks_Name)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Callbacks_Contact_Method)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Callbacks_Contact_Method)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Callbacks_Preferred_Time)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Callbacks_Preferred_Time)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Callbacks_Date_Requested)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Callbacks_Date_Requested)).toBe(
          false
        )

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Callbacks_Status)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Callbacks_Status)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Callbacks_Entity_ID)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Callbacks_Entity_ID)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Callbacks_For_Role)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Callbacks_For_Role)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Callbacks_Notes)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Callbacks_Notes)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Callbacks_Name)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Callbacks_Name)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Callbacks_Contact_Method)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Callbacks_Contact_Method)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Callbacks_Preferred_Time)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Callbacks_Preferred_Time)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Callbacks_Date_Requested)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Callbacks_Date_Requested)).toBe(
          true
        )
      })

      test('Callbacks Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify Admin->Callbacks page navigation from ClaimsPortalLeftNavBar
        const callbacksPage = new ClaimsPortalCallbacksPage(global)
        await callbacksPage.NavigateToPage()
        const table = callbacksPage.DataTable_Callbacks

        // Make sure the columns we need are visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Callbacks_Entity_ID)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Callbacks_Date_Requested)
        await tableSettingsDialog.Close()

        // Examine EntityId and DateRequested columns
        // Verify initial states are unsorted
        const initialEntityIdSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Callbacks_Entity_ID
        )
        const initialDateRequestedSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Callbacks_Date_Requested
        )
        expect(initialEntityIdSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialDateRequestedSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the EntityId column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Callbacks_Entity_ID,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify EntityId is sorted Down and EntityId is still unsorted
        let currentEntityIdSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Callbacks_Entity_ID
        )
        let currentDateRequestedSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Callbacks_Date_Requested
        )
        expect(currentEntityIdSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentDateRequestedSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the DateRequested column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Callbacks_Date_Requested,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify EntityId is now unsorted and DateRequested is sorted Up
        currentEntityIdSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Callbacks_Entity_ID
        )
        currentDateRequestedSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Callbacks_Date_Requested
        )
        expect(currentEntityIdSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentDateRequestedSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the DateRequested column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.Callbacks_Date_Requested,
          DataTable_Column_SortState.Unsorted
        )
        currentDateRequestedSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Callbacks_Date_Requested
        )
        expect(currentDateRequestedSortState).toBe(DataTable_Column_SortState.Unsorted)
      })
    })

    test('Callbacks Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Callbacks page navigation from ClaimsPortalLeftNavBar
      const callbacksPage = new ClaimsPortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()
      const table = callbacksPage.DataTable_Callbacks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // Click the Open Table Search button on the Request Callbacks Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await callbacksPage.page.waitForTimeout(1000)
    })

    test('Callbacks Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Callbacks page navigation from ClaimsPortalLeftNavBar
      const callbacksPage = new ClaimsPortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()
      const table = callbacksPage.DataTable_Callbacks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields
      const nameSearchTerm = 'Requested'
      await table.SetTableSearch(nameSearchTerm)

      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      //  and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      const nameFilteredOffRowCount = await table.VisibleRowCount()
      expect(nameFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      const typeSearchTerm = 'NoMatchExpected'
      const tableSearchDialog = await table.SetTableSearch(typeSearchTerm, true)

      // Verify table is filtered
      const typeFilteredRowCount = await table.VisibleRowCount()
      expect(typeFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const typeFilterOffRowCount = await table.VisibleRowCount()
      expect(typeFilterOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Callbacks Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Callbacks page navigation from ClaimsPortalLeftNavBar
      const callbacksPage = new ClaimsPortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()
      const table = callbacksPage.DataTable_Callbacks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyCallbacksTableMessage)
        return
      }

      // Click the Add Table Filter button on the Callbacks Table
      let tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Callbacks_Entity_ID)

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await callbacksPage.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Callbacks_Name)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Callbacks Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Callbacks page navigation from ClaimsPortalLeftNavBar
      const callbacksPage = new ClaimsPortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()
      const table = callbacksPage.DataTable_Callbacks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyCallbacksTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const entityIdFilterTerm = 'No Match Expected'
      const { pinnedFilter: entityIdPinnedFilter } = await table.SetTableFilter_Text(
        entityIdFilterTerm,
        DataTable_Columns_Type.Callbacks_Entity_ID
      )
      const entityIdFilteredRowCount = await table.VisibleRowCount()
      expect(entityIdFilteredRowCount).toBe(0)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(entityIdPinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(entityIdPinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(entityIdPinnedFilter)).toBe(false)
      const entityIdFilteredOffRowCount = await table.VisibleRowCount()
      expect(entityIdFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const { tableFilterDialog } = await table.SetTableFilter_Selection(
        CallbackRoleSelectionOptions.FieldAgent,
        DataTable_Columns_Type.Callbacks_For_Role,
        false,
        true
      )

      // Verify table is filtered
      const roleFilteredRowCount = await table.VisibleRowCount()
      expect(roleFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const roleFilterOffRowCount = await table.VisibleRowCount()
      expect(roleFilterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Callbacks Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Callbacks page navigation from ClaimsPortalLeftNavBar
      const callbacksPage = new ClaimsPortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()
      const table = callbacksPage.DataTable_Callbacks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyCallbacksTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const nameFilterTerm = 'No Match Expected'
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        nameFilterTerm,
        DataTable_Columns_Type.Callbacks_Name
      )
      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBe(0)

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedNameFilterTerm = 'There can be no matches'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedNameFilterTerm,
        DataTable_Columns_Type.Callbacks_Name,
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

    test('Callbacks Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Callbacks page navigation from ClaimsPortalLeftNavBar
      const callbacksPage = new ClaimsPortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()
      const table = callbacksPage.DataTable_Callbacks

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

    test('Callbacks Table - Verify Action Menu: Change callback status', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Callbacks page navigation from ClaimsPortalLeftNavBar
      const callbacksPage = new ClaimsPortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()
      const table = callbacksPage.DataTable_Callbacks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyCallbacksTableMessage)
        return
      }

      const updateCallbackStatusDrawer = await callbacksPage.OpenUpdateCallbackStatusDrawer(0)

      // Verify drawer appears
      await expect(updateCallbackStatusDrawer.Title.locator).toBeAttached()
    })

    test('Callbacks Table - Pagination: Show List', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Callbacks page navigation from ClaimsPortalLeftNavBar
      const callbacksPage = new ClaimsPortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()
      const table = callbacksPage.DataTable_Callbacks

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      // Verify the table displayed rows updates to either all rows if < page size or page size  rows if > 50
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
        await callbacksPage.page.waitForTimeout(1000)
        const pageData = await table.GetPageInfo()
        if (pageData.maxPage == 1) {
          expect(pageData.currentPageRowCount).toBeLessThanOrEqual(pageSize)
        } else {
          expect(pageData.currentPageRowCount).toBe(pageSize)
        }
      }
    })

    test('Callbacks Table - Pagination: Navigation Buttons', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Callbacks page navigation from ClaimsPortalLeftNavBar
      const callbacksPage = new ClaimsPortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()
      const table = callbacksPage.DataTable_Callbacks

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await callbacksPage.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage).toBe(1)

      // make sure we are on the first page
      if (await table.Button_GoToFirstPage.IsEnabled()) {
        await table.Button_GoToFirstPage.Click()
        await callbacksPage.page.waitForTimeout(1000)
      }
      // Verify the First and Previous buttons are disabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(false)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)

      await table.Button_GoToNextPage.Click()
      await callbacksPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // Verify the First and Previous buttons  are now enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(true)
      // If we are on the last page, verify Next and Last buttons are disabled
      // If we are not on the last page, verify Next and Last buttons  are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).not.toBe(pageData.currentPage == lastPage)
      expect(await table.Button_GoToLastPage.IsEnabled()).not.toBe(pageData.currentPage == lastPage)

      if (await table.Button_GoToLastPage.IsEnabled()) {
        await table.Button_GoToLastPage.Click()
        await callbacksPage.page.waitForTimeout(1000)
        pageData = await table.GetPageInfo()
        // Verify the First and Previous buttons are enabled
        expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(true)
        expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(true)
        // Verify the Next and Last buttons are disabled
        expect(await table.Button_GoToNextPage.IsEnabled()).toBe(false)
        expect(await table.Button_GoToLastPage.IsEnabled()).toBe(false)
      }

      await table.Button_GoToPreviousPage.Click()
      await callbacksPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // If we are not on the first page, verify First and Previous buttons are disabled
      // If we are on the first page, verify First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      expect(await table.Button_GoToFirstPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)
    })

    test('Callbacks Table - Pagination: Go To Page', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Callbacks page navigation from ClaimsPortalLeftNavBar
      const callbacksPage = new ClaimsPortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()
      const table = callbacksPage.DataTable_Callbacks

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await callbacksPage.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      //If the table is <= 10 entries, we cannot perform this test
      if (pageData.maxPage == 1) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      // Check Last Page
      await table.Pagination_GotoPage(lastPage)
      await callbacksPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display Y of Y where Y is the max page ie 3 of 3
      expect(pageData.currentPage).toBe(lastPage)

      // Check First Page
      await table.Pagination_GotoPage(1)
      await callbacksPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display 1 of Y where Y is the max page ie 1 of 3
      expect(pageData.currentPage).toBe(1)

      // if Max Pages are > 2, test an intermediate number
      if (lastPage > 2) {
        // Check random middle page
        const randomPage = Math.floor(Math.random() * (lastPage - 2) + 2)
        await table.Pagination_GotoPage(randomPage)
        await callbacksPage.page.waitForTimeout(1000)
        pageData = await table.GetPageInfo()

        //Verify we display X of Y where Y is the max page and X is the Random page ie 4 of 7
        expect(pageData.currentPage).toBe(randomPage)
      }
    })

    test('Update Callback Status - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Callbacks page navigation from ClaimsPortalLeftNavBar
      const callbacksPage = new ClaimsPortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()
      const table = callbacksPage.DataTable_Callbacks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyCallbacksTableMessage)
        return
      }

      let updateCallbackStatusDrawer =
        await callbacksPage.OpenUpdateCallbackStatusDrawer(firstRowIndex)

      // Verify drawer heading is "Update Callback Status"
      await updateCallbackStatusDrawer.VerifyTitle()
      expect(updateCallbackStatusDrawer.ListBox_SelectStatus.locator).toBeAttached()
      expect(updateCallbackStatusDrawer.CheckBox_AddNote.locator).toBeAttached()
      expect(
        await updateCallbackStatusDrawer.CheckBox_AddNote.locator.locator('..').isChecked()
      ).toBe(false)

      // check the Add Note toggle to show the Note UI portion
      await updateCallbackStatusDrawer.CheckBox_AddNote.locator.locator('..').setChecked(true)

      // Verify drawer closes with click on "X" button
      await updateCallbackStatusDrawer.Close()
      await expect(updateCallbackStatusDrawer.Title.locator).not.toBeAttached()
      await callbacksPage.page.waitForTimeout(1000)

      updateCallbackStatusDrawer = await callbacksPage.OpenUpdateCallbackStatusDrawer(firstRowIndex)

      // Verify drawer closes with ESC key
      await updateCallbackStatusDrawer.Close(true)
      await expect(updateCallbackStatusDrawer.Title.locator).not.toBeAttached()
      await callbacksPage.page.waitForTimeout(1000)

      updateCallbackStatusDrawer = await callbacksPage.OpenUpdateCallbackStatusDrawer(firstRowIndex)
      // Verify drawer closes if click on Close
      await updateCallbackStatusDrawer.Button_Close.Click()
      await expect(updateCallbackStatusDrawer.Title.locator).not.toBeAttached()
      await callbacksPage.page.waitForTimeout(1000)
    })

    test('Update Callback Status - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Callbacks page navigation from ClaimsPortalLeftNavBar
      const callbacksPage = new ClaimsPortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()
      const table = callbacksPage.DataTable_Callbacks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyCallbacksTableMessage)
        return
      }

      const updateCallbackStatusDrawer =
        await callbacksPage.OpenUpdateCallbackStatusDrawer(firstRowIndex)

      // Click the Submit button
      await updateCallbackStatusDrawer.Button_Submit.Click()
      await callbacksPage.page.waitForTimeout(1000)

      // Verify validation message for the Select Status field only - no Note UI is displayed
      expect(await updateCallbackStatusDrawer.ValidateWithNoteUIHidden()).toBe(true)

      // Click Close to close the drawer
      await updateCallbackStatusDrawer.Button_Close.Click()
    })

    test('Verify Change Callback Status', async ({ browser }) => {
      test.slow()
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Callbacks page navigation from ClaimsPortalLeftNavBar
      const callbacksPage = new ClaimsPortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()

      const table = callbacksPage.DataTable_Callbacks

      // If the table is empty
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyCallbacksTableMessage)
        return
      }

      let entityInfo = ''
      let requestedStatusRowCount = 0
      let attemptedStatusRowCount = 0
      let targetStatus = CallbackStatusSelectionOptions.Requested

      // lets narrow it down - are there any Requested callbacks?
      await table.SetTableSearch(targetStatus)
      requestedStatusRowCount = await table.VisibleRowCount()

      if (requestedStatusRowCount == 0) {
        // No Requested - are there any Attempted callbacks?
        targetStatus = CallbackStatusSelectionOptions.Attempted
        await table.SetTableSearch(targetStatus)
        attemptedStatusRowCount = await table.VisibleRowCount()

        if (attemptedStatusRowCount == 0) {
          // No Attempted - must be Pending (since we know the table is not empty)
          targetStatus = CallbackStatusSelectionOptions.Pending
          await table.SetTableSearch(targetStatus)
        }
      }
      // We should have at least 1 entity showing now...
      // Grab the entity id so we can filter on it
      entityInfo = (
        await table.FetchRowTextDataByColumnName('0', DataTable_Columns_Type.Callbacks_Entity_ID)
      ).trim()
      if (entityInfo.endsWith('Claim')) {
        entityInfo = entityInfo.split('Claim')[0]
      } else if (entityInfo.endsWith('Job')) {
        const jobEntityInfo = await table.FetchRowHrefDataByColumnName(
          '0',
          DataTable_Columns_Type.Callbacks_Entity_ID
        )
        entityInfo = jobEntityInfo.split(`/jobs/`)[1]
      }

      // Let's filter on the entity now to track it's changes
      await table.SetTableSearch(entityInfo)

      // this is the status that we are starting with
      const initialStatus = targetStatus

      // First status change is....
      const firstStatusChange =
        targetStatus == CallbackStatusSelectionOptions.Requested
          ? CallbackStatusSelectionOptions.Attempted
          : targetStatus == CallbackStatusSelectionOptions.Attempted
            ? CallbackStatusSelectionOptions.Pending
            : CallbackStatusSelectionOptions.Requested

      // Change the status and check to make sure it updated
      await callbacksPage.UpdateCallbackStatus(firstRowIndex, firstStatusChange)
      let currentStatus = await table.FetchRowTextDataByColumnName(
        '0',
        DataTable_Columns_Type.Callbacks_Status
      )
      expect(currentStatus).toBe(firstStatusChange.toUpperCase())
      targetStatus = firstStatusChange

      // Second Status Change is going to be...
      const secondStatusChange =
        targetStatus == CallbackStatusSelectionOptions.Requested
          ? CallbackStatusSelectionOptions.Attempted
          : targetStatus == CallbackStatusSelectionOptions.Attempted
            ? CallbackStatusSelectionOptions.Pending
            : CallbackStatusSelectionOptions.Requested

      // Change the status and check to make sure it updated again
      await callbacksPage.UpdateCallbackStatus(firstRowIndex, secondStatusChange)
      currentStatus = await table.FetchRowTextDataByColumnName(
        '0',
        DataTable_Columns_Type.Callbacks_Status
      )
      expect(currentStatus).toBe(secondStatusChange.toUpperCase())
      targetStatus = secondStatusChange

      // Third Status Change is going to be...
      const thirdStatusChange =
        targetStatus == CallbackStatusSelectionOptions.Requested
          ? CallbackStatusSelectionOptions.Attempted
          : targetStatus == CallbackStatusSelectionOptions.Attempted
            ? CallbackStatusSelectionOptions.Pending
            : CallbackStatusSelectionOptions.Requested

      // Change the status and check to make sure it updated again
      await callbacksPage.UpdateCallbackStatus(firstRowIndex, thirdStatusChange)
      currentStatus = await table.FetchRowTextDataByColumnName(
        '0',
        DataTable_Columns_Type.Callbacks_Status
      )
      expect(currentStatus).toBe(thirdStatusChange.toUpperCase())

      // We should be back where we started
      expect(currentStatus).toBe(initialStatus.toUpperCase())
    })
  }
)
