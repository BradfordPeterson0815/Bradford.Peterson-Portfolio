import { expect } from '@playwright/test'
import {
  AbortErrors,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
  TestWeatherEvents,
  WeatherEvents_DataTable_ActionMenuItems,
} from '../../library/clientPortal/clientPortalConstants.js'
import { AbortTest, Launch, deepCopy } from '../../library/clientPortal/clientPortalHelper.js'
import { ClientPortalWeatherEvent } from '../../library/clientPortal/clientPortalWeatherEvent.js'
import { ClientPortalCreateWeatherEventDrawer } from '../../library/clientPortal/drawers/clientPortalCreateWeatherEventDrawer.js'
import { ClientPortalWeatherEventsPage } from '../../library/clientPortal/pages/clientPortalWeatherEventsPage.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'

const environment = DefaultEnvironment
const WeatherEventPrefix = 'AA_TESTWEATHEREVENT'
const dateSuffix = `+${Date.now()}`

test.describe(
  'Weather Events Page',
  {
    tag: [Tags.ClientPortal, Tags.Vendors],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the ClientPortal home page
      const { global, homePage } = await Launch(browser, environment)

      // Verify navigation from Home page
      const weatherEventsPage = new ClientPortalWeatherEventsPage(global)
      await homePage.Link_GoToWeatherEvents.Click()
      const table = weatherEventsPage.DataTable_WeatherEvents

      // Verify page layout
      await weatherEventsPage.VerifyTitle()
      // Verify Weather Events Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Weather Events Table layout...
      // Verify Weather Events Table Settings, Filters and Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // if table is not empty then verify Global Search Button
      if (!(await table.IsEmpty())) {
        await table.Button_OpenTableSearch.locator.waitFor({ state: 'visible' })
      }
    })

    test('Weather Events Table - Settings: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to Weather Events
      const { global } = await Launch(browser, environment)
      const weatherEventsPage = new ClientPortalWeatherEventsPage(global)
      await weatherEventsPage.NavigateToPage()
      const table = weatherEventsPage.DataTable_WeatherEvents

      // Click the Open Table Settings button on the Weather Events Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await weatherEventsPage.page.waitForTimeout(1000)
    })

    test('Weather Events Table - Settings: Verify Columns', async ({ browser }) => {
      // launch the ClientPortal home page and go to Weather Events
      const { global } = await Launch(browser, environment)
      const weatherEventsPage = new ClientPortalWeatherEventsPage(global)
      await weatherEventsPage.NavigateToPage()
      const table = weatherEventsPage.DataTable_WeatherEvents

      // Click the Open Table Settings button on the Weather Events Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify that each column checkbox hides the corresponding table column when unchecked
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.WeatherEvents_Status)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.WeatherEvents_Status)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.WeatherEvents_EventName)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.WeatherEvents_EventName)).toBe(
        false
      )
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.WeatherEvents_CATCode)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.WeatherEvents_CATCode)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.WeatherEvents_LossType)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.WeatherEvents_LossType)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.WeatherEvents_StartDate)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.WeatherEvents_StartDate)).toBe(
        false
      )
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.WeatherEvents_EndDate)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.WeatherEvents_EndDate)).toBe(false)
      await tableSettingsDialog.UncheckColumn(
        DataTable_Columns_Type.WeatherEvents_AffectedLocations
      )
      expect(
        await table.IsColumnVisible(DataTable_Columns_Type.WeatherEvents_AffectedLocations)
      ).toBe(false)

      // Verify that each column checkbox shows the corresponding table column when checked
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.WeatherEvents_Status)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.WeatherEvents_Status)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.WeatherEvents_EventName)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.WeatherEvents_EventName)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.WeatherEvents_CATCode)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.WeatherEvents_CATCode)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.WeatherEvents_LossType)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.WeatherEvents_LossType)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.WeatherEvents_StartDate)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.WeatherEvents_StartDate)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.WeatherEvents_EndDate)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.WeatherEvents_EndDate)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.WeatherEvents_AffectedLocations)
      expect(
        await table.IsColumnVisible(DataTable_Columns_Type.WeatherEvents_AffectedLocations)
      ).toBe(true)
    })

    test('Weather Events Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to Weather Events
      const { global } = await Launch(browser, environment)
      const weatherEventsPage = new ClientPortalWeatherEventsPage(global)
      await weatherEventsPage.NavigateToPage()
      const table = weatherEventsPage.DataTable_WeatherEvents

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyWeatherEventsTableMessage)
        return
      }

      // Click the Open Table Search button on the Weather Events Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await weatherEventsPage.page.waitForTimeout(1000)
    })

    test('Weather Events Table - Global Search: Verify search', async ({ browser }) => {
      // launch the ClientPortal home page and go to Weather Events
      const { global } = await Launch(browser, environment)
      const weatherEventsPage = new ClientPortalWeatherEventsPage(global)
      await weatherEventsPage.NavigateToPage()
      const table = weatherEventsPage.DataTable_WeatherEvents

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        AbortTest(AbortErrors.EmptyWeatherEventsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()
      const weatherEvent: ClientPortalWeatherEvent = TestWeatherEvents.WeatherEventA

      // Verify setting search input causes the table results to filter across all text fields
      const nameSearchTerm = weatherEvent.name
      await table.SetTableSearch(nameSearchTerm)
      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBe(1)

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      // and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      const nameFilteredOffRowCount = await table.VisibleRowCount()
      expect(nameFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      const websiteSearchTerm = 'NoMatch Weather Event'
      const tableSearchDialog = await table.SetTableSearch(websiteSearchTerm, true)

      // Verify table is filtered
      const websiteFilteredRowCount = await table.VisibleRowCount()
      expect(websiteFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const websiteFilterOffRowCount = await table.VisibleRowCount()
      expect(websiteFilterOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Weather Events Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to Weather Events
      const { global } = await Launch(browser, environment)
      const weatherEventsPage = new ClientPortalWeatherEventsPage(global)
      await weatherEventsPage.NavigateToPage()
      const table = weatherEventsPage.DataTable_WeatherEvents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyWeatherEventsTableMessage)
        return
      }

      // Click the Add Table Filter button on the Weather Events Table
      let tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.WeatherEvents_EventName
      )

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await weatherEventsPage.Wait()

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.WeatherEvents_EventName)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Weather Events Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to Weather Events
      const { global } = await Launch(browser, environment)
      const weatherEventsPage = new ClientPortalWeatherEventsPage(global)
      await weatherEventsPage.NavigateToPage()
      const table = weatherEventsPage.DataTable_WeatherEvents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyWeatherEventsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()
      const weatherEvent: ClientPortalWeatherEvent = TestWeatherEvents.WeatherEventA

      // Verify setting the filter causes the table results to filter on the selected column only
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        weatherEvent.name,
        DataTable_Columns_Type.WeatherEvents_EventName
      )
      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(namePinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(false)
      const nameFilteredOffRowCount = await table.VisibleRowCount()
      expect(nameFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const catCodeFilter = weatherEvent.catCode
      const { tableFilterDialog } = await table.SetTableFilter_Text(
        catCodeFilter,
        DataTable_Columns_Type.WeatherEvents_CATCode,
        false,
        true
      )

      // Verify table is filtered
      const catCodeFilteredRowCount = await table.VisibleRowCount()
      expect(catCodeFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const catCodeFilterOffRowCount = await table.VisibleRowCount()
      expect(catCodeFilterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Weather Events Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the ClientPortal home page and go to Weather Events
      const { global } = await Launch(browser, environment)
      const weatherEventsPage = new ClientPortalWeatherEventsPage(global)
      await weatherEventsPage.NavigateToPage()
      const table = weatherEventsPage.DataTable_WeatherEvents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyWeatherEventsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()
      const weatherEvent: ClientPortalWeatherEvent = TestWeatherEvents.WeatherEventA

      // Verify setting the filter causes the table results to filter on the selected column only
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        weatherEvent.name,
        DataTable_Columns_Type.WeatherEvents_EventName
      )
      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedNameFilterTerm = 'There is no match possible!'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedNameFilterTerm,
        DataTable_Columns_Type.WeatherEvents_EventName,
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

    test('Weather Events Table - Expand and Collapse', async ({ browser }) => {
      // launch the ClientPortal home page and go to Weather Events
      const { global } = await Launch(browser, environment)
      const weatherEventsPage = new ClientPortalWeatherEventsPage(global)
      await weatherEventsPage.NavigateToPage()
      const table = weatherEventsPage.DataTable_WeatherEvents

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

    test('Weather Events Table - Sort Columns', async ({ browser }) => {
      // launch the ClientPortal home page and go to Weather Events
      const { global } = await Launch(browser, environment)
      const weatherEventsPage = new ClientPortalWeatherEventsPage(global)
      await weatherEventsPage.NavigateToPage()
      const table = weatherEventsPage.DataTable_WeatherEvents

      // Examine Name and LossType columns
      // Verify initial states are unsorted
      const initialNameSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.WeatherEvents_EventName
      )
      const initialLossTypeSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.WeatherEvents_LossType
      )
      expect(initialNameSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(initialLossTypeSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the Name column Sort icon to Down (high to low)
      await table.SetColumnSortState(
        DataTable_Columns_Type.WeatherEvents_EventName,
        DataTable_Column_SortState.Down_HighToLow
      )

      // Verify Name is sorted Down and LossType is still unsorted
      let currentNameSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.WeatherEvents_EventName
      )
      let currentLossTypeSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.WeatherEvents_LossType
      )
      expect(currentNameSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
      expect(currentLossTypeSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the LossType column Sort icon to Up (low to high)
      await table.SetColumnSortState(
        DataTable_Columns_Type.WeatherEvents_LossType,
        DataTable_Column_SortState.Up_LowToHigh
      )

      // Verify Name is now unsorted and LossType is sorted Up
      currentNameSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.WeatherEvents_EventName
      )
      currentLossTypeSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.WeatherEvents_LossType
      )
      expect(currentNameSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(currentLossTypeSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

      // Set the LossType column Sort icon to Unsorted
      await table.SetColumnSortState(
        DataTable_Columns_Type.WeatherEvents_LossType,
        DataTable_Column_SortState.Unsorted
      )
      currentLossTypeSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.WeatherEvents_LossType
      )
      expect(currentLossTypeSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Verify Status and Affected Locations columns cannot be sorted
      const statusSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.WeatherEvents_Status
      )
      expect(statusSortState).toBe(DataTable_Column_SortState.NotSortable)
      const locationsSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.WeatherEvents_AffectedLocations
      )
      expect(locationsSortState).toBe(DataTable_Column_SortState.NotSortable)
    })

    test('Weather Events Table - Verify Action Menus', async ({ browser }) => {
      // launch the ClientPortal home page and go to Weather Events
      const { global } = await Launch(browser, environment)
      const weatherEventsPage = new ClientPortalWeatherEventsPage(global)
      await weatherEventsPage.NavigateToPage()
      const table = weatherEventsPage.DataTable_WeatherEvents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyWeatherEventsTableMessage)
        return
      }

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)

      // Verify visibility of all the action menus for the table
      expect(
        await weatherEventsPage.IsActionMenuItemVisible(
          rowIndex,
          WeatherEvents_DataTable_ActionMenuItems.EditWeatherEvent
        )
      ).toBe(true)

      expect(
        await weatherEventsPage.IsActionMenuItemVisible(
          rowIndex,
          WeatherEvents_DataTable_ActionMenuItems.DeleteWeatherEvent
        )
      ).toBe(true)
    })

    test('Weather Events Table - Verify Action Menu: Edit Weather Event', async ({ browser }) => {
      // launch the ClientPortal home page and go to Weather Events
      const { global } = await Launch(browser, environment)
      const weatherEventsPage = new ClientPortalWeatherEventsPage(global)
      await weatherEventsPage.NavigateToPage()
      const table = weatherEventsPage.DataTable_WeatherEvents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyWeatherEventsTableMessage)
        return
      }

      const weatherEvent: ClientPortalWeatherEvent = TestWeatherEvents.WeatherEventA

      // filter for the vendor
      await table.SetTableFilter_Text(
        weatherEvent.name,
        DataTable_Columns_Type.WeatherEvents_EventName
      )

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await weatherEventsPage.SelectActionMenuItem(
        rowIndex,
        WeatherEvents_DataTable_ActionMenuItems.EditWeatherEvent
      )
      const editWeatherEventDrawer = new ClientPortalCreateWeatherEventDrawer(global, true)

      // Verify the title
      await editWeatherEventDrawer.VerifyTitle()

      // close the drawer - we are done
      await editWeatherEventDrawer.Close()
      await weatherEventsPage.page.waitForTimeout(1000)
    })

    test('Weather Events Table - Verify Action Menu: Delete Weather Event', async ({ browser }) => {
      // launch the ClientPortal home page and go to Weather Events
      const { global } = await Launch(browser, environment)
      const weatherEventsPage = new ClientPortalWeatherEventsPage(global)
      await weatherEventsPage.NavigateToPage()
      const table = weatherEventsPage.DataTable_WeatherEvents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyWeatherEventsTableMessage)
        return
      }

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await weatherEventsPage.SelectActionMenuItem(
        rowIndex,
        WeatherEvents_DataTable_ActionMenuItems.DeleteWeatherEvent
      )
      await weatherEventsPage.HandleDeleteWeatherEventAlert(true)
      await weatherEventsPage.page.waitForTimeout(1000)
    })

    test('Create Weather Event - Verify Drawer UI', async ({ browser }) => {
      // launch the ClientPortal home page and go to Weather Events
      const { global } = await Launch(browser, environment)
      const weatherEventsPage = new ClientPortalWeatherEventsPage(global)
      await weatherEventsPage.NavigateToPage()
      const table = weatherEventsPage.DataTable_WeatherEvents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyWeatherEventsTableMessage)
        return
      }

      const createWeatherEventDrawer = await weatherEventsPage.OpenCreateWeatherEventDrawer()

      // Verify drawer heading is "Create Weather Event"
      createWeatherEventDrawer.VerifyTitle()

      // check all the other text boxes
      expect(createWeatherEventDrawer.TextBox_EventName.locator).toBeAttached()
      expect(createWeatherEventDrawer.TextBox_CATCode.locator).toBeAttached()
      expect(createWeatherEventDrawer.TextBox_LossType.locator).toBeAttached()
      expect(createWeatherEventDrawer.DateTime_EffectiveStartDate.locator).toBeAttached()
      expect(createWeatherEventDrawer.DateTime_EffectiveEndDate.locator).toBeAttached()
      expect(createWeatherEventDrawer.Button_AddAffectedLocation.locator).toBeAttached()

      // Verify Drawer closes with click on "X" button
      await createWeatherEventDrawer.Close()
      await expect(createWeatherEventDrawer.Title.locator).not.toBeAttached()
      await weatherEventsPage.page.waitForTimeout(1000)

      // Verify Drawer closes with ESC key
      await weatherEventsPage.OpenCreateWeatherEventDrawer()
      await createWeatherEventDrawer.Close(true)
      await expect(createWeatherEventDrawer.Title.locator).not.toBeAttached()
      await weatherEventsPage.page.waitForTimeout(1000)
    })

    test('Create Weather Event - Validate Drawer', async ({ browser }) => {
      // launch the ClientPortal home page and go to Weather Events
      const { global } = await Launch(browser, environment)
      const weatherEventsPage = new ClientPortalWeatherEventsPage(global)
      await weatherEventsPage.NavigateToPage()
      const table = weatherEventsPage.DataTable_WeatherEvents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyWeatherEventsTableMessage)
        return
      }

      const createWeatherEventDrawer = await weatherEventsPage.OpenCreateWeatherEventDrawer()

      // Click the Submit button
      await createWeatherEventDrawer.Button_Submit.Click()
      await createWeatherEventDrawer.page.waitForTimeout(1000)

      // Verify validation
      expect(await createWeatherEventDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await createWeatherEventDrawer.Button_Close.Click()
    })

    test('Add/Edit/Remove Weather Event', async ({ browser }) => {
      const newWeatherEventName = `${WeatherEventPrefix}${dateSuffix}`
      const editedWeatherEventName = `${newWeatherEventName}+EDITED`

      /// launch the ClientPortal home page and go to Weather Events
      const { global } = await Launch(browser, environment)
      const weatherEventsPage = new ClientPortalWeatherEventsPage(global)
      await weatherEventsPage.NavigateToPage()
      const table = weatherEventsPage.DataTable_WeatherEvents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyWeatherEventsTableMessage)
        return
      }

      // Remove any existing weather events from old tests
      await weatherEventsPage.DeleteOldWeatherEvents(WeatherEventPrefix)

      // Setup and create new weather event
      const newWeatherEvent = TestWeatherEvents.WeatherEventA as ClientPortalWeatherEvent
      newWeatherEvent.name = newWeatherEventName
      await weatherEventsPage.AddWeatherEvent(newWeatherEvent)

      // make sure it exists and there is only 1
      await table.SetTableSearch(newWeatherEventName)
      expect(await table.VisibleRowCount()).toBe(1)

      // Setup and edit service area
      const updateWeatherEvent = deepCopy(newWeatherEvent)
      updateWeatherEvent.name = editedWeatherEventName

      const rowIndex = await weatherEventsPage.FindIndexOfRowAtPosition(1)
      await weatherEventsPage.EditWeatherEvent(rowIndex, updateWeatherEvent)

      // make sure it exists and there is only 1
      await table.SetTableSearch(editedWeatherEventName)
      expect(await table.VisibleRowCount()).toBe(1)

      // Delete the vendor rate in the first(only) row
      const editedRowIndex = await weatherEventsPage.FindIndexOfRowAtPosition(1)
      await weatherEventsPage.RemoveExistingWeatherEvent(editedRowIndex)
      await table.CancelPinnedTableSearch(editedWeatherEventName)

      if (!(await table.IsEmpty())) {
        await table.SetTableSearch(editedWeatherEventName)
        // make sure it no longer exists
        expect(await table.VisibleRowCount()).toBe(0)
      }
    })
  }
)
