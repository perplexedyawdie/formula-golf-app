import { CIRCUIT_CONST, FormulaClickScene, FormulaPlayer, SCENE_CONST } from "@/types/formula-click";
import { ArcRotateCamera, Color3, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";

export default function generateObjs(scene: Scene, player: FormulaPlayer): FormulaClickScene {
    const localPlayerMesh = MeshBuilder.CreatePlane("localPlayerMesh", { width: 2, height: 2 }, scene);
    const remotePlayerMesh = MeshBuilder.CreatePlane("remotePlayerMesh", { width: 2, height: 2 }, scene);
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    let camera: ArcRotateCamera;
    const ground = MeshBuilder.CreateGround("ground", { width: SCENE_CONST.GROUND_WIDTH, height: SCENE_CONST.GROUND_HEIGHT }, scene);


    switch (player) {
        case FormulaPlayer.local:
            camera = new ArcRotateCamera("Camera", 0, 0, 200, localPlayerMesh.position, scene);
            camera.setTarget(localPlayerMesh);
            break;
        case FormulaPlayer.remote:
            camera = new ArcRotateCamera("Camera", 0, 0, 200, remotePlayerMesh.position, scene);
            camera.setTarget(remotePlayerMesh);
            break;
        default:
            camera = new ArcRotateCamera("Camera", 0, 0, 200, localPlayerMesh.position, scene);
            camera.setTarget(localPlayerMesh);
            break;
    }
    localPlayerMesh.checkCollisions = true;
    remotePlayerMesh.checkCollisions = true;
    localPlayerMesh.position.y = SCENE_CONST.Y_POS;
    remotePlayerMesh.position.y = SCENE_CONST.Y_POS;
    localPlayerMesh.rotation.x = SCENE_CONST.PLAYER_X_ROTATION;
    remotePlayerMesh.rotation.x = SCENE_CONST.PLAYER_X_ROTATION;
    localPlayerMesh.position.z = CIRCUIT_CONST.P1_INITIAL_Z_POS;
    remotePlayerMesh.position.z = CIRCUIT_CONST.P2_INITIAL_Z_POS;
    localPlayerMesh.position.x = CIRCUIT_CONST.P1_INITIAL_X_POS;
    remotePlayerMesh.position.x = CIRCUIT_CONST.P2_INITIAL_X_POS;
    const p1Material = new StandardMaterial("material", scene);
    const p2Material = new StandardMaterial("material", scene);
    p1Material.diffuseColor = Color3.Red();
    p2Material.diffuseColor = Color3.Blue();

    localPlayerMesh.material = p1Material;
    remotePlayerMesh.material = p2Material;

    camera.checkCollisions = true;
    camera.alpha = SCENE_CONST.CAM_ALPHA;
    camera.beta = SCENE_CONST.CAM_BETA;
    camera.panningSensibility = SCENE_CONST.CAM_PANNING_SENSIBILITY;
    camera.upperBetaLimit = camera.beta;
    camera.lowerBetaLimit = camera.beta;
    camera.upperAlphaLimit = camera.alpha;
    camera.lowerAlphaLimit = camera.alpha;

    light.intensity = SCENE_CONST.LIGHT_INTENSITY;

    return {
        camera,
        light,
        localPlayerMesh,
        remotePlayerMesh,
        ground
    }
}

