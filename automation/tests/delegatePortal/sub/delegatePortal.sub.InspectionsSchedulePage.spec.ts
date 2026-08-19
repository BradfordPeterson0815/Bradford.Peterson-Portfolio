import { expect } from '@playwright/test'
import { DateDirection, DefaultEnvironment } from '../../../library/delegatePortal/delegatePortalConstants.js'
import { LaunchSubcontractor } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalJobInspectionsSchedulePage } from '../../../library/delegatePortal/pages/delegatePortalJobInspectionsSchedulePage.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Inspections Schedule Page',
  {
    tag: [Tags.Delegate, Tags.Subcontractor, Tags.DelegateSchedules],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Verify navigation to Inspections page
      const schedulePage = new DelegatePortalJobInspectionsSchedulePage(global)
      await schedulePage.NavigateToPage()

      // Verify the title label of "Claim Inspections" top left
      await schedulePage.VerifyTitle()

      // Verify the calendar month is the current month (no year is displayed) and that is flanked by [Previous] and [Next] buttons
      const calendarInfo = await schedulePage.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(true)
      expect(await schedulePage.Button_Next.IsVisible()).toBe(true)
      expect(await schedulePage.Button_Previous.IsVisible()).toBe(true)
    })

    test('Verify Calendar Navigation (past, present and future)', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { global } = await LaunchSubcontractor(browser, environment)

      // Verify navigation to Inspections page
      const schedulesPage = new DelegatePortalJobInspectionsSchedulePage(global)
      await schedulesPage.NavigateToPage()

      // Use the [Previous] button to navigate at least 1 year into the past
      await schedulesPage.NavigateCalendarToRelativeYear(1, DateDirection.Past)

      // Verify that the month AND year begin to be displayed when the calendar moves into the previous year
      let calendarInfo = await schedulesPage.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(false)

      // Use the [Next] button to navigate at 1 year forward from displayed month- should bring us back to now
      await schedulesPage.NavigateCalendarToRelativeYear(1, DateDirection.Future)

      // Verify that the month is displayed, but NO year
      calendarInfo = await schedulesPage.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(true)

      // Use the [Next] button to navigate at 1 year forward from displayed month - puts us 1 year into the future
      await schedulesPage.NavigateCalendarToRelativeYear(1, DateDirection.Future)

      // Verify that the month AND year begin to be displayed when the calendar moves into the next year
      calendarInfo = await schedulesPage.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(false)
    })
  }
)
