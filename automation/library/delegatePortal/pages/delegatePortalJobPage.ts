import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DelegatePortalBasePage } from './delegatePortalBasePage.js'
import { DelegatePortalJob } from '../delegatePortalJob.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { JobPageStrings, JobTabTypes } from '../delegatePortalConstants.js'
import { DelegatePortalJobDetailsTab } from '../tabs/delegatePortalJobDetailsTab.js'
import { DelegatePortalJobDocumentsTab } from '../tabs/delegatePortalJobDocumentsTab.js'
import { DelegatePortalJobMediaTab } from '../tabs/delegatePortalJobMediaTab.js'
import { DelegatePortalJobNotesTab } from '../tabs/delegatePortalJobNotesTab.js'

export class DelegatePortalJobPage extends DelegatePortalBasePage {
  readonly jobHeaderParent: Locator
  readonly contactParent: Locator
  readonly job: DelegatePortalJob
  readonly baseURL: string
  readonly Title: Element
  readonly Link_Jobs: Element
  readonly Label_PrimaryContact_Name: Element
  readonly Link_PrimaryContact_Phone: Element
  readonly Link_PrimaryContact_Email: Element
  readonly Link_PrimaryContact_Address: Element

  constructor(global: DelegatePortalGlobal, job: DelegatePortalJob) {
    super(global)
    this.job = job
    this.jobHeaderParent = this.page.locator('#root div.chakra-container > div')
    this.contactParent = this.jobHeaderParent.locator('> div:nth-child(2) > div > div:nth-child(2)')
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${this.job.jobDetails.jobNumber}` }),
      this.job.jobDetails.jobNumber
    )
    this.baseURL = `${global.baseUrl}jobs/${this.job.jobDetails.jobId}`
    this.Link_Jobs = new Element(
      global.page,
      this.jobHeaderParent.locator('div > button').nth(0),
      JobPageStrings.Link_Jobs
    )
    this.Label_PrimaryContact_Name = new Element(global.page, this.contactParent.locator('> p'))
    this.Link_PrimaryContact_Phone = new Element(
      global.page,
      this.contactParent.locator('> div > a').nth(0)
    )
    this.Link_PrimaryContact_Email = new Element(
      global.page,
      this.contactParent.locator('> div > a').nth(1)
    )
    this.Link_PrimaryContact_Address = new Element(
      global.page,
      this.contactParent.locator('> div > a').nth(2)
    )
  }

  async IsTabActive(jobTab: JobTabTypes) {
    await this.page.waitForTimeout(1000)
    const targetId = this.LookupJobTabId(jobTab)
    const result = (await this.page.locator(targetId).getAttribute('aria-selected')) == 'true'
    return result
  }

  LookupJobTabId(jobTab: JobTabTypes) {
    const baseTabLocator = 'data-id="/_auth/jobs/$jobId/_layout'
    switch (jobTab) {
      case JobTabTypes.Details:
        return `a[${baseTabLocator}/info"]`
      case JobTabTypes.Documents:
        return `a[${baseTabLocator}/documents"]`
      case JobTabTypes.Media:
        return `a[${baseTabLocator}/media"]`
      case JobTabTypes.Notes:
        return `a[${baseTabLocator}/notes"]`
      default:
        throw new Error(`Undefined Job Tab type : ${jobTab}`)
    }
  }

  async SelectJobTab(jobTab: JobTabTypes) {
    const targetId = this.LookupJobTabId(jobTab)
    let tabToReturn
    let locatorToWaitFor: Locator = this.Link_Jobs.locator
    await this.page.locator(targetId).click()
    await this.page.waitForTimeout(1000)
    switch (jobTab) {
      case JobTabTypes.Details:
        tabToReturn = new DelegatePortalJobDetailsTab(this.global, this.job)
        locatorToWaitFor = tabToReturn.Label_JobDetails_Title.locator
        break
      case JobTabTypes.Documents:
        tabToReturn = new DelegatePortalJobDocumentsTab(this.global, this.job)
        locatorToWaitFor = tabToReturn.Link_CreatePhotoReport.locator
        break
      case JobTabTypes.Media:
        tabToReturn = new DelegatePortalJobMediaTab(this.global, this.job)
        locatorToWaitFor = tabToReturn.content
        break
      case JobTabTypes.Notes:
        tabToReturn = new DelegatePortalJobNotesTab(this.global, this.job)
        locatorToWaitFor = tabToReturn.Button_AddNote.locator
        break
      default:
        throw new Error(`Undefined Job Tab type : ${jobTab}`)
    }
    await this.page.locator(targetId).getAttribute('aria-selected', { timeout: 3000 })
    await locatorToWaitFor.waitFor({ state: 'visible' })
    await this.page.waitForTimeout(1000)
    return tabToReturn
  }

  async NavigateDirectlyToJob() {
    await this.page.goto(this.baseURL)
    await this.page.waitForURL(this.baseURL)
  }
}
