import { expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { ClientPortalDetachVendor } from '../alerts/clientPortalDetachVendor.js'
import {
  AttachedVendors_DataTable_ActionMenuItems,
  ServiceAreaAndVendorPageStrings,
  ServiceAreaPageStrings,
  VendorRuleType,
  VendorRules_DataTable_ActionMenuItems,
} from '../clientPortalConstants.js'
import { ClientPortalDataTable } from '../clientPortalDataTable.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { FetchValueByKey } from '../clientPortalHelper.js'
import { ServiceArea } from '../clientPortalServiceArea.js'
import { Vendor } from '../clientPortalVendor.js'
import { ClientPortalCreateVendorRuleDrawer } from '../drawers/clientPortalCreateVendorRuleDrawer.js'
import { ClientPortalUpdateRulesFromVendorDrawer } from '../drawers/clientPortalUpdateRulesFromVendorDrawer.js'
import { ClientPortalUpdateServiceAreaVendorDrawer } from '../drawers/clientPortalUpdateServiceAreaVendorDrawer.js'
import { VendorRuleGroup } from '../rules/clientPortalVendorRuleGroup.js'
import { ClientPortalAssignmentRulesSection } from '../sections/clientPortalAssignmentRulesSection.js'
import { ClientPortalBasePage } from './clientPortalBasePage.js'

export class ClientPortalServiceAreaAndVendorPage extends ClientPortalBasePage {
  readonly baseURL: string
  readonly Link_GotoServiceArea: Element
  readonly Link_GotoVendor: Element
  readonly Button_ToggleMap: Element
  readonly Button_Actions: Element
  ClaimAssignmentRules: ClientPortalAssignmentRulesSection
  MitigationAssignmentRules: ClientPortalAssignmentRulesSection
  vendor: Vendor
  overrides: Vendor | null
  serviceArea: ServiceArea

  constructor(
    global: ClientPortalGlobal,
    serviceArea: ServiceArea,
    vendor: Vendor,
    overrides: Vendor | null = null
  ) {
    super(global)
    this.baseURL = `${global.baseUrl}service-areas/${serviceArea.id}/vendors/${vendor.id}`
    this.Link_GotoServiceArea = new Element(
      global.page,
      this.page.locator('#serviceareavendordetail_link_gotoservicearea'),
      serviceArea.name
    )
    this.Link_GotoVendor = new Element(
      global.page,
      this.page.locator('#serviceareavendordetail_link_gotovendor'),
      vendor.name
    )
    this.Button_ToggleMap = new Element(
      global.page,
      this.page.locator('#card_serviceareadetailinfo_mapofservicearea_toggle'),
      ServiceAreaAndVendorPageStrings.Button_ViewMap
    )
    this.Button_Actions = new Element(
      global.page,
      this.page.getByRole('button', { name: `${ServiceAreaAndVendorPageStrings.Button_Actions}` }),
      ServiceAreaAndVendorPageStrings.Button_Actions
    )
    this.ClaimAssignmentRules = new ClientPortalAssignmentRulesSection(
      global,
      VendorRuleType.Assignment,
      true
    )
    this.MitigationAssignmentRules = new ClientPortalAssignmentRulesSection(
      global,
      VendorRuleType.Mitigation,
      true
    )
    this.vendor = vendor
    this.overrides = overrides
    this.serviceArea = serviceArea
  }

  async NavigateDirectly() {
    await this.page.goto(this.baseURL)
    await this.page.waitForLoadState()
    await this.page
      .locator('#card_serviceareadetailinfo_mapofservicearea_toggle')
      .waitFor({ state: 'visible' })
  }

  async IsTemporaryAssignmentSectionVisible() {
    const sectionLocator = this.page.locator(
      '#card_serviceareavendordetail_temporaryassignment_title'
    )
    return await sectionLocator.isVisible()
  }

  async IsServiceAreaMapDisplayed() {
    const mapLocator = await this.page.locator('#mapdata').count()
    return mapLocator > 0
  }

  async ValidateTemporaryAssignmentDates(startDate: string, endDate: string) {
    expect(await this.IsTemporaryAssignmentSectionVisible()).toBe(true)
    const datesLocator = this.page.locator(
      '#card_serviceareavendordetail_temporaryassignment_dates'
    )
    const isPast = await datesLocator.getAttribute('data-enddatepassed')
    const startDateValue = await datesLocator.getAttribute('data-startdate')
    const endDateValue = await datesLocator.getAttribute('data-enddate')
    const displayed = await datesLocator.innerText()
    expect(startDateValue).toBe(startDate)
    expect(endDateValue).toBe(endDate)
    if (isPast == 'true') {
      expect(displayed).toBe(`Assignment was between ${startDate} and ${endDate}`)
    } else {
      expect(displayed).toBe(`Assignment between ${startDate} and ${endDate}`)
    }
  }

  async ValidateVendorInfo() {
    await this.page.waitForTimeout(3000)
    const infoLocator = this.page
      .getByRole('heading', { name: `Vendor Info` })
      .locator('..')
      .locator('..')
      .locator('..')
      .locator('..')
      .locator('..')
      .locator('div.chakra-card__body > div > div')
      .nth(0)

    const actualName = await infoLocator
      .locator('#vendorattributes_name')
      .getAttribute('data-value')
    expect(actualName).toBe(
      this.overrides != null && this.overrides.name != '' ? this.overrides.name : this.vendor.name
    )

    const actualInternalName = await infoLocator
      .locator('#vendorattributes_internalname')
      .getAttribute('data-value')
    expect(actualInternalName).toBe(
      this.overrides != null && this.overrides.internalName != ''
        ? this.overrides.internalName
        : this.vendor.internalName
    )

    const actualDisplayEmail = await infoLocator
      .locator('#vendorattributes_displayemail')
      .getAttribute('data-value')
    expect(actualDisplayEmail).toBe(
      this.overrides != null && this.overrides.displayEmail != ''
        ? this.overrides.displayEmail
        : this.vendor.displayEmail
    )

    const actualNotificationEmail = await infoLocator
      .locator('#vendorattributes_notificationemail')
      .getAttribute('data-value')
    expect(actualNotificationEmail).toBe(
      this.overrides != null && this.overrides.notificationEmail != ''
        ? this.overrides.notificationEmail
        : this.vendor.notificationEmail
    )

    const actualDisplayPhone = await infoLocator
      .locator('#vendorattributes_displayphone')
      .getAttribute('data-value')
    const cleanedDisplayPhone = actualDisplayPhone?.split('-').join('')
    expect(cleanedDisplayPhone).toBe(
      this.overrides != null && this.overrides.displayPhone != ''
        ? this.overrides.displayPhone
        : this.vendor.displayPhone
    )

    const actualNotificationPhone = await infoLocator
      .locator('#vendorattributes_notificationphone')
      .getAttribute('data-value')
    const cleanedNotificationPhone = actualNotificationPhone?.split('-').join('')
    expect(cleanedNotificationPhone).toBe(
      this.overrides != null && this.overrides.notificationPhone != ''
        ? this.overrides.notificationPhone
        : this.vendor.notificationPhone
    )

    const actualWebsite = await infoLocator
      .locator('#vendorattributes_website')
      .getAttribute('data-value')
    expect(actualWebsite).toBe(
      this.overrides != null && this.overrides.website != ''
        ? this.overrides.website
        : this.vendor.website
    )

    const actualEnabled = await this.page
      .getByRole('heading', { name: `Vendor Info` })
      .locator('..')
      .locator('span.chakra-badge')
      .textContent()
    const useEnabled =
      this.overrides != null && this.overrides.enabled != null
        ? this.overrides.enabled
        : this.vendor.enabled
    expect.soft(actualEnabled).toBe(useEnabled ? 'Enabled' : 'Disabled')

    if (this.vendor.additionalProperties.length > 0) {
      const propertiesParentLocator = infoLocator
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
        let overrideValue = null
        if (this.overrides != null) {
          overrideValue = FetchValueByKey(this.overrides.additionalProperties, sourceKey)
        }
        const valueToUse = overrideValue != null ? overrideValue : vendorValue
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
          if (actualKey == sourceKey && actualValue == valueToUse) {
            foundMatch = true
            break
          }
        }
        expect(foundMatch).toBe(true)
      }
    }
  }

  async ValidateOriginalValuesThatWereOverriden() {
    if (this.overrides != null) {
      const overridesLocator = this.page.locator(
        '#card_serviceareavendordetail_vendorinfo_overriddenvalues'
      )
      if (this.overrides.name != '') {
        const actualName = await overridesLocator
          .locator('#vendorattributes_name')
          .getAttribute('data-value')
        expect(actualName).toBe(this.vendor.name)
      }
      if (this.overrides.internalName != '') {
        const actualInternalName = await overridesLocator
          .locator('#vendorattributes_internalname')
          .getAttribute('data-value')
        expect(actualInternalName).toBe(this.vendor.internalName)
      }
      if (this.overrides.displayEmail != '') {
        const actualDisplayEmail = await overridesLocator
          .locator('#vendorattributes_displayemail')
          .getAttribute('data-value')
        expect(actualDisplayEmail).toBe(this.vendor.displayEmail)
      }
      if (this.overrides.notificationEmail != '') {
        const actualNotificationEmail = await overridesLocator
          .locator('#vendorattributes_notificationemail')
          .getAttribute('data-value')
        expect(actualNotificationEmail).toBe(this.vendor.notificationEmail)
      }
      if (this.overrides.displayPhone != '') {
        const actualDisplayPhone = await overridesLocator
          .locator('#vendorattributes_displayphone')
          .getAttribute('data-value')
        const cleanedDisplayPhone = actualDisplayPhone?.split('-').join('')
        expect(cleanedDisplayPhone).toBe(this.vendor.displayPhone)
      }
      if (this.overrides.notificationPhone != '') {
        const actualNotificationPhone = await overridesLocator
          .locator('#vendorattributes_notificationphone')
          .getAttribute('data-value')
        const cleanedNotificationPhone = actualNotificationPhone?.split('-').join('')
        expect(cleanedNotificationPhone).toBe(this.vendor.notificationPhone)
      }
      if (this.overrides.website != '') {
        const actualWebsite = await overridesLocator
          .locator('#vendorattributes_website')
          .getAttribute('data-value')
        expect(actualWebsite).toBe(this.vendor.website)
      }
      if (this.overrides.enabled != null) {
        const actualEnabled = await overridesLocator.locator('span.chakra-badge').textContent()
        expect.soft(actualEnabled).toBe(this.overrides.enabled ? 'Disabled' : 'Enabled')
      }
      if (this.overrides.additionalProperties.length > 0) {
        const propertiesParentLocator = overridesLocator
          .getByRole('heading', { name: 'Vendor Additional Properties' })
          .locator('..')
        const actualPropertyCount = await propertiesParentLocator.locator('dt').count()
        expect(this.overrides.additionalProperties.length).toBe(actualPropertyCount)
        // loop through overriden properties and find a match for each original value in the actual overridden properties
        for (
          let sourceIndex = 0;
          sourceIndex < this.overrides.additionalProperties.length;
          sourceIndex++
        ) {
          const sourceKey = this.overrides.additionalProperties[sourceIndex].key
          const originalValue = FetchValueByKey(this.vendor.additionalProperties, sourceKey)
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
            if (actualKey == sourceKey && actualValue == originalValue) {
              foundMatch = true
              break
            }
          }
          expect(foundMatch).toBe(true)
        }
      }
    }
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

  async CopyRuleId(table: ClientPortalDataTable, rowPosition: number) {
    const rowIndex = await table.FetchRowIndexFromRowPosition(rowPosition)
    await table.OpenActionMenu(rowIndex)
    await table.SelectActionMenuItem(VendorRules_DataTable_ActionMenuItems.CopyRuleID)
  }

  async Action_CreateCustomRule(ruleGroup: VendorRuleGroup) {
    await this.Button_Actions.Click()
    await this.page
      .getByRole('menuitem', {
        name: `${AttachedVendors_DataTable_ActionMenuItems.CreateCustomRule}`,
      })
      .click()
    const createVendorRuleDrawer = new ClientPortalCreateVendorRuleDrawer(
      this.global,
      VendorRuleType.Unspecified,
      false
    )
    await createVendorRuleDrawer.FillDrawer(ruleGroup)
    await this.page.waitForTimeout(4000)
  }

  async Action_UpdateVendorOverrides(
    startDate: string | null = null,
    endDate: string | null = null,
    overrides: Vendor
  ) {
    await this.Button_Actions.Click()
    await this.page
      .getByRole('menuitem', {
        name: `${AttachedVendors_DataTable_ActionMenuItems.UpdateVendorOverrides}`,
      })
      .click()
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

  async Action_UpdateRulesFromVendor(ruleGroup: VendorRuleGroup) {
    await this.Button_Actions.Click()
    await this.page
      .getByRole('menuitem', {
        name: `${AttachedVendors_DataTable_ActionMenuItems.UpdateRulesFromVendor}`,
      })
      .click()
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

  async Action_UpdateRulesFromVendor_SelectAll() {
    await this.Button_Actions.Click()
    await this.page
      .getByRole('menuitem', {
        name: `${AttachedVendors_DataTable_ActionMenuItems.UpdateRulesFromVendor}`,
      })
      .click()
    const updateRulesFromVendorDrawer = new ClientPortalUpdateRulesFromVendorDrawer(
      this.global,
      this.vendor
    )
    await updateRulesFromVendorDrawer.Title.locator.waitFor({ state: 'visible' })
    await updateRulesFromVendorDrawer.SelectAllRules()
    await this.page.waitForTimeout(1000)
    await updateRulesFromVendorDrawer.Button_Submit.Click()
    await this.page.waitForTimeout(4000)
  }

  async Action_DetachVendorAndGotoVendor() {
    await this.Button_Actions.Click()
    await this.page
      .getByRole('menuitem', { name: `${AttachedVendors_DataTable_ActionMenuItems.DetachVendor}` })
      .click()
    await this.HandleDetachVendorAlert(false, true)
    await this.page.waitForTimeout(1000)
  }

  async Action_DetachVendorAndGotoServiceArea() {
    await this.Button_Actions.Click()
    await this.page
      .getByRole('menuitem', { name: `${AttachedVendors_DataTable_ActionMenuItems.DetachVendor}` })
      .click()
    await this.HandleDetachVendorAlert(false, false)
    await this.page.waitForTimeout(5000)
  }

  async HandleDetachVendorAlert(cancelDetach = false, gotoVendor = false) {
    const alert = new ClientPortalDetachVendor(this.global)
    if (gotoVendor) {
      await alert.Button_Radio_Vendor.Click()
    } else {
      await alert.Button_Radio_ServiceArea.Click()
    }
    if (cancelDetach) {
      await alert.Button_Close.locator.click({ force: true })
    } else {
      await alert.Button_Confirm.locator.click({ force: true })
    }
  }
}
