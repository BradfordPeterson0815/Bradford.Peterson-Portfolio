import { ClientPortalLeftNavBar } from '../clientPortalLeftNavBar.js'
import { ClientPortalBase } from './clientPortalBase.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'

export class ClientPortalBasePage extends ClientPortalBase {
  readonly leftNavBar: ClientPortalLeftNavBar
  public URL: string

  constructor(global: ClientPortalGlobal) {
    super(global)
    this.leftNavBar = new ClientPortalLeftNavBar(global)
    this.URL = ''
  }

  async NavigateDirectly(targetUrl: string) {
    await this.page.goto(targetUrl)
    await this.page.waitForLoadState()
  }

  async Reload() {
    await this.page.reload()
    await this.page.waitForLoadState()
  }

  async Wait(timeToWait = 1000) {
    await this.page.waitForTimeout(timeToWait)
  }
}
