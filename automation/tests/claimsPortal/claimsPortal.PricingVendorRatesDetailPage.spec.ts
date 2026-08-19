import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedVendorRatesPricingTypes,
  DataTable_Columns_Type,
  DefaultEnvironment,
  PricingTabTypes,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedVendorRatesPricing, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalPricingPage } from '../../library/claimsPortal/pages/claimsPortalPricingPage.js'
import { ClaimsPortalVendorRatesDetailPage } from '../../library/claimsPortal/pages/claimsPortalVendorRatesDetailPage.js'
import { ClaimsPortalPricingVendorRatesTab } from '../../library/claimsPortal/tabs/claimsPortalPricingVendorRatesTab.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'
import { ClaimsPortalVendorRates } from '../../library/claimsPortal/claimsPortalVendorRates.js'
import { ClaimsPortalVendorRatesTemplateDetailPage } from '../../library/claimsPortal/pages/claimsPortalVendorRatesTemplateDetailPage.js'

const VendorRatesDetailPrefix = 'AA_TESTVENDORRATES_DETAIL'
const VendorRatesTemplateDetailPrefix = 'AA_TESTVENDORRATES_TEMPLATE_DETAIL'
const dateSuffix = `+${Date.now()}`
const environment = DefaultEnvironment

test.describe(
  'Pricing Vendor Rates Detail Page',
  {
    tag: [Tags.ClaimsPortal, Tags.Pricing, Tags.Vendor, Tags.Rate, Tags.InfoDetails],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P2] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      // If the table is empty, we cannot perform this test
      const isEmpty = await table.IsEmpty()
      if (!isEmpty) {
        // Find the first rate details item in the list and go to it
        const rowIndex = await pricingVendorsTab.FindIndexOfRowAtPosition(1)
        const rateName = await table.FetchRowTextDataByColumnName(
          rowIndex,
          DataTable_Columns_Type.PricingVendorRates_VendorName
        )
        const isTemplate = await pricingVendorsTab.IsTemplate(rowIndex)
        const vendorRates = new ClaimsPortalVendorRates(rateName, isTemplate, 'fake')
        if (isTemplate) {
          const rateDetailsPage = (await pricingVendorsTab.ViewVendorRates(
            rowIndex,
            vendorRates
          )) as ClaimsPortalVendorRatesTemplateDetailPage

          // Verify Title
          await rateDetailsPage.Title.VerifyExpectedText()

          // Verify Badge and badge text
          expect(await rateDetailsPage.Label_Badge.IsVisible()).toBe(true)
          await rateDetailsPage.Label_Badge.VerifyExpectedText()

          // Verify Back to Vendor Rates button exists and is active
          expect(await rateDetailsPage.Button_BackToVendorRates.IsVisible()).toBe(true)

          // Verify Remove Vendor Rates button exists and is active
          expect(await rateDetailsPage.Button_RemoveVendorRates.IsVisible()).toBe(true)

          // Verify Edit Vendor Rates (or Template Rates) button exists and is active
          expect(await rateDetailsPage.Button_EditTemplateRates.IsVisible()).toBe(true)

          // Verify the rate elements on the page
          await rateDetailsPage.VerifyRatesInfo(true)
        } else {
          const rateDetailsPage = (await pricingVendorsTab.ViewVendorRates(
            rowIndex,
            vendorRates
          )) as ClaimsPortalVendorRatesDetailPage

          // Verify Title
          await rateDetailsPage.Title.VerifyExpectedText()

          // Verify Badge and badge text
          expect(await rateDetailsPage.Label_Badge.IsVisible()).toBe(true)
          await rateDetailsPage.Label_Badge.VerifyExpectedText()

          // Verify Back to Vendor Rates button exists and is active
          expect(await rateDetailsPage.Button_BackToVendorRates.IsVisible()).toBe(true)

          // Verify Remove Vendor Rates button exists and is active
          expect(await rateDetailsPage.Button_RemoveVendorRates.IsVisible()).toBe(true)

          // Verify Edit Vendor Rates (or Template Rates) button exists and is active
          expect(await rateDetailsPage.Button_EditRates.IsVisible()).toBe(true)

          // Verify the rate elements on the page
          await rateDetailsPage.VerifyRatesInfo(true)

          await rateDetailsPage.VerifyAssignedVendors()
        }
      }
    })

    test('Verify Navigation and UI Elements for Vendor Rates', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testVendorRatesPricing = FetchCannedVendorRatesPricing(
        environment,
        CannedVendorRatesPricingTypes.DefaultVendorRatesPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      // Navigate directly to the pricing details
      const rateDetailsPage = new ClaimsPortalVendorRatesDetailPage(global, testVendorRatesPricing)
      await rateDetailsPage.NavigateDirectly(testVendorRatesPricing.id)

      // Verify Title
      await rateDetailsPage.Title.VerifyExpectedText()

      // Verify Badge and badge text
      expect(await rateDetailsPage.Label_Badge.IsVisible()).toBe(true)
      await rateDetailsPage.Label_Badge.VerifyExpectedText()

      // Verify Back to Vendor Rates button exists and is active
      expect(await rateDetailsPage.Button_BackToVendorRates.IsVisible()).toBe(true)

      // Verify Remove Vendor Rates button exists and is active
      expect(await rateDetailsPage.Button_RemoveVendorRates.IsVisible()).toBe(true)

      // Verify Edit Vendor Rates (or Template Rates) button exists and is active
      expect(await rateDetailsPage.Button_EditRates.IsVisible()).toBe(true)

      // Verify the rate elements on the page
      await rateDetailsPage.VerifyRatesInfo()

      if (testVendorRatesPricing.isTemplate) {
        // if a template - there is no assigned vendors section
        const assignedVendorSectionIsHidden =
          (await rateDetailsPage.Label_AssignedVendors_Title.locator.count()) == 0
        expect(assignedVendorSectionIsHidden).toBe(true)
      } else {
        await rateDetailsPage.VerifyAssignedVendors()
      }

      // Navigate back to the parent regions tab
      await rateDetailsPage.Button_BackToVendorRates.Click()

      // Verify we land on the Regions page
      expect(rateDetailsPage.page.url().endsWith('vendors')).toBe(true)
    })

    test('Verify Navigation and UI Elements for Vendor Rates Template', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testVendorRatesPricing = FetchCannedVendorRatesPricing(
        environment,
        CannedVendorRatesPricingTypes.DefaultVendorRatesPricingTemplate
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      // Navigate directly to the pricing details
      const rateDetailsPage = new ClaimsPortalVendorRatesTemplateDetailPage(global, testVendorRatesPricing)
      await rateDetailsPage.NavigateDirectly(testVendorRatesPricing.id)

      // Verify Title
      await rateDetailsPage.Title.VerifyExpectedText()

      // Verify Badge and badge text
      expect(await rateDetailsPage.Label_Badge.IsVisible()).toBe(true)
      await rateDetailsPage.Label_Badge.VerifyExpectedText()

      // Verify Back to Vendor Rates button exists and is active
      expect(await rateDetailsPage.Button_BackToVendorRates.IsVisible()).toBe(true)

      // Verify Remove Vendor Rates button exists and is active
      expect(await rateDetailsPage.Button_RemoveVendorRates.IsVisible()).toBe(true)

      // Verify Edit Template Rates button exists and is active
      expect(await rateDetailsPage.Button_EditTemplateRates.IsVisible()).toBe(true)

      // Verify the rate elements on the page
      await rateDetailsPage.VerifyRatesInfo()

      // Navigate back to the parent regions tab
      await rateDetailsPage.Button_BackToVendorRates.Click()

      // Verify we land on the Regions page
      expect(rateDetailsPage.page.url().endsWith('vendors')).toBe(true)
    })

    test('Update Vendor Rates - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testVendorRatesPricing = FetchCannedVendorRatesPricing(
        environment,
        CannedVendorRatesPricingTypes.DefaultVendorRatesPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      // Navigate directly to the pricing details
      const rateDetailsPage = new ClaimsPortalVendorRatesDetailPage(global, testVendorRatesPricing)
      await rateDetailsPage.NavigateDirectly(testVendorRatesPricing.id)

      const vendorRatesDrawer = await rateDetailsPage.OpenUpdateVendorRatesDrawer()

      // Verify drawer heading is "Update Vendor Rates for <vendor rates name>"
      vendorRatesDrawer.VerifyTitle()

      // check all the other text boxes match expected values
      await vendorRatesDrawer.VerifyRatesAndAssignments(testVendorRatesPricing)
      await vendorRatesDrawer.Close(true)
    })

    test('Add/Edit/Remove Vendor Rates', async ({ browser }) => {
      const newVendorRatesName = `${VendorRatesDetailPrefix}${dateSuffix}`
      const editedVendorRatesName = `${newVendorRatesName}+EDITED`

      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testVendorRatesPricing = FetchCannedVendorRatesPricing(
        environment,
        CannedVendorRatesPricingTypes.DefaultVendorRatesPricing
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      // If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyRegionPricingTableMessage)
        return
      }

      // Remove any existing vendor rates from old tests
      await pricingVendorsTab.DeleteOldTestVendorRates(VendorRatesDetailPrefix)

      // add a new vendor
      testVendorRatesPricing.name = newVendorRatesName
      await pricingVendorsTab.AddNewVendorRates(testVendorRatesPricing)

      // make sure it exists and there is only 1
      await table.SetTableSearch(newVendorRatesName)
      expect(await table.VisibleRowCount()).toBe(1)

      // go to the pricing detail page to do the rest of this....
      const rowIndex = await pricingVendorsTab.FindIndexOfRowAtPosition(1)
      const rateDetailsPage = await pricingVendorsTab.SelectVendorRatesByName(
        rowIndex,
        testVendorRatesPricing
      )

      // change the name of the region
      testVendorRatesPricing.name = editedVendorRatesName
      const vendorRatesDrawer = await rateDetailsPage.OpenUpdateVendorRatesDrawer()
      await vendorRatesDrawer.FillAndSubmit()

      // verify the name updated
      await expect(rateDetailsPage.Title.locator).toHaveText(editedVendorRatesName)

      // Delete the current vendor rate
      await rateDetailsPage.RemoveVendorRates()
      await global.page.waitForTimeout(3000)

      // Verify we are back on the vendors page and the deleted vendor rates is gone
      expect(rateDetailsPage.page.url().endsWith('vendors')).toBe(true)

      if (!(await table.IsEmpty())) {
        await table.SetTableSearch(editedVendorRatesName)
        // make sure it no longer exists
        expect(await table.VisibleRowCount()).toBe(0)
      }
    })

    test('Add/Edit/Remove Vendor Rates Template', async ({ browser }) => {
      const newVendorRatesTemplateName = `${VendorRatesTemplateDetailPrefix}${dateSuffix}`
      const editedVendorRatesTemplateName = `${newVendorRatesTemplateName}+EDITED`

      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testVendorRatesPricingTemplate = FetchCannedVendorRatesPricing(
        environment,
        CannedVendorRatesPricingTypes.DefaultVendorRatesPricingTemplate
      )

      // Verify Admin->Pricing Page navigation from ClaimsPortalLeftNavBar
      const pricingPage = new ClaimsPortalPricingPage(global)
      await pricingPage.NavigateToPage()

      // Verify the Vendors Tab appears and is selected
      const pricingVendorsTab = (await pricingPage.SelectPricingTab(
        PricingTabTypes.VendorRates
      )) as ClaimsPortalPricingVendorRatesTab
      const table = pricingVendorsTab.DataTable_PricingVendorRates

      //If the table is empty, we cannot perform this test
      if (await table.IsEmpty()) {
        AbortTest(AbortErrors.EmptyVendorRatesTableMessage)
        return
      }

      // Remove any existing vendor rates templates from old tests
      await pricingVendorsTab.DeleteOldTestVendorRates(VendorRatesTemplateDetailPrefix)

      // add a new vendor rates template
      testVendorRatesPricingTemplate.name = newVendorRatesTemplateName
      await pricingVendorsTab.AddNewVendorRates(testVendorRatesPricingTemplate)

      // make sure it exists and there is only 1
      await table.SetTableSearch(newVendorRatesTemplateName)
      expect(await table.VisibleRowCount()).toBe(1)

      // go to the pricing detail page to do the rest of this....
      const rowIndex = await pricingVendorsTab.FindIndexOfRowAtPosition(1)
      const rateDetailsPage = await pricingVendorsTab.SelectVendorRatesByName(
        rowIndex,
        testVendorRatesPricingTemplate
      )

      // change the name of the region
      testVendorRatesPricingTemplate.name = editedVendorRatesTemplateName
      const vendorRatesDrawer = await rateDetailsPage.OpenUpdateVendorRatesDrawer()
      await vendorRatesDrawer.FillAndSubmit()
      await global.page.waitForTimeout(3000)

      // verify the name updated
      await expect(rateDetailsPage.Title.locator).toHaveText(editedVendorRatesTemplateName)

      // Delete the current vendor rate template
      await rateDetailsPage.RemoveVendorRates()
      await global.page.waitForTimeout(3000)

      // Verify we are back on the vendors page and the deleted vendor rates is gone
      expect(rateDetailsPage.page.url().endsWith('vendors')).toBe(true)

      if (!(await table.IsEmpty())) {
        await table.SetTableSearch(editedVendorRatesTemplateName)
        // make sure it no longer exists
        expect(await table.VisibleRowCount()).toBe(0)
      }
    })
  }
)
