import { Element } from '../../shared/element.js'
import { DelegatePortalClaim } from '../delegatePortalClaim.js'
import {
  ClaimInspectionsTabStrings,
  Inspections_DataTable_ActionMenuItems,
} from '../delegatePortalConstants.js'
import { DelegatePortalDataTable } from '../delegatePortalDataTable.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalBasePage } from '../pages/delegatePortalBasePage.js'
import { DelegatePortalInspectionConsentAlert } from '../alerts/delegatePortalInspectionConsentAlert.js'
import { DelegatePortalEditInspectionDrawer } from '../drawers/delegatePortalEditInspectionDrawer.js'
import { DelegatePortalInspectionDetailsTab } from './delegatePortalInspectionDetailsTab.js'

export class DelegatePortalClaimInspectionsTab extends DelegatePortalBasePage {
  readonly claim: DelegatePortalClaim
  readonly URL: string
  readonly Title: Element
  readonly Link_UploadVideoAsInspection: Element
  readonly Link_StartNewInspection: Element
  readonly DataTable_Inspections: DelegatePortalDataTable
  readonly claimPageURL: string

  constructor(global: DelegatePortalGlobal, claim: DelegatePortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/inspections`
    this.claimPageURL = claimPageURL
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${ClaimInspectionsTabStrings.Title}` }),
      ClaimInspectionsTabStrings.Title
    )
    this.Link_UploadVideoAsInspection = new Element(
      global.page,
      this.page.getByRole('link', {
        name: `${ClaimInspectionsTabStrings.Link_UploadVideoAsInspection}`,
      }),
      ClaimInspectionsTabStrings.Link_UploadVideoAsInspection
    )
    this.Link_StartNewInspection = new Element(
      global.page,
      this.page.getByRole('link', {
        name: `${ClaimInspectionsTabStrings.Link_StartNewInspection}`,
      }),
      ClaimInspectionsTabStrings.Link_StartNewInspection
    )
    this.DataTable_Inspections = new DelegatePortalDataTable(
      global,
      `#root div[id$="_content"]`,
      1,
      ClaimInspectionsTabStrings.ActionMenu,
      ClaimInspectionsTabStrings.ActionMenuAria
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
    const editInspectionDrawer = new DelegatePortalEditInspectionDrawer(this.global)
    return editInspectionDrawer
  }

  async EditInspection(rowIndex: string, newDescription: string) {
    await this.SelectActionMenuItem(rowIndex, Inspections_DataTable_ActionMenuItems.EditInspection)
    const editInspectionDrawer = new DelegatePortalEditInspectionDrawer(this.global)
    await editInspectionDrawer.TextBox_Description.Fill(newDescription)
    await editInspectionDrawer.Button_Submit.Click()
  }

  async OpenInspection(rowIndex: string) {
    await this.SelectActionMenuItem(rowIndex, Inspections_DataTable_ActionMenuItems.OpenInspection)
    const inspectionDetailsTab = new DelegatePortalInspectionDetailsTab(this.global, this.claimPageURL)
    await inspectionDetailsTab.Button_GetShareLink.locator.waitFor({ state: 'visible' })
    return inspectionDetailsTab
  }

  async HandleInspectionConsentAlert(acceptConsent = false) {
    const alert = new DelegatePortalInspectionConsentAlert(this.global)
    if (acceptConsent) {
      await alert.Button_Continue.locator.click({ force: true })
    } else {
      await alert.Button_Leave.locator.click({ force: true })
    }
  }
}
