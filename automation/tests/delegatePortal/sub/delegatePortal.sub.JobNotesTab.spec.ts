import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedJobTypes,
  DefaultEnvironment,
  JobTabTypes,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { FetchCannedJob } from '../../../library/delegatePortal/delegatePortalHelper.js'
import { LaunchSubcontractor } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalJobPage } from '../../../library/delegatePortal/pages/delegatePortalJobPage.js'
import { DelegatePortalJobNotesTab } from '../../../library/delegatePortal/tabs/delegatePortalJobNotesTab.js'
import { AbortTest } from '../../../library/shared/commonHelper.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Job Page: Notes Tab',
  {
    tag: [Tags.Delegate, Tags.Subcontractor, Tags.Job, Tags.Notes],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job (Details tab by default), then navigate to the Notes tab
      const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as DelegatePortalJobNotesTab
      expect(await jobPage.IsTabActive(JobTabTypes.Notes)).toBe(true)
      expect(jobPage.page.url()).toBe(notesTab.URL)

      // Verify Title
      await notesTab.Title.VerifyExpectedText()

      // Verify Search textbox, Cancel Search Button, Filter Notes, Change Sort Order and Add Note buttons exist
      expect(await notesTab.TextBox_Search.IsVisible()).toBe(true)
      expect(await notesTab.Button_ClearSearch.IsVisible()).toBe(true)
      expect(await notesTab.Button_ChangeSortToAscending.IsVisible()).toBe(true)
      expect(await notesTab.Button_ChangeSortToDescending.IsVisible()).toBe(false)
      expect(await notesTab.Button_AddNote.IsVisible()).toBe(true)
    })

    test('Verify Search', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job (Details tab by default), then navigate to the Notes tab
      const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as DelegatePortalJobNotesTab

      // Check our count before searching
      const initialDatesCount = await notesTab.DatesCount()

      // Search
      await notesTab.PerformSearch(testJob.testData.jobNotesSearch)

      // Check our count after search
      expect(await notesTab.DatesCount()).toBe(1)
      expect(await notesTab.NotesOnDateCount(0)).toBe(1)

      // Clear searh and verify our initial counts are back
      await notesTab.Button_ClearSearch.Click()
      const clearedSearchDatesCount = await notesTab.DatesCount()
      expect(clearedSearchDatesCount).toBe(initialDatesCount)
    })

    test('Verify Sort', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job (Details tab by default), then navigate to the Notes tab
      const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as DelegatePortalJobNotesTab

      const initialDateCount = await notesTab.DatesCount()
      // we need at least 2 date groups for this test
      if (initialDateCount < 2) {
        AbortTest(AbortErrors.NotesNotEnoughEntries)
        return
      }

      // Verify current Sort Order (should initially be descending)
      expect(await notesTab.IsSortedDescending()).toBe(true)

      // grab first and last dates and compare
      const descendingFirstNote = await notesTab.FetchNoteForDateByIndex(0, 0)
      const descendingFirstDate = new Date(await descendingFirstNote.DateParentInfo())
      const descendingLastNote = await notesTab.FetchNoteForDateByIndex(initialDateCount - 1, 0)
      const descendingLastDate = new Date(await descendingLastNote.DateParentInfo())
      // First date should be > (newer) than last date
      expect(descendingFirstDate.getTime()).toBeGreaterThan(descendingLastDate.getTime())

      // change sort order to ascending
      await notesTab.Button_ChangeSortToAscending.Click()
      expect(await notesTab.IsSortedAscending()).toBe(true)

      // grab first and last dates and compare
      const ascendingFirstNote = await notesTab.FetchNoteForDateByIndex(0, 0)
      const ascendingFirstDate = new Date(await ascendingFirstNote.DateParentInfo())
      const ascendingLastNote = await notesTab.FetchNoteForDateByIndex(initialDateCount - 1, 0)
      const ascendingLastDate = new Date(await ascendingLastNote.DateParentInfo())
      // First date should be < (older) than last date
      expect(ascendingFirstDate.getTime()).toBeLessThan(ascendingLastDate.getTime())

      // change back to descending
      await notesTab.Button_ChangeSortToDescending.Click()
      expect(await notesTab.IsSortedDescending()).toBe(true)

      // grab first and last dates and compare
      const descendingAgainFirstNote = await notesTab.FetchNoteForDateByIndex(0, 0)
      const descendingAgainFirstDate = new Date(await descendingAgainFirstNote.DateParentInfo())
      const descendingAgainLastNote = await notesTab.FetchNoteForDateByIndex(
        initialDateCount - 1,
        0
      )
      const descendingAgainLastDate = new Date(await descendingAgainLastNote.DateParentInfo())
      // First date should be > (newer) than last date
      expect(descendingAgainFirstDate.getTime()).toBeGreaterThan(descendingAgainLastDate.getTime())
    })

    test('Create Note - Verify Drawer UI', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job (Details tab by default), then navigate to the Notes tab
      const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as DelegatePortalJobNotesTab
      await notesTab.page.waitForTimeout(1000)

      let createNoteDrawer = await notesTab.OpenCreateNoteDrawer()

      // Verify drawer heading is "Create Note"
      createNoteDrawer.VerifyTitle()
      await expect(createNoteDrawer.TextBox_NoteTitle.locator).toBeAttached()
      await expect(createNoteDrawer.TextArea_NoteText.locator).toBeAttached()

      // Verify drawer elements
      await expect(createNoteDrawer.TextBox_NoteTitle.locator).toBeAttached()
      await expect(createNoteDrawer.TextArea_NoteText.locator).toBeAttached()
      await expect(createNoteDrawer.Button_InsertMention.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await createNoteDrawer.Close()
      await expect(createNoteDrawer.Title.locator).not.toBeAttached()
      await notesTab.page.waitForTimeout(1000)

      createNoteDrawer = await notesTab.OpenCreateNoteDrawer()
      // Verify drawer closes with ESC key
      await createNoteDrawer.Close(true)
      await expect(createNoteDrawer.Title.locator).not.toBeAttached()
      await notesTab.page.waitForTimeout(1000)

      createNoteDrawer = await notesTab.OpenCreateNoteDrawer()
      // Verify drawer closes if click on Close
      await createNoteDrawer.Button_Close.Click()
      await expect(createNoteDrawer.Title.locator).not.toBeAttached()
      await notesTab.page.waitForTimeout(1000)
    })

    test('Create Note - Validate Drawer', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job (Details tab by default), then navigate to the Notes tab
      const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as DelegatePortalJobNotesTab
      await notesTab.page.waitForTimeout(1000)

      const createNoteDrawer = await notesTab.OpenCreateNoteDrawer()

      // Click the Next button
      await createNoteDrawer.Button_Submit.Click()
      await notesTab.page.waitForTimeout(1000)

      // Verify validation messages for the Note Title and Note Text fields
      expect(await createNoteDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await createNoteDrawer.Button_Close.Click()
    })

    test('Create Note - Note text filters on contact list globally and roles in job', async ({
      browser,
    }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new DelegatePortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job (Details tab by default), then navigate to the Notes tab
      const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as DelegatePortalJobNotesTab
      await notesTab.page.waitForTimeout(1000)

      const createNoteDrawer = await notesTab.OpenCreateNoteDrawer()
      await notesTab.page.waitForTimeout(1000)
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
