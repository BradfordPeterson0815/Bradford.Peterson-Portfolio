import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { Locator } from '@playwright/test'

export class ClaimsPortalMakeDocumentsVisibleToAdditionalGroupsDrawer extends ClaimsPortalBase {
  readonly parent: Locator
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly CheckBox_GroupVisibility_Coordinator: Element
  readonly CheckBox_GroupVisibility_Estimator: Element
  readonly CheckBox_GroupVisibility_Insured: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.MakeDocumentsVisibleToAdditionalGroups_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
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
    this.CheckBox_GroupVisibility_Coordinator = new Element(
      global.page,
      this.parent.locator(`input[value="claims"]`).locator('..')
    )
    this.CheckBox_GroupVisibility_Estimator = new Element(
      global.page,
      this.parent.locator(`input[value="estimator"]`).locator('..')
    )
    this.CheckBox_GroupVisibility_Insured = new Element(
      global.page,
      this.parent.locator(`input[value="insured"]`).locator('..')
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Validate() {
    // Validate visibility checkbox group is in an invalid state and that the error is..
    let visbilityCheckboxesAreValidated = false
    if (
      (await this.CheckBox_GroupVisibility_Insured.locator
        .locator('input')
        .getAttribute('aria-invalid')) == 'true'
    ) {
      const referenceId = await this.CheckBox_GroupVisibility_Insured.locator
        .locator('input')
        .getAttribute('aria-describedby')
      // "You must select at least one group"
      visbilityCheckboxesAreValidated =
        (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidCheckboxGroup
    }
    return visbilityCheckboxesAreValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
