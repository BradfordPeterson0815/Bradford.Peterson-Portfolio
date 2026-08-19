import path from 'path'
import { fileURLToPath } from 'url'
import { BotpressEnvironmentType } from '../library/shared/constants.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const authStorageRoot = path.join(__dirname, '../.auth/')
export const DEFAULT_ENVIRONMENT = BotpressEnvironmentType.devenv

export class shared {
  public static ADMIN_EMAIL = process.env.USER_ADMIN_EMAIL ?? ''
  public static ADMIN_PASSWORD = process.env.USER_ADMIN_PASSWORD ?? ''
  public static BOTPRESS_HOMEPAGE_URL = process.env.BOTPRESS_HOMEPAGE_URL ?? ''
  public static ENVIRONMENT = process.env.CURRENT_ENVIRONMENT ?? DEFAULT_ENVIRONMENT
  public static AUTH_STORAGE_PATH = path.join(authStorageRoot, 'bp.session.json')
}

export class eagle {
  public static BASE_URL = process.env.EAGLE_BASE_URL ?? ''
  public static LOCALHOST_URL = process.env.EAGLE_LOCALHOST_URL ?? ''
}

export class singer {
  public static BASE_URL = process.env.SINGER_BASE_URL ?? ''
  public static LOCALHOST_URL = process.env.SINGER_LOCALHOST_URL ?? ''
}
