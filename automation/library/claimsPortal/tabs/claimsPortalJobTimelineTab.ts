import { Element } from '../../shared/element.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { JobTimelineTabStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalJob } from '../claimsPortalJob.js'
import { Locator } from 'playwright/test'
import { ClaimsPortalJobTimelineNewEventTab } from './claimsPortalJobTimelineNewEventTab.js'

export class ClaimsPortalJobTimelineTab extends ClaimsPortalBasePage {
  readonly job: ClaimsPortalJob
  readonly URL: string
  readonly Title: Element
  readonly Link_RecordJobEvent: Element
  readonly timelineDateSections: Locator

  constructor(global: ClaimsPortalGlobal, job: ClaimsPortalJob, jobPageURL: string) {
    super(global)
    this.job = job
    this.URL = `${jobPageURL}/timeline`
    this.Title = new Element(
      global.page,
      this.page.locator('.chakra-card__header h2'),
      JobTimelineTabStrings.Title
    )
    this.Link_RecordJobEvent = new Element(
      global.page,
      this.page.getByRole('link', { name: `${JobTimelineTabStrings.Link_RecordJobEvent}` }),
      JobTimelineTabStrings.Link_RecordJobEvent
    )
    this.timelineDateSections = this.page.locator('.chakra-card__body > div > div')
    //this.timelineDateBadges = this.page.locator('.chakra-card__body > div > div .chakra-badge')
  }

  async OpenCreateJobTimelineEvent() {
    await this.Link_RecordJobEvent.Click()
    const eventTab = new ClaimsPortalJobTimelineNewEventTab(this.global, this.job, this.URL)
    return eventTab
  }
}
