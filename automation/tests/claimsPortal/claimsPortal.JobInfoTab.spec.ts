import { expect } from '@playwright/test'
import test from '../../library/shared/testHooks.js'
import { FetchCannedJob, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { DefaultEnvironment, CannedJobTypes, JobTabTypes } from '../../library/claimsPortal/claimsPortalConstants.js'
import { ClaimsPortalJobPage } from '../../library/claimsPortal/pages/claimsPortalJobPage.js'
import { ClaimsPortalJobInfoTab } from '../../library/claimsPortal/tabs/claimsPortalJobInfoTab.js'
import { Tags } from '../../library/shared/constants.js'
import { ClaimsPortalJobsPage } from '../../library/claimsPortal/pages/claimsPortalJobsPage.js'

const environment = DefaultEnvironment

test.describe(
  'Job Page: Info Tab',
  {
    tag: [Tags.ClaimsPortal, Tags.Job, Tags.InfoDetails],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      test.slow()

      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // find a random job and go to it
      const jobsPage = new ClaimsPortalJobsPage(global)
      await jobsPage.NavigateToPage()
      const { jobPage } = await jobsPage.OpenRandomJob()

      // Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab
      expect(await jobPage.IsTabActive(JobTabTypes.Info)).toBe(true)
      expect(jobPage.page.url()).toBe(infoTab.URL)

      // Verify data is correct for the Job Details section
      await infoTab.VerifyJobDetailsSection(true)

      // Verify data is correct for the Job Assignments section
      await infoTab.VerifyJobAssignmentsSection(true)

      // Verify data is correct for the Loss Location section
      await infoTab.VerifyJobLocationSection(true)

      // Verify data is correct for the Contact Information section
      await infoTab.VerifyContactInformationSection(true)

      // Verify data is correct for the Work Authorization section
      await infoTab.VerifyWorkAuthorizationSection(true)

      // Verify data is correct for the Work Details section
      await infoTab.VerifyWorkDetailsSection(true)
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      // Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab
      expect(await jobPage.IsTabActive(JobTabTypes.Info)).toBe(true)
      expect(jobPage.page.url()).toBe(infoTab.URL)

      // Verify data is correct for the Job Details section
      await infoTab.VerifyJobDetailsSection()

      // Verify data is correct for the Job Assignments section
      await infoTab.VerifyJobAssignmentsSection()

      // Verify data is correct for the Loss Location section
      await infoTab.VerifyJobLocationSection()

      // Verify data is correct for the Contact Information section
      await infoTab.VerifyContactInformationSection()

      // Verify data is correct for the Work Authorization section
      await infoTab.VerifyWorkAuthorizationSection()

      // Verify data is correct for the Work Details section
      await infoTab.VerifyWorkDetailsSection()

      // Verify data is correct for the Job Timeline section
      await infoTab.VerifyJobTimelineSection()
      expect(await infoTab.TimelineEventCount()).toBeGreaterThanOrEqual(
        testJob.testData.jobTimelineCount
      )
    })

    test('Job Assignments - Edit Coordinator: Verify UI and Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      // Verify Coordinator label and Edit button are visible,
      await expect(infoTab.Label_JobAssignments_Coordinator.locator).toBeVisible()
      await expect(infoTab.Button_EditCoordinator).toBeVisible()
      // if Coordinator is set, the Remove button should be visible as well
      const isCoordinatorAssigned = await infoTab.IsCoordinatorAssigned()
      await expect(infoTab.Button_RemoveCoordinator).toBeVisible({ visible: isCoordinatorAssigned })

      // Click Coordinator Edit (Pencil icon) button
      await infoTab.Button_EditCoordinator.click()

      // Verify Edit button and Remove buttons are no longer visible
      await expect(infoTab.Button_EditCoordinator).toBeHidden()
      await expect(infoTab.Button_RemoveCoordinator).toBeHidden()

      // Verify inline edit UI appears - (Selection list, Save button, Goto Contact Book, Cancel (X) button)
      await expect(infoTab.ComboBox_EditingCoordinator_Select).toBeVisible()
      await expect(infoTab.Button_EditingCoordinator_Save).toBeVisible()
      await expect(infoTab.Button_EditingCoordinator_GotoContactBook).toBeVisible()
      await expect(infoTab.Button_EditingCoordinator_CancelEditing).toBeVisible()

      // Validate on Save button with no Coordinator selected
      await infoTab.Button_EditingCoordinator_Save.click()
      await infoTab.ValidateCoordinator()

      // Verify clicking Cancel (X) button hides inline edit UI - data and Edit button reappear
      await infoTab.Button_EditingCoordinator_CancelEditing.click()

      // Verify inline edit UI disappears - (Selection list, Save button, Goto Contact Book, Cancel (X) button)
      await expect(infoTab.ComboBox_EditingCoordinator_Select).toBeHidden()
      await expect(infoTab.Button_EditingCoordinator_Save).toBeHidden()
      await expect(infoTab.Button_EditingCoordinator_GotoContactBook).toBeHidden()
      await expect(infoTab.Button_EditingCoordinator_CancelEditing).toBeHidden()

      // Verify Coordinator label and Edit button are visible,
      await expect(infoTab.Label_JobAssignments_Coordinator.locator).toBeVisible()
      await expect(infoTab.Button_EditCoordinator).toBeVisible()
      // if Coordinator is set, the delete button should be visible as well
      await expect(infoTab.Button_RemoveCoordinator).toBeVisible({ visible: isCoordinatorAssigned })

      // Verify clicking Goto Contact Book navigates to associated Contact Book page
      await infoTab.Button_EditCoordinator.click()
      await infoTab.Button_EditingCoordinator_GotoContactBook.click()
      expect(infoTab.page.url().endsWith('contacts/book/corn:contacts:book:claims')).toBe(true)
    })

    test('Job Assignments - Edit Project Manager: Verify UI and Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      // Verify Project Manager label and Edit button are visible,
      await expect(infoTab.Label_JobAssignments_ProjectManager.locator).toBeVisible()
      await expect(infoTab.Button_EditProjectManager).toBeVisible()
      // if Project Manager is set, the Remove button should be visible as well
      const isProjectManagerAssigned = await infoTab.IsProjectManagerAssigned()
      await expect(infoTab.Button_RemoveProjectManager).toBeVisible({
        visible: isProjectManagerAssigned,
      })

      // Click Project Manager Edit (Pencil icon) button
      await infoTab.Button_EditProjectManager.click()

      // Verify Edit button and Remove buttons are no longer visible
      await expect(infoTab.Button_EditProjectManager).toBeHidden()
      await expect(infoTab.Button_RemoveProjectManager).toBeHidden()

      // Verify inline edit UI appears - (Selection list, Save button, Goto Contact Book, Cancel (X) button)
      await expect(infoTab.ComboBox_EditingProjectManager_Select).toBeVisible()
      await expect(infoTab.Button_EditingProjectManager_Save).toBeVisible()
      await expect(infoTab.Button_EditingProjectManager_GotoContactBook).toBeVisible()
      await expect(infoTab.Button_EditingProjectManager_CancelEditing).toBeVisible()

      // Validate on Save button with no Project Manager selected
      await infoTab.Button_EditingProjectManager_Save.click()
      await infoTab.ValidateProjectManager()

      // Verify clicking Cancel (X) button hides inline edit UI - data and Edit button reappear
      await infoTab.Button_EditingProjectManager_CancelEditing.click()

      // Verify inline edit UI disappears - (Selection list, Save button, Goto Contact Book, Cancel (X) button)
      await expect(infoTab.ComboBox_EditingProjectManager_Select).toBeHidden()
      await expect(infoTab.Button_EditingProjectManager_Save).toBeHidden()
      await expect(infoTab.Button_EditingProjectManager_GotoContactBook).toBeHidden()
      await expect(infoTab.Button_EditingProjectManager_CancelEditing).toBeHidden()

      // Verify Project Manager label and Edit button are visible,
      await expect(infoTab.Label_JobAssignments_ProjectManager.locator).toBeVisible()
      await expect(infoTab.Button_EditProjectManager).toBeVisible()
      // if Project Manager is set, the delete button should be visible as well
      await expect(infoTab.Button_RemoveProjectManager).toBeVisible({
        visible: isProjectManagerAssigned,
      })

      // Verify clicking Goto Contact Book navigates to associated Contact Book page
      await infoTab.Button_EditProjectManager.click()
      await infoTab.Button_EditingProjectManager_GotoContactBook.click()
      expect(infoTab.page.url().endsWith('contacts/book/corn:contacts:book:projectManager')).toBe(
        true
      )
    })

    test('Job Assignments - Edit Approver: Verify UI and Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      // Verify Approver label and Edit button are visible,
      await expect(infoTab.Label_JobAssignments_Approver.locator).toBeVisible()
      await expect(infoTab.Button_EditApprover).toBeVisible()
      // if Approver is set, the Remove button should be visible as well
      const isApproverAssigned = await infoTab.IsApproverAssigned()
      await expect(infoTab.Button_RemoveApprover).toBeVisible({ visible: isApproverAssigned })

      // Click Approver Edit (Pencil icon) button
      await infoTab.Button_EditApprover.click()

      // Verify Edit button and Remove buttons are no longer visible
      await expect(infoTab.Button_EditApprover).toBeHidden()
      await expect(infoTab.Button_RemoveApprover).toBeHidden()

      // Verify inline edit UI appears - (Selection list, Save button, Goto Contact Book, Cancel (X) button)
      await expect(infoTab.ComboBox_EditingApprover_Select).toBeVisible()
      await expect(infoTab.Button_EditingApprover_Save).toBeVisible()
      await expect(infoTab.Button_EditingApprover_GotoContactBook).toBeVisible()
      await expect(infoTab.Button_EditingApprover_CancelEditing).toBeVisible()

      // Validate on Save button with no Approver selected
      await infoTab.Button_EditingApprover_Save.click()
      await infoTab.ValidateApprover()

      // Verify clicking Cancel (X) button hides inline edit UI - data and Edit button reappear
      await infoTab.Button_EditingApprover_CancelEditing.click()

      // Verify inline edit UI disappears - (Selection list, Save button, Goto Contact Book, Cancel (X) button)
      await expect(infoTab.ComboBox_EditingApprover_Select).toBeHidden()
      await expect(infoTab.Button_EditingApprover_Save).toBeHidden()
      await expect(infoTab.Button_EditingApprover_GotoContactBook).toBeHidden()
      await expect(infoTab.Button_EditingApprover_CancelEditing).toBeHidden()

      // Verify Approver label and Edit button are visible,
      await expect(infoTab.Label_JobAssignments_Approver.locator).toBeVisible()
      await expect(infoTab.Button_EditApprover).toBeVisible()
      // if Approver is set, the delete button should be visible as well
      await expect(infoTab.Button_RemoveApprover).toBeVisible({ visible: isApproverAssigned })

      // Verify clicking Goto Contact Book navigates to associated Contact Book page
      await infoTab.Button_EditApprover.click()
      await infoTab.Button_EditingApprover_GotoContactBook.click()
      expect(infoTab.page.url().endsWith('contacts/book/corn:contacts:book:projectManager')).toBe(
        true
      )
    })

    test('Job Assignments - Edit Dispatcher: Verify UI and Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      // Verify Dispatcher label and Edit button are visible,
      await expect(infoTab.Label_JobAssignments_Dispatcher.locator).toBeVisible()
      await expect(infoTab.Button_EditDispatcher).toBeVisible()
      // if Dispatcher is set, the Remove button should be visible as well
      const isDispatcherAssigned = await infoTab.IsDispatcherAssigned()
      await expect(infoTab.Button_RemoveDispatcher).toBeVisible({ visible: isDispatcherAssigned })

      // Click Dispatcher Edit (Pencil icon) button
      await infoTab.Button_EditDispatcher.click()

      // Verify Edit button and Remove buttons are no longer visible
      await expect(infoTab.Button_EditDispatcher).toBeHidden()
      await expect(infoTab.Button_RemoveDispatcher).toBeHidden()

      // Verify inline edit UI appears - (Selection list, Save button, Goto Contact Book, Cancel (X) button)
      await expect(infoTab.ComboBox_EditingDispatcher_Select).toBeVisible()
      await expect(infoTab.Button_EditingDispatcher_Save).toBeVisible()
      await expect(infoTab.Button_EditingDispatcher_GotoContactBook).toBeVisible()
      await expect(infoTab.Button_EditingDispatcher_CancelEditing).toBeVisible()

      // Validate on Save button with no Dispatcher selected
      await infoTab.Button_EditingDispatcher_Save.click()
      await infoTab.ValidateDispatcher()

      // Verify clicking Cancel (X) button hides inline edit UI - data and Edit button reappear
      await infoTab.Button_EditingDispatcher_CancelEditing.click()

      // Verify inline edit UI disappears - (Selection list, Save button, Goto Contact Book, Cancel (X) button)
      await expect(infoTab.ComboBox_EditingDispatcher_Select).toBeHidden()
      await expect(infoTab.Button_EditingDispatcher_Save).toBeHidden()
      await expect(infoTab.Button_EditingDispatcher_GotoContactBook).toBeHidden()
      await expect(infoTab.Button_EditingDispatcher_CancelEditing).toBeHidden()

      // Verify Dispatcher label and Edit button are visible,
      await expect(infoTab.Label_JobAssignments_Dispatcher.locator).toBeVisible()
      await expect(infoTab.Button_EditDispatcher).toBeVisible()
      // if Dispatcher is set, the delete button should be visible as well
      await expect(infoTab.Button_RemoveDispatcher).toBeVisible({ visible: isDispatcherAssigned })

      // Verify clicking Goto Contact Book navigates to associated Contact Book page
      await infoTab.Button_EditDispatcher.click()
      await infoTab.Dispatcher_GotoContactBook_ProjectManager()
      expect(infoTab.page.url().endsWith('contacts/book/corn:contacts:book:projectManager')).toBe(
        true
      )
    })

    test('Job Location - Verify Map link', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      // Click Map link and verify navigation in new tab to Google Maps
      await infoTab.OpenMapLinkInNewTabVerifyTitleAndClose(testJob.jobLocation.mapStreet)
    })

    test('Job Location - Verify No Associated Claim UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.NoClaimNoContact)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      // Verify UI present when no claim number is set
      expect(await infoTab.ComboBox_SelectClaimNumber_Select.isVisible()).toBe(true)
      expect(await infoTab.Button_SaveClaim.isVisible()).toBe(true)
    })

    test('Job Location - Verify No Primary Contact UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.NoClaimNoContact)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      // Verify UI present when no primary contact is set
      expect(await infoTab.ComboBox_SelectClaimNumber_Select.isVisible()).toBe(true)
      expect(await infoTab.Button_SaveClaim.isVisible()).toBe(true)
      expect(await infoTab.Button_EditingPrimaryContact_GotoContactBook.isVisible()).toBe(true)

      // clicking GotoContactBook takes us to the contact tab of the job
      await infoTab.Button_EditingPrimaryContact_GotoContactBook.click()
      expect(await jobPage.IsTabActive(JobTabTypes.Contacts)).toBe(true)
    })

    test('Record Job Event Navigation', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      //Verify that clicking on Record Job Event navigates us to the timeline new event tab
      const timelineNewEventTab = await infoTab.OpenRecordJobEvent()
      expect(timelineNewEventTab.page.url().endsWith('/timeline/new-event')).toBe(true)
    })

    test('View Full Timeline Navigation', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      //Verify that clicking on View Full Timeline navigates us to the timeline page
      const timelineTab = await infoTab.OpenFullTimeline()
      expect(timelineTab.page.url().endsWith('/timeline')).toBe(true)
    })

    test('Validate Field Tech or Subcontractor', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab

      if (
        // no field technician, yes subcontractor
        testJob.jobAssignments.fieldTech == '' &&
        testJob.jobAssignments.subcontractor != ''
      ) {
        // We should see a warning message that there can be only one
        await infoTab.Label_Alert_OnlyOneSubOrTechCanBeAssigned.IsVisible()
        await infoTab.Label_Alert_OnlyOneSubOrTechCanBeAssigned.VerifyExpectedTextAlt()

        // Field technician should be disabled, edit button should be disabled
        await expect(infoTab.Label_JobAssignments_FieldTech_Actual.locator).toHaveText(
          'Unassigned'
        )
        await expect(infoTab.Button_EditFieldTech).toBeDisabled()

        // subcontractor should be visible and editable, etc
        // Verify Subcontractor label and Edit button are visible,
        await expect(infoTab.Label_JobAssignments_Subcontractor.locator).toBeVisible()
        await expect(infoTab.Button_EditSubcontractor).toBeVisible()
        // if Subcontractor is set, the Remove button should be visible as well
        const isSubcontractorAssigned = await infoTab.IsSubcontractorAssigned()
        await expect(infoTab.Button_RemoveSubcontractor).toBeVisible({
          visible: isSubcontractorAssigned,
        })

        // Click Subcontractor Edit (Pencil icon) button
        await infoTab.Button_EditSubcontractor.click()

        // Verify Edit button and Remove buttons are no longer visible
        await expect(infoTab.Button_EditSubcontractor).toBeHidden()
        await expect(infoTab.Button_RemoveSubcontractor).toBeHidden()

        // Verify inline edit UI appears - (Selection list, Save button, Goto Contact Book, Cancel (X) button)
        await expect(infoTab.ComboBox_EditingSubcontractor_Select).toBeVisible()
        await expect(infoTab.Button_EditingSubcontractor_Save).toBeVisible()
        await expect(infoTab.Button_EditingSubcontractor_GotoContactBook).toBeVisible()
        await expect(infoTab.Button_EditingSubcontractor_CancelEditing).toBeVisible()

        // Validate on Save button with no Subcontractor selected
        await infoTab.Button_EditingSubcontractor_Save.click()
        await infoTab.ValidateSubcontractor()

        // Verify clicking Cancel (X) button hides inline edit UI - data and Edit button reappear
        await infoTab.Button_EditingSubcontractor_CancelEditing.click()

        // Verify inline edit UI disappears - (Selection list, Save button, Goto Contact Book, Cancel (X) button)
        await expect(infoTab.ComboBox_EditingSubcontractor_Select).toBeHidden()
        await expect(infoTab.Button_EditingSubcontractor_Save).toBeHidden()
        await expect(infoTab.Button_EditingSubcontractor_GotoContactBook).toBeHidden()
        await expect(infoTab.Button_EditingSubcontractor_CancelEditing).toBeHidden()

        // Verify Subcontractor label and Edit button are visible,
        await expect(infoTab.Label_JobAssignments_Subcontractor.locator).toBeVisible()
        await expect(infoTab.Button_EditSubcontractor).toBeVisible()

        // if Subcontractor is set, the delete button should be visible as well
        await expect(infoTab.Button_RemoveSubcontractor).toBeVisible({
          visible: isSubcontractorAssigned,
        })

        // Verify clicking Goto Contact Book navigates to associated Contact Book page
        await infoTab.Button_EditSubcontractor.click()
        await infoTab.Button_EditingSubcontractor_GotoContactBook.click()
        expect(infoTab.page.url().endsWith('contacts/book/corn:contacts:book:subcontractor')).toBe(
          true
        )
      } else if (
        // yes field technician, no subcontractor
        testJob.jobAssignments.fieldTech != '' &&
        testJob.jobAssignments.subcontractor == ''
      ) {
        // We should see a warning message that there can be only one
        await infoTab.Label_Alert_OnlyOneSubOrTechCanBeAssigned.IsVisible()
        await infoTab.Label_Alert_OnlyOneSubOrTechCanBeAssigned.VerifyExpectedTextAlt()

        // Subcontractor should be disabled, edit button should be disabled
        await expect(infoTab.Label_JobAssignments_Subcontractor_Actual.locator).toHaveText(
          'Unassigned'
        )
        await expect(infoTab.Button_EditSubcontractor).toBeDisabled()

        // field technician should be visible and editable, etc
        // Verify Field Tech label and Edit button are visible,
        await expect(infoTab.Label_JobAssignments_FieldTech.locator).toBeVisible()
        await expect(infoTab.Button_EditFieldTech).toBeVisible()
        // if Field Tech is set, the Remove button should be visible as well
        const isFieldTechAssigned = await infoTab.IsFieldTechAssigned()
        await expect(infoTab.Button_RemoveFieldTech).toBeVisible({
          visible: isFieldTechAssigned,
        })

        // Click Field Tech Edit (Pencil icon) button
        await infoTab.Button_EditFieldTech.click()

        // Verify Edit button and Remove buttons are no longer visible
        await expect(infoTab.Button_EditFieldTech).toBeHidden()
        await expect(infoTab.Button_RemoveFieldTech).toBeHidden()

        // Verify inline edit UI appears - (Selection list, Save button, Goto Contact Book, Cancel (X) button)
        await expect(infoTab.ComboBox_EditingFieldTech_Select).toBeVisible()
        await expect(infoTab.Button_EditingFieldTech_Save).toBeVisible()
        await expect(infoTab.Button_EditingFieldTech_GotoContactBook).toBeVisible()
        await expect(infoTab.Button_EditingFieldTech_CancelEditing).toBeVisible()

        // Validate on Save button with no Field Tech selected
        await infoTab.Button_EditingFieldTech_Save.click()
        await infoTab.ValidateFieldTech()

        // Verify clicking Cancel (X) button hides inline edit UI - data and Edit button reappear
        await infoTab.Button_EditingFieldTech_CancelEditing.click()

        // Verify inline edit UI disappears - (Selection list, Save button, Goto Contact Book, Cancel (X) button)
        await expect(infoTab.ComboBox_EditingFieldTech_Select).toBeHidden()
        await expect(infoTab.Button_EditingFieldTech_Save).toBeHidden()
        await expect(infoTab.Button_EditingFieldTech_GotoContactBook).toBeHidden()
        await expect(infoTab.Button_EditingFieldTech_CancelEditing).toBeHidden()

        // Verify Field Tech label and Edit button are visible,
        await expect(infoTab.Label_JobAssignments_FieldTech.locator).toBeVisible()
        await expect(infoTab.Button_EditFieldTech).toBeVisible()

        // if Field Tech is set, the delete button should be visible as well
        await expect(infoTab.Button_RemoveFieldTech).toBeVisible({
          visible: isFieldTechAssigned,
        })

        // Verify clicking Goto Contact Book navigates to associated Contact Book page
        await infoTab.Button_EditFieldTech.click()
        await infoTab.Button_EditingFieldTech_GotoContactBook.click()
        expect(
          infoTab.page.url().endsWith('contacts/book/corn:contacts:book:fieldTech')
        ).toBe(true)
      } else if (
        // no field technician, no subcontractor
        testJob.jobAssignments.fieldTech == '' &&
        testJob.jobAssignments.subcontractor == ''
      ) {
        // We should NOT see a warning message that there can be only one
        await infoTab.Label_Alert_OnlyOneSubOrTechCanBeAssigned.IsHidden()

        // Subcontractor should be enabled, edit button should be enabled
        await expect(infoTab.Label_JobAssignments_Subcontractor_Actual.locator).toHaveText(
          'Unassigned'
        )
        await expect(infoTab.Button_EditSubcontractor).toBeDisabled()

        // Field technician should be enabled, edit button should be enabled
        await expect(infoTab.Label_JobAssignments_FieldTech_Actual.locator).toHaveText(
          'Unassigned'
        )
        await expect(infoTab.Button_EditFieldTech).toBeDisabled()
      } else {
        throw new Error('We have a job with both a Field Tech and a Subcontractor')
      }
    })

    test('Verify Job with no Work Details', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.TestOne)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab
      expect(await jobPage.IsTabActive(JobTabTypes.Info)).toBe(true)
      expect(jobPage.page.url()).toBe(infoTab.URL)

      // Verify data is correct for the Work Details section
      await infoTab.VerifyWorkDetailsSection()
    })

    test('Mark Job as Started - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab
      expect(await jobPage.IsTabActive(JobTabTypes.Info)).toBe(true)
      expect(jobPage.page.url()).toBe(infoTab.URL)

      let markAsStartedDrawer = await infoTab.OpenMarkAsStarted()
      //Verify drawer heading is "Mark Job Started"
      markAsStartedDrawer.VerifyTitle()
      expect(markAsStartedDrawer.TextBox_StartedDate.locator).toBeAttached()
      expect(markAsStartedDrawer.TextArea_NoteText.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await markAsStartedDrawer.Close()
      await expect(markAsStartedDrawer.Title.locator).not.toBeAttached()
      await infoTab.page.waitForTimeout(1000)

      markAsStartedDrawer = await infoTab.OpenMarkAsStarted()
      // Verify drawer closes with ESC key
      await markAsStartedDrawer.Close(true)
      await expect(markAsStartedDrawer.Title.locator).not.toBeAttached()
      await infoTab.page.waitForTimeout(1000)

      markAsStartedDrawer = await infoTab.OpenMarkAsStarted()
      // Verify drawer closes if click on Close
      await markAsStartedDrawer.Button_Close.Click()
      await expect(markAsStartedDrawer.Title.locator).not.toBeAttached()
      await markAsStartedDrawer.page.waitForTimeout(1000)
    })

    test('Mark Job as Started - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab
      expect(await jobPage.IsTabActive(JobTabTypes.Info)).toBe(true)
      expect(jobPage.page.url()).toBe(infoTab.URL)

      const markAsStartedDrawer = await infoTab.OpenMarkAsStarted()

      // Click the Submit button
      await markAsStartedDrawer.Button_Submit.Click()
      await infoTab.page.waitForTimeout(1000)

      // Verify validation message for the drawer
      expect(await markAsStartedDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await markAsStartedDrawer.Button_Close.Click()
    })

    test('Close Job - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab
      expect(await jobPage.IsTabActive(JobTabTypes.Info)).toBe(true)
      expect(jobPage.page.url()).toBe(infoTab.URL)

      let closeJobDrawer = await infoTab.OpenCloseJob()
      //Verify drawer heading is "Close Job"
      closeJobDrawer.VerifyTitle()
      expect(closeJobDrawer.TextBox_ClosedDate.locator).toBeAttached()
      expect(closeJobDrawer.ListBox_Reason.locator).toBeAttached()
      expect(closeJobDrawer.TextArea_Notes.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await closeJobDrawer.Close()
      await expect(closeJobDrawer.Title.locator).not.toBeAttached()
      await infoTab.page.waitForTimeout(1000)

      closeJobDrawer = await infoTab.OpenCloseJob()
      // Verify drawer closes with ESC key
      await closeJobDrawer.Close(true)
      await expect(closeJobDrawer.Title.locator).not.toBeAttached()
      await infoTab.page.waitForTimeout(1000)

      closeJobDrawer = await infoTab.OpenCloseJob()
      // Verify drawer closes if click on Close
      await closeJobDrawer.Button_Close.Click()
      await expect(closeJobDrawer.Title.locator).not.toBeAttached()
      await closeJobDrawer.page.waitForTimeout(1000)
    })

    test('Close Job - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab
      expect(await jobPage.IsTabActive(JobTabTypes.Info)).toBe(true)
      expect(jobPage.page.url()).toBe(infoTab.URL)

      const closeJobDrawer = await infoTab.OpenCloseJob()

      // Click the Submit button
      await closeJobDrawer.Button_Submit.Click()
      await infoTab.page.waitForTimeout(1000)

      // Verify validation message for the drawer
      expect(await closeJobDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await closeJobDrawer.Button_Close.Click()
    })

    test('Customer Contact Attempted - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab
      expect(await jobPage.IsTabActive(JobTabTypes.Info)).toBe(true)
      expect(jobPage.page.url()).toBe(infoTab.URL)

      let recordCustomerContactAttemptDrawer = await infoTab.OpenCustomerContactAttempted()
      //Verify drawer heading is "Record Customer Contact Attempt"
      recordCustomerContactAttemptDrawer.VerifyTitle()
      expect(recordCustomerContactAttemptDrawer.TextBox_ContactAttemptedDate.locator).toBeAttached()
      expect(recordCustomerContactAttemptDrawer.ComboBox_ContactedBy.locator).toBeAttached()
      expect(recordCustomerContactAttemptDrawer.ComboBox_CustomerContacted.locator).toBeAttached()
      expect(recordCustomerContactAttemptDrawer.ListBox_Method.locator).toBeAttached()
      expect(recordCustomerContactAttemptDrawer.ListBox_Outcome.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await recordCustomerContactAttemptDrawer.Close()
      await expect(recordCustomerContactAttemptDrawer.Title.locator).not.toBeAttached()
      await infoTab.page.waitForTimeout(1000)

      recordCustomerContactAttemptDrawer = await infoTab.OpenCustomerContactAttempted()
      // Verify drawer closes with ESC key
      await recordCustomerContactAttemptDrawer.Close(true)
      await expect(recordCustomerContactAttemptDrawer.Title.locator).not.toBeAttached()
      await infoTab.page.waitForTimeout(1000)

      recordCustomerContactAttemptDrawer = await infoTab.OpenCustomerContactAttempted()
      // Verify drawer closes if click on Close
      await recordCustomerContactAttemptDrawer.Button_Close.Click()
      await expect(recordCustomerContactAttemptDrawer.Title.locator).not.toBeAttached()
      await recordCustomerContactAttemptDrawer.page.waitForTimeout(1000)
    })

    test('Customer Contact Attempted - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab
      expect(await jobPage.IsTabActive(JobTabTypes.Info)).toBe(true)
      expect(jobPage.page.url()).toBe(infoTab.URL)

      const recordCustomerContactAttemptDrawer = await infoTab.OpenCustomerContactAttempted()

      // Click the Submit button
      await recordCustomerContactAttemptDrawer.Button_Submit.Click()
      await infoTab.page.waitForTimeout(1000)

      // Verify validation message for the drawer
      expect(await recordCustomerContactAttemptDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await recordCustomerContactAttemptDrawer.Button_Close.Click()
    })

    test('Record Tarping Work - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab
      expect(await jobPage.IsTabActive(JobTabTypes.Info)).toBe(true)
      expect(jobPage.page.url()).toBe(infoTab.URL)

      let enterWorkDetailsDrawer = await infoTab.OpenRecordTarpingWork()
      //Verify drawer heading is "Enter Work Details for Job"
      enterWorkDetailsDrawer.VerifyTitle()
      expect(enterWorkDetailsDrawer.ListBox_TimeOfService.locator).toBeAttached()
      expect(enterWorkDetailsDrawer.ListBox_FastenerType.locator).toBeAttached()
      expect(enterWorkDetailsDrawer.ListBox_RoofPitch.locator).toBeAttached()
      expect(enterWorkDetailsDrawer.TextBox_ServiceDate.locator).toBeAttached()
      expect(enterWorkDetailsDrawer.Checkbox_IsMultiStory.locator).toBeAttached()
      expect(enterWorkDetailsDrawer.TextBox_TarpingSquareFeet.locator).toBeAttached()
      expect(enterWorkDetailsDrawer.ComboBox_PhotoReport.locator).toBeAttached()

      // Verify drawer closes with click on "X" button
      await enterWorkDetailsDrawer.Close()
      await expect(enterWorkDetailsDrawer.Title.locator).not.toBeAttached()
      await infoTab.page.waitForTimeout(1000)

      enterWorkDetailsDrawer = await infoTab.OpenRecordTarpingWork()
      // Verify drawer closes with ESC key
      await enterWorkDetailsDrawer.Close(true)
      await expect(enterWorkDetailsDrawer.Title.locator).not.toBeAttached()
      await infoTab.page.waitForTimeout(1000)

      enterWorkDetailsDrawer = await infoTab.OpenRecordTarpingWork()
      // Verify drawer closes if click on Close
      await enterWorkDetailsDrawer.Button_Close.Click()
      await expect(enterWorkDetailsDrawer.Title.locator).not.toBeAttached()
      await enterWorkDetailsDrawer.page.waitForTimeout(1000)
    })

    test('Record Tarping Work - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test job page
      const testJob = FetchCannedJob(environment, CannedJobTypes.DefaultTestJob)
      const jobPage = new ClaimsPortalJobPage(global, testJob)
      await jobPage.NavigateDirectlyToJob()

      //Verify that we land on the Job page for that job, defaulting to the Info section
      const infoTab = (await jobPage.SelectJobTab(JobTabTypes.Info)) as ClaimsPortalJobInfoTab
      expect(await jobPage.IsTabActive(JobTabTypes.Info)).toBe(true)
      expect(jobPage.page.url()).toBe(infoTab.URL)

      const enterWorkDetailsDrawer = await infoTab.OpenRecordTarpingWork()

      // Click the Submit button
      await enterWorkDetailsDrawer.Button_Submit.Click()
      await infoTab.page.waitForTimeout(1000)

      // Verify validation message for the drawer
      expect(await enterWorkDetailsDrawer.Validate()).toBe(true)

      // Click Close to close the drawer
      await enterWorkDetailsDrawer.Button_Close.Click()
    })
  }
)
