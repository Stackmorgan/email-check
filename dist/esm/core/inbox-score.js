const trustedProviders = new Set([
    "gmail.com",
    "googlemail.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
    "icloud.com",
    "proton.me",
    "protonmail.com",
    "zoho.com",
    "stackverify.site"
]);
export function inboxScore(domain) {
    if (trustedProviders.has(domain)) {
        return { score: 95, label: "high" };
    }
    return { score: 70, label: "medium" };
}
