import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { ClaimsPortalClaim } from '../claimsPortalClaim.js'
import { DateDirection, ScheduleTabStrings, InspectorRoleOptions, Months } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalCancelInspectionDrawer } from '../drawers/claimsPortalCancelInspectionDrawer.js'
import { ClaimsPortalCompleteInspectionDrawer } from '../drawers/claimsPortalCompleteInspectionDrawer.js'
import { ClaimsPortalRequestInspectionDrawer } from '../drawers/claimsPortalRequestInspectionDrawer.js'
import { ClaimsPortalScheduleInspectionDrawer } from '../drawers/claimsPortalScheduleInspectionDrawer.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalCalendarEvent } from '../claimsPortalCalendarEvent.js'

export class ClaimsPortalClaimScheduleTab extends ClaimsPortalBasePage {
  readonly claim: ClaimsPortalClaim
  readonly URL: string
  readonly Title: Element
  readonly Button_RequestInspection: Element
  readonly Button_ScheduleInspection: Element
  readonly Button_Next: Element
  readonly Button_Previous: Element
  readonly Label_CurrentMonth: Element

  constructor(global: ClaimsPortalGlobal, claim: ClaimsPortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/schedule`
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${ScheduleTabStrings.Title_InspectionsSchedule}` }),
      ScheduleTabStrings.Title_InspectionsSchedule
    )
    this.Button_RequestInspection = new Element(
      global.page,
      this.page.getByRole('button', { name: ScheduleTabStrings.Button_RequestInspection }),
      ScheduleTabStrings.Button_RequestInspection
    )
    this.Button_ScheduleInspection = new Element(
      global.page,
      this.page.getByRole('button', { name: ScheduleTabStrings.Button_ScheduleInspection }),
      ScheduleTabStrings.Button_ScheduleInspection
    )
    this.Button_Previous = new Element(
      global.page,
      this.page.getByRole('button', { name: ScheduleTabStrings.Button_Previous }).nth(0),
      ScheduleTabStrings.Button_Previous
    )
    this.Button_Next = new Element(
      global.page,
      this.page.getByRole('button', { name: ScheduleTabStrings.Button_Next }).nth(0),
      ScheduleTabStrings.Button_Next
    )
    this.Label_CurrentMonth = new Element(
      global.page,
      this.page.locator('#root div[data-slot="card-content"] p[title="Current Month"]').nth(0)
    )
  }

  async InspectionRequestCount() {
    const requestLocator = this.page.locator(
      'div[id$="_content"] div[data-status="warning"][role="alert"]'
    )
    const inspectionRequestCount = await requestLocator.count()
    return inspectionRequestCount
  }

  async CancelInspectionRequest(requestIndex: number, canceledBy: string) {
    const cancelInspectionDrawer = await this.OpenCancelRequestedInspectionDrawer(requestIndex)
    await cancelInspectionDrawer.ListBox_CanceledBy.locator.click()
    await cancelInspectionDrawer.ListBox_CanceledBy.Fill(canceledBy)
    await cancelInspectionDrawer.ListBox_CanceledBy.locator.press('Enter')
    await cancelInspectionDrawer.Button_Submit.Click()
    await cancelInspectionDrawer.Title.locator.waitFor({ state: 'detached' })
  }

  async RequestInspection(inspectionRole: InspectorRoleOptions, requestedBy: string) {
    const requestInspectionDrawer = await this.OpenRequestInspectionDrawer()
    await requestInspectionDrawer.SetInspectorRoleSelection(inspectionRole)
    await requestInspectionDrawer.ListBox_RequestedBy.locator.click()
    await this.page.waitForTimeout(500)
    await requestInspectionDrawer.ListBox_RequestedBy.Fill(requestedBy)
    await requestInspectionDrawer.ListBox_RequestedBy.locator.press('Enter')
    await requestInspectionDrawer.Button_Submit.Click()
    await requestInspectionDrawer.Title.locator.waitFor({ state: 'detached' })
  }

  async ScheduleRequestedInspection(requestIndex: number, scheduledBy: string) {
    const scheduleRequestedInspectionDrawer =
      await this.OpenScheduleRequestedInspectionDrawer(requestIndex)
    await scheduleRequestedInspectionDrawer.ListBox_ScheduledBy.locator.click()
    await scheduleRequestedInspectionDrawer.ListBox_ScheduledBy.Fill(scheduledBy)
    await scheduleRequestedInspectionDrawer.ListBox_ScheduledBy.locator.press('Enter')
    await scheduleRequestedInspectionDrawer.Button_Submit.Click()
    await scheduleRequestedInspectionDrawer.Title.locator.waitFor({ state: 'detached' })
  }

  async OpenScheduleRequestedInspectionDrawer(requestIndex: number) {
    const scheduleButtonLocator = this.page
      .locator('div[id$="_content"] div[data-status="warning"][role="alert"]')
      .nth(requestIndex)
      .getByRole('button', { name: ScheduleTabStrings.Button_ScheduleRequestedInspection })
    await scheduleButtonLocator.click()
    const scheduleInspectionDrawer = new ClaimsPortalScheduleInspectionDrawer(this.global)
    await scheduleInspectionDrawer.Title.locator.waitFor({ state: 'attached' })
    return scheduleInspectionDrawer
  }

  async OpenCancelRequestedInspectionDrawer(requestIndex: number) {
    const cancelButtonLocator = this.page
      .locator('div[id$="_content"] div[data-status="warning"][role="alert"]')
      .nth(requestIndex)
      .getByRole('button', { name: ScheduleTabStrings.Button_CancelInspectionRequest })
    await cancelButtonLocator.click()
    const cancelInspectionDrawer = new ClaimsPortalCancelInspectionDrawer(this.global)
    await cancelInspectionDrawer.Title.locator.waitFor({ state: 'attached' })
    return cancelInspectionDrawer
  }

  async OpenScheduleInspectionDrawer() {
    await this.Button_ScheduleInspection.Click()
    const scheduleInspectionDrawer = new ClaimsPortalScheduleInspectionDrawer(this.global)
    return scheduleInspectionDrawer
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
      .locator(
        `div[id$="_content"] > div > div:nth-child(2) div[title="Events for ${displayedMonth} ${dayTarget}"] ul`
      )
      .first()
      .locator(`li`)
    const dayEvents: ClaimsPortalCalendarEvent[] = []
    let estimatorInfo = 'No inspector'
    const eventCount = await allEventsForTargetDay.count()
    for (let i = 0; i < eventCount; i++) {
      const specificEventForTargetDay = this.page
        .locator(
          `div[id$="_content"] > div > div:nth-child(2) div[title="Events for ${displayedMonth} ${dayTarget}"] ul`
        )
        .first()
        .locator(`li:nth-child(${i + 1})`)

      const monthDayInfo = `${displayedMonth} ${dayTarget}`
      const timeInfo = await specificEventForTargetDay
        .locator('> div > div > h3')
        .nth(0)
        .textContent()
      const status = await specificEventForTargetDay
        .locator('> div > div > h3')
        .nth(1)
        .textContent()
      const claimLink = await specificEventForTargetDay
        .locator('> div > div > a')
        .getAttribute('href')
      const noInspector =
        (await specificEventForTargetDay.locator('> div > div > div > span').count()) == 0
      if (!noInspector) {
        const estimator = await specificEventForTargetDay
          .locator('> div > div > div > span')
          .textContent()
        estimatorInfo = estimator ? estimator : ''
      }

      const seeNotesLocator = specificEventForTargetDay.getByRole('button', { name: 'See Notes' })
      const actionsLocator = specificEventForTargetDay.getByRole('button', { name: 'Actions' })
      const event = new ClaimsPortalCalendarEvent()
      event.monthDay = monthDayInfo
      event.month = displayedMonth
      event.day = Number(dayTarget)
      event.time = timeInfo
      event.status = status
      event.claimLink = claimLink!
      event.claimLinkLocator = specificEventForTargetDay.locator('> div > div > a')
      event.estimator = estimatorInfo
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
      .locator(
        `div[id$="_content"] > div > div:nth-child(2) div[title="Events for ${displayedMonth} ${dayTarget}"] ul`
      )
      .first()
      .locator(`li:nth-child(${eventIndex + 1})`)

    const estimatorLocator = specificEventForTargetDay.locator('div > div > div > span')
    const estimatorTooltip = await this.GetToolTipForLocator(estimatorLocator)
    return { estimator: estimatorTooltip }
  }

  async GetToolTipForLocator(elementLocator: Locator) {
    await elementLocator.scrollIntoViewIfNeeded()
    await elementLocator.hover({ force: true })
    await this.page.waitForTimeout(1000)
    const referenceId = await elementLocator.locator('..').getAttribute('aria-describedby')
    const toolTip = await this.page.locator(`div[id='${referenceId}']`).textContent()
    return toolTip
  }

  async GetEventsForVisibleMonth(onlyScheduledEvents = false) {
    const allEventsForVisibleMonth = this.page.locator(
      'div[id$="_content"] > div > div:nth-child(2) div[title*="Events for "] ul>li:nth-child(1)'
    )
    const monthEvents: ClaimsPortalCalendarEvent[][] = []
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
      await this.leftNavBar.GoHome()
      await this.leftNavBar.Button_Admin.Click()
      await this.page.waitForLoadState()
      await this.leftNavBar.Button_Admin_Estimator.Click()
    }
    await this.page.waitForTimeout(2000)
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async OpenCancelInspectionDrawer(actionsButton: Locator) {
    await actionsButton.click({ force: true })
    const controls = await actionsButton.getAttribute('aria-controls')
    const markCanceledButton = this.page
      .locator(`div[id="${controls}"]`)
      .getByRole('menuitem', { name: 'Mark Canceled' })
    await markCanceledButton.click()
    const cancelInspectionDrawer = new ClaimsPortalCancelInspectionDrawer(this.global)
    return cancelInspectionDrawer
  }

  async OpenCompleteInspectionDrawer(actionsButton: Locator) {
    await actionsButton.click({ force: true })
    const controls = await actionsButton.getAttribute('aria-controls')
    const markCompletedButton = this.page
      .locator(`div[id="${controls}"]`)
      .getByRole('menuitem', { name: 'Mark Completed' })
    await markCompletedButton.click()
    const completeInspectionDrawer = new ClaimsPortalCompleteInspectionDrawer(this.global)
    return completeInspectionDrawer
  }

  async OpenRequestInspectionDrawer() {
    await this.Button_RequestInspection.Click()
    const requestInspectionDrawer = new ClaimsPortalRequestInspectionDrawer(this.global)
    return requestInspectionDrawer
  }
}
