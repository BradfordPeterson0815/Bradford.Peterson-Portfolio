import { expect } from '@playwright/test'
import { AbortTest } from '../../library/shared/commonHelper.js'
import { Tags } from '../../library/shared/constants.js'
import test from '../../library/shared/testHooks.js'
import { UserPortalJobDocumentsPage } from '../../library/userPortal/pages/userPortalJobDocumentsPage.js'
import {
  AbortErrors,
  CannedJobTypes,
  DataTable_Column_SortState,
  DataTable_Columns_Type,
  DefaultEnvironment,
} from '../../library/userPortal/userPortalConstants.js'
import { FetchCannedJob, LaunchJob } from '../../library/userPortal/userPortalHelper.js'

const environment = DefaultEnvironment

test.describe(
  'Job Documents Page',
  {
    tag: [Tags.UserPortal, Tags.Job, Tags.Documents],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch UserPortal - landing page is Details page
      const job = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const { global } = await LaunchJob(browser, environment, job)

      // Verify Documents page navigation
      const documentsPage = new UserPortalJobDocumentsPage(global, job)
      await documentsPage.NavigateToPage()
      const table = documentsPage.Documents.DataTable_Documents

      await documentsPage.VerifyJobNumber()
      await documentsPage.Documents.VerifyTitle()
      await expect(documentsPage.Documents.Link_UploadDocuments.locator).toBeVisible()
      await documentsPage.page.waitForTimeout(3000)

      if (!(await documentsPage.Documents.IsDocumentPageEmpty())) {
        expect(await table.IsVisible()).toBe(true)
      } else {
        await expect(documentsPage.Documents.Label_Empty_Title.locator).toBeVisible()
        await documentsPage.Documents.Label_Empty_Title.VerifyExpectedText()
        await documentsPage.Documents.Label_Empty_Description.VerifyExpectedText()
        await expect(documentsPage.Documents.Link_Empty_UploadDocuments.locator).toBeVisible()
      }
    })

    test('Documents Table - Sort Columns', async ({ browser }) => {
      // launch UserPortal - landing page is Details page
      const job = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const { global } = await LaunchJob(browser, environment, job)

      // Verify Documents page navigation
      const documentsPage = new UserPortalJobDocumentsPage(global, job)
      await documentsPage.NavigateToPage()
      const table = documentsPage.Documents.DataTable_Documents

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
      // launch UserPortal - landing page is Details page
      const job = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const { global } = await LaunchJob(browser, environment, job)
      const downloading = browserName === 'chromium' && headless === true

      // Verify Documents page navigation
      const documentsPage = new UserPortalJobDocumentsPage(global, job)
      await documentsPage.NavigateToPage()
      const table = documentsPage.Documents.DataTable_Documents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentsTableMessage)
        return
      }

      // find the test file
      const rowIndex = await table.FetchRowIndexOfDataByColumnName(
        job.testData.document,
        DataTable_Columns_Type.Documents_File
      )

      if (rowIndex == null) {
        throw new Error('Unable to find document needed for the test')
      }

      // open document in a new tab from file link
      await documentsPage.Documents.OpenDocumentLinkInNewTabVerifyAndClose(rowIndex, downloading)
    })

    test('Documents Table - Verify File link for previous version of viewable file', async ({
      browser,
      browserName,
      headless,
    }) => {
      // launch UserPortal - landing page is Details page
      const job = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const { global } = await LaunchJob(browser, environment, job)
      const downloading = browserName === 'chromium' && headless === true

      // Verify Documents page navigation
      const documentsPage = new UserPortalJobDocumentsPage(global, job)
      await documentsPage.NavigateToPage()
      const table = documentsPage.Documents.DataTable_Documents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentsTableMessage)
        return
      }

      // find the versioned test file
      const rowIndex = await table.FetchRowIndexOfDataByColumnName(
        job.testData.versionedDocument,
        DataTable_Columns_Type.Documents_File
      )

      if (rowIndex == null) {
        throw new Error('Unable to find document needed for the test')
      }

      // open versioned document in a new tab from file link
      await documentsPage.Documents.OpenVersionedDocumentLinkInNewTabVerifyAndClose(
        rowIndex,
        2,
        false,
        downloading
      )
    })

    test('Documents Table - Update Document Information: Verify Drawer UI', async ({ browser }) => {
      // launch UserPortal - landing page is Details page
      const job = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const { global } = await LaunchJob(browser, environment, job)

      // Verify Documents page navigation
      const documentsPage = new UserPortalJobDocumentsPage(global, job)
      await documentsPage.NavigateToPage()
      const table = documentsPage.Documents.DataTable_Documents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentsTableMessage)
        return
      }

      // Open the Update Document Information Drawer for a document
      const rowIndex = '0'
      let updateDocumentInformationDrawer =
        await documentsPage.Documents.OpenUpdateDocumentInformationDrawer(rowIndex)

      updateDocumentInformationDrawer.VerifyTitle()
      expect(updateDocumentInformationDrawer.Link_OpenDocumentPreview.locator).toBeAttached()
      expect(updateDocumentInformationDrawer.TextBox_Title.locator).toBeAttached()
      expect(updateDocumentInformationDrawer.TextBox_Description.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await updateDocumentInformationDrawer.Close()
      await expect(updateDocumentInformationDrawer.Title.locator).not.toBeAttached()
      await documentsPage.page.waitForTimeout(1000)

      updateDocumentInformationDrawer =
        await documentsPage.Documents.OpenUpdateDocumentInformationDrawer(rowIndex)
      // Verify drawer closes with ESC key
      await updateDocumentInformationDrawer.Close(true)
      await expect(updateDocumentInformationDrawer.Title.locator).not.toBeAttached()

      updateDocumentInformationDrawer =
        await documentsPage.Documents.OpenUpdateDocumentInformationDrawer(rowIndex)
      // Verify drawer closes if click on Cancel
      await updateDocumentInformationDrawer.Button_Cancel.Click()
      await expect(updateDocumentInformationDrawer.Title.locator).not.toBeAttached()
    })

    test('Documents Table - Update Document Information: Validate Drawer', async ({ browser }) => {
      // launch UserPortal - landing page is Details page
      const job = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const { global } = await LaunchJob(browser, environment, job)

      // Verify Documents page navigation
      const documentsPage = new UserPortalJobDocumentsPage(global, job)
      await documentsPage.NavigateToPage()
      const table = documentsPage.Documents.DataTable_Documents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentsTableMessage)
        return
      }

      // Open the Update Document Information Drawer for a document
      const rowIndex = '0'
      const updateDocumentInformationDrawer =
        await documentsPage.Documents.OpenUpdateDocumentInformationDrawer(rowIndex)

      // Clear the Title text box
      await updateDocumentInformationDrawer.TextBox_Title.locator.clear()

      // Click the Submit button
      await updateDocumentInformationDrawer.Button_Submit.Click()
      await documentsPage.page.waitForTimeout(1000)

      // Verify validation message for the drawer with an empty Title field
      expect(await updateDocumentInformationDrawer.Validate()).toBe(true)

      // Click Cancel to close the drawer
      await updateDocumentInformationDrawer.Button_Cancel.Click()
    })

    test('Documents Table - Update Document Information', async ({ browser }) => {
      // launch UserPortal - landing page is Details page
      const job = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const { global } = await LaunchJob(browser, environment, job)

      // Verify Documents page navigation
      const documentsPage = new UserPortalJobDocumentsPage(global, job)
      await documentsPage.NavigateToPage()
      const table = documentsPage.Documents.DataTable_Documents

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentsTableMessage)
        return
      }

      // setup modified description
      const dateSuffix = `+${Date.now()}`
      const modifiedDescription = `${job.testData.documentDescription}${dateSuffix}`

      // find the test file
      const rowIndex = await table.FetchRowIndexOfDataByColumnName(
        job.testData.document,
        DataTable_Columns_Type.Documents_File
      )
      if (rowIndex == null) {
        throw new Error('Unable to find document needed for the test')
      }

      const initialDescription = await table.FetchRowTextDataByColumnName(
        rowIndex,
        DataTable_Columns_Type.Documents_Description
      )

      // Open the Update Document Information Drawer for first document entry
      const updateDocumentInformationDrawer =
        await documentsPage.Documents.OpenUpdateDocumentInformationDrawer(rowIndex)

      // update the document description
      await updateDocumentInformationDrawer.TextBox_Description.Fill(modifiedDescription)

      // Click the Submit button
      await updateDocumentInformationDrawer.Button_Submit.Click()

      // give some time for this to propagate
      await documentsPage.page.waitForTimeout(4000)

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
