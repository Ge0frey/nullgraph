/** Encode a UTF-8 string into a zero-padded byte array of fixed length. */
export function encodeString(s: string, len: number): number[] {
  const buf = Buffer.alloc(len);
  buf.write(s, "utf-8");
  return Array.from(buf);
}

/** Decode a zero-padded byte array back to a UTF-8 string. */
export function decodeString(bytes: number[] | Uint8Array): string {
  const buf = Buffer.from(bytes);
  // Find first null byte
  const nullIdx = buf.indexOf(0);
  return buf.subarray(0, nullIdx === -1 ? buf.length : nullIdx).toString("utf-8");
}

/** Format a specimen number as NKA-XXXX. */
export function formatSpecimenNumber(n: number): string {
  return `NKA-${String(n).padStart(4, "0")}`;
}

/** Format a bounty number as NB-XXXX. */
export function formatBountyNumber(n: number): string {
  return `NB-${String(n).padStart(4, "0")}`;
}

/** Format USDC amount (6 decimals) to human-readable. */
export function formatUSDC(lamports: number): string {
  return (lamports / 1_000_000).toFixed(2);
}

/** Shorten a Solana address for display. */
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/** Format a Unix timestamp to locale date string. */
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format p-value from fixed-point (8700 → "0.8700"). */
export function formatPValue(pValue: number): string {
  return (pValue / 10000).toFixed(4);
}

/** Get status label for NKA. */
export function getNkaStatusLabel(status: number): string {
  switch (status) {
    case 0: return "Pending";
    case 1: return "Verified";
    case 2: return "Disputed";
    default: return "Unknown";
  }
}

/** Get status label for bounty. */
export function getBountyStatusLabel(status: number): string {
  switch (status) {
    case 0: return "Open";
    case 1: return "Matched";
    case 2: return "Fulfilled";
    case 3: return "Closed";
    default: return "Unknown";
  }
}

/** SHA-256 hash of a file (returns hex string). */
export async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Convert hex string to byte array. */
export function hexToBytes(hex: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return bytes;
}
