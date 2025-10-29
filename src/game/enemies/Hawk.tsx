import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'

interface HawkProps {
  position: [number, number, number]
  gameState: any
  setGameState: any
}

export default function Hawk({ position, gameState, setGameState }: HawkProps) {
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
    const hawkPos = meshRef.current.position

    const distance = hawkPos.distanceTo(playerPos)
    const moveSpeed = 3
    const attackRange = 4

    // Hawk flies in 3D space
    if (distance > attackRange) {
      const direction = playerPos.clone().sub(hawkPos).normalize()
      hawkPos.add(direction.multiplyScalar(moveSpeed * delta))
    }

    if (distance <= attackRange && currentTime - lastAttackTime > 1.5) {
      setIsAttacking(true)
      setLastAttackTime(currentTime)
      
      setGameState((prev: any) => ({
        ...prev,
        playerHealth: Math.max(0, prev.playerHealth - 12)
      }))

      setTimeout(() => setIsAttacking(false), 500)
    }

    setGameState((prev: any) => ({
      ...prev,
      enemyPosition: {
        x: hawkPos.x,
        y: hawkPos.y,
        z: hawkPos.z,
      }
    }))

    if (gameState.enemyHealth <= 0) {
      setGameState((prev: any) => ({
        ...prev,
        defeatedEnemies: [...prev.defeatedEnemies, 'hawk'],
        currentEnemy: prev.defeatedEnemies.length === 2 ? 'python' : null,
        enemyHealth: 100
      }))
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {/* Hawk Body */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.6, 1.2]} />
        <meshLambertMaterial color="#92400e" />
      </mesh>

      {/* Hawk Head */}
      <mesh position={[0, 0.5, 0.6]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.6]} />
        <meshLambertMaterial color="#92400e" />
      </mesh>

      {/* Hawk Beak */}
      <mesh position={[0, 0.3, 1]} castShadow>
        <coneGeometry args={[0.1, 0.3]} />
        <meshLambertMaterial color="#fbbf24" />
      </mesh>

      {/* Hawk Wings */}
      <mesh position={[-0.8, 0, 0]} castShadow>
        <boxGeometry args={[0.2, 1.5, 0.8]} />
        <meshLambertMaterial color="#92400e" />
      </mesh>
      <mesh position={[0.8, 0, 0]} castShadow>
        <boxGeometry args={[0.2, 1.5, 0.8]} />
        <meshLambertMaterial color="#92400e" />
      </mesh>

      {/* Attack effect */}
      {isAttacking && (
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[1.2, 8, 6]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.3} />
        </mesh>
      )}

      {/* Health bar */}
      <mesh position={[0, 2, 0]}>
        <planeGeometry args={[2, 0.2]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0, 2, 0.01]}>
        <planeGeometry args={[(gameState.enemyHealth / 100) * 2, 0.15]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
    </group>
  )
}
