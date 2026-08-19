import { Locator } from 'playwright/test'

export class ClaimsPortalCalendarAppointment {
  monthDay: string = ''
  month: string | null = null
  day: number = -1
  time: string | null = null
  type: string | null = null
  channel: string | null = null
  isCompleted: boolean = false
  completeButton: Locator | null = null
  seeParticipantsButton: Locator | null = null
  seeDescriptionButton: Locator | null = null
  seeNotesButton: Locator | null = null
  constructor() {}
}
