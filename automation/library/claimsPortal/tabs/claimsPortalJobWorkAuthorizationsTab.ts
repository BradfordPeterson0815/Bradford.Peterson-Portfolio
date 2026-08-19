import { Element } from '../../shared/element.js'
import {
  DataTable_ColumnName_Index,
  DataTable_Columns_Type,
  Filter_Radio_WorkAuthStatus,
  WorkAuthorizationsTabStrings,
  WorkAuthorizations_DataTable_ActionMenuItems,
} from '../claimsPortalConstants.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { LookupDataColumn } from '../claimsPortalHelper.js'
import { ClaimsPortalJob } from '../claimsPortalJob.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalWorkAuthorizationCreateTab } from './claimsPortalWorkAuthorizationCreateTab.js'

export class ClaimsPortalJobWorkAuthorizationsTab extends ClaimsPortalBasePage {
  readonly job: ClaimsPortalJob
  readonly URL: string
  readonly Title: Element
  readonly Link_SendWorkAuthorization: Element
  readonly DataTable_WorkAuthorizations: ClaimsPortalDataTable

  constructor(global: ClaimsPortalGlobal, job: ClaimsPortalJob, jobPageURL: string) {
    super(global)
    this.job = job
    this.URL = `${jobPageURL}/work-auth`
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${WorkAuthorizationsTabStrings.Title}` }),
      WorkAuthorizationsTabStrings.Title
    )
    this.Link_SendWorkAuthorization = new Element(
      global.page,
      this.page.getByRole('link', {
        name: `${WorkAuthorizationsTabStrings.Link_SendWorkAuthorization}`,
      }),
      WorkAuthorizationsTabStrings.Link_SendWorkAuthorization
    )
    this.DataTable_WorkAuthorizations = new ClaimsPortalDataTable(
      global,
      `#root div[id$="_content"]`,
      1,
      WorkAuthorizationsTabStrings.ActionMenu,
      WorkAuthorizationsTabStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_WorkAuthorizations.WaitForRowsToLoad()
  }

  async SetTableFilter_Selection_Status(
    selection: string,
    column: DataTable_Columns_Type,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await this.DataTable_WorkAuthorizations.AddTableFilter(
      column,
      isEditMode
    )
    await tableFilterDialog.SetSelectionFilter(selection, column)
    if (!skipClose) {
      await tableFilterDialog.Close()
    }
    const pinnedFilter = `${LookupDataColumn(
      column,
      DataTable_ColumnName_Index.Column
    )} equals "${selection}"`
    return { pinnedFilter, tableFilterDialog }
  }

  async SetTableFilter_Radio_WorkAuthStatus(
    status: Filter_Radio_WorkAuthStatus,
    isEditMode = false,
    skipClose = false
  ) {
    const tableFilterDialog = await this.DataTable_WorkAuthorizations.AddTableFilter(
      DataTable_Columns_Type.WorkAuthorizations_Status,
      isEditMode
    )
    await tableFilterDialog.SetRadioFilter(status)
    let filterStatus = status.toLowerCase()
    filterStatus = filterStatus.replace(' ', '')
    const pinnedFilter = `${LookupDataColumn(
      DataTable_Columns_Type.WorkAuthorizations_Status,
      DataTable_ColumnName_Index.Column
    )} includes "${filterStatus}"`
    if (!skipClose) {
      await tableFilterDialog.Close()
    }
    return { pinnedFilter, tableFilterDialog }
  }

  async SelectActionMenuItem(
    rowIndex: string,
    actionMenuItem: WorkAuthorizations_DataTable_ActionMenuItems
  ) {
    await this.DataTable_WorkAuthorizations.OpenActionMenu(rowIndex)
    await this.DataTable_WorkAuthorizations.SelectActionMenuItem(actionMenuItem)
  }

  async IsActionMenuItemVisible(
    rowIndex: string,
    actionMenuItem: WorkAuthorizations_DataTable_ActionMenuItems
  ) {
    await this.DataTable_WorkAuthorizations.OpenActionMenu(rowIndex)
    await this.page.waitForTimeout(1000)
    const visibility =
      await this.DataTable_WorkAuthorizations.IsActionMenuItemVisible(actionMenuItem)
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async OpenWorkAuthWizard() {
    await this.Link_SendWorkAuthorization.Click()
    const workAuthCreateTab = new ClaimsPortalWorkAuthorizationCreateTab(this.global, this.job, this.URL)
    return workAuthCreateTab
  }

  async VerifyTableSettingColumns() {
    const tableSettingsDialog = await this.DataTable_WorkAuthorizations.OpenTableSettings()
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.WorkAuthorizations_Document)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.WorkAuthorizations_Status)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.WorkAuthorizations_Created)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.WorkAuthorizations_Expires)
    await tableSettingsDialog.VerifyColumnExists(
      DataTable_Columns_Type.WorkAuthorizations_Recipients
    )
    await tableSettingsDialog.Close()
  }
}
