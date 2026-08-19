import { Locator } from 'playwright/test'

export class ClaimsPortalCalendarEvent {
  monthDay: string = ''
  month: string | null = null
  day: number = -1
  time: string | null = null
  status: string | null = null
  claimLink: string = ''
  claimLinkLocator: Locator | null = null
  estimator: string = ''
  seeNotesButton: Locator | null = null
  actionsButton: Locator | null = null
  constructor() {}
}
