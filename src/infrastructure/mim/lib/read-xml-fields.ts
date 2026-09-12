import { MimLoadError } from '../model/mim-load-error'

const getChild = (parent: Element, name: string): Element | undefined => {
  const matches = Array.from(parent.children).filter(
    (child) => child.tagName === name
  )

  if (matches.length > 1) {
    throw new MimLoadError(
      'invalid-structure',
      `Элемент ${parent.tagName} содержит несколько полей ${name}.`
    )
  }

  return matches[0]
}

export const requireChild = (parent: Element, name: string): Element => {
  const child = getChild(parent, name)

  if (!child) {
    throw new MimLoadError(
      'invalid-structure',
      `В элементе ${parent.tagName} отсутствует поле ${name}.`
    )
  }

  return child
}

const readElementText = (element: Element, allowEmpty = false): string => {
  const text = element.textContent?.trim() ?? ''

  if (element.children.length > 0 || (!allowEmpty && text.length === 0)) {
    throw new MimLoadError(
      'invalid-value',
      `Поле ${element.parentElement?.tagName}.${element.tagName} должно содержать ${allowEmpty ? 'текст' : 'непустой текст'}.`
    )
  }

  return text
}

export const readText = (parent: Element, name: string): string =>
  readElementText(requireChild(parent, name))

const parseId = (text: string, field: string): number => {
  const value = Number(text)

  if (!/^\d+$/.test(text) || !Number.isSafeInteger(value)) {
    throw new MimLoadError(
      'invalid-value',
      `Поле ${field} содержит недопустимый идентификатор.`
    )
  }

  return value
}

export const readId = (parent: Element, name: string): number =>
  parseId(readText(parent, name), `${parent.tagName}.${name}`)

export const readNumber = (parent: Element, name: string): number => {
  const text = readText(parent, name)
  const value = Number(text)

  if (
    !/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(text) ||
    !Number.isFinite(value)
  ) {
    throw new MimLoadError(
      'invalid-value',
      `Поле ${parent.tagName}.${name} должно содержать конечное число с точкой в качестве десятичного разделителя.`
    )
  }

  return value
}

const readBooleanElement = (element: Element): boolean => {
  const text = readElementText(element)
  if (text === 'true' || text === '1') return true
  if (text === 'false' || text === '0') return false

  throw new MimLoadError(
    'invalid-value',
    `Поле ${element.parentElement?.tagName}.${element.tagName} должно содержать true, false, 1 или 0.`
  )
}

export const readBoolean = (parent: Element, name: string): boolean =>
  readBooleanElement(requireChild(parent, name))

export const readOptionalBoolean = (
  parent: Element,
  name: string
): boolean | undefined => {
  const element = getChild(parent, name)
  return element ? readBooleanElement(element) : undefined
}

export const readSectionIds = (parent: Element): readonly number[] => {
  const text = readElementText(requireChild(parent, 'Sections'), true)
  if (text.length === 0) return []

  return text
    .split(',')
    .map((id) => parseId(id.trim(), `${parent.tagName}.Sections`))
}
