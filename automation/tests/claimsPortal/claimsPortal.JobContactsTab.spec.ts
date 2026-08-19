import { expect } from '@playwright/test'
import { AbortTest } from '../../library/shared/commonHelper.js'
import {
  AbortErrors,
  CannedJobTypes,
  ContactRoles,
  Contacts_DataTable_ActionMenuItems,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
  JobTabTypes,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedJob, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalContactInfoDialog } from '../../library/claimsPortal/dialogs/claimsPortalContactInfoDialog.js'
import { ClaimsPortalJobPage } from '../../library/claimsPortal/pages/claimsPortalJobPage.js'
import { ClaimsPortalJobContactsTab } from '../../library/claimsPortal/tabs/claimsPortalJobContactsTab.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'
import { ClaimsPortalJobsPage } from '../../library/claimsPortal/pages/claimsPortalJobsPage.js'

const environment = DefaultEnvironment

test.describe(
  'Job Page: Contacts Tab',
  {
    tag: [Tags.ClaimsPortal, Tags.Job, Tags.Contacts],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // find a random job and go to it
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const { jobPage } = await jobsPage.OpenRandomJob()

      // Verify that we land on the Job page for that job, defaulting to the Contacts section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
      expect(await jobPage.IsTabActive(JobTabTypes.Contacts)).toBe(true)
      expect(jobPage.page.url()).toBe(contactsTab.URL)
      const tableContacts = contactsTab.DataTable_Contacts
      const tableRemovedContacts = contactsTab.DataTable_Contacts

      // Verify Title for Contacts Table
      await contactsTab.Title_Contacts.VerifyExpectedText()

      // Verify Contacts Table layout...
      // Verify Contacts Column Settings / Filters / Expand button
      expect(await tableContacts.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await tableContacts.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await tableContacts.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await tableContacts.Button_CloseTable.IsVisible()).toBe(false)
      // Check table settings dialog and columns
      await contactsTab.VerifyContactsTableSettingColumns()

      // if table is empty
      if (await tableContacts.IsEmpty()) {
        expect(await tableContacts.Button_OpenTableSearch.IsVisible()).toBe(false)
      } else {
        // Verify global filter works
        const initialRowCount = await tableContacts.VisibleRowCount()

        // Verify setting search input causes the table results to filter across all text fields
        await tableContacts.SetTableSearch('NoMatchExpected')

        const filteredRowCount = await tableContacts.VisibleRowCount()
        expect(filteredRowCount).toBe(0)

        //  and clicking X button on it removes it and clears the search
        await tableContacts.CancelPinnedTableSearch()

        // Verify table is NOT filtered anymore
        expect(await tableContacts.IsGlobalSearchActive()).toBe(false)
        const filterCanceled = await tableContacts.VisibleRowCount()
        expect(filterCanceled).toBe(initialRowCount)
      }

      // Verify Title for Removed Contacts Table
      await contactsTab.Title_RemovedContacts.VerifyExpectedText()

      // Verify Removed Contacts Table layout...
      // Verify RemovedContacts Column Settings / Filters / Expand button
      expect(await tableRemovedContacts.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await tableRemovedContacts.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await tableRemovedContacts.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await tableRemovedContacts.Button_CloseTable.IsVisible()).toBe(false)

      // Check table settings dialog and columns
      await contactsTab.VerifyRemovedContactsTableSettingColumns()

      // if table is empty
      if (await tableRemovedContacts.IsEmpty()) {
        expect(await tableRemovedContacts.Button_OpenTableSearch.IsVisible()).toBe(false)
      } else {
        // Verify global filter works
        const initialRowCount = await tableRemovedContacts.VisibleRowCount()

        // Verify setting search input causes the table results to filter across all text fields
        await tableRemovedContacts.SetTableSearch('NoMatchExpected')

        const filteredRowCount = await tableRemovedContacts.VisibleRowCount()
        expect(filteredRowCount).toBe(0)

        //  and clicking X button on it removes it and clears the search
        await tableRemovedContacts.CancelPinnedTableSearch()

        // Verify table is NOT filtered anymore
        expect(await tableRemovedContacts.IsGlobalSearchActive()).toBe(false)
        const filterCanceled = await tableRemovedContacts.VisibleRowCount()
        expect(filterCanceled).toBe(initialRowCount)
      }

      // Verify Create Contact drawer...
      const createContactDrawer = await contactsTab.OpenCreateContactDrawer()
      await createContactDrawer.VerifyTitle()
      await createContactDrawer.Close()

      // Verify Add/Update Carrier dialog
      const updateCarrierDialog = await contactsTab.OpenUpdateCarrier()
      await updateCarrierDialog.VerifyTitle()
      await updateCarrierDialog.Close()
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Verify that we land on the Job page for that job, defaulting to the Contacts section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
      expect(await jobPage.IsTabActive(JobTabTypes.Contacts)).toBe(true)
      expect(jobPage.page.url()).toBe(contactsTab.URL)

      expect(await jobPage.IsTabActive(JobTabTypes.Contacts)).toBe(true)
      expect(jobPage.page.url()).toBe(contactsTab.URL)
      const tableContacts = contactsTab.DataTable_Contacts
      const tableRemovedContacts = contactsTab.DataTable_Contacts

      // Verify Title for Contacts Table
      await contactsTab.Title_Contacts.VerifyExpectedText()

      // Verify Contacts Table exists
      expect(await tableContacts.IsVisible()).toBe(true)

      // Verify Create Contact button exists
      expect(await contactsTab.Button_CreateContact.IsVisible()).toBe(true)

      // Verify Add Carrier or Update Carrier button exists
      const isAddCarrierVisible = (await contactsTab.Button_AddCarrier.locator.count()) > 0
      if (isAddCarrierVisible) {
        expect(await contactsTab.Button_AddCarrier.IsVisible()).toBe(true)
      } else {
        expect(await contactsTab.Button_UpdateCarrier.IsVisible()).toBe(true)
      }

      // Verify Contacts Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await tableContacts.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await tableContacts.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await tableContacts.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await tableContacts.Button_CloseTable.IsVisible()).toBe(false)

      // if table is not empty then verify Global Search Button
      if (!(await tableContacts.IsEmpty())) {
        await tableContacts.Button_OpenTableSearch.locator.waitFor({ state: 'visible' })
      }

      // Verify Title for Removed Contacts Table
      await contactsTab.Title_RemovedContacts.VerifyExpectedText()

      // Verify Removed Contacts Table exists
      expect(await tableRemovedContacts.IsVisible()).toBe(true)

      // Verify Removed Contacts Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await tableRemovedContacts.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await tableRemovedContacts.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await tableRemovedContacts.Button_CloseTable.IsVisible()).toBe(false)
    })

    test('Contacts Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
      const table = contactsTab.DataTable_Contacts

      // Click the Open Table Settings button on the Contacts Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await contactsTab.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Contacts Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test job page
        const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
        const jobPage = new ClaimsPortalJobPage(global, testJob)
        await jobPage.NavigateDirectlyToJob()

        //Verify that we land on the Job page for that job, defaulting to the Info section
        const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
        const table = contactsTab.DataTable_Contacts

        // Click the Open Table Settings button on the Contacts Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Contacts_Assignee)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Assignee)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Contacts_Name)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Name)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Contacts_Roles)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Roles)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Contacts_Preferred_Contact)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Preferred_Contact)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Contacts_Data_Source)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Data_Source)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Contacts_Description)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Description)).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Contacts_Assignee)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Assignee)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Contacts_Name)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Name)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Contacts_Roles)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Roles)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Contacts_Preferred_Contact)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Preferred_Contact)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Contacts_Data_Source)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Data_Source)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Contacts_Description)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Description)).toBe(true)

        await tableSettingsDialog.Close()
      })

      test('Contacts Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test job page
        const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
        const jobPage = new ClaimsPortalJobPage(global, testJob)
        await jobPage.NavigateDirectlyToJob()

        //Verify that we land on the Job page for that job, defaulting to the Info section
        const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
        const table = contactsTab.DataTable_Contacts

        // Make sure the columns we need are visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Contacts_Data_Source)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Contacts_Name)
        await tableSettingsDialog.Close()

        // Examine Name and DataSource columns
        // Verify initial states are unsorted
        const initialDataSourceSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Data_Source
        )
        const initialNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Name
        )
        expect(initialDataSourceSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialNameSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the DataSource column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Contacts_Data_Source,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify DataSource is sorted Down and Name is still unsorted
        let currentDataSourceSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Data_Source
        )
        let currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Name
        )
        expect(currentDataSourceSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Name column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Contacts_Name,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify DataSource is now unsorted and Name is sorted Up
        currentDataSourceSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Data_Source
        )
        currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Name
        )
        expect(currentDataSourceSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Name column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.Contacts_Name,
          DataTable_Column_SortState.Unsorted
        )
        currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Name
        )
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Verify Roles and Assignee cannot be sorted
        const currentRolesSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Roles
        )
        const currentAssigneeSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Assignee
        )
        expect(currentRolesSortState).toBe(DataTable_Column_SortState.NotSortable)
        expect(currentAssigneeSortState).toBe(DataTable_Column_SortState.NotSortable)
      })

      test('Removed Contacts Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test job page
        const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
        const jobPage = new ClaimsPortalJobPage(global, testJob)
        await jobPage.NavigateDirectlyToJob()

        //Verify that we land on the Job page for that job, defaulting to the Info section
        const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
        const table = contactsTab.DataTable_RemovedContacts

        // Click the Open Table Settings button on the Removed Contacts Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Contacts_Assignee)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Assignee)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Contacts_Name)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Name)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Contacts_Roles)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Roles)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Contacts_Preferred_Contact)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Preferred_Contact)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Contacts_Data_Source)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Data_Source)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Contacts_Description)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Description)).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Contacts_Assignee)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Assignee)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Contacts_Name)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Name)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Contacts_Roles)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Roles)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Contacts_Preferred_Contact)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Preferred_Contact)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Contacts_Data_Source)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Data_Source)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Contacts_Description)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Contacts_Description)).toBe(true)

        await tableSettingsDialog.Close()
      })

      test('Removed Contacts Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test job page
        const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
        const jobPage = new ClaimsPortalJobPage(global, testJob)
        await jobPage.NavigateDirectlyToJob()

        //Verify that we land on the Job page for that job, defaulting to the Info section
        const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
        const table = contactsTab.DataTable_RemovedContacts

        // Make sure the columns we need are visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Contacts_Data_Source)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Contacts_Name)
        await tableSettingsDialog.Close()

        // Examine Name and DataSource columns
        // Verify initial states are unsorted
        const initialDataSourceSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Data_Source
        )
        const initialNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Name
        )
        expect(initialDataSourceSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialNameSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the DataSource column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Contacts_Data_Source,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify DataSource is sorted Down and Name is still unsorted
        let currentDataSourceSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Data_Source
        )
        let currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Name
        )
        expect(currentDataSourceSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Name column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Contacts_Name,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify DataSource is now unsorted and Name is sorted Up
        currentDataSourceSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Data_Source
        )
        currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Name
        )
        expect(currentDataSourceSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Name column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.Contacts_Name,
          DataTable_Column_SortState.Unsorted
        )
        currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Name
        )
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Verify Roles and Assignee cannot be sorted
        const currentRolesSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Roles
        )
        const currentAssigneeSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Contacts_Assignee
        )
        expect(currentRolesSortState).toBe(DataTable_Column_SortState.NotSortable)
        expect(currentAssigneeSortState).toBe(DataTable_Column_SortState.NotSortable)
      })
    })

    test('Contacts Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
      const table = contactsTab.DataTable_Contacts

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // Click the Open Table Search button on the Contacts Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await contactsTab.page.waitForTimeout(1000)
    })

    test('Contacts Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
      const table = contactsTab.DataTable_Contacts

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields
      const nameSearchTerm = testJob.testData.claimsContact
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
      const descriptionSearchTerm = 'No matches expected'
      const tableSearchDialog = await table.SetTableSearch(descriptionSearchTerm, true)

      // Verify table is filtered
      const descriptionFilteredRowCount = await table.VisibleRowCount()
      expect(descriptionFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const descriptionFilterOffRowCount = await table.VisibleRowCount()
      expect(descriptionFilterOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Contacts Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
      const table = contactsTab.DataTable_Contacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        return
      }

      // Click the Add Table Filter button on the Contacts Table
      let tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Contacts_Name)

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await contactsTab.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Contacts_Name)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Contacts Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
      const table = contactsTab.DataTable_Contacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobContactsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const nameFilterTerm = testJob.testData.claimsContact
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        nameFilterTerm,
        DataTable_Columns_Type.Contacts_Name
      )
      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(true)

      // and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(namePinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(false)
      const nameFilteredOffRowCount = await table.VisibleRowCount()
      expect(nameFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X or Clear on the filter causes the filtered table results to clear
      const { tableFilterDialog } = await contactsTab.SetTableFilter_Check_ContactRoles(
        table,
        ContactRoles.FieldTech | ContactRoles.Subcontractor,
        false,
        true
      )

      // Verify table is filtered
      const rolesFilteredRowCount = await table.VisibleRowCount()
      expect(rolesFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_GroupClear.Click()

      // Verify column is NOT filtered
      const rolesFilterOffRowCount = await table.VisibleRowCount()
      expect(rolesFilterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Contacts Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
      const table = contactsTab.DataTable_Contacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobContactsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const nameFilterTerm = testJob.testData.claimsContact
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        nameFilterTerm,
        DataTable_Columns_Type.Contacts_Name
      )
      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedNameFilterTerm = 'There can be no matches'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedNameFilterTerm,
        DataTable_Columns_Type.Contacts_Name,
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

    test('Contacts Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
      const table = contactsTab.DataTable_Contacts

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

    test('Contacts Table - Verify Action Menu: Copy Contact ID', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
      const table = contactsTab.DataTable_Contacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobContactsTableMessage)
        return
      }

      const rowIndex = '0'
      await contactsTab.SelectActionMenuItem(
        table,
        rowIndex,
        Contacts_DataTable_ActionMenuItems.CopyContactId
      )
      const copiedID = await contactsTab.GetClipboardText()

      // Verify clipboard contains contact GUID
      expect(copiedID.startsWith('corn:contacts:contact:')).toBe(true)
    })

    test('Contacts Table - Verify Action Menu: View More Info', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
      const table = contactsTab.DataTable_Contacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobContactsTableMessage)
        return
      }

      const rowIndex = '0'
      const expectedTitle = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Contacts_Name,
        true
      )
      await contactsTab.SelectActionMenuItem(
        table,
        rowIndex,
        Contacts_DataTable_ActionMenuItems.ViewMoreInfo
      )
      const contactInfoDialog = new ClaimsPortalContactInfoDialog(global)

      // Verify the title
      await contactInfoDialog.VerifyTitle(expectedTitle)

      // Verify Contact Info popup - closes with click on "X" button
      await contactInfoDialog.Close()
      await expect(contactInfoDialog.Title.locator).not.toBeAttached()
      await contactsTab.page.waitForTimeout(1000)

      // Verify Contact Info popup - closes with ESC key
      await contactsTab.SelectActionMenuItem(
        table,
        rowIndex,
        Contacts_DataTable_ActionMenuItems.ViewMoreInfo
      )
      await contactInfoDialog.Close(true)
      await expect(contactInfoDialog.Title.locator).not.toBeAttached()
      await contactsTab.page.waitForTimeout(1000)
    })

    test('Contacts Table - Verify Action Menu Visibility: DeleteContact', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
      const table = contactsTab.DataTable_Contacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobContactsTableMessage)
        return
      }

      // Search for a non deletable contact
      const nonDeleteContact = testJob.jobAssignments.coordinator
      await table.SetTableSearch(nonDeleteContact)
      const redactedFilteredRowCount = await table.VisibleRowCount()
      expect(redactedFilteredRowCount).toBe(1)

      // Verify Delete Contact is not available for this contact
      let rowIndex = await table.FetchRowIndexFromRowPosition(1)
      let menuIsVisible = await contactsTab.IsActionMenuItemVisible(
        table,
        rowIndex,
        Contacts_DataTable_ActionMenuItems.DeleteContact
      )
      expect(menuIsVisible).toBe(false)

      // Clear existing search and Search for a ClaimsPortal data source contact
      await table.CancelPinnedTableSearch()
      const claimsContact = testJob.testData.claimsContact
      await table.SetTableSearch(claimsContact)
      const claimsFilteredRowCount = await table.VisibleRowCount()
      expect(claimsFilteredRowCount).toBe(1)

      // Verify Delete Contact IS available for this ClaimsPortal contact
      rowIndex = await table.FetchRowIndexFromRowPosition(1)
      menuIsVisible = await contactsTab.IsActionMenuItemVisible(
        table,
        rowIndex,
        Contacts_DataTable_ActionMenuItems.DeleteContact
      )
      expect(menuIsVisible).toBe(true)
    })

    test('Contacts Table - Verify Action Menu: Active Inactive', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
      const table = contactsTab.DataTable_Contacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobContactsTableMessage)
        return
      }

      const contact = testJob.testData.claimsContact
      await table.SetTableSearch(contact)
      let filteredRowCount = await table.VisibleRowCount()
      expect(filteredRowCount).toBe(1)

      // Verify that the contact is currently active -> Set as Active should be false, Set as Inactive should be true
      let rowIndex = await table.FetchRowIndexFromRowPosition(1)
      let setActiveMenuIsVisible = await contactsTab.IsActionMenuItemVisible(
        table,
        rowIndex,
        Contacts_DataTable_ActionMenuItems.SetAsActive
      )
      expect(setActiveMenuIsVisible).toBe(false)
      let setInactiveMenuIsVisible = await contactsTab.IsActionMenuItemVisible(
        table,
        rowIndex,
        Contacts_DataTable_ActionMenuItems.SetAsInactive
      )
      expect(setInactiveMenuIsVisible).toBe(true)

      // set the contact as inactive
      await contactsTab.SelectActionMenuItem(
        table,
        rowIndex,
        Contacts_DataTable_ActionMenuItems.SetAsInactive
      )

      // Force a page refresh to pick up the change
      await contactsTab.page.reload()

      // Redo the search
      await table.SetTableSearch(contact)
      filteredRowCount = await table.VisibleRowCount()
      expect(filteredRowCount).toBe(1)

      // Verify that the contact is currently inactive -> Set as Inactive should be false, Set as Active should be true
      rowIndex = await table.FetchRowIndexFromRowPosition(1)
      setActiveMenuIsVisible = await contactsTab.IsActionMenuItemVisible(
        table,
        rowIndex,
        Contacts_DataTable_ActionMenuItems.SetAsActive
      )
      expect(setActiveMenuIsVisible).toBe(true)
      setInactiveMenuIsVisible = await contactsTab.IsActionMenuItemVisible(
        table,
        rowIndex,
        Contacts_DataTable_ActionMenuItems.SetAsInactive
      )
      expect(setInactiveMenuIsVisible).toBe(false)

      // set the contact as inactive
      await contactsTab.SelectActionMenuItem(
        table,
        rowIndex,
        Contacts_DataTable_ActionMenuItems.SetAsActive
      )

      // Force a page refresh to pick up the change
      await contactsTab.page.reload()

      // Redo the search
      await table.SetTableSearch(contact)
      filteredRowCount = await table.VisibleRowCount()
      expect(filteredRowCount).toBe(1)

      // Verify that the contact is currently active -> Set as Active should be false, Set as Inactive should be true
      rowIndex = await table.FetchRowIndexFromRowPosition(1)
      setActiveMenuIsVisible = await contactsTab.IsActionMenuItemVisible(
        table,
        rowIndex,
        Contacts_DataTable_ActionMenuItems.SetAsActive
      )
      expect(setActiveMenuIsVisible).toBe(false)
      setInactiveMenuIsVisible = await contactsTab.IsActionMenuItemVisible(
        table,
        rowIndex,
        Contacts_DataTable_ActionMenuItems.SetAsInactive
      )
      expect(setInactiveMenuIsVisible).toBe(true)
    })

    test('Removed Contacts Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
      const table = contactsTab.DataTable_RemovedContacts

      // Click the Open Table Settings button on the Removed Contacts Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await contactsTab.page.waitForTimeout(1000)
    })

    test('Removed Contacts Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
      const table = contactsTab.DataTable_RemovedContacts

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

    test('Removed Contacts Table - Verify Action Menu: Copy Contact ID', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
      const table = contactsTab.DataTable_RemovedContacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobRemovedContactsTableMessage)
        return
      }

      const rowIndex = '0'
      await contactsTab.SelectActionMenuItem(
        table,
        rowIndex,
        Contacts_DataTable_ActionMenuItems.CopyContactId
      )
      const copiedID = await contactsTab.GetClipboardText()

      // Verify clipboard contains contact corn
      expect(copiedID.startsWith('corn:contacts:contact:')).toBe(true)
    })

    test('Removed Contacts Table - Verify Action Menu: View More Info', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab
      const table = contactsTab.DataTable_RemovedContacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobRemovedContactsTableMessage)
        return
      }

      const rowIndex = '0'
      const expectedTitle = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Contacts_Name,
        true
      )
      await contactsTab.SelectActionMenuItem(
        table,
        rowIndex,
        Contacts_DataTable_ActionMenuItems.ViewMoreInfo
      )
      const contactInfoDialog = new ClaimsPortalContactInfoDialog(global)

      // Verify the title
      await contactInfoDialog.VerifyTitle(expectedTitle)

      // Make sure the Removed badge is displayed
      expect(await contactInfoDialog.HasRemovedBadge()).toBe(true)

      // Verify Contact Info popup - closes with click on "X" button
      await contactInfoDialog.Close()
      await expect(contactInfoDialog.Title.locator).not.toBeAttached()
      await contactsTab.page.waitForTimeout(1000)

      // Verify Contact Info popup - closes with ESC key
      await contactsTab.SelectActionMenuItem(
        table,
        rowIndex,
        Contacts_DataTable_ActionMenuItems.ViewMoreInfo
      )
      await contactInfoDialog.Close(true)
      await expect(contactInfoDialog.Title.locator).not.toBeAttached()
      await contactsTab.page.waitForTimeout(1000)
    })

    test('Create Contact - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab

      let createContactDrawer = await contactsTab.OpenCreateContactDrawer()
      // Verify drawer heading is "Create Contact"
      await createContactDrawer.VerifyTitle()
      // Verify drawer closes with click on "X" button
      await createContactDrawer.Close()
      await expect(createContactDrawer.Title.locator).not.toBeAttached()
      await contactsTab.page.waitForTimeout(1000)

      createContactDrawer = await contactsTab.OpenCreateContactDrawer()
      // Verify drawer closes with ESC key
      await createContactDrawer.Close(true)
      await expect(createContactDrawer.Title.locator).not.toBeAttached()
      await contactsTab.page.waitForTimeout(1000)

      createContactDrawer = await contactsTab.OpenCreateContactDrawer()
      // Verify drawer closes if click on Close
      await createContactDrawer.Button_Close.Click()
      await expect(createContactDrawer.Title.locator).not.toBeAttached()
      await contactsTab.page.waitForTimeout(1000)
    })

    test('Create Contact - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab

      const createContactDrawer = await contactsTab.OpenCreateContactDrawer()

      // Click the Submit button
      await createContactDrawer.Button_Submit.Click()
      await contactsTab.page.waitForTimeout(1000)

      // Verify validation messages for the various fields
      expect(await createContactDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await createContactDrawer.Button_Close.Click()
    })

    test('Update Carrier - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section, then navigate to the contacts tab
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab

      // Open the Update Carrier dialog
      let updateCarrierDialog = await contactsTab.OpenUpdateCarrier()

      // Verify drawer heading is "Update Carrier"
      await updateCarrierDialog.VerifyTitle()

      // Verify drawer closes with click on "X" button
      await updateCarrierDialog.Close()
      await expect(updateCarrierDialog.Title.locator).not.toBeAttached()
      await contactsTab.page.waitForTimeout(1000)

      updateCarrierDialog = await contactsTab.OpenUpdateCarrier()
      // Verify drawer closes with ESC key
      await updateCarrierDialog.Close(true)
      await expect(updateCarrierDialog.Title.locator).not.toBeAttached()
      await contactsTab.page.waitForTimeout(1000)

      updateCarrierDialog = await contactsTab.OpenUpdateCarrier()
      // Verify drawer closes if click on Cancel
      await updateCarrierDialog.Button_Cancel.Click()
      await expect(updateCarrierDialog.Title.locator).not.toBeAttached()
      await contactsTab.page.waitForTimeout(1000)
    })

    test('Update Carrier - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section, then navigate to the contacts tab
      const contactsTab = (await jobPage.SelectJobTab(JobTabTypes.Contacts)) as ClaimsPortalJobContactsTab

      // Open the Update Carrier dialog
      const updateCarrierDialog = await contactsTab.OpenUpdateCarrier()

      // Click the Submit button
      await updateCarrierDialog.Button_Submit.Click()
      await contactsTab.page.waitForTimeout(1000)

      // Verify validation messages for the selection field
      expect(await updateCarrierDialog.Validate()).toBe(true)

      // Click Cancel to close the dialog
      await updateCarrierDialog.Button_Cancel.Click()
    })
  }
)
