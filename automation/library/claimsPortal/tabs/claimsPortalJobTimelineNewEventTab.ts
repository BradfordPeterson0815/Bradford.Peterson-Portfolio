import { Element } from '../../shared/element.js'
import {
  CreateJobTimelineEventSelectionOptions,
  JobTimelineNewEventTabStrings,
  ValidationStrings,
} from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalJob } from '../claimsPortalJob.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'

export class ClaimsPortalJobTimelineNewEventTab extends ClaimsPortalBasePage {
  readonly job: ClaimsPortalJob
  readonly URL: string
  readonly Title: Element
  readonly ComboBox_SelectEvent_SelectEventType: Element
  readonly Button_SelectEvent_Next: Element
  readonly Button_EventInfo_Back: Element
  readonly Button_EventInfo_Submit: Element
  readonly TextBox_EventInfo_StartedDate: Element
  readonly TextArea_EventInfo_StartedNotes: Element
  readonly ListBox_EventInfo_AppointmentChannel: Element
  readonly TextBox_EventInfo_AppointmentDate: Element
  readonly TextArea_EventInfo_AppointmentDescription: Element
  readonly ListBox_EventInfo_AppointmentType: Element
  readonly ComboBox_EventInfo_Appointment: Element
  readonly TextArea_EventInfo_AppointmentNotes: Element
  readonly TextBox_EventInfo_ContactAttemptedDate: Element
  readonly ComboBox_EventInfo_ContactedBy: Element
  readonly ComboBox_EventInfo_CustomerContacted: Element
  readonly ListBox_EventInfo_Method: Element
  readonly ListBox_EventInfo_Outcome: Element
  readonly ComboBox_EventInfo_PaidBy: Element
  readonly TextBox_EventInfo_PaidDate: Element
  readonly CheckBox_EventInfo_PaidInFull: Element
  readonly ListBox_EventInfo_ExternalIdType: Element
  readonly TextBox_EventInfo_ExternalId: Element
  readonly ListBox_EventInfo_ApprovedBy: Element
  readonly TextBox_EventInfo_ApprovedDate: Element
  readonly ComboBox_EventInfo_Carrier: Element
  readonly TextBox_EventInfo_InvoicedDate: Element
  readonly TextArea_EventInfo_Notes: Element
  readonly ComboBox_EventInfo_CarrierWhoPaid: Element
  readonly TextBox_EventInfo_SentDate: Element
  readonly TextBox_EventInfo_CollectorName: Element
  readonly ComboBox_EventInfo_Subcontractors: Element
  readonly CheckBox_EventInfo_Invoice: Element
  readonly CheckBox_EventInfo_PhotoReport: Element
  readonly TextBox_EventInfo_IssuedDate: Element
  readonly ListBox_EventInfo_IssuedMethod: Element
  readonly TextBox_EventInfo_ReceivedDate: Element
  readonly ListBox_EventInfo_ReceivedMethod: Element
  readonly TextBox_EventInfo_ClosedDate: Element
  readonly ListBox_EventInfo_ClosedReason: Element
  readonly TextArea_EventInfo_ClosingNotes: Element

