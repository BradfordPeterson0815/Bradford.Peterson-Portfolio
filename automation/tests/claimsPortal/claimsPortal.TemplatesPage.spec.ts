import { expect } from '@playwright/test'
import { DefaultEnvironment, TemplateTabTypes } from '../../library/claimsPortal/claimsPortalConstants.js'
import { Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalTemplatesPage } from '../../library/claimsPortal/pages/claimsPortalTemplatesPage.js'
import test from '../../library/shared/testHooks.js'
import { Tags } from '../../library/shared/constants.js'

const environment = DefaultEnvironment

test.describe(
  'Templates Page',
  {
    tag: [Tags.ClaimsPortal, Tags.Templates],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
      const templatesPage = new ClaimsPortalTemplatesPage(global)
      await templatesPage.NavigateToPage()

      const communicationTemplatesTab = await templatesPage.SelectTemplateTab(
        TemplateTabTypes.Communication
      )
      expect(await templatesPage.IsTabActive(TemplateTabTypes.Communication)).toBe(true)
      const actualCommunicationTemplatesTabUrl = templatesPage.page.url()
      expect(actualCommunicationTemplatesTabUrl).toBe(communicationTemplatesTab.URL)

      const documentTemplatesTab = await templatesPage.SelectTemplateTab(TemplateTabTypes.Document)
      expect(await templatesPage.IsTabActive(TemplateTabTypes.Document)).toBe(true)
      const actualDocumentTemplatesTabUrl = templatesPage.page.url()
      expect(actualDocumentTemplatesTabUrl).toBe(documentTemplatesTab.URL)

      const noteTemplatesTab = await templatesPage.SelectTemplateTab(TemplateTabTypes.Note)
      expect(await templatesPage.IsTabActive(TemplateTabTypes.Note)).toBe(true)
      const actualNoteTemplatesTabUrl = templatesPage.page.url()
      expect(actualNoteTemplatesTabUrl).toBe(noteTemplatesTab.URL)
    })
  }
)
