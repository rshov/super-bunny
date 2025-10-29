interface GameHUDProps {
  gameState: {
    playerHealth: number
    enemyHealth: number
    currentEnemy: string
    defeatedEnemies: string[]
    isGameActive: boolean
  }
  onNewGame: () => void
}

export default function GameHUD({ gameState, onNewGame }: GameHUDProps) {
  const { playerHealth, enemyHealth, currentEnemy, defeatedEnemies } = gameState

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Player Health Bar - Top Left */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg p-4">
          <div className="text-white text-sm font-semibold mb-2">Player Health</div>
          <div className="w-48 h-4 bg-red-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-red-500 to-green-500 transition-all duration-300"
              style={{ width: `${playerHealth}%` }}
            />
          </div>
          <div className="text-white text-xs mt-1">{playerHealth}/100</div>
        </div>
      </div>

      {/* Enemy Health Bar - Top Center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg p-4">
          <div className="text-white text-sm font-semibold mb-2 capitalize">
            {currentEnemy} Health
          </div>
          <div className="w-48 h-4 bg-red-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-red-500 to-yellow-500 transition-all duration-300"
              style={{ width: `${enemyHealth}%` }}
            />
          </div>
          <div className="text-white text-xs mt-1">{enemyHealth}/100</div>
        </div>
      </div>

      {/* New Game Button - Top Right */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <button
          onClick={onNewGame}
          className="bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          New Game
        </button>
      </div>

      {/* Defeated Enemies Counter - Bottom Left */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg p-4">
          <div className="text-white text-sm font-semibold mb-2">Progress</div>
          <div className="text-green-400 text-sm">
            Defeated: {defeatedEnemies.length}/11
          </div>
          <div className="text-gray-400 text-xs mt-1">
            {defeatedEnemies.length === 11 ? 'Legendary Victory!' : `Next: ${currentEnemy}`}
          </div>
        </div>
      </div>

      {/* Controls Help - Bottom Right */}
      <div className="absolute bottom-4 right-4 pointer-events-auto">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg p-4">
          <div className="text-white text-sm font-semibold mb-2">Controls</div>
          <div className="text-gray-300 text-xs space-y-1">
            <div>WASD/Arrows - Move</div>
            <div>Mouse - Look</div>
            <div>Space - Jump</div>
            <div>Click - Attack</div>
          </div>
        </div>
      </div>
    </div>
  )
}
