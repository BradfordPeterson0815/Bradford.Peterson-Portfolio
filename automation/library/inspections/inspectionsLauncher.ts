import type { Options } from '@wdio/types'
import MailosaurClient from 'mailosaur'
import { Browser } from 'playwright/test'
import { remote } from 'webdriverio'
import { inspections, shared } from '../../environments/env.appium.js'
import { AppiumEnvironmentType } from '../shared/constants.js'
import { OSTargets, TestTargets } from './inspectionsConstants.js'
import { InspectionsGlobal } from './inspectionsGlobal.js'
import { InspectionsHomePage } from './pages/inspectionsHomePage.js'
import { InspectionsTitlePage } from './pages/inspectionsTitlePage.js'

export async function LaunchInspections(browser: Browser, email: string | null = null) {
  const testTarget = TestTargets.Emulator
  const osTarget = OSTargets.Android // default is for android emulator
  // expand to allow for android device or IOS emulator / device
  switch (osTarget) {
    // case OSTargets.IOS:
    //   {
    //     const { global, homePage } = await LaunchIOS(testTarget, browser, email)
    //     return { global, homePage }
    //   }
    case OSTargets.Android:
    default: {
      const { global, homePage } = await LaunchAndroid(testTarget, browser, email)
      return { global, homePage }
    }
  }
}

export async function LaunchInspections_NoSignIn(browser: Browser) {
  const testTarget = TestTargets.Emulator
  const osTarget = OSTargets.Android // default is for android emulator
  // expand to allow for android device or IOS emulator / device
  switch (osTarget) {
    // case OSTargets.IOS:
    //   {
    //     const { global, titlePage } = await LaunchIOS_NoSignIn(testTarget, browser)
    //     return { global, titlePage }
    //   }
    case OSTargets.Android:
    default: {
      const { global, titlePage } = await LaunchAndroid_NoSignIn(testTarget, browser)
      return { global, titlePage }
    }
  }
}

export async function LaunchAndroid(
  target: TestTargets,
  browser: Browser,
  email: string | null = null
) {
  let nativeWebBrowser: WebdriverIO.Browser
  if (target == TestTargets.Emulator) {
    nativeWebBrowser = await remote(GenerateAndroidEmulatorWebDriverOptions())
  } else {
    nativeWebBrowser = await remote(GenerateAndroidDeviceWebDriverOptions())
  }
  const global = new InspectionsGlobal(browser, nativeWebBrowser)

  // Handle title page
  const titlePage = new InspectionsTitlePage(global)
  await titlePage.WaitForLoad()
  await titlePage.SignIn(email)
  const homePage = new InspectionsHomePage(global)
  await homePage.WaitForLoad()
  return { global, homePage }
}

export async function LaunchAndroid_NoSignIn(target: TestTargets, browser: Browser) {
  let nativeWebBrowser: WebdriverIO.Browser
  if (target == TestTargets.Emulator) {
    nativeWebBrowser = await remote(GenerateAndroidEmulatorWebDriverOptions())
  } else {
    nativeWebBrowser = await remote(GenerateAndroidDeviceWebDriverOptions())
  }
  const global = new InspectionsGlobal(browser, nativeWebBrowser)

  // Wait for title page and stop
  const titlePage = new InspectionsTitlePage(global)
  await titlePage.WaitForLoad()
  return { global, titlePage }
}

function GenerateAndroidEmulatorWebDriverOptions(
  variant: AppiumEnvironmentType = AppiumEnvironmentType.Company_Release
) {
  const releaseCapabilities = {
    platformName: 'Android',
    'appium:options': {
      automationName: 'UiAutomator2',
      deviceName: 'Android',
      appPackage: `io.company.paprika.${variant}`,
      appActivity: '.MainActivity',
    },
  }

  const webDriverOptions = {
    hostname: 'localhost',
    port: 4723,
    logLevel: 'info' as Options.WebDriverLogTypes,
    capabilities: releaseCapabilities,
  }

  return webDriverOptions
}

function GenerateAndroidDeviceWebDriverOptions(
  variant: AppiumEnvironmentType = AppiumEnvironmentType.Company_Release
) {
  const releaseCapabilities = {
    platformName: 'Android',
    'appium:options': {
      automationName: 'UiAutomator2',
      platformVersion: '13',
      deviceName: 'RFCR40X0K0N',
      appPackage: `io.company.paprika.${variant}`,
      appActivity: '.MainActivity',
      isRealMobile: true,
      autoGrantPermissions: true,
    },
  }

  const webDriverOptions = {
    hostname: 'localhost',
    port: 4723,
    logLevel: 'info' as Options.WebDriverLogTypes,
    capabilities: releaseCapabilities,
  }

  return webDriverOptions
}

export async function GetAuthenticationCode(email: string, noOlderThan: Date) {
  const apiKey = shared.MAILOSAURUS_API_KEY
  const inboxServerId = shared.MAILOSAURUS_INBOX_SERVER_ID
  const sentFrom = shared.MAILOSAURUS_CODE_EMAIL_SENDER
  const subject = inspections.MAILOSAURUS_CODE_EMAIL_SUBJECT
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
