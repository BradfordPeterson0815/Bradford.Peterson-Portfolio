import { Browser, BrowserContext, Page } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class ClaimsPortalGlobal {
  readonly browser: Browser
  readonly environment: string
  username: string
  password: string
  baseUrl: string
  appFolder: string
  testDataFolder: string
  uploadFolder: string
  context!: BrowserContext
  page!: Page
  performedAuthenticationOnLaunch: boolean

  constructor(
    browser: Browser,
    environment: string,
    baseUrl: string,
    username: string,
    password: string
  ) {
    this.browser = browser
    this.environment = environment
    this.baseUrl = baseUrl
    this.username = username
    this.password = password
    this.performedAuthenticationOnLaunch = false
    this.appFolder = path.resolve(__dirname, '../..')
    this.testDataFolder = this.appFolder + '//testdata' //'\\testdata'
    this.uploadFolder = this.testDataFolder + '//upload' //'\\upload'
  }
}
