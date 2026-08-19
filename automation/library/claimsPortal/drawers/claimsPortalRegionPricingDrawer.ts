import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalRegionRate } from '../claimsPortalRegionRate.js'

export class ClaimsPortalRegionPricingDrawer extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close: Element
  readonly Button_Close_X: Element
  readonly Button_Submit: Element
  readonly TextBox_RegionName: Element
  readonly TextBox_SurtaxRate: Element
  readonly TextBox_BaseRates_DuringBusinessHours: Element
  readonly TextBox_BaseRates_AfterBusinessHours: Element
  readonly TextBox_RoofPitchRates_Under7_12: Element
  readonly TextBox_RoofPitchRates_7_12To9_12: Element
  readonly TextBox_RoofPitchRates_10_12To12_12: Element
  readonly TextBox_RoofPitchRates_Over12And12: Element
  readonly TextBox_RoofPitchRates_HighRoofRate: Element
  readonly TextBox_TarpingRates_Mechanical_DuringBusinessHours: Element
  readonly TextBox_TarpingRates_Mechanical_AfterBusinessHours: Element
  readonly TextBox_TarpingRates_Mechanical_MaterialCost: Element
  readonly TextBox_TarpingRates_Sandbag_DuringBusinessHours: Element
  readonly TextBox_TarpingRates_Sandbag_AfterBusinessHours: Element
  readonly TextBox_TarpingRates_Sandbag_MaterialCost: Element
  readonly parent: Locator

  constructor(global: ClaimsPortalGlobal, isUpdate: boolean = false) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    const titleToUse = isUpdate
      ? DrawerStrings.RegionPricing_Title_Update
      : DrawerStrings.RegionPricing_Title_Create
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
    this.TextBox_RegionName = new Element(global.page, this.parent.locator('input[id="name"]'))
    this.TextBox_SurtaxRate = new Element(
      global.page,
      this.parent.locator('input[id="regionRates.surtax"]')
    )
    this.TextBox_BaseRates_DuringBusinessHours = new Element(
      global.page,
      this.parent.locator('input[id="regionRates.baseRate.duringBusinessHours"]')
    )
    this.TextBox_BaseRates_AfterBusinessHours = new Element(
      global.page,
      this.parent.locator('input[id="regionRates.baseRate.afterBusinessHours"]')
    )
    this.TextBox_RoofPitchRates_Under7_12 = new Element(
      global.page,
      this.parent.locator('input[id="regionRates.roofPitch.07_12AndUnder"]')
    )
    this.TextBox_RoofPitchRates_7_12To9_12 = new Element(
      global.page,
      this.parent.locator('input[id="regionRates.roofPitch.07_12To09_12"]')
    )
    this.TextBox_RoofPitchRates_10_12To12_12 = new Element(
      global.page,
      this.parent.locator('input[id="regionRates.roofPitch.10_12To12_12"]')
    )
    this.TextBox_RoofPitchRates_Over12And12 = new Element(
      global.page,
      this.parent.locator('input[id="regionRates.roofPitch.over12_12"]')
    )
    this.TextBox_RoofPitchRates_HighRoofRate = new Element(
      global.page,
      this.parent.locator('input[id="regionRates.highRoof"]')
    )
    this.TextBox_TarpingRates_Mechanical_DuringBusinessHours = new Element(
      global.page,
      this.parent.locator('input[id="regionRates.tarping.mechanical.duringBusinessHours"]')
    )
    this.TextBox_TarpingRates_Mechanical_AfterBusinessHours = new Element(
      global.page,
      this.parent.locator('input[id="regionRates.tarping.mechanical.afterBusinessHours"]')
    )
    this.TextBox_TarpingRates_Mechanical_MaterialCost = new Element(
      global.page,
      this.parent.locator('input[id="regionRates.tarping.mechanical.materialCost"]')
    )
    this.TextBox_TarpingRates_Sandbag_DuringBusinessHours = new Element(
      global.page,
      this.parent.locator('input[id="regionRates.tarping.sandbag.duringBusinessHours"]')
    )
    this.TextBox_TarpingRates_Sandbag_AfterBusinessHours = new Element(
      global.page,
      this.parent.locator('input[id="regionRates.tarping.sandbag.afterBusinessHours"]')
    )
    this.TextBox_TarpingRates_Sandbag_MaterialCost = new Element(
      global.page,
      this.parent.locator('input[id="regionRates.tarping.sandbag.materialCost"]')
    )
  }

  async FillRegionRate(regionRate: ClaimsPortalRegionRate) {
    await this.TextBox_RegionName.Fill(regionRate.name)
    if (regionRate.surtax != null) {
      await this.TextBox_SurtaxRate.Fill(regionRate.surtax.toString())
    }
    await this.TextBox_BaseRates_DuringBusinessHours.Fill(
      regionRate.baseRates.duringBusinessHours.toString()
    )
    await this.TextBox_BaseRates_AfterBusinessHours.Fill(
      regionRate.baseRates.afterBusinessHours.toString()
    )
    if (regionRate.roofPitchRates.under7_12 != null) {
      await this.TextBox_RoofPitchRates_Under7_12.Fill(
        regionRate.roofPitchRates.under7_12.toString()
      )
    }
    if (regionRate.roofPitchRates.between7_12and9_12 != null) {
      await this.TextBox_RoofPitchRates_7_12To9_12.Fill(
        regionRate.roofPitchRates.between7_12and9_12.toString()
      )
    }
    if (regionRate.roofPitchRates.between10_12and12_12 != null) {
      await this.TextBox_RoofPitchRates_10_12To12_12.Fill(
        regionRate.roofPitchRates.between10_12and12_12.toString()
      )
    }
    if (regionRate.roofPitchRates.over12_12 != null) {
      await this.TextBox_RoofPitchRates_Over12And12.Fill(
        regionRate.roofPitchRates.over12_12.toString()
      )
    }
    if (regionRate.roofPitchRates.highRoof != null) {
      await this.TextBox_RoofPitchRates_HighRoofRate.Fill(
        regionRate.roofPitchRates.highRoof.toString()
      )
    }
    await this.TextBox_TarpingRates_Mechanical_DuringBusinessHours.Fill(
      regionRate.mechanicalTarpingRates.duringBusinessHours.toString()
    )
    await this.TextBox_TarpingRates_Mechanical_AfterBusinessHours.Fill(
      regionRate.mechanicalTarpingRates.afterBusinessHours.toString()
    )
    await this.TextBox_TarpingRates_Mechanical_MaterialCost.Fill(
      regionRate.mechanicalTarpingRates.materialCost.toString()
    )
    await this.TextBox_TarpingRates_Sandbag_DuringBusinessHours.Fill(
      regionRate.sandbagTarpingRates.duringBusinessHours.toString()
    )
    await this.TextBox_TarpingRates_Sandbag_AfterBusinessHours.Fill(
      regionRate.sandbagTarpingRates.afterBusinessHours.toString()
    )
    await this.TextBox_TarpingRates_Sandbag_MaterialCost.Fill(
      regionRate.sandbagTarpingRates.materialCost.toString()
    )
  }

  async VerifyRegionRate(regionRate: ClaimsPortalRegionRate) {
    await this.TextBox_RegionName.VerifyExpectedValue(regionRate.name)
    if (regionRate.surtax != null) {
      await this.TextBox_SurtaxRate.VerifyExpectedValue(regionRate.surtax.toString())
    } else {
      await this.TextBox_SurtaxRate.VerifyExpectedValue('')
    }
    await this.TextBox_BaseRates_DuringBusinessHours.VerifyExpectedValue(
      regionRate.baseRates.duringBusinessHours.toString()
    )
    await this.TextBox_BaseRates_AfterBusinessHours.VerifyExpectedValue(
      regionRate.baseRates.afterBusinessHours.toString()
    )
    if (regionRate.roofPitchRates.under7_12 != null) {
      await this.TextBox_RoofPitchRates_Under7_12.VerifyExpectedValue(
        regionRate.roofPitchRates.under7_12.toString()
      )
    } else {
      await this.TextBox_RoofPitchRates_Under7_12.VerifyExpectedValue('')
    }
    if (regionRate.roofPitchRates.between7_12and9_12 != null) {
      await this.TextBox_RoofPitchRates_7_12To9_12.VerifyExpectedValue(
        regionRate.roofPitchRates.between7_12and9_12.toString()
      )
    } else {
      await this.TextBox_RoofPitchRates_7_12To9_12.VerifyExpectedValue('')
    }
    if (regionRate.roofPitchRates.between10_12and12_12 != null) {
      await this.TextBox_RoofPitchRates_10_12To12_12.VerifyExpectedValue(
        regionRate.roofPitchRates.between10_12and12_12.toString()
      )
    } else {
      await this.TextBox_RoofPitchRates_10_12To12_12.VerifyExpectedValue('')
    }
    if (regionRate.roofPitchRates.over12_12 != null) {
      await this.TextBox_RoofPitchRates_Over12And12.VerifyExpectedValue(
        regionRate.roofPitchRates.over12_12.toString()
      )
    } else {
      await this.TextBox_RoofPitchRates_Over12And12.VerifyExpectedValue('')
    }
    if (regionRate.roofPitchRates.highRoof != null) {
      await this.TextBox_RoofPitchRates_HighRoofRate.VerifyExpectedValue(
        regionRate.roofPitchRates.highRoof.toString()
      )
    } else {
      await this.TextBox_RoofPitchRates_HighRoofRate.VerifyExpectedValue('')
    }
    await this.TextBox_TarpingRates_Mechanical_DuringBusinessHours.VerifyExpectedValue(
      regionRate.mechanicalTarpingRates.duringBusinessHours.toString()
    )
    await this.TextBox_TarpingRates_Mechanical_AfterBusinessHours.VerifyExpectedValue(
      regionRate.mechanicalTarpingRates.afterBusinessHours.toString()
    )
    await this.TextBox_TarpingRates_Mechanical_MaterialCost.VerifyExpectedValue(
      regionRate.mechanicalTarpingRates.materialCost.toString()
    )
    await this.TextBox_TarpingRates_Sandbag_DuringBusinessHours.VerifyExpectedValue(
      regionRate.sandbagTarpingRates.duringBusinessHours.toString()
    )
    await this.TextBox_TarpingRates_Sandbag_AfterBusinessHours.VerifyExpectedValue(
      regionRate.sandbagTarpingRates.afterBusinessHours.toString()
    )
    await this.TextBox_TarpingRates_Sandbag_MaterialCost.VerifyExpectedValue(
      regionRate.sandbagTarpingRates.materialCost.toString()
    )
  }

  async FillAndSubmit(regionRate: ClaimsPortalRegionRate) {
    await this.FillRegionRate(regionRate)
    await this.Button_Submit.Click()
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async Validate() {
    let regionNameIsValidated = false
    let baseRatesDuringBusinessHoursIsValidated = false
    let baseRatesAfterBusinessHoursIsValidated = false
    let tarpingRatesMechanicalDuringBusinessHoursIsValidated = false
    let tarpingRatesMechanicalAfterBusinessHoursIsValidated = false
    let tarpingRatesMechanicalMaterialCostIsValidated = false
    let tarpingRatesSandbagDuringBusinessHoursIsValidated = false
    let tarpingRatesSandbagAfterBusinessHoursIsValidated = false
    let tarpingRatesSandbagMaterialCostIsValidated = false

    // Validate Region Name Field is in an invalid state and that the error is..
    if ((await this.TextBox_RegionName.locator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.TextBox_RegionName.locator.getAttribute('aria-describedby')
      // "String must contain at least 1 character(s)"
      regionNameIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidString1
    }

    // Validate Base Rates During Business Hours Field is in an invalid state and that the error is..
    if (
      (await this.TextBox_BaseRates_DuringBusinessHours.locator
        .locator('..')
        .locator('..')
        .locator('..')
        .getAttribute('data-invalid')) != null
    ) {
      const referenceId =
        await this.TextBox_BaseRates_DuringBusinessHours.locator.getAttribute('aria-describedby')
      // "Number must be greater than or equal to 1"
      baseRatesDuringBusinessHoursIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidNumberPoint01
    }

    // Validate Base Rates After Business Hours Field is in an invalid state and that the error is..
    if (
      (await this.TextBox_BaseRates_AfterBusinessHours.locator
        .locator('..')
        .locator('..')
        .locator('..')
        .getAttribute('data-invalid')) != null
    ) {
      const referenceId =
        await this.TextBox_BaseRates_AfterBusinessHours.locator.getAttribute('aria-describedby')
      // "Number must be greater than or equal to 1"
      baseRatesAfterBusinessHoursIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidNumberPoint01
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
      // "Number must be greater than or equal to 1"
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
      // "Number must be greater than or equal to 1"
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
      // "Number must be greater than or equal to 1"
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
      // "Number must be greater than or equal to 1"
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
      // "Number must be greater than or equal to 1"
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
      // "Number must be greater than or equal to 1"
      tarpingRatesSandbagMaterialCostIsValidated =
        (await this.page.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.InvalidNumberPoint01
    }

    return (
      regionNameIsValidated &&
      baseRatesDuringBusinessHoursIsValidated &&
      baseRatesAfterBusinessHoursIsValidated &&
      tarpingRatesMechanicalDuringBusinessHoursIsValidated &&
      tarpingRatesMechanicalAfterBusinessHoursIsValidated &&
      tarpingRatesMechanicalMaterialCostIsValidated &&
      tarpingRatesSandbagDuringBusinessHoursIsValidated &&
      tarpingRatesSandbagAfterBusinessHoursIsValidated &&
      tarpingRatesSandbagMaterialCostIsValidated
    )
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
