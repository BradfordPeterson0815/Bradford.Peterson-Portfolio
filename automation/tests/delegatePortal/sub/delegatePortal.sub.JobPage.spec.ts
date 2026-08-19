import { expect } from '@playwright/test'
import {
  CannedJobTypes,
  DefaultEnvironment,
  JobTabTypes,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { FetchCannedJob } from '../../../library/delegatePortal/delegatePortalHelper.js'
import { LaunchSubcontractor } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Job Page',
  {
    tag: [Tags.Delegate, Tags.Subcontractor, Tags.Job],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Subcontractor home page
      const { homePage } = await LaunchSubcontractor(browser, environment)

      // Select a Job, and click the Job Id link
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = await homePage.OpenJob(testJob)

      //Verify that we land on the Job page for that job, defaulting to the Details section
      const detailsTab = await jobPage.SelectJobTab(JobTabTypes.Details)
      expect(await jobPage.IsTabActive(JobTabTypes.Details)).toBe(true)
      expect(jobPage.page.url()).toBe(detailsTab.URL)

      // Verify that the Jobs link is displayed (top left)
      expect(await jobPage.Link_Jobs.IsVisible()).toBe(true)

      // Verify the job number for this job is displayed on the top left, with a (JOB) label
      await jobPage.Title.VerifyExpectedText()

      // Verify contact name, phone, email and address display below job number
      if (testJob.contact.name == '') {
        expect(await jobPage.Label_PrimaryContact_Name.GetText()).toBe('Unknown')
        expect(await jobPage.Link_PrimaryContact_Email.IsVisible()).toBe(false)
        expect(await jobPage.Link_PrimaryContact_Phone.IsVisible()).toBe(false)
        expect(await jobPage.Link_PrimaryContact_Address.IsVisible()).toBe(false)
      } else {
        expect(await jobPage.Label_PrimaryContact_Name.GetText()).toBe(testJob.contact.name)
        expect(await jobPage.Link_PrimaryContact_Phone.GetText()).toBe(testJob.contact.phone)
        expect(await jobPage.Link_PrimaryContact_Email.GetText()).toBe(testJob.contact.email)
        expect(await jobPage.Link_PrimaryContact_Address.locator.innerText()).toBe(
          testJob.jobLocation.fullAddress
        )
      }

      // Select Documents section link- verify the Documents section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Documents)
      expect(await jobPage.IsTabActive(JobTabTypes.Documents)).toBe(true)

      // Select Media section link- verify the Media section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Media)
      expect(await jobPage.IsTabActive(JobTabTypes.Media)).toBe(true)

      // Select Notes section link- verify the Notes section appears, with link underlined
      await jobPage.SelectJobTab(JobTabTypes.Notes)
      expect(await jobPage.IsTabActive(JobTabTypes.Notes)).toBe(true)

      // Click the Jobs link and verify we are back on the Your Assigned Jobs page
      await jobPage.Link_Jobs.Click()
      await jobPage.page.waitForTimeout(1000)
    })
  }
)
