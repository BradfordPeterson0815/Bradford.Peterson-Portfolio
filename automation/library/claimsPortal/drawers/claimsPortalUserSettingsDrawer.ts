import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings } from '../claimsPortalConstants.js'
import { Locator } from '@playwright/test'

export class ClaimsPortalUserSettingsDrawer extends ClaimsPortalBase {
  readonly Title: Element
  readonly ListBox_SetTimezone: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly CheckBox_ShowActiveUsers: Element
  readonly parent: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.UserSettingsDrawer_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.ListBox_SetTimezone = new Element(
      global.page,
      this.parent.locator(`select[name="timezone"]`)
    )
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(global.page, this.parent.getByLabel(DrawerStrings.Button_Close))
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
    this.CheckBox_ShowActiveUsers = new Element(
      global.page,
      this.parent.locator(`input[name="showActiveUsers"]`).locator('..')
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
