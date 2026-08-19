import { expect } from '@playwright/test'
import {
  CannedClaimTypes,
  ClaimScheduleTabStrings,
  ClaimTabTypes,
  DateDirection,
  DefaultEnvironment,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { FetchCannedClaim } from '../../../library/delegatePortal/delegatePortalHelper.js'
import { LaunchFieldAgent } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalInspectionNotesDialog } from '../../../library/delegatePortal/dialogs/delegatePortalInspectionNotesDialog.js'
import { DelegatePortalClaimPage } from '../../../library/delegatePortal/pages/delegatePortalClaimPage.js'
import { DelegatePortalClaimScheduleTab } from '../../../library/delegatePortal/tabs/delegatePortalClaimScheduleTab.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Page: Inspections Schedule Tab',
  {
    tag: [Tags.Delegate, Tags.FieldAgent, Tags.Claim, Tags.Schedule],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as DelegatePortalClaimScheduleTab

      expect(await claimPage.IsTabActive(ClaimTabTypes.Schedule)).toBe(true)
      expect(claimPage.page.url()).toBe(inspectionsTab.URL)

      // Verify the title label of "Inspections" top left
      await inspectionsTab.VerifyTitle()

      // Verify the Schedule Inspection action button
      expect(await inspectionsTab.Button_ScheduleInspection.IsVisible()).toBe(true)

      // Verify the navigation buttons
      expect(await inspectionsTab.Button_Previous.IsVisible()).toBe(true)
      expect(await inspectionsTab.Button_Next.IsVisible()).toBe(true)

      // Verify the calendar month is the current month (no year is displayed) and that is flanked by [Previous] and [Next] buttons
      const calendarInfo = await inspectionsTab.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(true)
      expect(await inspectionsTab.Button_Next.IsVisible()).toBe(true)
      expect(await inspectionsTab.Button_Previous.IsVisible()).toBe(true)
    })

    test('Verify Calendar Navigation (past, present and future)', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as DelegatePortalClaimScheduleTab

      // Use the [Previous] button to navigate at least 1 year into the past
      await inspectionsTab.NavigateCalendarToRelativeYear(1, DateDirection.Past)

      // Verify that the month AND year begin to be displayed when the calendar moves into the previous year
      let calendarInfo = await inspectionsTab.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(false)

      // Use the [Next] button to navigate at 1 year forward from displayed month- should bring us back to now
      await inspectionsTab.NavigateCalendarToRelativeYear(1, DateDirection.Future)

      // Verify that the month is displayed, but NO year
      calendarInfo = await inspectionsTab.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(true)

      // Use the [Next] button to navigate at 1 year forward from displayed month - puts us 1 year into the future
      await inspectionsTab.NavigateCalendarToRelativeYear(1, DateDirection.Future)

      // Verify that the month AND year begin to be displayed when the calendar moves into the next year
      calendarInfo = await inspectionsTab.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(false)
    })

    test('Verify Calendar Data', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as DelegatePortalClaimScheduleTab

      // Verify only our targeted delegate has items displaying
      await inspectionsTab.page.waitForTimeout(3000)
      const visibleMonthEvents = await inspectionsTab.GetEventsForVisibleMonth()
      const eventNumber = visibleMonthEvents.length
      expect(eventNumber).toBeGreaterThanOrEqual(1)
      for (let monthIndex = 0; monthIndex < eventNumber; monthIndex++) {
        const dayEvents = visibleMonthEvents[monthIndex]
        const dayEventsNumber = dayEvents.length
        for (let dayIndex = 0; dayIndex < dayEventsNumber; dayIndex++) {
          const eventDelegate = dayEvents[dayIndex].delegate
          expect(eventDelegate).toBe(testClaim.basicInfo.fieldAgent)
        }
      }
    })

    test('Verify Calendar Entry Tooltip(s)', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as DelegatePortalClaimScheduleTab

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await inspectionsTab.GetEventsForVisibleMonth()
      const eventNumber = visibleMonthEvents.length
      expect(eventNumber).toBeGreaterThanOrEqual(1)

      for (let eventIndex = 0; eventIndex < eventNumber; eventIndex++) {
        const dayEvents = visibleMonthEvents[eventIndex]
        const dayEventsNumber = dayEvents.length
        for (let dayIndex = 0; dayIndex < dayEventsNumber; dayIndex++) {
          const { delegate } = await inspectionsTab.GetDayEventToolTips(dayEvents[dayIndex].day)
          expect(delegate).toBe(ClaimScheduleTabStrings.Tooltip_Field_Agent)
        }
      }
    })

    test('Verify Calendar Entry See Notes button', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as DelegatePortalClaimScheduleTab

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await inspectionsTab.GetEventsForVisibleMonth()
      const eventNumber = visibleMonthEvents.length
      expect(eventNumber).toBeGreaterThanOrEqual(1)

      // pick the first event
      const dayEvent = visibleMonthEvents[0]

      //let's click on the see notes button
      if (dayEvent[0].seeNotesButton == null) {
        throw new Error('no see notes button')
      }
      await dayEvent[0].seeNotesButton.click({ force: true })

      const notesDialog = new DelegatePortalInspectionNotesDialog(global)
      await notesDialog.VerifyTitle()
    })

    test('Calendar Entry Actions - Mark Canceled: Verify Cancel Inspection Drawer UI', async ({
      browser,
    }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as DelegatePortalClaimScheduleTab

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await inspectionsTab.GetEventsForVisibleMonth(true)
      const eventNumber = visibleMonthEvents.length
      if (eventNumber == 0) {
        throw new Error('There are no events with a Scheduled status - cannot complete this test')
      }
      expect(eventNumber).toBeGreaterThanOrEqual(1)

      // pick the first scheduled event
      const dayEvent = visibleMonthEvents[0]
      if (dayEvent[0].actionsButton == null) {
        throw new Error('no actions button')
      }

      //let's click on the actions dropdown and select the Marked Canceled menu item
      let cancelInspectionDrawer = await inspectionsTab.OpenCancelInspectionDrawer(
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
      await inspectionsTab.page.waitForTimeout(1000)

      cancelInspectionDrawer = await inspectionsTab.OpenCancelInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Verify drawer closes with ESC key
      await cancelInspectionDrawer.Close(true)
      await expect(cancelInspectionDrawer.Title.locator).not.toBeAttached()
      await inspectionsTab.page.waitForTimeout(1000)

      cancelInspectionDrawer = await inspectionsTab.OpenCancelInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Verify drawer closes if click on Close
      await cancelInspectionDrawer.Button_Close.Click()
      await expect(cancelInspectionDrawer.Title.locator).not.toBeAttached()
      await inspectionsTab.page.waitForTimeout(1000)
    })

    test('Calendar Entry Actions - Mark Canceled: Validate Cancel Inspection Drawer', async ({
      browser,
    }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as DelegatePortalClaimScheduleTab

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await inspectionsTab.GetEventsForVisibleMonth(true)
      const eventNumber = visibleMonthEvents.length
      if (eventNumber == 0) {
        throw new Error('There are no events with a Scheduled status - cannot complete this test')
      }
      expect(eventNumber).toBeGreaterThanOrEqual(1)

      // pick the first scheduled event
      const dayEvent = visibleMonthEvents[0]
      if (dayEvent[0].actionsButton == null) {
        throw new Error('no actions button')
      }

      //let's click on the actions dropdown and select the Marked Canceled menu item
      const cancelInspectionDrawer = await inspectionsTab.OpenCancelInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Click the Submit button
      await cancelInspectionDrawer.Button_Submit.Click()
      await inspectionsTab.page.waitForTimeout(1000)

      // Verify validation messages
      expect(await cancelInspectionDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await cancelInspectionDrawer.Button_Close.Click()
    })

    test('Calendar Entry Actions - Mark Completed: Verify Complete Inspection Drawer UI', async ({
      browser,
    }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as DelegatePortalClaimScheduleTab

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await inspectionsTab.GetEventsForVisibleMonth(true)
      const eventNumber = visibleMonthEvents.length
      if (eventNumber == 0) {
        throw new Error('There are no events with a Scheduled status - cannot complete this test')
      }
      expect(eventNumber).toBeGreaterThanOrEqual(1)

      // pick the first scheduled event
      const dayEvent = visibleMonthEvents[0]
      if (dayEvent[0].actionsButton == null) {
        throw new Error('no actions button')
      }

      //let's click on the actions dropdown and select the Marked Completed menu item
      let completeInspectionDrawer = await inspectionsTab.OpenCompleteInspectionDrawer(
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
      await inspectionsTab.page.waitForTimeout(1000)

      completeInspectionDrawer = await inspectionsTab.OpenCompleteInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Verify drawer closes with ESC key
      await completeInspectionDrawer.Close(true)
      await expect(completeInspectionDrawer.Title.locator).not.toBeAttached()
      await inspectionsTab.page.waitForTimeout(1000)

      completeInspectionDrawer = await inspectionsTab.OpenCompleteInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Verify drawer closes if click on Close
      await completeInspectionDrawer.Button_Close.Click()
      await expect(completeInspectionDrawer.Title.locator).not.toBeAttached()
      await inspectionsTab.page.waitForTimeout(1000)
    })

    test('Calendar Entry Actions - Mark Completed: Validate Complete Inspection Drawer', async ({
      browser,
    }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as DelegatePortalClaimScheduleTab

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await inspectionsTab.GetEventsForVisibleMonth(true)
      const eventNumber = visibleMonthEvents.length
      if (eventNumber == 0) {
        throw new Error('There are no events with a Scheduled status - cannot complete this test')
      }
      expect(eventNumber).toBeGreaterThanOrEqual(1)

      // pick the first scheduled event
      const dayEvent = visibleMonthEvents[0]
      if (dayEvent[0].actionsButton == null) {
        throw new Error('no actions button')
      }

      //let's click on the actions dropdown and select the Marked Completed menu item
      const completeInspectionDrawer = await inspectionsTab.OpenCompleteInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Click the Submit button
      await completeInspectionDrawer.Button_Submit.Click()
      await inspectionsTab.page.waitForTimeout(1000)

      // Verify validation messages
      expect(await completeInspectionDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await completeInspectionDrawer.Button_Close.Click()
    })

    test('Schedule Inspection Drawer - Verify UI', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as DelegatePortalClaimScheduleTab

      // Open the drawer
      let scheduleInspectionDrawer = await inspectionsTab.OpenScheduleInspectionDrawer()

      // Verify the UI
      await scheduleInspectionDrawer.VerifyTitle()
      await expect(scheduleInspectionDrawer.TextBox_InspectionDate.locator).toBeAttached()
      await expect(scheduleInspectionDrawer.ListBox_InspectorRole.locator).toBeAttached()
      await expect(scheduleInspectionDrawer.ListBox_InspectorRole.locator).toBeDisabled()
      await expect(scheduleInspectionDrawer.ListBox_ScheduledBy.locator).toBeAttached()
      await expect(scheduleInspectionDrawer.TextArea_NotesText.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await scheduleInspectionDrawer.Button_Close_X.Click()
      await expect(scheduleInspectionDrawer.Title.locator).not.toBeAttached()
      await inspectionsTab.page.waitForTimeout(1000)

      scheduleInspectionDrawer = await inspectionsTab.OpenScheduleInspectionDrawer()

      // Verify drawer closes with ESC key
      await scheduleInspectionDrawer.Close(true)
      await expect(scheduleInspectionDrawer.Title.locator).not.toBeAttached()
      await inspectionsTab.page.waitForTimeout(1000)

      scheduleInspectionDrawer = await inspectionsTab.OpenScheduleInspectionDrawer()

      // Click Close to close the drawer
      await scheduleInspectionDrawer.Button_Close.Click()
    })

    test('Schedule Inspection Drawer - Validate', async ({ browser }) => {
      // launch the Delegate Field Agent home page
      const { global } = await LaunchFieldAgent(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections tab
      const inspectionsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as DelegatePortalClaimScheduleTab

      // Walk through the scheduling process, just don't submit it
      const scheduleInspectionDrawer = await inspectionsTab.OpenScheduleInspectionDrawer()

      await scheduleInspectionDrawer.Button_Submit.Click()
      expect(await scheduleInspectionDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await scheduleInspectionDrawer.Button_Close.Click()
    })
  }
)
