import { expect } from '@playwright/test'
import { ClaimsPortalInspectionNotesDialog } from '../../library/claimsPortal/dialogs/claimsPortalInspectionNotesDialog.js'
import {
  CannedClaimTypes,
  DateDirection,
  DefaultEnvironment,
  EstimatorSchedulesPageStrings,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedClaim, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalEstimatorSchedulesPage } from '../../library/claimsPortal/pages/claimsPortalEstimatorSchedulesPage.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'
const environment = DefaultEnvironment

test.describe(
  'Estimator Schedules Page',
  {
    tag: [Tags.ClaimsPortal, Tags.Admin, Tags.EstimatorSchedules],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P2] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Estimator Schedules Page navigation from ClaimsPortalLeftNavBar
      const schedulesPage = new ClaimsPortalEstimatorSchedulesPage(global)
      await schedulesPage.NavigateToPage()

      // Verify the "Select an Estimator(s)" dropdown list appears
      expect(await schedulesPage.ListBox_SelectEstimators.IsVisible()).toBe(true)

      // Verify that the default value is no specific Estimator selected (displays grayed "Select…") and that scheduled items are all displayed (not filtered to a single Estimator)
      await schedulesPage.VerifySelectEstimatorsIsEmpty()

      // if there are estimators to select, do it
      const availableEstimatorsCount = await schedulesPage.GetEstimatorCountFromList()
      if (availableEstimatorsCount > 1) {
        const estimator1 = await schedulesPage.AddEstimatorToSelectionByIndex(0)
        expect(await schedulesPage.IsEstimatorSelectable(estimator1)).toBe(false)
        expect(await schedulesPage.IsEstimatorRemoveable(estimator1)).toBe(true)

        const estimator2 = await schedulesPage.AddEstimatorToSelectionByIndex(1)
        expect(await schedulesPage.IsEstimatorSelectable(estimator2)).toBe(false)
        expect(await schedulesPage.IsEstimatorRemoveable(estimator2)).toBe(true)

        await schedulesPage.RemoveSelectedEstimator(estimator1)
        expect(await schedulesPage.IsEstimatorSelectable(estimator1)).toBe(true)
        expect(await schedulesPage.IsEstimatorRemoveable(estimator1)).toBe(false)
      }

      // Verify the calendar month is the current month (no year is displayed) and that is flanked by [Previous] and [Next] buttons
      const calendarInfo = await schedulesPage.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(true)
      expect(await schedulesPage.Button_Next.IsVisible()).toBe(true)
      expect(await schedulesPage.Button_Previous.IsVisible()).toBe(true)
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)

      // Verify Admin->Estimator Schedules Page navigation from ClaimsPortalLeftNavBar
      const schedulesPage = new ClaimsPortalEstimatorSchedulesPage(global)
      await schedulesPage.NavigateToPage()

      // Verify the title label of "Estimator Schedules" top left
      await schedulesPage.VerifyTitle()

      // Verify the "Select an Estimator(s)" dropdown list appears
      expect(await schedulesPage.ListBox_SelectEstimators.IsVisible()).toBe(true)

      // Verify that the default value is no specific Estimator selected (displays grayed "Select…") and that scheduled items are all displayed (not filtered to a single Estimator)
      await schedulesPage.VerifySelectEstimatorsIsEmpty()
      // Verify that more than 1 estimator can be selected and that each selected estimator has an X next to it that allows it to be removed from the list.
      // Verify that selected estimators are removed from the dropdown when added and added back in when unselected (X)
      const estimator1ToSelect = testClaim.testData.estimator1
      const estimator2ToSelect = testClaim.testData.estimator2

      await schedulesPage.AddEstimatorToSelection(estimator1ToSelect)
      expect(await schedulesPage.IsEstimatorSelectable(estimator1ToSelect)).toBe(false)
      expect(await schedulesPage.IsEstimatorRemoveable(estimator1ToSelect)).toBe(true)

      await schedulesPage.AddEstimatorToSelection(estimator2ToSelect)
      expect(await schedulesPage.IsEstimatorSelectable(estimator2ToSelect)).toBe(false)
      expect(await schedulesPage.IsEstimatorRemoveable(estimator2ToSelect)).toBe(true)

      await schedulesPage.RemoveSelectedEstimator(estimator1ToSelect)
      expect(await schedulesPage.IsEstimatorSelectable(estimator1ToSelect)).toBe(true)
      expect(await schedulesPage.IsEstimatorRemoveable(estimator1ToSelect)).toBe(false)

      // Verify the calendar month is the current month (no year is displayed) and that is flanked by [Previous] and [Next] buttons
      const calendarInfo = await schedulesPage.CalendarInfo()
      expect(calendarInfo.yearIsHidden).toBe(true)
      expect(await schedulesPage.Button_Next.IsVisible()).toBe(true)
      expect(await schedulesPage.Button_Previous.IsVisible()).toBe(true)
    })

    test('All Estimators - Verify Calendar Navigation (past, present and future)', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const schedulesPage = new ClaimsPortalEstimatorSchedulesPage(global)
      await schedulesPage.NavigateToPage()

      // Verify that no specific Estimators are selected (which means all should be shown)
      await schedulesPage.VerifySelectEstimatorsIsEmpty()

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

    test('Single Estimator - Verify Calendar Data', async ({ browser }) => {
      /// launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const schedulesPage = new ClaimsPortalEstimatorSchedulesPage(global)
      await schedulesPage.NavigateToPage()

      // Default to the current month - most likely to be populated with test data
      // Select a single estimator who has at least 1 scheduled item
      const estimatorToSelect = testClaim.testData.estimator1
      await schedulesPage.AddEstimatorToSelection(estimatorToSelect)

      // Verify only our targeted estimator has items displaying
      const visibleMonthEvents = await schedulesPage.GetEventsForVisibleMonth()
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

    test('Multiple Estimators - Verify Calendar Data', async ({ browser }) => {
      /// launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const schedulesPage = new ClaimsPortalEstimatorSchedulesPage(global)
      await schedulesPage.NavigateToPage()

      // Select a single estimator who has at least 1 scheduled item
      const estimator1ToSelect = testClaim.testData.estimator1
      await schedulesPage.AddEstimatorToSelection(estimator1ToSelect)

      const estimator2ToSelect = testClaim.testData.estimator2
      await schedulesPage.AddEstimatorToSelection(estimator2ToSelect)

      // Default to the current month - most likely to be populated with test data
      // Verify only our targeted estimators have items displaying
      const visibleMonthEvents = await schedulesPage.GetEventsForVisibleMonth()
      const eventNumber = visibleMonthEvents.length
      expect(eventNumber).toBeGreaterThanOrEqual(1)
      for (let monthIndex = 0; monthIndex < eventNumber; monthIndex++) {
        const dayEvents = visibleMonthEvents[monthIndex]
        const dayEventsNumber = dayEvents.length
        for (let dayIndex = 0; dayIndex < dayEventsNumber; dayIndex++) {
          const eventEstimator = dayEvents[dayIndex].estimator
          expect([estimator1ToSelect, estimator2ToSelect]).toContain(eventEstimator)
        }
      }
    })

    test('Verify Calendar Entry Tooltip(s)', async ({ browser }) => {
      /// launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const schedulesPage = new ClaimsPortalEstimatorSchedulesPage(global)
      await schedulesPage.NavigateToPage()

      // Select a single estimator who has at least 1 scheduled item
      const estimator1ToSelect = testClaim.testData.estimator1
      await schedulesPage.AddEstimatorToSelection(estimator1ToSelect)

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await schedulesPage.GetEventsForVisibleMonth()
      const eventNumber = visibleMonthEvents.length
      expect(eventNumber).toBeGreaterThanOrEqual(1)

      for (let eventIndex = 0; eventIndex < eventNumber; eventIndex++) {
        const dayEvents = visibleMonthEvents[eventIndex]
        const dayEventsNumber = dayEvents.length
        for (let dayIndex = 0; dayIndex < dayEventsNumber; dayIndex++) {
          const { estimator } = await schedulesPage.GetDayEventToolTips(dayEvents[dayIndex].day)
          const matches =
            estimator === EstimatorSchedulesPageStrings.Tooltip_Field_Agent ||
            estimator === EstimatorSchedulesPageStrings.Tooltip_Inspection_Tech
          expect(matches).toBe(true)
        }
      }
    })

    test('Navigate To Scheduled Event Claim', async ({ browser }) => {
      /// launch the Claims Portal
      const { global } = await Launch(browser, environment)
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const schedulesPage = new ClaimsPortalEstimatorSchedulesPage(global)
      await schedulesPage.NavigateToPage()

      // Select a single estimator who has at least 1 scheduled item
      const estimator1ToSelect = testClaim.testData.estimator1
      await schedulesPage.AddEstimatorToSelection(estimator1ToSelect)

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await schedulesPage.GetEventsForVisibleMonth()
      const eventNumber = visibleMonthEvents.length
      expect(eventNumber).toBeGreaterThanOrEqual(1)

      // pick the first event
      const dayEvent = visibleMonthEvents[0]
      // should be 1 event scheduled on this day for the estimator
      const claimLinkHref = dayEvent[0].claimLink

      // let's click on the claim link
      if (dayEvent[0].claimLinkLocator == null) {
        throw new Error('no claim link')
      }
      await dayEvent[0].claimLinkLocator.click({ force: true })
      await schedulesPage.page.waitForTimeout(3000)

      // Verify that our schedules page has become the claim page for our event
      const result = schedulesPage.page.url().endsWith(claimLinkHref)
      expect(result).toBe(true)
    })

    test('Verify Calendar Entry See Notes button', async ({ browser }) => {
      /// launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const schedulesPage = new ClaimsPortalEstimatorSchedulesPage(global)
      await schedulesPage.NavigateToPage()

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await schedulesPage.GetEventsForVisibleMonth()
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

    test('Calendar Entry Actions - Mark Canceled: Verify Cancel Inspection Drawer UI', async ({
      browser,
    }) => {
      /// launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const schedulesPage = new ClaimsPortalEstimatorSchedulesPage(global)
      await schedulesPage.NavigateToPage()

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await schedulesPage.GetEventsForVisibleMonth(true)
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

    test('Calendar Entry Actions - Mark Canceled: ValidateCancel Inspection Drawer', async ({
      browser,
    }) => {
      /// launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const schedulesPage = new ClaimsPortalEstimatorSchedulesPage(global)
      await schedulesPage.NavigateToPage()

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await schedulesPage.GetEventsForVisibleMonth(true)
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

    test('Calendar Entry Actions - Mark Completed: Verify Complete Inspection Drawer UI', async ({
      browser,
    }) => {
      /// launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const schedulesPage = new ClaimsPortalEstimatorSchedulesPage(global)
      await schedulesPage.NavigateToPage()

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await schedulesPage.GetEventsForVisibleMonth(true)
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
      /// launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Tags Page navigation from ClaimsPortalLeftNavBar
      const schedulesPage = new ClaimsPortalEstimatorSchedulesPage(global)
      await schedulesPage.NavigateToPage()

      // Default to the current month - most likely to be populated with test data
      // Verify each entry has a Field Agent tooltip associated with the calendar entry
      const visibleMonthEvents = await schedulesPage.GetEventsForVisibleMonth(true)
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
