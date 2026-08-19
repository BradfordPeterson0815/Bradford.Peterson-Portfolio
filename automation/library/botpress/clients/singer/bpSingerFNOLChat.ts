import { Locator, expect } from 'playwright/test'
import { CompareMethods, UserTypes } from '../../bpConstants.js'
import { BPFNOLChat } from '../../bpFNOLChat.js'
import { BPGlobal } from '../../bpGlobal.js'
import { RandomTrueFalse, SubmitDateToCalendar } from '../../bpHelper.js'
import { BPOnBehalfOf } from '../../bpOnBehalfOf.js'
import { BPServerPrompt } from '../../bpServerPrompt.js'
import { BPUserParameters } from '../../bpUserParameters.js'
import {
  ClaimsPortalPhone,
  ClientEmail,
  DamageArea,
  SingerDamageAreaTypes,
  DamageReason,
  SingerDamageReasonTypes,
  SingerInteriorDamageTypes,
  SingerWaterDamageTypes,
  FNOLPromptLinks,
  FNOLServerPromptText,
  FNOLServerPrompts,
  InteriorDamage,
  Interior_Mitigations,
  Interior_Rooms,
  Liability,
  OtherStructuresDamage,
  OtherText,
  ServerPromptsAlternateText,
  UndoText,
  UploadImageOptions,
} from './bpSingerConstants.js'
import { GetRandomInteriorMitigations, GetRandomInteriorRooms } from './bpSingerHelper.js'

