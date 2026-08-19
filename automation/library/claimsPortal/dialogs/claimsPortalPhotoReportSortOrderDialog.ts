import { Locator } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { PhotoReportSortOrderDialogStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
export class ClaimsPortalPhotoReportSortOrderDialog extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly parent: Locator
  readonly Label_Alert: Element
  readonly Label_SortBy: Element
  readonly radioButton_Label: Locator
  readonly radioButton_Timestamp: Locator
  readonly radioButton_Ascending: Locator
  readonly radioButton_Descending: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator(`section[id*='popover-content']`)
    this.Title = new Element(
      global.page,
      this.parent.locator(`header`),
      PhotoReportSortOrderDialogStrings.Title
    )
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )

    this.Label_Alert = new Element(
      global.page,
      this.parent.locator(`div[data-status="info"] div[data-status="info"]`),
      PhotoReportSortOrderDialogStrings.Label_Alert
    )

    this.Label_SortBy = new Element(
      global.page,
      this.parent.locator(`div[role="group"] label`).nth(0),
      PhotoReportSortOrderDialogStrings.Label_SortBy
    )

    this.radioButton_Label = this.parent
      .locator(`div[role="radiogroup"]`)
      .nth(0)
      .locator('label')
      .nth(0)

    this.radioButton_Timestamp = this.parent
      .locator(`div[role="radiogroup"]`)
      .nth(0)
      .locator('label')
      .nth(1)

    this.radioButton_Ascending = this.parent
      .locator(`div[role="radiogroup"]`)
      .nth(1)
      .locator('label')
      .nth(0)

    this.radioButton_Descending = this.parent
      .locator(`div[role="radiogroup"]`)
      .nth(1)
      .locator('label')
      .nth(1)
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
