import { expect } from '@playwright/test'
import { DefaultEnvironment } from '../../library/claimsPortal/claimsPortalConstants.js'
import { Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalAuth0LoginPage } from '../../library/claimsPortal/pages/claimsPortalAuth0LoginPage.js'
import { ClaimsPortalCallbacksPage } from '../../library/claimsPortal/pages/claimsPortalCallbacksPage.js'
import { ClaimsPortalClaimsPage } from '../../library/claimsPortal/pages/claimsPortalClaimsPage.js'
import { ClaimsPortalDocumentationPage } from '../../library/claimsPortal/pages/claimsPortalDocumentationPage.js'
import { ClaimsPortalEstimatorSchedulesPage } from '../../library/claimsPortal/pages/claimsPortalEstimatorSchedulesPage.js'
import { ClaimsPortalGlobalBooksPage } from '../../library/claimsPortal/pages/claimsPortalGlobalBooksPage.js'
import { ClaimsPortalHomePage } from '../../library/claimsPortal/pages/claimsPortalHomePage.js'
import { ClaimsPortalInboxPage } from '../../library/claimsPortal/pages/claimsPortalInboxPage.js'
import { ClaimsPortalPricingPage } from '../../library/claimsPortal/pages/claimsPortalPricingPage.js'
import { ClaimsPortalSubmitBugPage } from '../../library/claimsPortal/pages/claimsPortalSubmitBugPage.js'
import { ClaimsPortalTagsPage } from '../../library/claimsPortal/pages/claimsPortalTagsPage.js'
import test from '../../library/shared/testHooks.js'
import { ClaimsPortalTemplatesPage } from '../../library/claimsPortal/pages/claimsPortalTemplatesPage.js'
import { Tags } from '../../library/shared/constants.js'

const environment = DefaultEnvironment

