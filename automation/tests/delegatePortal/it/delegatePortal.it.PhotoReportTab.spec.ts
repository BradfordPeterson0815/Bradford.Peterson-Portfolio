import { expect } from '@playwright/test'
import {
  AbortErrors,
  CannedClaimTypes,
  ClaimTabTypes,
  DefaultEnvironment,
  PhotoReport_ActionMenuItems,
} from '../../../library/delegatePortal/delegatePortalConstants.js'
import { FetchCannedClaim, FetchDateSuffix } from '../../../library/delegatePortal/delegatePortalHelper.js'
import { LaunchInspectionTech } from '../../../library/delegatePortal/delegatePortalLauncher.js'
import { DelegatePortalClaimPage } from '../../../library/delegatePortal/pages/delegatePortalClaimPage.js'
import { DelegatePortalClaimDocumentsTab } from '../../../library/delegatePortal/tabs/delegatePortalClaimDocumentsTab.js'
import { DelegatePortalClaimMediaTab } from '../../../library/delegatePortal/tabs/delegatePortalClaimMediaTab.js'
import { DelegatePortalPhotoReportTab } from '../../../library/delegatePortal/tabs/delegatePortalPhotoReportTab.js'
import { AbortTest } from '../../../library/shared/commonHelper.js'
import { Tags } from '../../../library/shared/constants.js'
import test from '../../../library/shared/testHooks.js'

const environment = DefaultEnvironment
const TestGroupPrefix = 'TESTGROUP'
const TestGroupDuplicatePrefix = 'TESTGROUPDUPLICATE'
const KittiesGroup = 'KITTIES'
const PiggiesGroup = 'PIGGIES'
const PuppiesGroup = 'PUPPIES'

