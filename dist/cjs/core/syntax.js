"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidSyntax = isValidSyntax;
function isValidSyntax(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}
