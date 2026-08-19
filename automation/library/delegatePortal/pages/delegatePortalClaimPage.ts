import { Locator } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { DelegatePortalBasePage } from './delegatePortalBasePage.js'
import { DelegatePortalClaim } from '../delegatePortalClaim.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { ClaimTabTypes, ClaimPageStrings } from '../delegatePortalConstants.js'
import { DelegatePortalCreateNoteDrawer } from '../drawers/delegatePortalCreateNoteDrawer.js'
import { DelegatePortalClaimDetailsTab } from '../tabs/delegatePortalClaimDetailsTab.js'
import { DelegatePortalClaimCallbacksTab } from '../tabs/delegatePortalClaimCallbacksTab.js'
import { DelegatePortalClaimContactsTab } from '../tabs/delegatePortalClaimContactsTab.js'
import { DelegatePortalClaimDocumentsTab } from '../tabs/delegatePortalClaimDocumentsTab.js'
import { DelegatePortalClaimMediaTab } from '../tabs/delegatePortalClaimMediaTab.js'
import { DelegatePortalClaimScheduleTab } from '../tabs/delegatePortalClaimScheduleTab.js'
import { DelegatePortalClaimEstimatesTab } from '../tabs/delegatePortalClaimEstimatesTab.js'
import { DelegatePortalClaimInspectionsTab } from '../tabs/delegatePortalClaimInspectionsTab.js'
import { DelegatePortalClaimNotesTab } from '../tabs/delegatePortalClaimNotesTab.js'
import { DelegatePortalClaimLossReportTab } from '../tabs/delegatePortalClaimLossReportTab.js'
import { DelegatePortalRecordCustomerCommunicationDrawer } from '../drawers/delegatePortalRecordCustomerCommunicationDrawer.js'

export class DelegatePortalClaimPage extends DelegatePortalBasePage {
  readonly claimHeaderParent: Locator
  readonly contactParent: Locator
  readonly claim: DelegatePortalClaim
  readonly baseURL: string
  readonly Title: Element
  readonly Button_Claims: Element
  readonly Link_AllClaims: Element
  readonly Link_ClaimHome: Element
  readonly Label_ClaimNumber: Element
  readonly Link_PrimaryContact_Phone: Element
  readonly Link_PrimaryContact_Email: Element
  readonly Link_PrimaryContact_Address: Element
  readonly Button_LossDescription: Element
  readonly Label_LossDescriptionDetail: Element

