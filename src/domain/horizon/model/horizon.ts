export interface Horizon {
  readonly id: number
  readonly guid: string
  readonly name: string
  /** External identifiers may exceed Number.MAX_SAFE_INTEGER. */
  readonly objectId: string
  readonly altitude: number
  readonly isMine: boolean
  readonly excavationIds: readonly number[]
  readonly sectionIds: readonly number[]
}
