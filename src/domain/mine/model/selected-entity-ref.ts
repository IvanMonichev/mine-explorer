/** Ссылка на выбранный объект шахты. */
export type SelectedEntityRef =
  | { readonly type: 'horizon'; readonly id: number }
  | { readonly type: 'excavation'; readonly id: number }
  | { readonly type: 'section'; readonly id: number }
  | { readonly type: 'node'; readonly id: number }
