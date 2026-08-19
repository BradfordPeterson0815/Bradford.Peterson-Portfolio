import { DelegatePortalBase } from '../pages/delegatePortalBase.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { Element } from '../../shared/element.js'
import { Locator } from 'playwright/test'
import { ClaimInspectionConsentAlertStrings } from '../delegatePortalConstants.js'

export class DelegatePortalInspectionConsentAlert extends DelegatePortalBase {
  readonly Button_Leave: Element
  readonly Button_Continue: Element
  readonly Title: Element
  readonly Description: Element
  readonly parent: Locator
  readonly header: Locator
  readonly footer: Locator

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="alertdialog"]').nth(0)
    this.header = this.parent.locator(`div[data-slot="alert-dialog-header"]`).nth(0)
    this.footer = this.parent.locator(`div[data-slot="alert-dialog-footer"]`).nth(0)
    this.Button_Leave = new Element(
      global.page,
      this.footer.getByText(ClaimInspectionConsentAlertStrings.Button_Leave, { exact: true })
    )
    this.Button_Continue = new Element(
      global.page,
      this.footer.getByText(ClaimInspectionConsentAlertStrings.Button_Continue, { exact: true })
    )
    this.Title = new Element(
      global.page,
      this.header.locator('h2'),
      ClaimInspectionConsentAlertStrings.Title
    )
    this.Description = new Element(
      global.page,
      this.header.locator('p'),
      ClaimInspectionConsentAlertStrings.Description
    )
  }
}
