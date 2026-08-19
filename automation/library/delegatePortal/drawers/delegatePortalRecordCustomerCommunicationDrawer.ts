import { Element } from '../../shared/element.js'
import { Locator } from '@playwright/test'
import { DelegatePortalBase } from '../pages/delegatePortalBase.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DrawerStrings } from '../delegatePortalConstants.js'

export class DelegatePortalRecordCustomerCommunicationDrawer extends DelegatePortalBase {
  readonly parent: Locator
  readonly Title: Element
  readonly Button_Close: Element
  readonly Button_Cancel: Element
  readonly Button_Submit: Element
  readonly CheckBox_IncludeNote: Element
  readonly ListBox_TypeOfCommunication: Element
  readonly TextBox_Date: Element

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.RecordCustomerCommunication_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close = new Element(global.page, this.parent.getByLabel(DrawerStrings.Button_Close))
    this.Button_Cancel = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Cancel}` })
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
    this.ListBox_TypeOfCommunication = new Element(
      global.page,
      this.parent.locator(`select[name="type"]`)
    )
    this.CheckBox_IncludeNote = new Element(
      global.page,
      this.parent.locator(`input[name="includeNote"]`)
    )
    this.TextBox_Date = new Element(global.page, this.parent.locator(`input[name="date"]`))
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Validate() {
    // Validate Type Of Communication List is in an invalid state and that the error is..
    let typeOfCommunicationListIsValidated = false
    if ((await this.ListBox_TypeOfCommunication.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId =
        await this.ListBox_TypeOfCommunication.locator.getAttribute('aria-describedby')
      const validationText = await this.parent.locator(`div[id='${referenceId}']`).textContent()
      typeOfCommunicationListIsValidated =
        validationText == DrawerStrings.RecordCustomerCommunication_TypeOfCommunication_InvalidValue
    }

    return typeOfCommunicationListIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
