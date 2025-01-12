// crypto-browserify.d.ts

declare module "crypto-browserify" {
  import { ECDH, CipherGCM, BinaryLike } from "crypto";

  export function createECDH(curveName: string): ECDH;
  export function randomBytes(size: number): Buffer;
  export function createCipheriv(
    algorithm: string,
    key: BinaryLike,
    iv: BinaryLike
  ): CipherGCM;
}
