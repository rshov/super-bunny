export type CharacterType = 'chef' | 'queen' | 'ballerina'

export type EnemyType = 'fox' | 'wolf' | 'hawk' | 'python' | 'cheetah' | 'komodo' | 'hyena' | 'grizzly' | 'lion' | 'tiger' | 'flyingMonster'

export interface GameState {
  selectedCharacter: CharacterType | null
  currentEnemy: EnemyType | null
  defeatedEnemies: EnemyType[]
  playerHealth: number
  enemyHealth: number
  playerPosition: { x: number; y: number; z: number }
  enemyPosition: { x: number; y: number; z: number }
  isGameActive: boolean
  isAttacking: boolean
  attackCooldown: number
}

export const initialGameState: GameState = {
  selectedCharacter: null,
  currentEnemy: null,
  defeatedEnemies: [],
  playerHealth: 100,
  enemyHealth: 100,
  playerPosition: { x: 0, y: 0, z: 0 },
  enemyPosition: { x: 0, y: 0, z: 0 },
  isGameActive: false,
  isAttacking: false,
  attackCooldown: 0,
}

export const enemyOrder: EnemyType[] = ['fox', 'wolf', 'hawk', 'python', 'cheetah', 'komodo', 'hyena', 'grizzly', 'lion', 'tiger', 'flyingMonster']

export const getNextEnemy = (defeatedEnemies: EnemyType[]): EnemyType | null => {
  const nextIndex = defeatedEnemies.length
  return nextIndex < enemyOrder.length ? enemyOrder[nextIndex] : null
}

export const getEnemySpawnPosition = (enemyType: EnemyType): { x: number; y: number; z: number } => {
  switch (enemyType) {
    case 'fox':
      return { x: 15, y: 0, z: 10 } // Near the lake
    case 'wolf':
      return { x: -10, y: 0, z: -15 } // Near rocks
    case 'hawk':
      return { x: 0, y: 5, z: -20 } // Flying above
    case 'python':
      return { x: 20, y: 0, z: -5 } // Near caves
    case 'cheetah':
      return { x: -15, y: 0, z: 20 } // Open area
    case 'komodo':
      return { x: 25, y: 0, z: 25 } // Far corner - final boss arena!
    case 'hyena':
      return { x: -25, y: 0, z: -25 } // Opposite corner
    case 'grizzly':
      return { x: 0, y: 0, z: 30 } // Far north - ultimate boss!
    case 'lion':
      return { x: 30, y: 0, z: -30 } // Far southeast
    case 'tiger':
      return { x: -30, y: 0, z: 30 } // Far northwest
    case 'flyingMonster':
      return { x: 0, y: 15, z: 0 } // High above center - legendary boss!
    default:
      return { x: 0, y: 0, z: 0 }
  }
}
