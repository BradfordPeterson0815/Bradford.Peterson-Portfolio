import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalClaim } from '../claimsPortalClaim.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { Locator } from '@playwright/test'
import { NoteDataSourceTuples, NoteDataSources, NotesTabStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalNote } from '../claimsPortalNote.js'
import { ClaimsPortalNotesFilterDialog } from '../dialogs/claimsPortalNotesFilterDialog.js'
import { ClaimsPortalCreateNoteDrawer } from '../drawers/claimsPortalCreateNoteDrawer.js'

export class ClaimsPortalClaimNotesTab extends ClaimsPortalBasePage {
  readonly claim: ClaimsPortalClaim
  readonly URL: string
  readonly Title: Element
  readonly Label_NoNotesHaveBeenAdded_Title: Element
  readonly Label_NoNotesHaveBeenAdded_Description: Element
  readonly Label_NoNotesMatch: Element
  readonly Button_NoNotes_AddNote: Element
  readonly Button_AddNote: Element
  readonly Button_ChangeSortToAscending: Element
  readonly Button_ChangeSortToDescending: Element
  readonly Button_FilterNotes: Element
  readonly TextBox_Search: Element
  readonly Button_ClearSearch: Element
  readonly parent: Locator
  readonly dates: Locator
  readonly allNotes: Locator

  constructor(global: ClaimsPortalGlobal, claim: ClaimsPortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/notes`
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${NotesTabStrings.Title}`, exact: true }),
      NotesTabStrings.Title
    )
    this.Button_AddNote = new Element(
      global.page,
      this.page.locator(`button[aria-label="Add note."]`)
    )
    this.Button_ChangeSortToAscending = new Element(
      global.page,
      this.page.locator(`button[aria-label="Change sort to: ascending."]`)
    )
    this.Button_ChangeSortToDescending = new Element(
      global.page,
      this.page.locator(`button[aria-label="Change sort to: descending."]`)
    )
    this.Button_FilterNotes = new Element(
      global.page,
      this.page.getByRole('button', { name: `${NotesTabStrings.Button_FilterNotes}` }),
      NotesTabStrings.Button_FilterNotes
    )
    this.TextBox_Search = new Element(
      global.page,
      this.page.locator(`input[placeholder="Type to search notes..."]`)
    )
    this.Button_ClearSearch = new Element(
      global.page,
      this.page.locator(`button[aria-label="Clear search."]`)
    )
    this.parent = this.page.locator(
      'div.chakra-container > div > div:nth-of-type(3) > div.chakra-stack'
    )
    this.Label_NoNotesHaveBeenAdded_Title = new Element(
      global.page,
      this.parent.locator('h3').first(),
      NotesTabStrings.Label_NoNotesHaveBeenAdded_Title
    )
    this.Label_NoNotesHaveBeenAdded_Description = new Element(
      global.page,
      this.Label_NoNotesHaveBeenAdded_Title.locator.locator('..').locator('p'),
      NotesTabStrings.Label_NoNotesHaveBeenAdded_Description
    )
    this.Button_NoNotes_AddNote = new Element(
      global.page,
      this.Label_NoNotesHaveBeenAdded_Title.locator
        .locator('..')
        .getByRole('button', { name: `${NotesTabStrings.Button_NoNotes_AddNote}` }),
      NotesTabStrings.Button_NoNotes_AddNote
    )

    this.Label_NoNotesMatch = new Element(
      global.page,
      this.parent.locator('> div > div > div[data-status="info"]'),
      NotesTabStrings.Label_NoNotesMatch
    )

    this.dates = this.parent.locator('> div > p')
    this.allNotes = this.parent.locator('> div > div > div.chakra-accordion')
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.IsEmpty()
  }

  async IsEmpty() {
    const count = await this.Label_NoNotesHaveBeenAdded_Title.locator.count()
    return count > 0
  }

  async NoMatch() {
    const count = await this.Label_NoNotesMatch.locator.count()
    return count > 0
  }

  async IsSortedAscending() {
    return await this.Button_ChangeSortToDescending.IsVisible()
  }

  async IsSortedDescending() {
    return await this.Button_ChangeSortToAscending.IsVisible()
  }

  async DatesCount() {
    if ((await this.IsEmpty()) || (await this.NoMatch())) {
      return 0
    }
    await this.dates.nth(0).waitFor({ state: 'visible' })
    return await this.dates.count()
  }

  async AllNotesCount() {
    if (await this.IsEmpty()) {
      return 0
    }
    await this.allNotes.nth(0).waitFor({ state: 'visible' })
    return await this.allNotes.count()
  }

  async NotesOnDateCount(dateIndex: number) {
    const dateParentLocator = this.dates.nth(dateIndex).locator('..')
    const noteLocator = dateParentLocator.locator('> div > div.chakra-accordion')
    return await noteLocator.count()
  }

  async FetchNoteForDateByIndex(dateIndex: number, noteIndex: number) {
    const dateParentLocator = this.dates.nth(dateIndex).locator('..')
    const noteLocator = dateParentLocator.locator('> div > div.chakra-accordion').nth(noteIndex)
    const note = new ClaimsPortalNote(this.global, noteLocator, dateParentLocator)
    return note
  }

  async PerformSearch(searchTerm: string) {
    await this.page.waitForTimeout(1000)
    await this.TextBox_Search.FillByTyping(searchTerm, 100)
    await this.page.waitForTimeout(1000)
  }

  async OpenFilterNotes() {
    await this.Button_FilterNotes.Click()
    const notesFilterDialog = new ClaimsPortalNotesFilterDialog(this.global)
    return notesFilterDialog
  }

  async ClearNotesFilter() {
    const notesFilterDialog = await this.OpenFilterNotes()
    for (const dataSourceKey in NoteDataSourceTuples) {
      const dataSourceTuple =
        NoteDataSourceTuples[dataSourceKey as keyof typeof NoteDataSourceTuples]
      await notesFilterDialog.SetCheckFilter(dataSourceTuple[1].toString(), false)
    }
    await this.page.waitForTimeout(1000)
    await notesFilterDialog.Close()
  }

  async SetNotesFilter(dataSourceCheckedValues: number, skipClose = false) {
    const notesFilterDialog = await this.OpenFilterNotes()
    for (const dataSourceKey in NoteDataSourceTuples) {
      const dataSourceTuple = NoteDataSourceTuples[
        dataSourceKey as keyof typeof NoteDataSourceTuples
      ] as NoteDataSources[]
      if (dataSourceCheckedValues & dataSourceTuple[0]) {
        await notesFilterDialog.SetCheckFilter(dataSourceTuple[1].toString(), true)
      } else {
        await notesFilterDialog.SetCheckFilter(dataSourceTuple[1].toString(), false)
      }
    }
    if (!skipClose) {
      await notesFilterDialog.Close()
      return
    }
    await this.page.waitForTimeout(1000)
    return notesFilterDialog
  }

  async OpenCreateNoteDrawer() {
    await this.Button_AddNote.Click()
    const drawer = new ClaimsPortalCreateNoteDrawer(this.global)
    await drawer.Button_Submit.locator.waitFor({ state: 'visible' })
    return drawer
  }
}
