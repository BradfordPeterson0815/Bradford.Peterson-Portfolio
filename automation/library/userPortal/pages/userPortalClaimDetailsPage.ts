import { Locator, expect } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { UserPortalClaim } from '../userPortalClaim.js'
import { ClaimDetailsPageStrings } from '../userPortalConstants.js'
import { UserPortalGlobal } from '../userPortalGlobal.js'
import { UserPortalClaimPage } from './userPortalClaimPage.js'

export class UserPortalClaimDetailsPage extends UserPortalClaimPage {
  readonly Label_ClaimProcess_Title: Element
  readonly Label_ClaimProcess_ClaimNumber: Element
  readonly Label_ClaimProcess_Status: Element
  readonly Label_ClaimProcess_Coordinator: Element
  readonly Label_ClaimProcess_FieldAgentName: Element
  readonly Label_ClaimProcess_ScheduledAppointmentDate: Element
  readonly Label_ClaimDetails_Title: Element
  readonly Label_ClaimDetails_LossType: Element
  readonly Label_ClaimDetails_LossDate: Element
  readonly Label_ClaimDetails_LossDescription: Element
  readonly Label_LossLocation_Title: Element
  readonly Label_LossLocation_Street: Element
  readonly Label_LossLocation_SecondaryStreet: Element
  readonly Label_LossLocation_City: Element
  readonly Label_LossLocation_County: Element
  readonly Label_LossLocation_State: Element
  readonly Label_LossLocation_ZipCode: Element
  readonly Label_YourClaimTeam_Title: Element
  readonly Label_ClaimVisualizer_Title: Element
  readonly Label_Actions_Title: Element
  readonly Label_YourClaimTeam_Coordinator: Element
  readonly Label_YourClaimTeam_FieldAgent: Element
  readonly claimVisualizerEvents: Locator
  readonly Link_Actions_ViewDocuments: Element
  readonly Link_Actions_ViewMedia: Element
  readonly Link_Actions_Upload: Element
  readonly Link_Actions_ScheduleCallback: Element

