import { expect } from '@playwright/test'
import {
  AbortErrors,
  DefaultEnvironment,
  InboxSortBySelectionOptions,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import {
  LaunchInspectionTech,
  LaunchInspectionTechMobile,
} from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalInboxPage } from '../../../library/delegatePortal/pages/delegatePortalInboxPage.js'
import { AbortTest } from '../../../library/shared/commonHelper.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment
test.describe(
  'Inbox Page',
  {
    tag: [Tags.Delegate, Tags.InspectionTech, Tags.Claim, Tags.Estimates, Tags.InfoDetails],
  },
  () => {
    test.describe.configure({ mode: 'default' })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Verify Inbox Page navigation from LeftNavBar
      const inboxPage = new DelegatePortalInboxPage(global)
      await inboxPage.NavigateToPage()

      // Verify the Your Inbox title (top left)
      await inboxPage.VerifyTitle()

      // if there are no messages, abort test
      if (await inboxPage.IsEmpty()) {
        AbortTest(AbortErrors.EmptyInboxMessage)
        return
      }

      // Verify the # Unread label (to the right of the title)
      expect(await inboxPage.Badge_Unread.IsVisible()).toBe(true)

      // Verify Read/Unread dropdown is displayed
      expect(await inboxPage.ListBox_SortBy.IsVisible()).toBe(true)

      // Verify Mark All Read) button (top right) is displayed
      expect(await inboxPage.Button_MarkAllRead.IsVisible()).toBe(true)

      // Verify Archive All) button (top right) is displayed
      expect(await inboxPage.Button_ArchiveAll.IsVisible()).toBe(true)

      // Verify SelectAll checkbox is displayed
      expect(await inboxPage.CheckBox_SelectAll.IsVisible()).toBe(true)

      if ((await inboxPage.MessageCount()) > 0) {
        await inboxPage.SelectAndCheckMessage(0)
        const messageAbstract = await inboxPage.MessageAbstract(0)

        // Verify Message Abstract entry Category is valid
        const messagingCategories: string[] = ['Messaging - Assignments', 'Messaging - ClaimsPortal']
        const actualCategory = await messageAbstract.Label_Category.GetText()
        expect(actualCategory != null && messagingCategories.includes(actualCategory)).toBe(true)

        // Verify Message Abstract entry date stamp is a date or time
        const datetime = await messageAbstract.Label_DateTime.GetText()
        expect(
          (datetime != null &&
            (datetime.endsWith('2024') ||
              datetime.endsWith('2025') ||
              datetime.endsWith('2026'))) ||
            (datetime != null && (datetime.endsWith('AM') || datetime.endsWith('PM')))
        ).toBe(true)

        // Verify Message entry Topic/Title most likely contains...
        const messagingTopics: string[] = ['Assignment', 'Estimate', 'Inspection']
        const actualTopic = (await messageAbstract.Label_Topic.GetText()) ?? ''
        const matchesTopic = messagingTopics.some((topic) => actualTopic.includes(topic))
        expect(matchesTopic).toBe(true)

        // Verify Message entry Details most likely contains...
        const messagingDetails: string[] = [
          `You've been set as the Inspection Tech for`,
          'Estimate for ',
          'Your scheduled inspection',
          'Inspection completed for ',
        ]
        const actualDetails = (await messageAbstract.Label_Details.GetText()) ?? ''
        const matchesDetails = messagingDetails.some((detail) => actualDetails.includes(detail))
        expect(matchesDetails).toBe(true)

        // Verify no Message Details are visible (yet)
        expect(await inboxPage.MessageDetailsAreVisible()).toBe(false)

        // Select the message and verfy the Message Details
        await messageAbstract.MakeActive()

        // Verify Message Details are now visible
        expect(await inboxPage.MessageDetailsAreVisible()).toBe(true)
        const selectedMessage = await inboxPage.GetActiveMessageDetails()
        expect(selectedMessage).not.toBe(null)
        expect(actualCategory != null && messagingCategories.includes(actualCategory)).toBe(true)
        expect(
          selectedMessage?.category != null &&
            messagingCategories.includes(selectedMessage.category)
        ).toBe(true)
        expect(
          selectedMessage?.dateTime != null &&
            (selectedMessage?.dateTime.endsWith('AM') || selectedMessage?.dateTime.endsWith('PM'))
        ).toBe(true)
        expect(
          selectedMessage != null &&
            selectedMessage.topic != null &&
            messagingTopics.some((topic) => selectedMessage.topic ?? ''.includes(topic))
        ).toBe(true)
        expect(
          selectedMessage != null &&
            selectedMessage.details != null &&
            messagingDetails.some((detail) => selectedMessage.details ?? ''.includes(detail))
        ).toBe(true)

        // Verify buttons in Message Details
        expect(await inboxPage.Button_MessageDetails_Archive.IsVisible()).toBe(true)
        expect(await inboxPage.Button_MessageDetails_MarkUnread.IsVisible()).toBe(true)
        expect(await inboxPage.Button_MessageDetails_MarkRead.IsVisible()).toBe(false)

        // mark the selected mesage as unread and check details buttons
        await inboxPage.Button_MarkUnread.Click()
        await inboxPage.page.waitForTimeout(2000)
        expect(await inboxPage.Button_MessageDetails_MarkUnread.IsVisible()).toBe(false)
        expect(await inboxPage.Button_MessageDetails_MarkRead.IsVisible()).toBe(true)

        // Close Message Details
        await inboxPage.Button_MessageDetails_Close.click()

        // Verify Message Details are no longer visible
        expect(await inboxPage.MessageDetailsAreVisible()).toBe(false)
      }
    })

    test('Verify Sort By', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Verify Inbox Page navigation from LeftNavBar
      const inboxPage = new DelegatePortalInboxPage(global)
      await inboxPage.NavigateToPage()

      // if there are less than 2 messages, we cannot do this test
      if ((await inboxPage.MessageCount()) < 2) {
        AbortTest(AbortErrors.InboxNotEnoughMessages)
        return
      }

      // Set the selection to Date Received mode
      await inboxPage.SetSortBy(InboxSortBySelectionOptions.Date)

      // set all messages to Read
      await inboxPage.Button_MarkAllRead.Click()
      await inboxPage.page.waitForTimeout(2000)

      // Set the 2nd message as Unread
      await inboxPage.SelectAndCheckMessage(1)
      await inboxPage.Button_MarkUnread.Click()

      // grab abstract data with Date Sort
      const message1InitialAbstract = await inboxPage.MessageAbstract(0)
      const initialMessage1Topic = await message1InitialAbstract.Label_Topic.GetText()
      const message2InitialAbstract = await inboxPage.MessageAbstract(1)
      const initialMessage2Topic = await message2InitialAbstract.Label_Topic.GetText()

      // Set the selection to Read/Unread mode
      await inboxPage.SetSortBy(InboxSortBySelectionOptions.Unread)
      const message1AbstractAfterFirstSort = await inboxPage.MessageAbstract(0)
      const message1TopicAfterFirstSort = await message1AbstractAfterFirstSort.Label_Topic.GetText()

      // the unread message should be in first position after the first sort
      expect(initialMessage2Topic).toBe(message1TopicAfterFirstSort)

      // set sort back to Date
      await inboxPage.SetSortBy(InboxSortBySelectionOptions.Date)
      const message1AbstractAfterSecondSort = await inboxPage.MessageAbstract(0)
      const message1TopicAfterSecondSort =
        await message1AbstractAfterSecondSort.Label_Topic.GetText()

      // the orginal 1st message should be in first position after the second sort
      expect(initialMessage1Topic).toBe(message1TopicAfterSecondSort)
    })

    test('Mark Message as Read', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Verify Inbox Page navigation from LeftNavBar
      const inboxPage = new DelegatePortalInboxPage(global)
      await inboxPage.NavigateToPage()

      // if there no messages, we cannot do this test
      if (await inboxPage.IsEmpty()) {
        AbortTest(AbortErrors.EmptyInboxMessage)
        return
      }

      // set all messages to Unread
      await inboxPage.SelectAndCheckAllMessages()
      await inboxPage.Button_MarkUnread.Click()
      await expect(inboxPage.CheckBox_SelectAll.locator).toBeChecked({ checked: false })

      // get the current Unread count
      const initialUnreadMessageCount = await inboxPage.UnreadMessageCount()

      // Set the 1st message as Read
      await inboxPage.SelectAndCheckMessage(0)
      await inboxPage.Button_MarkRead.Click()
      await inboxPage.Wait(1000)

      // Verify the message is marked as Read
      const messageAbstract = await inboxPage.MessageAbstract(0)
      await messageAbstract.MakeActive()
      expect(await inboxPage.Button_MessageDetails_MarkRead.IsVisible()).toBe(false)
      expect(await inboxPage.Button_MessageDetails_MarkUnread.IsVisible()).toBe(true)

      // Verify our Unread count has lowered by 1
      const currentUnreadMessageCount = await inboxPage.UnreadMessageCount()

      expect(initialUnreadMessageCount).toBe(currentUnreadMessageCount + 1)
    })

    test('Mark All Selected as Read', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Verify Inbox Page navigation from LeftNavBar
      const inboxPage = new DelegatePortalInboxPage(global)
      await inboxPage.NavigateToPage()

      // if there no messages, we cannot do this test
      if (await inboxPage.IsEmpty()) {
        AbortTest(AbortErrors.EmptyInboxMessage)
        return
      }

      // set all messages to Unread
      await inboxPage.SelectAndCheckAllMessages()
      await inboxPage.Button_MarkUnread.Click()
      await expect(inboxPage.CheckBox_SelectAll.locator).toBeChecked({ checked: false })

      // get the current Unread count
      const initialUnreadMessageCount = await inboxPage.UnreadMessageCount()
      expect(initialUnreadMessageCount).toBeGreaterThan(0)

      // Set all messages as Read
      await inboxPage.SelectAndCheckAllMessages()
      await inboxPage.Button_MarkRead.Click()
      await expect(inboxPage.CheckBox_SelectAll.locator).toBeChecked({ checked: false })

      // Verify our Unread count should be 0
      const currentUnreadMessageCount = await inboxPage.UnreadMessageCount()
      expect(currentUnreadMessageCount).toBe(0)
    })

    test('Mark Message as Unread', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Verify Inbox Page navigation from LeftNavBar
      const inboxPage = new DelegatePortalInboxPage(global)
      await inboxPage.NavigateToPage()

      // if there no messages, we cannot do this test
      if (await inboxPage.IsEmpty()) {
        AbortTest(AbortErrors.EmptyInboxMessage)
        return
      }

      // set all messages to Read
      await inboxPage.SelectAndCheckAllMessages()
      await inboxPage.Button_MarkRead.Click()
      await expect(inboxPage.CheckBox_SelectAll.locator).toBeChecked({ checked: false })

      // get the current Unread count
      const initialUnreadMessageCount = await inboxPage.UnreadMessageCount()
      expect(initialUnreadMessageCount).toBe(0)

      // Set the 1st message as Unread
      const messageAbstract = await inboxPage.MessageAbstract(0)
      await messageAbstract.MakeActive()
      await inboxPage.SelectAndCheckMessage(0)
      await inboxPage.Button_MarkUnread.Click()
      await inboxPage.Wait(1000)

      // Verify the message is marked as Unread
      expect(await inboxPage.Button_MessageDetails_MarkUnread.IsVisible()).toBe(false)
      expect(await inboxPage.Button_MessageDetails_MarkRead.IsVisible()).toBe(true)

      // Verify our Unread count is 1
      const currentUnreadMessageCount = await inboxPage.UnreadMessageCount()
      expect(currentUnreadMessageCount).toBe(1)
    })

    test('Mark All Selected as Unread', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Verify Inbox Page navigation from LeftNavBar
      const inboxPage = new DelegatePortalInboxPage(global)
      await inboxPage.NavigateToPage()

      // if there no messages, we cannot do this test
      if (await inboxPage.IsEmpty()) {
        AbortTest(AbortErrors.EmptyInboxMessage)
        return
      }

      // get the total message count
      const maxMessageCount = await inboxPage.MessageCount()

      // set all messages to Read
      await inboxPage.SelectAndCheckAllMessages()
      await inboxPage.Button_MarkRead.Click()
      await expect(inboxPage.CheckBox_SelectAll.locator).toBeChecked({ checked: false })

      // get the current Unread count
      const initialUnreadMessageCount = await inboxPage.UnreadMessageCount()
      expect(initialUnreadMessageCount).toBe(0)

      // Set all messages as Unread
      await inboxPage.SelectAndCheckAllMessages()
      await inboxPage.Button_MarkUnread.Click()
      await expect(inboxPage.CheckBox_SelectAll.locator).toBeChecked({ checked: false })

      // Verify our Unread count should be max (all messages)
      const currentUnreadMessageCount = await inboxPage.UnreadMessageCount()
      expect(currentUnreadMessageCount).toBe(maxMessageCount)
    })

    test('Mark All Read', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Verify Inbox Page navigation from LeftNavBar
      const inboxPage = new DelegatePortalInboxPage(global)
      await inboxPage.NavigateToPage()

      // if there no messages, we cannot do this test
      if (await inboxPage.IsEmpty()) {
        AbortTest(AbortErrors.EmptyInboxMessage)
        return
      }

      // set all messages to Unread
      await inboxPage.SelectAndCheckAllMessages()
      await inboxPage.Button_MarkUnread.Click()
      await expect(inboxPage.CheckBox_SelectAll.locator).toBeChecked({ checked: false })

      // get the current Unread count
      const initialUnreadMessageCount = await inboxPage.UnreadMessageCount()
      expect(initialUnreadMessageCount).toBeGreaterThan(0)

      // Set all messages as Read with AllRead button
      await inboxPage.Button_MarkAllRead.Click()
      await inboxPage.page.waitForTimeout(2000)

      // Verify our Unread count should be 0
      const currentUnreadMessageCount = await inboxPage.UnreadMessageCount()
      expect(currentUnreadMessageCount).toBe(0)
    })

    test('View Claim', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Verify Inbox Page navigation from LeftNavBar
      const inboxPage = new DelegatePortalInboxPage(global)
      await inboxPage.NavigateToPage()

      // if there no messages, we cannot do this test
      if (await inboxPage.IsEmpty()) {
        AbortTest(AbortErrors.EmptyInboxMessage)
        return
      }

      // check for a assignments message
      const maxMessageCount = await inboxPage.MessageCount()
      let wasVerified = false

      for (let index = 0; index < maxMessageCount; index++) {
        const messageAbstract = await inboxPage.MessageAbstract(index)
        const category = await messageAbstract.Label_Category.GetText()
        if (category == 'Messaging - Assignments') {
          await messageAbstract.MakeActive()
          expect(await inboxPage.Link_MessageDetails_ViewClaim.IsVisible()).toBe(true)

          // Follow View Claim link
          const targetURL =
            await inboxPage.Link_MessageDetails_ViewClaim.locator.getAttribute('href')
          await inboxPage.Link_MessageDetails_ViewClaim.Click()
          await inboxPage.page.waitForTimeout(3000)

          // verify we navigated to the job page of the target
          expect(inboxPage.page.url().endsWith(`${targetURL}/info`)).toBe(true)
          wasVerified = true
          break
        }
      }

      expect(wasVerified).toBe(true)
    })

    test('Verify Mobile Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Field Agent in mobile mode
      const { homePage, global } = await LaunchInspectionTechMobile(browser, environment)

      // Verify Inbox Page navigation from Main Menu on the mobile page
      const inboxPage = new DelegatePortalInboxPage(global)
      const leftNavbar = await homePage.OpenMobileNavBar()
      await leftNavbar.Button_Inbox.Click()

      // Verify the Your Inbox title (top left)
      await inboxPage.VerifyTitle()

      // if there are no messages, abort test
      if (await inboxPage.IsEmpty()) {
        AbortTest(AbortErrors.EmptyInboxMessage)
        return
      }

      // Verify the # Unread label (to the right of the title)
      expect(await inboxPage.Badge_Unread.IsVisible()).toBe(true)

      // Verify Read/Unread dropdown is displayed
      expect(await inboxPage.ListBox_SortBy.IsVisible()).toBe(true)

      // Verify Mark All Read) button (top right) is displayed
      expect(await inboxPage.Button_MarkAllRead.IsVisible()).toBe(true)

      // Verify Archive All) button (top right) is displayed
      expect(await inboxPage.Button_ArchiveAll.IsVisible()).toBe(true)

      // Verify SelectAll checkbox is displayed
      expect(await inboxPage.CheckBox_SelectAll.IsVisible()).toBe(true)

      if ((await inboxPage.MessageCount()) > 0) {
        await inboxPage.SelectAndCheckMessage(1)
        const messageAbstract = await inboxPage.MessageAbstract(1)

        // Verify Message Abstract entry Category is valid
        const messagingCategories: string[] = ['Messaging - Assignments', 'Messaging - ClaimsPortal']
        const actualCategory = await messageAbstract.Label_Category.GetText()
        expect(actualCategory != null && messagingCategories.includes(actualCategory)).toBe(true)

        // Verify Message Abstract entry date stamp is a date or time
        const datetime = await messageAbstract.Label_DateTime.GetText()
        expect(
          (datetime != null &&
            (datetime.endsWith('2024') ||
              datetime.endsWith('2025') ||
              datetime.endsWith('2026'))) ||
            (datetime != null && (datetime.endsWith('AM') || datetime.endsWith('PM')))
        ).toBe(true)

        // Verify Message entry Topic/Title most likely contains...
        const messagingTopics: string[] = ['Assignment', 'Estimate', 'Inspection']
        const actualTopic = (await messageAbstract.Label_Topic.GetText()) ?? ''
        const matchesTopic = messagingTopics.some((topic) => actualTopic.includes(topic))
        expect(matchesTopic).toBe(true)

        // Verify Message entry Details most likely contains...
        const messagingDetails: string[] = [
          `You've been set as the Inspection Tech for`,
          'Estimate for ',
          'Your scheduled inspection',
          'Inspection completed for ',
        ]
        const actualDetails = (await messageAbstract.Label_Details.GetText()) ?? ''
        const matchesDetails = messagingDetails.some((detail) => actualDetails.includes(detail))
        expect(matchesDetails).toBe(true)

        // Verify no Message Details are visible (yet)
        expect(await inboxPage.MessageDetailsAreVisible()).toBe(false)

        // Select the message and verfy the Message Details
        await messageAbstract.MakeActive()

        // Verify Message Details are now visible
        expect(await inboxPage.MessageDetailsAreVisible()).toBe(true)
        const selectedMessage = await inboxPage.GetActiveMessageDetails()
        expect(selectedMessage).not.toBe(null)
        expect(actualCategory != null && messagingCategories.includes(actualCategory)).toBe(true)
        expect(
          selectedMessage?.category != null &&
            messagingCategories.includes(selectedMessage.category)
        ).toBe(true)
        expect(
          selectedMessage?.dateTime != null &&
            (selectedMessage?.dateTime.endsWith('AM') || selectedMessage?.dateTime.endsWith('PM'))
        ).toBe(true)
        expect(
          selectedMessage != null &&
            selectedMessage.topic != null &&
            messagingTopics.some((topic) => selectedMessage.topic ?? ''.includes(topic))
        ).toBe(true)
        expect(
          selectedMessage != null &&
            selectedMessage.details != null &&
            messagingDetails.some((detail) => selectedMessage.details ?? ''.includes(detail))
        ).toBe(true)

        // Verify buttons in Message Details
        expect(await inboxPage.Button_MessageDetails_Archive.IsVisible()).toBe(true)
        expect(await inboxPage.Button_MessageDetails_MarkUnread.IsVisible()).toBe(true)
        expect(await inboxPage.Button_MessageDetails_MarkRead.IsVisible()).toBe(false)

        // mark the selected mesage as unread and check details buttons
        await inboxPage.Button_MarkUnread.Click()
        await inboxPage.page.waitForTimeout(2000)
        await inboxPage.Button_MessageDetails_Close.count()
        expect(await inboxPage.Button_MessageDetails_MarkUnread.IsVisible()).toBe(false)
        expect(await inboxPage.Button_MessageDetails_MarkRead.IsVisible()).toBe(true)

        // Close Message Details
        await inboxPage.Button_MessageDetails_Close.click()

        // Verify Message Details are no longer visible
        expect(await inboxPage.MessageDetailsAreVisible()).toBe(false)
      }
    })
  }
)
