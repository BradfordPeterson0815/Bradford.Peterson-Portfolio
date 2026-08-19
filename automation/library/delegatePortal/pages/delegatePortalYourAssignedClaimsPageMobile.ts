import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { Element } from '../../shared/element.js'
import { YourAssignedClaimsPageStrings } from '../delegatePortalConstants.js'
import { Locator, expect } from 'playwright/test'
import { DelegatePortalClaim } from '../delegatePortalClaim.js'
import { DelegatePortalBasePage } from './delegatePortalBasePage.js'
import { DelegatePortalMobileClaimCard } from '../delegatePortalMobileClaimCard.js'
import { DelegatePortalClaimPage } from './delegatePortalClaimPage.js'

export class DelegatePortalYourAssignedClaimsPageMobile extends DelegatePortalBasePage {
  readonly Title: Element
  readonly Link_NewAssignments: Element
  readonly Link_TodaysAssignments: Element
  readonly Link_AllAssignments: Element
  readonly Button_Back: Element
  readonly Button_ShrinkRows: Element
  readonly Button_ExpandRows: Element
  readonly TextBox_Search: Element
  readonly Button_ClearSearch: Element
  readonly Label_NoClaimsFoundForSearch: Element
  readonly Button_SortAscending: Element
  readonly Button_SortDescending: Element
  readonly parent: string
  readonly cards: Locator
  readonly sortSelection: Locator
  readonly Label_NoAssignedClaimsWarningTitle: Element
  readonly Label_NoAssignedClaimsWarningDescription: Element

  constructor(global: DelegatePortalGlobal) {
    super(global)
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${YourAssignedClaimsPageStrings.Title}` }),
      YourAssignedClaimsPageStrings.Title
    )
    this.URL = `${global.baseUrl}claims`
    this.parent = `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]`
    this.Link_NewAssignments = new Element(
      global.page,
      this.page.locator(`a[href="/claims/?assignments=new"]`)
    )
    this.Link_TodaysAssignments = new Element(
      global.page,
      this.page.locator(`a[href="/claims/?assignments=today"]`)
    )
    this.Link_AllAssignments = new Element(
      global.page,
      this.page.locator(`a[href="/claims/?assignments=all"]`)
    )
    this.Button_Back = new Element(global.page, this.page.locator(`button[href="/claims"]`))
    this.Button_ShrinkRows = new Element(
      global.page,
      this.page.locator(`button[aria-label="Shrink rows"]`)
    )
    this.Button_ExpandRows = new Element(
      global.page,
      this.page.locator(`button[aria-label="Expand rows"]`)
    )
    this.TextBox_Search = new Element(
      global.page,
      this.page.locator(`input[placeholder="Type to search..."]`)
    )
    this.Button_ClearSearch = new Element(
      global.page,
      this.page.locator(`button[aria-label="Clear search"]`)
    )
    this.Label_NoClaimsFoundForSearch = new Element(
      global.page,
      this.page.locator(`div[data-status="info"][role="alert"] > div > div[data-status="info"]`)
    )
    this.Button_SortAscending = new Element(
      global.page,
      this.page.locator(`#root button[aria-label="Click to sort by: ascending"]`)
    )
    this.Button_SortDescending = new Element(
      global.page,
      this.page.locator(`#root button[aria-label="Click to sort by: descending"]`)
    )
    this.sortSelection = this.page.locator(`select[id^="field"]`)
    this.cards = this.page
      .locator('.chakra-container > .chakra-stack > .chakra-stack > .chakra-stack ')
      .nth(0)
      .locator('div[id^="card_"][id$="content"]')
    this.Label_NoAssignedClaimsWarningTitle = new Element(
      global.page,
      this.page.locator(`div[data-status="warning"] div div[data-status="warning"]`).nth(0),
      YourAssignedClaimsPageStrings.Label_NoAssignedClaimsWarningTitle
    )
    this.Label_NoAssignedClaimsWarningDescription = new Element(
      global.page,
      this.page.locator(`div[data-status="warning"] div div[data-status="warning"]`).nth(1),
      YourAssignedClaimsPageStrings.Label_NoAssignedClaimsWarningDescription
    )
  }

  async VisibleCardCount() {
    const count = await this.cards.count()
    return count
  }

  async GetClaimCardByIndex(index: number) {
    if (index + 1 > (await this.VisibleCardCount()) || index < 0) {
      throw new Error(`invalid mobile claim card index passed: ${index}`)
    }
    const card = new DelegatePortalMobileClaimCard(this.global, this.cards.nth(index))
    return card
  }

  async WaitForLoad() {
    await this.page.waitForLoadState()
    const noAssignedClaims = await this.Label_NoAssignedClaimsWarningTitle.locator.count()
    if (noAssignedClaims > 0) {
      // We have assigned claims - expect links
      await this.Link_AllAssignments.locator.waitFor({ state: 'visible' })
    }
  }

  async NavigateToPage() {
    await this.NavigateDirectly(this.global.baseUrl)
    await this.WaitForLoad()
  }

  async VerifyTitle() {
    await this.Title.VerifyExpectedText()
  }

  async PerformSearch(searchTerm: string) {
    await this.page.waitForTimeout(1000)
    await this.TextBox_Search.FillByTyping(searchTerm, 100)
    await this.page.waitForTimeout(1000)
  }

  async SelectSortField(sortFieldSelection: string) {
    await this.sortSelection.selectOption({ label: `${sortFieldSelection}` })
  }

  async OpenClaim(claim: DelegatePortalClaim) {
    await this.PerformSearch(claim.basicInfo.claimNumber)
    const claimCardCount = await this.VisibleCardCount()
    expect(claimCardCount).toBe(1)
    const claimCard = await this.GetClaimCardByIndex(0)
    await claimCard.Link_GotoClaim.Click()
    const claimPage = new DelegatePortalClaimPage(this.global, claim)
    const expectedLandingURL = claimPage.baseURL
    await this.page.waitForURL(expectedLandingURL)
    return claimPage
  }
}
