import { Locator, expect } from '@playwright/test'
import { Element } from '../shared/element.js'
import { UserPortalBase } from './pages/userPortalBase.js'
import { UserPortalGlobal } from './userPortalGlobal.js'
import { MediaCardStrings } from './userPortalConstants.js'
import { UserPortalUpdateDocumentInformationDrawer } from './drawers/userPortalUpdateDocumentInformationDrawer.js'

export type MediaCardData = {
  filename: string
  title: string
  description: string
}

export class UserPortalMediaCard extends UserPortalBase {
  readonly parent: Locator
  readonly filenameLocator: Locator
  readonly titleLocator: Locator
  readonly descriptionLocator: Locator
  readonly previewLocator: Locator
  readonly Button_EditInfo: Element
  readonly Button_Delete: Element

  constructor(global: UserPortalGlobal, cardIndex: number) {
    super(global)
    this.parent = this.page.locator('div.chakra-card').nth(cardIndex)
    const dataLocator = this.parent.locator('> div').nth(1).locator('div').nth(0)

    this.previewLocator = this.parent.locator('a').first()

    this.filenameLocator = dataLocator
      .getByText(MediaCardStrings.Label_Filename)
      .locator('..')
      .locator('> p')
      .nth(1)

    this.titleLocator = dataLocator
      .getByText(MediaCardStrings.Label_Title)
      .locator('..')
      .locator('> p')
      .nth(1)

    this.descriptionLocator = dataLocator
      .getByText(MediaCardStrings.Label_Description)
      .locator('..')
      .locator('> p')
      .nth(1)

    this.Button_EditInfo = new Element(
      global.page,
      this.parent.locator(`div[class*="chakra-card__footer"] button`).nth(0),
      MediaCardStrings.Button_EditInfo
    )

    this.Button_Delete = new Element(
      global.page,
      this.parent.locator(`div[class*="chakra-card__footer"] button`).nth(1),
      MediaCardStrings.Button_Delete
    )
  }

  async GetData() {
    const filename = await this.filenameLocator.textContent()
    const title = await this.titleLocator.textContent()
    const description = await this.descriptionLocator.textContent()
    return {
      filename,
      title,
      description,
    } as MediaCardData
  }

  async VerifyData(expectedData: MediaCardData) {
    const actualData = await this.GetData()
    expect(actualData.filename).toBe(expectedData.filename)
    expect(actualData.title).toBe(expectedData.title)
    // description may have stuff appended, so use starts with
    expect(actualData.description.startsWith(expectedData.description)).toBe(true)
  }

  async OpenUpdateDocumentInformationDrawer() {
    await this.Button_EditInfo.Click()
    return new UserPortalUpdateDocumentInformationDrawer(this.global)
  }

  async OpenMediaInNewTabVerifyAndClose() {
    const expectedFilename = await this.filenameLocator.textContent()
    const pagePromise = this.context.waitForEvent('page')
    await this.previewLocator.click()
    const pageNew = await pagePromise
    await pageNew.waitForURL(/.*/)
    await pageNew.bringToFront()
    await pageNew.waitForTimeout(1000)
    const url = pageNew.url()
    expect(decodeURI(url)).toContain(expectedFilename)
    await pageNew.close()
  }
}
