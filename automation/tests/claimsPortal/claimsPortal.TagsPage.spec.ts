import { expect } from '@playwright/test'
import { AbortTest } from '../../library/shared/commonHelper.js'
import {
  AbortErrors,
  CannedClaimTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DataTable_ShowPageSize_Options,
  DefaultEnvironment,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedClaim, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalRelatedTagKeyDrawer } from '../../library/claimsPortal/drawers/claimsPortalRelatedTagKeyDrawer.js'
import { ClaimsPortalTagsPage } from '../../library/claimsPortal/pages/claimsPortalTagsPage.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'

const environment = DefaultEnvironment
const testKey = 'TestKeyDontDelete'

test.describe(
  'Tags Page',
  {
    tag: [Tags.ClaimsPortal, Tags.Tags],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      const table = tagsPage.DataTable_Tags

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Tags Table layout...
      // Verify Filters and Expand button
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

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

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      const table = tagsPage.DataTable_Tags

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Tags Table layout...
      // Verify Filters and Expand button
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // if table is not empty then verify Global Search Button
      if (!(await table.IsEmpty())) {
        await table.Button_OpenTableSearch.locator.waitFor({ state: 'visible' })
      }
    })

    test('Tags Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      const table = tagsPage.DataTable_Tags

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // Click the Open Table Search button on the Tags Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await tagsPage.page.waitForTimeout(1000)
    })

    test('Tags Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      const table = tagsPage.DataTable_Tags

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all tag key fields
      const tagKeySearchTerm = testKey
      await table.SetTableSearch(tagKeySearchTerm)

      let tagKeyFilteredRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredRowCount).toBe(1)

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      //  and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      let tagKeyFilteredOffRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      const tableSearchDialog = await table.SetTableSearch(tagKeySearchTerm, true)

      // Verify table is filtered
      tagKeyFilteredRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      tagKeyFilteredOffRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Tags Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      const table = tagsPage.DataTable_Tags

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyTagKeysTableMessage)
        return
      }

      // Click the Add Table Filter button on the Tags Table
      let tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Tags_TagKey)

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await tagsPage.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Tags_TagKey)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Tags Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      const table = tagsPage.DataTable_Tags

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyTagKeysTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const tagKeyFilterTerm = testKey
      const { pinnedFilter: tagKeyPinnedFilter } = await table.SetTableFilter_Text(
        tagKeyFilterTerm,
        DataTable_Columns_Type.Tags_TagKey
      )
      let tagKeyFilteredRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(tagKeyPinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(tagKeyPinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(tagKeyPinnedFilter)).toBe(false)
      let tagKeyFilteredOffRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const { tableFilterDialog } = await table.SetTableFilter_Text(
        tagKeyFilterTerm,
        DataTable_Columns_Type.Tags_TagKey,
        false,
        true
      )

      // Verify table is filtered
      tagKeyFilteredRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      tagKeyFilteredOffRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Tags Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      const table = tagsPage.DataTable_Tags

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyTagKeysTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const tagKeyFilterTerm = testKey
      const { pinnedFilter: tagKeyPinnedFilter } = await table.SetTableFilter_Text(
        tagKeyFilterTerm,
        DataTable_Columns_Type.Tags_TagKey
      )
      const tagKeyFilteredRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(tagKeyPinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedTagKeyFilterTerm = 'There can be no matches'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedTagKeyFilterTerm,
        DataTable_Columns_Type.Tags_TagKey,
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

    test('Tags Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      const table = tagsPage.DataTable_Tags

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

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Tags Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
        const tagsPage = new ClaimsPortalTagsPage(global)
        await tagsPage.NavigateToPage()
        const table = tagsPage.DataTable_Tags

        // Examine Tag Key column
        // Verify initial state is unsorted
        const initialSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Tags_TagKey
        )
        expect(initialSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Tag Key column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Tags_TagKey,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify Tag Key number is sorted Down
        let currentSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Tags_TagKey)
        expect(currentSortState).toBe(DataTable_Column_SortState.Down_HighToLow)

        // Set the Tag Key Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Tags_TagKey,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify Tag Key is sorted Up
        currentSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Tags_TagKey)
        expect(currentSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Tag Key Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.Tags_TagKey,
          DataTable_Column_SortState.Unsorted
        )

        // Verify Tag Key is unsorted
        currentSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Tags_TagKey)
        expect(currentSortState).toBe(DataTable_Column_SortState.Unsorted)
      })

      test('Related Tag Keys Drawer Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
        const tagsPage = new ClaimsPortalTagsPage(global)
        await tagsPage.NavigateToPage()
        let table = tagsPage.DataTable_Tags

        //If the table is empty, we cannot perform this test
        if (await table.IsEmpty()) {
          AbortTest(AbortErrors.EmptyTagKeysTableMessage)
          return
        }

        // Filter to Carrier and click the related tags button
        const tagKeyFilterTerm = testKey
        await table.SetTableFilter_Text(tagKeyFilterTerm, DataTable_Columns_Type.Tags_TagKey)
        const tagKeyFilteredRowCount = await table.VisibleRowCount()
        expect(tagKeyFilteredRowCount).toBe(1)
        await tagsPage.OpenRelatedTagsDrawer(1)
        const relatedTagsDrawer = new ClaimsPortalRelatedTagKeyDrawer(global, tagKeyFilterTerm)
        await relatedTagsDrawer.CustomLoad()
        table = relatedTagsDrawer.DataTable_RelatedTags

        // Click the Open Table Settings button on the Related Tags Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.RelatedTags_Resource)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.RelatedTags_Resource)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.RelatedTags_Tag_Value)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.RelatedTags_Tag_Value)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.RelatedTags_Color)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.RelatedTags_Color)).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.RelatedTags_Resource)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.RelatedTags_Resource)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.RelatedTags_Tag_Value)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.RelatedTags_Tag_Value)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.RelatedTags_Color)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.RelatedTags_Color)).toBe(true)
        await tableSettingsDialog.Close()
      })

      test('Related Tag Keys Drawer Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
        const tagsPage = new ClaimsPortalTagsPage(global)
        await tagsPage.NavigateToPage()
        let table = tagsPage.DataTable_Tags

        //If the table is empty, we cannot perform this test
        if (await table.IsEmpty()) {
          AbortTest(AbortErrors.EmptyTagKeysTableMessage)
          return
        }

        // Filter to Carrier and click the related tags button
        const tagKeyFilterTerm = testKey
        await table.SetTableFilter_Text(tagKeyFilterTerm, DataTable_Columns_Type.Tags_TagKey)
        const tagKeyFilteredRowCount = await table.VisibleRowCount()
        expect(tagKeyFilteredRowCount).toBe(1)
        await tagsPage.OpenRelatedTagsDrawer(1)
        const relatedTagsDrawer = new ClaimsPortalRelatedTagKeyDrawer(global, tagKeyFilterTerm)
        await relatedTagsDrawer.CustomLoad()
        table = relatedTagsDrawer.DataTable_RelatedTags

        // Make sure the columns we need are visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.RelatedTags_Resource)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.RelatedTags_Tag_Value)
        await tableSettingsDialog.Close()

        // Examine Resource and Tag Value columns
        // Verify initial states are unsorted
        const initialResourceSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.RelatedTags_Resource
        )
        const initialTagValueSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.RelatedTags_Tag_Value
        )
        expect(initialResourceSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialTagValueSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Resource column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.RelatedTags_Resource,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify Resource is sorted Down and TagValue is still unsorted
        let currentResourceSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.RelatedTags_Resource
        )
        let currentTagValueSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.RelatedTags_Tag_Value
        )
        expect(currentResourceSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentTagValueSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the TagValue column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.RelatedTags_Tag_Value,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify Resource is now unsorted and TagValue is sorted Up
        currentResourceSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.RelatedTags_Resource
        )
        currentTagValueSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.RelatedTags_Tag_Value
        )
        expect(currentResourceSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentTagValueSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the TagValue column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.RelatedTags_Tag_Value,
          DataTable_Column_SortState.Unsorted
        )
        currentTagValueSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.RelatedTags_Tag_Value
        )
        expect(currentTagValueSortState).toBe(DataTable_Column_SortState.Unsorted)
      })
    })

    test('Tags Table - Pagination:Show List', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      const table = tagsPage.DataTable_Tags

      const pageData = await table.GetPageInfo()

      //If the table is <= 10 tags, we cannot perform this test
      if (pageData.maxPage == 1) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      //Verify the Tag Keys table displayed rows updates to either all rows if < page size or page size  rows if > 50
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
        await tagsPage.page.waitForTimeout(1000)
        const pageData = await table.GetPageInfo()
        if (pageData.maxPage == 1) {
          expect(pageData.currentPageRowCount <= pageSize).toBe(true)
        } else {
          expect(pageData.currentPageRowCount == pageSize).toBe(true)
        }
      }
    })

    test('Tags Table - Pagination: Navigation Buttons', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      const table = tagsPage.DataTable_Tags

      // we need at least 10 rows to do this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      //If the table is <= 10 tags, we cannot perform this test
      if (pageData.maxPage == 1) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await tagsPage.page.waitForTimeout(1000)

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage).toBe(1)

      // make sure we are on the first page
      if (await table.Button_GoToFirstPage.IsEnabled()) {
        await table.Button_GoToFirstPage.Click()
        await tagsPage.page.waitForTimeout(1000)
      }
      // Verify the First and Previous buttons are disabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(false)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)

      await table.Button_GoToNextPage.Click()
      await tagsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // Verify the First and Previous buttons  are now enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(true)
      // If we are on the last page, verify Next and Last buttons are disabled
      // If we are not on the last page, verify Next and Last buttons  are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).not.toBe(pageData.currentPage == lastPage)
      expect(await table.Button_GoToLastPage.IsEnabled()).not.toBe(pageData.currentPage == lastPage)

      await table.Button_GoToFirstPage.Click()
      await table.Button_GoToLastPage.Click()
      await tagsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // Verify the First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(true)
      // Verify the Next and Last buttons are disabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(false)

      await table.Button_GoToPreviousPage.Click()
      await tagsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // If we are not on the first page, verify First and Previous buttons are disabled
      // If we are on the first page, verify First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      expect(await table.Button_GoToFirstPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)
    })

    test('Tags Table - Pagination: Go To Page', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      const table = tagsPage.DataTable_Tags

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await tagsPage.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage).toBe(1)

      // Check Last Page
      await table.Pagination_GotoPage(lastPage)
      await tagsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display Y of Y where Y is the max page ie 3 of 3
      expect(pageData.currentPage).toBe(lastPage)

      // Check First Page
      await table.Pagination_GotoPage(1)
      await tagsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display 1 of Y where Y is the max page ie 1 of 3
      expect(pageData.currentPage).toBe(1)

      // if Max Pages are > 2, test an intermediate number
      if (lastPage > 2) {
        // Check random middle page
        const randomPage = Math.floor(Math.random() * (lastPage - 2) + 2)
        await table.Pagination_GotoPage(randomPage)
        await tagsPage.page.waitForTimeout(1000)
        pageData = await table.GetPageInfo()

        //Verify we display X of Y where Y is the max page and X is the Random page ie 4 of 7
        expect(pageData.currentPage).toBe(randomPage)
      }
    })

    test('Related Tag Keys Drawer Table - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      let table = tagsPage.DataTable_Tags

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyTagKeysTableMessage)
        return
      }

      // Filter to Carrier and click the related tags button
      const tagKeyFilterTerm = testKey
      await table.SetTableFilter_Text(tagKeyFilterTerm, DataTable_Columns_Type.Tags_TagKey)
      const tagKeyFilteredRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredRowCount).toBe(1)
      await tagsPage.OpenRelatedTagsDrawer(1)
      const relatedTagsDrawer = new ClaimsPortalRelatedTagKeyDrawer(global, tagKeyFilterTerm)
      await relatedTagsDrawer.CustomLoad()

      // Verify drawer heading is "Tag Key: TestKeyDontDelete"
      await relatedTagsDrawer.VerifyTitle()
      table = relatedTagsDrawer.DataTable_RelatedTags

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Related Tags Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_AddTableFilter.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // if table is not empty then verify Global Search Button
      if (!(await table.IsEmpty())) {
        await table.Button_OpenTableSearch.locator.waitFor({ state: 'visible' })
      }

      // Verify drawer closes with click on "X" button
      await relatedTagsDrawer.Button_Close_X.Click()
      await expect(relatedTagsDrawer.Title.locator).not.toBeAttached()
      await tagsPage.page.waitForTimeout(1000)

      await tagsPage.OpenRelatedTagsDrawer(1)
      // Verify drawer closes with ESC key
      await relatedTagsDrawer.Close(true)
      await expect(relatedTagsDrawer.Title.locator).not.toBeAttached()
      await tagsPage.page.waitForTimeout(1000)

      await tagsPage.OpenRelatedTagsDrawer(1)
      // Verify drawer closes if click on Close
      await relatedTagsDrawer.Button_Close.Click()
      await expect(relatedTagsDrawer.Title.locator).not.toBeAttached()
      await tagsPage.page.waitForTimeout(1000)
    })

    test('Related Tag Keys Drawer Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      let table = tagsPage.DataTable_Tags

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyTagKeysTableMessage)
        return
      }

      // Filter to Carrier and click the related tags button
      const tagKeyFilterTerm = testKey
      await table.SetTableFilter_Text(tagKeyFilterTerm, DataTable_Columns_Type.Tags_TagKey)
      const tagKeyFilteredRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredRowCount).toBe(1)
      await tagsPage.OpenRelatedTagsDrawer(1)
      const relatedTagsDrawer = new ClaimsPortalRelatedTagKeyDrawer(global, tagKeyFilterTerm)
      await relatedTagsDrawer.CustomLoad()
      table = relatedTagsDrawer.DataTable_RelatedTags

      // Click the Open Table Settings button on the Related Tags Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await relatedTagsDrawer.page.waitForTimeout(1000)
    })

    test('Related Tag Keys Drawer Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      let table = tagsPage.DataTable_Tags

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyTagKeysTableMessage)
        return
      }

      // Filter to Carrier and click the related tags button
      const tagKeyFilterTerm = testKey
      await table.SetTableFilter_Text(tagKeyFilterTerm, DataTable_Columns_Type.Tags_TagKey)
      const tagKeyFilteredRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredRowCount).toBe(1)
      await tagsPage.OpenRelatedTagsDrawer(1)
      const relatedTagsDrawer = new ClaimsPortalRelatedTagKeyDrawer(global, tagKeyFilterTerm)
      await relatedTagsDrawer.CustomLoad()
      table = relatedTagsDrawer.DataTable_RelatedTags

      // Click the Open Table Search button on the Related Tags Table
      let tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await relatedTagsDrawer.page.waitForTimeout(1000)

      // Verify Table Search popup - closes when focus is lost
      tableSearchDialog = await table.OpenTableSearch()
      await relatedTagsDrawer.Title.Click()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await relatedTagsDrawer.page.waitForTimeout(1000)
    })

    test('Related Tag Keys Drawer Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      let table = tagsPage.DataTable_Tags

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyTagKeysTableMessage)
        return
      }

      // Filter to Carrier and click the related tags button
      const tagKeyFilterTerm = testKey
      await table.SetTableFilter_Text(tagKeyFilterTerm, DataTable_Columns_Type.Tags_TagKey)
      const tagKeyFilteredRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredRowCount).toBe(1)
      await tagsPage.OpenRelatedTagsDrawer(1)
      const relatedTagsDrawer = new ClaimsPortalRelatedTagKeyDrawer(global, tagKeyFilterTerm)
      await relatedTagsDrawer.CustomLoad()
      table = relatedTagsDrawer.DataTable_RelatedTags

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields (Resource/Value)
      let resourceSearchTerm = testClaim.basicInfo.claimNumber
      await table.SetTableSearch(resourceSearchTerm)

      let resourceFilteredRowCount = await table.VisibleRowCount()
      expect(resourceFilteredRowCount).toBe(1)

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      //  and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      let resourceFilteredOffRowCount = await table.VisibleRowCount()
      expect(resourceFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      resourceSearchTerm = 'No Matches To Be Found'
      const tableSearchDialog = await table.SetTableSearch(resourceSearchTerm, true)

      // Verify table is filtered
      resourceFilteredRowCount = await table.VisibleRowCount()
      expect(resourceFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      resourceFilteredOffRowCount = await table.VisibleRowCount()
      expect(resourceFilteredOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Related Tag Keys Drawer Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      let table = tagsPage.DataTable_Tags

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyTagKeysTableMessage)
        return
      }

      // Filter to Carrier and click the related tags button
      const tagKeyFilterTerm = testKey
      await table.SetTableFilter_Text(tagKeyFilterTerm, DataTable_Columns_Type.Tags_TagKey)
      const tagKeyFilteredRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredRowCount).toBe(1)
      await tagsPage.OpenRelatedTagsDrawer(1)
      const relatedTagsDrawer = new ClaimsPortalRelatedTagKeyDrawer(global, tagKeyFilterTerm)
      await relatedTagsDrawer.CustomLoad()
      table = relatedTagsDrawer.DataTable_RelatedTags

      // Click the Add Table Filter button on the Related Tags Table
      let tableFilterDialog = await table.AddTableFilter(
        DataTable_Columns_Type.RelatedTags_Resource
      )

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await relatedTagsDrawer.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.RelatedTags_Resource)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Related Tag Keys Drawer Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      let table = tagsPage.DataTable_Tags

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyTagKeysTableMessage)
        return
      }

      // Filter to Carrier and click the related tags button
      const tagKeyFilterTerm = testKey
      await table.SetTableFilter_Text(tagKeyFilterTerm, DataTable_Columns_Type.Tags_TagKey)
      const tagKeyFilteredRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredRowCount).toBe(1)
      await tagsPage.OpenRelatedTagsDrawer(1)
      const relatedTagsDrawer = new ClaimsPortalRelatedTagKeyDrawer(global, tagKeyFilterTerm)
      await relatedTagsDrawer.CustomLoad()
      table = relatedTagsDrawer.DataTable_RelatedTags

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const valueFilterTerm = 'EMPTY_VALUE'
      const { pinnedFilter: valuePinnedFilter } = await table.SetTableFilter_Text(
        valueFilterTerm,
        DataTable_Columns_Type.RelatedTags_Tag_Value
      )
      const valueFilteredRowCount = await table.VisibleRowCount()
      expect(valueFilteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(valuePinnedFilter)).toBe(true)

      // and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(valuePinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(valuePinnedFilter)).toBe(false)
      const valueFilteredOffRowCount = await table.VisibleRowCount()
      expect(valueFilteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const { tableFilterDialog } = await table.SetTableFilter_Text(
        'There can be no matches',
        DataTable_Columns_Type.RelatedTags_Resource,
        false,
        true
      )

      // Verify table is filtered
      const resourceFilteredRowCount = await table.VisibleRowCount()
      expect(resourceFilteredRowCount).toBeLessThan(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      const resourceFilteredOffRowCount = await table.VisibleRowCount()
      expect(resourceFilteredOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Related Tag Keys Drawer Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      let table = tagsPage.DataTable_Tags

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyTagKeysTableMessage)
        return
      }

      // Filter to Carrier and click the related tags button
      const tagKeyFilterTerm = testKey
      await table.SetTableFilter_Text(tagKeyFilterTerm, DataTable_Columns_Type.Tags_TagKey)
      const tagKeyFilteredRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredRowCount).toBe(1)
      await tagsPage.OpenRelatedTagsDrawer(1)
      const relatedTagsDrawer = new ClaimsPortalRelatedTagKeyDrawer(global, tagKeyFilterTerm)
      await relatedTagsDrawer.CustomLoad()
      table = relatedTagsDrawer.DataTable_RelatedTags

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const resourceFilterTerm = testClaim.basicInfo.claimNumber
      const { pinnedFilter: resourcePinnedFilter } = await table.SetTableFilter_Text(
        resourceFilterTerm,
        DataTable_Columns_Type.RelatedTags_Resource
      )
      const resourceFilteredRowCount = await table.VisibleRowCount()
      expect(resourceFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned filter search
      expect(await table.IsTableFilterActive(resourcePinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedResourceFilterTerm = 'There can be no matches'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedResourceFilterTerm,
        DataTable_Columns_Type.RelatedTags_Resource,
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

    test('Related Tag Keys Drawer Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      let table = tagsPage.DataTable_Tags

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyTagKeysTableMessage)
        return
      }

      // Filter to Carrier and click the related tags button
      const tagKeyFilterTerm = testKey
      await table.SetTableFilter_Text(tagKeyFilterTerm, DataTable_Columns_Type.Tags_TagKey)
      const tagKeyFilteredRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredRowCount).toBe(1)
      await tagsPage.OpenRelatedTagsDrawer(1)
      const relatedTagsDrawer = new ClaimsPortalRelatedTagKeyDrawer(global, tagKeyFilterTerm)
      await relatedTagsDrawer.CustomLoad()
      table = relatedTagsDrawer.DataTable_RelatedTags

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

    test('Related Tag Keys Drawer Table - Navigate to Resource', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      let table = tagsPage.DataTable_Tags

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyTagKeysTableMessage)
        return
      }

      // Filter to Carrier and click the related tags button
      const tagKeyFilterTerm = testKey
      await table.SetTableFilter_Text(tagKeyFilterTerm, DataTable_Columns_Type.Tags_TagKey)
      const tagKeyFilteredRowCount = await table.VisibleRowCount()
      expect(tagKeyFilteredRowCount).toBe(1)
      await tagsPage.OpenRelatedTagsDrawer(1)
      const relatedTagsDrawer = new ClaimsPortalRelatedTagKeyDrawer(global, tagKeyFilterTerm)
      await relatedTagsDrawer.CustomLoad()
      table = relatedTagsDrawer.DataTable_RelatedTags

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // narrow down our target so we have a fixed row number
      const resourceSearchTerm = testClaim.basicInfo.claimNumber
      await table.SetTableSearch(resourceSearchTerm)
      const resourceFilteredRowCount = await table.VisibleRowCount()
      expect(resourceFilteredRowCount).toBe(1)

      // click the resource link
      await relatedTagsDrawer.NavigateToResource(1)

      // Verify that behind the scenes our tag page has become the claim page for our resource
      const result = tagsPage.page.url().endsWith(`claims/${resourceSearchTerm}/info`)
      expect(result).toBe(true)
    })
  }
)
