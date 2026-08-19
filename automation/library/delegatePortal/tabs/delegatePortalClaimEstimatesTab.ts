import { DelegatePortalBasePage } from '../pages/delegatePortalBasePage.js'
import { DelegatePortalClaim } from '../delegatePortalClaim.js'
import { DelegatePortalGlobal } from '../delegatePortalGlobal.js'
import { DelegatePortalDataTable } from '../delegatePortalDataTable.js'
import { Element } from '../../shared/element.js'
import { ClaimEstimatesTabStrings } from '../delegatePortalConstants.js'

export class DelegatePortalClaimEstimatesTab extends DelegatePortalBasePage {
  readonly claim: DelegatePortalClaim
  readonly URL: string
  readonly Title_Estimates: Element
  readonly DataTable_Estimates: DelegatePortalDataTable

  constructor(global: DelegatePortalGlobal, claim: DelegatePortalClaim, claimPageURL: string) {
    super(global)
    this.claim = claim
    this.URL = `${claimPageURL}/estimates`
    this.Title_Estimates = new Element(
      global.page,
      this.page.getByRole('heading', {
        name: `${ClaimEstimatesTabStrings.Title_Estimates}`,
        exact: true,
      }),
      ClaimEstimatesTabStrings.Title_Estimates
    )
    this.DataTable_Estimates = new DelegatePortalDataTable(
      global,
      `#root div:nth-child(1 of div[id^="card"]) > div[id$="_content"]`,
      1,
      ClaimEstimatesTabStrings.ActionMenu,
      ClaimEstimatesTabStrings.ActionMenuAria
    )
  }

  async CustomLoad() {
    await super.CustomLoad()
    await this.DataTable_Estimates.WaitForRowsToLoad()
  }
}
