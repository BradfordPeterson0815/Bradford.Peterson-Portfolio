import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedClaimTypes,
  ClaimTabTypes,
  Contacts_DataTable_ActionMenuItems,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
  PortalAccessStatusSelectionOptions,
  PortalAccess_DataTable_ActionMenuItems,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedClaim, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalContactInfoDialog } from '../../library/claimsPortal/dialogs/claimsPortalContactInfoDialog.js'
import { ClaimsPortalAddPersonToPortalDrawer } from '../../library/claimsPortal/drawers/claimsPortalAddPersonToPortalDrawer.js'
import { ClaimsPortalClaimPage } from '../../library/claimsPortal/pages/claimsPortalClaimPage.js'
import { ClaimsPortalClaimPortalAccessTab } from '../../library/claimsPortal/tabs/claimsPortalClaimPortalAccessTab.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import test from '../../library/shared/testHooks.js'
import { ClaimsPortalClaimContactsTab } from '../../library/claimsPortal/tabs/claimsPortalClaimContactsTab.js'
import { Tags } from '../../library/shared/constants.js'
import { ClaimsPortalClaimsPage } from '../../library/claimsPortal/pages/claimsPortalClaimsPage.js'

const environment = DefaultEnvironment
test.describe(
  'Claim Page: Portal Access Tab',
  {
    tag: [Tags.ClaimsPortal, Tags.Claim, Tags.PortalAccess],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // find a random claim and go to it
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage } = await claimsPage.OpenRandomClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Portal Access tab
      const portalAccessTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.PortalAccess
      )) as ClaimsPortalClaimPortalAccessTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.PortalAccess)).toBe(true)
      expect(claimPage.page.url()).toBe(portalAccessTab.URL)
      const table = portalAccessTab.DataTable_PortalAccess

      // Verify Title
      await portalAccessTab.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Check table settings dialog and columns
      await portalAccessTab.VerifyTableSettingColumns()

      // Verify Add Person to Portal button exists
      expect(await portalAccessTab.Button_AddPersonToPortal.IsVisible()).toBe(true)

      // Verify Portal Access Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

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

      // Verify Add Person To Portal drawer
      const addPersonToPortalDrawer = await portalAccessTab.OpenAddPersonToPortalDrawer()

      // Verify drawer heading is "Add Person To Portal"
      await addPersonToPortalDrawer.VerifyTitle()
      await expect(addPersonToPortalDrawer.claimContact).toBeAttached()
      await expect(addPersonToPortalDrawer.CheckBox_AddNote.locator).toBeAttached()
      expect(await addPersonToPortalDrawer.CheckBox_AddNote.locator.locator('..').isChecked()).toBe(
        false
      )

      // check the Add Note toggle to show the Note UI portion
      await addPersonToPortalDrawer.CheckBox_AddNote.locator.locator('..').setChecked(true)
      await addPersonToPortalDrawer.Close()
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Portal Access tab
      const portalAccessTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.PortalAccess
      )) as ClaimsPortalClaimPortalAccessTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.PortalAccess)).toBe(true)
      expect(claimPage.page.url()).toBe(portalAccessTab.URL)
      const table = portalAccessTab.DataTable_PortalAccess

      // Verify Title
      await portalAccessTab.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Add Person to Portal button exists
      expect(await portalAccessTab.Button_AddPersonToPortal.IsVisible()).toBe(true)

      // Verify Portal Access Table layout...
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

    test('Portal Access Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Portal Access tab
      const portalAccessTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.PortalAccess
      )) as ClaimsPortalClaimPortalAccessTab
      const table = portalAccessTab.DataTable_PortalAccess

      // Click the Open Table Settings button on the Portal Access Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await portalAccessTab.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Portal Access Table - Global Search: Verify search', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new ClaimsPortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        // Verify that the user we need is active
        const contactsTab = (await claimPage.SelectClaimTab(
          ClaimTabTypes.Contacts
        )) as ClaimsPortalClaimContactsTab
        const contactsTable = contactsTab.DataTable_Contacts
        const contact = testClaim.testData.claimPortalAccessContact
        await contactsTable.SetTableSearch(contact)
        const filteredRowCount = await contactsTable.VisibleRowCount()
        expect(filteredRowCount).toBe(1)
        const rowIndex = await contactsTable.FetchRowIndexFromRowPosition(1)
        const contactIsActive = await contactsTab.IsActionMenuItemVisible(
          contactsTable,
          rowIndex,
          Contacts_DataTable_ActionMenuItems.SetAsInactive
        )
        if (!contactIsActive) {
          await contactsTab.SelectActionMenuItem(
            contactsTable,
            rowIndex,
            Contacts_DataTable_ActionMenuItems.SetAsActive
          )
        }

        //Navigate to the Portal Access tab
        const portalAccessTab = (await claimPage.SelectClaimTab(
          ClaimTabTypes.PortalAccess
        )) as ClaimsPortalClaimPortalAccessTab
        const table = portalAccessTab.DataTable_PortalAccess

        //If the table is empty, we cannot perform this test
        if (await table.IsEmpty()) {
          // just make sure the Table Search button is not visible and then exit
          expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
          return
        }

        const initialRowCount = await table.VisibleRowCount()

        // Verify setting search input causes the table results to filter across all text fields (Name/Type)
        const nameSearchTerm = testClaim.testData.claimPortalAccessContact
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
        const typeSearchTerm = 'Expect no matches'
        const tableSearchDialog = await table.SetTableSearch(typeSearchTerm, true)

        // Verify table is filtered
        const typeFilteredRowCount = await table.VisibleRowCount()
        expect(typeFilteredRowCount).toBe(0)

        // Clear the search box
        await tableSearchDialog.Button_ClearSearch.Click()

        // Verify table is NOT filtered
        const typeFilterOffRowCount = await table.VisibleRowCount()
        expect(typeFilterOffRowCount).toBe(initialRowCount)

        await tableSearchDialog.Button_Close.Click()
      })

      test('Portal Access Table - Table Filter: Add Filter', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new ClaimsPortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim, then navigate to the Portal Access tab
        const portalAccessTab = (await claimPage.SelectClaimTab(
          ClaimTabTypes.PortalAccess
        )) as ClaimsPortalClaimPortalAccessTab
        const table = portalAccessTab.DataTable_PortalAccess

        //If the table is empty, we cannot perform this test
        if (await table.IsEmpty()) {
          AbortTest(AbortErrors.EmptyClaimPortalAccessTableMessage)
          return
        }

        const initialRowCount = await table.VisibleRowCount()

        // Verify setting the filter causes the table results to filter on the selected column only
        const contactFilterTerm = testClaim.testData.claimPortalAccessContact
        const { pinnedFilter: contactPinnedFilter } = await table.SetTableFilter_Text(
          contactFilterTerm,
          DataTable_Columns_Type.PortalAccess_Contact
        )
        const contactFilteredRowCount = await table.VisibleRowCount()
        expect(contactFilteredRowCount).toBe(1)

        // Verify setting this filter creates a pinned filter
        expect(await table.IsTableFilterActive(contactPinnedFilter)).toBe(true)

        //  and clicking X button on it removes it and clears the filter
        await table.CancelPinnedTableFilter(contactPinnedFilter)

        // Verify column is NOT filtered anymore
        expect(await table.IsTableFilterActive(contactPinnedFilter)).toBe(false)
        const contactFilteredOffRowCount = await table.VisibleRowCount()
        expect(contactFilteredOffRowCount).toBe(initialRowCount)

        // Verify clicking X on the filter input/selection causes the filtered table results to clear
        const { tableFilterDialog } = await table.SetTableFilter_Selection(
          PortalAccessStatusSelectionOptions.Staging,
          DataTable_Columns_Type.PortalAccess_Status,
          false,
          true
        )

        // Verify table is filtered
        const statusFilteredRowCount = await table.VisibleRowCount()
        expect(statusFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

        // Clear the filter selection
        await tableFilterDialog.Button_ClearFilter.Click()

        // Verify column is NOT filtered
        const statusFilterOffRowCount = await table.VisibleRowCount()
        expect(statusFilterOffRowCount).toBe(initialRowCount)

        await tableFilterDialog.Button_Close.Click()
      })

      test('Portal Access Table - Table Filter: Edit Filter', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new ClaimsPortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim, then navigate to the Portal Access tab
        const portalAccessTab = (await claimPage.SelectClaimTab(
          ClaimTabTypes.PortalAccess
        )) as ClaimsPortalClaimPortalAccessTab
        const table = portalAccessTab.DataTable_PortalAccess

        //If the table is empty, we cannot perform this test
        if (await table.IsEmpty()) {
          AbortTest(AbortErrors.EmptyClaimPortalAccessTableMessage)
          return
        }

        const initialRowCount = await table.VisibleRowCount()

        // Verify setting the filter causes the table results to filter on the selected column only
        const contactFilterTerm = testClaim.testData.claimPortalAccessContact
        const { pinnedFilter: contactPinnedFilter } = await table.SetTableFilter_Text(
          contactFilterTerm,
          DataTable_Columns_Type.PortalAccess_Contact
        )
        const contactFilteredRowCount = await table.VisibleRowCount()
        expect(contactFilteredRowCount).toBe(1)

        // Verify setting this filter creates a pinned global search
        expect(await table.IsTableFilterActive(contactPinnedFilter)).toBe(true)

        // Edit the existing filter
        const editedContactFilterTerm = 'There can be no matches'
        const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
          editedContactFilterTerm,
          DataTable_Columns_Type.PortalAccess_Contact,
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

      test('Portal Access Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new ClaimsPortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim, then navigate to the Portal Access tab
        const portalAccessTab = (await claimPage.SelectClaimTab(
          ClaimTabTypes.PortalAccess
        )) as ClaimsPortalClaimPortalAccessTab
        const table = portalAccessTab.DataTable_PortalAccess

        // Click the Open Table Settings button on the Portal Access Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.PortalAccess_Contact)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.PortalAccess_Contact)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.PortalAccess_ContactRoles)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.PortalAccess_ContactRoles)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.PortalAccess_Status)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.PortalAccess_Status)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.PortalAccess_CreatedDate)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.PortalAccess_CreatedDate)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.PortalAccess_LoginCount)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.PortalAccess_LoginCount)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.PortalAccess_LatestLogin)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.PortalAccess_LatestLogin)).toBe(
          false
        )

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.PortalAccess_Contact)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.PortalAccess_Contact)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.PortalAccess_ContactRoles)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.PortalAccess_ContactRoles)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.PortalAccess_Status)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.PortalAccess_Status)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.PortalAccess_CreatedDate)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.PortalAccess_CreatedDate)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.PortalAccess_LoginCount)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.PortalAccess_LoginCount)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.PortalAccess_LatestLogin)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.PortalAccess_LatestLogin)).toBe(
          true
        )
        await tableSettingsDialog.Close()
      })

      test('Portal Access Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new ClaimsPortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim, then navigate to the Portal Access tab
        const portalAccessTab = (await claimPage.SelectClaimTab(
          ClaimTabTypes.PortalAccess
        )) as ClaimsPortalClaimPortalAccessTab
        const table = portalAccessTab.DataTable_PortalAccess

        // Make sure the columns we need are visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.PortalAccess_Contact)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.PortalAccess_CreatedDate)
        await tableSettingsDialog.Close()

        // Examine Contact and CreatedDate columns
        // Verify initial states are unsorted
        const initialContactSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.PortalAccess_Contact
        )
        const initialCreatedDateSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.PortalAccess_CreatedDate
        )
        expect(initialContactSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialCreatedDateSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Contact column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.PortalAccess_Contact,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify Contact is sorted Down and Created Date is still unsorted
        let currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.PortalAccess_Contact
        )
        let currentTypeSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.PortalAccess_CreatedDate
        )
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentTypeSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Created Date column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.PortalAccess_CreatedDate,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify Contact is now unsorted and Created Date is sorted Up
        currentNameSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.PortalAccess_Contact
        )
        currentTypeSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.PortalAccess_CreatedDate
        )
        expect(currentNameSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentTypeSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Created Date column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.PortalAccess_CreatedDate,
          DataTable_Column_SortState.Unsorted
        )
        currentTypeSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.PortalAccess_CreatedDate
        )
        expect(currentTypeSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Verify Contact Roles and Login Count cannot be sorted
        const currentContactRolesSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.PortalAccess_ContactRoles
        )
        const currentLoginCountSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.PortalAccess_LoginCount
        )
        expect(currentContactRolesSortState).toBe(DataTable_Column_SortState.NotSortable)
        expect(currentLoginCountSortState).toBe(DataTable_Column_SortState.NotSortable)
      })
    })

    test('Portal Access Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Portal Access tab
      const portalAccessTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.PortalAccess
      )) as ClaimsPortalClaimPortalAccessTab
      const table = portalAccessTab.DataTable_PortalAccess

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
      await portalAccessTab.page.waitForTimeout(1000)
    })

    test('Portal Access Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Portal Access tab
      const portalAccessTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.PortalAccess
      )) as ClaimsPortalClaimPortalAccessTab
      const table = portalAccessTab.DataTable_PortalAccess

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimPortalAccessTableMessage)
        return
      }

      // Click the Add Table Filter button on the Portal Access Table
      let tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.PortalAccess_Contact
      )

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await portalAccessTab.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.PortalAccess_Contact)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Portal Access Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Portal Access tab
      const portalAccessTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.PortalAccess
      )) as ClaimsPortalClaimPortalAccessTab
      const table = portalAccessTab.DataTable_PortalAccess

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

    test('Portal Access Table - Verify Action Menu: View Contact Details', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Portal Access tab
      const portalAccessTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.PortalAccess
      )) as ClaimsPortalClaimPortalAccessTab
      const table = portalAccessTab.DataTable_PortalAccess

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimPortalAccessTableMessage)
        return
      }

      const rowIndex = '0'
      const expectedTitle = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.PortalAccess_Contact
      )
      await portalAccessTab.SelectActionMenuItem(
        rowIndex,
        PortalAccess_DataTable_ActionMenuItems.ViewContactDetails
      )
      const contactInfoDialog = new ClaimsPortalContactInfoDialog(global)

      // Verify the title
      await contactInfoDialog.VerifyTitle(expectedTitle)

      // Verify Contact Info popup - closes with click on "X" button
      await contactInfoDialog.Close()
      await expect(contactInfoDialog.Title.locator).not.toBeAttached()
      await portalAccessTab.page.waitForTimeout(1000)

      // Verify Contact Info popup - closes with ESC key
      await portalAccessTab.SelectActionMenuItem(
        rowIndex,
        PortalAccess_DataTable_ActionMenuItems.ViewContactDetails
      )
      await contactInfoDialog.Close(true)
      await expect(contactInfoDialog.Title.locator).not.toBeAttached()
      await portalAccessTab.page.waitForTimeout(1000)
    })

    test('Portal Access Table - Verify Action Menu: Deactivate Portal', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Portal Access tab
      const portalAccessTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.PortalAccess
      )) as ClaimsPortalClaimPortalAccessTab
      const table = portalAccessTab.DataTable_PortalAccess

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimPortalAccessTableMessage)
        return
      }

      // Set a filter for a Status of Active
      await table.SetTableFilter_Selection('Active', DataTable_Columns_Type.PortalAccess_Status)
      const activeFilteredRowCount = await table.VisibleRowCount()
      // if have a user with an Active portal - verify that we can attempt to deactivate it
      if (activeFilteredRowCount > 0) {
        const rowIndex = await table.FetchRowIndexFromRowPosition(1)
        await portalAccessTab.SelectActionMenuItem(
          rowIndex,
          PortalAccess_DataTable_ActionMenuItems.DeactivatePortal
        )
        // handle the alert but cancel it (don't deactivate)
        await portalAccessTab.HandleRemovePortalAccessAlert(true)
        await portalAccessTab.page.waitForTimeout(1000)
      }
    })

    test('Portal Access Table - Verify Action Menu: Add Person to Portal', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Portal Access tab
      const portalAccessTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.PortalAccess
      )) as ClaimsPortalClaimPortalAccessTab
      const table = portalAccessTab.DataTable_PortalAccess

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimPortalAccessTableMessage)
        return
      }

      // Set a filter for a Status of Inactive
      await table.SetTableFilter_Selection('Inactive', DataTable_Columns_Type.PortalAccess_Status)
      const inactiveFilteredRowCount = await table.VisibleRowCount()
      // if have a user with an Inactive portal - verify that we can attempt to add that person back to the portal
      if (inactiveFilteredRowCount > 0) {
        const rowIndex = await table.FetchRowIndexFromRowPosition(1)
        await portalAccessTab.SelectActionMenuItem(
          rowIndex,
          PortalAccess_DataTable_ActionMenuItems.AddPersonToPortal
        )

        // handle the Add Person to Portal draw that appears but cancel it (don't add them)
        const addPersonToPortalDrawer = new ClaimsPortalAddPersonToPortalDrawer(global)
        await addPersonToPortalDrawer.Button_Close.Click()
        await portalAccessTab.page.waitForTimeout(1000)
      }
    })

    test('Add Person To Portal - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Portal Access tab
      const portalAccessTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.PortalAccess
      )) as ClaimsPortalClaimPortalAccessTab
      const table = portalAccessTab.DataTable_PortalAccess

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimPortalAccessTableMessage)
        return
      }

      let addPersonToPortalDrawer = await portalAccessTab.OpenAddPersonToPortalDrawer()

      // Verify drawer heading is "Add Person To Portal"
      await addPersonToPortalDrawer.VerifyTitle()
      await expect(addPersonToPortalDrawer.claimContact).toBeAttached()
      await expect(addPersonToPortalDrawer.CheckBox_AddNote.locator).toBeAttached()
      expect(await addPersonToPortalDrawer.CheckBox_AddNote.locator.locator('..').isChecked()).toBe(
        false
      )

      // check the Add Note toggle to show the Note UI portion
      await addPersonToPortalDrawer.CheckBox_AddNote.locator.locator('..').setChecked(true)

      // Verify drawer closes with click on "X" button
      await addPersonToPortalDrawer.Close()
      await expect(addPersonToPortalDrawer.Title.locator).not.toBeAttached()
      await portalAccessTab.page.waitForTimeout(1000)

      addPersonToPortalDrawer = await portalAccessTab.OpenAddPersonToPortalDrawer()
      // Verify drawer closes with ESC key
      await addPersonToPortalDrawer.Close(true)
      await expect(addPersonToPortalDrawer.Title.locator).not.toBeAttached()
      await portalAccessTab.page.waitForTimeout(1000)

      addPersonToPortalDrawer = await portalAccessTab.OpenAddPersonToPortalDrawer()
      // Verify drawer closes if click on Close
      await addPersonToPortalDrawer.Button_Close.Click()
      await expect(addPersonToPortalDrawer.Title.locator).not.toBeAttached()
      await portalAccessTab.page.waitForTimeout(1000)
    })

    test('Add Person To Portal - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Portal Access tab
      const portalAccessTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.PortalAccess
      )) as ClaimsPortalClaimPortalAccessTab
      const table = portalAccessTab.DataTable_PortalAccess

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimPortalAccessTableMessage)
        return
      }

      const addPersonToPortalDrawer = await portalAccessTab.OpenAddPersonToPortalDrawer()

      // Verify drawer heading is "Add Person To Portal"
      await addPersonToPortalDrawer.Button_Submit.Click()
      await portalAccessTab.page.waitForTimeout(1000)

      // Verify validation message for the Select Status field only - no Note UI is displayed
      expect(await addPersonToPortalDrawer.ValidateWithNoteUIHidden()).toBe(true)

      // Click Close to close the drawer
      await addPersonToPortalDrawer.Button_Close.Click()
    })
  }
)
