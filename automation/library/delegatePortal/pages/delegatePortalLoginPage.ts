import { Locator } from '@playwright/test'
import { DelegatePortalBase } from './delegatePortalBase.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'

export class DelegatePortalLoginPage extends DelegatePortalBase {
  readonly parent: Locator
  readonly header: Locator
  readonly content: Locator
  readonly footer: Locator
  readonly title: Locator
  readonly description: Locator
  readonly alertContent: Locator
  readonly signInLegend: Locator
  readonly signInSSO: Locator
  readonly signInEmail: Locator
  readonly signInSMS: Locator
  readonly continueToSignIn: Locator

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.parent = this.page.locator('#root div[data-slot="card"]').nth(0)
    this.header = this.parent.locator('div[data-slot="card-header"]')
    this.content = this.parent.locator('div[data-slot="card-content"]')
    this.footer = this.parent.locator('div[data-slot="card-footer"]')
    this.title = this.header.locator(`div[data-slot="card-title"]`)
    this.description = this.header.locator(`div[data-slot="card-description"]`)
    this.alertContent = this.header.locator(`div[data-slot="alert-content"]`)
    this.signInLegend = this.content.locator(`div[data-slot="field-legend"]`)
    this.signInSSO = this.content.locator(`div[data-slot="field-item"]`).nth(0)
    this.signInEmail = this.content.locator(`div[data-slot="field-item"]`).nth(1)
    this.signInSMS = this.content.locator(`div[data-slot="field-item"]`).nth(2)
    this.continueToSignIn = this.footer.locator('button').nth(0)
  }
  async SelectEmailSignIn() {
    await this.signInEmail.click()
    await this.continueToSignIn.click()
  }
  async SelectSSOSignIn() {
    await this.signInEmail.click()
    await this.continueToSignIn.click()
  }
  async SelectSMSSignIn() {
    await this.signInEmail.click()
    await this.continueToSignIn.click()
  }
}
