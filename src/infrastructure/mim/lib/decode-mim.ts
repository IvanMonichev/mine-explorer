import { MimLoadError } from '../model/mim-load-error'

export const decodeMim = (buffer: ArrayBuffer): string => {
  if (buffer.byteLength === 0) {
    throw new MimLoadError('empty-file', 'Файл схемы пуст.')
  }

  try {
    return new TextDecoder('windows-1251', { fatal: true }).decode(buffer)
  } catch (cause) {
    throw new MimLoadError(
      'decode-failed',
      'Не удалось прочитать текст схемы в кодировке Windows-1251.',
      { cause }
    )
  }
}
