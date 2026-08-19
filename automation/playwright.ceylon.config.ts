import { PlaywrightTestConfig, devices } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import { config } from 'dotenv'
import { CeylonEnvironmentType } from './library/shared/constants.js'
import {
  clientPortal,
  claimsPortal,
  delegatePortalFieldAgent,
  delegatePortalFieldTech,
  delegatePortalInspectionTech,
  delegatePortalSubcontractor,
  userPortal,
} from './environments/env.ceylon.js'

// Figure out where to get our envs from
// if ENVIRONMENT is passed in, we know which one to use. If none is passed, we are testing in VS Code so pick a default
const workingEnv = process.env.ENVIRONMENT ?? CeylonEnvironmentType.Company_QA
const enivronmentInfo = workingEnv.split('_')
const resolvedPath = path.resolve(
  __dirname,
  `./environments/${enivronmentInfo[0]}/.env.ceylon.${enivronmentInfo[1]}`
)
console.log(`Ceylon Config - setting ENVIRONMENT to [${workingEnv}]  from ${resolvedPath}`)
config({ path: resolvedPath })

// default configuration for ceylon tests
const ceylonConfig: PlaywrightTestConfig = {
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? Number.parseInt(process.env.CI) : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 110000,
  reporter: 'html',
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1920, height: 1080 },
    channel: 'chromium',
    permissions: ['clipboard-read'],
    trace: 'retain-on-first-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    // define a userPortal setup project
    {
      name: 'userPortalSetup',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        channel: 'chromium',
        headless: true,
      },
      testMatch: /.*\.userPortal.setup\.ts/,
    },
    // define userPortal test project
    {
      name: 'userPortalAuthenticated',
      testMatch: '*tests/userPortal/userPortal.*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        channel: 'chromium',
        headless: true,
        storageState: userPortal.AUTH_STORAGE_PATH,
      },
      // declare that the `userPortalSetup` project is a dependency
      dependencies: ['userPortalSetup'],
    },
    // define a delegate portal subcontractor setup project
    {
      name: 'delegatePortalSubcontractorSetup',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        channel: 'chromium',
        headless: true,
      },
      testMatch: /.*\.delegatePortal.sub.setup\.ts/,
    },
    // define delegate portal subcontractor test project
    {
      name: 'delegatePortalSubcontractorAuthenticated',
      testMatch: '*tests/delegatePortal/sub/delegatePortal.sub.*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        channel: 'chromium',
        headless: true,
        storageState: delegatePortalSubcontractor.AUTH_STORAGE_PATH,
      },
      // declare that the `delegatePortalSubcontractorSetup` project is a dependency
      dependencies: ['delegatePortalSubcontractorSetup'],
    },
    // define a delegate portal field agent setup project
    {
      name: 'delegatePortalFieldAgentSetup',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        channel: 'chromium',
        headless: true,
      },
      testMatch: /.*\.delegatePortal.fa.setup\.ts/,
    },
    // define delegate portal field agent test project
    {
      name: 'delegatePortalFieldAgentAuthenticated',
      testMatch: '*tests/delegatePortal/fa/delegatePortal.fa.*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        channel: 'chromium',
        headless: true,
        storageState: delegatePortalFieldAgent.AUTH_STORAGE_PATH,
      },
      // declare that the `delegatePortalFieldAgentSetup` project is a dependency
      dependencies: ['delegatePortalFieldAgentSetup'],
    },
    // define a delegate portal field tech setup project
    {
      name: 'delegatePortalFieldTechSetup',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        channel: 'chromium',
        headless: true,
      },
      testMatch: /.*\.delegatePortal.ft.setup\.ts/,
    },
    // define delegate portal field tech test project
    {
      name: 'delegatePortalFieldTechAuthenticated',
      testMatch: '*tests/delegatePortal/ft/delegatePortal.ft.*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        channel: 'chromium',
        headless: true,
        storageState: delegatePortalFieldTech.AUTH_STORAGE_PATH,
      },
      // declare that the `delegatePortalFieldTechSetup` project is a dependency
      dependencies: ['delegatePortalFieldTechSetup'],
    },
    // define a delegate portal inspection tech setup project
    {
      name: 'delegatePortalInspectionTechSetup',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        channel: 'chromium',
        headless: true,
      },
      testMatch: /.*\.delegatePortal.it.setup\.ts/,
    },
    // define delegate portal inspection tech test project
    {
      name: 'delegatePortalInspectionTechAuthenticated',
      testMatch: '*tests/delegatePortal/it/delegatePortal.it.*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        channel: 'chromium',
        headless: true,
        storageState: delegatePortalInspectionTech.AUTH_STORAGE_PATH,
      },
      // declare that the `delegatePortalInspectionTechSetup` project is a dependency
      dependencies: ['delegatePortalInspectionTechSetup'],
    },
    // define a claims setup project
    {
      name: 'claimsPortalSetup',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        channel: 'chromium',
        headless: true,
      },
      testMatch: /.*\.claimsPortal.setup\.ts/,
    },
    // define claims portal test project
    {
      name: 'claimsPortal',
      testMatch: '*tests/claimsPortal/claimsPortal.*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        channel: 'chromium',
        headless: true,
        storageState: claimsPortal.AUTH_STORAGE_PATH,
      },
      // declare that the `claimsPortalSetup` project is a dependency
      dependencies: ['claimsPortalSetup'],
    },
    // define clientPortal test project
    {
      name: 'clientPortal',
      testMatch: '*tests/clientPortal/clientPortal.*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        channel: 'chromium',
        headless: true,
        storageState: clientPortal.AUTH_STORAGE_PATH,
      },
    },
  ],
}

export default ceylonConfig
