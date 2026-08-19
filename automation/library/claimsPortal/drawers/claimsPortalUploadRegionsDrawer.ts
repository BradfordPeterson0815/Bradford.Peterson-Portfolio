import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalFileCard } from '../claimsPortalFileCard.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalUploadRegionsDrawer extends ClaimsPortalBase {
  readonly Title: Element
  readonly Description: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly Button_DownloadRegionsCSV: Element
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
      this.parent.getByText(DrawerStrings.UploadRegionsCSV_Title),
      DrawerStrings.UploadRegionsCSV_Title
    )
    this.Description = new Element(
      global.page,
      this.parent.getByText(DrawerStrings.UploadRegionsCSV_Description),
      DrawerStrings.UploadRegionsCSV_Description
    )
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_DownloadRegionsCSV = new Element(
      global.page,
      this.parent.getByRole('button', {
        name: DrawerStrings.UploadRegionsCSV_Button_DownloadRegionsCSV,
      }),
      DrawerStrings.UploadRegionsCSV_Button_DownloadRegionsCSV
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
        name: `${DrawerStrings.UploadRegionsCSV_Button_RemoveAllFiles}`,
      }),
      DrawerStrings.UploadRegionsCSV_Button_RemoveAllFiles
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
    // Validate files input is in an invalid state and that the error is..
    let noFilesValidated = false
    if ((await this.file.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.file.getAttribute('aria-describedby')
      // "Required"
      const actualMessage = await this.page.locator(`div[id='${referenceId}']`).textContent()
      noFilesValidated =
        actualMessage === ValidationStrings.FileIsRequired ||
        actualMessage === ValidationStrings.Required
    }
    return noFilesValidated
  }

  async ValidateInvalidFileType() {
    // Validate file input is in an invalid state and that the error is..
    let invalidCsvFileValidated = false
    if ((await this.page.locator(`div[role="group"][data-invalid]`).count()) > 0) {
      const errorMessage = await this.page.locator(`div[role="group"][data-invalid]`).textContent()
      invalidCsvFileValidated = errorMessage === ValidationStrings.InvalidCSVFile
    }
    return invalidCsvFileValidated
  }

  async UploadValidRegionsCSV() {
    const fullFileName = 'ValidRegions.csv'
    const fullPathToFile = this.global.uploadFolder + '//' + fullFileName
    await this.UploadSingleFile(fullPathToFile)
  }

  async UploadInvalidRegionsCSV() {
    const fullFileName = 'InvalidRegions.csv'
    const fullPathToFile = this.global.uploadFolder + '//' + fullFileName
    await this.UploadSingleFile(fullPathToFile)
  }

  async UploadInvalidRegionsFileType() {
    const fullFileName = 'UploadImage.png'
    const fullPathToFile = this.global.uploadFolder + '//' + fullFileName
    await this.UploadSingleFile(fullPathToFile)
  }

  async UploadSingleFile(fullPathToFile: string, wait: number = 500) {
    await this.page.setInputFiles('input[type="file"]', [fullPathToFile])
    await this.page.waitForTimeout(wait)
  }
}
