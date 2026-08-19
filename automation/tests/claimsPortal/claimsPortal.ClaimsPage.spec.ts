import { expect } from '@playwright/test'
import { AbortTest } from '../../library/shared/commonHelper.js'
import {
  AbortErrors,
  BadgeTypes,
  CannedClaimTypes,
  ClaimAssignContactOptions,
  ClaimFilterFields,
  ClaimFilterFields_Boolean,
  ClaimFilterFields_Date,
  ClaimFilterFields_Text,
  ClaimFilterOperators,
  ClaimFilterOperators_Boolean,
  ClaimFilterOperators_Date,
  ClaimFilterOperators_Text,
  ClaimFilterSelectionOptions_Boolean,
  ClaimFilterSelectionOptions_Carrier,
  ClaimFilterSelectionOptions_ClaimStatus,
  ClaimFilterSelectionOptions_Coordinator,
  ClaimFilterSelectionOptions_FieldAgent,
  ClaimFilterSelectionOptions_LatestTimelineEvent,
  Claims_DataTable_ActionMenuItems as Claims_DataTable_ActionMenuItems,
  DataTable_Column_PinState,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DataTable_ShowPageSize_Options,
  DefaultEnvironment,
  ViewIncludes,
  ViewTypes,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedClaim, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalView } from '../../library/claimsPortal/claimsPortalView.js'
import { ClaimsPortalClaimsPage } from '../../library/claimsPortal/pages/claimsPortalClaimsPage.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'

const environment = DefaultEnvironment

