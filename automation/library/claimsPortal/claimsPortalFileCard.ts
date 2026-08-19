import { Locator } from '@playwright/test'
import { Element } from '../shared/element.js'
import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { ClaimsPortalBase } from './pages/claimsPortalBase.js'
import { FileCardStrings } from './claimsPortalConstants.js'
import { ClaimsPortalFileCardImageZoomDialog } from './dialogs/claimsPortalFileCardImageZoomDialog.js'

export class ClaimsPortalFileCard extends ClaimsPortalBase {
  readonly parent: Locator
  readonly content: Locator
  readonly footer: Locator
  readonly label_FileName: Locator
  readonly label_FileSize: Locator
  readonly Label_Title: Element
  readonly TextBox_Title: Element
  readonly Label_FileDescription: Element
  readonly TextArea_FileDescription: Element

  constructor(global: ClaimsPortalGlobal, fileCardParent: Locator, cardIndex: number) {
    super(global)
    this.parent = fileCardParent.nth(cardIndex)
    this.content = this.parent.locator('div[data-slot="card-content"]')
    this.footer = this.parent.locator('div[data-slot="card-footer"]')
    this.label_FileName = this.content.locator(`p`).nth(0)
    this.label_FileSize = this.content.locator(`p`).nth(1)
    this.Label_Title = new Element(
      global.page,
      this.footer.locator(`label[data-slot="field-label"]`).nth(0),
      FileCardStrings.Label_Title
    )
    this.TextBox_Title = new Element(
      global.page,
      this.footer.locator(`input[data-slot="input"]`).nth(0)
    )
    this.Label_FileDescription = new Element(
      global.page,
      this.footer.locator(`label[data-slot="field-label"]`).nth(0),
      FileCardStrings.Label_FileDescription
    )
    this.TextArea_FileDescription = new Element(
      global.page,
      this.footer.locator(`textarea[data-slot="textarea"]`).nth(0)
    )
  }

  async FetchCardData() {
    const fileName = await this.label_FileName.textContent()
    const fileSize = await this.label_FileSize.textContent()
    const filetitle = await this.TextBox_Title.locator.inputValue()
    const fileDescription = await this.TextArea_FileDescription.locator.textContent()
    return { fileName, fileSize, filetitle, fileDescription }
  }

  async RemoveCard() {
    const button1Locator = this.parent.locator('button').nth(0)
    const button2Locator = this.parent.locator('button').nth(1)
    const buttonCount = await this.CardButtonCount()
    const button2IsVisible = buttonCount > 1
    if (button2IsVisible) {
      await button2Locator.click()
    } else {
      await button1Locator.click()
    }
  }

  async Zoom() {
    const buttonCount = await this.CardButtonCount()
    if (buttonCount == 2) {
      const button1Locator = this.parent.locator('button').nth(0)
      await button1Locator.click() // click the zoom button (1st button)
    }
    const fileName = (await this.label_FileName.textContent()) || ''
    return new ClaimsPortalFileCardImageZoomDialog(this.global, fileName)
  }

  async CardButtonCount() {
    const buttonsLocator = this.parent.locator('button')
    const buttonCount = await buttonsLocator.count()
    return buttonCount
  }
}
