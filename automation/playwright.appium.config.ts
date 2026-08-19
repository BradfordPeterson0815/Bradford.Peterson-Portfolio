import { PlaywrightTestConfig } from '@playwright/test'
import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { AppiumEnvironmentType } from './library/shared/constants.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Figure out where to get our envs from
const workingEnv = process.env.ENVIRONMENT ?? AppiumEnvironmentType.Company_Release
const enivronmentInfo = workingEnv.split('_')
const resolvedPath = path.resolve(
  __dirname,
  `./environments/${enivronmentInfo[0]}/.env.appium.${enivronmentInfo[1]}`
)
console.log(`Appium Config - setting ENVIRONMENT to [${workingEnv}] from ${resolvedPath}`)
config({ path: resolvedPath })

// default configuration for appium tests
const appiumConfig: PlaywrightTestConfig = {
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? Number.parseInt(process.env.CI) : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  // Each test is given 4 minutes (120000) milliseconds.
  timeout: 240000,

  projects: [
    // define appium projects
    {
      name: 'appium',
      testMatch: '*tests/appium/appium.*.spec.ts',
    },
  ],
}

export default appiumConfig
