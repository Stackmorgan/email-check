<img src="https://i.ibb.co/Fqgxjt1N/Gemini-Generated-Image-m7irhdm7irhdm7ir.png" alt="StackVerify Logo" width="100%" style="max-width: 900px;">

<div align="center">

# @stackverify/email-check

**High-performance email validation library for Node.js and the browser.**

Validate syntax, detect disposable emails, verify DNS/MX records, and score inbox delivery likelihood — zero dependencies, fully tree-shakeable.

[![npm version](https://img.shields.io/npm/v/@stackverify/email-check?logo=npm&color=cb3837)](https://www.npmjs.com/package/@stackverify/email-check)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@stackverify/email-check)](https://bundlephobia.com/package/@stackverify/email-check)
[![license](https://img.shields.io/npm/l/@stackverify/email-check)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-≥18-339933?logo=node.js)](https://nodejs.org/)

[Installation](#installation) · [Quick Start](#quick-start) · [API](#api-reference) · [Tree-Shaking](#tree-shaking) · [Contributing](./CONTRIBUTING.md)

</div>

---

## Why email-check?

Validating email addresses goes far beyond regex. `@stackverify/email-check` gives you a **fast, lightweight, multi-layer validation pipeline** that catches invalid syntax, blocks disposable throwaway addresses, verifies the domain can actually receive mail, and estimates whether the message will land in the inbox or the spam folder.

| Capability | What it does | Browser | Node.js |
|---|---|---|---|
| **Syntax validation** | Regex-based RFC-light syntax check | ✅ | ✅ |
| **Disposable detection** | Flags 5,100+ known throwaway domains | ✅ | ✅ |
| **Domain existence** | DNS A/AAAA record lookup | ❌ | ✅ |
| **MX record check** | Verifies the domain can receive email | ❌ | ✅ |
| **Inbox scoring** | Rates delivery likelihood (low / medium / high) | ✅ | ✅ |

- **Zero dependencies** — nothing to install, nothing to audit.
- **Dual-format** — ships ESM and CommonJS out of the box.
- **Fully typed** — first-class TypeScript declarations.
- **Tree-shakeable** — import only what you need via sub-path exports.
- **312 KB dist total** — the disposable domain database compresses to ~27 KB gzipped.

---

## Installation

```bash
npm install @stackverify/email-check
```

```bash
yarn add @stackverify/email-check
```

```bash
pnpm add @stackverify/email-check
```

---

## Quick Start

### Full Validation (Node.js)

```ts
import { checkEmail } from "@stackverify/email-check";

const result = await checkEmail("user@gmail.com");

if (!result.isValid) {
  console.error(`Rejected: ${result.reason}`);
} else {
  console.log(`Accepted — inbox score: ${result.inbox.score} (${result.inbox.label})`);
}
```

### Browser-Only (Syntax + Disposable)

```ts
import { checkEmail } from "@stackverify/email-check";

// In the browser, DNS checks are skipped automatically.
const result = await checkEmail("user@example.com");

console.log(result.syntax);     // true
console.log(result.disposable); // false
```

### CommonJS

```js
const { checkEmail } = require("@stackverify/email-check");

checkEmail("user@example.com").then((result) => {
  if (!result.isValid) {
    console.log(`Invalid: ${result.reason}`);
  }
});
```

---

## API Reference

### `checkEmail(email: string): Promise<EmailCheckResult>`

Runs the full validation pipeline. Returns a result object.

#### Result Object

| Property | Type | Description |
|---|---|---|
| `isValid` | `boolean` | `true` if the email passed every applicable check. |
| `syntax` | `boolean` | `true` if the email matches a valid syntax pattern. |
| `disposable` | `boolean` | `true` if the domain is a known disposable / throwaway provider. |
| `domainExists` | `boolean` | `true` if the domain resolves via DNS. `false` in browsers. |
| `hasMX` | `boolean` | `true` if the domain has MX records. `false` in browsers. |
| `inbox` | `{ score: number; label: "low" \| "medium" \| "high" }` | Delivery likelihood estimate. |
| `reason` | `string \| null` | Human-readable reason the email was rejected, or `null` if valid. |

#### Possible `reason` values

| reason | Meaning |
|---|---|
| `"Invalid email syntax"` | The address does not match a valid email format. |
| `"Disposable email provider"` | The domain is a known temporary / throwaway service. |
| `"Domain does not exist"` | DNS lookup failed — the domain is not registered. |
| `"Domain cannot receive email"` | The domain has no MX records. |
| `null` | The email passed all checks. |

### Sub-Path Imports

Import only the pieces you need — bundlers will tree-shake the rest.

```ts
// Just syntax validation (111 bytes gzipped)
import { isValidSyntax } from "@stackverify/email-check/syntax";

// Just disposable detection (281 bytes gzipped + data)
import { isDisposable } from "@stackverify/email-check/disposable";

// Just inbox scoring (241 bytes gzipped)
import { inboxScore } from "@stackverify/email-check/inbox-score";
```

### `isValidSyntax(email: string): boolean`

Synchronous syntax check. Returns `true` if the email matches `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`.

### `isDisposable(domain: string): boolean`

Synchronous check against a database of 5,100+ known disposable email domains. Supports subdomain matching (e.g. `sub.mailinator.com` is flagged).

### `inboxScore(domain: string): { score: number; label: "low" | "medium" | "high" }`

Returns a delivery likelihood score. Trusted providers (Gmail, Outlook, Yahoo, iCloud, Proton, Zoho) receive a score of 95 ("high"). All other valid domains receive 70 ("medium").

---

## Tree-Shaking & Bundle Size

The library is designed for minimal bundle impact. If you only need one capability, import the sub-path directly:

```ts
// Your bundler (webpack, Vite, esbuild, Rollup) will only include what you import.
import { isValidSyntax } from "@stackverify/email-check/syntax";
```

| Import | Raw | Gzipped |
|---|---|---|
| `@stackverify/email-check` (full) | 1.5 KB | 527 B |
| `@stackverify/email-check/syntax` | 97 B | 111 B |
| `@stackverify/email-check/disposable` | 584 B | 281 B |
| `@stackverify/email-check/inbox-score` | 402 B | 241 B |
| Disposable domain data | 70 KB | 27 KB |

> The disposable domain database is the primary payload. If you do not need disposable detection, avoid importing it and your total cost is under 1 KB gzipped.

---

## Validation Pipeline

`checkEmail()` runs checks in order and **returns early** on the first failure:

```
Email input
  │
  ▼
 Syntax check ──────── fail → "Invalid email syntax"
  │
  ▼
 Domain extraction ─── fail → "Invalid email domain"
  │
  ▼
 Disposable check ──── fail → "Disposable email provider"
  │
  ▼
 Domain exists ─────── fail → "Domain does not exist"    (Node.js only)
  │
  ▼
 MX record check ───── fail → "Domain cannot receive email"  (Node.js only)
  │
  ▼
 Inbox scoring
  │
  ▼
 isValid = true
```

---

## Bulk Validation

```ts
import { checkEmail } from "@stackverify/email-check";

const emails = [
  "real.user@gmail.com",
  "throwaway@tempmail.com",
  " typo@broken-domain ",
  "nobody@doesnotexist12345.xyz",
];

for (const email of emails) {
  const result = await checkEmail(email);

  if (!result.isValid) {
    console.log(`SKIP  ${email} — ${result.reason}`);
  } else if (result.inbox.label === "low") {
    console.log(`WARN  ${email} — low inbox score`);
  } else {
    console.log(`OK    ${email} — score ${result.inbox.score}`);
  }
}
```

---

## Trusted Providers

The following email providers are classified as **high trust** (inbox score 95):

| Provider | Domain(s) |
|---|---|
| Gmail | `gmail.com`, `googlemail.com` |
| Microsoft | `outlook.com`, `hotmail.com` |
| Yahoo | `yahoo.com` |
| Apple | `icloud.com` |
| Proton | `proton.me`, `protonmail.com` |
| Zoho | `zoho.com` |
| StackVerify | `stackverify.site` |

All other valid domains receive a score of 70 ("medium").

---

## Node.js vs Browser

| Feature | Node.js | Browser |
|---|---|---|
| Syntax validation | ✅ | ✅ |
| Disposable detection | ✅ | ✅ |
| Domain existence (DNS) | ✅ | ❌ Skipped |
| MX record check | ✅ | ❌ Skipped |
| Inbox scoring | ✅ | ✅ |

The library auto-detects the runtime. DNS-based checks are only performed in Node.js — in the browser they are silently skipped, so `domainExists` and `hasMX` remain `false`.

---

## Use Cases

- **SaaS signup forms** — block disposable emails at registration.
- **Marketing platforms** — verify list quality before sending campaigns.
- **Fraud prevention** — flag suspicious or temporary email addresses.
- **Lead generation** — score and prioritize contacts by email quality.
- **Authentication flows** — validate emails during signup or password reset.

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

[MIT](./LICENSE) — free for personal, commercial, and SaaS use.

---

## Author

**Morgan Miller** · [StackVerify](https://stackverify.site)

Built and maintained by the [StackVerify](https://stackverify.site) team as part of our marketing and SaaS toolkit.
