/** Секция выработки между двумя узлами. */
export interface Section {
  readonly id: number
  readonly guid: string
  readonly startNodeId: number
  readonly endNodeId: number
  readonly excavationId: number
  readonly horizonId: number
  readonly thickness: number
}
