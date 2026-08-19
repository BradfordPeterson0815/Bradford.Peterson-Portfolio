import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { expect, Locator } from 'playwright/test'
import { DataTable_Columns_Type, LossOfUseDetailsPageStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'
import { ClaimsPortalClaim } from '../claimsPortalClaim.js'
import { ClaimsPortalUpdateLossOfUseStatusDrawer } from '../drawers/claimsPortalUpdateLossOfUseStatusDrawer.js'
import { ClaimsPortalAddLossOfUseReceiptDrawer } from '../drawers/claimsPortalAddLossOfUseReceiptDrawer.js'

export class ClaimsPortalLossOfUseDetailsPage extends ClaimsPortalBasePage {
  readonly claim: ClaimsPortalClaim
  readonly baseURL: string
  readonly Title: Element
  readonly Button_BackToLossOfUse: Element
  readonly Button_UpdateStatus: Element
  readonly Button_AddReceipt: Element
  readonly DataTable_Receipts: ClaimsPortalDataTable
  readonly Label_Details_Title: Element
  readonly Label_Details_ID: Element
  readonly Label_Details_Type: Element
  readonly Label_Details_Status: Element
  readonly Label_Details_AmountRequested: Element
  readonly Label_Summary_Title: Element
  readonly Label_Summary_Justification: Element
  readonly Label_Receipts_Title: Element
  readonly parent: Locator

  constructor(global: ClaimsPortalGlobal, claim: ClaimsPortalClaim, parentClaimPageURL: string) {
    super(global)
    this.claim = claim
    this.parent = this.page.locator('div.chakra-container div.chakra-stack[id*="body"]')
    this.baseURL = parentClaimPageURL
    this.Title = new Element(
      global.page,
      this.parent.getByText(LossOfUseDetailsPageStrings.Title_LossOfUseInfo),
      LossOfUseDetailsPageStrings.Title_LossOfUseInfo
    )
    this.Button_BackToLossOfUse = new Element(
      global.page,
      this.parent.locator('div > button').nth(0),
      LossOfUseDetailsPageStrings.Button_BackToLossOfUse
    )
    this.Button_UpdateStatus = new Element(
      global.page,
      this.parent.locator('div > button').nth(1),
      LossOfUseDetailsPageStrings.Button_UpdateStatus
    )
    this.Button_AddReceipt = new Element(
      global.page,
      this.parent.locator('div > button').nth(2),
      LossOfUseDetailsPageStrings.Button_AddReceipt
    )
    this.DataTable_Receipts = new ClaimsPortalDataTable(
      global,
      `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]`,
      1,
      LossOfUseDetailsPageStrings.ActionMenu,
      LossOfUseDetailsPageStrings.ActionMenuAria
    )
    this.Label_Details_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(0),
      'Details'
    )
    this.Label_Details_ID = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator('> dl')
        .nth(0)
        .getByText('ID')
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.testData.claimLossOfUseId
    )

    this.Label_Details_Type = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator('> dl')
        .nth(0)
        .getByText('Type')
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.testData.claimLossOfUseType
    )

    this.Label_Details_Status = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator('> dl')
        .nth(0)
        .getByText('Status')
        .locator('..')
        .locator('..')
        .locator('> dd')
    )

    this.Label_Details_AmountRequested = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(0)
        .locator('> dl')
        .nth(0)
        .getByText('Amount Requested')
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.testData.claimLossOfUseAmount
    )

    this.Label_Summary_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(1),
      'Summary'
    )

    this.Label_Summary_Justification = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText('Justification')
        .locator('..')
        .locator('..')
        .locator('> dd')
    )

    this.Label_Receipts_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(2),
      'Receipts'
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_Receipts.WaitForRowsToLoad()
  }

  async NavigateDirectly(lossOfUseDetailsId: string) {
    await this.page.waitForTimeout(1000)
    const targetUrl = `${this.baseURL}/loss-of-use/${lossOfUseDetailsId}`
    await this.page.goto(targetUrl)
    await this.page.waitForURL(targetUrl)
    await this.CustomLoad()
    await this.DataTable_Receipts.Button_ExpandTable.locator.waitFor({ state: 'visible' })
  }

  async VerifyDetailsSection() {
    await this.Label_Details_Title.VerifyExpectedText()
    await this.Label_Details_ID.VerifyExpectedTextAlt()
    await this.Label_Details_Type.VerifyExpectedTextAlt()
    await this.Label_Details_AmountRequested.VerifyExpectedTextAlt()
  }

  async VerifySummarySection() {
    await this.Label_Summary_Title.VerifyExpectedText()
  }

  async VerifyReceiptsSection() {
    await this.Label_Receipts_Title.VerifyExpectedText()
  }

  async OpenUpdateLossOfUseStatusDrawer() {
    await this.Button_UpdateStatus.Click()
    return new ClaimsPortalUpdateLossOfUseStatusDrawer(this.global)
  }

  async OpenAddLossOfUseReceiptDrawer() {
    await this.Button_AddReceipt.Click()
    return new ClaimsPortalAddLossOfUseReceiptDrawer(this.global)
  }

  async OpenDownloadLinkInNewTabVerifyAndClose(rowIndex: string, downloading = false) {
    const expectedTitle = await this.DataTable_Receipts.FetchRowTextDataByColumnName(
      rowIndex,
      DataTable_Columns_Type.LossOfUseReceipts_DocumentTitle
    )
    // currently always downloading so override headless exception
    downloading = false
    if (!downloading) {
      const pagePromise = this.context.waitForEvent('page')
      await this.DataTable_Receipts.ClickLinkInDataCell_ProvideName(rowIndex, 'download')
      const pageNew = await pagePromise
      await pageNew.waitForURL(/.*/)
      await pageNew.bringToFront()
      await pageNew.waitForTimeout(1000)
      const url = pageNew.url()
      const decoded = decodeURI(url)
      expect(decoded).toContain(expectedTitle)
      await pageNew.close()
    } else {
      const [download] = await Promise.all([
        this.page.waitForEvent('download'), // wait for download to start
        await this.DataTable_Receipts.ClickLinkInDataCell_ProvideName(rowIndex, 'download'),
      ])
      const endsWithPdf = download.suggestedFilename().endsWith('.pdf')
      expect(endsWithPdf).toBe(true)
    }
  }

  async VerifyTableSettingColumns() {
    const tableSettingsDialog = await this.DataTable_Receipts.OpenTableSettings()
    await tableSettingsDialog.VerifyColumnExists(
      DataTable_Columns_Type.LossOfUseReceipts_DocumentTitle
    )
    await tableSettingsDialog.VerifyColumnExists(
      DataTable_Columns_Type.LossOfUseReceipts_DocumentDescription
    )
    await tableSettingsDialog.VerifyColumnExists(
      DataTable_Columns_Type.LossOfUseReceipts_ReceiptNote
    )
    await tableSettingsDialog.VerifyColumnExists(
      DataTable_Columns_Type.LossOfUseReceipts_ReceiptDate
    )
    await tableSettingsDialog.Close()
  }
}
