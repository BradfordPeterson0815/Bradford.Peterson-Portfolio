import { expect } from '@playwright/test'
import {
  AbortErrors,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DataTable_ShowPageSize_Options,
  DefaultEnvironment,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { LaunchFieldTech } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalCallbacksPage } from '../../../library/delegatePortal/pages/delegatePortalCallbacksPage.js'
import { AbortTest } from '../../../library/shared/commonHelper.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Callbacks Page',
  {
    tag: [Tags.Delegate, Tags.FieldTech, Tags.Callbacks],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { global } = await LaunchFieldTech(browser, environment)

      // Verify Callbacks page navigation from LeftNavBar
      const callbacksPage = new DelegatePortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()

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
      // launch the Delegate Field Tech home page
      const { global } = await LaunchFieldTech(browser, environment)

      // Verify Callbacks page navigation from LeftNavBar
      const callbacksPage = new DelegatePortalCallbacksPage(global)
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

    test('Callbacks Table - Settings: Verify Columns', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { global } = await LaunchFieldTech(browser, environment)

      // Verify Callbacks page navigation from LeftNavBar
      const callbacksPage = new DelegatePortalCallbacksPage(global)
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

    test('Callbacks Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { global } = await LaunchFieldTech(browser, environment)

      // Verify Callbacks page navigation from LeftNavBar
      const callbacksPage = new DelegatePortalCallbacksPage(global)
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

    test('Callbacks Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { global } = await LaunchFieldTech(browser, environment)

      // Verify Callbacks page navigation from LeftNavBar
      const callbacksPage = new DelegatePortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()
      const table = callbacksPage.DataTable_Callbacks

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

    test('Callbacks Table - Expand and Collapse', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { global } = await LaunchFieldTech(browser, environment)

      // Verify Callbacks page navigation from LeftNavBar
      const callbacksPage = new DelegatePortalCallbacksPage(global)
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

    test('Callbacks Table - Sort Columns', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { global } = await LaunchFieldTech(browser, environment)

      // Verify Callbacks page navigation from LeftNavBar
      const callbacksPage = new DelegatePortalCallbacksPage(global)
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

    test('Callbacks Table -  Pagination: Show List', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { global } = await LaunchFieldTech(browser, environment)

      // Verify Callbacks page navigation from LeftNavBar
      const callbacksPage = new DelegatePortalCallbacksPage(global)
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

    test('Callbacks Table -  Pagination: Navigation Buttons', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { global } = await LaunchFieldTech(browser, environment)

      // Verify Callbacks page navigation from LeftNavBar
      const callbacksPage = new DelegatePortalCallbacksPage(global)
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

    test('Callbacks Table -  Pagination: Go To Page', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { global } = await LaunchFieldTech(browser, environment)

      // Verify Callbacks page navigation from LeftNavBar
      const callbacksPage = new DelegatePortalCallbacksPage(global)
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
  }
)
