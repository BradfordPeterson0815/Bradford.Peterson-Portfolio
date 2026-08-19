import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'
import { Element } from '../../shared/element.js'
import { InboxPageStrings, InboxSortBySelectionOptions } from '../claimsPortalConstants.js'
import { Locator, expect } from '@playwright/test'
import { ClaimsPortalMessageAbstract } from '../claimsPortalMessageAbstract.js'

export class ClaimsPortalInboxPage extends ClaimsPortalBasePage {
  readonly messageRoot: Locator
  readonly allMessages: Locator
  readonly empty: Locator
  readonly messageDetails: Locator
  readonly Title: Element
  readonly Badge_Unread: Element
  readonly ListBox_SortBy: Element
  readonly Button_MarkRead: Element
  readonly Button_MarkUnread: Element
  readonly Button_Archive: Element
  readonly Button_MessageDetails_MarkRead: Element
  readonly Button_MessageDetails_MarkUnread: Element
  readonly Button_MessageDetails_Archive: Element
  readonly Link_MessageDetails_ViewClaim: Element
  readonly Link_MessageDetails_ViewJob: Element
  readonly Button_MessageDetails_Close: Locator
  readonly Button_MarkAllRead: Element
  readonly Button_ArchiveAll: Element
  readonly CheckBox_SelectAll: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${InboxPageStrings.Title}` }),
      InboxPageStrings.Title
    )
    this.URL = `${global.baseUrl}messaging`
    this.Badge_Unread = new Element(global.page, this.page.locator(`#root .chakra-badge`))
    this.ListBox_SortBy = new Element(global.page, this.page.getByLabel('Sort By', { exact: true }))
    this.Button_MarkUnread = new Element(
      global.page,
      this.page.getByRole('button', { name: `${InboxPageStrings.Button_MarkUnread}` }).nth(0)
    )
    this.Button_MarkRead = new Element(
      global.page,
      this.page.getByRole('button', { name: `${InboxPageStrings.Button_MarkRead}` }).nth(0)
    )
    this.Button_Archive = new Element(
      global.page,
      this.page
        .getByRole('button', { name: `${InboxPageStrings.Button_Archive}`, exact: true })
        .nth(0)
    )

    this.Button_MarkAllRead = new Element(
      global.page,
      this.page.getByRole('button', { name: `${InboxPageStrings.Button_MarkAllRead}` })
    )
    this.Button_ArchiveAll = new Element(
      global.page,
      this.page.getByRole('button', { name: `${InboxPageStrings.Button_ArchiveAll}` })
    )

    this.CheckBox_SelectAll = new Element(
      global.page,
      this.page.locator(`input[type='checkbox']`).first()
    )