  constructor(global: DelegatePortalGlobal, claim: DelegatePortalClaim) {
    super(global)

    this.claim = claim
    this.claimHeaderParent = this.page.locator('#root div.chakra-container > div')
    this.contactParent = this.global.isMobile
      ? this.claimHeaderParent.locator('> div:nth-child(1) > div > div:nth-child(2)')
      : this.claimHeaderParent.locator('> div:nth-child(2) > div > div:nth-child(2)')

    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${this.claim.contact.name}` }),
      this.claim.contact.name
    )
    this.baseURL = `${global.baseUrl}claims/${this.claim.basicInfo.claimNumber}`
    this.Button_Claims = new Element(
      global.page,
      this.claimHeaderParent.locator('div button[href="/claims"]'),
      ClaimPageStrings.Button_Claims
    )
    this.Link_AllClaims = new Element(
      global.page,
      this.claimHeaderParent.locator('div a[href="/claims"]'),
      ClaimPageStrings.Link_AllClaims
    )
    this.Link_ClaimHome = new Element(
      global.page,
      this.claimHeaderParent.locator(`div a[href="/claims/${claim.basicInfo.claimNumber}"]`),
      ClaimPageStrings.Link_ClaimHome
    )
    this.Label_ClaimNumber = new Element(global.page, this.contactParent.locator('p'))
    this.Link_PrimaryContact_Phone = new Element(
      global.page,
      this.contactParent.locator('div a[href^="tel:"]')
    )
    this.Link_PrimaryContact_Email = new Element(
      global.page,
      this.contactParent.locator('div a[href^="mailto:"]')
    )
    this.Link_PrimaryContact_Address = new Element(
      global.page,
      this.contactParent.locator('div a[target="_blank"]')
    )
    this.Button_LossDescription = new Element(
      global.page,
      this.page.locator('.chakra-accordion button'),
      ClaimPageStrings.LossDescription
    )
    this.Label_LossDescriptionDetail = new Element(
      global.page,
      this.page.locator('.chakra-accordion p'),
      this.claim.lossInformation.description
    )
  }

  async IsLossDescriptionExpanded() {
    const isExpandedAttrib = await this.Button_LossDescription.locator.getAttribute('aria-expanded')
    return isExpandedAttrib == 'true'
  }

  async IsTabActive(claimTab: ClaimTabTypes) {
    await this.page.waitForTimeout(1000)
    const targetLocator = this.LookupClaimTabLocator(claimTab)
    const result = (await targetLocator.getAttribute('aria-selected')) == 'true'
    return result
  }

  LookupClaimTabLocator(claimTab: ClaimTabTypes) {
    const baseTabLocator = 'data-id="/_auth/claims/$claimNumber/_layout'
    switch (claimTab) {
      case ClaimTabTypes.Details:
        return this.global.isMobile
          ? this.page.getByRole('link', { name: `${ClaimPageStrings.Tab_Details}` })
          : this.page.locator(`a[${baseTabLocator}/info"]`)
      case ClaimTabTypes.Schedule:
        return this.global.isMobile
          ? this.page.getByRole('link', { name: `${ClaimPageStrings.Tab_Schedule}` })
          : this.page.locator(`a[${baseTabLocator}/inspections"]`)
      case ClaimTabTypes.Estimates:
        return this.global.isMobile
          ? this.page.getByRole('link', { name: `${ClaimPageStrings.Tab_Estimates}` })
          : this.page.locator(`a[${baseTabLocator}/estimates"]`)
      case ClaimTabTypes.Contacts:
        return this.global.isMobile
          ? this.page.getByRole('link', { name: `${ClaimPageStrings.Tab_Contacts}` })
          : this.page.locator(`a[${baseTabLocator}/contacts"]`)
      case ClaimTabTypes.Documents:
        return this.global.isMobile
          ? this.page.getByRole('link', { name: `${ClaimPageStrings.Tab_Documents}` })
          : this.page.locator(`a[${baseTabLocator}/documents"]`)
      case ClaimTabTypes.Media:
        return this.global.isMobile
          ? this.page.getByRole('link', { name: `${ClaimPageStrings.Tab_Media}` })
          : this.page.locator(`a[${baseTabLocator}/media"]`)
      case ClaimTabTypes.Notes:
        return this.global.isMobile
          ? this.page.getByRole('link', { name: `${ClaimPageStrings.Tab_Notes}` })
          : this.page.locator(`a[${baseTabLocator}/notes"]`)
      case ClaimTabTypes.Callbacks:
        return this.global.isMobile
          ? this.page.getByRole('link', { name: `${ClaimPageStrings.Tab_CallbackRequests}` })
          : this.page.locator(`a[${baseTabLocator}/callbacks"]`)
      case ClaimTabTypes.Inspections:
        return this.global.isMobile
          ? this.page.getByRole('link', { name: `${ClaimPageStrings.Tab_Inspections}` })
          : this.page.locator(`a[${baseTabLocator}/inspections"]`)
      case ClaimTabTypes.LossReport:
        return this.global.isMobile
          ? this.page.getByRole('link', { name: `${ClaimPageStrings.Tab_LossReport}` })
          : this.page.locator(`a[${baseTabLocator}/loss-report"]`)
      default:
        throw new Error(`Undefined Claim Tab type : ${claimTab}`)
    }
  }

