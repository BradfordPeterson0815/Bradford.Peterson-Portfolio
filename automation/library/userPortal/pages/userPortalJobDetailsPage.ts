import { Locator, expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { JobDetailsPageStrings } from '../userPortalConstants.js'
import { UserPortalGlobal } from '../userPortalGlobal.js'
import { UserPortalJob } from '../userPortalJob.js'
import { UserPortalJobPage } from './userPortalJobPage.js'

export class UserPortalJobDetailsPage extends UserPortalJobPage {
  readonly Label_JobDetails_Title: Element
  readonly Label_JobDetails_JobNumber: Element
  readonly Label_JobDetails_Type: Element
  readonly Label_JobDetails_Services: Element
  readonly Label_JobDetails_Description: Element
  readonly Label_JobLocation_Title: Element
  readonly Label_JobLocation_Street: Element
  readonly Label_JobLocation_SecondaryStreet: Element
  readonly Label_JobLocation_City: Element
  readonly Label_JobLocation_County: Element
  readonly Label_JobLocation_State: Element
  readonly Label_JobLocation_ZipCode: Element
  readonly Label_YourJobTeam_Title: Element
  readonly Label_JobVisualizer_Title: Element
  readonly Label_Actions_Title: Element
  readonly Label_YourJobTeam_Coordinator: Element
  readonly Label_YourJobTeam_ProjectManager: Element
  readonly jobVisualizerEvents: Locator
  readonly Link_Actions_ViewDocuments: Element
  readonly Link_Actions_ViewMedia: Element
  readonly Link_Actions_Upload: Element
  readonly Link_Actions_ScheduleCallback: Element

  constructor(global: UserPortalGlobal, job: UserPortalJob) {
    super(global, job)
    this.URL = `${this.baseURL}/info`

    this.Label_JobDetails_Title = new Element(
      global.page,
      this.page.locator('div[id="job-process-step"] h2').nth(0),
      JobDetailsPageStrings.JobDetails_Title
    )

    this.Label_JobDetails_JobNumber = new Element(
      global.page,
      this.page
        .locator('div[id="job-process-step"] dl')
        .nth(0)
        .locator('div')
        .getByText(JobDetailsPageStrings.JobDetails_JobNumber)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobDetails.jobNumber
    )

    this.Label_JobDetails_Type = new Element(
      global.page,
      this.page
        .locator('div[id="job-process-step"] dl')
        .nth(0)
        .locator('div')
        .getByText(JobDetailsPageStrings.JobDetails_Type)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobDetails.type
    )

    this.Label_JobDetails_Services = new Element(
      global.page,
      this.page
        .locator('div[id="job-process-step"] dl')
        .nth(0)
        .locator('div')
        .getByText(JobDetailsPageStrings.JobDetails_Services, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> dd')
    )

    this.Label_JobDetails_Description = new Element(
      global.page,
      this.page
        .locator('div[id="job-process-step"] dl')
        .nth(0)
        .locator('div')
        .getByText(JobDetailsPageStrings.JobDetails_Description)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobDetails.description
    )

    this.Label_JobLocation_Title = new Element(
      global.page,
      this.page.locator('div[id="job-process-step"] h2').nth(1),
      JobDetailsPageStrings.JobLocation_Title
    )

    this.Label_JobLocation_Street = new Element(
      global.page,
      this.page
        .locator('div[id="job-process-step"] dl')
        .nth(1)
        .locator('div')
        .getByText(JobDetailsPageStrings.JobLocation_Street, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobLocation.addressLine1
    )

    this.Label_JobLocation_SecondaryStreet = new Element(
      global.page,
      this.page
        .locator('div[id="job-process-step"] dl')
        .nth(1)
        .locator('div')
        .getByText(JobDetailsPageStrings.JobLocation_SecondaryStreet, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobLocation.addressLine2
    )

    this.Label_JobLocation_City = new Element(
      global.page,
      this.page
        .locator('div[id="job-process-step"] dl')
        .nth(1)
        .locator('div')
        .getByText(JobDetailsPageStrings.JobLocation_City)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobLocation.city
    )

    this.Label_JobLocation_County = new Element(
      global.page,
      this.page
        .locator('div[id="job-process-step"] dl')
        .nth(1)
        .locator('div')
        .getByText(JobDetailsPageStrings.JobLocation_County)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobLocation.county
    )

    this.Label_JobLocation_State = new Element(
      global.page,
      this.page
        .locator('div[id="job-process-step"] dl')
        .nth(1)
        .locator('div')
        .getByText(JobDetailsPageStrings.JobLocation_State)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobLocation.state
    )

    this.Label_JobLocation_ZipCode = new Element(
      global.page,
      this.page
        .locator('div[id="job-process-step"] dl')
        .nth(1)
        .locator('div')
        .getByText(JobDetailsPageStrings.JobLocation_ZipCode)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobLocation.zipCode
    )

    this.Label_YourJobTeam_Title = new Element(
      global.page,
      this.page.locator('div[id="job-team-step_title"]'),
      JobDetailsPageStrings.YourJobTeam_Title
    )

    this.Label_YourJobTeam_Coordinator = new Element(
      global.page,
      this.page
        .locator('div[id="job-team-step_content"]')
        .getByText(JobDetailsPageStrings.YourJobTeam_Coordinator, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> span'),
      job.jobAssignments.coordinator
    )

    this.Label_YourJobTeam_ProjectManager = new Element(
      global.page,
      this.page
        .locator('div[id="job-team-step_content"]')
        .getByText(JobDetailsPageStrings.YourJobTeam_ProjectManager, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> span'),
      job.jobAssignments.projectManager
    )

    this.Label_JobVisualizer_Title = new Element(
      global.page,
      this.page.locator('div[id="job-visualizer-step_title"]'),
      JobDetailsPageStrings.JobVisualizer_Title
    )

    this.jobVisualizerEvents = this.page.locator(
      'div[id="job-visualizer-step_content"]  > div > div.chakra-stack'
    )

    this.Label_Actions_Title = new Element(
      global.page,
      this.page.locator('div[id="job-actions-step_title"]'),
      JobDetailsPageStrings.Actions_Title
    )

    this.Link_Actions_ViewDocuments = new Element(
      global.page,
      this.page.getByRole('link', {
        name: `${JobDetailsPageStrings.Link_Actions_ViewDocuments}`,
      }),
      JobDetailsPageStrings.Link_Actions_ViewDocuments
    )

    this.Link_Actions_ViewMedia = new Element(
      global.page,
      this.page.getByRole('link', { name: `${JobDetailsPageStrings.Link_Actions_ViewMedia}` }),
      JobDetailsPageStrings.Link_Actions_ViewMedia
    )

    this.Link_Actions_Upload = new Element(
      global.page,
      this.page.getByRole('link', { name: `${JobDetailsPageStrings.Link_Actions_Upload}` }),
      JobDetailsPageStrings.Link_Actions_Upload
    )

    this.Link_Actions_ScheduleCallback = new Element(
      global.page,
      this.page.getByRole('link', {
        name: `${JobDetailsPageStrings.Link_Actions_ScheduleCallback}`,
      }),
      JobDetailsPageStrings.Link_Actions_ScheduleCallback
    )
  }

  async JobVisualizerEventCount() {
    const count = await this.jobVisualizerEvents.count()
    return count
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.NavigateDirectly(this.global.baseUrl)
    } else {
      await this.leftNavBar.Link_Details.Click()
    }
    await this.WaitForLoad()
  }

  async WaitForLoad() {
    await this.page.waitForLoadState()
    await this.Label_Title.locator.waitFor({ state: 'visible' })
  }

  async VerifyJobDetailsSection() {
    await this.Label_JobDetails_Title.VerifyExpectedText()
    await this.Label_JobDetails_JobNumber.VerifyExpectedTextAlt()
    await this.Label_JobDetails_Type.VerifyExpectedTextAlt()
    await this.Label_JobDetails_Services.VerifyTextContainsEach(this.job.jobDetails.services)
    await this.Label_JobDetails_Description.VerifyExpectedTextAlt()
  }

  async VerifyJobLocationSection() {
    await this.Label_JobLocation_Title.VerifyExpectedTextAlt()
    await this.Label_JobLocation_Street.VerifyExpectedTextAlt()
    await this.Label_JobLocation_SecondaryStreet.VerifyExpectedTextAlt()
    await this.Label_JobLocation_City.VerifyExpectedTextAlt()
    await this.Label_JobLocation_County.VerifyExpectedTextAlt()
    await this.Label_JobLocation_State.VerifyExpectedTextAlt()
    await this.Label_JobLocation_ZipCode.VerifyExpectedTextAlt()
  }

  async VerifyYourJobTeamSection() {
    await this.page.waitForTimeout(1000)
    await this.Label_YourJobTeam_Title.VerifyExpectedText()
    await this.Label_YourJobTeam_Coordinator.VerifyExpectedTextAlt()
    await this.Label_YourJobTeam_ProjectManager.VerifyExpectedTextAlt()
  }

  async VerifyJobVisualizerSection() {
    await this.Label_JobVisualizer_Title.VerifyExpectedText()
    expect(await this.JobVisualizerEventCount()).toBeGreaterThanOrEqual(
      this.job.testData.jobVisualizerCount
    )
  }

  async VerifyActionsSection() {
    await this.Label_Actions_Title.VerifyExpectedText()
    await this.Link_Actions_ViewDocuments.locator.isEnabled()
    await this.Link_Actions_ViewMedia.locator.isEnabled()
    await this.Link_Actions_Upload.locator.isEnabled()
    await this.Link_Actions_ScheduleCallback.locator.isEnabled()
  }
}