export class BPSingerFNOLChat extends BPFNOLChat {
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
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.IsEveryoneSafe,
          this.userParams.isEveryoneSafe ? 0 : 1, // yes / no
          2
        )
        if (!this.userParams.isEveryoneSafe) {
          if (this.userParams.isEveryoneSafe_Continue) {
            await this.CheckServerPromptAndSelectButton(
              FNOLServerPrompts.YourSafetyIsMyTopConcern,
              0
            )
          } else {
            await this.CheckServerPrompt(FNOLServerPrompts.YourSafetyIsMyTopConcern)
          }
        }
    }
  }

  async HandleUserPolicy(userParams: BPUserParameters) {
    switch (userParams.userType) {
      case UserTypes.Internal:
      case UserTypes.Agent:
        await this.CheckServerPromptAndRespond(
          FNOLServerPrompts.DoYouHaveThePolicyNumber,
          userParams.policy.policyNumber,
          2
        )
        break
      case UserTypes.Insured:
      default: {
        const prompt = FNOLServerPrompts.DoYouHaveThePolicyNumber
        const policyNumber = userParams.policy.policyNumber
        await this.CheckServerPromptAndRespond(prompt, policyNumber, 1)
      }
    }
    this.promptOffsetTracking = 0
  }

  async HandleUserPolicyholder() {
    switch (this.userParams.userType) {
      case UserTypes.Internal:
      case UserTypes.Agent:
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.IsTheCallerThePolicyHolder,
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
      await this.HandleClaimReporterInformation()
      // await this.Helper.Wait(3000)
      // this.PromptOffsetTracking = 1
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
        case 'Claim Reporter Name':
          targetText = this.userParams.onBehalfOf_FullName
          this.global.review.onBehalfOf_FullNameDescription = this.userParams.onBehalfOf_FullName
          break
        case 'Claim Reporter Email':
          targetText = this.userParams.onBehalfOf_Email
          this.global.review.onBehalfOf_EmailDescription = this.userParams.onBehalfOf_Email
          break
        case 'Claim Reporter Phone':
          //let match = this.userParams.OnBehalfOf_Phone.match(/^(\d{3})(\d{3})(\d{4})$/)
          //let formattedPhone = '+1 (' + match[1] + ') ' + match[2] + '-' + match[3]
          //let formattedPhone = `+1${this.userParams.onBehalfOf_Phone}`
          targetText = this.userParams.onBehalfOf_Phone
          this.global.review.onBehalfOf_PhoneDescription = this.userParams.onBehalfOf_Phone
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
        case 'Claimant Name':
          targetText = this.liabilityParams.claimant_FullName
            ? this.liabilityParams.claimant_FullName
            : ''
          break
        case 'Claimant Email':
          targetText = this.liabilityParams.claimant_Email
          break
        case 'Claimant Phone':
          targetText = this.liabilityParams.claimant_Phone
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
        case 'Attorney Name':
          targetText = this.liabilityParams.attorney_FullName
            ? this.liabilityParams.attorney_FullName
            : ''
          break
        case 'Attorney Email':
          targetText = this.liabilityParams.attorney_Email
          break
        case 'Attorney Phone':
          targetText = this.liabilityParams.attorney_Phone
          break
        default:
          throw new Error(
            `Error: Processing an attorney information item that is not yet defined: ${labelText}`
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
      await this.HandleDamageReason(SingerDamageReasonTypes.Liability)
    }

    await this.HandleLiability(liabilities)
    await this.HandleLiabilityInformation()

    await this.CheckServerPrompt(FNOLServerPrompts.LiabilityInformation, 1)
    await this.CheckServerPrompt(FNOLServerPrompts.RetainLiabilityRecords, 2)
    if (this.liabilityParams.claimant_FullName != null) {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.AddThirdPartyClaimant,
        0, // Add
        3
      )
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

    if (this.liabilityParams.attorney_FullName != null) {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.AddAttorney,
        0, // Add
        1 + this.promptOffsetTracking
      )
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
  }

  async HandleUserPolicyLookup(userParams: BPUserParameters) {
    switch (userParams.userType) {
      case UserTypes.Internal:
      case UserTypes.Agent:
        await this.CheckServerPromptAndSelectLink(FNOLServerPrompts.DoYouHaveThePolicyNumber, 0, 2)
        await this.CheckServerPrompt(FNOLServerPrompts.PolicyLookupLastName_Intro, 5)
        await this.CheckServerPromptAndRespond(
          FNOLServerPrompts.PolicyLookupLastName_FirstTry,
          userParams.policy.lastName.trim(),
          6
        )
        break
      default:
        await this.CheckServerPromptAndSelectLink(FNOLServerPrompts.DoYouHaveThePolicyNumber, 0, 1)
        await this.CheckServerPrompt(FNOLServerPrompts.PolicyLookupLastName_Intro, 4)
        await this.CheckServerPromptAndRespond(
          FNOLServerPrompts.PolicyLookupLastName_FirstTry,
          userParams.policy.lastName.trim(),
          5
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

  async HandleLossLocation() {
    this.global.review.lossOnPremises = this.userParams.lossLocationAtPolicyAddress
      ? OtherText.Yes
      : OtherText.No
    if (this.userParams.lossLocationAtPolicyAddress) {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.DidThisLossOccurAtThePolicyAddress,
        0 // yes
      )
      this.global.review.lossOnPremises = OtherText.Yes
    } else {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.DidThisLossOccurAtThePolicyAddress,
        1 // no
      )

      switch (this.userParams.userType) {
        case UserTypes.Internal:
          await this.CheckServerPromptAndRespond(
            FNOLServerPrompts.DescribeTheLocationOfThisLoss,
            this.userParams.lossLocationDescription
          )
          this.global.review.lossLocationDescription = this.userParams.lossLocationDescription
          this.global.review.lossOnPremises = OtherText.No
          break
        default:
          await this.CheckServerPrompt(FNOLServerPrompts.OffPremisesLossLocationTerminates)
      }
    }
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
    await this.HandleLossDate(this.userParams.lossDateDelta)
    await this.HandleLossLocation()
  }

  async HandleDamageReason(
    damageReasonType: null | SingerDamageReasonTypes = null,
    skipTheftHandling = false
  ) {
    let damageReasonTypeToUse = null
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
    //this.userParams.undoTopic = null
    if (damageReason.type == SingerDamageReasonTypes.Theft && !skipTheftHandling) {
      await this.HandleTheftDamageFlow()
      //this.userParams.undoTopic = null
    }

    if (damageReason.type == SingerDamageReasonTypes.LossAssessment) {
      await this.HandleLossAssessmentFlow()
      this.finishParams.isLossAssessment = true
      //this.userParams.undoTopic = null
    }

    if (damageReason.type == SingerDamageReasonTypes.Water) {
      await this.HandleOriginOfWaterDamageFlow()
      //this.userParams.undoTopic = null
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
      FNOLServerPrompts.WasTherePhysicalDamageToTheResidence,
      this.userParams.theft_PhysicalDamage ? 0 : 1, // yes:no
      this.userParams.undoTopic != null ? 2 : 1
    )
    this.global.review.theft_PhysicalDamageDescription = this.userParams.theft_PhysicalDamage
      ? OtherText.Yes
      : OtherText.No
    this.userParams.undoTopic = null
  }

  async HandleOriginOfWaterDamageFlow() {
    if (this.userParams.originOfWaterDamage == null || this.userParams.plumbingType == null) {
      throw new Error('Something was not initialized')
    }
    await this.CheckServerPromptAndSelectButton(
      FNOLServerPrompts.WhatCausedTheWaterDamage,
      this.userParams.originOfWaterDamage.type,
      this.userParams.undoTopic != null ? 2 : 1
    )
    this.global.review.originOfWaterDamageDescription = this.userParams.originOfWaterDamage.result
    this.userParams.undoTopic = null

    if (this.userParams.originOfWaterDamage.type == SingerWaterDamageTypes.Plumbing) {
      await this.HandlePlumbingTypeFlow()
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
  }

  async HandleDamageAreas(damageAreas: number) {
    await this.CheckServerPrompt(
      FNOLServerPrompts.IndicateWhereTheDamageOccurred,
      1 + this.promptOffsetTracking + (this.userParams.undoTopic == 'Damaged Areas' ? 1 : 0)
    )
    this.userParams.undoTopic = null
    let expectedUserEcho = ''
    let reviewDescription = ''
    let additionalDamageDescription = ''
    this.userParams.isContentsOrPersonalPropertyOnly =
      damageAreas == SingerDamageAreaTypes.ContentsOrPersonalProperty
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
  }

  async HandleInteriorDamageFlow(
    interiorDamages: number,
    standingWater = false,
    numberOfRooms = GetRandomInteriorRooms(),
    mitigation = GetRandomInteriorMitigations()
  ) {
    await this.HandleInteriorDamages(interiorDamages)
    if (
      interiorDamages & SingerInteriorDamageTypes.WaterDamage ||
      interiorDamages & SingerInteriorDamageTypes.PlumbingIssues
    ) {
      if (!standingWater) {
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.Interior_IsThereStillStandingWater,
          1
        )
        this.global.review.interior_StandingWaterPresent = OtherText.No
      } else {
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.Interior_IsThereStillStandingWater,
          0
        )
        this.global.review.interior_StandingWaterPresent = OtherText.Yes
      }
    }

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
    const selfButtonIndex =
      this.userParams.userType == UserTypes.Agent || this.userParams.userType == UserTypes.Internal
        ? 3
        : 0
    const selfButtonLinkText =
      FNOLServerPrompts.Interior_HaveStepsBeenTakenToContainTheDamage.responses[selfButtonIndex]
    switch (mitigation) {
      case Interior_Mitigations.SelfRepaired:
        await this.CheckServerPrompt(
          FNOLServerPrompts.Interior_HaveStepsBeenTakenToContainTheDamage
        )
        await this.SelectServerButton(
          FNOLServerPrompts.Interior_HaveStepsBeenTakenToContainTheDamage,
          0,
          false,
          selfButtonLinkText
        )
        this.global.review.mitigationStepsCompleted = OtherText.Self
        break
      case Interior_Mitigations.RepairedProfessionally:
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.Interior_HaveStepsBeenTakenToContainTheDamage,
          1 // professional
        )
        this.global.review.mitigationStepsCompleted = OtherText.Professional
        break
      case Interior_Mitigations.NoRepairsCompleted:
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.Interior_HaveStepsBeenTakenToContainTheDamage,
          2 // No
        )
        this.global.review.mitigationStepsCompleted = OtherText.NoRepairs
        break
      default:
        throw new Error(
          `Error: Processing an Interior Mitigation that is not yet defined: Interior Mitigation passed ${mitigation}`
        )
    }
    this.userParams.undoTopic = null
  }

  async HandleInteriorDamages(interiorDamages: number) {
    await this.CheckServerPrompt(
      FNOLServerPrompts.IsThereAnyOtherDamageInTheHome,
      1 +
        this.promptOffsetTracking +
        (this.userParams.undoTopic == 'Interior Damage Questions' ? 3 : 0)
    )
    this.userParams.undoTopic = null
    let expectedUserEcho = ''
    let reviewDescription = ''
    for (const interiorDamageKey in Object.keys(InteriorDamage)) {
      const interiorDamage = Object.values(InteriorDamage)[interiorDamageKey]
      if (interiorDamages & interiorDamage.type) {
        const selectionLocator = this.page
          .frameLocator('#bp-widget')
          .locator(`.bpw-keyboard .multiselect label[for="${interiorDamage.id}"]`)
        await selectionLocator.click()
        const concat = expectedUserEcho.length == 0 ? '' : ', '
        const reviewConcat = reviewDescription.length == 0 ? '' : ','
        expectedUserEcho += `${concat}${interiorDamage.echo}`
        reviewDescription += `${reviewConcat}${interiorDamage.result}`
      }
    }
    this.global.review.interior_DamageTypeDescription = reviewDescription
    const buttonSelector = this.page.frameLocator('#bp-widget').locator('.bpw-keyboard .trigger')
    await buttonSelector.click()
    this.conversationIndex += 1
    await this.VerifyUserEchoText(expectedUserEcho)
    this.conversationIndex += 1
    this.promptOffsetTracking = 0
    this.userParams.undoTopic = null
    this.userParams.isTreeOnStructure =
      (interiorDamages & SingerInteriorDamageTypes.TreeOnStructure) ==
      SingerInteriorDamageTypes.TreeOnStructure
    this.userParams.isDamagedEntryway =
      (interiorDamages & SingerInteriorDamageTypes.DamagedEntrypoint) ==
      SingerInteriorDamageTypes.DamagedEntrypoint
  }

  async HandleExteriorDamageFlow(
    debrisOrTrees: boolean = RandomTrueFalse(),
    openToTheElements: boolean = RandomTrueFalse()
  ) {
    if (!this.userParams.isTreeOnStructure) {
      const debrisPromptToUse = this.userParams.isPostStorm
        ? FNOLServerPrompts.PostStorm_Exterior_HaveDebrisOrTreesCausedDamage
        : FNOLServerPrompts.Exterior_HaveDebrisOrTreesCausedDamage
      if (debrisOrTrees) {
        await this.CheckServerPromptAndSelectButton(
          debrisPromptToUse,
          0, // yes
          this.userParams.undoTopic != null
            ? 4 + this.promptOffsetTracking
            : 1 + this.promptOffsetTracking
        )
        this.userParams.undoTopic = null
        this.global.review.exterior_DebrisDescription = OtherText.Yes
      } else {
        await this.CheckServerPromptAndSelectButton(
          debrisPromptToUse,
          1, // no
          this.userParams.undoTopic != null
            ? 4 + this.promptOffsetTracking
            : 1 + this.promptOffsetTracking
        )
        this.userParams.undoTopic = null
        this.global.review.exterior_DebrisDescription = OtherText.No
      }
      this.promptOffsetTracking = 0
    } else {
      // Tree on Structure damage skips the question and auto sets Damage From Debris -> Yes
      this.global.review.exterior_DebrisDescription = OtherText.Yes
    }

    if (!this.userParams.isDamagedEntryway && !this.userParams.isTreeOnStructure) {
      const elementsPromptToUse = this.userParams.isPostStorm
        ? FNOLServerPrompts.PostStorm_Exterior_IsResidenceOpenToTheElements
        : FNOLServerPrompts.Exterior_IsResidenceOpenToTheElements
      if (openToTheElements) {
        await this.CheckServerPromptAndSelectButton(
          elementsPromptToUse,
          0 // no
        )
        this.global.review.exterior_OpenToElementsDescription = OtherText.Yes
      } else {
        await this.CheckServerPromptAndSelectButton(
          elementsPromptToUse,
          1 // yes
        )
        this.global.review.exterior_OpenToElementsDescription = OtherText.No
      }
    } else {
      // Entryway or Tree on Structure damage skips the question and auto sets OpenToTheElements -> Yes
      this.global.review.exterior_OpenToElementsDescription = OtherText.Yes
    }
    //this.userParams.undoTopic = null;
  }

  async HandleRoofDamageFlow(
    visibleDamage: boolean = RandomTrueFalse(),
    hasBeenBreached: boolean = RandomTrueFalse(),
    waterThroughRoof: boolean = false
  ) {
    const damagePromptToUse = this.userParams.isPostStorm
      ? FNOLServerPrompts.PostStorm_Roof_IsThereVisibleDamage
      : FNOLServerPrompts.Roof_IsThereVisibleDamage
    this.global.review.additional_DamageTypeDescription = DamageArea.Roof.additional
    if (visibleDamage) {
      await this.CheckServerPromptAndSelectButton(
        damagePromptToUse,
        0, // yes
        this.userParams.undoTopic != null ? 4 : 1
      )
      this.global.review.roof_VisibleDamage = OtherText.Yes
    } else {
      await this.CheckServerPromptAndSelectButton(
        damagePromptToUse,
        1, // no
        this.userParams.undoTopic != null ? 4 : 1
      )
      this.global.review.roof_VisibleDamage = OtherText.No
    }
    this.userParams.undoTopic = null
    const breachedPromptToUse = this.userParams.isPostStorm
      ? FNOLServerPrompts.PostStorm_Roof_HasBeenBreached
      : FNOLServerPrompts.Roof_HasBeenBreached
    if (hasBeenBreached) {
      await this.CheckServerPromptAndSelectButton(
        breachedPromptToUse,
        0 // yes
      )
      this.global.review.roof_HasBeenBreachedDescription = OtherText.Yes
    } else {
      await this.CheckServerPromptAndSelectButton(
        breachedPromptToUse,
        1 // no
      )
      this.global.review.roof_HasBeenBreachedDescription = OtherText.No
    }
    if (waterThroughRoof) {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.Roof_IsThereWaterInTheHome,
        0 // yes
      )
      this.global.review.roof_WaterThroughRoofDescription = OtherText.Yes
    } else {
      await this.CheckServerPromptAndSelectButton(
        FNOLServerPrompts.Roof_IsThereWaterInTheHome,
        1 // no
      )
      this.global.review.roof_WaterThroughRoofDescription = OtherText.No
    }
  }

  async HandleOtherStructuresDamageFlow(otherStructuresDamages: number) {
    await this.CheckServerPrompt(
      FNOLServerPrompts.OtherStructures_WhatOtherStructuresWereDamaged,
      this.userParams.undoTopic != null ? 4 : 1
    )
    this.userParams.undoTopic = null
    let expectedUserEcho = ''
    let reviewDescription = ''
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
  }

  async HandlePersonalPropertyDamageFlow(skipFoodSpoilage = false, foodSpoilageOnlyDamage = false) {
    if (!skipFoodSpoilage) {
      if (foodSpoilageOnlyDamage) {
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.PersonalProperty_FoodSpoilage,
          0,
          this.userParams.undoTopic != null ? 4 : 1
        )
        this.global.review.personalProperty_FoodSpoilageOnlyDescription = OtherText.Yes
      } else {
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.PersonalProperty_FoodSpoilage,
          1,
          this.userParams.undoTopic != null ? 4 : 1
        )
        this.global.review.personalProperty_FoodSpoilageOnlyDescription = OtherText.No
      }
    } else {
      this.global.review.personalProperty_FoodSpoilageOnlyDescription = OtherText.No
    }
    this.userParams.undoTopic = null
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
      if (this.finishParams.estimateToUpload != null) {
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.UploadEstimateHere,
          1, // Upload
          1,
          null,
          true
        )
        await this.CheckServerPrompt(FNOLServerPrompts.ClickBelowToAddDocument, 1)
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
        this.promptOffsetTracking = 1
      } else {
        await this.CheckServerPrompt(FNOLServerPrompts.UploadEstimateHere, 1)

        await this.SelectServerButton(
          FNOLServerPrompts.UploadEstimateHere,
          0, // I don't have it
          true
        )

        await this.CheckServerPrompt(FNOLServerPrompts.SubmitEstimates, 2)
        this.promptOffsetTracking = 2
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
    if (this.userParams.undoTopic === UndoText.AdditionalQuestions) {
      this.promptOffsetTracking = 0
    } else {
      this.userParams.undoTopic = null
    }
  }

  async HandleDefaultFinish() {
    if (this.finishParams.isLossAssessment) {
      this.global.review.isHomeHabitableDescription = OtherText.Yes
      this.global.review.repairEstimateDescription = OtherText.No
    } else {
      if (!this.finishParams.skipEstimateForRepairs) {
        await this.HandleEstimateForRepairs()
      }
      if (!this.finishParams.skipBigChunk) {
        await this.HandleSafeToRemainFlow()
        if (this.finishParams.stopBeforeUpload) {
          return
        }
        await this.HandleUploadImages()
        await this.HandleLossDescription()
      }
      if (this.finishParams.isLiability) {
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
        1 + this.promptOffsetTracking + (this.userParams.undoTopic != null ? 1 : 0)
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
        1 + this.promptOffsetTracking + (this.userParams.undoTopic != null ? 1 : 0)
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

    await this.CheckServerPrompt(FNOLServerPrompts.IEncourageYouToPhotographTheDamage)

    if (this.finishParams.uploadImagesFlow == UploadImageOptions.NoCameraAvailable) {
      // bailing here:
      await this.SelectServerButton(
        FNOLServerPrompts.IEncourageYouToPhotographTheDamage,
        0, // No Camera Available
        true
      )
      this.promptOffsetTracking = +1
      return
    }

    // on to the next question
    await this.SelectServerButton(
      FNOLServerPrompts.IEncourageYouToPhotographTheDamage,
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
        case 'Damage Remediation Completed':
          targetText = review.mitigationStepsCompleted.toUpperCase()
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
        case 'Theft Physical Damage':
          targetText = review.theft_PhysicalDamageDescription.toUpperCase()
          break
        case 'Claimant Name':
          targetText = this.liabilityParams.claimant_FullName
            ? this.liabilityParams.claimant_FullName
            : ''
          break
        case 'Claimant Email':
          targetText = this.liabilityParams.claimant_Email
          break
        case 'Claimant Phone':
          targetText = this.liabilityParams.claimant_Phone
          break
        case 'Attorney Name':
          targetText = this.liabilityParams.attorney_FullName
            ? this.liabilityParams.attorney_FullName
            : ''
          break
        case 'Attorney Email':
          targetText = this.liabilityParams.attorney_Email
          break
        case 'Attorney Phone':
          targetText = this.liabilityParams.attorney_Phone
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
        case 'Claim Reporter Relationship':
          targetText = review.onBehalfOf_TypeDescription
          break
        case 'Claim Reporter First Name':
          targetText = review.onBehalfOf_FirstNameDescription
          break
        case 'Claim Reporter Last Name':
          targetText = review.onBehalfOf_LastNameDescription
          break
        case 'Claim Reporter Name':
          targetText = review.onBehalfOf_FullNameDescription
          break
        case 'Claim Reporter Company':
          targetText = review.onBehalfOf_CompanyDescription
          break
        case 'Claim Reporter Phone':
          targetText = review.onBehalfOf_PhoneDescription
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
        case 'Loss on Premises':
          targetText = review.lossOnPremises.toUpperCase()
          break
        case 'Loss Location Description':
          targetText = review.lossLocationDescription
          break
        case 'Food Spoilage Only':
          targetText = review.personalProperty_FoodSpoilageOnlyDescription.toUpperCase()
          break
        case 'Standing Water Present':
          targetText = review.interior_StandingWaterPresent.toUpperCase()
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
    const expectedButtonText = goBack ? FNOLPromptLinks.GoBack : FNOLPromptLinks.ConfirmValues
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
    const splitItUp = actualServerPromptText.match(/: [0-9a-z]{12}./)
    if (splitItUp == null) {
      throw new Error(
        `Error: Post Submit message does not contain a claim number. Got: ${actualServerPromptText}`
      )
    }
    const actualClaimNumber = splitItUp[0]
    const genericizedActualServerPromptText = actualServerPromptText.replace(
      actualClaimNumber,
      ': <CLAIMNUMBER>.'
    )
    switch (this.userParams.userType) {
      case UserTypes.Internal:
      case UserTypes.Agent:
        expect(genericizedActualServerPromptText).toBe(
          FNOLServerPromptText.ClaimHasBeenSubmitted_InternalAgent
        )
        break
      default:
        expect(genericizedActualServerPromptText).toBe(FNOLServerPromptText.ClaimHasBeenSubmitted)
    }
    if (this.finishParams.expectMitigation) {
      await this.HandleMitigation()
    } else {
      await this.CheckServerPrompt(FNOLServerPrompts.YouCanCloseThisWindowNow, 2)
    }
  }

  async HandleMitigation() {
    switch (this.userParams.userType) {
      case UserTypes.Internal:
      case UserTypes.Agent:
        await this.CheckServerPromptAndSelectButton(
          FNOLServerPrompts.PromptForMitigation_InternalAgent,
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
    switch (expectedPrompt.prompt) {
      case FNOLServerPrompts.WhatTypeOfLossDidThePropertySustain.prompt:
      case FNOLServerPrompts.IndicateWhereTheDamageOccurred.prompt:
      case FNOLServerPrompts.IsThereAnyOtherDamageInTheHome.prompt:
      case FNOLServerPrompts.OtherStructures_WhatOtherStructuresWereDamaged.prompt:
      case FNOLServerPrompts.WhyIsTheResidenceNotLivable.prompt:
      case FNOLServerPrompts.ReviewInformation.prompt:
      case FNOLServerPrompts.SelectLiabilityType.prompt:
      case FNOLServerPrompts.ClickBelowToAddDocument.prompt:
      case FNOLServerPrompts.LiabilityInformation.prompt:
      case FNOLServerPrompts.ThirdPartyClaimantInformation.prompt:
      case FNOLServerPrompts.AttorneyInformation.prompt:
      case FNOLServerPrompts.UploadAssessmentLetterNow.prompt:
      case FNOLServerPrompts.UploadEstimateHere.prompt:
      case FNOLServerPrompts.IEncourageYouToPhotographTheDamage.prompt:
      case FNOLServerPrompts.ClickBelowToAddPictures.prompt:
        await this.CheckPrompt(
          expectedPrompt.prompt,
          multiPromptIndex,
          serverPromptIndex,
          '.bpw-chat-bubble-content > div'
        )
        break
      case FNOLServerPrompts.ScanTheQRCodeBelow.prompt:
        await this.CheckPrompt(
          expectedPrompt.prompt,
          multiPromptIndex,
          serverPromptIndex,
          '.bpw-chat-bubble-content p'
        )
        break
      case FNOLServerPrompts.LiabilityTerminates.prompt:
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
    skipAdvanceAndEchoCheck: boolean = false,
    overrideResponseText: null | string = null
  ) {
    let locator: Locator
    switch (expectedPrompt) {
      // case FNOLServerPrompts.UploadImages:
      // case FNOLServerPrompts.PostStorm_UploadImages:
      case FNOLServerPrompts.UploadAssessmentLetterNow:
      case FNOLServerPrompts.UploadEstimateHere:
      case FNOLServerPrompts.IEncourageYouToPhotographTheDamage:
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
      const expectedButton =
        overrideResponseText == null ? expectedPrompt.responses[buttonIndex] : overrideResponseText
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
