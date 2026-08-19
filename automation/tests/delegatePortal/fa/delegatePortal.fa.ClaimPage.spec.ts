import { expect } from '@playwright/test'
import {
  CannedClaimTypes,
  ClaimPageStrings,
  ClaimTabTypes,
  DefaultEnvironment,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { FetchCannedClaim } from '../../../library/delegatePortal/delegatePortalHelper.js'
import {
  LaunchFieldAgent,
  LaunchFieldAgentMobile,
} from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Page',
  {
    tag: [Tags.Delegate, Tags.FieldAgent, Tags.Claim],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      test.slow()

      // launch the Delegate Field Agent home page
      const { homePage } = await LaunchFieldAgent(browser, environment)

      // Select a Claim, and click the Claim Number link
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = await homePage.OpenClaim(testClaim)

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const detailsTab = await claimPage.SelectClaimTab(ClaimTabTypes.Details)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Details)).toBe(true)
      const actualUrl = claimPage.page.url()
      expect(actualUrl).toBe(detailsTab.URL)

      // Verify that button <-ClaimsPortal is displayed (top left)
      expect(await claimPage.Button_ClaimsPortal.IsVisible()).toBe(true)

      // Verify the Carrier for this claim is displayed on the top left
      await claimPage.Title.VerifyExpectedText()

      // Verify claim number, name, phone, email and address display below Carrier
      expect(await claimPage.Label_ClaimNumber.GetText()).toBe(testClaim.basicInfo.claimNumber)
      // no contact info is set, so phone and email should not exist
      expect(await claimPage.Link_PrimaryContact_Phone.GetText()).toBe(testClaim.contact.phone)
      expect(await claimPage.Link_PrimaryContact_Email.GetText()).toBe(testClaim.contact.email)
      expect(await claimPage.Link_PrimaryContact_Address.locator.innerText()).toBe(
        testClaim.lossLocation.fullAddress
      )

      // Select Inspections section link- verify the Inspections section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Schedule)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Schedule)).toBe(true)

      // Select Estimates section link- verify the Estimates section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Estimates)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Estimates)).toBe(true)

      // Select Contacts section link- verify the Contacts section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Contacts)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Contacts)).toBe(true)

      // Select Documents section link- verify the Documents section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Documents)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Documents)).toBe(true)

      // Select Media section link- verify the Media section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Media)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Media)).toBe(true)

      // Select Notes section link- verify the Notes section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Notes)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Notes)).toBe(true)

      // Select Callbacs section link- verify the Callbacks section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Callbacks)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Callbacks)).toBe(true)

      // Select Inspections section link- verify the Inspections section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Inspections)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Inspections)).toBe(true)

      // Select Loss Report section link- verify the Loss Report section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.LossReport)
      expect(await claimPage.IsTabActive(ClaimTabTypes.LossReport)).toBe(true)

      // Select Info section link- verify the Info section appears, with link underlined
      await claimPage.SelectClaimTab(ClaimTabTypes.Details)
      expect(await claimPage.IsTabActive(ClaimTabTypes.Details)).toBe(true)

      // Click the <-ClaimsPortal button and verify we are back on the ClaimsPortal page
      await claimPage.Button_ClaimsPortal.Click()
      await claimPage.page.waitForTimeout(1000)
      await homePage.VerifyTitle()
    })

    test('Verify Mobile Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Field Agent in mobile mode
      const { homePage } = await LaunchFieldAgentMobile(browser, environment)
      await homePage.Link_AllAssignments.Click()

      // Select a Claim, and click the Claim Number link
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = await homePage.OpenClaim(testClaim)

      // Verify we are on the Mobile experience Claim Page
      // Verify that button <- All ClaimsPortal is displayed (top left)
      expect(await claimPage.Link_AllClaimsPortal.IsVisible()).toBe(true)

      // Verify the Carrier for this claim is displayed on the top left
      await claimPage.Title.VerifyExpectedText()

      // Verify claim number, name, phone, email and address display below Carrier
      expect(await claimPage.Label_ClaimNumber.GetText()).toBe(testClaim.basicInfo.claimNumber)
      // no contact info is set, so phone and email should not exist
      expect(await claimPage.Link_PrimaryContact_Phone.GetText()).toBe(testClaim.contact.phone)
      expect(await claimPage.Link_PrimaryContact_Email.GetText()).toBe(testClaim.contact.email)
      expect(await claimPage.Link_PrimaryContact_Address.locator.innerText()).toBe(
        testClaim.lossLocation.fullAddress
      )

      // Check the Loss Description Title and expansion toggle
      await claimPage.Button_LossDescription.VerifyExpectedText()
      expect(await claimPage.IsLossDescriptionExpanded()).toBe(false)
      expect(await claimPage.Label_LossDescriptionDetail.IsVisible()).toBe(false)

      await claimPage.Button_LossDescription.Click()
      expect(await claimPage.IsLossDescriptionExpanded()).toBe(true)
      expect(await claimPage.Label_LossDescriptionDetail.IsVisible()).toBe(true)
      const expectedLossDescription =
        testClaim.lossInformation.description == ''
          ? 'No loss description provided.'
          : testClaim.lossInformation.description
      // since we may be appending data here, we need to just check to see if it starts with what we expect
      const actualText = await claimPage.Label_LossDescriptionDetail.locator.textContent()
      expect(actualText?.startsWith(expectedLossDescription)).toBe(true)

      await claimPage.Button_LossDescription.Click()
      expect(await claimPage.IsLossDescriptionExpanded()).toBe(false)

      // Verify Add A note
      const createNoteDrawer = await claimPage.SelectAddANote()
      await createNoteDrawer.Button_Close.Click()

      // Verify Record Communication
      const recordCustomerCommunicationDrawer = await claimPage.SelectRecordCommunication()
      await recordCustomerCommunicationDrawer.Button_Close.Click()

      // Verify View In Map
      const mapInfoTab = await claimPage.SelectViewInMap()
      await mapInfoTab.page
        .getByRole('link', { name: `${ClaimPageStrings.Link_ClaimHome}` })
        .click()

      // Verify Timeline
      const timelineInfoTab = await claimPage.SelectViewTimeline()
      await timelineInfoTab.page
        .getByRole('link', { name: `${ClaimPageStrings.Link_ClaimHome}` })
        .click()

      // Select Details section link- verify the Details tab appears
      const detailsTab = await claimPage.SelectClaimTab(ClaimTabTypes.Details)
      await detailsTab.page
        .getByRole('link', { name: `${ClaimPageStrings.Link_ClaimHome}` })
        .click()

      // Select Schedule section link- verify the Schedule tab appears
      const scheduleTab = await claimPage.SelectClaimTab(ClaimTabTypes.Schedule)
      await scheduleTab.page
        .getByRole('link', { name: `${ClaimPageStrings.Link_ClaimHome}` })
        .click()

      // Select Estimates section link- verify the Estimates tab appears
      const estimatesTab = await claimPage.SelectClaimTab(ClaimTabTypes.Estimates)
      await estimatesTab.page
        .getByRole('link', { name: `${ClaimPageStrings.Link_ClaimHome}` })
        .click()

      // Select Contacts section link- verify the Contacts tab appears
      const contactsTab = await claimPage.SelectClaimTab(ClaimTabTypes.Contacts)
      await contactsTab.page
        .getByRole('link', { name: `${ClaimPageStrings.Link_ClaimHome}` })
        .click()

      // Select Documents section link- verify the Documents tab appears
      const documentsTab = await claimPage.SelectClaimTab(ClaimTabTypes.Documents)
      await documentsTab.page
        .getByRole('link', { name: `${ClaimPageStrings.Link_ClaimHome}` })
        .click()

      // Select Media section link- verify the Media tab appears
      const mediaTab = await claimPage.SelectClaimTab(ClaimTabTypes.Media)
      await mediaTab.page.getByRole('link', { name: `${ClaimPageStrings.Link_ClaimHome}` }).click()

      // Select Notes section link- verify the Notes tab appears
      const notesTab = await claimPage.SelectClaimTab(ClaimTabTypes.Notes)
      await notesTab.page.getByRole('link', { name: `${ClaimPageStrings.Link_ClaimHome}` }).click()

      // Select Callbacks section link- verify the Callbacks tab appears
      const callbackRequestsTab = await claimPage.SelectClaimTab(ClaimTabTypes.Callbacks)
      await callbackRequestsTab.page
        .getByRole('link', { name: `${ClaimPageStrings.Link_ClaimHome}` })
        .click()

      // Select Inspections section link- verify the Inspections tab appears
      const inspectionsTab = await claimPage.SelectClaimTab(ClaimTabTypes.Inspections)
      await inspectionsTab.page
        .getByRole('link', { name: `${ClaimPageStrings.Link_ClaimHome}` })
        .click()

      // Select Loss Report section link- verify the Loss Report tab appears
      const lossReportTab = await claimPage.SelectClaimTab(ClaimTabTypes.LossReport)
      await lossReportTab.page
        .getByRole('link', { name: `${ClaimPageStrings.Link_ClaimHome}` })
        .click()

      // Click the <-ClaimsPortal button and verify we are back on the ClaimsPortal page
      await claimPage.Link_AllClaimsPortal.Click()
      await claimPage.page.waitForTimeout(1000)
      await homePage.VerifyTitle()
    })
  }
)
