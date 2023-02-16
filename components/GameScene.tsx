import React from 'react'
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder, Scene, Mesh, ArcRotateCamera, Color3, StandardMaterial, AxesViewer, Axis, Path3D, Space, Nullable, Quaternion, PointerEventTypes, Tools, Vector4, Ray, RayHelper, LinesMesh, BoundingBoxGizmo, BoundingInfo, CannonJSPlugin } from "@babylonjs/core";
import SceneComponent from './SceneComponent';
import generateObjs from '@/utils/generate-scene-objects';
import { CIRCUIT_CONST, FormulaPlayer, SCENE_CONST } from '@/types/formula-click';
import trackSelector from '@/utils/generate-circuit';
// import * as CANNON from 'cannon';
// window.CANNON = CANNON;
function GameScene() {
    
    let playerOne: Mesh;
    let playerTwo: Mesh;
    let i = 0;
    let movementPoints: Vector3[] = []
    let normals: Vector3[];
    let theta: number;
    let startRotation: Nullable<Quaternion>;
    let axes: AxesViewer;
    let origin: Vector3;
    let end: Vector3;
    const count = 10;
    const onSceneReady = (scene: Scene) => {
        // let physicsPlugin = new CannonJSPlugin();
        // let gravityVector = new Vector3(0,-9.81, 0);
        // scene.enablePhysics(gravityVector, physicsPlugin);
        // This creates and positions a free camera (non-mesh)
        const { camera, light, p1, p2, ground } = generateObjs(scene, FormulaPlayer.P1);
        playerOne = p1;
        playerTwo = p2;
        const { sponza } = trackSelector;
        const { innerTrack, outerTrack, trackPathPoints } = sponza(scene);
        scene.collisionsEnabled = true;
        const canvas = scene.getEngine().getRenderingCanvas();

        // This attaches the camera to the canvas. Handle here
        camera.attachControl(canvas, false);

        axes = new AxesViewer(scene)
        axes.scaleLines = 10


        /*----------------Position and Rotate Car at Start---------------------------*/
        let path3d = new Path3D(trackPathPoints);
        normals = path3d.getNormals();
        theta = Math.acos(Vector3.Dot(Axis.Z, normals[0]));
        playerOne.rotate(Axis.Y, theta, Space.WORLD);
        playerTwo.rotate(Axis.Y, theta, Space.WORLD);
        startRotation = playerOne.rotationQuaternion;
        /*----------------End Position and Rotate Car at Start---------------------*/

        /*------------------------Handle pointer events---------------------------*/
           
        let cutLine: LinesMesh;
        scene.onPointerDown = function (evt, pickInfo, type) {
           
            origin = playerOne.position;
            let forward = new Vector3(pickInfo.pickedPoint?.x, SCENE_CONST.Y_POS, pickInfo.pickedPoint?.z)
            if (forward) {
            let direction = Vector3.Normalize(forward.subtract(origin))
            
            let length = Vector3.Distance(origin, forward)
            end = origin.add(direction.scale(length))
            
            // let ray = new Ray(origin, direction, length)
            // let rayHelper = new RayHelper(ray)
            cutLine = MeshBuilder.CreateLines(
                "cutLine",
                {
                  points: [origin, origin.add(direction.scale(length))],
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
            for (let x = 0; x <= count; x++) {
                const factor = x / count;
                const point1 = Vector3.Lerp(origin, end, factor);
                movementPoints.push(point1);
              }
        }
    }

    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
    const onRender = (scene: Scene) => {

        if (
            playerOne !== undefined &&
            normals !== undefined &&
            theta !== undefined &&
            startRotation !== undefined &&
            movementPoints != undefined
        ) {
            if (i < (movementPoints.length - 1)) {
                playerOne.position.x = movementPoints[i].x;
                playerOne.position.z = movementPoints[i].z;
                theta = Math.acos(Vector3.Dot(normals[i], normals[i + 1]));
                let dir = Vector3.Cross(normals[i], normals[i + 1]).y;
                dir = dir / Math.abs(dir);
                playerOne.rotate(Axis.Y, dir * theta, Space.WORLD);
                // if (playerOne.intersectsMesh(innerTrack, true)) {
                //     console.log('intersect!')
                // }
                i = (i + 1) % (CIRCUIT_CONST.NUM_POINTS - 1);
            }

            //continuous looping  

            if (i == 0) {
                playerOne.rotationQuaternion = startRotation;
            }
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