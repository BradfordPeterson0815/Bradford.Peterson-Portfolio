import { Locator, expect } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DateDirection, EstimatorSchedulesPageStrings, Months } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalCancelInspectionDrawer } from '../drawers/claimsPortalCancelInspectionDrawer.js'
import { ClaimsPortalCompleteInspectionDrawer } from '../drawers/claimsPortalCompleteInspectionDrawer.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'
import { ClaimsPortalCalendarEvent } from '../claimsPortalCalendarEvent.js'

export class ClaimsPortalEstimatorSchedulesPage extends ClaimsPortalBasePage {
  readonly Title: Element
  readonly ListBox_SelectEstimators: Element
  readonly Button_ClearSelection: Element
  readonly Button_Next: Element
  readonly Button_Previous: Element
  readonly Label_CurrentMonth: Element
  readonly listIsEmpty: Locator
  readonly noInspectionsFound: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${EstimatorSchedulesPageStrings.Title}` }),
      EstimatorSchedulesPageStrings.Title
    )
    this.URL = `${global.baseUrl}schedules/estimator`
    this.ListBox_SelectEstimators = new Element(
      global.page,
      //#root div[id$="_content"]
      //this.page.locator('#root div[data-testid="_content"] input')
      this.page.locator('#root div[id$="_content"] input')
    )
    this.Button_Previous = new Element(
      global.page,
      this.page.getByRole('button', { name: 'Previous' })
    )
    this.Button_Next = new Element(global.page, this.page.getByRole('button', { name: 'Next' }))
    this.Label_CurrentMonth = new Element(
      global.page,
      this.page.locator(
        '#root div.chakra-card__body > div > div:nth-child(2) > div:nth-child(2) > div > p[title="Current Month"]'
      )
    )
    this.listIsEmpty = this.page.locator('#root div input[aria-describedby]')
    this.noInspectionsFound = this.page.locator(
      '#root div[data-status="warning"] div[data-status="warning"]'
    )
    this.Button_ClearSelection = new Element(
      global.page,
      this.page.locator('#root div[role="button"][aria-label="Clear selected options"]')
    )
  }

  async GetEstimatorCountFromList() {
    await this.ListBox_SelectEstimators.Click()
    const optionLocator = this.page.getByRole('option')
    const itemCount = await optionLocator.count()
    await this.page.keyboard.press('Escape')
    return itemCount
  }

  async AddEstimatorToSelection(estimatorToSelect: string) {
    await this.ListBox_SelectEstimators.Click()
    const optionLocator = this.page.getByRole('option', { name: `${estimatorToSelect}` }).first()
    await optionLocator.click()
    await this.page.waitForTimeout(1000)
  }

  async AddEstimatorToSelectionByIndex(index: number) {
    await this.ListBox_SelectEstimators.Click()
    const optionLocator = this.page.getByRole('option').nth(index)
    const estimatorName = await optionLocator.textContent()
    await optionLocator.click()
    await this.page.waitForTimeout(1000)
    return estimatorName ?? ''
  }

  async RemoveSelectedEstimator(estimatorToRemove: string) {
    const selectedEstimatorLocator = this.page.locator(
      `div[aria-label="Remove ${estimatorToRemove}"]`
    )
    await selectedEstimatorLocator.click()
  }

  async IsEstimatorRemoveable(estimatorToCheck: string) {
    const selectedEstimatorLocator = this.page.locator(
      `div[aria-label="Remove ${estimatorToCheck}"]`
    )
    const selectedAlready = await selectedEstimatorLocator.count()
    return selectedAlready > 0
  }

  async IsEstimatorSelectable(estimatorToCheck: string) {
    await this.ListBox_SelectEstimators.Click()
    const optionLocator = this.page.getByRole('option', { name: `${estimatorToCheck}` }).first()
    const inTheList = await optionLocator.count()
    return inTheList > 0
  }

  async ClearEstimatorToSelection() {
    if (await this.Button_ClearSelection.IsVisible()) {
      await this.Button_ClearSelection.Click()
    }
  }

  async VerifySelectEstimatorsIsEmpty() {
    expect((await this.listIsEmpty.count()) > 0).toBe(true)
    const referenceId = await this.ListBox_SelectEstimators.locator.getAttribute('aria-describedby')
    const listPlaceholder = await this.page.locator(`div[id='${referenceId}']`).textContent()
    expect(
      listPlaceholder == EstimatorSchedulesPageStrings.ListBox_SelectEstimators_Placeholder
    ).toBe(true)
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
      .first()
    const dayEvents: ClaimsPortalCalendarEvent[] = []
    let estimatorInfo = 'No inspector'
    const eventCount = await allEventsForTargetDay.count()
    for (let i = 0; i < eventCount; i++) {
      const specificEventForTargetDay = this.page
        .locator(`div[id$="_content"] div[title="Events for ${displayedMonth} ${dayTarget}"] ul`)
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
        .nth(0)
        .getAttribute('href')
      const noInspector =
        (await specificEventForTargetDay.locator('> div > div > div > span').count()) == 0
      if (!noInspector) {
        const estimator = await specificEventForTargetDay
          .locator('> div > div > div > span')
          .first()
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
      .locator(`div[id$="_content"] div[title="Events for ${displayedMonth} ${dayTarget}"] ul`)
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
      'div[id$="_content"] div[title*="Events for "] ul>li:nth-child(1)'
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
}
