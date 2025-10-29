import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'
import { CharacterType } from '../GameState'
import { AttackSystem } from '../combat/CollisionDetection'

interface BunnyBaseProps {
  type: CharacterType
  position: [number, number, number]
  gameState: any
  setGameState: any
}

export default function BunnyBase({ type, position, gameState, setGameState }: BunnyBaseProps) {
  const meshRef = useRef<Mesh>(null)
  const [velocity, setVelocity] = useState(new Vector3(0, 0, 0))
  const [isJumping, setIsJumping] = useState(false)
  const [isAttacking, setIsAttacking] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cameraAngle, setCameraAngle] = useState({ horizontal: 0, vertical: 0 })
  const { camera } = useThree()

  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    arrowUp: false,
    arrowLeft: false,
    arrowDown: false,
    arrowRight: false,
    space: false,
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.w = true
          keys.current.arrowUp = true
          break
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.a = true
          keys.current.arrowLeft = true
          break
        case 'KeyS':
        case 'ArrowDown':
          keys.current.s = true
          keys.current.arrowDown = true
          break
        case 'KeyD':
        case 'ArrowRight':
          keys.current.d = true
          keys.current.arrowRight = true
          break
        case 'Space':
          event.preventDefault()
          keys.current.space = true
          break
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.w = false
          keys.current.arrowUp = false
          break
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.a = false
          keys.current.arrowLeft = false
          break
        case 'KeyS':
        case 'ArrowDown':
          keys.current.s = false
          keys.current.arrowDown = false
          break
        case 'KeyD':
        case 'ArrowRight':
          keys.current.d = false
          keys.current.arrowRight = false
          break
        case 'Space':
          keys.current.space = false
          break
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      const sensitivity = 0.002
      setCameraAngle(prev => ({
        horizontal: prev.horizontal + event.movementX * sensitivity,
        vertical: Math.max(-Math.PI / 3, Math.min(Math.PI / 3, prev.vertical - event.movementY * sensitivity))
      }))
    }

    const handleClick = () => {
      if (isAttacking) return // Prevent spam clicking
      
      setIsAttacking(true)
      
      // Execute attack based on character type
      const playerPos = meshRef.current!.position
      const enemyPos = new Vector3(
        gameState.enemyPosition?.x || 0,
        gameState.enemyPosition?.y || 0,
        gameState.enemyPosition?.z || 0
      )
      
      let attackResult
      switch (type) {
        case 'chef':
          const forwardDirection = new Vector3(0, 0, -1) // Forward direction
          attackResult = AttackSystem.executeChefAttack(playerPos, forwardDirection, enemyPos)
          break
        case 'queen':
          attackResult = AttackSystem.executeQueenAttack(playerPos, enemyPos)
          break
        case 'ballerina':
          attackResult = AttackSystem.executeBallerinaAttack(playerPos, enemyPos)
          break
        default:
          attackResult = { hit: false, damage: 0, position: enemyPos }
      }
      
      // Apply damage if hit
      if (attackResult.hit) {
        setGameState((prev: any) => ({
          ...prev,
          enemyHealth: Math.max(0, prev.enemyHealth - attackResult.damage)
        }))
      }
      
      setTimeout(() => setIsAttacking(false), 500)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('click', handleClick)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    const speed = 5
    const jumpForce = 8
    const gravity = -20

    // Handle movement
    const moveVector = new Vector3()
    
    if (keys.current.w || keys.current.arrowUp) moveVector.z -= 1
    if (keys.current.s || keys.current.arrowDown) moveVector.z += 1
    if (keys.current.a || keys.current.arrowLeft) moveVector.x -= 1
    if (keys.current.d || keys.current.arrowRight) moveVector.x += 1

    moveVector.normalize()
    moveVector.multiplyScalar(speed * delta)

    // Apply movement
    meshRef.current.position.add(moveVector)

    // Handle jumping
    if (keys.current.space && !isJumping) {
      velocity.y = jumpForce
      setIsJumping(true)
    }

    // Apply gravity
    velocity.y += gravity * delta
    meshRef.current.position.y += velocity.y * delta

    // Ground collision
    if (meshRef.current.position.y <= 0) {
      meshRef.current.position.y = 0
      velocity.y = 0
      setIsJumping(false)
    }

    // Update camera to follow player with mouse control
    const cameraDistance = 10
    const cameraHeight = 5
    
    const cameraX = meshRef.current.position.x + Math.sin(cameraAngle.horizontal) * cameraDistance
    const cameraY = meshRef.current.position.y + cameraHeight + Math.sin(cameraAngle.vertical) * cameraDistance * 0.5
    const cameraZ = meshRef.current.position.z + Math.cos(cameraAngle.horizontal) * cameraDistance
    
    camera.position.set(cameraX, cameraY, cameraZ)
    camera.lookAt(meshRef.current.position)

    // Update game state with player position
    setGameState((prev: any) => ({
      ...prev,
      playerPosition: {
        x: meshRef.current!.position.x,
        y: meshRef.current!.position.y,
        z: meshRef.current!.position.z,
      }
    }))
  })

  const getCharacterColor = () => {
    switch (type) {
      case 'chef':
        return '#f97316' // Orange
      case 'queen':
        return '#a855f7' // Purple
      case 'ballerina':
        return '#ec4899' // Pink
      default:
        return '#ffffff' // White
    }
  }

  const getCharacterAccessory = () => {
    switch (type) {
      case 'chef':
        return (
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.8, 0.6, 0.3]} />
            <meshLambertMaterial color="#ffffff" />
          </mesh>
        )
      case 'queen':
        return (
          <mesh position={[0, 1.3, 0]}>
            <coneGeometry args={[0.5, 0.4]} />
            <meshLambertMaterial color="#ffd700" />
          </mesh>
        )
      case 'ballerina':
        return (
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.6, 0.8, 0.2]} />
            <meshLambertMaterial color="#ffffff" />
          </mesh>
        )
      default:
        return null
    }
  }

  return (
    <group ref={meshRef} position={position}>
      {/* Bunny Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.8, 8, 6]} />
        <meshLambertMaterial color={getCharacterColor()} />
      </mesh>

      {/* Bunny Head */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.6, 8, 6]} />
        <meshLambertMaterial color={getCharacterColor()} />
      </mesh>

      {/* Bunny Ears */}
      <mesh position={[-0.3, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.4]} />
        <meshLambertMaterial color={getCharacterColor()} />
      </mesh>
      <mesh position={[0.3, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.4]} />
        <meshLambertMaterial color={getCharacterColor()} />
      </mesh>

      {/* Character-specific accessories */}
      {getCharacterAccessory()}

      {/* Attack effect */}
      {isAttacking && (
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[1.5, 8, 6]} />
          <meshBasicMaterial color="#ffff00" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  )
}
