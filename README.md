# iyasunday
Utility functions for Node.js and React developers

> Deprecated: This package has been deprecated. Kindly update to latest Node.js version as most of the functions are now native to Node.js.

## Installation

```bash
npm install iyasunday
# or
yarn add iyasunday
```

## Quick start

```js
const Iya = require('iyasunday');

// Generate a random string
const token = Iya.randomString(16);

// Slugify a title
const slug = Iya.slugify('Hello, World!');

// Make HTTP requests
const data = await Iya.getContent({ url: 'https://api.example.com/items' });
```

## API Reference

Below is a catalog of the available utilities. All functions are available from the package root:

```js
const Iya = require('iyasunday');
// Iya.functionName(...)
```

### Strings and text
- `randomString(length = 10): string` – Generate a random base36 string of a given length.
- `uniqueString(capitalize = false): string` – Time-seeded unique string; uppercase when `capitalize` is true.
- `shuffelWord(word: string | number): string` – Randomly shuffle characters.
- `slugify(text: string, lowerCase = true): string` – URL slug; removes special characters. Uses `slugify` under the hood.
- `htmlEncode(value: string): string` – Encode HTML special characters.
- `htmlDecode(value: string): string` – Decode HTML entities.
- `md5(plainText?: string): string` – Return MD5 hash of a string.

### Crypto and tokens
- `encrypt(plainText: string, secret: string, expireMinutes?: number): string` – Symmetric encryption using `cryptr`. If `expireMinutes` is set, the token carries an expiry.
- `decrypt(cipherText: string, secret: string): string` – Decrypt a token produced by `encrypt`; throws `TokenExpiredError` when expired.
- `encodeJwt({ data, secreteKey, duration = '24h' }): Promise<string>` – Sign a JWT.
- `EncodeJwt(data, secreteKey, duration = '24h'): Promise<string>` – Same as `encodeJwt` but positional args.
- `decodeJwt(cipher: string, secreteKey): Promise<any>` – Verify a JWT from an `Authorization` header value (e.g. `Bearer <token>`).

### HTTP helpers
- `getContent({ url, method = 'GET', headers = {}, token, data }): Promise<any>` – Perform a request; attaches `X-Requested-With` and optional `Authorization` header.
- `postContent({ url, token, data, method = 'POST', headers = {} }): Promise<any>` – POST/PUT/PATCH helper. Errors contain `httpStatusCode` when available.
- `urlQueryToString(query: Record<string, any>): string` – Serialize a plain object to `?key=value&...`.

### Files and uploads
- `fileExists(path: string): Promise<boolean>` – Check if a file exists.
- `isFile(path: string): Promise<boolean>` – Alias that resolves true/false if accessible.
- `deleteFile(path: string): Promise<boolean>` – Delete a file if it exists.
- `createPath(path: string): Promise<boolean>` – Recursively create a directory if missing.
- `uploadFile(opts): multer.Instance` – Configure a Multer disk storage:
  - `name?: string` – Optional output filename root.
  - `limit = 5` – Max size in MB.
  - `allowedFormat = ['jpg','jpeg','png','gif']` – Restrict extensions.
  - `location = '/'` – Output directory; auto-created.
- `removeUpload(files): Promise<void>` – Remove uploaded file(s) by Multer result shape.
- `base64ToFile(base64: string, path: string): Promise<string>` – Persist a base64 data URL to `path` and return the created filepath.
- `readJson(path: string): Promise<object>` – Read and parse a JSON file.

### Dates and numbers
- `dateFormat(date: Date | string, format = 'DD-MM-YYYY'): string` – Format dates via `moment`.
- `rand(min = 0, max = 10000): number` – Random integer in range inclusive.
- `paginate(totalCount: number, currentPage: number, perPage: number): { pageCount, offset }` – Page math helper.

### Validation
- `validate(schema, object, option?): any` – Run Joi schema validation and throw `ValidationError` on failure.
- `joiValidator(constraint, isMiddleware = true)` – Express middleware generator or direct validator:
  - As middleware: pass `{ body?, params?, query?, headers? }` each with `{ schema, options }`.
  - As function: pass `{ schema, data, option }` and set `isMiddleware = false`.

### Express helpers
- `successMessage(message: string): { success: true, message }` – Convenience success shape.
- `notFound(message: string): { success: false, message }` – Convenience not-found shape.
- `errorMessage(err, ERROR_TYPE = 'FATAL_ERROR')` – Normalize errors. In non-production logs stack; maps Axios errors to `{ message, httpStatusCode, error }`.
- `appRequestOnly()` – Express middleware enforcing a signed `app_key` header. Uses `decrypt` and `process.env.APP_KEY`.

### Errors
Custom errors include the `httpStatusCode` property:
- `InvalidTokenError`, `TokenExpiredError`, `AuthenticationError`, `AuthorizationError`, `EntryExistError`, `EntryNotFoundError`, `NotFoundError`, `ExistsError`, `ValidationError`, `PaymentRequiredError`.

## Examples

### File upload route (Express + Multer)
```js
const express = require('express');
const Iya = require('iyasunday');
const app = express();

const upload = Iya.uploadFile({ location: './uploads', allowedFormat: ['png','jpg'] });

app.post('/photos', upload.single('photo'), (req, res) => {
  res.json(Iya.successMessage('Uploaded'));
});
```

### Joi validation middleware
```js
const Iya = require('iyasunday');
const Joi = require('joi');

app.post(
  '/users',
  Iya.joiValidator({
    body: { schema: Joi.object({ email: Joi.string().email().required() }) },
  }),
  (req, res) => res.json({ body: req.body })
);
```

### Axios wrapper
```js
const Iya = require('iyasunday');

const item = await Iya.postContent({
  url: 'https://api.example.com/items',
  token: `Bearer ${jwt}`,
  data: { name: 'Sample' },
});
```

## Migration notes
Most of these utilities have native equivalents in modern Node.js and popular libraries:
- Use `crypto.randomUUID()`/`crypto.randomBytes()` for IDs.
- Use `fetch` (Node 18+) or `axios` directly for HTTP.
- Use `URLSearchParams` for query strings.
- Use `fs/promises` for file utilities.

## License
MIT © Moses Peter
