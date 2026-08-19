import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { expect, Locator } from 'playwright/test'
import { ClaimsPortalClaim } from '../claimsPortalClaim.js'
import {
  DataTable_Columns_Type,
  DocumentsTabStrings,
  EstimateDetailsPageStrings,
} from '../claimsPortalConstants.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'

export class ClaimsPortalEstimateDetailsPage extends ClaimsPortalBasePage {
  readonly claim: ClaimsPortalClaim
  readonly baseURL: string
  readonly Title: Element
  readonly Button_BackToEstimates: Element
  readonly Label_Summary_Title: Element
  readonly Label_Details_Title: Element
  readonly Label_Details_ID: Element
  readonly Label_Details_ID_Actual: Element
  readonly Label_Details_Type: Element
  readonly Label_Details_Type_Actual: Element
  readonly Label_Details_ExternalSource: Element
  readonly Label_Details_ExternalSource_Actual: Element
  readonly Label_Details_ExternalSourceID: Element
  readonly Label_Details_ExternalSourceID_Actual: Element
  readonly Label_Details_SubmissionDate: Element
  readonly Label_Details_SubmissionDate_Actual: Element
  readonly Label_Details_SubmittedBy: Element
  readonly Label_Details_SubmittedBy_Actual: Element
  readonly Label_Notes_Title: Element
  readonly Label_Notes_Notes: Element
  readonly Label_ClaimDocuments_Title: Element
  readonly Link_ClaimDocuments_ViewFullTable: Locator
  readonly DataTable_ClaimDocuments: ClaimsPortalDataTable
  readonly Label_Reviews_Title: Element
  readonly parent: Locator

  constructor(global: ClaimsPortalGlobal, claim: ClaimsPortalClaim, parentClaimPageURL: string) {
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
        .getByText(EstimateDetailsPageStrings.Label_Details_ID, { exact: true }),
      EstimateDetailsPageStrings.Label_Details_ID
    )
    this.Label_Details_ID_Actual = new Element(
      global.page,
      this.Label_Details_ID.locator.locator('..').locator('..').locator('> dd'),
      claim.testData.claimEstimateId
    )

    this.Label_Details_Type = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText(EstimateDetailsPageStrings.Label_Details_Type, { exact: true }),
      EstimateDetailsPageStrings.Label_Details_Type
    )
    this.Label_Details_Type_Actual = new Element(
      global.page,
      this.Label_Details_Type.locator.locator('..').locator('..').locator('> dd'),
      claim.testData.claimEstimateType
    )

    this.Label_Details_ExternalSource = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText(EstimateDetailsPageStrings.Label_Details_ExternalSource, { exact: true }),
      EstimateDetailsPageStrings.Label_Details_ExternalSource
    )
    this.Label_Details_ExternalSource_Actual = new Element(
      global.page,
      this.Label_Details_ExternalSource.locator.locator('..').locator('..').locator('> dd'),
      claim.testData.claimEstimateExternalSource
    )

    this.Label_Details_ExternalSourceID = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText(EstimateDetailsPageStrings.Label_Details_ExternalSourceID, { exact: true }),
      EstimateDetailsPageStrings.Label_Details_ExternalSourceID
    )
    this.Label_Details_ExternalSourceID_Actual = new Element(
      global.page,
      this.Label_Details_ExternalSourceID.locator.locator('..').locator('..').locator('> dd'),
      claim.testData.claimEstimateExternalSourceId
    )

    this.Label_Details_SubmissionDate = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText(EstimateDetailsPageStrings.Label_Details_SubmissionDate, { exact: true }),
      EstimateDetailsPageStrings.Label_Details_SubmissionDate
    )
    this.Label_Details_SubmissionDate_Actual = new Element(
      global.page,
      this.Label_Details_SubmissionDate.locator.locator('..').locator('..').locator('> dd'),
      claim.testData.claimEstimateSubmissionDate
    )

    this.Label_Details_SubmittedBy = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText(EstimateDetailsPageStrings.Label_Details_SubmittedBy, { exact: true }),
      EstimateDetailsPageStrings.Label_Details_SubmittedBy
    )
    this.Label_Details_SubmittedBy_Actual = new Element(
      global.page,
      this.Label_Details_SubmittedBy.locator.locator('..').locator('..').locator('> dd'),
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
    this.DataTable_ClaimDocuments = new ClaimsPortalDataTable(
      global,
      `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]`,
      1,
      DocumentsTabStrings.ActionMenu,
      DocumentsTabStrings.ActionMenuAria
    )

    this.Label_Reviews_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(4),
      EstimateDetailsPageStrings.Title_Reviews
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_ClaimDocuments.WaitForRowsToLoad()
  }

  async NavigateDirectly(estimateDetailsId: string) {
    await this.page.waitForTimeout(1000)
    const targetUrl = `${this.baseURL}/estimates/${estimateDetailsId}`
    await this.page.goto(targetUrl)
    await this.page.waitForURL(targetUrl)
    await this.Label_Reviews_Title.locator.waitFor({ state: 'visible' })
    await this.CustomLoad()
  }

  async VerifyDetailsSection(smoke = false) {
    await this.Label_Details_Title.VerifyExpectedTextAlt()
    await this.Label_Details_ID.VerifyExpectedTextAlt()
    await this.Label_Details_Type.VerifyExpectedTextAlt()
    await this.Label_Details_ExternalSource.VerifyExpectedTextAlt()
    await this.Label_Details_ExternalSourceID.VerifyExpectedTextAlt()
    await this.Label_Details_SubmissionDate.VerifyExpectedTextAlt()
    await this.Label_Details_SubmittedBy.VerifyExpectedTextAlt()

    if (!smoke) {
      await this.Label_Details_ID_Actual.VerifyExpectedTextAlt()
      await this.Label_Details_Type_Actual.VerifyExpectedTextAlt()
      await this.Label_Details_ExternalSource_Actual.VerifyExpectedTextAlt()
      await this.Label_Details_ExternalSourceID_Actual.VerifyExpectedTextAlt()
      await this.Label_Details_SubmissionDate_Actual.VerifyExpectedTextAlt()
      await this.Label_Details_SubmittedBy_Actual.VerifyExpectedTextAlt()
    }
  }

  async VerifyNotesSection(smoke = false) {
    await this.Label_Notes_Title.VerifyExpectedText()
    if (!smoke) {
      await this.Label_Notes_Notes.VerifyExpectedTextAlt()
    }
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
