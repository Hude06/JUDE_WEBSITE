export const CONTENT_CONTRACT_VERSION = 1 as const;

export type ContentContractVersion = typeof CONTENT_CONTRACT_VERSION;

export function withContractVersion<T>(input: T): T & { contractVersion: ContentContractVersion } {
  if (typeof input !== 'object' || input === null) {
    return { contractVersion: CONTENT_CONTRACT_VERSION } as T & { contractVersion: ContentContractVersion };
  }

  const value = input as Record<string, unknown>;
  if (value.contractVersion === undefined) {
    return {
      ...value,
      contractVersion: CONTENT_CONTRACT_VERSION,
    } as T & { contractVersion: ContentContractVersion };
  }

  return input as T & { contractVersion: ContentContractVersion };
}
