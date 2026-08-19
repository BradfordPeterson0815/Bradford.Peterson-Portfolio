import { Browser, BrowserContext, Page } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
import { BotpressEnvironmentType } from '../shared/constants.js'
import { BPClients, UserTypes } from './bpConstants.js'
import { BPFNOLChat } from './bpFNOLChat.js'
import { BPPolicy } from './bpPolicy.js'
import { BPReview } from './bpReview.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class BPGlobal {
  browser: Browser
  environment!: BotpressEnvironmentType
  username!: string
  password!: string
  baseUrl!: string
  context!: BrowserContext
  currentUserType!: UserTypes
  page!: Page
  chat!: BPFNOLChat
  policy!: BPPolicy
  damageReasonDescription!: string
  appFolder: string
  testDataFolder: string
  uploadFolder: string
  damageReasonFold: number
  review: BPReview
  client: BPClients
  constructor(browser: Browser, client: BPClients) {
    this.browser = browser
    this.appFolder = path.resolve(__dirname, '../..')
    this.testDataFolder = this.appFolder + `/testdata/botpress`
    this.uploadFolder = this.testDataFolder + `/upload`
    this.review = new BPReview()
    this.client = client
    this.damageReasonFold = 7 // default
  }
}
