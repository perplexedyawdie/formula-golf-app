import { PlayerState } from "@/types/formula-click";
import { Mesh, Vector3 } from "@babylonjs/core";

function initPlayer(player: Mesh): PlayerState {
    return {
        i: 0,
        movementPoints: [],
        normals: [],
        theta: 0,
        startRotation: null,
        origin: new Vector3(0,0,0),
        end: new Vector3(0,0,0),
        currentLoc: player.position
    }
}

const gameInit = {
    initPlayer
}

export default gameInit