  async SelectAddANote() {
    const createNoteDrawer = new DelegatePortalCreateNoteDrawer(this.global)
    await this.page.getByRole('button', { name: `${ClaimPageStrings.Button_AddANote}` }).click()
    return createNoteDrawer
  }

  async SelectRecordCommunication() {
    const recordCustomerCommunicationDrawer = new DelegatePortalRecordCustomerCommunicationDrawer(
      this.global
    )
    await this.page
      .getByRole('button', { name: `${ClaimPageStrings.Button_RecordCommunication}` })
      .click()
    return recordCustomerCommunicationDrawer
  }

  async SelectViewInMap() {
    const infoTab = new DelegatePortalClaimDetailsTab(this.global, this.claim, this.baseURL)
    await this.page.getByRole('link', { name: `${ClaimPageStrings.Link_ViewInMap}` }).click()
    const locatorToWaitFor = infoTab.Map_LossLocationMap.locator
    await locatorToWaitFor.waitFor({ state: 'visible' })
    return infoTab
  }

  async SelectViewTimeline() {
    const infoTab = new DelegatePortalClaimDetailsTab(this.global, this.claim, this.baseURL)
    await this.page.getByRole('link', { name: `${ClaimPageStrings.Link_ViewTimeline}` }).click()
    const locatorToWaitFor = this.page.getByRole('heading', {
      name: `${ClaimPageStrings.Label_ClaimTimeline}`,
    })
    await locatorToWaitFor.waitFor({ state: 'visible' })
    return infoTab
  }

  async SelectClaimTab(claimTab: ClaimTabTypes) {
    const targetLocator = this.LookupClaimTabLocator(claimTab)
    let tabToReturn
    let locatorToWaitFor: Locator
    await targetLocator.click()
    switch (claimTab) {
      case ClaimTabTypes.Details:
        tabToReturn = new DelegatePortalClaimDetailsTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.Label_BasicInfo_Title.locator
        break
      case ClaimTabTypes.Schedule:
        tabToReturn = new DelegatePortalClaimScheduleTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.Button_ScheduleInspection.locator
        break
      case ClaimTabTypes.Estimates:
        tabToReturn = new DelegatePortalClaimEstimatesTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_Estimates.Button_ExpandTable.locator
        break
      case ClaimTabTypes.Contacts:
        tabToReturn = new DelegatePortalClaimContactsTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.Button_CreateContact.locator
        break
      case ClaimTabTypes.Documents:
        tabToReturn = new DelegatePortalClaimDocumentsTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.Link_UploadDocuments.locator
        break
      case ClaimTabTypes.Media:
        tabToReturn = new DelegatePortalClaimMediaTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.Link_UploadMedia.locator
        break
      case ClaimTabTypes.Notes:
        tabToReturn = new DelegatePortalClaimNotesTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.Button_AddNote.locator
        break
      case ClaimTabTypes.Callbacks:
        tabToReturn = new DelegatePortalClaimCallbacksTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_Callbacks.Button_ExpandTable.locator
        break
      case ClaimTabTypes.Inspections:
        tabToReturn = new DelegatePortalClaimInspectionsTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_Inspections.Button_ExpandTable.locator.first()
        break
      case ClaimTabTypes.LossReport:
        tabToReturn = new DelegatePortalClaimLossReportTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.FuzzyLossReportButtonLocator
        break
      default:
        throw new Error(`Undefined Claim Tab type : ${claimTab}`)
    }
    await targetLocator.getAttribute('aria-selected', { timeout: 3000 })
    await locatorToWaitFor.nth(0).waitFor({ state: 'visible' })
    await tabToReturn.CustomLoad()
    return tabToReturn
  }

  async NavigateDirectlyToClaim() {
    await this.page.goto(this.baseURL)
    await this.page.waitForURL(this.baseURL, { waitUntil: 'domcontentloaded' })
  }
}
