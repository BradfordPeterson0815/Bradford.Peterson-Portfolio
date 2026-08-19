import { Locator } from 'playwright/test'
import { Element } from '../../shared/element.js'
import {
  LabelPosition,
  PhotoReportTabStrings,
  PhotoReport_ActionMenuItems,
} from '../delegatePortalConstants.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalPhotoReportCard } from '../delegatePortalPhotoReportCard.js'
import { DelegatePortalPhotoReportGroup } from '../delegatePortalPhotoReportGroup.js'
import { DelegatePortalAddPhotoReportGroupDialog } from '../dialogs/delegatePortalAddPhotoReportGroupDialog.js'
import { DelegatePortalPhotoReportSortOrderDialog } from '../dialogs/delegatePortalPhotoReportSortOrderDialog.js'
import { DelegatePortalAddRemovedPhotosDrawer } from '../drawers/delegatePortalAddRemovedPhotosDrawer.js'
import { DelegatePortalBasePage } from '../pages/delegatePortalBasePage.js'

export class DelegatePortalPhotoReportTab extends DelegatePortalBasePage {
  readonly Label_Guide_Title: Element
  readonly Label_Guide_Description: Element
  readonly Link_DownloadLastPhotoReport: Element
  readonly Button_SubmitPhotoReport: Element
  readonly Button_ActionMenu: Element
  readonly Button_ShowGuide: Element
  readonly Button_SortOrder: Element
  readonly Button_AddGroup: Element
  readonly Button_DeselectAll: Element
  readonly Button_CollapsePhotos: Element
  readonly Button_CollapseGroups: Element
  readonly Button_ExpandPhotos: Element
  readonly Button_ExpandGroups: Element
  readonly parent: Locator

  constructor(global: DelegatePortalGlobal, targetURL: string) {
    super(global)
    this.URL = `${global.baseUrl}${targetURL}/photo-report`
    this.parent = this.page.locator(`div[id^="page"][id*="body"] > div.chakra-stack`)
    this.Button_SubmitPhotoReport = new Element(
      global.page,
      this.parent.getByRole('button', {
        name: PhotoReportTabStrings.Button_SubmitPhotoReport,
        exact: true,
      }),
      PhotoReportTabStrings.Button_SubmitPhotoReport
    )
    this.Label_Guide_Title = new Element(
      global.page,
      this.parent.locator(
        'div[data-status="info"] div[data-status="info"][class*="chakra-alert__title"]'
      ),
      PhotoReportTabStrings.Label_PhotoReportGuide_Title
    )
    this.Label_Guide_Description = new Element(
      global.page,
      this.parent.locator(
        'div[data-status="info"] div[data-status="info"][class*="chakra-alert__desc"]'
      ),
      PhotoReportTabStrings.Label_PhotoReportGuide_Description
    )
    this.Link_DownloadLastPhotoReport = new Element(
      global.page,
      this.parent.getByRole('link', {
        name: PhotoReportTabStrings.Link_DownloadLastPhotoReport,
        exact: true,
      }),
      PhotoReportTabStrings.Link_DownloadLastPhotoReport
    )
    this.Button_ActionMenu = new Element(
      global.page,
      this.parent.locator('button[aria-label="Open menu"]')
    )
    this.Button_ShowGuide = new Element(
      global.page,
      this.parent.locator('button[aria-label="Show instructions"]')
    )
    this.Button_SortOrder = new Element(
      global.page,
      this.parent.locator('button[aria-label="Toggle sorting menu"]')
    )
    this.Button_AddGroup = new Element(
      global.page,
      this.parent.getByRole('button', {
        name: PhotoReportTabStrings.Button_AddGroup,
        exact: true,
      }),
      PhotoReportTabStrings.Button_AddGroup
    )
    this.Button_DeselectAll = new Element(
      global.page,
      this.parent.getByRole('button', {
        name: PhotoReportTabStrings.Button_DeselectAll,
        exact: true,
      }),
      PhotoReportTabStrings.Button_DeselectAll
    )
    this.Button_ExpandPhotos = new Element(
      global.page,
      this.parent.getByRole('button', {
        name: PhotoReportTabStrings.Button_ExpandPhotos,
        exact: true,
      }),
      PhotoReportTabStrings.Button_ExpandPhotos
    )
    this.Button_ExpandGroups = new Element(
      global.page,
      this.parent.getByRole('button', {
        name: PhotoReportTabStrings.Button_ExpandGroups,
        exact: true,
      }),
      PhotoReportTabStrings.Button_ExpandGroups
    )
    this.Button_CollapsePhotos = new Element(
      global.page,
      this.parent.getByRole('button', {
        name: PhotoReportTabStrings.Button_CollapsePhotos,
        exact: true,
      }),
      PhotoReportTabStrings.Button_CollapsePhotos
    )
    this.Button_CollapseGroups = new Element(
      global.page,
      this.parent.getByRole('button', {
        name: PhotoReportTabStrings.Button_CollapseGroups,
        exact: true,
      }),
      PhotoReportTabStrings.Button_CollapseGroups
    )
  }

