import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DialogStrings } from '../claimsPortalConstants.js'

export class ClaimsPortalNotesFilterDialog extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element

  constructor(global: ClaimsPortalGlobal) {
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
