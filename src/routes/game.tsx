import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { CharacterType } from '../game/GameState'
import GameScene from '../game/GameScene'
import GameHUD from '../components/GameHUD'

export const Route = createFileRoute('/game')({ component: GamePage })

function GamePage() {
  const { character } = Route.useSearch() as { character: CharacterType }
  const [gameState, setGameState] = useState({
    playerHealth: 100,
    enemyHealth: 100,
    currentEnemy: 'fox' as const,
    defeatedEnemies: [] as string[],
    isGameActive: true,
  })

  const handleNewGame = () => {
    setGameState({
      playerHealth: 100,
      enemyHealth: 100,
      currentEnemy: 'fox',
      defeatedEnemies: [],
      isGameActive: true,
    })
  }

  return (
    <div className="game-page w-screen h-screen relative">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 75 }}
        style={{ width: '100vw', height: '100vh', display: 'block' }}
      >
        <Suspense fallback={null}>
          <GameScene 
            character={character}
            gameState={gameState}
            setGameState={setGameState}
          />
        </Suspense>
      </Canvas>
      
      <GameHUD 
        gameState={gameState}
        onNewGame={handleNewGame}
      />
    </div>
  )
}
