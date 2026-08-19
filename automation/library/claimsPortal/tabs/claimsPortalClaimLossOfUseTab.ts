import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalClaim } from '../claimsPortalClaim.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'
import { Element } from '../../shared/element.js'
import { DataTable_Columns_Type, LossOfUseTabStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalAddLossOfUseDrawer } from '../drawers/claimsPortalAddLossOfUseDrawer.js'

export class ClaimsPortalClaimLossOfUseTab extends ClaimsPortalBasePage {
  readonly claim: ClaimsPortalClaim
  readonly URL: string
  readonly Title: Element
  readonly Button_AddLossOfUse: Element
  readonly DataTable_LossOfUse: ClaimsPortalDataTable

  constructor(global: ClaimsPortalGlobal, claim: ClaimsPortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/loss-of-use`
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', {
        name: `${LossOfUseTabStrings.Title_LossOfUse}`,
        exact: true,
      }),
      LossOfUseTabStrings.Title_LossOfUse
    )
    this.Button_AddLossOfUse = new Element(
      global.page,
      this.page.getByRole('button', {
        name: `${LossOfUseTabStrings.Button_AddLossOfUse}`,
        exact: true,
      }),
      LossOfUseTabStrings.Button_AddLossOfUse
    )
    this.DataTable_LossOfUse = new ClaimsPortalDataTable(
      global,
      `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]`,
      1,
      LossOfUseTabStrings.ActionMenu,
      LossOfUseTabStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_LossOfUse.WaitForRowsToLoad()
    await this.Button_AddLossOfUse.locator.waitFor({ state: 'visible' })
  }

  async OpenAddLossOfUseDrawer(isEditMode = false) {
    await this.Button_AddLossOfUse.Click()
    return new ClaimsPortalAddLossOfUseDrawer(this.global, isEditMode)
  }

  async VerifyTableSettingColumns() {
    const tableSettingsDialog = await this.DataTable_LossOfUse.OpenTableSettings()
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.LossOfUse_Type)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.LossOfUse_Status)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.LossOfUse_AmountRequested)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.LossOfUse_Duration)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.LossOfUse_RequestedDate)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.LossOfUse_LastModified)
    await tableSettingsDialog.Close()
  }
}
