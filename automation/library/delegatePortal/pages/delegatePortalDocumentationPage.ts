import { Element } from '../../shared/element.js'
import { DocumentationPageStrings } from '../delegatePortalConstants.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalBasePage } from './delegatePortalBasePage.js'

export class DelegatePortalDocumentationPage extends DelegatePortalBasePage {
  readonly Title: Element

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.Title = new Element(global.page, this.page.locator('h1'), DocumentationPageStrings.Title)
    this.URL = `${global.baseUrl}documentation`
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.page.goto(this.URL)
    } else {
      await this.leftNavBar.Button_Documentation.Click()
      await this.page.waitForLoadState()
    }
    await this.page.waitForTimeout(1000)
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }
}
