import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { DataTable_Columns_Type, DrawerStrings } from '../claimsPortalConstants.js'
import { Locator } from '@playwright/test'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'
import { LookupDataColumn } from '../claimsPortalHelper.js'

export class ClaimsPortalRelatedTagKeyDrawer extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly parent: Locator
  readonly DataTable_RelatedTags: ClaimsPortalDataTable

  constructor(global: ClaimsPortalGlobal, tagKey: string) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleText = `${DrawerStrings.RelatedTagKey_Title} ${tagKey}`
    this.Title = new Element(global.page, this.parent.getByText(titleText), titleText)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(global.page, this.parent.locator(`> div:nth-child(4) button`))
    this.DataTable_RelatedTags = new ClaimsPortalDataTable(global, `div[role="dialog"]`, 0)
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_RelatedTags.WaitForRowsToLoad()
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async NavigateToResource(rowPosition: number) {
    const actualIndex = await this.FindIndexOfRowAtPosition(rowPosition)
    const linkLocator = `td[id*='_DataGrid_Row_${actualIndex}_${LookupDataColumn(
      DataTable_Columns_Type.RelatedTags_Resource
    )}'] a`
    const link = new Element(
      this.global.page,
      this.DataTable_RelatedTags.table.locator(linkLocator)
    )
    await link.Click()
    await this.page.waitForTimeout(1000)
  }

  async FindIndexOfRowAtPosition(rowPosition: number) {
    const value = await this.DataTable_RelatedTags.FetchRowIndexFromRowPosition(rowPosition)
    return Number(value)
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
