export declare const randomString: (length: number) => string;

export declare const md5: (plainText?: string) => string;

export declare const deleteFile: (file: string) => Promise<boolean>;

export declare const pickFields: (
  fields: [string],
  data: Record<string, any>
) => Record<string, any>;

export declare const decodeJwt: (
  cipher: string,
  secreteKey: string
) => Promise<any>;

export declare const EncodeJwt: (
  data: any,
  secreteKey: string,
  duration: string | number
) => Promise<any>;

export declare const encodeJwt: (obj: {
  data: any;
  secreteKey: string;
  duration: string | number;
}) => Promise<any>;

export declare const fileExists: (file: string) => Promise<boolean>;

export declare const createPath: (path: string) => Promise<any>;

export declare const validate: (
  schema: any,
  object: Record<string, any>,
  option?: { abortEarly: boolean; allowUnknown: boolean }
) => any;

export declare const joiValidator: (constraint: any) => Promise<any>;

export declare const removeUpload: (
  files: string | string[]
) => Promise<boolean>;

export declare const uniqueString: (capitalize?: boolean) => string;

export declare const shuffelWord: (word: string | number) => string;

export declare const errorMessage: (
  err: any,
  ERROR_TYPE?: string
) => Record<string, any>;

export declare const decrypt: (cipherText: string, secret: string) => string;

export declare const rand: (min?: number, max?: number) => number;

export declare const uploadFile: (obj: {
  name?: string;
  limit?: number;
  allowedFormat?: any[];
  location?: string;
}) => any;

export declare const base64ToFile: (
  base64String: string,
  path: string
) => string;
export declare const slugify: (text: string, lowerCase?: boolean) => string;
export declare const htmlEncode: (value: string) => any;
export declare const htmlDecode: (value: any) => any;
export declare const readJson: (path: string) => Promise<Record<string, any>>;
export declare const isFile: (path: string) => Promise<boolean>;
export declare const dateFormat: (
  path: string | Date,
  format: string
) => string;
export declare const paginate: (
  totalCount: number,
  currentPage: number,
  perPage: number
) => {
  pageCount: number;
  offset: number;
};

export declare const encrypt: (
  plaintext: string,
  secret: string,
  expired?: string | number
) => Promise<any>;

export declare const getContent: (obj: {
  url: string;
  method?: "GET" | "DELETE";
  headers?: Record<string, any>;
  token?: string;
  data?: Record<string, any>;
}) => Promise<any>;

export declare const postContent: (obj: {
  url: string;
  token?: string;
  data?: Record<string, any>;
  method?: "POST" | "PUT" | "PATCH";
  headers?: Record<string, any>;
}) => Promise<any>;

export declare const successMessage: (
  value: string
) => { success: boolean; message: string };

export declare const urlQueryToString: (query: string) => string;
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
