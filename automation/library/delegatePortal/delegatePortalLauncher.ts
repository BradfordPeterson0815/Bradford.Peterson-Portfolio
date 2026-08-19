import { Browser, devices } from 'playwright/test'
import MailosaurClient from 'mailosaur'
import {
  delegate,
  delegatePortalFieldAgent,
  delegatePortalFieldTech,
  delegatePortalInspectionTech,
  delegatePortalSubcontractor,
  shared,
} from '../../environments/env.ceylon.js'
import { DelegatePortalGlobal } from './delegatePortalGlobal.js'
import { DelegatePortalAuth0LoginPage } from './pages/delegatePortalAuth0LoginPage.js'
import { DelegatePortalYourAssignedJobsPage } from './pages/delegatePortalYourAssignedJobsPage.js'
import { DelegateFlavor, MobileDevices } from './delegatePortalConstants.js'
import { DelegatePortalYourAssignedClaimsPage } from './pages/delegatePortalYourAssignedClaimsPage.js'
import { DelegatePortalYourAssignedClaimsPageMobile } from './pages/delegatePortalYourAssignedClaimsPageMobile.js'
import { NetworkSpeedConfig, NetworkSpeedType } from '../shared/constants.js'
import { DelegatePortalLoginPage } from './pages/delegatePortalLoginPage.js'

export async function LaunchSubcontractor(
  browser: Browser,
  environment: string,
  network: NetworkSpeedType = NetworkSpeedType.NoThrottle,
  email = delegatePortalSubcontractor.USER_EMAIL,
  friendly = delegatePortalSubcontractor.USER_FRIENDLY
) {
  const global = new DelegatePortalGlobal(browser, environment, delegate.BASE_URL, email, friendly)
  global.context = await global.browser.newContext({ acceptDownloads: true })
  global.context.grantPermissions(['clipboard-read', 'clipboard-write'])
  global.page = await global.context.newPage()
  global.flavor = DelegateFlavor.Subcontractor
  global.performedAuthenticationOnLaunch = await LoginAndAuthenticateAsNeeded(global, email)
  const homePage = new DelegatePortalYourAssignedJobsPage(global)
  await homePage.page.waitForLoadState('domcontentloaded')
  if (network != NetworkSpeedType.NoThrottle) {
    const cdpSession = await global.context.newCDPSession(global.page)
    switch (network) {
      case NetworkSpeedType.Good2G:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.Good2G)
        break
      case NetworkSpeedType.SuperSlow:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.SuperSlow)
        break
      case NetworkSpeedType.WiFi:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.WiFi)
        break
    }
    await cdpSession.detach()
  }
  return { global, homePage }
}

export async function LaunchFieldTech(
  browser: Browser,
  environment: string,
  network: NetworkSpeedType = NetworkSpeedType.NoThrottle,
  email = delegatePortalFieldTech.USER_EMAIL,
  friendly = delegatePortalFieldTech.USER_FRIENDLY
) {
  const global = new DelegatePortalGlobal(browser, environment, delegate.BASE_URL, email, friendly)
  global.context = await global.browser.newContext({ acceptDownloads: true })
  global.context.grantPermissions(['clipboard-read', 'clipboard-write'])
  global.page = await global.context.newPage()
  global.flavor = DelegateFlavor.FieldTech
  global.performedAuthenticationOnLaunch = await LoginAndAuthenticateAsNeeded(global, email)
  const homePage = new DelegatePortalYourAssignedJobsPage(global)
  await homePage.page.waitForLoadState('domcontentloaded')
  if (network != NetworkSpeedType.NoThrottle) {
    const cdpSession = await global.context.newCDPSession(global.page)
    switch (network) {
      case NetworkSpeedType.Good2G:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.Good2G)
        break
      case NetworkSpeedType.SuperSlow:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.SuperSlow)
        break
      case NetworkSpeedType.WiFi:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.WiFi)
        break
    }
    await cdpSession.detach()
  }
  return { global, homePage }
}

