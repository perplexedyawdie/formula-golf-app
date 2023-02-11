import { useEffect, useRef } from "react";
import { Engine, EngineOptions, Nullable, Scene, SceneOptions } from "@babylonjs/core";

export type BabylonjsProps = {
  antialias?: boolean
  engineOptions?: EngineOptions
  adaptToDeviceRatio?: boolean
  renderChildrenWhenReady?: boolean
  sceneOptions?: SceneOptions
  onSceneReady: (scene: Scene) => void
  /**
   * Automatically trigger engine resize when the canvas resizes (default: true)
   */
  observeCanvasResize?: boolean
  onRender?: (scene: Scene) => void
  children?: React.ReactNode
};

export default function SceneComponent({ antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, ...rest }: BabylonjsProps & React.CanvasHTMLAttributes<HTMLCanvasElement>) {
  const reactCanvas = useRef<Nullable<HTMLCanvasElement>>(null);

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
    const scene = new Scene(engine, sceneOptions);
    if (scene.isReady()) {
      onSceneReady(scene);
    } else {
      scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
    }

    engine.runRenderLoop(() => {
      if (typeof onRender === "function") onRender(scene);
      scene.render();
    });

    const resize = () => {
      scene.getEngine().resize();
    };

    if (window) {
      window.addEventListener("resize", resize);
    }

    return () => {
      scene.getEngine().dispose();

      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady]);

  return <canvas className="w-screen h-screen" ref={reactCanvas} {...rest} />;
};