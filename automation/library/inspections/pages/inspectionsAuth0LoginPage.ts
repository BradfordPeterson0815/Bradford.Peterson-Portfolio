import { ChainablePromiseElement } from 'webdriverio'
import { inspections } from '../../../environments/env.appium.js'
import { PageStrings } from '../inspectionsConstants.js'
import { InspectionsGlobal } from '../inspectionsGlobal.js'
import { InspectionsNativePage } from './inspectionsNativePage.js'

export class InspectionsAuth0LoginPage extends InspectionsNativePage {
  readonly Button_Continue: ChainablePromiseElement
  readonly TextBox_Username: ChainablePromiseElement
  readonly TextBox_Code: ChainablePromiseElement
  readonly Title: ChainablePromiseElement

  constructor(global: InspectionsGlobal) {
    super(global)

    this.Button_Continue = global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().text("${PageStrings.Auth0SignInPage_Button_Continue}")`
    )
    this.TextBox_Username = global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().resourceId("${PageStrings.Auth0SignInPage_Username}")`
    )
    this.TextBox_Code = global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().resourceId("${PageStrings.Auth0SignInPage_Code}")`
    )
    this.Title = global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().text("${inspections.AUTH0_LOGIN_PAGE_TITLE}")`
    )
  }

  async LoginWithEmail(email: string) {
    await this.TextBox_Username.addValue(email)
    await this.Button_Continue.click()
  }

  async ContinueLoginWithCode(code: string) {
    await this.TextBox_Code.addValue(code)
    await this.Button_Continue.click()
  }
}
