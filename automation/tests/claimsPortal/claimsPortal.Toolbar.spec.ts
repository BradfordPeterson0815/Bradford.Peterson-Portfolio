import test from '../../library/shared/testHooks.js'
import { ClaimsPortalHomePage } from '../../library/claimsPortal/pages/claimsPortalHomePage.js'
import { Launch } from '../../library/claimsPortal/claimsPortalHelper.js'
import { DefaultEnvironment } from '../../library/claimsPortal/claimsPortalConstants.js'
import { Tags } from '../../library/shared/constants.js'

const environment = DefaultEnvironment

test.describe(
  'Toolbar',
  {
    tag: [Tags.ClaimsPortal, Tags.Toolbar],
  },
  () => {
    test('Verify Current User List', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)

      // Verify the users list
      const allUsersList = await homePage.toolbar.UserList.CurrentUserList()
      const allUsersCount = await homePage.toolbar.UserList.CurrentUserCount()
      console.log(`Current User List count is: ${allUsersCount}`)
      console.log(`Current Users are: ${allUsersList}`)
      // At least 1 person should be logged in - the current test user
      await homePage.toolbar.UserList.VerifyCurrentUserExists('test_a@test.company.com')
    })

    test('Verify MRU List', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.CustomLoad()

      const isListEmpty = await homePage.toolbar.MRUList.IsListEmpty()
      // const mruCounterValue = await homePage.toolbar.MRUList.ButtonCounterValue()
      // const mruActualCount = await homePage.toolbar.MRUList.ItemsCount()
      // const mruItemsList = await homePage.toolbar.MRUList.Items()
      if (!isListEmpty) {
        await homePage.toolbar.MRUList.SelectItemByIndex(0)
      }
    })

    test('Verify Search', async ({ browser }) => {
      // launch the Claims Portal home page
      const { global } = await Launch(browser, environment)
      const homePage = new ClaimsPortalHomePage(global)
      await homePage.CustomLoad()

      await homePage.toolbar.GlobalSearch.OpenSearch()

      // Check if search list is empty
      // const isGlobalSearchEmpty = await homePage.toolbar.GlobalSearch.IsListEmpty()
      // const itemsNoInput = await homePage.toolbar.GlobalSearch.Items()

      // Verify search can be cancelled
      await homePage.toolbar.GlobalSearch.CancelSearch()

      // Verify search for term
      await homePage.toolbar.GlobalSearch.OpenAndSearchFor('A')
      // const itemCountForInputA = await homePage.toolbar.GlobalSearch.ItemsCount()
      // const itemsForInputA = await homePage.toolbar.GlobalSearch.Items()
      await homePage.toolbar.GlobalSearch.CancelSearch()

      // Verify search and selection
      await homePage.toolbar.GlobalSearch.SearchAndSelectItemByIndex('tag', 0)
    })
  }
)
