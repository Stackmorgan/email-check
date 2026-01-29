import dns from "dns/promises";

export async function domainExists(domain: string): Promise<boolean> {
  try {
    await dns.resolve(domain);
    return true;
  } catch {
    return false;
  }
}

export async function hasMX(domain: string): Promise<boolean> {
  try {
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}
