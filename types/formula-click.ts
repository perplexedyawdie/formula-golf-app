import { ArcRotateCamera, GroundMesh, HemisphericLight, LinesMesh, Mesh, Nullable, Quaternion, Vector3 } from "@babylonjs/core"

export interface PlayerState {
    i: number
    movementPoints: Vector3[]
    normals: Vector3[]
    theta: number
    startRotation: Nullable<Quaternion>
    origin: Vector3
    end: Vector3,
    currentLoc: Vector3
}

export interface Circuit {
    innerTrack: LinesMesh
    outerTrack: LinesMesh
    trackPathPoints: Vector3[]
}

export interface FormulaClickScene {
    camera: ArcRotateCamera
    light: HemisphericLight
    localPlayerMesh: Mesh
    remotePlayerMesh: Mesh
    ground: GroundMesh
}

export enum CIRCUIT_CONST {
    NUM_POINTS = 450,
    INNER_RADIUS = 45,
    OUTER_RADIUS = 55,
    PATH_RADIUS = 50,
    P1_INITIAL_Z_POS = 53,
    P2_INITIAL_Z_POS = 47,
    MOVEMENT_POINTS = 10
}

export enum FormulaPlayer {
    local = "LOCAL_PLAYER",
    remote = "REMOTE_PLAYER"
}

export enum SCENE_CONST {
    Y_POS = 0.5,
    CAM_ALPHA = Math.PI / 2,
    CAM_BETA = 0,
    LIGHT_INTENSITY = 0.4,
    CAM_PANNING_SENSIBILITY = 50,
    PLAYER_X_ROTATION = Math.PI / 2,
    GROUND_HEIGHT = 1000,
    GROUND_WIDTH = 1000
}
