import { BPBase } from '../bpBase.js'
import { BPClients } from '../bpConstants.js'
import { BPDataTable } from '../bpDataTable.js'
import { BPGlobal } from '../bpGlobal.js'
import { BPTestPage } from './bpTestPage.js'

export class BPToolsPage extends BPBase {
  readonly DataTable_Bots: BPDataTable

  constructor(global: BPGlobal) {
    super(global)
    this.DataTable_Bots = new BPDataTable(global, `#root div.chakra-card__body > div > div`)
  }

  async SelectBotPressClient(bpClient: BPClients) {
    let targetClientButton = null
    let targetPageLink = null
    await this.page.waitForTimeout(2000)

    const rowIndex = await this.DataTable_Bots.FetchRowIndexOfDataByColumnName(bpClient, 'name')
    targetClientButton = this.page.locator(`td[id$="DataGrid_Row_${rowIndex}_Test"] button`)
    targetPageLink = this.page
      .locator(`td[id$="DataGrid_Row_${rowIndex}_Test"]`)
      .getByRole('menuitem', { name: `${this.global.environment}` })

    await this.DataTable_Bots.WaitForLoad()
    // navigate to the target page
    await targetClientButton.click()
    await targetPageLink.click()
    const testPage = new BPTestPage(this.global)
    return testPage
  }
}
