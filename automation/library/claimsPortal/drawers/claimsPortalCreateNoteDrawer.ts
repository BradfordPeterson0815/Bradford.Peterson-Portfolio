import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalNoteMention } from '../claimsPortalNoteMention.js'
import { ClaimsPortalNoteParameter } from '../claimsPortalNoteParameter.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalCreateNoteDrawer extends ClaimsPortalBase {
  readonly parent: Locator
  readonly Title: Element
  readonly Button_Close: Element
  readonly Button_Close_X: Element
  readonly Button_Submit: Element
  readonly ListBox_NoteTemplate: Element
  readonly Button_RefetchTemplates: Element
  readonly Button_GoToTemplates: Element
  readonly TextBox_NoteTitle: Element
  readonly TextArea_NoteText: Element
  readonly suggestions: Locator
  readonly Button_InsertMention: Element
  readonly Button_InsertParameter: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.CreateNote_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label="Close"]`)
    )
    this.Button_Close = new Element(global.page, this.parent.getByLabel(DrawerStrings.Button_Close))
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
    this.ListBox_NoteTemplate = new Element(
      global.page,
      this.parent.locator(`input[role="combobox"]`)
    )
    this.Button_RefetchTemplates = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.CreateNote_Button_RefetchTemplates),
      DrawerStrings.CreateNote_Button_RefetchTemplates
    )
    this.Button_GoToTemplates = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.CreateNote_Button_GoToTemplates),
      DrawerStrings.CreateNote_Button_GoToTemplates
    )
    this.TextBox_NoteTitle = new Element(
      global.page,
      this.parent.getByLabel(DrawerStrings.CreateNote_TextBox_NoteTitle)
    )
    this.TextArea_NoteText = new Element(global.page, this.parent.locator('div[role="textbox"]'))
    this.suggestions = this.page.locator('div[id="typeahead-menu"] > ul > li')
    this.Button_InsertMention = new Element(
      global.page,
      this.parent.locator('div[name="text"] button').nth(0),
      DrawerStrings.CreateNote_Button_InsertMention
    )
    this.Button_InsertParameter = new Element(
      global.page,
      this.parent.locator('div[name="text"] button').nth(1),
      DrawerStrings.CreateNote_Button_InsertParameter
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Validate() {
    // Validate Note Title Field is in an invalid state and that the error is..
    let noteTitleFieldIsValidated = false
    if ((await this.TextBox_NoteTitle.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_NoteTitle.locator.getAttribute('aria-describedby')
      const validationText = await this.parent.locator(`div[id='${referenceId}']`).textContent()
      noteTitleFieldIsValidated = validationText == ValidationStrings.FieldRequired
    }

    return noteTitleFieldIsValidated
  }

  async FetchSingleMentionByIndex(prompt: string, index: number, useKeyboard = true) {
    if (useKeyboard) {
      await this.OpenMentionsListViaKeyboard(prompt)
    } else {
      await this.OpenMentionsListViaInsertMentionButton(prompt)
    }
    return this.GetMentionSuggestionByIndex(index)
  }

  async FetchAllMentions(prompt: string, useKeyboard = true) {
    if (useKeyboard) {
      await this.OpenMentionsListViaKeyboard(prompt)
    } else {
      await this.OpenMentionsListViaInsertMentionButton(prompt)
    }
    return this.GetFullMentionSuggestionList()
  }

  private async OpenMentionsListViaKeyboard(prompt: string) {
    await this.TextArea_NoteText.FillByTyping(`@${prompt}`)
    await this.page.waitForTimeout(2000)
  }

  private async OpenMentionsListViaInsertMentionButton(prompt: string) {
    await this.Button_InsertMention.Click()
    // await this.page.waitForTimeout(1000)
    await this.TextArea_NoteText.locator.evaluate('e => e.setSelectionRange(-1, -1)')
    await this.TextArea_NoteText.locator.pressSequentially(prompt)
    // await this.page.waitForTimeout(2000)
  }

  async FetchSingleMentionViaInsertMentionButtonByIndex(prompt: string, index: number) {
    await this.OpenMentionsListViaKeyboard(prompt)
    return this.GetMentionSuggestionByIndex(index)
  }

  async FetchSingleParameterByIndex(prompt: string, index: number, useKeyboard = true) {
    if (useKeyboard) {
      await this.OpenParametersListViaKeyboard(prompt)
    } else {
      await this.OpenParametersListViaInsertParameterButton(prompt)
    }
    return this.GetParameterSuggestionByIndex(index)
  }

  async FetchAllParameters(prompt: string, useKeyboard = true) {
    if (useKeyboard) {
      await this.OpenParametersListViaKeyboard(prompt)
    } else {
      await this.OpenParametersListViaInsertParameterButton(prompt)
    }
    return this.GetFullParameterSuggestionList()
  }

  private async OpenParametersListViaKeyboard(prompt: string) {
    await this.TextArea_NoteText.FillByTyping(`#${prompt}`)
    await this.page.waitForTimeout(2000)
  }

  private async OpenParametersListViaInsertParameterButton(prompt: string) {
    await this.Button_InsertParameter.Click()
    await this.TextArea_NoteText.FillByTyping(`${prompt}`)
    await this.page.waitForTimeout(2000)
  }

  private async GetMentionSuggestionByIndex(index: number) {
    await this.suggestions.nth(0).waitFor({ state: 'visible' })

    // grab suggestion by index
    const name = await this.suggestions.nth(index).locator('> div > span').textContent()
    const roles: string[] = []
    const roleCount = await this.suggestions.nth(index).locator('> div > div > ul > li').count()
    for (let roleIndex = 0; roleIndex < roleCount; roleIndex++) {
      const role = await this.suggestions
        .nth(index)
        .locator('> div > div > ul > li')
        .nth(roleIndex)
        .locator('> span')
        .textContent()
      roles.push(role == null ? '' : role)
    }
    const suggestion = new ClaimsPortalNoteMention(name == null ? '' : name)
    suggestion.roles = roles
    return suggestion
  }

  private async GetFullMentionSuggestionList() {
    await this.suggestions.nth(0).waitFor({ state: 'visible' })
    const suggestions: ClaimsPortalNoteMention[] = []
    const contactCount = await this.suggestions.count()
    for (let contactIndex = 0; contactIndex < contactCount; contactIndex++) {
      const suggestion = await this.GetMentionSuggestionByIndex(contactIndex)
      suggestions.push(suggestion)
    }
    return suggestions
  }

  private async GetParameterSuggestionByIndex(index: number) {
    await this.suggestions.nth(0).waitFor({ state: 'visible' })
    // grab suggestion by index
    const parameter = await this.suggestions.nth(index).getAttribute('path')
    const value = await this.suggestions.nth(index).getAttribute('param')
    const suggestion = new ClaimsPortalNoteParameter(parameter == null ? '' : parameter)
    suggestion.value = value == null ? '' : value
    return suggestion
  }

  private async GetFullParameterSuggestionList() {
    await this.suggestions.nth(0).waitFor({ state: 'visible' })

    const suggestions: ClaimsPortalNoteParameter[] = []
    const parameterCount = await this.suggestions.count()
    for (let parameterIndex = 0; parameterIndex < parameterCount; parameterIndex++) {
      const suggestion = await this.GetParameterSuggestionByIndex(parameterIndex)
      suggestions.push(suggestion)
    }
    return suggestions
  }

  async SelectNoteTemplate(templateToSelect: string) {
    await this.ListBox_NoteTemplate.locator.click()
    await this.page.waitForTimeout(1000)
    await this.ListBox_NoteTemplate.locator.fill(templateToSelect)
    await this.page.waitForTimeout(1000)
    await this.ListBox_NoteTemplate.locator.press('Enter')
    await this.page.waitForTimeout(1000)
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
