import { Locator, expect } from '@playwright/test'
import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { ClaimsPortalBase } from './pages/claimsPortalBase.js'
import { Element } from '../shared/element.js'
import { BadgeTypes, FiltersStrings } from './claimsPortalConstants.js'

export class ClaimsPortalFilters extends ClaimsPortalBase {
  readonly parent: Locator
  readonly rows: Locator
  readonly SpecialAlert: Element
  readonly NoFiltersAlert: Element
  readonly Title: Element
  readonly Badge: Element
  readonly Button_ExpandFilter: Element
  readonly Button_CollapseFilter: Element
  readonly Button_AddFilter: Element
  readonly Button_ClearFilters: Element
  readonly Button_ResetFilters: Element
  readonly Button_SaveFilters: Element

  constructor(global: ClaimsPortalGlobal, title: string, offset = 0) {
    super(global)
    this.parent = this.page.locator('#root div.chakra-accordion__item').nth(offset)
    this.rows = this.parent.locator(`button[aria-label="Remove Row"]`)
    this.Title = new Element(global.page, this.parent.locator('h2'), title)
    this.Badge = new Element(global.page, this.parent.locator('.chakra-badge'))
    this.SpecialAlert = new Element(
      global.page,
      this.parent
        .locator(`div.chakra-stack > div[data-status="info"] div[data-status="info"]`)
        .first()
    )
    this.NoFiltersAlert = new Element(
      global.page,
      this.parent.locator(`form div[data-status="info"] div[data-status="info"]`),
      FiltersStrings.Alert_NoFilters
    )
    this.Button_CollapseFilter = new Element(
      global.page,
      this.parent.locator(`button[id*="accordion-button"][aria-expanded="true"]`)
    )
    this.Button_ExpandFilter = new Element(
      global.page,
      this.parent.locator(`button[id*="accordion-button"][aria-expanded="false"]`)
    )
    this.Button_ResetFilters = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${FiltersStrings.ResetFilters}` }),
      FiltersStrings.ResetFilters
    )
    this.Button_AddFilter = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${FiltersStrings.AddFilter}` }),
      FiltersStrings.AddFilter
    )
    this.Button_ClearFilters = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${FiltersStrings.ClearFilters}` }),
      FiltersStrings.ClearFilters
    )
    this.Button_SaveFilters = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${FiltersStrings.SaveFilters}` }),
      FiltersStrings.SaveFilters
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async IsVisible() {
    return await this.parent.isVisible()
  }

  async IsExpanded() {
    return await this.Button_CollapseFilter.locator.isVisible()
  }

  async AppliedFilterCount() {
    await this.Badge.locator.waitFor({ state: 'visible' })
    const badgeText = (await this.Badge.locator.textContent()) ?? ''
    if (badgeText == undefined) {
      throw new Error('Unable to get badge text')
    }
    const dataList = badgeText?.split(' ')
    return Number(dataList[0])
  }

  async VerifyFilterCountBadge(filterCount: number, badgeSuffix: BadgeTypes) {
    await this.Badge.locator.waitFor({ state: 'visible' })
    await this.Badge.VerifyExpectedText(`${filterCount}${badgeSuffix}`)
  }

  async VerifySpecialAlert(expectedText: string) {
    expect(await this.SpecialAlert.locator.isVisible()).toBe(true)
    await this.SpecialAlert.VerifyExpectedText(expectedText)
  }

  async VerifyNoFilterAlert() {
    await this.NoFiltersAlert.locator.waitFor({ state: 'visible', timeout: 3000 })
    expect(await this.NoFiltersAlert.locator.isVisible()).toBe(true)
    await this.NoFiltersAlert.VerifyExpectedText()
  }

  async RowCount() {
    const isEmpty = (await this.rows.count()) == 0
    if (!isEmpty) {
      await this.rows.nth(0).waitFor({ state: 'visible' })
      return await this.rows.count()
    }
    return 0
  }

  async RemoveFilterAtIndex(index: number) {
    const targetLocator = this.rows.nth(index)
    await targetLocator.click()
  }

  async SelectFilterField(index: number, fieldSelection: string) {
    const selectLocator = this.page.locator(`select[name="filter.${index}.field"]`)
    await selectLocator.selectOption({ label: `${fieldSelection}` })
  }

  async GetSelectedFilterFieldText(index: number) {
    const selectLocator = this.page.locator(`select[name="filter.${index}.field"]`)
    const textContent = await selectLocator.evaluate(
      (node: HTMLSelectElement) => node.options[node.options.selectedIndex].textContent
    )
    return textContent
  }

  async SelectFilterOperator(index: number, operatorSelection: string) {
    const selectLocator = this.page.locator(`select[name="filter.${index}.operator"]`)
    await selectLocator.selectOption({ label: `${operatorSelection}` })
  }

  async GetSelectedFilterOperatorText(index: number) {
    const selectLocator = this.page.locator(`select[name="filter.${index}.operator"]`)
    const textContent = await selectLocator.evaluate(
      (node: HTMLSelectElement) => node.options[node.options.selectedIndex].textContent
    )
    return textContent
  }

  async SetFilterValue(index: number, value: string) {
    const setLocator = this.page.locator(`input[name="filter.${index}.value"]`)
    await setLocator.click()
    await setLocator.fill(value)
  }

  async SelectFilterValue(index: number, valueSelection: string) {
    const selectLocator = this.page.locator(`select[name="filter.${index}.value"]`)
    await selectLocator.selectOption({ label: `${valueSelection}` })
  }

  async GetSelectedFilterValueText(index: number) {
    const selectLocator = this.page.locator(`select[name="filter.${index}.value"]`)
    const textContent = await selectLocator.evaluate(
      (node: HTMLSelectElement) => node.options[node.options.selectedIndex].textContent
    )
    return textContent
  }

  async SetFilterContactValue(contactValue: string) {
    const setLocator = this.page.locator(`#root input[role="combobox"]`).last()
    await setLocator.click()
    await setLocator.fill(contactValue)
    await setLocator.press('Enter')
  }

  async ValidateFilterSelect(index: number) {
    // Validate the filter selection value at row (#index) is in an invalid state and that the error is..
    let filterIsValidated = false
    const inputSelectLocator = this.page.locator(`select[name="filter.${index}.value"]`)
    if ((await inputSelectLocator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await inputSelectLocator.getAttribute('aria-describedby')
      filterIsValidated =
        (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
        FiltersStrings.Filter_InvalidValue
    }
    return filterIsValidated
  }

  async ValidateFilterInput(index: number) {
    // Validate the filter input value at row (#index) is in an invalid state and that the error is..
    let filterIsValidated = false
    const inputTextLocator = this.page.locator(`input[name="filter.${index}.value"]`)
    if ((await inputTextLocator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await inputTextLocator.getAttribute('aria-describedby')
      filterIsValidated =
        (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
        FiltersStrings.Filter_InvalidValue
    }
    return filterIsValidated
  }

  async ValidateFilterCombobox(index: number) {
    // Validate the filter input combobox value at row (#index) is in an invalid state and that the error is..
    let filterIsValidated = false
    const inputSelectLocator = this.page.locator(`input[name="filter.${index}.value"]`)
    const validateLocator = inputSelectLocator.locator('..').locator('..').locator('div').last()
    filterIsValidated = (await validateLocator.textContent()) == FiltersStrings.Filter_InvalidValue
    return filterIsValidated
  }
}
