import { expect } from 'playwright/test'
import { ChainablePromiseElement } from 'webdriverio'
import { InspectionsClaim } from '../inpectionsClaim.js'
import { PageStrings, UploadQueues } from '../inspectionsConstants.js'
import { InspectionsGlobal } from '../inspectionsGlobal.js'
import { InspectionsClaimDetailsPage } from './inspectionsClaimDetailsPage.js'
import { InspectionsNativePage } from './inspectionsNativePage.js'
import { InspectionsTitlePage } from './inspectionsTitlePage.js'
import { InspectionsUploadsPage } from './inspectionsUploadsPage.js'

export class InspectionsHomePage extends InspectionsNativePage {
  readonly Title: ChainablePromiseElement
  readonly UserAvatar: ChainablePromiseElement
  readonly EditBox_SearchClaim: ChainablePromiseElement
  readonly Button_Home: ChainablePromiseElement
  readonly Button_Uploads: ChainablePromiseElement
  readonly NoClaimsFoundTitleLocator: string
  readonly ClaimListParentLocator: string
  readonly AvatarItemsParent: ChainablePromiseElement

  constructor(global: InspectionsGlobal) {
    super(global)
    this.Title = this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().text("${PageStrings.HomePage_Title}")`
    )
    this.UserAvatar = this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().description("${PageStrings.HomePage_Avatar}")`
    )
    this.AvatarItemsParent = this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().description("Version Info")`
    )
    this.EditBox_SearchClaim = this.global.nativeBrowser.$('android.widget.EditText')
    this.NoClaimsFoundTitleLocator = `-android uiautomator:new UiSelector().text("${PageStrings.HomePage_NoClaimsFoundAlert_Title}")`
    this.ClaimListParentLocator = `-android uiautomator:new UiSelector().className("android.widget.ScrollView").instance(2)`
    this.Button_Home = global.nativeBrowser.$(
      `accessibility id:${PageStrings.HomePage_Button_Home}`
    )
    this.Button_Uploads = global.nativeBrowser.$(
      `accessibility id:${PageStrings.HomePage_Button_Uploads}`
    )
  }

  async SelectAClaim(claim: InspectionsClaim) {
    const claimElement = await this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().text("${claim.claimNumber}")`
    )
    await claimElement.click()
    const claimDetailsPage = new InspectionsClaimDetailsPage(this.global, claim)
    await claimDetailsPage.WaitForLoad()
    return claimDetailsPage
  }

  async SearchForAClaim(claimNumber: string) {
    await this.EditBox_SearchClaim.setValue(claimNumber)
  }

  async IsClaimListEmpty() {
    const count = (await this.global.nativeBrowser.$$(this.NoClaimsFoundTitleLocator).getElements())
      .length
    return count > 0
  }

  async VerifyClaimListEmptyAlert() {
    if (await this.IsClaimListEmpty()) {
      const claimsParent = await this.global.nativeBrowser.$(this.ClaimListParentLocator)
      const messageChildren = await claimsParent.$$('//child::android.widget.TextView')
      const messageTitle = await messageChildren[0].getText()
      const messageDetails = await messageChildren[1].getText()
      expect(messageTitle).toBe(PageStrings.HomePage_NoClaimsFoundAlert_Title)
      expect(messageDetails).toBe(PageStrings.HomePage_NoClaimsFoundAlert_Description)
    }
  }

  async ClearClaimSearch() {
    await this.EditBox_SearchClaim.setValue('')
  }

  async FindClaimByClaimNumber(claimNumber: string) {
    const claimsInList = await this.PullClaimsFromList()
    for (let index = 0; index < claimsInList.length; index++) {
      if (claimsInList[index].claimNumber === claimNumber) {
        return claimsInList[index]
      }
    }
    return null
  }

  async DisplayedClaimsCount() {
    if (!(await this.IsClaimListEmpty())) {
      const claimsParent = await this.global.nativeBrowser.$(this.ClaimListParentLocator)
      const contactAndClaimChildren = await claimsParent.$$('//child::android.widget.TextView')
      return (await contactAndClaimChildren.length) / 3
    } else {
      return 0
    }
  }

  async PullClaimsFromList() {
    const claimsInList: InspectionsClaim[] = []
    if (!(await this.IsClaimListEmpty())) {
      const claimsParent = await this.global.nativeBrowser.$(this.ClaimListParentLocator)
      const contactAndClaimChildren = await claimsParent.$$('//child::android.widget.TextView')
      const contactAndClaimStatusLength = await contactAndClaimChildren.length
      const claimsCount = contactAndClaimStatusLength / 3
      for (let index = 0; index < claimsCount; index++) {
        const offset = index * 3
        const tempClaim = {
          primaryContact: await contactAndClaimChildren[offset].getText(),
          claimNumber: await contactAndClaimChildren[offset + 1].getText(),
          inspectionStatus: await contactAndClaimChildren[offset + 2].getText(),
        } as InspectionsClaim
        claimsInList.push(tempClaim)
      }
    }
    return claimsInList
  }

  async VerifyUI() {
    if (await this.IsClaimListEmpty()) {
      // Verify empty claim list alert if there are no claims
      await this.VerifyClaimListEmptyAlert()
    } else {
      // Verify Title
      const titleText = await this.Title.getText()
      expect(titleText).toBe(PageStrings.HomePage_Title)

      // Verify searchbox
      expect(await this.EditBox_SearchClaim.isDisplayed()).toBe(true)

      // Verify at least 1 claim is displayed
      const claimsCount = await this.DisplayedClaimsCount()
      expect(claimsCount).toBeGreaterThan(0)

      // Verify Home button
      expect(await this.Button_Home.isDisplayed()).toBe(true)
      const homeButtonText = await this.Button_Home.getText()
      expect(homeButtonText).toBe(PageStrings.HomePage_Button_Home)

      // Verify Uploads Button
      expect(await this.Button_Uploads.isDisplayed()).toBe(true)
      const uploadButtonText = await this.Button_Uploads.getText()
      expect(uploadButtonText).toBe(PageStrings.HomePage_Button_Uploads)
    }
  }

  async GetBuildInfo() {
    await this.UserAvatar.click()
    const avatarChildren = await this.AvatarItemsParent.$$('//child::android.widget.TextView')
    const buildVersion = await avatarChildren[2].getText()
    const buildTimestamp = await avatarChildren[3].getText()
    const buildGUID = await avatarChildren[4].getText()
    return {
      version: buildVersion,
      timestamp: buildTimestamp,
      guid: buildGUID,
    }
  }

  async Logout() {
    await this.UserAvatar.click()
    const logoutMenuItem = this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().description("Logout")`
    )
    await logoutMenuItem.click()
    const titlePage = new InspectionsTitlePage(this.global)
    await titlePage.WaitForLoad()
    return titlePage
  }

  async GotoUploads(selectedQueue: UploadQueues = UploadQueues.InProgress) {
    await this.Button_Uploads.click()
    const uploadPage = new InspectionsUploadsPage(this.global)
    await uploadPage.SelectQueue(selectedQueue)
    return uploadPage
  }

  async WaitForLoad() {
    await this.WaitForPageElement(this.Title, 60000)
    const claimListParent = await this.global.nativeBrowser.$(this.ClaimListParentLocator)
    await this.WaitForPageElement(claimListParent)
    await this.global.nativeBrowser.pause(4000)
  }
}
