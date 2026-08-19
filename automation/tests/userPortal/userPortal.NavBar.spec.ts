import { expect } from '@playwright/test'
import { Tags } from '../../library/shared/constants.js'
import test from '../../library/shared/testHooks.js'
import { UserPortalCompanyPortalTourDialog } from '../../library/userPortal/dialogs/userPortalTourDialog.js'
import { UserPortalClaimCommunicationPage } from '../../library/userPortal/pages/userPortalClaimCommunicationPage.js'
import { UserPortalClaimDocumentsPage } from '../../library/userPortal/pages/userPortalClaimDocumentsPage.js'
import { UserPortalClaimMediaPage } from '../../library/userPortal/pages/userPortalClaimMediaPage.js'
import { UserPortalJobCommunicationPage } from '../../library/userPortal/pages/userPortalJobCommunicationPage.js'
import { UserPortalJobDocumentsPage } from '../../library/userPortal/pages/userPortalJobDocumentsPage.js'
import { UserPortalJobMediaPage } from '../../library/userPortal/pages/userPortalJobMediaPage.js'
import {
  AboutCompanyPageStrings as AboutCompanyPageStrings,
  CannedClaimTypes,
  CannedJobTypes,
  DefaultEnvironment,
  NicelyFormedUserPortalAuthOrigins,
} from '../../library/userPortal/userPortalConstants.js'
import { FetchCannedClaim, FetchCannedJob, Launch } from '../../library/userPortal/userPortalHelper.js'
import { UserPortalAuth0LoginPage } from '../../library/userPortal/pages/userPortalAuth0LoginPage.js'

const environment = DefaultEnvironment

