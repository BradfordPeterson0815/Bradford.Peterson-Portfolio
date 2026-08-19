import { Locator, expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { DelegatePortalClaim } from '../delegatePortalClaim.js'
import { ClaimLossReportTabStrings } from '../delegatePortalConstants.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalBasePage } from '../pages/delegatePortalBasePage.js'

export class DelegatePortalClaimLossReportTab extends DelegatePortalBasePage {
  readonly claim: DelegatePortalClaim
  readonly URL: string
  readonly Title: Element
  readonly Label_LLM_Warning: Element
  readonly Label_ToSaveThisReportAsANote: Element
  readonly Label_NoAssignedInspectionTech_Warning: Element
  readonly Label_NoLicenseNumberForAssignedInspectionTech: Element
  readonly Label_UpdateLicenseNumber_Warning: Element
  readonly Label_RetrievingLossReport: Element
  readonly TextArea_LossReportText: Locator
  readonly Button_GenerateLossReport: Element
  readonly Button_GenerateNewLossReport: Element
  readonly Button_SaveChangesAsDraft: Element
  readonly Button_SaveDraftAsNote: Element
  readonly Button_CopyLossReportToClipboard: Element
  readonly FuzzyLossReportButtonLocator: Locator

  constructor(global: DelegatePortalGlobal, claim: DelegatePortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/loss-report`
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${ClaimLossReportTabStrings.Title_LossReport}` }),
      ClaimLossReportTabStrings.Title_LossReport
    )
    this.Label_LLM_Warning = new Element(
      global.page,
      this.page
        .locator(`div.chakra-card__body div[data-status="info"] div div[data-status="info"]`)
        .getByText(ClaimLossReportTabStrings.Label_LLM_Warning),
      ClaimLossReportTabStrings.Label_LLM_Warning
    )
    this.Label_ToSaveThisReportAsANote = new Element(
      global.page,
      this.page
        .locator(`div.chakra-card__body div[data-status="info"] div div[data-status="info"]`)
        .getByText(ClaimLossReportTabStrings.Label_SaveAsNoteWarning),
      ClaimLossReportTabStrings.Label_SaveAsNoteWarning
    )
    this.Label_NoAssignedInspectionTech_Warning = new Element(
      global.page,
      this.page
        .locator(`div.chakra-card__body div[data-status="warning"] div div[data-status="warning"]`)
        .getByText(ClaimLossReportTabStrings.Label_NoAssignedInspectionTech_Warning),
      ClaimLossReportTabStrings.Label_NoAssignedInspectionTech_Warning
    )
    this.Label_NoLicenseNumberForAssignedInspectionTech = new Element(
      global.page,
      this.page
        .locator(`div.chakra-card__body div[data-status="warning"] div div[data-status="warning"]`)
        .getByText(ClaimLossReportTabStrings.Label_NoLicenseNumberForAssignedInspectionTech),
      ClaimLossReportTabStrings.Label_NoLicenseNumberForAssignedInspectionTech
    )
    this.Label_UpdateLicenseNumber_Warning = new Element(
      global.page,
      this.page
        .locator(`div.chakra-card__body div[data-status="warning"] div div[data-status="warning"]`)
        .getByText(ClaimLossReportTabStrings.Label_UpdateLicenseNumber),
      ClaimLossReportTabStrings.Label_UpdateLicenseNumber
    )
    this.Label_RetrievingLossReport = new Element(
      global.page,
      this.page.locator(`div.chakra-card__body p`),
      ClaimLossReportTabStrings.Label_NoAssignedInspectionTech_Warning
    )

    this.TextArea_LossReportText = this.page.locator(`div.chakra-card__body textarea`)
    this.Button_GenerateLossReport = new Element(
      global.page,
      this.page.getByRole('button', { name: ClaimLossReportTabStrings.Button_GenerateLossReport }),
      ClaimLossReportTabStrings.Button_GenerateLossReport
    )
    this.Button_GenerateNewLossReport = new Element(
      global.page,
      this.page.getByRole('button', {
        name: ClaimLossReportTabStrings.Button_GenerateNewLossReport,
      }),
      ClaimLossReportTabStrings.Button_GenerateNewLossReport
    )
    this.Button_SaveChangesAsDraft = new Element(
      global.page,
      this.page.getByRole('button', {
        name: ClaimLossReportTabStrings.Button_SaveChangesAsDraft,
      }),
      ClaimLossReportTabStrings.Button_SaveChangesAsDraft
    )
    this.Button_SaveDraftAsNote = new Element(
      global.page,
      this.page.getByRole('button', {
        name: ClaimLossReportTabStrings.Button_SaveDraftAsNote,
      }),
      ClaimLossReportTabStrings.Button_SaveDraftAsNote
    )
    this.Button_CopyLossReportToClipboard = new Element(
      global.page,
      this.page.locator(`div.chakra-card__body button[aria-label='Copy to clipboard']`)
    )
    this.FuzzyLossReportButtonLocator = this.page
      .getByRole('button', {
        name: ClaimLossReportTabStrings.Button_GenerateNewLossReport,
      })
      .or(
        this.page.getByRole('button', {
          name: ClaimLossReportTabStrings.Button_GenerateLossReport,
        })
      )
  }

  async IsReportVisible() {
    return (await this.TextArea_LossReportText.count()) > 0
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async GenerateReportAndWait() {
    await this.FuzzyLossReportButtonLocator.click()
    await this.Label_RetrievingLossReport.locator.waitFor({ state: 'visible', timeout: 10000 })
    await this.Label_RetrievingLossReport.locator.waitFor({ state: 'hidden', timeout: 120000 })
    await this.TextArea_LossReportText.waitFor({ state: 'visible', timeout: 10000 })
  }

  async ReplaceReport(newReport: string, expectSave: boolean = true) {
    await this.TextArea_LossReportText.clear()
    await this.TextArea_LossReportText.fill(newReport)
    if (expectSave) {
      await expect(this.Button_SaveChangesAsDraft.locator).toBeEnabled({ timeout: 30000 })
    }
  }

  async UpdateReportKeyword(targetKeyword: string, replacement: string) {
    const currentReport = (await this.TextArea_LossReportText.textContent()) ?? ''
    const updatedReport = currentReport?.replace(targetKeyword, replacement)
    await this.ReplaceReport(updatedReport)
  }
}
