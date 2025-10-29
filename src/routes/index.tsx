import { createFileRoute } from '@tanstack/react-router'
import CharacterSelect from '../components/CharacterSelect'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return <CharacterSelect />
}
