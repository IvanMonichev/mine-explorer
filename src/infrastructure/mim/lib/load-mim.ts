import type { Mine } from '@/domain/mine'

import { MimLoadError } from '../model/mim-load-error'

import { decodeMim } from './decode-mim'
import { mapMimToDomain } from './map-mim-to-domain'
import { parseMimXml } from './parse-mim-xml'

export const loadMim = async (file: File): Promise<Mine> => {
  let buffer: ArrayBuffer

  try {
    buffer = await file.arrayBuffer()
  } catch (cause) {
    throw new MimLoadError(
      'read-failed',
      `Не удалось прочитать файл «${file.name}».`,
      { cause }
    )
  }

  const xml = decodeMim(buffer)
  const dto = parseMimXml(xml)
  const mine = mapMimToDomain(dto, file.name)

  return mine
}
