import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalAddRemovedPhotosDrawer extends ClaimsPortalBase {
  readonly parent: Locator
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly CheckBox_SelectAll: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')

    this.Title = new Element(
      global.page,
      this.parent.getByText(DrawerStrings.AddRemovedPhotos_Title),
      DrawerStrings.AddRemovedPhotos_Title
    )
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Close}` }).first()
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
    this.CheckBox_SelectAll = new Element(
      global.page,
      this.parent.locator(`input`).nth(0).locator('..')
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  TargetPhotoCheckboxByIndex(photoIndex: number) {
    return new Element(
      this.global.page,
      this.parent
        .locator(`input`)
        .nth(photoIndex + 1)
        .locator('..')
    )
  }

  async SelectPhotoByIndex(photoIndex: number) {
    const targetCheckbox = this.parent
      .locator(`input`)
      .nth(photoIndex + 1)
      .locator('..')
    await targetCheckbox.setChecked(true)
  }

  async Validate() {
    // Validate checkbox selection is in an invalid state and that the error is..
    let checkboxesAreValidated = false
    if ((await this.parent.locator(`input`).nth(0).getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.parent.locator(`input`).nth(0).getAttribute('aria-describedby')
      // At least one checkbox should be selected
      checkboxesAreValidated =
        (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.AtLeastOneDocumentNeedsToBeSelected
    }
    return checkboxesAreValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
