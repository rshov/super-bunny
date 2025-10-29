import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Group } from 'three'

export default function World() {
  const groundRef = useRef<Mesh>(null)
  const lakeRef = useRef<Mesh>(null)
  const rocksRef = useRef<Group>(null)
  const cavesRef = useRef<Group>(null)
  const treesRef = useRef<Group>(null)

  // Animate water
  useFrame((state) => {
    if (lakeRef.current) {
      lakeRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group>
      {/* Ground */}
      <mesh ref={groundRef} position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshLambertMaterial color="#4a7c59" />
      </mesh>

      {/* Lake */}
      <mesh ref={lakeRef} position={[15, 0, 10]} receiveShadow>
        <circleGeometry args={[3, 32]} />
        <meshLambertMaterial color="#1e40af" transparent opacity={0.8} />
      </mesh>

      {/* Rocks */}
      <group ref={rocksRef}>
        {/* Rock 1 */}
        <mesh position={[-8, 0.5, -12]} castShadow>
          <boxGeometry args={[2, 1, 1.5]} />
          <meshLambertMaterial color="#6b7280" />
        </mesh>
        
        {/* Rock 2 */}
        <mesh position={[-12, 0.3, -8]} castShadow>
          <boxGeometry args={[1.5, 0.6, 1]} />
          <meshLambertMaterial color="#6b7280" />
        </mesh>
        
        {/* Rock 3 */}
        <mesh position={[18, 0.4, -8]} castShadow>
          <boxGeometry args={[1.8, 0.8, 1.2]} />
          <meshLambertMaterial color="#6b7280" />
        </mesh>
        
        {/* Rock 4 */}
        <mesh position={[-15, 0.6, 15]} castShadow>
          <boxGeometry args={[2.2, 1.2, 1.8]} />
          <meshLambertMaterial color="#6b7280" />
        </mesh>
      </group>

      {/* Caves */}
      <group ref={cavesRef}>
        {/* Cave 1 */}
        <mesh position={[22, 0, -3]} castShadow>
          <boxGeometry args={[4, 2, 3]} />
          <meshLambertMaterial color="#374151" />
        </mesh>
        
        {/* Cave 2 */}
        <mesh position={[-18, 0, 8]} castShadow>
          <boxGeometry args={[3, 1.5, 2.5]} />
          <meshLambertMaterial color="#374151" />
        </mesh>
        
        {/* Cave 3 */}
        <mesh position={[5, 0, -25]} castShadow>
          <boxGeometry args={[3.5, 2.2, 2]} />
          <meshLambertMaterial color="#374151" />
        </mesh>
      </group>

      {/* Trees */}
      <group ref={treesRef}>
        {/* Tree 1 */}
        <group position={[8, 0, -5]}>
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 2]} />
            <meshLambertMaterial color="#8b4513" />
          </mesh>
          <mesh position={[0, 3, 0]} castShadow>
            <sphereGeometry args={[1.2, 8, 6]} />
            <meshLambertMaterial color="#22c55e" />
          </mesh>
        </group>

        {/* Tree 2 */}
        <group position={[-5, 0, 8]}>
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.5, 2.5]} />
            <meshLambertMaterial color="#8b4513" />
          </mesh>
          <mesh position={[0, 3.5, 0]} castShadow>
            <sphereGeometry args={[1.5, 8, 6]} />
            <meshLambertMaterial color="#16a34a" />
          </mesh>
        </group>

        {/* Tree 3 */}
        <group position={[12, 0, -15]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.45, 2.2]} />
            <meshLambertMaterial color="#8b4513" />
          </mesh>
          <mesh position={[0, 3.2, 0]} castShadow>
            <sphereGeometry args={[1.3, 8, 6]} />
            <meshLambertMaterial color="#22c55e" />
          </mesh>
        </group>

        {/* Tree 4 */}
        <group position={[-10, 0, -8]}>
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 2]} />
            <meshLambertMaterial color="#8b4513" />
          </mesh>
          <mesh position={[0, 3, 0]} castShadow>
            <sphereGeometry args={[1.2, 8, 6]} />
            <meshLambertMaterial color="#16a34a" />
          </mesh>
        </group>

        {/* Tree 5 */}
        <group position={[20, 0, 5]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.6, 3]} />
            <meshLambertMaterial color="#8b4513" />
          </mesh>
          <mesh position={[0, 4, 0]} castShadow>
            <sphereGeometry args={[1.8, 8, 6]} />
            <meshLambertMaterial color="#22c55e" />
          </mesh>
        </group>

        {/* Tree 6 */}
        <group position={[-15, 0, 12]}>
          <mesh position={[0, 1.3, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.5, 2.6]} />
            <meshLambertMaterial color="#8b4513" />
          </mesh>
          <mesh position={[0, 3.6, 0]} castShadow>
            <sphereGeometry args={[1.6, 8, 6]} />
            <meshLambertMaterial color="#16a34a" />
          </mesh>
        </group>
      </group>

      {/* Sky Background */}
      <mesh position={[0, 0, -50]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial color="#87ceeb" />
      </mesh>
    </group>
  )
}
