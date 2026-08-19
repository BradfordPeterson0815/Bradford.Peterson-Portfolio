import { Locator, expect } from '@playwright/test'
import { CompareMethods, UserTypes } from '../../bpConstants.js'
import { BPFNOLChat } from '../../bpFNOLChat.js'
import { BPGlobal } from '../../bpGlobal.js'
import { RandomTrueFalse, SubmitDateToCalendar } from '../../bpHelper.js'
import { BPOnBehalfOf } from '../../bpOnBehalfOf.js'
import { BPUserParameters } from '../../bpUserParameters.js'
import {
  DamageArea,
  EagleDamageAreaTypes,
  DamageReason,
  EagleDamageReasonTypes,
  FNOLPromptLinks,
  FNOLServerPromptText,
  FNOLServerPrompts,
  FencingType,
  Mitigations,
  Interior_Rooms,
  Liability,
  OtherStructuresDamage,
  OtherText,
  PoolType,
  UploadImageOptions,
  EagleWaterDamageTypes,
  ServerPromptsAlternateText,
  ClaimsPortalPhone,
  ClientEmail,
  DefaultCallbackSLA,
  HurricaneCallbackSLA,
  EagleOnBehalfOfTypes,
  ValidationText,
} from './bpEagleConstants.js'
import { BPServerPrompt } from '../../bpServerPrompt.js'
import {
  GetRandomFencingType,
  GetRandomInteriorRooms,
  GetRandomMitigations,
  GetRandomPoolType,
} from './bpEagleHelper.js'

export class BPEagleFNOLChat extends BPFNOLChat {
  constructor(global: BPGlobal) {
    super(global)
  }

  async HandleIntroduction() {
    switch (this.userParams.userType) {
      case UserTypes.Internal:
        await this.CheckServerPrompt(FNOLServerPrompts.Introduction_Internal)
        this.promptOffsetTracking = 1
        break
      case UserTypes.Agent:
        await this.CheckServerPrompt(FNOLServerPrompts.Introduction_Agent)
        this.promptOffsetTracking = 1
        break
      default:
        await this.CheckServerPrompt(FNOLServerPrompts.Introduction_Insured)
        this.promptOffsetTracking = 1
        break
    }
  }

  async HandleUserPolicy(userParams: BPUserParameters) {
    switch (userParams.userType) {
      case UserTypes.Internal:
      case UserTypes.Agent:
        await this.CheckServerPromptAndRespond(
          FNOLServerPrompts.WhatIsYourPolicyNumber,
          userParams.policy.policyNumber,
          2
        )
        break
      case UserTypes.Insured:
      default: {
        const prompt = FNOLServerPrompts.WhatIsYourPolicyNumber
        const policyNumber = userParams.policy.policyNumber
        await this.CheckServerPromptAndRespond(prompt, policyNumber, 2)
      }
    }
    this.promptOffsetTracking = 0
  }

