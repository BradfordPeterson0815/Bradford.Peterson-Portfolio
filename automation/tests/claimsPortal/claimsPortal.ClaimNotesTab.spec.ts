import { expect } from '@playwright/test'
import { AbortTest } from '../../library/shared/commonHelper.js'
import {
  AbortErrors,
  CannedClaimTypes,
  ClaimTabTypes,
  DefaultEnvironment,
  NoteDataSourceTuples,
  NoteDataSources,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedClaim, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalClaimPage } from '../../library/claimsPortal/pages/claimsPortalClaimPage.js'
import { ClaimsPortalClaimNotesTab } from '../../library/claimsPortal/tabs/claimsPortalClaimNotesTab.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'
import { ClaimsPortalClaimsPage } from '../../library/claimsPortal/pages/claimsPortalClaimsPage.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Page: Notes Tab',
  {
    tag: [Tags.ClaimsPortal, Tags.Claim, Tags.Notes],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to a claim page
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage } = await claimsPage.OpenRandomClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Notes tab
      const notesTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Notes)) as ClaimsPortalClaimNotesTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Notes)).toBe(true)
      expect(claimPage.page.url()).toBe(notesTab.URL)

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

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Notes tab
      const notesTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Notes)) as ClaimsPortalClaimNotesTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Notes)).toBe(true)
      expect(claimPage.page.url()).toBe(notesTab.URL)

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

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Notes tab
      const notesTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Notes)) as ClaimsPortalClaimNotesTab

      // Check our count before searching
      const initialDatesCount = await notesTab.DatesCount()

      // Search
      await notesTab.PerformSearch(testClaim.testData.claimNotesSearchNotExported)

      // Check our count after search
      expect(await notesTab.DatesCount()).toBeGreaterThanOrEqual(1)
      expect(await notesTab.NotesOnDateCount(0)).toBe(1)

      // Clear searh and verify our initial counts are back
      await notesTab.Button_ClearSearch.Click()
      const clearedSearchDatesCount = await notesTab.DatesCount()
      expect(clearedSearchDatesCount).toBe(initialDatesCount)
    })

    test('Filter Notes dialog - Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Notes tab
      const notesTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Notes)) as ClaimsPortalClaimNotesTab

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

      // Verify that checking a box for a given data source includes the matching notes that have that data source in the Notes list
      // Verify that unchecking a box for a given data source removes the matching notes that have that data source from the Notes list
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Verify Filter Notes', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new ClaimsPortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Notes tab
        const notesTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Notes)) as ClaimsPortalClaimNotesTab

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
        await notesTab.SetNotesFilter(NoteDataSources.Inspections)
        const inspectionsDataSourceFilteredNoteCount = await notesTab.AllNotesCount()
        const inspectionsFilteredDateCount = await notesTab.DatesCount()
        for (let countIndex = 0; countIndex < inspectionsFilteredDateCount; countIndex++) {
          const noteCount = await notesTab.NotesOnDateCount(countIndex)
          for (let noteIndex = 0; noteIndex < noteCount; noteIndex++) {
            const note = await notesTab.FetchNoteForDateByIndex(countIndex, noteIndex)
            const noteDataSource = await note.DataSource()
            if (noteDataSource != null) {
              expect(noteDataSource).toBe(NoteDataSources.Inspections)
            }
          }
        }

        await notesTab.SetNotesFilter(NoteDataSources.ClaimsPortal | NoteDataSources.Inspections)
        const claimsAndInspectionsFilteredNoteCount = await notesTab.AllNotesCount()

        expect(
          claimsDataSourceFilteredNoteCount +
            inspectionsDataSourceFilteredNoteCount -
            2 * noDataSourceFilteredNoteCount
        ).toBe(claimsAndInspectionsFilteredNoteCount - noDataSourceFilteredNoteCount)
      })

      test('Verify Sort', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new ClaimsPortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Notes tab
        const notesTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Notes)) as ClaimsPortalClaimNotesTab

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
        expect(descendingAgainFirstDate.getTime()).toBeGreaterThan(
          descendingAgainLastDate.getTime()
        )
      })

      test('Verify Sort on filtered results', async ({ browser }) => {
        // launch the Claims Portal
        const { global } = await Launch(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new ClaimsPortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Notes tab
        const notesTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Notes)) as ClaimsPortalClaimNotesTab
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

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Notes tab
      const notesTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Notes)) as ClaimsPortalClaimNotesTab
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
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Notes tab
      const notesTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Notes)) as ClaimsPortalClaimNotesTab
      await notesTab.page.waitForTimeout(1000)

      const createNoteDrawer = await notesTab.OpenCreateNoteDrawer()

      // Click the Submit button
      await createNoteDrawer.Button_Submit.Click()
      await notesTab.page.waitForTimeout(1000)

      // Verify validation messages for the Note Title and Note Text fields
      expect(await createNoteDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await createNoteDrawer.Button_Close.Click()
    })

    test('Create Note - Note allows inserts from Mentions list globally and roles in claim', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const UseKeyBoard_False = false
      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Notes tab
      const notesTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Notes)) as ClaimsPortalClaimNotesTab

      const createNoteDrawer = await notesTab.OpenCreateNoteDrawer()
      const target = testClaim.testData.claimNotesFilterOnName.target as string
      // check for Mentions (contacts names) in claim via keyboard
      const allSuggestionsFromMentionViaKeyboard = await createNoteDrawer.FetchAllMentions(target)
      expect(allSuggestionsFromMentionViaKeyboard[0].contactName).toBe(
        testClaim.testData.claimNotesFilterOnName.contact
      )
      expect(allSuggestionsFromMentionViaKeyboard[0].roles.join()).toBe(
        testClaim.testData.claimNotesFilterOnName.roles
      )
      await createNoteDrawer.TextArea_NoteText.locator.clear()

      // check for Mentions (contacts names) in claim via Insert Mention Button
      const allSuggestionsFromMentionViaInsertMentionButton =
        await createNoteDrawer.FetchAllMentions(target, UseKeyBoard_False)
      expect(allSuggestionsFromMentionViaInsertMentionButton[0].contactName).toBe(
        testClaim.testData.claimNotesFilterOnName.contact
      )
      expect(allSuggestionsFromMentionViaInsertMentionButton[0].roles.join()).toBe(
        testClaim.testData.claimNotesFilterOnName.roles
      )
      await createNoteDrawer.TextArea_NoteText.locator.clear()

      // check for Mentions (global roles) via keyboard
      const allSuggestionsFromMentionRoleViaKeyboard =
        await createNoteDrawer.FetchAllMentions(target)
      expect(allSuggestionsFromMentionRoleViaKeyboard[0].contactName).toBe(
        testClaim.testData.claimNotesFilterOnName.contact
      )
      expect(allSuggestionsFromMentionRoleViaKeyboard[0].roles.join()).toBe(
        testClaim.testData.claimNotesFilterOnName.roles
      )
      await createNoteDrawer.TextArea_NoteText.locator.clear()

      // check for Mentions (global roles) via Insert Mention button
      const allSuggestionsFromMentionRoleViaInsertMentionButton =
        await createNoteDrawer.FetchAllMentions(target, UseKeyBoard_False)
      expect(allSuggestionsFromMentionRoleViaInsertMentionButton[0].contactName).toBe(
        testClaim.testData.claimNotesFilterOnName.contact
      )
      expect(allSuggestionsFromMentionRoleViaInsertMentionButton[0].roles.join()).toBe(
        testClaim.testData.claimNotesFilterOnName.roles
      )
      await createNoteDrawer.TextArea_NoteText.locator.clear()

      // Click Close to close the drawer
      await createNoteDrawer.Button_Close.Click()
    })

    test('Create Note - Note allows inserts from Parameters list in claim', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const UseKeyBoard_False = false

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Notes tab
      const notesTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Notes)) as ClaimsPortalClaimNotesTab

      const createNoteDrawer = await notesTab.OpenCreateNoteDrawer()
      const parameter_CarrierClaimNumber = 'carrierClaimNumber'
      const parameter_PolicyNumber = 'policyNumber'

      // check for a Parameter in claim via keyboard
      const allSuggestionsFromParameterViaKeyboard = await createNoteDrawer.FetchAllParameters(
        parameter_CarrierClaimNumber
      )
      expect(allSuggestionsFromParameterViaKeyboard[0].parameter).toBe(parameter_CarrierClaimNumber)
      expect(allSuggestionsFromParameterViaKeyboard[0].value).toBe(testClaim.basicInfo.claimNumber)
      await createNoteDrawer.TextArea_NoteText.locator.clear()

      // check for a Parameter in claim via Insert Parameter Button
      const allSuggestionsFromMentionViaInsertParameterButton =
        await createNoteDrawer.FetchAllParameters(parameter_PolicyNumber, UseKeyBoard_False)
      expect(allSuggestionsFromMentionViaInsertParameterButton[0].parameter).toBe(
        parameter_PolicyNumber
      )
      expect(allSuggestionsFromMentionViaInsertParameterButton[0].value).toBe(
        testClaim.basicInfo.policyNumber
      )
      await createNoteDrawer.TextArea_NoteText.locator.clear()

      // Click Close to close the drawer
      await createNoteDrawer.Button_Close.Click()
    })

    test('Redacted1 Import status and Export Availability for non Redacted data sources', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.RedactedClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Notes tab
      const notesTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Notes)) as ClaimsPortalClaimNotesTab
      await notesTab.page.waitForTimeout(1000)

      // Search for note that is already imported into Redacted1 and is fully exported (Redacted1+any jobs)
      await notesTab.PerformSearch(testClaim.testData.claimNotesSearchFullyExported)

      // Check our count after search
      expect(await notesTab.DatesCount()).toBe(1)
      expect(await notesTab.NotesOnDateCount(0)).toBe(1)

      // Grab the note to examine
      const note = await notesTab.FetchNoteForDateByIndex(0, 0)

      // Redacted1 Import Status should be available and be complete (checkmark icon)
      expect(await note.IsRedacted1ImportStatusAvailable()).toBe(true)
      expect(await note.IsRedacted1ImportPending()).toBe(false)
      expect(await note.IsRedacted1ImportCompleted()).toBe(true)

      // Export Note should be disabled
      expect(await note.IsExportNoteAvailable()).toBe(false)
    })

    test('Export Note - Redacted1 is not available to Redacted data source', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.RedactedClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Notes tab
      const notesTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Notes)) as ClaimsPortalClaimNotesTab
      await notesTab.page.waitForTimeout(1000)

      // only allow Redacted notes
      await notesTab.SetNotesFilter(NoteDataSources.Redacted)

      // Check for the 1st note - can we export?
      let note = await notesTab.FetchNoteForDateByIndex(0, 0)
      if ((await note.IsExportNoteAvailable()) == false) {
        note = await notesTab.FetchNoteForDateByIndex(1, 0)
      }
      // Click the Export Note button for that note
      const exportNoteDrawer = await note.OpenExportNoteDrawer()

      //Verify Redacted1 checkbox is not visible
      expect(await exportNoteDrawer.IsRedacted1Available()).toBe(false)

      // close drawer and quit
      await exportNoteDrawer.Button_Close.Click()
    })

    test('Export Note - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.RedactedClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Notes tab
      const notesTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Notes)) as ClaimsPortalClaimNotesTab
      await notesTab.page.waitForTimeout(1000)

      // Search for the note we want - a non Redacted DataSource, that has not been exported to Redacted1 or to any job in the claim
      await notesTab.PerformSearch(testClaim.testData.claimNotesSearchNotExported)
      const note = await notesTab.FetchNoteForDateByIndex(0, 0)

      // Click the Export Note button for that note
      let exportNoteDrawer = await note.OpenExportNoteDrawer()

      //Verify drawer heading is "Export Note"
      exportNoteDrawer.VerifyTitle()

      // make sure the Redacted1 checkbox is there and enabled
      expect(exportNoteDrawer.CheckBox_PublicationTarget_Redacted1.locator).toBeEnabled()

      // make sure there is at least 1 job there
      const jobCheckbox = exportNoteDrawer.TargetJobCheckboxByIndex(1)
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

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.RedactedClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Notes tab
      const notesTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Notes)) as ClaimsPortalClaimNotesTab
      await notesTab.page.waitForTimeout(1000)

      // Search for the note we want - a non Redacted DataSource, that has not been exported to Redacted1 or to any job in the claim
      await notesTab.PerformSearch(testClaim.testData.claimNotesSearchNotExported)
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

    test('Create Note - Verify Parameters from a Template', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const parameterTemplate = 'Test Parameters'

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Notes tab
      const notesTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Notes)) as ClaimsPortalClaimNotesTab
      await notesTab.page.waitForTimeout(1000)

      const createNoteDrawer = await notesTab.OpenCreateNoteDrawer()

      // Select the template with parameters
      await createNoteDrawer.SelectNoteTemplate(parameterTemplate)

      // Verify that expected parameters have been filled in in the Note Text
      const actualNoteText = await createNoteDrawer.TextArea_NoteText.GetText()
      const expectedClaimNumber = `Claim Number = ${testClaim.basicInfo.claimNumber}`
      const expectedClaimStatus = `Claim Status = ${testClaim.basicInfo.claimStatus}`
      const expectedCarrier = `Carrier = ${testClaim.basicInfo.carrier}`
      const expectedLossType = `Loss Type = ${testClaim.lossInformation.type.toUpperCase()}`
      const expectedLossDescription = `Loss Description = ${testClaim.lossInformation.description}`
      const expectedLossDate = `Date Of Loss = ${new Date(Date.parse(testClaim.lossInformation.date)).toISOString()}`
      const expectedPolicyNumber = `Policy Number = ${testClaim.basicInfo.policyNumber}`
      expect.soft(actualNoteText).toContain(expectedClaimNumber)
      expect.soft(actualNoteText).toContain(expectedClaimStatus)
      expect.soft(actualNoteText).toContain(expectedCarrier)
      expect.soft(actualNoteText).toContain(expectedLossType)
      expect.soft(actualNoteText).toContain(expectedLossDescription)
      expect.soft(actualNoteText).toContain(expectedLossDate)
      expect.soft(actualNoteText).toContain(expectedPolicyNumber)
    })
  }
)
