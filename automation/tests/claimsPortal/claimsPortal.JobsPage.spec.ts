import { expect } from '@playwright/test'
import {
  AbortErrors,
  BadgeTypes,
  CannedJobTypes,
  DataTable_Column_PinState,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DataTable_ShowPageSize_Options,
  DefaultEnvironment,
  JobAssignContactOptions,
  JobFilterFields,
  JobFilterFields_Boolean,
  JobFilterFields_Text,
  JobFilterOperators,
  JobFilterOperators_Boolean,
  JobFilterOperators_Text,
  JobFilterSelectionOptions_Approver,
  JobFilterSelectionOptions_Boolean,
  JobFilterSelectionOptions_Coordinator,
  JobFilterSelectionOptions_Dispatcher,
  JobFilterSelectionOptions_LatestTimelineEvent,
  JobFilterSelectionOptions_LatestWorkAuthStatus,
  JobFilterSelectionOptions_ProjectManager,
  JobFilterSelectionOptions_Services,
  JobFilterSelectionOptions_Type,
  Jobs_DataTable_ActionMenuItems,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedJob, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalJobsPage } from '../../library/claimsPortal/pages/claimsPortalJobsPage.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'

const environment = DefaultEnvironment

test.describe(
  'Jobs Page',
  {
    tag: [Tags.ClaimsPortal, Tags.Jobs],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()

      // Verify page label is Jobs Dashboard
      await jobsPage.VerifyTitle()

      // Verify there is a Jobs Filter section
      await expect(jobsPage.Filter_Jobs.Button_ExpandFilter.locator).toBeAttached()

      // Verify there is a Create Jobs button
      expect(await jobsPage.Button_CreateJob.IsVisible()).toBe(true)

      // Verify Jobs Table exists
      expect(await jobsPage.DataTable_Jobs.IsVisible()).toBe(true)

      // Check table settings dialog and columns
      await jobsPage.VerifyTableSettingColumns()

      // Verify Jobs Table layout...
      // Verify Jobs Column Settings / Expand button
      expect(await jobsPage.DataTable_Jobs.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await jobsPage.DataTable_Jobs.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await jobsPage.DataTable_Jobs.Button_CloseTable.IsVisible()).toBe(false)
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()

      // Verify page label is Jobs Dashboard
      await jobsPage.VerifyTitle()

      // Verify there is a Jobs Filter section
      await expect(jobsPage.Filter_Jobs.Button_ExpandFilter.locator).toBeAttached()

      // Verify there is a Create Jobs button
      expect(await jobsPage.Button_CreateJob.IsVisible()).toBe(true)

      // Verify Jobs Table exists
      expect(await jobsPage.DataTable_Jobs.IsVisible()).toBe(true)

      // Verify Jobs Table layout...
      // Verify Jobs Column Settings / Expand button
      expect(await jobsPage.DataTable_Jobs.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await jobsPage.DataTable_Jobs.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await jobsPage.DataTable_Jobs.Button_CloseTable.IsVisible()).toBe(false)
    })

    test('Job Filters - Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const filter = jobsPage.Filter_Jobs

      // Verify the Filters section exists and is collapsed
      expect(await filter.IsVisible()).toBe(true)
      expect(await filter.IsExpanded()).toBe(false)

      // Verify the filters section can be expanded
      await filter.Button_ExpandFilter.Click()
      expect(await filter.IsExpanded()).toBe(true)

      // Verify there is a # Applied label next to the Assigned Claim Filters title that displays the number of applied filters
      const appliedFilterCount = await filter.AppliedFilterCount()
      await filter.VerifyFilterCountBadge(appliedFilterCount, BadgeTypes.Applied)

      // if 1 or more filter field entries are listed, row count will be > 0
      const filterCount = await filter.RowCount()
      if (filterCount == 0) {
        // If no filters exist, we should see an information label that says "Click the "Add Filter" button to get started with filtering claims."
        await filter.VerifyNoFilterAlert()
      }

      // Verify there is no Reset Filters button, but there is a Clear Filters button, a Add Filter+ button and a Save Filters Button
      expect(await filter.Button_ResetFilters.IsVisible()).toBe(false)
      expect(await filter.Button_ClearFilters.IsVisible()).toBe(true)
      expect(await filter.Button_AddFilter.IsVisible()).toBe(true)
      expect(await filter.Button_SaveFilters.IsVisible()).toBe(true)

      // Verify the filters section can be collapsed
      await filter.Button_CollapseFilter.Click()
      expect(await filter.IsExpanded()).toBe(false)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Jobs Filters - Verify Text Filters', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
        const jobsPage = new ClaimsPortalJobsPage(global)
        await jobsPage.NavigateToPage()

        // Expand and set the filter to an empty state
        await jobsPage.ClearAllFilters()

        // Verify Text Filter Fields
        for (const fieldKey in JobFilterFields_Text) {
          const fieldValue = JobFilterFields[fieldKey as keyof typeof JobFilterFields_Text]
          switch (fieldValue.toString()) {
            case JobFilterFields_Text.City:
              await jobsPage.AddTextFilter(fieldValue, JobFilterOperators_Text.Matches, 'Spokane')
              await jobsPage.AddTextFilter(
                fieldValue,
                JobFilterOperators_Text.DoesNotMatch,
                'Tacoma'
              )
              break
            case JobFilterFields_Text.ClosedReason:
              await jobsPage.AddTextFilter(fieldValue, JobFilterOperators_Text.Matches, 'Abc')
              await jobsPage.AddTextFilter(fieldValue, JobFilterOperators_Text.DoesNotMatch, '123')
              break
            case JobFilterFields_Text.County:
              await jobsPage.AddTextFilter(fieldValue, JobFilterOperators_Text.Matches, 'Spokane')
              await jobsPage.AddTextFilter(fieldValue, JobFilterOperators_Text.DoesNotMatch, 'King')
              break
            case JobFilterFields_Text.Description:
              await jobsPage.AddTextFilter(fieldValue, JobFilterOperators_Text.Matches, 'tarp only')
              await jobsPage.AddTextFilter(
                fieldValue,
                JobFilterOperators_Text.DoesNotMatch,
                'roof + int'
              )
              break
            case JobFilterFields_Text.JobId:
              await jobsPage.AddTextFilter(fieldValue, JobFilterOperators_Text.Matches, '742')
              await jobsPage.AddTextFilter(fieldValue, JobFilterOperators_Text.DoesNotMatch, '111')
              break
            case JobFilterFields_Text.PrimaryContactEmail:
              await jobsPage.AddTextFilter(
                fieldValue,
                JobFilterOperators_Text.Matches,
                'fred@freddys.com'
              )
              await jobsPage.AddTextFilter(
                fieldValue,
                JobFilterOperators_Text.DoesNotMatch,
                'jim@jimmys.com'
              )
              break
            case JobFilterFields_Text.PrimaryContactName:
              await jobsPage.AddTextFilter(
                fieldValue,
                JobFilterOperators_Text.Matches,
                'Fred Savage'
              )
              await jobsPage.AddTextFilter(
                fieldValue,
                JobFilterOperators_Text.DoesNotMatch,
                'Daniel Stern'
              )
              break
            case JobFilterFields_Text.PrimaryContactPhone:
              await jobsPage.AddTextFilter(
                fieldValue,
                JobFilterOperators_Text.Matches,
                'Redacted'
              )
              await jobsPage.AddTextFilter(
                fieldValue,
                JobFilterOperators_Text.DoesNotMatch,
                '509-555-1212'
              )
              break
            case JobFilterFields_Text.RelatedClaimNumber:
              await jobsPage.AddTextFilter(fieldValue, JobFilterOperators_Text.Matches, 'CL-123')
              await jobsPage.AddTextFilter(
                fieldValue,
                JobFilterOperators_Text.DoesNotMatch,
                'CL-456'
              )
              break
            case JobFilterFields_Text.State:
              await jobsPage.AddTextFilter(fieldValue, JobFilterOperators_Text.Matches, 'WA')
              await jobsPage.AddTextFilter(fieldValue, JobFilterOperators_Text.DoesNotMatch, 'OR')
              break
            default:
              throw new Error(`No Text Filter case is defined for: ${fieldValue}`)
          }
        }
      })

      test('Jobs Filters - Verify Boolean Filters', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
        const jobsPage = new ClaimsPortalJobsPage(global)
        await jobsPage.NavigateToPage()

        // Expand and set the filter to an empty state
        await jobsPage.ClearAllFilters()

        // Verify Boolean Filter Fields
        for (const fieldKey in JobFilterFields_Boolean) {
          const fieldValue = JobFilterFields[fieldKey as keyof typeof JobFilterFields_Boolean]
          switch (fieldValue.toString()) {
            case JobFilterFields_Boolean.IsClosed:
            case JobFilterFields_Boolean.HasBill:
            case JobFilterFields_Boolean.HasInvoice:
            case JobFilterFields_Boolean.HasWorkDetails:
              await jobsPage.AddBooleanFilter(
                fieldValue,
                JobFilterOperators_Boolean.EqualTo,
                JobFilterSelectionOptions_Boolean.True
              )
              await jobsPage.AddBooleanFilter(
                fieldValue,
                JobFilterOperators_Boolean.NotEqualTo,
                JobFilterSelectionOptions_Boolean.False
              )
              break
            default:
              throw new Error(`No Boolean Filter case is defined for: ${fieldValue}`)
          }
        }
      })

      test('Jobs Filters - Verify Other Selection Filters', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
        const jobsPage = new ClaimsPortalJobsPage(global)
        await jobsPage.NavigateToPage()

        // Expand and set the filter to an empty state
        await jobsPage.ClearAllFilters()

        // Verify Latest WorkAuth Status  filter
        for (const fieldKey in JobFilterSelectionOptions_LatestWorkAuthStatus) {
          const fieldValue =
            JobFilterSelectionOptions_LatestWorkAuthStatus[
              fieldKey as keyof typeof JobFilterSelectionOptions_LatestWorkAuthStatus
            ]
          const randomOperator = Math.random() < 0.5
          await jobsPage.AddLatestWorkAuthStatusFilter(
            randomOperator ? JobFilterOperators.EqualTo : JobFilterOperators.NotEqualTo,
            fieldValue
          )
        }

        let expectedRows = Object.keys(JobFilterSelectionOptions_LatestWorkAuthStatus).length
        expect(await jobsPage.Filter_Jobs.RowCount()).toBe(expectedRows)

        // Expand and set the filter to an empty state
        await jobsPage.ClearAllFilters()

        // Verify Type filter
        for (const fieldKey in JobFilterSelectionOptions_Type) {
          const fieldValue =
            JobFilterSelectionOptions_Type[fieldKey as keyof typeof JobFilterSelectionOptions_Type]
          const randomOperator = Math.random() < 0.5
          await jobsPage.AddTypeFilter(
            randomOperator ? JobFilterOperators.EqualTo : JobFilterOperators.NotEqualTo,
            fieldValue
          )
        }
        expectedRows = Object.keys(JobFilterSelectionOptions_Type).length
        expect(await jobsPage.Filter_Jobs.RowCount()).toBe(expectedRows)

        // Expand and set the filter to an empty state
        await jobsPage.ClearAllFilters()

        // Verify Services filter
        for (const fieldKey in JobFilterSelectionOptions_Services) {
          const fieldValue =
            JobFilterSelectionOptions_Services[
              fieldKey as keyof typeof JobFilterSelectionOptions_Services
            ]
          await jobsPage.AddServicesFilter(JobFilterOperators.Includes, fieldValue)
        }
        expectedRows = Object.keys(JobFilterSelectionOptions_Services).length
        expect(await jobsPage.Filter_Jobs.RowCount()).toBe(expectedRows)
      })

      test('Job Filters - Verify Latest Timeline Event Filter', async ({ browser }) => {
        test.slow()

        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
        const jobsPage = new ClaimsPortalJobsPage(global)
        await jobsPage.NavigateToPage()

        // Expand and set the filter to an empty state
        await jobsPage.ClearAllFilters()

        // Verify Latest Timeline Event filter
        for (const fieldKey in JobFilterSelectionOptions_LatestTimelineEvent) {
          const fieldValue =
            JobFilterSelectionOptions_LatestTimelineEvent[
              fieldKey as keyof typeof JobFilterSelectionOptions_LatestTimelineEvent
            ]
          const randomOperator = Math.random() < 0.5
          await jobsPage.AddLatestTimelineEventFilter(
            randomOperator ? JobFilterOperators.EqualTo : JobFilterOperators.NotEqualTo,
            fieldValue
          )
        }
        const expectedRows = Object.keys(JobFilterSelectionOptions_LatestTimelineEvent).length
        expect(await jobsPage.Filter_Jobs.RowCount()).toBe(expectedRows)
      })

      test('Job Filters - Verify Contact Selection Filters', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
        const jobsPage = new ClaimsPortalJobsPage(global)
        await jobsPage.NavigateToPage()

        // Expand and set the filter to an empty state
        await jobsPage.ClearAllFilters()

        // Verify Various Selection Fields
        // Verify Approver filter
        await jobsPage.AddContactFilter(
          JobFilterFields.Approver,
          JobFilterOperators.EqualTo,
          JobFilterSelectionOptions_Approver.redacted1
        )
        await jobsPage.AddContactFilter(
          JobFilterFields.Approver,
          JobFilterOperators.NotEqualTo,
          JobFilterSelectionOptions_Approver.redacted2
        )

        // Verify Coordinator filter
        await jobsPage.AddContactFilter(
          JobFilterFields.Coordinator,
          JobFilterOperators.EqualTo,
          JobFilterSelectionOptions_Coordinator.BradPeterson
        )
        await jobsPage.AddContactFilter(
          JobFilterFields.Coordinator,
          JobFilterOperators.NotEqualTo,
          JobFilterSelectionOptions_Coordinator.Test
        )

        // Verify Dispatcher filter
        await jobsPage.AddContactFilter(
          JobFilterFields.Dispatcher,
          JobFilterOperators.EqualTo,
          JobFilterSelectionOptions_Dispatcher.BradPeterson
        )
        await jobsPage.AddContactFilter(
          JobFilterFields.Dispatcher,
          JobFilterOperators.NotEqualTo,
          JobFilterSelectionOptions_Dispatcher.Test
        )

        // Verify Project Manager filter
        await jobsPage.AddContactFilter(
          JobFilterFields.ProjectManager,
          JobFilterOperators.EqualTo,
          JobFilterSelectionOptions_ProjectManager.redacted1
        )
        await jobsPage.AddContactFilter(
          JobFilterFields.ProjectManager,
          JobFilterOperators.NotEqualTo,
          JobFilterSelectionOptions_ProjectManager.redacted2
        )
      })

      test('Job Filters - Verify Contact Filters exclude Inactive/include Removed', async ({
        browser,
      }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
        const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
        const jobsPage = new ClaimsPortalJobsPage(global)
        await jobsPage.NavigateToPage()

        // Expand and set the filter to an empty state
        await jobsPage.ClearAllFilters()

        // Verify Approver filter does not display Inactive entry
        const inactiveApprover = testJob.testData.jobInactiveGlobalContact
        await jobsPage.Filter_Jobs.Button_AddFilter.Click()
        const index1 = (await jobsPage.Filter_Jobs.RowCount()) - 1
        await jobsPage.Filter_Jobs.SelectFilterField(index1, JobFilterFields.Approver)
        await jobsPage.Filter_Jobs.SelectFilterOperator(index1, JobFilterOperators.EqualTo)
        const setLocator1 = jobsPage.page.locator(`#root input[role="combobox"]`).last()
        await setLocator1.click()
        const listLocator1OptionsTextContents = await jobsPage.page
          .locator('div[role="listbox"] > div[role="option"]')
          .allTextContents()
        expect(listLocator1OptionsTextContents.includes(inactiveApprover)).toBe(false)
        await setLocator1.press('Enter')
        await jobsPage.ClearAllFilters()

        // Verify Contacts type filter does display Removed contacts
        const removedApprover = testJob.testData.jobRemovedGlobalContact
        await jobsPage.Filter_Jobs.Button_AddFilter.Click()
        const index2 = (await jobsPage.Filter_Jobs.RowCount()) - 1
        await jobsPage.Filter_Jobs.SelectFilterField(index2, JobFilterFields.Approver)
        await jobsPage.Filter_Jobs.SelectFilterOperator(index2, JobFilterOperators.EqualTo)
        const setLocator2 = jobsPage.page.locator(`#root input[role="combobox"]`).last()
        await setLocator2.click()
        const listLocator2OptionsTextContents = await jobsPage.page
          .locator('div[role="listbox"] > div[role="option"]')
          .allTextContents()
        expect(listLocator2OptionsTextContents.includes(removedApprover)).toBe(true)
        await setLocator1.press('Enter')
        await jobsPage.ClearAllFilters()
      })
    })

    test('Job Filters - Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()

      // Expand and set the filter to an empty state
      await jobsPage.ClearAllFilters()

      // Validate Contact Field type of filter
      await jobsPage.Filter_Jobs.Button_AddFilter.Click()
      let index = (await jobsPage.Filter_Jobs.RowCount()) - 1
      await jobsPage.Filter_Jobs.SelectFilterField(index, JobFilterFields.Approver)
      await jobsPage.Filter_Jobs.Button_SaveFilters.Click()
      expect(await jobsPage.Filter_Jobs.ValidateFilterCombobox(index)).toBe(true)

      // Validate Text Field type of filter
      await jobsPage.Filter_Jobs.Button_AddFilter.Click()
      index = (await jobsPage.Filter_Jobs.RowCount()) - 1
      await jobsPage.Filter_Jobs.SelectFilterField(index, JobFilterFields.City)
      await jobsPage.Filter_Jobs.Button_SaveFilters.Click()
      expect(await jobsPage.Filter_Jobs.ValidateFilterInput(index)).toBe(true)

      // Validate Boolean Field type of filter
      await jobsPage.Filter_Jobs.Button_AddFilter.Click()
      index = (await jobsPage.Filter_Jobs.RowCount()) - 1
      await jobsPage.Filter_Jobs.SelectFilterField(index, JobFilterFields.IsClosed)
      await jobsPage.Filter_Jobs.Button_SaveFilters.Click()
      expect(await jobsPage.Filter_Jobs.ValidateFilterSelect(index)).toBe(true)
    })

    test('Job Filters - Remove Filter', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()

      // Expand and set the filter to an empty state
      await jobsPage.ClearAllFilters()

      // Add a filter
      await jobsPage.AddContactFilter(
        JobFilterFields.Approver,
        JobFilterOperators.EqualTo,
        JobFilterSelectionOptions_Approver.redacted1
      )
      expect(await jobsPage.Filter_Jobs.RowCount()).toBe(1)

      // Remove the filter
      await jobsPage.Filter_Jobs.RemoveFilterAtIndex(0)
      expect(await jobsPage.Filter_Jobs.RowCount()).toBe(0)
    })

    test('Jobs Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const table = jobsPage.DataTable_Jobs

      // Click the Open Table Settings button on the Jobs Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await jobsPage.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Jobs Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
        const jobsPage = new ClaimsPortalJobsPage(global)
        await jobsPage.NavigateToPage()
        const table = jobsPage.DataTable_Jobs

        // Click the Open Table Settings button on the Jobs Table
        const tableSettingsDialog = await table.OpenTableSettings()

        // Verify that each column checkbox hides the corresponding table column when unchecked
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_Users)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Users)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_JobId)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_JobId)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_Type)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Type)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_Services)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Services)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_Description)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Description)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_Status)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Status)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_WorkAuthStatus)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_WorkAuthStatus)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_Location)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Location)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_LatestTimelineEvent)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_LatestTimelineEvent)).toBe(
          false
        )
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_PrimaryContact)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_PrimaryContact)).toBe(false)
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_Tags)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Tags)).toBe(false)

        // Verify that each column checkbox shows the corresponding table column when checked
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Users)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Users)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_JobId)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_JobId)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Type)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Type)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Services)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Services)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Description)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Description)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Status)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Status)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_WorkAuthStatus)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_WorkAuthStatus)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Location)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Location)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_LatestTimelineEvent)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_LatestTimelineEvent)).toBe(
          true
        )
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_PrimaryContact)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_PrimaryContact)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Tags)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Tags)).toBe(true)
        await tableSettingsDialog.Close()
      })

      test('Jobs Table - Settings: Move Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
        const jobsPage = new ClaimsPortalJobsPage(global)
        await jobsPage.NavigateToPage()
        const table = jobsPage.DataTable_Jobs

        // Make sure the columns we need are visible
        await jobsPage.ShowAllColumns()

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

        // Check the position of the moved column after we are done
        const firstColumnNameAfterMove = await table.FetchColumnNameByColumnIndex(2)
        const secondColumnNameAfterMove = await table.FetchColumnNameByColumnIndex(3)
        expect(firstColumnNameAfterMove).toBe(fourthCheckboxBefore)
        expect(secondColumnNameAfterMove).toBe(firstCheckboxBefore)
      })

      test('Jobs Table - Settings: Move Pinned Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
        const jobsPage = new ClaimsPortalJobsPage(global)
        await jobsPage.NavigateToPage()
        const table = jobsPage.DataTable_Jobs

        // Make sure the columns we need are visible
        await jobsPage.ShowAllColumns()

        // choose columnType to pin: use Services if it is not in the first column
        const servicesColumnIndex = await table.FetchColumnIndexByColumnType(
          DataTable_Columns_Type.Jobs_Services
        )
        const targetColumnTypeToTarget =
          servicesColumnIndex == 2
            ? DataTable_Columns_Type.Jobs_Status
            : DataTable_Columns_Type.Jobs_Services
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

      test('Jobs Table - Pin Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
        const jobsPage = new ClaimsPortalJobsPage(global)
        await jobsPage.NavigateToPage()
        const table = jobsPage.DataTable_Jobs

        // Make sure the columns we need are visible
        await jobsPage.ShowAllColumns()

        // Prove Tags column is not currently in the viewport before the pin
        expect(await table.IsColumnInViewPort(DataTable_Columns_Type.Jobs_Tags)).toBe(false)
        const initialTagsPosition = await table.FetchColumnIndexByColumnType(
          DataTable_Columns_Type.Jobs_Tags
        )

        // Choose the Tags column and click the Pin icon
        await table.SetColumnPinState(
          DataTable_Columns_Type.Jobs_Tags,
          DataTable_Column_PinState.Pinned
        )

        // Verify that the column is now "pinned" left most and has a dark Pin Icon
        expect(await table.FetchColumnPinState(DataTable_Columns_Type.Jobs_Tags)).toBe(
          DataTable_Column_PinState.Pinned
        )
        expect(await table.IsColumnInViewPort(DataTable_Columns_Type.Jobs_Tags)).toBe(true)
        expect(await table.FetchColumnIndexByColumnType(DataTable_Columns_Type.Jobs_Tags)).toBe(2)

        // Choose the Status column and click the Pin icon
        const initialStatusPosition = await table.FetchColumnIndexByColumnType(
          DataTable_Columns_Type.Jobs_Status
        )
        await table.SetColumnPinState(
          DataTable_Columns_Type.Jobs_Status,
          DataTable_Column_PinState.Pinned
        )

        // Verify that this column is also "pinned" but to the right of the previously pinned column
        expect(await table.FetchColumnPinState(DataTable_Columns_Type.Jobs_Status)).toBe(
          DataTable_Column_PinState.Pinned
        )
        expect(await table.IsColumnInViewPort(DataTable_Columns_Type.Jobs_Status)).toBe(true)
        expect(await table.FetchColumnIndexByColumnType(DataTable_Columns_Type.Jobs_Status)).toBe(3)

        // unpin Status and verify it goes back to where it was
        await table.SetColumnPinState(
          DataTable_Columns_Type.Jobs_Status,
          DataTable_Column_PinState.Unpinned
        )
        expect(await table.FetchColumnPinState(DataTable_Columns_Type.Jobs_Status)).toBe(
          DataTable_Column_PinState.Unpinned
        )
        expect(await table.FetchColumnIndexByColumnType(DataTable_Columns_Type.Jobs_Status)).toBe(
          initialStatusPosition
        )

        // unpin Tags and verify it goes back to where it was
        await table.SetColumnPinState(
          DataTable_Columns_Type.Jobs_Tags,
          DataTable_Column_PinState.Unpinned
        )
        expect(await table.FetchColumnPinState(DataTable_Columns_Type.Jobs_Tags)).toBe(
          DataTable_Column_PinState.Unpinned
        )
        expect(await table.FetchColumnIndexByColumnType(DataTable_Columns_Type.Jobs_Tags)).toBe(
          initialTagsPosition
        )
      })

      test('Jobs Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
        const jobsPage = new ClaimsPortalJobsPage(global)
        await jobsPage.NavigateToPage()
        const table = jobsPage.DataTable_Jobs

        // Make sure the columns we need are visible
        await jobsPage.ShowAllColumns()

        // Examine JobId and Status columns
        // Verify initial states
        const initialJobIdSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_JobId
        )
        const initialStatusSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Status
        )
        expect(initialJobIdSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(initialStatusSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Status column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Jobs_Status,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify Status is sorted Down and JobId is now unsorted
        let currentStatusSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Status
        )
        let currentJobIdSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_JobId
        )
        expect(currentStatusSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentJobIdSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Status column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Jobs_Status,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify JobId is still unsorted and Status is sorted Up
        currentJobIdSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Jobs_JobId)
        currentStatusSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Status
        )

        expect(currentJobIdSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentStatusSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Status Date column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.Jobs_Status,
          DataTable_Column_SortState.Unsorted
        )
        currentStatusSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Status
        )
        expect(currentStatusSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Verify Tags,Users,Location,Services and Work Auth Status cannot be sorted
        const currentTagsSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Tags
        )
        const currentUsersSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Users
        )
        const currentLocationSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Location
        )
        const currentServicesSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Services
        )
        const currentWorkAuthStatusSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_WorkAuthStatus
        )
        expect(currentTagsSortState).toBe(DataTable_Column_SortState.NotSortable)
        expect(currentUsersSortState).toBe(DataTable_Column_SortState.NotSortable)
        expect(currentLocationSortState).toBe(DataTable_Column_SortState.NotSortable)
        expect(currentServicesSortState).toBe(DataTable_Column_SortState.NotSortable)
        expect(currentWorkAuthStatusSortState).toBe(DataTable_Column_SortState.NotSortable)
      })
    })

    test('Jobs Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const table = jobsPage.DataTable_Jobs

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

    test('Jobs Table - Verify Action Menu: Open Job', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const table = jobsPage.DataTable_Jobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobsTableMessage)
        return
      }

      // Make sure the columns we need are visible
      await jobsPage.ShowAllColumns()

      // grab the target job href
      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition, true)
      const targetJobHref = await table.FetchRowHrefDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Jobs_JobId
      )

      // open the job
      await jobsPage.SelectActionMenuItem(rowIndex, Jobs_DataTable_ActionMenuItems.OpenJob)

      // verify we navigated to the job page of the target
      expect(jobsPage.page.url().endsWith(`${targetJobHref}/info`)).toBe(true)
    })

    test('Jobs Table - Verify Action Menu: Copy Job ID', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const table = jobsPage.DataTable_Jobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobsTableMessage)
        return
      }

      // Make sure the columns we need are visible
      await jobsPage.ShowAllColumns()

      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition, true)
      const targetJobHref = await table.FetchRowHrefDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Jobs_JobId
      )
      const targetJobID = targetJobHref.split('/')[2]

      await jobsPage.SelectActionMenuItem(rowIndex, Jobs_DataTable_ActionMenuItems.CopyJobID)

      // Verify clipboard contains the job ID
      const copiedJobID = await jobsPage.GetClipboardText()
      expect(targetJobID).toBe(copiedJobID)
    })

    test('Jobs Table - Verify JobID/Link button', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const table = jobsPage.DataTable_Jobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobsTableMessage)
        return
      }

      // Make sure the columns we need are visible
      await jobsPage.ShowAllColumns()

      // grab the target job href
      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition, true)
      const targetJobHref = await table.FetchRowHrefDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Jobs_JobId
      )

      // open the job by clicking on the job link
      await table.ClickLinkInDataCell(rowIndex, DataTable_Columns_Type.Jobs_JobId)

      // verify we navigated to the job page of the target
      expect(jobsPage.page.url().endsWith(`${targetJobHref}/info`)).toBe(true)
    })

    test('Jobs Table - Copy Job ID (clipboard icon)', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const table = jobsPage.DataTable_Jobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobsTableMessage)
        return
      }

      // Make sure the columns we need are visible
      await jobsPage.ShowAllColumns()

      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition, true)
      const targetJobHref = await table.FetchRowHrefDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Jobs_JobId
      )
      const targetJobID = targetJobHref.split('/')[2]

      await table.ClickButtonInDataCell(rowIndex, DataTable_Columns_Type.Jobs_JobId)

      // Verify clipboard contains the job ID
      const copiedJobID = await jobsPage.GetClipboardText()
      expect(targetJobID).toBe(copiedJobID)
    })

    test('Jobs Table - Selection', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const table = jobsPage.DataTable_Jobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobsTableMessage)
        return
      }

      const pageInfo = await table.GetPageInfo()

      // Check the selection checkbox of any claim row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1, true)
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

    test('Jobs Table - Verify Assign <Contact> Dialog UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const table = jobsPage.DataTable_Jobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobsTableMessage)
        return
      }

      // Check the selection checkbox of any claim row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1, true)
      await table.SelectRowByIndex(rowIndex, true)

      // Verify required action button appears above the table
      expect(await table.Button_Selection_AssignContact.IsVisible()).toBe(true)

      // Click the Assign Contact Button and choose a contact type from the menu
      const assignContactDialog = await table.OpenAssignContact(JobAssignContactOptions.Coordinator)

      // Verify the Assign <Contact> dialog - Heading is "Assign <Contact>" where <Contact> is the menu selection
      await assignContactDialog.VerifyTitle()

      // Verify Assign <Contact> dialog - closes with click on "X" button
      await assignContactDialog.Close()
      await expect(assignContactDialog.Title.locator).not.toBeAttached()
      await jobsPage.page.waitForTimeout(1000)
    })

    test('Jobs Table - Validate Assign <Contact> Dialog', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const table = jobsPage.DataTable_Jobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobsTableMessage)
        return
      }

      // Check the selection checkbox of any claim row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1, true)
      await table.SelectRowByIndex(rowIndex, true)

      // Verify action buttons appear above the table: (Assign Contact/Add Tags/Add Timeline Event)
      expect(await table.Button_Selection_AssignContact.IsVisible()).toBe(true)

      // Click the Assign Contact Button and choose a contact type from the menu
      const assignContactDialog = await table.OpenAssignContact(JobAssignContactOptions.Dispatcher)

      // Click the Submit button without choose a contact
      await assignContactDialog.Button_Submit.Click()

      // Validate the dialog error handling
      await assignContactDialog.Validate()
    })

    test('Jobs Table - VerifyAdd Tags Dialog UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const table = jobsPage.DataTable_Jobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobsTableMessage)
        return
      }

      // Check the selection checkbox of any claim row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1, true)
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
      await jobsPage.page.waitForTimeout(1000)

      // Verify Add Tags dialog - closes with ESC key
      addTagsDialog = await table.OpenAddTags()
      await addTagsDialog.Close(true)
      await expect(addTagsDialog.Title.locator).not.toBeAttached()
      await jobsPage.page.waitForTimeout(1000)

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

    test('Jobs Table - Validate Add Tags Dialog', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const table = jobsPage.DataTable_Jobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobsTableMessage)
        return
      }

      // Check the selection checkbox of any claim row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1, true)
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

    test('Jobs Table - Add/Remove Tag', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify ClaimsPortal page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const table = jobsPage.DataTable_Jobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyJobsTableMessage)
        return
      }

      // Make sure the columns we need are visible
      await jobsPage.ShowAllColumns()

      // Check the selection checkbox of any claim row on the table
      const rowIndex = await table.FetchRowIndexFromRowPosition(1, true)
      await table.SelectRowByIndex(rowIndex, true)

      // if our test tag already exists on this claim, remove it
      const testTag = 'AutomatedTestTag'
      const testTagValue = 'TestValue'
      const testTagColor = '#C8C800'
      const tagExists = await table.TagIsAddedByIndex(rowIndex, testTag, testTagValue)
      if (tagExists) {
        await table.RemoveTagWithValueByIndex(rowIndex, testTag, testTagValue)
      }
      // add the test tag
      await table.AddTag(testTag, testTagValue, testTagColor)
      // tag should exist now
      expect(await table.TagWithValueIsAddedByIndex(rowIndex, testTag, testTagValue)).toBe(true)
      await jobsPage.page.waitForTimeout(2000)
      // remove the test tag
      await table.RemoveTagWithValueByIndex(rowIndex, testTag, testTagValue)
      await jobsPage.page.waitForTimeout(2000)
      // tag should not exist now
      expect(await table.TagWithValueIsAddedByIndex(rowIndex, testTag, testTagValue)).toBe(false)
    })

    test('Jobs Table - Pagination: Show List', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const table = jobsPage.DataTable_Jobs

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
        await jobsPage.page.waitForTimeout(1000)
        const pageData = await table.GetPageInfo()
        if (pageData.maxPage == 1) {
          expect(pageData.currentPageRowCount).toBeLessThanOrEqual(pageSize)
        } else {
          expect(pageData.currentPageRowCount).toBe(pageSize)
        }
      }
    })

    test('Jobs Table - Pagination: Navigation Buttons', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const table = jobsPage.DataTable_Jobs

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await jobsPage.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage).toBe(1)

      // make sure we are on the first page
      if (await table.Button_GoToFirstPage.IsEnabled()) {
        await table.Button_GoToFirstPage.Click()
        await jobsPage.page.waitForTimeout(1000)
      }
      // Verify the First and Previous buttons are disabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(false)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)

      await table.Button_GoToNextPage.Click()
      await jobsPage.page.waitForTimeout(1000)
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
      await jobsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // Verify the First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(true)
      // Verify the Next and Last buttons are disabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(false)

      await table.Button_GoToPreviousPage.Click()
      await jobsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // If we are not on the first page, verify First and Previous buttons are disabled
      // If we are on the first page, verify First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      expect(await table.Button_GoToFirstPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)
    })

    test('Jobs Table - Pagination: Go To Page', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const table = jobsPage.DataTable_Jobs

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await jobsPage.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      //If the table is <= 10 entries, we cannot perform this test
      if (pageData.maxPage == 1) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      // Check Last Page
      await table.Pagination_GotoPage(lastPage)
      await jobsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display Y of Y where Y is the max page ie 3 of 3
      expect(pageData.currentPage).toBe(lastPage)

      // Check First Page
      await table.Pagination_GotoPage(1)
      await jobsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display 1 of Y where Y is the max page ie 1 of 3
      expect(pageData.currentPage).toBe(1)

      // if Max Pages are > 2, test an intermediate number
      if (lastPage > 2) {
        // Check random middle page
        const randomPage = Math.floor(Math.random() * (lastPage - 2) + 2)
        await table.Pagination_GotoPage(randomPage)
        await jobsPage.page.waitForTimeout(1000)
        pageData = await table.GetPageInfo()

        //Verify we display X of Y where Y is the max page and X is the Random page ie 4 of 7
        expect(pageData.currentPage).toBe(randomPage)
      }
    })

    test('Create Job - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()

      let createJobDrawer = await jobsPage.OpenCreateJobDrawer()

      // Verify drawer heading is "Create Job"
      createJobDrawer.VerifyTitle()
      expect(createJobDrawer.ComboBox_Claim_Select).toBeAttached()
      expect(createJobDrawer.ListBox_JobType).toBeAttached()
      expect(createJobDrawer.TextArea_Description.locator).toBeAttached()
      expect(createJobDrawer.ListBox_AddressType).toBeAttached()
      expect(createJobDrawer.TextBox_AddressLine1.locator).toBeAttached()
      expect(createJobDrawer.TextBox_AddressLine2.locator).toBeAttached()
      expect(createJobDrawer.TextBox_AddressLine3.locator).toBeAttached()
      expect(createJobDrawer.TextBox_City.locator).toBeAttached()
      expect(createJobDrawer.ListBox_State).toBeAttached()
      expect(createJobDrawer.TextBox_ZipCode.locator).toBeAttached()
      expect(createJobDrawer.TextBox_County.locator).toBeAttached()
      expect(createJobDrawer.ListBox_Country).toBeAttached()

      // Verify drawer closes with click on "X" button
      await createJobDrawer.Close()
      await expect(createJobDrawer.Title.locator).not.toBeAttached()
      await createJobDrawer.page.waitForTimeout(1000)

      createJobDrawer = await jobsPage.OpenCreateJobDrawer()
      // Verify drawer closes with ESC key
      await createJobDrawer.Close(true)
      await expect(createJobDrawer.Title.locator).not.toBeAttached()
      await createJobDrawer.page.waitForTimeout(1000)

      createJobDrawer = await jobsPage.OpenCreateJobDrawer()
      // Verify drawer closes if click on Close
      await createJobDrawer.Button_Close.Click()
      await expect(createJobDrawer.Title.locator).not.toBeAttached()
      await createJobDrawer.page.waitForTimeout(1000)
    })

    test('Create Job - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Jobs Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()

      const createJobDrawer = await jobsPage.OpenCreateJobDrawer()
      await createJobDrawer.Button_Submit.Click()

      await createJobDrawer.Validate()
    })
  }
)
