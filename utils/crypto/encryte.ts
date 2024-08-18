import JSEncrypt from "jsencrypt";

export function encryptSymmetricKey(
  publicKey: string,
  symmetricKey: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    // 创建一个加密对象
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);

    // 加密对称密钥
    const encryptedSymmetricKey = encrypt.encrypt(symmetricKey);
    if (encryptedSymmetricKey) {
      resolve(encryptedSymmetricKey);
    } else {
      reject("Encryption failed");
    }
  });
}
