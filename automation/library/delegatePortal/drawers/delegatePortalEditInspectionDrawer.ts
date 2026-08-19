import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings } from '../delegatePortalConstants.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalBase } from '../pages/delegatePortalBase.js'

export class DelegatePortalEditInspectionDrawer extends DelegatePortalBase {
  readonly Title: Element
  readonly Description: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly TextBox_Description: Element
  readonly parent: Locator

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    this.Title = new Element(global.page, this.parent.locator('header'))
    this.Description = new Element(global.page, this.parent.locator('form h2'))
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
    this.TextBox_Description = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.EditInspection_TextBox_Description)
    )
  }

  async VerifyTitle(claim: string, started: string) {
    let expectedText = DrawerStrings.EditInspection_Title
    expectedText = expectedText.replace('<CLAIM>', claim)
    expectedText = expectedText.replace('<STARTED>', started)
    await this.Title.VerifyExpectedText(expectedText)
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
