import { ChainablePromiseElement } from 'webdriverio'
import { InspectionsGlobal } from '../inspectionsGlobal.js'
import { InspectionsBase } from './inspectionsBase.js'

export class InspectionsNativePage extends InspectionsBase {
  constructor(global: InspectionsGlobal) {
    super(global)
  }

  async WaitForPageElement(
    targetElement: ChainablePromiseElement,
    maxTimeToWait: number = 30000,
    waitInterval: number = 3000
  ) {
    await targetElement.waitForDisplayed({ timeout: maxTimeToWait, interval: waitInterval })
  }

  async WaitForPageElementToGoAway(
    targetElement: ChainablePromiseElement,
    maxTimeToWait: number = 30000,
    waitInterval: number = 3000
  ) {
    await targetElement.waitForDisplayed({
      timeout: maxTimeToWait,
      interval: waitInterval,
      reverse: true,
    })
  }
}
