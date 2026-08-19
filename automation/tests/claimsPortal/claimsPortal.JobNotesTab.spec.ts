import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedJobTypes,
  DefaultEnvironment,
  JobTabTypes,
  NoteDataSourceTuples,
  NoteDataSources,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedJob, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalJobPage } from '../../library/claimsPortal/pages/claimsPortalJobPage.js'
import { ClaimsPortalJobNotesTab } from '../../library/claimsPortal/tabs/claimsPortalJobNotesTab.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'
import { ClaimsPortalJobsPage } from '../../library/claimsPortal/pages/claimsPortalJobsPage.js'

const environment = DefaultEnvironment

test.describe(
  'Job Page: Notes Tab',
  {
    tag: [Tags.ClaimsPortal, Tags.Job, Tags.Notes],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // find a random job and go to it
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const { jobPage } = await jobsPage.OpenRandomJob()

      // Verify that we land on the Job page for that job (Info tab by default), then navigate to the Notes tab
      const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as ClaimsPortalJobNotesTab
      expect(await jobPage.IsTabActive(JobTabTypes.Notes)).toBe(true)
      expect(jobPage.page.url()).toBe(notesTab.URL)

      // Verify Title
      await notesTab.Title.VerifyExpectedText()

      // Verify Search textbox, Cancel Search Button, Fitler Notes, Change Sort Order and Add Note buttons exist
      expect(await notesTab.TextBox_Search.IsVisible()).toBe(true)
      expect(await notesTab.Button_ClearSearch.IsVisible()).toBe(true)
      expect(await notesTab.Button_FilterNotes.IsVisible()).toBe(true)
      expect(await notesTab.Button_ChangeSortToAscending.IsVisible()).toBe(true)
      expect(await notesTab.Button_ChangeSortToDescending.IsVisible()).toBe(false)
      expect(await notesTab.Button_AddNote.IsVisible()).toBe(true)

      // If there are notes, we can poke around, otherwise we need to verify the empty experience
      if (await notesTab.IsEmpty()) {
        expect(await notesTab.Label_NoNotesHaveBeenAdded_Title.IsVisible()).toBe(true)
        expect(await notesTab.Label_NoNotesHaveBeenAdded_Description.IsVisible()).toBe(true)
        expect(await notesTab.Button_NoNotes_AddNote.IsVisible()).toBe(true)
      } else {
        // Check our count before searching
        const initialDatesCount = await notesTab.DatesCount()

        // Search
        await notesTab.PerformSearch('jabberwocky')

        // Check our count after search
        expect(await notesTab.DatesCount()).toBe(0)
        expect(await notesTab.Label_NoNotesMatch.IsVisible()).toBe(true)

        // Clear search and verify our initial counts are back
        await notesTab.Button_ClearSearch.Click()
        const clearedSearchDatesCount = await notesTab.DatesCount()
        expect(clearedSearchDatesCount).toBe(initialDatesCount)

        // Verify a single note - pick the 1st note
        // Check our count after search
        expect(await notesTab.DatesCount()).toBeGreaterThanOrEqual(1)
        expect(await notesTab.NotesOnDateCount(0)).toBeGreaterThanOrEqual(1)
        const firstNote = await notesTab.FetchNoteForDateByIndex(0, 0)

        // take a look at the note
        expect(await firstNote.IsExpanded()).toBe(false)
        await firstNote.ExpandIfNeeded()
        expect(await firstNote.IsExpanded()).toBe(true)
      }
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Verify that we land on the Job page for that job (Info tab by default), then navigate to the Notes tab
      const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as ClaimsPortalJobNotesTab
      expect(await jobPage.IsTabActive(JobTabTypes.Notes)).toBe(true)
      expect(jobPage.page.url()).toBe(notesTab.URL)

      // Verify Title
      await notesTab.Title.VerifyExpectedText()

      // Verify Search textbox, Cancel Search Button, Fitler Notes, Change Sort Order and Add Note buttons exist
      expect(await notesTab.TextBox_Search.IsVisible()).toBe(true)
      expect(await notesTab.Button_ClearSearch.IsVisible()).toBe(true)
      expect(await notesTab.Button_FilterNotes.IsVisible()).toBe(true)
      expect(await notesTab.Button_ChangeSortToAscending.IsVisible()).toBe(true)
      expect(await notesTab.Button_ChangeSortToDescending.IsVisible()).toBe(false)
      expect(await notesTab.Button_AddNote.IsVisible()).toBe(true)
    })

    test('Verify Search', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job (Info tab by default), then navigate to the Notes tab
      const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as ClaimsPortalJobNotesTab

      // Check our count before searching
      const initialDatesCount = await notesTab.DatesCount()

      // Search
      await notesTab.PerformSearch(testJob.testData.jobNotesSearch)

      // Check our count after search
      expect(await notesTab.DatesCount()).toBeLessThanOrEqual(initialDatesCount)
      expect(await notesTab.NotesOnDateCount(0)).toBeLessThanOrEqual(initialDatesCount)

      // Clear searh and verify our initial counts are back
      await notesTab.Button_ClearSearch.Click()
      const clearedSearchDatesCount = await notesTab.DatesCount()
      expect(clearedSearchDatesCount).toBe(initialDatesCount)
    })

    test('Filter Notes dialog - Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job (Info tab by default), then navigate to the Notes tab
      const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as ClaimsPortalJobNotesTab

      // Verify Filter Notes dialog appears directly below the Filter Notes button, displaying a checkbox list of Data Sources
      const filterNotesDialog = await notesTab.OpenFilterNotes()
      await filterNotesDialog.VerifyTitle()

      // Verify dialog is set to the default filter set
      expect(
        await filterNotesDialog.IsFilterChecked(NoteDataSourceTuples.Redacted[1] as string)
      ).toBe(true)
      expect(await filterNotesDialog.IsFilterChecked(NoteDataSourceTuples.ClaimsPortal[1] as string)).toBe(
        true
      )
      expect(
        await filterNotesDialog.IsFilterChecked(NoteDataSourceTuples.Delegate[1] as string)
      ).toBe(true)
      expect(await filterNotesDialog.IsFilterChecked(NoteDataSourceTuples.UserPortal[1] as string)).toBe(
        true
      )
      expect(
        await filterNotesDialog.IsFilterChecked(NoteDataSourceTuples.EmailSending[1] as string)
      ).toBe(false)
      expect(
        await filterNotesDialog.IsFilterChecked(NoteDataSourceTuples.EmailReceiving[1] as string)
      ).toBe(true)
      expect(
        await filterNotesDialog.IsFilterChecked(NoteDataSourceTuples.Inspections[1] as string)
      ).toBe(false)

      // Verify dialog closes with X,
      await filterNotesDialog.Close()
      await notesTab.page.waitForTimeout(1000)
      expect(await filterNotesDialog.Title.IsVisible()).toBe(false)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Verify Filter Notes', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test job page
        const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
        const jobPage = new ClaimsPortalJobPage(global, testJob)
        await jobPage.NavigateDirectlyToJob()

        //Verify that we land on the Job page for that job (Info tab by default), then navigate to the Notes tab
        const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as ClaimsPortalJobNotesTab

        await notesTab.ClearNotesFilter()
        const noDataSourceFilteredNoteCount = await notesTab.AllNotesCount()
        await notesTab.page.waitForTimeout(1000)

        await notesTab.SetNotesFilter(NoteDataSources.ClaimsPortal)
        const claimsDataSourceFilteredNoteCount = await notesTab.AllNotesCount()
        // Verify that checking a box for a given data source includes the matching notes that have that data source in the Notes list
        const claimsFilteredDateCount = await notesTab.DatesCount()
        for (let countIndex = 0; countIndex < claimsFilteredDateCount; countIndex++) {
          const noteCount = await notesTab.NotesOnDateCount(countIndex)
          for (let noteIndex = 0; noteIndex < noteCount; noteIndex++) {
            const note = await notesTab.FetchNoteForDateByIndex(countIndex, noteIndex)
            const noteDataSource = await note.DataSource()
            if (noteDataSource != null) {
              expect(noteDataSource).toBe(NoteDataSources.ClaimsPortal)
            }
          }
        }

        // Verify that unchecking a box for a given data source removes the matching notes that have that data source in the Notes list
        await notesTab.Reload()

        await notesTab.SetNotesFilter(NoteDataSources.UserPortal)
        const TplapDataSourceFilteredNoteCount = await notesTab.AllNotesCount()
        const TplapFilteredDateCount = await notesTab.DatesCount()
        for (let countIndex = 0; countIndex < TplapFilteredDateCount; countIndex++) {
          const noteCount = await notesTab.NotesOnDateCount(countIndex)
          for (let noteIndex = 0; noteIndex < noteCount; noteIndex++) {
            const note = await notesTab.FetchNoteForDateByIndex(countIndex, noteIndex)
            const noteDataSource = await note.DataSource()
            if (noteDataSource != null) {
              expect(noteDataSource).toBe(NoteDataSources.UserPortal)
            }
          }
        }
        await notesTab.page.waitForTimeout(2000)
        await notesTab.SetNotesFilter(NoteDataSources.ClaimsPortal | NoteDataSources.UserPortal)
        const claimsAndTplapFilteredNoteCount = await notesTab.AllNotesCount()

        expect(
          claimsDataSourceFilteredNoteCount +
            TplapDataSourceFilteredNoteCount -
            2 * noDataSourceFilteredNoteCount
        ).toBe(claimsAndTplapFilteredNoteCount - noDataSourceFilteredNoteCount)
      })

      test('Verify Sort', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test job page
        const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
        const jobPage = new ClaimsPortalJobPage(global, testJob)
        await jobPage.NavigateDirectlyToJob()

        //Verify that we land on the Job page for that job (Info tab by default), then navigate to the Notes tab
        const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as ClaimsPortalJobNotesTab

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
        const ascendingLastDate = new Date(await ascendingLastNote.DateParentInfo()) // First date should be < (older) than last date
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
        expect(descendingAgainFirstDate.getTime()).toBeGreaterThan(
          descendingAgainLastDate.getTime()
        )
      })

      test('Verify Sort on filtered results', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test job page
        const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
        const jobPage = new ClaimsPortalJobPage(global, testJob)
        await jobPage.NavigateDirectlyToJob()

        //Verify that we land on the Job page for that job (Info tab by default), then navigate to the Notes tab
        const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as ClaimsPortalJobNotesTab
        await notesTab.page.waitForTimeout(1000)
        await notesTab.SetNotesFilter(
          NoteDataSources.ClaimsPortal |
            NoteDataSources.EmailReceiving |
            NoteDataSources.EmailSending |
            NoteDataSources.Delegate |
            NoteDataSources.Inspections |
            NoteDataSources.UserPortal |
            NoteDataSources.Redacted
        )
        const noteCountBeforeFilter = await notesTab.AllNotesCount()

        await notesTab.SetNotesFilter(NoteDataSources.Inspections)
        const noteCountBeforeSort = await notesTab.AllNotesCount()

        // we should have fewer notes now due to the filter
        expect(noteCountBeforeFilter).toBeGreaterThan(noteCountBeforeSort)

        // we need at least 2 filtered date groups for this test
        if (noteCountBeforeSort < 2) {
          AbortTest(AbortErrors.NotesNotEnoughEntries)
          return
        }

        const inspectionsDateCountBeforeSort = await notesTab.DatesCount()

        // grab first and last dates and compare
        const descendingFirstNote = await notesTab.FetchNoteForDateByIndex(0, 0)
        const descendingFirstDate = new Date(await descendingFirstNote.DateParentInfo())
        const descendingLastNote = await notesTab.FetchNoteForDateByIndex(
          inspectionsDateCountBeforeSort - 1,
          0
        )
        const descendingLastDate = new Date(await descendingLastNote.DateParentInfo())
        // First date should be > (newer) than last date
        expect(descendingFirstDate.getTime()).toBeGreaterThanOrEqual(descendingLastDate.getTime())

        // change sort order to ascending
        await notesTab.Button_ChangeSortToAscending.Click()
        expect(await notesTab.IsSortedAscending()).toBe(true)
        const noteCountAfterSort = await notesTab.AllNotesCount()
        const inspectionsDateCountAfterSort = await notesTab.DatesCount()

        // should have the same number of filtered notes after sorting
        expect(noteCountAfterSort).toBe(noteCountBeforeSort)

        // should have the same number of date groups after sorting
        expect(inspectionsDateCountAfterSort).toBe(inspectionsDateCountBeforeSort)

        // grab first and last dates and compare
        const ascendingFirstNote = await notesTab.FetchNoteForDateByIndex(0, 0)
        const ascendingFirstDate = new Date(await ascendingFirstNote.DateParentInfo())
        const ascendingLastNote = await notesTab.FetchNoteForDateByIndex(
          inspectionsDateCountAfterSort - 1,
          0
        )
        const ascendingLastDate = new Date(await ascendingLastNote.DateParentInfo())
        // First date should be < (older) than last date
        expect(ascendingFirstDate.getTime()).toBeLessThanOrEqual(ascendingLastDate.getTime())
      })
    })

    test('Create Note - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job (Info tab by default), then navigate to the Notes tab
      const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as ClaimsPortalJobNotesTab
      await notesTab.page.waitForTimeout(1000)

      let createNoteDrawer = await notesTab.OpenCreateNoteDrawer()

      // Verify drawer heading is "Create Note"
      createNoteDrawer.VerifyTitle()
      await expect(createNoteDrawer.ListBox_NoteTemplate.locator.locator('..')).toBeAttached()
      await expect(createNoteDrawer.Button_RefetchTemplates.locator).toBeAttached()
      await expect(createNoteDrawer.Button_GoToTemplates.locator).toBeAttached()
      await expect(createNoteDrawer.TextBox_NoteTitle.locator).toBeAttached()
      await expect(createNoteDrawer.TextArea_NoteText.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await createNoteDrawer.Button_Close_X.Click()
      await expect(createNoteDrawer.Title.locator).not.toBeAttached()
      await notesTab.page.waitForTimeout(1000)

      createNoteDrawer = await notesTab.OpenCreateNoteDrawer()
      await createNoteDrawer.Close()
    })

    test('Create Note - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job (Info tab by default), then navigate to the Notes tab
      const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as ClaimsPortalJobNotesTab
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
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job (Info tab by default), then navigate to the Notes tab
      const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as ClaimsPortalJobNotesTab
      await notesTab.page.waitForTimeout(1000)

      const createNoteDrawer = await notesTab.OpenCreateNoteDrawer()
      await notesTab.page.waitForTimeout(1000)
      const target = testJob.testData.jobNotesFilterOnName.target as string

      // check for Mentions (contacts names) in job via keyboard
      const allSuggestionsFromMentionNameViaKeyboard =
        await createNoteDrawer.FetchAllMentions(target)
      expect(allSuggestionsFromMentionNameViaKeyboard[0].contactName).toBe(
        testJob.testData.jobNotesFilterOnName.contact
      )
      expect(allSuggestionsFromMentionNameViaKeyboard[0].roles.join()).toBe(
        testJob.testData.jobNotesFilterOnName.roles
      )
      await createNoteDrawer.TextArea_NoteText.locator.clear()

      // check for Mentions (contacts names) in job via Insert Mention Button
      const allSuggestionsFromMentionNameViaInsertMentionButton =
        await createNoteDrawer.FetchAllMentions(target, false)
      expect(allSuggestionsFromMentionNameViaInsertMentionButton[0].contactName).toBe(
        testJob.testData.jobNotesFilterOnName.contact
      )
      expect(allSuggestionsFromMentionNameViaInsertMentionButton[0].roles.join()).toBe(
        testJob.testData.jobNotesFilterOnName.roles
      )
      await createNoteDrawer.TextArea_NoteText.locator.clear()

      // check for Mentions (global roles) via keyboard
      const allSuggestionsFromMentionRoleViaKeyboard =
        await createNoteDrawer.FetchAllMentions(target)
      expect(allSuggestionsFromMentionRoleViaKeyboard[0].contactName).toBe(
        testJob.testData.jobNotesFilterOnName.contact
      )
      expect(allSuggestionsFromMentionRoleViaKeyboard[0].roles.join()).toBe(
        testJob.testData.jobNotesFilterOnName.roles
      )
      await createNoteDrawer.TextArea_NoteText.locator.clear()

      // Click Close to close the drawer
      await createNoteDrawer.Button_Close.Click()
    })

    test('Export Note - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.TestOne)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job (Info tab by default), then navigate to the Notes tab
      const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as ClaimsPortalJobNotesTab
      await notesTab.page.waitForTimeout(1000)

      // Search for the note we want - a non Redacted DataSource, that has not been exported to Redacted1 or to any job in the job
      await notesTab.PerformSearch(testJob.testData.jobNotesSearch)
      const note = await notesTab.FetchNoteForDateByIndex(0, 0)

      // Click the Export Note button for that note
      let exportNoteDrawer = await note.OpenExportNoteDrawer()

      //Verify drawer heading is "Export Note"
      exportNoteDrawer.VerifyTitle()

      // make sure there is at least 1 job there
      const jobCheckbox = exportNoteDrawer.TargetJobCheckboxByIndex(0)
      expect(jobCheckbox.locator).toBeEnabled()

      // Verify drawer closes with click on "X" button
      await exportNoteDrawer.Close()
      await expect(exportNoteDrawer.Title.locator).not.toBeAttached()
      await notesTab.page.waitForTimeout(1000)

      exportNoteDrawer = await note.OpenExportNoteDrawer()
      // Verify drawer closes with ESC key
      await exportNoteDrawer.Close(true)
      await expect(exportNoteDrawer.Title.locator).not.toBeAttached()
      await notesTab.page.waitForTimeout(1000)

      exportNoteDrawer = await note.OpenExportNoteDrawer()

      // Verify drawer closes if click on Close
      await exportNoteDrawer.Button_Close.Click()
      await expect(exportNoteDrawer.Title.locator).not.toBeAttached()
      await notesTab.page.waitForTimeout(1000)
    })

    test('Export Note - Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.TestOne)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job (Info tab by default), then navigate to the Notes tab
      const notesTab = (await jobPage.SelectJobTab(JobTabTypes.Notes)) as ClaimsPortalJobNotesTab
      await notesTab.page.waitForTimeout(1000)

      // Search for the note we want - a non Redacted DataSource, that has not been exported to Redacted1 or to any job in the job
      await notesTab.PerformSearch(testJob.testData.jobNotesSearch)
      const note = await notesTab.FetchNoteForDateByIndex(0, 0)

      // Click the Export Note button for that note
      const exportNoteDrawer = await note.OpenExportNoteDrawer()

      // Click the Submit button
      await exportNoteDrawer.Button_Submit.Click()
      await notesTab.page.waitForTimeout(1000)

      // Verify validation message for the drawer with no checkboxes selected
      expect(await exportNoteDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await exportNoteDrawer.Button_Close.Click()
    })
  }
)
