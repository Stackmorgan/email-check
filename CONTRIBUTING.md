# Contributing to @stackverify/email-check

Thank you for your interest in contributing! This guide will help you get started.

---

## Development Setup

```bash
# Clone the repository
git clone https://github.com/stackverify/email-check.git
cd email-check

# Install dependencies
npm install

# Build the project
npm run build

# Type-check without emitting
npx tsc --noEmit
```

---

## Project Structure

```
src/
  index.ts                  Main entry — exports checkEmail()
  core/
    syntax.ts               Email syntax validation regex
    disposable.ts           Disposable email domain detection
    inbox-score.ts          Inbox delivery likelihood scoring
    results.ts              EmailCheckResult type definition
  server/
    mail.ts                 DNS / MX record checks (Node.js only)
  utils/
    extract-domain.ts       Domain extraction from email string
  data/
    disposable-emails.ts    Database of 5,100+ disposable domains
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run build` | Build ESM and CJS outputs to `dist/` |
| `npm run build:esm` | Build ESM only |
| `npm run build:cjs` | Build CJS only |
| `npx tsc --noEmit` | Type-check without emitting files |

---

## Making Changes

### Code Style

- TypeScript with strict mode enabled.
- No external runtime dependencies.
- Named exports only.
- Include `.js` extensions in all relative imports (required for ESM compatibility).

### Adding to the Disposable Domain List

The disposable domain database lives in `src/data/disposable-emails.ts` as a newline-delimited string. To add domains:

1. Open `src/data/disposable-emails.ts`.
2. Append new domains to the string, one per line, in alphabetical order.
3. Ensure each domain is lowercased with no trailing whitespace.

```ts
export const disposableDomains: string = "...existing domains...\nanother-domain.com\nz-domain.net";
```

### Submitting a Pull Request

1. Fork the repository and create a feature branch from `main`.
2. Make your changes and ensure `npm run build` succeeds with no errors.
3. Run `npx tsc --noEmit` to confirm type safety.
4. Write a clear commit message describing what changed and why.
5. Open a pull request against `main`.

---

## Reporting Issues

Open an issue on GitHub with:

- A clear title and description.
- The email address that triggered the issue (if applicable).
- Your environment (Node.js version, browser, OS).
- Expected vs actual behavior.

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
