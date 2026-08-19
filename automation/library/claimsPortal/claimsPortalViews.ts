import { Locator, expect } from '@playwright/test'
import { Element } from '../shared/element.js'
import { ClaimsPortalDeleteAlert } from './alerts/claimsPortalDeleteAlert.js'
import { AlertStrings, ViewIncludes, ViewTypes, ViewsStrings } from './claimsPortalConstants.js'
import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { ClaimsPortalView } from './claimsPortalView.js'
import { ClaimsPortalBase } from './pages/claimsPortalBase.js'

export class ClaimsPortalViews extends ClaimsPortalBase {
  readonly parent: Locator
  readonly parentPersonal: Locator
  readonly parentGlobal: Locator
  readonly personalCreatedViews: Locator
  readonly globalCreatedViews: Locator
  readonly NoPersonalViewsAlert: Element
  readonly Title: Element
  readonly Button_ExpandFilter: Element
  readonly Button_CollapseFilter: Element
  readonly Button_CreateNewView: Element
  readonly Button_NewView_Cancel: Element
  readonly Button_NewView_SaveView: Element
  readonly TextBox_NewView_Title: Element
  readonly TextBox_NewView_Description: Element
  readonly Button_Radio_NewView_Type_Personal: Element
  readonly Button_Radio_NewView_Type_Global: Element
  readonly Checkbox_NewView_Include_ColumnOrder: Element
  readonly Checkbox_NewView_Include_ColumnPinning: Element
  readonly Checkbox_NewView_Include_ColumnVisibility: Element
  readonly Checkbox_NewView_Include_Filters: Element
  readonly Checkbox_NewView_Include_Sorting: Element
  readonly Button_GlobalView_Reset: Element
  readonly Button_GlobalView_DefaultFilter: Element
  readonly Button_GlobalView_UnassignedClaimsPortal: Element

