import { Locator } from '@playwright/test'
import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { ClaimsPortalBase } from './pages/claimsPortalBase.js'
import { Element } from '../shared/element.js'

export class ClaimsPortalMessageAbstract extends ClaimsPortalBase {
  readonly root: Locator
  readonly Label_Category: Element
  readonly Label_DateTime: Element
  readonly Label_Topic: Element
  readonly Label_Details: Element
  readonly CheckBox_Select: Element

  constructor(global: ClaimsPortalGlobal, messageRoot: Locator) {
    super(global)
    this.root = messageRoot
    this.CheckBox_Select = new Element(
      global.page,
      this.root.locator(`input[type='checkbox']`).first()
    )
    this.Label_Category = new Element(
      this.global.page,
      this.root.locator(`div[id*='_content'] > div p`).nth(0)
    )
    this.Label_DateTime = new Element(
      this.global.page,
      this.root.locator(`div[id*='_content'] > div p`).nth(1)
    )
    this.Label_Topic = new Element(
      this.global.page,
      this.root.locator(`div[id*='_content'] > p`).nth(0)
    )
    this.Label_Details = new Element(
      this.global.page,
      this.root.locator(`div[id*='_content'] > p`).nth(1)
    )
  }

  async MakeActive() {
    await this.root.click()
    await this.page.waitForTimeout(2000)
  }

  async IsUnread() {
    return false
  }
}
