import { expect } from '@playwright/test'
import { DefaultEnvironment, PricingTabTypes } from '../../library/claimsPortal/claimsPortalConstants.js'
import { Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalPricingPage } from '../../library/claimsPortal/pages/claimsPortalPricingPage.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'
const environment = DefaultEnvironment

test.describe(
  'Pricing Page',
  {
    tag: [Tags.ClaimsPortal, Tags.Pricing],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      expect(await pricingPage.IsTabActive(PricingTabTypes.Regions)).toBe(true)

      // Select the Vendors Rates Tab
      await pricingPage.SelectPricingTab(PricingTabTypes.VendorRates)
      expect(await pricingPage.IsTabActive(PricingTabTypes.VendorRates)).toBe(true)
    })
  }
)
