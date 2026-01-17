/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_VERSION?: string
  readonly VITE_APP_URL?: string
  readonly VITE_NODE_ENV?: string
  readonly VITE_MAX_FILE_SIZE?: string
  readonly VITE_ALLOWED_FILE_TYPES?: string
  readonly VITE_ENABLE_ANALYTICS?: string
  readonly VITE_ENABLE_SENTRY?: string
  readonly GITHUB_PAGES?: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
