import { Locator } from 'playwright/test'
import { DataGrid_Column_SortState, DataGrid_Column_Type } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { LookupDataGridColumnInformation } from '../claimsPortalHelper.js'
import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'

export class ClaimsPortalDataGridColumnSettingsPopup extends ClaimsPortalBase {
  readonly columnItemLocator: Locator
  readonly columnItemParentLocator: Locator
  readonly columnsLocator: Locator
  readonly menuItemLocator: Locator
  readonly sortAscendingLocator: Locator
  readonly sortDescendingLocator: Locator
  readonly pinToRightLocator: Locator
  readonly pinToLeftLocator: Locator
  readonly moveToRightLocator: Locator
  readonly moveToLeftLocator: Locator
  readonly parentLocator: Locator
  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parentLocator = this.page.locator('div[data-slot="autocomplete-content"]').first()
    this.menuItemLocator = this.page.locator(`div[data-base-ui-portal] div[data-slot="menu-item"]`)
    this.columnsLocator = this.page.locator(
      'div[data-base-ui-portal] div[data-slot="menu-submenu-trigger"]'
    )
    this.columnItemParentLocator = this.page.locator(
      'div[data-base-ui-portal] div[data-slot="menu-portal"] div[role="menu"]'
    )
    this.columnItemLocator = this.columnItemParentLocator.locator('div[role="menuitemcheckbox"]')
    this.sortAscendingLocator = this.menuItemLocator.getByText('Asc').locator('..')
    this.sortDescendingLocator = this.menuItemLocator.getByText('Desc').locator('..')
    this.pinToLeftLocator = this.menuItemLocator.getByText('Pin to left').locator('..')
    this.pinToRightLocator = this.menuItemLocator.getByText('Pin to right').locator('..')
    this.moveToLeftLocator = this.menuItemLocator.getByText('Move to Left').locator('..')
    this.moveToRightLocator = this.menuItemLocator.getByText('Move to Right').locator('..')
  }

  async SetSortingState(stateToSet: DataGrid_Column_SortState) {
    const isAscSelectedLocator = this.sortAscendingLocator.locator('svg').nth(1)
    const isDescSelectedLocator = this.sortDescendingLocator.locator('svg').nth(1)

    switch (stateToSet) {
      case DataGrid_Column_SortState.Ascending:
        if (!((await isAscSelectedLocator.count()) > 0)) {
          await this.sortAscendingLocator.click()
          break
        } else {
          await this.page.keyboard.press('Escape')
        }
        break
      case DataGrid_Column_SortState.Descending:
        if (!((await isDescSelectedLocator.count()) > 0)) {
          await this.sortDescendingLocator.click()
          break
        } else {
          await this.page.keyboard.press('Escape')
        }
        break
      case DataGrid_Column_SortState.Unsorted:
        if ((await isAscSelectedLocator.count()) > 0) {
          await this.sortAscendingLocator.click()
          break
        }
        if ((await isDescSelectedLocator.count()) > 0) {
          await this.sortDescendingLocator.click()
          break
        }
        await this.page.keyboard.press('Escape')
    }
  }

  async GetSortingState(closeAfterCheck: boolean) {
    const isAscSelectedLocator = this.sortAscendingLocator.locator('svg').nth(1)
    const isDescSelectedLocator = this.sortDescendingLocator.locator('svg').nth(1)
    let returnValue = DataGrid_Column_SortState.Unsorted
    if ((await isAscSelectedLocator.count()) > 0) {
      returnValue = DataGrid_Column_SortState.Ascending
    }
    if ((await isDescSelectedLocator.count()) > 0) {
      returnValue = DataGrid_Column_SortState.Descending
    }
    if (closeAfterCheck) {
      await this.page.keyboard.press('Escape')
    }
    return returnValue
  }

  async MoveToLeft() {
    const { moveToLeftEnabled } = await this.GetMoveMenuItemsState(false)
    if (moveToLeftEnabled) {
      await this.moveToLeftLocator.click()
    }
  }

  async MoveToRight() {
    const { moveToRightEnabled } = await this.GetMoveMenuItemsState(false)
    if (moveToRightEnabled) {
      await this.moveToRightLocator.click()
    }
  }

  async GetMoveMenuItemsState(closeAfterCheck: boolean) {
    const moveToRightLocatorIsEnabled = await this.moveToRightLocator.isEnabled()
    const moveToLeftLocatorIsEnabled = await this.moveToLeftLocator.isEnabled()
    if (closeAfterCheck) {
      await this.page.keyboard.press('Escape')
    }
    return {
      moveToRightEnabled: moveToRightLocatorIsEnabled,
      moveToLeftEnabled: moveToLeftLocatorIsEnabled,
    }
  }

  async PinToLeft() {
    const { pinToLeftChecked } = await this.GetPinMenuItemsState(false)
    if (!pinToLeftChecked) {
      await this.pinToLeftLocator.click()
    }
  }

  async PinToRight() {
    const { pinToRightChecked } = await this.GetPinMenuItemsState(false)
    if (!pinToRightChecked) {
      await this.pinToRightLocator.click()
    }
  }

  async GetPinMenuItemsState(closeAfterCheck: boolean) {
    const isPinToRightCheckedLocator = await this.pinToRightLocator.locator('svg').nth(1)
    const isPinToLeftCheckedLocator = await this.pinToLeftLocator.locator('svg').nth(1)
    const pinToRightLocatorIsChecked = (await isPinToRightCheckedLocator.count()) > 0
    const pinToLeftLocatorIsChecked = (await isPinToLeftCheckedLocator.count()) > 0
    if (closeAfterCheck) {
      await this.page.keyboard.press('Escape')
    }
    return {
      pinToRightChecked: pinToRightLocatorIsChecked,
      pinToLeftChecked: pinToLeftLocatorIsChecked,
    }
  }

  async ShowColumn(columnToShow: DataGrid_Column_Type, closeAfterShow: boolean = false) {
    await this.columnsLocator.focus({})
    await this.page.keyboard.press('ArrowRight')
    await this.columnItemParentLocator.waitFor({ state: 'visible' })
    const columnToShowInfo = LookupDataGridColumnInformation(columnToShow)
    const columnToCheckLocator = this.columnItemLocator.getByText(columnToShowInfo.name)
    const isColumnVisible = await columnToCheckLocator.isChecked()
    if (!isColumnVisible) {
      await columnToCheckLocator.click()
    }
    if (closeAfterShow) {
      await this.page.keyboard.press('Escape')
      await this.page.keyboard.press('Escape')
    }
  }

  async HideColumn(columnToHide: DataGrid_Column_Type, closeAfterHide: boolean) {
    await this.columnsLocator.focus({})
    await this.page.keyboard.press('ArrowRight')
    await this.columnItemParentLocator.waitFor({ state: 'visible' })
    const columnToHideInfo = LookupDataGridColumnInformation(columnToHide)
    const columnToCheckLocator = this.columnItemLocator.getByText(columnToHideInfo.name)
    const isColumnVisible = await columnToCheckLocator.isChecked()
    if (isColumnVisible) {
      await columnToCheckLocator.click()
    }
    if (closeAfterHide) {
      await this.page.keyboard.press('Escape')
      await this.page.keyboard.press('Escape')
    }
  }
}
