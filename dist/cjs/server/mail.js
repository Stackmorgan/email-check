"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.domainExists = domainExists;
exports.hasMX = hasMX;
const promises_1 = __importDefault(require("dns/promises"));
async function domainExists(domain) {
    try {
        await promises_1.default.resolve(domain);
        return true;
    }
    catch {
        return false;
    }
}
async function hasMX(domain) {
    try {
        const records = await promises_1.default.resolveMx(domain);
        return records.length > 0;
    }
    catch {
        return false;
    }
}
