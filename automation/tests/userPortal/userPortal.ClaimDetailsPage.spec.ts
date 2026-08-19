import { expect } from '@playwright/test'
import { Tags } from '../../library/shared/constants.js'
import test from '../../library/shared/testHooks.js'
import { UserPortalClaimCommunicationPage } from '../../library/userPortal/pages/userPortalClaimCommunicationPage.js'
import { UserPortalClaimDocumentsPage } from '../../library/userPortal/pages/userPortalClaimDocumentsPage.js'
import { UserPortalClaimMediaPage } from '../../library/userPortal/pages/userPortalClaimMediaPage.js'
import { UserPortalClaimUploadPage } from '../../library/userPortal/pages/userPortalClaimUploadPage.js'
import { CannedClaimTypes, DefaultEnvironment } from '../../library/userPortal/userPortalConstants.js'
import { FetchCannedClaim, LaunchClaim } from '../../library/userPortal/userPortalHelper.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Details Page',
  {
    tag: [Tags.UserPortal, Tags.Claim, Tags.InfoDetails],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch UserPortal - landing page is ClaimDetails page
      const claim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const { detailsPage } = await LaunchClaim(browser, environment, claim)

      // Verify data is correct for the Claim Process section
      await detailsPage.page.waitForTimeout(2000)
      await detailsPage.VerifyClaimProcessSection()

      // Verify data is correct for the Claim Details section
      await detailsPage.VerifyClaimDetailsSection()

      // Verify data is correct for the Your Claim Team section
      await detailsPage.VerifyYourClaimTeamSection()

      // Verify data is correct for the Claim Visualizer section
      await detailsPage.VerifyClaimVisualizerSection()

      // Verify data is correct for the Actions section
      await detailsPage.VerifyActionsSection()
    })

    test('Verify Action Links navigation', async ({ browser }) => {
      // launch UserPortal - landing page is ClaimDetails page
      const claim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const { global, detailsPage } = await LaunchClaim(browser, environment, claim)

      // Click the View Documents link in Actions
      await detailsPage.Link_Actions_ViewDocuments.Click()

      // Verify navigation to Documents page
      const documentsPage = new UserPortalClaimDocumentsPage(global, claim)
      expect(detailsPage.page.url()).toBe(documentsPage.URL)

      // return to Details page
      await detailsPage.leftNavBar.Link_Details.Click()

      // Click the View Media link in Actions
      await detailsPage.Link_Actions_ViewMedia.Click()

      // Verify navigation to Media page
      const mediaPage = new UserPortalClaimMediaPage(global, claim)
      expect(detailsPage.page.url()).toBe(mediaPage.URL)

      // return to Details page
      await detailsPage.leftNavBar.Link_Details.Click()

      // Click the Upload link in Actions
      await detailsPage.Link_Actions_Upload.Click()

      // Verify navigation to Upload Documents page
      const uploadPage = new UserPortalClaimUploadPage(global, claim, detailsPage.baseURL)
      expect(detailsPage.page.url()).toBe(uploadPage.URL)

      // return to Details page
      await detailsPage.leftNavBar.Link_Details.Click()

      // Click the Schedule a Callback link in Actions
      await detailsPage.Link_Actions_ScheduleCallback.Click()

      // Verify navigation to Communications page
      const communicationPage = new UserPortalClaimCommunicationPage(global, claim)
      expect(detailsPage.page.url()).toBe(communicationPage.URL)
    })
  }
)
