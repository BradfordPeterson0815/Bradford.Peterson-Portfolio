import { expect } from '@playwright/test'
import { DefaultEnvironment, UserTypes } from '../../../library/botpress/bpConstants.js'
import { Initialize, Shutdown } from '../../../library/botpress/bpHelper.js'
import test from '../../../library/botpress/bpTestHooks.js'
import {
  InvalidEmailList,
  InvalidPhoneList,
  FNOLServerPrompts,
  ProvidePolicy_No,
  ProvidePolicy_Yes,
  EagleOnBehalfOfTypes,
  OnBehalfOf,
  LiabilityTypes,
  EagleDamageReasonTypes,
  WaterDamage,
  Plumbing,
} from '../../../library/botpress/clients/eagle/bpEagleConstants.js'
import {
  GetPolicy,
  LaunchEagleFNOLChat,
} from '../../../library/botpress/clients/eagle/bpEagleHelper.js'

const environment = DefaultEnvironment
Initialize(environment)

test('VerifyInvalidPolicyNumbers', async ({ browser }) => {
  const userType = UserTypes.Internal
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_No,
    userType
  )
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
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_No,
    userType
  )
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
  await chat.CheckServerPromptAndSelectLink(FNOLServerPrompts.WhatIsYourPolicyNumber, 0, 2)
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
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_No,
    userType
  )
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
  await chat.CheckServerPromptAndSelectLink(FNOLServerPrompts.WhatIsYourPolicyNumber, 0, 2)
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
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_No,
    userType
  )
  const inputLocator = global.page.frameLocator('#bp-widget').locator('#input-message')
  const buttonSelector = global.page.frameLocator('#bp-widget').locator('#btn-send')
  const validZipcodeList = {
    validZipcodeNormal: '12345',
    validZipcodeAllZeros: '00000',
    validZipcodeLeadingZero: '01234',
  }
  await chat.HandleIntroduction()
  await chat.CheckServerPromptAndSelectLink(FNOLServerPrompts.WhatIsYourPolicyNumber, 0, 2)
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
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_No,
    userType
  )
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
  await chat.CheckServerPromptAndSelectLink(FNOLServerPrompts.WhatIsYourPolicyNumber, 0, 2)
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

test('ValidateContactInformation', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  chat.userParams.editContactInformation = true
  chat.userParams.editContactStopOnEdit = true
  await chat.HandleDefaultUserValidation()

  for (const emailKey in Object.keys(InvalidEmailList)) {
    const emailVariant = Object.values(InvalidEmailList)[emailKey]
    const validationResult = await chat.ValidateContactInformation(emailVariant)
    console.debug(emailVariant)
    expect(validationResult).toBe(true)
    await global.page.waitForTimeout(500)
  }

  for (const phoneKey in Object.keys(InvalidPhoneList)) {
    const phoneVariant = Object.values(InvalidPhoneList)[phoneKey]
    const validationResult = await chat.ValidateContactInformation(null, phoneVariant)
    console.debug(phoneVariant)
    expect(validationResult).toBe(true)
    await global.page.waitForTimeout(500)
  }

  await Shutdown(global)
})

test('ValidateClaimReporterInformation', async ({ browser }) => {
  const userType = UserTypes.Insured
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  chat.userParams.claimReporterStopOnEdit = true
  chat.userParams.onBehalfOf_Type =
    Object.values(OnBehalfOf)[EagleOnBehalfOfTypes.ContractorVendor]

  await chat.HandleDefaultUserValidation()

  for (const emailKey in Object.keys(InvalidEmailList)) {
    const emailVariant = Object.values(InvalidEmailList)[emailKey]
    const validationResult = await chat.ValidateClaimReporter(emailVariant)
    console.debug(emailVariant)
    expect(validationResult).toBe(true)
    await global.page.waitForTimeout(500)
  }

  for (const phoneKey in Object.keys(InvalidPhoneList)) {
    const phoneVariant = Object.values(InvalidPhoneList)[phoneKey]
    const validationResult = await chat.ValidateClaimReporter(null, phoneVariant)
    console.debug(phoneVariant)
    expect(validationResult).toBe(true)
    await global.page.waitForTimeout(500)
  }

  await Shutdown(global)
})

