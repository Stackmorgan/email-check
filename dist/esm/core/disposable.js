import { disposableDomains } from "../data/disposable-emails.js";
let disposableSet = null;
function getDisposableSet() {
    if (disposableSet)
        return disposableSet;
    disposableSet = new Set(disposableDomains.split("\n"));
    return disposableSet;
}
function matchesDisposable(domain, set) {
    const parts = domain.split(".");
    while (parts.length > 1) {
        if (set.has(parts.join(".")))
            return true;
        parts.shift();
    }
    return false;
}
export function isDisposable(domain) {
    return matchesDisposable(domain, getDisposableSet());
}
