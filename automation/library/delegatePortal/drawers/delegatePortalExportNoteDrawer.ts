import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../delegatePortalConstants.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalBase } from '../pages/delegatePortalBase.js'

export class DelegatePortalExportNoteDrawer extends DelegatePortalBase {
  readonly parent: Locator
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Cancel: Element
  readonly Button_Submit: Element
  readonly CheckBox_PublicationTarget_Redacted1: Element
  readonly CheckBox_PublicationTarget_Job: Locator

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = DrawerStrings.ExportNote_Title
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Close}` }).first()
    )
    this.Button_Cancel = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Cancel}` })
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
    this.CheckBox_PublicationTarget_Redacted1 = new Element(
      global.page,
      this.parent.locator(`input[value="XactAnalysis"]`).locator('..')
    )
    this.CheckBox_PublicationTarget_Job = this.parent.locator(`input`)
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

  async IsRedacted1Available() {
    return (await this.CheckBox_PublicationTarget_Redacted1.locator.count()) < 0
  }

  async Validate() {
    // Validate publicationTarget checkbox group is in an invalid state and that the error is..
    let publicationTargetCheckboxesAreValidated = false
    const target = (await this.IsRedacted1Available())
      ? this.CheckBox_PublicationTarget_Redacted1
      : this.TargetJobCheckboxByIndex(0)
    if ((await target.locator.locator('input').getAttribute('aria-invalid')) == 'true') {
      const referenceId = await target.locator.locator('input').getAttribute('aria-describedby')
      // `At least one publication target should be selected`
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
