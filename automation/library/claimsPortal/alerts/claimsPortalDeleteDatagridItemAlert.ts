import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { Locator } from 'playwright/test'

export class ClaimsPortalDeleteDatagridItemAlert extends ClaimsPortalBase {
  readonly Button_Cancel: Element
  readonly Button_Delete: Element
  readonly Title: Element
  readonly Description: Element
  readonly parent: Locator
  readonly header: Locator
  readonly footer: Locator

  constructor(global: ClaimsPortalGlobal, expectedTitle: string, expectedDescription: string) {
    super(global)
    this.parent = this.page
      .locator('div[role="alertdialog"][data-slot="alert-dialog-popup"]')
      .nth(0)
    this.header = this.parent.locator(`div[data-slot="alert-dialog-header"]`).nth(0)
    this.footer = this.parent.locator(`div[data-slot="alert-dialog-footer"]`).nth(0)
    this.Button_Cancel = new Element(global.page, this.footer.getByText('Cancel', { exact: true }))
    this.Button_Delete = new Element(global.page, this.footer.getByText('Delete', { exact: true }))
    this.Title = new Element(global.page, this.header.locator('h2'), expectedTitle)
    this.Description = new Element(global.page, this.header.locator('p'), expectedDescription)
  }
}
