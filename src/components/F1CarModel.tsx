import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function Model() {
  const { scene } = useGLTF('/assets/oracle_red_bull_f1_car_rb19_2023/scene.gltf')
  const modelRef = useRef<THREE.Group>(null)

  // Slow auto-rotation when not interacting
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.002
    }
  })

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1.5}
      position={[0, -0.5, 0]}
    />
  )
}

function F1CarModel() {
  return (
    <div
      style={{
        width: '100%',
        height: '300px',
        marginTop: '40px',
        cursor: 'grab',
        background: 'transparent',
        border: 'none',
        outline: 'none',
      }}
    >
      <Canvas
        camera={{ position: [3, 2, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  )
}

export default F1CarModel

