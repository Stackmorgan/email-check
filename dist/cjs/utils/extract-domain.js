"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDomain = extractDomain;
function extractDomain(email) {
    const parts = email.split("@");
    return parts.length === 2 ? parts[1].toLowerCase() : null;
}
