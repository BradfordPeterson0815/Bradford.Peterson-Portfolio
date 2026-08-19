import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalClaim } from '../claimsPortalClaim.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'
import {
  DataTable_Columns_Type,
  JobsTabStrings,
  Jobs_DataTable_ActionMenuItems,
} from '../claimsPortalConstants.js'
import { Element } from '../../shared/element.js'
import { ClaimsPortalCreateJobDrawer } from '../drawers/claimsPortalCreateJobDrawer.js'

export class ClaimsPortalClaimJobsTab extends ClaimsPortalBasePage {
  readonly claim: ClaimsPortalClaim
  readonly URL: string
  readonly Title: Element
  readonly Button_CreateJob: Element
  readonly DataTable_Jobs: ClaimsPortalDataTable

  constructor(global: ClaimsPortalGlobal, claim: ClaimsPortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/jobs`
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${JobsTabStrings.Title}` }),
      JobsTabStrings.Title
    )
    this.Button_CreateJob = new Element(
      global.page,
      this.page.getByRole('button', { name: `${JobsTabStrings.Button_CreateJob}` }),
      JobsTabStrings.Button_CreateJob
    )
    this.DataTable_Jobs = new ClaimsPortalDataTable(
      global,
      `#root div[id$="_content"]`,
      1,
      JobsTabStrings.ActionMenu,
      JobsTabStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_Jobs.WaitForRowsToLoad()
  }

  async SelectActionMenuItem(rowIndex: string, actionMenuItem: Jobs_DataTable_ActionMenuItems) {
    await this.DataTable_Jobs.OpenActionMenu(rowIndex)
    await this.DataTable_Jobs.SelectActionMenuItem(actionMenuItem)
  }

  async IsActionMenuItemVisible(rowIndex: string, actionMenuItem: Jobs_DataTable_ActionMenuItems) {
    await this.DataTable_Jobs.OpenActionMenu(rowIndex)
    await this.page.waitForTimeout(1000)
    const visibility = await this.DataTable_Jobs.IsActionMenuItemVisible(actionMenuItem)
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async OpenCreateJobDrawer() {
    await this.Button_CreateJob.Click()
    return new ClaimsPortalCreateJobDrawer(this.global)
  }

  async VerifyTableSettingColumns() {
    const tableSettingsDialog = await this.DataTable_Jobs.OpenTableSettings()
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_Users)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_JobId)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_Type)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_Services)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_Description)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_Status)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_Location)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Jobs_Tags)
    await tableSettingsDialog.Close()
  }
}
