import { expect } from '@playwright/test'
import {
  AbortErrors,
  CallbackRoleSelectionOptions,
  CallbackStatusSelectionOptions,
  CannedClaimTypes,
  ClaimTabTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
  Filter_Radio_CallbackStatus,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { FetchCannedClaim } from '../../../library/delegatePortal/delegatePortalHelper.js'
import { LaunchInspectionTech } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalClaimPage } from '../../../library/delegatePortal/pages/delegatePortalClaimPage.js'
import { DelegatePortalClaimCallbacksTab } from '../../../library/delegatePortal/tabs/delegatePortalClaimCallbacksTab.js'
import { AbortTest } from '../../../library/shared/commonHelper.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Page: Callbacks Tab',
  {
    tag: [Tags.Delegate, Tags.InspectionTech, Tags.Claim, Tags.Callbacks],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Callbacks tab
      const callbacksTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Callbacks
      )) as DelegatePortalClaimCallbacksTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Callbacks)).toBe(true)
      expect(claimPage.page.url()).toBe(callbacksTab.URL)
      const table = callbacksTab.DataTable_Callbacks

      // Verify Title for Callbacks Table
      await callbacksTab.Title_Callbacks.VerifyExpectedText()

      // Verify Callbacks Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Callbacks Table layout...
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

    test('Callbacks Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Callback Requests tab
      const callbacksTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Callbacks
      )) as DelegatePortalClaimCallbacksTab
      const table = callbacksTab.DataTable_Callbacks

      // Click the Open Table Settings button on the Callbacks Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await callbacksTab.page.waitForTimeout(1000)
    })
    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })
      test('Callbacks Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Delegate Inspection Tech home page
        const { global } = await LaunchInspectionTech(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim, then navigate to the Callback Requests tab
        const callbacksTab = (await claimPage.SelectClaimTab(
          ClaimTabTypes.Callbacks
        )) as DelegatePortalClaimCallbacksTab
        const table = callbacksTab.DataTable_Callbacks

        // Click the Open Table Settings button on the Callbacks Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Callbacks_Status)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Callbacks_Status)).toBe(false)
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

        await tableSettingsDialog.Close()
      })

      test('Callbacks Table - Sort Columns', async ({ browser }) => {
        // launch the Delegate Inspection Tech home page
        const { global } = await LaunchInspectionTech(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim, then navigate to the Callback Requests tab
        const callbacksTab = (await claimPage.SelectClaimTab(
          ClaimTabTypes.Callbacks
        )) as DelegatePortalClaimCallbacksTab
        const table = callbacksTab.DataTable_Callbacks

        // Make sure the columns we need are visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Callbacks_For_Role)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Callbacks_Status)
        await tableSettingsDialog.Close()

        // Examine Status and ForRole columns
        // Verify initial states are unsorted
        const initialForRoleSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Callbacks_For_Role
        )
        const initialStatusSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Callbacks_Status
        )
        expect(initialForRoleSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialStatusSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the ForRole column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Callbacks_For_Role,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify ForRole is sorted Down and Status is still unsorted
        let currentForRoleSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Callbacks_For_Role
        )
        let currentStatusSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Callbacks_Status
        )
        expect(currentForRoleSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentStatusSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Status column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Callbacks_Status,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify ForRole is now unsorted and Status is sorted Up
        currentForRoleSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Callbacks_For_Role
        )
        currentStatusSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Callbacks_Status
        )
        expect(currentForRoleSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentStatusSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Status column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.Callbacks_Status,
          DataTable_Column_SortState.Unsorted
        )
        currentStatusSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Callbacks_Status
        )
        expect(currentStatusSortState).toBe(DataTable_Column_SortState.Unsorted)
      })
    })
    test('Callbacks Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Callback Requests tab
      const callbacksTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Callbacks
      )) as DelegatePortalClaimCallbacksTab
      const table = callbacksTab.DataTable_Callbacks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // Click the Open Table Search button on the Callbacks Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await callbacksTab.page.waitForTimeout(1000)
    })

    test('Callbacks Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Callback Requests tab
      const callbacksTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Callbacks
      )) as DelegatePortalClaimCallbacksTab
      const table = callbacksTab.DataTable_Callbacks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields
      const descriptionSearchTerm = testClaim.testData.claimCallbackSearch

      await table.SetTableSearch(descriptionSearchTerm)

      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      //  and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      const nameFilteredOffRowCount = await table.VisibleRowCount()
      expect(nameFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      const nameSearchTerm = 'NoMatchExpected'
      const tableSearchDialog = await table.SetTableSearch(nameSearchTerm, true)

      // Verify table is filtered
      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const nameFilterOffRowCount = await table.VisibleRowCount()
      expect(nameFilterOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Callbacks Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Callback Requests tab
      const callbacksTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Callbacks
      )) as DelegatePortalClaimCallbacksTab
      const table = callbacksTab.DataTable_Callbacks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimCallbacksTableMessage)
        return
      }

      // Click the Add Table Filter button on the Callbacks Table
      let tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Callbacks_For_Role)

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await callbacksTab.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Callbacks_Name)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Callbacks Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Callback Requests tab
      const callbacksTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Callbacks
      )) as DelegatePortalClaimCallbacksTab
      const table = callbacksTab.DataTable_Callbacks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimCallbacksTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const notesFilterTerm = testClaim.testData.claimCallbackSearch
      const { pinnedFilter: notesPinnedFilter } = await table.SetTableFilter_Text(
        notesFilterTerm,
        DataTable_Columns_Type.Callbacks_Notes
      )
      const notesFilteredRowCount = await table.VisibleRowCount()
      expect(notesFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(notesPinnedFilter)).toBe(true)

      // and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(notesPinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(notesPinnedFilter)).toBe(false)
      const notesFilteredOffRowCount = await table.VisibleRowCount()
      expect(notesFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const { tableFilterDialog } = await table.SetTableFilter_Selection(
        CallbackRoleSelectionOptions.FieldAgent,
        DataTable_Columns_Type.Callbacks_For_Role,
        false,
        true
      )

      // Verify table is filtered
      const roleFilteredRowCount = await table.VisibleRowCount()
      expect(roleFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const roleFilterOffRowCount = await table.VisibleRowCount()
      expect(roleFilterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Callbacks Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Callback Requests tab
      const callbacksTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Callbacks
      )) as DelegatePortalClaimCallbacksTab
      const table = callbacksTab.DataTable_Callbacks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimCallbacksTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const notesFilterTerm = testClaim.testData.claimCallbackSearch
      await table.SetTableFilter_Text(notesFilterTerm, DataTable_Columns_Type.Callbacks_Notes)
      const notesFilteredRowCount = await table.VisibleRowCount()
      expect(notesFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Edit the existing filter
      const editedNotesFilterTerm = 'There can be no matches'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedNotesFilterTerm,
        DataTable_Columns_Type.Callbacks_Notes,
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
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Callback Requests tab
      const callbacksTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Callbacks
      )) as DelegatePortalClaimCallbacksTab
      const table = callbacksTab.DataTable_Callbacks

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

    test('Update Callback Status - Verify Drawer UI', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Callback Requests tab
      const callbacksTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Callbacks
      )) as DelegatePortalClaimCallbacksTab
      const table = callbacksTab.DataTable_Callbacks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimCallbacksTableMessage)
        return
      }

      let rowIndex = null
      // try requested status
      await callbacksTab.FilterOnCallbackStatus(Filter_Radio_CallbackStatus.Requested)
      if (!(await table.IsEmpty())) {
        rowIndex = await table.FetchRowIndexOfDataByColumnName(
          testClaim.testData.claimCallbackSearch,
          DataTable_Columns_Type.Callbacks_Notes
        )
      }

      // try attempted status
      if (rowIndex == null) {
        await callbacksTab.FilterOnCallbackStatus(Filter_Radio_CallbackStatus.Attempted)
        if (!(await table.IsEmpty())) {
          rowIndex = await table.FetchRowIndexOfDataByColumnName(
            testClaim.testData.claimCallbackSearch,
            DataTable_Columns_Type.Callbacks_Notes
          )
        }
      }

      // try pending status
      if (rowIndex == null) {
        await callbacksTab.FilterOnCallbackStatus(Filter_Radio_CallbackStatus.Pending)
        if (!(await table.IsEmpty())) {
          rowIndex = await table.FetchRowIndexOfDataByColumnName(
            testClaim.testData.claimCallbackSearch,
            DataTable_Columns_Type.Callbacks_Notes
          )
        }
      }

      if (rowIndex == null) {
        throw new Error('Unable to find callback needed for the test')
      }
      let updateCallbackStatusDrawer = await callbacksTab.OpenUpdateCallbackStatusDrawer(
        table,
        rowIndex
      )

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
      await callbacksTab.page.waitForTimeout(1000)

      updateCallbackStatusDrawer = await callbacksTab.OpenUpdateCallbackStatusDrawer(
        table,
        rowIndex
      )
      // Verify drawer closes with ESC key
      await updateCallbackStatusDrawer.Close(true)
      await expect(updateCallbackStatusDrawer.Title.locator).not.toBeAttached()
      await callbacksTab.page.waitForTimeout(1000)

      updateCallbackStatusDrawer = await callbacksTab.OpenUpdateCallbackStatusDrawer(
        table,
        rowIndex
      )
      // Verify drawer closes if click on Close
      await updateCallbackStatusDrawer.Button_Close.Click()
      await expect(updateCallbackStatusDrawer.Title.locator).not.toBeAttached()
      await callbacksTab.page.waitForTimeout(1000)
    })

    test('Update Callback Status - Validate Drawer', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Callback Requests tab
      const callbacksTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Callbacks
      )) as DelegatePortalClaimCallbacksTab
      const table = callbacksTab.DataTable_Callbacks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimCallbacksTableMessage)
        return
      }

      let rowIndex = null
      // try requested status
      await callbacksTab.FilterOnCallbackStatus(Filter_Radio_CallbackStatus.Requested)
      if (!(await table.IsEmpty())) {
        rowIndex = await table.FetchRowIndexOfDataByColumnName(
          testClaim.testData.claimCallbackSearch,
          DataTable_Columns_Type.Callbacks_Notes
        )
      }

      // try attempted status
      if (rowIndex == null) {
        await callbacksTab.FilterOnCallbackStatus(Filter_Radio_CallbackStatus.Attempted)
        if (!(await table.IsEmpty())) {
          rowIndex = await table.FetchRowIndexOfDataByColumnName(
            testClaim.testData.claimCallbackSearch,
            DataTable_Columns_Type.Callbacks_Notes
          )
        }
      }

      // try pending status
      if (rowIndex == null) {
        await callbacksTab.FilterOnCallbackStatus(Filter_Radio_CallbackStatus.Pending)
        if (!(await table.IsEmpty())) {
          rowIndex = await table.FetchRowIndexOfDataByColumnName(
            testClaim.testData.claimCallbackSearch,
            DataTable_Columns_Type.Callbacks_Notes
          )
        }
      }
      if (rowIndex == null) {
        throw new Error('Unable to find callback needed for the test')
      }
      const updateCallbackStatusDrawer = await callbacksTab.OpenUpdateCallbackStatusDrawer(
        table,
        rowIndex
      )

      // Click the Submit button
      await updateCallbackStatusDrawer.Button_Submit.Click()
      await callbacksTab.page.waitForTimeout(1000)

      // Verify validation message for the Select Status field only - no Note UI is displayed
      expect(await updateCallbackStatusDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await updateCallbackStatusDrawer.Button_Close.Click()
    })

    test('Callbacks Page - Verify Change Callback Status', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Callback Requests tab
      const callbacksTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Callbacks
      )) as DelegatePortalClaimCallbacksTab
      const table = callbacksTab.DataTable_Callbacks

      const maxRetries = 10
      const waitTime = 3000

      //If the table is empty - can't do the test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimCallbacksTableMessage)
        return
      }

      let rowIndex = null
      // try requested status
      await callbacksTab.FilterOnCallbackStatus(Filter_Radio_CallbackStatus.Requested)
      if (!(await table.IsEmpty())) {
        rowIndex = await table.FetchRowIndexOfDataByColumnName(
          testClaim.testData.claimCallbackSearch,
          DataTable_Columns_Type.Callbacks_Notes
        )
      }

      // try attempted status
      if (rowIndex == null) {
        await callbacksTab.FilterOnCallbackStatus(Filter_Radio_CallbackStatus.Attempted)
        if (!(await table.IsEmpty())) {
          rowIndex = await table.FetchRowIndexOfDataByColumnName(
            testClaim.testData.claimCallbackSearch,
            DataTable_Columns_Type.Callbacks_Notes
          )
        }
      }

      // try pending status
      if (rowIndex == null) {
        await callbacksTab.FilterOnCallbackStatus(Filter_Radio_CallbackStatus.Pending)
        if (!(await table.IsEmpty())) {
          rowIndex = await table.FetchRowIndexOfDataByColumnName(
            testClaim.testData.claimCallbackSearch,
            DataTable_Columns_Type.Callbacks_Notes
          )
        }
      }

      if (rowIndex == null) {
        throw new Error('Unable to find callback needed for the test')
      }
      await callbacksTab.UpdateCallbackStatus(
        table,
        rowIndex,
        CallbackStatusSelectionOptions.Requested
      )
      await callbacksTab.Reload()
      let currentState = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Callbacks_Status
      )
      let tries = 0
      while (
        currentState != CallbackStatusSelectionOptions.Requested.toUpperCase() &&
        tries < maxRetries
      ) {
        await callbacksTab.page.waitForTimeout(waitTime)
        await callbacksTab.Reload()
        currentState = await table.FetchRowTextDataByColumnName(
          rowIndex,
          DataTable_Columns_Type.Callbacks_Status
        )
        tries++
      }
      if (tries >= maxRetries - 1) {
        throw new Error('Callback has not moved over to Requested')
      }

      // Now set the callback to Pending
      await callbacksTab.UpdateCallbackStatus(
        table,
        rowIndex,
        CallbackStatusSelectionOptions.Pending
      )
      await callbacksTab.Reload()
      currentState = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Callbacks_Status
      )
      tries = 0
      while (
        currentState != CallbackStatusSelectionOptions.Pending.toUpperCase() &&
        tries < maxRetries
      ) {
        await callbacksTab.page.waitForTimeout(waitTime)
        await callbacksTab.Reload()
        currentState = await table.FetchRowTextDataByColumnName(
          rowIndex,
          DataTable_Columns_Type.Callbacks_Status
        )
        tries++
      }
      if (tries >= maxRetries - 1) {
        throw new Error('Callback has not moved over to Pending')
      }

      // Now set the callback to Attempted
      await callbacksTab.UpdateCallbackStatus(
        table,
        rowIndex,
        CallbackStatusSelectionOptions.Attempted
      )
      await callbacksTab.Reload()
      currentState = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Callbacks_Status
      )
      tries = 0
      while (
        currentState != CallbackStatusSelectionOptions.Attempted.toUpperCase() &&
        tries < maxRetries
      ) {
        await callbacksTab.page.waitForTimeout(waitTime)
        await callbacksTab.Reload()
        currentState = await table.FetchRowTextDataByColumnName(
          rowIndex,
          DataTable_Columns_Type.Callbacks_Status
        )
        tries++
      }
      if (tries >= maxRetries - 1) {
        throw new Error('Callback has not moved over to Attempted')
      }
    })
  }
)
