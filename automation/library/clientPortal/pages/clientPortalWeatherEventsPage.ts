import { ClientPortalGlobal } from '../clientPortalGlobal.js'
import { ClientPortalBasePage } from './clientPortalBasePage.js'
import { Element } from '../../shared/element.js'
import {
  AlertStrings,
  WeatherEventsPageStrings,
  WeatherEvents_DataTable_ActionMenuItems,
} from '../clientPortalConstants.js'
import { ClientPortalDataTable } from '../clientPortalDataTable.js'
import { ClientPortalDeleteAlert } from '../alerts/clientPortalDeleteAlert.js'
import { ClientPortalCreateWeatherEventDrawer } from '../drawers/clientPortalCreateWeatherEventDrawer.js'
import { ClientPortalWeatherEvent } from '../clientPortalWeatherEvent.js'

export class ClientPortalWeatherEventsPage extends ClientPortalBasePage {
  readonly Title: Element
  readonly Button_CreateWeatherEvent: Element
  readonly DataTable_WeatherEvents: ClientPortalDataTable

  constructor(global: ClientPortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${WeatherEventsPageStrings.Title}` }),
      WeatherEventsPageStrings.Title
    )
    this.URL = `${global.baseUrl}weather-events`
    this.Button_CreateWeatherEvent = new Element(
      this.global.page,
      this.page.getByRole('button', {
        name: WeatherEventsPageStrings.Button_CreateWeatherEvent,
      }),
      WeatherEventsPageStrings.Button_CreateWeatherEvent
    )
    this.DataTable_WeatherEvents = new ClientPortalDataTable(
      global,
      '#admin_tabpanel_weathereventinfo_body',
      1,
      WeatherEventsPageStrings.ActionMenu,
      WeatherEventsPageStrings.ActionMenuAria
    )
  }

  async NavigateDirectly() {
    await this.page.goto(this.URL)
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.NavigateDirectly()
    } else {
      await this.leftNavBar.GoHome()
      await this.leftNavBar.Button_WeatherEvents.Click()
      await this.page.waitForLoadState()
    }
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async IsActionMenuItemVisible(
    rowIndex: string,
    actionMenuItem: WeatherEvents_DataTable_ActionMenuItems
  ) {
    await this.DataTable_WeatherEvents.OpenActionMenu(rowIndex)
    await this.page.waitForTimeout(1000)
    const visibility = await this.DataTable_WeatherEvents.IsActionMenuItemVisible(actionMenuItem)
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async SelectActionMenuItem(
    rowIndex: string,
    actionMenuItem: WeatherEvents_DataTable_ActionMenuItems
  ) {
    await this.DataTable_WeatherEvents.OpenActionMenu(rowIndex)
    await this.DataTable_WeatherEvents.SelectActionMenuItem(actionMenuItem)
  }

  async HandleDeleteWeatherEventAlert(cancelDelete = false) {
    const alert = new ClientPortalDeleteAlert(
      this.global,
      AlertStrings.DeleteWeatherEvent_Title,
      AlertStrings.DeleteWeatherEvent_Description
    )
    if (cancelDelete) {
      await alert.Button_Close.locator.click({ force: true })
    } else {
      await alert.Button_Confirm.locator.click({ force: true })
    }
  }

  async OpenCreateWeatherEventDrawer() {
    await this.Button_CreateWeatherEvent.Click()
    return new ClientPortalCreateWeatherEventDrawer(this.global)
  }

  async AddWeatherEvent(weatherEvent: ClientPortalWeatherEvent) {
    const createWeatherEventDrawer = await this.OpenCreateWeatherEventDrawer()
    await createWeatherEventDrawer.FillDrawer(weatherEvent)
  }

  async EditWeatherEvent(rowIndex: string, weatherEvent: ClientPortalWeatherEvent) {
    await this.SelectActionMenuItem(
      rowIndex,
      WeatherEvents_DataTable_ActionMenuItems.EditWeatherEvent
    )
    const updateWeatherEventDrawer = new ClientPortalCreateWeatherEventDrawer(this.global, true)
    await updateWeatherEventDrawer.FillDrawer(weatherEvent)
  }

  async FindIndexOfRowAtPosition(rowPosition: number) {
    const value = await this.DataTable_WeatherEvents.FetchRowIndexFromRowPosition(rowPosition)
    return value
  }

  async RemoveExistingWeatherEvent(rowIndex: string) {
    await this.SelectActionMenuItem(
      rowIndex,
      WeatherEvents_DataTable_ActionMenuItems.DeleteWeatherEvent
    )
    await this.HandleDeleteWeatherEventAlert()
    await this.page.waitForTimeout(1000)
  }

  async DeleteOldWeatherEvents(weatherEventsPrefix: string) {
    if (await this.DataTable_WeatherEvents.IsEmpty()) {
      return
    }
    await this.DataTable_WeatherEvents.SetTableSearch(weatherEventsPrefix)
    let tableIsNotClear = false
    let rowCount = 0
    do {
      rowCount = await this.DataTable_WeatherEvents.VisibleRowCount()
      tableIsNotClear = rowCount > 0
      if (tableIsNotClear) {
        const index = await this.FindIndexOfRowAtPosition(1)
        await this.RemoveExistingWeatherEvent(index)
      }
    } while (tableIsNotClear)
    await this.DataTable_WeatherEvents.CancelPinnedTableSearch()
  }
}
