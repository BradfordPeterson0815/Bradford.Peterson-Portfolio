import { ClientPortalBase } from '../pages/clientPortalBase.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { Locator } from 'playwright/test'
import { AlertStrings } from '../clientPortalConstants.js'

export class ClientPortalDetachVendor extends ClientPortalBase {
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Confirm: Element
  readonly Title: Element
  readonly Description: Element
  readonly Description_More: Element
  readonly Button_Radio_ServiceArea: Element
  readonly Button_Radio_Vendor: Element
  readonly parent: Locator
  readonly footer: Locator

  constructor(global: ClientPortalGlobal) {
    super(global)
    this.parent = this.page.locator('section[role="dialog"][id*="chakra-modal"]').nth(0)
    this.footer = this.parent.locator(`div[class*="chakra-modal__footer"]`).nth(0)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label="Close"]`)
    )
    this.Button_Close = new Element(global.page, this.footer.getByText('Close', { exact: true }))
    this.Button_Confirm = new Element(
      global.page,
      this.footer.getByText('Confirm', { exact: true })
    )
    this.Title = new Element(
      global.page,
      this.parent.locator('header'),
      AlertStrings.DetachVendor_Title
    )
    this.Description = new Element(
      global.page,
      this.parent.locator('div > div > p'),
      AlertStrings.DetachVendor_Description
    )
    this.Description_More = new Element(
      global.page,
      this.parent.locator('> div > div > div > div > label'),
      AlertStrings.DetachVendor_Description_More
    )
    this.Button_Radio_ServiceArea = new Element(
      global.page,
      this.page
        .locator('#modal_detachvendorfromservicearea_radio_servicearea')
        .locator('..')
        .locator('span')
        .first()
    )
    this.Button_Radio_Vendor = new Element(
      global.page,
      this.page
        .locator('#modal_detachvendorfromservicearea_radio_vendor')
        .locator('..')
        .locator('span')
        .first()
    )
  }
}
