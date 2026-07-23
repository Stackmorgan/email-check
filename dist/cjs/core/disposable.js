"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDisposable = isDisposable;
const disposable_emails_js_1 = require("../data/disposable-emails.js");
let disposableSet = null;
function getDisposableSet() {
    if (disposableSet)
        return disposableSet;
    disposableSet = new Set(disposable_emails_js_1.disposableDomains.split("\n"));
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
function isDisposable(domain) {
    return matchesDisposable(domain, getDisposableSet());
}
