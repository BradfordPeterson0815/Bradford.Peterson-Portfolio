import { test } from '@playwright/test'
import * as fs from 'fs'
import { shared } from '../../environments/env.bp.js'
import { NicelyFormedBPAuthOrigins } from './bpConstants.js'

test.beforeAll(async ({ browserName }, testInfo) => {
  console.debug('beforeAll - tests running on: ', browserName)
  switch (testInfo.project.name) {
    case 'bp eagle':
      if (!fs.existsSync(shared.AUTH_STORAGE_PATH)) {
        // create an empty UserPortal session file so we don't blow up
        const sessionObject = {
          cookies: [],
          origins: NicelyFormedBPAuthOrigins,
        }
        fs.writeFileSync(shared.AUTH_STORAGE_PATH, JSON.stringify(sessionObject, null, 2))
      }
      break
  }
})

export default test
