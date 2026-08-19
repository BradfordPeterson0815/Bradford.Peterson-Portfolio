import { Element } from '../../shared/element.js'
import { Locator, expect } from '@playwright/test'
import { DelegatePortalBasePage } from '../pages/delegatePortalBasePage.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalJob } from '../delegatePortalJob.js'
import { DelegateFlavor, JobDetailsTabStrings } from '../delegatePortalConstants.js'
import { DelegatePortalCreateNoteDrawer } from '../drawers/delegatePortalCreateNoteDrawer.js'

export class DelegatePortalJobDetailsTab extends DelegatePortalBasePage {
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
  readonly Label_WorkDetails_Title: Element
  readonly Label_WorkDetails_WorkType: Element
  readonly Label_WorkDetails_TarpArea: Element
  readonly Label_WorkDetails_TimeOfService: Element
  readonly Label_WorkDetails_FastenerType: Element
  readonly Label_WorkDetails_RoofPitch: Element
  readonly Label_WorkDetails_ServiceDate: Element
  readonly Label_WorkDetails_HighRoof: Element
  readonly Label_WorkDetails_PhotoReport: Element
  readonly Label_YourJobTeam_Title: Element
  readonly Label_JobVisualizer_Title: Element
  readonly Label_Actions_Title: Element
  readonly Label_YourJobTeam_PrimaryContact: Element
  readonly Label_YourJobTeam_Coordinator: Element
  readonly Label_YourJobTeam_ProjectManager: Element
  readonly Label_YourJobTeam_Approver: Element
  readonly Label_YourJobTeam_Dispatcher: Element
  readonly Label_YourJobTeam_FieldTech: Element
  readonly Label_YourJobTeam_Subcontractor: Element
  readonly jobVisualizerEvents: Locator
  readonly Button_Actions_AddNote: Element
  readonly Link_Actions_ViewDocuments: Element
  readonly Link_Actions_ViewMedia: Element
  readonly Link_Actions_Upload: Element
  readonly Link_Actions_CreatePhotoReport: Element
  readonly job: DelegatePortalJob