  async NavigateDirectly(): Promise<void> {
    await super.NavigateDirectly(this.URL)
    await this.WaitForLoad()
    await this.Button_SubmitPhotoReport.locator.waitFor({ state: 'visible' })
    await this.HideGuide()
  }

  async IsGuideVisible() {
    const guideIsShowing = (await this.Label_Guide_Title.locator.count()) > 0
    return guideIsShowing
  }

  async ShowGuide() {
    if (!(await this.IsGuideVisible())) {
      await this.Button_ShowGuide.Click()
    }
  }

  async HideGuide() {
    if (await this.IsGuideVisible()) {
      await this.page.waitForTimeout(1000)
      await this.Button_ShowGuide.Click()
      await this.page.waitForTimeout(1000)
    }
  }

  async IsActionMenuItemVisible(actionMenuItem: PhotoReport_ActionMenuItems) {
    await this.Button_ActionMenu.Click()
    await this.page.waitForTimeout(1000)
    const assembledLocator = this.page.getByRole('menuitem', { name: `${actionMenuItem}` })
    const visibility = await assembledLocator.isVisible()
    await this.parent.click()
    await this.page.waitForTimeout(1000)
    return visibility
  }

  async IsActionMenuItemEnabled(actionMenuItem: PhotoReport_ActionMenuItems) {
    await this.Button_ActionMenu.Click()
    await this.page.waitForTimeout(1000)
    const assembledLocator = this.page.getByRole('menuitem', { name: `${actionMenuItem}` })
    const visibility = await assembledLocator.isVisible()
    const enabled = await assembledLocator.isEnabled()
    await this.parent.click()
    await this.page.waitForTimeout(1000)
    return visibility && enabled
  }

  async SelectActionMenuItem(actionMenuItem: PhotoReport_ActionMenuItems) {
    await this.Button_ActionMenu.Click()
    await this.page.waitForTimeout(500)
    const assembledLocator = this.page.getByRole('menuitem', { name: `${actionMenuItem}` })
    await assembledLocator.click()
  }

  async FetchGroupCount() {
    const count = await this.parent.locator('div.chakra-card__header').count()
    return count
  }

  async FetchGroupByIndex(index: number) {
    const group = new DelegatePortalPhotoReportGroup(this.global, this.parent, index)
    return group
  }

