import { Page, expect, type Locator } from '@playwright/test'

export class Element {
  readonly page: Page
  readonly locator: Locator
  readonly expectedText: string

  constructor(page: Page, Locator: Locator, expectedText = '') {
    this.page = page
    this.locator = Locator
    this.expectedText = expectedText
  }

  async VerifyExpectedValue(alternateExpectedText = '') {
    const textToVerify = alternateExpectedText == '' ? this.expectedText : alternateExpectedText
    const valueText = await this.locator.getAttribute('value')
    expect(valueText).toBe(textToVerify)
  }

  async VerifyExpectedText(alternateExpectedText = '', useInnerText: boolean = false) {
    const textToVerify = alternateExpectedText == '' ? this.expectedText : alternateExpectedText
    const locatorText = useInnerText
      ? await this.locator.innerText()
      : await this.locator.textContent()
    expect(locatorText).toBe(textToVerify)
  }

  async VerifyExpectedTextAlt(alternateExpectedText = '', useInnerText: boolean = false) {
    const locatorExists = (await this.locator.count()) > 0
    if (!locatorExists && this.expectedText != '') {
      throw new Error(
        `We are expecting text: ${this.expectedText} but the element locator: ${this.locator} does not exist on the page`
      )
    }
    if (locatorExists) {
      await this.VerifyExpectedText(alternateExpectedText, useInnerText)
    } else {
      console.debug('Element text is empty and locator is not visible - expected. Skipping check')
    }
  }

  async VerifyTextContains(textThatShouldBePresent: string) {
    await expect(this.locator).toContainText(textThatShouldBePresent)
  }

  async VerifyTextContainsEach(textArray: string[]) {
    for (let index = 0; index < textArray.length; index++) {
      await expect(this.locator).toContainText(textArray[index])
    }
  }

  async VerifyTextDoesNotContain(textThatShouldNotBePresent: string) {
    await expect(this.locator).not.toContainText(textThatShouldNotBePresent)
  }

  async GetText() {
    return await this.locator.textContent()
  }

  async IsHidden() {
    return await this.locator.isHidden()
  }

  async IsVisible() {
    return await this.locator.isVisible()
  }

  async IsEnabled() {
    return await this.locator.isEnabled()
  }

  async IsChecked() {
    return await this.locator.isChecked()
  }

  async Click() {
    await this.locator.click()
  }

  async SetChecked(checked: boolean) {
    await this.locator.setChecked(checked)
  }

  async Fill(fillText: string) {
    await this.locator.focus()
    await this.locator.fill(fillText)
  }

  async FillByTyping(fillText: string, delay = 0) {
    await this.locator.focus()
    await this.page.keyboard.type(fillText, { delay: delay })
  }
}
