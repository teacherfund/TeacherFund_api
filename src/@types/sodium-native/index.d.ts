declare module 'sodium-native' {
  export function randombytes_buf (buf: Buffer)

  export const crypto_generichash_BYTES: number
  export function crypto_generichash (output: Buffer, input: Buffer, key?: Buffer)
}
