import { expect } from '@playwright/test'
import { Tags } from '../../library/shared/constants.js'
import test from '../../library/shared/testHooks.js'
import { UserPortalClaimCommunicationPage } from '../../library/userPortal/pages/userPortalClaimCommunicationPage.js'
import { CannedClaimTypes, DefaultEnvironment } from '../../library/userPortal/userPortalConstants.js'
import { FetchCannedClaim, LaunchClaim } from '../../library/userPortal/userPortalHelper.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Communication Page',
  {
    tag: [Tags.UserPortal, Tags.Claim, Tags.Communication],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch UserPortal - landing page is Details page

      const claim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const { global } = await LaunchClaim(browser, environment, claim)

      // Verify Communication page navigation
      const communicationPage = new UserPortalClaimCommunicationPage(global, claim)
      await communicationPage.NavigateToPage()

      // Verify claim number
      await communicationPage.VerifyClaimNumber()

      // Verify data is correct for the Contact Us section
      await communicationPage.Label_ContactUs_Title.VerifyExpectedTextAlt()

      // Verify claim contact info
      await communicationPage.VerifyContactInfo(0, claim.testData.claimContact)

      // Verify estimate contact info
      await communicationPage.VerifyContactInfo(1, claim.testData.estimateContact)

      // Verify job contact info
      await communicationPage.VerifyContactInfo(2, claim.testData.jobContact)

      // Verify data is correct for the Request A Callback section
      await communicationPage.Label_RequestACallback_Title.VerifyExpectedTextAlt()
      await expect(communicationPage.Button_RequestCallback_CompanyClaims.locator).toBeVisible()
      await expect(communicationPage.Button_RequestCallback_YourFieldAgent.locator).toBeVisible()
    })

    test('Request Callback - Verify Drawer UI', async ({ browser }) => {
      // launch UserPortal - landing page is Details page
      const claim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const { global } = await LaunchClaim(browser, environment, claim)

      // Verify Communication page navigation
      const communicationPage = new UserPortalClaimCommunicationPage(global, claim)
      await communicationPage.NavigateToPage()

      // Open the Request Callback Drawer for Your Field Agent
      let requestCallbackDrawer =
        await communicationPage.OpenRequestCallbackDrawerForYourFieldAgent()

      //Verify drawer heading is "Request Callback from Your Field Agent"
      requestCallbackDrawer.VerifyTitle()

      // Verify default UI elements
      expect(requestCallbackDrawer.ListBox_PreferredContactMethod.locator).toBeAttached()
      expect(requestCallbackDrawer.TextBox_EmailAddress.locator).toBeAttached()
      expect(requestCallbackDrawer.TextBox_PhoneNumber.locator).not.toBeAttached()
      expect(requestCallbackDrawer.ListBox_PreferredTimeOfDay.locator).toBeAttached()
      expect(requestCallbackDrawer.TextArea_Description.locator).toBeAttached()

      // Verify we can switch to phone and the textbox type changes
      await requestCallbackDrawer.ListBox_PreferredContactMethod.locator.selectOption({
        value: 'phone',
      })
      expect(requestCallbackDrawer.TextBox_EmailAddress.locator).not.toBeAttached()
      expect(requestCallbackDrawer.TextBox_PhoneNumber.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await requestCallbackDrawer.Close()
      await expect(requestCallbackDrawer.Title.locator).not.toBeAttached()
      await communicationPage.page.waitForTimeout(1000)

      requestCallbackDrawer =
        await communicationPage.OpenRequestCallbackDrawerForYourFieldAgent()
      // Verify drawer closes with ESC key
      await requestCallbackDrawer.Close(true)
      await expect(requestCallbackDrawer.Title.locator).not.toBeAttached()
      await communicationPage.page.waitForTimeout(1000)

      requestCallbackDrawer =
        await communicationPage.OpenRequestCallbackDrawerForYourFieldAgent()
      // Verify drawer closes if click on Close
      await requestCallbackDrawer.Button_Close.Click()
      await expect(requestCallbackDrawer.Title.locator).not.toBeAttached()
      await communicationPage.page.waitForTimeout(1000)
    })

    test('Request Callback - Validate Drawer', async ({ browser }) => {
      // launch UserPortal - landing page is Details page
      const claim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const { global } = await LaunchClaim(browser, environment, claim)

      // Verify Communication page navigation
      const communicationPage = new UserPortalClaimCommunicationPage(global, claim)
      await communicationPage.NavigateToPage()

      // Open the Request Callback Drawer for Your Field Agent
      let requestCallbackDrawer =
        await communicationPage.OpenRequestCallbackDrawerForYourFieldAgent()

      // Clear the Email text box
      await requestCallbackDrawer.TextBox_EmailAddress.locator.clear()

      // Click the Submit button
      await requestCallbackDrawer.Button_Submit.Click()
      await communicationPage.page.waitForTimeout(1000)

      // Verify validation message for the drawer with an empty Email field
      expect(await requestCallbackDrawer.ValidateEmailAddress()).toBe(true)

      // Click Close to close the drawer
      await requestCallbackDrawer.Button_Close.Click()

      // Open the Request Callback Drawer for Your Field Agent
      requestCallbackDrawer =
        await communicationPage.OpenRequestCallbackDrawerForYourFieldAgent()

      // Select Phone as the contact method
      await requestCallbackDrawer.ListBox_PreferredContactMethod.locator.selectOption({
        value: 'phone',
      })

      // Clear the Phone text box
      await requestCallbackDrawer.TextBox_PhoneNumber.locator.clear()

      // Click the Submit button
      await requestCallbackDrawer.Button_Submit.Click()
      await communicationPage.page.waitForTimeout(1000)

      // Verify validation message for the drawer with an empty Email field
      expect(await requestCallbackDrawer.ValidatePhone()).toBe(true)

      // Click Close to close the drawer
      await requestCallbackDrawer.Button_Close.Click()

      // Open the Request Callback Drawer for Your Field Agent
      requestCallbackDrawer =
        await communicationPage.OpenRequestCallbackDrawerForYourFieldAgent()

      // Select "select an option" as the contact method
      await requestCallbackDrawer.ListBox_PreferredContactMethod.locator.selectOption({
        label: 'Select an option',
      })

      // Select "select an option" as the time of day
      await requestCallbackDrawer.ListBox_PreferredTimeOfDay.locator.selectOption({
        label: 'Select an option',
      })

      // Click the Submit button
      await requestCallbackDrawer.Button_Submit.Click()
      await communicationPage.page.waitForTimeout(1000)

      // Verify validation message for the drawer with an empty Email field
      expect(await requestCallbackDrawer.ValidatePreferred()).toBe(true)

      // Click Close to close the drawer
      await requestCallbackDrawer.Button_Close.Click()
    })
  }
)
