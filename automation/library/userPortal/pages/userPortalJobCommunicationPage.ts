import { Locator, expect } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { UserPortalRequestCallbackDrawer } from '../drawers/userPortalRequestCallbackDrawer.js'
import { DrawerStrings, JobCommunicationPageStrings } from '../userPortalConstants.js'
import { UserPortalGlobal } from '../userPortalGlobal.js'
import { UserPortalJobPage } from './userPortalJobPage.js'
import { UserPortalJob } from '../userPortalJob.js'

export class UserPortalJobCommunicationPage extends UserPortalJobPage {
  readonly Label_ContactUs_Title: Element
  readonly contact_Section: Locator
  readonly contact_Name: Locator
  readonly contact_Phone: Locator
  readonly contact_Email: Locator
  readonly contact_Unavailable: Locator
  readonly Label_RequestACallback_Title: Element
  readonly Button_RequestCallback_CompanyClaimsPortal: Element
  readonly Button_RequestCallback_YourProjectManager: Element
  constructor(global: UserPortalGlobal, job: UserPortalJob) {
    super(global, job)
    this.URL = `${this.baseURL}/communication`
    this.Label_ContactUs_Title = new Element(
      global.page,
      this.page.getByRole('heading', {
        name: `${JobCommunicationPageStrings.Label_ContactUs_Title}`,
      }),
      JobCommunicationPageStrings.Label_ContactUs_Title
    )
    this.Label_ContactUs_Title = new Element(
      global.page,
      this.page.getByRole('heading', {
        name: `${JobCommunicationPageStrings.Label_ContactUs_Title}`,
      }),
      JobCommunicationPageStrings.Label_ContactUs_Title
    )
    this.contact_Section = this.page.locator(
      'div[id$="-communication-step"] .chakra-card__body > .chakra-stack > .chakra-stack'
    )
    this.contact_Name = this.page.locator('h3')
    this.contact_Phone = this.page.locator('a[href^="tel:"]')
    this.contact_Unavailable = this.page.locator('p')
    this.contact_Email = this.page.locator('a[href^="mailto:"]')

    this.Label_RequestACallback_Title = new Element(
      global.page,
      this.page.getByRole('heading', {
        name: `${JobCommunicationPageStrings.label_RequestACallback_Title}`,
      }),
      JobCommunicationPageStrings.label_RequestACallback_Title
    )
    this.Button_RequestCallback_CompanyClaimsPortal = new Element(
      global.page,
      this.page.locator('div[id$="-communication-step"] button').nth(0),
      JobCommunicationPageStrings.Button_RequestCallback_CompanyClaimsPortal
    )
    this.Button_RequestCallback_YourProjectManager = new Element(
      global.page,
      this.page.locator('div[id$="-communication-step"] button').nth(1),
      JobCommunicationPageStrings.Button_RequestCallback_YourProjectManager
    )
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.NavigateDirectly(this.global.baseUrl)
    } else {
      await this.leftNavBar.Link_ContactUs.Click()
    }
    await this.WaitForLoad()
    await this.page.waitForTimeout(2000)
  }

  async WaitForLoad() {
    await this.page.waitForLoadState()
    await this.Label_ContactUs_Title.locator.waitFor({ state: 'visible' })
  }

  async GetContactInfo(contactIndex: number) {
    const sectionParent = this.contact_Section.nth(contactIndex)
    const name = await sectionParent.locator(this.contact_Name).textContent()
    const phoneExists = (await sectionParent.locator(this.contact_Phone).count()) > 0
    const emailExists = (await sectionParent.locator(this.contact_Email).count()) > 0
    const emailOffset = !phoneExists && !emailExists ? 1 : 0
    const phone = phoneExists
      ? await sectionParent.locator(this.contact_Phone).nth(0).textContent()
      : await sectionParent.locator(this.contact_Unavailable).nth(0).textContent()
    const email = emailExists
      ? await sectionParent.locator(this.contact_Email).nth(0).textContent()
      : await sectionParent.locator(this.contact_Unavailable).nth(emailOffset).textContent()

    return { name, phone, email }
  }

  async VerifyContactInfo(
    index: number,
    expectedContact: { name: string; phone: string; email: string }
  ) {
    const {
      name: actualName,
      phone: actualPhone,
      email: actualEmail,
    } = await this.GetContactInfo(index)
    const calculatedPhone =
      expectedContact.phone === '' ? 'Phone Unavailable' : expectedContact.phone
    const calculatedEmail =
      expectedContact.email === '' ? 'Email Unavailable' : expectedContact.email
    expect(expectedContact.name).toBe(actualName)
    expect(calculatedPhone).toBe(actualPhone)
    expect(calculatedEmail).toBe(actualEmail)
  }

  async OpenRequestCallbackDrawerForCompanyClaimsPortal() {
    await this.Button_RequestCallback_CompanyClaimsPortal.Click()
    return new UserPortalRequestCallbackDrawer(
      this.global,
      DrawerStrings.RequestCallback_Title_CompanyClaimsPortal
    )
  }

  async OpenRequestCallbackDrawerForYourProjectManager() {
    await this.Button_RequestCallback_YourProjectManager.Click()
    return new UserPortalRequestCallbackDrawer(
      this.global,
      DrawerStrings.RequestCallback_Title_YourProjectManager
    )
  }
}
