import { expect } from 'playwright/test'
import { ChainablePromiseElement } from 'webdriverio'
import { PageStrings } from '../inspectionsConstants.js'
import { InspectionsGlobal } from '../inspectionsGlobal.js'
import { GetAuthenticationCode } from '../inspectionsLauncher.js'
import { InspectionsAuth0LoginPage } from './inspectionsAuth0LoginPage.js'
import { InspectionsNativePage } from './inspectionsNativePage.js'

export class InspectionsTitlePage extends InspectionsNativePage {
  readonly CompanyInspectionsInfo_Title: ChainablePromiseElement
  readonly CompanyInspectionsInfo_Description1: ChainablePromiseElement
  readonly CompanyInspectionsInfo_Description2: ChainablePromiseElement
  readonly Button_SignIn: ChainablePromiseElement
  readonly Button_Help: ChainablePromiseElement

  constructor(global: InspectionsGlobal) {
    super(global)
    this.CompanyInspectionsInfo_Title = global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().className("android.widget.TextView").instance(0)`
    )
    this.CompanyInspectionsInfo_Description1 = global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().className("android.widget.TextView").instance(1)`
    )
    this.CompanyInspectionsInfo_Description2 = global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().className("android.widget.TextView").instance(2)`
    )
    this.Button_SignIn = global.nativeBrowser.$(
      `accessibility id:${PageStrings.TitlePage_Button_SignIn}`
    )
    this.Button_Help = global.nativeBrowser.$(
      `accessibility id:${PageStrings.TitlePage_Button_Help}`
    )
  }

  async SignIn(email: string | null = null) {
    await this.Button_SignIn.click()
    if (email != null) {
      // check to see if we are being prompted to login
      const loginPage = new InspectionsAuth0LoginPage(this.global)
      const loginIsPresent = await loginPage.Title.isDisplayed()
      if (loginIsPresent) {
        // handle the Inspections Login dialog
        await loginPage.LoginWithEmail(email)
        const noOlderThan = new Date(Date.now())
        // Handle code retrieval as needed
        const code = await GetAuthenticationCode(email, noOlderThan)
        if (code === undefined) {
          throw new Error('No code was found on the email server')
        }
        await loginPage.ContinueLoginWithCode(code)
        this.global.performedAuthenticationOnLaunch = true
      }
    }
  }

  async VerifyUI() {
    // Verify Info title
    expect(await this.CompanyInspectionsInfo_Title.isDisplayed()).toBe(true)
    const titleText = await this.CompanyInspectionsInfo_Title.getText()
    expect(titleText).toBe(PageStrings.TitlePage_CompanyInspectionsInfo_Title)

    // Verify info description
    expect(await this.CompanyInspectionsInfo_Description1.isDisplayed()).toBe(true)
    expect(await this.CompanyInspectionsInfo_Description2.isDisplayed()).toBe(true)
    const description1Text = await this.CompanyInspectionsInfo_Description1.getText()
    const description2Text = await this.CompanyInspectionsInfo_Description2.getText()
    expect(description1Text).toBe(PageStrings.TitlePage_CompanyInspectionsInfo_Description1)
    expect(description2Text).toBe(PageStrings.TitlePage_CompanyInspectionsInfo_Description2)

    // Verify Sign In button
    expect(await this.Button_SignIn.isDisplayed()).toBe(true)
    const signInButtonText = await this.Button_SignIn.getText()
    expect(signInButtonText).toBe(PageStrings.TitlePage_Button_SignIn)

    // Verify Help button
    expect(await this.Button_Help.isDisplayed()).toBe(true)
    const helpButtonText = await this.Button_Help.getText()
    expect(helpButtonText).toBe(PageStrings.TitlePage_Button_Help)
  }

  async WaitForLoad() {
    await this.WaitForPageElement(this.Button_SignIn)
  }
}
