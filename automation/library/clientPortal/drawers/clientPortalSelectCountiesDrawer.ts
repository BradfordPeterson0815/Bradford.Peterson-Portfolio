import { Locator } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { DrawerStrings } from '../clientPortalConstants.js'
import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { ClientPortalLocation } from '../clientPortalLocation.js'
import { ClientPortalBase } from '../pages/clientPortalBase.js'

export class ClientPortalSelectCountiesDrawer extends ClientPortalBase {
  readonly Title: Element
  readonly Button_Close_X: Element
  readonly Button_Close: Element
  readonly Button_Save: Element
  readonly parent: Locator
  mapCenterX: number = 0
  mapCenterY: number = 0
  mapOriginX: number = 0
  mapOriginY: number = 0
  screenOffsetX = 0
  screenOffsetY = -74
  centerCountyX = 0
  centerCountyY = 0

  constructor(global: ClientPortalGlobal) {
    super(global)
    this.parent = this.page.locator('div[role="dialog"]')
    this.Title = new Element(
      global.page,
      this.parent.locator('#chakra-modal--header-drawer_selectcounties'),
      DrawerStrings.SelectCounties_Title
    )
    this.Button_Close_X = new Element(
      global.page,
      this.parent.locator(`button[aria-label='Close']`)
    )
    this.Button_Close = new Element(global.page, this.page.locator('#drawer_selectcounties_close'))
    this.Button_Save = new Element(
      global.page,
      this.page.getByRole('button', { name: `${DrawerStrings.Button_Save}` }),
      DrawerStrings.Button_Save
    )
  }

  async MeasureCanvas() {
    if (this.mapCenterX == 0 && this.mapCenterY == 0) {
      const mapLocator = this.page.locator('canvas[aria-label="Map"]')
      const box = await mapLocator.boundingBox()
      console.log(box?.x)
      console.log(box?.y)
      console.log(box?.height)
      console.log(box?.width)
      if (box != null) {
        this.mapOriginX = box.x
        this.mapOriginY = box.y
        this.mapCenterX = box.width / 2 + box.x + this.screenOffsetX
        this.mapCenterY = box.height / 2 + box.y + this.screenOffsetY
      }
    }
  }

  async ClickCanvasAbsolute(absoluteX = 0, absoluteY = 0, doubleClick = false) {
    const mapXOffset = -15
    const mapYOffset = -124
    await this.MeasureCanvas()
    const x = absoluteX + mapXOffset
    const y = absoluteY + mapYOffset
    if (doubleClick) {
      await this.page.mouse.dblclick(x, y)
      console.log(
        `initial coords are (${absoluteX},${absoluteY}) adjust with offset of (${mapXOffset},${mapYOffset}) - double clicking at (${x},${y})`
      )
    } else {
      await this.page.mouse.click(x, y)
      console.log(
        `initial coords are (${absoluteX},${absoluteY}) adjust with offset of (${mapXOffset},${mapYOffset}) - clicking at (${x},${y})`
      )
    }
  }

  async ClickOnState(stateTuple: ClientPortalLocation) {
    await this.page.waitForTimeout(1000)
    await this.ClickCanvasAbsolute(stateTuple.coordinates[0], stateTuple.coordinates[1])
    await this.page.waitForTimeout(1000)
  }

  async ExposeAndCenterCounty(countyTuple: ClientPortalLocation) {
    await this.page.waitForTimeout(1000)
    await this.ClickCanvasAbsolute(countyTuple.coordinates[0], countyTuple.coordinates[1], false)
    await this.page.waitForTimeout(1000)
    await this.ClickCanvasAbsolute(
      countyTuple.coordinates[0] - 1,
      countyTuple.coordinates[1] - 1,
      true
    )
    await this.page.waitForTimeout(1000)
    this.centerCountyX = countyTuple.coordinates[0]
    this.centerCountyY = countyTuple.coordinates[1]
  }

  async ClickOnCounty(countyTuple: ClientPortalLocation) {
    const relativeCountyX =
      this.centerCountyX - (this.centerCountyX - countyTuple.coordinates[0]) * 2
    const relativeCountyY =
      this.centerCountyY - (this.centerCountyY - countyTuple.coordinates[1]) * 2
    await this.ClickCanvasAbsolute(relativeCountyX, relativeCountyY, false)
    await this.page.waitForTimeout(1000)
  }
}
