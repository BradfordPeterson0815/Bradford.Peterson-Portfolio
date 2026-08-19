import { Locator } from 'playwright/test'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { DataGrid_DateSearchOption } from '../claimsPortalConstants.js'
import { DateEntryFormatting } from '../claimsPortalHelper.js'

export class ClaimsPortalDataGridDateSearchPopup extends ClaimsPortalBase {
  readonly searchOptionsButtonLocator: Locator
  readonly searchOptionListBoxLocator: Locator
  readonly searchDateLocator: Locator
  readonly clearButtonLocator: Locator
  readonly searchOptionItemsLocator: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.searchOptionsButtonLocator = this.page.locator(
      `div[data-base-ui-portal] button[role="combobox"]`
    )

    this.searchOptionListBoxLocator = this.page.locator(
      `div[data-base-ui-portal] div[role="listbox"]`
    )

    this.searchDateLocator = this.page.locator(
      `div[data-base-ui-portal] div[data-slot="input-group"] input[data-slot="input"][type="date"]`
    )

    this.clearButtonLocator = this.page.locator(
      `div[data-base-ui-portal] div[data-slot="input-group"] button[data-slot="button"]`
    )

    this.searchOptionItemsLocator = this.searchOptionListBoxLocator.locator(
      'div[data-slot="select-item-text"]'
    )
  }

  async SetSearchOption(dateSearchOption: DataGrid_DateSearchOption, closeAfterSet: boolean) {
    // check to see if the currently selected option not what we want
    const currentSearch = await this.searchOptionsButtonLocator.locator('span').nth(0).textContent()
    if (currentSearch != dateSearchOption) {
      // open the list
      await this.searchOptionsButtonLocator.click()

      // select search option
      await this.searchOptionItemsLocator.getByText(dateSearchOption).click()
    }
    if (closeAfterSet) {
      await this.page.keyboard.press('Escape')
    }
  }

  async SetSearchDate(date: Date, closeAfterSet: boolean) {
    await this.searchDateLocator.focus()
    await this.page.keyboard.type(DateEntryFormatting(date))
    if (closeAfterSet) {
      await this.page.keyboard.press('Escape')
    }
  }

  async ClearSearch(closeAfterClear: boolean) {
    const exists = (await this.clearButtonLocator.count()) > 0
    if (exists) {
      await this.clearButtonLocator.click()
      if (closeAfterClear) {
        await this.page.keyboard.press('Escape')
      }
    }
  }
}