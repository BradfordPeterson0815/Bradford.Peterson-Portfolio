import { ClaimsPortalGlobal } from './claimsPortalGlobal.js'
import { ClaimsPortalGlobalSearch } from './claimsPortalGlobalSearch.js'
import { ClaimsPortalMRUList } from './claimsPortalMRUList.js'
import { ClaimsPortalUserList } from './claimsPortalUserList.js'
import { ClaimsPortalBase } from './pages/claimsPortalBase.js'

export class ClaimsPortalToolbar extends ClaimsPortalBase {
  readonly UserList: ClaimsPortalUserList
  readonly MRUList: ClaimsPortalMRUList
  readonly GlobalSearch: ClaimsPortalGlobalSearch

  constructor(global: ClaimsPortalGlobal) {
    super(global)
    this.UserList = new ClaimsPortalUserList(global)
    this.MRUList = new ClaimsPortalMRUList(global)
    this.GlobalSearch = new ClaimsPortalGlobalSearch(global)
  }
}
