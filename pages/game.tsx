import GameScene from "@/components/GameScene";
import dynamic from "next/dynamic";
// const GameScene = dynamic(() => import('@/components/GameScene'), {
//     ssr: false
//   })
function Game() {
    return (
        <GameScene />
    );
}

export default Game;