test.describe(
  'NavBar',
  {
    tag: [Tags.UserPortal, Tags.NavBar],
  },
  () => {
    test('Verify Default LeftNavBar', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const { global, activeClaimsAndJobsPage } = await Launch(browser, environment)

      // Force us to an expanded state
      await activeClaimsAndJobsPage.leftNavBar.ForceExpandedState()

      // verify all the Nav Bar button labels currently displayed
      await activeClaimsAndJobsPage.leftNavBar.Link_Home.VerifyExpectedText()
      expect(await activeClaimsAndJobsPage.leftNavBar.Link_Details.locator.isHidden()).toBe(true)

      // Verify Portal Tour dialog
      const portalTourDialog = new UserPortalCompanyPortalTourDialog(global)
      await activeClaimsAndJobsPage.leftNavBar.Button_PortalTour.Click()
      await portalTourDialog.VerifyTitle()
      await portalTourDialog.Button_Close_X.Click()

      // Verify About Company page navigation
      const pagePromise = activeClaimsAndJobsPage.context.waitForEvent('page')
      await activeClaimsAndJobsPage.leftNavBar.Link_AboutCompany.Click()
      const aboutCompanyPage = await pagePromise
      await aboutCompanyPage.waitForLoadState()
      await aboutCompanyPage.bringToFront()
      const titleLocator = aboutCompanyPage.locator('title').nth(0)
      const titleText = await titleLocator.textContent()
      expect(titleText).toBe(AboutCompanyPageStrings.Title)
      await aboutCompanyPage.close()

      // verify all the UserPortalLeftNavBar User menu labels
      await activeClaimsAndJobsPage.leftNavBar.VerifyUserMenuLabels()

      // verify UserPortalLeftNavBar User expand/collapse functionality
      await activeClaimsAndJobsPage.leftNavBar.VerifyCollapseAndExpand()
    })

    test('Verify LeftNavBar for Claims', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const claim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const { global, activeClaimsAndJobsPage } = await Launch(browser, environment)

      // Force us to an expanded state
      await activeClaimsAndJobsPage.leftNavBar.ForceExpandedState()

      // verify all the Nav Bar button labels currently displayed
      await activeClaimsAndJobsPage.leftNavBar.Link_Home.VerifyExpectedText()

      // open a claim and then verify all the nav bar links
      await activeClaimsAndJobsPage.OpenClaim(claim)
      await activeClaimsAndJobsPage.leftNavBar.VerifyNavRootLabels()
      await activeClaimsAndJobsPage.leftNavBar.VerifyOtherLabels()

      // Verify Documents page navigation
      const documentsPage = new UserPortalClaimDocumentsPage(global, claim)
      await documentsPage.NavigateToPage()
      await documentsPage.Documents.VerifyTitle()

      // Verify Media page navigation
      const mediaPage = new UserPortalClaimMediaPage(global, claim)
      await mediaPage.NavigateToPage()
      await mediaPage.Media.VerifyTitle()

      // Verify Communication page navigation
      const communicationPage = new UserPortalClaimCommunicationPage(global, claim)
      await communicationPage.NavigateToPage()
      await communicationPage.Label_ContactUs_Title.VerifyExpectedText()

      // Navigate back home to Your Active Claims and Jobs page
      await activeClaimsAndJobsPage.leftNavBar.Link_Home.Click()
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
      await activeClaimsAndJobsPage.leftNavBar.Link_Home.VerifyExpectedText()
      expect(await activeClaimsAndJobsPage.leftNavBar.Link_Details.locator.isHidden()).toBe(true)
    })

    test('Verify LeftNavBar for Jobs', async ({ browser }) => {
      // launch UserPortal - landing page is YourActiveClaimsAndJobs page
      const job = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)

      const { global, activeClaimsAndJobsPage } = await Launch(browser, environment)

      // Force us to an expanded state
      await activeClaimsAndJobsPage.leftNavBar.ForceExpandedState()

      // verify all the Nav Bar button labels currently displayed
      await activeClaimsAndJobsPage.leftNavBar.Link_Home.VerifyExpectedText()

      // open a job and then verify all the navbar links
      await activeClaimsAndJobsPage.OpenJob(job)
      await activeClaimsAndJobsPage.leftNavBar.VerifyNavRootLabels()
      await activeClaimsAndJobsPage.leftNavBar.VerifyOtherLabels()

      // Verify Documents page navigation
      const documentsPage = new UserPortalJobDocumentsPage(global, job)
      await documentsPage.NavigateToPage()
      await documentsPage.Documents.VerifyTitle()

      // Verify Media page navigation
      const mediaPage = new UserPortalJobMediaPage(global, job)
      await mediaPage.NavigateToPage()
      await mediaPage.Media.VerifyTitle()

      // Verify Communication page navigation
      const communicationPage = new UserPortalJobCommunicationPage(global, job)
      await communicationPage.NavigateToPage()
      await communicationPage.Label_ContactUs_Title.VerifyExpectedText()

      // Navigate back home to Your Active Claims and Jobs page
      await activeClaimsAndJobsPage.leftNavBar.Link_Home.Click()
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
      await activeClaimsAndJobsPage.leftNavBar.Link_Home.VerifyExpectedText()
      expect(await activeClaimsAndJobsPage.leftNavBar.Link_Details.locator.isHidden()).toBe(true)
    })

    test('Update Contact Info Drawer - Verify UI', async ({ browser }) => {
      // launch UserPortal
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)

      // Force us to an expanded state
      await activeClaimsAndJobsPage.leftNavBar.ForceExpandedState()

      // Open Update Contact Info drawer
      let updateContactInfoDrawer =
        await activeClaimsAndJobsPage.leftNavBar.OpenUpdateContactInformationDrawer()

      // Verify drawer heading is "Update Profile Image"
      await updateContactInfoDrawer.Title.VerifyExpectedText()
      await expect(updateContactInfoDrawer.TextBox_FirstName.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await updateContactInfoDrawer.Button_Close_X.Click()
      await expect(updateContactInfoDrawer.Title.locator).not.toBeAttached()
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)

      updateContactInfoDrawer =
        await activeClaimsAndJobsPage.leftNavBar.OpenUpdateContactInformationDrawer()

      // Verify drawer closes with ESC key
      await updateContactInfoDrawer.Close(true)
      await expect(updateContactInfoDrawer.Title.locator).not.toBeAttached()
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)

      updateContactInfoDrawer =
        await activeClaimsAndJobsPage.leftNavBar.OpenUpdateContactInformationDrawer()

      // Verify drawer closes if click on Close
      await updateContactInfoDrawer.Close()
      await expect(updateContactInfoDrawer.Title.locator).not.toBeAttached()
      await activeClaimsAndJobsPage.page.waitForTimeout(1000)
    })

    test('Update Contact Info Drawer - Validate', async ({ browser }) => {
      // launch UserPortal
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)

      // Force us to an expanded state
      await activeClaimsAndJobsPage.leftNavBar.ForceExpandedState()

      // Open Update Contact Info drawer
      const updateContactInfoDrawer =
        await activeClaimsAndJobsPage.leftNavBar.OpenUpdateContactInformationDrawer()

      // Attempt to set the first name to blank and then Submit
      await updateContactInfoDrawer.TextBox_FirstName.Fill('')
      await updateContactInfoDrawer.Button_Submit.Click()

      // Validate drawer
      const validateResult = await updateContactInfoDrawer.Validate()
      expect(validateResult).toBe(true)
    })

    test('Verify UI version', async ({ browser }) => {
      const { activeClaimsAndJobsPage } = await Launch(browser, environment)

      // Force us to an expanded state
      await activeClaimsAndJobsPage.leftNavBar.ForceExpandedState()

      // Grab the drawer
      await activeClaimsAndJobsPage.leftNavBar.Button_UserMenu.Click()
      await activeClaimsAndJobsPage.leftNavBar.Button_UserMenu_UIVersion.Click()
      const copiedUIVersion = await activeClaimsAndJobsPage.GetClipboardText()
      const uiVersionSplit = copiedUIVersion.split('.')
      // Verify structure is in 3 parts major.minor.bump
      expect(uiVersionSplit.length).toBe(3)
      // Verify major version is 1,
      expect(uiVersionSplit[0]).toBe('1')
    })

    test('Verify UserPortal Login and Logout', async ({ browser }) => {
      test.use({ storageState: { cookies: [], origins: NicelyFormedUserPortalAuthOrigins } })
      // launch UserPortal in a state that forces us to authenticate, and also to logout
      const { global, activeClaimsAndJobsPage } = await Launch(browser, environment)

      // Force us to an expanded state
      await activeClaimsAndJobsPage.leftNavBar.ForceExpandedState()
      await activeClaimsAndJobsPage.leftNavBar.Button_UserMenu.Click()
      await activeClaimsAndJobsPage.leftNavBar.Button_UserMenu_Logout.Click()

      // After logout, auth login should pop back up
      const loginPage = new UserPortalAuth0LoginPage(global)
      await expect(loginPage.Title).toBeAttached()

      await loginPage.page.waitForTimeout(1000)
    })
  }
)
