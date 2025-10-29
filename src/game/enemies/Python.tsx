import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'

interface PythonProps {
  position: [number, number, number]
  gameState: any
  setGameState: any
}

export default function Python({ position, gameState, setGameState }: PythonProps) {
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
    const pythonPos = meshRef.current.position

    const distance = pythonPos.distanceTo(playerPos)
    const moveSpeed = 1.8
    const attackRange = 4

    if (distance > attackRange) {
      const direction = playerPos.clone().sub(pythonPos).normalize()
      direction.y = 0
      pythonPos.add(direction.multiplyScalar(moveSpeed * delta))
    }

    if (distance <= attackRange && currentTime - lastAttackTime > 2.2) {
      setIsAttacking(true)
      setLastAttackTime(currentTime)
      
      setGameState((prev: any) => ({
        ...prev,
        playerHealth: Math.max(0, prev.playerHealth - 18)
      }))

      setTimeout(() => setIsAttacking(false), 500)
    }

    setGameState((prev: any) => ({
      ...prev,
      enemyPosition: {
        x: pythonPos.x,
        y: pythonPos.y,
        z: pythonPos.z,
      }
    }))

    if (gameState.enemyHealth <= 0) {
      setGameState((prev: any) => ({
        ...prev,
        defeatedEnemies: [...prev.defeatedEnemies, 'python'],
        currentEnemy: prev.defeatedEnemies.length === 3 ? 'cheetah' : null,
        enemyHealth: 100
      }))
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {/* Python Body Segments */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 2]} />
        <meshLambertMaterial color="#059669" />
      </mesh>
      
      <mesh position={[0, 0, -1]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 2]} />
        <meshLambertMaterial color="#047857" />
      </mesh>
      
      <mesh position={[0, 0, -2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 2]} />
        <meshLambertMaterial color="#059669" />
      </mesh>

      {/* Python Head */}
      <mesh position={[0, 0, 1.2]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.8]} />
        <meshLambertMaterial color="#047857" />
      </mesh>

      {/* Python Eyes */}
      <mesh position={[-0.2, 0.1, 1.5]} castShadow>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0.2, 0.1, 1.5]} castShadow>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>

      {/* Attack effect */}
      {isAttacking && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.6, 8, 6]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.3} />
        </mesh>
      )}

      {/* Health bar */}
      <mesh position={[0, 1.5, 0]}>
        <planeGeometry args={[2, 0.2]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0, 1.5, 0.01]}>
        <planeGeometry args={[(gameState.enemyHealth / 100) * 2, 0.15]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
    </group>
  )
}
