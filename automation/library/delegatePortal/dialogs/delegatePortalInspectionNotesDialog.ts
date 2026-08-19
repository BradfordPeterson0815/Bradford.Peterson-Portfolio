import { Element } from '../../shared/element.js'
import { Locator } from 'playwright/test'
import { DelegatePortalBase } from '../pages/delegatePortalBase.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DialogStrings } from '../delegatePortalConstants.js'

export class DelegatePortalInspectionNotesDialog extends DelegatePortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly parent: Locator
  readonly Label_Notes: Element

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.parent = this.page.locator(`section[id*='chakra-modal']`)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='${DialogStrings.InspectionNotes_Button_Close}']`)
    )
    this.Button_Close = new Element(
      global.page,
      this.parent.locator(`div.chakra-modal__footer button:nth-child(1)`)
    )
    this.Title = new Element(
      global.page,
      this.parent.locator(`header`),
      DialogStrings.InspectionNotes_Title
    )
    this.Label_Notes = new Element(global.page, this.parent.locator(`p`))
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
