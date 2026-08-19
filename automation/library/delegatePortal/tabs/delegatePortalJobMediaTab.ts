import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DelegatePortalBasePage } from '../pages/delegatePortalBasePage.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalJob } from '../delegatePortalJob.js'
import { JobMediaTabStrings } from '../delegatePortalConstants.js'
import { DelegatePortalMediaCard, MediaCardData } from '../delegatePortalMediaCard.js'

export class DelegatePortalJobMediaTab extends DelegatePortalBasePage {
  readonly Title: Element
  readonly Link_CreatePhotoReport: Element
  readonly Link_UploadMedia: Element
  readonly Link_Empty_UploadMedia: Element
  readonly Label_Empty_Title: Element
  readonly Label_Empty_Description: Element
  readonly job: DelegatePortalJob
  readonly content: Locator
  readonly mediaCards: Locator

  constructor(global: DelegatePortalGlobal, job: DelegatePortalJob) {
    super(global)
    this.job = job
    this.URL = `${global.baseUrl}jobs/${job.jobDetails.jobId}/media`
    this.content = this.page.locator('#root div[id$="_body"]')
    this.mediaCards = this.page.locator('div.chakra-card')

    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: JobMediaTabStrings.Title, exact: true }),
      JobMediaTabStrings.Title
    )

    this.Link_CreatePhotoReport = new Element(
      global.page,
      this.page.getByRole('link', { name: JobMediaTabStrings.Link_CreatePhotoReport }),
      JobMediaTabStrings.Link_CreatePhotoReport
    )

    this.Link_UploadMedia = new Element(
      global.page,
      this.page.getByRole('link', { name: JobMediaTabStrings.Link_UploadMedia }).nth(0),
      JobMediaTabStrings.Link_UploadMedia
    )

    this.Label_Empty_Title = new Element(
      global.page,
      this.page.getByRole('heading', {
        name: JobMediaTabStrings.Label_Empty_Title,
        exact: true,
      }),
      JobMediaTabStrings.Label_Empty_Title
    )

    this.Label_Empty_Description = new Element(
      global.page,
      this.page.locator('#root div[id$="_content"] > div > div > div > div > p'),
      JobMediaTabStrings.Label_Empty_Description
    )

    this.Link_Empty_UploadMedia = new Element(
      global.page,
      this.page.getByRole('link', { name: JobMediaTabStrings.Link_UploadMedia }).nth(1),
      JobMediaTabStrings.Link_UploadMedia
    )
  }

  async IsTabEmpty() {
    const count = await this.Label_Empty_Title.locator.count()
    return count > 0
  }

  async NavigateDirectlyToTab() {
    await this.NavigateDirectly(this.global.baseUrl)
    await this.WaitForLoad()
  }

  async MediaCardCount() {
    const count = await this.mediaCards.count()
    return count
  }

  async FindMediaCardByFilename(targetFilename: string) {
    const cardCount = await this.MediaCardCount()
    for (let index = 0; index < cardCount; index++) {
      const indexCard = new DelegatePortalMediaCard(this.global, index)
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
      const indexCard = new DelegatePortalMediaCard(this.global, index)
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
