import React from 'react'
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder, Scene, Mesh, ArcRotateCamera, Color3, StandardMaterial, AxesViewer, Axis, Path3D, Space, Nullable, Quaternion, PointerEventTypes, Tools, Vector4, Ray, RayHelper, LinesMesh, BoundingBoxGizmo, BoundingInfo, CannonJSPlugin } from "@babylonjs/core";
import SceneComponent from './SceneComponent';
import generateObjs from '@/utils/generate-scene-objects';
import { CIRCUIT_CONST, FormulaPlayer, PlayerState, SCENE_CONST } from '@/types/formula-click';
import trackSelector from '@/utils/generate-circuit';
import gameInit from '@/utils/init-game';
import { generateTravelPath, movePlayer } from '@/utils/player-mechanics';
// import * as CANNON from 'cannon';
// window.CANNON = CANNON;
function GameScene() {

    let localPlayer: Mesh;
    let remotePlayer: Mesh;
    let localPlayerData: PlayerState;
    let remotePlayerData: PlayerState;
    const onSceneReady = (scene: Scene) => {
        // let physicsPlugin = new CannonJSPlugin();
        // let gravityVector = new Vector3(0,-9.81, 0);
        // scene.enablePhysics(gravityVector, physicsPlugin);
        // This creates and positions a free camera (non-mesh)
        const { camera, light, localPlayerMesh, remotePlayerMesh, ground } = generateObjs(scene, FormulaPlayer.local);
        localPlayerData = gameInit.initPlayer(localPlayerMesh);
        remotePlayerData = gameInit.initPlayer(remotePlayerMesh); // fetch from socket
        localPlayer = localPlayerMesh;
        remotePlayer = remotePlayerMesh; // fetch from socket
        const { sponza } = trackSelector;
        const { innerTrack, outerTrack, trackPathPoints } = sponza(scene);
        scene.collisionsEnabled = true;
        const canvas = scene.getEngine().getRenderingCanvas();

        // This attaches the camera to the canvas. Handle here
        camera.attachControl(canvas, false);

        // axes = new AxesViewer(scene)
        // axes.scaleLines = 10


        /*----------------Position and Rotate Car at Start---------------------------*/
        let path3d = new Path3D(trackPathPoints);
        localPlayerData.normals = path3d.getNormals();
        localPlayerData.theta = Math.acos(Vector3.Dot(Axis.Z, localPlayerData.normals[0]));
        localPlayer.rotate(Axis.Y, localPlayerData.theta, Space.WORLD);
        localPlayerData.startRotation = localPlayer.rotationQuaternion;
        /*----------------End Position and Rotate Car at Start---------------------*/

        /*------------------------Handle pointer events---------------------------*/

        let cutLine: LinesMesh;
        scene.onPointerDown = function (evt, pickInfo, type) {

            localPlayerData.origin = localPlayer.position;
            let forward = new Vector3(pickInfo.pickedPoint?.x, SCENE_CONST.Y_POS, pickInfo.pickedPoint?.z)
            if (forward) {
                let direction = Vector3.Normalize(forward.subtract(localPlayerData.origin))

                let length = Vector3.Distance(localPlayerData.origin, forward)
                localPlayerData.end = localPlayerData.origin.add(direction.scale(length))

                // let ray = new Ray(origin, direction, length)
                // let rayHelper = new RayHelper(ray)
                cutLine = MeshBuilder.CreateLines(
                    "cutLine",
                    {
                        points: [localPlayerData.origin, localPlayerData.end],
                    },
                    scene
                );
                cutLine.color = Color3.Red()
                // rayHelper.show(scene)
                // console.log(forward, origin, length)
                // console.log("hit detected outer curve: ", cutLine.intersectsMesh(innerTrack))
                // console.log("hit detected inner curve: ", cutLine.intersectsMesh(outerTrack))
            }

        }

        scene.onPointerUp = function (evt, pickInfo, type) {
            cutLine?.dispose()
            localPlayerData.movementPoints.push(...generateTravelPath(localPlayerData));
        }
    }

    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
    const onRender = (scene: Scene) => {

        if (localPlayer !== undefined && localPlayerData != undefined && remotePlayer !== undefined && remotePlayerData != undefined) {
            const { updatedPlayer: updatedLocalPlayer, updatedPlayerData: updatedLocalPlayerData } = movePlayer(localPlayer, localPlayerData);
            const { updatedPlayer: updatedRemotePlayer, updatedPlayerData: updatedRemotePlayerData } = movePlayer(remotePlayer, remotePlayerData);
            localPlayer = updatedLocalPlayer;
            localPlayerData = updatedLocalPlayerData;
            remotePlayer = updatedRemotePlayer;
            remotePlayerData = updatedRemotePlayerData;
        }
    };
    return (
        <div className="hero min-h-screen xl:max-w-5xl xl:mx-auto">
            <div className="hero-content h-full w-full items-start">
                <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
            </div>
        </div>
    )
}

export default GameScene