import { expect } from '@playwright/test'
import test from '../../library/shared/testHooks.js'
import { FetchCannedJob, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import {
  DefaultEnvironment,
  CannedJobTypes,
  JobTabTypes,
  CreateJobTimelineEventSelectionOptions,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { ClaimsPortalJobPage } from '../../library/claimsPortal/pages/claimsPortalJobPage.js'
import { ClaimsPortalJobInfoTab } from '../../library/claimsPortal/tabs/claimsPortalJobInfoTab.js'
import { Tags } from '../../library/shared/constants.js'
import { ClaimsPortalJobsPage } from '../../library/claimsPortal/pages/claimsPortalJobsPage.js'

const environment = DefaultEnvironment

test.describe(
  'Job Page: Timeline Tab',
  {
    tag: [Tags.ClaimsPortal, Tags.Job, Tags.Timeline],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P2] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // find a random job and go to it
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const { jobPage } = await jobsPage.OpenRandomJob()
      // Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      //Verify that clicking on View Full Timeline navigates us to the timeline page
      const timelineTab = await infoTab.OpenFullTimeline()
      expect(timelineTab.page.url().endsWith('/timeline')).toBe(true)

      // Verify Title
      await timelineTab.Title.VerifyExpectedText()

      // Verify basic UI elements
      await expect(timelineTab.Link_RecordJobEvent.locator).toBeAttached()
    })

    test('Verify Navigation and Initial UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      //Verify that clicking on View Full Timeline navigates us to the timeline page
      const timelineTab = await infoTab.OpenFullTimeline()
      expect(timelineTab.page.url().endsWith('/timeline')).toBe(true)

      // Verify Title
      await timelineTab.Title.VerifyExpectedText()

      // Verify basic UI elements
      await expect(timelineTab.Link_RecordJobEvent.locator).toBeAttached()
      const dateSections = await timelineTab.timelineDateSections.count()
      expect(dateSections).toBeGreaterThanOrEqual(testJob.testData.jobTimelineDateCount)
    })

    test('Record Deposit Paid Event - Verify/Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const event = CreateJobTimelineEventSelectionOptions.DepositPaid

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      //Verify that clicking on View Full Timeline navigates us to the timeline page
      const timelineTab = await infoTab.OpenFullTimeline()

      // open new Event tab
      const eventTab = await timelineTab.OpenCreateJobTimelineEvent()
      await eventTab.Title.VerifyExpectedText()

      // Validate no selection
      await eventTab.Button_SelectEvent_Next.Click()
      await eventTab.ValidateEventSelection()

      // Select DepositPaid Event
      await eventTab.SelectJobTimelineEvent(event)
      await eventTab.VerifyEventTitle(event)

      // Click Next
      // Validate expected fields appear
      await eventTab.Button_SelectEvent_Next.Click()
      await expect(eventTab.ComboBox_EventInfo_PaidBy.locator).toBeAttached()
      await expect(eventTab.TextBox_EventInfo_PaidDate.locator).toBeAttached()
      await expect(eventTab.CheckBox_EventInfo_PaidInFull.locator).toBeAttached()
      await expect(eventTab.ListBox_EventInfo_ExternalIdType.locator).toBeAttached()
      await expect(eventTab.TextBox_EventInfo_ExternalId.locator).toBeAttached()

      // Validate
      await eventTab.Button_EventInfo_Submit.Click()
      expect(await eventTab.ValidateDepositPaid()).toBe(true)

      // Click Back to return to the event selection step
      await eventTab.Button_EventInfo_Back.Click()
      await eventTab.VerifyEventTitle(event)
    })

    test('Record Deposit Override Approved Event - Verify/Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const event = CreateJobTimelineEventSelectionOptions.DepositOverrideApproved

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      //Verify that clicking on View Full Timeline navigates us to the timeline page
      const timelineTab = await infoTab.OpenFullTimeline()

      // open new Event tab
      const eventTab = await timelineTab.OpenCreateJobTimelineEvent()
      await eventTab.Title.VerifyExpectedText()

      // Validate no selection
      await eventTab.Button_SelectEvent_Next.Click()
      await eventTab.ValidateEventSelection()

      // Select DepositOverrideApproved Event
      await eventTab.SelectJobTimelineEvent(event)
      await eventTab.VerifyEventTitle(event)

      // Click Next
      // Validate expected fields appear
      await eventTab.Button_SelectEvent_Next.Click()
      await expect(eventTab.ListBox_EventInfo_ApprovedBy.locator).toBeAttached()
      await expect(eventTab.TextBox_EventInfo_ApprovedDate.locator).toBeAttached()
      await expect(eventTab.ListBox_EventInfo_ExternalIdType.locator).toBeAttached()
      await expect(eventTab.TextBox_EventInfo_ExternalId.locator).toBeAttached()

      // Validate
      await eventTab.Button_EventInfo_Submit.Click()
      expect(await eventTab.ValidateDepositOverrideApproved()).toBe(true)

      // Click Back to return to the event selection step
      await eventTab.Button_EventInfo_Back.Click()
      await eventTab.VerifyEventTitle(event)
    })

    test('Record Carrier Invoiced Event - Verify/Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const event = CreateJobTimelineEventSelectionOptions.CarrierInvoiced

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      //Verify that clicking on View Full Timeline navigates us to the timeline page
      const timelineTab = await infoTab.OpenFullTimeline()

      // open new Event tab
      const eventTab = await timelineTab.OpenCreateJobTimelineEvent()
      await eventTab.Title.VerifyExpectedText()

      // Validate no selection
      await eventTab.Button_SelectEvent_Next.Click()
      await eventTab.ValidateEventSelection()

      // Select CarrierInvoiced Event
      await eventTab.SelectJobTimelineEvent(event)
      await eventTab.VerifyEventTitle(event)

      // Click Next
      // Validate expected fields appear
      await eventTab.Button_SelectEvent_Next.Click()
      await expect(eventTab.ComboBox_EventInfo_Carrier.locator).toBeAttached()
      await expect(eventTab.TextBox_EventInfo_InvoicedDate.locator).toBeAttached()
      await expect(eventTab.TextArea_EventInfo_Notes.locator).toBeAttached()
      await expect(eventTab.ListBox_EventInfo_ExternalIdType.locator).toBeAttached()
      await expect(eventTab.TextBox_EventInfo_ExternalId.locator).toBeAttached()

      // Validate
      await eventTab.Button_EventInfo_Submit.Click()
      expect(await eventTab.ValidateCarrierInvoiced()).toBe(true)

      // Click Back to return to the event selection step
      await eventTab.Button_EventInfo_Back.Click()
      await eventTab.VerifyEventTitle(event)
    })

    test('Record Carrier Made Payment Event - Verify/Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const event = CreateJobTimelineEventSelectionOptions.CarrierMadePayment

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      //Verify that clicking on View Full Timeline navigates us to the timeline page
      const timelineTab = await infoTab.OpenFullTimeline()

      // open new Event tab
      const eventTab = await timelineTab.OpenCreateJobTimelineEvent()
      await eventTab.Title.VerifyExpectedText()

      // Validate no selection
      await eventTab.Button_SelectEvent_Next.Click()
      await eventTab.ValidateEventSelection()

      // Select CarrierMadePayment Event
      await eventTab.SelectJobTimelineEvent(event)
      await eventTab.VerifyEventTitle(event)

      // Click Next
      // Validate expected fields appear
      await eventTab.Button_SelectEvent_Next.Click()
      await expect(eventTab.ComboBox_EventInfo_CarrierWhoPaid.locator).toBeAttached()
      await expect(eventTab.TextBox_EventInfo_PaidDate.locator).toBeAttached()
      await expect(eventTab.CheckBox_EventInfo_PaidInFull.locator).toBeAttached()
      await expect(eventTab.ListBox_EventInfo_ExternalIdType.locator).toBeAttached()
      await expect(eventTab.TextBox_EventInfo_ExternalId.locator).toBeAttached()

      // Validate
      await eventTab.Button_EventInfo_Submit.Click()
      expect(await eventTab.ValidateCarrierPaymentReceived()).toBe(true)

      // Click Back to return to the event selection step
      await eventTab.Button_EventInfo_Back.Click()
      await eventTab.VerifyEventTitle(event)
    })

    test('Record Bill Sent To Collections Event - Verify/Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const event = CreateJobTimelineEventSelectionOptions.BillSentToCollections

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      //Verify that clicking on View Full Timeline navigates us to the timeline page
      const timelineTab = await infoTab.OpenFullTimeline()

      // open new Event tab
      const eventTab = await timelineTab.OpenCreateJobTimelineEvent()
      await eventTab.Title.VerifyExpectedText()

      // Validate no selection
      await eventTab.Button_SelectEvent_Next.Click()
      await eventTab.ValidateEventSelection()

      // Select BillSentToCollections Event
      await eventTab.SelectJobTimelineEvent(event)
      await eventTab.VerifyEventTitle(event)

      // Click Next
      // Validate expected fields appear
      await eventTab.Button_SelectEvent_Next.Click()
      await expect(eventTab.TextBox_EventInfo_SentDate.locator).toBeAttached()
      await expect(eventTab.TextBox_EventInfo_CollectorName.locator).toBeAttached()
      await expect(eventTab.ListBox_EventInfo_ExternalIdType.locator).toBeAttached()
      await expect(eventTab.TextBox_EventInfo_ExternalId.locator).toBeAttached()

      // Validate
      await eventTab.Button_EventInfo_Submit.Click()
      expect(await eventTab.ValidateBillSentToCollections()).toBe(true)

      // Click Back to return to the event selection step
      await eventTab.Button_EventInfo_Back.Click()
      await eventTab.VerifyEventTitle(event)
    })

    test('Record Subcontractor Document Issued Event - Verify/Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const event = CreateJobTimelineEventSelectionOptions.SubcontractorDocumentIssued

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      //Verify that clicking on View Full Timeline navigates us to the timeline page
      const timelineTab = await infoTab.OpenFullTimeline()

      // open new Event tab
      const eventTab = await timelineTab.OpenCreateJobTimelineEvent()
      await eventTab.Title.VerifyExpectedText()

      // Validate no selection
      await eventTab.Button_SelectEvent_Next.Click()
      await eventTab.ValidateEventSelection()

      // Select SubcontractorDocumentIssued Event
      await eventTab.SelectJobTimelineEvent(event)
      await eventTab.VerifyEventTitle(event)

      // Click Next
      // Validate expected fields appear
      await eventTab.Button_SelectEvent_Next.Click()
      await expect(eventTab.ComboBox_EventInfo_Subcontractors.locator).toBeAttached()
      await expect(eventTab.CheckBox_EventInfo_Invoice.locator).toBeAttached()
      await expect(eventTab.CheckBox_EventInfo_PhotoReport.locator).toBeAttached()
      await expect(eventTab.TextBox_EventInfo_IssuedDate.locator).toBeAttached()
      await expect(eventTab.ListBox_EventInfo_IssuedMethod.locator).toBeAttached()
      await expect(eventTab.ListBox_EventInfo_ExternalIdType.locator).toBeAttached()
      await expect(eventTab.TextBox_EventInfo_ExternalId.locator).toBeAttached()

      // Validate
      await eventTab.Button_EventInfo_Submit.Click()
      expect(await eventTab.ValidateSubcontractorDocumentIssued()).toBe(true)

      // Click Back to return to the event selection step
      await eventTab.Button_EventInfo_Back.Click()
      await eventTab.VerifyEventTitle(event)
    })

    test('Record Subcontractor Document Received Event - Verify/Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const event = CreateJobTimelineEventSelectionOptions.SubcontractorDocumentReceived

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      //Verify that clicking on View Full Timeline navigates us to the timeline page
      const timelineTab = await infoTab.OpenFullTimeline()

      // open new Event tab
      const eventTab = await timelineTab.OpenCreateJobTimelineEvent()
      await eventTab.Title.VerifyExpectedText()

      // Validate no selection
      await eventTab.Button_SelectEvent_Next.Click()
      await eventTab.ValidateEventSelection()

      // Select SubcontractorDocumentReceived Event
      await eventTab.SelectJobTimelineEvent(event)
      await eventTab.VerifyEventTitle(event)

      // Click Next
      // Validate expected fields appear
      await eventTab.Button_SelectEvent_Next.Click()
      await expect(eventTab.ComboBox_EventInfo_Subcontractors.locator).toBeAttached()
      await expect(eventTab.CheckBox_EventInfo_Invoice.locator).toBeAttached()
      await expect(eventTab.CheckBox_EventInfo_PhotoReport.locator).toBeAttached()
      await expect(eventTab.TextBox_EventInfo_ReceivedDate.locator).toBeAttached()
      await expect(eventTab.ListBox_EventInfo_ReceivedMethod.locator).toBeAttached()
      await expect(eventTab.TextBox_EventInfo_IssuedDate.locator).toBeAttached()
      await expect(eventTab.ListBox_EventInfo_IssuedMethod.locator).toBeAttached()
      await expect(eventTab.ListBox_EventInfo_ExternalIdType.locator).toBeAttached()
      await expect(eventTab.TextBox_EventInfo_ExternalId.locator).toBeAttached()

      // Validate
      await eventTab.Button_EventInfo_Submit.Click()
      expect(await eventTab.ValidateSubcontractorDocumentReceived()).toBe(true)

      // Click Back to return to the event selection step
      await eventTab.Button_EventInfo_Back.Click()
      await eventTab.VerifyEventTitle(event)
    })

    test('Record Subcontractor Paid Event - Verify/Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const event = CreateJobTimelineEventSelectionOptions.SubcontractorPaid

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      //Verify that clicking on View Full Timeline navigates us to the timeline page
      const timelineTab = await infoTab.OpenFullTimeline()

      // open new Event tab
      const eventTab = await timelineTab.OpenCreateJobTimelineEvent()
      await eventTab.Title.VerifyExpectedText()

      // Validate no selection
      await eventTab.Button_SelectEvent_Next.Click()
      await eventTab.ValidateEventSelection()

      // Select SubcontractorPaid Event
      await eventTab.SelectJobTimelineEvent(event)
      await eventTab.VerifyEventTitle(event)

      // Click Next
      // Validate expected fields appear
      await eventTab.Button_SelectEvent_Next.Click()
      await expect(eventTab.ComboBox_EventInfo_Subcontractors.locator).toBeAttached()
      await expect(eventTab.TextBox_EventInfo_PaidDate.locator).toBeAttached()
      await expect(eventTab.CheckBox_EventInfo_PaidInFull.locator).toBeAttached()
      await expect(eventTab.ListBox_EventInfo_ExternalIdType.locator).toBeAttached()
      await expect(eventTab.TextBox_EventInfo_ExternalId.locator).toBeAttached()

      // Validate
      await eventTab.Button_EventInfo_Submit.Click()
      expect(await eventTab.ValidateSubcontractorPaid()).toBe(true)

      // Click Back to return to the event selection step
      await eventTab.Button_EventInfo_Back.Click()
      await eventTab.VerifyEventTitle(event)
    })
  }
)
