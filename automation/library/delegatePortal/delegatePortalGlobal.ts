import { Browser, BrowserContext, Page } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
import { DelegateFlavor } from './delegatePortalConstants.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export class DelegatePortalGlobal {
  readonly browser: Browser
  readonly environment: string
  username: string
  friendly: string
  baseUrl: string
  appFolder: string
  testDataFolder: string
  uploadFolder: string
  context!: BrowserContext
  page!: Page
  performedAuthenticationOnLaunch: boolean
  isMobile: boolean
  flavor: DelegateFlavor
  constructor(
    browser: Browser,
    environment: string,
    baseUrl: string,
    username: string,
    friendly: string
  ) {
    this.browser = browser
    this.environment = environment
    this.baseUrl = baseUrl
    this.username = username
    this.friendly = friendly
    this.appFolder = path.resolve(__dirname, '../..')
    this.testDataFolder = this.appFolder + '//testdata' //'\\testdata'
    this.uploadFolder = this.testDataFolder + '//upload' //'\\upload'
    this.performedAuthenticationOnLaunch = false
    this.isMobile = false
    this.flavor = DelegateFlavor.Undefined
  }
}
