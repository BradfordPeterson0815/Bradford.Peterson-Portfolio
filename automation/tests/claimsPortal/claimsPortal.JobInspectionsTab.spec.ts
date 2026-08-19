import { expect } from '@playwright/test'
import test from '../../library/shared/testHooks.js'
import { FetchCannedJob, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import {
  DefaultEnvironment,
  CannedJobTypes,
  JobTabTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  Inspections_DataTable_ActionMenuItems,
  AbortErrors,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { ClaimsPortalJobPage } from '../../library/claimsPortal/pages/claimsPortalJobPage.js'
import { ClaimsPortalJobInspectionsTab } from '../../library/claimsPortal/tabs/claimsPortalJobInspectionsTab.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import { Tags } from '../../library/shared/constants.js'
import { ClaimsPortalJobsPage } from '../../library/claimsPortal/pages/claimsPortalJobsPage.js'

const environment = DefaultEnvironment

test.describe(
  'Job Page: Inspections Tab',
  {
    tag: [Tags.ClaimsPortal, Tags.Job, Tags.Inspections],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // find a random job and go to it
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const { jobPage } = await jobsPage.OpenRandomJob()

      // Verify that we land on the Job page for that job (Info tab by default), then navigate to the Inspections tab
      const inspectionsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Inspections
      )) as ClaimsPortalJobInspectionsTab
      expect(await jobPage.IsTabActive(JobTabTypes.Inspections)).toBe(true)
      expect(jobPage.page.url()).toBe(inspectionsTab.URL)
      const table = inspectionsTab.DataTable_Inspections

      // Verify Title
      await inspectionsTab.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Check table settings dialog and columns
      await inspectionsTab.VerifyTableSettingColumns()

      // Verify Start New Inspection button exists
      expect(await inspectionsTab.Link_StartNewInspection.IsVisible()).toBe(true)

      // Verify Inspections Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_RefreshData.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      const isEmpty = await table.IsEmpty()

      // if table is empty
      if (isEmpty) {
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

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job (Info tab by default), then navigate to the Inspections tab
      const inspectionsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Inspections
      )) as ClaimsPortalJobInspectionsTab
      expect(await jobPage.IsTabActive(JobTabTypes.Inspections)).toBe(true)
      expect(jobPage.page.url()).toBe(inspectionsTab.URL)
      const table = inspectionsTab.DataTable_Inspections

      // Verify Title
      await inspectionsTab.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Start New Inspection button exists
      expect(await inspectionsTab.Link_StartNewInspection.IsVisible()).toBe(true)

      // Verify Inspections Table layout...
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

    test('Job Page: Inspections Tab - Inspections Table - Settings: Verify UI', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, then navigate to the Inspections tab
      const inspectionsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Inspections
      )) as ClaimsPortalJobInspectionsTab
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

      test('Job Page: Inspections Tab - Inspections Table - Settings: Verify Columns', async ({
        browser,
      }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test job page
        const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
        const jobPage = new ClaimsPortalJobPage(global, testJob)
        await jobPage.NavigateDirectlyToJob()

        //Verify that we land on the Job page for that job, then navigate to the Inspections tab
        const inspectionsTab = (await jobPage.SelectJobTab(
          JobTabTypes.Inspections
        )) as ClaimsPortalJobInspectionsTab
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
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.inspections_Duration)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.inspections_Duration)).toBe(false)
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
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.inspections_Duration)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.inspections_Duration)).toBe(true)
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

      test('Job Page: Inspections Tab - Inspections Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test job page
        const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
        const jobPage = new ClaimsPortalJobPage(global, testJob)
        await jobPage.NavigateDirectlyToJob()

        //Verify that we land on the Job page for that job, then navigate to the Inspections tab
        const inspectionsTab = (await jobPage.SelectJobTab(
          JobTabTypes.Inspections
        )) as ClaimsPortalJobInspectionsTab
        const table = inspectionsTab.DataTable_Inspections

        // Make sure the columns we need are visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Inspections_Started)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.inspections_Duration)
        await tableSettingsDialog.Close()

        // Examine Started and Duration columns
        // Verify initial states
        const initialStartedSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Inspections_Started
        )
        const initialDurationSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.inspections_Duration
        )
        expect(initialStartedSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(initialDurationSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Duration column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.inspections_Duration,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify Duration is sorted Down and Started is now unsorted
        let currentDurationSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.inspections_Duration
        )
        let currentStartedSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Inspections_Started
        )
        expect(currentDurationSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentStartedSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Duration column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.inspections_Duration,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify Started is still unsorted and Duration is sorted Up
        currentStartedSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Inspections_Started
        )
        currentDurationSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.inspections_Duration
        )

        expect(currentStartedSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentDurationSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Duration Date column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.inspections_Duration,
          DataTable_Column_SortState.Unsorted
        )
        currentDurationSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.inspections_Duration
        )
        expect(currentDurationSortState).toBe(DataTable_Column_SortState.Unsorted)
      })
    })

    test('Job Page: Inspections Tab - Inspections Table - Global Search: Verify UI', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, then navigate to the Inspections tab
      const inspectionsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Inspections
      )) as ClaimsPortalJobInspectionsTab
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

    test('Job Page: Inspections Tab - Inspections Table - Global Search: Verify search', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, then navigate to the Inspections tab
      const inspectionsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Inspections
      )) as ClaimsPortalJobInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields
      const descriptionSearchTerm = testJob.testData.jobInspectionDescription
      await table.SetTableSearch(descriptionSearchTerm)

      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBe(1)

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      // and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      const descriptionFilteredOffRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      const organizerSearchTerm = testJob.testData.jobInspectionOrganizer
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

    test('Job Page: Inspections Tab - Inspections Table - Table Filter: Verify UI', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, then navigate to the Inspections tab
      const inspectionsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Inspections
      )) as ClaimsPortalJobInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      // Click the Add Table Filter button on the Portal Access Table
      let tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.Inspections_Description
      )

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await inspectionsTab.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Inspections_Description)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Job Page: Inspections Tab - Inspections Table - Table Filter: Add Filter', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, then navigate to the Inspections tab
      const inspectionsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Inspections
      )) as ClaimsPortalJobInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobInspectionsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const descriptionFilterTerm = testJob.testData.jobInspectionDescription
      const { pinnedFilter: descriptionPinnedFilter } = await table.SetTableFilter_Text(
        descriptionFilterTerm,
        DataTable_Columns_Type.Inspections_Description
      )
      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(descriptionPinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(descriptionPinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(descriptionPinnedFilter)).toBe(false)
      const descriptionFilteredOffRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const organizerFilterTerm = testJob.testData.jobInspectionOrganizer
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

    test('Job Page: Inspections Tab - Inspections Table - Table Filter: Edit Filter', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, then navigate to the Inspections tab
      const inspectionsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Inspections
      )) as ClaimsPortalJobInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobInspectionsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const descriptionFilterTerm = testJob.testData.jobInspectionDescription
      const { pinnedFilter: descriptionPinnedFilter } = await table.SetTableFilter_Text(
        descriptionFilterTerm,
        DataTable_Columns_Type.Inspections_Description
      )
      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(descriptionPinnedFilter)).toBe(true)

      // Edit the existing filter
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        testJob.testData.jobInspectionDescriptionOther,
        DataTable_Columns_Type.Inspections_Description,
        true
      )

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(editedPinnedFilter)).toBe(true)

      // Verify table is filtered and 1 row is visible
      const editedFilteredRowCount = await table.VisibleRowCount()
      expect(editedFilteredRowCount).toBe(1)

      // Verify clicking X button on the edited pinned filter removes it and clears the filter
      await table.CancelPinnedTableFilter(editedPinnedFilter)

      // Verify table is not filtered and all rows are visible
      const clearedRowCount = await table.VisibleRowCount()
      expect(clearedRowCount).toBe(initialRowCount)
    })

    test('Job Page: Inspections Tab - Inspections Table - Expand and Collapse', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, then navigate to the Inspections tab
      const inspectionsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Inspections
      )) as ClaimsPortalJobInspectionsTab
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

    test('Job Page: Inspections Tab - Inspections Table - Verify Action Menu: Copy Inspection ID', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, then navigate to the Inspections tab
      const inspectionsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Inspections
      )) as ClaimsPortalJobInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobInspectionsTableMessage)
        return
      }

      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await inspectionsTab.SelectActionMenuItem(
        rowIndex,
        Inspections_DataTable_ActionMenuItems.CopyInspectionId
      )
      const copiedID = await inspectionsTab.GetClipboardText()
      const expectedLength = `inspection_job${testJob.jobDetails.jobId}-`.length + 1
      // Verify clipboard value matches expected length
      expect(copiedID.length).toBe(expectedLength)
    })

    test('Job Page: Inspections Tab - Inspections Table - Verify Action Menu: Edit Inspection and Drawer UI', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const editPrefix = 'TESTEDIT'

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, then navigate to the Inspections tab
      const inspectionsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Inspections
      )) as ClaimsPortalJobInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobInspectionsTableMessage)
        return
      }

      // Filter our inspection used for editing
      await table.SetTableFilter_Text(editPrefix, DataTable_Columns_Type.Inspections_Description)
      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBe(1)

      // grab started info:
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      const started = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Inspections_Started
      )
      let editInspectionDrawer = await inspectionsTab.OpenEditInspectionDrawer(rowIndex)
      await editInspectionDrawer.VerifyTitle(testJob.jobDetails.jobNumber, started)
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

    test('Job Page: Inspections Tab - Inspections Table - Edit Inspection', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const editPrefix = 'TESTEDIT'
      const dateSuffix = `+${Date.now()}`

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, then navigate to the Inspections tab
      const inspectionsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Inspections
      )) as ClaimsPortalJobInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobInspectionsTableMessage)
        return
      }

      // Filter our inspection used for editing
      await table.SetTableFilter_Text(editPrefix, DataTable_Columns_Type.Inspections_Description)
      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBe(1)

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

    test('Job Page: Inspections Tab - Inspections Table - Open Inspection', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, then navigate to the Inspections tab
      const inspectionsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Inspections
      )) as ClaimsPortalJobInspectionsTab
      const table = inspectionsTab.DataTable_Inspections

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobInspectionsTableMessage)
        return
      }

      // Filter our inspection used for opening
      await table.SetTableFilter_Text(
        testJob.testData.jobInspectionDescription,
        DataTable_Columns_Type.Inspections_Description
      )
      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBe(1)

      // Open the inspection
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      const controlsId = await table.GetControlsId(rowIndex)
      const href = await table.page.locator(`div[id="${controlsId}"] a`).getAttribute('href')
      await inspectionsTab.OpenInspection(rowIndex)
      expect(inspectionsTab.page.url().endsWith(href ? href : '')).toBe(true)
    })
  }
)
