import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CryptoService } from './service/crypto.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import JSEncrypt from 'jsencrypt';
import { JsonPipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule,
    FormsModule, NgxJsonViewerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('decryption');
  requestType: boolean = false;

  // Request
  private portalPublicKey = `-----BEGIN PUBLIC KEY-----
      MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA1pZuBO54t2w5tpqbzD5IM09+JITCjwxJv3neF
      2Gy4ulAno5AihElGGoyfRbseyksDAyTCR7OWhO14hu/ldUdmcZSG+yxFZWh5TxTUZKhe2HBEd9A99yOJfW
      veNFAjuQg0S+4MAOwz+dcngat4DwMJH9WC9k/vzXqUPHNYgDjl3k6vWpO1s8Yb1Vy61u+Nx5azE51/uubs
      xVRASD3Y/Mcune8Aqkk0pSYcKjbRMJih3BR+5tUM3nYcFaxWHBKR5NpSMqJZ6E/ZDcif5U+cBYbPZd1RwJ
      Q+YXzgPaqB0nQgQksTttUfPhaI1yD5dro3hJPPdgypiXQjI2zlWM6iG0WQnAD0X7X19tXth9UnngjVzBO2
      SBDYg5iaCcxoDI76lUl4i4EH5jjdkdFxz5Kk1n8etwvgkXy9QjYJ0DvjTVKl2+zG1AjS4TDkbmeH6O8Q0m
      tEG8ZKoveAutdlbNusZtZUUi29dEZi5DEpBL/3T6YNyeEz0yQhABsY1E2rL6gskDl5E+8yJRm1hX1RW6ML
      L5bP9+B+icBdba7rX7f56UeDzcpeai6bZ2wbuVdWA2GDl8Gj21IVXhVwlYafOgMGyGpJXPwnyKzz60rYzd
      fBFJhizu2ddGhrJqagtWaPdGlPQGpDmAg5jxgPe3OPpeO5h3qMEMyRxOEKjNgvMeJv1Mm92sCAwEAAQ==
      -----END PUBLIC KEY-----`;

  private portalPrivate = `  -----BEGIN RSA PRIVATE KEY-----
      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
            -----END RSA PRIVATE KEY-----`

  // Response 
  privateKey = `-----BEGIN RSA PRIVATE KEY-----
      MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBALSAl6EmuO2z0wJSVG2zAASQb35uZdgZExaIvb/SoPEbmx+
      o7cjB3k7X5JOY4jaCoGXHDmHCu/iUteaJhfdEYyaDuul84r2/czLO2UHKEtgjWmwZYRc3oYJ9L49N5YeyKFFupdDkBGJ7C6
      DsihJ4XvLQ2SVY1Rj2HSddBsD1VoOvAgMBAAECgYABLpQYvzC8huBZIdRPIUxdBG4/nR8qLM2Sn6F1T4fGQ0LfEHywZ9knrC
      fzllQgT0BhDs5Xlq5H2dqUyZd2aMFfuqc9eEBELmmFpqIXaNRwX5ieCdwD2YMLsqNP63Q9HXKWiery48FuLMAcC6Z9/3KHi1
      rORGvAvPcoksbwUS/AwQJBAOZf9oDk4hUOZQ7NrlJyYBUg2PKJDsrum3nAjWWbXwMiEQYpbWJz+FCKaPDtHsTP73dUKhvadv
      /XJwHC82J0zgkCQQDIlHv69LzAjrG0m+mr3yeWU4dyqFAe9KbyTGqchSHh/hQiDyqrpGXMFQay2wgFDhSiFpd7LWn4YWBaMU
      EOlDH3AkBsu1ZJN75NWeHwvrtMRpd64WoD7xSAS2YubOdP0alifS2zztHF6h6FRQ6KyCABnHLVy2+kfdQ0pIPQnQbqrV6hAk
      Bq5wCBC0lCU4sQ2Hwc902RCCnLiTtSlFAaGXJEw4wAd7thP7YdTvxWXep5DtXiY9PJY8MOinDNSZDh4RhsXb2XAkB7QCyij2
      o1/WDOrUfraxike+s8I3Q9+KcFo4asYgy2z+1duu3ScnjtExji6vpIbyTefqeIVMrKktt4cfyjoJyD
      -----END RSA PRIVATE KEY-----`


  public encryptedData: string = '';
  public xEncoding: string = '';
  public decryptedJson: any;

  // Paste your private key here (for testing only!)

  decrypt() {
    if (!this.encryptedData || !this.xEncoding) {
      alert('Provide both Encrypted Data and X-Encoding header');
      return;
    }

    // 1️⃣ Decrypt AES key with RSA
    const jsDecrypt = new JSEncrypt();
    jsDecrypt.setPrivateKey(this.requestType ? this.privateKey : this.portalPrivate);
    const aesKey = jsDecrypt.decrypt(this.xEncoding);
    console.log(aesKey);

    if (!aesKey) {
      alert('Failed to decrypt AES key');
      return;
    }

    let decryptedBase64 = this.requestType ? this.encryptedData : atob(this.encryptedData);

    // 2️⃣ Decrypt data using AES
    let decryptedData = this.decryptAES(decryptedBase64, aesKey);

    try {
      this.decryptedJson = JSON.parse(decryptedData);
    } catch (e) {
      // If parsing fails, just use the raw string
      this.decryptedJson = decryptedData;
      console.error(e);
    }

  }

  decryptAES(encryptedData: string, secretKey: string): any {
    const key = CryptoJS.enc.Utf8.parse(secretKey);
    const iv = CryptoJS.enc.Utf8.parse(secretKey); // IV = key (matches your backend)

    const decryptedWordArray = CryptoJS.AES.decrypt(
      encryptedData, // Base64 string
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    const decryptedText = decryptedWordArray.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  }
}
