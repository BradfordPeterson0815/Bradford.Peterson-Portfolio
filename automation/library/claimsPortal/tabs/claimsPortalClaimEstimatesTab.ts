import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalClaim } from '../claimsPortalClaim.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'
import { Element } from '../../shared/element.js'
import { DataTable_Columns_Type, EstimatesTabStrings } from '../claimsPortalConstants.js'

export class ClaimsPortalClaimEstimatesTab extends ClaimsPortalBasePage {
  readonly claim: ClaimsPortalClaim
  readonly URL: string
  readonly Title: Element
  readonly DataTable_Estimates: ClaimsPortalDataTable

  constructor(global: ClaimsPortalGlobal, claim: ClaimsPortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/estimates`
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', {
        name: `${EstimatesTabStrings.Title_Estimates}`,
        exact: true,
      }),
      EstimatesTabStrings.Title_Estimates
    )
    this.DataTable_Estimates = new ClaimsPortalDataTable(
      global,
      `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]`,
      1,
      EstimatesTabStrings.ActionMenu,
      EstimatesTabStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_Estimates.WaitForRowsToLoad()
  }

  async VerifyTableSettingColumns() {
    const tableSettingsDialog = await this.DataTable_Estimates.OpenTableSettings()
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Estimates_SubmissionDate)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Estimates_SubmittedBy)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Estimates_EstimateAmount)
    await tableSettingsDialog.Close()
  }
}
