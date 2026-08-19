import { Locator } from '@playwright/test'
import { DelegatePortalBase } from './pages/delegatePortalBase.js'
import { DelegatePortalGlobal } from './delegatePortalGlobal.js'
import { DocumentTemplateCardStrings } from './delegatePortalConstants.js'

export type DocumentTemplateCardData = {
  name: string
  carrier: string
  createdOn: string
}

export class DelegatePortalDocumentTemplateCard extends DelegatePortalBase {
  readonly parent: Locator
  readonly radioButton_Select: Locator
  readonly label_name_data: Locator
  readonly label_carrier: Locator
  readonly label_carrier_data: Locator
  readonly label_createdOn: Locator
  readonly label_createdOn_data: Locator
  readonly button_DownloadTemplate: Locator

  constructor(global: DelegatePortalGlobal, parent: Locator, cardIndex: number) {
    super(global)
    this.parent = parent.nth(cardIndex)
    this.radioButton_Select = this.parent.locator(`div[data-slot="item-media"] span[role="radio"]`)
    this.label_name_data = this.parent.locator(
      `div[data-slot="item-content"] div[data-slot="item-title"]`
    )
    this.label_carrier = this.parent
      .locator(`div[data-slot="item-content"] p[data-slot="item-description"]  > span`)
      .nth(0)
      .locator(`span`)
      .nth(0)
    this.label_carrier_data = this.parent
      .locator(`div[data-slot="item-content"] p[data-slot="item-description"] > span`)
      .nth(0)
      .locator(`span`)
      .nth(1)
    this.label_createdOn = this.parent
      .locator(`div[data-slot="item-content"] p[data-slot="item-description"] > span`)
      .nth(1)
      .locator(`span`)
      .nth(0)
    this.label_createdOn_data = this.parent
      .locator(`div[data-slot="item-content"] p[data-slot="item-description"] > span`)
      .nth(1)
      .locator(`span`)
      .nth(1)
    this.button_DownloadTemplate = this.parent.locator(
      `div[data-slot="item-actions"] a[data-slot="button"]`
    )
  }

  async VerifyLabels() {
    const actualCarrierLabel = await this.label_carrier.textContent()
    const verifiedCarrier = actualCarrierLabel === DocumentTemplateCardStrings.Label_Carrier
    const actualCreatedOnLabel = await this.label_createdOn.textContent()
    const verifiedCreatedOn = actualCreatedOnLabel === DocumentTemplateCardStrings.Label_CreatedOn
    return verifiedCarrier && verifiedCreatedOn
  }

  async FetchCardInfo() {
    const actualName = await this.label_name_data.textContent()
    const actualCarrier = await this.label_carrier_data.textContent()
    const actualCreatedOn = await this.label_createdOn_data.textContent()
    return {
      name: actualName ?? '',
      carrier: actualCarrier ?? '',
      createOn: actualCreatedOn ?? '',
    }
  }

  async Select() {
    const alreadyChecked = await this.radioButton_Select.isChecked()
    if (!alreadyChecked) {
      await this.radioButton_Select.check()
    }
  }
}
