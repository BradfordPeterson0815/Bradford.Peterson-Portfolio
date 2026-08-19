import { BrowserTypes } from './bpConstants.js'

export class TestParameters {
  runAsHeadless!: boolean
  browserType!: BrowserTypes
  environment!: string
  payload!: string
  constructor() {}
}
