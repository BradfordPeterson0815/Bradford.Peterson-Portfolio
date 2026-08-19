import { expect } from 'playwright/test'
import { ChainablePromiseElement } from 'webdriverio'
import { InspectionsClaim } from '../inpectionsClaim.js'
import { PageStrings } from '../inspectionsConstants.js'
import { InspectionsGlobal } from '../inspectionsGlobal.js'
import { InspectionsNativePage } from './inspectionsNativePage.js'
import { InspectionsUploadInspectionPage } from './inspectionsUploadInspectionPage.js'

export class InspectionsClaimDetailsPage extends InspectionsNativePage {
  readonly Button_Back: ChainablePromiseElement
  readonly Button_Options: ChainablePromiseElement
  readonly Title: ChainablePromiseElement
  readonly Button_ViewNotes: ChainablePromiseElement
  readonly Button_CreateNote: ChainablePromiseElement
  readonly Button_UploadInspection: ChainablePromiseElement
  readonly claim: InspectionsClaim

  constructor(global: InspectionsGlobal, claim: InspectionsClaim) {
    super(global)
    this.claim = claim
    this.Button_Back = this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().className("android.widget.Button").instance(0)`
    )
    this.Title = this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().className("android.widget.TextView").instance(0)`
    )
    this.Button_Options = this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().className("android.widget.Button").instance(1)`
    )
    this.Button_UploadInspection = global.nativeBrowser.$(
      `accessibility id:${PageStrings.ClaimDetailsPage_Button_UploadInspection}`
    )
    this.Button_ViewNotes = global.nativeBrowser.$(
      `accessibility id:${PageStrings.ClaimDetailsPage_Button_ViewNotes}`
    )
    this.Button_CreateNote = global.nativeBrowser.$(
      `accessibility id:${PageStrings.ClaimDetailsPage_Button_CreateNote}`
    )
  }

  async VerifyUI() {
    const checkAddressLine2MissingText = await this.global.nativeBrowser
      .$(`-android uiautomator:new UiSelector().className("android.widget.TextView").instance(6)`)
      .getText()
    const line2IsMissing =
      checkAddressLine2MissingText === PageStrings.ClaimDetailsPage_Label_PropertyAddress

    // Verify title
    const titleText = await this.Title.getText()
    expect(titleText).toBe(`${PageStrings.ClaimDetailsPage_Title_Prefix}${this.claim.claimNumber}`)

    // Verify Back button
    expect(await this.Button_Back.isDisplayed()).toBe(true)

    // Verify Contact
    const contactText = await this.global.nativeBrowser
      .$(`-android uiautomator:new UiSelector().className("android.widget.TextView").instance(1)`)
      .getText()
    expect(contactText).toBe(this.claim.primaryContact)

    // Verify Policy#
    const policyNumberText = await this.global.nativeBrowser
      .$(`-android uiautomator:new UiSelector().className("android.widget.TextView").instance(2)`)
      .getText()
    expect(policyNumberText).toBe(
      `${PageStrings.ClaimDetailsPage_PolicyNumber_Prefix}${this.claim.policyNumber}`
    )

    // Verify Property Address Title
    const propertyAddressTitleText = await this.global.nativeBrowser
      .$(`-android uiautomator:new UiSelector().className("android.widget.TextView").instance(3)`)
      .getText()
    expect(propertyAddressTitleText).toBe(PageStrings.ClaimDetailsPage_Label_PropertyAddress)

    // Verify Address Line 1
    const addressLine1Text = await this.global.nativeBrowser
      .$(`-android uiautomator:new UiSelector().className("android.widget.TextView").instance(4)`)
      .getText()
    expect(addressLine1Text).toBe(this.claim.propertyAddress_Address1)

    if (!line2IsMissing) {
      // Verify Address Line 2 (optional)
      const addressLine2Text = await this.global.nativeBrowser
        .$(`-android uiautomator:new UiSelector().className("android.widget.TextView").instance(5)`)
        .getText()
      expect(addressLine2Text).toBe(this.claim.propertyAddress_Address2)
    }
    const adjust = line2IsMissing ? 5 : 6

    // Verify CityStateZip
    const cityStateZipText = await this.global.nativeBrowser
      .$(
        `-android uiautomator:new UiSelector().className("android.widget.TextView").instance(${adjust})`
      )
      .getText()
    expect(cityStateZipText).toBe(this.claim.propertyAddress_CityStateZip)

    // Verify Loss Description Title
    const lossDescriptionTitleText = await this.global.nativeBrowser
      .$(
        `-android uiautomator:new UiSelector().className("android.widget.TextView").instance(${adjust + 1})`
      )
      .getText()
    expect(lossDescriptionTitleText).toBe(PageStrings.ClaimDetailsPage_Label_LossDescription)

    // Verify Loss Description Details
    const lossDescriptionDetailsText = await this.global.nativeBrowser
      .$(
        `-android uiautomator:new UiSelector().className("android.widget.TextView").instance(${adjust + 2})`
      )
      .getText()
    expect(lossDescriptionDetailsText).toBe(this.claim.lossDescription)

    // Verify Notes Title
    const notesText = await this.global.nativeBrowser
      .$(
        `-android uiautomator:new UiSelector().className("android.widget.TextView").instance(${adjust + 3})`
      )
      .getText()
    expect(notesText).toBe(PageStrings.ClaimDetailsPage_Label_Notes)

    // Verify View Notes button
    expect(await this.Button_ViewNotes.isDisplayed()).toBe(true)
    const viewNotesButtonText = await this.global.nativeBrowser
      .$(
        `-android uiautomator:new UiSelector().className("android.widget.TextView").instance(${adjust + 4})`
      )
      .getText()
    expect(viewNotesButtonText).toBe(PageStrings.ClaimDetailsPage_Button_ViewNotes)

    // Verify Create Note button
    expect(await this.Button_CreateNote.isDisplayed()).toBe(true)
    const createNoteButtonText = await this.global.nativeBrowser
      .$(
        `-android uiautomator:new UiSelector().className("android.widget.TextView").instance(${adjust + 5})`
      )
      .getText()
    expect(createNoteButtonText).toBe(PageStrings.ClaimDetailsPage_Button_CreateNote)

    // Verify Upload Inspection button
    expect(await this.Button_UploadInspection.isDisplayed()).toBe(true)
    const uploadInspectionButtonText = await this.global.nativeBrowser
      .$(
        `-android uiautomator:new UiSelector().className("android.widget.TextView").instance(${adjust + 6})`
      )
      .getText()
    expect(uploadInspectionButtonText).toBe(PageStrings.ClaimDetailsPage_Button_UploadInspection)
  }

  async OpenUploadInspection() {
    await this.Button_Options.click()
    const uploadVideoMenuItem = this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().description("Upload Video")`
    )
    await uploadVideoMenuItem.click()
    const uploadInspectionPage = new InspectionsUploadInspectionPage(this.global, this.claim)
    await uploadInspectionPage.WaitForLoad()
    return uploadInspectionPage
  }

  async WaitForLoad() {
    await this.WaitForPageElement(this.Title, 60000)
  }
}
