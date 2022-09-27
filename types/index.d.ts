declare namespace NodeJS {
  interface Process {
    /**
     * @deprecated Use `typeof window` instead
     */
    readonly browser: boolean
  }

  interface ProcessEnv {
    readonly CUSTOM_ENV: 'develop' | 'prod'
  }
}

declare let window: any
