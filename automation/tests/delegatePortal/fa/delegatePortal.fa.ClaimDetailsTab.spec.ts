import { expect } from '@playwright/test'
import {
  CannedClaimTypes,
  ClaimTabTypes,
  DefaultEnvironment,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { FetchCannedClaim } from '../../../library/delegatePortal/delegatePortalHelper.js'
import { LaunchFieldAgent } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalClaimPage } from '../../../library/delegatePortal/pages/delegatePortalClaimPage.js'
import { DelegatePortalClaimDetailsTab } from '../../../library/delegatePortal/tabs/delegatePortalClaimDetailsTab.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Page: Details Tab',
  {
    tag: [Tags.Delegate, Tags.FieldAgent, Tags.Claim, Tags.InfoDetails],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Details tab
      const detailsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Details
      )) as DelegatePortalClaimDetailsTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Details)).toBe(true)
      expect(claimPage.page.url()).toBe(detailsTab.URL)

      // Verify data is correct for the Basic Info section
      await detailsTab.VerifyBasicInfoSection()

      // Verify data is correct for the Loss Information section
      await detailsTab.VerifyLossInformationSection()

      // Verify data is correct for the Loss Location section
      await detailsTab.VerifyLossLocationSection()

      // Verify data is correct for the Loss Location Map section
      await detailsTab.VerifyLossLocationMapSection()

      // Verify data is correct for the Contact Information section
      await detailsTab.VerifyContactInformationSection()

      // Verify data is correct for the Claim Timeline section
      await detailsTab.VerifyClaimTimelineSection()
      expect(await detailsTab.TimelineEventCount()).toBeGreaterThanOrEqual(
        testClaim.testData.claimTimelineCount
      )
    })

    test('Loss Location - Verify Map link', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Details section
      const detailsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Details
      )) as DelegatePortalClaimDetailsTab

      // Click Map link and verify navigation in new tab to Google Maps
      await detailsTab.OpenMapLinkInNewTabVerifyTitleAndClose(testClaim.lossLocation.mapStreet)
    })

    test('Verify Record Customer Communication Drawer UI', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Details section
      const detailsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Details
      )) as DelegatePortalClaimDetailsTab

      // Click the Action->Add Communication button
      let recordCustomerCommunicationDrawer =
        await detailsTab.OpenRecordCustomerCommunicationDrawer()

      // Verify the Record Customer Communication drawer elements
      await recordCustomerCommunicationDrawer.VerifyTitle()
      await expect(
        recordCustomerCommunicationDrawer.ListBox_TypeOfCommunication.locator
      ).toBeAttached()
      await expect(recordCustomerCommunicationDrawer.TextBox_Date.locator).toBeAttached()
      await expect(recordCustomerCommunicationDrawer.CheckBox_IncludeNote.locator).toBeAttached()

      // Verify Record Customer Communication drawer - closes with click on "X" button
      await recordCustomerCommunicationDrawer.Close()
      await expect(recordCustomerCommunicationDrawer.Title.locator).not.toBeAttached()

      // Verify Record Customer Communication drawer - closes with ESC key
      recordCustomerCommunicationDrawer = await detailsTab.OpenRecordCustomerCommunicationDrawer()
      await recordCustomerCommunicationDrawer.Close(true)
      await expect(recordCustomerCommunicationDrawer.Title.locator).not.toBeAttached()
    })

    test('Validate Record Customer Communication Drawer', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const detailsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Details
      )) as DelegatePortalClaimDetailsTab

      // Click the Record Customer Communication button
      const recordCustomerCommunicationDrawer =
        await detailsTab.OpenRecordCustomerCommunicationDrawer()

      // Validate the drawer
      await recordCustomerCommunicationDrawer.Button_Submit.Click()
      await recordCustomerCommunicationDrawer.Validate()
    })

    test('View Full Timeline Navigation', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Details section
      const detailsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Details
      )) as DelegatePortalClaimDetailsTab

      //Verify that clicking on View Full Timeline navigates us to the timeline page
      const claimTimelineTab = await detailsTab.OpenFullTimeline()
      expect(claimTimelineTab.page.url().endsWith('/timeline')).toBe(true)
    })
  }
)
