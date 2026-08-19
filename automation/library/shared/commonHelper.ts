import test from './testHooks.js'
import { ErrorOnAbort, ThrowErrorOnAbort } from './constants.js'

export function AbortTest(reason: string) {
  if (ThrowErrorOnAbort) {
    test.info().annotations.push({
      type: ErrorOnAbort,
      description: reason,
    })
  }
}
