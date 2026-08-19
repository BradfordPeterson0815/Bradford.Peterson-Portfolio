import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedClaimTypes,
  ClaimFilterSelectionOptions_ClaimStatus,
  Claims_DataTable_ActionMenuItems,
  DataTable_Column_PinState,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DataTable_ShowPageSize_Options,
  DateFilterTypes,
  DefaultEnvironment,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { FetchCannedClaim } from '../../../library/delegatePortal/delegatePortalHelper.js'
import {
  LaunchFieldAgent,
  LaunchFieldAgentMobile,
} from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { AbortTest } from '../../../library/shared/commonHelper.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Your Assigned Claims Page',
  {
    tag: [Tags.Delegate, Tags.FieldAgent, Tags.ClaimsPortal],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims

      // Verify the title label of "Your Assigned Claims" top left
      await homePage.VerifyTitle()

      // Verify Preference checkboxes
      expect(await homePage.Checkbox_HideClaimsInCarrierReview.IsVisible()).toBe(true)
      expect(await homePage.Checkbox_HideClaimsInQAReview.IsVisible()).toBe(true)

      // Verify Quick Filter buttons
      expect(await homePage.Button_NotScheduled.IsVisible()).toBe(true)
      expect(await homePage.Button_TodaysInspections.IsVisible()).toBe(true)

      // Verify theYour Assigned Claims table
      expect(await table.IsVisible()).toBe(true)

      // Verify Your Assigned Claims Table layout...
      // Verify Your Assigned Claims Column Settings / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // if table is not empty then verify Global Search Button
      if (!(await table.IsEmpty())) {
        await table.Button_OpenTableSearch.locator.waitFor({ state: 'visible' })
      }
    })

    test('Verify Preferences', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims

      // Set a claim Status for QA Review
      const { pinnedFilter: qaReviewPinnedFilter } = await table.SetTableFilter_Selection(
        ClaimFilterSelectionOptions_ClaimStatus.QAReview,
        DataTable_Columns_Type.Claims_ClaimStatus
      )
      // make sure both preferences are off before we start
      await homePage.Checkbox_HideClaimsInQAReview.SetChecked(false)
      await homePage.Checkbox_HideClaimsInCarrierReview.SetChecked(false)
      let initialFilteredRowCount = await table.VisibleRowCount()

      // if at least 1 claim in is QA review, then we can verify the Hide Claims in QA Review checkbox actally does something
      if (initialFilteredRowCount > 0) {
        await homePage.Checkbox_HideClaimsInQAReview.SetChecked(true)
        const currentFilteredRowCount = await table.VisibleRowCount()
        // we shouldn't see any QA Review status claims
        expect(currentFilteredRowCount).toBe(0)

        // uncheck the filter
        await homePage.Checkbox_HideClaimsInQAReview.SetChecked(false)
      }

      // Clear the filter selection
      await table.CancelPinnedTableFilter(qaReviewPinnedFilter)

      // Set a claim Status for Carrier Review
      const { pinnedFilter: carrierReviewPinnedFilter } = await table.SetTableFilter_Selection(
        ClaimFilterSelectionOptions_ClaimStatus.CarrierReview,
        DataTable_Columns_Type.Claims_ClaimStatus
      )
      initialFilteredRowCount = await table.VisibleRowCount()

      // if at least 1 claim in is Carrier review, then we can verify the Hide Claims in Carrier Review checkbox actally does something
      if (initialFilteredRowCount > 0) {
        await homePage.Checkbox_HideClaimsInCarrierReview.SetChecked(true)
        const currentFilteredRowCount = await table.VisibleRowCount()
        // we shouldn't see any Carrier Review status claims
        expect(currentFilteredRowCount).toBe(0)

        // uncheck the filter
        await homePage.Checkbox_HideClaimsInCarrierReview.SetChecked(false)
      }

      // Clear the filter selection
      await table.CancelPinnedTableFilter(carrierReviewPinnedFilter)
    })

    test('Verify Quick Filters', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims

      // Setup a filter to mimic the Todays Inspections quick filter...
      // Set a Date Filter for today on the Inspection Scheduled column
      const { pinnedFilter: filterInspectionsToday } = await table.SetTableFilter_Date(
        DateFilterTypes.DateEquals,
        DataTable_Columns_Type.Claims_InspectionScheduled,
        new Date()
      )
      let initialFilteredRowCount = await table.VisibleRowCount()
      // Clear the filter selection
      await table.CancelPinnedTableFilter(filterInspectionsToday)

      // turn on the Quick filter
      await homePage.Button_TodaysInspections.Click()
      let quickFilteredRowCount = await table.VisibleRowCount()

      expect(quickFilteredRowCount).toBe(initialFilteredRowCount)

      // We should have an identical pinned filter to our first one - use it to clear the filter
      await table.CancelPinnedTableFilter(filterInspectionsToday)
      expect(await table.IsTableFilterActive(filterInspectionsToday)).toBe(false)

      // Setup a filter to mimic the Not Scheduled quick filter...
      // Set a Date Filter for today on the Inspection Scheduled column
      const { pinnedFilter: filterNotScheduled } = await table.SetTableFilter_Date(
        DateFilterTypes.DateTBD,
        DataTable_Columns_Type.Claims_InspectionScheduled,
        new Date()
      )

      initialFilteredRowCount = await table.VisibleRowCount()
      // Clear the filter selection
      await table.CancelPinnedTableFilter(filterNotScheduled)

      // turn on the Quick filter
      await homePage.Button_NotScheduled.Click()
      quickFilteredRowCount = await table.VisibleRowCount()

      expect(quickFilteredRowCount).toBe(initialFilteredRowCount)

      // We should have an identical pinned filter to our first one - use it to clear the filter
      await table.CancelPinnedTableFilter(filterNotScheduled)
      expect(await table.IsTableFilterActive(filterNotScheduled)).toBe(false)
    })

    test('Your Assigned Claims Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims

      // Click the Open Table Settings button on the Your Assigned Claims Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Your Assigned Claims Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Delegate Field Agent home page
        const { homePage } = await LaunchFieldAgent(browser, environment)
        const table = homePage.DataTable_YourAssignedClaims

        // Click the Open Table Settings button on the Your Assigned Claims Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_ClaimNumber)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimNumber)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_InspectionCompleted)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_InspectionCompleted)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Email)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Email)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_InspectionScheduled)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_InspectionScheduled)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Phone)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Phone)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Carrier)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Carrier)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_ClaimStatus)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimStatus)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_PrimaryContact)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_PrimaryContact)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_LastEvent)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_LastEvent)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_DateReceived)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_DateReceived)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_LossDate)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_LossDate)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_HasLegalRep)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_HasLegalRep)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_City)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_City)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_State)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_State)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_County)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_County)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_CatCode)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_CatCode)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_HasJob)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_HasJob)).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_ClaimNumber)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimNumber)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_InspectionCompleted)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_InspectionCompleted)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Email)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Email)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_InspectionScheduled)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_InspectionScheduled)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Phone)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Phone)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Carrier)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Carrier)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_ClaimStatus)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimStatus)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_PrimaryContact)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_PrimaryContact)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_LastEvent)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_LastEvent)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_DateReceived)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_DateReceived)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_LossDate)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_LossDate)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_HasLegalRep)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_HasLegalRep)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_City)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_City)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_State)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_State)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_County)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_County)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_CatCode)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_CatCode)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_HasJob)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_HasJob)).toBe(true)
      })

      test('Your Assigned Claims Table - Settings: Move Columns', async ({ browser }) => {
        // launch the Delegate Field Agent home page
        const { homePage } = await LaunchFieldAgent(browser, environment)
        const table = homePage.DataTable_YourAssignedClaims

        // make sure all the columns we need are visible
        await homePage.ShowAllYourAssignedClaimsColumns()

        // Click the Open Table Settings button on the Claims Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Check checkbox column positions before move
        const firstCheckboxBefore = await tableSettingsDialog.GetNthCheckboxName(0)
        const secondCheckboxBefore = await tableSettingsDialog.GetNthCheckboxName(1)
        const thirdCheckboxBefore = await tableSettingsDialog.GetNthCheckboxName(2)
        const fourthCheckboxBefore = await tableSettingsDialog.GetNthCheckboxName(3)

        // Drag column 4 onto column 1
        await tableSettingsDialog.DragAndDropColumnByName(fourthCheckboxBefore, firstCheckboxBefore)

        const firstCheckboxAfter = await tableSettingsDialog.GetNthCheckboxName(0)
        const secondCheckboxAfter = await tableSettingsDialog.GetNthCheckboxName(1)
        const thirdCheckboxAfter = await tableSettingsDialog.GetNthCheckboxName(2)
        const fourthCheckboxAfter = await tableSettingsDialog.GetNthCheckboxName(3)
        expect(firstCheckboxAfter).toBe(fourthCheckboxBefore)
        expect(secondCheckboxAfter).toBe(firstCheckboxBefore)
        expect(thirdCheckboxAfter).toBe(secondCheckboxBefore)
        expect(fourthCheckboxAfter).toBe(thirdCheckboxBefore)

        await tableSettingsDialog.Close()

        // Check the position of the moved column after we are done
        const firstColumnNameAfterMove = await table.FetchColumnNameByColumnIndex(1)
        const secondColumnNameAfterMove = await table.FetchColumnNameByColumnIndex(2)
        expect(firstColumnNameAfterMove).toBe(fourthCheckboxBefore)
        expect(secondColumnNameAfterMove).toBe(firstCheckboxBefore)
      })

      test('Your Assigned Claims Table - Settings: Move Pinned Columns', async ({ browser }) => {
        // launch the Delegate Field Agent home page
        const { homePage } = await LaunchFieldAgent(browser, environment)
        const table = homePage.DataTable_YourAssignedClaims

        // make sure all the columns we need are visible
        await homePage.ShowAllYourAssignedClaimsColumns()

        // get the third column name
        const initialThirdColumnName = await table.FetchColumnNameByColumnIndex(3)
        const initialThirdColumnAccessName = await table.FetchColumnAccessNameByColumnIndex(3)

        // Pin the third column
        await table.SetColumnPinStateByAccessName(
          initialThirdColumnAccessName,
          DataTable_Column_PinState.Pinned
        )

        // Click the Open Table Settings button on the Unassigned Claims Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Check checkbox column positions before move
        const thirdCheckboxBefore = await tableSettingsDialog.GetNthCheckboxName(2)
        const fifthCheckboxBefore = await tableSettingsDialog.GetNthCheckboxName(4)

        // Drag third column onto fifth column
        await tableSettingsDialog.DragAndDropColumnByName(thirdCheckboxBefore, fifthCheckboxBefore)
        await tableSettingsDialog.Close()

        // Check the position of the pinned column after we are done
        const pinnedColumnIndexAfterMove =
          await table.FetchColumnIndexByColumnName(initialThirdColumnName)

        expect(pinnedColumnIndexAfterMove).toBe(1) // should be stuck leftmost regardless of the move position

        // Unpin the third column
        await table.SetColumnPinStateByAccessName(
          initialThirdColumnAccessName,
          DataTable_Column_PinState.Unpinned
        )

        // Check the position of the now unpinned column after we are done
        const unpinnedColumnIndexAfterMove =
          await table.FetchColumnIndexByColumnName(initialThirdColumnName)
        expect(unpinnedColumnIndexAfterMove).toBe(5) // should jump to the position we moved it
      })

      test('Your Assigned Claims Table - Pin Columns', async ({ browser }) => {
        // launch the Delegate Field Agent home page
        const { homePage } = await LaunchFieldAgent(browser, environment)
        const table = homePage.DataTable_YourAssignedClaims

        // make sure all the columns we need are visible
        await homePage.ShowAllYourAssignedClaimsColumns()

        // forcibly unpin any previous pins
        await table.SetColumnPinState(
          DataTable_Columns_Type.Claims_HasJob,
          DataTable_Column_PinState.Unpinned
        )
        await table.SetColumnPinState(
          DataTable_Columns_Type.Claims_ClaimStatus,
          DataTable_Column_PinState.Unpinned
        )

        // Prove Has Job column is not currently in the viewport before the pin
        expect(await table.IsColumnInViewPort(DataTable_Columns_Type.Claims_HasJob)).toBe(false)
        const initialHasJobPosition = await table.FetchColumnIndexByColumnType(
          DataTable_Columns_Type.Claims_HasJob
        )

        // Choose the Has Job column and click the Pin icon
        await table.SetColumnPinState(
          DataTable_Columns_Type.Claims_HasJob,
          DataTable_Column_PinState.Pinned
        )

        // Verify that the column is now "pinned" left most and has a dark Pin Icon
        expect(await table.FetchColumnPinState(DataTable_Columns_Type.Claims_HasJob)).toBe(
          DataTable_Column_PinState.Pinned
        )
        expect(await table.IsColumnInViewPort(DataTable_Columns_Type.Claims_HasJob)).toBe(true)
        expect(await table.FetchColumnIndexByColumnType(DataTable_Columns_Type.Claims_HasJob)).toBe(
          1
        )

        // Choose the Status column and click the Pin icon
        const initialStatePosition = await table.FetchColumnIndexByColumnType(
          DataTable_Columns_Type.Claims_ClaimStatus
        )
        await table.SetColumnPinState(
          DataTable_Columns_Type.Claims_ClaimStatus,
          DataTable_Column_PinState.Pinned
        )

        // Verify that this column is also "pinned" but to the right of the previously pinned column
        expect(await table.FetchColumnPinState(DataTable_Columns_Type.Claims_ClaimStatus)).toBe(
          DataTable_Column_PinState.Pinned
        )
        expect(await table.IsColumnInViewPort(DataTable_Columns_Type.Claims_ClaimStatus)).toBe(true)
        expect(
          await table.FetchColumnIndexByColumnType(DataTable_Columns_Type.Claims_ClaimStatus)
        ).toBe(2)

        // unpin Status and verify it goes back to where it was
        await table.SetColumnPinState(
          DataTable_Columns_Type.Claims_ClaimStatus,
          DataTable_Column_PinState.Unpinned
        )
        expect(await table.FetchColumnPinState(DataTable_Columns_Type.Claims_ClaimStatus)).toBe(
          DataTable_Column_PinState.Unpinned
        )
        expect(
          await table.FetchColumnIndexByColumnType(DataTable_Columns_Type.Claims_ClaimStatus)
        ).toBe(initialStatePosition)

        // unpin Has Job and verify it goes back to where it was
        await table.SetColumnPinState(
          DataTable_Columns_Type.Claims_HasJob,
          DataTable_Column_PinState.Unpinned
        )
        expect(await table.FetchColumnPinState(DataTable_Columns_Type.Claims_HasJob)).toBe(
          DataTable_Column_PinState.Unpinned
        )
        expect(await table.FetchColumnIndexByColumnType(DataTable_Columns_Type.Claims_HasJob)).toBe(
          initialHasJobPosition
        )
      })

      test('Your Assigned Claims Table - Sort Columns', async ({ browser }) => {
        // launch the Delegate Field Agent home page
        const { homePage } = await LaunchFieldAgent(browser, environment)
        const table = homePage.DataTable_YourAssignedClaims

        // make sure all the columns we need are visible
        await homePage.ShowAllYourAssignedClaimsColumns()

        // Examine Phone and Claim Number columns
        // Verify initial states are unsorted
        const initialClaimNumberSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_ClaimNumber
        )
        const initialPhoneSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Phone
        )
        expect(initialClaimNumberSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialPhoneSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Claim number column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Claims_ClaimNumber,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify Claim number is sorted Down and Phone is still unsorted
        let currentClaimNumberSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_ClaimNumber
        )
        let currentPhoneSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Phone
        )
        expect(currentClaimNumberSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentPhoneSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Phone column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Claims_Phone,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify Claim number is now unsorted and Phone is sorted Up
        currentClaimNumberSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_ClaimNumber
        )
        currentPhoneSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Phone
        )
        expect(currentClaimNumberSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentPhoneSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Phone column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.Claims_Phone,
          DataTable_Column_SortState.Unsorted
        )
        currentPhoneSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Phone
        )
        expect(currentPhoneSortState).toBe(DataTable_Column_SortState.Unsorted)
      })
    })

    test('Your Assigned Claims Table - Expand and Collapse', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims

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

    test('Your Assigned Claims Table - Global Search: Verify UI', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      // Click the Open Table Search button on the Request Callbacks Table
      const tableSearchDialog = await table.OpenTableSearch()

      // Verify the Table Search popup - Heading is "Global Search"
      await tableSearchDialog.VerifyTitle()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSearchDialog.Close()
      await expect(tableSearchDialog.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)
    })

    test('Your Assigned Claims Table - Global Search: Verify search', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        // just make sure the Table Search button is not visible and then exit
        expect(await table.Button_OpenTableSearch.IsVisible()).toBe(false)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting search input causes the table results to filter across all text fields
      let searchTerm = testClaim.basicInfo.claimNumber
      await table.SetTableSearch(searchTerm)

      let filteredRowCount = await table.VisibleRowCount()
      expect(filteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Verify closing Global search after setting search input creates a pinned global search
      expect(await table.IsGlobalSearchActive()).toBe(true)

      //  and clicking X button on it removes it and clears the search
      await table.CancelPinnedTableSearch()

      // Verify table is NOT filtered anymore
      expect(await table.IsGlobalSearchActive()).toBe(false)
      let filteredOffRowCount = await table.VisibleRowCount()
      expect(filteredOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the search input causes the filtered table results to clear
      searchTerm = 'NoMatchExpected'
      const tableSearchDialog = await table.SetTableSearch(searchTerm, true)

      // Verify table is filtered
      filteredRowCount = await table.VisibleRowCount()
      expect(filteredRowCount).toBeLessThan(initialRowCount)

      // Clear the search box
      await tableSearchDialog.Button_ClearSearch.Click()

      // Verify table is NOT filtered
      filteredOffRowCount = await table.VisibleRowCount()
      expect(filteredOffRowCount).toBe(initialRowCount)

      await tableSearchDialog.Button_Close.Click()
    })

    test('Your Assigned Claims Table - Table Filter: Verify UI', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
        return
      }

      // Click the Add Table Filter button on the table
      let tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Claims_ClaimNumber)

      // Verify the Table Filter popup - Heading is "Add Filter"
      await tableFilterDialog.VerifyTitle()

      // Verify Table Filter popup - closes with click on "X" button
      await tableFilterDialog.Close()
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)

      // Verify Table Filter popup - closes with ESC key
      tableFilterDialog = await table.AddTableFilter(DataTable_Columns_Type.Claims_Phone)
      await tableFilterDialog.Close(true)
      await expect(tableFilterDialog.Title.locator).not.toBeAttached()
    })

    test('Your Assigned Claims Table - Table Filter: Add Filter', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const filterTerm = 'No Match Expected'
      const { pinnedFilter: pinnedFilter } = await table.SetTableFilter_Text(
        filterTerm,
        DataTable_Columns_Type.Claims_Phone
      )
      let filteredRowCount = await table.VisibleRowCount()
      expect(filteredRowCount).toBe(0)

      // Verify setting this filter creates a pinned filter
      expect(await table.IsTableFilterActive(pinnedFilter)).toBe(true)

      //  and clicking X button on it removes it and clears the filter
      await table.CancelPinnedTableFilter(pinnedFilter)

      // Verify column is NOT filtered anymore
      expect(await table.IsTableFilterActive(pinnedFilter)).toBe(false)
      let filterOffRowCount = await table.VisibleRowCount()
      expect(filterOffRowCount).toBe(initialRowCount)

      // Verify clicking X on the filter input/selection causes the filtered table results to clear
      const { tableFilterDialog } = await table.SetTableFilter_Text(
        testClaim.basicInfo.claimNumber,
        DataTable_Columns_Type.Claims_ClaimNumber,
        false,
        true
      )

      // Verify table is filtered
      filteredRowCount = await table.VisibleRowCount()
      expect(filteredRowCount).toBeLessThanOrEqual(initialRowCount)

      // Clear the filter selection
      await tableFilterDialog.Button_ClearFilter.Click()

      // Verify column is NOT filtered
      filterOffRowCount = await table.VisibleRowCount()
      expect(filterOffRowCount).toBe(initialRowCount)

      await tableFilterDialog.Button_Close.Click()
    })

    test('Your Assigned Claims Table - Table Filter: Edit Filter', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
        return
      }

      const initialRowCount = await table.VisibleRowCount()

      // Verify setting the filter causes the table results to filter on the selected column only
      const nameFilterTerm = testClaim.basicInfo.claimNumber
      const { pinnedFilter: namePinnedFilter } = await table.SetTableFilter_Text(
        nameFilterTerm,
        DataTable_Columns_Type.Claims_ClaimNumber
      )
      const nameFilteredRowCount = await table.VisibleRowCount()
      expect(nameFilteredRowCount).toBe(1)

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(namePinnedFilter)).toBe(true)

      // Edit the existing filter
      const editedNameFilterTerm = 'There can be no matches'
      const { pinnedFilter: editedPinnedFilter } = await table.SetTableFilter_Text(
        editedNameFilterTerm,
        DataTable_Columns_Type.Claims_ClaimNumber,
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

    test('Your Assigned Claims Table - Table Filter: Inspection fields have Date TBD entry', async ({
      browser,
    }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
        return
      }

      // Verify we can set Date TBD filter on Inspection Scheduled
      const { pinnedFilter: filterScheduled } = await table.SetTableFilter_Date(
        DateFilterTypes.DateTBD,
        DataTable_Columns_Type.Claims_InspectionScheduled,
        new Date()
      )

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(filterScheduled)).toBe(true)

      // Verify clicking X button on the pinned filter removes it and clears the filter
      await table.CancelPinnedTableFilter(filterScheduled)

      // Verify we can set Date TBD filter on Inspection Scheduled
      const { pinnedFilter: filterCompleted } = await table.SetTableFilter_Date(
        DateFilterTypes.DateTBD,
        DataTable_Columns_Type.Claims_InspectionScheduled,
        new Date()
      )

      // Verify setting this filter creates a pinned global search
      expect(await table.IsTableFilterActive(filterCompleted)).toBe(true)

      // Verify clicking X button on the pinned filter removes it and clears the filter
      await table.CancelPinnedTableFilter(filterCompleted)
    })

    test('Your Assigned Claims Table - Verify Action Menu: Open Claim', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
        return
      }
      // grab the target claim number
      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
      const targetClaimNumber = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Claims_ClaimNumber
      )

      // open the claim
      await homePage.SelectActionMenuItem(
        table,
        rowIndex,
        Claims_DataTable_ActionMenuItems.OpenClaim
      )

      // verify we navigated to the claim page of the target
      await homePage.page.waitForTimeout(3000)
      expect(homePage.page.url().endsWith(`claims/${targetClaimNumber}/info`)).toBe(true)
    })

    test('Your Assigned Claims Table - Verify Action Menu: Copy Claim Number', async ({
      browser,
    }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
        return
      }

      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
      const targetClaimNumber = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Claims_ClaimNumber
      )
      await homePage.SelectActionMenuItem(
        table,
        rowIndex,
        Claims_DataTable_ActionMenuItems.CopyClaimNumber
      )
      const copiedClaimNumber = await homePage.GetClipboardText()

      // Verify clipboard contains the claimNumber
      expect(targetClaimNumber).toBe(copiedClaimNumber)
    })

    test('Your Assigned Claims Table - Copy Claim Number (clipboard icon)', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
        return
      }

      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
      const targetClaimNumber = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Claims_ClaimNumber
      )
      await table.ClickButtonInDataCell(rowIndex, DataTable_Columns_Type.Claims_ClaimNumber)
      const copiedClaimNumber = await homePage.GetClipboardText()

      // Verify clipboard contains the claimNumber
      expect(targetClaimNumber).toBe(copiedClaimNumber)
    })

    test('Your Assigned Claims Table - Verify Claim Number/Link button', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
        return
      }

      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
      const targetClaimNumber = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Claims_ClaimNumber
      )
      await table.ClickLinkInDataCell(rowIndex, DataTable_Columns_Type.Claims_ClaimNumber)

      // verify we navigated to the claim page of the target
      await homePage.page.waitForTimeout(3000)
      expect(homePage.page.url().endsWith(`claims/${targetClaimNumber}/info`)).toBe(true)
    })

    test('Your Assigned Claims Table - Pagination: Show List', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
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
        await homePage.page.waitForTimeout(1000)
        const pageData = await table.GetPageInfo()
        if (pageData.maxPage == 1) {
          expect(pageData.currentPageRowCount).toBeLessThanOrEqual(pageSize)
        } else {
          expect(pageData.currentPageRowCount).toBe(pageSize)
        }
      }
    })

    test('Your Assigned Claims Table - Pagination: Navigation Buttons', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await homePage.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage).toBe(1)

      // make sure we are on the first page
      if (await table.Button_GoToFirstPage.IsEnabled()) {
        await table.Button_GoToFirstPage.Click()
        await homePage.page.waitForTimeout(1000)
      }
      // Verify the First and Previous buttons are disabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(false)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)

      await table.Button_GoToNextPage.Click()
      await homePage.page.waitForTimeout(1000)
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
      await homePage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // Verify the First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(true)
      // Verify the Next and Last buttons are disabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(false)

      await table.Button_GoToPreviousPage.Click()
      await homePage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // If we are not on the first page, verify First and Previous buttons are disabled
      // If we are on the first page, verify First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      expect(await table.Button_GoToFirstPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)
    })

    test('Your Assigned Claims Table - Pagination: Go To Page', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)
      const table = homePage.DataTable_YourAssignedClaims

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await homePage.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      //If the table is <= 10 tags, we cannot perform this test
      if (pageData.maxPage == 1) {
        return
      }

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage).toBe(1)

      // Check Last Page
      await table.Pagination_GotoPage(lastPage)
      await homePage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display Y of Y where Y is the max page ie 3 of 3
      expect(pageData.currentPage).toBe(lastPage)

      // Check First Page
      await table.Pagination_GotoPage(1)
      await homePage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display 1 of Y where Y is the max page ie 1 of 3
      expect(pageData.currentPage).toBe(1)

      // if Max Pages are > 2, test an intermediate number
      if (lastPage > 2) {
        // Check random middle page
        const randomPage = Math.floor(Math.random() * (lastPage - 2) + 2)
        await table.Pagination_GotoPage(randomPage)
        await homePage.page.waitForTimeout(1000)
        pageData = await table.GetPageInfo()

        //Verify we display X of Y where Y is the max page and X is the Random page ie 4 of 7
        expect(pageData.currentPage).toBe(randomPage)
      }
    })

    test('Verify Mobile Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Field Agent in mobile mode
      const { homePage } = await LaunchFieldAgentMobile(browser, environment)

      // Verify the title label of "Your Assigned Claims" top left
      await homePage.VerifyTitle()

      // Verify Claim View links
      await homePage.page.waitForTimeout(4000)
      expect(await homePage.Link_NewAssignments.IsVisible()).toBe(true)
      expect(await homePage.Link_TodaysAssignments.IsVisible()).toBe(true)
      expect(await homePage.Link_AllAssignments.IsVisible()).toBe(true)

      // Verify Mobile Left Nav
      expect(await homePage.leftNavBar.Mobile_Button_Open.IsVisible()).toBe(true)

      // Verify Open and close of Mobile Left Nav
      await homePage.leftNavBar.Mobile_Button_Open.Click()

      // Nav Bar should be open
      let count = await homePage.page.locator('button[aria-label="Close"]').count()
      expect(count).toBe(1)

      // Press Escape to close
      await homePage.page.keyboard.press('Escape')
      await homePage.page.waitForTimeout(1000)

      // Nav Bar should be closed
      count = await homePage.page.locator('button[aria-label="Close"]').count()
      expect(count).toBe(0)
    })

    test('Verify Mobile Filter Buttons', async ({ browser }) => {
      // launch the Delegate Field Agent in mobile mode
      const { homePage } = await LaunchFieldAgentMobile(browser, environment)

      // Verify Claim Filter links
      await homePage.Link_NewAssignments.Click()
      let result = homePage.page.url().endsWith(`/claims/?assignments=new`)
      expect(result).toBe(true)

      // back
      await homePage.Button_Back.Click()

      await homePage.Link_TodaysAssignments.Click()
      result = homePage.page.url().endsWith(`/claims/?assignments=today`)
      expect(result).toBe(true)

      // back
      await homePage.Button_Back.Click()

      await homePage.Link_AllAssignments.Click()
      result = homePage.page.url().endsWith(`/claims/?assignments=all`)
      expect(result).toBe(true)

      await homePage.Button_Back.Click()
    })

    test('Verify Mobile Claims UI', async ({ browser }) => {
      // launch the Delegate Field Agent in mobile mode
      const { homePage } = await LaunchFieldAgentMobile(browser, environment)
      await homePage.Link_AllAssignments.Click()

      // Verify Search Text box and Clear Search button
      expect(await homePage.TextBox_Search.IsVisible()).toBe(true)
      expect(await homePage.Button_ClearSearch.IsVisible()).toBe(true)

      // Verify Sort Buttons and list
      expect(await homePage.Button_SortAscending.IsVisible()).toBe(true)
      expect(await homePage.Button_SortDescending.IsVisible()).toBe(false)
      expect(await homePage.sortSelection.isVisible()).toBe(true)

      // Verify Shrink Expand buttons
      expect(await homePage.Button_ExpandRows.IsVisible()).toBe(true)
      expect(await homePage.Button_ShrinkRows.IsVisible()).toBe(true)

      // Verify Cards Count
      const claimCardCount = await homePage.VisibleCardCount()
      expect(claimCardCount).toBeGreaterThan(0)

      // Verify Claim Card UI
      const claimCard = await homePage.GetClaimCardByIndex(0)
      expect(await claimCard.PrimaryContact()).not.toBe('')
      const { type, value } = await claimCard.ContactInfo()
      const validType = type == 'phone' || type == 'email' || type == 'none'
      expect(validType).toBe(true)
      expect(value).not.toBe('')
      expect(await claimCard.Carrier()).not.toBe('')
      expect(await claimCard.LossType()).not.toBe('')
      expect(await claimCard.DaysLeft()).not.toBe('')

      // Follow Goto Claim link
      const expectedURL = await claimCard.Link_GotoClaim.locator.getAttribute('href')
      await claimCard.Link_GotoClaim.Click()
      const result = homePage.page.url().endsWith(expectedURL != null ? expectedURL : '')
      expect(result).toBe(true)
    })

    test('Verify Mobile Shrink and Expand', async ({ browser }) => {
      // launch the Delegate Field Agent in mobile mode
      const { homePage } = await LaunchFieldAgentMobile(browser, environment)
      await homePage.Link_AllAssignments.Click()

      // Verify Cards Count
      const claimCardCount = await homePage.VisibleCardCount()
      expect(claimCardCount).toBeGreaterThan(0)

      // Verify Claim Card UI in expanded mode
      let claimCard = await homePage.GetClaimCardByIndex(0)

      // We expect to be in Expand mode first
      expect(await claimCard.IsShrunk()).toBe(false)
      expect(await claimCard.PrimaryContact()).not.toBe('')
      const { type, value } = await claimCard.ContactInfo()
      const validType = type == 'phone' || type == 'email' || type == 'none'
      expect(validType).toBe(true)
      expect(value).not.toBe('')
      expect(await claimCard.Carrier()).not.toBe('')
      expect(await claimCard.LossType()).not.toBe('')
      expect(await claimCard.DaysLeft()).not.toBe('')

      // switch to Shrunk mode
      await homePage.Button_ShrinkRows.Click()

      // Verify Claim Card UI in shrunk mode
      claimCard = await homePage.GetClaimCardByIndex(0)

      // We expect to be in shrunk mode now
      expect(await claimCard.IsShrunk()).toBe(true)
      const { type: shrunkType, value: shrunkValue } = await claimCard.ContactInfo()
      const validShrunkType = shrunkType == 'phone' || shrunkType == 'email' || type == 'none'
      expect(validShrunkType).toBe(true)
      expect(shrunkValue).not.toBe('')
      expect(await claimCard.Carrier()).toBe(null)
      expect(await claimCard.LossType()).toBe(null)
      expect(await claimCard.DaysLeft()).not.toBe('')

      // switch back to Expanded mode
      await homePage.Button_ExpandRows.Click()

      // Verify Claim Card UI in expanded mode
      claimCard = await homePage.GetClaimCardByIndex(0)
      expect(await claimCard.IsShrunk()).toBe(false)
    })

    test('Verify Mobile Search', async ({ browser }) => {
      // launch the Delegate Field Agent in mobile mode
      const { homePage } = await LaunchFieldAgentMobile(browser, environment)
      await homePage.Link_AllAssignments.Click()

      // Verify Cards Count
      const claimCardCountBeforeSearch = await homePage.VisibleCardCount()
      expect(claimCardCountBeforeSearch).toBeGreaterThanOrEqual(1)

      // Verify Search functionality
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      await homePage.PerformSearch(testClaim.basicInfo.claimNumber)
      const claimCardCountAfterSearch = await homePage.VisibleCardCount()
      expect(claimCardCountAfterSearch).toBe(1)

      await homePage.Button_ClearSearch.Click()
      expect(await homePage.VisibleCardCount()).toBe(claimCardCountBeforeSearch)
    })

    test('Verify Mobile Sort', async ({ browser }) => {
      // launch the Delegate Field Agent in mobile mode
      const { homePage } = await LaunchFieldAgentMobile(browser, environment)
      await homePage.Link_AllAssignments.Click()
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)

      // Verify Search functionality
      await homePage.PerformSearch(testClaim.basicInfo.carrier)
      const claimCardCountAfterSearch = await homePage.VisibleCardCount()
      expect(claimCardCountAfterSearch).toBeGreaterThanOrEqual(1)

      // we start in descending order - so lets flip that
      await homePage.Button_SortAscending.Click()
      await homePage.SelectSortField('Primary Contact')

      let claimCardOnTop = await homePage.GetClaimCardByIndex(0)
      let claimCardOnBottom = await homePage.GetClaimCardByIndex(claimCardCountAfterSearch - 1)
      const primaryContactOnTopAscending = await claimCardOnTop.PrimaryContact()
      const primaryContactOnBottomAscending = await claimCardOnBottom.PrimaryContact()

      // Flip Sort to descending
      await homePage.Button_SortDescending.Click()
      claimCardOnTop = await homePage.GetClaimCardByIndex(0)
      claimCardOnBottom = await homePage.GetClaimCardByIndex(claimCardCountAfterSearch - 1)
      const primaryContactOnTopDescending = await claimCardOnTop.PrimaryContact()
      const primaryContactOnBottomDescending = await claimCardOnBottom.PrimaryContact()

      // top and bottom positions should be reversed
      expect(primaryContactOnBottomAscending).toBe(primaryContactOnTopDescending)
      expect(primaryContactOnTopAscending).toBe(primaryContactOnBottomDescending)
    })
  }
)
