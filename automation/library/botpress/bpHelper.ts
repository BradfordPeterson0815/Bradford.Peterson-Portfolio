import { Browser } from '@playwright/test'
import * as fs from 'fs'
import { shared } from '../../environments/env.bp.js'
import { BPCalendar } from './bpCalendar.js'
import {
  BPClients,
  BrowserTypes,
  NicelyFormedBPAuthOrigins,
  PostActions,
  UserTypes,
} from './bpConstants.js'
import { BPFNOLChat } from './bpFNOLChat.js'
import { BPGlobal } from './bpGlobal.js'
import { BPPayload } from './bpPayload.js'
import { BPPolicy } from './bpPolicy.js'
import { TestParameters } from './bpTestParameters.js'
import { BPAuth0LoginDialog } from './dialogs/bpAuth0LoginDialog.js'

let global: BPGlobal
let testParameters: TestParameters
const EmptyPolicyNumber = ''

async function LaunchPrep(global: BPGlobal) {
  global.context = await global.browser.newContext()
  global.context.grantPermissions(['clipboard-read', 'clipboard-write'])
  global.page = await global.context.newPage()
  global.page.setDefaultTimeout(120000)
}

export async function LaunchFNOLChat(
  bpClient: BPClients,
  browser: Browser,
  policy: BPPolicy,
  providePolicy: boolean = true,
  userType: UserTypes
) {
  // make sure we are ready to store session state
  const authFile = shared.AUTH_STORAGE_PATH
  if (!fs.existsSync(authFile)) {
    // create an empty session file so we don't blow up
    const sessionObject = {
      cookies: [],
      origins: NicelyFormedBPAuthOrigins,
    }
    fs.writeFileSync(authFile, JSON.stringify(sessionObject, null, 2))
  }

  global = new BPGlobal(browser, bpClient)
  global.policy = policy
  global.currentUserType = userType
  await LaunchPrep(global)
  global.chat = new BPFNOLChat(global)

  // launch the BP tools page
  await global.page.goto(shared.BOTPRESS_HOMEPAGE_URL)
  await global.page.waitForLoadState()
  await global.page.waitForTimeout(3000)

  // check to see if we are being prompted to login
  const loginDialog = new BPAuth0LoginDialog(global)
  const loginIsPresent = await loginDialog.IsVisible()

  if (loginIsPresent) {
    await loginDialog.Login(shared.ADMIN_EMAIL, shared.ADMIN_PASSWORD)
    await global.page.waitForTimeout(2000) // let the BP tools page load
    await global.page.context().storageState({ path: shared.AUTH_STORAGE_PATH })
  }

  const testPage = await global.chat.SelectBotPressClient(bpClient, true)
  const payload = providePolicy
    ? new BPPayload('FNOL', userType, policy.policyNumber)
    : new BPPayload('FNOL', userType, EmptyPolicyNumber)
  await testPage.WaitForChatFrame()
  await testPage.PostMessageToChat(PostActions.Open, payload)
  global.chat.userParams.policyNumberWasProvided = providePolicy
  return global
}

export async function Shutdown(global: BPGlobal) {
  await global.context.close()
}

export function Initialize(environment: string) {
  testParameters = new TestParameters()
  testParameters.browserType = BrowserTypes.Chromium
  testParameters.environment = environment
  testParameters.runAsHeadless = false
}

export function PostMessage(action: string, payload: BPPayload) {
  return `window.postMessage({ type: "${action}", payload: ${JSON.stringify(payload)} });`
}

export async function SubmitDateToCalendar(lossDate: string | number) {
  const dateTarget = new Date(lossDate)
  const day = dateTarget.getDate()
  const month = dateTarget.getMonth() + 1
  const year = dateTarget.getFullYear()
  const formattedDateEcho = `${month}/${day}/${year}`
  const calendar = new BPCalendar(global)
  const dateWasNotAccepted = await calendar.SubmitDate(
    month.toString(),
    day.toString(),
    year.toString()
  )
  return dateWasNotAccepted ? null : formattedDateEcho
}

export async function Wait(timeInMilliseconds: number = 1000) {
  await global.page.waitForTimeout(timeInMilliseconds)
}

export function RandomTrueFalse() {
  const randomKey = Math.floor(Math.random() * 2)
  return randomKey == 1
}
