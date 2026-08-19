import { ClaimsPortalBase } from '../pages/claimsPortalBase.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { Element } from '../../shared/element.js'
import { Locator } from 'playwright/test'
import {
  ClaimAssignContactOptions,
  ContactAssignmentOptions,
  JobAssignContactOptions,
  ValidationStrings,
} from '../claimsPortalConstants.js'

export class ClaimsPortalAssignContactDialog extends ClaimsPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Submit: Element
  readonly parent: Locator

  constructor(
    global: ClaimsPortalGlobal,
    contactType: ClaimAssignContactOptions | JobAssignContactOptions | ContactAssignmentOptions
  ) {
    super(global)
    this.parent = this.page.locator(`section[id*='chakra-modal']`)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(
      global.page,
      this.parent.locator(`div.chakra-modal__footer button:nth-child(1)`)
    )
    this.Button_Submit = new Element(
      global.page,
      this.parent.locator(`div.chakra-modal__footer button:nth-child(2)`)
    )
    this.Title = new Element(global.page, this.parent.locator(`header`), `Assign ${contactType}`)
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async SetContactValue(contactValue: string) {
    const setLocator = this.parent.locator(`input[role="combobox"]`)
    await setLocator.click()
    await setLocator.fill(contactValue)
    await setLocator.press('Enter')
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }

  async Validate() {
    // Validate contact selection combo box is in an invalid state and that the error is..
    let contactFieldIsValidated = false
    contactFieldIsValidated =
      (await this.parent.locator(`form > div > div > div:nth-child(3)`).textContent()) ==
      ValidationStrings.ExpectedObject
    return contactFieldIsValidated
  }
}
