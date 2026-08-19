import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedRegionPricingTypes,
  DataTable_Columns_Type,
  DefaultEnvironment,
  PricingTabTypes,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedRegionPricing, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalPricingPage } from '../../library/claimsPortal/pages/claimsPortalPricingPage.js'
import { ClaimsPortalRegionRateDetailPage } from '../../library/claimsPortal/pages/claimsPortalRegionRateDetailPage.js'
import { ClaimsPortalPricingRegionsTab } from '../../library/claimsPortal/tabs/claimsPortalPricingRegionsTab.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import test from '../../library/shared/testHooks.js'
import { ClaimsPortalRegionRate } from '../../library/claimsPortal/claimsPortalRegionRate.js'
import { Tags } from '../../library/shared/constants.js'
const RegionDetailPrefix = 'AA_TESTREGION_DETAIL'
const dateSuffix = `+${Date.now()}`

const environment = DefaultEnvironment

test.describe(
  'Pricing Region Rate Detail Page',
  {
    tag: [Tags.ClaimsPortal, Tags.Pricing, Tags.Region, Tags.Rate, Tags.InfoDetails],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P2] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      // If the table is empty, we cannot perform this test
      const isEmpty = await table.IsEmpty()
      if (!isEmpty) {
        // Find the first rate details item in the list and go to it

        const rowIndex = '0'
        const rateName = await table.FetchRowTextDataByColumnName(
          rowIndex,
          DataTable_Columns_Type.PricingRegions_RegionName
        )
        const regionRate = new ClaimsPortalRegionRate(rateName, 'fake')
        const pricingDetailsPage = await pricingRegionsTab.GotoRegionPricing(rowIndex, regionRate)
        await pricingDetailsPage.Title.VerifyExpectedText()

        // Verify Title
        await pricingDetailsPage.Title.VerifyExpectedText()

        // Verify Back to Regions button exists and is active
        expect(await pricingDetailsPage.Button_BackToRegions.IsVisible()).toBe(true)

        // Verify Remove Region button exists and is active
        expect(await pricingDetailsPage.Button_RemoveRegion.IsVisible()).toBe(true)

        // Verify Edit Region button exists and is active
        expect(await pricingDetailsPage.Button_EditRegion.IsVisible()).toBe(true)

        // Verify the rate elements on the page
        await pricingDetailsPage.VerifySurtaxAndBaseRates(true)
        await pricingDetailsPage.VerifyRoofPitchRates(true)
        await pricingDetailsPage.VerifyMechanicalTarpingRates(true)
        await pricingDetailsPage.VerifySandbagTarpingRates(true)

        // Navigate back to the parent regions tab
        await pricingDetailsPage.Button_BackToRegions.Click()

        // Verify we land back on the Regions page
        expect(pricingDetailsPage.page.url().endsWith('regions')).toBe(true)
        return
      }
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testRegionPricing = FetchCannedRegionPricing(
        environment,
        CannedRegionPricingTypes.DefaultRegionPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      // Navigate directly to the pricing details
      const rateDetailsPage = new ClaimsPortalRegionRateDetailPage(global, testRegionPricing)
      await rateDetailsPage.NavigateDirectly(testRegionPricing.id)

      // Verify Title
      await rateDetailsPage.Title.VerifyExpectedText()

      // Verify Back to Regions button exists and is active
      expect(await rateDetailsPage.Button_BackToRegions.IsVisible()).toBe(true)

      // Verify Remove Region button exists and is active
      expect(await rateDetailsPage.Button_RemoveRegion.IsVisible()).toBe(true)

      // Verify Edit Region button exists and is active
      expect(await rateDetailsPage.Button_EditRegion.IsVisible()).toBe(true)

      // Verify the rate elements on the page
      await rateDetailsPage.VerifySurtaxAndBaseRates()
      await rateDetailsPage.VerifyRoofPitchRates()
      await rateDetailsPage.VerifyMechanicalTarpingRates()
      await rateDetailsPage.VerifySandbagTarpingRates()

      // Navigate back to the parent regions tab
      await rateDetailsPage.Button_BackToRegions.Click()

      // Verify we land on the Regions page
      expect(rateDetailsPage.page.url().endsWith('regions')).toBe(true)
    })

    test('Update Region Pricing - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testRegionPricing = FetchCannedRegionPricing(
        environment,
        CannedRegionPricingTypes.DefaultRegionPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      // Navigate directly to the pricing details
      const rateDetailsPage = new ClaimsPortalRegionRateDetailPage(global, testRegionPricing)
      await rateDetailsPage.NavigateDirectly(testRegionPricing.id)

      const regionPricingDrawer = await rateDetailsPage.OpenUpdateRegionPricingDrawer()

      // Verify drawer heading is "Update Region Pricing"
      regionPricingDrawer.VerifyTitle()

      // check all the other text boxes match expected values
      await regionPricingDrawer.VerifyRegionRate(testRegionPricing)
      await regionPricingDrawer.Close(true)
    })

    test('Add/Edit/Remove Region', async ({ browser }) => {
      const newRegionName = `${RegionDetailPrefix}${dateSuffix}`
      const editedRegionName = `${newRegionName}+EDITED`

      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testRegionPricing = FetchCannedRegionPricing(
        environment,
        CannedRegionPricingTypes.DefaultRegionPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Region Pricing Tab appears and is selected
      const pricingRegionsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.Regions
      )) as ClaimsPortalPricingRegionsTab
      const table = pricingRegionsTab.DataTable_PricingRegions

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      // Remove any existing regions from old tests
      await pricingRegionsTab.DeleteOldTestRegions(RegionDetailPrefix)

      // add a new region
      testRegionPricing.name = newRegionName
      await pricingRegionsTab.AddNewRegionPricing(testRegionPricing)

      // make sure it exists and there is only 1
      await table.SetTableSearch(newRegionName)
      expect(await table.VisibleRowCount()).toBe(1)

      // go to the pricing detail page to do the rest of this....
      const rowIndex = await pricingRegionsTab.FindIndexOfRowAtPosition(1)
      const rateDetailsPage = await pricingRegionsTab.SelectRegionPricingByName(
        rowIndex,
        testRegionPricing
      )

      // change the name of the region
      testRegionPricing.name = editedRegionName
      const regionPricingDrawer = await rateDetailsPage.OpenUpdateRegionPricingDrawer()
      await regionPricingDrawer.FillAndSubmit(testRegionPricing)
      await global.page.waitForTimeout(8000)

      // verify the name updated
      await rateDetailsPage.Title.VerifyExpectedTextAlt(editedRegionName)

      // Delete the current region
      await rateDetailsPage.RemoveRegion()

      // Verify we are back on the regions page and the deleted region is gone
      expect(rateDetailsPage.page.url().endsWith('regions')).toBe(true)

      if (!(await table.IsEmpty())) {
        await table.SetTableSearch(editedRegionName)
        // make sure it no longer exists
        expect(await table.VisibleRowCount()).toBe(0)
      }
    })
  }
)
