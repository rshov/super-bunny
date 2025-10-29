import { Vector3 } from 'three'

export interface AttackResult {
  hit: boolean
  damage: number
  position: Vector3
}

export class CollisionDetection {
  static checkSphereCollision(
    center1: Vector3,
    radius1: number,
    center2: Vector3,
    radius2: number
  ): boolean {
    const distance = center1.distanceTo(center2)
    return distance < radius1 + radius2
  }

  static checkBoxCollision(
    pos1: Vector3,
    size1: Vector3,
    pos2: Vector3,
    size2: Vector3
  ): boolean {
    return (
      pos1.x - size1.x / 2 < pos2.x + size2.x / 2 &&
      pos1.x + size1.x / 2 > pos2.x - size2.x / 2 &&
      pos1.y - size1.y / 2 < pos2.y + size2.y / 2 &&
      pos1.y + size1.y / 2 > pos2.y - size2.y / 2 &&
      pos1.z - size1.z / 2 < pos2.z + size2.z / 2 &&
      pos1.z + size1.z / 2 > pos2.z - size2.z / 2
    )
  }

  static checkRaycastCollision(
    origin: Vector3,
    direction: Vector3,
    target: Vector3,
    targetRadius: number,
    maxDistance: number = 10
  ): boolean {
    const rayToTarget = target.clone().sub(origin)
    const distance = rayToTarget.length()
    
    if (distance > maxDistance) return false
    
    const normalizedDirection = direction.clone().normalize()
    const projectionLength = rayToTarget.dot(normalizedDirection)
    
    if (projectionLength < 0) return false
    
    const closestPoint = origin.clone().add(normalizedDirection.multiplyScalar(projectionLength))
    const distanceToTarget = closestPoint.distanceTo(target)
    
    return distanceToTarget <= targetRadius
  }
}

export class AttackSystem {
  static executeChefAttack(
    playerPos: Vector3,
    playerDirection: Vector3,
    enemyPos: Vector3
  ): AttackResult {
    const attackRange = 8
    const attackRadius = 1
    
    const hit = CollisionDetection.checkRaycastCollision(
      playerPos,
      playerDirection,
      enemyPos,
      attackRadius,
      attackRange
    )
    
    return {
      hit,
      damage: hit ? 25 : 0,
      position: enemyPos
    }
  }

  static executeQueenAttack(
    playerPos: Vector3,
    enemyPos: Vector3
  ): AttackResult {
    const minionRadius = 0.5
    const attackRange = 6
    
    // Simulate minion moving toward enemy
    const direction = enemyPos.clone().sub(playerPos).normalize()
    const minionPos = playerPos.clone().add(direction.multiplyScalar(attackRange))
    
    const hit = CollisionDetection.checkSphereCollision(
      minionPos,
      minionRadius,
      enemyPos,
      1
    )
    
    return {
      hit,
      damage: hit ? 20 : 0,
      position: minionPos
    }
  }

  static executeBallerinaAttack(
    playerPos: Vector3,
    enemyPos: Vector3,
    spinRadius: number = 3
  ): AttackResult {
    const hit = CollisionDetection.checkSphereCollision(
      playerPos,
      spinRadius,
      enemyPos,
      1
    )
    
    return {
      hit,
      damage: hit ? 30 : 0,
      position: playerPos
    }
  }
}
