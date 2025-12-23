import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html, useProgress } from '@react-three/drei'
import * as THREE from 'three'

function Loader() {
  const { progress } = useProgress()
  
  return (
    <Html center>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          color: '#003c74',
          fontFamily: 'Tahoma, sans-serif',
        }}
      >
        <div
          style={{
            width: '200px',
            height: '20px',
            background: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden',
            border: '1px solid #999',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(to bottom, #5c95d6 0%, #3b6fbc 50%, #2a52a0 100%)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <span style={{ fontSize: '12px' }}>Loading RB19... {Math.round(progress)}%</span>
      </div>
    </Html>
  )
}

function Model({ onLoaded }: { onLoaded: () => void }) {
  const { scene } = useGLTF('/assets/oracle_red_bull_f1_car_rb19_2023/scene.gltf')
  const modelRef = useRef<THREE.Group>(null)
  const hasCalledOnLoaded = useRef(false)

  // Slow auto-rotation when not interacting
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.002
      
      // Call onLoaded once the model is rendered
      if (!hasCalledOnLoaded.current) {
        hasCalledOnLoaded.current = true
        onLoaded()
      }
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
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div
      style={{
        width: '100%',
        height: '300px',
        marginTop: '40px',
        cursor: isLoaded ? 'grab' : 'wait',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        position: 'relative',
      }}
    >
      <Canvas
        camera={{ position: [3, 2, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <Suspense fallback={<Loader />}>
          <Model onLoaded={() => setIsLoaded(true)} />
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
