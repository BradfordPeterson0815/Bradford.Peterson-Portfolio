import { TemplateTabTypes } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalTemplatesCommunicationTab } from '../tabs/claimsPortalTemplatesCommunicationTab.js'
import { ClaimsPortalTemplatesDocumentTab } from '../tabs/claimsPortalTemplatesDocumentTab.js'
import { ClaimsPortalTemplatesNoteTab } from '../tabs/claimsPortalTemplatesNoteTab.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'

export class ClaimsPortalTemplatesPage extends ClaimsPortalBasePage {
  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.URL = `${global.baseUrl}templates`
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.page.goto(this.URL)
    } else {
      await this.leftNavBar.GoHome()
      await this.leftNavBar.Button_Admin.Click()
      await this.page.waitForLoadState()
      await this.leftNavBar.Button_Admin_Templates.Click()
      await this.page.waitForLoadState()
    }
    await this.page.waitForTimeout(2000)
  }

  async IsTabActive(templateTab: TemplateTabTypes) {
    await this.page.waitForTimeout(1000)
    const targetLocator = this.LookupTemplateTabLocator(templateTab)
    const result = (await this.page.locator(targetLocator).getAttribute('aria-selected')) == 'true'
    return result
  }

  LookupTemplateTabLocator(templateTab: TemplateTabTypes) {
    switch (templateTab) {
      case TemplateTabTypes.Document:
        return `a[href="/templates/document"]`
      case TemplateTabTypes.Note:
        return `a[href="/templates/note"]`
      case TemplateTabTypes.Communication:
        return `a[href="/templates/communication"]`
      default:
        throw new Error(`Undefined Template Tab type : ${templateTab}`)
    }
  }

  async SelectTemplateTab(templateTab: TemplateTabTypes) {
    const targetLocator = this.LookupTemplateTabLocator(templateTab)
    let tabToReturn
    let locatorToWaitFor
    await this.page.locator(targetLocator).click()
    switch (templateTab) {
      case TemplateTabTypes.Document:
        tabToReturn = new ClaimsPortalTemplatesDocumentTab(this.global)
        locatorToWaitFor = tabToReturn.Title.locator
        break
      case TemplateTabTypes.Note:
        tabToReturn = new ClaimsPortalTemplatesNoteTab(this.global)
        locatorToWaitFor = tabToReturn.Title.locator
        break
      case TemplateTabTypes.Communication:
        tabToReturn = new ClaimsPortalTemplatesCommunicationTab(this.global)
        locatorToWaitFor = tabToReturn.Title.locator
        break

      default:
        throw new Error(`Undefined Template Tab type : ${templateTab}`)
    }
    await locatorToWaitFor.waitFor({ state: 'visible' })
    await this.page.waitForTimeout(1000)
    return tabToReturn
  }
}
