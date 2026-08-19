import { Browser } from '@playwright/test'
import { DefaultEnvironment, UserTypes } from '../../../library/botpress/bpConstants.js'
import { Initialize, Shutdown } from '../../../library/botpress/bpHelper.js'
import test from '../../../library/botpress/bpTestHooks.js'
import {
  EagleDamageAreaTypes,
  EagleWeatherEventTypes,
  ProvidePolicy_Yes,
} from '../../../library/botpress/clients/eagle/bpEagleConstants.js'
import {
  GetWeatherEvent,
  GetWeatherEventPolicy,
  LaunchEagleFNOLChat,
} from '../../../library/botpress/clients/eagle/bpEagleHelper.js'

const environment = DefaultEnvironment
Initialize(environment)

test('WeatherEvent_SingleEvent_Select_Insured', async ({ browser }) => {
  await WeatherEvent_SingleEvent_Test(
    browser,
    UserTypes.Insured,
    EagleWeatherEventTypes.FieryFreddy,
    true
  )
})

test('WeatherEvent_SingleEvent_DoNotSelect_Insured', async ({ browser }) => {
  await WeatherEvent_SingleEvent_Test(
    browser,
    UserTypes.Insured,
    EagleWeatherEventTypes.FieryFreddy,
    false
  )
})

test('WeatherEvent_SingleEvent_Select_Agent', async ({ browser }) => {
  await WeatherEvent_SingleEvent_Test(
    browser,
    UserTypes.Agent,
    EagleWeatherEventTypes.FieryFreddy,
    true
  )
})

test('WeatherEvent_SingleEvent_DoNotSelect_Internal', async ({ browser }) => {
  await WeatherEvent_SingleEvent_Test(
    browser,
    UserTypes.Internal,
    EagleWeatherEventTypes.TyphoonTimmy,
    false
  )
})

async function WeatherEvent_SingleEvent_Test(
  browser: Browser,
  userType: UserTypes,
  weatherEventToExpect: EagleWeatherEventTypes,
  selectWeatherEvent: boolean
) {
  const weatherEvent = GetWeatherEvent(weatherEventToExpect)
  const policy = GetWeatherEventPolicy(weatherEvent)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  chat.userParams.expectedWeatherEvents.push(weatherEvent)
  chat.userParams.weatherEventChoice = selectWeatherEvent ? weatherEvent.name : null
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(EagleDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandleContentsOrPersonalPropertyDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}

test('WeatherEvent_MultiEvent_Select_Insured', async ({ browser }) => {
  await WeatherEvent_MultiEvent_Test(browser, UserTypes.Insured, true)
})

test('WeatherEvent_MultiEvent_DoNotSelect_Insured', async ({ browser }) => {
  await WeatherEvent_MultiEvent_Test(browser, UserTypes.Insured, false)
})

async function WeatherEvent_MultiEvent_Test(
  browser: Browser,
  userType: UserTypes,
  selectWeatherEvent: boolean
) {
  const weatherEventToChoose = GetWeatherEvent(EagleWeatherEventTypes.HailingHillary)
  const weatherEventNotChosen = GetWeatherEvent(EagleWeatherEventTypes.FieryFreddy)
  const policy = GetWeatherEventPolicy(weatherEventToChoose)
  const { global, chat } = await LaunchEagleFNOLChat(
    browser,
    policy,
    ProvidePolicy_Yes,
    userType
  )
  chat.userParams.expectedWeatherEvents.push(weatherEventToChoose)
  chat.userParams.expectedWeatherEvents.push(weatherEventNotChosen)
  chat.userParams.weatherEventChoice = selectWeatherEvent ? weatherEventToChoose.name : null
  await chat.HandleDefaultUserValidation()
  await chat.HandleDamageReason()
  await chat.HandleDamageAreas(EagleDamageAreaTypes.ContentsOrPersonalProperty)
  await chat.HandleContentsOrPersonalPropertyDamageFlow()
  await chat.HandleDefaultFinish()
  await Shutdown(global)
}
