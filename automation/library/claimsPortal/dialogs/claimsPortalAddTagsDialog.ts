import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { Locator } from 'playwright/test'
import { ValidationStrings } from '../claimsPortalConstants.js'

export class ClaimsPortalAddTagsDialog extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_AddAndAddAnother: Element
  readonly Button_AddAndClose: Element
  readonly parent: Locator
  readonly keyParent: Locator
  readonly key: Locator
  readonly keyStoredValue: Locator
  readonly clearKey: Locator
  readonly valueParent: Locator
  readonly value: Locator
  readonly valueStoredValue: Locator
  readonly clearValue: Locator
  readonly color: Locator

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.parent = this.page.locator(`section[id*='chakra-modal']`)
    this.Title = new Element(global.page, this.parent.locator(`header`), `Add Tags`)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.keyParent = this.parent.locator(`#tagsForm > div > div > div:nth-child(1)`)
    this.key = this.keyParent.locator(`input[type="text"]`)
    this.keyStoredValue = this.keyParent.locator(`input[type="hidden"]`)
    this.clearKey = this.keyParent.locator('div[aria-label="Clear selected options"]')
    this.valueParent = this.parent.locator(`#tagsForm > div > div > div:nth-child(2)`)
    this.value = this.valueParent.locator(`input[type="text"]`)
    this.valueStoredValue = this.valueParent.locator(`input[type="hidden"]`)
    this.clearValue = this.valueParent.locator('div[aria-label="Clear selected options"]')
    this.color = this.page.getByLabel('Color')
    this.Button_Close = new Element(
      global.page,
      this.parent.locator(`div.chakra-modal__footer button:nth-child(1)`)
    )
    this.Button_AddAndAddAnother = new Element(
      global.page,
      this.parent.locator(`div.chakra-modal__footer button:nth-child(2)`)
    )
    this.Button_AddAndClose = new Element(
      global.page,
      this.parent.locator(`div.chakra-modal__footer button:nth-child(3)`)
    )
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async ClearKey() {
    if ((await this.valueStoredValue.count()) > 0) {
      await this.clearKey.click()
    }
  }

  async SetKeyValue(keyValue: string) {
    await this.key.click()
    await this.key.fill(keyValue)
    await this.key.press('Enter')
  }

  async GetTempKeyValue() {
    return await this.key.getAttribute('value')
  }

  async GetKeyValue() {
    return await this.keyStoredValue.getAttribute('value')
  }

  async ClearValue() {
    if ((await this.valueStoredValue.count()) > 0) {
      await this.clearValue.click()
    }
  }

  async SetValueValue(valueValue: string) {
    await this.value.waitFor({ state: 'visible' })
    await this.value.click()
    await this.value.fill(valueValue)
    await this.value.press('Enter')
  }

  async GetTempValueValue() {
    return await this.value.getAttribute('value')
  }

  async GetValueValue() {
    return await this.valueStoredValue.getAttribute('value')
  }

  async SetColor(hexColor: string) {
    await this.color.click()
    await this.page.waitForTimeout(500)
    await this.page.keyboard.press('Shift+Tab')
    await this.page.waitForTimeout(500)
    await this.page.keyboard.press('ArrowUp')
    await this.page.waitForTimeout(500)
    await this.page.keyboard.press('Shift+Tab')
    await this.page.keyboard.type(hexColor)
    await this.page.waitForTimeout(500)
    await this.page.keyboard.press('Enter')
    await this.page.waitForTimeout(500)
  }

  async GetColorValue() {
    const colorValue = await this.color.getAttribute('value')
    return colorValue?.toUpperCase()
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }

  async Validate() {
    // Validate key selection combo box is in an invalid state and that the error is..
    let keyFieldIsValidated = false
    keyFieldIsValidated =
      (await this.parent.locator(`form div[id*="field"]`).nth(0).textContent()) ==
      ValidationStrings.Required
    // Validate color picker is in an invalid state and that the error is..
    let colorFieldIsValidated = false
    colorFieldIsValidated =
      (await this.parent.locator(`form div[id*="field"]`).nth(1).textContent()) ==
      ValidationStrings.InvalidColor
    return keyFieldIsValidated && colorFieldIsValidated
  }
}
