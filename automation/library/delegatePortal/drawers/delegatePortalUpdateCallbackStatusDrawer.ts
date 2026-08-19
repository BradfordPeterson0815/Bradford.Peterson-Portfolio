import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DelegatePortalBase } from '../pages/delegatePortalBase.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { CallbackStatusSelectionOptions, DrawerStrings } from '../delegatePortalConstants.js'

export class DelegatePortalUpdateCallbackStatusDrawer extends DelegatePortalBase {
  readonly parent: Locator
  readonly noteTextLabel: Locator
  readonly Title: Element
  readonly Button_Close: Element
  readonly Button_Close_X: Locator
  readonly Button_Cancel: Element
  readonly Button_Submit: Element
  readonly Button_Next: Element
  readonly ListBox_SelectStatus: Element
  readonly CheckBox_AddNote: Element
  readonly ListBox_NoteTemplate: Element
  readonly Button_RefetchTemplates: Element
  readonly Button_GoToTemplates: Element
  readonly TextBox_NoteTitle: Element
  readonly TextArea_NoteText: Element

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.UpdateCallbackStatus_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = this.page
      .getByLabel(titleText)
      .getByRole('button', { name: `${DrawerStrings.Button_Close}` })
      .nth(0)
    this.Button_Close = new Element(
      global.page,
      this.page
        .getByLabel(titleText)
        .getByRole('button', { name: `${DrawerStrings.Button_Close}` })
        .nth(1)
    )
    this.Button_Cancel = new Element(
      global.page,
      this.page
        .getByLabel(titleText)
        .getByRole('button', { name: `${DrawerStrings.Button_Cancel}` })
    )
    this.Button_Submit = new Element(
      global.page,
      this.page
        .getByLabel(titleText)
        .getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
    this.Button_Next = new Element(
      global.page,
      this.page.getByLabel(titleText).getByRole('button', { name: `${DrawerStrings.Button_Next}` })
    )
    this.ListBox_SelectStatus = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.UpdateCallbackStatus_ListBox_SelectStatus)
    )
    this.CheckBox_AddNote = new Element(
      global.page,
      this.parent.locator(`input[name="includeNote"]`)
    )
    this.ListBox_NoteTemplate = new Element(
      global.page,
      this.parent.locator(`input[role="combobox"]`)
    )
    this.Button_RefetchTemplates = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.UpdateCallbackStatus_Button_RefetchTemplates),
      DrawerStrings.UpdateCallbackStatus_Button_RefetchTemplates
    )
    this.Button_GoToTemplates = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.UpdateCallbackStatus_Button_GoToTemplates),
      DrawerStrings.UpdateCallbackStatus_Button_GoToTemplates
    )
    this.TextBox_NoteTitle = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.UpdateCallbackStatus_TextBox_NoteTitle)
    )
    this.noteTextLabel = this.parent.locator('label').filter({ hasText: 'Note Text' })
    this.TextArea_NoteText = new Element(global.page, this.parent.locator('textarea[name="text"]'))
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async SetStatusSelection(statusSelection: CallbackStatusSelectionOptions) {
    await this.ListBox_SelectStatus.locator.selectOption({ label: `${statusSelection}` })
  }

  async Validate() {
    // Validate Select Status Field is in an invalid state and that the error is..
    let selectStatusFieldIsValidated = false
    if ((await this.ListBox_SelectStatus.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.ListBox_SelectStatus.locator.getAttribute('aria-describedby')
      selectStatusFieldIsValidated =
        (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
        DrawerStrings.UpdateCallbackStatus_Status_InvalidValue
    }
    return selectStatusFieldIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
