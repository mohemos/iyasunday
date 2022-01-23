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
export type slugify = (text: string, lowerCase?: boolean) => string;
export type htmlEncode = (value: string) => any;
export type htmlDecode = (value: any) => any;
export type readJson = (path: string) => Promise<Record<string, any>>;
export type isFile = (path: string) => Promise<boolean>;
export type dateFormat = (path: string | Date, format: string) => string;
export type paginate = (
  totalCount: number,
  currentPage: number,
  perPage: number
) => {
  pageCount: number;
  offset: number;
};

export type encrypt = (
  plaintext: string,
  secret: string,
  expired?: string | number
) => Promise<any>;

export type getContent = (obj: {
  url: string;
  method?: "GET" | "DELETE";
  headers?: Record<string, any>;
  token?: string;
  data?: Record<string, any>;
}) => Promise<any>;

export type postContent = (obj: {
  url: string;
  token?: string;
  data?: Record<string, any>;
  method?: "POST" | "PUT" | "PATCH";
  headers?: Record<string, any>;
}) => Promise<any>;

export type successMessage = (
  value: string
) => { success: boolean; message: string };

export type urlQueryToString = (query: string) => string;
export class InvalidTokenError extends Error {}
export class TokenExpiredError extends Error {}
export class AuthenticationError extends Error {}
export class AuthorizationError extends Error {}
export class EntryExistError extends Error {}
export class EntryNotFoundError extends Error {}
export class NotFoundError extends Error {}
export class ExistsError extends Error {}
export class ValidationError extends Error {}
export class PaymentRequiredError extends Error {}
