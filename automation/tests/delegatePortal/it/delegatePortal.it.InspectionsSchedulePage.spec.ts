import { expect } from '@playwright/test'
import {
  AbortErrors,
  ClaimInspectionsSchedulePageStrings,
  DateDirection,
  DefaultEnvironment,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { LaunchInspectionTech } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalInspectionNotesDialog } from '../../../library/delegatePortal/dialogs/delegatePortalInspectionNotesDialog.js'
import { DelegatePortalClaimInspectionsSchedulePage } from '../../../library/delegatePortal/pages/delegatePortalClaimInspectionsSchedulePage.js'
import { AbortTest } from '../../../library/shared/commonHelper.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Inspections Schedule Page',
  {
    tag: [Tags.Delegate, Tags.InspectionTech, Tags.DelegateSchedules],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Verify navigation to Inspections page
      const schedulePage = new DelegatePortalClaimInspectionsSchedulePage(global)
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
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Verify navigation to Inspections page
      const schedulesPage = new DelegatePortalClaimInspectionsSchedulePage(global)
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

    test('Verify Calendar Entry Label Tooltips', async ({ browser }) => {
      /// launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Verify navigation to Inspections page
      const schedulesPage = new DelegatePortalClaimInspectionsSchedulePage(global)
      await schedulesPage.NavigateToPage()

      // The current month should have scheduled events for us to use
      const visibleMonthEvents = await schedulesPage.GetEventsForVisibleMonth()
      const eventNumber = visibleMonthEvents.length
      if (eventNumber == 0) {
        AbortTest(AbortErrors.MissingScheduledEventsMessage)
        return
      }

      for (let eventIndex = 0; eventIndex < eventNumber; eventIndex++) {
        const dayEvents = visibleMonthEvents[eventIndex]
        const dayEventsNumber = dayEvents.length
        for (let dayIndex = 0; dayIndex < dayEventsNumber; dayIndex++) {
          const { delegate } = await schedulesPage.GetDayEventToolTips(dayEvents[dayIndex].day)
          expect(
            delegate === ClaimInspectionsSchedulePageStrings.Tooltip_Field_Agent ||
              delegate === ClaimInspectionsSchedulePageStrings.Tooltip_Inspection_Tech
          ).toBe(true)
        }
      }
    })

    test('Navigate To Scheduled Event Claim', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Verify navigation to Inspections page
      const schedulesPage = new DelegatePortalClaimInspectionsSchedulePage(global)
      await schedulesPage.NavigateToPage()

      // The current month should have scheduled events for us to use
      const visibleMonthEvents = await schedulesPage.GetEventsForVisibleMonth()
      const eventNumber = visibleMonthEvents.length
      if (eventNumber == 0) {
        AbortTest(AbortErrors.MissingScheduledEventsMessage)
        return
      }

      // Let go to the first event
      const dayEvents = visibleMonthEvents[0]
      const claimLink = dayEvents[0].claimLink
      const claimLocator = dayEvents[0].claimLinkLocator
      if (claimLocator == null) {
        throw new Error('no claim locator')
      }
      //let's click on the claim link
      await claimLocator.click({ force: true })

      // Verify that our schedules page has become the claim page for our event
      await schedulesPage.page.waitForTimeout(3000)
      expect(schedulesPage.page.url().endsWith(claimLink)).toBe(true)
    })

    test('Delegate Schedules Page - Verify Calendar Entry See Notes button', async ({
      browser,
    }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Verify navigation to Inspections page
      const schedulesPage = new DelegatePortalClaimInspectionsSchedulePage(global)
      await schedulesPage.NavigateToPage()

      // The current month should have scheduled events for us to use
      const visibleMonthEvents = await schedulesPage.GetEventsForVisibleMonth()
      const monthEventNumber = visibleMonthEvents.length
      if (monthEventNumber == 0) {
        AbortTest(AbortErrors.MissingScheduledEventsMessage)
        return
      }

      // find an event for our current delegate
      let verified = false
      for (let monthEventIndex = 0; monthEventIndex < monthEventNumber; monthEventIndex++) {
        const dayEventList = visibleMonthEvents[monthEventIndex]
        for (let dayEventIndex = 0; dayEventIndex < dayEventList.length; dayEventIndex++) {
          const delegate = dayEventList[dayEventIndex].delegate
          if (delegate == global.friendly) {
            if (dayEventList[dayEventIndex].seeNotesButton == null) {
              //let's click on the see notes button
              throw new Error('no see notes button')
            }
            await dayEventList[dayEventIndex].seeNotesButton!.click({ force: true })
            const notesDialog = new DelegatePortalInspectionNotesDialog(global)
            await notesDialog.VerifyTitle()
            verified = true
            break
          }
        }
      }
      expect(verified).toBe(true)
    })

    test('Calendar Entry Actions - Mark Canceled: Verify Cancel Inspection Drawer UI', async ({
      browser,
    }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Verify navigation to Inspections page
      const schedulesPage = new DelegatePortalClaimInspectionsSchedulePage(global)
      await schedulesPage.NavigateToPage()

      // The current month should have scheduled events for us to use
      const visibleMonthEvents = await schedulesPage.GetEventsForVisibleMonth(true)
      const eventNumber = visibleMonthEvents.length
      if (eventNumber == 0) {
        AbortTest(AbortErrors.MissingScheduledEventsMessage)
        return
      }

      // pick the first scheduled event
      const dayEvent = visibleMonthEvents[0]
      if (dayEvent[0].actionsButton == null) {
        throw new Error('no actions button')
      }

      //let's click on the actions dropdown and select the Marked Canceled menu item
      let cancelInspectionDrawer = await schedulesPage.OpenCancelInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Verify drawer heading is "Cancel Inspection"
      await cancelInspectionDrawer.Title.VerifyExpectedText()
      await expect(cancelInspectionDrawer.TextBox_CanceledDate.locator).toBeAttached()
      await expect(cancelInspectionDrawer.ListBox_CanceledBy.locator).toBeAttached()
      await expect(cancelInspectionDrawer.TextArea_NoteText.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await cancelInspectionDrawer.Button_Close_X.Click()
      await expect(cancelInspectionDrawer.Title.locator).not.toBeAttached()
      await schedulesPage.page.waitForTimeout(1000)

      cancelInspectionDrawer = await schedulesPage.OpenCancelInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Verify drawer closes with ESC key
      await cancelInspectionDrawer.Close(true)
      await expect(cancelInspectionDrawer.Title.locator).not.toBeAttached()
      await schedulesPage.page.waitForTimeout(1000)

      cancelInspectionDrawer = await schedulesPage.OpenCancelInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Verify drawer closes if click on Close
      await cancelInspectionDrawer.Button_Close.Click()
      await expect(cancelInspectionDrawer.Title.locator).not.toBeAttached()
      await schedulesPage.page.waitForTimeout(1000)
    })

    test('Calendar Entry Actions - Mark Canceled: Validate Cancel Inspection Drawer', async ({
      browser,
    }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Verify navigation to Inspections page
      const schedulesPage = new DelegatePortalClaimInspectionsSchedulePage(global)
      await schedulesPage.NavigateToPage()

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await schedulesPage.GetEventsForVisibleMonth(true)
      const eventNumber = visibleMonthEvents.length
      if (eventNumber == 0) {
        AbortTest(AbortErrors.MissingScheduledEventsMessage)
        return
      }

      // pick the first scheduled event
      const dayEvent = visibleMonthEvents[0]
      if (dayEvent[0].actionsButton == null) {
        throw new Error('no actions button')
      }

      //let's click on the actions dropdown and select the Marked Canceled menu item
      const cancelInspectionDrawer = await schedulesPage.OpenCancelInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Click the Submit button
      await cancelInspectionDrawer.Button_Submit.Click()
      await schedulesPage.page.waitForTimeout(1000)

      // Verify validation messages
      expect(await cancelInspectionDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await cancelInspectionDrawer.Button_Close.Click()
    })

    test('Calendar Entry Actions - Mark Completed: Verify Complete Inspection DrawerUI', async ({
      browser,
    }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Verify navigation to Inspections page
      const schedulesPage = new DelegatePortalClaimInspectionsSchedulePage(global)
      await schedulesPage.NavigateToPage()

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await schedulesPage.GetEventsForVisibleMonth(true)
      const eventNumber = visibleMonthEvents.length
      if (eventNumber == 0) {
        AbortTest(AbortErrors.MissingScheduledEventsMessage)
        return
      }

      // pick the first scheduled event
      const dayEvent = visibleMonthEvents[0]
      if (dayEvent[0].actionsButton == null) {
        throw new Error('no actions button')
      }

      //let's click on the actions dropdown and select the Marked Completed menu item
      let completeInspectionDrawer = await schedulesPage.OpenCompleteInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Verify drawer heading is "Cancel Inspection"
      await completeInspectionDrawer.Title.VerifyExpectedText()
      await expect(completeInspectionDrawer.TextBox_CompletedDate.locator).toBeAttached()
      await expect(completeInspectionDrawer.ListBox_CompletedBy.locator).toBeAttached()
      await expect(completeInspectionDrawer.TextArea_NoteText.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await completeInspectionDrawer.Button_Close_X.Click()
      await expect(completeInspectionDrawer.Title.locator).not.toBeAttached()
      await schedulesPage.page.waitForTimeout(1000)

      completeInspectionDrawer = await schedulesPage.OpenCompleteInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Verify drawer closes with ESC key
      await completeInspectionDrawer.Close(true)
      await expect(completeInspectionDrawer.Title.locator).not.toBeAttached()
      await schedulesPage.page.waitForTimeout(1000)

      completeInspectionDrawer = await schedulesPage.OpenCompleteInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Verify drawer closes if click on Close
      await completeInspectionDrawer.Button_Close.Click()
      await expect(completeInspectionDrawer.Title.locator).not.toBeAttached()
      await schedulesPage.page.waitForTimeout(1000)
    })

    test('Calendar Entry Actions - Mark Completed: Validate Complete Inspection Drawer', async ({
      browser,
    }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Verify navigation to Inspections page
      const schedulesPage = new DelegatePortalClaimInspectionsSchedulePage(global)
      await schedulesPage.NavigateToPage()

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await schedulesPage.GetEventsForVisibleMonth(true)
      const eventNumber = visibleMonthEvents.length
      if (eventNumber == 0) {
        AbortTest(AbortErrors.MissingScheduledEventsMessage)
        return
      }

      // pick the first scheduled event
      const dayEvent = visibleMonthEvents[0]
      if (dayEvent[0].actionsButton == null) {
        throw new Error('no actions button')
      }

      //let's click on the actions dropdown and select the Marked Completed menu item
      const completeInspectionDrawer = await schedulesPage.OpenCompleteInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Click the Submit button
      await completeInspectionDrawer.Button_Submit.Click()
      await schedulesPage.page.waitForTimeout(1000)

      // Verify validation messages
      expect(await completeInspectionDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await completeInspectionDrawer.Button_Close.Click()
    })
  }
)
