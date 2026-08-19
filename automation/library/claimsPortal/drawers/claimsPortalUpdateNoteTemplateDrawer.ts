import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { Locator } from '@playwright/test'

export class ClaimsPortalUpdateNoteTemplateDrawer extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Cancel: Element
  readonly Button_Submit: Element
  readonly TextBox_Name: Element
  readonly TextArea_Template: Element
  readonly TextArea_ReasonForUpdate: Element
  readonly parent: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    this.Title = new Element(
      global.page,
      this.parent.getByText(DrawerStrings.NoteTemplate_Title_Update),
      DrawerStrings.NoteTemplate_Title_Update
    )
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(
      global.page,
      this.parent.locator(`> div:nth-child(4) button:nth-child(1)`)
    )
    this.Button_Cancel = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Cancel}` })
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
    this.TextBox_Name = new Element(global.page, this.parent.locator('input[name="name"]'))
    this.TextArea_Template = new Element(
      global.page,
      this.parent.locator('textarea[name="textTemplate"]')
    )
    this.TextArea_ReasonForUpdate = new Element(
      global.page,
      this.parent.locator('textarea[name="reasonForUpdate"]')
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async FillAndSubmit(templateName: string, templateText: string, reasonForUpdate: string) {
    await this.TextBox_Name.Fill(templateName)
    await this.TextArea_Template.Fill(templateText)
    await this.TextArea_ReasonForUpdate.Fill(reasonForUpdate)
    await this.Button_Submit.Click()
  }

  async Validate() {
    // Validate empty fields are in an invalid state and that the errors are..
    let nameFieldIsValidated = false
    let templateFieldIsValidated = false
    let reasonFieldIsValidated = false

    if ((await this.TextBox_Name.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_Name.locator.getAttribute('aria-describedby')
      if (referenceId != null) {
        nameFieldIsValidated =
          (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
          ValidationStrings.InvalidString1 // "String must contain at least 1 character(s)"
      }
    }

    if ((await this.TextArea_Template.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextArea_Template.locator.getAttribute('aria-describedby')
      if (referenceId != null) {
        templateFieldIsValidated =
          (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
          ValidationStrings.InvalidString1 // "String must contain at least 1 character(s)"
      }
    }

    if ((await this.TextArea_ReasonForUpdate.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId =
        await this.TextArea_ReasonForUpdate.locator.getAttribute('aria-describedby')
      if (referenceId != null) {
        reasonFieldIsValidated =
          (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
          ValidationStrings.InvalidString1 // "String must contain at least 1 character(s)"
      }
    }
    return nameFieldIsValidated && templateFieldIsValidated && reasonFieldIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
