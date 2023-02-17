import { CIRCUIT_CONST, FormulaPlayer, PlayerState } from "@/types/formula-click";
import { Mesh, Vector3, Axis, Space, LinesMesh } from "@babylonjs/core";

export function movePlayer(player: Mesh, playerData: PlayerState, otherPlayer: Mesh): { updatedPlayer: Mesh, updatedPlayerData: PlayerState } {
    if (playerData.i < (playerData.movementPoints.length - 1)) {
        player.position.x = playerData.movementPoints[playerData.i].x;
        player.position.z = playerData.movementPoints[playerData.i].z;
        playerData.theta = Math.acos(Vector3.Dot(playerData.normals[playerData.i], playerData.normals[playerData.i + 1]));
        let dir = Vector3.Cross(playerData.normals[playerData.i], playerData.normals[playerData.i + 1]).y;
        dir = dir / Math.abs(dir);
        player.rotate(Axis.Y, dir * playerData.theta, Space.WORLD);
        // if (localPlayer.intersectsMesh(innerTrack, true)) {
        //     console.log('intersect!')
        // }
        playerData.i = (playerData.i + 1) % (CIRCUIT_CONST.NUM_POINTS - 1);
    }
    // if (checkPlayerCollision(player, otherPlayer)) {
    //     console.log('collided')
    //     playerData.movementPoints = playerData.movementPoints.slice(0, playerData.i - 1).reverse()
    // }

    //continuous looping  

    if (playerData.i == 0) {
        player.rotationQuaternion = playerData.startRotation;
    }

    return {
        updatedPlayer: player,
        updatedPlayerData: playerData
    }
}

export function generateTravelPath(playerData: PlayerState): Vector3[] {
    let movementPoints: Vector3[] = []
    for (let x = 0; x <= CIRCUIT_CONST.MOVEMENT_POINTS; x++) {
        const factor = x / CIRCUIT_CONST.MOVEMENT_POINTS;
        const point1 = Vector3.Lerp(playerData.origin, playerData.end, factor);
        movementPoints.push(point1);
    }
    return movementPoints;
}

function checkPlayerCollision(player: Mesh, otherPlayer: Mesh): boolean {
   return player.intersectsMesh(otherPlayer, true) 
}

export function checkWinner(finishLine: LinesMesh, player: Mesh, playerLocal: boolean): { winner: boolean, isLocal: boolean } {
    let winner: boolean = false;

    // finishLinePoints.forEach(point => {
        if (player.intersectsMesh(finishLine)) {
            console.log('winner')
            winner = true;
        } else {
            console.log('no winner')
            winner = false;
        }
    // });
    return {
        winner: winner,
        isLocal: playerLocal
    };
}

export function checkBoundaryCross(innerTrackPoints: Vector3[], outerTrackPoints: Vector3[], player: Mesh): { innerHit: boolean, outerHit: boolean } {
    let innerHit = false;
    let outerHit = false;
    innerTrackPoints.forEach(point => {
        if (player.intersectsPoint(point)) {
            console.log("hit true")
            innerHit = true;
        } else {
            // console.log("hit false")

            innerHit = false;
        }
    });
    outerTrackPoints.forEach(point => {
        if (player.intersectsPoint(point)) {
            outerHit = true;
        } else {
            outerHit = false;
        }
    });

    return {
        innerHit,
        outerHit
    }
}

export function getTravelDistance(origin: Vector3, destination: Vector3): number {
    return Vector3.Distance(origin, destination);
}