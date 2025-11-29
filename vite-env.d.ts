// Augmented NodeJS.ProcessEnv to include API_KEY without redeclaring 'process'
// This fixes the "Cannot redeclare block-scoped variable 'process'" error.

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
