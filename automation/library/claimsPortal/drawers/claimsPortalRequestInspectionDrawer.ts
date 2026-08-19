import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings, InspectorRoleOptions, ValidationStrings } from '../claimsPortalConstants.js'
import { Locator } from '@playwright/test'

export class ClaimsPortalRequestInspectionDrawer extends ClaimsPortalBase {
  readonly parent: Locator
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly ListBox_InspectorRole: Element
  readonly ListBox_RequestedBy: Element
  readonly TextArea_NotesText: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.RequestInspection_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.ListBox_InspectorRole = new Element(
      global.page,
      this.parent.locator(`select[id="inspectorRole"]`)
    )
    this.ListBox_RequestedBy = new Element(
      global.page,
      this.parent.locator(`input[role="combobox"]`)
    )
    this.TextArea_NotesText = new Element(
      global.page,
      this.parent.locator('textarea[name="notes"]')
    )
    this.Button_Close = new Element(
      global.page,
      this.parent.locator(`div.chakra-modal__footer button:nth-child(1)`)
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async SetInspectorRoleSelection(inspectorRoleSelection: InspectorRoleOptions) {
    await this.ListBox_InspectorRole.locator.selectOption({ label: `${inspectorRoleSelection}` })
  }

  async Validate() {
    let inspectorRoleIsValidated = false
    let requestedByFieldIsValidated = false

    // Validate Inspector Role is in an invalid state and that the error is..
    if ((await this.ListBox_InspectorRole.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.ListBox_InspectorRole.locator.getAttribute('aria-describedby')
      const validationText = await this.parent.locator(`div[id*='${referenceId}']`).textContent()
      inspectorRoleIsValidated = validationText == ValidationStrings.InvalidEnumInspectorRole
    }

    // Validate Requested By listbox is in an invalid state and that the error is..
    requestedByFieldIsValidated =
      (await this.parent.locator(`form > div > div > div:nth-child(3)`).nth(1).textContent()) ==
      ValidationStrings.Required

    return inspectorRoleIsValidated && requestedByFieldIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
