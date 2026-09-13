import type { CanvasProps, ThreeElements } from '@react-three/fiber'

export const MINE_SCENE_CANVAS_SETTINGS = {
  camera: { position: [1, 0.7, 1], fov: 45 },
  dpr: [1, 2],
  frameloop: 'demand',
  gl: { antialias: true }
} satisfies CanvasProps

export const MINE_SCENE_BACKGROUND_COLOR = '#f8fafc'

export const AMBIENT_LIGHT_INTENSITY = 0.8

export const DIRECTIONAL_LIGHT_SETTINGS = {
  intensity: 1.5,
  position: [1, 2, 3]
} satisfies ThreeElements['directionalLight']

export const SECTION_RADIAL_SEGMENTS = 8
