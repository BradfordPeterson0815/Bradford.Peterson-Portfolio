import { Element } from '../../shared/element.js'
import { DateDirection, AppointmentsTabStrings, Months } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalJob } from '../claimsPortalJob.js'
import { ClaimsPortalScheduleAppointmentDrawer } from '../drawers/claimsPortalScheduleAppointmentDrawer.js'
import { ClaimsPortalCalendarAppointment } from '../claimsPortalCalendarAppointment.js'

export class ClaimsPortalJobAppointmentsTab extends ClaimsPortalBasePage {
  readonly job: ClaimsPortalJob
  readonly URL: string
  readonly Title: Element
  readonly Button_ScheduleAppointment: Element
  readonly Button_Next: Element
  readonly Button_Previous: Element
  readonly Label_CurrentMonth: Element

  constructor(global: ClaimsPortalGlobal, job: ClaimsPortalJob, jobPageURL: string) {
    super(global)
    this.job = job
    this.URL = `${jobPageURL}/appointments`
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${AppointmentsTabStrings.Title_Appointments}` }),
      AppointmentsTabStrings.Title_Appointments
    )
    this.Button_ScheduleAppointment = new Element(
      global.page,
      this.page.getByRole('button', { name: AppointmentsTabStrings.Button_ScheduleAppointment }),
      AppointmentsTabStrings.Button_ScheduleAppointment
    )
    this.Button_Previous = new Element(
      global.page,
      this.page.getByRole('button', { name: AppointmentsTabStrings.Button_Previous }),
      AppointmentsTabStrings.Button_Previous
    )
    this.Button_Next = new Element(
      global.page,
      this.page.getByRole('button', { name: AppointmentsTabStrings.Button_Next }),
      AppointmentsTabStrings.Button_Next
    )
    this.Label_CurrentMonth = new Element(
      global.page,
      this.page.locator(
        '#root div.chakra-card__body > div > div:nth-child(2) > div:nth-child(1) > div > p[title="Current Month"]'
      )
    )
  }

  async InspectionRequestCount() {
    const requestLocator = this.page.locator(
      'div[id$="_content"] div[data-status="warning"][role="alert"]'
    )
    const inspectionRequestCount = await requestLocator.count()
    return inspectionRequestCount
  }

  async ScheduleAppointment() {
    const scheduleAppointmentDrawer = await this.OpenScheduleAppointmentDrawer()
    // fill this in
    await scheduleAppointmentDrawer.Button_Submit.Click()
    await this.page.waitForTimeout(5000)
  }

  async OpenScheduleAppointmentDrawer() {
    await this.Button_ScheduleAppointment.Click()
    const scheduleAppointmentDrawer = new ClaimsPortalScheduleAppointmentDrawer(this.global)
    return scheduleAppointmentDrawer
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

  async GetAppointmentsForVisibleDate(day: number, onlyCompletedAppointments = false) {
    const dayTarget = day.toString()
    const displayedMonth = await this.Label_CurrentMonth.GetText()
    const allEventsForTargetDay = this.page
      .locator(
        `div[id$="_content"] > div > div:nth-child(2) div[title="Events for ${displayedMonth} ${dayTarget}"] ul`
      )
      .first()
      .locator(`li`)
    const dayAppointments: ClaimsPortalCalendarAppointment[] = []
    const appointmentCount = await allEventsForTargetDay.count()
    for (let i = 0; i < appointmentCount; i++) {
      const specificAppointmentForTargetDay = this.page
        .locator(
          `div[id$="_content"] > div > div:nth-child(1) div[title="Events for ${displayedMonth} ${dayTarget}"] ul`
        )
        .first()
        .locator(`li:nth-child(${i + 1})`)
      const monthDayInfo = `${displayedMonth} ${dayTarget}`
      const timeInfo = await specificAppointmentForTargetDay.locator('> div > h3').textContent()
      const appointmentType = await specificAppointmentForTargetDay
        .locator('> div > div > h3')
        .textContent()
      const appointmentChannel = await specificAppointmentForTargetDay
        .locator('> div > div > p')
        .textContent()
      const isCompleted =
        (await specificAppointmentForTargetDay.locator('> div > div > p').nth(1).count()) > 0
      const completeLocator = specificAppointmentForTargetDay.getByRole('button', {
        name: 'Complete',
      })
      const seeParticipantsLocator = specificAppointmentForTargetDay.getByRole('button', {
        name: 'See Participants',
      })
      const seeDescriptionLocator = specificAppointmentForTargetDay.getByRole('button', {
        name: 'See Description',
      })
      const seeNotesLocator = specificAppointmentForTargetDay.getByRole('button', {
        name: 'See Notes',
      })
      const appointment = new ClaimsPortalCalendarAppointment()
      appointment.monthDay = monthDayInfo
      appointment.month = displayedMonth
      appointment.day = Number(dayTarget)
      appointment.time = timeInfo
      appointment.isCompleted = isCompleted
      appointment.type = appointmentType
      appointment.channel = appointmentChannel
      appointment.completeButton = completeLocator
      appointment.seeParticipantsButton = seeParticipantsLocator
      appointment.seeDescriptionButton = seeDescriptionLocator
      appointment.seeNotesButton = seeNotesLocator
      appointment.seeNotesButton = seeNotesLocator
      if (onlyCompletedAppointments && isCompleted) {
        dayAppointments.push(appointment)
      } else {
        dayAppointments.push(appointment)
      }
    }
    return dayAppointments
  }

  async GetAppointmentsForVisibleMonth() {
    const allAppointmentsForVisibleMonth = this.page.locator(
      'div[id$="_content"] > div > div:nth-child(1) div[title*="Events for "] ul>li:nth-child(1)'
    )
    const monthAppointments: ClaimsPortalCalendarAppointment[][] = []
    const monthAppointmentsCount = await allAppointmentsForVisibleMonth.count()
    for (let i = 0; i < monthAppointmentsCount; i++) {
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
      const targetDayAppointments = await this.GetAppointmentsForVisibleDate(targetDate)
      if (targetDayAppointments.length > 0) {
        monthAppointments.push(targetDayAppointments)
      }
    }
    return monthAppointments
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
}