export async function LaunchFieldAgent(
  browser: Browser,
  environment: string,
  network: NetworkSpeedType = NetworkSpeedType.NoThrottle,
  email = delegatePortalFieldAgent.USER_EMAIL,
  friendly = delegatePortalFieldAgent.USER_FRIENDLY
) {
  const global = new DelegatePortalGlobal(browser, environment, delegate.BASE_URL, email, friendly)
  global.context = await global.browser.newContext({ acceptDownloads: true })
  global.context.grantPermissions(['clipboard-read', 'clipboard-write'])
  global.page = await global.context.newPage()
  global.flavor = DelegateFlavor.FieldAgent
  global.performedAuthenticationOnLaunch = await LoginAndAuthenticateAsNeeded(global, email)
  const homePage = new DelegatePortalYourAssignedClaimsPage(global)
  await homePage.WaitForLoad()
  await homePage.CustomLoad()
  if (network != NetworkSpeedType.NoThrottle) {
    const cdpSession = await global.context.newCDPSession(global.page)
    switch (network) {
      case NetworkSpeedType.Good2G:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.Good2G)
        break
      case NetworkSpeedType.SuperSlow:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.SuperSlow)
        break
      case NetworkSpeedType.WiFi:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.WiFi)
        break
    }
    await cdpSession.detach()
  }
  return { global, homePage }
}

export async function LaunchFieldAgentMobile(
  browser: Browser,
  environment: string,
  device: MobileDevices = MobileDevices.iPhone_14_Pro_Max,
  network: NetworkSpeedType = NetworkSpeedType.NoThrottle,
  email = delegatePortalFieldAgent.USER_EMAIL,
  friendly = delegatePortalFieldAgent.USER_FRIENDLY
) {
  const emulatedDevice = devices[`${device}`]
  const global = new DelegatePortalGlobal(browser, environment, delegate.BASE_URL, email, friendly)
  global.context = await global.browser.newContext({ acceptDownloads: true })
  global.context.grantPermissions(['clipboard-read', 'clipboard-write'])
  global.page = await global.browser.newPage({ ...emulatedDevice })
  global.flavor = DelegateFlavor.FieldAgent
  global.isMobile = true
  global.performedAuthenticationOnLaunch = await LoginAndAuthenticateAsNeeded(global, email)
  const homePage = new DelegatePortalYourAssignedClaimsPageMobile(global)
  await homePage.WaitForLoad()
  if (network != NetworkSpeedType.NoThrottle) {
    const cdpSession = await global.context.newCDPSession(global.page)
    switch (network) {
      case NetworkSpeedType.Good2G:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.Good2G)
        break
      case NetworkSpeedType.SuperSlow:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.SuperSlow)
        break
      case NetworkSpeedType.WiFi:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.WiFi)
        break
    }
    await cdpSession.detach()
  }
  return { global, homePage }
}

export async function LaunchInspectionTech(
  browser: Browser,
  environment: string,
  network: NetworkSpeedType = NetworkSpeedType.NoThrottle,
  email = delegatePortalInspectionTech.USER_EMAIL,
  friendly = delegatePortalInspectionTech.USER_FRIENDLY
) {
  const global = new DelegatePortalGlobal(browser, environment, delegate.BASE_URL, email, friendly)
  global.context = await global.browser.newContext({ acceptDownloads: true })
  global.context.grantPermissions(['clipboard-read', 'clipboard-write'])
  global.page = await global.context.newPage()
  global.flavor = DelegateFlavor.InspectionTech
  global.performedAuthenticationOnLaunch = await LoginAndAuthenticateAsNeeded(global, email)
  const homePage = new DelegatePortalYourAssignedClaimsPage(global)
  await homePage.WaitForLoad()
  await homePage.CustomLoad()
  if (network != NetworkSpeedType.NoThrottle) {
    const cdpSession = await global.context.newCDPSession(global.page)
    switch (network) {
      case NetworkSpeedType.Good2G:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.Good2G)
        break
      case NetworkSpeedType.SuperSlow:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.SuperSlow)
        break
      case NetworkSpeedType.WiFi:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.WiFi)
        break
    }
    await cdpSession.detach()
  }
  return { global, homePage }
}

