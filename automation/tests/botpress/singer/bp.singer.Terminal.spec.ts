import { Browser } from '@playwright/test'
import { DefaultEnvironment, UserTypes } from '../../../library/botpress/bpConstants.js'
import { Initialize, Shutdown } from '../../../library/botpress/bpHelper.js'
import test from '../../../library/botpress/bpTestHooks.js'
import { FNOLServerPrompts, ProvidePolicy_No } from '../../../library/botpress/clients/singer/bpSingerConstants.js'
import {
  GetPolicyWithBadData,
  LaunchSingerFNOLChat,
} from '../../../library/botpress/clients/singer/bpSingerHelper.js'

const environment = DefaultEnvironment
Initialize(environment)

test('LookupUserPolicy_NotFound_StartOver_Insured', async ({ browser }) => {
  await LookupUserPolicy_NotFound_StartOver_Test(browser, UserTypes.Insured)
})

test('LookupUserPolicy_NotFound_StartOver_Internal', async ({ browser }) => {
  await LookupUserPolicy_NotFound_StartOver_Test(browser, UserTypes.Internal)
})

test('LookupUserPolicy_NotFound_StartOver_Agent', async ({ browser }) => {
  await LookupUserPolicy_NotFound_StartOver_Test(browser, UserTypes.Agent)
})

test('LookupUserPolicy_NotFound_StartOver_NotSpecified', async ({ browser }) => {
  await LookupUserPolicy_NotFound_StartOver_Test(browser, UserTypes.NotSpecified)
})

async function LookupUserPolicy_NotFound_StartOver_Test(browser: Browser, userType: UserTypes) {
  const policy = GetPolicyWithBadData()
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_No, userType)
  chat.userParams.policyNumberWasProvided = false
  chat.userParams.performPolicyLookup = true
  chat.userParams.expectSuccessOnLookup = false
  chat.userParams.stopAfterPolicyLookup = true
  await chat.HandleDefaultUserValidation()
  await chat.CheckServerPromptAndSelectButton(
    FNOLServerPrompts.UnableToFindMatchingPolicy,
    0 // yes
  )
  await chat.CheckServerPromptAndRespond(
    FNOLServerPrompts.PolicyLookupLastName_FirstTry,
    policy.lastName.trim(),
    1
  )
  await Shutdown(global)
}

test('LookupUserPolicy_NotFound_Terminate_Insured', async ({ browser }) => {
  await LookupUserPolicy_NotFound_Terminate_Test(browser, UserTypes.Insured)
})

test('LookupUserPolicy_NotFound_Terminate_Internal', async ({ browser }) => {
  await LookupUserPolicy_NotFound_Terminate_Test(browser, UserTypes.Internal)
})

test('LookupUserPolicy_NotFound_Terminate_Agent', async ({ browser }) => {
  await LookupUserPolicy_NotFound_Terminate_Test(browser, UserTypes.Agent)
})

test('LookupUserPolicy_NotFound_Terminate_NotSpecified', async ({ browser }) => {
  await LookupUserPolicy_NotFound_Terminate_Test(browser, UserTypes.NotSpecified)
})

async function LookupUserPolicy_NotFound_Terminate_Test(browser: Browser, userType: UserTypes) {
  const policy = GetPolicyWithBadData()
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_No, userType)
  chat.userParams.policyNumberWasProvided = false
  chat.userParams.performPolicyLookup = true
  chat.userParams.expectSuccessOnLookup = false
  chat.userParams.stopAfterPolicyLookup = true
  await chat.HandleDefaultUserValidation()
  await chat.CheckServerPromptAndSelectButton(
    FNOLServerPrompts.UnableToFindMatchingPolicy,
    1 // no
  )
  await chat.CheckServerPrompt(FNOLServerPrompts.UnableToHelpWithThisClaimTerminal)
  await Shutdown(global)
}

test('LookupUserPolicy_NotFound_MaxRetries_Insured', async ({ browser }) => {
  await LookupUserPolicy_NotFound_MaxRetries_Test(browser, UserTypes.Insured)
})

test('LookupUserPolicy_NotFound_MaxRetries_Internal', async ({ browser }) => {
  await LookupUserPolicy_NotFound_MaxRetries_Test(browser, UserTypes.Internal)
})

test('LookupUserPolicy_NotFound_MaxRetries_Agent', async ({ browser }) => {
  await LookupUserPolicy_NotFound_MaxRetries_Test(browser, UserTypes.Agent)
})

test('LookupUserPolicy_NotFound_MaxRetries_NotSpecified', async ({ browser }) => {
  await LookupUserPolicy_NotFound_MaxRetries_Test(browser, UserTypes.NotSpecified)
})

async function LookupUserPolicy_NotFound_MaxRetries_Test(browser: Browser, userType: UserTypes) {
  const policy = GetPolicyWithBadData()
  const { global, chat } = await LaunchSingerFNOLChat(browser, policy, ProvidePolicy_No, userType)
  chat.userParams.policyNumberWasProvided = false
  chat.userParams.performPolicyLookup = true
  chat.userParams.expectSuccessOnLookup = false
  chat.userParams.stopAfterPolicyLookup = true
  // attempt #1
  await chat.HandleDefaultUserValidation()
  // attempt #2
  await chat.CheckServerPromptAndSelectButton(
    FNOLServerPrompts.UnableToFindMatchingPolicy,
    0 // yes
  )
  await chat.CheckServerPromptAndRespond(
    FNOLServerPrompts.PolicyLookupLastName_FirstTry,
    policy.lastName.trim(),
    1
  )
  await chat.CheckServerPromptAndRespond(
    FNOLServerPrompts.PolicyLookupHouseNumber,
    chat.userParams.policy.houseNumber
  )
  await chat.CheckServerPromptAndRespond(
    FNOLServerPrompts.PolicyLookupZip,
    chat.userParams.policy.zip
  )
  // attempt #3
  await chat.CheckServerPromptAndSelectButton(
    FNOLServerPrompts.UnableToFindMatchingPolicy,
    0 // yes
  )
  await chat.CheckServerPromptAndRespond(
    FNOLServerPrompts.PolicyLookupLastName_FirstTry,
    policy.lastName.trim(),
    1
  )
  await chat.CheckServerPromptAndRespond(
    FNOLServerPrompts.PolicyLookupHouseNumber,
    chat.userParams.policy.houseNumber
  )
  await chat.CheckServerPromptAndRespond(
    FNOLServerPrompts.PolicyLookupZip,
    chat.userParams.policy.zip
  )
  await chat.CheckServerPrompt(FNOLServerPrompts.MaxPolicyLookupAttempts, 1)
  await chat.CheckServerPrompt(FNOLServerPrompts.CallCustomerService, 2)
  await Shutdown(global)
}
