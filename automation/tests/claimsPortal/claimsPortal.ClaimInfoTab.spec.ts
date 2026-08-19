import { expect } from '@playwright/test'
import test from '../../library/shared/testHooks.js'
import { FetchCannedClaim, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import {
  DefaultEnvironment,
  CannedClaimTypes,
  ClaimTabTypes,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { ClaimsPortalClaimInfoTab } from '../../library/claimsPortal/tabs/claimsPortalClaimInfoTab.js'
import { ClaimsPortalClaimPage } from '../../library/claimsPortal/pages/claimsPortalClaimPage.js'
import { ClaimsPortalClaimInspectionsTab } from '../../library/claimsPortal/tabs/claimsPortalClaimInspectionsTab.js'
import { Tags } from '../../library/shared/constants.js'
import { ClaimsPortalClaimsPage } from '../../library/claimsPortal/pages/claimsPortalClaimsPage.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Page: Info Tab',
  {
    tag: [Tags.ClaimsPortal, Tags.Claim, Tags.InfoDetails],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      test.slow()

      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // find a random claim and go to it
      const claimsPage = new ClaimsPortalClaimsPage(global)
      await claimsPage.NavigateToPage()
      const { claimPage } = await claimsPage.OpenRandomClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Info)).toBe(true)
      expect(claimPage.page.url()).toBe(infoTab.URL)
      await claimPage.Wait(2000)

      // Verify data is correct for the Basic Info section
      await infoTab.VerifyBasicInfoSection(true)

      // Verify data is correct for the Loss Information section
      await infoTab.VerifyLossInformationSection(true)

      // Verify data is correct for the Loss Location section
      await infoTab.VerifyLossLocationSection(true)

      // Verify data is correct for the Contact Information section
      await infoTab.VerifyContactInformationSection(true)

      // Verify data is correct for the Claim Reviews section
      await infoTab.VerifyClaimReviewsSection(true)

      // Verify data is correct for the Actions section
      await infoTab.VerifyActionsSection()

      // Verify data is correct for the Claim Timeline section
      await infoTab.VerifyClaimTimelineSection()
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      test.slow()

      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Info)).toBe(true)
      expect(claimPage.page.url()).toBe(infoTab.URL)

      // Verify data is correct for the Basic Info section
      await infoTab.VerifyBasicInfoSection()

      // Verify data is correct for the Loss Information section
      await infoTab.VerifyLossInformationSection()

      // Verify data is correct for the Loss Location section
      await infoTab.VerifyLossLocationSection()

      // Verify data is correct for the Contact Information section
      await infoTab.VerifyContactInformationSection()

      // Verify data is correct for the Claim Reviews section
      await infoTab.VerifyClaimReviewsSection()

      // Verify data is correct for the Actions section
      await infoTab.VerifyActionsSection()

      // Verify data is correct for the Claim Timeline section
      await infoTab.VerifyClaimTimelineSection()

      const actualCount = await infoTab.TimelineEventCount()
      expect(actualCount).toBeGreaterThanOrEqual(testClaim.testData.claimTimelineCount)
    })

    test('Basic Info - Verify Redacted ID link', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.RedactedClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      // Click Redacted ID link and verify navigation in new tab to Redacted URL
      await infoTab.OpenRedactedLinkInNewTabVerifyTitleAndClose()
    })

    test('Basic Info - Edit Coordinator - Verify UI and Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      // Verify Coordinator label and Edit button are visible,
      await expect(infoTab.Label_BasicInfo_Coordinator.locator).toBeVisible()
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
      await expect(infoTab.Label_BasicInfo_Coordinator.locator).toBeVisible()
      await expect(infoTab.Button_EditCoordinator).toBeVisible()
      // if Coordinator is set, the delete button should be visible as well
      await expect(infoTab.Button_RemoveCoordinator).toBeVisible({ visible: isCoordinatorAssigned })

      // Verify clicking Goto Contact Book navigates to associated Contact Book page
      await infoTab.Button_EditCoordinator.click()
      await infoTab.Button_EditingCoordinator_GotoContactBook.click()
      expect(infoTab.page.url().endsWith('contacts/book/corn:contacts:book:claims')).toBe(true)
    })

    test('Basic Info - Edit Field Agent - Verify UI and Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      // Verify Field Agent label and Edit button are visible,
      await expect(infoTab.Label_BasicInfo_FieldAgent.locator).toBeVisible()
      await expect(infoTab.Button_EditFieldAgent).toBeVisible()
      // if Field Agent is set, the Remove button should be visible as well
      const isAdjusterAssigned = await infoTab.IsFieldAgentAssigned()
      await expect(infoTab.Button_RemoveFieldAgent).toBeVisible({ visible: isAgentAssigned })

      // Click Field Agent Edit (Pencil icon) button
      await infoTab.Button_EditFieldAgent.click()

      // Verify Edit button and Remove buttons are no longer visible
      await expect(infoTab.Button_EditFieldAgent).toBeHidden()
      await expect(infoTab.Button_RemoveFieldAgent).toBeHidden()

      // Verify inline edit UI appears - (Selection list, Save button, Goto Contact Book, Cancel (X) button)
      await expect(infoTab.ComboBox_EditingFieldAgent_Select).toBeVisible()
      await expect(infoTab.Button_EditingFieldAgent_Save).toBeVisible()
      await expect(infoTab.Button_EditingFieldAgent_GotoContactBook).toBeVisible()
      await expect(infoTab.Button_EditingFieldAgent_CancelEditing).toBeVisible()

      // Validate on Save button with no Field Agent selected
      await infoTab.Button_EditingFieldAgent_Save.click()
      await infoTab.ValidateFieldAgent()

      // Verify clicking Cancel (X) button hides inline edit UI - data and Edit button reappear
      await infoTab.Button_EditingFieldAgent_CancelEditing.click()

      // Verify inline edit UI disappears - (Selection list, Save button, Goto Contact Book, Cancel (X) button)
      await expect(infoTab.ComboBox_EditingCoordinator_Select).toBeHidden()
      await expect(infoTab.Button_EditingFieldAgent_Save).toBeHidden()
      await expect(infoTab.Button_EditingFieldAgent_GotoContactBook).toBeHidden()
      await expect(infoTab.Button_EditingFieldAgent_CancelEditing).toBeHidden()

      // Verify Field Agent label and Edit button are visible,
      await expect(infoTab.Label_BasicInfo_FieldAgent.locator).toBeVisible()
      await expect(infoTab.Button_EditFieldAgent).toBeVisible()
      // if Field Agent is set, the Remove button should be visible as well
      await expect(infoTab.Button_RemoveFieldAgent).toBeVisible({ visible: isAgentAssigned })

      // Verify clicking Goto Contact Book navigates to associated Contact Book page
      await infoTab.Button_EditFieldAgent.click()
      await infoTab.Button_EditingFieldAgent_GotoContactBook.click()
      expect(infoTab.page.url().endsWith('contacts/book/corn:contacts:book:fieldAgent')).toBe(
        true
      )
    })

    test('Basic Info - Edit Project Manager - Verify UI and Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      // Verify Project Manager label and Edit button are visible,
      await expect(infoTab.Label_BasicInfo_ProjectManager.locator).toBeVisible()
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
      await expect(infoTab.Label_BasicInfo_ProjectManager.locator).toBeVisible()
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

    test('Basic Info - Edit Reviewer - Verify UI and Validate', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      // Verify Reviewer label and Edit button are visible,
      await expect(infoTab.Label_BasicInfo_Reviewer.locator).toBeVisible()
      await expect(infoTab.Button_EditReviewer).toBeVisible()
      // if Reviewer is set, the Remove button should be visible as well
      const isReviewerAssigned = await infoTab.IsReviewerAssigned()
      await expect(infoTab.Button_RemoveReviewer).toBeVisible({ visible: isReviewerAssigned })

      // Click Reviewer Edit (Pencil icon) button
      await infoTab.Button_EditReviewer.click()

      // Verify Edit button and Remove buttons are no longer visible
      await expect(infoTab.Button_EditReviewer).toBeHidden()
      await expect(infoTab.Button_RemoveReviewer).toBeHidden()

      // Verify inline edit UI appears - (Selection list, Save button, Goto Contact Book, Cancel (X) button)
      await expect(infoTab.ComboBox_EditingReviewer_Select).toBeVisible()
      await expect(infoTab.Button_EditingReviewer_Save).toBeVisible()
      await expect(infoTab.Button_EditingReviewer_GotoContactBook).toBeVisible()
      await expect(infoTab.Button_EditingReviewer_CancelEditing).toBeVisible()

      // Validate on Save button with no Reviewer selected
      await infoTab.Button_EditingReviewer_Save.click()
      await infoTab.ValidateReviewer()

      // Verify clicking Cancel (X) button hides inline edit UI - data and Edit button reappear
      await infoTab.Button_EditingReviewer_CancelEditing.click()

      // Verify inline edit UI disappears - (Selection list, Save button, Goto Contact Book, Cancel (X) button)
      await expect(infoTab.ComboBox_EditingReviewer_Select).toBeHidden()
      await expect(infoTab.Button_EditingReviewer_Save).toBeHidden()
      await expect(infoTab.Button_EditingReviewer_GotoContactBook).toBeHidden()
      await expect(infoTab.Button_EditingReviewer_CancelEditing).toBeHidden()

      // Verify Reviewer label and Edit button are visible,
      await expect(infoTab.Label_BasicInfo_Reviewer.locator).toBeVisible()
      await expect(infoTab.Button_EditReviewer).toBeVisible()
      // if Reviewer is set, the delete button should be visible as well
      await expect(infoTab.Button_RemoveReviewer).toBeVisible({ visible: isReviewerAssigned })

      // Verify clicking Goto Contact Book navigates to associated Contact Book page
      await infoTab.Button_EditReviewer.click()
      await infoTab.Button_EditingReviewer_GotoContactBook.click()
      expect(infoTab.page.url().endsWith('contacts/book/corn:contacts:book:reviewer')).toBe(true)
    })

    test('Loss Location - Verify Map link', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      // Click Map link and verify navigation in new tab to Google Maps
      await infoTab.OpenMapLinkInNewTabVerifyTitleAndClose(testClaim.lossLocation.mapStreet)
    })

    test('Actions - Add Communication - Verify Record Customer Communication Drawer UI', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      // Click the Action->Add Communication button
      let recordCustomerCommunicationDrawer = await infoTab.OpenRecordCustomerCommunicationDrawer()

      // Verify the Record Customer Communication drawer elements
      await recordCustomerCommunicationDrawer.VerifyTitle()
      await expect(
        recordCustomerCommunicationDrawer.ListBox_TypeOfCommunication.locator
      ).toBeAttached()
      await expect(recordCustomerCommunicationDrawer.TextBox_Date.locator).toBeAttached()
      await expect(recordCustomerCommunicationDrawer.CheckBox_IncludeNote.locator).toBeAttached()

      // Verify Record Customer Communication drawer - closes with click on "X" button
      await recordCustomerCommunicationDrawer.Close()
      await expect(recordCustomerCommunicationDrawer.Title.locator).not.toBeAttached()

      // Verify Record Customer Communication drawer - closes with ESC key
      recordCustomerCommunicationDrawer = await infoTab.OpenRecordCustomerCommunicationDrawer()
      await recordCustomerCommunicationDrawer.Close(true)
      await expect(recordCustomerCommunicationDrawer.Title.locator).not.toBeAttached()
    })

    test('Actions - Add Communication: Validate Record Customer Communication Drawer', async ({
      browser,
    }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      // Click the Action->Add Communication button
      const recordCustomerCommunicationDrawer =
        await infoTab.OpenRecordCustomerCommunicationDrawer()

      // Validate the drawer
      await recordCustomerCommunicationDrawer.Button_Submit.Click()
      await recordCustomerCommunicationDrawer.Validate()
    })

    test('Actions - Add Note: Verify Navigation', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      // Click the Action->Add Note button
      const createNoteDrawer = await infoTab.OpenCreateNoteDrawer()

      // Verify the Create Note drawer has appeared
      await createNoteDrawer.VerifyTitle()
      await createNoteDrawer.Button_Close.Click()
    })

    test('Actions - Add Tags: Verify Add Tags Dialog UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      // Click the Action Add Tags Button
      let addTagsDialog = await infoTab.OpenAddTags()

      // Verify the Add Tags dialog title
      await addTagsDialog.VerifyTitle()

      // Verify Add Tags dialog - closes with click on "X" button
      await addTagsDialog.Close()
      await addTagsDialog.Title.locator.waitFor({ state: 'detached' })

      // Verify Add Tags dialog - closes with ESC key
      addTagsDialog = await infoTab.OpenAddTags()
      await addTagsDialog.Close(true)
      await addTagsDialog.Title.locator.waitFor({ state: 'detached' })

      // Verify fields can be set
      addTagsDialog = await infoTab.OpenAddTags()
      await addTagsDialog.SetKeyValue('Hello, my name is')
      expect(await addTagsDialog.GetKeyValue()).toBe('Hello, my name is')
      await addTagsDialog.SetValueValue('Slim Shady')
      expect(await addTagsDialog.GetValueValue()).toBe('Slim Shady')
      await addTagsDialog.SetColor('#A0A0A0')
      expect(await addTagsDialog.GetColorValue()).toBe('#A0A0A0')

      // Verify Key and Value can be cleared
      await addTagsDialog.ClearValue()
      expect(await addTagsDialog.GetValueValue()).toBe('')
      await addTagsDialog.ClearKey()
      expect(await addTagsDialog.GetKeyValue()).toBe('')
    })

    test('Actions - Add Tags: Validate Add Tags Dialog', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      // Click the Action Add Tags Button
      const addTagsDialog = await infoTab.OpenAddTags()

      // Click the Add & Close
      await addTagsDialog.Button_AddAndClose.Click()

      // Validate the dialog
      await addTagsDialog.Validate()
    })

    test('Actions - Add/Remove Tag', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      // if our test tag already exists on this claim, remove it
      const testTag = 'AutomatedTestTag'
      const testTagValue = 'TestValue'
      const testTagColor = '#C8C800'
      const tagExists = await infoTab.TagWithValueIsAdded(testTag, testTagValue)
      if (tagExists) {
        await infoTab.RemoveTagWithValue(testTag, testTagValue)
      }
      // add the test tag
      await infoTab.AddTag(testTag, testTagValue, testTagColor)

      // tag should exist now
      expect(await infoTab.TagWithValueIsAdded(testTag, testTagValue, true)).toBe(true)

      // remove the test tag
      await infoTab.RemoveTagWithValue(testTag, testTagValue)

      // tag should not exist now
      expect(await infoTab.TagWithValueIsAdded(testTag, testTagValue)).toBe(false)
    })

    test('Actions - Update Claim: Verify Update Claim Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      // Click the Action->Update Claim button
      let updateClaimDrawer = await infoTab.OpenUpdateClaimDrawer()

      // Verify the Update Claim drawer elements
      await updateClaimDrawer.VerifyTitle()
      await expect(updateClaimDrawer.TextBox_CATCode.locator).toBeAttached()
      await expect(updateClaimDrawer.ListBox_LossType.locator).toBeAttached()
      await expect(updateClaimDrawer.ListBox_Severity.locator).toBeAttached()
      await expect(updateClaimDrawer.TextArea_LossDescription.locator).toBeAttached()
      await expect(updateClaimDrawer.ListBox_ClaimFactors.locator).toBeAttached()
      await expect(updateClaimDrawer.TextBox_AddressLine1.locator).toBeAttached()
      await expect(updateClaimDrawer.TextBox_AddressLine2.locator).toBeAttached()
      await expect(updateClaimDrawer.TextBox_AddressLine3.locator).toBeAttached()
      await expect(updateClaimDrawer.TextBox_City.locator).toBeAttached()
      await expect(updateClaimDrawer.ListBox_State.locator).toBeAttached()
      await expect(updateClaimDrawer.TextBox_ZipOrPostalCode.locator).toBeAttached()
      await expect(updateClaimDrawer.TextBox_CountyOrParishCode.locator).toBeAttached()
      await expect(updateClaimDrawer.ListBox_Country.locator).toBeAttached()
      await expect(updateClaimDrawer.ListBox_InitialClaimActions.locator).toBeAttached()

      // Verify Update Claim drawer - closes with click on "X" button
      await updateClaimDrawer.Button_Close_X.Click()
      await expect(updateClaimDrawer.Title.locator).not.toBeAttached()

      // Verify Update Claim drawer- closes with ESC key
      updateClaimDrawer = await infoTab.OpenUpdateClaimDrawer()
      await updateClaimDrawer.Close(true)
      await expect(updateClaimDrawer.Title.locator).not.toBeAttached()

      // Verify Update Claim drawer- closes with Close button
      updateClaimDrawer = await infoTab.OpenUpdateClaimDrawer()
      await updateClaimDrawer.Close()
      await expect(updateClaimDrawer.Title.locator).not.toBeAttached()
    })

    test('Actions - Update Claim', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      // Click the Action->Update Claim button
      const updateClaimDrawer = await infoTab.OpenUpdateClaimDrawer()

      // Verify the Update Claim drawer elements
      const dateSuffix = `+${Date.now()}`
      const modifiedDescription = `${testClaim.lossInformation.description}${dateSuffix}`
      await updateClaimDrawer.TextArea_LossDescription.Fill(modifiedDescription)

      // Commit the update
      await updateClaimDrawer.Button_Submit.Click()
      await updateClaimDrawer.Title.locator.waitFor({ state: 'detached' })

      // Verify that the Loss Description field has been updated per our change
      await expect(infoTab.Label_LossInformation_LossDescription_Actual.locator).toHaveText(
        modifiedDescription
      )
    })

    test('Actions - Upload Files: Verify Navigation', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      await infoTab.page.waitForTimeout(3000)

      // Navigate from the Actions->Upload Files button to the Upload tab
      const uploadsTab = await infoTab.OpenUploadFiles(testClaim, claimPage.baseURL)
      expect(uploadsTab.page.url()).toBe(uploadsTab.URL)
    })

    test('Actions - Close Claim: Verify Close Claim Drawer UI', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      // Click the Action->Close Claim button
      let closeClaimDrawer = await infoTab.OpenCloseClaimDrawer()

      // Verify the Close Claim drawer elements
      await closeClaimDrawer.VerifyTitle()
      await expect(closeClaimDrawer.TextBox_Date.locator).toBeAttached()
      await expect(closeClaimDrawer.ListBox_Reason.locator).toBeAttached()
      await expect(closeClaimDrawer.TextArea_AdditionalNotes.locator).toBeAttached()

      // Verify Close Claim drawer - closes with click on "X" button
      await closeClaimDrawer.Button_Close_X.Click()
      await expect(closeClaimDrawer.Title.locator).not.toBeAttached()

      // Verify Close Claim drawer- closes with ESC key
      closeClaimDrawer = await infoTab.OpenCloseClaimDrawer()
      await closeClaimDrawer.Close(true)
      await expect(closeClaimDrawer.Title.locator).not.toBeAttached()

      // Verify Close Claim drawer- closes with Close button
      closeClaimDrawer = await infoTab.OpenCloseClaimDrawer()
      await closeClaimDrawer.Close()
      await expect(closeClaimDrawer.Title.locator).not.toBeAttached()
    })

    test('Actions - Close Claim: Validate Close Claim Drawer', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      // Click the Action->Close Claim button
      const closeClaimDrawer = await infoTab.OpenCloseClaimDrawer()

      // Validate the drawer
      await closeClaimDrawer.Button_Submit.Click()
      await closeClaimDrawer.Validate()
    })

    test('Start inspection and do not consent to be recorded', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      // Click the Action->Start Inspection button
      await infoTab.Link_Actions_StartInspection.Click()

      // We are going to get navigated to the Inspections tab...
      const inspectionsTab = new ClaimsPortalClaimInspectionsTab(global, testClaim, claimPage.baseURL)

      // verify that if we decline consent, we don't start a inspection
      await inspectionsTab.HandleInspectionConsentAlert(false)

      // verify we are on the Inspections tab
      await expect(
        inspectionsTab.DataTable_Inspections.Button_OpenTableSettings.locator
      ).toBeAttached()
    })

    test('View Full Timeline Navigation', async ({ browser }) => {
      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab

      //Verify that clicking on View Full Timeline navigates us to the timeline page
      const claimTimelineTab = await infoTab.OpenFullTimeline()
      expect(claimTimelineTab.page.url().endsWith('/timeline')).toBe(true)
    })

    test('Verify Inspection Event shows in Timeline View', async ({ browser }) => {
      test.slow()

      // launch the Claims Portal
      const { global } = await Launch(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new ClaimsPortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, defaulting to the Info section
      const infoTab = (await claimPage.SelectClaimTab(ClaimTabTypes.Info)) as ClaimsPortalClaimInfoTab
      await infoTab.page.waitForTimeout(5000)

      const targetEvent = testClaim.testData.timelineEventDescription
      const targetDateTime = testClaim.testData.timelineEventDateTime
      const foundEvent = await infoTab.FindTimelineEventByNameAndDate(targetEvent, targetDateTime)
      expect(foundEvent).not.toBe(null)
    })
  }
)
