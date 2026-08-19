import { type Locator } from '@playwright/test'
import { ClaimsPortalBase } from './claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { claimsPortal } from '../../../environments/env.ceylon.js'

export class ClaimsPortalAuth0LoginPage extends ClaimsPortalBase {
  readonly Button_Continue: Locator
  readonly Link_ForgotPassword: Locator
  readonly TextBox_EmailAddress: Locator
  readonly TextBox_Password: Locator
  readonly Title: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.Button_Continue = this.page.getByRole('button', { name: 'Continue', exact: true })
    this.Link_ForgotPassword = this.page.locator('.login a')
    this.TextBox_EmailAddress = this.page.getByLabel('Email address')
    this.TextBox_Password = this.page.locator('#password')
    this.Title = this.page.locator(`div[title="${claimsPortal.AUTH0_LOGIN_PAGE_TITLE}"]`)
  }

  async Login(email: string, password: string) {
    await this.TextBox_EmailAddress.fill(email)
    await this.Button_Continue.click()
    await this.TextBox_Password.fill(password)
    await this.Button_Continue.click()
    this.global.username = email
    this.global.password = password
  }

  async IsVisible() {
    const count = await this.Title.count()
    return count > 0
  }
}
