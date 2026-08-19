import { expect } from 'playwright/test'
import { singer, eagle } from '../../environments/env.bp.js'
import { BPBase } from './bpBase.js'
import { BPClients } from './bpConstants.js'
import { BPFinishParameters } from './bpFinishParameters.js'
import { BPGlobal } from './bpGlobal.js'
import { BPLiabilityParameters } from './bpLiabilityParameters.js'
import { BPUndo } from './bpUndo.js'
import { BPUserParameters } from './bpUserParameters.js'
import { BPTestPage } from './pages/bpTestPage.js'
import { BPToolsPage } from './pages/bpToolsPage.js'

export class BPBaseChat extends BPBase {
  conversationIndex: number
  userParams: BPUserParameters
  finishParams: BPFinishParameters
  liabilityParams: BPLiabilityParameters
  promptOffsetTracking: number
  constructor(global: BPGlobal) {
    super(global)
    this.conversationIndex = 1
    this.userParams = new BPUserParameters(global)
    this.finishParams = new BPFinishParameters(global)
    this.liabilityParams = new BPLiabilityParameters(global)
    this.promptOffsetTracking = 0
  }

  async SelectBotPressClient(bpClient: BPClients, directMode = true) {
    const toolsPage = new BPToolsPage(this.global)
    if (directMode) {
      switch (bpClient) {
        case BPClients.Eagle:
          await this.global.page.goto(eagle.BASE_URL)
          break
        case BPClients.Singer:
          await this.global.page.goto(singer.BASE_URL)
          break
        default:
          throw new Error(
            `No Botpress Client of type: ${bpClient} is currently defined for navigation`
          )
      }

      return new BPTestPage(this.global)
    } else {
      return await toolsPage.SelectBotPressClient(bpClient)
    }
  }

  async GetActualPrompt(
    multiPromptIndex: number = 1,
    serverPromptIndex: number = this.conversationIndex,
    locatorSuffix: string = '.Linkify'
  ) {
    let actualPrompt = 'no value was found'
    const locator = this.page
      .frameLocator('#bp-widget')
      .locator(
        `.bpw-msg-list > div > div:nth-child(${serverPromptIndex}) .bpw-message-group > div:nth-of-type(${multiPromptIndex})`
      )
      .locator(locatorSuffix)
    console.debug(
      `server: ${serverPromptIndex}, multi: ${multiPromptIndex}, suffix: ${locatorSuffix}`
    )
    await this.page.waitForTimeout(500)
    await locator.waitFor({ state: 'attached', timeout: 600000 })
    const locatorExists = await locator.count()
    if (locatorExists > 0) {
      actualPrompt = await locator.innerText()
    } else {
      throw new Error(
        `Cannot find server prompt at index ${serverPromptIndex}, offset ${multiPromptIndex} with suffix of ${locatorSuffix} - looking for ${prompt})`
      )
    }
    return actualPrompt
  }

  async VerifyUserEchoText(
    expectedUserEcho: string,
    userEchoIndex: number = this.conversationIndex
  ) {
    const locator = this.page
      .frameLocator('#bp-widget')
      .locator(`.bpw-msg-list > div > div:nth-child(${userEchoIndex}) .bpw-message-group .Linkify`)
    const actualEcho = await locator.textContent()
    console.debug(`checking echo: expecting: ${expectedUserEcho} - got:${actualEcho}`)
    expect(actualEcho).toBe(expectedUserEcho)
  }

  async ActivateUndo() {
    const rollbackLocator = this.page.frameLocator('#bp-widget').locator(`#btn-rollback`)
    await rollbackLocator.click()
    return new BPUndo(this.global)
  }

  async HandleUndo(undoLinkIndex: number, expectedUndoLink: string) {
    const undo = await this.ActivateUndo()
    await undo.SelectUndoLinkByIndex(undoLinkIndex, expectedUndoLink)
    this.userParams.undoTopic = expectedUndoLink
  }

  async CountUndoLinks() {
    const undo = await this.ActivateUndo()
    const linkCount = await undo.UndoLinkCount()
    await undo.button_Cancel.click()
    return linkCount
  }

  async VerifyUndoIsNotAvailable() {
    const rollbackLocator = this.page.frameLocator('#bp-widget').locator(`#btn-rollback`)
    const undoIsPresent = (await rollbackLocator.count()) > 0
    expect(undoIsPresent).toBe(false)
  }
}
