import { Element } from '../../shared/element.js'
import { Locator } from '@playwright/test'
import { DelegatePortalMessageAbstract } from '../delegatePortalMessageAbstract.js'
import { DelegatePortalBasePage } from './delegatePortalBasePage.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { InboxPageStrings, InboxSortBySelectionOptions } from '../delegatePortalConstants.js'

export class DelegatePortalInboxPage extends DelegatePortalBasePage {
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

  constructor(global: DelegatePortalGlobal) {
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
    this.empty = this.page.locator(`#root div[role="alert"][data-status="error"]`)
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
      this.page
        .getByRole('link', { name: `${InboxPageStrings.Button_ViewClaim}`, exact: true })
        .nth(0)
    )
    this.Link_MessageDetails_ViewJob = new Element(
      global.page,
      this.page
        .getByRole('link', { name: `${InboxPageStrings.Button_ViewJob}`, exact: true })
        .nth(0)
    )
    this.Button_MessageDetails_Close = this.messageDetails.locator(
      `button[aria-label='Close message']`
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async IsEmpty() {
    const noMessagesAlert = await this.empty.isVisible()
    const noMessageList = (await this.allMessages.count()) == 0
    return noMessagesAlert || noMessageList
  }

  async SetSortBy(sortBy: InboxSortBySelectionOptions) {
    await this.ListBox_SortBy.locator.selectOption({ label: `${sortBy}` })
    await this.Wait(1000)
  }

  async MessageAbstract(index: number) {
    return new DelegatePortalMessageAbstract(this.global, this.messageRoot.locator(`> li`).nth(index))
  }

  async MessageCount() {
    await this.Wait(1000)
    return await this.allMessages.count()
  }

  async UnreadMessageCount() {
    await this.Wait(1000)
    const unreadText = await this.Badge_Unread.GetText()
    if (unreadText == undefined) {
      throw new Error('Unable to get Unread badge info')
    }
    const dataList = unreadText?.split(' ')
    return Number(dataList[0])
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.page.goto(this.URL)
    } else {
      await this.leftNavBar.Button_Inbox.Click()
      await this.page.waitForLoadState()
    }
    await this.page.waitForTimeout(2000)
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
    }
  }
}
