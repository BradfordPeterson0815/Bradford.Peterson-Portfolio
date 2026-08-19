import { Locator } from '@playwright/test'
import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { ClaimsPortalBase } from './pages/claimsPortalBase.js'
import { PhotoReportCardStrings } from './claimsPortalConstants.js'

export type PhotoReportCardData = {
  title: string
  lable: string
  description: string
}

export class ClaimsPortalPhotoReportCard extends ClaimsPortalBase {
  readonly parent: Locator
  readonly boundary: Locator
  readonly expanded: Locator
  readonly button_DragHandle: Locator
  readonly button_Delete: Locator
  readonly checkbox_Select: Locator
  readonly image_Link: Locator
  readonly label_title: Locator
  readonly label_title_data: Locator
  readonly label_label: Locator
  readonly label_label_data: Locator
  readonly label_timeTaken: Locator
  readonly label_timeTaken_data: Locator
  readonly label_description: Locator
  readonly label_description_data: Locator
  readonly button_EditPhoto: Locator

  constructor(global: ClaimsPortalGlobal, parent: Locator, cardIndex: number) {
    super(global)
    this.parent = parent.locator('ul li').nth(cardIndex)
    this.boundary = this.parent
    this.button_DragHandle = this.parent.locator(`button[data-testid="draggable-handle"]`)
    this.button_Delete = this.parent.locator(`button`).nth(1)
    this.checkbox_Select = this.parent.locator(`span label`)
    this.image_Link = this.parent.locator(`a`)
    this.expanded = this.parent.locator(`dl`)
    this.label_title = this.expanded.locator(`div dt`).getByText(PhotoReportCardStrings.Label_Title)
    this.label_title_data = this.label_title.locator('..').locator('..').locator('> dd')
    this.label_label = this.expanded.locator(`div dt`).getByText(PhotoReportCardStrings.Label_Label)
    this.label_label_data = this.label_label.locator('..').locator('..').locator('> dd')
    this.label_timeTaken = this.expanded
      .locator(`div dt`)
      .getByText(PhotoReportCardStrings.Label_TimeTaken)
    this.label_timeTaken_data = this.label_timeTaken.locator('..').locator('..').locator('> dd')
    this.label_description = this.expanded
      .locator(`div dt`)
      .getByText(PhotoReportCardStrings.Label_Description)
    this.label_description_data = this.label_description.locator('..').locator('..').locator('> dd')
    this.button_EditPhoto = this.parent.getByRole(`button`, {
      name: PhotoReportCardStrings.Button_EditPhoto,
    })
  }

  async IsCollapsed() {
    const expandedCount = await this.expanded.count()
    return expandedCount == 0
  }

  async IsExpanded() {
    const expandedCount = await this.expanded.count()
    return expandedCount > 0
  }

  async VerifyLabels() {
    const actualTitleLabel = await this.label_title.textContent()
    const verifiedTitle = actualTitleLabel === PhotoReportCardStrings.Label_Title
    const actualLabelLabel = await this.label_label.textContent()
    const verifiedLabel = actualLabelLabel === PhotoReportCardStrings.Label_Label
    let verifiedTimeTaken = true
    const timeTakenLabelExists = (await this.label_timeTaken.count()) > 0
    if (timeTakenLabelExists) {
      const actualTimeTakenLabel = await this.label_timeTaken.textContent()
      verifiedTimeTaken = actualTimeTakenLabel === PhotoReportCardStrings.Label_TimeTaken
    }
    const actualDescriptionLabel = await this.label_description.textContent()
    const verifiedDescription = actualDescriptionLabel === PhotoReportCardStrings.Label_Description
    return verifiedLabel && verifiedTitle && verifiedTimeTaken && verifiedDescription
  }

  async FetchCardInfo() {
    if (await this.IsCollapsed()) {
      const actualTitleCollapsed = await this.image_Link
        .locator('..')
        .locator(`div > div > p`)
        .textContent()
      const actualLabelCollapsed = await this.image_Link
        .locator('..')
        .locator(`div > div > span`)
        .textContent()
      return {
        title: actualTitleCollapsed,
        label: actualLabelCollapsed,
        timeTake: '',
        description: '',
        collapsed: true,
      }
    } else {
      const actualTitle = await this.label_title_data.textContent()
      const actualLabel = await this.label_label_data.textContent()
      const timeTakenLabelExists = (await this.label_timeTaken.count()) > 0
      let actualTimeTaken = ''
      if (timeTakenLabelExists) {
        actualTimeTaken = (await this.label_timeTaken.textContent()) ?? ''
      }
      const actualDescription = await this.label_description_data.textContent()
      return {
        title: actualTitle,
        label: actualLabel,
        timeTaken: actualTimeTaken,
        description: actualDescription,
        collapsed: false,
      }
    }
  }
}
