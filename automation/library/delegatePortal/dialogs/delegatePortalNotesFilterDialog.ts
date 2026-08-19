import { DelegatePortalBase } from '../pages/delegatePortalBase.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DialogStrings } from '../delegatePortalConstants.js'

export class DelegatePortalNotesFilterDialog extends DelegatePortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.Button_Close_X = new Element(
      global.page,
      this.page.locator(`section[id*='popover-content'] button[aria-label='Close']`)
    )
    this.Title = new Element(
      global.page,
      this.page.locator(`header[id*='popover-header']`),
      DialogStrings.NotesFilter_Title
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async SetCheckFilter(valueToCheck: string, checked: boolean) {
    await this.page.locator(`input[value="${valueToCheck}"]`).locator('..').setChecked(checked)
  }

  async IsFilterChecked(valueToGet: string) {
    return await this.page.locator(`input[value="${valueToGet}"]`).locator('..').isChecked()
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
