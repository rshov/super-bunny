import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'

interface FlyingMonsterProps {
  position: [number, number, number]
  gameState: any
  setGameState: any
}

export default function FlyingMonster({ position, gameState, setGameState }: FlyingMonsterProps) {
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
    const monsterPos = meshRef.current.position

    const distance = monsterPos.distanceTo(playerPos)
    const moveSpeed = 3.5 // Very fast flying
    const attackRange = 6

    // Flying monster moves in 3D space
    if (distance > attackRange) {
      const direction = playerPos.clone().sub(monsterPos).normalize()
      monsterPos.add(direction.multiplyScalar(moveSpeed * delta))
    }

    if (distance <= attackRange && currentTime - lastAttackTime > 1.8) {
      setIsAttacking(true)
      setLastAttackTime(currentTime)
      
      setGameState((prev: any) => ({
        ...prev,
        playerHealth: Math.max(0, prev.playerHealth - 35) // Highest damage!
      }))

      setTimeout(() => setIsAttacking(false), 700)
    }

    setGameState((prev: any) => ({
      ...prev,
      enemyPosition: {
        x: monsterPos.x,
        y: monsterPos.y,
        z: monsterPos.z,
      }
    }))

    if (gameState.enemyHealth <= 0) {
      setGameState((prev: any) => ({
        ...prev,
        defeatedEnemies: [...prev.defeatedEnemies, 'flyingMonster'],
        currentEnemy: null, // Legendary victory! All enemies defeated!
        enemyHealth: 100
      }))
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {/* Flying Monster Body */}
      <mesh castShadow>
        <boxGeometry args={[3, 1.5, 2]} />
        <meshLambertMaterial color="#4b0082" />
      </mesh>

      {/* Flying Monster Head */}
      <mesh position={[0, 1.2, 1.2]} castShadow>
        <boxGeometry args={[1.8, 1.2, 1.5]} />
        <meshLambertMaterial color="#4b0082" />
      </mesh>

      {/* Flying Monster Eyes */}
      <mesh position={[-0.4, 1.4, 1.8]} castShadow>
        <sphereGeometry args={[0.15]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0.4, 1.4, 1.8]} castShadow>
        <sphereGeometry args={[0.15]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>

      {/* Flying Monster Horns */}
      <mesh position={[-0.3, 2, 1.2]} castShadow>
        <coneGeometry args={[0.2, 0.8]} />
        <meshLambertMaterial color="#000000" />
      </mesh>
      <mesh position={[0.3, 2, 1.2]} castShadow>
        <coneGeometry args={[0.2, 0.8]} />
        <meshLambertMaterial color="#000000" />
      </mesh>

      {/* Flying Monster Wings */}
      <mesh position={[-2, 0.5, 0]} castShadow>
        <boxGeometry args={[0.3, 2.5, 1.5]} />
        <meshLambertMaterial color="#2e0854" />
      </mesh>
      <mesh position={[2, 0.5, 0]} castShadow>
        <boxGeometry args={[0.3, 2.5, 1.5]} />
        <meshLambertMaterial color="#2e0854" />
      </mesh>

      {/* Flying Monster Wing Details */}
      <mesh position={[-2.2, 0.8, 0.3]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.3]} />
        <meshLambertMaterial color="#000000" />
      </mesh>
      <mesh position={[2.2, 0.8, 0.3]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.3]} />
        <meshLambertMaterial color="#000000" />
      </mesh>

      {/* Flying Monster Tail */}
      <mesh position={[0, 0.3, -1.8]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 1.5]} />
        <meshLambertMaterial color="#4b0082" />
      </mesh>

      {/* Flying Monster Tail Spikes */}
      <mesh position={[0, 0.3, -2.5]} castShadow>
        <coneGeometry args={[0.15, 0.4]} />
        <meshLambertMaterial color="#000000" />
      </mesh>

      {/* Flying Monster Legs */}
      <mesh position={[-0.6, -0.8, 0.5]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 1.6]} />
        <meshLambertMaterial color="#4b0082" />
      </mesh>
      <mesh position={[0.6, -0.8, 0.5]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 1.6]} />
        <meshLambertMaterial color="#4b0082" />
      </mesh>
      <mesh position={[-0.6, -0.8, -0.5]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 1.6]} />
        <meshLambertMaterial color="#4b0082" />
      </mesh>
      <mesh position={[0.6, -0.8, -0.5]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 1.6]} />
        <meshLambertMaterial color="#4b0082" />
      </mesh>

      {/* Attack effect - Dark energy blast */}
      {isAttacking && (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[4, 8, 6]} />
          <meshBasicMaterial color="#8b008b" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Health bar */}
      <mesh position={[0, 4, 0]}>
        <planeGeometry args={[3.5, 0.3]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0, 4, 0.01]}>
        <planeGeometry args={[(gameState.enemyHealth / 100) * 3.5, 0.25]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
    </group>
  )
}
