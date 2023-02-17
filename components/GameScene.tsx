import React, { useContext } from 'react'
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder, Scene, Mesh, ArcRotateCamera, Color3, StandardMaterial, AxesViewer, Axis, Path3D, Space, Nullable, Quaternion, PointerEventTypes, Tools, Vector4, Ray, RayHelper, LinesMesh, BoundingBoxGizmo, BoundingInfo, CannonJSPlugin } from "@babylonjs/core";
import SceneComponent from './SceneComponent';
import generateObjs from '@/utils/generate-scene-objects';
import { CircuitPoints, CIRCUIT_CONST, FormulaPlayer, PlayerState, SCENE_CONST } from '@/types/formula-click';
import trackSelector from '@/utils/generate-circuit';
import gameInit from '@/utils/init-game';
import { checkBoundaryCross, checkWinner, generateTravelPath, getTravelDistance, movePlayer } from '@/utils/player-mechanics';
import ColyseusContext from '@/context/ColyseusContext';
import { SocketMessages } from '@/utils/socket-messages.enum';
import { useRouter } from 'next/router';
import axios from 'axios';

// import * as CANNON from 'cannon';
// window.CANNON = CANNON;
let winner: boolean = false;
    let winnerIsLocal: boolean = false;
function GameScene() {

    let localPlayer: Mesh;
    let remotePlayer: Mesh;
    let localPlayerData: PlayerState;
    let remotePlayerData: PlayerState;
    let circuitData: CircuitPoints;
    let finishLine2: LinesMesh;
    const colyClient = useContext(ColyseusContext)
    const router = useRouter();
    const onSceneReady = (scene: Scene) => {
        // let physicsPlugin = new CannonJSPlugin();
        // let gravityVector = new Vector3(0,-9.81, 0);
        // scene.enablePhysics(gravityVector, physicsPlugin);
        // This creates and positions a free camera (non-mesh)
        
        const { camera, light, localPlayerMesh, remotePlayerMesh, ground } = generateObjs(scene, colyClient?.playerType.current || FormulaPlayer.local);
        localPlayerData = gameInit.initPlayer(localPlayerMesh);
        remotePlayerData = gameInit.initPlayer(remotePlayerMesh);
        localPlayer = localPlayerMesh;
        remotePlayer = remotePlayerMesh;
        const { sponza } = trackSelector;
        const { innerTrack, outerTrack, circuitPoints, finishLine } = sponza(scene);
        finishLine2 = finishLine;
        circuitData = circuitPoints;
        scene.collisionsEnabled = true;
        const canvas = scene.getEngine().getRenderingCanvas();
        console.log("context chech")
        console.log(colyClient)
        if (colyClient && colyClient.playerType.current === FormulaPlayer.remote) {
            console.log(colyClient.playerType.current)
            colyClient.playerTurn.current = false;
            innerTrack.color = Color3.Red();
        }
        // This attaches the camera to the canvas. Handle here
        camera.attachControl(canvas, false);

        // axes = new AxesViewer(scene)
        // axes.scaleLines = 10
        var bboxGizmo = new BoundingBoxGizmo(Color3.Green());
        bboxGizmo.attachedMesh = finishLine

        /*----------------Position and Rotate Car at Start---------------------------*/
        let path3d = new Path3D(circuitPoints.trackPathPoints);
        localPlayerData.normals = path3d.getNormals();
        localPlayerData.theta = Math.acos(Vector3.Dot(Axis.Z, localPlayerData.normals[0]));
        localPlayer.rotate(Axis.Y, localPlayerData.theta, Space.WORLD);
        localPlayerData.startRotation = localPlayer.rotationQuaternion;

        remotePlayerData.normals = path3d.getNormals();
        remotePlayerData.theta = Math.acos(Vector3.Dot(Axis.Z, remotePlayerData.normals[0]));
        remotePlayer.rotate(Axis.Y, remotePlayerData.theta, Space.WORLD);
        remotePlayerData.startRotation = remotePlayer.rotationQuaternion;
        /*----------------End Position and Rotate Car at Start---------------------*/

        /*------------------------Handle pointer events---------------------------*/

        let cutLine: LinesMesh;
        scene.onPointerDown = function (evt, pickInfo, type) {

            localPlayerData.origin = localPlayer.position;
            let forward = new Vector3(pickInfo.pickedPoint?.x, SCENE_CONST.Y_POS, pickInfo.pickedPoint?.z)
            // console.log(pickInfo.pickedPoint)
            if (forward && !winner) {
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
        if (colyClient) {
            colyClient.onRemotePlayerMsg.current.add((remotePlayerMsg) => {
                console.log("remote player message")
                console.log(remotePlayerMsg)
                // console.log(JSON.parse(remotePlayerMsg))
                if (remotePlayerMsg) {
                    let remotePlayerMovement: Vector3[] = [];
                    Array.from(JSON.parse(remotePlayerMsg) as { x: number, y: number, z: number }[]).forEach(({ x, y, z }) => {
                        remotePlayerMovement.push(new Vector3(x, y, z))
                    })
                    remotePlayerData.movementPoints.push(...remotePlayerMovement)
                }

            })
            colyClient.onPlayerTurnMsg.current.add((playerTurn) => {
                console.log("new turn: ", playerTurn)
                if (playerTurn !== undefined && playerTurn !== null) {
                    colyClient.playerTurn.current = playerTurn;
                    innerTrack.color = Color3.White();

                }
            })
            colyClient.onGameEndMsg.current.add((msg) => {
                scene.detachControl()
                if (winnerIsLocal) {
                    alert(`Game end! Congrats ${colyClient.userName}`)
                    axios.post('/api/save-highscores', {
                        "clicks": localPlayerData.clicks,
                        "distanceTravelled": localPlayerData.distanceTravelled,
                        "userName": colyClient.userName
                      }).catch((err) => console.error(err))
                } else {
                    alert(`Game end! Try again next time 😢`)
                }
                  colyClient.room?.leave(true)
                  router.push('/')
                //todo save game data
                //todo detach scene input
                //todo display message
            })
        }
        // scene.onPointerUp = function (evt, pickInfo, type) {
        //     cutLine?.dispose()
        //     if (!winner && colyClient && colyClient.playerTurn.current) {
        //         let travelPath = generateTravelPath(localPlayerData);
        //         let distance = getTravelDistance(travelPath[0], travelPath[travelPath.length - 1])
        //         colyClient.playerTurn.current = false
        //         innerTrack.color = Color3.Red();
        //         localPlayerData.distanceTravelled += distance;
        //         localPlayerData.clicks += 1;

        //         localPlayerData.movementPoints.push(...travelPath);
        //         let serializedTravelPath = JSON.stringify(travelPath.map(({ x, y, z }) => {
        //             return { x, y, z }
        //         }))
        //         if (colyClient && colyClient.room) {
        //             colyClient.room.send(SocketMessages.PLAYER_MOVED, { data: serializedTravelPath });
        //             colyClient.room.send(SocketMessages.YOUR_TURN, true)
        //         }
        //     }
        // }
        scene.onPointerUp = function (evt, pickInfo, type) {
            cutLine?.dispose()
            console.log("winner: ", winner)
            console.log("winner is local: ", winnerIsLocal)
                let travelPath = generateTravelPath(localPlayerData);
                let distance = getTravelDistance(travelPath[0], travelPath[travelPath.length - 1])
                
                localPlayerData.distanceTravelled += distance;
                localPlayerData.clicks += 1;

                localPlayerData.movementPoints.push(...travelPath);
                let serializedTravelPath = JSON.stringify(travelPath.map(({ x, y, z }) => {
                    return { x, y, z }
                }))
                if (colyClient && colyClient.room) {
                    colyClient.room.send(SocketMessages.PLAYER_MOVED, { data: serializedTravelPath });
                    colyClient.room.send(SocketMessages.YOUR_TURN, true)
                    if (winner) {
                        colyClient.room.send(SocketMessages.GAME_END, true)
                    }
                }
            
        }


    }

    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
    const onRender = (scene: Scene) => {

        if (localPlayer !== undefined && localPlayerData != undefined && remotePlayer !== undefined && remotePlayerData != undefined) {
            const { updatedPlayer: updatedLocalPlayer, updatedPlayerData: updatedLocalPlayerData } = movePlayer(localPlayer, localPlayerData, remotePlayer);
            const { updatedPlayer: updatedRemotePlayer, updatedPlayerData: updatedRemotePlayerData } = movePlayer(remotePlayer, remotePlayerData, localPlayer);
            localPlayer = updatedLocalPlayer;
            localPlayerData = updatedLocalPlayerData;
            remotePlayer = updatedRemotePlayer;
            remotePlayerData = updatedRemotePlayerData;
            if (!winner) {
                let { isLocal: isLocal1, winner: winner1 } = checkWinner(finishLine2, localPlayer, true);
                let { isLocal, winner: winner2 } = checkWinner(finishLine2, remotePlayer, false);
                if (winner1) {
                    winnerIsLocal = true
                    winner = true
                }

                if (winner2) {
                    winnerIsLocal = false
                    winner = true
                }
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