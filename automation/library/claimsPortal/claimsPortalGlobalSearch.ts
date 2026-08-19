import { Locator } from '@playwright/test'
import { Element } from '../shared/element.js'
import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { ClaimsPortalBase } from './pages/claimsPortalBase.js'
import { GlobalSearchListItem } from '../shared/globalSearchListItem.js'
import { GlobalSearchItemTypes } from './claimsPortalConstants.js'

export class ClaimsPortalGlobalSearch extends ClaimsPortalBase {
  private readonly button: Element
  private readonly input: Element
  private readonly list: Locator
  private readonly listItems: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.button = new Element(global.page, this.page.getByRole('button', { name: 'Search Ctrl K' }))
    this.input = new Element(global.page, this.page.getByPlaceholder('Start typing to search'))
    this.list = this.page.locator(`div[aria-label="Suggestions"] > div`)
    this.listItems = this.page.locator(`div[aria-label="Suggestions"] > div > div`)
  }

  async OpenSearch() {
    await this.button.Click()
    await this.input.locator.isEnabled()
  }

  async CancelSearch() {
    await this.list.isEnabled()
    await this.input.locator.focus()
    await this.input.locator.isEnabled()
    await this.list.press('Escape')
  }

  async OpenAndSearchFor(searchTerm: string) {
    await this.button.Click()
    await this.list.isVisible()
    await this.input.Fill(searchTerm)
  }

  async IsListEmpty() {
    await this.list.isEnabled()
    const isEmpty = (await this.list.count()) == 0
    return isEmpty
  }

  async ItemsCount() {
    if (await this.IsListEmpty()) return 0
    const count = await this.listItems.count()
    return count
  }

  async Items() {
    const items: GlobalSearchListItem[] = []
    if (await this.IsListEmpty()) return items
    for (const div of await this.listItems.all()) {
      const isButton = (await div.locator(`> div > span`).count()) > 0
      if (isButton) {
        const type = GlobalSearchItemTypes.Command
        const value = await div.getAttribute('data-value')
        const category =
          (await div.locator(`> div > div > span`).count()) > 1
            ? await div.locator(`> div > div > span`).first().textContent()
            : ''
        const item = new GlobalSearchListItem(
          type,
          category == null ? '' : category,
          value == null ? '' : value
        )
        items.push(item)
      } else {
        const type = GlobalSearchItemTypes.Link
        const value = await div.getAttribute('data-value')
        const category =
          (await div.locator(`> div > div > span`).count()) > 1
            ? await div.locator(`> div > div > span`).first().textContent()
            : ''
        const item = new GlobalSearchListItem(
          type,
          category == null ? '' : category,
          value == null ? '' : value
        )
        items.push(item)
      }
    }
    return items
  }

  async SearchAndSelectItemByIndex(searchTerm: string, index: number) {
    await this.OpenAndSearchFor(searchTerm)
    if (await this.IsListEmpty()) throw new Error('the Global Search List is empty')
    await this.listItems.nth(index).click()
  }
}
