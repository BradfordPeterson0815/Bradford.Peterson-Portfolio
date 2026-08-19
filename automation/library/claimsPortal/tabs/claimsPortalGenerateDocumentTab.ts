import { Locator } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { GenerateDocumentTabStrings, ValidationStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'
import { ClaimsPortalDocumentTemplateCard } from '../claimsPortalDocumentTemplateCard.js'
import { ClaimsPortalGenerateDocumentStatusPage } from '../pages/claimsPortalGenerateDocumentStatusPage.js'

export class ClaimsPortalGenerateDocumentTab extends ClaimsPortalBasePage {
  readonly Title: Element
  readonly Button_StartGenerationOfDocument: Element
  readonly Label_SearchTemplates: Element
  readonly Label_SelectTemplate: Element
  readonly Label_NoTemplatesFoundAlert_Title: Element
  readonly Label_NoTemplatesFoundAlert_Description: Element
  readonly TextBox_Search: Element
  readonly Button_ClearSearch: Element
  readonly templateList: Locator
  readonly templateListItems: Locator
  readonly parent: Locator
  readonly header: Locator
  readonly content: Locator
  readonly footer: Locator

  constructor(global: ClaimsPortalGlobal, targetURL: string) {
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
    this.Button_StartGenerationOfDocument = new Element(
      global.page,
      this.footer.getByRole('button', {
        name: GenerateDocumentTabStrings.Button_StartGenerationOfDocument,
        exact: true,
      }),
      GenerateDocumentTabStrings.Button_StartGenerationOfDocument
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
    this.Label_NoTemplatesFoundAlert_Title = new Element(
      global.page,
      this.templateList.locator('div[data-slot="alert-title"]'),
      GenerateDocumentTabStrings.Label_NoTemplatesFoundAlert_Title
    )
    this.Label_NoTemplatesFoundAlert_Description = new Element(
      global.page,
      this.templateList.locator('div[data-slot="alert-description"]'),
      GenerateDocumentTabStrings.Label_NoTemplatesFoundAlert_Description
    )
  }

  async NavigateDirectly(): Promise<void> {
    await super.NavigateDirectly(this.URL)
    await this.WaitForLoad()
    await this.page.waitForTimeout(5000)
    await this.Button_StartGenerationOfDocument.locator.waitFor({ state: 'visible' })
  }

  async IsTemplateListEmpty() {
    const visibility = await this.Label_NoTemplatesFoundAlert_Title.locator.isVisible()
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
    const card = new ClaimsPortalDocumentTemplateCard(this.global, this.templateListItems, index)
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
    await this.Button_StartGenerationOfDocument.Click()
    const statusPage = new ClaimsPortalGenerateDocumentStatusPage(
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
