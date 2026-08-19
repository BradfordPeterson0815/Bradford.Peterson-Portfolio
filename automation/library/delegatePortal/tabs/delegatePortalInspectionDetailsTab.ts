import { DelegatePortalBasePage } from '../pages/delegatePortalBasePage.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { Element } from '../../shared/element.js'
import { Locator } from 'playwright/test'
import { DataTable_Columns_Type, ClaimInspectionDetailsTabStrings } from '../delegatePortalConstants.js'
import { LookupDataColumn } from '../delegatePortalHelper.js'
import { DelegatePortalSelectionDataTable } from '../delegatePortalSelectionDataTable.js'

export class DelegatePortalInspectionDetailsTab extends DelegatePortalBasePage {
  readonly URL: string
  readonly InspectionDurationRange: Element
  readonly InspectionDescription: Element
  readonly Button_GetShareLink: Element
  readonly Button_Screenshot: Element
  readonly InspectionVideoTitle: Element
  readonly TextBox_Search: Element
  readonly DataTable_InspectionScreenshots: DelegatePortalSelectionDataTable
  readonly video: Locator
  readonly transcriptList: Locator
  readonly parent: Locator

  constructor(global: DelegatePortalGlobal, parentPageURL: string) {
    super(global)
    this.URL = `${parentPageURL}/inspections`
    this.parent = this.page.locator('div.chakra-container div.chakra-container')
    this.InspectionDurationRange = new Element(global.page, this.parent.locator('h2').nth(0))
    this.InspectionDescription = new Element(global.page, this.parent.locator('p').first())
    this.InspectionVideoTitle = new Element(
      global.page,
      this.parent.getByRole('heading', {
        name: `${ClaimInspectionDetailsTabStrings.InspectionVideo_Title}`,
      }),
      ClaimInspectionDetailsTabStrings.InspectionVideo_Title
    )
    this.video = this.parent.locator('div video')
    this.transcriptList = this.parent.locator('div.chakra-stack > div[id^="transcript"]')
    this.TextBox_Search = new Element(
      global.page,
      this.page.locator(`input[name="searchTranscript"]`)
    )
    this.Button_Screenshot = new Element(
      global.page,
      this.video.locator('..').locator('> div > button'),
      ClaimInspectionDetailsTabStrings.Button_Screenshot
    )
    this.Button_GetShareLink = new Element(
      global.page,
      this.parent.locator('div.chakra-card__header button'),
      ClaimInspectionDetailsTabStrings.Button_GetShareLink
    )
    this.DataTable_InspectionScreenshots = new DelegatePortalSelectionDataTable(
      global,
      `#root div:nth-child(2 of div[id^="card"]) > div[id$="_content"]`,
      1,
      '',
      ''
    )
  }

  async NavigateDirectly(inspectionUrlSuffix: string) {
    await this.page.goto(`${this.URL}/${inspectionUrlSuffix}`)
    await this.DataTable_InspectionScreenshots.Button_ExpandTable.locator.waitFor({
      state: 'visible',
    })
    await this.WaitForLoad()
  }

  async IsTranscriptAvailable(expectedToBe: boolean) {
    if (expectedToBe) {
      await this.transcriptList.first().waitFor({ state: 'attached' })
    }
    return (await this.transcriptList.count()) > 0
  }

  async NoTranscriptMatch() {
    const alertLocator = this.page.locator('div[data-status="info"][role="alert"]')
    const alertCount = await alertLocator.count()
    return alertCount > 0
  }

  async IsVideoAvailable() {
    return (await this.video.count()) > 0
  }

  async PerformSearch(searchTerm: string) {
    await this.page.waitForTimeout(1000)
    await this.TextBox_Search.locator.clear()
    await this.TextBox_Search.FillByTyping(searchTerm, 100)
    await this.page.waitForTimeout(1000)
  }

  async TranscriptMatchCount() {
    if (await this.IsTranscriptAvailable(true)) {
      return await this.transcriptList.count()
    }
    return 0
  }

  async SetScreenshotLabelToExistingLabel(rowIndex: string, existingLabel: string) {
    const parentDataLocator = this.DataTable_InspectionScreenshots.table.locator(
      `td[id$='_DataGrid_Row_${rowIndex}_${LookupDataColumn(DataTable_Columns_Type.InspectionScreenshots_Label)}']`
    )
    const clickLocator = parentDataLocator.locator('span > div > span')
    // click the label field in the indexed row
    await clickLocator.click()
    await this.page.waitForTimeout(500)
    const inputLocator = parentDataLocator.locator('input[role="combobox"]')
    // click the label list in the indexed row
    await inputLocator.click()
    await this.page.waitForTimeout(500)
    // enter the label into the index row
    await inputLocator.fill(existingLabel)
    await this.page.waitForTimeout(500)
    await this.page.keyboard.press('Enter')
    await this.page.waitForTimeout(2000)
  }

  async SetScreenshotDescription(rowIndex: string, description: string) {
    const parentDataLocator = this.DataTable_InspectionScreenshots.table.locator(
      `td[id$='_DataGrid_Row_${rowIndex}_${LookupDataColumn(DataTable_Columns_Type.InspectionScreenshots_Description)}'] > span > span`
    )
    // check for the p element (if this hasn't been touched yet), otherwise it's a textarea element
    const untouchedClickLocator = parentDataLocator.locator('p')
    const touchedClickLocator = parentDataLocator.locator('div > textarea')
    const isUntouched = (await untouchedClickLocator.count()) > 0
    const actualClickLocator = isUntouched ? untouchedClickLocator : touchedClickLocator
    // click the description column in the indexed row
    await actualClickLocator.click()
    await this.page.waitForTimeout(500)
    // click the description textarea in the indexed row
    await touchedClickLocator.click()
    // enter the description into in the indexed row
    await touchedClickLocator.fill(description)
    await this.page.waitForTimeout(500)
    await this.page.keyboard.press('Tab')
    await this.page.waitForTimeout(2000)
  }

  async GetScreenshotDescription(rowIndex: string) {
    const parentDataLocator = this.DataTable_InspectionScreenshots.table.locator(
      `td[id$='_DataGrid_Row_${rowIndex}_${LookupDataColumn(DataTable_Columns_Type.InspectionScreenshots_Description)}'] > span > span`
    )
    // check for the p element (if this hasn't been touched yet), otherwise it's a textarea element
    const untouchedLocator = parentDataLocator.locator('p')
    const touchedLocator = parentDataLocator.locator('div > textarea')
    const isUntouched = (await untouchedLocator.count()) > 0
    const actualLocator = isUntouched ? untouchedLocator : touchedLocator
    const result = await actualLocator.textContent()
    return result ? result : ''
  }
}
