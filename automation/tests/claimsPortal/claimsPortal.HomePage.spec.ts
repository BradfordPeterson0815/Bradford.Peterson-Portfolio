import { expect } from '@playwright/test'
import {
  AbortErrors,
  BadgeTypes,
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
  HomePageStrings,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalHomePage } from '../../library/claimsPortal/pages/claimsPortalHomePage.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'

const environment = DefaultEnvironment

test.describe(
  'Home Page - ClaimsPortal User',
  {
    tag: [Tags.ClaimsPortal, Tags.HomePage],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()

      // Verify page layout
      await homePage.VerifyTitle()
      await homePage.Filter_AssignedClaimsPortal.VerifyTitle()
      const tableAssignedClaimsPortal = homePage.DataTable_YourAssignedClaimsPortal
      const tableUnassignedClaimsPortal = homePage.DataTable_UnassignedClaimsPortal

      // Verify that there is both a Your Assigned ClaimsPortal table and UnassClaimsPortalClaimsPortal table
      expect(await tableAssignedClaimsPortal.IsVisible()).toBe(true)
      expect(await tableUnassignedClaimsPortal.IsVisible()).toBe(true)

      // Verify Your Assigned ClaimsPortal Table layout...
      // Verify Your Assigned ClaimsPortal Column Settings / Expand button
      expect(await tableAssignedClaimsPortal.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await tableAssignedClaimsPortal.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await tableAssignedClaimsPortal.Button_CloseTable.IsVisible()).toBe(false)

      // Verify Your Assigned ClaimsPortal Badge count
      await tableAssignedClaimsPortal.VerifyBadge(BadgeTypes.TotalClaims)

      // Verify Unassigned ClaimsPortal Table layout...
      // Verify All/Coordinator Review buttons
      expect(await homePage.Button_Radio_All.IsChecked()).toBe(true)
      expect(await homePage.Button_Radio_CoordinatorReview.IsChecked()).toBe(false)

      // Verify Uassigned ClaimsPortal Column Settings / Expand button
      expect(await tableUnassignedClaimsPortal.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await tableUnassignedClaimsPortal.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await tableUnassignedClaimsPortal.Button_CloseTable.IsVisible()).toBe(false)

      // Verify Uassigned ClaimsPortal Badge
      await tableUnassignedClaimsPortal.VerifyBadge(BadgeTypes.TotalClaims)
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()

      // Verify that there is no Greeting UI section
      expect(await homePage.Label_Admin_Welcome.IsVisible()).toBe(false)

      // Verify page layout
      await homePage.VerifyTitle()
      await homePage.Filter_AssignedClaimsPortal.VerifyTitle()
      const tableAssignedClaimsPortal = homePage.DataTable_YourAssignedClaimsPortal
      const tableUnassignedClaimsPortal = homePage.DataTable_UnassignedClaimsPortal

      // Verify that there is both a Your Assigned ClaimsPortal table and UnassClaimsPortalClaimsPortal table
      expect(await tableAssignedClaimsPortal.IsVisible()).toBe(true)
      expect(await tableUnassignedClaimsPortal.IsVisible()).toBe(true)

      // Verify Your Assigned ClaimsPortal Table layout...
      // Verify Your Assigned ClaimsPortal Column Settings / Expand button
      expect(await tableAssignedClaimsPortal.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await tableAssignedClaimsPortal.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await tableAssignedClaimsPortal.Button_CloseTable.IsVisible()).toBe(false)

      // Verify Your Assigned ClaimsPortal Badge count
      await tableAssignedClaimsPortal.VerifyBadge(BadgeTypes.TotalClaims)

      // Verify Unassigned ClaimsPortal Table layout...
      // Verify All/Coordinator Review buttons
      expect(await homePage.Button_Radio_All.IsChecked()).toBe(true)
      expect(await homePage.Button_Radio_CoordinatorReview.IsChecked()).toBe(false)

      // Verify Uassigned ClaimsPortal Column Settings / Expand button
      expect(await tableUnassignedClaimsPortal.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await tableUnassignedClaimsPortal.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await tableUnassignedClaimsPortal.Button_CloseTable.IsVisible()).toBe(false)

      // Verify Uassigned ClaimsPortal Badge
      await tableUnassignedClaimsPortal.VerifyBadge(BadgeTypes.TotalClaims)
    })

    test('Assigned Claim Filters - Verify UI', async ({ browser }) => {
      // launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()

      // Verify the Assigned Claim Filters section exists and is collapsed
      expect(await homePage.Filter_AssignedClaimsPortal.IsVisible()).toBe(true)
      expect(await homePage.Filter_AssignedClaimsPortal.IsExpanded()).toBe(false)

      // Verify the filter section can be expanded
      await homePage.Filter_AssignedClaimsPortal.Button_ExpandFilter.Click()
      expect(await homePage.Filter_AssignedClaimsPortal.IsExpanded()).toBe(true)
      //await homePage.Filter_AssignedClaimsPortal.SpecialAlert.locator.waitFor({ state: 'visible' })

      // Verify there is a # Applied label next to the Assigned Claim Filters title that displays the number of applied filters
      const appliedFilterCount = await homePage.Filter_AssignedClaimsPortal.AppliedFilterCount()
      await homePage.Filter_AssignedClaimsPortal.VerifyFilterCountBadge(
        appliedFilterCount,
        BadgeTypes.Applied
      )

      // Verify there is an information label that says "Assigned ClaimsPortal Filters will always include claims assigned to you."
      await homePage.Filter_AssignedClaimsPortal.VerifySpecialAlert(HomePageStrings.Alert_FiltersInclude)

      // if 1 or more filter field entries are listed, row count will be > 0
      const filterCount = await homePage.Filter_AssignedClaimsPortal.RowCount()
      if (filterCount == 0) {
        // If no filters exist, we should see an information label that says "Click the "Add Filter" button to get started with filtering claims."
        await homePage.Filter_AssignedClaimsPortal.VerifyNoFilterAlert()
      }

      // Verify there is a Reset Filters button, a Clear Filters button, Add Filter+ button and Save Filters Button
      expect(await homePage.Filter_AssignedClaimsPortal.Button_ResetFilters.IsVisible()).toBe(true)
      expect(await homePage.Filter_AssignedClaimsPortal.Button_ClearFilters.IsVisible()).toBe(true)
      expect(await homePage.Filter_AssignedClaimsPortal.Button_AddFilter.IsVisible()).toBe(true)
      expect(await homePage.Filter_AssignedClaimsPortal.Button_SaveFilters.IsVisible()).toBe(true)

      // Verify the filter section can be collapsed
      await homePage.Filter_AssignedClaimsPortal.Button_CollapseFilter.Click()
      expect(await homePage.Filter_AssignedClaimsPortal.IsExpanded()).toBe(false)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Assigned Claim Filters - Verify Text Filters', async ({ browser }) => {
        // launch the Claims Portal home pageClaimsPortalClaimsPortal User
        const { global } = await Launch(browser, environment)
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.NavigateToPage()

        // Expand and set the filter to an empty state
        await homePage.ClearAllFilters()

        // Verify Text Filter Fields
        for (const fieldKey in ClaimFilterFields_Text) {
          const fieldValue = ClaimFilterFields[fieldKey as keyof typeof ClaimFilterFields_Text]
          switch (fieldValue.toString()) {
            case ClaimFilterFields_Text.CatCode:
              await homePage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.EqualTo,
                'Cat Code 1'
              )
              await homePage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.NotEqualTo,
                'Cat Code 1'
              )
              break
            case ClaimFilterFields_Text.City:
              await homePage.AddTextFilter(fieldValue, ClaimFilterOperators_Text.Matches, 'Spokane')
              await homePage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.DoesNotMatch,
                'Tacoma'
              )
              break
            case ClaimFilterFields_Text.ClaimNumber:
              await homePage.AddTextFilter(fieldValue, ClaimFilterOperators_Text.Matches, 'CL-123')
              await homePage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.DoesNotMatch,
                'CL-456'
              )
              break
            case ClaimFilterFields_Text.County:
              await homePage.AddTextFilter(fieldValue, ClaimFilterOperators_Text.Matches, 'Spokane')
              await homePage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.DoesNotMatch,
                'King'
              )
              break
            case ClaimFilterFields_Text.PrimaryContactEmail:
              await homePage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.Matches,
                'fred@freddys.com'
              )
              await homePage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.DoesNotMatch,
                'jim@jimmys.com'
              )
              break
            case ClaimFilterFields_Text.PrimaryContactName:
              await homePage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.Matches,
                'Fred Savage'
              )
              await homePage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.DoesNotMatch,
                'Daniel Stern'
              )
              break
            case ClaimFilterFields_Text.PrimaryContactPhone:
              await homePage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.Matches,
                'Redacted'
              )
              await homePage.AddTextFilter(
                fieldValue,
                ClaimFilterOperators_Text.DoesNotMatch,
                '509-555-1212'
              )
              break
            case ClaimFilterFields_Text.State:
              await homePage.AddTextFilter(fieldValue, ClaimFilterOperators_Text.Matches, 'WA')
              await homePage.AddTextFilter(fieldValue, ClaimFilterOperators_Text.DoesNotMatch, 'OR')
              break
            default:
              throw new Error(`No Text Filter case is defined for: ${fieldValue}`)
          }
        }
      })

      test('Assigned Claim Filters - Verify Boolean Filters', async ({ browser }) => {
        // launch the Claims Portal home pageClaimsPortalClaimsPortal User
        const { global } = await Launch(browser, environment)
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.NavigateToPage()

        // Expand and set the filter to an empty state
        await homePage.ClearAllFilters()

        // Verify Boolean Filter Fields
        for (const fieldKey in ClaimFilterFields_Boolean) {
          const fieldValue = ClaimFilterFields[fieldKey as keyof typeof ClaimFilterFields_Boolean]
          switch (fieldValue.toString()) {
            case ClaimFilterFields_Boolean.HasCatCode:
            case ClaimFilterFields_Boolean.HasCoordinator:
            case ClaimFilterFields_Boolean.HasFieldAgent:
              await homePage.AddBooleanFilter(
                fieldValue,
                ClaimFilterOperators_Boolean.Is,
                ClaimFilterSelectionOptions_Boolean.True
              )
              await homePage.AddBooleanFilter(
                fieldValue,
                ClaimFilterOperators_Boolean.Is,
                ClaimFilterSelectionOptions_Boolean.False
              )
              break
            case ClaimFilterFields_Boolean.HasLegalRep:
            case ClaimFilterFields_Boolean.HasJob:
            case ClaimFilterFields_Boolean.IsReadOnly:
              await homePage.AddBooleanFilter(
                fieldValue,
                ClaimFilterOperators_Boolean.EqualTo,
                ClaimFilterSelectionOptions_Boolean.True
              )
              await homePage.AddBooleanFilter(
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

      test('Assigned Claim Filters - Verify Date Filters', async ({ browser }) => {
        test.slow()

        // launch the Claims Portal home pageClaimsPortalClaimsPortal User
        const { global } = await Launch(browser, environment)
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.NavigateToPage()

        // Expand and set the filter to an empty state
        await homePage.ClearAllFilters()

        // Verify Date Filter Fields
        for (const fieldKey in ClaimFilterFields_Date) {
          const fieldValue = ClaimFilterFields[fieldKey as keyof typeof ClaimFilterFields]
          switch (fieldValue.toString()) {
            case ClaimFilterFields_Date.DateReceived:
            case ClaimFilterFields_Date.InAssignQueue:
            case ClaimFilterFields_Date.InspectionScheduled:
            case ClaimFilterFields_Date.InspectionCompleted:
            case ClaimFilterFields_Date.JobContracted:
            case ClaimFilterFields_Date.JobNotSold:
            case ClaimFilterFields_Date.LossDate:
              await homePage.AddDateFilter(fieldValue, ClaimFilterOperators_Date.WithinTheLast, '5')
              await homePage.AddDateFilter(
                fieldValue,
                ClaimFilterOperators_Date.DoesNotMatch,
                '2024-01-01'
              )
              await homePage.AddDateFilter(
                fieldValue,
                ClaimFilterOperators_Date.Matches,
                '2024-01-01'
              )
              await homePage.AddDateFilter(
                fieldValue,
                ClaimFilterOperators_Date.GreaterThan,
                '2024-01-01'
              )
              await homePage.AddDateFilter(
                fieldValue,
                ClaimFilterOperators_Date.GreaterThanOrEqualTo,
                '2024-01-01'
              )
              await homePage.AddDateFilter(
                fieldValue,
                ClaimFilterOperators_Date.LessThan,
                '2024-01-01'
              )
              await homePage.AddDateFilter(
                fieldValue,
                ClaimFilterOperators_Date.LessThanOrEqualTo,
                '2024-01-01'
              )
              break
            default:
              throw new Error(`No Date Filter case is defined for: ${fieldValue}`)
          }
        }
      })

      test('Assigned Claim Filters - Verify Claim Status Filter', async ({ browser }) => {
        // launch the Claims Portal home pageClaimsPortalClaimsPortal User
        const { global } = await Launch(browser, environment)
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.NavigateToPage()

        // Expand and set the filter to an empty state
        await homePage.ClearAllFilters()

        // Verify Claim Status filter
        for (const fieldKey in ClaimFilterSelectionOptions_ClaimStatus) {
          const fieldValue =
            ClaimFilterSelectionOptions_ClaimStatus[
              fieldKey as keyof typeof ClaimFilterSelectionOptions_ClaimStatus
            ]
          const randomOperator = Math.random() < 0.5
          await homePage.AddClaimStatusFilter(
            randomOperator ? ClaimFilterOperators.EqualTo : ClaimFilterOperators.NotEqualTo,
            fieldValue
          )
        }
        const expectedRows = Object.keys(ClaimFilterSelectionOptions_ClaimStatus).length
        expect(await homePage.Filter_AssignedClaimsPortal.RowCount()).toBe(expectedRows)
      })

      test('Assigned Claim Filters - Verify Latest Timeline Event Filter', async ({ browser }) => {
        test.slow()

        // launch the Claims Portal home pageClaimsPortalClaimsPortal User
        const { global } = await Launch(browser, environment)
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.NavigateToPage()

        // Expand and set the filter to an empty state
        await homePage.ClearAllFilters()

        // Verify Latest Timeline Event filter
        for (const fieldKey in ClaimFilterSelectionOptions_LatestTimelineEvent) {
          const fieldValue = ClaimFilterSelectionOptions_LatestTimelineEvent[
            fieldKey as keyof typeof ClaimFilterSelectionOptions_LatestTimelineEvent
          ] as string
          const randomOperator = Math.random() < 0.5
          await homePage.AddLatestTimelineEventFilter(
            randomOperator ? ClaimFilterOperators.EqualTo : ClaimFilterOperators.NotEqualTo,
            fieldValue as ClaimFilterSelectionOptions_LatestTimelineEvent
          )
        }
        const expectedRows = Object.keys(ClaimFilterSelectionOptions_LatestTimelineEvent).length
        expect(await homePage.Filter_AssignedClaimsPortal.RowCount()).toBe(expectedRows)
      })

      test('Assigned Claim Filters - Verify Contact Selection Filters', async ({ browser }) => {
        // launch the Claims Portal home pageClaimsPortalClaimsPortal User
        const { global } = await Launch(browser, environment)
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.NavigateToPage()

        // Expand and set the filter to an empty state
        await homePage.ClearAllFilters()

        // Verify FieldAgent filter
        await homePage.AddContactFilter(
          ClaimFilterFields.FieldAgent,
          ClaimFilterOperators.EqualTo,
          ClaimFilterSelectionOptions_FieldAgent.Redacted
        )
        await homePage.AddContactFilter(
          ClaimFilterFields.FieldAgent,
          ClaimFilterOperators.NotEqualTo,
          ClaimFilterSelectionOptions_FieldAgent.Test
        )

        // Verify Various Selection Fields
        // Verify Carrier filter
        await homePage.AddContactFilter(
          ClaimFilterFields.Carrier,
          ClaimFilterOperators.EqualTo,
          ClaimFilterSelectionOptions_Carrier.Carrier6
        )
        await homePage.AddContactFilter(
          ClaimFilterFields.Carrier,
          ClaimFilterOperators.NotEqualTo,
          ClaimFilterSelectionOptions_Carrier.Carrier1
        )

        // Verify Coordinator filter
        await homePage.AddContactFilter(
          ClaimFilterFields.Coordinator,
          ClaimFilterOperators.EqualTo,
          ClaimFilterSelectionOptions_Coordinator.BradPeterson
        )
        await homePage.AddContactFilter(
          ClaimFilterFields.Coordinator,
          ClaimFilterOperators.NotEqualTo,
          ClaimFilterSelectionOptions_Coordinator.Test
        )
      })
    })

    test('Assigned Claim Filters - Validate', async ({ browser }) => {
      // launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()

      // Expand and set the filter to an empty state
      await homePage.ClearAllFilters()

      // Validate Contact Field type of filter
      await homePage.Filter_AssignedClaimsPortal.Button_AddFilter.Click()
      let index = (await homePage.Filter_AssignedClaimsPortal.RowCount()) - 1
      await homePage.Filter_AssignedClaimsPortal.SelectFilterField(index, ClaimFilterFields.Carrier)
      await homePage.Filter_AssignedClaimsPortal.Button_SaveFilters.Click()
      expect(await homePage.Filter_AssignedClaimsPortal.ValidateFilterCombobox(index)).toBe(true)

      // Validate Text Field type of filter
      await homePage.Filter_AssignedClaimsPortal.Button_AddFilter.Click()
      index = (await homePage.Filter_AssignedClaimsPortal.RowCount()) - 1
      await homePage.Filter_AssignedClaimsPortal.SelectFilterField(index, ClaimFilterFields.CatCode)
      await homePage.Filter_AssignedClaimsPortal.Button_SaveFilters.Click()
      expect(await homePage.Filter_AssignedClaimsPortal.ValidateFilterInput(index)).toBe(true)

      // Validate Date Field type of filter
      await homePage.Filter_AssignedClaimsPortal.Button_AddFilter.Click()
      index = (await homePage.Filter_AssignedClaimsPortal.RowCount()) - 1
      await homePage.Filter_AssignedClaimsPortal.SelectFilterField(index, ClaimFilterFields.DateReceived)
      await homePage.Filter_AssignedClaimsPortal.SelectFilterField(index, ClaimFilterFields.DateReceived)
      await homePage.Filter_AssignedClaimsPortal.SelectFilterOperator(
        index,
        ClaimFilterOperators_Date.Matches
      )
      await homePage.Filter_AssignedClaimsPortal.Button_SaveFilters.Click()
      expect(await homePage.Filter_AssignedClaimsPortal.ValidateFilterInput(index)).toBe(true)

      // Validate Boolean Field type of filter
      await homePage.Filter_AssignedClaimsPortal.Button_AddFilter.Click()
      index = (await homePage.Filter_AssignedClaimsPortal.RowCount()) - 1
      await homePage.Filter_AssignedClaimsPortal.SelectFilterField(index, ClaimFilterFields.HasCatCode)
      await homePage.Filter_AssignedClaimsPortal.Button_SaveFilters.Click()
      expect(await homePage.Filter_AssignedClaimsPortal.ValidateFilterSelect(index)).toBe(true)
    })

    test('Assigned Claim Filters - Remove Filter', async ({ browser }) => {
      // launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()

      // Expand and set the filter to an empty state
      await homePage.ClearAllFilters()

      // Add a filter
      await homePage.AddClaimStatusFilter(
        ClaimFilterOperators.EqualTo,
        ClaimFilterSelectionOptions_ClaimStatus.CarrierReview
      )
      expect(await homePage.Filter_AssignedClaimsPortal.RowCount()).toBe(1)

      // Remove the filter
      await homePage.Filter_AssignedClaimsPortal.RemoveFilterAtIndex(0)
      expect(await homePage.Filter_AssignedClaimsPortal.RowCount()).toBe(0)
    })

    test('Assigned Claim Filters - Reset Filters', async ({ browser }) => {
      // launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()

      // Expand and set the filter to an empty state
      await homePage.ClearAllFilters()

      // Add a filter
      await homePage.AddClaimStatusFilter(
        ClaimFilterOperators.EqualTo,
        ClaimFilterSelectionOptions_ClaimStatus.CarrierReview
      )
      expect(await homePage.Filter_AssignedClaimsPortal.RowCount()).toBe(1)

      // Save the current filter
      await homePage.Filter_AssignedClaimsPortal.Button_SaveFilters.Click()
      await homePage.page.waitForTimeout(2000)

      // Reset the filters
      await homePage.Filter_AssignedClaimsPortal.Button_ResetFilters.Click()
      await homePage.page.waitForTimeout(2000)
      expect(await homePage.Filter_AssignedClaimsPortal.RowCount()).toBe(2)
    })

    test('Your Assigned ClaimsPortal Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_YourAssignedClaimsPortal

      // Click the Open Table Settings button on the Your Assigned ClaimsPortal Table
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

      test('Your Assigned ClaimsPortal Table - Settings: Verify Columns', async ({ browser }) => {
        test.slow()

        // launch the Claims Portal home pageClaimsPortalClaimsPortal User
        const { global } = await Launch(browser, environment)
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.NavigateToPage()
        const table = homePage.DataTable_YourAssignedClaimsPortal

        // Click the Open Table Settings button on the Your Assigned ClaimsPortal Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Users)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Users)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Coordinator)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Coordinator)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_DeskAdjuster)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_DeskAdjuster)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_FieldAgent)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_FieldAgent)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_InspectionTech)
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.Claims_InspectionTech)
        ).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Reviewer)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Reviewer)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Policyholder)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Policyholder)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_ClaimNumber)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimNumber)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_PrimaryContact)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_PrimaryContact)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Email)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Email)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Phone)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Phone)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Carrier)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Carrier)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_ClaimStatus)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimStatus)).toBe(false)
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
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Data_Source)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Data_Source)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Tags)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Tags)).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Users)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Users)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Coordinator)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Coordinator)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_DeskAdjuster)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_DeskAdjuster)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_FieldAgent)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_FieldAgent)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_InspectionTech)
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.Claims_InspectionTech)
        ).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Reviewer)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Reviewer)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Policyholder)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Policyholder)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_ClaimNumber)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimNumber)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_PrimaryContact)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_PrimaryContact)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Email)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Email)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Phone)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Phone)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Carrier)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Carrier)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_ClaimStatus)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimStatus)).toBe(true)
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
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Data_Source)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Data_Source)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Tags)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Tags)).toBe(true)
      })

      test('Your Assigned ClaimsPortal Table - Settings: Move Columns', async ({ browser }) => {
        // launch the Claims Portal home pageClaimsPortalClaimsPortal User
        const { global } = await Launch(browser, environment)
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.NavigateToPage()
        const table = homePage.DataTable_YourAssignedClaimsPortal

        // make sure all the columns we need are visible
        await homePage.ShowAllYourAssignedClaimsPortalColumns()

        // Check the position of the Users column before we start
        const userColumnIndexBeforeMove = await table.FetchColumnIndexByColumnType(
          DataTable_Columns_Type.Claims_Users
        )
        expect(userColumnIndexBeforeMove).toBe(2)

        // Click the Open Table Settings button on the ClaimsPortal Table
        const tableSettingsDialog = await table.OpenTableSettings()
        // Make sure the columns we need are visible
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Users)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Coordinator)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_DeskAdjuster)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_FieldAgent)

        // Check checkbox positions before move
        const firstCheckboxBefore = await tableSettingsDialog.GetNthCheckbox(0)
        const secondCheckboxBefore = await tableSettingsDialog.GetNthCheckbox(1)
        const thirdCheckboxBefore = await tableSettingsDialog.GetNthCheckbox(2)
        const fourthCheckboxBefore = await tableSettingsDialog.GetNthCheckbox(3)
        expect(firstCheckboxBefore).toBe(
          DataTable_Columns_Type[DataTable_Columns_Type.Claims_Users]
        )
        expect(secondCheckboxBefore).toBe(
          DataTable_Columns_Type[DataTable_Columns_Type.Claims_Coordinator]
        )
        expect(thirdCheckboxBefore).toBe(
          DataTable_Columns_Type[DataTable_Columns_Type.Claims_DeskAdjuster]
        )
        expect(fourthCheckboxBefore).toBe(
          DataTable_Columns_Type[DataTable_Columns_Type.Claims_FieldAgent]
        )

        // Drag FieldAgent (4) onto Users (1)
        await tableSettingsDialog.DragAndDropColumn(
          DataTable_Columns_Type.Claims_FieldAgent,
          DataTable_Columns_Type.Claims_Users
        )

        const firstCheckboxAfter = await tableSettingsDialog.GetNthCheckbox(0)
        const secondCheckboxAfter = await tableSettingsDialog.GetNthCheckbox(1)
        const thirdCheckboxAfter = await tableSettingsDialog.GetNthCheckbox(2)
        const fourthCheckboxAfter = await tableSettingsDialog.GetNthCheckbox(3)
        expect(firstCheckboxAfter).toBe(
          DataTable_Columns_Type[DataTable_Columns_Type.Claims_FieldAgent]
        )
        expect(secondCheckboxAfter).toBe(
          DataTable_Columns_Type[DataTable_Columns_Type.Claims_Users]
        )
        expect(thirdCheckboxAfter).toBe(
          DataTable_Columns_Type[DataTable_Columns_Type.Claims_Coordinator]
        )
        expect(fourthCheckboxAfter).toBe(
          DataTable_Columns_Type[DataTable_Columns_Type.Claims_DeskAdjuster]
        )

        await tableSettingsDialog.Close()

        // Check the position of the Users column after we are done
        const fieldAgentColumnIndexAfterMove = await table.FetchColumnIndexByColumnType(
          DataTable_Columns_Type.Claims_FieldAgent
        )
        const userColumnIndexAfterMove = await table.FetchColumnIndexByColumnType(
          DataTable_Columns_Type.Claims_Users
        )
        expect(fieldAgentColumnIndexAfterMove).toBe(userColumnIndexBeforeMove)
        expect(userColumnIndexAfterMove).toBe(userColumnIndexBeforeMove + 1)
      })

      test('Your Assigned ClaimsPortal Table - Settings: Move Pinned Columns', async ({ browser }) => {
        // launch the Claims Portal home pageClaimsPortalClaimsPortal User
        const { global } = await Launch(browser, environment)
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.NavigateToPage()
        const table = homePage.DataTable_YourAssignedClaimsPortal

        // make sure all the columns we need are visible
        await homePage.ShowAllYourAssignedClaimsPortalColumns()

        // get the third column name
        const initialThirdColumnName = await table.FetchColumnNameByColumnIndex(4)
        const initialThirdColumnAccessName = await table.FetchColumnAccessNameByColumnIndex(4)

        // Pin the third column
        await table.SetColumnPinStateByAccessName(
          initialThirdColumnAccessName,
          DataTable_Column_PinState.Pinned
        )

        // Click the Open Table Settings button on the Unassigned ClaimsPortal Table
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

        expect(pinnedColumnIndexAfterMove).toBe(2) // should be stuck leftmost regardless of the move position

        // Unpin the third column
        await table.SetColumnPinStateByAccessName(
          initialThirdColumnAccessName,
          DataTable_Column_PinState.Unpinned
        )

        // Check the position of the now unpinned column after we are done
        const unpinnedColumnIndexAfterMove =
          await table.FetchColumnIndexByColumnName(initialThirdColumnName)
        expect(unpinnedColumnIndexAfterMove).toBe(6) // should jump to the position we moved it
      })

      test('Your Assigned ClaimsPortal Table - Pin Columns', async ({ browser }) => {
        // launch the Claims Portal home pageClaimsPortalClaimsPortal User
        const { global } = await Launch(browser, environment)
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.NavigateToPage()
        const table = homePage.DataTable_YourAssignedClaimsPortal

        // make sure all the columns we need are visible
        await homePage.ShowAllYourAssignedClaimsPortalColumns()

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

      test('Your Assigned ClaimsPortal Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal home pageClaimsPortalClaimsPortal User
        const { global } = await Launch(browser, environment)
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.NavigateToPage()
        const table = homePage.DataTable_YourAssignedClaimsPortal

        // make sure all the columns we need are visible
        await homePage.ShowAllYourAssignedClaimsPortalColumns()

        // Examine Coordinator and Choose Claim Number columns
        // Verify initial states are unsorted
        const initialClaimNumberSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_ClaimNumber
        )
        const initialCoordinatorSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator
        )
        expect(initialClaimNumberSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialCoordinatorSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Claim number column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Claims_ClaimNumber,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify Claim number is sorted Down and Coordinator is still unsorted
        let currentClaimNumberSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_ClaimNumber
        )
        let currentCoordinatorSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator
        )
        expect(currentClaimNumberSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentCoordinatorSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Coordinatorcolumn Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify Claim number is now unsorted and Coordinator is sorted Up
        currentClaimNumberSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_ClaimNumber
        )
        currentCoordinatorSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator
        )
        expect(currentClaimNumberSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentCoordinatorSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Coordinatorcolumn Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator,
          DataTable_Column_SortState.Unsorted
        )
        currentCoordinatorSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator
        )
        expect(currentCoordinatorSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Verify Tags and Users cannot be sorted
        currentClaimNumberSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Tags
        )
        currentCoordinatorSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Users
        )
        expect(currentClaimNumberSortState).toBe(DataTable_Column_SortState.NotSortable)
        expect(currentCoordinatorSortState).toBe(DataTable_Column_SortState.NotSortable)
      })
    })

    test('Your Assigned ClaimsPortal Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_YourAssignedClaimsPortal

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

    test('Your Assigned ClaimsPortal Table - Selection', async ({ browser }) => {
      // launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_YourAssignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
        return
      }
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

    test('Your Assigned ClaimsPortal Table - Assign <Contact> Dialog: Verify UI', async ({ browser }) => {
      /// launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_YourAssignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
        return
      }

      // Check the selection checkbox of any claim row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.SelectRowByIndex(rowIndex, true)

      // Verify action buttons appear above the table: (Assign Contact/Add Tags)
      expect(await table.Button_Selection_AssignContact.IsVisible()).toBe(true)

      // Click the Assign Contact Button and choose a contact type from the menu
      let assignContactDialog = await table.OpenAssignContact(ClaimAssignContactOptions.Coordinator)

      // Verify the Assign <Contact> dialog - Heading is "Assign <Contact>" where <Contact> is the menu selection
      await assignContactDialog.VerifyTitle()

      // Verify Assign <Contact> dialog - closes with click on "X" button
      await assignContactDialog.Close()
      await expect(assignContactDialog.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)

      // Verify Assign <Contact> dialog - closes with ESC key
      assignContactDialog = await table.OpenAssignContact(ClaimAssignContactOptions.FieldAgent)
      await assignContactDialog.Close(true)
      await expect(assignContactDialog.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)
    })

    test('Your Assigned ClaimsPortal Table -  Assign <Contact> Dialog: Validate', async ({ browser }) => {
      /// launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_YourAssignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
        return
      }

      // Check the selection checkbox of any claim row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.SelectRowByIndex(rowIndex, true)

      // Verify action buttons appear above the table: (Assign Contact/Add Tags)
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

    test('Your Assigned ClaimsPortal Table - Add Tags Dialog: Verify UI', async ({ browser }) => {
      /// launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_YourAssignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
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
      await homePage.page.waitForTimeout(1000)

      // Verify Add Tags dialog - closes with ESC key
      addTagsDialog = await table.OpenAddTags()
      await addTagsDialog.Close(true)
      await expect(addTagsDialog.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)

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

    test('Your Assigned ClaimsPortal Table - Add Tags Dialog: Validate', async ({ browser }) => {
      /// launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_YourAssignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
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

    test('Your Assigned ClaimsPortal Table - Add/Remove Tag', async ({ browser }) => {
      /// launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_YourAssignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
        return
      }

      // make sure all the columns we need are visible
      await homePage.ShowAllYourAssignedClaimsPortalColumns()

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

    test('Your Assigned ClaimsPortal Table - Verify Action Menu: Open Claim', async ({ browser }) => {
      // launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_YourAssignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
        return
      }

      // make sure all the columns we need are visible
      await homePage.ShowAllYourAssignedClaimsPortalColumns()

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
      expect(homePage.page.url().endsWith(`claims/${targetClaimNumber}/info`)).toBe(true)
    })

    test('Your Assigned ClaimsPortal Table - Verify Action Menu: Copy Claim Number', async ({
      browser,
    }) => {
      // launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_YourAssignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
        return
      }

      // make sure all the columns we need are visible
      await homePage.ShowAllYourAssignedClaimsPortalColumns()

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

    test('Your Assigned ClaimsPortal Table - Copy Claim Number (clipboard icon)', async ({ browser }) => {
      // launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_YourAssignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
        return
      }

      // make sure all the columns we need are visible
      await homePage.ShowAllYourAssignedClaimsPortalColumns()

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

    test('Your Assigned ClaimsPortal Table - Verify Claim Number/Link button', async ({ browser }) => {
      // launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_YourAssignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyYourAssignedClaimsTableMessage)
        return
      }

      // make sure all the columns we need are visible
      await homePage.ShowAllYourAssignedClaimsPortalColumns()

      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
      const targetClaimNumber = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Claims_ClaimNumber
      )
      await table.ClickLinkInDataCell(rowIndex, DataTable_Columns_Type.Claims_ClaimNumber)

      // verify we navigated to the claim page of the target
      expect(homePage.page.url().endsWith(`claims/${targetClaimNumber}/info`)).toBe(true)
    })

    test('Your Assigned ClaimsPortal Table - Pagination: Show List', async ({ browser }) => {
      // launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_YourAssignedClaimsPortal

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
          expect(pageData.currentPageRowCount <= pageSize).toBe(true)
        } else {
          expect(pageData.currentPageRowCount == pageSize).toBe(true)
        }
      }
    })

    test('Your Assigned ClaimsPortal Table - Pagination: Navigation Buttons', async ({ browser }) => {
      // launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_YourAssignedClaimsPortal

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
      expect(pageData.currentPage == 1).toBe(true)

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

    test('Your Assigned ClaimsPortal Table - Pagination: Go To Page', async ({ browser }) => {
      // launch the Claims Portal home pageClaimsPortalClaimsPortal User
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_YourAssignedClaimsPortal

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
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage == 1).toBe(true)

      // Check Last Page
      await table.Pagination_GotoPage(lastPage)
      await homePage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display Y of Y where Y is the max page ie 3 of 3
      expect(pageData.currentPage == lastPage).toBe(true)

      // Check First Page
      await table.Pagination_GotoPage(1)
      await homePage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display 1 of Y where Y is the max page ie 1 of 3
      expect(pageData.currentPage == 1).toBe(true)

      // if Max Pages are > 2, test an intermediate number
      if (lastPage > 2) {
        // Check random middle page
        const randomPage = Math.floor(Math.random() * (lastPage - 2) + 2)
        await table.Pagination_GotoPage(randomPage)
        await homePage.page.waitForTimeout(1000)
        pageData = await table.GetPageInfo()

        //Verify we display X of Y where Y is the max page and X is the Random page ie 4 of 7
        expect(pageData.currentPage == randomPage).toBe(true)
      }
    })

    test('Unassigned ClaimsPortal Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_UnassignedClaimsPortal

      // Click the Open Table Settings button on the Unassigned ClaimsPortal Table
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

      test('Unassigned ClaimsPortal Table - Settings: Verify Columns', async ({ browser }) => {
        test.slow()

        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.NavigateToPage()
        const table = homePage.DataTable_UnassignedClaimsPortal

        // Click the Open Table Settings button on the Unassigned ClaimsPortal Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Users)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Users)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Coordinator)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Coordinator)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_DeskAdjuster)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_DeskAdjuster)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_FieldAgent)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_FieldAgent)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_InspectionTech)
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.Claims_InspectionTech)
        ).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Reviewer)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Reviewer)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Policyholder)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Policyholder)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_ClaimNumber)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimNumber)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_PrimaryContact)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_PrimaryContact)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Email)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Email)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Phone)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Phone)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Carrier)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Carrier)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_ClaimStatus)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimStatus)).toBe(false)
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
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Data_Source)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Data_Source)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Tags)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Tags)).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Users)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Users)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Coordinator)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Coordinator)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_DeskAdjuster)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_DeskAdjuster)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_FieldAgent)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_FieldAgent)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_InspectionTech)
        expect(
          await table.IsColumnVisible(DataTable_Columns_Type.Claims_InspectionTech)
        ).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Reviewer)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Reviewer)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Policyholder)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Policyholder)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_ClaimNumber)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimNumber)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_PrimaryContact)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_PrimaryContact)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Email)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Email)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Phone)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Phone)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Carrier)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Carrier)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_ClaimStatus)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimStatus)).toBe(true)
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
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Data_Source)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Data_Source)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Tags)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Tags)).toBe(true)
      })

      test('Unassigned ClaimsPortal Table - Settings: Move Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.NavigateToPage()
        const table = homePage.DataTable_UnassignedClaimsPortal

        // make sure all the columns we need are visible
        await homePage.ShowAllUnassignedClaimsPortalColumns()

        // Check the position of the Users column before we start
        const userColumnIndexBeforeMove = await table.FetchColumnIndexByColumnType(
          DataTable_Columns_Type.Claims_Users
        )
        expect(userColumnIndexBeforeMove).toBe(2)

        // Click the Open Table Settings button on the Unassigned ClaimsPortal Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Check checkbox positions before move
        const firstCheckboxBefore = await tableSettingsDialog.GetNthCheckbox(0)
        const secondCheckboxBefore = await tableSettingsDialog.GetNthCheckbox(1)
        const thirdCheckboxBefore = await tableSettingsDialog.GetNthCheckbox(2)
        const fourthCheckboxBefore = await tableSettingsDialog.GetNthCheckbox(3)
        expect(firstCheckboxBefore).toBe(
          DataTable_Columns_Type[DataTable_Columns_Type.Claims_Users]
        )
        expect(secondCheckboxBefore).toBe(
          DataTable_Columns_Type[DataTable_Columns_Type.Claims_Coordinator]
        )
        expect(thirdCheckboxBefore).toBe(
          DataTable_Columns_Type[DataTable_Columns_Type.Claims_DeskAdjuster]
        )
        expect(fourthCheckboxBefore).toBe(
          DataTable_Columns_Type[DataTable_Columns_Type.Claims_FieldAgent]
        )

        // Drag FieldAgent (4) onto Users (1)
        await tableSettingsDialog.DragAndDropColumn(
          DataTable_Columns_Type.Claims_FieldAgent,
          DataTable_Columns_Type.Claims_Users
        )

        const firstCheckboxAfter = await tableSettingsDialog.GetNthCheckbox(0)
        const secondCheckboxAfter = await tableSettingsDialog.GetNthCheckbox(1)
        const thirdCheckboxAfter = await tableSettingsDialog.GetNthCheckbox(2)
        const fourthCheckboxAfter = await tableSettingsDialog.GetNthCheckbox(3)
        expect(firstCheckboxAfter).toBe(
          DataTable_Columns_Type[DataTable_Columns_Type.Claims_FieldAgent]
        )
        expect(secondCheckboxAfter).toBe(
          DataTable_Columns_Type[DataTable_Columns_Type.Claims_Users]
        )
        expect(thirdCheckboxAfter).toBe(
          DataTable_Columns_Type[DataTable_Columns_Type.Claims_Coordinator]
        )
        expect(fourthCheckboxAfter).toBe(
          DataTable_Columns_Type[DataTable_Columns_Type.Claims_DeskAdjuster]
        )

        await tableSettingsDialog.Close()

        // Check the position of the Users column after we are done
        const fieldAgentColumnIndexAfterMove = await table.FetchColumnIndexByColumnType(
          DataTable_Columns_Type.Claims_FieldAgent
        )
        const userColumnIndexAfterMove = await table.FetchColumnIndexByColumnType(
          DataTable_Columns_Type.Claims_Users
        )
        expect(fieldAgentColumnIndexAfterMove).toBe(userColumnIndexBeforeMove)
        expect(userColumnIndexAfterMove).toBe(userColumnIndexBeforeMove + 1)
      })

      test('Unassigned ClaimsPortal Table - Settings: Move Pinned Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.NavigateToPage()
        const table = homePage.DataTable_UnassignedClaimsPortal

        // make sure all the columns we need are visible
        await homePage.ShowAllUnassignedClaimsPortalColumns()

        // get the third column name
        const initialThirdColumnName = await table.FetchColumnNameByColumnIndex(4)
        const initialThirdColumnAccessName = await table.FetchColumnAccessNameByColumnIndex(4)

        // Pin the third column
        await table.SetColumnPinStateByAccessName(
          initialThirdColumnAccessName,
          DataTable_Column_PinState.Pinned
        )

        // Click the Open Table Settings button on the Unassigned ClaimsPortal Table
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

        expect(pinnedColumnIndexAfterMove).toBe(2) // should be stuck leftmost regardless of the move position

        // Unpin the third column
        await table.SetColumnPinStateByAccessName(
          initialThirdColumnAccessName,
          DataTable_Column_PinState.Unpinned
        )

        // Check the position of the now unpinned column after we are done
        const unpinnedColumnIndexAfterMove =
          await table.FetchColumnIndexByColumnName(initialThirdColumnName)
        expect(unpinnedColumnIndexAfterMove).toBe(6) // should jump to the position we moved it
      })

      test('Unassigned ClaimsPortal Table - Pin Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.NavigateToPage()
        const table = homePage.DataTable_UnassignedClaimsPortal

        // make sure all the columns we need are visible
        await homePage.ShowAllUnassignedClaimsPortalColumns()

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

      test('Unassigned ClaimsPortal Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.NavigateToPage()
        const table = homePage.DataTable_UnassignedClaimsPortal

        // make sure all the columns we need are visible
        await homePage.ShowAllUnassignedClaimsPortalColumns()

        // Examine Coordinator and Choose Claim Number columns
        // Verify initial states are unsorted
        const initialClaimNumberSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_ClaimNumber
        )
        const initialCoordinatorSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator
        )
        expect(initialClaimNumberSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialCoordinatorSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Claim number column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Claims_ClaimNumber,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify Claim number is sorted Down and Coordinator is still unsorted
        let currentClaimNumberSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_ClaimNumber
        )
        let currentCoordinatorSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator
        )
        expect(currentClaimNumberSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentCoordinatorSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Coordinatorcolumn Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify Claim number is now unsorted and Coordinator is sorted Up
        currentClaimNumberSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_ClaimNumber
        )
        currentCoordinatorSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator
        )
        expect(currentClaimNumberSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentCoordinatorSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Coordinatorcolumn Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator,
          DataTable_Column_SortState.Unsorted
        )
        currentCoordinatorSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Coordinator
        )
        expect(currentCoordinatorSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Verify Tags and Users cannot be sorted
        currentClaimNumberSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Tags
        )
        currentCoordinatorSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Claims_Users
        )
        expect(currentClaimNumberSortState).toBe(DataTable_Column_SortState.NotSortable)
        expect(currentCoordinatorSortState).toBe(DataTable_Column_SortState.NotSortable)
      })
    })

    test('Unassigned ClaimsPortal Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_UnassignedClaimsPortal

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

    test('Unassigned ClaimsPortal Table - Selection', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_UnassignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyUnassignedClaimsTableMessage)
        return
      }

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
      expect.soft(visibleSelectedRowCount).toBe(pageInfo.currentPageRowCount)

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

    test('Unassigned ClaimsPortal Table - Assign <Contact> Dialog: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_UnassignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyUnassignedClaimsTableMessage)
        return
      }

      // Check the selection checkbox of any claim row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.SelectRowByIndex(rowIndex, true)

      // Verify action buttons appear above the table: (Assign Contact/Add Tags)
      expect(await table.Button_Selection_AssignContact.IsVisible()).toBe(true)

      // Click the Assign Contact Button and choose a contact type from the menu
      let assignContactDialog = await table.OpenAssignContact(ClaimAssignContactOptions.Coordinator)

      // Verify the Assign <Contact> dialog - Heading is "Assign <Contact>" where <Contact> is the menu selection
      await assignContactDialog.VerifyTitle()

      // Verify Assign <Contact> dialog - closes with click on "X" button
      await assignContactDialog.Close()
      await expect(assignContactDialog.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)

      // Verify Assign <Contact> dialog - closes with ESC key
      assignContactDialog = await table.OpenAssignContact(ClaimAssignContactOptions.FieldAgent)
      await assignContactDialog.Close(true)
      await expect(assignContactDialog.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)
    })

    test('Unassigned ClaimsPortal Table - Assign <Contact> Dialog: Validate', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_UnassignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyUnassignedClaimsTableMessage)
        return
      }

      // Check the selection checkbox of any claim row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1)
      await table.SelectRowByIndex(rowIndex, true)

      // Verify action buttons appear above the table: (Assign Contact/Add Tags)
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

    test('Unassigned ClaimsPortal Table - Add Tags Dialog: Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_UnassignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyUnassignedClaimsTableMessage)
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
      await homePage.page.waitForTimeout(1000)

      // Verify Add Tags dialog - closes with ESC key
      addTagsDialog = await table.OpenAddTags()
      await addTagsDialog.Close(true)
      await expect(addTagsDialog.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)

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

    test('Unassigned ClaimsPortal Table - Add Tags Dialog: Validate', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_UnassignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyUnassignedClaimsTableMessage)
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

    test('Unassigned ClaimsPortal Table - Add/Remove Tag', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_UnassignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyUnassignedClaimsTableMessage)
        return
      }

      // make sure all the columns we need are visible
      await homePage.ShowAllUnassignedClaimsPortalColumns()

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

    test('Unassigned ClaimsPortal Table - Verify Action Menu: Open Claim', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_UnassignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyUnassignedClaimsTableMessage)
        return
      }

      // make sure all the columns we need are visible
      await homePage.ShowAllUnassignedClaimsPortalColumns()

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
      expect(homePage.page.url().endsWith(`claims/${targetClaimNumber}/info`)).toBe(true)
    })

    test('Unassigned ClaimsPortal Table - Verify Action Menu: Copy Claim Number', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_UnassignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyUnassignedClaimsTableMessage)
        return
      }

      // make sure all the columns we need are visible
      await homePage.ShowAllUnassignedClaimsPortalColumns()

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

    test('Unassigned ClaimsPortal Table - Copy Claim Number (clipboard icon)', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_UnassignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyUnassignedClaimsTableMessage)
        return
      }

      // make sure all the columns we need are visible
      await homePage.ShowAllUnassignedClaimsPortalColumns()

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

    test('Unassigned ClaimsPortal Table - Verify Claim Number/Link button', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_UnassignedClaimsPortal

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyUnassignedClaimsTableMessage)
        return
      }

      // make sure all the columns we need are visible
      await homePage.ShowAllUnassignedClaimsPortalColumns()

      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
      const targetClaimNumber = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Claims_ClaimNumber
      )
      await table.ClickLinkInDataCell(rowIndex, DataTable_Columns_Type.Claims_ClaimNumber)

      // verify we navigated to the claim page of the target
      expect(homePage.page.url().endsWith(`claims/${targetClaimNumber}/info`)).toBe(true)
    })

    test('Unassigned ClaimsPortal Table - Pagination: Show List', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_UnassignedClaimsPortal

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

    test('Unassigned ClaimsPortal Table - Pagination: Navigation Buttons', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_UnassignedClaimsPortal

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
      expect(pageData.currentPage == 1).toBe(true)

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

    test('Unassigned ClaimsPortal Table - Pagination: Go To Page', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_UnassignedClaimsPortal

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
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage == 1).toBe(true)

      // Check Last Page
      await table.Pagination_GotoPage(lastPage)
      await homePage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display Y of Y where Y is the max page ie 3 of 3
      expect(pageData.currentPage == lastPage).toBe(true)

      // Check First Page
      await table.Pagination_GotoPage(1)
      await homePage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display 1 of Y where Y is the max page ie 1 of 3
      expect(pageData.currentPage == 1).toBe(true)

      // if Max Pages are > 2, test an intermediate number
      if (lastPage > 2) {
        // Check random middle page
        const randomPage = Math.floor(Math.random() * (lastPage - 2) + 2)
        await table.Pagination_GotoPage(randomPage)
        await homePage.page.waitForTimeout(1000)
        pageData = await table.GetPageInfo()

        //Verify we display X of Y where Y is the max page and X is the Random page ie 4 of 7
        expect(pageData.currentPage == randomPage).toBe(true)
      }
    })

    test('Unassigned ClaimsPortal Table - Verify All/Coordinatior Review button toggling', async ({
      browser,
    }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.NavigateToPage()
      const table = homePage.DataTable_UnassignedClaimsPortal

      // Verify All/Coordinator Review buttons initial states
      expect(await homePage.Button_Radio_All.IsChecked()).toBe(true)
      expect(await homePage.Button_Radio_CoordinatorReview.IsChecked()).toBe(false)
      const initialCount = await table.BadgeCount()

      // Click the Coordinator Review button in the top right corner of the table and verify that the claims filter to only those with a status of Coordinator Review
      await homePage.Button_Radio_CoordinatorReview.SetChecked(true)
      expect(await homePage.Button_Radio_CoordinatorReview.IsChecked()).toBe(true)
      expect(await homePage.Button_Radio_All.IsChecked()).toBe(false)
      await homePage.page.waitForTimeout(2000)

      const filteredCount = await table.BadgeCount()
      expect(filteredCount).toBeLessThan(initialCount)

      // Click the All button in the top right corner of the table and verify that the claims filter is off
      await homePage.Button_Radio_All.SetChecked(true)
      expect(await homePage.Button_Radio_All.IsChecked()).toBe(true)
      expect(await homePage.Button_Radio_CoordinatorReview.IsChecked()).toBe(false)
      await homePage.page.waitForTimeout(2000)

      const finalCount = await table.BadgeCount()
      expect(finalCount).toBe(initialCount)
    })
  }
)
