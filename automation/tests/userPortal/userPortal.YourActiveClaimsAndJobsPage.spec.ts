import { expect } from '@playwright/test'
import { AbortTest } from '../../library/shared/commonHelper.js'
import { Tags } from '../../library/shared/constants.js'
import test from '../../library/shared/testHooks.js'
import { UserPortalClaimDetailsPage } from '../../library/userPortal/pages/userPortalClaimDetailsPage.js'
import { UserPortalJobDetailsPage } from '../../library/userPortal/pages/userPortalJobDetailsPage.js'
import {
  AbortErrors,
  CannedClaimTypes,
  CannedJobTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DataTable_ShowPageSize_Options,
  DefaultEnvironment,
} from '../../library/userPortal/userPortalConstants.js'
import { FetchCannedClaim, FetchCannedJob, Launch } from '../../library/userPortal/userPortalHelper.js'
const environment = DefaultEnvironment

test.describe(
  'Your Active Claims and Jobs Page',
  {
    tag: [Tags.UserPortal, Tags.ClaimsPortal, Tags.Jobs],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)

      // Verify page layout
      await activeClaimsAndJobsPage.VerifyTitle()
      await activeClaimsAndJobsPage.WaitForLoad()
      await activeClaimsAndJobsPage.page.waitForTimeout(4000)

      // Verify that there is both a Claims table and a Jobs table
      expect(await activeClaimsAndJobsPage.DataTable_Claims.IsVisible()).toBe(true)
      expect(await activeClaimsAndJobsPage.DataTable_Jobs.IsVisible()).toBe(true)

      // Verify Claims Table layout...
      // Verify Claims Column Settings / Expand button
      expect(
        await activeClaimsAndJobsPage.DataTable_Claims.Button_OpenTableSettings.IsVisible()
      ).toBe(true)
      expect(await activeClaimsAndJobsPage.DataTable_Claims.Button_ExpandTable.IsVisible()).toBe(
        true
      )
      expect(await activeClaimsAndJobsPage.DataTable_Claims.Button_CloseTable.IsVisible()).toBe(
        false
      )

      // Verify Jobs Table layout...
      // Verify Jobs Column Settings / Expand button
      expect(
        await activeClaimsAndJobsPage.DataTable_Jobs.Button_OpenTableSettings.IsVisible()
      ).toBe(true)
      expect(await activeClaimsAndJobsPage.DataTable_Jobs.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await activeClaimsAndJobsPage.DataTable_Jobs.Button_CloseTable.IsVisible()).toBe(false)
    })

    test('Claims Table - Settings: Verify UI', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)
      const table = activeClaimsAndJobsPage.DataTable_Claims

      // Click the Open Table Settings button on the Claims Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
    })

    test('Claims Table - Settings: Verify Columns', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)
      const table = activeClaimsAndJobsPage.DataTable_Claims

      // Click the Open Table Settings button on the Claims Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify that each column checkbox hides the corresponding table column when unchecked
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_ClaimNumber)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimNumber)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_LossType)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_LossType)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_LossDate)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_LossDate)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Claims_Location)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Location)).toBe(false)

      // Verify that each column checkbox shows the corresponding table column when checked
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_ClaimNumber)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_ClaimNumber)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_LossType)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_LossType)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_LossDate)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_LossDate)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Claims_Location)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Claims_Location)).toBe(true)
    })

    test('Claims Table - Expand and Collapse', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)
      const table = activeClaimsAndJobsPage.DataTable_Claims

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

    test('Claims Table - Open Claim via Claim Number link', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const claim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const { global, activeClaimsAndJobsPage } = await Launch(browser, environment)
      const table = activeClaimsAndJobsPage.DataTable_Claims

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimsTableMessage)
        return
      }

      await table.SetTableFilter_Text(
        claim.claimProcess.claimNumber,
        DataTable_Columns_Type.Claims_ClaimNumber
      )
      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
      await table.ClickLinkInDataCell(rowIndex, DataTable_Columns_Type.Claims_ClaimNumber)
      const claimDetailsPage = new UserPortalClaimDetailsPage(global, claim)
      await activeClaimsAndJobsPage.page.waitForURL(claimDetailsPage.URL)
      // verify we navigated to the claim page of the target
      expect(
        activeClaimsAndJobsPage.page.url().endsWith(`claim/${claim.claimProcess.claimNumber}/info`)
      ).toBe(true)
    })

    test('Claims Table - Sort Columns', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)
      const table = activeClaimsAndJobsPage.DataTable_Claims

      // Examine Claim Number and Loss Type columns
      // Verify initial states are unsorted
      const initialClaimNumberSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Claims_ClaimNumber
      )
      const initialLossTypeSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Claims_LossType
      )
      expect(initialClaimNumberSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(initialLossTypeSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the Claim number column Sort icon to Down (high to low)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Claims_ClaimNumber,
        DataTable_Column_SortState.Down_HighToLow
      )

      // Verify Claim number is sorted Down and LossType is still unsorted
      let currentClaimNumberSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Claims_ClaimNumber
      )
      let currentLossTypeSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Claims_LossType
      )
      expect(currentClaimNumberSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
      expect(currentLossTypeSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the LossType column Sort icon to Up (low to high)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Claims_LossType,
        DataTable_Column_SortState.Up_LowToHigh
      )

      // Verify Claim number is now unsorted and LossType is sorted Up
      currentClaimNumberSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Claims_ClaimNumber
      )
      currentLossTypeSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Claims_LossType
      )
      expect(currentClaimNumberSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(currentLossTypeSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

      // Set the LossType column Sort icon to Unsorted
      await table.SetColumnSortState(
        DataTable_Columns_Type.Claims_LossType,
        DataTable_Column_SortState.Unsorted
      )
      currentLossTypeSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Claims_LossType
      )
      expect(currentLossTypeSortState).toBe(DataTable_Column_SortState.Unsorted)
    })

    test('Claims Table - Pagination: Show List', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)
      const table = activeClaimsAndJobsPage.DataTable_Claims

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
        await activeClaimsAndJobsPage.page.waitForTimeout(1000)
        const pageData = await table.GetPageInfo()
        if (pageData.maxPage == 1) {
          expect(pageData.currentPageRowCount <= pageSize).toBe(true)
        } else {
          expect(pageData.currentPageRowCount == pageSize).toBe(true)
        }
      }
    })

    test('Claims Table - Pagination: Navigation Buttons', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)
      const table = activeClaimsAndJobsPage.DataTable_Claims

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage == 1).toBe(true)

      // make sure we are on the first page
      if (await table.Button_GoToFirstPage.IsEnabled()) {
        await table.Button_GoToFirstPage.Click()
        await activeClaimsAndJobsPage.page.waitForTimeout(1000)
      }
      // Verify the First and Previous buttons are disabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(false)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)

      await table.Button_GoToNextPage.Click()
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
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
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // Verify the First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(true)
      // Verify the Next and Last buttons are disabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(false)

      await table.Button_GoToPreviousPage.Click()
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // If we are not on the first page, verify First and Previous buttons are disabled
      // If we are on the first page, verify First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      expect(await table.Button_GoToFirstPage.IsEnabled()).not.toBe(pageData.currentPage == 1)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)
    })

    test('Claims Table - Pagination: Go To Page', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)
      const table = activeClaimsAndJobsPage.DataTable_Claims

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
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
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display Y of Y where Y is the max page ie 3 of 3
      expect(pageData.currentPage == lastPage).toBe(true)

      // Check First Page
      await table.Pagination_GotoPage(1)
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display 1 of Y where Y is the max page ie 1 of 3
      expect(pageData.currentPage == 1).toBe(true)

      // if Max Pages are > 2, test an intermediate number
      if (lastPage > 2) {
        // Check random middle page
        const randomPage = Math.floor(Math.random() * (lastPage - 2) + 2)
        await table.Pagination_GotoPage(randomPage)
        await activeClaimsAndJobsPage.page.waitForTimeout(1000)
        pageData = await table.GetPageInfo()

        //Verify we display X of Y where Y is the max page and X is the Random page ie 4 of 7
        expect(pageData.currentPage == randomPage).toBe(true)
      }
    })

    test('Jobs Table - Settings: Verify UI', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)
      const table = activeClaimsAndJobsPage.DataTable_Jobs

      // Click the Open Table Settings button on the Claims Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
    })

    test('Jobs Table - Settings: Verify Columns', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)
      const table = activeClaimsAndJobsPage.DataTable_Jobs

      // Click the Open Table Settings button on the Claims Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify that each column checkbox hides the corresponding table column when unchecked
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_JobID)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_JobID)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_Type)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Type)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_Services)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Services)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_Description)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Description)).toBe(false)
      await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_Location)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Location)).toBe(false)

      // Verify that each column checkbox shows the corresponding table column when checked
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_JobID)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_JobID)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Type)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Type)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Services)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Services)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Description)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Description)).toBe(true)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Location)
      expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Location)).toBe(true)
    })

    test('Jobs Table - Expand and Collapse', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)
      const table = activeClaimsAndJobsPage.DataTable_Jobs

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

    test('Jobs Table - Open Job via Job Number link', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const job = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const { global, activeClaimsAndJobsPage } = await Launch(browser, environment)
      const table = activeClaimsAndJobsPage.DataTable_Jobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimsTableMessage)
        return
      }

      await table.SetTableFilter_Text(job.jobDetails.jobId, DataTable_Columns_Type.Jobs_JobID)
      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
      await table.ClickLinkInDataCell(rowIndex, DataTable_Columns_Type.Jobs_JobID)
      const jobDetailsPage = new UserPortalJobDetailsPage(global, job)
      await activeClaimsAndJobsPage.page.waitForURL(jobDetailsPage.URL)
      // verify we navigated to the job page of the target
      expect(activeClaimsAndJobsPage.page.url().endsWith(`job/${job.jobDetails.jobId}/info`)).toBe(
        true
      )
    })

    test('Jobs Table - Sort Columns', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)
      const table = activeClaimsAndJobsPage.DataTable_Jobs

      // Examine Job and Type columns
      // Verify initial states are unsorted
      const initialJobSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Jobs_JobID
      )
      const initialTypeSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Jobs_Type
      )
      expect(initialJobSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(initialTypeSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the Job column Sort icon to Down (high to low)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Jobs_JobID,
        DataTable_Column_SortState.Down_HighToLow
      )

      // Verify Job is sorted Down and Type is still unsorted
      let currentJobSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Jobs_JobID)
      let currentTypeSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Jobs_Type)
      expect(currentJobSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
      expect(currentTypeSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the Type column Sort icon to Up (low to high)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Jobs_Type,
        DataTable_Column_SortState.Up_LowToHigh
      )

      // Verify Job is now unsorted and Type is sorted Up
      currentJobSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Jobs_JobID)
      currentTypeSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Jobs_Type)
      expect(currentJobSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(currentTypeSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

      // Set the Type column Sort icon to Unsorted
      await table.SetColumnSortState(
        DataTable_Columns_Type.Jobs_Type,
        DataTable_Column_SortState.Unsorted
      )
      currentTypeSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Jobs_Type)
      expect(currentTypeSortState).toBe(DataTable_Column_SortState.Unsorted)
    })

    test('Jobs Table - Pagination: Show List', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)
      const table = activeClaimsAndJobsPage.DataTable_Jobs

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
        await activeClaimsAndJobsPage.page.waitForTimeout(1000)
        const pageData = await table.GetPageInfo()
        if (pageData.maxPage == 1) {
          expect(pageData.currentPageRowCount <= pageSize).toBe(true)
        } else {
          expect(pageData.currentPageRowCount == pageSize).toBe(true)
        }
      }
    })

    test('Jobs Table - Pagination: Navigation Buttons', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)
      const table = activeClaimsAndJobsPage.DataTable_Jobs

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
      let pageData = await table.GetPageInfo()
      const lastPage = pageData.maxPage

      // Verify Page X of Y shows 1 of Y - we should be on the first
      expect(pageData.currentPage == 1).toBe(true)

      // make sure we are on the first page
      if (await table.Button_GoToFirstPage.IsEnabled()) {
        await table.Button_GoToFirstPage.Click()
        await activeClaimsAndJobsPage.page.waitForTimeout(1000)
      }
      // Verify the First and Previous buttons are disabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(false)
      // Verify the Next and Last buttons are enabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(true)

      await table.Button_GoToNextPage.Click()
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
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
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()
      // Verify the First and Previous buttons are enabled
      expect(await table.Button_GoToPreviousPage.IsEnabled()).toBe(true)
      expect(await table.Button_GoToFirstPage.IsEnabled()).toBe(true)
      // Verify the Next and Last buttons are disabled
      expect(await table.Button_GoToNextPage.IsEnabled()).toBe(false)
      expect(await table.Button_GoToLastPage.IsEnabled()).toBe(false)

      await table.Button_GoToPreviousPage.Click()
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
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
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)
      const table = activeClaimsAndJobsPage.DataTable_Jobs

      // we need at least 10 rows to do this test
      if (!(await table.IsPaginationActive())) {
        AbortTest(AbortErrors.PaginationNotEnoughEntries)
        return
      }

      await table.Pagination_SetPageSize(DataTable_ShowPageSize_Options.Show10)
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
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
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display Y of Y where Y is the max page ie 3 of 3
      expect(pageData.currentPage == lastPage).toBe(true)

      // Check First Page
      await table.Pagination_GotoPage(1)
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
      pageData = await table.GetPageInfo()

      //Verify we display 1 of Y where Y is the max page ie 1 of 3
      expect(pageData.currentPage == 1).toBe(true)

      // if Max Pages are > 2, test an intermediate number
      if (lastPage > 2) {
        // Check random middle page
        const randomPage = Math.floor(Math.random() * (lastPage - 2) + 2)
        await table.Pagination_GotoPage(randomPage)
        await activeClaimsAndJobsPage.page.waitForTimeout(1000)
        pageData = await table.GetPageInfo()

        //Verify we display X of Y where Y is the max page and X is the Random page ie 4 of 7
        expect(pageData.currentPage == randomPage).toBe(true)
      }
    })
  }
)
