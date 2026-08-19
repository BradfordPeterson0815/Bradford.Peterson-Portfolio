import { test as setup } from '@playwright/test'
import * as fs from 'fs'
import path from 'path'
import { userPortal } from '../../environments/env.ceylon.js'
import { cookieType } from '../../library/shared/constants.js'
import {
  DefaultEnvironment,
  NicelyFormedUserPortalAuthOrigins,
} from '../../library/userPortal/userPortalConstants.js'
import { Launch } from '../../library/userPortal/userPortalHelper.js'

const authFile = userPortal.AUTH_STORAGE_PATH
const environment = DefaultEnvironment

setup.use({ storageState: authFile })
setup('AuthenticateUserPortalAsNeeded', async ({ browser }) => {
  await SpikeAuthentication()
  const { global } = await Launch(browser, environment)
  await global.page.waitForTimeout(1000)
  if (global.performedAuthenticationOnLaunch) {
    await global.page.context().storageState({ path: authFile })
  }
  await global.context.close()
})

async function SpikeAuthentication(forceAuthentication = false) {
  const baseUrl = userPortal.BASE_URL
  const simpleBaseUrl = baseUrl.split('/')[2]
  if (!fs.existsSync(authFile)) {
    // create an empty session file so we don't blow up
    const sessionObject = {
      cookies: [],
      origins: NicelyFormedUserPortalAuthOrigins,
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

    if (
      // force claim portal tour ui off, if it is not already off
      authData.origins[0].localStorage[0].name === 'companyClaimPortalTour' &&
      authData.origins[0].localStorage[0].value === 'false'
    ) {
      authData.origins[0].localStorage[0].value = 'true'
      fileIsDirty = true
    }
    if (
      // force job portal tour ui off, if it is not already off
      authData.origins[0].localStorage[2].name === 'companyJobPortalTour' &&
      authData.origins[0].localStorage[2].value === 'false'
    ) {
      authData.origins[0].localStorage[2].value = 'true'
      fileIsDirty = true
    }
    if (fileIsDirty) {
      const jsonString = JSON.stringify(authData, null, 2)
      fs.writeFileSync(authFile, jsonString)
    }
  } catch (error) {
    console.error('Error reading UserPortal session storage JSON file:', error)
  }
}