  constructor(global: ClaimsPortalGlobal, job: ClaimsPortalJob, jobPageURL: string) {
    super(global)
    this.job = job
    this.URL = `${jobPageURL}/timeline/new-event`
    this.Title = new Element(
      global.page,
      this.page.locator('.chakra-card__header h2'),
      JobTimelineNewEventTabStrings.Title
    )
    this.ComboBox_SelectEvent_SelectEventType = new Element(
      global.page,
      this.page.locator(`#selectEvent input[role="combobox"]`)
    )
    this.Button_SelectEvent_Next = new Element(
      global.page,
      this.page.locator(`.chakra-card__body > div > div[role="group"] button[form="selectEvent"]`)
    )
    this.Button_EventInfo_Back = new Element(
      global.page,
      this.page.locator(`.chakra-card__body > div > div[role="group"] button`).nth(0)
    )
    this.Button_EventInfo_Submit = new Element(
      global.page,
      this.page.locator(`.chakra-card__body > div > div[role="group"] button[form="eventInfo"]`)
    )
    this.TextBox_EventInfo_StartedDate = new Element(global.page, this.page.locator(`#startedDate`))
    this.TextArea_EventInfo_StartedNotes = new Element(
      global.page,
      this.page.locator('#startedNotes')
    )
    this.ListBox_EventInfo_AppointmentChannel = new Element(
      global.page,
      this.page.locator('#appointmentChannel')
    )
    this.TextBox_EventInfo_AppointmentDate = new Element(
      global.page,
      this.page.locator(`#appointmentDate`)
    )
    this.TextArea_EventInfo_AppointmentDescription = new Element(
      global.page,
      this.page.locator('#appointmentDescription')
    )
    this.ListBox_EventInfo_AppointmentType = new Element(
      global.page,
      this.page.locator('#appointmentType')
    )
    this.ComboBox_EventInfo_Appointment = new Element(
      global.page,
      this.page.locator(`#eventInfo input[role="combobox"]`)
    )
    this.TextArea_EventInfo_AppointmentNotes = new Element(
      global.page,
      this.page.locator('#appointmentNotes')
    )
    this.TextBox_EventInfo_ContactAttemptedDate = new Element(
      global.page,
      this.page.locator('#contactAttemptedDate')
    )
    this.ComboBox_EventInfo_ContactedBy = new Element(
      global.page,
      this.page.locator('#eventInfo input[role="combobox"]').nth(0)
    )
    this.ComboBox_EventInfo_CustomerContacted = new Element(
      global.page,
      this.page.locator('#eventInfo input[role="combobox"]').nth(1)
    )
    this.ListBox_EventInfo_Method = new Element(global.page, this.page.locator('#contactMethod'))
    this.ListBox_EventInfo_Outcome = new Element(global.page, this.page.locator('#contactOutcome'))
    this.ComboBox_EventInfo_PaidBy = new Element(
      global.page,
      this.page.locator('#eventInfo input[role="combobox"]').nth(0)
    )
    this.TextBox_EventInfo_PaidDate = new Element(global.page, this.page.locator('#paidDate'))
    this.CheckBox_EventInfo_PaidInFull = new Element(global.page, this.page.locator('#paidInFull'))
    this.ListBox_EventInfo_ExternalIdType = new Element(
      global.page,
      this.page.locator('#externalIdType')
    )
    this.TextBox_EventInfo_ExternalId = new Element(global.page, this.page.locator('#externalId'))
    this.ListBox_EventInfo_ApprovedBy = new Element(global.page, this.page.locator('#approvedBy'))
    this.TextBox_EventInfo_ApprovedDate = new Element(
      global.page,
      this.page.locator('#approvedDate')
    )
    this.ComboBox_EventInfo_Carrier = new Element(
      global.page,
      this.page.locator('#eventInfo input[role="combobox"]').nth(0)
    )
    this.TextBox_EventInfo_InvoicedDate = new Element(
      global.page,
      this.page.locator('#invoicedDate')
    )
    this.TextArea_EventInfo_Notes = new Element(global.page, this.page.locator('#notes'))
    this.ComboBox_EventInfo_CarrierWhoPaid = new Element(
      global.page,
      this.page.locator('#eventInfo input[role="combobox"]').nth(0)
    )
    this.TextBox_EventInfo_SentDate = new Element(global.page, this.page.locator('#sentDate'))
    this.TextBox_EventInfo_CollectorName = new Element(
      global.page,
      this.page.locator('#collectorName')
    )
    this.ComboBox_EventInfo_Subcontractors = new Element(
      global.page,
      this.page.locator('#eventInfo input[role="combobox"]').nth(0)
    )
    this.CheckBox_EventInfo_Invoice = new Element(
      global.page,
      this.page.locator('input[value="invoice"]')
    )
    this.CheckBox_EventInfo_PhotoReport = new Element(
      global.page,
      this.page.locator('input[value="photoReport"]')
    )
    this.TextBox_EventInfo_IssuedDate = new Element(global.page, this.page.locator('#issuedDate'))
    this.ListBox_EventInfo_IssuedMethod = new Element(
      global.page,
      this.page.locator('#issuedMethod')
    )
    this.TextBox_EventInfo_ReceivedDate = new Element(
      global.page,
      this.page.locator('#receivedDate')
    )
    this.ListBox_EventInfo_ReceivedMethod = new Element(
      global.page,
      this.page.locator('#receivedMethod')
    )
    this.TextBox_EventInfo_ClosedDate = new Element(global.page, this.page.locator('#closedDate'))
    this.ListBox_EventInfo_ClosedReason = new Element(
      global.page,
      this.page.locator('#closedReason')
    )
    this.TextArea_EventInfo_ClosingNotes = new Element(
      global.page,
      this.page.locator('#closingNotes')
    )
  }

