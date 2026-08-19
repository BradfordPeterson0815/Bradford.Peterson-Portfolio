import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedJobTypes,
  DefaultEnvironment,
  JobTabTypes,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { FetchCannedJob } from '../../../library/delegatePortal/delegatePortalHelper.js'
import { LaunchSubcontractor } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalJobPage } from '../../../library/delegatePortal/pages/delegatePortalJobPage.js'
import { DelegatePortalJobMediaTab } from '../../../library/delegatePortal/tabs/delegatePortalJobMediaTab.js'
import { DelegatePortalJobPhotoReportPage } from '../../../library/delegatePortal/tabs/delegatePortalJobPhotoReportTab.js'
import { AbortTest } from '../../../library/shared/commonHelper.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Job Page: Media Tab ',
  {
    tag: [Tags.Delegate, Tags.Subcontractor, Tags.Job, Tags.Media],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Select the Media Tab
      const mediaTab = (await jobPage.SelectJobTab(JobTabTypes.Media)) as DelegatePortalJobMediaTab
      expect(await jobPage.IsTabActive(JobTabTypes.Media)).toBe(true)
      expect(jobPage.page.url()).toBe(mediaTab.URL)

      await mediaTab.Title.VerifyExpectedText()
      await expect(mediaTab.Link_CreatePhotoReport.locator).toBeVisible()
      await expect(mediaTab.Link_UploadMedia.locator).toBeVisible()
      await mediaTab.page.waitForTimeout(3000)

      if (!(await mediaTab.IsTabEmpty())) {
        // check the card count - should be at least as many as the canned claim data
        const mediaCardCount = await mediaTab.MediaCardCount()
        expect(mediaCardCount).toBeGreaterThanOrEqual(testJob.testData.mediaCards.length)

        // check the Kitty v1 card
        const kittyV1CannedIndex = 0
        // will throw an error if we don't find the card with all the data matching
        await mediaTab.VerifyAndFetchMediaCard(testJob.testData.mediaCards[kittyV1CannedIndex])

        // check the Kitty v2 card
        const kittyV2CannedIndex = 1
        // will throw an error if we don't find the card with all the data matching
        await mediaTab.VerifyAndFetchMediaCard(testJob.testData.mediaCards[kittyV2CannedIndex])

        // check the piggy card
        const piggyCannedIndex = 2
        // will throw an error if we don't find the card with all the data matching, soft check on description for this card
        await mediaTab.VerifyAndFetchMediaCard(testJob.testData.mediaCards[piggyCannedIndex], true)
      } else {
        // if the page is empty, check the expected UI
        await expect(mediaTab.Label_Empty_Title.locator).toBeVisible()
        await mediaTab.Label_Empty_Title.VerifyExpectedText()
        await mediaTab.Label_Empty_Description.VerifyExpectedText()
        await expect(mediaTab.Link_Empty_UploadMedia.locator).toBeVisible()
      }

      // Click the Create Photo Report link ...
      await mediaTab.Link_CreatePhotoReport.Click()

      // Verify navigation to Create Photo Report page
      const photoReportPage = new DelegatePortalJobPhotoReportPage(global, testJob)
      expect(mediaTab.page.url()).toBe(photoReportPage.URL)
    })

    test('Media Card - Verify Media Preview Link', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Select the Media Tab
      const mediaTab = (await jobPage.SelectJobTab(JobTabTypes.Media)) as DelegatePortalJobMediaTab

      // If there are no cards, we cannot perform this test
      if (await mediaTab.IsTabEmpty()) {
        AbortTest(AbortErrors.EmptyMediaTabMessage)
        return
      }

      // grab the Kitty v1 card
      const kittyV1CannedIndex = 0
      const { card: kittyCard } = await mediaTab.VerifyAndFetchMediaCard(
        testJob.testData.mediaCards[kittyV1CannedIndex]
      )

      // click the media preview (picture/vid) and verify it opens in a new tab
      await kittyCard.OpenMediaInNewTabVerifyAndClose()
    })

    test('Media Card - Update Document Information: Verify Drawer UI', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Select the Media Tab
      const mediaTab = (await jobPage.SelectJobTab(JobTabTypes.Media)) as DelegatePortalJobMediaTab

      // If there are no cards, we cannot perform this test
      if (await mediaTab.IsTabEmpty()) {
        AbortTest(AbortErrors.EmptyMediaTabMessage)
        return
      }

      // Open the Update Document Information Drawer for a media card
      const piggyCannedIndex = 2
      const { card: piggyCard } = await mediaTab.FetchMediaCardByFilename(
        testJob.testData.mediaCards[piggyCannedIndex].filename
      )
      let updateDocumentInformationDrawer = await piggyCard.OpenUpdateDocumentInformationDrawer()

      //Verify drawer heading is "Update Document Information"
      updateDocumentInformationDrawer.VerifyTitle()

      // verify body elements - media preview, rotation buttons
      await expect(updateDocumentInformationDrawer.Link_MediaPreview.locator).toBeAttached()
      await expect(updateDocumentInformationDrawer.Button_RotateLeft.locator).toBeEnabled()
      await expect(updateDocumentInformationDrawer.Button_SaveRotation.locator).toBeDisabled()
      await expect(updateDocumentInformationDrawer.Button_RotateRight.locator).toBeEnabled()
      await expect(updateDocumentInformationDrawer.TextBox_Title.locator).toBeAttached()
      await expect(updateDocumentInformationDrawer.TextBox_Description.locator).toBeAttached()

      // verify footer elements - Cancel, Submit buttons
      await expect(updateDocumentInformationDrawer.Button_Cancel.locator).toBeEnabled()
      await expect(updateDocumentInformationDrawer.Button_Submit.locator).toBeEnabled()

      // Verify drawer closes with click on "X" button
      await updateDocumentInformationDrawer.Close()
      await expect(updateDocumentInformationDrawer.Title.locator).not.toBeAttached()
      await mediaTab.page.waitForTimeout(1000)

      updateDocumentInformationDrawer = await piggyCard.OpenUpdateDocumentInformationDrawer()
      // Verify drawer closes with ESC key
      await updateDocumentInformationDrawer.Close(true)
      await expect(updateDocumentInformationDrawer.Title.locator).not.toBeAttached()
      await mediaTab.page.waitForTimeout(1000)

      updateDocumentInformationDrawer = await piggyCard.OpenUpdateDocumentInformationDrawer()
      // Verify drawer closes if click on Cancel
      await updateDocumentInformationDrawer.Button_Cancel.Click()
      await expect(updateDocumentInformationDrawer.Title.locator).not.toBeAttached()
      await mediaTab.page.waitForTimeout(1000)
    })

    test('Media Card - Update Document Information: Validate Drawer', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Select the Media Tab
      const mediaTab = (await jobPage.SelectJobTab(JobTabTypes.Media)) as DelegatePortalJobMediaTab

      // If there are no cards, we cannot perform this test
      if (await mediaTab.IsTabEmpty()) {
        AbortTest(AbortErrors.EmptyMediaTabMessage)
        return
      }

      // Open the Update Document Information Drawer for a media card
      const piggyCannedIndex = 2
      const { card: piggyCard } = await mediaTab.FetchMediaCardByFilename(
        testJob.testData.mediaCards[piggyCannedIndex].filename
      )
      const updateDocumentInformationDrawer = await piggyCard.OpenUpdateDocumentInformationDrawer()

      // Clear the Title text box
      await updateDocumentInformationDrawer.TextBox_Title.locator.clear()

      // Click the Submit button
      await updateDocumentInformationDrawer.Button_Submit.Click()
      await mediaTab.page.waitForTimeout(1000)

      // Verify validation message for the drawer with an empty Title field
      expect(await updateDocumentInformationDrawer.Validate()).toBe(true)

      // Click Cancel to close the drawer
      await updateDocumentInformationDrawer.Button_Cancel.Click()
    })

    test('Media Card - Update Document Information', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Select the Media Tab
      const mediaTab = (await jobPage.SelectJobTab(JobTabTypes.Media)) as DelegatePortalJobMediaTab

      // If there are no cards, we cannot perform this test
      if (await mediaTab.IsTabEmpty()) {
        AbortTest(AbortErrors.EmptyMediaTabMessage)
        return
      }

      // setup modified description
      const piggyCannedIndex = 2
      const { card: piggyInitialCard } = await mediaTab.FetchMediaCardByFilename(
        testJob.testData.mediaCards[piggyCannedIndex].filename
      )
      const dateSuffix = `+${Date.now()}`
      const modifiedDescription = `${testJob.testData.mediaCards[piggyCannedIndex].description}${dateSuffix}`

      // Open the Update Document Information Drawer for a media card
      const initialDescription = (await piggyInitialCard.GetData()).description
      const updateDocumentInformationDrawer =
        await piggyInitialCard.OpenUpdateDocumentInformationDrawer()

      // update the document description
      await updateDocumentInformationDrawer.TextBox_Description.Fill(modifiedDescription)

      // Click the Submit button
      await updateDocumentInformationDrawer.Button_Submit.Click()

      // give some time for this to propagate
      await mediaTab.page.waitForTimeout(4000)

      const { card: piggyUpdatedCard } = await mediaTab.FetchMediaCardByFilename(
        testJob.testData.mediaCards[piggyCannedIndex].filename
      )
      const updatedDescription = (await piggyUpdatedCard.GetData()).description

      // make sure the updatedDescription is NOT the same as the initial description
      expect(updatedDescription).not.toBe(initialDescription)

      // make sure the updatedDescription IS the same as the modified description
      expect(updatedDescription).toBe(modifiedDescription)
    })

    test('Media Card - Update Document Information: Verify Media Preview Link', async ({
      browser,
    }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Select the Media Tab
      const mediaTab = (await jobPage.SelectJobTab(JobTabTypes.Media)) as DelegatePortalJobMediaTab

      // If there are no cards, we cannot perform this test
      if (await mediaTab.IsTabEmpty()) {
        AbortTest(AbortErrors.EmptyMediaTabMessage)
        return
      }

      // Open the Update Document Information Drawer for a media card
      const piggyCannedIndex = 2
      const { card: piggyCard } = await mediaTab.FetchMediaCardByFilename(
        testJob.testData.mediaCards[piggyCannedIndex].filename
      )
      const updateDocumentInformationDrawer = await piggyCard.OpenUpdateDocumentInformationDrawer()

      // click the media preview (picture/vid) and verify it opens in a new tab
      await updateDocumentInformationDrawer.OpenMediaInNewTabVerifyAndClose(
        testJob.testData.mediaCards[piggyCannedIndex].filename
      )
      await updateDocumentInformationDrawer.Close()
    })
  }
)
