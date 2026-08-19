import { Element } from '../../shared/element.js'
import { DelegatePortalBasePage } from '../pages/delegatePortalBasePage.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalJob } from '../delegatePortalJob.js'
import { JobPhotoReportTabStrings } from '../delegatePortalConstants.js'
import { Locator } from '@playwright/test'
import { DelegatePortalPhotoReportCard, PhotoReportCardData } from '../delegatePortalPhotoReportCard.js'

export class DelegatePortalJobPhotoReportPage extends DelegatePortalBasePage {
  readonly job: DelegatePortalJob
  readonly Label_Empty_Description: Element
  readonly Button_SubmitPhotoReport: Element
  readonly Checkbox_SelectAll: Element
  readonly Button_HideUnselected: Element
  readonly Button_ShowUnselected: Element
  readonly photoReportCards: Locator
  readonly selectAllIndeterminate: Locator
  constructor(global: DelegatePortalGlobal, job: DelegatePortalJob) {
    super(global)
    this.job = job
    this.URL = `${global.baseUrl}jobs/${job.jobDetails.jobId}/photo-report`
    this.photoReportCards = this.page.locator('ul div[id^="field"]')

    this.Button_SubmitPhotoReport = new Element(
      global.page,
      this.page.locator('#photoReportForm-submit'),
      JobPhotoReportTabStrings.Button_SubmitPhotoReport
    )

    this.Checkbox_SelectAll = new Element(
      global.page,
      this.page.locator('label').filter({ hasText: 'Select All' }),
      JobPhotoReportTabStrings.Checkbox_SelectAll
    )
    this.selectAllIndeterminate = this.Checkbox_SelectAll.locator
      .locator('span[data-indeterminate]')
      .first()

    this.Button_HideUnselected = new Element(
      global.page,
      this.page.getByRole('button', { name: JobPhotoReportTabStrings.Button_HideUnselected }),
      JobPhotoReportTabStrings.Button_HideUnselected
    )

    this.Button_ShowUnselected = new Element(
      global.page,
      this.page.getByRole('button', { name: JobPhotoReportTabStrings.Button_ShowUnselected }),
      JobPhotoReportTabStrings.Button_ShowUnselected
    )

    this.Label_Empty_Description = new Element(
      global.page,
      this.page.locator('div[data-status="info"]').first(),
      JobPhotoReportTabStrings.Label_Empty_Description
    )
  }

  async NavigateDirectly(): Promise<void> {
    await super.NavigateDirectly(this.URL)
    await this.page.waitForTimeout(4000)
  }

  async IsTabEmpty() {
    const count = await this.Label_Empty_Description.locator.count()
    return count > 0
  }

  async IsSelectAllIndeterminate() {
    const count = await this.selectAllIndeterminate.count()
    return count > 0
  }

  async PhotoReportCardCount() {
    await this.page.waitForTimeout(1000)
    const count = await this.photoReportCards.count()
    return count
  }

  async PhotoReportCardSelectedCount() {
    await this.page.waitForTimeout(1000)
    const count = await this.PhotoReportCardCount()
    let selectedCount = 0
    for (let index = 0; index < count; index++) {
      const indexCard = new DelegatePortalPhotoReportCard(this.global, this.photoReportCards, index)

      if (await indexCard.checkbox_Select.isChecked()) {
        selectedCount++
      }
    }
    return selectedCount
  }

  async FetchPhotoReportCardByIndex(index: number) {
    const indexCard = new DelegatePortalPhotoReportCard(this.global, this.photoReportCards, index)
    return indexCard
  }

  async FindPhotoReportCardByFilename(targetFilename: string) {
    const cardCount = await this.PhotoReportCardCount()
    for (let index = 0; index < cardCount; index++) {
      const indexCard = new DelegatePortalPhotoReportCard(this.global, this.photoReportCards, index)

      const indexfilename = await indexCard.label_label.textContent()
      if (indexfilename === targetFilename) {
        return { index, card: indexCard }
      }
    }
    return { index: null, card: null }
  }

  async FetchPhotoReportCardByFilename(targetFilename: string) {
    const { index, card } = await this.FindPhotoReportCardByFilename(targetFilename)
    if (index === null) {
      throw new Error(`No PhotoReport Card with a filename of: ${targetFilename} is displayed`)
    }
    return { index, card }
  }

  async FindPhotoReportCard(targetCard: PhotoReportCardData, useStartsWithForDescription: boolean) {
    const cardCount = await this.PhotoReportCardCount()
    for (let index = 0; index < cardCount; index++) {
      const indexCard = new DelegatePortalPhotoReportCard(this.global, this.photoReportCards, index)
      const indexData = await indexCard.FetchCardInfo()
      const matchFilename = indexData.label === targetCard.label
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

  async VerifyAndFetchPhotoReportCard(
    targetCard: PhotoReportCardData,
    useStartsWithForDescription = false
  ) {
    const { index, card } = await this.FindPhotoReportCard(targetCard, useStartsWithForDescription)
    if (index === null) {
      throw new Error(`No PhotoReport Card matching: ${targetCard} is displayed`)
    }
    return { index, card }
  }
}
