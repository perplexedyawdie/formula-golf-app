import { ArcRotateCamera, GroundMesh, HemisphericLight, LinesMesh, Mesh, Vector3 } from "@babylonjs/core"

export interface Circuit {
    innerTrack: LinesMesh
    outerTrack: LinesMesh
    trackPathPoints: Vector3[]
}

export interface FormulaClickScene {
    camera: ArcRotateCamera
    light: HemisphericLight
    p1: Mesh
    p2: Mesh
    ground: GroundMesh
}

export enum CIRCUIT_CONST {
    NUM_POINTS = 450,
    INNER_RADIUS = 45,
    OUTER_RADIUS = 55,
    PATH_RADIUS = 50,
    P1_INITIAL_Z_POS = 53,
    P2_INITIAL_Z_POS = 47
}

export enum FormulaPlayer {
    P1 = "PLAYER_ONE",
    P2 = "PLAYER_TWO"
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