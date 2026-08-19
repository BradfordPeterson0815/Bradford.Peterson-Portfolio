import { expect } from '@playwright/test'
import {
  CannedJobTypes,
  DefaultEnvironment,
  JobTabTypes,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { FetchCannedJob } from '../../../library/delegatePortal/delegatePortalHelper.js'
import { LaunchFieldTech } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalJobPage } from '../../../library/delegatePortal/pages/delegatePortalJobPage.js'
import { DelegatePortalJobDetailsTab } from '../../../library/delegatePortal/tabs/delegatePortalJobDetailsTab.js'
import { DelegatePortalJobDocumentsTab } from '../../../library/delegatePortal/tabs/delegatePortalJobDocumentsTab.js'
import { DelegatePortalJobMediaTab } from '../../../library/delegatePortal/tabs/delegatePortalJobMediaTab.js'
import { DelegatePortalJobPhotoReportPage } from '../../../library/delegatePortal/tabs/delegatePortalJobPhotoReportTab.js'
import { DelegatePortalJobUploadTab } from '../../../library/delegatePortal/tabs/delegatePortalJobUploadTab.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Job Page: Details Tab',
  {
    tag: [Tags.Delegate, Tags.FieldTech, Tags.Job, Tags.InfoDetails],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { global } = await LaunchFieldTech(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Verify that we land on the Job page for that job, defaulting to the Details section
      const detailsTab = (await jobPage.SelectJobTab(JobTabTypes.Details)) as DelegatePortalJobDetailsTab
      expect(await jobPage.IsTabActive(JobTabTypes.Details)).toBe(true)
      expect(jobPage.page.url()).toBe(detailsTab.URL)

      // Verify data is correct for the Job Details section
      await detailsTab.VerifyJobDetailsSection()

      // Verify data is correct for the Loss Location section
      await detailsTab.VerifyJobLocationSection()

      // Verify data is correct for the Your Job Team section
      await detailsTab.VerifyYourJobTeamSection()

      // Verify data is correct for the Actions section
      await detailsTab.VerifyActionsSection()

      // Verify data is correct for the Job Visualizer section
      await detailsTab.VerifyJobVisualizerSection()
    })

    test('Verify Action Links navigation', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { global } = await LaunchFieldTech(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()
      const detailsTab = (await jobPage.SelectJobTab(JobTabTypes.Details)) as DelegatePortalJobDetailsTab

      // Click the View Documents link in Actions
      await detailsTab.Link_Actions_ViewDocuments.Click()

      // Verify navigation to Documents tab
      const documentsTab = new DelegatePortalJobDocumentsTab(global, testJob)
      expect(detailsTab.page.url()).toBe(documentsTab.URL)

      // return to Details tab
      await jobPage.SelectJobTab(JobTabTypes.Details)

      // Click the View Media link in Actions
      await detailsTab.Link_Actions_ViewMedia.Click()

      // Verify navigation to Media tab
      const mediaTab = new DelegatePortalJobMediaTab(global, testJob)
      expect(detailsTab.page.url()).toBe(mediaTab.URL)

      // return to Details tab
      await jobPage.SelectJobTab(JobTabTypes.Details)

      // Click the Upload link in Actions
      await detailsTab.Link_Actions_Upload.Click()

      // Verify navigation to Upload page
      const uploadPage = new DelegatePortalJobUploadTab(global, testJob, jobPage.baseURL)
      expect(detailsTab.page.url()).toBe(uploadPage.URL)

      // return to Details tab
      await jobPage.SelectJobTab(JobTabTypes.Details)

      // Click the Create Photo Report link in Actions
      await detailsTab.Link_Actions_CreatePhotoReport.Click()

      // Verify navigation to Create Photo Report page
      const photoReportPage = new DelegatePortalJobPhotoReportPage(global, testJob)
      expect(detailsTab.page.url()).toBe(photoReportPage.URL)

      // return to Details tab
      await jobPage.SelectJobTab(JobTabTypes.Details)
    })

    test('Actions - Add a Note: Verify Create Note Drawer UI', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { global } = await LaunchFieldTech(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Verify that we land on the Job page for that job, defaulting to the Details section
      const detailsTab = (await jobPage.SelectJobTab(JobTabTypes.Details)) as DelegatePortalJobDetailsTab

      // Click the Action->Add a Note button
      let createNoteDrawer = await detailsTab.OpenCreateNoteDrawer()

      // Verify drawer heading is "Create Note"
      await createNoteDrawer.Title.VerifyExpectedText()

      // Verify drawer elements
      await expect(createNoteDrawer.TextBox_NoteTitle.locator).toBeAttached()
      await expect(createNoteDrawer.TextArea_NoteText.locator).toBeAttached()
      await expect(createNoteDrawer.Button_InsertMention.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await createNoteDrawer.Close()
      await expect(createNoteDrawer.Title.locator).not.toBeAttached()
      await detailsTab.page.waitForTimeout(1000)

      createNoteDrawer = await detailsTab.OpenCreateNoteDrawer()

      // Verify drawer closes with ESC key
      await createNoteDrawer.Close(true)
      await expect(createNoteDrawer.Title.locator).not.toBeAttached()
      await detailsTab.page.waitForTimeout(1000)

      createNoteDrawer = await detailsTab.OpenCreateNoteDrawer()

      // Verify drawer closes if click on Cancel
      await createNoteDrawer.Button_Close.Click()
      await expect(createNoteDrawer.Title.locator).not.toBeAttached()
      await detailsTab.page.waitForTimeout(1000)
    })

    test('Actions - Add a Note: Validate Create Note Drawer ', async ({ browser }) => {
      // launch the Delegate Field Tech home page
      const { global } = await LaunchFieldTech(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Verify that we land on the Job page for that job, defaulting to the Details section
      const detailsTab = (await jobPage.SelectJobTab(JobTabTypes.Details)) as DelegatePortalJobDetailsTab

      // Click the Action->Add a Note button
      const createNoteDrawer = await detailsTab.OpenCreateNoteDrawer()

      // click the Submit button without filling out the title or text
      await createNoteDrawer.Button_Submit.Click()

      // Validate
      await createNoteDrawer.Validate()

      // Verify validation messages for the various fields
      expect(await createNoteDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await createNoteDrawer.Button_Close.Click()
    })

    test('Create Note Drawer  - Note text filters on contact list globally and roles in job', async ({
      browser,
    }) => {
      // launch the Delegate Field Tech home page
      const { global } = await LaunchFieldTech(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Verify that we land on the Job page for that job, defaulting to the Details section
      const detailsTab = (await jobPage.SelectJobTab(JobTabTypes.Details)) as DelegatePortalJobDetailsTab

      const createNoteDrawer = await detailsTab.OpenCreateNoteDrawer()
      await detailsTab.page.waitForTimeout(1000)
      const targetName = testJob.testData.jobNotesFilterOnName.target as string
      const targetRole = testJob.testData.jobNotesFilterOnRole.target as string
      // check for Mentions (contacts names) in job via keyboard
      const allSuggestionsFromMentionNameViaKeyboard =
        await createNoteDrawer.FetchAllMentions(targetName)
      expect(allSuggestionsFromMentionNameViaKeyboard[0].contactName).toBe(
        testJob.testData.jobNotesFilterOnName.contact
      )
      expect(allSuggestionsFromMentionNameViaKeyboard[0].roles.join()).toBe(
        testJob.testData.jobNotesFilterOnName.roles
      )
      await createNoteDrawer.TextArea_NoteText.locator.clear()

      // check for Mentions (contacts names) in job via Insert Mention Button
      const allSuggestionsFromMentionNameViaInsertMentionButton =
        await createNoteDrawer.FetchAllMentions(targetName, false)
      expect(allSuggestionsFromMentionNameViaInsertMentionButton[0].contactName).toBe(
        testJob.testData.jobNotesFilterOnName.contact
      )
      expect(allSuggestionsFromMentionNameViaInsertMentionButton[0].roles.join()).toBe(
        testJob.testData.jobNotesFilterOnName.roles
      )
      await createNoteDrawer.TextArea_NoteText.locator.clear()

      // check for Mentions (global roles) via keyboard
      const allSuggestionsFromMentionRoleViaKeyboard =
        await createNoteDrawer.FetchAllMentions(targetRole)
      expect(allSuggestionsFromMentionRoleViaKeyboard[0].contactName).toBe(
        testJob.testData.jobNotesFilterOnRole.contact
      )
      expect(allSuggestionsFromMentionRoleViaKeyboard[0].roles.join()).toBe(
        testJob.testData.jobNotesFilterOnRole.roles
      )
      await createNoteDrawer.TextArea_NoteText.locator.clear()

      // check for Mentions (global roles) in job via Insert Mention Button
      const allSuggestionsFromMentionRolesViaInsertMentionButton =
        await createNoteDrawer.FetchAllMentions(targetRole, false)
      expect(allSuggestionsFromMentionRolesViaInsertMentionButton[0].contactName).toBe(
        testJob.testData.jobNotesFilterOnRole.contact
      )
      expect(allSuggestionsFromMentionRolesViaInsertMentionButton[0].roles.join()).toBe(
        testJob.testData.jobNotesFilterOnRole.roles
      )
      await createNoteDrawer.TextArea_NoteText.locator.clear()
      // Click Close to close the drawer
      await createNoteDrawer.Button_Close.Click()
    })
  }
)