    this.messageRoot = this.page.locator('#root .chakra-container > div ul[role="list"]')
    this.allMessages = this.messageRoot.locator(`> li`)
    this.empty = this.page.locator(`#root div[role="alert"]`)
    this.messageDetails = this.page.locator('#root div[id*="_body"] > div > div[id^="card"]')
    this.Button_MessageDetails_MarkRead = new Element(
      global.page,
      this.page.getByRole('button', { name: `${InboxPageStrings.Button_MarkRead}` }).nth(1)
    )
    this.Button_MessageDetails_MarkUnread = new Element(
      global.page,
      this.page.getByRole('button', { name: `${InboxPageStrings.Button_MarkUnread}` }).nth(1)
    )
    this.Button_MessageDetails_Archive = new Element(
      global.page,
      this.page
        .getByRole('button', { name: `${InboxPageStrings.Button_Archive}`, exact: true })
        .nth(1)
    )
    this.Link_MessageDetails_ViewClaim = new Element(
      global.page,
      this.page.getByRole('link', { name: `${InboxPageStrings.Button_ViewClaim}`, exact: true })
    )
    this.Link_MessageDetails_ViewJob = new Element(
      global.page,
      this.page.getByRole('link', { name: `${InboxPageStrings.Button_ViewJob}`, exact: true })
    )
    this.Button_MessageDetails_Close = this.messageDetails.locator(
      `button[aria-label='Close message']`
    )
  }

  async WaitUntilDataLoadingIsCompleted(theLocator: Locator, timeout: number = 15000) {
    await expect(theLocator).not.toHaveAttribute('data-loading', { timeout: timeout })
  }
  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async IsEmpty() {
    return await this.empty.isVisible()
  }

  async SetSortBy(sortBy: InboxSortBySelectionOptions) {
    await this.ListBox_SortBy.locator.selectOption({ label: `${sortBy}` })
    await this.page.waitForTimeout(1000)
  }

  async MessageAbstract(index: number) {
    return new ClaimsPortalMessageAbstract(this.global, this.messageRoot.locator(`> li`).nth(index))
  }

  async MessageCount() {
    await this.page.waitForTimeout(1000)
    return await this.allMessages.count()
  }

  async UnreadMessageCount() {
    const unreadText = await this.Badge_Unread.GetText()
    if (unreadText == undefined) {
      throw new Error('Unable to get Unread badge info')
    }
    const dataList = unreadText?.split(' ')
    return Number(dataList[0])
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.Badge_Unread.locator.waitFor({ state: 'visible' })
    await this.messageRoot.locator('.chakra-skeleton').first().waitFor({ state: 'hidden' })
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.page.goto(this.URL)
    } else {
      await this.leftNavBar.GoHome()
      await this.leftNavBar.Button_Inbox.Click()
      await this.page.waitForLoadState()
    }
    await this.CustomLoad()
  }

  async GetActiveMessageDetails() {
    if ((await this.messageDetails.count()) > 0) {
      const category = await this.messageDetails.locator(`p`).nth(0).textContent()
      const topic = await this.messageDetails.locator(`p`).nth(1).textContent()
      const dateTime = await this.messageDetails.locator(`p`).nth(2).textContent()
      const details = await this.messageDetails.locator(`p`).nth(3).textContent()
      return { category, topic, dateTime, details }
    } else {
      return null
    }
  }

  async MessageDetailsAreVisible() {
    return (await this.messageDetails.count()) > 0
  }

  async SelectAndCheckMessage(messageIndex: number) {
    const checkboxLocator = this.messageRoot
      .locator(`> li`)
      .nth(messageIndex)
      .locator(`input[type='checkbox']`)
      .locator('..')
    const isCheckedLocator = await checkboxLocator.isChecked()
    if (!isCheckedLocator) {
      await checkboxLocator.setChecked(true)
      await this.WaitForMessageLoading()
    }
  }

  async SelectAndUncheckMessage(messageIndex: number) {
    const checkboxLocator = this.messageRoot
      .locator(`> li`)
      .nth(messageIndex)
      .locator(`input[type='checkbox']`)
      .locator('..')
    const isCheckedLocator = await checkboxLocator.isChecked()
    if (isCheckedLocator) {
      await checkboxLocator.setChecked(false)
      await this.WaitForMessageLoading()
    }
  }

  async SelectAndCheckAllMessages() {
    const allMessagesCheckboxLocator = this.page
      .locator(`input[type='checkbox']`)
      .first()
      .locator('..')
    const isCheckedLocator = await allMessagesCheckboxLocator.isChecked()
    if (!isCheckedLocator) {
      await allMessagesCheckboxLocator.setChecked(true)
      await this.WaitForMessageLoading()
    }
  }

  async SelectAndUncheckAllMessages() {
    const allMessagesCheckboxLocator = this.page
      .locator(`input[type='checkbox']`)
      .first()
      .locator('..')
    const isCheckedLocator = await allMessagesCheckboxLocator.isChecked()
    if (isCheckedLocator) {
      await allMessagesCheckboxLocator.setChecked(false)
      await this.WaitForMessageLoading()
    }
  }

  async WaitForMessageLoading() {
    await this.page.locator('button[data-loading]').waitFor({ state: 'hidden' })
    await this.page.waitForTimeout(1000)
  }
}
