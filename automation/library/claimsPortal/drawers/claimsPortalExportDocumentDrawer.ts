import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalExportDocumentDrawer extends ClaimsPortalBase {
  readonly parent: Locator
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly CheckBox_PublicationTarget_Redacted1: Element
  readonly CheckBox_PublicationTarget_Xactimate: Element
  readonly CheckBox_PublicationTarget_Job: Locator
  readonly CheckBox_GroupVisibility_Coordinator: Element
  readonly CheckBox_GroupVisibility_Estimator: Element
  readonly CheckBox_GroupVisibility_Insured: Element
  readonly CheckBox_GroupVisibility_Tech: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.ExportDocument_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Close}` }).first()
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
    this.CheckBox_PublicationTarget_Redacted1 = new Element(
      global.page,
      this.parent.locator(`input[value="XactAnalysis"]`).locator('..')
    )
    this.CheckBox_PublicationTarget_Xactimate = new Element(
      global.page,
      this.parent.locator(`input[value="Xactimate"]`).locator('..')
    )
    this.CheckBox_PublicationTarget_Job = this.parent.locator(`input`)
    this.CheckBox_GroupVisibility_Coordinator = new Element(
      global.page,
      this.parent.locator(`input[value="claims"]`).locator('..')
    )
    this.CheckBox_GroupVisibility_Estimator = new Element(
      global.page,
      this.parent.locator(`input[value="estimator"]`).locator('..')
    )
    this.CheckBox_GroupVisibility_Insured = new Element(
      global.page,
      this.parent.locator(`input[value="insured"]`).locator('..')
    )
    this.CheckBox_GroupVisibility_Tech = new Element(
      global.page,
      this.parent.locator(`input[value="technician"]`).locator('..')
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  TargetJobCheckboxByIndex(jobIndex: number) {
    return new Element(this.global.page, this.parent.locator(`input`).nth(jobIndex).locator('..'))
  }

  TargetJobCheckboxByJobId(jobId: string) {
    return new Element(
      this.global.page,
      this.parent.locator(`input[value="${jobId}"]`).locator('..')
    )
  }

  async Validate() {
    // Validate publicationTarget checkbox group is in an invalid state and that the error is..
    const targetElement = this.TargetJobCheckboxByIndex(0)
    let publicationTargetCheckboxesAreValidated = false

    if ((await targetElement.locator.locator('input').getAttribute('aria-invalid')) == 'true') {
      const referenceId = await targetElement.locator
        .locator('input')
        .getAttribute('aria-describedby')
      // At least one publication target should be selected
      publicationTargetCheckboxesAreValidated =
        (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidExportSelection
    }
    return publicationTargetCheckboxesAreValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
