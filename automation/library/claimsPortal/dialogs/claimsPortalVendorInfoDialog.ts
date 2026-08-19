import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { Locator } from 'playwright/test'
import { ClaimsPortalVendor } from '../claimsPortalVendor.js'

export class ClaimsPortalVendorInfoDialog extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly badge_DataSource: Locator
  readonly parent: Locator
  readonly footer: Locator
  readonly vendor: ClaimsPortalVendor

  constructor(global: ClaimsPortalGlobal, vendor: ClaimsPortalVendor) {
    super(global)
    this.vendor = vendor
    this.parent = this.page.locator('section[role="dialog"][id*="chakra-modal"]').nth(0)
    this.footer = this.parent.locator(`div[class*="chakra-modal__footer"]`).nth(0)
    this.Button_Close_X = new Element(
      global.page,
      this.page.locator(`section[id*='chakra-modal'] button[aria-label='Close']`)
    )
    this.Button_Close = new Element(global.page, this.footer.getByText('Close', { exact: true }))
    this.Title = new Element(
      global.page,
      this.parent.locator(`header[id*='chakra-modal'] h3`),
      vendor.name
    )
    this.badge_DataSource = this.parent.locator(`header[id*='chakra-modal'] span.chakra-badge`)
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
