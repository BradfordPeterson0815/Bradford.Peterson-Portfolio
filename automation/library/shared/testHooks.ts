import { test } from '@playwright/test'
import { ErrorOnAbort } from './constants.js'
import * as fs from 'fs'
import { NicelyFormedUserPortalAuthOrigins } from '../userPortal/userPortalConstants.js'
import { NicelyFormedClaimsPortalAuthOrigins } from '../claimsPortal/claimsPortalConstants.js'
import { clientPortal, claimsPortal, userPortal } from '../../environments/env.ceylon.js'
import { NicelyFormedClientPortalAuthOrigins } from '../clientPortal/clientPortalConstants.js'

test.beforeAll(async ({ browserName }, testInfo) => {
  switch (testInfo.project.name) {
    case 'userPortalAuthenticated':
      if (!fs.existsSync(userPortal.AUTH_STORAGE_PATH)) {
        // create an empty UserPortal session file so we don't blow up
        const sessionObject = {
          cookies: [],
          origins: NicelyFormedUserPortalAuthOrigins,
        }
        fs.writeFileSync(userPortal.AUTH_STORAGE_PATH, JSON.stringify(sessionObject, null, 2))
      }
      break
    case 'claims':
      if (!fs.existsSync(claimsPortal.AUTH_STORAGE_PATH)) {
        // create an empty Claims Portal session file so we don't blow up
        const sessionObject = {
          cookies: [],
          origins: NicelyFormedClaimsPortalAuthOrigins,
        }
        fs.writeFileSync(claimsPortal.AUTH_STORAGE_PATH, JSON.stringify(sessionObject, null, 2))
      }
      break
    case 'clientPortal':
      console.log('beforeAll - tests running on: ', browserName)
      if (!fs.existsSync(clientPortal.AUTH_STORAGE_PATH)) {
        // create an empty ClientPortal session file so we don't blow up
        const sessionObject = {
          cookies: [],
          origins: NicelyFormedClientPortalAuthOrigins,
        }
        fs.writeFileSync(clientPortal.AUTH_STORAGE_PATH, JSON.stringify(sessionObject, null, 2))
      }
      break
  }
})

test.beforeEach(async () => {})

test.afterEach(async ({ browser }, testInfo) => {
  const contexts = browser.contexts()
  for (let index = 0; index < contexts.length; index++) {
    await contexts[index].close()
  }
  if (testInfo.annotations.length > 0) {
    if (testInfo.annotations[testInfo.annotations.length - 1].type == ErrorOnAbort) {
      throw new Error(
        `Test [${testInfo.title}] aborted for the following reason: ${testInfo.annotations[0].description}`
      )
    }
  }
})

test.afterAll(async () => {})

export default test
