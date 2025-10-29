import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'

interface WolfProps {
  position: [number, number, number]
  gameState: any
  setGameState: any
}

export default function Wolf({ position, gameState, setGameState }: WolfProps) {
  const meshRef = useRef<Mesh>(null)
  const [velocity, setVelocity] = useState(new Vector3(0, 0, 0))
  const [isAttacking, setIsAttacking] = useState(false)
  const [lastAttackTime, setLastAttackTime] = useState(0)

  useFrame((state, delta) => {
    if (!meshRef.current || !gameState.isGameActive) return

    const currentTime = state.clock.elapsedTime
    const playerPos = new Vector3(
      gameState.playerPosition?.x || 0,
      gameState.playerPosition?.y || 0,
      gameState.playerPosition?.z || 0
    )
    const wolfPos = meshRef.current.position

    const distance = wolfPos.distanceTo(playerPos)
    const moveSpeed = 2.5
    const attackRange = 3.5

    if (distance > attackRange) {
      const direction = playerPos.clone().sub(wolfPos).normalize()
      direction.y = 0
      wolfPos.add(direction.multiplyScalar(moveSpeed * delta))
    }

    if (distance <= attackRange && currentTime - lastAttackTime > 1.8) {
      setIsAttacking(true)
      setLastAttackTime(currentTime)
      
      setGameState((prev: any) => ({
        ...prev,
        playerHealth: Math.max(0, prev.playerHealth - 15)
      }))

      setTimeout(() => setIsAttacking(false), 500)
    }

    setGameState((prev: any) => ({
      ...prev,
      enemyPosition: {
        x: wolfPos.x,
        y: wolfPos.y,
        z: wolfPos.z,
      }
    }))

    if (gameState.enemyHealth <= 0) {
      setGameState((prev: any) => ({
        ...prev,
        defeatedEnemies: [...prev.defeatedEnemies, 'wolf'],
        currentEnemy: prev.defeatedEnemies.length === 1 ? 'hawk' : null,
        enemyHealth: 100
      }))
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {/* Wolf Body */}
      <mesh castShadow>
        <boxGeometry args={[1.4, 1, 2]} />
        <meshLambertMaterial color="#6b7280" />
      </mesh>

      {/* Wolf Head */}
      <mesh position={[0, 0.7, 1]} castShadow>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshLambertMaterial color="#6b7280" />
      </mesh>

      {/* Wolf Ears */}
      <mesh position={[-0.3, 1.3, 0.8]} castShadow>
        <coneGeometry args={[0.2, 0.4]} />
        <meshLambertMaterial color="#6b7280" />
      </mesh>
      <mesh position={[0.3, 1.3, 0.8]} castShadow>
        <coneGeometry args={[0.2, 0.4]} />
        <meshLambertMaterial color="#6b7280" />
      </mesh>

      {/* Wolf Tail */}
      <mesh position={[0, 0.4, -1.5]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 1]} />
        <meshLambertMaterial color="#6b7280" />
      </mesh>

      {/* Attack effect */}
      {isAttacking && (
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[1.4, 8, 6]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.3} />
        </mesh>
      )}

      {/* Health bar */}
      <mesh position={[0, 2.5, 0]}>
        <planeGeometry args={[2, 0.2]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0, 2.5, 0.01]}>
        <planeGeometry args={[(gameState.enemyHealth / 100) * 2, 0.15]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
    </group>
  )
}
