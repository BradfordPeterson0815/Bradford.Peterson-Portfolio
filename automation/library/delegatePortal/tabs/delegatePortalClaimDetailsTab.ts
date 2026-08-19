import { Locator, expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { DelegatePortalBasePage } from '../pages/delegatePortalBasePage.js'
import { DelegatePortalClaim } from '../delegatePortalClaim.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { ClaimDetailsTabStrings } from '../delegatePortalConstants.js'
import { DelegatePortalClaimTimelineTab } from './delegatePortalClaimTimelineTab.js'
import { DelegatePortalRecordCustomerCommunicationDrawer } from '../drawers/delegatePortalRecordCustomerCommunicationDrawer.js'

export class DelegatePortalClaimDetailsTab extends DelegatePortalBasePage {
  readonly claim: DelegatePortalClaim
  readonly URL: string
  readonly Label_BasicInfo_Title: Element
  readonly Label_BasicInfo_ClaimNumber: Element
  readonly Label_BasicInfo_PolicyNumber: Element
  readonly Label_BasicInfo_Carrier: Element
  readonly Label_BasicInfo_Coordinator: Element
  readonly Label_BasicInfo_FieldAgent: Element
  readonly Label_BasicInfo_InspectionTech: Element
  readonly Label_BasicInfo_HasLegalRep: Element
  readonly Label_BasicInfo_HasJob: Element
  readonly Label_BasicInfo_ClaimStatus: Element
  readonly Label_LossInformation_Title: Element
  readonly Label_LossInformation_LossDate: Element
  readonly Label_LossInformation_LossType: Element
  readonly Label_LossInformation_CatCode: Element
  readonly Label_LossInformation_ClaimFactors: Element
  readonly Label_LossInformation_LossDescription: Element
  readonly Label_LossLocation_Title: Element
  readonly Label_LossLocation_Street: Element
  readonly Label_LossLocation_SecondaryStreet: Element
  readonly Label_LossLocation_City: Element
  readonly Label_LossLocation_County: Element
  readonly Label_LossLocation_State: Element
  readonly Label_LossLocation_ZipCode: Element
  readonly Link_LossLocation_Map: Element
  readonly Label_LossLocationMap_Title: Element
  readonly Map_LossLocationMap: Element
  readonly Button_RecordCustomerCommunication: Element
  readonly Label_ContactInformation_Title: Element
  readonly Label_ContactInformation_Name: Element
  readonly Link_ContactInformation_Phone: Element
  readonly Link_ContactInformation_Email: Element
  readonly Label_ClaimTimeline_Title: Element
  readonly Link_ViewFullTimeline: Locator
  readonly timelineEvents: Locator
  readonly baseUrl: string

  constructor(global: DelegatePortalGlobal, claim: DelegatePortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/info`
    this.baseUrl = claimPageURL
    this.Label_BasicInfo_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"]').nth(0),
      ClaimDetailsTabStrings.BasicInfo_Title
    )
    this.Label_BasicInfo_ClaimNumber = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimDetailsTabStrings.BasicInfo_ClaimNumber)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.basicInfo.claimNumber
    )
    this.Label_BasicInfo_PolicyNumber = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimDetailsTabStrings.BasicInfo_PolicyNumber)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.basicInfo.policyNumber
    )
    this.Label_BasicInfo_Carrier = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(1)
        .getByText(ClaimDetailsTabStrings.BasicInfo_Carrier)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.basicInfo.carrier
    )
    this.Label_BasicInfo_Coordinator = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(1)
        .getByText(ClaimDetailsTabStrings.BasicInfo_Coordinator)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.basicInfo.coordinator
    )
    this.Label_BasicInfo_FieldAgent = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(1)
        .getByText(ClaimDetailsTabStrings.BasicInfo_FieldAgent)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.basicInfo.fieldAgent
    )
    this.Label_BasicInfo_InspectionTech = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(1)
        .getByText(ClaimDetailsTabStrings.BasicInfo_InspectionTech)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.basicInfo.inspectionTech
    )
    this.Label_BasicInfo_HasLegalRep = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(2)
        .getByText(ClaimDetailsTabStrings.BasicInfo_HasLegalRep)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.basicInfo.hasLegalRep
    )
    this.Label_BasicInfo_HasJob = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(2)
        .getByText(ClaimDetailsTabStrings.BasicInfo_HasJob)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.basicInfo.hasJob
    )
    this.Label_BasicInfo_ClaimStatus = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"] > div')
        .nth(0)
        .locator('> dl')
        .nth(2)
        .getByText(ClaimDetailsTabStrings.BasicInfo_ClaimStatus)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.basicInfo.claimStatus
    )

    this.Label_LossInformation_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"]').nth(1),
      ClaimDetailsTabStrings.LossInformation_Title
    )
    this.Label_LossInformation_LossDate = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimDetailsTabStrings.LossInformation_LossDate)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossInformation.date
    )
    this.Label_LossInformation_LossType = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimDetailsTabStrings.LossInformation_LossType)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossInformation.type
    )
    this.Label_LossInformation_CatCode = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimDetailsTabStrings.LossInformation_CATCode)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossInformation.catCode
    )
    this.Label_LossInformation_ClaimFactors = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimDetailsTabStrings.LossInformation_ClaimFactors)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossInformation.claimFactors
    )
    this.Label_LossInformation_LossDescription = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(1)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimDetailsTabStrings.LossInformation_LossDescription)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossInformation.description
    )

    this.Label_LossLocation_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"]').nth(2),
      ClaimDetailsTabStrings.LossLocation_Title
    )
    this.Label_LossLocation_Street = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimDetailsTabStrings.LossLocation_Street, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossLocation.street
    )
    this.Label_LossLocation_SecondaryStreet = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimDetailsTabStrings.LossLocation_SecondaryStreet, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossLocation.secondaryStreet
    )
    this.Label_LossLocation_City = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimDetailsTabStrings.LossLocation_City)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossLocation.city
    )
    this.Label_LossLocation_County = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimDetailsTabStrings.LossLocation_County)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossLocation.county
    )
    this.Label_LossLocation_State = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimDetailsTabStrings.LossLocation_State)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossLocation.state
    )
    this.Label_LossLocation_ZipCode = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimDetailsTabStrings.LossLocation_ZipCode)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossLocation.zipCode
    )
    this.Link_LossLocation_Map = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(2)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimDetailsTabStrings.LossLocation_Map, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> dd > a'),
      claim.lossLocation.map
    )
    this.Label_LossLocationMap_Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: ClaimDetailsTabStrings.LossLocationMap_Title }),
      ClaimDetailsTabStrings.LossLocationMap_Title
    )
    this.Map_LossLocationMap = new Element(global.page, this.page.locator('.mapboxgl-map'))

    this.Button_RecordCustomerCommunication = new Element(
      global.page,
      this.page.locator('div[id$="_title"] button'),
      ClaimDetailsTabStrings.Button_RecordCustomerCommunication
    )

    this.Label_ContactInformation_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(4),
      ClaimDetailsTabStrings.ContactInformation_Title
    )
    this.Label_ContactInformation_Name = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(4)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimDetailsTabStrings.ContactInformation_Name)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.contact.name
    )
    this.Link_ContactInformation_Phone = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(4)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimDetailsTabStrings.ContactInformation_Phone)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.contact.phone
    )
    this.Link_ContactInformation_Email = new Element(
      global.page,
      this.page
        .locator('div[id$="_content"]')
        .nth(4)
        .locator('> dl')
        .nth(0)
        .getByText(ClaimDetailsTabStrings.ContactInformation_Email)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.contact.email
    )

    this.Label_ClaimTimeline_Title = new Element(
      global.page,
      this.page.locator('div[id$="_title"] h2').nth(5),
      ClaimDetailsTabStrings.ClaimTimeline_Title
    )

    this.Link_ViewFullTimeline = this.page
      .locator('div.chakra-card__header')
      .nth(5)
      .locator('a')
      .nth(0)

    this.timelineEvents = this.page
      .locator('div[id$="_content"]')
      .nth(5)
      .locator('> div > div.chakra-stack > div.chakra-stack')
  }

  async VerifyBasicInfoSection() {
    await this.Label_BasicInfo_Title.VerifyExpectedText()
    await this.Label_BasicInfo_ClaimNumber.VerifyExpectedTextAlt()
    await this.Label_BasicInfo_PolicyNumber.VerifyExpectedTextAlt('', true)
    await this.Label_BasicInfo_Carrier.VerifyExpectedTextAlt()
    await this.Label_BasicInfo_Coordinator.VerifyExpectedTextAlt()
    await this.Label_BasicInfo_FieldAgent.VerifyExpectedTextAlt()
    await this.Label_BasicInfo_InspectionTech.VerifyExpectedTextAlt()
    await this.Label_BasicInfo_HasLegalRep.VerifyExpectedTextAlt()
    await this.Label_BasicInfo_HasJob.VerifyExpectedTextAlt()
    await this.Label_BasicInfo_ClaimStatus.VerifyExpectedTextAlt()
  }

  async VerifyLossInformationSection() {
    await this.Label_LossInformation_Title.VerifyExpectedText()
    await this.Label_LossInformation_LossDate.VerifyExpectedTextAlt()
    await this.Label_LossInformation_LossType.VerifyExpectedTextAlt()

    if ((await this.Label_LossInformation_CatCode.locator.count()) > 0) {
      this.Label_LossInformation_CatCode.VerifyExpectedTextAlt()
    }
    if ((await this.Label_LossInformation_ClaimFactors.locator.count()) > 0) {
      this.Label_LossInformation_ClaimFactors.VerifyExpectedTextAlt()
    }
    // since we may be appending data here, we need to just check to see if it starts with what we expect
    const actualText = await this.Label_LossInformation_LossDescription.locator.textContent()
    expect(actualText?.startsWith(this.Label_LossInformation_LossDescription.expectedText)).toBe(
      true
    )
  }

  async VerifyLossLocationSection() {
    await this.Label_LossLocation_Title.VerifyExpectedText()
    await this.Label_LossLocation_Street.VerifyExpectedTextAlt()
    await this.Label_LossLocation_SecondaryStreet.VerifyExpectedTextAlt()
    await this.Label_LossLocation_City.VerifyExpectedTextAlt('', true)
    if ((await this.Label_LossLocation_County.locator.count()) > 0) {
      this.Label_LossLocation_County.VerifyExpectedTextAlt()
    }
    await this.Label_LossLocation_State.VerifyExpectedTextAlt()
    await this.Label_LossLocation_ZipCode.VerifyExpectedTextAlt()
    await this.Link_LossLocation_Map.VerifyExpectedTextAlt()
  }

  async VerifyLossLocationMapSection() {
    await this.Label_LossLocationMap_Title.VerifyExpectedText()
    expect(await this.Map_LossLocationMap.locator.isVisible()).toBe(true)
  }

  async VerifyContactInformationSection() {
    await this.Button_RecordCustomerCommunication.VerifyExpectedText()
    await this.Label_ContactInformation_Title.VerifyExpectedText()
    await this.Label_ContactInformation_Name.VerifyExpectedTextAlt()
    await this.Link_ContactInformation_Phone.VerifyExpectedTextAlt()
    await this.Link_ContactInformation_Email.VerifyExpectedTextAlt()
  }

  async VerifyClaimTimelineSection() {
    await this.Label_ClaimTimeline_Title.VerifyExpectedText()
    await this.Link_ViewFullTimeline.isVisible()
  }

  async TimelineEventCount() {
    const count = await this.timelineEvents.count()
    return count
  }

  async GetTimelineEvent(index: number) {
    const specificEventParent = this.timelineEvents.nth(index)
    const eventName = await specificEventParent
      .locator('> div:nth-child(2) p:nth-child(1)')
      .textContent()
    const eventDate = await specificEventParent
      .locator('> div:nth-child(2) p:nth-child(2)')
      .textContent()
    const scheduledForLocator = specificEventParent.locator('> div:nth-child(2) p:nth-child(3)')
    const scheduledFor =
      (await scheduledForLocator.count()) > 0 ? await scheduledForLocator.textContent() : ''
    const scheduledDate = scheduledFor?.split('Scheduled for:')[1]
    const createdBy = await specificEventParent.locator('span[property="createdBy"]').textContent()
    return { eventName, eventDate, scheduledDate, createdBy }
  }

  async OpenMapLinkInNewTabVerifyTitleAndClose(streetAddress: string) {
    const pagePromise = this.context.waitForEvent('page')
    await this.Link_LossLocation_Map.Click()
    this.page = await pagePromise
    await this.page.waitForLoadState()
    await this.page.bringToFront()
    const pageDescription = new Element(
      this.global.page,
      this.page.locator('div[role="main"] h1'),
      `${streetAddress}`
    )
    await pageDescription.VerifyExpectedText()
    await this.page.close()
  }

  async IsCoordinatorAssigned() {
    const assignment = await this.Label_BasicInfo_Coordinator.GetText()
    return !(assignment == 'Unassigned')
  }

  async IsFieldAgentAssigned() {
    const assignment = await this.Label_BasicInfo_FieldAgent.GetText()
    return !(assignment == 'Unassigned')
  }

  async OpenFullTimeline() {
    await this.Link_ViewFullTimeline.click()
    await this.page.waitForTimeout(1000)
    const claimTimelineTab = new DelegatePortalClaimTimelineTab(this.global, this.claim, this.baseUrl)
    return claimTimelineTab
  }

  async OpenRecordCustomerCommunicationDrawer() {
    await this.Button_RecordCustomerCommunication.Click()
    const recordCustomerCommunicationDrawer = new DelegatePortalRecordCustomerCommunicationDrawer(
      this.global
    )
    await expect(recordCustomerCommunicationDrawer.Title.locator).toBeAttached()
    return recordCustomerCommunicationDrawer
  }
}