  async FetchGroupByLabel(targetLabel: string) {
    const groupCount = await this.FetchGroupCount()
    for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
      const group = await this.FetchGroupByIndex(groupIndex)
      if ((await group.label.textContent()) == targetLabel) {
        return { group: group, index: groupIndex }
      }
    }
    throw new Error(`No group found with a label of: ${targetLabel}`)
  }

  async FetchCurrentGroupLabels() {
    const labels: Array<string> = []
    const groupCount = await this.FetchGroupCount()
    for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
      const group = await this.FetchGroupByIndex(groupIndex)
      const groupLabel = await group.label.textContent()
      labels.push(groupLabel != null ? groupLabel : '')
    }
    return labels
  }

  async DeleteOldTestGroups(groupPrefix: string) {
    if ((await this.FetchGroupCount()) > 0) {
      let groupsNotClear = false
      do {
        const groupCount = await this.FetchGroupCount()
        for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
          const group = await this.FetchGroupByIndex(groupIndex)
          const actualGroupLabel = await group.label.textContent()
          if (actualGroupLabel?.startsWith(groupPrefix)) {
            const group = await this.FetchGroupByIndex(groupIndex)
            await group.Delete()
            groupsNotClear = true
          }
        }
      } while (groupsNotClear)
    }
  }

  async OpenAddGroupDialog() {
    await this.Button_AddGroup.Click()
    const addGroupDialog = new DelegatePortalAddPhotoReportGroupDialog(this.global)
    return addGroupDialog
  }

  async AddGroup(newGroupLabel: string, position: LabelPosition = LabelPosition.Start) {
    const addGroupDialog = await this.OpenAddGroupDialog()
    if (position == LabelPosition.Start) {
      await addGroupDialog.radioButton_Start.click()
    } else {
      await addGroupDialog.radioButton_End.click()
    }
    await addGroupDialog.SetLabelValue(newGroupLabel)
    await addGroupDialog.Button_Submit.Click()
    return this.FetchGroupByIndex(0)
  }

  async DeleteGroup(groupToDelete: string) {
    const groupCount = await this.FetchGroupCount()
    if (groupCount > 0) {
      for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
        const group = await this.FetchGroupByIndex(groupIndex)
        const actualGroupLabel = await group.label.textContent()
        if (actualGroupLabel == groupToDelete) {
          const group = await this.FetchGroupByIndex(groupIndex)
          await group.Delete()
          return
        }
      }
    }
    throw new Error(`No group found with a label of: ${groupToDelete}`)
  }

  async DragGroup(
    groupToDrag: DelegatePortalPhotoReportGroup,
    groupToDropOn: DelegatePortalPhotoReportGroup,
    offset: number = 0
  ) {
    await groupToDrag.button_DragHandle.dragTo(groupToDropOn.boundary, {
      targetPosition: { x: 0, y: offset },
      force: true,
    })
  }

  async DragCardSelection(
    cardsToDrag: DelegatePortalPhotoReportCard[],
    groupOrCardToDropOn: DelegatePortalPhotoReportGroup | DelegatePortalPhotoReportCard,
    offset: number = 0
  ) {
    if (cardsToDrag.length == 0) throw new Error('Cannot drag an empty card set')
    if (cardsToDrag.length > 1) {
      for (let cardIndex = 0; cardIndex < cardsToDrag.length; cardIndex++) {
        await cardsToDrag[cardIndex].checkbox_Select.setChecked(true)
        await this.page.waitForTimeout(1000)
      }
    }
    //await this.page.screenshot({ path: 'beforeDrag.png' })
    await cardsToDrag[0].button_DragHandle.dragTo(groupOrCardToDropOn.boundary, {
      targetPosition: { x: 0, y: offset },
      force: true,
    })
  }

  async OpenSortOrderDialog() {
    await this.Button_SortOrder.Click()
    const sortOrderDialog = new DelegatePortalPhotoReportSortOrderDialog(this.global)
    return sortOrderDialog
  }

  async OpenAddRemovedPhotosDrawer() {
    await this.SelectActionMenuItem(PhotoReport_ActionMenuItems.ReaddPhotos)
    const addRemovedPhotosDrawer = new DelegatePortalAddRemovedPhotosDrawer(this.global)
    return addRemovedPhotosDrawer
  }
}
