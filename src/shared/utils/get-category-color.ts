const CATEGORY_COLORS = [
  '#2563eb',
  '#c2410c',
  '#059669',
  '#9333ea',
  '#0891b2',
  '#be185d',
  '#4d7c0f',
  '#7c3aed',
  '#b45309',
  '#0f766e',
  '#1d4ed8',
  '#a21caf',
  '#15803d',
  '#b91c1c',
  '#0369a1',
  '#854d0e',
  '#4338ca',
  '#a16207',
  '#047857',
  '#9d174d'
]

export const getCategoryColor = (id: number): string =>
  CATEGORY_COLORS[id % CATEGORY_COLORS.length]
