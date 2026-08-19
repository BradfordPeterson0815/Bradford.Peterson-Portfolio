import { expect } from '@playwright/test'
import {
  ClaimTabTypes,
  DefaultEnvironment,
  MaxUploadFiles,
  UploadTabStrings,
  ValidationStrings,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { LaunchInspectionTech } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalYourAssignedClaimsPage } from '../../../library/delegatePortal/pages/delegatePortalYourAssignedClaimsPage.js'
import { DelegatePortalClaimDocumentsTab } from '../../../library/delegatePortal/tabs/delegatePortalClaimDocumentsTab.js'
import { DelegatePortalClaimMediaTab } from '../../../library/delegatePortal/tabs/delegatePortalClaimMediaTab.js'
import { DelegatePortalClaimUploadTab } from '../../../library/delegatePortal/tabs/delegatePortalClaimUploadTab.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Page: Upload Tab',
  {
    tag: [Tags.Delegate, Tags.InspectionTech, Tags.Claim, Tags.Upload],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P2] }, async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to a claim page and then to the associated upload page
      const claimsPage = new DelegatePortalYourAssignedClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage, testClaim } = await claimsPage.OpenRandomClaim()
      const uploadsTab = new DelegatePortalClaimUploadTab(global, testClaim, claimPage.baseURL)
      await uploadsTab.NavigateDirectly()

      // Verify title
      await uploadsTab.Title.VerifyExpectedText()

      // Verify no File Cards are showing
      expect(await uploadsTab.FileCardCount()).toBe(0)

      // Verify Remove All Files button is not visible
      expect(await uploadsTab.Button_ClearAll.IsVisible()).toBe(false)

      // Verify Submit button is visible and active
      expect(await uploadsTab.Button_Submit_Footer.IsVisible()).toBe(true)
      expect(await uploadsTab.Button_Submit_Footer.locator.isEnabled()).toBe(true)
    })

    test('Verify Navigation and UI', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to a claim page
      const claimsPage = new DelegatePortalYourAssignedClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage, testClaim } = await claimsPage.OpenRandomClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Documents tab
      const documentsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Documents
      )) as DelegatePortalClaimDocumentsTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Documents)).toBe(true)
      expect(claimPage.page.url()).toBe(documentsTab.URL)

      // Verify Upload Documents link exists
      expect(await documentsTab.Link_UploadDocuments.IsVisible()).toBe(true)

      // Navigate from the Documents tab to the Upload tab
      await documentsTab.Link_UploadDocuments.Click()
      const uploadsTab = new DelegatePortalClaimUploadTab(global, testClaim, claimPage.baseURL)
      expect(documentsTab.page.url()).toBe(uploadsTab.URL)

      // Head over to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Media)) as DelegatePortalClaimMediaTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Media)).toBe(true)
      expect(claimPage.page.url()).toBe(mediaTab.URL)

      // Verify Upload Media link exists
      expect(await mediaTab.Link_UploadMedia.IsVisible()).toBe(true)

      // Navigate from the Media tab to the Upload tab
      await mediaTab.Link_UploadMedia.Click()
      expect(mediaTab.page.url()).toBe(uploadsTab.URL)

      // Verify title
      await uploadsTab.Title.VerifyExpectedText()

      // Verify no File Cards are showing
      expect(await uploadsTab.FileCardCount()).toBe(0)

      // Verify Remove All Files button is not visible
      expect(await uploadsTab.Button_ClearAll.IsVisible()).toBe(false)

      // Verify Submit button is visible and active
      expect(await uploadsTab.Button_Submit_Footer.IsVisible()).toBe(true)
      expect(await uploadsTab.Button_Submit_Footer.locator.isEnabled()).toBe(true)
    })

    test('Validate No files/Invalid File types', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to a claim page and then to the associated upload page
      const claimsPage = new DelegatePortalYourAssignedClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage, testClaim } = await claimsPage.OpenRandomClaim()
      const uploadsTab = new DelegatePortalClaimUploadTab(global, testClaim, claimPage.baseURL)
      await uploadsTab.NavigateDirectly()

      // Verify Submit button is visible and active
      await uploadsTab.Button_Submit_Footer.Click()

      // Validate error when no files are selected
      await uploadsTab.ValidateNoFiles()
      expect(await uploadsTab.ValidateNoFiles()).toBe(true)

      // Attempt to upload an unsupported file type
      const fileNameUsed = await uploadsTab.UploadUnsupportedFile()
      const { title, descriptionItems } = await uploadsTab.FetchValidationAlert()
      expect(title).toBe(UploadTabStrings.ValidationErrorTitle)
      expect(descriptionItems.length).toBe(1)
      const expectedError = ValidationStrings.UploadNotAcceptedFileType.replace(
        '<FILENAME>',
        fileNameUsed
      )
      expect(expectedError).toBe(descriptionItems[0])
    })

    test('Validate File Card UI', async ({ browser }) => {
       // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to a claim page and then to the associated upload page
      const claimsPage = new DelegatePortalYourAssignedClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage, testClaim } = await claimsPage.OpenRandomClaim()
      const uploadsTab = new DelegatePortalClaimUploadTab(global, testClaim, claimPage.baseURL)
      await uploadsTab.NavigateDirectly()

      // Drop in a valid PDF file
      await uploadsTab.UploadValidPDF()
      expect(await uploadsTab.FileCardCount()).toBe(1)
      const fileCard = await uploadsTab.FetchFileCard(0)

      // Verify FileCard elements
      const buttonCount = await fileCard.CardButtonCount()
      expect(buttonCount).toBeGreaterThanOrEqual(1) // 1 button for non images
      expect(buttonCount).toBeLessThanOrEqual(2) // 2 buttons for images
      expect(await fileCard.label_FileName.isVisible()).toBe(true)
      expect(await fileCard.label_FileSize.isVisible()).toBe(true)
      expect(await fileCard.Label_Title.IsVisible()).toBe(true)
      expect(await fileCard.Label_FileDescription.IsVisible()).toBe(true)

      // Verify Remove All Cards is now visible
      expect(await uploadsTab.Button_ClearAll.IsVisible()).toBe(true)
    })

    test('Verify File Card Image Zoom Dialog', async ({ browser }) => {
       // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to a claim page and then to the associated upload page
      const claimsPage = new DelegatePortalYourAssignedClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage, testClaim } = await claimsPage.OpenRandomClaim()
      const uploadsTab = new DelegatePortalClaimUploadTab(global, testClaim, claimPage.baseURL)
      await uploadsTab.NavigateDirectly()

      // Drop in a valid image file
      await uploadsTab.UploadValidPNG()
      expect(await uploadsTab.FileCardCount()).toBe(1)
      const fileCard = uploadsTab.FetchFileCard(0)

      // Verify FileCard elements
      const buttonCount = await fileCard.CardButtonCount()
      expect(buttonCount).toBe(2) // 2 buttons for images

      // open the image zoom dialog
      const zoomDialog = await fileCard.Zoom()
      await zoomDialog.VerifyTitle()
      await zoomDialog.Close()
    })

    test('Remove File Cards', async ({ browser }) => {
       // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to a claim page and then to the associated upload page
      const claimsPage = new DelegatePortalYourAssignedClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage, testClaim } = await claimsPage.OpenRandomClaim()
      const uploadsTab = new DelegatePortalClaimUploadTab(global, testClaim, claimPage.baseURL)
      await uploadsTab.NavigateDirectly()

      // Drop in 3 valid files
      await uploadsTab.UploadValidPNG()
      await uploadsTab.UploadValidPDF()
      await uploadsTab.UploadValidMov()
      expect(await uploadsTab.FileCardCount()).toBe(3)

      // Remove the middle card
      const fileCard = uploadsTab.FetchFileCard(1)
      await fileCard.RemoveCard()
      expect(await uploadsTab.FileCardCount()).toBe(2)

      // Remove all the cards
      await uploadsTab.Button_ClearAll.Click()
      await uploadsTab.Wait(2000)
      expect(await uploadsTab.FileCardCount()).toBe(0)
    })

    test.skip('Validate Video > 1 gig', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)
      // Go to a claim page and then to the associated upload page
      const claimsPage = new DelegatePortalYourAssignedClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage, testClaim } = await claimsPage.OpenRandomClaim()
      const uploadsTab = new DelegatePortalClaimUploadTab(global, testClaim, claimPage.baseURL)
      await uploadsTab.NavigateDirectly()

      // Attempt to upload a video > 500 mb
      await uploadsTab.UploadTooLargeFile()
      const { title, descriptionItems } = await uploadsTab.FetchValidationAlert()
      expect(title).toBe(UploadTabStrings.ValidationErrorTitle)
      expect(descriptionItems.length).toBe(1)
      const expectedError = ValidationStrings.FilesTooLarge
      expect(expectedError).toBe(descriptionItems[0])
    })

    test('Validate alerts for Max and Over Max files', async ({ browser }) => {
       // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to a claim page and then to the associated upload page
      const claimsPage = new DelegatePortalYourAssignedClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage, testClaim } = await claimsPage.OpenRandomClaim()
      const uploadsTab = new DelegatePortalClaimUploadTab(global, testClaim, claimPage.baseURL)
      await uploadsTab.NavigateDirectly()

      // Attempt to upload exactly the max documents at the same time
      await uploadsTab.LoadupMaxFiles()
      await uploadsTab.Wait(2000)
      expect(await uploadsTab.FileCardCount()).toBe(MaxUploadFiles)
      expect(await uploadsTab.ValidateMaxFilesAlert()).toBe(true)
      // Remove all the cards
      await uploadsTab.Button_ClearAll.Click()
      await uploadsTab.Wait(2000)
      expect(await uploadsTab.FileCardCount()).toBe(0)

      // Attempt to upload more than max documents at the same time
      await uploadsTab.LoadUpOverMaxFiles()
      await uploadsTab.Wait(2000)
      expect(await uploadsTab.FileCardCount()).toBe(MaxUploadFiles + 1)
      expect(await uploadsTab.ValidateTooManyFiles(1)).toBe(true)
      // Remove all the cards
      await uploadsTab.Button_ClearAll.Click()
      await uploadsTab.Wait(2000)
      expect(await uploadsTab.FileCardCount()).toBe(0)
    })
  }
)
