import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { Locator } from '@playwright/test'

export class ClaimsPortalCreateNoteTemplateDrawer extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Cancel: Element
  readonly Button_Submit: Element
  readonly TextBox_Name: Element
  readonly TextBox_Template: Element
  readonly parent: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    this.Title = new Element(
      global.page,
      this.parent.getByText(DrawerStrings.NoteTemplate_Title_Create),
      DrawerStrings.NoteTemplate_Title_Create
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
    this.TextBox_Template = new Element(
      global.page,
      this.parent.locator('textarea[name="textTemplate"]')
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async FillAndSubmit(templateName: string, templateText: string) {
    await this.TextBox_Name.Fill(templateName)
    await this.TextBox_Template.Fill(templateText)
    await this.Button_Submit.Click()
  }

  async Validate() {
    // Validate Name Field is in an invalid state and that the error is..
    let nameFieldIsValidated = false
    let templateFieldIsValidated = false
    if ((await this.TextBox_Name.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_Name.locator.getAttribute('aria-describedby')
      if (referenceId != null) {
        nameFieldIsValidated =
          (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
          ValidationStrings.InvalidString1 // "String must contain at least 1 character(s)"
      }
    }

    if ((await this.TextBox_Template.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_Template.locator.getAttribute('aria-describedby')
      if (referenceId != null) {
        templateFieldIsValidated =
          (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
          ValidationStrings.InvalidString1 // "String must contain at least 1 character(s)"
      }
    }
    return nameFieldIsValidated && templateFieldIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
