import { expect, test } from '@playwright/test'
import { CannedClaimTypes } from '../../library/inspections/inspectionsConstants.js'
import { FetchCannedClaim } from '../../library/inspections/inspectionsHelper.js'
import { LaunchInspections } from '../../library/inspections/inspectionsLauncher.js'

test('Claim Details Page: Verify Navigation and UI', async ({ browser }) => {
  const { global, homePage } = await LaunchInspections(browser)
  const testClaim = FetchCannedClaim(CannedClaimTypes.DefaultTestClaim)
  try {
    const claimDetailsPage = await homePage.SelectAClaim(testClaim)
    await claimDetailsPage.VerifyUI()
    await global.nativeBrowser.pause(3000)
    await claimDetailsPage.Button_Back.click()
    await global.nativeBrowser.pause(5000)
  } catch (error) {
    console.log(error)
  } finally {
    await global.nativeBrowser.deleteSession()
  }
})

test('Claim Details Page: Navigate To Upload Inspection Page', async ({ browser }) => {
  const { global, homePage } = await LaunchInspections(browser)
  try {
    const claims = await homePage.PullClaimsFromList()
    expect(claims.length).toBeGreaterThan(0)
    // select first claim in the list
    const claimDetailsPage = await homePage.SelectAClaim(claims[0])
    await claimDetailsPage.OpenUploadInspection()
    await global.nativeBrowser.pause(5000)
  } catch (error) {
    console.log(error)
  } finally {
    await global.nativeBrowser.deleteSession()
  }
})
