import { Locator } from '@playwright/test'
import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { ClaimsPortalBase } from './pages/claimsPortalBase.js'
import { ClaimsPortalPhotoReportCard } from './claimsPortalPhotoReportCard.js'
import { ClaimsPortalDeleteAlert } from './alerts/claimsPortalDeleteAlert.js'
import { AlertStrings } from './claimsPortalConstants.js'

export class ClaimsPortalPhotoReportGroup extends ClaimsPortalBase {
  readonly parent: Locator
  readonly cardParent: Locator
  readonly label: Locator
  readonly button_Expand: Locator
  readonly button_Collapse: Locator
  readonly button_DragHandle: Locator
  readonly button_Delete: Locator
  readonly button_EditLabel: Locator
  readonly button_SaveLabelChanges: Locator
  readonly button_CancelLabelChanges: Locator
  readonly combobox_label: Locator
  readonly boundary: Locator

  constructor(global: ClaimsPortalGlobal, parent: Locator, groupIndex: number) {
    super(global)
    this.parent = parent.locator('div.chakra-card__header').nth(groupIndex)
    this.boundary = this.parent
    this.cardParent = parent.locator('div.chakra-card__body').nth(groupIndex)
    this.label = this.parent.locator('h3')
    this.button_Expand = this.parent.locator(`button[aria-expanded="false"]`)
    this.button_Collapse = this.parent.locator(`button[aria-expanded="true"]`)
    this.button_DragHandle = this.parent.locator(`button[data-testid="draggable-handle"]`)
    this.button_Delete = this.parent.locator(`button`).nth(1)
    this.button_EditLabel = this.parent.locator(`button[aria-label="Edit label"]`)
    this.button_SaveLabelChanges = this.parent.locator(`button[aria-label="Save changes"]`)
    this.button_CancelLabelChanges = this.parent.locator(`button[aria-label="Cancel"]`)
    this.combobox_label = this.parent.locator('input[role="combobox"]').nth(0)
  }

  async IsCardListHidden() {
    const hiddenCardsLocator = this.cardParent.locator('[style*="display: none"]')
    return (await hiddenCardsLocator.count()) > 0
  }

  async IsExpanded() {
    return (await this.button_Collapse.count()) > 0
  }

  async IsCollapsed() {
    return (await this.button_Expand.count()) > 0
  }

  async FetchCardCount() {
    const count = this.cardParent.locator('div[role="region"] > ul > li').count()
    return count
  }

  async FetchCardByIndex(index: number) {
    const card = new ClaimsPortalPhotoReportCard(this.global, this.cardParent, index)
    return card
  }

  async FetchCardByTitle(targetTitle: string) {
    const cardCount = await this.FetchCardCount()
    for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
      const card = await this.FetchCardByIndex(cardIndex)
      if ((await card.label_title_data.textContent()) == targetTitle) {
        return { card, index: cardIndex }
      }
    }
    throw new Error(`No card found with a title of: ${targetTitle}`)
  }

  async Delete(cancelDelete = false) {
    await this.button_Delete.click()
    await this.Wait(1000)
    await this.HandleDeleteGroupAlert(cancelDelete)
    await this.Wait(1000)
  }

  async HandleDeleteGroupAlert(cancelDelete = false) {
    const alert = new ClaimsPortalDeleteAlert(
      this.global,
      AlertStrings.DeleteGroup_Title,
      AlertStrings.DeleteGroup_Description
    )
    if (cancelDelete) {
      await alert.Button_Close.locator.click({ force: true })
    } else {
      await alert.Button_Delete.locator.click({ force: true })
    }
  }

  async EditLabel(newLabelName: string) {
    await this.button_EditLabel.click()
    await this.combobox_label.click()
    await this.combobox_label.fill(newLabelName)
    await this.combobox_label.press('Enter')
    await this.button_SaveLabelChanges.click()
  }

  async Collapse() {
    if (await this.IsExpanded()) {
      await this.button_Collapse.click()
      await this.Wait(1000)
    }
  }

  async Expand() {
    if (await this.IsCollapsed()) {
      await this.button_Expand.click()
      await this.Wait(1000)
    }
  }
}
