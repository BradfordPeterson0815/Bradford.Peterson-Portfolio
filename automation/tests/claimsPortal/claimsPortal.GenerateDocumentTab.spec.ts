import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedClaimTypes,
  ClaimTabTypes,
  DefaultEnvironment,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedClaim, FetchCannedTemplateData, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalClaimPage } from '../../library/claimsPortal/pages/claimsPortalClaimPage.js'
import { ClaimsPortalClaimDocumentsTab } from '../../library/claimsPortal/tabs/claimsPortalClaimDocumentsTab.js'
import { ClaimsPortalGenerateDocumentTab } from '../../library/claimsPortal/tabs/claimsPortalGenerateDocumentTab.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'
import { ClaimsPortalClaimsPage } from '../../library/claimsPortal/pages/claimsPortalClaimsPage.js'

const environment = DefaultEnvironment
const templateData = FetchCannedTemplateData(environment)
test.describe(
  'Generate Document Tab',
  {
    tag: [Tags.ClaimsPortal, Tags.Claim, Tags.DraftDocuments],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P2] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // find a random claim and go to it
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage, testClaim } = await claimsPage.OpenRandomClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Documents tab
      const documentsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Documents
      )) as ClaimsPortalClaimDocumentsTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Documents)).toBe(true)
      expect(claimPage.page.url()).toBe(documentsTab.URL)

      // Navigate from the Documents tab to the Generate Document tab
      const generateDocumentTab = await documentsTab.OpenGenerateDocumentTab(
        testClaim.basicInfo.claimNumber
      )
      expect(documentsTab.page.url()).toBe(generateDocumentTab.URL)
      await generateDocumentTab.page.waitForTimeout(2000)

      // Verify UI elements
      await generateDocumentTab.Title.VerifyExpectedText()
      expect(await generateDocumentTab.Label_SearchTemplates.IsVisible()).toBe(true)
      await generateDocumentTab.Label_SearchTemplates.VerifyExpectedText()
      expect(await generateDocumentTab.TextBox_Search.IsVisible()).toBe(true)
      expect(await generateDocumentTab.Button_ClearSearch.IsEnabled()).toBe(false)

      // check to see if there are templates associated with the claim carrier
      if (await generateDocumentTab.IsTemplateListEmpty()) {
        await generateDocumentTab.Label_NoTemplatesFoundAlert_Title.VerifyExpectedText()
        await generateDocumentTab.Label_NoTemplatesFoundAlert_Description.VerifyExpectedText()
      } else {
        expect(await generateDocumentTab.Label_SelectTemplate.IsVisible()).toBe(true)
        await generateDocumentTab.Label_SelectTemplate.VerifyExpectedText()
        expect(await generateDocumentTab.Button_StartGenerationOfDocument.IsVisible()).toBe(true)

        // Verify template card elements
        const templateCard = generateDocumentTab.FetchTemplateCardByIndex(0)
        await templateCard.VerifyLabels()

        // Validate document generation won't start if no templates are selected
        await generateDocumentTab.Button_StartGenerationOfDocument.Click()
        await generateDocumentTab.ValidateNoTemplateSelected()
      }
    })

    test('Verify Navigation and UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DocumentStashClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Documents tab
      const documentsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Documents
      )) as ClaimsPortalClaimDocumentsTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Documents)).toBe(true)
      expect(claimPage.page.url()).toBe(documentsTab.URL)

      // Navigate from the Documents tab to the Generate Document tab
      const generateDocumentTab = await documentsTab.OpenGenerateDocumentTab(
        testClaim.basicInfo.claimNumber
      )

      expect(documentsTab.page.url()).toBe(generateDocumentTab.URL)

      await generateDocumentTab.page.waitForTimeout(2000)

      // Verify UI elements
      await generateDocumentTab.Title.VerifyExpectedText()
      expect(await generateDocumentTab.Label_SearchTemplates.IsVisible()).toBe(true)
      await generateDocumentTab.Label_SearchTemplates.VerifyExpectedText()
      expect(await generateDocumentTab.TextBox_Search.IsVisible()).toBe(true)
      expect(await generateDocumentTab.Button_ClearSearch.IsVisible()).toBe(true)
      expect(await generateDocumentTab.Label_SelectTemplate.IsVisible()).toBe(true)
      await generateDocumentTab.Label_SelectTemplate.VerifyExpectedText()
      expect(await generateDocumentTab.Button_StartGenerationOfDocument.IsVisible()).toBe(true)

      // Verify template card elements
      const templateCard = generateDocumentTab.FetchTemplateCardByIndex(0)
      await templateCard.VerifyLabels()
      const cardInfo = await templateCard.FetchCardInfo()
      expect(cardInfo.carrier).toBe(testClaim.basicInfo.carrier)

      // Validate document generation won't start if no templates are selected
      await generateDocumentTab.Button_StartGenerationOfDocument.Click()
      await generateDocumentTab.ValidateNoTemplateSelected()
    })

    test('Verify Template search', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DocumentStashClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Generate Document tab
      const generateDocumentTab = new ClaimsPortalGenerateDocumentTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await generateDocumentTab.NavigateDirectly()

      if ((await generateDocumentTab.FetchTemplateCardCount()) < 2) {
        AbortTest(AbortErrors.LessThanTwoTemplatesGenerateDocumentPageMessage)
        return
      }

      // check for a matching search
      const initialTemplateCount = await generateDocumentTab.FetchTemplateCardCount()
      await generateDocumentTab.SetSearch(templateData.document.existingTemplate)
      const afterFirstSearchCount = await generateDocumentTab.FetchTemplateCardCount()
      expect(afterFirstSearchCount).toBe(1)

      // check for a non-matching search
      await generateDocumentTab.SetSearch('No match expected')
      const afterSecondSearchCount = await generateDocumentTab.FetchTemplateCardCount()
      expect(afterSecondSearchCount).toBe(0)
      expect(await generateDocumentTab.IsTemplateListEmpty()).toBe(true)

      // make sure clearing search restores the list
      await generateDocumentTab.ClearSearch()
      const afterClearCount = await generateDocumentTab.FetchTemplateCardCount()
      expect(afterClearCount).toBe(initialTemplateCount)
    })

    test('Verify Draft Document Generation', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DocumentStashClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Generate Document tab
      const generateDocumentTab = new ClaimsPortalGenerateDocumentTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await generateDocumentTab.NavigateDirectly()

      if ((await generateDocumentTab.FetchTemplateCardCount()) < 2) {
        AbortTest(AbortErrors.LessThanTwoTemplatesGenerateDocumentPageMessage)
        return
      }

      // Narrow our choice to 1
      await generateDocumentTab.SetSearch(templateData.document.existingTemplate)

      // Select the template and begin generation
      const templateCard = generateDocumentTab.FetchTemplateCardByIndex(0)
      const templateName = (await templateCard.FetchCardInfo()).name
      await templateCard.Select()

      // Click the button and nav to the status page
      const statusPage = await generateDocumentTab.GenerateDraftDocument(
        templateName,
        templateData.document.existingTemplateId,
        true
      )
      expect(statusPage.baseURL.endsWith(templateData.document.existingTemplateId)).toBe(true)

      // Verify page elements
      await statusPage.Wait(5000)
      await statusPage.Title.VerifyExpectedText()
      expect(await statusPage.Link_GenerateAnotherDraftDocument.IsVisible()).toBe(true)
      await statusPage.VerifyDescriptionAfterSuccess()
      await statusPage.Label_Success.VerifyExpectedText()

      // Verify the success download button
      await statusPage.VerifyDraftDocumentDownload()

      // Verify navigation back to Draft Document
      await statusPage.Link_GenerateAnotherDraftDocument.Click()
      expect(statusPage.page.url()).toBe(generateDocumentTab.URL)
    })
  }
)
