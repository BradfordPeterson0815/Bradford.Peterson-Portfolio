import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { Locator } from '@playwright/test'
import { ClaimsPortalFileCard } from '../claimsPortalFileCard.js'

export class ClaimsPortalUpdateProfileImageDrawer extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly Button_RemoveAllFiles: Element
  readonly parent: Locator
  readonly file: Locator
  readonly fileCards: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    this.file = this.parent.locator('input[type="file"]')
    this.fileCards = this.parent.locator('div[id^="card"] div.chakra-card__body')
    this.Title = new Element(
      global.page,
      this.parent.getByText(DrawerStrings.UpdateProfileImageDrawer_Title),
      DrawerStrings.UpdateProfileImageDrawer_Title
    )
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(global.page, this.parent.getByLabel(DrawerStrings.Button_Close))
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` }),
      DrawerStrings.Button_Submit
    )
    this.Button_RemoveAllFiles = new Element(
      global.page,
      this.parent.getByRole('button', {
        name: `${DrawerStrings.UpdateProfileImageDrawer_Button_RemoveAllFiles}`,
      }),
      DrawerStrings.UpdateProfileImageDrawer_Button_RemoveAllFiles
    )
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }

  async FileCardCount() {
    const count = await this.fileCards.count()
    return count
  }

  async FetchFileCard(index: number) {
    const fileCard = new ClaimsPortalFileCard(this.global, index)
    return fileCard
  }

  async ValidateNoFiles() {
    // Validate file input is in an invalid state and that the error is..
    let noFilesValidated = false
    if ((await this.file.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.file.getAttribute('aria-describedby')
      // "Required"
      const actualMessage = await this.page.locator(`div[id='${referenceId}']`).textContent()
      noFilesValidated =
        actualMessage === ValidationStrings.FilesAreRequired ||
        actualMessage === ValidationStrings.Required
    }
    return noFilesValidated
  }

  async UploadUnsupportedFile() {
    const fullFileName = 'InvalidUpload.txt'
    const fullPathToFile = this.global.uploadFolder + '//' + fullFileName //this.global.uploadFolder + '\\' + fullFileName
    await this.UploadSingleFile(fullPathToFile)
  }

  async UploadValidPDF() {
    const fullFileName = 'UploadDocument.pdf'
    const fullPathToFile = this.global.uploadFolder + '//' + fullFileName
    await this.UploadSingleFile(fullPathToFile)
  }

  async UploadValidPNG() {
    const fullFileName = 'UploadImage.png'
    const fullPathToFile = this.global.uploadFolder + '//' + fullFileName
    await this.UploadSingleFile(fullPathToFile)
  }

  async UploadSingleFile(fullPathToFile: string, wait: number = 500) {
    await this.page.setInputFiles('input[type="file"]', [fullPathToFile])
    await this.page.waitForTimeout(wait)
  }
}
