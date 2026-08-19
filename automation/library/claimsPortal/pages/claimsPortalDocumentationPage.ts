import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'
import { Element } from '../../shared/element.js'
import { DocumentationPageStrings } from '../claimsPortalConstants.js'

export class ClaimsPortalDocumentationPage extends ClaimsPortalBasePage {
  readonly Title: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.Title = new Element(global.page, this.page.locator('h1'), DocumentationPageStrings.Title)
    this.URL = `${global.baseUrl}documentation`
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.page.goto(this.URL)
    } else {
      await this.leftNavBar.GoHome()
      await this.leftNavBar.Button_Documentation.Click()
      await this.page.waitForLoadState()
    }
    await this.page.waitForTimeout(1000)
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }
}