  constructor(global: UserPortalGlobal, claim: UserPortalClaim) {
    super(global, claim)
    this.URL = `${this.baseURL}/info`
    this.Label_ClaimProcess_Title = new Element(
      global.page,
      this.page.locator('div[id="claim-process-step_title"]'),
      ClaimDetailsPageStrings.ClaimProcess_Title
    )

    this.Label_ClaimProcess_ClaimNumber = new Element(
      global.page,
      this.page
        .locator('div[id="claim-process-step_content"] > dl > div')
        .getByText(ClaimDetailsPageStrings.ClaimProcess_ClaimNumber)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.claimProcess.claimNumber
    )

    this.Label_ClaimProcess_Status = new Element(
      global.page,
      this.page
        .locator('div[id="claim-process-step_content"] > dl > div')
        .getByText(ClaimDetailsPageStrings.ClaimProcess_Status)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.claimProcess.status
    )

    this.Label_ClaimProcess_Coordinator = new Element(
      global.page,
      this.page
        .locator('div[id="claim-process-step_content"] > dl > div')
        .getByText(ClaimDetailsPageStrings.ClaimProcess_Coordinator)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.claimProcess.coordinator
    )

    this.Label_ClaimProcess_FieldAgentName = new Element(
      global.page,
      this.page
        .locator('div[id="claim-process-step_content"] > dl > div')
        .getByText(ClaimDetailsPageStrings.ClaimProcess_FieldAgentName)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.claimProcess.fieldAgentName
    )

    this.Label_ClaimProcess_ScheduledAppointmentDate = new Element(
      global.page,
      this.page
        .locator('div[id="claim-process-step_content"] > dl > div')
        .getByText(ClaimDetailsPageStrings.ClaimProcess_ScheduledAppointmentDate)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.claimProcess.scheduledAppointmentDate
    )

    this.Label_ClaimDetails_Title = new Element(
      global.page,
      this.page.locator('div[id="claim-details-step_title"]'),
      ClaimDetailsPageStrings.ClaimDetails_Title
    )

    this.Label_ClaimDetails_LossType = new Element(
      global.page,
      this.page
        .locator('div[id="claim-details-step_content"]')
        .locator('> div > dl')
        .nth(0)
        .getByText(ClaimDetailsPageStrings.ClaimDetails_LossType)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.claimDetails.lossType
    )

    this.Label_ClaimDetails_LossDate = new Element(
      global.page,
      this.page
        .locator('div[id="claim-details-step_content"]')
        .locator('> div > dl')
        .nth(0)
        .getByText(ClaimDetailsPageStrings.ClaimDetails_LossDate)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.claimDetails.lossDate
    )

    this.Label_ClaimDetails_LossDescription = new Element(
      global.page,
      this.page
        .locator('div[id="claim-details-step_content"]')
        .locator('> div > dl')
        .nth(0)
        .getByText(ClaimDetailsPageStrings.ClaimDetails_LossDescription)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.claimDetails.lossDescription
    )

    this.Label_LossLocation_Title = new Element(
      global.page,
      this.page
        .locator('div[id="claim-details-step_content"]')
        .locator('> div > dl')
        .nth(1)
        .locator('h3'),
      ClaimDetailsPageStrings.LossLocation_Title
    )

    this.Label_LossLocation_Street = new Element(
      global.page,
      this.page
        .locator('div[id="claim-details-step_content"]')
        .locator('> div > dl')
        .nth(1)
        .getByText(ClaimDetailsPageStrings.LossLocation_Street, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossLocation.street
    )

    this.Label_LossLocation_SecondaryStreet = new Element(
      global.page,
      this.page
        .locator('div[id="claim-details-step_content"]')
        .locator('> div > dl')
        .nth(1)
        .getByText(ClaimDetailsPageStrings.LossLocation_SecondaryStreet, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossLocation.secondaryStreet
    )

    this.Label_LossLocation_City = new Element(
      global.page,
      this.page
        .locator('div[id="claim-details-step_content"]')
        .locator('> div > dl')
        .nth(1)
        .getByText(ClaimDetailsPageStrings.LossLocation_City)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossLocation.city
    )

    this.Label_LossLocation_County = new Element(
      global.page,
      this.page
        .locator('div[id="claim-details-step_content"]')
        .locator('> div > dl')
        .nth(1)
        .getByText(ClaimDetailsPageStrings.LossLocation_County)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossLocation.county
    )

    this.Label_LossLocation_State = new Element(
      global.page,
      this.page
        .locator('div[id="claim-details-step_content"]')
        .locator('> div > dl')
        .nth(1)
        .getByText(ClaimDetailsPageStrings.LossLocation_State)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossLocation.state
    )

    this.Label_LossLocation_ZipCode = new Element(
      global.page,
      this.page
        .locator('div[id="claim-details-step_content"]')
        .locator('> div > dl')
        .nth(1)
        .getByText(ClaimDetailsPageStrings.LossLocation_ZipCode)
        .locator('..')
        .locator('..')
        .locator('> dd'),
      claim.lossLocation.zipCode
    )

    this.Label_YourClaimTeam_Title = new Element(
      global.page,
      this.page.locator('div[id="claim-team-step_title"]'),
      ClaimDetailsPageStrings.YourClaimTeam_Title
    )

    this.Label_YourClaimTeam_Coordinator = new Element(
      global.page,
      this.page
        .locator('div[id="claim-team-step_content"]')
        .getByText(ClaimDetailsPageStrings.YourClaimTeam_Coordinator, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> span'),
      claim.claimProcess.coordinator
    )

    this.Label_YourClaimTeam_FieldAgent = new Element(
      global.page,
      this.page
        .locator('div[id="claim-team-step_content"]')
        .getByText(ClaimDetailsPageStrings.YourClaimTeam_FieldAgent, { exact: true })
        .locator('..')
        .locator('..')
        .locator('> span'),
      claim.claimProcess.fieldAgentName
    )

    this.Label_ClaimVisualizer_Title = new Element(
      global.page,
      this.page.locator('div[id="claim-visualizer-step_title"]'),
      ClaimDetailsPageStrings.ClaimVisualizer_Title
    )

    this.claimVisualizerEvents = this.page.locator(
      'div[id="claim-visualizer-step_content"]  > div > div.chakra-stack'
    )

    this.Label_Actions_Title = new Element(
      global.page,
      this.page.locator('div[id="claim-actions-step_title"]'),
      ClaimDetailsPageStrings.Actions_Title
    )

    this.Link_Actions_ViewDocuments = new Element(
      global.page,
      this.page.getByRole('link', {
        name: `${ClaimDetailsPageStrings.Link_Actions_ViewDocuments}`,
      }),
      ClaimDetailsPageStrings.Link_Actions_ViewDocuments
    )

    this.Link_Actions_ViewMedia = new Element(
      global.page,
      this.page.getByRole('link', { name: `${ClaimDetailsPageStrings.Link_Actions_ViewMedia}` }),
      ClaimDetailsPageStrings.Link_Actions_ViewMedia
    )

    this.Link_Actions_Upload = new Element(
      global.page,
      this.page.getByRole('link', { name: `${ClaimDetailsPageStrings.Link_Actions_Upload}` }),
      ClaimDetailsPageStrings.Link_Actions_Upload
    )

    this.Link_Actions_ScheduleCallback = new Element(
      global.page,
      this.page.getByRole('link', {
        name: `${ClaimDetailsPageStrings.Link_Actions_ScheduleCallback}`,
      }),
      ClaimDetailsPageStrings.Link_Actions_ScheduleCallback
    )
  }

  async ClaimVisualizerEventCount() {
    const count = await this.claimVisualizerEvents.count()
    return count
  }

  async NavigateToPage(navigateDirectly = false) {
    if (navigateDirectly) {
      await this.NavigateDirectly(this.global.baseUrl)
    } else {
      await this.leftNavBar.Link_Details.Click()
    }
    await this.WaitForLoad()
  }

  async WaitForLoad() {
    await this.page.waitForLoadState()
    // if (this.global.isMobile) {
    // }
    await this.Label_ClaimDetails_Title.locator.waitFor({ state: 'visible' })
  }

  async VerifyClaimProcessSection() {
    await this.Label_ClaimProcess_Title.VerifyExpectedText()
    await this.Label_ClaimProcess_ClaimNumber.VerifyExpectedTextAlt()
    await this.Label_ClaimProcess_Status.VerifyExpectedTextAlt()
    await this.Label_ClaimProcess_Coordinator.VerifyExpectedTextAlt()
    await this.Label_ClaimProcess_FieldAgentName.VerifyExpectedTextAlt()
    await this.Label_ClaimProcess_ScheduledAppointmentDate.VerifyExpectedTextAlt()
  }

  async VerifyClaimDetailsSection() {
    await this.Label_ClaimDetails_Title.VerifyExpectedText()
    await this.Label_ClaimDetails_LossType.VerifyExpectedTextAlt()
    await this.Label_ClaimDetails_LossDate.VerifyExpectedTextAlt()
    const actualText = await this.Label_ClaimDetails_LossDescription.locator.textContent() // description may have stuff appended, so use starts with
    expect(actualText?.startsWith(this.Label_ClaimDetails_LossDescription.expectedText)).toBe(true)
    await this.Label_LossLocation_Title.VerifyExpectedTextAlt()
    await this.Label_LossLocation_Street.VerifyExpectedTextAlt()
    await this.Label_LossLocation_SecondaryStreet.VerifyExpectedTextAlt()
    await this.Label_LossLocation_City.VerifyExpectedTextAlt()
    await this.Label_LossLocation_County.VerifyExpectedTextAlt()
    await this.Label_LossLocation_State.VerifyExpectedTextAlt()
    await this.Label_LossLocation_ZipCode.VerifyExpectedTextAlt()
  }

  async VerifyYourClaimTeamSection() {
    await this.Label_YourClaimTeam_Title.VerifyExpectedText()
    await this.Label_YourClaimTeam_Coordinator.VerifyExpectedTextAlt()
    await this.Label_YourClaimTeam_FieldAgent.VerifyExpectedTextAlt()
  }

  async VerifyClaimVisualizerSection() {
    await this.Label_ClaimVisualizer_Title.VerifyExpectedText()
    expect(await this.ClaimVisualizerEventCount()).toBeGreaterThanOrEqual(
      this.claim.testData.claimVisualizerCount
    )
  }

  async VerifyActionsSection() {
    await this.Label_Actions_Title.VerifyExpectedText()
    await this.Link_Actions_ViewDocuments.locator.isEnabled()
    await this.Link_Actions_ViewMedia.locator.isEnabled()
    await this.Link_Actions_Upload.locator.isEnabled()
    await this.Link_Actions_ScheduleCallback.locator.isEnabled()
  }
}