  async HandleUserPolicyholder() {
    switch (this.userParams.userType) {
      case UserTypes.Internal:
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.AmISpeakingWithThePolicyholder,
          this.userParams.onBehalfOf_Type == null ? 0 : 1, // yes/no
          1 + this.promptOffsetTracking + (this.userParams.undoTopic != null ? 1 : 0)
        )
        this.promptOffsetTracking = 0
        this.userParams.undoTopic = null
        break
      case UserTypes.Agent:
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.IsTheCallerThePolicyholder,
          this.userParams.onBehalfOf_Type == null ? 0 : 1, // yes/no
          1 + this.promptOffsetTracking + (this.userParams.undoTopic != null ? 1 : 0)
        )
        this.promptOffsetTracking = 0
        this.userParams.undoTopic = null
        break
      default:
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.AreYouThePolicyHolder,
          this.userParams.onBehalfOf_Type == null ? 0 : 1, // yes/no
          1 + this.promptOffsetTracking + (this.userParams.undoTopic != null ? 1 : 0)
        )
        this.promptOffsetTracking = 0
        this.userParams.undoTopic = null
    }
    if (this.userParams.onBehalfOf_Type != null) {
      const actual = this.userParams.onBehalfOf_Type as BPOnBehalfOf
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.WhoIsReportingThisClaim,
        actual.type
      )
      this.global.review.onBehalfOf_TypeDescription = actual.result
      if (actual.type == EagleOnBehalfOfTypes.Other) {
        const promptToUse =
          this.userParams.userType == UserTypes.Agent
            ? FNOLServerPrompts.RelationshipToPolicyHolder_Agent
            : FNOLServerPrompts.RelationshipToPolicyHolder
        await this.CheckServerPromptAndRespond(
          promptToUse,
          this.userParams.onBehalfOf_PolicyHolderRelationship
        )
        this.global.review.onBehalfOf_OtherRelationshipToPolicyholder =
          this.userParams.onBehalfOf_PolicyHolderRelationship
      }
      if (this.userParams.claimReporterStopOnEdit) {
        return
      }
      await this.HandleClaimReporterInformation()
    } else {
      switch (this.userParams.userType) {
        case UserTypes.Internal:
        case UserTypes.Agent:
          await this.CheckServerPromptAndRespond(
            FNOLServerPrompts.ReportingFullNameInternal,
            this.userParams.reportingName
          )
          break
        default:
          await this.CheckServerPromptAndRespond(
            FNOLServerPrompts.ReportingFullName,
            this.userParams.reportingName
          )
      }
      this.global.review.policyholderFullName = this.userParams.reportingName
    }
    // We are going to have to edit if either of these are blank
    if (this.userParams.policy.email.trim() == '' || this.userParams.policy.phoneNumber == '') {
      await this.HandleContactInformation(
        this.userParams.editContactInformation_Phone,
        this.userParams.editContactInformation_Email
      )
      this.global.policy.phoneNumber = `+1${this.userParams.editContactInformation_Phone}`
      this.global.policy.email = this.userParams.editContactInformation_Email
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.UpdatedContactInformation,
        0,
        2 //+ this.PromptOffsetTracking
      )
    }
    // Not blank - do we wish to edit?
    else if (this.userParams.editContactInformation) {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.ContactInformation,
        1 // no
      )
      if (this.userParams.editContactStopOnEdit) {
        return
      } else {
        // editing...
        await this.HandleContactInformation(
          this.userParams.editContactInformation_Phone,
          this.userParams.editContactInformation_Email
        )
        this.global.policy.phoneNumber = `+1${this.userParams.editContactInformation_Phone}`
        this.global.policy.email = this.userParams.editContactInformation_Email
        // verify updates are ok
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.UpdatedContactInformation,
          0, //Yes
          2 //+ this.PromptOffsetTracking
        )
      }
    } else {
      // all good - no edits
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.ContactInformation,
        0, // Yes
        1 + this.promptOffsetTracking
      )
    }
    this.promptOffsetTracking = 0
  }

  async HandleClaimReporterInformation() {
    const titleLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard > div > div > div > div > div')
    const actualTitle = await titleLocator.innerText()
    expect(actualTitle).toBe(FNOLServerPromptText.ClaimReporterInformationTitle)
    const itemsInListLocator = this.page.frameLocator('#bp-widget').locator('.bpw-keyboard ul > li')
    const itemsInList = await itemsInListLocator.all()
    for (let index = 0; index < itemsInList.length; index++) {
      const labelText = await itemsInList[index].locator('> div').innerText()
      let targetText = ''
      switch (labelText) {
        case 'Claim Reporter First Name':
          targetText = this.userParams.onBehalfOf_FirstName
          this.global.review.onBehalfOf_FirstNameDescription = this.userParams.onBehalfOf_FirstName
          break
        case 'Claim Reporter Last Name':
          targetText = this.userParams.onBehalfOf_LastName
          this.global.review.onBehalfOf_LastNameDescription = this.userParams.onBehalfOf_LastName
          break
        case 'Claim Reporter Phone':
          targetText = this.userParams.onBehalfOf_Phone
          this.global.review.onBehalfOf_PhoneDescription = this.userParams.onBehalfOf_PhoneMatch
          break
        case 'Claim Reporter Phone Extension -- please ONLY enter numbers (no "x" or "ext")':
          targetText = this.userParams.onBehalfOf_PhoneExtension
          this.global.review.onBehalfOf_PhoneExtensionDescription =
            this.userParams.onBehalfOf_PhoneExtension
          break
        case 'Claim Reporter Email':
          targetText = this.userParams.onBehalfOf_Email
          this.global.review.onBehalfOf_EmailDescription = this.userParams.onBehalfOf_Email
          break
        case 'Claim Reporter Company':
          targetText = this.userParams.onBehalfOf_Company
          this.global.review.onBehalfOf_CompanyDescription = this.userParams.onBehalfOf_Company
          break
        default:
          throw new Error(
            `Error: Processing a Claim Reporter information item that is not yet defined: ${labelText}`
          )
      }
      const valueLocator = itemsInList[index].locator('> input')
      await valueLocator.fill(targetText)
    }
    //    this.global.ReportedByPolicyholderDescription = constants.OtherText.No
    const expectedButtonText = FNOLPromptLinks.Confirm
    const buttonLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard button')
      .nth(0)
    const actualButtonText = await buttonLocator.innerText()
    expect(actualButtonText).toBe(expectedButtonText)
    await buttonLocator.click()
    this.promptOffsetTracking = 1
  }

  async HandleContactInformation(newPhone: string | null = null, newEmail: string | null = null) {
    const titleLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard > div > div > div > div > div')
    const actualTitle = await titleLocator.innerText()
    expect(actualTitle).toBe(FNOLServerPromptText.ContactInformationTitle)

    const itemsInListLocator = this.page.frameLocator('#bp-widget').locator('.bpw-keyboard ul > li')
    const itemsInList = await itemsInListLocator.all()
    for (let index = 0; index < itemsInList.length; index++) {
      const labelText = await itemsInList[index].locator('> div').innerText()
      let targetText = ''
      switch (labelText) {
        case 'Email':
          targetText = newEmail == null ? this.userParams.policy.email : newEmail
          break
        case 'Phone':
          targetText = newPhone == null ? this.userParams.policy.phoneNumber : newPhone
          break
        default: {
          throw new Error(
            `Error: Processing a Contact information item that is not yet defined: ${labelText}`
          )
        }
      }
      const valueLocator = itemsInList[index].locator('> input')
      await valueLocator.fill(targetText)
    }
    //    this.global.ReportedByPolicyholderDescription = constants.OtherText.No
    const expectedButtonText = FNOLPromptLinks.Confirm
    const buttonLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard button')
      .nth(0)
    const actualButtonText = await buttonLocator.innerText()
    expect(actualButtonText).toBe(expectedButtonText)
    await buttonLocator.click()
  }

  async ValidateContactInformation(
    invalidEmail: string | null = null,
    invalidPhone: string | null = null
  ) {
    let emailListItemLocator: Locator | null = null
    let emailValidated = invalidEmail === null // if we are not checking this field, we are good
    let phoneListItemLocator: Locator | null = null
    let phoneValidated = invalidPhone === null // if we are not checking this field, we are good

    const titleLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard > div > div > div > div > div')
    const actualTitle = await titleLocator.innerText()
    expect(actualTitle).toBe(FNOLServerPromptText.ContactInformationTitle)

    if (invalidEmail != null) {
      emailListItemLocator = this.page
        .frameLocator('#bp-widget')
        .locator('.bpw-keyboard ul > li')
        .nth(0)
      const emailLabel = await emailListItemLocator.locator('> div').textContent()
      expect(emailLabel === 'Email').toBe(true)
      await emailListItemLocator.locator('> input').fill(invalidEmail)
    }

    if (invalidPhone != null) {
      phoneListItemLocator = this.page
        .frameLocator('#bp-widget')
        .locator('.bpw-keyboard ul > li')
        .nth(1)
      const phoneLabel = await phoneListItemLocator.locator('> div').textContent()
      expect(phoneLabel === 'Phone').toBe(true)
      await phoneListItemLocator.locator('> input').fill(invalidPhone)
    }

    const confirmButtonLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard button')
      .nth(0)
    await confirmButtonLocator.click()

    if (emailListItemLocator != null) {
      const emailValidationLocator = emailListItemLocator.locator('> span')
      const emailValidatorCount = await emailValidationLocator.count()
      const emailValidatorText = await emailValidationLocator.textContent()
      emailValidated = emailValidatorCount == 1 && emailValidatorText === ValidationText.Email
    }

    if (phoneListItemLocator != null) {
      const phoneValidationLocator = phoneListItemLocator.locator('> span')
      const phoneValidatorCount = await phoneValidationLocator.count()
      const phoneValidatorText = await phoneValidationLocator.textContent()
      phoneValidated = phoneValidatorCount == 1 && phoneValidatorText === ValidationText.Phone
    }

    return emailValidated && phoneValidated
  }

  async ValidateClaimReporter(
    invalidEmail: string | null = null,
    invalidPhone: string | null = null
  ) {
    let emailListItemLocator: Locator | null = null
    let emailValidated = invalidEmail === null // if we are not checking this field, we are good
    let phoneListItemLocator: Locator | null = null
    let phoneValidated = invalidPhone === null // if we are not checking this field, we are good

    const titleLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard > div > div > div > div > div')
    const actualTitle = await titleLocator.innerText()
    expect(actualTitle).toBe(FNOLServerPromptText.ClaimReporterInformationTitle)

    if (invalidEmail != null) {
      emailListItemLocator = this.page
        .frameLocator('#bp-widget')
        .locator('.bpw-keyboard ul > li')
        .nth(2)
      const emailLabel = await emailListItemLocator.locator('> div').textContent()
      expect(emailLabel === 'Claim Reporter Email').toBe(true)
      await emailListItemLocator.locator('> input').fill(invalidEmail)
    }

    if (invalidPhone != null) {
      phoneListItemLocator = this.page
        .frameLocator('#bp-widget')
        .locator('.bpw-keyboard ul > li')
        .nth(3)
      const phoneLabel = await phoneListItemLocator.locator('> div').textContent()
      expect(phoneLabel === 'Claim Reporter Phone').toBe(true)
      await phoneListItemLocator.locator('> input').fill(invalidPhone)
    }

    const confirmButtonLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard button')
      .nth(0)
    await confirmButtonLocator.click()

    if (emailListItemLocator != null) {
      const emailValidationLocator = emailListItemLocator.locator('> span')
      const emailValidatorCount = await emailValidationLocator.count()
      const emailValidatorText = await emailValidationLocator.textContent()
      emailValidated = emailValidatorCount == 1 && emailValidatorText === ValidationText.Email
    }

    if (phoneListItemLocator != null) {
      const phoneValidationLocator = phoneListItemLocator.locator('> span')
      const phoneValidatorCount = await phoneValidationLocator.count()
      const phoneValidatorText = await phoneValidationLocator.textContent()
      phoneValidated = phoneValidatorCount == 1 && phoneValidatorText === ValidationText.Phone
    }

    return emailValidated && phoneValidated
  }

  async ValidateClaimant(invalidEmail: string | null = null, invalidPhone: string | null = null) {
    let emailListItemLocator: Locator | null = null
    let emailValidated = invalidEmail === null // if we are not checking this field, we are good
    let phoneListItemLocator: Locator | null = null
    let phoneValidated = invalidPhone === null // if we are not checking this field, we are good

    const titleLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard > div > div > div > div > div')
    const actualTitle = await titleLocator.innerText()
    expect(actualTitle).toBe(FNOLServerPromptText.ThirdPartyClaimantInformationTitle)

    if (invalidEmail != null) {
      emailListItemLocator = this.page
        .frameLocator('#bp-widget')
        .locator('.bpw-keyboard ul > li')
        .nth(2)
      const emailLabel = await emailListItemLocator.locator('> div').textContent()
      expect(emailLabel === 'Claimant Email').toBe(true)
      await emailListItemLocator.locator('> input').fill(invalidEmail)
    }

    if (invalidPhone != null) {
      phoneListItemLocator = this.page
        .frameLocator('#bp-widget')
        .locator('.bpw-keyboard ul > li')
        .nth(3)
      const phoneLabel = await phoneListItemLocator.locator('> div').textContent()
      expect(phoneLabel === 'Claimant Phone').toBe(true)
      await phoneListItemLocator.locator('> input').fill(invalidPhone)
    }

    const confirmButtonLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard button')
      .nth(0)
    await confirmButtonLocator.click()

    if (emailListItemLocator != null) {
      const emailValidationLocator = emailListItemLocator.locator('> span')
      const emailValidatorCount = await emailValidationLocator.count()
      const emailValidatorText = await emailValidationLocator.textContent()
      emailValidated = emailValidatorCount == 1 && emailValidatorText === ValidationText.Email
    }

    if (phoneListItemLocator != null) {
      const phoneValidationLocator = phoneListItemLocator.locator('> span')
      const phoneValidatorCount = await phoneValidationLocator.count()
      const phoneValidatorText = await phoneValidationLocator.textContent()
      phoneValidated = phoneValidatorCount == 1 && phoneValidatorText === ValidationText.Phone
    }

    return emailValidated && phoneValidated
  }

  async ValidateAttorney(invalidEmail: string | null = null, invalidPhone: string | null = null) {
    let emailListItemLocator: Locator | null = null
    let emailValidated = invalidEmail === null // if we are not checking this field, we are good
    let phoneListItemLocator: Locator | null = null
    let phoneValidated = invalidPhone === null // if we are not checking this field, we are good

    const titleLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard > div > div > div > div > div')
    const actualTitle = await titleLocator.innerText()
    expect(actualTitle).toBe(FNOLServerPromptText.AttorneyInformationTitle)

    if (invalidEmail != null) {
      emailListItemLocator = this.page
        .frameLocator('#bp-widget')
        .locator('.bpw-keyboard ul > li')
        .nth(2)
      const emailLabel = await emailListItemLocator.locator('> div').textContent()
      expect(emailLabel === 'Attorney Email').toBe(true)
      await emailListItemLocator.locator('> input').fill(invalidEmail)
    }

    if (invalidPhone != null) {
      phoneListItemLocator = this.page
        .frameLocator('#bp-widget')
        .locator('.bpw-keyboard ul > li')
        .nth(3)
      const phoneLabel = await phoneListItemLocator.locator('> div').textContent()
      expect(phoneLabel === 'Attorney Phone').toBe(true)
      await phoneListItemLocator.locator('> input').fill(invalidPhone)
    }

    const confirmButtonLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard button')
      .nth(0)
    await confirmButtonLocator.click()

    if (emailListItemLocator != null) {
      const emailValidationLocator = emailListItemLocator.locator('> span')
      const emailValidatorCount = await emailValidationLocator.count()
      const emailValidatorText = await emailValidationLocator.textContent()
      emailValidated = emailValidatorCount == 1 && emailValidatorText === ValidationText.Email
    }

    if (phoneListItemLocator != null) {
      const phoneValidationLocator = phoneListItemLocator.locator('> span')
      const phoneValidatorCount = await phoneValidationLocator.count()
      const phoneValidatorText = await phoneValidationLocator.textContent()
      phoneValidated = phoneValidatorCount == 1 && phoneValidatorText === ValidationText.Phone
    }

    return emailValidated && phoneValidated
  }

  async ValidatePlumbing(invalidPhone: string) {
    const titleLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard > div > div > div > div > div')
    const actualTitle = await titleLocator.innerText()
    expect(actualTitle).toBe(FNOLServerPromptText.PlumberInformationTitle)
    const phoneListItemLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard ul > li')
      .nth(1)
    const phoneLabel = await phoneListItemLocator.locator('> div').textContent()
    expect(phoneLabel === 'Plumbing Company Phone').toBe(true)
    await phoneListItemLocator.locator('> input').fill(invalidPhone)

    const confirmButtonLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard button')
      .nth(0)
    await confirmButtonLocator.click()

    const phoneValidationLocator = phoneListItemLocator.locator('> span')
    const phoneValidatorCount = await phoneValidationLocator.count()
    const phoneValidatorText = await phoneValidationLocator.textContent()
    const phoneValidated = phoneValidatorCount == 1 && phoneValidatorText === ValidationText.Phone

    return phoneValidated
  }

  async ValidateHVAC(invalidPhone: string) {
    const titleLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard > div > div > div > div > div')
    const actualTitle = await titleLocator.innerText()
    expect(actualTitle).toBe(FNOLServerPromptText.HVACInformationTitle)
    const phoneListItemLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard ul > li')
      .nth(1)
    const phoneLabel = await phoneListItemLocator.locator('> div').textContent()
    expect(phoneLabel === 'HVAC Company Phone').toBe(true)
    await phoneListItemLocator.locator('> input').fill(invalidPhone)

    const confirmButtonLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard button')
      .nth(0)
    await confirmButtonLocator.click()

    const phoneValidationLocator = phoneListItemLocator.locator('> span')
    const phoneValidatorCount = await phoneValidationLocator.count()
    const phoneValidatorText = await phoneValidationLocator.textContent()
    const phoneValidated = phoneValidatorCount == 1 && phoneValidatorText === ValidationText.Phone

    return phoneValidated
  }

  async HandleLiabilityInformation() {
    const titleLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard > div > div > div > div > div')
    const actualTitle = await titleLocator.innerText()
    expect(actualTitle).toBe(FNOLServerPromptText.LiabilityInformationTitle)

    const itemsInListLocator = this.page.frameLocator('#bp-widget').locator('.bpw-keyboard ul > li')
    const itemsInList = await itemsInListLocator.all()
    let propertyText = ' '
    let injuryText = ' '
    let animalText = ' '
    let otherText = ' '
    for (let index = 0; index < itemsInList.length; index++) {
      const labelText = await itemsInList[index].locator('> div').innerText()
      let targetText = ''
      switch (labelText) {
        case 'Third-Party Property Damage Type(s)':
          propertyText = ` ${this.liabilityParams.propertyDamage} `
          targetText = this.liabilityParams.propertyDamage
          break
        case 'Injury to Third Party':
          injuryText = ` ${this.liabilityParams.injury} `
          targetText = this.liabilityParams.injury
          break
        case 'Type(s) of Animal(s) Involved':
          animalText = ` ${this.liabilityParams.animal} `
          targetText = this.liabilityParams.animal
          break
        case 'Description of Loss':
          otherText = ` ${this.liabilityParams.other}`
          targetText = this.liabilityParams.other
          break
        default:
          throw new Error(
            `Error: Processing a liability information item that is not yet defined: ${labelText}`
          )
      }
      const valueLocator = itemsInList[index].locator('> input')
      await valueLocator.fill(targetText)
    }

    const expectedButtonText = FNOLPromptLinks.Confirm
    const buttonLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard button')
      .nth(0)
    const actualButtonText = await buttonLocator.innerText()
    expect(actualButtonText).toBe(expectedButtonText)
    await buttonLocator.click()

    this.global.review.detailedLossDescription = this.global.review.detailedLossDescription.replace(
      '<PROPERTY>',
      `${propertyText}`
    )
    this.global.review.detailedLossDescription = this.global.review.detailedLossDescription.replace(
      '<INJURY>',
      `${injuryText}`
    )
    this.global.review.detailedLossDescription = this.global.review.detailedLossDescription.replace(
      '<ANIMAL>',
      `${animalText}`
    )
    this.global.review.detailedLossDescription = this.global.review.detailedLossDescription.replace(
      '<OTHER>',
      `${otherText}`
    )
    this.global.review.freeFormLossDescription = this.global.review.detailedLossDescription
  }

  async HandleClaimantInformation() {
    const titleLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard > div > div > div > div > div')
    const actualTitle = await titleLocator.innerText()
    expect(actualTitle).toBe(FNOLServerPromptText.ThirdPartyClaimantInformationTitle)

    const itemsInListLocator = this.page.frameLocator('#bp-widget').locator('.bpw-keyboard ul > li')
    const itemsInList = await itemsInListLocator.all()
    for (let index = 0; index < itemsInList.length; index++) {
      const labelText = await itemsInList[index].locator('> div').innerText()
      let targetText = ''
      switch (labelText) {
        case 'Claimant First Name':
          targetText = this.liabilityParams.claimant_FirstName
            ? this.liabilityParams.claimant_FirstName
            : ''
          break
        case 'Claimant Last Name':
          targetText = this.liabilityParams.claimant_LastName
            ? this.liabilityParams.claimant_LastName
            : ''
          break
        case 'Claimant Email':
          targetText = this.liabilityParams.claimant_Email
          break
        case 'Claimant Phone':
          targetText = this.liabilityParams.claimant_Phone_Match
          break
        case 'Claimant Phone Extension -- please ONLY enter numbers (no "x" or "ext")':
          targetText = this.liabilityParams.claimant_PhoneExtension
          break
        default:
          throw new Error(
            `Error: Processing a claimant information item that is not yet defined: ${labelText}`
          )
      }
      const valueLocator = itemsInList[index].locator('> input')
      await valueLocator.fill(targetText)
    }
    const expectedButtonText = FNOLPromptLinks.Confirm
    const buttonLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard button')
      .nth(0)
    const actualButtonText = await buttonLocator.innerText()
    expect(actualButtonText).toBe(expectedButtonText)
    await buttonLocator.click()
  }

  async HandleAttorneyInformation() {
    const titleLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard > div > div > div > div > div')
    const actualTitle = await titleLocator.innerText()
    expect(actualTitle).toBe(FNOLServerPromptText.AttorneyInformationTitle)

    const itemsInListLocator = this.page.frameLocator('#bp-widget').locator('.bpw-keyboard ul > li')
    const itemsInList = await itemsInListLocator.all()
    for (let index = 0; index < itemsInList.length; index++) {
      const labelText = await itemsInList[index].locator('> div').innerText()
      let targetText = ''
      switch (labelText) {
        case 'Attorney First Name':
          targetText = this.liabilityParams.attorney_FirstName
            ? this.liabilityParams.attorney_FirstName
            : ''
          break
        case 'Attorney Last Name':
          targetText = this.liabilityParams.attorney_LastName
            ? this.liabilityParams.attorney_LastName
            : ''
          break
        case 'Attorney Email':
          targetText = this.liabilityParams.attorney_Email
          break
        case 'Attorney Phone':
          targetText = this.liabilityParams.attorney_Phone_Match
          break
        case 'Attorney Phone Extension -- please ONLY enter numbers (no "x" or "ext")':
          targetText = this.liabilityParams.attorney_PhoneExtension
          break
        default:
          throw new Error(
            `Error: Processing a claimant information item that is not yet defined: ${labelText}`
          )
      }
      const valueLocator = itemsInList[index].locator('> input')
      await valueLocator.fill(targetText)
    }
    const expectedButtonText = FNOLPromptLinks.Confirm
    const buttonLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard button')
      .nth(0)
    const actualButtonText = await buttonLocator.innerText()
    expect(actualButtonText).toBe(expectedButtonText)
    await buttonLocator.click()
  }

  async HandleLiability(liabilities: number) {
    await this.CheckServerPrompt(
      FNOLServerPrompts.SelectLiabilityType,
      this.userParams.undoTopic != null ? 3 : 1
    )
    this.userParams.undoTopic = null
    let expectedUserEcho = ''
    let reviewDescription = ''
    for (const liabilityKey in Object.keys(Liability)) {
      const liability = Object.values(Liability)[liabilityKey]
      if (liabilities & liability.type) {
        const selectionLocator = this.page
          .frameLocator('#bp-widget')
          .locator(`.bpw-keyboard .multiselect label[for="${liability.id}"]`)
        await selectionLocator.click()
        const concat = expectedUserEcho.length == 0 ? '' : ', '
        const reviewConcat = reviewDescription.length == 0 ? '' : ','
        expectedUserEcho += `${concat}${liability.echo}`
        reviewDescription += `${reviewConcat}${liability.result}`
      }
    }
    const buttonSelector = this.page.frameLocator('#bp-widget').locator('.bpw-keyboard .trigger')
    await buttonSelector.click()
    this.conversationIndex += 1
    await this.VerifyUserEchoText(expectedUserEcho)
    this.conversationIndex += 1
    this.global.review.damageReasonDescription = 'LiabilityInjuryPhysicalDamage'
    this.global.review.detailedLossDescription = `Liability Type(s): ${reviewDescription} \\n Third-Party Property Damage Type(s):<PROPERTY>\\n Injury to Third Party:<INJURY>\\n Type(s) of Animal(s) Involved:<ANIMAL>\\n Description of Loss:<OTHER>`
  }

  async HandleLiabilityFlow(liabilities: number, stopBeforeSubmit: boolean = true) {
    this.finishParams.isLiability = true
    if (this.userParams.undoTopic == null) {
      await this.HandleDamageReason(EagleDamageReasonTypes.Liability)
    }

    await this.HandleLiability(liabilities)
    await this.HandleLiabilityInformation()

    await this.CheckServerPrompt(FNOLServerPrompts.LiabilityInformation, 1)
    await this.CheckServerPrompt(FNOLServerPrompts.RetainLiabilityRecords, 2)
    if (
      this.liabilityParams.claimant_FirstName != null &&
      this.liabilityParams.claimant_LastName != null
    ) {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.AddThirdPartyClaimant,
        0, // Add
        3
      )
      if (this.userParams.thirdPartyClaimantStopOnEdit) {
        return
      }
      await this.HandleClaimantInformation()
      await this.CheckServerPrompt(FNOLServerPrompts.ThirdPartyClaimantInformation)
      this.promptOffsetTracking = 1
    } else {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.AddThirdPartyClaimant,
        1, // Skip
        3
      )
      this.promptOffsetTracking = 0
    }

    if (
      this.liabilityParams.attorney_FirstName != null &&
      this.liabilityParams.attorney_LastName != null
    ) {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.AddAttorney,
        0, // Add
        1 + this.promptOffsetTracking
      )
      if (this.userParams.attorneyStopOnEdit) {
        return
      }
      await this.HandleAttorneyInformation()
      await this.CheckServerPrompt(FNOLServerPrompts.AttorneyInformation)
      this.promptOffsetTracking = 1
    } else {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.AddAttorney,
        1, // Skip
        1 + this.promptOffsetTracking
      )
      this.promptOffsetTracking = 0
    }
    this.finishParams.stopBeforeSubmit = stopBeforeSubmit
    this.finishParams.skipBigChunk = true
  }

  async HandleUserPolicyLookup(userParams: BPUserParameters) {
    switch (userParams.userType) {
      case UserTypes.Internal:
      case UserTypes.Agent:
        await this.CheckServerPromptAndSelectLink(FNOLServerPrompts.WhatIsYourPolicyNumber, 0, 2)
        await this.CheckServerPrompt(FNOLServerPrompts.PolicyLookupLastName_Intro, 5)
        await this.CheckServerPromptAndRespond(
          FNOLServerPrompts.PolicyLookupLastName_FirstTry,
          userParams.policy.lastName.trim(),
          6
        )
        break
      default:
        await this.CheckServerPromptAndSelectLink(FNOLServerPrompts.WhatIsYourPolicyNumber, 0, 2)
        await this.CheckServerPrompt(FNOLServerPrompts.PolicyLookupLastName_Intro, 5)
        await this.CheckServerPromptAndRespond(
          FNOLServerPrompts.PolicyLookupLastName_FirstTry,
          userParams.policy.lastName.trim(),
          6
        )
    }
    await this.CheckServerPromptAndRespond(
      FNOLServerPrompts.PolicyLookupHouseNumber,
      userParams.policy.houseNumber
    )
    await this.CheckServerPromptAndRespond(FNOLServerPrompts.PolicyLookupZip, userParams.policy.zip)
    if (userParams.expectSuccessOnLookup) {
      // await this.CheckServerPromptAndSelectButton(
      //   FNOLServerPrompts.ValidatePolicyHolder_PolicyWasEntered,
      //   0
      // )
      // await this.HandleContactInfo(userParams)
    }
  }

  async HandleLossDate(lossDateOrDelta: string | number) {
    await this.CheckServerPrompt(
      FNOLServerPrompts.WhenDidThisLossOccur,
      1 // + this.PromptOffsetTracking
    )
    let lossDate: string | number
    if (typeof lossDateOrDelta == 'string') {
      lossDate = lossDateOrDelta
    } else {
      const dateToday = new Date()
      lossDate = dateToday.setDate(dateToday.getDate() - lossDateOrDelta)
    }
    const matchDate = await SubmitDateToCalendar(lossDate)
    expect(matchDate).not.toBe(null)
    this.conversationIndex += 1
    await this.VerifyUserEchoText(matchDate ? matchDate : '')
    this.conversationIndex += 1
    this.global.review.dateOfLossDescription = matchDate ? matchDate : 'null'
    //this.PromptOffsetTracking = 0
  }

  async HandleLossAssessmentDate(lossAssessmentDateOrDelta: string | number) {
    await this.CheckServerPrompt(
      FNOLServerPrompts.LossAssessmentDate,
      this.userParams.undoTopic != null ? 5 : 1
    )
    this.userParams.undoTopic = null
    let lossAssessmentDate: string | number
    if (typeof lossAssessmentDateOrDelta == 'string') {
      lossAssessmentDate = lossAssessmentDateOrDelta
    } else {
      const dateToday = new Date()
      lossAssessmentDate = dateToday.setDate(dateToday.getDate() - lossAssessmentDateOrDelta)
    }
    const matchDate = await SubmitDateToCalendar(lossAssessmentDate)
    expect(matchDate).not.toBe(null)
    this.conversationIndex += 1
    await this.VerifyUserEchoText(matchDate ? matchDate : '')
    this.conversationIndex += 1
    this.global.review.lossAssessment_DateDescription = matchDate ? matchDate : ''
    // this.PromptOffsetTracking = 0;
  }

  async HandleDefaultUserValidation() {
    if (this.userParams.undoTopic == null) {
      await this.HandleIntroduction()
      if (!this.userParams.policyNumberWasProvided) {
        if (this.userParams.performPolicyLookup) {
          await this.HandleUserPolicyLookup(this.userParams)
          if (this.userParams.stopAfterPolicyLookup) {
            return
          }
          this.promptOffsetTracking = 0
        } else {
          await this.HandleUserPolicy(this.userParams)
          if (this.userParams.userType == UserTypes.NotSpecified) {
            if (!this.userParams.stopBeforeZIPVerification) {
              await this.CheckServerPromptAndRespond(
                FNOLServerPrompts.ZipValidation,
                this.userParams.policy.zip,
                1
              )
            } else {
              return
            }
          }
        }
      }
    }
    await this.HandleUserPolicyholder()
    if (!this.userParams.editContactStopOnEdit && !this.userParams.claimReporterStopOnEdit) {
      await this.HandleLossDate(this.userParams.lossDateDelta)
    }
  }

  async HandleDamageReason(
    damageReasonType: null | EagleDamageReasonTypes = null,
    skipTheftHandling = false
  ) {
    let damageReasonTypeToUse = null
    let eventListIndexMatch = -1
    let skipDamageReasonPrompt = false
    if (
      this.userParams.expectedWeatherEvents != null &&
      this.userParams.expectedWeatherEvents.length > 0
    ) {
      await this.page.waitForTimeout(2000)
      const weatherListOptionsLocator = this.page
        .frameLocator('#bp-widget')
        .locator(`.bpw-keyboard ul li div`)
      const weatherEventList = await weatherListOptionsLocator.allTextContents()
      if (weatherEventList.length > 0) {
        // Handle if there is a list of events....
        const weatherEventToSelect =
          this.userParams.weatherEventChoice == null
            ? OtherText.NoNamedEvent
            : this.userParams.weatherEventChoice
        await this.CheckServerPrompt(FNOLServerPrompts.ReportClaimForWeatherEventSelection, 1)
        // find and select the weather event or choose no named event
        for (let index = 0; index < weatherEventList.length; index++) {
          if (weatherEventToSelect === weatherEventList[index]) {
            eventListIndexMatch = index
            break
          }
        }
        expect(eventListIndexMatch).not.toBe(-1)
        await weatherListOptionsLocator.nth(eventListIndexMatch).click()
        if (this.userParams.weatherEventChoice != null) {
          damageReasonTypeToUse = this.userParams.expectedWeatherEvents[0].lossType // first pushed is our choice
          this.conversationIndex += 1
          await this.VerifyUserEchoText(this.userParams.weatherEventChoice)
          this.conversationIndex += 1
          this.global.review.damageReasonDescription =
            Object.values(DamageReason)[damageReasonTypeToUse].result.toUpperCase()
          this.global.review.currentWeatherEventName = this.userParams.weatherEventChoice
          skipDamageReasonPrompt = true
        } else {
          this.conversationIndex += 1
          await this.VerifyUserEchoText(OtherText.NoNamedEvent)
          this.conversationIndex += 1
        }
      } else {
        // handle the single inline weather prompt
        if (this.userParams.weatherEventChoice != null) {
          await this.CheckServerPromptAndSelectButton(
            FNOLServerPrompts.ReportClaimForWeatherEventSingle,
            0
          )
          damageReasonTypeToUse = this.userParams.expectedWeatherEvents[0].lossType
          this.global.review.damageReasonDescription =
            Object.values(DamageReason)[damageReasonTypeToUse].result.toUpperCase()
          this.global.review.currentWeatherEventName = this.userParams.weatherEventChoice
          skipDamageReasonPrompt = true
        } else {
          this.userParams.weatherEventChoice = this.userParams.expectedWeatherEvents[0].name
          await this.CheckServerPromptAndSelectButton(
            FNOLServerPrompts.ReportClaimForWeatherEventSingle,
            1
          )
          this.userParams.weatherEventChoice = null
        }
      }
      await this.page.waitForTimeout(2000)
    }

    if (!skipDamageReasonPrompt) {
      // If we are here, there is no weather event or there was a weather event and we chose not to select it
      if (damageReasonType == null) {
        damageReasonTypeToUse = this.userParams.policy.damageReason
      } else {
        damageReasonTypeToUse = damageReasonType
      }
      const damageReason = Object.values(DamageReason)[damageReasonTypeToUse]
      await this.CheckServerPrompt(
        FNOLServerPrompts.WhatTypeOfLossDidThePropertySustain,
        1 + (this.userParams.undoTopic != null ? 1 : 0)
      )
      this.userParams.undoTopic = null
      // click them More button if we need to
      if (damageReasonTypeToUse >= this.global.damageReasonFold) {
        const locator = this.page.frameLocator('#bp-widget').locator(`.bpw-keyboard ul .bpw-button`)
        await locator.click()
      }
      // Click the chosen damage link
      const locator = this.page
        .frameLocator('#bp-widget')
        .locator(`.bpw-keyboard ul li`)
        .nth(damageReason.type)
      await locator.click()

      this.conversationIndex += 1
      await this.VerifyUserEchoText(damageReason.link)
      this.conversationIndex += 1
      this.global.review.damageReasonDescription = damageReason.result
    }
    if (damageReasonTypeToUse == EagleDamageReasonTypes.Theft && !skipTheftHandling) {
      await this.HandleTheftDamageFlow()
    }

    if (damageReasonTypeToUse == EagleDamageReasonTypes.LossAssessment) {
      await this.HandleLossAssessmentFlow()
      this.finishParams.isLossAssessment = true
    }

    if (damageReasonTypeToUse == EagleDamageReasonTypes.Water) {
      await this.HandleOriginOfWaterDamageFlow()
    }
  }

  async HandleLossAssessmentFlow() {
    await this.HandleLossAssessmentDate(this.userParams.lossAssessment_DateDelta)

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    })
    const amountEcho = formatter.format(parseFloat(this.userParams.lossAssessment_Amount))
    await this.CheckServerPromptAndRespond(
      FNOLServerPrompts.LossAssessmentAmount,
      this.userParams.lossAssessment_Amount,
      1,
      null,
      amountEcho
    )
    this.global.review.lossAssessment_AmountDescription = this.userParams.lossAssessment_Amount

    await this.CheckServerPromptAndSelectButton(
      FNOLServerPrompts.LossAssessmentWeatherRelated,
      this.userParams.lossAssessment_WeatherRelated ? 0 : 1 // yes : no
    )
    this.global.review.lossAssessment_WeatherRelatedDescription = this.userParams
      .lossAssessment_WeatherRelated
      ? OtherText.Yes
      : OtherText.No

    await this.CheckServerPromptAndRespond(
      FNOLServerPrompts.LossAssessmentReason,
      this.userParams.lossAssessment_Reason
    )
    this.global.review.lossAssessment_ReasonDescription = this.userParams.lossAssessment_Reason
    this.global.review.freeFormLossDescription = this.userParams.lossAssessment_Reason

    //this.global.LossAssessment_HasLetter = this.userParams.LossAssessment_HaveLetter ? constants.OtherText.Yes : constants.OtherText.No;
    if (this.userParams.lossAssessment_HaveLetter) {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.LossAssessmentLetter,
        0 // yes
      )

      if (this.userParams.lossAssessment_LetterToUpload != null) {
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.UploadAssessmentLetterNow,
          1, // Up  load
          1,
          null,
          true
        )
        await this.CheckServerPrompt(FNOLServerPrompts.ClickBelowToAddDocument)
        const fullPathToAssessment =
          this.global.uploadFolder + '//' + this.userParams.lossAssessment_LetterToUpload
        const inputLocator = this.page.frameLocator('#bp-widget').locator('.bpw-keyboard input')
        await inputLocator.setInputFiles(fullPathToAssessment)

        const buttonIndex = 2
        const buttonLocator = this.page
          .frameLocator('#bp-widget')
          .locator(`.bpw-keyboard button:nth-of-type(${buttonIndex})`)
        const actualButtonText = await buttonLocator.textContent()
        expect(actualButtonText).toBe(FNOLPromptLinks.Upload)
        await buttonLocator.click()
      } else {
        await this.CheckServerPrompt(FNOLServerPrompts.UploadAssessmentLetterNow)

        await this.SelectServerButton(
          FNOLServerPrompts.UploadAssessmentLetterNow,
          0, // I don't have it
          true
        )
      }
      //this.PromptOffsetTracking += 1;
    } else {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.LossAssessmentLetter,
        1, // no
        1,
        null,
        true
      )
      this.conversationIndex += 2
    }
  }

  async HandleTheftDamageFlow() {
    await this.CheckServerPromptAndSelectButton(
      FNOLServerPrompts.DidThisTheftOccurAtYourResidence,
      this.userParams.theft_OnPremises ? 0 : 1, // yes:no
      this.userParams.undoTopic != null ? 2 : 1
    )
    this.global.review.theft_OnPremises = this.userParams.theft_OnPremises
      ? OtherText.Yes
      : OtherText.No
    if (this.userParams.theft_OnPremises) {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.WasTherePhysicalDamageToTheResidence,
        this.userParams.theft_PhysicalDamage ? 0 : 1 // yes:no
      )
      this.global.review.theft_PhysicalDamageDescription = this.userParams.theft_PhysicalDamage
        ? OtherText.Yes
        : OtherText.No
    } else {
      await this.CheckServerPromptAndRespond(
        FNOLServerPrompts.WhereDidThisTheftOccur,
        this.userParams.theft_OffPremisesLocation
      )
      this.global.review.theft_OffPremisesLocation = this.userParams.theft_OffPremisesLocation
    }

    this.userParams.undoTopic = null

    await this.CheckServerPromptAndRespond(
      FNOLServerPrompts.DescribeWhatWasStolen,
      this.userParams.theft_Description
    )
    this.global.review.theft_TheftDescription = this.userParams.theft_Description

    await this.CheckServerPromptAndSelectButton(
      FNOLServerPrompts.HaveYouFiledAPoliceReport,
      this.userParams.theft_FiledPoliceReport ? 0 : 1 // yes:no
    )
    this.global.review.theft_PoliceReportFiledDescription = this.userParams.theft_FiledPoliceReport
      ? OtherText.Yes
      : OtherText.No

    if (this.userParams.theft_FiledPoliceReport) {
      if (this.userParams.theft_PoliceReportNumber == '') {
        await this.CheckServerPromptAndSelectLink(
          FNOLServerPrompts.DoYouHaveThePoliceReportNumber,
          0
        )
        // TBD click the I don't have it link
        this.global.review.theft_PoliceReportNumberDescription = OtherText.True.toLowerCase()
      } else {
        await this.CheckServerPromptAndRespond(
          FNOLServerPrompts.DoYouHaveThePoliceReportNumber,
          this.userParams.theft_PoliceReportNumber
        )
        this.global.review.theft_PoliceReportNumberDescription =
          this.userParams.theft_PoliceReportNumber
      }
    }
  }

  async HandleOriginOfWaterDamageFlow() {
    if (this.userParams.originOfWaterDamage == null || this.userParams.plumbingType == null) {
      throw new Error('Something was not initialized')
    }
    if (this.userParams.userType == UserTypes.Internal) {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.HasTheWaterBeenTurnedOff,
        this.userParams.waterTurnedOff ? 0 : 1,
        this.userParams.undoTopic != null ? 2 : 1
      )
      this.global.review.water_IsTurnedOff = this.userParams.waterTurnedOff
        ? OtherText.Yes
        : OtherText.No
    }
    await this.CheckServerPromptAndSelectButton(
      FNOLServerPrompts.WhatCausedTheWaterDamage,
      this.userParams.originOfWaterDamage.type,
      this.userParams.undoTopic != null ? 2 : 1
    )
    this.global.review.originOfWaterDamageDescription = this.userParams.originOfWaterDamage.result
    this.userParams.undoTopic = null

    if (this.userParams.originOfWaterDamage.type == EagleWaterDamageTypes.Plumbing) {
      await this.HandlePlumbingTypeFlow()
    }

    if (
      (this.userParams.userType == UserTypes.Internal &&
        this.userParams.originOfWaterDamage.type) == EagleWaterDamageTypes.HVAC
    ) {
      await this.HandleHVACTypeFlow()
    }
  }

  async HandlePlumbingTypeFlow() {
    if (this.userParams.plumbingType == null) {
      throw new Error('Something was not initialized')
    }
    await this.CheckServerPromptAndSelectButton(
      FNOLServerPrompts.WhatTypeOfPlumbing,
      this.userParams.plumbingType.type
      //this.userParams.undoTopic != null ? 2 : 1
    )
    this.global.review.typeOfPlumbingDescription = this.userParams.plumbingType.result

    if (this.userParams.userType == UserTypes.Internal) {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.HasPlumberRepairedTheDamage,
        this.userParams.plumber_Contacted ? 0 : 1
      )
      this.global.review.water_Plumber_Contacted = this.userParams.plumber_Contacted
        ? OtherText.Yes
        : OtherText.No

      if (this.userParams.plumber_Contacted && !this.userParams.plumber_StopOnEdit) {
        await this.HandlePlumbingInformation()
      }
    }
  }

  async HandlePlumbingInformation() {
    const titleLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard > div > div > div > div > div')
    const actualTitle = await titleLocator.innerText()
    expect(actualTitle).toBe(FNOLServerPromptText.PlumberInformationTitle)
    const itemsInListLocator = this.page.frameLocator('#bp-widget').locator('.bpw-keyboard ul > li')
    const itemsInList = await itemsInListLocator.all()
    for (let index = 0; index < itemsInList.length; index++) {
      const labelText = await itemsInList[index].locator('> div').innerText()
      let targetText = ''
      switch (labelText) {
        case 'Plumbing Company Name':
          targetText = this.userParams.plumber_Company
          this.global.review.water_Plumber_CompanyName = this.userParams.plumber_Company
          break
        case 'Plumbing Company Phone':
          targetText = this.userParams.plumber_Phone
          this.global.review.water_Plumber_PhoneDescription = this.userParams.plumber_PhoneMatch
          break
        default:
          throw new Error(
            `Error: Processing a Plumber information item that is not yet defined: ${labelText}`
          )
      }
      const valueLocator = itemsInList[index].locator('> input')
      await valueLocator.fill(targetText)
    }
    const expectedButtonText = FNOLPromptLinks.Confirm
    const buttonLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard button')
      .nth(0)
    const actualButtonText = await buttonLocator.innerText()
    expect(actualButtonText).toBe(expectedButtonText)
    await buttonLocator.click()
    this.promptOffsetTracking = 1
  }

  async HandleHVACTypeFlow() {
    await this.CheckServerPromptAndSelectButton(
      FNOLServerPrompts.HasHVACCompanyRepairedTheIssue,
      this.userParams.hvac_Repaired ? 0 : 1
    )
    this.global.review.water_HVAC_Repaired = this.userParams.hvac_Repaired
      ? OtherText.Yes
      : OtherText.No

    if (this.userParams.hvac_Repaired && !this.userParams.hvac_StopOnEdit) {
      await this.HandleHVACInformation()
    }
  }

  async HandleHVACInformation() {
    const titleLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard > div > div > div > div > div')
    const actualTitle = await titleLocator.innerText()
    expect(actualTitle).toBe(FNOLServerPromptText.HVACInformationTitle)
    const itemsInListLocator = this.page.frameLocator('#bp-widget').locator('.bpw-keyboard ul > li')
    const itemsInList = await itemsInListLocator.all()
    for (let index = 0; index < itemsInList.length; index++) {
      const labelText = await itemsInList[index].locator('> div').innerText()
      let targetText = ''
      switch (labelText) {
        case 'HVAC Company Name':
          targetText = this.userParams.hvac_Company
          this.global.review.water_HVAC_CompanyName = this.userParams.hvac_Company
          break
        case 'HVAC Company Phone':
          targetText = this.userParams.hvac_Phone
          this.global.review.water_HVAC_PhoneDescription = this.userParams.hvac_PhoneMatch
          break
        default:
          throw new Error(
            `Error: Processing a HVAC Company information item that is not yet defined: ${labelText}`
          )
      }
      const valueLocator = itemsInList[index].locator('> input')
      await valueLocator.fill(targetText)
    }
    const expectedButtonText = FNOLPromptLinks.Confirm
    const buttonLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard button')
      .nth(0)
    const actualButtonText = await buttonLocator.innerText()
    expect(actualButtonText).toBe(expectedButtonText)
    await buttonLocator.click()
    this.promptOffsetTracking = 1
  }

  async HandleDamageAreas(damageAreas: number, mitigation = GetRandomMitigations()) {
    await this.CheckServerPrompt(
      FNOLServerPrompts.WhereDidTheDamageOccur,
      1 + this.promptOffsetTracking + (this.userParams.undoTopic == 'Damaged Areas' ? 1 : 0)
    )
    this.userParams.undoTopic = null
    let expectedUserEcho = ''
    let reviewDescription = ''
    let additionalDamageDescription = ''
    this.userParams.isContentsOrPersonalPropertyOnly =
      damageAreas == EagleDamageAreaTypes.ContentsOrPersonalProperty
    for (const damageAreaKey in Object.keys(DamageArea)) {
      const damageArea = Object.values(DamageArea)[damageAreaKey]
      if (damageAreas & damageArea.type) {
        const selectionLocator = this.page
          .frameLocator('#bp-widget')
          .locator(`.bpw-keyboard .multiselect label[for="${damageArea.id}"]`)
        await selectionLocator.click()
        const concat = expectedUserEcho.length == 0 ? '' : ', '
        const reviewConcat = reviewDescription.length == 0 ? '' : ','
        const additionalConcat =
          additionalDamageDescription.length > 0 && damageArea.additional.length > 0 ? ',' : ''
        expectedUserEcho += `${concat}${damageArea.echo}`
        reviewDescription += `${reviewConcat}${damageArea.result}`
        additionalDamageDescription += `${additionalConcat}${damageArea.additional}`
      }
    }
    this.global.review.damageLocationDescription = reviewDescription
    const buttonSelector = this.page.frameLocator('#bp-widget').locator('.bpw-keyboard .trigger')
    await buttonSelector.click()
    this.conversationIndex += 1
    await this.VerifyUserEchoText(expectedUserEcho)
    this.conversationIndex += 1
    this.promptOffsetTracking = 0
    this.userParams.undoTopic = null
    await this.HandleMitigationQuestion(mitigation)
  }

  async HandleMitigationQuestion(mitigation: Mitigations) {
    switch (mitigation) {
      case Mitigations.Mitigation_Yes:
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.HaveStepsBeenTakenToContainTheDamage,
          0 // Yes - mitigation performed
        )
        this.global.review.mitigationStepsCompleted = OtherText.Yes
        break
      case Mitigations.Mitigation_No:
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.HaveStepsBeenTakenToContainTheDamage,
          1 // No - mitigation not performed
        )
        this.global.review.mitigationStepsCompleted = OtherText.No
        break
      default:
        throw new Error(
          `Error: Processing a Mitigation option that is not yet defined: Mitigation passed was ${mitigation}`
        )
    }

    if (mitigation == Mitigations.Mitigation_Yes) {
      await this.CheckServerPrompt(FNOLServerPrompts.RetainRepairRecords)
      const stepsTakenDescription = 'I did as little as possible'
      await this.CheckServerPromptAndRespond(
        FNOLServerPrompts.MitigationStepsDescription,
        stepsTakenDescription,
        2
      )
      this.global.review.mitigationStepsDescription = stepsTakenDescription
    }
  }

  async HandleInteriorDamageFlow(numberOfRooms = GetRandomInteriorRooms()) {
    const promptToUse = this.userParams.isPostStorm
      ? FNOLServerPrompts.PostStorm_Interior_HowManyRoomsWereAffected
      : FNOLServerPrompts.Interior_HowManyRoomsWereAffected
    const multipromptIndex = 1 + (this.userParams.undoTopic != null ? 3 : 0)
    switch (numberOfRooms) {
      case Interior_Rooms.Room_1:
        await this.CheckServerPromptAndSelectButton(
          promptToUse,
          0, // 1 room
          multipromptIndex
        )
        this.global.review.interior_NumberOfRoomsDescription = '1'
        break
      case Interior_Rooms.Rooms_2:
        await this.CheckServerPromptAndSelectButton(
          promptToUse,
          1, // 2 rooms
          multipromptIndex
        )
        this.global.review.interior_NumberOfRoomsDescription = '2'
        break
      case Interior_Rooms.Rooms_3:
        await this.CheckServerPromptAndSelectButton(
          promptToUse,
          2, // 3 rooms
          multipromptIndex
        )
        this.global.review.interior_NumberOfRoomsDescription = '3'
        break
      case Interior_Rooms.Rooms_4:
        await this.CheckServerPromptAndSelectButton(
          promptToUse,
          3, // 4 rooms
          multipromptIndex
        )
        this.global.review.interior_NumberOfRoomsDescription = '4'
        break
      case Interior_Rooms.Rooms_5Plus:
        await this.CheckServerPromptAndSelectButton(
          promptToUse,
          4, // 5 or more rooms
          multipromptIndex
        )
        this.global.review.interior_NumberOfRoomsDescription = '5'
        break
      default:
        throw new Error(
          `Error: Processing a NumberOfRooms that is not yet defined: NumberOfRooms passed ${numberOfRooms}`
        )
    }
    await this.page.waitForTimeout(1000)
    this.userParams.undoTopic = null
  }

  async HandleExteriorDamageFlow(
    debrisOrTrees: boolean = RandomTrueFalse(),
    openToTheElements: boolean = RandomTrueFalse()
  ) {
    const isTheft = this.global.review.damageReasonDescription == DamageReason.Theft.result
    if (!isTheft) {
      if (!this.userParams.isTreeOnStructure) {
        const debrisPromptToUse = this.userParams.isPostStorm
          ? FNOLServerPrompts.PostStorm_Exterior_HaveDebrisOrTreesCausedDamage
          : FNOLServerPrompts.Exterior_HaveDebrisOrTreesCausedDamage
        if (debrisOrTrees) {
          await this.CheckServerPromptAndSelectButton(
            debrisPromptToUse,
            0, // yes
            !isTheft
              ? this.userParams.undoTopic != null
                ? 4 + this.promptOffsetTracking
                : 1 + this.promptOffsetTracking
              : 1
          )
          this.userParams.undoTopic = null
          this.global.review.exterior_DebrisDescription = OtherText.Yes
        } else {
          await this.CheckServerPromptAndSelectButton(
            debrisPromptToUse,
            1, // no
            !isTheft
              ? this.userParams.undoTopic != null
                ? 4 + this.promptOffsetTracking
                : 1 + this.promptOffsetTracking
              : 1
          )
          this.userParams.undoTopic = null
          this.global.review.exterior_DebrisDescription = OtherText.No
        }
        this.promptOffsetTracking = 0
      } else {
        // Tree on Structure damage skips the question and auto sets Damage From Debris -> Yes
        this.global.review.exterior_DebrisDescription = OtherText.Yes
      }
    }
    if (!this.userParams.isDamagedEntryway && !this.userParams.isTreeOnStructure) {
      const elementsPromptToUse = this.userParams.isPostStorm
        ? FNOLServerPrompts.PostStorm_Exterior_IsResidenceOpenToTheElements
        : FNOLServerPrompts.Exterior_IsResidenceOpenToTheElements
      if (openToTheElements) {
        await this.CheckServerPromptAndSelectButton(
          elementsPromptToUse,
          0, // no
          this.userParams.undoTopic != null
            ? 4 + this.promptOffsetTracking
            : 1 + this.promptOffsetTracking
        )
        this.global.review.exterior_OpenToElementsDescription = OtherText.Yes
        this.userParams.undoTopic = null
      } else {
        await this.CheckServerPromptAndSelectButton(
          elementsPromptToUse,
          1 // yes
        )
        this.global.review.exterior_OpenToElementsDescription = OtherText.No
        this.userParams.undoTopic = null
      }
    } else {
      // Entryway or Tree on Structure damage skips the question and auto sets OpenToTheElements -> Yes
      this.global.review.exterior_OpenToElementsDescription = OtherText.Yes
    }
    //this.userParams.undoTopic = null;
  }

  async HandleRoofDamageFlow(
    hasBeenBreached: boolean = false,
    visibleDamage: boolean = false,
    waterThroughRoof: boolean = false,
    locationOfWaterInTheHome: string = 'There is water everywhere'
  ) {
    const breachedPromptToUse = this.userParams.isPostStorm
      ? FNOLServerPrompts.PostStorm_Roof_HasBeenBreached
      : FNOLServerPrompts.Roof_HasBeenBreached
    if (hasBeenBreached) {
      await this.CheckServerPromptAndSelectButton(
        breachedPromptToUse,
        0, // yes
        this.userParams.undoTopic != null ? 4 : 1
      )
      this.global.review.roof_HasBeenBreachedDescription = OtherText.Yes
      this.userParams.undoTopic = null
      this.promptOffsetTracking = 0

      // ask about the hole
      await this.CheckServerPromptAndRespond(
        FNOLServerPrompts.Roof_Breached_WhatCausedTheHole,
        this.userParams.roof_BreachedCause
      )
      this.global.review.roof_BreachedCause = this.userParams.roof_BreachedCause

      // hole cause removed?
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.Roof_Breached_CauseRemoved,
        this.userParams.roof_BreachedCauseRemoved ? 0 : 1
      )
      this.global.review.roof_BreachedCauseRemoved = this.userParams.roof_BreachedCauseRemoved
        ? OtherText.Yes
        : OtherText.No
    } else {
      await this.CheckServerPromptAndSelectButton(
        breachedPromptToUse,
        1, // no
        this.userParams.undoTopic != null ? 4 : 1
      )
      this.global.review.roof_HasBeenBreachedDescription = OtherText.No
      this.userParams.undoTopic = null
      this.promptOffsetTracking = 0

      if (visibleDamage) {
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.Roof_IsThereVisibleDamage,
          0, // yes
          1
        )
        this.global.review.roof_VisibleDamage = OtherText.Yes

        // ask about the damage
        await this.CheckServerPromptAndRespond(
          FNOLServerPrompts.Roof_WhereIsTheVisibleDamage,
          this.userParams.roof_VisibleDamageDescription
        )
        this.global.review.roof_VisibleDamageDescription =
          this.userParams.roof_VisibleDamageDescription
      } else {
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.Roof_IsThereVisibleDamage,
          1, // no
          1
        )
        this.global.review.roof_VisibleDamage = OtherText.No
      }
    }
    this.userParams.undoTopic = null
    if (waterThroughRoof) {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.Roof_IsThereWaterInTheHome,
        0 // yes
      )
      this.global.review.roof_WaterThroughRoofDescription = OtherText.Yes

      await this.CheckServerPromptAndRespond(
        FNOLServerPrompts.Roof_WhereIsTheWater,
        locationOfWaterInTheHome
      )
      this.global.review.locationOfWaterInHomeDescription = locationOfWaterInTheHome
    } else {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.Roof_IsThereWaterInTheHome,
        1 // no
      )
      this.global.review.roof_WaterThroughRoofDescription = OtherText.No
    }
  }

  async HandleContentsOrPersonalPropertyDamageFlow() {
    const isHurricane = this.global.review.damageReasonDescription == DamageReason.Hurricane.result
    if (isHurricane && this.userParams.userType === UserTypes.Internal) {
      const damageDescription = 'My trampoline is toast'
      await this.CheckServerPromptAndRespond(
        FNOLServerPrompts.DescribeItemsDamagedByHurricane,
        damageDescription
      )
      this.global.review.damagedContentsDescription = damageDescription
    }
  }

  async HandleOtherStructuresDamageFlow(
    otherStructuresDamages: number,
    poolType: PoolType = GetRandomPoolType(),
    fencingType: FencingType = GetRandomFencingType()
  ) {
    await this.CheckServerPrompt(
      FNOLServerPrompts.OtherStructures_WhatOtherStructuresWereDamaged,
      this.userParams.undoTopic != null
        ? 4 + this.promptOffsetTracking
        : 1 + this.promptOffsetTracking
    )
    this.userParams.undoTopic = null
    this.promptOffsetTracking = 0
    let expectedUserEcho = ''
    let reviewDescription = ''
    const isPool = (otherStructuresDamages & OtherStructuresDamage.Pool.type) > 0
    const isFence = (otherStructuresDamages & OtherStructuresDamage.Fence.type) > 0
    for (const otherStructureDamageKey in Object.keys(OtherStructuresDamage)) {
      const otherStructuresDamage = Object.values(OtherStructuresDamage)[otherStructureDamageKey]
      if (otherStructuresDamages & otherStructuresDamage.type) {
        const selectionLocator = this.page
          .frameLocator('#bp-widget')
          .locator(`.bpw-keyboard .multiselect label[for="${otherStructuresDamage.id}"]`)
        await selectionLocator.click()
        const concat = expectedUserEcho.length == 0 ? '' : ', '
        const reviewConcat = reviewDescription.length == 0 ? '' : ','
        expectedUserEcho += `${concat}${otherStructuresDamage.echo}`
        reviewDescription += `${reviewConcat}${otherStructuresDamage.result}`
      }
    }
    const buttonSelector = this.page.frameLocator('#bp-widget').locator('.bpw-keyboard .trigger')
    await buttonSelector.click()
    this.conversationIndex += 1
    await this.VerifyUserEchoText(expectedUserEcho)
    this.conversationIndex += 1
    //this.userParams.undoTopic = null
    this.global.review.otherStructures_DamageTypeDescription = reviewDescription

    if (isPool) {
      await this.CheckServerPromptAndSelectButton(FNOLServerPrompts.Pool_WhatTypeOfPool, poolType)
      switch (poolType) {
        case PoolType.AboveGround:
          this.global.review.pool_typeOfPoolDescription = FNOLPromptLinks.Pool_AboveGround
          break
        case PoolType.InGround:
          this.global.review.pool_typeOfPoolDescription = FNOLPromptLinks.Pool_InGround
          break
      }
    }

    if (isFence) {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.Fence_WhatTypeOfFencing,
        fencingType
      )
      switch (fencingType) {
        case FencingType.Wood:
          this.global.review.fencing_typeOfFencingDescription = FNOLPromptLinks.Fencing_Wood
          break
        case FencingType.Vinyl:
          this.global.review.fencing_typeOfFencingDescription = FNOLPromptLinks.Fencing_Vinyl
          break
        case FencingType.Chainlink:
          this.global.review.fencing_typeOfFencingDescription = FNOLPromptLinks.Fencing_Chainlink
          break
        case FencingType.Other:
          this.global.review.fencing_typeOfFencingDescription = FNOLPromptLinks.Fencing_Other
          break
      }
    }
  }

  async HandleEstimateForRepairs() {
    if (this.finishParams.haveEstimate) {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.HaveYouReceivedAnEstimateForRepairs,
        0, // yes
        this.userParams.undoTopic != null
          ? 4 + this.promptOffsetTracking
          : 1 + this.promptOffsetTracking
      )
      this.global.review.repairEstimateDescription = OtherText.Yes
      await this.CheckServerPrompt(FNOLServerPrompts.PreviousEstimateNonBinding, 1)
      if (this.finishParams.estimateToUpload != null) {
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.UploadEstimateHere,
          1, // Upload
          2,
          null,
          true
        )
        await this.CheckServerPrompt(FNOLServerPrompts.ClickBelowToAddDocument, 2)
        const fullPathToEstimate =
          this.global.uploadFolder + '//' + this.finishParams.estimateToUpload

        const inputLocator = this.page.frameLocator('#bp-widget').locator('.bpw-keyboard input')
        await inputLocator.setInputFiles(fullPathToEstimate)
        const buttonIndex = 2
        const buttonLocator = this.page
          .frameLocator('#bp-widget')
          .locator(`.bpw-keyboard button:nth-of-type(${buttonIndex})`)
        const actualButtonText = await buttonLocator.textContent()
        expect(actualButtonText).toBe(FNOLPromptLinks.Upload)
        await buttonLocator.click()
        this.promptOffsetTracking = 2
      } else {
        await this.CheckServerPrompt(FNOLServerPrompts.UploadEstimateHere, 2)

        await this.SelectServerButton(
          FNOLServerPrompts.UploadEstimateHere,
          0, // I don't have it
          true
        )

        await this.CheckServerPrompt(FNOLServerPrompts.SubmitEstimates, 3)
        this.promptOffsetTracking = 3
      }
    } else {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.HaveYouReceivedAnEstimateForRepairs,
        1, // no
        this.userParams.undoTopic != null
          ? 4 + this.promptOffsetTracking
          : 1 + this.promptOffsetTracking,
        null,
        true
      )
      this.promptOffsetTracking = 0
      this.global.review.repairEstimateDescription = OtherText.No
      this.conversationIndex += 2
    }
    this.userParams.undoTopic = null
  }

  async HandleDefaultFinish() {
    if (this.finishParams.isLossAssessment) {
      this.global.review.isHomeHabitableDescription = OtherText.Yes
      this.global.review.repairEstimateDescription = OtherText.No
    } else {
      if (!this.finishParams.skipBigChunk) {
        await this.HandleSafeToRemainFlow()
        if (this.finishParams.stopBeforeUpload) {
          return
        }
        await this.HandleUploadImages()
        await this.HandleLossDescription()
      }
      if (
        this.userParams.userType == UserTypes.Agent ||
        this.userParams.userType == UserTypes.Internal
      ) {
        await this.HandleClaimNotes()
      }
    }

    if (this.finishParams.stopAtReviewDialog) {
      return
    }
    await this.HandleReviewInformation(this.finishParams.goBackAtReviewDialog)
    await this.HandleSubmit(this.finishParams.stopBeforeSubmit)
    if (!this.finishParams.stopBeforeSubmit) {
      await this.HandlePostSubmit()
    }
  }

  async HandleSafeToRemainFlow() {
    if (this.finishParams.residenceNotLivableType != null) {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.IsItSafeToRemainInTheResidence,
        1, // no
        1 + this.promptOffsetTracking + (this.userParams.undoTopic != null ? 3 : 0)
      )
      this.promptOffsetTracking = 0
      await this.page.waitForTimeout(1000)
      await this.CheckServerPrompt(FNOLServerPrompts.WhyIsTheResidenceNotLivable, 1)
      const titleLocator = this.page
        .frameLocator('#bp-widget')
        .locator('.bpw-keyboard > div > div > div > div')
      const actualTitle = await titleLocator.innerText()
      expect(actualTitle).toBe(FNOLServerPromptText.WhyIsTheResidenceNotLivable)
      const residenceNotLivable = this.finishParams.residenceNotLivableType
      const locator = this.page
        .frameLocator('#bp-widget')
        .locator(`.bpw-keyboard ul li`)
        .nth(residenceNotLivable.type)
      await locator.click()
      this.global.review.isHomeHabitableDescription = OtherText.No
      this.global.review.reasonHomeIsNotHabitableDescription = residenceNotLivable.result
      this.conversationIndex += 1
      await this.VerifyUserEchoText(residenceNotLivable.echo)
      this.conversationIndex += 1

      await this.CheckServerPrompt(FNOLServerPrompts.NotLivableFollowUp)
      this.promptOffsetTracking += 1
    } else {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.IsItSafeToRemainInTheResidence,
        0, // yes
        1 + this.promptOffsetTracking + (this.userParams.undoTopic != null ? 3 : 0)
      )
      this.promptOffsetTracking = 0
      this.global.review.isHomeHabitableDescription = OtherText.Yes
    }
    this.userParams.undoTopic = null
  }

  async HandleUploadImages() {
    if (
      this.global.currentUserType == UserTypes.Agent ||
      this.global.currentUserType == UserTypes.Internal
    ) {
      //Skipping Image Upload for Agent/Internal user
      return
    }
    if (this.finishParams.uploadImagesFlow == UploadImageOptions.UploadLater) {
      await this.CheckServerPrompt(
        FNOLServerPrompts.ScanTheQRCodeBelow,
        1 + this.promptOffsetTracking
      )
      await this.SelectServerButton(
        FNOLServerPrompts.ScanTheQRCodeBelow,
        1 // upload later
      )
      this.promptOffsetTracking = 0
      return
    }

    // if we are not doing this later, handle the first prompt
    await this.CheckServerPrompt(
      FNOLServerPrompts.ScanTheQRCodeBelow,
      1 + this.promptOffsetTracking
    )
    await this.SelectServerButton(
      FNOLServerPrompts.ScanTheQRCodeBelow,
      0 // I have switched devices
    )
    this.promptOffsetTracking = 0

    await this.CheckServerPrompt(FNOLServerPrompts.IEncourageYouToKeepAnyDamagedProperty)

    if (this.finishParams.uploadImagesFlow == UploadImageOptions.NoCameraAvailable) {
      // bailing here:
      await this.SelectServerButton(
        FNOLServerPrompts.IEncourageYouToKeepAnyDamagedProperty,
        0, // No Camera Available
        true
      )
      this.promptOffsetTracking = +1
      return
    }

    // on to the next question
    await this.SelectServerButton(
      FNOLServerPrompts.IEncourageYouToKeepAnyDamagedProperty,
      1, // upload images
      true
    )
    await this.CheckServerPrompt(FNOLServerPrompts.ClickBelowToAddPictures)

    if (this.finishParams.uploadImagesFlow == UploadImageOptions.Cancel) {
      // bail here
      const buttonIndex = 1
      const textToMatch = FNOLPromptLinks.Cancel
      const buttonLocator = this.page
        .frameLocator('#bp-widget')
        .locator(`.bpw-keyboard .buttonGroup button:nth-of-type(${buttonIndex})`)
      const actualButtonText = await buttonLocator.textContent()
      expect(actualButtonText).toBe(textToMatch)
      await buttonLocator.click()
      this.promptOffsetTracking = +1
      return
    }

    const inputLocator = this.page.frameLocator('#bp-widget').locator('.bpw-keyboard input')
    for (const imageIndex in this.finishParams.imagesToUpload) {
      const fullPathToImage =
        this.global.uploadFolder + `/` + this.finishParams.imagesToUpload[parseInt(imageIndex)]
      await inputLocator.setInputFiles(fullPathToImage)
    }

    const buttonIndex = 2
    const textToMatch = FNOLPromptLinks.Upload
    const buttonLocator = this.page
      .frameLocator('#bp-widget')
      .locator(`.bpw-keyboard .buttonGroup button:nth-of-type(${buttonIndex})`)
    const actualButtonText = await buttonLocator.textContent()
    expect(actualButtonText).toBe(textToMatch)
    await buttonLocator.click()
    await this.page.waitForTimeout(2000)
    this.promptOffsetTracking = +1
  }

  async HandleClaimNotes() {
    await this.CheckServerPromptAndRespond(
      FNOLServerPrompts.AdditionalClaimNotes,
      this.finishParams.additionalClaimNotes,
      this.userParams.undoTopic != null
        ? 4 + this.promptOffsetTracking
        : 1 + this.promptOffsetTracking
    )
    this.userParams.undoTopic = null
    this.global.review.additionalClaimNotes = this.finishParams.additionalClaimNotes
  }

  async HandleLossDescription() {
    const lossDescription = this.finishParams.lossDescription
    await this.CheckServerPromptAndRespond(
      FNOLServerPrompts.ProvideLossDescription,
      lossDescription,
      1 + this.promptOffsetTracking
    )
    this.promptOffsetTracking = 0
    this.global.review.freeFormLossDescription =
      this.global.review.detailedLossDescription == ''
        ? lossDescription
        : this.global.review.detailedLossDescription
  }

  async HandleReviewInformation(goBack: boolean = false) {
    const titleLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard > div > div > div > div > div[class^="company-progress-review"]')
    const actualTitle = await titleLocator.innerText()
    expect(actualTitle).toBe(FNOLServerPromptText.ReviewInformationTitle)

    const itemsInListLocator = this.page.frameLocator('#bp-widget').locator('.bpw-keyboard ul > li')
    const itemsInList = await itemsInListLocator.all()
    for (let index = 0; index < itemsInList.length; index++) {
      const labelText = await itemsInList[index].locator('> div').innerText()
      let actualValueText = await itemsInList[index].locator('> p').innerText()
      let targetText = ''
      const review = this.global.review
      switch (labelText) {
        case 'Claim Notes':
          targetText = review.additionalClaimNotes
          break
        case 'Freeform Loss Description':
          targetText = review.freeFormLossDescription
          break
        case 'Number of Rooms Affected':
          targetText = review.interior_NumberOfRoomsDescription
          break
        case 'Damage From Debris':
          targetText = review.exterior_DebrisDescription.toUpperCase()
          break
        case 'Is Home Habitable':
          targetText = review.isHomeHabitableDescription.toUpperCase()
          break
        case 'Is Home Open to the Elements':
          targetText = review.exterior_OpenToElementsDescription.toUpperCase()
          break
        case 'Reason Home Not Habitable':
          targetText = review.reasonHomeIsNotHabitableDescription
          break
        case 'Water Through Roof':
          targetText = review.roof_WaterThroughRoofDescription.toUpperCase()
          break
        case 'Location of Water in Home':
          targetText = review.locationOfWaterInHomeDescription
          break
        case 'Policy Number':
          actualValueText = actualValueText.toLowerCase()
          targetText = this.global.policy.policyNumber.toLowerCase()
          break
        case 'Policyholder Email':
          targetText = this.global.policy.email
          break
        case 'Policyholder Phone':
          targetText = this.global.policy.phoneNumber
          break
        case 'Date of Loss':
        case 'Date Damage Was Discovered':
          targetText = review.dateOfLossDescription
          break
        case 'Loss Type':
          targetText = review.damageReasonDescription
          break
        case 'Other Structures Damaged':
          targetText = review.otherStructures_DamageTypeDescription
          break
        case 'Damaged Areas':
          targetText = review.damageLocationDescription
          break
        case 'Additional Damage Types':
          if (review.additional_DamageTypeDescription == '') {
            targetText = review.interior_DamageTypeDescription
          }
          if (review.interior_DamageTypeDescription == '') {
            targetText = review.additional_DamageTypeDescription
          }
          if (
            review.additional_DamageTypeDescription != '' &&
            review.interior_DamageTypeDescription != ''
          ) {
            targetText = `${review.interior_DamageTypeDescription},${review.additional_DamageTypeDescription}`
          }
          break
        case 'Repair Estimate':
          targetText = review.repairEstimateDescription.toUpperCase()
          break
        case 'Roof Damage Visible':
          targetText = review.roof_VisibleDamage.toUpperCase()
          break
        case 'Roof Has Been Breached':
          targetText = review.roof_HasBeenBreachedDescription.toUpperCase()
          break
        case 'Description of Theft':
          targetText = review.theft_TheftDescription
          break
        case 'Theft Physical Damage':
          targetText = review.theft_PhysicalDamageDescription
          break
        case 'Police Report Filed?':
          targetText = review.theft_PoliceReportFiledDescription
          break
        case 'Police Report Number':
          targetText = review.theft_PoliceReportNumberDescription
          break
        case 'Claimant First Name':
          targetText = this.liabilityParams.claimant_FirstName
            ? this.liabilityParams.claimant_FirstName
            : ''
          break
        case 'Claimant Last Name':
          targetText = this.liabilityParams.claimant_LastName
            ? this.liabilityParams.claimant_LastName
            : ''
          break
        case 'Claimant Email':
          targetText = this.liabilityParams.claimant_Email
          break
        case 'Claimant Phone':
          targetText = this.liabilityParams.claimant_Phone_Match
          break
        case 'Claimant Phone Extension':
          targetText = this.liabilityParams.claimant_PhoneExtension
          break
        case 'Attorney First Name':
          targetText = this.liabilityParams.attorney_FirstName
            ? this.liabilityParams.attorney_FirstName
            : ''
          break
        case 'Attorney Last Name':
          targetText = this.liabilityParams.attorney_LastName
            ? this.liabilityParams.attorney_LastName
            : ''
          break
        case 'Attorney Email':
          targetText = this.liabilityParams.attorney_Email
          break
        case 'Attorney Phone':
          targetText = this.liabilityParams.attorney_Phone_Match
          break
        case 'Attorney Phone Extension':
          targetText = this.liabilityParams.attorney_PhoneExtension
          break
        case 'Loss Assessment Date':
          targetText = review.lossAssessment_DateDescription
          break
        case 'Loss Assessment Reason':
          targetText = review.lossAssessment_ReasonDescription
          break
        case 'Loss Assessment Amount':
          targetText = review.lossAssessment_AmountDescription
          break
        case 'Loss Assessment - Weather Related':
          targetText = review.lossAssessment_WeatherRelatedDescription
          break
        case 'Claim Reporter Relationship':
          targetText = review.onBehalfOf_TypeDescription
          break
        case 'Claim Reporter First Name':
          targetText = review.onBehalfOf_FirstNameDescription
          break
        case 'Claim Reporter Last Name':
          targetText = review.onBehalfOf_LastNameDescription
          break
        case 'Claim Reporter Company':
          targetText = review.onBehalfOf_CompanyDescription
          break
        case 'Claim Reporter Phone':
          targetText = review.onBehalfOf_PhoneDescription
          break
        case 'Claim Reporter Phone Extension':
          targetText = review.onBehalfOf_PhoneExtensionDescription
          break
        case 'Claim Reporter Email':
          targetText = review.onBehalfOf_EmailDescription
          break
        case 'Origin of Water Damage':
          targetText = review.originOfWaterDamageDescription
          break
        case 'Type of Plumbing':
          targetText = review.typeOfPlumbingDescription
          break
        case 'Type of Pool':
          targetText = review.pool_typeOfPoolDescription.toUpperCase()
          break
        case 'Type of Fencing':
          targetText = review.fencing_typeOfFencingDescription.toUpperCase()
          break
        case 'Third-Party Property Damage Type(s)':
          targetText = this.liabilityParams.propertyDamage
          break
        case 'Injury to Third Party':
          targetText = this.liabilityParams.injury
          break
        case 'Type(s) of Animal(s) Involved':
          targetText = this.liabilityParams.animal
          break
        case 'Current Weather Event Name':
          targetText = review.currentWeatherEventName
          break
        case 'Other Relationship to Policyholder':
          targetText = review.onBehalfOf_OtherRelationshipToPolicyholder
          break
        case 'Theft at Residence?':
          targetText = review.theft_OnPremises
          break
        case 'Off-Premises Theft Location':
          targetText = review.theft_OffPremisesLocation
          break
        case 'Water Turned Off':
          targetText = review.water_IsTurnedOff
          break
        case 'Plumber Contacted':
          targetText = review.water_Plumber_Contacted
          break
        case 'Plumbing Company Name':
          targetText = review.water_Plumber_CompanyName
          break
        case 'Plumbing Company Phone':
          targetText = review.water_Plumber_PhoneDescription
          break
        case 'HVAC Repaired':
          targetText = review.water_HVAC_Repaired
          break
        case 'HVAC Company Phone':
          targetText = review.water_HVAC_PhoneDescription
          break
        case 'HVAC Company Name':
          targetText = review.water_HVAC_CompanyName
          break
        case 'Cause of Roof Breach':
          targetText = review.roof_BreachedCause
          break
        case 'Has Cause of Breach Been Removed?':
          targetText = review.roof_BreachedCauseRemoved
          break
        case 'Damage Remediation Completed':
          targetText = review.mitigationStepsCompleted
          break
        case 'Damage Remediation Description':
          targetText = review.mitigationStepsDescription
          break
        case 'Visible Roof Damage Description':
          targetText = review.roof_VisibleDamageDescription
          break
        case 'Policyholder Name':
          targetText = review.policyholderFullName
          break
        case 'Damaged Contents Description':
          targetText = review.damagedContentsDescription
          break
        default:
          throw new Error(`Error: Processing a review topic that is not yet defined: ${labelText}`)
      }
      console.debug(
        `checking review: For label: ${labelText} - expecting: ${targetText} - got:${actualValueText}`
      )
      expect.soft(actualValueText).toBe(targetText)
    }

    const buttonIndex = goBack ? 0 : 1
    const expectedButtonText = goBack
      ? FNOLPromptLinks.GoBack
      : FNOLPromptLinks.ConfirmYourInformation
    const buttonLocator = this.page
      .frameLocator('#bp-widget')
      .locator('.bpw-keyboard button')
      .nth(buttonIndex)
    const actualButtonText = await buttonLocator.innerText()
    expect(actualButtonText).toBe(expectedButtonText)
    await buttonLocator.click()

    if (this.finishParams.isLossAssessment) {
      this.promptOffsetTracking = 0
      if (this.userParams.lossAssessment_HaveLetter) {
        await this.CheckServerPrompt(FNOLServerPrompts.UploadAssessmentLetterNow, 1)
        if (this.userParams.lossAssessment_LetterToUpload == null) {
          // if not uploaded, check for reminder
          await this.CheckServerPrompt(FNOLServerPrompts.SubmitLossAssessmentLetter, 2)
          this.promptOffsetTracking = 1
        }
      } else {
        await this.CheckServerPrompt(FNOLServerPrompts.SubmitLossAssessmentLetter, 1)
      }

      await this.CheckServerPrompt(
        FNOLServerPrompts.ReviewInformation,
        2 + this.promptOffsetTracking
      )
      this.promptOffsetTracking += 1
    } else {
      this.promptOffsetTracking = 0
      await this.CheckServerPrompt(FNOLServerPrompts.ReviewInformation)
    }

    await this.CheckServerPrompt(FNOLServerPrompts.Legal, 2 + this.promptOffsetTracking)
  }

  async HandleSubmit(stopBeforeSubmit = false) {
    if (!stopBeforeSubmit) {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.Submit,
        0, // submit
        3 + this.promptOffsetTracking,
        null,
        true
      )
      this.conversationIndex += 1
      await this.VerifyUserEchoText(FNOLPromptLinks.Submit)
      this.conversationIndex += 1
    } else {
      await this.CheckServerPrompt(FNOLServerPrompts.Submit, 3 + this.promptOffsetTracking)
    }
    this.promptOffsetTracking = 0
  }

  async HandlePostSubmit() {
    const actualServerPromptText = await this.GetActualPrompt()
    const splitItUp = actualServerPromptText.match(/\d{6}/)
    if (splitItUp == null) {
      throw new Error(
        `Error: Post Submit message does not contain a claim number. Got: ${actualServerPromptText}`
      )
    }
    const actualClaimNumber = `PH${splitItUp[0]}`
    const genericizedActualServerPromptText = actualServerPromptText.replace(
      actualClaimNumber,
      '<CLAIMNUMBER>'
    )
    let claimSubmittedPrompt
    switch (this.userParams.userType) {
      case UserTypes.Internal:
      case UserTypes.Agent:
        claimSubmittedPrompt = FNOLServerPromptText.ClaimHasBeenSubmitted_InternalAgent
        break
      default:
        claimSubmittedPrompt = FNOLServerPromptText.ClaimHasBeenSubmitted
    }
    let replacementSLA
    switch (this.global.review.damageReasonDescription) {
      case DamageReason.Hurricane.result:
        replacementSLA = HurricaneCallbackSLA
        break
      default:
        replacementSLA = DefaultCallbackSLA
    }
    const regex = /<CALLBACKSLA>/g // 'g' flag for global replacement
    const tunedClaimSubmittedPrompt = claimSubmittedPrompt.replace(regex, replacementSLA)
    expect(genericizedActualServerPromptText).toBe(tunedClaimSubmittedPrompt)
    if (this.finishParams.expectMitigation) {
      await this.HandleMitigation()
    } else {
      await this.CheckServerPrompt(FNOLServerPrompts.YouCanCloseThisWindowNow, 2)
    }
  }

  async HandleMitigation() {
    switch (this.userParams.userType) {
      case UserTypes.Internal:
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.PromptForMitigation_Internal,
          this.finishParams.acceptMitigation ? 0 : 1, // yes if true, no if false
          2
        )
        break
      case UserTypes.Agent:
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.PromptForMitigation_Agent,
          this.finishParams.acceptMitigation ? 0 : 1, // yes if true, no if false
          2
        )
        break
      default:
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.PromptForMitigation,
          this.finishParams.acceptMitigation ? 0 : 1, // yes if true, no if false
          2
        )
    }
    if (!this.finishParams.acceptMitigation) {
      // if they did not choose mitigation, handle close window prompt
      await this.CheckServerPrompt(FNOLServerPrompts.YouCanCloseThisWindowNow)
    } else {
      // they accepted mitigation - handle vendor information
      let promptToUse: null | BPServerPrompt = null
      switch (this.userParams.userType) {
        case UserTypes.Internal:
        case UserTypes.Agent:
          promptToUse = FNOLServerPrompts.PreferredVendorInformation_InternalAgent
          break
        default:
          promptToUse = FNOLServerPrompts.PreferredVendorInformation
      }
      if (this.finishParams.mitigationVendors.length > 1) {
        for (
          let vendorCounter = 0;
          vendorCounter < this.finishParams.mitigationVendors.length;
          vendorCounter++
        ) {
          const vendorMatched = await this.CheckPrompt(
            promptToUse.prompt,
            1,
            this.conversationIndex,
            '.Linkify',
            CompareMethods.Equals,
            vendorCounter
          )
          if (vendorMatched) {
            this.finishParams.acceptedMitigationVendor =
              this.finishParams.mitigationVendors[vendorCounter]
            break
          }
        }
        // if none of the expected vendors matched, we should fail
        expect(this.finishParams.acceptedMitigationVendor).not.toBe(null)
      } else {
        // just checking against 1 possible result
        this.finishParams.acceptedMitigationVendor = this.finishParams.mitigationVendors[0]
        await this.CheckServerPrompt(promptToUse)
      }
      await this.CheckServerPrompt(FNOLServerPrompts.YouCanCloseThisWindowNow, 2)
    }
  }

  async CheckServerPrompt(
    expectedPrompt: BPServerPrompt,
    multiPromptIndex: number = 1,
    serverPromptIndex: number = this.conversationIndex
  ) {
    switch (expectedPrompt) {
      case FNOLServerPrompts.ReportClaimForWeatherEventSelection:
      case FNOLServerPrompts.WhatTypeOfLossDidThePropertySustain:
      case FNOLServerPrompts.WhereDidTheDamageOccur:
      case FNOLServerPrompts.OtherStructures_WhatOtherStructuresWereDamaged:
      case FNOLServerPrompts.WhyIsTheResidenceNotLivable:
      case FNOLServerPrompts.ReviewInformation:
      case FNOLServerPrompts.SelectLiabilityType:
      case FNOLServerPrompts.ClickBelowToAddDocument:
      case FNOLServerPrompts.LiabilityInformation:
      case FNOLServerPrompts.ThirdPartyClaimantInformation:
      case FNOLServerPrompts.AttorneyInformation:
      case FNOLServerPrompts.UploadAssessmentLetterNow:
      case FNOLServerPrompts.UploadEstimateHere:
      case FNOLServerPrompts.IEncourageYouToKeepAnyDamagedProperty:
      case FNOLServerPrompts.ClickBelowToAddPictures:
        await this.CheckPrompt(
          expectedPrompt.prompt,
          multiPromptIndex,
          serverPromptIndex,
          '.bpw-chat-bubble-content > div'
        )
        break
      case FNOLServerPrompts.ScanTheQRCodeBelow:
        await this.CheckPrompt(
          expectedPrompt.prompt,
          multiPromptIndex,
          serverPromptIndex,
          '.bpw-chat-bubble-content p'
        )
        break
      case FNOLServerPrompts.LiabilityTerminates:
      case FNOLServerPrompts.LossPriorToEffectiveDateTerminates:
        await this.CheckPrompt(
          expectedPrompt.prompt,
          multiPromptIndex,
          serverPromptIndex,
          '.Linkify',
          CompareMethods.StartsWith
        )
        break
      default:
        await this.CheckPrompt(expectedPrompt.prompt, multiPromptIndex, serverPromptIndex)
    }
  }

  async CheckServerPromptAndSelectLink(
    expectedPrompt: BPServerPrompt,
    linkIndex: number,
    multiPromptIndex: number = 1
  ) {
    await this.CheckServerPrompt(expectedPrompt, multiPromptIndex)
    const serverPromptIndex = this.conversationIndex
    const locator = this.page
      .frameLocator('#bp-widget')
      .locator(
        `.bpw-msg-list > div > div:nth-child(${serverPromptIndex}) .link-list a:nth-of-type(${linkIndex + 1})`
      )
    const actualLink = await locator.innerText()
    const expectedLink = expectedPrompt.responses[linkIndex]
    expect(actualLink).toBe(expectedLink)
    await locator.click()
  }

  async CheckServerPromptAndSelectButton(
    expectedPrompt: BPServerPrompt,
    buttonIndex: number,
    multiPromptIndex: number = 1,
    overridePromptText: string | null = null,
    skipAdvanceAndEchoCheck: boolean = false
  ) {
    if (overridePromptText == null) {
      await this.CheckServerPrompt(expectedPrompt, multiPromptIndex)
    } else {
      await this.CheckPrompt(overridePromptText, multiPromptIndex)
    }
    await this.SelectServerButton(expectedPrompt, buttonIndex, skipAdvanceAndEchoCheck)
  }

  async CheckServerPromptAndRespond(
    expectedPrompt: BPServerPrompt,
    response: string,
    multiPromptIndex: number = 1,
    __overridePromptText: null | string = null,
    overrideResponseEchoText: null | string = null
  ) {
    await this.CheckServerPrompt(expectedPrompt, multiPromptIndex)
    const sendButtonLocator = this.page.frameLocator('#bp-widget').locator(`button[id="btn-send"]`)
    let inputLocator: Locator
    switch (expectedPrompt.prompt) {
      case FNOLServerPrompts.PolicyLookupZip.prompt:
      case FNOLServerPrompts.ZipValidation.prompt:
      case FNOLServerPrompts.LossAssessmentAmount.prompt:
        inputLocator = this.page
          .frameLocator('#bp-widget')
          .locator(`.bpw-keyboard input[id="input-message"]`)
        break
      default:
        inputLocator = this.page.frameLocator('#bp-widget').locator(`.bpw-keyboard textarea`)
    }

    await inputLocator.fill(response)
    await sendButtonLocator.click()
    this.conversationIndex += 1
    await this.VerifyUserEchoText(
      overrideResponseEchoText != null ? overrideResponseEchoText : response
    )
    this.conversationIndex += 1
  }

  FineTuneServerPrompt(serverPrompt: string, targetVendor: number) {
    const isInternal =
      this.userParams.userType == UserTypes.Internal || this.userParams.userType == UserTypes.Agent
    let tunedPrompt = serverPrompt
    if (serverPrompt.includes('<POLICYPHONENUMBER>')) {
      tunedPrompt = tunedPrompt.replace('<POLICYPHONENUMBER>', this.global.policy.phoneNumber)
    }
    if (serverPrompt.includes('<POLICYEMAIL>')) {
      tunedPrompt = tunedPrompt.replace('<POLICYEMAIL>', this.global.policy.email)
    }
    if (serverPrompt.includes('<DAMAGEREASON>')) {
      tunedPrompt = tunedPrompt.replace(
        '<DAMAGEREASON>',
        this.global.review.damageReasonDescription
      )
    }
    if (serverPrompt.includes('<ARTICLE>')) {
      tunedPrompt = tunedPrompt.replace(
        '<ARTICLE>',
        isInternal
          ? ServerPromptsAlternateText.Article_Internal
          : ServerPromptsAlternateText.Article_NonInternal
      )
    }
    if (serverPrompt.includes('<POSSESSIVE>')) {
      tunedPrompt = tunedPrompt.replace(
        '<POSSESSIVE>',
        isInternal
          ? ServerPromptsAlternateText.Possessive_Internal
          : ServerPromptsAlternateText.Possessive_NonInternal
      )
    }
    if (serverPrompt.includes('<CLAIMSPHONE>')) {
      tunedPrompt = tunedPrompt.replace('<CLAIMSPHONE>', ClaimsPortalPhone)
    }
    if (serverPrompt.includes('<EMAIL>')) {
      tunedPrompt = tunedPrompt.replace('<EMAIL>', ClientEmail)
    }
    if (serverPrompt.includes('<VENDORNAME>')) {
      const regex = /<VENDORNAME>/g // 'g' flag for global replacement
      tunedPrompt = tunedPrompt.replace(
        regex,
        this.finishParams.mitigationVendors[targetVendor]
          ? this.finishParams.mitigationVendors[targetVendor].name
          : 'UNDEFINED VENDOR NAME'
      )
    }
    if (serverPrompt.includes('<VENDORPHONE>')) {
      tunedPrompt = tunedPrompt.replace(
        '<VENDORPHONE>',
        this.finishParams.mitigationVendors[targetVendor]
          ? this.finishParams.mitigationVendors[targetVendor].phone
          : 'UNDEFINED VENDOR PHONE'
      )
    }
    if (serverPrompt.includes('<VENDOREMAIL>')) {
      tunedPrompt = tunedPrompt.replace(
        '<VENDOREMAIL>',
        this.finishParams.mitigationVendors[targetVendor]
          ? this.finishParams.mitigationVendors[targetVendor].email
          : 'UNDEFINED VENDOR EMAIL'
      )
    }
    if (serverPrompt.includes('<WEATHEREVENT>')) {
      tunedPrompt = tunedPrompt.replace(
        '<WEATHEREVENT>',
        this.userParams.weatherEventChoice
          ? this.userParams.weatherEventChoice
          : 'NO WEATHER EVENT NAME WAS DEFINED'
      )
    }
    return tunedPrompt
  }

  async CheckPrompt(
    prompt: string,
    multiPromptIndex: number = 1,
    serverPromptIndex: number = this.conversationIndex,
    locatorSuffix: string = '.Linkify',
    compare: CompareMethods = CompareMethods.Equals,
    targetVendor: null | number = null
  ) {
    let actualPrompt = 'no value was found'
    let matchResults = false
    const tunedPrompt = this.FineTuneServerPrompt(prompt, targetVendor == null ? 0 : targetVendor)
    const locator = this.page
      .frameLocator('#bp-widget')
      .locator(
        `.bpw-msg-list > div > div:nth-child(${serverPromptIndex}) .bpw-message-group > div:nth-of-type(${multiPromptIndex})`
      )
      .locator(locatorSuffix)
    console.debug(
      `server: ${serverPromptIndex}, multi: ${multiPromptIndex}, suffix: ${locatorSuffix}`
    )
    await this.page.waitForTimeout(500)
    await locator.waitFor({ state: 'attached', timeout: 45000 })
    const locatorExists = await locator.count()
    if (locatorExists > 0) {
      actualPrompt = await locator.innerText()
    } else {
      throw new Error(
        `Cannot find server prompt at index ${serverPromptIndex}, offset ${multiPromptIndex} with suffix of ${locatorSuffix} - looking for ${prompt})`
      )
    }
    switch (compare) {
      case CompareMethods.StartsWith:
        {
          console.debug(`starts with: ${actualPrompt} - target: ${tunedPrompt}`)
          matchResults = actualPrompt.startsWith(tunedPrompt)
        }
        break
      case CompareMethods.EndsWith:
        {
          console.debug(`ends with: ${actualPrompt} - target: ${tunedPrompt}`)
          matchResults = actualPrompt.endsWith(tunedPrompt)
        }
        break
      case CompareMethods.Includes:
        {
          console.debug(`includes: ${actualPrompt} - target: ${tunedPrompt}`)
          matchResults = actualPrompt.includes(tunedPrompt)
        }
        break
      case CompareMethods.Equals:
      default:
        console.debug(`equals: ${actualPrompt} - target: ${tunedPrompt}`)
        matchResults = actualPrompt === tunedPrompt
    }
    if (targetVendor == null) {
      // we are only checking for 1 result and can verify based on that result
      expect(matchResults).toBe(true)
    }
    return matchResults
  }

  async SelectServerButton(
    expectedPrompt: BPServerPrompt,
    buttonIndex: number,
    skipAdvanceAndEchoCheck: boolean = false
  ) {
    let locator: Locator
    switch (expectedPrompt) {
      // case FNOLServerPrompts.UploadImages:
      // case FNOLServerPrompts.PostStorm_UploadImages:
      case FNOLServerPrompts.UploadAssessmentLetterNow:
      case FNOLServerPrompts.UploadEstimateHere:
      case FNOLServerPrompts.IEncourageYouToKeepAnyDamagedProperty:
        locator = this.page
          .frameLocator('#bp-widget')
          .locator(`.bpw-keyboard .photoOffer_keyboard button:nth-child(${buttonIndex + 1})`)
        break
      default:
        locator = this.page
          .frameLocator('#bp-widget')
          .locator(`.bpw-keyboard .bpw-keyboard-quick_reply button:nth-child(${buttonIndex + 1})`)
    }

    await locator.waitFor()
    const count = await locator.count()
    if (count > 0) {
      const actualButton = await locator.innerText()
      const expectedButton = expectedPrompt.responses[buttonIndex]
      expect(actualButton).toBe(expectedButton)
      await locator.click()
      if (!skipAdvanceAndEchoCheck) {
        this.conversationIndex += 1
        await this.VerifyUserEchoText(expectedButton)
        this.conversationIndex += 1
      }
    } else {
      throw new Error(`Locator did not find a target: ${locator}`)
    }
  }
}
