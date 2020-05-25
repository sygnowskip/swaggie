export interface ClientOptions {
  src: string;
  out: string;
  template: string;
  baseUrl: string;
  reactHooks: boolean;
  preferAny?: boolean;
  servicePrefix?: string;
  queryModels?: boolean;

  dateFormat?: DateSupport;
}

export interface FullAppOptions extends ClientOptions {
  config: string;
}

export type DateSupport = 'string' | 'Date'; // 'luxon', 'momentjs', etc
