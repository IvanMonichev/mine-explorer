export interface MimNodeDto {
  readonly id: number
  readonly guid: string
  readonly x: number
  readonly y: number
  readonly z: number
}

export interface MimSectionDto {
  readonly id: number
  readonly guid: string
  readonly startNodeId: number
  readonly endNodeId: number
  readonly thickness: number
}

export interface MimExcavationDto {
  readonly id: number
  readonly guid: string
  readonly name: string
  readonly objectId: string
  readonly excavationType: string
  readonly sectionIds: readonly number[]
}

export interface MimHorizonDto {
  readonly id: number
  readonly guid: string
  readonly name: string
  readonly objectId: string
  readonly altitude: number
  readonly isMine: boolean
  readonly active?: boolean
  readonly visible?: boolean
  readonly sectionIds: readonly number[]
}

export interface MimSchemeDto {
  readonly nodes: readonly MimNodeDto[]
  readonly sections: readonly MimSectionDto[]
  readonly excavations: readonly MimExcavationDto[]
  readonly horizons: readonly MimHorizonDto[]
}
