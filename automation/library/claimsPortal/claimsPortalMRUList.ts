import { Locator } from '@playwright/test'
import { Element } from '../shared/element.js'
import { MRUListItem } from '../shared/mruListItem.js'
import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { ClaimsPortalBase } from './pages/claimsPortalBase.js'

export class ClaimsPortalMRUList extends ClaimsPortalBase {
  private readonly root: Locator
  private readonly menuList: Locator
  private readonly menuListItems: Locator
  private readonly buttonCounter: Locator
  private readonly button: Element

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.root = this.page.locator(
      `#root > div >div:nth-of-type(3) > div > div:nth-of-type(2) > div:nth-of-type(2)`
    )
    this.menuList = this.page.locator(
      `#root > div >div:nth-of-type(3) > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div[role='menu']`
    )
    this.menuListItems = this.menuList.locator(`a[role='menuitem']`)
    this.buttonCounter = this.root.locator(`> div:nth-of-type(2)`)
    this.button = new Element(global.page, this.root.locator(`> button`))
  }

  async IsListEmpty() {
    const menuListIsEmpty = (await this.menuListItems.count()) == 0
    return menuListIsEmpty
  }

  async ItemsCount() {
    if (await this.IsListEmpty()) return 0
    await this.root.waitFor()
    const count = await this.menuListItems.count()
    return count
  }

  async ButtonCounterValue() {
    if (await this.IsListEmpty()) return 'none'
    const textValue = await this.buttonCounter.textContent()
    return textValue
  }

  async Items() {
    const items: MRUListItem[] = []
    if (await this.IsListEmpty()) return items
    await this.root.waitFor()
    for (const a of await this.menuListItems.all()) {
      const href = await a.getAttribute('href')
      const type = await a.locator('span:nth-of-type(2) > div > div> span').textContent()
      const value = await a.locator('span:nth-of-type(2) > div  > span').textContent()
      const item = new MRUListItem(
        href == null ? '' : href,
        type == null ? '' : type,
        value == null ? '' : value
      )
      items.push(item)
    }
    return items
  }

  async SelectItemByIndex(index: number) {
    if (await this.IsListEmpty()) throw new Error('the MRU List is empty')
    await this.root.waitFor()
    await this.button.Click()
    await this.menuList.waitFor()
    await this.menuListItems.nth(index).click()
  }
}
