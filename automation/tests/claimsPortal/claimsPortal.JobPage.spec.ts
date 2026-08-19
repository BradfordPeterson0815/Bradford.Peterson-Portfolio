import { expect } from '@playwright/test'
import {
  CannedJobTypes,
  DataTable_Columns_Type,
  DefaultEnvironment,
  JobPageStrings,
  JobTabTypes,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedJob, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalJobPage } from '../../library/claimsPortal/pages/claimsPortalJobPage.js'
import { ClaimsPortalJobsPage } from '../../library/claimsPortal/pages/claimsPortalJobsPage.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'

const environment = DefaultEnvironment

test.describe(
  'Job Page',
  {
    tag: [Tags.ClaimsPortal, Tags.Job],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      test.slow()
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // find a random job and go to it
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const { jobPage } = await jobsPage.OpenRandomJob()

      // Verify that we land on the Job page for that job, defaulting to the Info section
      const InfoTab = await jobPage.SelectJobTab(JobTabTypes.Info)
      expect(await jobPage.IsTabActive(JobTabTypes.Info)).toBe(true)
      expect(jobPage.page.url()).toBe(InfoTab.URL)

      // Verify that the all jobs link is displayed (top left)
      expect(await jobPage.Link_AllJobs.IsVisible()).toBe(true)

      // Verify the job number for this job is displayed on the top left, with a (JOB) label
      await jobPage.Title.VerifyExpectedText()

      // Verify that the Actions button is displayed (top right)
      expect(await jobPage.Button_Actions.IsVisible()).toBe(true)

      // Select Portal Access section link- verify the Portal Access section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.PortalAccess)
      expect(await jobPage.IsTabActive(JobTabTypes.PortalAccess)).toBe(true)

      // Select Contacts section link- verify the Contacts section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Contacts)
      expect(await jobPage.IsTabActive(JobTabTypes.Contacts)).toBe(true)

      // Select Billing section link- verify the Billing section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Billing)
      expect(await jobPage.IsTabActive(JobTabTypes.Billing)).toBe(true)

      // Select Work Authorizations section link- verify the Work Authorizations section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.WorkAuthorizations)
      expect(await jobPage.IsTabActive(JobTabTypes.WorkAuthorizations)).toBe(true)

      // Select Appointments section link- verify the Appointments section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Appointments)
      expect(await jobPage.IsTabActive(JobTabTypes.Appointments)).toBe(true)

      // Select Documents section link- verify the Documents section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Documents)
      expect(await jobPage.IsTabActive(JobTabTypes.Documents)).toBe(true)

      // Select Media section link- verify the Media section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Media)
      expect(await jobPage.IsTabActive(JobTabTypes.Media)).toBe(true)

      // Select Notes section link- verify the Notes section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Notes)
      expect(await jobPage.IsTabActive(JobTabTypes.Notes)).toBe(true)

      // Select Callback Requests section link- verify the Callback Requests section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.CallbackRequests)
      expect(await jobPage.IsTabActive(JobTabTypes.CallbackRequests)).toBe(true)

      // Select Inspections section link- verify the Inspections section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Inspections)
      expect(await jobPage.IsTabActive(JobTabTypes.Inspections)).toBe(true)

      // Select Info section link- verify the Info section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Info)
      expect(await jobPage.IsTabActive(JobTabTypes.Info)).toBe(true)

      // Click the All Jobs link and verify we are back on the Jobs page
      await jobPage.Link_AllJobs.Click()
      await jobPage.page.waitForTimeout(1000)

      // Come back to the job page using the existing filter
      const rowPosition = 1
      const rowIndex = await jobsPage.DataTable_Jobs.FetchRowIndexFromRowPosition(rowPosition, true)
      await jobsPage.DataTable_Jobs.ClickLinkInDataCell(rowIndex, DataTable_Columns_Type.Jobs_JobId)
      await jobPage.page.waitForTimeout(1000)
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      test.slow()

      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Job Page navigation from ClaimsPortalLeftNavBar
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()

      // Select a Job, and click the Job Id link
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = await jobsPage.OpenJob(testJob)

      // Verify that we land on the Job page for that job, defaulting to the Info section
      const InfoTab = await jobPage.SelectJobTab(JobTabTypes.Info)
      expect(await jobPage.IsTabActive(JobTabTypes.Info)).toBe(true)
      expect(jobPage.page.url()).toBe(InfoTab.URL)

      // Verify that the all jobs link is displayed (top left)
      expect(await jobPage.Link_AllJobs.IsVisible()).toBe(true)

      // Verify the job number for this job is displayed on the top left, with a (JOB) label
      await jobPage.Title.VerifyExpectedText()

      // Verify that the Actions button is displayed (top right)
      expect(await jobPage.Button_Actions.IsVisible()).toBe(true)

      // Verify Associated claim number is displayed if it exists
      if (testJob.jobDetails.associatedClaim == '') {
        expect(await jobPage.Link_AssociatedClaim.IsVisible()).toBe(true)
      } else {
        expect(await jobPage.Link_AssociatedClaim.GetText()).toBe(
          testJob.jobDetails.associatedClaim
        )
      }

      // Verify Policyholder name, phone, email and address display below claim number
      expect(await jobPage.Label_PrimaryContact_Name.GetText()).toBe(testJob.contact.name)
      if (testJob.contact.phone != '') {
        expect(await jobPage.Link_PrimaryContact_Phone.GetText()).toBe(testJob.contact.phone)
      }
      if (testJob.contact.email != '') {
        expect(await jobPage.Link_PrimaryContact_Email.GetText()).toBe(testJob.contact.email)
      }
      expect(await jobPage.Link_PrimaryContact_Address.GetText()).toBe(
        testJob.jobLocation.fullAddress
      )

      // Verify contact name, phone, email and address display below job number
      if (testJob.contact.name == '') {
        expect(await jobPage.Label_PrimaryContact_Name.GetText()).toBe('Unknown')
        expect(await jobPage.Link_PrimaryContact_Email.IsVisible()).toBe(false)
        expect(await jobPage.Link_PrimaryContact_Phone.IsVisible()).toBe(false)
        expect(await jobPage.Link_PrimaryContact_Address.IsVisible()).toBe(false)
      } else {
        expect(await jobPage.Label_PrimaryContact_Name.GetText()).toBe(testJob.contact.name)
        expect(await jobPage.Link_PrimaryContact_Phone.GetText()).toBe(testJob.contact.phone)
        expect(await jobPage.Link_PrimaryContact_Email.GetText()).toBe(testJob.contact.email)
        expect(await jobPage.Link_PrimaryContact_Address.GetText()).toBe(
          testJob.jobLocation.fullAddress
        )
      }

      // Select Portal Access section link- verify the Portal Access section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.PortalAccess)
      expect(await jobPage.IsTabActive(JobTabTypes.PortalAccess)).toBe(true)

      // Select Contacts section link- verify the Contacts section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Contacts)
      expect(await jobPage.IsTabActive(JobTabTypes.Contacts)).toBe(true)

      // Select Billing section link- verify the Billing section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Billing)
      expect(await jobPage.IsTabActive(JobTabTypes.Billing)).toBe(true)

      // Select Work Authorizations section link- verify the Work Authorizations section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.WorkAuthorizations)
      expect(await jobPage.IsTabActive(JobTabTypes.WorkAuthorizations)).toBe(true)

      // Select Appointments section link- verify the Appointments section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Appointments)
      expect(await jobPage.IsTabActive(JobTabTypes.Appointments)).toBe(true)

      // Select Documents section link- verify the Documents section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Documents)
      expect(await jobPage.IsTabActive(JobTabTypes.Documents)).toBe(true)

      // Select Media section link- verify the Media section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Media)
      expect(await jobPage.IsTabActive(JobTabTypes.Media)).toBe(true)

      // Select Notes section link- verify the Notes section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Notes)
      expect(await jobPage.IsTabActive(JobTabTypes.Notes)).toBe(true)

      // Select Callback Requests section link- verify the Callback Requests section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.CallbackRequests)
      expect(await jobPage.IsTabActive(JobTabTypes.CallbackRequests)).toBe(true)

      // Select Inspections section link- verify the Inspections section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Inspections)
      expect(await jobPage.IsTabActive(JobTabTypes.Inspections)).toBe(true)

      // Select Info section link- verify the Info section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Info)
      expect(await jobPage.IsTabActive(JobTabTypes.Info)).toBe(true)

      // Click the All Jobs link and verify we are back on the Jobs page
      await jobPage.Link_AllJobs.Click()
      await jobPage.page.waitForTimeout(1000)

      // Come back to the job page using the existing filter
      const rowPosition = 1
      const rowIndex = await jobsPage.DataTable_Jobs.FetchRowIndexFromRowPosition(rowPosition, true)
      await jobsPage.DataTable_Jobs.ClickLinkInDataCell(rowIndex, DataTable_Columns_Type.Jobs_JobId)
      await jobPage.page.waitForTimeout(1000)
    })

    test('Verify Associated Claim Number Link', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)

      // Go to the test job page
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      expect(await jobPage.Link_AssociatedClaim.GetText()).toBe(testJob.jobDetails.associatedClaim)

      // Click link and verify that it opens the claim in a new tab
      const pagePromise = jobPage.context.waitForEvent('page')
      await jobPage.Link_AssociatedClaim.Click()
      const pageNew = await pagePromise
      await pageNew.waitForURL(/.*/)
      await pageNew.bringToFront()
      await pageNew.waitForTimeout(1000)
      expect(pageNew.url().endsWith(`claims/${testJob.jobDetails.associatedClaim}/info`)).toBe(true)
      await pageNew.close()
    })

    test('Verify Actions List Items availability', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)

      // Go to the test job page
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Click the Actions Button
      await jobPage.Button_Actions.Click()

      // Verify all the menu items that show be showing
      await jobPage.VerifyMenuItemIsAttached(JobPageStrings.MenuItem_Actions_AddNote)
      await jobPage.VerifyMenuItemIsAttached(JobPageStrings.MenuItem_Actions_AddPersonToJobPortal)
      await jobPage.VerifyMenuItemIsAttached(JobPageStrings.MenuItem_Actions_AddTags)
      await jobPage.VerifyMenuItemIsAttached(JobPageStrings.MenuItem_Actions_CreateContact)
      await jobPage.VerifyMenuItemIsAttached(
        JobPageStrings.MenuItem_Actions_CustomerContactAttempted
      )
      await jobPage.VerifyMenuItemIsAttached(JobPageStrings.MenuItem_Actions_MarkAsStarted)
      await jobPage.VerifyMenuItemIsAttached(JobPageStrings.MenuItem_Actions_StartInspection)
      await jobPage.VerifyMenuItemIsAttached(JobPageStrings.MenuItem_Actions_UpdateJob)
      await jobPage.VerifyMenuItemIsAttached(JobPageStrings.MenuItem_Actions_UploadDocumentsMedia)
      await jobPage.VerifyMenuItemIsAttached(JobPageStrings.MenuItem_Actions_RecordTarpingWork)
      await jobPage.VerifyMenuItemIsAttached(JobPageStrings.MenuItem_Actions_CloseJob)
    })

    test('Actions List - Add Note: Verify CreateNoteDrawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)

      // Go to the test job page
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Choose Action Add Note
      const createNoteDrawer = await jobPage.OpenCreateNoteDrawer()

      // Verify the Create Note drawer title
      await createNoteDrawer.VerifyTitle()

      // Verify drawer - closes with click on "X" button
      await createNoteDrawer.Close()
      await expect(createNoteDrawer.Title.locator).not.toBeAttached()
      await jobPage.page.waitForTimeout(1000)
    })

    test('Actions List - Add Note: Validate CreateNoteDrawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)

      // Go to the test job page
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Choose Action Add Note
      const createNoteDrawer = await jobPage.OpenCreateNoteDrawer()
      await createNoteDrawer.Button_Submit.Click()
      await jobPage.page.waitForTimeout(1000)

      // Validate the drawer
      expect(await createNoteDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await createNoteDrawer.Button_Close.Click()
    })

    test('Actions List - Add Person To Portal: Verify AddPersonToPortal Drawer UI', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)

      // Go to the test job page
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Choose Action Add Person To Job Portal
      const addPersonToPortalDrawer = await jobPage.OpenAddPersonToPortalDrawer()
      // Verify the Add Person To Portral drawer title
      await addPersonToPortalDrawer.VerifyTitle()
      await addPersonToPortalDrawer.Button_Close.Click()

      await jobPage.OpenAddPersonToPortalDrawer()
      // Verify drawer - closes with click on "X" button
      await addPersonToPortalDrawer.Close()
      await expect(addPersonToPortalDrawer.Title.locator).not.toBeAttached()
      await jobPage.page.waitForTimeout(1000)
    })

    test('Actions List - Add Person To Portal: Validate AddPersonToPortal Drawer', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)

      // Go to the test job page
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Choose Action Add Person To Job Portal
      const addPersonToPortalDrawer = await jobPage.OpenAddPersonToPortalDrawer()

      await addPersonToPortalDrawer.Button_Submit.Click()
      await jobPage.page.waitForTimeout(1000)

      // Validate the drawer
      expect(await addPersonToPortalDrawer.ValidateWithNoteUIHidden()).toBe(true)

      // Click Close to close the drawer
      await addPersonToPortalDrawer.Button_Close.Click()
    })

    test('Actions List - Add Tag: Verify Add Tags Dialog UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)

      // Go to the test job page
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Click the Add Tags Button
      let addTagsDialog = await jobPage.OpenAddTags()

      // Verify the Add Tags dialog title
      await addTagsDialog.VerifyTitle()

      // Verify Add Tags dialog - closes with click on "X" button
      await addTagsDialog.Close()
      await expect(addTagsDialog.Title.locator).not.toBeAttached()
      await jobPage.page.waitForTimeout(1000)

      // Verify fields can be set
      addTagsDialog = await jobPage.OpenAddTags()
      await addTagsDialog.SetKeyValue('Hello, my name is')
      expect(await addTagsDialog.GetKeyValue()).toBe('Hello, my name is')
      await addTagsDialog.SetValueValue('Slim Shady')
      expect(await addTagsDialog.GetValueValue()).toBe('Slim Shady')
      await addTagsDialog.SetColor('#A0A0A0')
      expect(await addTagsDialog.GetColorValue()).toBe('#A0A0A0')

      // Verify Key and Value can be cleared
      await addTagsDialog.ClearValue()
      expect(await addTagsDialog.GetValueValue()).toBe('')
      await addTagsDialog.ClearKey()
      expect(await addTagsDialog.GetKeyValue()).toBe('')
    })

    test('Actions List - Add Tag: Validate Add Tags Dialog', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)

      // Go to the test job page
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Click the Add Tags Button
      const addTagsDialog = await jobPage.OpenAddTags()

      // Click the Add & Close
      await addTagsDialog.Button_AddAndClose.Click()

      // Validate the dialog
      await addTagsDialog.Validate()
    })

    test('Add/Remove Tag', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)

      // Go to the test job page
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      await jobPage.page.waitForTimeout(5000)

      // if our test tag already exists on this claim, remove it
      const testTag = 'AutomatedTestTag'
      const testTagValue = 'TestValue'
      const testTagColor = '#C8C800'
      const tagExists = await jobPage.TagIsAdded(testTag)
      if (tagExists) {
        await jobPage.RemoveTag(testTag)
      }
      // add the test tag
      await jobPage.AddTag(testTag, testTagValue, testTagColor)

      // tag should exist now
      expect(await jobPage.TagWithValueIsAdded(testTag, testTagValue)).toBe(true)

      // remove the test tag
      await jobPage.RemoveTagWithValue(testTag, testTagValue)

      // tag should not exist now
      expect(await jobPage.TagWithValueIsAdded(testTag, testTagValue)).toBe(false)
    })

    test('Actions List - Close Job: Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Click the Close Job button in Actions
      let closeJobDrawer = await jobPage.OpenCloseJobDrawer()

      //Verify drawer heading is "Close Job"
      closeJobDrawer.VerifyTitle()
      expect(closeJobDrawer.TextBox_ClosedDate.locator).toBeAttached()
      expect(closeJobDrawer.ListBox_Reason.locator).toBeAttached()
      expect(closeJobDrawer.TextArea_Notes.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await closeJobDrawer.Close()
      await expect(closeJobDrawer.Title.locator).not.toBeAttached()
      await jobPage.page.waitForTimeout(1000)

      closeJobDrawer = await jobPage.OpenCloseJobDrawer()
      // Verify drawer closes with ESC key
      await closeJobDrawer.Close(true)
      await expect(closeJobDrawer.Title.locator).not.toBeAttached()
      await jobPage.page.waitForTimeout(1000)

      closeJobDrawer = await jobPage.OpenCloseJobDrawer()
      // Verify drawer closes if click on Close
      await closeJobDrawer.Button_Close.Click()
      await expect(closeJobDrawer.Title.locator).not.toBeAttached()
      await closeJobDrawer.page.waitForTimeout(1000)
    })

    test('Actions List - Close Job: Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      const closeJobDrawer = await jobPage.OpenCloseJobDrawer()

      // Click the Submit button
      await closeJobDrawer.Button_Submit.Click()
      await jobPage.page.waitForTimeout(1000)

      // Verify validation message for the drawer
      expect(await closeJobDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await closeJobDrawer.Button_Close.Click()
    })

    test('Actions List - Customer Contact Attempted: Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Click the Record Customer Contact Attemp button in Actions
      let recordCustomerContactAttemptDrawer = await jobPage.OpenRecordCustomerContactAttempt()
      //Verify drawer heading is "Record Customer Contact Attempt"
      recordCustomerContactAttemptDrawer.VerifyTitle()
      expect(recordCustomerContactAttemptDrawer.TextBox_ContactAttemptedDate.locator).toBeAttached()
      expect(recordCustomerContactAttemptDrawer.ComboBox_ContactedBy.locator).toBeAttached()
      expect(recordCustomerContactAttemptDrawer.ComboBox_CustomerContacted.locator).toBeAttached()
      expect(recordCustomerContactAttemptDrawer.ListBox_Method.locator).toBeAttached()
      expect(recordCustomerContactAttemptDrawer.ListBox_Outcome.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await recordCustomerContactAttemptDrawer.Close()
      await expect(recordCustomerContactAttemptDrawer.Title.locator).not.toBeAttached()
      await jobPage.page.waitForTimeout(1000)

      recordCustomerContactAttemptDrawer = await jobPage.OpenRecordCustomerContactAttempt()
      // Verify drawer closes with ESC key
      await recordCustomerContactAttemptDrawer.Close(true)
      await expect(recordCustomerContactAttemptDrawer.Title.locator).not.toBeAttached()
      await jobPage.page.waitForTimeout(1000)

      recordCustomerContactAttemptDrawer = await jobPage.OpenRecordCustomerContactAttempt()
      // Verify drawer closes if click on Close
      await recordCustomerContactAttemptDrawer.Button_Close.Click()
      await expect(recordCustomerContactAttemptDrawer.Title.locator).not.toBeAttached()
      await recordCustomerContactAttemptDrawer.page.waitForTimeout(1000)
    })

    test('Actions List - Customer Contact Attempted: Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Click the Record Customer Contact Attemp button in Actions
      const recordCustomerContactAttemptDrawer = await jobPage.OpenRecordCustomerContactAttempt()

      // Click the Submit button
      await recordCustomerContactAttemptDrawer.Button_Submit.Click()
      await jobPage.page.waitForTimeout(1000)

      // Verify validation message for the drawer
      expect(await recordCustomerContactAttemptDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await recordCustomerContactAttemptDrawer.Button_Close.Click()
    })

    test('Actions List - Record Tarping Work: Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      let enterWorkDetailsDrawer = await jobPage.OpenRecordTarpingWork()
      //Verify drawer heading is "Enter Work Details for Job"
      enterWorkDetailsDrawer.VerifyTitle()
      expect(enterWorkDetailsDrawer.ListBox_TimeOfService.locator).toBeAttached()
      expect(enterWorkDetailsDrawer.ListBox_FastenerType.locator).toBeAttached()
      expect(enterWorkDetailsDrawer.ListBox_RoofPitch.locator).toBeAttached()
      expect(enterWorkDetailsDrawer.TextBox_ServiceDate.locator).toBeAttached()
      expect(enterWorkDetailsDrawer.Checkbox_IsMultiStory.locator).toBeAttached()
      expect(enterWorkDetailsDrawer.TextBox_TarpingSquareFeet.locator).toBeAttached()
      expect(enterWorkDetailsDrawer.ComboBox_PhotoReport.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await enterWorkDetailsDrawer.Close()
      await expect(enterWorkDetailsDrawer.Title.locator).not.toBeAttached()
      await jobPage.page.waitForTimeout(1000)

      enterWorkDetailsDrawer = await jobPage.OpenRecordTarpingWork()
      // Verify drawer closes with ESC key
      await enterWorkDetailsDrawer.Close(true)
      await expect(enterWorkDetailsDrawer.Title.locator).not.toBeAttached()
      await jobPage.page.waitForTimeout(1000)

      enterWorkDetailsDrawer = await jobPage.OpenRecordTarpingWork()
      // Verify drawer closes if click on Close
      await enterWorkDetailsDrawer.Button_Close.Click()
      await expect(enterWorkDetailsDrawer.Title.locator).not.toBeAttached()
      await enterWorkDetailsDrawer.page.waitForTimeout(1000)
    })

    test('Actions List - Record Tarping Work: Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      const enterWorkDetailsDrawer = await jobPage.OpenRecordTarpingWork()

      // Click the Submit button
      await enterWorkDetailsDrawer.Button_Submit.Click()
      await jobPage.page.waitForTimeout(1000)

      // Verify validation message for the drawer
      expect(await enterWorkDetailsDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await enterWorkDetailsDrawer.Button_Close.Click()
    })
  }
)
