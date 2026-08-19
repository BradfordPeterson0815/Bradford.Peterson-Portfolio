import { Locator } from 'playwright/test'
import { BPBase } from '../bpBase.js'
import { PostActions } from '../bpConstants.js'
import { BPGlobal } from '../bpGlobal.js'
import { BPPayload } from '../bpPayload.js'
import { PostMessage } from '../bpHelper.js'

export class BPTestPage extends BPBase {
  readonly Button_Launch: Locator

  constructor(global: BPGlobal) {
    super(global)
    this.Button_Launch = this.page.locator('#root').getByRole('button', { name: 'Launch' })
  }

  async PostMessageToChat(postAction: PostActions, payload: BPPayload) {
    const postMessage = PostMessage(postAction, payload)
    await this.global.page.evaluate(postMessage)
  }

  async WaitForChatFrame() {
    await this.page.locator('#bp-web-widget').waitFor({ state: 'attached' })
  }
}
