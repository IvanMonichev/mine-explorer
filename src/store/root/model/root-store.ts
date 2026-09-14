import { MineStore } from '@/store/mine'
import { ViewerStore } from '@/store/viewer'

export class RootStore {
  readonly mineStore = new MineStore()
  readonly viewerStore = new ViewerStore()
}
