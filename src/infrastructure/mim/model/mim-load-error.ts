export type MimLoadErrorCode =
  | 'read-failed'
  | 'empty-file'
  | 'decode-failed'
  | 'invalid-xml'
  | 'invalid-structure'
  | 'invalid-value'
  | 'duplicate-id'
  | 'missing-reference'
  | 'invalid-relationship'

export class MimLoadError extends Error {
  readonly code: MimLoadErrorCode

  constructor(code: MimLoadErrorCode, message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'MimLoadError'
    this.code = code
  }
}
