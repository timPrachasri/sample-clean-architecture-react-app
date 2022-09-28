declare namespace NodeJS {
  interface Process {
    /**
     * @deprecated Use `typeof window` instead
     */
    readonly browser: boolean
  }

  interface ProcessEnv {
    readonly CUSTOM_ENV: 'develop' | 'prod'
    readonly WORK_TRIAL_API_URL: string
  }
}

declare let window: any
