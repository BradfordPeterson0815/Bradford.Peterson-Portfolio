import { expect } from '@playwright/test'
import { ClaimsPortalInspectionNotesDialog } from '../../library/claimsPortal/dialogs/claimsPortalInspectionNotesDialog.js'
import { ClaimsPortalClaimPage } from '../../library/claimsPortal/pages/claimsPortalClaimPage.js'
import { ClaimsPortalClaimScheduleTab } from '../../library/claimsPortal/tabs/claimsPortalClaimScheduleTab.js'
import {
  CannedClaimTypes,
  ClaimTabTypes,
  DateDirection,
  DefaultEnvironment,
  EstimatorSchedulesPageStrings,
  InspectorRoleOptions,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedClaim, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'
import { ClaimsPortalClaimsPage } from '../../library/claimsPortal/pages/claimsPortalClaimsPage.js'
const environment = DefaultEnvironment

test.describe(
  'Claim Page: Inspections Schedule Tab',
  {
    tag: [Tags.ClaimsPortal, Tags.Claim, Tags.Schedule],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // find a random claim and go to it
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage } = await claimsPage.OpenRandomClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections Schedule tab
      const scheduleTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as ClaimsPortalClaimScheduleTab

      expect(await claimPage.IsTabActive(ClaimTabTypes.Schedule)).toBe(true)
      expect(claimPage.page.url()).toBe(scheduleTab.URL)

      // Verify the title label of "Inspections" top left
      await scheduleTab.VerifyTitle()

      // Verify the inspection action buttons
      expect(await scheduleTab.Button_RequestInspection.IsVisible()).toBe(true)
      expect(await scheduleTab.Button_ScheduleInspection.IsVisible()).toBe(true)

      // Verify the navigation buttons
      expect(await scheduleTab.Button_Previous.IsVisible()).toBe(true)
      expect(await scheduleTab.Button_Next.IsVisible()).toBe(true)

      // Verify the calendar month is the current month (no year is displayed) and that is flanked by [Previous] and [Next] buttons
      let calendarInfo = await scheduleTab.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(true)
      expect(await scheduleTab.Button_Next.IsVisible()).toBe(true)
      expect(await scheduleTab.Button_Previous.IsVisible()).toBe(true)

      // Use the [Previous] button to navigate at least 1 year into the past
      await scheduleTab.NavigateCalendarToRelativeYear(1, DateDirection.Past)

      // Verify that the month AND year begin to be displayed when the calendar moves into the previous year
      calendarInfo = await scheduleTab.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(false)

      // Use the [Next] button to navigate at 1 year forward from displayed month- should bring us back to now
      await scheduleTab.NavigateCalendarToRelativeYear(1, DateDirection.Future)

      // Verify that the month is displayed, but NO year
      calendarInfo = await scheduleTab.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(true)

      // Use the [Next] button to navigate at 1 year forward from displayed month - puts us 1 year into the future
      await scheduleTab.NavigateCalendarToRelativeYear(1, DateDirection.Future)

      // Verify that the month AND year begin to be displayed when the calendar moves into the next year
      calendarInfo = await scheduleTab.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(false)
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections Schedule tab
      const scheduleTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as ClaimsPortalClaimScheduleTab

      expect(await claimPage.IsTabActive(ClaimTabTypes.Schedule)).toBe(true)
      expect(claimPage.page.url()).toBe(scheduleTab.URL)

      // Verify the title label of "Inspections Schedule" top left
      await scheduleTab.VerifyTitle()

      // Verify the inspection action buttons
      expect(await scheduleTab.Button_RequestInspection.IsVisible()).toBe(true)
      expect(await scheduleTab.Button_ScheduleInspection.IsVisible()).toBe(true)

      // Verify the navigation buttons
      expect(await scheduleTab.Button_Previous.IsVisible()).toBe(true)
      expect(await scheduleTab.Button_Next.IsVisible()).toBe(true)

      // Verify the calendar month is the current month (no year is displayed) and that is flanked by [Previous] and [Next] buttons
      const calendarInfo = await scheduleTab.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(true)
      expect(await scheduleTab.Button_Next.IsVisible()).toBe(true)
      expect(await scheduleTab.Button_Previous.IsVisible()).toBe(true)

      // Verify Request Inspection Drawer
      const requestInspectionDrawer = await scheduleTab.OpenRequestInspectionDrawer()

      // Verify drawer heading is "Request Inspection"
      await requestInspectionDrawer.Title.VerifyExpectedText()
      await expect(requestInspectionDrawer.ListBox_InspectorRole.locator).toBeAttached()
      await expect(requestInspectionDrawer.ListBox_RequestedBy.locator).toBeAttached()
      await expect(requestInspectionDrawer.TextArea_NotesText.locator).toBeAttached()

      await requestInspectionDrawer.Button_Close.Click()
      await expect(requestInspectionDrawer.Title.locator).not.toBeAttached()
    })

    test('Verify Calendar Navigation (past, present and future)', async ({ browser }) => {
      test.slow()

      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections Schedule tab
      const scheduleTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as ClaimsPortalClaimScheduleTab

      // Use the [Previous] button to navigate at least 1 year into the past
      await scheduleTab.NavigateCalendarToRelativeYear(1, DateDirection.Past)

      // Verify that the month AND year begin to be displayed when the calendar moves into the previous year
      let calendarInfo = await scheduleTab.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(false)

      // Use the [Next] button to navigate at 1 year forward from displayed month- should bring us back to now
      await scheduleTab.NavigateCalendarToRelativeYear(1, DateDirection.Future)

      // Verify that the month is displayed, but NO year
      calendarInfo = await scheduleTab.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(true)

      // Use the [Next] button to navigate at 1 year forward from displayed month - puts us 1 year into the future
      await scheduleTab.NavigateCalendarToRelativeYear(1, DateDirection.Future)

      // Verify that the month AND year begin to be displayed when the calendar moves into the next year
      calendarInfo = await scheduleTab.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(false)
    })

    test('Verify Calendar Data', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections Schedule tab
      const scheduleTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as ClaimsPortalClaimScheduleTab

      // Verify only our targeted estimator has items displaying
      const visibleMonthEvents = await scheduleTab.GetEventsForVisibleMonth()
      const eventNumber = visibleMonthEvents.length
      expect(eventNumber).toBeGreaterThanOrEqual(1)
      for (let monthIndex = 0; monthIndex < eventNumber; monthIndex++) {
        const dayEvents = visibleMonthEvents[monthIndex]
        const dayEventsNumber = dayEvents.length
        for (let dayIndex = 0; dayIndex < dayEventsNumber; dayIndex++) {
          const eventEstimator = dayEvents[dayIndex].estimator
          const matches =
            eventEstimator === testClaim.testData.estimator1 ||
            eventEstimator === testClaim.testData.estimator2
          expect(matches).toBe(true)
        }
      }
    })

    test('Verify Calendar Entry Tooltip(s)', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections Schedule tab
      const scheduleTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as ClaimsPortalClaimScheduleTab

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await scheduleTab.GetEventsForVisibleMonth()
      const eventNumber = visibleMonthEvents.length
      expect(eventNumber).toBeGreaterThanOrEqual(1)

      for (let eventIndex = 0; eventIndex < eventNumber; eventIndex++) {
        const dayEvents = visibleMonthEvents[eventIndex]
        const dayEventsNumber = dayEvents.length
        for (let dayIndex = 0; dayIndex < dayEventsNumber; dayIndex++) {
          const { estimator } = await scheduleTab.GetDayEventToolTips(dayEvents[dayIndex].day)
          const matches =
            estimator === EstimatorSchedulesPageStrings.Tooltip_Field_Agent ||
            estimator === EstimatorSchedulesPageStrings.Tooltip_Inspection_Tech
          expect(matches).toBe(true)
        }
      }
    })

    test('Navigate To Scheduled Event Claim', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections Schedule tab
      const scheduleTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as ClaimsPortalClaimScheduleTab

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await scheduleTab.GetEventsForVisibleMonth()
      const eventNumber = visibleMonthEvents.length
      expect(eventNumber).toBeGreaterThanOrEqual(1)

      // pick the first event
      const dayEvent = visibleMonthEvents[0]
      // should be 1 event scheduled on this day for the estimator
      const claimLinkHref = dayEvent[0].claimLink

      //let's click on the claim link
      if (dayEvent[0].claimLinkLocator == null) {
        throw new Error('no claim link')
      }
      await dayEvent[0].claimLinkLocator.click({ force: true })
      await scheduleTab.page.waitForTimeout(3000)

      // Verify that our schedules page has become the claim page for our event
      const result = scheduleTab.page.url().endsWith(claimLinkHref)
      expect(result).toBe(true)
    })

    test('Verify Calendar Entry See Notes button', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections Schedule tab
      const scheduleTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as ClaimsPortalClaimScheduleTab

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await scheduleTab.GetEventsForVisibleMonth()
      const eventNumber = visibleMonthEvents.length
      expect(eventNumber).toBeGreaterThanOrEqual(1)

      // pick the first event
      const dayEvent = visibleMonthEvents[0]

      //let's click on the see notes button
      if (dayEvent[0].seeNotesButton == null) {
        throw new Error('no see notes button')
      }
      await dayEvent[0].seeNotesButton.click({ force: true })

      const notesDialog = new ClaimsPortalInspectionNotesDialog(global)
      await notesDialog.VerifyTitle()
    })

    test('Calendar Entry Actions - Mark Canceled: Cancel Inspection Drawer and Verify UI', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections Schedule tab
      const scheduleTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as ClaimsPortalClaimScheduleTab

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await scheduleTab.GetEventsForVisibleMonth(true)
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
      let cancelInspectionDrawer = await scheduleTab.OpenCancelInspectionDrawer(
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
      await scheduleTab.page.waitForTimeout(1000)

      cancelInspectionDrawer = await scheduleTab.OpenCancelInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Verify drawer closes with ESC key
      await cancelInspectionDrawer.Close(true)
      await expect(cancelInspectionDrawer.Title.locator).not.toBeAttached()
      await scheduleTab.page.waitForTimeout(1000)

      cancelInspectionDrawer = await scheduleTab.OpenCancelInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Verify drawer closes if click on Close
      await cancelInspectionDrawer.Button_Close.Click()
      await expect(cancelInspectionDrawer.Title.locator).not.toBeAttached()
      await scheduleTab.page.waitForTimeout(1000)
    })

    test('Calendar Entry Actions - Mark Canceled: Cancel Inspection Drawer and Validate', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections Schedule tab
      const scheduleTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as ClaimsPortalClaimScheduleTab

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await scheduleTab.GetEventsForVisibleMonth(true)
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
      const cancelInspectionDrawer = await scheduleTab.OpenCancelInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Click the Submit button
      await cancelInspectionDrawer.Button_Submit.Click()
      await scheduleTab.page.waitForTimeout(1000)

      // Verify validation messages
      expect(await cancelInspectionDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await cancelInspectionDrawer.Button_Close.Click()
    })

    test('Calendar Entry Actions - Mark Completed: Complete Inspection Drawer and Verify UI', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections Schedule tab
      const scheduleTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as ClaimsPortalClaimScheduleTab

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await scheduleTab.GetEventsForVisibleMonth(true)
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
      let completeInspectionDrawer = await scheduleTab.OpenCompleteInspectionDrawer(
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
      await scheduleTab.page.waitForTimeout(1000)

      completeInspectionDrawer = await scheduleTab.OpenCompleteInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Verify drawer closes with ESC key
      await completeInspectionDrawer.Close(true)
      await expect(completeInspectionDrawer.Title.locator).not.toBeAttached()
      await scheduleTab.page.waitForTimeout(1000)

      completeInspectionDrawer = await scheduleTab.OpenCompleteInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Verify drawer closes if click on Close
      await completeInspectionDrawer.Button_Close.Click()
      await expect(completeInspectionDrawer.Title.locator).not.toBeAttached()
      await scheduleTab.page.waitForTimeout(1000)
    })

    test('Calendar Entry Actions - Mark Completed: Complete Inspection Drawer and Validate', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections Schedule tab
      const scheduleTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as ClaimsPortalClaimScheduleTab

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await scheduleTab.GetEventsForVisibleMonth(true)
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
      const completeInspectionDrawer = await scheduleTab.OpenCompleteInspectionDrawer(
        dayEvent[0].actionsButton
      )

      // Click the Submit button
      await completeInspectionDrawer.Button_Submit.Click()
      await scheduleTab.page.waitForTimeout(1000)

      // Verify validation messages
      expect(await completeInspectionDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await completeInspectionDrawer.Button_Close.Click()
    })

    test('Request Inspection Drawer - Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections Schedule tab
      const scheduleTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as ClaimsPortalClaimScheduleTab

      //let's click on Request Inspection button
      let requestInspectionDrawer = await scheduleTab.OpenRequestInspectionDrawer()

      // Verify drawer heading is "Request Inspection"
      await requestInspectionDrawer.Title.VerifyExpectedText()
      await expect(requestInspectionDrawer.ListBox_InspectorRole.locator).toBeAttached()
      await expect(requestInspectionDrawer.ListBox_RequestedBy.locator).toBeAttached()
      await expect(requestInspectionDrawer.TextArea_NotesText.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await requestInspectionDrawer.Button_Close_X.Click()
      await expect(requestInspectionDrawer.Title.locator).not.toBeAttached()
      await scheduleTab.page.waitForTimeout(1000)

      requestInspectionDrawer = await scheduleTab.OpenRequestInspectionDrawer()

      // Verify drawer closes with ESC key
      await requestInspectionDrawer.Close(true)
      await expect(requestInspectionDrawer.Title.locator).not.toBeAttached()
      await scheduleTab.page.waitForTimeout(1000)

      requestInspectionDrawer = await scheduleTab.OpenRequestInspectionDrawer()

      // Verify drawer closes if click on Close
      await requestInspectionDrawer.Button_Close.Click()
      await expect(requestInspectionDrawer.Title.locator).not.toBeAttached()
      await scheduleTab.page.waitForTimeout(1000)
    })

    test('Request Inspection Drawer - Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections Schedule tab
      const scheduleTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as ClaimsPortalClaimScheduleTab

      //let's click on Request Inspection button
      const requestInspectionDrawer = await scheduleTab.OpenRequestInspectionDrawer()

      // Click the Submit button
      await requestInspectionDrawer.Button_Submit.Click()
      await scheduleTab.page.waitForTimeout(1000)

      // Verify validation messages
      expect(await requestInspectionDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await requestInspectionDrawer.Button_Close.Click()
    })

    test('Schedule Inspection Drawer - Verify UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections Schedule tab
      const scheduleTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as ClaimsPortalClaimScheduleTab

      // Open the drawer
      let scheduleInspectionDrawer = await scheduleTab.OpenScheduleInspectionDrawer()

      // Verify the UI
      await scheduleInspectionDrawer.VerifyTitle()
      await expect(scheduleInspectionDrawer.TextBox_InspectionDate.locator).toBeAttached()
      await expect(scheduleInspectionDrawer.ListBox_InspectorRole.locator).toBeAttached()
      await expect(scheduleInspectionDrawer.ListBox_InspectorRole.locator).toBeEnabled()
      await expect(scheduleInspectionDrawer.ListBox_ScheduledBy.locator).toBeAttached()
      await expect(scheduleInspectionDrawer.TextArea_NotesText.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await scheduleInspectionDrawer.Button_Close_X.Click()
      await expect(scheduleInspectionDrawer.Title.locator).not.toBeAttached()
      await scheduleTab.page.waitForTimeout(1000)

      scheduleInspectionDrawer = await scheduleTab.OpenScheduleInspectionDrawer()

      // Verify drawer closes with ESC key
      await scheduleInspectionDrawer.Close(true)
      await expect(scheduleInspectionDrawer.Title.locator).not.toBeAttached()
      await scheduleTab.page.waitForTimeout(1000)

      scheduleInspectionDrawer = await scheduleTab.OpenScheduleInspectionDrawer()

      // Click Close to close the drawer
      await scheduleInspectionDrawer.Button_Close.Click()
    })

    test('Schedule Inspection Drawer - Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections Schedule tab
      const scheduleTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as ClaimsPortalClaimScheduleTab

      // Walk through the scheduling process, just don't submit it
      const scheduleInspectionDrawer = await scheduleTab.OpenScheduleInspectionDrawer()

      await scheduleInspectionDrawer.Button_Submit.Click()
      expect(await scheduleInspectionDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await scheduleInspectionDrawer.Button_Close.Click()
    })

    test('Verify Inspection Requested Flow', async ({ browser }) => {
      test.slow()

      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Inspections Schedule tab
      const scheduleTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Schedule
      )) as ClaimsPortalClaimScheduleTab

      // If there is already 1 or more inspection requests, Cancel them
      let currentInspectionRequestCount = await scheduleTab.InspectionRequestCount()
      while (currentInspectionRequestCount > 0) {
        await scheduleTab.CancelInspectionRequest(0, testClaim.basicInfo.fieldAgent)
        currentInspectionRequestCount = await scheduleTab.InspectionRequestCount()
      }

      // Now, request an inspection
      await scheduleTab.RequestInspection(
        InspectorRoleOptions.FieldAgent,
        testClaim.basicInfo.coordinator
      )

      // make sure we see an inspection request
      currentInspectionRequestCount = await scheduleTab.InspectionRequestCount()
      expect(currentInspectionRequestCount).toBe(1)

      // Walk through the scheduling process, just don't submit it
      let scheduleRequestedInspectionDrawer =
        await scheduleTab.OpenScheduleRequestedInspectionDrawer(0)

      // Verify the UI
      await scheduleRequestedInspectionDrawer.VerifyTitle()
      await expect(scheduleRequestedInspectionDrawer.TextBox_InspectionDate.locator).toBeAttached()
      await expect(scheduleRequestedInspectionDrawer.ListBox_InspectorRole.locator).toBeAttached()
      await expect(scheduleRequestedInspectionDrawer.ListBox_ScheduledBy.locator).toBeAttached()
      await expect(scheduleRequestedInspectionDrawer.TextArea_NotesText.locator).toBeAttached()

      await scheduleRequestedInspectionDrawer.Button_Submit.Click()
      expect(await scheduleRequestedInspectionDrawer.ValidateWithRole()).toBe(true)

      // Verify drawer closes with click on "X" button
      await scheduleRequestedInspectionDrawer.Button_Close_X.Click()
      await scheduleRequestedInspectionDrawer.Title.locator.waitFor({ state: 'detached' })

      // Verify drawer closes with ESC key
      scheduleRequestedInspectionDrawer = await scheduleTab.OpenScheduleRequestedInspectionDrawer(0)
      await scheduleRequestedInspectionDrawer.Close(true)
      await scheduleRequestedInspectionDrawer.Title.locator.waitFor({ state: 'detached' })

      // Click Close to close the drawer
      scheduleRequestedInspectionDrawer = await scheduleTab.OpenScheduleRequestedInspectionDrawer(0)
      await scheduleRequestedInspectionDrawer.Button_Close.Click()
      await scheduleRequestedInspectionDrawer.Title.locator.waitFor({ state: 'detached' })

      // Finally, Cancel the request
      await scheduleTab.CancelInspectionRequest(0, testClaim.basicInfo.fieldAgent)

      // make sure we no longer see an inspection request
      currentInspectionRequestCount = await scheduleTab.InspectionRequestCount()
      expect(currentInspectionRequestCount).toBe(0)
    })
  }
)
