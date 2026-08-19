import { test } from '@playwright/test'
import { inspections } from '../../environments/env.appium.js'
import { LaunchInspections } from '../../library/inspections/inspectionsLauncher.js'

test('Verify FieldAgent Logout and Login', async ({ browser }) => {
  const { global, homePage } = await LaunchInspections(browser)
  try {
    const titlePage = await homePage.Logout()
    await titlePage.SignIn(inspections.USER_EMAIL_FIELDADJUSTER)
    await homePage.WaitForLoad()
  } catch (error) {
    console.log(error)
  } finally {
    await global.nativeBrowser.deleteSession()
  }
})

test('Verify InspectionTech Logout and Login', async ({ browser }) => {
  const { global, homePage } = await LaunchInspections(browser)
  try {
    const titlePage = await homePage.Logout()
    await titlePage.SignIn(inspections.USER_EMAIL_INSPECTIONTECHNICIAN)
    await homePage.WaitForLoad()
  } catch (error) {
    console.log(error)
  } finally {
    await global.nativeBrowser.deleteSession()
  }
})
