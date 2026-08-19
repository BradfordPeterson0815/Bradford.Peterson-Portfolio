import { DelegatePortalBasePage } from '../pages/delegatePortalBasePage.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { Element } from '../../shared/element.js'
import { Locator } from '@playwright/test'
import {
  NoteDataSourceTuples,
  NoteDataSources,
  ClaimNotesTabStrings,
} from '../delegatePortalConstants.js'
import { DelegatePortalCreateNoteDrawer } from '../drawers/delegatePortalCreateNoteDrawer.js'
import { DelegatePortalNote } from '../delegatePortalNote.js'
import { DelegatePortalNotesFilterDialog } from '../dialogs/delegatePortalNotesFilterDialog.js'
import { DelegatePortalJob } from '../delegatePortalJob.js'

export class DelegatePortalJobNotesTab extends DelegatePortalBasePage {
  readonly job: DelegatePortalJob
  readonly URL: string
  readonly Title: Element
  readonly Button_AddNote: Element
  readonly Button_ChangeSortToAscending: Element
  readonly Button_ChangeSortToDescending: Element
  readonly Button_FilterNotes: Element
  readonly TextBox_Search: Element
  readonly Button_ClearSearch: Element
  readonly parent: Locator
  readonly dates: Locator
  readonly allNotes: Locator

  constructor(global: DelegatePortalGlobal, job: DelegatePortalJob) {
    super(global)
    this.job = job
    this.URL = `${global.baseUrl}jobs/${job.jobDetails.jobId}/notes`
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${ClaimNotesTabStrings.Title}`, exact: true }),
      ClaimNotesTabStrings.Title
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
      this.page.getByRole('button', { name: `${ClaimNotesTabStrings.Button_FilterNotes}` }),
      ClaimNotesTabStrings.Button_FilterNotes
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
    this.dates = this.parent.locator('> div > p')
    this.allNotes = this.parent.locator('> div > div > div.chakra-accordion')
  }

  async IsSortedAscending() {
    return await this.Button_ChangeSortToDescending.IsVisible()
  }

  async IsSortedDescending() {
    return await this.Button_ChangeSortToAscending.IsVisible()
  }

  async DatesCount() {
    return await this.dates.count()
  }

  async AllNotesCount() {
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
    const note = new DelegatePortalNote(this.global, noteLocator, dateParentLocator)
    return note
  }

  async PerformSearch(searchTerm: string) {
    await this.page.waitForTimeout(1000)
    await this.TextBox_Search.FillByTyping(searchTerm, 100)
    await this.page.waitForTimeout(1000)
  }

  async OpenFilterNotes() {
    await this.Button_FilterNotes.Click()
    const notesFilterDialog = new DelegatePortalNotesFilterDialog(this.global)
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
    return new DelegatePortalCreateNoteDrawer(this.global)
  }
}
