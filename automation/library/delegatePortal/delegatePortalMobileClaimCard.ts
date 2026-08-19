import { Locator } from '@playwright/test'
import { Element } from '../shared/element.js'
import { DelegatePortalBase } from './pages/delegatePortalBase.js'
import { DelegatePortalGlobal } from './delegatePortalGlobal.js'
import { MobileStrings } from './delegatePortalConstants.js'

export class DelegatePortalMobileClaimCard extends DelegatePortalBase {
  readonly root: Locator
  readonly Link_GotoClaim: Element
  private readonly Label_PrimaryContact: Element
  private readonly Link_ContactInfo: Element
  private readonly Label_CarrierAndLossType: Element
  constructor(global: DelegatePortalGlobal, cardRoot: Locator) {
    super(global)
    this.root = cardRoot
    this.Link_GotoClaim = new Element(
      this.global.page,
      this.root.locator(`a[aria-label^="${MobileStrings.GoToClaim}"]`)
    )
    this.Label_PrimaryContact = new Element(
      this.global.page,
      this.root.locator('div > div').nth(1).locator('p').nth(0)
    )
    this.Link_ContactInfo = new Element(
      this.global.page,
      this.root.locator('div > div').nth(1).locator('a').nth(0)
    )
    this.Label_CarrierAndLossType = new Element(
      this.global.page,
      this.root.locator('div > div').nth(1).locator('p').nth(1)
    )
  }

  async PrimaryContact() {
    return await this.Label_PrimaryContact.GetText()
  }

  async ContactInfo() {
    if (await this.IsShrunk()) {
      const phoneLocator = this.root.locator('a[aria-label^="Call"]')
      const emailLocator = this.root.locator('a[aria-label^="Email"]')
      if ((await phoneLocator.count()) > 0) {
        const value = await phoneLocator.getAttribute('href')
        return { type: 'phone', value: value }
      }
      if ((await emailLocator.count()) > 0) {
        const value = await emailLocator.getAttribute('href')
        return { type: 'email', value: value }
      }
      return { type: 'none', value: 'No contact info' }
    } else {
      const infoExists = (await this.Link_ContactInfo.locator.count()) > 0
      if (infoExists) {
        const contactHref = await this.Link_ContactInfo.locator.getAttribute('href')
        let value = await this.Link_ContactInfo.GetText()
        value = value != null ? value : 'error'
        if (contactHref?.startsWith('tel:')) {
          return { type: 'phone', value: value }
        }
        if (contactHref?.startsWith('mailto:')) {
          return { type: 'email', value }
        }
        return { type: 'unknown', value }
      }
      return { type: 'none', value: 'No contact info' }
    }
  }

  async Carrier() {
    if (await this.IsShrunk()) {
      return null
    }
    const carrierAndLossType = await this.Label_CarrierAndLossType.GetText()
    const data = carrierAndLossType?.split(',')
    if (data != undefined) {
      return data[0]
    }
    return 'error'
  }

  async LossType() {
    if (await this.IsShrunk()) {
      return null
    }
    const carrierAndLossType = await this.Label_CarrierAndLossType.GetText()
    const data = carrierAndLossType?.split(',')
    if (data != undefined) {
      return data[1]
    }
    return 'error'
  }

  async DaysLeft() {
    const index = (await this.IsShrunk()) ? 1 : 2
    const locator = this.root.locator('div > div').nth(1).locator('p').nth(index)
    const daysText = await locator.textContent()
    const data = daysText?.split(' ')
    if (data != undefined) {
      return data[0]
    }
    return 'error'
  }

  async IsShrunk() {
    const count = await this.root.locator('div > div').nth(1).locator('p').count()
    return count < 3
  }
}
