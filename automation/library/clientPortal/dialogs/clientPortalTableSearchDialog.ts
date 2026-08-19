import { ClientPortalBase } from '../pages/clientPortalBase.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DialogStrings } from '../clientPortalConstants.js'

export class ClientPortalTableSearchDialog extends ClientPortalBase {
  readonly Button_Close: Element
  readonly Title: Element
  readonly Textbox_Search: Element
  readonly Button_ClearSearch: Element

  constructor(global: ClientPortalGlobal) {
    super(global)
    this.Button_Close = new Element(
      global.page,
      this.page.locator(`section[id*='popover-content'] button[aria-label='Close']`)
    )
    this.Title = new Element(
      global.page,
      this.page.locator(`header[id*='popover-header']`),
      DialogStrings.TableSearch_Title
    )
    this.Textbox_Search = new Element(
      global.page,
      this.page.locator(`div[id*='popover-body'] input`)
    )
    this.Button_ClearSearch = new Element(
      global.page,
      this.page.locator(
        `div[id*='popover-body'] button[aria-label='${DialogStrings.TableSearch_ClearFilter}']`
      ),
      DialogStrings.TableSearch_ClearFilter
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
