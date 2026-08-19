import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { Locator } from 'playwright/test'

export class ClaimsPortalInspectionConsentAlert extends ClaimsPortalBase {
  readonly Button_Leave: Element
  readonly Button_Continue: Element
  readonly Title: Element
  readonly Description: Element
  readonly parent: Locator
  readonly header: Locator
  readonly footer: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="alertdialog"]').nth(0)
    this.header = this.parent.locator(`div[data-slot="alert-dialog-header"]`).nth(0)
    this.footer = this.parent.locator(`div[data-slot="alert-dialog-footer"]`).nth(0)

    this.Button_Leave = new Element(global.page, this.footer.getByText('Leave', { exact: true }))
    this.Button_Continue = new Element(
      global.page,
      this.footer.getByText('Continue', { exact: true })
    )
    this.Title = new Element(
      global.page,
      this.header.locator('h2'),
      'This Virtual Inspection is being recorded'
    )
    this.Description = new Element(
      global.page,
      this.header.locator('p'),
      'By continuing you are consenting to be recorded.'
    )
  }
}
