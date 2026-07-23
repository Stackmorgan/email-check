import { isValidSyntax } from "./core/syntax.js";
import { isDisposable } from "./core/disposable.js";
import { inboxScore } from "./core/inbox-score.js";
import { extractDomain } from "./utils/extract-domain.js";
import type { EmailCheckResult } from "./core/results.js";

const isNode =
  typeof process !== "undefined" &&
  !!process.versions?.node;

export async function checkEmail(email: string): Promise<EmailCheckResult> {
  const result: EmailCheckResult = {
    isValid: false,
    syntax: false,
    disposable: false,
    domainExists: false,
    hasMX: false,
    inbox: { score: 0, label: "low" },
    reason: null
  };

  if (!isValidSyntax(email)) {
    result.reason = "Invalid email syntax";
    return result;
  }

  result.syntax = true;

  const domain = extractDomain(email);
  if (!domain) {
    result.reason = "Invalid email domain";
    return result;
  }

  result.disposable = isDisposable(domain);
  if (result.disposable) {
    result.reason = "Disposable email provider";
    return result;
  }

  if (isNode) {
    const { domainExists, hasMX } = await import("./server/mail.js");

    result.domainExists = await domainExists(domain);
    if (!result.domainExists) {
      result.reason = "Domain does not exist";
      return result;
    }

    result.hasMX = await hasMX(domain);
    if (!result.hasMX) {
      result.reason = "Domain cannot receive email";
      return result;
    }
  }

  result.inbox = inboxScore(domain);
  result.isValid = true;

  return result;
}
