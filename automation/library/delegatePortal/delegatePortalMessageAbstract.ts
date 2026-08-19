import { Locator } from '@playwright/test'
import { Element } from '../shared/element.js'
import { DelegatePortalBase } from './pages/delegatePortalBase.js'
import { DelegatePortalGlobal } from './delegatePortalGlobal.js'

export class DelegatePortalMessageAbstract extends DelegatePortalBase {
  readonly root: Locator
  readonly Label_Category: Element
  readonly Label_DateTime: Element
  readonly Label_Topic: Element
  readonly Label_Details: Element
  readonly CheckBox_Select: Element

  constructor(global: DelegatePortalGlobal, messageRoot: Locator) {
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
