import { expect } from '@playwright/test'
import test from '../../library/shared/testHooks.js'
import { UserPortalJobCommunicationPage } from '../../library/userPortal/pages/userPortalJobCommunicationPage.js'
import { UserPortalJobDocumentsPage } from '../../library/userPortal/pages/userPortalJobDocumentsPage.js'
import { UserPortalJobMediaPage } from '../../library/userPortal/pages/userPortalJobMediaPage.js'
import { CannedJobTypes, DefaultEnvironment } from '../../library/userPortal/userPortalConstants.js'
import { FetchCannedJob, LaunchJob } from '../../library/userPortal/userPortalHelper.js'
import { Tags } from '../../library/shared/constants.js'
import { UserPortalJobUploadPage } from '../../library/userPortal/pages/userPortalJobUploadPage.js'

const environment = DefaultEnvironment

test.describe(
  'Job Details Page',
  {
    tag: [Tags.UserPortal, Tags.Job, Tags.InfoDetails],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch UserPortal - landing page is Job Details page
      const job = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const { detailsPage } = await LaunchJob(browser, environment, job)

      // Verify data is correct for the Job Details section
      await detailsPage.VerifyJobDetailsSection()

      // Verify data is correct for the Your Job Team section
      await detailsPage.VerifyYourJobTeamSection()

      // Verify data is correct for the Job Visualizer section
      await detailsPage.VerifyJobVisualizerSection()

      // Verify data is correct for the Actions section
      await detailsPage.VerifyActionsSection()
    })

    test('Verify Action Links navigation', async ({ browser }) => {
      // launch UserPortal - landing page is JobDetails page
      const job = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const { global, detailsPage } = await LaunchJob(browser, environment, job)

      // Click the View Documents link in Actions
      await detailsPage.Link_Actions_ViewDocuments.Click()

      // Verify navigation to Documents page
      const documentsPage = new UserPortalJobDocumentsPage(global, job)
      expect(detailsPage.page.url()).toBe(documentsPage.URL)

      // return to Details page
      await detailsPage.leftNavBar.Link_Details.Click()

      // Click the View Media link in Actions
      await detailsPage.Link_Actions_ViewMedia.Click()

      // Verify navigation to Media page
      const mediaPage = new UserPortalJobMediaPage(global, job)
      expect(detailsPage.page.url()).toBe(mediaPage.URL)

      // return to Details page
      await detailsPage.leftNavBar.Link_Details.Click()

      // Click the Upload link in Actions
      await detailsPage.Link_Actions_Upload.Click()

      // Verify navigation to Upload Documents page
      const uploadPage = new UserPortalJobUploadPage(global, job, detailsPage.baseURL)
      expect(detailsPage.page.url()).toBe(uploadPage.URL)

      // return to Details page
      await detailsPage.leftNavBar.Link_Details.Click()

      // Click the Schedule a Callback link in Actions
      await detailsPage.Link_Actions_ScheduleCallback.Click()

      // Verify navigation to Communications page
      const communicationPage = new UserPortalJobCommunicationPage(global, job)
      expect(detailsPage.page.url()).toBe(communicationPage.URL)
    })
  }
)
