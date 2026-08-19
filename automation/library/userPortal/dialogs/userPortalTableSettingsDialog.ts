import { Locator } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { UserPortalBase } from '../pages/userPortalBase.js'
import { UserPortalGlobal } from '../userPortalGlobal.js'
import {
  DataTable_ColumnName_Index,
  DataTable_Columns_Type,
  DialogStrings,
} from '../userPortalConstants.js'
import { LookupDataColumn } from '../userPortalHelper.js'

export class UserPortalTableSettingsDialog extends UserPortalBase {
  readonly Button_Close: Element
  readonly Title: Element
  readonly Description: Element
  readonly columns: Locator

  constructor(global: UserPortalGlobal) {
    super(global)
    this.Button_Close = new Element(
      global.page,
      this.page.locator(`section[id*='popover-content'] button[aria-label='Close']`)
    )
    this.Title = new Element(
      global.page,
      this.page.locator(`header[id*='popover-header']`),
      DialogStrings.TableSettings_Title
    )
    this.Description = new Element(
      global.page,
      this.page.locator(`div[id*='popover-body'] p`),
      DialogStrings.TableSettings_Description
    )
    this.columns = this.page.locator('span[data-checked] span')
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async VerifyDescription() {
    await this.Description.VerifyExpectedText()
  }

  async CheckColumn(column: DataTable_Columns_Type) {
    const mylocator = this.page
      .locator('div[id*="popover-body"]')
      .locator(`label :text-is("${LookupDataColumn(column, DataTable_ColumnName_Index.Column)}")`)
      .locator('..')
      .locator('..')
      .locator('..')
      .locator('label')
      .locator('input')
    await mylocator.focus()
    await this.page.keyboard.press('Space')
  }

  async UncheckColumn(column: DataTable_Columns_Type) {
    const locator = this.page
      .locator(`label :text-is("${LookupDataColumn(column, DataTable_ColumnName_Index.Column)}")`)
      .locator('..')
      .locator('..')
      .locator('..')
      .locator('label[data-checked]')

    const isChecked = (await locator.count()) > 0
    if (isChecked) {
      await locator.focus()
      await this.page.keyboard.press('Space')
    }
  }

  async DragAndDropColumnByName(sourceColumnName: string, targetColumnName: string) {
    const source = `label :text-is("${sourceColumnName}")`
    const target = `label :text-is("${targetColumnName}")`
    const foo = this.page.locator(source)
    // const countFoo =
    await foo.count()
    const sourceDragPoint = this.page
      .locator(source)
      .locator('..')
      .locator('..')
      .locator('..')
      .locator('..')
      .locator(`button[draggable="true"]`)
    // const sourceCount =
    await sourceDragPoint.count()
    const targetDropPoint = this.page.locator(target)
    // const targetCount =
    await targetDropPoint.count()
    await sourceDragPoint.dragTo(targetDropPoint)
    await this.page.waitForTimeout(1000)
  }

  async DragAndDropColumn(
    sourceColumn: DataTable_Columns_Type,
    targetColumn: DataTable_Columns_Type
  ) {
    const source = `label :text-is("${LookupDataColumn(
      sourceColumn,
      DataTable_ColumnName_Index.Column
    )}")`
    const target = `label :text-is("${LookupDataColumn(
      targetColumn,
      DataTable_ColumnName_Index.Column
    )}")`
    const sourceDragPoint = this.page
      .locator(source)
      .locator('..')
      .locator('..')
      .locator('..')
      .locator('..')
      .locator(`button[draggable="true"]`)
    // const sourceCount =
    await sourceDragPoint.count()
    const targetDropPoint = this.page.locator(target)
    // const targetCount =
    await targetDropPoint.count()
    await sourceDragPoint.dragTo(targetDropPoint)
    await this.page.waitForTimeout(1000)
  }

  async GetNthCheckbox(index: number, expectedIndex: number = 0) {
    const spanLocator = this.columns.nth(index)
    const text = await spanLocator.textContent()
    const columnMatches: number[] = []
    const MyEnumCount = Object.keys(DataTable_Columns_Type)
      .map((val) => Number(isNaN(Number(val))))
      .reduce((a, b) => a + b, 0)
    for (let count = 0; count < MyEnumCount - 1; count++) {
      const valueOfFilter = LookupDataColumn(count, DataTable_ColumnName_Index.Column)
      if (valueOfFilter == text) {
        columnMatches.push(count)
      }
    }
    if (columnMatches.length > 0) {
      return DataTable_Columns_Type[columnMatches[expectedIndex]]
    }
    throw new Error('What happened here!!!')
  }

  async GetNthCheckboxName(index: number) {
    const spanLocator = this.columns.nth(index)
    const text = await spanLocator.textContent()
    return text == null ? 'error' : text
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close.Click()
    }
  }
}
