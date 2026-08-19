import { expect } from '@playwright/test'
import {
  AbortErrors,
  ClaimFilterSelectionOptions_Carrier,
  DataGrid_Column_SortState,
  DataGrid_Column_Type,
  DataGrid_DateSearchOption,
  DefaultEnvironment,
  DocumentTemplate_DataGrid_ActionMenuItems,
  TemplateTabTypes,
} from '../../library/claimsPortal/claimsPortalConstants.js'
import { FetchCannedTemplateData, Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { ClaimsPortalTemplatesPage } from '../../library/claimsPortal/pages/claimsPortalTemplatesPage.js'
import { ClaimsPortalTemplatesDocumentTab } from '../../library/claimsPortal/tabs/claimsPortalTemplatesDocumentTab.js'
import { AbortTest } from '../../library/shared/commonHelper.js'
import { Tags } from '../../library/shared/constants.js'
import test from '../../library/shared/testHooks.js'

const environment = DefaultEnvironment
const templateData = FetchCannedTemplateData(environment)
const dateSuffix = `+${Date.now()}`
const templatePrefix = 'AA_TESTTEMPLATE'

test.describe(
  'Templates Page: Document Templates Tab',
  {
    tag: [Tags.ClaimsPortal, Tags.DocumentTemplates],
  },
  () => {
    test('Smoke Test', { tag: [Tags.Smoke, Tags.P1] }, async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
      const templatesPage = new ClaimsPortalTemplatesPage(global)
      await templatesPage.NavigateToPage()
      const templatesTab = (await templatesPage.SelectTemplateTab(
        TemplateTabTypes.Document
      )) as ClaimsPortalTemplatesDocumentTab
      const gridtable = templatesTab.DataGrid

      // Verify Title
      await templatesTab.Title.VerifyExpectedText()

      // Verify GridTable exists
      expect(await gridtable.IsVisible()).toBe(true)

      // Verify Create Document Template button exists
      expect(await templatesTab.Button_CreateDocumentTemplate.IsVisible()).toBe(true)

      if (!(await gridtable.IsEmpty())) {
        const initialRowCount = await gridtable.VisibleRowCount()

        // Narrow the templates down to 1 row - keep dialog open
        const popup = await templatesTab.DataGrid.OpenTextSearchPopup(
          DataGrid_Column_Type.Templates_Name
        )
        await popup.SetSearch('NoMatchExpected', false)
        await templatesTab.page.waitForTimeout(1000)

        const postSearchRowCount = await gridtable.VisibleRowCount()
        expect(postSearchRowCount).toBe(0)

        // clear the search, close the popup and make sure all the rows are back
        await popup.ClearSearch(true)
        const postClearRowCount = await gridtable.VisibleRowCount()
        expect(postClearRowCount).toBe(initialRowCount)
      }
    })

    test('Verify Navigation and UI Elements', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
      const templatesPage = new ClaimsPortalTemplatesPage(global)
      await templatesPage.NavigateToPage()
      const templatesTab = (await templatesPage.SelectTemplateTab(
        TemplateTabTypes.Document
      )) as ClaimsPortalTemplatesDocumentTab
      const gridtable = templatesTab.DataGrid

      // Verify Title
      await templatesTab.Title.VerifyExpectedText()

      // Verify GridTable exists
      expect(await gridtable.IsVisible()).toBe(true)

      // Verify Create Document Template button exists
      expect(await templatesTab.Button_CreateDocumentTemplate.IsVisible()).toBe(true)
    })

    test.describe('serial tests', () => {
      // Configure this describe block to run in serial mode - one after another
      test.describe.configure({ mode: 'default' })

      test('Template GridTable - Verify Column Visibility', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
        const templatesPage = new ClaimsPortalTemplatesPage(global)
        await templatesPage.NavigateToPage()
        const templatesTab = (await templatesPage.SelectTemplateTab(
          TemplateTabTypes.Document
        )) as ClaimsPortalTemplatesDocumentTab
        const gridtable = templatesTab.DataGrid

        // Verify that each Document Template column is visible on the gridtable
        expect(await gridtable.IsColumnVisible(DataGrid_Column_Type.Templates_Name)).toBe(true)
        expect(await gridtable.IsColumnVisible(DataGrid_Column_Type.Templates_Carrier)).toBe(true)
        expect(await gridtable.IsColumnVisible(DataGrid_Column_Type.Templates_Document)).toBe(true)
        expect(await gridtable.IsColumnVisible(DataGrid_Column_Type.Templates_Created)).toBe(true)
        expect(await gridtable.IsColumnVisible(DataGrid_Column_Type.Templates_LastUpdated)).toBe(
          true
        )

        let popup = await templatesTab.DataGrid.OpenColumnSettingsPopup(
          DataGrid_Column_Type.Templates_Name
        )
        // hide and show the other columns
        await popup.HideColumn(DataGrid_Column_Type.Templates_LastUpdated, false)
        expect(await gridtable.IsColumnVisible(DataGrid_Column_Type.Templates_LastUpdated)).toBe(
          false
        )
        await popup.ShowColumn(DataGrid_Column_Type.Templates_LastUpdated, false)
        expect(await gridtable.IsColumnVisible(DataGrid_Column_Type.Templates_LastUpdated)).toBe(
          true
        )
        await popup.HideColumn(DataGrid_Column_Type.Templates_Created, false)
        expect(await gridtable.IsColumnVisible(DataGrid_Column_Type.Templates_Created)).toBe(false)
        await popup.ShowColumn(DataGrid_Column_Type.Templates_Created, false)
        expect(await gridtable.IsColumnVisible(DataGrid_Column_Type.Templates_Created)).toBe(true)
        await popup.HideColumn(DataGrid_Column_Type.Templates_Document, false)
        expect(await gridtable.IsColumnVisible(DataGrid_Column_Type.Templates_Document)).toBe(false)
        await popup.ShowColumn(DataGrid_Column_Type.Templates_Document, false)
        expect(await gridtable.IsColumnVisible(DataGrid_Column_Type.Templates_Document)).toBe(true)
        await popup.HideColumn(DataGrid_Column_Type.Templates_Carrier, false)
        expect(await gridtable.IsColumnVisible(DataGrid_Column_Type.Templates_Carrier)).toBe(false)
        await popup.ShowColumn(DataGrid_Column_Type.Templates_Carrier, true)
        expect(await gridtable.IsColumnVisible(DataGrid_Column_Type.Templates_Carrier)).toBe(true)

        // hide and show the name column
        popup = await templatesTab.DataGrid.OpenColumnSettingsPopup(
          DataGrid_Column_Type.Templates_Carrier
        )
        await popup.HideColumn(DataGrid_Column_Type.Templates_Name, false)
        expect(await gridtable.IsColumnVisible(DataGrid_Column_Type.Templates_Name)).toBe(false)
        popup = await templatesTab.DataGrid.OpenColumnSettingsPopup(
          DataGrid_Column_Type.Templates_Carrier
        )
        await popup.ShowColumn(DataGrid_Column_Type.Templates_Name, false)
        expect(await gridtable.IsColumnVisible(DataGrid_Column_Type.Templates_Name)).toBe(true)
      })

      test('Template GridTable - Verify Column Sort', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
        const templatesPage = new ClaimsPortalTemplatesPage(global)
        await templatesPage.NavigateToPage()
        const templatesTab = (await templatesPage.SelectTemplateTab(
          TemplateTabTypes.Document
        )) as ClaimsPortalTemplatesDocumentTab

        let popup = await templatesTab.DataGrid.OpenColumnSettingsPopup(
          DataGrid_Column_Type.Templates_Name
        )
        await popup.SetSortingState(DataGrid_Column_SortState.Ascending)
        popup = await templatesTab.DataGrid.OpenColumnSettingsPopup(
          DataGrid_Column_Type.Templates_Name
        )
        const shouldBeAscending = await popup.GetSortingState(true)
        expect(shouldBeAscending).toBe(DataGrid_Column_SortState.Ascending)

        popup = await templatesTab.DataGrid.OpenColumnSettingsPopup(
          DataGrid_Column_Type.Templates_Name
        )
        await popup.SetSortingState(DataGrid_Column_SortState.Descending)
        popup = await templatesTab.DataGrid.OpenColumnSettingsPopup(
          DataGrid_Column_Type.Templates_Name
        )
        const shouldBeDescending = await popup.GetSortingState(true)
        expect(shouldBeDescending).toBe(DataGrid_Column_SortState.Descending)

        popup = await templatesTab.DataGrid.OpenColumnSettingsPopup(
          DataGrid_Column_Type.Templates_Name
        )
        await popup.SetSortingState(DataGrid_Column_SortState.Unsorted)
        popup = await templatesTab.DataGrid.OpenColumnSettingsPopup(
          DataGrid_Column_Type.Templates_Name
        )
        const shouldBeUnsorted = await popup.GetSortingState(true)
        expect(shouldBeUnsorted).toBe(DataGrid_Column_SortState.Unsorted)
      })

      test('Template GridTable - Verify Column Move', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
        const templatesPage = new ClaimsPortalTemplatesPage(global)
        await templatesPage.NavigateToPage()
        const templatesTab = (await templatesPage.SelectTemplateTab(
          TemplateTabTypes.Document
        )) as ClaimsPortalTemplatesDocumentTab
        const gridtable = templatesTab.DataGrid

        // make sure all columns are visible before doing this
        const initialRightmostColumn = DataGrid_Column_Type.Templates_LastUpdated
        const initialAdjacentColumn = DataGrid_Column_Type.Templates_Created
        const initialRightmostIndex = await gridtable.FindColumnIndexByName(initialRightmostColumn)
        const initialAdjacentColumnIndex =
          await gridtable.FindColumnIndexByName(initialAdjacentColumn)
        expect.soft(initialRightmostIndex).toBe(5)
        expect.soft(initialAdjacentColumnIndex).toBe(initialRightmostIndex - 1)

        // make sure move right is disabled for the rightmost column
        let popup = await templatesTab.DataGrid.OpenColumnSettingsPopup(initialRightmostColumn)
        const { moveToRightEnabled: mtreA, moveToLeftEnabled: mtleA } =
          await popup.GetMoveMenuItemsState(true)
        expect(mtreA).toBe(false)
        expect(mtleA).toBe(true)

        // make sure move left/right enabled for the adjacent left column
        popup = await templatesTab.DataGrid.OpenColumnSettingsPopup(initialAdjacentColumn)
        const { moveToRightEnabled: mtreB, moveToLeftEnabled: mtleB } =
          await popup.GetMoveMenuItemsState(true)
        expect(mtreB).toBe(true)
        expect(mtleB).toBe(true)

        // move initial rightmost column to the left
        popup = await templatesTab.DataGrid.OpenColumnSettingsPopup(initialRightmostColumn)
        await popup.MoveToLeft()

        // right most column should have moved left 1 slot, swapping with the column next to it on the left
        const currentRightmostIndex = await gridtable.FindColumnIndexByName(initialRightmostColumn)
        const currentAdjacentColumnIndex =
          await gridtable.FindColumnIndexByName(initialAdjacentColumn)
        expect.soft(currentRightmostIndex).toBe(initialAdjacentColumnIndex)
        expect.soft(currentAdjacentColumnIndex).toBe(initialRightmostIndex)

        // check menu states now for these 2 columns
        popup = await templatesTab.DataGrid.OpenColumnSettingsPopup(initialAdjacentColumn)
        const { moveToRightEnabled: mtreC, moveToLeftEnabled: mtleC } =
          await popup.GetMoveMenuItemsState(true)
        expect(mtreC).toBe(false)
        expect(mtleC).toBe(true)

        popup = await templatesTab.DataGrid.OpenColumnSettingsPopup(initialRightmostColumn)
        const { moveToRightEnabled: mtreD, moveToLeftEnabled: mtleD } =
          await popup.GetMoveMenuItemsState(true)
        expect(mtreD).toBe(true)
        expect(mtleD).toBe(true)
      })

      test('Template GridTable - Verify Column Pin', async ({ browser }) => {
        // launch the Claims Portal home page
        const { global } = await Launch(browser, environment)

        // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
        const templatesPage = new ClaimsPortalTemplatesPage(global)
        await templatesPage.NavigateToPage()
        const templatesTab = (await templatesPage.SelectTemplateTab(
          TemplateTabTypes.Document
        )) as ClaimsPortalTemplatesDocumentTab
        const gridtable = templatesTab.DataGrid

        // make sure all columns are visible before doing this
        //tbd

        const initialLastUpdatedColumnIndex = await gridtable.FindColumnIndexByName(
          DataGrid_Column_Type.Templates_LastUpdated
        )

        // pin Last Updated to the left
        let popup = await templatesTab.DataGrid.OpenColumnSettingsPopup(
          DataGrid_Column_Type.Templates_LastUpdated
        )

        // Do Pin Left
        await popup.PinToLeft()

        // get current LastUpdated Index - should be 0 or 1
        const pinnedLastUpdatedColumnIndex = await gridtable.FindColumnIndexByName(
          DataGrid_Column_Type.Templates_LastUpdated
        )
        expect(pinnedLastUpdatedColumnIndex).toBe(0)
        popup = await templatesTab.DataGrid.OpenColumnSettingsPopup(
          DataGrid_Column_Type.Templates_LastUpdated
        )

        // Verify Pin Left is checked
        const { pinToRightChecked: ptreA, pinToLeftChecked: ptleA } =
          await popup.GetPinMenuItemsState(false)
        expect(ptreA).toBe(false)
        expect(ptleA).toBe(true)

        // Check move items are disabled
        const { moveToRightEnabled: mtreA, moveToLeftEnabled: mtleA } =
          await popup.GetMoveMenuItemsState(true)
        expect(mtreA).toBe(false)
        expect(mtleA).toBe(false)

        // Verify column is no longer pinned
        await templatesTab.DataGrid.UnpinColumn(DataGrid_Column_Type.Templates_LastUpdated)

        // get current LastUpdated Index - should be back to it's original location
        const unpinnedLastUpdatedColumnIndex = await gridtable.FindColumnIndexByName(
          DataGrid_Column_Type.Templates_LastUpdated
        )
        expect(unpinnedLastUpdatedColumnIndex).toBe(initialLastUpdatedColumnIndex)

        popup = await templatesTab.DataGrid.OpenColumnSettingsPopup(
          DataGrid_Column_Type.Templates_LastUpdated
        )

        // Verify Pin Left is not checked
        const { pinToRightChecked: ptreB, pinToLeftChecked: ptleB } =
          await popup.GetPinMenuItemsState(false)
        expect(ptreB).toBe(false)
        expect(ptleB).toBe(false)

        // Check move items states - left is enabled, right is not since we are rightmost
        const { moveToRightEnabled: mtreB, moveToLeftEnabled: mtleB } =
          await popup.GetMoveMenuItemsState(true)
        expect(mtreB).toBe(false)
        expect(mtleB).toBe(true)
      })
    })

    test('Template GridTable - Verify Text Search', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
      const templatesPage = new ClaimsPortalTemplatesPage(global)
      await templatesPage.NavigateToPage()
      const templatesTab = (await templatesPage.SelectTemplateTab(
        TemplateTabTypes.Document
      )) as ClaimsPortalTemplatesDocumentTab
      const gridtable = templatesTab.DataGrid

      if (await gridtable.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentTemplatesGridMessage)
        return
      }

      const initialRowCount = await gridtable.VisibleRowCount()

      // Narrow the templates down to 1 row - keep dialog open
      const popup = await templatesTab.DataGrid.OpenTextSearchPopup(
        DataGrid_Column_Type.Templates_Name
      )
      await popup.SetSearch(templateData.document.existingTemplate, false)
      await templatesTab.page.waitForTimeout(1000)

      const postSearchRowCount = await gridtable.VisibleRowCount()
      if (initialRowCount == 1) {
        expect(postSearchRowCount).toBe(initialRowCount)
      } else {
        expect(postSearchRowCount).toBeLessThan(initialRowCount)
      }

      // clear the search, close the popup and make sure all the rows are back
      await popup.ClearSearch(true)
      const postClearRowCount = await gridtable.VisibleRowCount()
      expect(postClearRowCount).toBe(initialRowCount)
    })

    test('Template GridTable - Verify Date Search', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
      const templatesPage = new ClaimsPortalTemplatesPage(global)
      await templatesPage.NavigateToPage()
      const templatesTab = (await templatesPage.SelectTemplateTab(
        TemplateTabTypes.Document
      )) as ClaimsPortalTemplatesDocumentTab
      const gridtable = templatesTab.DataGrid

      if (await gridtable.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentTemplatesGridMessage)
      }

      const initialRowCount = await gridtable.VisibleRowCount()

      // Narrow the templates down to 1 row - keep dialog open
      const popup = await templatesTab.DataGrid.OpenDateSearchPopup(
        DataGrid_Column_Type.Templates_Created
      )
      await popup.SetSearchDate(templateData.document.existingDate, false)
      await templatesTab.page.waitForTimeout(1000)

      const postSearchRowCount = await gridtable.VisibleRowCount()
      if (initialRowCount == 1) {
        expect(postSearchRowCount).toBe(initialRowCount)
      } else {
        expect(postSearchRowCount).toBeLessThan(initialRowCount)
      }

      // clear the search, close the popup and make sure all the rows are back
      await popup.ClearSearch(true)
      const postClearRowCount = await gridtable.VisibleRowCount()
      expect(postClearRowCount).toBe(initialRowCount)

      // search for documents that are older
      // Change the date search option
      await templatesTab.DataGrid.SetDateSearch(
        templateData.document.olderDate,
        DataGrid_DateSearchOption.DateLesserThan,
        DataGrid_Column_Type.Templates_Created
      )

      const postSecondSearchRowCount = await gridtable.VisibleRowCount()
      expect(postSecondSearchRowCount).toBe(0)

      await templatesTab.DataGrid.ClearDateSearch(DataGrid_Column_Type.Templates_Created, true)
      const postSecondClearRowCount = await gridtable.VisibleRowCount()
      expect(postSecondClearRowCount).toBe(initialRowCount)
    })

    test('Template GridTable - Verify List Search', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
      const templatesPage = new ClaimsPortalTemplatesPage(global)
      await templatesPage.NavigateToPage()
      const templatesTab = (await templatesPage.SelectTemplateTab(
        TemplateTabTypes.Document
      )) as ClaimsPortalTemplatesDocumentTab
      const gridtable = templatesTab.DataGrid

      if (await gridtable.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentTemplatesGridMessage)
        return
      }

      const initialRowCount = await gridtable.VisibleRowCount()

      // Test filtering items choices by text - keep dialog open
      const popup = await templatesTab.DataGrid.OpenListSearchPopup(
        DataGrid_Column_Type.Templates_Carrier
      )

      const initialListItemCount = await popup.SearchResultsCount()

      // check what happens if we search for invalid items
      await popup.SetTextSearch('No Expected Match')
      const emptyResults = await popup.IsSearchResultEmpty()
      expect.soft(emptyResults).toBe(true)

      // check what happens if we search for items with multiple results
      await popup.SetTextSearch(ClaimFilterSelectionOptions_Carrier.Carrier1.slice(0, 13))
      const partialSearchResultsCount = await popup.SearchResultsCount()
      expect.soft(partialSearchResultsCount).toBe(4)

      // make sure clearing search restores the list
      await popup.ClearTextSearch()
      const clearedSearchCount = await popup.SearchResultsCount()
      expect.soft(clearedSearchCount).toBe(initialListItemCount)

      // select an item
      const targetListItem = ClaimFilterSelectionOptions_Carrier.Carrier5
      await popup.SelectListItem(targetListItem, false)
      const isSelected = await popup.IsListItemSelected(targetListItem)
      expect.soft(isSelected).toBe(true)

      // unselect an item
      await popup.UnselectListItem(targetListItem, true)
      const stillSelected = await popup.IsListItemSelected(targetListItem)
      expect.soft(stillSelected).toBe(false)

      // filter on an item
      await templatesTab.SetListSearch(targetListItem, DataGrid_Column_Type.Templates_Carrier)

      const postSearchRowCount = await gridtable.VisibleRowCount()
      expect(postSearchRowCount).toBeLessThan(initialRowCount)

      // clear the filters - close the popup and make sure all the rows are back
      await templatesTab.ClearListSearch(DataGrid_Column_Type.Templates_Carrier, true)
      const postClearRowCount = await gridtable.VisibleRowCount()
      expect(postClearRowCount).toBe(initialRowCount)
    })

    test('Template GridTable - Verify Document Download link', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
      const templatesPage = new ClaimsPortalTemplatesPage(global)
      await templatesPage.NavigateToPage()
      const templatesTab = (await templatesPage.SelectTemplateTab(
        TemplateTabTypes.Document
      )) as ClaimsPortalTemplatesDocumentTab
      const gridtable = templatesTab.DataGrid
      if (await gridtable.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentTemplatesGridMessage)
        return
      }
      const initialRowCount = await gridtable.VisibleRowCount()
      // Narrow the templates down to 1 row - keep dialog open
      const popup = await templatesTab.DataGrid.OpenTextSearchPopup(
        DataGrid_Column_Type.Templates_Name
      )
      await popup.SetSearch(templateData.document.existingTemplate, false)
      // await templatesTab.page.waitForTimeout(1000)
      const postSearchRowCount = await gridtable.VisibleRowCount()
      if (initialRowCount == 1) {
        expect(postSearchRowCount).toBe(initialRowCount)
      } else {
        expect(postSearchRowCount).toBeLessThan(initialRowCount)
      }
      const rowIndex = 0

      // verify download template from download link
      await templatesTab.VerifyDocumentDownload(rowIndex, templateData.document.downloadDocument)
    })

    test('Template GridTable - Verify Action Menu: Copy Template ID', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
      const templatesPage = new ClaimsPortalTemplatesPage(global)
      await templatesPage.NavigateToPage()
      const templatesTab = (await templatesPage.SelectTemplateTab(
        TemplateTabTypes.Document
      )) as ClaimsPortalTemplatesDocumentTab
      const gridtable = templatesTab.DataGrid

      if (await gridtable.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentTemplatesGridMessage)
        return
      }

      // use the first row in the gridtable
      const rowIndex = 0
      await templatesTab.SelectActionMenuItem(
        rowIndex,
        DocumentTemplate_DataGrid_ActionMenuItems.CopyTemplateId
      )
      const copiedID = await templatesTab.GetClipboardText()

      // Verify clipboard contains a 32 character GUID
      expect(copiedID.length).toBe(32)
    })

    test('Template GridTable - Verify Action Menu: Copy Document ID', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
      const templatesPage = new ClaimsPortalTemplatesPage(global)
      await templatesPage.NavigateToPage()
      const templatesTab = (await templatesPage.SelectTemplateTab(
        TemplateTabTypes.Document
      )) as ClaimsPortalTemplatesDocumentTab
      const gridtable = templatesTab.DataGrid

      if (await gridtable.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentTemplatesGridMessage)
        return
      }

      // use the first row in the gridtable
      const rowIndex = 0
      await templatesTab.SelectActionMenuItem(
        rowIndex,
        DocumentTemplate_DataGrid_ActionMenuItems.CopyDocumentId
      )
      const copiedID = await templatesTab.GetClipboardText()

      // Verify clipboard contains document GUID
      expect(copiedID).not.toBe('')
      expect(copiedID.startsWith('corn:documents:document:')).toBe(true)
    })

    test('Create Document Template - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
      const templatesPage = new ClaimsPortalTemplatesPage(global)
      await templatesPage.NavigateToPage()
      const templatesTab = (await templatesPage.SelectTemplateTab(
        TemplateTabTypes.Document
      )) as ClaimsPortalTemplatesDocumentTab

      let createDocumentTemplateDrawer = await templatesTab.OpenCreateDocumentTemplate()

      // Verify drawer heading is "Create Document Template"
      await createDocumentTemplateDrawer.VerifyTitle()
      await expect(createDocumentTemplateDrawer.TextBox_Name.locator).toBeVisible()
      await expect(createDocumentTemplateDrawer.listboxCarrierLocator).toBeVisible()
      await expect(createDocumentTemplateDrawer.Button_SelectFile.locator).toBeVisible()

      // Verify drawer closes with ESC key
      await createDocumentTemplateDrawer.Close(true)
      await expect(createDocumentTemplateDrawer.Title.locator).not.toBeAttached()
      await templatesPage.page.waitForTimeout(1000)

      createDocumentTemplateDrawer = await templatesTab.OpenCreateDocumentTemplate()
      // Verify drawer closes if click on Close
      await createDocumentTemplateDrawer.Button_Close_X.Click()
      await expect(createDocumentTemplateDrawer.Title.locator).not.toBeAttached()
      await templatesPage.page.waitForTimeout(1000)
    })

    test('Create Document Template - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
      const templatesPage = new ClaimsPortalTemplatesPage(global)
      await templatesPage.NavigateToPage()
      const templatesTab = (await templatesPage.SelectTemplateTab(
        TemplateTabTypes.Document
      )) as ClaimsPortalTemplatesDocumentTab

      const createDocumentTemplateDrawer = await templatesTab.OpenCreateDocumentTemplate()

      // Click the Submit button
      await createDocumentTemplateDrawer.Button_Submit.Click()
      await templatesTab.page.waitForTimeout(1000)

      // Verify validation messages for the Name File fields
      expect(await createDocumentTemplateDrawer.ValidateEmptyName()).toBe(true)

      // Verify validation messages for the Carrier/Document File fields
      await createDocumentTemplateDrawer.TextBox_Name.Fill('temp name')
      await createDocumentTemplateDrawer.Button_Submit.Click()
      expect(await createDocumentTemplateDrawer.ValidateNameNoCarrierNoDocument()).toBe(true)

      // Verify validation messages for the Name File field if it was edited but was set to blank
      await createDocumentTemplateDrawer.SetCarrierValue('TECH - Redacted')
      await createDocumentTemplateDrawer.TextBox_Name.Fill('')
      await createDocumentTemplateDrawer.Button_Submit.Click()
      expect(await createDocumentTemplateDrawer.ValidateNameEditedAndEmpty()).toBe(true)

      // Click Cancel to close the drawer
      await createDocumentTemplateDrawer.Button_Cancel.Click()
      await expect(createDocumentTemplateDrawer.Title.locator).not.toBeAttached()
    })

    test('Update Document Template - Verify Drawer UI', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
      const templatesPage = new ClaimsPortalTemplatesPage(global)
      await templatesPage.NavigateToPage()
      const templatesTab = (await templatesPage.SelectTemplateTab(
        TemplateTabTypes.Document
      )) as ClaimsPortalTemplatesDocumentTab
      const gridtable = templatesTab.DataGrid

      if (await gridtable.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentTemplatesGridMessage)
        return
      }

      // pick the first template in the grid and open the update drawer
      let updateDocumentTemplateDrawer = await templatesTab.OpenUpdateDocumentTemplate(0)

      // Verify drawer heading is "Update Document Template"
      await updateDocumentTemplateDrawer.VerifyTitle()
      await expect(updateDocumentTemplateDrawer.TextBox_Name.locator).toBeVisible()
      await expect(updateDocumentTemplateDrawer.listboxCarrierLocator).toBeVisible()
      await expect(updateDocumentTemplateDrawer.TextArea_ReasonForUpdate.locator).toBeVisible()
      await expect(updateDocumentTemplateDrawer.Switch_ReplaceDocument.locator).toBeVisible()
      await expect(updateDocumentTemplateDrawer.Switch_ReplaceDocument.locator).not.toBeChecked()
      await expect(updateDocumentTemplateDrawer.Button_SelectFile.locator).toBeHidden()

      // make sure switch exposes file upload
      await updateDocumentTemplateDrawer.Switch_ReplaceDocument.locator.setChecked(true)
      await expect(updateDocumentTemplateDrawer.Button_SelectFile.locator).toBeVisible()

      // Verify drawer closes with ESC key
      await updateDocumentTemplateDrawer.Close(true)
      await expect(updateDocumentTemplateDrawer.Title.locator).not.toBeAttached()
      await templatesPage.page.waitForTimeout(1000)

      updateDocumentTemplateDrawer = await templatesTab.OpenUpdateDocumentTemplate(0)
      // Verify drawer closes if click on Close
      await updateDocumentTemplateDrawer.Button_Close_X.Click()
      await expect(updateDocumentTemplateDrawer.Title.locator).not.toBeAttached()
      await templatesPage.page.waitForTimeout(1000)
    })

    test('Update Document Template - Validate Drawer', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
      const templatesPage = new ClaimsPortalTemplatesPage(global)
      await templatesPage.NavigateToPage()
      const templatesTab = (await templatesPage.SelectTemplateTab(
        TemplateTabTypes.Document
      )) as ClaimsPortalTemplatesDocumentTab
      const gridtable = templatesTab.DataGrid

      if (await gridtable.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentTemplatesGridMessage)
        return
      }

      // pick the first template in the grid and open the update drawer
      const updateDocumentTemplateDrawer = await templatesTab.OpenUpdateDocumentTemplate(0)

      // Verify validation messages for the Name File field if it was edited but was set to blank
      await updateDocumentTemplateDrawer.TextBox_Name.Fill('')
      await updateDocumentTemplateDrawer.Button_Submit.Click()
      expect(await updateDocumentTemplateDrawer.ValidateNameEditedAndEmpty()).toBe(true)

      // Verify validation message for empty reason
      await updateDocumentTemplateDrawer.TextBox_Name.Fill('some name')
      await updateDocumentTemplateDrawer.TextArea_ReasonForUpdate.locator.clear()
      await updateDocumentTemplateDrawer.Button_Submit.Click()
      expect(await updateDocumentTemplateDrawer.ValidateEmptyReasonField()).toBe(true)

      // Verify validation message for empty document
      await updateDocumentTemplateDrawer.TextArea_ReasonForUpdate.Fill('some reason')
      await updateDocumentTemplateDrawer.Switch_ReplaceDocument.locator.setChecked(true)
      await updateDocumentTemplateDrawer.Button_Submit.Click()
      expect(await updateDocumentTemplateDrawer.ValidateEmptyDocumentField()).toBe(true)

      // Click Cancel to close the drawer
      await updateDocumentTemplateDrawer.Button_Cancel.Click()
      await expect(updateDocumentTemplateDrawer.Title.locator).not.toBeAttached()
    })

    test('Add/Edit/Delete Template', async ({ browser }) => {
      const newTemplateName = `${templatePrefix}${dateSuffix}`
      const editedTemplateName = `${newTemplateName}+EDITED`

      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
      const templatesPage = new ClaimsPortalTemplatesPage(global)
      await templatesPage.NavigateToPage()
      const templatesTab = (await templatesPage.SelectTemplateTab(
        TemplateTabTypes.Document
      )) as ClaimsPortalTemplatesDocumentTab
      const gridtable = templatesTab.DataGrid

      // Remove any existing templates from old tests
      await templatesTab.DeleteOldTestTemplates(templatePrefix)

      // add a new template
      await templatesTab.AddNewTemplate(
        newTemplateName,
        ClaimFilterSelectionOptions_Carrier.Carrier5,
        templateData.document.uploadDocument
      )

      await templatesTab.SetTextSearch(newTemplateName, DataGrid_Column_Type.Templates_Name, true)
      expect(await gridtable.VisibleRowCount()).toBe(1)

      // edit the template
      await templatesTab.UpdateExistingTemplate(
        0,
        editedTemplateName,
        ClaimFilterSelectionOptions_Carrier.Carrier5,
        'Test update of template'
      )

      // make sure it exists and there is only 1
      await templatesTab.SetTextSearch(
        editedTemplateName,
        DataGrid_Column_Type.Templates_Name,
        true
      )
      expect(await gridtable.VisibleRowCount()).toBe(1)

      // delete the test template
      await templatesTab.DeleteExistingTemplate(0)

      if (!(await gridtable.IsEmpty())) {
        await templatesTab.SetTextSearch(
          editedTemplateName,
          DataGrid_Column_Type.Templates_Name,
          true
        )
        // make sure it no longer exists
        expect(await gridtable.VisibleRowCount()).toBe(0)
      }
    })

    test('Verify metadata', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)

      // Verify Admin->Templates page navigation from ClaimsPortalLeftNavBar
      const templatesPage = new ClaimsPortalTemplatesPage(global)
      await templatesPage.NavigateToPage()
      const templatesTab = (await templatesPage.SelectTemplateTab(
        TemplateTabTypes.Document
      )) as ClaimsPortalTemplatesDocumentTab
      const gridtable = templatesTab.DataGrid

      if (await gridtable.IsEmpty()) {
        AbortTest(AbortErrors.EmptyDocumentTemplatesGridMessage)
        return
      }

      const popup = await templatesTab.OpenLastUpdatedMetadata(0)
      const data = await popup.GetMetadata()
      expect(data.length).toBeGreaterThan(0)
      const firstItem = data[0][0]
      expect(firstItem === 'Modified By:' || firstItem === 'Created By:').toBe(true)
      if (firstItem === 'Modified By:') {
        const secondItem = data[1][0]
        expect(secondItem).toBe('Reason:')
      }
    })
  }
)
