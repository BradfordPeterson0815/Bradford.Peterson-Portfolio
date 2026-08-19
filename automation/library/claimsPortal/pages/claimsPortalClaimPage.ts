import { Locator, expect } from '@playwright/test'
import { Element } from '../../shared/element.js'
import { ClaimsPortalClaim } from '../claimsPortalClaim.js'
import { ClaimPageStrings, ClaimTabTypes } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalClaimCallbackRequestsTab } from '../tabs/claimsPortalClaimCallbackRequestsTab.js'
import { ClaimsPortalClaimContactsTab } from '../tabs/claimsPortalClaimContactsTab.js'
import { ClaimsPortalClaimDocumentsTab } from '../tabs/claimsPortalClaimDocumentsTab.js'
import { ClaimsPortalClaimEstimatesTab } from '../tabs/claimsPortalClaimEstimatesTab.js'
import { ClaimsPortalClaimInfoTab } from '../tabs/claimsPortalClaimInfoTab.js'
import { ClaimsPortalClaimInspectionsTab } from '../tabs/claimsPortalClaimInspectionsTab.js'
import { ClaimsPortalClaimJobsTab } from '../tabs/claimsPortalClaimJobsTab.js'
import { ClaimsPortalClaimLossOfUseTab } from '../tabs/claimsPortalClaimLossOfUseTab.js'
import { ClaimsPortalClaimMediaTab } from '../tabs/claimsPortalClaimMediaTab.js'
import { ClaimsPortalClaimNotesTab } from '../tabs/claimsPortalClaimNotesTab.js'
import { ClaimsPortalClaimPortalAccessTab } from '../tabs/claimsPortalClaimPortalAccessTab.js'
import { ClaimsPortalClaimScheduleTab } from '../tabs/claimsPortalClaimScheduleTab.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'

export class ClaimsPortalClaimPage extends ClaimsPortalBasePage {
  readonly claimHeaderParent: Locator
  readonly contactParent: Locator
  readonly claim: ClaimsPortalClaim
  readonly baseURL: string
  readonly Title: Element
  readonly Button_CantPublish: Element
  readonly Button_Actions: Element
  readonly MenuItem_Actions_AddCommunication: Element
  readonly MenuItem_Actions_AddNote: Element
  readonly MenuItem_Actions_AddTags: Element
  readonly MenuItem_Actions_StartInspection: Element
  readonly MenuItem_Actions_UpdateClaim: Element
  readonly MenuItem_Actions_UploadFiles: Element
  readonly MenuItem_Actions_CloseClaim: Element
  readonly Link_YourClaimsPortal: Element
  readonly Link_AllClaimsPortal: Element
  readonly Label_PrimaryContact_Name: Element
  readonly Link_PrimaryContact_Phone: Element
  readonly Link_PrimaryContact_Email: Element
  readonly Link_PrimaryContact_Address: Element

  constructor(global: ClaimsPortalGlobal, claim: ClaimsPortalClaim) {
    super(global)
    this.claim = claim
    this.claimHeaderParent = this.page.locator('#root div.chakra-container > div')
    this.contactParent = this.claimHeaderParent.locator(
      '> div:nth-child(2) > div > div > div:nth-child(2)'
    )
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${this.claim.basicInfo.claimNumber}` }),
      this.claim.basicInfo.claimNumber
    )
    this.baseURL = `${global.baseUrl}claims/${this.claim.basicInfo.claimNumber}`
    this.Link_YourClaimsPortal = new Element(
      global.page,
      this.claimHeaderParent.locator('div > div > a').nth(0),
      ClaimPageStrings.Link_YourClaimsPortal
    )
    this.Link_AllClaimsPortal = new Element(
      global.page,
      this.page.getByRole('link', { name: ClaimPageStrings.Link_AllClaimsPortal }),
      //this.claimHeaderParent.locator('div > div > a').nth(1),
      ClaimPageStrings.Link_AllClaimsPortal
    )
    this.Button_CantPublish = new Element(
      global.page,
      this.page.getByRole('button', { name: ClaimPageStrings.Button_CantPublish }),
      ClaimPageStrings.Button_CantPublish
    )
    this.Button_Actions = new Element(
      global.page,
      this.page.getByRole('button', { name: ClaimPageStrings.Button_Actions }),
      ClaimPageStrings.Button_Actions
    )
    this.MenuItem_Actions_AddCommunication = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: ClaimPageStrings.MenuItem_Actions_AddCommunication }),
      ClaimPageStrings.MenuItem_Actions_AddCommunication
    )
    this.MenuItem_Actions_AddNote = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: ClaimPageStrings.MenuItem_Actions_AddNote }),
      ClaimPageStrings.MenuItem_Actions_AddNote
    )
    this.MenuItem_Actions_AddTags = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: ClaimPageStrings.MenuItem_Actions_AddTags }),
      ClaimPageStrings.MenuItem_Actions_AddTags
    )
    this.MenuItem_Actions_StartInspection = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: ClaimPageStrings.MenuItem_Actions_StartInspection }),
      ClaimPageStrings.MenuItem_Actions_StartInspection
    )
    this.MenuItem_Actions_UpdateClaim = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: ClaimPageStrings.MenuItem_Actions_UpdateClaim }),
      ClaimPageStrings.MenuItem_Actions_UpdateClaim
    )
    this.MenuItem_Actions_UploadFiles = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: ClaimPageStrings.MenuItem_Actions_UploadFiles }),
      ClaimPageStrings.MenuItem_Actions_UploadFiles
    )
    this.MenuItem_Actions_CloseClaim = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: ClaimPageStrings.MenuItem_Actions_CloseClaim }),
      ClaimPageStrings.MenuItem_Actions_CloseClaim
    )
    this.Label_PrimaryContact_Name = new Element(
      global.page,
      this.contactParent.locator('div span')
    )
    this.Link_PrimaryContact_Phone = new Element(
      global.page,
      this.contactParent.locator('> a').nth(0)
    )
    this.Link_PrimaryContact_Email = new Element(
      global.page,
      this.contactParent.locator('> a').nth(1)
    )
    this.Link_PrimaryContact_Address = new Element(
      global.page,
      this.contactParent.locator('> a').last()
    )
  }

  async IsTabActive(claimTab: ClaimTabTypes) {
    const targetId = this.LookupClaimTabId(claimTab)
    await this.page.locator(targetId).waitFor({ state: 'attached' })
    await this.page.locator(targetId).waitFor({ state: 'visible' })
    const result =
      (await this.page.locator(targetId).getAttribute('aria-selected', { timeout: 3000 })) == 'true'
    return result
  }

  LookupClaimTabId(claimTab: ClaimTabTypes) {
    const baseTabLocator = 'data-id="/claims/$claimNumber/_layout'
    switch (claimTab) {
      case ClaimTabTypes.Info:
        return `a[${baseTabLocator}/info"]`
      case ClaimTabTypes.PortalAccess:
        return `a[${baseTabLocator}/portals"]`
      case ClaimTabTypes.Contacts:
        return `a[${baseTabLocator}/contacts"]`
      case ClaimTabTypes.LossOfUse:
        return `a[${baseTabLocator}/loss-of-use"]`
      case ClaimTabTypes.Schedule:
        return `a[${baseTabLocator}/schedule"]`
      case ClaimTabTypes.Estimates:
        return `a[${baseTabLocator}/estimates"]`
      case ClaimTabTypes.Documents:
        return `a[${baseTabLocator}/documents"]`
      case ClaimTabTypes.Media:
        return `a[${baseTabLocator}/media"]`
      case ClaimTabTypes.Notes:
        return `a[${baseTabLocator}/notes"]`
      case ClaimTabTypes.Jobs:
        return `a[${baseTabLocator}/jobs"]`
      case ClaimTabTypes.CallbackRequests:
        return `a[${baseTabLocator}/callbacks"]`
      case ClaimTabTypes.Inspections:
        return `a[${baseTabLocator}/inspections"]`
      default:
        throw new Error(`Undefined Claim Tab type : ${claimTab}`)
    }
  }

