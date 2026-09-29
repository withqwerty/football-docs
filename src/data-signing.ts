/**
 * Signatures on data-latest manifests.
 *
 * The publish job in .github/workflows/data.yml signs each manifest with an
 * ed25519 key held only in the data-publish environment, which only workflows
 * running on main can use. Servers accept a manifest only if a key listed here
 * verifies it. Replacing release assets by hand, or from a workflow on another
 * branch, therefore cannot put an index on users' machines: without the key it
 * cannot produce a manifest they accept, and the manifest carries the index's
 * size and SHA-256.
 *
 * To rotate: generate a new key pair, add its public key here, release, then
 * replace the DATA_SIGNING_KEY secret and DATA_SIGNING_PUBLIC_KEY in data.yml.
 * Remove the old key in a later release.
 */

import { createHash, createPublicKey, verify } from "node:crypto";
import { z } from "zod";

export interface TrustedKey {
  /** First 16 hex characters of the SHA-256 of the raw public key. */
  id: string;
  /** The raw 32-byte ed25519 public key, base64. */
  publicKey: string;
}

export const TRUSTED_KEYS: readonly TrustedKey[] = [
  { id: "e5a0dcbb72a87e45", publicKey: "1FjljvdILY3mrvrUeK4FqO8KbyYL4iDbTO0nIoNJuO8=" },
];

/** DER prefix that wraps a raw ed25519 public key as SubjectPublicKeyInfo. */
const ED25519_SPKI_PREFIX = Buffer.from("302a300506032b6570032100", "hex");

export function keyIdFor(publicKey: string): string {
  return createHash("sha256").update(Buffer.from(publicKey, "base64")).digest("hex").slice(0, 16);
}

const envelopeSchema = z.object({
  /** The manifest JSON, exactly as signed. */
  payload: z.string(),
  /** Base64 ed25519 signature over the payload's UTF-8 bytes. */
  signature: z.string(),
  key_id: z.string(),
});

export class SignatureError extends Error {}

/**
 * Check a signed manifest and return the manifest JSON it carries. The payload
 * is verified as the exact string that was signed, before anything parses it.
 */
export function verifySignedManifest(envelope: unknown, keys: readonly TrustedKey[] = TRUSTED_KEYS): string {
  const parsed = envelopeSchema.safeParse(envelope);
  if (!parsed.success) throw new SignatureError("signed manifest is malformed");

  const key = keys.find((candidate) => candidate.id === parsed.data.key_id);
  if (!key) throw new SignatureError(`manifest is signed with unknown key ${parsed.data.key_id}`);

  const publicKey = createPublicKey({
    key: Buffer.concat([ED25519_SPKI_PREFIX, Buffer.from(key.publicKey, "base64")]),
    format: "der",
    type: "spki",
  });
  const valid = verify(
    null,
    Buffer.from(parsed.data.payload, "utf-8"),
    publicKey,
    Buffer.from(parsed.data.signature, "base64"),
  );
  if (!valid) throw new SignatureError("manifest signature does not verify");
  return parsed.data.payload;
}
