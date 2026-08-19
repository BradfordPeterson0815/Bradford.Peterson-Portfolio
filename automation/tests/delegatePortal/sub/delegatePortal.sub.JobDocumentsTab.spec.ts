import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedJobTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
  JobTabTypes,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { FetchCannedJob } from '../../../library/delegatePortal/delegatePortalHelper.js'
import { LaunchSubcontractor } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalJobPage } from '../../../library/delegatePortal/pages/delegatePortalJobPage.js'
import { DelegatePortalJobDocumentsTab } from '../../../library/delegatePortal/tabs/delegatePortalJobDocumentsTab.js'
import { DelegatePortalJobPhotoReportPage } from '../../../library/delegatePortal/tabs/delegatePortalJobPhotoReportTab.js'
import { AbortTest } from '../../../library/shared/commonHelper.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Job Page: Documents Tab',
  {
    tag: [Tags.Delegate, Tags.Subcontractor, Tags.Job, Tags.Documents],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Select the Documents Tab
      const documentsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Documents
      )) as DelegatePortalJobDocumentsTab
      expect(await jobPage.IsTabActive(JobTabTypes.Documents)).toBe(true)
      expect(jobPage.page.url()).toBe(documentsTab.URL)

      await documentsTab.Title.VerifyExpectedText()
      await expect(documentsTab.Link_CreatePhotoReport.locator).toBeVisible()
      await expect(documentsTab.Link_UploadDocuments.locator).toBeVisible()

      await documentsTab.page.waitForTimeout(2000)

      if (!(await documentsTab.IsTabEmpty())) {
        expect(await documentsTab.DataTable_Documents.IsVisible()).toBe(true)
      } else {
        await expect(documentsTab.Label_Empty_Title.locator).toBeVisible()
        await documentsTab.Label_Empty_Title.VerifyExpectedText()
        await documentsTab.Label_Empty_Description.VerifyExpectedText()
        await expect(documentsTab.Link_Empty_UploadDocuments.locator).toBeVisible()
      }

      // Click the Create Photo Report link ...
      await documentsTab.Link_CreatePhotoReport.Click()

      // Verify navigation to Create Photo Report page
      const photoReportPage = new DelegatePortalJobPhotoReportPage(global, testJob)
      expect(documentsTab.page.url()).toBe(photoReportPage.URL)
    })

    test('Documents Table - Sort Columns', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Select the Documents Tab
      const documentsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Documents
      )) as DelegatePortalJobDocumentsTab
      const table = documentsTab.DataTable_Documents

      // Make sure the columns we need are visible
      const tableSettingsDialog = await table.OpenTableSettings()
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Documents_File)
      await tableSettingsDialog.CheckColumn(DataTable_Columns_Type.Documents_Description)
      await tableSettingsDialog.Close()

      // Examine File and Description columns
      // Verify initial states are unsorted
      const initialFileSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Documents_File
      )
      const initialDescriptionSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Documents_Description
      )
      expect(initialFileSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(initialDescriptionSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the File column Sort icon to Down (high to low)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Documents_File,
        DataTable_Column_SortState.Down_HighToLow
      )

      // Verify File is sorted Down and Description is still unsorted
      let currentFileSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Documents_File
      )
      let currentDescriptionSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Documents_Description
      )
      expect(currentFileSortState).toBe(DataTable_Column_SortState.Down_HighToLow)
      expect(currentDescriptionSortState).toBe(DataTable_Column_SortState.Unsorted)

      // Set the Description column Sort icon to Up (low to high)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Documents_Description,
        DataTable_Column_SortState.Up_LowToHigh
      )

      // Verify File is now unsorted and Description is sorted Up
      currentFileSortState = await table.FetchColumnSortState(DataTable_Columns_Type.Documents_File)
      currentDescriptionSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Documents_Description
      )
      expect(currentFileSortState).toBe(DataTable_Column_SortState.Unsorted)
      expect(currentDescriptionSortState).toBe(DataTable_Column_SortState.Up_LowToHigh)

      // Set the Description column Sort icon to Unsorted
      await table.SetColumnSortState(
        DataTable_Columns_Type.Documents_Description,
        DataTable_Column_SortState.Unsorted
      )
      currentDescriptionSortState = await table.FetchColumnSortState(
        DataTable_Columns_Type.Documents_Description
      )
      expect(currentDescriptionSortState).toBe(DataTable_Column_SortState.Unsorted)
    })

    test('Documents Table - Verify File link for viewable file', async ({
      browser,
      browserName,
      headless,
    }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)
      const downloading = browserName === 'chromium' && headless === true

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Select the Documents Tab
      const documentsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Documents
      )) as DelegatePortalJobDocumentsTab
      const table = documentsTab.DataTable_Documents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentsTableMessage)
        return
      }

      // find the test file
      const rowIndex = await table.FetchRowIndexOfDataByColumnName(
        testJob.testData.document,
        DataTable_Columns_Type.Documents_File
      )

      if (rowIndex == null) {
        throw new Error('Unable to find document needed for the test')
      }

      // open document in a new tab from file link
      await documentsTab.OpenDocumentLinkInNewTabVerifyAndClose(rowIndex, downloading)
    })

    test('Documents Table - Verify File link for previous version of viewable file', async ({
      browser,
      browserName,
      headless,
    }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)
      const downloading = browserName === 'chromium' && headless === true

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Select the Documents Tab
      const documentsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Documents
      )) as DelegatePortalJobDocumentsTab
      const table = documentsTab.DataTable_Documents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentsTableMessage)
        return
      }

      // find the versioned test file
      const rowIndex = await table.FetchRowIndexOfDataByColumnName(
        testJob.testData.versionedDocument,
        DataTable_Columns_Type.Documents_File
      )

      if (rowIndex == null) {
        throw new Error('Unable to find document needed for the test')
      }

      // open versioned document in a new tab from file link
      await documentsTab.OpenVersionedDocumentLinkInNewTabVerifyAndClose(
        rowIndex,
        2,
        false,
        downloading
      )
    })

    test('Documents Table - Update Document Information: Verify Drawer UI', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Select the Documents Tab
      const documentsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Documents
      )) as DelegatePortalJobDocumentsTab
      const table = documentsTab.DataTable_Documents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentsTableMessage)
        return
      }

      // Set the File column Sort icon to Down (high to low)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Documents_File,
        DataTable_Column_SortState.Down_HighToLow
      )

      // Open the Update Document Information Drawer for a document
      const rowIndex = await table.FetchRowIndexFromRowPosition(2)
      let updateDocumentInformationDrawer =
        await documentsTab.OpenUpdateDocumentInformationDrawer(rowIndex)

      //Verify drawer heading is "Update Document Information"
      updateDocumentInformationDrawer.VerifyTitle()
      expect(updateDocumentInformationDrawer.Link_OpenDocumentPreview.locator).toBeAttached()
      expect(updateDocumentInformationDrawer.TextBox_Title.locator).toBeAttached()
      expect(updateDocumentInformationDrawer.TextBox_Description.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await updateDocumentInformationDrawer.Close()
      await expect(updateDocumentInformationDrawer.Title.locator).not.toBeAttached()
      await documentsTab.page.waitForTimeout(1000)

      updateDocumentInformationDrawer =
        await documentsTab.OpenUpdateDocumentInformationDrawer(rowIndex)
      // Verify drawer closes with ESC key
      await updateDocumentInformationDrawer.Close(true)
      await expect(updateDocumentInformationDrawer.Title.locator).not.toBeAttached()
      await documentsTab.page.waitForTimeout(1000)

      updateDocumentInformationDrawer =
        await documentsTab.OpenUpdateDocumentInformationDrawer(rowIndex)
      // Verify drawer closes if click on Cancel
      await updateDocumentInformationDrawer.Button_Cancel.Click()
      await expect(updateDocumentInformationDrawer.Title.locator).not.toBeAttached()
      await documentsTab.page.waitForTimeout(1000)
    })

    test('Documents Table - Update Document Information: Validate Drawer', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Select the Documents Tab
      const documentsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Documents
      )) as DelegatePortalJobDocumentsTab
      const table = documentsTab.DataTable_Documents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentsTableMessage)
        return
      }

      // Set the File column Sort icon to Down (high to low)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Documents_File,
        DataTable_Column_SortState.Down_HighToLow
      )

      // Open the Update Document Information Drawer for a document
      const rowIndex = await table.FetchRowIndexFromRowPosition(2)
      const updateDocumentInformationDrawer =
        await documentsTab.OpenUpdateDocumentInformationDrawer(rowIndex)

      // Clear the Title text box
      await updateDocumentInformationDrawer.TextBox_Title.locator.clear()

      // Click the Submit button
      await updateDocumentInformationDrawer.Button_Submit.Click()
      await documentsTab.page.waitForTimeout(1000)

      // Verify validation message for the drawer with an empty Title field
      expect(await updateDocumentInformationDrawer.Validate()).toBe(true)

      // Click Cancel to close the drawer
      await updateDocumentInformationDrawer.Button_Cancel.Click()
    })

    test('Documents Table - Update Document Information', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Select the Documents Tab
      const documentsTab = (await jobPage.SelectJobTab(
        JobTabTypes.Documents
      )) as DelegatePortalJobDocumentsTab
      const table = documentsTab.DataTable_Documents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentsTableMessage)
        return
      }

      // Set the File column Sort icon to Up (low to high) - should give us a non versioned document
      await table.SetColumnSortState(
        DataTable_Columns_Type.Documents_File,
        DataTable_Column_SortState.Up_LowToHigh
      )

      // setup modified description
      const dateSuffix = `+${Date.now()}`
      const modifiedDescription = `${testJob.testData.documentDescription}${dateSuffix}`

      // Set the File column Sort icon to Down (high to low)
      await table.SetColumnSortState(
        DataTable_Columns_Type.Documents_File,
        DataTable_Column_SortState.Down_HighToLow
      )

      //  // get the current description value
      const rowIndex = await table.FetchRowIndexFromRowPosition(2)
      const initialDescription = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Documents_Description
      )

      // Open the Update Document Information Drawer for first document entry
      const updateDocumentInformationDrawer =
        await documentsTab.OpenUpdateDocumentInformationDrawer(rowIndex)

      // update the document description
      await updateDocumentInformationDrawer.TextBox_Description.Fill(modifiedDescription)

      // Click the Submit button
      await updateDocumentInformationDrawer.Button_Submit.Click()

      // give some time for this to propagate
      await documentsTab.page.waitForTimeout(4000)

      const updatedDescription = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Documents_Description
      )

      // make sure the updatedDescription is NOT the same as the initial description
      expect(updatedDescription).not.toBe(initialDescription)

      // make sure the updatedDescription IS the same as the modified description
      expect(updatedDescription).toBe(modifiedDescription)
    })
  }
)
