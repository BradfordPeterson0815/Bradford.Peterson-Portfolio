import { test as setup } from '@playwright/test'
import * as fs from 'fs'
import path from 'path'
import { delegate, delegatePortalSubcontractor } from '../../environments/env.ceylon.js'
import {
  DefaultEnvironment,
  NicelyFormedDelegateAuthOrigins,
} from '../../library/delegatePortal/delegatePortalConstants.js'
import { LaunchSubcontractor } from '../../library/delegatePortal/delegatePortalLauncher.js'
import { cookieType } from '../../library/shared/constants.js'

const authFile = delegatePortalSubcontractor.AUTH_STORAGE_PATH
const environment = DefaultEnvironment

setup.use({ storageState: authFile })
setup('AuthenticateDelegateSubcontractorAsNeeded', async ({ browser }) => {
  await SpikeAuthentication()
  // launch the Delegate Subcontractor home page
  const { global } = await LaunchSubcontractor(browser, environment)
  await global.page.waitForTimeout(1000)
  if (global.performedAuthenticationOnLaunch) {
    await global.page.context().storageState({ path: authFile })
  }
  await global.context.close()
})

async function SpikeAuthentication(forceAuthentication = false) {
  const baseUrl = delegate.BASE_URL
  const simpleBaseUrl = baseUrl.split('/')[2]
  if (!fs.existsSync(authFile)) {
    // create an empty session file so we don't blow up
    const sessionObject = {
      cookies: [],
      origins: NicelyFormedDelegateAuthOrigins,
    }

    // Check if the directory exists and create it recursively if it doesn't
    const dirname = path.dirname(authFile)
    if (!fs.existsSync(dirname)) {
      // The recursive: true option creates all necessary parent directories
      fs.mkdirSync(dirname, { recursive: true })
    }
    fs.writeFileSync(authFile, JSON.stringify(sessionObject, null, 2))
    return
  }
  let fileIsDirty = false
  try {
    const jsonData = fs.readFileSync(authFile, 'utf-8')
    const authData = JSON.parse(jsonData)
    const cookies = authData.cookies as cookieType[]
    const targetCookie = cookies.find((cookie) => cookie.domain === simpleBaseUrl)
    let needToClearCookies = targetCookie == undefined || forceAuthentication

    // if we are not forcing, check to see if we need to clear cookies based on current time.
    if (!forceAuthentication && targetCookie != undefined) {
      const expirationDate = targetCookie.expires * 1000 // make the cookie expiration date js compliant
      // get current date/time
      const targetDate = new Date().valueOf()
      // if we are 1 hour or less away from expiring, we need to clear...
      needToClearCookies = expirationDate - targetDate < 60000 * 60
    }

    if (needToClearCookies) {
      authData.cookies = [] // clear cookies to force authentication
      fileIsDirty = true
    }
    if (fileIsDirty) {
      const jsonString = JSON.stringify(authData, null, 2)
      fs.writeFileSync(authFile, jsonString)
    }
  } catch (error) {
    console.error('Error reading Delegate session storage JSON file:', error)
  }
}