test.describe(
  'ClaimsPortal Page',
  {
    tag: [Tags.ClaimsPortal, Tags.ClaimsPortal],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()

      // check for Create Claim button
      expect(await claimsPage.Link_CreateClaim.IsVisible()).toBe(true)

      // check for Views and Filters
      expect(await claimsPage.Views_ClaimsPortal.IsVisible()).toBe(true)
      expect(await claimsPage.Filter_ClaimsPortal.IsVisible()).toBe(true)

      // Verify ClaimsPortal Table exists
      expect(await claimsPage.DataTable_ClaimsPortal.IsVisible()).toBe(true)

      // Check table settings dialog and columns
      await claimsPage.VerifyTableSettingColumns()

      // Verify ClaimsPortal Table layout...
      // Verify ClaimsPortal Column Settings / Expand button
      expect(await claimsPage.DataTable_ClaimsPortal.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await claimsPage.DataTable_ClaimsPortal.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await claimsPage.DataTable_ClaimsPortal.Button_CloseTable.IsVisible()).toBe(false)

      // Verify ClaimsPortal Table Badge
      await claimsPage.DataTable_ClaimsPortal.VerifyBadge(BadgeTypes.TotalClaims)
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()

      // check for Create Claim button
      expect(await claimsPage.Link_CreateClaim.IsVisible()).toBe(true)

      // check for Views and Filters
      expect(await claimsPage.Views_ClaimsPortal.IsVisible()).toBe(true)
      expect(await claimsPage.Filter_ClaimsPortal.IsVisible()).toBe(true)

      // Verify ClaimsPortal Table exists
      expect(await claimsPage.DataTable_ClaimsPortal.IsVisible()).toBe(true)

      // Verify ClaimsPortal Table layout...
      // Verify ClaimsPortal Column Settings / Expand button
      expect(await claimsPage.DataTable_ClaimsPortal.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await claimsPage.DataTable_ClaimsPortal.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await claimsPage.DataTable_ClaimsPortal.Button_CloseTable.IsVisible()).toBe(false)

      // Verify ClaimsPortal Table Badge
      await claimsPage.DataTable_ClaimsPortal.VerifyBadge(BadgeTypes.TotalClaims)
    })

    test('Claim Views - Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()

      // Verify the views section exists and is collapsed
      expect(await claimsPage.Views_ClaimsPortal.IsVisible()).toBe(true)
      expect(await claimsPage.Views_ClaimsPortal.IsExpanded()).toBe(false)

      // Verify the views section can be expanded
      await claimsPage.Views_ClaimsPortal.Button_ExpandFilter.Click()
      expect(await claimsPage.Views_ClaimsPortal.IsExpanded()).toBe(true)

      // if 1 or more personal view entries are displayed, personal view count will be 0
      const personalViewCount = await claimsPage.Views_ClaimsPortal.PersonalViewCount()
      if (personalViewCount == 0) {
        // If no views exist, we should see an information label that says "No personal views have been added."
        await claimsPage.Views_ClaimsPortal.VerifyNoPersonalViewsAlert()
      }

      // Verify there is a Create New View Button
      expect(await claimsPage.Views_ClaimsPortal.Button_CreateNewView.IsVisible()).toBe(true)

      // Verify the views section can be collapsed
      await claimsPage.Views_ClaimsPortal.Button_CollapseFilter.Click()
      expect(await claimsPage.Views_ClaimsPortal.IsExpanded()).toBe(false)
    })

    test('Claim Views - Create New View - Validate', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()

      // Expand the view section
      await claimsPage.Views_ClaimsPortal.Button_ExpandFilter.Click()

      // Click the Create New View Button
      await claimsPage.Views_ClaimsPortal.Button_CreateNewView.Click()

      // Without entering any infomation, click the Save View button
      await claimsPage.Views_ClaimsPortal.Button_NewView_SaveView.Click()

      // Now validate errors
      await claimsPage.Views_ClaimsPortal.ValidateNewView()
      await claimsPage.Views_ClaimsPortal.Button_NewView_Cancel.Click()
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Claim Views - Add Personal View with all Includes', async ({ browser }) => {
        test.slow()

        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)
        const claimsPage = new ClaimsPortalClaimsPage(global)
        await claimsPage.NavigateToPage()

        // Expand the view section
        await claimsPage.Views_ClaimsPortal.Button_ExpandFilter.Click()

        // Define a new personal view with all the includes
        const viewToCreate = new ClaimsPortalView(
          ViewTypes.Personal,
          'TestPersonalViewAllIncludes',
          'Description for TestPersonalViewAllIncludes',
          [
            ViewIncludes.ColumnOrder,
            ViewIncludes.ColumnPinning,
            ViewIncludes.ColumnVisibility,
            ViewIncludes.Filters,
            ViewIncludes.Sorting,
          ]
        )
        const viewSearch = viewToCreate.GenerateTitleDescriptionSearch()

        // Delete any old Test Personal Views
        await claimsPage.Views_ClaimsPortal.DeleteExistingView(ViewTypes.Personal, viewSearch)

        // Choose Reset View in Global Views to reset everything
        await claimsPage.Views_ClaimsPortal.Button_GlobalView_Reset.Click()

        // prepare a unique view by moving, pinning, hiding and sorting Columns
        // Add 1 or more filters and Save them to apply
        await claimsPage.Filter_ClaimsPortal.Button_ExpandFilter.Click()
        await claimsPage.AddBooleanFilter(
          ClaimFilterFields.HasCatCode,
          ClaimFilterOperators_Boolean.Is,
          ClaimFilterSelectionOptions_Boolean.True
        )
        await claimsPage.Filter_ClaimsPortal.Button_SaveFilters.Click()
        await claimsPage.page.waitForTimeout(1000)

        // Hide a column
        let tableSettingsDialog = await claimsPage.DataTable_ClaimsPortal.OpenTableSettings()
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Email)
        await tableSettingsDialog.Button_Close.Click()

        // Pin a column
        await claimsPage.DataTable_ClaimsPortal.SetColumnPinState(
          DataTable_Columns_Type.Claims_Coordinator,
          DataTable_Column_PinState.Pinned
        )

        // Move a column
        // Click the Open Table Settings button on the ClaimsPortal Table
        tableSettingsDialog = await claimsPage.DataTable_ClaimsPortal.OpenTableSettings()
        await tableSettingsDialog.DragAndDropColumn(
          DataTable_Columns_Type.Claims_Policyholder,
          DataTable_Columns_Type.Claims_Users
        )
        const usersColumnIndexAfterMove =
          await claimsPage.DataTable_ClaimsPortal.FetchColumnIndexByColumnType(
            DataTable_Columns_Type.Claims_Users
          )
        await tableSettingsDialog.Button_Close.Click()

        // Create a view that captures our current state
        await claimsPage.Views_ClaimsPortal.GenerateNewView(viewToCreate)

        // Verify new Personal View is in Personal Views section - should list all Include options
        expect(await claimsPage.Views_ClaimsPortal.FindExistingView(ViewTypes.Personal, viewSearch)).toBe(
          true
        )

        // Choose Reset View in Global Views to reset everything again
        await claimsPage.Views_ClaimsPortal.Button_GlobalView_Reset.Click()

        // Click your newly created Personal View
        await claimsPage.Views_ClaimsPortal.ClickExistingView(ViewTypes.Personal, viewSearch)

        // Verify that the associated filters you saved were applied
        expect(await claimsPage.Filter_ClaimsPortal.RowCount()).toBe(1)
        expect(await claimsPage.Filter_ClaimsPortal.GetSelectedFilterFieldText(0)).toBe(
          ClaimFilterFields.HasCatCode
        )
        expect(await claimsPage.Filter_ClaimsPortal.GetSelectedFilterOperatorText(0)).toBe(
          ClaimFilterOperators.Is
        )
        expect(await claimsPage.Filter_ClaimsPortal.GetSelectedFilterValueText(0)).toBe(
          ClaimFilterSelectionOptions_Boolean.True
        )

        // Verify that the included column changes you saved were applied
        // column should be hidden again
        expect(
          await claimsPage.DataTable_ClaimsPortal.IsColumnVisible(DataTable_Columns_Type.Claims_Email)
        ).toBe(false)

        // column should be pinned again
        expect(
          await claimsPage.DataTable_ClaimsPortal.FetchColumnPinState(
            DataTable_Columns_Type.Claims_Coordinator
          )
        ).toBe(DataTable_Column_PinState.Pinned)

        // column move should be preserved
        expect(
          await claimsPage.DataTable_ClaimsPortal.FetchColumnIndexByColumnType(
            DataTable_Columns_Type.Claims_Users
          )
        ).toBe(usersColumnIndexAfterMove)

        // Clean...
        await claimsPage.Views_ClaimsPortal.DeleteExistingView(ViewTypes.Personal, viewSearch)

        // Verify the view is gone
        expect(await claimsPage.Views_ClaimsPortal.FindExistingView(ViewTypes.Personal, viewSearch)).toBe(
          false
        )

        // and Reset
        await claimsPage.Views_ClaimsPortal.Button_GlobalView_Reset.Click()
      })

      test('Claim Views - Add Personal View with no Includes', async ({ browser }) => {
        test.slow()

        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)
        const claimsPage = new ClaimsPortalClaimsPage(global)
        await claimsPage.NavigateToPage()

        // Expand the view section
        await claimsPage.Views_ClaimsPortal.Button_ExpandFilter.Click()

        // Define a new personal view with none of the includes
        const viewToCreate = new ClaimsPortalView(
          ViewTypes.Personal,
          'TestPersonalViewNoIncludes',
          'Description for TestPersonalViewNoIncludes',
          []
        )
        const viewSearch = viewToCreate.GenerateTitleDescriptionSearch()

        // Delete any old Test Personal Views
        await claimsPage.Views_ClaimsPortal.DeleteExistingView(ViewTypes.Personal, viewSearch)

        // Choose Reset View in Global Views to reset everything
        await claimsPage.Views_ClaimsPortal.Button_GlobalView_Reset.IsVisible()
        await claimsPage.Views_ClaimsPortal.Button_GlobalView_Reset.Click()

        // prepare a unique view by moving, pinning, hiding and sorting Columns
        // Add 1 or more filters and Save them to apply
        await claimsPage.Filter_ClaimsPortal.Button_ExpandFilter.Click()
        await claimsPage.AddBooleanFilter(
          ClaimFilterFields.HasCatCode,
          ClaimFilterOperators_Boolean.Is,
          ClaimFilterSelectionOptions_Boolean.True
        )
        await claimsPage.Filter_ClaimsPortal.Button_SaveFilters.Click()
        await claimsPage.page.waitForTimeout(1000)

        // Hide a column
        const tableSettingsDialog = await claimsPage.DataTable_ClaimsPortal.OpenTableSettings()
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Users)
        await tableSettingsDialog.Button_Close.Click()

        // Create a view that captures our current state
        await claimsPage.Views_ClaimsPortal.GenerateNewView(viewToCreate)

        // Verify new Personal View is in Personal Views section - should list no Include options
        expect(await claimsPage.Views_ClaimsPortal.FindExistingView(ViewTypes.Personal, viewSearch)).toBe(
          true
        )

        // Choose Reset View in Global Views to reset everything again
        await claimsPage.Views_ClaimsPortal.Button_GlobalView_Reset.Click()

        // Click your newly created Personal View
        await claimsPage.Views_ClaimsPortal.ClickExistingView(ViewTypes.Personal, viewSearch)

        // Verify that the included column changes you saved were NOT applied
        // column should be visible - not hidden
        expect(
          await claimsPage.DataTable_ClaimsPortal.IsColumnVisible(DataTable_Columns_Type.Claims_Users)
        ).toBe(true)

        // Verify that the associated filters you saved were NOT applied
        expect(await claimsPage.Filter_ClaimsPortal.RowCount()).toBe(0)

        // Clean...
        await claimsPage.Views_ClaimsPortal.DeleteExistingView(ViewTypes.Personal, viewSearch)

        // Verify the view is gone
        expect(await claimsPage.Views_ClaimsPortal.FindExistingView(ViewTypes.Personal, viewSearch)).toBe(
          false
        )

        // and Reset
        await claimsPage.Views_ClaimsPortal.Button_GlobalView_Reset.Click()
      })

      test('Claim Views - Add Global View with some Includes', async ({ browser }) => {
        test.slow()

        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)
        const claimsPage = new ClaimsPortalClaimsPage(global)
        await claimsPage.NavigateToPage()

        // Expand the view section
        await claimsPage.Views_ClaimsPortal.Button_ExpandFilter.Click()

        // Define a new global view with some of the includes
        const viewToCreate = new ClaimsPortalView(
          ViewTypes.Global,
          'TestGlobalViewSomeIncludes',
          'Description for TestGlobalViewSomeIncludes',
          [ViewIncludes.ColumnOrder, ViewIncludes.ColumnVisibility, ViewIncludes.Sorting]
        )
        const viewSearch = viewToCreate.GenerateTitleDescriptionSearch()

        // Delete any old Test Global Views
        await claimsPage.Views_ClaimsPortal.DeleteExistingView(ViewTypes.Global, viewSearch)

        // Choose Reset View in Global Views to reset everything
        await claimsPage.Views_ClaimsPortal.Button_GlobalView_Reset.Click()

        // prepare a unique view by moving, pinning, hiding and sorting Columns
        // Add 1 or more filters and Save them to apply
        await claimsPage.Filter_ClaimsPortal.Button_ExpandFilter.Click()
        await claimsPage.AddBooleanFilter(
          ClaimFilterFields.HasCatCode,
          ClaimFilterOperators_Boolean.Is,
          ClaimFilterSelectionOptions_Boolean.True
        )
        await claimsPage.Filter_ClaimsPortal.Button_SaveFilters.Click()
        await claimsPage.page.waitForTimeout(1000)

        // Hide a column
        const tableSettingsDialog = await claimsPage.DataTable_ClaimsPortal.OpenTableSettings()
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Users)
        await tableSettingsDialog.Button_Close.Click()

        // Create a view that captures our current state
        await claimsPage.Views_ClaimsPortal.GenerateNewView(viewToCreate)

        // Verify new Global View is in Global Views section - should list some Include options
        expect(await claimsPage.Views_ClaimsPortal.FindExistingView(ViewTypes.Global, viewSearch)).toBe(
          true
        )

        // Choose Reset View in Global Views to reset everything again
        await claimsPage.Views_ClaimsPortal.Button_GlobalView_Reset.Click()

        // Click your newly created Global View
        await claimsPage.Views_ClaimsPortal.ClickExistingView(ViewTypes.Global, viewSearch)

        // Verify that the included column changes you saved were applied
        // column should be hidden again
        expect(
          await claimsPage.DataTable_ClaimsPortal.IsColumnVisible(DataTable_Columns_Type.Claims_Users)
        ).toBe(false)

        // Verify that the associated filters you saved were NOT applied
        expect(await claimsPage.Filter_ClaimsPortal.RowCount()).toBe(0)

        // Clean...
        await claimsPage.Views_ClaimsPortal.DeleteExistingView(ViewTypes.Global, viewSearch)
        // Verify the view is gone
        expect(await claimsPage.Views_ClaimsPortal.FindExistingView(ViewTypes.Global, viewSearch)).toBe(
          false
        )

        // and Reset
        await claimsPage.Views_ClaimsPortal.Button_GlobalView_Reset.Click()
      })

      test('Claim Views - Verify Default Filter View', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)
        const claimsPage = new ClaimsPortalClaimsPage(global)
        await claimsPage.NavigateToPage()

        // Expand the view section
        await claimsPage.Views_ClaimsPortal.Button_ExpandFilter.Click()

        // Choose Reset View in Global Views to reset everything
        await claimsPage.Views_ClaimsPortal.Button_GlobalView_Reset.Click()
        await claimsPage.page.waitForTimeout(1000)

        // prepare a unique view by moving, pinning, hiding and sorting Columns
        // Add 1 or more filters and Save them to apply
        await claimsPage.Filter_ClaimsPortal.Button_ExpandFilter.Click()
        await claimsPage.AddBooleanFilter(
          ClaimFilterFields.HasCatCode,
          ClaimFilterOperators_Boolean.Is,
          ClaimFilterSelectionOptions_Boolean.True
        )
        await claimsPage.Filter_ClaimsPortal.Button_SaveFilters.Click()
        await claimsPage.page.waitForTimeout(1000)

        // Hide a column
        const tableSettingsDialog = await claimsPage.DataTable_ClaimsPortal.OpenTableSettings()
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Users)
        await tableSettingsDialog.Button_Close.Click()

        // Click the Default Filter View in Global Views
        await claimsPage.Views_ClaimsPortal.Button_GlobalView_DefaultFilter.Click()
        await claimsPage.page.waitForTimeout(3000)

        // Verify that the included column changes you saved were not changed
        expect(
          await claimsPage.DataTable_ClaimsPortal.IsColumnVisible(DataTable_Columns_Type.Claims_Users)
        ).toBe(false)

        // Verify that the associated filters you saved were overwritten
        expect(await claimsPage.Filter_ClaimsPortal.RowCount()).toBe(1)
        expect(await claimsPage.Filter_ClaimsPortal.GetSelectedFilterFieldText(0)).toBe(
          ClaimFilterFields.ClaimStatus
        )
        expect(await claimsPage.Filter_ClaimsPortal.GetSelectedFilterOperatorText(0)).toBe(
          ClaimFilterOperators.EqualTo
        )
        expect(await claimsPage.Filter_ClaimsPortal.GetSelectedFilterValueText(0)).toBe(
          ClaimFilterSelectionOptions_ClaimStatus.CoordinatorReview
        )

        // Reset
        await claimsPage.Views_ClaimsPortal.Button_GlobalView_Reset.Click()
      })

      test('Claim Views - Verify Unassigned ClaimsPortal View', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)
        const claimsPage = new ClaimsPortalClaimsPage(global)
        await claimsPage.NavigateToPage()

        // Expand the view section
        await claimsPage.Views_ClaimsPortal.Button_ExpandFilter.Click()

        // Choose Reset View in Global Views to reset everything
        await claimsPage.Views_ClaimsPortal.Button_GlobalView_Reset.Click()
        await claimsPage.page.waitForTimeout(1000)

        // prepare a unique view by moving, pinning, hiding and sorting Columns
        // Add 1 or more filters and Save them to apply
        await claimsPage.Filter_ClaimsPortal.Button_ExpandFilter.Click()
        await claimsPage.AddBooleanFilter(
          ClaimFilterFields.HasCatCode,
          ClaimFilterOperators_Boolean.Is,
          ClaimFilterSelectionOptions_Boolean.True
        )
        await claimsPage.Filter_ClaimsPortal.Button_SaveFilters.Click()
        await claimsPage.page.waitForTimeout(1000)

        // Hide a column
        const tableSettingsDialog = await claimsPage.DataTable_ClaimsPortal.OpenTableSettings()
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Users)
        await tableSettingsDialog.Button_Close.Click()

        // Click the Default Filter View in Global Views
        await claimsPage.Views_ClaimsPortal.Button_GlobalView_UnassignedClaimsPortal.Click()
        await claimsPage.page.waitForTimeout(3000)

        // Verify that the included column changes you saved were not changed
        expect(
          await claimsPage.DataTable_ClaimsPortal.IsColumnVisible(DataTable_Columns_Type.Claims_Users)
        ).toBe(false)

        // Verify that the associated filters you saved were overwritten
        expect(await claimsPage.Filter_ClaimsPortal.RowCount()).toBe(2)
        expect(await claimsPage.Filter_ClaimsPortal.GetSelectedFilterFieldText(0)).toBe(
          ClaimFilterFields.ClaimStatus
        )
        expect(await claimsPage.Filter_ClaimsPortal.GetSelectedFilterOperatorText(0)).toBe(
          ClaimFilterOperators.EqualTo
        )
        expect(await claimsPage.Filter_ClaimsPortal.GetSelectedFilterValueText(0)).toBe(
          ClaimFilterSelectionOptions_ClaimStatus.CoordinatorReview
        )
        expect(await claimsPage.Filter_ClaimsPortal.GetSelectedFilterFieldText(1)).toBe(
          ClaimFilterFields.HasCoordinator
        )
        expect(await claimsPage.Filter_ClaimsPortal.GetSelectedFilterOperatorText(1)).toBe(
          ClaimFilterOperators.Is
        )
        expect(await claimsPage.Filter_ClaimsPortal.GetSelectedFilterValueText(1)).toBe(
          'Select an option'
        )

        //Reset
        await claimsPage.Views_ClaimsPortal.Button_GlobalView_Reset.Click()
      })

      test('Claim Filters - Verify Text Filters', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)
        const claimsPage = new ClaimsPortalClaimsPage(global)
        await claimsPage.NavigateToPage()

        // Expand and set the filter to an empty state
        await claimsPage.ClearAllFilters()

        // Verify Text Filter Fields
        for (const fieldKey in ClaimFilterFields_Text) {
          const fieldValue = ClaimFilterFields[fieldKey as keyof typeof ClaimFilterFields_Text]
          switch (fieldValue.toString()) {
            case ClaimFilterFields_Text.CatCode:
              await claimsPage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.EqualTo,
                'Cat Code 1'
              )
              await claimsPage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.NotEqualTo,
                'Cat Code 1'
              )
              break
            case ClaimFilterFields_Text.City:
              await claimsPage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.Matches,
                'Spokane'
              )
              await claimsPage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.DoesNotMatch,
                'Tacoma'
              )
              break
            case ClaimFilterFields_Text.ClaimNumber:
              await claimsPage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.Matches,
                'CL-123'
              )
              await claimsPage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.DoesNotMatch,
                'CL-456'
              )
              break
            case ClaimFilterFields_Text.County:
              await claimsPage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.Matches,
                'Spokane'
              )
              await claimsPage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.DoesNotMatch,
                'King'
              )
              break
            case ClaimFilterFields_Text.PrimaryContactEmail:
              await claimsPage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.Matches,
                'fred@freddys.com'
              )
              await claimsPage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.DoesNotMatch,
                'jim@jimmys.com'
              )
              break
            case ClaimFilterFields_Text.PrimaryContactName:
              await claimsPage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.Matches,
                'Fred Savage'
              )
              await claimsPage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.DoesNotMatch,
                'Daniel Stern'
              )
              break
            case ClaimFilterFields_Text.PrimaryContactPhone:
              await claimsPage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.Matches,
                'Redacted'
              )
              await claimsPage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.DoesNotMatch,
                '509-555-1212'
              )
              break
            case ClaimFilterFields_Text.State:
              await claimsPage.AddTextFilter(fieldValue, ClaimFilterOperators_Text.Matches, 'WA')
              await claimsPage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.DoesNotMatch,
                'OR'
              )
              break
            default:
              throw new Error(`No Text Filter case is defined for: ${fieldValue}`)
          }
        }
      })

      test('Claim Filters - Verify Boolean Filters', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)
        const claimsPage = new ClaimsPortalClaimsPage(global)
        await claimsPage.NavigateToPage()

        // Expand and set the filter to an empty state
        await claimsPage.ClearAllFilters()

        // Verify Boolean Filter Fields
        for (const fieldKey in ClaimFilterFields_Boolean) {
          const fieldValue = ClaimFilterFields[fieldKey as keyof typeof ClaimFilterFields_Boolean]
          switch (fieldValue.toString()) {
            case ClaimFilterFields_Boolean.HasCatCode:
            case ClaimFilterFields_Boolean.HasCoordinator:
            case ClaimFilterFields_Boolean.HasFieldAgent:
              await claimsPage.AddBooleanFilter(
                fieldValue,
                ClaimFilterOperators_Boolean.Is,
                ClaimFilterSelectionOptions_Boolean.True
              )
              await claimsPage.AddBooleanFilter(
                fieldValue,
                ClaimFilterOperators_Boolean.Is,
                ClaimFilterSelectionOptions_Boolean.False
              )
              break
            case ClaimFilterFields_Boolean.HasLegalRep:
            case ClaimFilterFields_Boolean.HasJob:
            case ClaimFilterFields_Boolean.IsReadOnly:
              await claimsPage.AddBooleanFilter(
                fieldValue,
                ClaimFilterOperators_Boolean.EqualTo,
                ClaimFilterSelectionOptions_Boolean.True
              )
              await claimsPage.AddBooleanFilter(
                fieldValue,
                ClaimFilterOperators_Boolean.NotEqualTo,
                ClaimFilterSelectionOptions_Boolean.False
              )
              break
            default:
              throw new Error(`No Boolean Filter case is defined for: ${fieldValue}`)
          }
        }
      })

      test('Claim Filters - Verify Date Filters', async ({ browser }) => {
        test.slow()

        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)
        const claimsPage = new ClaimsPortalClaimsPage(global)
        await claimsPage.NavigateToPage()

        // Expand and set the filter to an empty state
        await claimsPage.ClearAllFilters()

        // Verify Date Filter Fields
        for (const fieldKey in ClaimFilterFields_Date) {
          const fieldValue = ClaimFilterFields[fieldKey as keyof typeof ClaimFilterFields_Date]
          switch (fieldValue.toString()) {
            case ClaimFilterFields_Date.DateReceived:
            case ClaimFilterFields_Date.InAssignQueue:
            case ClaimFilterFields_Date.InspectionScheduled:
            case ClaimFilterFields_Date.InspectionCompleted:
            case ClaimFilterFields_Date.JobContracted:
            case ClaimFilterFields_Date.JobNotSold:
            case ClaimFilterFields_Date.LossDate:
              await claimsPage.AddDateFilter(
                fieldValue,
                ClaimFilterOperators_Date.WithinTheLast,
                '5'
              )
              await claimsPage.AddDateFilter(
                fieldValue,
                ClaimFilterOperators_Date.DoesNotMatch,
                '2024-01-01'
              )
              await claimsPage.AddDateFilter(
                fieldValue,
                ClaimFilterOperators_Date.Matches,
                '2024-01-01'
              )
              await claimsPage.AddDateFilter(
                fieldValue,
                ClaimFilterOperators_Date.GreaterThan,
                '2024-01-01'
              )
              await claimsPage.AddDateFilter(
                fieldValue,
                ClaimFilterOperators_Date.GreaterThanOrEqualTo,
                '2024-01-01'
              )
              await claimsPage.AddDateFilter(
                fieldValue,
                ClaimFilterOperators_Date.LessThan,
                '2024-01-01'
              )
              await claimsPage.AddDateFilter(
                fieldValue,
                ClaimFilterOperators_Date.LessThanOrEqualTo,
                '2024-01-01'
              )
              break
            default:
              throw new Error(`No Boolean Filter case is defined for: ${fieldValue}`)
          }
        }
      })

      test('Claim Filters - Verify Claim Status Filter', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)
        const claimsPage = new ClaimsPortalClaimsPage(global)
        await claimsPage.NavigateToPage()

        // Expand and set the filter to an empty state
        await claimsPage.ClearAllFilters()

        // Verify Claim Status filter
        for (const fieldKey in ClaimFilterSelectionOptions_ClaimStatus) {
          const fieldValue =
            ClaimFilterSelectionOptions_ClaimStatus[
              fieldKey as keyof typeof ClaimFilterSelectionOptions_ClaimStatus
            ]
          const randomOperator = Math.random() < 0.5
          await claimsPage.AddClaimStatusFilter(
            randomOperator ? ClaimFilterOperators.EqualTo : ClaimFilterOperators.NotEqualTo,
            fieldValue
          )
        }
        const expectedRows = Object.keys(ClaimFilterSelectionOptions_ClaimStatus).length
        expect(await claimsPage.Filter_ClaimsPortal.RowCount()).toBe(expectedRows)
      })

      test('Claim Filters - Verify Latest Timeline Event Filter', async ({ browser }) => {
        test.slow()

        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)
        const claimsPage = new ClaimsPortalClaimsPage(global)
        await claimsPage.NavigateToPage()

        // Expand and set the filter to an empty state
        await claimsPage.ClearAllFilters()

        // Verify Latest Timeline Event filter
        for (const fieldKey in ClaimFilterSelectionOptions_LatestTimelineEvent) {
          const fieldValue =
            ClaimFilterSelectionOptions_LatestTimelineEvent[
              fieldKey as keyof typeof ClaimFilterSelectionOptions_LatestTimelineEvent
            ]
          const randomOperator = Math.random() < 0.5
          await claimsPage.AddLatestTimelineEventFilter(
            randomOperator ? ClaimFilterOperators.EqualTo : ClaimFilterOperators.NotEqualTo,
            fieldValue
          )
        }
        const expectedRows = Object.keys(ClaimFilterSelectionOptions_LatestTimelineEvent).length
        expect(await claimsPage.Filter_ClaimsPortal.RowCount()).toBe(expectedRows)
      })

      test('Claim Filters - Verify Contact Selection Filters', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)
        const claimsPage = new ClaimsPortalClaimsPage(global)
        await claimsPage.NavigateToPage()

        // Expand and set the filter to an empty state
        await claimsPage.ClearAllFilters()

        // Verify FieldAgent filter
        await claimsPage.AddContactFilter(
          ClaimFilterFields.FieldAgent,
          ClaimFilterOperators.EqualTo,
          ClaimFilterSelectionOptions_FieldAgent.Redacted
        )
        await claimsPage.AddContactFilter(
          ClaimFilterFields.FieldAgent,
          ClaimFilterOperators.NotEqualTo,
          ClaimFilterSelectionOptions_FieldAgent.Test
        )

        // Verify Various Selection Fields
        // Verify Carrier filter
        await claimsPage.AddContactFilter(
          ClaimFilterFields.Carrier,
          ClaimFilterOperators.EqualTo,
          ClaimFilterSelectionOptions_Carrier.Carrier6
        )
        await claimsPage.AddContactFilter(
          ClaimFilterFields.Carrier,
          ClaimFilterOperators.NotEqualTo,
          ClaimFilterSelectionOptions_Carrier.Carrier1
        )

        // Verify Coordinator filter
        await claimsPage.AddContactFilter(
          ClaimFilterFields.Coordinator,
          ClaimFilterOperators.EqualTo,
          ClaimFilterSelectionOptions_Coordinator.BradPeterson
        )
        await claimsPage.AddContactFilter(
          ClaimFilterFields.Coordinator,
          ClaimFilterOperators.NotEqualTo,
          ClaimFilterSelectionOptions_Coordinator.Test
        )
      })

      test('Claim Filters - Verify Contact Filters exclude Inactive/include Removed', async ({
        browser,
      }) => {
        /// launch the Claims Portal home page
        const { global } = await Launch(browser, environment)
        const claimsPage = new ClaimsPortalClaimsPage(global)
        await claimsPage.NavigateToPage()
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)

        // Expand and set the filter to an empty state
        await claimsPage.ClearAllFilters()

        // Verify Field Agent filter does not display Inactive entry
        const inactiveFieldAgent = testClaim.testData.inactiveFieldAgent
        await claimsPage.Filter_ClaimsPortal.Button_AddFilter.Click()
        const index1 = (await claimsPage.Filter_ClaimsPortal.RowCount()) - 1
        await claimsPage.Filter_ClaimsPortal.SelectFilterField(index1, ClaimFilterFields.FieldAgent)
        await claimsPage.Filter_ClaimsPortal.SelectFilterOperator(index1, ClaimFilterOperators.EqualTo)
        const setLocator1 = claimsPage.page.locator(`#root input[role="combobox"]`).last()
        await setLocator1.click()
        const listLocator1OptionsTextContents = await claimsPage.page
          .locator('div[role="listbox"] > div[role="option"]')
          .allTextContents()
        expect(listLocator1OptionsTextContents.includes(inactiveFieldAgent)).toBe(false)
        await setLocator1.press('Enter')
        await claimsPage.ClearAllFilters()

        // Verify Contacts type filter does display Removed contacts
        const removedFieldAgent = testClaim.testData.removedFilterContact
        if (removedFieldAgent != '') {
          await claimsPage.Filter_ClaimsPortal.Button_AddFilter.Click()
          const index2 = (await claimsPage.Filter_ClaimsPortal.RowCount()) - 1
          await claimsPage.Filter_ClaimsPortal.SelectFilterField(index2, ClaimFilterFields.FieldAgent)
          await claimsPage.Filter_ClaimsPortal.SelectFilterOperator(index2, ClaimFilterOperators.EqualTo)
          const setLocator2 = claimsPage.page.locator(`#root input[role="combobox"]`).last()
          await setLocator2.click()
          const listLocator2OptionsTextContents = await claimsPage.page
            .locator('div[role="listbox"] > div[role="option"]')
            .allTextContents()
          expect(listLocator2OptionsTextContents.includes(removedFieldAgent)).toBe(true)
          await setLocator1.press('Enter')
          await claimsPage.ClearAllFilters()
        }
      })
    })

    test('Claim Filters - Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()

      // Verify the Assigned Claim Filters section exists and is collapsed
      await claimsPage.Filter_ClaimsPortal.parent.count()
      expect(await claimsPage.Filter_ClaimsPortal.IsVisible()).toBe(true)
      expect(await claimsPage.Filter_ClaimsPortal.IsExpanded()).toBe(false)

      // Verify the filters section can be expanded
      await claimsPage.Filter_ClaimsPortal.Button_ExpandFilter.Click()
      expect(await claimsPage.Filter_ClaimsPortal.IsExpanded()).toBe(true)

      // Verify there is a # Applied label next to the Assigned Claim Filters title that displays the number of applied filters
      const appliedFilterCount = await claimsPage.Filter_ClaimsPortal.AppliedFilterCount()
      await claimsPage.Filter_ClaimsPortal.VerifyFilterCountBadge(appliedFilterCount, BadgeTypes.Applied)

      // if 1 or more filter field entries are listed, row count will be > 0
      const filterCount = await claimsPage.Filter_ClaimsPortal.RowCount()
      if (filterCount == 0) {
        // If no filters exist, we should see an information label that says "Click the "Add Filter" button to get started with filtering claims."
        await claimsPage.Filter_ClaimsPortal.VerifyNoFilterAlert()
      }

      // Verify there is no Reset Filters button, but there is a Clear Filters button, a Add Filter+ button and a Save Filters Button
      expect(await claimsPage.Filter_ClaimsPortal.Button_ResetFilters.IsVisible()).toBe(false)
      expect(await claimsPage.Filter_ClaimsPortal.Button_ClearFilters.IsVisible()).toBe(true)
      expect(await claimsPage.Filter_ClaimsPortal.Button_AddFilter.IsVisible()).toBe(true)
      expect(await claimsPage.Filter_ClaimsPortal.Button_SaveFilters.IsVisible()).toBe(true)

      // Verify the filters section can be collapsed
      await claimsPage.Filter_ClaimsPortal.Button_CollapseFilter.Click()
      expect(await claimsPage.Filter_ClaimsPortal.IsExpanded()).toBe(false)
    })

    test('Claim Filters - Validate', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()

      // Expand and set the filter to an empty state
      await claimsPage.ClearAllFilters()

      // Validate Contact Field type of filter
      await claimsPage.Filter_ClaimsPortal.Button_AddFilter.Click()
      let index = (await claimsPage.Filter_ClaimsPortal.RowCount()) - 1
      await claimsPage.Filter_ClaimsPortal.SelectFilterField(index, ClaimFilterFields.Carrier)
      await claimsPage.Filter_ClaimsPortal.Button_SaveFilters.Click()
      expect(await claimsPage.Filter_ClaimsPortal.ValidateFilterCombobox(index)).toBe(true)

      // Validate Text Field type of filter
      await claimsPage.Filter_ClaimsPortal.Button_AddFilter.Click()
      index = (await claimsPage.Filter_ClaimsPortal.RowCount()) - 1
      await claimsPage.Filter_ClaimsPortal.SelectFilterField(index, ClaimFilterFields.CatCode)
      await claimsPage.Filter_ClaimsPortal.Button_SaveFilters.Click()
      expect(await claimsPage.Filter_ClaimsPortal.ValidateFilterInput(index)).toBe(true)

      // Validate Date Field type of filter
      await claimsPage.Filter_ClaimsPortal.Button_AddFilter.Click()
      index = (await claimsPage.Filter_ClaimsPortal.RowCount()) - 1
      await claimsPage.Filter_ClaimsPortal.SelectFilterField(index, ClaimFilterFields.DateReceived)
      await claimsPage.Filter_ClaimsPortal.SelectFilterField(index, ClaimFilterFields.DateReceived)
      await claimsPage.Filter_ClaimsPortal.SelectFilterOperator(index, ClaimFilterOperators_Date.Matches)
      await claimsPage.Filter_ClaimsPortal.Button_SaveFilters.Click()
      expect(await claimsPage.Filter_ClaimsPortal.ValidateFilterInput(index)).toBe(true)

      // Validate Boolean Field type of filter
      await claimsPage.Filter_ClaimsPortal.Button_AddFilter.Click()
      index = (await claimsPage.Filter_ClaimsPortal.RowCount()) - 1
      await claimsPage.Filter_ClaimsPortal.SelectFilterField(index, ClaimFilterFields.HasCatCode)
      await claimsPage.Filter_ClaimsPortal.Button_SaveFilters.Click()
      expect(await claimsPage.Filter_ClaimsPortal.ValidateFilterSelect(index)).toBe(true)
    })

    test('Claim Filters - Remove Filter', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()

      // Expand and set the filter to an empty state
      await claimsPage.ClearAllFilters()

      // Add a filter
      await claimsPage.AddClaimStatusFilter(
        ClaimFilterOperators.EqualTo,
        ClaimFilterSelectionOptions_ClaimStatus.CarrierReview
      )
      expect(await claimsPage.Filter_ClaimsPortal.RowCount()).toBe(1)

      // Remove the filter
      await claimsPage.Filter_ClaimsPortal.RemoveFilterAtIndex(0)
      expect(await claimsPage.Filter_ClaimsPortal.RowCount()).toBe(0)
    })

    test('ClaimsPortal Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const table = claimsPage.DataTable_ClaimsPortal

      // Click the Open Table Settings button on the ClaimsPortal Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await claimsPage.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('ClaimsPortal Table - Settings: Verify Columns', async ({ browser }) => {
        test.slow()

        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
        const claimsPage = new ClaimsPortalClaimsPage(global)
        await claimsPage.NavigateToPage()
        const table = claimsPage.DataTable_ClaimsPortal

        // Click the Open Table Settings button on the ClaimsPortal Table
        const tableSettingsDialog = await table.OpenTableSettings()
        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Users)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Users)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Coordinator)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Coordinator)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_FieldAgent)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_FieldAgent)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Policyholder)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Policyholder)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_PrimaryContact)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_PrimaryContact)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_ClaimNumber)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimNumber)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Phone)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Phone)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Email)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Email)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_ClaimStatus)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimStatus)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Carrier)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Carrier)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Tags)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Tags)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_LastEvent)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_LastEvent)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_InAssignQueue)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_InAssignQueue)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_DateReceived)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_DateReceived)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_LossDate)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_LossDate)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_InspectionScheduled)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_InspectionScheduled)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_InspectionCompleted)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_InspectionCompleted)).toBe(
          false
        )
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
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Users)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Users)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Coordinator)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Coordinator)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_FieldAgent)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_FieldAgent)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Policyholder)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Policyholder)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_PrimaryContact)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_PrimaryContact)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_ClaimNumber)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimNumber)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Phone)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Phone)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Email)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Email)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_ClaimStatus)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimStatus)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Carrier)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Carrier)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Tags)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Tags)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_LastEvent)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_LastEvent)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_InAssignQueue)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_InAssignQueue)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_DateReceived)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_DateReceived)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_LossDate)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_LossDate)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_InspectionScheduled)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_InspectionScheduled)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_InspectionCompleted)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_InspectionCompleted)).toBe(
          true
        )
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

      test('ClaimsPortal Table - Settings: Move Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
        const claimsPage = new ClaimsPortalClaimsPage(global)
        await claimsPage.NavigateToPage()
        const table = claimsPage.DataTable_ClaimsPortal

        // make sure all the columns we need are visible
        await claimsPage.ShowAllColumns()

        // Click the Open Table Settings button on the Jobs Table
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
        await claimsPage.Wait(2000) // give some time for things to percolate

        // Check the position of the moved column after we are done
        const firstColumnNameAfterMove = await table.FetchColumnNameByColumnIndex(2)
        const secondColumnNameAfterMove = await table.FetchColumnNameByColumnIndex(3)
        expect(firstColumnNameAfterMove).toBe(fourthCheckboxBefore)
        expect(secondColumnNameAfterMove).toBe(firstCheckboxBefore)
      })

      test('ClaimsPortal Table - Settings: Move Pinned Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
        const claimsPage = new ClaimsPortalClaimsPage(global)
        await claimsPage.NavigateToPage()
        const table = claimsPage.DataTable_ClaimsPortal

        // make sure all the columns we need are visible
        await claimsPage.ShowAllColumns()

        // choose columnType to pin: use Coordinator if it is not in the first column
        const coordinatorColumnIndex = await table.FetchColumnIndexByColumnType(
          DataTable_Columns_Type.Claims_Coordinator
        )
        const targetColumnTypeToTarget =
          coordinatorColumnIndex == 2
            ? DataTable_Columns_Type.Claims_Policyholder
            : DataTable_Columns_Type.Claims_Coordinator
        const targetColumnIndexBeforePin =
          await table.FetchColumnIndexByColumnType(targetColumnTypeToTarget)

        // Pin our target column
        await table.SetColumnPinState(targetColumnTypeToTarget, DataTable_Column_PinState.Pinned)
        // our target should be pinned to the first column now
        const targetColumnIndexAfterPin =
          await table.FetchColumnIndexByColumnType(targetColumnTypeToTarget)
        expect(targetColumnIndexAfterPin).toBe(2)

        // Click the Open Table Settings button on the Jobs Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // grab the names of the columns - this order does not reflected the pinned column order
        const firstColumnBeforeMove = await tableSettingsDialog.GetNthCheckboxName(0)
        const targetColumnBeforeMove = await tableSettingsDialog.GetNthCheckboxName(
          targetColumnIndexBeforePin - 2
        )

        // Drag our target column onto the first column
        await tableSettingsDialog.DragAndDropColumnByName(
          targetColumnBeforeMove,
          firstColumnBeforeMove
        )

        // grab the names of the columns after the drag and drop move
        const firstColumnAfterMove = await tableSettingsDialog.GetNthCheckboxName(0)
        const secondColumnAfterMove = await tableSettingsDialog.GetNthCheckboxName(1)

        // first column should be our target - now in first position, even after we unpin
        expect(firstColumnAfterMove).toBe(targetColumnBeforeMove)

        // second column should be be what used to be the first column
        expect(secondColumnAfterMove).toBe(firstColumnBeforeMove)

        await tableSettingsDialog.Close()

        // Verify our pinned target column index hasn't changed
        const targetColumnIndexAfterPinAndMove =
          await table.FetchColumnIndexByColumnType(targetColumnTypeToTarget)
        expect(targetColumnIndexAfterPinAndMove).toBe(2)

        // unpin the target column
        await table.SetColumnPinState(targetColumnTypeToTarget, DataTable_Column_PinState.Unpinned)

        // Check the position of the now unpinned target column after we are done
        // should be 1st column now, permanently
        const targetColumnIndexAfterMoveAndUnpin =
          await table.FetchColumnIndexByColumnType(targetColumnTypeToTarget)
        expect(targetColumnIndexAfterMoveAndUnpin).toBe(2)
      })

      test('ClaimsPortal Table - Pin Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
        const claimsPage = new ClaimsPortalClaimsPage(global)
        await claimsPage.NavigateToPage()
        const table = claimsPage.DataTable_ClaimsPortal

        // Expand and set the filter to an empty state
        await claimsPage.ClearAllFilters()

        // make sure all the columns we need are visible
        await claimsPage.ShowAllColumns()

        // Prove Tags column is not currently in the viewport before the pin
        expect(await table.IsColumnInViewPort(DataTable_Columns_Type.Claims_Tags)).toBe(false)
        const initialTagsPosition = await table.FetchColumnIndexByColumnType(
          DataTable_Columns_Type.Claims_Tags
        )

        // Choose the Tags column and click the Pin icon
        await table.SetColumnPinState(
          DataTable_Columns_Type.Claims_Tags,
          DataTable_Column_PinState.Pinned
        )

        // Verify that the column is now "pinned" left most and has a dark Pin Icon
        expect(await table.FetchColumnPinState(DataTable_Columns_Type.Claims_Tags)).toBe(
          DataTable_Column_PinState.Pinned
        )
        expect(await table.IsColumnInViewPort(DataTable_Columns_Type.Claims_Tags)).toBe(true)
        expect(await table.FetchColumnIndexByColumnType(DataTable_Columns_Type.Claims_Tags)).toBe(2)

        // Choose the State column and click the Pin icon
        const initialStatePosition = await table.FetchColumnIndexByColumnType(
          DataTable_Columns_Type.Claims_State
        )
        await table.SetColumnPinState(
          DataTable_Columns_Type.Claims_State,
          DataTable_Column_PinState.Pinned
        )

        // Verify that this column is also "pinned" but to the right of the previously pinned column
        expect(await table.FetchColumnPinState(DataTable_Columns_Type.Claims_State)).toBe(
          DataTable_Column_PinState.Pinned
        )
        expect(await table.IsColumnInViewPort(DataTable_Columns_Type.Claims_State)).toBe(true)
        expect(await table.FetchColumnIndexByColumnType(DataTable_Columns_Type.Claims_State)).toBe(
          3
        )

        // unpin State and verify it goes back to where it was
        await table.SetColumnPinState(
          DataTable_Columns_Type.Claims_State,
          DataTable_Column_PinState.Unpinned
        )
        expect(await table.FetchColumnPinState(DataTable_Columns_Type.Claims_State)).toBe(
          DataTable_Column_PinState.Unpinned
        )
        expect(await table.FetchColumnIndexByColumnType(DataTable_Columns_Type.Claims_State)).toBe(
          initialStatePosition
        )

        // unpin Tags and verify it goes back to where it was
        await table.SetColumnPinState(
          DataTable_Columns_Type.Claims_Tags,
          DataTable_Column_PinState.Unpinned
        )
        expect(await table.FetchColumnPinState(DataTable_Columns_Type.Claims_Tags)).toBe(
          DataTable_Column_PinState.Unpinned
        )
        expect(await table.FetchColumnIndexByColumnType(DataTable_Columns_Type.Claims_Tags)).toBe(
          initialTagsPosition
        )
      })

      test('ClaimsPortal Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
        const claimsPage = new ClaimsPortalClaimsPage(global)
        await claimsPage.NavigateToPage()
        const table = claimsPage.DataTable_ClaimsPortal

        // make sure all the columns we need are visible
        await claimsPage.ShowAllColumns()

        // Examine Coordinator and ClaimNumber columns
        // Verify initial states are unsorted
        const initialClaimNumberSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_ClaimNumber
        )
        const initialCoordinatorSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator
        )
        expect(initialClaimNumberSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialCoordinatorSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the ClaimNumber column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Claims_ClaimNumber,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify ClaimNumber is sorted Down and Coordinator is still unsorted
        let currentClaimNumberSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_ClaimNumber
        )
        let currentCoordinatorSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator
        )
        expect(currentClaimNumberSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentCoordinatorSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Coordinator column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify ClaimNumber is now unsorted and Coordinator is sorted Up
        currentClaimNumberSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_ClaimNumber
        )
        currentCoordinatorSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator
        )
        expect(currentClaimNumberSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentCoordinatorSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Coordinator column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator,
          DataTable_Column_SortState.Unsorted
        )
        currentCoordinatorSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator
        )
        expect(currentCoordinatorSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Verify Tags and Users cannot be sorted
        const currentTagsSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Tags
        )
        const currentUsersSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Users
        )
        expect(currentTagsSortState).toBe(DataTable_Column_SortState.NotSortable)
        expect(currentUsersSortState).toBe(DataTable_Column_SortState.NotSortable)
      })
    })

    test('ClaimsPortal Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const table = claimsPage.DataTable_ClaimsPortal

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

    test('ClaimsPortal Table - Verify Action Menu: Open Claim', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const table = claimsPage.DataTable_ClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimsTableMessage)
        return
      }

      // make sure all the columns we need are visible
      await claimsPage.ShowAllColumns()

      // grab the target claim number
      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
      const targetClaimNumber = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Claims_ClaimNumber
      )

      // open the claim
      await claimsPage.SelectActionMenuItem(rowIndex, Claims_DataTable_ActionMenuItems.OpenClaim)

      // verify we navigated to the claim page of the target
      expect(claimsPage.page.url().endsWith(`claims/${targetClaimNumber}/info`)).toBe(true)
    })

    test('ClaimsPortal Table - Verify Action Menu: Copy Claim Number', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const table = claimsPage.DataTable_ClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimsTableMessage)
        return
      }

      // make sure all the columns we need are visible
      await claimsPage.ShowAllColumns()

      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
      const targetClaimNumber = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Claims_ClaimNumber
      )
      await claimsPage.SelectActionMenuItem(
        rowIndex,
        Claims_DataTable_ActionMenuItems.CopyClaimNumber
      )
      const copiedClaimNumber = await claimsPage.GetClipboardText()

      // Verify clipboard contains the claimNumber
      expect(targetClaimNumber).toBe(copiedClaimNumber)
    })

    test('ClaimsPortal Table - Copy Claim Number (clipboard icon)', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const table = claimsPage.DataTable_ClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimsTableMessage)
        return
      }

      // make sure all the columns we need are visible
      await claimsPage.ShowAllColumns()

      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
      const targetClaimNumber = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Claims_ClaimNumber
      )
      await table.ClickButtonInDataCell(rowIndex, DataTable_Columns_Type.Claims_ClaimNumber)
      const copiedClaimNumber = await claimsPage.GetClipboardText()

      // Verify clipboard contains the claimNumber
      expect(targetClaimNumber).toBe(copiedClaimNumber)
    })

    test('ClaimsPortal Table - Verify Claim Number/Link button', async ({ browser }) => {
      test.slow()

      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const table = claimsPage.DataTable_ClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimsTableMessage)
        return
      }

      // make sure all the columns we need are visible
      await claimsPage.ShowAllColumns()

      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
      const targetClaimNumber = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Claims_ClaimNumber
      )
      await table.ClickLinkInDataCell(rowIndex, DataTable_Columns_Type.Claims_ClaimNumber)

      // verify we navigated to the claim page of the target
      expect(claimsPage.page.url().endsWith(`claims/${targetClaimNumber}/info`)).toBe(true)
    })

    test('ClaimsPortal Table - Selection', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const table = claimsPage.DataTable_ClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimsTableMessage)
        return
      }

      // Expand and set the filter to an empty state
      await claimsPage.ClearAllFilters()

      const pageInfo = await table.GetPageInfo()

      // Check the selection checkbox of any claim row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.SelectRowByIndex(rowIndex, true)

      // Verify action buttons appear above the table: (Assign Contact/Add Tags)
      expect(await table.Button_Selection_AssignContact.IsVisible()).toBe(true)
      expect(await table.Button_Selection_AddTags.IsVisible()).toBe(true)

      // Verify that selection count bubble appears top left of the table with count of 1
      let visibleSelectedRowCount = await table.VisibleSelectedRowCount()
      let selectionBadgeCount = await table.SelectionBadgeCount()
      expect(visibleSelectedRowCount).toBe(selectionBadgeCount)

      await table.CancelRowSelection()

      // Check the selection checkbox at the top of the selection column
      await table.SelectAllVisibleRows(true)

      // Verify action buttons appear above the table: (Assign Contact/Add Tags)
      expect(await table.Button_Selection_AssignContact.IsVisible()).toBe(true)
      expect(await table.Button_Selection_AddTags.IsVisible()).toBe(true)

      // Verify that all the claim selection checkboxes on the page are checked
      visibleSelectedRowCount = await table.VisibleSelectedRowCount()
      expect(visibleSelectedRowCount).toBe(pageInfo.currentPageRowCount)

      // Verify that selection count bubble appears top left of the table with correct count
      selectionBadgeCount = await table.SelectionBadgeCount()
      expect(visibleSelectedRowCount).toBe(selectionBadgeCount)

      // Uncheck the selection checkbox at the top of the selection column
      await table.SelectAllVisibleRows(false)

      // Verify that all the claim selection checkboxes on the page are not longer checked
      const rowsSelected = await table.VisibleSelectedRowCount()
      expect(rowsSelected).toBe(0)

      // Verify action buttons no longer appear above the table
      expect(await table.Button_Selection_AssignContact.IsVisible()).toBe(false)
      expect(await table.Button_Selection_AddTags.IsVisible()).toBe(false)

      // Verify the selection badge is not visible
      expect(await table.selectionBadgeLocator.isVisible()).toBe(false)
    })

    test('ClaimsPortal Table - Assign <Contact> Dialog - Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const table = claimsPage.DataTable_ClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimsTableMessage)
        return
      }

      // Check the selection checkbox of any claim row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.SelectRowByIndex(rowIndex, true)

      // Verify required action button appears above the table
      expect(await table.Button_Selection_AssignContact.IsVisible()).toBe(true)

      // Click the Assign Contact Button and choose a contact type from the menu
      let assignContactDialog = await table.OpenAssignContact(ClaimAssignContactOptions.Coordinator)

      // Verify the Assign <Contact> dialog - Heading is "Assign <Contact>" where <Contact> is the menu selection
      await assignContactDialog.VerifyTitle()

      // Verify Assign <Contact> dialog - closes with click on "X" button
      await assignContactDialog.Close()
      await expect(assignContactDialog.Title.locator).not.toBeAttached()
      await claimsPage.page.waitForTimeout(1000)

      // Verify Assign <Contact> dialog - closes with ESC key
      assignContactDialog = await table.OpenAssignContact(ClaimAssignContactOptions.FieldAgent)
      await assignContactDialog.Close(true)
      await expect(assignContactDialog.Title.locator).not.toBeAttached()
      await claimsPage.page.waitForTimeout(1000)
    })

    test('ClaimsPortal Table - Assign <Contact> Dialog - Validate', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const table = claimsPage.DataTable_ClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimsTableMessage)
        return
      }

      // Check the selection checkbox of any claim row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.SelectRowByIndex(rowIndex, true)

      // Verify action buttons appear above the table: (Assign Contact/Add Tags/Add Timeline Event)
      expect(await table.Button_Selection_AssignContact.IsVisible()).toBe(true)

      // Click the Assign Contact Button and choose a contact type from the menu
      const assignContactDialog = await table.OpenAssignContact(
        ClaimAssignContactOptions.Coordinator
      )

      // Click the Submit button without choose a contact
      await assignContactDialog.Button_Submit.Click()

      // Validate the dialog error handling
      await assignContactDialog.Validate()
    })

    test('ClaimsPortal Table - Add Tags Dialog - Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const table = claimsPage.DataTable_ClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimsTableMessage)
        return
      }

      // Check the selection checkbox of any claim row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.SelectRowByIndex(rowIndex, true)

      // Verify required action button appears above the table:
      expect(await table.Button_Selection_AddTags.IsVisible()).toBe(true)

      // Click the Add Tags Button
      let addTagsDialog = await table.OpenAddTags()

      // Verify the Add Tags dialog title
      await addTagsDialog.VerifyTitle()

      // Verify Add Tags dialog - closes with click on "X" button
      await addTagsDialog.Close()
      await expect(addTagsDialog.Title.locator).not.toBeAttached()
      await claimsPage.page.waitForTimeout(1000)

      // Verify Add Tags dialog - closes with ESC key
      addTagsDialog = await table.OpenAddTags()
      await addTagsDialog.Close(true)
      await expect(addTagsDialog.Title.locator).not.toBeAttached()
      await claimsPage.page.waitForTimeout(1000)

      // Verify fields can be set
      addTagsDialog = await table.OpenAddTags()
      await addTagsDialog.SetKeyValue('Hello, my name is')
      expect(await addTagsDialog.GetKeyValue()).toBe('Hello, my name is')
      await addTagsDialog.SetValueValue('Slim Shady')
      expect(await addTagsDialog.GetValueValue()).toBe('Slim Shady')
      await addTagsDialog.SetColor('#A0A0A0')
      expect(await addTagsDialog.GetColorValue()).toBe('#A0A0A0')

      // Verify Key and Value can be cleared
      await addTagsDialog.ClearValue()
      expect(await addTagsDialog.GetValueValue()).toBe('')
      await addTagsDialog.ClearKey()
      expect(await addTagsDialog.GetKeyValue()).toBe('')
    })

    test('ClaimsPortal Table - Add Tags Dialog - Validate', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const table = claimsPage.DataTable_ClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimsTableMessage)
        return
      }

      // Check the selection checkbox of any claim row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.SelectRowByIndex(rowIndex, true)

      // Verify required action button appears above the table:
      expect(await table.Button_Selection_AddTags.IsVisible()).toBe(true)

      // Click the Add Tags Button
      const addTagsDialog = await table.OpenAddTags()

      // Click the Add & Close
      await addTagsDialog.Button_AddAndClose.Click()

      // Validate the dialog
      await addTagsDialog.Validate()
    })

    test('ClaimsPortal Table - Add/Remove Tag', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const table = claimsPage.DataTable_ClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimsTableMessage)
        return
      }

      // make sure all the columns we need are visible
      await claimsPage.ShowAllColumns()

      // Check the selection checkbox of any claim row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.SelectRowByIndex(rowIndex, true)

      // if our test tag already exists on this claim, remove it
      const testTag = 'AutomatedTestTag'
      const testTagValue = 'TestValue'
      const testTagColor = '#C8C800'
      const tagExists = await table.TagIsAddedByIndex(rowIndex, testTag)
      if (tagExists) {
        await table.RemoveTagWithValueByIndex(rowIndex, testTag, testTagValue)
      }

      // add the test tag
      await table.AddTag(testTag, testTagValue, testTagColor)

      // tag should exist now
      expect(await table.TagWithValueIsAddedByIndex(rowIndex, testTag, testTagValue)).toBe(true)
      // remove the test tag
      await table.RemoveTagWithValueByIndex(rowIndex, testTag, testTagValue)
      // tag should not exist now
      expect(await table.TagWithValueIsAddedByIndex(rowIndex, testTag, testTagValue)).toBe(false)
    })

    test('ClaimsPortal Table - Pagination: Show List', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const table = claimsPage.DataTable_ClaimsPortal

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
        await claimsPage.page.waitForTimeout(1000)
        const pageData = await table.GetPageInfo()
        if (pageData.maxPage == 1) {
          expect(pageData.currentPageRowCount).toBeLessThanOrEqual(pageSize)
        } else {
          expect(pageData.currentPageRowCount).toBe(pageSize)
        }
      }
    })

    test('ClaimsPortal Table - Pagination: Navigation Buttons', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const table = claimsPage.DataTable_ClaimsPortal

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await claimsPage.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage == 1).toBe(true)

      // make sure we are on the first page
      if (await table.Button_GoToFirstPage.IsEnabled()) {
        await table.Button_GoToFirstPage.Click()
        await claimsPage.page.waitForTimeout(1000)
      }
      // Verify the First and Previous buttons are disabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(false)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)

      await table.Button_GoToNextPage.Click()
      await claimsPage.page.waitForTimeout(1000)
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
      await claimsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // Verify the First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(true)
      // Verify the Next and Last buttons are disabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(false)

      await table.Button_GoToPreviousPage.Click()
      await claimsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // If we are not on the first page, verify First and Previous buttons are disabled
      // If we are on the first page, verify First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      expect(await table.Button_GoToFirstPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)
    })

    test('ClaimsPortal Table - Pagination: Go To Page', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const table = claimsPage.DataTable_ClaimsPortal

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await claimsPage.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      //If the table is <= 10 tags, we cannot perform this test
      if (pageData.maxPage == 1) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }
      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage).toBe(1)

      // Check Last Page
      await table.Pagination_GotoPage(lastPage)
      await claimsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display Y of Y where Y is the max page ie 3 of 3
      expect(pageData.currentPage).toBe(lastPage)

      // Check First Page
      await table.Pagination_GotoPage(1)
      await claimsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display 1 of Y where Y is the max page ie 1 of 3
      expect(pageData.currentPage).toBe(1)

      // if Max Pages are > 2, test an intermediate number
      if (lastPage > 2) {
        // Check random middle page
        const randomPage = Math.floor(Math.random() * (lastPage - 2) + 2)
        await table.Pagination_GotoPage(randomPage)
        await claimsPage.page.waitForTimeout(1000)
        pageData = await table.GetPageInfo()

        //Verify we display X of Y where Y is the max page and X is the Random page ie 4 of 7
        expect(pageData.currentPage).toBe(randomPage)
      }
    })

    test('Create Claim Page - Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()

      const createClaimPage = await claimsPage.OpenCreateClaimPage()

      // Verify page heading is "Create a Claim"
      await createClaimPage.VerifyTitle()

      // Verify Claim Details section
      await createClaimPage.Label_ClaimDetails_Title.VerifyExpectedText()
      await expect(createClaimPage.Textbox_CarrierClaimNumber.locator).toBeAttached()
      await expect(createClaimPage.Textbox_PolicyNumber.locator).toBeAttached()
      await expect(createClaimPage.ListBox_Carrier.locator).toBeAttached()
      await expect(createClaimPage.ListBox_ClaimFactors.locator).toBeAttached()

      // Verify Loss Details section
      await createClaimPage.Label_LossDetails_Title.VerifyExpectedText()
      await expect(createClaimPage.Textbox_DateOfLoss.locator).toBeAttached()
      await expect(createClaimPage.Textbox_DateReceived.locator).toBeAttached()
      await expect(createClaimPage.Textbox_CatCode.locator).toBeAttached()
      await expect(createClaimPage.ListBox_LossType.locator).toBeAttached()
      await expect(createClaimPage.ListBox_Severity.locator).toBeAttached()
      await expect(createClaimPage.TextArea_LossDescription.locator).toBeAttached()

      // Verify Loss Location section
      await createClaimPage.Label_LossLocation_Title.VerifyExpectedText()
      await expect(createClaimPage.Textbox_AddressLine1.locator).toBeAttached()
      await expect(createClaimPage.Textbox_AddressLine2.locator).toBeAttached()
      await expect(createClaimPage.Textbox_AddressLine3.locator).toBeAttached()
      await expect(createClaimPage.Textbox_CatCode.locator).toBeAttached()
      await expect(createClaimPage.ListBox_State.locator).toBeAttached()
      await expect(createClaimPage.Textbox_Zip.locator).toBeAttached()
      await expect(createClaimPage.Textbox_County.locator).toBeAttached()
      await expect(createClaimPage.ListBox_Country.locator).toBeAttached()

      // Verify Actions section
      await createClaimPage.Label_Actions_Title.VerifyExpectedText()
      await expect(createClaimPage.ListBox_InitialClaimActions.locator).toBeAttached()

      // Verify Submit button
      await expect(createClaimPage.Button_Submit.locator).toBeAttached()

      // Verify Loss type is initially disabled and then enables once Carrier is selected
      await expect(createClaimPage.ListBox_LossType.locator).toBeDisabled()
      await createClaimPage.SelectCarrier(`Universal - ClaimsPortal`)
      await expect(createClaimPage.ListBox_LossType.locator).toBeEnabled()
    })

    test('Create Claim Page - Verify Claim Factors functionality', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()

      const createClaimPage = await claimsPage.OpenCreateClaimPage()

      const claimFactor1 = 'Sinkhole'
      const claimFactor2 = 'Bodily Injury'

      // add a claim factor to the selected list
      await createClaimPage.AddClaimFactorToSelection(claimFactor1)
      // Verify it is selected and removable (has an X button)
      expect(await createClaimPage.IsClaimFactorSelectable(claimFactor1)).toBe(false)
      // Verify the list no longer contains that factor as a choice
      expect(await createClaimPage.IsClaimFactorRemoveable(claimFactor1)).toBe(true)

      // add a second claim factor to the selected list
      await createClaimPage.AddClaimFactorToSelection(claimFactor2)
      // Verify the first claim factor is still there
      expect(await createClaimPage.IsClaimFactorSelectable(claimFactor2)).toBe(false)
      // Verify the second clam factor is also selected and removable (has an X button)
      expect(await createClaimPage.IsClaimFactorSelectable(claimFactor2)).toBe(false)
      // Verify the list no longer contains that 2nd factor as a choice
      expect(await createClaimPage.IsClaimFactorRemoveable(claimFactor2)).toBe(true)

      // Remove the first claim factor only
      await createClaimPage.RemoveSelectedClaimFactor(claimFactor1)
      // Make sure it is not in the selected section
      expect(await createClaimPage.IsClaimFactorRemoveable(claimFactor1)).toBe(false)
      // Make sure it is back in the selection list
      expect(await createClaimPage.IsClaimFactorSelectable(claimFactor1)).toBe(true)

      // Clear the remaining claim factor with the clear selection button (larger X)
      await createClaimPage.Button_ClearSelection.Click()
      // Make sure it is not in the selected section
      expect(await createClaimPage.IsClaimFactorRemoveable(claimFactor2)).toBe(false)
      // Make sure it is back in the selection list
      expect(await createClaimPage.IsClaimFactorSelectable(claimFactor2)).toBe(true)
    })

    test('Create Claim Page - Verify Claim Actions functionality', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()

      const createClaimPage = await claimsPage.OpenCreateClaimPage()

      const claimAction1 = 'Requires Roof Tarping'
      const claimAction2 = 'Requires Emergency Board Up'

      // add a claim action to the selected list
      await createClaimPage.AddClaimActionToSelection(claimAction1)
      // Verify it is selected and removable (has an X button)
      expect(await createClaimPage.IsClaimActionSelectable(claimAction1)).toBe(false)
      // Verify the list no longer contains that factor as a choice
      expect(await createClaimPage.IsClaimActionRemoveable(claimAction1)).toBe(true)

      // add a second claim action to the selected list
      await createClaimPage.AddClaimActionToSelection(claimAction2)
      // Verify the first claim action is still there
      expect(await createClaimPage.IsClaimActionSelectable(claimAction2)).toBe(false)
      // Verify the second clam factor is also selected and removable (has an X button)
      expect(await createClaimPage.IsClaimActionSelectable(claimAction2)).toBe(false)
      // Verify the list no longer contains that 2nd factor as a choice
      expect(await createClaimPage.IsClaimActionRemoveable(claimAction2)).toBe(true)

      // Remove the first claim action only
      await createClaimPage.RemoveSelectedClaimAction(claimAction1)
      // Make sure it is not in the selected section
      expect(await createClaimPage.IsClaimActionRemoveable(claimAction1)).toBe(false)
      // Make sure it is back in the selection list
      expect(await createClaimPage.IsClaimActionSelectable(claimAction1)).toBe(true)

      // Clear the remaining claim action with the clear selection button (larger X)
      await createClaimPage.Button_ClearSelection.Click()
      // Make sure it is not in the selected section
      expect(await createClaimPage.IsClaimActionRemoveable(claimAction2)).toBe(false)
      // Make sure it is back in the selection list
      expect(await createClaimPage.IsClaimActionSelectable(claimAction2)).toBe(true)
    })

    test('Create Claim Page - Validate', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal Page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()

      const createClaimPage = await claimsPage.OpenCreateClaimPage()
      await createClaimPage.Button_Submit.Click()
      expect(await createClaimPage.ValidateClaimDetails()).toBe(true)
      await createClaimPage.Textbox_DateReceived.locator.clear()
      expect(await createClaimPage.ValidateLossDetails()).toBe(true)
      expect(await createClaimPage.ValidateLossLocation()).toBe(true)

      const dateOfLossMax =
        (await createClaimPage.Textbox_DateOfLoss.locator.getAttribute('max')) ?? ''
      const dateReceivedMax =
        (await createClaimPage.Textbox_DateOfLoss.locator.getAttribute('max')) ?? ''
      const maxDateOfLoss = new Date(dateOfLossMax)
      const maxDateReceived = new Date(dateReceivedMax)

      const tooNewDateOfLoss = new Date(maxDateOfLoss.setDate(maxDateOfLoss.getDate() + 2))
        .toISOString()
        .slice(0, 16)
      await createClaimPage.Textbox_DateOfLoss.locator.fill(tooNewDateOfLoss)
      const tooNewDateReceived = new Date(maxDateReceived.setDate(maxDateReceived.getDate() + 2))
        .toISOString()
        .slice(0, 16)
      await createClaimPage.Textbox_DateReceived.locator.fill(tooNewDateReceived)
      await createClaimPage.Button_Submit.Click()
      expect(await createClaimPage.ValidateDatesTooNew()).toBe(true)

      const todayForDateOfLoss = new Date()
      const todayForDateReceived = new Date()
      const lastWeekDateOfLoss = new Date(
        todayForDateOfLoss.setDate(todayForDateOfLoss.getDate() - 7)
      )
        .toISOString()
        .slice(0, 16)
      const olderDateReceived = new Date(
        todayForDateReceived.setDate(todayForDateReceived.getDate() - 9)
      )
        .toISOString()
        .slice(0, 16)
      await createClaimPage.Textbox_DateOfLoss.locator.fill(lastWeekDateOfLoss)
      await createClaimPage.Textbox_DateReceived.locator.fill(olderDateReceived)
      await createClaimPage.Button_Submit.Click()
      expect(await createClaimPage.ValidateDateReceivedAfterDateOfLoss()).toBe(true)

      // Verify zip character count
      const invalidZipLengthList = {
        invalidZipcodeEmpty: '',
        invalidZipcodeAlphaShort: 'a',
        invalidZipcodeAlphaLong: 'abcdefefefas',
        invalidZipcodeMixedShort: 'a12',
        invalidZipcodeMixedLong: '12345abc',
        invalidZipcodeNumeric: '1234',
        invalidZipcodeNumericLong: '123456',
      }
      for (const zipKey in Object.keys(invalidZipLengthList)) {
        const zipVariant = Object.values(invalidZipLengthList)[zipKey]
        await createClaimPage.Textbox_Zip.locator.focus()
        await createClaimPage.Textbox_Zip.locator.fill(zipVariant)
        await createClaimPage.Button_Submit.Click()
        expect(await createClaimPage.ValidateZipCharacterCount()).toBe(true)
      }

      // Verify zip character content
      const invalidZipContentList = {
        invalidZipcode5StartsAlpha: 'a2345',
        invalidZipcode5ContainsAlpha: '123a5',
        invalidZipcode5EndsAlpha: '1234b',
        invalidZipcode5ContainsHash: '123#5',
        invalidZipcode5ContainsPoint: '123.5',
        invalidZipcode5StartsPoint: '.2345',
        invalidZipcode5EndsE: '1234e',
        invalidZipcodeContainsSpace: '123 4',
      }
      for (const zipKey in Object.keys(invalidZipContentList)) {
        const zipVariant = Object.values(invalidZipContentList)[zipKey]
        await createClaimPage.Textbox_Zip.locator.focus()
        await createClaimPage.Textbox_Zip.locator.fill(zipVariant)
        await createClaimPage.Button_Submit.Click()
        expect(await createClaimPage.ValidateZipCharacterContent()).toBe(true)
      }
    })
  }
)
