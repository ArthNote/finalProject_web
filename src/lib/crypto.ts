import CryptoJS from "crypto-js";

import forge from "node-forge";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY!;

const decodedPublicKey = forge.util.decode64(PUBLIC_KEY);
const publicKey = forge.pki.publicKeyFromPem(decodedPublicKey);

export const encryptData = (data: any) => {
  const encrypted = publicKey.encrypt(JSON.stringify(data), "RSA-OAEP");
  return forge.util.encode64(encrypted);
};
