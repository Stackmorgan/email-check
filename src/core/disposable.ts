import { disposableDomains } from "../data/disposable-emails.js";

let disposableSet: Set<string> | null = null;

function getDisposableSet(): Set<string> {
  if (disposableSet) return disposableSet;
  disposableSet = new Set(disposableDomains.split("\n"));
  return disposableSet;
}

function matchesDisposable(domain: string, set: Set<string>): boolean {
  const parts = domain.split(".");
  while (parts.length > 1) {
    if (set.has(parts.join("."))) return true;
    parts.shift();
  }
  return false;
}

export function isDisposable(domain: string): boolean {
  return matchesDisposable(domain, getDisposableSet());
}
