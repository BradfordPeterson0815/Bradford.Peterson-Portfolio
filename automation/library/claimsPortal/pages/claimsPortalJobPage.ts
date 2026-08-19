import { Locator, expect } from 'playwright/test'
import { Element } from '../../shared/element.js'
import { JobPageStrings, JobTabTypes } from '../claimsPortalConstants.js'
import { ClaimsPortalGlobal } from '../claimsPortalGlobal.js'
import { ClaimsPortalJob } from '../claimsPortalJob.js'
import { ClaimsPortalAddTagsDialog } from '../dialogs/claimsPortalAddTagsDialog.js'
import { ClaimsPortalJobCallbackRequestsTab } from '../tabs/claimsPortalJobCallbackRequestsTab.js'
import { ClaimsPortalJobContactsTab } from '../tabs/claimsPortalJobContactsTab.js'
import { ClaimsPortalJobDocumentsTab } from '../tabs/claimsPortalJobDocumentsTab.js'
import { ClaimsPortalJobInfoTab } from '../tabs/claimsPortalJobInfoTab.js'
import { ClaimsPortalJobMediaTab } from '../tabs/claimsPortalJobMediaTab.js'
import { ClaimsPortalJobInspectionsTab } from '../tabs/claimsPortalJobInspectionsTab.js'
import { ClaimsPortalJobNotesTab } from '../tabs/claimsPortalJobNotesTab.js'
import { ClaimsPortalJobPortalAccessTab } from '../tabs/claimsPortalJobPortalAccessTab.js'
import { ClaimsPortalJobWorkAuthorizationsTab } from '../tabs/claimsPortalJobWorkAuthorizationsTab.js'
import { ClaimsPortalBasePage } from './claimsPortalBasePage.js'
import { ClaimsPortalJobAppointmentsTab } from '../tabs/claimsPortalJobAppointmentsTab.js'
import { ClaimsPortalJobBillingTab } from '../tabs/claimsPortalJobBillingTab.js'
import { ClaimsPortalCreateNoteDrawer } from '../drawers/claimsPortalCreateNoteDrawer.js'
import { ClaimsPortalAddPersonToPortalDrawer } from '../drawers/claimsPortalAddPersonToPortalDrawer.js'
import { ClaimsPortalCloseJobDrawer } from '../drawers/claimsPortalCloseJobDrawer.js'
import { ClaimsPortalRecordCustomerContactAttemptDrawer } from '../drawers/claimsPortalRecordCustomerContactAttemptDrawer.js'
import { ClaimsPortalEnterWorkDetailsForJobDrawer } from '../drawers/claimsPortalEnterWorkDetailsForJobDrawer.js'

export class ClaimsPortalJobPage extends ClaimsPortalBasePage {
  readonly jobHeaderParent: Locator
  readonly contactParent: Locator
  readonly tags: Locator
  readonly job: ClaimsPortalJob
  readonly baseURL: string
  readonly Title: Element
  readonly Button_Actions: Element
  readonly Button_AddNote: Element
  readonly Button_AddPersonToJobPortal: Element
  readonly Button_AddTags: Element
  readonly Button_CreateContact: Element
  readonly Button_CustomerContactAttempted: Element
  readonly Button_MarkAsStarted: Element
  readonly Button_StartInspection: Element
  readonly Button_UpdateJob: Element
  readonly Button_UploadDocumentsMedia: Element
  readonly Button_RecordTarpingWork: Element
  readonly Button_CloseJob: Element
  readonly Link_AllJobs: Element
  readonly Link_AssociatedClaim: Element
  readonly Label_PrimaryContact_Name: Element
  readonly Link_PrimaryContact_Phone: Element
  readonly Link_PrimaryContact_Email: Element
  readonly Link_PrimaryContact_Address: Element

