import type { Excavation } from '@/domain/excavation'
import type { Horizon } from '@/domain/horizon'
import type { MineNode } from '@/domain/node'
import type { Section } from '@/domain/section'

/**
 * Шахта — статическая топология схемы.
 * Ключи индексов и связи соответствуют идентификаторам сущностей.
 */
export interface Mine {
  readonly name: string
  readonly nodes: ReadonlyMap<number, MineNode>
  readonly sections: ReadonlyMap<number, Section>
  readonly excavations: ReadonlyMap<number, Excavation>
  readonly horizons: ReadonlyMap<number, Horizon>
}
