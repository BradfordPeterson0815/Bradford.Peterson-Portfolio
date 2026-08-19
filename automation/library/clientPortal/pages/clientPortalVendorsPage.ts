import { expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { ClientPortalDeleteAlert } from '../alerts/clientPortalDeleteAlert.js'
import {
  AlertStrings,
  DataTable_Columns_Type,
  VendorRuleType,
  VendorsPageStrings,
  Vendors_DataTable_ActionMenuItems,
} from '../clientPortalConstants.js'
import { ClientPortalDataTable } from '../clientPortalDataTable.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { IsOldEnoughToDelete } from '../clientPortalHelper.js'
import { ServiceArea } from '../clientPortalServiceArea.js'
import { Vendor } from '../clientPortalVendor.js'
import { ClientPortalAttachVendorToServiceAreaDrawer } from '../drawers/clientPortalAttachVendorToServiceAreaDrawer.js'
import { ClientPortalCreateServiceAreaDrawer } from '../drawers/clientPortalCreateServiceAreaDrawer.js'
import { ClientPortalCreateVendorDrawer } from '../drawers/clientPortalCreateVendorDrawer.js'
import { ClientPortalCreateVendorRuleDrawer } from '../drawers/clientPortalCreateVendorRuleDrawer.js'
import { ClientPortalSelectRulesFromVendorDrawer } from '../drawers/clientPortalSelectRulesFromVendorDrawer.js'
import { VendorRuleGroup } from '../rules/clientPortalVendorRuleGroup.js'
import { ClientPortalBasePage } from './clientPortalBasePage.js'
import { ClientPortalVendorPage } from './clientPortalVendorPage.js'

export class ClientPortalVendorsPage extends ClientPortalBasePage {
  readonly Title: Element
  readonly DataTable_Vendors: ClientPortalDataTable
  readonly Button_CreateVendor: Element

  constructor(global: ClientPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${VendorsPageStrings.Title}` }),
      VendorsPageStrings.Title
    )
    this.URL = `${global.baseUrl}vendors`
    this.Button_CreateVendor = new Element(
      this.global.page,
      this.page.locator('#button_addvendor'),
      VendorsPageStrings.Button_CreateVendor
    )
    this.DataTable_Vendors = new ClientPortalDataTable(
      global,
      '#admin_tabpanel_vendorinfo_body',
      1,
      VendorsPageStrings.ActionMenu,
      VendorsPageStrings.ActionMenuAria
    )
  }

  async NavigateDirectly() {
    await this.page.goto(this.URL)
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.NavigateDirectly()
    } else {
      await this.leftNavBar.GoHome()
      await this.leftNavBar.Button_Vendors.Click()
      await this.page.waitForLoadState()
    }
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async SelectActionMenuItem(rowIndex: string, actionMenuItem: Vendors_DataTable_ActionMenuItems) {
    await this.DataTable_Vendors.OpenActionMenu(rowIndex)
    await this.DataTable_Vendors.SelectActionMenuItem(actionMenuItem)
  }

  async IsActionMenuItemVisible(
    rowIndex: string,
    actionMenuItem: Vendors_DataTable_ActionMenuItems
  ) {
    await this.DataTable_Vendors.OpenActionMenu(rowIndex)
    await this.page.waitForTimeout(1000)
    const visibility = await this.DataTable_Vendors.IsActionMenuItemVisible(actionMenuItem)
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async RemoveVendorByIndex(vendorIndex: string) {
    await this.DataTable_Vendors.OpenActionMenu(vendorIndex)
    await this.DataTable_Vendors.SelectActionMenuItem(
      Vendors_DataTable_ActionMenuItems.RemoveVendor
    )
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

  async ClickLinkToVendor(vendor: Vendor) {
    const index = await this.DataTable_Vendors.FetchRowIndexOfDataByColumnName(
      vendor.name,
      DataTable_Columns_Type.Vendors_Name
    )
    if (index == null) {
      throw new Error(`Unable to find ${vendor.name} in the Name column`)
    }
    await this.DataTable_Vendors.ClickLinkInDataCell_ProvideName(
      index,
      this.DataTable_Vendors.actionMenuName
    )

    const vendorPage = new ClientPortalVendorPage(this.global, vendor)
    return vendorPage
  }

  async OpenCreateVendorDrawer(isEditMode = false) {
    await this.Button_CreateVendor.Click()
    const createVendorDrawer = new ClientPortalCreateVendorDrawer(this.global, isEditMode)
    return createVendorDrawer
  }

  async OpenCreateVendorRuleDrawerByIndex(vendorIndex: string) {
    await this.DataTable_Vendors.OpenActionMenu(vendorIndex)
    await this.DataTable_Vendors.SelectActionMenuItem(Vendors_DataTable_ActionMenuItems.CreateRule)
    return new ClientPortalCreateVendorRuleDrawer(this.global, VendorRuleType.Unspecified, false)
  }

  async AddVendor(vendor: Vendor, useCopy: boolean = false) {
    const createVendorDrawer = await this.OpenCreateVendorDrawer()
    await createVendorDrawer.FillDrawer(vendor, useCopy)
    await this.page.reload()
    await this.page.waitForTimeout(3000)
  }

  async FindVendorByName(vendorName: string) {
    const { pinnedFilter } = await this.DataTable_Vendors.SetTableFilter_Text(
      vendorName,
      DataTable_Columns_Type.Vendors_Name
    )
    const index = await this.DataTable_Vendors.FetchRowIndexOfDataByColumnName(
      vendorName,
      DataTable_Columns_Type.Vendors_Name
    )
    if (index == null) {
      throw new Error(`Unable to find ${vendorName} in the Name column`)
    }
    return { index, pinnedFilter }
  }

  async UpdateVendorIdAsNeeded(vendor: Vendor) {
    if (vendor.id != '') {
      return
    }
    const { pinnedFilter } = await this.DataTable_Vendors.SetTableFilter_Text(
      vendor.name,
      DataTable_Columns_Type.Vendors_Name
    )
    const index = await this.DataTable_Vendors.FetchRowIndexOfDataByColumnName(
      vendor.name,
      DataTable_Columns_Type.Vendors_Name
    )
    if (index == null) {
      throw new Error(`Unable to find ${vendor.name} in the Name column`)
    }
    await this.SelectActionMenuItem(index, Vendors_DataTable_ActionMenuItems.CopyVendorID)
    vendor.id = await this.GetClipboardText()
    await this.DataTable_Vendors.CancelPinnedTableFilter(pinnedFilter)
  }

  async FindAndDeleteVendorByName(vendorName: string) {
    const { index, pinnedFilter } = await this.FindVendorByName(vendorName)
    await this.RemoveVendorByIndex(index)
    await this.DataTable_Vendors.CancelPinnedTableFilter(pinnedFilter)
  }

  async FindAndEditVendorByName(vendorName: string, vendorToFill: Vendor) {
    const { index } = await this.FindVendorByName(vendorName)
    await this.DataTable_Vendors.OpenActionMenu(index)
    await this.DataTable_Vendors.SelectActionMenuItem(
      Vendors_DataTable_ActionMenuItems.UpdateVendor
    )
    const createVendorDrawer = new ClientPortalCreateVendorDrawer(this.global, true)
    createVendorDrawer.FillDrawer(vendorToFill)
  }

  async FindAndDeleteOldTimestampedVendors(vendorPrefix: string) {
    const { pinnedFilter } = await this.DataTable_Vendors.SetTableFilter_Text(
      vendorPrefix,
      DataTable_Columns_Type.Vendors_Name
    )
    const vendorsToDelete: string[] = []
    const rowCount = await this.DataTable_Vendors.VisibleRowCount()
    if (rowCount > 0) {
      for (let index = 0; index < rowCount; index++) {
        const vendorName = await this.DataTable_Vendors.FetchRowTextDataByColumnName(
          index.toString(),
          DataTable_Columns_Type.Vendors_Name
        )
        const shouldDelete = IsOldEnoughToDelete(parseInt(vendorName.split('+')[1]))
        if (shouldDelete) {
          vendorsToDelete.push(vendorName)
        }
      }
    }
    await this.DataTable_Vendors.CancelPinnedTableFilter(pinnedFilter)
    while (vendorsToDelete.length > 0) {
      const vendorNameToDelete = vendorsToDelete.pop()
      if (vendorNameToDelete) {
        await this.FindAndDeleteVendorByName(vendorNameToDelete)
      }
    }
  }

  async AddRuleGroupToVendorByName(vendorName: string, ruleGroup: VendorRuleGroup) {
    const { index, pinnedFilter } = await this.FindVendorByName(vendorName)
    await this.AddRuleGroupToVendorByIndex(index, ruleGroup)
    await this.DataTable_Vendors.CancelPinnedTableFilter(pinnedFilter)
  }

  async AddRuleGroupToVendorByIndex(vendorIndex: string, ruleGroup: VendorRuleGroup) {
    const createVendorRuleDrawer = await this.OpenCreateVendorRuleDrawerByIndex(
      vendorIndex
      // VendorRuleType.Unspecified,
      // false
    )
    await createVendorRuleDrawer.FillDrawer(ruleGroup)
  }

  async AttachVendorToExistingServiceAreaByIndex(
    vendorIndex: string,
    serviceArea: ServiceArea,
    vendor: Vendor,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    await this.DataTable_Vendors.OpenActionMenu(vendorIndex)
    await this.DataTable_Vendors.SelectActionMenuItem(
      Vendors_DataTable_ActionMenuItems.AttachVendorToServiceArea
    )
    const attachVendorToServiceAreaDrawer = new ClientPortalAttachVendorToServiceAreaDrawer(
      this.global,
      vendor
    )
    await attachVendorToServiceAreaDrawer.SelectServiceArea(serviceArea)
    // Fill in any/all fields as needed
    if (startDate != null) {
      await attachVendorToServiceAreaDrawer.SetStartDate(startDate)
    }
    if (endDate != null) {
      await attachVendorToServiceAreaDrawer.SetEndDate(endDate)
    }
    if (overrides != null) {
      await attachVendorToServiceAreaDrawer.FillOverrides(overrides)
    }
    await attachVendorToServiceAreaDrawer.Button_Submit.Click()
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

  async AttachVendorToNewServiceAreaByIndex(
    vendorIndex: string,
    serviceAreaToCreate: ServiceArea,
    vendor: Vendor,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    await this.DataTable_Vendors.OpenActionMenu(vendorIndex)
    await this.DataTable_Vendors.SelectActionMenuItem(
      Vendors_DataTable_ActionMenuItems.AttachVendorToServiceArea
    )
    const attachVendorToServiceAreaDrawer = new ClientPortalAttachVendorToServiceAreaDrawer(
      this.global,
      vendor
    )
    await attachVendorToServiceAreaDrawer.Button_CreateServiceArea.Click()
    const createServiceAreaDrawer = new ClientPortalCreateServiceAreaDrawer(this.global, false)
    await createServiceAreaDrawer.FillDrawer(serviceAreaToCreate)
    await attachVendorToServiceAreaDrawer.SelectServiceArea(serviceAreaToCreate)

    // Fill in any/all fields as needed
    if (startDate != null) {
      await attachVendorToServiceAreaDrawer.SetStartDate(startDate)
    }
    if (endDate != null) {
      await attachVendorToServiceAreaDrawer.SetEndDate(endDate)
    }
    if (overrides != null) {
      await attachVendorToServiceAreaDrawer.FillOverrides(overrides)
    }
    await attachVendorToServiceAreaDrawer.Button_Submit.Click()
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
}
