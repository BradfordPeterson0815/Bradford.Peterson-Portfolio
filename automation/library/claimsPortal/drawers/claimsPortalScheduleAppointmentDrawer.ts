import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { Locator } from '@playwright/test'

export class ClaimsPortalScheduleAppointmentDrawer extends ClaimsPortalBase {
  readonly parent: Locator
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly ListBox_AppointmentChannel: Locator
  readonly TextBox_AppointmentDate: Element
  readonly TextArea_Description: Element
  readonly ListBox_AppointmentType: Locator
  readonly Button_AddRow: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.ScheduleAppointment_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.ListBox_AppointmentChannel = this.parent.locator(
      `#scheduleAppointmentForm select[name="appointmentChannel"]`
    )
    this.TextBox_AppointmentDate = new Element(
      global.page,
      this.parent.locator(`#scheduleAppointmentForm input[name="appointmentDate"]`)
    )
    this.TextArea_Description = new Element(
      global.page,
      this.parent.locator(`#scheduleAppointmentForm textarea[name="appointmentDescription"]`)
    )
    this.ListBox_AppointmentType = this.parent.locator(
      `#scheduleAppointmentForm select[name="appointmentType"]`
    )
    this.Button_Close = new Element(
      global.page,
      this.parent.locator(`div.chakra-modal__footer button:nth-child(1)`)
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
    this.Button_AddRow = this.parent.locator(`button[aria-label="Add Row"]`)
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Validate() {
    // Validate Scheduled Appointment fields are in an invalid state and that the errors are..
    let appointmentChannelFieldIsValidated = false
    if ((await this.ListBox_AppointmentChannel.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.ListBox_AppointmentChannel.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      appointmentChannelFieldIsValidated =
        validationText == ValidationStrings.InvalidAppointmentChannel
    }

    let appointmentDateFieldIsValidated = false
    if ((await this.TextBox_AppointmentDate.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId =
        await this.TextBox_AppointmentDate.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      appointmentDateFieldIsValidated = validationText == ValidationStrings.InvalidString2
    }

    let appointmentTypeFieldIsValidated = false
    if ((await this.ListBox_AppointmentType.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.ListBox_AppointmentType.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      appointmentTypeFieldIsValidated = validationText == ValidationStrings.InvalidAppointmentType
    }

    return (
      appointmentChannelFieldIsValidated &&
      appointmentDateFieldIsValidated &&
      appointmentTypeFieldIsValidated
    )
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }

  async GetParticipantTypeListLocatorByRow(rowIndex: number) {
    const theLocator = this.parent.locator(
      `#scheduleAppointmentForm > div > div:nth-child(5) div[id*="-row-${rowIndex}"] select`
    )
    return theLocator
  }

  async GetParticipantsContactLocatorByRow(rowIndex: number) {
    const theLocator = this.parent.locator(`input[id="participants.${rowIndex}.contact"]`)
    return theLocator
  }

  async GetParticipantsParticipantLocatorByRow(rowIndex: number) {
    const theLocator = this.parent.locator(`input[id="participants.${rowIndex}.participant"]`)
    return theLocator
  }

  async GetRemoveRowLocatorByRow(rowIndex: number) {
    const theLocator = this.parent
      .getByLabel(DrawerStrings.ScheduleAppointment_Button_RemoveRow)
      .nth(rowIndex)
    return theLocator
  }
}
