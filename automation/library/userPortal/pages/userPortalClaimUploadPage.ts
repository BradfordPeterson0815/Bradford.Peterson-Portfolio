import { Locator } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { MaxUploadFiles, UploadPageStrings, ValidationStrings } from '../userPortalConstants.js'
import { UserPortalBasePage } from './userPortalBasePage.js'
import { UserPortalClaim } from '../userPortalClaim.js'
import { UserPortalGlobal } from '../userPortalGlobal.js'
import { UserPortalFileCard } from '../userPortalFileCard.js'

export class UserPortalClaimUploadPage extends UserPortalBasePage {
  readonly claim: UserPortalClaim
  readonly parent: Locator
  readonly content: Locator
  readonly footer: Locator
  readonly gallery: Locator
  readonly totalSize: Locator
  readonly files: Locator
  readonly fileCards: Locator
  readonly validationError: Locator
  readonly URL: string
  readonly Title: Element
  readonly Instructions: Element
  readonly FileTypes: Element
  readonly Button_SelectFiles: Element
  readonly Button_Submit_Content: Element
  readonly Button_Submit_Footer: Element
  readonly Button_ClearAll: Element

  constructor(global: UserPortalGlobal, claim: UserPortalClaim, baseURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${baseURL}/upload-documents`
    this.parent = this.page.locator('#uploadDocumentsForm > div[data-slot="card"]')
    this.content = this.parent.locator('div[data-slot="card-content"]')
    this.fileCards = this.content.locator('div[data-slot="card"]')
    this.footer = this.parent.locator('div[data-slot="card-footer"]')
    this.gallery = this.content.locator('h4')
    this.totalSize = this.gallery.locator('..').locator('div').nth(0)
    this.files = this.page.locator('input[type="file"]')
    this.validationError = this.content.locator('div[data-slot="alert-content"]')
    this.Title = new Element(global.page, this.content.locator('h3'), UploadPageStrings.Title)
    this.Instructions = new Element(
      global.page,
      this.Title.locator.locator('..').locator('p').nth(0),
      UploadPageStrings.Instructions
    )
    this.FileTypes = new Element(
      global.page,
      this.Title.locator.locator('..').locator('p').nth(1),
      UploadPageStrings.FileTypes
    )
    this.Button_SelectFiles = new Element(
      global.page,
      this.files.locator('..').locator('div > button').nth(0),
      UploadPageStrings.FileTypes
    )
    this.Button_ClearAll = new Element(
      global.page,
      this.content.locator('div[data-slot="button-group"] button').nth(0),
      UploadPageStrings.Button_ClearAll
    )
    this.Button_Submit_Content = new Element(
      global.page,
      this.content.locator('div[data-slot="button-group"] button').nth(1),
      UploadPageStrings.Button_Submit
    )
    this.Button_Submit_Footer = new Element(
      global.page,
      this.footer.locator('#fileUploadForm-submit'),
      UploadPageStrings.Button_Submit
    )
  }

  async FileCardCount() {
    const count = await this.fileCards.count()
    return count
  }

  FetchFileCard(index: number) {
    const fileCard = new UserPortalFileCard(this.global, this.fileCards, index)
    return fileCard
  }

  async NavigateDirectly(): Promise<void> {
    await this.page.waitForTimeout(1000)
    await super.NavigateDirectly(this.URL)
    await this.page.waitForURL(this.URL)
  }
  async IsValidationAlert() {
    return (await this.validationError.count()) > 0
  }

  async FetchValidationAlert() {
    const title = await this.validationError.locator('div[data-slot="alert-title"]').textContent()
    const description = await this.validationError
      .locator('div[data-slot="alert-description"]')
      .textContent()
    const descriptionItems = description?.split('\n') || ''
    return { title, descriptionItems }
  }

  async ValidateNoFiles() {
    // Validate file input is in an invalid state and that the error is..
    let noFilesValidated = false
    const errorLocator = this.content.locator(`div[data-slot="field-error"]`)
    const canCheck = (await errorLocator.count()) > 0
    if (canCheck) {
      const errorMessage = await errorLocator.textContent()
      noFilesValidated = errorMessage === ValidationStrings.FilesAreRequired
    }
    return noFilesValidated
  }

  async ValidateMaxFilesAlert() {
    // Validate file input is in an invalid state and that the error is..
    const actualMaxFileMessage = ValidationStrings.MaxFiles.replace(
      '<MAXUPLOADFILES>',
      MaxUploadFiles.toString()
    )
    const alertTitleLocator = this.content.locator(
      `div[data-slot="alert-content"] div[data-slot="alert-title"]`
    )
    const alertDescriptionLocator = this.content.locator(
      `div[data-slot="alert-content"] div[data-slot="alert-description"]`
    )

    let maxFilesAlertValidated = false
    const canCheck = (await alertTitleLocator.count()) > 0
    if (canCheck) {
      const alertTitle = await alertTitleLocator.textContent()
      const alertDescription = await alertDescriptionLocator.textContent()

      maxFilesAlertValidated =
        alertTitle == actualMaxFileMessage &&
        alertDescription == ValidationStrings.MaxFilesDescription
    }
    return maxFilesAlertValidated
  }

  async ValidateTooManyFiles(expectedOverageCount: number) {
    // Validate file input is in an invalid state and that the error is..
    const actualOverMaxFileMessageDescription = ValidationStrings.OverMaxFilesDescription.replace(
      '<FILEOVERAGE>',
      expectedOverageCount.toString()
    )
    const alertTitleLocator = this.content.locator(
      `div[data-slot="alert-content"] div[data-slot="alert-title"]`
    )
    const alertDescriptionLocator = this.content.locator(
      `div[data-slot="alert-content"] div[data-slot="alert-description"]`
    )

    let overMaxFilesAlertValidated = false
    const canCheck = (await alertTitleLocator.count()) > 0
    if (canCheck) {
      const alertTitle = await alertTitleLocator.textContent()
      const alertDescription = await alertDescriptionLocator.textContent()

      overMaxFilesAlertValidated =
        alertTitle == ValidationStrings.OverMaxFiles &&
        alertDescription == actualOverMaxFileMessageDescription
    }
    return overMaxFilesAlertValidated
  }

  async UploadUnsupportedFile() {
    const fullFileName = 'InvalidUpload.txt'
    const fullPathToFile = this.global.uploadFolder + '//' + fullFileName //this.global.uploadFolder + '\\' + fullFileName
    await this.UploadSingleFile(fullPathToFile)
    return fullFileName
  }

  async UploadValidMov() {
    const fullFileName = 'world.mov'
    const fullPathToFile = this.global.uploadFolder + '//' + fullFileName
    await this.UploadSingleFile(fullPathToFile)
    return fullFileName
  }

  async UploadValidPDF() {
    const fullFileName = 'UploadDocument.pdf'
    const fullPathToFile = this.global.uploadFolder + '//' + fullFileName
    await this.UploadSingleFile(fullPathToFile)
    return fullFileName
  }

  async UploadValidPNG() {
    const fullFileName = 'UploadImage.png'
    const fullPathToFile = this.global.uploadFolder + '//' + fullFileName
    await this.UploadSingleFile(fullPathToFile)
    return fullFileName
  }

  async UploadTooLargeFile() {
    const fullFileName = 'Over1GigVideo.mp4'
    const fullPathToFile = this.global.uploadFolder + '//' + fullFileName
    await this.UploadSingleFile(fullPathToFile, 5000)
    return fullFileName
  }

  async LoadupMaxFiles() {
    const fullFileName = 'Image_1 - Copy (X).png'
    const fullPathToFile = this.global.uploadFolder + '//max//' + fullFileName
    const fileArray: string[] = []
    let count = 1
    while (count < MaxUploadFiles + 1) {
      const fileToPush = fullPathToFile.replace('X', count.toString())
      fileArray.push(fileToPush)
      count++
    }
    await this.page.setInputFiles('input[type="file"]', fileArray)
  }

  async LoadUpOverMaxFiles() {
    const fullFileName = 'Image_1 - Copy (X).png'
    const fullPathToFile = this.global.uploadFolder + '//max//' + fullFileName
    const fileArray: string[] = []
    let count = 1
    while (count < MaxUploadFiles + 2) {
      const fileToPush = fullPathToFile.replace('X', count.toString())
      fileArray.push(fileToPush)
      count++
    }
    await this.page.setInputFiles('input[type="file"]', fileArray)
  }

  async UploadSingleFile(fullPathToFile: string, wait: number = 500) {
    await this.page.setInputFiles('input[type="file"]', [fullPathToFile])
    await this.page.waitForTimeout(wait)
  }
}