export async function LaunchInspectionTechMobile(
  browser: Browser,
  environment: string,
  device: MobileDevices = MobileDevices.iPhone_14_Pro_Max,
  network: NetworkSpeedType = NetworkSpeedType.NoThrottle,
  email = delegatePortalInspectionTech.USER_EMAIL,
  friendly = delegatePortalInspectionTech.USER_FRIENDLY
) {
  const emulatedDevice = devices[`${device}`]
  const global = new DelegatePortalGlobal(browser, environment, delegate.BASE_URL, email, friendly)
  global.context = await global.browser.newContext({ acceptDownloads: true })
  global.context.grantPermissions(['clipboard-read', 'clipboard-write'])
  global.page = await global.browser.newPage({ ...emulatedDevice })
  global.flavor = DelegateFlavor.InspectionTech
  global.isMobile = true
  global.performedAuthenticationOnLaunch = await LoginAndAuthenticateAsNeeded(global, email)
  const homePage = new DelegatePortalYourAssignedClaimsPageMobile(global)
  await homePage.WaitForLoad()
  if (network != NetworkSpeedType.NoThrottle) {
    const cdpSession = await global.context.newCDPSession(global.page)
    switch (network) {
      case NetworkSpeedType.Good2G:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.Good2G)
        break
      case NetworkSpeedType.SuperSlow:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.SuperSlow)
        break
      case NetworkSpeedType.WiFi:
        await cdpSession.send('Network.emulateNetworkConditions', NetworkSpeedConfig.WiFi)
        break
    }
    await cdpSession.detach()
  }
  return { global, homePage }
}

async function LoginAndAuthenticateAsNeeded(global: DelegatePortalGlobal, email: string) {
  // launch the Delegate page
  await global.page.goto(global.baseUrl)

  // check to see if we are being prompted to login
  const loginPage = new DelegatePortalLoginPage(global)
  await global.page.waitForTimeout(1000)
  const loginIsPresent = (await loginPage.title.count()) > 0
  if (loginIsPresent) {
    // handle the Delegate Login dialogs
    await loginPage.SelectEmailSignIn()
    const auth0LoginPage = new DelegatePortalAuth0LoginPage(global)
    await auth0LoginPage.LoginWithEmail(email)
    const noOlderThan = new Date(Date.now())
    // Handle code retrieval as needed
    const code = await GetAuthenticationCode(email, noOlderThan)
    if (code === undefined) {
      throw new Error('No code was found on the email server')
    }
    await auth0LoginPage.ContinueLoginWithCode(code)
    return true
  }
  return false
}

export async function GetAuthenticationCode(email: string, noOlderThan: Date) {
  const apiKey = shared.MAILOSAURUS_API_KEY
  const inboxServerId = shared.MAILOSAURUS_INBOX_SERVER_ID
  const sentFrom = shared.MAILOSAURUS_CODE_EMAIL_SENDER
  const subject = delegate.MAILOSAURUS_CODE_EMAIL_SUBJECT
  const body = shared.MAILOSAURUS_CODE_EMAIL_TARGET_BODY
  const mailosaur = new MailosaurClient(apiKey)
  const result = await mailosaur.messages.search(
    inboxServerId,
    {
      sentTo: email,
      sentFrom: sentFrom,
      subject: subject,
      body: body,
    },
    {
      receivedAfter: noOlderThan,
      timeout: 60000, // 60 seconds (in milliseconds)
      page: 0,
      itemsPerPage: 10,
    }
  )

  if (result.items !== undefined) {
    // Get the most recent message (the first one in the list)
    const latestMessage = result.items[0]

    // Get the full message object
    const message = await mailosaur.messages.getById(latestMessage.id)

    if (message.html === undefined) {
      throw new Error('No HTML content was found in the code email')
    }
    if (message.html.codes === undefined) {
      throw new Error('No code was found in the email HTML body')
    }
    const extractedCode = message.html.codes[0]

    // delete the email
    await mailosaur.messages.del(latestMessage.id)

    // return the email code
    return extractedCode.value
  }
}
