import { Locator, expect } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DelegatePortalCalendarEvent } from '../delegatePortalCalendarEvent.js'
import { DelegatePortalBasePage } from './delegatePortalBasePage.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DateDirection, JobInspectionsSchedulePageStrings, Months } from '../delegatePortalConstants.js'

export class DelegatePortalJobInspectionsSchedulePage extends DelegatePortalBasePage {
  readonly Title: Element
  readonly Button_Next: Element
  readonly Button_Previous: Element
  readonly Label_CurrentMonth: Element
  private readonly noInspectionsFound: Locator

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${JobInspectionsSchedulePageStrings.Title}` }),
      JobInspectionsSchedulePageStrings.Title
    )
    this.URL = `${global.baseUrl}schedules/inspections/claims`
    this.Button_Previous = new Element(
      global.page,
      this.page.getByRole('button', { name: 'Previous' })
    )
    this.Button_Next = new Element(global.page, this.page.getByRole('button', { name: 'Next' }))
    this.Label_CurrentMonth = new Element(
      global.page,
      this.page.locator('#root div.chakra-card__body p[title="Current Month"]').nth(0)
    )
    this.noInspectionsFound = this.page.locator(
      '#root .chakra-container div[data-status="warning"] div[data-status="warning"]'
    )
  }

  async VerifyDelegateHasNoInspections() {
    expect((await this.noInspectionsFound.count()) > 0).toBe(true)
    const warningText = await this.noInspectionsFound.textContent()
    expect(warningText == JobInspectionsSchedulePageStrings.Warning_NoInspectionsFound).toBe(true)
  }

  async CalendarInfo() {
    const displayedMonth = await this.Label_CurrentMonth.GetText()
    if (displayedMonth == undefined) {
      throw new Error('Unable to get calendar Month info')
    }
    const dataList = displayedMonth?.split(' ')
    if (dataList.length == 2) {
      return {
        displayedMonth: dataList[0],
        displayedYear: Number(dataList[1]),
        yearIsHidden: false,
      }
    } else {
      return {
        displayedMonth: dataList[0],
        displayedYear: new Date().getFullYear(),
        yearIsHidden: true,
      }
    }
  }

  async GetEventsForVisibleDate(day: number, onlyScheduledEvents = false) {
    const dayTarget = day.toString()
    const displayedMonth = await this.Label_CurrentMonth.GetText()
    const allEventsForTargetDay = this.page
      .locator(`div[id$="_content"] div[title="Events for ${displayedMonth} ${dayTarget}"] ul`)
      .first()
      .locator(`li`)
    const dayEvents: DelegatePortalCalendarEvent[] = []
    let delegateInfo = 'No inspector'
    const eventCount = await allEventsForTargetDay.count()
    for (let i = 0; i < eventCount; i++) {
      const specificEventForTargetDay = this.page
        .locator(`div[id$="_content"] div[title="Events for ${displayedMonth} ${dayTarget}"] ul`)
        .first()
        .locator(`:nth-child(${i + 1})`)
      const monthDayInfo = `${displayedMonth} ${dayTarget}`
      const timeInfo = await specificEventForTargetDay.locator('> div > h3').textContent()
      const status = await specificEventForTargetDay.locator('> div > div > h3').textContent()
      const claimLink = await specificEventForTargetDay
        .locator('> div > div > a')
        .getAttribute('href')
      const noInspector =
        (await specificEventForTargetDay.locator('> div > div > div > span').count()) == 0
      if (!noInspector) {
        const delegate = await specificEventForTargetDay
          .locator('> div > div > div > span')
          .textContent()
        delegateInfo = delegate ? delegate : ''
      }

      const seeNotesLocator = specificEventForTargetDay.getByRole('button', { name: 'See Notes' })
      const actionsLocator = specificEventForTargetDay.getByRole('button', { name: 'Actions' })
      const event = new DelegatePortalCalendarEvent()
      event.monthDay = monthDayInfo
      event.month = displayedMonth
      event.day = Number(dayTarget)
      event.time = timeInfo
      event.status = status
      event.claimLink = claimLink!
      event.claimLinkLocator = specificEventForTargetDay.locator('> div > div > a')
      event.delegate = delegateInfo
      event.seeNotesButton = seeNotesLocator
      event.actionsButton = actionsLocator
      if (onlyScheduledEvents && status == 'Scheduled') {
        dayEvents.push(event)
      } else {
        dayEvents.push(event)
      }
    }
    return dayEvents
  }

  async GetDayEventToolTips(day: number, eventIndex = 0) {
    const dayTarget = day.toString()
    const displayedMonth = await this.Label_CurrentMonth.GetText()
    const specificEventForTargetDay = this.page
      .locator(`div[id$="_content"] div[title="Events for ${displayedMonth} ${dayTarget}"] ul`)
      .first()
      .locator(`:nth-child(${eventIndex + 1})`)
    const delegateLocator = specificEventForTargetDay.locator('div > div > div > span')
    const delegateTooltip = await this.GetToolTipForLocator(delegateLocator)
    return { delegate: delegateTooltip }
  }

  async GetToolTipForLocator(elementLocator: Locator) {
    await elementLocator.scrollIntoViewIfNeeded()
    await elementLocator.hover({ force: true })
    await this.page.waitForTimeout(3000)
    const referenceId = await elementLocator.locator('..').getAttribute('aria-describedby')
    const toolTip = await this.page.locator(`div[id='${referenceId}']`).textContent()
    return toolTip
  }

  async GetEventsForVisibleMonth(onlyScheduledEvents = false) {
    const allEventsForVisibleMonth = this.page.locator(
      'div[id$="_content"] div[title*="Events for "] ul>li:nth-child(1)'
    )
    const monthEvents: DelegatePortalCalendarEvent[][] = []
    const monthEventsCount = await allEventsForVisibleMonth.count()
    for (let i = 0; i < monthEventsCount; i++) {
      const targetDayTitle = await this.page
        .locator('div[id$="_content"] ul>li')
        .nth(i)
        .locator('..')
        .locator('..')
        .getAttribute('title')
      if (targetDayTitle == null) {
        throw new Error(`Unexpected error locating the Day title of the target calendar date`)
      }
      const dataList = targetDayTitle.split(' ')
      const targetDate = Number(dataList[3])
      const targetDayEvents = await this.GetEventsForVisibleDate(targetDate, onlyScheduledEvents)
      if (targetDayEvents.length > 0) {
        monthEvents.push(targetDayEvents)
      }
    }
    return monthEvents
  }

  async NavigateCalendarToSpecificMonthAndYear(
    targetMonth: Months,
    targetYear: number,
    direction: DateDirection
  ) {
    const { displayedYear } = await this.CalendarInfo()
    while (displayedYear != targetYear) {
      if (direction == DateDirection.Past) {
        await this.Button_Previous.Click()
      }
      if (direction == DateDirection.Future) {
        await this.Button_Next.Click()
      }
      // const { displayedYear } =
      await this.CalendarInfo()
    }
    const { displayedMonth } = await this.CalendarInfo()
    while (displayedMonth != targetMonth) {
      if (direction == DateDirection.Past) {
        await this.Button_Previous.Click()
      }
      if (direction == DateDirection.Future) {
        await this.Button_Next.Click()
      }
      // const { displayedMonth } =
      await this.CalendarInfo()
    }
    await this.page.waitForTimeout(2000)
  }

  async NavigateCalendarToRelativeYear(howManyYears: number, direction: DateDirection) {
    for (let i = 0; i < 12 * howManyYears; i++) {
      if (direction == DateDirection.Past) {
        await this.Button_Previous.Click()
      }
      if (direction == DateDirection.Future) {
        await this.Button_Next.Click()
      }
    }
  }

  async NavigateCalendarToRelativeMonth(howManyMonths: number, direction: DateDirection) {
    for (let i = 0; i < howManyMonths; i++) {
      if (direction == DateDirection.Past) {
        await this.Button_Previous.Click()
      }
      if (direction == DateDirection.Future) {
        await this.Button_Next.Click()
      }
    }
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.page.goto(this.URL)
    } else {
      await this.leftNavBar.Button_Schedule.Click()
    }
    await this.page.waitForTimeout(2000)
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }
}
