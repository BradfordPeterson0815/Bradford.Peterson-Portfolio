import { expect } from '@playwright/test'
import { DefaultEnvironment, UserTypes } from '../../../library/botpress/bpConstants.js'
import { Initialize, Shutdown, SubmitDateToCalendar } from '../../../library/botpress/bpHelper.js'
import test from '../../../library/botpress/bpTestHooks.js'
import {
  FNOLServerPrompts,
  ProvidePolicy_No,
  ProvidePolicy_Yes,
} from '../../../library/botpress/clients/singer/bpSingerConstants.js'
import {
  GetPolicy,
  LaunchSingerFNOLChat,
} from '../../../library/botpress/clients/singer/bpSingerHelper.js'

const environment = DefaultEnvironment
Initialize(environment)

test('VerifyInvalidPolicyNumbers', async ({ browser }) => {
  const userType = UserTypes.Internal
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_No, userType)
  const invalidInputLocator = global.page
    .frameLocator('#bp-widget')
    .locator('.bpw-keyboard div[role="region"].invalid')
  const inputLocator = global.page.frameLocator('#bp-widget').locator('#input-message')
  const buttonSelector = global.page.frameLocator('#bp-widget').locator('#btn-send')
  const invalidPolicyNumbersList = {
    invalidPolicyNumberAllSpaces: '         ',
    invalidPolicyNumberAllTabs: '           ',
    invalidPolicyNumberMixedWhitespace: '               ',
    invalidPolicyNumberSurroundingWhiteSpace: '   PSH112233    ',
    invalidPolicyNumberSurroundingTabs: ' PSH112233 ',
    invalidPolicyNumberMultipleSpacesInMiddle: 'PSH  112233',
    invalidPolicyNumberMultipleTabsInMiddle: 'PSH   112233',
    invalidPolicyNumberSpecialTilde: 'PSH112233~',
    invalidPolicyNumberSpecialBang: 'PSH112233!',
    invalidPolicyNumberSpecialAt: 'PSH112233@',
    invalidPolicyNumberSpecialHash: 'PSH112233#',
    invalidPolicyNumberSpecialDollar: 'PSH112233$',
    invalidPolicyNumberSpecialGreaterThan: 'PSH112233>',
    invalidPolicyNumberSpecialLessThan: 'PSH112233<',
    invalidPolicyNumberSpecialQuestion: 'PSH112233?',
    invalidPolicyNumberTooLong: 'PSH1234567890ABCDEF',
  }
  await chat.HandleIntroduction()
  for (const pnKey in Object.keys(invalidPolicyNumbersList)) {
    const policyNumberVariant = Object.values(invalidPolicyNumbersList)[pnKey]
    await inputLocator.clear()
    await inputLocator.fill(policyNumberVariant)
    await buttonSelector.click()
    const markedAsInvalid = await invalidInputLocator.count()
    expect(markedAsInvalid).toBeGreaterThanOrEqual(1)
    await global.page.waitForTimeout(1000)
  }
  await Shutdown(global)
})

test('VerifyInvalidLastName', async ({ browser }) => {
  const userType = UserTypes.Internal
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_No, userType)
  const invalidInputLocator = global.page
    .frameLocator('#bp-widget')
    .locator('.bpw-keyboard div[role="region"].invalid')
  const inputLocator = global.page.frameLocator('#bp-widget').locator('#input-message')
  const buttonSelector = global.page.frameLocator('#bp-widget').locator('#btn-send')
  const invalidLastNameList = {
    invalidLastNameAllSpaces: '         ',
    invalidLastNameAllTabs: '           ',
    invalidLastNameMixedWhitespace: '               ',
    invalidLastNameSurroundingWhiteSpace: '   Jones    ',
    invalidLastNameSurroundingTabs: ' Jones ',
    invalidLastNameMultipleSpacesInMiddle: 'Van  Heusen',
    invalidLastNameMultipleTabsInMiddle: 'Van   Heusen',
    invalidLastNameSpecialTilde: 'A~',
    invalidLastNameSpecialBang: 'A!',
    invalidLastNameSpecialAt: 'A@',
    invalidLastNameSpecialHash: 'A#',
    invalidLastNameSpecialDollar: 'A$',
    invalidLastNameSpecialGreaterThan: 'A>',
    invalidLastNameSpecialLessThan: 'A<',
    invalidLastNameSpecialQuestion: 'A?',
    invalidLastNameTooLong: 'This last name has more than 16 characters',
  }
  await chat.HandleIntroduction()
  await chat.CheckServerPromptAndSelectLink(FNOLServerPrompts.DoYouHaveThePolicyNumber, 0, 2)
  await chat.CheckServerPrompt(FNOLServerPrompts.PolicyLookupLastName_Intro, 5)

  for (const lnKey in Object.keys(invalidLastNameList)) {
    const lastNameVariant = Object.values(invalidLastNameList)[lnKey]
    await inputLocator.clear()
    await inputLocator.fill(lastNameVariant)
    await buttonSelector.click()
    const markedAsInvalid = await invalidInputLocator.count()
    console.debug(lastNameVariant)
    expect(markedAsInvalid).toBeGreaterThanOrEqual(1)
    await global.page.waitForTimeout(1000)
  }
  await Shutdown(global)
})