  async SelectJobTimelineEvent(event: CreateJobTimelineEventSelectionOptions) {
    await this.ComboBox_SelectEvent_SelectEventType.Fill(event)
    await this.page.keyboard.press('Tab')
  }

  async VerifyEventTitle(event: CreateJobTimelineEventSelectionOptions) {
    const expectedTitle = `Create ${event} Event`
    await this.Title.VerifyExpectedText(expectedTitle)
  }

  async ValidateEventSelection() {
    // Validate Select Job Timeline Event field is in an invalid state and that the error is..
    let selectionFieldValidated = false
    const selectionFieldValidator = this.page.locator(
      '#selectEvent div[role="group"][data-invalid]'
    )
    if ((await selectionFieldValidator.count()) > 0) {
      const validationText = await selectionFieldValidator.locator('> div').nth(1).textContent()
      selectionFieldValidated = validationText == ValidationStrings.Required
      return selectionFieldValidated
    }
  }

  async ValidateJobStarted() {
    // Validate startDate Field is in an invalid state and that the error is..
    let startedDateFieldIsValidated = false
    if ((await this.TextBox_EventInfo_StartedDate.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId =
        await this.TextBox_EventInfo_StartedDate.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      startedDateFieldIsValidated = validationText == ValidationStrings.InvalidString1
    }
    return startedDateFieldIsValidated
  }

  async ValidateAppointmentScheduled() {
    // Validate Appointment Scheduled fields are in an invalid state and that the errors are..
    let appointmentChannelFieldIsValidated = false
    if (
      (await this.ListBox_EventInfo_AppointmentChannel.locator.getAttribute('aria-invalid')) ==
      'true'
    ) {
      const referenceId =
        await this.ListBox_EventInfo_AppointmentChannel.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      appointmentChannelFieldIsValidated =
        validationText == ValidationStrings.InvalidAppointmentChannel
    }

    let appointmentDateFieldIsValidated = false
    if (
      (await this.TextBox_EventInfo_AppointmentDate.locator.getAttribute('aria-invalid')) == 'true'
    ) {
      const referenceId =
        await this.TextBox_EventInfo_AppointmentDate.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      appointmentDateFieldIsValidated = validationText == ValidationStrings.InvalidString2
    }

    let appointmentTypeFieldIsValidated = false
    if (
      (await this.ListBox_EventInfo_AppointmentType.locator.getAttribute('aria-invalid')) == 'true'
    ) {
      const referenceId =
        await this.ListBox_EventInfo_AppointmentType.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      appointmentTypeFieldIsValidated = validationText == ValidationStrings.InvalidAppointmentType
    }

    return (
      appointmentChannelFieldIsValidated &&
      appointmentDateFieldIsValidated &&
      appointmentTypeFieldIsValidated
    )
  }

  async ValidateAppointmentCompleted() {
    // Validate Select Appointment field is in an invalid state and that the error is..
    let selectionFieldValidated = false
    const selectionFieldValidator = this.page.locator('#eventInfo div[role="group"][data-invalid]')
    if ((await selectionFieldValidator.count()) > 0) {
      const validationText = await selectionFieldValidator.locator('> div').nth(1).textContent()
      selectionFieldValidated = validationText == ValidationStrings.Required
      return selectionFieldValidated
    }
  }

  async ValidateCustomerContactAttempted() {
    // Validate Customer Contact fields are in an invalid state and that the errors are..
    const selectionLocator = this.page.locator(` div[data-invalid=""] > div:nth-child(3)`).nth(0)
    const customerContactedFieldIsValidated =
      (await selectionLocator.textContent()) == ValidationStrings.Required

    let methodFieldIsValidated = false
    if ((await this.ListBox_EventInfo_Method.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId =
        await this.ListBox_EventInfo_Method.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      methodFieldIsValidated = validationText == ValidationStrings.InvalidContactMethod
    }

    let outcomeFieldIsValidated = false
    if ((await this.ListBox_EventInfo_Outcome.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId =
        await this.ListBox_EventInfo_Outcome.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      outcomeFieldIsValidated = validationText == ValidationStrings.InvalidContactOutcome
    }

    return customerContactedFieldIsValidated && methodFieldIsValidated && outcomeFieldIsValidated
  }

  async ValidateDepositPaid() {
    // Validate Deposit Paid fields are in an invalid state and that the errors are..
    let paidByFieldValidated = false
    const paidByFieldValidator = this.page
      .locator('#eventInfo div[role="group"][data-invalid]')
      .nth(0)
    if ((await paidByFieldValidator.count()) > 0) {
      const validationText = await paidByFieldValidator.locator('> div').nth(1).textContent()
      paidByFieldValidated = validationText == ValidationStrings.Required
    }

    let paidDateFieldIsValidated = false
    if ((await this.TextBox_EventInfo_PaidDate.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId =
        await this.TextBox_EventInfo_PaidDate.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      paidDateFieldIsValidated = validationText == ValidationStrings.InvalidString1
    }

    return paidByFieldValidated && paidDateFieldIsValidated
  }

  async ValidateDepositOverrideApproved() {
    // Validate Deposit Override Approved fields are in an invalid state and that the errors are..
    let approvedByFieldIsValidated = false
    if ((await this.ListBox_EventInfo_ApprovedBy.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId =
        await this.ListBox_EventInfo_ApprovedBy.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      approvedByFieldIsValidated = validationText
        ? validationText.startsWith(ValidationStrings.InvalidEnumValueGeneric)
        : false
    }

    let approvedDateFieldIsValidated = false
    if (
      (await this.TextBox_EventInfo_ApprovedDate.locator.getAttribute('aria-invalid')) == 'true'
    ) {
      const referenceId =
        await this.TextBox_EventInfo_ApprovedDate.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      approvedDateFieldIsValidated = validationText == ValidationStrings.InvalidString1
    }

    return approvedByFieldIsValidated && approvedDateFieldIsValidated
  }

  async ValidateCarrierInvoiced() {
    // Validate Carrier Invoiced fields are in an invalid state and that the errors are..
    let invoicedDateFieldIsValidated = false
    if (
      (await this.TextBox_EventInfo_InvoicedDate.locator.getAttribute('aria-invalid')) == 'true'
    ) {
      const referenceId =
        await this.TextBox_EventInfo_InvoicedDate.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      invoicedDateFieldIsValidated = validationText == ValidationStrings.InvalidString1
    }

    return invoicedDateFieldIsValidated
  }

  async ValidateCarrierPaymentReceived() {
    // Validate Carrier Payment Received fields are in an invalid state and that the errors are..
    let paidDateFieldIsValidated = false
    if ((await this.TextBox_EventInfo_PaidDate.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId =
        await this.TextBox_EventInfo_PaidDate.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      paidDateFieldIsValidated = validationText == ValidationStrings.InvalidString1
    }

    return paidDateFieldIsValidated
  }

  async ValidateBillSentToCollections() {
    // Validate Bill Sent To Collections fields are in an invalid state and that the errors are..
    let sentDateFieldIsValidated = false
    if ((await this.TextBox_EventInfo_SentDate.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId =
        await this.TextBox_EventInfo_SentDate.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      sentDateFieldIsValidated = validationText == ValidationStrings.InvalidString1
    }

    return sentDateFieldIsValidated
  }

  async ValidateSubcontractorDocumentIssued() {
    // Validate Subcontractor Document Issued fields are in an invalid state and that the errors are..
    let subcontractorsFieldValidated = false
    const subcontractorsFieldValidator = this.page
      .locator('#eventInfo div[role="group"][data-invalid]')
      .nth(0)
    if ((await subcontractorsFieldValidator.count()) > 0) {
      const validationText = await subcontractorsFieldValidator
        .locator('> div')
        .nth(1)
        .textContent()
      subcontractorsFieldValidated = validationText == ValidationStrings.Required
    }

    let issuedDateFieldIsValidated = false
    if ((await this.TextBox_EventInfo_IssuedDate.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId =
        await this.TextBox_EventInfo_IssuedDate.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      issuedDateFieldIsValidated = validationText == ValidationStrings.InvalidString1
    }

    return subcontractorsFieldValidated && issuedDateFieldIsValidated
  }

  async ValidateSubcontractorDocumentReceived() {
    // Validate Subcontractor Document Recieved fields are in an invalid state and that the errors are..
    let subcontractorsFieldValidated = false
    const subcontractorsFieldValidator = this.page
      .locator('#eventInfo div[role="group"][data-invalid]')
      .nth(0)
    if ((await subcontractorsFieldValidator.count()) > 0) {
      const validationText = await subcontractorsFieldValidator
        .locator('> div')
        .nth(1)
        .textContent()
      subcontractorsFieldValidated = validationText == ValidationStrings.Required
    }

    let receivedDateFieldIsValidated = false
    if (
      (await this.TextBox_EventInfo_ReceivedDate.locator.getAttribute('aria-invalid')) == 'true'
    ) {
      const referenceId =
        await this.TextBox_EventInfo_ReceivedDate.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      receivedDateFieldIsValidated = validationText == ValidationStrings.InvalidString1
    }

    let receivedMethodFieldIsValidated = false
    if (
      (await this.ListBox_EventInfo_ReceivedMethod.locator.getAttribute('aria-invalid')) == 'true'
    ) {
      const referenceId =
        await this.ListBox_EventInfo_ReceivedMethod.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      receivedMethodFieldIsValidated = validationText == ValidationStrings.InvalidReceivedMethod
    }

    return (
      subcontractorsFieldValidated && receivedDateFieldIsValidated && receivedMethodFieldIsValidated
    )
  }

  async ValidateSubcontractorPaid() {
    // Validate Subcontractor Paid fields are in an invalid state and that the errors are..
    let subcontractorsFieldValidated = false
    const subcontractorsFieldValidator = this.page
      .locator('#eventInfo div[role="group"][data-invalid]')
      .nth(0)
    if ((await subcontractorsFieldValidator.count()) > 0) {
      const validationText = await subcontractorsFieldValidator
        .locator('> div')
        .nth(1)
        .textContent()
      subcontractorsFieldValidated = validationText == ValidationStrings.Required
    }

    // let paidDateFieldIsValidated = false
    // if ((await this.TextBox_EventInfo_PaidDate.locator.getAttribute('aria-invalid')) == 'true') {
    //   const referenceId = await this.TextBox_EventInfo_PaidDate.locator.getAttribute('aria-describedby')
    //   const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
    //   paidDateFieldIsValidated = validationText == ValidationStrings.InvalidString1
    // }

    return subcontractorsFieldValidated // && paidDateFieldIsValidated
  }

  async ValidateJobCompletedCancelledWithdrawn() {
    // Validate Job Completed field is in an invalid state and that the error is..
    let closedDateFieldIsValidated = false
    if ((await this.TextBox_EventInfo_ClosedDate.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId =
        await this.TextBox_EventInfo_ClosedDate.locator.getAttribute('aria-describedby')
      const validationText = await this.page.locator(`div[id='${referenceId}']`).textContent()
      closedDateFieldIsValidated = validationText == ValidationStrings.InvalidString1
    }
    return closedDateFieldIsValidated
  }
}
