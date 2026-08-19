import { Locator } from 'playwright/test'
import { UserPortalBase } from './userPortalBase.js'
import { UserPortalGlobal } from '../userPortalGlobal.js'
import { userPortal } from '../../../environments/env.ceylon.js'

export class UserPortalAuth0LoginPage extends UserPortalBase {
  readonly Button_Continue: Locator
  readonly TextBox_EmailAddress: Locator
  readonly TextBox_Code: Locator
  readonly Title: Locator

  constructor(global: UserPortalGlobal) {
    super(global)
    this.Button_Continue = this.page.getByRole('button', { name: 'Continue', exact: true })
    this.TextBox_EmailAddress = this.page.locator('#username')
    this.TextBox_Code = this.page.locator('#code')
    this.Title = this.page.locator(`div[title="${userPortal.AUTH0_LOGIN_PAGE_TITLE}"]`)
  }

  async LoginWithEmail(email: string) {
    await this.TextBox_EmailAddress.fill(email)
    await this.Button_Continue.click()
  }

  async ContinueLoginWithCode(code: string) {
    await this.TextBox_Code.fill(code)
    await this.Button_Continue.click()
  }
}
