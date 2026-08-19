import { expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { ClientPortalDeleteAlert } from '../alerts/clientPortalDeleteAlert.js'
import {
  AlertStrings,
  AttachedVendors_DataTable_ActionMenuItems,
  DataTable_Columns_Type,
  ServiceAreaPageStrings,
  ServiceAreas_DataTable_ActionMenuItems,
  VendorPageStrings,
  VendorRuleType,
} from '../clientPortalConstants.js'
import { ClientPortalDataTable } from '../clientPortalDataTable.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { ServiceArea } from '../clientPortalServiceArea.js'
import { Vendor } from '../clientPortalVendor.js'
import { ClientPortalAddVendorToServiceAreaDrawer } from '../drawers/clientPortalAddVendorToServiceAreaDrawer.js'
import { ClientPortalCreateServiceAreaDrawer } from '../drawers/clientPortalCreateServiceAreaDrawer.js'
import { ClientPortalCreateVendorDrawer } from '../drawers/clientPortalCreateVendorDrawer.js'
import { ClientPortalCreateVendorRuleDrawer } from '../drawers/clientPortalCreateVendorRuleDrawer.js'
import { ClientPortalSelectRulesFromVendorDrawer } from '../drawers/clientPortalSelectRulesFromVendorDrawer.js'
import { ClientPortalUpdateRulesFromVendorDrawer } from '../drawers/clientPortalUpdateRulesFromVendorDrawer.js'
import { ClientPortalUpdateServiceAreaVendorDrawer } from '../drawers/clientPortalUpdateServiceAreaVendorDrawer.js'
import { VendorRuleGroup } from '../rules/clientPortalVendorRuleGroup.js'
import { ClientPortalBasePage } from './clientPortalBasePage.js'
import { ClientPortalServiceAreaAndVendorPage } from './clientPortalServiceAreaAndVendorPage.js'
import { ClientPortalVendorPage } from './clientPortalVendorPage.js'

export class ClientPortalServiceAreaPage extends ClientPortalBasePage {
  readonly Title: Element
  readonly baseURL: string
  readonly Link_ServiceAreas: Element
  readonly Button_Actions: Element
  readonly Label_GettingStartedHeader: Element
  readonly Label_GettingStartedDescriptionA: Element
  readonly Label_GettingStartedDescriptionB: Element
  readonly Button_GettingStarted_AttachVendorToServiceArea: Element
  readonly Button_ToggleMap: Element
  readonly Button_AttachVendor: Element
  readonly DataTable_AttachedVendors: ClientPortalDataTable
  serviceArea: ServiceArea

  constructor(global: ClientPortalGlobal, serviceArea: ServiceArea) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${serviceArea.name}` }),
      serviceArea.name
    )
    this.baseURL = `${global.baseUrl}service-areas/${serviceArea.id}`

    this.Link_ServiceAreas = new Element(
      global.page,
      this.page.locator('#button_returntoserviceareas'),
      VendorPageStrings.Link_Vendors
    )
    this.Button_Actions = new Element(
      global.page,
      this.page.getByRole('button', { name: `${ServiceAreaPageStrings.Buton_Actions}` }),
      ServiceAreaPageStrings.Buton_Actions
    )
    this.DataTable_AttachedVendors = new ClientPortalDataTable(
      global,
      '#card_servicearea_attachedvendors_content',
      1,
      ServiceAreaPageStrings.ActionMenu,
      ServiceAreaPageStrings.ActionMenuAria
    )
    this.Label_GettingStartedHeader = new Element(
      global.page,
      this.page.locator('#card_servicearea_attachedvendors_content h3'),
      ServiceAreaPageStrings.Label_GettingStartedHeader
    )
    this.Label_GettingStartedDescriptionA = new Element(
      global.page,
      this.page.locator('#card_servicearea_attachedvendors_content p').nth(0),
      ServiceAreaPageStrings.Label_GettingStartedDescriptionA
    )
    this.Label_GettingStartedDescriptionB = new Element(
      global.page,
      this.page.locator('#card_servicearea_attachedvendors_content p').nth(1),
      VendorPageStrings.Label_GettingStartedDescriptionB
    )
    this.Button_GettingStarted_AttachVendorToServiceArea = new Element(
      global.page,
      this.page.locator('#button_serviceareavendors_attachvendor_gettingstarted'),
      ServiceAreaPageStrings.Button_GettingStartedAttachVendorToServiceArea
    )
    this.Button_ToggleMap = new Element(
      global.page,
      this.page.locator('#card_serviceareadetailinfo_mapofservicearea_toggle'),
      ServiceAreaPageStrings.Button_ViewMap
    )
    this.Button_AttachVendor = new Element(
      global.page,
      this.page.locator('#button_serviceareavendors_attachvendor'),
      ServiceAreaPageStrings.Button_AttachVendor
    )

    this.serviceArea = serviceArea
  }

  async NavigateDirectly() {
    await this.page.goto(this.baseURL)
    await this.page.waitForTimeout(3000)
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async IsServiceAreaMapDisplayed() {
    const mapLocator = await this.page.locator('#mapdata').count()
    return mapLocator > 0
  }

  async IsAttachedVendorsEmpty() {
    return (await this.Button_GettingStarted_AttachVendorToServiceArea.locator.count()) > 0
  }

  async SelectAttachedVendorsActionMenuItem(
    rowIndex: string,
    actionMenuItem: AttachedVendors_DataTable_ActionMenuItems
  ) {
    await this.DataTable_AttachedVendors.OpenActionMenu(rowIndex)
    await this.DataTable_AttachedVendors.SelectActionMenuItem(actionMenuItem)
  }

  async IsAttachedVendorsActionMenuItemVisible(
    rowIndex: string,
    actionMenuItem: AttachedVendors_DataTable_ActionMenuItems
  ) {
    await this.DataTable_AttachedVendors.OpenActionMenu(rowIndex)
    await this.page.waitForTimeout(1000)
    const visibility = await this.DataTable_AttachedVendors.IsActionMenuItemVisible(actionMenuItem)
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async Action_CopyServiceAreaID() {
    await this.Button_Actions.Click()
    await this.page
      .getByRole('menuitem', {
        name: `${ServiceAreas_DataTable_ActionMenuItems.CopyServiceAreaID}`,
      })
      .click()
    const copiedID = await this.GetClipboardText()
    return copiedID
  }

  async Action_UpdateServiceArea(updateServiceArea: ServiceArea) {
    await this.Button_Actions.Click()
    await this.page
      .getByRole('menuitem', {
        name: `${ServiceAreas_DataTable_ActionMenuItems.UpdateServiceArea}`,
      })
      .click()
    const createServiceAreaDrawer = new ClientPortalCreateServiceAreaDrawer(this.global, true)
    await createServiceAreaDrawer.FillDrawer(updateServiceArea)
  }

  async Action_AddExistingVendorToServiceArea(
    vendor: Vendor,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    await this.Button_Actions.Click()
    await this.page
      .getByRole('menuitem', {
        name: `${ServiceAreas_DataTable_ActionMenuItems.AddVendorToServiceArea}`,
      })
      .click()
    await this.HandleAddExistingVendorToServiceArea(vendor, startDate, endDate, overrides)
    await this.page.waitForTimeout(2000)
  }

  async Action_AddNewVendorToServiceArea(
    vendorToCreate: Vendor,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    await this.Button_Actions.Click()
    await this.page
      .getByRole('menuitem', {
        name: `${ServiceAreas_DataTable_ActionMenuItems.AddVendorToServiceArea}`,
      })
      .click()
    await this.HandleAddNewVendorToServiceArea(vendorToCreate, startDate, endDate, overrides)
  }

  async Action_RemoveServiceArea(serviceAreaName: string = this.serviceArea.name) {
    // temporary work around for issue with refresh
    await this.page.reload()
    await this.Button_Actions.Click()
    await this.page
      .getByRole('menuitem', {
        name: `${ServiceAreas_DataTable_ActionMenuItems.RemoveServiceArea}`,
      })
      .click()
    await this.HandleRemoveServiceAreaAlert(serviceAreaName)
    await this.page.waitForTimeout(2000)
  }

  async HandleRemoveServiceAreaAlert(serviceAreaName: string, cancelRemove = false) {
    const alert = new ClientPortalDeleteAlert(
      this.global,
      AlertStrings.RemoveServiceArea_Title,
      AlertStrings.RemoveServiceArea_Description
    )
    // confirm name
    await alert.parent.locator(`input[name="confirmation"]`).fill(serviceAreaName)

    if (cancelRemove) {
      await alert.Button_Close.locator.click({ force: true })
    } else {
      await alert.Button_Remove.locator.click({ force: true })
    }
  }

  async AttachedVendors_AddNewVendorToServiceArea(
    vendorToCreate: Vendor,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    await this.Button_AttachVendor.Click()
    await this.HandleAddNewVendorToServiceArea(vendorToCreate, startDate, endDate, overrides)
  }

  async AttachedVendors_AddExistingVendorToServiceArea(
    vendor: Vendor,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    await this.Button_AttachVendor.Click()
    await this.HandleAddExistingVendorToServiceArea(vendor, startDate, endDate, overrides)
  }

  async AttachedVendors_GettingStarted_AttachExistingVendorToServiceArea(
    vendor: Vendor,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    await this.Button_GettingStarted_AttachVendorToServiceArea.Click()
    await this.HandleAddExistingVendorToServiceArea(vendor, startDate, endDate, overrides)
  }

  async AttachedVendors_GettingStarted_AttachNewVendorToServiceArea(
    vendorToCreate: Vendor,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    await this.Button_GettingStarted_AttachVendorToServiceArea.Click()
    await this.HandleAddNewVendorToServiceArea(vendorToCreate, startDate, endDate, overrides)
  }

  async ValidateServiceAreaDetails() {
    const detailsTitle = await this.page
      .locator('#card_servicearea_details_label_details')
      .textContent()
    expect(detailsTitle).toBe(ServiceAreaPageStrings.Details_Title)

    const stateName = await this.page
      .locator('#serviceareaattributes_state')
      .getAttribute('data-value')
    expect(stateName).toBe(this.serviceArea.state)

    const actualEnabled = await this.page.locator('#serviceareaattributes_enabled').textContent()
    expect(actualEnabled).toBe(this.serviceArea.enabled ? 'Enabled' : 'Disabled')

    if (this.serviceArea.countiesList.length > 0) {
      const countiesParentLocator = this.page.locator('#serviceareaattributes_counties > div')
      const countyCount = await countiesParentLocator.getAttribute('data-locations-count')
      const actualCountyCount = countyCount ? parseInt(countyCount) : 0
      expect(this.serviceArea.countiesList.length).toBe(actualCountyCount)
      for (let index = 0; index < this.serviceArea.countiesList.length; index++) {
        const expectedValue = this.serviceArea.countiesList[index]
        let foundMatch = false
        for (let actualIndex = 0; actualIndex < actualCountyCount; actualIndex++) {
          const countyLocator = this.page.locator(
            `#serviceareadetail_counties_Location_${actualIndex}`
          )
          // const stateValue = await countyLocator.getAttribute('data-state')
          // const countyValue = await countyLocator.getAttribute('data-county')
          const fullValue = await countyLocator.locator('span').textContent()
          if (fullValue == expectedValue) {
            foundMatch = true
            break
          }
        }
        expect(foundMatch).toBe(true)
      }
    }
  }

  async CreateCustomRule(rowIndex: string, ruleGroup: VendorRuleGroup) {
    await this.SelectAttachedVendorsActionMenuItem(
      rowIndex,
      AttachedVendors_DataTable_ActionMenuItems.CreateCustomRule
    )
    const createVendorRuleDrawer = new ClientPortalCreateVendorRuleDrawer(
      this.global,
      VendorRuleType.Unspecified
    )
    await createVendorRuleDrawer.FillDrawer(ruleGroup)
  }

  async HandleAddExistingVendorToServiceArea(
    vendor: Vendor,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    const addVendorToServiceAreaDrawer = new ClientPortalAddVendorToServiceAreaDrawer(
      this.global,
      this.serviceArea
    )
    await addVendorToServiceAreaDrawer.SelectVendor(vendor)
    // Fill in any/all fields as needed
    if (startDate != null) {
      await addVendorToServiceAreaDrawer.SetStartDate(startDate)
    }
    if (endDate != null) {
      await addVendorToServiceAreaDrawer.SetEndDate(endDate)
    }
    if (overrides != null) {
      await addVendorToServiceAreaDrawer.FillOverrides(overrides)
    }
    await addVendorToServiceAreaDrawer.Button_Submit.Click()
    const selectRulesFromVendorDrawer = new ClientPortalSelectRulesFromVendorDrawer(this.global, vendor)
    await selectRulesFromVendorDrawer.Title.locator.waitFor({ state: 'visible' })
    if (vendor.ruleTest == null) {
      // Don't try to apply any rules - just close the drawer
      await selectRulesFromVendorDrawer.Button_Close.Click()
    } else {
      // apply the rule(s)
      // Find a match - true if one was found
      await this.page.waitForTimeout(1000)
      const result = await selectRulesFromVendorDrawer.FindAndSelectGroupRule(vendor.ruleTest)
      expect(result).toBe(true)
      await selectRulesFromVendorDrawer.Button_Submit.Click()
    }
  }

  async HandleAddNewVendorToServiceArea(
    vendorToCreate: Vendor,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    const addVendorToServiceAreaDrawer = new ClientPortalAddVendorToServiceAreaDrawer(
      this.global,
      this.serviceArea
    )
    await addVendorToServiceAreaDrawer.Button_CreateVendor.Click()
    const createVendorDrawer = new ClientPortalCreateVendorDrawer(this.global, false)
    await createVendorDrawer.FillDrawer(vendorToCreate)
    await addVendorToServiceAreaDrawer.SelectVendor(vendorToCreate)

    // Fill in any/all fields as needed
    if (startDate != null) {
      await addVendorToServiceAreaDrawer.SetStartDate(startDate)
    }
    if (endDate != null) {
      await addVendorToServiceAreaDrawer.SetEndDate(endDate)
    }
    if (overrides != null) {
      await addVendorToServiceAreaDrawer.FillOverrides(overrides)
    }
    await addVendorToServiceAreaDrawer.Button_Submit.Click()
    const selectRulesFromVendorDrawer = new ClientPortalSelectRulesFromVendorDrawer(
      this.global,
      vendorToCreate
    )
    await selectRulesFromVendorDrawer.Title.locator.waitFor({ state: 'visible' })
    if (vendorToCreate.ruleTest == null) {
      // Don't try to apply any rules - just close the drawer
      await selectRulesFromVendorDrawer.Button_Close.Click()
    } else {
      // apply the rule(s)
      // Find a match - true if one was found
      await this.page.waitForTimeout(1000)
      const result = await selectRulesFromVendorDrawer.FindAndSelectGroupRule(
        vendorToCreate.ruleTest
      )
      expect(result).toBe(true)
      await selectRulesFromVendorDrawer.Button_Submit.Click()
    }
  }

  async ClickLinkToVendor(attachedVendor: Vendor) {
    const index = await this.DataTable_AttachedVendors.FetchRowIndexOfDataByColumnName(
      attachedVendor.name,
      DataTable_Columns_Type.AttachedVendors_VendorName
    )
    if (index == null) {
      throw new Error(`Unable to find ${attachedVendor.name} in the VendorName column`)
    }
    await this.DataTable_AttachedVendors.ClickLinkInDataCell_ProvideName(
      index,
      this.DataTable_AttachedVendors.actionMenuName,
      1 // 2nd link
    )

    const vendorPage = new ClientPortalVendorPage(this.global, attachedVendor)
    return vendorPage
  }

  async ClickLinkToServiceAreaAndVendorByIndex(index: string, attachedVendor: Vendor) {
    await this.DataTable_AttachedVendors.ClickLinkInDataCell_ProvideName(
      index,
      this.DataTable_AttachedVendors.actionMenuName,
      0 // 1st link
    )
    const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(
      this.global,
      this.serviceArea,
      attachedVendor
    )
    await serviceAreaAndVendorPage.page.waitForLoadState()
    await serviceAreaAndVendorPage.page
      .locator('#card_serviceareadetailinfo_mapofservicearea_toggle')
      .waitFor({ state: 'visible' })
    return serviceAreaAndVendorPage
  }

  async ClickLinkToServiceAreaAndVendor(attachedVendor: Vendor) {
    const index = await this.DataTable_AttachedVendors.FetchRowIndexOfDataByColumnName(
      attachedVendor.name,
      DataTable_Columns_Type.AttachedVendors_VendorName
    )
    if (index == null) {
      throw new Error(`Unable to find ${attachedVendor.name} in the Vendor Name column`)
    }
    return await this.ClickLinkToServiceAreaAndVendorByIndex(index, attachedVendor)
  }

  async UpdateVendorOverridesByIndex(
    rowIndex: string,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor
  ) {
    await this.SelectAttachedVendorsActionMenuItem(
      rowIndex,
      AttachedVendors_DataTable_ActionMenuItems.UpdateVendorOverrides
    )
    const updateServiceAreaVendorDrawer = new ClientPortalUpdateServiceAreaVendorDrawer(
      this.global,
      overrides
    )
    // Fill in any/all fields as needed
    if (startDate != null) {
      await updateServiceAreaVendorDrawer.SetStartDate(startDate)
    }
    if (endDate != null) {
      await updateServiceAreaVendorDrawer.SetEndDate(endDate)
    }
    await updateServiceAreaVendorDrawer.FillOverrides(overrides)

    await updateServiceAreaVendorDrawer.Button_Submit.Click()
  }

  async UpdateRulesFromVendor(rowIndex: string, vendor: Vendor, ruleGroup: VendorRuleGroup) {
    await this.SelectAttachedVendorsActionMenuItem(
      rowIndex,
      AttachedVendors_DataTable_ActionMenuItems.UpdateRulesFromVendor
    )
    const updateRulesFromVendorDrawer = new ClientPortalUpdateRulesFromVendorDrawer(this.global, vendor)
    await updateRulesFromVendorDrawer.Title.locator.waitFor({ state: 'visible' })
    // apply the rule(s)
    // Find a match - true if one was found
    await this.page.waitForTimeout(1000)
    const result = await updateRulesFromVendorDrawer.FindAndSelectGroupRule(ruleGroup)
    expect(result).toBe(true)
    await updateRulesFromVendorDrawer.Button_Submit.Click()
  }

  async UpdateRulesFromVendor_SelectAll(rowIndex: string, vendor: Vendor) {
    await this.SelectAttachedVendorsActionMenuItem(
      rowIndex,
      AttachedVendors_DataTable_ActionMenuItems.UpdateRulesFromVendor
    )
    const updateRulesFromVendorDrawer = new ClientPortalUpdateRulesFromVendorDrawer(this.global, vendor)
    await updateRulesFromVendorDrawer.Title.locator.waitFor({ state: 'visible' })
    await updateRulesFromVendorDrawer.SelectAllRules()
    await this.page.waitForTimeout(1000)
    await updateRulesFromVendorDrawer.Button_Submit.Click()
  }

  async DetachVendor(rowIndex: string) {
    await this.SelectAttachedVendorsActionMenuItem(
      rowIndex,
      AttachedVendors_DataTable_ActionMenuItems.DetachVendor
    )
    await this.HandleDetachVendorAlert()
  }

  async HandleDetachVendorAlert(cancelDetach = false) {
    const alert = new ClientPortalDeleteAlert(
      this.global,
      AlertStrings.DetachVendor_Title,
      AlertStrings.DetachVendor_Description
    )
    if (cancelDetach) {
      await alert.Button_Close.locator.click({ force: true })
    } else {
      await alert.Button_Confirm.locator.click({ force: true })
    }
  }
}
