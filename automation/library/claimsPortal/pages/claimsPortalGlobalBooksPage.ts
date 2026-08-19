import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'
import { Element } from '../../shared/element.js'
import {
  ContactBookTypes,
  DataTable_Columns_Type,
  GlobalBooksPageStrings,
  GlobalBooks_DataTable_ActionMenuItems,
} from '../claimsPortalConstants.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'

export class ClaimsPortalGlobalBooksPage extends ClaimsPortalBasePage {
  readonly Title: Element
  readonly DataTable_GlobalBooks: ClaimsPortalDataTable

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: 'Global Books' }),
      GlobalBooksPageStrings.Title
    )
    this.URL = `${global.baseUrl}contacts/book`
    this.DataTable_GlobalBooks = new ClaimsPortalDataTable(
      global,
      `#root div[id$="_content"]`,
      1,
      GlobalBooksPageStrings.ActionMenu,
      GlobalBooksPageStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_GlobalBooks.WaitForRowsToLoad()
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.page.goto(this.URL)
    } else {
      await this.leftNavBar.GoHome()
      await this.leftNavBar.Button_Admin.Click()
      await this.page.waitForLoadState()
      await this.leftNavBar.Button_Admin_Contacts.Click()
      await this.page.waitForLoadState()
    }
    await this.CustomLoad()
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async SelectActionMenuItem(
    rowIndex: string,
    actionMenuItem: GlobalBooks_DataTable_ActionMenuItems
  ) {
    await this.DataTable_GlobalBooks.OpenActionMenu(rowIndex)
    await this.DataTable_GlobalBooks.SelectActionMenuItem(actionMenuItem)
  }

  async ClickContactBookByRowIndex(rowIndex: string) {
    await this.DataTable_GlobalBooks.ClickLinkInDataCell(
      rowIndex,
      DataTable_Columns_Type.GlobalContacts_Name
    )
  }

  async ClickContactBookByName(contactBook: ContactBookTypes) {
    const index = await this.DataTable_GlobalBooks.FetchRowIndexOfDataByColumnName(
      contactBook,
      DataTable_Columns_Type.GlobalContacts_Name
    )
    if (index == null) {
      throw new Error(`Unable to find ${contactBook} in the Name column`)
    }
    await this.DataTable_GlobalBooks.ClickLinkInDataCell(
      index,
      DataTable_Columns_Type.GlobalContacts_Name
    )
  }
}
