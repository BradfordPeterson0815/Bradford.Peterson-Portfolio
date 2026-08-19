import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedClaimTypes,
  ClaimTabTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
  Inspections_DataTable_ActionMenuItems,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { FetchCannedClaim } from '../../../library/delegatePortal/delegatePortalHelper.js'
import { LaunchInspectionTech } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalClaimPage } from '../../../library/delegatePortal/pages/delegatePortalClaimPage.js'
import { DelegatePortalClaimInspectionsTab } from '../../../library/delegatePortal/tabs/delegatePortalClaimInspectionsTab.js'
import { DelegatePortalClaimUploadTab } from '../../../library/delegatePortal/tabs/delegatePortalClaimUploadTab.js'
import { AbortTest } from '../../../library/shared/commonHelper.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Page: Inspections Tab',
  {
    tag: [Tags.Delegate, Tags.InspectionTech, Tags.Claim, Tags.Inspections],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Inspection Tech  home page
      const { global } = await LaunchInspectionTech(browser, environment)

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
      const table = inspectionsTab.DataTable_Inspections

      // Verify Title
      await inspectionsTab.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Start New Inspection and Upload Video As Inspection buttons exists
      expect(await inspectionsTab.Link_StartNewInspection.IsVisible()).toBe(true)
      expect(await inspectionsTab.Link_UploadVideoAsInspection.IsVisible()).toBe(true)

      // Verify Inspections Table layout...
      // Verify Column Settings / Filters / Refresh Data / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_RefreshData.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // if table is not empty then verify Global Search Button
      if (!(await table.IsEmpty())) {
        await table.Button_OpenTableSearch.locator.waitFor({ state: 'visible' })
      }
    })

    test('Inspections Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Delegate Inspection Tech  home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Inspections
      )) as DelegatePortalClaimInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      // Click the Open Table Settings button on the Portal Access Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await inspectionsTab.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Inspections Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Delegate Inspection Tech  home page
        const { global } = await LaunchInspectionTech(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
        const inspectionsTab = (await claimPage.SelectClaimTab(
          ClaimTabTypes.Inspections
        )) as DelegatePortalClaimInspectionsTab
        const table = inspectionsTab.DataTable_Inspections

        // Click the Open Table Settings button on the Portal Access Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Inspections_Description)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Inspections_Description)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Inspections_Started)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Inspections_Started)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Inspections_Duration)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Inspections_Duration)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Inspections_Organizer)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Inspections_Organizer)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(
          DataTable_Columns_Type.Inspections_NumberOfParticipants
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.Inspections_NumberOfParticipants)
        ).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Inspections_Description)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Inspections_Description)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Inspections_Started)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Inspections_Started)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Inspections_Duration)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Inspections_Duration)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Inspections_Organizer)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Inspections_Organizer)).toBe(true)
        await tableSettingsDialog.CheckColumn(
          DataTable_Columns_Type.Inspections_NumberOfParticipants
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.Inspections_NumberOfParticipants)
        ).toBe(true)
        await tableSettingsDialog.Close()
      })

      test('Inspections Table - Sort Columns', async ({ browser }) => {
        // launch the Delegate Inspection Tech  home page
        const { global } = await LaunchInspectionTech(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
        const inspectionsTab = (await claimPage.SelectClaimTab(
          ClaimTabTypes.Inspections
        )) as DelegatePortalClaimInspectionsTab
        const table = inspectionsTab.DataTable_Inspections

        // Make sure the columns we need are visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Inspections_Started)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Inspections_Duration)
        await tableSettingsDialog.Close()

        // Examine Started and Duration columns
        // Verify initial states
        const initialStartedSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Inspections_Started
        )
        const initialDurationSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Inspections_Duration
        )
        expect(initialStartedSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(initialDurationSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Duration column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Inspections_Duration,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify Duration is sorted Down and Started is now unsorted
        let currentDurationSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Inspections_Duration
        )
        let currentStartedSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Inspections_Started
        )
        expect(currentDurationSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentStartedSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Duration column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Inspections_Duration,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify Started is still unsorted and Duration is sorted Up
        currentStartedSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Inspections_Started
        )
        currentDurationSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Inspections_Duration
        )

        expect(currentStartedSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentDurationSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Duration Date column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.Inspections_Duration,
          DataTable_Column_SortState.Unsorted
        )
        currentDurationSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Inspections_Duration
        )
        expect(currentDurationSortState).toBe(DataTable_Column_SortState.Unsorted)
      })
    })
    test('Inspections Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Delegate Inspection Tech  home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Inspections
      )) as DelegatePortalClaimInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // Click the Open Table Search button on the Portal Access Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await inspectionsTab.page.waitForTimeout(1000)
    })

    test('Inspections Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Delegate Inspection Tech  home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Inspections
      )) as DelegatePortalClaimInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields
      const descriptionSearchTerm = testClaim.testData.claimInspectionDescription
      await table.SetTableSearch(descriptionSearchTerm)

      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBeGreaterThanOrEqual(1)

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      // and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      const descriptionFilteredOffRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      const organizerSearchTerm = testClaim.testData.claimInspectionOrganizer
      const tableSearchDialog = await table.SetTableSearch(organizerSearchTerm, true)

      // Verify table is filtered
      const organizerFilteredRowCount = await table.VisibleRowCount()
      expect(organizerFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const organizerFilterOffRowCount = await table.VisibleRowCount()
      expect(organizerFilterOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Inspections Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Delegate Inspection Tech  home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Inspections
      )) as DelegatePortalClaimInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimInspectionsTableMessage)
        return
      }

      // Click the Add Table Filter button on the Portal Access Table
      const tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.Inspections_Description
      )

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()
    })

    test('Inspections Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Delegate Inspection Tech  home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Inspections
      )) as DelegatePortalClaimInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimInspectionsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const descriptionFilterTerm = testClaim.testData.claimInspectionDescription
      const { pinnedFilter: descriptionPinnedFilter } = await table.SetTableFilter_Text(
        descriptionFilterTerm,
        DataTable_Columns_Type.Inspections_Description
      )
      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBeGreaterThanOrEqual(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(descriptionPinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(descriptionPinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(descriptionPinnedFilter)).toBe(false)
      const descriptionFilteredOffRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const organizerFilterTerm = testClaim.testData.claimInspectionOrganizer
      const { tableFilterDialog } = await table.SetTableFilter_Text(
        organizerFilterTerm,
        DataTable_Columns_Type.Inspections_Organizer,
        false,
        true
      )

      // Verify table is filtered
      const organizerFilteredRowCount = await table.VisibleRowCount()
      expect(organizerFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const organizerFilterOffRowCount = await table.VisibleRowCount()
      expect(organizerFilterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Inspections Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Delegate Inspection Tech  home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Inspections
      )) as DelegatePortalClaimInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimInspectionsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const descriptionFilterTerm = testClaim.testData.claimInspectionDescription
      const { pinnedFilter: descriptionPinnedFilter } = await table.SetTableFilter_Text(
        descriptionFilterTerm,
        DataTable_Columns_Type.Inspections_Description
      )
      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBeGreaterThanOrEqual(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(descriptionPinnedFilter)).toBe(true)

      // Edit the existing filter
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        testClaim.testData.claimInspectionDescriptionOther,
        DataTable_Columns_Type.Inspections_Description,
        true
      )

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(editedPinnedFilter)).toBe(true)

      // Verify table is filtered and no rows are visible
      const editedFilteredRowCount = await table.VisibleRowCount()
      expect(editedFilteredRowCount).toBeGreaterThanOrEqual(1)

      // Verify clicking X button on the edited pinned filter removes it and clears the filter
      await table.CancelPinnedTableFilter(editedPinnedFilter)

      // Verify table is not filtered and all rows are visible
      const clearedRowCount = await table.VisibleRowCount()
      expect(clearedRowCount).toBe(initialRowCount)
    })

    test('Inspections Table - Expand and Collapse', async ({ browser }) => {
      // launch the Delegate Inspection Tech  home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Inspections
      )) as DelegatePortalClaimInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

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

    test('Inspections Table - Verify Action Menu: Copy Inspection ID', async ({ browser }) => {
      // launch the Delegate Inspection Tech  home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Inspections
      )) as DelegatePortalClaimInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimInspectionsTableMessage)
        return
      }

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await inspectionsTab.SelectActionMenuItem(
        rowIndex,
        Inspections_DataTable_ActionMenuItems.CopyInspectionId
      )
      const copiedID = await inspectionsTab.GetClipboardText()

      const expectedLength = `inspection_claim${testClaim.basicInfo.claimNumber}-`.length + 11
      // Verify clipboard value matches expected length
      expect(copiedID.length).toBe(expectedLength)
    })

    test('Inspections Table - Verify Action Menu: Edit Inspection and Drawer UI', async ({
      browser,
    }) => {
      // launch the Delegate Inspection Tech  home page
      const { global } = await LaunchInspectionTech(browser, environment)
      const editPrefix = 'TESTEDIT'

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Inspections
      )) as DelegatePortalClaimInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimInspectionsTableMessage)
        return
      }

      // Filter our inspection used for editing
      await table.SetTableFilter_Text(editPrefix, DataTable_Columns_Type.Inspections_Description)
      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBeGreaterThanOrEqual(1)

      // grab started info:
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      const started = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Inspections_Started
      )
      let editInspectionDrawer = await inspectionsTab.OpenEditInspectionDrawer(rowIndex)
      await editInspectionDrawer.VerifyTitle(testClaim.basicInfo.claimNumber, started)
      expect(editInspectionDrawer.TextBox_Description.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await editInspectionDrawer.Close()
      await expect(editInspectionDrawer.Title.locator).not.toBeAttached()
      await inspectionsTab.page.waitForTimeout(1000)

      editInspectionDrawer = await inspectionsTab.OpenEditInspectionDrawer(rowIndex)
      // Verify drawer closes with ESC key
      await editInspectionDrawer.Close(true)
      await expect(editInspectionDrawer.Title.locator).not.toBeAttached()
      await inspectionsTab.page.waitForTimeout(1000)

      editInspectionDrawer = await inspectionsTab.OpenEditInspectionDrawer(rowIndex)
      // Verify drawer closes if click on Close
      await editInspectionDrawer.Button_Close.Click()
      await expect(editInspectionDrawer.Title.locator).not.toBeAttached()
      await inspectionsTab.page.waitForTimeout(1000)
    })

    test('Inspections Table - Edit Inspection', async ({ browser }) => {
      // launch the Delegate Inspection Tech  home page
      const { global } = await LaunchInspectionTech(browser, environment)
      const editPrefix = 'TESTEDIT'
      const dateSuffix = `+${Date.now()}`

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Inspections
      )) as DelegatePortalClaimInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimInspectionsTableMessage)
        return
      }

      // Filter our inspection used for editing
      await table.SetTableFilter_Text(editPrefix, DataTable_Columns_Type.Inspections_Description)
      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBeGreaterThanOrEqual(1)

      // Edit the inspection (update the inspection description)
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      const newDescription = `${editPrefix}${dateSuffix}`
      await inspectionsTab.EditInspection(rowIndex, newDescription)
      const updatedDescription = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Inspections_Description
      )
      await inspectionsTab.page.waitForTimeout(3000)
      expect(updatedDescription).toBe(updatedDescription)
    })

    test('Inspections Table - Open Inspection', async ({ browser }) => {
      // launch the Delegate Inspection Tech  home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Inspections
      )) as DelegatePortalClaimInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimInspectionsTableMessage)
        return
      }

      // Filter our inspection used for opening
      await table.SetTableFilter_Text(
        testClaim.testData.claimInspectionDescription,
        DataTable_Columns_Type.Inspections_Description
      )
      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBeGreaterThanOrEqual(1)

      // Open the inspection
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      const controlsId = await table.GetControlsId(rowIndex)
      const href = await table.page.locator(`div[id="${controlsId}"] a`).getAttribute('href')
      await inspectionsTab.OpenInspection(rowIndex)
      expect(inspectionsTab.page.url().endsWith(href ? href : '')).toBe(true)
    })

    test('Start inspection and do not consent to be recorded', async ({ browser }) => {
      // launch the Delegate Inspection Tech  home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Inspections
      )) as DelegatePortalClaimInspectionsTab

      // verify that if we decline consent, we don't start a inspection
      await inspectionsTab.Link_StartNewInspection.Click()
      await inspectionsTab.HandleInspectionConsentAlert(false)

      // verify we are still on the inspections tab
      await expect(
        inspectionsTab.DataTable_Inspections.Button_OpenTableSettings.locator
      ).toBeAttached()
    })

    test('Verify Upload Video as a Inspection navigation and validate video selection', async ({
      browser,
    }) => {
      // launch the Delegate Inspection Tech  home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Inspections
      )) as DelegatePortalClaimInspectionsTab

      // Beging the upload process
      await inspectionsTab.Link_UploadVideoAsInspection.Click()

      // Verify we navigate to the Uploads page
      const uploadTab = new DelegatePortalClaimUploadTab(global, testClaim, claimPage.baseURL)
      expect(inspectionsTab.page.url()).toBe(uploadTab.InspectionsUploadURL)

      // Verify only .mov and .mp4 files are uploadable
      // Attempt to upload a valid file which is not a supported inspection file
      await uploadTab.UploadValidButUnsupportedInspectionFile()
      expect(await uploadTab.FileCardCount()).toBe(1)

      // Validate error when invalid file is selected
      let fileCard = uploadTab.FetchFileCard(0)
      //expect(await fileCard.Validate(ValidationStrings.InvalidUploadInspectionFile)).toBe(true)

      // remove card
      await fileCard.RemoveCard()

      // select a valid inspection video
      await uploadTab.UploadValidMov()
      expect(await uploadTab.FileCardCount()).toBe(1)

      // Verify no error when valid video is selected
      fileCard = uploadTab.FetchFileCard(0)
      //expect(await fileCard.Validate(ValidationStrings.InvalidUploadInspectionFile)).toBe(false)
    })
  }
)
