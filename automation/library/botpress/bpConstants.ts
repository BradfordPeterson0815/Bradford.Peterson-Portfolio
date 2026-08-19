import { shared } from '../../environments/env.bp.js'
import { BotpressEnvironmentType } from '../shared/constants.js'

export const DefaultEnvironment = shared.ENVIRONMENT ?? BotpressEnvironmentType.devenv

export const NicelyFormedBPAuthOrigins = [
  {
    origin: `https://${shared.BOTPRESS_HOMEPAGE_URL.split('/')[2]}`,
    localStorage: [
      {
        name: 'chakra-ui-color-mode',
        value: 'light',
      },
    ],
  },
]

export enum BPClients {
  Singer = 'Singer',
  Eagle = 'Eagle',
}

export const DataTableStrings = {
  OpenTableSettings: 'Open table settings.',
  OpenTableSearch: 'Open table search.',
  AddTableFilter: 'Add table filter.',
  ExpandTable: 'Expand table.',
  CloseTable: 'Close table.',
  AssignContact: 'Assign Contact',
  GoToFirstPage: 'Go to first page.',
  GoToPreviousPage: 'Go to previous page.',
  GoToNextPage: 'Go to next page.',
  GoToLastPage: 'Go to last page.',
  PageXOfY: 'Page %X of %Y',
  GoToPage: '| Go to page:',
}

export const BotpressToolsPageStrings = {
  ActionMenu: 'Add Filter',
  ClearFilters: 'Clear Filters',
  ResetFilters: 'Reset Filters',
  SaveFilters: 'Save Filters',
  RemoveRow: 'Remove row',
  Alert_NoFilters: 'Click the "Add Filter" button to start filtering.',
  Filter_InvalidValue: 'String must contain at least 1 character(s)',
}

export enum UserTypes {
  Agent = 'Agent',
  Insured = 'Insured',
  Internal = 'Internal',
  NotSpecified = 'Not Specified',
}

export enum PostActions {
  Open = 'OPEN_CHAT_WINDOW',
  OpenGlobal = 'OPEN_GLOBAL_CHAT_WINDOW',
  Minimize = 'MINIMIZE_CHAT_WINDOW',
  Close = 'CLOSE_CHAT_WINDOW',
}

export enum BrowserTypes {
  Chromium = 'chromium',
  Firefox = 'firefox',
  Webkit = 'webkit',
}

export enum CompareMethods {
  Equals,
  StartsWith,
  EndsWith,
  Includes,
}
