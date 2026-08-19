import { ChainablePromiseElement } from 'webdriverio'
import { QueueStrings } from '../inspectionsConstants.js'
import { InspectionsGlobal } from '../inspectionsGlobal.js'
import { InspectionsNativePage } from '../pages/inspectionsNativePage.js'

export class InspectionsCompletedQueue extends InspectionsNativePage {
  readonly Title: ChainablePromiseElement
  readonly Button_RemoveAll: ChainablePromiseElement
  readonly CompletedItemsInfoTitleLocator: ChainablePromiseElement
  readonly CompletedItemsInfoDescriptionLocator: ChainablePromiseElement

  constructor(global: InspectionsGlobal) {
    super(global)
    this.Title = this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().text("${QueueStrings.CompletedQueue_Title}")`
    )
    this.Button_RemoveAll = global.nativeBrowser.$(
      `accessibility id:${QueueStrings.CompletedQueue_Button_RemoveAll}`
    )
    this.CompletedItemsInfoTitleLocator = this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().text("${QueueStrings.CompletedQueue_CompletedItemsInfo_Title}")`
    )
    this.CompletedItemsInfoDescriptionLocator = this.global.nativeBrowser.$(
      `-android uiautomator:new UiSelector().text("${QueueStrings.CompletedQueue_CompletedItemsInfo_Description}")`
    )
  }
}
