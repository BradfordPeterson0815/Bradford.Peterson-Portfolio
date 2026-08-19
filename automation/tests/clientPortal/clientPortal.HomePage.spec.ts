import { expect } from '@playwright/test'
import { DefaultEnvironment } from '../../library/clientPortal/clientPortalConstants.js'
import { Launch } from '../../library/clientPortal/clientPortalHelper.js'
import { Tags } from '../../library/shared/constants.js'
import test from '../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Global Rules Page',
  {
    tag: [Tags.ClientPortal, Tags.HomePage],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the ClientPortal home page
      const { homePage } = await Launch(browser, environment)

      // Verify page layout
      await homePage.VerifyTitle()

      // Verify the Vendors card...
      await homePage.Label_Vendors.VerifyExpectedText()
      expect(await homePage.Link_GoToVendors.IsVisible()).toBe(true)
      await homePage.Label_Vendors_Description.VerifyExpectedText()

      // Verify the Service Areas card...
      await homePage.Label_ServiceAreas.VerifyExpectedText()
      expect(await homePage.Link_GoToServiceAreas.IsVisible()).toBe(true)
      await homePage.Label_ServiceAreas_Description.VerifyExpectedText()

      // Verify the Global Rules card...
      await homePage.Label_GlobalRules.VerifyExpectedText()
      expect(await homePage.Link_GoToRules.IsVisible()).toBe(true)
      await homePage.Label_GlobalRules_Description.VerifyExpectedText()

      // Verify the Incomplete FNOLs card...
      await homePage.Label_IncompleteFNOLs.VerifyExpectedText()
      expect(await homePage.Link_GoToIncompleteFNOLs.IsVisible()).toBe(true)
      await homePage.Label_IncompleteFNOLs_Description.VerifyExpectedText()

      // Verify the Weather Events card...
      await homePage.Label_WeatherEvents.VerifyExpectedText()
      expect(await homePage.Link_GoToWeatherEvents.IsVisible()).toBe(true)
      await homePage.Label_WeatherEvents_Description.VerifyExpectedText()
    })
  }
)
