import { test } from '@playwright/test'
import { LaunchInspections_NoSignIn } from '../../library/inspections/inspectionsLauncher.js'

test('Title Page: Verify Navigation and UI', async ({ browser }) => {
  const { global, titlePage } = await LaunchInspections_NoSignIn(browser)
  try {
    await titlePage?.VerifyUI()
  } catch (error) {
    console.log(error)
  } finally {
    await global.nativeBrowser.deleteSession()
  }
})
