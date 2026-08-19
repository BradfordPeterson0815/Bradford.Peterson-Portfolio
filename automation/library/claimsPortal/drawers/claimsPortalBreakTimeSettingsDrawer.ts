import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { Locator } from '@playwright/test'

export class ClaimsPortalBreakTimeSettingsDrawer extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly TextBox_Duration: Element
  readonly Button_AddStartTimeRow: Element
  readonly CheckBox_HideBreakTimeGIF: Element
  readonly parent: Locator
  readonly parentForm: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    this.parentForm = this.page.locator('#breakTimeForm')
    const titleText = DrawerStrings.BreakTimeSettingsDrawer_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(global.page, this.parent.getByLabel(DrawerStrings.Button_Close))
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
    this.TextBox_Duration = new Element(
      global.page,
      this.parentForm.locator(`input[name="duration"]`)
    )
    this.Button_AddStartTimeRow = new Element(
      global.page,
      this.parentForm.locator(`button[aria-label="Add Row"]`)
    )
    this.CheckBox_HideBreakTimeGIF = new Element(
      global.page,
      this.parentForm.locator(`input[name="hideBreakTimeGif"]`).locator('..')
    )
  }
  async VisibleTimeCount() {
    const count = await this.page.locator('#breakTimeForm div[type="time"]').count()
    return count
  }

  async AddNewStartTime() {
    await this.Button_AddStartTimeRow.Click()
    const newIndex = await this.VisibleTimeCount()
    return newIndex - 1
  }

  async RemoveStartTime(index: number) {
    const removeLocator = this.page
      .locator('#breakTimeForm button[aria-label="Remove Row"]')
      .nth(index)
    await removeLocator.click()
  }

  async SetStartTime(index: number) {
    const timeLocator = this.page.locator(`input[id="times.${index}.time"]`)
    await timeLocator.click()
  }

  GetStartTimeLocator(index: number) {
    const timeLocator = this.page.locator(`input[id="times.${index}.time"]`)
    return timeLocator
  }

  GetRemoveStartTimeLocator(index: number) {
    const removeLocator = this.page
      .locator('#breakTimeForm button[aria-label="Remove Row"]')
      .nth(index)
    return removeLocator
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }

  async Validate(index: number) {
    // Validate duration input is in an invalid state and that the error is..
    let durationIsValidated = false
    if ((await this.TextBox_Duration.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_Duration.locator.getAttribute('aria-describedby')
      // "Number must be greater than 0"
      const actualMessage = await this.page.locator(`div[id='${referenceId}']`).textContent()
      durationIsValidated = actualMessage === ValidationStrings.InvalidDurationLow
    }

    let startTimeIsValidated = false
    const locator = this.GetStartTimeLocator(index)
    if ((await locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await locator.getAttribute('aria-describedby')
      // "String must contain at least 1 character(s)"
      const actualMessage = await this.page.locator(`div[id='${referenceId}']`).textContent()
      startTimeIsValidated = actualMessage === ValidationStrings.InvalidString1
    }

    return durationIsValidated && startTimeIsValidated
  }
}
