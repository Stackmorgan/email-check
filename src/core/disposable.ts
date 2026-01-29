let disposableSet: Set<string> | null = null;

async function loadDisposableSet(): Promise<Set<string>> {
  if (disposableSet) return disposableSet;

  if (typeof process !== "undefined" && process.versions?.node) {
    const fs = await import("fs/promises");
    const path = await import("path");

    const filePath = path.resolve(
      __dirname,
      "../data/disposable-email.conf"
    );

    const data = await fs.readFile(filePath, "utf8");

    disposableSet = new Set(
      data
        .split("\n")
        .map(d => d.trim().toLowerCase())
        .filter(Boolean)
    );

    return disposableSet;
  }

  disposableSet = new Set();
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

export async function isDisposable(domain: string): Promise<boolean> {
  const set = await loadDisposableSet();
  return matchesDisposable(domain, set);
}
