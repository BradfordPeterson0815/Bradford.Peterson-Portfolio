import { expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { ClientPortalDeleteAlert } from '../alerts/clientPortalDeleteAlert.js'
import {
  AlertStrings,
  DataTable_Columns_Type,
  ServiceAreasPageStrings,
  ServiceAreas_DataTable_ActionMenuItems,
} from '../clientPortalConstants.js'
import { ClientPortalDataTable } from '../clientPortalDataTable.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { IsOldEnoughToDelete } from '../clientPortalHelper.js'
import { ServiceArea } from '../clientPortalServiceArea.js'
import { Vendor } from '../clientPortalVendor.js'
import { ClientPortalAddVendorToServiceAreaDrawer } from '../drawers/clientPortalAddVendorToServiceAreaDrawer.js'
import { ClientPortalCreateServiceAreaDrawer } from '../drawers/clientPortalCreateServiceAreaDrawer.js'
import { ClientPortalCreateVendorDrawer } from '../drawers/clientPortalCreateVendorDrawer.js'
import { ClientPortalSelectRulesFromVendorDrawer } from '../drawers/clientPortalSelectRulesFromVendorDrawer.js'
import { ClientPortalBasePage } from './clientPortalBasePage.js'
import { ClientPortalServiceAreaPage } from './clientPortalServiceAreaPage.js'

export class ClientPortalServiceAreasPage extends ClientPortalBasePage {
  readonly Title: Element
  readonly DataTable_ServiceAreas: ClientPortalDataTable
  readonly Button_CreateServiceArea: Element

  constructor(global: ClientPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${ServiceAreasPageStrings.Title}` }),
      ServiceAreasPageStrings.Title
    )
    this.URL = `${global.baseUrl}service-areas`
    this.Button_CreateServiceArea = new Element(
      this.global.page,
      this.page.locator('#button_addservicearea'),
      ServiceAreasPageStrings.Button_CreateServiceArea
    )
    this.DataTable_ServiceAreas = new ClientPortalDataTable(
      global,
      '#admin_tabpanel_serviceareainfo_body',
      1,
      ServiceAreasPageStrings.ActionMenu,
      ServiceAreasPageStrings.ActionMenuAria
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
      await this.leftNavBar.Button_ServiceAreas.Click()
      await this.page.waitForLoadState()
    }
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async SelectActionMenuItem(
    rowIndex: string,
    actionMenuItem: ServiceAreas_DataTable_ActionMenuItems
  ) {
    await this.DataTable_ServiceAreas.OpenActionMenu(rowIndex)
    await this.DataTable_ServiceAreas.SelectActionMenuItem(actionMenuItem)
  }

  async IsActionMenuItemVisible(
    rowIndex: string,
    actionMenuItem: ServiceAreas_DataTable_ActionMenuItems
  ) {
    await this.DataTable_ServiceAreas.OpenActionMenu(rowIndex)
    await this.page.waitForTimeout(1000)
    const visibility = await this.DataTable_ServiceAreas.IsActionMenuItemVisible(actionMenuItem)
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async RemoveServiceAreaByIndex(serviceAreaIndex: string, serviceAreaName: string) {
    await this.DataTable_ServiceAreas.OpenActionMenu(serviceAreaIndex)
    await this.DataTable_ServiceAreas.SelectActionMenuItem(
      ServiceAreas_DataTable_ActionMenuItems.RemoveServiceArea
    )
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

  async ClickLinkToServiceArea(serviceArea: ServiceArea) {
    const index = await this.DataTable_ServiceAreas.FetchRowIndexOfDataByColumnName(
      serviceArea.name,
      DataTable_Columns_Type.ServiceAreas_AreaName
    )
    if (index == null) {
      throw new Error(`Unable to find ${serviceArea.name} in the Name column`)
    }
    await this.DataTable_ServiceAreas.ClickLinkInDataCell_ProvideName(
      index,
      this.DataTable_ServiceAreas.actionMenuName
    )

    const serviceAreaPage = new ClientPortalServiceAreaPage(this.global, serviceArea)
    return serviceAreaPage
  }

  async UpdateServiceAreaIdAsNeeded(serviceArea: ServiceArea) {
    if (serviceArea.id != '') {
      return
    }
    const { pinnedFilter } = await this.DataTable_ServiceAreas.SetTableFilter_Text(
      serviceArea.name,
      DataTable_Columns_Type.ServiceAreas_AreaName
    )
    const index = await this.DataTable_ServiceAreas.FetchRowIndexOfDataByColumnName(
      serviceArea.name,
      DataTable_Columns_Type.ServiceAreas_AreaName
    )
    if (index == null) {
      throw new Error(`Unable to find ${serviceArea.name} in the AreaName column`)
    }
    await this.SelectActionMenuItem(index, ServiceAreas_DataTable_ActionMenuItems.CopyServiceAreaID)
    serviceArea.id = await this.GetClipboardText()
    await this.DataTable_ServiceAreas.CancelPinnedTableFilter(pinnedFilter)
  }

  async OpenCreateServiceAreaDrawer(isEditMode = false) {
    await this.Button_CreateServiceArea.Click()
    const createServiceAreaDrawer = new ClientPortalCreateServiceAreaDrawer(this.global, isEditMode)
    return createServiceAreaDrawer
  }

  async AddServiceArea(serviceArea: ServiceArea) {
    const createServiceAreaDrawer = await this.OpenCreateServiceAreaDrawer()
    await createServiceAreaDrawer.FillDrawer(serviceArea)
  }

  async FindServiceAreaByName(serviceAreaName: string) {
    const { pinnedFilter } = await this.DataTable_ServiceAreas.SetTableFilter_Text(
      serviceAreaName,
      DataTable_Columns_Type.ServiceAreas_AreaName
    )
    const index = await this.DataTable_ServiceAreas.FetchRowIndexOfDataByColumnName(
      serviceAreaName,
      DataTable_Columns_Type.ServiceAreas_AreaName
    )
    if (index == null) {
      throw new Error(`Unable to find ${serviceAreaName} in the Area Name column`)
    }
    return { index, pinnedFilter }
  }

  async FindAndRemoveServiceAreaByName(serviceAreaName: string) {
    const { index, pinnedFilter } = await this.FindServiceAreaByName(serviceAreaName)
    await this.RemoveServiceAreaByIndex(index, serviceAreaName)
    await this.DataTable_ServiceAreas.CancelPinnedTableFilter(pinnedFilter)
  }

  async FindAndEditServiceAreaByName(serviceAreaName: string, serviceAreaToFill: ServiceArea) {
    const { index, pinnedFilter } = await this.FindServiceAreaByName(serviceAreaName)
    await this.DataTable_ServiceAreas.OpenActionMenu(index)
    await this.DataTable_ServiceAreas.SelectActionMenuItem(
      ServiceAreas_DataTable_ActionMenuItems.UpdateServiceArea
    )
    const createServiceAreaDrawer = new ClientPortalCreateServiceAreaDrawer(this.global, true)
    createServiceAreaDrawer.FillDrawer(serviceAreaToFill)
    await this.DataTable_ServiceAreas.CancelPinnedTableFilter(pinnedFilter)
  }

  async FindAndRemoveOldTimestampedServiceAreas(serviceAreaPrefix: string) {
    const { pinnedFilter } = await this.DataTable_ServiceAreas.SetTableFilter_Text(
      serviceAreaPrefix,
      DataTable_Columns_Type.ServiceAreas_AreaName
    )
    const serviceAreasToRemove: string[] = []
    const rowCount = await this.DataTable_ServiceAreas.VisibleRowCount()
    if (rowCount > 0) {
      for (let index = 0; index < rowCount; index++) {
        const serviceAreaName = await this.DataTable_ServiceAreas.FetchRowTextDataByColumnName(
          index.toString(),
          DataTable_Columns_Type.ServiceAreas_AreaName
        )
        const shouldRemove = IsOldEnoughToDelete(parseInt(serviceAreaName.split('+')[1]))
        if (shouldRemove) {
          serviceAreasToRemove.push(serviceAreaName)
        }
      }
    }
    await this.DataTable_ServiceAreas.CancelPinnedTableFilter(pinnedFilter)
    while (serviceAreasToRemove.length > 0) {
      const serviceAreaNameToRemove = serviceAreasToRemove.pop()
      if (serviceAreaNameToRemove) {
        await this.FindAndRemoveServiceAreaByName(serviceAreaNameToRemove)
      }
    }
  }

  async AddExistingVendorToServiceAreaByIndex(
    serviceAreaIndex: string,
    serviceArea: ServiceArea,
    vendor: Vendor,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    await this.DataTable_ServiceAreas.OpenActionMenu(serviceAreaIndex)
    await this.DataTable_ServiceAreas.SelectActionMenuItem(
      ServiceAreas_DataTable_ActionMenuItems.AddVendorToServiceArea
    )
    const addVendorToServiceAreaDrawer = new ClientPortalAddVendorToServiceAreaDrawer(
      this.global,
      serviceArea
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
      await this.page.waitForTimeout(3000)
      const result = await selectRulesFromVendorDrawer.FindAndSelectGroupRule(vendor.ruleTest)
      expect(result).toBe(true)
      await selectRulesFromVendorDrawer.Button_Submit.Click()
    }
  }

  async AddNewVendorToServiceAreaByIndex(
    serviceAreaIndex: string,
    serviceArea: ServiceArea,
    vendorToCreate: Vendor,
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor | null = null
  ) {
    await this.DataTable_ServiceAreas.OpenActionMenu(serviceAreaIndex)
    await this.DataTable_ServiceAreas.SelectActionMenuItem(
      ServiceAreas_DataTable_ActionMenuItems.AddVendorToServiceArea
    )
    const addVendorToServiceAreaDrawer = new ClientPortalAddVendorToServiceAreaDrawer(
      this.global,
      serviceArea
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
}