test.describe(
  'NavBar',
  {
    tag: [Tags.ClaimsPortal, Tags.NavBar],
  },
  () => {
    test('Verify LeftNavBar', async ({ browser }) => {
      test.slow()

      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.CustomLoad()

      // Force us to an expanded state
      await homePage.leftNavBar.ForceExpandedState()

      // verify all the Nav Bar button labels
      await homePage.leftNavBar.VerifyNavRootLabels()
      await homePage.leftNavBar.VerifyOtherLabels()
      await homePage.leftNavBar.Button_Admin.Click()
      await homePage.leftNavBar.VerifyNavAdminSubLabels()

      // Back to Home
      await homePage.leftNavBar.Button_Admin_GoBack.Click()
      await homePage.VerifyTitle()

      // Verify ClaimsPortal page navigation from ClaimsPortalLeftNavBar
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      await claimsPage.VerifyTitle()

      // Verify Inbox page navigation from ClaimsPortalLeftNavBar
      const inboxPage = new ClaimsPortalInboxPage(global)
      await inboxPage.NavigateToPage()
      await inboxPage.VerifyTitle()

      // Verify Callbacks page navigation from ClaimsPortalLeftNavBar
      const callbacksPage = new ClaimsPortalCallbacksPage(global)
      await callbacksPage.NavigateToPage()
      await callbacksPage.VerifyTitle()

      // Verify Admin->Contacts page navigation from ClaimsPortalLeftNavBar
      const globalBooksPage = new ClaimsPortalGlobalBooksPage(global)
      await globalBooksPage.NavigateToPage()
      await globalBooksPage.VerifyTitle()

      // Verify Admin->Estimator page navigation from ClaimsPortalLeftNavBar
      const estimatorSchedulesPage = new ClaimsPortalEstimatorSchedulesPage(global)
      await estimatorSchedulesPage.NavigateToPage()
      await estimatorSchedulesPage.VerifyTitle()

      // Verify Admin->Pricing page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()
      //await pricingPage.VerifyTitle()

      // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
      const templatesPage = new ClaimsPortalTemplatesPage(global)
      await templatesPage.NavigateToPage()

      // Verify Admin->Tags page navigation from ClaimsPortalLeftNavBar
      const tagsPage = new ClaimsPortalTagsPage(global)
      await tagsPage.NavigateToPage()
      await tagsPage.VerifyTitle()

      // Back to Home
      await estimatorSchedulesPage.leftNavBar.Button_Admin_GoBack.Click()

      // Verify Documentation page navigation from ClaimsPortalLeftNavBar
      const documentationPage = new ClaimsPortalDocumentationPage(global)
      await documentationPage.NavigateToPage()
      await documentationPage.VerifyTitle()

      // Verify Submit Bug page navigation from ClaimsPortalLeftNavBar
      const submitBugPage = new ClaimsPortalSubmitBugPage(global)
      await submitBugPage.OpenInNewTabVerifyTitleAndClose()

      // verify all the ClaimsPortalLeftNavBar User menu labels
      await homePage.leftNavBar.VerifyUserMenuLabels()

      // verify ClaimsPortalLeftNavBar User expand/collapse functionality
      await homePage.leftNavBar.VerifyCollapseAndExpand()
    })

    test('Update Profile Image Drawer - Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.CustomLoad()

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

      // Verify drawer closes if click on Cancel
      await updateProfileImageDrawer.Button_Close.Click()
      await expect(updateProfileImageDrawer.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)
    })

    test('Update Profile Image Drawer - Validate', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.CustomLoad()

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

    test('User Settings Drawer - Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.CustomLoad()

      // Force us to an expanded state
      await homePage.leftNavBar.ForceExpandedState()

      let userSettingsDrawer = await homePage.leftNavBar.OpenUserSettingsDrawer()

      // Verify drawer heading is "User Settings"
      await userSettingsDrawer.Title.VerifyExpectedText()
      await expect(userSettingsDrawer.CheckBox_ShowActiveUsers.locator).toBeAttached()
      await expect(userSettingsDrawer.ListBox_SetTimezone.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await userSettingsDrawer.Close()
      await expect(userSettingsDrawer.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)

      userSettingsDrawer = await homePage.leftNavBar.OpenUserSettingsDrawer()

      // Verify drawer closes with ESC key
      await userSettingsDrawer.Close(true)
      await expect(userSettingsDrawer.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)

      userSettingsDrawer = await homePage.leftNavBar.OpenUserSettingsDrawer()

      // Verify drawer closes if click on Close
      await userSettingsDrawer.Button_Close.Click()
      await expect(userSettingsDrawer.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)
    })

    test('Break Time Settings Drawer - Verify UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.CustomLoad()

      // Force us to an expanded state
      await homePage.leftNavBar.ForceExpandedState()

      let breakTimeSettingsDrawer = await homePage.leftNavBar.OpenBreakTimeSettingsDrawer()

      // Verify drawer heading is "Break Time Settings"
      await breakTimeSettingsDrawer.Title.VerifyExpectedText()
      await expect(breakTimeSettingsDrawer.TextBox_Duration.locator).toBeAttached()
      await expect(breakTimeSettingsDrawer.Button_AddStartTimeRow.locator).toBeAttached()
      await expect(breakTimeSettingsDrawer.CheckBox_HideBreakTimeGIF.locator).toBeAttached()

      const startTimeCount = await breakTimeSettingsDrawer.VisibleTimeCount()
      if (startTimeCount > 0) {
        // grab first one
        const startTimelocator = breakTimeSettingsDrawer.GetStartTimeLocator(0)
        await expect(startTimelocator).toBeAttached()
        const removeStartTimelocator = breakTimeSettingsDrawer.GetRemoveStartTimeLocator(0)
        await expect(removeStartTimelocator).toBeAttached()
      }

      // Verify drawer closes with click on "X" button
      await breakTimeSettingsDrawer.Close()
      await expect(breakTimeSettingsDrawer.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)

      breakTimeSettingsDrawer = await homePage.leftNavBar.OpenBreakTimeSettingsDrawer()

      // Verify drawer closes with ESC key
      await breakTimeSettingsDrawer.Close(true)
      await expect(breakTimeSettingsDrawer.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)

      breakTimeSettingsDrawer = await homePage.leftNavBar.OpenBreakTimeSettingsDrawer()

      // Verify drawer closes if click on Close
      await breakTimeSettingsDrawer.Button_Close.Click()
      await expect(breakTimeSettingsDrawer.Title.locator).not.toBeAttached()
      await homePage.page.waitForTimeout(1000)
    })

    test('Break Time Settings Drawer - Validate', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.CustomLoad()

      // Force us to an expanded state
      await homePage.leftNavBar.ForceExpandedState()

      // Grab the drawer
      const breakTimeSettingsDrawer = await homePage.leftNavBar.OpenBreakTimeSettingsDrawer()

      // Set Duration and a new time to invalid states and validate
      const newIndex = await breakTimeSettingsDrawer.AddNewStartTime()
      await breakTimeSettingsDrawer.TextBox_Duration.Fill('0')
      await breakTimeSettingsDrawer.Button_Submit.Click()

      expect(await breakTimeSettingsDrawer.Validate(newIndex)).toBe(true)

      await breakTimeSettingsDrawer.Close()
    })

    test('Verify UI and Ceylon versions', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.CustomLoad()

      // Force us to an expanded state
      await homePage.leftNavBar.ForceExpandedState()

      // Grab the drawer
      await homePage.leftNavBar.Button_UserMenu.Click()
      await homePage.leftNavBar.Button_UserMenu_UIVersion.Click()
      const copiedUIVersion = await homePage.GetClipboardText()
      const uiVersionSplit = copiedUIVersion.split('.')
      // Verify structure is in 3 parts major.minor.bump
      expect(uiVersionSplit.length).toBe(3)
      // Verify major version is 2,
      expect(uiVersionSplit[0]).toBe('2')

      await homePage.leftNavBar.Button_UserMenu.Click()
      await homePage.leftNavBar.Button_UserMenu_CeylonVersion.Click()
      const copiedCeylonVersion = await homePage.GetClipboardText()
      const ceylonVersionSplit = copiedCeylonVersion.split('.')
      // Verify structure is in 3 parts major.minor.bump
      expect(ceylonVersionSplit.length).toBe(3)
      // Verify major version is 3,
      expect(ceylonVersionSplit[0]).toBe('3')
    })

    test('Verify Logout', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.CustomLoad()

      // Force us to an expanded state
      await homePage.leftNavBar.ForceExpandedState()

      // Grab the drawer
      await homePage.leftNavBar.Button_UserMenu.Click()
      await homePage.leftNavBar.Button_UserMenu_Logout.Click()

      const loginPage = new ClaimsPortalAuth0LoginPage(global)
      await expect(loginPage.Title).toBeAttached()
    })
  }
)
