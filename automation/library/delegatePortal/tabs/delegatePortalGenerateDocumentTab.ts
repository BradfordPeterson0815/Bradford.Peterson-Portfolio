import { Locator } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { DelegatePortalBasePage } from '../pages/delegatePortalBasePage.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { GenerateDocumentTabStrings, ValidationStrings } from '../delegatePortalConstants.js'
import { DelegatePortalDocumentTemplateCard } from '../delegatePortalDocumentTemplateCard.js'
import { DelegatePortalGenerateDocumentStatusPage } from '../pages/delegatePortalGenerateDocumentStatusPage.js'

export class DelegatePortalGenerateDocumentTab extends DelegatePortalBasePage {
  readonly Title: Element
  readonly Link_StartGenerationOfDocument: Element
  readonly Label_SearchTemplates: Element
  readonly Label_SelectTemplate: Element
  readonly TextBox_Search: Element
  readonly Button_ClearSearch: Element
  readonly templateList: Locator
  readonly templateListItems: Locator
  readonly emptytemplateListAlert: Locator

  readonly parent: Locator
  readonly header: Locator
  readonly content: Locator
  readonly footer: Locator

  constructor(global: DelegatePortalGlobal, targetURL: string) {
    super(global)
    this.URL = `${global.baseUrl}${targetURL}/generate-document`
    this.parent = this.page.locator(`div[id^="page"][id*="body"] > div[data-slot="card"]`)
    this.header = this.parent.locator('div[data-slot="card-header"]')
    this.content = this.parent.locator('div[data-slot="card-content"]')
    this.footer = this.parent.locator('div[data-slot="card-footer"]')
    this.Title = new Element(
      global.page,
      this.header.getByRole('heading', {
        name: GenerateDocumentTabStrings.Title,
        exact: true,
      }),
      GenerateDocumentTabStrings.Title
    )
    this.Link_StartGenerationOfDocument = new Element(
      global.page,
      this.footer.getByRole('button', {
        name: GenerateDocumentTabStrings.Link_StartGenerationOfDocument,
        exact: true,
      }),
      GenerateDocumentTabStrings.Link_StartGenerationOfDocument
    )
    this.Label_SearchTemplates = new Element(
      global.page,
      this.content.getByText(GenerateDocumentTabStrings.Label_SearchTemplates),
      GenerateDocumentTabStrings.Label_SearchTemplates
    )
    this.Label_SelectTemplate = new Element(
      global.page,
      this.content.getByText(GenerateDocumentTabStrings.Label_SelectTemplate),
      GenerateDocumentTabStrings.Label_SelectTemplate
    )
    this.TextBox_Search = new Element(
      global.page,
      this.content.locator('input[data-slot="input"]').first()
    )
    this.Button_ClearSearch = new Element(
      global.page,
      this.content.locator('button[data-slot="button"]').first()
    )
    this.templateList = this.content.locator('div[data-slot="field-set"]')
    this.templateListItems = this.templateList.locator(
      'div[data-slot="item-group"] div[data-slot="field-item"]'
    )
    this.emptytemplateListAlert = this.templateList.locator('div[data-slot="alert-title"]')
  }

  async NavigateDirectly(): Promise<void> {
    await super.NavigateDirectly(this.URL)
    await this.WaitForLoad()
    await this.page.waitForTimeout(5000)
    await this.Link_StartGenerationOfDocument.locator.waitFor({ state: 'visible' })
  }

  async IsTemplateListEmpty() {
    const visibility = await this.emptytemplateListAlert.isVisible()
    return visibility
  }

  async FetchTemplateCardCount() {
    if (await this.IsTemplateListEmpty()) {
      return 0
    } else {
      const count = await this.templateListItems.count()
      return count
    }
  }

  FetchTemplateCardByIndex(index: number) {
    const card = new DelegatePortalDocumentTemplateCard(this.global, this.templateListItems, index)
    return card
  }

  async FetchTemplateCardByLabel(targetTemplateName: string) {
    const cardCount = await this.FetchTemplateCardCount()
    for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
      const card = await this.FetchTemplateCardByIndex(cardIndex)
      if ((await card.label_name_data.textContent()) == targetTemplateName) {
        return { card: card, index: cardIndex }
      }
    }
    throw new Error(`No template card found with a label of: ${targetTemplateName}`)
  }

  async SetSearch(targetName: string) {
    await this.TextBox_Search.Fill(targetName)
  }

  async ClearSearch() {
    await this.Button_ClearSearch.Click()
  }

  async ValidateNoTemplateSelected() {
    // Validate radio template selection is in an invalid state and that the error is..
    let radioButtonsAreValidated = false
    if ((await this.templateList.getAttribute('aria-invalid')) == 'true') {
      const referenceId = await this.templateList.getAttribute('aria-describedby')
      // At least one template radio button should be selected
      radioButtonsAreValidated =
        (await this.parent.locator(`div[id='${referenceId}']`).textContent()) ==
        ValidationStrings.ATemplateMustBeSelected
    }
    return radioButtonsAreValidated
  }

  async GenerateDraftDocument(
    templateName: string,
    templateId: string,
    waitForSuccess: boolean = true
  ) {
    await this.Link_StartGenerationOfDocument.Click()
    const statusPage = new DelegatePortalGenerateDocumentStatusPage(
      this.global,
      this.URL,
      templateName,
      templateId
    )
    if (waitForSuccess) {
      await statusPage.Label_Success.locator.waitFor({ state: 'visible', timeout: 60000 })
    }
    return statusPage
  }
}
