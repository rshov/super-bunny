import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'

interface HyenaProps {
  position: [number, number, number]
  gameState: any
  setGameState: any
}

export default function Hyena({ position, gameState, setGameState }: HyenaProps) {
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
    const hyenaPos = meshRef.current.position

    const distance = hyenaPos.distanceTo(playerPos)
    const moveSpeed = 2.8 // Fast and aggressive
    const attackRange = 3.5

    if (distance > attackRange) {
      const direction = playerPos.clone().sub(hyenaPos).normalize()
      direction.y = 0
      hyenaPos.add(direction.multiplyScalar(moveSpeed * delta))
    }

    if (distance <= attackRange && currentTime - lastAttackTime > 1.3) {
      setIsAttacking(true)
      setLastAttackTime(currentTime)
      
      setGameState((prev: any) => ({
        ...prev,
        playerHealth: Math.max(0, prev.playerHealth - 18)
      }))

      setTimeout(() => setIsAttacking(false), 400)
    }

    setGameState((prev: any) => ({
      ...prev,
      enemyPosition: {
        x: hyenaPos.x,
        y: hyenaPos.y,
        z: hyenaPos.z,
      }
    }))

    if (gameState.enemyHealth <= 0) {
      setGameState((prev: any) => ({
        ...prev,
        defeatedEnemies: [...prev.defeatedEnemies, 'hyena'],
        currentEnemy: prev.defeatedEnemies.length === 6 ? 'grizzly' : null,
        enemyHealth: 100
      }))
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {/* Hyena Body */}
      <mesh castShadow>
        <boxGeometry args={[1.3, 0.7, 1.6]} />
        <meshLambertMaterial color="#8b7355" />
      </mesh>

      {/* Hyena Head */}
      <mesh position={[0, 0.6, 1]} castShadow>
        <boxGeometry args={[0.9, 0.7, 0.9]} />
        <meshLambertMaterial color="#8b7355" />
      </mesh>

      {/* Hyena Snout */}
      <mesh position={[0, 0.3, 1.6]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.6]} />
        <meshLambertMaterial color="#8b7355" />
      </mesh>

      {/* Hyena Ears */}
      <mesh position={[-0.3, 1.1, 0.7]} castShadow>
        <coneGeometry args={[0.15, 0.3]} />
        <meshLambertMaterial color="#8b7355" />
      </mesh>
      <mesh position={[0.3, 1.1, 0.7]} castShadow>
        <coneGeometry args={[0.15, 0.3]} />
        <meshLambertMaterial color="#8b7355" />
      </mesh>

      {/* Hyena Eyes */}
      <mesh position={[-0.25, 0.7, 1.3]} castShadow>
        <sphereGeometry args={[0.06]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
      <mesh position={[0.25, 0.7, 1.3]} castShadow>
        <sphereGeometry args={[0.06]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>

      {/* Hyena Spots */}
      <mesh position={[0.3, 0.2, 0.2]} castShadow>
        <sphereGeometry args={[0.08]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.3, 0.2, -0.2]} castShadow>
        <sphereGeometry args={[0.08]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.2, 0.2, -0.5]} castShadow>
        <sphereGeometry args={[0.06]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Hyena Tail */}
      <mesh position={[0, 0.3, -1.2]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.8]} />
        <meshLambertMaterial color="#8b7355" />
      </mesh>

      {/* Hyena Legs */}
      <mesh position={[-0.5, -0.4, 0.5]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.7]} />
        <meshLambertMaterial color="#8b7355" />
      </mesh>
      <mesh position={[0.5, -0.4, 0.5]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.7]} />
        <meshLambertMaterial color="#8b7355" />
      </mesh>
      <mesh position={[-0.5, -0.4, -0.5]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.7]} />
        <meshLambertMaterial color="#8b7355" />
      </mesh>
      <mesh position={[0.5, -0.4, -0.5]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.7]} />
        <meshLambertMaterial color="#8b7355" />
      </mesh>

      {/* Attack effect - Laughing sound waves */}
      {isAttacking && (
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[2, 8, 6]} />
          <meshBasicMaterial color="#ff8800" transparent opacity={0.3} />
        </mesh>
      )}

      {/* Health bar */}
      <mesh position={[0, 2.2, 0]}>
        <planeGeometry args={[2.2, 0.25]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0, 2.2, 0.01]}>
        <planeGeometry args={[(gameState.enemyHealth / 100) * 2.2, 0.2]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
    </group>
  )
}