  constructor(global: ClaimsPortalGlobal, job: ClaimsPortalJob) {
    super(global)
    this.job = job
    this.jobHeaderParent = this.page.locator('#root div.chakra-container > div')
    this.contactParent = this.jobHeaderParent.locator(
      '> div:nth-child(2) > div > div > div:nth-child(2)'
    )
    this.tags = this.jobHeaderParent.locator(
      '> div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) ul li'
    )
    this.Title = new Element(
      global.page,
      this.page.getByRole('heading', { name: `${this.job.jobDetails.jobNumber}` }),
      this.job.jobDetails.jobNumber
    )
    this.baseURL = `${global.baseUrl}jobs/${this.job.jobDetails.jobId}`
    this.Button_Actions = new Element(
      global.page,
      this.page.getByRole('button', { name: `${JobPageStrings.Button_Actions}` }),
      JobPageStrings.Button_Actions
    )
    this.Button_AddNote = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: JobPageStrings.MenuItem_Actions_AddNote }),
      JobPageStrings.MenuItem_Actions_AddNote
    )
    this.Button_AddPersonToJobPortal = new Element(
      global.page,
      this.page.getByRole('menuitem', {
        name: JobPageStrings.MenuItem_Actions_AddPersonToJobPortal,
      }),
      JobPageStrings.MenuItem_Actions_AddPersonToJobPortal
    )
    this.Button_AddTags = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: JobPageStrings.MenuItem_Actions_AddTags }),
      JobPageStrings.MenuItem_Actions_AddTags
    )
    this.Button_CreateContact = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: JobPageStrings.MenuItem_Actions_CreateContact }),
      JobPageStrings.MenuItem_Actions_CreateContact
    )
    this.Button_CustomerContactAttempted = new Element(
      global.page,
      this.page.getByRole('menuitem', {
        name: JobPageStrings.MenuItem_Actions_CustomerContactAttempted,
      }),
      JobPageStrings.MenuItem_Actions_CustomerContactAttempted
    )
    this.Button_MarkAsStarted = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: JobPageStrings.MenuItem_Actions_MarkAsStarted }),
      JobPageStrings.MenuItem_Actions_MarkAsStarted
    )
    this.Button_StartInspection = new Element(
      global.page,
      this.page.getByRole('menuitem', {
        name: JobPageStrings.MenuItem_Actions_StartInspection,
      }),
      JobPageStrings.MenuItem_Actions_StartInspection
    )
    this.Button_UpdateJob = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: JobPageStrings.MenuItem_Actions_UpdateJob }),
      JobPageStrings.MenuItem_Actions_UpdateJob
    )
    this.Button_RecordTarpingWork = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: JobPageStrings.MenuItem_Actions_RecordTarpingWork }),
      JobPageStrings.MenuItem_Actions_RecordTarpingWork
    )
    this.Button_UploadDocumentsMedia = new Element(
      global.page,
      this.page.getByRole('menuitem', {
        name: JobPageStrings.MenuItem_Actions_UploadDocumentsMedia,
      }),
      JobPageStrings.MenuItem_Actions_UploadDocumentsMedia
    )
    this.Button_CloseJob = new Element(
      global.page,
      this.page.getByRole('menuitem', { name: JobPageStrings.MenuItem_Actions_CloseJob }),
      JobPageStrings.MenuItem_Actions_CloseJob
    )
    this.Link_AllJobs = new Element(
      global.page,
      this.jobHeaderParent.locator('div > div > a').nth(0),
      JobPageStrings.Link_AllJobs
    )
    this.Link_AssociatedClaim = new Element(global.page, this.contactParent.locator('span a'))
    this.Label_PrimaryContact_Name = new Element(
      global.page,
      this.contactParent.locator('> div > div > span')
    )
    this.Link_PrimaryContact_Phone = new Element(
      global.page,
      this.contactParent.locator('> div > a').nth(0)
    )
    this.Link_PrimaryContact_Email = new Element(
      global.page,
      this.contactParent.locator('> div > a').nth(1)
    )
    this.Link_PrimaryContact_Address = new Element(
      global.page,
      this.contactParent.locator('> div > a').nth(2)
    )
  }

  async IsTabActive(jobTab: JobTabTypes) {
    await this.page.waitForTimeout(1000)
    const targetId = this.LookupJobTabId(jobTab)
    const result = (await this.page.locator(targetId).getAttribute('aria-selected')) == 'true'
    return result
  }

  LookupJobTabId(jobTab: JobTabTypes) {
    const baseTabLocator = 'data-id="/jobs/$jobId/_layout'
    switch (jobTab) {
      case JobTabTypes.Info:
        return `a[${baseTabLocator}/info"]`
      case JobTabTypes.PortalAccess:
        return `a[${baseTabLocator}/portals"]`
      case JobTabTypes.Contacts:
        return `a[${baseTabLocator}/contacts"]`
      case JobTabTypes.Billing:
        return `a[${baseTabLocator}/billing"]`
      case JobTabTypes.WorkAuthorizations:
        return `a[${baseTabLocator}/work-auth"]`
      case JobTabTypes.Appointments:
        return `a[${baseTabLocator}/appointments"]`
      case JobTabTypes.Documents:
        return `a[${baseTabLocator}/documents"]`
      case JobTabTypes.Media:
        return `a[${baseTabLocator}/media"]`
      case JobTabTypes.Notes:
        return `a[${baseTabLocator}/notes"]`
      case JobTabTypes.CallbackRequests:
        return `a[${baseTabLocator}/callbacks"]`
      case JobTabTypes.Inspections:
        return `a[${baseTabLocator}/inspections"]`
      default:
        throw new Error(`Undefined Job Tab type : ${jobTab}`)
    }
  }

  async SelectJobTab(jobTab: JobTabTypes) {
    const targetId = this.LookupJobTabId(jobTab)
    let tabToReturn
    let locatorToWaitFor: Locator = this.Button_Actions.locator
    await this.page.locator(targetId).waitFor({ state: 'attached', timeout: 300000 })
    await this.page.locator(targetId).click()
    switch (jobTab) {
      case JobTabTypes.Info:
        tabToReturn = new ClaimsPortalJobInfoTab(this.global, this.job, this.baseURL)
        locatorToWaitFor = tabToReturn.Label_JobDetails_Title.locator
        break
      case JobTabTypes.PortalAccess:
        tabToReturn = new ClaimsPortalJobPortalAccessTab(this.global, this.job, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_PortalAccess.Button_ExpandTable.locator
        break
      case JobTabTypes.Contacts:
        tabToReturn = new ClaimsPortalJobContactsTab(this.global, this.job, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_Contacts.Button_ExpandTable.locator
        break
      case JobTabTypes.Billing:
        tabToReturn = new ClaimsPortalJobBillingTab(this.global, this.job, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_Bills.Button_ExpandTable.locator
        break
      case JobTabTypes.WorkAuthorizations:
        tabToReturn = new ClaimsPortalJobWorkAuthorizationsTab(this.global, this.job, this.baseURL)
        locatorToWaitFor =
          tabToReturn.DataTable_WorkAuthorizations.Button_ExpandTable.locator.nth(0)
        break
      case JobTabTypes.Appointments:
        tabToReturn = new ClaimsPortalJobAppointmentsTab(this.global, this.job, this.baseURL)
        locatorToWaitFor = tabToReturn.Label_CurrentMonth.locator
        break
      case JobTabTypes.Documents:
        tabToReturn = new ClaimsPortalJobDocumentsTab(this.global, this.job, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_Documents.Button_ExpandTable.locator
        break
      case JobTabTypes.Media:
        tabToReturn = new ClaimsPortalJobMediaTab(this.global, this.job, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_Media.Button_ExpandTable.locator
        break
      case JobTabTypes.Notes:
        tabToReturn = new ClaimsPortalJobNotesTab(this.global, this.job, this.baseURL)
        locatorToWaitFor = tabToReturn.Button_AddNote.locator
        break
      case JobTabTypes.CallbackRequests:
        tabToReturn = new ClaimsPortalJobCallbackRequestsTab(this.global, this.job, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_Callbacks.Button_ExpandTable.locator
        break
      case JobTabTypes.Inspections:
        tabToReturn = new ClaimsPortalJobInspectionsTab(this.global, this.job, this.baseURL)
        locatorToWaitFor = tabToReturn.DataTable_Inspections.Button_ExpandTable.locator
        break
      default:
        throw new Error(`Undefined Job Tab type : ${jobTab}`)
    }
    await this.page.locator(targetId).getAttribute('aria-selected', { timeout: 3000 })
    await locatorToWaitFor.nth(0).waitFor({ state: 'attached' })
    await tabToReturn.CustomLoad()
    return tabToReturn
  }

  async NavigateDirectlyToJob() {
    await this.page.goto(this.baseURL)
    await this.page.waitForURL(this.baseURL)
  }

  async OpenCreateNoteDrawer() {
    await this.Button_Actions.Click()
    const menuItemLocator = this.page.getByRole('menuitem', {
      name: JobPageStrings.MenuItem_Actions_AddNote,
    })
    await menuItemLocator.click()
    const createNoteDrawer = new ClaimsPortalCreateNoteDrawer(this.global)
    await expect(createNoteDrawer.Title.locator).toBeAttached()
    return createNoteDrawer
  }

  async OpenAddPersonToPortalDrawer() {
    await this.Button_Actions.Click()
    const menuItemLocator = this.page.getByRole('menuitem', {
      name: JobPageStrings.MenuItem_Actions_AddPersonToJobPortal,
    })
    await menuItemLocator.click()
    const addPersonToPortalDrawer = new ClaimsPortalAddPersonToPortalDrawer(this.global)
    await expect(addPersonToPortalDrawer.Title.locator).toBeAttached()
    return addPersonToPortalDrawer
  }

  async OpenRecordCustomerContactAttempt() {
    await this.Button_Actions.Click()
    const menuItemLocator = this.page.getByRole('menuitem', {
      name: JobPageStrings.MenuItem_Actions_CustomerContactAttempted,
    })
    await menuItemLocator.click()
    const recordCustomerContactAttemptDrawer = new ClaimsPortalRecordCustomerContactAttemptDrawer(
      this.global
    )
    await expect(recordCustomerContactAttemptDrawer.Title.locator).toBeAttached()
    return recordCustomerContactAttemptDrawer
  }

  async OpenRecordTarpingWork() {
    await this.Button_Actions.Click()
    const menuItemLocator = this.page.getByRole('menuitem', {
      name: JobPageStrings.MenuItem_Actions_RecordTarpingWork,
    })
    await menuItemLocator.click()
    const recordTarpingWorkDrawer = new ClaimsPortalEnterWorkDetailsForJobDrawer(this.global)
    await expect(recordTarpingWorkDrawer.Title.locator).toBeAttached()
    return recordTarpingWorkDrawer
  }

  async OpenAddTags() {
    await this.Button_Actions.Click()
    const menuItemLocator = this.page.getByRole('menuitem', {
      name: JobPageStrings.MenuItem_Actions_AddTags,
    })
    await menuItemLocator.click()
    const addTagsDialog = new ClaimsPortalAddTagsDialog(this.global)
    await expect(addTagsDialog.Title.locator).toBeAttached()
    return addTagsDialog
  }

  async OpenCloseJobDrawer() {
    await this.Button_Actions.Click()
    const menuItemLocator = this.page.getByRole('menuitem', {
      name: JobPageStrings.MenuItem_Actions_CloseJob,
    })
    await menuItemLocator.click()
    const closeJobDrawer = new ClaimsPortalCloseJobDrawer(this.global)
    await expect(closeJobDrawer.Title.locator).toBeAttached()
    return closeJobDrawer
  }

  async AddTag(key: string, value: string = '', color: string = '') {
    const addTagsDialog = await this.OpenAddTags()
    await addTagsDialog.SetKeyValue(key)
    if (value != '') {
      await addTagsDialog.SetValueValue(value)
    }
    if (color != '') {
      await addTagsDialog.SetColor(color)
    }
    await addTagsDialog.Button_AddAndClose.Click()
    await this.page.waitForTimeout(3000)
  }

  async TagCount() {
    const tagCount = await this.tags.count()
    return tagCount
  }

  async TagIsAdded(tag: string) {
    return this.TagWithValueIsAdded(tag)
  }

  async TagWithValueIsAdded(tag: string, value: string = '') {
    const assembledLocator = this.tags.locator('span span')
    const search = value == '' ? `${tag}` : `${tag}:${value}`
    const tagWithValueExists = (await assembledLocator.locator(`text="${search}"`).count()) > 0
    return tagWithValueExists
  }

  async RemoveTag(tag: string) {
    await this.RemoveTagWithValue(tag)
  }

  async RemoveTagWithValue(tag: string, value: string = '') {
    const assembledLocator = this.tags.locator('span span')
    const search = value == '' ? `${tag}` : `${tag}:${value}`
    const targetedTagLocator = assembledLocator.locator(`text="${search}"`)
    if ((await targetedTagLocator.count()) == 0) {
      throw new Error(`Error - tag to remove: ${search} is not attached to claim`)
    }
    const tagRemoveButton = targetedTagLocator.locator('..').locator('button[aria-label="close"]')
    await tagRemoveButton.click()
    await this.page.waitForTimeout(3000)
  }

  async VerifyMenuItemIsAttached(menuItemName: string) {
    const menuItemLocator = this.page.getByRole('menuitem', {
      name: menuItemName,
    })
    await expect(menuItemLocator).toBeAttached()
  }
}
