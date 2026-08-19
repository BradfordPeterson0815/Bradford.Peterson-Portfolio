import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings, MessageStatusSelectionOptions, ValidationStrings } from '../claimsPortalConstants.js'
import { Locator } from '@playwright/test'

export class ClaimsPortalUpdateAllMessagesDrawer extends ClaimsPortalBase {
  readonly parent: Locator
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly Button_OpenList: Element
  readonly ListBox_MessageStatus: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.UpdateAllMessages_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label="Close"]`)
    )
    this.Button_Close = new Element(
      global.page,
      this.parent.getByText(`${DrawerStrings.Button_Close}`, { exact: true })
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
    this.Button_OpenList = new Element(
      global.page,
      this.parent.locator('button[aria-haspopup="menu"]')
    )
    this.ListBox_MessageStatus = this.page.locator(
      `#updateAllMessagesForm select[name="messageStatus"]`
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async SetMessageStatusSelection(messageStatusSelection: MessageStatusSelectionOptions) {
    await this.ListBox_MessageStatus.selectOption({ label: messageStatusSelection })
  }

  async Validate() {
    // Validate Message Status Field is in an invalid state and that the error is..
    let messageStatusFieldIsValidated = false
    if ((await this.ListBox_MessageStatus.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.ListBox_MessageStatus.getAttribute('aria-describedby')
      messageStatusFieldIsValidated =
        (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidMessageStatus
    }
    return messageStatusFieldIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
