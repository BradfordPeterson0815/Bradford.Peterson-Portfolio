import { expect } from 'playwright/test'
import { ChainablePromiseElement } from 'webdriverio'
import { PageStrings, UploadQueues } from '../inspectionsConstants.js'
import { InspectionsGlobal } from '../inspectionsGlobal.js'
import { InspectionsNativePage } from './inspectionsNativePage.js'

export class InspectionsUploadsPage extends InspectionsNativePage {
  readonly Button_InProgress: ChainablePromiseElement
  readonly Button_Errors: ChainablePromiseElement
  readonly Button_Completed: ChainablePromiseElement
  readonly QueueParentLocator: string

  constructor(global: InspectionsGlobal) {
    super(global)
    this.Button_InProgress = global.nativeBrowser.$(
      `accessibility id:${PageStrings.UploadsPage_Button_InProgress}`
    )
    this.Button_Errors = global.nativeBrowser.$(
      `accessibility id:${PageStrings.UploadsPage_Button_Errors}`
    )
    this.Button_Completed = global.nativeBrowser.$(
      `accessibility id:${PageStrings.UploadsPage_Button_Completed}`
    )
    this.QueueParentLocator = `-android uiautomator:new UiSelector().className("android.view.ViewGroup").instance(20)`
  }

  async VerifyUI() {
    const queueParent = await this.global.nativeBrowser.$(this.QueueParentLocator)

    // Verify In Progress queue tab
    const inProgressQueueTab = await queueParent.$$('//child::android.view.View')[0]
    const inProgressQueueTabText = await inProgressQueueTab.getAttribute('content-desc')
    expect(await inProgressQueueTab.isDisplayed()).toBe(true)
    expect(inProgressQueueTabText).toBe(PageStrings.UploadsPage_Button_InProgress)

    // Verify Errors queue tab
    const errorsQueueTab = await queueParent.$$('//child::android.view.View')[1]
    const errorsQueueTabText = await errorsQueueTab.getAttribute('content-desc')
    expect(await errorsQueueTab.isDisplayed()).toBe(true)
    expect(errorsQueueTabText).toBe(PageStrings.UploadsPage_Button_Errors)

    // Verify Completed queue tab
    const completedQueueTab = await queueParent.$$('//child::android.view.View')[2]
    const completedQueueTabText = await errorsQueueTab.getAttribute('content-desc')
    expect(await completedQueueTab.isDisplayed()).toBe(true)
    expect(completedQueueTabText).toBe(PageStrings.UploadsPage_Button_Completed)
  }

  async FindSelectedQueue() {
    const queueParent = await this.global.nativeBrowser.$(this.QueueParentLocator)
    const queueChildren = await queueParent.$$('//child::android.view.View')
    const inProgressSelected = await queueChildren[0].getAttribute('selected')
    const errorsSelected = await queueChildren[1].getAttribute('selected')
    const completedSelected = await queueChildren[2].getAttribute('selected')

    if (inProgressSelected === 'true') return UploadQueues.InProgress
    if (errorsSelected === 'true') return UploadQueues.Errors
    if (completedSelected === 'true') return UploadQueues.CompletedItems
    throw new Error('No Upload Queue appears to be selected')
  }

  async SelectQueue(queueToSelect: UploadQueues) {
    const currentlySelectedQueue = await this.FindSelectedQueue()
    switch (queueToSelect) {
      case UploadQueues.CompletedItems:
        if (currentlySelectedQueue != UploadQueues.CompletedItems) {
          await this.Button_Completed.click()
        }
        break
      case UploadQueues.Errors:
        if (currentlySelectedQueue != UploadQueues.Errors) {
          await this.Button_Errors.click()
        }
        break
      case UploadQueues.InProgress:
        if (currentlySelectedQueue != UploadQueues.InProgress) {
          await this.Button_InProgress.click()
        }
        break
    }
  }

  async WaitForLoad() {
    await this.WaitForPageElement(this.Button_InProgress, 30000)
  }
}
