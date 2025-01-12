import { publicEncrypt, privateDecrypt } from "crypto";

interface EncryptedData {
  encryptedData: string;
}

/**
 * Encrypts a credit card number using RSA.
 * @param creditCardNumber - The credit card number to encrypt.
 * @returns An object containing the encrypted data.
 */
export const encryptCreditCard = (creditCardNumber: string): EncryptedData => {
  const serverPublicKey = process.env.NEXT_PUBLIC_RSA_KEY as string;
  if (!serverPublicKey) {
    throw new Error("Public key not found in environment variables");
  }

  const buffer = Buffer.from(creditCardNumber, "utf8");
  const encrypted = publicEncrypt(serverPublicKey, buffer);

  return {
    encryptedData: encrypted.toString("base64"),
  };
};

export const decryptCreditCard = (encryptedData: string): string => {
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

    // Return the decrypted string
    const decryptedText = decrypted.toString("utf8");

    return decryptedText;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Decryption failed");
  }
};

/**
 * Encrypts a timestamp using RSA.
 * @returns An object containing the encrypted timestamp.
 */
export const encryptTimestamp = (): EncryptedData => {
  const serverPublicKey = process.env.NEXT_PUBLIC_RSA_KEY as string;
  if (!serverPublicKey) {
    throw new Error("Public key not found in environment variables");
  }

  const timestamp = Date.now().toString();
  const buffer = Buffer.from(timestamp, "utf8");
  const encrypted = publicEncrypt(serverPublicKey, buffer);

  return {
    encryptedData: encrypted.toString("base64"),
  };
};

/**
 * Decrypts and validates an encrypted timestamp.
 * @param encryptedData - The encrypted timestamp to decrypt and validate.
 * @param maxAgeMs - Maximum age of the timestamp in milliseconds (default: 5 minutes).
 * @returns True if the timestamp is valid, false otherwise.
 */
export const decryptAndValidateTimestamp = (
  encryptedData: string,
  maxAgeMs: number = 5 * 60 * 1000
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

    const timestamp = parseInt(decrypted.toString("utf8"), 10);
    const now = Date.now();
    return now - timestamp <= maxAgeMs;
  } catch (error) {
    console.error("Timestamp validation failed:", error);
    return false;
  }
};
