import { CharacterType } from './GameState'
import World from './World'
import BunnyBase from './characters/BunnyBase'
import Fox from './enemies/Fox'
import Wolf from './enemies/Wolf'
import Hawk from './enemies/Hawk'
import Python from './enemies/Python'
import Cheetah from './enemies/Cheetah'
import Komodo from './enemies/Komodo'
import Hyena from './enemies/Hyena'
import Grizzly from './enemies/Grizzly'
import Lion from './enemies/Lion'
import Tiger from './enemies/Tiger'
import FlyingMonster from './enemies/FlyingMonster'

interface GameSceneProps {
  character: CharacterType
  gameState: {
    playerHealth: number
    enemyHealth: number
    currentEnemy: string
    defeatedEnemies: string[]
    isGameActive: boolean
  }
  setGameState: (state: any) => void
}

export default function GameScene({ character, gameState, setGameState }: GameSceneProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* 3D World */}
      <World />

      {/* Player Character */}
      <BunnyBase 
        type={character}
        position={[0, 0, 0]}
        gameState={gameState}
        setGameState={setGameState}
      />

      {/* Current Enemy */}
      {gameState.currentEnemy === 'fox' && (
        <Fox 
          position={[15, 0, 10]}
          gameState={gameState}
          setGameState={setGameState}
        />
      )}
      
      {gameState.currentEnemy === 'wolf' && (
        <Wolf 
          position={[-10, 0, -15]}
          gameState={gameState}
          setGameState={setGameState}
        />
      )}
      
      {gameState.currentEnemy === 'hawk' && (
        <Hawk 
          position={[0, 5, -20]}
          gameState={gameState}
          setGameState={setGameState}
        />
      )}
      
      {gameState.currentEnemy === 'python' && (
        <Python 
          position={[20, 0, -5]}
          gameState={gameState}
          setGameState={setGameState}
        />
      )}
      
      {gameState.currentEnemy === 'cheetah' && (
        <Cheetah 
          position={[-15, 0, 20]}
          gameState={gameState}
          setGameState={setGameState}
        />
      )}
      
      {gameState.currentEnemy === 'komodo' && (
        <Komodo 
          position={[25, 0, 25]}
          gameState={gameState}
          setGameState={setGameState}
        />
      )}
      
      {gameState.currentEnemy === 'hyena' && (
        <Hyena 
          position={[-25, 0, -25]}
          gameState={gameState}
          setGameState={setGameState}
        />
      )}
      
      {gameState.currentEnemy === 'grizzly' && (
        <Grizzly 
          position={[0, 0, 30]}
          gameState={gameState}
          setGameState={setGameState}
        />
      )}
      
      {gameState.currentEnemy === 'lion' && (
        <Lion 
          position={[30, 0, -30]}
          gameState={gameState}
          setGameState={setGameState}
        />
      )}
      
      {gameState.currentEnemy === 'tiger' && (
        <Tiger 
          position={[-30, 0, 30]}
          gameState={gameState}
          setGameState={setGameState}
        />
      )}
      
      {gameState.currentEnemy === 'flyingMonster' && (
        <FlyingMonster 
          position={[0, 15, 0]}
          gameState={gameState}
          setGameState={setGameState}
        />
      )}
    </>
  )
}
