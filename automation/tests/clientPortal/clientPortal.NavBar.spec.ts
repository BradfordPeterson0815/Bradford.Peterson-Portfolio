import { DefaultEnvironment } from '../../library/clientPortal/clientPortalConstants.js'
import { Launch } from '../../library/clientPortal/clientPortalHelper.js'
import { ClientPortalGlobalRulesPage } from '../../library/clientPortal/pages/clientPortalGlobalRulesPage.js'
import { ClientPortalIncompleteFNOLsPage } from '../../library/clientPortal/pages/clientPortalIncompleteFNOLsPage.js'
import { ClientPortalServiceAreasPage } from '../../library/clientPortal/pages/clientPortalServiceAreasPage.js'
import { ClientPortalVendorsPage } from '../../library/clientPortal/pages/clientPortalVendorsPage.js'
import { ClientPortalWeatherEventsPage } from '../../library/clientPortal/pages/clientPortalWeatherEventsPage.js'
import { Tags } from '../../library/shared/constants.js'
import test from '../../library/shared/testHooks.js'

const environment = DefaultEnvironment

test.describe(
  'Incomplete FNOLs Page',
  {
    tag: [Tags.ClientPortal, Tags.NavBar],
  },
  () => {
    test('Verify LeftNavBar', async ({ browser }) => {
      // launch the ClientPortal home page
      const { global, homePage } = await Launch(browser, environment)

      // Force us to an expanded state
      await homePage.leftNavBar.ForceExpandedState()

      // verify all the Nav Bar button labels
      await homePage.leftNavBar.VerifyNavRootLabels()
      await homePage.VerifyTitle()

      // Verify Service Area page navigation from ClientPortalLeftNavBar
      const serviceAreasPage = new ClientPortalServiceAreasPage(global)
      await serviceAreasPage.NavigateToPage()
      await serviceAreasPage.VerifyTitle()

      // Verify Vendors page navigation from ClientPortalLeftNavBar
      const vendorsPage = new ClientPortalVendorsPage(global)
      await vendorsPage.NavigateToPage()
      await vendorsPage.VerifyTitle()

      // Verify Global Rules page navigation from ClientPortalLeftNavBar
      const globalRulesPage = new ClientPortalGlobalRulesPage(global)
      await globalRulesPage.NavigateToPage()
      await globalRulesPage.VerifyTitle()

      // Verify Incomplete FNOLs page navigation from ClientPortalLeftNavBar
      const incompleteFNOLsPage = new ClientPortalIncompleteFNOLsPage(global)
      await incompleteFNOLsPage.NavigateToPage()
      await incompleteFNOLsPage.VerifyTitle()

      // Verify Weather Events page navigation from ClientPortalLeftNavBar
      const weatherEventsPage = new ClientPortalWeatherEventsPage(global)
      await weatherEventsPage.NavigateToPage()
      await weatherEventsPage.VerifyTitle()

      // verify all the ClientPortalLeftNavBar User menu labels
      await homePage.leftNavBar.VerifyUserMenuLabels()

      // verify ClientPortalLeftNavBar User expand/collapse functionality
      await homePage.leftNavBar.VerifyCollapseAndExpand()
    })
  }
)
