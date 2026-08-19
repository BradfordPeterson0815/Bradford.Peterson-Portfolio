import { Locator, expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { DelegatePortalBasePage } from './delegatePortalBasePage.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { GenerateDocumentStatusPageStrings } from '../delegatePortalConstants.js'

export class DelegatePortalGenerateDocumentStatusPage extends DelegatePortalBasePage {
  readonly baseURL: string
  readonly Title: Element
  readonly Link_GenerateAnotherDraftDocument: Element
  readonly Link_Download: Element
  readonly Label_Success: Element
  readonly labelDescription: Locator
  readonly parent: Locator
  readonly header: Locator
  readonly content: Locator
  readonly successAlert: Locator
  readonly templateId: string
  readonly templateName: string

  constructor(
    global: DelegatePortalGlobal,
    generateDocumentPageUrl: string,
    templateName: string,
    templateId: string
  ) {
    super(global)
    this.templateId = templateId
    this.templateName = templateName
    this.baseURL = `${generateDocumentPageUrl}/status/corn:templates:template:${templateId}`
    this.parent = this.page.locator('div[data-slot="card"]')
    this.header = this.parent.locator('div[data-slot="card-header"]')
    this.content = this.parent.locator('div[data-slot="card-content"]')
    this.successAlert = this.content.locator('div[data-slot="alert-content"]').first()
    this.Link_GenerateAnotherDraftDocument = new Element(
      global.page,
      this.header.locator('div[data-slot="card-toolbar"] a').first(),
      GenerateDocumentStatusPageStrings.Link_GenerateAnotherDraftDocument
    )
    this.Title = new Element(
      global.page,
      this.header.locator('h3'),
      GenerateDocumentStatusPageStrings.Title
    )
    this.Label_Success = new Element(
      global.page,
      this.successAlert.locator('div[data-slot="alert-title"]'),
      GenerateDocumentStatusPageStrings.Label_Success
    )
    this.Link_Download = new Element(
      global.page,
      this.successAlert.locator('div[data-slot="alert-description"] a').first(),
      GenerateDocumentStatusPageStrings.Link_Download
    )
    this.labelDescription = this.content.locator('div[data-slot="card-description"]')
  }

  async VerifyDescriptionAfterSuccess() {
    const currentDescription = (await this.labelDescription.textContent()) ?? ''
    expect(
      currentDescription.startsWith(GenerateDocumentStatusPageStrings.Label_Description_Prefix)
    ).toBe(true)
    const targetContent = GenerateDocumentStatusPageStrings.Label_Description_Content.replace(
      '<TEMPLATENAME>',
      this.templateName
    )
    expect(currentDescription.includes(targetContent)).toBe(true)
    expect(
      currentDescription.includes(GenerateDocumentStatusPageStrings.Label_Description_Suffix)
    ).toBe(true)
  }

  async VerifyDraftDocumentDownload() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'), // wait for download to start
      await this.Link_Download.Click(),
    ])
    const suggestedName = download.suggestedFilename()
    const endsWithDocx = suggestedName.endsWith('.docx')
    expect(endsWithDocx).toBe(true)

    const makeUnderlish = this.templateName.split(' ').join('_')
    const startsWithTitle = suggestedName.startsWith(`DRAFT_${makeUnderlish}`)
    expect(startsWithTitle).toBe(true)
  }
}
