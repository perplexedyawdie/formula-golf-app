import { CIRCUIT_CONST, FormulaClickScene, FormulaPlayer, SCENE_CONST } from "@/types/formula-click";
import { ArcRotateCamera, Color3, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";

export default function generateObjs(scene: Scene, player: FormulaPlayer): FormulaClickScene {
    const p1 = MeshBuilder.CreatePlane("p1", { width: 2, height: 2 }, scene);
    const p2 = MeshBuilder.CreatePlane("p2", { width: 2, height: 2 }, scene);
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    let camera: ArcRotateCamera;
    const ground = MeshBuilder.CreateGround("ground", { width: SCENE_CONST.GROUND_WIDTH, height: SCENE_CONST.GROUND_HEIGHT }, scene);


    switch (player) {
        case FormulaPlayer.P1:
            camera = new ArcRotateCamera("Camera", 0, 0, 200, p1.position, scene);
            camera.setTarget(p1);
            break;
        case FormulaPlayer.P2:
            camera = new ArcRotateCamera("Camera", 0, 0, 200, p2.position, scene);
            camera.setTarget(p2);
            break;
        default:
            camera = new ArcRotateCamera("Camera", 0, 0, 200, p1.position, scene);
            camera.setTarget(p1);
            break;
    }
    p1.checkCollisions = true;
    p2.checkCollisions = true;
    p1.position.y = SCENE_CONST.Y_POS;
    p2.position.y = SCENE_CONST.Y_POS;
    p1.rotation.x = SCENE_CONST.PLAYER_X_ROTATION;
    p2.rotation.x = SCENE_CONST.PLAYER_X_ROTATION;
    p1.position.z = CIRCUIT_CONST.P1_INITIAL_Z_POS;
    p2.position.z = CIRCUIT_CONST.P2_INITIAL_Z_POS;
    const p1Material = new StandardMaterial("material", scene);
    const p2Material = new StandardMaterial("material", scene);
    p1Material.diffuseColor = Color3.Red();
    p2Material.diffuseColor = Color3.Blue();

    p1.material = p1Material;
    p2.material = p2Material;

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
        p1,
        p2,
        ground
    }
}

