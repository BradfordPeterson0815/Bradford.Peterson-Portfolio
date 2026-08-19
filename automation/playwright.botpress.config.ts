import { PlaywrightTestConfig, devices } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import { config } from 'dotenv'
import { BotpressEnvironmentType } from './library/shared/constants.js'
import { shared } from './environments/env.bp.js'

// Figure out where to get our envs from
const workingEnv = process.env.ENVIRONMENT ?? BotpressEnvironmentType.Development
console.log('BP Config - setting ENVIRONMENT: ', workingEnv)
const resolvedPath = path.resolve(__dirname, `./environments/.env.bp.${workingEnv}`)
config({ path: resolvedPath })

// default configuration for botpress tests
const botpressConfig: PlaywrightTestConfig = {
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? Number.parseInt(process.env.CI) : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    permissions: ['clipboard-read'],
    trace: 'on-first-retry',
    headless: true,
  },

  // Each test is given 2 minutes (120000) milliseconds.
  timeout: 120000,

  /* Configure projects for major browsers */
  projects: [
    // define botpress test projects
    {
      name: 'bp patriot select',
      testMatch: '*tests/botpress/patriot/bp.patriot.*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        headless: true,
        storageState: shared.AUTH_STORAGE_PATH,
      },
    },
    {
      name: 'bp singer',
      testMatch: '*tests/botpress/singer/bp.singer.*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        headless: true,
        storageState: shared.AUTH_STORAGE_PATH,
      },
    },
  ],
}

export default botpressConfig
