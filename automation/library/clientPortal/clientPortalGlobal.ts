import { Browser, BrowserContext, Page } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class ClientPortalGlobal {
  readonly browser: Browser
  readonly environment: string
  page!: Page
  context!: BrowserContext
  username: string
  password: string
  baseUrl: string
  appFolder: string
  testDataFolder: string
  uploadFolder: string

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
    this.appFolder = path.resolve(__dirname, '../..')
    this.testDataFolder = this.appFolder + '\\testdata'
    this.uploadFolder = this.testDataFolder + '\\upload'
  }
}
