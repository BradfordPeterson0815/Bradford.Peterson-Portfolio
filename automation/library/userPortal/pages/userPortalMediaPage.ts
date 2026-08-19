import { MediaPageStrings } from '../userPortalConstants.js'
import { Locator } from '@playwright/test'
import { UserPortalGlobal } from '../userPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { MediaCardData, UserPortalMediaCard } from '../userPortalMediaCard.js'

export class UserPortalMediaPage {
  readonly Title: Element
  readonly Link_UploadMedia: Element
  readonly mediaCards: Locator
  readonly Label_Empty_Title: Element
  readonly Label_Empty_Description: Element
  readonly Link_Empty_UploadMedia: Element
  readonly global: UserPortalGlobal

  constructor(global: UserPortalGlobal) {
    this.global = global
    this.Title = new Element(
      global.page,
      global.page
        .locator('#entity-media-step')
        .locator('> div')
        .nth(0)
        .getByRole('heading', { name: `${MediaPageStrings.Title}`, exact: true }),
      MediaPageStrings.Title
    )

    this.Link_UploadMedia = new Element(
      global.page,
      global.page
        .locator('#entity-media-step')
        .locator('> div')
        .nth(0)
        .getByRole('link', { name: `${MediaPageStrings.Link_UploadMedia}` }),
      MediaPageStrings.Link_UploadMedia
    )

    this.mediaCards = global.page.locator('div.chakra-card')

    this.Label_Empty_Title = new Element(
      global.page,
      global.page
        .locator('#entity-media-step')
        .locator('> div')
        .nth(1)
        .getByRole('heading', { name: `${MediaPageStrings.Label_Empty_Title}`, exact: true }),
      MediaPageStrings.Label_Empty_Title
    )

    this.Label_Empty_Description = new Element(
      global.page,
      global.page.locator('#entity-media-step').locator('> div').nth(1).locator('p'),
      MediaPageStrings.Label_Empty_Description
    )

    this.Link_Empty_UploadMedia = new Element(
      global.page,
      global.page
        .locator('#entity-media-step')
        .locator('> div')
        .nth(1)
        .getByRole('link', { name: `${MediaPageStrings.Link_UploadMedia}` }),
      MediaPageStrings.Link_UploadMedia
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async IsMediaPageEmpty() {
    const count = await this.Label_Empty_Title.locator.count()
    return count > 0
  }

  async MediaCardCount() {
    const count = await this.mediaCards.count()
    return count
  }

  async FindMediaCardByFilename(targetFilename: string) {
    const cardCount = await this.MediaCardCount()
    for (let index = 0; index < cardCount; index++) {
      const indexCard = new UserPortalMediaCard(this.global, index)
      const indexfilename = await indexCard.filenameLocator.textContent()
      if (indexfilename === targetFilename) {
        return { index, card: indexCard }
      }
    }
    return { index: null, card: null }
  }

  async FetchMediaCardByFilename(targetFilename: string) {
    const { index, card } = await this.FindMediaCardByFilename(targetFilename)
    if (index === null) {
      throw new Error(`No Media Card with a filename of: ${targetFilename} is displayed`)
    }
    return { index, card }
  }

  async FindMediaCard(targetCard: MediaCardData, useStartsWithForDescription: boolean) {
    const cardCount = await this.MediaCardCount()
    for (let index = 0; index < cardCount; index++) {
      const indexCard = new UserPortalMediaCard(this.global, index)
      const indexData = await indexCard.GetData()
      const matchFilename = indexData.filename === targetCard.filename
      const matchTitle = indexData.title === targetCard.title
      const matchDescription = useStartsWithForDescription
        ? indexData.description.startsWith(targetCard.description)
        : indexData.description === targetCard.description
      if (matchFilename && matchTitle && matchDescription) {
        return { index, card: indexCard }
      }
    }
    return { index: null, card: null }
  }

  async VerifyAndFetchMediaCard(targetCard: MediaCardData, useStartsWithForDescription = false) {
    const { index, card } = await this.FindMediaCard(targetCard, useStartsWithForDescription)
    if (index === null) {
      throw new Error(`No Media Card matching: ${targetCard} is displayed`)
    }
    return { index, card }
  }
}
