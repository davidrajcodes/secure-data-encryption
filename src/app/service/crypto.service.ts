import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
// import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  publicKey: string = '';
  privateKey: string = '';

  // private publicKey = environment.portal.auth.key;
  // private privateKey = environment.portal.auth.privateKey;

  generateSecurityKey(): string {
    return CryptoJS.lib.WordArray.random(16).toString(); // 128-bit
  }

  // RSA
  rsaEncrypt(data: string): string {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(this.publicKey);
    return encrypt.encrypt(data) as string;
  }

  rsaDecrypt(data: string): string {
    const decrypt = new JSEncrypt();
    decrypt.setPrivateKey(this.privateKey);
    return decrypt.decrypt(data) as string;
  }

  // AES
  aesEncrypt(data: string, key: string): string {
    const secretKey = CryptoJS.enc.Utf8.parse(key);
    return CryptoJS.AES.encrypt(data, secretKey, {
      keySize: 128 / 8,
      iv: secretKey,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
  }

  aesDecrypt(encryptedData: string, key: string): string {
    const secretKey = CryptoJS.enc.Utf8.parse(key);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, secretKey, {
      iv: secretKey,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
