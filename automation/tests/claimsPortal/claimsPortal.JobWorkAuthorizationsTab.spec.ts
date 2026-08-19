import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedJobTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
  Filter_Radio_WorkAuthStatus,
  JobTabTypes,
  WorkAuthorizations_DataTable_ActionMenuItems,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedJob, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalRecipientInfoDialog } from '../../library/claimsPortal/dialogs/claimsPortalRecipientInfoDialog.js'
import { ClaimsPortalJobPage } from '../../library/claimsPortal/pages/claimsPortalJobPage.js'
import { ClaimsPortalJobWorkAuthorizationsTab } from '../../library/claimsPortal/tabs/claimsPortalJobWorkAuthorizationsTab.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'
import { ClaimsPortalJobsPage } from '../../library/claimsPortal/pages/claimsPortalJobsPage.js'

const environment = DefaultEnvironment

test.describe(
  'Job Page: Work Authorizations Tab',
  {
    tag: [Tags.ClaimsPortal, Tags.Job, Tags.WorkAuthorizations],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // find a random job and go to it
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const { jobPage } = await jobsPage.OpenRandomJob()

      // Verify that we land on the Job page for that job, defaulting to the Portal Access section
      const workAuthTab = (await jobPage.SelectJobTab(
        JobTabTypes.WorkAuthorizations
      )) as ClaimsPortalJobWorkAuthorizationsTab
      expect(await jobPage.IsTabActive(JobTabTypes.WorkAuthorizations)).toBe(true)
      expect(jobPage.page.url()).toBe(workAuthTab.URL)
      const table = workAuthTab.DataTable_WorkAuthorizations

      // Verify Title
      await workAuthTab.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Send Work Authorization button/link exists
      expect(await workAuthTab.Link_SendWorkAuthorization.IsVisible()).toBe(true)

      // Verify Work Authorizations Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // Check table settings dialog and columns
      await workAuthTab.VerifyTableSettingColumns()

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
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Verify that we land on the Job page for that job, defaulting to the Portal Access section
      const workAuthTab = (await jobPage.SelectJobTab(
        JobTabTypes.WorkAuthorizations
      )) as ClaimsPortalJobWorkAuthorizationsTab
      expect(await jobPage.IsTabActive(JobTabTypes.WorkAuthorizations)).toBe(true)
      expect(jobPage.page.url()).toBe(workAuthTab.URL)
      const table = workAuthTab.DataTable_WorkAuthorizations

      // Verify Title
      await workAuthTab.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Send Work Authorization button/link exists
      expect(await workAuthTab.Link_SendWorkAuthorization.IsVisible()).toBe(true)

      // Verify Work Authorizations Table layout...
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

    test('Work Authorizations Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const workAuthTab = (await jobPage.SelectJobTab(
        JobTabTypes.WorkAuthorizations
      )) as ClaimsPortalJobWorkAuthorizationsTab
      const table = workAuthTab.DataTable_WorkAuthorizations

      // Click the Open Table Settings button on the Work Authorizations Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await workAuthTab.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Work Authorizations Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test job page
        const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
        const jobPage = new ClaimsPortalJobPage(global, testJob)
        await jobPage.NavigateDirectlyToJob()

        //Verify that we land on the Job page for that job, defaulting to the Info section
        const workAuthTab = (await jobPage.SelectJobTab(
          JobTabTypes.WorkAuthorizations
        )) as ClaimsPortalJobWorkAuthorizationsTab
        const table = workAuthTab.DataTable_WorkAuthorizations

        // Click the Open Table Settings button on the Work Authorizations Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.WorkAuthorizations_Document)
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.WorkAuthorizations_Document)
        ).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.WorkAuthorizations_Status)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.WorkAuthorizations_Status)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.WorkAuthorizations_Created)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.WorkAuthorizations_Created)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.WorkAuthorizations_Expires)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.WorkAuthorizations_Expires)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(
          DataTable_Columns_Type.WorkAuthorizations_Recipients
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.WorkAuthorizations_Recipients)
        ).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.WorkAuthorizations_Document)
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.WorkAuthorizations_Document)
        ).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.WorkAuthorizations_Status)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.WorkAuthorizations_Status)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.WorkAuthorizations_Created)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.WorkAuthorizations_Created)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.WorkAuthorizations_Expires)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.WorkAuthorizations_Expires)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.WorkAuthorizations_Recipients)
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.WorkAuthorizations_Recipients)
        ).toBe(true)
        await tableSettingsDialog.Close()
      })

      test('Work Authorizations Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test job page
        const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
        const jobPage = new ClaimsPortalJobPage(global, testJob)
        await jobPage.NavigateDirectlyToJob()

        //Verify that we land on the Job page for that job, defaulting to the Info section, the navigate to Work Authorizations
        const workAuthTab = (await jobPage.SelectJobTab(
          JobTabTypes.WorkAuthorizations
        )) as ClaimsPortalJobWorkAuthorizationsTab
        const table = workAuthTab.DataTable_WorkAuthorizations

        // Make sure the columns we need are visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.WorkAuthorizations_Document)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.WorkAuthorizations_Created)
        await tableSettingsDialog.Close()

        // Examine Document and Created columns
        // Verify initial states are unsorted
        const initialDocumentSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.WorkAuthorizations_Document
        )
        const initialCreatedSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.WorkAuthorizations_Created
        )
        expect(initialDocumentSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialCreatedSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Document column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.WorkAuthorizations_Document,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify Document is sorted Down and Created is still unsorted
        let currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.WorkAuthorizations_Document
        )
        let currentTypeSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.WorkAuthorizations_Created
        )
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentTypeSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Created column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.WorkAuthorizations_Created,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify Document is now unsorted and Created is sorted Up
        currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.WorkAuthorizations_Document
        )
        currentTypeSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.WorkAuthorizations_Created
        )
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentTypeSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Created column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.WorkAuthorizations_Created,
          DataTable_Column_SortState.Unsorted
        )
        currentTypeSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.WorkAuthorizations_Created
        )
        expect(currentTypeSortState).toBe(DataTable_Column_SortState.Unsorted)
      })
    })

    test('Work Authorizations Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const workAuthTab = (await jobPage.SelectJobTab(
        JobTabTypes.WorkAuthorizations
      )) as ClaimsPortalJobWorkAuthorizationsTab
      const table = workAuthTab.DataTable_WorkAuthorizations

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // Click the Open Table Search button on the Work Authorizations Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await workAuthTab.page.waitForTimeout(1000)
    })

    test('Work Authorizations Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section, then navigate to Work Auth
      const workAuthTab = (await jobPage.SelectJobTab(
        JobTabTypes.WorkAuthorizations
      )) as ClaimsPortalJobWorkAuthorizationsTab
      const table = workAuthTab.DataTable_WorkAuthorizations

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields (Name/Type)
      const nameSearchTerm = testJob.testData.jobWorkAuthSearch
      await table.SetTableSearch(nameSearchTerm)

      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBeGreaterThanOrEqual(1)

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      // and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      const nameFilteredOffRowCount = await table.VisibleRowCount()
      expect(nameFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      const typeSearchTerm = 'In Progress'
      const tableSearchDialog = await table.SetTableSearch(typeSearchTerm, true)

      // Verify table is filtered
      const typeFilteredRowCount = await table.VisibleRowCount()
      expect(typeFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const typeFilterOffRowCount = await table.VisibleRowCount()
      expect(typeFilterOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Work Authorizations Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const workAuthTab = (await jobPage.SelectJobTab(
        JobTabTypes.WorkAuthorizations
      )) as ClaimsPortalJobWorkAuthorizationsTab
      const table = workAuthTab.DataTable_WorkAuthorizations

      // Click the Add Table Filter button on the Work Authorizations Table
      let tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.WorkAuthorizations_Document
      )

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await workAuthTab.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.WorkAuthorizations_Status
      )
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Work Authorizations Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const workAuthTab = (await jobPage.SelectJobTab(
        JobTabTypes.WorkAuthorizations
      )) as ClaimsPortalJobWorkAuthorizationsTab
      const table = workAuthTab.DataTable_WorkAuthorizations

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobWorkAuthTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const documentFilterTerm = testJob.testData.jobWorkAuthSearch
      const { pinnedFilter: documentPinnedFilter } = await table.SetTableFilter_Text(
        documentFilterTerm,
        DataTable_Columns_Type.WorkAuthorizations_Document
      )
      const documentFilteredRowCount = await table.VisibleRowCount()
      expect(documentFilteredRowCount).toBeGreaterThanOrEqual(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(documentPinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(documentPinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(documentPinnedFilter)).toBe(false)
      const documentFilteredOffRowCount = await table.VisibleRowCount()
      expect(documentFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const { tableFilterDialog } = await workAuthTab.SetTableFilter_Radio_WorkAuthStatus(
        Filter_Radio_WorkAuthStatus.InProgress,
        false,
        true
      )

      // Verify table is filtered
      const statusFilteredRowCount = await table.VisibleRowCount()
      expect(statusFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_GroupClear.Click()

      // Verify column is NOT filtered
      const statusFilterOffRowCount = await table.VisibleRowCount()
      expect(statusFilterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Work Authorizations Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const workAuthTab = (await jobPage.SelectJobTab(
        JobTabTypes.WorkAuthorizations
      )) as ClaimsPortalJobWorkAuthorizationsTab
      const table = workAuthTab.DataTable_WorkAuthorizations

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobWorkAuthTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const documentFilterTerm = testJob.testData.jobWorkAuthSearch
      const { pinnedFilter: documentPinnedFilter } = await table.SetTableFilter_Text(
        documentFilterTerm,
        DataTable_Columns_Type.WorkAuthorizations_Document
      )
      const documentFilteredRowCount = await table.VisibleRowCount()
      expect(documentFilteredRowCount).toBeGreaterThanOrEqual(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(documentPinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedDocumentFilterTerm = 'There can be no matches'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedDocumentFilterTerm,
        DataTable_Columns_Type.WorkAuthorizations_Document,
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

    test('Work Authorizations Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const workAuthTab = (await jobPage.SelectJobTab(
        JobTabTypes.WorkAuthorizations
      )) as ClaimsPortalJobWorkAuthorizationsTab
      const table = workAuthTab.DataTable_WorkAuthorizations

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

    test('Work Authorizations Table - Verify Action Menu: Copy Work Auth ID', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const workAuthTab = (await jobPage.SelectJobTab(
        JobTabTypes.WorkAuthorizations
      )) as ClaimsPortalJobWorkAuthorizationsTab
      const table = workAuthTab.DataTable_WorkAuthorizations

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobWorkAuthTableMessage)
        return
      }

      const rowIndex = '0'
      await workAuthTab.SelectActionMenuItem(
        rowIndex,
        WorkAuthorizations_DataTable_ActionMenuItems.CopyWorkAuthId
      )
      const copiedID = await workAuthTab.GetClipboardText()

      // Verify clipboard contains a 36 character ID
      expect(copiedID.length).toBe(36)
      expect(copiedID.startsWith('workauthorization_')).toBe(true)
    })

    test('Work Authorizations Table - Verify Action Menu Visibility: Recall Document/Remind Recipient', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const workAuthTab = (await jobPage.SelectJobTab(
        JobTabTypes.WorkAuthorizations
      )) as ClaimsPortalJobWorkAuthorizationsTab
      const table = workAuthTab.DataTable_WorkAuthorizations

      // Filter for a InProgress Work Auth
      const { pinnedFilter: pinnedInprogressFilter } =
        await workAuthTab.SetTableFilter_Radio_WorkAuthStatus(
          Filter_Radio_WorkAuthStatus.InProgress
        )
      const inProgressFilteredRowCount = await table.VisibleRowCount()
      if (inProgressFilteredRowCount > 0) {
        // Verify Remind Recipients and Recall Document menu items ARE available for this in progress work auth
        const rowIndex = await table.FetchRowIndexFromRowPosition(1)
        const remindMenuIsVisible = await workAuthTab.IsActionMenuItemVisible(
          rowIndex,
          WorkAuthorizations_DataTable_ActionMenuItems.RemindRecipients
        )
        expect(remindMenuIsVisible).toBe(true)
        const recallMenuIsVisible = await workAuthTab.IsActionMenuItemVisible(
          rowIndex,
          WorkAuthorizations_DataTable_ActionMenuItems.RecallDocument
        )
        expect(recallMenuIsVisible).toBe(true)
      }

      // Clear existing filter
      await table.CancelPinnedTableFilter(pinnedInprogressFilter)

      // Filter for a Completed Work Auth
      const { pinnedFilter: pinnedCompletedFilter } =
        await workAuthTab.SetTableFilter_Radio_WorkAuthStatus(Filter_Radio_WorkAuthStatus.Completed)
      const completedFilteredRowCount = await table.VisibleRowCount()

      if (completedFilteredRowCount > 0) {
        // Verify Remind Recipients and Recall Document menu items are NOT available for this completed work auth
        const rowIndex = await table.FetchRowIndexFromRowPosition(1)
        const remindMenuIsVisible = await workAuthTab.IsActionMenuItemVisible(
          rowIndex,
          WorkAuthorizations_DataTable_ActionMenuItems.RemindRecipients
        )
        expect(remindMenuIsVisible).toBe(false)
        const recallMenuIsVisible = await workAuthTab.IsActionMenuItemVisible(
          rowIndex,
          WorkAuthorizations_DataTable_ActionMenuItems.RecallDocument
        )
        expect(recallMenuIsVisible).toBe(false)

        // Clear existing filter
        await table.CancelPinnedTableFilter(pinnedCompletedFilter)
      }
    })

    test('Work Authorizations Table - Verify Action Menu: Recipient Info button', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const workAuthTab = (await jobPage.SelectJobTab(
        JobTabTypes.WorkAuthorizations
      )) as ClaimsPortalJobWorkAuthorizationsTab
      const table = workAuthTab.DataTable_WorkAuthorizations

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobWorkAuthTableMessage)
        return
      }

      // grab the target claim number
      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
      await table.ClickButtonInDataCell(
        rowIndex,
        DataTable_Columns_Type.WorkAuthorizations_Recipients
      )

      // bring up the Reciepient Info dialog
      const recipientInfoDialog = new ClaimsPortalRecipientInfoDialog(global)
      await workAuthTab.page.waitForTimeout(1000)

      // Verify the title
      await recipientInfoDialog.VerifyTitle()

      // Verify Reciepient Info dialog popup - closes with click on "X" button
      await recipientInfoDialog.Close()
      await expect(recipientInfoDialog.Title.locator).not.toBeAttached()
      await workAuthTab.page.waitForTimeout(1000)
    })

    test('Work Authorizations Table - Verify Initial Work Auth Wizard UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section, the navigate to Work Authorizations
      const workAuthTab = (await jobPage.SelectJobTab(
        JobTabTypes.WorkAuthorizations
      )) as ClaimsPortalJobWorkAuthorizationsTab

      // Verify Create Work Auth Flow
      const workAuthWizard = await workAuthTab.OpenWorkAuthWizard()

      // Verify Step One
      await workAuthWizard.StepOne_Title.VerifyExpectedText()
      await expect(workAuthWizard.Button_Next.locator).toBeAttached()
      await expect(workAuthWizard.StepOne_TextBox_Filter.locator).toBeAttached()
      await expect(workAuthWizard.StepOne_Button_ClearFilter.locator).toBeAttached()

      // Verify Filter
      await workAuthWizard.page.waitForTimeout(4000)
      const initialTemplateCount = await workAuthWizard.StepOne_VisibleTemplatesCount()
      await workAuthWizard.StepOne_TextBox_Filter.Fill('No match Expected')
      const filteredTemplateCount = await workAuthWizard.StepOne_VisibleTemplatesCount()
      expect(initialTemplateCount).toBeGreaterThanOrEqual(filteredTemplateCount)

      // clear filter
      await workAuthWizard.StepOne_Button_ClearFilter.Click()
      await workAuthWizard.page.waitForTimeout(10000)
      const clearedTemplateCount = await workAuthWizard.StepOne_VisibleTemplatesCount()
      expect(initialTemplateCount).toBe(clearedTemplateCount)

      // Select a template by index
      const selectedTemplateByIndex = await workAuthWizard.StepOne_SelectTemplateByIndex(0)
      expect(selectedTemplateByIndex).not.toBe(null)

      // Select a template by name
      const selectedTemplateByName = await workAuthWizard.StepOne_SelectTemplateByName(
        testJob.testData.jobWorkAuthSearch
      )
      expect(selectedTemplateByName).not.toBe(null)

      // move to step two
      await workAuthWizard.Button_Next.Click()
      await workAuthWizard.page.waitForTimeout(4000)

      // Verify Step 2 title
      await workAuthWizard.StepTwo_Title.VerifyExpectedText()

      // Verify we can go back
      await workAuthWizard.Button_Back.Click()
      await workAuthWizard.page.waitForTimeout(2000)
      await workAuthWizard.StepOne_Title.VerifyExpectedText()
    })
  }
)