test.describe(
  'PhotoReport Tab',
  {
    tag: [Tags.Delegate, Tags.InspectionTech, Tags.PhotoReport],
  },
  () => {
    test('Verify Navigation and UI from Claim', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      //Verify that we land on the Claim page for that claim (Info tab by default), then navigate to the Documents tab
      const documentsTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Documents
      )) as DelegatePortalClaimDocumentsTab
      expect(await claimPage.IsTabActive(ClaimTabTypes.Documents)).toBe(true)
      expect(claimPage.page.url()).toBe(documentsTab.URL)

      // Verify Create Documents button exists
      expect(await documentsTab.Button_CreateDocuments.IsVisible()).toBe(true)

      // Navigate from the Documents tab to the Photo Report tab
      let photoReportTab = await documentsTab.OpenPhotoReportTab(testClaim.basicInfo.claimNumber)
      await photoReportTab.page.waitForTimeout(1000)
      expect(documentsTab.page.url()).toBe(photoReportTab.URL)

      // Head over to the Media tab
      const mediaTab = (await claimPage.SelectClaimTab(
        ClaimTabTypes.Media
      )) as DelegatePortalClaimMediaTab

      // Verify Create Photo Report link exists
      expect(await mediaTab.Link_CreatePhotoReport.IsVisible()).toBe(true)

      // Navigate from the Media tab to the Photo Report tab
      await mediaTab.Link_CreatePhotoReport.Click()
      photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.page.waitForTimeout(1000)
      expect(mediaTab.page.url()).toBe(photoReportTab.URL)

      await photoReportTab.page.waitForTimeout(2000)

      expect(await photoReportTab.Button_ActionMenu.IsVisible()).toBe(true)
      expect(await photoReportTab.Button_ShowGuide.IsVisible()).toBe(true)
      if (await photoReportTab.IsGuideVisible()) {
        expect(await photoReportTab.Label_Guide_Title.IsVisible()).toBe(true)
        await photoReportTab.Label_Guide_Title.VerifyExpectedText()
        expect(await photoReportTab.Label_Guide_Description.IsVisible()).toBe(true)
        await photoReportTab.Label_Guide_Description.VerifyExpectedText()
      }
      expect(await photoReportTab.Button_SortOrder.IsVisible()).toBe(true)
      expect(await photoReportTab.Button_AddGroup.IsVisible()).toBe(true)
      expect(await photoReportTab.Button_DeselectAll.IsVisible()).toBe(true)
      expect(await photoReportTab.Button_CollapsePhotos.IsVisible()).toBe(true)
      expect(await photoReportTab.Button_CollapseGroups.IsVisible()).toBe(true)
      await photoReportTab.Wait(4000)
      expect(await photoReportTab.Link_DownloadLastPhotoReport.IsVisible()).toBe(true)
      expect(await photoReportTab.Button_SubmitPhotoReport.IsVisible()).toBe(true)
    })

    test('Verify Hide/Show Guide', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Photo Report tab
      const photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.NavigateDirectly()

      await photoReportTab.ShowGuide()
      expect(await photoReportTab.IsGuideVisible()).toBe(true)

      await photoReportTab.HideGuide()
      expect(await photoReportTab.IsGuideVisible()).toBe(false)
    })

    test('Verify Action Menu Visibility: Re-add Photos / Reset', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Photo Report tab
      const photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.NavigateDirectly()

      // check action menu visibilities/status
      const readdPhotosMenuIsEnabled = await photoReportTab.IsActionMenuItemEnabled(
        PhotoReport_ActionMenuItems.ReaddPhotos
      )
      expect(readdPhotosMenuIsEnabled).toBe(false)

      const resetMenuIsEnabled = await photoReportTab.IsActionMenuItemEnabled(
        PhotoReport_ActionMenuItems.Reset
      )
      expect(resetMenuIsEnabled).toBe(true)
    })

    test('Verify Add Group Dialog UI', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Photo Report tab
      const photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.NavigateDirectly()

      // open the dialog
      let addGroupDialog = await photoReportTab.OpenAddGroupDialog()

      // Verify the Add Group dialog title
      await addGroupDialog.VerifyTitle()

      // Verify elements are visible
      expect(await addGroupDialog.radioButton_Start.isVisible()).toBe(true)
      expect(await addGroupDialog.radioButton_End.isVisible()).toBe(true)
      expect(await addGroupDialog.ComboBox_Label.IsEnabled()).toBe(true)
      expect(await addGroupDialog.Button_Close.IsEnabled()).toBe(true)
      expect(await addGroupDialog.Button_Submit.IsEnabled()).toBe(true)

      // Verify Add Group dialog - closes with click on "X" button
      await addGroupDialog.Close()
      await expect(addGroupDialog.Title.locator).not.toBeAttached()
      await photoReportTab.Wait(1000)

      // Verify Add Tags dialog - closes with ESC key
      addGroupDialog = await photoReportTab.OpenAddGroupDialog()
      await addGroupDialog.Close(true)
      await expect(addGroupDialog.Title.locator).not.toBeAttached()
      await photoReportTab.Wait(1000)
    })

    test('Validate Add Group Dialog', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Photo Report tab
      const photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.NavigateDirectly()

      // Remove any existing test groups from old tests
      await photoReportTab.DeleteOldTestGroups(TestGroupDuplicatePrefix)
      await photoReportTab.Wait(1000)

      // Validate when no fields are filled out
      let addGroupDialog = await photoReportTab.OpenAddGroupDialog()
      await addGroupDialog.Button_Submit.Click()
      await addGroupDialog.ValidateWhenEmpty()
      await addGroupDialog.Close()

      const newGroupName = `${TestGroupDuplicatePrefix}${FetchDateSuffix()}`
      // add a new test group
      const addedGroup = await photoReportTab.AddGroup(newGroupName)
      await photoReportTab.Wait(1000)

      // Validate when label is a duplicate
      addGroupDialog = await photoReportTab.OpenAddGroupDialog()
      await addGroupDialog.radioButton_Start.click()
      await addGroupDialog.SetLabelValue(newGroupName)
      await addGroupDialog.ValidateDuplicateLabel()
      await addGroupDialog.Close()

      // Remove added group
      await addedGroup.Delete()
    })

    test('Verify Group UI', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Photo Report tab
      const photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.NavigateDirectly()

      // grab the first group
      const firstGroup = await photoReportTab.FetchGroupByIndex(0)

      // Verify the label is not empty
      expect(await firstGroup.label.textContent()).not.toBe('')

      // Verify drag handle button
      expect(await firstGroup.button_DragHandle.isVisible()).toBe(true)

      // Verify delete button
      expect(await firstGroup.button_Delete.isVisible()).toBe(true)

      // Verify collapse/expand button
      if (await firstGroup.IsCollapsed()) {
        expect(await firstGroup.button_Expand.isVisible()).toBe(true)
      } else {
        expect(await firstGroup.button_Collapse.isVisible()).toBe(true)
      }
    })

    test('Add/Edit/Remove Group', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)
      const newGroupName = `${TestGroupPrefix}${FetchDateSuffix()}`
      const editedGroupName = `${newGroupName}+EDITED`

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Photo Report tab
      const photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.NavigateDirectly()

      // Remove any existing test groups from old tests
      await photoReportTab.DeleteOldTestGroups(TestGroupPrefix)
      await photoReportTab.Wait(1000)

      // add a new test group
      const addedGroup = await photoReportTab.AddGroup(newGroupName)
      await photoReportTab.Wait(1000)

      // verify edit button is visible while save and cancel are not visible
      // verify label combo is not visible
      expect(await addedGroup.button_EditLabel.isVisible()).toBe(true)
      expect(await addedGroup.button_SaveLabelChanges.isVisible()).toBe(false)
      expect(await addedGroup.button_CancelLabelChanges.isVisible()).toBe(false)
      expect(await addedGroup.combobox_label.isVisible()).toBe(false)

      // start the edit
      await addedGroup.button_EditLabel.click()

      // verify edit button is now hidden, while save and cancel are now visible
      // verify label combo is now visible
      expect(await addedGroup.button_EditLabel.isVisible()).toBe(false)
      expect(await addedGroup.button_SaveLabelChanges.isVisible()).toBe(true)
      expect(await addedGroup.button_CancelLabelChanges.isVisible()).toBe(true)
      expect(await addedGroup.combobox_label.isVisible()).toBe(true)

      // cancel edit
      await addedGroup.button_CancelLabelChanges.click()

      // verify edit button is visible again
      expect(await addedGroup.button_EditLabel.isVisible()).toBe(true)

      // make the actual edit
      await addedGroup.EditLabel(editedGroupName)

      // delete a test group
      await photoReportTab.DeleteGroup(editedGroupName)
      await photoReportTab.Wait(1000)
    })

    test('Expand/Collapse a single Group', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Photo Report tab
      const photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.NavigateDirectly()

      if ((await photoReportTab.FetchGroupCount()) == 0) {
        AbortTest(AbortErrors.EmptyPhotoReportPageMessage)
        return
      }

      // get the first group
      const firstGroup = await photoReportTab.FetchGroupByIndex(0)
      expect(await firstGroup.label.textContent()).not.toBe('')

      // by default, should be expanded
      expect(await firstGroup.IsExpanded()).toBe(true)

      // Collapse and verify
      await firstGroup.Collapse()
      expect(await firstGroup.IsCollapsed()).toBe(true)
      expect(await firstGroup.IsCardListHidden()).toBe(true)

      // expand and verify
      await firstGroup.Expand()
      expect(await firstGroup.IsExpanded()).toBe(true)
      expect(await firstGroup.IsCardListHidden()).toBe(false)
    })
    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Verify Group Drag/Drop', async ({ browser }) => {
        test.slow()

        // launch the Delegate Inspection Tech home page
        const { global } = await LaunchInspectionTech(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        // head to the Photo Report tab
        const photoReportTab = new DelegatePortalPhotoReportTab(
          global,
          `claims/${testClaim.basicInfo.claimNumber}`
        )
        await photoReportTab.NavigateDirectly()

        if ((await photoReportTab.FetchGroupCount()) < 2) {
          AbortTest(AbortErrors.LessThanTwoGroupsPhotoReportPageMessage)
          return
        }

        // collapse groups to make this easier
        await photoReportTab.Button_CollapseGroups.Click()
        await photoReportTab.Wait(2000)

        // get the first group
        const firstGroup_BeforeDrag = await photoReportTab.FetchGroupByIndex(0)
        const firstLabel_BeforeDrag = await firstGroup_BeforeDrag.label.textContent()

        // get the second group
        const secondGroup_BeforeDrag = await photoReportTab.FetchGroupByIndex(1)
        const secondLabel_BeforeDrag = await secondGroup_BeforeDrag.label.textContent()

        // drag first group onto second group - should switch places
        await photoReportTab.DragGroup(firstGroup_BeforeDrag, secondGroup_BeforeDrag, 2)

        // get the first group
        const firstGroup_AfterDrag = await photoReportTab.FetchGroupByIndex(0)
        const firstLabel_AfterDrag = await firstGroup_AfterDrag.label.textContent()

        // get the second group
        const secondGroup_AfterDrag = await photoReportTab.FetchGroupByIndex(1)
        const secondLabel_AfterDrag = await secondGroup_AfterDrag.label.textContent()

        // check that positions are switched
        expect(firstLabel_BeforeDrag).toEqual(secondLabel_AfterDrag)
        expect(secondLabel_BeforeDrag).toEqual(firstLabel_AfterDrag)
      })

      test('Verify Card Drag Drop in same Group', async ({ browser }) => {
        // launch the Delegate Inspection Tech home page
        const { global } = await LaunchInspectionTech(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        // head to the Photo Report tab
        const photoReportTab = new DelegatePortalPhotoReportTab(
          global,
          `claims/${testClaim.basicInfo.claimNumber}`
        )
        await photoReportTab.NavigateDirectly()

        // work on a group that should have at least 3 cards
        const { group: kittiesGroup } = await photoReportTab.FetchGroupByLabel(KittiesGroup)
        const initialFirstCard = await kittiesGroup.FetchCardByIndex(0)
        const { title: initialFirstTitle, description: initialFirstDescription } =
          await initialFirstCard.FetchCardInfo()
        const initialSecondCard = await kittiesGroup.FetchCardByIndex(1)
        const { title: initialSecondTitle, description: initialSecondDescription } =
          await initialSecondCard.FetchCardInfo()
        const initialThirdCard = await kittiesGroup.FetchCardByIndex(2)
        const { title: initialThirdTitle, description: initialThirdDescription } =
          await initialThirdCard.FetchCardInfo()

        // drag the first card onto the third card
        await photoReportTab.DragCardSelection([initialFirstCard], initialThirdCard)
        const afterFirstCard = await kittiesGroup.FetchCardByIndex(0)
        const { title: afterFirstTitle, description: afterFirstDescription } =
          await afterFirstCard.FetchCardInfo()
        const afterSecondCard = await kittiesGroup.FetchCardByIndex(1)
        const { title: afterSecondTitle, description: afterSecondDescription } =
          await afterSecondCard.FetchCardInfo()
        const afterThirdCard = await kittiesGroup.FetchCardByIndex(2)
        const { title: afterThirdTitle, description: afterThirdDescription } =
          await afterThirdCard.FetchCardInfo()
        // first card should be 3rd card
        expect(initialFirstTitle).toBe(afterThirdTitle)
        expect(initialFirstDescription).toBe(afterThirdDescription)
        // second card should be first card
        expect(initialSecondTitle).toBe(afterFirstTitle)
        expect(initialSecondDescription).toBe(afterFirstDescription)
        // third card should be second card
        expect(initialThirdTitle).toBe(afterSecondTitle)
        expect(initialThirdDescription).toBe(afterSecondDescription)
      })

      test('Verify Multi Card Drag Drop in same Group', async ({ browser }) => {
        // launch the Delegate Inspection Tech home page
        const { global } = await LaunchInspectionTech(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        // head to the Photo Report tab
        const photoReportTab = new DelegatePortalPhotoReportTab(
          global,
          `claims/${testClaim.basicInfo.claimNumber}`
        )
        await photoReportTab.NavigateDirectly()

        // work on a group that should have at least 3 cards
        const { group: kittiesGroup } = await photoReportTab.FetchGroupByLabel(KittiesGroup)
        const initialFirstCard = await kittiesGroup.FetchCardByIndex(0)
        const { title: initialFirstTitle, description: initialFirstDescription } =
          await initialFirstCard.FetchCardInfo()
        const initialSecondCard = await kittiesGroup.FetchCardByIndex(1)
        const { title: initialSecondTitle, description: initialSecondDescription } =
          await initialSecondCard.FetchCardInfo()
        const initialThirdCard = await kittiesGroup.FetchCardByIndex(2)
        const { title: initialThirdTitle, description: initialThirdDescription } =
          await initialThirdCard.FetchCardInfo()

        // drag the first card and second card onto the third card
        await photoReportTab.DragCardSelection(
          [initialFirstCard, initialSecondCard],
          initialThirdCard,
          1
        )
        const afterFirstCard = await kittiesGroup.FetchCardByIndex(0)
        const { title: afterFirstTitle, description: afterFirstDescription } =
          await afterFirstCard.FetchCardInfo()
        const afterSecondCard = await kittiesGroup.FetchCardByIndex(1)
        const { title: afterSecondTitle, description: afterSecondDescription } =
          await afterSecondCard.FetchCardInfo()
        const afterThirdCard = await kittiesGroup.FetchCardByIndex(2)
        const { title: afterThirdTitle, description: afterThirdDescription } =
          await afterThirdCard.FetchCardInfo()

        // third card should be first card
        expect(initialThirdTitle).toBe(afterFirstTitle)
        expect(initialThirdDescription).toBe(afterFirstDescription)
        // first card should be second card
        expect(initialFirstTitle).toBe(afterSecondTitle)
        expect(initialFirstDescription).toBe(afterSecondDescription)
        // second card should be third card
        expect(initialSecondTitle).toBe(afterThirdTitle)
        expect(initialSecondDescription).toBe(afterThirdDescription)
      })

      test('Verify Card Drag Drop onto another group', async ({ browser }) => {
        // launch the Delegate Inspection Tech home page
        const { global } = await LaunchInspectionTech(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        // head to the Photo Report tab
        const photoReportTab = new DelegatePortalPhotoReportTab(
          global,
          `claims/${testClaim.basicInfo.claimNumber}`
        )
        await photoReportTab.NavigateDirectly()

        // examine group 1 card and count
        const { group: kittiesGroup } = await photoReportTab.FetchGroupByLabel(KittiesGroup)
        const initialGroupOneCount = await kittiesGroup.FetchCardCount()
        const initialFirstCardGroupOne = await kittiesGroup.FetchCardByIndex(0)
        const { title: initialFirstTitleGroupOne, description: initialFirstDescriptionGroupOne } =
          await initialFirstCardGroupOne.FetchCardInfo()

        const { group: piggiesGroup } = await photoReportTab.FetchGroupByLabel(PiggiesGroup)
        const initialGroupTwoCount = await piggiesGroup.FetchCardCount()
        const initialFirstCardGroupTwo = await piggiesGroup.FetchCardByIndex(0)
        const { title: initialFirstTitleGroupTwo, description: initialFirstDescriptionGroupTwo } =
          await initialFirstCardGroupTwo.FetchCardInfo()

        // drag the first card from group one onto the second group
        await photoReportTab.DragCardSelection([initialFirstCardGroupOne], piggiesGroup)

        // Get info after the drag drop
        const afterGroupOneCount = await kittiesGroup.FetchCardCount()
        const afterGroupTwoCount = await piggiesGroup.FetchCardCount()

        // Count in group one should be down one card
        expect(afterGroupOneCount).toBe(initialGroupOneCount - 1)

        // Count in group two should be up one card
        expect(afterGroupTwoCount).toBe(initialGroupTwoCount + 1)

        const afterFirstCardGroupTwo = await piggiesGroup.FetchCardByIndex(0)
        const { title: afterFirstTitleGroupTwo, description: afterFirstDescriptionGroupTwo } =
          await afterFirstCardGroupTwo.FetchCardInfo()

        const afterSecondCardGroupTwo = await piggiesGroup.FetchCardByIndex(1)
        const { title: afterSecondTitleGroupTwo, description: afterSecondDescriptionGroupTwo } =
          await afterSecondCardGroupTwo.FetchCardInfo()

        // first card from group one should be first card in group two
        expect(initialFirstTitleGroupOne).toBe(afterFirstTitleGroupTwo)
        expect(initialFirstDescriptionGroupOne).toBe(afterFirstDescriptionGroupTwo)
        // second card in group two should be first card in that group before the drag
        expect(initialFirstTitleGroupTwo).toBe(afterSecondTitleGroupTwo)
        expect(initialFirstDescriptionGroupTwo).toBe(afterSecondDescriptionGroupTwo)
      })

      test('Verify Multi Card Drag Drop onto card in another group', async ({ browser }) => {
        // launch the Delegate Inspection Tech home page
        const { global } = await LaunchInspectionTech(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        // head to the Photo Report tab
        const photoReportTab = new DelegatePortalPhotoReportTab(
          global,
          `claims/${testClaim.basicInfo.claimNumber}`
        )
        await photoReportTab.NavigateDirectly()

        // examine group 1 cards and count
        const { group: kittiesGroup } = await photoReportTab.FetchGroupByLabel(KittiesGroup)
        const initialGroupOneCount = await kittiesGroup.FetchCardCount()
        const initialFirstCardGroupOne = await kittiesGroup.FetchCardByIndex(0)
        const { title: initialFirstTitleGroupOne, description: initialFirstDescriptionGroupOne } =
          await initialFirstCardGroupOne.FetchCardInfo()
        const initialThirdCardGroupOne = await kittiesGroup.FetchCardByIndex(2)

        // examine group 2 cards and count
        const { group: piggiesGroup } = await photoReportTab.FetchGroupByLabel(PiggiesGroup)
        const initialGroupTwoCount = await piggiesGroup.FetchCardCount()
        const initialFirstCardGroupTwo = await piggiesGroup.FetchCardByIndex(0)
        const { title: initialFirstTitleGroupTwo, description: initialFirstDescriptionGroupTwo } =
          await initialFirstCardGroupTwo.FetchCardInfo()

        // drag the card selection from group one onto the second card in the second group
        await photoReportTab.DragCardSelection(
          [initialThirdCardGroupOne, initialFirstCardGroupOne],
          initialFirstCardGroupTwo
        )

        // Get info after the drag drop
        const afterGroupOneCount = await kittiesGroup.FetchCardCount()
        const afterGroupTwoCount = await piggiesGroup.FetchCardCount()

        // Count in group one should be down 2 cards
        expect(afterGroupOneCount).toBe(initialGroupOneCount - 2)

        // Count in group two should be up 2 cards
        expect(afterGroupTwoCount).toBe(initialGroupTwoCount + 2)

        const afterFirstCardGroupTwo = await piggiesGroup.FetchCardByIndex(0)
        const { title: afterFirstTitleGroupTwo, description: afterFirstDescriptionGroupTwo } =
          await afterFirstCardGroupTwo.FetchCardInfo()

        const afterSecondCardGroupTwo = await piggiesGroup.FetchCardByIndex(1)
        const { title: afterSecondTitleGroupTwo, description: afterSecondDescriptionGroupTwo } =
          await afterSecondCardGroupTwo.FetchCardInfo()

        const afterThirdCardGroupTwo = await piggiesGroup.FetchCardByIndex(2)
        const { title: afterThirdTitleGroupTwo, description: afterThirdDescriptionGroupTwo } =
          await afterThirdCardGroupTwo.FetchCardInfo()

        // first card from group one selection should be 1st or 2nd card in group two
        expect(
          initialFirstTitleGroupOne == afterFirstTitleGroupTwo ||
            initialFirstTitleGroupOne == afterSecondTitleGroupTwo
        ).toBe(true)
        expect(
          initialFirstDescriptionGroupOne == afterFirstDescriptionGroupTwo ||
            initialFirstDescriptionGroupOne == afterSecondDescriptionGroupTwo
        ).toBe(true)

        // first card in group two should now be the third card in group two
        expect(initialFirstTitleGroupTwo == afterThirdTitleGroupTwo).toBe(true)
        expect(initialFirstDescriptionGroupTwo == afterThirdDescriptionGroupTwo).toBe(true)
      })

      test('Verify Multi Cards from 2+ groups Drag Drop in another Group', async ({ browser }) => {
        // launch the Delegate Inspection Tech home page
        const { global } = await LaunchInspectionTech(browser, environment)

        // Go to the test claim page
        const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
        const claimPage = new DelegatePortalClaimPage(global, testClaim)
        await claimPage.NavigateDirectlyToClaim()

        // head to the Photo Report tab
        const photoReportTab = new DelegatePortalPhotoReportTab(
          global,
          `claims/${testClaim.basicInfo.claimNumber}`
        )
        await photoReportTab.NavigateDirectly()

        // examine group 1 cards and count
        const { group: kittiesGroup } = await photoReportTab.FetchGroupByLabel(KittiesGroup)
        const initialGroupOneCount = await kittiesGroup.FetchCardCount()
        const initialFirstCardGroupOne = await kittiesGroup.FetchCardByIndex(0)
        const { title: initialFirstTitleGroupOne, description: initialFirstDescriptionGroupOne } =
          await initialFirstCardGroupOne.FetchCardInfo()

        // examine group 2 cards and count
        const { group: piggiesGroup } = await photoReportTab.FetchGroupByLabel(PiggiesGroup)
        const initialGroupTwoCount = await piggiesGroup.FetchCardCount()
        const initialFirstCardGroupTwo = await piggiesGroup.FetchCardByIndex(0)
        const { title: initialFirstTitleGroupTwo, description: initialFirstDescriptionGroupTwo } =
          await initialFirstCardGroupTwo.FetchCardInfo()

        // examine group 3 cards and count
        const { group: puppiesGroup } = await photoReportTab.FetchGroupByLabel(PuppiesGroup)
        const initialGroupThreeCount = await puppiesGroup.FetchCardCount()
        const initialFirstCardGroupThree = await puppiesGroup.FetchCardByIndex(0)
        const {
          title: initialFirstTitleGroupThree,
          description: initialFirstDescriptionGroupThree,
        } = await initialFirstCardGroupThree.FetchCardInfo()

        // drag the card selection from group one and two onto the third group
        await photoReportTab.DragCardSelection(
          [initialFirstCardGroupTwo, initialFirstCardGroupOne],
          puppiesGroup
        )

        // Get info after the drag drop
        const afterGroupOneCount = await kittiesGroup.FetchCardCount()
        const afterGroupTwoCount = await piggiesGroup.FetchCardCount()
        const afterGroupThreeCount = await puppiesGroup.FetchCardCount()

        // Count in group one should be down 1 card
        expect(afterGroupOneCount).toBe(initialGroupOneCount - 1)
        // Count in group two should be down 1 card
        expect(afterGroupTwoCount).toBe(initialGroupTwoCount - 1)
        // Count in group three should be up 2 cards
        expect(afterGroupThreeCount).toBe(initialGroupThreeCount + 2)

        const afterFirstCardGroupThree = await puppiesGroup.FetchCardByIndex(0)
        const { title: afterFirstTitleGroupThree, description: afterFirstDescriptionGroupThree } =
          await afterFirstCardGroupThree.FetchCardInfo()

        const afterSecondCardGroupThree = await puppiesGroup.FetchCardByIndex(1)
        const { title: afterSecondTitleGroupThree, description: afterSecondDescriptionGroupThree } =
          await afterSecondCardGroupThree.FetchCardInfo()

        const afterThirdCardGroupThree = await puppiesGroup.FetchCardByIndex(2)
        const { title: afterThirdTitleGroupThree, description: afterThirdDescriptionGroupThree } =
          await afterThirdCardGroupThree.FetchCardInfo()

        // first card from group one selection should be first card in group three
        expect(initialFirstTitleGroupOne).toBe(afterFirstTitleGroupThree)
        expect(initialFirstDescriptionGroupOne).toBe(afterFirstDescriptionGroupThree)
        // second card from group two selection should be second card in group three
        expect(initialFirstTitleGroupTwo).toBe(afterSecondTitleGroupThree)
        expect(initialFirstDescriptionGroupTwo).toBe(afterSecondDescriptionGroupThree)
        // third card in group three should be the original first card
        expect(initialFirstTitleGroupThree).toBe(afterThirdTitleGroupThree)
        expect(initialFirstDescriptionGroupThree).toBe(afterThirdDescriptionGroupThree)
      })
    })
    test('Verify Sort Order Dialog UI', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Photo Report tab
      const photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.NavigateDirectly()

      // open the dialog
      let sortOrderDialog = await photoReportTab.OpenSortOrderDialog()

      // Verify the Sort Order dialog title
      await sortOrderDialog.VerifyTitle()

      // Verify dialog elements are visible and in the correct state
      expect(await sortOrderDialog.Label_Alert.locator.isVisible()).toBe(true)
      await sortOrderDialog.Label_Alert.VerifyExpectedText()
      expect(await sortOrderDialog.Label_SortBy.locator.isVisible()).toBe(true)
      await sortOrderDialog.Label_SortBy.VerifyExpectedText()
      expect(await sortOrderDialog.radioButton_Label.isVisible()).toBe(true)
      expect(await sortOrderDialog.radioButton_Label.isChecked()).toBe(true)
      expect(await sortOrderDialog.radioButton_Timestamp.isVisible()).toBe(true)
      expect(await sortOrderDialog.radioButton_Timestamp.isChecked()).toBe(false)
      expect(await sortOrderDialog.radioButton_Ascending.isVisible()).toBe(true)
      expect(await sortOrderDialog.radioButton_Ascending.isChecked()).toBe(true)
      expect(await sortOrderDialog.radioButton_Descending.isVisible()).toBe(true)
      expect(await sortOrderDialog.radioButton_Descending.isChecked()).toBe(false)
      expect(await sortOrderDialog.Button_Close_X.IsEnabled()).toBe(true)

      // Verify Sort Order dialog - closes with click on "X" button
      await sortOrderDialog.Close()
      await expect(sortOrderDialog.Title.locator).not.toBeVisible()
      await photoReportTab.Wait(1000)

      // Verify Add Tags dialog - closes with ESC key
      sortOrderDialog = await photoReportTab.OpenSortOrderDialog()
      await sortOrderDialog.Close(true)
      await expect(sortOrderDialog.Title.locator).not.toBeVisible()
      await photoReportTab.Wait(1000)
    })

    test.skip('Verify Group Sort Order - By Label', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Photo Report tab
      const photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.NavigateDirectly()

      // open the dialog
      let sortOrderDialog = await photoReportTab.OpenSortOrderDialog()
      // verify Label + Ascending are selected (default)
      expect(await sortOrderDialog.radioButton_Label.isChecked()).toBe(true)
      expect(await sortOrderDialog.radioButton_Ascending.isChecked()).toBe(true)
      await sortOrderDialog.Close()

      // Verify default sort order is sort order is Groups by (A-Z) on Label, then per group, photos by (A-Z) on title
      // For each group, check sort order
      let actualGroupLabels = await photoReportTab.FetchCurrentGroupLabels()
      const actualBeforeAscendingCheck = Object.assign([], actualGroupLabels)
      actualGroupLabels.sort()
      const isSortedAscending =
        JSON.stringify(actualBeforeAscendingCheck) === JSON.stringify(actualGroupLabels)
      expect.soft(isSortedAscending).toBe(true)

      // open the dialog again
      sortOrderDialog = await photoReportTab.OpenSortOrderDialog()
      // set order to descending
      await sortOrderDialog.radioButton_Descending.setChecked(true)
      await sortOrderDialog.Close()

      // Verify descending sort order is Groups by (Z-A) on Label, then per group, photos by (A-Z) on title
      // For each group, check sort order
      actualGroupLabels = await photoReportTab.FetchCurrentGroupLabels()
      const actualBeforeDescendingCheck = Object.assign([], actualGroupLabels)
      actualGroupLabels.sort((a, b) => {
        if (a > b) {
          return -1 // a comes before b in descending order
        }
        if (a < b) {
          return 1 // b comes before a in descending order
        }
        return 0 // elements are equal
      })
      const isSortedDescending =
        JSON.stringify(actualBeforeDescendingCheck) === JSON.stringify(actualGroupLabels)

      expect.soft(isSortedDescending).toBe(true)
    })

    test('Verify Card UI', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Photo Report tab
      const photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.NavigateDirectly()

      // grab a group that should have cards
      const { group: kittiesGroup } = await photoReportTab.FetchGroupByLabel(KittiesGroup)
      const firstCard = await kittiesGroup.FetchCardByIndex(0)

      // verify drag handle and delete button
      expect(await firstCard.button_DragHandle.isVisible()).toBe(true)
      expect(await firstCard.button_Delete.isVisible()).toBe(true)

      // verify selection checkbox
      expect(await firstCard.checkbox_Select.isVisible()).toBe(true)

      // Verify the card labels and data
      await firstCard.VerifyLabels()
      const { title, label, description } = await firstCard.FetchCardInfo()
      expect(title).not.toBe('')
      expect(label).toBe(KittiesGroup)
      expect(description).not.toBe('')

      // Verify Edit Photo button
      expect(await firstCard.button_EditPhoto.isVisible()).toBe(true)
    })

    test('Verify Card Delete', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Photo Report tab
      const photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.NavigateDirectly()

      // work on a group that should have cards
      const { group: kittiesGroup } = await photoReportTab.FetchGroupByLabel(KittiesGroup)
      const firstCard = await kittiesGroup.FetchCardByIndex(0)

      const initialCardCount = await kittiesGroup.FetchCardCount()
      await firstCard.button_Delete.click()
      const afterDeleteCardCount = await kittiesGroup.FetchCardCount()
      expect(initialCardCount).toBeGreaterThan(afterDeleteCardCount)
    })

    test('Verify Reset after changes', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Photo Report tab
      const photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.NavigateDirectly()

      // examine group 1 card and count
      const { group: kittiesGroup } = await photoReportTab.FetchGroupByLabel(KittiesGroup)
      const initialGroupOneCount = await kittiesGroup.FetchCardCount()
      const initialFirstCardGroupOne = await kittiesGroup.FetchCardByIndex(0)
      const { title: initialFirstTitleGroupOne, description: initialFirstDescriptionGroupOne } =
        await initialFirstCardGroupOne.FetchCardInfo()

      const { group: piggiesGroup } = await photoReportTab.FetchGroupByLabel(PiggiesGroup)
      const initialGroupTwoCount = await piggiesGroup.FetchCardCount()
      const initialFirstCardGroupTwo = await piggiesGroup.FetchCardByIndex(0)
      const { title: initialFirstTitleGroupTwo, description: initialFirstDescriptionGroupTwo } =
        await initialFirstCardGroupTwo.FetchCardInfo()

      // drag the first card from group one onto the second group
      await photoReportTab.DragCardSelection([initialFirstCardGroupOne], piggiesGroup)

      // Get info after the drag drop
      const afterGroupOneCount = await kittiesGroup.FetchCardCount()
      const afterGroupTwoCount = await piggiesGroup.FetchCardCount()

      // Count in group one should be down one card
      expect(afterGroupOneCount).toBe(initialGroupOneCount - 1)

      // Count in group two should be up one card
      expect(afterGroupTwoCount).toBe(initialGroupTwoCount + 1)

      const afterFirstCardGroupTwo = await piggiesGroup.FetchCardByIndex(0)
      const { title: afterFirstTitleGroupTwo, description: afterFirstDescriptionGroupTwo } =
        await afterFirstCardGroupTwo.FetchCardInfo()

      const afterSecondCardGroupTwo = await piggiesGroup.FetchCardByIndex(1)
      const { title: afterSecondTitleGroupTwo, description: afterSecondDescriptionGroupTwo } =
        await afterSecondCardGroupTwo.FetchCardInfo()

      // first card from group one should be first card in group two
      expect(initialFirstTitleGroupOne).toBe(afterFirstTitleGroupTwo)
      expect(initialFirstDescriptionGroupOne).toBe(afterFirstDescriptionGroupTwo)
      // second card in group two should be first card in that group before the drag
      expect(initialFirstTitleGroupTwo).toBe(afterSecondTitleGroupTwo)
      expect(initialFirstDescriptionGroupTwo).toBe(afterSecondDescriptionGroupTwo)

      // remove a card
      const { group: puppiesGroup } = await photoReportTab.FetchGroupByLabel(PuppiesGroup)
      const initialGroupThreeCount = await puppiesGroup.FetchCardCount()
      const firstCardGroupThree = await puppiesGroup.FetchCardByIndex(0)
      await firstCardGroupThree.button_Delete.click()
      const deleteGroupThreeCount = await puppiesGroup.FetchCardCount()
      expect(deleteGroupThreeCount).toBe(initialGroupThreeCount - 1)

      // now reset everything
      await photoReportTab.SelectActionMenuItem(PhotoReport_ActionMenuItems.Reset)

      // Verify initial conditions are back in place
      // Get info after the reset
      const resetGroupOneCount = await kittiesGroup.FetchCardCount()
      const resetGroupTwoCount = await piggiesGroup.FetchCardCount()
      const resetGroupThreeCount = await puppiesGroup.FetchCardCount()

      // Counts in altered groups should be same as before all the changes
      expect(resetGroupOneCount).toBe(initialGroupOneCount)
      expect(resetGroupTwoCount).toBe(initialGroupTwoCount)
      expect(resetGroupThreeCount).toBe(initialGroupThreeCount)

      // moved cards should be back where they belong
      const resetFirstCardGroupTwo = await piggiesGroup.FetchCardByIndex(0)
      const { title: resetFirstTitleGroupTwo, description: resetFirstDescriptionGroupTwo } =
        await resetFirstCardGroupTwo.FetchCardInfo()
      // first card from group two should be the original card in group two
      expect(resetFirstTitleGroupTwo).toBe(initialFirstTitleGroupTwo)
      expect(resetFirstDescriptionGroupTwo).toBe(initialFirstDescriptionGroupTwo)
    })

    test('Verify Add Removed Photos Drawer UI', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Photo Report tab
      const photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.NavigateDirectly()

      // remove a card
      const { group: kittiesGroup } = await photoReportTab.FetchGroupByLabel(KittiesGroup)
      const firstCardGroupOne = await kittiesGroup.FetchCardByIndex(0)
      await firstCardGroupOne.button_Delete.click()
      await photoReportTab.Wait(2000)

      // Open the drawer
      let addRemovedPhotosDrawer = await photoReportTab.OpenAddRemovedPhotosDrawer()

      // Verify the Add Removed Photos drawer title
      await addRemovedPhotosDrawer.VerifyTitle()

      // Verify elements are visible
      expect(await addRemovedPhotosDrawer.CheckBox_SelectAll.IsEnabled()).toBe(true)
      const firstPhotoCheckbox = addRemovedPhotosDrawer.TargetPhotoCheckboxByIndex(0)
      expect(await firstPhotoCheckbox.IsEnabled()).toBe(true)
      expect(await addRemovedPhotosDrawer.Button_Close.IsEnabled()).toBe(true)
      expect(await addRemovedPhotosDrawer.Button_Submit.IsEnabled()).toBe(true)

      // Verify Add Removed Photos drawer - closes with click on "X" button
      await addRemovedPhotosDrawer.Close()
      await expect(addRemovedPhotosDrawer.Title.locator).not.toBeAttached()
      await photoReportTab.Wait(1000)

      // Verify Add Removed Photos drawer - closes with ESC key
      addRemovedPhotosDrawer = await photoReportTab.OpenAddRemovedPhotosDrawer()
      await addRemovedPhotosDrawer.Close(true)
      await expect(addRemovedPhotosDrawer.Title.locator).not.toBeAttached()
      await photoReportTab.Wait(1000)
    })

    test('Validate Add Removed Photos Drawer', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Photo Report tab
      const photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.NavigateDirectly()

      // remove a card
      const { group: kittiesGroup } = await photoReportTab.FetchGroupByLabel(KittiesGroup)
      const firstCardGroupOne = await kittiesGroup.FetchCardByIndex(0)
      await firstCardGroupOne.button_Delete.click()

      // Open the drawer
      const addRemovedPhotosDrawer = await photoReportTab.OpenAddRemovedPhotosDrawer()
      // Click Submit

      await addRemovedPhotosDrawer.Button_Submit.Click()
      await addRemovedPhotosDrawer.Validate()
      await addRemovedPhotosDrawer.Close()
    })

    test('Validate Add Removed Photos', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Photo Report tab
      const photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.NavigateDirectly()

      // examine group 1 card and count
      const { group: kittiesGroup } = await photoReportTab.FetchGroupByLabel(KittiesGroup)
      const initialGroupOneCount = await kittiesGroup.FetchCardCount()
      const initialFirstCardGroupOne = await kittiesGroup.FetchCardByIndex(0)

      // examine group 2 card and count
      const { group: piggiesGroup } = await photoReportTab.FetchGroupByLabel(PiggiesGroup)
      const initialGroupTwoCount = await piggiesGroup.FetchCardCount()
      const initialFirstCardGroupTwo = await piggiesGroup.FetchCardByIndex(0)
      const { title: initialFirstTitleGroupTwo, description: initialFirstDescriptionGroupTwo } =
        await initialFirstCardGroupTwo.FetchCardInfo()

      // remove 1 card from each group
      await initialFirstCardGroupOne.button_Delete.click()
      await initialFirstCardGroupTwo.button_Delete.click()

      // now restore the photo from Group two
      const addRemovedPhotosDrawer = await photoReportTab.OpenAddRemovedPhotosDrawer()
      await addRemovedPhotosDrawer.SelectPhotoByIndex(1)
      await addRemovedPhotosDrawer.Button_Submit.Click()

      // Get info after the restore
      const restoreGroupOneCount = await kittiesGroup.FetchCardCount()
      const restoreGroupTwoCount = await piggiesGroup.FetchCardCount()

      // Counts in altered groups should be correct
      expect(restoreGroupOneCount).toBe(initialGroupOneCount - 1)
      expect(restoreGroupTwoCount).toBe(initialGroupTwoCount)

      // deleted card should be back in group two
      const restoreFirstCardGroupTwo = await piggiesGroup.FetchCardByIndex(2)
      const { title: restoredTitleGroupTwo, description: restoredDescriptionGroupTwo } =
        await restoreFirstCardGroupTwo.FetchCardInfo()

      // last card from group two should be the original card in group two
      expect(restoredTitleGroupTwo).toBe(initialFirstTitleGroupTwo)
      expect(restoredDescriptionGroupTwo).toBe(initialFirstDescriptionGroupTwo)
    })

    test('Verify Expand/Collapse Groups', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Photo Report tab
      const photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.NavigateDirectly()

      if ((await photoReportTab.FetchGroupCount()) == 0) {
        AbortTest(AbortErrors.EmptyPhotoReportPageMessage)
        return
      }

      // get the first group
      const firstGroup = await photoReportTab.FetchGroupByIndex(0)
      expect(await firstGroup.label.textContent()).not.toBe('')

      // by default, should be expanded
      expect(await firstGroup.IsExpanded()).toBe(true)

      // Verify Collapse Groups button is visible, Expand Groups is not
      expect(await photoReportTab.Button_CollapseGroups.IsVisible()).toBe(true)
      expect(await photoReportTab.Button_ExpandGroups.IsVisible()).toBe(false)

      // Collapse all the groups
      await photoReportTab.Button_CollapseGroups.Click()
      await photoReportTab.Wait(1000)

      // Verify group is collapsed
      expect(await firstGroup.IsCollapsed()).toBe(true)
      expect(await firstGroup.IsCardListHidden()).toBe(true)

      // Verify Collapse Groups button is NOT visible, Expand Groups is visible
      expect(await photoReportTab.Button_CollapseGroups.IsVisible()).toBe(false)
      expect(await photoReportTab.Button_ExpandGroups.IsVisible()).toBe(true)

      // Expand all the groups
      await photoReportTab.Button_ExpandGroups.Click()
      await photoReportTab.Wait(1000)

      // Verify group is expanded
      expect(await firstGroup.IsExpanded()).toBe(true)
      expect(await firstGroup.IsCardListHidden()).toBe(false)

      // Verify Collapse Groups button is visible, Expand Groups is not
      expect(await photoReportTab.Button_CollapseGroups.IsVisible()).toBe(true)
      expect(await photoReportTab.Button_ExpandGroups.IsVisible()).toBe(false)
    })

    test('Verify Expand/Collapse Photos', async ({ browser }) => {
      // launch the Delegate Inspection Tech home page
      const { global } = await LaunchInspectionTech(browser, environment)

      // Go to the test claim page
      const testClaim = FetchCannedClaim(environment, CannedClaimTypes.DefaultTestClaim)
      const claimPage = new DelegatePortalClaimPage(global, testClaim)
      await claimPage.NavigateDirectlyToClaim()

      // head to the Photo Report tab
      const photoReportTab = new DelegatePortalPhotoReportTab(
        global,
        `claims/${testClaim.basicInfo.claimNumber}`
      )
      await photoReportTab.NavigateDirectly()

      if ((await photoReportTab.FetchGroupCount()) == 0) {
        AbortTest(AbortErrors.EmptyPhotoReportPageMessage)
        return
      }

      // Photos should be expanded by default
      // get the first card of the first group
      const firstGroup = await photoReportTab.FetchGroupByIndex(0)
      const firstCard = await firstGroup.FetchCardByIndex(0)

      // by default, card should be expanded
      expect(await firstCard.IsExpanded()).toBe(true)

      // Verify Collapse Photos button is visible, Expand Photos is not
      expect(await photoReportTab.Button_CollapsePhotos.IsVisible()).toBe(true)
      expect(await photoReportTab.Button_ExpandPhotos.IsVisible()).toBe(false)

      // Collapse all the photos
      await photoReportTab.Button_CollapsePhotos.Click()
      await photoReportTab.Wait(1000)

      // Verify photos are collapsed
      expect(await firstCard.IsCollapsed()).toBe(true)

      // Verify Collapse Photos button is NOT visible, Expand Photos is visible
      expect(await photoReportTab.Button_CollapsePhotos.IsVisible()).toBe(false)
      expect(await photoReportTab.Button_ExpandPhotos.IsVisible()).toBe(true)

      // Expand all the photos
      await photoReportTab.Button_ExpandPhotos.Click()
      await photoReportTab.Wait(1000)

      // Verify photos are expanded
      expect(await firstCard.IsExpanded()).toBe(true)

      // Verify Collapse Photos button is visible, Expand Photos is not
      expect(await photoReportTab.Button_CollapsePhotos.IsVisible()).toBe(true)
      expect(await photoReportTab.Button_ExpandPhotos.IsVisible()).toBe(false)
    })
  }
)
