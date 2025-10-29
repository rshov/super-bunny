import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'

interface KomodoProps {
  position: [number, number, number]
  gameState: any
  setGameState: any
}

export default function Komodo({ position, gameState, setGameState }: KomodoProps) {
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
    const komodoPos = meshRef.current.position

    const distance = komodoPos.distanceTo(playerPos)
    const moveSpeed = 1.5 // Slower but more menacing
    const attackRange = 5

    if (distance > attackRange) {
      const direction = playerPos.clone().sub(komodoPos).normalize()
      direction.y = 0
      komodoPos.add(direction.multiplyScalar(moveSpeed * delta))
    }

    if (distance <= attackRange && currentTime - lastAttackTime > 2.5) {
      setIsAttacking(true)
      setLastAttackTime(currentTime)
      
      setGameState((prev: any) => ({
        ...prev,
        playerHealth: Math.max(0, prev.playerHealth - 25) // Most damage!
      }))

      setTimeout(() => setIsAttacking(false), 800)
    }

    setGameState((prev: any) => ({
      ...prev,
      enemyPosition: {
        x: komodoPos.x,
        y: komodoPos.y,
        z: komodoPos.z,
      }
    }))

    if (gameState.enemyHealth <= 0) {
      setGameState((prev: any) => ({
        ...prev,
        defeatedEnemies: [...prev.defeatedEnemies, 'komodo'],
        currentEnemy: prev.defeatedEnemies.length === 5 ? 'hyena' : null,
        enemyHealth: 100
      }))
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {/* Komodo Dragon Body */}
      <mesh castShadow>
        <boxGeometry args={[2, 0.8, 3]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>

      {/* Komodo Dragon Head */}
      <mesh position={[0, 0.6, 1.8]} castShadow>
        <boxGeometry args={[1.2, 0.8, 1.2]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>

      {/* Komodo Dragon Snout */}
      <mesh position={[0, 0.4, 2.5]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.8]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>

      {/* Komodo Dragon Eyes */}
      <mesh position={[-0.3, 0.7, 2.2]} castShadow>
        <sphereGeometry args={[0.08]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0.3, 0.7, 2.2]} castShadow>
        <sphereGeometry args={[0.08]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>

      {/* Komodo Dragon Tail */}
      <mesh position={[0, 0.2, -2.5]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 2]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>

      {/* Komodo Dragon Legs */}
      <mesh position={[-0.6, -0.4, 0.8]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.8]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0.6, -0.4, 0.8]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.8]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>
      <mesh position={[-0.6, -0.4, -0.8]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.8]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0.6, -0.4, -0.8]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.8]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>

      {/* Komodo Dragon Spikes */}
      <mesh position={[-0.8, 0.6, 0]} castShadow>
        <coneGeometry args={[0.1, 0.3]} />
        <meshLambertMaterial color="#654321" />
      </mesh>
      <mesh position={[0.8, 0.6, 0]} castShadow>
        <coneGeometry args={[0.1, 0.3]} />
        <meshLambertMaterial color="#654321" />
      </mesh>
      <mesh position={[-0.8, 0.6, -1]} castShadow>
        <coneGeometry args={[0.1, 0.3]} />
        <meshLambertMaterial color="#654321" />
      </mesh>
      <mesh position={[0.8, 0.6, -1]} castShadow>
        <coneGeometry args={[0.1, 0.3]} />
        <meshLambertMaterial color="#654321" />
      </mesh>

      {/* Attack effect - Poison cloud */}
      {isAttacking && (
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[2.5, 8, 6]} />
          <meshBasicMaterial color="#00ff00" transparent opacity={0.4} />
        </mesh>
      )}

      {/* Health bar */}
      <mesh position={[0, 3, 0]}>
        <planeGeometry args={[2.5, 0.3]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0, 3, 0.01]}>
        <planeGeometry args={[(gameState.enemyHealth / 100) * 2.5, 0.2]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
    </group>
  )
}
