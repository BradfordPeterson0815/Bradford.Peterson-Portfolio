import { Element } from '../../shared/element.js'
import { Locator, expect } from '@playwright/test'
import { UserPortalBase } from '../pages/userPortalBase.js'
import { UserPortalGlobal } from '../userPortalGlobal.js'
import { DrawerStrings, ValidationStrings } from '../userPortalConstants.js'

export class UserPortalUpdateDocumentInformationDrawer extends UserPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Cancel: Element
  readonly Button_Submit: Element
  readonly Link_OpenDocumentPreview: Element
  readonly Link_MediaPreview: Element
  readonly Button_RotateLeft: Element
  readonly Button_SaveRotation: Element
  readonly Button_RotateRight: Element
  readonly TextBox_Title: Element
  readonly TextBox_Description: Element
  readonly parent: Locator
  readonly header: Locator
  readonly body: Locator
  readonly footer: Locator

  constructor(global: UserPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[data-slot="sheet-content"]')
    this.header = this.parent.locator('div[data-slot="sheet-header"]')
    this.body = this.parent.locator('div[data-slot="sheet-body"]')
    this.footer = this.parent.locator('div[data-slot="sheet-footer"]')

    this.Button_Close_X = new Element(global.page, this.parent.locator(`> button`))
    this.Title = new Element(
      global.page,
      this.header.getByText(DrawerStrings.UpdateDocumentInformation_Title),
      DrawerStrings.UpdateDocumentInformation_Title
    )
    this.Link_OpenDocumentPreview = new Element(
      global.page,
      this.body.getByRole('link', {
        name: `${DrawerStrings.UpdateDocumentInformation_Link_OpenDocumentPreview}`,
      })
    )
    this.Link_MediaPreview = new Element(global.page, this.body.locator('#updateDocumentForm a'))
    this.Button_RotateLeft = new Element(
      global.page,
      this.body.locator('button[data-slot="rotate-left"]'),
      DrawerStrings.UpdateDocumentInformation_Button_RotateLeft
    )
    this.Button_SaveRotation = new Element(
      global.page,
      this.body.locator('button[data-slot="save-rotation"]'),
      DrawerStrings.UpdateDocumentInformation_Button_SaveRotation
    )
    this.Button_RotateRight = new Element(
      global.page,
      this.body.locator('button[data-slot="rotate-right"]'),
      DrawerStrings.UpdateDocumentInformation_Button_RotateRight
    )
    this.TextBox_Title = new Element(global.page, this.body.locator('input[name="notes"]'))
    this.TextBox_Description = new Element(
      global.page,
      this.body.locator('textarea[name="description"]')
    )
    this.Button_Cancel = new Element(
      global.page,
      this.footer.getByText(DrawerStrings.Button_Cancel, { exact: true })
    )
    this.Button_Submit = new Element(
      global.page,
      this.footer.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async FillAndSubmit(documentTitle: string, documentDescription: string) {
    await this.TextBox_Title.Fill(documentTitle)
    await this.TextBox_Description.Fill(documentDescription)
    await this.Button_Submit.Click()
  }

  async Validate() {
    // Validate Title Field is in an invalid state and that the error is..
    let titleFieldIsValidated = false
    if ((await this.TextBox_Title.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_Title.locator.getAttribute('aria-describedby')
      // "String must contain at least 1 character(s)"
      titleFieldIsValidated =
        (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidString1
    }
    return titleFieldIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }

  async OpenMediaInNewTabVerifyAndClose(expectedFilename: string) {
    const pagePromise = this.context.waitForEvent('page')
    await this.Link_MediaPreview.Click()
    const pageNew = await pagePromise
    await pageNew.waitForURL(/.*/)
    await pageNew.bringToFront()
    await pageNew.waitForTimeout(1000)
    const url = pageNew.url()
    expect(decodeURI(url)).toContain(expectedFilename)
    await pageNew.close()
  }
}
