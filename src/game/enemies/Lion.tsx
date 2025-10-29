import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'

interface LionProps {
  position: [number, number, number]
  gameState: any
  setGameState: any
}

export default function Lion({ position, gameState, setGameState }: LionProps) {
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
    const lionPos = meshRef.current.position

    const distance = lionPos.distanceTo(playerPos)
    const moveSpeed = 2.2 // Regal pace
    const attackRange = 4

    if (distance > attackRange) {
      const direction = playerPos.clone().sub(lionPos).normalize()
      direction.y = 0
      lionPos.add(direction.multiplyScalar(moveSpeed * delta))
    }

    if (distance <= attackRange && currentTime - lastAttackTime > 2) {
      setIsAttacking(true)
      setLastAttackTime(currentTime)
      
      setGameState((prev: any) => ({
        ...prev,
        playerHealth: Math.max(0, prev.playerHealth - 22)
      }))

      setTimeout(() => setIsAttacking(false), 600)
    }

    setGameState((prev: any) => ({
      ...prev,
      enemyPosition: {
        x: lionPos.x,
        y: lionPos.y,
        z: lionPos.z,
      }
    }))

    if (gameState.enemyHealth <= 0) {
      setGameState((prev: any) => ({
        ...prev,
        defeatedEnemies: [...prev.defeatedEnemies, 'lion'],
        currentEnemy: prev.defeatedEnemies.length === 8 ? 'tiger' : null,
        enemyHealth: 100
      }))
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {/* Lion Body */}
      <mesh castShadow>
        <boxGeometry args={[2, 1.2, 2.5]} />
        <meshLambertMaterial color="#daa520" />
      </mesh>

      {/* Lion Head */}
      <mesh position={[0, 1, 1.5]} castShadow>
        <boxGeometry args={[1.5, 1, 1.2]} />
        <meshLambertMaterial color="#daa520" />
      </mesh>

      {/* Lion Mane */}
      <mesh position={[0, 1.3, 0.8]} castShadow>
        <sphereGeometry args={[1.2, 8, 6]} />
        <meshLambertMaterial color="#b8860b" />
      </mesh>

      {/* Lion Snout */}
      <mesh position={[0, 0.6, 2]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.8]} />
        <meshLambertMaterial color="#daa520" />
      </mesh>

      {/* Lion Ears */}
      <mesh position={[-0.4, 1.6, 1.2]} castShadow>
        <sphereGeometry args={[0.2]} />
        <meshLambertMaterial color="#daa520" />
      </mesh>
      <mesh position={[0.4, 1.6, 1.2]} castShadow>
        <sphereGeometry args={[0.2]} />
        <meshLambertMaterial color="#daa520" />
      </mesh>

      {/* Lion Eyes */}
      <mesh position={[-0.3, 1, 1.8]} castShadow>
        <sphereGeometry args={[0.08]} />
        <meshBasicMaterial color="#ffd700" />
      </mesh>
      <mesh position={[0.3, 1, 1.8]} castShadow>
        <sphereGeometry args={[0.08]} />
        <meshBasicMaterial color="#ffd700" />
      </mesh>

      {/* Lion Tail */}
      <mesh position={[0, 0.8, -2]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1.5]} />
        <meshLambertMaterial color="#daa520" />
      </mesh>

      {/* Lion Tail Tuft */}
      <mesh position={[0, 0.8, -2.8]} castShadow>
        <sphereGeometry args={[0.2]} />
        <meshLambertMaterial color="#b8860b" />
      </mesh>

      {/* Lion Legs */}
      <mesh position={[-0.7, -0.6, 0.8]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.2]} />
        <meshLambertMaterial color="#daa520" />
      </mesh>
      <mesh position={[0.7, -0.6, 0.8]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.2]} />
        <meshLambertMaterial color="#daa520" />
      </mesh>
      <mesh position={[-0.7, -0.6, -0.8]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.2]} />
        <meshLambertMaterial color="#daa520" />
      </mesh>
      <mesh position={[0.7, -0.6, -0.8]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.2]} />
        <meshLambertMaterial color="#daa520" />
      </mesh>

      {/* Attack effect - Roar waves */}
      {isAttacking && (
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[2.8, 8, 6]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.4} />
        </mesh>
      )}

      {/* Health bar */}
      <mesh position={[0, 2.8, 0]}>
        <planeGeometry args={[2.8, 0.3]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0, 2.8, 0.01]}>
        <planeGeometry args={[(gameState.enemyHealth / 100) * 2.8, 0.25]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
    </group>
  )
}
