export type randomString = (length: number) => string;

export type md5 = (plainText?: string) => string;

export type deleteFile = (file: string) => Promise<boolean>;

export type pickFields = (
  fields: [string],
  data: Record<string, any>
) => Record<string, any>;

export type decodeJwt = (cipher: string, secreteKey: string) => Promise<any>;

export type EncodeJwt = (
  data: any,
  secreteKey: string,
  duration: string | number
) => Promise<any>;

export type encodeJwt = (obj: {
  data: any;
  secreteKey: string;
  duration: string | number;
}) => Promise<any>;

export type fileExists = (file: string) => Promise<boolean>;

export type createPath = (path: string) => Promise<any>;

export type validate = (
  schema: any,
  object: Record<string, any>,
  option?: { abortEarly: boolean; allowUnknown: boolean }
) => any;

export type joiValidator = (constraint: any) => Promise<any>;

export type removeUpload = (files: string | string[]) => Promise<boolean>;

export type uniqueString = (capitalize?: boolean) => string;

export type shuffelWord = (word: string | number) => string;

export type errorMessage = (
  err: any,
  ERROR_TYPE?: string
) => Record<string, any>;

export type decrypt = (cipherText: string, secret: string) => string;

export type rand = (min?: number, max?: number) => number;

export type uploadFile = (obj: {
  name?: string;
  limit?: number;
  allowedFormat?: any[];
  location?: string;
}) => any;

export type base64ToFile = (base64String: string, path: string) => string;
