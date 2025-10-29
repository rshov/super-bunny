import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { CharacterType } from '../game/GameState'

interface Character {
  type: CharacterType
  name: string
  description: string
  color: string
  icon: string
}

const characters: Character[] = [
  {
    type: 'chef',
    name: 'Chef Bunny',
    description: 'This bunny can do anything with its chef tools. Throws utensils at enemies!',
    color: 'bg-orange-500',
    icon: '👨‍🍳'
  },
  {
    type: 'queen',
    name: 'Queen Bunny',
    description: 'This bunny is very bossy and can tell her workers what to do. Commands minions!',
    color: 'bg-purple-500',
    icon: '👑'
  },
  {
    type: 'ballerina',
    name: 'Ballerina Bunny',
    description: 'Can jump on her head and spin and will make the enemies throw up. Spin attacks!',
    color: 'bg-pink-500',
    icon: '🩰'
  }
]

export default function CharacterSelect() {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType | null>(null)
  const navigate = useNavigate()

  const handleStartGame = () => {
    if (selectedCharacter) {
      navigate({ to: '/game', search: { character: selectedCharacter } })
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-white mb-4">
            <span className="bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              SUPER BUNNY
            </span>
          </h1>
          <p className="text-2xl text-gray-300 mb-2">Choose Your Character</p>
          <p className="text-lg text-gray-400">
            Defeat the enemies in order: Fox → Wolf → Hawk → Python → Cheetah → Komodo Dragon → Hyena → Grizzly Bear → Lion → Tiger → Flying Monster
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {characters.map((character) => (
            <div
              key={character.type}
              onClick={() => setSelectedCharacter(character.type)}
              className={`
                relative cursor-pointer transform transition-all duration-300 hover:scale-105
                ${selectedCharacter === character.type 
                  ? 'ring-4 ring-yellow-400 scale-105' 
                  : 'hover:ring-2 hover:ring-gray-400'
                }
              `}
            >
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full ${character.color} flex items-center justify-center text-4xl`}>
                  {character.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{character.name}</h3>
                <p className="text-gray-400 leading-relaxed">{character.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleStartGame}
            disabled={!selectedCharacter}
            className={`
              px-12 py-4 text-xl font-bold rounded-lg transition-all duration-300
              ${selectedCharacter
                ? 'bg-linear-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg shadow-green-500/50'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Start Adventure!
          </button>
        </div>
      </div>
    </div>
  )
}
