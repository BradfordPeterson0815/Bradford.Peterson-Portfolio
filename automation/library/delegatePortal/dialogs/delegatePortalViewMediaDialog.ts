import { DelegatePortalBase } from '../pages/delegatePortalBase.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { Element } from '../../shared/element.js'
import { Locator } from 'playwright/test'
import { DrawerStrings } from '../delegatePortalConstants.js'

export class DelegatePortalViewMediaDialog extends DelegatePortalBase {
  readonly Button_Close_X: Element
  readonly Button_PreviousSlide: Element
  readonly Button_NextSlide: Element
  readonly Button_RotateLeft: Element
  readonly Button_SaveRotation: Element
  readonly Button_RotateRight: Element
  readonly parent: Locator
  readonly fileLabelLocator: Locator
  readonly popupTriggerLocator: Locator
  readonly viewLinkLocator: Locator

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.parent = this.page.locator(`div[data-slot="dialog-popup"]`)
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[data-slot="alert-dialog-dismiss"]`)
    )
    this.Button_PreviousSlide = new Element(
      global.page,
      this.parent.locator(`button[data-slot="carousel-previous"]`)
    )
    this.Button_NextSlide = new Element(
      global.page,
      this.parent.locator(`button[data-slot="carousel-next"]`)
    )
    this.Button_RotateLeft = new Element(
      global.page,
      this.parent
        .locator('button[data-slot="media-carousel-rotate-left"]')
        .filter({ visible: true })
        .nth(0),
      DrawerStrings.UpdateDocumentInformation_Button_RotateLeft
    )
    this.Button_SaveRotation = new Element(
      global.page,
      this.parent
        .locator('button[data-slot="media-carousel-save-rotation"]')
        .filter({ visible: true })
        .nth(0),
      DrawerStrings.UpdateDocumentInformation_Button_SaveRotation
    )
    this.Button_RotateRight = new Element(
      global.page,
      this.parent
        .locator('button[data-slot="media-carousel-rotate-right"]')
        .filter({ visible: true })
        .nth(0),
      DrawerStrings.UpdateDocumentInformation_Button_RotateRight
    )
    this.popupTriggerLocator = this.parent
      .locator('button[data-slot="popover-trigger"]')
      .filter({ visible: true })
      .nth(0)
    this.fileLabelLocator = this.popupTriggerLocator.locator('..').locator('..').locator('> span')

    this.viewLinkLocator = this.popupTriggerLocator
      .locator('..')
      .locator('..')
      .locator('a[aria-label="Download"]')
  }

  async Close(useKeyboard = false) {
    if (useKeyboard) {
      await this.page.keyboard.press('Escape')
    } else {
      await this.Button_Close_X.Click()
    }
  }
}
