import { CIRCUIT_CONST, FormulaPlayer, PlayerState } from "@/types/formula-click";
import { Mesh, Vector3, Axis, Space } from "@babylonjs/core";

export function movePlayer(player: Mesh, playerData: PlayerState): { updatedPlayer: Mesh, updatedPlayerData: PlayerState } {
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