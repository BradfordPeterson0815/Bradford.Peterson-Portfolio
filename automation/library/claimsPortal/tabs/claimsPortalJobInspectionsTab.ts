import { Element } from '../../shared/element.js'
import {
  DataTable_Columns_Type,
  InspectionsTabStrings,
  Inspections_DataTable_ActionMenuItems,
} from '../claimsPortalConstants.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalJob } from '../claimsPortalJob.js'
import { ClaimsPortalEditInspectionDrawer } from '../drawers/claimsPortalEditInspectionDrawer.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalInspectionDetailsTab } from './claimsPortalInspectionDetailsTab.js'

export class ClaimsPortalJobInspectionsTab extends ClaimsPortalBasePage {
  readonly job: ClaimsPortalJob
  readonly URL: string
  readonly Title: Element
  readonly Link_StartNewInspection: Element
  readonly DataTable_Inspections: ClaimsPortalDataTable
  readonly jobPageURL: string

  constructor(global: ClaimsPortalGlobal, job: ClaimsPortalJob, jobPageURL: string) {
    super(global)
    this.job = job
    this.URL = `${jobPageURL}/inspections`
    this.jobPageURL = jobPageURL
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${InspectionsTabStrings.Title}` }),
      InspectionsTabStrings.Title
    )
    this.Link_StartNewInspection = new Element(
      global.page,
      this.page.getByRole('link', { name: `${InspectionsTabStrings.Link_StartNewInspection}` }),
      InspectionsTabStrings.Link_StartNewInspection
    )
    this.DataTable_Inspections = new ClaimsPortalDataTable(
      global,
      `#root div[id$="_content"]`,
      1,
      InspectionsTabStrings.ActionMenu,
      InspectionsTabStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_Inspections.WaitForRowsToLoad()
  }

  async SelectActionMenuItem(
    rowIndex: string,
    actionMenuItem: Inspections_DataTable_ActionMenuItems
  ) {
    await this.DataTable_Inspections.OpenActionMenu(rowIndex)
    await this.DataTable_Inspections.SelectActionMenuItem(actionMenuItem)
  }

  async IsActionMenuItemVisible(
    rowIndex: string,
    actionMenuItem: Inspections_DataTable_ActionMenuItems
  ) {
    await this.DataTable_Inspections.OpenActionMenu(rowIndex)
    await this.page.waitForTimeout(1000)
    const visibility = await this.DataTable_Inspections.IsActionMenuItemVisible(actionMenuItem)
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async OpenEditInspectionDrawer(rowIndex: string) {
    await this.SelectActionMenuItem(rowIndex, Inspections_DataTable_ActionMenuItems.EditInspection)
    const editInspectionDrawer = new ClaimsPortalEditInspectionDrawer(this.global)
    return editInspectionDrawer
  }

  async EditInspection(rowIndex: string, newDescription: string) {
    await this.SelectActionMenuItem(rowIndex, Inspections_DataTable_ActionMenuItems.EditInspection)
    const editInspectionDrawer = new ClaimsPortalEditInspectionDrawer(this.global)
    await editInspectionDrawer.TextBox_Description.Fill(newDescription)
    await editInspectionDrawer.Button_Submit.Click()
  }

  async OpenInspection(rowIndex: string) {
    await this.SelectActionMenuItem(rowIndex, Inspections_DataTable_ActionMenuItems.OpenInspection)
    const inspectionDetailsTab = new ClaimsPortalInspectionDetailsTab(this.global, this.jobPageURL)
    await inspectionDetailsTab.Button_GetShareLink.locator.waitFor({ state: 'visible' })
    return inspectionDetailsTab
  }

  async StartNewInspection(__acceptConsent = false) {
    await this.Link_StartNewInspection.Click()
    // handle consent dialog
  }

  async VerifyTableSettingColumns() {
    const tableSettingsDialog = await this.DataTable_Inspections.OpenTableSettings()
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Inspections_Description)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Inspections_Started)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.inspections_Duration)
    await tableSettingsDialog.VerifyColumnExists(DataTable_Columns_Type.Inspections_Organizer)
    await tableSettingsDialog.VerifyColumnExists(
      DataTable_Columns_Type.Inspections_NumberOfParticipants
    )
  }
}
