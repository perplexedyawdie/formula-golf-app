import { Circuit, CIRCUIT_CONST, SCENE_CONST } from "@/types/formula-click"
import { MeshBuilder, Scene, Vector3 } from "@babylonjs/core"

function sponza(scene: Scene): Circuit {
    let innerCurvePoints: Vector3[] = [];
    let outerCurvePoints: Vector3[] = [];
    let trackPathPoints: Vector3[] = [];

    for (let i = 0; i < CIRCUIT_CONST.NUM_POINTS + 1; i++) {
        innerCurvePoints.push(new Vector3(
            (CIRCUIT_CONST.INNER_RADIUS + (CIRCUIT_CONST.INNER_RADIUS / 5) * Math.sin(8 * i * Math.PI / CIRCUIT_CONST.NUM_POINTS)) * Math.sin(2 * i * Math.PI / CIRCUIT_CONST.NUM_POINTS),
            0,
            (CIRCUIT_CONST.INNER_RADIUS + (CIRCUIT_CONST.INNER_RADIUS / 10) * Math.sin(6 * i * Math.PI / CIRCUIT_CONST.NUM_POINTS)) * Math.cos(2 * i * Math.PI / CIRCUIT_CONST.NUM_POINTS)
        )
        );
    }

    for (let i = 0; i < CIRCUIT_CONST.NUM_POINTS + 1; i++) {
        outerCurvePoints.push(new Vector3(
            (CIRCUIT_CONST.OUTER_RADIUS + (CIRCUIT_CONST.OUTER_RADIUS / 5) * Math.sin(8 * i * Math.PI / CIRCUIT_CONST.NUM_POINTS)) * Math.sin(2 * i * Math.PI / CIRCUIT_CONST.NUM_POINTS),
            0,
            (CIRCUIT_CONST.OUTER_RADIUS + (CIRCUIT_CONST.OUTER_RADIUS / 10) * Math.sin(6 * i * Math.PI / CIRCUIT_CONST.NUM_POINTS)) * Math.cos(2 * i * Math.PI / CIRCUIT_CONST.NUM_POINTS)
        )
        );
    }

    for (let i = 0; i < CIRCUIT_CONST.NUM_POINTS + 1; i++) {
        trackPathPoints.push(new Vector3(
            (CIRCUIT_CONST.PATH_RADIUS + (CIRCUIT_CONST.PATH_RADIUS / 5) * Math.sin(8 * i * Math.PI / CIRCUIT_CONST.NUM_POINTS)) * Math.sin(2 * i * Math.PI / CIRCUIT_CONST.NUM_POINTS),
            0,
            (CIRCUIT_CONST.PATH_RADIUS + (CIRCUIT_CONST.PATH_RADIUS / 10) * Math.sin(6 * i * Math.PI / CIRCUIT_CONST.NUM_POINTS)) * Math.cos(2 * i * Math.PI / CIRCUIT_CONST.NUM_POINTS)
        )
        );
    }

    let innerTrack = MeshBuilder.CreateLines('innerTrack', { points: innerCurvePoints }, scene);
    let outerTrack = MeshBuilder.CreateLines('innerTrack', { points: outerCurvePoints }, scene);

    // Put tracks on the same height
    innerTrack.position.y = SCENE_CONST.Y_POS;
    outerTrack.position.y = SCENE_CONST.Y_POS;

    return {
        innerTrack,
        outerTrack,
        trackPathPoints
    }
}
const trackSelector = {
    sponza
}
export default trackSelector