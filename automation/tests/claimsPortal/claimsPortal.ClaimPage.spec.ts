import { expect } from '@playwright/test'
import test from '../../library/shared/testHooks.js'
import { ClaimsPortalClaimsPage } from '../../library/claimsPortal/pages/claimsPortalClaimsPage.js'
import { ClaimsPortalHomePage } from '../../library/claimsPortal/pages/claimsPortalHomePage.js'
import { FetchCannedClaim, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import {
  DefaultEnvironment,
  CannedClaimTypes,
  ClaimTabTypes,
  DataTable_Columns_Type,
  ClaimPageStrings,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { CeylonEnvironmentType, Tags } from '../../library/shared/constants.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Page',
  {
    tag: [Tags.ClaimsPortal, Tags.Claim],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      test.slow()

      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to a claim page
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage } = await claimsPage.OpenRandomClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const InfoTab = await claimPage.SelectClaimTab(ClaimTabTypes.Info)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Info)).toBe(true)
      const actualUrl = claimPage.page.url()
      expect(actualUrl).toBe(InfoTab.URL)

      // Verify that 2 links (your claims/all claims) are displayed (top left)
      expect(await claimPage.Link_YourClaimsPortal.IsVisible()).toBe(true)
      expect(await claimPage.Link_AllClaimsPortal.IsVisible()).toBe(true)

      // Verify the claim number for this claim is displayed on the top left, with a (CLAIM) label
      await claimPage.Title.VerifyExpectedText()

      // Verify that the Actions section is displayed (top right)
      expect(await claimPage.Button_Actions.IsVisible()).toBe(true)

      // Select Portal Access section link- verify the Portal Access section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.PortalAccess)
      expect(await claimPage.IsTabActive(ClaimTabTypes.PortalAccess)).toBe(true)

      // Select Contacts section link- verify the Contacts section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Contacts)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Contacts)).toBe(true)

      // Select Loss of Use section link- verify the Loss of Use section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.LossOfUse)
      expect(await claimPage.IsTabActive(ClaimTabTypes.LossOfUse)).toBe(true)

      // Select Inspections Schedule section link- verify the Inspections Schedule section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Schedule)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Schedule)).toBe(true)

      // Select Estimates section link- verify the Estimates section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Estimates)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Estimates)).toBe(true)

      // Select Documents section link- verify the Documents section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Documents)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Documents)).toBe(true)

      // Select Media section link- verify the Media section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Media)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Media)).toBe(true)

      // Select Notes section link- verify the Notes section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Notes)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Notes)).toBe(true)

      // Select Jobs section link- verify the Jobs section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Jobs)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Jobs)).toBe(true)

      // Select Callback Requests section link- verify the Callback Requests section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.CallbackRequests)
      expect(await claimPage.IsTabActive(ClaimTabTypes.CallbackRequests)).toBe(true)

      // Select Inspections Schedule section link- verify the Inspections Schedule section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Schedule)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Schedule)).toBe(true)

      // Select Info section link- verify the Info section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Info)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Info)).toBe(true)

      // Click the All ClaimsPortal link and verify we are back on the ClaimsPortal page
      await claimPage.Link_AllClaimsPortal.Click()
      await claimPage.page.waitForTimeout(1000)

      // Come back to the claim page using the existing filter
      const rowPosition = 1
      const rowIndex = await claimsPage.DataTable_ClaimsPortal.FetchRowIndexFromRowPosition(rowPosition)
      await claimsPage.DataTable_ClaimsPortal.ClickLinkInDataCell(
        rowIndex,
        DataTable_Columns_Type.Claims_ClaimNumber
      )
      await claimPage.page.waitForTimeout(1000)

      if (environment == CeylonEnvironmentType.Company_Test) {
        // Click the Your ClaimsPortal link and verify we are on the Home page
        await claimPage.Link_YourClaimsPortal.Click()
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.CustomLoad()
        await homePage.VerifyTitle()
      }
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      test.slow()

      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Claim Page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()

      // Select a Claim, and click the Claim Number link
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = await claimsPage.OpenClaim(testClaim)

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const InfoTab = await claimPage.SelectClaimTab(ClaimTabTypes.Info)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Info)).toBe(true)
      const actualUrl = claimPage.page.url()
      expect(actualUrl).toBe(InfoTab.URL)

      // Verify that 2 links (your claims/all claims) are displayed (top left)
      expect(await claimPage.Link_YourClaimsPortal.IsVisible()).toBe(true)
      expect(await claimPage.Link_AllClaimsPortal.IsVisible()).toBe(true)

      // Verify the claim number for this claim is displayed on the top left, with a (CLAIM) label
      await claimPage.Title.VerifyExpectedText()

      // Verify that the Actions section is displayed (top right)
      expect(await claimPage.Button_Actions.IsVisible()).toBe(true)

      // Verify Policyholder name, phone, email and address display below claim number
      expect(await claimPage.Label_PrimaryContact_Name.GetText()).toBe(
        testClaim.primaryContact.name
      )
      if (testClaim.primaryContact.phone != '') {
        expect(await claimPage.Link_PrimaryContact_Phone.GetText()).toBe(
          testClaim.primaryContact.phone
        )
      }
      if (testClaim.primaryContact.email != '') {
        expect(await claimPage.Link_PrimaryContact_Email.GetText()).toBe(
          testClaim.primaryContact.email
        )
      }
      expect(await claimPage.Link_PrimaryContact_Address.GetText()).toBe(
        testClaim.lossLocation.fullAddress
      )

      // Select Portal Access section link- verify the Portal Access section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.PortalAccess)
      expect(await claimPage.IsTabActive(ClaimTabTypes.PortalAccess)).toBe(true)

      // Select Contacts section link- verify the Contacts section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Contacts)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Contacts)).toBe(true)

      // Select Loss of Use section link- verify the Loss of Use section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.LossOfUse)
      expect(await claimPage.IsTabActive(ClaimTabTypes.LossOfUse)).toBe(true)

      // Select Inspections Schedule section link- verify the Inspections Schedule section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Schedule)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Schedule)).toBe(true)

      // Select Estimates section link- verify the Estimates section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Estimates)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Estimates)).toBe(true)

      // Select Documents section link- verify the Documents section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Documents)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Documents)).toBe(true)

      // Select Media section link- verify the Media section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Media)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Media)).toBe(true)

      // Select Notes section link- verify the Notes section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Notes)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Notes)).toBe(true)

      // Select Jobs section link- verify the Jobs section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Jobs)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Jobs)).toBe(true)

      // Select Callback Requests section link- verify the Callback Requests section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.CallbackRequests)
      expect(await claimPage.IsTabActive(ClaimTabTypes.CallbackRequests)).toBe(true)

      // Select Inspections section link- verify the Inspections section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Inspections)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Inspections)).toBe(true)

      // Select Info section link- verify the Info section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Info)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Info)).toBe(true)

      // Click the All ClaimsPortal link and verify we are back on the ClaimsPortal page
      await claimPage.Link_AllClaimsPortal.Click()
      await claimPage.page.waitForTimeout(1000)

      // Come back to the claim page using the existing filter
      const rowPosition = 1
      const rowIndex = await claimsPage.DataTable_ClaimsPortal.FetchRowIndexFromRowPosition(rowPosition)
      await claimsPage.DataTable_ClaimsPortal.ClickLinkInDataCell(
        rowIndex,
        DataTable_Columns_Type.Claims_ClaimNumber
      )
      await claimPage.page.waitForTimeout(1000)

      if (environment == CeylonEnvironmentType.Company_Test) {
        // Click the Your ClaimsPortal link and verify we are on the Home page
        await claimPage.Link_YourClaimsPortal.Click()
        const homePage = new ClaimsPortalHomePage(global)
        await homePage.CustomLoad()
        await homePage.VerifyTitle()
      }
    })

    test('Verify Actions List Items availability', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Claim Page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()

      // Select a Claim, and click the Claim Number link
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = await claimsPage.OpenClaim(testClaim)

      // Click the Actions Button
      await claimPage.Button_Actions.Click()

      // Verify all the menu items that show be showing
      await claimPage.VerifyMenuItemIsAttached(ClaimPageStrings.MenuItem_Actions_AddCommunication)
      await claimPage.VerifyMenuItemIsAttached(ClaimPageStrings.MenuItem_Actions_AddNote)
      await claimPage.VerifyMenuItemIsAttached(ClaimPageStrings.MenuItem_Actions_AddTags)
      await claimPage.VerifyMenuItemIsAttached(ClaimPageStrings.MenuItem_Actions_StartInspection)
      await claimPage.VerifyMenuItemIsAttached(ClaimPageStrings.MenuItem_Actions_UpdateClaim)
      await claimPage.VerifyMenuItemIsAttached(ClaimPageStrings.MenuItem_Actions_UploadFiles)
      await claimPage.VerifyMenuItemIsAttached(ClaimPageStrings.MenuItem_Actions_CloseClaim)
    })
  }
)
