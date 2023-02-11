import React from 'react'
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder, Scene, Mesh, ArcRotateCamera, Color3, StandardMaterial, AxesViewer, Axis, Path3D, Space, Nullable, Quaternion, PointerEventTypes } from "@babylonjs/core";
import SceneComponent from './SceneComponent';


function GameScene() {
    let rect: Mesh;
    let i = 0;
    let n = 450; // number of points
    let r = 50; //radius
    let r2 = 45;
    let r3 = 55;
    let points: Vector3[] = [];
    let points2: Vector3[] = [];
    let points3: Vector3[] = [];
    let movementPoints: Vector3[] = []
    let normals: Vector3[];
    let theta: number;
    let startRotation: Nullable<Quaternion>;

    const onSceneReady = (scene: Scene) => {
        // This creates and positions a free camera (non-mesh)
        const camera = new ArcRotateCamera("Camera", 0, 0, 200, new Vector3(0, 0, 0), scene);;

        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());

        camera.alpha = Math.PI / 2;
        camera.beta = 0;

        const canvas = scene.getEngine().getRenderingCanvas();

        // This attaches the camera to the canvas
        camera.attachControl(canvas, false);
        camera.panningSensibility = 50;
        // locks camera beta
        camera.upperBetaLimit = camera.beta;
        camera.lowerBetaLimit = camera.beta;
        camera.upperAlphaLimit = camera.alpha;
        camera.lowerAlphaLimit = camera.alpha;
        // disables camera input
        // camera.inputs.clear()
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        // Our built-in 'box' shape.
        // box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

        // Move the box upward 1/2 its height
        // box.position.y = 1;
        const material = new StandardMaterial("material", scene);
        material.diffuseColor = new Color3(1, 0, 0);
        rect = MeshBuilder.CreatePlane("rect", { width: 2, height: 2 }, scene);
        rect.position.y = 20;
        rect.rotation.x = Math.PI / 2;
        rect.material = material;

        // const axes = new AxesViewer(scene)

        /*-----------------------Path------------------------------------------*/

        // Create array of points to describe the curve

        for (let i = 0; i < n + 1; i++) {
            points.push(new Vector3((r + (r / 5) * Math.sin(8 * i * Math.PI / n)) * Math.sin(2 * i * Math.PI / n), 0, (r + (r / 10) * Math.sin(6 * i * Math.PI / n)) * Math.cos(2 * i * Math.PI / n)));
        }
        movementPoints = points.slice(0, 100)

        // Inner curve
        for (let i = 0; i < n + 1; i++) {
            points2.push(new Vector3((r2 + (r2 / 5) * Math.sin(8 * i * Math.PI / n)) * Math.sin(2 * i * Math.PI / n), 0, (r2 + (r2 / 10) * Math.sin(6 * i * Math.PI / n)) * Math.cos(2 * i * Math.PI / n)));
        }
        let track2 = MeshBuilder.CreateLines('track', { points: points2 }, scene);
        track2.color = new Color3(0, 0, 0);
        track2.position.y = 20;

        // Outer curve
        for (let i = 0; i < n + 1; i++) {
            points3.push(new Vector3((r3 + (r3 / 5) * Math.sin(8 * i * Math.PI / n)) * Math.sin(2 * i * Math.PI / n), 0, (r3 + (r3 / 10) * Math.sin(6 * i * Math.PI / n)) * Math.cos(2 * i * Math.PI / n)));
        }
        let track3 = MeshBuilder.CreateLines('track', { points: points3 }, scene);
        track3.color = new Color3(0, 0, 0);
        track3.position.y = 20;

        //Draw the curve
        let track = MeshBuilder.CreateLines('track', { points: points }, scene);
        track.color = new Color3(0, 0, 0);
        track.position.y = 20;

        /*-----------------------End Path------------------------------------------*/

        // Our built-in 'ground' shape.
        MeshBuilder.CreateGround("ground", { width: 10 * r3, height: 3 * r3 }, scene);

        /*----------------Position and Rotate Car at Start---------------------------*/
        rect.position.z = r;
        let path3d = new Path3D(points);
        normals = path3d.getNormals();
        theta = Math.acos(Vector3.Dot(Axis.Z, normals[0]));
        rect.rotate(Axis.Y, theta, Space.WORLD);
        startRotation = rect.rotationQuaternion;
        /*----------------End Position and Rotate Car at Start---------------------*/

        /*------------------------Handle pointer events---------------------------*/
        let isPointerDown = false;
        let currCoordY = 0
        let coordOffsetY = 0;
        scene.onPointerDown = function (evt, pickInfo, type) {
            currCoordY = evt.clientY;
            isPointerDown = true;
        }

        scene.onPointerUp = function (evt, pickInfo, type) {
            isPointerDown = false;
            currCoordY = 0;
            coordOffsetY = 0;
        }

        scene.onPointerMove = function (evt, pickInfo, type) {
            if (isPointerDown) {
                coordOffsetY = currCoordY - evt.clientY;
                console.log("pointer down move ", currCoordY, " ", (coordOffsetY * -1))
            }

        };
    }

    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
    const onRender = (scene: Scene) => {

        if (
            rect !== undefined &&
            points !== undefined &&
            normals !== undefined &&
            theta !== undefined &&
            startRotation !== undefined &&
            movementPoints != undefined
        ) {
            // console.log("mouse position: ",scene.pointerX, scene.pointerY)
            // const deltaTimeInMillis = scene.getEngine().getDeltaTime();
            // const rpm = 10;
            // box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
            if (i < (movementPoints.length - 1)) {
                rect.position.x = movementPoints[i].x;
                rect.position.z = movementPoints[i].z;
                theta = Math.acos(Vector3.Dot(normals[i], normals[i + 1]));
                let dir = Vector3.Cross(normals[i], normals[i + 1]).y;
                dir = dir / Math.abs(dir);
                rect.rotate(Axis.Y, dir * theta, Space.WORLD);

                i = (i + 1) % (n - 1);
            }
            // wheelFI.rotate(normals[i], Math.PI / 32, Space.WORLD);
            // wheelFO.rotate(normals[i], Math.PI / 32, Space.WORLD);
            // wheelRI.rotate(normals[i], Math.PI / 32, Space.WORLD);
            // wheelRO.rotate(normals[i], Math.PI / 32, Space.WORLD);

            //continuous looping  

            if (i == 0) {
                rect.rotationQuaternion = startRotation;
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