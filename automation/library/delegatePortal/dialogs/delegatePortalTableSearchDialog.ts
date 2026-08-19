import { Element } from '../../shared/element.js'
import { DialogStrings } from '../delegatePortalConstants.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalBase } from '../pages/delegatePortalBase.js'

export class DelegatePortalTableSearchDialog extends DelegatePortalBase {
  readonly Button_Close: Element
  readonly Title: Element
  readonly Textbox_Search: Element
  readonly Button_ClearSearch: Element

  constructor(global: DelegatePortalGlobal) {
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
