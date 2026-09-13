import type { ComponentRef } from 'react'
import { useCallback, useEffect, useRef } from 'react'

import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { observer } from 'mobx-react-lite'
import { MathUtils, PerspectiveCamera, Spherical, Vector3 } from 'three'

import type { Mine } from '@/domain/mine'
import type { ViewerStore } from '@/store/viewer'

import { getFocusBounds } from '../lib/build-scene-data'
import { CAMERA_POSITION_UPDATE_INTERVAL_MS } from '../model/constants'
import type { MineSceneData } from '../model/types'

interface MineCameraProps {
  mine: Mine
  data: MineSceneData
  viewerStore: ViewerStore
}

interface CameraFlight {
  fromPosition: Vector3
  toPosition: Vector3
  fromTarget: Vector3
  toTarget: Vector3
  startedAt: number
  orbit?: { from: Spherical; to: Spherical }
}

export const MineCamera = observer(
  ({ mine, data, viewerStore }: MineCameraProps) => {
    const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null)
    const flightRef = useRef<CameraFlight | null>(null)
    const lastPositionUpdateRef = useRef(-Infinity)
    const positionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
      null
    )
    const lastFitRef = useRef<{
      data: MineSceneData
      focusRequest: ViewerStore['focusRequest']
    } | null>(null)
    const { camera, invalidate, size } = useThree()
    const focusRequest = viewerStore.focusRequest
    const directionRequest = viewerStore.cameraDirectionRequest
    const sceneRadius = Math.max(
      data.bounds.getSize(new Vector3()).length() / 2,
      1
    )

    const publishCameraPosition = useCallback(() => {
      positionTimeoutRef.current = null
      lastPositionUpdateRef.current = performance.now()
      viewerStore.setCameraPosition({
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      })
    }, [camera, viewerStore])

    const startFlight = useCallback(
      (position: Vector3, target: Vector3, orbit?: CameraFlight['orbit']) => {
        const controls = controlsRef.current
        if (!controls) return

        const fromPosition = camera.position.clone()
        const fromTarget = controls.target.clone()

        // Убираем остаточную инерцию OrbitControls до начала перелёта.
        controls.enableDamping = false
        controls.update()
        camera.position.copy(fromPosition)
        controls.target.copy(fromTarget)
        camera.lookAt(fromTarget)

        flightRef.current = {
          fromPosition,
          toPosition: position,
          fromTarget,
          toTarget: target,
          startedAt: performance.now(),
          orbit
        }
        invalidate()
      },
      [camera, invalidate]
    )

    useEffect(
      () => () => {
        flightRef.current = null
        if (positionTimeoutRef.current !== null) {
          clearTimeout(positionTimeoutRef.current)
          positionTimeoutRef.current = null
        }
        lastPositionUpdateRef.current = -Infinity
        viewerStore.setCameraPosition(null)
      },
      [publishCameraPosition, viewerStore]
    )

    useEffect(() => {
      const controls = controlsRef.current
      if (!(camera instanceof PerspectiveCamera) || !controls) return

      const bounds = getFocusBounds(mine, data, focusRequest?.entity ?? null)
      if (bounds.isEmpty()) return

      const center = bounds.getCenter(new Vector3())
      const radius = Math.max(bounds.getSize(new Vector3()).length() / 2, 0.1)
      const verticalHalfFov = MathUtils.degToRad(camera.getEffectiveFOV()) / 2
      const horizontalHalfFov = Math.atan(
        Math.tan(verticalHalfFov) * camera.aspect
      )
      const distance = MathUtils.clamp(
        (radius / Math.sin(Math.min(verticalHalfFov, horizontalHalfFov))) * 1.2,
        controls.minDistance,
        controls.maxDistance
      )
      const direction = camera.position.clone().sub(controls.target).normalize()
      if (direction.lengthSq() === 0) direction.set(1, 0.7, 1).normalize()

      const position = center.clone().addScaledVector(direction, distance)
      const animate =
        focusRequest !== null &&
        lastFitRef.current?.data === data &&
        lastFitRef.current.focusRequest !== focusRequest
      lastFitRef.current = { data, focusRequest }
      camera.near = Math.max(
        Math.min(distance / 100, sceneRadius / 1000),
        0.001
      )
      camera.far = Math.max(sceneRadius * 100, distance * 10)
      camera.updateProjectionMatrix()

      if (animate) {
        startFlight(position, center)
      } else {
        flightRef.current = null
        controls.enableDamping = false
        controls.update()
        camera.position.copy(position)
        controls.target.copy(center)
        controls.update()
        controls.enableDamping = true
      }
      invalidate()
    }, [
      camera,
      data,
      focusRequest,
      invalidate,
      mine,
      sceneRadius,
      size.width,
      size.height,
      startFlight
    ])

    useEffect(() => {
      const controls = controlsRef.current
      if (!directionRequest || !controls) return

      const target = controls.target.clone()
      const from = new Spherical()
        .setFromVector3(camera.position.clone().sub(target))
        .makeSafe()
      const to = new Spherical()
        .setFromVector3(
          new Vector3(
            directionRequest.x,
            directionRequest.y,
            directionRequest.z
          )
        )
        .makeSafe()

      to.radius = from.radius
      to.theta =
        from.theta +
        MathUtils.euclideanModulo(
          to.theta - from.theta + Math.PI,
          2 * Math.PI
        ) -
        Math.PI

      startFlight(new Vector3().setFromSpherical(to).add(target), target, {
        from,
        to
      })
    }, [camera, directionRequest, startFlight])

    useFrame(() => {
      const controls = controlsRef.current
      if (!(camera instanceof PerspectiveCamera) || !controls) return

      const flight = flightRef.current
      if (flight) {
        const progress = Math.min(
          (performance.now() - flight.startedAt) / 800,
          1
        )
        const eased = progress * progress * (3 - 2 * progress)

        controls.target.lerpVectors(flight.fromTarget, flight.toTarget, eased)
        if (flight.orbit) {
          const { from, to } = flight.orbit
          camera.position
            .setFromSphericalCoords(
              MathUtils.lerp(from.radius, to.radius, eased),
              MathUtils.lerp(from.phi, to.phi, eased),
              MathUtils.lerp(from.theta, to.theta, eased)
            )
            .add(controls.target)
        } else {
          camera.position.lerpVectors(
            flight.fromPosition,
            flight.toPosition,
            eased
          )
        }
        controls.update()

        if (progress === 1) {
          flightRef.current = null
          controls.enableDamping = true
        }
        invalidate()
      }

      if (positionTimeoutRef.current === null) {
        const delay =
          CAMERA_POSITION_UPDATE_INTERVAL_MS -
          (performance.now() - lastPositionUpdateRef.current)

        if (delay <= 0) {
          publishCameraPosition()
        } else {
          // Передаём конечную позицию, даже если рендеринг по запросу уже остановился.
          positionTimeoutRef.current = setTimeout(publishCameraPosition, delay)
        }
      }

      const distance = camera.position.distanceTo(controls.target)
      const near = Math.max(
        Math.min(distance / 1000, sceneRadius / 1000),
        0.001
      )
      if (camera.near !== near) {
        camera.near = near
        camera.updateProjectionMatrix()
      }
    })

    return (
      <OrbitControls
        enableDamping
        makeDefault
        maxDistance={sceneRadius * 30}
        minDistance={Math.max(sceneRadius / 10000, 0.01)}
        onStart={() => {
          flightRef.current = null
          if (controlsRef.current) controlsRef.current.enableDamping = true
        }}
        ref={controlsRef}
      />
    )
  }
)
