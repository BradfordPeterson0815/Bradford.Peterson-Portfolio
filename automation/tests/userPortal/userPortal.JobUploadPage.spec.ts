import { expect } from '@playwright/test'
import { Tags } from '../../library/shared/constants.js'
import test from '../../library/shared/testHooks.js'
import { UserPortalJobDocumentsPage } from '../../library/userPortal/pages/userPortalJobDocumentsPage.js'
import { UserPortalJobMediaPage } from '../../library/userPortal/pages/userPortalJobMediaPage.js'
import { UserPortalJobUploadPage } from '../../library/userPortal/pages/userPortalJobUploadPage.js'
import {
  DefaultEnvironment,
  MaxUploadFiles,
  UploadPageStrings,
  ValidationStrings,
} from '../../library/userPortal/userPortalConstants.js'
import { Launch } from '../../library/userPortal/userPortalHelper.js'

const environment = DefaultEnvironment

test.describe(
  'Job Documents: Upload Page',
  {
    tag: [Tags.UserPortal, Tags.Job, Tags.Upload],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P2] }, async ({ browser }) => {
      // launch UserPortal and navigate to Upload page on a job
      const { global, activeClaimsAndJobsPage } = await Launch(browser, environment)
      const { jobPage, testJob } = await activeClaimsAndJobsPage.OpenRandomJob()
      const uploadPage = new UserPortalJobUploadPage(global, testJob, jobPage.baseURL)
      await uploadPage.NavigateDirectly()

      // Verify title
      await uploadPage.Title.VerifyExpectedText()

      // Verify no File Cards are showing
      expect(await uploadPage.FileCardCount()).toBe(0)

      // Verify Remove All Files button is not visible
      expect(await uploadPage.Button_ClearAll.IsVisible()).toBe(false)

      // Verify Submit button is visible and active
      expect(await uploadPage.Button_Submit_Footer.IsVisible()).toBe(true)
      expect(await uploadPage.Button_Submit_Footer.locator.isEnabled()).toBe(true)
    })

    test('Verify Navigation and UI', async ({ browser }) => {
      // launch UserPortal and navigate to Upload page on a job
      const { global, activeClaimsAndJobsPage } = await Launch(browser, environment)
      const { jobPage, testJob } = await activeClaimsAndJobsPage.OpenRandomJob()

      // Verify Documents page navigation
      const documentsPage = new UserPortalJobDocumentsPage(global, testJob)
      await documentsPage.NavigateToPage()
      // Verify Upload Documents link exists
      expect(await documentsPage.Documents.Link_UploadDocuments.IsVisible()).toBe(true)

      // Navigate from the Documents page to the Upload page
      await documentsPage.Documents.Link_UploadDocuments.Click()
      let uploadPage = new UserPortalJobUploadPage(global, testJob, jobPage.baseURL)
      expect(documentsPage.page.url()).toBe(uploadPage.URL)

      // Head over to the Media page
      const mediaPage = new UserPortalJobMediaPage(global, testJob)
      await mediaPage.NavigateToPage()

      // Verify Upload Media link exists
      expect(await mediaPage.Media.Link_UploadMedia.IsVisible()).toBe(true)

      // Navigate from the Media page to the Upload page
      await mediaPage.Media.Link_UploadMedia.Click()
      uploadPage = new UserPortalJobUploadPage(global, testJob, mediaPage.baseURL)
      expect(mediaPage.page.url()).toBe(uploadPage.URL)

      // Verify title
      await uploadPage.Title.VerifyExpectedText()

      // Verify no File Cards are showing
      expect(await uploadPage.FileCardCount()).toBe(0)

      // Verify Remove All Files button is not visible
      expect(await uploadPage.Button_ClearAll.IsVisible()).toBe(false)

      // Verify Submit button is visible and active
      expect(await uploadPage.Button_Submit_Footer.IsVisible()).toBe(true)
      expect(await uploadPage.Button_Submit_Footer.locator.isEnabled()).toBe(true)
    })

    test('Validate No files/Invalid File types', async ({ browser }) => {
      // launch UserPortal and navigate to Upload page on a job
      const { global, activeClaimsAndJobsPage } = await Launch(browser, environment)
      const { jobPage, testJob } = await activeClaimsAndJobsPage.OpenRandomJob()
      const uploadPage = new UserPortalJobUploadPage(global, testJob, jobPage.baseURL)
      await uploadPage.NavigateDirectly()

      // Verify Submit button is visible and active
      await uploadPage.Button_Submit_Footer.Click()

      // Validate error when no files are selected
      await uploadPage.ValidateNoFiles()
      expect(await uploadPage.ValidateNoFiles()).toBe(true)

      // Attempt to upload an unsupported file type
      const fileNameUsed = await uploadPage.UploadUnsupportedFile()
      const { title, descriptionItems } = await uploadPage.FetchValidationAlert()
      expect(title).toBe(UploadPageStrings.ValidationErrorTitle)
      expect(descriptionItems.length).toBe(1)
      const expectedError = ValidationStrings.UploadNotAcceptedFileType.replace(
        '<FILENAME>',
        fileNameUsed
      )
      expect(expectedError).toBe(descriptionItems[0])
    })

    test('Validate File Card UI', async ({ browser }) => {
      // launch UserPortal and navigate to Upload page on a job
      const { global, activeClaimsAndJobsPage } = await Launch(browser, environment)
      const { jobPage, testJob } = await activeClaimsAndJobsPage.OpenRandomJob()
      const uploadPage = new UserPortalJobUploadPage(global, testJob, jobPage.baseURL)
      await uploadPage.NavigateDirectly()

      // Drop in a valid PDF file
      await uploadPage.UploadValidPDF()
      expect(await uploadPage.FileCardCount()).toBe(1)
      const fileCard = await uploadPage.FetchFileCard(0)

      // Verify FileCard elements
      const buttonCount = await fileCard.CardButtonCount()
      expect(buttonCount).toBeGreaterThanOrEqual(1) // 1 button for non images
      expect(buttonCount).toBeLessThanOrEqual(2) // 2 buttons for images
      expect(await fileCard.label_FileName.isVisible()).toBe(true)
      expect(await fileCard.label_FileSize.isVisible()).toBe(true)
      expect(await fileCard.Label_Title.IsVisible()).toBe(true)
      expect(await fileCard.Label_FileDescription.IsVisible()).toBe(true)

      // Verify Remove All Cards is now visible
      expect(await uploadPage.Button_ClearAll.IsVisible()).toBe(true)
    })

    test('Verify File Card Image Zoom Dialog', async ({ browser }) => {
      // launch UserPortal and navigate to Upload page on a job
      const { global, activeClaimsAndJobsPage } = await Launch(browser, environment)
      const { jobPage, testJob } = await activeClaimsAndJobsPage.OpenRandomJob()
      const uploadPage = new UserPortalJobUploadPage(global, testJob, jobPage.baseURL)
      await uploadPage.NavigateDirectly()

      // Drop in a valid image file
      await uploadPage.UploadValidPNG()
      expect(await uploadPage.FileCardCount()).toBe(1)
      const fileCard = uploadPage.FetchFileCard(0)

      // Verify FileCard elements
      const buttonCount = await fileCard.CardButtonCount()
      expect(buttonCount).toBe(2) // 2 buttons for images

      // open the image zoom dialog
      const zoomDialog = await fileCard.Zoom()
      await zoomDialog.VerifyTitle()
      await zoomDialog.Close()
    })

    test('Remove File Cards', async ({ browser }) => {
      // launch UserPortal and navigate to Upload page on a job
      const { global, activeClaimsAndJobsPage } = await Launch(browser, environment)
      const { jobPage, testJob } = await activeClaimsAndJobsPage.OpenRandomJob()
      const uploadPage = new UserPortalJobUploadPage(global, testJob, jobPage.baseURL)
      await uploadPage.NavigateDirectly()

      // Drop in 3 valid files
      await uploadPage.UploadValidPNG()
      await uploadPage.UploadValidPDF()
      await uploadPage.UploadValidMov()
      expect(await uploadPage.FileCardCount()).toBe(3)

      // Remove the middle card
      const fileCard = uploadPage.FetchFileCard(1)
      await fileCard.RemoveCard()
      expect(await uploadPage.FileCardCount()).toBe(2)

      // Remove all the cards
      await uploadPage.Button_ClearAll.Click()
      await uploadPage.page.waitForTimeout(2000)
      expect(await uploadPage.FileCardCount()).toBe(0)
    })

    test.skip('Validate Video > 1 gig', async ({ browser }) => {
      // launch UserPortal and navigate to Upload page on a job
      const { global, activeClaimsAndJobsPage } = await Launch(browser, environment)
      const { jobPage, testJob } = await activeClaimsAndJobsPage.OpenRandomJob()
      const uploadPage = new UserPortalJobUploadPage(global, testJob, jobPage.baseURL)
      await uploadPage.NavigateDirectly()

      // Attempt to upload a video > 500 mb
      await uploadPage.UploadTooLargeFile()
      const { title, descriptionItems } = await uploadPage.FetchValidationAlert()
      expect(title).toBe(UploadPageStrings.ValidationErrorTitle)
      expect(descriptionItems.length).toBe(1)
      const expectedError = ValidationStrings.FilesTooLarge
      expect(expectedError).toBe(descriptionItems[0])
    })

    test('Validate alerts for Max and Over Max files', async ({ browser }) => {
      // launch UserPortal and navigate to Upload page on a job
      const { global, activeClaimsAndJobsPage } = await Launch(browser, environment)
      const { jobPage, testJob } = await activeClaimsAndJobsPage.OpenRandomJob()
      const uploadPage = new UserPortalJobUploadPage(global, testJob, jobPage.baseURL)
      await uploadPage.NavigateDirectly()

      // Attempt to upload exactly the max documents at the same time
      await uploadPage.LoadupMaxFiles()
      await uploadPage.page.waitForTimeout(2000)
      expect(await uploadPage.FileCardCount()).toBe(MaxUploadFiles)
      expect(await uploadPage.ValidateMaxFilesAlert()).toBe(true)
      // Remove all the cards
      await uploadPage.Button_ClearAll.Click()
      await uploadPage.page.waitForTimeout(2000)
      expect(await uploadPage.FileCardCount()).toBe(0)

      // Attempt to upload more than max documents at the same time
      await uploadPage.LoadUpOverMaxFiles()
      await uploadPage.page.waitForTimeout(2000)
      expect(await uploadPage.FileCardCount()).toBe(MaxUploadFiles + 1)
      expect(await uploadPage.ValidateTooManyFiles(1)).toBe(true)
      // Remove all the cards
      await uploadPage.Button_ClearAll.Click()
      await uploadPage.page.waitForTimeout(2000)
      expect(await uploadPage.FileCardCount()).toBe(0)
    })
  }
)
