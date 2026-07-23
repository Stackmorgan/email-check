export interface EmailCheckResult {
    isValid: boolean;
    syntax: boolean;
    disposable: boolean;
    domainExists: boolean;
    hasMX: boolean;
    inbox: {
        score: number;
        label: "low" | "medium" | "high";
    };
    reason: string | null;
}
