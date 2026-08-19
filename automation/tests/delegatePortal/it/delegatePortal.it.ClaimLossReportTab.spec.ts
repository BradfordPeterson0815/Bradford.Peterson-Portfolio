import { expect } from '@playwright/test'
import {
  CannedClaimTypes,
  ClaimLossReportTabStrings,
  ClaimTabTypes,
  DefaultEnvironment,
  NoteDataSources,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { FetchCannedClaim } from '../../../library/delegatePortal/delegatePortalHelper.js'
import { LaunchInspectionTech } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalClaimPage } from '../../../library/delegatePortal/pages/delegatePortalClaimPage.js'
import { DelegatePortalClaimLossReportTab } from '../../../library/delegatePortal/tabs/delegatePortalClaimLossReportTab.js'
import { DelegatePortalClaimNotesTab } from '../../../library/delegatePortal/tabs/delegatePortalClaimNotesTab.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Claim Page: Loss Report Tab',
  {
    tag: [Tags.Delegate, Tags.InspectionTech, Tags.Claim, Tags.LossReport],
  },
  () => {
    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss Report tab
      const lossReportTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossReport
      )) as DelegatePortalClaimLossReportTab

      expect(await claimPage.IsTabActive(ClaimTabTypes.LossReport)).toBe(true)
      expect(claimPage.page.url()).toBe(lossReportTab.URL)

      // Verify the title label of "Loss Report" top left
      await lossReportTab.VerifyTitle()

      // verify LLM warning is visible
      expect(await lossReportTab.Label_LLM_Warning.IsVisible()).toBe(true)

      // Verify the Generate Loss Report button
      expect(await lossReportTab.FuzzyLossReportButtonLocator.isVisible()).toBe(true)

      // If the report is already generated,
      if (await lossReportTab.IsReportVisible()) {
        // Verify the Save Changes as Draft button
        expect(await lossReportTab.Button_SaveChangesAsDraft.IsVisible()).toBe(true)

        // Verify the Save Draft as Note button
        expect(await lossReportTab.Button_SaveDraftAsNote.IsVisible()).toBe(true)

        // check the clipboard button
        expect(await lossReportTab.Button_CopyLossReportToClipboard.IsVisible()).toBe(true)
      }
    })

    test('Verify New Loss Report Generation', async ({ browser }) => {
      test.slow()

      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss Report tab
      const lossReportTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossReport
      )) as DelegatePortalClaimLossReportTab

      expect(await claimPage.IsTabActive(ClaimTabTypes.LossReport)).toBe(true)
      expect(claimPage.page.url()).toBe(lossReportTab.URL)

      await lossReportTab.GenerateReportAndWait()

      expect(await lossReportTab.IsReportVisible()).toBe(true)
    })

    test('Verify Save Changes As Draft', async ({ browser }) => {
      test.slow()

      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DocumentStashClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss Report tab
      const lossReportTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossReport
      )) as DelegatePortalClaimLossReportTab

      expect(await claimPage.IsTabActive(ClaimTabTypes.LossReport)).toBe(true)
      expect(claimPage.page.url()).toBe(lossReportTab.URL)

      // is our current report the mini report?
      let currentReport = await lossReportTab.TextArea_LossReportText.textContent()
      if (currentReport != ClaimLossReportTabStrings.MiniReport) {
        await lossReportTab.ReplaceReport(ClaimLossReportTabStrings.MiniReport)
        await lossReportTab.Button_SaveChangesAsDraft.Click()
      }

      // verify BLANKS warning is visible
      expect(await lossReportTab.Label_ToSaveThisReportAsANote.IsVisible()).toBe(true)

      // Save Changes as Draft and Save Draft as Note buttons should be disabled
      expect(await lossReportTab.Button_SaveChangesAsDraft.IsEnabled()).toBe(false)
      expect(await lossReportTab.Button_SaveDraftAsNote.IsEnabled()).toBe(false)

      // Edit the current report - should be able to save it now
      await lossReportTab.UpdateReportKeyword('<BLANK_INSTANCE_1>', 'there is no risk')
      expect(await lossReportTab.Button_SaveChangesAsDraft.IsEnabled()).toBe(true)
      expect(await lossReportTab.Button_SaveDraftAsNote.IsEnabled()).toBe(false)

      // verify BLANKS warning is still visible since we only replaced 1 of the 2
      expect(await lossReportTab.Label_ToSaveThisReportAsANote.IsVisible()).toBe(true)

      // Reload  Report - don't save it, just reload and make sure it comes back without changes
      await lossReportTab.page.reload()
      currentReport = await lossReportTab.TextArea_LossReportText.textContent()
      expect(currentReport).toBe(ClaimLossReportTabStrings.MiniReport)

      // Save Changes as Draft and Save Draft as Note buttons should be disabled
      expect(await lossReportTab.Button_SaveChangesAsDraft.IsEnabled()).toBe(false)
      expect(await lossReportTab.Button_SaveDraftAsNote.IsEnabled()).toBe(false)
    })

    test('Verify Save Draft As Note', async ({ browser }) => {
      test.slow()

      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DocumentStashClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim, then navigate to the Loss Report tab
      const lossReportTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.LossReport
      )) as DelegatePortalClaimLossReportTab

      expect(await claimPage.IsTabActive(ClaimTabTypes.LossReport)).toBe(true)
      expect(claimPage.page.url()).toBe(lossReportTab.URL)

      // is our current report the mini report?
      const currentReport = await lossReportTab.TextArea_LossReportText.textContent()
      if (currentReport != ClaimLossReportTabStrings.MiniReport) {
        await lossReportTab.ReplaceReport(ClaimLossReportTabStrings.MiniReport, true)
        await lossReportTab.Button_SaveChangesAsDraft.Click()
        await expect(lossReportTab.Button_SaveChangesAsDraft.locator).toBeDisabled()
      }

      // verify BLANKS warning is visible
      expect(await lossReportTab.Label_ToSaveThisReportAsANote.IsVisible()).toBe(true)

      // Replace the blank entries
      await lossReportTab.UpdateReportKeyword('<BLANK_INSTANCE_1>', 'there is no risk')
      await lossReportTab.UpdateReportKeyword('<BLANK_INSTANCE_2>', 'them is the facts')
      const verificationCode = `${Date.now()}`
      await lossReportTab.UpdateReportKeyword('<VERIFY_CODE_HERE>', `${verificationCode}`)

      // should be able to save it now - do it
      await lossReportTab.Button_SaveChangesAsDraft.Click()
      await expect(lossReportTab.Button_SaveDraftAsNote.locator).toBeEnabled()

      // verify BLANKS warning is no longer visible since we replaced both of them
      expect.soft(await lossReportTab.Label_ToSaveThisReportAsANote.IsVisible()).toBe(false)

      // Save as draft should be disabled, but we should be able to save it as a note now
      expect(await lossReportTab.Button_SaveChangesAsDraft.IsEnabled()).toBe(false)
      expect(await lossReportTab.Button_SaveDraftAsNote.IsEnabled()).toBe(true)
      await lossReportTab.Button_SaveDraftAsNote.Click()
      await lossReportTab.Wait(10000)

      // Go Check the notes
      const notesTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Notes
      )) as DelegatePortalClaimNotesTab

      // Check our count after search - refresh as needed
      for (let index = 0; index < 20; index++) {
        const currentCount = await notesTab.AllNotesCount()
        if (currentCount == 0) {
          // Serch for our verification code
          await notesTab.page.reload()
          await notesTab.ClearNotesFilter()
          await notesTab.page.waitForTimeout(1000)
          await notesTab.SetNotesFilter(NoteDataSources.Delegate)
          // Search
          await notesTab.PerformSearch(verificationCode)
        }
      }
    })
  }
)
