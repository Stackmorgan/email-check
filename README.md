# @stackverify/email-check

High-performance email validation library to detect disposable emails, verify mail capability, and estimate inbox delivery likelihood.  

Maintained by **Morgan Miller / StackVerify**. Works in Node.js, TypeScript, ESM, and JavaScript environments.

---

## Features

- Syntax validation – ensures email is properly formatted
- Disposable email detection – identifies temporary or throwaway emails
- Domain & MX check – ensures the domain can receive emails (Node.js only)
- Inbox likelihood scoring – estimates likelihood of reaching inbox
- Fast lookups – supports large disposable domain lists efficiently
- Browser + Node safe – auto-detects environment

---

## Installation

```bash
npm install @stackverify/email-check
```
# or
```
yarn add @stackverify/email-check
```
Usage
ESM / TypeScript
Copy code
Ts
```
import { checkEmail } from "@stackverify/email-check";

async function validateEmail(email: string) {
  const result = await checkEmail(email);

  if (!result.isValid) {
    console.log(`Email is invalid: ${result.reason}`);
    // Handle invalid email:
    // - Show error to user
    // - Ask for a different email
    // - Log or reject in backend
    return;
  }

  if (result.disposable) {
    console.log("Email is disposable. Request a permanent email.");
    return;
  }

  if (result.inbox.score < 80) {
    console.log("Email may not reach inbox reliably.");
    // Optional: warn user or request alternate email
  }

  console.log("Email is valid and likely to reach inbox.");
}

validateEmail("user@gmail.com");
```
CommonJS (Node.js)
Copy code
Js
```
const { checkEmail } = require("@stackverify/email-check");

checkEmail("user@gmail.com").then(result => {
  if (!result.isValid) {
    console.log(`Invalid email: ${result.reason}`);
    return;
  }

  if (result.disposable) {
    console.log("Disposable email detected.");
    return;
  }

  if (result.inbox.score < 80) {
    console.log("Email might not reach inbox.");
  }

  console.log("Email is valid and likely to reach inbox.");
});
```
## Result Object
Property
- Type
- Description
- isValid
- boolean
- True if email passes all checks
syntax
- boolean
- True if email syntax is valid
disposable
- boolean
- True if email is disposable
domainExists
- boolean
- True if domain exists (Node.js only)
hasMX
- boolean
- True if domain has MX records (Node.js only)
inbox
- object
- `{ score: 0-100, label: 'low'
reason
- string|null
- Reason if invalid
## How to handle invalid emails
- Invalid syntax: Ask user to correct the email format.
- Disposable email: Reject or ask for a permanent email.
- Non-existent domain / no MX records: Warn the user, may indicate typo or inactive email.
- Low inbox score: Optional warning, consider requesting an alternate email for important communications.
Node vs Browser
- Node.js: Full checks (syntax, disposable, domain existence, MX records, inbox likelihood)
- Browser: Only syntax + disposable checks (safe, fast, no DNS required)
Advanced Options
- Replace the default disposable-email.conf with a custom domain list
- Detect disposable subdomains automatically
Use synchronous check in Node.js for ultra-fast repeated lookups
Example: Bulk validation
Copy code
Ts
```
import { checkEmail } from "@stackverify/email-check";

const emails = ["test@gmail.com", "temp@0815.ru", "user@nonexistentdomain.xyz"];

for (const email of emails) {
  const result = await checkEmail(email);
  if (!result.isValid || result.disposable || result.inbox.score < 80) {
    console.log(`${email} is invalid or risky: ${result.reason || 'low inbox score'}`);
    continue;
  }

  console.log(`${email} is valid and likely to reach inbox.`);
}
```
## StackVerify Branding
Maintained by StackVerify, part of our marketing and SaaS toolkit.
Website: https://stackverify.site
License
MIT – free to use for personal, commercial, and SaaS projects.
