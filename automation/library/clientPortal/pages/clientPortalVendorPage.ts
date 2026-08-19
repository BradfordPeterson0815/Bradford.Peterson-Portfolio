import { expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { ClientPortalDeleteAlert } from '../alerts/clientPortalDeleteAlert.js'
import {
  AlertStrings,
  AttachedServiceAreas_DataTable_ActionMenuItems,
  DataTable_Columns_Type,
  VendorPageStrings,
  VendorRuleType,
  VendorRules_DataTable_ActionMenuItems,
  Vendors_DataTable_ActionMenuItems,
} from '../clientPortalConstants.js'
import { ClientPortalDataTable } from '../clientPortalDataTable.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { FetchValueByKey } from '../clientPortalHelper.js'
import { ServiceArea } from '../clientPortalServiceArea.js'
import { Vendor } from '../clientPortalVendor.js'
import { ClientPortalApplyRuleToServiceAreasDrawer } from '../drawers/clientPortalApplyRuleToServiceAreasDrawer.js'
import { ClientPortalAttachVendorToServiceAreaDrawer } from '../drawers/clientPortalAttachVendorToServiceAreaDrawer.js'
import { ClientPortalCreateServiceAreaDrawer } from '../drawers/clientPortalCreateServiceAreaDrawer.js'
import { ClientPortalCreateVendorDrawer } from '../drawers/clientPortalCreateVendorDrawer.js'
import { ClientPortalCreateVendorRuleDrawer } from '../drawers/clientPortalCreateVendorRuleDrawer.js'
import { ClientPortalSelectRulesFromVendorDrawer } from '../drawers/clientPortalSelectRulesFromVendorDrawer.js'
import { ClientPortalUpdateRulesFromVendorDrawer } from '../drawers/clientPortalUpdateRulesFromVendorDrawer.js'
import { ClientPortalUpdateServiceAreaVendorDrawer } from '../drawers/clientPortalUpdateServiceAreaVendorDrawer.js'
import { VendorRuleGroup } from '../rules/clientPortalVendorRuleGroup.js'
import { ClientPortalAssignmentRulesSection } from '../sections/clientPortalAssignmentRulesSection.js'
import { ClientPortalBasePage } from './clientPortalBasePage.js'
import { ClientPortalServiceAreaAndVendorPage } from './clientPortalServiceAreaAndVendorPage.js'
import { ClientPortalServiceAreaPage } from './clientPortalServiceAreaPage.js'

export class ClientPortalVendorPage extends ClientPortalBasePage {
  readonly Title: Element
  readonly baseURL: string
  readonly Link_Vendors: Element
  readonly Button_Actions: Element
  ClaimAssignmentRules: ClientPortalAssignmentRulesSection
  MitigationAssignmentRules: ClientPortalAssignmentRulesSection
  readonly DataTable_AttachedServiceAreas: ClientPortalDataTable
  readonly Label_GettingStartedHeader: Element
  readonly Label_GettingStartedDescriptionA: Element
  readonly Label_GettingStartedDescriptionB: Element
  readonly Button_GettingStarted_AttachVendorToServiceArea: Element
  readonly Button_ToggleMap: Element
  readonly Button_AttachToServiceArea: Element
  vendor: Vendor

  constructor(global: ClientPortalGlobal, vendor: Vendor) {
    super(global)
    this.vendor = vendor
    this.Title = new Element(global.page, this.page.locator('#vendordetail_title'), vendor.name)
    this.baseURL = `${global.baseUrl}vendors/${vendor.id}`
    this.Link_Vendors = new Element(
      global.page,
      this.page.locator('#button_returntovendors'),
      VendorPageStrings.Link_Vendors
    )
    this.Button_Actions = new Element(
      global.page,
      this.page.getByRole('button', { name: `${VendorPageStrings.Buton_Actions}` }),
      VendorPageStrings.Buton_Actions
    )
    this.ClaimAssignmentRules = new ClientPortalAssignmentRulesSection(global, VendorRuleType.Assignment)
    this.MitigationAssignmentRules = new ClientPortalAssignmentRulesSection(
      global,
      VendorRuleType.Mitigation
    )
    this.DataTable_AttachedServiceAreas = new ClientPortalDataTable(
      global,
      '#card_vendor_attachedserviceareas_content',
      1,
      VendorPageStrings.ActionMenu,
      VendorPageStrings.ServiceAreaActionMenuAria
    )
    this.Label_GettingStartedHeader = new Element(
      global.page,
      this.page.locator('#card_vendor_attachedserviceareas_content h3'),
      VendorPageStrings.Label_GettingStartedHeader
    )
    this.Label_GettingStartedDescriptionA = new Element(
      global.page,
      this.page.locator('#card_vendor_attachedserviceareas_content p').nth(0),
      VendorPageStrings.Label_GettingStartedDescriptionA
    )
    this.Label_GettingStartedDescriptionB = new Element(
      global.page,
      this.page.locator('#card_vendor_attachedserviceareas_content p').nth(1),
      VendorPageStrings.Label_GettingStartedDescriptionB
    )
    this.Button_GettingStarted_AttachVendorToServiceArea = new Element(
      global.page,
      this.page.locator('#button_vendorserviceareas_attachvendor_gettingstarted'),
      VendorPageStrings.Button_GettingStartedAttachVendorToServiceArea
    )
    this.Button_ToggleMap = new Element(
      global.page,
      this.page.locator('#card_vendor_attachedserviceareas_title button').nth(0),
      VendorPageStrings.Button_ViewMap
    )
    this.Button_AttachToServiceArea = new Element(
      global.page,
      this.page.locator('#card_vendor_attachedserviceareas_title button').nth(1),
      VendorPageStrings.Button_AttachToServiceArea
    )
  }

  async IsAttachedServiceAreasEmpty() {
    return (await this.Button_GettingStarted_AttachVendorToServiceArea.locator.count()) > 0
  }

  async NavigateDirectly() {
    await this.page.goto(this.baseURL)
    await this.page.waitForTimeout(5000)
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async SelectAttachedServiceAreasActionMenuItem(
    rowIndex: string,
    actionMenuItem: AttachedServiceAreas_DataTable_ActionMenuItems
  ) {
    await this.DataTable_AttachedServiceAreas.OpenActionMenu(rowIndex)
    await this.DataTable_AttachedServiceAreas.SelectActionMenuItem(actionMenuItem)
  }

  async IsAttachedServiceAreasActionMenuItemVisible(
    rowIndex: string,
    actionMenuItem: AttachedServiceAreas_DataTable_ActionMenuItems
  ) {
    await this.DataTable_AttachedServiceAreas.OpenActionMenu(rowIndex)
    await this.page.waitForTimeout(1000)
    const visibility =
      await this.DataTable_AttachedServiceAreas.IsActionMenuItemVisible(actionMenuItem)
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async Action_CopyVendorID() {
    await this.Button_Actions.Click()
    await this.page
      .getByRole('menuitem', { name: `${Vendors_DataTable_ActionMenuItems.CopyVendorID}` })
      .click()
    const copiedID = await this.GetClipboardText()
    return copiedID
  }

  async Action_UpdateVendor(updateVendor: Vendor) {
    await this.Button_Actions.Click()
    await this.page
      .getByRole('menuitem', { name: `${Vendors_DataTable_ActionMenuItems.UpdateVendor}` })
      .click()
    const createVendorDrawer = new ClientPortalCreateVendorDrawer(this.global, true)
    await createVendorDrawer.FillDrawer(updateVendor)
  }

  async Action_AttachVendorToExistingServiceArea(
    serviceArea: ServiceArea,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    await this.Button_Actions.Click()
    await this.page
      .getByRole('menuitem', {
        name: `${Vendors_DataTable_ActionMenuItems.AttachVendorToServiceArea}`,
      })
      .click()
    await this.HandleAttachVendorToExistingServiceArea(serviceArea, startDate, endDate, overrides)
  }

  async Action_AttachVendorToNewServiceArea(
    serviceArea: ServiceArea,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    await this.Button_Actions.Click()
    await this.page
      .getByRole('menuitem', {
        name: `${Vendors_DataTable_ActionMenuItems.AttachVendorToServiceArea}`,
      })
      .click()
    await this.HandleAttachVendorToNewServiceArea(serviceArea, startDate, endDate, overrides)
  }

  async AttachedServiceAreas_AttachToExistingServiceArea(
    serviceArea: ServiceArea,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    await this.Button_AttachToServiceArea.Click()
    await this.HandleAttachVendorToExistingServiceArea(serviceArea, startDate, endDate, overrides)
  }

  async AttachedServiceAreas_AttachToNewServiceArea(
    serviceArea: ServiceArea,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    await this.Button_AttachToServiceArea.Click()
    await this.HandleAttachVendorToNewServiceArea(serviceArea, startDate, endDate, overrides)
  }

  async AttachedServiceAreas_GettingStarted_AttachVendorToExistingServiceArea(
    serviceArea: ServiceArea,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    await this.Button_GettingStarted_AttachVendorToServiceArea.Click()
    await this.HandleAttachVendorToExistingServiceArea(serviceArea, startDate, endDate, overrides)
  }

  async AttachedServiceAreas_GettingStarted_AttachVendorToNewServiceArea(
    serviceArea: ServiceArea,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    await this.Button_GettingStarted_AttachVendorToServiceArea.Click()
    await this.HandleAttachVendorToNewServiceArea(serviceArea, startDate, endDate, overrides)
  }

  async HandleAttachVendorToExistingServiceArea(
    serviceArea: ServiceArea,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    const addVendorToServiceAreaDrawer = new ClientPortalAttachVendorToServiceAreaDrawer(
      this.global,
      this.vendor
    )
    await addVendorToServiceAreaDrawer.SelectServiceArea(serviceArea)
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
      this.vendor
    )
    await selectRulesFromVendorDrawer.Title.locator.waitFor({ state: 'visible' })
    if (this.vendor.ruleTest == null) {
      // Don't try to apply any rules - just close the drawer
      await selectRulesFromVendorDrawer.Button_Close.Click()
    } else {
      // apply the rule(s)
      // Find a match - true if one was found
      await this.page.waitForTimeout(1000)
      const result = await selectRulesFromVendorDrawer.FindAndSelectGroupRule(this.vendor.ruleTest)
      expect(result).toBe(true)
      await selectRulesFromVendorDrawer.Button_Submit.Click()
    }
  }

  async HandleAttachVendorToNewServiceArea(
    serviceAreaToCreate: ServiceArea,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    const addVendorToServiceAreaDrawer = new ClientPortalAttachVendorToServiceAreaDrawer(
      this.global,
      this.vendor
    )
    await addVendorToServiceAreaDrawer.Button_CreateServiceArea.Click()
    const createServiceAreaDrawer = new ClientPortalCreateServiceAreaDrawer(this.global, false)
    await createServiceAreaDrawer.FillDrawer(serviceAreaToCreate)
    await addVendorToServiceAreaDrawer.SelectServiceArea(serviceAreaToCreate)

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
      this.vendor
    )
    await selectRulesFromVendorDrawer.Title.locator.waitFor({ state: 'visible' })
    if (this.vendor.ruleTest == null) {
      // Don't try to apply any rules - just close the drawer
      await selectRulesFromVendorDrawer.Button_Close.Click()
    } else {
      // apply the rule(s)
      // Find a match - true if one was found
      await this.page.waitForTimeout(1000)
      const result = await selectRulesFromVendorDrawer.FindAndSelectGroupRule(this.vendor.ruleTest)
      expect(result).toBe(true)
      await selectRulesFromVendorDrawer.Button_Submit.Click()
    }
  }

  async Action_CreateRule(ruleGroup: VendorRuleGroup) {
    await this.Button_Actions.Click()
    await this.page
      .getByRole('menuitem', { name: `${Vendors_DataTable_ActionMenuItems.CreateRule}` })
      .click()
    const createVendorRuleDrawer = new ClientPortalCreateVendorRuleDrawer(
      this.global,
      VendorRuleType.Unspecified,
      false
    )
    await createVendorRuleDrawer.FillDrawer(ruleGroup)
  }

  async Action_RemoveVendor() {
    await this.Button_Actions.Click()
    await this.page
      .getByRole('menuitem', { name: `${Vendors_DataTable_ActionMenuItems.RemoveVendor}` })
      .click()
    await this.HandleRemoveVendorAlert()
    await this.page.waitForTimeout(2000)
  }

  async HandleRemoveVendorAlert(cancelRemove = false) {
    const alert = new ClientPortalDeleteAlert(
      this.global,
      AlertStrings.RemoveVendor_Title,
      AlertStrings.RemoveVendor_Description
    )
    if (cancelRemove) {
      await alert.Button_Close.locator.click({ force: true })
    } else {
      await alert.Button_Confirm.locator.click({ force: true })
    }
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

  async ValidateEnabledBadge() {
    const actualEnabled = await this.page.locator('#vendorattributes_enabled').textContent()
    expect(actualEnabled).toBe(this.vendor.enabled ? 'Enabled' : 'Disabled')
  }

  async ValidateDetails() {
    const detailsLocator = this.page.locator('#card_vendor_details > div.chakra-card__body')

    const actualName = await detailsLocator
      .locator('#vendorattributes_name')
      .getAttribute('data-value')
    expect(actualName).toBe(this.vendor.name)

    const actualInternalName = await detailsLocator
      .locator('#vendorattributes_internalname')
      .getAttribute('data-value')
    expect(actualInternalName).toBe(this.vendor.internalName)

    const actualDisplayEmail = await detailsLocator
      .locator('#vendorattributes_displayemail')
      .getAttribute('data-value')
    expect(actualDisplayEmail).toBe(this.vendor.displayEmail)

    const actualNotificationEmail = await detailsLocator
      .locator('#vendorattributes_notificationemail')
      .getAttribute('data-value')
    expect(actualNotificationEmail).toBe(this.vendor.notificationEmail)

    const actualDisplayPhone = await detailsLocator
      .locator('#vendorattributes_displayphone')
      .getAttribute('data-value')
    const cleanedDisplayPhone = actualDisplayPhone?.split('-').join('')
    expect(cleanedDisplayPhone).toBe(this.vendor.displayPhone)

    const actualNotificationPhone = await detailsLocator
      .locator('#vendorattributes_notificationphone')
      .getAttribute('data-value')
    const cleanedNotificationPhone = actualNotificationPhone?.split('-').join('')
    expect(cleanedNotificationPhone).toBe(this.vendor.notificationPhone)

    const actualWebsite = await detailsLocator
      .locator('#vendorattributes_website')
      .getAttribute('data-value')
    expect(actualWebsite).toBe(this.vendor.website)

    if (this.vendor.additionalProperties.length > 0) {
      const propertiesParentLocator = detailsLocator
        .getByRole('heading', { name: 'Vendor Additional Properties' })
        .locator('..')
      const actualPropertyCount = await propertiesParentLocator.locator('dt').count()
      expect(this.vendor.additionalProperties.length).toBe(actualPropertyCount)
      for (
        let sourceIndex = 0;
        sourceIndex < this.vendor.additionalProperties.length;
        sourceIndex++
      ) {
        const sourceKey = this.vendor.additionalProperties[sourceIndex].key
        const vendorValue = FetchValueByKey(this.vendor.additionalProperties, sourceKey)
        let foundMatch = false
        for (let actualIndex = 0; actualIndex < actualPropertyCount; actualIndex++) {
          const actualKey = await propertiesParentLocator
            .locator('dt')
            .nth(actualIndex)
            .textContent()
          const actualValue = await propertiesParentLocator
            .locator('dd')
            .nth(actualIndex)
            .textContent()
          if (actualKey == sourceKey && actualValue == vendorValue) {
            foundMatch = true
            break
          }
        }
        expect(foundMatch).toBe(true)
      }
    }
  }

  async CopyRuleId(table: ClientPortalDataTable, rowPosition: number) {
    const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
    await table.OpenActionMenu(rowIndex)
    await table.SelectActionMenuItem(VendorRules_DataTable_ActionMenuItems.CopyRuleID)
  }

  async OpenApplyRuleToServiceAreaDrawer(table: ClientPortalDataTable, rowPosition: number) {
    const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
    await table.OpenActionMenu(rowIndex)
    await table.SelectActionMenuItem(
      VendorRules_DataTable_ActionMenuItems.AttachRuleToVendorsServiceAreas
    )
    const applyRuleToServiceAreaDrawer = new ClientPortalApplyRuleToServiceAreasDrawer(this.global)
    return applyRuleToServiceAreaDrawer
  }

  async ApplyRuleToServiceArea(
    serviceArea: ServiceArea,
    table: ClientPortalDataTable,
    rowPosition: number
  ) {
    const applyRuleToServiceAreaDrawer = await this.OpenApplyRuleToServiceAreaDrawer(
      table,
      rowPosition
    )
    const result = await applyRuleToServiceAreaDrawer.FindAndSelectServiceArea(serviceArea)
    expect(result).toBe(true)
    await applyRuleToServiceAreaDrawer.Button_Submit.Click()
  }

  async ClickLinkToServiceArea(attachedServiceArea: ServiceArea) {
    const index = await this.DataTable_AttachedServiceAreas.FetchRowIndexOfDataByColumnName(
      attachedServiceArea.name,
      DataTable_Columns_Type.ServiceAreas_AreaName
    )
    if (index == null) {
      throw new Error(`Unable to find ${attachedServiceArea.name} in the AreaName column`)
    }
    await this.DataTable_AttachedServiceAreas.ClickLinkInDataCell_ProvideName(
      index,
      this.DataTable_AttachedServiceAreas.actionMenuName,
      1 // 2nd link
    )

    const serviceAreaPage = new ClientPortalServiceAreaPage(this.global, attachedServiceArea)
    return serviceAreaPage
  }

  async ClickLinkToServiceAreaAndVendorByIndex(index: string, attachedServiceArea: ServiceArea) {
    await this.DataTable_AttachedServiceAreas.ClickLinkInDataCell_ProvideName(
      index,
      this.DataTable_AttachedServiceAreas.actionMenuName,
      0 // 1st link
    )
    const serviceAreaAndVendorPage = new ClientPortalServiceAreaAndVendorPage(
      this.global,
      attachedServiceArea,
      this.vendor
    )
    await serviceAreaAndVendorPage.page.waitForLoadState()
    await serviceAreaAndVendorPage.page
      .locator('#card_serviceareadetailinfo_mapofservicearea_toggle')
      .waitFor({ state: 'visible' })
    return serviceAreaAndVendorPage
  }

  async ClickLinkToServiceAreaAndVendor(attachedServiceArea: ServiceArea) {
    const index = await this.DataTable_AttachedServiceAreas.FetchRowIndexOfDataByColumnName(
      attachedServiceArea.name,
      DataTable_Columns_Type.ServiceAreas_AreaName
    )
    if (index == null) {
      throw new Error(`Unable to find ${attachedServiceArea.name} in the AreaName column`)
    }
    return await this.ClickLinkToServiceAreaAndVendorByIndex(index, attachedServiceArea)
  }

  async CreateCustomRule(rowIndex: string, ruleGroup: VendorRuleGroup) {
    await this.SelectAttachedServiceAreasActionMenuItem(
      rowIndex,
      AttachedServiceAreas_DataTable_ActionMenuItems.CreateCustomRule
    )
    const createVendorRuleDrawer = new ClientPortalCreateVendorRuleDrawer(
      this.global,
      VendorRuleType.Unspecified
    )
    await createVendorRuleDrawer.FillDrawer(ruleGroup)
  }

  async UpdateRulesFromVendor(rowIndex: string, ruleGroup: VendorRuleGroup) {
    await this.SelectAttachedServiceAreasActionMenuItem(
      rowIndex,
      AttachedServiceAreas_DataTable_ActionMenuItems.UpdateRulesFromVendor
    )
    const updateRulesFromVendorDrawer = new ClientPortalUpdateRulesFromVendorDrawer(
      this.global,
      this.vendor
    )
    await updateRulesFromVendorDrawer.Title.locator.waitFor({ state: 'visible' })
    // apply the rule(s)
    // Find a match - true if one was found
    await this.page.waitForTimeout(1000)
    const result = await updateRulesFromVendorDrawer.FindAndSelectGroupRule(ruleGroup)
    expect(result).toBe(true)
    await updateRulesFromVendorDrawer.Button_Submit.Click()
  }

  async UpdateRulesFromVendor_SelectAll(rowIndex: string) {
    await this.SelectAttachedServiceAreasActionMenuItem(
      rowIndex,
      AttachedServiceAreas_DataTable_ActionMenuItems.UpdateRulesFromVendor
    )
    const updateRulesFromVendorDrawer = new ClientPortalUpdateRulesFromVendorDrawer(
      this.global,
      this.vendor
    )
    await updateRulesFromVendorDrawer.Title.locator.waitFor({ state: 'visible' })
    await updateRulesFromVendorDrawer.SelectAllRules()
    await this.page.waitForTimeout(1000)
    await updateRulesFromVendorDrawer.Button_Submit.Click()
  }

  async DetachVendor(rowIndex: string) {
    await this.SelectAttachedServiceAreasActionMenuItem(
      rowIndex,
      AttachedServiceAreas_DataTable_ActionMenuItems.DetachVendor
    )
    await this.HandleDetachVendorAlert()
  }

  async UpdateVendorOverridesByIndex(
    rowIndex: string,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor
  ) {
    await this.SelectAttachedServiceAreasActionMenuItem(
      rowIndex,
      AttachedServiceAreas_DataTable_ActionMenuItems.UpdateVendorOverrides
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

  async FindAttachedServiceArea(serviceArea: ServiceArea) {
    const { pinnedFilter } = await this.DataTable_AttachedServiceAreas.SetTableFilter_Text(
      serviceArea.name,
      DataTable_Columns_Type.ServiceAreas_AreaName
    )
    const index = await this.DataTable_AttachedServiceAreas.FetchRowIndexOfDataByColumnName(
      serviceArea.name,
      DataTable_Columns_Type.ServiceAreas_AreaName
    )
    if (index == null) {
      throw new Error(`Unable to find ${serviceArea.name} in the AreaName column`)
    }
    return { index, pinnedFilter }
  }

  async IsAttachedServiceAreasMapDisplayed() {
    const mapLocator = await this.DataTable_AttachedServiceAreas.parent.locator('#mapdata').count()
    return mapLocator > 0
  }
}
