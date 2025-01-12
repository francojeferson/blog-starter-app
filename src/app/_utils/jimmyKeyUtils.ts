import { publicEncrypt, privateDecrypt } from "crypto";

interface EncryptedData {
  encryptedData: string;
}

/**
 * Creates a Jimmy Key by encrypting a UTC timestamp from 5 days ago.
 * @returns An object containing the encrypted Jimmy Key.
 */
export const createJimmyKey = (): EncryptedData => {
  const serverPublicKey = process.env.NEXT_PUBLIC_RSA_KEY as string;
  if (!serverPublicKey) {
    throw new Error("Public key not found in environment variables");
  }

  const fiveDaysAgo = Date.now() - 5 * 24 * 60 * 60 * 1000;
  const timestamp = new Date(fiveDaysAgo).toUTCString();
  const buffer = Buffer.from(timestamp, "utf8");
  const encrypted = publicEncrypt(serverPublicKey, buffer);

  return {
    encryptedData: encrypted.toString("base64"),
  };
};

/**
 * Checks the validity of a Jimmy Key using UTC time.
 * @param encryptedData - The encrypted Jimmy Key to decrypt and validate.
 * @param maxAgeMs - Maximum age difference allowed in milliseconds (default: 60 seconds).
 * @returns True if the Jimmy Key is valid, false otherwise.
 */
export const checkJimmyKey = (
  encryptedData: string,
  maxAgeMs: number = 10 * 60 * 1000 // 10 min
): boolean => {
  const serverPrivateKey = process.env.RSA_PRIVATE_KEY as string;
  if (!serverPrivateKey) {
    throw new Error("Private key not found in environment variables");
  }

  try {
    // Ensure the private key is properly formatted
    const formattedPrivateKey = serverPrivateKey.replace(/\\n/g, "\n");

    // Convert the encrypted data from base64 to a buffer
    const buffer = Buffer.from(encryptedData, "base64");

    // Perform decryption using the private key
    const decrypted = privateDecrypt(
      {
        key: formattedPrivateKey,
      },
      buffer
    );

    const decryptedTimestamp = new Date(decrypted.toString("utf8")).getTime();
    const now = Date.now();
    const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
    const timeDifference = Math.abs(now - fiveDaysInMs - decryptedTimestamp);
    if (timeDifference > maxAgeMs) {
      console.log("Jimmy Key Failed - Difference: ", timeDifference);
    }
    return timeDifference <= maxAgeMs;
  } catch (error) {
    console.error("Jimmy Key validation failed:", error);
    return false;
  }
};
