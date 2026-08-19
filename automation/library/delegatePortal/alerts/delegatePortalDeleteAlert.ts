import { Locator } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalBase } from '../pages/delegatePortalBase.js'

export class DelegatePortalDeleteAlert extends DelegatePortalBase {
  readonly Button_Close_X: Element
  readonly Button_Cancel: Element
  readonly Button_Close: Element
  readonly Button_Delete: Element
  readonly Button_Deactivate: Element
  readonly Title: Element
  readonly Description: Element
  readonly parent: Locator
  readonly footer: Locator

  constructor(global: DelegatePortalGlobal, expectedTitle: string, expectedDescription: string) {
    super(global)
    this.parent = this.page.locator('section[role="dialog"][id*="chakra-modal"]').nth(0)
    this.footer = this.parent.locator(`div[class*="chakra-modal__footer"]`).nth(0)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label="Close"]`)
    )
    this.Button_Cancel = new Element(global.page, this.footer.getByText('Cancel', { exact: true }))
    this.Button_Close = new Element(global.page, this.footer.getByText('Close', { exact: true }))
    this.Button_Delete = new Element(global.page, this.footer.getByText('Delete', { exact: true }))
    this.Button_Deactivate = new Element(
      global.page,
      this.footer.getByText('Deactivate', { exact: true })
    )
    this.Title = new Element(global.page, this.parent.locator('header'), expectedTitle)
    this.Description = new Element(
      global.page,
      this.parent.locator('div > div > p'),
      expectedDescription
    )
  }
}
