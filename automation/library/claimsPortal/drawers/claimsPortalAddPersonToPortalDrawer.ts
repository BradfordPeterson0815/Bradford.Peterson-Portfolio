import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalAddPersonToPortalDrawer extends ClaimsPortalBase {
  readonly parent: Locator
  readonly noteTextLabel: Locator
  readonly Title: Element
  readonly Button_Close: Element
  readonly Button_Cancel: Element
  readonly Button_Submit: Element
  readonly Button_Next: Element
  readonly CheckBox_AddNote: Element
  readonly ListBox_NoteTemplate: Element
  readonly Button_RefetchTemplates: Element
  readonly Button_GoToTemplates: Element
  readonly TextBox_NoteTitle: Element
  readonly TextArea_NoteText: Element
  readonly claimContactParent: Locator
  readonly claimContact: Locator
  readonly claimContactStoredValue: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.AddPersonToPortal_Title
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
    this.Button_Next = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Next}` })
    )
    this.claimContactParent = this.parent
      .locator(`form div[role="group"]`)
      .nth(0)
      .locator(`div > div > div:nth-child(1)`)
    this.claimContact = this.claimContactParent.locator(`input[type="text"]`)
    this.claimContactStoredValue = this.claimContactParent.locator(`input[type="hidden"]`)
    this.CheckBox_AddNote = new Element(
      global.page,
      this.parent.locator(`input[name="includeNote"]`)
    )
    this.ListBox_NoteTemplate = new Element(
      global.page,
      this.parent.locator(`input[role="combobox"]`).nth(1)
    )
    this.Button_RefetchTemplates = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.AddPersonToPortal_Button_RefetchTemplates),
      DrawerStrings.AddPersonToPortal_Button_RefetchTemplates
    )
    this.Button_GoToTemplates = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.AddPersonToPortal_Button_GoToTemplates),
      DrawerStrings.AddPersonToPortal_Button_GoToTemplates
    )
    this.TextBox_NoteTitle = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.AddPersonToPortal_TextBox_NoteTitle)
    )
    this.noteTextLabel = this.page.locator('label').filter({ hasText: 'Note Text' })
    this.TextArea_NoteText = new Element(global.page, this.parent.locator('textarea[name="text"]'))
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async SetClaimContactSelection(claimContact: string) {
    await this.claimContact.selectOption({ label: `${claimContact}` })
  }

  async ValidateWithNoteUIHidden() {
    // Validate Select Claim Contact is in an invalid state and that the error is..
    let selectClaimContactIsValidated = false
    selectClaimContactIsValidated =
      (await this.page.locator(`form div[id*="field"]`).nth(0).textContent()) ==
      ValidationStrings.Required
    return selectClaimContactIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
