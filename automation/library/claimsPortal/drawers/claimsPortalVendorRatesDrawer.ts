import { Locator, expect } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalVendorRates } from '../claimsPortalVendorRates.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalVendorRatesDrawer extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close: Element
  readonly Button_Close_X: Element
  readonly Button_Submit: Element
  readonly Checkbox_IsThisATemplate: Element
  readonly TextBox_VendorRatesName: Element
  readonly Listbox_VendorTemplate: Element
  readonly TextBox_TarpingRates_Mechanical_DuringBusinessHours: Element
  readonly TextBox_TarpingRates_Mechanical_AfterBusinessHours: Element
  readonly TextBox_TarpingRates_Mechanical_MaterialCost: Element
  readonly TextBox_TarpingRates_Sandbag_DuringBusinessHours: Element
  readonly TextBox_TarpingRates_Sandbag_AfterBusinessHours: Element
  readonly TextBox_TarpingRates_Sandbag_MaterialCost: Element
  readonly Button_AddRow: Locator
  readonly parent: Locator
  readonly vendorRates: ClaimsPortalVendorRates | null

  constructor(
    global: ClaimsPortalGlobal,
    isUpdate: boolean,
    vendorRatesToUpdate: ClaimsPortalVendorRates | null = null
  ) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    this.vendorRates = vendorRatesToUpdate
    const titleToUse =
      vendorRatesToUpdate != null && isUpdate == true
        ? `${DrawerStrings.VendorRates_Title_Update}${vendorRatesToUpdate.name}`
        : DrawerStrings.VendorRates_Title_Create
    this.Title = new Element(global.page, this.parent.getByText(titleToUse), titleToUse)
    this.Button_Close = new Element(global.page, this.parent.getByLabel(DrawerStrings.Button_Close))
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label="Close"]`)
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${DrawerStrings.Button_Submit}` })
    )
    this.Checkbox_IsThisATemplate = new Element(
      global.page,
      this.page.locator('input[name="isTemplate"]').locator('..'),
      DrawerStrings.VendorRates_Checkbox_IsThisATemplate
    )
    this.TextBox_VendorRatesName = new Element(global.page, this.parent.locator('input[id="name"]'))
    this.Listbox_VendorTemplate = new Element(
      global.page,
      this.parent.locator(`input[role="combobox"]`).nth(0)
    )
    this.TextBox_TarpingRates_Mechanical_DuringBusinessHours = new Element(
      global.page,
      this.parent.locator('input[id="rates.mechanical.duringBusinessHours"]')
    )
    this.TextBox_TarpingRates_Mechanical_AfterBusinessHours = new Element(
      global.page,
      this.parent.locator('input[id="rates.mechanical.afterBusinessHours"]')
    )
    this.TextBox_TarpingRates_Mechanical_MaterialCost = new Element(
      global.page,
      this.parent.locator('input[id="rates.mechanical.materialCost"]')
    )
    this.TextBox_TarpingRates_Sandbag_DuringBusinessHours = new Element(
      global.page,
      this.parent.locator('input[id="rates.sandbag.duringBusinessHours"]')
    )
    this.TextBox_TarpingRates_Sandbag_AfterBusinessHours = new Element(
      global.page,
      this.parent.locator('input[id="rates.sandbag.afterBusinessHours"]')
    )
    this.TextBox_TarpingRates_Sandbag_MaterialCost = new Element(
      global.page,
      this.parent.locator('input[id="rates.sandbag.materialCost"]')
    )
    this.Button_AddRow = this.parent.locator(`button[aria-label="Add Row"]`)
  }

  async FillVendorRates(vendorRates: ClaimsPortalVendorRates) {
    await this.TextBox_TarpingRates_Mechanical_DuringBusinessHours.Fill(
      vendorRates.mechanicalTarpingRates.duringBusinessHours.toString()
    )
    await this.TextBox_TarpingRates_Mechanical_AfterBusinessHours.Fill(
      vendorRates.mechanicalTarpingRates.afterBusinessHours.toString()
    )
    await this.TextBox_TarpingRates_Mechanical_MaterialCost.Fill(
      vendorRates.mechanicalTarpingRates.materialCost.toString()
    )
    await this.TextBox_TarpingRates_Sandbag_DuringBusinessHours.Fill(
      vendorRates.sandbagTarpingRates.duringBusinessHours.toString()
    )
    await this.TextBox_TarpingRates_Sandbag_AfterBusinessHours.Fill(
      vendorRates.sandbagTarpingRates.afterBusinessHours.toString()
    )
    await this.TextBox_TarpingRates_Sandbag_MaterialCost.Fill(
      vendorRates.sandbagTarpingRates.materialCost.toString()
    )
  }

  async FillVendorRatesFromTemplate(templateName: string) {
    // select template and fill in the the name
    await this.Listbox_VendorTemplate.locator.focus()
    await this.Listbox_VendorTemplate.locator.clear()
    await this.page.keyboard.type(templateName, { delay: 50 })
    await this.page.keyboard.press('Tab')
  }

  async AddVendor(vendorName: string, index: number) {
    await this.Button_AddRow.focus()
    await this.page.waitForTimeout(1000)
    await this.Button_AddRow.click({ force: true })
    await this.page.waitForTimeout(1000)
    const vendorLocator = this.GetVendorListLocatorByRow(index)
    await vendorLocator.focus()
    await vendorLocator.clear()
    await this.page.keyboard.type(vendorName, { delay: 50 })
    await this.page.keyboard.press('Tab')
  }

  async RemoveAllVendors() {
    // remove any existing vendors
    await this.page.waitForTimeout(1000)
    const currentVendorCount = await this.parent.locator('button[aria-label="Remove Row"]').count()
    let runningCount = currentVendorCount
    if (currentVendorCount > 0) {
      do {
        const removeVendorLocator = this.GetRemoveRowButtonLocatorByRow(0)
        await removeVendorLocator.click()
        runningCount = await this.parent.locator('button[aria-label="Remove Row"]').count()
      } while (runningCount > 0)
    }
  }

  async AddVendors(vendorNames: string[]) {
    let index = 0
    for (const vendor of vendorNames) {
      const vendorName = vendor.split(',')[0]
      await this.AddVendor(vendorName, index)
      index++
    }
  }

  async VerifyRatesAndAssignments(vendorRates: ClaimsPortalVendorRates) {
    await this.TextBox_VendorRatesName.VerifyExpectedValue(vendorRates.name)
    await this.TextBox_TarpingRates_Mechanical_DuringBusinessHours.VerifyExpectedValue(
      vendorRates.mechanicalTarpingRates.duringBusinessHours.toString()
    )
    await this.TextBox_TarpingRates_Mechanical_AfterBusinessHours.VerifyExpectedValue(
      vendorRates.mechanicalTarpingRates.afterBusinessHours.toString()
    )
    await this.TextBox_TarpingRates_Mechanical_MaterialCost.VerifyExpectedValue(
      vendorRates.mechanicalTarpingRates.materialCost.toString()
    )
    await this.TextBox_TarpingRates_Sandbag_DuringBusinessHours.VerifyExpectedValue(
      vendorRates.sandbagTarpingRates.duringBusinessHours.toString()
    )
    await this.TextBox_TarpingRates_Sandbag_AfterBusinessHours.VerifyExpectedValue(
      vendorRates.sandbagTarpingRates.afterBusinessHours.toString()
    )
    await this.TextBox_TarpingRates_Sandbag_MaterialCost.VerifyExpectedValue(
      vendorRates.sandbagTarpingRates.materialCost.toString()
    )
  }

  async VerifyVendors(vendorNames: string[]) {
    let index = 0
    for (const vendor of vendorNames) {
      const vendorName = vendor.split(',')[0]
      await this.VerifyVendor(vendorName, index)
      index++
    }
  }

  async VerifyVendor(vendorName: string, index: number) {
    const vendorLabelLocator = this.GetVendorListLabelLocatorByRow(index)
    const actualVendorName = await vendorLabelLocator.innerText()
    expect(vendorName).toBe(actualVendorName)
  }

  async FillAndSubmit() {
    if (this.vendorRates == null) {
      throw new Error('Cannot fill vendor rates - none have been passed into constructor')
    }
    await this.RemoveAllVendors()
    await this.Checkbox_IsThisATemplate.SetChecked(this.vendorRates.isTemplate)
    await this.TextBox_VendorRatesName.Fill(this.vendorRates.name)
    await this.FillVendorRates(this.vendorRates)
    if (!this.vendorRates.isTemplate) {
      await this.AddVendors(this.vendorRates.assignedVendors)
    }
    await this.Button_Submit.Click()
    await this.Title.locator.waitFor({ state: 'detached' })
  }

  async FillFromTemplateAndSubmit(
    templateName: string,
    newVendorRatesName: string,
    vendorsToAssign: string[]
  ) {
    await this.RemoveAllVendors()
    await this.TextBox_VendorRatesName.Fill(newVendorRatesName)
    await this.FillVendorRatesFromTemplate(templateName)
    await this.AddVendors(vendorsToAssign)
    await this.Button_Submit.Click()
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Validate() {
    let vendorRatesNameIsValidated = false
    let tarpingRatesMechanicalDuringBusinessHoursIsValidated = false
    let tarpingRatesMechanicalAfterBusinessHoursIsValidated = false
    let tarpingRatesMechanicalMaterialCostIsValidated = false
    let tarpingRatesSandbagDuringBusinessHoursIsValidated = false
    let tarpingRatesSandbagAfterBusinessHoursIsValidated = false
    let tarpingRatesSandbagMaterialCostIsValidated = false
    let vendorFieldIsValidated = false

    // Validate Vendor Rates Name Field is in an invalid state and that the error is..
    if ((await this.TextBox_VendorRatesName.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId =
        await this.TextBox_VendorRatesName.locator.getAttribute('aria-describedby')
      // "String must contain at least 1 character(s)"
      vendorRatesNameIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidString1
    }

    // Validate Tarping Rates Mechanical During Business Hours Field is in an invalid state and that the error is..
    if (
      (await this.TextBox_TarpingRates_Mechanical_DuringBusinessHours.locator
        .locator('..')
        .locator('..')
        .locator('..')
        .getAttribute('data-invalid')) != null
    ) {
      const referenceId =
        await this.TextBox_TarpingRates_Mechanical_DuringBusinessHours.locator.getAttribute(
          'aria-describedby'
        )
      // "Number must be greater than or equal to 0.01"
      tarpingRatesMechanicalDuringBusinessHoursIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidNumberPoint01
    }

    // Validate Tarping Rates Mechanical After Business Hours Field is in an invalid state and that the error is..
    if (
      (await this.TextBox_TarpingRates_Mechanical_AfterBusinessHours.locator
        .locator('..')
        .locator('..')
        .locator('..')
        .getAttribute('data-invalid')) != null
    ) {
      const referenceId =
        await this.TextBox_TarpingRates_Mechanical_AfterBusinessHours.locator.getAttribute(
          'aria-describedby'
        )
      // "Number must be greater than or equal to 0.01"
      tarpingRatesMechanicalAfterBusinessHoursIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidNumberPoint01
    }

    // Validate Tarping Rates Mechanical Material Cost Field is in an invalid state and that the error is..
    if (
      (await this.TextBox_TarpingRates_Mechanical_MaterialCost.locator
        .locator('..')
        .locator('..')
        .locator('..')
        .getAttribute('data-invalid')) != null
    ) {
      const referenceId =
        await this.TextBox_TarpingRates_Mechanical_MaterialCost.locator.getAttribute(
          'aria-describedby'
        )
      // "Number must be greater than or equal to 0.01"
      tarpingRatesMechanicalMaterialCostIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidNumberPoint01
    }

    // Validate Tarping Rates Sandbag During Business Hours Field is in an invalid state and that the error is..
    if (
      (await this.TextBox_TarpingRates_Sandbag_DuringBusinessHours.locator
        .locator('..')
        .locator('..')
        .locator('..')
        .getAttribute('data-invalid')) != null
    ) {
      const referenceId =
        await this.TextBox_TarpingRates_Sandbag_DuringBusinessHours.locator.getAttribute(
          'aria-describedby'
        )
      // "Number must be greater than or equal to 0.01"
      tarpingRatesSandbagDuringBusinessHoursIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidNumberPoint01
    }

    // Validate Tarping Rates Sandbag After Business Hours Field is in an invalid state and that the error is..
    if (
      (await this.TextBox_TarpingRates_Sandbag_AfterBusinessHours.locator
        .locator('..')
        .locator('..')
        .locator('..')
        .getAttribute('data-invalid')) != null
    ) {
      const referenceId =
        await this.TextBox_TarpingRates_Sandbag_AfterBusinessHours.locator.getAttribute(
          'aria-describedby'
        )
      // "Number must be greater than or equal to 0.01"
      tarpingRatesSandbagAfterBusinessHoursIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidNumberPoint01
    }

    // Validate Tarping Rates Sandbag Material Cost Field is in an invalid state and that the error is..
    if (
      (await this.TextBox_TarpingRates_Sandbag_MaterialCost.locator
        .locator('..')
        .locator('..')
        .locator('..')
        .getAttribute('data-invalid')) != null
    ) {
      const referenceId =
        await this.TextBox_TarpingRates_Sandbag_MaterialCost.locator.getAttribute(
          'aria-describedby'
        )
      // "Number must be greater than or equal to 0.01"
      tarpingRatesSandbagMaterialCostIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidNumberPoint01
    }

    // Validate Vendor Field is in an invalid state and that the error is..
    // "At least one vendor is required"
    vendorFieldIsValidated =
      (await this.parent.locator(`form div[id*="field"]`).last().textContent()) ==
      ValidationStrings.AtLeastOneVendorIsRequired

    return (
      vendorRatesNameIsValidated &&
      tarpingRatesMechanicalDuringBusinessHoursIsValidated &&
      tarpingRatesMechanicalAfterBusinessHoursIsValidated &&
      tarpingRatesMechanicalMaterialCostIsValidated &&
      tarpingRatesSandbagDuringBusinessHoursIsValidated &&
      tarpingRatesSandbagAfterBusinessHoursIsValidated &&
      tarpingRatesSandbagMaterialCostIsValidated &&
      vendorFieldIsValidated
    )
  }

  async ValidateEmptyVendor() {
    let missingVendorIsValidated = false

    // Validate missing vendor produces an invalid state and that the error is..
    // "At least one vendor is required"
    missingVendorIsValidated =
      (await this.parent.locator(`form div[id*="field"]`).last().textContent()) ==
      ValidationStrings.AtLeastOneVendorIsRequired

    return missingVendorIsValidated
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }

  GetVendorListLocatorByRow(rowIndex: number) {
    const theLocator = this.parent
      .locator(`label[for="vendors.${rowIndex}.contact"]`)
      .locator('..')
      .locator('input[role="combobox"]')
    return theLocator
  }

  GetVendorListLabelLocatorByRow(rowIndex: number) {
    const theLocator = this.parent
      .locator(`label[for="vendors.${rowIndex}.contact"]`)
      .locator('..')
      .locator('div > div > div > div')
    return theLocator
  }

  GetVendorListClearOptionsButtonLocatorByRow(rowIndex: number) {
    const theLocator = this.parent
      .locator(`label[for="vendors.${rowIndex}.contact"]`)
      .locator('..')
      .locator('button[aria-label="Clear selected options"]')
    return theLocator
  }

  GetRemoveRowButtonLocatorByRow(rowIndex: number) {
    const theLocator = this.parent
      .locator(`label[for="vendors.${rowIndex}.contact"]`)
      .locator('..')
      .locator('..')
      .locator('button[aria-label="Remove Row"]')
    return theLocator
  }
}
