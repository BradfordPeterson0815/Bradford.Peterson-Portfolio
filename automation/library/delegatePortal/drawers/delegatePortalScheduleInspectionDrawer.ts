import { DelegatePortalBase } from '../pages/delegatePortalBase.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../delegatePortalConstants.js'
import { Locator } from '@playwright/test'

export class DelegatePortalScheduleInspectionDrawer extends DelegatePortalBase {
  readonly parent: Locator
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly TextBox_InspectionDate: Element
  readonly ListBox_InspectorRole: Element
  readonly ListBox_ScheduledBy: Element
  readonly TextArea_NotesText: Element

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.ScheduleInspection_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.TextBox_InspectionDate = new Element(global.page, this.parent.locator('#date'))
    this.ListBox_InspectorRole = new Element(
      global.page,
      this.parent.locator(`select[id="inspectorRole"]`)
    )
    this.ListBox_ScheduledBy = new Element(
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

  async Validate() {
    let inspectionDateIsValidated = false
    let scheduledByFieldIsValidated = false

    // Validate Inspection Date Field is in an invalid state and that the error is..
    const inspectionDateLocator = this.TextBox_InspectionDate.locator
    if ((await inspectionDateLocator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await inspectionDateLocator.getAttribute('aria-describedby')
      // "Invalid Date"
      inspectionDateIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidDate
    }

    // Validate Scheduled By listbox is in an invalid state and that the error is..
    scheduledByFieldIsValidated =
      (await this.parent.locator(`form > div > div > div:nth-child(3)`).nth(1).textContent()) ==
      ValidationStrings.Required

    return inspectionDateIsValidated && scheduledByFieldIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
