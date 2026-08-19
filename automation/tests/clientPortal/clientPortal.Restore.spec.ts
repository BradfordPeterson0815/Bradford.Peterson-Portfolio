import { expect } from '@playwright/test'
import { ClientPortalGlobalRulesPage } from '../../library/clientPortal/pages/clientPortalGlobalRulesPage.js'
import { ClientPortalVendorsPage } from '../../library/clientPortal/pages/clientPortalVendorsPage.js'
import {
  DefaultEnvironment,
  GlobalRuleSetsTuples,
  TestVendors,
  VendorRuleSetsTuples,
} from '../../library/clientPortal/clientPortalConstants.js'
import { Launch } from '../../library/clientPortal/clientPortalHelper.js'
import test from '../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.skip('Restore - Restore All Default Vendors', async ({ browser }) => {
  // launch the ClientPortal home page
  const { global } = await Launch(browser, environment)

  // Create Static Vendors
  const vendorsPage = new ClientPortalVendorsPage(global)
  await vendorsPage.NavigateToPage()
  const table = vendorsPage.DataTable_Vendors

  // Create Vendor A
  let vendorAExists = false
  if (!(await table.IsEmpty())) {
    const nameSearchTerm = TestVendors.TestVendorA.name
    await table.SetTableSearch(nameSearchTerm)
    vendorAExists = (await table.VisibleRowCount()) > 0
    await table.CancelPinnedTableSearch()
  }

  if (!vendorAExists) {
    await vendorsPage.AddVendor(TestVendors.TestVendorA)
  }

  // Create Vendor B
  let vendorBExists = false
  if (!(await table.IsEmpty())) {
    const nameSearchTerm = TestVendors.TestVendorB.name
    await table.SetTableSearch(nameSearchTerm)
    vendorBExists = (await table.VisibleRowCount()) > 0
    await table.CancelPinnedTableSearch()
  }

  if (!vendorBExists) {
    await vendorsPage.AddVendor(TestVendors.TestVendorB)
  }

  // Create Vendor C with Rules
  let vendorCExists = false
  if (!(await table.IsEmpty())) {
    const nameSearchTerm = TestVendors.TestVendorC_WithRules.name
    await table.SetTableSearch(nameSearchTerm)
    vendorCExists = (await table.VisibleRowCount()) > 0
    await table.CancelPinnedTableSearch()
  }

  if (!vendorCExists) {
    await vendorsPage.AddVendor(TestVendors.TestVendorC_WithRules)
  }

  const vendorPage = await vendorsPage.ClickLinkToVendor(TestVendors.TestVendorC_WithRules)
  const claimAssignmentRulesTable = vendorPage.ClaimAssignmentRules
  const mitigationAssignmentRulesTable = vendorPage.MitigationAssignmentRules

  const claimAssignmentRuleSet = VendorRuleSetsTuples.VendorC_ClaimAssignmentRuleSet
  for (let index = 0; index < claimAssignmentRuleSet.ruleGroups.length; index++) {
    const foundMatchIndex = await claimAssignmentRulesTable.FindMatchingRuleGroup(
      claimAssignmentRuleSet.ruleGroups[index]
    )
    if (foundMatchIndex == null) {
      // didn't find the rule - create it
      await claimAssignmentRulesTable.CreateRule(claimAssignmentRuleSet.ruleGroups[index])
      // verify the rule was created
      const verifyMatchIndex = await claimAssignmentRulesTable.FindMatchingRuleGroup(
        claimAssignmentRuleSet.ruleGroups[index],
        true
      )
      expect(verifyMatchIndex).not.toBe(null)
    }
  }

  const mitigationAssignmentRuleSet = VendorRuleSetsTuples.VendorC_MitigationAssignmentRuleSet
  for (let index = 0; index < mitigationAssignmentRuleSet.ruleGroups.length; index++) {
    const foundMatchIndex = await mitigationAssignmentRulesTable.FindMatchingRuleGroup(
      mitigationAssignmentRuleSet.ruleGroups[index]
    )
    if (foundMatchIndex == null) {
      // didn't find the rule - create it
      await mitigationAssignmentRulesTable.CreateRule(mitigationAssignmentRuleSet.ruleGroups[index])
      // verify the rule was created
      const verifyMatchIndex = await mitigationAssignmentRulesTable.FindMatchingRuleGroup(
        mitigationAssignmentRuleSet.ruleGroups[index],
        true
      )
      expect(verifyMatchIndex).not.toBe(null)
    }
  }
})

test.skip('Restore - Restore Default Global Rule Sets', async ({ browser }) => {
  // launch the ClientPortal home page and go to Global Rules
  const { global } = await Launch(browser, environment)
  const globalRulesPage = new ClientPortalGlobalRulesPage(global)
  await globalRulesPage.NavigateToPage()

  const defaultGlobalRuleSet = GlobalRuleSetsTuples.Default
  for (let index = 0; index < defaultGlobalRuleSet.length; index++) {
    const foundMatchIndex = await globalRulesPage.FindMatchingGlobalRuleSet(
      defaultGlobalRuleSet[index]
    )
    if (foundMatchIndex == null) {
      // didn't find the rule - create it
      await globalRulesPage.CreateGlobalRuleSet(defaultGlobalRuleSet[index])
      // verify the rule was created
      const verifyMatchIndex = await globalRulesPage.FindMatchingGlobalRuleSet(
        defaultGlobalRuleSet[index],
        true
      )
      expect(verifyMatchIndex).not.toBe(null)
    }
  }
})
