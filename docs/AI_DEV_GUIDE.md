<!-- Internal developer documentation for AI-assisted feature work -->

## Super Bunny - Internal Architecture Guide

Use this as authoritative context when extending the game with new features, enemies, characters, or systems.

### Tech Stack

- Runtime/UI: React 19 + TanStack Router
- 3D: three via @react-three/fiber (R3F) and @react-three/drei (light helpers allowed but unused yet)
- Build: Vite + TypeScript
- Styles: Tailwind 4 (utility classes in JSX)

### App Shell & Routing

- Root shell: `src/routes/__root.tsx`
  - Adds global CSS, optional `Header`, and Devtools
  - On the game route (`/game`) the body gets class `game-page` to force full-viewport, non-scroll layout
- Routes
  - `src/routes/index.tsx`: landing + character selection (`CharacterSelect`)
  - `src/routes/game.tsx`: full-screen R3F `Canvas` hosting the 3D scene (`GameScene`) and HUD

### Game Core

- Scene wrapper: `src/game/GameScene.tsx`
  - Adds lights, world, player, and the single active enemy based on `gameState.currentEnemy`
  - Imports individual enemy components and conditionally renders exactly one
- World/environment: `src/game/World.tsx`
  - Simple primitives for ground, lake, rocks, caves, trees, sky
  - Note: ground plane is rotated `[-Math.PI/2, 0, 0]` to lay flat
- State model: `src/game/GameState.ts`
  - Types: `CharacterType`, `EnemyType`
  - `initialGameState`
  - Linear enemy progression: `enemyOrder`
  - `getNextEnemy(defeatedEnemies)` and `getEnemySpawnPosition(enemyType)` centralize sequencing and spawn coordinates

### Player/Controls

- Player avatar: `src/game/characters/BunnyBase.tsx`
  - Geometry: simple shapes (body/head/ears) + accessory per character type
  - Movement: WASD and arrow keys; jump with Space; basic gravity and ground clamp
  - Camera: third-person follow + mouse orbit (mousemove adjusts horizontal/vertical angles)
  - Attacks: click to trigger per-character attack; damage application occurs by writing to shared `gameState`

### Combat

- Collision/attacks: `src/game/combat/CollisionDetection.ts`
  - Utility methods: sphere/box collision and simple raycast approximation
  - `AttackSystem`: helpers for Chef (ray-like), Queen (minion sphere), Ballerina (spin AoE)
  - Simplicity-first: attacks are deterministic, time-bounded animations without physics

### Enemies

- Directory: `src/game/enemies/`
- Pattern (each enemy component):
  - Props: `position`, `gameState`, `setGameState`
  - AI: on each frame, move toward player (ground-limited except flyers), attack on proximity with cooldown
  - Health bar: two planes above enemy (red background, green foreground scaled by health)
  - Defeat handling: when `gameState.enemyHealth <= 0`, push own id to `defeatedEnemies`, set `currentEnemy` to next id in sequence, and reset `enemyHealth`
  - Spawn positions are owned by `getEnemySpawnPosition`
- Current sequence (in order):
  - fox → wolf → hawk → python → cheetah → komodo → hyena → grizzly → lion → tiger → flyingMonster

### UI

- HUD: `src/components/GameHUD.tsx`
  - Shows player health, current enemy, enemy health, defeated count, controls help, and a New Game button
- Character select: `src/components/CharacterSelect.tsx`
  - Lets player choose Chef, Queen, or Ballerina; navigates to `/game?character=<type>`

### GameState Contract

- `GameState` (partial; see file for full type):
  - `selectedCharacter: CharacterType | null`
  - `currentEnemy: EnemyType | null`
  - `defeatedEnemies: EnemyType[]`
  - `playerHealth: number`, `enemyHealth: number`
  - `playerPosition`, `enemyPosition`: `{ x, y, z }`
  - `isGameActive: boolean`

Rules/invariants:

- Exactly one active enemy at a time. `GameScene` enforces this via conditional render based on `currentEnemy`.
- Enemy defeat flow must:
  1. Append own id to `defeatedEnemies`
  2. Set `currentEnemy` to the correct next id (use `enemyOrder` or `getNextEnemy`)
  3. Reset `enemyHealth` to 100
- Player health and enemy health are simple numeric pools (0..100). No knockback/physics by default.

### Controls (Player)

- Move: WASD or arrow keys
- Jump: Space
- Attack: Left click
- Camera: Mouse move (orbit follow camera)

### Adding a New Enemy (Checklist)

1. Extend `EnemyType` in `src/game/GameState.ts`
2. Append to `enemyOrder` in progression order
3. Add spawn location in `getEnemySpawnPosition`
4. Create `src/game/enemies/<NewEnemy>.tsx`
   - Implement movement toward player, cooldown-based melee or ranged attack
   - On defeat: update `defeatedEnemies`, set `currentEnemy` to next sequence id, reset `enemyHealth`
5. Import and conditionally render in `src/game/GameScene.tsx`
6. Optionally update `CharacterSelect` blurb and `GameHUD` defeated count denominator

### Adding a New Player Character (Checklist)

1. Extend `CharacterType` in `GameState.ts`
2. Update `CharacterSelect` to include the character option
3. Update `BunnyBase` to render accessory/visuals for the new type
4. Implement attack behavior in `AttackSystem` (or inline in `BunnyBase` calling a new helper)

### Common Pitfalls

- Plane orientation: use `rotation={[-Math.PI/2, 0, 0]}` for ground-like planes
- Enemy progression off-by-one: when enemy X dies, the length of `defeatedEnemies` BEFORE push determines the next enemy index; many bugs were fixed by checking the correct length
- Fullscreen scroll: the game page uses body class `game-page` to prevent scrolling; only apply `overflow: hidden` in that mode
- Tailwind gradient lint: prefer `bg-gradient-to-*`; any suggestions to `bg-linear-to-*` are false positives and should be ignored/disabled

### Performance Notes

- Mesh counts are low-poly primitives; shadows are on selective meshes only
- Consider instancing or merging geometry if adding many props (trees/rocks)
- Keep per-frame work minimal; avoid allocating new objects in `useFrame` hot paths where possible

### Roadmap Ideas (Safe for AI to implement)

- Add pause menu + settings (mouse sensitivity, invert Y, music volume)
- Basic hit reactions: brief color flash on damage
- Simple pickup system (health carrots, speed boosts)
- Save/restore last defeated enemy index to resume runs
- Audio: background music, attack and damage sfx

### Testing Tips

- Temporarily set `currentEnemy` to a later enemy to jump forward during dev
- Reduce attack cooldowns/damage values to verify defeat flow and progression

### Contact Points in Code

- Enemy sequencing: `src/game/GameState.ts`
- Player/camera/attacks: `src/game/characters/BunnyBase.tsx` and `src/game/combat/CollisionDetection.ts`
- World visuals: `src/game/World.tsx`
- Single source of truth for the active enemy: `src/game/GameScene.tsx`

---

This document is intended for AI-assisted contributions. Prefer small, well-scoped edits that respect the contracts and checklists above.
