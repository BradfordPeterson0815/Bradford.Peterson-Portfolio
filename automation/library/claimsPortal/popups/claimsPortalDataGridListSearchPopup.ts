import { Locator } from 'playwright/test'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalDataGridListSearchPopup extends ClaimsPortalBase {
  readonly textSearchInputLocator: Locator
  readonly listItemLocator: Locator
  readonly clearFiltersButtonLocator: Locator
  readonly emptySearchResultsLocator: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.textSearchInputLocator = this.page.locator(
      `div[data-base-ui-portal] div[data-slot="command"] input[data-slot="command-input"]`
    )
    this.listItemLocator = this.page
      .locator(`div[data-base-ui-portal] div[data-slot="command"] div[data-slot="command-group"]`)
      .nth(0)
      .locator(`div[role="option"]`)
    this.clearFiltersButtonLocator = this.page.locator(
      `div[data-base-ui-portal] div[data-value="Clear filters"]`
    )
    this.emptySearchResultsLocator = this.page.locator(
      `div[data-base-ui-portal] div[data-slot="command-empty"]`
    )
  }

  async SetTextSearch(searchTerm: string) {
    await this.textSearchInputLocator.fill(searchTerm)
  }

  async ClearTextSearch() {
    await this.textSearchInputLocator.clear()
  }

  async IsSearchResultEmpty() {
    const isEmpty = (await this.emptySearchResultsLocator.count()) > 0
    return isEmpty
  }

  async SearchResultsCount() {
    if (await this.IsSearchResultEmpty()) {
      return 0
    } else {
      const resultCount = await this.listItemLocator.count()
      return resultCount
    }
  }

  async SelectListItem(listItem: string, closeAfterSet: boolean) {
    const targetListItem = await this.FetchListItem(listItem)
    if (targetListItem.exists) {
      if (!targetListItem.isSelected) {
        await targetListItem.locator.click()
      }
    }
    if (closeAfterSet) {
      await this.page.keyboard.press('Escape')
    }
  }

  async UnselectListItem(listItem: string, closeAfterSet: boolean) {
    const targetListItem = await this.FetchListItem(listItem)
    if (targetListItem.exists) {
      if (targetListItem.isSelected) {
        await targetListItem.locator.click()
      }
    }
    if (closeAfterSet) {
      await this.page.keyboard.press('Escape')
    }
  }

  async ClearFilters(closeAfterClear: boolean) {
    // this only appears if at least 1 item is selected
    const clearButtonExists = (await this.clearFiltersButtonLocator.count()) > 0
    if (clearButtonExists) {
      await this.clearFiltersButtonLocator.click()
    }
    if (closeAfterClear) {
      await this.page.keyboard.press('Escape')
    }
  }

  async IsListItemSelected(listItem: string) {
    const targetListItem = await this.FetchListItem(listItem)
    return targetListItem.exists ? targetListItem.isSelected : false
  }

  async FetchListItem(listItem: string) {
    const actualLocator = this.listItemLocator.getByText(listItem).first().locator('..')
    const exists = (await actualLocator.count()) > 0
    const isSelectedLocatorCount = await actualLocator.locator('div[class*="bg-primary"]').count()
    const isSelected = isSelectedLocatorCount > 0
    const matchCountLocator = actualLocator.locator('span').nth(1)
    let matchCount = 0
    if ((await matchCountLocator.count()) > 0) {
      const actualMatchCount = await matchCountLocator.textContent()
      if (actualMatchCount != null) {
        matchCount = parseInt(actualMatchCount)
      }
    }
    return {
      locator: actualLocator,
      exists,
      isSelected,
      matchCount,
    }
  }
}
