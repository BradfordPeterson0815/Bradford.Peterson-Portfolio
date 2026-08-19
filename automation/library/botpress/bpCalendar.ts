import { Locator, Page } from 'playwright/test'
import { BPGlobal } from './bpGlobal.js'
import { Wait } from './bpHelper.js'

export class BPCalendar {
  global: BPGlobal
  page: Page
  calendar: Locator

  constructor(global: BPGlobal) {
    this.global = global
    this.page = global.page
    this.calendar = this.page.frameLocator('#bp-widget').locator('.datePicker')
  }

  async CalendarIsShowing() {
    return (await this.calendar.count()) > 0
  }

  async PopUpCalendar() {
    const buttonSelector = this.page
      .frameLocator('#bp-widget')
      .locator('.react-date-picker__calendar-button')
    await buttonSelector.click()
  }

  async Input_Month(month: string) {
    const valueSelector = this.page.frameLocator('#bp-widget').locator('input[name="month"]')
    await valueSelector.click()
    await valueSelector.fill(month)
  }

  async Input_Day(day: string) {
    const valueSelector = this.page.frameLocator('#bp-widget').locator('input[name="day"]')
    await valueSelector.click()
    await valueSelector.fill(day)
  }

  async Input_Year(year: string) {
    const valueSelector = this.page.frameLocator('#bp-widget').locator('input[name="year"]')
    await valueSelector.click()
    await valueSelector.fill(year)
  }

  async SubmitDate(month: string, day: string, year: string) {
    await this.Input_Month(month)
    await this.Input_Day(day)
    await this.Input_Year(year)
    const buttonSelector = this.page.frameLocator('#bp-widget').locator('.bpw-keyboard .trigger')
    await buttonSelector.click()
    await Wait()
    // check to see if the calendar is still there - if it is, the date was not accepted
    const calendarIsVisible = await this.CalendarIsShowing()
    return calendarIsVisible
  }

  // 2024-05-20
}
