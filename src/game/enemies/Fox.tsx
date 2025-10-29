import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'

interface FoxProps {
  position: [number, number, number]
  gameState: any
  setGameState: any
}

export default function Fox({ position, gameState, setGameState }: FoxProps) {
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
    const foxPos = meshRef.current.position

    // Calculate distance to player
    const distance = foxPos.distanceTo(playerPos)
    const moveSpeed = 2
    const attackRange = 3

    // Move towards player if not in attack range
    if (distance > attackRange) {
      const direction = playerPos.clone().sub(foxPos).normalize()
      direction.y = 0 // Keep fox on ground
      foxPos.add(direction.multiplyScalar(moveSpeed * delta))
    }

    // Attack if in range and cooldown is over
    if (distance <= attackRange && currentTime - lastAttackTime > 2) {
      setIsAttacking(true)
      setLastAttackTime(currentTime)
      
      // Deal damage to player
      setGameState((prev: any) => ({
        ...prev,
        playerHealth: Math.max(0, prev.playerHealth - 10)
      }))

      setTimeout(() => setIsAttacking(false), 500)
    }

    // Update game state with enemy position
    setGameState((prev: any) => ({
      ...prev,
      enemyPosition: {
        x: foxPos.x,
        y: foxPos.y,
        z: foxPos.z,
      }
    }))

    // Check if fox is defeated
    if (gameState.enemyHealth <= 0) {
      // Fox defeated - spawn next enemy or end game
      setGameState((prev: any) => ({
        ...prev,
        defeatedEnemies: [...prev.defeatedEnemies, 'fox'],
        currentEnemy: prev.defeatedEnemies.length === 0 ? 'wolf' : null,
        enemyHealth: 100
      }))
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {/* Fox Body */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.8, 1.8]} />
        <meshLambertMaterial color="#f97316" />
      </mesh>

      {/* Fox Head */}
      <mesh position={[0, 0.6, 0.8]} castShadow>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshLambertMaterial color="#f97316" />
      </mesh>

      {/* Fox Ears */}
      <mesh position={[-0.2, 1.1, 0.6]} castShadow>
        <coneGeometry args={[0.15, 0.3]} />
        <meshLambertMaterial color="#f97316" />
      </mesh>
      <mesh position={[0.2, 1.1, 0.6]} castShadow>
        <coneGeometry args={[0.15, 0.3]} />
        <meshLambertMaterial color="#f97316" />
      </mesh>

      {/* Fox Tail */}
      <mesh position={[0, 0.3, -1.2]} castShadow>
        <cylinderGeometry args={[0.1, 0.2, 0.8]} />
        <meshLambertMaterial color="#f97316" />
      </mesh>

      {/* Attack effect */}
      {isAttacking && (
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[1.2, 8, 6]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.3} />
        </mesh>
      )}

      {/* Health bar above fox */}
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
