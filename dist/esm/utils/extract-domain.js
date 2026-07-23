export function extractDomain(email) {
    const parts = email.split("@");
    return parts.length === 2 ? parts[1].toLowerCase() : null;
}