test('VerifyInvalidHouseNumbers', async ({ browser }) => {
  const userType = UserTypes.Internal
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_No, userType)
  const invalidInputLocator = global.page
    .frameLocator('#bp-widget')
    .locator('.bpw-keyboard div[role="region"].invalid')
  const inputLocator = global.page.frameLocator('#bp-widget').locator('#input-message')
  const buttonSelector = global.page.frameLocator('#bp-widget').locator('#btn-send')
  const invalidHouseNumberList = {
    invalidHouseNumberAllSpaces: '         ',
    invalidHouseNumberAllTabs: '           ',
    invalidHouseNumberMixedWhitespace: '               ',
    invalidHouseNumberNumericTooLong: '12345678901234567',
    invalidHouseNumberAlpha: 'abce',
    invalidHouseNumberAlphaNumeric: '12A',
    invalidHouseNumberNumericAlpha: 'A12',
    invalidHouseNumberNumericSpaceAlpha: 'A 12',
    invalidHouseNumberNonAlphaNumericMix: `~!@#$%^&*()_+:">?/.;'[]\\|`,
  }
  await chat.HandleIntroduction()
  await chat.CheckServerPromptAndSelectLink(FNOLServerPrompts.DoYouHaveThePolicyNumber, 0, 2)
  await chat.CheckServerPrompt(FNOLServerPrompts.PolicyLookupLastName_Intro, 5)
  await chat.CheckServerPromptAndRespond(
    FNOLServerPrompts.PolicyLookupLastName_FirstTry,
    'Jones',
    6
  )

  for (const hnKey in Object.keys(invalidHouseNumberList)) {
    const houseNumberVariant = Object.values(invalidHouseNumberList)[hnKey]
    await inputLocator.clear()
    await inputLocator.fill(houseNumberVariant)
    await buttonSelector.click()
    const markedAsInvalid = await invalidInputLocator.count()
    console.debug(houseNumberVariant)
    expect(markedAsInvalid).toBeGreaterThanOrEqual(1)
    await global.page.waitForTimeout(1000)
  }
  await Shutdown(global)
})

test('VerifyValidZipCodes', async ({ browser }) => {
  const userType = UserTypes.Internal
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_No, userType)
  const inputLocator = global.page.frameLocator('#bp-widget').locator('#input-message')
  const buttonSelector = global.page.frameLocator('#bp-widget').locator('#btn-send')
  const validZipcodeList = {
    validZipcodeNormal: '12345',
    validZipcodeAllZeros: '00000',
    validZipcodeLeadingZero: '01234',
  }
  await chat.HandleIntroduction()
  await chat.CheckServerPromptAndSelectLink(FNOLServerPrompts.DoYouHaveThePolicyNumber, 0, 2)
  await chat.CheckServerPrompt(FNOLServerPrompts.PolicyLookupLastName_Intro, 5)
  await chat.CheckServerPromptAndRespond(
    FNOLServerPrompts.PolicyLookupLastName_FirstTry,
    'Jones',
    6
  )
  await chat.CheckServerPromptAndRespond(FNOLServerPrompts.PolicyLookupHouseNumber, '101')
  for (const zcKey in Object.keys(validZipcodeList)) {
    const zipCodeVariant = Object.values(validZipcodeList)[zcKey]
    await inputLocator.clear()
    await inputLocator.fill(zipCodeVariant)
    const buttonIsEnabled = await buttonSelector.isEnabled()
    console.debug(zipCodeVariant)
    expect(buttonIsEnabled).toBe(true)
    await global.page.waitForTimeout(1000)
  }
  await Shutdown(global)
})

test('VerifyInvalidZipCodes', async ({ browser }) => {
  const userType = UserTypes.Internal
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_No, userType)
  const inputLocator = global.page.frameLocator('#bp-widget').locator('#input-message')
  const buttonSelector = global.page.frameLocator('#bp-widget').locator('#btn-send')
  const invalidZipcodeList = {
    invalidZipcodeAlphaShort: 'a',
    invalidZipcodeAlphaLong: 'abcdefefefas',
    invalidZipcode5StartsAlpha: 'a2345',
    invalidZipcode5ContainsAlpha: '123a5',
    invalidZipcode5EndsAlpha: '1234b',
    invalidZipcode5ContainsHash: '123#5',
    invalidZipcode5ContainsPoint: '123.5',
    invalidZipcode5StartsPoint: '.2345',
    invalidZipcodeTooShort: '1234',
  }
  await chat.HandleIntroduction()
  await chat.CheckServerPromptAndSelectLink(FNOLServerPrompts.DoYouHaveThePolicyNumber, 0, 2)
  await chat.CheckServerPrompt(FNOLServerPrompts.PolicyLookupLastName_Intro, 5)
  await chat.CheckServerPromptAndRespond(
    FNOLServerPrompts.PolicyLookupLastName_FirstTry,
    'Jones',
    6
  )
  await chat.CheckServerPromptAndRespond(FNOLServerPrompts.PolicyLookupHouseNumber, '101')
  for (const zcKey in Object.keys(invalidZipcodeList)) {
    const zipCodeVariant = Object.values(invalidZipcodeList)[zcKey]
    await inputLocator.clear()
    await inputLocator.fill(zipCodeVariant)
    const buttonIsEnabled = await buttonSelector.isEnabled()
    console.debug(zipCodeVariant)
    expect(buttonIsEnabled).toBe(false)
    await global.page.waitForTimeout(1000)
  }
  await Shutdown(global)
})

test('VerifyLossDateCannotBeMoreThan5YearsInThePast', async ({ browser }) => {
  const userType = UserTypes.Internal
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_Yes, userType)
  await chat.HandleIntroduction()
  await chat.HandleUserPolicyholder()
  const todaysDate = new Date()
  const targetDate = new Date()
  targetDate.setFullYear(todaysDate.getFullYear() - 5)
  const matchDateOrFailure = await SubmitDateToCalendar(targetDate.toDateString())
  expect(matchDateOrFailure).toBe(null)
  await Shutdown(global)
})
