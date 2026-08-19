import { expect } from '@playwright/test'
import {
  DefaultEnvironment,
  NicelyFormedDelegateAuthOrigins,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { LaunchFieldTech } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalCallbacksPage } from '../../../library/delegatePortal/pages/delegatePortalCallbacksPage.js'
import { DelegatePortalDocumentationPage } from '../../../library/delegatePortal/pages/delegatePortalDocumentationPage.js'
import { DelegatePortalInboxPage } from '../../../library/delegatePortal/pages/delegatePortalInboxPage.js'
import { DelegatePortalJobInspectionsSchedulePage } from '../../../library/delegatePortal/pages/delegatePortalJobInspectionsSchedulePage.js'
import { DelegatePortalSubmitBugPage } from '../../../library/delegatePortal/pages/delegatePortalSubmitBugPage.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'
import { DelegatePortalLoginPage } from '../../../library/delegatePortal/pages/delegatePortalLoginPage.js'

const environment = DefaultEnvironment

test.describe(
  'NavBar',
  {
    tag: [Tags.Delegate, Tags.FieldTech, Tags.NavBar],
  },
  () => {
    test('Verify FieldTech LeftNavBar', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { global, homePage } = await LaunchFieldTech(browser, environment)

      // Force us to an expanded state
      await homePage.leftNavBar.ForceExpandedState()

      // verify all the Nav Bar button labels
      await homePage.leftNavBar.VerifyNavRootLabels()
      await homePage.leftNavBar.VerifyOtherLabels()

      // Verify Inbox page navigation from LeftNavBar
      const inboxPage = new DelegatePortalInboxPage(global)
      await inboxPage.NavigateToPage()
      await inboxPage.VerifyTitle()

      // Verify Callbacks page navigation from LeftNavBar - should be empty
      const callbacksPage = new DelegatePortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()
      await callbacksPage.VerifyTitle()
      expect(await callbacksPage.DataTable_Callbacks.IsEmpty()).toBe(true)

      // Verify Schedule page navigation from LeftNavBar - should be empty
      const delegateSchedulesPage = new DelegatePortalJobInspectionsSchedulePage(global)
      await delegateSchedulesPage.NavigateToPage()
      await delegateSchedulesPage.VerifyTitle()
      const visibleMonthEvents = await delegateSchedulesPage.GetEventsForVisibleMonth()
      const eventNumber = visibleMonthEvents.length
      expect(eventNumber).toBe(0)

      // Verify Documentation page navigation from LeftNavBar
      const documentationPage = new DelegatePortalDocumentationPage(global)
      await documentationPage.NavigateToPage()
      await documentationPage.VerifyTitle()

      // Verify Submit Bug page navigation from LeftNavBar
      const submitBugPage = new DelegatePortalSubmitBugPage(global)
      await submitBugPage.OpenInNewTabVerifyTitleAndClose()

      // verify all the LeftNavBar User menu labels
      await homePage.leftNavBar.VerifyUserMenuLabels()

      // verify LeftNavBar User expand/collapse functionality
      await homePage.leftNavBar.VerifyCollapseAndExpand()
    })

    test('Update Profile Image Drawer - Verify UI', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { homePage } = await LaunchFieldTech(browser, environment)

      // Force us to an expanded state
      await homePage.leftNavBar.ForceExpandedState()

      let updateProfileImageDrawer = await homePage.leftNavBar.OpenUpdateProfileImageDrawer()

      // Verify drawer heading is "Update Profile Image"
      await updateProfileImageDrawer.Title.VerifyExpectedText()
      await expect(updateProfileImageDrawer.file).toBeAttached()

      // Verify drawer closes with click on "X" button
      await updateProfileImageDrawer.Close()
      await expect(updateProfileImageDrawer.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)

      updateProfileImageDrawer = await homePage.leftNavBar.OpenUpdateProfileImageDrawer()

      // Verify drawer closes with ESC key
      await updateProfileImageDrawer.Close(true)
      await expect(updateProfileImageDrawer.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)

      updateProfileImageDrawer = await homePage.leftNavBar.OpenUpdateProfileImageDrawer()

      // Verify drawer closes if click on Close
      await updateProfileImageDrawer.Button_Close.Click()
      await expect(updateProfileImageDrawer.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)
    })

    test('Update Profile Image Drawer - Validate', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { homePage } = await LaunchFieldTech(browser, environment)

      // Force us to an expanded state
      await homePage.leftNavBar.ForceExpandedState()

      const updateProfileImageDrawer = await homePage.leftNavBar.OpenUpdateProfileImageDrawer()

      // Verify Submit button is visible and active
      await updateProfileImageDrawer.Button_Submit.Click()

      // Validate error when no files are selected
      await updateProfileImageDrawer.ValidateNoFiles()
      expect(await updateProfileImageDrawer.ValidateNoFiles()).toBe(true)

      // Drop in a valid PDF file
      await updateProfileImageDrawer.UploadValidPNG()
      expect(await updateProfileImageDrawer.FileCardCount()).toBe(1)

      // Verify Remove All Cards is now visible
      expect(await updateProfileImageDrawer.Button_RemoveAllFiles.IsVisible()).toBe(true)

      // Remove all the cards
      await updateProfileImageDrawer.Button_RemoveAllFiles.Click()
      expect(await updateProfileImageDrawer.FileCardCount()).toBe(0)
    })

    test('Update License Number Drawer - Verify UI', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { homePage } = await LaunchFieldTech(browser, environment)

      // Force us to an expanded state
      await homePage.leftNavBar.ForceExpandedState()

      let updateLicenseNumberDrawer = await homePage.leftNavBar.OpenUpdateLicenseNumberDrawer()

      // Verify drawer heading is "Update Your License"
      await updateLicenseNumberDrawer.Title.VerifyExpectedText()
      await expect(updateLicenseNumberDrawer.TextBox_LicenseNumber.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await updateLicenseNumberDrawer.Close()
      await expect(updateLicenseNumberDrawer.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)

      updateLicenseNumberDrawer = await homePage.leftNavBar.OpenUpdateLicenseNumberDrawer()

      // Verify drawer closes with ESC key
      await updateLicenseNumberDrawer.Close(true)
      await expect(updateLicenseNumberDrawer.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)

      updateLicenseNumberDrawer = await homePage.leftNavBar.OpenUpdateLicenseNumberDrawer()

      // Verify drawer closes if click on Close
      await updateLicenseNumberDrawer.Button_Close.Click()
      await expect(updateLicenseNumberDrawer.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)
    })

    test('Update License Number Drawer - Validate', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { homePage } = await LaunchFieldTech(browser, environment)

      // Force us to an expanded state
      await homePage.leftNavBar.ForceExpandedState()

      const updateLicenseNumberDrawer = await homePage.leftNavBar.OpenUpdateLicenseNumberDrawer()

      // Verify Submit button is visible and active
      await updateLicenseNumberDrawer.Button_Submit.Click()

      // Validate error when no license number is entered
      expect(await updateLicenseNumberDrawer.Validate()).toBe(true)
    })

    test('Verify UI and Ceylon versions', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { homePage } = await LaunchFieldTech(browser, environment)

      // Force us to an expanded state
      await homePage.leftNavBar.ForceExpandedState()

      // Grab the drawer
      await homePage.leftNavBar.Button_UserMenu.Click()
      await homePage.leftNavBar.Button_UserMenu_UIVersion.Click()
      const copiedUIVersion = await homePage.GetClipboardText()
      const uiVersionSplit = copiedUIVersion.split('.')
      // Verify structure is in 3 parts major.minor.bump
      expect(uiVersionSplit.length).toBe(3)
      // Verify major version is 1,
      expect(uiVersionSplit[0]).toBe('1')

      await homePage.leftNavBar.Button_UserMenu.Click()
      await homePage.leftNavBar.Button_UserMenu_CeylonVersion.Click()
      const copiedCeylonVersion = await homePage.GetClipboardText()
      const ceylonVersionSplit = copiedCeylonVersion.split('.')
      // Verify structure is in 3 parts major.minor.bump
      expect(ceylonVersionSplit.length).toBe(3)
      // Verify major version is 3,
      expect(ceylonVersionSplit[0]).toBe('3')
    })

    test('Verify FieldAgent Login and Logout', async ({ browser }) => {
      // launch the Delegate Field Tech in a state that forces us to authenticate, and also to logout
      test.use({ storageState: { cookies: [], origins: NicelyFormedDelegateAuthOrigins } })
      const { global, homePage } = await LaunchFieldTech(browser, environment)

      // Force us to an expanded state
      await homePage.leftNavBar.ForceExpandedState()

      await homePage.leftNavBar.Button_UserMenu.Click()
      await homePage.leftNavBar.Button_UserMenu_Logout.Click()

      // After logout, login should pop back up
      const loginPage = new DelegatePortalLoginPage(global)
      await expect(loginPage.title).toBeAttached()
      await loginPage.page.waitForTimeout(1000)
    })
  }
)