test('ValidateClaimantInformation', async ({ browser }) => {
  const userType = UserTypes.Internal
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  chat.userParams.thirdPartyClaimantStopOnEdit = true
  chat.liabilityParams.claimant_FirstName = 'Jon'
  chat.liabilityParams.claimant_LastName = 'Dough'

  await chat.HandleDefaultUserValidation()
  await chat.HandleLiabilityFlow(LiabilityTypes.Property)

  for (const emailKey in Object.keys(InvalidEmailList)) {
    const emailVariant = Object.values(InvalidEmailList)[emailKey]
    const validationResult = await chat.ValidateClaimant(emailVariant)
    console.debug(emailVariant)
    expect(validationResult).toBe(true)
    await global.page.waitForTimeout(500)
  }

  for (const phoneKey in Object.keys(InvalidPhoneList)) {
    const phoneVariant = Object.values(InvalidPhoneList)[phoneKey]
    const validationResult = await chat.ValidateClaimant(null, phoneVariant)
    console.debug(phoneVariant)
    expect(validationResult).toBe(true)
    await global.page.waitForTimeout(500)
  }

  await Shutdown(global)
})

test('ValidateAttorneyInformation', async ({ browser }) => {
  const userType = UserTypes.Internal
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  chat.userParams.attorneyStopOnEdit = true
  chat.liabilityParams.attorney_FirstName = 'Dewey'
  chat.liabilityParams.attorney_LastName = 'Cheatham'

  await chat.HandleDefaultUserValidation()
  await chat.HandleLiabilityFlow(LiabilityTypes.Property)

  for (const emailKey in Object.keys(InvalidEmailList)) {
    const emailVariant = Object.values(InvalidEmailList)[emailKey]
    const validationResult = await chat.ValidateAttorney(emailVariant)
    console.debug(emailVariant)
    expect(validationResult).toBe(true)
    await global.page.waitForTimeout(500)
  }

  for (const phoneKey in Object.keys(InvalidPhoneList)) {
    const phoneVariant = Object.values(InvalidPhoneList)[phoneKey]
    const validationResult = await chat.ValidateAttorney(null, phoneVariant)
    console.debug(phoneVariant)
    expect(validationResult).toBe(true)
    await global.page.waitForTimeout(500)
  }

  await Shutdown(global)
})

test('ValidatePlumbingInformation', async ({ browser }) => {
  const userType = UserTypes.Internal
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  chat.userParams.plumber_StopOnEdit = true
  chat.userParams.originOfWaterDamage = WaterDamage.Plumbing
  chat.userParams.waterTurnedOff = false
  chat.userParams.plumbingType = Plumbing.Aquarium
  chat.userParams.plumber_Contacted = true
  chat.userParams.plumber_Company = 'Peter Piper'
  chat.userParams.plumber_Phone = '425 123 1311'
  chat.userParams.plumber_PhoneMatch = '+14251231311'

  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(EagleDamageReasonTypes.Water)

  for (const phoneKey in Object.keys(InvalidPhoneList)) {
    const phoneVariant = Object.values(InvalidPhoneList)[phoneKey]
    const validationResult = await chat.ValidatePlumbing(phoneVariant)
    console.debug(phoneVariant)
    expect(validationResult).toBe(true)
    await global.page.waitForTimeout(500)
  }

  await Shutdown(global)
})

test('ValidateHVACInformation', async ({ browser }) => {
  const userType = UserTypes.Internal
  const policy = GetPolicy(userType)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  chat.userParams.hvac_StopOnEdit = true
  chat.userParams.originOfWaterDamage = WaterDamage.HVAC
  chat.userParams.waterTurnedOff = false
  chat.userParams.plumbingType = Plumbing.Sink
  chat.userParams.hvac_Repaired = true
  chat.userParams.hvac_Company = 'Duct Duct Goose'
  chat.userParams.hvac_Phone = '425 321 3155'
  chat.userParams.hvac_PhoneMatch = '+14253213155'
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason(EagleDamageReasonTypes.Water)

  for (const phoneKey in Object.keys(InvalidPhoneList)) {
    const phoneVariant = Object.values(InvalidPhoneList)[phoneKey]
    const validationResult = await chat.ValidateHVAC(phoneVariant)
    console.debug(phoneVariant)
    expect(validationResult).toBe(true)
    await global.page.waitForTimeout(500)
  }

  await Shutdown(global)
})
