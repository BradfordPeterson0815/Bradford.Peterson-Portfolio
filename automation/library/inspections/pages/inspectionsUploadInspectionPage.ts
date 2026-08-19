import { expect } from "playwright/test"
import { ChainablePromiseElement } from "webdriverio"
import { InspectionsClaim } from "../inpectionsClaim.js"
import { PageStrings, PhotoLabels } from "../inspectionsConstants.js"
import { InspectionsGlobal } from "../inspectionsGlobal.js"
import { InspectionsNativePage } from "./inspectionsNativePage.js"


export class InspectionsUploadInspectionPage extends InspectionsNativePage {
  readonly Title: ChainablePromiseElement
  readonly Button_Back: ChainablePromiseElement
  readonly InspectionUploadInfo_Title: ChainablePromiseElement
  readonly InspectionUploadInfo_Description: ChainablePromiseElement
  readonly Button_AddPhotos: ChainablePromiseElement
  readonly Button_SelectVideo: ChainablePromiseElement
  readonly Button_Submit: ChainablePromiseElement
  readonly scrollElement: ChainablePromiseElement
  readonly claim: InspectionsClaim
  readonly hidePlayerConrols = 'Hide player controls'
  readonly showPlayerConrols = 'Show player controls'

  constructor(global: InspectionsGlobal, claim: InspectionsClaim) {
    super(global)
    this.claim = claim
    this.Button_Back = this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().className("android.widget.Button").instance(0)`
    )
    this.Title = this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().className("android.widget.TextView").instance(0)`
    )
    this.InspectionUploadInfo_Title = global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().className("android.widget.TextView").instance(1)`
    )
    this.InspectionUploadInfo_Description = global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().className("android.widget.TextView").instance(2)`
    )
    this.Button_AddPhotos = this.global.nativeBrowser.$(
      `accessibility id:${PageStrings.UploadInspectionPage_Button_AddPhotos}`
    )
    this.Button_SelectVideo = this.global.nativeBrowser.$(
      `accessibility id:${PageStrings.UploadInspectionPage_Button_SelectVideo}`
    )
    this.Button_Submit = this.global.nativeBrowser.$(
      `accessibility id:${PageStrings.UploadInspectionPage_Button_Submit}`
    )
    this.scrollElement = global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().className("android.widget.ScrollView").instance(3)`
    )
  }

  async VerifyUI() {
    // Verify title
    const titleText = await this.Title.getText()
    expect(titleText).toBe(`${PageStrings.ClaimDetailsPage_Title_Prefix}${this.claim.claimNumber}`)

    // Verify Back button
    expect(await this.Button_Back.isDisplayed()).toBe(true)

    // Verify Inpections Upload info title and description
    expect(await this.InspectionUploadInfo_Title.isDisplayed()).toBe(true)
    const infoTitleText = await this.InspectionUploadInfo_Title.getText()
    expect(infoTitleText).toBe(PageStrings.UploadInspectionPage_InspectionUploadInfo_Title)

    expect(await this.InspectionUploadInfo_Description.isDisplayed()).toBe(true)
    const descriptionText = await this.InspectionUploadInfo_Description.getText()
    expect(descriptionText).toBe(PageStrings.UploadInspectionPage_InspectionUploadInfo_Description)

    // Verify Select Video button
    expect(await this.Button_SelectVideo.isDisplayed()).toBe(true)
    const selectVideoButtonText = await this.Button_SelectVideo.getAttribute('content-desc')
    expect(selectVideoButtonText).toBe(PageStrings.UploadInspectionPage_Button_SelectVideo)

    // Verify Add Photo(s) button
    expect(await this.Button_AddPhotos.isDisplayed()).toBe(true)
    const addPhotosButtonText = await this.Button_AddPhotos.getAttribute('content-desc')
    expect(addPhotosButtonText).toBe(PageStrings.UploadInspectionPage_Button_AddPhotos)

    // Verify Submit button
    expect(await this.Button_Submit.isDisplayed()).toBe(true)
    expect(await this.Button_Submit.isEnabled()).toBe(false)
    const submitButtonText = await this.Button_AddPhotos.getAttribute('content-desc')
    expect(submitButtonText).toBe(PageStrings.UploadInspectionPage_Button_Submit)
  }

  async SelectVideoByContentTimeStamp(
    contentTimeStamp: string,
    duration: string,
    description: string | null = null
  ) {
    await this.Button_SelectVideo.click()
    const videoToSelect = this.global.nativeBrowser.$(
      `-android uiautomator:description("Video taken on ${contentTimeStamp}  with duration ${duration}")`
    ) //Jul 24, 2025 1:58 PM - 00:30
    await videoToSelect.click()
    await this.WaitForPageElement(
      this.global.nativeBrowser.$(`accessibility id:${this.hidePlayerConrols}`)
    )
    if (description != null) {
      const editBoxes = await this.global.nativeBrowser.$$('//android.widget.EditText')
      await editBoxes[0].addValue(description)
    }
  }

  async SelectVideoByIndex(index: number, description: string | null = null) {
    await this.Button_SelectVideo.click()
    const videoParent = await this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().className("android.view.View").instance(8)`
    )
    const videoToSelect = await videoParent.$(
      `-android uiautomator:new UiSelector().className("android.view.View").instance(${index * 4})`
    )
    await videoToSelect.click()
    await this.WaitForPageElement(
      this.global.nativeBrowser.$(`accessibility id:${this.hidePlayerConrols}`)
    )
    if (description != null) {
      const editBoxes = await this.global.nativeBrowser.$$('//android.widget.EditText')
      await editBoxes[0].addValue(description)
    }
  }

  // async AddPhotoByContentTimeStamp(contentTimeStamp: string) {
  //   await this.Button_AddPhotos.click()
  //   const photoToSelect = this.global.nativeBrowser.$(`-android uiautomator:description("Photo taken on ${contentTimeStamp}")`) //Jul 10, 2025 9:45 AM
  //   await photoToSelect.click()
  //   const doneButton = this.global.nativeBrowser.$(`-android uiautomator:new UiSelector().text("Done")`)
  //   await doneButton.click()
  //   const selectLabel = this.global.nativeBrowser.$("-android uiautomator:new UiSelector().text(\"Select label...\")")
  //   await selectLabel.click()
  //   const estimatorInfoLabel = this.global.nativeBrowser.$("accessibility id:Estimator Info")
  //   await estimatorInfoLabel.click()
  //   const editBoxes = await this.global.nativeBrowser.$$("//android.widget.EditText")
  //   await editBoxes[0].addValue('This is a description for the video')
  //   const editLabelDescription = this.global.nativeBrowser.$("class name:android.widget.EditText")
  //   await editLabelDescription.addValue('This is a description for the Estimator Info Label')
  // }

  async AddPhotoByIndex(
    index: number,
    label: PhotoLabels | null = null,
    description: string | null = null
  ) {
    const addedPhotoIndex = await this.CurrentPhotoCount()
    await this.Button_AddPhotos.click()
    const photoParent = await this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().className("android.view.View").instance(8)`
    )
    const photoToSelect = await photoParent.$(
      `-android uiautomator:new UiSelector().className("android.view.View").instance(${index * 4})`
    )
    await photoToSelect.click()
    const doneButton = await this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().text("Done")`
    )
    await doneButton.click()
    await this.WaitForPageElement(this.Button_Submit)
    let offset = 0
    if (await this.IsVideoDisplayed()) {
      offset = (await this.AreVideoControlsShowing()) ? 2 : 1
    }
    if (label != null) {
      const targetLabel = await this.global.nativeBrowser.$(
        `-android uiautomator:new UiSelector().className("android.view.View").instance(${addedPhotoIndex + offset + 1})`
      )
      //await targetLabel.scrollIntoView({direction: "up", scrollableElement: this.scrollElement})
      await targetLabel.scrollIntoView({ block: 'center', inline: 'center' })
      //await targetLabel.scrollIntoView({direction: "up"})
      await targetLabel.click()
      const estimatorInfoLabel = await this.global.nativeBrowser.$(`accessibility id:${label}`)
      await estimatorInfoLabel.click()
    }
    if (description != null) {
      const editBoxes = await this.global.nativeBrowser.$$('//android.widget.EditText')
      //await await editBoxes[addedPhotoIndex + offset].scrollIntoView({direction: "up", scrollableElement: this.scrollElement})
      await editBoxes[addedPhotoIndex + offset].scrollIntoView({
        block: 'center',
        inline: 'center',
      })
      //await await editBoxes[addedPhotoIndex + offset].scrollIntoView({direction: "up"})
      await editBoxes[addedPhotoIndex + offset].addValue(description)
    }
  }

  async RemoveSelectedVideo() {
    const videoIsDisplayed = await this.IsVideoDisplayed()
    if (videoIsDisplayed) {
      await this.global.nativeBrowser
        .$(`-android uiautomator:new UiSelector().className("android.widget.Button").instance(2)`)
        .click()
    }
  }

  async RemoveAllAddedPhotos() {
    const offset = (await this.IsVideoDisplayed()) ? 1 : 0
    const photosAreDisplayed = await this.ArePhotosDisplayed()
    if (photosAreDisplayed) {
      await this.global.nativeBrowser
        .$(
          `-android uiautomator:new UiSelector().className("android.widget.Button").instance(${offset + 3})`
        )
        .click()
    }
  }

  async RemovePhotoByIndex(index: number) {
    const offset = (await this.IsVideoDisplayed()) ? 1 : 0
    const targetedTrashButton = this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().className("android.widget.Button").instance(${index + offset + 4})`
    )
    //await targetedTrashButton.scrollIntoView({direction: "up", scrollableElement: this.scrollElement})
    await targetedTrashButton.scrollIntoView({ block: 'center', inline: 'center' })
    //await targetedTrashButton.scrollIntoView({direction: "up"})
    await targetedTrashButton.click()
  }

  async WaitForLoad() {
    await this.WaitForPageElement(this.Title)
  }

  async IsVideoDisplayed() {
    const videoIsDisplayedVersion1 = await this.global.nativeBrowser
      .$(`accessibility id:${this.hidePlayerConrols}`)
      .isDisplayed()
    const videoIsDisplayedVersion2 = await this.global.nativeBrowser
      .$(`accessibility id:${this.showPlayerConrols}`)
      .isDisplayed()
    return videoIsDisplayedVersion1 || videoIsDisplayedVersion2
  }

  async AreVideoControlsShowing() {
    return await this.global.nativeBrowser
      .$(`accessibility id:${this.hidePlayerConrols}`)
      .isDisplayed()
  }

  async CurrentPhotoCount() {
    const photoCount = await this.global.nativeBrowser.$$('//android.widget.ImageView').length
    return photoCount
  }

  async ArePhotosDisplayed() {
    return (await this.CurrentPhotoCount()) > 0
  }
}