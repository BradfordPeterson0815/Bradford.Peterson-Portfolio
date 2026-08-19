import { Locator } from '@playwright/test'
import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { ClaimsPortalBase } from './pages/claimsPortalBase.js'
import { Element } from '../shared/element.js'
import { NoteDataSourceTuples, NoteDataSources } from './claimsPortalConstants.js'
import { ClaimsPortalExportNoteDrawer } from './drawers/claimsPortalExportNoteDrawer.js'

export class ClaimsPortalNote extends ClaimsPortalBase {
  private readonly dateParent: Locator
  private readonly main: Locator
  readonly Button_ExpandNote: Element
  readonly Button_CollapseNote: Element
  readonly Button_ExportNote: Element
  private readonly badge: Locator
  private readonly xaImportComplete: Locator
  private readonly xaImportPending: Locator
  private readonly dateTime: Locator
  private readonly subject: Locator
  private readonly title: Locator
  private readonly createdBy: Locator
  private readonly createdOn: Locator
  private readonly category: Locator

  constructor(global: ClaimsPortalGlobal, main: Locator, dateParent: Locator) {
    super(global)
    this.dateParent = dateParent
    this.main = main
    this.Button_ExpandNote = new Element(
      global.page,
      this.main.locator('button[aria-expanded="false"]')
    )
    this.Button_CollapseNote = new Element(
      global.page,
      this.main.locator('button[aria-expanded="true"]')
    )
    this.Button_ExportNote = new Element(
      global.page,
      this.main.locator('button[aria-label="Export Note"]')
    )
    this.xaImportComplete = this.main.locator(
      'div.chakra-card__header > div > div > span > svg > g'
    )
    this.xaImportPending = this.main.locator(
      'div.chakra-card__header > div > div > span > svg > circle'
    )
    this.badge = this.main.locator('span.chakra-badge')
    this.dateTime = this.main.locator('div.chakra-card__header > div > button > div > div')
    this.subject = this.main.locator('div.chakra-card__header > div > button > div > div > p')
    this.title = this.main.locator('div.chakra-card__body textarea')
    this.createdBy = this.main
      .locator('div.chakra-card__footer > dl > div')
      .nth(0)
      .locator('> dd > span > span[property="createdBy"]')
    this.createdOn = this.main.locator('div.chakra-card__footer > dl > div').nth(1).locator('> dd')
    this.category = this.main.locator('div.chakra-card__footer > dl > div').nth(2).locator('> dd')
  }

  async DateParentInfo() {
    const dateInfo = await this.dateParent.locator('> p').textContent()
    if (dateInfo == null) {
      throw new Error('Unable to get date information from Note parent')
    }
    return dateInfo
  }

  async IsExpanded() {
    return await this.Button_CollapseNote.IsVisible()
  }

  async ExpandIfNeeded() {
    const isExpanded = await this.IsExpanded()
    if (!isExpanded) {
      await this.Button_ExpandNote.Click()
      await this.page.waitForTimeout(500)
    }
  }

  async CollapseIfNeeded() {
    const isExpanded = await this.IsExpanded()
    if (isExpanded) {
      await this.Button_CollapseNote.Click()
      await this.page.waitForTimeout(500)
    }
  }

  async HasDataSource() {
    return await this.badge.isVisible()
  }

  async DataSource() {
    if (await this.HasDataSource()) {
      const dataSource = await this.badge.textContent()
      if (dataSource != null) {
        switch (dataSource) {
          case NoteDataSourceTuples.ClaimsPortal[1]:
            return NoteDataSources.ClaimsPortal
          case NoteDataSourceTuples.Redacted[1]:
            return NoteDataSources.Redacted
          case NoteDataSourceTuples.Delegate[1]:
            return NoteDataSources.Delegate
          case NoteDataSourceTuples.UserPortal[1]:
            return NoteDataSources.UserPortal
          case NoteDataSourceTuples.EmailSending[1]:
            return NoteDataSources.EmailSending
          case NoteDataSourceTuples.EmailReceiving[1]:
            return NoteDataSources.EmailReceiving
          case NoteDataSourceTuples.Inspections[1]:
            return NoteDataSources.Inspections
        }
      }
    }
    return null
  }

  async DateTime() {
    const dateTime = await this.dateTime.evaluate((el) => el.firstChild?.textContent)
    return dateTime == null ? '' : dateTime
  }

  async Subject() {
    const subject = await this.subject.textContent()
    return subject == null ? '' : subject
  }

  async Title() {
    await this.ExpandIfNeeded()
    const title = await this.title.textContent()
    return title == null ? '' : title
  }

  async CreatedBy() {
    await this.ExpandIfNeeded()
    const createdBy = await this.createdBy.textContent()
    return createdBy == null ? '' : createdBy
  }

  async CreatedOn() {
    await this.ExpandIfNeeded()
    const createdOn = await this.createdOn.textContent()
    return createdOn == null ? '' : createdOn
  }

  async Category() {
    await this.ExpandIfNeeded()
    const category = await this.category.textContent()
    return category == null ? '' : category
  }

  async IsRedacted1ImportStatusAvailable() {
    const isPending = (await this.xaImportPending.count()) > 0
    const isComplete = (await this.xaImportComplete.count()) > 0
    return isPending || isComplete
  }

  async IsRedacted1ImportCompleted() {
    return (await this.xaImportComplete.count()) > 0
  }

  async IsRedacted1ImportPending() {
    return (await this.xaImportPending.count()) > 0
  }

  async IsExportNoteAvailable() {
    return await this.Button_ExportNote.IsEnabled()
  }

  async OpenExportNoteDrawer() {
    await this.Button_ExportNote.Click()
    return new ClaimsPortalExportNoteDrawer(this.global)
  }
}
