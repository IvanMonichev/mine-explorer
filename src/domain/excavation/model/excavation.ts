/** Горная выработка. */
export interface Excavation {
  readonly id: number
  readonly guid: string
  readonly name: string
  /** External identifiers may exceed Number.MAX_SAFE_INTEGER. */
  readonly objectId: string
  readonly type: string
  readonly horizonId: number
  readonly sectionIds: readonly number[]
}
