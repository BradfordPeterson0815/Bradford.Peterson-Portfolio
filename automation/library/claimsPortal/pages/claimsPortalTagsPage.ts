import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'
import { Element } from '../../shared/element.js'
import { TagsPageStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'

export class ClaimsPortalTagsPage extends ClaimsPortalBasePage {
  readonly Title: Element
  readonly DataTable_Tags: ClaimsPortalDataTable

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${TagsPageStrings.Title}` }),
      TagsPageStrings.Title
    )
    this.URL = `${global.baseUrl}admin/tags`
    this.DataTable_Tags = new ClaimsPortalDataTable(
      global,
      `#root div[id$="_content"]`,
      1,
      TagsPageStrings.ActionMenu
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_Tags.WaitForRowsToLoad()
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.page.goto(this.URL)
    } else {
      await this.leftNavBar.GoHome()
      await this.leftNavBar.Button_Admin.Click()
      await this.page.waitForLoadState()
      await this.leftNavBar.Button_Admin_Tags.Click()
      await this.page.waitForLoadState()
    }
    await this.CustomLoad()
    const isEmpty = await this.DataTable_Tags.IsEmpty()
    if (!isEmpty) {
      // if there are rows, wait for one to be visible
      await this.DataTable_Tags.rows.nth(0).waitFor({ state: 'visible' })
    }
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async OpenRelatedTagsDrawer(rowPosition: number) {
    const rowIndex = await this.DataTable_Tags.FetchRowIndexFromRowPosition(rowPosition)
    const buttonLocator = `td[id*='_DataGrid_Row_${rowIndex}_${TagsPageStrings.ActionMenu}'] button`
    const button = new Element(this.global.page, this.DataTable_Tags.table.locator(buttonLocator))
    await button.Click()
    await this.page.waitForTimeout(1000)
  }
}
