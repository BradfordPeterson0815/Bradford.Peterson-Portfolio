import { expect } from '@playwright/test'
import test from '../../library/shared/testHooks.js'
import { FetchCannedClaim, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import {
  DefaultEnvironment,
  CannedClaimTypes,
  ClaimTabTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  Jobs_DataTable_ActionMenuItems,
  AbortErrors,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { ClaimsPortalClaimPage } from '../../library/claimsPortal/pages/claimsPortalClaimPage.js'
import { ClaimsPortalClaimJobsTab } from '../../library/claimsPortal/tabs/claimsPortalClaimJobsTab.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import { Tags } from '../../library/shared/constants.js'
import { ClaimsPortalClaimsPage } from '../../library/claimsPortal/pages/claimsPortalClaimsPage.js'

const environment = DefaultEnvironment
test.describe(
  'Claim Page: Jobs Tab',
  {
    tag: [Tags.ClaimsPortal, Tags.Claim, Tags.Jobs],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // find a random claim and go to it
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage } = await claimsPage.OpenRandomClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Jobs tab
      const jobsTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Jobs)) as ClaimsPortalClaimJobsTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Jobs)).toBe(true)
      expect(claimPage.page.url()).toBe(jobsTab.URL)
      const table = jobsTab.DataTable_Jobs

      // Verify Title for Jobs Table
      await jobsTab.Title.VerifyExpectedText()

      // Verify Contacts Table layout...
      // Verify Contacts Column Settings / Filters / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)

      // Check table settings dialog and columns
      await jobsTab.VerifyTableSettingColumns()

      // Verify Create Jobs drawer...
      const createJobDrawer = await jobsTab.OpenCreateJobDrawer()

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
      await createJobDrawer.Close()
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Jobs tab
      const jobsTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Jobs)) as ClaimsPortalClaimJobsTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Jobs)).toBe(true)
      expect(claimPage.page.url()).toBe(jobsTab.URL)
      const table = jobsTab.DataTable_Jobs

      // Verify Title
      await jobsTab.Title.VerifyExpectedText()

      // Verify Table exists
      expect(await table.IsVisible()).toBe(true)

      // Verify Create Job button exists
      expect(await jobsTab.Button_CreateJob.IsVisible()).toBe(true)

      // Verify Jobs Table layout...
      // Verify Column Settings / Filters / Expand button
      expect(await table.Button_OpenTableSettings.IsVisible()).toBe(true)
      expect(await table.Button_ExpandTable.IsVisible()).toBe(true)
      expect(await table.Button_CloseTable.IsVisible()).toBe(false)
    })

    test('Jobs Table - Settings: Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Jobs tab
      const jobsTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Jobs)) as ClaimsPortalClaimJobsTab
      const table = jobsTab.DataTable_Jobs

      // Click the Open Table Settings button on the Jobs Table
      const tableSettingsDialog = await table.OpenTableSettings()

      // Verify the Table Settings popup - Heading is "Table Settings"
      await tableSettingsDialog.VerifyTitle()

      // Verify the Table Settings popup - Description  is "Column Settings"
      await tableSettingsDialog.VerifyDescription()

      // Verify Table Settings popup - closes with click on "X" button
      await tableSettingsDialog.Close()
      await expect(tableSettingsDialog.Title.locator).not.toBeAttached()
      await jobsTab.page.waitForTimeout(1000)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Jobs Table - Settings: Verify Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new ClaimsPortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Jobs tab
        const jobsTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Jobs)) as ClaimsPortalClaimJobsTab
        const table = jobsTab.DataTable_Jobs

        // Click the Open Table Settings button on the Portal Access Table
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
        await tableSettingsDialog.UncheckColumn(DataTable_Columns_Type.Jobs_Location)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Location)).toBe(false)
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
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Location)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Location)).toBe(true)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Tags)
        expect(await table.IsColumnVisible(DataTable_Columns_Type.Jobs_Tags)).toBe(true)
        await tableSettingsDialog.Close()
      })

      test('Jobs Table - Sort Columns', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new ClaimsPortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Jobs tab
        const jobsTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Jobs)) as ClaimsPortalClaimJobsTab
        const table = jobsTab.DataTable_Jobs

        // Make sure the columns we need are visible
        const tableSettingsDialog = await table.OpenTableSettings()
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Status)
        await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Jobs_Description)
        await tableSettingsDialog.Close()

        // Examine Status and Description columns
        // Verify initial states are unsorted
        const initialStatusSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Status
        )
        const initialDescriptionSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Description
        )
        expect(initialStatusSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(initialDescriptionSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Status column Sort icon to Down (high to low)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Jobs_Status,
          DataTable_Column_SortState.Down_HighToLow
        )

        // Verify Status is sorted Down and Description is still unsorted
        let currentStatusSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Status
        )
        let currentDescriptionSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Description
        )
        expect(currentStatusSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
        expect(currentDescriptionSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Set the Description column Sort icon to Up (low to high)
        await table.SetColumnSortState(
          DataTable_Columns_Type.Jobs_Description,
          DataTable_Column_SortState.Up_LowToHigh
        )

        // Verify Status is now unsorted and Description is sorted Up
        currentStatusSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Status
        )
        currentDescriptionSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Description
        )
        expect(currentStatusSortState).toBe(DataTable_Column_SortState.Unsorted)
        expect(currentDescriptionSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

        // Set the Description column Sort icon to Unsorted
        await table.SetColumnSortState(
          DataTable_Columns_Type.Jobs_Description,
          DataTable_Column_SortState.Unsorted
        )
        currentDescriptionSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Description
        )
        expect(currentDescriptionSortState).toBe(DataTable_Column_SortState.Unsorted)

        // Verify Users, Services, Location and Tags cannot be sorted
        const currentUserSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Users
        )
        const currentServicesSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Services
        )
        const currentLocationSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Location
        )
        const currentTagsSortState = await table.FetchColumnSortState(
          DataTable_Columns_Type.Jobs_Tags
        )
        expect(currentUserSortState).toBe(DataTable_Column_SortState.NotSortable)
        expect(currentServicesSortState).toBe(DataTable_Column_SortState.NotSortable)
        expect(currentLocationSortState).toBe(DataTable_Column_SortState.NotSortable)
        expect(currentTagsSortState).toBe(DataTable_Column_SortState.NotSortable)
      })
    })

    test('Jobs Table - Expand and Collapse', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Jobs tab
      const jobsTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Jobs)) as ClaimsPortalClaimJobsTab
      const table = jobsTab.DataTable_Jobs

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

    test('Jobs Table - Verify Action Menu: Copy Job ID', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Jobs tab
      const jobsTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Jobs)) as ClaimsPortalClaimJobsTab
      const table = jobsTab.DataTable_Jobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimJobsTableMessage)
        return
      }

      // grab the target job href
      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
      const targetJobHref = await table.FetchRowHrefDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Jobs_JobId
      )

      await jobsTab.SelectActionMenuItem(rowIndex, Jobs_DataTable_ActionMenuItems.CopyJobID)
      const copiedID = await jobsTab.GetClipboardText()

      // Verify clipboard contains job ID
      expect(targetJobHref).toContain(copiedID)
    })

    test('Jobs Table - Verify Action Menu: Open Job', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Jobs tab
      const jobsTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Jobs)) as ClaimsPortalClaimJobsTab
      const table = jobsTab.DataTable_Jobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimJobsTableMessage)
        return
      }

      // grab the target job href
      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
      const targetJobHref = await table.FetchRowHrefDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Jobs_JobId
      )

      // open the job
      await jobsTab.SelectActionMenuItem(rowIndex, Jobs_DataTable_ActionMenuItems.OpenJob)

      // verify we navigated to the job page of the target
      expect(claimPage.page.url().endsWith(`${targetJobHref}/info`)).toBe(true)
    })

    test('Jobs Table: Verify Job ID/Link button', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Jobs tab
      const jobsTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Jobs)) as ClaimsPortalClaimJobsTab
      const table = jobsTab.DataTable_Jobs

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyClaimJobsTableMessage)
        return
      }

      // grab the target job href
      const rowPosition = 1
      const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
      const targetJobHref = await table.FetchRowHrefDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Jobs_JobId
      )

      await table.ClickLinkInDataCell(rowIndex, DataTable_Columns_Type.Jobs_JobId)

      // verify we navigated to the job page of the target
      expect(claimPage.page.url().endsWith(`${targetJobHref}/info`)).toBe(true)
    })

    test('Create Job - Verify Drawer UI', async ({ browser }) => {
      /// launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Jobs tab
      const jobsTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Jobs)) as ClaimsPortalClaimJobsTab

      let createJobDrawer = await jobsTab.OpenCreateJobDrawer()

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

      createJobDrawer = await jobsTab.OpenCreateJobDrawer()
      // Verify drawer closes with ESC key
      await createJobDrawer.Close(true)
      await expect(createJobDrawer.Title.locator).not.toBeAttached()
      await createJobDrawer.page.waitForTimeout(1000)

      createJobDrawer = await jobsTab.OpenCreateJobDrawer()
      // Verify drawer closes if click on Close
      await createJobDrawer.Button_Close.Click()
      await expect(createJobDrawer.Title.locator).not.toBeAttached()
      await createJobDrawer.page.waitForTimeout(1000)
    })

    test('Create Job - Validate Drawer', async ({ browser }) => {
      /// launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Jobs tab
      const jobsTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Jobs)) as ClaimsPortalClaimJobsTab

      const createJobDrawer = await jobsTab.OpenCreateJobDrawer()
      await createJobDrawer.Button_Submit.Click()

      await createJobDrawer.Validate()
    })
  }
)
