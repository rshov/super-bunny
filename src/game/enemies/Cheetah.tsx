import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'

interface CheetahProps {
  position: [number, number, number]
  gameState: any
  setGameState: any
}

export default function Cheetah({ position, gameState, setGameState }: CheetahProps) {
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
    const cheetahPos = meshRef.current.position

    const distance = cheetahPos.distanceTo(playerPos)
    const moveSpeed = 4 // Fastest enemy
    const attackRange = 3

    if (distance > attackRange) {
      const direction = playerPos.clone().sub(cheetahPos).normalize()
      direction.y = 0
      cheetahPos.add(direction.multiplyScalar(moveSpeed * delta))
    }

    if (distance <= attackRange && currentTime - lastAttackTime > 1.2) {
      setIsAttacking(true)
      setLastAttackTime(currentTime)
      
      setGameState((prev: any) => ({
        ...prev,
        playerHealth: Math.max(0, prev.playerHealth - 20)
      }))

      setTimeout(() => setIsAttacking(false), 500)
    }

    setGameState((prev: any) => ({
      ...prev,
      enemyPosition: {
        x: cheetahPos.x,
        y: cheetahPos.y,
        z: cheetahPos.z,
      }
    }))

    if (gameState.enemyHealth <= 0) {
      setGameState((prev: any) => ({
        ...prev,
        defeatedEnemies: [...prev.defeatedEnemies, 'cheetah'],
        currentEnemy: prev.defeatedEnemies.length === 4 ? 'komodo' : null,
        enemyHealth: 100
      }))
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {/* Cheetah Body */}
      <mesh castShadow>
        <boxGeometry args={[1.6, 1, 2.2]} />
        <meshLambertMaterial color="#f59e0b" />
      </mesh>

      {/* Cheetah Spots */}
      <mesh position={[0.3, 0.2, 0.5]} castShadow>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.3, 0.2, -0.5]} castShadow>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.2, 0.2, -0.8]} castShadow>
        <sphereGeometry args={[0.08]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Cheetah Head */}
      <mesh position={[0, 0.8, 1.2]} castShadow>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshLambertMaterial color="#f59e0b" />
      </mesh>

      {/* Cheetah Ears */}
      <mesh position={[-0.3, 1.4, 0.8]} castShadow>
        <coneGeometry args={[0.2, 0.4]} />
        <meshLambertMaterial color="#f59e0b" />
      </mesh>
      <mesh position={[0.3, 1.4, 0.8]} castShadow>
        <coneGeometry args={[0.2, 0.4]} />
        <meshLambertMaterial color="#f59e0b" />
      </mesh>

      {/* Cheetah Tail */}
      <mesh position={[0, 0.5, -1.8]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 1.2]} />
        <meshLambertMaterial color="#f59e0b" />
      </mesh>

      {/* Attack effect */}
      {isAttacking && (
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[1.8, 8, 6]} />
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
