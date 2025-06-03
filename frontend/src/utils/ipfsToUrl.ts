// src/utils/ipfs.ts

/**
 * Chuyển IPFS URI (ipfs://...) thành HTTP URL qua gateway
 * Ví dụ: ipfs://Qm.../file.json → https://ipfs.io/ipfs/Qm.../file.json
 */
export function ipfsToHttps(uri: string): string {
  if (uri.startsWith("ipfs://")) {
    return uri.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/");
  }
  return uri;
}