  constructor(global: DelegatePortalGlobal, job: DelegatePortalJob) {
    super(global)
    this.job = job
    this.URL = `${global.baseUrl}jobs/${job.jobDetails.jobId}/info`

    this.Label_JobDetails_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"]').nth(0),
      JobDetailsTabStrings.JobDetails_Title
    )
    this.Label_JobDetails_JobNumber = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator('> dl')
        .getByText(JobDetailsTabStrings.JobDetails_JobNumber)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobDetails.jobNumber
    )
    this.Label_JobDetails_Type = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator('> dl')
        .getByText(JobDetailsTabStrings.JobDetails_Type)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobDetails.type
    )
    this.Label_JobDetails_Services = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator('> dl')
        .getByText(JobDetailsTabStrings.JobDetails_Services, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobDetails.services[0]
    )
    this.Label_JobDetails_Description = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator('> dl')
        .getByText(JobDetailsTabStrings.JobDetails_Description, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobDetails.description
    )

    this.Label_JobLocation_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"]').nth(1),
      JobDetailsTabStrings.JobLocation_Title
    )

    this.Label_JobLocation_Street = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .getByText(JobDetailsTabStrings.JobLocation_Street, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobLocation.addressLine1
    )

    this.Label_JobLocation_SecondaryStreet = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .getByText(JobDetailsTabStrings.JobLocation_SecondaryStreet, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobLocation.addressLine2
    )

    this.Label_JobLocation_City = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .getByText(JobDetailsTabStrings.JobLocation_City)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobLocation.city
    )

    this.Label_JobLocation_County = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .getByText(JobDetailsTabStrings.JobLocation_County)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobLocation.county
    )

    this.Label_JobLocation_State = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .getByText(JobDetailsTabStrings.JobLocation_State)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobLocation.state
    )

    this.Label_JobLocation_ZipCode = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .getByText(JobDetailsTabStrings.JobLocation_ZipCode)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.jobLocation.zipCode
    )

    this.Label_WorkDetails_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"]').nth(2),
      JobDetailsTabStrings.WorkDetails_Title
    )

    this.Label_WorkDetails_WorkType = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(JobDetailsTabStrings.Label_WorkType)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.workDetails.workType
    )

    this.Label_WorkDetails_TarpArea = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(JobDetailsTabStrings.Label_TarpArea)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.workDetails.tarpArea
    )
    this.Label_WorkDetails_TimeOfService = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(JobDetailsTabStrings.Label_TimeOfService)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.workDetails.timeOfService
    )
    this.Label_WorkDetails_FastenerType = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(JobDetailsTabStrings.Label_FastenerType)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.workDetails.fastenerType
    )
    this.Label_WorkDetails_RoofPitch = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(JobDetailsTabStrings.Label_RoofPitch)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.workDetails.roofPitch
    )
    this.Label_WorkDetails_ServiceDate = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(JobDetailsTabStrings.Label_ServiceDate)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      job.workDetails.serviceDate
    )
    this.Label_WorkDetails_HighRoof = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(JobDetailsTabStrings.Label_HighRoof)
        .locator('..')
        .locator('..')
        .locator('> dd')
        .locator('> svg')
        .locator('> path')
        .nth(1),
      job.workDetails.highRoof ? 'true' : 'false'
    )
    this.Label_WorkDetails_PhotoReport = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(JobDetailsTabStrings.Label_PhotoReport)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      JobDetailsTabStrings.Button_Download
    )

    this.Label_YourJobTeam_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"]').nth(3),
      JobDetailsTabStrings.YourJobTeam_Title
    )

    this.Label_YourJobTeam_PrimaryContact = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(3)
        .locator('div[id^="card_"]')
        .getByText(JobDetailsTabStrings.YourJobTeam_PrimaryContact, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> span'),
      job.jobAssignments.primaryContact
    )

    this.Label_YourJobTeam_Coordinator = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(3)
        .locator('div[id^="card_"]')
        .getByText(JobDetailsTabStrings.YourJobTeam_Coordinator, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> span'),
      job.jobAssignments.coordinator
    )

    this.Label_YourJobTeam_ProjectManager = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(3)
        .locator('div[id^="card_"]')
        .getByText(JobDetailsTabStrings.YourJobTeam_ProjectManager, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> span'),
      job.jobAssignments.projectManager
    )

    this.Label_YourJobTeam_Approver = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(3)
        .locator('div[id^="card_"]')
        .getByText(JobDetailsTabStrings.YourJobTeam_Approver, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> span'),
      job.jobAssignments.approver
    )

    this.Label_YourJobTeam_Dispatcher = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(3)
        .locator('div[id^="card_"]')
        .getByText(JobDetailsTabStrings.YourJobTeam_Dispatcher, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> span'),
      job.jobAssignments.dispatcher
    )

    this.Label_YourJobTeam_FieldTech = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(3)
        .locator('div[id^="card_"]')
        .getByText(JobDetailsTabStrings.YourJobTeam_FieldTech, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> span'),
      job.jobAssignments.fieldTechs.length == 0
        ? 'Unassigned'
        : job.jobAssignments.fieldTechs[0]
    )

    this.Label_YourJobTeam_Subcontractor = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(3)
        .locator('div[id^="card_"]')
        .getByText(JobDetailsTabStrings.YourJobTeam_Subcontractor, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> span'),
      job.jobAssignments.subcontractors.length == 0
        ? 'Unassigned'
        : job.jobAssignments.subcontractors[0]
    )
    this.Label_Actions_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"]').nth(4),
      JobDetailsTabStrings.Actions_Title
    )

    this.Button_Actions_AddNote = new Element(
      global.page,
      this.page.getByRole('button', { name: `${JobDetailsTabStrings.Button_Actions_AddANote}` }),
      JobDetailsTabStrings.Button_Actions_AddANote
    )

    this.Link_Actions_ViewDocuments = new Element(
      global.page,
      this.page.getByRole('link', { name: `${JobDetailsTabStrings.Link_Actions_ViewDocuments}` }),
      JobDetailsTabStrings.Link_Actions_ViewDocuments
    )

    this.Link_Actions_ViewMedia = new Element(
      global.page,
      this.page.getByRole('link', { name: `${JobDetailsTabStrings.Link_Actions_ViewMedia}` }),
      JobDetailsTabStrings.Link_Actions_ViewMedia
    )

    this.Link_Actions_Upload = new Element(
      global.page,
      this.page.getByRole('link', { name: `${JobDetailsTabStrings.Link_Actions_Upload}` }),
      JobDetailsTabStrings.Link_Actions_Upload
    )

    this.Link_Actions_CreatePhotoReport = new Element(
      global.page,
      this.page.getByRole('link', {
        name: `${JobDetailsTabStrings.Link_Actions_CreatePhotoReport}`,
      }),
      JobDetailsTabStrings.Link_Actions_CreatePhotoReport
    )

    this.Label_JobVisualizer_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"]').nth(5),
      JobDetailsTabStrings.JobVisualizer_Title
    )

    this.jobVisualizerEvents = this.page
      .locator('div[id$="_title"]')
      .nth(5)
      .locator('..')
      .locator('div[id$="_content"] > div > div.chakra-stack')
  }

  async JobVisualizerEventCount() {
    const count = await this.jobVisualizerEvents.count()
    return count
  }

  async NavigateDirectlyToTab() {
    await this.NavigateDirectly(this.global.baseUrl)
    await this.WaitForLoad()
  }

  async WaitForLoad() {
    await this.page.waitForLoadState()
    // if (this.global.isMobile) {
    // }
    await this.Label_JobDetails_Title.locator.waitFor({ state: 'visible' })
  }

  async VerifyJobDetailsSection() {
    await this.Label_JobDetails_Title.VerifyExpectedText()
    await this.Label_JobDetails_JobNumber.VerifyExpectedTextAlt()
    await this.Label_JobDetails_Type.VerifyExpectedTextAlt()
    await this.Label_JobDetails_Services.VerifyExpectedTextAlt()
    await this.Label_JobDetails_Description.VerifyExpectedTextAlt()
    const actualText = await this.Label_JobDetails_Description.locator.textContent() // description may have stuff appended, so use starts with
    expect(actualText?.startsWith(this.Label_JobDetails_Description.expectedText)).toBe(true)
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

  async VerifyWorkDetailsSection() {
    await this.Label_WorkDetails_Title.VerifyExpectedText()
    if (this.job.workDetails.workType === '') {
      // // if no details have been recorded yet, we see different UI
      // await expect(this.Label_NoWorkDetails_Title.locator).toBeAttached({
      //   attached: true,
      // })
      // await this.Label_NoWorkDetails_Title.VerifyExpectedTextAlt()
      // await this.Label_NoWorkDetails_Description.VerifyExpectedTextAlt()
      // await expect(this.Button_NoWorkDetails_RecordWorkDetails.locator).toBeAttached({
      //   attached: true,
      // })
    } else {
      await this.Label_WorkDetails_WorkType.VerifyExpectedTextAlt()
      await this.Label_WorkDetails_TarpArea.VerifyExpectedTextAlt()
      await this.Label_WorkDetails_TimeOfService.VerifyExpectedTextAlt()
      await this.Label_WorkDetails_FastenerType.VerifyExpectedTextAlt()
      await this.Label_WorkDetails_RoofPitch.VerifyExpectedTextAlt()
      const icon = await this.Label_WorkDetails_HighRoof.locator.getAttribute('d')
      if (this.Label_WorkDetails_HighRoof.expectedText == 'true') {
        expect(icon?.startsWith('M9')).toBe(true) // check mark
      } else {
        expect(icon?.startsWith('M19')).toBe(true) // X
      }
    }
  }

  async VerifyYourJobTeamSection() {
    await this.Label_YourJobTeam_Title.VerifyExpectedText()
    switch (this.global.flavor) {
      case DelegateFlavor.Subcontractor:
        await this.Label_YourJobTeam_Coordinator.VerifyExpectedTextAlt()
        await this.Label_YourJobTeam_ProjectManager.VerifyExpectedTextAlt()
        break
      case DelegateFlavor.FieldTech:
        await this.Label_YourJobTeam_PrimaryContact.VerifyExpectedTextAlt()
        await this.Label_YourJobTeam_Coordinator.VerifyExpectedTextAlt()
        await this.Label_YourJobTeam_ProjectManager.VerifyExpectedTextAlt()
        await this.Label_YourJobTeam_Approver.VerifyExpectedTextAlt()
        await this.Label_YourJobTeam_Dispatcher.VerifyExpectedTextAlt()
        await this.Label_YourJobTeam_FieldTech.VerifyExpectedTextAlt()
        await this.Label_YourJobTeam_Subcontractor.VerifyExpectedTextAlt()
    }
  }

  async VerifyActionsSection() {
    await this.Button_Actions_AddNote.locator.isEnabled()
    await this.Label_Actions_Title.VerifyExpectedText()
    await this.Link_Actions_ViewDocuments.locator.isEnabled()
    await this.Link_Actions_ViewMedia.locator.isEnabled()
    await this.Link_Actions_Upload.locator.isEnabled()
    await this.Link_Actions_CreatePhotoReport.locator.isEnabled()
  }

  async VerifyJobVisualizerSection() {
    await this.Label_JobVisualizer_Title.VerifyExpectedText()
    expect(await this.JobVisualizerEventCount()).toBeGreaterThanOrEqual(
      this.job.testData.jobVisualizerCount
    )
  }

  async OpenCreateNoteDrawer() {
    await this.Button_Actions_AddNote.Click()
    const createNoteDrawer = new DelegatePortalCreateNoteDrawer(this.global)
    await expect(createNoteDrawer.Title.locator).toBeAttached()
    return createNoteDrawer
  }
}
