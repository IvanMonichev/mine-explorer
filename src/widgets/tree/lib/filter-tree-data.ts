import type { MineTreeNode } from '../model/mine-tree-node'

export const filterTreeData = (
  treeData: MineTreeNode[],
  search: string
): MineTreeNode[] => {
  const query = search.trim().toLowerCase()
  if (!query) return treeData

  return treeData.flatMap((horizon) => {
    if (horizon.title.toLowerCase().includes(query)) return [horizon]

    const children = horizon.children?.filter((excavation) =>
      excavation.title.toLowerCase().includes(query)
    )

    return children?.length ? [{ ...horizon, children }] : []
  })
}
