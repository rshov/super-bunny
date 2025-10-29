import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'

interface GrizzlyProps {
  position: [number, number, number]
  gameState: any
  setGameState: any
}

export default function Grizzly({ position, gameState, setGameState }: GrizzlyProps) {
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
    const grizzlyPos = meshRef.current.position

    const distance = grizzlyPos.distanceTo(playerPos)
    const moveSpeed = 1.2 // Slow but powerful
    const attackRange = 4.5

    if (distance > attackRange) {
      const direction = playerPos.clone().sub(grizzlyPos).normalize()
      direction.y = 0
      grizzlyPos.add(direction.multiplyScalar(moveSpeed * delta))
    }

    if (distance <= attackRange && currentTime - lastAttackTime > 3) {
      setIsAttacking(true)
      setLastAttackTime(currentTime)
      
      setGameState((prev: any) => ({
        ...prev,
        playerHealth: Math.max(0, prev.playerHealth - 30) // Highest damage!
      }))

      setTimeout(() => setIsAttacking(false), 1000)
    }

    setGameState((prev: any) => ({
      ...prev,
      enemyPosition: {
        x: grizzlyPos.x,
        y: grizzlyPos.y,
        z: grizzlyPos.z,
      }
    }))

    if (gameState.enemyHealth <= 0) {
      setGameState((prev: any) => ({
        ...prev,
        defeatedEnemies: [...prev.defeatedEnemies, 'grizzly'],
        currentEnemy: prev.defeatedEnemies.length === 7 ? 'lion' : null,
        enemyHealth: 100
      }))
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {/* Grizzly Bear Body */}
      <mesh castShadow>
        <boxGeometry args={[2.5, 1.5, 3]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>

      {/* Grizzly Bear Head */}
      <mesh position={[0, 1.2, 1.8]} castShadow>
        <boxGeometry args={[1.8, 1.2, 1.5]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>

      {/* Grizzly Bear Snout */}
      <mesh position={[0, 0.8, 2.8]} castShadow>
        <boxGeometry args={[0.8, 0.6, 1]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>

      {/* Grizzly Bear Ears */}
      <mesh position={[-0.6, 1.8, 1.2]} castShadow>
        <sphereGeometry args={[0.3]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0.6, 1.8, 1.2]} castShadow>
        <sphereGeometry args={[0.3]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>

      {/* Grizzly Bear Eyes */}
      <mesh position={[-0.4, 1.3, 2.2]} castShadow>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.4, 1.3, 2.2]} castShadow>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Grizzly Bear Nose */}
      <mesh position={[0, 0.6, 3.2]} castShadow>
        <sphereGeometry args={[0.15]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Grizzly Bear Arms */}
      <mesh position={[-1.2, 0.5, 0.5]} castShadow>
        <boxGeometry args={[0.8, 1.2, 0.8]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>
      <mesh position={[1.2, 0.5, 0.5]} castShadow>
        <boxGeometry args={[0.8, 1.2, 0.8]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>

      {/* Grizzly Bear Legs */}
      <mesh position={[-0.8, -0.8, 0.8]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.6]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0.8, -0.8, 0.8]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.6]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>
      <mesh position={[-0.8, -0.8, -0.8]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.6]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0.8, -0.8, -0.8]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.6]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>

      {/* Grizzly Bear Claws */}
      <mesh position={[-1.2, -0.2, 0.8]} castShadow>
        <coneGeometry args={[0.1, 0.3]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[1.2, -0.2, 0.8]} castShadow>
        <coneGeometry args={[0.1, 0.3]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Attack effect - Roar shockwave */}
      {isAttacking && (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[3, 8, 6]} />
          <meshBasicMaterial color="#ff6600" transparent opacity={0.4} />
        </mesh>
      )}

      {/* Health bar */}
      <mesh position={[0, 3.5, 0]}>
        <planeGeometry args={[3, 0.3]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0, 3.5, 0.01]}>
        <planeGeometry args={[(gameState.enemyHealth / 100) * 3, 0.25]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
    </group>
  )
}
