import { test } from '@playwright/test'
import { UploadQueues } from '../../library/inspections/inspectionsConstants.js'
import { LaunchInspections } from '../../library/inspections/inspectionsLauncher.js'

test('Uploads Page: Verify Navigation and UI', async ({ browser }) => {
  const { global, homePage } = await LaunchInspections(browser)
  try {
    const uploadsPage = await homePage.GotoUploads()
    await uploadsPage.VerifyUI()
    // Verify queues selection works propertly
    await uploadsPage.SelectQueue(UploadQueues.CompletedItems)
    await uploadsPage.SelectQueue(UploadQueues.Errors)
    await uploadsPage.SelectQueue(UploadQueues.InProgress)
  } catch (error) {
    console.log(error)
  } finally {
    await global.nativeBrowser.deleteSession()
  }
})
