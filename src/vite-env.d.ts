interface ImportMetaEnv {
  readonly VITE_BACK_END_URL: string;
  readonly VITE_APP_PORT: number?;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
