import { Browser as WebBrowser } from '@playwright/test'
import { Browser as NativeBrowser } from 'webdriverio'

export class InspectionsGlobal {
  readonly webBrowser: WebBrowser
  readonly nativeBrowser: NativeBrowser
  performedAuthenticationOnLaunch: boolean
  constructor(webBrowser: WebBrowser, nativeBrowser: NativeBrowser) {
    this.webBrowser = webBrowser

    this.nativeBrowser = nativeBrowser
    this.performedAuthenticationOnLaunch = false
  }
}