  constructor(global: ClaimsPortalGlobal, title: string, offset = 0) {
    super(global)
    this.parent = this.page.locator('#root div.chakra-accordion__item').nth(offset)
    this.parentPersonal = this.parent.locator('div[role="region"] > div > div > div:nth-of-type(1)')
    this.parentGlobal = this.parent.locator('div[role="region"] > div > div > div:nth-of-type(2)')
    this.personalCreatedViews = this.parentPersonal.locator(`button[aria-label="Remove view"]`)
    this.globalCreatedViews = this.parentGlobal.locator(`button[aria-label="Remove view"]`)
    this.Title = new Element(global.page, this.parent.locator('h2'), title)
    this.NoPersonalViewsAlert = new Element(
      global.page,
      this.parent.locator(`div[data-status="info"] div[data-status="info"]`),
      ViewsStrings.Alert_NoPersonalViews
    )
    this.Button_CollapseFilter = new Element(
      global.page,
      this.parent.locator(`button[id*="accordion-button"][aria-expanded="true"]`)
    )
    this.Button_ExpandFilter = new Element(
      global.page,
      this.parent.locator(`button[id*="accordion-button"][aria-expanded="false"]`)
    )
    this.Button_CreateNewView = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${ViewsStrings.CreateNewView}` }),
      ViewsStrings.CreateNewView
    )
    this.Button_NewView_Cancel = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${ViewsStrings.Cancel}` }),
      ViewsStrings.Cancel
    )
    this.Button_NewView_SaveView = new Element(
      global.page,
      this.parent.getByRole('button', { name: `${ViewsStrings.SaveView}` }),
      ViewsStrings.SaveView
    )
    this.TextBox_NewView_Title = new Element(
      global.page,
      this.parent.locator(`input[name="${ViewsStrings.NewView_Title}"]`)
    )
    this.TextBox_NewView_Description = new Element(
      global.page,
      this.parent.locator(`input[name="${ViewsStrings.NewView_Description}"]`)
    )
    this.Button_Radio_NewView_Type_Global = new Element(
      global.page,
      this.parent.getByRole('radiogroup').locator('div > label:nth-child(1) >span:nth-child(3)')
    )
    this.Button_Radio_NewView_Type_Personal = new Element(
      global.page,
      this.parent.getByRole('radiogroup').locator('div > label:nth-child(2) >span:nth-child(3)')
    )
    this.Checkbox_NewView_Include_ColumnOrder = new Element(
      global.page,
      this.parent
        .locator('label')
        .filter({ hasText: `${ViewsStrings.Include_ColumnOrder}` })
        .locator('span')
        .first()
    )
    this.Checkbox_NewView_Include_ColumnPinning = new Element(
      global.page,
      this.parent
        .locator('label')
        .filter({ hasText: `${ViewsStrings.Include_ColumnPinning}` })
        .locator('span')
        .first()
    )
    this.Checkbox_NewView_Include_ColumnVisibility = new Element(
      global.page,
      this.parent
        .locator('label')
        .filter({ hasText: `${ViewsStrings.Include_ColumnVisibility}` })
        .locator('span')
        .first()
    )
    this.Checkbox_NewView_Include_Filters = new Element(
      global.page,
      this.parent
        .locator('label')
        .filter({ hasText: `${ViewsStrings.Include_Filters}` })
        .locator('span')
        .first()
    )
    this.Checkbox_NewView_Include_Sorting = new Element(
      global.page,
      this.parent
        .locator('label')
        .filter({ hasText: `${ViewsStrings.Include_Sorting}` })
        .locator('span')
        .first()
    )
    this.Button_GlobalView_Reset = new Element(
      global.page,
      this.parentGlobal.getByRole('button', { name: `${ViewsStrings.View_Global_Reset}` }),
      ViewsStrings.View_Global_Reset
    )
    this.Button_GlobalView_DefaultFilter = new Element(
      global.page,
      this.parentGlobal.getByRole('button', { name: `${ViewsStrings.View_Global_Default}` }),
      ViewsStrings.View_Global_Default
    )
    this.Button_GlobalView_UnassignedClaimsPortal = new Element(
      global.page,
      this.parentGlobal.getByRole('button', { name: `${ViewsStrings.View_Global_Unassigned}` }),
      ViewsStrings.View_Global_Unassigned
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

  async VerifyNoPersonalViewsAlert() {
    expect(await this.NoPersonalViewsAlert.locator.isVisible()).toBe(true)
    await this.NoPersonalViewsAlert.VerifyExpectedText()
  }

  async PersonalViewCount() {
    await this.page.waitForTimeout(1000)
    const isEmpty = await this.NoPersonalViewsAlert.locator.isVisible()
    return isEmpty ? 0 : await this.personalCreatedViews.count()
  }

  async GlobalViewCount() {
    await this.page.waitForTimeout(1000)
    return await this.globalCreatedViews.count()
  }

  async ValidateNewView() {
    let newViewTitleIsValidated = false
    const titleLocator = this.TextBox_NewView_Title.locator
    if ((await titleLocator.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await titleLocator.getAttribute('aria-describedby')
      newViewTitleIsValidated =
        (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
        ViewsStrings.View_Title_InvalidValue
    }

    let newViewTypeIsValidated = false
    const typeLocator = this.parent.locator('div[data-invalid]').nth(1).locator('div:nth-child(3)')
    newViewTypeIsValidated =
      (await typeLocator.textContent()) == ViewsStrings.View_Type_InvalidValue
    return newViewTitleIsValidated && newViewTypeIsValidated
  }

  async FindExistingView(viewType: ViewTypes, targetText: string) {
    const typeTargetParent =
      viewType == ViewTypes.Personal ? this.parentPersonal : this.parentGlobal
    const buttonList = await typeTargetParent.locator(`button`).all()
    if (buttonList.length > 0) {
      for (let index = 0; index < buttonList.length; index++) {
        const buttonText = await buttonList[index].textContent()
        if (buttonText?.startsWith(targetText)) {
          return true
        }
      }
    }
    return false
  }

  async ClickExistingView(viewType: ViewTypes, targetText: string) {
    const typeTargetParent =
      viewType == ViewTypes.Personal ? this.parentPersonal : this.parentGlobal
    const buttonList = await typeTargetParent.locator(`button`).all()
    if (buttonList.length == 0) {
      return
    }
    for (let index = 0; index < buttonList.length; index++) {
      const buttonText = await buttonList[index].textContent()
      if (buttonText?.startsWith(targetText)) {
        await buttonList[index].click()
        await this.page.waitForTimeout(1000)
      }
    }
  }

  async DeleteExistingView(viewType: ViewTypes, targetText: string) {
    const typeTargetParent =
      viewType == ViewTypes.Personal ? this.parentPersonal : this.parentGlobal
    const buttonList = await typeTargetParent.locator(`button`).all()
    if (buttonList.length == 0) {
      return
    }
    for (let index = 0; index < buttonList.length; index++) {
      const buttonText = await buttonList[index].textContent()
      if (buttonText?.startsWith(targetText)) {
        const deleteButtonLocator = buttonList[index]
          .locator('..')
          .locator('button[aria-label="Remove view"]')
        await deleteButtonLocator.click()
        await this.HandleDeleteViewAlert()
        await this.page.waitForTimeout(1000)
        return
      }
    }
  }

  async HandleDeleteViewAlert(cancelDelete = false) {
    const alert = new ClaimsPortalDeleteAlert(
      this.global,
      AlertStrings.DeleteView_Title,
      AlertStrings.DeleteView_Description
    )
    if (cancelDelete) {
      await alert.Button_Close.locator.click({ force: true })
    } else {
      await alert.Button_Delete.locator.click({ force: true })
    }
  }

  async GenerateNewView(viewToAdd: ClaimsPortalView) {
    await this.Button_CreateNewView.Click()
    await this.TextBox_NewView_Title.Fill(viewToAdd.title)
    await this.TextBox_NewView_Description.Fill(viewToAdd.description)
    if (viewToAdd.type == ViewTypes.Personal) {
      await this.Button_Radio_NewView_Type_Personal.Click()
    } else {
      await this.Button_Radio_NewView_Type_Global.Click()
    }
    await this.Checkbox_NewView_Include_ColumnOrder.SetChecked(
      viewToAdd.HasViewInclude(ViewIncludes.ColumnOrder)
    )
    await this.Checkbox_NewView_Include_ColumnPinning.SetChecked(
      viewToAdd.HasViewInclude(ViewIncludes.ColumnPinning)
    )
    await this.Checkbox_NewView_Include_ColumnVisibility.SetChecked(
      viewToAdd.HasViewInclude(ViewIncludes.ColumnVisibility)
    )
    await this.Checkbox_NewView_Include_Filters.SetChecked(
      viewToAdd.HasViewInclude(ViewIncludes.Filters)
    )
    await this.Checkbox_NewView_Include_Sorting.SetChecked(
      viewToAdd.HasViewInclude(ViewIncludes.Sorting)
    )
    await this.Button_NewView_SaveView.Click()
    await this.page.waitForTimeout(1000)
  }
}
