import { DelegatePortalBasePage } from './delegatePortalBasePage.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { Element } from '../../shared/element.js'
import { expect, Locator } from 'playwright/test'
import { DelegatePortalClaim } from '../delegatePortalClaim.js'
import {
  DataTable_Columns_Type,
  ClaimDocumentsTabStrings,
  EstimateDetailsPageStrings,
} from '../delegatePortalConstants.js'
import { DelegatePortalDataTable } from '../delegatePortalDataTable.js'

export class DelegatePortalEstimateDetailsPage extends DelegatePortalBasePage {
  readonly claim: DelegatePortalClaim
  readonly baseURL: string
  readonly Title: Element
  readonly Button_BackToEstimates: Element
  readonly Label_Summary_Title: Element
  readonly Label_Details_Title: Element
  readonly Label_Details_ID: Element
  readonly Label_Details_Type: Element
  readonly Label_Details_ExternalSource: Element
  readonly Label_Details_ExternalSourceId: Element
  readonly Label_Details_SubmissionDate: Element
  readonly Label_Details_SubmittedBy: Element
  readonly Label_Notes_Title: Element
  readonly Label_Notes_Notes: Element
  readonly Label_ClaimDocuments_Title: Element
  readonly Link_ClaimDocuments_ViewFullTable: Locator
  readonly DataTable_ClaimDocuments: DelegatePortalDataTable
  readonly Label_Reviews_Title: Element
  readonly parent: Locator

  constructor(global: DelegatePortalGlobal, claim: DelegatePortalClaim, parentClaimPageURL: string) {
    super(global)
    this.claim = claim
    this.parent = this.page.locator('div.chakra-container div.chakra-stack[id*="body"]')
    this.baseURL = parentClaimPageURL
    this.Title = new Element(
      global.page,
      this.parent.getByText(EstimateDetailsPageStrings.Title_Details),
      EstimateDetailsPageStrings.Title_Details
    )
    this.Button_BackToEstimates = new Element(
      global.page,
      this.parent.locator('div > button').nth(0),
      EstimateDetailsPageStrings.Button_BackToEstimates
    )
    this.Label_Summary_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(0),
      EstimateDetailsPageStrings.Title_Summary
    )
    this.Label_Details_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(1),
      EstimateDetailsPageStrings.Title_Details
    )
    this.Label_Details_ID = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText('ID', { exact: true })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.testData.claimEstimateId
    )

    this.Label_Details_Type = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText('Type')
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.testData.claimEstimateType
    )

    this.Label_Details_ExternalSource = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText('External Source', { exact: true })
        .locator('..')
        .locator('..')
        .locator('> dd')
    )

    this.Label_Details_ExternalSourceId = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText('External Source ID')
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.testData.claimEstimateExternalSourceId
    )
    this.Label_Details_SubmissionDate = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText('Submission Date')
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.testData.claimEstimateSubmissionDate
    )
    this.Label_Details_SubmittedBy = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText('Submitted By')
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.testData.claimEstimateSubmittedBy
    )

    this.Label_Notes_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(2),
      EstimateDetailsPageStrings.Title_Notes
    )
    this.Label_Notes_Notes = new Element(
      global.page,
      this.page.locator('div[id$="_content"]').nth(2).locator('> p'),
      claim.testData.claimEstimateNotes
    )

    this.Label_ClaimDocuments_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(3),
      EstimateDetailsPageStrings.Title_ClaimDocuments
    )
    this.Link_ClaimDocuments_ViewFullTable = this.page
      .locator('div.chakra-card__header')
      .nth(3)
      .locator('a')
      .nth(0)
    this.DataTable_ClaimDocuments = new DelegatePortalDataTable(
      global,
      `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"] > div`,
      1,
      ClaimDocumentsTabStrings.ActionMenu,
      ClaimDocumentsTabStrings.ActionMenuAria
    )
    this.Label_Reviews_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(4),
      EstimateDetailsPageStrings.Title_Reviews
    )
  }

  async NavigateDirectly(estimateDetailsId: string) {
    await this.page.waitForTimeout(1000)
    const targetUrl = `${this.baseURL}/estimates/${estimateDetailsId}`
    await this.page.goto(targetUrl)
    await this.page.waitForURL(targetUrl)
    await this.Label_Reviews_Title.locator.waitFor({ state: 'visible' })
  }

  async VerifyDetailsSection() {
    await this.Label_Details_Title.VerifyExpectedTextAlt()
    await this.Label_Details_ID.VerifyExpectedTextAlt()
    await this.Label_Details_Type.VerifyExpectedTextAlt()
    await this.Label_Details_ExternalSource.VerifyExpectedTextAlt()
    await this.Label_Details_ExternalSourceId.VerifyExpectedTextAlt()
    await this.Label_Details_SubmissionDate.VerifyExpectedTextAlt()
    await this.Label_Details_SubmittedBy.VerifyExpectedTextAlt()
  }

  async VerifyNotesSection() {
    await this.Label_Notes_Title.VerifyExpectedText()
    await this.Label_Notes_Notes.VerifyExpectedTextAlt()
  }

  async VerifyClaimDocumentsSection() {
    await this.Label_ClaimDocuments_Title.VerifyExpectedText()
    await expect(this.Link_ClaimDocuments_ViewFullTable).toBeAttached()
    expect(await this.DataTable_ClaimDocuments.IsVisible()).toBe(true)
  }

  async VerifySummarySection() {
    await this.Label_Summary_Title.VerifyExpectedText()
  }

  async VerifyReviewsSection() {
    await this.Label_Reviews_Title.VerifyExpectedText()
  }

  async OpenDocumentLinkInNewTabVerifyAndClose(rowIndex: string, downloading = false) {
    const expectedTitle = await this.DataTable_ClaimDocuments.FetchRowTextDataByColumnName(
      rowIndex,
      DataTable_Columns_Type.Documents_FileName
    )
    // currently always downloading so override headless exception
    downloading = false
    if (!downloading) {
      const pagePromise = this.context.waitForEvent('page')
      await this.DataTable_ClaimDocuments.ClickLinkInDataCell(
        rowIndex,
        DataTable_Columns_Type.Documents_File
      )
      const pageNew = await pagePromise
      await pageNew.waitForURL(/.*/)
      await pageNew.bringToFront()
      await pageNew.waitForTimeout(1000)
      const url = pageNew.url()
      expect(decodeURI(url)).toContain(expectedTitle)
      await pageNew.close()
    } else {
      const [download] = await Promise.all([
        this.page.waitForEvent('download'), // wait for download to start
        this.DataTable_ClaimDocuments.ClickLinkInDataCell(
          rowIndex,
          DataTable_Columns_Type.Documents_File
        ),
      ])
      const endsWithPdf = download.suggestedFilename().endsWith('.pdf')
      expect(endsWithPdf).toBe(true)
    }
  }
}
