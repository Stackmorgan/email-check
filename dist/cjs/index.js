"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmail = checkEmail;
const syntax_js_1 = require("./core/syntax.js");
const disposable_js_1 = require("./core/disposable.js");
const inbox_score_js_1 = require("./core/inbox-score.js");
const extract_domain_js_1 = require("./utils/extract-domain.js");
const isNode = typeof process !== "undefined" &&
    !!process.versions?.node;
async function checkEmail(email) {
    const result = {
        isValid: false,
        syntax: false,
        disposable: false,
        domainExists: false,
        hasMX: false,
        inbox: { score: 0, label: "low" },
        reason: null
    };
    if (!(0, syntax_js_1.isValidSyntax)(email)) {
        result.reason = "Invalid email syntax";
        return result;
    }
    result.syntax = true;
    const domain = (0, extract_domain_js_1.extractDomain)(email);
    if (!domain) {
        result.reason = "Invalid email domain";
        return result;
    }
    result.disposable = (0, disposable_js_1.isDisposable)(domain);
    if (result.disposable) {
        result.reason = "Disposable email provider";
        return result;
    }
    if (isNode) {
        const { domainExists, hasMX } = await Promise.resolve().then(() => __importStar(require("./server/mail.js")));
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
    result.inbox = (0, inbox_score_js_1.inboxScore)(domain);
    result.isValid = true;
    return result;
}
