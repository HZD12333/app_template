interface RunEnv {
  RUN_ENV: string;
  IS_PRODUCTION: boolean;
  IS_TEST: boolean;
  IS_LOCAL_TEST: boolean;
  IS_GRAY: boolean;
}

declare const __GLOBAL_ENV__: RunEnv;

interface GlobalConfig {
  DOMAIN: string;
  ROOT_DOM_ID: string;
  MIYUAN_DOMAIN: string;
  OLD_MIYUAN_DOMAIN: string;
  MIYUAN_TRACK_URL: string;
  PREVIEW_DATA_KEY: string;
  CDN_PATH: string;
}

declare const __CONFIG__: GlobalConfig & Record<string, string>;

declare const OSS: any;

interface Window {
  __DEMO__?: unknown;
}
