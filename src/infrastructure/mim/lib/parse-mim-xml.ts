import type {
  MimExcavationDto,
  MimHorizonDto,
  MimNodeDto,
  MimSchemeDto,
  MimSectionDto
} from '../model/mim-dto'
import { MimLoadError } from '../model/mim-load-error'

import {
  readBoolean,
  readId,
  readNumber,
  readOptionalBoolean,
  readSectionIds,
  readText,
  requireChild
} from './read-xml-fields'

const readNode = (element: Element): MimNodeDto => ({
  id: readId(element, 'Id'),
  guid: readText(element, 'Guid'),
  x: readNumber(element, 'X'),
  y: readNumber(element, 'Y'),
  z: readNumber(element, 'Z')
})

const readSection = (element: Element): MimSectionDto => {
  const thickness = readNumber(element, 'Thickness')

  if (thickness <= 0) {
    throw new MimLoadError(
      'invalid-value',
      `Толщина секции ${readId(element, 'Id')} должна быть больше нуля.`
    )
  }

  return {
    id: readId(element, 'Id'),
    guid: readText(element, 'Guid'),
    startNodeId: readId(element, 'StartNodeId'),
    endNodeId: readId(element, 'EndNodeId'),
    thickness
  }
}

const readExcavation = (element: Element): MimExcavationDto => ({
  id: readId(element, 'Id'),
  guid: readText(element, 'Guid'),
  name: readText(element, 'Name'),
  objectId: readText(element, 'ObjectId'),
  excavationType: readText(element, 'ExcavationType'),
  sectionIds: readSectionIds(element)
})

const readHorizon = (element: Element): MimHorizonDto => ({
  id: readId(element, 'Id'),
  guid: readText(element, 'Guid'),
  name: readText(element, 'Name'),
  objectId: readText(element, 'ObjectId'),
  altitude: readNumber(element, 'Altitude'),
  isMine: readBoolean(element, 'IsMine'),
  active: readOptionalBoolean(element, 'Active'),
  visible: readOptionalBoolean(element, 'Visible'),
  sectionIds: readSectionIds(element)
})

const readCollection = <T>(
  root: Element,
  collectionName: string,
  entryName: string,
  readEntry: (element: Element) => T
): readonly T[] =>
  Array.from(requireChild(root, collectionName).children).map((element) => {
    if (element.tagName !== entryName) {
      throw new MimLoadError(
        'invalid-structure',
        `В коллекции ${collectionName} ожидался элемент ${entryName}, получен ${element.tagName}.`
      )
    }

    return readEntry(element)
  })

/** Parses field values. Relationships are validated when mapping the DTO. */
export const parseMimXml = (xml: string): MimSchemeDto => {
  if (xml.trim().length === 0) {
    throw new MimLoadError('empty-file', 'Файл схемы пуст.')
  }

  const document = new DOMParser().parseFromString(xml, 'application/xml')

  if (document.getElementsByTagName('parsererror').length > 0) {
    throw new MimLoadError('invalid-xml', 'Файл содержит некорректный XML.')
  }

  const root = document.documentElement

  if (root.tagName !== 'Graph' || document.doctype) {
    throw new MimLoadError(
      'invalid-structure',
      'Ожидалась схема MIM с корневым элементом Graph без объявления DOCTYPE.'
    )
  }

  return {
    nodes: readCollection(root, 'Nodes', 'Node', readNode),
    sections: readCollection(root, 'Sections', 'Section', readSection),
    excavations: readCollection(
      root,
      'Excavations',
      'Excavation',
      readExcavation
    ),
    horizons: readCollection(root, 'Horizons', 'Horizon', readHorizon)
  }
}
