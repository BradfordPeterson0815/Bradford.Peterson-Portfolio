import { Locator } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { WorkAuthorizationCreateTabStrings } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalJob } from '../claimsPortalJob.js'
import { ClaimsPortalBasePage } from '../pages/claimsPortalBasePage.js'

export class ClaimsPortalWorkAuthorizationCreateTab extends ClaimsPortalBasePage {
  readonly job: ClaimsPortalJob
  readonly URL: string
  readonly StepOne_Title: Element
  readonly StepTwo_Title: Element
  readonly Button_Next: Element
  readonly Button_Back: Element
  readonly StepOne_Button_ClearFilter: Element
  readonly StepOne_TextBox_Filter: Element
  readonly templates: Locator

  constructor(global: ClaimsPortalGlobal, job: ClaimsPortalJob, jobPageURL: string) {
    super(global)
    this.job = job
    this.URL = `${jobPageURL}/create`
    this.StepOne_Title = new Element(
      global.page,
      this.page.locator(`#root .chakra-card__header > div > h2`),
      WorkAuthorizationCreateTabStrings.StepOne_Title
    )
    this.StepTwo_Title = new Element(
      global.page,
      this.page.locator(`#root .chakra-card__header > div > h2`),
      WorkAuthorizationCreateTabStrings.StepTwo_Title
    )
    this.Button_Next = new Element(
      global.page,
      this.page.getByRole('button', { name: `${WorkAuthorizationCreateTabStrings.Button_Next}` }),
      WorkAuthorizationCreateTabStrings.Button_Next
    )
    this.Button_Back = new Element(
      global.page,
      this.page.getByRole('button', { name: `${WorkAuthorizationCreateTabStrings.Button_Back}` }),
      WorkAuthorizationCreateTabStrings.Button_Next
    )
    this.StepOne_TextBox_Filter = new Element(
      global.page,
      this.page.locator(`#stepOne input[aria-label="Search templates..."]`)
    )
    this.StepOne_Button_ClearFilter = new Element(
      global.page,
      this.page.locator(`#stepOne button[aria-label="Clear filter"]`)
    )
    this.templates = this.page.locator(
      '#stepOne div[role="radiogroup"] > div > div > .chakra-stack__item'
    )
  }

  async StepOne_VisibleTemplatesCount() {
    await this.page.waitForTimeout(1000)
    return await this.templates.count()
  }

  async StepOne_SelectTemplateByIndex(index: number) {
    const templateLocator = this.templates.nth(index).locator('label')
    await templateLocator.click()
    return templateLocator
  }

  async StepOne_SelectTemplateByName(targetTemplateName: string) {
    const templates = await this.StepOne_VisibleTemplatesCount()
    for (let index = 0; index < templates; index++) {
      const templateName = await this.page
        .locator('label > span > div > span:first-child')
        .nth(index)
        .textContent()
      if (templateName != null && templateName.includes(targetTemplateName)) {
        const templateLocator = this.templates.nth(index).locator('label')
        await templateLocator.click()
        return templateLocator
      }
    }
    return null
  }
}
