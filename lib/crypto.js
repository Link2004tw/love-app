import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 16;

export function generateKey() {
  return crypto.randomBytes(KEY_LENGTH).toString("base64");
}

export function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, "sha256").toString("base64");
}

export function encrypt(plaintext, key) {
  const keyBuffer = Buffer.from(key, "base64");
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);

  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
    data: encrypted,
  };
}

export function decrypt(encryptedData, key) {
  const keyBuffer = Buffer.from(key, "base64");
  const iv = Buffer.from(encryptedData.iv, "base64");
  const authTag = Buffer.from(encryptedData.authTag, "base64");
  const dataBuffer = Buffer.from(encryptedData.data, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(dataBuffer, undefined, "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export function encryptObject(obj, key) {
  const jsonString = JSON.stringify(obj);
  return encrypt(jsonString, key);
}

export function decryptObject(encryptedObj, key) {
  const jsonString = decrypt(encryptedObj, key);
  return JSON.parse(jsonString);
}