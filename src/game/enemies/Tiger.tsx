import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'

interface TigerProps {
  position: [number, number, number]
  gameState: any
  setGameState: any
}

export default function Tiger({ position, gameState, setGameState }: TigerProps) {
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
    const tigerPos = meshRef.current.position

    const distance = tigerPos.distanceTo(playerPos)
    const moveSpeed = 2.6 // Fast and agile
    const attackRange = 3.8

    if (distance > attackRange) {
      const direction = playerPos.clone().sub(tigerPos).normalize()
      direction.y = 0
      tigerPos.add(direction.multiplyScalar(moveSpeed * delta))
    }

    if (distance <= attackRange && currentTime - lastAttackTime > 1.5) {
      setIsAttacking(true)
      setLastAttackTime(currentTime)
      
      setGameState((prev: any) => ({
        ...prev,
        playerHealth: Math.max(0, prev.playerHealth - 24)
      }))

      setTimeout(() => setIsAttacking(false), 500)
    }

    setGameState((prev: any) => ({
      ...prev,
      enemyPosition: {
        x: tigerPos.x,
        y: tigerPos.y,
        z: tigerPos.z,
      }
    }))

    if (gameState.enemyHealth <= 0) {
      setGameState((prev: any) => ({
        ...prev,
        defeatedEnemies: [...prev.defeatedEnemies, 'tiger'],
        currentEnemy: prev.defeatedEnemies.length === 9 ? 'flyingMonster' : null,
        enemyHealth: 100
      }))
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {/* Tiger Body */}
      <mesh castShadow>
        <boxGeometry args={[2.2, 1.1, 2.8]} />
        <meshLambertMaterial color="#ff8c00" />
      </mesh>

      {/* Tiger Head */}
      <mesh position={[0, 0.9, 1.6]} castShadow>
        <boxGeometry args={[1.4, 0.9, 1.1]} />
        <meshLambertMaterial color="#ff8c00" />
      </mesh>

      {/* Tiger Snout */}
      <mesh position={[0, 0.5, 2.2]} castShadow>
        <boxGeometry args={[0.7, 0.5, 0.7]} />
        <meshLambertMaterial color="#ff8c00" />
      </mesh>

      {/* Tiger Ears */}
      <mesh position={[-0.3, 1.3, 1.3]} castShadow>
        <coneGeometry args={[0.2, 0.4]} />
        <meshLambertMaterial color="#ff8c00" />
      </mesh>
      <mesh position={[0.3, 1.3, 1.3]} castShadow>
        <coneGeometry args={[0.2, 0.4]} />
        <meshLambertMaterial color="#ff8c00" />
      </mesh>

      {/* Tiger Eyes */}
      <mesh position={[-0.25, 0.8, 1.8]} castShadow>
        <sphereGeometry args={[0.07]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      <mesh position={[0.25, 0.8, 1.8]} castShadow>
        <sphereGeometry args={[0.07]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>

      {/* Tiger Stripes */}
      <mesh position={[0.4, 0.2, 0.5]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.4, 0.2, -0.5]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.3, 0.2, -0.8]} castShadow>
        <boxGeometry args={[0.08, 0.6, 0.08]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.3, 0.2, 0.8]} castShadow>
        <boxGeometry args={[0.08, 0.6, 0.08]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Tiger Tail */}
      <mesh position={[0, 0.7, -2.2]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.8]} />
        <meshLambertMaterial color="#ff8c00" />
      </mesh>

      {/* Tiger Legs */}
      <mesh position={[-0.8, -0.6, 0.9]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 1.1]} />
        <meshLambertMaterial color="#ff8c00" />
      </mesh>
      <mesh position={[0.8, -0.6, 0.9]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 1.1]} />
        <meshLambertMaterial color="#ff8c00" />
      </mesh>
      <mesh position={[-0.8, -0.6, -0.9]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 1.1]} />
        <meshLambertMaterial color="#ff8c00" />
      </mesh>
      <mesh position={[0.8, -0.6, -0.9]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 1.1]} />
        <meshLambertMaterial color="#ff8c00" />
      </mesh>

      {/* Attack effect - Pounce energy */}
      {isAttacking && (
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[2.5, 8, 6]} />
          <meshBasicMaterial color="#ff4400" transparent opacity={0.4} />
        </mesh>
      )}

      {/* Health bar */}
      <mesh position={[0, 2.5, 0]}>
        <planeGeometry args={[2.5, 0.3]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0, 2.5, 0.01]}>
        <planeGeometry args={[(gameState.enemyHealth / 100) * 2.5, 0.25]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
    </group>
  )
}
