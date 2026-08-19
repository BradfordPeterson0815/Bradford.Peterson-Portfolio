import { expect, test } from '@playwright/test'
import { PhotoLabels } from '../../library/inspections/inspectionsConstants.js'
import { LaunchInspections } from '../../library/inspections/inspectionsLauncher.js'

test('Upload Inspection Page: Verify Navigation and UI', async ({ browser }) => {
  const { global, homePage } = await LaunchInspections(browser)
  try {
    const claims = await homePage.PullClaimsFromList()
    expect(claims.length).toBeGreaterThan(0)
    // select first claim in the list
    const claimDetailsPage = await homePage.SelectAClaim(claims[0])
    const uploadInspectionPage = await claimDetailsPage.OpenUploadInspection()
    await uploadInspectionPage.VerifyUI()
  } catch (error) {
    console.log(error)
  } finally {
    await global.nativeBrowser.deleteSession()
  }
})

test('Upload Inspection Page: Verify Add Video and Photos', async ({ browser }) => {
  const { global, homePage } = await LaunchInspections(browser)
  try {
    const claims = await homePage.PullClaimsFromList()
    expect(claims.length).toBeGreaterThan(0)
    // select first claim in the list
    const claimDetailsPage = await homePage.SelectAClaim(claims[0])
    const uploadInspectionPage = await claimDetailsPage.OpenUploadInspection()
    await uploadInspectionPage.SelectVideoByIndex(0, 'Description for video')
    await uploadInspectionPage.AddPhotoByIndex(
      0,
      PhotoLabels.Outdoor_EstimatorInfo,
      'Description for photo 1'
    )
    await uploadInspectionPage.AddPhotoByIndex(
      1,
      PhotoLabels.Indoor_Kitchen,
      'Description for photo 2'
    )
    await uploadInspectionPage.RemovePhotoByIndex(1)
    await uploadInspectionPage.RemoveAllAddedPhotos()
    await uploadInspectionPage.Button_Back.click()
  } catch (error) {
    console.log(error)
  } finally {
    await global.nativeBrowser.deleteSession()
  }
})
