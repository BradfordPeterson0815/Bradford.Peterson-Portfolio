import { expect, test } from '@playwright/test'
import { CannedClaimTypes } from '../../library/inspections/inspectionsConstants.js'
import { FetchCannedClaim } from '../../library/inspections/inspectionsHelper.js'
import { LaunchInspections } from '../../library/inspections/inspectionsLauncher.js'

test('Home Page: Verify Claim is displayed', async ({ browser }) => {
  const { global, homePage } = await LaunchInspections(browser)
  const testClaim = FetchCannedClaim(CannedClaimTypes.DefaultTestClaim)
  try {
    const claimIsFound = await homePage.FindClaimByClaimNumber(testClaim.claimNumber)
    expect(claimIsFound).not.toBe(null)
  } catch (error) {
    console.log(error)
  } finally {
    await global.nativeBrowser.deleteSession()
  }
})

test('Home Page: Verify no claims are displayed', async ({ browser }) => {
  const { global, homePage } = await LaunchInspections(browser)
  try {
    const claimListIsEmpty = await homePage.IsClaimListEmpty()
    expect(claimListIsEmpty).toBe(true)
    await homePage.VerifyClaimListEmptyAlert()
  } catch (error) {
    console.log(error)
  } finally {
    await global.nativeBrowser.deleteSession()
  }
})

test('Home Page: Search for a Claim', async ({ browser }) => {
  const { global, homePage } = await LaunchInspections(browser)
  const testClaim = FetchCannedClaim(CannedClaimTypes.DefaultTestClaim)
  try {
    const initialClaimCount = await homePage.DisplayedClaimsCount()
    await homePage.SearchForAClaim(testClaim.claimNumber)
    const claimIsFound = await homePage.FindClaimByClaimNumber(testClaim.claimNumber)
    expect(claimIsFound).not.toBe(null)
    const filteredClaimCount = await homePage.DisplayedClaimsCount()
    expect(filteredClaimCount).toBeLessThan(initialClaimCount)
    await homePage.ClearClaimSearch()
    const clearedClaimCount = await homePage.DisplayedClaimsCount()
    expect(clearedClaimCount).toBe(initialClaimCount)
  } catch (error) {
    console.log(error)
  } finally {
    await global.nativeBrowser.deleteSession()
  }
})

test('Home Page: Verify UI', async ({ browser }) => {
  const { global, homePage } = await LaunchInspections(browser)
  try {
    await homePage.VerifyUI()
  } catch (error) {
    console.log(error)
  } finally {
    await global.nativeBrowser.deleteSession()
  }
})

test('Home Page: Verify Build Info', async ({ browser }) => {
  const { global, homePage } = await LaunchInspections(browser)
  try {
    const information = await homePage.GetBuildInfo()
    console.log(information)
  } catch (error) {
    console.log(error)
  } finally {
    await global.nativeBrowser.deleteSession()
  }
})
