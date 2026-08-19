import { expect } from '@playwright/test'
import test from '../../library/shared/testHooks.js'
import { ClaimsPortalGlobalBooksPage } from '../../library/claimsPortal/pages/claimsPortalGlobalBooksPage.js'
import { Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import {
  DefaultEnvironment,
  ContactBookTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  GlobalBooks_DataTable_ActionMenuItems,
  AbortErrors,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import { Tags } from '../../library/shared/constants.js'

const environment = DefaultEnvironment

test.describe(
  'Global Books Page',
  {
    tag: [Tags.ClaimsPortal, Tags.Admin, Tags.GlobalBooks],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P2] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()
      const table = globalBooksPage.DataTable_GlobalBooks

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Global Books Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

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

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()
      const table = globalBooksPage.DataTable_GlobalBooks

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Global Books Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // if table is not empty then verify Global Search Button
      if (await table.IsEmpty()) {
        await table.Button_OpenTableSearch.locator.waitFor({ state: 'visible' })
      }
    })

    test('Global Books Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()
      const table = globalBooksPage.DataTable_GlobalBooks

      // Click the Open Table Settings button on the Cpntacts Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await globalBooksPage.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Global Books Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
        const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
        await globalBooksPage.NavigateToPage()
        const table = globalBooksPage.DataTable_GlobalBooks

        // Click the Open Table Settings button on the Global Contacts Table
        const tableSettingsDialog = await table.OpenTableSettings()
        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.GlobalContacts_Name)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.GlobalContacts_Name)).toBe(false)
        await tableSettingsDialog.UncheckColumn(
          DataTable_Columns_Type.GlobalContacts_Contacts_Number
        )
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.GlobalContacts_Contacts_Number)
        ).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.GlobalContacts_Name)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.GlobalContacts_Name)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.GlobalContacts_Contacts_Number)
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.GlobalContacts_Contacts_Number)
        ).toBe(true)
        await tableSettingsDialog.Close()
      })

      test('Global Books Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
        const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
        await globalBooksPage.NavigateToPage()
        const table = globalBooksPage.DataTable_GlobalBooks

        // Make sure the columns we need are visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.GlobalContacts_Name)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.GlobalContacts_Contacts_Number)
        await tableSettingsDialog.Close()

        // Examine Contacts and Name columns
        // Verify initial states are unsorted
        const initialNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.GlobalContacts_Name
        )
        const initialContactsSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.GlobalContacts_Contacts_Number
        )
        expect(initialNameSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialContactsSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Name column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.GlobalContacts_Name,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify Name is sorted Down and Contacts is still unsorted
        let currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.GlobalContacts_Name
        )
        let currentContactsSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.GlobalContacts_Contacts_Number
        )
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentContactsSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Contacts column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.GlobalContacts_Contacts_Number,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify Name is now unsorted and Contacts is sorted Up
        currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.GlobalContacts_Name
        )
        currentContactsSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.GlobalContacts_Contacts_Number
        )
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentContactsSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Contacts column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.GlobalContacts_Contacts_Number,
          DataTable_Column_SortState.Unsorted
        )
        currentContactsSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.GlobalContacts_Contacts_Number
        )
        expect(currentContactsSortState).toBe(DataTable_Column_SortState.Unsorted)
      })
    })

    test('Global Books Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()
      const table = globalBooksPage.DataTable_GlobalBooks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // Click the Open Table Search button on the Global Books Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await globalBooksPage.page.waitForTimeout(1000)
    })

    test('Global Books Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()
      const table = globalBooksPage.DataTable_GlobalBooks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields (Name/Contact#)
      const nameSearchTerm = 'Agent'
      await table.SetTableSearch(nameSearchTerm)

      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBe(2)

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      //  and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      const nameFilteredOffRowCount = await table.VisibleRowCount()
      expect(nameFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      const contactNumberSearchTerm = '1'
      const tableSearchDialog = await table.SetTableSearch(contactNumberSearchTerm, true)

      // Verify table is filtered
      const contactNumberFilteredRowCount = await table.VisibleRowCount()
      expect(contactNumberFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      const contactNumberFilterOffRowCount = await table.VisibleRowCount()
      expect(contactNumberFilterOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Global Books Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()
      const table = globalBooksPage.DataTable_GlobalBooks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyGlobalBooksTableMessage)
        return
      }

      // Click the Add Table Filter button on the Global Books Table
      let tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.GlobalContacts_Name)

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await globalBooksPage.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.GlobalContacts_Name)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Global Books Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()
      const table = globalBooksPage.DataTable_GlobalBooks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyGlobalBooksTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const nameFilterTerm = 'Agent'
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        nameFilterTerm,
        DataTable_Columns_Type.GlobalContacts_Name
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

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const { tableFilterDialog } = await table.SetTableFilter_Range(
        '0',
        '10',
        DataTable_Columns_Type.GlobalContacts_Contacts_Number,
        false,
        true
      )

      // Verify table is filtered
      const contactNumberFilteredRowCount = await table.VisibleRowCount()
      expect(contactNumberFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const contactNumberFilterOffRowCount = await table.VisibleRowCount()
      expect(contactNumberFilterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Global Books Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()
      const table = globalBooksPage.DataTable_GlobalBooks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyGlobalBooksTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const nameFilterTerm = 'Agent'
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        nameFilterTerm,
        DataTable_Columns_Type.GlobalContacts_Name
      )
      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBe(2)

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedNameFilterTerm = 'There can be no matches'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedNameFilterTerm,
        DataTable_Columns_Type.GlobalContacts_Name,
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

    test('Global Books Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()
      const table = globalBooksPage.DataTable_GlobalBooks

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

    test('Global Books Table - Verify Action Menu: Copy Book ID', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()
      const table = globalBooksPage.DataTable_GlobalBooks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyGlobalBooksTableMessage)
        return
      }

      const nameFilterTerm = 'Carrier'
      await table.SetTableFilter_Text(nameFilterTerm, DataTable_Columns_Type.GlobalContacts_Name)

      const rowIndex = '0'
      await globalBooksPage.SelectActionMenuItem(
        rowIndex,
        GlobalBooks_DataTable_ActionMenuItems.CopyBookId
      )
      const copiedID = await globalBooksPage.GetClipboardText()

      // Verify clipboard matches the corn for the Carrier contact book
      expect(copiedID == 'corn:contacts:book:carrier').toBe(true)
    })

    test('Global Books Table - Verify Action Menu: Open Book', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()
      const table = globalBooksPage.DataTable_GlobalBooks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyGlobalBooksTableMessage)
        return
      }

      const nameFilterTerm = 'Carrier'
      await table.SetTableFilter_Text(nameFilterTerm, DataTable_Columns_Type.GlobalContacts_Name)

      const rowIndex = '0'
      await globalBooksPage.SelectActionMenuItem(
        rowIndex,
        GlobalBooks_DataTable_ActionMenuItems.OpenBook
      )

      expect(globalBooksPage.page.url().endsWith('contacts/book/corn:contacts:book:carrier')).toBe(
        true
      )
    })

    test('Global Books Table - Navigate to Contact Book', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()
      const table = globalBooksPage.DataTable_GlobalBooks

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyGlobalBooksTableMessage)
        return
      }

      const nameFilterTerm = 'Carrier'
      await table.SetTableFilter_Text(nameFilterTerm, DataTable_Columns_Type.GlobalContacts_Name)

      // Click the carrier link
      await globalBooksPage.ClickContactBookByName(ContactBookTypes.Carrier)

      // Verify we navigated to the Carrier Contact page
      expect(globalBooksPage.page.url().endsWith('contacts/book/corn:contacts:book:carrier')).toBe(
        true
      )
    })
  }
)
