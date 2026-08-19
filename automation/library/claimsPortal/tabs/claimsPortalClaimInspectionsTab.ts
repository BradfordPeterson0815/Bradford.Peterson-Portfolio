import { Element } from '../../shared/element.js'
import { ClaimsPortalInspectionConsentAlert } from '../alerts/claimsPortalInspectionConsentAlert.js'
import { ClaimsPortalClaim } from '../claimsPortalClaim.js'
import {
  DataTable_Columns_Type,
  InspectionsTabStrings,
  Inspections_DataTable_ActionMenuItems,
} from '../claimsPortalConstants.js'
import { ClaimsPortalDataTable } from '../claimsPortalDataTable.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalEditInspectionDrawer } from '../drawers/claimsPortalEditInspectionDrawer.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalInspectionDetailsTab } from './claimsPortalInspectionDetailsTab.js'

export class ClaimsPortalClaimInspectionsTab extends ClaimsPortalBasePage {
  readonly claim: ClaimsPortalClaim
  readonly URL: string
  readonly Title: Element
  readonly Link_StartNewInspection: Element
  readonly DataTable_Inspections: ClaimsPortalDataTable
  readonly claimPageURL: string

  constructor(global: ClaimsPortalGlobal, claim: ClaimsPortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/inspections`
    this.claimPageURL = claimPageURL
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
    const inspectionDetailsTab = new ClaimsPortalInspectionDetailsTab(this.global, this.claimPageURL)
    await inspectionDetailsTab.Button_GetShareLink.locator.waitFor({ state: 'visible' })
    return inspectionDetailsTab
  }

  async HandleInspectionConsentAlert(acceptConsent = false) {
    const alert = new ClaimsPortalInspectionConsentAlert(this.global)
    if (acceptConsent) {
      await alert.Button_Continue.locator.click({ force: true })
    } else {
      await alert.Button_Leave.locator.click({ force: true })
    }
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
    await tableSettingsDialog.Close()
  }
}
