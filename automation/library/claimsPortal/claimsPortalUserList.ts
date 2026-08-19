import { expect } from '@playwright/test'
import { Element } from '../shared/element.js'
import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { ClaimsPortalBase } from './pages/claimsPortalBase.js'

export class ClaimsPortalUserList extends ClaimsPortalBase {
  readonly AllCurrentUsers: Element
  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.AllCurrentUsers = new Element(
      global.page,
      this.page.locator(
        `#root > div > div:nth-of-type(3) > div > div:nth-of-type(2) > div > div > div[role='group']`
      )
    )
  }

  async CurrentUserCount() {
    await this.AllCurrentUsers.locator.waitFor()
    return await this.AllCurrentUsers.locator.locator('span').count()
  }

  async CurrentUserList() {
    await this.AllCurrentUsers.locator.waitFor()
    const users: string[] = []
    // check for pictures
    for (const hasPicture of await this.AllCurrentUsers.locator.locator('span > img').all()) {
      const name = await hasPicture.getAttribute('alt')
      users.push(name == null ? '' : name)
    }
    for (const noPicture of await this.AllCurrentUsers.locator.locator('span > div').all()) {
      const name = await noPicture.getAttribute('aria-label')
      users.push(name == null ? '' : name)
    }
    return users
  }

  async VerifyCurrentUserExists(expectedUser: string) {
    const userList = await this.CurrentUserList()
    const userExists = userList.includes(expectedUser)
    expect(userExists).toBeTruthy()
  }
}
