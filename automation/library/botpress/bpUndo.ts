import { BPBase } from './bpBase.js'
import { BPGlobal } from './bpGlobal.js'
import {
  OtherText,
  UndoText,
  VerifyOnly_No,
  VerifyOnly_Yes,
} from './clients/eagle/bpEagleConstants.js'
import { Locator, expect } from 'playwright/test'

export class BPUndo extends BPBase {
  label_Summary: Locator
  button_Cancel: Locator
  constructor(global: BPGlobal) {
    super(global)
    this.label_Summary = this.page.frameLocator('#bp-widget').locator(`.bpw-convo-list > p`)
    this.button_Cancel = this.page.frameLocator('#bp-widget').locator('.bpw-convo-list button')
  }

  async VerifySummary() {
    const expectedText = OtherText.UndoSummary
    const actualText = await this.label_Summary.innerText()
    expect(actualText).toBe(expectedText)
  }

  async VerifyUndoAndCancel() {
    await this.VerifySummary()
    await this.SelectUndoLinkByIndex(1, UndoText.ReporterInformation, VerifyOnly_Yes)
    await this.button_Cancel.click()
  }

  async SelectUndoLinkByIndex(
    linkIndex: number,
    expectedLinkText: string,
    verifyOnly: boolean = VerifyOnly_No
  ) {
    const linkSelector = this.page
      .frameLocator('#bp-widget')
      .locator(`.bpw-convo-list .bpw-convo-item:nth-of-type(${linkIndex}) span`)
    const actualText = await linkSelector.innerText()
    expect(actualText).toBe(expectedLinkText)
    if (!verifyOnly) {
      await linkSelector.click()
    }
  }

  async UndoLinkCount() {
    const linksSelector = this.page
      .frameLocator('#bp-widget')
      .locator(`.bpw-convo-list .bpw-convo-item`)
    return await linksSelector.count()
  }
}