  async SelectClaimTab(claimTab: ClaimTabTypes) {
    const targetId = this.LookupClaimTabId(claimTab)
    let tabToReturn
    let locatorToWaitFor: Locator = this.Title.locator
    await this.page.locator(targetId).waitFor({ state: 'attached', timeout: 300000 })
    await this.page.locator(targetId).click()
    switch (claimTab) {
      case ClaimTabTypes.Info:
        tabToReturn = new ClaimsPortalClaimInfoTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.Label_LossInformation_Title.locator
        break
      case ClaimTabTypes.PortalAccess:
        tabToReturn = new ClaimsPortalClaimPortalAccessTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_PortalAccess.Button_ExpandTable.locator
        break
      case ClaimTabTypes.Contacts:
        tabToReturn = new ClaimsPortalClaimContactsTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_Contacts.Button_ExpandTable.locator
        break
      case ClaimTabTypes.LossOfUse:
        tabToReturn = new ClaimsPortalClaimLossOfUseTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_LossOfUse.Button_ExpandTable.locator
        break
      case ClaimTabTypes.Schedule:
        tabToReturn = new ClaimsPortalClaimScheduleTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.Label_CurrentMonth.locator
        break
      case ClaimTabTypes.Estimates:
        tabToReturn = new ClaimsPortalClaimEstimatesTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_Estimates.Button_ExpandTable.locator
        break
      case ClaimTabTypes.Documents:
        tabToReturn = new ClaimsPortalClaimDocumentsTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_Documents.Button_ExpandTable.locator
        break
      case ClaimTabTypes.Media:
        tabToReturn = new ClaimsPortalClaimMediaTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_Media.Button_ExpandTable.locator
        break
      case ClaimTabTypes.Notes:
        tabToReturn = new ClaimsPortalClaimNotesTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.Title.locator
        break
      case ClaimTabTypes.Jobs:
        tabToReturn = new ClaimsPortalClaimJobsTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_Jobs.Button_ExpandTable.locator
        break
      case ClaimTabTypes.CallbackRequests:
        tabToReturn = new ClaimsPortalClaimCallbackRequestsTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_Callbacks.Button_ExpandTable.locator
        break
      case ClaimTabTypes.Inspections:
        tabToReturn = new ClaimsPortalClaimInspectionsTab(this.global, this.claim, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_Inspections.Button_ExpandTable.locator
        break
      default:
        throw new Error(`Undefined Claim Tab type : ${claimTab}`)
    }
    await this.page.locator(targetId).getAttribute('aria-selected', { timeout: 3000 })
    await locatorToWaitFor.nth(0).waitFor({ state: 'visible' })
    await tabToReturn.CustomLoad()
    return tabToReturn
  }

  async NavigateDirectlyToClaim() {
    await this.page.goto(this.baseURL)
    await this.page.waitForURL(this.baseURL, { waitUntil: 'domcontentloaded' })
  }

  async VerifyMenuItemIsAttached(menuItemName: string) {
    const menuItemLocator = this.page.getByRole('menuitem', {
      name: menuItemName,
    })
    await expect(menuItemLocator).toBeAttached()
  }
}
