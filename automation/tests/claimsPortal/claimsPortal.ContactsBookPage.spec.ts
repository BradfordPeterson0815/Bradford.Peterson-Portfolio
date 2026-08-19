import { expect } from '@playwright/test'
import test from '../../library/shared/testHooks.js'
import { ClaimsPortalContactsBookPage } from '../../library/claimsPortal/pages/claimsPortalContactsBookPage.js'
import { FetchCannedClaim, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import {
  DefaultEnvironment,
  ContactBookTypes,
  ContactRoles,
  ContactsBook_DataTable_ActionMenuItems,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  Filter_Radio_DataSource,
  AbortErrors,
  CannedClaimTypes,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { ClaimsPortalGlobalBooksPage } from '../../library/claimsPortal/pages/claimsPortalGlobalBooksPage.js'
import { ClaimsPortalContactInfoDialog } from '../../library/claimsPortal/dialogs/claimsPortalContactInfoDialog.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import { Tags } from '../../library/shared/constants.js'

const environment = DefaultEnvironment

test.describe(
  'Contacts Book Page',
  {
    tag: [Tags.ClaimsPortal, Tags.Admin, Tags.ContactsBook],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P2] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Carrier Contact Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Carrier)
      await contactsBookPage.CustomLoad()
      const contactsTable = contactsBookPage.DataTable_Contacts
      const removedContactsTable = contactsBookPage.DataTable_RemovedContacts

      // Verify Create Contact button exists
      expect(await contactsBookPage.Button_CreateContact.IsVisible()).toBe(true)

      // Verify Contacts Table exists
      expect(await contactsTable.IsVisible()).toBe(true)

      // Verify Contacts Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await contactsTable.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await contactsTable.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await contactsTable.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await contactsTable.Button_CloseTable.IsVisible()).toBe(false)

      // if table is empty
      if (await contactsTable.IsEmpty()) {
        expect(await contactsTable.Button_OpenTableSearch.IsVisible()).toBe(false)
      } else {
        // Verify global filter works
        const initialRowCount = await contactsTable.VisibleRowCount()

        // Verify setting search input causes the table results to filter across all text fields
        await contactsTable.SetTableSearch('NoMatchExpected')

        const filteredRowCount = await contactsTable.VisibleRowCount()
        expect(filteredRowCount).toBe(0)

        //  and clicking X button on it removes it and clears the search
        await contactsTable.CancelPinnedTableSearch()

        // Verify table is NOT filtered anymore
        expect(await contactsTable.IsGlobalSearchActive()).toBe(false)
        const filterCanceled = await contactsTable.VisibleRowCount()
        expect(filterCanceled).toBe(initialRowCount)
      }

      // Verify Removed Contacts Table exists
      expect(await removedContactsTable.IsVisible()).toBe(true)

      // Verify Removed Contacts Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await removedContactsTable.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await removedContactsTable.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await removedContactsTable.Button_CloseTable.IsVisible()).toBe(false)
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Carrier Contact Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Carrier)
      await contactsBookPage.CustomLoad()
      const contactsTable = contactsBookPage.DataTable_Contacts
      const removedContactsTable = contactsBookPage.DataTable_RemovedContacts

      // Verify Create Contact button exists
      expect(await contactsBookPage.Button_CreateContact.IsVisible()).toBe(true)

      // Verify Contacts Table exists
      expect(await contactsTable.IsVisible()).toBe(true)

      // Verify Contacts Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await contactsTable.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await contactsTable.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await contactsTable.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await contactsTable.Button_CloseTable.IsVisible()).toBe(false)

      // if table is not empty then verify Global Search Button
      if (!(await contactsTable.IsEmpty())) {
        await contactsTable.Button_OpenTableSearch.locator.waitFor({ state: 'visible' })
      }

      // Verify Removed Contacts Table exists
      expect(await removedContactsTable.IsVisible()).toBe(true)

      // Verify Removed Contacts Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await removedContactsTable.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await removedContactsTable.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await removedContactsTable.Button_CloseTable.IsVisible()).toBe(false)

      // Use the Back link to go back to the Global Books page
      await contactsBookPage.Link_GlobalBooks.Click()

      // Verify we are back onto the Global Books page
      expect(await globalBooksPage.DataTable_GlobalBooks.IsVisible()).toBe(true)
    })

    test('Contacts Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Carrier Contact Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Carrier)
      await contactsBookPage.CustomLoad()
      const table = contactsBookPage.DataTable_Contacts

      // Click the Open Table Settings button on the Contacts Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await contactsBookPage.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Contacts Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
        const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
        await globalBooksPage.NavigateToPage()

        // Verify Carrier Contact Book can be opened
        await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)
        const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Carrier)
        await contactsBookPage.CustomLoad()
        const table = contactsBookPage.DataTable_Contacts

        // Click the Open Table Settings button on the Contacts Table
        const tableSettingsDialog = await table.OpenTableSettings()
        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.ContactsBook_Name)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Name)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.ContactsBook_Roles)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Roles)).toBe(false)
        await tableSettingsDialog.UncheckColumn(
          DataTable_Columns_Type.ContactsBook_Preferred_Contact
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Preferred_Contact)
        ).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.ContactsBook_Data_Source)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Data_Source)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.ContactsBook_Description)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Description)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.ContactsBook_License)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_License)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.ContactsBook_Picture)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Picture)).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_Name)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Name)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_Roles)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Roles)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_Preferred_Contact)
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Preferred_Contact)
        ).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_Data_Source)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Data_Source)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_Description)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Description)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_License)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_License)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_Picture)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Picture)).toBe(true)

        await tableSettingsDialog.Close()
      })

      test('Contacts Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
        const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
        await globalBooksPage.NavigateToPage()

        // Verify Carrier Contacts Book can be opened
        await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)
        const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Carrier)
        await contactsBookPage.CustomLoad()
        const table = contactsBookPage.DataTable_Contacts

        // Make sure the columns we need are visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_Data_Source)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_Name)
        await tableSettingsDialog.Close()

        // Examine Name and DataSource columns
        // Verify initial states are unsorted
        const initialDataSourceSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.ContactsBook_Data_Source
        )
        const initialNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.ContactsBook_Name
        )
        expect(initialDataSourceSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialNameSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the DataSource column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.ContactsBook_Data_Source,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify DataSource is sorted Down and Name is still unsorted
        let currentDataSourceSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.ContactsBook_Data_Source
        )
        let currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.ContactsBook_Name
        )
        expect(currentDataSourceSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Name column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.ContactsBook_Name,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify DataSource is now unsorted and Name is sorted Up
        currentDataSourceSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.ContactsBook_Data_Source
        )
        currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.ContactsBook_Name
        )
        expect(currentDataSourceSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Name column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.ContactsBook_Name,
          DataTable_Column_SortState.Unsorted
        )
        currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.ContactsBook_Name
        )
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Verify Roles cannot be sorted
        const currentRolesSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.ContactsBook_Roles
        )
        expect(currentRolesSortState).toBe(DataTable_Column_SortState.NotSortable)
      })

      test('Removed Contacts Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
        const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
        await globalBooksPage.NavigateToPage()

        // Verify Carrier Contact Book can be opened
        await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)
        const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Carrier)
        await contactsBookPage.CustomLoad()
        const table = contactsBookPage.DataTable_RemovedContacts

        // Click the Open Table Settings button on the Removed Contacts Table
        const tableSettingsDialog = await table.OpenTableSettings()
        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.ContactsBook_Name)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Name)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.ContactsBook_Roles)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Roles)).toBe(false)
        await tableSettingsDialog.UncheckColumn(
          DataTable_Columns_Type.ContactsBook_Preferred_Contact
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Preferred_Contact)
        ).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.ContactsBook_Data_Source)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Data_Source)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.ContactsBook_Description)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Description)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.ContactsBook_License)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_License)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.ContactsBook_Picture)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Picture)).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_Name)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Name)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_Roles)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Roles)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_Preferred_Contact)
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Preferred_Contact)
        ).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_Data_Source)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Data_Source)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_Description)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Description)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_License)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_License)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_Picture)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.ContactsBook_Picture)).toBe(true)

        await tableSettingsDialog.Close()
      })

      test('Removed Contacts Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
        const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
        await globalBooksPage.NavigateToPage()

        // Verify Carrier Contacts Book can be opened
        await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)
        const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Carrier)
        await contactsBookPage.CustomLoad()
        const table = contactsBookPage.DataTable_RemovedContacts

        // Make sure the columns we need are visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_Data_Source)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.ContactsBook_Name)
        await tableSettingsDialog.Close()

        // Examine Name and DataSource columns
        // Verify initial states are unsorted
        const initialDataSourceSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.ContactsBook_Data_Source
        )
        const initialNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.ContactsBook_Name
        )
        expect(initialDataSourceSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialNameSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the DataSource column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.ContactsBook_Data_Source,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify DataSource is sorted Down and Name is still unsorted
        let currentDataSourceSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.ContactsBook_Data_Source
        )
        let currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.ContactsBook_Name
        )
        expect(currentDataSourceSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Name column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.ContactsBook_Name,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify DataSource is now unsorted and Name is sorted Up
        currentDataSourceSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.ContactsBook_Data_Source
        )
        currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.ContactsBook_Name
        )
        expect(currentDataSourceSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Name column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.ContactsBook_Name,
          DataTable_Column_SortState.Unsorted
        )
        currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.ContactsBook_Name
        )
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Verify Roles cannot be sorted
        const currentRolesSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.ContactsBook_Roles
        )
        expect(currentRolesSortState).toBe(DataTable_Column_SortState.NotSortable)
      })
    })

    test('Contacts Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Carrier Contact Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Carrier)
      await contactsBookPage.CustomLoad()
      const table = contactsBookPage.DataTable_Contacts

      //If the table is empty, we cannot perform this test
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
      await contactsBookPage.page.waitForTimeout(1000)
    })

    test('Contacts Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Carrier Contact Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Carrier)
      await contactsBookPage.CustomLoad()
      const table = contactsBookPage.DataTable_Contacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields
      const nameSearchTerm = testClaim.testData.carrierBookContact
      await table.SetTableSearch(nameSearchTerm)

      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBe(1)

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      //  and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      const nameFilteredOffRowCount = await table.VisibleRowCount()
      expect(nameFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      const descriptionSearchTerm = 'No match is expected'
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

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Carrier Contact Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Carrier)
      await contactsBookPage.CustomLoad()
      const table = contactsBookPage.DataTable_Contacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyContactsTableMessage)
        return
      }

      // Click the Add Table Filter button on the Contacts Table
      let tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.ContactsBook_Name)

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await contactsBookPage.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.ContactsBook_Name)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Contacts Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Carrier Contact Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.ClaimsPortal)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.ClaimsPortal)
      await contactsBookPage.CustomLoad()
      const table = contactsBookPage.DataTable_Contacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyContactsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const nameFilterTerm = testClaim.testData.claimsBookContact
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        nameFilterTerm,
        DataTable_Columns_Type.ContactsBook_Name
      )
      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBe(2)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(namePinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(false)
      const nameFilteredOffRowCount = await table.VisibleRowCount()
      expect(nameFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X or Clear on the filter causes the filtered table results to clear
      const { tableFilterDialog } = await contactsBookPage.SetTableFilter_Check_ContactRoles(
        contactsBookPage.DataTable_Contacts,
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
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Carrier Contact Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.ClaimsPortal)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.ClaimsPortal)
      await contactsBookPage.CustomLoad()
      const table = contactsBookPage.DataTable_Contacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyContactsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const nameFilterTerm = testClaim.testData.claimsBookContact
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        nameFilterTerm,
        DataTable_Columns_Type.ContactsBook_Name
      )
      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBe(2)

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedNameFilterTerm = 'There can be no matches'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedNameFilterTerm,
        DataTable_Columns_Type.ContactsBook_Name,
        true
      )

      // Verify setting this filter creates a pinned filter search
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

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Carrier Contacts Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Carrier)
      await contactsBookPage.CustomLoad()
      const table = contactsBookPage.DataTable_Contacts

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

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Carrier Contacts Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Carrier)
      await contactsBookPage.CustomLoad()
      const table = contactsBookPage.DataTable_Contacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyContactsTableMessage)
        return
      }

      const rowIndex = '0'
      await contactsBookPage.SelectActionMenuItem(
        contactsBookPage.DataTable_Contacts,
        rowIndex,
        ContactsBook_DataTable_ActionMenuItems.CopyContactId
      )
      const copiedID = await contactsBookPage.GetClipboardText()

      // Verify clipboard contains a contact corn
      expect(copiedID.startsWith('corn:contacts:contact:')).toBe(true)
    })

    test('Contacts Table - Verify Action Menu: View More Info', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Carrier Contacts Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Carrier)
      await contactsBookPage.CustomLoad()
      const table = contactsBookPage.DataTable_Contacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyContactsTableMessage)
        return
      }

      const rowIndex = '0'
      const expectedTitle = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.ContactsBook_Name,
        true
      )
      await contactsBookPage.SelectActionMenuItem(
        contactsBookPage.DataTable_Contacts,
        rowIndex,
        ContactsBook_DataTable_ActionMenuItems.ViewMoreInfo
      )
      const contactInfoDialog = new ClaimsPortalContactInfoDialog(global)

      // Verify the title
      await contactInfoDialog.VerifyTitle(expectedTitle)

      // Verify Contact Info popup - closes with click on "X" button
      await contactInfoDialog.Close()
      await expect(contactInfoDialog.Title.locator).not.toBeAttached()
      await contactsBookPage.page.waitForTimeout(1000)

      // Verify Contact Info popup - closes with ESC key
      await contactsBookPage.SelectActionMenuItem(
        contactsBookPage.DataTable_Contacts,
        rowIndex,
        ContactsBook_DataTable_ActionMenuItems.ViewMoreInfo
      )
      await contactInfoDialog.Close(true)
      await expect(contactInfoDialog.Title.locator).not.toBeAttached()
      await contactsBookPage.page.waitForTimeout(1000)
    })

    test('Contacts Table - Verify Delete Contact menus hidden for Non-ClaimsPortal contacts', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Subcontractor Contacts Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Subcontractor)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Subcontractor)
      await contactsBookPage.CustomLoad()
      const table = contactsBookPage.DataTable_Contacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyContactsTableMessage)
        return
      }

      await contactsBookPage.SetTableFilter_Radio_DataSource(
        contactsBookPage.DataTable_Contacts,
        Filter_Radio_DataSource.Auth0
      )

      // Verify table is filtered
      const nonClaimsPortalFilteredRowCount = await table.VisibleRowCount()
      expect(nonClaimsPortalFilteredRowCount).toBeGreaterThan(0)

      // Verify none of the following action items are available
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      const deleteContactVisibility = await contactsBookPage.IsActionMenuItemVisible(
        contactsBookPage.DataTable_Contacts,
        rowIndex,
        ContactsBook_DataTable_ActionMenuItems.DeleteContact
      )
      expect(deleteContactVisibility).toBe(false)
    })

    test('Removed Contacts Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Carrier Contact Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Carrier)
      await contactsBookPage.CustomLoad()
      const table = contactsBookPage.DataTable_Contacts

      // Click the Open Table Settings button on the Removed Contacts Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await contactsBookPage.page.waitForTimeout(1000)
    })

    test('Removed Contacts Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Carrier Removed Contacts Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Carrier)
      await contactsBookPage.CustomLoad()
      const table = contactsBookPage.DataTable_RemovedContacts

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

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Carrier Contacts Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Subcontractor)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Subcontractor)
      await contactsBookPage.CustomLoad()
      const table = contactsBookPage.DataTable_RemovedContacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRemovedContactsTableMessage)
        return
      }

      const rowIndex = '0'
      await contactsBookPage.SelectActionMenuItem(
        contactsBookPage.DataTable_RemovedContacts,
        rowIndex,
        ContactsBook_DataTable_ActionMenuItems.CopyContactId
      )
      const copiedID = await contactsBookPage.GetClipboardText()

      // Verify clipboard contains a contact corn
      expect(copiedID.startsWith('corn:contacts:contact:')).toBe(true)
    })

    test('Removed Contacts Table - Verify Action Menu: View More Info', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Carrier Contacts Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Subcontractor)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Subcontractor)
      await contactsBookPage.CustomLoad()
      const table = contactsBookPage.DataTable_RemovedContacts

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRemovedContactsTableMessage)
        return
      }

      const rowIndex = '0'
      const expectedTitle = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.ContactsBook_Name
      )
      await contactsBookPage.SelectActionMenuItem(
        contactsBookPage.DataTable_RemovedContacts,
        rowIndex,
        ContactsBook_DataTable_ActionMenuItems.ViewMoreInfo
      )
      const contactInfoDialog = new ClaimsPortalContactInfoDialog(global)

      // Verify the Table Search popup - Heading is "Global Search"
      await contactInfoDialog.VerifyTitle(expectedTitle)

      // Verify Contact Info popup - closes with click on "X" button
      await contactInfoDialog.Close()
      await expect(contactInfoDialog.Title.locator).not.toBeAttached()
      await contactsBookPage.page.waitForTimeout(1000)

      // Verify Contact Info popup - closes with ESC key
      await contactsBookPage.SelectActionMenuItem(
        contactsBookPage.DataTable_RemovedContacts,
        rowIndex,
        ContactsBook_DataTable_ActionMenuItems.ViewMoreInfo
      )
      await contactInfoDialog.Close(true)
      await expect(contactInfoDialog.Title.locator).not.toBeAttached()
      await contactsBookPage.page.waitForTimeout(1000)
    })

    test('Verfiy Create Contact is unavailable for some books', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Make sure the Create Contact button is disabled for the ClaimsPortal Contact Book page
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.ClaimsPortal)
      let contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.ClaimsPortal)
      await contactsBookPage.CustomLoad()
      expect(await contactsBookPage.Button_CreateContact.IsEnabled()).toBe(false)

      // Use the Back link to go back to the Global Books page
      await contactsBookPage.Link_GlobalBooks.Click()
      expect(await globalBooksPage.DataTable_GlobalBooks.IsVisible()).toBe(true)

      // Make sure the Create Contact button is disabled for the Field Agent Contact Book page
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.FieldAgent)
      contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.FieldAgent)
      await contactsBookPage.CustomLoad()
      expect(await contactsBookPage.Button_CreateContact.IsEnabled()).toBe(false)

      // Use the Back link to go back to the Global Books page
      await contactsBookPage.Link_GlobalBooks.Click()
      expect(await globalBooksPage.DataTable_GlobalBooks.IsVisible()).toBe(true)

      // Make sure the Create Contact button is disabled for the Field Tech Contact Book page
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.FieldTech)
      contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.FieldTech)
      await contactsBookPage.CustomLoad()
      expect(await contactsBookPage.Button_CreateContact.IsEnabled()).toBe(false)

      // Use the Back link to go back to the Global Books page
      await contactsBookPage.Link_GlobalBooks.Click()
      expect(await globalBooksPage.DataTable_GlobalBooks.IsVisible()).toBe(true)

      // Make sure the Create Contact button is disabled for the Project Manager Contact Book page
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.ProjectManager)
      contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.ProjectManager)
      await contactsBookPage.CustomLoad()
      expect(await contactsBookPage.Button_CreateContact.IsEnabled()).toBe(false)

      // Use the Back link to go back to the Global Books page
      await contactsBookPage.Link_GlobalBooks.Click()
      expect(await globalBooksPage.DataTable_GlobalBooks.IsVisible()).toBe(true)

      // Make sure the Create Contact button is disabled for the Reviwer Contact Book page
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Reviewer)
      contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Reviewer)
      await contactsBookPage.CustomLoad()
      expect(await contactsBookPage.Button_CreateContact.IsEnabled()).toBe(false)
    })

    test('Create Contact - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Carrier Contacts Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Carrier)
      await contactsBookPage.CustomLoad()

      let createContactDrawer = await contactsBookPage.OpenCreateContactDrawer()
      // Verify drawer heading is "Create Contact"
      await createContactDrawer.VerifyTitle()
      // Verify drawer closes with click on "X" button
      await createContactDrawer.Close()
      await expect(createContactDrawer.Title.locator).not.toBeAttached()
      await contactsBookPage.page.waitForTimeout(1000)

      createContactDrawer = await contactsBookPage.OpenCreateContactDrawer()
      // Verify drawer closes if click on Close
      await createContactDrawer.Button_Close.Click()
      await expect(createContactDrawer.Title.locator).not.toBeAttached()
      await contactsBookPage.page.waitForTimeout(1000)
    })

    test('Create Contact - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()

      // Verify Carrier Contacts Book can be opened
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)
      const contactsBookPage = new ClaimsPortalContactsBookPage(global, ContactBookTypes.Carrier)
      await contactsBookPage.CustomLoad()

      const createContactDrawer = await contactsBookPage.OpenCreateContactDrawer()

      // Click the Submit button
      await createContactDrawer.Button_Submit.Click()
      await contactsBookPage.page.waitForTimeout(1000)

      // Verify validation messages for the various fields
      expect(await createContactDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await createContactDrawer.Button_Close.Click()
    })
  }
)
