import { test } from '@playwright/test'

test.beforeAll(async () => {})

test.beforeEach(async () => {})

test.afterEach(async ({ browser }) => {
  const contexts = browser.contexts()
  for (let index = 0; index < contexts.length; index++) {
    await contexts[index].close()
  }
})

test.afterAll(async () => {})
export default test
